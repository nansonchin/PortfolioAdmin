"use client";

import Button from "@/components/ui/Button";
import {
  TransitionError,
  useTransitionRouter,
} from "@/components/transition/TransitionProvider";
import { DeletedProject } from "@/types/project";
import {
  DateRange,
  DEFAULT_DELETED_FILTERS,
  DeletedFilters,
  DeletedSort,
  filterDeleted,
  formatUtcDate,
  getDeletedCategories,
  getDeletedYears,
  hasActiveFilters,
} from "./deletedFilter";
import { useMemo, useState } from "react";
import { ALL } from "./filter";

type Props = {
  items: DeletedProject[];
  now: number;
};

const controlClass =
  "border border-line bg-ink px-3 py-2 text-paper outline-none transition focus:border-gold";

export default function DeletedProjectList({ items, now }: Props) {
  const { navigate } = useTransitionRouter();

  const [filters, setFilters] = useState<DeletedFilters>(
    DEFAULT_DELETED_FILTERS,
  );

  const visible = useMemo(
    () => filterDeleted(items, filters, now),
    [items, filters, now],
  );
  const categories = useMemo(() => getDeletedCategories(items), [items]);
  const years = useMemo(() => getDeletedYears(items), []);

  function updateFilter<K extends keyof DeletedFilters>(
    key: K,
    value: DeletedFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function handleRestore(id: string) {
    navigate(`/projects/${encodeURIComponent(id)}`, {
      label: "Restoring project",
      skipGuard: true,
      refresh: true,
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
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={filters.query}
            onChange={(event) => updateFilter("query", event.target.value)}
            placeholder="Search title or slug ... "
            aria-label="Search  deleted projects"
            className={`${controlClass} min-w-56 flex-1`}
          />
          <select
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
            aria-label="Filter by category"
            className={controlClass}
          >
            <option value={ALL}>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filters.year}
            onChange={(event) => updateFilter("year", event.target.value)}
            aria-label="Filter by project year"
            className={controlClass}
          >
            <option value={ALL}>All years</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filters.range}
            onChange={(event) =>
              updateFilter("range", event.target.value as DateRange)
            }
            aria-label="Filter by deletion date"
            className={controlClass}
          >
            <option value="all">Deleted: any time</option>
            <option value="last7">Deleted: last 7 days</option>
            <option value="last30">Deleted: last 30 days</option>
            <option value="older30">Deleted: over 30 days ago</option>
            <option value="custom">Deleted: custom range</option>
          </select>
          <select
            value={filters.sort}
            onChange={(event) =>
              updateFilter("sort", event.target.value as DeletedSort)
            }
            aria-label="Sort"
            className={controlClass}
          >
            <option value="newest">Newest deleted first</option>
            <option value="oldest">Oldest deleted first</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
        {filters.range === "custom" && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="hud-label flex items-center gap-2 text-muted">
              From
              <input
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(event) => updateFilter("from", event.target.value)}
                className="controlClass"
              />
            </label>
            <label className="hud-label flex items-center gap-2 text-muted">
              To
              <input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(event) => updateFilter("to", event.target.value)}
                className={controlClass}
              />
            </label>
            <span className="hud-label text-gold-dim">UTC days</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="hud-label text-gold-dim">
            Showing {visible.length} of {items.length}
          </span>
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_DELETED_FILTERS)}
              className="hud-label text-gold-dim transition hover:text-gold"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="py-8 text-center text-muted">
          No deleted projects match these filters.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {visible.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-paper">{item.title}</p>
                <p className="hud-label text-muted">
                  {item.slug}
                  {item.category ? ` · ${item.category}` : ""} · {item.year}
                </p>
              </div>

              <span className="hud-label text-muted" title="Deleted on (UTC)">
                {formatUtcDate(item.deletedAt)}
              </span>

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
      )}
    </div>
  );
}
