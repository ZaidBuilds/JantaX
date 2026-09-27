/**
 * Who governs a place in India, from the Union down to the ward or village, and the departments
 * that do the work. This is the structure only: roles and bodies, never named office-holders.
 *
 * Levels follow the Constitution: the Union and the states (Seventh Schedule), district
 * administration, rural local bodies (Part IX, 73rd Amendment) and urban local bodies (Part IXA,
 * 74th Amendment). State-by-state names live in ./localNames.ts.
 *
 * To add a body, add one entry here; to route an issue to it, reference its id in ./issues.ts.
 */

export interface Bi {
  en: string;
  hi: string;
}

export type Level = 'union' | 'state' | 'district' | 'local' | 'ward' | 'department';
export type AreaType = 'urban' | 'rural';

export interface Role {
  title: Bi;
  /** How the person gets the post. */
  how: Bi;
}

export interface Contact {
  label: Bi;
  url?: string;
  phone?: string;
}

export interface Body {
  id: string;
  level: Level;
  /** Only part of the urban or rural chain. */
  area?: AreaType;
  name: Bi;
  about: Bi;
  elected?: Role;
  official?: Role;
  handles: Bi[];
  contact?: Contact;
  basis?: Bi;
}

const ELECTED_BY_VOTERS: Bi = { en: 'Elected by voters every 5 years', hi: 'मतदाता हर 5 साल में चुनते हैं' };
const APPOINTED_IAS: Bi = { en: 'Appointed officer, usually from the IAS', hi: 'नियुक्त अधिकारी, प्रायः IAS' };
const APPOINTED_STATE: Bi = { en: 'Appointed by the state government', hi: 'राज्य सरकार द्वारा नियुक्त' };

export const BODIES: Record<string, Body> = {
  'union-government': {
    id: 'union-government',
    level: 'union',
    name: { en: 'Government of India', hi: 'भारत सरकार' },
    about: { en: 'Runs subjects on the Union List and funds most national schemes that states and panchayats carry out.', hi: 'संघ सूची के विषय चलाती है और ज़्यादातर राष्ट्रीय योजनाओं का पैसा देती है, जिन्हें राज्य और पंचायतें लागू करती हैं।' },
    elected: { title: { en: 'Prime Minister and Union ministers', hi: 'प्रधानमंत्री और केंद्रीय मंत्री' }, how: { en: 'Lead the party or alliance with a Lok Sabha majority', hi: 'लोकसभा में बहुमत वाले दल या गठबंधन से' } },
    official: { title: { en: 'Secretaries of Union ministries', hi: 'केंद्रीय मंत्रालयों के सचिव' }, how: APPOINTED_IAS },
    handles: [
      { en: 'National highways', hi: 'राष्ट्रीय राजमार्ग' },
      { en: 'Railways, post and telecom', hi: 'रेल, डाक और दूरसंचार' },
      { en: 'Income tax and GST', hi: 'आयकर और GST' },
      { en: 'Funding for MGNREGA, PMGSY, Jal Jeevan Mission', hi: 'मनरेगा, PMGSY, जल जीवन मिशन का पैसा' },
      { en: 'Passports and defence', hi: 'पासपोर्ट और रक्षा' },
    ],
    contact: { label: { en: 'Central grievance portal (CPGRAMS)', hi: 'केंद्रीय शिकायत पोर्टल (CPGRAMS)' }, url: 'https://pgportal.gov.in' },
    basis: { en: 'Constitution, Seventh Schedule, Union List', hi: 'संविधान, सातवीं अनुसूची, संघ सूची' },
  },
  mp: {
    id: 'mp',
    level: 'union',
    name: { en: 'Member of Parliament (Lok Sabha)', hi: 'सांसद (लोकसभा)' },
    about: { en: 'Represents your Lok Sabha constituency in Parliament and can recommend local works worth ₹5 crore a year under MPLADS.', hi: 'संसद में आपके लोकसभा क्षेत्र का प्रतिनिधित्व करते हैं और MPLADS के तहत हर साल ₹5 करोड़ तक के स्थानीय काम सुझा सकते हैं।' },
    elected: { title: { en: 'MP', hi: 'सांसद' }, how: ELECTED_BY_VOTERS },
    handles: [
      { en: 'Questions and debates in Parliament', hi: 'संसद में सवाल और बहस' },
      { en: 'MPLADS works in the constituency', hi: 'क्षेत्र में MPLADS के काम' },
      { en: 'Taking up central issues with ministries', hi: 'केंद्रीय मुद्दे मंत्रालयों के सामने उठाना' },
    ],
    contact: { label: { en: 'Find your MP on sansad.in', hi: 'sansad.in पर अपने सांसद खोजें' }, url: 'https://sansad.in/ls/members' },
    basis: { en: 'Article 81; MPLADS guidelines', hi: 'अनुच्छेद 81; MPLADS दिशानिर्देश' },
  },
  'rajya-sabha-mp': {
    id: 'rajya-sabha-mp',
    level: 'union',
    name: { en: 'Rajya Sabha MPs from your state', hi: 'आपके राज्य के राज्यसभा सांसद' },
    about: { en: 'Elected by the state’s MLAs. They also get MPLADS funds and can recommend works anywhere in the state.', hi: 'राज्य के विधायक इन्हें चुनते हैं। इन्हें भी MPLADS निधि मिलती है और ये राज्य में कहीं भी काम सुझा सकते हैं।' },
    elected: { title: { en: 'Rajya Sabha MP', hi: 'राज्यसभा सांसद' }, how: { en: 'Elected by the state’s MLAs for 6 years', hi: 'राज्य के विधायक 6 साल के लिए चुनते हैं' } },
    handles: [{ en: 'MPLADS works across the state', hi: 'पूरे राज्य में MPLADS के काम' }],
    contact: { label: { en: 'Rajya Sabha members list', hi: 'राज्यसभा सदस्यों की सूची' }, url: 'https://sansad.in/rs/members' },
    basis: { en: 'Article 80', hi: 'अनुच्छेद 80' },
  },
  'state-government': {
    id: 'state-government',
    level: 'state',
    name: { en: 'State government', hi: 'राज्य सरकार' },
    about: { en: 'Runs most services people use every day: police, hospitals, schools, state roads, water, electricity and land records.', hi: 'रोज़मर्रा की ज़्यादातर सेवाएँ चलाती है: पुलिस, अस्पताल, स्कूल, राज्य की सड़कें, पानी, बिजली और भूमि रिकॉर्ड।' },
    elected: { title: { en: 'Chief Minister and state ministers', hi: 'मुख्यमंत्री और राज्य के मंत्री' }, how: { en: 'Lead the party or alliance with an assembly majority', hi: 'विधानसभा में बहुमत वाले दल या गठबंधन से' } },
    official: { title: { en: 'Chief Secretary and department secretaries', hi: 'मुख्य सचिव और विभागों के सचिव' }, how: APPOINTED_IAS },
    handles: [
      { en: 'Police and public order', hi: 'पुलिस और कानून-व्यवस्था' },
      { en: 'Government hospitals and schools', hi: 'सरकारी अस्पताल और स्कूल' },
      { en: 'State highways (through PWD)', hi: 'राज्य राजमार्ग (लोक निर्माण विभाग के ज़रिए)' },
      { en: 'Land records and revenue', hi: 'भूमि रिकॉर्ड और राजस्व' },
      { en: 'Ration (public distribution)', hi: 'राशन (सार्वजनिक वितरण प्रणाली)' },
    ],
    contact: { label: { en: 'Your state’s CM helpline or public grievance portal', hi: 'आपके राज्य की मुख्यमंत्री हेल्पलाइन या जन शिकायत पोर्टल' } },
    basis: { en: 'Constitution, Seventh Schedule, State List', hi: 'संविधान, सातवीं अनुसूची, राज्य सूची' },
  },
  governor: {
    id: 'governor',
    level: 'state',
    name: { en: 'Governor', hi: 'राज्यपाल' },
    about: { en: 'Constitutional head of the state, appointed by the President. In Delhi and other UTs the Lieutenant Governor or Administrator plays this role and has more direct powers.', hi: 'राज्य के संवैधानिक प्रमुख, जिन्हें राष्ट्रपति नियुक्त करते हैं। दिल्ली और अन्य केंद्रशासित प्रदेशों में उपराज्यपाल या प्रशासक यह भूमिका निभाते हैं और उनके अधिकार ज़्यादा सीधे होते हैं।' },
    official: { title: { en: 'Governor, Lieutenant Governor or Administrator', hi: 'राज्यपाल, उपराज्यपाल या प्रशासक' }, how: { en: 'Appointed by the President', hi: 'राष्ट्रपति द्वारा नियुक्त' } },
    handles: [{ en: 'Assent to state laws', hi: 'राज्य के कानूनों को मंज़ूरी' }, { en: 'Heads state universities', hi: 'राज्य विश्वविद्यालयों के कुलाधिपति' }],
    basis: { en: 'Articles 153 and 239', hi: 'अनुच्छेद 153 और 239' },
  },
  'ut-administration': {
    id: 'ut-administration',
    level: 'state',
    name: { en: 'Union territory administration', hi: 'केंद्रशासित प्रदेश प्रशासन' },
    about: { en: 'This union territory has no legislature of its own, so the Union government runs it through an Administrator or Lieutenant Governor. There is no MLA.', hi: 'इस केंद्रशासित प्रदेश की अपनी विधानसभा नहीं है, इसलिए केंद्र सरकार इसे प्रशासक या उपराज्यपाल के ज़रिए चलाती है। यहाँ विधायक नहीं होते।' },
    official: { title: { en: 'Administrator or Lieutenant Governor, with an Adviser and secretaries', hi: 'प्रशासक या उपराज्यपाल, सलाहकार और सचिवों के साथ' }, how: { en: 'Appointed by the President', hi: 'राष्ट्रपति द्वारा नियुक्त' } },
    handles: [{ en: 'Everything a state government would', hi: 'वे सभी काम जो राज्य सरकार करती है' }],
    contact: { label: { en: 'Central grievance portal (CPGRAMS)', hi: 'केंद्रीय शिकायत पोर्टल (CPGRAMS)' }, url: 'https://pgportal.gov.in' },
    basis: { en: 'Article 239', hi: 'अनुच्छेद 239' },
  },
  mla: {
    id: 'mla',
    level: 'state',
    name: { en: 'Member of the Legislative Assembly (MLA)', hi: 'विधानसभा सदस्य (विधायक)' },
    about: { en: 'Represents your assembly constituency, votes on state laws and budgets, and in most states can recommend local works from an MLA fund.', hi: 'आपके विधानसभा क्षेत्र का प्रतिनिधित्व करते हैं, राज्य के कानूनों और बजट पर वोट देते हैं, और ज़्यादातर राज्यों में विधायक निधि से स्थानीय काम सुझा सकते हैं।' },
    elected: { title: { en: 'MLA', hi: 'विधायक' }, how: ELECTED_BY_VOTERS },
    handles: [
      { en: 'State laws and the state budget', hi: 'राज्य के कानून और बजट' },
      { en: 'MLA fund works', hi: 'विधायक निधि के काम' },
      { en: 'Raising local problems with state departments', hi: 'स्थानीय समस्याएँ राज्य के विभागों के सामने उठाना' },
    ],
    contact: { label: { en: 'Your state assembly’s website lists MLAs by constituency', hi: 'आपकी विधानसभा की वेबसाइट पर क्षेत्रवार विधायकों की सूची' } },
    basis: { en: 'Article 170', hi: 'अनुच्छेद 170' },
  },
  mlc: {
    id: 'mlc',
    level: 'state',
    name: { en: 'Member of the Legislative Council (MLC)', hi: 'विधान परिषद सदस्य (MLC)' },
    about: { en: 'Only six states have a Legislative Council. MLCs are chosen by MLAs, local bodies, graduates and teachers, or nominated.', hi: 'केवल छह राज्यों में विधान परिषद है। MLC को विधायक, स्थानीय निकाय, स्नातक और शिक्षक चुनते हैं, या उन्हें मनोनीत किया जाता है।' },
    elected: { title: { en: 'MLC', hi: 'विधान परिषद सदस्य' }, how: { en: 'Indirectly elected or nominated, for 6 years', hi: 'अप्रत्यक्ष चुनाव या मनोनयन, 6 साल के लिए' } },
    handles: [{ en: 'Reviews state laws', hi: 'राज्य के कानूनों की समीक्षा' }],
    basis: { en: 'Article 169', hi: 'अनुच्छेद 169' },
  },
  'district-administration': {
    id: 'district-administration',
    level: 'district',
    name: { en: 'District administration', hi: 'ज़िला प्रशासन' },
    about: { en: 'The state government’s arm in your district. Sub-divisions are run by an SDM and tehsils or talukas by a Tehsildar.', hi: 'आपके ज़िले में राज्य सरकार का प्रशासन। उप-मंडल SDM और तहसील/तालुका तहसीलदार संभालते हैं।' },
    official: { title: { en: 'District Magistrate / Collector / Deputy Commissioner', hi: 'ज़िलाधिकारी / कलेक्टर / उपायुक्त' }, how: APPOINTED_IAS },
    handles: [
      { en: 'Land records, mutation and revenue', hi: 'भूमि रिकॉर्ड, दाखिल-ख़ारिज और राजस्व' },
      { en: 'Caste, income and domicile certificates', hi: 'जाति, आय और निवास प्रमाण पत्र' },
      { en: 'Disaster relief', hi: 'आपदा राहत' },
      { en: 'Running elections in the district', hi: 'ज़िले में चुनाव कराना' },
      { en: 'Checking on every department’s schemes', hi: 'सभी विभागों की योजनाओं की निगरानी' },
    ],
    contact: { label: { en: 'The Collectorate, or your state’s grievance portal', hi: 'कलेक्ट्रेट, या आपके राज्य का शिकायत पोर्टल' } },
  },
  police: {
    id: 'police',
    level: 'district',
    name: { en: 'Police', hi: 'पुलिस' },
    about: { en: 'Run by the state government. The district is led by a Superintendent of Police, big cities by a Police Commissioner, and your area by the local police station.', hi: 'राज्य सरकार के अधीन। ज़िले में पुलिस अधीक्षक, बड़े शहरों में पुलिस आयुक्त और आपके इलाके में स्थानीय थाना।' },
    official: { title: { en: 'Superintendent of Police / Police Commissioner; SHO at the police station', hi: 'पुलिस अधीक्षक / पुलिस आयुक्त; थाने में थाना प्रभारी (SHO)' }, how: { en: 'Appointed officers, usually from the IPS', hi: 'नियुक्त अधिकारी, प्रायः IPS' } },
    handles: [{ en: 'FIRs and crime', hi: 'FIR और अपराध' }, { en: 'Traffic', hi: 'यातायात' }, { en: 'Public safety', hi: 'सार्वजनिक सुरक्षा' }],
    contact: { label: { en: 'Emergency', hi: 'आपातकाल' }, phone: '112' },
  },
  'zila-panchayat': {
    id: 'zila-panchayat',
    level: 'local',
    area: 'rural',
    name: { en: 'District panchayat', hi: 'ज़िला पंचायत' },
    about: { en: 'Top tier of rural local government, covering the villages of the whole district.', hi: 'ग्रामीण स्थानीय शासन का सबसे ऊपरी स्तर, पूरे ज़िले के गाँवों के लिए।' },
    elected: { title: { en: 'Chairperson', hi: 'अध्यक्ष' }, how: { en: 'Chosen by the elected district panchayat members', hi: 'चुने गए ज़िला पंचायत सदस्य चुनते हैं' } },
    official: { title: { en: 'Chief Executive Officer', hi: 'मुख्य कार्यपालक अधिकारी' }, how: APPOINTED_STATE },
    handles: [
      { en: 'District-level rural plans and grants', hi: 'ज़िला स्तर की ग्रामीण योजनाएँ और अनुदान' },
      { en: 'Some rural roads and markets', hi: 'कुछ ग्रामीण सड़कें और हाट-बाज़ार' },
    ],
    contact: { label: { en: 'Plans and payments on eGramSwaraj', hi: 'eGramSwaraj पर योजनाएँ और भुगतान' }, url: 'https://egramswaraj.gov.in' },
    basis: { en: 'Article 243B (Part IX)', hi: 'अनुच्छेद 243B (भाग IX)' },
  },
  'block-panchayat': {
    id: 'block-panchayat',
    level: 'local',
    area: 'rural',
    name: { en: 'Block panchayat', hi: 'क्षेत्र / ब्लॉक पंचायत' },
    about: { en: 'Middle tier, covering a block of villages. States under 20 lakh people may skip it.', hi: 'बीच का स्तर, जो गाँवों के एक ब्लॉक के लिए है। 20 लाख से कम आबादी वाले राज्य इसे छोड़ सकते हैं।' },
    elected: { title: { en: 'Block chairperson', hi: 'ब्लॉक अध्यक्ष' }, how: { en: 'Chosen by the elected block panchayat members', hi: 'चुने गए ब्लॉक पंचायत सदस्य चुनते हैं' } },
    official: { title: { en: 'Block Development Officer (BDO)', hi: 'खंड विकास अधिकारी (BDO)' }, how: APPOINTED_STATE },
    handles: [
      { en: 'MGNREGA works and payments', hi: 'मनरेगा के काम और भुगतान' },
      { en: 'Housing (PMAY-G) and pensions', hi: 'आवास (PMAY-G) और पेंशन' },
      { en: 'Supervising gram panchayats', hi: 'ग्राम पंचायतों की निगरानी' },
    ],
    contact: { label: { en: 'The block office', hi: 'ब्लॉक कार्यालय' } },
    basis: { en: 'Article 243B (Part IX)', hi: 'अनुच्छेद 243B (भाग IX)' },
  },
  'gram-panchayat': {
    id: 'gram-panchayat',
    level: 'local',
    area: 'rural',
    name: { en: 'Gram panchayat', hi: 'ग्राम पंचायत' },
    about: { en: 'The village government, closest to you. Its plan (GPDP) is approved by the gram sabha: every adult voter of the village.', hi: 'आपके सबसे पास की गाँव की सरकार। इसकी योजना (GPDP) ग्राम सभा मंज़ूर करती है, यानी गाँव का हर वयस्क मतदाता।' },
    elected: { title: { en: 'Gram panchayat head', hi: 'ग्राम पंचायत प्रमुख' }, how: { en: 'Elected directly by village voters in most states', hi: 'ज़्यादातर राज्यों में गाँव के मतदाता सीधे चुनते हैं' } },
    official: { title: { en: 'Panchayat secretary', hi: 'पंचायत सचिव' }, how: APPOINTED_STATE },
    handles: [
      { en: 'Village lanes, drains and streetlights', hi: 'गाँव की गलियाँ, नालियाँ और स्ट्रीटलाइट' },
      { en: 'Hand pumps and village water supply', hi: 'हैंडपंप और गाँव की जलापूर्ति' },
      { en: 'Sanitation and waste', hi: 'साफ़-सफ़ाई और कचरा' },
      { en: 'Birth and death registration in many states', hi: 'कई राज्यों में जन्म और मृत्यु पंजीकरण' },
      { en: 'Choosing MGNREGA works', hi: 'मनरेगा के काम तय करना' },
    ],
    contact: { label: { en: 'Gram sabha meeting, or the panchayat’s record on eGramSwaraj', hi: 'ग्राम सभा की बैठक, या eGramSwaraj पर पंचायत का रिकॉर्ड' }, url: 'https://egramswaraj.gov.in' },
    basis: { en: 'Articles 243A to 243G (Part IX)', hi: 'अनुच्छेद 243A से 243G (भाग IX)' },
  },
  'municipal-corporation': {
    id: 'municipal-corporation',
    level: 'local',
    area: 'urban',
    name: { en: 'Municipal corporation', hi: 'नगर निगम' },
    about: { en: 'Governs a large city, for example MCD in Delhi or BMC in Mumbai. Smaller towns have a municipal council or a nagar panchayat instead.', hi: 'बड़े शहर का शासन, जैसे दिल्ली में MCD या मुंबई में BMC। छोटे शहरों में इसकी जगह नगर पालिका परिषद या नगर पंचायत होती है।' },
    elected: { title: { en: 'Mayor', hi: 'महापौर' }, how: { en: 'Elected directly by voters in some states, by councillors in others', hi: 'कुछ राज्यों में सीधे मतदाता चुनते हैं, कुछ में पार्षद' } },
    official: { title: { en: 'Municipal Commissioner', hi: 'नगर आयुक्त' }, how: APPOINTED_IAS },
    handles: [
      { en: 'City roads and footpaths', hi: 'शहर की सड़कें और फुटपाथ' },
      { en: 'Garbage collection and drains', hi: 'कूड़ा उठान और नालियाँ' },
      { en: 'Streetlights and parks', hi: 'स्ट्रीटलाइट और पार्क' },
      { en: 'Property tax and building permits', hi: 'संपत्ति कर और भवन नक्शा मंज़ूरी' },
      { en: 'Birth and death certificates', hi: 'जन्म और मृत्यु प्रमाण पत्र' },
    ],
    contact: { label: { en: 'Your corporation’s helpline or app; sanitation complaints on Swachhata-MoHUA', hi: 'आपके नगर निगम की हेल्पलाइन या ऐप; सफ़ाई की शिकायत Swachhata-MoHUA ऐप पर' } },
    basis: { en: 'Article 243Q (Part IXA)', hi: 'अनुच्छेद 243Q (भाग IXA)' },
  },
  'municipal-council': {
    id: 'municipal-council',
    level: 'local',
    area: 'urban',
    name: { en: 'Municipal council', hi: 'नगर पालिका परिषद' },
    about: { en: 'Governs a smaller city or town, with the same duties as a corporation.', hi: 'छोटे शहर या कस्बे का शासन, नगर निगम जैसे ही काम।' },
    elected: { title: { en: 'Chairperson', hi: 'अध्यक्ष' }, how: { en: 'Elected directly or by the councillors, by state law', hi: 'राज्य के कानून के अनुसार सीधे या पार्षदों द्वारा' } },
    official: { title: { en: 'Executive Officer', hi: 'अधिशासी अधिकारी' }, how: APPOINTED_STATE },
    handles: [{ en: 'Town roads, drains, garbage and streetlights', hi: 'कस्बे की सड़कें, नालियाँ, कूड़ा और स्ट्रीटलाइट' }, { en: 'Water supply in many towns', hi: 'कई कस्बों में जलापूर्ति' }],
    basis: { en: 'Article 243Q (Part IXA)', hi: 'अनुच्छेद 243Q (भाग IXA)' },
  },
  'nagar-panchayat': {
    id: 'nagar-panchayat',
    level: 'local',
    area: 'urban',
    name: { en: 'Nagar panchayat', hi: 'नगर पंचायत' },
    about: { en: 'For an area changing from rural to urban.', hi: 'ऐसे क्षेत्र के लिए जो गाँव से शहर बन रहा है।' },
    elected: { title: { en: 'Chairperson', hi: 'अध्यक्ष' }, how: { en: 'Elected directly or by the members, by state law', hi: 'राज्य के कानून के अनुसार सीधे या सदस्यों द्वारा' } },
    official: { title: { en: 'Executive Officer', hi: 'अधिशासी अधिकारी' }, how: APPOINTED_STATE },
    handles: [{ en: 'Local roads, drains, garbage and streetlights', hi: 'स्थानीय सड़कें, नालियाँ, कूड़ा और स्ट्रीटलाइट' }],
    basis: { en: 'Article 243Q (Part IXA)', hi: 'अनुच्छेद 243Q (भाग IXA)' },
  },
  'ward-councillor': {
    id: 'ward-councillor',
    level: 'ward',
    area: 'urban',
    name: { en: 'Ward councillor', hi: 'वार्ड पार्षद' },
    about: { en: 'Your elected member on the city or town body, for your ward. Usually the fastest person to reach about a local problem.', hi: 'नगर निकाय में आपके वार्ड के चुने हुए सदस्य। स्थानीय समस्या के लिए प्रायः सबसे जल्दी मिलने वाले व्यक्ति।' },
    elected: { title: { en: 'Councillor / corporator', hi: 'पार्षद' }, how: ELECTED_BY_VOTERS },
    official: { title: { en: 'Ward or zonal officers (sanitary inspector, junior engineer)', hi: 'वार्ड या ज़ोन के अधिकारी (सफ़ाई निरीक्षक, कनिष्ठ अभियंता)' }, how: { en: 'Municipal staff', hi: 'नगर निकाय के कर्मचारी' } },
    handles: [{ en: 'Ward sanitation, lanes and streetlights', hi: 'वार्ड की सफ़ाई, गलियाँ और स्ट्रीटलाइट' }, { en: 'Ward committee meetings', hi: 'वार्ड समिति की बैठकें' }],
    basis: { en: 'Articles 243R and 243S', hi: 'अनुच्छेद 243R और 243S' },
  },
  'ward-member': {
    id: 'ward-member',
    level: 'ward',
    area: 'rural',
    name: { en: 'Panchayat ward member', hi: 'पंचायत वार्ड सदस्य (पंच)' },
    about: { en: 'Elected for your part of the village, and sits on the gram panchayat.', hi: 'गाँव के आपके हिस्से से चुने जाते हैं और ग्राम पंचायत में बैठते हैं।' },
    elected: { title: { en: 'Ward member (panch)', hi: 'वार्ड सदस्य (पंच)' }, how: ELECTED_BY_VOTERS },
    handles: [{ en: 'Speaking for your hamlet in the panchayat', hi: 'पंचायत में आपके टोले/मोहल्ले की बात रखना' }],
    basis: { en: 'Article 243C', hi: 'अनुच्छेद 243C' },
  },
  // Departments that do the work, whichever body answers for it.
  pwd: {
    id: 'pwd',
    level: 'department',
    name: { en: 'Public Works Department (PWD)', hi: 'लोक निर्माण विभाग (PWD)' },
    about: { en: 'State department that builds and repairs state highways, major district roads, bridges and government buildings.', hi: 'राज्य का विभाग जो राज्य राजमार्ग, प्रमुख ज़िला सड़कें, पुल और सरकारी इमारतें बनाता और मरम्मत करता है।' },
    official: { title: { en: 'Executive Engineer (division), Assistant and Junior Engineers', hi: 'अधिशासी अभियंता (खंड), सहायक और कनिष्ठ अभियंता' }, how: APPOINTED_STATE },
    handles: [{ en: 'State highways and major district roads', hi: 'राज्य राजमार्ग और प्रमुख ज़िला सड़कें' }, { en: 'Bridges and government buildings', hi: 'पुल और सरकारी इमारतें' }],
  },
  nhai: {
    id: 'nhai',
    level: 'department',
    name: { en: 'NHAI / Ministry of Road Transport and Highways', hi: 'NHAI / सड़क परिवहन और राजमार्ग मंत्रालय' },
    about: { en: 'Builds and maintains national highways, directly or through state PWD highway wings.', hi: 'राष्ट्रीय राजमार्ग बनाता और रख-रखाव करता है, सीधे या राज्य PWD की राजमार्ग शाखा के ज़रिए।' },
    official: { title: { en: 'Project Director of the NHAI unit', hi: 'NHAI इकाई के परियोजना निदेशक' }, how: { en: 'Central government officer', hi: 'केंद्र सरकार के अधिकारी' } },
    handles: [{ en: 'National highways and toll plazas', hi: 'राष्ट्रीय राजमार्ग और टोल प्लाज़ा' }],
    contact: { label: { en: 'National highway helpline', hi: 'राष्ट्रीय राजमार्ग हेल्पलाइन' }, phone: '1033' },
  },
  'rural-roads': {
    id: 'rural-roads',
    level: 'department',
    name: { en: 'Rural roads agency (PMGSY)', hi: 'ग्रामीण सड़क एजेंसी (PMGSY)' },
    about: { en: 'The state rural roads agency or rural engineering department builds roads that link villages under PMGSY and looks after them for five years.', hi: 'राज्य की ग्रामीण सड़क एजेंसी या ग्रामीण अभियंत्रण विभाग PMGSY के तहत गाँवों को जोड़ने वाली सड़कें बनाता है और पाँच साल तक उनका रख-रखाव करता है।' },
    official: { title: { en: 'Executive Engineer of the project unit', hi: 'परियोजना इकाई के अधिशासी अभियंता' }, how: APPOINTED_STATE },
    handles: [{ en: 'Roads connecting villages', hi: 'गाँवों को जोड़ने वाली सड़कें' }],
    contact: { label: { en: 'Meri Sadak app for PMGSY road complaints', hi: 'PMGSY सड़क की शिकायत के लिए मेरी सड़क ऐप' } },
  },
  water: {
    id: 'water',
    level: 'department',
    name: { en: 'Water supply agency', hi: 'जलापूर्ति विभाग' },
    about: { en: 'Jal Board or Jal Nigam in cities, and the Public Health Engineering Department for village piped water under Jal Jeevan Mission. The name differs by state.', hi: 'शहरों में जल बोर्ड या जल निगम, और गाँवों में जल जीवन मिशन के नल-जल के लिए लोक स्वास्थ्य अभियांत्रिकी विभाग। नाम राज्य के अनुसार अलग होता है।' },
    official: { title: { en: 'Executive Engineer of the water division', hi: 'जल खंड के अधिशासी अभियंता' }, how: APPOINTED_STATE },
    handles: [{ en: 'Piped water and sewerage', hi: 'नल का पानी और सीवर' }],
  },
  electricity: {
    id: 'electricity',
    level: 'department',
    name: { en: 'Electricity distribution company (DISCOM)', hi: 'बिजली वितरण कंपनी (डिस्कॉम)' },
    about: { en: 'Supplies power, bills you and fixes faults. Most are state-owned; some cities have private companies.', hi: 'बिजली देती है, बिल भेजती है और ख़राबी ठीक करती है। ज़्यादातर राज्य सरकार की हैं; कुछ शहरों में निजी कंपनियाँ हैं।' },
    official: { title: { en: 'Sub-divisional officer or Executive Engineer', hi: 'उपखंड अधिकारी या अधिशासी अभियंता' }, how: { en: 'Company staff', hi: 'कंपनी के कर्मचारी' } },
    handles: [{ en: 'Power cuts, meters and bills', hi: 'बिजली कटौती, मीटर और बिल' }],
    contact: { label: { en: 'Electricity complaint number', hi: 'बिजली शिकायत नंबर' }, phone: '1912' },
  },
  health: {
    id: 'health',
    level: 'department',
    name: { en: 'District health department', hi: 'ज़िला स्वास्थ्य विभाग' },
    about: { en: 'Runs district hospitals, community and primary health centres, and health sub-centres.', hi: 'ज़िला अस्पताल, सामुदायिक और प्राथमिक स्वास्थ्य केंद्र, और उपकेंद्र चलाता है।' },
    official: { title: { en: 'Chief Medical Officer', hi: 'मुख्य चिकित्सा अधिकारी (CMO)' }, how: APPOINTED_STATE },
    handles: [{ en: 'Government hospitals and PHCs', hi: 'सरकारी अस्पताल और PHC' }, { en: 'Free medicines and ambulances', hi: 'मुफ़्त दवाएँ और एम्बुलेंस' }],
    contact: { label: { en: 'Ambulance', hi: 'एम्बुलेंस' }, phone: '108' },
  },
  education: {
    id: 'education',
    level: 'department',
    name: { en: 'District education office', hi: 'ज़िला शिक्षा कार्यालय' },
    about: { en: 'Runs government schools. Each school also has a School Management Committee of parents.', hi: 'सरकारी स्कूल चलाता है। हर स्कूल में अभिभावकों की विद्यालय प्रबंधन समिति भी होती है।' },
    official: { title: { en: 'District Education Officer (Basic Shiksha Adhikari in some states)', hi: 'ज़िला शिक्षा अधिकारी (कुछ राज्यों में बेसिक शिक्षा अधिकारी)' }, how: APPOINTED_STATE },
    handles: [{ en: 'Teachers, mid-day meals and school buildings', hi: 'शिक्षक, मध्याह्न भोजन और स्कूल भवन' }],
  },
  'food-supply': {
    id: 'food-supply',
    level: 'department',
    name: { en: 'Food and civil supplies department', hi: 'खाद्य एवं रसद विभाग' },
    about: { en: 'Issues ration cards and supervises ration shops.', hi: 'राशन कार्ड बनाता है और राशन की दुकानों की निगरानी करता है।' },
    official: { title: { en: 'District Supply Officer', hi: 'ज़िला पूर्ति अधिकारी' }, how: APPOINTED_STATE },
    handles: [{ en: 'Ration cards and ration shops', hi: 'राशन कार्ड और राशन की दुकानें' }],
    contact: { label: { en: 'Food helpline (1967 in most states)', hi: 'खाद्य हेल्पलाइन (ज़्यादातर राज्यों में 1967)' }, phone: '1967' },
  },
  'pollution-board': {
    id: 'pollution-board',
    level: 'department',
    name: { en: 'State Pollution Control Board', hi: 'राज्य प्रदूषण नियंत्रण बोर्ड' },
    about: { en: 'Gives permission to factories, and inspects and penalises polluters. The Central board sets standards.', hi: 'उद्योगों को अनुमति देता है, जाँच करता है और प्रदूषण फैलाने वालों पर जुर्माना लगाता है। केंद्रीय बोर्ड मानक तय करता है।' },
    official: { title: { en: 'Regional officer', hi: 'क्षेत्रीय अधिकारी' }, how: APPOINTED_STATE },
    handles: [{ en: 'Factory smoke and effluents', hi: 'कारख़ानों का धुआँ और गंदा पानी' }, { en: 'Garbage burning and construction dust', hi: 'कूड़ा जलाना और निर्माण की धूल' }],
    contact: { label: { en: 'CPCB Sameer app', hi: 'CPCB समीर ऐप' } },
  },
  rera: {
    id: 'rera',
    level: 'department',
    name: { en: 'Real Estate Regulatory Authority (RERA)', hi: 'भू-संपदा नियामक प्राधिकरण (RERA)' },
    about: { en: 'Registers housing projects and hears complaints against builders.', hi: 'आवासीय परियोजनाओं का पंजीकरण करता है और बिल्डरों के ख़िलाफ़ शिकायतें सुनता है।' },
    official: { title: { en: 'Chairperson of the state RERA', hi: 'राज्य RERA के अध्यक्ष' }, how: APPOINTED_STATE },
    handles: [{ en: 'Delayed flats and builder complaints', hi: 'देर से मिलने वाले फ़्लैट और बिल्डर की शिकायतें' }],
  },
};
