import type { MunicipalWard, NagarFilter, CivicServiceCategory } from '../types/nagar';
import { MOCK_WARDS, CIVIC_CATEGORIES } from '../data/mockNagar';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllWards(filter?: NagarFilter): MunicipalWard[] {
  let list = [...MOCK_WARDS];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (w) =>
        w.wardName.toLowerCase().includes(q) ||
        w.wardNameHi.toLowerCase().includes(q) ||
        w.corporationName.toLowerCase().includes(q) ||
        w.councillor.name.toLowerCase().includes(q) ||
        w.sanitaryInspector.name.toLowerCase().includes(q) ||
        w.zone.toLowerCase().includes(q) ||
        w.district.toLowerCase().includes(q) ||
        w.pinCode.includes(q) ||
        w.wardNumber.toString() === q
    );
  }

  if (filter.corporation && filter.corporation !== 'All') {
    list = list.filter((w) => w.corporationName === filter.corporation);
  }

  if (filter.zone && filter.zone !== 'All') {
    list = list.filter((w) => w.zone === filter.zone);
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((w) => w.pinCode === filter.pinCode?.trim());
  }

  if (filter.minCleanlinessScore) {
    list = list.filter((w) => w.cleanlinessScore >= (filter.minCleanlinessScore || 0));
  }

  if (filter.doorToDoorOnly) {
    list = list.filter((w) => w.services.doorToDoorGarbage);
  }

  if (filter.sortBy === 'score_desc') {
    list.sort((a, b) => b.cleanlinessScore - a.cleanlinessScore);
  } else if (filter.sortBy === 'speed_asc') {
    list.sort((a, b) => a.avgResolutionHours - b.avgResolutionHours);
  } else if (filter.sortBy === 'complaints_desc') {
    list.sort((a, b) => b.resolvedComplaintsAnnual - a.resolvedComplaintsAnnual);
  }

  return list;
}

export function getWardById(id: string): MunicipalWard | undefined {
  const found = MOCK_WARDS.find((w) => w.id.toLowerCase() === id.toLowerCase());
  if (found) return found;

  const pinMatch = id.match(/(\d{6})/);
  if (pinMatch) {
    const pin = pinMatch[1];
    const loc = resolvePincode(pin);
    const base = MOCK_WARDS[0];
    return {
      ...base,
      id,
      wardNumber: Number(id.match(/\d+$/)?.[0] || 1),
      wardName: `${loc.district} Central Ward`,
      wardNameHi: `${loc.district} केंद्रीय वार्ड`,
      corporationName: `${loc.district} Municipal Corporation`,
      zone: `${loc.district} Urban Zone`,
      district: loc.district,
      state: loc.state,
      pinCode: pin,
    };
  }

  return undefined;
}

export function getWardsByPin(pinCode: string): MunicipalWard[] {
  return MOCK_WARDS.filter((w) => w.pinCode === pinCode);
}

export function getWardSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const wards = MOCK_WARDS.filter((w) => w.pinCode === pinCode);

  const matchedWard = wards[0] || MOCK_WARDS.find(w => w.state.toLowerCase() === loc.state.toLowerCase()) || MOCK_WARDS[0];

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    ward: matchedWard,
    wardsInAreaCount: wards.length || 1,
    cleanlinessScore: matchedWard.cleanlinessScore,
    councillor: matchedWard.councillor,
    sanitaryInspector: matchedWard.sanitaryInspector,
    doorToDoorGarbage: matchedWard.services.doorToDoorGarbage,
    avgResolutionHours: matchedWard.avgResolutionHours,
    civicHelpline: matchedWard.civicHelpline,
  };
}

export function compareWards(wardIds: string[]): MunicipalWard[] {
  return MOCK_WARDS.filter((w) => wardIds.includes(w.id));
}

export function getCivicCategories(): CivicServiceCategory[] {
  return CIVIC_CATEGORIES;
}
