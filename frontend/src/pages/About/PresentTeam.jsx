import { useMemo, useState, useEffect } from 'react';
import TeamCard from '../../components/TeamCard';
import { getDomainGroups, getFourthYearTeam } from '../../data/teamData';
import { DomainIcon } from '../../components/DomainIcons';

/**
 * OurTeam Page Component
 *
 * Requirements fulfilled:
 * 1. Jump to Section: Placed at the very top right after the page hero header.
 * 2. Top Section Overall:
 *    - All Fourth Year members are placed at the top section overall (#fourth-year).
 *    - Mention each member's current position prominently (Club Lead, Podium Speaker, Leads, Heads, Treasurer, Core Member).
 *    - Layer 1 (Top Triumvirate): SHARATH, RISHABH, ANUSHKA.
 *    - Layer 2: All remaining Fourth Year members in a sleek multi-column grid.
 * 3. Domain-Wise System:
 *    - ALL Fourth Year members are completely removed from domain-wise groupings.
 *    - Domain sections exclusively feature Third Year and Second Year members.
 *    - ZERO First Year members anywhere.
 * 4. Card Styling & Cleanliness:
 *    - Under photos in domain sections: Name, Branch, and LinkedIn only (no semester/year badges or member counts).
 *    - 100% Tailwind CSS classes directly within JSX.
 *    - Integrates the shared QUEST Footer.
 */
export default function PresentTeam() {
  const domainGroups = useMemo(() => getDomainGroups(), []);
  const fourthYearTeam = useMemo(() => getFourthYearTeam(), []);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for year badge styling in domain sections
  const getYearBadgeStyle = (year) => {
    if (year === 'Third Year') {
      return {
        badge: 'border-[rgba(168,121,230,0.45)] bg-[rgba(168,121,230,0.12)] text-[#E9D5FF]',
        dot: 'bg-[#A879E6]',
        line: 'via-[rgba(168,121,230,0.45)]',
      };
    }
    // Second Year
    return {
      badge: 'border-[rgba(46,238,208,0.45)] bg-[rgba(46,238,208,0.12)] text-[#99F6E4]',
      dot: 'bg-[#2EEED0]',
      line: 'via-[rgba(46,238,208,0.45)]',
    };
  };

  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-[#090912] text-white font-['Plus_Jakarta_Sans',sans-serif] scroll-smooth">

      {/* Atmospheric Background Glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(130, 68, 179, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(46, 238, 208, 0.12) 0%, transparent 45%), radial-gradient(circle at 50% 75%, rgba(117, 56, 185, 0.14) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient background geometry */}
      <div
        className="pointer-events-none absolute -left-[240px] top-[260px] -z-10 h-[450px] w-[450px] rounded-full border border-[rgba(168,121,230,0.15)] blur-[1px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[260px] top-[1050px] -z-10 h-[500px] w-[500px] rounded-full border border-[rgba(46,238,208,0.12)] blur-[1px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-[220px] top-[2400px] -z-10 h-[460px] w-[460px] rounded-full border border-[rgba(124,155,255,0.12)] blur-[1px]"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">

        {/* ================= PAGE HERO HEADER ================= */}
        <header className="relative mx-auto mb-12 flex w-full max-w-3xl flex-col items-center text-center">

          {/* Wordmark & Community kicker badge */}
          <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(130,68,179,0.2)] border border-[rgba(180,145,230,0.35)] backdrop-blur-md shadow-[0_0_20px_rgba(130,68,179,0.25)]">
            <span className="h-2 w-2 rounded-full bg-[#00e5c3] shadow-[0_0_8px_#00e5c3] animate-pulse" />
            <span className="font-['Space_Grotesk',sans-serif] text-[11px] font-extrabold tracking-[3.5px] text-[#FFFFFF] uppercase">
              QUEST COMMUNITY
            </span>
          </div>

          {/* Primary Page Heading: Bold, crisp white Outfit display */}
          <h1 className="!m-0 !mb-2 font-['Outfit',sans-serif] text-[clamp(44px,6vw,72px)] font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(130,68,179,0.5)]">
            OUR TEAM
          </h1>

          {/* Supporting Subheading: Space Grotesk */}
          <h2 className="!m-0 !mb-3 font-['Space_Grotesk',sans-serif] text-[clamp(20px,2.8vw,28px)] font-bold text-[#C084FC] tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            The People Behind QUEST
          </h2>

          {/* Description: Plus Jakarta Sans, high-contrast crisp text */}
          <p className="w-full max-w-xl text-center text-sm sm:text-[15px] leading-relaxed text-[#E2E8F0] font-normal">
            Meet the people, explore their talents, and discover the teams that bring QUEST to life.
          </p>

          {/* Decorative Divider with radiant beam */}
          <div className="mt-7 flex items-center justify-center gap-2.5">
            <span className="h-[2px] w-14 bg-gradient-to-r from-transparent to-[#8244B3] rounded-full" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00e5c3] shadow-[0_0_12px_#00e5c3]" />
            <span className="h-[2px] w-14 bg-gradient-to-l from-transparent to-[#8244B3] rounded-full" />
          </div>
        </header>

        {/* ================= QUICK JUMP NAVIGATION AT THE TOP ================= */}
        <section aria-label="Quick section navigation" className="mx-auto mb-16 max-w-4xl">
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[rgba(26,15,46,0.7)] border border-[rgba(180,145,230,0.25)] backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <div className="mb-3 text-center">
              <span className="font-['Space_Grotesk',sans-serif] text-[11px] font-bold tracking-[2.5px] text-[#A879E6] uppercase">
                Jump to Section
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <a
                href="#fourth-year"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-[rgba(43,29,68,0.75)] border border-[rgba(251,191,36,0.35)] text-white hover:text-white hover:border-[#FBBF24] hover:bg-[rgba(55,37,83,0.95)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <span className="h-2 w-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]" />
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[12px] font-bold text-white">
                  FOURTH YEAR
                </span>
              </a>
              {domainGroups.map((group) => {
                const anchor = group.domain.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <a
                    key={group.domain}
                    href={`#${anchor}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-[rgba(43,29,68,0.75)] border border-[rgba(180,145,230,0.28)] text-white hover:text-white hover:border-[#00e5c3] hover:bg-[rgba(55,37,83,0.95)] hover:shadow-[0_0_20px_rgba(0,229,195,0.3)] hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <DomainIcon domain={group.domain} className="w-4 h-4" color={group.info.accent || '#A879E6'} />
                    </span>
                    <span className="font-['Space_Grotesk',sans-serif] text-[12px] font-bold text-white">
                      {group.domain}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= TOP SECTION: FOURTH YEAR OVERALL ================= */}
        <section id="fourth-year" className="relative mb-28 w-full scroll-mt-24">
          {/* Section Header Banner */}
          <div className="relative mb-14 flex flex-col items-center text-center">
            {/* Ambient golden glow behind heading */}
            <div
              className="pointer-events-none absolute -top-10 h-32 w-[420px] max-w-full rounded-full blur-3xl opacity-30 -z-10 bg-[#FBBF24]"
              aria-hidden="true"
            />

            {/* Kicker Tag */}
            <div className="flex items-center justify-center gap-3 w-full max-w-xl mb-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.3)] to-[rgba(251,191,36,0.7)]" />
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black tracking-[2px] text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.35)] uppercase shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <span>SENIOR COUNCIL</span>
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[rgba(251,191,36,0.3)] to-[rgba(251,191,36,0.7)]" />
            </div>

            {/* Title */}
            <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(32px,5vw,50px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              FOURTH YEAR
            </h2>

            {/* Tagline */}
            <p className="mt-2.5 text-sm sm:text-[14px] text-[#E2E8F0] max-w-lg leading-relaxed font-normal text-center">
              The final year leadership and core council guiding QUEST across all technical domains and events.
            </p>

            {/* Accent glow bar */}
            <div
              className="mt-4 h-[2.5px] w-24 rounded-full shadow-[0_0_10px_#FBBF24]"
              style={{
                background: 'linear-gradient(90deg, transparent, #FBBF24, transparent)',
              }}
            />
          </div>

          {/* 1st Tier: PODIUM SPEAKERS */}
          <div className="mx-auto w-full max-w-4xl mb-12">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.35)] to-transparent" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.08)] text-[12px] font-bold text-[#FDE68A] uppercase tracking-wider backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]" />
                <span>PODIUM SPEAKERS</span>
              </div>
              <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-[rgba(251,191,36,0.35)] to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-6 sm:gap-8 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1">
              {fourthYearTeam.podiumSpeakers.map((member) => (
                <TeamCard
                  key={`fourth-year-podium-${member.usn}`}
                  member={member}
                  showPosition={true}
                />
              ))}
            </div>
          </div>

          {/* 2nd Tier: DOMAIN LEADS */}
          <div className="my-10 flex items-center justify-center gap-3">
            <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-[rgba(0,229,195,0.4)] to-transparent" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(0,229,195,0.35)] bg-[rgba(0,229,195,0.08)] text-[12px] font-bold text-[#00e5c3] uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(0,229,195,0.2)]">
              <span className="h-2 w-2 rounded-full bg-[#00e5c3] shadow-[0_0_6px_#00e5c3]" />
              <span>DOMAIN LEADS</span>
            </div>
            <span className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent via-[rgba(0,229,195,0.4)] to-transparent" />
          </div>

          <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3 mb-14">
            {fourthYearTeam.leads.map((member) => (
              <TeamCard
                key={`fourth-year-lead-${member.usn}`}
                member={member}
                showPosition={true}
              />
            ))}
          </div>

          {/* 3rd Tier: CORE TEAM (Who are not leads) */}
          <div className="my-10 flex items-center justify-center gap-3">
            <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-[rgba(180,145,230,0.4)] to-transparent" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(180,145,230,0.35)] bg-[rgba(130,68,179,0.12)] text-[12px] font-bold text-[#C084FC] uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(130,68,179,0.25)]">
              <span className="h-2 w-2 rounded-full bg-[#C084FC] shadow-[0_0_6px_#C084FC]" />
              <span>CORE TEAM</span>
            </div>
            <span className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent via-[rgba(180,145,230,0.4)] to-transparent" />
          </div>

          <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">
            {fourthYearTeam.coreMembers.map((member) => (
              <TeamCard
                key={`fourth-year-core-${member.usn}`}
                member={member}
                showPosition={true}
              />
            ))}
          </div>
        </section>

        {/* ================= DOMAIN-WISE SECTIONS (THIRD & SECOND YEAR ONLY) ================= */}
        <div className="flex flex-col gap-28">
          {domainGroups.map((group) => {
            const domainAnchor = group.domain.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <section
                key={group.domain}
                id={domainAnchor}
                className="relative scroll-mt-24 w-full"
              >
                {/* Domain Header Banner with ambient glow */}
                <div className="relative mb-14 flex flex-col items-center text-center">

                  {/* Subtle radial backdrop behind heading */}
                  <div
                    className="pointer-events-none absolute -top-10 h-32 w-[420px] max-w-full rounded-full blur-3xl opacity-35 -z-10"
                    style={{ backgroundColor: group.info.accent || '#8244B3' }}
                    aria-hidden="true"
                  />

                  {/* Kicker Tag with Vector SVG icon */}
                  <div className="flex items-center justify-center gap-3 w-full max-w-xl mb-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(180,145,230,0.3)] to-[rgba(180,145,230,0.7)]" />
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black tracking-[2px] text-[#00e5c3] bg-[rgba(0,229,195,0.1)] border border-[rgba(0,229,195,0.35)] uppercase shadow-[0_0_15px_rgba(0,229,195,0.2)]">
                      <span><DomainIcon domain={group.domain} className="w-3.5 h-3.5" color="#00e5c3" /></span>
                      <span>DOMAIN</span>
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[rgba(180,145,230,0.3)] to-[rgba(180,145,230,0.7)]" />
                  </div>

                  {/* Exact Domain Title from Excel Sheet: Outfit font */}
                  <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(30px,4.5vw,46px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
                    {group.domain}
                  </h2>

                  {/* Tagline / Subtitle: High-contrast E2E8F0 */}
                  {group.info.tagline && (
                    <p className="mt-2.5 text-sm sm:text-[14px] text-[#E2E8F0] max-w-lg leading-relaxed font-normal">
                      {group.info.tagline}
                    </p>
                  )}

                  {/* Bottom accent glow bar */}
                  <div
                    className="mt-4 h-[2.5px] w-24 rounded-full shadow-[0_0_10px_currentColor]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${group.info.accent || '#00e5c3'}, transparent)`,
                      color: group.info.accent || '#00e5c3',
                    }}
                  />
                </div>

                {/* Academic-Year Subsections within this Domain (Third Year -> Second Year) */}
                <div className="flex flex-col gap-16">
                  {group.years.map((yearGroup) => {
                    const badge = getYearBadgeStyle(yearGroup.year);

                    return (
                      <div key={`${group.domain}-${yearGroup.year}`} className="w-full">

                        {/* Year Subheading Badge: high contrast, zero dim text */}
                        <div className="mb-7 flex items-center justify-center gap-3">
                          <span className={`h-px w-14 sm:w-24 bg-gradient-to-r from-transparent ${badge.line} to-transparent`} />

                          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs sm:text-[13px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md ${badge.badge}`}>
                            <span className={`h-2 w-2 rounded-full ${badge.dot} shadow-[0_0_6px_currentColor]`} />
                            <span className="font-['Space_Grotesk',sans-serif] font-bold">{yearGroup.year}</span>
                          </div>

                          <span className={`h-px w-14 sm:w-24 bg-gradient-to-l from-transparent ${badge.line} to-transparent`} />
                        </div>

                        {/* Member Cards Grid matching Alumni Card proportions 100% */}
                        <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">
                          {yearGroup.members.map((member) => (
                            <TeamCard
                              key={`${group.domain}-${member.usn}`}
                              member={member}
                              showPosition={false}
                            />
                          ))}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </section>
            );
          })}
        </div>

      </main>

      {/* Floating Back to Top Button in Footer-grade vector style */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Scroll back to top"
          className="fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(30,18,52,0.92)] border border-[rgba(180,145,230,0.45)] text-[#00e5c3] shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#00e5c3] hover:bg-[#8244B3] hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
