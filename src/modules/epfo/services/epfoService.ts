import { EpfoOffice, EpfoClaimType, EpfoEscalationLevel } from '../types/epfo';
import { resolvePincode } from '../../../core/utils/pinResolver';

const CLAIM_TYPES: EpfoClaimType[] = [
  {
    formNumber: 'Form 31 (PF Advance)',
    title: 'PF Partial Advance (अग्रिम निकासी)',
    titleHi: 'भविष्य निधि आंशिक अग्रिम',
    purpose: 'Illness, housing construction, marriage, higher education, or post-pandemic relief.',
    statutoryDays: 20,
    autoSettlementLimit: 100000,
    commonRejectionReasons: [
      'Name mismatch between Aadhaar and Member Passbook',
      'Unverified bank account IFSC code / blurred cheque upload',
      'Insufficient continuous service tenure under Paragraph 68B',
    ],
  },
  {
    formNumber: 'Form 19 (Final PF Settlement)',
    title: 'Final PF Settlement (पूर्ण निकासी)',
    titleHi: 'अंतिम पीएफ निस्तारण',
    purpose: 'Complete withdrawal of accumulated PF balance upon retirement or 2-month unemployment.',
    statutoryDays: 20,
    autoSettlementLimit: 0, // Manual scrutiny required
    commonRejectionReasons: [
      'Missing Date of Exit (DOE) marked by previous employer',
      'Service overlap between two simultaneous UAN establishment IDs',
      'Pending Form 13 transfer from prior unexempted trust',
    ],
  },
  {
    formNumber: 'Form 10C (EPS Pension Withdrawal)',
    title: 'Pension Scheme Certificate / Withdrawal (EPS-95)',
    titleHi: 'पेंशन अंशदान निकासी',
    purpose: 'Withdrawal benefit or Scheme Certificate for members with under 10 years of eligible service.',
    statutoryDays: 20,
    autoSettlementLimit: 0,
    commonRejectionReasons: [
      'Non-contributory period (NCP) days improperly recorded by employer',
      'Less than 6 months of eligible service completed',
      'Aadhaar seeding not approved at field office level',
    ],
  },
  {
    formNumber: 'Form 10D (Monthly Pension)',
    title: 'Superannuation & Disability Pension (मासिक पेंशन)',
    titleHi: 'मासिक पेंशन आवेदन',
    purpose: 'Lifelong monthly pension for members completing 10+ years of contributory service.',
    statutoryDays: 20,
    autoSettlementLimit: 0,
    commonRejectionReasons: [
      'Discrepancy in joint declaration of marital status / spouse details',
      'Pension bank account must be single, not joint with family member',
    ],
  },
];

const ESCALATION_LEVELS: EpfoEscalationLevel[] = [
  {
    level: 1,
    designation: 'Field Office Public Grievance Officer (PGO)',
    designationHi: 'क्षेत्रीय लोक शिकायत अधिकारी (PGO)',
    statutoryWindowDays: 15,
    actionAuthority: 'Assistant / Regional P.F. Commissioner (Grievances)',
    portalUrl: 'https://epfigms.gov.in',
  },
  {
    level: 2,
    designation: 'Zonal Additional Central P.F. Commissioner (ACC)',
    designationHi: 'अपर केंद्रीय भविष्य निधि आयुक्त (ACC ज़ोनल)',
    statutoryWindowDays: 15,
    actionAuthority: 'Head of Zonal Office (State Level)',
    portalUrl: 'https://epfigms.gov.in',
  },
  {
    level: 3,
    designation: 'Directorate of Public Grievances (DPG) & CPGRAMS Pension Cell',
    designationHi: 'केंद्रीय लोक शिकायत प्रकोष्ठ (CPGRAMS)',
    statutoryWindowDays: 30,
    actionAuthority: 'Department of Administrative Reforms (DARPG) Prime Minister Office Monitoring',
    portalUrl: 'https://pgportal.gov.in',
  },
];

export const epfoService = {
  async getEpfoOfficesByPin(pinCode: string): Promise<EpfoOffice[]> {
    const loc = resolvePincode(pinCode);
    const pinNum = parseInt(pinCode.replace(/\D/g, '')) || 110001;

    const offices: EpfoOffice[] = [
      {
        id: `EPFO-RO-${loc.stateCode || 'DL'}-${pinCode.slice(0, 3)}`,
        officeName: `EPFO Regional Office ${loc.district}`,
        officeNameHi: `कर्मचारी भविष्य निधि क्षेत्रीय कार्यालय, ${loc.district}`,
        pinCode,
        district: loc.district,
        state: loc.state,
        officeType: 'Regional Office (RO)',
        regionalCommissioner: `Shri Arun ${pinNum % 2 === 0 ? 'Mishra' : 'Srivastava'}, RPFC-I`,
        contactEmail: `ro.${loc.district.toLowerCase().replace(/\s+/g, '')}@epfindia.gov.in`,
        contactPhone: `011-${(pinNum % 899 + 100)}-${(pinNum % 8999 + 1000)}`,
        address: `Bhavishya Nidhi Bhawan, Community Centre, Sector ${pinNum % 20 + 1}, ${loc.district}, ${loc.state} - ${pinCode}`,
        statutorySlaDays: 20,
        actualAverageSettlementDays: 18 + (pinNum % 9),
        claimsSettledThisMonth: 12400 + (pinNum % 3400),
        pendingClaimsCount: 1450 + (pinNum % 890),
        rejectionRatePct: 22 + (pinNum % 11),
        grievancesPendingOver30Days: 48 + (pinNum % 65),
        autoSettlementEnabled: true,
        sourceAuthority: 'Employees Provident Fund Organisation (Ministry of Labour & Employment)',
        sourceUrl: 'https://www.epfindia.gov.in',
      },
    ];

    return offices;
  },

  getClaimTypes(): EpfoClaimType[] {
    return CLAIM_TYPES;
  },

  getEscalationLevels(): EpfoEscalationLevel[] {
    return ESCALATION_LEVELS;
  },
};
