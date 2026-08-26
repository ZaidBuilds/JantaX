import type { ReraProject, BuilderProfile } from '../types/reraIntelligence';

export const MOCK_RERA_PROJECTS: ReraProject[] = [
  {
    id: 'rera-up-01',
    reraRegistrationNumber: 'UPRERAPRJ4421',
    statePortal: 'UP RERA (Uttar Pradesh)',
    projectName: 'Eco Village 2 (Tower C & D)',
    projectNameHindi: 'इको विलेज 2 (टावर सी एवं डी)',
    builderId: 'bldr-supertech',
    builderName: 'Supertech Limited',
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
        sourcePdfUrl: 'https://up-rera.in/orders/UPRERAPRJ4421-Order.pdf',
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
    reraRegistrationNumber: 'P51700000102',
    statePortal: 'MahaRERA (Maharashtra)',
    projectName: 'Lodha Palava Lakeshore Greens Phase 3',
    projectNameHindi: 'लोढ़ा पालावा लेकशोर ग्रीन्स',
    builderId: 'bldr-lodha',
    builderName: 'Macrotech Developers (Lodha Group)',
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
    reraRegistrationNumber: 'PRM/KA/RERA/1251/310/PR/180516/001740',
    statePortal: 'Karnataka RERA (K-RERA)',
    projectName: 'Brigade Cornerstone Utopia (Serene Block)',
    projectNameHindi: 'ब्रिगेड कॉर्नरस्टोन यूटोपिया',
    builderId: 'bldr-brigade',
    builderName: 'Brigade Enterprises Limited',
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
    id: 'bldr-supertech',
    builderName: 'Supertech Limited',
    promoterRegistrationId: 'UP-PROMOTER-REG-009',
    incorporationYear: 1988,
    headquarters: 'Noida, Uttar Pradesh',
    directors: ['Shri R.K. Arora'],
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
    id: 'bldr-lodha',
    builderName: 'Macrotech Developers (Lodha Group)',
    promoterRegistrationId: 'MAHA-PROMOTER-REG-044',
    incorporationYear: 1995,
    headquarters: 'Mumbai, Maharashtra',
    directors: ['Shri Abhishek Lodha (MD)'],
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
    id: 'bldr-brigade',
    builderName: 'Brigade Enterprises Limited',
    promoterRegistrationId: 'KR-PROMOTER-REG-012',
    incorporationYear: 1986,
    headquarters: 'Bengaluru, Karnataka',
    directors: ['Shri M.R. Jaishankar (CMD)'],
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
