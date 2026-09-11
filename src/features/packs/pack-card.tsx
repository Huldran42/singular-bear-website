import Link from 'next/link';
import { CoverImage } from '@/components/media/cover-image';
import type { PackDemo } from '@/webplayer/config';

export function PackCard({
  pack,
  hasWebgl,
}: {
  pack: PackDemo;
  hasWebgl?: boolean;
}) {
  return (
    <Link
      href={`/packs/${pack.slug}`}
      className="group overflow-hidden rounded-[16px] border border-studio-line bg-studio-surface"
    >
      <CoverImage src={pack.image} alt={pack.title} className="aspect-[16/10]" />
      <div className="p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
          {pack.subtitle}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-studio-text group-hover:text-studio-accent">
          {pack.title}
        </h2>
        {hasWebgl ? (
          <p className="mt-2 text-sm font-medium text-studio-accent">
            Web Player available
          </p>
        ) : null}
      </div>
    </Link>
  );
}
