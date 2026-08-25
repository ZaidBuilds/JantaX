import { describe, it, expect } from 'vitest';
import { deriveLifecycle, hashStr, STAGE_ORDER, type ReportItem } from './govtResponseLogic';

const mk = (id: string): ReportItem => ({
  id,
  pincode: '110001',
  module: 'school',
  description: 'Road broken',
});

describe('GovtResponseTracker lifecycle (master def 08)', () => {
  it('maps each report to a valid GovtStage in order', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const { stage } = deriveLifecycle(mk('report-' + i));
      expect(STAGE_ORDER).toContain(stage);
      seen.add(stage);
    }
    // determinism should yield multiple distinct stages across many ids
    expect(seen.size).toBeGreaterThan(1);
  });

  it('delayDays is bounded 3..62 and original is never deleted', () => {
    for (let i = 0; i < 200; i++) {
      const { delayDays, originalKept } = deriveLifecycle(mk('r' + i));
      expect(delayDays).toBeGreaterThanOrEqual(3);
      expect(delayDays).toBeLessThanOrEqual(62);
      expect(originalKept).toBe(true);
    }
  });

  it('is deterministic for the same id', () => {
    const a = deriveLifecycle(mk('abc-123'));
    const b = deriveLifecycle(mk('abc-123'));
    expect(a).toEqual(b);
  });

  it('hashStr is stable and non-negative', () => {
    expect(hashStr('x')).toBe(hashStr('x'));
    expect(hashStr('x')).toBeGreaterThanOrEqual(0);
  });
});
