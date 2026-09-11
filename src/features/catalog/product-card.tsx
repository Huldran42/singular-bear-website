import Link from 'next/link';
import { CoverImage } from '@/components/media/cover-image';
import type { Product } from '@/lib/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group sb-card block transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-studio-line-strong hover:shadow-[0_24px_60px_color-mix(in_oklab,var(--studio-deep)_85%,transparent)]"
    >
      <CoverImage
        src={product.image}
        alt={product.title}
        className="aspect-[3/2] rounded-none"
        imageClassName="group-hover:scale-[1.05]"
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
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-studio-text transition-colors group-hover:text-studio-accent">
          {product.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-studio-muted">
          {product.summary}
        </p>
      </div>
    </Link>
  );
}
