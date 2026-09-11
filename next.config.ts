import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/packs',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/packs/meadow',
        destination: '/products/2d-environment-meadow',
        permanent: true,
      },
      {
        source: '/packs/farm',
        destination: '/products/2d-environment-farm',
        permanent: true,
      },
      {
        source: '/packs/dungeon',
        destination: '/products/crawler-dungeon',
        permanent: true,
      },
      {
        source: '/packs/graveyard',
        destination: '/products/crawler-graveyard',
        permanent: true,
      },
      {
        source: '/packs/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/webplayer/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
      {
        source: '/webplayer/:slug/Build/:file.wasm.br',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Content-Encoding', value: 'br' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/webplayer/:slug/Build/:file.js.br',
        headers: [
          { key: 'Content-Type', value: 'application/javascript' },
          { key: 'Content-Encoding', value: 'br' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/webplayer/:slug/Build/:file.data.br',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
          { key: 'Content-Encoding', value: 'br' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/webplayer/:slug/Build/:file.wasm',
        headers: [{ key: 'Content-Type', value: 'application/wasm' }],
      },
    ];
  },
};

export default nextConfig;
