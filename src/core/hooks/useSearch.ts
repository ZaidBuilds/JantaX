import { useState, useEffect, useCallback, useRef } from 'react';
import { api, SearchResult, SearchResponse, AutocompleteSuggestion } from '../services/api';

export interface SearchFilters {
  type?: string;
  pincode?: string;
  state?: string;
  district?: string;
  status?: string;
}

export interface UseSearchOptions {
  debounceMs?: number;
  pageSize?: number;
  initialFilters?: SearchFilters;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: string | undefined) => void;
  page: number;
  setPage: (p: number) => void;
  total: number;
  refetch: () => void;
  search: (q: string) => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300, pageSize = 10, initialFilters = {} } = options;

  const [query, setQueryState] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 0 });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters, searchPage: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setPagination({ page: 1, limit: pageSize, total: 0, totalPages: 0 });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response: SearchResponse = await api.search({
        q: searchQuery,
        type: searchFilters.type,
        pincode: searchFilters.pincode,
        state: searchFilters.state,
        district: searchFilters.district,
        status: searchFilters.status,
        page: searchPage,
        limit: pageSize,
      });

      setResults(response.results);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setIsError(true);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilters, searchPage: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(searchQuery, searchFilters, searchPage);
    }, debounceMs);
  }, [executeSearch, debounceMs]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setPage(1);
    debouncedSearch(q, filters, 1);
  }, [filters, debouncedSearch]);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query, filters, page);
    } else {
      setResults([]);
      setPagination({ page: 1, limit: pageSize, total: 0, totalPages: 0 });
    }
  }, [query, filters, page, debouncedSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const updateFilter = useCallback((key: keyof SearchFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    executeSearch(query, filters, page);
  }, [query, filters, page, executeSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    setFilters,
    updateFilter,
    page,
    setPage,
    total: pagination.total,
    refetch,
    search: setQuery,
  };
}

export interface UseAutocompleteOptions {
  debounceMs?: number;
  minLength?: number;
}

export interface UseAutocompleteReturn {
  query: string;
  setQuery: (q: string) => void;
  suggestions: AutocompleteSuggestion[];
  isLoading: boolean;
  clear: () => void;
}

export function useAutocomplete(options: UseAutocompleteOptions = {}): UseAutocompleteReturn {
  const { debounceMs = 200, minLength = 2 } = options;

  const [query, setQueryState] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < minLength) {
      setSuggestions([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const response = await api.searchAutocomplete(q);
      setSuggestions(response.suggestions);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [minLength]);

  const debouncedFetch = useCallback((q: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(q);
    }, debounceMs);
  }, [fetchSuggestions, debounceMs]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    debouncedFetch(q);
  }, [debouncedFetch]);

  const clear = useCallback(() => {
    setQueryState('');
    setSuggestions([]);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return { query, setQuery, suggestions, isLoading, clear };
}

const RECENT_SEARCHES_KEY = 'jantax_recent_searches';
const MAX_RECENT = 10;

export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (!query.trim()) return;
  try {
    const recent = getRecentSearches().filter(s => s !== query);
    const updated = [query, ...recent].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}

export function removeRecentSearch(query: string): void {
  try {
    const recent = getRecentSearches().filter(s => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
  } catch {}
}

export const POPULAR_SEARCHES = [
  '110001',
  'RERA Mumbai',
  'DLF Group',
  'PMGSY Projects',
  'CGHS Schools',
  'Hospitals Delhi',
  'Builders Bangalore',
  'PWD Roads',
];
