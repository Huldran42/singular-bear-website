import Link from 'next/link';
import { ProductCarousel } from '@/features/home/components/product-carousel';
import { products } from '@/lib/products';

const principles = [
  {
    title: 'Documented',
    body: 'Every pack ships with a studio manual: import, pipelines, and the checks that actually matter.',
  },
  {
    title: 'Shown, not sold as a screenshot',
    body: 'Videos, galleries and a WebGL player when a build is ready to run in the browser.',
  },
  {
    title: 'Bought on the Asset Store',
    body: 'This site is the vitrine. Purchases complete on the Unity Asset Store, where your license lives.',
  },
] as const;

const crafts = ['Lookdev', 'URP shaders', 'Mobile pipeline'] as const;

export function HomeContent() {
  return (
    <div className="bg-studio-bg text-studio-text">
      <section className="border-t border-studio-line">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12">
          <div className="max-w-xl">
            <p className="font-mono text-sm text-studio-accent">The studio</p>
            <h2 className="font-heading mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Created by a Game Artist for Game Artists.
            </h2>

            <div className="mt-8 flex items-start gap-5">
              <p className="font-heading text-6xl leading-none font-semibold tracking-[-0.06em] text-studio-accent sm:text-7xl">
                +15
              </p>
              <div className="pt-1">
                <p className="text-lg leading-snug text-studio-text">
                  years in video game
                </p>
                <p className="mt-1 text-lg leading-snug text-studio-muted">
                  Lookdev, URP shaders, mobile pipeline.
                </p>
              </div>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2">
              {crafts.map((craft) => (
                <li
                  key={craft}
                  className="rounded-full border border-studio-line bg-studio-surface px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] text-studio-muted uppercase"
                >
                  {craft}
                </li>
              ))}
            </ul>
          </div>

          <ProductCarousel products={products} />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <p className="font-mono text-sm text-studio-accent">How it works</p>
        <h2 className="font-heading mt-4 max-w-[16ch] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          A vitrine, then the store.
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-studio-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-studio-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              The catalog lives next door.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-studio-muted">
              Packs, manuals and demos are on Products. This page is just the
              studio.
            </p>
          </div>
          <Link href="/products" className="sb-btn sb-btn-primary">
            Browse products
          </Link>
        </div>
      </section>
    </div>
  );
}
