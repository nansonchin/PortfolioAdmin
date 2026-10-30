import type {
  AdminProject,
  ProjectArchitecture,
  ProjectBasic,
  ProjectGalleryImage,
  ProjectLists,
  ProjectStatus,
  ProjectStory,
  ResponsiveImage,
} from "@/types/project";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  year: number;
  featured: boolean;
  category: string;
  github_url: string;
  demo_url: string | null;
  thumbnail: string;
  technologies: string[];
  hero_image: ResponsiveImage;
  gallery: ProjectGalleryImage[];
  features: string[];
  responsibilities: string[];
  challenges: string[];
  solutions: string[];
  story: ProjectStory;
  architecture: ProjectArchitecture | null;
  status: ProjectStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectRowInput = Omit<ProjectRow, "created_at" | "updated_at">;

export function rowToProject(row: ProjectRow): AdminProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    year: row.year,
    featured: row.featured,
    category: row.category,
    githubUrl: row.github_url,
    demoUrl: row.demo_url ?? undefined,
    thumbnail: row.thumbnail,
    technologies: row.technologies,
    heroImage: row.hero_image,
    gallery: row.gallery,
    features: row.features,
    responsibilities: row.responsibilities,
    challenges: row.challenges,
    solutions: row.solutions,
    story: row.story,
    architecture: row.architecture ?? undefined,
    status: row.status,
    sortOrder: row.sort_order,
  };
}

export function projectToRow(project: AdminProject): ProjectRowInput {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    year: project.year,
    featured: project.featured,
    category: project.category,
    github_url: project.githubUrl,
    demo_url: project.demoUrl || null,
    thumbnail: project.thumbnail,
    technologies: project.technologies,
    hero_image: project.heroImage,
    gallery: project.gallery,
    features: project.features,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
    story: project.story,
    architecture: project.architecture ?? null,
    status: project.status,
    sort_order: project.sortOrder,
  };
}

export function basicToRowPatch(input: ProjectBasic): Partial<ProjectRowInput> {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    description: input.description,
    year: input.year,
    category: input.category,
    github_url: input.githubUrl,
    demo_url: input.demoUrl || null,
    featured: input.featured,
    status: input.status,
  };
}

export function listsToRowPatch(input: ProjectLists): Partial<ProjectRowInput> {
  return {
    technologies: input.technologies,
    features: input.features,
    responsibilities: input.responsibilities,
    challenges: input.challenges,
    solutions: input.solutions,
  };
}

export function storyToRowPatch(input:ProjectStory):Partial<ProjectRowInput>{
  return {story:input}
}