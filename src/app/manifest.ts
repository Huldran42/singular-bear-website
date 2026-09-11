import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Singular Bear Studio',
    short_name: 'Singular Bear',
    description: 'Unity shaders and hand-painted 2D environments.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1011',
    theme_color: '#0b1011',
    icons: [{ src: '/SB_Logo.png', sizes: '256x256', type: 'image/png' }],
  };
}
