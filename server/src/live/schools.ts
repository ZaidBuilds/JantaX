// Live schools for any PIN. Source: Jal Jeevan Mission school registry
// (~9.6 lakh schools, updated daily). Narrowed to the PIN's LGD villages.

import { fetchOgd, usingSampleKey } from '../connectors/ogdClient';
import { OGD } from '../connectors/ogdResources';
import { cached, HOUR } from './cache';
import { resolvePin } from './pin';
import { toNum, unavailable, type LiveResult } from './types';

export interface LiveSchool {
  id: string;
  name: string;
  udiseCode: string | null;
  village: string;
  panchayat: string;
  block: string;
  district: string;
  state: string;
  students: number | null;
  management: string;
  level: string;
  dataDate: string | null;
}

type Raw = Record<string, string>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

function toSchool(r: Raw): LiveSchool {
  const udise = r.school_name?.match(/(\d{11})\s*$/)?.[1] ?? null;
  const name = udise ? r.school_name.replace(/[-\s]*\d{11}\s*$/, '') : r.school_name;
  return {
    id: r.school_id,
    name: name.trim(),
    udiseCode: udise,
    village: r.village_name,
    panchayat: r.panchayat_name,
    block: r.block_name,
    district: r.district_name,
    state: r.state_name,
    students: toNum(r.no_of_student),
    management: r.school_category,
    level: r.school_subcategory,
    dataDate: r.data_gov_update_date ?? null,
  };
}

function districtSchools(state: string, district: string) {
  const max = usingSampleKey() ? 50 : 6000;
  return cached(`jjm:${state}:${district}`, 12 * HOUR, () =>
    fetchOgd<Raw>('jjmSchools', { filters: { state_name: state, district_name: district }, max }),
  );
}

export async function liveSchools(pin: string): Promise<LiveResult<LiveSchool> & { scope?: string }> {
  const p = await resolvePin(pin);
  if (!p) return unavailable('school', 'PIN code not found in India Post or LGD directories.');

  const res = await districtSchools(p.state, p.district);
  const all = res.records.map(toSchool);
  if (all.length === 0) {
    return unavailable('school', `No schools listed for ${p.district}, ${p.state} in the JJM registry.`);
  }

  const villageKeys = new Set(p.villages.map((v) => norm(v.name)));
  const local = all.filter((s) => villageKeys.has(norm(s.village)) || villageKeys.has(norm(s.panchayat)));
  const scoped = local.length > 0;

  return {
    domain: 'school',
    available: true,
    scope: scoped ? 'pin' : 'district',
    records: scoped ? local : all,
    total: scoped ? local.length : res.total,
    source: {
      name: 'Dept. of Drinking Water & Sanitation — Schools under Jal Jeevan Mission',
      url: res.sourceUrl,
      resourceId: OGD.jjmSchools.id,
      updatedDate: res.updatedDate,
      level: scoped ? 'village (matched to PIN)' : 'district',
    },
    reason: res.sampleKey ? 'Sample API key: only first 50 schools of the district loaded.' : undefined,
    fetchedAt: res.fetchedAt,
  };
}
