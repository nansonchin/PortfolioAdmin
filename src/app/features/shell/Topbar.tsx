import LogoutButton from "../auth/LogoutButton";

export default function Topbar({ username }: { username: string }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
      <p className="hud-label flex items-center gap-3 text-gold-dim">
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-gold" />
        Operator <span className="text-paper">{username}</span>
      </p>
      <LogoutButton />
    </header>
  );
}