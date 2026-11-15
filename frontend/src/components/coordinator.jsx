import { useState } from 'react';

/**
 * Faculty Coordinators Data
 * Self-contained dataset ensuring standalone portability across branches and repositories
 */
const FACULTY_COORDINATORS = [
  {
    name: 'Dr. J P Ganjigatti',
    role: 'Faculty Coordinator',
    designation: 'Professor',
    tenure: '2001 – 2026',
    department: 'Professor',
    linkedin: 'https://www.linkedin.com/in/dr-jagadeesh-ganjigatti-a769a368/',
    photoWebp: '/images_of_team/dr-j-p-ganjigatti.webp',
    photoJpg: '/images_of_team/dr-j-p-ganjigatti.jpg',
  },
  {
    name: 'Dr. Pramod T C',
    role: 'Faculty Coordinator',
    designation: 'Associate Professor',
    tenure: '2026 – Present',
    department: 'Associate Professor',
    linkedin: 'https://www.linkedin.com/in/pramod-s-s-268abb331/',
    photoWebp: '/images_of_team/dr-pramod-t-c.webp',
    photoJpg: '/images_of_team/dr-pramod-t-c.jpg',
  },
];

/**
 * Single Faculty Card Component
 */
function FacultyCard({ faculty }) {
  const [imgSrc, setImgSrc] = useState(faculty.photoWebp);

  const handleImageError = () => {
    if (imgSrc !== faculty.photoJpg) {
      setImgSrc(faculty.photoJpg);
    }
  };

  return (
    <article className="coordinator-card group relative flex h-full min-w-0 flex-col rounded-[18px] md:rounded-[22px] border border-[rgba(180,145,230,0.22)] bg-[rgba(35,21,58,0.55)] p-2.5 sm:p-3 md:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.2)] md:shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1.5 md:hover:-translate-y-2 hover:border-[#FBBF24]/60 hover:bg-[rgba(48,28,78,0.85)] hover:shadow-[0_10px_28px_rgba(251,191,36,0.25)] md:hover:shadow-[0_14px_40px_rgba(251,191,36,0.25)]">
      {/* Subtle top edge glow beam in gold */}
      <div
        className="pointer-events-none absolute -top-px left-4 right-4 md:left-6 md:right-6 h-[1.5px] md:h-[2px] rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, #FBBF24, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Photo Container: aspect-square rounded */}
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-[13px] md:rounded-[17px] bg-[#1a102c] relative border border-white/[0.08] shadow-inner transition-colors duration-300 group-hover:border-white/[0.2]">
        <img
          src={imgSrc}
          alt={`${faculty.name} portrait`}
          onError={handleImageError}
          loading="lazy"
          className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>

      {/* Information Container */}
      <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-2 md:pt-3 text-center">
        {/* Name */}
        <div className="flex min-h-[22px] md:min-h-[26px] items-center justify-center">
          <h3 className="break-words font-['Space_Grotesk',sans-serif] font-bold text-[13px] sm:text-[14px] md:text-[16px] leading-[1.2] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {faculty.name}
          </h3>
        </div>

        {/* Designation Pill Badge: PROFESSOR / ASSOCIATE PROFESSOR */}
        <div className="mt-1 md:mt-1.5 flex items-center justify-center">
          <span className="inline-flex items-center rounded-full bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.35)] px-2 sm:px-2.5 md:px-3 py-0.5 font-['Space_Grotesk',sans-serif] text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.2)]">
            {faculty.designation}
          </span>
        </div>

        {/* Role & Tenure: Faculty Coordinator */}
        <div className="mt-1.5 md:mt-2 flex flex-col items-center justify-center">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11.5px] sm:text-[12px] md:text-[13.5px] leading-[1.25] text-[#E2E8F0]">
            {faculty.role}
          </p>
          <p className="font-['Space_Grotesk',sans-serif] text-[10.5px] sm:text-[11px] md:text-[12px] font-bold text-[#A879E6] tracking-wider mt-0.5">
            {faculty.tenure}
          </p>
        </div>

        {/* LinkedIn Button: Official Blue Brand */}
        <div className="mt-auto flex h-8 md:h-10 items-end justify-center pt-1 md:pt-2">
          <a
            href={faculty.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${faculty.name}'s LinkedIn profile`}
            title="View LinkedIn profile"
            className="group/linkedin relative inline-flex items-center justify-center p-0.5 md:p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover/linkedin:scale-110 drop-shadow-[0_2px_6px_rgba(10,102,194,0.4)]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect width="24" height="24" rx="4" fill="#0A66C2" />
              <path
                d="M6.5 8.5C7.328 8.5 8 7.828 8 7C8 6.172 7.328 5.5 6.5 5.5C5.672 5.5 5 6.172 5 7C5 7.828 5.672 8.5 6.5 8.5ZM5 19H8V10H5V19ZM11 10H13.8V11.3H13.84C14.23 10.56 15.18 9.8 16.64 9.8C19.5 9.8 20 11.68 20 14.14V19H17V14.5C17 13.38 16.98 11.94 15.44 11.94C13.88 11.94 13.64 13.16 13.64 14.42V19H10.64L11 10Z"
                fill="#FFFFFF"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Coordinator Component
 * Fully self-contained component and styles for Faculty Coordinators section
 */
export default function Coordinator({ className = '' }) {
  return (
    <section
      id="faculty-coordinators"
      className={`relative w-full scroll-mt-24 ${className}`}
    >
      {/* Self-contained CSS styles for fonts and effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@600;700&display=swap');

        .coordinator-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* Section Header */}
      <div className="relative mb-6 sm:mb-8 flex flex-col items-center text-center">
        {/* Ambient golden glow behind heading */}
        <div
          className="pointer-events-none absolute -top-8 h-24 w-80 max-w-full rounded-full blur-2xl opacity-25 -z-10 bg-[#FBBF24]"
          aria-hidden="true"
        />

        {/* Title */}
        <h2 className="!m-0 font-['Outfit',sans-serif] text-[clamp(22px,3.2vw,32px)] font-black text-white tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
          FACULTY COORDINATORS
        </h2>

        {/* Accent glow bar */}
        <div
          className="mt-2.5 h-[2px] w-16 sm:w-20 rounded-full shadow-[0_0_8px_#FBBF24]"
          style={{
            background: 'linear-gradient(90deg, transparent, #FBBF24, transparent)',
          }}
        />
      </div>

      {/* Faculty Cards Grid */}
      <div className="mx-auto w-full max-w-[400px] sm:max-w-[440px] md:max-w-[580px]">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:gap-7">
          {FACULTY_COORDINATORS.map((faculty) => (
            <FacultyCard key={faculty.name} faculty={faculty} />
          ))}
        </div>
      </div>
    </section>
  );
}
