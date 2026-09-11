import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

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
