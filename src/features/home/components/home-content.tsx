import Image from 'next/image';
import Link from 'next/link';

const practices = [
  {
    eyebrow: 'Shaders',
    title: 'Glass you can art-direct.',
    body: 'Physically based surfaces with rain, wear, refraction and stylized FX. Built for Unity URP, with a custom editor and a playable Web Player.',
    href: '/products/pro-glass-shader',
    image: '/Banner_Glass_01.png',
    imagePosition: 'object-[center_42%]',
  },
  {
    eyebrow: '2D worlds',
    title: 'Painted places, ready to walk.',
    body: 'Modular meadows, farms, dungeons and graveyards. Hand-painted, readable at gameplay scale, made for top-down Unity projects.',
    href: '/products',
    image: '/assets/products/meadow.jpg',
    imagePosition: 'object-center',
  },
] as const;

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

export function HomeContent() {
  return (
    <div className="bg-studio-bg text-studio-text">
      <section className="border-t border-studio-line">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-12">
          <p className="font-mono text-sm text-studio-accent">Who we are</p>
          <div>
            <h2 className="font-heading max-w-[18ch] text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              One studio, two crafts.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-studio-muted">
              Glass and light on one side. Painted terrain on the other. Both
              meant for teams who ship — not for tech demos that stay in a
              folder. We stay small so the work stays considered.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:gap-24">
          {practices.map((practice, index) => (
            <article
              key={practice.eyebrow}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div className={`max-w-xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <p className="font-mono text-sm text-studio-accent">
                  {practice.eyebrow}
                </p>
                <h3 className="font-heading mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {practice.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-studio-muted sm:text-lg">
                  {practice.body}
                </p>
                <Link
                  href={practice.href}
                  className="mt-6 inline-flex text-sm font-semibold text-studio-accent hover:text-studio-accent-hover"
                >
                  Look closer
                </Link>
              </div>
              <div
                className={`relative aspect-[5/4] overflow-hidden rounded-[28px] ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <Image
                  src={practice.image}
                  alt=""
                  fill
                  className={`object-cover ${practice.imagePosition}`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            </article>
          ))}
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
