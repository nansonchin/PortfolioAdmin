// src/features/projects/NewProjectForm.tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import { slugify } from "@/lib/slug";
import { validateNewProject, type NewProjectFormValues } from "@/lib/validation/newProject";

type Props = {
  defaultYear: number;
  categories: string[];
};

export default function NewProjectForm({ defaultYear, categories }: Props) {
  const router = useRouter();

  const [values, setValues] = useState<NewProjectFormValues>({
    title: "",
    slug: "",
    year: String(defaultYear),
    category: "",
  });

  const [slugTouched, setSlugTouched] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function setField<K extends keyof NewProjectFormValues>(key: K, value: NewProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setMessage(null);
  }

  function handleTitleChange(title: string) {
    setValues((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
    setErrors((current) => {
      const { title: _title, slug: _slug, ...rest } = current;
      return slugTouched ? { ...rest, slug: current.slug } : rest;
    });
    setMessage(null);
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(slug !== "");
    setField("slug", slug);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const result = validateNewProject(values);

    if (!result.ok) {
      setErrors(result.errors);
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as {
        id?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      } | null;

      if (!response.ok || !data?.id) {
        setErrors(data?.fieldErrors ?? {});
        setMessage(data?.error ?? "Could not create the project");
        return;
      }

      router.push(`/projects/${encodeURIComponent(data.id)}`);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Field label="Title" htmlFor="new-title" error={errors.title}>
        <input
          id="new-title"
          value={values.title}
          onChange={(event) => handleTitleChange(event.target.value)}
          autoFocus
          className={inputClass(Boolean(errors.title))}
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="new-slug"
        error={errors.slug}
        hint="Used in the project URL, and also as the project's permanent id for its images. You can change the slug later, but the id stays."
      >
        <input
          id="new-slug"
          value={values.slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          className={`${inputClass(Boolean(errors.slug))} font-system`}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Year" htmlFor="new-year" error={errors.year}>
          <input
            id="new-year"
            inputMode="numeric"
            value={values.year}
            onChange={(event) => setField("year", event.target.value)}
            className={inputClass(Boolean(errors.year))}
          />
        </Field>

        <Field label="Category" htmlFor="new-category" error={errors.category}>
          <input
            id="new-category"
            list="new-category-suggestions"
            value={values.category}
            onChange={(event) => setField("category", event.target.value)}
            className={inputClass(Boolean(errors.category))}
          />
          <datalist id="new-category-suggestions">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create project"}
        </Button>

        <Link href="/projects" className="hud-label text-gold-dim transition hover:text-gold">
          Cancel
        </Link>

        {message && (
          <span role="alert" className="hud-label text-alert">
            ⚠ {message}
          </span>
        )}
      </div>
    </form>
  );
}