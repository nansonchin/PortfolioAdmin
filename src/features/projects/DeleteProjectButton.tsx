// src/features/projects/DeleteProjectButton.tsx
"use client";

import { TransitionError, useTransitionRouter } from "@/components/transition/TransitionProvider";


type Props = {
  projectId: string;
  title: string;
};

export default function DeleteProjectButton({ projectId, title }: Props) {
  const { navigate } = useTransitionRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}"?\n\nIt disappears from the admin right away, and from the portfolio the next time you publish. Nothing is erased: you can restore it from the Deleted list.`,
    );
    if (!confirmed) return;

    navigate("/projects", {
      label: "Deleting project",
      replace: true,

      refresh: true,

      skipGuard: true,

      before: async () => {
        let response: Response;

        try {
          response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
            method: "DELETE",
          });
        } catch {
          throw new TransitionError("Network error. Nothing was deleted.");
        }

        if (!response.ok) {
          throw new TransitionError("Could not delete the project. Nothing was changed.");
        }
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="chamfer hud-label bg-alert px-6 py-3 text-ink transition hover:opacity-90"
    >
      Delete project
    </button>
  );
}