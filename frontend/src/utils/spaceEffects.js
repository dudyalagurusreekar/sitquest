import * as THREE from 'three';

/**
 * Generates a soft radial glow texture for stars, pixel particles, and galaxy nebula clouds.
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
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Creates a crisp square-pixel glow sprite for the particle text assembly/dispersion effect.
 */
export function createPixelParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Subtle soft outer halo + crisp bright pixel core
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.25)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(22, 22, 20, 20);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Builds craggy, irregular 3D asteroid geometries and drifting instances.
 */
export function createAsteroidField(count = 10, options = {}) {
  const {
    spreadX = 18,
    spreadY = 11,
    minZ = -14,
    maxZ = 2.5,
    minScale = 0.14,
    maxScale = 0.48,
    speedMultiplier = 1,
  } = options;

  const group = new THREE.Group();
  const geometries = [];

  // Pre-build 4 distinct irregular rocky asteroid shapes
  for (let variant = 0; variant < 4; variant++) {
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const pos = geo.attributes.position;
    const seed = variant * 13.7 + 1.9;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Multi-frequency trigonometric displacement for natural rocky craters & ridges
      const n1 = Math.sin(x * 2.4 + seed) * Math.cos(y * 2.1 - seed) * Math.sin(z * 2.3 + seed * 0.5);
      const n2 = Math.sin(x * 5.2 - seed * 0.7) * Math.cos(z * 4.8 + y * 3.9);
      const crater = Math.max(0, Math.sin(x * 3.1 + y * 3.4 - seed)) * 0.18;
      const disp = 1 + n1 * 0.24 + n2 * 0.08 - crater;

      // Slightly squash along one axis per variant so they don't look spherical
      const sx = variant % 2 === 0 ? 1.15 : 0.88;
      const sy = variant % 2 === 0 ? 0.82 : 1.08;
      pos.setXYZ(i, x * disp * sx, y * disp * sy, z * disp);
    }
    geo.computeVertexNormals();
    geometries.push(geo);
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0x62667a,
    roughness: 0.92,
    metalness: 0.12,
    flatShading: true,
  });

  const asteroids = [];

  for (let i = 0; i < count; i++) {
    const geo = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geo, material);

    const s = minScale + Math.random() * (maxScale - minScale);
    mesh.scale.set(s, s * (0.8 + Math.random() * 0.35), s * (0.85 + Math.random() * 0.3));

    const x = (Math.random() - 0.5) * spreadX * 2;
    const y = (Math.random() - 0.5) * spreadY * 2;
    const z = minZ + Math.random() * (maxZ - minZ);
    mesh.position.set(x, y, z);

    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    const dirX = Math.random() > 0.35 ? 1 : -1;
    const vx = dirX * (0.28 + Math.random() * 0.55) * speedMultiplier;
    const vy = (Math.random() - 0.5) * 0.22 * speedMultiplier;
    const vz = (Math.random() - 0.35) * 0.18 * speedMultiplier;

    asteroids.push({
      mesh,
      vx,
      vy,
      vz,
      rx: (Math.random() - 0.5) * 0.45,
      ry: (Math.random() - 0.5) * 0.55,
      rz: (Math.random() - 0.5) * 0.35,
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

      if (a.mesh.position.x > spreadX + 2) a.mesh.position.x = -spreadX - 2;
      if (a.mesh.position.x < -spreadX - 2) a.mesh.position.x = spreadX + 2;
      if (a.mesh.position.y > spreadY + 2) a.mesh.position.y = -spreadY - 2;
      if (a.mesh.position.y < -spreadY - 2) a.mesh.position.y = spreadY + 2;
      if (a.mesh.position.z > maxZ + 1.5) a.mesh.position.z = minZ;
      if (a.mesh.position.z < minZ - 1.5) a.mesh.position.z = maxZ;
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    material.dispose();
  };

  return { group, update, dispose };
}

/**
 * Builds soft drifting galaxy nebula clouds using additive radial sprites.
 */
export function createGalaxyNebula(count = 14) {
  const texture = createGlowSpriteTexture(0.28, 0.25);
  const group = new THREE.Group();
  const materials = [];
  const sprites = [];

  const colors = [0x8244b3, 0xa879e6, 0x3b1e66, 0x7c9bff, 0x2eeed0];

  for (let i = 0; i < count; i++) {
    const color = i % 6 === 5 ? colors[4] : colors[i % 4];
    const mat = new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity: i % 6 === 5 ? 0.08 : 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(mat);

    const sprite = new THREE.Sprite(mat);
    const scale = 7 + Math.random() * 10;
    sprite.scale.set(scale * 1.45, scale, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 14,
      -8 - Math.random() * 10
    );
    sprites.push({
      sprite,
      baseX: sprite.position.x,
      baseY: sprite.position.y,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.2,
    });
    group.add(sprite);
  }

  const update = (elapsed) => {
    for (const s of sprites) {
      s.sprite.position.x = s.baseX + Math.sin(elapsed * s.speed + s.phase) * 0.7;
      s.sprite.position.y = s.baseY + Math.cos(elapsed * s.speed * 0.8 + s.phase) * 0.45;
    }
  };

  const dispose = () => {
    materials.forEach((m) => m.dispose());
    texture.dispose();
  };

  return { group, update, dispose };
}

/**
 * Samples pixel coordinates for "QUEST" and "A SEARCH WITHIN" into 3D particle buffers
 * with scattered galaxy start positions, crisp target letter positions, and dispersion vectors.
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

  // Main Wordmark: QUEST
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 176px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('QUEST', width / 2, 132);

  // Accent divider bar
  ctx.fillStyle = '#2eeed0';
  ctx.fillRect(width / 2 - 150, 224, 300, 5);

  // Motto: A SEARCH WITHIN
  ctx.fillStyle = '#a879e6';
  ctx.font = '700 34px "Space Grotesk", monospace';
  ctx.fillText('A  S E A R C H  W I T H I N', width / 2, 272);

  const imgData = ctx.getImageData(0, 0, width, height).data;

  const targets = [];
  const colors = [];

  // Sample every 3px horizontally and vertically for high-density crisp pixel typography
  const step = 3;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const alpha = imgData[idx + 3];
      if (alpha > 115) {
        const wx = ((x - width / 2) / width) * 6.4;
        const wy = ((height / 2 - y) / height) * 2.35;
        const wz = (Math.random() - 0.5) * 0.08;
        targets.push(wx, wy, wz);

        const r = imgData[idx] / 255;
        const g = imgData[idx + 1] / 255;
        const b = imgData[idx + 2] / 255;
        // Slight luminous sparkle variation per pixel
        const tint = Math.random();
        if (y < 210 && tint > 0.72) {
          colors.push(0.72, 0.56, 0.96); // Lavender sparkle in QUEST
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

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const tx = targetPositions[i3];
    const ty = targetPositions[i3 + 1];

    // Galaxy swirl scatter start
    const angle = Math.atan2(ty, tx) + (Math.random() - 0.5) * 2.8;
    const radius = 2.8 + Math.random() * 6.5;
    startPositions[i3] = Math.cos(angle) * radius;
    startPositions[i3 + 1] = Math.sin(angle) * radius * 0.65;
    startPositions[i3 + 2] = -4.5 + Math.random() * 6.0;

    // Explosive galaxy-wind dispersion vectors (sweeping outward & toward camera)
    const dAngle = Math.atan2(ty, tx) + (Math.random() - 0.5) * 1.1;
    const dDist = 3.2 + Math.random() * 6.5;
    dispersePositions[i3] = tx + Math.cos(dAngle) * dDist + (Math.random() - 0.35) * 2.2;
    dispersePositions[i3 + 1] = ty + Math.sin(dAngle) * dDist * 0.75 + (Math.random() - 0.5) * 1.8;
    dispersePositions[i3 + 2] = 1.5 + Math.random() * 5.2;
  }

  return {
    count,
    startPositions,
    targetPositions,
    dispersePositions,
    colors: particleColors,
  };
}
