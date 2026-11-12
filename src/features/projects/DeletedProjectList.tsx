"use client";

import Button from "@/components/ui/Button";
import {
  TransitionError,
  useTransitionRouter,
} from "@/components/transition/TransitionProvider";

type DeletedItem = {
  id: string;
  title: string;
  slug: string;
  year: number;
};

export default function DeletedProjectList({
  items,
}: {
  items: DeletedItem[];
}) {
  const { navigate } = useTransitionRouter();

  async function handleRestore(id: string) {
    navigate(`/projects/${encodeURIComponent(id)}`, {
      label: "Restoring project",
      skipGuard: true,
      before: async () => {
        let response: Response;
        try {
          response = await fetch(
            `/api/projects/${encodeURIComponent(id)}/restore`,
            {
              method: "POST",
            },
          );
        } catch {
          throw new TransitionError("Network error. Nothing was restored.");
        }

        if (!response.ok) {
          throw new TransitionError("Could not restore the project.");
        }
      },
    });
  }
  if (items.length === 0) {
    return <p className="text-muted">Nothing has been deleted.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center gap-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-paper">{item.title}</p>
            <p className="hud-label text-muted">{item.slug}</p>
          </div>
          <span className="hud-label text-muted">{item.year}</span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleRestore(item.id)}
          >
            Restore as draft
          </Button>
        </li>
      ))}
    </ul>
  );
}
