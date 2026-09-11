import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ManualView } from '@/features/docs/manual-view';
import { getManual } from '@/lib/manuals';
import { products } from '@/lib/products';
import { siteUrl } from '@/lib/site';

type ManualPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ManualPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manual = getManual(slug);
  if (!manual) return {};

  return {
    title: manual.title,
    description: manual.description,
    alternates: { canonical: `/documentation/${manual.slug}` },
  };
}

export default async function ManualPage({ params }: ManualPageProps) {
  const { slug } = await params;
  const manual = getManual(slug);
  if (!manual) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: manual.title,
    description: manual.description,
    url: `${siteUrl}/documentation/${manual.slug}`,
  };

  return (
    <main className="bg-studio-bg text-studio-text">
      <ManualView manual={manual} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
