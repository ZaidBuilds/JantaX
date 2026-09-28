import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { formatDate, loadHindi, locale, lookupHindi, pick, setLang, t } from '../../i18n';
import { missing, startTranslator, stopTranslator } from '../../i18n/domTranslator';
import { claims } from '../../modules/andhbhakt/data/rawSeedData';
import { getSpineDataForPincode } from '../../modules/infra/data/nationwideSpine';

const DEVANAGARI = /[ऀ-ॿ]/;
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('before the Hindi dictionary loads', () => {
  it('finds nothing, so pages wait for it instead of showing English', () => {
    expect(lookupHindi('Who runs your area')).toBeNull();
  });
});

describe('Hindi dictionary', () => {
  let hi: typeof import('../../i18n/hi');
  beforeAll(async () => {
    await loadHindi();
    hi = await import('../../i18n/hi');
  });
  afterEach(() => setLang('en'));

  it('translates a UI string, ignoring extra whitespace', () => {
    expect(lookupHindi('Who runs your area')).toBe('आपका क्षेत्र कौन चलाता है');
    expect(lookupHindi('  Who   runs your\narea ')).toBe('आपका क्षेत्र कौन चलाता है');
  });

  it('translates strings with numbers in them by their shape', () => {
    const template = hi.HI['About {0} months after the exam'];
    expect(template).toBeDefined();
    expect(lookupHindi('About 4 months after the exam')).toBe(template.replace('{0}', '4'));
    expect(lookupHindi('About 12 months after the exam')).toContain('12');
  });

  it('leaves Hindi text, and names kept as written, unchanged', () => {
    expect(lookupHindi('दिल्ली नगर निगम (MCD)')).toBe('दिल्ली नगर निगम (MCD)');
    expect(hi.HI_KEEP.has('Connaught Place SO')).toBe(true);
    expect(lookupHindi('Connaught Place SO')).toBe('Connaught Place SO');
  });

  it('translates strings that carry a value through patterns', () => {
    expect(lookupHindi('Remove PIN 110001')).toBe('पिन 110001 हटाएँ');
    expect(lookupHindi('Nothing found for “school”')).toMatch(DEVANAGARI);
    expect(lookupHindi('Nothing found for “school”')).toContain('school');
  });

  it('returns null for English it has no Hindi for', () => {
    expect(lookupHindi('A sentence no screen has ever shown')).toBeNull();
  });

  it('keeps every placeholder in every translation', () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(' ');
    const broken = Object.entries(hi.HI).filter(([en, hindi]) => placeholders(en) !== placeholders(hindi));
    expect(broken).toEqual([]);
  });

  it('has no empty translations and no keys that lookups cannot reach', () => {
    expect(Object.entries(hi.HI).filter(([, hindi]) => !hindi.trim())).toEqual([]);
    expect(Object.keys(hi.HI).filter((k) => k !== k.replace(/\s+/g, ' ').trim())).toEqual([]);
  });

  it('t() returns English in English mode and Hindi in Hindi mode, filling values', () => {
    expect(t('{n} results for “{q}”', { n: 3, q: 'school' })).toBe('3 results for “school”');
    setLang('hi');
    expect(t('{n} results for “{q}”', { n: 3, q: 'school' })).toBe('“school” के लिए 3 नतीजे');
    expect(t('A sentence no screen has ever shown')).toBe('A sentence no screen has ever shown');
  });

  it('pick() chooses the record’s own language version', () => {
    expect(pick('Lucknow', 'लखनऊ')).toBe('Lucknow');
    setLang('hi');
    expect(pick('Lucknow', 'लखनऊ')).toBe('लखनऊ');
    expect(pick('Lucknow', '')).toBe('Lucknow');
    expect(pick('Lucknow', undefined)).toBe('Lucknow');
  });

  it('formats dates for the chosen language', () => {
    expect(locale()).toBe('en-IN');
    expect(formatDate('2025-03-12')).toMatch(/Mar/);
    setLang('hi');
    expect(locale()).toBe('hi-IN');
    expect(formatDate('2025-03-12')).toMatch(DEVANAGARI);
    expect(formatDate('not a date')).toBe('not a date');
  });
});

describe('page translator', () => {
  beforeAll(loadHindi);
  afterEach(() => {
    stopTranslator();
    document.body.innerHTML = '';
    missing.clear();
  });

  it('translates text, sentences split across text nodes, and labels', () => {
    document.body.innerHTML = '<main><h1>Who runs your area</h1><p id="s"></p><input placeholder="Who fixes what"><button aria-label="Who fixes what">x</button></main>';
    // React writes "About {n} months after the exam" as three text nodes.
    const p = document.getElementById('s')!;
    ['About ', '4', ' months after the exam'].forEach((s) => p.appendChild(document.createTextNode(s)));
    startTranslator(document.body);
    expect(document.querySelector('h1')!.textContent).toBe('आपका क्षेत्र कौन चलाता है');
    expect(p.textContent).toBe(lookupHindi('About 4 months after the exam'));
    expect(document.querySelector('input')!.getAttribute('placeholder')).toBe('कौन क्या ठीक करता है');
    expect(document.querySelector('button')!.getAttribute('aria-label')).toBe('कौन क्या ठीक करता है');
  });

  it('translates a line joined from whole strings part by part', () => {
    document.body.innerHTML = '<p></p>';
    const p = document.querySelector('p')!;
    ['Ministry of Power', ' · ', 'By state'].forEach((s) => p.appendChild(document.createTextNode(s)));
    startTranslator(document.body);
    expect(p.textContent).toBe(`${lookupHindi('Ministry of Power')} · राज्यवार`);
    expect([...missing]).toEqual([]);
  });

  it('reports the whole sentence when any part of it has no Hindi', () => {
    document.body.innerHTML = '<p></p>';
    const p = document.querySelector('p')!;
    ['Ministry of Power', ' pays ', '3', ' people'].forEach((s) => p.appendChild(document.createTextNode(s)));
    startTranslator(document.body);
    expect(p.textContent).toBe('Ministry of Power pays 3 people');
    expect([...missing]).toContain('Ministry of Power pays {0} people');
  });

  it('leaves record values marked translate="no" alone', () => {
    document.body.innerHTML = '<p translate="no">Who runs your area</p><code>Who runs your area</code>';
    startTranslator(document.body);
    expect(document.querySelector('p')!.textContent).toBe('Who runs your area');
    expect(document.querySelector('code')!.textContent).toBe('Who runs your area');
  });

  it('translates English that React writes again after the first pass', async () => {
    document.body.innerHTML = '<main><h1>Who runs your area</h1></main>';
    startTranslator(document.body);
    const text = document.querySelector('h1')!.firstChild as Text;
    text.data = 'Who fixes what';
    await flush();
    expect(text.data).toBe('कौन क्या ठीक करता है');
    const added = document.createElement('p');
    added.textContent = 'Who runs your area';
    document.querySelector('main')!.appendChild(added);
    await flush();
    expect(added.textContent).toBe('आपका क्षेत्र कौन चलाता है');
  });

  it('lists English it could not translate, by shape, for the coverage check', () => {
    document.body.innerHTML = '<p>Untranslated line with 42 items</p>';
    startTranslator(document.body);
    expect([...missing]).toContain('Untranslated line with {0} items');
  });

  it('stops when English is chosen again', async () => {
    document.body.innerHTML = '<main></main>';
    startTranslator(document.body);
    stopTranslator();
    const p = document.createElement('p');
    p.textContent = 'Who runs your area';
    document.querySelector('main')!.appendChild(p);
    await flush();
    expect(p.textContent).toBe('Who runs your area');
  });
});

describe('sample records carry both languages', () => {
  const PAIRED = ['claimNumber', 'realityNumber', 'claimedBy', 'claimedByDesignation', 'claimOccasion', 'district', 'contractorName', 'officerName', 'officerDesignation', 'officerDept'] as const;

  it('keeps Hindi out of the English side of the CM claim records', () => {
    for (const c of claims) {
      for (const f of PAIRED) expect(DEVANAGARI.test(c[f]), `${c.pincode} ${f}: ${c[f]}`).toBe(false);
      expect(DEVANAGARI.test(c.claimTextEn), `${c.pincode} claimTextEn`).toBe(false);
      expect(DEVANAGARI.test(c.realityTextEn), `${c.pincode} realityTextEn`).toBe(false);
      expect(DEVANAGARI.test(c.claimTextHi), `${c.pincode} claimTextHi`).toBe(true);
      expect(DEVANAGARI.test(c.realityNumberHi), `${c.pincode} realityNumberHi`).toBe(true);
    }
  });

  it('names contractors in both languages on the fund spine', () => {
    for (const pin of ['110001', '302001', '600001', '226001']) {
      for (const c of getSpineDataForPincode(pin).contractors) {
        expect(DEVANAGARI.test(c.name), `${pin} ${c.name}`).toBe(false);
        expect(DEVANAGARI.test(c.nameHi), `${pin} ${c.nameHi}`).toBe(true);
        expect(c.name).toMatch(/\(sample [A-Z]\)$/);
      }
    }
  });
});
