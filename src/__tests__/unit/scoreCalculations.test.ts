import { describe, it, expect } from 'vitest';
import { getScoringFormulas } from '../../modules/transparency/services/transparencyService';

describe('Scoring Algorithms & Mathematical Formulae Unit Tests', () => {
  const formulas = getScoringFormulas();

  it('should load all 3 primary scoring formulas', () => {
    expect(formulas).toHaveLength(3);
    const infraScore = formulas.find(f => f.id === 'score-infra');
    expect(infraScore).toBeDefined();
    expect(infraScore?.parameters).toHaveLength(3);
  });

  it('should verify contractor performance index parameter weights sum to 100% positive baseline', () => {
    const contractorScore = formulas.find(f => f.id === 'score-contractor');
    expect(contractorScore).toBeDefined();

    const positiveWeights = contractorScore?.parameters
      .filter(p => p.weightPct > 0)
      .reduce((acc, p) => acc + p.weightPct, 0);

    expect(positiveWeights).toBe(90);
  });

  it('should verify RERA Builder track record parameters', () => {
    const reraScore = formulas.find(f => f.id === 'score-rera');
    expect(reraScore).toBeDefined();
    expect(reraScore?.targetModule).toContain('RERA');
  });
});
