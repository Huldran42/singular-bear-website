import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

export const WEBGL_MANIFEST_ID = 'virtual:webgl-manifest';
const RESOLVED_ID = `\0${WEBGL_MANIFEST_ID}`;
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

function buildManifest(root: string): Record<string, string> {
  const publicDir = path.join(root, 'public');
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
}

/**
 * Cloudflare Workers (and vinext dev, which runs SSR/RSC code inside the same
 * workerd sandbox) has no access to the real filesystem at request time — the
 * sandbox cwd is a virtual `/bundle`, not the project directory. Scanning
 * `public/webplayer` for Unity WebGL builds therefore has to happen here, in
 * the real Node process that runs Vite, and get baked into the bundle as a
 * plain object instead of relying on `fs` calls at runtime.
 *
 * This file must stay out of `src/` and must never be imported by app code:
 * it imports the `vite` package for types, and pulling that into the app's
 * module graph confuses the RSC/SSR dependency optimizer.
 */
export function webglManifestPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: 'webgl-manifest',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === WEBGL_MANIFEST_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      return `export const webglManifest = ${JSON.stringify(buildManifest(root))};\n`;
    },
  };
}
