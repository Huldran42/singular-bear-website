import Link from 'next/link';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr';
import { CoverImage } from '@/components/media/cover-image';
import { YoutubeEmbed } from '@/components/media/youtube-embed';
import type { Product } from '@/lib/products';

type ProductDetailProps = {
  product: Product;
  webglUrl?: string;
};

export function ProductDetail({ product, webglUrl }: ProductDetailProps) {
  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      <p className="font-mono text-sm text-studio-accent">{product.category}</p>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
            {product.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted sm:text-lg">
            {product.description}
          </p>
        </div>
        <p className="text-lg font-semibold text-studio-accent">
          {product.status ?? product.price}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {product.storeUrl ? (
          <a
            href={product.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground"
          >
            Buy on Asset Store <ArrowSquareOutIcon />
          </a>
        ) : null}
        {webglUrl ? (
          <Link
            href={`/webplayer/${product.slug}`}
            className="inline-flex h-11 items-center rounded-full border border-studio-line-strong px-5 text-sm font-semibold text-studio-text"
          >
            Launch Web Player
          </Link>
        ) : null}
        <Link
          href={`/documentation/${product.slug}`}
          className="inline-flex h-11 items-center rounded-full border border-studio-line px-5 text-sm font-semibold text-studio-text"
        >
          Manual
        </Link>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        {product.videoId ? (
          <YoutubeEmbed videoId={product.videoId} title={product.title} />
        ) : (
          <CoverImage
            src={product.image}
            alt={product.title}
            className="min-h-[280px] aspect-[16/10]"
            priority
          />
        )}
        <aside className="rounded-[16px] border border-studio-line bg-studio-surface p-6">
          <dl className="grid gap-4 text-sm">
            <Spec label="Version" value={product.version} />
            <Spec label="Unity" value={product.unityVersion} />
            <Spec label="Pipelines" value={product.pipelines.join(', ')} />
            {product.releaseDate ? (
              <Spec label="Released" value={product.releaseDate} />
            ) : null}
            {product.fileSize ? (
              <Spec label="Size" value={product.fileSize} />
            ) : null}
          </dl>
        </aside>
      </div>

      {product.gallery.length > 1 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.gallery.map((src) => (
            <CoverImage
              key={src}
              src={src}
              alt=""
              className="aspect-[3/2]"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          ))}
        </div>
      ) : null}

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
          Included
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="rounded-[14px] border border-studio-line bg-studio-surface px-4 py-3 text-sm text-studio-text"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-studio-subtle">{label}</dt>
      <dd className="mt-1 font-medium text-studio-text">{value}</dd>
    </div>
  );
}
