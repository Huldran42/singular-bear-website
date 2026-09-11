'use client';

import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname.startsWith('/webplayer');

  if (bare) return children;

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
