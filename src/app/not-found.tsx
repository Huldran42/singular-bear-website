import Link from 'next/link';
import { ArrowLeftIcon as ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-studio-bg text-studio-text">
      <main className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-5 py-32 sm:px-8 lg:px-12">
        <p className="font-mono text-sm text-studio-accent">404</p>
        <h1 className="font-heading mt-4 max-w-[10ch] text-5xl font-semibold leading-[0.96] tracking-[-0.02em] sm:text-7xl">
          This world is not loaded.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-studio-muted">
          The page may have moved, or the asset is still being prepared.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-studio-accent"
        >
          <ArrowLeft /> Back home
        </Link>
      </main>
    </div>
  );
}
