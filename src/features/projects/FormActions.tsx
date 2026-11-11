import Button from "@/components/ui/Button";
import { FormMessage } from "./hooks/useSectionForm";

type FormActionsProps = {
  dirty: boolean;
  saving: boolean;
  message: FormMessage | null;
  onDiscard: () => void;
};

export default function FormActions({ dirty, saving, message, onDiscard }: FormActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
      <Button type="submit" disabled={!dirty} loading={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>

      {dirty && !saving && (
        <Button type="button" variant="ghost" onClick={onDiscard}>
          Discard
        </Button>
      )}

      {dirty && !message && !saving && (
        <span className="hud-label flex items-center gap-2 text-gold-dim">
          <span className="inline-block size-2 bg-amber" />
          Unsaved changes
        </span>
      )}

      {message && (
        <span
          role={message.type === "error" ? "alert" : "status"}
          className={`hud-label ${message.type === "ok" ? "text-gold" : "text-alert"}`}
        >
          {message.type === "ok" ? "✓" : "⚠"} {message.text}
        </span>
      )}
    </div>
  );
}
