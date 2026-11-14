import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { loadSatelliteEarthTextures } from '../utils/earthTextures';
import {
  createAsteroidField,
  createGalaxyNebula,
  createGlowSpriteTexture,
  createPixelParticleTexture,
  sampleQuestTextParticles,
} from '../utils/spaceEffects';
import './QuestLoader.css';

export default function QuestLoader({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);
  const progressFillRef = useRef(null);
  const percentRef = useRef(null);
  const statusRef = useRef(null);
  const burstRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const tlRef = useRef(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [skipped, setSkipped] = useState(false);

  const finishLoader = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  };

  const handleSkip = () => {
    if (completedRef.current) return;
    setSkipped(true);
    if (tlRef.current) tlRef.current.kill();
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: finishLoader,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isUnmounted = false;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b14, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;

    // Orbital & asteroid lighting
    const ambient = new THREE.AmbientLight(0x8aa8d6, 0.5);
    scene.add(ambient);

    const sunPos = new THREE.Vector3(5.2, 2.1, 4.4);
    const sunLight = new THREE.DirectionalLight(0xfffaf0, 2.9);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);

    const earthshineLight = new THREE.DirectionalLight(0x6c8cff, 0.55);
    earthshineLight.position.set(-4.0, -1.5, 2.0);
    scene.add(earthshineLight);

    const rimPurple = new THREE.PointLight(0xa879e6, 2.2, 18);
    rimPurple.position.set(-3.8, -1.8, -1.2);
    scene.add(rimPurple);

    // 1. Galaxy Nebula Backdrop
    const nebula = createGalaxyNebula(12);
    scene.add(nebula.group);

    // 2. Drifting 3D Rocky Asteroids in Galaxy Space
    const asteroidField = createAsteroidField(9, {
      spreadX: 9.5,
      spreadY: 5.5,
      minZ: -9,
      maxZ: 1.5,
      minScale: 0.09,
      maxScale: 0.28,
      speedMultiplier: 0.85,
    });
    scene.add(asteroidField.group);

    // 3. Earth Group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(earthGroup);

    const textures = loadSatelliteEarthTextures(renderer);

    const earthGeo = new THREE.SphereGeometry(1.15, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textures.dayMap,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(1.45, 1.45),
      specularMap: textures.specularMap,
      specular: new THREE.Color(0xb8e6ff),
      shininess: 36,
      transparent: true,
      opacity: 1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = -Math.PI * 0.6;
    earthGroup.add(earthMesh);

    // Night-Side City Lights Shader Shell
    const sunDirWorld = sunPos.clone().normalize();
    const lightsGeo = new THREE.SphereGeometry(1.153, 96, 96);
    const lightsMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uLightsMap: { value: textures.lightsMap },
        uSunDir: { value: sunDirWorld },
        uOpacity: { value: 0.95 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uLightsMap;
        uniform vec3 uSunDir;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          float sunDot = dot(normalize(vWorldNormal), normalize(uSunDir));
          float nightMask = smoothstep(0.12, -0.22, sunDot);
          vec3 lights = texture2D(uLightsMap, vUv).rgb;
          float intensity = max(lights.r, max(lights.g, lights.b));
          gl_FragColor = vec4(lights * vec3(1.15, 0.96, 0.72), intensity * nightMask * uOpacity);
        }
      `,
    });
    const lightsMesh = new THREE.Mesh(lightsGeo, lightsMat);
    lightsMesh.rotation.y = earthMesh.rotation.y;
    earthGroup.add(lightsMesh);

    // Drifting Satellite Cloud Deck
    const cloudGeo = new THREE.SphereGeometry(1.168, 96, 96);
    const cloudMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: textures.cloudMap,
      alphaMap: textures.cloudMap,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.rotation.y = earthMesh.rotation.y;
    earthGroup.add(cloudMesh);

    // Feathered Atmospheric Rayleigh Halo
    const atmoGeo = new THREE.SphereGeometry(1.235, 96, 96);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uColorInner: { value: new THREE.Color(0x4fc3f7) },
        uColorOuter: { value: new THREE.Color(0x9b6dff) },
        uOpacity: { value: 0.9 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorInner;
        uniform vec3 uColorOuter;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float edge = clamp(-dot(viewDir, vNormal), 0.0, 1.0);
          float haze = pow(smoothstep(0.0, 0.55, edge), 1.75);
          vec3 col = mix(uColorInner, uColorOuter, 1.0 - edge);
          gl_FragColor = vec4(col, haze * 0.72 * uOpacity);
        }
      `,
    });
    earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    // 4. Cleanly Opposed 2-Axis Orbital Gyroscope Rings (Symmetric X-crossed, non-merging)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ring1Holder = new THREE.Group();
    ring1Holder.rotation.x = THREE.MathUtils.degToRad(62);
    ring1Holder.rotation.y = THREE.MathUtils.degToRad(36);
    ringGroup.add(ring1Holder);

    const ring1Geo = new THREE.TorusGeometry(1.66, 0.007, 16, 128);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xa879e6,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Holder.add(ring1);

    const node1Geo = new THREE.SphereGeometry(0.032, 16, 16);
    const node1Mat = new THREE.MeshBasicMaterial({ color: 0xa879e6 });
    const node1 = new THREE.Mesh(node1Geo, node1Mat);
    node1.position.set(1.66, 0, 0);
    ring1Holder.add(node1);

    const ring2Holder = new THREE.Group();
    ring2Holder.rotation.x = THREE.MathUtils.degToRad(-62);
    ring2Holder.rotation.y = THREE.MathUtils.degToRad(-36);
    ringGroup.add(ring2Holder);

    const ring2Geo = new THREE.TorusGeometry(1.94, 0.006, 16, 128);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x2eeed0,
      transparent: true,
      opacity: 0.34,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Holder.add(ring2);

    const node2Geo = new THREE.SphereGeometry(0.03, 16, 16);
    const node2Mat = new THREE.MeshBasicMaterial({ color: 0x2eeed0 });
    const node2 = new THREE.Mesh(node2Geo, node2Mat);
    node2.position.set(-1.94, 0, 0);
    ring2Holder.add(node2);

    // 5. Galaxy Starfield
    const starTex = createGlowSpriteTexture(1.0, 0.35);
    const starCount = 1300;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xdbeafe),
      new THREE.Color(0xa879e6),
      new THREE.Color(0x7c9bff),
      new THREE.Color(0x2eeed0),
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const r = 4.5 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = r * Math.cos(phi) - 6;

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i3] = c.r;
      starColors[i3 + 1] = c.g;
      starColors[i3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.085,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Pixel Particle Typography ("QUEST" + "A SEARCH WITHIN")
    const pixelTex = createPixelParticleTexture();
    let textParticleData = null;
    let textGeo = null;
    let textMat = null;
    let textPoints = null;

    const buildTextParticles = () => {
      if (isUnmounted || textPoints) return;
      textParticleData = sampleQuestTextParticles();
      const { startPositions, colors } = textParticleData;

      textGeo = new THREE.BufferGeometry();
      textGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(startPositions), 3)
      );
      textGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      textMat = new THREE.PointsMaterial({
        size: 0.045,
        map: pixelTex,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      textPoints = new THREE.Points(textGeo, textMat);
      textPoints.position.set(0, 0, -3.2);
      updateTextParticleScale();
      scene.add(textPoints);
    };

    const updateTextParticleScale = () => {
      if (!textPoints) return;
      const dist = Math.max(2.5, camera.position.z - textPoints.position.z);
      const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      const visibleW = visibleH * camera.aspect;
      // Fit 6.4 world-unit QUEST wordmark cleanly inside ~74% of viewport width
      const s = Math.min(1.15, (visibleW * 0.74) / 6.4);
      textPoints.scale.setScalar(s);
    };

    // Wait briefly for web fonts so canvas samples Plus Jakarta Sans & Space Grotesk
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildTextParticles);
    } else {
      buildTextParticles();
    }

    const state = {
      spinSpeed: 0.52,
      warpSpeed: 0.01,
      progress: 0,
      assembleProgress: 0,
      disperseProgress: 0,
      textOpacity: 0,
    };

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      earthMesh.rotation.y += dt * state.spinSpeed;
      lightsMesh.rotation.y = earthMesh.rotation.y;
      cloudMesh.rotation.y += dt * (state.spinSpeed * 1.16);

      // Opposite counter-rotation of the 2-axis orbital rings
      ring1Holder.rotation.z += dt * 0.65;
      ring2Holder.rotation.z -= dt * 0.55;

      nebula.update(elapsed);
      asteroidField.update(dt);

      const posAttr = starGeo.getAttribute('position');
      for (let i = 0; i < starCount; i++) {
        let z = posAttr.getZ(i) + state.warpSpeed;
        if (z > 6) z = -22;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
      stars.rotation.z += dt * 0.025;

      // Update pixel-particle assembly & dispersion
      if (textPoints && textParticleData) {
        updateTextParticleScale();
        textMat.opacity = state.textOpacity;

        const { count, startPositions, targetPositions, dispersePositions } = textParticleData;
        const pAttr = textGeo.getAttribute('position');
        const arr = pAttr.array;

        const a = state.assembleProgress;
        const d = state.disperseProgress;
        const swirl = (1 - a) * 0.85;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          // Interpolate start -> formed QUEST text
          let px = startPositions[i3] + (targetPositions[i3] - startPositions[i3]) * a;
          let py = startPositions[i3 + 1] + (targetPositions[i3 + 1] - startPositions[i3 + 1]) * a;
          let pz = startPositions[i3 + 2] + (targetPositions[i3 + 2] - startPositions[i3 + 2]) * a;

          // Swirling galaxy vortex curve while assembling
          if (swirl > 0.005) {
            const ang = swirl * (1.2 + (i % 7) * 0.12);
            const cosA = Math.cos(ang);
            const sinA = Math.sin(ang);
            const rx = px * cosA - py * sinA;
            const ry = px * sinA + py * cosA;
            px = rx;
            py = ry;
          }

          // Subtle shimmering breath when formed, then disperse outward
          if (d > 0.001) {
            px = px + (dispersePositions[i3] - px) * d;
            py = py + (dispersePositions[i3 + 1] - py) * d;
            pz = pz + (dispersePositions[i3 + 2] - pz) * d;
          } else if (a > 0.92) {
            pz += Math.sin(elapsed * 3.2 + i * 0.35) * 0.018;
          }

          arr[i3] = px;
          arr[i3 + 1] = py;
          arr[i3 + 2] = pz;
        }
        pAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // GSAP Master Choreography
    const tl = gsap.timeline({
      onComplete: () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onCompleteRef.current?.();
      },
    });
    tlRef.current = tl;

    gsap.set(burstRef.current, { scale: 0.1, opacity: 0 });

    // Phase 1: Satellite Earth spins with opposing 2-axis orbital rings & drifting asteroids
    tl.to(state, {
      progress: 100,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(state.progress);
        if (percentRef.current) percentRef.current.textContent = `${String(val).padStart(2, '0')}%`;
        if (progressFillRef.current) progressFillRef.current.style.width = `${val}%`;
        if (statusRef.current) {
          if (val < 38) statusRef.current.textContent = 'SCANNING HORIZONS';
          else if (val < 78) statusRef.current.textContent = 'ALIGNING ORBITAL LENS';
          else statusRef.current.textContent = 'INITIATING SEARCH WITHIN';
        }
      },
    });

    // Phase 2: Zoom into Earth & transition into particle space
    tl.to(
      hudRef.current,
      {
        opacity: 0,
        y: 16,
        duration: 0.35,
        ease: 'power2.in',
      },
      '+=0.05'
    )
      .to(
        state,
        {
          spinSpeed: 4.5,
          warpSpeed: 0.38,
          duration: 0.9,
          ease: 'power3.in',
        },
        '<'
      )
      .to(
        camera.position,
        {
          z: 0.85,
          duration: 1.0,
          ease: 'power3.in',
        },
        '<'
      )
      .to(
        ringGroup.scale,
        {
          x: 2.5,
          y: 2.5,
          z: 2.5,
          duration: 0.85,
          ease: 'power2.in',
        },
        '<'
      )
      .to(
        [ring1Mat, ring2Mat, node1Mat, node2Mat],
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        '-=0.55'
      )
      .to(
        burstRef.current,
        {
          opacity: 0.9,
          scale: 2.8,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.35'
      )
      .to(
        earthGroup.scale,
        {
          x: 2.3,
          y: 2.3,
          z: 2.3,
          duration: 0.65,
          ease: 'power2.in',
        },
        '<'
      )
      .to(
        earthMat,
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        lightsMat.uniforms.uOpacity,
        {
          value: 0,
          duration: 0.35,
        },
        '<'
      )
      .to(
        cloudMat,
        {
          opacity: 0,
          duration: 0.35,
        },
        '<'
      )
      .to(
        atmoMat.uniforms.uOpacity,
        {
          value: 0,
          duration: 0.45,
        },
        '<'
      )
      .to(
        state,
        {
          warpSpeed: 0.02,
          duration: 0.65,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        burstRef.current,
        {
          opacity: 0,
          scale: 4.2,
          duration: 0.7,
          ease: 'power2.out',
        },
        '-=0.35'
      )
      .call(buildTextParticles);

    // Phase 3: Pixel Particle Assembly -> "QUEST" & "A SEARCH WITHIN" -> Dispersion
    tl.to(
      state,
      {
        textOpacity: 0.96,
        duration: 0.35,
        ease: 'power2.out',
      },
      '-=0.5'
    )
      .to(
        state,
        {
          assembleProgress: 1,
          duration: 1.35,
          ease: 'power3.out',
        },
        '<'
      )
      // Hold formed pixel typography cleanly
      .to(state, {
        assembleProgress: 1,
        duration: 0.85,
      })
      // Disperse formed pixels outward into galaxy dust
      .to(state, {
        disperseProgress: 1,
        duration: 1.05,
        ease: 'power2.in',
      })
      .to(
        state,
        {
          textOpacity: 0,
          duration: 0.65,
          ease: 'power2.in',
        },
        '-=0.65'
      )
      // Phase 4: Seamless fade into Home Page
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        '-=0.35'
      );

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateTextParticleScale();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isUnmounted = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      tl.kill();
      earthGeo.dispose();
      earthMat.dispose();
      lightsGeo.dispose();
      lightsMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      node1Geo.dispose();
      node1Mat.dispose();
      node2Geo.dispose();
      node2Mat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starTex.dispose();
      pixelTex.dispose();
      if (textGeo) textGeo.dispose();
      if (textMat) textMat.dispose();
      nebula.dispose();
      asteroidField.dispose();
      textures.dayMap.dispose();
      textures.normalMap.dispose();
      textures.specularMap.dispose();
      textures.cloudMap.dispose();
      textures.lightsMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="quest-loader fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      aria-label="Loading QUEST"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="quest-loader-vignette pointer-events-none absolute inset-0" />
      <div ref={burstRef} className="quest-loader-burst pointer-events-none" />

      {/* Phase 1 HUD */}
      <div
        ref={hudRef}
        className="pointer-events-none absolute bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 px-4"
      >
        <div className="flex items-center gap-3 font-mono-quest text-xs tracking-[0.28em] text-[#CBD5E1]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#2EEED0]" />
          <span ref={statusRef}>SCANNING HORIZONS</span>
          <span ref={percentRef} className="text-[#A879E6] font-semibold">
            00%
          </span>
        </div>
        <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
          <div
            ref={progressFillRef}
            className="h-full w-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #8244B3 0%, #A879E6 65%, #2EEED0 100%)' }}
          />
        </div>
      </div>

      {!skipped && (
        <button
          type="button"
          onClick={handleSkip}
          className="quest-glass font-mono-quest absolute right-6 bottom-6 z-20 cursor-pointer rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.2em] text-[#CBD5E1] uppercase transition-all duration-300 hover:border-[#A879E6]/50 hover:text-white"
        >
          Skip Intro →
        </button>
      )}
    </div>
  );
}
