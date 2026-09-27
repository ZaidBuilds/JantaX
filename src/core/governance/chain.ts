import { BODIES, type Bi, type Body, type Level } from './bodies';
import { DEFAULT_NAMES, LOCAL_NAMES, type LocalNames, type Tier } from './localNames';

/** Kind of place, which decides the local chain: municipal bodies in towns, panchayats in villages. */
export type Settlement = 'city' | 'town' | 'small-town' | 'village';

export const SETTLEMENTS: { id: Settlement; label: Bi; hint: Bi }[] = [
  { id: 'city', label: { en: 'Big city', hi: 'बड़ा शहर' }, hint: { en: 'Municipal corporation', hi: 'नगर निगम' } },
  { id: 'town', label: { en: 'Town', hi: 'कस्बा / शहर' }, hint: { en: 'Municipal council', hi: 'नगर पालिका परिषद' } },
  { id: 'small-town', label: { en: 'Small town', hi: 'छोटा कस्बा' }, hint: { en: 'Nagar panchayat', hi: 'नगर पंचायत' } },
  { id: 'village', label: { en: 'Village', hi: 'गाँव' }, hint: { en: 'Panchayats', hi: 'पंचायतें' } },
];

export interface ChainGroup {
  level: Level;
  title: Bi;
  bodies: Body[];
}

export interface Chain {
  groups: ChainGroup[];
  notes: Bi[];
  names: LocalNames;
}

const GROUP_TITLES: Record<Level, Bi> = {
  union: { en: 'Union', hi: 'केंद्र' },
  state: { en: 'State', hi: 'राज्य' },
  district: { en: 'District', hi: 'ज़िला' },
  local: { en: 'Your local body', hi: 'आपका स्थानीय निकाय' },
  ward: { en: 'Your ward', hi: 'आपका वार्ड' },
  department: { en: 'Departments that do the work', hi: 'काम करने वाले विभाग' },
};

/** A body with its name and head title replaced by what this state calls them. */
function named(id: string, tier?: Tier | null, extra?: Partial<Body>): Body {
  const base = BODIES[id];
  if (!tier) return { ...base, ...extra };
  return {
    ...base,
    ...extra,
    name: tier.name,
    elected: base.elected ? { ...base.elected, title: tier.head } : base.elected,
  };
}

export function localNamesFor(stateCode: string | undefined): LocalNames {
  return { ...DEFAULT_NAMES, ...(stateCode ? LOCAL_NAMES[stateCode] : undefined) };
}

/** The line of government for a place, from the Union down to the ward, using the state's own names. */
export function governanceChain(stateCode: string | undefined, settlement: Settlement): Chain {
  const names = localNamesFor(stateCode);
  const notes: Bi[] = [];
  const groups: ChainGroup[] = [];

  groups.push({ level: 'union', title: GROUP_TITLES.union, bodies: [BODIES['union-government'], BODIES.mp, ...(names.noLegislature ? [] : [BODIES['rajya-sabha-mp']])] });

  if (names.noLegislature) {
    groups.push({ level: 'state', title: { en: 'Union territory', hi: 'केंद्रशासित प्रदेश' }, bodies: [BODIES['ut-administration']] });
  } else {
    groups.push({
      level: 'state',
      title: GROUP_TITLES.state,
      bodies: [BODIES['state-government'], BODIES.governor, BODIES.mla, ...(names.legislativeCouncil ? [BODIES.mlc] : [])],
    });
  }

  groups.push({ level: 'district', title: GROUP_TITLES.district, bodies: [BODIES['district-administration'], BODIES.police] });

  const corporation = named('municipal-corporation', names.corporationName ? { name: names.corporationName, head: names.corporationHead ?? DEFAULT_NAMES.corporationHead } : { name: BODIES['municipal-corporation'].name, head: names.corporationHead ?? DEFAULT_NAMES.corporationHead });
  const councillor = BODIES['ward-councillor'];

  if (settlement === 'village') {
    if (names.noPanchayats) {
      notes.push(names.noPanchayats);
      if (names.corporationName) {
        groups.push({ level: 'local', title: GROUP_TITLES.local, bodies: [corporation] });
        groups.push({ level: 'ward', title: GROUP_TITLES.ward, bodies: [councillor] });
      }
    } else {
      const local = [
        names.district ? named('zila-panchayat', names.district) : null,
        names.block ? named('block-panchayat', names.block) : null,
        names.village ? named('gram-panchayat', names.village) : null,
      ].filter((b): b is Body => Boolean(b));
      groups.push({ level: 'local', title: GROUP_TITLES.local, bodies: local });
      groups.push({ level: 'ward', title: GROUP_TITLES.ward, bodies: [BODIES['ward-member']] });
    }
  } else {
    const body =
      settlement === 'city' ? corporation : settlement === 'town' ? named('municipal-council', names.council) : named('nagar-panchayat');
    groups.push({ level: 'local', title: GROUP_TITLES.local, bodies: [body] });
    groups.push({ level: 'ward', title: GROUP_TITLES.ward, bodies: [councillor] });
  }

  if (names.note) notes.push(names.note);

  groups.push({
    level: 'department',
    title: GROUP_TITLES.department,
    bodies: ['pwd', 'water', 'electricity', 'health', 'education', 'food-supply', 'nhai', ...(settlement === 'village' ? ['rural-roads'] : []), 'pollution-board', 'rera'].map((id) => BODIES[id]),
  });

  return { groups, notes, names };
}

/** The body an issue route points at, resolved for this place ('local' becomes the city or village body). */
export function bodyForRoute(bodyId: string, chain: Chain): Body | undefined {
  if (bodyId === 'local' || bodyId === 'gram-panchayat') {
    const local = chain.groups.find((g) => g.level === 'local')?.bodies;
    if (!local?.length) return BODIES[bodyId === 'local' ? 'municipal-corporation' : bodyId];
    return local[local.length - 1];
  }
  return BODIES[bodyId];
}

/**
 * A starting guess at the kind of place from India Post's offices for the PIN: a head office means
 * a city, several sub offices a town, and mostly branch offices a village. People can change it.
 */
export function guessSettlement(offices: { type: string }[], metro: boolean): Settlement {
  if (metro) return 'city';
  const types = offices.map((o) => o.type.toUpperCase());
  if (types.includes('HO')) return 'city';
  const sub = types.filter((t) => t === 'PO' || t === 'SO').length;
  const branch = types.filter((t) => t === 'BO').length;
  if (sub >= 3) return 'town';
  if (sub >= 1 && branch <= sub) return 'small-town';
  return 'village';
}
