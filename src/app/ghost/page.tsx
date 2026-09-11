import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ghost',
  robots: { index: false, follow: false },
};

export default function GhostPage() {
  return (
    <main className="flex min-h-[100dvh] items-center bg-studio-bg px-5 text-studio-text sm:px-8">
      <p className="font-heading mx-auto max-w-xl text-center text-3xl font-semibold tracking-[-0.03em] text-studio-muted">
        A quiet page for visual calibration.
      </p>
    </main>
  );
}
