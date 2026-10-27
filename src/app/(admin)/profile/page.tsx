
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="03 // Profile" title="Profile" />
      <Panel title="Under construction" tag="later">
        <p className="text-muted">The profile editor will live here.</p>
      </Panel>
    </>
  );
}