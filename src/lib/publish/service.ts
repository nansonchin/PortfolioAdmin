import "server-only";
import {
  buildSnapShot,
  findSnapshotProblems,
  PortfolioSnapshot,
} from "./snapshot";
import { listProjects } from "../db/projectRepository";
import { readPublicBaseUrl } from "../storage/publicUrl";
import { getStorage } from "../storage/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const SNAPSHOT_KEY = "latest.json";
const SNAPSHOT_CACHE_CONTROL = "public, max-age=60";

export async function prepareSnapshot(): Promise<{
  snapshot: PortfolioSnapshot;
  problems: string[];
}> {
  const projects = await listProjects();
  const snapshot = buildSnapShot(projects, readPublicBaseUrl());
  return { snapshot, problems: findSnapshotProblems(snapshot) };
}

export type PublishOutcome =
  | { ok: true; generatedAt: string; projectCount: number; bytes: number }
  | { ok: false; problems: string[] };

export async function publishNow(): Promise<PublishOutcome> {
  const { snapshot, problems } = await prepareSnapshot();
  if (problems.length > 0) {
    return {
      ok: false,
      problems,
    };
  }
  const { client, config } = getStorage();

  const body = JSON.stringify(snapshot);

  await client.send(
    new PutObjectCommand({
      Bucket: config.snapshotBucket,
      Key: SNAPSHOT_KEY,
      Body: body,
      ContentType: "application/json; charset=utf-8",
      CacheControl: SNAPSHOT_CACHE_CONTROL,
    }),
  );

  return {
    ok: true,
    generatedAt: snapshot.generatedAt,
    projectCount: snapshot.projects.length,
    bytes: Buffer.byteLength(body),
  };
}

function isSnapshot(value: unknown): value is PortfolioSnapshot {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    typeof candidate.generatedAt === "string" &&
    Array.isArray(candidate.projects)
  );
}

export async function readLiveSnapshot(): Promise<PortfolioSnapshot | null> {
  const url = process.env.SNAPSHOT_PUBLIC_URL;
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(`${url}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    return isSnapshot(data) ? data : null;
  } catch (error) {
    return null;
  }
}

export function isInSync(
  live: PortfolioSnapshot,
  current: PortfolioSnapshot,
): boolean {
  return JSON.stringify(live.projects) === JSON.stringify(current.projects);
}
