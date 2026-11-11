type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  // "02 // Projects / slug" -> "Projects / slug" (breadcrumb, no fake numbering)
  const crumb = eyebrow.replace(/^\d+\s*\/\/\s*/, "");

  return (
    <header className="mb-8">
      <p className="hud-caps flex items-center gap-3 text-gold">
        <span aria-hidden className="tracking-[0.3em]">
          ✕✕✕
        </span>
        {crumb}
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none font-semibold tracking-wide text-paper uppercase md:text-7xl">
        {title}
      </h1>
      <div aria-hidden className="mt-4 flex items-center gap-2">
        <span className="h-px w-16 bg-gold" />
        <span className="size-1.5 rotate-45 bg-amber" />
      </div>
      {description && <p className="mt-4 max-w-xl text-muted">{description}</p>}
    </header>
  );
}
