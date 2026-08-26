import type { LucideIcon } from 'lucide-react';
import type { Location } from './Location';
import type { Evidence } from './Evidence';
import type { Source } from './Source';

/**
 * ModuleRecord — Base type that every module's record extends.
 * Implements the Andhbhakt Pattern: Claim vs Reality on the same screen.
 * 
 * Every module (school, infra, hospital, RERA, etc.) extends this
 * to add domain-specific fields while inheriting the universal
 * accountability structure.
 */
export interface ModuleRecord {
  id: string;
  moduleId: ModuleId;         // Which module this belongs to
  location: Location;

  // ── Multilingual Identity ──
  titleEnglish: string;
  titleHindi: string;
  titleRegional: string;      // Marathi or state-specific language

  // ── The Andhbhakt Pattern: Claim vs Reality ──
  claim: {
    label: string;            // e.g., "72% Complete"
    labelHindi: string;       // e.g., "72% पूर्ण"
    value: string;            // Raw value for comparison
    source: Source;
  };
  reality: {
    label: string;            // e.g., "60% (Stalled)"
    labelHindi: string;
    value: string;
    evidenceCount: number;    // How many citizen reports back this
    confidenceLevel: 'low' | 'medium' | 'high';
  };

  // ── Accountability Nouns ──
  responsiblePerson: string;         // Named officer or contractor
  responsibleDesignation: string;    // Their title
  responsibleOrg: string;           // Their organization

  // ── Citizen Layer ──
  evidence: Evidence[];
  reportCount: number;
  lastReportDate: string;

  // ── Status ──
  status: string;
  statusHindi: string;
  statusRegional: string;

  // ── Meta ──
  createdAt: string;
  updatedAt: string;
}

/**
 * All 14 module IDs in the system.
 */
export type ModuleId =
  | 'infra'        // 1. सड़क-पुल हिसाब
  | 'school'       // 2. स्कूल ठीक करो
  | 'nagar'        // 3. नगर स्कोरबोर्ड
  | 'budget'       // 4. पिन हिसाब
  | 'contractor'   // 5. ठेकेदार लेजर
  | 'andhbhakt'     // 6. अंधभक्त स्टेट (State CM Accountability)
  | 'hospital'     // 7. अस्पताल जांच
  | 'rera'         // 8. RERA सच
  | 'ration'       // 9. राशन रिपोर्ट
  | 'utility'      // 10. पानी-बिजली मीटर
  | 'rti'          // 11. RTI ट्रैकर
  | 'pollution'    // 12. प्रदूषण नक्शा
  | 'land'         // 13. ज़मीन रजिस्ट्री
  | 'election'     // 14. चुनाव खर्चा
  | 'grievance'    // 15. शिकायत स्कोर
  | 'mplads'       // 16. सांसद/विधायक निधि
  | 'booth'        // 17. मतदान केंद्र & BLO
  | 'courts';      // 18. जिला न्यायालय & केस पेंडेंसी

/**
 * Module metadata — used by the Home page grid and sidebar navigation.
 */
export interface ModuleMeta {
  id: ModuleId;
  nameHindi: string;
  nameEnglish: string;
  icon: LucideIcon;           // Lucide icon component
  color: string;              // Module accent color (CSS variable)
  description: string;
  descriptionHindi: string;
  dataSource: string;         // Where data comes from
  isLive: boolean;            // false = stub/coming soon
  recordCount: number;        // How many records loaded
}
