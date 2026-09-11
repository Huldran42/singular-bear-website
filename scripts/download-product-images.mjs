import { createWriteStream, mkdirSync, statSync } from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const dir = path.join('public', 'assets', 'products');
mkdirSync(dir, { recursive: true });

const jobs = [
  [
    'https://img.youtube.com/vi/mJsn8157LX0/maxresdefault.jpg',
    path.join(dir, 'meadow.jpg'),
  ],
  [
    'https://assetstorev1-prd-cdn.unity3d.com/key-image/acd8e9e0-148a-41f8-ae3e-9e94a8f06608.jpg',
    path.join(dir, 'farm.jpg'),
  ],
  [
    'https://assetstorev1-prd-cdn.unity3d.com/key-image/43b24129-cda0-42b4-a392-5dd28a5346b8.jpg',
    path.join(dir, 'dungeon.jpg'),
  ],
  [
    'https://assetstorev1-prd-cdn.unity3d.com/key-image/22a05863-db5d-4bb2-a7d9-5a8f5b5f3676.jpg',
    path.join(dir, 'graveyard.jpg'),
  ],
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const go = (current) => {
      https
        .get(
          current,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              Accept: 'image/*',
            },
          },
          (response) => {
            const location = response.headers.location;
            if (
              response.statusCode &&
              response.statusCode >= 300 &&
              response.statusCode < 400 &&
              location
            ) {
              response.resume();
              const next = location.startsWith('http')
                ? location
                : new URL(location, current).href;
              go(next);
              return;
            }

            if (response.statusCode !== 200) {
              response.resume();
              reject(new Error(`${response.statusCode} ${current}`));
              return;
            }

            const file = createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => {
              file.close(() => {
                resolve({ dest, bytes: statSync(dest).size });
              });
            });
          },
        )
        .on('error', reject);
    };

    go(url);
  });
}

for (const [url, dest] of jobs) {
  const result = await download(url, dest);
  console.log('OK', result.dest, result.bytes);
}
