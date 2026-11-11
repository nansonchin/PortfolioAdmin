import {
  AdminProject,
  ProjectArchitectureSection,
  ProjectBasic,
  ProjectCover,
  ProjectFlagsPatch,
  ProjectGallery,
  ProjectLists,
  ProjectStory,
} from "@/types/project";
import { getSupabase } from "./supabase";
import {
  architectureToRowPatch,
  basicToRowPatch,
  coverToRowPatch,
  galleryToRowPatch,
  listsToRowPatch,
  ProjectRow,
  projectToRow,
  rowToProject,
  storyToRowPatch,
} from "./projectMapper";
import { NewProjectInput } from "../validation/newProject";
import { buildNewProject } from "../projects/newProject";

export async function listProjects(): Promise<AdminProject[]> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();
  if (error) {
    throw new Error(`Failed to read thedata : ${error.message}`);
  }

  return data.map(rowToProject);
}

export async function updateProjectFlags(
  id: string,
  patch: ProjectFlagsPatch,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error(`Failed Patching the project : ${error.message}`);
  }

  return data ? rowToProject(data) : null;
}

export async function getProjectById(id: string): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error("Failed to read the project : ${error.message}");
  }

  return data ? rowToProject(data) : null;
}

export class DuplicateSlugError extends Error {
  constructor() {
    super("Slug already in use");
    this.name = "DuplicateSlugError";
  }
}

export async function updateProjectBasic(
  id: string,
  input: ProjectBasic,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(basicToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    if (error.code === "23505") throw new DuplicateSlugError();
    throw new Error(`Failed to save single project：${error.message}`);
  }

  return data ? rowToProject(data) : null;
}

export async function updateProjectLists(
  id: string,
  input: ProjectLists,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(listsToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error(`Failed to save project : ${error.message}`);
  }

  return data ? rowToProject(data) : null;
}

export async function listTechnologySuggestions(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("technologies")
    .returns<{ technologies: string[] }[]>();

  if (error) {
    throw new Error(`Failed to read technologies : ${error.message}`);
  }

  const unique = new Map<string, string>();

  for (const tech of data.flatMap((row) => row.technologies)) {
    const key = tech.toLowerCase();
    if (!unique.has(key)) unique.set(key, tech);
  }

  return [...unique.values()].sort((a, b) => a.localeCompare(b));
}

export async function updateProjectStory(
  id: string,
  input: ProjectStory,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(storyToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error(`failed to save project story: ${error.message}`);
  }
  return data ? rowToProject(data) : null;
}

export async function updateProjectGallery(
  id: string,
  input: ProjectGallery,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(galleryToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();

  if (error) {
    throw new Error(`Failed to save gallery: ${error.message}`);
  }

  return data ? rowToProject(data) : null;
}

export async function updateProjectArchiteture(
  id: string,
  input: ProjectArchitectureSection,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(architectureToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();
  if (error) {
    throw new Error(`Failed to Updated Project architeture`);
  }

  return data ? rowToProject(data) : null;
}

export async function updateProjectCover(
  id: string,
  input: ProjectCover,
): Promise<AdminProject | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .update(coverToRowPatch(input))
    .eq("id", id)
    .select("*")
    .maybeSingle<ProjectRow>();
  if (error) {
    throw new Error(`Failed to save the project (Upload): ${error.message}`);
  }

  return data ? rowToProject(data) : null;
}

export async function createProject(
  input: NewProjectInput,
): Promise<AdminProject> {
  const supabase = getSupabase();

  const { data: last, error: lastError } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  if (lastError) {
    throw new Error(`Fail to read project records ${lastError.message}`);
  }

  const project = buildNewProject(input, (last?.sort_order ?? -1) + 1);

  const { data, error } = await supabase
    .from("projects")
    .insert(projectToRow(project))
    .select("*")
    .single<ProjectRow>();

  if (error) {
    // if (error.code === "23505") throw new DuplicateSlugError();
    throw new Error(`Failed to add project：${error.message}`);
  }
  return rowToProject(data);
}
