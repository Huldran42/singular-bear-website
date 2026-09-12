import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/canvas3d',
        '/liquidglass-ui',
        '/ghost',
        '/prototype',
        '/insights',
        '/api/insights',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
