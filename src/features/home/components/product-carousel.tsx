'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/products';

export function ProductCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const count = products.length;

  const go = useCallback(
    (direction: number) => {
      setIndex((current) => (current + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || count < 2) return;

    const id = window.setInterval(() => go(1), 5600);
    return () => window.clearInterval(id);
  }, [count, go]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const active = products[index];

  return (
    <div className="relative h-[420px] sm:h-[460px]">
      <div className="relative mx-auto h-[280px] w-full max-w-[640px] sm:h-[320px]">
        {products.map((product, i) => {
          const raw = i - index;
          const offset =
            Math.abs(raw) > count / 2 ? raw - Math.sign(raw) * count : raw;
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          return (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              aria-label={product.title}
              aria-current={offset === 0 ? 'true' : undefined}
              tabIndex={offset === 0 ? 0 : -1}
              className="absolute top-0 left-1/2 w-[68%] max-w-[380px] origin-center rounded-[18px] bg-studio-deep transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                zIndex: 20 - abs,
                transform: `translateX(calc(-50% + ${offset * 38}%)) scale(${1 - abs * 0.1})`,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.58 : 0.28,
                pointerEvents: abs === 0 ? 'auto' : 'none',
              }}
            >
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-studio-line bg-studio-deep shadow-[0_22px_50px_rgba(8,12,14,0.45)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 380px, 68vw"
                  priority={i === 0}
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black from-15% via-black/80 to-transparent px-4 py-3">
                  <span className="block text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    {product.category}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-white sm:text-base">
                    {product.title}
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex h-12 items-center justify-between gap-4">
        <p className="min-w-0 truncate text-sm leading-5 text-studio-muted">
          {active ? (
            <>
              <span className="font-medium text-studio-text">{active.title}</span>
              <span className="text-studio-subtle"> — {active.summary}</span>
            </>
          ) : null}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-studio-line text-studio-text"
            aria-label="Previous pack"
            onClick={() => go(-1)}
          >
            <CaretLeftIcon size={16} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-studio-line text-studio-text"
            aria-label="Next pack"
            onClick={() => go(1)}
          >
            <CaretRightIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {products.map((product, i) => (
          <button
            key={product.slug}
            type="button"
            aria-label={`Show ${product.title}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index
                ? 'w-7 bg-studio-accent'
                : 'w-1.5 bg-studio-line-strong hover:bg-studio-muted',
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
