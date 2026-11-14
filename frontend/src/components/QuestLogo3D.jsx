import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { loadSatelliteEarthTextures } from '../utils/earthTextures';

export default function QuestLogo3D({ className = '' }) {
  const wrapperRef = useRef(null);
  const tiltRef = useRef(null);
  const canvasRef = useRef(null);
  const glareRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const dragStateRef = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas covers [0..400, 0..400] of the 829x673 SVG coordinate space at 2x resolution
    const canvasSize = 800;
    const scale = canvasSize / 400; // 2px per SVG unit

    const scene = new THREE.Scene();

    // Two synchronized cameras sharing one scene:
    // 1. Outer peeking Earth (1x unmagnified view fitting the top-left globe outline)
    // 2. Inner magnifying glass lens (magnified view inside the bezel)
    const cameraOuter = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    cameraOuter.position.set(0, 0, 3.68);

    const cameraInner = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    cameraInner.position.set(0, 0, 2.75);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvasSize, canvasSize, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.48;
    renderer.setScissorTest(true);

    // Orbital deep-sky backdrop behind the globe
    const bgGeo = new THREE.SphereGeometry(8, 32, 32);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x071324,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(bgGeo, bgMat));

    const starCount = 150;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 3.6 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 0.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.036,
      transparent: true,
      opacity: 0.72,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Daylight satellite illumination + single-sun specular ocean reflection
    const hemiLight = new THREE.HemisphereLight(0xeef8ff, 0x3b82c4, 1.25);
    scene.add(hemiLight);

    const ambient = new THREE.AmbientLight(0xcbe8ff, 0.55);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfffcf2, 2.5);
    sunLight.position.set(2.8, 2.2, 4.2);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0x7dd3fc, 0.45, 12);
    fillLight.position.set(-2.8, -1.2, 2.5);
    scene.add(fillLight);

    // Unified 2K Satellite Earth Group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(18);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(10);
    scene.add(earthGroup);

    const textures = loadSatelliteEarthTextures(renderer);

    const earthGeo = new THREE.SphereGeometry(1.06, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0xdff5ff,
      map: textures.dayMap,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(1.4, 1.4),
      specularMap: textures.specularMap,
      specular: new THREE.Color(0xa6e4ff),
      shininess: 46,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = -Math.PI * 0.42;
    earthGroup.add(earthMesh);

    const cloudGeo = new THREE.SphereGeometry(1.076, 96, 96);
    const cloudMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: textures.cloudMap,
      alphaMap: textures.cloudMap,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.rotation.y = earthMesh.rotation.y;
    earthGroup.add(cloudMesh);

    // Feathered Atmospheric Rayleigh Halo
    const atmoGeo = new THREE.SphereGeometry(1.13, 96, 96);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uInner: { value: new THREE.Color(0x7dd3fc) },
        uOuter: { value: new THREE.Color(0x38bdf8) },
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
        uniform vec3 uInner;
        uniform vec3 uOuter;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float edge = clamp(-dot(viewDir, vNormal), 0.0, 1.0);
          float haze = pow(smoothstep(0.0, 0.55, edge), 1.8);
          vec3 col = mix(uInner, uOuter, 1.0 - edge);
          gl_FragColor = vec4(col, haze * 0.78);
        }
      `,
    });
    earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    // Viewport rects in SVG [0..400, 0..400] space (WebGL Y is bottom-up)
    const outerCx = 111;
    const outerCy = 111;
    const outerR = 102;
    const vpOuter = {
      x: (outerCx - outerR) * scale,
      y: (400 - (outerCy + outerR)) * scale,
      w: outerR * 2 * scale,
      h: outerR * 2 * scale,
    };

    const innerCx = 208;
    const innerCy = 211;
    const innerR = 138;
    const vpInner = {
      x: (innerCx - innerR) * scale,
      y: (400 - (innerCy + innerR)) * scale,
      w: innerR * 2 * scale,
      h: innerR * 2 * scale,
    };

    // GSAP quickTo for 3D logo tilt
    const rotXTo = gsap.quickTo(tiltRef.current, 'rotateX', { duration: 0.55, ease: 'power3.out' });
    const rotYTo = gsap.quickTo(tiltRef.current, 'rotateY', { duration: 0.55, ease: 'power3.out' });

    const wrapper = wrapperRef.current;

    const handlePointerMove = (e) => {
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        rotYTo(nx * 14);
        rotXTo(-ny * 12);

        sunLight.position.x = 2.8 + nx * 2.8;
        sunLight.position.y = 2.2 - ny * 2.4;

        if (glareRef.current) {
          glareRef.current.style.transform = `translate(${nx * 18}px, ${ny * 18}px)`;
        }
      }

      if (dragStateRef.current.dragging) {
        const dx = e.clientX - dragStateRef.current.lastX;
        const dy = e.clientY - dragStateRef.current.lastY;
        dragStateRef.current.lastX = e.clientX;
        dragStateRef.current.lastY = e.clientY;
        dragStateRef.current.velX = dx * 0.012;
        dragStateRef.current.velY = dy * 0.01;
        earthGroup.rotation.y += dx * 0.012;
        earthGroup.rotation.x = THREE.MathUtils.clamp(
          earthGroup.rotation.x + dy * 0.008,
          -0.85,
          0.85
        );
      }
    };

    const handlePointerLeave = () => {
      rotXTo(0);
      rotYTo(0);
      if (glareRef.current) {
        glareRef.current.style.transform = 'translate(0px, 0px)';
      }
    };

    const handlePointerUp = () => {
      if (dragStateRef.current.dragging) {
        dragStateRef.current.dragging = false;
        setIsDragging(false);
      }
    };

    wrapper?.addEventListener('pointermove', handlePointerMove);
    wrapper?.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerup', handlePointerUp);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      if (!dragStateRef.current.dragging) {
        earthGroup.rotation.y += dragStateRef.current.velX;
        earthGroup.rotation.x = THREE.MathUtils.clamp(
          earthGroup.rotation.x + dragStateRef.current.velY * 0.5,
          -0.85,
          0.85
        );
        dragStateRef.current.velX *= 0.93;
        dragStateRef.current.velY *= 0.93;

        earthMesh.rotation.y += dt * 0.3;
        cloudMesh.rotation.y += dt * 0.36;
      } else {
        cloudMesh.rotation.y += dt * 0.12;
      }

      // Pass 1: Outer peeking Earth (1x unmagnified scale behind the rim)
      renderer.setViewport(vpOuter.x, vpOuter.y, vpOuter.w, vpOuter.h);
      renderer.setScissor(vpOuter.x, vpOuter.y, vpOuter.w, vpOuter.h);
      renderer.render(scene, cameraOuter);

      // Pass 2: Inner magnifying glass lens (magnified view of the same Earth)
      renderer.setViewport(vpInner.x, vpInner.y, vpInner.w, vpInner.h);
      renderer.setScissor(vpInner.x, vpInner.y, vpInner.w, vpInner.h);
      renderer.render(scene, cameraInner);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      wrapper?.removeEventListener('pointermove', handlePointerMove);
      wrapper?.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerUp);
      bgGeo.dispose();
      bgMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      textures.dayMap.dispose();
      textures.normalMap.dispose();
      textures.specularMap.dispose();
      textures.cloudMap.dispose();
      textures.lightsMap.dispose();
      renderer.dispose();
    };
  }, []);

  const handleGlobePointerDown = (e) => {
    e.preventDefault();
    dragStateRef.current.dragging = true;
    dragStateRef.current.lastX = e.clientX;
    dragStateRef.current.lastY = e.clientY;
    dragStateRef.current.velX = 0;
    dragStateRef.current.velY = 0;
    setIsDragging(true);
    setHasInteracted(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Subtle ambient glow behind the magnifying glass */}
      <div
        className="pointer-events-none absolute top-[6%] left-[5%] h-[50%] w-[42%] rounded-full opacity-55 blur-3xl transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle, rgba(168,121,230,0.35) 0%, rgba(56,189,248,0.16) 55%, transparent 75%)',
        }}
      />

      {/* 3D Interactive Tilt Container preserving exact 829:673 logo ratio */}
      <div
        ref={tiltRef}
        className="relative w-full"
        style={{
          aspectRatio: '829 / 673',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* UNIFIED DUAL-VIEWPORT 3D SATELLITE EARTH CANVAS (Outer Peek + Inner Magnified Lens) */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-10 overflow-hidden"
          style={{
            width: '48.2509%', // 400 / 829
            height: '59.4354%', // 400 / 673
            clipPath: 'url(#quest-earth-canvas-clip)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="block h-full w-full"
          />
        </div>

        {/* Interactive Drag Hit-Zone: Outer Globe Peek */}
        <div
          onPointerDown={handleGlobePointerDown}
          title="Drag to rotate Earth"
          className={`absolute z-15 rounded-full ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            left: '1.0856%', // (111 - 102) / 829
            top: '1.3373%', // (111 - 102) / 673
            width: '24.6080%', // 204 / 829
            height: '30.3120%', // 204 / 673
          }}
        />

        {/* Interactive Drag Hit-Zone + Convex Optical Lens Overlay: Inner Magnifying Glass */}
        <div
          onPointerDown={handleGlobePointerDown}
          title="Drag to rotate Earth inside the magnifying glass"
          className={`absolute z-15 overflow-hidden rounded-full ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            left: '8.4439%',
            top: '10.8469%',
            width: '33.2931%',
            height: '41.0104%',
            boxShadow:
              'inset 0 0 18px rgba(14, 34, 62, 0.55), inset 0 0 10px rgba(125, 211, 252, 0.35)',
          }}
        >
          {/* Convex Magnifying Glass Optical Specular Overlay */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-full transition-transform duration-150 ease-out"
            style={{
              background:
                'radial-gradient(circle at 28% 24%, rgba(255,255,255,0.24) 0%, rgba(186,230,253,0.06) 30%, transparent 56%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset 3px 4px 10px rgba(255,255,255,0.22), inset -4px -6px 14px rgba(12,35,64,0.35)',
            }}
          />
        </div>

        {/* EXACT UNMODIFIED QUEST LOGO IMAGE WITH SURGICAL DUAL-WINDOW MASK */}
        <svg
          viewBox="0 0 829 673"
          className="pointer-events-none relative z-20 h-full w-full drop-shadow-[0_18px_40px_rgba(11,11,20,0.75)]"
          role="img"
          aria-label="QUEST — A Search Within Official Logo with Interactive Satellite Earth"
        >
          <defs>
            {/* Clip canvas strictly inside the white sticker boundaries */}
            <clipPath id="quest-earth-canvas-clip" clipPathUnits="objectBoundingBox">
              <circle cx="0.2775" cy="0.2775" r="0.2525" />
              <circle cx="0.52" cy="0.5275" r="0.34" />
            </clipPath>

            {/* Expose live 3D Earth in both outer globe peek & inner magnifying lens while keeping bezel + white border untouched */}
            <mask id="quest-lens-window-mask">
              <rect x="0" y="0" width="829" height="673" fill="white" />
              <circle cx="111" cy="111" r="101" fill="black" />
              <circle cx="208" cy="211" r="165" fill="white" />
              <circle cx="208" cy="211" r="135" fill="black" />
            </mask>
          </defs>
          <image
            href="/quest-logo.png"
            x="0"
            y="0"
            width="829"
            height="673"
            preserveAspectRatio="xMidYMid meet"
            mask="url(#quest-lens-window-mask)"
          />
        </svg>

        {/* Subtle Interactive Prompt Pill */}
        <div
          className={`pointer-events-none absolute z-30 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#1A0F2E]/80 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#CBD5E1] backdrop-blur-md transition-all duration-500 ${
            hasInteracted ? 'opacity-40' : 'opacity-90'
          }`}
          style={{
            left: '14%',
            top: '3.5%',
          }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2EEED0]" />
          <span className="font-mono-quest uppercase">Drag Globe</span>
        </div>
      </div>
    </div>
  );
}
