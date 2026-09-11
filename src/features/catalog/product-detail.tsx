import Link from 'next/link';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr';
import { PageTitleRow } from '@/components/layout/page-intro';
import { ProductInfoCard } from '@/features/catalog/product-info-card';
import { ProductMediaFrame } from '@/features/catalog/product-media-frame';
import { getProductInfo } from '@/lib/product-infos';
import type { ProductVideo } from '@/lib/product-videos';
import type { Product } from '@/lib/products';

type ProductDetailProps = {
  product: Product;
  webglUrl?: string;
  videos?: ProductVideo[];
};

export function ProductDetail({
  product,
  webglUrl,
  videos,
}: ProductDetailProps) {
  const price = product.status ?? product.price;
  const info = getProductInfo(product.slug);
  const specs = [
    { label: 'Version', value: product.version },
    { label: 'Unity', value: product.unityVersion },
    { label: 'Pipelines', value: product.pipelines.join(', ') },
    ...(product.releaseDate
      ? [{ label: 'Released', value: product.releaseDate }]
      : []),
    ...(product.fileSize ? [{ label: 'Size', value: product.fileSize }] : []),
  ];

  return (
    <article className="mx-auto flex max-w-[1400px] flex-col px-5 pb-10 pt-28 sm:px-8 lg:h-[100dvh] lg:overflow-hidden lg:pb-6 lg:px-12">
      <PageTitleRow
        eyebrow={product.category}
        title={product.title}
        trailing={
          price ? (
            <p className="text-lg font-semibold text-studio-accent">{price}</p>
          ) : null
        }
      />
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-studio-muted">
        {product.description}
      </p>

      <div className="mt-6 grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
        <ProductMediaFrame product={product} videos={videos} />

        <aside className="flex min-h-0 flex-col gap-3">
          {webglUrl ? (
            <Link
              href={`/webplayer/${product.slug}`}
              className="sb-btn sb-btn-primary h-11 w-full shrink-0"
            >
              Launch Web Player
            </Link>
          ) : null}

          <ProductInfoCard product={product} info={info} specs={specs} />

          {product.storeUrl ? (
            <a
              href={product.storeUrl}
              target="_blank"
              rel="noreferrer"
              className="sb-btn sb-btn-outline h-11 w-full shrink-0"
            >
              Buy on Asset Store <ArrowSquareOutIcon />
            </a>
          ) : null}
          <Link
            href={`/documentation/${product.slug}`}
            className="sb-btn sb-btn-outline h-11 w-full shrink-0"
          >
            Manual
          </Link>
        </aside>
      </div>
    </article>
  );
}
