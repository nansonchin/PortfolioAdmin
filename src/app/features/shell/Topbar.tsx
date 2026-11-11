import LogoutButton from "../auth/LogoutButton";

export default function Topbar({ username }: { username: string }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-line bg-white/75 px-6 py-3 backdrop-blur md:px-10">
      <p className="hud-label flex items-center gap-3 text-gold-dim">
        <span className="inline-block size-2 bg-sky" />
        Signed in as <span className="text-paper">{username}</span>
      </p>
      <LogoutButton />
    </header>
  );
}
