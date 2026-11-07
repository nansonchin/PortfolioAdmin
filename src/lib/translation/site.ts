
import type {
  DeveloperContext,
  DeveloperContextTranslation,
  Profile,
  ProfileTranslation,
} from "@/types/site";
import type { TranslationProgress } from "./form";

export type ProfileTranslationFormValues = {
  headline: string[];
  intro: string[];
  status: string;
  location: string;
  skillGroupTitles: Record<string, string>;
};

export type DeveloperTranslationFormValues = {
  role: string;
  description: string;
  background: string[];
  goals: string[];
};

function alignedList(stored: string[] | undefined, length: number): string[] {
  return Array.from({ length }, (_, index) => stored?.[index] ?? "");
}

export function toProfileTranslationForm(
  profile: Profile,
  stored: ProfileTranslation | undefined,
): ProfileTranslationFormValues {
  return {
    headline: alignedList(stored?.headline, profile.headline.length),
    intro: alignedList(stored?.intro, profile.intro.length),
    status: stored?.status ?? "",
    location: stored?.location ?? "",
    skillGroupTitles: Object.fromEntries(
      profile.skillGroups.map((group) => [group.title, stored?.skillGroupTitles?.[group.title] ?? ""]),
    ),
  };
}

export function toStoredProfileTranslation(values: ProfileTranslationFormValues): ProfileTranslation {
  const result: ProfileTranslation = {};

  for (const key of ["headline", "intro"] as const) {
    const items = values[key].map((item) => item.trim());
    if (items.some((item) => item !== "")) result[key] = items;
  }

  for (const key of ["status", "location"] as const) {
    const value = values[key].trim();
    if (value) result[key] = value;
  }

  const titles: Record<string, string> = {};
  for (const [english, translated] of Object.entries(values.skillGroupTitles)) {
    if (translated.trim()) titles[english] = translated.trim();
  }
  if (Object.keys(titles).length > 0) result.skillGroupTitles = titles;

  return result;
}

export function toDeveloperTranslationForm(
  context: DeveloperContext,
  stored: DeveloperContextTranslation | undefined,
): DeveloperTranslationFormValues {
  return {
    role: stored?.role ?? "",
    description: stored?.description ?? "",
    background: alignedList(stored?.background, context.background.length),
    goals: alignedList(stored?.goals, context.goals.length),
  };
}

export function toStoredDeveloperTranslation(
  values: DeveloperTranslationFormValues,
): DeveloperContextTranslation {
  const result: DeveloperContextTranslation = {};

  for (const key of ["role", "description"] as const) {
    const value = values[key].trim();
    if (value) result[key] = value;
  }

  for (const key of ["background", "goals"] as const) {
    const items = values[key].map((item) => item.trim());
    if (items.some((item) => item !== "")) result[key] = items;
  }

  return result;
}

function progressOf(pairs: Array<[string, string | undefined]>): TranslationProgress {
  let done = 0;
  let total = 0;

  for (const [english, translated] of pairs) {
    if (english.trim() === "") continue;
    total += 1;
    if ((translated ?? "").trim() !== "") done += 1;
  }

  return { done, total };
}

export function getProfileTranslationProgress(
  profile: Profile,
  values: ProfileTranslationFormValues,
): TranslationProgress {
  return progressOf([
    ...profile.headline.map((line, i): [string, string | undefined] => [line, values.headline[i]]),
    ...profile.intro.map((line, i): [string, string | undefined] => [line, values.intro[i]]),
    [profile.status, values.status],
    [profile.location, values.location],
    ...profile.skillGroups.map((group): [string, string | undefined] => [
      group.title,
      values.skillGroupTitles[group.title],
    ]),
  ]);
}

export function getDeveloperTranslationProgress(
  context: DeveloperContext,
  values: DeveloperTranslationFormValues,
): TranslationProgress {
  return progressOf([
    [context.role, values.role],
    [context.description, values.description],
    ...context.background.map((line, i): [string, string | undefined] => [line, values.background[i]]),
    ...context.goals.map((line, i): [string, string | undefined] => [line, values.goals[i]]),
  ]);
}

export function findProfileTranslationWarnings(
  profile: Profile,
  stored: ProfileTranslation | undefined,
): string[] {
  if (!stored) return [];

  const warnings: string[] = [];

  const check = (label: string, translated: string[] | undefined, english: string[]) => {
    if (translated && translated.length > 0 && translated.length !== english.length) {
      warnings.push(
        `${label}: the saved translation has ${translated.length} items but the English now has ${english.length}. Check that every item still matches.`,
      );
    }
  };

  check("Headline", stored.headline, profile.headline);
  check("Intro", stored.intro, profile.intro);

  const titles = new Set(profile.skillGroups.map((group) => group.title));
  const orphans = Object.keys(stored.skillGroupTitles ?? {}).filter((title) => !titles.has(title));

  if (orphans.length > 0) {
    warnings.push(
      `${orphans.length} saved group title translation(s) no longer match any English group (${orphans.join(", ")}). If you renamed a group, translate its title again. The old ones will be removed when you save.`,
    );
  }

  return warnings;
}

export function findDeveloperTranslationWarnings(
  context: DeveloperContext,
  stored: DeveloperContextTranslation | undefined,
): string[] {
  if (!stored) return [];

  const warnings: string[] = [];

  const check = (label: string, translated: string[] | undefined, english: string[]) => {
    if (translated && translated.length > 0 && translated.length !== english.length) {
      warnings.push(
        `${label}: the saved translation has ${translated.length} items but the English now has ${english.length}. Check that every item still matches.`,
      );
    }
  };

  check("Background", stored.background, context.background);
  check("Goals", stored.goals, context.goals);

  return warnings;
}