type PageHeaderProps = {
  eyebrow: string; 
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="hud-label text-gold">{eyebrow}</p>
      <h1 className="mt-2 font-display text-5xl leading-[0.95] text-paper md:text-6xl">
        {title}
      </h1>
      {description && <p className="mt-3 max-w-xl text-muted">{description}</p>}
    </header>
  );
}