import { useEffect, useState } from 'react';
import { apiUrl } from './api';

/**
 * Official government datasets served by the JantaX data service (/api/data, /api/area).
 * No sample fallback: when the service is unreachable the caller is told so and shows nothing invented.
 */

export type DatasetState = 'live' | 'stale' | 'failing' | 'needs-setting' | 'needs-file' | 'ready';
export type FieldType = 'text' | 'number' | 'int' | 'percent' | 'date' | 'bool' | 'pincode' | 'url';

export interface Column {
  id: string;
  label: string;
  type: FieldType;
  unit: string | null;
}

export interface DatasetStatus {
  id: string;
  module: string;
  title: string;
  summary: string;
  publisher: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string | null;
  attribution: string;
  access: 'ogd' | 'ckan' | 'url' | 'file';
  level: 'point' | 'pincode' | 'district' | 'state' | 'national';
  schedule: string;
  setting: string | null;
  missing: string | null;
  state: DatasetState;
  rows: number;
  lastSync: string | null;
  publishedAt: string | null;
  lastError: string | null;
  nextRun: string | null;
  columns: Column[];
}

export interface FeedStatus {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  license: string;
  schedule: string;
  state: DatasetState;
  rows: number;
  lastSync: string | null;
  missing: string | null;
  lastError: string | null;
}

export interface Catalog {
  datasets: DatasetStatus[];
  feeds: FeedStatus[];
  summary: Partial<Record<DatasetState, number>> & { total: number };
  generatedAt: string;
}

export type OfficialRow = Record<string, string | number | boolean | null> & {
  _place: { state: string | null; districtId: string | null; pincode: string | null; km?: number };
};

export interface AreaDataset {
  id: string;
  module: string;
  title: string;
  summary: string;
  level: DatasetStatus['level'];
  columns: Column[];
  source: { publisher: string; department: string | null; url: string; license: string; licenseUrl: string | null; attribution: string; lastSync: string | null; publishedAt: string | null };
  status: DatasetState;
  matched: 'pincode' | 'district' | 'state' | 'national' | 'none';
  total: number;
  rows: OfficialRow[];
  missing: string | null;
}

export interface Area {
  pin: string;
  place: { district: string | null; districtId: string | null; state: string; lgdCode: number | null; population2011: number | null };
  datasets: AreaDataset[];
}

/** Loading, a response, or `unreachable` (service down) / `error` (it answered with an error). */
export type Remote<T> = { status: 'loading' } | { status: 'ok'; data: T } | { status: 'unreachable' } | { status: 'error'; message: string };

async function getJson<T>(path: string): Promise<Remote<T>> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), { headers: { accept: 'application/json' } });
  } catch {
    return { status: 'unreachable' };
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) return { status: 'error', message: (body as { error?: string } | null)?.error ?? `Error ${res.status}` };
  return { status: 'ok', data: body as T };
}

// One catalog request per page load, shared by every component that asks.
let catalogRequest: Promise<Remote<Catalog>> | null = null;
export function fetchCatalog(fresh = false): Promise<Remote<Catalog>> {
  if (!catalogRequest || fresh) {
    catalogRequest = getJson<Catalog>('/api/data/catalog').then((r) => {
      if (r.status !== 'ok') setTimeout(() => (catalogRequest = null), 30_000); // retry later, not on every render
      return r;
    });
  }
  return catalogRequest;
}

export const fetchArea = (pin: string, module?: string) => getJson<Area>(`/api/area/${encodeURIComponent(pin)}${module ? `?module=${encodeURIComponent(module)}` : ''}`);

function useRemote<T>(load: () => Promise<Remote<T>>, deps: unknown[]): Remote<T> {
  const [state, setState] = useState<Remote<T>>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    load().then((r) => alive && setState(r));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export const useCatalog = () => useRemote(() => fetchCatalog(), []);
export const useArea = (pin: string | null | undefined, module?: string) =>
  useRemote<Area>(() => (pin && /^[1-9]\d{5}$/.test(pin) ? fetchArea(pin, module) : Promise.resolve({ status: 'error', message: 'Choose a PIN code' })), [pin, module]);

/** Datasets with published rows count as connected. */
export const isConnected = (s: DatasetState) => s === 'live' || s === 'stale' || s === 'failing';

export const STATE_LABEL: Record<DatasetState, string> = {
  live: 'Live',
  stale: 'Out of date',
  failing: 'Last refresh failed',
  'needs-setting': 'Not connected',
  'needs-file': 'Awaiting import',
  ready: 'Ready, not yet run',
};

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** A cell value as it should read on screen. */
export function formatValue(value: OfficialRow[string], col: Column): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (col.type === 'date' && typeof value === 'string') {
    const d = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : `${value}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-IN', { day: value.length === 7 ? undefined : 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  if (typeof value === 'number') {
    if (col.type === 'percent' || col.unit === '%') return `${inr.format(value)}%`;
    if (col.unit === '₹') return `₹${inr.format(value)}`;
    if (col.unit === '₹ cr') return `₹${inr.format(value)} cr`;
    return col.unit ? `${inr.format(value)} ${col.unit}` : inr.format(value);
  }
  return String(value);
}

export function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
