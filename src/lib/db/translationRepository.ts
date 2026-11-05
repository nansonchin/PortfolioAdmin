import { Language, ProjectTranslation } from "@/types/translation";
import { getSupabase } from "./supabase";

type TranslationRow ={
    project_id:string;
    data:ProjectTranslation
}

export async function  listTranslation(
    lang:Language
):Promise<Record<string,ProjectTranslation>>{
    const {data,error} = await getSupabase().from("project_translations").select("project_id,data").eq("lang",lang).returns<TranslationRow[]>()

    if(error){
        throw new Error(`Failed to translate : ${error.message}`)
    }
    return Object.fromEntries(data.map((row)=>[row.project_id,row.data]))
}

