type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-sm text-studio-accent">{eyebrow}</p>
      <h1 className="font-heading mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}
