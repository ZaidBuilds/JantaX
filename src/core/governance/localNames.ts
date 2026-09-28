import type { Bi } from './bodies';

/**
 * What each state or UT calls its local bodies and their heads. Part IX lets states name the
 * three panchayat tiers, so "Pradhan" heads a village in Uttar Pradesh but a block in Rajasthan.
 * Where a state has no Part IX panchayats (Delhi, Meghalaya, Mizoram, Nagaland), say what exists
 * instead. Corrections go through the public corrections log.
 */

export interface Tier {
  name: Bi;
  head: Bi;
}

export interface LocalNames {
  /** null when the state has no such tier. */
  district?: Tier | null;
  block?: Tier | null;
  village?: Tier | null;
  corporationHead?: Bi;
  corporationName?: Bi;
  council?: Tier;
  /** Shown instead of the rural chain where Part IX panchayats do not exist. */
  noPanchayats?: Bi;
  /** Union territory without its own legislature: no MLA, no state government. */
  noLegislature?: boolean;
  /** State with a Legislative Council. */
  legislativeCouncil?: boolean;
  note?: Bi;
}

const T = (en: string, hi: string, headEn: string, headHi: string): Tier => ({ name: { en, hi }, head: { en: headEn, hi: headHi } });

const MAYOR: Bi = { en: 'Mayor', hi: 'महापौर' };

export const DEFAULT_NAMES: Required<Pick<LocalNames, 'district' | 'block' | 'village' | 'corporationHead' | 'council'>> = {
  district: T('District panchayat', 'ज़िला पंचायत', 'Chairperson', 'अध्यक्ष'),
  block: T('Block panchayat', 'ब्लॉक पंचायत', 'Chairperson', 'अध्यक्ष'),
  village: T('Gram panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
  corporationHead: MAYOR,
  council: T('Municipal council', 'नगर पालिका परिषद', 'Chairperson', 'अध्यक्ष'),
};

export const LOCAL_NAMES: Record<string, LocalNames> = {
  UP: {
    district: T('Zila Panchayat', 'ज़िला पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Kshetra Panchayat', 'क्षेत्र पंचायत', 'Block Pramukh', 'ब्लॉक प्रमुख'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Gram Pradhan', 'ग्राम प्रधान'),
    council: T('Nagar Palika Parishad', 'नगर पालिका परिषद', 'Adhyaksh', 'अध्यक्ष'),
    legislativeCouncil: true,
  },
  UK: {
    district: T('Zila Panchayat', 'ज़िला पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Kshetra Panchayat', 'क्षेत्र पंचायत', 'Block Pramukh', 'ब्लॉक प्रमुख'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Gram Pradhan', 'ग्राम प्रधान'),
    council: T('Nagar Palika Parishad', 'नगर पालिका परिषद', 'Adhyaksh', 'अध्यक्ष'),
  },
  BR: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Pramukh', 'प्रमुख'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Mukhiya', 'मुखिया'),
    council: T('Nagar Parishad', 'नगर परिषद', 'Mukhya Parshad', 'मुख्य पार्षद'),
    legislativeCouncil: true,
  },
  JH: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Pramukh', 'प्रमुख'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Mukhiya', 'मुखिया'),
    council: T('Nagar Parishad', 'नगर परिषद', 'Adhyaksh', 'अध्यक्ष'),
  },
  MP: {
    district: T('Zila Panchayat', 'ज़िला पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Janpad Panchayat', 'जनपद पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Nagar Palika', 'नगर पालिका', 'Adhyaksh', 'अध्यक्ष'),
  },
  CG: {
    district: T('Zila Panchayat', 'ज़िला पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    block: T('Janpad Panchayat', 'जनपद पंचायत', 'Adhyaksh', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Nagar Palika Parishad', 'नगर पालिका परिषद', 'Adhyaksh', 'अध्यक्ष'),
  },
  RJ: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Zila Pramukh', 'ज़िला प्रमुख'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Pradhan', 'प्रधान'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Nagar Parishad', 'नगर परिषद', 'Sabhapati', 'सभापति'),
    note: { en: 'In Rajasthan the Pradhan heads the block (panchayat samiti); the village head is the Sarpanch.', hi: 'राजस्थान में प्रधान ब्लॉक (पंचायत समिति) के मुखिया होते हैं; गाँव के मुखिया सरपंच होते हैं।' },
  },
  HR: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council', 'नगर परिषद', 'Chairperson', 'अध्यक्ष'),
  },
  PB: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council', 'नगर परिषद', 'President', 'अध्यक्ष'),
  },
  HP: {
    district: T('Zila Parishad', 'ज़िला परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Pradhan', 'प्रधान'),
    council: T('Nagar Parishad', 'नगर परिषद', 'Adhyaksh', 'अध्यक्ष'),
  },
  GJ: {
    district: T('District Panchayat', 'ज़िला पंचायत', 'President', 'प्रमुख'),
    block: T('Taluka Panchayat', 'तालुका पंचायत', 'President', 'प्रमुख'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Nagarpalika', 'नगरपालिका', 'President', 'अध्यक्ष'),
  },
  MH: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'President', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Sabhapati', 'सभापति'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council (Nagar Parishad)', 'नगर परिषद', 'President', 'अध्यक्ष'),
    legislativeCouncil: true,
  },
  GA: {
    district: T('Zilla Panchayat', 'ज़िला पंचायत', 'President', 'अध्यक्ष'),
    block: null,
    village: T('Village Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council', 'नगर परिषद', 'Chairperson', 'अध्यक्ष'),
    note: { en: 'Goa has two panchayat tiers (North and South Goa zilla panchayats, and village panchayats).', hi: 'गोवा में पंचायत के दो ही स्तर हैं (उत्तर और दक्षिण गोवा ज़िला पंचायत, और ग्राम पंचायतें)।' },
  },
  KA: {
    district: T('Zilla Panchayat', 'ज़िला पंचायत', 'Adhyaksha', 'अध्यक्ष'),
    block: T('Taluk Panchayat', 'तालुक पंचायत', 'Adhyaksha', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Adhyaksha', 'अध्यक्ष'),
    council: T('City / Town Municipal Council', 'नगर / कस्बा परिषद', 'President', 'अध्यक्ष'),
    legislativeCouncil: true,
  },
  KL: {
    district: T('District Panchayat', 'ज़िला पंचायत', 'President', 'अध्यक्ष'),
    block: T('Block Panchayat', 'ब्लॉक पंचायत', 'President', 'अध्यक्ष'),
    village: T('Grama Panchayat', 'ग्राम पंचायत', 'President', 'अध्यक्ष'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
  },
  TN: {
    district: T('District Panchayat', 'ज़िला पंचायत', 'Chairperson', 'अध्यक्ष'),
    block: T('Panchayat Union', 'पंचायत यूनियन', 'Chairperson', 'अध्यक्ष'),
    village: T('Village Panchayat', 'ग्राम पंचायत', 'President', 'अध्यक्ष'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
  },
  AP: {
    district: T('Zilla Praja Parishad', 'ज़िला प्रजा परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Mandal Praja Parishad', 'मंडल प्रजा परिषद', 'President', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
    legislativeCouncil: true,
  },
  TG: {
    district: T('Zilla Praja Parishad', 'ज़िला प्रजा परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Mandal Praja Parishad', 'मंडल प्रजा परिषद', 'President', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
    legislativeCouncil: true,
  },
  OD: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'President', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
  },
  WB: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'Sabhadhipati', 'सभाधिपति'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Sabhapati', 'सभापति'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Pradhan', 'प्रधान'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
  },
  AS: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'President', 'अध्यक्ष'),
    block: T('Anchalik Panchayat', 'आंचलिक पंचायत', 'President', 'अध्यक्ष'),
    village: T('Gaon Panchayat', 'गाँव पंचायत', 'President', 'अध्यक्ष'),
    council: T('Municipal Board', 'नगर बोर्ड', 'Chairperson', 'अध्यक्ष'),
    note: { en: 'Sixth Schedule areas (Bodoland, Karbi Anglong, Dima Hasao) are run by autonomous councils instead.', hi: 'छठी अनुसूची के क्षेत्र (बोडोलैंड, कार्बी आंगलोंग, दीमा हसाओ) स्वायत्त परिषदें चलाती हैं।' },
  },
  AR: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Anchal Samiti', 'आंचल समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Chairperson', 'अध्यक्ष'),
  },
  SK: {
    district: T('Zilla Panchayat', 'ज़िला पंचायत', 'Adhyaksha', 'अध्यक्ष'),
    block: null,
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'President', 'अध्यक्ष'),
    note: { en: 'Sikkim has two panchayat tiers.', hi: 'सिक्किम में पंचायत के दो स्तर हैं।' },
  },
  TR: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'Sabhadhipati', 'सभाधिपति'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Pradhan', 'प्रधान'),
    note: { en: 'Tribal areas are run by the Tripura Tribal Areas Autonomous District Council and its village committees.', hi: 'जनजातीय क्षेत्रों को त्रिपुरा जनजातीय क्षेत्र स्वायत्त ज़िला परिषद और उसकी ग्राम समितियाँ चलाती हैं।' },
  },
  MN: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'Adhyaksha', 'अध्यक्ष'),
    block: null,
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Pradhan', 'प्रधान'),
    note: { en: 'Panchayats cover the valley districts; hill areas have autonomous district councils and village authorities.', hi: 'घाटी के ज़िलों में पंचायतें हैं; पहाड़ी क्षेत्रों में स्वायत्त ज़िला परिषदें और ग्राम प्राधिकरण हैं।' },
  },
  ML: {
    district: null, block: null, village: null,
    noPanchayats: { en: 'Meghalaya has no panchayats under Part IX. Autonomous district councils (Khasi, Jaintia and Garo Hills) and traditional village bodies such as the Dorbar Shnong run local affairs.', hi: 'मेघालय में भाग IX वाली पंचायतें नहीं हैं। स्वायत्त ज़िला परिषदें (खासी, जयंतिया और गारो हिल्स) और दोरबार श्नोंग जैसी पारंपरिक ग्राम संस्थाएँ स्थानीय मामले देखती हैं।' },
  },
  MZ: {
    district: null, block: null, village: null,
    noPanchayats: { en: 'Mizoram has elected village councils instead of Part IX panchayats, and autonomous district councils in the south.', hi: 'मिज़ोरम में भाग IX पंचायतों की जगह चुनी हुई ग्राम परिषदें हैं, और दक्षिण में स्वायत्त ज़िला परिषदें।' },
  },
  NL: {
    district: null, block: null, village: null,
    noPanchayats: { en: 'Nagaland has village councils and village development boards under its own law, not Part IX panchayats.', hi: 'नगालैंड में अपने कानून के तहत ग्राम परिषदें और ग्राम विकास बोर्ड हैं, भाग IX पंचायतें नहीं।' },
  },
  DL: {
    district: null, block: null, village: null,
    corporationName: { en: 'Municipal Corporation of Delhi (MCD)', hi: 'दिल्ली नगर निगम (MCD)' },
    noPanchayats: { en: 'Delhi has no panchayats. Villages fall under the Municipal Corporation of Delhi (MCD); Lutyens’ Delhi is run by the NDMC and the cantonment by its board.', hi: 'दिल्ली में पंचायतें नहीं हैं। गाँव दिल्ली नगर निगम (MCD) के अंतर्गत आते हैं; लुटियंस दिल्ली NDMC और छावनी क्षेत्र छावनी बोर्ड चलाता है।' },
    note: { en: 'In Delhi, police, public order and land are handled by the Union government through the Lieutenant Governor. Water is supplied by the Delhi Jal Board; larger roads are with PWD Delhi and smaller ones with MCD.', hi: 'दिल्ली में पुलिस, कानून-व्यवस्था और भूमि केंद्र सरकार उपराज्यपाल के ज़रिए देखती है। पानी दिल्ली जल बोर्ड देता है; बड़ी सड़कें PWD दिल्ली और छोटी सड़कें MCD के पास हैं।' },
  },
  JK: {
    district: T('District Development Council', 'ज़िला विकास परिषद', 'Chairperson', 'अध्यक्ष'),
    block: T('Block Development Council', 'ब्लॉक विकास परिषद', 'Chairperson', 'अध्यक्ष'),
    village: T('Halqa Panchayat', 'हलका पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council', 'नगर परिषद', 'President', 'अध्यक्ष'),
  },
  LA: {
    district: T('Ladakh Autonomous Hill Development Council (Leh / Kargil)', 'लद्दाख स्वायत्त पहाड़ी विकास परिषद (लेह / कारगिल)', 'Chief Executive Councillor', 'मुख्य कार्यकारी पार्षद'),
    block: null,
    village: T('Halqa Panchayat', 'हलका पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Committee', 'नगर समिति', 'President', 'अध्यक्ष'),
    noLegislature: true,
  },
  CH: {
    district: null, block: null, village: null,
    corporationName: { en: 'Municipal Corporation Chandigarh', hi: 'नगर निगम चंडीगढ़' },
    noPanchayats: { en: 'The Municipal Corporation Chandigarh covers the city and its villages.', hi: 'नगर निगम चंडीगढ़ शहर और उसके गाँवों को संभालता है।' },
    noLegislature: true,
  },
  PY: {
    district: null,
    block: T('Commune Panchayat', 'कम्यून पंचायत', 'Chairperson', 'अध्यक्ष'),
    village: T('Village Panchayat', 'ग्राम पंचायत', 'President', 'अध्यक्ष'),
    council: T('Municipality', 'नगर पालिका', 'Chairperson', 'अध्यक्ष'),
  },
  LD: {
    district: T('District Panchayat', 'ज़िला पंचायत', 'President', 'अध्यक्ष'),
    block: null,
    village: T('Dweep (Village) Panchayat', 'द्वीप (ग्राम) पंचायत', 'Chairperson', 'अध्यक्ष'),
    noLegislature: true,
  },
  AN: {
    district: T('Zilla Parishad', 'ज़िला परिषद', 'President', 'अध्यक्ष'),
    block: T('Panchayat Samiti', 'पंचायत समिति', 'Chairperson', 'अध्यक्ष'),
    village: T('Gram Panchayat', 'ग्राम पंचायत', 'Pradhan', 'प्रधान'),
    council: T('Municipal Council (Port Blair)', 'नगर परिषद (पोर्ट ब्लेयर)', 'Chairperson', 'अध्यक्ष'),
    noLegislature: true,
  },
  DD: {
    district: T('District Panchayat', 'ज़िला पंचायत', 'President', 'अध्यक्ष'),
    block: null,
    village: T('Village Panchayat', 'ग्राम पंचायत', 'Sarpanch', 'सरपंच'),
    council: T('Municipal Council', 'नगर परिषद', 'President', 'अध्यक्ष'),
    noLegislature: true,
  },
};
