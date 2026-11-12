import { AdminProject } from "@/types/project";
import { NewProjectInput } from "../validation/newProject";

export function buildNewProject(input: NewProjectInput, sortOrder: number): AdminProject {
  return {
    id: input.slug,
    slug: input.slug,
    title: input.title,
    summary: "",
    description: "",
    year: input.year,
    featured: false,
    category: input.category,
    githubUrl: "",
    thumbnail: "",
    technologies: [],
    heroImage: { src: "" },
    gallery: [],
    features: [],
    responsibilities: [],
    challenges: [],
    solutions: [],
    story: { problem: "", approach: "", architecture: [], outcome: "" },
    status: "draft",
    sortOrder,
  };
}