import { prisma } from '../prisma';

/** Provenance for one upstream dataset. Mirrors the Source table so every row can be traced. */
export interface SourceDefinition {
  sourceId: string;
  organization: string;
  department?: string;
  governmentLevel: 'central' | 'state' | 'local';
  sourceName: string;
  sourceUrl: string;
  apiUrl?: string;
  datasetUrl?: string;
  sourceType: 'api' | 'file' | 'scrape';
  license: string;
  termsUrl?: string;
  attributionRequirement: string;
  reusePermission: string;
  dataSensitivity: 'public' | 'restricted';
  updateFrequency: string;
  expectedRefreshInterval: string;
  parserVersion: string;
  owner: string;
  notes?: string;
}

const GODL = 'Government Open Data License - India (GODL)';
const GODL_TERMS = 'https://data.gov.in/government-open-data-license-india';
const GODL_ATTRIBUTION = 'Attribute the publishing ministry and data.gov.in, with a link to the dataset.';

/** data.gov.in resource ids. Override with env vars if the platform re-publishes a dataset under a new id. */
export const RESOURCE_IDS = {
  pincodeDirectory: process.env.PINCODE_DIRECTORY_RESOURCE_ID || '5c2f62fe-5afa-4119-a499-fec9d604d5bd',
  cpcbAqi: process.env.CPCB_AQI_RESOURCE_ID || '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69',
};

export const SOURCES: Record<string, SourceDefinition> = {
  'india-post-pincode-directory': {
    sourceId: 'india-post-pincode-directory',
    organization: 'Department of Posts',
    department: 'Ministry of Communications',
    governmentLevel: 'central',
    sourceName: 'All India Pincode Directory',
    sourceUrl: 'https://www.data.gov.in/catalog/all-india-pincode-directory',
    apiUrl: `https://api.data.gov.in/resource/${RESOURCE_IDS.pincodeDirectory}`,
    sourceType: 'api',
    license: GODL,
    termsUrl: GODL_TERMS,
    attributionRequirement: GODL_ATTRIBUTION,
    reusePermission: 'Free reuse, including commercial, with attribution',
    dataSensitivity: 'public',
    updateFrequency: 'monthly',
    expectedRefreshInterval: '30d',
    parserVersion: 'pincode-directory@1',
    owner: 'data',
    notes: 'Every post office with its PIN, office type, delivery status, district, state and coordinates. Also accepts the CSV download of the same dataset.',
  },
  'cpcb-realtime-aqi': {
    sourceId: 'cpcb-realtime-aqi',
    organization: 'Central Pollution Control Board',
    department: 'Ministry of Environment, Forest and Climate Change',
    governmentLevel: 'central',
    sourceName: 'Real time Air Quality Index from various locations',
    sourceUrl: 'https://www.data.gov.in/resource/real-time-air-quality-index-various-locations',
    apiUrl: `https://api.data.gov.in/resource/${RESOURCE_IDS.cpcbAqi}`,
    sourceType: 'api',
    license: GODL,
    termsUrl: GODL_TERMS,
    attributionRequirement: GODL_ATTRIBUTION,
    reusePermission: 'Free reuse, including commercial, with attribution',
    dataSensitivity: 'public',
    updateFrequency: 'hourly',
    expectedRefreshInterval: '1h',
    parserVersion: 'cpcb-aqi@1',
    owner: 'data',
    notes: 'Pollutant-wise values published by CPCB continuous monitoring stations (CAAQMS). Readings older than 30 days are pruned.',
  },
};

/** Create or refresh a Source row from its definition. Sync status fields are left to the sync engine. */
export async function ensureSource(def: SourceDefinition): Promise<void> {
  const meta = {
    organization: def.organization,
    department: def.department ?? null,
    governmentLevel: def.governmentLevel,
    sourceName: def.sourceName,
    sourceUrl: def.sourceUrl,
    apiUrl: def.apiUrl ?? null,
    datasetUrl: def.datasetUrl ?? null,
    sourceType: def.sourceType,
    license: def.license,
    termsUrl: def.termsUrl ?? null,
    attributionRequirement: def.attributionRequirement,
    reusePermission: def.reusePermission,
    dataSensitivity: def.dataSensitivity,
    updateFrequency: def.updateFrequency,
    expectedRefreshInterval: def.expectedRefreshInterval,
    parserVersion: def.parserVersion,
    owner: def.owner,
    notes: def.notes ?? null,
  };
  await prisma.source.upsert({
    where: { sourceId: def.sourceId },
    update: meta,
    create: { sourceId: def.sourceId, ...meta, lastChecked: new Date(), status: 'registered' },
  });
}
