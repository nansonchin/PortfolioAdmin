import { getSession } from "@/app/lib/auth/getSession";
import { createProject, DuplicateSlugError } from "@/lib/db/projectRepository";
import { newProjectSchema } from "@/lib/validation/newProject";
import { issuesToFieldErrors } from "@/lib/validation/projectBasic";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = newProjectSchema.safeParse(body);
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
    const project = await createProject(result.data);

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return NextResponse.json(
        {
          error: "Already in use",
          fieldErrors: { slug: "A project with this name already exists" },
        },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Could not create the project" }, { status: 500 });
  }
}
