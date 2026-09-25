/**
 * Geography spine. Government datasets spell states and districts inconsistently ("Orissa",
 * "NCT of Delhi", "Gurgaon" vs "Gurugram"), so every dataset row is resolved to one canonical
 * state name and one District id before it is stored. Canonical names follow the India Post
 * directory; LGD codes are attached when the LGD district list is imported.
 */
import { slug } from '../jobs/lib/normalize';

/** Letters only, lower case, "&" as "and": the comparison key for place names. */
export const placeKey = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/&/g, 'and')
    .replace(/[^a-z]/g, '');

export const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'The Dadra and Nagar Haveli and Daman and Diu',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const;

const DNHDD = 'The Dadra and Nagar Haveli and Daman and Diu';
const STATE_ALIASES: Record<string, string> = {
  orissa: 'Odisha',
  pondicherry: 'Puducherry',
  uttaranchal: 'Uttarakhand',
  nctofdelhi: 'Delhi',
  delhinct: 'Delhi',
  nationalcapitalterritoryofdelhi: 'Delhi',
  newdelhi: 'Delhi',
  jammukashmir: 'Jammu and Kashmir',
  jandk: 'Jammu and Kashmir',
  chattisgarh: 'Chhattisgarh',
  chhatisgarh: 'Chhattisgarh',
  telengana: 'Telangana',
  tamilnadu: 'Tamil Nadu',
  andamanandnicobar: 'Andaman and Nicobar Islands',
  andamannicobarislands: 'Andaman and Nicobar Islands',
  andamanandnicobarisland: 'Andaman and Nicobar Islands',
  dadraandnagarhaveli: DNHDD,
  damananddiu: DNHDD,
  dadraandnagarhavelianddamananddiu: DNHDD,
  dadranagarhavelianddamandiu: DNHDD,
  dnhanddd: DNHDD,
};
const STATE_BY_KEY = new Map<string, string>([
  ...STATES.map((s) => [placeKey(s), s] as [string, string]),
  ...Object.entries(STATE_ALIASES),
]);

/** Canonical state name, or null when the value is not an Indian state or union territory. */
export function canonicalState(name: string | null | undefined): string | null {
  if (!name) return null;
  const k = placeKey(name.replace(/^(state|ut|union territory) of /i, ''));
  return STATE_BY_KEY.get(k) ?? null;
}

/**
 * Districts that were renamed or are commonly spelled two ways. Each group maps to one key,
 * so either spelling in either dataset resolves to the same district.
 */
const DISTRICT_SYNONYMS: string[][] = [
  ['gurgaon', 'gurugram'],
  ['allahabad', 'prayagraj'],
  ['faizabad', 'ayodhya'],
  ['bangalore', 'bengaluru', 'bangaloreurban', 'bengaluruurban'],
  ['bangalorerural', 'bengalururural'],
  ['mysore', 'mysuru'],
  ['belgaum', 'belagavi'],
  ['gulbarga', 'kalaburagi', 'kalaburgi'],
  ['bellary', 'ballari'],
  ['shimoga', 'shivamogga'],
  ['tumkur', 'tumakuru'],
  ['chikmagalur', 'chikkamagaluru'],
  ['mewat', 'nuh'],
  ['hoshangabad', 'narmadapuram'],
  ['kancheepuram', 'kanchipuram'],
  ['tirunelveli', 'tirunelvelli'],
  ['thoothukudi', 'tuticorin'],
  ['tiruchirappalli', 'tiruchirapalli', 'trichy'],
  ['villupuram', 'viluppuram'],
  ['kanyakumari', 'kanniyakumari'],
  ['nilgiris', 'thenilgiris'],
  ['ahmedabad', 'ahmadabad'],
  ['mahesana', 'mehsana'],
  ['panchmahal', 'panchmahals'],
  ['dang', 'dangs', 'thedangs'],
  ['raigad', 'raigarh'],
  ['beed', 'bid'],
  ['ahmednagar', 'ahilyanagar', 'ahmadnagar'],
  ['aurangabad', 'chhatrapatisambhajinagar'],
  ['osmanabad', 'dharashiv'],
  ['mumbai', 'mumbaicity', 'greatermumbai'],
  ['kolkata', 'calcutta'],
  ['hooghly', 'hugli'],
  ['howrah', 'haora'],
  ['darjeeling', 'darjiling'],
  ['coochbehar', 'koochbehar', 'coochbihar'],
  ['purulia', 'puruliya'],
  ['burdwan', 'bardhaman', 'purbabardhaman', 'barddhaman'],
  ['maldah', 'malda'],
  ['northparganas', 'northtwentyfourparganas'], // placeKey drops the digits in "24"
  ['southparganas', 'southtwentyfourparganas'],
  ['kamrupmetro', 'kamrupmetropolitan'], // Kamrup (rural) is a separate district
  ['sibsagar', 'sivasagar'],
  ['nowgong', 'nagaon'],
  ['cuddapah', 'kadapa', 'ysrkadapa', 'ysr'],
  ['nellore', 'spsrnellore', 'sripottisriramulunellore'],
  ['rangareddy', 'rangareddi', 'rangaredy'],
  ['mahbubnagar', 'mahabubnagar'],
  ['badgam', 'budgam'],
  ['baramula', 'baramulla'],
  ['kaithal', 'kaithel'],
  ['jhunjhunu', 'jhunjhunun'],
  ['chittaurgarh', 'chittorgarh'],
  ['dholpur', 'dhaulpur'],
  ['jalor', 'jalore'],
  ['eastnimar', 'khandwa'],
  ['westnimar', 'khargone'],
  ['narsinghpur', 'narsimhapur'],
  ['pashchimchamparan', 'westchamparan'],
  ['purbichamparan', 'eastchamparan'],
  ['kaimur', 'kaimurbhabua'],
  ['santravidasnagar', 'bhadohi', 'santravidasnagarbhadohi'],
  ['lakhimpurkheri', 'kheri'],
  ['kanpurnagar', 'kanpur'],
  ['firozpur', 'ferozepur'],
  ['sasnagar', 'mohali', 'sahibzadaajitsinghnagar'],
  ['nawanshahr', 'shahidbhagatsinghnagar'],
  ['leh', 'lehladakh'],
  ['angul', 'anugul'],
  ['balasore', 'baleshwar'],
  ['bolangir', 'balangir'],
  ['keonjhar', 'kendujhar'],
  ['sonepur', 'subarnapur'],
  ['jagatsinghpur', 'jagatsinghapur'],
];
const SYNONYM = new Map<string, string>();
for (const group of DISTRICT_SYNONYMS) for (const k of group) SYNONYM.set(k, group[0]);

/** Comparison key for a district name: suffixes like "District" removed, synonyms merged. */
export function districtKey(name: string): string {
  const k = placeKey(name.replace(/\b(district|dist\.?|zilla|zila)\b/gi, ''));
  return SYNONYM.get(k) ?? k;
}

export const districtId = (state: string, district: string) => `${slug(state)}:${slug(district)}`;

const DIRECTION: Record<string, string> = { purba: 'east', purbi: 'east', paschim: 'west', pashchim: 'west', uttar: 'north', dakshin: 'south', midnapore: 'medinipur', paraganas: 'parganas' };

/**
 * Word-order-free key: "24 Paraganas North", "North 24 Parganas" and "Uttar 24 Parganas" all give
 * "24-north-parganas"; "Dinajpur Dakshin" and "South Dinajpur" both give "dinajpur-south".
 */
export function districtTokenKey(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/&/g, ' and ')
    .replace(/\b(district|dist\.?|zilla|zila)\b/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => DIRECTION[w] ?? w)
    .sort()
    .join('-');
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export interface DistrictRef {
  id: string;
  name: string;
  state: string;
}

export type Resolution =
  | { level: 'district'; state: string; districtId: string; match: 'exact' | 'alias' | 'fuzzy' }
  | { level: 'state'; state: string }
  | { level: 'none' };

/**
 * Resolves (state, district) text from any dataset to the canonical spine. Build once per sync
 * from the District table (plus stored aliases), then call `resolve` per row.
 */
export class GeoResolver {
  private byKey = new Map<string, DistrictRef[]>();
  private byToken = new Map<string, DistrictRef[]>();
  private byState = new Map<string, DistrictRef[]>();
  private aliases = new Map<string, string>();

  constructor(districts: DistrictRef[], aliases: { key: string; districtId: string }[] = []) {
    for (const d of districts) {
      const k = `${placeKey(d.state)}:${districtKey(d.name)}`;
      this.byKey.set(k, [...(this.byKey.get(k) ?? []), d]);
      const t = `${placeKey(d.state)}:${districtTokenKey(d.name)}`;
      this.byToken.set(t, [...(this.byToken.get(t) ?? []), d]);
      this.byState.set(d.state, [...(this.byState.get(d.state) ?? []), d]);
    }
    for (const a of aliases) this.aliases.set(a.key, a.districtId);
  }

  resolve(stateText?: string | null, districtText?: string | null): Resolution {
    const state = canonicalState(stateText);
    if (!districtText?.trim()) return state ? { level: 'state', state } : { level: 'none' };
    const dk = districtKey(districtText);

    // District names are unique enough that a missing or odd state can still be recovered.
    const candidates = state ? [`${placeKey(state)}:${dk}`] : [...this.byKey.keys()].filter((k) => k.endsWith(`:${dk}`));
    for (const k of candidates) {
      const alias = this.aliases.get(k);
      if (alias) return { level: 'district', state: state ?? this.stateOf(alias), districtId: alias, match: 'alias' };
      const hits = this.byKey.get(k);
      if (hits?.length === 1) return { level: 'district', state: hits[0].state, districtId: hits[0].id, match: 'exact' };
    }
    if (state) {
      const tk = districtTokenKey(districtText);
      const sameWords = this.byToken.get(`${placeKey(state)}:${tk}`);
      if (sameWords?.length === 1) return { level: 'district', state, districtId: sameWords[0].id, match: 'alias' };
      if (dk.length >= 5) {
        // Spelling slips ("Paraganas", "Tirunelvelli"): one unambiguous near match in the same state.
        const list = this.byState.get(state) ?? [];
        const near = list.filter((d) => editDistance(districtKey(d.name), dk) <= 2 || editDistance(districtTokenKey(d.name), tk) <= 2);
        if (near.length === 1) return { level: 'district', state, districtId: near[0].id, match: 'fuzzy' };
      }
    }
    return state ? { level: 'state', state } : { level: 'none' };
  }

  private stateOf(id: string): string {
    for (const list of this.byState.values()) for (const d of list) if (d.id === id) return d.state;
    return '';
  }
}
