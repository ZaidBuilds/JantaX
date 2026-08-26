import { useState, useCallback, useEffect } from 'react';
import type { DataStatus } from './DataStateProvider';

export type { DataStatus };

export interface DataState<T> {
  data: T | null;
  status: DataStatus;
  error: Error | null;
  lastUpdated: Date | null;
  sourceInfo?: {
    name: string;
    lastSync: Date | null;
    isStale: boolean;
  };
}

export interface UseDataStateOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialStatus?: DataStatus;
  staleAfter?: number;
}

export interface UseDataStateReturn<T> {
  data: T | null;
  setData: (data: T | null) => void;
  status: DataStatus;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isOffline: boolean;
  isEmpty: boolean;
  isNoResults: boolean;
  isPartial: boolean;
  isStale: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  setStatus: (status: DataStatus) => void;
  setError: (error: Error | null) => void;
}

export function useDataState<T>(
  options: UseDataStateOptions<T>
): UseDataStateReturn<T> {
  const { fetchFn, onSuccess, onError, initialStatus = 'idle', staleAfter = 24 * 60 * 60 * 1000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<DataStatus>(initialStatus);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isStale =
    lastUpdated !== null &&
    Date.now() - lastUpdated.getTime() > staleAfter;

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setLastUpdated(new Date());
      setStatus(Array.isArray(result) && result.length === 0 ? 'empty' : 'success');
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      if (!navigator.onLine) {
        setStatus('offline');
      } else {
        setStatus('error');
      }
      setError(error);
      onError?.(error);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (status === 'idle') {
      refresh();
    }
  }, [status, refresh]);

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isOffline = status === 'offline';
  const isEmpty = status === 'empty';
  const isNoResults = status === 'no-results';
  const isPartial = status === 'partial';

  return {
    data,
    setData,
    status,
    error,
    isLoading,
    isError,
    isOffline,
    isEmpty,
    isNoResults,
    isPartial,
    isStale,
    lastUpdated,
    refresh,
    setStatus,
    setError,
  };
}

export interface AsyncDataState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export function useAsyncData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    staleTime?: number;
    onSuccess?: (data: T) => void;
  }
): AsyncDataState<T> & { data: T | undefined } {
  const { staleTime = 5 * 60 * 1000, onSuccess } = options || {};

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [lastFetched, setLastFetched] = useState<number>(0);

  const refetch = useCallback(async () => {
    if (!navigator.onLine) {
      setIsError(true);
      setError(new Error('You are offline'));
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await fetcher();
      setData(result);
      setLastFetched(Date.now());
      onSuccess?.(result);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, onSuccess]);

  useEffect(() => {
    const now = Date.now();
    const isStale = now - lastFetched > staleTime;

    if (data === undefined || isStale) {
      refetch();
    } else {
      setIsLoading(false);
    }
  }, [key, staleTime, lastFetched, refetch, data]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  const reset = useCallback(() => {
    setPage(1);
    setTotal(0);
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage: goToPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
