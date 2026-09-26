import type { Schedule } from '../jobs/connector';

/**
 * A catalogued government dataset. One spec drives the whole path: download, field mapping,
 * validation, geography resolution, storage in DatasetRecord, the /api/data routes and the
 * official-records panel on the module screen.
 */

export type FieldType = 'text' | 'number' | 'int' | 'percent' | 'date' | 'bool' | 'pincode' | 'url';

export interface FieldSpec {
  /** Column names this field may appear under, in any case or spacing. The field id itself is always tried. */
  from: string[];
  type: FieldType;
  label: string;
  unit?: string;
  required?: boolean;
}

/** How to get the data. Every kind also accepts a downloaded file (`--file`). */
export type Access =
  /** data.gov.in OGD API. The resource id comes from `resourceEnv`, or `resourceId` once verified. */
  | { kind: 'ogd'; resourceEnv: string; resourceId?: string; filters?: Record<string, string>; find: string }
  /** A CKAN portal's datastore API, e.g. Open Budgets India or a city open data portal. */
  | { kind: 'ckan'; baseUrl: string; resourceEnv: string; resourceId?: string; find: string }
  /** A direct download link to a CSV, JSON or XLSX file. */
  | { kind: 'url'; urlEnv: string; url?: string; format: 'csv' | 'json' | 'xlsx'; find: string }
  /** No machine access: someone downloads or compiles the file and imports it with `--file`. */
  | { kind: 'file'; template: string; find: string };

export type GeoLevel = 'point' | 'pincode' | 'district' | 'state' | 'national';

export interface DatasetSpec {
  id: string;
  /** Module id from src/ui/modules.tsx whose screen shows this dataset. */
  module: string;
  title: string;
  summary: string;
  publisher: string;
  department?: string;
  governmentLevel: 'central' | 'state' | 'local';
  sourceUrl: string;
  license: string;
  licenseUrl?: string;
  attribution: string;
  access: Access;
  /** The finest geography a row describes. */
  level: GeoLevel;
  fields: Record<string, FieldSpec>;
  /** Fields that together identify a row across refreshes. */
  key: string[];
  /** Which mapped fields hold the row's place. */
  geo?: { state?: string; district?: string; pincode?: string; lat?: string; lng?: string; latlng?: string };
  /** Field holding the reporting period (e.g. "2023-24"), if any. */
  period?: string;
  /** Each download is a complete snapshot: rows missing from it are removed. */
  replace?: boolean;
  schedule: Schedule;
  /** How the module screen lists rows. */
  show: { columns: string[]; sort?: { field: string; dir: 'asc' | 'desc' }; limit?: number };
  notes?: string;
}

/** Name of the setting a person fills in to switch the dataset on, if any. */
export function accessSetting(spec: DatasetSpec): string | null {
  const a = spec.access;
  if (a.kind === 'ogd' || a.kind === 'ckan') return a.resourceEnv;
  if (a.kind === 'url') return a.urlEnv;
  return null;
}
