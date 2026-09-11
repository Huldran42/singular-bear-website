import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { getProduct, products } from '@/lib/products';
import { packDemos } from '@/webplayer/config';

const ignoredDirectories = new Set(['Build', 'TemplateData']);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findEntryFiles(directory: string, depth = 0): string[] {
  if (!existsSync(directory) || depth > 2) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      return [entryPath];
    }

    if (
      entry.isDirectory() &&
      !ignoredDirectories.has(entry.name) &&
      !entry.name.startsWith('.')
    ) {
      return findEntryFiles(entryPath, depth + 1);
    }

    return [];
  });
}

export const getWebglManifest = cache((): Record<string, string> => {
  const publicDir = path.join(process.cwd(), 'public');
  const webplayerRoot = path.join(publicDir, 'webplayer');
  const manifest: Record<string, string> = {};

  for (const filePath of findEntryFiles(webplayerRoot)) {
    const folderName = path.basename(path.dirname(filePath));
    const publicRelativePath = path
      .relative(publicDir, filePath)
      .split(path.sep)
      .map(encodeURIComponent)
      .join('/');

    manifest[normalize(folderName)] = `/${publicRelativePath}`;
  }

  return manifest;
});

export function getWebglUrl(...slugs: Array<string | undefined>) {
  const manifest = getWebglManifest();

  for (const slug of slugs) {
    if (!slug) continue;
    const match = manifest[normalize(slug)];
    if (match) return match;
  }

  return undefined;
}

export type LiveDemo = {
  slug: string;
  title: string;
  image: string;
  category: string;
  summary: string;
};

export function getLiveDemos(): LiveDemo[] {
  const seen = new Set<string>();
  const demos: LiveDemo[] = [];

  for (const pack of packDemos) {
    const url = getWebglUrl(pack.slug, pack.productSlug);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const product = getProduct(pack.productSlug);
    demos.push({
      slug: pack.slug,
      title: pack.title,
      image: pack.image,
      category: product?.category ?? 'Live demo',
      summary: product?.summary ?? pack.subtitle,
    });
  }

  for (const product of products) {
    const url = getWebglUrl(product.slug);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    demos.push({
      slug: product.slug,
      title: product.title,
      image: product.image,
      category: product.category,
      summary: product.summary,
    });
  }

  return demos;
}
