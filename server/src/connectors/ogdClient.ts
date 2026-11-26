// Shared client for the data.gov.in OGD API.
// Handles API key, filters, pagination, and timeouts in one place.

import { OGD, type OgdKey } from './ogdResources';

const BASE = 'https://api.data.gov.in/resource';

// Public sample key. data.gov.in caps it at 10 rows per request.
export const OGD_SAMPLE_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

export function ogdKey(): string {
  return process.env.DATA_GOV_IN_KEY?.trim() || OGD_SAMPLE_KEY;
}

export function usingSampleKey(): boolean {
  return ogdKey() === OGD_SAMPLE_KEY;
}

export interface OgdQuery {
  filters?: Record<string, string | number>;
  /** Max rows to collect across pages. Default 100. */
  max?: number;
  /** Rows per request. Ignored with the sample key (forced to 10). */
  pageSize?: number;
  timeoutMs?: number;
}

export interface OgdResult<T> {
  resourceId: string;
  title: string;
  total: number;
  records: T[];
  updatedDate: string | null;
  sourceUrl: string;
  fetchedAt: string;
  sampleKey: boolean;
}

interface OgdResponse<T> {
  title?: string;
  total?: number;
  records?: T[];
  updated_date?: string;
  error?: string;
  message?: string;
}

function buildUrl(id: string, offset: number, limit: number, filters: OgdQuery['filters']): string {
  const u = new URL(`${BASE}/${id}`);
  u.searchParams.set('api-key', ogdKey());
  u.searchParams.set('format', 'json');
  u.searchParams.set('offset', String(offset));
  u.searchParams.set('limit', String(limit));
  for (const [k, v] of Object.entries(filters ?? {})) {
    u.searchParams.set(`filters[${k}]`, String(v));
  }
  return u.toString();
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries on 429 / 5xx with backoff (1s, 3s). data.gov.in throttles often. */
async function fetchWithRetry(url: string, timeoutMs: number): Promise<Response> {
  const delays = [1000, 3000];
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: 'application/json' },
    });
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= delays.length) return res;
    await wait(delays[attempt]);
  }
}

/** Fetch rows from a raw resource ID. Throws on network or API error. */
export async function fetchOgdById<T = Record<string, unknown>>(
  id: string,
  q: OgdQuery = {},
): Promise<OgdResult<T>> {
  const sample = usingSampleKey();
  const max = q.max ?? 100;
  const pageSize = sample ? 10 : Math.min(q.pageSize ?? 500, max);
  const timeoutMs = q.timeoutMs ?? 20000;

  const records: T[] = [];
  let total = 0;
  let title = '';
  let updatedDate: string | null = null;
  let offset = 0;

  while (records.length < max) {
    const res = await fetchWithRetry(buildUrl(id, offset, pageSize, q.filters), timeoutMs);
    if (!res.ok) throw new Error(`OGD ${id} HTTP ${res.status}`);

    const body = (await res.json()) as OgdResponse<T>;
    if (body.error) throw new Error(`OGD ${id}: ${body.error}`);

    title = body.title ?? title;
    total = Number(body.total ?? 0);
    updatedDate = body.updated_date ?? updatedDate;

    const page = body.records ?? [];
    records.push(...page);
    offset += page.length;
    if (page.length === 0 || offset >= total) break;
  }

  return {
    resourceId: id,
    title,
    total,
    records: records.slice(0, max),
    updatedDate,
    sourceUrl: `https://data.gov.in/resource/${id}`,
    fetchedAt: new Date().toISOString(),
    sampleKey: sample,
  };
}

/** Fetch rows from a registered resource by its registry key. */
export function fetchOgd<T = Record<string, unknown>>(key: OgdKey, q: OgdQuery = {}) {
  return fetchOgdById<T>(OGD[key].id, q);
}
