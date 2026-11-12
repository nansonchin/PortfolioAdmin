import z from "zod";
import { issuesToFieldErrors, SLUG_PATTERN } from "./projectBasic";
import { ValidationResult } from "./shared";

const RESERVED_IDS = ["new"];

export const newProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Max 120 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80, "Max 80 characters")
    .regex(
      SLUG_PATTERN,
      "Use lowercase letters, numbers and single hyphens, e.g. my-project",
    )
    .refine((value) => !RESERVED_IDS.includes(value), "This name is reserved"),

  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Year must be 4 digits, e.g. 2026")
    .transform(Number)
    .refine(
      (year) => year >= 2000 && year <= 2100,
      "Year must be between 2000 and 2100",
    ),

  category: z.string().trim().max(40, "Max 40 characters"),
});

export type NewProjectFormValues = z.input<typeof newProjectSchema>
export type NewProjectInput = z.output<typeof newProjectSchema>

export function validateNewProject(values:NewProjectFormValues):ValidationResult{
    const result = newProjectSchema.safeParse(values)
    return result.success?{ok:true}:{ok:false,errors:issuesToFieldErrors(result.error.issues)}
}