import { S3Client } from "@aws-sdk/client-s3";

export type S3Config ={
    endpoint:string;
    region:string;
    bucket:string;
    snapshotBucket:string;
    accessKeyId:string;
    secretAccessKey:string;
    forcePathStyle:boolean;
}

function need(env:NodeJS.ProcessEnv,name:string):string{
    const value = env[name]
    if(!value){
      console.log(`Value:${env}, ${name} ${env[name]}`)
        throw new Error (`Lack Env Varables, please check your env.local ${value}` )
    }

    return value;
}

export function readS3Config(env: NodeJS.ProcessEnv = process.env): S3Config {
  return {
    endpoint: need(env, "S3_ENDPOINT"),
    region: env.S3_REGION ?? "us-east-1",
    bucket: need(env, "S3_BUCKET"),
    snapshotBucket:need(env,"S3_SNAPSHOT_BUCKET"),
    accessKeyId: need(env, "S3_ACCESS_KEY_ID"),
    secretAccessKey: need(env, "S3_SECRET_ACCESS_KEY"),
    forcePathStyle: env.S3_FORCE_PATH_STYLE === "true",
  };
}

export function createS3Client(config: S3Config): S3Client {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

