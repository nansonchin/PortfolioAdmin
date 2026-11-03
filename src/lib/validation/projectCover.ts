import { z } from "zod";
import { isAllowedImageRef } from "../imageRef";
import { issuesToFieldErrors } from "./projectBasic";
import type { ValidationResult } from "./shared";
import type { ProjectCover } from "@/types/project";

const REF_MESSAGE =
  "Upload an image, or use a path like /images/shot.webp or a full http(s) URL";

export const projectCoverSchema = z
  .object({
    thumbnail: z
      .string()
      .trim()
      .max(2000, "Max 2000 characters")
      .refine((value) => value === "" || isAllowedImageRef(value), REF_MESSAGE),
    heroSrc: z
      .string()
      .trim()
      .min(1, "A hero image is required")
      .max(2000, "Max 2000 characters")
      .refine(isAllowedImageRef, REF_MESSAGE),
    heroSrcSet: z.string().trim().max(3000, "Max 3000 characters"),
    heroSizes: z.string().trim().max(500, "Max 500 characters"),
  })
  .transform(
    (values): ProjectCover => ({
      thumbnail: values.thumbnail,
      heroImage: {
        src: values.heroSrc,
        ...(values.heroSrcSet ? { srcSet: values.heroSrcSet } : {}),
        ...(values.heroSizes ? { sizes: values.heroSizes } : {}),
      },
    }),
  );

export type ProjectCoverFormValues = z.input<typeof projectCoverSchema>;

export function validateProjectCover(values: ProjectCoverFormValues): ValidationResult {
  const result = projectCoverSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}