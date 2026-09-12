import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { SiteChrome } from '@/components/layout/site-chrome';
import { InsightsTracker } from '@/features/insights/tracker';
import {
  artstationUrl,
  assetStorePublisherUrl,
  contactEmail,
  siteUrl,
  studioName,
} from '@/lib/site';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: studioName,
  title: {
    default: 'Singular Bear Studio | Unity shaders and 2D worlds',
    template: '%s | Singular Bear Studio',
  },
  description:
    'Production-ready Unity shaders and hand-painted 2D environments by Singular Bear Studio.',
  keywords: [
    'Unity shaders',
    'Unity Asset Store',
    'URP shader',
    '2D environment assets',
    'game development assets',
    'Singular Bear Studio',
  ],
  authors: [{ name: 'Singular Bear Studio' }],
  creator: 'Singular Bear Studio',
  publisher: 'Singular Bear Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Singular Bear Studio',
    title: 'Singular Bear Studio | Unity shaders and 2D worlds',
    description:
      'Production-ready Unity shaders and hand-painted 2D environments by Singular Bear Studio.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Singular Bear Studio, materials with a pulse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singular Bear Studio | Unity shaders and 2D worlds',
    description:
      'Production-ready Unity shaders and hand-painted 2D environments by Singular Bear Studio.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/SB_Logo.png', apple: '/SB_Logo.png' },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: studioName,
    url: siteUrl,
    logo: `${siteUrl}/SB_Logo.png`,
    email: contactEmail,
    sameAs: [assetStorePublisherUrl, artstationUrl],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('sb-theme');const d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}",
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
        <InsightsTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
