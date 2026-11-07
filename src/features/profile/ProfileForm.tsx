// src/features/profile/ProfileForm.tsx
"use client";

import ListEditor from "@/app/components/ui/ListEditor";
import TagEditor from "@/app/components/ui/TagEditor";
import Field from "@/components/ui/Field";
import TextField from "@/components/ui/TextField";
import FormActions from "@/features/projects/FormActions";
import { useSectionForm } from "@/features/projects/hooks/useSectionForm";
import { validateProfile, type ProfileFormValues } from "@/lib/validation/siteContent";
import SkillGroupsEditor from "./SkillGroupsEditor";

type Props = {
  initialValues: ProfileFormValues;
  suggestions: string[];
};

export default function ProfileForm({ initialValues, suggestions }: Props) {
  const form = useSectionForm<ProfileFormValues>({
    endpoint: "/api/site/profile",
    initialValues,
    validate: validateProfile,
  });

  const { values, errors, setField } = form;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <ListEditor
        id="profile-headline"
        label="Headline"
        items={values.headline}
        onChange={(next) => setField("headline", next)}
        addLabel="Add line"
        placeholder="One line of the big About title"
        hint="Each line is shown on its own row, in large type."
        error={errors.headline}
      />

      <ListEditor
        id="profile-intro"
        label="Intro"
        items={values.intro}
        onChange={(next) => setField("intro", next)}
        addLabel="Add paragraph"
        placeholder="A paragraph about you"
        multiline
        error={errors.intro}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="profile-status"
          label="Status"
          value={values.status}
          onChange={(next) => setField("status", next)}
          hint="Your availability, e.g. Open"
          error={errors.status}
        />
        <TextField
          id="profile-location"
          label="Location"
          value={values.location}
          onChange={(next) => setField("location", next)}
          hint="Leave empty and the About page shows a placeholder instead."
          error={errors.location}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="profile-email"
          label="Email"
          value={values.email}
          onChange={(next) => setField("email", next)}
          hint="Shown on the Contact page, and public once published. Leave empty to hide it."
          error={errors.email}
        />
        <TextField
          id="profile-github"
          label="GitHub URL"
          value={values.github}
          onChange={(next) => setField("github", next)}
          error={errors.github}
        />
      </div>

      <TextField
        id="profile-linkedin"
        label="LinkedIn URL"
        value={values.linkedin}
        onChange={(next) => setField("linkedin", next)}
        error={errors.linkedin}
      />

      <TagEditor
        id="profile-focus"
        label="Focus"
        tags={values.focus}
        onChange={(next) => setField("focus", next)}
        suggestions={suggestions}
        hint="Shown as the FOCUS line in the About readout."
        error={errors.focus}
      />

      <Field
        label="Skill groups"
        htmlFor="group-0-title"
        hint="The Chinese title of each group is stored under its English title. If you rename a group, translate its title again."
      >
        <SkillGroupsEditor
          groups={values.skillGroups}
          onChange={(next) => setField("skillGroups", next)}
          suggestions={suggestions}
          errors={errors}
        />
      </Field>

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}