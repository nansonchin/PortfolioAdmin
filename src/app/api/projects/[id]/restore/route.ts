import { getSession } from "@/app/lib/auth/getSession";
import { restoreProject } from "@/lib/db/projectRepository";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const restored = await restoreProject(id);
    if (!restored) {
      return NextResponse.json(
        { error: "No deleted project with this id" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not restore the project" },
      { status: 500 },
    );
  }
}
