import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/app/lib/auth/password";
import { signSession } from "@/app/lib/auth/session";
import { COOKIE_NAME, SESSION_SECONDS } from "@/app/lib/auth/config";

export async function POST(request:Request){
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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};