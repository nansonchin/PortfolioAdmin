"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItem";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative z-20 border-b border-line bg-ink-2/80 backdrop-blur md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="px-6 py-6">
        <p className="hud-label text-gold-dim">Portfolio //</p>
        <p className="font-display text-4xl leading-none text-paper">Admin</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:pb-0">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`hud-label flex items-center gap-3 border-l-2 px-4 py-3 whitespace-nowrap transition ${
                active
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-transparent text-muted hover:text-paper"
              }`}
            >
              <span className="text-gold-dim">{item.index}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}