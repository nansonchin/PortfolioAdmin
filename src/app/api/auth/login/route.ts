import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/app/lib/auth/password";
import { signSession } from "@/app/lib/auth/session";
import { COOKIE_NAME, SESSION_SECONDS } from "@/app/lib/auth/config";
import { getClientIp, isLoginBlocked, recordLoginAttempt } from "@/lib/auth/rateLimit";

export async function POST(request:Request){
    const ip = getClientIp(request);

    try{
        if(await isLoginBlocked(ip)){
            return NextResponse.json({
                error:"Too many failed attemppts, Please try again in 15 mins"
            },{status:429})
        }
    }catch(error){
        console.error(error)
        return NextResponse.json({
            error:"Login is temporarily unavailable"
        },{
            status:503
        })
    }

    let body:unknown;
    try{
        body = await request.json()
    }catch{
        return NextResponse.json({error:"Invalid request"},{status:400})
    }

    const {username,password} = (body??{})as{
        username?:unknown;
        password?:unknown;
    }

    if(typeof username !=="string" || typeof password !=="string"){
        return NextResponse.json({error:"Invalid Request"},{status:400})
    }

    const sub = await verifyAdminCredentials(username,password)

    await recordLoginAttempt(ip,sub!==null).catch((error)=>console.error(error))

    if(!sub){
        return NextResponse.json({error:"Invalid credentials"},{status:401});
    }

    const token = await signSession(sub);

    const response = NextResponse.json({ok:true});

    response.cookies.set(COOKIE_NAME,token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
        path:"/",
        maxAge:SESSION_SECONDS,
    })

    return response;
}
