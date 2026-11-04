import { NextResponse } from "next/server";
import { prepareSnapshot } from "@/lib/publish/service";
import { getSession } from "@/app/lib/auth/getSession";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { snapshot, problems } = await prepareSnapshot();

    if (problems.length > 0) {
      return NextResponse.json({ error: "The snapshot has problems", problems }, { status: 409 });
    }

    const download = new URL(request.url).searchParams.get("download") === "1";

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...(download
          ? { "Content-Disposition": 'attachment; filename="portfolio-snapshot.json"' }
          : {}),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not build the snapshot" }, { status: 500 });
  }
}