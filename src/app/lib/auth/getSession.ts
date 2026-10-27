import "server-only"
import {cookies} from "next/headers";
import { COOKIE_NAME } from "./config";
import { verifySession, type Session } from "./session";

export async function getSession():Promise<Session |null>{
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if(!token){
        return null;
    }

    return verifySession(token)
}