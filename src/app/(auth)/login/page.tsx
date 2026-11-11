import LoginForm from "@/app/features/auth/LoginForm";
import TransitionStage from "@/components/transition/TransitionStage";

export default function LoginPage() {
  return (
    <TransitionStage className="relative h-dvh">
      <main className="flex min-h-full items-center justify-center p-8">
        <section className="w-full max-w-md">
          <div className="chamfer bg-line p-px">
            <div className="chamfer-inner bg-ink-2">
              <div className="h-0.5 bg-gold" aria-hidden />
              <div className="p-10">
                <p className="hud-caps flex items-center gap-3 text-gold">
                  <span aria-hidden className="tracking-[0.3em]">
                    ✕✕✕
                  </span>
                  Restricted access
                </p>
                <h1 className="mt-3 font-display text-6xl leading-[0.95] font-semibold tracking-wide text-paper uppercase">
                  Sign in
                </h1>
                <div aria-hidden className="mt-4 flex items-center gap-2">
                  <span className="h-px w-16 bg-gold" />
                  <span className="size-1.5 rotate-45 bg-amber" />
                </div>
                <LoginForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </TransitionStage>
  );
}
