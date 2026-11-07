// src/app/(admin)/profile/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth/getSession";
import { getSiteDocument } from "@/lib/db/siteRepository";
import { toDeveloperFormValues, toProfileFormValues } from "@/lib/validation/siteContent";
import DeveloperContextForm from "@/features/profile/DeveloperContextForm";
import ProfileForm from "@/features/profile/ProfileForm";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import type { DeveloperContext, Profile } from "@/types/site";
import { listTechnologySuggestions } from "@/lib/db/projectRepository";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profile, developer, suggestions] = await Promise.all([
    getSiteDocument<Profile>("profile", "en"),
    getSiteDocument<DeveloperContext>("developer_context", "en"),
    listTechnologySuggestions(),
  ]);


  if (!profile || !developer) {
    return (
      <>
        <PageHeader eyebrow="03 // Profile" title="Profile" />
        <Panel title="Not set up yet" tag="one step">
          <p className="text-muted">
            The profile has not been moved into the database yet. Run{" "}
            <span className="font-system text-paper">npm run seed:site</span> once, then reload this
            page.
          </p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href="/profile/translate"
          className="hud-label text-gold transition hover:text-gold-bright"
        >
          Translate →
        </Link>
      </div>

      <PageHeader
        eyebrow="03 // Profile"
        title="Profile"
        description="The words about you on the portfolio. Changes go live after you publish."
      />

      <div className="space-y-6">
        <Panel title="Public profile" tag="about · contact">
          <ProfileForm initialValues={toProfileFormValues(profile)} suggestions={suggestions} />
        </Panel>

        <Panel title="Developer context" tag="name · role · AI">
          <DeveloperContextForm
            initialValues={toDeveloperFormValues(developer)}
            suggestions={suggestions}
          />
        </Panel>
      </div>
    </>
  );
}
