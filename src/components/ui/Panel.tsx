import { ReactNode } from "react";

type PanelProps = {
  title?: string;
  tag?: string;
  children: ReactNode;
  className?: string;
};

export default function Panel({
  title,
  tag,
  children,
  className = "",
}: PanelProps) {
  return (
    <section className={`chamfer bg-line p-px ${className}`}>
      <div className="chamfer-inner h-full bg-ink-2 p-6">
        {(title || tag) && (
          <header className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
            {title && (
              <h2 className="font-display text-2xl text-paper">{title}</h2>
            )}

            {tag && <span className="hud-label text-gold-dim">{tag}</span>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
