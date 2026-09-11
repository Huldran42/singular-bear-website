import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const posterExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

export type ProductVideo = {
  src: string;
  poster?: string;
};

function publicUrl(slug: string, filename: string) {
  return `/${slug}/${encodeURIComponent(filename)}`;
}

export const getProductVideos = cache((slug: string): ProductVideo[] => {
  const directory = path.join(process.cwd(), 'public', slug);
  if (!existsSync(directory)) return [];

  const names = readdirSync(directory);
  const lower = new Map(names.map((name) => [name.toLowerCase(), name]));

  return names
    .filter((name) => videoExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => {
      const base = name.slice(0, -path.extname(name).length);
      const poster = posterExtensions
        .map((ext) => lower.get(`${base.toLowerCase()}${ext}`))
        .find(Boolean);

      return {
        src: publicUrl(slug, name),
        poster: poster ? publicUrl(slug, poster) : undefined,
      };
    });
});
