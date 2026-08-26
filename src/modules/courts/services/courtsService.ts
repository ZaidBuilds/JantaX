import type { CourtComplex, CourtFilter, CnrStep } from '../types/courts';
import { MOCK_COURTS, CNR_SEARCH_STEPS } from '../data/mockCourts';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllCourts(filter?: CourtFilter): CourtComplex[] {
  let list = [...MOCK_COURTS];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.complexName.toLowerCase().includes(q) ||
        c.complexNameHi.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.pinCode.includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  if (filter.district && filter.district !== 'All') {
    list = list.filter((c) => c.district.toLowerCase() === filter.district?.toLowerCase());
  }

  if (filter.state && filter.state !== 'All') {
    list = list.filter((c) => c.state.toLowerCase() === filter.state?.toLowerCase());
  }

  if (filter.courtType && filter.courtType !== 'All') {
    list = list.filter((c) => c.courtType === filter.courtType);
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((c) => c.pinCode === filter.pinCode?.trim());
  }

  if (filter.minVacancyRate) {
    list = list.filter((c) => c.vacancyPercentage >= (filter.minVacancyRate || 0));
  }

  if (filter.sortBy === 'pendency_desc') {
    list.sort((a, b) => b.totalPendingCases - a.totalPendingCases);
  } else if (filter.sortBy === 'vacancy_desc') {
    list.sort((a, b) => b.vacancyPercentage - a.vacancyPercentage);
  } else if (filter.sortBy === 'over5years_desc') {
    list.sort((a, b) => b.pendingOver5Years - a.pendingOver5Years);
  } else if (filter.sortBy === 'disposal_asc') {
    list.sort((a, b) => a.avgDisposalDays - b.avgDisposalDays);
  }

  return list;
}

export function getCourtById(id: string): CourtComplex | undefined {
  return MOCK_COURTS.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getCourtsByPin(pinCode: string): CourtComplex[] {
  return MOCK_COURTS.filter((c) => c.pinCode === pinCode);
}

export function getCourtSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const courts = MOCK_COURTS.filter((c) => c.pinCode === pinCode);

  const matchedCourt = courts[0] || MOCK_COURTS.find(c => c.state.toLowerCase() === loc.state.toLowerCase()) || MOCK_COURTS[0];

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    court: matchedCourt,
    courtsInAreaCount: courts.length || 1,
    totalPendingCases: matchedCourt.totalPendingCases,
    judgeVacancyRate: matchedCourt.vacancyPercentage,
    pendingOver5Years: matchedCourt.pendingOver5Years,
    primaryStageBottleneck: matchedCourt.stageBreakdown[0]?.stage || 'Evidence Stage',
  };
}

export function compareCourts(courtIds: string[]): CourtComplex[] {
  return MOCK_COURTS.filter((c) => courtIds.includes(c.id));
}

export function getCnrSteps(): CnrStep[] {
  return CNR_SEARCH_STEPS;
}
