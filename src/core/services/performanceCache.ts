export type FreshnessStatus = 'FRESH' | 'CACHED' | 'STALE';

export interface CachedEnvelope<T> {
  data: T;
  cachedAt: number;
  freshnessStatus: FreshnessStatus;
  ageMinutes: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const MEMORY_CACHE = new Map<string, { data: any; cachedAt: number }>();

export function setWithFreshness<T>(key: string, data: T): void {
  const envelope = { data, cachedAt: Date.now() };
  MEMORY_CACHE.set(key, envelope);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`jantax_cache_${key}`, JSON.stringify(envelope));
    } catch {}
  }
}

export function getWithFreshness<T>(key: string, ttlMs: number = 300000): CachedEnvelope<T> | null {
  let cached: { data: any; cachedAt: number } | null = MEMORY_CACHE.get(key) || null;

  if (!cached && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`jantax_cache_${key}`);
      if (raw) {
        cached = JSON.parse(raw);
        if (cached) MEMORY_CACHE.set(key, cached);
      }
    } catch {}
  }

  if (!cached) return null;

  const now = Date.now();
  const ageMs = now - cached.cachedAt;
  const ageMinutes = Math.floor(ageMs / 60000);

  let freshnessStatus: FreshnessStatus = 'FRESH';
  if (ageMs > ttlMs * 2) {
    freshnessStatus = 'STALE';
  } else if (ageMs > ttlMs) {
    freshnessStatus = 'CACHED';
  }

  return {
    data: cached.data as T,
    cachedAt: cached.cachedAt,
    freshnessStatus,
    ageMinutes
  };
}

export function paginateArray<T>(items: T[], page: number = 1, pageSize: number = 10): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / safePageSize) || 1;

  const startIndex = (safePage - 1) * safePageSize;
  const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize: safePageSize,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1
  };
}
