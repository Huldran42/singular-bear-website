import { ProductCard } from '@/features/catalog/product-card';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/products';

export function ProductGrid({
  products,
  compact,
}: {
  products: Product[];
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'grid gap-5 md:grid-cols-2',
        compact && 'gap-4 lg:grid-cols-3',
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} compact={compact} />
      ))}
    </div>
  );
}
