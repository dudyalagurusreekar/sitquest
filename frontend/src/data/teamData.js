import teamMembers from './teamMembers.json';

export const DOMAINS = [
  'MULTIMEDIA',
  'VIDEO EDITING',
  'DATABASE',
  'CONTENT WRITING',
  'PPT',
  'WEB DEVELOPMENT',
];

// STRICT USER REQUIREMENT:
// Fourth Years are housed at the top overall section.
// Domain-wise sections only include Third Year and Second Year (Zero First Years).
export const DOMAIN_ACADEMIC_YEARS = [
  'Third Year',
  'Second Year',
];

export const DOMAIN_INFO = {
  MULTIMEDIA: {
    tagline: 'Designing visual identity, posters, branding and digital art for QUEST.',
    accent: '#A879E6',
  },
  'VIDEO EDITING': {
    tagline: 'Crafting cinematic edits, reels, teasers and event coverage.',
    accent: '#2EEED0',
  },
  DATABASE: {
    tagline: 'Managing student records, registrations, aptitude tests and analytics.',
    accent: '#7C9BFF',
  },
  'CONTENT WRITING': {
    tagline: 'Articulating stories, official communications, captions and technical docs.',
    accent: '#F472B6',
  },
  PPT: {
    tagline: 'Building high-impact slide decks, pitch presentations and keynote designs.',
    accent: '#FBBF24',
  },
  'WEB DEVELOPMENT': {
    tagline: 'Developing, optimizing and maintaining the QUEST web platform.',
    accent: '#34D399',
  },
};

/**
 * Returns 4th Year Team separated into two layers:
 * Layer 1: SHARATH, RISHABH, ANUSHKA (Top triumvirate / podium speakers / lead)
 * Layer 2: All remaining 4th year members
 */
export function getFourthYearTeam() {
  const fourthYears = teamMembers.filter((m) => m.academicYear === 'Fourth Year');

  // Layer 1 targets in exact requested order: Sharath, Rishabh, Anushka
  const layer1Targets = ['sharath s kirasur', 'rishabh singh', 'anushka patil'];
  const layer1 = [];
  const layer2 = [];

  layer1Targets.forEach((target) => {
    const normTarget = target.replace(/[^a-z]/g, '');
    const found = fourthYears.find(
      (m) => m.name.toLowerCase().replace(/[^a-z]/g, '') === normTarget
    );
    if (found) layer1.push(found);
  });

  // Layer 2: All remaining fourth year members
  fourthYears.forEach((m) => {
    if (!layer1.some((l1) => l1.usn === m.usn)) {
      layer2.push(m);
    }
  });

  // Sort Layer 2: Domain Leads/Heads/Treasurer first, then alphabetical
  layer2.sort((a, b) => {
    const isSpecial = (pos = '') => {
      const p = pos.toLowerCase();
      if (p.includes('lead') || p.includes('head') || p.includes('treasurer')) return 1;
      return 2;
    };
    const diff = isSpecial(a.position) - isSpecial(b.position);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });

  return { layer1, layer2 };
}

/**
 * Returns domain-grouped structure strictly for Third Year and Second Year:
 * Fourth Years are completely removed from domain-wise groupings.
 * First Years are completely omitted.
 */
export function getDomainGroups() {
  return DOMAINS.map((domain) => {
    const domainMembers = teamMembers.filter(
      (m) =>
        m.domains.includes(domain) &&
        m.academicYear !== 'Fourth Year' &&
        m.academicYear !== 'First Year' &&
        !m.semester.startsWith('1')
    );

    const years = DOMAIN_ACADEMIC_YEARS.map((year) => {
      const yearMembers = domainMembers.filter((m) => m.academicYear === year);

      // USER REQUIREMENT:
      // Keep GURU SREEKAR (1SI24AD016) at FIRST in his domain/section (Third Year)
      // Keep SRIMATH SANISETTY (1SI25CS243) at FIRST in his domain/section (Second Year)
      yearMembers.sort((a, b) => {
        const getPriority = (m) => {
          const u = (m.usn || '').toUpperCase();
          if (u === '1SI24AD016') return 0; // Guru Sreekar first
          if (u === '1SI25CS243') return 0; // Srimanth sanisetty first
          return 1;
        };
        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pA - pB;
        return a.name.localeCompare(b.name);
      });

      return {
        year,
        members: yearMembers,
      };
    }).filter((y) => y.members.length > 0); // Omit empty academic year subsections

    return {
      domain,
      info: DOMAIN_INFO[domain] || {},
      totalCount: domainMembers.length,
      years,
    };
  }).filter((group) => group.years.length > 0);
}

export default teamMembers;
