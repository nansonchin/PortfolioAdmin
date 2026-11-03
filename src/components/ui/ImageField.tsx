"use client";

import { resolvePreviewSrc } from "@/lib/imageUrl";
import { ChangeEvent, useRef, useState } from "react";
import Field, { inputClass } from "./Field";
import { ALLOWED_IMAGES_TYPES } from "@/lib/validation/upload";
import Button from "./Button";

type ImageFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
  onUpload?: (file: File) => Promise<string>;
};

export default function ImageField({
  id,
  label,
  value,
  onChange,
  error,
  onUpload,
}: ImageFieldProps) {
  const previewSrc = resolvePreviewSrc(value);

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = previewSrc !== null && previewSrc !== failedSrc;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUpload) {
      return;
    }
    setUploading(true);
    setUploadError(null);

    try {
      onChange(await onUpload(file));
    } catch (caught) {
      setUploadError(
        caught instanceof Error ? caught.message : "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className="flex gap-3">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden border border-line bg-ink">
          {showImage ? (
            <img
              src={previewSrc}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setFailedSrc(previewSrc)}
            />
          ) : (
            <span className="hud-label px-2 text-center text-gold-dim">
              No preview
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Upload an image, or paste /images/shot.webp or https://..."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass(Boolean(error))}
          />
          {onUpload && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGES_TYPES.join(",")}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="ghost"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
              <span className="hud-label text-gold-dim">
                WebP · PNG · JPEG · max 5 MB
              </span>
            </div>
          )}
        </div>
      </div>
    </Field>
  );
}
