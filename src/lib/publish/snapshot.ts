import { AdminProject, Project } from "@/types/project";
import { isStorageKey } from "../imageRef";
import { Language, ProjectTranslation } from "@/types/translation";
import { buildTranslationMap } from "./translation";

export type PortfolioSnapshot = {
  version: 1;
  generatedAt: string;
  projects: Project[];
  translations: Partial<Record<Language, Record<string, ProjectTranslation>>>;
};

export function toPublicImageUrl(value: string, publicBase: string): string {
  return isStorageKey(value) ? `${publicBase}/${value}` : value;
}

export function toPublicProject(
  project: AdminProject,
  publicBase: string,
): Project {
  const { heroImage } = project;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    year: project.year,
    featured: project.featured,
    category: project.category,
    githubUrl: project.githubUrl,
    ...(project.demoUrl ? { demoUrl: project.demoUrl } : {}),
    thumbnail: toPublicImageUrl(project.thumbnail, publicBase),
    technologies: project.technologies,
    heroImage: {
      src: toPublicImageUrl(heroImage.src, publicBase),
      ...(heroImage.srcSet ? { srcSet: heroImage.srcSet } : {}),
      ...(heroImage.sizes ? { sizes: heroImage.sizes } : {}),
    },
    gallery: project.gallery.map((image) => ({
      id: image.id,
      imageUrl: toPublicImageUrl(image.imageUrl, publicBase),
      title: image.title,
      description: image.description,
    })),
    features: project.features,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
    story: project.story,
    ...(project.architecture ? { architecture: project.architecture } : {}),
  };
}
export function buildSnapshot(
  projects: AdminProject[],
  publicBase: string,
  rawTranslations: Partial<
    Record<Language, Record<string, ProjectTranslation>>
  > = {},
  now: Date = new Date(),
): PortfolioSnapshot {
  const published = projects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const translations: PortfolioSnapshot["translations"] = {};
  for (const lang of Object.keys(rawTranslations) as Language[]) {
    translations[lang] = buildTranslationMap(
      published,
      rawTranslations[lang] ?? {},
    );
  }

  return {
    version: 1,
    generatedAt: now.toISOString(),
    projects: published.map((project) => toPublicProject(project, publicBase)),
    translations,
  };
}
export function findSnapshotProblems(snapshot: PortfolioSnapshot): string[] {
  const problems: string[] = [];
  const seenSlugs = new Set<string>();

  if (snapshot.projects.length === 0) {
    problems.push("There are no published projects.");
  }

  for (const project of snapshot.projects) {
    if (seenSlugs.has(project.slug)) {
      problems.push(`Duplicate slug: "${project.slug}"`);
    }
    seenSlugs.add(project.slug);

    if (project.summary.trim() === "") {
      problems.push(`${project.title}: the summary is empty.`);
    }
    if (project.heroImage.src.trim() === "") {
      problems.push(`${project.title}: there is no hero image.`);
    }
  }

  return problems;
}

export function countStorageImages(project: AdminProject): number {
  return [
    project.thumbnail,
    project.heroImage.src,
    ...project.gallery.map((g) => g.imageUrl),
  ].filter(isStorageKey).length;
}
