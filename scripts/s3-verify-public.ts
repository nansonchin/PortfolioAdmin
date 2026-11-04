import { createS3Client, readS3Config } from "@/lib/storage/s3Client";
import { Bucket$, PutObject$, PutObjectCommand } from "@aws-sdk/client-s3";
import { loadEnv } from "../lib/env/loadEnv";

async function main(){
    loadEnv()
    const config = readS3Config()
    const client =createS3Client(config)

    const stamp = Date.now();
    const publickey =`projects/_check/public-${stamp}.txt`;
    const privateKey = `playground/private-${stamp}.txt`;

    for(const key of [publickey,privateKey]){
        await client.send(
            new PutObjectCommand({
                Bucket:config.bucket,
                Key:key,
                Body:"check",
                ContentType:"text/plain"
            })
        )
    }

    const base =`${config.endpoint}/${config.bucket}`
    const publicResponse = await fetch(`${base}/${publickey}`)
    const privateResponse = await fetch(`${base}/${privateKey}`)

    console.table([
        {Position:"project/(Suppose Public)", expect:200, actual:publicResponse.status},
        {Position:"playground/(Suppose Private)", expect:403, actual:privateResponse.status}
    ])
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});