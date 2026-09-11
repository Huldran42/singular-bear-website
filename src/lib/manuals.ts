import type { Product } from './products';

export type ManualBlock = {
  id: string;
  title: string;
  intro: string;
  steps?: string[];
  notes?: string[];
};

export type Manual = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: ManualBlock[];
};

const sharedEnvironmentSections = (product: Product): ManualBlock[] => [
  {
    id: 'installation',
    title: 'Installation',
    intro: `Import ${product.title} from the Unity Package Manager or your Asset Store downloads. Let Unity finish processing the package before opening a sample scene.`,
    steps: [
      'Open the package in My Assets and choose Download.',
      'Select Import and keep the recommended package contents enabled.',
      'Wait for shaders and textures to finish importing.',
      'Locate the included sample content in the Project browser.',
    ],
  },
  {
    id: 'pipeline',
    title: 'Render pipeline setup',
    intro: `${product.title} supports ${product.pipelines.join(' and ')}. Use the pipeline already configured for your project and avoid converting materials twice.`,
    notes: [
      `Recommended Unity version: ${product.unityVersion}.`,
      'Back up or commit your project before any project-wide material conversion.',
      'If a material appears pink, confirm the active render pipeline and reimport its shader dependencies.',
    ],
  },
  {
    id: 'building-scenes',
    title: 'Building a scene',
    intro:
      'Start from large terrain shapes, establish the walkable path, then add buildings, vegetation and small props. This keeps the level readable at gameplay scale.',
    steps: [
      'Block the playable area with the largest modular pieces.',
      'Use paths and edges to guide the player through the scene.',
      'Place major landmarks before decorative props.',
      'Finish with small vegetation, debris and overlap pieces.',
    ],
  },
  {
    id: 'sorting',
    title: 'Layering and sorting',
    intro:
      'Keep ground, structures, props and foreground elements on separate sorting layers. Test character overlap early, especially around tall scenery.',
    notes: [
      'Keep the player between ground art and foreground occluders.',
      'Use consistent pivot placement for repeatable sorting behavior.',
      'Check the final scene with the same camera angle used in gameplay.',
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    intro:
      'Most import issues come from a render pipeline mismatch, incomplete import or project-specific sorting settings.',
    notes: [
      'Pink materials: verify the active pipeline and material shader assignment.',
      'Blurred sprites: inspect texture filtering and compression for your target platform.',
      'Incorrect overlap: review sorting layers, order values and sprite pivots.',
      'Missing references: reimport the package after Unity finishes compiling scripts.',
    ],
  },
];

export function createManual(product: Product): Manual {
  if (product.slug === 'pro-glass-shader') {
    return {
      slug: product.slug,
      title: 'Pro Glass Shader manual',
      description:
        'Setup, optical controls, weathering layers and practical checks for Pro Glass Shader in Unity URP.',
      updated: 'Preview documentation',
      sections: [
        {
          id: 'requirements',
          title: 'Before you begin',
          intro:
            'Pro Glass Shader is designed for projects using the Universal Render Pipeline. Confirm that URP is active before creating your first material.',
          notes: [
            'Use a URP project or a project already converted to URP.',
            'Test transparency against the lighting and post-processing used by your game.',
            'Create material variants before making broad changes across a scene.',
          ],
        },
        {
          id: 'quick-start',
          title: 'Quick start',
          intro:
            'Create a material, assign the Pro Glass shader and begin with the core optical response before adding decorative layers.',
          steps: [
            'Import the package and allow Unity to compile the shader.',
            'Create a new material and select the Pro Glass shader.',
            'Set the base tint, transparency and surface response.',
            'Assign the material to a mesh with clean normals.',
            'Add one detail layer at a time and test from the gameplay camera.',
          ],
        },
        {
          id: 'thin-film',
          title: 'Thin-film iridescence',
          intro:
            'Use thin-film controls to create oil, bubble and coated-glass color shifts. Keep the effect restrained for realistic glass and stronger for stylized materials.',
          notes: [
            'Tune the effect under the lighting used in the final scene.',
            'Check glancing angles, where iridescence is usually most visible.',
            'Balance saturation against the base tint to preserve transparency.',
          ],
        },
        {
          id: 'surface-direction',
          title: 'Surface direction',
          intro:
            'Triplanar normals and color controls help the shader follow world-space surfaces without obvious UV seams.',
          steps: [
            'Choose a normal texture suited to the material scale.',
            'Adjust triplanar scale before increasing normal strength.',
            'Inspect corners and curved surfaces for projection artifacts.',
            'Use the color layer to align the glass with the scene palette.',
          ],
        },
        {
          id: 'weathering',
          title: 'Procedural weathering',
          intro:
            'Layer moss, dirt and aging after the base glass reads correctly. Weathering should explain where the object has been and how it is used.',
          notes: [
            'Keep accumulation connected to believable exposed or sheltered areas.',
            'Use broad masks first, then introduce smaller variation.',
            'Check the silhouette so opaque detail does not flatten the glass.',
          ],
        },
        {
          id: 'imperfections',
          title: 'Imperfections and decals',
          intro:
            'Fingerprints, dust, scratches and decals break uniform reflections and help the surface sit naturally in the scene.',
          steps: [
            'Choose one dominant imperfection type for the first pass.',
            'Set its scale from the final camera distance.',
            'Add decals only where they support the object story.',
            'Reduce intensity if the glass stops reading as transparent.',
          ],
        },
        {
          id: 'fantasy-effects',
          title: 'Fantasy effects',
          intro:
            'Sparkles, glitter and distortion can push the same material toward magical glass. Add them last so each effect remains easy to judge.',
          notes: [
            'Use motion only when it supports the object or gameplay state.',
            'Test distortion against busy and quiet backgrounds.',
            'Reduce simultaneous effects for mobile or fill-rate-sensitive scenes.',
          ],
        },
        {
          id: 'troubleshooting',
          title: 'Troubleshooting',
          intro:
            'Start by isolating the base glass. Re-enable detail layers one at a time until the issue returns.',
          notes: [
            'Pink material: confirm URP is active and the shader compiled without errors.',
            'Sorting artifacts: review transparent queue order and intersecting geometry.',
            'Flat reflections: check environment lighting and reflection probes.',
            'Noisy surface: lower overlapping detail strengths and inspect texture scale.',
          ],
        },
      ],
    };
  }

  return {
    slug: product.slug,
    title: `${product.title} manual`,
    description: `Installation, compatibility and scene-building guide for ${product.title}.`,
    updated: `For version ${product.version}`,
    sections: sharedEnvironmentSections(product),
  };
}
