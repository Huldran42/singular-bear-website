export type Pipeline = 'Built-in' | 'URP' | 'HDRP';

export type Product = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  price: string | null;
  status?: string;
  image: string;
  gallery: string[];
  videoId?: string;
  storeUrl?: string;
  version: string;
  unityVersion: string;
  releaseDate?: string;
  pipelines: Pipeline[];
  fileSize?: string;
  features: string[];
  seoDescription: string;
};

export const products: Product[] = [
  {
    slug: 'pro-glass-shader',
    title: 'Pro Glass Shader',
    category: 'Unity shader',
    summary: 'Physically based glass with art-directable surface detail.',
    description:
      'Build clean, weathered, iridescent or magical glass inside URP. Every layer is designed to stay readable while you art-direct the final surface.',
    price: null,
    status: 'Coming soon',
    image: '/Banner_Glass_06.png',
    gallery: [
      '/Banner_Glass_01.png',
      '/Banner_Glass_02.png',
      '/Banner_Glass_03.png',
      '/Banner_Glass_04.png',
      '/Banner_Glass_05.png',
      '/Banner_Glass_06.png',
    ],
    version: 'Preview',
    unityVersion: 'Unity URP',
    pipelines: ['URP'],
    features: [
      'Physically based transparent glass',
      'Thin-film iridescence',
      'Triplanar normal mapping',
      'Moss, dirt and procedural aging',
      'Fingerprints, dust, scratches and decals',
      'Sparkles, glitter and distortion',
    ],
    seoDescription:
      'Explore Pro Glass Shader for Unity URP with thin-film iridescence, procedural weathering, decals and art-directable glass effects.',
  },
  {
    slug: '2d-environment-meadow',
    title: '2D Environment - Meadow',
    category: 'Hand-painted environment',
    summary: 'A bright, modular meadow world for top-down adventures.',
    description:
      'Build readable outdoor levels with hand-painted trees, paths, cliffs, vegetation and props designed to share one cohesive visual language.',
    price: '$29.99',
    image: '/assets/products/meadow.jpg',
    gallery: ['/assets/products/meadow.jpg'],
    videoId: 'mJsn8157LX0',
    storeUrl:
      'https://assetstore.unity.com/packages/2d/environments/2d-environment-meadow-287743',
    version: '2.0',
    unityVersion: '2022.3.33 or newer',
    releaseDate: 'November 4, 2024',
    pipelines: ['URP'],
    fileSize: '11.1 MB',
    features: [
      'Hand-painted top-down environment',
      'Modular terrain and cliff pieces',
      'Trees, foliage and natural props',
      'A cohesive RPG-ready art direction',
    ],
    seoDescription:
      'Discover 2D Environment - Meadow, a hand-painted modular Unity URP environment for top-down RPG and adventure games.',
  },
  {
    slug: '2d-environment-farm',
    title: '2D Environment - Farm',
    category: 'Hand-painted environment',
    summary: 'Farm buildings and props drawn for inviting RPG spaces.',
    description:
      'Create warm rural scenes with a consistent set of farm buildings, paths and practical props for top-down 2D games.',
    price: '$24.99',
    image: '/assets/products/farm.jpg',
    gallery: ['/assets/products/farm.jpg'],
    videoId: 'vow3xsMhG8o',
    storeUrl:
      'https://assetstore.unity.com/packages/2d/environments/2d-environment-farm-289020',
    version: '1.0',
    unityVersion: '2022.3.33 or newer',
    releaseDate: 'July 17, 2024',
    pipelines: ['URP'],
    fileSize: '7.1 MB',
    features: [
      'Hand-painted farm buildings',
      'Modular outdoor layouts',
      'Rural props and set dressing',
      'Top-down RPG presentation',
    ],
    seoDescription:
      'Discover 2D Environment - Farm, a hand-painted Unity URP asset pack with buildings and props for top-down RPG scenes.',
  },
  {
    slug: 'crawler-dungeon',
    title: 'Crawler - Dungeon',
    category: 'Dark fantasy environment',
    summary: 'A modular dungeon set with a brooding hand-painted finish.',
    description:
      'Shape dark fantasy corridors, rooms and ruins with modular environment art built for top-down dungeon crawlers.',
    price: '$9.99',
    image: '/assets/products/dungeon.jpg',
    gallery: ['/assets/products/dungeon.jpg'],
    videoId: 'x-MhE-ZIeXE',
    storeUrl:
      'https://assetstore.unity.com/packages/2d/environments/crawler-dungeon-288761',
    version: '1.0',
    unityVersion: '2022.3.33 or newer',
    releaseDate: 'July 9, 2024',
    pipelines: ['Built-in', 'URP'],
    fileSize: '11.4 MB',
    features: [
      'Modular dungeon architecture',
      'Dark fantasy props and debris',
      'Built-in and URP compatibility',
      'Top-down crawler composition',
    ],
    seoDescription:
      'Explore Crawler - Dungeon, a modular hand-painted Unity environment for dark fantasy top-down and dungeon crawler games.',
  },
  {
    slug: 'crawler-graveyard',
    title: 'Crawler - Graveyard',
    category: 'Dark fantasy environment',
    summary: 'A moody graveyard kit for gothic top-down worlds.',
    description:
      'Compose atmospheric cemetery scenes from hand-painted tombs, foliage, paths and set dressing made for dark fantasy games.',
    price: '$24.99',
    image: '/assets/products/graveyard.jpg',
    gallery: ['/assets/products/graveyard.jpg'],
    videoId: 'RN-jU5b_nBg',
    storeUrl:
      'https://assetstore.unity.com/packages/2d/environments/crawler-graveyard-288789',
    version: '1.0',
    unityVersion: '2022.3.33 or newer',
    releaseDate: 'July 9, 2024',
    pipelines: ['Built-in', 'URP'],
    fileSize: '12.6 MB',
    features: [
      'Modular cemetery pieces',
      'Hand-painted gothic props',
      'Built-in and URP compatibility',
      'Layered dark fantasy atmosphere',
    ],
    seoDescription:
      'Explore Crawler - Graveyard, a modular hand-painted Unity environment for gothic top-down RPG and crawler games.',
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const releasedProducts = products.filter((product) => product.storeUrl);
