import { describe, it, expect } from 'vitest';
import { 
  calculateHaversineDistance, 
  validateEvidenceGeofence, 
  generateEvidenceSha256 
} from '../../modules/reporting/services/evidenceVerificationService';
import { 
  calculateCompositeCivicScore, 
  CivicScoringInputs 
} from '../../modules/transparency/services/transparencyService';
import { 
  submitOfficialRebuttal, 
  getOfficialTracking 
} from '../../modules/reporting/services/reportingService';
import { getCoordinateForPin } from '../../core/utils/pinCoordinates';

describe('Phase 4: Pan-India Evidence Verification & Mathematical Scoring Suite', () => {

  describe('1. Haversine Great-Circle Geofencing Engine', () => {
    it('calculates 0 km for identical geographic coordinates', () => {
      const distance = calculateHaversineDistance(28.9845, 77.7064, 28.9845, 77.7064);
      expect(distance).toBe(0);
    });

    it('calculates accurate distance between Meerut (250001) and Delhi (110001) (~60 km)', () => {
      const meerut = getCoordinateForPin('250001');
      const delhi = getCoordinateForPin('110001');
      const distanceKm = calculateHaversineDistance(meerut.lat, meerut.lng, delhi.lat, delhi.lng);
      
      expect(distanceKm).toBeGreaterThan(50);
      expect(distanceKm).toBeLessThan(75);
    });

    it('validates evidence as verified when photo is within 15 km of PIN centroid', () => {
      const meerut = getCoordinateForPin('250001');
      // 0.01 degree offset is ~1.1 km
      const result = validateEvidenceGeofence(
        meerut.lat + 0.01,
        meerut.lng + 0.01,
        '250001'
      );

      expect(result.isVerified).toBe(true);
      expect(result.distanceKm).toBeLessThan(15);
      expect(result.maxAllowedKm).toBe(15);
      expect(result.pinCentroid.district).toBe(meerut.district);
    });

    it('flags unverified when photo coordinates exceed the 15 km boundary', () => {
      const meerut = getCoordinateForPin('250001');
      // Offset by 0.3 degrees (~33 km)
      const result = validateEvidenceGeofence(
        meerut.lat + 0.3,
        meerut.lng + 0.3,
        '250001'
      );

      expect(result.isVerified).toBe(false);
      expect(result.distanceKm).toBeGreaterThan(15);
    });
  });

  describe('2. Cryptographic SHA-256 Fingerprinting Engine', () => {
    it('generates a 64-character lowercase hex digest', async () => {
      const blob = new Blob(['Test evidence JPEG byte stream simulation'], { type: 'image/jpeg' });
      const hash = await generateEvidenceSha256(blob);

      expect(hash).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });

    it('produces deterministic output for identical file inputs', async () => {
      const content = 'JantaX Pothole Evidence - PWD Division 2 Meerut Cantt';
      const blob1 = new Blob([content], { type: 'image/jpeg' });
      const blob2 = new Blob([content], { type: 'image/jpeg' });

      const hash1 = await generateEvidenceSha256(blob1);
      const hash2 = await generateEvidenceSha256(blob2);

      expect(hash1).toBe(hash2);
    });

    it('produces different cryptographic hashes for differing file inputs', async () => {
      const blob1 = new Blob(['Photo A - Meerut Bypass road distress'], { type: 'image/jpeg' });
      const blob2 = new Blob(['Photo B - Delhi Ring road patch work'], { type: 'image/jpeg' });

      const hash1 = await generateEvidenceSha256(blob1);
      const hash2 = await generateEvidenceSha256(blob2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('3. Deterministic 6-Pillar Mathematical Civic Scoring', () => {
    it('scores 100 (Grade A+) for perfect civic compliance and clean air', () => {
      const inputs: CivicScoringInputs = {
        schoolsRteCompliance: 100,
        roadDlpWarranty: 100,
        healthcareIphsReadiness: 100,
        rationNfsaFulfillment: 100,
        airQualityIndex: 25, // AQI <= 50 -> 100 normalized
        grievanceRedressalRate: 100
      };

      const result = calculateCompositeCivicScore(inputs);
      expect(result.compositeScore).toBe(100);
      expect(result.grade).toBe('A+');
      expect(result.pillarBreakdown.schools.points).toBe(25);
      expect(result.pillarBreakdown.roads.points).toBe(25);
      expect(result.pillarBreakdown.health.points).toBe(15);
      expect(result.pillarBreakdown.ration.points).toBe(15);
      expect(result.pillarBreakdown.airQuality.points).toBe(10);
      expect(result.pillarBreakdown.grievances.points).toBe(10);
    });

    it('correctly calculates weighted point breakdown and assigns Grade B', () => {
      const inputs: CivicScoringInputs = {
        schoolsRteCompliance: 80, // 0.25 * 80 = 20.0 pts
        roadDlpWarranty: 70,      // 0.25 * 70 = 17.5 pts
        healthcareIphsReadiness: 60, // 0.15 * 60 = 9.0 pts
        rationNfsaFulfillment: 80, // 0.15 * 80 = 12.0 pts
        airQualityIndex: 225,     // 100 - ((225-50)/350)*100 = 50 -> 0.10 * 50 = 5.0 pts
        grievanceRedressalRate: 60 // 0.10 * 60 = 6.0 pts
      };

      const result = calculateCompositeCivicScore(inputs);
      // 20.0 + 17.5 + 9.0 + 12.0 + 5.0 + 6.0 = 69.5
      expect(result.compositeScore).toBe(69.5);
      expect(result.grade).toBe('B');
    });

    it('assigns Critical Deficit when severe collapse across civic services occurs', () => {
      const inputs: CivicScoringInputs = {
        schoolsRteCompliance: 20,
        roadDlpWarranty: 10,
        healthcareIphsReadiness: 15,
        rationNfsaFulfillment: 30,
        airQualityIndex: 450, // Severely polluted -> 0 pts
        grievanceRedressalRate: 10
      };

      const result = calculateCompositeCivicScore(inputs);
      expect(result.compositeScore).toBeLessThan(30);
      expect(result.grade).toBe('Critical Deficit');
    });
  });

  describe('4. Official Right-to-Reply & Rebuttal Ingestion', () => {
    it('appends an official rebuttal statement and updates tracking status', () => {
      const testReportId = 'rep-test-phase4-rebuttal';
      const updated = submitOfficialRebuttal(testReportId, {
        officerName: 'Er. Rajesh Kumar',
        officerDesignation: 'Executive Engineer (PWD)',
        department: 'UP Public Works Department',
        responseText: 'Site inspected on 24 Sep. Contractor M/s Rajdeep Infrastructure issued show-cause notice under DLP Clause 4.2. Remediation underway.',
        statusChangeTo: 'Disposed / Resolved',
        sourcePdfUrl: 'https://jantax.gov.in/docs/dlp_inspection_cert.pdf'
      });

      expect(updated.reportId).toBe(testReportId);
      expect(updated.status).toBe('Disposed / Resolved');
      expect(updated.responses.length).toBeGreaterThanOrEqual(1);
      
      const latest = updated.responses[0];
      expect(latest.officerName).toBe('Er. Rajesh Kumar');
      expect(latest.officerDesignation).toBe('Executive Engineer (PWD)');
      expect(latest.sourcePdfUrl).toBe('https://jantax.gov.in/docs/dlp_inspection_cert.pdf');
    });
  });

  describe('5. Pan-India Regional Geocoding Coverage', () => {
    it('resolves valid coordinates across North, South, East, West and North-East hubs', () => {
      const hubs = ['250001', '110001', '560001', '400001', '800001', '781001'];
      for (const pin of hubs) {
        const coord = getCoordinateForPin(pin);
        expect(coord.lat).toBeGreaterThan(8);
        expect(coord.lat).toBeLessThan(38);
        expect(coord.lng).toBeGreaterThan(68);
        expect(coord.lng).toBeLessThan(98);
        expect(coord.district.length).toBeGreaterThan(0);
        expect(coord.state.length).toBeGreaterThan(0);
      }
    });
  });

});
