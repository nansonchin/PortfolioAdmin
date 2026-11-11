"use client";


import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useTransitionRouter } from "@/components/transition/TransitionProvider";

export default function LoginForm() {
  const { navigate } = useTransitionRouter();

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false); 

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/dashboard", {
          replace: true,
          refresh: true,
          skipGuard: true,
          label: "Access granted",
        });
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? "Login failed");
    } catch {
      setError("Network error. Please try again.");
    }

    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="hud-label text-gold-dim">Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-2 w-full border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="hud-label text-gold-dim">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-gold"
        />
      </label>

      {error && (
        <p role="alert" className="hud-label text-alert">
          ⚠ {error}
        </p>
      )}

      <Button type="submit" loading={pending} className="w-full">
        {pending ? "Authenticating…" : "Enter"}
      </Button>
    </form>
  );
}