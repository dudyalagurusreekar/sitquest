const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'club_members_raw.csv');
const content = fs.readFileSync(csvPath, 'utf8').trim();

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    let row = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuote = !inQuote;
      } else if (c === ',' && !inQuote) {
        row.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    row.push(cur.trim());
    rows.push(row);
  }
  return rows;
}

function cleanLinkedIn(raw) {
  if (!raw) return null;
  const s = raw.trim();
  const lower = s.toLowerCase();
  if (['n/a', 'na', 'none', 'not available', 'nil', 'null', '..', '_', '', 'student'].includes(lower)) return null;
  if (lower.includes('@') && !lower.includes('linkedin.com')) return null;
  if (!lower.includes('linkedin.com') && !lower.includes('linkedin.co')) {
    return null;
  }
  let url = s;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  // Remove tracking params
  url = url.split('?')[0].replace(/\/+$/, '');
  return url;
}

function extractDriveId(url) {
  if (!url) return null;
  const m = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  const m2 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}

// STRICT REQUIREMENT:
// 7th Semester -> Fourth Year (1)
// 5th Semester -> Third Year (2)
// 3rd Semester -> Second Year (3)
// 1st Semester -> First Year (4) -> completely omitted
function normalizeSemester(sem, usn) {
  const s = (sem || '').trim();
  // User explicit instruction: Move Mallikarjun (1SI24EI025) and Shamitha HS (1SI24CS161) to Third Year
  if (usn && (usn.toUpperCase() === '1SI24CS161' || usn.toUpperCase() === '1SI24EI025')) {
    return { semester: '5th Semester', year: 'Third Year', yearOrder: 2 };
  }
  if (s.startsWith('7')) return { semester: '7th Semester', year: 'Fourth Year', yearOrder: 1 };
  if (s.startsWith('5')) return { semester: '5th Semester', year: 'Third Year', yearOrder: 2 };
  if (s.startsWith('3')) return { semester: '3rd Semester', year: 'Second Year', yearOrder: 3 };
  if (s.startsWith('1')) return { semester: '1st Semester', year: 'First Year', yearOrder: 4 };
  return { semester: s, year: 'Other', yearOrder: 5 };
}

function parseDomains(rawDomain) {
  if (!rawDomain) return [];
  const text = rawDomain.toLowerCase();
  const domains = new Set();

  if (text.includes('multimedia')) domains.add('MULTIMEDIA');
  if (text.includes('video') || text.includes('vedio')) domains.add('VIDEO EDITING');
  if (text.includes('data') || text.includes('database')) domains.add('DATABASE');
  if (text.includes('content')) domains.add('CONTENT WRITING');
  if (text.includes('ppt') || text.includes('presentation')) domains.add('PPT');
  if (text.includes('web') || text.includes('development')) domains.add('WEB DEVELOPMENT');

  return Array.from(domains);
}

function cleanBranch(branch) {
  let b = (branch || '').trim();
  const lower = b.toLowerCase();
  if (lower === 'cse' || lower.includes('cse e section')) return 'Computer Science and Engineering';
  if (lower.includes('computer science and engineering') || lower.includes('computer science')) return 'Computer Science and Engineering';
  if (lower === 'ise' || lower.includes('information science')) return 'Information Science and Engineering';
  if (lower.includes('ai & ds') || lower.includes('ai/ds') || lower.includes('ai&ds') || lower.includes('artificial intelligence') || lower === 'ad') {
    return 'Artificial Intelligence & Data Science';
  }
  if (lower.includes('ai-ml') || lower.includes('ci')) return 'CSE (AI & ML)';
  if (lower === 'ece' || lower.includes('electronics and communication')) return 'Electronics & Communication Engineering';
  if (lower.includes('electronic and instrumentation') || lower.includes('electronics and instrumentation') || lower === 'eie' || lower.includes('eie')) {
    return 'Electronics & Instrumentation Engineering';
  }
  if (lower === 'ete' || lower.includes('telecommunication')) return 'Electronics & Telecommunication Engineering';
  if (lower === 'eee') return 'Electrical & Electronics Engineering';
  if (lower.includes('mechanical')) return 'Mechanical Engineering';
  if (lower.includes('biotechnology')) return 'Biotechnology';
  if (lower === 'iem') return 'Industrial Engineering & Management';
  return b;
}

function standardizePosition(pos, usn) {
  const u = (usn || '').toUpperCase();
  if (u === '1SI23IS097') return 'Club Lead';
  if (u === '1SI23EC091') return 'Podium Speaker';
  if (u === '1SI23AD007') return 'Podium Speaker';
  if (u === '1SI23AD005') return 'Video Editing Lead';
  if (u === '1SI23AD032') return 'Multimedia Lead';
  if (u === '1SI23AD059') return 'Content Head';
  if (u === '1SI23EC029') return 'Treasurer';
  if (u === '1SI23CI046') return 'Core Member';
  if (u === '1SI23CS205') return 'Core Member';
  if (u === '1SI23AD024') return 'Core Member';
  if (u === '1SI23AD019') return 'Core Member';
  if (u === '1SI23ME088') return 'Core Member';
  if (u === '1SI24IS409') return 'Social Media Lead';

  if (!pos) return '';
  const p = pos.trim();
  const lower = p.toLowerCase();
  if (['na', 'n/a', 'nil', 'null', 'none', 'student', '_', '4th year', 'member', 'club member', 'vth sem', 'tumkur'].includes(lower)) return '';
  if (lower === 'treasure') return 'Treasurer';
  if (lower === 'podium speaker') return 'Podium Speaker';
  if (lower === 'video editing lead') return 'Video Editing Lead';
  if (lower === 'multimedia lead') return 'Multimedia Lead';
  if (lower === 'content head') return 'Content Head';
  return p;
}

const allRows = parseCSV(content);
const dataRows = allRows.slice(1);

// Map by USN to deduplicate
const membersByUsn = new Map();

dataRows.forEach(r => {
  const timestamp = r[0];
  const name = r[1].trim();
  const rawBranch = r[2].trim();
  const usn = r[3].trim().toUpperCase().replace(/\s+/g, '');
  const semRaw = r[4].trim();
  const rawDomain = r[5].trim();
  const rawLinkedIn = r[6];
  const currentPos = r[7] ? r[7].trim() : '';
  const instaId = r[8] ? r[8].trim() : '';
  const photoUrl = r[9] ? r[9].trim() : '';

  const semInfo = normalizeSemester(semRaw, usn);

  // STRICT REQUIREMENT: REMOVE ALL FIRST YEARS PEOPLE FROM THE PAGE (NONE OF FIRST YEAR SHOULD BE THERE)
  if (semInfo.year === 'First Year' || semRaw.startsWith('1')) {
    return; // Skip first year members entirely
  }

  const domains = parseDomains(rawDomain);
  let linkedIn = cleanLinkedIn(rawLinkedIn);
  if (usn === '1SI25IS038') linkedIn = 'https://www.linkedin.com/in/k-c-spoorthi-005a53393';
  if (usn === '1SI25IS033') linkedIn = 'https://www.linkedin.com/in/h-m-g-234619383';
  if (usn === '1SI24IS409') linkedIn = 'https://www.linkedin.com/in/sanith-hn-9201a2389';
  const driveId = extractDriveId(photoUrl);
  const branch = cleanBranch(rawBranch);
  const finalPos = standardizePosition(currentPos, usn);

  if (!membersByUsn.has(usn)) {
    const usnLower = usn.toLowerCase();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + usnLower;
    const webpFileName = `${usnLower}.webp`;
    const localPhotoPath = `/images_of_team/${webpFileName}`;

    membersByUsn.set(usn, {
      usn,
      name,
      slug,
      branch,
      semester: semInfo.semester,
      academicYear: semInfo.year,
      yearOrder: semInfo.yearOrder,
      domains: new Set(domains),
      linkedin: linkedIn,
      position: finalPos,
      instagram: (instaId && !['NA', 'Nil', 'Null', 'None', '_', 'Na'].includes(instaId)) ? instaId : '',
      photoUrl,
      driveId,
      photoFileName: webpFileName,
      localPhotoPath,
      photoWebp: localPhotoPath,
      driveThumbnailUrl: driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : null,
      lastTimestamp: timestamp,
    });
  } else {
    // Merge
    const existing = membersByUsn.get(usn);
    domains.forEach(d => existing.domains.add(d));
    if (linkedIn) existing.linkedin = linkedIn;
    if (driveId) {
      existing.driveId = driveId;
      existing.photoUrl = photoUrl;
      existing.driveThumbnailUrl = `https://lh3.googleusercontent.com/d/${driveId}`;
    }
    if (finalPos) {
      existing.position = finalPos;
    }
    if (instaId && !['NA', 'Nil', 'Null', 'None', '_', 'Na'].includes(instaId)) {
      existing.instagram = instaId;
    }
    if (name && name.length > existing.name.length) existing.name = name;
    if (branch) existing.branch = branch;
    if (semInfo.yearOrder) {
      existing.academicYear = semInfo.year;
      existing.semester = semInfo.semester;
      existing.yearOrder = semInfo.yearOrder;
    }
    existing.lastTimestamp = timestamp;
  }
});

// EXPLICIT REQUIREMENT:
// Add these members to WEB DEVELOPMENT:
// 1. Guru Sreekar
// 2. Amoghavarsha N
// 3. Rahul P
// 4. Rishabh Singh
// 5. Sharath S Kirasur
// 6. Anjali T M
// 7. Anusha Patil
// 8. H M Greeshma
// 9. K C Spoorthi
// 10. Poojitha S
// 11. Ramyashree H M
// 12. Komal R Aradhya
// (Plus any from form: Aadil Majeed, Monish K C, Srimanth sanisetty, Yashas B K)
const webDevAdditions = [
  'guru sreekar',
  'amoghavarsha n',
  'rahul p',
  'rishabh singh',
  'sharath s kirasur',
  'anjali t m',
  'anusha patil',
  'h m greeshma',
  'k c spoorthi',
  'poojitha s',
  'ramyashree h m',
  'komal r aradhya',
];

function normalizeNameForCompare(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

for (const member of membersByUsn.values()) {
  const norm = normalizeNameForCompare(member.name);
  for (const target of webDevAdditions) {
    if (norm === normalizeNameForCompare(target)) {
      member.domains.add('WEB DEVELOPMENT');
      console.log(`Added ${member.name} (${member.usn}, ${member.academicYear}) to WEB DEVELOPMENT!`);
      break;
    }
  }
}

const membersList = Array.from(membersByUsn.values()).map(m => ({
  ...m,
  domains: Array.from(m.domains).sort(),
}));

// Sort by yearOrder (Fourth Year -> Third Year -> Second Year), then name
membersList.sort((a, b) => {
  if (a.yearOrder !== b.yearOrder) return a.yearOrder - b.yearOrder;
  return a.name.localeCompare(b.name);
});

console.log('Total deduplicated members (Excluding First Years):', membersList.length);

// Count members per domain
const domainCounts = {};
membersList.forEach(m => {
  m.domains.forEach(d => {
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });
});
console.log('Members per domain:', domainCounts);

// Save to teamMembers.json
const jsonPath = path.join(__dirname, 'teamMembers.json');
fs.writeFileSync(jsonPath, JSON.stringify(membersList, null, 2), 'utf8');
console.log('Saved teamMembers.json successfully!');
