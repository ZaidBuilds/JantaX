import { describe, it, expect } from 'vitest';
import { governanceChain, guessSettlement, bodyForRoute, localNamesFor, SETTLEMENTS, type Settlement } from '../../core/governance/chain';
import { BODIES, type Bi } from '../../core/governance/bodies';
import { LOCAL_NAMES } from '../../core/governance/localNames';
import { ISSUES, issuesFor, routeFor } from '../../core/governance/issues';
import { INDIA_STATES, findState } from '../../core/geo/indiaStates';

const DEVANAGARI = /[ऀ-ॿ]/;
const LEVEL_ORDER = ['union', 'state', 'district', 'local', 'ward', 'department'];
const ALL_SETTLEMENTS = SETTLEMENTS.map((s) => s.id);

const group = (chain: ReturnType<typeof governanceChain>, level: string) => chain.groups.find((g) => g.level === level);
const ids = (chain: ReturnType<typeof governanceChain>, level: string) => group(chain, level)?.bodies.map((b) => b.id) ?? [];

/** A bilingual label: English with no Hindi in it, Hindi in Devanagari. */
function expectBilingual(v: Bi | undefined, where: string) {
  expect(v, where).toBeDefined();
  expect(v!.en.trim(), `${where} (en)`).not.toBe('');
  expect(DEVANAGARI.test(v!.en), `${where} English has Hindi: ${v!.en}`).toBe(false);
  expect(DEVANAGARI.test(v!.hi), `${where} Hindi is not in Devanagari: ${v!.hi}`).toBe(true);
}

describe('India tile map', () => {
  it('has all 28 states and 8 union territories, once each', () => {
    expect(INDIA_STATES).toHaveLength(36);
    expect(INDIA_STATES.filter((s) => s.kind === 'state')).toHaveLength(28);
    expect(INDIA_STATES.filter((s) => s.kind === 'ut')).toHaveLength(8);
    expect(new Set(INDIA_STATES.map((s) => s.code)).size).toBe(36);
    expect(new Set(INDIA_STATES.map((s) => s.name)).size).toBe(36);
  });

  it('gives every state its own tile inside the 7 × 8 grid', () => {
    const tiles = INDIA_STATES.map((s) => s.tile.join(','));
    expect(new Set(tiles).size).toBe(36);
    for (const s of INDIA_STATES) {
      expect(s.tile[0], s.code).toBeGreaterThanOrEqual(1);
      expect(s.tile[0], s.code).toBeLessThanOrEqual(7);
      expect(s.tile[1], s.code).toBeGreaterThanOrEqual(1);
      expect(s.tile[1], s.code).toBeLessThanOrEqual(8);
    }
  });

  it('follows the outline of India', () => {
    const at = (code: string) => findState(code)!.tile;
    // North to south: Kashmir, Delhi, the centre, the Deccan, the southern tip.
    const rows = ['JK', 'DL', 'MP', 'KA', 'KL'].map((c) => at(c)[1]);
    expect(rows).toEqual([...rows].sort((a, b) => a - b));
    expect(new Set(rows).size).toBe(rows.length);
    // West to east: Gujarat, Madhya Pradesh, West Bengal, then the north-east.
    const cols = ['GJ', 'MP', 'WB', 'MN'].map((c) => at(c)[0]);
    expect(cols).toEqual([...cols].sort((a, b) => a - b));
    // The north-east sits east of Bihar, and Sikkim between them.
    expect(at('SK')[0]).toBeGreaterThan(at('BR')[0]);
    expect(at('AS')[0]).toBeGreaterThan(at('SK')[0]);
  });

  it('labels every tile in Hindi', () => {
    for (const s of INDIA_STATES) {
      expect(DEVANAGARI.test(s.nameHi), s.code).toBe(true);
      expect(DEVANAGARI.test(s.shortHi), s.code).toBe(true);
      expect(s.shortHi.length, `${s.code} short label is too long for a tile`).toBeLessThanOrEqual(8);
    }
  });

  it('finds states by name, old name, alias or code', () => {
    expect(findState('Orissa')?.code).toBe('OD');
    expect(findState('NCT OF DELHI')?.code).toBe('DL');
    expect(findState('Telangana')?.code).toBe('TG');
    expect(findState('tg')?.code).toBe('TG');
    expect(findState('Jammu & Kashmir')?.code).toBe('JK');
    expect(findState('Dadra and Nagar Haveli')?.code).toBe('DD');
    expect(findState('  uttar   pradesh ')?.code).toBe('UP');
    expect(findState('Atlantis')).toBeUndefined();
    expect(findState(undefined)).toBeUndefined();
  });

  it('only names local bodies for real state codes', () => {
    const codes = new Set(INDIA_STATES.map((s) => s.code));
    for (const code of Object.keys(LOCAL_NAMES)) expect(codes.has(code), code).toBe(true);
  });
});

describe('governance chain', () => {
  it('runs from the Union down to the ward for every state and kind of place', () => {
    for (const s of INDIA_STATES) {
      for (const settlement of ALL_SETTLEMENTS) {
        const chain = governanceChain(s.code, settlement);
        const levels = chain.groups.map((g) => g.level);
        const where = `${s.code} ${settlement}`;
        expect(levels.map((l) => LEVEL_ORDER.indexOf(l)), where).toEqual([...levels.map((l) => LEVEL_ORDER.indexOf(l))].sort((a, b) => a - b));
        for (const l of ['union', 'state', 'district', 'department']) expect(levels, where).toContain(l);
        for (const g of chain.groups) expect(g.bodies.length, `${where} ${g.level}`).toBeGreaterThan(0);
        expect(ids(chain, 'union'), where).toEqual(expect.arrayContaining(['union-government', 'mp']));
        expect(ids(chain, 'department'), where).toEqual(expect.arrayContaining(['pwd', 'nhai']));
      }
    }
  });

  it('names a Rajasthan village chain Zila Pramukh, Pradhan and Sarpanch', () => {
    const chain = governanceChain('RJ', 'village');
    const local = group(chain, 'local')!.bodies;
    expect(local.map((b) => b.name.en)).toEqual(['Zila Parishad', 'Panchayat Samiti', 'Gram Panchayat']);
    expect(local.map((b) => b.elected?.title.en)).toEqual(['Zila Pramukh', 'Pradhan', 'Sarpanch']);
    expect(local.map((b) => b.elected?.title.hi)).toEqual(['ज़िला प्रमुख', 'प्रधान', 'सरपंच']);
    expect(ids(chain, 'ward')).toEqual(['ward-member']);
    expect(chain.notes.some((n) => n.en.includes('Pradhan'))).toBe(true);
  });

  it('names an Uttar Pradesh village chain Block Pramukh and Gram Pradhan, with MLCs', () => {
    const chain = governanceChain('UP', 'village');
    expect(group(chain, 'local')!.bodies.map((b) => b.elected?.title.en)).toEqual(['Adhyaksh', 'Block Pramukh', 'Gram Pradhan']);
    expect(ids(chain, 'state')).toEqual(expect.arrayContaining(['state-government', 'governor', 'mla', 'mlc']));
    expect(ids(chain, 'department')).toContain('rural-roads');
  });

  it('has no MLCs in a state without a legislative council', () => {
    expect(ids(governanceChain('RJ', 'city'), 'state')).not.toContain('mlc');
  });

  it('puts Delhi villages under the MCD, with no panchayats', () => {
    const chain = governanceChain('DL', 'village');
    expect(ids(chain, 'local')).toEqual(['municipal-corporation']);
    expect(group(chain, 'local')!.bodies[0].name.en).toContain('MCD');
    expect(ids(chain, 'local')).not.toContain('gram-panchayat');
    expect(chain.notes.some((n) => n.en.startsWith('Delhi has no panchayats'))).toBe(true);
    expect(group(governanceChain('DL', 'city'), 'local')!.bodies[0].name.en).toBe('Municipal Corporation of Delhi (MCD)');
  });

  it('shows traditional bodies, not panchayats, where Part IX does not apply', () => {
    const chain = governanceChain('ML', 'village');
    expect(chain.groups.map((g) => g.level)).not.toContain('local');
    expect(chain.notes[0].en).toContain('no panchayats');
  });

  it('gives a union territory without a legislature an administrator, not an MLA', () => {
    const chain = governanceChain('LA', 'village');
    expect(group(chain, 'state')!.title.en).toBe('Union territory');
    expect(ids(chain, 'state')).toEqual(['ut-administration']);
    expect(ids(chain, 'union')).not.toContain('rajya-sabha-mp');
    for (const g of chain.groups) expect(g.bodies.map((b) => b.id)).not.toContain('mla');
  });

  it('uses the right urban body for each size of town', () => {
    const local = (s: Settlement) => ids(governanceChain('MH', s), 'local');
    expect(local('city')).toEqual(['municipal-corporation']);
    expect(local('town')).toEqual(['municipal-council']);
    expect(local('small-town')).toEqual(['nagar-panchayat']);
    expect(ids(governanceChain('MH', 'city'), 'ward')).toEqual(['ward-councillor']);
    expect(ids(governanceChain('MH', 'city'), 'department')).not.toContain('rural-roads');
  });

  it('falls back to the common names when the state is unknown', () => {
    const chain = governanceChain(undefined, 'village');
    expect(group(chain, 'local')!.bodies.map((b) => b.id)).toEqual(['zila-panchayat', 'block-panchayat', 'gram-panchayat']);
    expect(localNamesFor('XX').village).toBeDefined();
  });

  it('carries English and Hindi for every name, title and note', () => {
    for (const s of INDIA_STATES) {
      for (const settlement of ALL_SETTLEMENTS) {
        const chain = governanceChain(s.code, settlement);
        chain.notes.forEach((n, i) => expectBilingual(n, `${s.code} ${settlement} note ${i}`));
        for (const g of chain.groups) {
          expectBilingual(g.title, `${s.code} ${g.level} title`);
          for (const b of g.bodies) {
            const where = `${s.code} ${settlement} ${b.id}`;
            expectBilingual(b.name, `${where} name`);
            expectBilingual(b.about, `${where} about`);
            if (b.elected) expectBilingual(b.elected.title, `${where} elected title`);
            if (b.official) expectBilingual(b.official.title, `${where} officer title`);
            b.handles.forEach((h, i) => expectBilingual(h, `${where} handles ${i}`));
          }
        }
      }
    }
  });
});

describe('who fixes what', () => {
  it('routes every problem to a body that exists, in every state', () => {
    for (const s of INDIA_STATES) {
      for (const settlement of ALL_SETTLEMENTS) {
        const chain = governanceChain(s.code, settlement);
        for (const issue of issuesFor(settlement)) {
          const route = routeFor(issue, settlement);
          const where = `${s.code} ${settlement} ${issue.id}`;
          expect(route, where).toBeDefined();
          expect(bodyForRoute(route!.body, chain), `${where} → ${route!.body}`).toBeDefined();
          expectBilingual(route!.first, `${where} first step`);
          route!.escalate.forEach((e, i) => expectBilingual(e, `${where} escalation ${i}`));
        }
      }
    }
  });

  it('only points at bodies in the registry', () => {
    for (const issue of ISSUES) {
      for (const route of [issue.urban, issue.rural]) {
        if (route && route.body !== 'local') expect(BODIES[route.body], `${issue.id} → ${route.body}`).toBeDefined();
      }
    }
  });

  it('sends a local problem to the body nearest the person', () => {
    expect(bodyForRoute('local', governanceChain('RJ', 'village'))?.name.en).toBe('Gram Panchayat');
    expect(bodyForRoute('local', governanceChain('DL', 'village'))?.name.en).toContain('MCD');
    expect(bodyForRoute('local', governanceChain('KA', 'city'))?.id).toBe('municipal-corporation');
    expect(bodyForRoute('pwd', governanceChain('KA', 'city'))?.id).toBe('pwd');
  });
});

describe('guessing the kind of place from post offices', () => {
  const offices = (...types: string[]) => types.map((type) => ({ type }));
  it('reads a head office or a metro district as a city', () => {
    expect(guessSettlement(offices('HO', 'SO'), false)).toBe('city');
    expect(guessSettlement(offices('BO'), true)).toBe('city');
  });
  it('reads several sub offices as a town and one as a small town', () => {
    expect(guessSettlement(offices('SO', 'SO', 'PO', 'BO'), false)).toBe('town');
    expect(guessSettlement(offices('so', 'BO'), false)).toBe('small-town');
  });
  it('reads mostly branch offices, or none at all, as a village', () => {
    expect(guessSettlement(offices('SO', 'BO', 'BO', 'BO'), false)).toBe('village');
    expect(guessSettlement(offices('BO'), false)).toBe('village');
    expect(guessSettlement([], false)).toBe('village');
  });
});
