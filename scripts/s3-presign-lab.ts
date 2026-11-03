import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, readS3Config } from "../src/lib/storage/s3Client";
import { loadEnv } from "../lib/env/loadEnv";

loadEnv()
const config = readS3Config();
const client = createS3Client(config);

type PutOptions = {
  contentType: string;
  size: number;
  expiresIn: number; 
  signContentType: boolean; 
};

async function presignPut(key: string, options: PutOptions): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: options.contentType,
    ContentLength: options.size,
  });

  return getSignedUrl(client, command, {
    expiresIn: options.expiresIn,
    ...(options.signContentType ? { signableHeaders: new Set(["content-type"]) } : {}),
  });
}

async function put(url: string, body: string, contentType: string): Promise<number> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body,
  });
  return response.status;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function showAnatomy(url: string) {
  const parsed = new URL(url);
  const params = Object.fromEntries(parsed.searchParams);

  if (params["X-Amz-Signature"]) {
    params["X-Amz-Signature"] = `${params["X-Amz-Signature"].slice(0, 12)}…`;
  }

  console.log("Website：");
  console.log("  Main hoost：", parsed.host);
  console.log("  Route：", parsed.pathname);
  console.log("  Params：", params);
  console.log();
}

async function main() {
  const stamp = Date.now();
  const body = "hello presigned";
  const size = Buffer.byteLength(body); 
  const results: { test: string; expected: string; actual: string }[] = [];

  const fresh = (n: number) => `playground/presigned-${stamp}-${n}.txt`;

  const key1 = fresh(1);
  const url1 = await presignPut(key1, {
    contentType: "text/plain",
    size,
    expiresIn: 60,
    signContentType: true,
  });
  showAnatomy(url1);
  results.push({
    test: "① Normal Uploaded",
    expected: "200",
    actual: String(await put(url1, body, "text/plain")),
  });

  const url2 = await presignPut(fresh(2), {
    contentType: "text/plain",
    size,
    expiresIn: 60,
    signContentType: true,
  });
  results.push({
    test: "② Length of Content Type larger than Sign Content type",
    expected: "403",
    actual: String(await put(url2, body + " plus extra bytes", "text/plain")),
  });

  const key3 = fresh(3);
  const url3 = await presignPut(key3, {
    contentType: "text/plain",
    size,
    expiresIn: 60,
    signContentType: true,
  });
  results.push({
    test: "③ Website Key modified",
    expected: "403",
    actual: String(await put(url3.replace(key3, `${key3}-evil`), body, "text/plain")),
  });

  const url4 = await presignPut(fresh(4), {
    contentType: "text/plain",
    size,
    expiresIn: 1, 
    signContentType: true,
  });
  await sleep(2500);
  results.push({
    test: "④ Expires in Time",
    expected: "403",
    actual: String(await put(url4, body, "text/plain")),
  });

  const url5a = await presignPut(fresh(5), {
    contentType: "text/plain",
    size,
    expiresIn: 60,
    signContentType: false,
  });
  results.push({
    test: "⑤a Contain-Type did not signed and is other content-type",
    expected: "200(Not Blocked,)",
    actual: String(await put(url5a, body, "application/x-msdownload")),
  });

  const url5b = await presignPut(fresh(6), {
    contentType: "text/plain",
    size,
    expiresIn: 60,
    signContentType: true,
  });
  results.push({
    test: "⑤b Content-type contains other content-type ",
    expected: "403",
    actual: String(await put(url5b, body, "application/x-msdownload")),
  });

  const unsigned = await fetch(`${config.endpoint}/${config.bucket}/${key1}`);
  results.push({
    test: "⑥ Access without signed",
    expected: "403",
    actual: String(unsigned.status),
  });

  const getUrl = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: config.bucket, Key: key1 }),
    { expiresIn: 60 },
  );
  const downloaded = await fetch(getUrl);
  const text = await downloaded.text();
  results.push({
    test: "⑦ use Sign address to download",
    expected: "200, Same Content",
    actual: `${downloaded.status}，${text === body ? "Same Content" : "Not same Content"}`,
  });

  console.table(results);
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});