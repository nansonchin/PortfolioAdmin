"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/transition/TransitionLink";
import { useTransitionState } from "@/components/transition/TransitionProvider";
import HexRing from "@/components/ui/HexRing";
import { NAV_ITEMS } from "./navItem";

function Hex({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      className="shrink-0"
    >
      <polygon
        points="6,0.8 10.5,3.4 10.5,8.6 6,11.2 1.5,8.6 1.5,3.4"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

type SidebarProps = {
   counts: Record<"deleted", number>;
};
export default function Sidebar({ counts }: SidebarProps) {
  const pathname = usePathname();
  const { target } = useTransitionState();

  // While the shutter is down, highlight where we are going, not where we were.
  const current = target ?? pathname;

  return (
    <aside className="tex-dark relative z-20 shrink-0 border-b border-ice/25 text-white md:flex md:h-full md:w-60 md:flex-col md:border-r md:border-b-0">
      <div className="px-6 pt-7 pb-5 md:pt-9 md:pb-8">
        <p className="hud-caps text-ice">Portfolio</p>
        <p className="mt-1 font-display text-4xl leading-none font-semibold tracking-wide uppercase">
          Admin
        </p>
        <div aria-hidden className="mt-4 flex items-center gap-2">
          <span className="h-px w-10 bg-ice/60" />
          <span className="size-1.5 rotate-45 bg-amber" />
        </div>
      </div>

      <nav className="flex gap-px overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {NAV_ITEMS.map((item) => {
          const active =
            current === item.href || current.startsWith(`${item.href}/`);

          const count = item.countKey ? counts[item.countKey] : undefined;
          const disabled = count === 0;

          if (disabled) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                title="Nothing has been deleted"
                className="hud-label flex cursor-not-allowed items-center gap-3 border-l-2 border-transparent px-4 py-3 whitespace-nowrap text-muted opacity-40"
              >
                <span className="text-gold-dim">{item.index}</span>
                {item.label}
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-5 py-2.5 font-display text-base font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors ${
                active
                  ? "para bg-ice/15 text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <span className={active ? "text-amber" : "text-white/40"}>
                <Hex filled={active} />
              </span>
              {item.label}
                 {count !== undefined && (
                <span className="hud-label ml-auto text-gold-dim">{count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto hidden h-32 overflow-hidden md:block">
        <HexRing size={150} className="absolute -bottom-8 -left-5 opacity-40" />
        <div className="absolute bottom-5 left-6 z-10">
          <p className="font-system text-[11px] tracking-[0.15em] text-ice/70">
            // ADMIN
          </p>
          <p className="mt-1 font-system text-[11px] tracking-[0.15em] text-ice/70">
            » CONSOLE ONLINE
          </p>
        </div>
      </div>
    </aside>
  );
}
