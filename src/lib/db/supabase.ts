import "server-only"
import {createClient, type SupabaseClient} from "@supabase/supabase-js"


let client:SupabaseClient |null = null;

export function getSupabase():SupabaseClient{
    if(client){
        return client;
    }

    const url = process.env.SUPABASE_URL
    const secretKey = process.env.SUPABASE_SECRET_KEY

    if(!url || !secretKey){
        throw new Error("SUPABASE_URL or SUPABASE SECRET_KEY is not set yet, please  check .env.local");
    }

    client=createClient(url,secretKey,{
        auth:{
            persistSession:false,
            autoRefreshToken:false,
        }
    })

    return client;

}