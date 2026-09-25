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

import { getAuthenticPincode } from '../data/authenticData';

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
  const h = (parseInt(code.slice(0, 4), 10) || 1100) % 20;
  let loc: any = locAccurate || { state: 'India', district: 'Local District', region: 'Central', stateCode: 'IN' };
  if (!locAccurate) {
    try { loc = _resolvePincode(code); } catch {}
  }
  const coords = getCoordinateForPin(code);
  const subArea = loc.postOffice ? `${loc.postOffice}, ` : '';
  const localPlace = loc.postOffice || loc.block || loc.district;

  const mkSchool = (i: number): ApiRecord => ({
    id: `mock-school-${code}-${i}`,
    moduleId: 'school',
    location: { pinCode: code, state: loc.state, district: loc.district },
    titleEnglish: i === 0 ? `Govt. Composite Model School (${subArea}${loc.district})` : `PM SHRI Govt. Primary School (${subArea}${loc.district})`,
    titleHindi: i === 0 ? `राजकीय कम्पोजिट मॉडल विद्यालय (${subArea}${loc.district})` : `पीएम श्री सरकारी प्राथमिक विद्यालय (${subArea}${loc.district})`,
    status: i % 2 === 0 ? 'Looking Steady' : 'Needs Attention',
    groundTruthScore: 68 + (h + i * 7) % 30,
    reality: { evidenceCount: i + 1 },
    claim: { value: 100 },
    updatedAt: new Date().toISOString(),
    udiseCode: `09${code.slice(0, 4)}${i + 1}01`,
    schoolLevel: i === 0 ? 'Upper Primary' : 'Primary',
    managementType: 'Department of School Education',
    officialStudentCount: 140 + i * 45,
    officialTeacherCount: 5 + i * 2,
    teachersSanctioned: 6 + i * 2,
    hasToilet: true,
    hasElectricity: true,
    hasDrinkingWater: true,
    lastCheckIn: new Date().toISOString(),
  });

  const mkInfra = (i: number): ApiRecord => {
    return {
      id: `mock-infra-${code}-${i}`,
      moduleId: 'infra',
      location: { pinCode: code, state: loc.state, district: loc.district },
      titleEnglish: i === 0 ? `PMGSY Road & Drainage Network (${subArea}${loc.district})` : `PWD Connecting Highway Corridor ${code}-${i + 1}`,
      titleHindi: i === 0 ? `पीएमजीएसवाई ग्रामीण सड़क एवं नाली निर्माण (${subArea}${loc.district})` : `लोक निर्माण मुख्य मार्ग संपर्क पैकेज ${code}-${i + 1}`,
      status: ['Construction', 'Delayed', 'Completed'][i % 3],
      groundTruthScore: 65 + (h + i * 5) % 32,
      reality: { evidenceCount: i + 1 },
      claim: { value: 60 + i * 15 },
      updatedAt: new Date().toISOString(),
      department: i === 0 ? 'PMGSY / Rural Works' : 'Public Works Department (PWD)',
      ministry: i === 0 ? 'Ministry of Rural Development' : 'Ministry of Road Transport & Highways',
      budget: `₹${14 + (h % 20) + i * 8} Cr`,
      startDate: '2023-04-15',
      expectedCompletion: '2025-06-30',
      claimCompletionPct: 60 + i * 15,
      responsibleOfficer: `Executive Engineer (${loc.district})`,
      evidenceCount: i + 1,
      sourceUrl: 'https://omms.nic.in',
    };
  };

  const records: RecordsResponse['records'] = {};
  const wantSchool = !module || module === 'school';
  const wantInfra = !module || module === 'infra';
  const wantRera = !module || module === 'rera';
  const wantHospital = !module || module === 'hospital';
  const wantPds = !module || module === 'pds';
  const wantGrievance = !module || module === 'grievance';
  const wantContractor = !module || module === 'contractor';

  if (wantSchool) records.school = [mkSchool(0), mkSchool(1)];
  if (wantInfra) records.infra = [mkInfra(0), mkInfra(1)];
  if (wantRera) {
    records.rera = [
      {
        id: `mock-rera-${code}-1`,
        reraNumber: `RERA-${loc.stateCode || 'IN'}-${code}-01`,
        name: `${localPlace} Green Heights Residency`,
        promoter: `${loc.district} Infra Developers`,
        status: 'Ongoing',
        district: loc.district,
        state: loc.state,
        delayMonths: 8,
        complaints: 4,
        possessionDate: '2025-12-31'
      } as any,
      {
        id: `mock-rera-${code}-2`,
        reraNumber: `RERA-${loc.stateCode || 'IN'}-${code}-02`,
        name: `${localPlace} Eco Smart Township`,
        promoter: `Balaji Realcon Developers`,
        status: 'Delayed',
        district: loc.district,
        state: loc.state,
        delayMonths: 14,
        complaints: 11,
        possessionDate: '2024-06-30'
      } as any,
    ];
  }
  if (wantHospital) {
    records.hospital = [
      {
        id: `mock-hosp-${code}-1`,
        name: `District Civil Hospital, ${loc.district}`,
        type: 'DISTRICT_HOSPITAL',
        beds: 200,
        bedsTotal: 200,
        bedsOccupied: 164,
        doctorsPresent: 18,
        doctorPresent: true,
        medicinesAvailable: true,
        district: loc.district,
        state: loc.state,
      } as any,
      {
        id: `mock-hosp-${code}-2`,
        name: `Community Health Centre (CHC) ${localPlace}`,
        type: 'CHC',
        beds: 30,
        bedsTotal: 30,
        bedsOccupied: 22,
        doctorsPresent: 4,
        doctorPresent: true,
        medicinesAvailable: true,
        district: loc.district,
        state: loc.state,
      } as any,
    ];
  }
  if (wantPds) {
    records.pds = [
      {
        id: `mock-pds-${code}-1`,
        shopName: `Fair Price Ration Shop #108 (${localPlace})`,
        dealerName: 'Shri Ram PDS Seva Kendra',
        district: loc.district,
        state: loc.state,
        beneficiaries: 1420,
        quotaDistributedPct: 94,
        activeRationCards: 1420,
      } as any,
      {
        id: `mock-pds-${code}-2`,
        shopName: `Fair Price Ration Outlet #42 (${loc.district})`,
        dealerName: 'Kisan Sahkari PDS Outlet',
        district: loc.district,
        state: loc.state,
        beneficiaries: 980,
        quotaDistributedPct: 91,
        activeRationCards: 980,
      } as any,
    ];
  }
  if (wantGrievance) {
    records.grievance = [{ id: `mock-griev-${code}`, ministry: 'Urban Development & Civic Amenities', category: 'Drainage and road maintenance delay', delayDays: 45 } as any];
  }
  if (wantContractor) {
    records.contractor = [{ id: `mock-cont-${code}`, name: `${loc.district} Civil Infratech Pvt Ltd`, rating: 4.2, score: 78 } as any];
  }
  if (!module || module === 'andhbhakt') {
    records.andhbhakt = [{
      id: `mock-claim-${code}`,
      stateCode: loc.stateCode || 'UP',
      claimTitleEn: '100% Pothole-Free Roads Across State Districts',
      claimTitleHindi: 'प्रदेश के सभी जिलों में 100% गड्ढामुक्त सड़कें',
      cagReportRef: 'CAG State Finances Audit',
      realitySeverity: 'HIGH',
      realityTitleEn: 'CAG Audit: 38% Premature Bitumen Degradation Within 11 Months'
    } as any];
  }
  if (!module || module === 'nagar') {
    records.nagar = [{
      id: `mock-ward-${code}`,
      wardNo: `Ward ${code.slice(4, 6)}`,
      pincode: code,
      garbageClaimedSla: '24 Hours Door-to-Door Collection',
      waterClaimedSla: '135 Litres/Capita/Day',
      drainageClaimedSla: 'Weekly Mechanical Desilting'
    } as any];
  }
  if (!module || module === 'budget') {
    records.budget = [{
      id: `mock-budget-${code}`,
      pincode: code,
      financialYear: '2024-25',
      totalRevenueCr: 142.5,
      totalAllocatedCr: 128.8,
      allocations: [
        { sectorNameEn: 'Roads & Bridges', allocatedCr: 48.5, utilizedCr: 36.2 },
        { sectorNameEn: 'Drinking Water & Sanitation', allocatedCr: 34.0, utilizedCr: 21.8 }
      ]
    } as any];
  }
  if (!module || module === 'pollution') {
    records.pollution = [{
      id: `mock-station-${code}`,
      stationName: `${loc.district} Continuous Ambient Air Quality Station`,
      pincode: code,
      aqiValue: 145 + (h % 100),
      dominantPollutant: 'PM2.5'
    } as any];
  }
  if (!module || module === 'land') {
    records.land = [{
      id: `mock-tehsil-${code}`,
      tehsilName: `${loc.district} Sadar Tehsil`,
      district: loc.district,
      promisedSlaDays: 45,
      mutationRecords: [{ surveyNumber: `Khasra ${code.slice(3)}/42`, daysTaken: 118, status: 'Delayed Overrun' }]
    } as any];
  }
  if (!module || module === 'utility') {
    records.utility = [{
      id: `mock-feeder-${code}`,
      feederName: `11kV ${loc.district} Town Feeder Line 2`,
      promisedSupplyHours: 24,
      outageLogs: [{ outageMinutes: 145, faultType: 'Transformer Overload' }]
    } as any];
  }
  if (!module || module === 'election') {
    records.election = [{
      id: `mock-cand-${code}`,
      candidateName: `Elected Representative (${loc.district})`,
      declaredSpend: 38.5,
      estimatedSpend: 142.0
    } as any];
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
