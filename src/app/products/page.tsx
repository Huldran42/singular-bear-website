import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/page-intro';
import { ProductGrid } from '@/features/catalog/product-grid';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Unity shaders and hand-painted 2D environment packs from Singular Bear Studio.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Catalog"
          title="Shaders and worlds, ready to ship."
          description="Every pack is documented, previewed and sold through the Unity Asset Store."
        />
        <div className="mt-12">
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
