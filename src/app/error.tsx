'use client';

import { ArrowClockwiseIcon as ArrowClockwise } from '@phosphor-icons/react/dist/ssr';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[100dvh] items-center bg-studio-bg px-5 py-24 text-studio-text sm:px-8">
      <div className="mx-auto w-full max-w-xl rounded-[16px] border border-studio-line bg-studio-surface p-8 sm:p-10">
        <p className="text-sm font-semibold text-studio-accent">
          Preview interrupted
        </p>
        <h1 className="font-heading mt-4 text-4xl font-semibold tracking-[-0.015em]">
          The render stopped unexpectedly.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-studio-muted">
          Try loading this view again. Your place in the catalog is preserved.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground active:translate-y-px"
        >
          <ArrowClockwise /> Try again
        </button>
      </div>
    </main>
  );
}
