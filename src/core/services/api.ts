import { resolvePincode as _resolvePincode, resolvePincodeAccurate } from '../utils/pinResolver';
import { getStoredProjects } from '../../modules/infra/services/projectService';
import { getCoordinateForPin } from '../utils/pinCoordinates';

const BASE_URL = import.meta.env.VITE_API_URL || '';

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

import { getAuthenticPincode, getAuthenticRecordsForPin } from '../data/authenticData';

// --- Resilient fallback when backend server is offline ---
function markOffline() { try { if (typeof window !== 'undefined') localStorage.setItem('jantax_offline','1'); } catch {} }
function clearOffline() { try { if (typeof window !== 'undefined' && navigator.onLine) localStorage.removeItem('jantax_offline'); } catch {} }

function mockPincodeInfo(code: string, locAccurate?: any): PincodeInfo {
  markOffline();
  const auth = getAuthenticPincode(code, locAccurate);
  return {
    code: auth.code,
    state: auth.state,
    district: auth.district,
    region: auth.region,
    areaType: auth.areaType,
    lat: auth.lat,
    lng: auth.lng,
    counts: auth.counts,
  };
}

function mockRecords(code: string, module?: string, locAccurate?: any): RecordsResponse {
  markOffline();
  return getAuthenticRecordsForPin(code, module, locAccurate) as RecordsResponse;
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
  /** Rule 40: rows per domain that are fixtures. > 0 → badge "Sample data". */
  sampleCounts?: PincodeInfo['counts'];
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
    andhbhakt?: unknown[];
    nagar?: unknown[];
    budget?: unknown[];
    pollution?: unknown[];
    land?: unknown[];
    utility?: unknown[];
    election?: unknown[];
    booth?: unknown[];
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
    try {
      const r = await apiFetch<PincodeInfo>(`/api/pincode/${code}`);
      clearOffline();
      return r;
    } catch {
      let accurateLoc;
      try { accurateLoc = await resolvePincodeAccurate(code); } catch {}
      return mockPincodeInfo(code, accurateLoc);
    }
  },

  getRecords: async (code: string, module?: string) => {
    const q = module ? `?module=${module}` : '';
    try {
      const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records${q}`);
      clearOffline();
      return r;
    } catch {
      let accurateLoc;
      try { accurateLoc = await resolvePincodeAccurate(code); } catch {}
      return mockRecords(code, module, accurateLoc);
    }
  },

  getRecord: async (module: string, id: string) => {
    try { return await apiFetch<{ module: string; record: unknown }>(`/api/records/${module}/${id}`); }
    catch {
      // Fallback: try to synthesize from mockRecords if id is mock-* or auth-*
      if (id.startsWith('mock-') || id.startsWith('auth-')) {
        const codeMatch = id.match(/(?:mock|auth)-\w+-(\d{6})/);
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

  getReraProjects: async (code?: string, page = 1, limit = 10) => {
    const q = new URLSearchParams();
    if (code) q.set('pincode', code);
    q.set('page', String(page));
    q.set('limit', String(limit));
    try {
      return await apiFetch<{ rera: any[]; pagination: { total: number; page: number; totalPages: number } }>(`/api/rera?${q.toString()}`);
    } catch {
      const pin = code || '110001';
      const r = (mockRecords(pin).records as any).rera || [];
      return { rera: r, pagination: { total: r.length, page: 1, totalPages: 1 } };
    }
  },

  getReraProject: async (id: string) => {
    return apiFetch<any>(`/api/rera/${id}`);
  },

  getHospitals: async (code: string) => {
    try {
      const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records?module=hospital`);
      return (r.records as any).hospital || [];
    } catch {
      return (mockRecords(code).records as any).hospital || [];
    }
  },

  getPdsShops: async (code: string) => {
    try {
      const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records?module=pds`);
      return (r.records as any).pds || [];
    } catch {
      return (mockRecords(code).records as any).pds || [];
    }
  },

  getGrievances: async (code: string) => {
    try {
      const r = await apiFetch<RecordsResponse>(`/api/pincode/${code}/records?module=grievance`);
      return (r.records as any).grievance || [];
    } catch {
      return (mockRecords(code).records as any).grievance || [];
    }
  },

  getContractors: async (params?: { state?: string; minScore?: number; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.state) q.set('state', params.state);
    if (params?.minScore) q.set('minScore', String(params.minScore));
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    return apiFetch<{ contractors: any[]; pagination: { total: number; page: number; totalPages: number } }>(`/api/contractors?${q.toString()}`);
  },

  getContractor: async (id: string) => {
    return apiFetch<any>(`/api/contractors/${id}`);
  },

  getSources: async (params?: { page?: number; limit?: number; sourceType?: string }) => {
    const q = new URLSearchParams();
    if (params?.sourceType) q.set('sourceType', params.sourceType);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    return apiFetch<{ sources: any[]; pagination: { total: number; page: number; totalPages: number } }>(`/api/sources?${q.toString()}`);
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
    return apiFetch<SearchResponse>(`/api/search?${sp.toString()}`);
  },

  searchAutocomplete: (q: string, pincode?: string) => {
    const sp = new URLSearchParams({ q, ...(pincode ? { pincode } : {}) });
    return apiFetch<AutocompleteResponse>(`/api/search/autocomplete?${sp.toString()}`);
  },

  login: (email: string, password: string) => apiFetch<{ token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string, role: string) =>
    apiFetch<{ token: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),

  me: () => apiFetch<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
};

export type { PincodeInfo as PincodeDataType };

// --- Search Types ---
export type SearchEntityType = 'school' | 'infra' | 'rera' | 'hospital' | 'pds' | 'contractor' | 'source' | 'issue' | 'grievance';

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
