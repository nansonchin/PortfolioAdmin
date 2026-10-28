import { z } from "zod";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false; 
  }
}

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isHttpUrl(value),
    "Must be a full URL starting with http:// or https://",
  );


const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectBasicSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120, "Max 120 characters"),

    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(80, "Max 80 characters")
      .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens, e.g. my-project"),

    summary: z.string().trim().max(300, "Max 300 characters"),
    description: z.string().trim().max(5000, "Max 5000 characters"),

    year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Year must be 4 digits, e.g. 2025")
      .transform(Number)
      .refine((year) => year >= 2000 && year <= 2100, "Year must be between 2000 and 2100"),

    category: z.string().trim().max(40, "Max 40 characters"),
    githubUrl: optionalUrl,
    demoUrl: optionalUrl,
    featured: z.boolean(),
    status: z.enum(["draft", "published"]),
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" && data.summary === "") {
      ctx.addIssue({
        code: "custom",
        path: ["summary"], 
        message: "A published project needs a summary",
      });
    }
  });

export type ProjectBasicFormValues = z.input<typeof projectBasicSchema>;
export type ProjectBasicInput = z.output<typeof projectBasicSchema>;

export function issuesToFieldErrors(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    if (!(field in errors)) {
      errors[field] = issue.message;
    }
  }

  return errors;
}