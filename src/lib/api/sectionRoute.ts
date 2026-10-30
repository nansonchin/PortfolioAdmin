// src/lib/api/sectionRoute.ts

import "server-only";
import { NextResponse } from "next/server";
import { issuesToFieldErrors } from "@/lib/validation/projectBasic";
import type { AdminProject } from "@/types/project";
import { getSession } from "@/app/lib/auth/getSession";

type RouteContext = { params: Promise<{ id: string }> };

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

type SectionPutOptions<T, V> = {
  schema: SafeParser<T>;
  update: (id: string, data: T) => Promise<AdminProject | null>;
  toValues: (project: AdminProject) => V;
 
  mapError?: (error: unknown) => NextResponse | null;
};

export function createSectionPutHandler<T, V>({
  schema,
  update,
  toValues,
  mapError,
}: SectionPutOptions<T, V>) {
  return async function PUT(request: Request, { params }: RouteContext) {
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

    const result = schema.safeParse(body);

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
      const updated = await update(id, result.data);

      if (!updated) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json({ values: toValues(updated) });
    } catch (error) {
      const custom = mapError?.(error);
      if (custom) return custom;

      console.error(error);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }
  };
}