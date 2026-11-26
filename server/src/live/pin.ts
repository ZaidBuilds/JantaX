// Resolve ANY Indian PIN to state, district, villages and coordinates.
// Sources: data.gov.in Pincode Directory + LGD Villages (official),
// with api.postalpincode.in (India Post mirror) as a backup.

import { fetchOgd } from '../connectors/ogdClient';
import { OGD } from '../connectors/ogdResources';
import { fetchIndiaPostData } from '../connectors/indiaPostConnector';
import { cached, HOUR } from './cache';
import type { LiveSource } from './types';
import { toNum } from './types';

export interface PinProfile {
  pin: string;
  state: string;
  district: string;
  lat: number | null;
  lng: number | null;
  postOffices: { name: string; type: string; delivery: string; division: string }[];
  subdistricts: string[];
  villages: { name: string; subdistrict: string; lgdCode: number }[];
  sources: LiveSource[];
}

export function titleCase(s: string): string {
  return s.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

const inIndia = (lat: number, lng: number) => lat > 6 && lat < 37.5 && lng > 68 && lng < 98;

async function load(pin: string): Promise<PinProfile | null> {
  const [dir, lgd] = await Promise.allSettled([
    fetchOgd<Record<string, string>>('pincodeDirectory', { filters: { pincode: pin }, max: 60 }),
    fetchOgd<Record<string, string | number>>('lgdVillagesWithPin', { filters: { pincode: pin }, max: 60 }),
  ]);

  const offices = dir.status === 'fulfilled' ? dir.value.records : [];
  const villages = lgd.status === 'fulfilled' ? lgd.value.records : [];
  const sources: LiveSource[] = [];

  let state = '';
  let district = '';

  if (offices.length > 0 && dir.status === 'fulfilled') {
    state = titleCase(offices[0].statename ?? '');
    district = titleCase(offices[0].district ?? '');
    sources.push({
      name: 'Department of Posts — All India Pincode Directory',
      url: dir.value.sourceUrl,
      resourceId: OGD.pincodeDirectory.id,
      updatedDate: dir.value.updatedDate,
      level: 'post office',
    });
  }

  if (villages.length > 0 && lgd.status === 'fulfilled') {
    // LGD spelling is canonical and matches most other datasets.
    district = String(villages[0].districtNameEnglish ?? district);
    state = String(villages[0].stateNameEnglish ?? state);
    sources.push({
      name: 'MoPR — Local Government Directory (Villages with PIN)',
      url: lgd.value.sourceUrl,
      resourceId: OGD.lgdVillagesWithPin.id,
      updatedDate: lgd.value.updatedDate,
      level: 'village',
    });
  }

  // Backup: India Post mirror, only if both official sources returned nothing.
  if (!district) {
    const post = await fetchIndiaPostData(pin);
    if (!post) {
      // Both official calls failed at network level: throw so it is not cached.
      if (dir.status === 'rejected' && lgd.status === 'rejected') {
        throw new Error('PIN sources unreachable');
      }
      return null;
    }
    state = post.state;
    district = post.district;
    sources.push({
      name: 'India Post (via api.postalpincode.in)',
      url: `https://api.postalpincode.in/pincode/${pin}`,
      updatedDate: null,
      level: 'post office',
    });
  }

  const coords = offices
    .map((o) => [toNum(o.latitude), toNum(o.longitude)] as const)
    .filter((c): c is readonly [number, number] => c[0] !== null && c[1] !== null && inIndia(c[0], c[1]));

  return {
    pin,
    state,
    district,
    lat: median(coords.map((c) => c[0])),
    lng: median(coords.map((c) => c[1])),
    postOffices: offices.map((o) => ({
      name: o.officename,
      type: o.officetype,
      delivery: o.delivery,
      division: o.divisionname,
    })),
    subdistricts: [...new Set(villages.map((v) => String(v.subdistrictNameEnglish)))],
    villages: villages.map((v) => ({
      name: String(v.villageNameEnglish),
      subdistrict: String(v.subdistrictNameEnglish),
      lgdCode: Number(v.villageCode),
    })),
    sources,
  };
}

/** Cached for 24h. Returns null only if no source knows this PIN. */
export function resolvePin(pin: string): Promise<PinProfile | null> {
  const clean = pin.replace(/\D/g, '');
  if (!/^[1-9]\d{5}$/.test(clean)) return Promise.resolve(null);
  return cached(`pin:${clean}`, 24 * HOUR, () => load(clean));
}
