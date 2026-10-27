export const COOKIE_NAME = "admin_session";
export const SESSION_SECONDS =60*60*24;

export function getSecret():Uint8Array{
    const secret =  process.env.JWT_SECRET;
    if(!secret || secret.length <32){
        throw new Error("JWT_SECRET setting too low (at least 32), please check .env.local")
    }

    return new TextEncoder().encode(secret)
}