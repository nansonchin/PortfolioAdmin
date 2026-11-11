"use client";

import Button from "@/components/ui/Button";
import { useTransitionRouter } from "@/components/transition/TransitionProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Message = { type: "ok" | "error"; text: string };

export default function PublishButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const { run } = useTransitionRouter();
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function publish() {
    try {
      const response = await fetch("/api/publish", { method: "POST" });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        problems?: string[];
        projectCount?: number;
        bytes?: number;
      } | null;

      if (!response.ok) {
        const reason = data?.problems?.[0] ?? data?.error ?? "Publish failed";
        setMessage({ type: "error", text: reason });
        return;
      }

      const kb = Math.max(1, Math.round((data?.bytes ?? 0) / 1024));
      setMessage({
        type: "ok",
        text: `Published ${data?.projectCount ?? 0} projects (${kb} KB).`,
      });

      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setMessage(null);

    try {
      // Publishing is rare and heavy, so it gets the full blast door.
      await run("Publishing", publish);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="button" disabled={disabled} loading={publishing} onClick={handlePublish}>
        {publishing ? "Publishing…" : "Publish now"}
      </Button>

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
