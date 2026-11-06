import { createClient } from "@supabase/supabase-js";
import { developerContext, developerContextZh, profile, profileZh } from "./seed-data/data/site";
import { loadEnv } from "../lib/env/loadEnv";


type Row = {
  key: "profile" | "developer_context";
  lang: "en" | "zh";
  data: unknown;
};


loadEnv();

async function main() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const force = process.argv.includes("--force");

  if (!url || !secretKey) {
    throw new Error(
      "Lack of SUPABASE_URL or SUPABASE_SECRET_KEY, Please kindly check your .env.local",
    );
  }

  const supabase = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: existingRows, error: existingError } = await supabase
    .from("site_content")
    .select("key, lang");

  if (existingError)
    throw new Error(` Failed to read: ${existingError.message}`);

  const exists = new Set(existingRows.map((row) => `${row.key}:${row.lang}`));

  const candidates: Row[] = [
    { key: "profile", lang: "en", data: profile },
    { key: "profile", lang: "zh", data: profileZh },
    { key: "developer_context", lang: "en", data: developerContext },
    { key: "developer_context", lang: "zh", data: developerContextZh },
  ];

    const rows = candidates.filter((row) => {
    if (exists.has(`${row.key}:${row.lang}`) && !force) {
      console.log(`ℹ️  ${row.key} (${row.lang})Already havve, If wish to overwrite please kindly input --force）`);
      return false;
    }
    return true;
  });

    if (rows.length === 0) {
    console.log("Theres nothing need  to be write in");
    return;
  }

  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key,lang" });

  if (error) throw new Error(`Failed to write in：${error.message}`);

  console.log(`✅ Already write in total of  ${rows.length} data：`);
  console.table(rows.map((row) => ({ key: row.key, lang: row.lang })));
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});