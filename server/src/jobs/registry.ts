import type { SourceConnector } from './connector';
import { createPincodeDirectoryConnector } from './connectors/pincodeDirectory';
import { createCpcbAqiConnector } from './connectors/cpcbAqi';

export interface ConnectorOptions {
  /** Read a downloaded CSV or JSON file instead of calling the API. */
  file?: string;
  /** Stop after this many API records (dry runs). */
  maxRecords?: number;
}

export const CONNECTORS: Record<string, (opts?: ConnectorOptions) => SourceConnector> = {
  'india-post-pincode-directory': createPincodeDirectoryConnector,
  'cpcb-realtime-aqi': createCpcbAqiConnector,
};

export function createConnector(sourceId: string, opts: ConnectorOptions = {}): SourceConnector {
  const make = CONNECTORS[sourceId];
  if (!make) throw new Error(`Unknown source "${sourceId}". Known: ${Object.keys(CONNECTORS).join(', ')}`);
  return make(opts);
}
