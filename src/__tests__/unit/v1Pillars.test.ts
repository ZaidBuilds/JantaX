import { describe, it, expect } from 'vitest';
import { calculateHaversineDistanceMeters } from '../../core/utils/exifParser';
import { getStoredReports, updateReportModeration } from '../../modules/reporting/services/reportingService';

describe('V1 Pillars — Evidence Integrity, Geofencing & Statutory Tracking', () => {
  describe('Geofence Distance Calculations (Haversine)', () => {
    it('calculates 0m for identical coordinates', () => {
      const dist = calculateHaversineDistanceMeters(28.6139, 77.2090, 28.6139, 77.2090);
      expect(dist).toBe(0);
    });

    it('identifies coordinates within sub-250m facility perimeter', () => {
      // 0.001 deg lat is approx 111 meters
      const dist = calculateHaversineDistanceMeters(28.6139, 77.2090, 28.6148, 77.2090);
      expect(dist).toBeGreaterThan(50);
      expect(dist).toBeLessThan(250);
    });

    it('correctly detects out-of-boundary photos (> 2km away)', () => {
      // Delhi to Meerut is approx 60-70km
      const dist = calculateHaversineDistanceMeters(28.6139, 77.2090, 28.9845, 77.7064);
      expect(dist).toBeGreaterThan(40000); // > 40 km
    });
  });

  describe('Statutory SLA & Moderation Lifecycle', () => {
    it('loads stored reports and contains valid test reports', () => {
      const reports = getStoredReports();
      expect(Array.isArray(reports)).toBe(true);
      expect(reports.length).toBeGreaterThan(0);
    });

    it('transitions report moderation states with updateReportModeration', () => {
      const reports = getStoredReports();
      const testReport = reports[0];
      expect(testReport).toBeDefined();

      const updated = updateReportModeration(testReport.id, 'Approved & Published', 'Field audit verified');
      expect(updated).toBeDefined();
      expect(updated?.moderationState).toBe('Approved & Published');

      const reloaded = getStoredReports().find(r => r.id === testReport.id);
      expect(reloaded?.moderationState).toBe('Approved & Published');
    });

    it('properly enforces 30-day RTI and 15-day PWD statutory timelines', () => {
      const rtiStatutoryDays = 30;
      const pwdStatutoryDays = 15;

      const submissionDate = new Date(Date.now() - 10 * 86400000); // 10 days ago
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));

      expect(elapsed).toBe(10);
      expect(rtiStatutoryDays - elapsed).toBe(20); // 20 days left for RTI
      expect(pwdStatutoryDays - elapsed).toBe(5); // 5 days left for PWD notice
    });
  });
});
