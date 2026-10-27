"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="chamfer hud-label border border-line bg-ink-2 px-5 py-2 text-gold transition hover:text-gold-bright"
    >
      Log out
    </button>
  );
}