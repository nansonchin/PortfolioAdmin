import { AdminProject, ProjectStory } from "@/types/project";
import { NodeTranslation, ProjectTranslation } from "@/types/translation";
import { flattenNodes } from "../architecture";

export type TranslationListKey =
  | "features"
  | "responsibilities"
  | "challenges"
  | "solutions";

export const LIST_KEYS: readonly TranslationListKey[] = [
  "features",
  "responsibilities",
  "challenges",
  "solutions",
];

export type TranslationFormValues = {
  title: string;
  summary: string;
  description: string;
  features: string[];
  responsibilities: string[];
  challenges: string[];
  solutions: string[];
  story: {
    problem: string;
    approach: string;
    outcome: string;
    architecture: string[];
  };
  gallery: Record<string, { title: string; description: string }>;
  architecture: {
    title: string;
    description: string;
    nodes: Record<
      string,
      { title: string; description: string; details: string }
    >;
  } | null;
};

export type TranslationReference = {
  title: string;
  summary: string;
  description: string;
  features: string[];
  responsibilities: string[];
  challenges: string[];
  solutions: string[];
  story: {
    problem: string;
    approach: string;
    outcome: string;
    architecture: string[];
  };
  gallery: {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
  }[];
  architecture: {
    title: string;
    description: string;
    nodes: {
      id: string;
      depth: number;
      title: string;
      description: string;
      details: string;
    }[];
  } | null;
};

export type TranslatonProgress = { done: number; total: number };

function alignedList(stored: string[] | undefined, length: number): string[] {
  return Array.from({ length }, (_, index) => stored?.[index] ?? "");
}

export function toTranslationFormValues(
  project: AdminProject,
  stored: ProjectTranslation | undefined,
): TranslationFormValues {
  const architecture = project.architecture;

  return {
    title: stored?.title ?? "",
    summary: stored?.summary ?? "",
    description: stored?.description ?? "",

    features: alignedList(stored?.features, project.features.length),
    responsibilities: alignedList(
      stored?.responsibilities,
      project.responsibilities.length,
    ),
    challenges: alignedList(stored?.challenges, project.challenges.length),
    solutions: alignedList(stored?.solutions, project.solutions.length),

    story: {
      problem: stored?.story?.problem ?? "",
      approach: stored?.story?.approach ?? "",
      outcome: stored?.story?.outcome ?? "",
      architecture: alignedList(
        stored?.story?.architecture,
        project.story.architecture.length,
      ),
    },

    gallery: Object.fromEntries(
      project.gallery.map((image) => [
        image.id,
        {
          title: stored?.gallery?.[image.id]?.title ?? "",
          description: stored?.gallery?.[image.id]?.description ?? "",
        },
      ]),
    ),

    architecture: architecture
      ? {
          title: stored?.architecture?.title ?? "",
          description: stored?.architecture?.description ?? "",
          nodes: Object.fromEntries(
            flattenNodes(architecture.root).map(({ node }) => [
              node.id,
              {
                title: stored?.architecture?.nodes?.[node.id]?.title ?? "",
                description:
                  stored?.architecture?.nodes?.[node.id]?.description ?? "",
                details: stored?.architecture?.nodes?.[node.id]?.details ?? "",
              },
            ]),
          ),
        }
      : null,
  };
}

export function toTranslationReference(
  project: AdminProject,
): TranslationReference {
  const architecture = project.architecture;

  return {
    title: project.title,
    summary: project.summary,
    description: project.description,
    features: project.features,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
    story: {
      problem: project.story.problem,
      approach: project.story.approach,
      outcome: project.story.outcome,
      architecture: project.story.architecture,
    },
    gallery: project.gallery.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      title: image.title,
      description: image.description,
    })),
    architecture: architecture
      ? {
          title: architecture.title,
          description: architecture.description,
          nodes: flattenNodes(architecture.root).map(({ node, depth }) => ({
            id: node.id,
            depth,
            title: node.title,
            description: node.description ?? "",
            details: node.details ?? "",
          })),
        }
      : null,
  };
}

export function toStoredTranslation(
  values: TranslationFormValues,
): ProjectTranslation {
  const result: ProjectTranslation = {};

  const trim = (text: string) => text.trim();

  for (const key of ["title", "summary", "description"] as const) {
    const value = trim(values[key]);
    if (value) result[key] = value;
  }

  for (const key of LIST_KEYS) {
    const items = values[key].map(trim);
    if (items.some((item) => item !== "")) {
      result[key] = items;
    }
  }

  const story: Partial<ProjectStory> = {};
  for (const key of ["problem", "approach", "outcome"] as const) {
    const value = trim(values.story[key]);
    if (value) {
      story[key] = value;
    }
  }

  const notes = values.story.architecture.map(trim);

  if (notes.some((note) => note !== "")) {
    story.architecture = notes;
  }
  if (Object.keys(story).length > 0) {
    result.story = story;
  }

  const gallery: NonNullable<ProjectTranslation["gallery"]> = {};
  for (const [id, entry] of Object.entries(values.gallery)) {
    const title = trim(entry.title);
    const description = trim(entry.description);
    if (title || description) {
      gallery[id] = {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
      };
    }
  }
  if (Object.keys(gallery).length > 0) {
    result.gallery = gallery;
  }

  if (values.architecture) {
    const nodes: Record<string, NodeTranslation> = {};

    for (const [id, node] of Object.entries(values.architecture.nodes)) {
      const title = trim(node.title);
      const description = trim(node.description);
      const details = trim(node.details);

      if (title || description || details) {
        nodes[id] = {
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
          ...(details ? { details } : {}),
        };
      }
    }
    const title = trim(values.architecture.title);

    const description = trim(values.architecture.description);

    if (title || description || Object.keys(nodes).length > 0) {
      result.architecture = {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(Object.keys(nodes).length > 0 ? { nodes } : {}),
      };
    }
  }
  return result
}

export function getTranslationProgress(
  reference: TranslationReference,
  values: TranslationFormValues,
): TranslatonProgress {
  let done = 0;
  let total = 0;

  const count = (english: string, translated: string | undefined) => {
    if (english.trim() === "") return;
    total += 1;
    if ((translated ?? "").trim() !== "") done += 1;
  };

  count(reference.title, values.title);
  count(reference.summary, values.summary);
  count(reference.description, values.description);

  for (const key of LIST_KEYS) {
    reference[key].forEach((english, index) => count(english, values[key][index]));
  }

  count(reference.story.problem, values.story.problem);
  count(reference.story.approach, values.story.approach);
  count(reference.story.outcome, values.story.outcome);
  reference.story.architecture.forEach((english, index) =>
    count(english, values.story.architecture[index]),
  );

  for (const image of reference.gallery) {
    count(image.title, values.gallery[image.id]?.title);
    count(image.description, values.gallery[image.id]?.description);
  }

  if (reference.architecture && values.architecture) {
    count(reference.architecture.title, values.architecture.title);
    count(reference.architecture.description, values.architecture.description);

    for (const node of reference.architecture.nodes) {
      const translated = values.architecture.nodes[node.id];
      count(node.title, translated?.title);
      count(node.description, translated?.description);
      count(node.details, translated?.details);
    }
  }

  return { done, total };
}

export function findTranslationWarnings(
  project: AdminProject,
  stored: ProjectTranslation | undefined,
): string[] {
  if (!stored) return [];

  const warnings: string[] = [];

  const checkLength = (label: string, translated: string[] | undefined, english: string[]) => {
    if (translated && translated.length > 0 && translated.length !== english.length) {
      warnings.push(
        `${label}: the saved translation has ${translated.length} items but the English now has ${english.length}. Check that every item still matches.`,
      );
    }
  };

  checkLength("Features", stored.features, project.features);
  checkLength("Responsibilities", stored.responsibilities, project.responsibilities);
  checkLength("Challenges", stored.challenges, project.challenges);
  checkLength("Solutions", stored.solutions, project.solutions);
  checkLength("Story notes", stored.story?.architecture, project.story.architecture);

  const imageIds = new Set(project.gallery.map((image) => image.id));
  const orphanImages = Object.keys(stored.gallery ?? {}).filter((id) => !imageIds.has(id)).length;

  if (orphanImages > 0) {
    warnings.push(
      `${orphanImages} gallery translation(s) belong to images that no longer exist. They will be removed when you save.`,
    );
  }

  const nodeIds = new Set(
    project.architecture ? flattenNodes(project.architecture.root).map(({ node }) => node.id) : [],
  );
  const orphanNodes = Object.keys(stored.architecture?.nodes ?? {}).filter(
    (id) => !nodeIds.has(id),
  ).length;

  if (orphanNodes > 0) {
    warnings.push(
      `${orphanNodes} architecture translation(s) belong to nodes that no longer exist. They will be removed when you save.`,
    );
  }

  return warnings;
}