import LogoutButton from "@/app/features/auth/LogoutButton";
import { getSession } from "@/app/lib/auth/getSession";
import { listProjects } from "@/lib/db/projectRepository";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const expiresAt = new Date(session.exp * 1000).toLocaleString();

  const projects = await listProjects();
  return (
    <main className="halftone ink-wash scanlines min-h-screen p-8">
      <section className="chamfer mx-auto max-w-xl bg-ink-2 p-10">
        <p className="hud-label text-gold">System // Online</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9]">Dashboard</h1>

        <dl className="mt-8 space-y-2 text-muted">
          <div>
            <dt className="hud-label text-gold-dim">User</dt>
            <dd>{session.sub}</dd>
          </div>
          <div>
            <dt className="hud-label text-gold-dim">Session expires</dt>
            <dd>{expiresAt}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-1 text-sm text-muted">
          {projects.map((project)=>(
            <li key={project.id}>
                <span className="hud-label text-gold-dim">
                  {String(project.sortOrder).padStart(2,"0")}
                </span>
                {project.title}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
