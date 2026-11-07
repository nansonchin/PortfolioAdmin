import Field, { inputClass } from "./Field";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
};

export default function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  multiline = false,
  rows = 3,
}: TextFieldProps) {
  const common = {
    id,
    value,
    placeholder,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
    className: inputClass(Boolean(error)),
  };

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      {multiline ? (
        <textarea {...common} rows={rows} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...common} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}