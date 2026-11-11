"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTransitionState, type TransitionState } from "./TransitionProvider";

// Keep in sync with CLOSE_MS / OPEN_MS in TransitionProvider.
const CLOSE_MS = 380;
const OPEN_MS = 480;
const EASE = "cubic-bezier(0.77, 0, 0.18, 1)";
const CELLS = 20;

const TICKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const r2 = i % 4 === 0 ? 74 : 70;
  const f = (n: number) => n.toFixed(2);
  return {
    x1: f(80 + 66 * Math.cos(a)),
    y1: f(80 + 66 * Math.sin(a)),
    x2: f(80 + r2 * Math.cos(a)),
    y2: f(80 + r2 * Math.sin(a)),
  };
});

const MICRO = "absolute font-system text-[11px] tracking-[0.15em] text-ice/65";

function Rail({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className="absolute top-14 bottom-14 border-l border-dashed border-sky/40"
      style={{ [side]: 24 }}
    >
      <span className="absolute -left-1 top-0 size-[7px] rotate-45 border border-sky" />
      <span className="absolute -left-1 top-[48%] size-[7px] rotate-45 bg-white/90" />
      <span className="absolute -left-1 bottom-0 size-[7px] rotate-45 border border-sky" />
    </div>
  );
}

function ShutterDoor({ phase, label, target }: TransitionState & { target: string | null }) {
  const [pct, setPct] = useState(0);

  // Fake but honest-enough feedback: ease toward 90% while waiting, jump to 100% when the door lifts.
  useEffect(() => {
    if (phase === "idle") {
      setPct(0);
      return;
    }
    if (phase === "opening") {
      setPct(100);
      return;
    }
    const id = window.setInterval(() => setPct((p) => p + (90 - p) * 0.06), 40);
    return () => window.clearInterval(id);
  }, [phase]);

  const down = phase === "closing" || phase === "closed";
  const idle = phase === "idle";
  const filled = Math.round(pct / (100 / CELLS));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={idle}
      className="absolute inset-0 z-40 overflow-hidden"
      style={{ visibility: idle ? "hidden" : "visible", pointerEvents: idle ? "none" : "auto", cursor: "progress" }}
    >
      <div
        className="stage-door absolute inset-0 bg-navy"
        data-down={down}
        style={{
          transform: down ? "translateY(0)" : "translateY(-101%)",
          transition: `transform ${down ? CLOSE_MS : OPEN_MS}ms ${EASE}`,
          willChange: "transform",
        }}
      >
        <svg width="100%" height="100%" className="absolute inset-0" aria-hidden>
          <defs>
            <pattern id="sd-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#9cbdd4" fillOpacity="0.2" />
            </pattern>
            <pattern id="sd-scan" width="3" height="3" patternUnits="userSpaceOnUse">
              <rect width="3" height="1" fill="#fff" fillOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sd-dots)" />
          <rect width="100%" height="100%" fill="url(#sd-scan)" />
        </svg>

        {/* thin frame, two ice corner squares */}
        <div aria-hidden className="absolute inset-[10px] bottom-[22px] border border-sky/30">
          <span className="absolute -top-1 -left-1 size-2 bg-ice" />
          <span className="absolute -right-1 -bottom-1 size-2 bg-ice" />
        </div>

        <p className={`${MICRO} top-5 left-5`}>// ADMIN</p>
        <p className={`${MICRO} top-5 right-5`}>LINK 04</p>
        <p className={`${MICRO} bottom-[30px] left-5`}>ROUTE {target ?? "/"}</p>

        <Rail side="left" />
        <Rail side="right" />

        <svg
          width="170"
          height="170"
          viewBox="0 0 160 160"
          aria-hidden
          className="absolute top-[44%] left-1/2 -mt-[85px] -ml-[85px] opacity-40"
          style={{ animation: "stage-spin 14s linear infinite" }}
        >
          <polygon points="80,28 125,54 125,106 80,132 35,106 35,54" fill="none" stroke="#b0cbe8" strokeWidth="1" />
          {TICKS.map((t, i) => (
            <line key={i} {...t} stroke="#b0cbe8" strokeWidth="1" />
          ))}
        </svg>

        <div className="absolute inset-x-0 top-[44%] -translate-y-1/2 px-6 text-center">
          <p className="relative mb-2 font-system text-[11px] tracking-[0.5em] text-ice">T R A N S F E R R I N G</p>
          <div className="relative flex items-center justify-center gap-3 md:gap-4">
            <span aria-hidden className="text-sm tracking-[0.2em] text-sky">
              ✕✕✕
            </span>
            <span className="font-display text-4xl leading-none font-semibold tracking-wide text-white uppercase md:text-6xl">
              {label}
            </span>
            <span aria-hidden className="text-sm tracking-[0.2em] text-sky">
              ✕✕✕
            </span>
          </div>
          <div aria-hidden className="relative mt-4 flex justify-center gap-1">
            {Array.from({ length: CELLS }, (_, i) => (
              <span key={i} className={`h-[7px] w-2.5 ${i < filled ? "bg-sky" : "bg-white/15"}`} />
            ))}
          </div>
        </div>

        {/* same voice as TRANSFERRING, sitting right above the loading plate */}
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-10 text-center font-system text-[11px] tracking-[0.5em] text-ice"
        >
          N A V I G A T I N G
        </p>

        {/* trapezoid plate with the counter */}
        <div
          aria-hidden
          className="absolute bottom-2 left-1/2 h-[26px] w-[200px] -translate-x-1/2 bg-ice"
          style={{ clipPath: "polygon(7% 0,93% 0,100% 100%,0 100%)" }}
        >
          <div
            className="absolute inset-px flex items-center justify-center bg-navy-2"
            style={{ clipPath: "polygon(7% 0,93% 0,100% 100%,0 100%)" }}
          >
            <span className="font-system text-[11px] tracking-[0.18em] text-ice">
              » LOADING {String(Math.round(pct)).padStart(3, "0")}%
            </span>
          </div>
        </div>

        {/* plain steel lip */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2 border-t border-ice/45 bg-navy-2" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-ice" />
      </div>
    </div>
  );
}

type Props = {
  children: ReactNode;
  /** Must be a positioned box with a definite height. */
  className?: string;
};

/**
 * Owns the scrolling content area and the shutter that covers it.
 * Everything the shutter needs is in this file (no global CSS) and it is positioned
 * absolutely inside THIS box, so it can only ever cover the content area.
 * Put the sidebar / top bar outside this component and they stay usable.
 */
export default function TransitionStage({ children, className = "relative min-h-0 flex-1" }: Props) {
  const state = useTransitionState();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  // The scroll container is ours, so reset it on every route change (hidden behind the shutter).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={className}>
      <style>{`
        @keyframes stage-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .stage-door { transition: none !important; transform: none !important; opacity: 0; }
          .stage-door[data-down="true"] { opacity: 1; }
        }
      `}</style>

      <div ref={scrollRef} className="h-full overflow-y-auto">
        {children}
      </div>

      <ShutterDoor {...state} target={state.target ?? pathname} />
    </div>
  );
}
