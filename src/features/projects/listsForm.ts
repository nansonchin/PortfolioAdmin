// src/features/projects/listsForm.ts

import type { AdminProject } from "@/types/project";
import type { ProjectListsFormValues } from "@/lib/validation/projectLists";

export function toListsFormValues(project: AdminProject): ProjectListsFormValues {
  return {
    technologies: project.technologies,
    features: project.features,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
  };
}