
import { z } from "zod";
import { isHttpUrl, issuesToFieldErrors } from "./projectBasic";
import { cleanItems, tagList } from "./projectLists";
import type { ValidationResult } from "./shared";
import type { DeveloperContext, Profile } from "@/types/site";

const lines = (maxLength: number, maxCount: number) =>
  z
    .array(z.string().max(maxLength, `Each line can have at most ${maxLength} characters`))
    .max(maxCount, `At most ${maxCount} lines`)
    .transform(cleanItems);

const optionalUrl = z
  .string()
  .trim()
  .max(300, "Max 300 characters")
  .refine(
    (value) => value === "" || isHttpUrl(value),
    "Must be a full URL starting with http:// or https://",
  );

const optionalEmail = z
  .string()
  .trim()
  .max(200, "Max 200 characters")
  .refine(
    (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Enter a valid email address",
  );

const skillGroupSchema = z.object({
  title: z.string().trim().max(40, "Max 40 characters"),
  items: tagList,
});

export const profileSchema = z
  .object({
    headline: lines(120, 4),
    intro: lines(1200, 6),
    location: z.string().trim().max(80, "Max 80 characters"),
    status: z.string().trim().min(1, "Status is required").max(40, "Max 40 characters"),
    email: optionalEmail,
    github: optionalUrl,
    linkedin: optionalUrl,
    focus: tagList,
    skillGroups: z.array(skillGroupSchema).max(8, "At most 8 groups"),
  })
  .superRefine((profile, ctx) => {
    const seen = new Set<string>();

    profile.skillGroups.forEach((group, index) => {
      if (group.title === "" && group.items.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["skillGroups", index, "title"],
          message: "A group with skills needs a title",
        });
      }

      const key = group.title.toLowerCase();
      if (key !== "") {
        if (seen.has(key)) {
          ctx.addIssue({
            code: "custom",
            path: ["skillGroups", index, "title"],
            message: "Group titles must be different from each other",
          });
        }
        seen.add(key);
      }
    });
  })
  .transform(
    (profile): Profile => ({
      ...profile,
      skillGroups: profile.skillGroups.filter(
        (group) => group.title !== "" || group.items.length > 0,
      ),
    }),
  );

export const developerContextSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Max 60 characters"),
  role: z.string().trim().min(1, "Role is required").max(80, "Max 80 characters"),
  description: z.string().trim().max(1000, "Max 1000 characters"),
  background: lines(200, 10),
  skills: tagList,
  goals: lines(300, 10),
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type DeveloperContextFormValues = z.input<typeof developerContextSchema>;

export function toProfileFormValues(raw: Partial<Profile> | undefined): ProfileFormValues {
  return {
    headline: raw?.headline ?? [],
    intro: raw?.intro ?? [],
    location: raw?.location ?? "",
    status: raw?.status ?? "",
    email: raw?.email ?? "",
    github: raw?.github ?? "",
    linkedin: raw?.linkedin ?? "",
    focus: raw?.focus ?? [],
    skillGroups: (raw?.skillGroups ?? []).map((group) => ({
      title: group.title ?? "",
      items: group.items ?? [],
    })),
  };
}

export function toDeveloperFormValues(
  raw: Partial<DeveloperContext> | undefined,
): DeveloperContextFormValues {
  return {
    name: raw?.name ?? "",
    role: raw?.role ?? "",
    description: raw?.description ?? "",
    background: raw?.background ?? [],
    skills: raw?.skills ?? [],
    goals: raw?.goals ?? [],
  };
}

export function validateProfile(values: ProfileFormValues): ValidationResult {
  const result = profileSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}

export function validateDeveloperContext(values: DeveloperContextFormValues): ValidationResult {
  const result = developerContextSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}