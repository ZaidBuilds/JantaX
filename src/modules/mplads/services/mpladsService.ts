import type { Representative, MpladsWork, MpladsFilter } from '../types/mplads';
import { MOCK_REPRESENTATIVES, MOCK_MPLADS_WORKS } from '../data/mockMplads';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllRepresentatives(): Representative[] {
  return MOCK_REPRESENTATIVES;
}

export function getRepresentativeById(id: string): Representative | undefined {
  return MOCK_REPRESENTATIVES.find((r) => r.id.toLowerCase() === id.toLowerCase());
}

export function getAllWorks(filter?: MpladsFilter): MpladsWork[] {
  let list = [...MOCK_MPLADS_WORKS];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (w) =>
        w.workTitle.toLowerCase().includes(q) ||
        w.workTitleHi.toLowerCase().includes(q) ||
        w.representativeName.toLowerCase().includes(q) ||
        w.locationName.toLowerCase().includes(q) ||
        w.executingAgency.toLowerCase().includes(q) ||
        w.pinCode.includes(q) ||
        w.id.toLowerCase().includes(q)
    );
  }

  if (filter.sector && filter.sector !== 'All') {
    list = list.filter((w) => w.sector === filter.sector);
  }

  if (filter.status && filter.status !== 'All') {
    list = list.filter((w) => w.status === filter.status);
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((w) => w.pinCode === filter.pinCode?.trim());
  }

  if (filter.sortBy) {
    if (filter.sortBy === 'cost_desc') {
      list.sort((a, b) => b.sanctionCostLakhs - a.sanctionCostLakhs);
    } else if (filter.sortBy === 'cost_asc') {
      list.sort((a, b) => a.sanctionCostLakhs - b.sanctionCostLakhs);
    } else if (filter.sortBy === 'date_desc') {
      list.sort((a, b) => new Date(b.sanctionDate).getTime() - new Date(a.sanctionDate).getTime());
    } else if (filter.sortBy === 'score_desc') {
      list.sort((a, b) => b.groundTruthScore - a.groundTruthScore);
    }
  }

  return list;
}

export function getWorkById(id: string): MpladsWork | undefined {
  return MOCK_MPLADS_WORKS.find((w) => w.id.toLowerCase() === id.toLowerCase());
}

export function getWorksByRepresentativeId(repId: string): MpladsWork[] {
  return MOCK_MPLADS_WORKS.filter((w) => w.representativeId.toLowerCase() === repId.toLowerCase());
}

export function getMpladsSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const works = MOCK_MPLADS_WORKS.filter((w) => w.pinCode === pinCode);
  
  // Find matching representative by state or district
  const matchedRep = MOCK_REPRESENTATIVES.find(
    (r) => r.state.toLowerCase() === loc.state.toLowerCase()
  ) || MOCK_REPRESENTATIVES[0];

  const totalSanctionedLakhs = works.reduce((sum, w) => sum + w.sanctionCostLakhs, 0);
  const totalSpentLakhs = works.reduce((sum, w) => sum + w.spentAmountLakhs, 0);
  const completedCount = works.filter((w) => w.status === 'Completed').length;
  const inProgressCount = works.filter((w) => w.status === 'In Progress').length;

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    representative: matchedRep,
    worksCount: works.length,
    completedCount,
    inProgressCount,
    totalSanctionedLakhs,
    totalSpentLakhs,
    works,
  };
}

export function compareRepresentatives(repIds: string[]): Representative[] {
  return MOCK_REPRESENTATIVES.filter((r) => repIds.includes(r.id));
}
