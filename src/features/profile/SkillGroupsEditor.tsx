"use client";

import TagEditor from "@/app/components/ui/TagEditor";
import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";
import IconButton from "@/components/ui/IconButton";
import { moveItem, removeAt, replaceAt } from "@/lib/array";
import type { SkillGroup } from "@/types/site";

type Props = {
  groups: SkillGroup[];
  onChange: (next: SkillGroup[]) => void;
  suggestions: string[];
  errors: Record<string, string>;
};

export default function SkillGroupsEditor({ groups, onChange, suggestions, errors }: Props) {
  function updateGroup(index: number, patch: Partial<SkillGroup>) {
    onChange(replaceAt(groups, index, { ...groups[index], ...patch }));
  }

  // 顶层的 errors.skillGroups 只是第一个子错误的复本（见 issuesToFieldErrors），
  // 有子错误时就不重复显示
  const hasGroupErrors = Object.keys(errors).some((key) => key.startsWith("skillGroups."));
  const topError = hasGroupErrors ? undefined : errors.skillGroups;

  return (
    <div className="space-y-4">
      {groups.length === 0 && <p className="text-sm text-muted">No groups yet.</p>}

      {groups.map((group, index) => (
        <div key={index} className="border border-line bg-ink p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="hud-label text-gold-dim">
              Group {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex gap-1">
              <IconButton
                label={`Move group ${index + 1} up`}
                disabled={index === 0}
                onClick={() => onChange(moveItem(groups, index, -1))}
              >
                ▲
              </IconButton>
              <IconButton
                label={`Move group ${index + 1} down`}
                disabled={index === groups.length - 1}
                onClick={() => onChange(moveItem(groups, index, 1))}
              >
                ▼
              </IconButton>
              <IconButton
                label={`Remove group ${index + 1}`}
                danger
                onClick={() => onChange(removeAt(groups, index))}
              >
                ✕
              </IconButton>
            </div>
          </div>

          <div className="space-y-4">
            <Field
              label="Group title"
              htmlFor={`group-${index}-title`}
              error={errors[`skillGroups.${index}.title`]}
            >
              <input
                id={`group-${index}-title`}
                value={group.title}
                onChange={(event) => updateGroup(index, { title: event.target.value })}
                className={inputClass(Boolean(errors[`skillGroups.${index}.title`]))}
              />
            </Field>

            <TagEditor
              id={`group-${index}-items`}
              label="Skills"
              tags={group.items}
              onChange={(next) => updateGroup(index, { items: next })}
              suggestions={suggestions}
              error={errors[`skillGroups.${index}.items`]}
            />
          </div>
        </div>
      ))}

      {topError && (
        <p role="alert" className="hud-label text-alert">
          ⚠ {topError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange([...groups, { title: "", items: [] }])}
        >
          + Add group
        </Button>
        <span className="hud-label text-gold-dim">{groups.length} / 8 groups</span>
      </div>
    </div>
  );
}