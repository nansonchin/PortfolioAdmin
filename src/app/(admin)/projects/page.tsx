import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import { listDeletedProjects, listProjects } from "@/lib/db/projectRepository";
import { toListItem } from "@/features/projects/listItem";
import ProjectTable from "@/features/projects/ProjectTable";
import { listTranslations } from "@/lib/db/translationRepository";
import {
  getTranslationProgress,
  toTranslationFormValues,
  toTranslationReference,
} from "@/lib/translation/form";
import { connection } from "next/server";
import Link from "@/components/transition/TransitionLink";
import DeletedProjectList from "@/features/projects/DeletedProjectList";

type PageProps = { searchParams: Promise<{ view?: string }> };

export default async function ProjectsPage({ searchParams }: PageProps) {
  await connection();
  const session = await getSession();

  if (!session) redirect("/login");

  const { view } = await searchParams;

  const deleted = await listDeletedProjects();

  if (view === "deleted") {
    return (
      <>
        <Link
          href="/projects"
          className="hud-label mb-4 inline-block text-gold-dim transition hover:text-gold"
        >
          ← Projects
        </Link>

        <PageHeader
          eyebrow="02 // Projects / deleted"
          title="Deleted"
          description="Hidden from the admin and the portfolio. Restoring brings a project back as a draft."
        />

        <Panel title="Deleted projects" tag={`${deleted.length}`}>
          <DeletedProjectList
            items={deleted.map((project) => ({
              id: project.id,
              title: project.title,
              slug: project.slug,
              year: project.year,
            }))}
          />
        </Panel>
      </>
    );
  }

  const [projects, translations] = await Promise.all([
    listProjects(),
    listTranslations("zh"),
  ]);

  const items = projects.map((project) =>
    toListItem(
      project,
      getTranslationProgress(
        toTranslationReference(project),
        toTranslationFormValues(project, translations[project.id]),
      ),
    ),
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        {deleted.length > 0 ? (
          <Link
            href="/projects?view=deleted"
            className="hud-label text-gold-dim transition hover:text-gold"
          >
            Deleted ({deleted.length})
          </Link>
        ) : (
          <span />
        )}

        <Link
          href="/projects/new"
          className="chamfer hud-label inline-block bg-gold px-6 py-3 text-ink transition hover:bg-gold-bright"
        >
          + New project
        </Link>
      </div>
      <PageHeader
        eyebrow="02 // Projects"
        title="Projects"
        description="Search, filter, and  switch projects between  draft and published"
      />
      <ProjectTable initialItems={items} />
    </>
  );
}
