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
 * Layer 1: SHARATH, ANUSHKA, RISHABH (Top podium speakers in requested order)
 * Layer 2: All remaining 4th year members in the exact requested order
 */
export function getFourthYearTeam() {
  const fourthYears = teamMembers.filter((m) => m.academicYear === 'Fourth Year');

  // Layer 1 targets in exact requested order: Sharath -> Anushka -> Rishabh
  const layer1Usns = ['1SI23IS097', '1SI23AD007', '1SI23EC091'];
  const layer1 = [];

  layer1Usns.forEach((usn) => {
    const found = fourthYears.find((m) => (m.usn || '').toUpperCase() === usn);
    if (found) layer1.push(found);
  });

  // Layer 2: Exact order specified by user
  const layer2UsnOrder = [
    '1SI23EC029', // Darshan (Treasurer)
    '1SI23AD005', // Amoghavarsha N (Video Editing Lead)
    '1SI23EI015', // Dhruthi P (Video Editing Lead)
    '1SI23AD032', // Navya T (Multimedia Lead)
    '1SI23ME088', // Shivakumar (Multimedia Lead)
    '1SI24IS409', // Sanith H N (Social Media Lead)
    '1SI23BT017', // Pavithra (Social Media Lead)
    'QUEST-HARADEEP', // Haradeep Reddy Yeddula (Database Lead)
    'QUEST-VARUN', // Varun (Database Lead)
    '1SI23AD059', // Tanush Datta V (Content Lead)
    '1SI23CS205', // Venkatkarthikeyan (Content Lead)
    '1SI23AD019', // J Chetan Rao (Core Member)
    '1SI23AD024', // Lenkalapelli Arun Subramanyam (Core Member)
    '1SI23CI046', // Sai Venkatesh R N (Core Member)
    'QUEST-PRATHIKSHA', // Prathiksha (Core Member)
    'QUEST-PREENA', // Preena (Core Member)
    'QUEST-SHREEYA', // Shreeya (Core Member)
    'QUEST-TANUSHKA', // Tanushka (Core Member)
    'QUEST-KUSHI', // Kushi (Core Member)
  ];

  const layer2 = [];

  // Add members in exact order
  layer2UsnOrder.forEach((usn) => {
    const found = fourthYears.find((m) => (m.usn || '').toUpperCase() === usn);
    if (found && !layer1.some((l1) => l1.usn === found.usn)) {
      layer2.push(found);
    }
  });

  // Include any remaining fourth year member not explicitly listed (fallback)
  fourthYears.forEach((m) => {
    if (!layer1.some((l1) => l1.usn === m.usn) && !layer2.some((l2) => l2.usn === m.usn)) {
      layer2.push(m);
    }
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
