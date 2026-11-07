// src/features/profile/DeveloperTranslationForm.tsx
"use client";

import TranslateRow from "@/app/features/translations/TranslateRow";
import FormActions from "@/features/projects/FormActions";
import { useSectionForm } from "@/features/projects/hooks/useSectionForm";
import {
  getDeveloperTranslationProgress,
  type DeveloperTranslationFormValues,
} from "@/lib/translation/site";
import { validateDeveloperTranslation } from "@/lib/translation/siteValidation";
import type { DeveloperContext } from "@/types/site";

type Props = {
  initialValues: DeveloperTranslationFormValues;
  english: DeveloperContext;
};

export default function DeveloperTranslationForm({ initialValues, english }: Props) {
  const form = useSectionForm<DeveloperTranslationFormValues>({
    endpoint: "/api/site/developer-context/zh",
    initialValues,
    validate: validateDeveloperTranslation,
  });

  const { values, errors, setField } = form;
  const progress = getDeveloperTranslationProgress(english, values);

  function setLine(key: "background" | "goals", index: number, text: string) {
    setField(
      key,
      values[key].map((item, i) => (i === index ? text : item)),
    );
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <TranslateRow
        id="trd-role"
        label="Role"
        english={english.role}
        value={values.role}
        onChange={(next) => setField("role", next)}
        error={errors.role}
      />
      <TranslateRow
        id="trd-description"
        label="Description"
        english={english.description}
        value={values.description}
        onChange={(next) => setField("description", next)}
        multiline
        rows={4}
        error={errors.description}
      />

      {english.background.map((item, index) => (
        <TranslateRow
          key={`background-${index}`}
          id={`trd-background-${index}`}
          label={`Background ${index + 1}`}
          english={item}
          value={values.background[index] ?? ""}
          onChange={(next) => setLine("background", index, next)}
          error={errors[`background.${index}`]}
        />
      ))}

      {english.goals.map((item, index) => (
        <TranslateRow
          key={`goals-${index}`}
          id={`trd-goals-${index}`}
          label={`Goal ${index + 1}`}
          english={item}
          value={values.goals[index] ?? ""}
          onChange={(next) => setLine("goals", index, next)}
          multiline
          rows={2}
          error={errors[`goals.${index}`]}
        />
      ))}

      <p className="hud-label text-gold-dim">
        {progress.done} / {progress.total} fields translated
      </p>

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}