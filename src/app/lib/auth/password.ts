import bcrypt from "bcryptjs";

export async function verifyAdminCredentials(
    username:string,
    password:string,
):Promise<string|null>{
    const adminUsername=process.env.ADMIN_USERNAME;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if(!adminUsername || !adminHash){
        throw new Error("ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set, please check  env.local")
    }

    const passwordOk = await bcrypt.compare(password,adminHash)
    const usernameOk = username === adminUsername;

    return usernameOk && passwordOk? adminUsername : null
}