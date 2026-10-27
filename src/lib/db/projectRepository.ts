import { AdminProject } from "@/types/project";
import { getSupabase } from "./supabase";
import { ProjectRow, rowToProject } from "./projectMapper";

export async function listProjects():Promise<AdminProject[]>{
    const {data,error} = await getSupabase().from("projects").select("*").order("sort_order",{ascending:true}).returns<ProjectRow[]>()
    if(error){
        throw new Error(`Failed to read thedata : ${error.message}`)
    }

    return data.map(rowToProject);
}