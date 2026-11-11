"use client";

import Button from "@/components/ui/Button";
import { useTransitionRouter } from "@/components/transition/TransitionProvider";

export default function LogoutButton() {
  const { navigate } = useTransitionRouter();

  function handleLogout() {
    navigate("/login", {
      replace: true,
      refresh: true,
      skipGuard: false,
      label: "Signing out",
      before: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
      },
    });
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Log out
    </Button>
  );
}
