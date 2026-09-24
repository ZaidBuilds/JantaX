import type { ContractorProfile } from '../types/contractorIntelligence';

/**
 * DEMONSTRATION FIXTURES — every company, director and identifier below is
 * FICTIONAL and must stay that way.
 *
 * This module attaches performance indicators such as `documentedPenaltiesCount`
 * and `activeDebarmentsCount` to each entry. Those are invented figures. Putting
 * them against a real firm or a real named executive would be publishing an
 * unevidenced adverse claim about an identifiable party — see Rule 22
 * (no labelling contractors without authoritative evidence) and Rule 9.5
 * (evidence before accusation) in docs/MODULE_EXPANSION_PROTOCOL.md.
 *
 * Identifiers use the reserved 'XX'/'000000' patterns so they cannot collide
 * with a real CIN or GSTIN. Do not replace them with real-looking values.
 */
export const MOCK_CONTRACTORS: ContractorProfile[] = [
  {
    id: 'cont-meridian-infra',
    companyName: 'Meridian Infra Constructions Pvt Ltd',
    registrationNumber: 'DEMO-PWD-CAT1-0001',
    category: 'Class 1 Heavy Infrastructure',
    incorporationYear: 1998,
    headquarters: 'Demo City, Sample State',
    directors: ['Director A (Managing Director)', 'Director B (Finance)'],
    gstin: '00XXXXX0000X0X0',
    cin: 'X00000XX0000XXX000000',
    performanceIndicators: {
      overallScore: 91,
      completionRatePct: 92,
      onTimeDeliveryRatePct: 78,
      averageExtensionMonths: 4.2,
      qualityAuditScore: 94,
      totalContractsCount: 42,
      totalAwardedValueCr: 24500.0,
      activeDebarmentsCount: 0,
      documentedPenaltiesCount: 1
    },
    projects: [
      {
        id: 'proj-delhi-elevated-01',
        projectName: 'Barapullah Phase 2 Elevated Corridor',
        sector: 'Roads & Highways',
        state: 'Delhi',
        district: 'New Delhi',
        awardedValueLakhs: 22800,
        revisedValueLakhs: 27500,
        startDate: '2022-03-15',
        originalTargetDate: '2024-06-30',
        actualOrAnticipatedCompletionDate: '2025-06-30',
        extensionsMonths: 12,
        status: 'Delayed',
        qualityRatingScore: 88,
        sourceUrl: 'https://pwd.delhigovt.nic.in'
      },
      {
        id: 'proj-mum-coastal-04',
        projectName: 'Mumbai Coastal Road Project (South Package)',
        sector: 'Roads & Highways',
        state: 'Maharashtra',
        district: 'Mumbai',
        awardedValueLakhs: 1210000,
        revisedValueLakhs: 1320000,
        startDate: '2018-10-15',
        originalTargetDate: '2022-10-31',
        actualOrAnticipatedCompletionDate: '2024-11-30',
        extensionsMonths: 25,
        status: 'Verified',
        qualityRatingScore: 96,
        sourceUrl: 'https://portal.mcgm.gov.in'
      }
    ],
    penalties: [
      {
        id: 'pen-demo-01',
        // Demo order reference. Never mint a real-looking order number against
        // a real authority — it reads as a verifiable citation and is not one.
        orderNumber: 'DEMO/PEN-0001',
        date: '2023-11-14',
        issuingAuthority: 'Highways Authority (demonstration record)',
        penaltyAmountLakhs: 15.0,
        reasonNeutral: 'Procedural penalty for delay in submission of lane closure safety signage audit report.',
        sourceUrl: '',
        sourceTitle: 'Example penalty register entry — not a real document'
      }
    ],
    debarmentRecords: [],
    officialSource: {
      name: 'Ministry of Corporate Affairs (MCA21) & Central Public Procurement Portal (CPPP)',
      url: 'https://eprocure.gov.in',
      lastUpdated: '2026-08-24 18:00 IST'
    }
  },
  {
    id: 'cont-deccan-metro',
    companyName: 'Deccan Metro Builders JV (Demo)',
    registrationNumber: 'DEMO-METRO-JV-0002',
    category: 'Urban Transit & Metro',
    incorporationYear: 1990,
    headquarters: 'Hyderabad & Mumbai',
    directors: ['Director C (Chairman)', 'Director D (Operations)'],
    gstin: '00XXXXX0000X0X1',
    cin: 'X00000XX0000XXX000001',
    performanceIndicators: {
      overallScore: 84,
      completionRatePct: 86,
      onTimeDeliveryRatePct: 70,
      averageExtensionMonths: 6.5,
      qualityAuditScore: 89,
      totalContractsCount: 35,
      totalAwardedValueCr: 15400.0,
      activeDebarmentsCount: 0,
      documentedPenaltiesCount: 1
    },
    projects: [
      {
        id: 'proj-blr-metro-03',
        projectName: 'Bengaluru Metro Phase 2A Outer Ring Road Package',
        sector: 'Urban Transit',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        awardedValueLakhs: 139500,
        revisedValueLakhs: 154000,
        startDate: '2021-06-01',
        originalTargetDate: '2024-12-31',
        actualOrAnticipatedCompletionDate: '2026-06-30',
        extensionsMonths: 18,
        status: 'Extended',
        qualityRatingScore: 85,
        sourceUrl: 'https://bmrcl.co.in'
      }
    ],
    penalties: [
      {
        id: 'pen-demo-02',
        orderNumber: 'DEMO/PEN-0002',
        date: '2023-04-10',
        issuingAuthority: 'Metro Rail Corporation (demonstration record)',
        penaltyAmountLakhs: 10.0,
        reasonNeutral: 'Penalty levied for delayed traffic safety barricading setup during night works.',
        sourceUrl: '',
        sourceTitle: 'Example penalty register entry — not a real document'
      }
    ],
    debarmentRecords: [],
    officialSource: {
      name: 'BMRCL & MoHUA Procurement Portal',
      url: 'https://bmrcl.co.in',
      lastUpdated: '2026-08-22 12:00 IST'
    }
  },
  {
    id: 'cont-sample-roads',
    companyName: 'M/s Sample Road Builders (Demo)',
    registrationNumber: 'DEMO-PWD-REG-0003',
    category: 'Rural Roads & PMGSY',
    incorporationYear: 2008,
    headquarters: 'Meerut, Uttar Pradesh',
    directors: ['Director E (Proprietor)', 'Director F (Partner)'],
    gstin: '00XXXXX0000X0X2',
    performanceIndicators: {
      overallScore: 88,
      completionRatePct: 94,
      onTimeDeliveryRatePct: 89,
      averageExtensionMonths: 1.5,
      qualityAuditScore: 92,
      totalContractsCount: 18,
      totalAwardedValueCr: 450.0,
      activeDebarmentsCount: 0,
      documentedPenaltiesCount: 0
    },
    projects: [
      {
        id: 'proj-meerut-pmgsy-02',
        projectName: 'PMGSY Mawana to Niloha Highway Link',
        sector: 'Roads & Highways',
        state: 'Uttar Pradesh',
        district: 'Meerut',
        awardedValueLakhs: 1390,
        revisedValueLakhs: 1390,
        startDate: '2023-01-10',
        originalTargetDate: '2023-11-30',
        actualOrAnticipatedCompletionDate: '2023-11-30',
        extensionsMonths: 0,
        status: 'Completed',
        qualityRatingScore: 95,
        sourceUrl: 'https://omms.nic.in'
      }
    ],
    penalties: [],
    debarmentRecords: [],
    officialSource: {
      name: 'PMGSY OMMS Portal & UPPWD Registration Register',
      url: 'https://omms.nic.in',
      lastUpdated: '2026-08-20 15:30 IST'
    }
  },
  {
    id: 'cont-clearflow',
    companyName: 'Clearflow Water Systems Ltd (Demo)',
    registrationNumber: 'DEMO-WATER-NMCG-0004',
    category: 'Water & Sewage Specialist',
    incorporationYear: 1996,
    headquarters: 'Chennai, Tamil Nadu',
    directors: ['Director G (Managing Director)', 'Director H (Technical)'],
    gstin: '00XXXXX0000X0X3',
    cin: 'X00000XX0000XXX000002',
    performanceIndicators: {
      overallScore: 86,
      completionRatePct: 88,
      onTimeDeliveryRatePct: 75,
      averageExtensionMonths: 5.0,
      qualityAuditScore: 90,
      totalContractsCount: 28,
      totalAwardedValueCr: 8900.0,
      activeDebarmentsCount: 0,
      documentedPenaltiesCount: 0
    },
    projects: [
      {
        id: 'proj-varanasi-sewage-05',
        projectName: 'Varanasi Ramna STP & Interception Network',
        sector: 'Water & Sewage',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        awardedValueLakhs: 14800,
        revisedValueLakhs: 16900,
        startDate: '2021-04-01',
        originalTargetDate: '2023-09-30',
        actualOrAnticipatedCompletionDate: '2025-03-31',
        extensionsMonths: 18,
        status: 'Incomplete',
        qualityRatingScore: 87,
        sourceUrl: 'https://nmcg.nic.in'
      }
    ],
    penalties: [],
    debarmentRecords: [],
    officialSource: {
      name: 'National Mission for Clean Ganga (NMCG) & CPPP',
      url: 'https://nmcg.nic.in',
      lastUpdated: '2026-08-21 17:00 IST'
    }
  }
];
