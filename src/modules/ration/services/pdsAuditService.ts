/**
 * JantaX — NFSA PDS Biometric Quota Fulfillment & DGRO Petition Engine
 *
 * Pure-logic, zero-side-effect module that computes:
 *   1. Fair Price Shop (FPS) quota fulfillment percentages
 *   2. Ghost-card detection (registered beneficiaries vs actual distribution)
 *   3. NFSA Section 15 DGRO Grievance Petition generator
 *
 * All functions are deterministic and unit-testable without network mocking.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PdsAuditEntry {
  fpsLicenseNo: string;
  fpsArea: string;
  registeredBeneficiaries: number;
  actualDistributionCount: number;
  quotaFulfillmentPct: number;
  wheatAllocatedKg: number;
  wheatDistributedKg: number;
  riceAllocatedKg: number;
  riceDistributedKg: number;
  biometricAuthPct: number;
  ghostCardSuspects: number;
  ghostCardFlag: boolean;
  operatingDaysPerMonth: number;
  nfsaComplianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant';
  lastInspectionDate: string;
  inspectingOfficer: string;
}

export interface DgroPetitionData {
  petitionerName: string;
  pinCode: string;
  fpsLicenseNo: string;
  complaintNature: string;
  nfsaSectionRef: string;
  dateOfIncident: string;
}

export type QuotaSeverity = 'Full' | 'Partial' | 'Critical';

export interface QuotaFulfillmentResult {
  fulfillmentPct: number;
  shortfallKg: number;
  severity: QuotaSeverity;
}

export interface GhostCardResult {
  suspectCount: number;
  isFlag: boolean;
  pctSuspect: number;
}

// ─── Core Calculations ──────────────────────────────────────────────────────

/**
 * Calculates grain quota fulfillment percentage and shortfall.
 *
 * Formula:
 *   fulfillmentPct = round((distributedKg / allocatedKg) × 100, 1)
 *   shortfallKg    = max(0, allocatedKg − distributedKg)
 *   severity:
 *     >= 90% → 'Full'
 *     >= 60% → 'Partial'
 *     < 60%  → 'Critical'
 */
export function calculateQuotaFulfillment(
  allocatedKg: number,
  distributedKg: number
): QuotaFulfillmentResult {
  if (allocatedKg <= 0) {
    return { fulfillmentPct: 0, shortfallKg: 0, severity: 'Full' };
  }

  const fulfillmentPct = Math.round((distributedKg / allocatedKg) * 1000) / 10;
  const shortfallKg = Math.max(0, Math.round((allocatedKg - distributedKg) * 100) / 100);

  let severity: QuotaSeverity;
  if (fulfillmentPct >= 90) {
    severity = 'Full';
  } else if (fulfillmentPct >= 60) {
    severity = 'Partial';
  } else {
    severity = 'Critical';
  }

  return { fulfillmentPct, shortfallKg, severity };
}

/**
 * Detects suspect ghost ration cards — registered beneficiaries who never
 * collected their entitlement.
 *
 * Formula:
 *   suspectCount = max(0, registered − actualDistribution)
 *   pctSuspect   = round((suspectCount / registered) × 100, 1)
 *   isFlag       = pctSuspect > 10
 */
export function detectGhostCards(
  registered: number,
  actualDistribution: number
): GhostCardResult {
  if (registered <= 0) {
    return { suspectCount: 0, isFlag: false, pctSuspect: 0 };
  }

  const suspectCount = Math.max(0, registered - actualDistribution);
  const pctSuspect = Math.round((suspectCount / registered) * 1000) / 10;
  const isFlag = pctSuspect > 10;

  return { suspectCount, isFlag, pctSuspect };
}

// ─── DGRO Petition Generator ─────────────────────────────────────────────────

/**
 * Generates a formatted DGRO grievance petition under NFSA Section 15.
 * Returns a combined Hindi + English petition string for display.
 */
export function generateDgroPetition(data: DgroPetitionData): string {
  const today = new Date().toISOString().slice(0, 10);

  return `
═══════════════════════════════════════════════════════════════
  जिला शिकायत निवारण अधिकारी (DGRO) को आवेदन
  Petition to District Grievance Redressal Officer
  National Food Security Act, 2013 — ${data.nfsaSectionRef}
═══════════════════════════════════════════════════════════════

दिनांक / Date: ${today}

सेवा में / To:
  जिला शिकायत निवारण अधिकारी (DGRO)
  District Grievance Redressal Officer
  पिन कोड क्षेत्र / PIN Code Area: ${data.pinCode}

विषय / Subject:
  राष्ट्रीय खाद्य सुरक्षा अधिनियम 2013, धारा 15 के अंतर्गत शिकायत
  Complaint under Section 15, National Food Security Act, 2013

आवेदक / Petitioner:
  नाम / Name: ${data.petitionerName}

उचित मूल्य दुकान / Fair Price Shop:
  लाइसेंस संख्या / License No: ${data.fpsLicenseNo}

शिकायत का विवरण / Nature of Complaint:
  ${data.complaintNature}

घटना की तिथि / Date of Incident:
  ${data.dateOfIncident}

───────────────────────────────────────────────────────────────

महोदय/महोदया,

  मैं, ${data.petitionerName}, राष्ट्रीय खाद्य सुरक्षा अधिनियम 2013
  की धारा 15 के अंतर्गत यह शिकायत दर्ज कर रहा/रही हूँ।

  उपरोक्त उचित मूल्य दुकान (FPS लाइसेंस: ${data.fpsLicenseNo}) द्वारा
  मेरे/हमारे क्षेत्र (पिन ${data.pinCode}) में निम्नलिखित समस्या है:

  "${data.complaintNature}"

  अतः श्रीमान/श्रीमती से विनम्र अनुरोध है कि उक्त शिकायत की
  जांच कर उचित कार्रवाई की जाए।

  कृपया NFSA 2013 की धारा 15(1) के अनुसार 30 दिन के भीतर
  निवारण सुनिश्चित करें।

───────────────────────────────────────────────────────────────

  Sir/Madam,

  I, ${data.petitionerName}, hereby file this grievance petition
  under ${data.nfsaSectionRef} of the National Food Security Act, 2013.

  The above-mentioned Fair Price Shop (License: ${data.fpsLicenseNo})
  serving area PIN ${data.pinCode} is reported for:

  "${data.complaintNature}"

  Kindly investigate the matter and ensure redressal within 30 days
  as mandated under Section 15(1) of NFSA, 2013.

───────────────────────────────────────────────────────────────

भवदीय / Yours faithfully,

${data.petitionerName}
दिनांक / Date: ${today}

═══════════════════════════════════════════════════════════════
  जनता एक्स (JantaX) — नागरिक पारदर्शिता मंच
  यह दस्तावेज़ केवल सूचनात्मक है। सटीक कानूनी सलाह
  के लिए जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें।
═══════════════════════════════════════════════════════════════
`.trim();
}

// ─── Deterministic Demo Data ─────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Returns demonstration PDS audit entries for a given PIN code.
 */
export function getPdsAuditForPin(pinCode: string): PdsAuditEntry[] {
  const h = hashSeed(pinCode);
  const isUrban = pinCode.startsWith('11') || pinCode.startsWith('40') || pinCode.startsWith('56');

  const shops: Array<{
    suffix: string;
    area: string;
    regBenef: number;
    actualDist: number;
    wheatAlloc: number;
    riceAlloc: number;
    wheatDistRate: number;
    riceDistRate: number;
    bioAuth: number;
    opDays: number;
    inspector: string;
  }> = [
    {
      suffix: `${(h % 900) + 100}`,
      area: isUrban ? 'Ward No. 12, Urban Sector' : 'Gram Panchayat — Block HQ',
      regBenef: isUrban ? 420 : 280,
      actualDist: isUrban ? 380 : 210,
      wheatAlloc: isUrban ? 2100 : 1400,
      riceAlloc: isUrban ? 1260 : 840,
      wheatDistRate: 0.88 + ((h % 8) / 100),
      riceDistRate: 0.72 + ((h % 12) / 100),
      bioAuth: 82 + (h % 15),
      opDays: 18 + (h % 7),
      inspector: 'श्री / Shri Block Supply Officer',
    },
    {
      suffix: `${((h + 50) % 900) + 100}`,
      area: isUrban ? 'Ward No. 7, Market Area' : 'Revenue Village — Sub-Block',
      regBenef: isUrban ? 310 : 190,
      actualDist: isUrban ? 290 : 120,
      wheatAlloc: isUrban ? 1550 : 950,
      riceAlloc: isUrban ? 930 : 570,
      wheatDistRate: 0.92 + ((h % 5) / 100),
      riceDistRate: 0.55 + ((h % 18) / 100),
      bioAuth: 68 + (h % 20),
      opDays: 12 + (h % 10),
      inspector: 'श्री / Shri Tehsil Supply Inspector',
    },
  ];

  return shops.map((shop) => {
    const wheatDist = Math.round(shop.wheatAlloc * Math.min(shop.wheatDistRate, 1.0));
    const riceDist = Math.round(shop.riceAlloc * Math.min(shop.riceDistRate, 1.0));
    const totalAlloc = shop.wheatAlloc + shop.riceAlloc;
    const totalDist = wheatDist + riceDist;
    const qf = calculateQuotaFulfillment(totalAlloc, totalDist);
    const gc = detectGhostCards(shop.regBenef, shop.actualDist);

    let compliance: PdsAuditEntry['nfsaComplianceStatus'];
    if (qf.severity === 'Full' && !gc.isFlag && shop.opDays >= 20) {
      compliance = 'Compliant';
    } else if (qf.severity === 'Critical' || gc.pctSuspect > 25) {
      compliance = 'Non-Compliant';
    } else {
      compliance = 'Partial';
    }

    return {
      fpsLicenseNo: `FPS-${pinCode}-${shop.suffix}`,
      fpsArea: shop.area,
      registeredBeneficiaries: shop.regBenef,
      actualDistributionCount: shop.actualDist,
      quotaFulfillmentPct: qf.fulfillmentPct,
      wheatAllocatedKg: shop.wheatAlloc,
      wheatDistributedKg: wheatDist,
      riceAllocatedKg: shop.riceAlloc,
      riceDistributedKg: riceDist,
      biometricAuthPct: Math.min(shop.bioAuth, 100),
      ghostCardSuspects: gc.suspectCount,
      ghostCardFlag: gc.isFlag,
      operatingDaysPerMonth: shop.opDays,
      nfsaComplianceStatus: compliance,
      lastInspectionDate: '2025-07-15',
      inspectingOfficer: shop.inspector,
    };
  });
}
