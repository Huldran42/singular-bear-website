import type { Metadata } from 'next';
import { SupportContent } from '@/features/support/support-content';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Contact Singular Bear Studio for Unity asset support.',
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <SupportContent />
    </main>
  );
}
