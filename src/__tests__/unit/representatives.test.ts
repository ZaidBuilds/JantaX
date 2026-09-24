import { describe, it, expect } from 'vitest';
import { representativeService } from '../../modules/representatives/services/representativeService';

describe('Public Representatives & Multi-Tier Governance Subsystem', () => {
  it('loads multi-tier governance hierarchy for showcase PIN 250001 (Meerut)', async () => {
    const hierarchy = await representativeService.getLocalityHierarchy('250001');

    expect(hierarchy.pincode).toBe('250001');
    expect(hierarchy.district).toBe('Meerut');
    expect(hierarchy.state).toBe('Uttar Pradesh');
    expect(hierarchy.representatives.length).toBeGreaterThanOrEqual(4);

    // Check tiers
    const tiers = hierarchy.representatives.map((r) => r.tier);
    expect(tiers).toContain('GRAM_PANCHAYAT');
    expect(tiers).toContain('BLOCK_PANCHAYAT');
    expect(tiers).toContain('ZILA_PANCHAYAT');
    expect(tiers).toContain('MUNICIPAL_CHAIRMAN');
    expect(tiers).toContain('VIDHAN_SABHA');
    expect(tiers).toContain('LOK_SABHA');
  });

  it('audits representative fund summary calculations', async () => {
    const reps = await representativeService.getRepresentatives('250001');
    const gramPradhan = reps.find((r) => r.tier === 'GRAM_PANCHAYAT');

    expect(gramPradhan).toBeDefined();
    expect(gramPradhan?.name).toBe('Chaudhary Satish Tyagi');
    expect(gramPradhan?.fundSummary.releasedByGovtCr).toBeGreaterThan(0);
    expect(gramPradhan?.fundSummary.utilizationPercentage).toBeGreaterThanOrEqual(50);
    expect(gramPradhan?.fundSummary.unspentBalanceCr).toBeGreaterThanOrEqual(0);
  });

  it('tracks project cost hikes and contractor assignments', async () => {
    const works = await representativeService.getAllSanctionedWorks('250001');
    expect(works.length).toBeGreaterThan(0);

    const workWithHike = works.find((w) => w.costHikePercentage > 0);
    expect(workWithHike).toBeDefined();
    expect(workWithHike?.actualCostLakhs).toBeGreaterThan(workWithHike?.sanctionedCostLakhs || 0);
    expect(workWithHike?.contractorName).toBeDefined();
    expect(workWithHike?.contractorRating).toBeGreaterThanOrEqual(50);
  });

  it('deterministically resolves representatives for any generic Indian PIN code', async () => {
    const hierarchy = await representativeService.getLocalityHierarchy('560001'); // Bengaluru
    expect(hierarchy.pincode).toBe('560001');
    expect(hierarchy.representatives.length).toBeGreaterThanOrEqual(3);

    const ruralHierarchy = await representativeService.getLocalityHierarchy('800002'); // Bihar rural
    expect(ruralHierarchy.pincode).toBe('800002');
    expect(ruralHierarchy.representatives.some((r) => r.tier === 'GRAM_PANCHAYAT')).toBe(true);
  });
});
