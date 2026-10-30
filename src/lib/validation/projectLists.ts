import { z } from "zod";
import { issuesToFieldErrors } from "./projectBasic";
import type { ValidationResult } from "./shared";

function cleanItems(items: string[]): string[] {
  return items.map((item) => item.trim()).filter((item) => item !== "");
}

function dedupeIgnoreCase(items: string[]): string[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const textList = z
  .array(z.string().max(500, "Each item can have at most 500 characters"))
  .max(30, "At most 30 items")
  .transform(cleanItems);

const tagList = z
  .array(z.string().max(40, "Each tag can have at most 40 characters"))
  .max(30, "At most 30 tags")
  .transform((items) => dedupeIgnoreCase(cleanItems(items)));

export const projectListsSchema = z.object({
  technologies: tagList,
  features: textList,
  responsibilities: textList,
  challenges: textList,
  solutions: textList,
});

export type ProjectListsFormValues = z.input<typeof projectListsSchema>;
export type ProjectListsInput = z.output<typeof projectListsSchema>;

export function validateProjectLists(values: ProjectListsFormValues): ValidationResult {
  const result = projectListsSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}