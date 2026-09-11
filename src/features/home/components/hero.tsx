import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

export function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-studio-bg">
      <Image
        src="/Banner_Glass_06.png"
        alt=""
        fill
        priority
        className="object-cover opacity-70"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-b from-studio-bg/20 via-studio-bg/55 to-studio-bg" />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24 lg:px-12">
        <p className="font-mono text-sm text-studio-accent">
          Unity shaders and 2D worlds
        </p>
        <h1 className="font-heading mt-5 max-w-[12ch] text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-studio-text sm:text-7xl lg:text-8xl">
          Materials with a pulse.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-studio-muted sm:text-lg">
          Production-ready glass, hand-painted environments and playable demos
          for teams shipping on Unity URP.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground"
          >
            Browse products <ArrowRightIcon />
          </Link>
          <Link
            href="/packs"
            className="inline-flex h-12 items-center rounded-full border border-studio-line-strong px-5 text-sm font-semibold text-studio-text"
          >
            Watch packs
          </Link>
        </div>
      </div>
    </section>
  );
}
