import { DeveloperContext, DeveloperContextTranslation, Profile, ProfileTranslation, SiteRows } from "@/types/site";
import { getSupabase } from "./supabase";

type SiteRow = {
  key: "profile" | "developer_context";
  lang: "en" | "zh";
  data: unknown;
};

export async function listSiteRows(): Promise<SiteRows>{
    const{data,error}=await getSupabase().from("site_content").select("key,lang,data").returns<SiteRow[]>();

    if(error){
        throw new Error(`Failed to read Site Context :${error.message}`)
    }

     const find =<T>(key:SiteRow["key"],lang:SiteRow["lang"]):T|undefined=>
        data.find((row)=> row.key === key && row.lang ===lang)?.data as T|undefined

  return {
    profile: find<Profile>("profile", "en"),
    developerContext: find<DeveloperContext>("developer_context", "en"),
    profileZh: find<ProfileTranslation>("profile", "zh"),
    developerContextZh: find<DeveloperContextTranslation>("developer_context", "zh"),
  };
}