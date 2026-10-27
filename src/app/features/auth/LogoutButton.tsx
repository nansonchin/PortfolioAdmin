"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
   <Button variant="ghost" onClick={handleLogout}>
    Log Out
   </Button>
  );
}