import "server-only";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getStorage } from "./server";

export async function createUploadUrl(params: {
  key: string;
  contentType: string;
  size: number;
  expiresIn: number;
}): Promise<string> {
  const { client, config } = getStorage();

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: params.key,
    ContentType: params.contentType,
    ContentLength: params.size,
  });

  return getSignedUrl(client, command, {
    expiresIn: params.expiresIn,
    signableHeaders: new Set(["content-type", "content-length"]),
  });
}