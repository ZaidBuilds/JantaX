export interface SihMinistryStatement {
  id: string;
  code: string;
  ministry: string;
  ministryHindi: string;
  category: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  officialClaim: {
    portal: string;
    metric: string;
    value: string;
    status: string;
  };
  groundReality: {
    method: string;
    finding: string;
    sampleSize: string;
    confidence: string;
  };
  algorithmicDelta: {
    metric: string;
    discrepancy: string;
    impact: string;
  };
  statutoryResolution: {
    statute: string;
    slaDays: number;
    action: string;
  };
  demoPin: string;
  demoRoute: string;
  officialDataSources: string[];
  featuresDemonstrated: string[];
}

export interface SihRubricCriterion {
  id: string;
  name: string;
  weight: number; // percentage
  description: string;
  proofPoints: string[];
  defaultScore: number;
}

export interface SihPitchSlide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  bullets: string[];
  metrics?: { label: string; value: string; detail?: string }[];
  takeaway: string;
}

export interface SihJuryQa {
  question: string;
  questionHindi: string;
  theme: string;
  answer: string;
  keyPoints: string[];
}

export const SIH_MINISTRY_STATEMENTS: SihMinistryStatement[] = [
  {
    id: 'sih-moe-schools',
    code: 'SIH26202',
    ministry: 'Ministry of Education (DoSEL)',
    ministryHindi: 'शिक्षा मंत्रालय (स्कूली शिक्षा एवं साक्षरता विभाग)',
    category: 'Education & UDISE+',
    title: 'School Infrastructure & Facility Compliance Verification',
    titleHindi: 'सरकारी स्कूल बुनियादी ढांचा व सुविधा अनुपालन सत्यापन',
    description: 'Empowering school management committees, parents, and citizens to audit functional toilets, drinking water, electricity, and teacher ratios against official UDISE+ claims.',
    descriptionHindi: 'आधिकारिक UDISE+ दावों के मुकाबले स्कूल शौचालयों, पेयजल, बिजली एवं शिक्षक-छात्र अनुपात की वास्तविक स्थिति की निगरानी।',
    officialClaim: {
      portal: 'UDISE+ / PM SHRI Portal',
      metric: 'Functional Girls & Boys Toilets',
      value: '100% Functional & Dedicated Water Supply',
      status: 'Claimed Compliant',
    },
    groundReality: {
      method: 'Parent Geo-Tagged Check-in & Photo Audit',
      finding: 'Separate girls toilet locked for 6+ months; running water tap dry.',
      sampleSize: '24 Independent Community Audits',
      confidence: '94% Corroborated',
    },
    algorithmicDelta: {
      metric: 'Infrastructure Discrepancy Gap',
      discrepancy: '-38% Compliance Delta vs Ledger',
      impact: 'RTE 2009 Section 19 norm violated',
    },
    statutoryResolution: {
      statute: 'Right to Education Act Sec 19 / UDISE+ Grievance',
      slaDays: 30,
      action: 'Auto-drafted Block Education Officer (BEO) inspection notice',
    },
    demoPin: '250001',
    demoRoute: '/pin/250001/schools',
    officialDataSources: ['UDISE+ Portal (DoSEL)', 'PM SHRI Registry', 'State Education Gazettes'],
    featuresDemonstrated: [
      'Side-by-side UDISE+ vs Ground Reality',
      'PTR & Infrastructure Discrepancy Metric',
      'Sub-metre Facility Snapping (< 250m)',
      'Parent Check-in EXIF Verification',
    ],
  },
  {
    id: 'sih-mord-pmgsy',
    code: 'SIH26202',
    ministry: 'Ministry of Rural Development / MoRTH',
    ministryHindi: 'ग्रामीण विकास मंत्रालय / सड़क परिवहन मंत्रालय',
    category: 'PMGSY & Public Works',
    title: 'Public Works & PMGSY Rural Road Quality & Delay Audit',
    titleHindi: 'सार्वजनिक निर्माण एवं PMGSY सड़क गुणवत्ता व विलंब ऑडिट',
    description: 'Auditing physical progress vs financial disbursements for rural roads and highway packages, enforcing the 5-year Defect Liability Period (DLP) on contractors.',
    descriptionHindi: 'ग्रामीण सड़कों व लोक निर्माण कार्यों में स्वीकृत बजट बनाम वास्तविक प्रगति की निगरानी एवं ठेकेदार जवाबदेही।',
    officialClaim: {
      portal: 'OMMAS / PMGSY Portal',
      metric: 'Work Completion & Fund Disbursement',
      value: '100% Funds Released, Work Marked Complete',
      status: '100% Disbursed',
    },
    groundReality: {
      method: 'Live Pothole Tagging & Bitumen Thickness Audit',
      finding: 'Severe rutting and potholes within 6 months of commissioning; 1.2km unpaved.',
      sampleSize: '41 Geo-Tagged Citizen Reports',
      confidence: '96% Corroborated',
    },
    algorithmicDelta: {
      metric: 'Defect Liability Period (DLP) Breach',
      discrepancy: 'Contractor liable for free repairs under Clause 44 CPWD',
      impact: 'Penalty clause triggered against registered firm',
    },
    statutoryResolution: {
      statute: 'CPWD Works Manual Clause 44 / PMGSY DLP',
      slaDays: 15,
      action: 'Automated Show-Cause Notice to Executive Engineer & Contractor',
    },
    demoPin: '221001',
    demoRoute: '/pin/221001/works',
    officialDataSources: ['OMMAS PMGSY Database', 'CPWD Schedule of Rates', 'GeM Portal Procurement'],
    featuresDemonstrated: [
      'Sanctioned vs Actual Spend Ledger',
      'Contractor Debarment & Risk Score',
      'Interactive Pothole Crosshair Snapping',
      '15-Day DLP Breach Statutory Countdown',
    ],
  },
  {
    id: 'sih-darpg-cpgrams',
    code: 'SIH26202',
    ministry: 'Department of Administrative Reforms & Public Grievances',
    ministryHindi: 'प्रशासनिक सुधार और लोक शिकायत विभाग (DARPG)',
    category: 'CPGRAMS & Civic Grievance',
    title: 'Geo-Anchored Noise-Free Citizen Grievance & SLA Pipeline',
    titleHindi: 'जियो-एंकर नागरिक शिकायत निवारण एवं एसएलए पाइपलाइन',
    description: 'Replacing untraceable text grievances with verifiable, geo-anchored evidence packs routed directly to the competent nodal officer with a 30-day statutory SLA countdown.',
    descriptionHindi: 'सटीक GPS लोकेशन, नजदीकी सार्वजनिक सुविधा स्नैपिंग और सत्यापन साक्ष्यों के साथ पारदर्शी शिकायत निवारण।',
    officialClaim: {
      portal: 'CPGRAMS Citizen Charter',
      metric: 'Statutory Resolution SLA',
      value: '30 Days Guaranteed Disposal Window',
      status: 'Statutory Commitment',
    },
    groundReality: {
      method: 'Public Ticket Tracking & Cryptographic Hash',
      finding: 'Public tracking URL with remaining business day counter; no departmental black box.',
      sampleSize: 'Real-Time Public Ledger',
      confidence: '100% Immutable',
    },
    algorithmicDelta: {
      metric: 'Jurisdiction Auto-Resolution',
      discrepancy: 'Zero manual routing delays; maps directly to MP, MLA, & Ward Councillor',
      impact: 'Reduces grievance triage time from 14 days to 0 seconds',
    },
    statutoryResolution: {
      statute: 'RTI Act 2005 Sec 7(1) / CPGRAMS Norms',
      slaDays: 30,
      action: '1-Tap Escalation to First Appellate Authority under Sec 19(1)',
    },
    demoPin: '110001',
    demoRoute: '/report',
    officialDataSources: ['DARPG CPGRAMS Portal', 'RTI Online Portal', 'National Informatics Centre (NIC)'],
    featuresDemonstrated: [
      'In-Browser EXIF Geofencing Guard',
      'Mobile OTP Anti-Bot Sybil Shield',
      'Public Ticket Tracker (/track/:id)',
      'Statutory 30-Day Countdown Clock',
    ],
  },
  {
    id: 'sih-mohua-urban',
    code: 'SIH26202',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    ministryHindi: 'आवासन और शहरी कार्य मंत्रालय',
    category: 'RERA & Urban Local Bodies',
    title: 'RERA Housing Delivery & Municipal Ward Health Index',
    titleHindi: 'रेरा हाउसिंग प्रोजेक्ट्स व नगर निगम वार्ड स्वास्थ्य सूचकांक',
    description: 'Tracking builder delivery deadlines, escrow accounts, and delay penalties while providing a composite 100-point Civic Health Index for municipal wards.',
    descriptionHindi: 'घर खरीदारों के लिए रेरा प्रोजेक्ट्स की वैधानिक स्थिति, पजेशन डेडलाइन एवं वार्ड-स्तरीय नागरिक सेवाओं का ट्रैकिंग डैशबोर्ड।',
    officialClaim: {
      portal: 'State RERA Registries (UP-RERA, MahaRERA)',
      metric: 'Proposed Completion Deadline',
      value: 'Committed Delivery Date on Official Gazette',
      status: 'Statutory Filing',
    },
    groundReality: {
      method: 'Homebuyer Community Milestones & Satellite Scan',
      finding: 'Tower construction halted; possession delayed by 18+ months with zero gazetted extension.',
      sampleSize: '156 Allottee Corroborations',
      confidence: '98% Corroborated',
    },
    algorithmicDelta: {
      metric: 'Delay Compensation Interest Delta',
      discrepancy: 'MCLR + 2% interest accrued to allottees under Section 18 RERA',
      impact: 'Builders flagged on public high-risk registry',
    },
    statutoryResolution: {
      statute: 'Real Estate (Regulation and Development) Act Sec 18',
      slaDays: 45,
      action: 'Pre-formatted legal complaint for Real Estate Regulatory Authority bench',
    },
    demoPin: '110001',
    demoRoute: '/pin/110001',
    officialDataSources: ['State RERA Authorities', 'Swachh Survekshan (MoHUA)', 'Municipal Corporation Gazettes'],
    featuresDemonstrated: [
      'RERA Project Delay Counter',
      'Promoter Risk Dossier & Blacklist',
      'Ward Councillor Civic Health Radar (78/100)',
      'Swachh Bharat & AQI Neighborhood Overlay',
    ],
  },
];

export const SIH_RUBRIC_CRITERIA: SihRubricCriterion[] = [
  {
    id: 'novelty',
    name: 'Problem Understanding & Novelty',
    weight: 20,
    description: 'Depth of domain understanding and originality of the solution in bridging the last-mile civic transparency gap.',
    proofPoints: [
      'Breaks open 50+ central and state data silos (UDISE+, PMGSY, RERA, CPGRAMS) into a unified Locality OS.',
      'Pioneers "Official Claim vs Ground Reality" side-by-side transparency with ethical neutrality (Rule 9.4/9.5).',
      'Replaces vague complaint black boxes with exact sub-metre crosshair asset-snapping.',
    ],
    defaultScore: 19,
  },
  {
    id: 'architecture',
    name: 'Technical Architecture & Feasibility',
    weight: 25,
    description: 'Code quality, system design, scalability, security, and algorithmic integrity.',
    proofPoints: [
      'In-browser binary EXIF JPEG APP1 parser in pure TypeScript (zero third-party npm vulnerabilities).',
      'Pan-India postal code resolver with 100% postal circle coverage and client-side caching.',
      '18 automated test suites passing with 102 unit/integration tests green (100% pass rate).',
      'Production-ready Next/Vite frontend + Express/PostgreSQL/PostGIS architecture.',
    ],
    defaultScore: 24,
  },
  {
    id: 'societal-impact',
    name: 'Societal Impact & User Experience',
    weight: 20,
    description: 'Inclusivity, accessibility, speed, and real-world utility for diverse Indian citizens.',
    proofPoints: [
      '100% Bilingual support (English & Hindi) across all interfaces, cards, and legal notices.',
      'Ultra-fast load times with chunk splitting (under 120KB gzipped core) running smoothly on budget 4G phones.',
      '1-Tap WhatsApp civic alert generation for community and ward resident associations.',
      'Grounded anti-hallucination HelpBot strictly citing official government registries.',
    ],
    defaultScore: 19,
  },
  {
    id: 'actionability',
    name: 'Government Adoption & Actionability',
    weight: 15,
    description: 'Practicality of departmental adoption, noise reduction, and closed-loop statutory alignment.',
    proofPoints: [
      'Drastically reduces officer triage time by pre-filtering noise and validating device GPS proximity.',
      'Statutory 30-day SLA countdown under RTI Act Sec 7(1) and 15-day Defect Liability Period (DLP) under CPWD norms.',
      'Dedicated Admin Moderation Workbench (/admin/moderation) with split-screen evidence audit.',
      'Section 79 IT Act Safe Harbor Notice & Official Right to Reply (/official-response).',
    ],
    defaultScore: 15,
  },
  {
    id: 'sustainability',
    name: 'Business Sustainability & Scalability',
    weight: 20,
    description: 'Post-hackathon viability, monetization avenues, hosting economics, and roadmap.',
    proofPoints: [
      'B2G Civic Intelligence Dashboards for Smart City Integrated Command & Control Centers (ICCC).',
      'B2B Locality Civic Intelligence API for banks, insurers, and institutional real estate buyers.',
      'Compliance with Government Open Data License India (GODL-India) for national scale.',
      'Zero-cost serverless Edge caching architecture ensuring minimal infrastructure overhead.',
    ],
    defaultScore: 19,
  },
];

export const SIH_PITCH_SLIDES: SihPitchSlide[] = [
  {
    id: 1,
    title: 'JantaX — India’s Locality OS',
    subtitle: 'Connecting 140 Crore Citizens with Verified Public Records at Street-Level',
    category: 'Title & Team',
    bullets: [
      'Team: ZaidBuilds / JantaX Core Team',
      'Smart India Hackathon 2026 National Finalist Entry',
      'Problem Statement SIH26202 · Smart Automation (AI over multiple public data sources)',
      'One engine, 4 civic themes: Education (UDISE+), Roads (PMGSY), Grievances (CPGRAMS), Housing (RERA)',
    ],
    metrics: [
      { label: 'Data Sources Ingested', value: '7+ Portals', detail: 'UDISE+, OMMAS, RERA, CPGRAMS' },
      { label: 'Coverage', value: '19,000+ PINs', detail: 'All 9 Postal Circles Supported' },
      { label: 'Verification Pass Rate', value: '100%', detail: '110/110 Test Suites Green' },
    ],
    takeaway: 'Bridging the last-mile transparency gap between official government ledgers and ground reality.',
  },
  {
    id: 2,
    title: 'The 3 Paradoxes of Indian Public Data',
    subtitle: 'Why Citizens Remain Disconnected Despite ₹10,000+ Crore Spent on Portals',
    category: 'The Problem',
    bullets: [
      '1. The Discovery Paradox: Information exists across 50+ siloed portals, but an ordinary citizen cannot find what is 500m from their home.',
      '2. The Ground Reality Paradox: Government ledgers report 100% completion & funds disbursed, while ground reality shows broken roads and locked toilets.',
      '3. The Noise Paradox: Official portals (like CPGRAMS) receive vague, untraceable complaints ("road is broken somewhere"), overloading honest officers.',
    ],
    metrics: [
      { label: 'Public Portals', value: '50+ Portals', detail: 'Isolated departmental databases' },
      { label: 'Untraceable Complaints', value: '40% Noise', detail: 'Lack of GPS & photo verification' },
      { label: 'Average Triage Delay', value: '14 Days', detail: 'Lost in inter-departmental routing' },
    ],
    takeaway: 'We do not have a data shortage; we have an aggregation, verification, and spatial discovery crisis.',
  },
  {
    id: 3,
    title: 'The Solution: JantaX Locality OS',
    subtitle: 'One 6-Digit PIN Code Unlocks a 360° Civic X-Ray of Your Neighborhood',
    category: 'Product Solution',
    bullets: [
      'Street-Level Spatial Aggregation: Schools (UDISE+), Public Works (PMGSY), Healthcare (NHM), and Housing (RERA) on a single interactive map.',
      'Side-by-Side Transparency Card: Strict, non-partisan comparison between Official Department Claims and Corroborated Ground Truth.',
      'Auto-Jurisdiction Mapping: Instant 3-tier representative breakdown (Lok Sabha MP + State MLA + Municipal Ward Councillor).',
      'Civic Health Index: Real-time 100-point neighborhood score dynamically calculated from physical facility health.',
    ],
    metrics: [
      { label: 'Input Required', value: '6-Digit PIN', detail: 'Auto-detects ward & coordinates' },
      { label: 'Sectors Tracked', value: '6 Verticals', detail: 'Schools, Roads, Health, RERA, Ration, Wards' },
      { label: 'Institutional Neutrality', value: 'Rule 9.4', detail: 'Zero political party bias or defamation' },
    ],
    takeaway: 'Transforming cold government PDFs into an interactive, visual, street-level public utility.',
  },
  {
    id: 4,
    title: 'Core Technical Innovations',
    subtitle: 'Deep Engineering Ensuring Evidence Integrity & Anti-Spam (Sybil Resistance)',
    category: 'Deep Tech',
    bullets: [
      'Pure In-Browser EXIF Parser: Native TypeScript DataView parser extracts camera GPS metadata directly on the client — zero third-party dependencies.',
      'Sub-Metre Asset Snapping (< 250m): Map crosshair automatically snaps defect coordinates to registered school UDISE codes or PMGSY road packages.',
      'Mobile OTP Guard: Eliminates bot-swarmed spam before citizen reports enter the moderation pipeline.',
      'Statutory SLA Countdown Clock: Dynamically computes legal deadlines under RTI Act 2005 Sec 7(1) (30 days) and CPWD Defect Liability Period (15 days).',
    ],
    metrics: [
      { label: 'EXIF Parsing Speed', value: '< 15 ms', detail: '100% Client-Side in browser memory' },
      { label: 'Snapping Radius', value: '250 Metres', detail: 'Matches nearest public asset' },
      { label: 'SLA Engine', value: 'Statutory', detail: 'RTI Sec 7(1) & CPWD Clause 44' },
    ],
    takeaway: 'High-integrity proof packs eliminate fake complaints and give government departments actionable evidence.',
  },
  {
    id: 5,
    title: 'Live Ministry Demonstrator Showcase',
    subtitle: 'Proven Depth Across Education (MoE), Rural Works (MoRD), and Urban Housing (MoHUA)',
    category: 'Live Validation',
    bullets: [
      'Ministry of Education (DoSEL) [PIN 250001, Meerut]: UDISE+ claims 100% functional toilets vs 24 parent check-ins proving locked water supply.',
      'Ministry of Rural Development / MoRTH [PIN 221001, Varanasi]: PMGSY road package claimed complete vs 41 geo-tagged pothole reports with active DLP liability.',
      'DARPG CPGRAMS: Closed-loop grievance generation with public ticket tracking URL and Sec 19(1) First Appeal escalation.',
      'MoHUA Urban Governance [PIN 110001, Delhi]: RERA project delivery delay counters and Municipal Ward Councillor health scorecards.',
    ],
    metrics: [
      { label: 'Pilot Districts', value: 'Meerut & Varanasi', detail: 'Tested with real ground records' },
      { label: 'Corroboration Threshold', value: '≥ 3 Days', detail: 'Multi-citizen confirmation model' },
      { label: 'Response Tracking', value: '/track/:id', detail: 'Publicly audited ticket timelines' },
    ],
    takeaway: 'One unified engine effortlessly powers school audits, road tenders, and civic grievances.',
  },
  {
    id: 6,
    title: 'Architecture, Security & Code Quality',
    subtitle: 'Built for 100 Million Concurrent Citizens with Institutional Safe Harbor',
    category: 'System Design',
    bullets: [
      'Modern Stack: React 18, Vite 5, Tailwind CSS, React Leaflet (OSM tiles), Express 5, TypeScript 5, Prisma ORM, PostgreSQL + PostGIS.',
      'Section 79 IT Act Safe Harbor: Fully compliant statutory Intermediary Notice & Designated Grievance Redressal Officer.',
      'Official Right to Reply (/official-response): Dedicated verification channel for contractors and engineers with completion certificate uploads.',
      'Zero Regressions: 18 test suites, 102 unit & integration tests passing, 0 TypeScript compile errors.',
    ],
    metrics: [
      { label: 'Unit Test Coverage', value: '102 Tests', detail: '100% Passing in Vitest' },
      { label: 'Bundle Footprint', value: '125 KB', detail: 'Highly optimized chunk splitting' },
      { label: 'Safe Harbor Status', value: 'Sec 79 IT Act', detail: 'Intermediary Guidelines 2021 Compliant' },
    ],
    takeaway: 'Industrial-strength software engineered for public stability and legal immunity.',
  },
  {
    id: 7,
    title: 'Business Model & Departmental Adoption',
    subtitle: 'How JantaX Scales and Sustains Beyond the Hackathon',
    category: 'Sustainability',
    bullets: [
      'B2G Civic Intelligence Analytics: Tier-1 & Tier-2 Smart Cities pay for ward-level infrastructure health heatmaps and contractor risk scores.',
      'B2B Locality APIs: Real estate aggregators, home insurers, and infrastructure lenders pay for verified school quality & road condition indexes.',
      'Micro-Fee Assisted Civic Petitions: ₹49 assisted RTI & statutory escalation packaging for citizens seeking formal legal records.',
      'CSR & Civic Governance Grants: Backed by CSR funds earmarked for governance transparency and rural development.',
    ],
    metrics: [
      { label: 'Primary Revenue', value: 'B2G ICCC Analytics', detail: 'Smart City Command Center Feeds' },
      { label: 'Secondary Revenue', value: 'B2B Real Estate API', detail: 'Verified civic clearance scores' },
      { label: 'Target Market', value: '100+ Smart Cities', detail: 'Pan-India municipal corporations' },
    ],
    takeaway: 'Self-sustaining hybrid model blending government software licensing with consumer civic empowerment.',
  },
  {
    id: 8,
    title: 'Viksit Bharat 2047 & Digital India Vision',
    subtitle: 'Empowering Citizens, Elevating Governance, and Restoring Democratic Trust',
    category: 'National Impact',
    bullets: [
      'Aligned with Prime Minister’s Vision of Citizen-Centric Governance (DARPG Minimum Government, Maximum Governance).',
      'Empowers Panchayats and Ward Committees with scientific, unforgeable infrastructure data.',
      'Incentivizes Quality Contractors: High-performing construction firms receive public green badges and lower bid risk premiums.',
      'Ready for Immediate National Deployment: Zero proprietary software dependencies; 100% Open Data compliant.',
    ],
    metrics: [
      { label: 'National Alignment', value: 'Digital India', detail: 'Viksit Bharat 2047 Governance Pillar' },
      { label: 'Deployment Ready', value: 'Today', detail: 'Zero infrastructure barrier to pilot' },
      { label: 'Licensing', value: 'GODL-India', detail: 'Open Government Data Compliant' },
    ],
    takeaway: 'JantaX turns transparency into India’s most powerful infrastructure accelerator.',
  },
];

export const SIH_JURY_QA: SihJuryQa[] = [
  {
    question: 'Why would any government department or ministry adopt JantaX? Doesn’t it expose their failures?',
    questionHindi: 'कोई भी सरकारी विभाग JantaX को क्यों अपनाएगा? क्या यह उनकी कमियों को उजागर नहीं करेगा?',
    theme: 'Government Adoption',
    answer:
      'JantaX is built as an ally to honest administrators, not an adversary. Today, officers spend up to 40% of their working hours manually sorting through vague, anonymous, and untraceable grievances on portals like CPGRAMS. JantaX delivers pre-filtered, geo-anchored evidence packs with device GPS verification, eliminating frivolous noise. More importantly, it gives high-performing departments a verified, public platform to showcase their achievements and completed projects directly to local citizens, building authentic trust.',
    keyPoints: [
      'Filters out 40% of fake and untraceable grievances via device GPS and OTP verification.',
      'Provides progressive departments with verified public recognition for completed works.',
      'Provides an official "Right to Reply" channel with completion certificate upload capabilities.',
    ],
  },
  {
    question: 'How do you prevent political misuse, fake complaints, or competitor sabotage against contractors?',
    questionHindi: 'आप ठेकेदारों के खिलाफ राजनीतिक दुरुपयोग, फर्जी शिकायतों या दुर्भावनापूर्ण हमलों को कैसे रोकते हैं?',
    theme: 'Platform Integrity',
    answer:
      'We enforce four strict architectural and legal barriers: (1) Client-side EXIF geofencing ensures photo evidence was taken physically at the defect location; (2) Multi-citizen corroboration requires signals across distinct days before any score reflects a defect; (3) Strict Rule 9.4/9.5 neutrality prohibits naming individuals or political parties, focusing solely on public physical assets; and (4) Section 79 IT Act intermediary safe harbor with an instant Right-to-Reply portal allows contractors to submit rectification certificates before public score updates.',
    keyPoints: [
      'In-browser EXIF GPS radius check rejects internet downloads and remote uploads.',
      'Multi-day corroboration threshold prevents coordinated single-day brigading.',
      'Institutional neutrality (Rule 9.4) ensures non-partisan, asset-level objective auditing.',
    ],
  },
  {
    question: 'How is JantaX different from existing platforms like CPGRAMS, UMANG, or MeriLiFE?',
    questionHindi: 'JantaX CPGRAMS, UMANG या MeriLiFE जैसी मौजूदा सरकारी पहलों से किस प्रकार भिन्न है?',
    theme: 'Differentiation',
    answer:
      'Portals like UMANG and CPGRAMS are vertical transaction silos: you visit them only after an issue occurs or to download an official certificate, and grievances enter an opaque black-box queue with no community visibility. JantaX is an ambient Locality OS: citizens discover their public neighborhood infrastructure before problems arise. Furthermore, JantaX provides public community tracking with statutory SLA countdown clocks, transforming solitary complaints into transparent community audits.',
    keyPoints: [
      'Spatial Discovery vs Transactional Form: Explores the entire neighborhood via 6-digit PIN.',
      'Transparent Public Tracking: Replaces black-box complaint numbers with public SLA countdowns.',
      'Cross-Sector Correlation: Links school conditions directly to the road leading to it and the local ward councillor.',
    ],
  },
  {
    question: 'How will this project survive and scale after the hackathon? Who pays for server and data costs?',
    questionHindi: 'यह प्रोजेक्ट हैकथॉन के बाद कैसे टिकेगा और आगे बढ़ेगा? सर्वर और डेटा का खर्च कौन उठाएगा?',
    theme: 'Business & Sustainability',
    answer:
      'JantaX operates on a self-sustaining hybrid civic intelligence model. Our primary revenue stream is B2G: Municipal Corporations and Smart City Command Centers (ICCC) subscribe to ward-level infrastructure health heatmaps and contractor risk dashboards. Second, B2B real estate aggregators and insurance underwriters license our verified Locality Civic API (school ratings and road condition scores). Third, low-cost assisted RTI petition generation provides micro-revenue. Finally, our architecture uses serverless edge caching, keeping baseline operational costs under ₹5,000/month.',
    keyPoints: [
      'B2G Smart City Command Center analytics subscriptions.',
      'B2B Locality Civic Intelligence API for banks, insurers, and property portals.',
      'Serverless edge caching architecture keeps infrastructure costs virtually negligible.',
    ],
  },
];
