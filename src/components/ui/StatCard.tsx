import Panel from "./Panel";

type StatCardProps = {
  label: string;
  value: number | string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Panel>
      <p className="hud-caps text-gold-dim">{label}</p>
      <p className="mt-3 font-display text-7xl leading-none font-semibold tracking-wide text-paper">
        {value}
      </p>
      <div className="mt-4 h-1 w-10 bg-sky" />
    </Panel>
  );
}
