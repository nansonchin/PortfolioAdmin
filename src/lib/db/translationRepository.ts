import { AdminProject } from "@/types/project";
import { getSupabase } from "./supabase";
import type { Language, ProjectTranslation } from "@/types/translation";
import { getProjectById } from "./projectRepository";

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

async function saveTranslation(
  projectId:string,
  lang:Language,
  translation:ProjectTranslation
):Promise<void>{
  const supabase = getSupabase()

  if(Object.keys(translation).length===0){
    const {error}= await supabase.from("project_translations").delete().eq("project_id",projectId).eq("lang",lang)

    if(error){
      throw new Error (`Failed to clear the translation : ${error.message}`)
    }
  }
  const {error} =await supabase.from("project_translations").upsert({project_id:projectId,lang,data:translation},{ onConflict: "project_id,lang" });
  if(error){
    throw new Error(` failed to save translation: ${error.message}`)
  }
}

export async function updateProjectTranslation(
  projectId:string,
  lang:Language,
  translation:ProjectTranslation
):Promise<{project:AdminProject; translation:ProjectTranslation}|null>{
  const project =await getProjectById(projectId);
  if(!project){
    return null;
  }

  await saveTranslation(projectId,lang,translation)

  return{project,translation}
}
