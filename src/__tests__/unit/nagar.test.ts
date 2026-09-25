import { describe, it, expect } from 'vitest';
import {
  getAllWards,
  getWardById,
  getWardsByPin,
  getWardSummaryForPin,
  compareWards,
  getCivicCategories,
} from '../../modules/nagar/services/nagarService';

describe('Municipal / Nagar Nigam & Sanitation Module — Unit & Integration Test Suite', () => {
  it('should retrieve all municipal wards with valid councillor, sanitary inspector, and SLA data', () => {
    const wards = getAllWards();
    expect(wards.length).toBeGreaterThan(0);

    wards.forEach((w) => {
      expect(w.id).toBeDefined();
      expect(w.wardNumber).toBeGreaterThan(0);
      expect(w.wardName).toBeTruthy();
      expect(w.corporationName).toBeTruthy();
      expect(w.pinCode).toHaveLength(6);
      expect(w.cleanlinessScore).toBeGreaterThanOrEqual(0);
      expect(w.cleanlinessScore).toBeLessThanOrEqual(100);
      expect(w.councillor.name).toBeTruthy();
      expect(w.councillor.phone).toBeTruthy();
      expect(w.sanitaryInspector.name).toBeTruthy();
      expect(w.sanitaryInspector.phone).toBeTruthy();
      expect(w.avgResolutionHours).toBeGreaterThan(0);
      expect(w.civicHelpline).toBeTruthy();
    });
  });

  it('should retrieve a municipal ward by unique ID', () => {
    const ward = getWardById('WARD-DL-MCD042');
    expect(ward).toBeDefined();
    expect(ward?.wardName).toContain('Connaught Place');
    expect(ward?.wardNumber).toBe(42);
    expect(ward?.councillor.name).toBe('Ward councillor (sample 1)');

    const notFound = getWardById('NONEXISTENT-WARD-999');
    expect(notFound).toBeUndefined();
  });

  it('should filter wards by cleanliness score threshold (>=80)', () => {
    const highScoring = getAllWards({ minCleanlinessScore: 80 });
    expect(highScoring.length).toBeGreaterThan(0);
    highScoring.forEach((w) => {
      expect(w.cleanlinessScore).toBeGreaterThanOrEqual(80);
    });
  });

  it('should filter wards by 100% door-to-door garbage active', () => {
    const d2d = getAllWards({ doorToDoorOnly: true });
    expect(d2d.length).toBeGreaterThan(0);
    d2d.forEach((w) => {
      expect(w.services.doorToDoorGarbage).toBe(true);
    });
  });

  it('should search wards by councillor name, PIN, and keyword', () => {
    const byCouncillor = getAllWards({ query: 'councillor (sample 1)' });
    expect(byCouncillor.length).toBeGreaterThan(0);

    const pinWards = getAllWards({ pinCode: '110001' });
    expect(pinWards.length).toBeGreaterThan(0);
    pinWards.forEach((w) => expect(w.pinCode).toBe('110001'));
  });

  it('should sort wards by cleanliness score descending', () => {
    const sorted = getAllWards({ sortBy: 'score_desc' });
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].cleanlinessScore).toBeGreaterThanOrEqual(sorted[i + 1].cleanlinessScore);
    }
  });

  it('should generate accurate PIN locality ward summary', () => {
    const summary = getWardSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.ward).toBeDefined();
    expect(summary.cleanlinessScore).toBeGreaterThan(0);
    expect(summary.councillor).toBeDefined();
    expect(summary.sanitaryInspector).toBeDefined();
  });

  it('should support side-by-side municipal ward comparison', () => {
    const compared = compareWards(['WARD-DL-MCD042', 'WARD-DL-MCD054']);
    expect(compared.length).toBe(2);
    expect(compared[0].id).toBe('WARD-DL-MCD042');
    expect(compared[1].id).toBe('WARD-DL-MCD054');
  });

  it('should provide civic service categories with statutory Citizen Charter SLA resolution hours', () => {
    const categories = getCivicCategories();
    expect(categories.length).toBeGreaterThanOrEqual(4);

    const garbage = categories.find((c) => c.id === 'garbage');
    expect(garbage).toBeDefined();
    expect(garbage?.statutorySlaHours).toBe(12);

    const light = categories.find((c) => c.id === 'streetlight');
    expect(light).toBeDefined();
    expect(light?.statutorySlaHours).toBe(24);
  });
});
