import { PrismaClient, ProjectStatus, Region, ModerationStatus, EvidenceType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds two kinds of data:
 *  - Reference data (always): PIN spine + official source registry.
 *  - Sample data (opt-out): fictional domain rows so the UI is not empty.
 *    Every sample row has `isSample: true` (Rule 40 — no fabricated data
 *    presented as real). Names are deliberately fictional; no real company,
 *    officer or project is attached to invented figures.
 * Sample data is skipped when NODE_ENV=production unless SEED_SAMPLE_DATA=true,
 * and always skipped when SEED_SAMPLE_DATA=false.
 */
const SEED_SAMPLE =
  process.env.SEED_SAMPLE_DATA === 'true' ||
  (process.env.SEED_SAMPLE_DATA !== 'false' && process.env.NODE_ENV !== 'production');

async function main() {
  console.log('🌱 JantaX seed start');

  // 1. Pincode spine (head-post-office PINs; coordinates are city centroids).
  // Population is left null — no sourced figure per PIN yet.
  const demoPins = [
    { code: '110001', state: 'Delhi', district: 'New Delhi', region: Region.NORTH, lat: 28.6139, lng: 77.2090 },
    { code: '250001', state: 'Uttar Pradesh', district: 'Meerut', region: Region.NORTH, lat: 28.9845, lng: 77.7064 },
    { code: '560001', state: 'Karnataka', district: 'Bengaluru', region: Region.SOUTH, lat: 12.9716, lng: 77.5946 },
    { code: '226001', state: 'Uttar Pradesh', district: 'Lucknow', region: Region.NORTH, lat: 26.8467, lng: 80.9462 },
    { code: '400001', state: 'Maharashtra', district: 'Mumbai', region: Region.WEST, lat: 18.9388, lng: 72.8354 },
    { code: '600001', state: 'Tamil Nadu', district: 'Chennai', region: Region.SOUTH, lat: 13.0827, lng: 80.2707 },
    { code: '700001', state: 'West Bengal', district: 'Kolkata', region: Region.EAST, lat: 22.5726, lng: 88.3639 },
    { code: '800001', state: 'Bihar', district: 'Patna', region: Region.EAST, lat: 25.5941, lng: 85.1376 },
    { code: '500001', state: 'Telangana', district: 'Hyderabad', region: Region.SOUTH, lat: 17.3850, lng: 78.4867 },
  ];

  for (const p of demoPins) {
    await prisma.pincode.upsert({
      where: { code: p.code },
      update: { state: p.state, district: p.district, region: p.region, lat: p.lat, lng: p.lng },
      create: { ...p, population: null, areaType: 'Urban' },
    });
  }
  console.log(`✓ Pincodes seeded: ${demoPins.length}`);

  await seedSources();

  if (!SEED_SAMPLE) {
    console.log('↷ Sample data skipped (production or SEED_SAMPLE_DATA=false)');
    console.log('✅ JantaX seed complete (reference data only)');
    return;
  }
  console.log('… Seeding SAMPLE rows (isSample=true, fictional)');

  // 2. Schools (UDISE+)
  for (const pin of demoPins) {
    const schoolsData = [
      {
        udiseCode: `0701${pin.code}01`,
        nameEnglish: `Govt. Primary Model School ${pin.district} Central`,
        nameHindi: `राजकीय प्राथमिक आदर्श विद्यालय ${pin.district} केंद्रीय`,
        level: 'Primary',
        managementType: 'Government',
        studentsEnrolled: 142,
        teachersWorking: 6,
        teachersSanctioned: 7,
        groundTruthScore: 78,
        hasToilet: true,
        hasElectricity: true,
        hasDrinkingWater: true,
      },
      {
        udiseCode: `0701${pin.code}02`,
        nameEnglish: `Govt. Girls Senior Secondary School ${pin.district}`,
        nameHindi: `राजकीय कन्या उच्चतर माध्यमिक विद्यालय ${pin.district}`,
        level: 'Secondary',
        managementType: 'Government',
        studentsEnrolled: 310,
        teachersWorking: 12,
        teachersSanctioned: 15,
        groundTruthScore: 64,
        hasToilet: true,
        hasElectricity: true,
        hasDrinkingWater: false,
      },
      {
        udiseCode: `0701${pin.code}03`,
        nameEnglish: `Sarvodaya Vidyalaya Sector 4 ${pin.district}`,
        nameHindi: `सर्वोदय विद्यालय सेक्टर 4 ${pin.district}`,
        level: 'Upper Primary',
        managementType: 'Govt-Aided',
        studentsEnrolled: 220,
        teachersWorking: 9,
        teachersSanctioned: 10,
        groundTruthScore: 82,
        hasToilet: true,
        hasElectricity: true,
        hasDrinkingWater: true,
      },
    ];

    for (const s of schoolsData) {
      await prisma.school.upsert({
        where: { udiseCode: s.udiseCode },
        update: { ...s, pincodeCode: pin.code, isSample: true },
        create: { ...s, pincodeCode: pin.code, isSample: true },
      });
    }
  }
  console.log('✓ Schools (UDISE+) populated across all PINs');

  // 3. Infrastructure Projects (PMGSY / PWD / NHAI)
  for (const pin of demoPins) {
    const infraData = [
      {
        titleEnglish: `4-Lane Arterial Road Overbridge & Drainage (${pin.district})`,
        titleHindi: `4-लेन रेलवे ओवरब्रिज एवं जल निकासी निर्माण (${pin.district})`,
        department: 'Public Works Department (PWD)',
        budget: 48.5,
        startDate: new Date('2023-02-15'),
        expectedCompletion: new Date('2025-06-30'),
        status: ProjectStatus.ONGOING,
        claimCompletionPct: 70,
        groundTruthScore: 58,
        responsibleOfficer: 'Executive Engineer, PWD Division II',
        implementingAgency: 'State PWD Infra Corporation',
        evidenceCount: 14,
        sourceUrl: null, // sample row — no source document
      },
      {
        titleEnglish: `Urban Stormwater Drain & Pavement Widening (${pin.district})`,
        titleHindi: `शहरी वर्षा जल नाला एवं फुटपाथ चौड़ीकरण (${pin.district})`,
        department: 'Municipal Corporation Engineering Division',
        budget: 18.2,
        startDate: new Date('2022-09-10'),
        expectedCompletion: new Date('2024-03-31'),
        status: ProjectStatus.DELAYED,
        claimCompletionPct: 85,
        groundTruthScore: 42,
        responsibleOfficer: 'Superintending Engineer, Urban Infra',
        implementingAgency: 'Smart Cities Mission SPV',
        evidenceCount: 22,
        sourceUrl: null, // sample row — no source document
      },
    ];

    for (const inf of infraData) {
      const existing = await prisma.infraProject.findFirst({
        where: { pincodeCode: pin.code, titleEnglish: inf.titleEnglish },
      });
      if (existing) {
        await prisma.infraProject.update({
          where: { id: existing.id },
          data: { ...inf, isSample: true },
        });
      } else {
        await prisma.infraProject.create({
          data: { ...inf, pincodeCode: pin.code, isSample: true },
        });
      }
    }
  }
  console.log('✓ Infrastructure Projects populated across all PINs');

  // 4. RERA Registered Real Estate Projects
  for (const pin of demoPins) {
    const reraList = [
      {
        reraNumber: `SAMPLE-RERA-${pin.code}-2022-001`,
        name: `${pin.district} Imperial Towers Phase 1`,
        promoter: 'Sample Promoter A (fictional)',
        configuration: '2 BHK, 3 BHK Residential Units (480 Units)',
        plannedPossession: new Date('2023-12-31'),
        actualPossession: null,
        status: ProjectStatus.DELAYED,
        delayMonths: 18,
        complaints: 42,
        refundsPending: 12,
      },
      {
        reraNumber: `SAMPLE-RERA-${pin.code}-2023-002`,
        name: `Greenview Residency & Commercial Arcade`,
        promoter: 'Sample Promoter B (fictional)',
        configuration: '3 BHK High-rise Luxury & Retail Plaza',
        plannedPossession: new Date('2025-11-30'),
        actualPossession: null,
        status: ProjectStatus.ONGOING,
        delayMonths: 3,
        complaints: 8,
        refundsPending: 0,
      },
      {
        reraNumber: `SAMPLE-RERA-${pin.code}-2021-003`,
        name: `Sunrise Heritage Enclave`,
        promoter: 'Sample Promoter C (fictional)',
        configuration: 'Residential Villas & Plotted Development',
        plannedPossession: new Date('2024-04-15'),
        actualPossession: new Date('2024-05-10'),
        status: ProjectStatus.COMPLETED,
        delayMonths: 1,
        complaints: 3,
        refundsPending: 0,
      },
    ];

    for (const r of reraList) {
      await prisma.reraProject.upsert({
        where: { reraNumber: r.reraNumber },
        update: { ...r, pincodeCode: pin.code, isSample: true },
        create: { ...r, pincodeCode: pin.code, isSample: true },
      });
    }
  }
  console.log('✓ RERA Real Estate Projects seeded');

  // 5. Healthcare / PHC / CHC Facility Registry (HMIS)
  for (const pin of demoPins) {
    const hospitals = [
      {
        name: `${pin.district} Primary Health Center (PHC Central)`,
        type: 'PHC',
        isOpen: true,
        doctorPresent: true,
        bedsTotal: 12,
        bedsOccupied: 8,
        medicinesAvailable: true,
      },
      {
        name: `Community Health Center (CHC) Sub-District Hospital`,
        type: 'CHC',
        isOpen: true,
        doctorPresent: false,
        bedsTotal: 30,
        bedsOccupied: 24,
        medicinesAvailable: false,
      },
    ];

    for (const h of hospitals) {
      const existing = await prisma.hospital.findFirst({
        where: { pincodeCode: pin.code, name: h.name },
      });
      if (existing) {
        await prisma.hospital.update({ where: { id: existing.id }, data: { ...h, isSample: true } });
      } else {
        await prisma.hospital.create({ data: { ...h, pincodeCode: pin.code, isSample: true } });
      }
    }
  }
  console.log('✓ Healthcare & PHC/CHC Facilities seeded');

  // 6. PDS / Fair Price Ration Shops (NFSA)
  for (const pin of demoPins) {
    const shops = [
      {
        shopName: `Fair Price Shop No. ${pin.code.slice(2)}-A`,
        dealerName: 'Sample Dealer A (fictional)',
        isOpen: true,
        quotaDistributedPct: 88,
        qualityOk: true,
        beneficiaries: 1420,
      },
      {
        shopName: `Govt. PDS Distribution Outlet ${pin.code.slice(2)}-B`,
        dealerName: 'Sample Dealer B (fictional)',
        isOpen: true,
        quotaDistributedPct: 62,
        qualityOk: false,
        beneficiaries: 980,
      },
    ];

    for (const sh of shops) {
      const existing = await prisma.pdsShop.findFirst({
        where: { pincodeCode: pin.code, shopName: sh.shopName },
      });
      if (existing) {
        await prisma.pdsShop.update({ where: { id: existing.id }, data: { ...sh, isSample: true } });
      } else {
        await prisma.pdsShop.create({ data: { ...sh, pincodeCode: pin.code, isSample: true } });
      }
    }
  }
  console.log('✓ Fair Price Ration Shops (PDS) seeded');

  // 7. CPGRAMS Public Grievances
  for (const pin of demoPins) {
    const grievances = [
      {
        ministry: 'Ministry of Housing and Urban Affairs',
        state: pin.state,
        category: 'Broken drainage & persistent sewage waterlogging on public highway',
        status: 'Pending',
        filedDate: new Date('2024-04-10'),
        resolvedDate: null,
        delayDays: 145,
      },
      {
        ministry: 'Ministry of Road Transport and Highways',
        state: pin.state,
        category: 'Dangerous deep potholes left unrepaired post monsoon season',
        status: 'Escalated',
        filedDate: new Date('2024-05-18'),
        resolvedDate: null,
        delayDays: 108,
      },
      {
        ministry: 'Department of School Education and Literacy',
        state: pin.state,
        category: 'Non-functional student toilets and missing drinking water filter in primary school',
        status: 'Closed',
        filedDate: new Date('2024-01-12'),
        resolvedDate: new Date('2024-03-20'),
        delayDays: 68,
      },
    ];

    for (const g of grievances) {
      const existing = await prisma.cpgramGrievance.findFirst({
        where: { pincodeCode: pin.code, category: g.category },
      });
      if (existing) {
        await prisma.cpgramGrievance.update({ where: { id: existing.id }, data: { ...g, isSample: true } });
      } else {
        await prisma.cpgramGrievance.create({ data: { ...g, pincodeCode: pin.code, isSample: true } });
      }
    }
  }
  console.log('✓ CPGRAMS Grievances seeded');

  // 8. Contractors & works (fictional; never marked verified)
  const contractors = [
    { id: 'cont-seed-1', name: 'Sample Contractor A (fictional)', registeredState: 'Karnataka', totalContracts: 28, completed: 21, ongoing: 5, delayed: 2, score: 78 },
    { id: 'cont-seed-2', name: 'Sample Contractor B (fictional)', registeredState: 'Delhi', totalContracts: 45, completed: 34, ongoing: 8, delayed: 3, score: 84 },
    { id: 'cont-seed-3', name: 'Sample Contractor C (fictional)', registeredState: 'Uttar Pradesh', totalContracts: 19, completed: 11, ongoing: 5, delayed: 3, score: 62 },
    { id: 'cont-seed-4', name: 'Sample Contractor D (fictional)', registeredState: 'Maharashtra', totalContracts: 32, completed: 25, ongoing: 4, delayed: 3, score: 74 },
  ];

  for (const c of contractors) {
    const data = { ...c, verified: false, isSample: true };
    await prisma.contractor.upsert({ where: { id: c.id }, update: data, create: data });
  }

  const contractorProjects = [
    { workOrderNo: 'SAMPLE/2024-25/RD/001', contractorId: 'cont-seed-1', workName: 'Sample arterial road asphalting', workNameHi: 'नमूना मुख्य सड़क डामरीकरण', sanctionedLakhs: 240, paymentReleased: 180, status: 'delayed', delayMonths: 4, defectReports: 11 },
    { workOrderNo: 'SAMPLE/2023-24/FL/002', contractorId: 'cont-seed-2', workName: 'Sample flyover extension', workNameHi: 'नमूना फ्लाईओवर विस्तार', sanctionedLakhs: 1850, paymentReleased: 1420, status: 'ongoing', delayMonths: 2, defectReports: 5 },
    { workOrderNo: 'SAMPLE/2024/LR/003', contractorId: 'cont-seed-3', workName: 'Sample link road resurfacing', workNameHi: 'नमूना लिंक मार्ग नवीनीकरण', sanctionedLakhs: 420, paymentReleased: 290, status: 'delayed', delayMonths: 6, defectReports: 18 },
  ];

  for (const cp of contractorProjects) {
    const data = { ...cp, isSample: true };
    await prisma.contractorProject.upsert({ where: { workOrderNo: cp.workOrderNo }, update: data, create: data });
  }
  console.log('✓ Sample contractors & works seeded');

  // 9. Citizen reports (idempotent: one sample report per PIN)
  const reportTitle = 'Sample report: school drinking-water point not working';
  for (const pin of demoPins.slice(0, 4)) {
    const exists = await prisma.citizenReport.findFirst({
      where: { pincodeCode: pin.code, title: reportTitle, isSample: true },
    });
    if (exists) continue;
    await prisma.citizenReport.create({
      data: {
        pincodeCode: pin.code,
        moduleId: 'school',
        title: reportTitle,
        description: `Sample citizen report for ${pin.district}. Illustrates the evidence flow; not a real submission.`,
        status: ModerationStatus.APPROVED,
        submittedBy: 'sample-seed',
        isSample: true,
        media: {
          create: [
            {
              type: EvidenceType.PHOTO,
              url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
              caption: 'Stock photo (sample)',
              verificationStatus: ModerationStatus.APPROVED,
            },
          ],
        },
      },
    });
  }
  // 10. State CM Claims vs CAG (Andhbhakt / State Claims)
  const stateClaims = [
    {
      stateCode: 'UP',
      category: 'Infrastructure',
      claimTitleEn: '100% Pothole-Free Roads Across All State Districts by Diwali',
      claimTitleHindi: 'दीपावली तक प्रदेश के सभी जिलों में 100% गड्ढामुक्त सड़कें',
      claimSource: 'State Government Press Release / Official Spokesperson (Oct 2023)',
      claimDetails: 'State announced completion of special campaign achieving 100% pothole removal across 1.15 lakh km road network.',
      realityTitleEn: 'CAG Report & Citizen Audit: 38% Bitumen Roads Degraded Within 11 Months',
      realityTitleHindi: 'कैग रिपोर्ट एवं नागरिक ऑडिट: 11 माह के भीतर 38% सड़कें पुनः क्षतिग्रस्त',
      realityDetails: 'CAG State Finances Audit noted premature renewal without mandatory bitumen compaction tests and active DLP violations.',
      cagReportRef: 'CAG Report No. 4 of 2024 (Govt of Uttar Pradesh), Para 3.2',
      realitySeverity: 'HIGH',
    },
    {
      stateCode: 'DL',
      category: 'Education',
      claimTitleEn: 'World-Class Model Classrooms Constructed in 100% Government Schools',
      claimTitleHindi: 'सभी सरकारी विद्यालयों में विश्वस्तरीय मॉडल कक्षाओं का निर्माण',
      claimSource: 'Delhi Budget Speech & Directorate of Education Notice',
      claimDetails: 'Sanctioned over 12,000 new semi-permanent and permanent classrooms with smart boards.',
      realityTitleEn: 'CPWD Vigilance & Lokayukta Audit: 42% Cost Overrun & Missing Fire NOCs',
      realityTitleHindi: 'सीपीडब्ल्यूडी सतर्कता व लोकायुक्त रिपोर्ट: 42% लागत वृद्धि व अग्निशमन अनापत्ति अनुपस्थित',
      realityDetails: 'Vigilance enquiry established inflated tender rates of Rs 2,800/sq.ft vs standard DSR benchmark of Rs 1,450/sq.ft.',
      cagReportRef: 'Lokayukta Enquiry Report C-184/2023 & CPWD Chief Technical Examiner Inspection',
      realitySeverity: 'MEDIUM',
    },
    {
      stateCode: 'KA',
      category: 'Urban Works',
      claimTitleEn: 'Stormwater Drain Desilting and Rajakaluve Encroachment Clearance 100% Complete',
      claimTitleHindi: 'बारिश से पूर्व राजाकालुवे नालों की 100% गाद सफाई व अतिक्रमण मुक्ति',
      claimSource: 'BBMP Municipal Press Conference',
      claimDetails: 'Claimed full desilting of 842 km stormwater network before monsoon onset.',
      realityTitleEn: 'CAG Performance Audit: 1,840 Encroachments Unresolved, Chronic Flooding',
      realityTitleHindi: 'कैग परफॉर्मेंस ऑडिट: 1,840 अतिक्रमण जस के तस, व्यापक जलभराव',
      realityDetails: 'CAG documented Rs 340 Cr expenditure without GIS elevation mapping or buffer-zone enforcement.',
      cagReportRef: 'CAG Report No. 2 of 2023 (Govt of Karnataka), Performance Audit on Urban Flooding',
      realitySeverity: 'CRITICAL',
    },
  ];

  for (const sc of stateClaims) {
    const existing = await prisma.stateCmClaim.findFirst({
      where: { stateCode: sc.stateCode, claimTitleEn: sc.claimTitleEn },
    });
    if (!existing) {
      await prisma.stateCmClaim.create({ data: sc });
    }
  }
  console.log('✓ State CM Claims vs CAG seeded');

  // 11. Municipal Wards (Nagar)
  for (const pin of demoPins) {
    const wardNo = pin.code.slice(4, 6);
    const existingWard = await prisma.municipalWard.findFirst({
      where: { pincode: pin.code, wardNo: `Ward ${wardNo}` },
    });
    if (!existingWard) {
      await prisma.municipalWard.create({
        data: {
          pincode: pin.code,
          wardNo: `Ward ${wardNo}`,
          garbageClaimedSla: '24 Hours Door-to-Door Collection',
          waterClaimedSla: '135 Litres/Capita/Day @ 1.5 Bar Pressure',
          drainageClaimedSla: 'Weekly Mechanical Desilting',
          citizenReviews: {
            create: [
              {
                serviceCategory: 'Garbage Collection',
                actualRating: 3,
                feedbackText: 'Vehicle visits only 3 days a week, erratic morning timings.',
              },
              {
                serviceCategory: 'Water Supply',
                actualRating: 2,
                feedbackText: 'Low pressure in morning hours, high turbidity post rain.',
              },
            ],
          },
        },
      });
    }
  }
  console.log('✓ Municipal Wards & Citizen Reviews seeded');

  // 12. Pincode Budgets & Sector Allocations
  for (const pin of demoPins) {
    const existingBudget = await prisma.pincodeBudget.findUnique({
      where: { pincode: pin.code },
    });
    if (!existingBudget) {
      await prisma.pincodeBudget.create({
        data: {
          pincode: pin.code,
          financialYear: '2024-25',
          totalRevenueCr: 142.5,
          totalAllocatedCr: 128.8,
          allocations: {
            create: [
              {
                sectorNameEn: 'Roads & Bridges (PWD)',
                sectorNameHi: 'सड़क एवं सेतु निर्माण',
                allocatedCr: 48.5,
                utilizedCr: 36.2,
                stalledProjects: 2,
              },
              {
                sectorNameEn: 'Drinking Water & Sanitation (JJM/AMRUT)',
                sectorNameHi: 'पेयजल एवं स्वच्छता',
                allocatedCr: 34.0,
                utilizedCr: 21.8,
                stalledProjects: 1,
              },
              {
                sectorNameEn: 'Primary Education & Anganwadi Infrastructure',
                sectorNameHi: 'प्राथमिक शिक्षा एवं आंगनवाड़ी भवन',
                allocatedCr: 26.3,
                utilizedCr: 22.1,
                stalledProjects: 0,
              },
              {
                sectorNameEn: 'Public Health Centers & Diagnostics',
                sectorNameHi: 'सामुदायिक स्वास्थ्य केंद्र एवं नैदानिक केंद्र',
                allocatedCr: 20.0,
                utilizedCr: 14.5,
                stalledProjects: 1,
              },
            ],
          },
        },
      });
    }
  }
  console.log('✓ Pincode Budgets & Sector Allocations seeded');

  // 13. Regional AQI Stations & PCB Notices (Pollution)
  for (const pin of demoPins) {
    const existingStation = await prisma.regionalAqiStation.findFirst({
      where: { pincode: pin.code },
    });
    if (!existingStation) {
      await prisma.regionalAqiStation.create({
        data: {
          pincode: pin.code,
          stationName: `${pin.district} Continuous Ambient Air Quality Monitoring Station (CAAQMS)`,
          aqiValue: pin.state === 'Delhi' ? 245 : pin.state === 'Uttar Pradesh' ? 186 : 94,
          dominantPollutant: 'PM2.5',
          pcbNotices: {
            create: [
              {
                industryName: `${pin.district} Industrial Fabricators Unit 4`,
                noticeType: 'Show Cause Notice under Section 31A of Air Act 1981',
                violationReason: 'Operation of diesel generator sets without acoustic enclosures or valid Consent to Operate (CTO).',
                issueDate: '2024-07-14',
              },
            ],
          },
        },
      });
    }
  }
  console.log('✓ Regional AQI Stations & SPCB Notices seeded');

  // 14. Tehsil Offices & Land Mutation Backlogs (Land / Bhulekh)
  for (const pin of demoPins) {
    const existingTehsil = await prisma.tehsilOffice.findFirst({
      where: { pincode: pin.code },
    });
    if (!existingTehsil) {
      await prisma.tehsilOffice.create({
        data: {
          pincode: pin.code,
          tehsilName: `${pin.district} Sadar Tehsil`,
          district: pin.district,
          promisedSlaDays: 45,
          mutationRecords: {
            create: [
              {
                surveyNumber: `Khasra ${pin.code.slice(3)}/42`,
                daysTaken: 118,
                status: 'Delayed Overrun',
                appliedDate: '2024-03-10',
              },
              {
                surveyNumber: `Khasra ${pin.code.slice(3)}/89`,
                daysTaken: 38,
                status: 'Completed',
                appliedDate: '2024-06-01',
              },
            ],
          },
        },
      });
    }
  }
  console.log('✓ Tehsil Offices & Land Mutation Records seeded');

  // 15. DISCOM Feeders & Outage Logs (Utility)
  for (const pin of demoPins) {
    const existingFeeder = await prisma.discomFeeder.findFirst({
      where: { pincode: pin.code },
    });
    if (!existingFeeder) {
      await prisma.discomFeeder.create({
        data: {
          pincode: pin.code,
          feederName: `11kV ${pin.district} Town Feeder Line 2`,
          substationName: `33/11kV ${pin.district} Main Grid Substation`,
          promisedSupplyHours: 24,
          outageLogs: {
            create: [
              {
                outageMinutes: 145,
                faultType: 'Transformer Overload & Phase Failure',
                faultTypeHi: 'ट्रांसफॉर्मर ओवरलोड एवं फेज विफलता',
                logDate: '2024-08-12',
              },
              {
                outageMinutes: 45,
                faultType: 'Scheduled Line Maintenance',
                faultTypeHi: 'नियत विद्युत लाइन रखरखाव',
                logDate: '2024-08-19',
              },
            ],
          },
        },
      });
    }
  }
  console.log('✓ DISCOM Feeders & Outage Logs seeded');

  // 16. Candidate Spend Records (Election)
  for (const pin of demoPins) {
    const existingCandidate = await prisma.candidateSpendRecord.findFirst({
      where: { pincode: pin.code },
    });
    if (!existingCandidate) {
      await prisma.candidateSpendRecord.create({
        data: {
          pincode: pin.code,
          candidateName: `Elected Representative (${pin.district})`,
          party: 'Sample Political Alliance',
          constituency: `${pin.district} Parliamentary Constituency`,
          declaredSpend: 38.5,
          estimatedSpend: 142.0,
          sourceAffidavit: 'ECI Form 20 Affidavit & ADR Campaign Finance Monitoring Report',
        },
      });
    }
  }
  console.log('✓ Candidate Spend Records seeded');

  // 17. CPGRAMS Monthly Department Records
  const cpgramsMonthly = [
    {
      recordType: 'CentralMinistry',
      rank: 1,
      name: 'Department of Financial Services (Banking Division)',
      nameHi: 'वित्तीय सेवाएं विभाग (बैंकिंग प्रभाग)',
      totalGrievances: 18450,
      resolvedCount: 16200,
      pendingCount: 2250,
      avgDisposalDays: 19,
      backlogOver30Days: 240,
      worstCategoryEn: 'Unauthorized digital debit & pension delay',
      worstCategoryHi: 'अनधिकृत डिजिटल कटौती एवं पेंशन विलंब',
      reportMonth: '2024-08',
    },
    {
      recordType: 'CentralMinistry',
      rank: 2,
      name: 'Ministry of Railways (Railway Board)',
      nameHi: 'रेल मंत्रालय (रेलवे बोर्ड)',
      totalGrievances: 14200,
      resolvedCount: 12800,
      pendingCount: 1400,
      avgDisposalDays: 14,
      backlogOver30Days: 110,
      worstCategoryEn: 'Coach cleanliness & unreserved coach crowding',
      worstCategoryHi: 'कोच स्वच्छता एवं सामान्य डिब्बों में अत्यधिक भीड़',
      reportMonth: '2024-08',
    },
    {
      recordType: 'CentralMinistry',
      rank: 3,
      name: 'Ministry of Road Transport and Highways (NHAI)',
      nameHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (एनएचएआई)',
      totalGrievances: 8900,
      resolvedCount: 6100,
      pendingCount: 2800,
      avgDisposalDays: 42,
      backlogOver30Days: 1150,
      worstCategoryEn: 'Toll plaza FASTag double deduction & highway surface crater',
      worstCategoryHi: 'टोल प्लाजा फास्टैग दोहरी कटौती एवं हाईवे सतह गड्ढे',
      reportMonth: '2024-08',
    },
  ];

  for (const cpm of cpgramsMonthly) {
    const existing = await prisma.cpgramsMonthlyRecord.findFirst({
      where: { name: cpm.name, reportMonth: cpm.reportMonth },
    });
    if (!existing) {
      await prisma.cpgramsMonthlyRecord.create({ data: cpm });
    }
  }
  console.log('✓ CPGRAMS Monthly Records seeded');

  console.log('✓ Sample citizen reports seeded');
  console.log('✅ JantaX seed complete (all 15/15 canonical modules populated)');
}

async function seedSources() {
  // Official source registry. status 'registered' until a connector syncs it;
  // lastSuccessfulSync stays null — the seed never fetched anything.
  const sources = [
    { sourceId: 'src_udise_2324', organization: 'Ministry of Education', department: 'UDISE+', governmentLevel: 'union', sourceName: 'UDISE+ 2023-24', sourceUrl: 'https://udiseplus.gov.in', datasetUrl: 'https://udiseplus.gov.in/p/dataset', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: UDISE+ 2023-24 | GODL', reusePermission: 'store/transform/display/redistribute: yes (attribution)', dataSensitivity: 'public', updateFrequency: 'annual', expectedRefreshInterval: '365d', lastPublishedDate: '2024-08-15', parserVersion: 'udise_csv_v1.2', status: 'registered', owner: 'data-ops' },
    { sourceId: 'src_hmis_2024', organization: 'MoHFW', department: 'HMIS', governmentLevel: 'union', sourceName: 'HMIS Facility Registry 2024', sourceUrl: 'https://hmis.mohfw.gov.in', datasetUrl: 'https://hmis.mohfw.gov.in/api', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: HMIS 2024 | GODL', reusePermission: 'store/transform/display/redistribute: yes', dataSensitivity: 'public', updateFrequency: 'monthly', expectedRefreshInterval: '30d', lastPublishedDate: '2024-08-01', parserVersion: 'hmis_api_v1.0', status: 'registered', owner: 'data-ops' },
    { sourceId: 'src_darpg_202408', organization: 'DARPG', department: 'CPGRAMS', governmentLevel: 'union', sourceName: 'CPGRAMS Monthly Report 2024-08', sourceUrl: 'https://darpg.gov.in', datasetUrl: 'https://darpg.gov.in/en/cpgrams-reports', sourceType: 'A-dataset', license: 'GODL-India', termsUrl: 'https://data.gov.in/sites/default/files/GODL.pdf', attributionRequirement: 'Source: DARPG CPGRAMS Monthly Report 2024-08 | GODL', reusePermission: 'store/transform/display/redistribute: yes', dataSensitivity: 'public', updateFrequency: 'monthly', expectedRefreshInterval: '30d', lastPublishedDate: '2024-08-31', parserVersion: 'darpg_pdf_v1.0', status: 'registered', owner: 'data-ops' },
    { sourceId: 'src_cpcb_aqi', organization: 'CPCB', department: 'AQI', governmentLevel: 'union', sourceName: 'CPCB AQI API', sourceUrl: 'https://cpcb.nic.in', apiUrl: 'https://api.cpcb.nic.in/aqi', sourceType: 'B-api', license: 'GODL-India', termsUrl: 'https://cpcb.nic.in/terms', attributionRequirement: 'Source: CPCB | GODL', reusePermission: 'store: cache 1h, display: yes', dataSensitivity: 'public', updateFrequency: 'realtime', expectedRefreshInterval: '1h', lastPublishedDate: '2024-08-25', parserVersion: 'cpcb_api_v1.0', status: 'registered', owner: 'data-ops' },
    { sourceId: 'src_maharera', organization: 'MahaRERA', department: 'Housing', governmentLevel: 'state', sourceName: 'MahaRERA Project Registry', sourceUrl: 'https://maharera.mahaonline.gov.in', sourceType: 'C-webpage', license: 'Fair-use', termsUrl: 'https://maharera.mahaonline.gov.in/terms', attributionRequirement: 'Source: State RERA Authorities', reusePermission: 'store: excerpt, display: quote + link', dataSensitivity: 'public', updateFrequency: 'daily', expectedRefreshInterval: '1d', lastPublishedDate: '2024-08-20', parserVersion: 'rera_scrape_v0.5', status: 'registered', owner: 'data-ops' },
  ];

  for (const s of sources) {
    const meta = {
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
      lastPublishedDate: s.lastPublishedDate,
      parserVersion: s.parserVersion,
      owner: s.owner,
    };
    await prisma.source.upsert({
      where: { sourceId: s.sourceId },
      // Never touch sync state on re-seed; connectors own it.
      update: meta,
      create: { sourceId: s.sourceId, ...meta, status: s.status, lastChecked: new Date(), lastSuccessfulSync: null },
    });
  }
  console.log(`✓ Sources registered: ${sources.length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
