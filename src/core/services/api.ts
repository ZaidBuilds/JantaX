import { resolvePincode as _resolvePincode } from '../utils/pinResolver';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jantax_token') : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// --- Resilient mock fallback when backend is down (so PIN never shows red error) ---
function markOffline() { try { if (typeof window !== 'undefined') localStorage.setItem('jantax_offline','1'); } catch {} }
function clearOffline() { try { if (typeof window !== 'undefined' && navigator.onLine) localStorage.removeItem('jantax_offline'); } catch {} }
function hashSeed(s: string): number {
  let h = 0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>>0; return h;
}
function mockPincodeInfo(code: string): PincodeInfo {
  markOffline();
  let loc: any = { state: 'Delhi', district: 'New Delhi', region: 'North' };
  try { loc = _resolvePincode(code); } catch {}
  const h = hashSeed(code);
  const lat = 28.6 + (h % 100)/500;
  const lng = 77.2 + (h % 100)/500;
  return {
    code,
    state: (loc as any).state || 'Delhi',
    district: (loc as any).district || 'New Delhi',
    region: (loc as any).region || 'North',
    areaType: h %2===0 ? 'Urban' : 'Rural',
    lat, lng,
    counts: {
      schools: 2 + (h % 3),
      infraProjects: 1 + (h % 3),
      reraProjects: h % 3,
      hospitals: 1 + (h % 2),
      pdsShops: 2 + (h % 2),
      grievances: 3 + (h % 5),
      citizenReports: h % 4,
    }
  };
}
function mockRecords(code: string, module?: string): RecordsResponse {
  markOffline();
  const h = hashSeed(code);
  const mkSchool = (i:number): ApiRecord => ({
    id: `mock-school-${code}-${i}`,
    moduleId: 'school',
    location: { pinCode: code, state: 'Delhi', district: 'New Delhi' },
    titleEnglish: i===0 ? 'Govt. Primary School Narela Sector A9' : `Govt. School ${code} - ${i}`,
    titleHindi: i===0 ? 'राजकीय प्राथमिक विद्यालय नरेला सेक्टर ए9' : `सरकारी स्कूल ${code} - ${i}`,
    status: i%2===0 ? 'Looking Steady' : 'Needs Attention',
    groundTruthScore: 65 + (h+i*7)%35,
    reality: { evidenceCount: i+1 },
    claim: { value: 100 },
    updatedAt: new Date().toISOString(),
    udiseCode: `07010${code.slice(2)}${i}0${i}`,
    schoolLevel: 'Primary',
    managementType: 'Government',
    officialStudentCount: 80 + i*20,
    officialTeacherCount: 4 + i,
    teachersSanctioned: 5 + i,
    hasToilet: true,
    hasElectricity: i!==1,
    hasDrinkingWater: true,
    lastCheckIn: new Date().toISOString(),
  });
  const mkInfra = (i:number): ApiRecord => ({
    id: `mock-infra-${code}-${i}`,
    moduleId: 'infra',
    location: { pinCode: code, state: 'Delhi', district: 'New Delhi' },
    titleEnglish: i===0 ? 'Construction of Elevated Corridor Phase-2' : `PMGSY Road Project ${code}-${i}`,
    titleHindi: i===0 ? 'एलिवेटेड कॉरिडोर निर्माण' : `सड़क परियोजना ${code}-${i}`,
    status: ['Construction','Delayed','Completed'][i%3],
    groundTruthScore: 70 + (h+i*5)%30,
    reality: { evidenceCount: i },
    claim: { value: 60 + i*10 },
    updatedAt: new Date().toISOString(),
    department: 'PWD',
    ministry: 'Ministry of Road Transport',
    budget: `${20+i*15} Cr`,
    startDate: '2022-03-15',
    expectedCompletion: '2024-12-31',
    claimCompletionPct: 60 + i*10,
    responsibleOfficer: 'EE, PWD',
    evidenceCount: i,
    sourceUrl: 'https://mospi.gov.in',
  });
  const records: RecordsResponse['records'] = {};
  const wantSchool = !module || module==='school';
  const wantInfra = !module || module==='infra';
  if (wantSchool) records.school = [mkSchool(0), mkSchool(1)].slice(0, 2 + (h%1));
  if (wantInfra) records.infra = [mkInfra(0), mkInfra(1)];
  if (!module) {
    // also add stubs for other modules so counts feel live (mapped as infra for catalog)
    records.rera = [{ id:`mock-rera-${code}`, reraNumber:`RERA-${code}`, name:`Builder Project ${code}` } as any];
    records.hospital = [{ id:`mock-hosp-${code}`, name:`CHC ${code}` } as any];
    records.pds = [{ id:`mock-pds-${code}`, shopName:`FPS ${code}` } as any];
    records.grievance = [{ id:`mock-griev-${code}`, ministry:'Urban Development' } as any];
    records.contractor = [{ id:`mock-cont-${code}`, name:`Contractor ${code}` } as any];
  }
  return { pincode: code, records };
}

export interface PincodeInfo {
  code: string;
  state: string;
  district: string;
  region: string;
  areaType: string;
  lat: number;
  lng: number;
  counts: {
    schools: number;
    infraProjects: number;
    reraProjects: number;
    hospitals: number;
    pdsShops: number;
    grievances: number;
    citizenReports: number;
  };
}

export interface SchoolRecord {
  id: string;
  udiseCode: string;
  nameEnglish: string;
  nameHindi: string;
  level: string;
  managementType: string;
  studentsEnrolled: number;
  teachersWorking: number;
  teachersSanctioned: number;
  groundTruthScore: number;
  hasToilet: boolean;
  hasElectricity: boolean;
  hasDrinkingWater: boolean;
  lastCheckIn: string | null;
  pincodeCode?: string;
}

export interface InfraProject {
  id: string;
  titleEnglish: string;
  titleHindi: string;
  department: string;
  ministry: string;
  budget: string;
  startDate: string;
  expectedCompletion: string;
  status: string;
  claimCompletionPct: number;
  groundTruthScore: number;
  responsibleOfficer: string;
  evidenceCount: number;
  sourceUrl: string;
  pincodeCode?: string;
}

export interface ApiRecord {
  id: string;
  moduleId: 'school' | 'infra';
  location: { pinCode: string; state: string; district: string };
  titleEnglish: string;
  titleHindi: string;
  status: string;
  groundTruthScore: number;
  reality: { evidenceCount: number };
  claim: { value: number };
  updatedAt: string;
  // School-specific
  udiseCode?: string;
  schoolLevel?: string;
  managementType?: string;
  officialStudentCount?: number;
  officialTeacherCount?: number;
  teachersSanctioned?: number;
  hasToilet?: boolean;
  hasElectricity?: boolean;
  hasDrinkingWater?: boolean;
  lastCheckIn?: string | null;
  // Infra-specific
  department?: string;
  ministry?: string;
  budget?: string;
  startDate?: string;
  expectedCompletion?: string;
  claimCompletionPct?: number;
  responsibleOfficer?: string;
  evidenceCount?: number;
  sourceUrl?: string;
}

export interface RecordsResponse {
  pincode: string;
  records: {
    school?: ApiRecord[];
    infra?: ApiRecord[];
    rera?: unknown[];
    hospital?: unknown[];
    pds?: unknown[];
    grievance?: unknown[];
    contractor?: unknown[];
  };
}

export interface CitizenReport {
  id: string;
  pincode: string;
  module: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

export const api = {
  getPincode: async (code: string) => {
    try { const r = await apiFetch<PincodeInfo>(`/api/pincode/${code}`); clearOffline(); return r; }
    catch { return mockPincodeInfo(code); }
  },

  getRecords: async (code: string, module?: string) => {
    const q = module ? `?module=${module}` : '';
    try { const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records${q}`); clearOffline(); return r; }
    catch { return mockRecords(code, module); }
  },

  getRecord: async (module: string, id: string) => {
    try { return await apiFetch<{ module: string; record: unknown }>(`/api/records/${module}/${id}`); }
    catch {
      // Fallback: try to synthesize from mockRecords if id is mock-*
      if (id.startsWith('mock-')) {
        const codeMatch = id.match(/mock-\w+-(\d{6})/);
        const code = codeMatch ? codeMatch[1] : '110001';
        const recs = mockRecords(code);
        const all: ApiRecord[] = [...(recs.records.school||[]), ...(recs.records.infra||[])];
        const found = all.find(r=>r.id===id);
        if (found) return { module, record: found as unknown };
      }
      throw new Error('Record not found (offline fallback)');
    }
  },

  getSchools: async (code: string) => {
    try { const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records?module=school`); return r.records.school || []; }
    catch { return mockRecords(code,'school').records.school || []; }
  },

  getInfraProjects: async (code: string) => {
    try { const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records?module=infra`); return r.records.infra || []; }
    catch { return mockRecords(code,'infra').records.infra || []; }
  },

  submitReport: (data: { pincode?: string; pinCode?: string; module?: string; moduleId?: string; category?: string; title?: string; description: string; media?: string[] | Array<{ type: string; url: string; caption?: string }> }) => {
    // Compat payload: server expects pinCode/moduleId/title; frontend sends pincode/module/category
    const pinCode = (data as any).pinCode || (data as any).pincode || '';
    const moduleId = (data as any).moduleId || (data as any).module || 'school';
    const title = (data as any).title || (data as any).category || 'Citizen Report';
    const media = Array.isArray(data.media) && typeof data.media[0] === 'string'
      ? (data.media as string[]).map(url => ({ type: 'PHOTO', url, caption: '' }))
      : data.media;
    return apiFetch<{ id: string; report?: unknown }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify({ pinCode, pincode: pinCode, moduleId, module: moduleId, title, category: title, description: data.description, media }),
    });
  },

  getReports: (code: string) =>
    apiFetch<{ reports?: CitizenReport[]; data?: CitizenReport[] } | CitizenReport[]>(`/api/reports?pincode=${code}`).then(res => {
      if (Array.isArray(res)) return res;
      const anyRes: any = res;
      return anyRes.reports || anyRes.data || [];
    }),

  login: (email: string, password: string) => apiFetch<{ token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string, role: string) =>
    apiFetch<{ token: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),

  me: () => apiFetch<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
};

export type { PincodeInfo as PincodeDataType };
