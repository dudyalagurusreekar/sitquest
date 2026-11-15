import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  Brain,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import BorderBeam from '../../components/BorderBeam';
import CosmicBackground3D from '../../components/CosmicBackground3D';
import QuestLogo3D from '../../components/QuestLogo3D';
import SeniorCircularGallery from '../../components/SeniorCircularGallery';
import { SENIOR_REVIEWS } from '../../data/seniorsReviews';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    icon: Compass,
    tag: 'DISCOVERY',
    title: 'Quizzing & Curiosity',
    description:
      'High-energy quiz formats, lateral-thinking rounds, and knowledge sprints that reward sharp observation beyond textbooks.',
    accent: 'text-[#A879E6]',
  },
  {
    icon: Brain,
    tag: 'PRECISION',
    title: 'Analytical & Aptitude Edge',
    description:
      'Structured problem-solving, quantitative reasoning, and timed challenges engineered to sharpen clarity under pressure.',
    accent: 'text-[#2EEED0]',
  },
  {
    icon: Users,
    tag: 'COMMUNITY',
    title: 'Mentorship & Campus Culture',
    description:
      'A collaborative student ecosystem connecting curious minds, club seniors, and accomplished alumni across batches.',
    accent: 'text-[#7C9BFF]',
  },
];

const FLAGSHIP_EVENTS = [
  {
    icon: Sparkles,
    badge: 'ONBOARDING',
    title: 'Freshers Day',
    description:
      'Welcoming incoming batches with interactive icebreakers, rapid-fire trivia, and an introduction to QUEST culture.',
    to: '/events',
  },
  {
    icon: Layers,
    badge: 'JOIN THE TEAM',
    title: 'Recruitments',
    description:
      'Our annual talent hunt for curious thinkers, organizers, and creators ready to shape the next chapter of QUEST.',
    to: '/registrations',
  },
  {
    icon: GraduationCap,
    badge: 'CAREER PREP',
    title: 'Placement IQ',
    description:
      'Focused aptitude, logical reasoning, and interview-readiness workshops crafted with insights from placed seniors.',
    to: '/events',
  },
  {
    icon: Trophy,
    badge: 'ASSESSMENTS',
    title: 'QUEST Test Series',
    description:
      'Competitive simulated assessments that benchmark problem-solving speed, accuracy, and analytical confidence.',
    to: '/events',
  },
];

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

      // Section heading scroll reveals
      gsap.utils.toArray('.section-heading-reveal').forEach((heading) => {
        gsap.from(heading, {
          y: 22,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: heading,
            start: 'top 86%',
            once: true,
          },
        });
      });

      // Pillars 3D depth card cascade + top-to-bottom specular shine sweep
      gsap.from('.pillar-card', {
        y: 44,
        opacity: 0,
        rotateX: 11,
        scale: 0.94,
        transformPerspective: 1000,
        transformOrigin: 'center top',
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '#quest-pillars',
          start: 'top 82%',
          once: true,
        },
      });

      gsap.fromTo(
        '.pillar-shine',
        { top: '-100%', opacity: 0 },
        {
          top: '130%',
          opacity: 1,
          duration: 1.05,
          stagger: 0.18,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '#quest-pillars',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Events 3D depth card cascade + top-to-bottom specular shine sweep
      gsap.from('.event-card', {
        y: 40,
        opacity: 0,
        rotateX: 10,
        scale: 0.95,
        transformPerspective: 1000,
        transformOrigin: 'center top',
        duration: 0.8,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '#quest-events',
          start: 'top 82%',
          once: true,
        },
      });

      gsap.fromTo(
        '.event-shine',
        { top: '-100%', opacity: 0 },
        {
          top: '130%',
          opacity: 1,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '#quest-events',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Launchpad CTA depth reveal + specular sweep
      gsap.from('.cta-panel', {
        y: 36,
        opacity: 0,
        scale: 0.96,
        rotateX: 7,
        transformPerspective: 1100,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '#quest-cta',
          start: 'top 84%',
          once: true,
        },
      });

      gsap.fromTo(
        '.cta-shine',
        { top: '-100%', opacity: 0 },
        {
          top: '130%',
          opacity: 0.85,
          duration: 1.15,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '#quest-cta',
            start: 'top 82%',
            once: true,
          },
        }
      );

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
        className="relative z-10 flex min-h-dvh flex-col justify-between pt-16 pb-0 sm:pt-20"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
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

      {/* ==================== PILLARS SECTION ==================== */}
      <section id="quest-pillars" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="section-heading-reveal mb-10 max-w-2xl sm:mb-14">
          <p className="font-mono-quest text-xs font-semibold tracking-[0.26em] text-[#A879E6] uppercase">
            Why QUEST Exists
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for minds that refuse to stop{' '}
            <span className="text-[#A879E6]">exploring.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
            Every session, quiz, and test series is designed to cultivate sharp
            thinking, poise, and intellectual curiosity across campus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="pillar-card quest-glass-card group relative overflow-hidden rounded-2xl p-6 hover:-translate-y-1.5 sm:p-7"
              >
                <BorderBeam duration={7} delay={idx * 1.6} borderWidth={1.25} />
                <span className="pillar-shine quest-top-shine" aria-hidden="true" />
                <div className="relative z-10 mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1A0F2E]">
                    <Icon className={`h-5 w-5 ${pillar.accent}`} />
                  </div>
                  <span className="font-mono-quest text-[10px] font-semibold tracking-[0.22em] text-[#94A3B8]">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="relative z-10 text-lg font-bold text-white transition-colors group-hover:text-[#A879E6]">
                  {pillar.title}
                </h3>
                <p className="relative z-10 mt-2.5 text-sm leading-relaxed text-[#CBD5E1]">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ==================== FLAGSHIP EVENTS SECTION ==================== */}
      <section id="quest-events" className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="section-heading-reveal mb-10 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-quest text-xs font-semibold tracking-[0.26em] text-[#2EEED0] uppercase">
              Signature Initiatives
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Experiences That Define <span className="text-[#A879E6]">QUEST</span>
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A879E6] transition-colors hover:text-white"
          >
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FLAGSHIP_EVENTS.map((ev, idx) => {
            const Icon = ev.icon;
            return (
              <Link
                key={ev.title}
                to={ev.to}
                className="event-card quest-glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 hover:-translate-y-1.5"
              >
                <BorderBeam
                  duration={5.5}
                  delay={idx * 1.1}
                  borderWidth={1.25}
                  className="opacity-45 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="event-shine quest-top-shine" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#A879E6]/25 bg-[#1A0F2E]">
                      <Icon className="h-5 w-5 text-[#A879E6] transition-colors group-hover:text-[#2EEED0]" />
                    </span>
                    <span className="font-mono-quest rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] tracking-[0.16em] text-[#94A3B8]">
                      {ev.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#A879E6]">
                    {ev.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                    {ev.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A879E6] group-hover:text-white">
                  <span>Discover more</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ==================== CTA LAUNCHPAD SECTION ==================== */}
      <section id="quest-cta" className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
        <div className="cta-panel quest-glass relative overflow-hidden rounded-3xl px-5 py-9 sm:px-12 sm:py-16">
          <BorderBeam duration={8} borderWidth={1.5} />
          <span className="cta-shine quest-top-shine" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'rgba(130, 68, 179, 0.28)' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: 'rgba(46, 238, 208, 0.1)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="font-mono-quest text-xs font-semibold tracking-[0.26em] text-[#2EEED0] uppercase">
                Start Your Journey
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Ready to begin your <span className="text-[#A879E6]">search within?</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
                Join upcoming QUEST events, connect with our present team, or
                explore the alumni network shaping industries worldwide.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/registrations"
                className="quest-btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white"
              >
                <span>Join QUEST</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="quest-glass-card inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[#CBD5E1] hover:text-white"
              >
                <span>Meet the Team</span>
              </Link>
              <Link
                to="/alumni"
                className="quest-glass-card inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[#CBD5E1] hover:text-white"
              >
                <span>Alumni</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
