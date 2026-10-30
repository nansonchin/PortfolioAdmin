"use client";

import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import IconButton from "@/components/ui/IconButton";
import ImageField from "@/components/ui/ImageField";
import type { ProjectGalleryImage } from "@/types/project";
import { createGalleryItem } from "./galleryForm";
import { moveItem, removeAt, replaceAt } from "@/lib/array";

type GalleryEditorProps = {
  items: ProjectGalleryImage[];
  onChange: (next: ProjectGalleryImage[]) => void;
  errors: Record<string, string>; 
};

export default function GalleryEditor({ items, onChange, errors }: GalleryEditorProps) {
  function updateItem(index: number, patch: Partial<ProjectGalleryImage>) {
    onChange(replaceAt(items, index, { ...items[index], ...patch }));
  }

  const hasItemErrors = Object.keys(errors).some((key) => key.startsWith("gallery."));
  const topError = hasItemErrors ? undefined : errors.gallery;

  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="text-sm text-muted">No images yet.</p>}

      {items.map((item, index) => (
        <div key={item.id} className="border border-line bg-ink p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="hud-label text-gold-dim">
              Image {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex gap-1">
              <IconButton
                label={`Move image ${index + 1} up`}
                disabled={index === 0}
                onClick={() => onChange(moveItem(items, index, -1))}
              >
                ▲
              </IconButton>
              <IconButton
                label={`Move image ${index + 1} down`}
                disabled={index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, 1))}
              >
                ▼
              </IconButton>
              <IconButton
                label={`Remove image ${index + 1}`}
                danger
                onClick={() => onChange(removeAt(items, index))}
              >
                ✕
              </IconButton>
            </div>
          </div>

          <div className="space-y-4">
            <ImageField
              id={`gallery-${item.id}-url`}
              label="Image"
              value={item.imageUrl}
              onChange={(next) => updateItem(index, { imageUrl: next })}
              error={errors[`gallery.${index}.imageUrl`]}
            />

            <Field
              label="Title"
              htmlFor={`gallery-${item.id}-title`}
              error={errors[`gallery.${index}.title`]}
            >
              <input
                id={`gallery-${item.id}-title`}
                value={item.title}
                onChange={(event) => updateItem(index, { title: event.target.value })}
                className={inputClass(Boolean(errors[`gallery.${index}.title`]))}
              />
            </Field>

            <Field
              label="Description"
              htmlFor={`gallery-${item.id}-description`}
              error={errors[`gallery.${index}.description`]}
            >
              <textarea
                id={`gallery-${item.id}-description`}
                rows={2}
                value={item.description}
                onChange={(event) => updateItem(index, { description: event.target.value })}
                className={inputClass(Boolean(errors[`gallery.${index}.description`]))}
              />
            </Field>
          </div>
        </div>
      ))}

      {topError && (
        <p role="alert" className="hud-label text-alert">
          ⚠ {topError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" onClick={() => onChange([...items, createGalleryItem()])}>
          + Add image
        </Button>
        <span className="hud-label text-gold-dim">{items.length} / 30 images</span>
      </div>
    </div>
  );
}