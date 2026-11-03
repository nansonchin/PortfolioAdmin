
import {
  PutBucketPolicyCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";

loadEnv()

async function main() {
  const config = readS3Config();
  const client = createS3Client(config);

  console.log(config.bucket)

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadProjectImages",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: "*",
      },
    ],
  };

  await client.send(
    new PutBucketPolicyCommand({
      Bucket: config.bucket,
      Policy: JSON.stringify(policy), 
    }),
  );
  console.log("✅ 已設定公開讀取：projects/*");

  const stamp = Date.now();
  const publicKey = `projects/_check/public-${stamp}.txt`;
  const privateKey = `playground/private-${stamp}.txt`;

  for (const key of [publicKey, privateKey]) {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: "check",
        ContentType: "text/plain",
      }),
    );
  }

  const base = `${config.endpoint}/${config.bucket}`;
  const publicResponse = await fetch(`${base}/${publicKey}`);
  const privateResponse = await fetch(`${base}/${privateKey}`);

  console.table([
    { 位置: "projects/（應該公開）", 預期: 200, 實際: publicResponse.status },
    { 位置: "playground/（應該私有）", 預期: 403, 實際: privateResponse.status },
  ]);
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});