import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, products } from '@/lib/products';
import { getWebglUrl } from '@/lib/webgl';
import { getPackDemo, packDemos } from '@/webplayer/config';
import { WebPlayer } from '@/webplayer/web-player';

type PlayerPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  const slugs = new Set([
    ...packDemos.map((pack) => pack.slug),
    ...products.map((product) => product.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function WebPlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const pack = getPackDemo(slug);
  const product = getProduct(slug) ?? (pack ? getProduct(pack.productSlug) : undefined);
  const src = getWebglUrl(slug, pack?.productSlug, product?.slug);

  if (!src) notFound();

  return <WebPlayer title={pack?.title ?? product?.title ?? 'Web Player'} src={src} />;
}
