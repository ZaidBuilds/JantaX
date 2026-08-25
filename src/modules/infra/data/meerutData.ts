import { Representative, Fund, ProjectNode, ContractorNode } from '../../../core/types/spine';

// ─── REPRESENTATIVES (MP, MLA, District, Block, Village) ───
export const representatives: Representative[] = [
  // 1. Union level (MP)
  {
    id: 'rep-mp-meerut',
    name: 'Shri Arun Govil',
    nameHi: 'श्री अरुण गोविल',
    level: 'union',
    party: 'BJP',
    constituencyName: 'Meerut Lok Sabha',
    constituencyNameHi: 'मेरठ लोकसभा निर्वाचन क्षेत्र',
    pinCodes: ['250001', '250002', '250003', '250004', '250110', '250401', '250341', '250342'],
  },
  // 2. State level (MLA)
  {
    id: 'rep-mla-sardhana',
    name: 'Shri Atul Pradhan',
    nameHi: 'श्री अतुल प्रधान',
    level: 'state',
    party: 'SP',
    constituencyName: 'Sardhana Assembly',
    constituencyNameHi: 'सरधना विधानसभा निर्वाचन क्षेत्र',
    pinCodes: ['250342', '250341'],
  },
  {
    id: 'rep-mla-hastinapur',
    name: 'Shri Dinesh Khatik',
    nameHi: 'श्री दिनेश खटीक',
    level: 'state',
    party: 'BJP',
    constituencyName: 'Hastinapur Assembly',
    constituencyNameHi: 'हस्तिनापुर विधानसभा निर्वाचन क्षेत्र',
    pinCodes: ['250401', '250402'],
  },
  // 3. District level (Zilla Parishad Chairperson)
  {
    id: 'rep-zp-meerut',
    name: 'Smt. Gaurav Chaudhary',
    nameHi: 'श्रीमती गौरव चौधरी',
    level: 'district',
    party: 'BJP',
    constituencyName: 'Meerut Zilla Parishad',
    constituencyNameHi: 'मेरठ जिला पंचायत',
    pinCodes: ['250001', '250401', '250341', '250342'],
  },
  // 4. Block level (Panchayat Samiti Pramukh)
  {
    id: 'rep-bp-mawana',
    name: 'Smt. Gita Devi',
    nameHi: 'श्रीमती गीता देवी',
    level: 'block',
    party: 'BJP',
    constituencyName: 'Mawana Block Samiti',
    constituencyNameHi: 'मवाना ब्लॉक पंचायत समिति',
    pinCodes: ['250401'],
  },
  {
    id: 'rep-bp-sardhana',
    name: 'Shri Manoj Tomar',
    nameHi: 'श्री मनोज तोमर',
    level: 'block',
    party: 'IND',
    constituencyName: 'Sardhana Block Samiti',
    constituencyNameHi: 'सरधना ब्लॉक पंचायत समिति',
    pinCodes: ['250342'],
  },
  // 5. Village level (Gram Panchayat Sarpanch/Pradhan)
  {
    id: 'rep-gp-niloha',
    name: 'Shri Ramesh Chand',
    nameHi: 'श्री रमेश चंद',
    level: 'village',
    party: 'IND',
    constituencyName: 'Niloha Gram Panchayat',
    constituencyNameHi: 'नीलोहा ग्राम पंचायत (मवाना)',
    pinCodes: ['250401'],
  },
  {
    id: 'rep-gp-khaspur',
    name: 'Smt. Babita Rani',
    nameHi: 'श्रीमती बबीता रानी',
    level: 'village',
    party: 'IND',
    constituencyName: 'Khaspur Gram Panchayat',
    constituencyNameHi: 'खासपुर ग्राम पंचायत (सरधना)',
    pinCodes: ['250342'],
  },
];

// ─── FUNDS ALLOCATED ───
export const funds: Fund[] = [
  // MP funds
  {
    id: 'fund-mp-1',
    representativeId: 'rep-mp-meerut',
    schemeName: 'MPLADS (Member of Parliament Local Area Development Scheme)',
    schemeNameHi: 'सांसद स्थानीय क्षेत्र विकास योजना (MPLADS)',
    amountSanctionedCr: 5.0,
    financialYear: '2025-26',
  },
  // MLA funds
  {
    id: 'fund-mla-sardhana-1',
    representativeId: 'rep-mla-sardhana',
    schemeName: 'MLALADS (UP Vidhan Sabha Area Development Fund)',
    schemeNameHi: 'विधायक क्षेत्रीय विकास निधि (MLALADS)',
    amountSanctionedCr: 3.0,
    financialYear: '2025-26',
  },
  {
    id: 'fund-mla-hastinapur-1',
    representativeId: 'rep-mla-hastinapur',
    schemeName: 'MLALADS (UP Vidhan Sabha Area Development Fund)',
    schemeNameHi: 'विधायक क्षेत्रीय विकास निधि (MLALADS)',
    amountSanctionedCr: 3.0,
    financialYear: '2025-26',
  },
  // District funds
  {
    id: 'fund-zp-1',
    representativeId: 'rep-zp-meerut',
    schemeName: 'State Finance Commission District Development Grant',
    schemeNameHi: 'राज्य वित्त आयोग जिला विकास अनुदान',
    amountSanctionedCr: 12.5,
    financialYear: '2025-26',
  },
  // Block funds
  {
    id: 'fund-bp-mawana-1',
    representativeId: 'rep-bp-mawana',
    schemeName: 'Panchayat Samiti Devolution Fund',
    schemeNameHi: 'पंचायत समिति विकास हस्तांतरण कोष',
    amountSanctionedCr: 1.8,
    financialYear: '2025-26',
  },
  // GP funds
  {
    id: 'fund-gp-niloha-1',
    representativeId: 'rep-gp-niloha',
    schemeName: '15th Finance Commission Basic & Tied Grant',
    schemeNameHi: '15वां वित्त आयोग बुनियादी और बंधे हुए अनुदान',
    amountSanctionedCr: 0.45,
    financialYear: '2025-26',
  },
  {
    id: 'fund-gp-khaspur-1',
    representativeId: 'rep-gp-khaspur',
    schemeName: '15th Finance Commission Basic & Tied Grant',
    schemeNameHi: '15वां वित्त आयोग बुनियादी और बंधे हुए अनुदान',
    amountSanctionedCr: 0.38,
    financialYear: '2025-26',
  },
];

// ─── PROJECTS ───
export const projects: ProjectNode[] = [
  // MP Projects
  {
    id: 'proj-mp-1',
    fundId: 'fund-mp-1',
    workName: 'Solar Street Lights Installation in Meerut Rural Area',
    workNameHi: 'मेरठ ग्रामीण क्षेत्रों में सोलर स्ट्रीट लाइटों की स्थापना',
    sanctionedCostLakhs: 85.00,
    status: 'completed',
    statusHi: 'पूर्ण हुआ (Completed)',
    realityTextHi: 'सभी लाइटें स्थापित हैं और रात में काम कर रही हैं। ग्रामीणों द्वारा रिपोर्ट सत्यापित।',
    realityTextEn: 'All lights installed and functioning at night. Verified by locals.',
  },
  {
    id: 'proj-mp-2',
    fundId: 'fund-mp-1',
    workName: 'Construction of Waiting Shed at Mawana Central Bus Terminal',
    workNameHi: 'मवाना केंद्रीय बस स्टैंड पर यात्री प्रतीक्षालय का निर्माण',
    sanctionedCostLakhs: 42.50,
    status: 'stalled',
    statusHi: 'रुका हुआ (Stalled)',
    realityTextHi: 'केवल आधार खंभे खड़े हैं। पिछले 4 महीनों से ठेकेदार द्वारा काम बंद है।',
    realityTextEn: 'Only foundational pillars are standing. Work abandoned by contractor for 4 months.',
  },
  // MLA Sardhana Projects
  {
    id: 'proj-mla-sardhana-1',
    fundId: 'fund-mla-sardhana-1',
    workName: 'CC Road Construction from Sardhana Gate to Niloha Road',
    workNameHi: 'सरधना गेट से नीलोहा मार्ग तक सीसी रोड का निर्माण',
    sanctionedCostLakhs: 75.00,
    status: 'in-progress',
    statusHi: 'काम चालू है (In Progress)',
    realityTextHi: 'मिट्टी भराई का काम हो चुका है, लेकिन डामरीकरण/कंक्रीट बिछाने का काम अभी अटका है।',
    realityTextEn: 'Earthwork is done, but concreting is stuck. Slow progress reported by commuters.',
  },
  // MLA Hastinapur Projects
  {
    id: 'proj-mla-hastinapur-1',
    fundId: 'fund-mla-hastinapur-1',
    workName: 'Renovation of Community Health Center (CHC) OPD Hastinapur',
    workNameHi: 'सामुदायिक स्वास्थ्य केंद्र (CHC) ओपीडी हस्तिनापुर का नवीनीकरण',
    sanctionedCostLakhs: 60.00,
    status: 'stalled',
    statusHi: 'रुका हुआ (Stalled)',
    realityTextHi: 'दीवारों का प्लास्टर तोड़ दिया गया है, लेकिन नए उपकरणों या बिस्तरों का कोई नाम नहीं। डॉक्टर अनुपस्थित।',
    realityTextEn: 'OPD plaster has been stripped, but no new equipment or beds arrived. Doctor absent.',
  },
  // Zilla Parishad Projects
  {
    id: 'proj-zp-1',
    fundId: 'fund-zp-1',
    workName: 'Deep Borewell and Water Tank Installation in Khaspur Village',
    workNameHi: 'खासपुर गांव में गहरे बोरवेल और पानी की टंकी की स्थापना',
    sanctionedCostLakhs: 35.00,
    status: 'planned',
    statusHi: 'नियोजित (Planned)',
    realityTextHi: 'कागज़ पर टेंडर जारी हुआ है, लेकिन ज़मीन पर कोई गड्ढा नहीं खुदा है।',
    realityTextEn: 'Tender issued on paper, but no drilling started on ground.',
  },
  // Gram Panchayat Niloha Projects
  {
    id: 'proj-gp-niloha-1',
    fundId: 'fund-gp-niloha-1',
    workName: 'Construction of Panchayat Ghar boundary wall and toilet',
    workNameHi: 'पंचायत घर की चारदीवारी और शौचालय का निर्माण',
    sanctionedCostLakhs: 8.50,
    status: 'completed',
    statusHi: 'पूर्ण हुआ (Completed)',
    realityTextHi: 'चारदीवारी और शौचालय पूर्ण है, लेकिन पानी का कनेक्शन चालू नहीं हुआ है।',
    realityTextEn: 'Boundary wall and toilet block complete, but water connection not functional.',
  },
  {
    id: 'proj-gp-niloha-2',
    fundId: 'fund-gp-niloha-1',
    workName: 'Paving of Interlocking Tiles in Ambedkar Basti Street',
    workNameHi: 'अंबेडकर बस्ती की गली में इंटरलॉकिंग टाइल्स बिछाना',
    sanctionedCostLakhs: 12.00,
    status: 'stalled',
    statusHi: 'रुका हुआ (Stalled)',
    realityTextHi: 'आधे रास्ते में टाइलें बिखरी पड़ी हैं। ठेकेदार ने मजदूरों को भुगतान न मिलने पर काम रुकवाया।',
    realityTextEn: 'Tiles left scattered halfway. Contractor halted work due to non-payment of labor.',
  },
  // Gram Panchayat Khaspur Projects
  {
    id: 'proj-gp-khaspur-1',
    fundId: 'fund-gp-khaspur-1',
    workName: 'Village Drainage Nala desilting and concrete lining',
    workNameHi: 'गांव के जल निकासी नाले की गाद निकालना और कंक्रीट अस्तर',
    sanctionedCostLakhs: 14.50,
    status: 'in-progress',
    statusHi: 'काम चालू है (In Progress)',
    realityTextHi: 'नाला आधा खुदा पड़ा है जिससे पानी का बहाव अवरुद्ध हो गया है। गंदी बदबू फैल रही है।',
    realityTextEn: 'Drain half dug, causing water stagnation and foul smell in the locality.',
  },
];

// ─── CONTRACTORS ───
export const contractors: ContractorNode[] = [
  // MP Projects
  {
    id: 'cont-1',
    projectId: 'proj-mp-1',
    name: 'M/S Tomar Solar Power Solutions',
    nameHi: 'मेसर्स तोमर सोलर पावर सॉल्यूशंस',
    registrationNumber: 'GSTIN: 09AMZPT8849K1ZS',
    paymentStatus: 'paid',
    pastProjectsCount: 14,
  },
  {
    id: 'cont-2',
    projectId: 'proj-mp-2',
    name: 'Meerut Builders & Infrastructure Ltd',
    nameHi: 'मेरठ बिल्डर्स एंड इंफ्रास्ट्रक्चर लिमिटेड',
    registrationNumber: 'GSTIN: 09AAACM2231M1ZX',
    paymentStatus: 'pending',
    pastProjectsCount: 38,
  },
  // MLA Projects
  {
    id: 'cont-3',
    projectId: 'proj-mla-sardhana-1',
    name: 'Chaudhary Road Builders',
    nameHi: 'चौधरी रोड बिल्डर्स',
    registrationNumber: 'GSTIN: 09ABCPD9902L2ZD',
    paymentStatus: 'pending',
    pastProjectsCount: 8,
  },
  {
    id: 'cont-4',
    projectId: 'proj-mla-hastinapur-1',
    name: 'Sardar Medical Const. Corp.',
    nameHi: 'सरदार मेडिकल कंस्ट्रक्शन कॉर्प.',
    registrationNumber: 'GSTIN: 09APLMS1102A1ZB',
    paymentStatus: 'paid',
    pastProjectsCount: 22,
  },
  // Zilla Parishad
  {
    id: 'cont-5',
    projectId: 'proj-zp-1',
    name: 'Meerut Builders & Infrastructure Ltd',
    nameHi: 'मेरठ बिल्डर्स एंड इंफ्रास्ट्रक्चर लिमिटेड', // SAME contractor failing elsewhere!
    registrationNumber: 'GSTIN: 09AAACM2231M1ZX',
    paymentStatus: 'pending',
    pastProjectsCount: 38,
  },
  // GP Niloha
  {
    id: 'cont-6',
    projectId: 'proj-gp-niloha-1',
    name: 'Local Contractor Sh. Ram Kumar',
    nameHi: 'स्थानीय ठेकेदार श्री राम कुमार',
    registrationNumber: 'PWD-CL-4-UP-08',
    paymentStatus: 'paid',
    pastProjectsCount: 5,
  },
  {
    id: 'cont-7',
    projectId: 'proj-gp-niloha-2',
    name: 'Meerut Builders & Infrastructure Ltd',
    nameHi: 'मेरठ बिल्डर्स एंड इंफ्रास्ट्रक्चर लिमिटेड', // Cross reference link proven!
    registrationNumber: 'GSTIN: 09AAACM2231M1ZX',
    paymentStatus: 'pending',
    pastProjectsCount: 38,
  },
  // GP Khaspur
  {
    id: 'cont-8',
    projectId: 'proj-gp-khaspur-1',
    name: 'M/S Tomar Solar Power Solutions',
    nameHi: 'मेसर्स तोमर सोलर पावर सॉल्यूशंस',
    registrationNumber: 'GSTIN: 09AMZPT8849K1ZS',
    paymentStatus: 'pending',
    pastProjectsCount: 14,
  },
];
