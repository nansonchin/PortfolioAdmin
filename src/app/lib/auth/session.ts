import { jwtVerify, SignJWT } from "jose";
import { getSecret, SESSION_SECONDS } from "./config";

export type Session ={
    sub:string;
    role:"admin";
    iat:number;
    exp:number;
}

export async function signSession(sub:string):Promise<string>{
    return new SignJWT({role:"admin"}).
    setProtectedHeader({alg:"HS256"})
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getSecret())
}

export async function verifySession(token:string):Promise<Session|null>{
    try{
        const {payload} = await jwtVerify(token,getSecret(),{
            algorithms:["HS256"]
        })

        if(payload.role!=="admin"
            || typeof payload.sub !=="string"
            || typeof payload.iat !=="number"
            || typeof payload.exp !=="number"

        ){
            return null;
        }

        return{
            sub:payload.sub,
            role:"admin",
            iat:payload.iat,
            exp:payload.exp
        }
    }catch{
        return null;
    }
}