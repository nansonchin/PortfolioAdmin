"use client";

import {
  ProjectCoverFormValues,
  validateProjectCover,
} from "@/lib/validation/projectCover";
import { useSectionForm } from "./hooks/useSectionForm";
import ImageField from "@/components/ui/ImageField";
import { uploadImage } from "../upload/uploadImage";
import FormActions from "./FormActions";
import Field from "@/components/ui/Field";

type Props = {
  projectId: string;
  initialValues: ProjectCoverFormValues;
};

export default function ProjectCoverForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectCoverFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/cover`,
    initialValues,
    validate: validateProjectCover,
  });

  const { values, errors, setField } = form;

  function changeHeroSrc(next: string) {
    setField("heroSrc", next);
    if (values.heroSrcSet !== "") {
      setField("heroSrcSet", "");
    }
    if (values.heroSizes !== "") {
      setField("heroSizes", "");
    }
  }

  const srcSetWillBeRemoved =
    form.saved.heroSrcSet !== "" && values.heroSrcSet === "";

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <ImageField
        id="cover-hero"
        label="Hero image"
        value={values.heroSrc}
        onChange={changeHeroSrc}
        onUpload={(file) => uploadImage({ file, projectId, purpose: "hero" })}
        error={errors.heroSrc}
      />
      {values.heroSrcSet !== "" && (
        <p className="text-sm text-muted">
          This hero has a responsive image set. Changing the image will remove
          it, so the new image is used at every screen size.
        </p>
      )}
      {srcSetWillBeRemoved && (
        <p className="hud-label text-alert">
          ⚠ The responsive image set will be removed when you save.
        </p>
      )}
      <ImageField
        id="cover-thumbnail"
        label="Thumbnail"
        value={values.thumbnail}
        onChange={(next) => setField("thumbnail", next)}
        onUpload={(file) =>
          uploadImage({ file, projectId, purpose: "thumbnail" })
        }
        error={errors.thumbnail}
      />
      {errors.heroSrcSet && (
        <Field
          label="Responsive set"
          htmlFor="cover-srcset"
          error={errors.heroSrcSet}
        >
          <span />
        </Field>
      )}

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}
