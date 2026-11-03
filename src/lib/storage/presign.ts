import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "server-only";
import { createS3Client, readS3Config } from "./s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let storage :{client:S3Client; bucket:string}| null = null;

function getStorage(){
    if(!storage){
        const config = readS3Config()
        storage={client:createS3Client(config),bucket:config.bucket}
    }

    return storage;
}

export async function createUpload(params:{
    key:string;
    contentType:string;
    size:number;
    expiresIn:number;
}):Promise<string>{
    const {client,bucket} = getStorage();

    const command= new PutObjectCommand({
        Bucket:bucket,
        Key:params.key,
        ContentType:params.contentType,
        ContentLength:params.size,
    })

    return getSignedUrl(client,command,{
        expiresIn:params.expiresIn,
        signableHeaders:new Set(["content-type","content-length"])
    })
}