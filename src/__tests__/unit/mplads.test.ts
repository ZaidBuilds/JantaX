import { describe, it, expect } from 'vitest';
import {
  getAllRepresentatives,
  getRepresentativeById,
  getAllWorks,
  getWorkById,
  getWorksByRepresentativeId,
  getMpladsSummaryForPin,
  compareRepresentatives,
} from '../../modules/mplads/services/mpladsService';

describe('MPLADS Module — Unit & Integration Test Suite', () => {
  it('should fetch all representatives with valid fund summaries', () => {
    const reps = getAllRepresentatives();
    expect(reps.length).toBeGreaterThan(0);

    reps.forEach((rep) => {
      expect(rep.id).toBeDefined();
      expect(rep.name).toBeTruthy();
      expect(rep.fundSummary.releasedByGovtCr).toBeGreaterThan(0);
      expect(rep.fundSummary.sanctionedWorksCr).toBeLessThanOrEqual(rep.fundSummary.releasedByGovtCr);
      expect(rep.fundSummary.unspentBalanceCr).toBeGreaterThanOrEqual(0);
      expect(rep.fundSummary.utilizationPercentage).toBeGreaterThanOrEqual(0);
      expect(rep.fundSummary.utilizationPercentage).toBeLessThanOrEqual(100);
    });
  });

  it('should retrieve a representative by ID', () => {
    const rep = getRepresentativeById('REP-LS-DL-01');
    expect(rep).toBeDefined();
    expect(rep?.name).toBe('Sample representative A');
    expect(rep?.house).toBe('Lok Sabha');
    expect(rep?.constituencyName).toBe('New Delhi');

    const notFound = getRepresentativeById('INVALID-REP-99');
    expect(notFound).toBeUndefined();
  });

  it('should filter sanctioned works by sector and execution status', () => {
    const allWorks = getAllWorks();
    expect(allWorks.length).toBeGreaterThan(0);

    const waterWorks = getAllWorks({ sector: 'Drinking Water' });
    expect(waterWorks.length).toBeGreaterThan(0);
    waterWorks.forEach((w) => expect(w.sector).toBe('Drinking Water'));

    const completedWorks = getAllWorks({ status: 'Completed' });
    expect(completedWorks.length).toBeGreaterThan(0);
    completedWorks.forEach((w) => expect(w.status).toBe('Completed'));
  });

  it('should filter works by search query across multiple fields', () => {
    const solarWorks = getAllWorks({ query: 'Solar' });
    expect(solarWorks.length).toBeGreaterThan(0);

    const pinWorks = getAllWorks({ pinCode: '110001' });
    expect(pinWorks.length).toBeGreaterThan(0);
    pinWorks.forEach((w) => expect(w.pinCode).toBe('110001'));
  });

  it('should sort works by cost descending', () => {
    const sorted = getAllWorks({ sortBy: 'cost_desc' });
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].sanctionCostLakhs).toBeGreaterThanOrEqual(sorted[i + 1].sanctionCostLakhs);
    }
  });

  it('should retrieve works for a specific representative', () => {
    const works = getWorksByRepresentativeId('REP-LS-DL-01');
    expect(works.length).toBeGreaterThan(0);
    works.forEach((w) => expect(w.representativeId).toBe('REP-LS-DL-01'));
  });

  it('should generate accurate PIN locality fund summary', () => {
    const summary = getMpladsSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.representative).toBeDefined();
    expect(summary.worksCount).toBeGreaterThan(0);
    expect(summary.totalSanctionedLakhs).toBeGreaterThan(0);
    expect(summary.totalSpentLakhs).toBeGreaterThan(0);
  });

  it('should support side-by-side representative comparison', () => {
    const compared = compareRepresentatives(['REP-LS-DL-01', 'REP-LS-MH-02']);
    expect(compared.length).toBe(2);
    expect(compared[0].id).toBe('REP-LS-DL-01');
    expect(compared[1].id).toBe('REP-LS-MH-02');
  });
});
