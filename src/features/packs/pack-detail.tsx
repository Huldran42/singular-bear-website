import Link from 'next/link';
import { CoverImage } from '@/components/media/cover-image';
import { YoutubeEmbed } from '@/components/media/youtube-embed';
import type { PackExperience } from '@/webplayer/config';

export function PackDetail({ pack }: { pack: PackExperience }) {
  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      <p className="font-mono text-sm text-studio-accent">{pack.category}</p>
      <h1 className="font-heading mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
        {pack.title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted">
        {pack.description}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {pack.webglUrl ? (
          <Link
            href={`/webplayer/${pack.slug}`}
            className="inline-flex h-11 items-center rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground"
          >
            Launch Web Player
          </Link>
        ) : null}
        <Link
          href={`/products/${pack.productSlug}`}
          className="inline-flex h-11 items-center rounded-full border border-studio-line px-5 text-sm font-semibold text-studio-text"
        >
          Product page
        </Link>
        {pack.storeUrl ? (
          <a
            href={pack.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full border border-studio-line px-5 text-sm font-semibold text-studio-text"
          >
            Asset Store
          </a>
        ) : null}
      </div>

      <div className="mt-12">
        {pack.videoId ? (
          <YoutubeEmbed videoId={pack.videoId} title={pack.title} />
        ) : (
          <CoverImage
            src={pack.image}
            alt={pack.title}
            className="aspect-[16/9]"
            priority
          />
        )}
      </div>

      {pack.gallery.length > 1 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pack.gallery.map((src) => (
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
    </article>
  );
}
