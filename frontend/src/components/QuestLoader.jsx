import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { loadSatelliteEarthTextures } from '../utils/earthTextures';
import {
  createAsteroidField,
  createDeepSpaceNebulaShader,
  createGlowSpriteTexture,
  sampleQuestTextParticles,
} from '../utils/spaceEffects';
import './QuestLoader.css';

export default function QuestLoader({ onRevealHome, onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);
  const progressFillRef = useRef(null);
  const percentRef = useRef(null);
  const statusRef = useRef(null);
  const burstRef = useRef(null);
  const completedRef = useRef(false);
  const revealedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onRevealHomeRef = useRef(onRevealHome);
  const tlRef = useRef(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onRevealHomeRef.current = onRevealHome;
  }, [onComplete, onRevealHome]);

  const [skipped, setSkipped] = useState(false);

  const triggerReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onRevealHomeRef.current?.();
  };

  const finishLoader = () => {
    triggerReveal();
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  };

  const handleSkip = () => {
    if (completedRef.current) return;
    setSkipped(true);
    if (tlRef.current) tlRef.current.kill();
    triggerReveal();
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
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b14, 0.028);

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

    // Orbital & rim lighting
    const ambient = new THREE.AmbientLight(0x3a4870, 0.42);
    scene.add(ambient);

    const sunPos = new THREE.Vector3(5.2, 2.1, 4.4);
    const sunLight = new THREE.DirectionalLight(0xfffaf0, 3.0);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);

    const rimPurple = new THREE.DirectionalLight(0xa879e6, 1.35);
    rimPurple.position.set(-5.0, -2.5, -1.5);
    scene.add(rimPurple);

    // 1. Silky GLSL Deep-Space Nebula Backdrop
    const nebula = createDeepSpaceNebulaShader();
    scene.add(nebula.mesh);

    // 2. Realistic Cratered 3D Asteroids drifting through galaxy space
    const asteroidField = createAsteroidField(8, {
      spreadX: 10.5,
      spreadY: 6.0,
      minZ: -9,
      maxZ: 1.5,
      minScale: 0.09,
      maxScale: 0.28,
      speedMultiplier: 0.78,
    });
    scene.add(asteroidField.group);

    // 3. Stage Group wrapping Earth & Rings for responsive portrait/mobile/desktop framing
    const globeStageGroup = new THREE.Group();
    scene.add(globeStageGroup);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
    globeStageGroup.add(earthGroup);

    const textures = loadSatelliteEarthTextures(renderer);

    const earthGeo = new THREE.SphereGeometry(1.15, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textures.dayMap,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(1.45, 1.45),
      specularMap: textures.specularMap,
      specular: new THREE.Color(0xb8e6ff),
      shininess: 38,
      transparent: true,
      opacity: 1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = -Math.PI * 0.6;
    earthGroup.add(earthMesh);

    // Night-Side City Lights + Warm Sunset Twilight Terminator Shader Shell
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
          float nightMask = smoothstep(0.10, -0.22, sunDot);
          // Warm sunset glow right along the day-night terminator
          float twilight = exp(-pow(sunDot / 0.11, 2.0));
          vec3 lights = texture2D(uLightsMap, vUv).rgb;
          float intensity = max(lights.r, max(lights.g, lights.b));
          vec3 cityCol = lights * vec3(1.15, 0.96, 0.72) * intensity * nightMask;
          vec3 sunsetCol = vec3(1.0, 0.46, 0.22) * twilight * 0.24;
          gl_FragColor = vec4(cityCol + sunsetCol, (intensity * nightMask + twilight * 0.24) * uOpacity);
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

    // 4. Opposing 2-Axis Orbital Gyroscope Rings
    const ringGroup = new THREE.Group();
    globeStageGroup.add(ringGroup);

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
    ring1Holder.add(new THREE.Mesh(ring1Geo, ring1Mat));

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
    ring2Holder.add(new THREE.Mesh(ring2Geo, ring2Mat));

    const node2Geo = new THREE.SphereGeometry(0.03, 16, 16);
    const node2Mat = new THREE.MeshBasicMaterial({ color: 0x2eeed0 });
    const node2 = new THREE.Mesh(node2Geo, node2Mat);
    node2.position.set(-1.94, 0, 0);
    ring2Holder.add(node2);

    // 5. Galaxy Starfield
    const starTex = createGlowSpriteTexture(1.0, 0.35);
    const starCount = 1100;
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
      size: 0.08,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. GPU GLSL Particle Typography ("QUEST" + "A SEARCH WITHIN") with Curl Noise & Cursor Repulsion
    let textGeo = null;
    let textMat = null;
    let textPoints = null;

    const buildTextParticles = () => {
      if (isUnmounted || textPoints) return;
      const { startPositions, targetPositions, dispersePositions, colors, seeds } =
        sampleQuestTextParticles();

      textGeo = new THREE.BufferGeometry();
      textGeo.setAttribute('position', new THREE.BufferAttribute(targetPositions, 3));
      textGeo.setAttribute('aStartPos', new THREE.BufferAttribute(startPositions, 3));
      textGeo.setAttribute('aDispersePos', new THREE.BufferAttribute(dispersePositions, 3));
      textGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      textGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

      textMat = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uDisperse: { value: 0 },
          uOpacity: { value: 0 },
          uMouseLocal: { value: new THREE.Vector2(99, 99) },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uScaleFactor: { value: 1 },
        },
        vertexShader: `
          attribute vec3 aStartPos;
          attribute vec3 aDispersePos;
          attribute vec3 aColor;
          attribute float aSeed;

          uniform float uTime;
          uniform float uAssemble;
          uniform float uDisperse;
          uniform vec2 uMouseLocal;
          uniform float uPixelRatio;
          uniform float uScaleFactor;

          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vColor = aColor;

            // Smooth assembly interpolation
            vec3 pos = mix(aStartPos, position, uAssemble);

            // Swirling vortex curve during assembly
            float swirl = (1.0 - uAssemble) * (1.0 + mod(aSeed, 5.0) * 0.16);
            float cs = cos(swirl);
            float sn = sin(swirl);
            pos.xy = mat2(cs, -sn, sn, cs) * pos.xy;

            // GPU 3D curl-like shimmer & wind during dispersion
            if (uDisperse > 0.001) {
              vec3 curlOffset = vec3(
                sin(uTime * 2.5 + aSeed + pos.y * 1.6),
                cos(uTime * 2.2 + aSeed + pos.x * 1.4),
                sin(uTime * 1.9 + aSeed * 0.7)
              ) * (0.35 * sin(uDisperse * 3.14159));
              pos = mix(pos, aDispersePos + curlOffset, uDisperse);
            } else if (uAssemble > 0.90) {
              // Subtle living shimmer on formed pixels
              pos.z += sin(uTime * 3.4 + aSeed) * 0.018;
            }

            // Interactive cursor stardust repulsion while QUEST is visible
            vec2 toParticle = pos.xy - uMouseLocal;
            float dist = length(toParticle);
            float repelRadius = 0.85;
            if (dist < repelRadius && uAssemble > 0.35) {
              float push = pow(1.0 - dist / repelRadius, 2.0) * 0.42;
              vec2 dir = dist > 0.001 ? toParticle / dist : vec2(0.0, 1.0);
              pos.xy += dir * push;
              pos.z += push * 0.55;
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float baseSize = 11.5 * uPixelRatio * uScaleFactor;
            gl_PointSize = clamp(baseSize / max(1.0, -mvPosition.z), 1.5, 12.0);
            vAlpha = 1.0 - smoothstep(0.55, 1.0, uDisperse);
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            // Crisp glowing micro-pixel square with soft halo
            float boxDist = max(abs(uv.x), abs(uv.y));
            float core = 1.0 - smoothstep(0.18, 0.48, boxDist);
            float radial = 1.0 - smoothstep(0.15, 0.5, length(uv));
            float alpha = max(core * 0.95, radial * 0.65) * uOpacity * vAlpha;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
      });

      textPoints = new THREE.Points(textGeo, textMat);
      textPoints.position.set(0, 0, -3.2);
      updateTextParticleScale();
      scene.add(textPoints);
    };

    const updateStageScale = () => {
      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 5.1;
      const visW = visH * (width / height);
      const scaleW = Math.min(1, visW / 4.45);
      const scaleH = height < 560 ? Math.min(1, (visH * 0.78) / 4.0) : 1;
      globeStageGroup.scale.setScalar(Math.max(0.42, Math.min(scaleW, scaleH)));
    };
    updateStageScale();

    const updateTextParticleScale = () => {
      if (!textPoints) return;
      const dist = Math.max(2.5, camera.position.z - textPoints.position.z);
      const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      const visibleW = visibleH * camera.aspect;
      const fillRatio = width < 640 ? 0.86 : 0.74;
      const s = Math.min(1.15, (visibleW * fillRatio) / 6.4);
      textPoints.scale.setScalar(s);
      if (textMat) {
        textMat.uniforms.uScaleFactor.value = Math.max(0.56, Math.min(1.0, s * 1.45));
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildTextParticles);
    } else {
      buildTextParticles();
    }

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e) => {
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = -(e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

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

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Subtle cursor-parallax orbit around the Earth during Phase 1
      earthGroup.rotation.y = mouse.x * 0.14;
      earthGroup.rotation.x = -mouse.y * 0.09;

      earthMesh.rotation.y += dt * state.spinSpeed;
      lightsMesh.rotation.y = earthMesh.rotation.y;
      cloudMesh.rotation.y += dt * (state.spinSpeed * 1.16);

      ring1Holder.rotation.z += dt * 0.65;
      ring2Holder.rotation.z -= dt * 0.55;

      nebula.update(elapsed, 0.5 + mouse.x * 0.5, 0.5 + mouse.y * 0.5, 0);
      asteroidField.update(dt);

      const posAttr = starGeo.getAttribute('position');
      for (let i = 0; i < starCount; i++) {
        let z = posAttr.getZ(i) + state.warpSpeed;
        if (z > 6) z = -22;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
      stars.rotation.z += dt * 0.025;

      if (textPoints && textMat) {
        updateTextParticleScale();
        textMat.uniforms.uTime.value = elapsed;
        textMat.uniforms.uAssemble.value = state.assembleProgress;
        textMat.uniforms.uDisperse.value = state.disperseProgress;
        textMat.uniforms.uOpacity.value = state.textOpacity;

        // Project normalized mouse into textPoints local XY plane
        const dist = Math.max(2.5, camera.position.z - textPoints.position.z);
        const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
        const visW = visH * camera.aspect;
        const localX = (mouse.x * (visW * 0.5)) / textPoints.scale.x;
        const localY = (mouse.y * (visH * 0.5)) / textPoints.scale.y;
        textMat.uniforms.uMouseLocal.value.set(localX, localY);
      }

      renderer.render(scene, camera);
    };
    animate();

    // GSAP Master Choreography (brisk ~4.5s total)
    const tl = gsap.timeline({
      onComplete: () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onCompleteRef.current?.();
      },
    });
    tlRef.current = tl;

    gsap.set(burstRef.current, { scale: 0.1, opacity: 0 });

    // Phase 1: Satellite Earth spins with opposing 2-axis rings & asteroids
    tl.to(state, {
      progress: 100,
      duration: 1.75,
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

    // Phase 2: Zoom into Earth & transition into GPU particle space
    tl.to(
      hudRef.current,
      {
        opacity: 0,
        y: 16,
        duration: 0.3,
        ease: 'power2.in',
      },
      '+=0.05'
    )
      .to(
        state,
        {
          spinSpeed: 4.5,
          warpSpeed: 0.38,
          duration: 0.8,
          ease: 'power3.in',
        },
        '<'
      )
      .to(
        camera.position,
        {
          z: 0.85,
          duration: 0.9,
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
          duration: 0.8,
          ease: 'power2.in',
        },
        '<'
      )
      .to(
        [ring1Mat, ring2Mat, node1Mat, node2Mat],
        {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.in',
        },
        '-=0.5'
      )
      .to(
        burstRef.current,
        {
          opacity: 0.85,
          scale: 2.8,
          duration: 0.75,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .to(
        earthGroup.scale,
        {
          x: 2.3,
          y: 2.3,
          z: 2.3,
          duration: 0.6,
          ease: 'power2.in',
        },
        '<'
      )
      .to(
        earthMat,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        lightsMat.uniforms.uOpacity,
        {
          value: 0,
          duration: 0.32,
        },
        '<'
      )
      .to(
        cloudMat,
        {
          opacity: 0,
          duration: 0.32,
        },
        '<'
      )
      .to(
        atmoMat.uniforms.uOpacity,
        {
          value: 0,
          duration: 0.4,
        },
        '<'
      )
      .to(
        state,
        {
          warpSpeed: 0.02,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        burstRef.current,
        {
          opacity: 0,
          scale: 4.2,
          duration: 0.65,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .call(buildTextParticles);

    // Phase 3: GPU Pixel-Particle Assembly -> "QUEST" & "A SEARCH WITHIN" -> Dispersion
    tl.to(
      state,
      {
        textOpacity: 0.98,
        duration: 0.3,
        ease: 'power2.out',
      },
      '-=0.45'
    )
      .to(
        state,
        {
          assembleProgress: 1,
          duration: 1.15,
          ease: 'power3.out',
        },
        '<'
      )
      .to(state, {
        assembleProgress: 1,
        duration: 0.7,
      })
      .to(state, {
        disperseProgress: 1,
        duration: 0.95,
        ease: 'power2.in',
      })
      .to(
        state,
        {
          textOpacity: 0,
          duration: 0.55,
          ease: 'power2.in',
        },
        '-=0.55'
      )
      .call(triggerReveal, null, '-=0.25')
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '-=0.25'
      );

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateStageScale();
      if (textMat) {
        textMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
      updateTextParticleScale();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isUnmounted = true;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
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
        className="pointer-events-none absolute bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-1/2 flex w-full max-w-[92vw] -translate-x-1/2 flex-col items-center gap-2.5 px-3 sm:bottom-14 sm:gap-3 sm:px-4"
      >
        <div className="flex items-center gap-2 whitespace-nowrap font-mono-quest text-[10px] tracking-[0.18em] text-[#CBD5E1] sm:gap-3 sm:text-xs sm:tracking-[0.28em]">
          <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#2EEED0]" />
          <span ref={statusRef}>SCANNING HORIZONS</span>
          <span ref={percentRef} className="font-semibold text-[#A879E6]">
            00%
          </span>
        </div>
        <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10 sm:w-72">
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
          className="quest-glass font-mono-quest absolute right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 cursor-pointer rounded-full px-3.5 py-2 text-[10px] font-medium tracking-[0.16em] text-[#CBD5E1] uppercase transition-all duration-300 hover:border-[#A879E6]/50 hover:text-white sm:right-6 sm:bottom-6 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]"
        >
          Skip Intro →
        </button>
      )}
    </div>
  );
}
