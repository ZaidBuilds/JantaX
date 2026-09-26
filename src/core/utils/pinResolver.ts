import { getCachedPin } from '../services/pinDirectory';

// PIN Code Range → State & District Mappings
export const PIN_STATE_MAP: Record<string, { state: string; stateCode: string; district: string }> = {
  '110': { state: 'Delhi', stateCode: 'DL', district: 'New Delhi' },
  '400': { state: 'Maharashtra', stateCode: 'MH', district: 'Mumbai' },
  '411': { state: 'Maharashtra', stateCode: 'MH', district: 'Pune' },
  '246': { state: 'Uttarakhand', stateCode: 'UK', district: 'Chamoli' },
  '248': { state: 'Uttarakhand', stateCode: 'UK', district: 'Dehradun' },
  '226': { state: 'Uttar Pradesh', stateCode: 'UP', district: 'Lucknow' },
  '250': { state: 'Uttar Pradesh', stateCode: 'UP', district: 'Meerut' },
  '560': { state: 'Karnataka', stateCode: 'KA', district: 'Bengaluru' },
  '600': { state: 'Tamil Nadu', stateCode: 'TN', district: 'Chennai' },
  '700': { state: 'West Bengal', stateCode: 'WB', district: 'Kolkata' },
  '380': { state: 'Gujarat', stateCode: 'GJ', district: 'Ahmedabad' },
  '302': { state: 'Rajasthan', stateCode: 'RJ', district: 'Jaipur' },
  '160': { state: 'Chandigarh', stateCode: 'CH', district: 'Chandigarh' },
  '500': { state: 'Telangana', stateCode: 'TS', district: 'Hyderabad' },
  '682': { state: 'Kerala', stateCode: 'KL', district: 'Ernakulam' },
  '452': { state: 'Madhya Pradesh', stateCode: 'MP', district: 'Indore' },
  '800': { state: 'Bihar', stateCode: 'BR', district: 'Patna' },
  '781': { state: 'Assam', stateCode: 'AS', district: 'Guwahati' },
  '403': { state: 'Goa', stateCode: 'GA', district: 'North Goa' },
  '180': { state: 'Jammu & Kashmir', stateCode: 'JK', district: 'Jammu' },
  '737': { state: 'Sikkim', stateCode: 'SK', district: 'Gangtok' },
  '795': { state: 'Manipur', stateCode: 'MN', district: 'Imphal' },
};

export interface ResolvedLocation {
  pinCode: string;
  state: string;
  stateCode: string;
  district: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  isValid: boolean;
  /** 'india-post' when the PIN was found in the India Post directory; 'prefix' for the rough prefix table. */
  source?: 'india-post' | 'prefix' | 'none';
}

const STATE_CODES: Record<string, string> = {
  'Andaman and Nicobar Islands': 'AN', 'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', Assam: 'AS', Bihar: 'BR',
  Chandigarh: 'CH', Chhattisgarh: 'CG', Delhi: 'DL', Goa: 'GA', Gujarat: 'GJ', Haryana: 'HR', 'Himachal Pradesh': 'HP',
  'Jammu and Kashmir': 'JK', Jharkhand: 'JH', Karnataka: 'KA', Kerala: 'KL', Ladakh: 'LA', Lakshadweep: 'LD',
  'Madhya Pradesh': 'MP', Maharashtra: 'MH', Manipur: 'MN', Meghalaya: 'ML', Mizoram: 'MZ', Nagaland: 'NL', Odisha: 'OD',
  Puducherry: 'PY', Punjab: 'PB', Rajasthan: 'RJ', Sikkim: 'SK', 'Tamil Nadu': 'TN', Telangana: 'TS', Tripura: 'TR',
  'The Dadra and Nagar Haveli and Daman and Diu': 'DH', 'Uttar Pradesh': 'UP', Uttarakhand: 'UK', 'West Bengal': 'WB',
};

export function isValidIndianPincode(pin: string): boolean {
  return /^[1-9]\d{5}$/.test(pin.trim());
}

// Map first digit of PIN code to geographical regions in India
const DIGIT_REGION_MAP: Record<string, 'North' | 'South' | 'East' | 'West' | 'Central'> = {
  '1': 'North',
  '2': 'North', // UP/Uttarakhand
  '3': 'West',  // Rajasthan/Gujarat
  '4': 'West',  // Maharashtra/MP/Chhattisgarh
  '5': 'South', // AP/Telangana/Karnataka
  '6': 'South', // TN/Kerala
  '7': 'East',  // WB/Northeast
  '8': 'East',  // Bihar/Jharkhand/Odisha
  '9': 'Central',
};

export function resolvePincode(pin: string): ResolvedLocation {
  const cleaned = pin.trim();
  const isValid = isValidIndianPincode(cleaned);

  if (!isValid) {
    return { pinCode: cleaned, state: 'Unknown', stateCode: '--', district: 'Unknown', region: 'North', isValid: false, source: 'none' };
  }

  // The India Post directory, once its file for this PIN has loaded (see pinDirectory.prefetchPin).
  const hit = getCachedPin(cleaned);
  if (hit) {
    const region = DIGIT_REGION_MAP[cleaned[0]] || 'North';
    return { pinCode: cleaned, state: hit.state, stateCode: STATE_CODES[hit.state] ?? '--', district: hit.district, region, isValid: true, source: 'india-post' };
  }

  const prefix3 = cleaned.substring(0, 3);
  const match = PIN_STATE_MAP[prefix3];

  if (match) {
    const firstDigit = cleaned[0];
    const region = DIGIT_REGION_MAP[firstDigit] || 'North';
    return { pinCode: cleaned, state: match.state, stateCode: match.stateCode, district: match.district, region, isValid: true, source: 'prefix' };
  }

  return { pinCode: cleaned, state: 'Unknown', stateCode: '--', district: 'Unknown', region: 'North', isValid: true, source: 'none' };
}

// Simple deterministic hash generator
export function getDeterministicIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}
