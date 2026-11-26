// Live MGNREGA district snapshot (Ministry of Rural Development, monthly).

import { fetchOgd } from '../connectors/ogdClient';
import { OGD } from '../connectors/ogdResources';
import { cached, HOUR } from './cache';
import { resolvePin } from './pin';
import { toNum, unavailable, type LiveResult } from './types';

type Raw = Record<string, string>;

const MONTHS = ['April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'];

export interface LiveMgnrega {
  finYear: string;
  month: string;
  activeJobCards: number | null;
  activeWorkers: number | null;
  householdsWorked: number | null;
  avgDaysPerHousehold: number | null;
  households100Days: number | null;
  womenPersondays: number | null;
  totalExpenditureLakhs: number | null;
  ongoingWorks: number | null;
  completedWorks: number | null;
  paymentsWithin15DaysPct: number | null;
}

function finYears(now = new Date()): string[] {
  const y = now.getFullYear();
  const start = now.getMonth() >= 3 ? y : y - 1;
  return [`${start}-${start + 1}`, `${start - 1}-${start}`];
}

/** Rank within the financial year: April = 0 … March = 11. Accepts names or 1–12. */
function monthRank(m: string): number {
  const s = String(m ?? '').trim().toLowerCase();
  const n = Number(s);
  if (Number.isInteger(n) && n >= 1 && n <= 12) return (n + 8) % 12;
  return MONTHS.findIndex((x) => s.startsWith(x.toLowerCase().slice(0, 3)));
}

function toRow(r: Raw): LiveMgnrega {
  return {
    finYear: r.fin_year,
    month: r.month,
    activeJobCards: toNum(r.Total_No_of_Active_Job_Cards),
    activeWorkers: toNum(r.Total_No_of_Active_Workers),
    householdsWorked: toNum(r.Total_Households_Worked),
    avgDaysPerHousehold: toNum(r.Average_days_of_employment_provided_per_Household),
    households100Days: toNum(r.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
    womenPersondays: toNum(r.Women_Persondays),
    totalExpenditureLakhs: toNum(r.Total_Exp),
    ongoingWorks: toNum(r.Number_of_Ongoing_Works),
    completedWorks: toNum(r.Number_of_Completed_Works),
    paymentsWithin15DaysPct: toNum(r.percentage_payments_gererated_within_15_days),
  };
}

export async function liveMgnrega(pin: string): Promise<LiveResult<LiveMgnrega>> {
  const p = await resolvePin(pin);
  if (!p) return unavailable('mgnrega', 'PIN code not found.');

  const state = p.state.toUpperCase();
  const district = p.district.toUpperCase();

  for (const fy of finYears()) {
    const res = await cached(`mgnrega:${state}:${district}:${fy}`, 12 * HOUR, () =>
      fetchOgd<Raw>('mgnregaDistrict', {
        filters: { state_name: state, district_name: district, fin_year: fy },
        max: 12,
      }),
    );
    if (res.records.length === 0) continue;

    const latest = [...res.records].sort((a, b) => monthRank(b.month) - monthRank(a.month));
    return {
      domain: 'mgnrega',
      available: true,
      records: latest.map(toRow),
      total: res.total,
      source: {
        name: 'Ministry of Rural Development — District-wise MGNREGA Data at a Glance',
        url: res.sourceUrl,
        resourceId: OGD.mgnregaDistrict.id,
        updatedDate: res.updatedDate,
        level: 'district (monthly, latest first)',
      },
      fetchedAt: res.fetchedAt,
    };
  }

  return unavailable('mgnrega', `No MGNREGA data for ${p.district} (urban districts are not covered).`);
}
