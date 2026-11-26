// Live PMGSY rural road progress for the PIN's district (OMMAS, daily).

import { fetchOgd } from '../connectors/ogdClient';
import { OGD } from '../connectors/ogdResources';
import { cached, HOUR } from './cache';
import { resolvePin } from './pin';
import { toNum, unavailable, type LiveResult } from './types';

export interface LiveRoadScheme {
  scheme: string;
  roadWorksSanctioned: number | null;
  roadWorksCompleted: number | null;
  roadWorksPending: number | null;
  bridgesSanctioned: number | null;
  bridgesCompleted: number | null;
  lengthSanctionedKm: number | null;
  lengthCompletedKm: number | null;
  lengthPendingKm: number | null;
  costSanctioned: number | null;
  expenditure: number | null;
  /** OMMAS labels these columns "lakhs"; values look like crores. Shown as published. */
  costUnit: string;
}

type Raw = Record<string, string | number>;

function toRow(r: Raw): LiveRoadScheme {
  return {
    scheme: String(r.PMGSY_SCHEME),
    roadWorksSanctioned: toNum(r.NO_OF_ROAD_WORK_SANCTIONED),
    roadWorksCompleted: toNum(r.NO_OF_ROAD_WORKS_COMPLETED),
    roadWorksPending: toNum(r.NO_OF_ROAD_WORKS_BALANCE),
    bridgesSanctioned: toNum(r.NO_OF_BRIDGES_SANCTIONED),
    bridgesCompleted: toNum(r.NO_OF_BRIDGES_COMPLETED),
    lengthSanctionedKm: toNum(r.LENGTH_OF_ROAD_WORK_SANCTIONED_KM),
    lengthCompletedKm: toNum(r.LENGTH_OF_ROAD_WORK_COMPLETED_KM),
    lengthPendingKm: toNum(r.LENGTH_OF_ROAD_WORK_BALANCE_KM),
    costSanctioned: toNum(r.COST_OF_WORKS_SANCTIONED_LAKHS),
    expenditure: toNum(r.EXPENDITURE_OCCURED_LAKHS),
    costUnit: 'as published by OMMAS',
  };
}

export async function liveRoads(pin: string): Promise<LiveResult<LiveRoadScheme>> {
  const p = await resolvePin(pin);
  if (!p) return unavailable('infra', 'PIN code not found.');

  const res = await cached(`pmgsy:${p.state}:${p.district}`, 12 * HOUR, () =>
    fetchOgd<Raw>('pmgsyProgress', {
      filters: { STATE_NAME: p.state, DISTRICT_NAME: p.district },
      max: 20,
    }),
  );

  if (res.records.length === 0) {
    return unavailable('infra', `No PMGSY works recorded for ${p.district} (urban districts usually have none).`);
  }

  return {
    domain: 'infra',
    available: true,
    records: res.records.map(toRow),
    total: res.total,
    source: {
      name: 'Ministry of Rural Development — PMGSY Physical & Financial Progress',
      url: res.sourceUrl,
      resourceId: OGD.pmgsyProgress.id,
      updatedDate: res.updatedDate,
      level: 'district',
    },
    fetchedAt: res.fetchedAt,
  };
}
