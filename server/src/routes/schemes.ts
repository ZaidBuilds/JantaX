import { Router } from 'express';
import type { Request, Response } from 'express';
import { ensurePincodeExists } from './pinHelpers';

const router = Router();

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 31 + s.charCodeAt(i)) >>> 0);
  }
  return h;
}

export function generateServerSchemes(pinCode: string, district: string, state: string) {
  const h = hashSeed(pinCode);

  const projects = [
    {
      id: `SCH-PMGSY-${pinCode}-01`,
      schemeName: 'Pradhan Mantri Gram Sadak Yojana (PMGSY)',
      schemeNameHi: 'प्रधानमंत्री ग्राम सड़क योजना (पीएमजीएसवाई)',
      category: 'ROADS',
      projectName: `PMGSY All-Weather Road Connectivity Package - ${district}`,
      projectNameHi: `पीएमजीएसवाई बारहमासी सड़क संपर्क पैकेज - ${district}`,
      sanctionedCostCr: 12.50,
      expenditureCr: 10.40,
      progressPercentage: 88,
      groundTruthScore: 78,
      leadContractor: `${district} Buildcon & Infrastructure Ltd`,
      contractorId: `cont-${pinCode.slice(0, 3)}-01`,
      status: 'UNDER_CONSTRUCTION',
      ministry: 'Ministry of Rural Development / State PWD',
      targetDate: '2026-06-30',
      completedDate: null,
      dlpMonths: 36,
      dlpStatus: 'Warranty on Handover',
      sourceUrl: 'https://omms.nic.in',
    },
    {
      id: `SCH-JJM-${pinCode}-02`,
      schemeName: 'Jal Jeevan Mission (Har Ghar Jal)',
      schemeNameHi: 'जल जीवन मिशन (हर घर जल)',
      category: 'WATER',
      projectName: `Functional Household Tap Connection (FHTC) Feeder - ${district}`,
      projectNameHi: `क्रियाशील घरेलू नल जल संयोजन (एफएचटीसी) फीडर - ${district}`,
      sanctionedCostCr: 8.20,
      expenditureCr: 7.90,
      progressPercentage: 96,
      groundTruthScore: 84,
      leadContractor: 'National Water Engineering Works',
      contractorId: `cont-${pinCode.slice(0, 3)}-02`,
      status: 'COMPLETED',
      ministry: 'Ministry of Jal Shakti',
      targetDate: '2025-03-31',
      completedDate: '2025-08-15',
      dlpMonths: 24,
      dlpStatus: 'Active Warranty (IRC/CPHEEO)',
      sourceUrl: 'https://ejalshakti.gov.in',
    },
    {
      id: `SCH-PMAY-${pinCode}-03`,
      schemeName: 'Pradhan Mantri Awas Yojana (PMAY)',
      schemeNameHi: 'प्रधानमंत्री आवास योजना',
      category: 'HOUSING',
      projectName: `Affordable Housing Beneficiary Led Construction - ${district}`,
      projectNameHi: `किफायती आवास लाभार्थी-आधारित निर्माण संकुल - ${district}`,
      sanctionedCostCr: 14.80,
      expenditureCr: 11.20,
      progressPercentage: 74,
      groundTruthScore: 70,
      leadContractor: 'State Housing & Development Authority',
      contractorId: `cont-${pinCode.slice(0, 3)}-03`,
      status: 'UNDER_CONSTRUCTION',
      ministry: 'Ministry of Housing and Urban Affairs',
      targetDate: '2026-12-31',
      completedDate: null,
      dlpMonths: 60,
      dlpStatus: 'RERA 5-Year Structural Defect Guarantee',
      sourceUrl: 'https://pmaymis.gov.in',
    },
    {
      id: `SCH-AMRUT-${pinCode}-04`,
      schemeName: 'AMRUT 2.0 Water & Green Spaces Mission',
      schemeNameHi: 'अमृत 2.0 शहरी कायाकल्प मिशन',
      category: 'URBAN_CIVIC',
      projectName: `Stormwater Drainage & Municipal Lake Rejuvenation - ${district}`,
      projectNameHi: `वर्षा जल निकासी एवं अमृत सरोवर पुनरुद्धार - ${district}`,
      sanctionedCostCr: 6.40,
      expenditureCr: 4.80,
      progressPercentage: 70,
      groundTruthScore: 72,
      leadContractor: 'Apex Eco-Civic Infrastructure',
      contractorId: `cont-${pinCode.slice(0, 3)}-04`,
      status: 'UNDER_CONSTRUCTION',
      ministry: 'MoHUA / State Urban Development',
      targetDate: '2026-09-30',
      completedDate: null,
      dlpMonths: 36,
      dlpStatus: 'Active Maintenance Clause',
      sourceUrl: 'https://amrut.gov.in',
    },
  ];

  let totalSanctioned = 0;
  let totalUtilized = 0;
  let underConstruction = 0;
  let completed = 0;

  for (const p of projects) {
    totalSanctioned += p.sanctionedCostCr;
    totalUtilized += p.expenditureCr;
    if (p.status === 'COMPLETED') completed += 1;
    else underConstruction += 1;
  }

  const overallProgressPercentage = totalSanctioned > 0 ? Math.round((totalUtilized / totalSanctioned) * 100) : 0;

  return {
    pincode: pinCode,
    district,
    state,
    totalSanctionedBudgetCr: Number(totalSanctioned.toFixed(2)),
    totalFundsUtilizedCr: Number(totalUtilized.toFixed(2)),
    overallProgressPercentage,
    projectsUnderConstruction: underConstruction,
    projectsCompleted: completed,
    projects,
  };
}

/**
 * GET /api/schemes/pin/:pinCode
 * GET /api/schemes/:pinCode
 */
router.get(['/pin/:pinCode', '/:pinCode'], async (req: Request, res: Response) => {
  const pinParam = String(req.params.pinCode || req.params[0] || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(pinParam)) {
    return res.status(400).json({ error: 'Valid 6-digit PIN code is required' });
  }

  try {
    const pinRecord = await ensurePincodeExists(pinParam);
    const district = pinRecord?.district || 'District';
    const state = pinRecord?.state || 'State';

    const schemes = generateServerSchemes(pinParam, district, state);
    res.json(schemes);
  } catch (err: any) {
    console.error('[schemes] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve locality schemes data' });
  }
});

export default router;
