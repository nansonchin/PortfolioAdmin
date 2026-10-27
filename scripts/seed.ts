import { createClient } from "@supabase/supabase-js";
import { projects } from "./seed-data/data/project";
import { AdminProject } from "@/types/project";
import { projectToRow } from "@/lib/db/projectMapper";

async function main() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const force = process.argv.includes("--force");

  if (!url || !secretKey) {
    throw new Error(
      "Lacking SUPABASE_URL or SUPABASE_SECRET_KEY (Kindly check the .env.local) ",
    );
  }

  const supabase = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { count, error: countError } = await supabase
    .from("projects")
    .select("*", {
      count: "exact",
      head: true,
    });

  if ((count ?? 0) > 0 && !force) {
    console.log(`Projects list already have ${count}. Stopped.`);
    console.log("if wish to overwrite kindly type as: npm run seed -- --force");
    return;
  }

  for (const project of projects) {
    if (project.id !== project.slug) {
      console.log(
        `(i) id and slug is not match: id="${project.id}" slug="${project.slug}"`,
      );
    }
  }

  const adminProjects: AdminProject[] = projects.map((project, index) => ({
    ...project,
    status: "published",
    sortOrder: index,
  }));

  const rows = adminProjects.map(projectToRow);

  console.log({
    id: rows[0].id,
    github_url: rows[0].github_url,
    demo_url: rows[0].demo_url,
    sort_order: rows[0].sort_order,
    status: rows[0].status,
  });

  const { data, error } = await supabase
    .from("projects")
    .upsert(rows, { onConflict: "id" })
    .select("id, slug, sort_order");

  if (error) {
    throw new Error(`Failed to write in : ${error.message}`);
  }

  console.log(`\n✅ Already Written ${data.length} projects：`);
  console.table(data);
}

main().catch((err)=>{
    console.error("X", err.message);
    process.exit(1)
})
