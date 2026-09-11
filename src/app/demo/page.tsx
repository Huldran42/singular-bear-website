import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/page-intro';
import { CoverImage } from '@/components/media/cover-image';
import { getLiveDemos } from '@/lib/webgl';

export const metadata: Metadata = {
  title: 'Live demos',
  description:
    'Playable WebGL demos of Singular Bear Studio Unity shaders and packs.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  const demos = getLiveDemos();

  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Live"
          title="Try the demos."
          description="Playable WebGL builds, in the browser. Packs appear here as soon as a demo is ready."
          inlineEyebrow
        />

        {demos.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <article key={demo.slug} className="sb-card flex flex-col">
                <CoverImage
                  src={demo.image}
                  alt={demo.title}
                  className="aspect-[16/10] rounded-none"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
                    {demo.category}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {demo.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-studio-muted">
                    {demo.summary}
                  </p>
                  <Link
                    href={`/webplayer/${demo.slug}`}
                    className="sb-btn sb-btn-primary mt-5 h-11 w-full"
                  >
                    Launch WebGL
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-12 max-w-xl text-base leading-relaxed text-studio-muted">
            Demos are being prepared. Check back soon, or browse the catalog in
            the meantime.
          </p>
        )}
      </div>
    </main>
  );
}
