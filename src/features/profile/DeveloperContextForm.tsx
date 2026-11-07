// src/features/profile/DeveloperContextForm.tsx
"use client";

import ListEditor from "@/app/components/ui/ListEditor";
import TagEditor from "@/app/components/ui/TagEditor";
import TextField from "@/components/ui/TextField";
import FormActions from "@/features/projects/FormActions";
import { useSectionForm } from "@/features/projects/hooks/useSectionForm";
import {
  validateDeveloperContext,
  type DeveloperContextFormValues,
} from "@/lib/validation/siteContent";

type Props = {
  initialValues: DeveloperContextFormValues;
  suggestions: string[];
};

export default function DeveloperContextForm({ initialValues, suggestions }: Props) {
  const form = useSectionForm<DeveloperContextFormValues>({
    endpoint: "/api/site/developer-context",
    initialValues,
    validate: validateDeveloperContext,
  });

  const { values, errors, setField } = form;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="dev-name"
          label="Name"
          value={values.name}
          onChange={(next) => setField("name", next)}
          hint="Shown in the navigation bar and the footer."
          error={errors.name}
        />
        <TextField
          id="dev-role"
          label="Role"
          value={values.role}
          onChange={(next) => setField("role", next)}
          error={errors.role}
        />
      </div>

      <TextField
        id="dev-description"
        label="Description"
        value={values.description}
        onChange={(next) => setField("description", next)}
        multiline
        rows={4}
        hint="Background for JARVIS, the AI assistant."
        error={errors.description}
      />

      <ListEditor
        id="dev-background"
        label="Background"
        items={values.background}
        onChange={(next) => setField("background", next)}
        addLabel="Add item"
        placeholder="e.g. IT Diploma"
        error={errors.background}
      />

      <TagEditor
        id="dev-skills"
        label="Skills"
        tags={values.skills}
        onChange={(next) => setField("skills", next)}
        suggestions={suggestions}
        hint="Also scroll across the home page marquee."
        error={errors.skills}
      />

      <ListEditor
        id="dev-goals"
        label="Goals"
        items={values.goals}
        onChange={(next) => setField("goals", next)}
        addLabel="Add goal"
        placeholder="What you want to build or learn"
        multiline
        error={errors.goals}
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