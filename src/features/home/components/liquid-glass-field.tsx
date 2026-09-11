'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js';

type Blob = {
  x: number;
  y: number;
  z: number;
  r: number;
  ox: number;
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  ax: number;
  ay: number;
  az: number;
  wx: number;
  wy: number;
  wz: number;
};

const BLOB_SLOTS = 12;

const VERT = `
varying vec2 vNdc;
void main() {
  vNdc = position.xy;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vNdc;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform float uTanFov;
uniform vec4 uBlobs[12];
uniform float uBlend;
uniform samplerCube uEnv;
uniform vec3 uSH[9];

const float EPS = 8e-4;
const int ITR = 96;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float d = 1e5;
  for (int i = 0; i < 12; i++) {
    float r = uBlobs[i].w;
    if (r < 0.001) continue;
    d = smin(d, length(p - uBlobs[i].xyz) - r, uBlend);
  }
  return d;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(1.0, -1.0) * 5.5e-4;
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

vec3 shIrradiance(vec3 n) {
  float x = n.x;
  float y = n.y;
  float z = n.z;
  vec3 result = uSH[0] * 0.886227;
  result += uSH[1] * 1.023328 * y;
  result += uSH[2] * 1.023328 * z;
  result += uSH[3] * 1.023328 * x;
  result += uSH[4] * 0.858086 * x * y;
  result += uSH[5] * 0.858086 * y * z;
  result += uSH[6] * (0.743125 * z * z - 0.247708);
  result += uSH[7] * 0.858086 * x * z;
  result += uSH[8] * 0.429043 * (x * x - y * y);
  return result;
}

vec3 envSample(vec3 dir) {
  vec3 spec = textureCube(uEnv, dir, 1.6).rgb;
  float luma = dot(spec, vec3(0.299, 0.587, 0.114));
  return mix(spec, vec3(luma), 0.28);
}

vec3 envMap(vec3 R, vec3 N, vec3 V, float fres) {
  vec3 T = cross(N, V);
  float tlen = length(T);
  T = tlen > 0.001 ? T / tlen : vec3(1.0, 0.0, 0.0);
  vec3 B = normalize(cross(T, N));
  float ca = 0.05 + fres * 0.16;
  vec3 spec = vec3(
    envSample(normalize(R + T * ca + N * ca * 0.22)).r,
    envSample(normalize(R + B * ca * 0.4)).g,
    envSample(normalize(R - T * ca - N * ca * 0.18)).b
  );
  vec3 silver = vec3(0.46, 0.49, 0.52);
  vec3 diff = shIrradiance(N);
  return mix(silver, spec, 0.36) + diff * 0.06;
}

vec3 rimColor(vec3 N, float fres) {
  vec3 cyan = vec3(0.28, 0.88, 1.0);
  vec3 magenta = vec3(0.95, 0.28, 0.82);
  vec3 orange = vec3(1.0, 0.52, 0.2);
  vec3 blue = vec3(0.32, 0.42, 1.0);
  vec3 rim = mix(cyan, magenta, smoothstep(-0.45, 0.55, N.x));
  rim = mix(rim, orange, smoothstep(-0.15, 0.75, N.y) * 0.5);
  rim = mix(rim, blue, clamp(0.35 - N.y, 0.0, 1.0) * 0.4);
  return rim * pow(fres, 1.05);
}

vec3 iridescence(vec3 N, float ndv, float fres) {
  float t = clamp(ndv * 1.35 + N.x * 0.4 + N.y * 0.28, 0.0, 1.0);
  vec3 cyan = vec3(0.3, 0.9, 1.0);
  vec3 magenta = vec3(0.9, 0.28, 0.95);
  vec3 orange = vec3(1.0, 0.58, 0.22);
  vec3 film = mix(cyan, magenta, smoothstep(0.0, 0.55, t));
  film = mix(film, orange, smoothstep(0.4, 1.0, t));
  return film * (0.08 + fres * 0.28);
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec3 rd = normalize(
    uCamFwd +
    vNdc.x * uCamRight * uTanFov * aspect +
    vNdc.y * uCamUp * uTanFov
  );
  vec3 ro = uCamPos;

  float t = 0.0;
  float dist = 1e5;
  vec3 p = ro;
  for (int i = 0; i < ITR; i++) {
    p = ro + rd * t;
    dist = map(p);
    t += dist;
    if (dist < EPS || t > 8.0) break;
  }

  if (dist >= EPS) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 N = calcNormal(p);
  vec3 V = normalize(-rd);
  vec3 R = reflect(rd, N);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 2.6);
  float F = mix(0.42, 0.7, fres);

  vec3 col = envMap(R, N, V, fres) * F;
  col += rimColor(N, fres) * 0.8;
  col += iridescence(N, ndv, fres);
  vec3 L = normalize(vec3(0.48, 0.88, 0.52));
  vec3 H = normalize(L + V);
  col += vec3(0.95, 0.97, 1.0) * pow(max(dot(N, H), 0.0), 200.0) * 0.7;
  col += vec3(0.75, 0.84, 0.9) * pow(max(dot(N, L), 0.0), 14.0) * 0.05;

  float sheen = pow(1.0 - ndv, 3.1);
  vec3 sheenCol = mix(vec3(0.82, 0.9, 0.96), rimColor(N, 1.0), 0.28);
  col += sheenCol * sheen * 0.16;
  col += sheenCol * pow(max(dot(N, H), 0.0), 9.0) * sheen * 0.1;

  float ao = clamp(map(p + N * 0.045) / 0.045, 0.7, 1.0);
  col *= ao;

  gl_FragColor = vec4(col, 0.94);
}
`;

export function LiquidGlassField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const surface = canvas;

    const renderer = new THREE.WebGLRenderer({
      canvas: surface,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const viewCam = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    viewCam.position.set(0.18, 0.06, 2.9);
    viewCam.lookAt(0.24, 0.02, 0);

    const blobUniforms = Array.from(
      { length: BLOB_SLOTS },
      () => new THREE.Vector4(),
    );
    const shUniforms = Array.from({ length: 9 }, () => new THREE.Vector3());
    const cubeTarget = new THREE.WebGLCubeRenderTarget(256, {
      type: THREE.HalfFloatType,
      colorSpace: THREE.LinearSRGBColorSpace,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.15, 40, cubeTarget);
    cubeCamera.position.set(0.7, 0.04, 0);
    cubeTarget.texture.mapping = THREE.CubeReflectionMapping;

    const probeStudio = createOffCameraStudio();
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uCamPos: { value: new THREE.Vector3() },
      uCamRight: { value: new THREE.Vector3() },
      uCamUp: { value: new THREE.Vector3() },
      uCamFwd: { value: new THREE.Vector3() },
      uTanFov: { value: 1 },
      uBlobs: { value: blobUniforms },
      uBlend: { value: 0.3 },
      uEnv: { value: cubeTarget.texture },
      uSH: { value: shUniforms },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const blobs: Blob[] = [
      {
        x: 0.7, y: 0.04, z: 0.02, r: 0.216,
        ox: 0.7, oy: 0.04, oz: 0.02, vx: 0, vy: 0, vz: 0,
        phase: 0.2, ax: 0.14, ay: 0.16, az: 0.11, wx: 0.48, wy: 0.33, wz: 0.4,
      },
      {
        x: 0.56, y: -0.16, z: 0.06, r: 0.153,
        ox: 0.56, oy: -0.16, oz: 0.06, vx: 0, vy: 0, vz: 0,
        phase: 1.4, ax: 0.17, ay: 0.18, az: 0.12, wx: 0.39, wy: 0.54, wz: 0.28,
      },
      {
        x: 0.82, y: 0.2, z: -0.07, r: 0.14,
        ox: 0.82, oy: 0.2, oz: -0.07, vx: 0, vy: 0, vz: 0,
        phase: 2.0, ax: 0.15, ay: 0.13, az: 0.13, wx: 0.6, wy: 0.36, wz: 0.5,
      },
      {
        x: 0.62, y: 0.18, z: 0.11, r: 0.117,
        ox: 0.62, oy: 0.18, oz: 0.11, vx: 0, vy: 0, vz: 0,
        phase: 0.7, ax: 0.16, ay: 0.12, az: 0.14, wx: 0.32, wy: 0.57, wz: 0.43,
      },
      {
        x: 0.74, y: -0.02, z: -0.1, r: 0.108,
        ox: 0.74, oy: -0.02, oz: -0.1, vx: 0, vy: 0, vz: 0,
        phase: 2.6, ax: 0.14, ay: 0.15, az: 0.1, wx: 0.44, wy: 0.41, wz: 0.52,
      },
    ];

    let grabbed = -1;
    let frame = 0;
    const start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane();
    const hit = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const worldBall = new THREE.Vector3();

    function syncCamera() {
      viewCam.updateMatrixWorld();
      const e = viewCam.matrixWorld.elements;
      uniforms.uCamPos.value.copy(viewCam.position);
      uniforms.uCamRight.value.set(e[0], e[1], e[2]);
      uniforms.uCamUp.value.set(e[4], e[5], e[6]);
      uniforms.uCamFwd.value.set(-e[8], -e[9], -e[10]).normalize();
      uniforms.uTanFov.value = Math.tan(
        THREE.MathUtils.degToRad(viewCam.fov * 0.5),
      );
    }

    function pointerNdc(event: PointerEvent) {
      const rect = surface.getBoundingClientRect();
      ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    }

    function hitIndex(event: PointerEvent) {
      pointerNdc(event);
      let best = -1;
      let bestDist = 0.2;
      blobs.forEach((blob, index) => {
        worldBall.set(blob.x, blob.y, blob.z).project(viewCam);
        const d = Math.hypot(worldBall.x - ndc.x, worldBall.y - ndc.y);
        if (d < bestDist) {
          best = index;
          bestDist = d;
        }
      });
      return best;
    }

    function onDown(event: PointerEvent) {
      const index = hitIndex(event);
      if (index < 0) return;
      event.preventDefault();
      grabbed = index;
      blobs[index].vx = 0;
      blobs[index].vy = 0;
      blobs[index].vz = 0;
      surface.setPointerCapture(event.pointerId);
      surface.style.cursor = 'grabbing';
    }

    function onMove(event: PointerEvent) {
      if (grabbed < 0) return;
      pointerNdc(event);
      const blob = blobs[grabbed];
      worldBall.set(blob.x, blob.y, blob.z);
      viewCam.getWorldDirection(camDir);
      plane.setFromNormalAndCoplanarPoint(camDir, worldBall);
      raycaster.setFromCamera(ndc, viewCam);
      if (!raycaster.ray.intersectPlane(plane, hit)) return;
      blob.x = THREE.MathUtils.clamp(hit.x, -0.15, 1.05);
      blob.y = THREE.MathUtils.clamp(hit.y, -0.7, 0.7);
      blob.z = THREE.MathUtils.clamp(hit.z, -0.45, 0.45);
    }

    function onUp(event: PointerEvent) {
      if (grabbed < 0) return;
      blobs[grabbed].vx *= 0.75;
      blobs[grabbed].vy *= 0.75;
      blobs[grabbed].vz *= 0.75;
      grabbed = -1;
      surface.releasePointerCapture(event.pointerId);
      surface.style.cursor = 'grab';
    }

    function bakeProbe() {
      cubeCamera.update(renderer, probeStudio.scene);
      void LightProbeGenerator.fromCubeRenderTarget(renderer, cubeTarget).then(
        (probe) => {
          probe.sh.coefficients.forEach((coeff, index) => {
            shUniforms[index]?.copy(coeff);
          });
        },
      );
    }

    function resize() {
      const w = surface.clientWidth;
      const h = surface.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
      viewCam.aspect = Math.max(w / Math.max(h, 1), 0.5);
      viewCam.updateProjectionMatrix();
      syncCamera();
    }

    function writeBlobs() {
      blobUniforms.forEach((slot) => slot.set(0, 0, 0, 0));
      blobs.forEach((blob, index) => {
        blobUniforms[index]?.set(blob.x, blob.y, blob.z, blob.r);
      });

      if (grabbed >= 0 && grabbed !== 0) {
        const origin = blobs[0];
        const pulled = blobs[grabbed];
        const count = 1;
        for (let i = 1; i <= count; i += 1) {
          const t = i / (count + 1);
          const slot = blobUniforms[blobs.length + i - 1];
          if (!slot) continue;
          const radius = THREE.MathUtils.lerp(origin.r, pulled.r, t) * 0.09;
          slot.set(
            THREE.MathUtils.lerp(origin.x, pulled.x, t),
            THREE.MathUtils.lerp(origin.y, pulled.y, t),
            THREE.MathUtils.lerp(origin.z, pulled.z, t),
            radius,
          );
        }
      }

      uniforms.uBlend.value = 0.3;
    }

    function tick(now: number) {
      const t = (now - start) / 1000;
      const center = blobs[0];
      const held = grabbed >= 0 ? blobs[grabbed] : null;

      blobs.forEach((blob, index) => {
        const homeX = blob.ox + Math.cos(t * blob.wx + blob.phase) * blob.ax;
        const homeY = blob.oy + Math.sin(t * blob.wy + blob.phase) * blob.ay;
        const homeZ = blob.oz + Math.cos(t * blob.wz + blob.phase * 1.2) * blob.az;
        if (index === grabbed) return;

        if (reduced.matches) {
          blob.x += (blob.ox - blob.x) * 0.1;
          blob.y += (blob.oy - blob.y) * 0.1;
          blob.z += (blob.oz - blob.z) * 0.1;
          return;
        }

        blob.vx += (homeX - blob.x) * 0.024;
        blob.vy += (homeY - blob.y) * 0.024;
        blob.vz += (homeZ - blob.z) * 0.024;
        if (index === 0 && held && grabbed !== 0) {
          blob.vx += (held.x - blob.x) * 0.00225;
          blob.vy += (held.y - blob.y) * 0.00225;
          blob.vz += (held.z - blob.z) * 0.00225;
        } else if (index !== 0) {
          blob.vx += (center.x - blob.x) * 0.004;
          blob.vy += (center.y - blob.y) * 0.004;
          blob.vz += (center.z - blob.z) * 0.004;
        }
        blob.vx *= 0.935;
        blob.vy *= 0.935;
        blob.vz *= 0.935;
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.z += blob.vz;
      });

      writeBlobs();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    }

    resize();
    bakeProbe();
    window.addEventListener('resize', resize);
    surface.addEventListener('pointerdown', onDown);
    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerup', onUp);
    surface.addEventListener('pointercancel', onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      surface.removeEventListener('pointerdown', onDown);
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerup', onUp);
      surface.removeEventListener('pointercancel', onUp);
      geometry.dispose();
      material.dispose();
      cubeTarget.dispose();
      probeStudio.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-grab touch-none"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-studio-bg from-0% via-studio-bg/45 to-transparent to-55%" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-studio-bg/35 via-transparent to-transparent" />
    </div>
  );
}

function emissivePanel(color: number, w: number, h: number) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    }),
  );
  return mesh;
}

function createOffCameraStudio() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090b);

  const top = emissivePanel(0x6a7378, 10, 6);
  top.position.set(0.7, 8, 0);
  top.rotation.x = Math.PI / 2;
  scene.add(top);

  const teal = emissivePanel(0x2a4a48, 7, 5);
  teal.position.set(-8, 1.2, 1);
  teal.rotation.y = Math.PI / 2;
  scene.add(teal);

  const cool = emissivePanel(0x3a4550, 6, 5);
  cool.position.set(9, 0.4, -3);
  cool.rotation.y = -Math.PI / 2;
  scene.add(cool);

  const back = emissivePanel(0x101416, 12, 8);
  back.position.set(0.7, 0, -9);
  scene.add(back);

  const floor = emissivePanel(0x0c0f10, 14, 14);
  floor.position.set(0.7, -7, 0);
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  const rearLight = emissivePanel(0x4a5256, 5, 3);
  rearLight.position.set(0.2, 2, 8);
  rearLight.rotation.y = Math.PI;
  scene.add(rearLight);

  const ballGeo = new THREE.IcosahedronGeometry(1.1, 1);
  const extras = [
    { color: 0x2a4040, x: -6, y: 4.5, z: -5 },
    { color: 0x5a6166, x: 6.5, y: -4, z: 5.5 },
    { color: 0x2a3034, x: -4.5, y: -5, z: 4 },
    { color: 0x1a1e20, x: 5, y: 5.5, z: -6 },
  ];
  extras.forEach((item) => {
    const mesh = new THREE.Mesh(
      ballGeo,
      new THREE.MeshBasicMaterial({ color: item.color }),
    );
    mesh.position.set(item.x, item.y, item.z);
    scene.add(mesh);
  });

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  return {
    scene,
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const mat = object.material;
          if (Array.isArray(mat)) mat.forEach((entry) => entry.dispose());
          else mat.dispose();
        }
      });
    },
  };
}
