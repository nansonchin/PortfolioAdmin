import { getSession } from "@/app/lib/auth/getSession";
import { publishNow } from "@/lib/publish/service";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
   try {
    const outcome = await publishNow();

    if (!outcome.ok) {
      return NextResponse.json(
        { error: "The snapshot has problems", problems: outcome.problems },
        { status: 409 },
      );
    }

    return NextResponse.json(outcome);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}
