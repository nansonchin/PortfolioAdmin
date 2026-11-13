import { DeletedProject } from "@/types/project";
import { ALL } from "./filter";
import { Delete } from "@aws-sdk/client-s3";

export type DateRange = "all" | "last7" | "last30" | "older30" | "custom";

export type DeletedSort = "newest" | "oldest" | "title";

export type DeletedFilters = {
  query: string;
  category: string;
  year: string;
  range: DateRange;
  from: string;
  to: string;
  sort: DeletedSort;
};

export const DEFAULT_DELETED_FILTERS: DeletedFilters = {
  query: "",
  category: ALL,
  year: ALL,
  range: "all",
  from: "",
  to: "",
  sort: "newest",
};

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(
  day: string,
  edge: "start" | "end",
  fallback: number,
): number {
  if (!day) {
    return fallback;
  }

  const time = Date.parse(
    edge === "start" ? `${day}T00:00:00.000Z` : `${day}T23:59:59.999Z`,
  );

  return Number.isNaN(time) ? fallback : time;
}

export function filterDeleted(
  items: DeletedProject[],
  filters: DeletedFilters,
  now: number,
): DeletedProject[] {
  const query = filters.query.trim().toLowerCase();
  const from = parseDay(filters.from, "start", -Infinity);
  const to = parseDay(filters.to, "end", Infinity);

  const filtered = items.filter((item) => {
    if (filters.category !== ALL && item.category !== filters.category) {
      return false;
    }
    if (filters.year !== ALL && String(item.year) !== filters.year) {
      return false;
    }

    if (query && !`${item.title} ${item.slug}`.toLowerCase().includes(query)) {
      return false;
    }

    const deletedAt = Date.parse(item.deletedAt);
    const age = now - deletedAt;

    switch (filters.range) {
      case "last7":
        return age <= 7 * DAY_MS;
      case "last30":
        return age <= 30 * DAY_MS;
      case "older30":
        return age > 30 * DAY_MS;
      case "custom":
        return deletedAt >= from && deletedAt <= to;
      default:
        return true;
    }
  });
  return filtered.sort((a, b) => {
    if (filters.sort === "title") return a.title.localeCompare(b.title);

    const diff = Date.parse(b.deletedAt) - Date.parse(a.deletedAt);
    return filters.sort === "newest" ? diff : -diff;
  });
}

export function getDeletedCategories(items: DeletedProject[]): string[] {
  return [...new Set(items.map((item) => item.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function getDeletedYears(items: DeletedProject[]): number[] {
  return [...new Set(items.map((item) => item.year))].sort((a, b) => b - a);
}

export function hasActiveFilters(filters: DeletedFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.category !== ALL ||
    filters.year !== ALL ||
    filters.range !== "all" ||
    filters.sort !== "newest"
  );
}

export function formatUtcDate(iso: string): string {
  return iso.slice(0, 10);
}