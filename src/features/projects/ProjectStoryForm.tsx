"use client";

import Field, { inputClass } from "@/components/ui/Field";
import {
  validateProjectStory,
  type ProjectStoryFormValues,
} from "@/lib/validation/projectStory";
import FormActions from "./FormActions";
import { useSectionForm } from "./hooks/useSectionForm";
import ListEditor from "@/app/components/ui/ListEditor";

type Props = {
  projectId: string;
  initialValues: ProjectStoryFormValues;
};

export default function ProjectStoryForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectStoryFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/story`,
    initialValues,
    validate: validateProjectStory,
  });

  const { values, errors, setField } = form;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <Field
        label="Problem"
        htmlFor="problem"
        error={errors.problem}
        hint={`${values.problem.length} / 3000 — what was broken or missing?`}
      >
        <textarea
          id="problem"
          rows={5}
          value={values.problem}
          onChange={(event) => setField("problem", event.target.value)}
          className={inputClass(Boolean(errors.problem))}
        />
      </Field>

      <Field
        label="Approach"
        htmlFor="approach"
        error={errors.approach}
        hint={`${values.approach.length} / 3000 — how did you tackle it?`}
      >
        <textarea
          id="approach"
          rows={5}
          value={values.approach}
          onChange={(event) => setField("approach", event.target.value)}
          className={inputClass(Boolean(errors.approach))}
        />
      </Field>

      <ListEditor
        id="story-architecture"
        label="Architecture notes"
        items={values.architecture}
        onChange={(next) => setField("architecture", next)}
        addLabel="Add note"
        placeholder="One short sentence about how it is built"
        multiline
        hint="Short bullet points. The interactive architecture tree is a separate section."
        error={errors.architecture}
      />

      <Field
        label="Outcome"
        htmlFor="outcome"
        error={errors.outcome}
        hint={`${values.outcome.length} / 3000 — what changed because of it?`}
      >
        <textarea
          id="outcome"
          rows={5}
          value={values.outcome}
          onChange={(event) => setField("outcome", event.target.value)}
          className={inputClass(Boolean(errors.outcome))}
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