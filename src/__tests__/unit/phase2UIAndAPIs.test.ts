import { describe, it, expect } from 'vitest';
import { generateServerRepresentatives } from '../../../server/src/routes/representatives';
import { generateServerSchemes } from '../../../server/src/routes/schemes';

describe('Phase 2 Master Architecture: UI/UX Primitives and Back-End REST APIs', () => {
  describe('Back-End Representatives API (Multi-Tier Governance)', () => {
    it('generates 3-tier governance hierarchy for rural/semi-urban PIN code (250001 Meerut)', () => {
      const hierarchy = generateServerRepresentatives('250001', 'Meerut', 'Uttar Pradesh');

      expect(hierarchy.pincode).toBe('250001');
      expect(hierarchy.district).toBe('Meerut');
      expect(hierarchy.state).toBe('Uttar Pradesh');
      expect(hierarchy.representatives.length).toBe(3);

      const tiers = hierarchy.representatives.map((r) => r.tier);
      expect(tiers).toContain('MLA');
      expect(tiers).toContain('MP_LOK_SABHA');

      // Fund summaries
      expect(hierarchy.totalLocalBudgetCr).toBeGreaterThan(0);
      expect(hierarchy.totalSpentCr).toBeGreaterThan(0);
      expect(hierarchy.overallUtilizationRate).toBeGreaterThanOrEqual(0);
      expect(hierarchy.overallUtilizationRate).toBeLessThanOrEqual(100);

      // Verify MP Lok Sabha representative details
      const mp = hierarchy.representatives.find((r) => r.tier === 'MP_LOK_SABHA');
      expect(mp).toBeDefined();
      expect(mp?.fundSummary.fundSchemeName).toContain('MPLADS');
      expect(mp?.fundSummary.entitledAmountCr).toBe(10.0);
      expect(mp?.works.length).toBeGreaterThan(0);
    });

    it('generates multi-tier governance hierarchy for metro PIN code (110001 New Delhi)', () => {
      const hierarchy = generateServerRepresentatives('110001', 'New Delhi', 'Delhi');

      expect(hierarchy.pincode).toBe('110001');
      expect(hierarchy.district).toBe('New Delhi');
      expect(hierarchy.representatives.length).toBe(3);

      const mla = hierarchy.representatives.find((r) => r.tier === 'MLA');
      expect(mla).toBeDefined();
      expect(mla?.fundSummary.fundSchemeName).toContain('Vidhayak Nidhi');
      expect(mla?.works[0].status).toBe('Completed');
      expect(mla?.works[0].dlpStatus).toBe('Active DLP');
    });
  });

  describe('Back-End Schemes API (Flagship Central & State Missions)', () => {
    it('generates flagship schemes and statutory warranty status for PIN 250001', () => {
      const summary = generateServerSchemes('250001', 'Meerut', 'Uttar Pradesh');

      expect(summary.pincode).toBe('250001');
      expect(summary.district).toBe('Meerut');
      expect(summary.projects.length).toBe(4);
      expect(summary.totalSanctionedBudgetCr).toBeGreaterThan(30);
      expect(summary.totalFundsUtilizedCr).toBeGreaterThan(20);
      expect(summary.overallProgressPercentage).toBeGreaterThanOrEqual(50);

      const schemeNames = summary.projects.map((p) => p.schemeName);
      expect(schemeNames.some((n) => n.includes('PMGSY'))).toBe(true);
      expect(schemeNames.some((n) => n.includes('Jal Jeevan Mission'))).toBe(true);
      expect(schemeNames.some((n) => n.includes('PMAY'))).toBe(true);
      expect(schemeNames.some((n) => n.includes('AMRUT'))).toBe(true);

      // Verify statutory Defect Liability Period (DLP) parameters
      const pmgsy = summary.projects.find((p) => p.schemeName.includes('PMGSY'));
      expect(pmgsy?.dlpMonths).toBe(36); // Standard IRC 3-year warranty

      const rera = summary.projects.find((p) => p.schemeName.includes('PMAY'));
      expect(rera?.dlpMonths).toBe(60); // RERA Section 14(3) 5-year structural warranty
    });
  });
});
