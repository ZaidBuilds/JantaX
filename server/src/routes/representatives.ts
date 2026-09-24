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

export function generateServerRepresentatives(pinCode: string, district: string, state: string) {
  const h = hashSeed(pinCode);
  const isUrban = h % 2 === 0;

  // 1. Local Tier: Gram Panchayat (Rural) or Ward Councillor (Urban)
  const localRep = isUrban
    ? {
        id: `REP-WARD-${pinCode}`,
        tier: 'WARD_COUNCILLOR',
        tierLabel: 'Municipal Ward Councillor',
        tierLabelHi: 'वार्ड पार्षद / नगर निगम',
        designation: `Councillor, Ward ${(h % 45) + 1}`,
        designationHi: `पार्षद, वार्ड नं. ${(h % 45) + 1}`,
        name: `Sunil Kumar Verma`,
        nameHi: `सुनील कुमार वर्मा`,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        bodyName: `${district} Municipal Corporation (Nagar Nigam)`,
        bodyNameHi: `${district} नगर निगम`,
        constituencyOrArea: `Ward ${(h % 45) + 1} (${district} Central)`,
        constituencyOrAreaHi: `वार्ड नं. ${(h % 45) + 1} (${district} मध्य)`,
        district,
        state,
        party: 'Independent',
        partyColor: '#64748b',
        termStart: '2022',
        termEnd: '2027',
        officeAddress: `Nagar Nigam Zonal Office, Ward ${(h % 45) + 1}, ${district}`,
        officeAddressHi: `नगर निगम जोनल कार्यालय, वार्ड ${(h % 45) + 1}, ${district}`,
        helplinePhone: `+91 941${pinCode.slice(0, 3)}00`,
        pincodesCovered: [pinCode],
        coOfficialName: 'Zonal Health & Sanitary Inspector',
        coOfficialRole: 'Municipal Sanitary Executive',
        fundSummary: {
          entitledAmountCr: 1.20,
          releasedByGovtCr: 1.05,
          sanctionedWorksCr: 0.95,
          expenditureReportedCr: 0.82,
          unspentBalanceCr: 0.23,
          utilizationPercentage: 78.1,
          fundSchemeName: '15th Finance Commission Urban Local Body (ULB) Tied Grant',
          lastAuditedDate: '15 Feb 2026',
        },
        totalWorksCount: 3,
        totalWorksCompleted: 2,
        totalWorksDelayed: 1,
        avgHikePercentage: 8.5,
        works: [
          {
            id: `WRK-WARD-${pinCode}-01`,
            representativeId: `REP-WARD-${pinCode}`,
            workTitle: `Interlocking Pavement & Stormwater Drain Construction`,
            workTitleHi: `इंटरलाकिंग टाइल मार्ग एवं नाली निर्माण कार्य`,
            sector: 'Roads & Drainage',
            sanctionOrderNo: `ULB-${pinCode}-2024-11`,
            sanctionDate: '2024-03-15',
            completionTargetDate: '2024-09-30',
            completionActualDate: '2024-11-20',
            sanctionedCostLakhs: 24.50,
            actualCostLakhs: 26.80,
            costHikePercentage: 9.4,
            costHikeReason: 'Reinforced cement concrete gradient realignment',
            status: 'Completed',
            pincode: pinCode,
            district,
            state,
            locationName: `Main Market Link Corridor, ${district}`,
            locationNameHi: `मुख्य बाजार लिंक मार्ग, ${district}`,
            contractorId: `cont-${pinCode.slice(0, 3)}-01`,
            contractorName: `${district} Infrastructure & Civic Engineers`,
            contractorRating: 78,
            dlpExpiryDate: '2027-11-20',
            dlpStatus: 'Active DLP',
            schemeName: '15th FC Urban Grant',
            groundTruthScore: 82,
            sourceUrl: 'https://egramswaraj.gov.in',
            lastUpdatedDate: '2026-02-15',
          }
        ]
      }
    : {
        id: `REP-GP-${pinCode}`,
        tier: 'GRAM_PANCHAYAT',
        tierLabel: 'Gram Panchayat',
        tierLabelHi: 'ग्राम पंचायत',
        designation: 'Gram Pradhan / Sarpanch',
        designationHi: 'ग्राम प्रधान / सरपंच',
        name: `Chaudhary Satish Kumar`,
        nameHi: `चौधरी सतीश कुमार`,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        bodyName: `Gram Panchayat ${district} Block Sector`,
        bodyNameHi: `ग्राम पंचायत ${district} विकास खंड`,
        constituencyOrArea: `Panchayat Ward 01-12`,
        constituencyOrAreaHi: `पंचायत वार्ड 01-12`,
        district,
        state,
        party: 'Independent',
        partyColor: '#16a34a',
        termStart: '2021',
        termEnd: '2026',
        officeAddress: `Panchayat Bhawan, Block Head, ${district}`,
        officeAddressHi: `पंचायत भवन, ब्लॉक मुख्यालय, ${district}`,
        helplinePhone: `+91 941${pinCode.slice(0, 3)}01`,
        pincodesCovered: [pinCode],
        coOfficialName: 'Sachiv: Village Development Officer (VDO)',
        coOfficialRole: 'Panchayat Development Executive',
        fundSummary: {
          entitledAmountCr: 0.65,
          releasedByGovtCr: 0.58,
          sanctionedWorksCr: 0.54,
          expenditureReportedCr: 0.46,
          unspentBalanceCr: 0.12,
          utilizationPercentage: 79.3,
          fundSchemeName: '15th Finance Commission Tied/Untied Rural Grant & SFC',
          lastAuditedDate: '15 Jan 2026',
        },
        totalWorksCount: 3,
        totalWorksCompleted: 2,
        totalWorksDelayed: 1,
        avgHikePercentage: 11.2,
        works: [
          {
            id: `WRK-GP-${pinCode}-01`,
            representativeId: `REP-GP-${pinCode}`,
            workTitle: `Interlocking Pathway & Covered Drain to Primary School`,
            workTitleHi: `प्राथमिक विद्यालय संपर्क मार्ग एवं पक्की नाली`,
            sector: 'Roads & Pathways',
            sanctionOrderNo: `GP-${pinCode}-2024-88`,
            sanctionDate: '2024-02-12',
            completionTargetDate: '2024-06-30',
            completionActualDate: '2024-08-18',
            sanctionedCostLakhs: 8.50,
            actualCostLakhs: 9.80,
            costHikePercentage: 15.3,
            costHikeReason: 'Monsoon drainage extension',
            status: 'Completed',
            pincode: pinCode,
            district,
            state,
            locationName: `Village Main Connecting Pathway, ${district}`,
            locationNameHi: `ग्राम संपर्क मुख्य मार्ग, ${district}`,
            contractorId: `cont-${pinCode.slice(0, 3)}-02`,
            contractorName: `${district} Rural Builders Consortium`,
            contractorRating: 75,
            dlpExpiryDate: '2027-08-18',
            dlpStatus: 'Active DLP',
            schemeName: '15th FC Rural Untied Grant',
            groundTruthScore: 79,
            sourceUrl: 'https://egramswaraj.gov.in',
            lastUpdatedDate: '2026-02-10',
          }
        ]
      };

  // 2. State Tier: Member of Legislative Assembly (MLA) - Vidhan Sabha
  const mlaRep = {
    id: `REP-MLA-${pinCode}`,
    tier: 'MLA',
    tierLabel: 'Member of Legislative Assembly (MLA)',
    tierLabelHi: 'विधायक (विधान सभा)',
    designation: 'MLA, State Legislative Assembly',
    designationHi: `विधायक, ${district} विधानसभा क्षेत्र`,
    name: `Rajesh Singh Rathore`,
    nameHi: `राजेश सिंह राठौड़`,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    bodyName: `${state} Legislative Assembly (Vidhan Sabha)`,
    bodyNameHi: `${state} विधान सभा`,
    constituencyOrArea: `${district} Vidhan Sabha AC-${(h % 70) + 1}`,
    constituencyOrAreaHi: `${district} विधानसभा क्षेत्र क्रमांक ${(h % 70) + 1}`,
    district,
    state,
    party: 'Elected Legislative Member',
    partyColor: '#ea580c',
    termStart: '2022',
    termEnd: '2027',
    officeAddress: `MLA Constituency Secretariat, Civil Lines, ${district}`,
    officeAddressHi: `विधायक जनसेवा सचिवालय, सिविल लाइंस, ${district}`,
    helplinePhone: `+91 982${pinCode.slice(0, 3)}10`,
    pincodesCovered: [pinCode],
    coOfficialName: 'Chief Development Officer (CDO)',
    coOfficialRole: 'District Rural Development Executive',
    fundSummary: {
      entitledAmountCr: 5.00,
      releasedByGovtCr: 4.50,
      sanctionedWorksCr: 4.10,
      expenditureReportedCr: 3.45,
      unspentBalanceCr: 1.05,
      utilizationPercentage: 76.7,
      fundSchemeName: `${state} Vidhayak Nidhi (MLALADS)`,
      lastAuditedDate: '10 Feb 2026',
    },
    totalWorksCount: 4,
    totalWorksCompleted: 2,
    totalWorksDelayed: 1,
    avgHikePercentage: 14.8,
    works: [
      {
        id: `WRK-MLA-${pinCode}-01`,
        representativeId: `REP-MLA-${pinCode}`,
        workTitle: `Solar LED High-Mast Lighting & CCTV Installation`,
        workTitleHi: `सोलर हाई-मास्ट लाइट एवं सीसीटीवी स्थापना`,
        sector: 'Civic Amenities & Safety',
        sanctionOrderNo: `MLA-${pinCode}-2024-52`,
        sanctionDate: '2024-04-10',
        completionTargetDate: '2024-08-30',
        completionActualDate: '2024-10-12',
        sanctionedCostLakhs: 18.00,
        actualCostLakhs: 19.80,
        costHikePercentage: 10.0,
        costHikeReason: 'CCTV feed optical fiber expansion',
        status: 'Completed',
        pincode: pinCode,
        district,
        state,
        locationName: `Key Public Junction, ${district}`,
        locationNameHi: `प्रमुख सार्वजनिक चौराहा, ${district}`,
        contractorId: `cont-${pinCode.slice(0, 3)}-03`,
        contractorName: 'National Smart Civic Systems',
        contractorRating: 84,
        dlpExpiryDate: '2026-10-12',
        dlpStatus: 'Active DLP',
        schemeName: 'Vidhayak Nidhi (MLALADS)',
        groundTruthScore: 85,
        sourceUrl: 'https://vidhansabha.nic.in',
        lastUpdatedDate: '2026-02-18',
      }
    ]
  };

  // 3. National Tier: Member of Parliament (MP) - Lok Sabha
  const mpRep = {
    id: `REP-MP-${pinCode}`,
    tier: 'MP_LOK_SABHA',
    tierLabel: 'Member of Parliament (MP) - Lok Sabha',
    tierLabelHi: 'सांसद (लोक सभा)',
    designation: 'MP, 18th Lok Sabha',
    designationHi: `सांसद, 18वीं लोक सभा`,
    name: `Dr. Anand Prakash Sharma`,
    nameHi: `डॉ. आनंद प्रकाश शर्मा`,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bodyName: `Lok Sabha, Parliament of India`,
    bodyNameHi: `लोक सभा, भारतीय संसद`,
    constituencyOrArea: `${district} Parliamentary Constituency PC-${(h % 25) + 1}`,
    constituencyOrAreaHi: `${district} संसदीय क्षेत्र`,
    district,
    state,
    party: 'Parliamentary Representative',
    partyColor: '#2563eb',
    termStart: '2024',
    termEnd: '2029',
    officeAddress: `MP Constituency Office, Collectorate Road, ${district}`,
    officeAddressHi: `सांसद कार्यालय, कलेक्ट्रेट रोड, ${district}`,
    helplinePhone: `+91 981${pinCode.slice(0, 3)}20`,
    pincodesCovered: [pinCode],
    coOfficialName: 'District Planning Officer (DPO)',
    coOfficialRole: 'MPLADS Nodal Officer',
    fundSummary: {
      entitledAmountCr: 10.00,
      releasedByGovtCr: 7.50,
      sanctionedWorksCr: 6.80,
      expenditureReportedCr: 5.20,
      unspentBalanceCr: 2.30,
      utilizationPercentage: 69.3,
      fundSchemeName: 'MPLADS (Member of Parliament Local Area Development Scheme)',
      lastAuditedDate: '01 Mar 2026',
    },
    totalWorksCount: 5,
    totalWorksCompleted: 2,
    totalWorksDelayed: 2,
    avgHikePercentage: 18.2,
    works: [
      {
        id: `WRK-MP-${pinCode}-01`,
        representativeId: `REP-MP-${pinCode}`,
        workTitle: `Community Hall & Skill Center Construction`,
        workTitleHi: `सामुदायिक केंद्र एवं कौशल विकास भवन`,
        sector: 'Public Community Hall',
        sanctionOrderNo: `MPLADS-${pinCode}-2024-91`,
        sanctionDate: '2024-05-20',
        completionTargetDate: '2025-03-31',
        completionActualDate: null,
        sanctionedCostLakhs: 65.00,
        actualCostLakhs: 74.00,
        costHikePercentage: 13.8,
        costHikeReason: 'Addition of solar rooftop generation unit',
        status: 'Under Construction',
        pincode: pinCode,
        district,
        state,
        locationName: `Civil Lines Public Complex, ${district}`,
        locationNameHi: `सिविल लाइंस परिसर, ${district}`,
        contractorId: `cont-${pinCode.slice(0, 3)}-04`,
        contractorName: 'Apex Civil Infra & Buildcon',
        contractorRating: 81,
        dlpExpiryDate: null,
        dlpStatus: 'Not Applicable',
        schemeName: 'MPLADS Annual Allocation',
        groundTruthScore: 74,
        sourceUrl: 'https://mplads.gov.in',
        lastUpdatedDate: '2026-02-20',
      }
    ]
  };

  const representatives = [localRep, mlaRep, mpRep];

  let totalBudget = 0;
  let totalSpent = 0;
  let totalUnspent = 0;
  let totalWorks = 0;
  let totalHikeSum = 0;
  let hikeCount = 0;

  for (const r of representatives) {
    totalBudget += r.fundSummary.releasedByGovtCr;
    totalSpent += r.fundSummary.expenditureReportedCr;
    totalUnspent += r.fundSummary.unspentBalanceCr;
    totalWorks += r.works.length;
    for (const w of r.works) {
      if (w.costHikePercentage > 0) {
        totalHikeSum += w.costHikePercentage;
        hikeCount += 1;
      }
    }
  }

  const overallUtilizationRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const averageCostHike = hikeCount > 0 ? Number((totalHikeSum / hikeCount).toFixed(1)) : 0;

  return {
    pincode: pinCode,
    district,
    state,
    areaType: isUrban ? 'Urban' : 'Rural',
    representatives,
    totalLocalBudgetCr: Number(totalBudget.toFixed(2)),
    totalSpentCr: Number(totalSpent.toFixed(2)),
    totalUnspentCr: Number(totalUnspent.toFixed(2)),
    overallUtilizationRate,
    totalWorksCount: totalWorks,
    averageCostHike,
  };
}

/**
 * GET /api/representatives/pin/:pinCode
 * GET /api/representatives/:pinCode
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

    const hierarchy = generateServerRepresentatives(pinParam, district, state);
    res.json(hierarchy);
  } catch (err: any) {
    console.error('[representatives] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve locality representatives hierarchy' });
  }
});

export default router;
