import {redirect} from "next/navigation"
import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import { listProjects } from "@/lib/db/projectRepository";
import { toListItem } from "@/features/projects/listItem";
import ProjectTable from "@/features/projects/ProjectTable";

export default async function ProjectsPage() {
  const session  = await getSession()

  if(!session) redirect("/login");

  const projects = await listProjects()
  const items = projects.map(toListItem)

  return (
    <>
      <PageHeader eyebrow="02 // Projects" title="Projects" description="Search, filter, and  switch projects between  draft and published" />
      <ProjectTable initialItems={items}/>
    </>
  );
}