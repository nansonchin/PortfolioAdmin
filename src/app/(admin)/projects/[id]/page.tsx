import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProjectById } from "@/lib/db/projectRepository";
import { toFormValues } from "@/features/projects/basicForm";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import ProjectBasicForm from "@/features/projects/ProjectBasicform";
import { getSession } from "@/app/lib/auth/getSession";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <>
      <Link
        href="/projects"
        className="hud-label mb-4 inline-block text-gold-dim transition hover:text-gold"
      >
        ← Projects
      </Link>

      <PageHeader eyebrow={`02 // Projects / ${project.slug}`} title={project.title} />

      <Panel title="Basic info" tag="section 1 of 5">
        <ProjectBasicForm
          key={project.id}
          projectId={project.id}
          initialValues={toFormValues(project)}
        />
      </Panel>
    </>
  );
}