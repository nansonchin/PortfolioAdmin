// scripts/s3-verify-remote.ts
//
// 验证「现在 .env.local 指向的储存服务」符合我们的需求。
// 用法：npm run s3:verify-remote
//
// 测试文件都放在 projects/_check/ 和 _check.json，测完会删掉。

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";

// 一张 1x1 的 PNG（67 个 byte）
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

type Result = { 测试: string; 预期: string; 实际: string };

async function main() {
    loadEnv()
  const config = readS3Config();
  const client = createS3Client(config);

  const publicBase = (process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
  const snapshotUrl = process.env.SNAPSHOT_PUBLIC_URL ?? "";

  if (!publicBase || !snapshotUrl) {
    throw new Error("缺少 NEXT_PUBLIC_S3_PUBLIC_BASE_URL 或 SNAPSHOT_PUBLIC_URL（检查 .env.local）");
  }

  console.log("连线目标：", config.endpoint);
  console.log("区域：    ", config.region);
  console.log("图片桶：  ", config.bucket, "  快照桶：", config.snapshotBucket);
  console.log();

  const stamp = Date.now();
  const results: Result[] = [];
  const mediaKeys: string[] = [];

  /** 跑一项测试：成功返回字串，丢错误就记录成 ❌，不让一项失败中断整个流程 */
  async function attempt(test: string, expected: string, run: () => Promise<string>) {
    try {
      results.push({ 测试: test, 预期: expected, 实际: await run() });
    } catch (error) {
      const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      results.push({ 测试: test, 预期: expected, 实际: `❌ ${message}` });
    }
  }

  // 简化「签一条上传网址」（和 src/lib/storage/presign.ts 做的事一样）
  async function presignPng(key: string, size: number): Promise<string> {
    return getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: "image/png",
        ContentLength: size,
      }),
      { expiresIn: 60, signableHeaders: new Set(["content-type", "content-length"]) },
    );
  }

  // ① 用 S3 金钥上传一张图
  const imageKey = `projects/_check/${stamp}.png`;
  mediaKeys.push(imageKey);
  await attempt("① 用 S3 金钥上传 PNG", "成功", async () => {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: imageKey,
        Body: PNG,
        ContentType: "image/png",
      }),
    );
    return "成功";
  });

  // ② 没有任何签名，用公开网址读取（模拟网站访客）
  await attempt("② 公开网址读取", "200 image/png", async () => {
    const response = await fetch(`${publicBase}/${imageKey}`);
    return `${response.status} ${response.headers.get("content-type")}`;
  });

  // ③ 图片桶设了「只收图片」，上传文字档应该被拒绝
  const textKey = `projects/_check/${stamp}.txt`;
  mediaKeys.push(textKey);
  await attempt("③ 图片桶收文字档", "被拒绝", async () => {
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: textKey,
          Body: "hello",
          ContentType: "text/plain",
        }),
      );
      return "被接受（类型限制没生效）";
    } catch (error) {
      return `被拒绝（${(error as { name?: string }).name ?? "error"}）`;
    }
  });

  // ④ presigned PUT：宣告和实际一致，应该成功
  const okKey = `projects/_check/${stamp}-presigned.png`;
  mediaKeys.push(okKey);
  await attempt("④ presigned PUT（长度正确）", "200", async () => {
    const url = await presignPng(okKey, PNG.length);
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: PNG,
    });
    return String(response.status);
  });

  // ⑤ presigned PUT：签的是 67 byte，却送更长的内容，签名绑定了长度，应该被拒绝
  const badKey = `projects/_check/${stamp}-bad.png`;
  mediaKeys.push(badKey);
  await attempt("⑤ presigned PUT（长度不符）", "403", async () => {
    const url = await presignPng(badKey, PNG.length);
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: Buffer.concat([PNG, Buffer.from(" extra bytes")]),
    });
    return String(response.status);
  });

  // ⑥ 快照桶：上传 JSON，并用公开网址读取
  const jsonUrl = new URL("_check.json", snapshotUrl).toString();
  await attempt("⑥ 快照桶上传 JSON", "成功", async () => {
    await client.send(
      new PutObjectCommand({
        Bucket: config.snapshotBucket,
        Key: "_check.json",
        Body: JSON.stringify({ ok: true }),
        ContentType: "application/json; charset=utf-8",
        CacheControl: "public, max-age=60",
      }),
    );
    return "成功";
  });

  await attempt("⑥ 快照公开读取", "200 application/json", async () => {
    const response = await fetch(`${jsonUrl}?t=${stamp}`);
    return `${response.status} ${response.headers.get("content-type")}`;
  });

  await attempt("⑥ 快照的 Cache-Control", "public, max-age=60", async () => {
    const response = await fetch(`${jsonUrl}?t=${stamp}`);
    return response.headers.get("cache-control") ?? "（没有这个标头）";
  });

  // 清理：测试文件不要留着
  for (const key of mediaKeys) {
    await client
      .send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
      .catch(() => undefined);
  }
  await client
    .send(new DeleteObjectCommand({ Bucket: config.snapshotBucket, Key: "_check.json" }))
    .catch(() => undefined);

  console.table(results);
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});