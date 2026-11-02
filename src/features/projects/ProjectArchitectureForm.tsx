// src/features/projects/ProjectArchitectureForm.tsx
"use client";

import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import { addChild, countNodes, moveNode, removeNode, updateNode } from "@/lib/architecture";
import {
  validateProjectArchitecture,
  type ProjectArchitectureFormValues,
} from "@/lib/validation/projectArchitecture";
import ArchitectureNodeEditor, { type NodeActions } from "./ArchitectureNodeEditor";
import { createArchitecture, createNode } from "./architectureForm";
import FormActions from "./FormActions";
import { useSectionForm } from "./hooks/useSectionForm";

type Props = {
  projectId: string;
  initialValues: ProjectArchitectureFormValues;
};

export default function ProjectArchitectureForm({ projectId, initialValues }: Props) {
  const form = useSectionForm<ProjectArchitectureFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/architecture`,
    initialValues,
    validate: validateProjectArchitecture,
  });

  const { values, errors, setField } = form;
  const architecture = values.architecture;

  function updateRoot(change: (root: NonNullable<typeof architecture>["root"]) => NonNullable<typeof architecture>["root"]) {
    if (!architecture) return;
    setField("architecture", { ...architecture, root: change(architecture.root) });
  }

  const actions: NodeActions = {
    onUpdate: (id, patch) => updateRoot((root) => updateNode(root, id, patch)),
    onAddChild: (parentId) => updateRoot((root) => addChild(root, parentId, createNode())),
    onRemove: (id) => updateRoot((root) => removeNode(root, id)),
    onMove: (id, delta) => updateRoot((root) => moveNode(root, id, delta)),
  };

  function handleRemoveArchitecture() {
    if (window.confirm("Remove the whole architecture diagram from this project?")) {
      setField("architecture", null);
    }
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      {architecture === null ? (
        <div className="border border-line bg-ink p-6 text-center">
          <p className="text-muted">This project has no architecture diagram.</p>
          <div className="mt-4 inline-block">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setField("architecture", createArchitecture())}
            >
              + Create architecture
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Field label="Diagram title" htmlFor="arch-title" error={errors["architecture.title"]}>
            <input
              id="arch-title"
              value={architecture.title}
              onChange={(event) =>
                setField("architecture", { ...architecture, title: event.target.value })
              }
              className={inputClass(Boolean(errors["architecture.title"]))}
            />
          </Field>

          <Field
            label="Diagram description"
            htmlFor="arch-description"
            error={errors["architecture.description"]}
          >
            <textarea
              id="arch-description"
              rows={3}
              value={architecture.description}
              onChange={(event) =>
                setField("architecture", { ...architecture, description: event.target.value })
              }
              className={inputClass(Boolean(errors["architecture.description"]))}
            />
          </Field>

          {errors["architecture.root"] && (
            <p role="alert" className="hud-label text-alert">
              ⚠ {errors["architecture.root"]}
            </p>
          )}

          <ArchitectureNodeEditor
            node={architecture.root}
            path="architecture.root"
            depth={0}
            index={0}
            siblingCount={1}
            errors={errors}
            actions={actions}
          />

          <div className="flex items-center justify-between">
            <span className="hud-label text-gold-dim">
              {countNodes(architecture.root)} / 100 nodes
            </span>
            <Button type="button" variant="ghost" onClick={handleRemoveArchitecture}>
              Remove architecture
            </Button>
          </div>
        </>
      )}

      <FormActions
        dirty={form.dirty}
        saving={form.saving}
        message={form.message}
        onDiscard={form.handleDiscard}
      />
    </form>
  );
}