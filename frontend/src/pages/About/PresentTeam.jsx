import { useMemo, useState, useEffect } from 'react';
import TeamCard from '../../components/TeamCard';
import { getFourthYearTeam, getThirdYearTeam, getSecondYearTeam } from '../../data/teamData';

/**
 * OurTeam Page Component
 *
 * Requirements fulfilled:
 * 1. Header:
 *    - Removed "QUEST COMMUNITY" kicker.
 *    - Removed "Meet the people, explore their talents..." line.
 *    - Removed quick jump navigation section.
 * 2. Fourth Year Section:
 *    - Removed Senior Council, Podium Speaker, Domain Lead, Core Team section headers.
 *    - Layer 1: Podium Speakers (Sharath S Kirasur, Anushka Patil, Rishabh Singh).
 *    - Layer 2: All remaining 19 Fourth Year members in a unified multi-column grid.
 * 3. Buttons for Third & Second Years:
 *    - Navigation buttons (All Years / 3rd Year / 2nd Year) right after the Fourth Year section.
 * 4. Third Year Section:
 *    - Guru Sreekar (1SI24AD016) -> Uday N P (1SI24CS197) -> Akshatha R (1SI24IS004) -> alphabetical continuation.
 * 5. Second Year Section:
 *    - Srimanth Sanisetty (1SI25CS243) -> Shreyas Gowda M (1SI25ET043) -> K C Spoorthi (1SI25IS038) -> H M Greeshma (1SI25IS033) -> Poojitha S (1SI25IS068) -> alphabetical continuation.
 * 6. Cards:
 *    - Mention domains on cards (up to 2 domains per member).
 *    - For Uday: ['VIDEO EDITING', 'WEB DEVELOPMENT'].
 *    - Strict card proportions preserved.
 */
export default function PresentTeam() {
  const fourthYearTeam = useMemo(() => getFourthYearTeam(), []);
  const thirdYearTeam = useMemo(() => getThirdYearTeam(), []);
  const secondYearTeam = useMemo(() => getSecondYearTeam(), []);

  const [activeYearTab, setActiveYearTab] = useState('all');
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

      {/* Main Content Area - Generous top padding reserved for future floating/fixed Navbar */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

        {/* ================= PAGE HERO HEADER ================= */}
        <header className="relative mx-auto mb-14 flex w-full max-w-3xl flex-col items-center text-center">

          {/* Primary Page Heading: Bold, crisp white Outfit display */}
          <h1 className="!m-0 !mb-2 font-['Outfit',sans-serif] text-[clamp(36px,5vw,60px)] font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(130,68,179,0.5)]">
            OUR TEAM
          </h1>

          {/* Supporting Subheading: Space Grotesk */}
          <h2 className="!m-0 font-['Space_Grotesk',sans-serif] text-[clamp(20px,2.8vw,28px)] font-bold text-[#C084FC] tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            The People Behind QUEST
          </h2>

          {/* Decorative Divider with radiant beam */}
          <div className="mt-6 flex items-center justify-center gap-2.5">
            <span className="h-[2px] w-14 bg-gradient-to-r from-transparent to-[#8244B3] rounded-full" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00e5c3] shadow-[0_0_12px_#00e5c3]" />
            <span className="h-[2px] w-14 bg-gradient-to-l from-transparent to-[#8244B3] rounded-full" />
          </div>
        </header>

        {/* ================= TOP SECTION: FOURTH YEAR ================= */}
        <section id="fourth-year" className="relative mb-20 w-full scroll-mt-24">

          {/* Section Header */}
          <div className="relative mb-12 flex flex-col items-center text-center">
            {/* Ambient golden glow behind heading */}
            <div
              className="pointer-events-none absolute -top-10 h-32 w-[420px] max-w-full rounded-full blur-3xl opacity-30 -z-10 bg-[#FBBF24]"
              aria-hidden="true"
            />

            {/* Title */}
            <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(32px,5vw,50px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              FOURTH YEAR
            </h2>

            {/* Subtitle / Council description */}
            <p className="mt-2.5 text-sm sm:text-[14px] text-[#E2E8F0] max-w-xl leading-relaxed font-normal text-center">
              The final year leadership and core council guiding QUEST across all technical domains and events.
            </p>

            {/* Accent glow bar */}
            <div
              className="mt-3.5 h-[2.5px] w-24 rounded-full shadow-[0_0_10px_#FBBF24]"
              style={{
                background: 'linear-gradient(90deg, transparent, #FBBF24, transparent)',
              }}
            />
          </div>

          {/* 1st Layer: PODIUM SPEAKERS (3 cards) */}
          <div className="mx-auto w-full max-w-4xl mb-12">
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

          {/* 2nd Layer: REMAINING MEMBERS (all in one continuous multi-column grid, no subheaders) */}
          <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">
            {fourthYearTeam.remaining.map((member) => (
              <TeamCard
                key={`fourth-year-remaining-${member.usn}`}
                member={member}
                showPosition={true}
              />
            ))}
          </div>
        </section>

        {/* ================= YEAR NAVIGATION BUTTONS (AFTER 4TH YEARS LIST) ================= */}
        <section aria-label="Filter team by year" className="my-16 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[rgba(26,15,46,0.85)] border border-[rgba(180,145,230,0.3)] backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
            <button
              type="button"
              onClick={() => setActiveYearTab('all')}
              className={`px-5 py-2.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeYearTab === 'all'
                  ? 'bg-gradient-to-r from-[#7538B9] via-[#8244B3] to-[#A879E6] text-white shadow-[0_0_20px_rgba(130,68,179,0.5)] border border-[rgba(180,145,230,0.5)] scale-105'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-[rgba(130,68,179,0.25)]'
              }`}
            >
              All Years
            </button>
            <button
              type="button"
              onClick={() => setActiveYearTab('third')}
              className={`px-5 py-2.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeYearTab === 'third'
                  ? 'bg-gradient-to-r from-[#7538B9] via-[#8244B3] to-[#A879E6] text-white shadow-[0_0_20px_rgba(130,68,179,0.5)] border border-[rgba(180,145,230,0.5)] scale-105'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-[rgba(130,68,179,0.25)]'
              }`}
            >
              3rd Year
            </button>
            <button
              type="button"
              onClick={() => setActiveYearTab('second')}
              className={`px-5 py-2.5 rounded-full font-['Space_Grotesk',sans-serif] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeYearTab === 'second'
                  ? 'bg-gradient-to-r from-[#7538B9] via-[#8244B3] to-[#A879E6] text-white shadow-[0_0_20px_rgba(130,68,179,0.5)] border border-[rgba(180,145,230,0.5)] scale-105'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-[rgba(130,68,179,0.25)]'
              }`}
            >
              2nd Year
            </button>
          </div>
        </section>

        {/* ================= THIRD YEAR SECTION ================= */}
        {(activeYearTab === 'all' || activeYearTab === 'third') && (
          <section id="third-year" className="relative mb-24 w-full scroll-mt-24">
            {/* Header */}
            <div className="relative mb-12 flex flex-col items-center text-center">
              <div
                className="pointer-events-none absolute -top-10 h-32 w-[420px] max-w-full rounded-full blur-3xl opacity-30 -z-10 bg-[#A879E6]"
                aria-hidden="true"
              />
              <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(32px,5vw,48px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
                THIRD YEAR
              </h2>
              <div
                className="mt-3.5 h-[2.5px] w-24 rounded-full shadow-[0_0_10px_#A879E6]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #A879E6, transparent)',
                }}
              />
            </div>

            {/* Grid */}
            <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">
              {thirdYearTeam.map((member) => (
                <TeamCard
                  key={`third-year-${member.usn}`}
                  member={member}
                  showPosition={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* ================= SECOND YEAR SECTION ================= */}
        {(activeYearTab === 'all' || activeYearTab === 'second') && (
          <section id="second-year" className="relative mb-24 w-full scroll-mt-24">
            {/* Header */}
            <div className="relative mb-12 flex flex-col items-center text-center">
              <div
                className="pointer-events-none absolute -top-10 h-32 w-[420px] max-w-full rounded-full blur-3xl opacity-30 -z-10 bg-[#00e5c3]"
                aria-hidden="true"
              />
              <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(32px,5vw,48px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
                SECOND YEAR
              </h2>
              <div
                className="mt-3.5 h-[2.5px] w-24 rounded-full shadow-[0_0_10px_#00e5c3]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #00e5c3, transparent)',
                }}
              />
            </div>

            {/* Grid */}
            <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">
              {secondYearTeam.map((member) => (
                <TeamCard
                  key={`second-year-${member.usn}`}
                  member={member}
                  showPosition={false}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Scroll back to top"
          className="fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(30,18,52,0.92)] border border-[rgba(180,145,230,0.45)] text-[#00e5c3] shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#00e5c3] hover:bg-[#8244B3] hover:text-white cursor-pointer"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
