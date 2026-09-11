import type { ReactNode } from 'react';

type PageTitleRowProps = {
  eyebrow: string;
  title: string;
  trailing?: ReactNode;
};

export function PageTitleRow({ eyebrow, title, trailing }: PageTitleRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <p className="font-mono text-sm text-studio-accent">{eyebrow}</p>
      <h1 className="font-heading col-span-2 text-center text-4xl font-semibold tracking-[-0.03em] text-balance sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:text-6xl">
        {title}
      </h1>
      <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3">
        {trailing}
      </div>
    </div>
  );
}

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  inlineEyebrow?: boolean;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  inlineEyebrow,
}: PageIntroProps) {
  return (
    <header className={inlineEyebrow ? undefined : 'max-w-3xl'}>
      {inlineEyebrow ? (
        <PageTitleRow eyebrow={eyebrow} title={title} />
      ) : (
        <>
          <p className="font-mono text-sm text-studio-accent">{eyebrow}</p>
          <h1 className="font-heading mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
            {title}
          </h1>
        </>
      )}
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}
