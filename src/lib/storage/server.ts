import { S3Client } from "@aws-sdk/client-s3"
import "server-only"
import { createS3Client, readS3Config, S3Config } from "./s3Client"

let cached:{client:S3Client,config:S3Config}|null = null;

export function getStorage():{
    client:S3Client,
    config:S3Config
}{
    if(!cached){
        const config = readS3Config()
            cached = { client: createS3Client(config), config };

    }
    return cached
}