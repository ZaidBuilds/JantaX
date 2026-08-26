import { describe, it, expect } from 'vitest';
import {
  getAllStations,
  getStationById,
  getStationsByPin,
  getStationSummaryForPin,
  getGrapRules,
  getActiveGrapStage,
  compareStations,
} from '../../modules/pollution/services/pollutionService';

describe('Air Quality & Pollution Action Module — Unit & Integration Test Suite', () => {
  it('should retrieve all CAAQMS air quality stations with valid AQI and pollutant data', () => {
    const stations = getAllStations();
    expect(stations.length).toBeGreaterThan(0);

    stations.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.stationName).toBeTruthy();
      expect(s.operator).toBeTruthy();
      expect(s.pinCode).toHaveLength(6);
      expect(s.currentAqi).toBeGreaterThanOrEqual(0);
      expect(s.category).toBeTruthy();
      expect(s.prominentPollutant).toBeTruthy();
      expect(s.pm25Value).toBeGreaterThan(0);
      expect(s.pm10Value).toBeGreaterThan(0);
      expect(s.healthAdvisory).toBeTruthy();
      expect(s.trend24h.length).toBeGreaterThan(0);
    });
  });

  it('should retrieve an air monitoring station by unique ID', () => {
    const station = getStationById('AQI-DL-ITO01');
    expect(station).toBeDefined();
    expect(station?.stationName).toContain('ITO');
    expect(station?.city).toBe('New Delhi');
    expect(station?.prominentPollutant).toBe('PM2.5');

    const notFound = getStationById('NONEXISTENT-STATION-999');
    expect(notFound).toBeUndefined();
  });

  it('should filter stations by AQI category', () => {
    const poorStations = getAllStations({ category: 'Poor' });
    expect(poorStations.length).toBeGreaterThan(0);
    poorStations.forEach((s) => {
      expect(s.category).toBe('Poor');
    });
  });

  it('should filter stations by prominent pollutant (PM2.5)', () => {
    const pm25Stations = getAllStations({ prominentPollutant: 'PM2.5' });
    expect(pm25Stations.length).toBeGreaterThan(0);
    pm25Stations.forEach((s) => {
      expect(s.prominentPollutant).toBe('PM2.5');
    });
  });

  it('should search stations by name, city, operator, and PIN', () => {
    const ito = getAllStations({ query: 'ITO' });
    expect(ito.length).toBeGreaterThan(0);

    const pinStations = getAllStations({ pinCode: '110001' });
    expect(pinStations.length).toBeGreaterThan(0);
    pinStations.forEach((s) => expect(s.pinCode).toBe('110001'));
  });

  it('should sort stations by AQI descending', () => {
    const sorted = getAllStations({ sortBy: 'aqi_desc' });
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].currentAqi).toBeGreaterThanOrEqual(sorted[i + 1].currentAqi);
    }
  });

  it('should generate accurate PIN locality air quality summary', () => {
    const summary = getStationSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.station).toBeDefined();
    expect(summary.currentAqi).toBeGreaterThan(0);
    expect(summary.category).toBeTruthy();
    expect(summary.activeGrapStage).toBeTruthy();
    expect(summary.healthAdvisory).toBeTruthy();
  });

  it('should provide full CAQM 4-stage GRAP restriction rules', () => {
    const grapRules = getGrapRules();
    expect(grapRules.length).toBe(4);

    const activeStage = getActiveGrapStage();
    expect(activeStage).toBeDefined();
    expect(activeStage.stageNumber).toBeGreaterThanOrEqual(1);
    expect(activeStage.bannedActivities.length).toBeGreaterThan(0);
  });

  it('should support side-by-side air monitoring station comparison', () => {
    const compared = compareStations(['AQI-DL-ITO01', 'AQI-DL-ANV02']);
    expect(compared.length).toBe(2);
    expect(compared[0].id).toBe('AQI-DL-ITO01');
    expect(compared[1].id).toBe('AQI-DL-ANV02');
  });
});
