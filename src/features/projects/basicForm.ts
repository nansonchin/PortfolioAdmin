import { ProjectBasicFormValues } from "@/lib/validation/projectBasic";
import { AdminProject } from "@/types/project";

export function toFormValues(project: AdminProject): ProjectBasicFormValues {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    year: String(project.year),
    category: project.category,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl ?? "",
    featured: project.featured,
    status: project.status,
  };
}