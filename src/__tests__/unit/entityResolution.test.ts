import { describe, it, expect } from 'vitest';
import { resolvePincode } from '../../core/utils/pinResolver';

describe('Entity & Pincode Resolution Unit Tests', () => {
  it('should resolve Delhi pincode 110001', () => {
    const loc = resolvePincode('110001');
    expect(loc.state).toBe('Delhi');
    expect(loc.district).toBe('New Delhi');
  });

  it('should resolve Uttar Pradesh Meerut pincode 250401', () => {
    const loc = resolvePincode('250401');
    expect(loc.state).toBe('Uttar Pradesh');
    expect(loc.district).toBe('Meerut');
  });

  it('should resolve Karnataka Bengaluru pincode 560087', () => {
    const loc = resolvePincode('560087');
    expect(loc.state).toBe('Karnataka');
    expect(loc.district).toBe('Bengaluru');
  });

  it('should handle unknown pincode gracefully without throwing errors', () => {
    const loc = resolvePincode('999999');
    expect(loc).toBeDefined();
    expect(loc.pinCode).toBe('999999');
  });
});
