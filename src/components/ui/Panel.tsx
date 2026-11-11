import { ReactNode } from "react";

type PanelProps = {
  title?: string;
  tag?: string;
  children: ReactNode;
  className?: string;
};

const HEX = "before:[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]";

export default function Panel({ title, tag, children, className = "" }: PanelProps) {
  return (
    <section className={className}>
      <div className="chamfer h-full bg-line p-px">
        <div className="chamfer-inner h-full bg-ink-2 p-6">
          {(title || tag) && (
            <header className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
              {title && (
                <h2
                  className={`flex items-center gap-3 font-display text-2xl font-semibold tracking-wide text-paper uppercase before:inline-block before:size-3 before:bg-gold ${HEX}`}
                >
                  {title}
                </h2>
              )}
              {tag && <span className="hud-caps text-gold-dim">{tag}</span>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
