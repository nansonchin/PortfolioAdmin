import { createClient } from "@supabase/supabase-js";
import { projectsZh } from "./seed-data/zh";

async function main() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const force = process.argv.includes("--force");

  if (!url || !secretKey) {
    throw new Error(
      'Lack of the key "SUPABASE_URL" or "SUPABASE_SECRET_KEY, Please check your env.local',
    );
  }

  const supabase = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const slugs = Object.keys(projectsZh);

  const { data: projectRows, error: projectError } = await supabase
    .from("projects")
    .select("id, slug")
    .in("slug", slugs);

  if (projectError) throw new Error(`Failed to read translation：${projectError.message}`);

  const idBySlug = new Map(projectRows.map((row) => [row.slug as string, row.id as string]));


  const { data: existingRows, error: existingError } = await supabase
    .from("project_translations")
    .select("project_id")
    .eq("lang", "zh");

  if (existingError) {
    throw new Error(`Failed to read translation : ${existingError.message}`);
  }

  const existingIds = new Set(
    existingRows.map((row) => row.project_id as string),
  );

  const rows: { project_id: string; lang: "zh"; data: unknown }[] = [];

  for (const [slug, translation] of Object.entries(projectsZh)) {
    const projectId = idBySlug.get(slug);

    if (!projectId) {
      console.log(` Database is unable to find slug as "${slug}", Skip`);
      continue;
    }

    if (existingIds.has(projectId) && !force) {
      console.log(
        ` ℹ️ "${slug}" already translated, skip, (if wanna overwrite please use --force)`,
      );
      continue;
    }

    rows.push({ project_id: projectId, lang: "zh", data: translation });
  }

  if (rows.length === 0) {
    console.log("Theres nothing to be write as Translation");
    return;
  }

  const {error} = await supabase.from("project_translations").upsert(rows,{onConflict:"project_id,lang"})
 if (error) throw new Error(`Failed to write：${error.message}`);
  console.log(`✅ Already write in ${rows.length} as 'Zh' Translation`)
  console.table(rows.map((row)=>({project_id:row.project_id, lang:row.lang})))
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});