export function readPublicBaseUrl(env:NodeJS.ProcessEnv = process.env):string{
    const value = env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL

    if(!value){
        throw new Error ("Lack of Environement NEXT_PUBLIC_S3_PUBLIC_BASE_URL, Please check your .env.local")
    }

    return value.replace(/\/+$/,"")
}