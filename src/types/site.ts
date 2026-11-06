  export type SkillGroup = {
  title: string;
  items: string[];
};

export type Profile = {
  headline: string[];
  intro: string[];
  location: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  focus: string[];
  skillGroups: SkillGroup[];
};

export type DeveloperContext = {
  name: string;
  role: string;
  description: string;
  background: string[];
  skills: string[];
  goals: string[];
};

export type ProfileTranslation = Partial<
  Pick<Profile, "headline" | "intro" | "status" | "location">
> & {
  skillGroupTitles?: Record<string, string>;
};

export type DeveloperContextTranslation = Partial<
  Pick<DeveloperContext, "role" | "description" | "background" | "goals">
>;

export type SiteRows = {
  profile?: Profile;
  developerContext?: DeveloperContext;
  profileZh?: ProfileTranslation;
  developerContextZh?: DeveloperContextTranslation;
};