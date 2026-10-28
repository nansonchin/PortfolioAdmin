
import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export default function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="hud-label text-gold-dim">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="hud-label mt-2 text-alert">
          ⚠ {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function inputClass(hasError: boolean): string {
  return `w-full border bg-ink px-4 py-3 text-paper outline-none transition ${
    hasError ? "border-alert" : "border-line focus:border-gold"
  }`;
}