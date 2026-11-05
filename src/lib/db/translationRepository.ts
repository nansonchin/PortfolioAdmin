import { getSupabase } from "./supabase";
import type { Language, ProjectTranslation } from "@/types/translation";

type TranslationRow = {
  project_id: string;
  data: ProjectTranslation;
};

export async function listTranslations(
  lang: Language,
): Promise<Record<string, ProjectTranslation>> {
  const { data, error } = await getSupabase()
    .from("project_translations")
    .select("project_id, data")
    .eq("lang", lang)
    .returns<TranslationRow[]>();

  if (error) {
    throw new Error(`Failed to read：${error.message}`);
  }

  return Object.fromEntries(data.map((row) => [row.project_id, row.data]));
}

export async function getTranslation(
  projectId:string,
  lang:Language,
):Promise<ProjectTranslation|undefined>{
    const { data, error } = await getSupabase()
    .from("project_translations")
    .select("data")
    .eq("project_id", projectId)
    .eq("lang", lang)
    .maybeSingle<{ data: ProjectTranslation }>();

      if (error) {
    throw new Error(`Failed to read Translation：${error.message}`);
    
  }
  return data?.data;
}