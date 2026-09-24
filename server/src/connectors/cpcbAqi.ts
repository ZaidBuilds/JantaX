// CPCB Real-time Air Quality connector.
// Source of truth: Central Pollution Control Board (CPCB) real-time AQI,
// published on the Open Government Data platform (data.gov.in OGD API).
// No mock data — every reading is fetched live and carries its source + timestamp.
//
// Register a FREE api key at https://data.gov.in and set DATA_GOV_IN_KEY.
// The shared sample key below is globally rate-limited and only for a first smoke test.

// CPCB "Real time Air Quality Index from various locations" resource.
export const CPCB_RESOURCE_ID = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
export const CPCB_SOURCE_LABEL = 'CPCB — Real-time AQI (data.gov.in OGD)';

const SAMPLE_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

/** Clean, source-stamped reading the rest of JantaX consumes. */
export interface NormalisedAqiReading {
  station: string;
  city: string;
  state: string;
  country: string;
  lat: number | null;
  lng: number | null;
  pollutantId: string;
  avgValue: number | null;
  minValue: number | null;
  maxValue: number | null;
  lastUpdate: string;
  source: string;
  sourceUrl: string;
  fetchedAt: string;
}

function resourceUrl(): string {
  return `https://data.gov.in/resource/${CPCB_RESOURCE_ID}`;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '' || v === 'NA') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pick(rec: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) if (rec[k] !== undefined) return rec[k];
  return undefined;
}

/**
 * Pure, network-free normaliser. CPCB has shipped two field spellings over
 * time (pollutant_avg vs avg_value); this tolerates both. Unit-tested.
 */
export function normaliseAqiRecords(raw: Array<Record<string, unknown>>): NormalisedAqiReading[] {
  const fetchedAt = new Date().toISOString();
  const url = resourceUrl();
  return raw
    .map((r): NormalisedAqiReading | null => {
      const station = String(pick(r, 'station') ?? '').trim();
      const city = String(pick(r, 'city') ?? '').trim();
      if (!station && !city) return null; // skip empty rows
      return {
        station: station || city,
        city,
        state: String(pick(r, 'state') ?? '').trim(),
        country: String(pick(r, 'country') ?? 'India').trim(),
        lat: toNum(pick(r, 'latitude', 'lat')),
        lng: toNum(pick(r, 'longitude', 'long', 'lng')),
        pollutantId: String(pick(r, 'pollutant_id', 'pollutantId') ?? '').trim(),
        avgValue: toNum(pick(r, 'avg_value', 'pollutant_avg', 'average_value')),
        minValue: toNum(pick(r, 'min_value', 'pollutant_min')),
        maxValue: toNum(pick(r, 'max_value', 'pollutant_max')),
        lastUpdate: String(pick(r, 'last_update', 'lastupdate') ?? '').trim(),
        source: CPCB_SOURCE_LABEL,
        sourceUrl: url,
        fetchedAt,
      };
    })
    .filter((x): x is NormalisedAqiReading => x !== null);
}

/** Live fetch of raw CPCB records from the OGD API. Throws on transport/key errors. */
export async function fetchAqiRaw(limit = 500): Promise<Array<Record<string, unknown>>> {
  const key = process.env.DATA_GOV_IN_KEY || SAMPLE_KEY;
  const endpoint = `https://api.data.gov.in/resource/${CPCB_RESOURCE_ID}?api-key=${key}&format=json&limit=${limit}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`CPCB AQI fetch failed: HTTP ${res.status}`);
  const body = (await res.json()) as { records?: unknown; error?: string };
  if (body.error) throw new Error(`CPCB AQI API error: ${body.error}`);
  if (!Array.isArray(body.records)) throw new Error('CPCB AQI: unexpected payload (no records array)');
  return body.records as Array<Record<string, unknown>>;
}

/** Fetch + normalise in one call. */
export async function getAqiReadings(limit = 500): Promise<NormalisedAqiReading[]> {
  const raw = await fetchAqiRaw(limit);
  return normaliseAqiRecords(raw);
}
