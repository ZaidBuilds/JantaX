import { describe, it, expect } from 'vitest';
import {
  getAllBooths,
  getBoothById,
  getBoothsByPin,
  getBoothSummaryForPin,
  getVoterFormGuides,
  getVoterGuideByForm,
} from '../../modules/booth/services/boothService';

describe('Booth / Electoral Roll Module — Unit & Integration Test Suite', () => {
  it('should retrieve all gazetted polling booths with valid BLO data', () => {
    const booths = getAllBooths();
    expect(booths.length).toBeGreaterThan(0);

    booths.forEach((b) => {
      expect(b.id).toBeDefined();
      expect(b.stationNumber).toBeGreaterThan(0);
      expect(b.buildingName).toBeTruthy();
      expect(b.roomNumber).toBeTruthy();
      expect(b.pinCode).toHaveLength(6);
      expect(b.assemblyConstituency).toBeTruthy();
      expect(b.blo.name).toBeTruthy();
      expect(b.blo.contactPhone).toBeTruthy();
      expect(b.maleElectors + b.femaleElectors + b.thirdGenderElectors).toBe(b.totalElectors);
    });
  });

  it('should retrieve a polling booth by unique ID', () => {
    const booth = getBoothById('BOOTH-DL-AC40-PS042');
    expect(booth).toBeDefined();
    expect(booth?.stationNumber).toBe(42);
    expect(booth?.buildingName).toContain('Sarvodaya Kanya Vidyalaya');
    expect(booth?.blo.name).toBe('Booth level officer (sample 1)');

    const notFound = getBoothById('NONEXISTENT-BOOTH-999');
    expect(notFound).toBeUndefined();
  });

  it('should filter booths by wheelchair ramp accessibility', () => {
    const rampBooths = getAllBooths({ hasWheelchairRamp: true });
    expect(rampBooths.length).toBeGreaterThan(0);
    rampBooths.forEach((b) => {
      expect(b.facilities.wheelchairRamp).toBe(true);
    });
  });

  it('should search booths by keyword, PIN, and BLO name', () => {
    const searchBySchool = getAllBooths({ query: 'Sarvodaya' });
    expect(searchBySchool.length).toBeGreaterThan(0);

    const searchByPin = getAllBooths({ pinCode: '110001' });
    expect(searchByPin.length).toBeGreaterThan(0);
    searchByPin.forEach((b) => expect(b.pinCode).toBe('110001'));

    const searchByBlo = getAllBooths({ query: 'Booth level officer (sample 2)' });
    expect(searchByBlo.length).toBeGreaterThan(0);
  });

  it('should generate accurate PIN locality booth summary', () => {
    const summary = getBoothSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.boothsCount).toBeGreaterThan(0);
    expect(summary.totalElectorsInPin).toBeGreaterThan(0);
    expect(summary.primaryAssemblyConstituency).toBeTruthy();
    expect(summary.primaryBlo).toBeDefined();
  });

  it('should provide statutory voter registration forms guide (Forms 6, 7, 8, 6A)', () => {
    const guides = getVoterFormGuides();
    expect(guides.length).toBeGreaterThanOrEqual(4);

    const form6 = getVoterGuideByForm('Form 6');
    expect(form6).toBeDefined();
    expect(form6?.title).toContain('New Voter Registration');
    expect(form6?.requiredDocuments.length).toBeGreaterThan(0);
    expect(form6?.submissionUrl).toContain('voters.eci.gov.in');

    const form8 = getVoterGuideByForm('Form 8');
    expect(form8).toBeDefined();
    expect(form8?.title).toContain('Correction of Entries');
  });
});
