"use client";
import Field, { inputClass } from "@/components/ui/Field";
import { useState, type KeyboardEvent } from "react";

type TagEditorProps = {
  id: string;
  label: string;
  tags: string[];
  onChange: (next: string[]) => void;
  suggestions: string[];
  error?: string;
  hint?: string;
};

export default function TagEditor({
  id,
  label,
  tags,
  onChange,
  suggestions,
  error,
  hint,
}: TagEditorProps) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const typed = raw.trim();
    if (typed === "") return;

    const lower = typed.toLowerCase();
    const canonical = suggestions.find((s) => s.toLowerCase() === lower) ?? typed;
    const alreadyHas = tags.some((tag) => tag.toLowerCase() === lower);

    if (!alreadyHas) onChange([...tags, canonical]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  const remaining = suggestions.filter(
    (s) => !tags.some((tag) => tag.toLowerCase() === s.toLowerCase()),
  );

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.length === 0 && <p className="text-sm text-muted">No tags yet.</p>}

        {tags.map((tag) => (
          <span
            key={tag}
            className="hud-label flex items-center gap-2 border border-line bg-ink px-3 py-1.5 text-paper"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="text-muted transition hover:text-alert"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        id={id}
        list={`${id}-suggestions`}
        value={draft}
        placeholder="Type a technology, press Enter"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        className={inputClass(false)}
      />

      <datalist id={`${id}-suggestions`}>
        {remaining.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </Field>
  );
}