import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/page-intro';

export const metadata: Metadata = {
  title: 'Prototype lab',
  robots: { index: false, follow: false },
};

const experiments = [
  {
    href: '/canvas3d',
    title: 'Canvas 3D',
    description: 'Reserved for in-browser 3D experiments.',
  },
  {
    href: '/liquidglass-ui',
    title: 'Liquid glass UI',
    description: 'Interface studies for the glass shader language.',
  },
  {
    href: '/ghost',
    title: 'Ghost',
    description: 'A quiet layout used for visual tests.',
  },
];

export default function PrototypePage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Internal"
          title="Prototype lab"
          description="These routes stay out of search. They exist so visual experiments have a stable URL."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {experiments.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[16px] border border-studio-line bg-studio-surface p-6"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-studio-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
