import { describe, it, expect } from 'vitest';
import { getContractorById, searchContractors, getStoredContractors } from '../../modules/contractor/services/contractorService';

describe('Contractor Intelligence Service Tests', () => {
  it('should retrieve showcase contractors with rich profile data', () => {
    const lt = getContractorById('cont-lt-01');
    expect(lt).toBeDefined();
    expect(lt?.companyName).toContain('Larsen & Toubro');
    expect(lt?.category).toBe('Urban Transit & Metro');
    expect(lt?.performanceIndicators.overallScore).toBeGreaterThanOrEqual(90);
    expect(lt?.projects.length).toBeGreaterThan(0);
    expect(lt?.penalties.length).toBe(1);
  });

  it('should retrieve regional UP/Meerut showcase contractors', () => {
    const shreeRam = getContractorById('cont-mrt-01');
    expect(shreeRam).toBeDefined();
    expect(shreeRam?.companyName).toContain('Shree Ram Construction');
    expect(shreeRam?.category).toBe('Rural Roads & PMGSY');

    const doab = getContractorById('cont-mrt-04');
    expect(doab).toBeDefined();
    expect(doab?.companyName).toContain('Doab Drainage');
    expect(doab?.penalties.length).toBe(1);
  });

  it('should deterministically synthesize contractor profile for any arbitrary contractor ID', () => {
    const randomContractor = getContractorById('cont-pan-999001');
    expect(randomContractor).toBeDefined();
    expect(randomContractor?.id).toBe('cont-pan-999001');
    expect(randomContractor?.companyName).toBeDefined();
    expect(randomContractor?.performanceIndicators.overallScore).toBeGreaterThan(0);
    expect(randomContractor?.projects.length).toBeGreaterThan(0);
  });

  it('should filter contractors by search keyword, category, and minimum score', () => {
    const waterContractors = searchContractors({ category: 'Water & Sewage Specialist' });
    expect(waterContractors.length).toBeGreaterThan(0);
    expect(waterContractors.every(c => c.category.includes('Water'))).toBe(true);

    const highScorers = searchContractors({ minScore: 85 });
    expect(highScorers.length).toBeGreaterThan(0);
    expect(highScorers.every(c => c.performanceIndicators.overallScore >= 85)).toBe(true);
  });
});
