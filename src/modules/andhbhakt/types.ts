/**
 * Andhbhakt State Module — TypeScript interfaces.
 * Adapted from prisma/schema.prisma (Next.js version).
 * 
 * This module applies the Andhbhakt pattern (Claim vs Reality)
 * to all 28 state CMs. State government runs police, schools,
 * hospitals, and ration — this is where the real impact is.
 */

export interface StateInfo {
  id: string;
  name: string;             // "Uttar Pradesh"
  nameHi: string;           // "उत्तर प्रदेश"
  code: string;             // "UP"
  capital: string;          // "Lucknow"
  capitalHi: string;        // "लखनऊ"
  region: string;           // "North"
  population: number;       // in crores
  party: string;            // "BJP"
  partyColor: string;       // "#FF9933"
  cmName: string;           // "Yogi Adityanath"
  cmNameHi: string;         // "योगी आदित्यनाथ"
  cmSince: string;          // "2022"
  cmParty: string;          // "BJP"
}

export interface PinCodeInfo {
  id: string;
  pincode: number;          // 226001
  district: string;         // "Lucknow"
  districtHi: string;       // "लखनऊ"
  stateCode: string;        // "UP"
  latitude?: number;
  longitude?: number;
}

export type ClaimCategory =
  | 'स्कूल'      // School
  | 'अस्पताल'    // Hospital
  | 'सड़क'       // Road
  | 'राशन'      // Ration
  | 'पुलिस'     // Police
  | 'पानी'      // Water
  | 'बिजली'     // Power
  | 'रोज़गार'    // Employment
  | 'आवास'      // Housing
  | 'कृषि';     // Agriculture

export type SourceType =
  | 'tweet'
  | 'pib_release'
  | 'cag_report'
  | 'rti_response'
  | 'budget_document'
  | 'news_report'
  | 'citizen_photo';

export interface ClaimCard {
  id: string;
  stateCode: string;
  pincodeId?: string;
  category: ClaimCategory;

  // ── LEFT SIDE: दावा (The Claim) ──
  claimTextHi: string;        // Exact quote in Hindi
  claimTextEn: string;        // English translation
  claimNumber: string;        // "5 लाख ICU बेड", "₹6,812 Cr spent"
  claimedBy: string;          // "Chief Minister (sample)"
  claimedByHi: string;        // "मुख्यमंत्री (नमूना)"
  claimedByDesignation: string; // "मुख्यमंत्री, उत्तर प्रदेश"
  claimDate: string;          // "2024-03-14"
  claimOccasion: string;      // "Independence Day Speech"
  claimOccasionHi: string;    // "स्वतंत्रता दिवस भाषण"
  sourceUrl: string;          // Direct link to tweet/PIB/YouTube
  sourceType: SourceType;

  // ── RIGHT SIDE: हकीकत (The Reality) ──
  realityTextHi: string;      // Ground truth in Hindi
  realityTextEn: string;      // English
  realityNumber: string;      // "2 बेड, 1 डॉक्टर"
  realityPhotoUrl?: string;   // Photo evidence URL
  realityDate?: string;       // When verified

  // ── Accountability Nouns ──
  contractorName?: string;    // "ABC Constructions"
  contractorFirm?: string;    // "ABC Infra Pvt Ltd"
  officerName?: string;       // "Dr. R.K. Singh"
  officerDesignation?: string; // "BDO, Varanasi"
  officerDept?: string;       // "स्वास्थ्य विभाग"

  // ── Budget ──
  budgetAllocated?: number;   // in Crores
  budgetSpent?: number;       // in Crores

  // ── Meta ──
  verified: boolean;
  verificationSource?: string;
  upvotes: number;
}

export interface GroundPhoto {
  id: string;
  pincodeId: string;
  photoUrl: string;
  category: ClaimCategory;
  descriptionHi: string;
  descriptionEn: string;
  submittedAt: string;
  upvotes: number;
}
