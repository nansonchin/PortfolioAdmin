// src/features/profile/ProfileTranslationForm.tsx
"use client";

import TranslateRow from "@/app/features/translations/TranslateRow";
import FormActions from "@/features/projects/FormActions";
import { useSectionForm } from "@/features/projects/hooks/useSectionForm";
import { getProfileTranslationProgress, type ProfileTranslationFormValues } from "@/lib/translation/site";
import { validateProfileTranslation } from "@/lib/translation/siteValidation";
import type { Profile } from "@/types/site";

type Props = {
  initialValues: ProfileTranslationFormValues;
  english: Profile;
};

export default function ProfileTranslationForm({ initialValues, english }: Props) {
  const form = useSectionForm<ProfileTranslationFormValues>({
    endpoint: "/api/site/profile/zh",
    initialValues,
    validate: validateProfileTranslation,
  });

  const { values, errors, setField } = form;
  const progress = getProfileTranslationProgress(english, values);

  function setLine(key: "headline" | "intro", index: number, text: string) {
    setField(
      key,
      values[key].map((item, i) => (i === index ? text : item)),
    );
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      {english.headline.map((line, index) => (
        <TranslateRow
          key={`headline-${index}`}
          id={`trp-headline-${index}`}
          label={`Headline ${index + 1}`}
          english={line}
          value={values.headline[index] ?? ""}
          onChange={(next) => setLine("headline", index, next)}
          error={errors[`headline.${index}`]}
        />
      ))}

      {english.intro.map((paragraph, index) => (
        <TranslateRow
          key={`intro-${index}`}
          id={`trp-intro-${index}`}
          label={`Intro ${index + 1}`}
          english={paragraph}
          value={values.intro[index] ?? ""}
          onChange={(next) => setLine("intro", index, next)}
          multiline
          rows={5}
          error={errors[`intro.${index}`]}
        />
      ))}

      <TranslateRow
        id="trp-status"
        label="Status"
        english={english.status}
        value={values.status}
        onChange={(next) => setField("status", next)}
        error={errors.status}
      />
      <TranslateRow
        id="trp-location"
        label="Location"
        english={english.location}
        value={values.location}
        onChange={(next) => setField("location", next)}
        error={errors.location}
      />

      {english.skillGroups.map((group) => (
        <TranslateRow
          key={group.title}
          id={`trp-group-${group.title}`}
          label="Skill group"
          english={group.title}
          value={values.skillGroupTitles[group.title] ?? ""}
          onChange={(next) =>
            setField("skillGroupTitles", { ...values.skillGroupTitles, [group.title]: next })
          }
          error={errors[`skillGroupTitles.${group.title}`]}
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