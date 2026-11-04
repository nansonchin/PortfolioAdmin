import { createS3Client, readS3Config } from "@/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";
import { CreateBucketCommand } from "@aws-sdk/client-s3";

async function main() {
  loadEnv();
  const config = readS3Config();
  const client = createS3Client(config);

  for (const bucket of [config.bucket, config.snapshotBucket]) {
    try {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`✅ Created Bucket : ${bucket}`);
    } catch (error) {
      const name = (error as { name?: string }).name;

      if (
        name === "BucketAlreadyOwnedByYou" ||
        name === "BucketAlreadyExists"
      ) {
        console.log(`ℹ️  Bucket Exists：${bucket}`);
      } else {
        throw error;
      }
    }
  }
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});