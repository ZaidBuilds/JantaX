import type { Contractor, WorkOrder, WardData, RoadDefectReport } from '../types';

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export function generateMockContractorDataset(pincode: string = '560034'): {
  contractors: Contractor[];
  workOrders: WorkOrder[];
  wards: WardData[];
  defects: RoadDefectReport[];
} {
  const hash = pincode.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const rnd = seededRand(hash);

  const contractorNames = [
    'M/s Vanguard Infra Projects Pvt Ltd',
    'Sri Balaji Roadworks & Const.',
    'Meerut Builders & Infrastructure Ltd',
    'Chaudhary Road Builders',
    'M/S Tomar Solar Power Solutions',
    'Sample Contractor A Construction',
    'Sample Contractor E & F JV',
    'Sardar Medical Const. Corp.',
  ];

  const contractors: Contractor[] = contractorNames.map((name, i) => {
    const score = Math.floor(35 + rnd() * 60);
    const risk: Contractor['riskTier'] = score < 45 ? 'CRITICAL_RISK' : score < 65 ? 'HIGH_RISK' : score < 80 ? 'MODERATE' : score < 90 ? 'COMPLIANT' : 'EXEMPLARY';
    return {
      id: `cont-${String(i+1).padStart(3,'0')}`,
      name,
      registrationNumber: `PWD-CL-${String.fromCharCode(65+i)}-KA-${8800+i}`,
      class: i % 2 === 0 ? 'Class-I Super Contractor' : 'Class-I PWD',
      registeredCity: ['Bengaluru','Mumbai','Delhi','Meerut','Chennai'][i % 5],
      directors: [`Director ${i+1}A`, `Director ${i+1}B`],
      integrityScore: score,
      riskTier: risk,
      monsoonFailureRate: Math.floor(15 + rnd()*55),
      dlpViolationRate: Math.floor(5 + rnd()*45),
      wardMonopolyIndex: Math.floor(10 + rnd()*70),
      primaryWard: `Ward ${140 + i*3}`,
      primaryPincode: pincode,
      totalContractsValueCrores: Math.floor(20 + rnd()*180),
      totalRoadsBuiltCount: Math.floor(12 + rnd()*80),
      totalRoadLengthKm: Math.floor(20 + rnd()*120),
      activeDlpRoadsCount: Math.floor(2 + rnd()*8),
      activeDlpViolationsCount: Math.floor(rnd()*5),
      resolvedComplaintsCount: Math.floor(5 + rnd()*20),
      unresolvedComplaintsCount: Math.floor(rnd()*8),
      avgPotholeAppearanceMonths: Math.floor(2 + rnd()*10),
      notices: [
        { id: `n-${i}-1`, date: '2024-08-12', type: 'SHOW_CAUSE', title: 'DLP breach show-cause', authority: 'EE, PWD', description: 'Failure to repair potholes within 15 days' },
      ],
      tags: i % 3 === 0 ? ['Monopoly Zone'] : [],
    };
  });

  const workOrders: WorkOrder[] = Array.from({ length: 12 }, (_, i) => {
    const c = contractors[i % contractors.length];
    const sanctioned = Math.floor(20 + rnd()*300);
    const wardId = `ward-${150+i}`;
    const pincodeVar = pincode.slice(0,3) + String(100 + i).slice(1);
    return {
      id: `wo-${String(i+1).padStart(3,'0')}`,
      pincode: pincodeVar,
      tenderNumber: `BBMP/2024-25/RD-W${150+i}/0${89+i}`,
      procurementPortal: ['State e-Procurement','GeM','Municipal Work Order'][i%3] as any,
      title: `Asphalting & Micro-surfacing of ${80 + i*10}ft Road, ${['Koramangala','HSR Layout','Jayanagar','Meerut Rural','Mumbai Coastal'][i%5]}`,
      wardId,
      wardName: `Ward ${150+i} - ${['Koramangala','HSR','Jayanagar','Meerut','Mumbai'][i%5]}`,
      zone: ['South Zone','West Zone','Central Zone'][i%3],
      city: c.registeredCity,
      contractorId: c.id,
      contractorName: c.name,
      contractorDirectors: c.directors,
      executiveEngineer: { name: 'Er. Rajesh Kumar', designation: 'Executive Engineer', department: 'BBMP South Road Infra', signedCertificateDate: '2024-06-10' },
      electedRepresentative: { name: 'Shri Ramesh', role: 'Corporator', constituency: `Ward ${150+i}` },
      sanctionedAmountLakhs: sanctioned,
      awardedDate: '2024-02-15',
      completionDate: '2024-08-15',
      dlpExpiryDate: '2027-08-15',
      dlpStatus: (['ACTIVE_DLP_PROTECTED','DLP_BREACH_UNRESOLVED','DLP_EXPIRED'] as const)[i % 3],
      specifications: { bitumenGrade: 'VG-30', thicknessMm: 50, pavementType: 'Dense Bituminous Macadam (DBM) + BC', sanctionedWarrantyMonths: 36 },
      roadLengthKm: Math.floor(0.5 + rnd()*3.5),
      roadName: `${80+i*10}ft Road`,
      startPoint: 'Point A', endPoint: 'Point B',
      totalPotholeReports: Math.floor(rnd()*20),
      activeFailuresCount: Math.floor(rnd()*8),
      coordinates: { lat1: 12.97, lng1: 77.59, lat2: 12.98, lng2: 77.60 },
      claimVsReality: {
        sanctionedCostFormatted: `₹${sanctioned} Lakhs`,
        sanctionedSpecs: 'VG-30, 50mm BC, 3-yr DLP + IRC SP:98 certificate',
        officialClaim: `₹${sanctioned} Lakhs • VG-30 complete with 3-year warranty`,
        officialSourceDoc: `BBMP/2024-25/EE/RD/WO-${9941+i}`,
        cagAuditReference: 'CAG Report No. 4 of 2024, Para 3.2.1',
        cagFindingSnippet: 'Core cut tests showed bitumen 3.8% vs mandated 5.4%',
        realityGroundTruth: `${Math.floor(rnd()*15)} craters after first monsoon, 4 months after handover`,
        discrepancyPercentage: Math.floor(20 + rnd()*50),
        evidencePhotoUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80',
        evidenceDate: '2024-08-20',
        evidenceSource: 'Anonymous Citizen Photo Drop',
        sourcePortalUrl: 'https://eproc.karnataka.gov.in',
      },
    };
  });

  const wards: WardData[] = Array.from({ length: 8 }, (_, i) => ({
    id: `ward-${150+i}`,
    number: 150 + i,
    name: `Ward ${150+i}`,
    pincode: pincode,
    zone: ['South Zone','West Zone'][i%2],
    city: 'Bengaluru',
    totalRoadLengthKm: Math.floor(5 + rnd()*20),
    annualBudgetCrores: Math.floor(5 + rnd()*30),
    dominantContractor: { contractorId: contractors[i%contractors.length].id, name: contractors[i%contractors.length].name, sharePercent: Math.floor(30 + rnd()*50), tendersWonCount: Math.floor(3 + rnd()*10) },
    monsoonDamageScore: Math.floor(2 + rnd()*8),
    activePotholesCount: Math.floor(rnd()*25),
    dlpCoveredBreachesCount: Math.floor(rnd()*8),
    coordinates: { centerLat: 12.97, centerLng: 77.59 },
  }));

  const defects: RoadDefectReport[] = Array.from({ length: 10 }, (_, i) => {
    const wo = workOrders[i % workOrders.length];
    return {
      id: `def-${i+1}`,
      workOrderId: wo.id,
      pincode: wo.pincode,
      roadName: wo.roadName,
      wardId: wo.wardId,
      wardName: wo.wardName,
      city: wo.city,
      contractorId: wo.contractorId,
      contractorName: wo.contractorName,
      reportedDate: '2024-08-18',
      defectType: (['Pothole Cluster','Asphalt Stripping & Ravelling','Drainage Inundation & Waterlogging','Trench & Road Cave-in','Premature Surface Cracking'] as const)[i%5],
      severity: (['CRITICAL_HAZARD','HIGH','MEDIUM'] as const)[i%3],
      isDlpCovered: i % 2 === 0,
      daysSinceReported: Math.floor(rnd()*30),
      description: 'Heavy waterlogging after rain, asphalt stripped',
      photoUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80',
      coordinates: { lat: 12.97, lng: 77.59 },
      citizenUpvotes: Math.floor(rnd()*25),
      status: (['OPEN_DLP_BREACH','VERIFIED_BY_RWA','NOTICE_SERVED'] as const)[i%3],
      reporterName: 'Anonymous',
      isAnonymousDrop: true,
    };
  });

  return { contractors, workOrders, wards, defects };
}
