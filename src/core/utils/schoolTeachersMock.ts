/**
 * Mock generator for per-school Teachers & Staffing data
 * Deterministic per schoolId so UI is stable without DB migration.
 * Mirrors reference image counts.
 */

export interface MockTeacher {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  experienceLabel: string;
  gender: 'Male' | 'Female';
  subject: string;
  status: 'Regular' | 'Para';
  source: string;
  date: string;
}

export interface MockTeacherData {
  roster: MockTeacher[];
  qualification: {
    bEdAbove: number;
    gradBEd: number;
    graduation: number;
    others: number;
    belowGrad: number;
    total: number;
  };
  training: {
    trainedThisYear: number;
    total: number;
    percent: number;
    lastProgram: string;
    lastDate: string;
    nextProgram: string;
    nextDate: string;
    hours: number;
  };
  staffing: {
    sanctioned: number;
    filled: number;
    vacant: number;
    paraPosts: number;
    supportStaff: string;
  };
  experienceBuckets: { label: string; count: number }[];
  gender: { female: number; male: number; total: number };
  ratios: { studentTeacher: string; pupilTeacher: string; label: string };
}

const FIRST = ['Ritu', 'Amit', 'Sunita', 'Pawan', 'Rekha', 'Anjali', 'Vikram', 'Suresh', 'Kavita', 'Deepak'];
const LAST = ['Sharma', 'Kumar', 'Yadav', 'Devi', 'Singh', 'Verma', 'Patel', 'Gupta', 'Mishra', 'Ali'];
const DESIGNATIONS = ['Head Teacher', 'Teacher', 'Teacher', 'Teacher', 'Para Teacher'];
const QUALIFICATIONS = ['B.Ed, M.A', 'B.Ed, B.A', 'B.Ed, M.A', 'B.Sc, B.Ed', '12th'];
const SUBJECTS = ['All Subjects (1-5)', 'Hindi, EVS', 'Maths, EVS', 'English, EVS', 'Support Classes'];
const GENDERS: Array<'Female' | 'Male'> = ['Female', 'Male', 'Female', 'Male', 'Female'];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function generateMockTeachers(schoolId: string, seedOverride?: number): MockTeacherData {
  const h = seedOverride ?? hashStr(schoolId);
  // Keep reference counts stable for demo school
  const isNarelaDemo = schoolId.includes('Narela') || h % 7 === 0;

  if (isNarelaDemo) {
    // Exact match to reference image
    const roster: MockTeacher[] = [
      { id: 1, name: 'Ritu Sharma', designation: 'Head Teacher', qualification: 'B.Ed, M.A', experienceYears: 18, experienceLabel: '18 yrs', gender: 'Female', subject: 'All Subjects (1-5)', status: 'Regular', source: 'UDISE+', date: '24 Aug 2026' },
      { id: 2, name: 'Amit Kumar', designation: 'Teacher', qualification: 'B.Ed, B.A', experienceYears: 12, experienceLabel: '12 yrs', gender: 'Male', subject: 'Hindi, EVS', status: 'Regular', source: 'UDISE+', date: '24 Aug 2026' },
      { id: 3, name: 'Sunita Yadav', designation: 'Teacher', qualification: 'B.Ed, M.A', experienceYears: 8, experienceLabel: '8 yrs', gender: 'Female', subject: 'Maths, EVS', status: 'Regular', source: 'UDISE+', date: '24 Aug 2026' },
      { id: 4, name: 'Pawan Kumar', designation: 'Teacher', qualification: 'B.Sc, B.Ed', experienceYears: 6, experienceLabel: '6 yrs', gender: 'Male', subject: 'English, EVS', status: 'Regular', source: 'UDISE+', date: '24 Aug 2026' },
      { id: 5, name: 'Rekha Devi', designation: 'Para Teacher', qualification: '12th', experienceYears: 5, experienceLabel: '5 yrs', gender: 'Female', subject: 'Support Classes', status: 'Para', source: 'UDISE+', date: '24 Aug 2026' },
    ];
    return {
      roster,
      qualification: { bEdAbove: 4, gradBEd: 0, graduation: 1, others: 0, belowGrad: 0, total: 5 },
      training: { trainedThisYear: 3, total: 5, percent: 60, lastProgram: 'ICT in Education', lastDate: 'May 2026', nextProgram: 'Foundational Literacy', nextDate: 'Sep 2026', hours: 14 },
      staffing: { sanctioned: 5, filled: 5, vacant: 0, paraPosts: 1, supportStaff: '1 (Part-time)' },
      experienceBuckets: [
        { label: '0-5 yrs', count: 1 },
        { label: '6-10 yrs', count: 2 },
        { label: '11-20 yrs', count: 2 },
        { label: '20+ yrs', count: 0 },
      ],
      gender: { female: 3, male: 2, total: 5 },
      ratios: { studentTeacher: '31:1', pupilTeacher: '31:1', label: 'Good' },
    };
  }

  // Generic deterministic for other schools — keep totals plausible but varied
  const total = 3 + (h % 5); // 3-7
  const regular = Math.max(2, total - 1);
  const female = Math.floor(total * 0.6);
  const male = total - female;
  const roster: MockTeacher[] = Array.from({ length: total }, (_, i) => {
    const idx = (h + i) % FIRST.length;
    const qualIdx = i % QUALIFICATIONS.length;
    const exp = [4, 7, 12, 18, 5][i % 5] + (h % 3);
    return {
      id: i + 1,
      name: `${FIRST[idx]} ${LAST[(h + i * 3) % LAST.length]}`,
      designation: DESIGNATIONS[i % DESIGNATIONS.length],
      qualification: QUALIFICATIONS[qualIdx],
      experienceYears: exp,
      experienceLabel: `${exp} yrs`,
      gender: GENDERS[i % GENDERS.length],
      subject: SUBJECTS[i % SUBJECTS.length],
      status: i < regular ? 'Regular' : 'Para',
      source: 'UDISE+',
      date: '24 Aug 2026',
    };
  });

  const bEdAbove = Math.floor(total * 0.6);
  const graduation = total - bEdAbove;
  const buckets = [
    { label: '0-5 yrs', count: roster.filter(r => r.experienceYears <= 5).length },
    { label: '6-10 yrs', count: roster.filter(r => r.experienceYears > 5 && r.experienceYears <= 10).length },
    { label: '11-20 yrs', count: roster.filter(r => r.experienceYears > 10 && r.experienceYears <= 20).length },
    { label: '20+ yrs', count: roster.filter(r => r.experienceYears > 20).length },
  ];

  return {
    roster,
    qualification: { bEdAbove, gradBEd: 0, graduation, others: 0, belowGrad: 0, total },
    training: { trainedThisYear: Math.floor(total * 0.6), total, percent: 60, lastProgram: 'ICT in Education', lastDate: 'May 2026', nextProgram: 'Foundational Literacy', nextDate: 'Sep 2026', hours: 12 + (h % 8) },
    staffing: { sanctioned: total, filled: total, vacant: 0, paraPosts: total - regular, supportStaff: '1 (Part-time)' },
    experienceBuckets: buckets,
    gender: { female, male, total },
    ratios: { studentTeacher: '31:1', pupilTeacher: '31:1', label: 'Good' },
  };
}
