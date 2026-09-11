import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes: MetadataRoute.Sitemap = products.flatMap((product) => [
    {
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: 'monthly',
      priority: product.slug === 'pro-glass-shader' ? 0.9 : 0.75,
    },
    {
      url: `${siteUrl}/documentation/${product.slug}`,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
  ]);

  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: `${siteUrl}/documentation`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { url: `${siteUrl}/packs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/support`, changeFrequency: 'yearly', priority: 0.4 },
    ...productRoutes,
  ];
}
