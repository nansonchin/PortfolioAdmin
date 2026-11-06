import {
  DeveloperContext,
  DeveloperContextTranslation,
  Profile,
  ProfileTranslation,
  SiteRows,
} from "@/types/site";
import { alignList } from "./translation";

export type SiteSnapshot = {
  profile?: Profile;
  developerContext?: DeveloperContext;
  translations?: {
    zh?: {
      profile?: ProfileTranslation;
      developerContext?: DeveloperContextTranslation;
    };
  };
};

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toPublicProfile(profile: Profile): Profile {
  return {
    headline: profile.headline,
    intro: profile.intro,
    location: profile.location,
    status: profile.status,
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    focus: profile.focus,
    skillGroups: profile.skillGroups.map((group) => ({ title: group.title, items: group.items })),
  };
}
function toPublicDeveloperContext(context: DeveloperContext): DeveloperContext {
  return {
    name: context.name,
    role: context.role,
    description: context.description,
    background: context.background,
    skills: context.skills,
    goals: context.goals,
  };
}

export function toPublicProfileTranslation(
    profile:Profile,
    translation:ProfileTranslation,
):ProfileTranslation{
    const result: ProfileTranslation={};

    const headline = alignList(translation.headline,profile.headline)
    if(headline){
        result.headline= headline;
    }

    const intro = alignList(translation.intro,profile.intro)

    if(intro){
        result.intro = intro
    }

    for (const key of ["status","location"] as const){
        const value = clean(translation[key])
        if(value){
            result[key] = value
        }
    }

    const titles:Record<string,string>={}
    for(const group of profile.skillGroups){
        const translated = clean(translation.skillGroupTitles?.[group.title])
        if(translated){
            titles[group.title]=translated;
        }
    }

    if(Object.keys(titles).length>0){
        result.skillGroupTitles=titles
    }

    return result;
}

export function toPublicDeveloperTranslation(
    context:DeveloperContext,
    translation:DeveloperContextTranslation,
):DeveloperContextTranslation{
    const result:DeveloperContextTranslation={}
        for(const key of ["role","description"] as const){
            const value = clean(translation[key])
            if(value){
                result[key]=value;
            }
        }
        const background = alignList(translation.background,context.background)

        if(background){
            result.background=background
        }

        const goals = alignList(translation.goals,context.goals)
        if(goals){
            result.goals = goals
        }
    
    return result
}

export function buildSiteSnapshot(rows:SiteRows):SiteSnapshot{
    const site:SiteSnapshot = {};
    if(rows.profile){
        site.profile = toPublicProfile(rows.profile);
    }
    if(rows.developerContext){
        site.developerContext = toPublicDeveloperContext(rows.developerContext)

    }

    const zh:NonNullable<NonNullable<SiteSnapshot["translations"]>["zh"]>={}

    if(rows.profile && rows.profileZh){
        zh.profile = toPublicProfileTranslation(rows.profile,rows.profileZh)
    }

     if (rows.developerContext && rows.developerContextZh) {
    zh.developerContext = toPublicDeveloperTranslation(rows.developerContext, rows.developerContextZh);
  }

  if (Object.keys(zh).length > 0) site.translations = { zh };

  return site;
}