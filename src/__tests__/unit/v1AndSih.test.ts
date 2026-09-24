import { describe, it, expect } from 'vitest';
import { queryHelpBot } from '../../core/services/helpbotService';
import { SIH_SHOWCASE_STATEMENTS } from '../../data/sihShowcase';
import { getCoordinateForPin } from '../../core/utils/pinCoordinates';

describe('JantaX V1 & SIH Showcase Integrity Tests', () => {
  describe('HelpBot Grounded Assistance Engine', () => {
    it('returns grounded response for representative queries with actions and sources', () => {
      const res = queryHelpBot('Who is the MP for 110001?', { activePin: '110001' });
      expect(res.sender).toBe('bot');
      expect(res.text).toContain('MP');
      expect(res.suggestedActions?.length).toBeGreaterThan(0);
      expect(res.sources?.length).toBeGreaterThan(0);
      expect(res.sources?.[0].name).toContain('Lok Sabha Secretariat');
    });

    it('returns grounded response for school queries with UDISE+ citation', () => {
      const res = queryHelpBot('Tell me about schools in 250001', { activePin: '250001' });
      expect(res.text).toContain('UDISE+');
      expect(res.suggestedActions?.some(a => a.url.includes('/schools'))).toBe(true);
    });

    it('returns grounded response for road and works queries with PMGSY citation', () => {
      const res = queryHelpBot('What public works are running in 221001?', { activePin: '221001' });
      expect(res.text).toContain('public works');
      expect(res.suggestedActions?.some(a => a.url.includes('/works'))).toBe(true);
      expect(res.sources?.some(s => s.name.includes('PMGSY'))).toBe(true);
    });
  });

  describe('SIH Ministry Problem Statement Presets', () => {
    it('covers all four target central ministries', () => {
      const ministries = SIH_SHOWCASE_STATEMENTS.map(s => s.id);
      expect(ministries).toContain('sih-moe-schools');
      expect(ministries).toContain('sih-mord-pmgsy');
      expect(ministries).toContain('sih-darpg-cpgrams');
      expect(ministries).toContain('sih-mohua-urban');
    });

    it('each ministry preset contains valid demo pin, route, and official sources', () => {
      SIH_SHOWCASE_STATEMENTS.forEach(ps => {
        expect(ps.demoPin).toMatch(/^\d{6}$/);
        expect(ps.demoRoute).toMatch(/^\//);
        expect(ps.officialDataSources.length).toBeGreaterThan(0);
        expect(ps.featuresDemonstrated.length).toBeGreaterThan(0);
      });
    });
  });

  describe('GIS Pan-India Pinpoint Fallback', () => {
    it('always returns a valid lat/lng tuple for any 6-digit Indian PIN', () => {
      const pins = ['110001', '250001', '221001', '560001', '682001', '799001', '999999'];
      pins.forEach(pin => {
        const coord = getCoordinateForPin(pin);
        expect(coord).toBeDefined();
        expect(coord.lat).toBeGreaterThan(5);
        expect(coord.lat).toBeLessThan(40);
        expect(coord.lng).toBeGreaterThan(65);
        expect(coord.lng).toBeLessThan(100);
      });
    });
  });
});
