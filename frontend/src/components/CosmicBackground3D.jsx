import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createAsteroidField,
  createDeepSpaceNebulaShader,
  createGlowSpriteTexture,
} from '../utils/spaceEffects';

export default function CosmicBackground3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Cinematic rim-lit orbital lighting for realistic cratered asteroids
    const ambient = new THREE.AmbientLight(0x1b1830, 0.45);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(7, 5, 6);
    scene.add(keyLight);

    const rimPurple = new THREE.DirectionalLight(0xa879e6, 1.45);
    rimPurple.position.set(-7, -3, -2);
    scene.add(rimPurple);

    const rimBlue = new THREE.DirectionalLight(0x7c9bff, 0.75);
    rimBlue.position.set(2, -6, -4);
    scene.add(rimBlue);

    // 1. Silky GLSL Deep-Space Nebula Shader with interactive cursor spotlight
    const nebula = createDeepSpaceNebulaShader();
    scene.add(nebula.mesh);

    // 2. Crisp Starfield
    const spriteTex = createGlowSpriteTexture(1.0, 0.35);
    const count = 820;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xcbd5e1),
      new THREE.Color(0xa879e6),
      new THREE.Color(0x8244b3),
      new THREE.Color(0x7c9bff),
      new THREE.Color(0x2eeed0),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 36;
      positions[i3 + 1] = (Math.random() - 0.5) * 26;
      positions[i3 + 2] = (Math.random() - 0.5) * 16 - 5;

      const roll = Math.random();
      let c;
      if (roll < 0.48) c = palette[0];
      else if (roll < 0.72) c = palette[1];
      else if (roll < 0.87) c = palette[2];
      else if (roll < 0.94) c = palette[3];
      else if (roll < 0.98) c = palette[4];
      else c = palette[5];

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.11,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.76,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 3. Realistic Cratered 3D Asteroids drifting along outer depth lanes
    const asteroidField = createAsteroidField(8, {
      spreadX: 15,
      spreadY: 8.8,
      minZ: -10,
      maxZ: 2.8,
      minScale: 0.12,
      maxScale: 0.42,
      speedMultiplier: 0.65,
      edgeLanesOnly: true,
    });
    scene.add(asteroidField.group);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, uvX: 0.5, uvY: 0.5 };
    let scrollY = window.scrollY || 0;

    const onPointerMove = (e) => {
      const nx = e.clientX / width;
      const ny = 1 - e.clientY / height;
      mouse.targetX = (nx - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
      mouse.uvX += (nx - mouse.uvX) * 0.25;
      mouse.uvY += (ny - mouse.uvY) * 0.25;
    };

    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      starPoints.rotation.y = elapsed * 0.012 + mouse.x * 0.05;
      starPoints.rotation.x = mouse.y * 0.035 + scrollY * 0.0002;

      nebula.update(elapsed, 0.5 + mouse.x * 0.5, 0.5 - mouse.y * 0.5, scrollY * 0.0004);

      asteroidField.update(dt);
      asteroidField.group.position.x = -mouse.x * 0.32;
      asteroidField.group.position.y = mouse.y * 0.22 + scrollY * 0.0014;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      starGeo.dispose();
      starMat.dispose();
      spriteTex.dispose();
      nebula.dispose();
      asteroidField.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
