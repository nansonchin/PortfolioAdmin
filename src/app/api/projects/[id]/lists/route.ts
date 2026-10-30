import { getSession } from "@/app/lib/auth/getSession";
import { toListsFormValues } from "@/features/projects/listsForm";
import { updateProjectLists } from "@/lib/db/projectRepository";
import { issuesToFieldErrors } from "@/lib/validation/projectBasic";
import { projectListsSchema } from "@/lib/validation/projectLists";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

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

  const result = projectListsSchema.safeParse(body);


  if(!result.success){
    return NextResponse.json({
        error:"Validation failed",
        fieldErrors:issuesToFieldErrors(result.error.issues)
    },{
        status:422
    })
  }

  try {
    const updated = await updateProjectLists(id, result.data);

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ values: toListsFormValues(updated) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
