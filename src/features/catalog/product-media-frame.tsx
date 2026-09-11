'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProductVideo } from '@/lib/product-videos';
import type { Product } from '@/lib/products';

type Slide =
  | { type: 'file'; src: string; poster?: string }
  | { type: 'youtube'; id: string }
  | { type: 'image'; src: string };

function slidesFor(product: Product, videos: ProductVideo[]): Slide[] {
  const slides: Slide[] = videos.map((video) => ({
    type: 'file' as const,
    src: video.src,
    poster: video.poster,
  }));

  if (product.videoId) {
    slides.push({ type: 'youtube', id: product.videoId });
  }

  const images =
    product.gallery.length > 0 ? product.gallery : [product.image];
  const seen = new Set<string>();
  for (const src of images) {
    if (seen.has(src)) continue;
    seen.add(src);
    slides.push({ type: 'image', src });
  }

  return slides;
}

function slideKey(slide: Slide) {
  if (slide.type === 'youtube') return `youtube-${slide.id}`;
  return slide.src;
}

function slideAspect(slide: Slide) {
  if (slide.type === 'youtube') return 'aspect-video';
  if (slide.type === 'image' && slide.src.includes('meadow.jpg')) {
    return 'aspect-video';
  }
  return 'aspect-[3/2]';
}

function thumbSrc(slide: Slide, product: Product) {
  if (slide.type === 'image') return slide.src;
  if (slide.type === 'file' && slide.poster) return slide.poster;
  return product.image;
}

function isVideo(slide: Slide) {
  return slide.type === 'file' || slide.type === 'youtube';
}

export function ProductMediaFrame({
  product,
  videos = [],
}: {
  product: Product;
  videos?: ProductVideo[];
}) {
  const slides = slidesFor(product, videos);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const current = slides[active] ?? slides[0];

  if (!current) return null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[22px]',
          slideAspect(current),
        )}
      >
        {current.type === 'youtube' ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${current.id}`}
            title={product.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : current.type === 'file' ? (
          <video
            key={current.src}
            className="absolute inset-0 h-full w-full object-cover"
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            autoPlay={autoplay}
            preload="metadata"
          />
        ) : (
          <Image
            src={current.src}
            alt={product.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        )}
      </div>

      {slides.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((slide, index) => (
            <button
              key={slideKey(slide)}
              type="button"
              aria-label={
                isVideo(slide)
                  ? `Play ${product.title} video`
                  : `View image ${index + 1}`
              }
              aria-pressed={index === active}
              onClick={() => {
                setActive(index);
                setAutoplay(isVideo(slide));
              }}
              className={cn(
                'relative w-[4.75rem] shrink-0 overflow-hidden rounded-[10px] outline-none sm:w-[5.5rem]',
                slideAspect(slide),
                index === active
                  ? 'ring-2 ring-studio-accent'
                  : 'ring-1 ring-studio-line hover:ring-studio-line-strong',
              )}
            >
              <Image
                src={thumbSrc(slide, product)}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
              {isVideo(slide) ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="ml-0.5 h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
