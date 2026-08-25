import { PrismaClient } from '@prisma/client';
import { states, claims } from '../src/modules/andhbhakt/data/rawSeedData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 JantaX seed start — 15 modules');

  // 1. Pincode spine — demo PINs
  const demoPins = [
    { code: '110001', state: 'Delhi', district: 'New Delhi', region: 'North' as const, lat: 28.61, lng: 77.20, population: 200000 },
    { code: '250001', state: 'Uttar Pradesh', district: 'Meerut', region: 'North' as const, lat: 28.98, lng: 77.70, population: 150000 },
    { code: '560001', state: 'Karnataka', district: 'Bengaluru', region: 'South' as const, lat: 12.97, lng: 77.59, population: 300000 },
    { code: '226001', state: 'Uttar Pradesh', district: 'Lucknow', region: 'North' as const, lat: 26.84, lng: 80.94, population: 250000 },
    { code: '400001', state: 'Maharashtra', district: 'Mumbai', region: 'West' as const, lat: 19.07, lng: 72.87, population: 500000 },
    { code: '600001', state: 'Tamil Nadu', district: 'Chennai', region: 'South' as const, lat: 13.08, lng: 80.27, population: 400000 },
    { code: '700001', state: 'West Bengal', district: 'Kolkata', region: 'East' as const, lat: 22.57, lng: 88.36, population: 350000 },
  ];
  for (const p of demoPins) {
    await prisma.pincode.upsert({
      where: { code: p.code },
      update: {},
      create: { code: p.code, state: p.state, district: p.district, region: p.region, lat: p.lat, lng: p.lng, population: p.population, areaType: 'Urban' },
    });
  }
  console.log(`✓ Pincode ${demoPins.length}`);

  // 2. Schools — 2 per demo PIN
  for (const pin of demoPins.slice(0,3)) {
    for (let i=0;i<2;i++) {
      const udise = `0701${pin.code.slice(2)}${i}0${i}`;
      await prisma.school.upsert({
        where: { udiseCode: udise },
        update: {},
        create: {
          pincodeCode: pin.code,
          udiseCode: udise,
          nameEnglish: i===0 ? `Govt. Primary School ${pin.district} Sector A9` : `Govt. School ${pin.code}-${i}`,
          nameHindi: i===0 ? `राजकीय प्राथमिक विद्यालय ${pin.district}` : `सरकारी स्कूल ${pin.code}`,
          level: 'Primary',
          managementType: 'Government',
          studentsEnrolled: 80 + i*20,
          teachersWorking: 4 + i,
          teachersSanctioned: 5 + i,
          groundTruthScore: 65 + i*10,
          hasToilet: true,
          hasElectricity: i!==1,
          hasDrinkingWater: true,
        },
      });
    }
  }
  console.log('✓ Schools');

  // 3. Infra — 2 per PIN
  for (const pin of demoPins.slice(0,2)) {
    for (let i=0;i<2;i++) {
      await prisma.infraProject.create({
        data: {
          pincodeCode: pin.code,
          titleEnglish: i===0 ? `Elevated Corridor Phase-${i+2} ${pin.district}` : `PMGSY Road ${pin.code}-${i}`,
          titleHindi: `सड़क परियोजना ${pin.code}`,
          department: 'PWD',
          budget: 20 + i*15,
          startDate: new Date('2022-03-15'),
          expectedCompletion: new Date('2024-12-31'),
          status: i===0 ? 'ONGOING' : 'DELAYED',
          claimCompletionPct: 60 + i*10,
          groundTruthScore: 70,
          responsibleOfficer: 'EE, PWD',
          implementingAgency: 'NHAI',
          evidenceCount: i,
        },
      });
    }
  }
  console.log('✓ Infra');

  // 4. StateCmClaim — from rawSeedData (18 claims)
  for (const c of claims) {
    await prisma.stateCmClaim.upsert({
      where: { id: `seed-${c.pincode}-${c.category}` },
      update: {},
      create: {
        id: `seed-${c.pincode}-${c.category}`,
        stateCode: c.stateCode,
        category: c.category,
        claimTitleHindi: c.claimTextHi.slice(0,120),
        claimTitleEn: c.claimTextEn.slice(0,120),
        claimSource: c.sourceUrl,
        claimDetails: c.claimTextHi,
        realityTitleHindi: c.realityTextHi.slice(0,120),
        realityTitleEn: c.realityTextEn.slice(0,120),
        realityDetails: c.realityTextHi,
        cagReportRef: c.verificationSource,
        realitySeverity: c.verified ? 'critical' : 'warning',
      },
    });
  }
  console.log(`✓ StateCmClaim ${claims.length}`);

  // 5. MunicipalWard demo
  await prisma.municipalWard.upsert({
    where: { id: 'ward-demo-110001' },
    update: {},
    create: {
      id: 'ward-demo-110001',
      pincode: '110001',
      wardNo: '12',
      garbageClaimedSla: '100%',
      waterClaimedSla: '6 Hours',
      drainageClaimedSla: '100%',
    },
  });
  console.log('✓ MunicipalWard');

  // 6. PincodeBudget demo
  await prisma.pincodeBudget.upsert({
    where: { pincode: '110001' },
    update: {},
    create: {
      pincode: '110001',
      financialYear: '2024-25',
      totalRevenueCr: 120,
      totalAllocatedCr: 85,
      allocations: {
        create: [
          { sectorNameEn: 'Infrastructure', sectorNameHi: 'अवसंरचना', allocatedCr: 35, utilizedCr: 28, stalledProjects: 1 },
          { sectorNameEn: 'Education', sectorNameHi: 'शिक्षा', allocatedCr: 20, utilizedCr: 18, stalledProjects: 0 },
        ],
      },
    },
  });
  console.log('✓ PincodeBudget');

  // 7. AQI + Land + Feeder + Candidate + Cpgrams stubs
  const aqi = await prisma.regionalAqiStation.create({
    data: { pincode: '110001', stationName: 'ITO Delhi', aqiValue: 312, dominantPollutant: 'PM2.5' },
  });
  await prisma.spcbNotice.create({ data: { stationId: aqi.id, industryName: 'M/S Balaji Chemical', noticeType: 'closure-order', violationReason: 'Air pollution beyond limits', issueDate: '2024-12-01' } });

  const tehsil = await prisma.tehsilOffice.create({ data: { pincode: '110001', tehsilName: 'New Delhi Tehsil', district: 'New Delhi', promisedSlaDays: 45 } });
  await prisma.landMutationRecord.create({ data: { tehsilId: tehsil.id, surveyNumber: '124/**', daysTaken: 145, status: 'pending', appliedDate: '2024-01-15' } });

  const feeder = await prisma.discomFeeder.create({ data: { pincode: '110001', feederName: 'Feeder 12A', substationName: 'ITO Substation', promisedSupplyHours: 24 } });
  await prisma.feederOutageLog.create({ data: { feederId: feeder.id, outageMinutes: 420, faultType: 'load-shedding', faultTypeHi: 'लोड शेडिंग', logDate: '2024-08-20' } });

  await prisma.candidateSpendRecord.create({ data: { pincode: '110001', candidateName: 'Ram Nivas Singh', party: 'BJP', constituency: 'New Delhi', declaredSpend: 32.5, estimatedSpend: 185, sourceAffidavit: 'https://eci.gov.in' } });

  await prisma.cpgramsMonthlyRecord.create({
    data: {
      recordType: 'ministry', rank: 1, name: 'Ministry of Urban Development', nameHi: 'शहरी विकास मंत्रालय',
      totalGrievances: 12500, resolvedCount: 8200, pendingCount: 4300, avgDisposalDays: 45, backlogOver30Days: 2100,
      worstCategoryEn: 'Potholes', worstCategoryHi: 'गड्ढे', reportMonth: '2024-08',
    },
  });

  console.log('✓ AQI, Land, Feeder, Candidate, Cpgrams');

  // 8. Contractor + project
  const contractor = await prisma.contractor.upsert({
    where: { id: 'cont-seed-1' },
    update: {},
    create: { id: 'cont-seed-1', name: 'Vanguard Infra Projects Pvt Ltd', registeredState: 'Karnataka', verified: true, totalContracts: 25, completed: 18, ongoing: 5, delayed: 2, score: 68 },
  });
  await prisma.contractorProject.upsert({
    where: { workOrderNo: 'BBMP/2024-25/RD-W151/089' },
    update: {},
    create: { contractorId: contractor.id, workOrderNo: 'BBMP/2024-25/RD-W151/089', workName: 'Asphalting 80ft Road Koramangala', workNameHi: '80 फीट रोड डामरीकरण', sanctionedLakhs: 240, paymentReleased: 180, status: 'delayed', delayMonths: 4, defectReports: 11 },
  });

  console.log('✓ Contractor');

  // 9. Sources — Tier A-E (canonical governance)
  const sources = [
    // Tier A — GODL datasets
    { sourceId: 'src_udise_2324', organization: 'Ministry of Education', department: 'UDISE+', governmentLevel: 'union', sourceName: 'UDISE+ 2023-24', sourceUrl: 'https://udiseplus.gov.in', datasetUrl: 'https://udiseplus.gov.in/p/dataset', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: UDISE+ 2023-24 | GODL', reusePermission: 'store/transform/display/redistribute: yes (attribution)', dataSensitivity: 'public', updateFrequency: 'annual', expectedRefreshInterval: '365d', lastPublishedDate: '2024-08-15', parserVersion: 'udise_csv_v1.2', status: 'active', owner: 'data-ops' },
    { sourceId: 'src_hmis_2024', organization: 'MoHFW', department: 'HMIS', governmentLevel: 'union', sourceName: 'HMIS Facility Registry 2024', sourceUrl: 'https://hmis.mohfw.gov.in', datasetUrl: 'https://hmis.mohfw.gov.in/api', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: HMIS 2024 | GODL', reusePermission: 'store/transform/display/redistribute: yes', dataSensitivity: 'public', updateFrequency: 'monthly', expectedRefreshInterval: '30d', lastPublishedDate: '2024-08-01', parserVersion: 'hmis_api_v1.0', status: 'active', owner: 'data-ops' },
    { sourceId: 'src_darpg_202408', organization: 'DARPG', department: 'CPGRAMS', governmentLevel: 'union', sourceName: 'CPGRAMS Monthly Report 2024-08', sourceUrl: 'https://darpg.gov.in', datasetUrl: 'https://darpg.gov.in/en/cpgrams-reports', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: DARPG CPGRAMS Monthly Report 2024-08 | GODL', reusePermission: 'store/transform/display/redistribute: yes', dataSensitivity: 'public', updateFrequency: 'monthly', expectedRefreshInterval: '30d', lastPublishedDate: '2024-08-31', parserVersion: 'darpg_pdf_v1.0', status: 'active', owner: 'data-ops' },
    // Tier B — Official API
    { sourceId: 'src_cpcb_aqi', organization: 'CPCB', department: 'AQI', governmentLevel: 'union', sourceName: 'CPCB AQI API', sourceUrl: 'https://cpcb.nic.in', apiUrl: 'https://api.cpcb.nic.in/aqi', sourceType: 'B-api', license: 'GODL-India', termsUrl: 'https://cpcb.nic.in/terms', attributionRequirement: 'Source: CPCB | GODL', reusePermission: 'store: cache 1h, display: yes', dataSensitivity: 'public', updateFrequency: 'realtime', expectedRefreshInterval: '1h', lastPublishedDate: '2024-08-25', parserVersion: 'cpcb_api_v1.0', status: 'active', owner: 'data-ops' },
    // Tier C — Official webpage/document (quote only)
    { sourceId: 'src_cag_mh_2024', organization: 'CAG', department: 'PAG Maharashtra', governmentLevel: 'state', sourceName: 'CAG Audit Report No.4 2023-24', sourceUrl: 'https://cag.gov.in/uploads/en/.../Report-4-MH.pdf', sourceType: 'C-document', license: 'Fair-use-quotation', termsUrl: 'https://cag.gov.in/terms', attributionRequirement: 'Source: CAG Report No.4 of 2024, Para 3.7', reusePermission: 'store: excerpt ≤200 chars, display: quote + link, redistribute: no', dataSensitivity: 'public', updateFrequency: 'annual', expectedRefreshInterval: '365d', lastPublishedDate: '2024-03-14', parserVersion: 'cag_pdf_tabula_v0.8', status: 'active', owner: 'data-ops' },
    { sourceId: 'src_maharera', organization: 'MahaRERA', department: 'Housing', governmentLevel: 'state', sourceName: 'MahaRERA Project Page', sourceUrl: 'https://maharera.mahaonline.gov.in', sourceType: 'C-webpage', license: 'Fair-use', termsUrl: 'https://maharera.mahaonline.gov.in/terms', attributionRequirement: 'Source: MahaRERA', reusePermission: 'store: excerpt, display: quote + link', dataSensitivity: 'public', updateFrequency: 'daily', expectedRefreshInterval: '1d', lastPublishedDate: '2024-08-20', parserVersion: 'rera_scrape_v0.5', status: 'degraded', owner: 'data-ops', notes: 'CAPTCHA proxy required' },
    // Tier D — Independent
    { sourceId: 'src_adr_2024', organization: 'ADR', department: 'MyNeta', governmentLevel: 'independent', sourceName: 'ADR Estimated Spend 2024', sourceUrl: 'https://adrindia.org', sourceType: 'D-independent', license: 'CC-BY-4.0', termsUrl: 'https://adrindia.org/terms', attributionRequirement: 'Source: ADR | ECI + CC-BY', reusePermission: 'store/transform/display/redistribute: yes (CC-BY)', dataSensitivity: 'public', updateFrequency: 'per_election', expectedRefreshInterval: 'session', lastPublishedDate: '2024-05-01', parserVersion: 'adr_scrape_v1.0', status: 'active', owner: 'data-ops' },
    // Tier E — Community
    { sourceId: 'src_community_school', organization: 'JantaX', department: 'Community', governmentLevel: 'community', sourceName: 'Parent Check-in', sourceUrl: 'https://jantax.in/report', sourceType: 'E-community', license: 'Community-CC0', termsUrl: 'https://jantax.in/privacy', attributionRequirement: 'Anon • SHA-256+salt', reusePermission: 'store: anon, transform: aggregate, display: aggregate', dataSensitivity: 'community_anon', updateFrequency: 'realtime', expectedRefreshInterval: '1d', lastPublishedDate: '2024-08-25', parserVersion: 'community_v1.0', status: 'active', owner: 'moderation@jantax.in' },
  ];
  for (const s of sources) {
    await prisma.source.upsert({
      where: { sourceId: s.sourceId },
      update: { lastChecked: new Date(), lastSuccessfulSync: new Date(), status: s.status as any },
      create: {
        sourceId: s.sourceId,
        organization: s.organization,
        department: s.department,
        governmentLevel: s.governmentLevel,
        sourceName: s.sourceName,
        sourceUrl: s.sourceUrl,
        apiUrl: (s as any).apiUrl || null,
        datasetUrl: (s as any).datasetUrl || null,
        sourceType: s.sourceType,
        license: s.license,
        termsUrl: s.termsUrl || null,
        attributionRequirement: s.attributionRequirement,
        reusePermission: s.reusePermission,
        dataSensitivity: s.dataSensitivity,
        updateFrequency: s.updateFrequency,
        expectedRefreshInterval: s.expectedRefreshInterval,
        lastChecked: new Date(),
        lastSuccessfulSync: new Date(),
        lastPublishedDate: s.lastPublishedDate,
        parserVersion: s.parserVersion,
        status: s.status,
        owner: s.owner,
        notes: (s as any).notes || null,
      },
    });
  }
  console.log(`✓ Sources ${sources.length} (A-E)`);

  console.log('🌱 Seed done — 15 modules + governance populated');
}

main().then(()=>prisma.$disconnect()).catch(e=>{ console.error(e); prisma.$disconnect(); process.exit(1); });
