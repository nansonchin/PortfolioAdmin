import type { AdminProject } from "@/types/project";

export type ProjectStats = {
  total: number;
  published: number;
  drafts: number;
  featured: number;
};

export function getProjectStats(projects: AdminProject[]): ProjectStats {
  return{
    total:projects.length,
    published:projects.filter((p)=>p.status ==="published").length,
    drafts:projects.filter((p)=>p.status==="draft").length,
    featured:projects.filter((p)=>p.featured).length
  }
}

export type TechCount = {
  name: string;
  count: number;
};

export function getTopTechnologies(
  projects: AdminProject[],
  limit = 6,
): TechCount[] {
  const counts = new Map<string, number>();

  for (const tech of projects.flatMap((p) => p.technologies)) {
    counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}