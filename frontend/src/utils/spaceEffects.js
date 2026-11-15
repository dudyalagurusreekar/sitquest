import * as THREE from 'three';

let cachedAsteroidMaps = null;

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x, y, octaves = 4) {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * smoothNoise(x * freq, y * freq);
    freq *= 2.05;
    amp *= 0.5;
  }
  return v;
}

/**
 * Generates cached procedural cratered regolith albedo + bump maps for realistic 3D asteroids.
 */
export function getAsteroidMaps() {
  if (cachedAsteroidMaps) {
    return {
      map: new THREE.CanvasTexture(cachedAsteroidMaps.albedoCanvas),
      bumpMap: new THREE.CanvasTexture(cachedAsteroidMaps.bumpCanvas),
    };
  }

  const size = 256;
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d');
  const aImg = aCtx.createImageData(size, size);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');
  const bImg = bCtx.createImageData(size, size);

  // Pre-seed realistic impact craters
  const craters = Array.from({ length: 28 }, (_, i) => ({
    x: hash2(i * 3.1, 7.2) * size,
    y: hash2(i * 5.7, 2.9) * size,
    r: 8 + hash2(i * 1.9, 9.4) * 26,
    depth: 0.35 + hash2(i * 4.3, 1.1) * 0.45,
  }));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const n = fbm((x / size) * 8, (y / size) * 8, 4);
      const grain = fbm((x / size) * 28, (y / size) * 28, 2);

      let craterMod = 0;
      for (const c of craters) {
        let dx = Math.abs(x - c.x);
        let dy = Math.abs(y - c.y);
        if (dx > size / 2) dx = size - dx;
        if (dy > size / 2) dy = size - dy;
        const dist = Math.sqrt(dx * dx + dy * dy) / c.r;
        if (dist < 1.25) {
          if (dist < 0.85) {
            // Concave bowl
            craterMod -= (1 - (dist / 0.85) ** 2) * c.depth;
          } else {
            // Raised ejecta rim
            const rimT = (dist - 0.85) / 0.4;
            craterMod += Math.sin(rimT * Math.PI) * c.depth * 0.35;
          }
        }
      }

      const h = Math.max(0, Math.min(1, n * 0.65 + grain * 0.25 + craterMod * 0.55));
      const bump = Math.floor(h * 255);
      bImg.data[idx] = bump;
      bImg.data[idx + 1] = bump;
      bImg.data[idx + 2] = bump;
      bImg.data[idx + 3] = 255;

      // Dark basalt / iron-silicate tones
      const shade = 52 + h * 86;
      aImg.data[idx] = Math.min(255, shade * 0.96);
      aImg.data[idx + 1] = Math.min(255, shade * 0.94);
      aImg.data[idx + 2] = Math.min(255, shade * 1.04);
      aImg.data[idx + 3] = 255;
    }
  }

  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);

  cachedAsteroidMaps = { albedoCanvas, bumpCanvas };

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

/**
 * Generates a soft radial glow texture for stars and sprite glows.
 */
export function createGlowSpriteTexture(innerAlpha = 1.0, softness = 0.35) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(255, 255, 255, ${innerAlpha})`);
  grad.addColorStop(softness, `rgba(255, 255, 255, ${innerAlpha * 0.55})`);
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Builds realistic cratered 3D rocky asteroids with procedural regolith textures & rim shading.
 */
export function createAsteroidField(count = 9, options = {}) {
  const {
    spreadX = 16,
    spreadY = 9.5,
    minZ = -11,
    maxZ = 3.5,
    minScale = 0.12,
    maxScale = 0.44,
    speedMultiplier = 1,
    edgeLanesOnly = false,
  } = options;

  const group = new THREE.Group();
  const geometries = [];

  for (let variant = 0; variant < 5; variant++) {
    const geo = new THREE.IcosahedronGeometry(1, 3);
    const pos = geo.attributes.position;
    const seed = variant * 17.3 + 2.4;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const ridge =
        Math.sin(x * 2.1 + seed) * Math.cos(y * 1.9 - seed) * Math.sin(z * 2.2 + seed * 0.4);
      const crag = Math.sin(x * 4.7 - seed * 0.8) * Math.cos(z * 4.3 + y * 3.6);
      const crater = Math.pow(Math.max(0, Math.sin(x * 2.8 + y * 3.1 - seed * 1.1)), 2) * 0.22;
      const disp = 1 + ridge * 0.22 + crag * 0.06 - crater;

      const sx = variant % 2 === 0 ? 1.18 : 0.86;
      const sy = variant % 3 === 0 ? 0.78 : 1.06;
      pos.setXYZ(i, x * disp * sx, y * disp * sy, z * disp);
    }
    geo.computeVertexNormals();
    geometries.push(geo);
  }

  const { map, bumpMap } = getAsteroidMaps();

  const material = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.085,
    roughness: 0.88,
    metalness: 0.14,
  });

  const asteroids = [];

  for (let i = 0; i < count; i++) {
    const geo = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geo, material);

    // Mix tiny fast foreground micro-rocks with larger distant boulders
    const depthTier = i % 4 === 0 ? 'near' : i % 3 === 0 ? 'far' : 'mid';
    const scaleFactor =
      depthTier === 'near'
        ? minScale * (0.75 + Math.random() * 0.5)
        : depthTier === 'far'
        ? maxScale * (0.8 + Math.random() * 0.35)
        : minScale + Math.random() * (maxScale - minScale);

    mesh.scale.set(
      scaleFactor,
      scaleFactor * (0.78 + Math.random() * 0.32),
      scaleFactor * (0.84 + Math.random() * 0.28)
    );

    let x = (Math.random() - 0.5) * spreadX * 2;
    let y = (Math.random() - 0.5) * spreadY * 2;

    if (edgeLanesOnly) {
      // Keep the central hero typography zone clean while populating outer lanes & upper/lower depth
      if (Math.abs(x) < spreadX * 0.42 && Math.abs(y) < spreadY * 0.45) {
        y = (y >= 0 ? 1 : -1) * (spreadY * 0.58 + Math.random() * spreadY * 0.42);
      }
    }

    const z =
      depthTier === 'near'
        ? maxZ - Math.random() * 2.5
        : depthTier === 'far'
        ? minZ + Math.random() * 4
        : minZ + 3 + Math.random() * (maxZ - minZ - 4);

    mesh.position.set(x, y, z);
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    const speedTier = depthTier === 'near' ? 1.35 : depthTier === 'far' ? 0.55 : 0.9;
    const dirX = Math.random() > 0.3 ? 1 : -1;
    const vx = dirX * (0.24 + Math.random() * 0.42) * speedMultiplier * speedTier;
    const vy = (Math.random() - 0.5) * 0.18 * speedMultiplier * speedTier;
    const vz = (Math.random() - 0.35) * 0.14 * speedMultiplier;

    asteroids.push({
      mesh,
      vx,
      vy,
      vz,
      rx: (Math.random() - 0.5) * 0.42,
      ry: (Math.random() - 0.5) * 0.52,
      rz: (Math.random() - 0.5) * 0.32,
    });

    group.add(mesh);
  }

  const update = (dt) => {
    for (const a of asteroids) {
      a.mesh.position.x += a.vx * dt;
      a.mesh.position.y += a.vy * dt;
      a.mesh.position.z += a.vz * dt;

      a.mesh.rotation.x += a.rx * dt;
      a.mesh.rotation.y += a.ry * dt;
      a.mesh.rotation.z += a.rz * dt;

      if (a.mesh.position.x > spreadX + 2.5) a.mesh.position.x = -spreadX - 2.5;
      if (a.mesh.position.x < -spreadX - 2.5) a.mesh.position.x = spreadX + 2.5;
      if (a.mesh.position.y > spreadY + 2) a.mesh.position.y = -spreadY - 2;
      if (a.mesh.position.y < -spreadY - 2) a.mesh.position.y = spreadY + 2;
      if (a.mesh.position.z > maxZ + 1.5) a.mesh.position.z = minZ;
      if (a.mesh.position.z < minZ - 1.5) a.mesh.position.z = maxZ;
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    material.dispose();
    map.dispose();
    bumpMap.dispose();
  };

  return { group, update, dispose };
}

/**
 * Full-screen silky GLSL fBm Deep-Space Nebula Shader with interactive cursor spotlight.
 * Replaces flat sprite clouds and clumsy square grids.
 */
export function createDeepSpaceNebulaShader() {
  const geo = new THREE.PlaneGeometry(68, 42);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv * vec2(3.2, 2.0) + vec2(uTime * 0.014, uScroll * 0.12);

        float q = fbm(p + vec2(0.0, uTime * 0.008));
        float r = fbm(p + 1.8 * q + vec2(1.7, 9.2) - uTime * 0.01);
        float nebula = smoothstep(0.28, 0.88, r);

        // Diagonal galactic dust band
        float band = exp(-pow((uv.y - (0.45 + (uv.x - 0.5) * 0.25)) * 2.6, 2.0));

        vec3 baseDark = vec3(0.043, 0.043, 0.078); // #0B0B14
        vec3 deepPlum = vec3(0.102, 0.059, 0.180); // #1A0F2E
        vec3 novaPurple = vec3(0.510, 0.267, 0.702); // #8244B3
        vec3 lavender = vec3(0.659, 0.475, 0.902); // #A879E6
        vec3 accentTeal = vec3(0.180, 0.933, 0.816); // #2EEED0

        vec3 col = mix(baseDark, deepPlum, nebula * (0.55 + 0.45 * band));
        col += novaPurple * pow(nebula, 2.3) * band * 0.22;
        col += lavender * smoothstep(0.68, 0.95, q) * band * 0.08;
        col += accentTeal * smoothstep(0.76, 0.98, r * q) * 0.04;

        // Subtle interactive cursor spotlight illuminating nearby cosmic dust
        float distMouse = distance(uv, uMouse);
        float spotlight = exp(-distMouse * distMouse * 18.0);
        col += mix(lavender, accentTeal, 0.25) * spotlight * (0.06 + 0.08 * nebula);

        gl_FragColor = vec4(col, 0.92);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, -18);

  const update = (elapsed, mouseNormX, mouseNormY, scrollNorm) => {
    mat.uniforms.uTime.value = elapsed;
    mat.uniforms.uMouse.value.set(mouseNormX, mouseNormY);
    mat.uniforms.uScroll.value = scrollNorm;
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return { mesh, update, dispose };
}

/**
 * Samples high-density pixel coordinates for "QUEST" and "A SEARCH WITHIN"
 * for GPU shader assembly, curl-noise motion, cursor repulsion, and dispersion.
 */
export function sampleQuestTextParticles() {
  const width = 960;
  const height = 340;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 176px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('QUEST', width / 2, 132);

  ctx.fillStyle = '#2eeed0';
  ctx.fillRect(width / 2 - 150, 224, 300, 5);

  ctx.fillStyle = '#a879e6';
  ctx.font = '700 34px "Space Grotesk", monospace';
  ctx.fillText('A  S E A R C H  W I T H I N', width / 2, 272);

  const imgData = ctx.getImageData(0, 0, width, height).data;

  const targets = [];
  const colors = [];

  // High-density 2px grid sampling (~10,000 micro-pixels for GPU shader)
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const alpha = imgData[idx + 3];
      if (alpha > 110) {
        const wx = ((x - width / 2) / width) * 6.4;
        const wy = ((height / 2 - y) / height) * 2.35;
        const wz = (Math.random() - 0.5) * 0.06;
        targets.push(wx, wy, wz);

        const r = imgData[idx] / 255;
        const g = imgData[idx + 1] / 255;
        const b = imgData[idx + 2] / 255;
        const tint = Math.random();
        if (y < 210 && tint > 0.72) {
          colors.push(0.74, 0.58, 0.98);
        } else {
          colors.push(r, g, b);
        }
      }
    }
  }

  const count = targets.length / 3;
  const startPositions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(targets);
  const dispersePositions = new Float32Array(count * 3);
  const particleColors = new Float32Array(colors);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const tx = targetPositions[i3];
    const ty = targetPositions[i3 + 1];
    seeds[i] = Math.random() * 100.0;

    const angle = Math.atan2(ty, tx) + (Math.random() - 0.5) * 3.0;
    const radius = 2.6 + Math.random() * 6.8;
    startPositions[i3] = Math.cos(angle) * radius;
    startPositions[i3 + 1] = Math.sin(angle) * radius * 0.65;
    startPositions[i3 + 2] = -4.8 + Math.random() * 6.2;

    const dAngle = Math.atan2(ty, tx) + (Math.random() - 0.5) * 1.15;
    const dDist = 3.2 + Math.random() * 6.8;
    dispersePositions[i3] = tx + Math.cos(dAngle) * dDist + (Math.random() - 0.35) * 2.0;
    dispersePositions[i3 + 1] = ty + Math.sin(dAngle) * dDist * 0.75 + (Math.random() - 0.5) * 1.8;
    dispersePositions[i3 + 2] = 1.6 + Math.random() * 5.2;
  }

  return {
    count,
    startPositions,
    targetPositions,
    dispersePositions,
    colors: particleColors,
    seeds,
  };
}
