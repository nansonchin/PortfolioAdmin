import { AdminProject, ProjectBasic, ProjectFlagsPatch } from "@/types/project";
import { getSupabase } from "./supabase";
import { basicToRowPatch, ProjectRow, rowToProject } from "./projectMapper";

export async function listProjects():Promise<AdminProject[]>{
    const {data,error} = await getSupabase().from("projects").select("*").order("sort_order",{ascending:true}).returns<ProjectRow[]>()
    if(error){
        throw new Error(`Failed to read thedata : ${error.message}`)
    }

    return data.map(rowToProject);
}

export async function updateProjectFlags(
    id:string,
    patch:ProjectFlagsPatch
):Promise<AdminProject|null>{
    const {data, error} = await getSupabase().from("projects").update(patch).eq("id",id).select("*").maybeSingle<ProjectRow>()

    if(error){
        throw new Error(`Failed Patching the project : ${error.message}`)
    }

    return data? rowToProject(data):null;
}

export async function getProjectById(id:string):Promise<AdminProject|null>{
    const {data,error} = await getSupabase().from("projects").select("*").eq("id",id).maybeSingle<ProjectRow>()

    if(error){
        throw new Error("Failed to read the project : ${error.message}")
    }

    return data ? rowToProject(data):null

}

export class DuplicateSlugError extends  Error{
    constructor(){
        super("Slug already in use")
        this.name="DuplicateSlugError"
    }
}

export async function updateProjectBasic(
  id: string,
  input: ProjectBasic,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(basicToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    if (error.code === "23505") throw new DuplicateSlugError();
    throw new Error(`Failed to save single project：${error.message}`);
  }

  return data ? rowToProject(data) : null;
}