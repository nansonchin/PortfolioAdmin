import Panel from "./Panel";

type StatCardProps = {
  label: string;
  value: number | string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Panel>
      <p className="hud-label text-gold-dim">{label}</p>
      <p className="mt-3 font-display text-6xl leading-none text-paper">{value}</p>
    </Panel>
  );
}