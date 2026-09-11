export type InfoItem = {
  label: string;
  detail: string;
};

export type InfoGroup = {
  title: string;
  items: InfoItem[];
};

export type InfoFamily = {
  id: string;
  label: string;
  blurb: string;
  groupTitles: string[];
};

export type ProductInfo = {
  slug: string;
  kicker: string;
  lead: string;
  tagline: string;
  highlights: string[];
  families: InfoFamily[];
  groups: InfoGroup[];
};

export const productInfos: ProductInfo[] = [
  {
    slug: 'pro-glass-shader',
    kicker:
      'Bring your glass to life. From crystal clear diamonds to rainy cyberpunk windows, create AAA glass surfaces in seconds.',
    lead: 'Turn any mesh into a stunning glass surface with the most complete, feature-rich glass shader for URP. Whether you need realistic architectural glazing, stylized magic crystals, or grime-covered dungeon bottles, Pro Glass Shader handles it all with a single, optimized uber-shader.',
    tagline:
      'Realistic and stylized glass has always been frustrating to achieve in real-time… until now.',
    highlights: [
      'Includes a powerful custom Editor with Smart Inspector, Presets, in-Scene tools, and dynamic UI filtering to instantly focus only on active features.',
      'Includes a powerful Preset System to drastically speed up your workflow and maintain visual consistency across your project. 20 Presets already included.',
      'Full comprehensive PDF manual and online interactive guide available from the Manual button.',
    ],
    families: [
      {
        id: 'surface',
        label: 'Surface',
        blurb: 'Rain, dirt, moss and fingerprints — how the glass ages in the world.',
        groupTitles: [
          'Advanced Weathering & Nature',
          'Interactive Surface Imperfections',
        ],
      },
      {
        id: 'optics',
        label: 'Optics',
        blurb: 'Refraction, absorption and light — how the volume actually behaves.',
        groupTitles: [
          'Optical Physics & Refraction',
          'Lighting & Special Effects',
        ],
      },
      {
        id: 'effects',
        label: 'Effects',
        blurb: 'Cracks, lenses and stylized FX for magic, heat and retro looks.',
        groupTitles: ['Distortion & Stylized FX'],
      },
      {
        id: 'studio',
        label: 'Studio',
        blurb: 'Editor tools, presets and performance so the shader stays usable.',
        groupTitles: ['Workflow & Tools', 'Performance & Compatibility'],
      },
    ],
    groups: [
      {
        title: 'Advanced Weathering & Nature',
        items: [
          {
            label: 'Procedural Rain',
            detail: 'Animated rain droplets without needing complex textures.',
          },
          {
            label: 'Dripping Animation',
            detail: 'Realistic trails and gravity-based dripping effects.',
          },
          {
            label: 'Triplanar Rain',
            detail:
              'Rain wraps perfectly around spheres and complex meshes (no UVs needed).',
          },
          {
            label: 'Dynamic Wetness',
            detail: 'Sliders to control surface wetness and smoothness.',
          },
          {
            label: 'Dirt & Grime',
            detail: 'Procedural dirt accumulation.',
          },
          {
            label: 'Moss Growth',
            detail: 'Directional moss (grows from bottom-up or top-down).',
          },
          {
            label: 'Dust Overlay',
            detail: 'Accumulates dust on top-facing surfaces automatically.',
          },
          {
            label: 'Frost & Fog',
            detail: 'Interior fog density for icy/cold looks.',
          },
        ],
      },
      {
        title: 'Interactive Surface Imperfections',
        items: [
          {
            label: 'Fingerprint Placer Tool',
            detail:
              '[Exclusive] Click on your mesh in Scene View to place smudges exactly where you want.',
          },
          {
            label: '4-Layer Smudges',
            detail: 'Mix up to 4 different types of fingerprints or dirt spots.',
          },
          {
            label: 'Local Space Tracking',
            detail: 'Smudges stick to the object even when it moves or rotates.',
          },
          {
            label: 'Micro-Scratches',
            detail: 'Detail normal map support for surface wear.',
          },
          {
            label: 'Procedural Surface Noise',
            detail: 'Adds organic imperfection to the glass smoothness.',
          },
          {
            label: 'Triplanar Detail Maps',
            detail: "Scratches that don't stretch.",
          },
        ],
      },
      {
        title: 'Optical Physics & Refraction',
        items: [
          {
            label: 'Physical Refraction',
            detail: "Snell's Law implementation for realistic bending.",
          },
          {
            label: 'Chromatic Aberration',
            detail: 'RGB splitting / dispersion at edges (prism effect).',
          },
          {
            label: 'Beer-Lambert Absorption',
            detail: 'Accurate volume color (thicker parts are darker).',
          },
          {
            label: 'Variable IOR',
            detail:
              'Control the Index of Refraction (Air, Water, Diamond, etc.).',
          },
          {
            label: 'Frosted Glass Blur',
            detail: 'High-quality blur with 4 adjustable quality levels.',
          },
          {
            label: 'Depth Fade',
            detail: 'Soft intersections with other geometry (no harsh clipping).',
          },
          {
            label: 'Double-Sided Rendering',
            detail: 'Proper handling of back-faces.',
          },
        ],
      },
      {
        title: 'Lighting & Special Effects',
        items: [
          {
            label: 'Total Internal Reflection (TIR)',
            detail: 'Realistic reflection at grazing angles (diamond look).',
          },
          {
            label: 'Iridescence',
            detail: 'Thin-film interference (rainbow / oil slick effect).',
          },
          {
            label: 'Caustics',
            detail: 'Animated light projection patterns (procedural or texture).',
          },
          {
            label: 'Inner Glow',
            detail: 'Sci-fi emissive volume effect.',
          },
          {
            label: 'Rim Lighting',
            detail: 'Highlight edges for better visibility in dark scenes.',
          },
          {
            label: 'Translucency',
            detail: 'Simulated subsurface light scattering.',
          },
          {
            label: 'Edge Darkening',
            detail: 'Simulates the look of thick glass panes.',
          },
          {
            label: 'Sparkles',
            detail: 'View-dependent glitter effect (great for snow / magic).',
          },
        ],
      },
      {
        title: 'Distortion & Stylized FX',
        items: [
          {
            label: 'Procedural Cracks',
            detail: 'Voronoi-based cracking system.',
          },
          {
            label: 'Shatter Effect',
            detail: 'Refraction offset based on crack masks.',
          },
          {
            label: 'Magnify',
            detail: 'Zoom lens effect.',
          },
          {
            label: 'Barrel / Fisheye',
            detail: 'Lens distortion effect.',
          },
          {
            label: 'Shockwave / Ripple',
            detail: 'Animated circular distortion.',
          },
          {
            label: 'Swirl',
            detail: 'Vortex distortion effect.',
          },
          {
            label: 'Heat Haze',
            detail: 'Animated hot air turbulence.',
          },
          {
            label: 'Pixelate',
            detail: 'Retro / mosaic glass effect.',
          },
        ],
      },
      {
        title: 'Workflow & Tools',
        items: [
          {
            label: 'Preset System',
            detail: 'Save / load entire material settings to a file.',
          },
          {
            label: 'Thumbnail Browser',
            detail: 'Visual preset selector included.',
          },
          {
            label: 'Searchable Inspector',
            detail: 'Find any property instantly by typing its name.',
          },
          {
            label: 'Copy / Paste Sections',
            detail: 'Copy just the Rain settings to another material.',
          },
          {
            label: 'Smart Foldouts',
            detail: 'Organized UI that remembers your preferences.',
          },
          {
            label: 'Auto-Keywords',
            detail:
              'Automatically enables / disables shader keywords to save performance.',
          },
        ],
      },
      {
        title: 'Performance & Compatibility',
        items: [
          {
            label: 'Feature Stripping',
            detail: 'Only compiles the code you use (0 cost for unused features).',
          },
          {
            label: 'Mobile Mode',
            detail: '"Fast" quality tier specifically for mobile devices.',
          },
          {
            label: 'VR Ready',
            detail: 'Supports Single Pass Instanced (SPI) rendering.',
          },
          {
            label: 'URP Native',
            detail: 'Built specifically for the Universal Render Pipeline.',
          },
          {
            label: 'Unity 6 Ready',
            detail: 'Tested on the latest Unity versions (and 2021 / 2022 LTS).',
          },
        ],
      },
    ],
  },
];

export function getProductInfo(slug: string) {
  return productInfos.find((info) => info.slug === slug);
}
