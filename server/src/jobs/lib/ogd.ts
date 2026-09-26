/**
 * Client for the Open Government Data (OGD) Platform India API, api.data.gov.in.
 *
 * Every dataset ("resource") is served at /resource/{resourceId} and paged with
 * offset/limit. An API key is required; get one free at https://data.gov.in (My Account → API key).
 */

export interface OgdField {
  id: string;
  name?: string;
  type?: string;
}

export interface OgdResponse {
  status?: string;
  message?: string;
  title?: string;
  updated_date?: string;
  total: number;
  count: number;
  limit: number | string;
  offset: number | string;
  field?: OgdField[];
  records: Record<string, unknown>[];
}

export interface OgdFetchOptions {
  apiKey?: string;
  /** Exact-match filters, sent as filters[field]=value. */
  filters?: Record<string, string>;
  pageSize?: number;
  /** Stop after this many records (useful for dry runs). */
  maxRecords?: number;
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
  /** Pause between pages so a full download stays inside the platform's rate limits. */
  pageDelayMs?: number;
  fetchImpl?: typeof fetch;
}

export interface OgdResult {
  records: Record<string, unknown>[];
  total: number;
  fields: OgdField[];
  title?: string;
  updatedDate?: string;
  urls: string[];
}

export class OgdConfigError extends Error {}

const DEFAULT_BASE = 'https://api.data.gov.in';

export function ogdApiKey(explicit?: string): string {
  const key = explicit ?? process.env.DATA_GOV_IN_API_KEY ?? '';
  if (!key) {
    throw new OgdConfigError(
      'DATA_GOV_IN_API_KEY is not set. Create a free key at https://data.gov.in (My Account → API key) and add it to .env.'
    );
  }
  return key;
}

export function ogdUrl(resourceId: string, opts: { apiKey: string; offset: number; limit: number; filters?: Record<string, string>; baseUrl?: string }): string {
  const u = new URL(`/resource/${resourceId}`, opts.baseUrl || process.env.OGD_API_BASE || DEFAULT_BASE);
  u.searchParams.set('api-key', opts.apiKey);
  u.searchParams.set('format', 'json');
  u.searchParams.set('offset', String(opts.offset));
  u.searchParams.set('limit', String(opts.limit));
  for (const [k, v] of Object.entries(opts.filters || {})) u.searchParams.set(`filters[${k}]`, v);
  return u.toString();
}

/** The API key must never reach logs or the RawDocument table. */
export function redactKey(url: string): string {
  return url.replace(/api-key=[^&]+/, 'api-key=REDACTED');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getPage(url: string, o: Required<Pick<OgdFetchOptions, 'timeoutMs' | 'retries'>> & { fetchImpl: typeof fetch }): Promise<OgdResponse> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= o.retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), o.timeoutMs);
    try {
      const res = await o.fetchImpl(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
      if (res.status === 401 || res.status === 403) {
        throw new OgdConfigError(`data.gov.in rejected the API key (HTTP ${res.status}).`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${redactKey(url)}`);
      const body = (await res.json()) as OgdResponse;
      if (!Array.isArray(body.records)) {
        throw new Error(`Unexpected response from ${redactKey(url)}: ${body.message || 'no records array'}`);
      }
      return body;
    } catch (e) {
      lastErr = e;
      if (e instanceof OgdConfigError) throw e;
      if (attempt < o.retries) await sleep(1000 * 2 ** attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

/** Download every record of a resource (or the first `maxRecords`), page by page. */
export async function fetchOgdResource(resourceId: string, options: OgdFetchOptions = {}): Promise<OgdResult> {
  const apiKey = ogdApiKey(options.apiKey);
  const pageSize = options.pageSize ?? 1000;
  const fetchImpl = options.fetchImpl ?? fetch;
  const o = { timeoutMs: options.timeoutMs ?? 30_000, retries: options.retries ?? 3, fetchImpl };
  const records: Record<string, unknown>[] = [];
  const urls: string[] = [];
  let total = Infinity;
  let fields: OgdField[] = [];
  let title: string | undefined;
  let updatedDate: string | undefined;

  for (let offset = 0; offset < total; offset += pageSize) {
    const want = options.maxRecords ? Math.min(pageSize, options.maxRecords - records.length) : pageSize;
    if (want <= 0) break;
    const url = ogdUrl(resourceId, { apiKey, offset, limit: want, filters: options.filters, baseUrl: options.baseUrl });
    const page = await getPage(url, o);
    urls.push(redactKey(url));
    if (offset === 0) {
      total = Number(page.total) || 0;
      fields = page.field || [];
      title = page.title;
      updatedDate = page.updated_date;
    }
    records.push(...page.records);
    if (page.records.length === 0) break;
    if (options.pageDelayMs && offset + pageSize < total) await sleep(options.pageDelayMs);
  }

  return { records, total: Number.isFinite(total) ? total : records.length, fields, title, updatedDate, urls };
}
