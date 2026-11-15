import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight } from 'lucide-react';
import CosmicBackground3D from '../../components/CosmicBackground3D';
import QuestLogo3D from '../../components/QuestLogo3D';
import SeniorCircularGallery from '../../components/SeniorCircularGallery';
import { SENIOR_REVIEWS } from '../../data/seniorsReviews';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ introReady = true }) {
  const pageRef = useRef(null);
  const heroLeftRef = useRef(null);
  const heroRightRef = useRef(null);
  const logoFloatRef = useRef(null);

  // Buttery smooth scrolling via Lenis synced to GSAP ScrollTrigger
  useEffect(() => {
    if (!introReady) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [introReady]);

  // Hero Entrance & ScrollTrigger Animations (runs exactly once when Home reveals)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!introReady) {
        gsap.set(['.hero-left-stagger', heroRightRef.current], { opacity: 0 });
        return;
      }

      // Staggered Left Hero Reveal
      gsap.fromTo(
        '.hero-left-stagger',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      // Right Hero Logo 3D Entrance
      gsap.fromTo(
        heroRightRef.current,
        { scale: 0.9, opacity: 0, rotateY: 12 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 1.0,
          delay: 0.1,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      // Gentle continuous levitation on the right-side Quest Logo
      gsap.to(logoFloatRef.current, {
        y: -10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Scroll-linked subtle parallax on hero columns (desktop 2-col only so mobile never overlaps)
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        gsap.to(heroRightRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '#quest-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to(heroLeftRef.current, {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: '#quest-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, pageRef);

    return () => ctx.revert();
  }, [introReady]);

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden bg-[#0B0B14] text-white">
      {/* Persistent 3D GLSL Nebula & Edge-Lane Asteroids Canvas */}
      <CosmicBackground3D />

      {/* Subtle ambient cosmic focal glow (clean dark deep-space, zero grid lines) */}
      <div className="quest-hero-bg-glow pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* ==================== HERO SECTION ==================== */}
      <section
        id="quest-hero"
        className="relative z-10 flex min-h-[calc(100dvh-160px)] flex-col justify-between pt-6 pb-0 sm:pt-8"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-8">
            {/* LEFT SIDE: Centered QUEST Title + "A SEARCH WITHIN" Motto + CTAs */}
            <div ref={heroLeftRef} className="lg:col-span-6 flex flex-col items-center text-center">
              <div className="hero-left-stagger mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#1A0F2E]/70 px-3 py-1 backdrop-blur-md sm:mb-5 sm:gap-2.5 sm:px-4 sm:py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2EEED0]" />
                <span className="font-mono-quest text-[10px] font-medium tracking-[0.16em] text-[#CBD5E1] uppercase sm:text-[11px] sm:tracking-[0.22em]">
                  Official Campus Club · SIT
                </span>
              </div>

              <h1 className="hero-left-stagger quest-hero-title text-5xl font-extrabold tracking-[0.06em] sm:text-7xl lg:text-[5.5rem] leading-[0.95]">
                QUEST
              </h1>

              {/* Motto: A SEARCH WITHIN */}
              <div className="hero-left-stagger mt-2.5 flex items-center justify-center gap-2.5 sm:mt-3 sm:gap-3">
                <span
                  className="h-[2px] w-7 rounded-full sm:w-10"
                  style={{ background: 'var(--teal-gradient)' }}
                  aria-hidden="true"
                />
                <p className="font-mono-quest text-xs font-semibold tracking-[0.24em] text-[#A879E6] uppercase sm:text-base sm:tracking-[0.34em]">
                  A SEARCH WITHIN
                </p>
                <span
                  className="h-[2px] w-7 rounded-full sm:w-10"
                  style={{ background: 'var(--teal-gradient)' }}
                  aria-hidden="true"
                />
              </div>

              <p className="hero-left-stagger mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#CBD5E1] sm:mt-6 sm:text-lg">
                Where curiosity meets clarity. QUEST empowers students through
                quizzing, analytical aptitude, and real-world placement readiness —
                turning questions into breakthroughs.
              </p>

              {/* Action Buttons */}
              <div className="hero-left-stagger mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
                <Link
                  to="/events"
                  className="quest-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide text-white sm:gap-2.5 sm:px-6 sm:py-3.5"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/registrations"
                  className="quest-glass-card inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide text-[#CBD5E1] hover:text-white sm:px-6 sm:py-3.5"
                >
                  <span>Register Now</span>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Quest Logo (Rotating 3D Satellite Earth inside Magnifying Glass) */}
            <div
              ref={heroRightRef}
              className="lg:col-span-6 flex flex-col items-center justify-center"
            >
              <div ref={logoFloatRef} className="w-full max-w-[330px] sm:max-w-[460px] lg:max-w-[540px]">
                <QuestLogo3D className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3D CIRCULAR GALLERY: SENIOR REVIEWS ==================== */}
      <SeniorCircularGallery items={SENIOR_REVIEWS} />
    </div>
  );
}
