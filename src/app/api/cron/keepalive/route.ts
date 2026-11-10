import { getSupabase } from "@/lib/db/supabase";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    const secret = process.env.CRON_SECRET;

    if(!secret || request.headers.get("authorizations")!== `Bearer ${secret}`){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const {error} = await getSupabase().from("projects").select("id").limit(1)

    if(error){
        console.error(error)
        return NextResponse.json({error:"Database check failed"},{status:500})
    }

    return NextResponse.json({ok:true, at:new Date().toISOString()})
}
