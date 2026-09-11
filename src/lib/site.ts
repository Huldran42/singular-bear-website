function trimSlash(value: string) {
  return value.replace(/\/$/, '');
}

function withHttps(host: string) {
  return host.startsWith('http://') || host.startsWith('https://')
    ? host
    : `https://${host}`;
}

export function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return trimSlash(withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL));
  }

  if (process.env.VERCEL_URL) {
    return trimSlash(withHttps(process.env.VERCEL_URL));
  }

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'singularbear.studio@gmail.com';

export const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_URL?.trim() ?? '';

export const assetStorePublisherUrl =
  process.env.NEXT_PUBLIC_ASSET_STORE_URL ??
  'https://assetstore.unity.com/publishers/102041';

export const artstationUrl =
  process.env.NEXT_PUBLIC_ARTSTATION_URL ??
  'https://www.artstation.com/singularbearstudio1/profile';

export const studioName = 'Singular Bear Studio';
