import Link from 'next/link';
import { CoverImage } from '@/components/media/cover-image';
import type { Product } from '@/lib/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-[16px] border border-studio-line bg-studio-surface"
    >
      <CoverImage
        src={product.image}
        alt={product.title}
        className="aspect-[3/2]"
      />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
            {product.category}
          </p>
          <p className="text-sm font-semibold text-studio-accent">
            {product.status ?? product.price ?? 'View'}
          </p>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-studio-text group-hover:text-studio-accent">
          {product.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-studio-muted">
          {product.summary}
        </p>
      </div>
    </Link>
  );
}
