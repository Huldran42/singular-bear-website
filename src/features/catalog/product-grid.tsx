import { ProductCard } from '@/features/catalog/product-card';
import type { Product } from '@/lib/products';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
