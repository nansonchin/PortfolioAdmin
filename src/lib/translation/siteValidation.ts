// src/lib/validation/siteTranslation.ts

import { z } from "zod";
import {
  toStoredDeveloperTranslation,
  toStoredProfileTranslation,
  type DeveloperTranslationFormValues,
  type ProfileTranslationFormValues,
} from "../translation/site";
import type { DeveloperContextTranslation, ProfileTranslation } from "@/types/site";
import { issuesToFieldErrors } from "../validation/projectBasic";
import { ValidationResult } from "../validation/shared";

const text = (max: number) => z.string().max(max, `Max ${max} characters`);

export const profileTranslationSchema = z
  .object({
    headline: z.array(text(120)).max(4, "At most 4 lines"),
    intro: z.array(text(1200)).max(6, "At most 6 paragraphs"),
    status: text(40),
    location: text(80),
    skillGroupTitles: z
      .record(z.string().max(100), text(40))
      .refine((record) => Object.keys(record).length <= 8, "Too many entries"),
  })
  .transform((values): ProfileTranslation => toStoredProfileTranslation(values));

export const developerTranslationSchema = z
  .object({
    role: text(80),
    description: text(1000),
    background: z.array(text(200)).max(10, "At most 10 items"),
    goals: z.array(text(300)).max(10, "At most 10 items"),
  })
  .transform((values): DeveloperContextTranslation => toStoredDeveloperTranslation(values));

export function validateProfileTranslation(values: ProfileTranslationFormValues): ValidationResult {
  const result = profileTranslationSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}

export function validateDeveloperTranslation(
  values: DeveloperTranslationFormValues,
): ValidationResult {
  const result = developerTranslationSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}