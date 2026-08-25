export interface CpgramsMinistryRecord {
  rank: number;
  id: string;
  name: string;
  nameHi: string;
  totalGrievances: number;
  resolvedCount: number;
  pendingCount: number;
  avgDisposalDays: number;
  backlogOver30Days: number;
  worstCategoryEn: string;
  worstCategoryHi: string;
}

export interface CpgramsStateRecord {
  rank: number;
  id: string;
  name: string;
  nameHi: string;
  totalGrievances: number;
  resolvedCount: number;
  pendingCount: number;
  avgDisposalDays: number;
  backlogOver30Days: number;
  worstDistrictEn: string;
  worstDistrictHi: string;
}

export const monthlyMinistries: CpgramsMinistryRecord[] = [
  {
    rank: 1,
    id: 'min-railways',
    name: 'Ministry of Railways',
    nameHi: 'रेल मंत्रालय',
    totalGrievances: 48500,
    resolvedCount: 38200,
    pendingCount: 10300,
    avgDisposalDays: 34,
    backlogOver30Days: 4890,
    worstCategoryEn: 'Refund of Ticket Fare & Delay',
    worstCategoryHi: 'टिकट किराए की वापसी और देरी',
  },
  {
    rank: 2,
    id: 'min-finance-cbdt',
    name: 'Department of Revenue (CBDT / Income Tax)',
    nameHi: 'राजस्व विभाग (सीबीडीटी / आयकर)',
    totalGrievances: 38200,
    resolvedCount: 29000,
    pendingCount: 9200,
    avgDisposalDays: 29,
    backlogOver30Days: 3100,
    worstCategoryEn: 'Delay in Income Tax Refunds',
    worstCategoryHi: 'आयकर रिफंड में देरी',
  },
  {
    rank: 3,
    id: 'min-labour',
    name: 'Ministry of Labour & Employment (EPFO)',
    nameHi: 'श्रम और रोजगार मंत्रालय (ईपीएफओ)',
    totalGrievances: 44100,
    resolvedCount: 35000,
    pendingCount: 9100,
    avgDisposalDays: 27,
    backlogOver30Days: 2840,
    worstCategoryEn: 'EPF Withdrawal & Pension Settlement Delay',
    worstCategoryHi: 'ईपीएफ निकासी और पेंशन निपटान में देरी',
  },
  {
    rank: 4,
    id: 'min-posts',
    name: 'Department of Posts',
    nameHi: 'डाक विभाग',
    totalGrievances: 15400,
    resolvedCount: 12100,
    pendingCount: 3300,
    avgDisposalDays: 22,
    backlogOver30Days: 980,
    worstCategoryEn: 'Savings Bank Account & Claims Settlement',
    worstCategoryHi: 'बचत बैंक खाता और दावों का निपटान',
  },
  {
    rank: 5,
    id: 'min-home',
    name: 'Ministry of Home Affairs',
    nameHi: 'गृह मंत्रालय',
    totalGrievances: 12900,
    resolvedCount: 10400,
    pendingCount: 2500,
    avgDisposalDays: 25,
    backlogOver30Days: 740,
    worstCategoryEn: 'Police Administration & Grievances',
    worstCategoryHi: 'पुलिस प्रशासन और शिकायतें',
  },
];

export const monthlyStates: CpgramsStateRecord[] = [
  {
    rank: 1,
    id: 'state-up',
    name: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    totalGrievances: 124500,
    resolvedCount: 98100,
    pendingCount: 26400,
    avgDisposalDays: 42,
    backlogOver30Days: 11200,
    worstDistrictEn: 'Lucknow Rural / Varanasi',
    worstDistrictHi: 'लखनऊ ग्रामीण / वाराणसी',
  },
  {
    rank: 2,
    id: 'state-bihar',
    name: 'Bihar',
    nameHi: 'बिहार',
    totalGrievances: 88400,
    resolvedCount: 65200,
    pendingCount: 23200,
    avgDisposalDays: 38,
    backlogOver30Days: 9800,
    worstDistrictEn: 'Patna Central / Gaya',
    worstDistrictHi: 'पटना सेंट्रल / गया',
  },
  {
    rank: 3,
    id: 'state-wb',
    name: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    totalGrievances: 64100,
    resolvedCount: 48900,
    pendingCount: 15200,
    avgDisposalDays: 35,
    backlogOver30Days: 6100,
    worstDistrictEn: 'North 24 Parganas / Howrah',
    worstDistrictHi: 'उत्तर २४ परगना / हावड़ा',
  },
  {
    rank: 4,
    id: 'state-mh',
    name: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    totalGrievances: 75200,
    resolvedCount: 61000,
    pendingCount: 14200,
    avgDisposalDays: 31,
    backlogOver30Days: 5200,
    worstDistrictEn: 'Pune / Mumbai Suburbs',
    worstDistrictHi: 'पुणे / मुंबई उपनगर',
  },
];
