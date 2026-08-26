import type { PublicAuthority, RtiDraftTemplate } from '../types/rti';

export const MOCK_PUBLIC_AUTHORITIES: PublicAuthority[] = [
  {
    id: 'RTI-AUTH-MORTH',
    authorityName: 'Ministry of Road Transport and Highways (MoRTH)',
    authorityNameHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय',
    parentMinistry: 'Ministry of Road Transport and Highways',
    parentMinistryHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय',
    governmentLevel: 'Union Ministry',
    pinCode: '110001',
    city: 'New Delhi',
    state: 'Delhi',
    avgResponseDays: 22,
    totalRequestsReceivedAnnual: 18450,
    disposedWithin30DaysPercent: 91.4,
    pendingBeyond30DaysPercent: 8.6,
    rejectionRatePercent: 4.2,
    firstAppealsFiled: 1420,
    firstAppealsUpheldPercent: 32.0,
    topExemptions: [
      { clause: 'Section 8(1)(d)', clauseTitle: 'Commercial Confidence & Trade Secrets', clauseTitleHi: 'व्यावसायिक गोपनीयता एवं निविदा विवरण', count: 410, percentage: 52.8 },
      { clause: 'Section 8(1)(j)', clauseTitle: 'Personal Information of Officers', clauseTitleHi: 'व्यक्तिगत सूचना प्रकटीकरण', count: 280, percentage: 36.1 },
      { clause: 'Section 8(1)(a)', clauseTitle: 'Strategic Security & State Relations', clauseTitleHi: 'सामरिक एवं राष्ट्रीय सुरक्षा', count: 86, percentage: 11.1 },
    ],
    cpio: {
      name: 'Ajay Kumar Verma',
      nameHi: 'अजय कुमार वर्मा',
      designation: 'Under Secretary (RTI Cell)',
      designationHi: 'अवर सचिव (आरटीआई सेल)',
      email: 'rti-morth@nic.in',
      phone: '011-2371-7390',
      officeAddress: 'Room No. 341, Transport Bhawan, 1 Parliament Street, New Delhi - 110001',
    },
    faa: {
      name: 'Dr. Meenakshi Sundaram',
      nameHi: 'डॉ. मीनाक्षी सुंदरम',
      designation: 'Joint Secretary (Highways & First Appellate Authority)',
      designationHi: 'संयुक्त सचिव (प्रथम अपीलीय अधिकारी)',
      email: 'faa-morth@nic.in',
      phone: '011-2371-5244',
      officeAddress: 'Room No. 210, Transport Bhawan, New Delhi - 110001',
    },
    onlineFilingSupported: true,
    onlinePortalUrl: 'https://rtionline.gov.in',
    lastQuarterSync: '2026-Q2 (CIC Section 25 Audit)',
    sourceUrl: 'https://dsscic.nic.in/quarterly-returns/abstract-report?year=2026&quarter=Q2&ministry=MORTH',
  },
  {
    id: 'RTI-AUTH-NHAI',
    authorityName: 'National Highways Authority of India (NHAI)',
    authorityNameHi: 'भारतीय राष्ट्रीय राजमार्ग प्राधिकरण',
    parentMinistry: 'Ministry of Road Transport and Highways',
    parentMinistryHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय',
    governmentLevel: 'Public Sector Undertaking',
    pinCode: '110075',
    city: 'New Delhi',
    state: 'Delhi',
    avgResponseDays: 26,
    totalRequestsReceivedAnnual: 14200,
    disposedWithin30DaysPercent: 84.6,
    pendingBeyond30DaysPercent: 15.4,
    rejectionRatePercent: 7.8,
    firstAppealsFiled: 1890,
    firstAppealsUpheldPercent: 28.5,
    topExemptions: [
      { clause: 'Section 8(1)(d)', clauseTitle: 'Commercial Confidence (Toll & Concessionaire Agreements)', clauseTitleHi: 'व्यावसायिक गोपनीयता (टोल अनुबंध)', count: 680, percentage: 61.4 },
      { clause: 'Section 8(1)(j)', clauseTitle: 'Personal Information of Land Owners', clauseTitleHi: 'भू-स्वामियों का व्यक्तिगत विवरण', count: 320, percentage: 28.9 },
    ],
    cpio: {
      name: 'R. K. Srivastava',
      nameHi: 'आर. के. श्रीवास्तव',
      designation: 'General Manager (Coordination & CPIO)',
      designationHi: 'महाप्रबंधक (समन्वय एवं सीपीआईओ)',
      email: 'cpio-nhai@nhai.org',
      phone: '011-2507-4100',
      officeAddress: 'NHAI HQ, G-5 & 6, Sector-10, Dwarka, New Delhi - 110075',
    },
    faa: {
      name: 'S. K. Nirmal',
      nameHi: 'एस. के. निर्मल',
      designation: 'Chief General Manager (Technical & FAA)',
      designationHi: 'मुख्य महाप्रबंधक (तकनीकी एवं प्रथम अपीलीय अधिकारी)',
      email: 'faa-nhai@nhai.org',
      phone: '011-2507-4200',
      officeAddress: 'NHAI HQ, Sector-10, Dwarka, New Delhi - 110075',
    },
    onlineFilingSupported: true,
    onlinePortalUrl: 'https://rtionline.gov.in',
    lastQuarterSync: '2026-Q2 (CIC Section 25 Audit)',
    sourceUrl: 'https://dsscic.nic.in/quarterly-returns/abstract-report?year=2026&quarter=Q2&dept=NHAI',
  },
  {
    id: 'RTI-AUTH-MOE',
    authorityName: 'Department of School Education and Literacy (MoE)',
    authorityNameHi: 'स्कूल शिक्षा एवं साक्षरता विभाग (शिक्षा मंत्रालय)',
    parentMinistry: 'Ministry of Education',
    parentMinistryHi: 'शिक्षा मंत्रालय',
    governmentLevel: 'Union Ministry',
    pinCode: '110001',
    city: 'New Delhi',
    state: 'Delhi',
    avgResponseDays: 19,
    totalRequestsReceivedAnnual: 22100,
    disposedWithin30DaysPercent: 94.2,
    pendingBeyond30DaysPercent: 5.8,
    rejectionRatePercent: 2.1,
    firstAppealsFiled: 980,
    firstAppealsUpheldPercent: 41.0,
    topExemptions: [
      { clause: 'Section 8(1)(j)', clauseTitle: 'Personal Marks & Identity Records', clauseTitleHi: 'विद्यार्थियों का व्यक्तिगत परीक्षा रिकॉर्ड', count: 310, percentage: 66.8 },
      { clause: 'Section 8(1)(e)', clauseTitle: 'Fiduciary Capacity (Confidential Evaluation)', clauseTitleHi: 'गोपनीय मूल्यांकन एवं वैश्वासिक संबंध', count: 120, percentage: 25.9 },
    ],
    cpio: {
      name: 'Preeti Mehra',
      nameHi: 'प्रीति मेहरा',
      designation: 'Deputy Secretary (UDISE+ & School Policy)',
      designationHi: 'उप सचिव (यूडीआईएसई+ एवं स्कूल नीति)',
      email: 'cpio-dsel@nic.in',
      phone: '011-2338-3450',
      officeAddress: 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001',
    },
    faa: {
      name: 'Vipin Kumar',
      nameHi: 'विपिन कुमार',
      designation: 'Additional Secretary (School Education & FAA)',
      designationHi: 'अपर सचिव (स्कूल शिक्षा एवं प्रथम अपीलीय अधिकारी)',
      email: 'faa-dsel@nic.in',
      phone: '011-2338-4245',
      officeAddress: 'Room 214-C, Shastri Bhawan, New Delhi - 110001',
    },
    onlineFilingSupported: true,
    onlinePortalUrl: 'https://rtionline.gov.in',
    lastQuarterSync: '2026-Q2 (CIC Section 25 Audit)',
    sourceUrl: 'https://dsscic.nic.in/quarterly-returns/abstract-report?year=2026&quarter=Q2&ministry=MOE',
  },
  {
    id: 'RTI-AUTH-MCD',
    authorityName: 'Municipal Corporation of Delhi (MCD Head Office)',
    authorityNameHi: 'दिल्ली नगर निगम (मुख्यालय)',
    parentMinistry: 'Urban Development Department, Govt of NCT Delhi',
    parentMinistryHi: 'शहरी विकास विभाग',
    governmentLevel: 'Municipal / Local Body',
    pinCode: '110002',
    city: 'New Delhi',
    state: 'Delhi',
    avgResponseDays: 34,
    totalRequestsReceivedAnnual: 31500,
    disposedWithin30DaysPercent: 68.2,
    pendingBeyond30DaysPercent: 31.8,
    rejectionRatePercent: 11.5,
    firstAppealsFiled: 4200,
    firstAppealsUpheldPercent: 24.0,
    topExemptions: [
      { clause: 'Section 8(1)(j)', clauseTitle: 'Private Building Sanction Files', clauseTitleHi: 'निजी भवन निर्माण नक्शा पत्रावली', count: 1840, percentage: 50.8 },
      { clause: 'Section 8(1)(h)', clauseTitle: 'Ongoing Encroachment / Vigilance Inquiry', clauseTitleHi: 'चल रही अतिक्रमण/सतर्कता जांच', count: 1210, percentage: 33.4 },
    ],
    cpio: {
      name: 'Satish Chand Sharma',
      nameHi: 'सतीश चंद शर्मा',
      designation: 'Administrative Officer (RTI Cell HQ)',
      designationHi: 'प्रशासनिक अधिकारी (आरटीआई सेल)',
      email: 'ao-rti@mcd.nic.in',
      phone: '011-2322-5100',
      officeAddress: '4th Floor, Dr. S.P.M. Civic Centre, Minto Road, New Delhi - 110002',
    },
    faa: {
      name: 'Rajesh Goyal',
      nameHi: 'राजेश गोयल',
      designation: 'Deputy Commissioner (Headquarters & FAA)',
      designationHi: 'उपायुक्त (मुख्यालय एवं प्रथम अपीलीय अधिकारी)',
      email: 'dc-hq@mcd.nic.in',
      phone: '011-2322-5200',
      officeAddress: 'Civic Centre, Minto Road, New Delhi - 110002',
    },
    onlineFilingSupported: true,
    onlinePortalUrl: 'https://mcdonline.nic.in/rti',
    lastQuarterSync: '2026-Q2 (CIC Section 25 Audit)',
    sourceUrl: 'https://mcdonline.nic.in/rti-status-report-2026.pdf',
  },
];

export const MOCK_RTI_TEMPLATES: RtiDraftTemplate[] = [
  {
    applicationType: 'Initial Request (Section 6(1))',
    title: 'Standard Section 6(1) RTI Application',
    titleHi: 'धारा 6(1) के तहत मानक आरटीआई आवेदन',
    statutoryTimeline: '30 Days from date of receipt (35 days if filed via APIO)',
    feeRule: '₹10 Application Fee (Demand Draft / IPO / Online Gateway). Nil for BPL Cardholders.',
    templateText: `To,
The Central Public Information Officer (CPIO),
[Name of Public Authority / Ministry / Department]
[Office Address]

Subject: Request for Information under Section 6(1) of the Right to Information Act, 2005.

Respected Sir/Madam,
I, a citizen of India, hereby request you to kindly provide certified copies and official records regarding the following specific points:

1. Certified copy of the administrative approval, work order, and sanctioned budget for [Describe Project / Scheme / Action].
2. Name and official designation of the executing contractor and nodal supervisor appointed for the above work.
3. Measurement book (MB) records, running bill payments, and physical completion inspection certificates issued to date.
4. If work is delayed beyond promised completion timeline, kindly provide daily file noting containing reasons recorded for delay and penalty imposed.

As per Section 7(1) of the RTI Act 2005, the requested information may kindly be furnished within the statutory period of 30 days.

Application Fee: ₹10 paid via Online Gateway / IPO No. [XXXXX]. (BPL Card Attached if fee exemption claimed).

Yours faithfully,
[Citizen Name]
[Address / PIN Code / Mobile Number / Email]`,
    guidanceNotes: [
      'Keep questions specific and factual (ask for documents, orders, notifications, and bills).',
      'Do not ask "Why" or seek legal opinions — ask for "Certified copy of reasons recorded in file notings".',
      'Under Section 7(6), if information is not supplied within 30 days, it must be provided free of cost.',
    ],
    officialPortalUrl: 'https://rtionline.gov.in',
  },
  {
    applicationType: 'First Appeal (Section 19(1))',
    title: 'First Appeal under Section 19(1) (प्रथम अपील)',
    titleHi: 'धारा 19(1) के तहत प्रथम अपील (सूचना न मिलने या गलत मिलने पर)',
    statutoryTimeline: '30 Days (Maximum 45 days with recorded reasons)',
    feeRule: 'Zero Fee for First Appeal in most Union Ministries.',
    templateText: `To,
The First Appellate Authority (FAA),
[Designation of FAA, e.g. Joint Secretary / Director]
[Name of Public Authority / Ministry]
[Office Address]

Subject: First Appeal under Section 19(1) of the Right to Information Act, 2005 against Deemed Refusal / Unsatisfactory Reply by CPIO.

Reference: RTI Registration Number: [XXXXX/2026] dated [Date of Filing].

Respected Sir/Madam,
1. Name & Address of Appellant: [Your Name & Address]
2. CPIO Details: [Name/Designation of CPIO against whose order appeal is preferred]
3. Grounds for Appeal:
   [ ] No response received within statutory 30-day period (Deemed Refusal under Section 7(2)).
   [ ] Incomplete / Misleading information supplied.
   [ ] Unlawful rejection under Section 8 without justification of public interest.

Prayer:
The Appellant respectfully prays that the First Appellate Authority may kindly:
(a) Direct the CPIO to provide complete, certified information immediately free of charge as per Section 7(6).
(b) Order an inquiry into the unwarranted delay and non-compliance with statutory provisions of RTI Act 2005.

Yours faithfully,
[Appellant Signature / Name]`,
    guidanceNotes: [
      'Must be filed within 30 days from expiry of the 30-day response window.',
      'Always attach a copy of the original RTI application and CPIO reply (if any).',
    ],
    officialPortalUrl: 'https://rtionline.gov.in',
  },
  {
    applicationType: 'Life & Liberty (Section 7(1))',
    title: 'Urgent Life & Liberty Request (48-Hour Clock)',
    titleHi: 'जीवन एवं स्वतंत्रता से संबंधित आवश्यक सूचना (48 घंटे की समय-सीमा)',
    statutoryTimeline: 'Strict 48 Hours from the moment of receipt',
    feeRule: '₹10 standard fee. Proviso to Section 7(1) applies.',
    templateText: `URGENT — LIFE & LIBERTY MATTERS (SECTION 7(1) PROVISO)

To,
The Central Public Information Officer (CPIO),
[Department / Hospital / Prison / Police Authority]

Subject: Urgent Request for Information Concerning Life or Liberty of a Person under Proviso to Section 7(1) of the Right to Information Act, 2005.

Respected Sir/Madam,
This application concerns the imminent threat to the life and physical liberty of [Person Name / Inmate / Patient].

Specific Urgent Records Sought:
1. Certified copy of medical treatment records, diagnostic tests, and ICU admission charts for [Person Name].
2. Detention order / Remand reasons recorded by the investigating officer.

Justification for 48-Hour Clock:
The information sought directly impinges on the fundamental right to life under Article 21. Failure to supply these records within 48 hours will cause irreparable harm.

Kindly supply the information within 48 hours as mandated by statutory law.`,
    guidanceNotes: [
      'Write "LIFE & LIBERTY (48-HOUR PROVISO)" prominently in red/bold on the envelope or subject line.',
      'Include documentary proof demonstrating immediate danger to life or liberty.',
    ],
    officialPortalUrl: 'https://rtionline.gov.in',
  },
];
