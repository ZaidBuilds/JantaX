import type { PollingBooth, BoothFilter, VoterFormGuideItem } from '../types/booth';
import { MOCK_POLLING_BOOTHS, VOTER_FORMS_GUIDE } from '../data/mockBooths';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllBooths(filter?: BoothFilter): PollingBooth[] {
  let list = [...MOCK_POLLING_BOOTHS];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.buildingName.toLowerCase().includes(q) ||
        b.buildingNameHi.toLowerCase().includes(q) ||
        b.assemblyConstituency.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q) ||
        b.blo.name.toLowerCase().includes(q) ||
        b.pinCode.includes(q) ||
        b.id.toLowerCase().includes(q)
    );
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((b) => b.pinCode === filter.pinCode?.trim());
  }

  if (filter.assemblyConstituency && filter.assemblyConstituency !== 'All') {
    list = list.filter((b) => b.assemblyConstituency.includes(filter.assemblyConstituency!));
  }

  if (filter.hasWheelchairRamp) {
    list = list.filter((b) => b.facilities.wheelchairRamp);
  }

  if (filter.sortBy === 'electors_desc') {
    list.sort((a, b) => b.totalElectors - a.totalElectors);
  } else {
    list.sort((a, b) => a.stationNumber - b.stationNumber);
  }

  return list;
}

export function getBoothById(id: string): PollingBooth | undefined {
  return MOCK_POLLING_BOOTHS.find((b) => b.id.toLowerCase() === id.toLowerCase());
}

export function getBoothsByPin(pinCode: string): PollingBooth[] {
  return MOCK_POLLING_BOOTHS.filter((b) => b.pinCode === pinCode);
}

export function getBoothSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const booths = MOCK_POLLING_BOOTHS.filter((b) => b.pinCode === pinCode);

  const matchedBooth = booths[0] || MOCK_POLLING_BOOTHS[0];
  const totalElectorsInPin = booths.reduce((sum, b) => sum + b.totalElectors, 0);

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    boothsCount: booths.length,
    totalElectorsInPin,
    primaryAssemblyConstituency: matchedBooth.assemblyConstituency,
    primaryParliamentaryConstituency: matchedBooth.parliamentaryConstituency,
    primaryBlo: matchedBooth.blo,
    booths,
  };
}

export function getVoterFormGuides(): VoterFormGuideItem[] {
  return VOTER_FORMS_GUIDE;
}

export function getVoterGuideByForm(formType: string): VoterFormGuideItem | undefined {
  return VOTER_FORMS_GUIDE.find((g) => g.formType.toLowerCase() === formType.toLowerCase());
}
