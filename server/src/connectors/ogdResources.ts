// Verified data.gov.in (OGD) resource IDs for JantaX.
// Each entry was tested live against api.data.gov.in on 2026-11-19.
// Filter values are CASE-SENSITIVE — note `districtCase` per resource.

export type DistrictCase = 'Title' | 'UPPER';

export interface OgdResource {
  id: string;
  title: string;
  domain: string;
  granularity: 'station' | 'pin' | 'village' | 'school' | 'district' | 'city' | 'market';
  updates: 'daily' | 'monthly' | 'static';
  stateField?: string;
  districtField?: string;
  districtCase?: DistrictCase;
}

export const OGD = {
  pincodeDirectory: {
    id: '5c2f62fe-5afa-4119-a499-fec9d604d5bd',
    title: 'All India Pincode Directory',
    domain: 'location',
    granularity: 'pin',
    updates: 'monthly',
    stateField: 'statename',
    districtField: 'district',
    districtCase: 'UPPER',
  },
  lgdVillagesWithPin: {
    id: 'f17a1608-5f10-4610-bb50-a63c80d83974',
    title: 'LGD — Villages with PIN Codes',
    domain: 'location',
    granularity: 'village',
    updates: 'monthly',
    stateField: 'stateNameEnglish',
    districtField: 'districtNameEnglish',
    districtCase: 'Title',
  },
  lgdLocalBodiesWithPin: {
    id: '71818d1a-c114-46cb-aa9b-56ed70d4bc4a',
    title: 'LGD — Local Bodies with PIN Codes',
    domain: 'nagar',
    granularity: 'pin',
    updates: 'daily',
    stateField: 'stateNameEnglish',
  },
  cpcbAqi: {
    id: '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69',
    title: 'CPCB Real-time Air Quality Index',
    domain: 'pollution',
    granularity: 'station',
    updates: 'daily',
    stateField: 'state',
    districtField: 'city',
    districtCase: 'Title',
  },
  jjmSchools: {
    id: '3f719ae6-c346-46f9-98ff-4add5bdc1881',
    title: 'Schools with Tap Connection under Jal Jeevan Mission',
    domain: 'school',
    granularity: 'school',
    updates: 'daily',
    stateField: 'state_name',
    districtField: 'district_name',
    districtCase: 'Title',
  },
  pmgsyProgress: {
    id: 'd4361151-6d41-43c7-98cd-9a6cd90b5ca4',
    title: 'PMGSY Physical & Financial Progress (as on date)',
    domain: 'infra',
    granularity: 'district',
    updates: 'daily',
    stateField: 'STATE_NAME',
    districtField: 'DISTRICT_NAME',
    districtCase: 'Title',
  },
  mgnregaDistrict: {
    id: 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722',
    title: 'District-wise MGNREGA Data at a Glance',
    domain: 'schemes',
    granularity: 'district',
    updates: 'monthly',
    stateField: 'state_name',
    districtField: 'district_name',
    districtCase: 'UPPER',
  },
  sanitationIhhl: {
    id: '55acc9bf-f002-4e5c-8616-4946973cd815',
    title: 'District-wise Household Latrine (IHHL) Coverage',
    domain: 'utility',
    granularity: 'district',
    updates: 'daily',
    stateField: 'StateName',
    districtField: 'DistrictName',
    districtCase: 'UPPER',
  },
  cghsWellnessCentres: {
    id: '8eede3a2-1652-49eb-bd7f-48ae3ea7a11e',
    title: 'CGHS Wellness Centres (city-wise)',
    domain: 'hospital',
    granularity: 'city',
    updates: 'daily',
    districtField: 'CityName',
    districtCase: 'Title',
  },
  mandiPrices: {
    id: '9ef84268-d588-465a-a308-a864a43d0070',
    title: 'Daily Mandi Commodity Prices',
    domain: 'pds',
    granularity: 'market',
    updates: 'daily',
    stateField: 'state',
    districtField: 'district',
    districtCase: 'Title',
  },
} as const satisfies Record<string, OgdResource>;

export type OgdKey = keyof typeof OGD;

/** Normalise a district name to the casing a resource expects. */
export function districtFor(key: OgdKey, district: string): string {
  const r: OgdResource = OGD[key];
  const d = district.trim();
  if (r.districtCase === 'UPPER') return d.toUpperCase();
  return d.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
