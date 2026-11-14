import { useState, useMemo } from 'react';

// Official LinkedIn Blue Brand Icon
function LinkedInIcon() {
  return (
    <svg
      className="w-6 h-6 transition-transform duration-200 group-hover/linkedin:scale-110 drop-shadow-[0_2px_8px_rgba(10,102,194,0.4)]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M6.5 8.5C7.328 8.5 8 7.828 8 7C8 6.172 7.328 5.5 6.5 5.5C5.672 5.5 5 6.172 5 7C5 7.828 5.672 8.5 6.5 8.5ZM5 19H8V10H5V19ZM11 10H13.8V11.3H13.84C14.23 10.56 15.18 9.8 16.64 9.8C19.5 9.8 20 11.68 20 14.14V19H17V14.5C17 13.38 16.98 11.94 15.44 11.94C13.88 11.94 13.64 13.16 13.64 14.42V19H10.64L11 10Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* Dynamic font sizing so text never clips or overflows */
function nameSize(text = '') {
  if (text.length > 24) return 'text-[13px]';
  if (text.length > 18) return 'text-[14.5px]';
  return 'text-[16px]';
}

function branchSize(text = '') {
  if (text.length > 36) return 'text-[11px]';
  if (text.length > 26) return 'text-[12px]';
  return 'text-[13px]';
}

/**
 * TeamCard component
 *
 * Final Deployment Architecture:
 * 1. 100% locally stored and optimized member photographs inside /images_of_team/.
 * 2. Primary format: WebP, uniquely keyed by each member's USN (/images_of_team/{usn}.webp).
 * 3. Fallbacks: Local JPG/PNG by USN or name slug.
 * 4. Graceful cosmic vector avatar only when an image genuinely does not exist.
 * 5. Visual appearance: Identical dimensions, proportions, rounded corners, and hover lift as AlumniCard.
 * 6. Under photo: Member Name, Branch / Department, and LinkedIn link ONLY (no redundant year/sem tags).
 */
export default function TeamCard({ member, showPosition = false }) {
  const usnLower = (member.usn || '').toLowerCase();
  const usnUpper = (member.usn || '').toUpperCase();
  const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cleanName = member.name.toLowerCase().replace(/\s+/g, '-');

  // Candidate local image paths in priority order (WebP by USN first)
  const imageCandidates = useMemo(() => {
    const list = [
      // 1. Primary: Optimized WebP keyed by lowercase USN
      `/images_of_team/${usnLower}.webp`,
      // 2. Optimized WebP keyed by uppercase USN
      `/images_of_team/${usnUpper}.webp`,
      // 3. Fallback: Local JPG/PNG by USN
      `/images_of_team/${usnLower}.jpg`,
      `/images_of_team/${usnUpper}.jpg`,
      `/images_of_team/${usnLower}.png`,
      `/images_of_team/${usnUpper}.png`,
      // 4. Fallback: Local WebP/JPG by name slug
      `/images_of_team/${slug}.webp`,
      `/images_of_team/${slug}.jpg`,
      `/images_of_team/${slug}-${usnLower}.jpg`,
      `/images_of_team/${cleanName}.jpg`,
      `/images_of_team/${cleanName}.webp`,
    ];

    if (member.localPhotoPath && !list.includes(member.localPhotoPath)) {
      list.push(member.localPhotoPath);
    }

    return Array.from(new Set(list));
  }, [member, usnLower, usnUpper, slug, cleanName]);

  const [candidateIdx, setCandidateIdx] = useState(0);
  const [hasAllFailed, setHasAllFailed] = useState(false);

  const handleImageError = () => {
    if (candidateIdx + 1 < imageCandidates.length) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setHasAllFailed(true);
    }
  };

  // Member initials for graceful cosmic fallback avatar
  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-[25px] border border-[rgba(180,145,230,0.18)] bg-[rgba(35,21,58,0.55)] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-[rgba(0,229,195,0.45)] hover:bg-[rgba(50,30,80,0.75)] hover:shadow-[0_14px_40px_rgba(130,68,179,0.35)]">

      {/* Photo Container: aspect-square rounded-[19px] matching AlumniCard */}
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-[19px] bg-[#1a102c] relative border border-white/[0.08] shadow-inner">
        {!hasAllFailed ? (
          <img
            src={imageCandidates[candidateIdx]}
            alt={`${member.name} portrait`}
            loading="lazy"
            onError={handleImageError}
            className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          /* Graceful Cosmic Vector Avatar (rendered only when photo does not exist) */
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#2b1747] via-[#1a102c] to-[#0f091c] p-4 text-center">
            <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(130,68,179,0.25)] border border-[rgba(180,145,230,0.35)] shadow-[0_0_20px_rgba(130,68,179,0.3)]">
              <span className="font-['Space_Grotesk',sans-serif] text-xl font-bold tracking-wider text-white">
                {initials}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#1a102c] bg-[#00e5c3]" />
            </div>
            <span className="font-['Space_Grotesk',sans-serif] text-[10px] font-semibold tracking-wider text-[#A879E6] uppercase">
              QUEST MEMBER
            </span>
          </div>
        )}
      </div>

      {/* Information Container */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5 text-center">

        {/* Name: Bold Space Grotesk, pure white */}
        <div className="flex min-h-[26px] items-center justify-center">
          <h3
            className={`break-words font-['Space_Grotesk',sans-serif] font-bold leading-[1.2] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${nameSize(
              member.name
            )} max-[760px]:!text-[14px] max-[480px]:!text-[13px]`}
          >
            {member.name}
          </h3>
        </div>

        {/* Current Position Tag: Displayed in top section when showPosition is true */}
        {showPosition && member.position && (
          <div className="mt-1.5 flex items-center justify-center">
            <span className="inline-flex items-center rounded-full bg-[rgba(0,229,195,0.12)] border border-[rgba(0,229,195,0.35)] px-3 py-0.5 font-['Space_Grotesk',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#00e5c3] shadow-[0_0_12px_rgba(0,229,195,0.2)]">
              {member.position}
            </span>
          </div>
        )}

        {/* Branch / Department: Bright slate white (E2E8F0), highly legible */}
        <div className="mt-1 flex min-h-[38px] items-center justify-center overflow-hidden">
          <p
            className={`break-words font-['Plus_Jakarta_Sans',sans-serif] font-medium leading-[1.25] text-[#E2E8F0] ${branchSize(
              member.branch
            )} max-[760px]:!text-[11px] max-[480px]:!text-[10px]`}
          >
            {member.branch}
          </p>
        </div>

        {/* LinkedIn: Blue Brand Icon */}
        <div className="mt-auto flex h-10 items-end justify-center pt-2">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${member.name}'s LinkedIn profile`}
              title="View LinkedIn profile"
              className="group/linkedin relative inline-flex items-center justify-center p-1 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            >
              <LinkedInIcon />
            </a>
          ) : (
            <span className="h-6 w-6" aria-hidden="true" />
          )}
        </div>

      </div>
    </article>
  );
}
