import { Link, useInRouterContext } from 'react-router-dom';

/**
 * SafeLink helper component:
 * Renders a React Router <Link> if inside a Router context and destination is an internal route.
 * Otherwise gracefully falls back to a standard anchor <a> tag.
 */
const SafeLink = ({ to, href, children, className, ...rest }) => {
  const inRouter = useInRouterContext();
  const destination = to || href;
  const isInternal = Boolean(destination && destination.startsWith('/') && !destination.startsWith('//'));

  if (inRouter && isInternal) {
    return (
      <Link to={destination} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={destination} className={className} {...rest}>
      {children}
    </a>
  );
};

// ----------------- INLINE SVG SOCIAL & NAVIGATION ICONS -----------------

const InstagramIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    className="w-4 h-4 fill-white"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    className="w-4 h-4 fill-white"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

// Event-specific icons
const FreshersIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#C084FC] shrink-0 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const RecruitmentsIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#C084FC] shrink-0 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const PlacementIQIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#C084FC] shrink-0 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TestSeriesIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#C084FC] shrink-0 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// Diagonal up-right arrow (↗) matching reference
const DiagonalArrowIcon = () => (
  <svg
    className="w-3 h-3 text-[#B580F6] transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const DEFAULT_EVENTS = [
  { name: 'Freshers Day', href: '/events/freshers-day', icon: <FreshersIcon /> },
  { name: 'Recruitments', href: '/recruitments', icon: <RecruitmentsIcon /> },
  { name: 'Placement IQ', href: '/events/placement-iq', icon: <PlacementIQIcon /> },
  { name: 'QUEST Test Series', href: '/events/quest-test-series', icon: <TestSeriesIcon /> },
];

const DEFAULT_SOCIALS = {
  instagram: 'https://www.instagram.com/sit_quest/',
  facebook: 'https://www.facebook.com/SITQUEST',
  email: 'quest.official.sit@gmail.com',
  linkedin: 'https://www.linkedin.com/company/sit-quest/',
};

/**
 * QUEST Website Footer Component
 * 
 * Recreated following exact client requirements:
 * 1. Left side: QUEST Logo at 1.5x size (h-14 sm:h-16 md:h-[72px]), with the text beside it removed.
 * 2. Middle: Our Events with side-by-side interactive glassmorphic rows (icon + event name + arrow snug together).
 * 3. Right: Connect With Us with frosted glass social icon buttons.
 * 4. College illustration removed from right bottom; replaced with matching shining neon beam lighting at bottom-right.
 * 5. Full-width thin divider and centered copyright @2026 All rights are reserved.
 * 6. Pure Tailwind CSS directly in JSX with Flexbox only.
 */
const Footer = ({
  events = DEFAULT_EVENTS,
  socials = DEFAULT_SOCIALS,
  logoSrc = '/quest-logo.png',
  showLogo = true,
  className = '',
}) => {
  const socialList = [
    {
      name: 'Instagram',
      href: socials.instagram,
      icon: <InstagramIcon />,
      title: 'Visit QUEST on Instagram',
      label: 'Instagram',
    },
    {
      name: 'Facebook',
      href: socials.facebook,
      icon: <FacebookIcon />,
      title: 'Visit QUEST on Facebook',
      label: 'Facebook',
    },
    {
      name: 'Email',
      // Directly opens Gmail web composer with quest.official.sit@gmail.com prefilled
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(socials.email)}`,
      icon: <EmailIcon />,
      title: `Send Email via Gmail (${socials.email})`,
      label: 'Gmail',
    },
    {
      name: 'LinkedIn',
      href: socials.linkedin,
      icon: <LinkedInIcon />,
      title: 'Connect with QUEST on LinkedIn',
      label: 'LinkedIn',
    },
  ];

  return (
    <footer
      className={`w-full bg-[#0C0816] text-[#CBD5E1] border-t border-white/[0.08] relative overflow-hidden font-sans select-none ${className}`}
      role="contentinfo"
    >
      {/* ----------------- 100% PURE CODED VECTOR LIGHTING (TOP-LEFT & BOTTOM-RIGHT) ----------------- */}

      {/* 1. Top-Left Shining Neon Beam */}
      <svg
        className="absolute -top-4 -left-4 w-[380px] sm:w-[480px] md:w-[560px] h-[190px] sm:h-[230px] pointer-events-none select-none z-0 overflow-visible"
        viewBox="0 0 560 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="topBeamWideBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" />
          </filter>
          <filter id="topBeamMidBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <filter id="topBeamTightBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
          </filter>

          <linearGradient id="topAuraGrad" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E879F9" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="topCoreGrad" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#F5D0FE" stopOpacity="0.95" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#E9D5FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="topSheetFill" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#581C87" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0C0816" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M -20 180 Q 80 120, 200 65 T 380 -20 L 260 -40 Q 80 50, -40 100 Z"
          fill="url(#topSheetFill)"
          filter="url(#topBeamWideBlur)"
          opacity="0.8"
        />
        <path
          d="M -30 150 Q 80 105, 190 55 T 360 -20"
          stroke="url(#topAuraGrad)"
          strokeWidth="32"
          strokeLinecap="round"
          filter="url(#topBeamWideBlur)"
          opacity="0.85"
        />
        <path
          d="M -30 150 Q 80 105, 190 55 T 360 -20"
          stroke="url(#topCoreGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          filter="url(#topBeamMidBlur)"
          opacity="0.95"
        />
        <path
          d="M -30 150 Q 80 105, 190 55 T 360 -20"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#topBeamTightBlur)"
          opacity="0.95"
        />
      </svg>

      {/* 2. Bottom-Right Shining Neon Beam (Replaces the college photo) */}
      <svg
        className="absolute -bottom-8 -right-8 w-[380px] sm:w-[500px] md:w-[600px] h-[190px] sm:h-[240px] pointer-events-none select-none z-0 overflow-visible"
        viewBox="0 0 600 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="bottomRightWideBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
          <filter id="bottomRightMidBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
          <filter id="bottomRightTightBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
          </filter>

          <linearGradient id="bottomRightAuraGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#A855F7" stopOpacity="0.65" />
            <stop offset="75%" stopColor="#C084FC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2EEED0" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="bottomRightCoreGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#F5D0FE" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="78%" stopColor="#E9D5FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="bottomRightSheetFill" x1="1" y1="1" x2="0.3" y2="0">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#581C87" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0C0816" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M 620 50 Q 520 110, 390 165 T 190 250 L 310 270 Q 510 180, 640 130 Z"
          fill="url(#bottomRightSheetFill)"
          filter="url(#bottomRightWideBlur)"
          opacity="0.85"
        />
        <path
          d="M 630 85 Q 525 130, 400 175 T 210 250"
          stroke="url(#bottomRightAuraGrad)"
          strokeWidth="32"
          strokeLinecap="round"
          filter="url(#bottomRightWideBlur)"
          opacity="0.85"
        />
        <path
          d="M 630 85 Q 525 130, 400 175 T 210 250"
          stroke="url(#bottomRightCoreGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          filter="url(#bottomRightMidBlur)"
          opacity="0.95"
        />
        <path
          d="M 630 85 Q 525 130, 400 175 T 210 250"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#bottomRightTightBlur)"
          opacity="0.95"
        />
      </svg>

      {/* 3. Top-Right Atmospheric Cyan Haze (Pure CSS) */}
      <div
        className="absolute top-0 right-0 w-[360px] h-[180px] pointer-events-none opacity-50 z-0"
        style={{
          background: 'radial-gradient(circle at 90% 10%, rgba(46, 238, 208, 0.1) 0%, rgba(124, 155, 255, 0.03) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ----------------- COMPACT MAIN CONTENT CONTAINER (FLEXBOX ONLY) ----------------- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 pt-9 pb-6">
        
        {/* Three main horizontal sections matching the reference composition */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 lg:gap-12">

          {/* ================= SECTION 1 — LEFT: QUEST BRAND IDENTITY ================= */}
          <div className="flex-1 md:max-w-sm flex flex-col items-start">
            <SafeLink
              to="/"
              className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A879E6] rounded-xl transition-all duration-300"
              aria-label="QUEST - A Search Within Homepage"
            >
              {/* Official QUEST logo at 1.5x size (h-14 sm:h-16 md:h-[72px]) with NO text beside it */}
              {showLogo && logoSrc && (
                <img
                  src={logoSrc}
                  alt="QUEST Logo"
                  className="h-14 sm:h-16 md:h-[72px] w-auto object-contain filter drop-shadow-[0_0_16px_rgba(168,121,230,0.45)] group-hover:drop-shadow-[0_0_24px_rgba(168,121,230,0.7)] shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </SafeLink>

            {/* Description wrapped cleanly */}
            <p className="mt-4 text-xs sm:text-[13px] text-[#CBD5E1] leading-relaxed max-w-[320px] sm:max-w-[340px]">
              A student community to explore opportunities, build skills, and grow together.
            </p>

            {/* Purple horizontal accent line */}
            <div className="h-[2px] w-12 bg-gradient-to-r from-[#A879E6] via-[#8244B3] to-transparent rounded-full mt-3.5" />
          </div>

          {/* Thin, soft vertical separator between Section 1 & Section 2 with gentle fade */}
          <div
            className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/[0.12] to-transparent my-1"
            aria-hidden="true"
          />

          {/* ================= SECTION 2 — MIDDLE: OUR EVENTS (GLASSMORPHISM) ================= */}
          <div className="flex-1 md:max-w-xs flex flex-col items-start">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Our Events
            </h3>
            {/* Sleek purple gradient accent underline matching photo */}
            <div
              className="h-[2.5px] w-7 bg-gradient-to-r from-[#C084FC] via-[#A879E6] to-transparent rounded-full mt-1.5 mb-4"
              aria-hidden="true"
            />

            {/* Glassmorphism Interactive Event Capsules — icon, event name, and arrow all side by side */}
            <nav aria-label="Our Events" className="flex flex-col gap-2.5 items-start">
              {events.map((event) => (
                <SafeLink
                  key={event.name}
                  to={event.href}
                  className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.07] hover:border-[#C084FC]/50 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_16px_rgba(168,121,230,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 w-fit"
                >
                  {/* Small dedicated SVG event icon / emoji */}
                  {event.icon}
                  
                  {/* Event Name */}
                  <span className="text-xs sm:text-[13px] text-[#CBD5E1] group-hover:text-white font-medium transition-colors duration-200 whitespace-nowrap">
                    {event.name}
                  </span>
                  
                  {/* Right-arrow indicator directly side-by-side */}
                  <span className="w-4 h-4 flex items-center justify-center text-[#B580F6] group-hover:text-white transition-all duration-200 shrink-0">
                    <DiagonalArrowIcon />
                  </span>
                </SafeLink>
              ))}
            </nav>
          </div>

          {/* Thin, soft vertical separator between Section 2 & Section 3 with gentle fade */}
          <div
            className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/[0.12] to-transparent my-1"
            aria-hidden="true"
          />

          {/* ================= SECTION 3 — RIGHT: CONNECT WITH US ================= */}
          <div className="flex-1 md:max-w-xs flex flex-col items-start relative z-10" id="contact">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Connect With Us
            </h3>
            {/* Sleek purple gradient accent underline matching photo */}
            <div
              className="h-[2.5px] w-7 bg-gradient-to-r from-[#C084FC] via-[#A879E6] to-transparent rounded-full mt-1.5 mb-4"
              aria-hidden="true"
            />

            {/* Social Icons with Glassmorphism matching reference photo */}
            <div className="flex flex-row items-center gap-3">
              {socialList.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-b from-white/[0.14] via-white/[0.04] to-white/[0.01] backdrop-blur-md border border-white/[0.22] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.25),0_6px_16px_rgba(0,0,0,0.35),0_0_12px_rgba(168,121,230,0.25)] hover:border-white/50 hover:bg-gradient-to-b hover:from-white/[0.22] hover:via-white/[0.08] hover:to-[#C084FC]/[0.18] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_20px_rgba(192,132,252,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
                  aria-label={social.label}
                  title={social.title}
                >
                  <div className="transform transition-transform duration-200 group-hover:scale-110 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* THIN HORIZONTAL DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04] mt-8 mb-4 relative z-10" aria-hidden="true" />

        {/* BOTTOM COPYRIGHT — Exactly centered matching instruction */}
        <div className="flex items-center justify-center text-center py-2 relative z-10">
          <p className="text-xs sm:text-[13px] text-[#A0A2AE] font-normal tracking-wide">
            @2026 All rights are reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
