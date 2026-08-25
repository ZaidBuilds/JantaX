import { PincodeRecord, WorkOrder, Contractor, NamedOfficer, NamedPolitician, ClaimVsRealityData } from '../types';

export interface IndianPostalCircleInfo {
  state: string;
  stateCode: string;
  defaultCity: string;
  defaultDistrict: string;
  municipalBody: string;
  pwdDivision: string;
  stateEProcPortal: string;
  stateRtiPortal: string;
  statutoryAct: string;
  statutoryClause: string;
  lokayuktaAuthority: string;
  cagReportPrefix: string;
  regionalLanguage: 'en' | 'hi' | 'kn' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'ml' | 'pa';
}

export const POSTAL_CIRCLES: Record<string, IndianPostalCircleInfo> = {
  // 1: Northern Zone
  '11': {
    state: 'Delhi (NCT)',
    stateCode: 'DL',
    defaultCity: 'New Delhi',
    defaultDistrict: 'Central Delhi',
    municipalBody: 'Municipal Corporation of Delhi (MCD)',
    pwdDivision: 'Delhi PWD Road Division-I',
    stateEProcPortal: 'https://govtprocurement.delhi.gov.in',
    stateRtiPortal: 'https://rtionline.delhi.gov.in',
    statutoryAct: 'Delhi Municipal Corporation Act, 1957',
    statutoryClause: 'Section 216 & Section 303 (Liability for Defective Works)',
    lokayuktaAuthority: 'Lokayukta NCT of Delhi',
    cagReportPrefix: 'CAG Audit Report on Local Bodies (NCT Delhi) 2024',
    regionalLanguage: 'hi',
  },
  '12': {
    state: 'Haryana',
    stateCode: 'HR',
    defaultCity: 'Gurugram',
    defaultDistrict: 'Gurugram',
    municipalBody: 'Municipal Corporation of Gurugram (MCG)',
    pwdDivision: 'Haryana PWD (B&R) Division',
    stateEProcPortal: 'https://etenders.hry.nic.in',
    stateRtiPortal: 'https://rtiharyana.gov.in',
    statutoryAct: 'Haryana Municipal Corporation Act, 1994',
    statutoryClause: 'Section 138 (Contractor Defect Liability Enforcement)',
    lokayuktaAuthority: 'Haryana Lokayukta',
    cagReportPrefix: 'CAG Report No. 3 of 2024 (Haryana Local Bodies)',
    regionalLanguage: 'hi',
  },
  '13': {
    state: 'Haryana',
    stateCode: 'HR',
    defaultCity: 'Faridabad / Panchkula',
    defaultDistrict: 'Faridabad',
    municipalBody: 'Faridabad Municipal Corporation (FMC)',
    pwdDivision: 'Haryana Urban Development Division',
    stateEProcPortal: 'https://etenders.hry.nic.in',
    stateRtiPortal: 'https://rtiharyana.gov.in',
    statutoryAct: 'Haryana Municipal Corporation Act, 1994',
    statutoryClause: 'Section 138 (Contractor Defect Liability Enforcement)',
    lokayuktaAuthority: 'Haryana Lokayukta',
    cagReportPrefix: 'CAG Report No. 3 of 2024 (Haryana Local Bodies)',
    regionalLanguage: 'hi',
  },
  '14': {
    state: 'Punjab',
    stateCode: 'PB',
    defaultCity: 'Ludhiana',
    defaultDistrict: 'Ludhiana',
    municipalBody: 'Municipal Corporation Ludhiana',
    pwdDivision: 'Punjab PWD B&R Division',
    stateEProcPortal: 'https://eproc.punjab.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Punjab Municipal Corporation Act, 1976',
    statutoryClause: 'Section 172 (Defect Rectification Mandatory Guarantee)',
    lokayuktaAuthority: 'Punjab Lokpal',
    cagReportPrefix: 'CAG State Audit Report Punjab (Local Audit)',
    regionalLanguage: 'pa',
  },
  '16': {
    state: 'Chandigarh (UT) & Punjab',
    stateCode: 'CH',
    defaultCity: 'Chandigarh',
    defaultDistrict: 'Chandigarh',
    municipalBody: 'Municipal Corporation Chandigarh (MCC)',
    pwdDivision: 'Chandigarh Administration Engineering Dept',
    stateEProcPortal: 'https://etenders.chd.nic.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Punjab Municipal Corporation Act (As Extended to Chandigarh)',
    statutoryClause: 'Section 84 & 172 (Quality Assurance Mandate)',
    lokayuktaAuthority: 'CVC Vigilance Commission',
    cagReportPrefix: 'CAG Report on Union Territory of Chandigarh',
    regionalLanguage: 'pa',
  },
  '17': {
    state: 'Himachal Pradesh',
    stateCode: 'HP',
    defaultCity: 'Shimla',
    defaultDistrict: 'Shimla',
    municipalBody: 'Municipal Corporation Shimla (SMC)',
    pwdDivision: 'HP PWD Hilly Terrain Division',
    stateEProcPortal: 'https://hptenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Himachal Pradesh Municipal Corporation Act, 1994',
    statutoryClause: 'Section 162 (Road & Slope Stability Warranty)',
    lokayuktaAuthority: 'Himachal Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report on HP Urban Local Bodies',
    regionalLanguage: 'hi',
  },
  '18': {
    state: 'Jammu & Kashmir (UT)',
    stateCode: 'JK',
    defaultCity: 'Jammu',
    defaultDistrict: 'Jammu',
    municipalBody: 'Jammu Municipal Corporation (JMC)',
    pwdDivision: 'J&K PWD (R&B) Jammu Circle',
    stateEProcPortal: 'https://jktenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Jammu & Kashmir Municipal Corporation Act, 2000',
    statutoryClause: 'Section 144 (Road Works Assurance Standards)',
    lokayuktaAuthority: 'J&K Anti-Corruption Bureau (ACB)',
    cagReportPrefix: 'CAG Report on UT of Jammu & Kashmir',
    regionalLanguage: 'hi',
  },
  '19': {
    state: 'Jammu & Kashmir / Ladakh',
    stateCode: 'JK',
    defaultCity: 'Srinagar',
    defaultDistrict: 'Srinagar',
    municipalBody: 'Srinagar Municipal Corporation (SMC)',
    pwdDivision: 'J&K PWD (R&B) Srinagar Circle',
    stateEProcPortal: 'https://jktenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Jammu & Kashmir Municipal Corporation Act, 2000',
    statutoryClause: 'Section 144 (Bituminous Surface Standards)',
    lokayuktaAuthority: 'J&K Anti-Corruption Bureau (ACB)',
    cagReportPrefix: 'CAG Report on UT of Jammu & Kashmir',
    regionalLanguage: 'hi',
  },

  // 2: Uttar Pradesh & Uttarakhand
  '20': {
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    defaultCity: 'Noida / Greater Noida / Ghaziabad',
    defaultDistrict: 'Gautam Buddha Nagar',
    municipalBody: 'Noida Authority / Ghaziabad Nagar Nigam',
    pwdDivision: 'UP PWD Division Noida Circle',
    stateEProcPortal: 'https://etender.up.nic.in',
    stateRtiPortal: 'https://rtionline.up.gov.in',
    statutoryAct: 'Uttar Pradesh Municipal Corporation Act, 1959',
    statutoryClause: 'Section 355 (Personal Surcharge for Negligent Infrastructure)',
    lokayuktaAuthority: 'Uttar Pradesh Lokayukta',
    cagReportPrefix: 'CAG State Report on UP Urban Local Bodies 2024',
    regionalLanguage: 'hi',
  },
  '22': {
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    defaultCity: 'Lucknow',
    defaultDistrict: 'Lucknow',
    municipalBody: 'Lucknow Nagar Nigam (LNN)',
    pwdDivision: 'UP PWD Chief Engineer Central Zone',
    stateEProcPortal: 'https://etender.up.nic.in',
    stateRtiPortal: 'https://rtionline.up.gov.in',
    statutoryAct: 'Uttar Pradesh Municipal Corporation Act, 1959',
    statutoryClause: 'Section 355 & 192 (Guarantee on Public Works)',
    lokayuktaAuthority: 'Uttar Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report No. 5 (UP Local Bodies & PWD Audits)',
    regionalLanguage: 'hi',
  },
  '24': {
    state: 'Uttarakhand',
    stateCode: 'UK',
    defaultCity: 'Dehradun',
    defaultDistrict: 'Dehradun',
    municipalBody: 'Dehradun Nagar Nigam',
    pwdDivision: 'Uttarakhand PWD Hill Division',
    stateEProcPortal: 'https://uktenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Uttarakhand Municipal Corporation Act',
    statutoryClause: 'Section 240 (Mandatory Rain Resilience Clause)',
    lokayuktaAuthority: 'Uttarakhand Lokayukta',
    cagReportPrefix: 'CAG Report on Uttarakhand Local Self Govt',
    regionalLanguage: 'hi',
  },
  '28': {
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    defaultCity: 'Varanasi',
    defaultDistrict: 'Varanasi',
    municipalBody: 'Varanasi Nagar Nigam (VNN)',
    pwdDivision: 'UP PWD Eastern Zone Varanasi',
    stateEProcPortal: 'https://etender.up.nic.in',
    stateRtiPortal: 'https://rtionline.up.gov.in',
    statutoryAct: 'Uttar Pradesh Municipal Corporation Act, 1959',
    statutoryClause: 'Section 355 (Contractor Liability)',
    lokayuktaAuthority: 'Uttar Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report No. 5 (UP Municipal Audit)',
    regionalLanguage: 'hi',
  },

  // 3: Rajasthan & Gujarat
  '30': {
    state: 'Rajasthan',
    stateCode: 'RJ',
    defaultCity: 'Jaipur',
    defaultDistrict: 'Jaipur',
    municipalBody: 'Jaipur Municipal Corporation (Heritage/Greater)',
    pwdDivision: 'Rajasthan PWD Quality Control Division',
    stateEProcPortal: 'https://eproc.rajasthan.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Rajasthan Municipalities Act, 2009',
    statutoryClause: 'Section 297 (Contractor Liability & Blacklisting Rules)',
    lokayuktaAuthority: 'Rajasthan Lokayukta',
    cagReportPrefix: 'CAG Report on Rajasthan Urban Bodies 2024',
    regionalLanguage: 'hi',
  },
  '38': {
    state: 'Gujarat',
    stateCode: 'GJ',
    defaultCity: 'Ahmedabad',
    defaultDistrict: 'Ahmedabad',
    municipalBody: 'Ahmedabad Municipal Corporation (AMC)',
    pwdDivision: 'Gujarat R&B Department Road Circle',
    stateEProcPortal: 'https://www.nprocure.com',
    stateRtiPortal: 'https://rtionline.gujarat.gov.in',
    statutoryAct: 'Gujarat Provincial Municipal Corporations (GPMC) Act, 1949',
    statutoryClause: 'Section 481 (Execution & DLP Warranty Guarantee)',
    lokayuktaAuthority: 'Gujarat Lokayukta',
    cagReportPrefix: 'CAG Audit on Gujarat Urban Local Bodies',
    regionalLanguage: 'gu',
  },
  '39': {
    state: 'Gujarat',
    stateCode: 'GJ',
    defaultCity: 'Surat',
    defaultDistrict: 'Surat',
    municipalBody: 'Surat Municipal Corporation (SMC)',
    pwdDivision: 'Surat Municipal Works & PWD Division',
    stateEProcPortal: 'https://www.nprocure.com',
    stateRtiPortal: 'https://rtionline.gujarat.gov.in',
    statutoryAct: 'Gujarat Provincial Municipal Corporations Act, 1949',
    statutoryClause: 'Section 481 (Quality Assurance)',
    lokayuktaAuthority: 'Gujarat Lokayukta',
    cagReportPrefix: 'CAG Audit Report Gujarat Municipalities',
    regionalLanguage: 'gu',
  },

  // 4: Maharashtra, MP, Chhattisgarh, Goa
  '40': {
    state: 'Maharashtra',
    stateCode: 'MH',
    defaultCity: 'Mumbai',
    defaultDistrict: 'Mumbai Suburban / Mumbai City',
    municipalBody: 'Brihanmumbai Municipal Corporation (BMC)',
    pwdDivision: 'BMC Roads & Traffic Infrastructure Dept',
    stateEProcPortal: 'https://mahatenders.gov.in',
    stateRtiPortal: 'https://rtionline.maharashtra.gov.in',
    statutoryAct: 'Mumbai Municipal Corporation (MMC) Act, 1888',
    statutoryClause: 'Section 303 & Section 64 (Executive Officer Surcharge)',
    lokayuktaAuthority: 'Maharashtra Lokayukta',
    cagReportPrefix: 'CAG Audit on Maharashtra Municipal Corporations 2024',
    regionalLanguage: 'mr',
  },
  '41': {
    state: 'Maharashtra',
    stateCode: 'MH',
    defaultCity: 'Pune',
    defaultDistrict: 'Pune',
    municipalBody: 'Pune Municipal Corporation (PMC)',
    pwdDivision: 'Maharashtra PWD Pune Road Division',
    stateEProcPortal: 'https://mahatenders.gov.in',
    stateRtiPortal: 'https://rtionline.maharashtra.gov.in',
    statutoryAct: 'Maharashtra Municipal Corporations Act, 1949',
    statutoryClause: 'Section 294 (Warranty & Defect Liability Enforcement)',
    lokayuktaAuthority: 'Maharashtra Lokayukta',
    cagReportPrefix: 'CAG Report No. 2 of 2024 (Maharashtra Local Bodies)',
    regionalLanguage: 'mr',
  },
  '45': {
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    defaultCity: 'Indore',
    defaultDistrict: 'Indore',
    municipalBody: 'Indore Municipal Corporation (IMC)',
    pwdDivision: 'MP PWD Road Division Indore',
    stateEProcPortal: 'https://mptenders.gov.in',
    stateRtiPortal: 'https://rtionline.mp.gov.in',
    statutoryAct: 'Madhya Pradesh Municipal Corporation Act, 1956',
    statutoryClause: 'Section 374 (Contractor Guarantee & Recovery)',
    lokayuktaAuthority: 'Madhya Pradesh Lokayukta',
    cagReportPrefix: 'CAG State Report on MP Urban Bodies',
    regionalLanguage: 'hi',
  },
  '46': {
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    defaultCity: 'Bhopal',
    defaultDistrict: 'Bhopal',
    municipalBody: 'Bhopal Municipal Corporation (BMC MP)',
    pwdDivision: 'MP PWD Capital Works Division',
    stateEProcPortal: 'https://mptenders.gov.in',
    stateRtiPortal: 'https://rtionline.mp.gov.in',
    statutoryAct: 'Madhya Pradesh Municipal Corporation Act, 1956',
    statutoryClause: 'Section 374 (Contractor Defect Liability)',
    lokayuktaAuthority: 'Madhya Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report MP Municipalities 2024',
    regionalLanguage: 'hi',
  },
  '49': {
    state: 'Chhattisgarh',
    stateCode: 'CG',
    defaultCity: 'Raipur',
    defaultDistrict: 'Raipur',
    municipalBody: 'Raipur Municipal Corporation (RMC)',
    pwdDivision: 'Chhattisgarh PWD Division',
    stateEProcPortal: 'https://eproc.cgstate.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Chhattisgarh Municipal Corporation Act',
    statutoryClause: 'Section 289 (Defect Liability Clause)',
    lokayuktaAuthority: 'Chhattisgarh Lokayukta',
    cagReportPrefix: 'CAG Report on Chhattisgarh Local Bodies',
    regionalLanguage: 'hi',
  },

  // 5: AP, Telangana, Karnataka
  '50': {
    state: 'Telangana',
    stateCode: 'TS',
    defaultCity: 'Hyderabad',
    defaultDistrict: 'Hyderabad',
    municipalBody: 'Greater Hyderabad Municipal Corporation (GHMC)',
    pwdDivision: 'Telangana R&B Department Road Division',
    stateEProcPortal: 'https://tender.telangana.gov.in',
    stateRtiPortal: 'https://rtionline.telangana.gov.in',
    statutoryAct: 'Greater Hyderabad Municipal Corporation Act, 1955',
    statutoryClause: 'Section 162 & 288 (3-Year Road Warranty Directive)',
    lokayuktaAuthority: 'Telangana Lokayukta',
    cagReportPrefix: 'CAG Audit on GHMC & Telangana Urban Local Bodies 2024',
    regionalLanguage: 'te',
  },
  '52': {
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    defaultCity: 'Vijayawada / Amaravati',
    defaultDistrict: 'NTR District / Guntur',
    municipalBody: 'Vijayawada Municipal Corporation (VMC)',
    pwdDivision: 'AP R&B Department Road Circle',
    stateEProcPortal: 'https://apeprocurement.gov.in',
    stateRtiPortal: 'https://rtionline.ap.gov.in',
    statutoryAct: 'Andhra Pradesh Municipal Corporations Act, 1994',
    statutoryClause: 'Section 184 (Quality Assurance Directive)',
    lokayuktaAuthority: 'Andhra Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report on AP Local Bodies',
    regionalLanguage: 'te',
  },
  '53': {
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    defaultCity: 'Visakhapatnam',
    defaultDistrict: 'Visakhapatnam',
    municipalBody: 'Greater Visakhapatnam Municipal Corporation (GVMC)',
    pwdDivision: 'AP PWD Coastal Zone Division',
    stateEProcPortal: 'https://apeprocurement.gov.in',
    stateRtiPortal: 'https://rtionline.ap.gov.in',
    statutoryAct: 'Andhra Pradesh Municipal Corporations Act, 1994',
    statutoryClause: 'Section 184 (Defect Liability)',
    lokayuktaAuthority: 'Andhra Pradesh Lokayukta',
    cagReportPrefix: 'CAG Report AP Municipalities',
    regionalLanguage: 'te',
  },
  '56': {
    state: 'Karnataka',
    stateCode: 'KA',
    defaultCity: 'Bengaluru',
    defaultDistrict: 'Bengaluru Urban',
    municipalBody: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    pwdDivision: 'BBMP Major Roads & Infrastructure Division',
    stateEProcPortal: 'https://kppp.karnataka.gov.in',
    stateRtiPortal: 'https://rtionline.karnataka.gov.in',
    statutoryAct: 'Karnataka Municipal Corporations (KMC) Act, 1976 / BBMP Act 2020',
    statutoryClause: 'Section 166 (Personal Liability for Substandard Execution) & Section 303',
    lokayuktaAuthority: 'Karnataka Lokayukta (Justice B.S. Patil Commission)',
    cagReportPrefix: 'CAG Report No. 4 of 2024 (Local Bodies Karnataka)',
    regionalLanguage: 'kn',
  },
  '57': {
    state: 'Karnataka',
    stateCode: 'KA',
    defaultCity: 'Mysuru / Mangaluru',
    defaultDistrict: 'Mysuru / Dakshina Kannada',
    municipalBody: 'Mysuru City Corporation (MCC) / Mangaluru MCC',
    pwdDivision: 'Karnataka PWD South Zone',
    stateEProcPortal: 'https://kppp.karnataka.gov.in',
    stateRtiPortal: 'https://rtionline.karnataka.gov.in',
    statutoryAct: 'Karnataka Municipalities Act, 1964',
    statutoryClause: 'Section 166 (Contractor Recovery)',
    lokayuktaAuthority: 'Karnataka Lokayukta',
    cagReportPrefix: 'CAG State Report on Karnataka Municipalities',
    regionalLanguage: 'kn',
  },

  // 6: Tamil Nadu, Kerala, Puducherry
  '60': {
    state: 'Tamil Nadu',
    stateCode: 'TN',
    defaultCity: 'Chennai',
    defaultDistrict: 'Chennai',
    municipalBody: 'Greater Chennai Corporation (GCC)',
    pwdDivision: 'GCC Bus Route Roads & Special Projects Dept',
    stateEProcPortal: 'https://tntenders.gov.in',
    stateRtiPortal: 'https://rtionline.tn.gov.in',
    statutoryAct: 'Tamil Nadu Urban Local Bodies Act, 1998 (Amended 2023)',
    statutoryClause: 'Section 383 (Mandatory 5-Year DLP Warranty for Mastic Bitumen)',
    lokayuktaAuthority: 'Tamil Nadu Lokayukta',
    cagReportPrefix: 'CAG Audit on GCC & Tamil Nadu Urban Local Bodies 2024',
    regionalLanguage: 'ta',
  },
  '64': {
    state: 'Tamil Nadu',
    stateCode: 'TN',
    defaultCity: 'Coimbatore',
    defaultDistrict: 'Coimbatore',
    municipalBody: 'Coimbatore City Municipal Corporation (CCMC)',
    pwdDivision: 'TN Highways & Minor Ports Division',
    stateEProcPortal: 'https://tntenders.gov.in',
    stateRtiPortal: 'https://rtionline.tn.gov.in',
    statutoryAct: 'Tamil Nadu Urban Local Bodies Act, 1998',
    statutoryClause: 'Section 383 (Defect Liability)',
    lokayuktaAuthority: 'Tamil Nadu Lokayukta',
    cagReportPrefix: 'CAG Report No. 3 (TN Municipal Audit)',
    regionalLanguage: 'ta',
  },
  '68': {
    state: 'Kerala',
    stateCode: 'KL',
    defaultCity: 'Kochi (Cochin)',
    defaultDistrict: 'Ernakulam',
    municipalBody: 'Kochi Municipal Corporation (KMC Kerala)',
    pwdDivision: 'Kerala PWD Roads Division Ernakulam',
    stateEProcPortal: 'https://etenders.kerala.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Kerala Municipality Act, 1994',
    statutoryClause: 'Section 422 (High Court Mandated 3-Year Running Guarantee Clause)',
    lokayuktaAuthority: 'Kerala Lokayukta',
    cagReportPrefix: 'CAG Report on Kerala Urban Local Bodies 2024',
    regionalLanguage: 'ml',
  },
  '69': {
    state: 'Kerala',
    stateCode: 'KL',
    defaultCity: 'Thiruvananthapuram',
    defaultDistrict: 'Thiruvananthapuram',
    municipalBody: 'Thiruvananthapuram Municipal Corporation',
    pwdDivision: 'Kerala PWD Capital Division',
    stateEProcPortal: 'https://etenders.kerala.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Kerala Municipality Act, 1994',
    statutoryClause: 'Section 422 (Running Guarantee Clause)',
    lokayuktaAuthority: 'Kerala Lokayukta',
    cagReportPrefix: 'CAG Report on Kerala Urban Local Bodies',
    regionalLanguage: 'ml',
  },

  // 7: West Bengal, Odisha, North-East
  '70': {
    state: 'West Bengal',
    stateCode: 'WB',
    defaultCity: 'Kolkata',
    defaultDistrict: 'Kolkata',
    municipalBody: 'Kolkata Municipal Corporation (KMC)',
    pwdDivision: 'KMC Roads & Asphalt Division',
    stateEProcPortal: 'https://wbtenders.gov.in',
    stateRtiPortal: 'https://rtionline.wb.gov.in',
    statutoryAct: 'Kolkata Municipal Corporation Act, 1980',
    statutoryClause: 'Section 353 & Section 602 (Recovery of Public Loss for Substandard Work)',
    lokayuktaAuthority: 'West Bengal Lokayukta',
    cagReportPrefix: 'CAG Audit on KMC & West Bengal Municipalities 2024',
    regionalLanguage: 'bn',
  },
  '75': {
    state: 'Odisha',
    stateCode: 'OD',
    defaultCity: 'Bhubaneswar',
    defaultDistrict: 'Khurda',
    municipalBody: 'Bhubaneswar Municipal Corporation (BMC Odisha)',
    pwdDivision: 'Odisha Works Department Roads Division',
    stateEProcPortal: 'https://tendersodisha.gov.in',
    stateRtiPortal: 'https://rtionline.odisha.gov.in',
    statutoryAct: 'Odisha Municipal Corporation Act, 2003',
    statutoryClause: 'Section 248 (Contractor Guarantee Clause)',
    lokayuktaAuthority: 'Odisha Lokayukta',
    cagReportPrefix: 'CAG State Report on Odisha Local Bodies',
    regionalLanguage: 'en',
  },
  '78': {
    state: 'Assam',
    stateCode: 'AS',
    defaultCity: 'Guwahati',
    defaultDistrict: 'Kamrup Metropolitan',
    municipalBody: 'Guwahati Municipal Corporation (GMC)',
    pwdDivision: 'Assam PWD (Roads) Division',
    stateEProcPortal: 'https://assamtenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Guwahati Municipal Corporation Act, 1969',
    statutoryClause: 'Section 179 (Monsoon Flooding & Surface Assurance)',
    lokayuktaAuthority: 'Upa-Lokayukta Assam',
    cagReportPrefix: 'CAG Report on Assam Urban Local Bodies 2024',
    regionalLanguage: 'en',
  },

  // 8: Bihar & Jharkhand
  '80': {
    state: 'Bihar',
    stateCode: 'BR',
    defaultCity: 'Patna',
    defaultDistrict: 'Patna',
    municipalBody: 'Patna Municipal Corporation (PMC Bihar)',
    pwdDivision: 'Bihar Road Construction Department (RCD) Division',
    stateEProcPortal: 'https://eproc2.bihar.gov.in',
    stateRtiPortal: 'https://rtionline.bihar.gov.in',
    statutoryAct: 'Bihar Municipal Act, 2007',
    statutoryClause: 'Section 276 & Section 487 (Zero Tolerance Defect Clause)',
    lokayuktaAuthority: 'Bihar Lokayukta',
    cagReportPrefix: 'CAG Report No. 4 of 2024 (Bihar Urban Local Bodies)',
    regionalLanguage: 'hi',
  },
  '83': {
    state: 'Jharkhand',
    stateCode: 'JH',
    defaultCity: 'Ranchi',
    defaultDistrict: 'Ranchi',
    municipalBody: 'Ranchi Municipal Corporation (RMC Jharkhand)',
    pwdDivision: 'Jharkhand Road Construction Department',
    stateEProcPortal: 'https://jharkhandtenders.gov.in',
    stateRtiPortal: 'https://rtionline.gov.in',
    statutoryAct: 'Jharkhand Municipal Act, 2011',
    statutoryClause: 'Section 232 (Contractor Warranty & Surcharge)',
    lokayuktaAuthority: 'Jharkhand Lokayukta',
    cagReportPrefix: 'CAG State Report on Jharkhand Municipalities',
    regionalLanguage: 'hi',
  },
};

/**
 * Decode any 6-digit Indian PIN Code into geographical & statutory jurisdiction
 */
export function decodeIndianPincode(pincode: string): IndianPostalCircleInfo {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  const prefix2 = cleanPin.slice(0, 2);

  if (POSTAL_CIRCLES[prefix2]) {
    return POSTAL_CIRCLES[prefix2];
  }

  // Fallback based on 1st digit (Postal Zone)
  const zone = cleanPin.charAt(0);
  switch (zone) {
    case '1':
      return POSTAL_CIRCLES['11']; // North
    case '2':
      return POSTAL_CIRCLES['22']; // UP / UK
    case '3':
      return POSTAL_CIRCLES['30']; // Rajasthan / Gujarat
    case '4':
      return POSTAL_CIRCLES['40']; // Maharashtra / MP
    case '5':
      return POSTAL_CIRCLES['56']; // South 1 (KA, TS, AP)
    case '6':
      return POSTAL_CIRCLES['60']; // South 2 (TN, KL)
    case '7':
      return POSTAL_CIRCLES['70']; // East & NE (WB, OD, Assam)
    case '8':
      return POSTAL_CIRCLES['80']; // Bihar / Jharkhand
    default:
      return POSTAL_CIRCLES['11'];
  }
}

/**
 * Generate a deterministic Pan-India PincodeRecord for ANY 6-digit postal code
 */
export function generatePanIndiaPincodeRecord(pincode: string): PincodeRecord {
  const cleanPin = pincode.replace(/\D/g, '').padStart(6, '0').slice(0, 6);
  const info = decodeIndianPincode(cleanPin);

  // Deterministic values based on PIN digits
  const pinNum = parseInt(cleanPin, 10) || 560034;
  const funds = (12 + (pinNum % 83) * 0.4).toFixed(1);
  const monopolyShare = 48 + (pinNum % 39);
  const totalWorks = 14 + (pinNum % 19);
  const failedWorks = Math.max(3, Math.round(totalWorks * (0.35 + (pinNum % 25) / 100)));
  const dlpBreaches = Math.max(2, failedWorks - 1);

  const contractorNames = [
    `${info.stateCode} Highway Infra Projects Pvt Ltd`,
    `Bharat Metro Pavements & Buildcon LLP`,
    `Apex Coastal Urban Developers`,
    `Maharaja Roads & Bridges Consortium`,
    `Universal Bitumen Infrastructure Ltd`,
  ];
  const chosenContractor = contractorNames[pinNum % contractorNames.length];

  const eeNames = [
    { name: 'Er. R. K. Sharma', desig: 'Executive Engineer (Civil/Roads)' },
    { name: 'Er. S. N. Mukherjee', desig: 'Executive Engineer (Infrastructure)' },
    { name: 'Er. M. K. Patil', desig: 'Executive Engineer (PWD Division)' },
    { name: 'Er. V. Subramaniam', desig: 'Executive Engineer (Ward Infrastructure)' },
    { name: 'Er. Arvind Singh Yadav', desig: 'Executive Engineer (Urban Works)' },
    { name: 'Er. K. Suresh Reddy', desig: 'Executive Engineer (Road Construction)' },
  ];
  const chosenEe = eeNames[pinNum % eeNames.length];

  const mlaNames = [
    { name: 'Shri A. K. Verma', role: 'MLA' as const, party: 'Constituency Chairperson' },
    { name: 'Smt. Preeti Deshmukh', role: 'MLA' as const, party: 'Urban Development Committee' },
    { name: 'Shri R. Annamalai', role: 'MLA' as const, party: 'Ward Action Committee' },
    { name: 'Shri Manoj Jha', role: 'MLA' as const, party: 'Public Accounts Panel' },
  ];
  const chosenMla = mlaNames[pinNum % mlaNames.length];

  return {
    pincode: cleanPin,
    areaName: `${info.defaultCity} Sector ${cleanPin.slice(3, 6)} Zone`,
    wardName: `Ward ${cleanPin.slice(2, 5)} - ${info.defaultDistrict}`,
    city: info.defaultCity,
    state: info.state,
    totalFundsSpentCrores: parseFloat(funds),
    dominantContractor: {
      contractorId: `cont-pan-${cleanPin.slice(0, 3)}`,
      name: chosenContractor,
      directors: ['Sunil K. Aggarwal', 'Rajiv Mehta', 'Pooja Singhania'],
      sharePercent: monopolyShare,
    },
    executiveEngineer: {
      name: chosenEe.name,
      designation: chosenEe.desig,
      department: info.pwdDivision,
      officeAddress: `Office of Executive Engineer, ${info.municipalBody}, Circle ${cleanPin.slice(0, 3)}`,
      phoneOffice: '011-2338-9900 (Desk)',
      signedCertificateDate: '2023-11-15',
    },
    electedRepresentative: {
      name: chosenMla.name,
      role: chosenMla.role,
      constituency: `${info.defaultCity} North-Central Constituency`,
      party: chosenMla.party,
    },
    totalAuditedWorks: totalWorks,
    failedWorksCount: failedWorks,
    activeDlpBreachesCount: dlpBreaches,
    cagAuditNotes: [
      `${info.cagReportPrefix}: ${monopolyShare}% tenders won by single bidder cartel without competitive rate variance.`,
      `Measurement Book MB/2023/EE-${cleanPin.slice(0, 3)} billed ₹${(parseFloat(funds) * 0.4).toFixed(1)} Cr for 50mm Bituminous Concrete; field core-cuts revealed only 18mm thickness.`,
      `Zero penalty recovered under ${info.statutoryAct} despite ${dlpBreaches} active monsoon washouts during 36-month mandatory warranty.`,
    ],
    keyRoads: [
      `Main Station Arterial Road (PIN ${cleanPin})`,
      `Hospital & Market Link Corridor`,
      `Ring Road Bypass Junction to Bypass`,
      `Central PHC Access Way`,
    ],
  };
}

/**
 * Prominent sample pincodes from all 4 corners of India
 */
export const PAN_INDIA_POPULAR_PINCODES = [
  { pin: '110001', name: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
  { pin: '400001', name: 'Fort / CST', city: 'Mumbai', state: 'Maharashtra' },
  { pin: '560034', name: 'Koramangala', city: 'Bengaluru', state: 'Karnataka' },
  { pin: '700001', name: 'BBD Bagh', city: 'Kolkata', state: 'West Bengal' },
  { pin: '600001', name: 'George Town', city: 'Chennai', state: 'Tamil Nadu' },
  { pin: '500001', name: 'Abids / Charminar', city: 'Hyderabad', state: 'Telangana' },
  { pin: '226001', name: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh' },
  { pin: '800001', name: 'Patna GPO', city: 'Patna', state: 'Bihar' },
  { pin: '302001', name: 'M.I. Road', city: 'Jaipur', state: 'Rajasthan' },
  { pin: '380001', name: 'Bhadra / Ashram Rd', city: 'Ahmedabad', state: 'Gujarat' },
  { pin: '682001', name: 'Marine Drive / Fort', city: 'Kochi', state: 'Kerala' },
  { pin: '781001', name: 'Pan Bazar', city: 'Guwahati', state: 'Assam' },
  { pin: '190001', name: 'Lal Chowk', city: 'Srinagar', state: 'Jammu & Kashmir' },
  { pin: '160017', name: 'Sector 17', city: 'Chandigarh', state: 'Chandigarh' },
  { pin: '452001', name: 'Rajwada', city: 'Indore', state: 'Madhya Pradesh' },
  { pin: '751001', name: 'Master Canteen', city: 'Bhubaneswar', state: 'Odisha' },
  { pin: '834001', name: 'Main Road', city: 'Ranchi', state: 'Jharkhand' },
  { pin: '395001', name: 'Chowk Bazar', city: 'Surat', state: 'Gujarat' },
];
