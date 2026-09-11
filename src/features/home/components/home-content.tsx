import Image from 'next/image';
import Link from 'next/link';
import { ProductGrid } from '@/features/catalog/product-grid';
import { products } from '@/lib/products';

const featuredLooks = [
  { src: '/Banner_Glass_01.png', label: 'Clear' },
  { src: '/Banner_Glass_03.png', label: 'Colorized' },
  { src: '/Banner_Glass_06.png', label: 'Iridescent' },
] as const;

export function HomeContent() {
  const featured = products[0];
  const catalog = products.slice(1);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      {featured ? (
        <section>
          <article className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-studio-line">
            <Image
              src={featured.image}
              alt=""
              fill
              priority
              className="object-cover object-[center_32%]"
              sizes="(min-width: 1400px) 1400px, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#070b0c] via-[#070b0c]/55 to-black/10" />
            <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 sm:p-10 lg:p-12">
              <p className="font-mono text-sm text-studio-accent">Featured</p>
              <h2 className="font-heading mt-3 max-w-[14ch] text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/72">
                {featured.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/products/${featured.slug}`}
                  className="sb-btn sb-btn-primary h-11"
                >
                  Open the shader
                </Link>
                <Link
                  href={`/documentation/${featured.slug}`}
                  className="sb-btn sb-btn-glass h-11"
                >
                  Read the manual
                </Link>
              </div>
            </div>
          </article>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {featuredLooks.map((look) => (
              <Link
                key={look.label}
                href={`/products/${featured.slug}`}
                className="group relative overflow-hidden rounded-[22px] border border-studio-line"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={look.src}
                    alt=""
                    fill
                    className="object-cover object-[center_38%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
                  <p className="text-sm font-semibold tracking-wide text-white">
                    {look.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-studio-line pb-5">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em]">
            Catalog
          </h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-studio-accent hover:text-studio-accent-hover"
          >
            All products
          </Link>
        </div>
        <ProductGrid products={catalog.length > 0 ? catalog : products} />
      </section>
    </div>
  );
}
