import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import BorderBeam from './BorderBeam';

/**
 * 3D Circular Gallery displaying Senior Voices (Name, concise <=3-line Review,
 * and bottom LinkedIn connect arrow link).
 */
export default function SeniorCircularGallery({
  items = [],
  autoRotateSpeed = 0.08,
  className = '',
}) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const isScrollingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragRef = useRef({ active: false, lastX: 0 });
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-linked smooth target rotation + idle reset
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      if (deltaY !== 0) {
        targetRotationRef.current -= deltaY * 0.14;
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Silky interpolated rAF loop (auto-rotate + inertia lerp for scroll & button steps)
  useEffect(() => {
    let rafId = 0;
    const animate = () => {
      if (!isScrollingRef.current && !isHoveredRef.current && !dragRef.current.active) {
        targetRotationRef.current += autoRotateSpeed;
      }
      const diff = targetRotationRef.current - currentRotationRef.current;
      if (Math.abs(diff) > 0.005) {
        currentRotationRef.current += diff * 0.14;
        setRotation(currentRotationRef.current);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotateSpeed]);

  // Global drag move/release handlers so touch & mouse swipes never drop outside bounds
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.lastX;
      dragRef.current.lastX = e.clientX;
      targetRotationRef.current += dx * 0.28;
    };
    const onPointerUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  if (!items.length) return null;

  const anglePerItem = 360 / items.length;
  const cardWidth = isMobile ? 248 : 288;
  const cardHeight = isMobile ? 196 : 206;
  const radius = isMobile ? 730 : 840;

  const handleStep = (dir) => {
    targetRotationRef.current += dir * anglePerItem;
  };

  return (
    <section
      aria-label="Voices of QUEST 3D Circular Gallery"
      className={`relative z-10 w-full overflow-hidden border-y border-white/[0.08] bg-[#1A0F2E]/35 py-8 backdrop-blur-md sm:py-10 ${className}`}
    >
      {/* Clean Header + Prev/Next Controls */}
      <div className="mx-auto mb-5 flex max-w-7xl items-center justify-between gap-3 px-4 sm:mb-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Voices of <span className="text-[#A879E6]">QUEST</span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Previous senior review"
            className="quest-glass-card inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[#CBD5E1] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Next senior review"
            className="quest-glass-card inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[#CBD5E1] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Edge gradient fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 sm:w-28"
        style={{ background: 'linear-gradient(90deg, rgba(11,11,20,0.92) 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 sm:w-28"
        style={{ background: 'linear-gradient(270deg, rgba(11,11,20,0.92) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* 3D Cylinder Stage */}
      <div
        role="region"
        aria-label="Circular 3D Senior Reviews Gallery"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onPointerDown={(e) => {
          dragRef.current.active = true;
          dragRef.current.lastX = e.clientX;
        }}
        className="relative flex w-full cursor-grab items-center justify-center select-none active:cursor-grabbing"
        style={{
          height: `${cardHeight + 28}px`,
          perspective: '2000px',
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((senior, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.22, 1 - normalizedAngle / 140);
            const isFrontHalf = normalizedAngle <= 88;
            const isFocusedCenter = normalizedAngle <= 14;

            return (
              <div
                key={senior.id}
                role="group"
                aria-label={senior.name}
                className="absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  opacity,
                  zIndex: Math.round(200 - normalizedAngle),
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  pointerEvents: isFrontHalf ? 'auto' : 'none',
                  transition: 'opacity 0.25s linear',
                }}
              >
                <article className="quest-glass group/card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#1A0F2E]/85 p-4 shadow-[0_18px_42px_rgba(11,11,20,0.7)] transition-colors duration-300 hover:border-[#A879E6]/45 sm:p-5">
                  {/* 21st.dev Perimeter Border Beam on active centered or hovered card */}
                  <BorderBeam
                    duration={4.8}
                    borderWidth={1.35}
                    className={`transition-opacity duration-500 ${
                      isFocusedCenter ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                    }`}
                  />
                  {/* Top Row: Senior Name */}
                  <div className="border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Quote className="h-3.5 w-3.5 shrink-0 text-[#A879E6]/80" aria-hidden="true" />
                      <h3 className="truncate text-[15px] font-bold tracking-tight text-white sm:text-base">
                        {senior.name}
                      </h3>
                    </div>
                  </div>

                  {/* Summarized Review Body (max 3 lines) */}
                  <div className="my-2.5 flex-1 flex items-center">
                    <p className="line-clamp-3 text-xs leading-relaxed text-[#CBD5E1] sm:text-[13px]">
                      “{senior.review}”
                    </p>
                  </div>

                  {/* Bottom Row: Single LinkedIn Arrow Link */}
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="h-[2px] w-7 rounded-full bg-gradient-to-r from-[#8244B3] to-[#2EEED0]" />
                    {senior.linkedinUrl && (
                      <a
                        href={senior.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        title={`Connect with ${senior.name} on LinkedIn`}
                        aria-label={`Connect with ${senior.name} on LinkedIn`}
                        className="group/link font-mono-quest inline-flex items-center gap-1 rounded-full border border-[#A879E6]/35 bg-[#8244B3]/20 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-[#A879E6] uppercase transition-all duration-200 hover:border-[#2EEED0]/60 hover:bg-[#2EEED0]/15 hover:text-[#2EEED0]"
                      >
                        <span>LinkedIn</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
