import { describe, it, expect } from 'vitest';
import {
  SIH_MINISTRY_STATEMENTS,
  SIH_RUBRIC_CRITERIA,
  SIH_PITCH_SLIDES,
  SIH_JURY_QA,
} from '../../data/sihPortalData';

describe('SIH 2026 Evaluator & Jury Portal Data Suite', () => {
  describe('Ministry Problem Statements', () => {
    it('contains all 4 required central ministries', () => {
      expect(SIH_MINISTRY_STATEMENTS).toHaveLength(4);
      const codes = SIH_MINISTRY_STATEMENTS.map((s) => s.code);
      expect(codes).toContain('SIH26202');
      expect(codes).toContain('SIH26202');
      expect(codes).toContain('SIH26202');
      expect(codes).toContain('SIH26202');
    });

    it('each statement enforces 4-beat comparative architecture', () => {
      SIH_MINISTRY_STATEMENTS.forEach((s) => {
        // Beat 1: Official Claim
        expect(s.officialClaim.portal).toBeTruthy();
        expect(s.officialClaim.metric).toBeTruthy();
        expect(s.officialClaim.value).toBeTruthy();

        // Beat 2: Ground Reality
        expect(s.groundReality.method).toBeTruthy();
        expect(s.groundReality.finding).toBeTruthy();
        expect(s.groundReality.confidence).toBeTruthy();

        // Beat 3: Algorithmic Delta
        expect(s.algorithmicDelta.metric).toBeTruthy();
        expect(s.algorithmicDelta.discrepancy).toBeTruthy();

        // Beat 4: Statutory Resolution
        expect(s.statutoryResolution.statute).toBeTruthy();
        expect(s.statutoryResolution.slaDays).toBeGreaterThan(0);
        expect(s.statutoryResolution.action).toBeTruthy();
      });
    });

    it('contains valid 6-digit Indian PIN codes and non-empty routes', () => {
      SIH_MINISTRY_STATEMENTS.forEach((s) => {
        expect(s.demoPin).toMatch(/^[1-9][0-9]{5}$/);
        expect(s.demoRoute.startsWith('/')).toBe(true);
        expect(s.officialDataSources.length).toBeGreaterThan(0);
        expect(s.featuresDemonstrated.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Official SIH Judging Rubric', () => {
    it('contains 5 criteria summing to exactly 100%', () => {
      expect(SIH_RUBRIC_CRITERIA).toHaveLength(5);
      const totalWeight = SIH_RUBRIC_CRITERIA.reduce((sum, c) => sum + c.weight, 0);
      expect(totalWeight).toBe(100);
    });

    it('each criterion has comprehensive proof points and positive default score', () => {
      SIH_RUBRIC_CRITERIA.forEach((c) => {
        expect(c.proofPoints.length).toBeGreaterThanOrEqual(3);
        expect(c.defaultScore).toBeGreaterThan(0);
        expect(c.defaultScore).toBeLessThanOrEqual(c.weight);
      });
    });
  });

  describe('8-Slide Pitch Deck', () => {
    it('contains 8 consecutive slides', () => {
      expect(SIH_PITCH_SLIDES).toHaveLength(8);
      SIH_PITCH_SLIDES.forEach((slide, index) => {
        expect(slide.id).toBe(index + 1);
        expect(slide.title).toBeTruthy();
        expect(slide.subtitle).toBeTruthy();
        expect(slide.bullets.length).toBeGreaterThanOrEqual(3);
        expect(slide.takeaway).toBeTruthy();
      });
    });

    it('slide 1 highlights the anchor problem statement', () => {
      const slide1 = SIH_PITCH_SLIDES[0];
      expect(slide1.bullets.some((b) => b.includes('SIH26202'))).toBe(true);
    });
  });

  describe('Jury Q&A Defense', () => {
    it('contains answers for the 4 toughest jury questions', () => {
      expect(SIH_JURY_QA.length).toBeGreaterThanOrEqual(4);
      SIH_JURY_QA.forEach((qa) => {
        expect(qa.question).toBeTruthy();
        expect(qa.questionHindi).toBeTruthy();
        expect(qa.answer.length).toBeGreaterThan(50);
        expect(qa.keyPoints.length).toBeGreaterThanOrEqual(3);
      });
    });
  });
});
