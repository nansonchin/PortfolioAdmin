import { redirect } from "next/navigation";
import { getSession } from "../lib/auth/getSession";
import Sidebar from "../features/shell/Sidebar";
import Topbar from "../features/shell/Topbar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="halftone ink-wash scanlines relative flex min-h-screen flex-col md:flex-row">
      <span
        aria-hidden
        className="pointer-events-none fixed top-24 right-6 hidden font-display text-[18rem] leading-none text-gold/[0.5] select-none md:block [writing-mode:vertical-rl]"
      >
        玄墨
      </span>

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar username={session.sub} />
        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}