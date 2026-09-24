import { describe, it, expect } from 'vitest';
import { schemeService } from '../../modules/schemes/services/schemeService';

describe('Central and State Government Schemes Tracker Subsystem', () => {
  it('loads scheme summary for showcase PIN 250001 (Meerut)', async () => {
    const summary = await schemeService.getLocalitySchemesSummary('250001');

    expect(summary.pincode).toBe('250001');
    expect(summary.district).toBe('Meerut');
    expect(summary.totalProjectsCount).toBeGreaterThanOrEqual(3);
    expect(summary.totalSanctionedBudgetCr).toBeGreaterThan(50);
    expect(summary.overallProgressPercentage).toBeGreaterThanOrEqual(50);

    const categories = summary.projects.map((p) => p.category);
    expect(categories).toContain('RAILWAY_CORRIDOR'); // RRTS
    expect(categories).toContain('ROADS_CONNECTIVITY'); // PMGSY
    expect(categories).toContain('WATER_SANITATION'); // Jal Jeevan
  });

  it('verifies RRTS project details and milestones', async () => {
    const projects = await schemeService.getSchemeProjects('250001');
    const rrts = projects.find((p) => p.schemeId === 'NAMO-BHARAT-RRTS');

    expect(rrts).toBeDefined();
    expect(rrts?.contractorName).toContain('Larsen & Toubro');
    expect(rrts?.status).toBe('Under Construction');
    expect(rrts?.milestones.length).toBeGreaterThan(0);
    expect(rrts?.milestones.some((m) => m.isCompleted)).toBe(true);
  });

  it('filters scheme projects by category', async () => {
    const waterProjects = await schemeService.getProjectsByCategory('250001', 'WATER_SANITATION');
    expect(waterProjects.length).toBeGreaterThan(0);
    expect(waterProjects[0].category).toBe('WATER_SANITATION');
    expect(waterProjects[0].schemeName).toContain('Jal Jeevan Mission');
  });

  it('deterministically generates schemes for any Indian PIN code', async () => {
    const summary = await schemeService.getLocalitySchemesSummary('400001'); // Mumbai
    expect(summary.pincode).toBe('400001');
    expect(summary.projects.length).toBeGreaterThanOrEqual(2);
    expect(summary.totalSanctionedBudgetCr).toBeGreaterThan(0);
  });
});
