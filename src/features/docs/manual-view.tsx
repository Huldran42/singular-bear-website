import Link from 'next/link';
import type { Manual } from '@/lib/manuals';

export function ManualView({ manual }: { manual: Manual }) {
  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      <p className="font-mono text-sm text-studio-accent">Documentation</p>
      <h1 className="font-heading mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
        {manual.title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted">
        {manual.description}
      </p>
      <p className="mt-3 text-sm text-studio-subtle">{manual.updated}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold tracking-[0.16em] text-studio-subtle uppercase">
            Sections
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {manual.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-studio-muted hover:text-studio-text"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
          <Link
            href={`/products/${manual.slug}`}
            className="mt-6 inline-flex text-sm font-semibold text-studio-accent"
          >
            Back to product
          </Link>
        </nav>

        <div className="space-y-10">
          {manual.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-[16px] border border-studio-line bg-studio-surface p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-studio-muted sm:text-base">
                {section.intro}
              </p>
              {section.steps ? (
                <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-studio-text">
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
              {section.notes ? (
                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-studio-muted">
                  {section.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
