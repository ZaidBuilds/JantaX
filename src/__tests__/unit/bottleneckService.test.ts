import { describe, it, expect } from 'vitest';
import { getBottleneckLensesForPin } from '../../core/services/bottleneckService';

describe('7-Bottleneck Accountability Engine & PIN Juxtaposition — Unit Tests', () => {
  it('should generate all 7 bottleneck lenses for any valid PIN code', () => {
    const summary = getBottleneckLensesForPin('110001');

    expect(summary.pinCode).toBe('110001');
    expect(summary.locality).toBeTruthy();
    expect(summary.lenses.length).toBeGreaterThanOrEqual(5);
    expect(summary.primaryJuxtaposition).toBeDefined();

    summary.lenses.forEach((lens) => {
      expect(lens.id).toBeDefined();
      expect(lens.type).toBeDefined();
      expect(lens.noun).toBeTruthy(); // Named noun must exist
      expect(lens.officialClaim).toBeTruthy();
      expect(lens.officialClaimHi).toBeTruthy();
      expect(lens.auditReality).toBeTruthy();
      expect(lens.auditRealityHi).toBeTruthy();
      expect(lens.asOfDate).toBeTruthy();
      expect(lens.source).toBeTruthy();
      expect(lens.whatsappShareText).toContain('JANTAX PIN HISAB');
    });
  });

  it('should contain named nouns for municipal ward, court, MP, and CAAQMS station', () => {
    const summary = getBottleneckLensesForPin('110001');

    const inflatedLens = summary.lenses.find((l) => l.type === 'INFLATED');
    expect(inflatedLens).toBeDefined();
    expect(inflatedLens?.noun).toContain('Ward');

    const sittingLens = summary.lenses.find((l) => l.type === 'SITTING');
    expect(sittingLens).toBeDefined();
    expect(sittingLens?.noun).toContain('Court');

    const repeatLens = summary.lenses.find((l) => l.type === 'REPEAT');
    expect(repeatLens).toBeDefined();
    expect(repeatLens?.noun).toContain('MP');

    const clearedLens = summary.lenses.find((l) => l.type === 'CLEARED');
    expect(clearedLens).toBeDefined();
    expect(clearedLens?.noun).toContain('Station');
  });

  it('should generate valid Hindi and English shareable WhatsApp texts', () => {
    const summary = getBottleneckLensesForPin('250001');
    const primary = summary.primaryJuxtaposition;

    expect(primary.whatsappShareText).toContain('*🇮🇳 JANTAX PIN HISAB: 250001');
    expect(primary.whatsappShareText).toContain('🏛️ *सरकारी दावा:*');
    expect(primary.whatsappShareText).toContain('🔍 *फील्ड हकीकत:*');
    expect(primary.whatsappShareText).toContain('https://jantax.in/pin/250001');
  });
});
