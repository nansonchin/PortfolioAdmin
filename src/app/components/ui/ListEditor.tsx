// src/components/ui/ListEditor.tsx
"use client";

import Button from "@/components/ui/Button";
import Field, { inputClass } from "@/components/ui/Field";

type ListEditorProps = {
  id: string;
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addLabel: string; 
  placeholder?: string;
  multiline?: boolean; 
  error?: string;
  hint?: string;
};

const iconButtonClass =
  "hud-label border border-line px-2 py-1 text-muted transition hover:text-gold disabled:opacity-30 disabled:hover:text-muted";

export default function ListEditor({
  id,
  label,
  items,
  onChange,
  addLabel,
  placeholder,
  multiline = false,
  error,
  hint,
}: ListEditorProps) {

  function updateAt(index: number, text: string) {
    onChange(items.map((item, i) => (i === index ? text : item)));
  }


  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...items, ""]);
  }

  return (
    <Field label={label} htmlFor={`${id}-0`} error={error} hint={hint}>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">No items yet.</p>}

        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="hud-label w-6 shrink-0 pt-3 text-gold-dim">
              {String(index + 1).padStart(2, "0")}
            </span>

            {multiline ? (
              <textarea
                id={`${id}-${index}`}
                rows={2}
                value={item}
                placeholder={placeholder}
                aria-label={`${label} ${index + 1}`}
                onChange={(event) => updateAt(index, event.target.value)}
                className={inputClass(false)}
              />
            ) : (
              <input
                id={`${id}-${index}`}
                value={item}
                placeholder={placeholder}
                aria-label={`${label} ${index + 1}`}
                onChange={(event) => updateAt(index, event.target.value)}
                className={inputClass(false)}
              />
            )}

            <div className="flex shrink-0 gap-1 pt-2">
              <button
                type="button"
                className={iconButtonClass}
                aria-label={`Move ${label} ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                ▲
              </button>
              <button
                type="button"
                className={iconButtonClass}
                aria-label={`Move ${label} ${index + 1} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                ▼
              </button>
              <button
                type="button"
                className={`${iconButtonClass} hover:text-alert`}
                aria-label={`Remove ${label} ${index + 1}`}
                onClick={() => removeAt(index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <Button type="button" variant="ghost" onClick={add}>
          + {addLabel}
        </Button>
      </div>
    </Field>
  );
}