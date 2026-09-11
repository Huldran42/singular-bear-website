export type PackDemo = {
  slug: string;
  productSlug: string;
  title: string;
  subtitle: string;
  image: string;
  gallery: string[];
  videoId?: string;
};

export type PackExperience = PackDemo & {
  category: string;
  description: string;
  features: string[];
  pipelines: string[];
  version: string;
  unityVersion: string;
  releaseDate?: string;
  fileSize?: string;
  price: string | null;
  status?: string;
  storeUrl?: string;
  webglUrl?: string;
};

export const packDemos: PackDemo[] = [
  {
    slug: 'pro-glass-shader',
    productSlug: 'pro-glass-shader',
    title: 'Pro Glass Shader',
    subtitle: 'Material preview',
    image: '/Banner_Glass_06.png',
    gallery: [
      '/Banner_Glass_01.png',
      '/Banner_Glass_02.png',
      '/Banner_Glass_03.png',
      '/Banner_Glass_04.png',
      '/Banner_Glass_05.png',
      '/Banner_Glass_06.png',
    ],
  },
  {
    slug: 'meadow',
    productSlug: '2d-environment-meadow',
    title: 'Meadow',
    subtitle: 'Official video',
    image: '/assets/products/meadow.jpg',
    gallery: ['/assets/products/meadow.jpg'],
    videoId: 'mJsn8157LX0',
  },
  {
    slug: 'farm',
    productSlug: '2d-environment-farm',
    title: 'Farm',
    subtitle: 'Official video',
    image: '/assets/products/farm.jpg',
    gallery: ['/assets/products/farm.jpg'],
    videoId: 'vow3xsMhG8o',
  },
  {
    slug: 'dungeon',
    productSlug: 'crawler-dungeon',
    title: 'Dungeon',
    subtitle: 'Official video',
    image: '/assets/products/dungeon.jpg',
    gallery: ['/assets/products/dungeon.jpg'],
    videoId: 'x-MhE-ZIeXE',
  },
  {
    slug: 'graveyard',
    productSlug: 'crawler-graveyard',
    title: 'Graveyard',
    subtitle: 'Official video',
    image: '/assets/products/graveyard.jpg',
    gallery: ['/assets/products/graveyard.jpg'],
    videoId: 'RN-jU5b_nBg',
  },
];
