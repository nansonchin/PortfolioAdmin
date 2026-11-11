"use client";

import { usePathname, useRouter } from "next/navigation";
import TransitionLink from "@/components/transition/TransitionLink";
import Button, { buttonClasses } from "@/components/ui/Button";

type Props = {
  /** true for the root 404 (no admin shell around it) */
  fullscreen?: boolean;
};

export default function NotFoundScreen({ fullscreen = false }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        fullscreen ? "min-h-full p-8" : "min-h-[60vh] py-10"
      }`}
    >
      <div className="w-full max-w-2xl">
        <div className="h-0.5 bg-ice" aria-hidden />
        <div className="tex-dark relative px-6 py-12 text-white">
          <div aria-hidden className="absolute inset-3 border border-sky/30" />
          <p className="hud-caps relative text-ice">
            <span aria-hidden className="mr-3 tracking-[0.3em]">
              ✕✕✕
            </span>
            Error 404
            <span aria-hidden className="ml-3 tracking-[0.3em]">
              ✕✕✕
            </span>
          </p>
          <h1
            data-text="404"
            className="etched relative mt-2 font-display text-[clamp(6.5rem,24vw,12rem)] leading-[0.9] font-bold tracking-wide"
          >
            404
          </h1>
          <p className="relative mt-3 font-display text-2xl font-semibold tracking-[0.18em] uppercase">
            Page not found
          </p>
        </div>
        <div className="h-2 border-t border-ice/45 bg-navy-2" aria-hidden />
        <div className="h-0.5 bg-ice" aria-hidden />
      </div>

      <p className="mt-8 max-w-md text-muted">
        There is nothing at{" "}
        <code className="font-system text-sm break-all text-paper">{pathname}</code>. It may have
        been deleted, or the address is mistyped.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <TransitionLink href="/dashboard" className={buttonClasses("primary")}>
          Back to dashboard
        </TransitionLink>
        <Button variant="ghost" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}
