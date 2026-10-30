"use client";

import { resolvePreviewSrc } from "@/lib/imageUrl";
import { useState } from "react";
import Field, { inputClass } from "./Field";

type ImageFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
};

export default function ImageField({
  id,
  label,
  value,
  onChange,
  error,
}: ImageFieldProps) {
  const previewSrc = resolvePreviewSrc(value);

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = previewSrc !== null && previewSrc !== failedSrc;

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
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/images/shot.webp or https://..."
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass(Boolean(error))}
        />
      </div>
    </Field>
  );
}
