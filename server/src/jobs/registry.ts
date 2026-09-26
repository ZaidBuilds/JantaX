import type { SourceConnector } from './connector';
import { createPincodeDirectoryConnector } from './connectors/pincodeDirectory';
import { createCpcbAqiConnector } from './connectors/cpcbAqi';
import { CATALOG } from '../data/catalog';
import { createDatasetConnector } from '../data/datasetConnector';

export interface ConnectorOptions {
  /** Read a downloaded CSV, JSON or XLSX file instead of calling the API. */
  file?: string;
  /** Stop after this many API records (dry runs). */
  maxRecords?: number;
}

/** Sources with hand-written connectors: they fill their own tables (Pincode, PostOffice, AirReading). */
const CUSTOM: Record<string, (opts?: ConnectorOptions) => SourceConnector> = {
  'india-post-pincode-directory': createPincodeDirectoryConnector,
  'cpcb-realtime-aqi': createCpcbAqiConnector,
};

/** Every source: the custom connectors plus one generic connector per catalogued dataset. */
export const CONNECTORS: Record<string, (opts?: ConnectorOptions) => SourceConnector> = {
  ...CUSTOM,
  ...Object.fromEntries(CATALOG.map((spec) => [spec.id, (opts: ConnectorOptions = {}) => createDatasetConnector(spec, opts)])),
};

export function createConnector(sourceId: string, opts: ConnectorOptions = {}): SourceConnector {
  const make = CONNECTORS[sourceId];
  if (!make) throw new Error(`Unknown source "${sourceId}". Known: ${Object.keys(CONNECTORS).join(', ')}`);
  return make(opts);
}
