import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createAsteroidField,
  createGalaxyNebula,
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

    // Lighting for 3D rocky asteroids
    const ambient = new THREE.AmbientLight(0x4a4568, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 1.65);
    keyLight.position.set(6, 5, 8);
    scene.add(keyLight);

    const purpleRim = new THREE.DirectionalLight(0xa879e6, 1.15);
    purpleRim.position.set(-7, -3, 3);
    scene.add(purpleRim);

    const tealAccent = new THREE.PointLight(0x2eeed0, 0.8, 28);
    tealAccent.position.set(5, -4, 4);
    scene.add(tealAccent);

    // 1. Galaxy Nebula Clouds
    const nebula = createGalaxyNebula(14);
    scene.add(nebula.group);

    // 2. Crisp Starfield
    const spriteTex = createGlowSpriteTexture(1.0, 0.35);
    const count = 950;
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
      positions[i3 + 1] = (Math.random() - 0.5) * 28;
      positions[i3 + 2] = (Math.random() - 0.5) * 18 - 4;

      const roll = Math.random();
      let c;
      if (roll < 0.45) c = palette[0];
      else if (roll < 0.7) c = palette[1];
      else if (roll < 0.86) c = palette[2];
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
      size: 0.13,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 3. Drifting 3D Rocky Asteroids
    const asteroidField = createAsteroidField(10, {
      spreadX: 14,
      spreadY: 8.5,
      minZ: -9,
      maxZ: 3.5,
      minScale: 0.14,
      maxScale: 0.44,
      speedMultiplier: 0.75,
    });
    scene.add(asteroidField.group);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY || 0;

    const onPointerMove = (e) => {
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
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

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      starPoints.rotation.y = elapsed * 0.015 + mouse.x * 0.06;
      starPoints.rotation.x = mouse.y * 0.04 + scrollY * 0.00022;

      nebula.update(elapsed);
      nebula.group.position.x = -mouse.x * 0.45;
      nebula.group.position.y = mouse.y * 0.3 + scrollY * 0.0012;

      asteroidField.update(dt);
      asteroidField.group.position.x = -mouse.x * 0.35;
      asteroidField.group.position.y = mouse.y * 0.25 + scrollY * 0.0016;

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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-95"
      aria-hidden="true"
    />
  );
}
