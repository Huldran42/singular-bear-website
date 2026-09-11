'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { LiquidGlassField } from '@/features/home/components/liquid-glass-field';

export function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-studio-bg text-studio-text">
      <LiquidGlassField />

      <div className="pointer-events-none relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-sm text-studio-accent">
              <span className="sb-pulse-dot h-1.5 w-1.5 rounded-full bg-studio-accent" />
              Independent Unity studio
            </p>
            <h1 className="font-heading mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem]">
              Materials
              <br />
              with a{' '}
              <em className="font-heading italic text-studio-accent">pulse.</em>
            </h1>
            <div className="mt-6 max-w-md space-y-3 text-lg leading-relaxed text-studio-muted text-pretty sm:text-xl">
              <p>Production-ready Unity shaders and stylized assets.</p>
              <p>
                The same attention to motion, shading and feel carries into
                every Singular Bear product.
              </p>
            </div>
            <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="sb-btn sb-btn-primary">
                Try live Demo
              </Link>
              <Link href="/products" className="sb-btn sb-btn-outline">
                Explore the possibilities <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <p className="font-mono text-xs tracking-[0.22em] text-studio-subtle uppercase lg:pb-2 lg:text-right">
            URP
            <span className="mx-3 text-studio-accent">·</span>
            Manuals
            <span className="mx-3 text-studio-accent">·</span>
            Asset Store
          </p>
        </div>
      </div>
    </section>
  );
}
