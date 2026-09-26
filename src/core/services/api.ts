import { resolvePincode as _resolvePincode } from '../utils/pinResolver';
import { getStoredProjects } from '../../modules/infra/services/projectService';
import { localSearch, localAutocomplete } from './localSearch';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/** Absolute URL for an API path. Use this instead of fetch('/api/...'). */
export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

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
function notifyDataMode() { try { window.dispatchEvent(new Event('jantax:data-mode')); } catch {} }
function markOffline() { try { if (typeof window !== 'undefined') { localStorage.setItem('jantax_offline','1'); notifyDataMode(); } } catch {} }
function clearOffline() { try { if (typeof window !== 'undefined' && navigator.onLine) { localStorage.removeItem('jantax_offline'); notifyDataMode(); } } catch {} }
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
    sample: true,
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
  const place = (() => { try { const l = _resolvePincode(code); return l.isValid ? l : null; } catch { return null; } })();
  const state = place?.state || 'Delhi';
  const district = place?.district || 'New Delhi';
  const SCHOOL_TYPES = [
    { en: 'Govt. Primary School', hi: 'राजकीय प्राथमिक विद्यालय', level: 'Primary' },
    { en: 'Govt. Upper Primary School', hi: 'राजकीय उच्च प्राथमिक विद्यालय', level: 'Upper Primary' },
    { en: 'Govt. Senior Secondary School', hi: 'राजकीय वरिष्ठ माध्यमिक विद्यालय', level: 'Higher Secondary' },
    { en: 'Govt. Girls High School', hi: 'राजकीय कन्या उच्च विद्यालय', level: 'Secondary' },
  ];
  const mkSchool = (i:number): ApiRecord => {
    const t = SCHOOL_TYPES[(h + i) % SCHOOL_TYPES.length];
    const ward = 2 + ((h >> (i + 1)) % 38);
    const narela = code === '110001' && i === 0;
    const students = 60 + ((h >> i) % 6) * 22 + i * 12;
    const sanctioned = 4 + ((h >> (i + 2)) % 6);
    const working = Math.max(2, sanctioned - ((h >> (i + 3)) % 3));
    const score = 58 + ((h + i * 13) % 40);
    return {
      id: `mock-school-${code}-${i}`,
      moduleId: 'school',
      location: { pinCode: code, state, district },
      titleEnglish: narela ? 'Govt. Primary School Narela Sector A9' : `${t.en}, ${district} Ward ${ward}`,
      titleHindi: narela ? 'राजकीय प्राथमिक विद्यालय नरेला सेक्टर ए9' : `${t.hi}, वार्ड ${ward}`,
      status: score >= 75 ? 'Looking Steady' : 'Needs Attention',
      groundTruthScore: score,
      reality: { evidenceCount: i+1 },
      claim: { value: 100 },
      updatedAt: new Date().toISOString(),
      udiseCode: `${String(10 + (h % 26)).padStart(2, '0')}${code.slice(1)}${String(i + 1).padStart(3, '0')}`,
      schoolLevel: narela ? 'Primary' : t.level,
      managementType: 'Government',
      officialStudentCount: students,
      officialTeacherCount: working,
      teachersSanctioned: sanctioned,
      hasToilet: (h + i) % 5 !== 0,
      hasElectricity: (h + i) % 4 !== 1,
      hasDrinkingWater: (h + i) % 6 !== 2,
      lastCheckIn: new Date().toISOString(),
    };
  };
  const mkInfra = (i:number): ApiRecord => {
    let p: any;
    try {
      // Only reuse stored projects that actually sit in this PIN.
      const inPin = getStoredProjects().filter((x) => x.pinCode === code);
      if (i < inPin.length) p = inPin[i];
    } catch {}

    if (p) {
      return {
        id: p.id,
        moduleId: 'infra',
        location: { pinCode: p.pinCode, state: p.state, district: p.district },
        titleEnglish: p.nameEnglish,
        titleHindi: p.nameHindi,
        status: p.status,
        groundTruthScore: p.groundTruth.physicalScore,
        reality: { evidenceCount: p.evidenceDocuments.length },
        claim: { value: p.progressPhysical },
        updatedAt: p.originalSource.lastUpdated || new Date().toISOString(),
        department: p.implementingAgency,
        ministry: p.ministry,
        budget: `₹${(p.budgetAnticipatedLakhs/100).toFixed(1)} Cr`,
        startDate: p.startDate,
        expectedCompletion: p.anticipatedCompletionDate,
        claimCompletionPct: p.progressPhysical,
        responsibleOfficer: `${p.responsibleOfficer} (${p.responsibleOfficerDesignation})`,
        evidenceCount: p.evidenceDocuments.length,
        sourceUrl: p.originalSource.url,
      };
    }

    return {
      id: `mock-infra-${code}-${i}`,
      moduleId: 'infra',
      location: { pinCode: code, state, district },
      titleEnglish: i===0 ? `${district} Elevated Corridor, Phase 2` : `PMGSY Link Road ${i}, ${district}`,
      titleHindi: i===0 ? 'एलिवेटेड कॉरिडोर, चरण 2' : `पीएमजीएसवाई संपर्क सड़क ${i}`,
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
    };
  };
  const records: RecordsResponse['records'] = {};
  const wantSchool = !module || module==='school';
  const wantInfra = !module || module==='infra';
  if (wantSchool) records.school = Array.from({ length: 2 + (h % 3) }, (_, i) => mkSchool(i));
  if (wantInfra) records.infra = [mkInfra(0), mkInfra(1)];
  if (!module) {
    records.rera = [{ id:`mock-rera-${code}`, reraNumber:`RERA-${code}`, name:`Builder Project ${code}` } as any];
    records.hospital = [{ id:`mock-hosp-${code}`, name:`CHC ${code}` } as any];
    records.pds = [{ id:`mock-pds-${code}`, shopName:`FPS ${code}` } as any];
    records.grievance = [{ id:`mock-griev-${code}`, ministry:'Urban Development' } as any];
    records.contractor = [{ id:`mock-cont-${code}`, name:`Contractor ${code}` } as any];
  }
  return { pincode: code, records };
}

/** Sample school records for a handful of well-known PINs, used by offline search. */
function sampleSchools(): ApiRecord[] {
  return ['110001', '250001', '560001', '400001', '226001'].flatMap((pin) => mockRecords(pin, 'school').records.school || []);
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
  /** True when the records service was unreachable and these counts are generated samples. */
  sample?: boolean;
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

/** /api/air/near: CPCB stations closest to a PIN, with their latest published readings. */
export interface AirNear {
  pin: string;
  district: string;
  state: string;
  stations: {
    id: string;
    name: string;
    city: string;
    state: string;
    km: number;
    latest: null | {
      observedAt: string;
      stale: boolean;
      aqi: number | null;
      category: string | null;
      dominant: string | null;
      pollutantsReported: number;
      reason?: string;
      readings: { pollutant: string; minValue: number | null; maxValue: number | null; avgValue: number | null }[];
    };
  }[];
  source: { name: string; organization: string; url: string; license: string; lastSync: string | null };
}

export const api = {
  /** Live readings only: null when the data service or the feed is unavailable. Never falls back to samples. */
  getAirNear: async (pin: string, limit = 3): Promise<AirNear | null> => {
    try { return await apiFetch<AirNear>(`/api/air/near?pin=${pin}&limit=${limit}`); }
    catch { return null; }
  },

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

  search: (params: {
    q: string;
    type?: string;
    pincode?: string;
    page?: number;
    limit?: number;
    state?: string;
    district?: string;
    status?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.type) sp.set('type', params.type);
    if (params.pincode) sp.set('pincode', params.pincode);
    if (params.page) sp.set('page', String(params.page));
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.state) sp.set('state', params.state);
    if (params.district) sp.set('district', params.district);
    if (params.status) sp.set('status', params.status);
    return apiFetch<SearchResponse>(`/api/search?${sp.toString()}`)
      .then((r) => {
        clearOffline();
        return r;
      })
      .catch(() => {
        markOffline();
        return localSearch(params, sampleSchools());
      });
  },

  searchAutocomplete: (q: string, pincode?: string) => {
    const sp = new URLSearchParams({ q, ...(pincode ? { pincode } : {}) });
    return apiFetch<AutocompleteResponse>(`/api/search/autocomplete?${sp.toString()}`).catch(() => ({
      suggestions: localAutocomplete(q, sampleSchools()),
    } as AutocompleteResponse));
  },

  login: (email: string, password: string) => apiFetch<{ token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string, role: string) =>
    apiFetch<{ token: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),

  me: () => apiFetch<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
};

export type { PincodeInfo as PincodeDataType };

// --- Search Types ---
export type SearchEntityType =
  | 'school' | 'infra' | 'rera' | 'hospital' | 'pds' | 'contractor' | 'source' | 'issue' | 'grievance'
  | 'location' | 'mplads' | 'court' | 'booth' | 'ward' | 'station' | 'authority';

export type MatchType = 'exact' | 'related' | 'location';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  description: string;
  matchType?: MatchType;
  location?: {
    pincode: string;
    state: string;
    district: string;
  };
  metadata: Record<string, unknown>;
  score: number;
  source: {
    name: string;
    freshness: string;
    reliability: 'high' | 'medium' | 'low';
  };
}

export interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: string;
  filters: Record<string, unknown>;
}

export interface AutocompleteSuggestion {
  text: string;
  type: SearchEntityType;
  subtitle?: string;
  pincode?: string;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
  query: string;
}
