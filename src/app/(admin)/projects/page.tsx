import {redirect} from "next/navigation"
import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import { listProjects } from "@/lib/db/projectRepository";
import { toListItem } from "@/features/projects/listItem";
import ProjectTable from "@/features/projects/ProjectTable";
import { listTranslations } from "@/lib/db/translationRepository";
import { getTranslationProgress, toTranslationFormValues, toTranslationReference } from "@/lib/translation/form";
import { connection } from "next/server";
import Link from "@/components/transition/TransitionLink";

export default async function ProjectsPage() {
  await connection();
  const session  = await getSession()

  if(!session) redirect("/login");

  const [projects,translations] = await Promise.all([listProjects(),listTranslations("zh")])
  
  const items = projects.map((project)=>
    toListItem(
      project,
      getTranslationProgress(
        toTranslationReference(project),
        toTranslationFormValues(project,translations[project.id])
      )
    )
  )

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href="/projects/new"
          className="chamfer hud-label inline-block bg-gold px-6 py-3 text-ink transition hover:bg-gold-bright"
        >
          + New project
        </Link>
      </div>
      <PageHeader eyebrow="02 // Projects" title="Projects" description="Search, filter, and  switch projects between  draft and published" />
      <ProjectTable initialItems={items}/>
    </>
  );
}