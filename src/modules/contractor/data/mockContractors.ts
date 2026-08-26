import type { ContractorProfile } from '../types/contractorIntelligence';

export const MOCK_CONTRACTORS: ContractorProfile[] = [
  {
    id: 'cont-lt-infra',
    companyName: 'Larsen & Toubro Construction Limited',
    registrationNumber: 'DL-PWD-CAT1-2018-092',
    category: 'Class 1 Heavy Infrastructure',
    incorporationYear: 1946,
    headquarters: 'Mumbai, Maharashtra',
    directors: ['Shri S.N. Subrahmanyan (CMD)', 'Shri R. Shankar Raman'],
    gstin: '27AAACL0123P1Z2',
    cin: 'L99999MH1946PLC004768',
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
        id: 'pen-lt-01',
        orderNumber: 'NHAI/RO-DEL/2023/PEN-44',
        date: '2023-11-14',
        issuingAuthority: 'National Highways Authority of India (NHAI) Regional Office Delhi',
        penaltyAmountLakhs: 15.0,
        reasonNeutral: 'Procedural penalty for delay in submission of lane closure safety signage audit report.',
        sourceUrl: 'https://nhai.gov.in/orders/penalties-2023-Q4.pdf',
        sourceTitle: 'NHAI Official Quarterly Penalty Register Q4 2023'
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
    id: 'cont-ncc-afcons',
    companyName: 'NCC Ltd - Afcons Infrastructure JV',
    registrationNumber: 'KA-BMRCL-JV-2020-009',
    category: 'Urban Transit & Metro',
    incorporationYear: 1990,
    headquarters: 'Hyderabad & Mumbai',
    directors: ['Shri A.A.V. Ranga Raju', 'Shri K. Subramanian'],
    gstin: '36AAACN1029F1Z1',
    cin: 'L74210TG1990PLC011146',
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
        id: 'pen-ncc-01',
        orderNumber: 'BMRCL/2023/PEN-88',
        date: '2023-04-10',
        issuingAuthority: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
        penaltyAmountLakhs: 10.0,
        reasonNeutral: 'Penalty levied under Clause 28.1 for delayed traffic safety barricading setup during ORR nocturnal work.',
        sourceUrl: 'https://bmrcl.co.in/orders/penalties-2023.pdf',
        sourceTitle: 'BMRCL Public Safety Audit & Penalty Release 2023'
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
    id: 'cont-chaudhary-builders',
    companyName: 'M/s Chaudhary Road Builders & Sons',
    registrationNumber: 'UP-PWD-REG-2019-441',
    category: 'Rural Roads & PMGSY',
    incorporationYear: 2008,
    headquarters: 'Meerut, Uttar Pradesh',
    directors: ['Shri Satish Chaudhary', 'Shri Pravin Chaudhary'],
    gstin: '09AABFC8890Q1Z8',
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
    id: 'cont-wabag',
    companyName: 'VA Tech Wabag Limited',
    registrationNumber: 'TN-WABAG-NMCG-2019-108',
    category: 'Water & Sewage Specialist',
    incorporationYear: 1996,
    headquarters: 'Chennai, Tamil Nadu',
    directors: ['Shri Rajiv Mittal (MD)', 'Shri S. Varadarajan'],
    gstin: '33AAACV2098M1Z4',
    cin: 'L45205TN1996PLC035968',
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
