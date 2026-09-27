/**
 * All 28 states and 8 union territories, with Hindi names and a tile position that follows India's
 * outline: Jammu and Kashmir and Ladakh at the top, the north-east to the right of the Siliguri
 * corridor, the peninsula narrowing to Kerala and Tamil Nadu, and the island territories offshore.
 *
 * Tiles only suggest geography; they do not draw borders, so the layout makes no claim about them.
 * Codes are the vehicle-registration codes people already recognise.
 */

export type StateKind = 'state' | 'ut';

export interface IndiaState {
  code: string;
  name: string;
  nameHi: string;
  /** Short Hindi label that fits a tile. */
  shortHi: string;
  kind: StateKind;
  /** Grid column and row of the tile, 1-based, west to east and north to south. */
  tile: [number, number];
}

export const INDIA_STATES: IndiaState[] = [
  { code: 'JK', name: 'Jammu and Kashmir', nameHi: 'जम्मू और कश्मीर', shortHi: 'ज.क.', kind: 'ut', tile: [1, 1] },
  { code: 'LA', name: 'Ladakh', nameHi: 'लद्दाख', shortHi: 'लद्दाख', kind: 'ut', tile: [2, 1] },
  { code: 'PB', name: 'Punjab', nameHi: 'पंजाब', shortHi: 'पंजाब', kind: 'state', tile: [1, 2] },
  { code: 'HP', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', shortHi: 'हि.प्र.', kind: 'state', tile: [2, 2] },
  { code: 'HR', name: 'Haryana', nameHi: 'हरियाणा', shortHi: 'हरि.', kind: 'state', tile: [1, 3] },
  { code: 'CH', name: 'Chandigarh', nameHi: 'चंडीगढ़', shortHi: 'चंडी.', kind: 'ut', tile: [2, 3] },
  { code: 'UK', name: 'Uttarakhand', nameHi: 'उत्तराखंड', shortHi: 'उ.खं.', kind: 'state', tile: [3, 3] },
  { code: 'AR', name: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश', shortHi: 'अ.प्र.', kind: 'state', tile: [7, 3] },
  { code: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', shortHi: 'राज.', kind: 'state', tile: [1, 4] },
  { code: 'DL', name: 'Delhi', nameHi: 'दिल्ली', shortHi: 'दिल्ली', kind: 'ut', tile: [2, 4] },
  { code: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', shortHi: 'उ.प्र.', kind: 'state', tile: [3, 4] },
  { code: 'BR', name: 'Bihar', nameHi: 'बिहार', shortHi: 'बिहार', kind: 'state', tile: [4, 4] },
  { code: 'SK', name: 'Sikkim', nameHi: 'सिक्किम', shortHi: 'सिक्किम', kind: 'state', tile: [5, 4] },
  { code: 'AS', name: 'Assam', nameHi: 'असम', shortHi: 'असम', kind: 'state', tile: [6, 4] },
  { code: 'NL', name: 'Nagaland', nameHi: 'नगालैंड', shortHi: 'नगा.', kind: 'state', tile: [7, 4] },
  { code: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', shortHi: 'गुज.', kind: 'state', tile: [1, 5] },
  { code: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', shortHi: 'म.प्र.', kind: 'state', tile: [2, 5] },
  { code: 'CG', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', shortHi: 'छ.ग.', kind: 'state', tile: [3, 5] },
  { code: 'JH', name: 'Jharkhand', nameHi: 'झारखंड', shortHi: 'झार.', kind: 'state', tile: [4, 5] },
  { code: 'WB', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', shortHi: 'प.बं.', kind: 'state', tile: [5, 5] },
  { code: 'ML', name: 'Meghalaya', nameHi: 'मेघालय', shortHi: 'मेघा.', kind: 'state', tile: [6, 5] },
  { code: 'MN', name: 'Manipur', nameHi: 'मणिपुर', shortHi: 'मणि.', kind: 'state', tile: [7, 5] },
  { code: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', nameHi: 'दादरा और नगर हवेली और दमन और दीव', shortHi: 'दा.दी.', kind: 'ut', tile: [1, 6] },
  { code: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', shortHi: 'महा.', kind: 'state', tile: [2, 6] },
  { code: 'TG', name: 'Telangana', nameHi: 'तेलंगाना', shortHi: 'तेलं.', kind: 'state', tile: [3, 6] },
  { code: 'OD', name: 'Odisha', nameHi: 'ओडिशा', shortHi: 'ओडिशा', kind: 'state', tile: [4, 6] },
  { code: 'TR', name: 'Tripura', nameHi: 'त्रिपुरा', shortHi: 'त्रिपु.', kind: 'state', tile: [6, 6] },
  { code: 'MZ', name: 'Mizoram', nameHi: 'मिज़ोरम', shortHi: 'मिज़ो.', kind: 'state', tile: [7, 6] },
  { code: 'GA', name: 'Goa', nameHi: 'गोवा', shortHi: 'गोवा', kind: 'state', tile: [1, 7] },
  { code: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', shortHi: 'कर्ना.', kind: 'state', tile: [2, 7] },
  { code: 'AP', name: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश', shortHi: 'आं.प्र.', kind: 'state', tile: [3, 7] },
  { code: 'LD', name: 'Lakshadweep', nameHi: 'लक्षद्वीप', shortHi: 'लक्ष.', kind: 'ut', tile: [1, 8] },
  { code: 'KL', name: 'Kerala', nameHi: 'केरल', shortHi: 'केरल', kind: 'state', tile: [2, 8] },
  { code: 'TN', name: 'Tamil Nadu', nameHi: 'तमिलनाडु', shortHi: 'त.ना.', kind: 'state', tile: [3, 8] },
  { code: 'PY', name: 'Puducherry', nameHi: 'पुडुचेरी', shortHi: 'पुडु.', kind: 'ut', tile: [4, 8] },
  { code: 'AN', name: 'Andaman and Nicobar Islands', nameHi: 'अंडमान और निकोबार द्वीपसमूह', shortHi: 'अं.नि.', kind: 'ut', tile: [6, 8] },
];

const ALIASES: Record<string, string> = {
  'nct of delhi': 'DL', 'new delhi': 'DL', 'delhi ncr': 'DL',
  orissa: 'OD', pondicherry: 'PY', uttaranchal: 'UK',
  'jammu & kashmir': 'JK', 'j&k': 'JK',
  'andaman & nicobar islands': 'AN', 'andaman and nicobar': 'AN',
  'dadra and nagar haveli': 'DD', 'daman and diu': 'DD', 'dadra & nagar haveli and daman & diu': 'DD',
  telengana: 'TG',
};

const BY_NAME = new Map(INDIA_STATES.map((s) => [s.name.toLowerCase(), s]));
const BY_CODE = new Map(INDIA_STATES.map((s) => [s.code, s]));

/** Find a state or UT by name (common spellings included) or code. */
export function findState(nameOrCode: string | null | undefined): IndiaState | undefined {
  if (!nameOrCode) return undefined;
  const key = nameOrCode.trim().toLowerCase().replace(/\s+/g, ' ');
  return BY_NAME.get(key) ?? BY_CODE.get(nameOrCode.trim().toUpperCase()) ?? BY_CODE.get(ALIASES[key] ?? '');
}
