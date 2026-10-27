import LoginForm from "@/app/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="halftone ink-wash scanlines flex min-h-screen items-center justify-center p-8">
      <section className="chamfer w-full max-w-md bg-ink-2 p-10">
        <p className="hud-label text-gold">Access // Restricted</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9] text-paper">
          Sign in
        </h1>
        <LoginForm />
      </section>
    </main>
  );
}