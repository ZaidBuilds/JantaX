import { describe, it, expect } from 'vitest';
import { localSearch, localAutocomplete } from '../../core/services/localSearch';
import { normalizeSchool } from '../../modules/school/normalize';
import { canonicalModuleId, getModule, moduleHref, MODULE_GROUPS } from '../../ui/modules';
import { decodeEntities, reportForDisplay } from '../../ui/text';
import { toneForStatus, toneForScore } from '../../ui/Badge';
import type { ApiRecord } from '../../core/services/api';

const school: ApiRecord = {
  id: 'mock-school-110001-0',
  moduleId: 'school',
  location: { pinCode: '110001', state: 'Delhi', district: 'New Delhi' },
  titleEnglish: 'Govt. Primary School Narela Sector A9',
  titleHindi: 'राजकीय प्राथमिक विद्यालय',
  status: 'Looking Steady',
  groundTruthScore: 81,
  reality: { evidenceCount: 1 },
  claim: { value: 100 },
  updatedAt: '2026-09-01',
  hasToilet: true,
  hasElectricity: false,
  officialTeacherCount: 4,
  teachersSanctioned: 5,
};

describe('local search fallback', () => {
  it('finds records across modules for a place name', () => {
    const res = localSearch({ q: 'delhi', limit: 50 }, [school]);
    expect(res.pagination.total).toBeGreaterThan(5);
    const types = new Set(res.results.map((r) => r.type));
    expect(types.size).toBeGreaterThan(2);
  });

  it('requires every word to match and ranks title matches first', () => {
    const res = localSearch({ q: 'narela school' }, [school]);
    expect(res.results[0]?.id).toBe(school.id);
    expect(localSearch({ q: 'narela zzzz' }, [school]).pagination.total).toBe(0);
  });

  it('filters by type and PIN and paginates', () => {
    const courts = localSearch({ q: 'delhi', type: 'court', limit: 50 }, [school]);
    expect(courts.results.every((r) => r.type === 'court')).toBe(true);
    const pinned = localSearch({ q: 'delhi', pincode: '110001', limit: 50 }, [school]);
    expect(pinned.results.every((r) => r.location?.pincode === '110001')).toBe(true);
    const page2 = localSearch({ q: 'delhi', limit: 2, page: 2 }, [school]);
    expect(page2.results.length).toBeLessThanOrEqual(2);
    expect(page2.pagination.page).toBe(2);
  });

  it('every result links somewhere', () => {
    const res = localSearch({ q: 'delhi', limit: 100 }, [school]);
    res.results.forEach((r) => expect(typeof (r.metadata as { href?: string }).href).toBe('string'));
  });

  it('autocomplete returns at most six suggestions', () => {
    expect(localAutocomplete('de', [school]).length).toBeLessThanOrEqual(6);
  });
});

describe('school record normaliser', () => {
  it('derives metrics from flat facility flags', () => {
    const s = normalizeSchool(school)!;
    expect(s.metrics.toiletUsable).toBe('yes');
    expect(s.metrics.classroomReady).toBe('no');
    expect(s.metrics.teacherPresent).toBe('no');
    expect(s.evidence).toEqual([]);
  });

  it('keeps existing metrics and rejects non-objects', () => {
    const withMetrics = { ...school, metrics: { teacherPresent: 'yes', toiletUsable: 'no', mdmServed: 'yes', learningMaterials: 'yes', classroomReady: 'yes' } };
    expect(normalizeSchool(withMetrics)!.metrics.toiletUsable).toBe('no');
    expect(normalizeSchool(null)).toBeNull();
  });
});

describe('module catalogue', () => {
  it('maps URL aliases to canonical module ids', () => {
    expect(canonicalModuleId('health')).toBe('hospital');
    expect(canonicalModuleId('PDS')).toBe('ration');
    expect(canonicalModuleId('cm-accountability')).toBe('andhbhakt');
    expect(canonicalModuleId('courts')).toBe('courts');
  });

  it('groups all eighteen modules exactly once, each with metadata', () => {
    const ids = MODULE_GROUPS.flatMap((g) => g.modules);
    expect(ids).toHaveLength(18);
    expect(new Set(ids).size).toBe(18);
    ids.forEach((id) => expect(getModule(id)?.summary.length).toBeGreaterThan(20));
  });

  it('sends schools to the directory and keeps the PIN', () => {
    expect(moduleHref('school', '250001')).toBe('/schools?pin=250001');
    expect(moduleHref('rera', '250001')).toBe('/module/rera?pin=250001');
  });
});

describe('display helpers', () => {
  it('decodes stored HTML entities for display', () => {
    expect(decodeEntities('Cavity &amp; Pothole &lt;b&gt;')).toBe('Cavity & Pothole <b>');
    const r = reportForDisplay({ title: 'A &amp; B', description: 'x', location: { landmark: 'Gate &#x27;2&#x27;' } });
    expect(r.title).toBe('A & B');
    expect(r.location.landmark).toBe("Gate '2'");
  });

  it('maps statuses and scores to tones', () => {
    expect(toneForStatus('Completed')).toBe('good');
    expect(toneForStatus('Delayed')).toBe('bad');
    expect(toneForStatus('Under Review')).toBe('warn');
    expect(toneForScore(80)).toBe('good');
    expect(toneForScore(40)).toBe('bad');
  });
});
