// src/features/projects/ProjectBasicForm.tsx
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import Toggle from "@/components/ui/Toggle";
import {
  issuesToFieldErrors,
  projectBasicSchema,
  validateProjectBasic,
  type ProjectBasicFormValues,
} from "@/lib/validation/projectBasic";
import { useSectionForm } from "./hooks/useSectionForm";
import FormActions from "./FormActions";

type Props = {
  projectId: string;
  initialValues: ProjectBasicFormValues;
};

export default function ProjectBasicForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectBasicFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}`,
    initialValues,
    validate: validateProjectBasic,
  });

  const {values,errors,setField} = form;

  const slugChanged = values.slug.trim() !== form.saved.slug;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <Field label="Title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          value={values.title}
          onChange={(event) => setField("title", event.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputClass(Boolean(errors.title))}
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        error={errors.slug}
        hint="Used in the project URL, e.g. /projects/book-fairies"
      >
        <input
          id="slug"
          value={values.slug}
          onChange={(event) => setField("slug", event.target.value)}
          aria-invalid={Boolean(errors.slug)}
          aria-describedby={errors.slug ? "slug-error" : undefined}
          className={`${inputClass(Boolean(errors.slug))} font-system`}
        />
        {slugChanged && (
          <p className="mt-2 text-sm text-alert">
            ⚠ Changing the slug breaks existing links and the Chinese
            translation (which is stored under the slug) until they are updated
            too.
          </p>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Year" htmlFor="year" error={errors.year}>
          <input
            id="year"
            inputMode="numeric"
            value={values.year}
            onChange={(event) => setField("year", event.target.value)}
            aria-invalid={Boolean(errors.year)}
            aria-describedby={errors.year ? "year-error" : undefined}
            className={inputClass(Boolean(errors.year))}
          />
        </Field>

        <Field label="Category" htmlFor="category" error={errors.category}>
          <input
            id="category"
            value={values.category}
            onChange={(event) => setField("category", event.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={inputClass(Boolean(errors.category))}
          />
        </Field>
      </div>

      <Field
        label="Summary"
        htmlFor="summary"
        error={errors.summary}
        hint={`${values.summary.length} / 300 — a short line shown on cards`}
      >
        <textarea
          id="summary"
          rows={3}
          value={values.summary}
          onChange={(event) => setField("summary", event.target.value)}
          aria-invalid={Boolean(errors.summary)}
          aria-describedby={errors.summary ? "summary-error" : undefined}
          className={inputClass(Boolean(errors.summary))}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description}
      >
        <textarea
          id="description"
          rows={7}
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className={inputClass(Boolean(errors.description))}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="GitHub URL" htmlFor="githubUrl" error={errors.githubUrl}>
          <input
            id="githubUrl"
            inputMode="url"
            value={values.githubUrl}
            onChange={(event) => setField("githubUrl", event.target.value)}
            aria-invalid={Boolean(errors.githubUrl)}
            aria-describedby={errors.githubUrl ? "githubUrl-error" : undefined}
            className={inputClass(Boolean(errors.githubUrl))}
          />
        </Field>

        <Field
          label="Demo URL"
          htmlFor="demoUrl"
          error={errors.demoUrl}
          hint="Optional. Leave empty if there is no live demo."
        >
          <input
            id="demoUrl"
            inputMode="url"
            value={values.demoUrl}
            onChange={(event) => setField("demoUrl", event.target.value)}
            aria-invalid={Boolean(errors.demoUrl)}
            aria-describedby={errors.demoUrl ? "demoUrl-error" : undefined}
            className={inputClass(Boolean(errors.demoUrl))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="hud-label flex items-center gap-3 text-muted">
          <Toggle
            checked={values.featured}
            onChange={(next) => setField("featured", next)}
            label="Featured"
          />
          Featured
        </label>

        <label className="hud-label flex items-center gap-3 text-muted">
          <Toggle
            checked={values.status === "published"}
            onChange={(next) =>
              setField("status", next ? "published" : "draft")
            }
            label="Published"
          />
          {values.status === "published" ? "Published" : "Draft"}
        </label>
      </div>

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}
