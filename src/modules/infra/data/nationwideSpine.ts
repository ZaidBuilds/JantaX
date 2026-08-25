import { Representative, Fund, ProjectNode, ContractorNode } from '../../../core/types/spine';
import { resolvePincode, getDeterministicIndex } from '../../../core/utils/pinResolver';
import { representatives as meerutReps, funds as meerutFunds, projects as meerutProjs, contractors as meerutConts } from './meerutData';
import { getUpdatedProjects } from '../../../core/utils/autoUpdater';

// Regional name pools to maintain geographic credibility
const FIRST_NAMES: Record<string, string[]> = {
  North: ['राजेश', 'संजय', 'अमित', 'दिनेश', 'रमेश', 'सुनील', 'विजय', 'सतीश', 'राकेश', 'मनोज'],
  South: ['वेंकटेश', 'सुब्रह्मण्यम', 'रंगराजन', 'मूर्ती', 'कृष्णप्पा', 'राघवन', 'बालन', 'शेखर', 'नायडू', 'रेड्डी'],
  East: ['सुब्रत', 'तपन', 'अनिल', 'अजय', 'मनोज', 'प्रसन्न', 'तपस', 'देबाशीष', 'रंजीत', 'बिकास'],
  West: ['अनिल', 'प्रमोद', 'संजय', 'विजय', 'राधाकृष्ण', 'यशवंत', 'दिलीप', 'बाळासाहेब', 'उद्धव', 'ज्ञानेश्वर'],
  Central: ['रामगोपाल', 'शिवराज', 'कमलनाथ', 'दिग्विजय', 'अखिलेश', 'मायावती', 'मुलायम', 'भूपेश', 'रमन', 'अर्जुन'],
};

const LAST_NAMES: Record<string, string[]> = {
  North: ['शर्मा', 'सिंह', 'तोमर', 'यादव', 'गुप्ता', 'तिवारी', 'वर्मा', 'खटीक', 'मिश्रा', 'चौधरी'],
  South: ['रविचंद्रन', 'मल्लाप्पा', 'अय्यर', 'गौड़ा', 'रेड्डी', 'नायर', 'राजू', 'चंद्रशेखर', 'पिल्लई', 'सुब्रमण्यम'],
  East: ['बनर्जी', 'घोष', 'सेन', 'झा', 'मजूमदार', 'सिन्हा', 'महतो', 'पात्रा', 'दास', 'उरांव'],
  West: ['पाटील', 'देशमुख', 'फडणवीस', 'पाटिल', 'जोशी', 'शिंदे', 'सावंत', 'पटेल', 'शाह', 'मेहता'],
  Central: ['चौहान', 'शुक्ला', 'बघेल', 'दुबे', 'पाण्डेय', 'सक्सेना', 'दीक्षित', 'द्विवेदी', 'मिश्रा', 'यादव'],
};

const VILLAGE_PREFIXES = ['रामपुर', 'कल्याणपुर', 'गोपालपुर', 'हरिपुर', 'शिवपुर', 'मोहनपुर', 'कृष्णपुर', 'अंबेडकर नगर', 'गांधी नगर', 'सुभाष नगर'];
const SCHEMES = [
  { name: '15th Finance Commission Tied Grant', nameHi: '15वां वित्त आयोग बंधा हुआ अनुदान' },
  { name: 'Swachh Bharat Mission (Grameen) Sanitation Fund', nameHi: 'स्वच्छ भारत मिशन (ग्रामीण) स्वच्छता कोष' },
  { name: 'Jal Jeevan Mission Feeder Development', nameHi: 'जल जीवन मिशन फीडर विकास निधि' },
  { name: 'Rashtriya Gram Swaraj Abhiyan Infrastructure Support', nameHi: 'राष्ट्रीय ग्राम स्वराज अभियान अवसंरचना सहायता' },
];

const PROJECT_TEMPLATES = [
  { en: 'Paving of Interlocking Tiles in Main Road', hi: 'मुख्य मार्ग में इंटरलॉकिंग टाइल्स बिछाना', cost: 12 },
  { en: 'Construction of Concrete Drain Line & Culvert', hi: 'कंक्रीट नाली लाइन और पुलिया का निर्माण', cost: 18 },
  { en: 'Installation of Solar Submersible Drinking Water Pump', hi: 'सोलर सबमर्सिबल पेयजल पंप की स्थापना', cost: 8 },
  { en: 'Renovation & Boundary Wall Construction of Panchayat Office', hi: 'पंचायत कार्यालय का नवीनीकरण एवं चारदीवारी निर्माण', cost: 15 },
  { en: 'Retrofitting of Toilets in Local Government Primary School', hi: 'स्थानीय सरकारी प्राथमिक विद्यालय में शौचालयों का नवीनीकरण', cost: 6 },
];

const CONTRACTORS_POOL = ['शर्मा कंस्ट्रक्शंस', 'रॉयल बिल्डर्स', 'बालाजी इंफ्रास्ट्रक्चर', 'तोमर एंटरप्राइजेज', 'यूनिक बिल्डकॉन', 'चौधरी ब्रदर्स', 'पटेल रोडवर्कर्स'];

export interface SpineData {
  representatives: Representative[];
  funds: Fund[];
  projects: ProjectNode[];
  contractors: ContractorNode[];
}

export function getSpineDataForPincode(pinCode: string): SpineData {
  // If it's a Meerut PIN code, return the handcrafted Meerut data
  if (pinCode.startsWith('250')) {
    return {
      representatives: meerutReps,
      funds: meerutFunds,
      projects: meerutProjs,
      contractors: meerutConts,
    };
  }

  const loc = resolvePincode(pinCode);
  const region = loc.region;

  // Derive regional pools
  const firstNames = FIRST_NAMES[region] || FIRST_NAMES.North;
  const lastNames = LAST_NAMES[region] || LAST_NAMES.North;

  // Helper to generate a deterministic name
  const makeName = (seed: string) => {
    const fnIdx = getDeterministicIndex(seed + 'first', firstNames.length);
    const lnIdx = getDeterministicIndex(seed + 'last', lastNames.length);
    const fn = firstNames[fnIdx];
    const ln = lastNames[lnIdx];
    return {
      nameHi: `श्री ${fn} ${ln}`,
      nameEn: `Shri ${fn} ${ln}`, // Simplified english fallback
    };
  };

  // 1. Generate Representatives
  const mpSeed = pinCode.substring(0, 3) + '-mp';
  const mpName = makeName(mpSeed);
  const mp: Representative = {
    id: `rep-mp-${pinCode}`,
    name: mpName.nameEn,
    nameHi: mpName.nameHi,
    level: 'union',
    party: getDeterministicIndex(mpSeed + 'party', 2) === 0 ? 'BJP' : 'INC',
    constituencyName: `${loc.district} Lok Sabha`,
    constituencyNameHi: `${loc.district} लोकसभा निर्वाचन क्षेत्र`,
    pinCodes: [pinCode],
  };

  const mlaSeed = pinCode.substring(0, 4) + '-mla';
  const mlaName = makeName(mlaSeed);
  const mla: Representative = {
    id: `rep-mla-${pinCode}`,
    name: mlaName.nameEn,
    nameHi: mlaName.nameHi,
    level: 'state',
    party: getDeterministicIndex(mlaSeed + 'party', 3) === 0 ? 'BJP' : getDeterministicIndex(mlaSeed + 'party', 3) === 1 ? 'INC' : 'Regional',
    constituencyName: `${loc.district} Assembly`,
    constituencyNameHi: `${loc.district} विधानसभा निर्वाचन क्षेत्र`,
    pinCodes: [pinCode],
  };

  const zpSeed = pinCode.substring(0, 4) + '-zp';
  const zpName = makeName(zpSeed);
  const zp: Representative = {
    id: `rep-zp-${pinCode}`,
    name: zpName.nameEn,
    nameHi: zpName.nameHi,
    level: 'district',
    party: 'BJP',
    constituencyName: `${loc.district} Zilla Parishad`,
    constituencyNameHi: `${loc.district} जिला पंचायत`,
    pinCodes: [pinCode],
  };

  const bpSeed = pinCode.substring(0, 5) + '-bp';
  const bpName = makeName(bpSeed);
  const bp: Representative = {
    id: `rep-bp-${pinCode}`,
    name: bpName.nameEn,
    nameHi: bpName.nameHi,
    level: 'block',
    party: 'IND',
    constituencyName: `${loc.district} Block Samiti`,
    constituencyNameHi: `${loc.district} ब्लॉक पंचायत समिति`,
    pinCodes: [pinCode],
  };

  const gpSeed = pinCode + '-gp';
  const gpName = makeName(gpSeed);
  const gpVillageIdx = getDeterministicIndex(gpSeed + 'village', VILLAGE_PREFIXES.length);
  const gpVillage = VILLAGE_PREFIXES[gpVillageIdx];
  const gp: Representative = {
    id: `rep-gp-${pinCode}`,
    name: gpName.nameEn,
    nameHi: gpName.nameHi,
    level: 'village',
    party: 'IND',
    constituencyName: `${gpVillage} Gram Panchayat`,
    constituencyNameHi: `${gpVillage} ग्राम पंचायत`,
    pinCodes: [pinCode],
  };

  const reps = [mp, mla, zp, bp, gp];

  // 2. Generate Funds
  const fundsList: Fund[] = [];
  reps.forEach(rep => {
    const fSeed = rep.id + '-fund';
    const amount = rep.level === 'union' ? 5.0 : rep.level === 'state' ? 3.0 : rep.level === 'district' ? 8.0 : rep.level === 'block' ? 1.5 : 0.4;
    const schemeIdx = getDeterministicIndex(fSeed, SCHEMES.length);
    const scheme = SCHEMES[schemeIdx];
    fundsList.push({
      id: `fund-${rep.id}`,
      representativeId: rep.id,
      schemeName: rep.level === 'union' ? 'MPLADS Fund' : rep.level === 'state' ? 'MLALADS Fund' : scheme.name,
      schemeNameHi: rep.level === 'union' ? 'सांसद क्षेत्रीय विकास निधि (MPLADS)' : rep.level === 'state' ? 'विधायक क्षेत्रीय विकास निधि (MLALADS)' : scheme.nameHi,
      amountSanctionedCr: amount,
      financialYear: '2025-26',
    });
  });

  // 3. Generate Projects and Contractors
  const projectsList: ProjectNode[] = [];
  const contractorsList: ContractorNode[] = [];

  fundsList.forEach((fund, fIdx) => {
    const pSeed = fund.id + '-project';
    const templateIdx = getDeterministicIndex(pSeed, PROJECT_TEMPLATES.length);
    const template = PROJECT_TEMPLATES[templateIdx];
    
    const projId = `proj-${fund.id}`;
    const statusVal = getDeterministicIndex(pSeed + 'status', 3);
    const status: 'completed' | 'in-progress' | 'stalled' = statusVal === 0 ? 'completed' : statusVal === 1 ? 'in-progress' : 'stalled';
    const statusHi = status === 'completed' ? 'पूर्ण हुआ (Completed)' : status === 'in-progress' ? 'काम चालू है (In Progress)' : 'रुका हुआ (Stalled)';

    // Deterministic contractor assignment (to create cross-referencing alerts!)
    const contIdx = getDeterministicIndex(pSeed + 'contractor', CONTRACTORS_POOL.length);
    const contName = CONTRACTORS_POOL[contIdx];
    const contId = `cont-${fund.id}`;

    projectsList.push({
      id: projId,
      fundId: fund.id,
      workName: template.en,
      workNameHi: template.hi,
      sanctionedCostLakhs: template.cost,
      status,
      statusHi,
      realityTextHi: status === 'completed' ? 'काम पूर्ण है और उपयोग किया जा रहा है।' : status === 'in-progress' ? 'मजदूर काम कर रहे हैं, काम धीमी गति से चल रहा है।' : 'पिछले २ महीने से कोई मजदूर नहीं देखा गया। काम पूरी तरह ठप्प है।',
      realityTextEn: status === 'completed' ? 'Work complete and utilized by locals.' : status === 'in-progress' ? 'Laborers working, progress is slow.' : 'No workers seen for past 2 months. Completely stalled.',
    });

    contractorsList.push({
      id: contId,
      projectId: projId,
      name: contName,
      nameHi: contName,
      registrationNumber: `GSTIN: 09${pinCode}A1Z${fIdx}`,
      paymentStatus: getDeterministicIndex(pSeed + 'pay', 2) === 0 ? 'paid' : 'pending',
      pastProjectsCount: getDeterministicIndex(pSeed + 'past', 20) + 2,
    });
  });

  return {
    representatives: reps,
    funds: fundsList,
    projects: getUpdatedProjects(projectsList),
    contractors: contractorsList,
  };
}
