import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/page-intro';
import { createManual } from '@/lib/manuals';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Installation and usage manuals for Singular Bear Studio Unity assets.',
  alternates: { canonical: '/documentation' },
};

export default function DocumentationPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Manuals"
          title="Clear setup, then art direction."
          description="Each product ships with a studio manual covering import, pipelines and practical checks."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {products.map((product) => {
            const manual = createManual(product);
            return (
              <Link
                key={product.slug}
                href={`/documentation/${product.slug}`}
                className="rounded-[16px] border border-studio-line bg-studio-surface p-6"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
                  {product.category}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  {manual.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-studio-muted">
                  {manual.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
