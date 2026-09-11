import type { Metadata } from 'next';
import { Hero } from '@/features/home/components/hero';
import { HomeContent } from '@/features/home/components/home-content';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default function HomePage() {
  return (
    <main className="bg-studio-bg">
      <Hero />
      <HomeContent />
    </main>
  );
}
