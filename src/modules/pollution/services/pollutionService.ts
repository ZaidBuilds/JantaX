import type { AirQualityStation, PollutionFilter, GrapStageRule } from '../types/pollution';
import { MOCK_STATIONS, GRAP_STAGE_RULES } from '../data/mockPollution';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllStations(filter?: PollutionFilter): AirQualityStation[] {
  let list = [...MOCK_STATIONS];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.stationName.toLowerCase().includes(q) ||
        s.stationNameHi.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.operator.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.pinCode.includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }

  if (filter.city && filter.city !== 'All') {
    list = list.filter((s) => s.city.toLowerCase() === filter.city?.toLowerCase());
  }

  if (filter.category && filter.category !== 'All') {
    list = list.filter((s) => s.category === filter.category);
  }

  if (filter.prominentPollutant && filter.prominentPollutant !== 'All') {
    list = list.filter((s) => s.prominentPollutant === filter.prominentPollutant);
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((s) => s.pinCode === filter.pinCode?.trim());
  }

  if (filter.minAqi) {
    list = list.filter((s) => s.currentAqi >= (filter.minAqi || 0));
  }

  if (filter.sortBy === 'aqi_desc') {
    list.sort((a, b) => b.currentAqi - a.currentAqi);
  } else if (filter.sortBy === 'aqi_asc') {
    list.sort((a, b) => a.currentAqi - b.currentAqi);
  } else if (filter.sortBy === 'pm25_desc') {
    list.sort((a, b) => b.pm25Value - a.pm25Value);
  }

  return list;
}

export function getStationById(id: string): AirQualityStation | undefined {
  return MOCK_STATIONS.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function getStationsByPin(pinCode: string): AirQualityStation[] {
  return MOCK_STATIONS.filter((s) => s.pinCode === pinCode);
}

export function getStationSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const stations = MOCK_STATIONS.filter((s) => s.pinCode === pinCode);

  const matchedStation = stations[0] || MOCK_STATIONS.find(s => s.state.toLowerCase() === loc.state.toLowerCase()) || MOCK_STATIONS[0];
  const activeGrap = getActiveGrapStage();

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    station: matchedStation,
    currentAqi: matchedStation.currentAqi,
    category: matchedStation.category,
    prominentPollutant: matchedStation.prominentPollutant,
    pm25Value: matchedStation.pm25Value,
    activeGrapStage: activeGrap.stageName,
    healthAdvisory: matchedStation.healthAdvisory,
  };
}

export function getGrapRules(): GrapStageRule[] {
  return GRAP_STAGE_RULES;
}

export function getActiveGrapStage(): GrapStageRule {
  return GRAP_STAGE_RULES.find((g) => g.isActive) || GRAP_STAGE_RULES[0];
}

export function compareStations(stationIds: string[]): AirQualityStation[] {
  return MOCK_STATIONS.filter((s) => stationIds.includes(s.id));
}
