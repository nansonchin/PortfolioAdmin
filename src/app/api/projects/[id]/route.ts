import { NextResponse } from "next/server";
import { DuplicateSlugError, updateProjectBasic, updateProjectFlags } from "@/lib/db/projectRepository";
import { toListItem } from "@/features/projects/listItem";
import type { ProjectFlagsPatch } from "@/types/project";
import { getSession } from "@/app/lib/auth/getSession";
import { issuesToFieldErrors, projectBasicSchema } from "@/lib/validation/projectBasic";
import { toFormValues } from "@/features/projects/basicForm";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const patch: ProjectFlagsPatch = {};

  if ("featured" in input) {
    if (typeof input.featured !== "boolean") {
      return NextResponse.json({ error: "featured must be boolean" }, { status: 400 });
    }
    patch.featured = input.featured;
  }

  if ("status" in input) {
    if (input.status !== "draft" && input.status !== "published") {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    patch.status = input.status;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const updated = await updateProjectFlags(id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(toListItem(updated));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = projectBasicSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: issuesToFieldErrors(result.error.issues),
      },
      { status: 422 },
    );
  }

  try {
    const updated = await updateProjectBasic(id, result.data);

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ values: toFormValues(updated) });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return NextResponse.json(
        {
          error: "Slug already in use",
          fieldErrors: { slug: "This slug is already used by another project" },
        },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}