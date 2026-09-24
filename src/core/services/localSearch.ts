import { getStoredProjects } from '../../modules/infra/services/projectService';
import { getStoredContractors } from '../../modules/contractor/services/contractorService';
import { getStoredReraProjects } from '../../modules/rera/services/reraService';
import { getAllWorks } from '../../modules/mplads/services/mpladsService';
import { getAllCourts } from '../../modules/courts/services/courtsService';
import { getAllBooths } from '../../modules/booth/services/boothService';
import { getAllWards } from '../../modules/nagar/services/nagarService';
import { getAllStations } from '../../modules/pollution/services/pollutionService';
import { getAllAuthorities } from '../../modules/rti/services/rtiService';
import { PIN_COORDINATES } from '../utils/pinCoordinates';
import type { ApiRecord, SearchResponse, SearchResult, SearchEntityType, AutocompleteSuggestion } from './api';

/**
 * Client-side search over the datasets bundled with each module. Used when the
 * search API is unreachable so Search never dead-ends on an error screen.
 */

interface Doc {
  result: SearchResult;
  haystack: string;
  titleText: string;
}

function doc(
  type: SearchEntityType,
  id: string,
  title: string,
  description: string,
  loc: { pincode?: string; state?: string; district?: string },
  meta: Record<string, unknown>,
  source: string,
  extra = ''
): Doc {
  return {
    result: {
      id,
      type,
      title,
      description,
      location: loc.pincode ? { pincode: loc.pincode, state: loc.state || '', district: loc.district || '' } : undefined,
      metadata: meta,
      score: 0,
      source: { name: source, freshness: 'Sample dataset', reliability: 'medium' },
    },
    titleText: title.toLowerCase(),
    haystack: [title, description, loc.pincode, loc.state, loc.district, extra].filter(Boolean).join(' ').toLowerCase(),
  };
}

let cache: Doc[] | null = null;

function buildIndex(schools: ApiRecord[]): Doc[] {
  const docs: Doc[] = [];
  const safe = <T,>(fn: () => T[]): T[] => {
    try {
      return fn();
    } catch {
      return [];
    }
  };

  for (const p of PIN_COORDINATES) {
    const pin = `${p.prefix}001`;
    docs.push(doc('location', pin, `${p.district}, ${p.state}`, `Area dashboard for PIN ${pin}`, { pincode: pin, state: p.state, district: p.district }, { href: `/pin/${pin}` }, 'India Post PIN directory'));
  }
  for (const s of schools) {
    docs.push(doc('school', s.id, s.titleEnglish, `${s.schoolLevel || 'School'} · ${s.managementType || 'Government'} · UDISE ${s.udiseCode || 'n/a'}`, { pincode: s.location.pinCode, state: s.location.state, district: s.location.district }, { href: `/schools/${s.id}`, status: s.status, score: s.groundTruthScore, hindi: s.titleHindi }, 'UDISE+', s.titleHindi));
  }
  for (const p of safe(getStoredProjects)) {
    docs.push(doc('infra', p.id, p.nameEnglish, `${p.sector} · ${p.ministry}`, { pincode: p.pinCode, state: p.state, district: p.district }, { href: `/projects/${p.id}`, status: p.status, hindi: p.nameHindi }, 'MoSPI / PMGSY', p.nameHindi));
  }
  for (const c of safe(getStoredContractors)) {
    docs.push(doc('contractor', c.id, c.companyName, `${c.category} contractor · ${c.headquarters} · ${c.projects.length} public projects`, {}, { href: `/contractors/${c.id}`, status: c.debarmentRecords.length ? 'Debarment on record' : 'No debarment' }, c.officialSource.name, [c.registrationNumber, ...c.directors].join(' ')));
  }
  for (const r of safe(getStoredReraProjects)) {
    docs.push(doc('rera', r.id, r.projectName, `By ${r.builderName}`, { pincode: r.pinCode, state: r.state, district: r.district }, { href: `/rera/projects/${r.id}`, status: r.status }, 'State RERA', r.builderName));
  }
  for (const w of safe(() => getAllWorks())) {
    docs.push(doc('mplads', w.id, w.workTitle, `${w.sector} · Recommended by ${w.representativeName} · ${w.locationName}`, { pincode: w.pinCode, state: w.state, district: w.district }, { href: `/mplads/projects/${w.id}`, status: w.status, score: w.groundTruthScore, hindi: w.workTitleHi }, 'MoSPI MPLADS', `${w.workTitleHi} ${w.executingAgency}`));
  }
  for (const c of safe(() => getAllCourts())) {
    docs.push(doc('court', c.id, c.complexName, 'District court complex', { pincode: c.pinCode, state: c.state, district: c.district }, { href: `/courts/${c.id}` }, 'NJDG / eCourts'));
  }
  for (const b of safe(() => getAllBooths())) {
    docs.push(doc('booth', b.id, b.buildingName, 'Polling station', { pincode: b.pinCode, state: b.state, district: b.district }, { href: `/booth/${b.id}` }, 'ECI electoral roll'));
  }
  for (const w of safe(() => getAllWards())) {
    docs.push(doc('ward', w.id, `Ward ${w.wardNumber}: ${w.wardName}`, 'Municipal ward', { pincode: w.pinCode, state: w.state, district: w.district }, { href: `/nagar/wards/${w.id}` }, 'Urban local body'));
  }
  for (const s of safe(() => getAllStations())) {
    docs.push(doc('station', s.id, s.stationName, `Air quality station · AQI ${s.currentAqi} (${s.category})`, { pincode: s.pinCode, state: s.state, district: s.district }, { href: `/pollution/stations/${s.id}`, status: s.category }, 'CPCB', s.city));
  }
  for (const a of safe(() => getAllAuthorities())) {
    docs.push(doc('authority', a.id, a.authorityName, `Public authority under the RTI Act · ${a.city}`, { pincode: a.pinCode, state: a.state, district: a.city }, { href: `/rti/authorities/${a.id}` }, 'RTI Online'));
  }
  return docs;
}

function index(schools: ApiRecord[]) {
  if (!cache) cache = buildIndex(schools);
  return cache;
}

function rank(docs: Doc[], q: string): SearchResult[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const out: SearchResult[] = [];
  for (const d of docs) {
    let score = 0;
    let all = true;
    for (const t of tokens) {
      if (d.titleText.includes(t)) score += 3;
      else if (d.haystack.includes(t)) score += 1;
      else all = false;
    }
    if (score === 0 || !all) continue;
    if (d.titleText.startsWith(tokens[0])) score += 2;
    out.push({ ...d.result, score, matchType: d.titleText.includes(q.toLowerCase()) ? 'exact' : 'related' });
  }
  return out.sort((a, b) => b.score - a.score);
}

export function localSearch(
  params: { q: string; type?: string; pincode?: string; state?: string; status?: string; page?: number; limit?: number },
  schools: ApiRecord[]
): SearchResponse {
  const limit = params.limit || 10;
  const page = params.page || 1;
  let results = rank(index(schools), params.q);
  if (params.type) {
    const types = params.type.split(',');
    results = results.filter((r) => types.includes(r.type));
  }
  if (params.pincode) results = results.filter((r) => r.location?.pincode === params.pincode);
  if (params.state) {
    const st = params.state.toLowerCase();
    results = results.filter((r) => r.location?.state.toLowerCase().includes(st));
  }
  const total = results.length;
  return {
    results: results.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    query: params.q,
    filters: { type: params.type, pincode: params.pincode, state: params.state, facets: facetCounts(rank(index(schools), params.q)) },
  };
}

function facetCounts(results: SearchResult[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of results) counts[r.type] = (counts[r.type] || 0) + 1;
  return counts;
}

export function localAutocomplete(q: string, schools: ApiRecord[]): AutocompleteSuggestion[] {
  return rank(index(schools), q)
    .slice(0, 6)
    .map((r) => ({ text: r.title, type: r.type, subtitle: r.location ? `${r.location.district}, ${r.location.state}` : r.description, pincode: r.location?.pincode }));
}
