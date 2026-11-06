import Field, { inputClass } from "@/components/ui/Field";

type TranslateRowProps = {
  id: string;
  label: string;
  english: string;
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  rows?: number;
  error?: string;
  indent?: number;
};

export default function TranslateRow({
  id,
  label,
  english,
  value,
  onChange,
  multiline = false,
  rows = 3,
  error,
  indent = 0,
}: TranslateRowProps) {
  if (english.trim() === "" && value.trim() === "") {
    return null;
  }

  return (
    <div
      className="grid gap-3 md:grid-cols-2"
      style={{ paddingLeft: indent * 16 }}
    >
      <div>
        <p className="hud-label text-gold-dim">{label} · EN</p>
        <p className="mt-2 text-sm whitespace-pre-wrap text-muted">
          {english || "-"}
        </p>
      </div>
      <Field label={`${label} · 中文`} htmlFor={id} error={error}>
            {
                multiline?(
                    <textarea
                        id={id}
                        lang="zh-CN"
                        rows={rows}
                        value={value}
                        onChange={(event)=> onChange(event.target.value)}
                        className={inputClass(Boolean(error))}
                    />
                ):(
                    <input
                        id={id}
                        lang="zh-CN"
                        value={value}
                        onChange={(event)=>onChange(event.target.value)}
                        className={inputClass(Boolean(error))}
                    />
                )
            }
      </Field>
    </div>
  );
}
