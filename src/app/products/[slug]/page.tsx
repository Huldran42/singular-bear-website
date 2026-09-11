import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/features/catalog/product-detail';
import { getProduct, products } from '@/lib/products';
import { siteUrl } from '@/lib/site';
import { getProductVideos } from '@/lib/product-videos';
import { getWebglUrl } from '@/lib/webgl';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.seoDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      url: `/products/${product.slug}`,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const webglUrl = getWebglUrl(product.slug);
  const videos = getProductVideos(product.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.seoDescription,
    image: `${siteUrl}${product.image}`,
    brand: { '@type': 'Brand', name: 'Singular Bear Studio' },
    offers: product.storeUrl
      ? {
          '@type': 'Offer',
          url: product.storeUrl,
          priceCurrency: 'USD',
          price: product.price?.replace('$', '') ?? undefined,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  };

  return (
    <main className="bg-studio-bg text-studio-text">
      <ProductDetail product={product} webglUrl={webglUrl} videos={videos} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
