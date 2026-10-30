"use client";

import {
  validateProjectLists,
  type ProjectListsFormValues,
} from "@/lib/validation/projectLists";
import FormActions from "./FormActions";
import { useSectionForm } from "./hooks/useSectionForm";
import TagEditor from "@/app/components/ui/TagEditor";
import ListEditor from "@/app/components/ui/ListEditor";

type Props = {
  projectId: string;
  initialValues: ProjectListsFormValues;
  technologySuggestions: string[];
};

export default function ProjectListsForm({
  projectId,
  initialValues,
  technologySuggestions,
}: Props) {
  const form = useSectionForm<ProjectListsFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/lists`,
    initialValues,
    validate: validateProjectLists,
  });

  const { values, errors, setField } = form;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-8">
      <TagEditor
        id="technologies"
        label="Technologies"
        tags={values.technologies}
        onChange={(next) => setField("technologies", next)}
        suggestions={technologySuggestions}
        error={errors.technologies}
        hint="Press Enter or comma to add. Choosing from suggestions keeps spelling consistent."
      />

      <ListEditor
        id="features"
        label="Features"
        items={values.features}
        onChange={(next) => setField("features", next)}
        addLabel="Add feature"
        placeholder="What can users do with it?"
        multiline
        error={errors.features}
      />

      <ListEditor
        id="responsibilities"
        label="Responsibilities"
        items={values.responsibilities}
        onChange={(next) => setField("responsibilities", next)}
        addLabel="Add responsibility"
        placeholder="What did you build or own?"
        multiline
        error={errors.responsibilities}
      />

      <ListEditor
        id="challenges"
        label="Challenges"
        items={values.challenges}
        onChange={(next) => setField("challenges", next)}
        addLabel="Add challenge"
        placeholder="A hard problem you ran into"
        multiline
        error={errors.challenges}
      />

      <ListEditor
        id="solutions"
        label="Solutions"
        items={values.solutions}
        onChange={(next) => setField("solutions", next)}
        addLabel="Add solution"
        placeholder="How you solved it"
        multiline
        error={errors.solutions}
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