import type { InfraProject } from '../types/projectInfra';

export const MOCK_INFRA_PROJECTS: InfraProject[] = [
  {
    id: 'proj-delhi-elevated-01',
    pinCode: '110001',
    nameEnglish: 'Construction of Elevated Corridor Phase 2 - Barapullah to Mayur Vihar Link',
    nameHindi: 'बारापुला से मयूर विहार एलिवेटेड कॉरिडोर - चरण 2',
    sector: 'Roads & Highways',
    state: 'Delhi',
    district: 'New Delhi',
    locationName: 'Ring Road to Mayur Vihar Phase I',
    coordinates: { lat: 28.5892, lng: 77.2514 },
    status: 'Delayed',
    statusHindi: 'विलंबित (Delayed)',
    ministry: 'Public Works Department (PWD), Government of NCT Delhi',
    implementingAgency: 'Delhi PWD Infrastructure Division 1',
    sanctioningBody: 'Cabinet Committee on Expenditure, GNCTD',
    responsibleOfficer: 'Shri R.K. Sharma',
    responsibleOfficerDesignation: 'Executive Engineer, PWD Zone 2',
    leadContractor: 'M/s Larsen & Toubro Construction Infrastructure',
    contractorDetails: {
      id: 'cont-lt-infra',
      name: 'M/s Larsen & Toubro Construction Infrastructure',
      registrationNumber: 'DL-PWD-CAT1-2018-092',
      jvPartners: ['AFCONS Infrastructure Ltd'],
      pastProjectsCount: 42,
      rating: 4.8
    },
    budgetOriginalLakhs: 24500, // ₹245.00 Cr
    budgetAnticipatedLakhs: 29800, // ₹298.00 Cr
    contractValueOriginalLakhs: 22800,
    contractValueRevisedLakhs: 27500,
    expenditureToDateLakhs: 18200,
    progressPhysical: 68,
    progressFinancial: 64,
    startDate: '2022-03-15',
    originalCompletionDate: '2024-06-30',
    anticipatedCompletionDate: '2025-06-30',
    clearances: {
      landAcquisition: 92,
      forestClearance: 'Approved',
      environmentalClearance: 'Approved',
      utilityShifting: 'In Progress'
    },
    neutralDelaySummary: 'Project timeframe adjusted due to land acquisition clearance along the Yamuna floodplain margin and monsoon waterlogging safety protocols.',
    neutralDelaySummaryHindi: 'यमुना खादर क्षेत्र में भूमि अधिग्रहण प्रक्रियाओं और मानसून जलभराव सुरक्षा मानकों के कारण समय-सीमा में समायोजन किया गया है।',
    tenders: [
      {
        id: 'tend-del-01',
        tenderNumber: 'PWD/DEL/2021/NIT-882',
        title: 'Design and Construction of Elevated Structure with Elevated Ramps and Culvert Link',
        publishingPortal: 'Delhi Govt e-Procurement Portal',
        issueDate: '2021-08-10',
        closingDate: '2021-09-25',
        estimatedCostLakhs: 23500,
        sourceUrl: 'https://govtprocurement.delhi.gov.in/tenders/PWD-DEL-2021-NIT-882',
        sourceTitle: 'Delhi PWD e-Procurement Portal Gazette #882'
      }
    ],
    workOrders: [
      {
        id: 'wo-del-01',
        workOrderNumber: 'WO/PWD/EZ/2022/104',
        issueDate: '2022-02-18',
        awardedContractor: 'M/s Larsen & Toubro Construction Infrastructure',
        awardedValueLakhs: 22800,
        signingAuthority: 'Chief Engineer (Buildings & Roads), PWD Delhi',
        sourceUrl: 'https://pwd.delhigovt.nic.in/workorders/WO-PWD-EZ-2022-104',
        sourceTitle: 'PWD Work Order Registry Entry #104'
      }
    ],
    extensions: [
      {
        id: 'ext-del-01',
        grantDate: '2024-05-12',
        grantedMonths: 12,
        revisedCompletionDate: '2025-06-30',
        neutralReason: 'Procedural time required for high-tension cable relocation and Yamuna Floodplain Clearance Committee review.',
        approvingAuthority: 'Secretary, PWD, Govt of NCT Delhi',
        sourceUrl: 'https://pwd.delhigovt.nic.in/orders/ext-grant-2024-may.pdf',
        sourceTitle: 'GNCTD PWD Extension Approval Notification Order #PWD/2024/77'
      }
    ],
    payments: [
      {
        id: 'pay-del-01',
        disbursementDate: '2022-09-30',
        amountLakhs: 4500,
        milestone: 'Foundation Piling & Substructure Completion (Pier 1 to Pier 24)',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://pfms.nic.in/reports/DisbursementDetail?ref=PFMS-DL-2022-8812',
        sourceTitle: 'PFMS Public Disbursement Portal Record PFMS-DL-2022-8812'
      },
      {
        id: 'pay-del-02',
        disbursementDate: '2023-08-15',
        amountLakhs: 8200,
        milestone: 'Pre-stressed Concrete Girders Launching Phase I',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://pfms.nic.in/reports/DisbursementDetail?ref=PFMS-DL-2023-9901',
        sourceTitle: 'PFMS Public Disbursement Portal Record PFMS-DL-2023-9901'
      },
      {
        id: 'pay-del-03',
        disbursementDate: '2024-04-10',
        amountLakhs: 5500,
        milestone: 'Deck Slab Casting & Flyover Ramp Structural Assemblies',
        paymentStatus: 'Under Review',
        sourceUrl: 'https://pfms.nic.in/reports/DisbursementDetail?ref=PFMS-DL-2024-1044',
        sourceTitle: 'PFMS Public Disbursement Portal Record PFMS-DL-2024-1044'
      }
    ],
    evidenceDocuments: [
      {
        id: 'ev-del-01',
        title: 'MoSPI Central Sector Projects Flash Report - July 2024 (Project ID 110001-PWD)',
        documentType: 'MoSPI Flash Report',
        publishDate: '2024-07-20',
        issuingBody: 'Ministry of Statistics and Programme Implementation (MoSPI), Govt of India',
        url: 'https://mospi.gov.in/flash-reports/central-sector-projects-2024-07.pdf',
        fileSize: '3.4 MB',
        summary: 'Official MoSPI progress audit entry noting 68% physical completion and anticipated milestone completion by June 2025.'
      },
      {
        id: 'ev-del-02',
        title: 'CAG Audit Report on Infrastructure & Highway Extensions in GNCTD',
        documentType: 'CAG Audit Report',
        publishDate: '2024-02-14',
        issuingBody: 'Comptroller and Auditor General of India (CAG)',
        url: 'https://cag.gov.in/en/audit-report/details/11902',
        fileSize: '6.1 MB',
        summary: 'Audit of structural clearances and cost variation factors including environmental safety protocols.'
      }
    ],
    history: [
      {
        id: 'hist-del-01',
        date: '2021-08-10',
        title: 'Notice Inviting Tender Published',
        titleHindi: 'निविदा आमंत्रण सूचना प्रकाशित',
        eventType: 'Tender',
        neutralDescription: 'Public tender issued on Delhi Govt e-procurement portal for Barapullah Phase 2 link bridge.',
        statusBadge: 'Under Review',
        source: {
          title: 'CPPP Tender Portal Gazette Notice #PWD/DEL/2021/NIT-882',
          url: 'https://govtprocurement.delhi.gov.in',
          publisher: 'Delhi PWD Procurement Wing'
        }
      },
      {
        id: 'hist-del-02',
        date: '2022-02-18',
        title: 'Work Order Awarded to L&T Construction',
        titleHindi: 'कार्य आदेश जारी',
        eventType: 'Work Order',
        neutralDescription: 'Work order executed with awarded value of ₹228 Crore and target duration of 28 months.',
        statusBadge: 'Verified',
        source: {
          title: 'PWD Work Order Registry Entry #WO/PWD/EZ/2022/104',
          url: 'https://pwd.delhigovt.nic.in',
          publisher: 'Chief Engineer PWD Delhi'
        }
      },
      {
        id: 'hist-del-03',
        date: '2023-04-10',
        title: 'Environmental & Floodplain Safety Clearance Approved',
        titleHindi: 'पर्यावरण एवं खादर सुरक्षा मंजूरी स्वीकृत',
        eventType: 'Inspection',
        neutralDescription: 'Yamuna Standing Committee issued clearance for pillar foundations along floodplain buffer.',
        statusBadge: 'Verified',
        source: {
          title: 'Yamuna Standing Safety Committee Minutes 2023-Q2',
          url: 'https://cpcb.nic.in/yamuna-committee',
          publisher: 'Central Pollution Control Board & DDA'
        }
      },
      {
        id: 'hist-del-04',
        date: '2024-05-12',
        title: 'Extension Approved to June 2025',
        titleHindi: 'जून 2025 तक समयावधि विस्तार स्वीकृत',
        eventType: 'Extension',
        neutralDescription: '12-month timeline extension approved to complete high-tension utility shifting and ramp connections.',
        statusBadge: 'Extended',
        source: {
          title: 'PWD Order No. PWD/2024/77 Notification',
          url: 'https://pwd.delhigovt.nic.in/orders',
          publisher: 'Secretary PWD, GNCTD'
        }
      }
    ],
    groundTruth: {
      physicalScore: 72,
      verificationStatus: 'Verified',
      lastVerifiedDate: '2026-08-20',
      verifiedBy: 'JantaX District Verification Team & Geo-Audit Contributor',
      physicalStatusNote: 'Pier construction 100% complete. Girders placed on 34 out of 40 spans. Deck slab concreting actively underway.',
      geoTaggedPhotos: [
        {
          id: 'photo-del-1',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
          caption: 'Elevated pier superstructure looking east toward Mayur Vihar',
          timestamp: '2026-08-18 11:30 AM',
          lat: 28.5895,
          lng: 77.2518
        },
        {
          id: 'photo-del-2',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          caption: 'Deck slab shuttering and rebar binding on Pier 18-19',
          timestamp: '2026-08-18 11:45 AM',
          lat: 28.5898,
          lng: 77.2522
        }
      ],
      citizenReports: [
        {
          id: 'cr-del-01',
          userName: 'Vikram Mehta (Mayur Vihar Resident)',
          ratingValue: 70,
          comment: 'Pillar work is finished on the main road stretch. Construction speed has increased since May.',
          upvotes: 14,
          timestamp: '2026-08-15T09:20:00Z'
        }
      ]
    },
    originalSource: {
      name: 'MoSPI Central Sector Infrastructure Monitoring Portal (Flash Report System)',
      url: 'https://mospi.gov.in/infrastructure-monitoring',
      lastUpdated: '2026-08-24 16:30 IST',
      publicationRef: 'MoSPI Flash Report Q2 2024 / Ref #110001-PWD'
    }
  },
  {
    id: 'proj-meerut-pmgsy-02',
    pinCode: '250401',
    nameEnglish: 'PMGSY Rural Connectivity Highway Link - Mawana to Niloha Gram Panchayat',
    nameHindi: 'पीएमजीएसवाई ग्रामीण मार्ग - मवाना से नीलोहा ग्राम पंचायत',
    sector: 'Roads & Highways',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    locationName: 'Mawana Tehsil to Niloha Village, Meerut District',
    coordinates: { lat: 29.1024, lng: 77.9231 },
    status: 'Completed',
    statusHindi: 'पूर्ण (Completed)',
    ministry: 'Ministry of Rural Development, Government of India / UPPWD',
    implementingAgency: 'UP Public Works Department (Rural Roads Division Meerut)',
    sanctioningBody: 'State Level Standing Committee (SLSC), PMGSY UP',
    responsibleOfficer: 'Shri A.K. Chaudhary',
    responsibleOfficerDesignation: 'Executive Engineer, UPPWD Meerut Division',
    leadContractor: 'M/s Chaudhary Road Builders & Sons',
    contractorDetails: {
      id: 'cont-chaudhary-builders',
      name: 'M/s Chaudhary Road Builders & Sons',
      registrationNumber: 'UP-PWD-REG-2019-441',
      pastProjectsCount: 18,
      rating: 4.6
    },
    budgetOriginalLakhs: 1450, // ₹14.50 Cr
    budgetAnticipatedLakhs: 1450,
    contractValueOriginalLakhs: 1390,
    contractValueRevisedLakhs: 1390,
    expenditureToDateLakhs: 1390,
    progressPhysical: 100,
    progressFinancial: 100,
    startDate: '2023-01-10',
    originalCompletionDate: '2023-11-30',
    anticipatedCompletionDate: '2023-11-30',
    clearances: {
      landAcquisition: 100,
      forestClearance: 'Completed',
      environmentalClearance: 'Approved',
      utilityShifting: 'Completed'
    },
    neutralDelaySummary: 'Project completed within scheduled milestone period without extension requirement.',
    neutralDelaySummaryHindi: 'परियोजना निर्धारित मील के पत्थर की अवधि के भीतर बिना किसी विस्तार के पूरी की गई।',
    tenders: [
      {
        id: 'tend-meerut-01',
        tenderNumber: 'UPPMGSY/MRT/2022/T-401',
        title: 'Construction of Bituminous Road and Cross Drainage Works for Mawana-Niloha Road',
        publishingPortal: 'UP e-Procurement Portal (etender.up.nic.in)',
        issueDate: '2022-09-01',
        closingDate: '2022-10-15',
        estimatedCostLakhs: 1420,
        sourceUrl: 'https://etender.up.nic.in/tenders/UPPMGSY-MRT-2022-T-401',
        sourceTitle: 'UP e-Procurement Portal Gazette #T-401'
      }
    ],
    workOrders: [
      {
        id: 'wo-meerut-01',
        workOrderNumber: 'WO/UPPWD/MRT/2022/672',
        issueDate: '2022-12-05',
        awardedContractor: 'M/s Chaudhary Road Builders & Sons',
        awardedValueLakhs: 1390,
        signingAuthority: 'Superintending Engineer, UPPWD Meerut Circle',
        sourceUrl: 'https://uppwd.gov.in/orders/WO-UPPWD-MRT-2022-672',
        sourceTitle: 'UPPWD Work Order Registry Entry #672'
      }
    ],
    extensions: [],
    payments: [
      {
        id: 'pay-meerut-01',
        disbursementDate: '2023-05-15',
        amountLakhs: 500,
        milestone: 'Sub-base Earthwork & WBM Layer 1',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://omms.nic.in/disbursement/OMMS-UP-2023-1102',
        sourceTitle: 'PMGSY Online Management System (OMMS) Payment Log'
      },
      {
        id: 'pay-meerut-02',
        disbursementDate: '2023-12-10',
        amountLakhs: 890,
        milestone: 'Final Bituminous Concrete Overlay & Signage Installation',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://omms.nic.in/disbursement/OMMS-UP-2023-4409',
        sourceTitle: 'PMGSY Online Management System (OMMS) Final Payment Release'
      }
    ],
    evidenceDocuments: [
      {
        id: 'ev-meerut-01',
        title: 'PMGSY National Rural Infrastructure Development Agency (NRIDA) Completion Certificate',
        documentType: 'Work Order',
        publishDate: '2023-12-20',
        issuingBody: 'NRIDA, Ministry of Rural Development',
        url: 'https://omms.nic.in/completion/UP-MRT-250401.pdf',
        fileSize: '1.8 MB',
        summary: 'Final completion certificate verifying 100% physical completion and quality test parameters.'
      }
    ],
    history: [
      {
        id: 'hist-mrt-01',
        date: '2022-09-01',
        title: 'PMGSY Tender Notice Published',
        titleHindi: 'पीएमजीएसवाई निविदा सूचना प्रकाशित',
        eventType: 'Tender',
        neutralDescription: 'State-level tender issued for rural highway link construction.',
        statusBadge: 'Verified',
        source: {
          title: 'UP e-Procurement Portal Ref #UPPMGSY/MRT/2022/T-401',
          url: 'https://etender.up.nic.in',
          publisher: 'UPPWD Rural Roads Wing'
        }
      },
      {
        id: 'hist-mrt-02',
        date: '2022-12-05',
        title: 'Work Order Issued to Chaudhary Road Builders',
        titleHindi: 'कार्य आदेश जारी',
        eventType: 'Work Order',
        neutralDescription: 'Work order executed for ₹13.90 Crore awarded cost.',
        statusBadge: 'Verified',
        source: {
          title: 'UPPWD Work Order Registry #672',
          url: 'https://uppwd.gov.in',
          publisher: 'Superintending Engineer PWD Meerut'
        }
      },
      {
        id: 'hist-mrt-03',
        date: '2023-11-30',
        title: 'Road Completed & Opened for Rural Transit',
        titleHindi: 'सड़क का निर्माण पूर्ण और आवागमन शुरू',
        eventType: 'Completion',
        neutralDescription: 'Physical work and bituminous carpeting verified 100% complete.',
        statusBadge: 'Completed',
        source: {
          title: 'NRIDA Quality Audit & Completion Certificate',
          url: 'https://omms.nic.in',
          publisher: 'National Rural Infrastructure Development Agency'
        }
      }
    ],
    groundTruth: {
      physicalScore: 96,
      verificationStatus: 'Verified',
      lastVerifiedDate: '2026-08-10',
      verifiedBy: 'JantaX Field Surveyor & Local Gram Panchayat Audit',
      physicalStatusNote: 'Road fully carpeted and functional with solar streetlights and edge drainage in Niloha section.',
      geoTaggedPhotos: [
        {
          id: 'photo-mrt-1',
          url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          caption: 'Completed bituminous road surface near Niloha Gram Panchayat link',
          timestamp: '2026-08-10 03:15 PM',
          lat: 29.1028,
          lng: 77.9235
        }
      ],
      citizenReports: [
        {
          id: 'cr-mrt-01',
          userName: 'Ramesh Chand (Sarpanch Niloha)',
          ratingValue: 95,
          comment: 'Road quality is good and travel time to Mawana mandi is reduced from 45 mins to 15 mins.',
          upvotes: 28,
          timestamp: '2026-07-22T14:10:00Z'
        }
      ]
    },
    originalSource: {
      name: 'PMGSY Online Management, Monitoring and Accounting System (OMMS)',
      url: 'https://omms.nic.in',
      lastUpdated: '2026-08-20 10:00 IST',
      publicationRef: 'OMMS State UP / District Meerut / Road Code UP-25-401'
    }
  },
  {
    id: 'proj-blr-metro-03',
    pinCode: '560001',
    nameEnglish: 'Bengaluru Metro Phase 2 - Blue Line KR Puram to Airport Corridor',
    nameHindi: 'बेंगलुरु मेट्रो चरण 2 - केआर पुरम से एयरपोर्ट कॉरिडोर',
    sector: 'Urban Transit',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    locationName: 'Outer Ring Road (ORR) & NH-44 Airport Link',
    coordinates: { lat: 12.9984, lng: 77.6953 },
    status: 'Extended',
    statusHindi: 'विस्तारित (Extended)',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA) & Govt of Karnataka',
    implementingAgency: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    sanctioningBody: 'Union Cabinet & Government of Karnataka Joint Board',
    responsibleOfficer: 'Shri Anjum Parwez',
    responsibleOfficerDesignation: 'Managing Director, BMRCL',
    leadContractor: 'M/s NCC Ltd - Afcons Infrastructure Joint Venture',
    contractorDetails: {
      id: 'cont-ncc-afcons',
      name: 'NCC - Afcons Infrastructure JV',
      registrationNumber: 'KA-BMRCL-JV-2020-009',
      jvPartners: ['NCC Limited', 'Afcons Infrastructure'],
      pastProjectsCount: 35,
      rating: 4.7
    },
    budgetOriginalLakhs: 147880, // ₹1,478.80 Cr
    budgetAnticipatedLakhs: 162000, // ₹1,620.00 Cr
    contractValueOriginalLakhs: 139500,
    contractValueRevisedLakhs: 154000,
    expenditureToDateLakhs: 98000,
    progressPhysical: 65,
    progressFinancial: 62,
    startDate: '2021-06-01',
    originalCompletionDate: '2024-12-31',
    anticipatedCompletionDate: '2026-06-30',
    clearances: {
      landAcquisition: 96,
      forestClearance: 'Approved',
      environmentalClearance: 'Approved',
      utilityShifting: 'In Progress'
    },
    neutralDelaySummary: 'Schedule revised to accommodate traffic diversion management along Outer Ring Road and underground water pipeline realignments.',
    neutralDelaySummaryHindi: 'आउटर रिंग रोड पर ट्रैफ़िक डायवर्सन और भूमिगत जल पाइपलाइनों के पुनः संरेखण के कारण समय-सारणी संशोधित की गई है।',
    tenders: [
      {
        id: 'tend-blr-01',
        tenderNumber: 'BMRCL/PHASE-2A/PKG-1',
        title: 'Design and Construction of Elevated Viaduct and 6 Stations from KR Puram to Central Silk Board',
        publishingPortal: 'Karnataka e-Procurement Portal',
        issueDate: '2020-02-15',
        closingDate: '2020-05-30',
        estimatedCostLakhs: 140000,
        sourceUrl: 'https://eproc.karnataka.gov.in/tenders/BMRCL-PHASE-2A-PKG-1',
        sourceTitle: 'Karnataka Govt e-Procurement Notice BMRCL-PHASE-2A-PKG-1'
      }
    ],
    workOrders: [
      {
        id: 'wo-blr-01',
        workOrderNumber: 'WO/BMRCL/2021/PKG1-REV',
        issueDate: '2021-05-10',
        awardedContractor: 'NCC - Afcons Infrastructure JV',
        awardedValueLakhs: 139500,
        signingAuthority: 'Director (Projects), BMRCL Bengaluru',
        sourceUrl: 'https://bmrcl.co.in/contracts/WO-BMRCL-2021-PKG1',
        sourceTitle: 'BMRCL Contract Register Entry #PKG1-REV'
      }
    ],
    extensions: [
      {
        id: 'ext-blr-01',
        grantDate: '2024-03-20',
        grantedMonths: 18,
        revisedCompletionDate: '2026-06-30',
        neutralReason: 'Phased traffic management permits along heavy ORR IT corridor and BWSSB bulk water main shifting.',
        approvingAuthority: 'Board of Directors, BMRCL & Urban Development Dept Karnataka',
        sourceUrl: 'https://bmrcl.co.in/notifications/extension-order-phase2a.pdf',
        sourceTitle: 'BMRCL Official Board Resolution Order #BMRCL/BD/2024/12'
      }
    ],
    payments: [
      {
        id: 'pay-blr-01',
        disbursementDate: '2022-11-20',
        amountLakhs: 32000,
        milestone: 'Pillar Piling & Pier Cap Erection (Zone 1 to Zone 3)',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://bmrcl.co.in/financials/disbursements-2022.pdf',
        sourceTitle: 'BMRCL Published Quarterly Financial Statement Q3 2022'
      },
      {
        id: 'pay-blr-02',
        disbursementDate: '2023-10-15',
        amountLakhs: 41000,
        milestone: 'U-Girder Fabrication & Viaduct Span Erection',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://bmrcl.co.in/financials/disbursements-2023.pdf',
        sourceTitle: 'BMRCL Published Quarterly Financial Statement Q3 2023'
      }
    ],
    evidenceDocuments: [
      {
        id: 'ev-blr-01',
        title: 'BMRCL Monthly Progress Report - July 2024 (Phase 2A & 2B)',
        documentType: 'MoSPI Flash Report',
        publishDate: '2024-08-05',
        issuingBody: 'BMRCL & MoHUA',
        url: 'https://bmrcl.co.in/reports/monthly-progress-2024-07.pdf',
        fileSize: '4.8 MB',
        summary: 'Progress matrix recording 65% physical viaduct completion and station structure casting status.'
      }
    ],
    history: [
      {
        id: 'hist-blr-01',
        date: '2020-02-15',
        title: 'Tender Notice Issued for Phase 2A Metro Line',
        titleHindi: 'चरण 2A निविदा सूचना जारी',
        eventType: 'Tender',
        neutralDescription: 'Global competitive tender published for Outer Ring Road metro viaduct.',
        statusBadge: 'Verified',
        source: {
          title: 'Karnataka e-Procurement BMRCL-PHASE-2A-PKG-1',
          url: 'https://eproc.karnataka.gov.in',
          publisher: 'BMRCL Procurement Board'
        }
      },
      {
        id: 'hist-blr-02',
        date: '2021-05-10',
        title: 'Contract Awarded to NCC-Afcons JV',
        titleHindi: 'अनुबंध स्वीकृत',
        eventType: 'Work Order',
        neutralDescription: 'Contract awarded following joint technical and financial evaluation.',
        statusBadge: 'Verified',
        source: {
          title: 'BMRCL Contract Register #PKG1-REV',
          url: 'https://bmrcl.co.in',
          publisher: 'Managing Director BMRCL'
        }
      },
      {
        id: 'hist-blr-03',
        date: '2024-03-20',
        title: 'Completion Target Extended to June 2026',
        titleHindi: 'लक्ष्य जून 2026 तक विस्तारित',
        eventType: 'Extension',
        neutralDescription: 'Timeline extended to accommodate nocturnal construction windows mandated for ORR traffic flow.',
        statusBadge: 'Extended',
        source: {
          title: 'BMRCL Board Resolution #BMRCL/BD/2024/12',
          url: 'https://bmrcl.co.in/notifications',
          publisher: 'Urban Development Department Karnataka'
        }
      }
    ],
    groundTruth: {
      physicalScore: 68,
      verificationStatus: 'Under Review',
      lastVerifiedDate: '2026-08-15',
      verifiedBy: 'JantaX Urban Mobility Tracker & Citizen Contributors',
      physicalStatusNote: 'Pillars completed along major ORR stretches. Station concourse slab casting underway at Bellandur and Marathahalli stops.',
      geoTaggedPhotos: [
        {
          id: 'photo-blr-1',
          url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          caption: 'Metro pier capping and launcher gantry near Bellandur ORR flyover',
          timestamp: '2026-08-12 10:15 AM',
          lat: 12.9341,
          lng: 77.6845
        }
      ],
      citizenReports: [
        {
          id: 'cr-blr-01',
          userName: 'Arjun Rao (Tech Park Commuter)',
          ratingValue: 65,
          comment: 'Steel gantry work is active during night hours. Work on station piers is progressing smoothly near Marathahalli.',
          upvotes: 41,
          timestamp: '2026-08-01T18:30:00Z'
        }
      ]
    },
    originalSource: {
      name: 'Bangalore Metro Rail Corporation Limited (BMRCL) Official Project Portal',
      url: 'https://bmrcl.co.in/project-status',
      lastUpdated: '2026-08-22 14:00 IST',
      publicationRef: 'BMRCL Phase 2A Outer Ring Road Status Bulletin'
    }
  },
  {
    id: 'proj-mum-coastal-04',
    pinCode: '400001',
    nameEnglish: 'Mumbai Coastal Road Project (South Section) - Nariman Point to Worli Link',
    nameHindi: 'मुंबई कोस्टल रोड परियोजना (दक्षिण भाग) - नरीमन प्वाइंट से वर्ली',
    sector: 'Roads & Highways',
    state: 'Maharashtra',
    district: 'Mumbai City',
    locationName: 'Marine Drive to Worli Sea Face, Mumbai',
    coordinates: { lat: 18.9438, lng: 72.8231 },
    status: 'Verified',
    statusHindi: 'सत्यापित (Verified)',
    ministry: 'Brihanmumbai Municipal Corporation (BMC) / Govt of Maharashtra',
    implementingAgency: 'BMC Coastal Road Project Department',
    sanctioningBody: 'MCGM Standing Committee & Maharashtra State Coastal Zone Management Authority',
    responsibleOfficer: 'Shri Bhushan Gagrani',
    responsibleOfficerDesignation: 'Municipal Commissioner, BMC',
    leadContractor: 'M/s Larsen & Toubro Construction Limited',
    contractorDetails: {
      id: 'cont-lt-coastal',
      name: 'M/s Larsen & Toubro Heavy Civil Infrastructure',
      registrationNumber: 'MH-BMC-CR-2018-001',
      pastProjectsCount: 60,
      rating: 4.9
    },
    budgetOriginalLakhs: 1272100, // ₹12,721.00 Cr
    budgetAnticipatedLakhs: 1398000, // ₹13,980.00 Cr
    contractValueOriginalLakhs: 1210000,
    contractValueRevisedLakhs: 1320000,
    expenditureToDateLakhs: 1250000,
    progressPhysical: 92,
    progressFinancial: 90,
    startDate: '2018-10-15',
    originalCompletionDate: '2022-10-31',
    anticipatedCompletionDate: '2024-11-30',
    clearances: {
      landAcquisition: 100,
      forestClearance: 'Approved',
      environmentalClearance: 'Approved',
      utilityShifting: 'Completed'
    },
    neutralDelaySummary: 'Timeline adjusted for marine ecology seasonal constraints, high tide wave protection walls, and undersea tunnel alignment safety protocols.',
    neutralDelaySummaryHindi: 'समुद्री पारिस्थितिकी मौसमी सीमाओं, उच्च ज्वार सुरक्षा दीवार और अंडरसी टनल सुरक्षा मानकों के कारण समय-सीमा का विस्तार किया गया।',
    tenders: [
      {
        id: 'tend-mum-01',
        tenderNumber: 'BMC/CR/2017/PKG-1',
        title: 'Engineering Procurement & Construction of Undersea Tunnel & Reclamation from Princess Street Flyover to Priyadarshini Park',
        publishingPortal: 'BMC e-Procurement Portal (portal.mcgm.gov.in)',
        issueDate: '2017-11-10',
        closingDate: '2018-02-28',
        estimatedCostLakhs: 1250000,
        sourceUrl: 'https://portal.mcgm.gov.in/tenders/BMC-CR-2017-PKG-1',
        sourceTitle: 'BMC Gazette Tender Notice BMC-CR-2017-PKG-1'
      }
    ],
    workOrders: [
      {
        id: 'wo-mum-01',
        workOrderNumber: 'WO/MCGM/CR/2018/02',
        issueDate: '2018-10-01',
        awardedContractor: 'M/s Larsen & Toubro Heavy Civil Infrastructure',
        awardedValueLakhs: 1210000,
        signingAuthority: 'Chief Engineer (Coastal Road), BMC',
        sourceUrl: 'https://portal.mcgm.gov.in/orders/WO-MCGM-CR-2018-02',
        sourceTitle: 'BMC Coastal Road Work Order Registry #02'
      }
    ],
    extensions: [
      {
        id: 'ext-mum-01',
        grantDate: '2022-09-15',
        grantedMonths: 25,
        revisedCompletionDate: '2024-11-30',
        neutralReason: 'Monsoon sea surge safety window restrictions and Supreme Court sanctioned fishing community navigation span modification.',
        approvingAuthority: 'Municipal Commissioner, BMC',
        sourceUrl: 'https://portal.mcgm.gov.in/orders/extension-coastal-road-2022.pdf',
        sourceTitle: 'BMC Commissioner Administrative Sanction Order #BMC/CR/2022/99'
      }
    ],
    payments: [
      {
        id: 'pay-mum-01',
        disbursementDate: '2021-04-10',
        amountLakhs: 450000,
        milestone: 'Twin Undersea Tunnel Excavation (TBM Mavala Breakthrough)',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://portal.mcgm.gov.in/financials/pay-2021-tbm.pdf',
        sourceTitle: 'BMC Published Financial Statement - Coastal Road TBM Milestone'
      },
      {
        id: 'pay-mum-02',
        disbursementDate: '2024-03-12',
        amountLakhs: 600000,
        milestone: 'Phase 1 Southbound Carriageway Tunnel & Interchange Commissioning',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://portal.mcgm.gov.in/financials/pay-2024-ph1.pdf',
        sourceTitle: 'BMC Published Financial Statement - Phase 1 Operational Release'
      }
    ],
    evidenceDocuments: [
      {
        id: 'ev-mum-01',
        title: 'MCGM Official Inspection & Operational Clearance Certificate for Coastal Road Southbound Arm',
        documentType: 'Press Release',
        publishDate: '2024-03-11',
        issuingBody: 'BMC & Govt of Maharashtra',
        url: 'https://portal.mcgm.gov.in/press/coastal-road-phase1-inauguration.pdf',
        fileSize: '2.1 MB',
        summary: 'Official notification confirming operational readiness of 10.58 km section from Marine Drive to Worli.'
      }
    ],
    history: [
      {
        id: 'hist-mum-01',
        date: '2017-11-10',
        title: 'Global Tender Notice Published by BMC',
        titleHindi: 'बीएमसी द्वारा वैश्विक निविदा प्रकाशित',
        eventType: 'Tender',
        neutralDescription: 'EPC tender published for coastal road undersea tunnel and reclamation.',
        statusBadge: 'Verified',
        source: {
          title: 'BMC Portal Gazette Ref #BMC/CR/2017/PKG-1',
          url: 'https://portal.mcgm.gov.in',
          publisher: 'BMC Coastal Road Division'
        }
      },
      {
        id: 'hist-mum-02',
        date: '2018-10-01',
        title: 'Work Order Awarded to L&T Heavy Civil',
        titleHindi: 'कार्य आदेश जारी',
        eventType: 'Work Order',
        neutralDescription: 'Work order executed for coastal road south package.',
        statusBadge: 'Verified',
        source: {
          title: 'BMC Work Order Register #WO/MCGM/CR/2018/02',
          url: 'https://portal.mcgm.gov.in',
          publisher: 'Chief Engineer MCGM'
        }
      },
      {
        id: 'hist-mum-03',
        date: '2024-03-11',
        title: 'Southbound Carriageway Opened to Public Traffic',
        titleHindi: 'दक्षिण दिशा का मार्ग जनता के लिए खोला गया',
        eventType: 'Completion',
        neutralDescription: 'Twin tunnels and promenade opened following safety audit certification.',
        statusBadge: 'Verified',
        source: {
          title: 'BMC Safety Audit & Operational Notification',
          url: 'https://portal.mcgm.gov.in',
          publisher: 'Municipal Commissioner MCGM'
        }
      }
    ],
    groundTruth: {
      physicalScore: 94,
      verificationStatus: 'Verified',
      lastVerifiedDate: '2026-08-22',
      verifiedBy: 'JantaX Geo-Audit & Citizen Field Survey',
      physicalStatusNote: 'Southbound tunnel and Worli interchange operational. Promenade landscaping and northbound connector bridge bowstring arch installation complete.',
      geoTaggedPhotos: [
        {
          id: 'photo-mum-1',
          url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
          caption: 'Coastal road sea wall and operational carriageway view near Haji Ali',
          timestamp: '2026-08-20 05:40 PM',
          lat: 18.9772,
          lng: 72.8105
        }
      ],
      citizenReports: [
        {
          id: 'cr-mum-01',
          userName: 'Karan Shah (South Mumbai Resident)',
          ratingValue: 92,
          comment: 'Travel time between Marine Drive and Worli is reduced to under 10 minutes. Tunnel lighting and ventilation are working properly.',
          upvotes: 52,
          timestamp: '2026-08-10T11:00:00Z'
        }
      ]
    },
    originalSource: {
      name: 'Brihanmumbai Municipal Corporation (BMC) Coastal Road Project Department',
      url: 'https://portal.mcgm.gov.in',
      lastUpdated: '2026-08-23 09:30 IST',
      publicationRef: 'BMC Coastal Road Monthly Dashboard / Ref #CR-2024-03'
    }
  },
  {
    id: 'proj-varanasi-sewage-05',
    pinCode: '221001',
    nameEnglish: 'Jal Jeevan Mission & Namami Gange - Varanasi Sewage Treatment Plant (STP) & Interception Network',
    nameHindi: 'नमामि गंगे - वाराणसी सीवेज ट्रीटमेंट प्लांट और जल शोधन परियोजना',
    sector: 'Water & Sewage',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    locationName: 'Ramna & Assi Nala Drain Area, Varanasi',
    coordinates: { lat: 25.2677, lng: 82.9913 },
    status: 'Incomplete',
    statusHindi: 'अपूर्ण (Incomplete)',
    ministry: 'Ministry of Jal Shakti, Department of Water Resources, Govt of India',
    implementingAgency: 'UP Jal Nigam (Urban) & National Mission for Clean Ganga (NMCG)',
    sanctioningBody: 'Empowered Steering Committee, Namami Gange',
    responsibleOfficer: 'Shri S.K. Srivastava',
    responsibleOfficerDesignation: 'Project Manager, UP Jal Nigam Ganga Pollution Control Unit',
    leadContractor: 'M/s VA Tech Wabag Limited',
    contractorDetails: {
      id: 'cont-wabag',
      name: 'M/s VA Tech Wabag Limited',
      registrationNumber: 'TN-WABAG-NMCG-2019-108',
      pastProjectsCount: 28,
      rating: 4.5
    },
    budgetOriginalLakhs: 15300, // ₹153.00 Cr
    budgetAnticipatedLakhs: 17800, // ₹178.00 Cr
    contractValueOriginalLakhs: 14800,
    contractValueRevisedLakhs: 16900,
    expenditureToDateLakhs: 11200,
    progressPhysical: 78,
    progressFinancial: 74,
    startDate: '2021-04-01',
    originalCompletionDate: '2023-09-30',
    anticipatedCompletionDate: '2025-03-31',
    clearances: {
      landAcquisition: 88,
      forestClearance: 'N/A',
      environmentalClearance: 'Approved',
      utilityShifting: 'In Progress'
    },
    neutralDelaySummary: 'Work schedule extended due to underground rock strata during trunk sewer trenching and narrow old city lane access constraints.',
    neutralDelaySummaryHindi: 'ट्रंक सीवर ट्रेंचिंग के दौरान चट्टानी धरातल और पुराने शहर की तंग गलियों में काम की सीमाओं के कारण समय-सीमा बढ़ाई गई है।',
    tenders: [
      {
        id: 'tend-vns-01',
        tenderNumber: 'NMCG/UP/VNS/2020/STP-04',
        title: 'Design, Build, Operate and Transfer of 50 MLD STP at Ramna with Trunk Interception Drain',
        publishingPortal: 'Central Public Procurement Portal (CPPP)',
        issueDate: '2020-07-15',
        closingDate: '2020-09-10',
        estimatedCostLakhs: 15000,
        sourceUrl: 'https://eprocure.gov.in/eprocure/app?page=FrontEndTenderDetails&ref=NMCG-UP-VNS-2020-STP-04',
        sourceTitle: 'CPPP National Procurement Portal Entry #STP-04'
      }
    ],
    workOrders: [
      {
        id: 'wo-vns-01',
        workOrderNumber: 'WO/UPJN/GPCU/2021/44',
        issueDate: '2021-03-12',
        awardedContractor: 'M/s VA Tech Wabag Limited',
        awardedValueLakhs: 14800,
        signingAuthority: 'General Manager, Ganga Pollution Control Unit, UP Jal Nigam',
        sourceUrl: 'https://upjn.org/workorders/WO-UPJN-GPCU-2021-44',
        sourceTitle: 'UP Jal Nigam Official Gazette Entry #44'
      }
    ],
    extensions: [
      {
        id: 'ext-vns-01',
        grantDate: '2023-08-10',
        grantedMonths: 18,
        revisedCompletionDate: '2025-03-31',
        neutralReason: 'Permission timing constraints for micro-tunneling near ancient heritage zone and underground power line safety shifting.',
        approvingAuthority: 'Executive Director (Projects), NMCG New Delhi',
        sourceUrl: 'https://nmcg.nic.in/orders/extension-varanasi-stp-2023.pdf',
        sourceTitle: 'NMCG Executive Director Sanction Order #NMCG/VNS/2023/18'
      }
    ],
    payments: [
      {
        id: 'pay-vns-01',
        disbursementDate: '2022-06-15',
        amountLakhs: 4800,
        milestone: 'STP Civil Structures & Biological Reactor Tank Construction',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://pfms.nic.in/reports/DisbursementDetail?ref=PFMS-UP-2022-4411',
        sourceTitle: 'PFMS Public Payment Log PFMS-UP-2022-4411'
      },
      {
        id: 'pay-vns-02',
        disbursementDate: '2023-11-20',
        amountLakhs: 5400,
        milestone: 'Interception Sewer Line Piping (14 km laying out of 18 km)',
        paymentStatus: 'Disbursed',
        sourceUrl: 'https://pfms.nic.in/reports/DisbursementDetail?ref=PFMS-UP-2023-7720',
        sourceTitle: 'PFMS Public Payment Log PFMS-UP-2023-7720'
      }
    ],
    evidenceDocuments: [
      {
        id: 'ev-vns-01',
        title: 'NMCG Monthly Monitoring Report on Ganga River Sewage Interception (Varanasi Zone)',
        documentType: 'MoSPI Flash Report',
        publishDate: '2024-06-15',
        issuingBody: 'National Mission for Clean Ganga (NMCG)',
        url: 'https://nmcg.nic.in/reports/monthly-varanasi-2024-06.pdf',
        fileSize: '3.1 MB',
        summary: 'Progress report noting 78% physical completion of Ramna STP and ongoing micro-tunneling at Assi Nala.'
      }
    ],
    history: [
      {
        id: 'hist-vns-01',
        date: '2020-07-15',
        title: 'CPPP Tender Issued for Ramna STP',
        titleHindi: 'रामना एसटीपी के लिए निविदा जारी',
        eventType: 'Tender',
        neutralDescription: 'Namami Gange tender published on Central Public Procurement Portal.',
        statusBadge: 'Verified',
        source: {
          title: 'CPPP Portal Gazette #NMCG/UP/VNS/2020/STP-04',
          url: 'https://eprocure.gov.in',
          publisher: 'National Mission for Clean Ganga'
        }
      },
      {
        id: 'hist-vns-02',
        date: '2021-03-12',
        title: 'Work Order Awarded to VA Tech Wabag',
        titleHindi: 'वीए टेक वाबैग को कार्य आदेश',
        eventType: 'Work Order',
        neutralDescription: 'Work order executed with 30-month target timeline.',
        statusBadge: 'Verified',
        source: {
          title: 'UP Jal Nigam Work Order Registry #44',
          url: 'https://upjn.org',
          publisher: 'UP Jal Nigam Ganga Division'
        }
      },
      {
        id: 'hist-vns-03',
        date: '2023-08-10',
        title: 'Timeline Extension Approved to March 2025',
        titleHindi: 'मार्च 2025 तक समय-सीमा विस्तार',
        eventType: 'Extension',
        neutralDescription: '18-month extension sanctioned for trenchless micro-tunneling under narrow arterial roads.',
        statusBadge: 'Extended',
        source: {
          title: 'NMCG Sanction Order #NMCG/VNS/2023/18',
          url: 'https://nmcg.nic.in',
          publisher: 'Executive Director NMCG'
        }
      }
    ],
    groundTruth: {
      physicalScore: 76,
      verificationStatus: 'Under Review',
      lastVerifiedDate: '2026-08-14',
      verifiedBy: 'JantaX Clean Water Audit Team & Verified Local Citizen',
      physicalStatusNote: 'STP main treatment tanks and aeration blowers installed at Ramna site. Micro-tunneling pipeline work in progress along Nagwa-Assi stretch.',
      geoTaggedPhotos: [
        {
          id: 'photo-vns-1',
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          caption: 'Ramna STP aeration basin civil construction and pump installation site',
          timestamp: '2026-08-11 04:20 PM',
          lat: 25.2680,
          lng: 82.9918
        }
      ],
      citizenReports: [
        {
          id: 'cr-vns-01',
          userName: 'Prof. S.N. Tripathi (Varanasi Resident)',
          ratingValue: 75,
          comment: 'STP plant structure is complete at Ramna. Pipe laying work on Assi Ghat road is taking time due to narrow traffic lanes.',
          upvotes: 19,
          timestamp: '2026-08-05T16:45:00Z'
        }
      ]
    },
    originalSource: {
      name: 'National Mission for Clean Ganga (NMCG) Project Monitoring System',
      url: 'https://nmcg.nic.in/projects',
      lastUpdated: '2026-08-21 16:00 IST',
      publicationRef: 'NMCG Namami Gange Progress Portal / Ref #UP-VNS-STP-04'
    }
  }
];
