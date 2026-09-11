'use client';

import { ArrowsOutIcon, XIcon } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

export function WebPlayer({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const requestFullscreen = useCallback(() => {
    const node = frameRef.current;
    if (!node) return;
    void node.requestFullscreen?.();
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-medium">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={requestFullscreen}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 px-3 text-xs font-semibold"
          >
            <ArrowsOutIcon size={14} /> Fullscreen
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20"
            aria-label="Close web player"
          >
            <XIcon size={14} />
          </button>
        </div>
      </div>
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        className="min-h-0 w-full flex-1 border-0 bg-black"
        allow="fullscreen; gamepad; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
  );
}
