import { TranslationProgress } from "@/lib/translation/form";
import { AdminProject } from "@/types/project";

export type ProjectListItem = Pick<
  AdminProject,
  | "id"
  | "slug"
  | "title"
  | "year"
  | "category"
  | "featured"
  | "status"
  | "sortOrder"
  | "technologies"
>&{
  translation?:TranslationProgress
};

export function toListItem(project: AdminProject,translation?: TranslationProgress): ProjectListItem {
  return {
    id: project.id,
    slug: project.slug,
    title:project.title,
    year:project.year,
    category:project.category,
    featured:project.featured,
    status:project.status,
    sortOrder:project.sortOrder,
    technologies:project.technologies,
    translation
  };
}
