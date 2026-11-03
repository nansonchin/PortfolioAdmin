import { getSession } from "@/app/lib/auth/getSession";
import { getProjectById } from "@/lib/db/projectRepository";
import { buildObjectKey } from "@/lib/storage/key";
import { createUpload } from "@/lib/storage/presign";
import { issuesToFieldErrors } from "@/lib/validation/projectBasic";
import { presignRequestSchema } from "@/lib/validation/upload";
import { NextResponse } from "next/server";

const UPLOAD_URL_TTL_SECONDS = 60;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid Request",
      },
      {
        status: 400,
      },
    );
  }

  const result = presignRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: issuesToFieldErrors(result.error.issues),
      },
      { status: 422 },
    );
  }

  const { projectId, purpose, contentType, size } = result.data;

  const project = await getProjectById(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const key = buildObjectKey({
    projectId,
    purpose,
    contentType,
  });

  try {
    const uploadUrl = await createUpload({
      key,
      contentType,
      size,
      expiresIn: UPLOAD_URL_TTL_SECONDS,
    });

    return NextResponse.json({
      uploadUrl,
      key,
      method: "PUT",
      headers: { "Content-Type": contentType },
      expiresIn: UPLOAD_URL_TTL_SECONDS,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create upload URL" },
      { status: 500 },
    );
  }
}
