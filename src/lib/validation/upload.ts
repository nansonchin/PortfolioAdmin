import z from "zod";

export const ALLOWED_IMAGES_TYPES=["image/webp","image/png","image/jpeg"] as const;
export const MAX_IMAGE_BYTES=5*1024*1024

export const UPLOAD_PURPOSES=["gallery","hero","thumbnail"] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGES_TYPES)[number];
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export const presignRequestSchema = z.object({
  projectId: z.string().regex(/^[A-Za-z0-9_-]{1,100}$/, "Invalid project id"),
  purpose: z.enum(UPLOAD_PURPOSES),
  contentType: z.enum(ALLOWED_IMAGES_TYPES),
  size: z
    .number()
    .int("Size must be a whole number")
    .min(1, "The file is empty")
    .max(MAX_IMAGE_BYTES, "The file is too large (max 5 MB)"),
});

export type PresignRequest = z.output<typeof presignRequestSchema>;