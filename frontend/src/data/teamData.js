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
 * Returns 4th Year Team separated into three tiers:
 * 1. Podium Speakers (Top tier: Sharath, Anushka, Rishabh)
 * 2. Leads (Domain Leads & Treasurer: Darshan, Amoghavarsha, Dhruthi, Navya, Shivakumar, Sanith, Pavithra, Haradeep, Varun, Tanush, Venkatkarthikeyan)
 * 3. Core Members (Members who are not leads: J Chetan Rao, Lenkalapelli Arun Subramanyam, Sai Venkatesh R N, Prathiksha, Preena, Shreeya, Tanushka, Kushi)
 */
export function getFourthYearTeam() {
  const fourthYears = teamMembers.filter((m) => m.academicYear === 'Fourth Year');

  // Tier 1: Podium Speakers in requested order (Sharath -> Anushka -> Rishabh)
  const podiumSpeakerUsns = ['1SI23IS097', '1SI23AD007', '1SI23EC091'];
  const podiumSpeakers = [];

  podiumSpeakerUsns.forEach((usn) => {
    const found = fourthYears.find((m) => (m.usn || '').toUpperCase() === usn);
    if (found) podiumSpeakers.push(found);
  });

  // Tier 2: Domain Leads & Executive Council in exact requested order
  const leadUsnOrder = [
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
  ];

  const leads = [];
  leadUsnOrder.forEach((usn) => {
    const found = fourthYears.find((m) => (m.usn || '').toUpperCase() === usn);
    if (found && !podiumSpeakers.some((p) => p.usn === found.usn)) {
      leads.push(found);
    }
  });

  // Tier 3: Core Members (who are not leads) in exact requested order
  const coreUsnOrder = [
    '1SI23AD019', // J Chetan Rao (Core Member)
    '1SI23AD024', // Lenkalapelli Arun Subramanyam (Core Member)
    '1SI23CI046', // Sai Venkatesh R N (Core Member)
    'QUEST-PRATHIKSHA', // Prathiksha (Core Member)
    'QUEST-PREENA', // Preena (Core Member)
    'QUEST-SHREEYA', // Shreeya (Core Member)
    'QUEST-TANUSHKA', // Tanushka (Core Member)
    'QUEST-KUSHI', // Kushi (Core Member)
  ];

  const coreMembers = [];
  coreUsnOrder.forEach((usn) => {
    const found = fourthYears.find((m) => (m.usn || '').toUpperCase() === usn);
    if (
      found &&
      !podiumSpeakers.some((p) => p.usn === found.usn) &&
      !leads.some((l) => l.usn === found.usn)
    ) {
      coreMembers.push(found);
    }
  });

  // Include any remaining fourth year member not explicitly listed (fallback to core)
  fourthYears.forEach((m) => {
    if (
      !podiumSpeakers.some((p) => p.usn === m.usn) &&
      !leads.some((l) => l.usn === m.usn) &&
      !coreMembers.some((c) => c.usn === m.usn)
    ) {
      coreMembers.push(m);
    }
  });

  return {
    podiumSpeakers,
    leads,
    coreMembers,
    layer1: podiumSpeakers,
    layer2: [...leads, ...coreMembers],
  };
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
