import { redirect } from "next/navigation";
import { getSession } from "../lib/auth/getSession";
import Sidebar from "../features/shell/Sidebar";
import Topbar from "../features/shell/Topbar";
import TransitionStage from "@/components/transition/TransitionStage";
import { connection } from "next/server";
import { Suspense } from "react";
import { countDeletedProjects } from "@/lib/db/projectRepository";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getSession();
  if (!session) redirect("/login");

    const deletedCount = await countDeletedProjects();
  // The shell is fixed to the viewport. Only the area inside <TransitionStage> scrolls
  // and only that area is covered by the shutter; sidebar and top bar stay live.
  return (
    <div className="flex h-dvh flex-col overflow-hidden md:flex-row">
       <Sidebar counts={{ deleted: deletedCount }} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar username={session.sub} />
        <TransitionStage>
          <main className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10">{children}</main>
        </TransitionStage>
      </div>
    </div>
  );
}

