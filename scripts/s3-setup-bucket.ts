// scripts/s3-setup-bucket.ts
//
// 一次性設定：讓 bucket 裡 projects/ 底下的檔案可以被「任何人讀取」。
// 用法：npm run s3:setup
// 可以重複執行，結果一樣（冪等）。

import { PutBucketPolicyCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";

async function main() {
  loadEnv();

  const config = readS3Config();
  const client = createS3Client(config);

  const bucket = config.bucket.trim();

  if (!bucket || bucket !== config.bucket) {
    throw new Error(`Invalid S3 bucket name: ${JSON.stringify(config.bucket)}`);
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadProjectImages",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: `arn:seaweed:s3:::${bucket}/projects/*`,
      },
    ],
  };

  await client.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy), // API 要的是「字串」，不是物件
    }),
  );
  console.log("✅ 已設定公開讀取：projects/*");

  // 驗證：各放一個測試檔，用「沒有簽名」的請求去讀
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
    {
      位置: "playground/（應該私有）",
      預期: 403,
      實際: privateResponse.status,
    },
  ]);
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
