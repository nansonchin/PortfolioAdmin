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
  type ProjectBasicFormValues,
} from "@/lib/validation/projectBasic";

type Props = {
  projectId: string; 
  initialValues: ProjectBasicFormValues;
};

type Message = { type: "ok" | "error"; text: string };

export default function ProjectBasicForm({ projectId, initialValues }: Props) {
  const router = useRouter();


  const [saved, setSaved] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const dirty = useMemo(
    () =>
      (Object.keys(values) as (keyof ProjectBasicFormValues)[]).some(
        (key) => values[key] !== saved[key],
      ),
    [values, saved],
  );

  useEffect(() => {
    if (!dirty) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function setField<K extends keyof ProjectBasicFormValues>(
    key: K,
    value: ProjectBasicFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const parsed = projectBasicSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(issuesToFieldErrors(parsed.error.issues));
      setMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string>;
        values?: ProjectBasicFormValues;
      } | null;

      if (!response.ok) {
        setErrors(data?.fieldErrors ?? {});
        setMessage({ type: "error", text: data?.error ?? "Save failed" });
        return;
      }

      if (data?.values) {
        setSaved(data.values);
        setValues(data.values);
      }
      setMessage({ type: "ok", text: "Saved." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setValues(saved);
    setErrors({});
    setMessage(null);
  }

  const slugChanged = values.slug.trim() !== saved.slug;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

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
            ⚠ Changing the slug breaks existing links and the Chinese translation
            (which is stored under the slug) until they are updated too.
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

      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          rows={7}
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
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
            onChange={(next) => setField("status", next ? "published" : "draft")}
            label="Published"
          />
          {values.status === "published" ? "Published" : "Draft"}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" disabled={!dirty || saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>

        {dirty && !saving && (
          <Button type="button" variant="ghost" onClick={handleDiscard}>
            Discard
          </Button>
        )}

        {dirty && !message && (
          <span className="hud-label text-gold-dim">Unsaved changes</span>
        )}

        {message && (
          <span
            role={message.type === "error" ? "alert" : "status"}
            className={`hud-label ${message.type === "ok" ? "text-gold" : "text-alert"}`}
          >
            {message.type === "ok" ? "✓" : "⚠"} {message.text}
          </span>
        )}
      </div>
    </form>
  );
}