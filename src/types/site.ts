export type SkillGroup ={
    title:string;
    items:string[]
}

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