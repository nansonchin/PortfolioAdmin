// scripts/s3-migrate.ts
//
// 把「数据库里真的有引用」的图片，从旧的储存服务（SRC_S3_*）复制到新的（S3_*）。
// 用法：npm run s3:migrate -- --dry-run     （只看会搬什么，不动任何东西）
//       npm run s3:migrate                  （真的搬）
//
// Senior reasoning — 为什么「只搬有被引用的」，不是把整个 bucket 复制过去？
// 开发过程中你上传过很多测试图、被换掉的旧图，它们已经没人用了（孤儿文件）。
// 全部复制，等于把垃圾也搬到新家，还占用 Supabase 免费的 1 GB。
// 以数据库的引用为准：有被引用的搬，没被引用的只列出来，让你知道。

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { isStorageKey } from "../src/lib/imageRef";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";

/** 把 SRC_S3_* 当成 S3_* 读取，这样可以重用同一个 readS3Config */
function sourceEnv() {
  const env = {
    ...process.env,
    S3_ENDPOINT: process.env.SRC_S3_ENDPOINT,
    S3_REGION: process.env.SRC_S3_REGION,
    S3_BUCKET: process.env.SRC_S3_BUCKET,
    S3_SNAPSHOT_BUCKET: "unused",
    S3_ACCESS_KEY_ID: process.env.SRC_S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.SRC_S3_SECRET_ACCESS_KEY,
    S3_FORCE_PATH_STYLE: process.env.SRC_S3_FORCE_PATH_STYLE,
  };
  return env;
}

/** 列出 bucket 里 projects/ 底下所有物件的 key（S3 一次最多回 1000 个，要分页） */
async function listKeys(
  client: S3Client,
  bucket: string,
): Promise<Set<string>> {
  const keys = new Set<string>();
  let token: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: "projects/",
        ContinuationToken: token,
      }),
    );

    for (const object of page.Contents ?? []) {
      if (object.Key) keys.add(object.Key);
    }

    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);

  return keys;
}

type ProjectImageRow = {
  thumbnail: string;
  hero_image: { src?: string } | null;
  gallery: { imageUrl?: string }[] | null;
};

async function main() {
  loadEnv();

  const dryRun = process.argv.includes("--dry-run");

  console.log("SRC_S3_ENDPOINT =", process.env.SRC_S3_ENDPOINT);
console.log("S3_ENDPOINT =", process.env.S3_ENDPOINT);

  const source = readS3Config(sourceEnv());
  const target = readS3Config();

  console.log("source: ",source);



  if (source.endpoint === target.endpoint && source.bucket === target.bucket) {
    throw new Error(
      "来源和目标是同一个 bucket，已停止（检查 SRC_S3_* 和 S3_*）",
    );
  }

  const from = createS3Client(source);
  const to = createS3Client(target);

  console.log("来源：", source.endpoint, "/", source.bucket);
  console.log("目标：", target.endpoint, "/", target.bucket);
  console.log();

  // ① 数据库里有哪些 key 被引用
  //
  //   转换对照：
  //     数据库的一行：{ thumbnail: "projects/a/thumbnail/1.png",
  //                    hero_image: { src: "projects/a/hero/2.png" },
  //                    gallery: [{ imageUrl: "projects/a/gallery/3.jpg" }, { imageUrl: "/images/old.webp" }] }
  //     挑出「是我们上传的 key」的（旧路径 /images/... 不是，不用搬）：
  //       Set { "projects/a/thumbnail/1.png", "projects/a/hero/2.png", "projects/a/gallery/3.jpg" }
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseKey)
    throw new Error("缺少 SUPABASE_URL 或 SUPABASE_SECRET_KEY");

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("projects")
    .select("thumbnail, hero_image, gallery")
    .returns<ProjectImageRow[]>();

  if (error) throw new Error(`读取项目失败：${error.message}`);

  const referenced = new Set<string>();
  for (const row of data) {
    const values = [
      row.thumbnail,
      row.hero_image?.src ?? "",
      ...(row.gallery ?? []).map((g) => g.imageUrl ?? ""),
    ];
    for (const value of values) {
      if (isStorageKey(value)) referenced.add(value);
    }
  }

  // ② 来源 bucket 里实际有哪些文件
  const existing = await listKeys(from, source.bucket);

  const toCopy = [...referenced].filter((key) => existing.has(key));
  const missing = [...referenced].filter((key) => !existing.has(key));
  const orphans = [...existing].filter(
    (key) => !referenced.has(key) && !key.startsWith("projects/_check/"),
  );

  console.table([
    { 项目: "数据库引用的图片", 数量: referenced.size },
    { 项目: "→ 会搬", 数量: toCopy.length },
    { 项目: "→ 引用了但来源里找不到（会破图）", 数量: missing.length },
    { 项目: "来源里没人引用（孤儿，不搬）", 数量: orphans.length },
  ]);

  if (missing.length > 0) console.log("找不到的：", missing);
  if (orphans.length > 0)
    console.log("孤儿（前 10 个）：", orphans.slice(0, 10));

  if (dryRun) {
    console.log("\n（--dry-run：没有复制任何东西）");
    return;
  }

  // ③ 复制：读出来，再写到目标。同一个 key，同样的内容型别。
  //    每张图的 key 里有 uuid，内容不会变（要换图就是新 key），
  //    所以可以安心设成「永久缓存、不可变」。
  let copied = 0;
  const failed: string[] = [];

  for (const key of toCopy) {
    try {
      const object = await from.send(
        new GetObjectCommand({ Bucket: source.bucket, Key: key }),
      );
      if (!object.Body) throw new Error("没有内容");

      const bytes = await object.Body.transformToByteArray();

      await to.send(
        new PutObjectCommand({
          Bucket: target.bucket,
          Key: key,
          Body: bytes,
          ContentType: object.ContentType ?? "application/octet-stream",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      copied += 1;
      console.log(`✅ ${key}`);
    } catch (caught) {
      failed.push(key);
      console.log(
        `❌ ${key} — ${caught instanceof Error ? caught.message : caught}`,
      );
    }
  }

  // ④ 复查：目标里现在有哪些
  const arrived = await listKeys(to, target.bucket);
  const stillMissing = toCopy.filter((key) => !arrived.has(key));

  console.log(`\n已复制 ${copied} / ${toCopy.length}，失败 ${failed.length}`);
  console.log(
    stillMissing.length === 0
      ? "✅ 目标里每一张都在了"
      : `⚠️ 目标里还缺：${stillMissing}`,
  );
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
