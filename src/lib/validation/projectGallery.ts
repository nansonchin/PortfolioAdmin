// src/lib/validation/projectGallery.ts

import { z } from "zod";
import { isHttpUrl, issuesToFieldErrors } from "./projectBasic";
import type { ValidationResult } from "./shared";

function isAllowedImageUrl(value: string): boolean {
  return (value.startsWith("/") && !value.startsWith("//")) || isHttpUrl(value);
}

const galleryItemSchema = z.object({
  id: z.string().trim().min(1, "Missing image id").max(100),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .max(2000, "Max 2000 characters")
    .refine(isAllowedImageUrl, "Use a path like /images/shot.webp or a full http(s) URL"),
  title: z.string().trim().max(120, "Max 120 characters"),
  description: z.string().trim().max(500, "Max 500 characters"),
});

export const projectGallerySchema = z.object({
  gallery: z.array(galleryItemSchema).max(30, "At most 30 images"),
});

export type ProjectGalleryFormValues = z.input<typeof projectGallerySchema>;
export type ProjectGalleryInput = z.output<typeof projectGallerySchema>;

export function validateProjectGallery(values: ProjectGalleryFormValues): ValidationResult {
  const result = projectGallerySchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}