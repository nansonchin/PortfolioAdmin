// scripts/seed-translations.ts
//
// 一次性：把 scripts/seed-data/zh.ts 的翻译写进 project_translations 表。
// 用法：npm run seed:translations
//       npm run seed:translations -- --force   （已有翻译时覆盖）

import { createClient } from "@supabase/supabase-js";
import { projectsZh } from "./seed-data/zh";

async function main() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const force = process.argv.includes("--force");

  if (!url || !secretKey) {
    throw new Error("缺少 SUPABASE_URL 或 SUPABASE_SECRET_KEY（检查 .env.local）");
  }

  const supabase = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ① 旧资料的 key 是 slug，数据库要的是项目 id，先查出「slug → id」的对照
  //
  //    转换对照：
  //      projectsZh（作品集的写法，key 是 slug）：
  //        { "manga-reader": { summary: "..." } }
  //      查出的项目：[ { id: "manga-reader", slug: "manga-reader" } ]
  //      要写进数据库的 rows（key 变成 project_id）：
  //        [ { project_id: "manga-reader", lang: "zh", data: { summary: "..." } } ]
  const slugs = Object.keys(projectsZh);

  const { data: projectRows, error: projectError } = await supabase
    .from("projects")
    .select("id, slug")
    .in("slug", slugs);

  if (projectError) throw new Error(`读取项目失败：${projectError.message}`);

  const idBySlug = new Map(projectRows.map((row) => [row.slug as string, row.id as string]));

  // ② 已经有翻译的，默认不覆盖。理由同 Step 2 的 seed：
  //    日后你在后台改过翻译，再跑一次不该把它洗掉
  const { data: existingRows, error: existingError } = await supabase
    .from("project_translations")
    .select("project_id")
    .eq("lang", "zh");

  if (existingError) throw new Error(`读取翻译失败：${existingError.message}`);

  const existingIds = new Set(existingRows.map((row) => row.project_id as string));

  // ③ 组成要写入的 rows
  const rows: { project_id: string; lang: "zh"; data: unknown }[] = [];

  for (const [slug, translation] of Object.entries(projectsZh)) {
    const projectId = idBySlug.get(slug);

    if (!projectId) {
      console.log(`⚠️  数据库里找不到 slug 为 "${slug}" 的项目，略过`);
      continue;
    }

    if (existingIds.has(projectId) && !force) {
      console.log(`ℹ️  "${slug}" 已经有翻译，略过（要覆盖请加 --force）`);
      continue;
    }

    rows.push({ project_id: projectId, lang: "zh", data: translation });
  }

  if (rows.length === 0) {
    console.log("没有需要写入的翻译。");
    return;
  }

  const { error } = await supabase
    .from("project_translations")
    .upsert(rows, { onConflict: "project_id,lang" });

  if (error) throw new Error(`写入失败：${error.message}`);

  console.log(`✅ 已写入 ${rows.length} 个项目的中文翻译：`);
  console.table(rows.map((row) => ({ project_id: row.project_id, lang: row.lang })));
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});