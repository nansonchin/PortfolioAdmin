import Link from "@/components/transition/TransitionLink";
import { notFound, redirect } from "next/navigation";
import {
  getProjectById,
  listTechnologySuggestions,
} from "@/lib/db/projectRepository";
import { toFormValues } from "@/features/projects/basicForm";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import ProjectBasicForm from "@/features/projects/ProjectBasicform";
import { getSession } from "@/app/lib/auth/getSession";
import ProjectListsForm from "@/features/projects/ProjectListsForm";
import { toListsFormValues } from "@/features/projects/listsForm";
import ProjectStoryForm from "@/features/projects/ProjectStoryForm";
import { toStoryFormValues } from "@/features/projects/storyForm";
import ProjectGalleryForm from "@/features/projects/ProjectGalleryForm";
import { toGalleryFormValues } from "@/features/projects/galleryForm";
import ProjectArchitectureForm from "@/features/projects/ProjectArchitectureForm";
import { toArchitectureFormValues } from "@/features/projects/architectureForm";
import ProjectCoverForm from "@/features/projects/ProjectCoverForm";
import { toCoverFormValues } from "@/features/projects/coverForm";
import { connection } from "next/server";
import DeleteProjectButton from "@/features/projects/DeleteProjectButton";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  await connection();
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [project, technologySuggestions] = await Promise.all([
    getProjectById(id),
    listTechnologySuggestions(),
  ]);

  if (!project) notFound();

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
          href={`/projects/${encodeURIComponent(project.id)}/translate`}
          className="hud-label text-gold transition hover:text-gold-bright"
        >
          Translate →
        </Link>
      </div>

      <PageHeader
        eyebrow={`02 // Projects / ${project.slug}`}
        title={project.title}
      />

      <div className="space-y-6">
        <Panel title="Basic info" tag="section 1 of 6">
          <ProjectBasicForm
            key={project.id}
            projectId={project.id}
            initialValues={toFormValues(project)}
          />
        </Panel>

        <Panel title="Cover images" tag="section 2 of 6">
          <ProjectCoverForm
            key={project.id}
            projectId={project.id}
            initialValues={toCoverFormValues(project)}
          />
        </Panel>

        <Panel title="Details" tag="section 3 of 6">
          <ProjectListsForm
            key={project.id}
            projectId={project.id}
            initialValues={toListsFormValues(project)}
            technologySuggestions={technologySuggestions}
          />
        </Panel>

        <Panel title="Story" tag="section 4 of 6">
          <ProjectStoryForm
            key={project.id}
            projectId={project.id}
            initialValues={toStoryFormValues(project)}
          />
        </Panel>

        <Panel title="Gallery" tag="section 5 of 6">
          <ProjectGalleryForm
            key={project.id}
            projectId={project.id}
            initialValues={toGalleryFormValues(project)}
          />
        </Panel>

        <Panel title="Architecture" tag="section 6 of 6">
          <ProjectArchitectureForm
            key={project.id}
            projectId={project.id}
            initialValues={toArchitectureFormValues(project)}
          />
        </Panel>
        <Panel title="Danger zone" tag="reversible">
          <p className="text-sm text-muted">
            Deleting hides this project from the admin, and removes it from the
            portfolio the next time you publish. Its images and translations are
            kept, and you can restore it from the Deleted list on the Projects
            page.
          </p>
          <div className="mt-4">
            <DeleteProjectButton projectId={project.id} title={project.title} />
          </div>
        </Panel>
      </div>
    </>
  );
}
