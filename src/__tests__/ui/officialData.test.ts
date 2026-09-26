import { describe, expect, it } from 'vitest';
import { formatValue, isConnected, type Column } from '../../core/services/officialData';

const col = (type: Column['type'], unit: string | null = null): Column => ({ id: 'x', label: 'X', type, unit });

describe('official data formatting', () => {
  it('formats values the way Indian readers expect', () => {
    expect(formatValue(1234567, col('int'))).toBe('12,34,567');
    expect(formatValue(96, col('percent', '%'))).toBe('96%');
    expect(formatValue(1200000, col('number', '₹'))).toBe('₹12,00,000');
    expect(formatValue(12.5, col('number', '₹ cr'))).toBe('₹12.5 cr');
    expect(formatValue(18, col('number', 'h'))).toBe('18 h');
    expect(formatValue('2024-03-31', col('date'))).toBe('31 Mar 2024');
    expect(formatValue('2024-03', col('date'))).toBe('Mar 2024');
    expect(formatValue(true, col('bool'))).toBe('Yes');
  });

  it('shows a dash for missing values, never a zero', () => {
    expect(formatValue(null, col('int'))).toBe('—');
    expect(formatValue('', col('text'))).toBe('—');
  });

  it('counts only datasets with published rows as connected', () => {
    expect(['live', 'stale', 'failing'].every((s) => isConnected(s as never))).toBe(true);
    expect(['needs-setting', 'needs-file', 'ready'].some((s) => isConnected(s as never))).toBe(false);
  });
});
