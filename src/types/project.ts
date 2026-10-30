
export type ResponsiveImage = {
  src: string;
  srcSet?: string;
  sizes?: string;
};

export type ProjectGalleryImage = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export type ProjectStory = {
  problem: string;
  approach: string;
  architecture: string[];
  outcome: string;
};

export type ArchitectureNode = {
  id: string;
  title: string;
  description?: string;
  details?: string;
  children?: ArchitectureNode[];
};

export type ProjectArchitecture = {
  title: string;
  description: string;
  root: ArchitectureNode;
};

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  year: number;
  featured: boolean;
  category: string;
  githubUrl: string;
  demoUrl?: string;
  thumbnail: string;
  technologies: string[];
  heroImage: ResponsiveImage;
  gallery: ProjectGalleryImage[];
  features: string[];
  responsibilities: string[];
  challenges: string[];
  solutions: string[];
  story: ProjectStory;
  architecture?: ProjectArchitecture;
}

export type ProjectStatus = "draft" | "published";

export interface AdminProject extends Project {
  status: ProjectStatus;
  sortOrder: number;
}

export type ProjectFlagsPatch = Partial<Pick<AdminProject, "featured" | "status">>

export type ProjectBasic = Pick<
  Project,
  "title" | "slug" | "summary" | "description" | "year" | "category" | "githubUrl" | "demoUrl"
> &
  Pick<AdminProject, "featured" | "status">;

  export type ProjectLists = Pick<Project,"technologies" | "features" | "responsibilities" | "challenges" | "solutions">

  export type ProjectGallery = Pick<Project,"gallery">

  