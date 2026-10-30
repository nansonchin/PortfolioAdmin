import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getProjectById,
  listTechnologySuggestion,
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

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [project, technologySuggestions] = await Promise.all([
    getProjectById(id),
    listTechnologySuggestion(),
  ]);

  if (!project) notFound();

  return (
    <>
      <Link
        href="/projects"
        className="hud-label mb-4 inline-block text-gold-dim transition hover:text-gold"
      >
        ← Projects
      </Link>

      <PageHeader
        eyebrow={`02 // Projects / ${project.slug}`}
        title={project.title}
      />
      <div className="space-y-6">
        <Panel title="Basic info" tag="section 1 of 5">
          <ProjectBasicForm
            key={project.id}
            projectId={project.id}
            initialValues={toFormValues(project)}
          />
        </Panel>

        <Panel title="Details" tag="section 2 of 5">
          <ProjectListsForm
            key={project.id}
            projectId={project.id}
            initialValues={toListsFormValues(project)}
            technologySuggestions={technologySuggestions}
          />
        </Panel>

        <Panel title="Story" tag ="section 3 of 5">
          <ProjectStoryForm
            key={project.id}
            projectId={project.id}
            initialValues={toStoryFormValues(project)}
          />
        </Panel>
      </div>
    </>
  );
}
