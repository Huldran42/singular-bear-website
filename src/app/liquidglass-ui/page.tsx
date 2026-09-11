import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/page-intro';

export const metadata: Metadata = {
  title: 'Liquid glass UI',
  robots: { index: false, follow: false },
};

export default function LiquidGlassUiPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Lab"
          title="Liquid glass"
          description="A small surface study for the studio’s glass language: refraction, frost and a quiet specular hit."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {['Clear', 'Frosted', 'Iridescent'].map((label) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-[22px] border border-white/20 bg-white/10 p-8 shadow-[0_20px_80px_rgba(10,20,18,0.18)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-studio-accent/30 via-transparent to-cyan-200/10" />
              <p className="relative text-sm font-semibold text-studio-text">
                {label}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-studio-muted">
                Keep the silhouette readable. Add dirt and sparkle only after the
                optical response is honest.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
