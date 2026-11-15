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
  if (s === '#') return '#';
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
  const u = (usn || '').toUpperCase();
  // Fourth Years / Senior Council:
  if (u === '1SI24IS409') {
    return { semester: '7th Semester', year: 'Fourth Year', yearOrder: 1 };
  }
  // User explicit instruction: Move Mallikarjun (1SI24EI025) and Shamitha HS (1SI24CS161) to Third Year
  if (u === '1SI24CS161' || u === '1SI24EI025') {
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
  if (lower === 'ece' || lower.includes('electronics and communication') || lower.includes('electronic and communication')) return 'Electronics & Communication Engineering';
  if (lower.includes('electronic and instrumentation') || lower.includes('electronics and instrumentation') || lower.includes('instrumental') || lower.includes('instrumention') || lower === 'eie' || lower.includes('eie')) {
    return 'Electronics & Instrumentation Engineering';
  }
  if (lower === 'ete' || lower.includes('telecommunication') || lower.includes('telecoommunicannal')) return 'Electronics & Telecommunication Engineering';
  if (lower === 'eee' || lower.includes('electrical and electronics') || lower.includes('electrical & electronics') || lower.includes('electnrices')) return 'Electrical & Electronics Engineering';
  if (lower.includes('mechanical')) return 'Mechanical Engineering';
  if (lower.includes('biotechnology')) return 'Biotechnology';
  if (lower === 'iem') return 'Industrial Engineering & Management';
  return b;
}

function standardizePosition(pos, usn) {
  const u = (usn || '').toUpperCase();
  if (u === '1SI23IS097') return 'Podium Speaker'; // User instruction: Sharath changed from Club Lead to Podium Speaker
  if (u === '1SI23EC091') return 'Podium Speaker'; // Rishabh
  if (u === '1SI23AD007') return 'Podium Speaker'; // Anushka
  if (u === '1SI23EC029') return 'Treasurer'; // Darshan
  if (u === '1SI23AD005') return 'Video Editing Lead'; // Amoghavarsha N
  if (u === '1SI23EI015') return 'Video Editing Lead'; // Dhruthi P
  if (u === '1SI23AD032') return 'Multimedia Lead'; // Navya T
  if (u === '1SI23ME088') return 'Multimedia Lead'; // Shivakumar
  if (u === '1SI24IS409') return 'Social Media Lead'; // Sanith H N
  if (u === '1SI23BT017') return 'Social Media Lead'; // Pavithra
  if (u === 'QUEST-HARADEEP') return 'Database Lead'; // Haradeep Reddy Yeddula
  if (u === '1SI23EI061' || u === 'QUEST-VARUN') return 'Database Lead'; // Varun N V
  if (u === '1SI23AD059') return 'Content Lead'; // Tanush Datta V
  if (u === '1SI23CS205') return 'Content Lead'; // Venkatkarthikeyan
  if (u === '1SI23CI046') return 'Core Member'; // Sai Venkatesh R N
  if (u === '1SI23AD024') return 'Core Member'; // Lenkalapelli Arun Subramanyam
  if (u === '1SI23AD019') return 'Core Member'; // J Chetan Rao
  if (u === 'QUEST-PRATHIKSHA') return 'Core Member';
  if (u === '1SI23ET039' || u === 'QUEST-PREENA') return 'Core Member'; // Prerana Rathore
  if (u === '1SI23AD047' || u === 'QUEST-SHREEYA') return 'Core Member'; // Shreya S
  if (u === '1SI23CS182' || u === 'QUEST-TANUSHKA') return 'Core Member'; // Tanushka
  if (u === '1SI23EE021' || u === 'QUEST-KUSHI') return 'Core Member'; // Khushi A

  if (!pos) return '';
  const p = pos.trim();
  const lower = p.toLowerCase();
  if (['na', 'n/a', 'nil', 'null', 'none', 'student', '_', '4th year', 'member', 'club member', 'vth sem', 'tumkur'].includes(lower)) return '';
  if (lower === 'treasure' || lower === 'treasurer') return 'Treasurer';
  if (lower === 'podium speaker') return 'Podium Speaker';
  if (lower.includes('video editing lead') || lower.includes('vedio editing lead')) return 'Video Editing Lead';
  if (lower.includes('multimedia lead')) return 'Multimedia Lead';
  if (lower.includes('social media lead')) return 'Social Media Lead';
  if (lower.includes('database lead')) return 'Database Lead';
  if (lower.includes('content lead') || lower.includes('content head')) return 'Content Lead';
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
  if (usn === '1SI23EI015') linkedIn = 'https://www.linkedin.com/in/dhruthi1';
  if (usn === '1SI23BT017') linkedIn = 'https://www.linkedin.com/in/pavithra-m-venkatesh-a39760432';
  if (usn === '1SI23AD024') linkedIn = 'https://www.linkedin.com/in/arun-subramanyam-lenkalapelli-a480412a5';
  if (usn === 'QUEST-HARADEEP') linkedIn = 'https://www.linkedin.com/in/haradeep-reddy-yeddula-52033729a';
  if (usn === '1SI23CS182') linkedIn = 'https://www.linkedin.com/in/tanushka-rani-521506342';
  if (usn === '1SI23EI061') linkedIn = 'https://www.linkedin.com/in/varun-n-v-a92a702b3';
  if (usn === '1SI23ET039') linkedIn = 'https://www.linkedin.com/in/prerana-rathore-449427326';
  if (usn === '1SI23AD047') linkedIn = 'https://www.linkedin.com/in/shreya-s-682723354';
  if (usn === 'QUEST-PRATHIKSHA') linkedIn = 'https://www.linkedin.com/in/prathiksha-siddartha-b418aa356';
  if (usn === 'QUEST-VARUN') linkedIn = '#';
  if (['QUEST-PRATHIKSHA', 'QUEST-PREENA', 'QUEST-SHREEYA', 'QUEST-TANUSHKA', 'QUEST-KUSHI', '1SI23EE021'].includes(usn) && !linkedIn) {
    linkedIn = '#';
  }
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
