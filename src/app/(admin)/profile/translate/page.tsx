// src/app/(admin)/profile/translate/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth/getSession";
import { getSiteDocument } from "@/lib/db/siteRepository";
import {
  findDeveloperTranslationWarnings,
  findProfileTranslationWarnings,
  toDeveloperTranslationForm,
  toProfileTranslationForm,
} from "@/lib/translation/site";
import { toDeveloperFormValues, toProfileFormValues } from "@/lib/validation/siteContent";
import DeveloperTranslationForm from "@/features/profile/DeveloperTranslationForm";
import ProfileTranslationForm from "@/features/profile/ProfileTranslationForm";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import type {
  DeveloperContext,
  DeveloperContextTranslation,
  Profile,
  ProfileTranslation,
} from "@/types/site";

export default async function ProfileTranslatePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profileRaw, developerRaw, profileZh, developerZh] = await Promise.all([
    getSiteDocument<Profile>("profile", "en"),
    getSiteDocument<DeveloperContext>("developer_context", "en"),
    getSiteDocument<ProfileTranslation>("profile", "zh"),
    getSiteDocument<DeveloperContextTranslation>("developer_context", "zh"),
  ]);

  if (!profileRaw || !developerRaw) {
    redirect("/profile");
  }

  const profile = toProfileFormValues(profileRaw);
  const developer = toDeveloperFormValues(developerRaw);

  const warnings = [
    ...findProfileTranslationWarnings(profile, profileZh),
    ...findDeveloperTranslationWarnings(developer, developerZh),
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/profile" className="hud-label text-gold-dim transition hover:text-gold">
          ← Profile
        </Link>
      </div>

      <PageHeader
        eyebrow="03 // Profile / 中文"
        title="Translate"
        description="English on the left, Chinese on the right. Saved translations go live after you publish."
      />

      {warnings.length > 0 && (
        <div className="mb-6">
          <Panel title="Please check" tag={`${warnings.length}`}>
            <ul className="space-y-2">
              {warnings.map((warning) => (
                <li key={warning} className="text-sm text-alert">
                  ⚠ {warning}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      <div className="space-y-6">
        <Panel title="Public profile" tag="中文">
          <ProfileTranslationForm
            initialValues={toProfileTranslationForm(profile, profileZh)}
            english={profile}
          />
        </Panel>

        <Panel title="Developer context" tag="中文">
          <DeveloperTranslationForm
            initialValues={toDeveloperTranslationForm(developer, developerZh)}
            english={developer}
          />
        </Panel>
      </div>
    </>
  );
}