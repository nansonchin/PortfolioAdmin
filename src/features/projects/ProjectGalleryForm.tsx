// src/features/projects/ProjectGalleryForm.tsx
"use client";

import {
  validateProjectGallery,
  type ProjectGalleryFormValues,
} from "@/lib/validation/projectGallery";
import FormActions from "./FormActions";
import GalleryEditor from "./GalleryEditor";
import { useSectionForm } from "./hooks/useSectionForm";

type Props = {
  projectId: string;
  initialValues: ProjectGalleryFormValues;
};

export default function ProjectGalleryForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectGalleryFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/gallery`,
    initialValues,
    validate: validateProjectGallery,
  });

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <GalleryEditor
        items={form.values.gallery}
        onChange={(next) => form.setField("gallery", next)}
        errors={form.errors}
      />

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}