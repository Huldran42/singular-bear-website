import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/page-intro';
import { PackCard } from '@/features/packs/pack-card';
import { getWebglUrl } from '@/lib/webgl';
import { packDemos } from '@/webplayer/config';

export const metadata: Metadata = {
  title: 'Packs',
  description:
    'Videos, galleries and Unity WebGL demos for Singular Bear Studio packs.',
  alternates: { canonical: '/packs' },
};

export default function PacksPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Demos"
          title="See the packs in motion."
          description="Official videos and WebGL builds, when an export is ready to play in the browser."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {packDemos.map((pack) => (
            <PackCard
              key={pack.slug}
              pack={pack}
              hasWebgl={Boolean(getWebglUrl(pack.slug, pack.productSlug))}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
