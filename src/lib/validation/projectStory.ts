import { z } from "zod";
import { issuesToFieldErrors } from "./projectBasic";
import { textList } from "./projectLists";
import type { ValidationResult } from "./shared";

const paragraph = z.string().trim().max(3000, "Max 3000 characters");

export const projectStorySchema = z.object({
  problem: paragraph,
  approach: paragraph,
  architecture: textList,
  outcome: paragraph,
});

export type ProjectStoryFormValues = z.input<typeof projectStorySchema>;
export type ProjectStoryInput = z.output<typeof projectStorySchema>;

export function validateProjectStory(values: ProjectStoryFormValues): ValidationResult {
  const result = projectStorySchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}