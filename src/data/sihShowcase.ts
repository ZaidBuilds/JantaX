export interface SihProblemStatement {
  id: string;
  code: string;
  ministry: string;
  ministryHindi: string;
  badge: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  solutionMapping: string;
  solutionMappingHindi: string;
  demoPin: string;
  demoRoute: string;
  officialDataSources: string[];
  featuresDemonstrated: string[];
}

export const SIH_SHOWCASE_STATEMENTS: SihProblemStatement[] = [
  {
    id: 'sih-moe-schools',
    code: 'SIH26202',
    ministry: 'Ministry of Education (DoSEL)',
    ministryHindi: 'शिक्षा मंत्रालय (स्कूली शिक्षा एवं साक्षरता विभाग)',
    badge: 'Education & UDISE+',
    title: 'School Infrastructure & Facility Compliance Verification',
    titleHindi: 'सरकारी स्कूल बुनियादी ढांचा व सुविधा अनुपालन सत्यापन',
    description: 'Empowering school management committees and citizens to monitor functional toilets, drinking water, electricity, and teacher ratios against official UDISE+ claims.',
    descriptionHindi: 'आधिकारिक UDISE+ दावों के मुकाबले स्कूल शौचालयों, पेयजल, बिजली एवं शिक्षक-छात्र अनुपात की वास्तविक स्थिति की निगरानी।',
    solutionMapping: 'UDISE+ official records cross-verified against verified citizen facility ground-checks and geo-located photos on interactive Leaflet maps.',
    solutionMappingHindi: 'UDISE+ आधिकारिक डेटा को जियो-टैग्ड नागरिक साक्ष्यों और इंटरेक्टिव मैप पर सत्यापित करके प्रस्तुत किया गया।',
    demoPin: '250001',
    demoRoute: '/pin/250001/schools',
    officialDataSources: ['UDISE+ (DoSEL)', 'PM SHRI Portal', 'State School Education Gazettes'],
    featuresDemonstrated: ['UDISE+ Record Comparison', 'PTR & Infrastructure Scorecard', 'Exact Lat/Lng Facility Snapping', 'Citizen Verification Upload']
  },
  {
    id: 'sih-mord-pmgsy',
    code: 'SIH26202',
    ministry: 'Ministry of Rural Development / MoRTH',
    ministryHindi: 'ग्रामीण विकास मंत्रालय / सड़क परिवहन मंत्रालय',
    badge: 'PMGSY & Public Works',
    title: 'Public Works & PMGSY Quality & Delay Auditing',
    titleHindi: 'सार्वजनिक निर्माण एवं PMGSY सड़क गुणवत्ता व विलंब ऑडिट',
    description: 'Tracking physical progress vs financial disbursements for rural roads and highway packages, holding contractors accountable for delays and road defects.',
    descriptionHindi: 'ग्रामीण सड़कों व लोक निर्माण कार्यों में स्वीकृत बजट बनाम वास्तविक प्रगति की निगरानी एवं ठेकेदार जवाबदेही।',
    solutionMapping: 'Direct ingestion of PMGSY tender works orders, contractor blacklist database, delay month counters, and geo-tagged pothole/defect reporting.',
    solutionMappingHindi: 'PMGSY कार्य आदेश, ठेकेदार डिबारमेंट रिकॉर्ड और जियो-टैग्ड सड़क गड्ढों की रिपोर्टिंग का एकीकृत लेज़र।',
    demoPin: '221001',
    demoRoute: '/pin/221001/works',
    officialDataSources: ['OMMS (PMGSY)', 'Central Public Works Dept (CPWD)', 'GeM Procurement Ledger'],
    featuresDemonstrated: ['Work Order Budget vs Spend', 'Delay Months & Contractor Audit', 'Pothole Defect Pinpointing', 'Official vs Reality Status']
  },
  {
    id: 'sih-darpg-cpgrams',
    code: 'SIH26202',
    ministry: 'Department of Administrative Reforms & Public Grievances',
    ministryHindi: 'प्रशासनिक सुधार और लोक शिकायत विभाग (DARPG)',
    badge: 'CPGRAMS & Civic Grievance',
    title: 'Geo-Anchored Citizen Grievance & Evidence Redressal',
    titleHindi: 'जियो-एंकर नागरिक शिकायत निवारण एवं साक्ष्य संग्रह',
    description: 'A noise-free grievance reporting flow with client-side GPS accuracy validation, facility snapping, and anti-hallucination tracking for municipal and rural issues.',
    descriptionHindi: 'सटीक GPS लोकेशन, नजदीकी सार्वजनिक सुविधा स्नैपिंग और सत्यापन साक्ष्यों के साथ स्वच्छ शिकायत प्रणाली।',
    solutionMapping: 'Citizens drag an institutional pinpoint to exact defect coordinates with live camera evidence and auto-jurisdiction resolution (MP, MLA, Ward Councillor).',
    solutionMappingHindi: 'नागरिक मैप पर सटीक बिंदु चुनकर फोटो साक्ष्य अपलोड करते हैं और स्वतः संबंधित प्रतिनिधि व विभाग से लिंक होते हैं।',
    demoPin: '110001',
    demoRoute: '/report-issue',
    officialDataSources: ['CPGRAMS Redressal Guidelines', 'Nagar Palika Wards', 'OpenStreetMap GIS'],
    featuresDemonstrated: ['Interactive Pinpoint Map Snapping', 'EXIF / Device Geolocation Guard', 'Official Auto-Notification Drafting', '3-Tier Representative Mapping']
  },
  {
    id: 'sih-mohua-urban',
    code: 'SIH26202',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    ministryHindi: 'आवासन और शहरी कार्य मंत्रालय',
    badge: 'RERA & Urban Governance',
    title: 'RERA Housing Delivery & Municipal Ward Health',
    titleHindi: 'रेरा हाउसिंग प्रोजेक्ट्स व नगर निगम वार्ड स्वास्थ्य सूचकांक',
    description: 'Providing homebuyers with verified RERA registration status, completion deadlines, and delay penalties while monitoring ward-level civic sanitation.',
    descriptionHindi: 'घर खरीदारों के लिए रेरा प्रोजेक्ट्स की वैधानिक स्थिति, पजेशन डेडलाइन एवं वार्ड-स्तरीय नागरिक सेवाओं का ट्रैकिंग डैशबोर्ड।',
    solutionMapping: 'State RERA portal integration with builder project timelines, defect liability periods, and municipal ward councillor accountability.',
    solutionMappingHindi: 'राज्य रेरा रिकॉर्ड्स, बिल्डर डिफ़ॉल्ट ट्रैकिंग और वार्ड पार्षद जवाबदेही का एकीकृत शहरी डैशबोर्ड।',
    demoPin: '110001',
    demoRoute: '/pin/110001',
    officialDataSources: ['State RERA Authorities', 'Swachh Survekshan', 'Urban Local Body Portals'],
    featuresDemonstrated: ['RERA Delay Months Counter', 'Municipal Ward Councillor Card', 'Air Quality & Sanitation Indexes', 'Source Freshness Timestamp']
  }
];
