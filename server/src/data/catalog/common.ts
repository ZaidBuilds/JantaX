import type { FieldSpec, FieldType } from '../spec';

export const GODL = 'Government Open Data License - India (GODL)';
export const GODL_URL = 'https://data.gov.in/government-open-data-license-india';
export const GODL_ATTRIBUTION = 'Attribute the publishing ministry or department and data.gov.in, with a link to the dataset.';

/** How to find a data.gov.in resource id: search the catalogue, open the dataset, copy the id from its API tab. */
export const ogdFind = (query: string) =>
  `Find it on data.gov.in: search "${query}", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.`;

export const f = (type: FieldType, label: string, from: string[] = [], extra: Partial<FieldSpec> = {}): FieldSpec => ({ type, label, from, ...extra });

/** Common column spellings for place fields in Indian datasets. */
export const STATE = f('text', 'State', ['state_name', 'state name', 'state_ut', 'state/ut', 'state / ut', 'name of state', 'name of the state', 'states/uts', 'state_ut_name', 'statename', 'state_english'], { required: true });
export const DISTRICT = f('text', 'District', ['district_name', 'district name', 'name of district', 'name of the district', 'districtname', 'dist_name', 'district_english']);
export const PINCODE = f('pincode', 'PIN code', ['pin', 'pin code', 'pin_code', 'pincode']);
export const YEAR = f('text', 'Year', ['financial_year', 'financial year', 'fy', 'academic_year', 'academic year', 'session', 'reference_year', 'yr']);
export const AS_ON = f('date', 'As on', ['as_on', 'as on date', 'as_on_date', 'date', 'updated_on', 'last_updated', 'report_date']);
