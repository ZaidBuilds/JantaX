import { useState, useCallback } from 'react';
import { resolvePincode, ResolvedLocation } from '../utils/pinResolver';

export function usePinSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResolvedLocation | null>(null);

  const search = useCallback((pin: string) => {
    const cleaned = pin.replace(/\D/g, '').substring(0, 6);
    setQuery(cleaned);

    if (cleaned.length === 6) {
      setResult(resolvePincode(cleaned));
    } else {
      setResult(null);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResult(null);
  }, []);

  return { query, result, search, clear };
}
