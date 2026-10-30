"use client";

import { ValidationResult } from "@/lib/validation/shared";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

export type FormMessage = { type: "ok" | "error"; text: string };

type Options<V> = {
  endpoint: string;
  initialValues: V;
  validate: (values: V) => ValidationResult;
};

export function useSectionForm<V extends Record<string, unknown>>({
  endpoint,
  initialValues,
  validate,
}: Options<V>) {
  const router = useRouter();

  const [saved, setSaved] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(saved),
    [values, saved],
  );

  useEffect(() => {
    if (!dirty) {
      return;
    }

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function setField<K extends keyof V>(key: K, value: V[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const name = String(key);
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const result = validate(values);

    if (!result.ok) {
      setErrors(result.errors);
      setMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string>;
        values?: V;
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

  return {
    saved,
    values,
    errors,
    saving,
    message,
    dirty,
    setField,
    handleSubmit,
    handleDiscard,
  };
}
