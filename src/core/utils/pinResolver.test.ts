import { describe, it, expect } from 'vitest';
import { resolvePincode, isValidIndianPincode, getDeterministicIndex } from '../../core/utils/pinResolver';

describe('pinResolver — stateCode resolution', () => {
  it('resolves a known Delhi PIN with stateCode DL', () => {
    const loc = resolvePincode('110001');
    expect(loc.isValid).toBe(true);
    expect(loc.state).toBe('Delhi');
    expect(loc.stateCode).toBe('DL');
    expect(loc.district).toBe('New Delhi');
  });

  it('resolves a known UP PIN with stateCode UP', () => {
    const loc = resolvePincode('250001');
    expect(loc.isValid).toBe(true);
    expect(loc.state).toBe('Uttar Pradesh');
    expect(loc.stateCode).toBe('UP');
  });

  it('resolves all 22 mapped prefixes to a non-empty stateCode', () => {
    const prefixes = ['110','400','411','246','248','226','250','560','600','700','380','302','160','500','682','452','800','781','403','180','737','795'];
    for (const p of prefixes) {
      const loc = resolvePincode(p + '001');
      expect(loc.isValid).toBe(true);
      expect(loc.stateCode.length).toBe(2);
    }
  });

  it('rejects invalid PINs (too short, non-numeric, leading zero)', () => {
    expect(isValidIndianPincode('12345')).toBe(false);
    expect(isValidIndianPincode('1234567')).toBe(false);
    expect(isValidIndianPincode('023456')).toBe(false);
    expect(isValidIndianPincode('abcdef')).toBe(false);
  });

  it('returns isValid:false for malformed input but keeps pinCode', () => {
    const loc = resolvePincode('12');
    expect(loc.isValid).toBe(false);
    expect(loc.pinCode).toBe('12');
  });

  it('getDeterministicIndex stays within bounds', () => {
    for (let i = 0; i < 100; i++) {
      const idx = getDeterministicIndex('pin-' + i, 8);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(8);
    }
  });
});
