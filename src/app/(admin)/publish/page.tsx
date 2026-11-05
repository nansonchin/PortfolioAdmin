import { redirect } from "next/navigation";
import { listProjects } from "@/lib/db/projectRepository";
import { isInSync, readLiveSnapshot } from "@/lib/publish/service";
import {
  buildSnapShot,
  countStorageImages,
  findSnapshotProblems,
  type PortfolioSnapshot,
} from "@/lib/publish/snapshot";
import { readPublicBaseUrl } from "@/lib/storage/publicUrl";
import PublishButton from "@/features/publish/PublishButton";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import StatCard from "@/components/ui/StatCard";
import { getSession } from "@/app/lib/auth/getSession";

export default async function PublishPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [projects, live] = await Promise.all([listProjects(), readLiveSnapshot()]);

  let snapshot: PortfolioSnapshot | null = null;
  let configError: string | null = null;

  try {
    snapshot = buildSnapShot(projects, readPublicBaseUrl());
  } catch (error) {
    configError = error instanceof Error ? error.message : "Unknown error";
  }

  const problems = snapshot ? findSnapshotProblems(snapshot) : [];
  const published = projects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const drafts = projects.filter((project) => project.status !== "published");
  const imagesInStorage = published.reduce((sum, project) => sum + countStorageImages(project), 0);
  const canPublish = snapshot !== null && problems.length === 0;

  const inSync = snapshot !== null && live !== null && isInSync(live, snapshot);
  const liveTag = live === null ? "not published" : inSync ? "up to date" : "changes pending";

  return (
    <>
      <PageHeader
        eyebrow="04 // Publish"
        title="Publish"
        description="Send the published projects to the portfolio as a snapshot."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Will be published" value={published.length} />
        <StatCard label="Drafts (excluded)" value={drafts.length} />
        <StatCard label="Images in storage" value={imagesInStorage} />
        <StatCard label="Translated (zh)" value={Object.keys(snapshot?.translations.zh??{}).length}/>

      </div>

      <div className="mt-4 space-y-4">
        <Panel title="Live" tag={liveTag}>
          {live === null ? (
            <p className="text-muted">
              Nothing is live yet, or the snapshot URL cannot be reached. Check{" "}
              <span className="font-system">SNAPSHOT_PUBLIC_URL</span> in .env.local.
            </p>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="hud-label text-gold-dim">Last published</dt>
                <dd className="text-paper">{new Date(live.generatedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="hud-label text-gold-dim">Projects live</dt>
                <dd className="text-paper">{live.projects.length}</dd>
              </div>
            </dl>
          )}

          {live !== null && (
            <p className={`hud-label mt-4 ${inSync ? "text-gold" : "text-alert"}`}>
              {inSync ? "✓ The live snapshot matches the database." : "● There are unpublished changes."}
            </p>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <PublishButton disabled={!canPublish} />
          </div>
        </Panel>

        <Panel title="Checks" tag={canPublish ? "ready" : "needs attention"}>
          {configError ? (
            <p role="alert" className="hud-label text-alert">
              ⚠ {configError}
            </p>
          ) : problems.length === 0 ? (
            <p className="hud-label text-gold">✓ No problems found.</p>
          ) : (
            <ul className="space-y-2">
              {problems.map((problem) => (
                <li key={problem} className="hud-label text-alert">
                  ⚠ {problem}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Included projects" tag={`${published.length} in order`}>
          {published.length === 0 ? (
            <p className="text-muted">Nothing is published yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {published.map((project, index) => (
                <li key={project.id} className="flex items-center gap-4 py-3">
                  <span className="hud-label w-8 text-gold-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-paper">{project.title}</span>
                  <span className="hud-label text-muted">{project.slug}</span>
                  <span className="hud-label text-gold-dim">
                    {countStorageImages(project)} uploaded
                  </span>
                </li>
              ))}
            </ul>
          )}

          {drafts.length > 0 && (
            <p className="mt-4 text-sm text-muted">
              Not included (draft): {drafts.map((project) => project.title).join(", ")}
            </p>
          )}
        </Panel>

        <Panel title="Output" tag="portfolio-snapshot.json">
          <div className="flex flex-wrap items-center gap-4">
            {canPublish ? (
              <a
                href="/api/publish/snapshot?download=1"
                className="chamfer hud-label inline-block bg-gold px-6 py-3 text-ink transition hover:bg-gold-bright"
              >
                Download snapshot
              </a>
            ) : (
              <span className="chamfer hud-label inline-block bg-line px-6 py-3 text-muted">
                Download snapshot
              </span>
            )}

            {canPublish && (
              <a
                href="/api/publish/snapshot"
                target="_blank"
                rel="noreferrer"
                className="hud-label text-gold-dim transition hover:text-gold"
              >
                Open as JSON →
              </a>
            )}
          </div>

          {snapshot && snapshot.projects[0] && (
            <details className="mt-6">
              <summary className="hud-label cursor-pointer text-gold">
                Preview the first project
              </summary>
              <pre className="mt-4 max-h-96 overflow-auto bg-ink p-4 text-xs text-muted">
                {JSON.stringify(snapshot.projects[0], null, 2)}
              </pre>
            </details>
          )}
        </Panel>
      </div>
    </>
  );
}