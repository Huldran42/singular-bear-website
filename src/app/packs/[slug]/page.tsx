import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PackDetail } from '@/features/packs/pack-detail';
import { getWebglUrl } from '@/lib/webgl';
import { getPackDemo, getPackExperience, packDemos } from '@/webplayer/config';

type PackPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return packDemos.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({
  params,
}: PackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pack = getPackDemo(slug);
  if (!pack) return {};

  return {
    title: pack.title,
    description: pack.subtitle,
    alternates: { canonical: `/packs/${pack.slug}` },
  };
}

export default async function PackPage({ params }: PackPageProps) {
  const { slug } = await params;
  const demo = getPackDemo(slug);
  if (!demo) notFound();

  const pack = getPackExperience(
    slug,
    getWebglUrl(demo.slug, demo.productSlug),
  );
  if (!pack) notFound();

  return (
    <main className="bg-studio-bg text-studio-text">
      <PackDetail pack={pack} />
    </main>
  );
}
