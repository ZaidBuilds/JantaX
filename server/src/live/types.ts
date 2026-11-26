// Every live domain returns this shape. No invented values:
// if a source has nothing, `available` is false and `reason` says why.

export interface LiveSource {
  name: string;
  url: string;
  resourceId?: string;
  updatedDate: string | null;
  level: string;
}

export interface LiveResult<T> {
  domain: string;
  available: boolean;
  records: T[];
  total: number;
  source: LiveSource | null;
  reason?: string;
  fetchedAt: string;
}

export function unavailable<T>(domain: string, reason: string): LiveResult<T> {
  return {
    domain,
    available: false,
    records: [],
    total: 0,
    source: null,
    reason,
    fetchedAt: new Date().toISOString(),
  };
}

export function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '' || v === 'NA') return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}
