import dotenv from "dotenv"
import {
  CreateBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";

dotenv.config({
    path:".env.local"
})

async function main() {
  const config = readS3Config();
  const client = createS3Client(config);

  console.log("Connected Target", config.endpoint);
  console.log("bucket：  ", config.bucket);

  try {
    await client.send(new CreateBucketCommand({ Bucket: config.bucket }));
    console.log("✅ Created & Connected bucket");
  } catch (error) {
    const name = (error as { name?: string }).name;

    if (name === "BucketAlreadyOwnedByYou" || name === "BucketAlreadyExists") {
      console.log("ℹ️  bucket Exists");
    } else {
      throw error; 
    }
  }

  const key = `playground/hello-${Date.now()}.txt`;

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: `hello at ${new Date().toISOString()}`,
      ContentType: "text/plain",
    }),
  );
  console.log("✅ Uploaded：", key);

  const listed = await client.send(
    new ListObjectsV2Command({ Bucket: config.bucket, Prefix: "playground/" }),
  );

  console.table(
    (listed.Contents ?? []).map((object) => ({
      key: object.Key,
      size: object.Size,
      lastModified: object.LastModified?.toISOString(),
    })),
  );
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});