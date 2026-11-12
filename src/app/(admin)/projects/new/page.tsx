import NewProjectForm from "@/app/features/projects/NewProjectForm";
import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import { listProjects } from "@/lib/db/projectRepository";
import Link from "@/components/transition/TransitionLink";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const projects = await listProjects();

  const categories = [
    ...new Set(projects.map((project) => project.category).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Link
        href="/projects"
        className="hud-label mb-4 inline-block text-gold-dim transition hover:text-gold"
      >
        ← Projects
      </Link>
      

      <PageHeader
        eyebrow="02 // Projects / new"
        title="New project"
        description="Start with the basics. Everything else is filled in on the next page, and the project stays a draft until you publish it."
      />

      <Panel title="Basics" tag="step 1 of 2">
        <NewProjectForm
          defaultYear={new Date().getFullYear()}
          categories={categories}
        />
      </Panel>
    </>
  );
}
