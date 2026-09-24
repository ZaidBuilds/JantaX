import { describe, it, expect } from 'vitest';
import { PRISMA_MODULES } from '../../../server/src/routes/moduleMap';
import {
  generateSection6RtiApplication,
  generateLokayuktaComplaintBrief,
  generateLocalityHealthSummaryText,
} from '../../modules/accountability/services/dossierService';
import { normaliseAqiRecords } from '../../../server/src/connectors/cpcbAqi';

describe('Phase 3 Canonical Convergence & Citizen Dossier Suite', () => {
  it('activates all 15 canonical modules in PRISMA_MODULES', () => {
    expect(PRISMA_MODULES.length).toBe(15);
    const expectedModules = [
      'school',
      'infra',
      'rera',
      'hospital',
      'pds',
      'grievance',
      'contractor',
      'andhbhakt',
      'nagar',
      'budget',
      'pollution',
      'land',
      'utility',
      'election',
      'booth',
    ];
    for (const mod of expectedModules) {
      expect(PRISMA_MODULES).toContain(mod);
    }
  });

  it('generates a legally airtight Section 6(1) RTI application citing IRC SP:98 and Measurement Book', () => {
    const rtiDraft = generateSection6RtiApplication({
      publicAuthority: 'Executive Engineer, PWD Division II',
      department: 'Public Works Department',
      workTitle: 'Meerut Arterial Highway Resurfacing',
      workOrderNo: 'PWD-MTC-2023-89',
      sanctionedBudgetLakhs: 450,
      contractorName: 'Apex Road Builders Ltd',
      dlpEndDate: '31 March 2026',
      localityPin: '250001',
      specificIssue: 'Top layer bitumen cavity within 6 months of completion.',
    });

    expect(rtiDraft).toContain('Section 6(1) of the Right to Information Act, 2005');
    expect(rtiDraft).toContain('CERTIFIED MEASUREMENT BOOK (MB) EXTRACTS');
    expect(rtiDraft).toContain('QUALITY CONTROL & CORE-CUT LABORATORY TESTS');
    expect(rtiDraft).toContain('DEFECT LIABILITY PERIOD (DLP) & RETENTION GUARANTEE (IRC SP:98)');
    expect(rtiDraft).toContain('Apex Road Builders Ltd');
    expect(rtiDraft).toContain('250001');
  });

  it('generates a formal Lokayukta / Vigilance petition with substantive allegations and prayer', () => {
    const lokayuktaDraft = generateLokayuktaComplaintBrief({
      complaintTitle: 'Flyover Extension Structural Concrete Failure',
      authorityOrOfficer: 'Chief Engineer & Assistant Engineer',
      department: 'Urban Development SPV',
      workOrderNo: 'FLY-2023-004',
      estimatedFinancialLossCr: 12.5,
      contractorName: 'Balaji Infrastructure Ltd',
      localityPin: '110001',
      allegationSummary: 'Premature spalling of bridge expansion joints and missing cube strength tests.',
    });

    expect(lokayuktaDraft).toContain('MEMORANDUM OF COMPLAINT BEFORE THE HON\'BLE LOKAYUKTA');
    expect(lokayuktaDraft).toContain('SECTION 9 OF THE LOKAYUKTA ACT');
    expect(lokayuktaDraft).toContain('₹ 12.5 Crores');
    expect(lokayuktaDraft).toContain('Balaji Infrastructure Ltd');
    expect(lokayuktaDraft).toContain('Order an unannounced technical core-drilling inspection');
  });

  it('generates a formatted Locality Civic Health Dossier text export', () => {
    const dossierText = generateLocalityHealthSummaryText({
      pinCode: '250001',
      localityName: 'Meerut Sadar',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      civicHealthScore: 72,
      metrics: {
        schoolsCompliancePct: 82,
        activeDlpWarranties: 16,
        pdsDeliveryPct: 94,
        hospitalBedsOccupiedPct: 80,
        airQualityIndex: 185,
        grievanceDisposalRatePct: 68,
      },
      highlightedDefects: [
        {
          title: 'Substation Transformer Overload',
          department: 'DISCOM',
          delayDays: 45,
          severity: 'HIGH',
        },
      ],
    });

    expect(dossierText).toContain('JANTAX OFFICIAL CIVIC HEALTH AUDIT DOSSIER');
    expect(dossierText).toContain('COMPOSITE CIVIC HEALTH SCORE: 72 / 100');
    expect(dossierText).toContain('82% UDISE+ Standard');
    expect(dossierText).toContain('Indian Roads Congress (IRC SP:98)');
    expect(dossierText).toContain('Substation Transformer Overload');
  });

  it('normalizes CPCB real-time AQI records with dual spelling tolerance', () => {
    const rawRecords = [
      {
        station: 'Anand Vihar, Delhi - DPCC',
        city: 'Delhi',
        state: 'Delhi',
        pollutant_id: 'PM2.5',
        pollutant_avg: '312',
        pollutant_min: '180',
        pollutant_max: '445',
        last_update: '2026-09-24 18:00:00',
        latitude: '28.6469',
        longitude: '77.3160',
      },
      {
        station: 'Civil Lines, Meerut - UPPCB',
        city: 'Meerut',
        state: 'Uttar Pradesh',
        pollutantId: 'PM10',
        avg_value: '198',
        min_value: '110',
        max_value: '260',
        lastupdate: '2026-09-24 18:00:00',
        lat: '28.9845',
        lng: '77.7064',
      },
    ];

    const normalized = normaliseAqiRecords(rawRecords);
    expect(normalized.length).toBe(2);
    expect(normalized[0].station).toBe('Anand Vihar, Delhi - DPCC');
    expect(normalized[0].avgValue).toBe(312);
    expect(normalized[0].pollutantId).toBe('PM2.5');
    expect(normalized[1].station).toBe('Civil Lines, Meerut - UPPCB');
    expect(normalized[1].avgValue).toBe(198);
    expect(normalized[1].pollutantId).toBe('PM10');
  });
});
