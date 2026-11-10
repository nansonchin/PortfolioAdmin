import "server-only";
import { connection, NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth/getSession";
import { issuesToFieldErrors } from "@/lib/validation/projectBasic";

type SafeParser<T> = {
  safeParse: (
    input: unknown,
  ) =>
    | { success: true; data: T }
    | {
        success: false;
        error: {
          issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>;
        };
      };
};

export function createDocumentPutHandler<T, V>(options: {
  schema: SafeParser<T>;
  save: (data: T) => Promise<V>;
}) {
  return async function PUT(request: Request) {
    await connection()
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

    const result = options.schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: issuesToFieldErrors(result.error.issues) },
        { status: 422 },
      );
    }

    try {
      return NextResponse.json({ values: await options.save(result.data) });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }
  };
}