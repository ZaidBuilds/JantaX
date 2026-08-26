import { describe, it, expect } from 'vitest';
import { checkDuplicateReport, calculateSpamScore } from '../../modules/reporting/services/reportingService';
import { getStoredGovtSources, getSyncStatuses } from '../../modules/transparency/services/transparencyService';

describe('Data Integrity & UI/Accessibility Verification Tests', () => {
  it('should detect duplicate reports based on PIN, category, and text overlap', () => {
    const dup = checkDuplicateReport('110001', 'Road', 'Deep road cave-in and asphalt erosion observed Mayur Vihar phase 1 exit ramp');
    expect(dup).toBeDefined();
    expect(dup?.category).toBe('Road');
  });

  it('should calculate spam score for suspicious commercial keyword text', () => {
    const cleanScore = calculateSpamScore('Pothole Hazard near School', 'Deep cavity in asphalt road creating commuter risk');
    expect(cleanScore).toBeLessThan(20);

    const spamScore = calculateSpamScore('Buy Cheap Crypto', 'visit http://spam-casino.xyz for cheap loan discount');
    expect(spamScore).toBeGreaterThanOrEqual(50);
  });

  it('should verify primary government source URL validities', () => {
    const sources = getStoredGovtSources();
    sources.forEach((s) => {
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.licenseAndUsageRules).toBeDefined();
    });
  });

  it('should check data freshness sync statuses and report health', () => {
    const syncItems = getSyncStatuses();
    expect(syncItems.length).toBeGreaterThan(0);
    syncItems.forEach((s) => {
      expect(s.syncHealthPct).toBeGreaterThan(90);
    });
  });
});
