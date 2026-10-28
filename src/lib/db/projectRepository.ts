import { AdminProject, ProjectFlagsPatch } from "@/types/project";
import { getSupabase } from "./supabase";
import { ProjectRow, rowToProject } from "./projectMapper";

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