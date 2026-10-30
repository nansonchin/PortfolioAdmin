"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Toggle from "@/components/ui/Toggle";
import type { ProjectFlagsPatch } from "@/types/project";
import {
  ALL,
  DEFAULT_FILTERS,
  filterProjects,
  getCategories,
  type ProjectFilters,
} from "./filter";
import type { ProjectListItem } from "./listItem";
import Link from "next/link";

const controlClass =
  "border border-line bg-ink px-3 py-2 text-paper outline-none transition focus:border-gold";

export default function ProjectTable({
  initialItems,
}: {
  initialItems: ProjectListItem[];
}) {
  const router = useRouter();

  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);

  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const visibleItems = useMemo(
    () => filterProjects(items, filters),
    [items, filters],
  );
  const categories = useMemo(() => getCategories(items), [items]);

  function setSaving(id: string, saving: boolean) {
    setSavingIds((current) => {
      const next = new Set(current);
      if (saving) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function updateItem(id: string, patch: ProjectFlagsPatch) {
    const previous = items.find((item) => item.id === id);
    if (!previous) return;

    const rollback: ProjectFlagsPatch = {};
    if (patch.featured !== undefined) rollback.featured = previous.featured;
    if (patch.status !== undefined) rollback.status = previous.status;

    setError(null);
    setSaving(id, true);
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      router.refresh();
    } catch {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...rollback } : item,
        ),
      );
      setError("Could not save the change. Nothing was modified.");
    } finally {
      setSaving(id, false);
    }
  }

  function updateFilter<K extends keyof ProjectFilters>(
    key: K,
    value: ProjectFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <Panel
      title="All projects"
      tag={`${visibleItems.length} of ${items.length}`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={filters.query}
          onChange={(event) => updateFilter("query", event.target.value)}
          placeholder="Search title, tech, category..."
          aria-label="Search projects"
          className={`${controlClass} min-w-56 flex-1`}
        />

        <select
          value={filters.status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as ProjectFilters["status"],
            )
          }
          aria-label="Filter by status"
          className={controlClass}
        >
          <option value={ALL}>All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
          aria-label="Filter by category"
          className={controlClass}
        >
          <option value={ALL}>All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="hud-label flex items-center gap-3 text-muted">
          <Toggle
            checked={filters.featuredOnly}
            onChange={(next) => updateFilter("featuredOnly", next)}
            label="Show featured only"
          />
          Featured only
        </label>
      </div>

      {error && (
        <p role="alert" className="hud-label mb-4 text-alert">
          ⚠ {error}
        </p>
      )}

      {visibleItems.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-muted">No projects match these filters.</p>
          <div className="mt-4 inline-block">
            <Button variant="ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reset filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="hud-label border-b border-line text-gold-dim">
                <th className="py-3 pr-4 font-normal">#</th>
                <th className="py-3 pr-4 font-normal">Title</th>
                <th className="py-3 pr-4 font-normal">Year</th>
                <th className="py-3 pr-4 font-normal">Category</th>
                <th className="py-3 pr-4 font-normal">Featured</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => {
                const saving = savingIds.has(item.id);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-line/60 transition hover:bg-gold/5"
                  >
                    <td className="hud-label py-3 pr-4 text-gold-dim">
                      {String(item.sortOrder + 1).padStart(2, "0")}
                    </td>

                    <td className="py-3 pr-4">
                      <p className="text-paper">{item.title}</p>
                      <p className="hud-label text-muted">{item.slug}</p>
                    </td>

                    <td className="hud-label py-3 pr-4 text-muted">
                      {item.year}
                    </td>
                    <td className="py-3 pr-4 text-muted">
                      {item.category || "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <Toggle
                        checked={item.featured}
                        disabled={saving}
                        onChange={(next) =>
                          updateItem(item.id, { featured: next })
                        }
                        label={`Featured: ${item.title}`}
                      />
                    </td>

                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Toggle
                          checked={item.status === "published"}
                          disabled={saving}
                          onChange={(next) =>
                            updateItem(item.id, {
                              status: next ? "published" : "draft",
                            })
                          }
                          label={`Published: ${item.title}`}
                        />
                        <span
                          className={`hud-label ${
                            item.status === "published"
                              ? "text-gold"
                              : "text-alert"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3">
                      <Link
                        href={`/projects/${encodeURIComponent(item.id)}`}
                        className="hud-label text-gold transition hover:text-gold-bright"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
