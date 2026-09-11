import Link from 'next/link';
import { ProductGrid } from '@/features/catalog/product-grid';
import { products } from '@/lib/products';

export function HomeContent() {
  const featured = products[0];
  const catalog = products.slice(1);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12">
      {featured ? (
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-sm text-studio-accent">Featured</p>
            <h2 className="font-heading mt-4 max-w-[14ch] text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-studio-muted">
              {featured.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/products/${featured.slug}`}
              className="inline-flex h-11 items-center rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground"
            >
              Open the shader
            </Link>
            <Link
              href={`/documentation/${featured.slug}`}
              className="inline-flex h-11 items-center rounded-full border border-studio-line px-5 text-sm font-semibold text-studio-text"
            >
              Read the manual
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em]">
            Catalog
          </h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-studio-accent"
          >
            All products
          </Link>
        </div>
        <ProductGrid products={catalog.length > 0 ? catalog : products} />
      </section>
    </div>
  );
}
