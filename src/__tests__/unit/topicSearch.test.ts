// @vitest-environment node
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { searchTopics } from '../../core/services/topicSearch';
import { landscapeFor } from '../../ui/AreaScene';

const titles = (q: string) => searchTopics(q).map((t) => t.title);

describe('searchTopics', () => {
  it('finds the schools module first for "school", then task pages that mention schools', () => {
    const hits = titles('school');
    expect(hits[0]).toBe('Government schools');
    expect(hits).toContain('Report an issue');
  });

  it('treats a plural the same as the singular', () => {
    expect(titles('schools')[0]).toBe('Government schools');
  });

  it('matches word starts only, so "air" does not find words that merely contain it', () => {
    const hits = searchTopics('air');
    expect(hits[0].title).toBe('Air quality');
    expect(hits.map((h) => h.title)).toContain('GRAP pollution rules');
    for (const h of hits) expect(`${h.title} ${h.text}`.toLowerCase()).not.toMatch(/\bfair\b/);
  });

  it('needs every word of the query to match', () => {
    expect(titles('court case')).toContain('Track a court case (CNR)');
    expect(searchTopics('court garbage')).toEqual([]);
  });

  it('returns nothing for an empty query or a PIN code, which the record search handles', () => {
    expect(searchTopics('')).toEqual([]);
    expect(searchTopics('   ')).toEqual([]);
    expect(searchTopics('110001')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(searchTopics('a', 3).length).toBeLessThanOrEqual(3);
  });

  it('only links to routes the app actually has', () => {
    const app = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
    const routes = [...app.matchAll(/path="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((p) => p !== '*')
      .map((p) => new RegExp(`^${p.replace(/:[^/]+/g, '[^/]+')}$`));
    const all = ['school', 'air', 'report', 'rti', 'court', 'voter', 'ward', 'data', 'compare', 'map', 'road', 'hospital', 'housing', 'correction', 'method']
      .flatMap((q) => searchTopics(q, 50));
    expect(all.length).toBeGreaterThan(15);
    for (const hit of all) {
      const target = hit.to.split(/[?#]/)[0];
      expect(routes.some((r) => r.test(target)), `${hit.title} -> ${hit.to}`).toBe(true);
    }
  });
});

describe('landscapeFor', () => {
  it('draws a skyline for metro districts, hills and coasts by state, fields elsewhere', () => {
    expect(landscapeFor('Delhi', 'New Delhi')).toBe('city');
    expect(landscapeFor('Maharashtra', 'Mumbai Suburban')).toBe('city');
    expect(landscapeFor('Uttarakhand', 'Dehradun')).toBe('hills');
    expect(landscapeFor('Kerala', 'Alappuzha')).toBe('coast');
    expect(landscapeFor('Uttar Pradesh', 'Mainpuri')).toBe('plains');
  });
});
