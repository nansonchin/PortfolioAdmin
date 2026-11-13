import { getSession } from "@/app/lib/auth/getSession";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import DeletedProjectList from "@/features/projects/DeletedProjectList";
import { listDeletedProjects } from "@/lib/db/projectRepository";
import { redirect } from "next/navigation";

export default async function DeletedPage(){
    const session = await getSession()
    if(!session){
        redirect("/login")
    }

    const deleted=await listDeletedProjects();
    
    return (
        <>
              <PageHeader
        eyebrow="05 // Deleted"
        title="Deleted"
        description="Hidden from the admin and the portfolio. Restoring brings a project back as a draft."
      />
         <Panel title="Deleted projects" tag={`${deleted.length}`}>
        <DeletedProjectList items={deleted} now={Date.now()} />
      </Panel>
        </>
    )
}