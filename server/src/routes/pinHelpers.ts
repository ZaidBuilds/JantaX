import { Region, ProjectStatus } from '@prisma/client';
import { prisma } from '../prisma';

export const PincodeRegion = Region;
export type PincodeRegion = Region;

export function regionForState(state: string): Region {
  const northern = ['jammu and kashmir', 'ladakh', 'ladakh (ut)', 'himachal pradesh', 'punjab', 'haryana', 'delhi', 'chandigarh', 'uttarakhand', 'uttar pradesh'];
  const southern = ['andhra pradesh', 'karnataka', 'kerala', 'tamil nadu', 'telangana', 'puducherry', 'lakshadweep', 'andaman and nicobar'];
  const eastern = ['bihar', 'west bengal', 'jharkhand', 'odisha', 'assam', 'arunachal pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura', 'sikkim'];
  const western = ['gujarat', 'rajasthan', 'madhya pradesh', 'chhattisgarh', 'maharashtra', 'goa', 'dadra and nagar haveli and daman and diu'];

  const normalized = state.toLowerCase();
  const includes = (list: string[]) => list.some((x) => x === normalized);

  if (includes(northern)) return Region.NORTH;
  if (includes(southern)) return Region.SOUTH;
  if (includes(eastern)) return Region.EAST;
  if (includes(western)) return Region.WEST;
  return Region.CENTRAL;
}

// Comprehensive 2-digit Indian circle resolver
const CIRCLE_MAP: Record<string, { state: string; district: string }> = {
  '11': { state: 'Delhi', district: 'New Delhi' },
  '12': { state: 'Haryana', district: 'Gurugram' },
  '13': { state: 'Haryana', district: 'Ambala' },
  '14': { state: 'Punjab', district: 'Ludhiana' },
  '15': { state: 'Punjab', district: 'Bathinda' },
  '16': { state: 'Chandigarh', district: 'Chandigarh' },
  '17': { state: 'Himachal Pradesh', district: 'Shimla' },
  '18': { state: 'Jammu & Kashmir', district: 'Jammu' },
  '19': { state: 'Jammu & Kashmir', district: 'Srinagar' },
  '20': { state: 'Uttar Pradesh', district: 'Aligarh' },
  '21': { state: 'Uttar Pradesh', district: 'Prayagraj' },
  '22': { state: 'Uttar Pradesh', district: 'Lucknow' },
  '23': { state: 'Uttar Pradesh', district: 'Mirzapur' },
  '24': { state: 'Uttarakhand', district: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', district: 'Meerut' },
  '26': { state: 'Uttarakhand', district: 'Nainital' },
  '27': { state: 'Uttar Pradesh', district: 'Gorakhpur' },
  '28': { state: 'Uttar Pradesh', district: 'Agra' },
  '30': { state: 'Rajasthan', district: 'Jaipur' },
  '31': { state: 'Rajasthan', district: 'Udaipur' },
  '32': { state: 'Rajasthan', district: 'Kota' },
  '33': { state: 'Rajasthan', district: 'Bikaner' },
  '34': { state: 'Rajasthan', district: 'Jodhpur' },
  '36': { state: 'Gujarat', district: 'Rajkot' },
  '37': { state: 'Gujarat', district: 'Kutch' },
  '38': { state: 'Gujarat', district: 'Ahmedabad' },
  '39': { state: 'Gujarat', district: 'Surat' },
  '40': { state: 'Maharashtra', district: 'Mumbai' },
  '41': { state: 'Maharashtra', district: 'Pune' },
  '42': { state: 'Maharashtra', district: 'Nashik' },
  '43': { state: 'Maharashtra', district: 'Chhatrapati Sambhajinagar' },
  '44': { state: 'Maharashtra', district: 'Nagpur' },
  '45': { state: 'Madhya Pradesh', district: 'Indore' },
  '46': { state: 'Madhya Pradesh', district: 'Bhopal' },
  '47': { state: 'Madhya Pradesh', district: 'Gwalior' },
  '48': { state: 'Madhya Pradesh', district: 'Jabalpur' },
  '49': { state: 'Chhattisgarh', district: 'Raipur' },
  '50': { state: 'Telangana', district: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', district: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', district: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', district: 'Visakhapatnam' },
  '56': { state: 'Karnataka', district: 'Bengaluru' },
  '57': { state: 'Karnataka', district: 'Mangaluru' },
  '58': { state: 'Karnataka', district: 'Hubballi' },
  '59': { state: 'Karnataka', district: 'Belagavi' },
  '60': { state: 'Tamil Nadu', district: 'Chennai' },
  '61': { state: 'Tamil Nadu', district: 'Thanjavur' },
  '62': { state: 'Tamil Nadu', district: 'Madurai' },
  '63': { state: 'Tamil Nadu', district: 'Vellore' },
  '64': { state: 'Tamil Nadu', district: 'Coimbatore' },
  '67': { state: 'Kerala', district: 'Kozhikode' },
  '68': { state: 'Kerala', district: 'Ernakulam' },
  '69': { state: 'Kerala', district: 'Thiruvananthapuram' },
  '70': { state: 'West Bengal', district: 'Kolkata' },
  '71': { state: 'West Bengal', district: 'Howrah' },
  '72': { state: 'West Bengal', district: 'Medinipur' },
  '73': { state: 'West Bengal', district: 'Siliguri' },
  '74': { state: 'West Bengal', district: 'North 24 Parganas' },
  '75': { state: 'Odisha', district: 'Bhubaneswar' },
  '76': { state: 'Odisha', district: 'Berhampur' },
  '77': { state: 'Odisha', district: 'Rourkela' },
  '78': { state: 'Assam', district: 'Kamrup' },
  '79': { state: 'Manipur', district: 'Imphal' },
  '80': { state: 'Bihar', district: 'Patna' },
  '81': { state: 'Bihar', district: 'Bhagalpur' },
  '82': { state: 'Jharkhand', district: 'Dhanbad' },
  '83': { state: 'Jharkhand', district: 'Ranchi' },
  '84': { state: 'Bihar', district: 'Muzaffarpur' },
  '85': { state: 'Bihar', district: 'Purnia' },
};

async function fetchIndiaPostOfficial(pin: string): Promise<{ state: string; district: string; areaType: string } | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const resp = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
      const office = data[0].PostOffice[0];
      return {
        state: office.State,
        district: office.District,
        areaType: office.Name ? `${office.Name} (${office.Block && office.Block !== 'NA' ? office.Block : 'Postal Circle'})` : 'Urban/Semi-Urban',
      };
    }
  } catch {
    // Network timeout or offline - gracefully fallback to circle map
  }
  return null;
}

import { checkDbHealth } from '../db/dal';
import { resolvePin } from '../live/pin';

export async function ensurePincodeExists(code: string) {
  const cleanCode = code.replace(/\D/g, '');
  if (cleanCode.length !== 6) return null;

  // Official live lookup only. No guessed districts, no invented coordinates,
  // and no auto-generated schools/projects written to the database.
  const p = await resolvePin(cleanCode).catch(() => null);
  if (!p) return null;

  const areaType = p.villages.length > 0 ? 'Rural / mixed' : 'Urban';
  const memory = {
    id: `live-${cleanCode}`,
    code: cleanCode,
    state: p.state,
    district: p.district,
    region: regionForState(p.state),
    areaType,
    lat: p.lat,
    lng: p.lng,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  if (!(await checkDbHealth())) return memory;

  try {
    const existing = await prisma.pincode.findUnique({ where: { code: cleanCode } });
    if (existing) return existing;
    return await prisma.pincode.create({
      data: {
        code: cleanCode,
        state: p.state,
        district: p.district,
        region: regionForState(p.state),
        areaType,
        lat: p.lat,
        lng: p.lng,
      },
    });
  } catch {
    return memory;
  }
}

