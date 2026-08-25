import { useEffect, useState } from 'react';
import { api, type ApiRecord } from '../services/api';

export function useCatalog(pinCode?: string) {
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);
    setRecords([]);

    const request = pinCode
      ? api.getRecords(pinCode).then(r => [...(r.records.school || []), ...(r.records.infra || [])])
      : api.getRecords('110001').then(r => [...(r.records.school || []), ...(r.records.infra || [])]);

    request
      .then(nextRecords => {
        if (isActive) setRecords(nextRecords);
      })
      .catch(nextError => {
        if (isActive) setError(nextError instanceof Error ? nextError : new Error('Catalog request failed'));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [pinCode]);

  return { records, isLoading, error };
}
