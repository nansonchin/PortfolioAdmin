import ProjectTranslationForm from "@/app/features/translations/ProjectTranslationForm";
import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import { getProjectById } from "@/lib/db/projectRepository";
import { getTranslation } from "@/lib/db/translationRepository";
import {
  findTranslationWarnings,
  toTranslationFormValues,
  toTranslationReference,
} from "@/lib/translation/form";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TranslatePage({ params }: PageProps) {
  await connection();
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const [project, stored] = await Promise.all([
    getProjectById(id),
    getTranslation(id, "zh"),
  ]);

  if (!project) {
    notFound();
  }

  const reference = toTranslationReference(project);
  const initialValues = toTranslationFormValues(project, stored);
  const warnings = findTranslationWarnings(project, stored);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/projects"
          className="hud-label text-gold-dim transition hover:text-gold"
        >
          ← Projects
        </Link>
        <Link
          href={`/projects/${encodeURIComponent(project.id)}`}
          className="hud-label text-gold transition hover:text-gold-bright"
        >
          Edit project →
        </Link>
      </div>
      <PageHeader
        eyebrow={`02 // Projects / ${project.slug} / 中文`}
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
      <ProjectTranslationForm
        key={project.id}
        projectId={project.id}
        initialValues={initialValues}
        reference={reference}
      />
    </>
  );
}
