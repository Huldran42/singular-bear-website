'use client';

import { XIcon } from '@phosphor-icons/react';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ProductInfo } from '@/lib/product-infos';
import type { Product } from '@/lib/products';

type Spec = { label: string; value: string };

const OVERVIEW = 'overview';

export function ProductInfoCard({
  product,
  info,
  specs,
}: {
  product: Product;
  info?: ProductInfo;
  specs: Spec[];
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(OVERVIEW);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const card = (
    <>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {specs.map((spec) => (
          <div key={spec.label}>
            <dt className="text-studio-subtle">{spec.label}</dt>
            <dd className="mt-1 font-medium text-studio-text">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-6 text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
        Included
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-studio-text">
        {product.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {info ? (
        <p className="mt-5 text-xs font-semibold tracking-wide text-studio-accent">
          Click for the full feature list
        </p>
      ) : null}
    </>
  );

  const family = info?.families.find((entry) => entry.id === tab);
  const familyGroups =
    family?.groupTitles
      .map((title) => info?.groups.find((group) => group.title === title))
      .filter((group) => group != null) ?? [];

  return (
    <>
      {info ? (
        <button
          type="button"
          onClick={() => {
            setTab(OVERVIEW);
            setOpen(true);
          }}
          className="sb-card flex min-h-0 flex-1 flex-col overflow-hidden text-left transition-[border-color,box-shadow] hover:border-studio-line-strong hover:shadow-[0_16px_40px_color-mix(in_oklab,var(--studio-deep)_70%,transparent)]"
        >
          <div className="min-h-0 flex-1 p-5 sm:p-6">{card}</div>
        </button>
      ) : (
        <div className="sb-card flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{card}</div>
        </div>
      )}

      {open && info ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#070b0c]/70 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex h-[min(90dvh,880px)] w-full max-w-[1280px] flex-col overflow-hidden rounded-[22px] border border-studio-line bg-studio-bg p-5 text-studio-text shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7 lg:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-sm text-studio-accent">
                  {product.category}
                </p>
                <h2
                  id={titleId}
                  className="font-heading mt-1 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
                >
                  {product.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-studio-line text-studio-text"
                aria-label="Close feature list"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div
              className="mt-6 flex shrink-0 flex-wrap gap-2"
              role="tablist"
              aria-label="Feature families"
            >
              <TabButton
                active={tab === OVERVIEW}
                onClick={() => setTab(OVERVIEW)}
              >
                Overview
              </TabButton>
              {info.families.map((entry) => (
                <TabButton
                  key={entry.id}
                  active={tab === entry.id}
                  onClick={() => setTab(entry.id)}
                >
                  {entry.label}
                </TabButton>
              ))}
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-hidden">
              {tab === OVERVIEW ? (
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="max-w-4xl">
                    <p className="text-xl font-semibold leading-snug text-studio-text sm:text-2xl">
                      {info.kicker}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-studio-muted sm:text-lg">
                      {info.lead}
                    </p>
                    <p className="mt-4 text-base font-medium leading-relaxed text-studio-text sm:text-lg">
                      {info.tagline}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {info.highlights.map((item, index) => (
                      <div
                        key={item}
                        className="rounded-[18px] border border-studio-line bg-studio-surface p-5"
                      >
                        <p className="font-mono text-sm text-studio-accent">
                          0{index + 1}
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-studio-text">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  {family ? (
                    <p className="shrink-0 text-lg leading-relaxed text-studio-muted">
                      {family.blurb}
                    </p>
                  ) : null}
                  <div className="mt-5 min-h-0 flex-1">
                    {familyGroups.length === 1 ? (
                      <section className="min-w-0">
                        <h3 className="text-sm font-semibold tracking-[0.14em] text-studio-accent uppercase">
                          {familyGroups[0].title}
                        </h3>
                        <ul className="mt-4 grid gap-x-10 gap-y-3 lg:grid-cols-2">
                          {familyGroups[0].items.map((item) => (
                            <FeatureItem
                              key={item.label}
                              label={item.label}
                              detail={item.detail}
                            />
                          ))}
                        </ul>
                      </section>
                    ) : (
                      <div className="grid gap-8 lg:grid-cols-2">
                        {familyGroups.map((group) => (
                          <section key={group.title} className="min-w-0">
                            <h3 className="text-sm font-semibold tracking-[0.14em] text-studio-accent uppercase">
                              {group.title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                              {group.items.map((item) => (
                                <FeatureItem
                                  key={item.label}
                                  label={item.label}
                                  detail={item.detail}
                                />
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FeatureItem({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="text-base leading-relaxed sm:text-lg">
      <span className="font-semibold text-studio-text">{label}</span>
      <span className="text-studio-muted"> — {detail}</span>
    </li>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors',
        active
          ? 'bg-studio-accent text-studio-accent-foreground'
          : 'border border-studio-line text-studio-text hover:border-studio-line-strong',
      )}
    >
      {children}
    </button>
  );
}
