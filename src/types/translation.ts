import { ProjectStory } from "./project";

export type Language = "zh";

export const TRANSLATION_LANGUAGE: ReadonlyArray<{
  code: Language;
  label: string;
}> = [{ code: "zh", label: "中文" }];

export type NodeTranslation = {
  title?: string;
  description?: string;
  details?: string;
};

export type ProjectTranslation = {
  title?: string;
  summary?: string;
  description?: string;
  features?: string[];
  responsibilities?: string[];
  challenges?: string[];
  solutions?: string[];
  story?: Partial<ProjectStory>;
  gallery?: Record<string, { title?: string; description?: string }>;
  architecture?: {
    title?: string;
    description?: string;
    nodes?: Record<string, NodeTranslation>;
  };
};
