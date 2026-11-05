import type { AdminProject, ArchitectureNode, ProjectStory } from "@/types/project";
import type { NodeTranslation, ProjectTranslation } from "@/types/translation";

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function alignList(
  translated: string[] | undefined,
  original: string[],
): string[] | undefined {
  if (!translated || original.length === 0) return undefined;

  const hasAny = original.some((_, index) => clean(translated[index]) !== undefined);
  if (!hasAny) return undefined;

  return original.map((english, index) => clean(translated[index]) ?? english);
}

function collectNodeIds(node: ArchitectureNode, into: Set<string> = new Set()): Set<string> {
  into.add(node.id);
  for (const child of node.children ?? []) collectNodeIds(child, into);
  return into;
}

function cleanNode(node: NodeTranslation | undefined): NodeTranslation | undefined {
  if (!node) return undefined;

  const title = clean(node.title);
  const description = clean(node.description);
  const details = clean(node.details);

  if (!title && !description && !details) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(details ? { details } : {}),
  };
}

export function toPublicTranslation(
  project: AdminProject,
  translation: ProjectTranslation,
): ProjectTranslation | null {
  const result: ProjectTranslation = {};

  for (const key of ["title", "summary", "description"] as const) {
    const value = clean(translation[key]);
    if (value) result[key] = value;
  }

  for (const key of ["features", "responsibilities", "challenges", "solutions"] as const) {
    const aligned = alignList(translation[key], project[key]);
    if (aligned) result[key] = aligned;
  }

  const story: Partial<ProjectStory> = {};
  for (const key of ["problem", "approach", "outcome"] as const) {
    const value = clean(translation.story?.[key]);
    if (value) story[key] = value;
  }
  const storyNotes = alignList(translation.story?.architecture, project.story.architecture);
  if (storyNotes) story.architecture = storyNotes;
  if (Object.keys(story).length > 0) result.story = story;

  const gallery: NonNullable<ProjectTranslation["gallery"]> = {};
  for (const image of project.gallery) {
    const cleaned = cleanNode(translation.gallery?.[image.id]);
    if (cleaned) gallery[image.id] = { title: cleaned.title, description: cleaned.description };
  }
  if (Object.keys(gallery).length > 0) result.gallery = gallery;

  if (project.architecture && translation.architecture) {
    const validIds = collectNodeIds(project.architecture.root);
    const nodes: Record<string, NodeTranslation> = {};

    for (const [id, node] of Object.entries(translation.architecture.nodes ?? {})) {
      const cleaned = validIds.has(id) ? cleanNode(node) : undefined;
      if (cleaned) nodes[id] = cleaned;
    }

    const title = clean(translation.architecture.title);
    const description = clean(translation.architecture.description);

    if (title || description || Object.keys(nodes).length > 0) {
      result.architecture = {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(Object.keys(nodes).length > 0 ? { nodes } : {}),
      };
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

export function buildTranslationMap(
  published: AdminProject[],
  byProjectId: Record<string, ProjectTranslation>,
): Record<string, ProjectTranslation> {
  const bySlug: Record<string, ProjectTranslation> = {};

  for (const project of published) {
    const translation = byProjectId[project.id];
    if (!translation) continue;

    const publicTranslation = toPublicTranslation(project, translation);
    if (publicTranslation) bySlug[project.slug] = publicTranslation;
  }

  return bySlug;
}