// src/features/projects/ArchitectureNodeEditor.tsx
"use client";
//
// 渲染「一个节点」的编辑区：标题、描述、详情、上移下移删除，
// 以及它所有的子节点，而子节点是用「同一个组件」渲染的（递归）。

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import IconButton from "@/components/ui/IconButton";
import { countNodes, type NodePatch } from "@/lib/architecture";
import type { ArchitectureNode } from "@/types/project";


export type NodeActions = {
  onUpdate: (id: string, patch: NodePatch) => void;
  onAddChild: (parentId: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, delta: -1 | 1) => void;
};

type Props = {
  node: ArchitectureNode;
  path: string;
  depth: number; // 0 = 根节点
  index: number; // 在兄弟之间排第几
  siblingCount: number;
  errors: Record<string, string>;
  actions: NodeActions;
};

export default function ArchitectureNodeEditor({
  node,
  path,
  depth,
  index,
  siblingCount,
  errors,
  actions,
}: Props) {
  const isRoot = depth === 0;
  const children = node.children ?? [];

  const [open, setOpen] = useState(isRoot || node.title.trim() === "");

  const hasErrorInside = Object.keys(errors).some(
    (key) => key === path || key.startsWith(`${path}.`),
  );
  const expanded = open || hasErrorInside;

  const titleError = errors[`${path}.title`];

  function handleAddChild() {
    actions.onAddChild(node.id);
    setOpen(true);
  }

  function handleRemove() {
    const descendants = countNodes(node) - 1;

    if (descendants > 0) {
      const name = node.title || "this node";
      const ok = window.confirm(
        `Delete "${name}" and its ${descendants} descendant node(s)?`,
      );
      if (!ok) return;
    }

    actions.onRemove(node.id);
  }

  return (
    <div className="border border-line bg-ink p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton
            label={expanded ? "Collapse node" : "Expand node"}
            onClick={() => setOpen(!expanded)}
          >
            {expanded ? "▾" : "▸"}
          </IconButton>

          <span className={`truncate ${titleError ? "text-alert" : "text-paper"}`}>
            {node.title || "Untitled node"}
          </span>

          {children.length > 0 && (
            <span className="hud-label shrink-0 text-gold-dim">
              {children.length} {children.length === 1 ? "child" : "children"}
            </span>
          )}
        </div>

        {!isRoot && (
          <div className="flex shrink-0 gap-1">
            <IconButton
              label={`Move ${node.title || "node"} up`}
              disabled={index === 0}
              onClick={() => actions.onMove(node.id, -1)}
            >
              ▲
            </IconButton>
            <IconButton
              label={`Move ${node.title || "node"} down`}
              disabled={index === siblingCount - 1}
              onClick={() => actions.onMove(node.id, 1)}
            >
              ▼
            </IconButton>
            <IconButton label={`Remove ${node.title || "node"}`} danger onClick={handleRemove}>
              ✕
            </IconButton>
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          <Field label="Title" htmlFor={`arch-${node.id}-title`} error={titleError}>
            <input
              id={`arch-${node.id}-title`}
              value={node.title}
              onChange={(event) => actions.onUpdate(node.id, { title: event.target.value })}
              className={inputClass(Boolean(titleError))}
            />
          </Field>

          <Field
            label="Description"
            htmlFor={`arch-${node.id}-description`}
            hint="A short line shown under the title"
            error={errors[`${path}.description`]}
          >
            <input
              id={`arch-${node.id}-description`}
              value={node.description ?? ""}
              onChange={(event) =>
                actions.onUpdate(node.id, { description: event.target.value })
              }
              className={inputClass(Boolean(errors[`${path}.description`]))}
            />
          </Field>

          <Field
            label="Details"
            htmlFor={`arch-${node.id}-details`}
            error={errors[`${path}.details`]}
          >
            <textarea
              id={`arch-${node.id}-details`}
              rows={3}
              value={node.details ?? ""}
              onChange={(event) => actions.onUpdate(node.id, { details: event.target.value })}
              className={inputClass(Boolean(errors[`${path}.details`]))}
            />
          </Field>

          {children.length > 0 && (
            <div className="space-y-4 border-l border-line pl-4">
              {children.map((child, childIndex) => (
                <ArchitectureNodeEditor
                  key={child.id}
                  node={child}
                  path={`${path}.children.${childIndex}`}
                  depth={depth + 1}
                  index={childIndex}
                  siblingCount={children.length}
                  errors={errors}
                  actions={actions}
                />
              ))}
            </div>
          )}

          <Button type="button" variant="ghost" onClick={handleAddChild}>
            + Add child
          </Button>
        </div>
      )}
    </div>
  );
}