import type { ReraProject, BuilderProfile } from '../types/reraIntelligence';

export const MOCK_RERA_PROJECTS: ReraProject[] = [
  {
    id: 'rera-up-01',
    reraRegistrationNumber: 'UPRERAPRJ-SAMPLE-01',
    statePortal: 'UP RERA (Uttar Pradesh)',
    projectName: 'Sample Greens 2 (Tower C & D)',
    projectNameHindi: 'सैंपल ग्रीन्स 2 (टावर सी एवं डी)',
    builderId: 'bldr-sample-a',
    builderName: 'Sample Builder A Ltd',
    locationName: 'Greater Noida West (Noida Extension)',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    pinCode: '201306',
    projectType: 'Residential Apartments',
    totalUnits: 850,
    soldUnits: 820,
    promisedCompletionDate: '2019-12-31',
    revisedCompletionDate: '2024-12-31',
    extensionsGranted: 4,
    documentedDelayMonths: 60,
    status: 'Delayed',
    statusProvenances: {
      officialStatus: 'Official RERA Record',
      delayCalculation: 'JantaX-Derived Calculation'
    },
    orders: [
      {
        id: 'ord-up-01',
        orderNumber: 'UP-RERA/NCR/2022/ORDER-882',
        adjudicationDate: '2022-09-15',
        benchName: 'UP RERA Bench Noida (Bench 1)',
        complainantType: 'Homebuyer Association',
        summaryNeutral: 'UP RERA Tribunal directed the promoter to deposit monthly penalty per square foot for delay beyond sanctioned extension date.',
        complianceStatus: 'Under Execution',
        sourcePdfUrl: 'https://up-rera.in/orders/UPRERAPRJ-SAMPLE-01-Order.pdf',
        sourceTitle: 'UP RERA Official Order Gazette #882',
        provenance: 'Official RERA Record'
      }
    ],
    originalSource: {
      name: 'UP Real Estate Regulatory Authority (UP RERA) Official Portal',
      url: 'https://up-rera.in',
      lastUpdated: '2026-08-22 14:00 IST'
    }
  },
  {
    id: 'rera-maha-02',
    reraRegistrationNumber: 'P517-SAMPLE-02',
    statePortal: 'MahaRERA (Maharashtra)',
    projectName: 'Sample Lakeshore Homes Phase 3',
    projectNameHindi: 'सैंपल लेकशोर होम्स',
    builderId: 'bldr-sample-b',
    builderName: 'Sample Builder B Ltd',
    locationName: 'Dombivli East, Thane District',
    district: 'Thane',
    state: 'Maharashtra',
    pinCode: '421204',
    projectType: 'Integrated Township',
    totalUnits: 1200,
    soldUnits: 1150,
    promisedCompletionDate: '2022-06-30',
    revisedCompletionDate: '2023-12-31',
    extensionsGranted: 2,
    documentedDelayMonths: 18,
    status: 'Possession Handed Over',
    statusProvenances: {
      officialStatus: 'Official RERA Record',
      delayCalculation: 'JantaX-Derived Calculation'
    },
    orders: [],
    originalSource: {
      name: 'MahaRERA Official Public Portal',
      url: 'https://maharera.mahaonline.gov.in',
      lastUpdated: '2026-08-23 11:30 IST'
    }
  },
  {
    id: 'rera-kr-03',
    reraRegistrationNumber: 'PRM/KA/RERA/SAMPLE/03',
    statePortal: 'Karnataka RERA (K-RERA)',
    projectName: 'Sample Cornerstone Residences (Serene Block)',
    projectNameHindi: 'सैंपल कॉर्नरस्टोन रेजिडेंसेज़',
    builderId: 'bldr-sample-c',
    builderName: 'Sample Builder C Ltd',
    locationName: 'Varthur Road, Whitefield East',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pinCode: '560087',
    projectType: 'Residential Apartments',
    totalUnits: 680,
    soldUnits: 650,
    promisedCompletionDate: '2023-03-31',
    revisedCompletionDate: '2024-06-30',
    extensionsGranted: 1,
    documentedDelayMonths: 15,
    status: 'Possession Handed Over',
    statusProvenances: {
      officialStatus: 'Official RERA Record',
      delayCalculation: 'JantaX-Derived Calculation'
    },
    orders: [],
    originalSource: {
      name: 'Karnataka Real Estate Regulatory Authority (K-RERA)',
      url: 'https://rera.karnataka.gov.in',
      lastUpdated: '2026-08-20 16:00 IST'
    }
  }
];

export const MOCK_BUILDERS: BuilderProfile[] = [
  {
    id: 'bldr-sample-a',
    builderName: 'Sample Builder A Ltd',
    promoterRegistrationId: 'UP-PROMOTER-REG-009',
    incorporationYear: 1988,
    headquarters: 'Noida, Uttar Pradesh',
    directors: ['Chairman (sample)'],
    totalRegisteredProjects: 38,
    completedProjectsCount: 22,
    delayedProjectsCount: 16,
    totalUnitsDelivered: 18500,
    totalOrdersCount: 14,
    trackRecordScore: 58,
    projects: [MOCK_RERA_PROJECTS[0]],
    officialSource: {
      name: 'UP RERA Promoter Public Register',
      url: 'https://up-rera.in/promoter-details/UP-PROMOTER-REG-009',
      lastUpdated: '2026-08-22 14:00 IST'
    }
  },
  {
    id: 'bldr-sample-b',
    builderName: 'Sample Builder B Ltd',
    promoterRegistrationId: 'MAHA-PROMOTER-REG-044',
    incorporationYear: 1995,
    headquarters: 'Mumbai, Maharashtra',
    directors: ['Managing director (sample)'],
    totalRegisteredProjects: 85,
    completedProjectsCount: 78,
    delayedProjectsCount: 7,
    totalUnitsDelivered: 55000,
    totalOrdersCount: 2,
    trackRecordScore: 89,
    projects: [MOCK_RERA_PROJECTS[1]],
    officialSource: {
      name: 'MahaRERA Promoter Directory',
      url: 'https://maharera.mahaonline.gov.in',
      lastUpdated: '2026-08-23 11:30 IST'
    }
  },
  {
    id: 'bldr-sample-c',
    builderName: 'Sample Builder C Ltd',
    promoterRegistrationId: 'KR-PROMOTER-REG-012',
    incorporationYear: 1986,
    headquarters: 'Bengaluru, Karnataka',
    directors: ['Chairman and managing director (sample)'],
    totalRegisteredProjects: 62,
    completedProjectsCount: 57,
    delayedProjectsCount: 5,
    totalUnitsDelivered: 32000,
    totalOrdersCount: 1,
    trackRecordScore: 91,
    projects: [MOCK_RERA_PROJECTS[2]],
    officialSource: {
      name: 'Karnataka RERA Promoter Public Register',
      url: 'https://rera.karnataka.gov.in',
      lastUpdated: '2026-08-20 16:00 IST'
    }
  }
];
