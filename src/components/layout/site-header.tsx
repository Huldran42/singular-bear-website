'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { cn } from '@/lib/utils';
import { primaryNav } from '@/lib/nav';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sb-header fixed inset-x-0 top-0 z-50 border-b border-studio-line">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 text-studio-text"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/SB_Logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full"
            priority
          />
          <span className="text-sm font-semibold tracking-tight">
            Singular Bear
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active
                    ? 'text-studio-text'
                    : 'text-studio-muted hover:text-studio-text',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-studio-line text-studio-text md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon size={18} /> : <ListIcon size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-studio-line bg-studio-bg px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-studio-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
