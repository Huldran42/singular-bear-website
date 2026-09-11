import Link from 'next/link';
import {
  artstationUrl,
  assetStorePublisherUrl,
  contactEmail,
  studioName,
} from '@/lib/site';
import { primaryNav } from '@/lib/nav';

export function SiteFooter() {
  return (
    <footer className="border-t border-studio-line bg-studio-bg text-studio-text">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <p className="font-heading text-2xl font-semibold tracking-[-0.02em]">
            {studioName}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-studio-muted">
            Production-ready Unity shaders and hand-painted 2D worlds. Purchases
            complete on the Unity Asset Store.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-studio-subtle uppercase">
            Studio
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-studio-muted hover:text-studio-text"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-studio-subtle uppercase">
            Elsewhere
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href={assetStorePublisherUrl}
              className="text-studio-muted hover:text-studio-text"
              target="_blank"
              rel="noreferrer"
            >
              Unity Asset Store
            </a>
            <a
              href={artstationUrl}
              className="text-studio-muted hover:text-studio-text"
              target="_blank"
              rel="noreferrer"
            >
              ArtStation
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="text-studio-muted hover:text-studio-text"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
