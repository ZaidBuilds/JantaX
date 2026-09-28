import type { Bi, Contact } from './bodies';
import type { Settlement } from './chain';

/**
 * Who fixes what: for everyday problems, the body that answers for it, who to approach first,
 * and where to go next if nothing happens. Bodies are referenced by id so that each state's own
 * names (Gram Pradhan, Mukhiya, Sarpanch...) are shown.
 */

export interface Route {
  /** Body id from ./bodies.ts. 'local' means the city or village body for the chosen settlement. */
  body: string;
  first: Bi;
  escalate: Bi[];
  channel?: Contact;
}

export interface Issue {
  id: string;
  label: Bi;
  urban?: Route;
  rural?: Route;
}

const CPGRAMS: Contact = { label: { en: 'Central grievance portal (CPGRAMS)', hi: 'केंद्रीय शिकायत पोर्टल (CPGRAMS)' }, url: 'https://pgportal.gov.in' };
const STATE_PORTAL: Bi = { en: 'State CM helpline or grievance portal', hi: 'राज्य की मुख्यमंत्री हेल्पलाइन या शिकायत पोर्टल' };

export const ISSUES: Issue[] = [
  {
    id: 'national-highway',
    label: { en: 'National highway', hi: 'राष्ट्रीय राजमार्ग' },
    urban: {
      body: 'nhai',
      first: { en: 'Call the highway helpline 1033 with the highway number and nearest kilometre stone', hi: 'राजमार्ग नंबर और पास के किलोमीटर पत्थर के साथ हेल्पलाइन 1033 पर कॉल करें' },
      escalate: [{ en: 'Project Director, NHAI unit', hi: 'परियोजना निदेशक, NHAI इकाई' }, { en: 'NHAI regional office', hi: 'NHAI क्षेत्रीय कार्यालय' }, { en: 'CPGRAMS (Ministry of Road Transport)', hi: 'CPGRAMS (सड़क परिवहन मंत्रालय)' }],
      channel: { label: { en: 'Highway helpline', hi: 'राजमार्ग हेल्पलाइन' }, phone: '1033' },
    },
  },
  {
    id: 'state-road',
    label: { en: 'State highway or main road', hi: 'राज्य राजमार्ग या मुख्य सड़क' },
    urban: {
      body: 'pwd',
      first: { en: 'Junior Engineer at the PWD sub-division office', hi: 'PWD उपखंड कार्यालय के कनिष्ठ अभियंता' },
      escalate: [{ en: 'Executive Engineer, PWD division', hi: 'अधिशासी अभियंता, PWD खंड' }, { en: 'Superintending Engineer', hi: 'अधीक्षण अभियंता' }, STATE_PORTAL],
    },
  },
  {
    id: 'village-road',
    label: { en: 'Road to or inside a village', hi: 'गाँव तक या गाँव के अंदर की सड़क' },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Village lanes: the gram panchayat head. Roads linking villages: the Meri Sadak app (PMGSY).', hi: 'गाँव की गलियाँ: ग्राम पंचायत प्रमुख। गाँवों को जोड़ने वाली सड़कें: मेरी सड़क ऐप (PMGSY)।' },
      escalate: [{ en: 'Block Development Officer', hi: 'खंड विकास अधिकारी' }, { en: 'Executive Engineer, rural roads project unit', hi: 'अधिशासी अभियंता, ग्रामीण सड़क परियोजना इकाई' }, { en: 'District Magistrate', hi: 'ज़िलाधिकारी' }],
    },
  },
  {
    id: 'city-street',
    label: { en: 'Street, footpath or pothole in a town', hi: 'कस्बे/शहर की गली, फुटपाथ या गड्ढा' },
    urban: {
      body: 'local',
      first: { en: 'Your ward councillor, or the city’s complaint app or helpline', hi: 'आपके वार्ड पार्षद, या शहर का शिकायत ऐप या हेल्पलाइन' },
      escalate: [{ en: 'Junior Engineer of the zone', hi: 'ज़ोन के कनिष्ठ अभियंता' }, { en: 'Executive Engineer', hi: 'अधिशासी अभियंता' }, { en: 'Municipal Commissioner or Executive Officer', hi: 'नगर आयुक्त या अधिशासी अधिकारी' }],
    },
  },
  {
    id: 'streetlight',
    label: { en: 'Streetlight', hi: 'स्ट्रीटलाइट' },
    urban: {
      body: 'local',
      first: { en: 'Ward councillor or the city’s complaint helpline', hi: 'वार्ड पार्षद या शहर की शिकायत हेल्पलाइन' },
      escalate: [{ en: 'Electrical engineer of the zone', hi: 'ज़ोन के विद्युत अभियंता' }, { en: 'Municipal Commissioner or Executive Officer', hi: 'नगर आयुक्त या अधिशासी अधिकारी' }],
    },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Gram panchayat head or ward member', hi: 'ग्राम पंचायत प्रमुख या वार्ड सदस्य' },
      escalate: [{ en: 'Panchayat secretary', hi: 'पंचायत सचिव' }, { en: 'Block Development Officer', hi: 'खंड विकास अधिकारी' }],
    },
  },
  {
    id: 'garbage',
    label: { en: 'Garbage or blocked drain', hi: 'कूड़ा या बंद नाली' },
    urban: {
      body: 'local',
      first: { en: 'Sanitary inspector of the ward, or the Swachhata-MoHUA app', hi: 'वार्ड के सफ़ाई निरीक्षक, या Swachhata-MoHUA ऐप' },
      escalate: [{ en: 'Ward councillor', hi: 'वार्ड पार्षद' }, { en: 'Zonal health or sanitation officer', hi: 'ज़ोनल स्वास्थ्य या सफ़ाई अधिकारी' }, { en: 'Municipal Commissioner or Executive Officer', hi: 'नगर आयुक्त या अधिशासी अधिकारी' }],
    },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Gram panchayat head; raise it at the gram sabha', hi: 'ग्राम पंचायत प्रमुख; ग्राम सभा में उठाएँ' },
      escalate: [{ en: 'Block Development Officer', hi: 'खंड विकास अधिकारी' }, { en: 'District Panchayat Raj Officer', hi: 'ज़िला पंचायत राज अधिकारी' }],
    },
  },
  {
    id: 'water',
    label: { en: 'Drinking water', hi: 'पीने का पानी' },
    urban: {
      body: 'water',
      first: { en: 'The water board’s complaint line (in some towns, the municipal body)', hi: 'जल बोर्ड की शिकायत लाइन (कुछ कस्बों में नगर निकाय)' },
      escalate: [{ en: 'Assistant Engineer, water division', hi: 'सहायक अभियंता, जल खंड' }, { en: 'Executive Engineer', hi: 'अधिशासी अभियंता' }, STATE_PORTAL],
    },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Hand pumps: the gram panchayat. Village piped water: the pani samiti and the PHED junior engineer.', hi: 'हैंडपंप: ग्राम पंचायत। गाँव का नल-जल: पानी समिति और PHED के कनिष्ठ अभियंता।' },
      escalate: [{ en: 'Executive Engineer, PHED / Jal Nigam', hi: 'अधिशासी अभियंता, PHED / जल निगम' }, { en: 'District Magistrate', hi: 'ज़िलाधिकारी' }],
    },
  },
  {
    id: 'electricity',
    label: { en: 'Power cut or electricity bill', hi: 'बिजली कटौती या बिजली बिल' },
    urban: {
      body: 'electricity',
      first: { en: 'Call 1912 or your DISCOM’s app and note the complaint number', hi: '1912 या अपने डिस्कॉम के ऐप पर शिकायत करें और शिकायत संख्या लिख लें' },
      escalate: [{ en: 'Sub-divisional officer', hi: 'उपखंड अधिकारी' }, { en: 'Consumer Grievance Redressal Forum', hi: 'उपभोक्ता शिकायत निवारण फ़ोरम' }, { en: 'Electricity Ombudsman', hi: 'विद्युत लोकपाल' }],
      channel: { label: { en: 'Electricity complaint number', hi: 'बिजली शिकायत नंबर' }, phone: '1912' },
    },
  },
  {
    id: 'school',
    label: { en: 'Government school', hi: 'सरकारी स्कूल' },
    urban: {
      body: 'education',
      first: { en: 'Head teacher and the School Management Committee', hi: 'प्रधानाध्यापक और विद्यालय प्रबंधन समिति' },
      escalate: [{ en: 'Block Education Officer', hi: 'खंड शिक्षा अधिकारी' }, { en: 'District Education Officer', hi: 'ज़िला शिक्षा अधिकारी' }, STATE_PORTAL],
    },
  },
  {
    id: 'health',
    label: { en: 'Hospital or health centre', hi: 'अस्पताल या स्वास्थ्य केंद्र' },
    urban: {
      body: 'health',
      first: { en: 'Medical officer in charge of the hospital or PHC', hi: 'अस्पताल या PHC के प्रभारी चिकित्सा अधिकारी' },
      escalate: [{ en: 'Chief Medical Officer', hi: 'मुख्य चिकित्सा अधिकारी' }, { en: 'State health helpline (104 in many states)', hi: 'राज्य स्वास्थ्य हेल्पलाइन (कई राज्यों में 104)' }],
    },
  },
  {
    id: 'ration',
    label: { en: 'Ration card or ration shop', hi: 'राशन कार्ड या राशन की दुकान' },
    urban: {
      body: 'food-supply',
      first: { en: 'Ask the ration dealer for the complaint register, or call the food helpline', hi: 'राशन विक्रेता से शिकायत रजिस्टर माँगें, या खाद्य हेल्पलाइन पर कॉल करें' },
      escalate: [{ en: 'Supply inspector', hi: 'पूर्ति निरीक्षक' }, { en: 'District Supply Officer', hi: 'ज़िला पूर्ति अधिकारी' }, { en: 'State Food Commission', hi: 'राज्य खाद्य आयोग' }],
      channel: { label: { en: 'Food helpline (most states)', hi: 'खाद्य हेल्पलाइन (ज़्यादातर राज्य)' }, phone: '1967' },
    },
  },
  {
    id: 'land',
    label: { en: 'Land record or mutation', hi: 'भूमि रिकॉर्ड या दाखिल-ख़ारिज' },
    urban: {
      body: 'district-administration',
      first: { en: 'Patwari / Lekhpal / Talathi for your village or area', hi: 'आपके गाँव या इलाके के पटवारी / लेखपाल / तलाठी' },
      escalate: [{ en: 'Tehsildar', hi: 'तहसीलदार' }, { en: 'Sub-Divisional Magistrate', hi: 'उप-ज़िलाधिकारी (SDM)' }, { en: 'District Magistrate / Collector', hi: 'ज़िलाधिकारी / कलेक्टर' }],
    },
  },
  {
    id: 'certificate',
    label: { en: 'Birth or death certificate', hi: 'जन्म या मृत्यु प्रमाण पत्र' },
    urban: {
      body: 'local',
      first: { en: 'Registrar at the municipal office, or the Civil Registration System portal', hi: 'नगर निकाय कार्यालय के रजिस्ट्रार, या नागरिक पंजीकरण प्रणाली पोर्टल' },
      escalate: [{ en: 'Municipal health officer', hi: 'नगर स्वास्थ्य अधिकारी' }, { en: 'District Registrar', hi: 'ज़िला रजिस्ट्रार' }],
      channel: { label: { en: 'Civil Registration System', hi: 'नागरिक पंजीकरण प्रणाली' }, url: 'https://dc.crsorgi.gov.in' },
    },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Panchayat secretary (the village registrar in many states)', hi: 'पंचायत सचिव (कई राज्यों में गाँव के रजिस्ट्रार)' },
      escalate: [{ en: 'Block Development Officer', hi: 'खंड विकास अधिकारी' }, { en: 'District Registrar', hi: 'ज़िला रजिस्ट्रार' }],
      channel: { label: { en: 'Civil Registration System', hi: 'नागरिक पंजीकरण प्रणाली' }, url: 'https://dc.crsorgi.gov.in' },
    },
  },
  {
    id: 'mgnrega',
    label: { en: 'MGNREGA work or wages', hi: 'मनरेगा का काम या मज़दूरी' },
    rural: {
      body: 'gram-panchayat',
      first: { en: 'Ask the gram panchayat for work in writing and keep the dated receipt', hi: 'ग्राम पंचायत से लिखित में काम माँगें और तारीख़ वाली रसीद रखें' },
      escalate: [{ en: 'Programme Officer at the block', hi: 'ब्लॉक के कार्यक्रम अधिकारी' }, { en: 'District Programme Coordinator (the DM)', hi: 'ज़िला कार्यक्रम समन्वयक (ज़िलाधिकारी)' }, { en: 'MGNREGA ombudsperson', hi: 'मनरेगा लोकपाल' }],
      channel: { label: { en: 'MGNREGA records', hi: 'मनरेगा रिकॉर्ड' }, url: 'https://nrega.nic.in' },
    },
  },
  {
    id: 'police',
    label: { en: 'Crime or safety', hi: 'अपराध या सुरक्षा' },
    urban: {
      body: 'police',
      first: { en: 'Emergency: 112. Otherwise the local police station; an FIR must be registered for a cognisable offence.', hi: 'आपातकाल: 112। वरना स्थानीय थाना; संज्ञेय अपराध में FIR दर्ज करना अनिवार्य है।' },
      escalate: [{ en: 'Superintendent of Police or DCP, in writing', hi: 'पुलिस अधीक्षक या DCP को लिखित में' }, { en: 'Judicial Magistrate', hi: 'न्यायिक मजिस्ट्रेट' }],
      channel: { label: { en: 'Emergency', hi: 'आपातकाल' }, phone: '112' },
    },
  },
  {
    id: 'pollution',
    label: { en: 'Pollution, smoke or garbage burning', hi: 'प्रदूषण, धुआँ या कूड़ा जलाना' },
    urban: {
      body: 'pollution-board',
      first: { en: 'CPCB Sameer app, or the state pollution board’s regional office', hi: 'CPCB समीर ऐप, या राज्य प्रदूषण बोर्ड का क्षेत्रीय कार्यालय' },
      escalate: [{ en: 'Member Secretary, State Pollution Control Board', hi: 'सदस्य सचिव, राज्य प्रदूषण नियंत्रण बोर्ड' }, { en: 'National Green Tribunal', hi: 'राष्ट्रीय हरित अधिकरण' }],
    },
  },
  {
    id: 'builder',
    label: { en: 'Builder or delayed flat', hi: 'बिल्डर या देर से मिलने वाला फ़्लैट' },
    urban: {
      body: 'rera',
      first: { en: 'Complaint on your state RERA’s website', hi: 'अपने राज्य RERA की वेबसाइट पर शिकायत' },
      escalate: [{ en: 'RERA Appellate Tribunal', hi: 'RERA अपीलीय न्यायाधिकरण' }, { en: 'High Court', hi: 'उच्च न्यायालय' }],
    },
  },
  {
    id: 'central',
    label: { en: 'Railways, post, passport or income tax', hi: 'रेल, डाक, पासपोर्ट या आयकर' },
    urban: {
      body: 'union-government',
      first: { en: 'The service’s own helpline (Rail Madad 139, India Post, Passport Seva), then CPGRAMS', hi: 'उसी सेवा की हेल्पलाइन (रेल मदद 139, इंडिया पोस्ट, पासपोर्ट सेवा), फिर CPGRAMS' },
      escalate: [{ en: 'CPGRAMS appeal', hi: 'CPGRAMS अपील' }, { en: 'Your MP', hi: 'आपके सांसद' }],
      channel: CPGRAMS,
    },
  },
];

/** The route for an issue where you live; issues with one route apply to both. */
export function routeFor(issue: Issue, settlement: Settlement): Route | undefined {
  return settlement === 'village' ? issue.rural ?? issue.urban : issue.urban ?? issue.rural;
}

/** Issues that make sense for this kind of place. */
export function issuesFor(settlement: Settlement): Issue[] {
  return ISSUES.filter((i) => (settlement === 'village' ? true : i.id !== 'mgnrega' && i.id !== 'village-road'))
    .filter((i) => (settlement === 'village' ? i.id !== 'city-street' : true));
}
