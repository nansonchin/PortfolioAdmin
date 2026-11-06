import { z } from "zod";
import {
  toStoredTranslation,
  type TranslationFormValues,
} from "../translation/form";
import { issuesToFieldErrors } from "./projectBasic";
import type { ValidationResult } from "./shared";
import type { ProjectTranslation } from "@/types/translation";

const text = (max: number) => z.string().max(max, `Max ${max} characters`);
const list = z.array(text(500)).max(30, "At most 30 items");

const limited = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine(
    (record) => Object.keys(record as Record<string, unknown>).length <= 100,
    "Too many entries",
  );

export const projectTranslationSchema = z
  .object({
    title: text(120),
    summary: text(300),
    description: text(5000),
    features: list,
    responsibilities: list,
    challenges: list,
    solutions: list,
    story: z.object({
      problem: text(3000),
      approach: text(3000),
      outcome: text(3000),
      architecture: list,
    }),
    gallery: limited(
      z.record(
        z.string().max(100),
        z.object({ title: text(120), description: text(500) }),
      ),
    ),
    architecture: z
      .object({
        title: text(120),
        description: text(1000),
        nodes: limited(
          z.record(
            z.string().max(100),
            z.object({
              title: text(80),
              description: text(300),
              details: text(2000),
            }),
          ),
        ),
      })
      .nullable(),
  })
  .transform(
    (values): ProjectTranslation =>
      toStoredTranslation(values as TranslationFormValues),
  );

export function validateProjectTranslation(
  values: TranslationFormValues,
): ValidationResult {
  const result = projectTranslationSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}
