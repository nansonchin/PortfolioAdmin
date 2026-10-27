// src/app/(admin)/dashboard/page.tsx

import { redirect } from "next/navigation";
import { listProjects } from "@/lib/db/projectRepository";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import StatCard from "@/components/ui/StatCard";
import { getProjectStats, getTopTechnologies } from "@/app/features/projects/stat";
import { getSession } from "@/app/lib/auth/getSession";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const projects = await listProjects();
  const stats = getProjectStats(projects);
  const topTech = getTopTechnologies(projects);

  const maxCount = topTech[0]?.count ?? 1;

  const expiresAt = new Date(session.exp * 1000).toLocaleString();

  return (
    <>
      <PageHeader
        eyebrow="01 // Dashboard"
        title="Overview"
        description="A quick look at what lives in the portfolio database."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Drafts" value={stats.drafts} />
        <StatCard label="Featured" value={stats.featured} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Top technologies" tag="by project count" className="lg:col-span-2">
          <ul className="space-y-3">
            {topTech.map((tech) => (
              <li key={tech.name}>
                <div className="hud-label flex justify-between text-muted">
                  <span className="text-paper">{tech.name}</span>
                  <span>{tech.count}</span>
                </div>
                <div className="mt-1 h-1 bg-line">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${(tech.count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Session" tag="active">
          <dl className="space-y-4">
            <div>
              <dt className="hud-label text-gold-dim">Operator</dt>
              <dd className="text-paper">{session.sub}</dd>
            </div>
            <div>
              <dt className="hud-label text-gold-dim">Expires</dt>
              <dd className="text-paper">{expiresAt}</dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Projects" tag={`${projects.length} total`} className="lg:col-span-3">
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center gap-4 py-3">
                <span className="hud-label w-8 text-gold-dim">
                  {String(project.sortOrder + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-paper">{project.title}</span>
                <span className="hud-label text-muted">{project.year}</span>
                <span
                  className={`hud-label ${
                    project.status === "published" ? "text-gold" : "text-alert"
                  }`}
                >
                  {project.status}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}