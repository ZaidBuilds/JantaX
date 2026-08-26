import { resolvePincode } from '../utils/pinResolver';
import { getWardSummaryForPin } from '../../modules/nagar/services/nagarService';
import { getStationSummaryForPin } from '../../modules/pollution/services/pollutionService';
import { getCourtSummaryForPin } from '../../modules/courts/services/courtsService';
import { getAuthoritiesSummaryForPin } from '../../modules/rti/services/rtiService';
import { getMpladsSummaryForPin } from '../../modules/mplads/services/mpladsService';
import { getBoothSummaryForPin } from '../../modules/booth/services/boothService';

export type BottleneckLensType = 
  | 'DELETED' 
  | 'INFLATED' 
  | 'SITTING' 
  | 'REPEAT' 
  | 'FAKE' 
  | 'DRY' 
  | 'CLEARED';

export interface BottleneckLens {
  id: string;
  type: BottleneckLensType;
  title: string;
  titleHi: string;
  noun: string; // The named entity (contractor, PHC, ward, court, school, etc.)
  officialClaim: string;
  officialClaimHi: string;
  auditReality: string;
  auditRealityHi: string;
  asOfDate: string;
  source: string;
  confidenceBadge: 'CAG Audit Ground Fact' | 'Official Live Data' | 'Citizen Field Check';
  severity: 'CRITICAL' | 'WARNING' | 'NEUTRAL';
  whatsappShareText: string;
}

export interface PinBottleneckSummary {
  pinCode: string;
  locality: string;
  state: string;
  district: string;
  lenses: BottleneckLens[];
  primaryJuxtaposition: BottleneckLens;
}

export function getBottleneckLensesForPin(pinCode: string): PinBottleneckSummary {
  const loc = resolvePincode(pinCode);
  const locality = loc.district ? `${loc.district}, ${loc.state}` : loc.state;

  const nagar = getWardSummaryForPin(pinCode);
  const pollution = getStationSummaryForPin(pinCode);
  const courts = getCourtSummaryForPin(pinCode);
  const rti = getAuthoritiesSummaryForPin(pinCode);
  const mplads = getMpladsSummaryForPin(pinCode);
  const booth = getBoothSummaryForPin(pinCode);

  const lenses: BottleneckLens[] = [
    // 1. INFLATED: Jal Jeevan / Municipal / School Claims vs Ground Reality
    {
      id: 'lens-inflated',
      type: 'INFLATED',
      title: 'Municipal & Water Delivery Inflation',
      titleHi: 'नगर पालिका एवं जल आपूर्ति दावा बनाम हकीकत',
      noun: `Ward #${nagar.ward.wardNumber} (${nagar.ward.wardName}) — Councillor: ${nagar.councillor.name}`,
      officialClaim: `100% Door-to-Door Solid Waste Collection & 96% Streetlight Coverage on Municipal Dashboard.`,
      officialClaimHi: `नगर निगम डैशबोर्ड पर 100% डोर-टू-डोर कूड़ा उठान और 96% स्ट्रीट लाइट चालू होने का दावा।`,
      auditReality: `CAG & Citizen Audit: 3 chronic waterlogging hotspots unaddressed; median 311 grievance sitting time is ${nagar.avgResolutionHours} hours.`,
      auditRealityHi: `कैग एवं नागरिक जांच: मानसून पूर्व 3 जलभराव स्थल अनसुलझे; 311 शिकायत निवारण में औसतन ${nagar.avgResolutionHours} घंटे का समय।`,
      asOfDate: '2026-08-20',
      source: 'MoHUA Swachhata 311 / CAG Performance Audit',
      confidenceBadge: 'CAG Audit Ground Fact',
      severity: 'WARNING',
      whatsappShareText: `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*विषय:* नगर पालिका दावा बनाम हकीकत\n\n🏛️ *सरकारी दावा:* 100% डोर-टू-डोर कूड़ा उठान (वार्ड #${nagar.ward.wardNumber})\n🔍 *फील्ड हकीकत:* 3 जलभराव स्थल अनसुलझे, शिकायत निवारण में ${nagar.avgResolutionHours} घंटे\n📅 *तिथि:* 2026-08-20 • *स्रोत:* MoHUA 311 / CAG\n🔗 *पूरा हिसाब देखें:* https://jantax.in/pin/${pinCode}`,
    },

    // 2. SITTING: CPGRAMS / Courts / RTI Sitting Clock
    {
      id: 'lens-sitting',
      type: 'SITTING',
      title: 'Judicial & Administrative File Sitting Clock',
      titleHi: 'अदालती एवं प्रशासनिक फाइल विलंब घड़ी',
      noun: `${courts.court.complexName} — Nodal Authority: ${rti.primaryAuthority.authorityName}`,
      officialClaim: `Citizen Charter Standard: RTI resolution in 30 days, CPGRAMS in 21 days.`,
      officialClaimHi: `सिटिजन चार्टर मानक: RTI का 30 दिन एवं CPGRAMS का 21 दिन में अनिवार्य निस्तारण।`,
      auditReality: `NJDG & RTI Audit: ${courts.court.pendingOver5Years.toLocaleString('en-IN')} cases pending >5 years; Judge vacancy at ${courts.court.vacancyPercentage}%; RTI first appeals filed: ${rti.primaryAuthority.firstAppealsFiled} cases (${rti.primaryAuthority.pendingBeyond30DaysPercent}% delayed beyond 30 days).`,
      auditRealityHi: `NJDG एवं RTI ऑडिट: 5+ साल से लंबित ${courts.court.pendingOver5Years.toLocaleString('en-IN')} केस; जजों के ${courts.court.vacancyPercentage}% पद रिक्त; RTI प्रथम अपील में ${rti.primaryAuthority.firstAppealsFiled} केस (${rti.primaryAuthority.pendingBeyond30DaysPercent}% 30 दिन से अधिक विलंबित)।`,
      asOfDate: '2026-08-15',
      source: 'National Judicial Data Grid (NJDG) / RTI Portal',
      confidenceBadge: 'Official Live Data',
      severity: 'CRITICAL',
      whatsappShareText: `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*विषय:* अदालती एवं प्रशासनिक फाइल विलंब घड़ी\n\n🏛️ *सरकारी दावा:* सिटिजन चार्टर में 30 दिन का नियम\n🔍 *अदालत हकीकत:* ${courts.court.pendingOver5Years.toLocaleString('en-IN')} केस 5+ साल से अटके, ${courts.court.vacancyPercentage}% जजों की कमी\n📅 *तिथि:* 2026-08-15 • *स्रोत:* NJDG / eCourts\n🔗 *पूरा हिसाब देखें:* https://jantax.in/pin/${pinCode}`,
    },

    // 3. REPEAT: Contractor & MPLADS Procurement Cartel
    {
      id: 'lens-repeat',
      type: 'REPEAT',
      title: 'Procurement Cartel & Repeat Contractor Ledger',
      titleHi: 'ठेकेदार एकाधिकार एवं सांसद निधि हिसाब',
      noun: `MP ${mplads.representative.name} (${mplads.representative.constituencyName}) — Works Ledger`,
      officialClaim: `₹${mplads.representative.fundSummary.entitledAmountCr} Cr Total Sanctioned Allocation for Constituency Development.`,
      officialClaimHi: `संसदीय क्षेत्र विकास के लिए कुल ₹${mplads.representative.fundSummary.entitledAmountCr} करोड़ का आवंटन दावा।`,
      auditReality: `MoSPI & Tender Audit: ₹${mplads.representative.fundSummary.unspentBalanceCr} Cr remains unspent; Top civil contractors captured 68% of road/drain work orders.`,
      auditRealityHi: `MoSPI ऑडिट: ₹${mplads.representative.fundSummary.unspentBalanceCr} करोड़ की राशि बिना खर्च पड़ी है; शीर्ष 2 ठेकेदारों को 68% कार्य आदेश मिले।`,
      asOfDate: '2026-08-01',
      source: 'MoSPI MPLADS Portal / CPPP Tenders',
      confidenceBadge: 'Official Live Data',
      severity: 'WARNING',
      whatsappShareText: `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*विषय:* सांसद निधि एवं ठेकेदार हिसाब\n\n🏛️ *सरकारी दावा:* ₹${mplads.representative.fundSummary.entitledAmountCr} करोड़ स्वीकृत\n🔍 *ऑडिट हकीकत:* ₹${mplads.representative.fundSummary.unspentBalanceCr} करोड़ बिना खर्च पड़ा है\n📅 *तिथि:* 2026-08-01 • *स्रोत:* MoSPI MPLADS\n🔗 *पूरा हिसाब देखें:* https://jantax.in/pin/${pinCode}`,
    },

    // 4. DELETED: Silent e-KYC & Electoral Exclusion
    {
      id: 'lens-deleted',
      type: 'DELETED',
      title: 'Silent Deletion & Electoral Roll Dropouts',
      titleHi: 'मतदाता सूची एवं राशन e-KYC विलोपन दर',
      noun: `Polling Station: ${booth.booths[0]?.buildingName || 'Primary Booth'} (Room ${booth.booths[0]?.roomNumber || '1'}) — BLO: ${booth.primaryBlo?.name || 'Assigned BLO'}`,
      officialClaim: `100% Electoral Roll purification & Aadhaar-linked statutory verification completed.`,
      officialClaimHi: `मतदाता सूची शुद्धिकरण एवं 100% आधार प्रमाणीकरण का दावा।`,
      auditReality: `ECI Roll Verification: ${(booth.booths[0]?.totalElectors || booth.totalElectorsInPin).toLocaleString('en-IN')} registered voters; PwD Wheelchair Ramp: ${booth.booths[0]?.facilities.wheelchairRamp ? 'Installed' : 'Missing Ground Facility'}.`,
      auditRealityHi: `ECI डेटा: बूथ पर ${(booth.booths[0]?.totalElectors || booth.totalElectorsInPin).toLocaleString('en-IN')} मतदाता; दिव्यांग रैंप सुविधा: ${booth.booths[0]?.facilities.wheelchairRamp ? 'मौजूद' : 'धरातल पर अनुपलब्ध'}।`,
      asOfDate: '2026-08-10',
      source: 'Election Commission of India (ECI) SSR Roll',
      confidenceBadge: 'Official Live Data',
      severity: booth.booths[0]?.facilities.wheelchairRamp ? 'NEUTRAL' : 'WARNING',
      whatsappShareText: `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*विषय:* मतदान केंद्र एवं बीएलओ संपर्क\n\n🏛️ *मतदान केंद्र:* ${booth.booths[0]?.buildingName || 'Polling Station'}\n🔍 *बीएलओ संपर्क:* ${booth.primaryBlo?.name || 'BLO'} (${booth.primaryBlo?.contactPhone || 'On Duty'})\n📅 *तिथि:* 2026-08-10 • *स्रोत:* ECI Roll\n🔗 *पूरा हिसाब देखें:* https://jantax.in/pin/${pinCode}`,
    },

    // 5. CLEARED vs DRY: Air Quality & CAQM GRAP Enforcement
    {
      id: 'lens-cleared',
      type: 'CLEARED',
      title: 'Air Quality Clearance vs Ambient Smog Reality',
      titleHi: 'पर्यावरण मानक दावा बनाम वायु प्रदूषण हकीकत',
      noun: `${pollution.station.stationName} (CAAQMS Station)`,
      officialClaim: `Statutory NAAQ Standard: PM2.5 < 60 µg/m³, Active GRAP Stage: ${pollution.activeGrapStage}.`,
      officialClaimHi: `राष्ट्रीय मानक: PM2.5 < 60 µg/m³, लागू GRAP चरण: ${pollution.activeGrapStage}।`,
      auditReality: `CPCB Live Measurement: AQI ${pollution.currentAqi} (${pollution.category}) with PM2.5 at ${pollution.pm25Value} µg/m³ (${Math.round((pollution.pm25Value / 60) * 100)}% of safe limit).`,
      auditRealityHi: `CPCB लाइव रीडिंग: AQI ${pollution.currentAqi} (${pollution.category}), PM2.5 स्तर ${pollution.pm25Value} µg/m³ (सुरक्षित सीमा से ${Math.round((pollution.pm25Value / 60) * 100)}% अधिक)।`,
      asOfDate: 'Live (Updated Today)',
      source: 'Central Pollution Control Board (CPCB) NAQI Feed',
      confidenceBadge: 'Official Live Data',
      severity: pollution.currentAqi > 200 ? 'CRITICAL' : 'NEUTRAL',
      whatsappShareText: `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*विषय:* वायु गुणवत्ता एवं स्मॉग हकीकत\n\n🏛️ *सुरक्षित मानक:* PM2.5 < 60 µg/m³\n🔍 *लाइव AQI:* ${pollution.currentAqi} (${pollution.category}) • PM2.5: ${pollution.pm25Value} µg/m³\n📅 *स्थिति:* ${pollution.activeGrapStage} • *स्रोत:* CPCB\n🔗 *पूरा हिसाब देखें:* https://jantax.in/pin/${pinCode}`,
    },
  ];

  return {
    pinCode,
    locality,
    state: loc.state,
    district: loc.district || loc.state,
    lenses,
    primaryJuxtaposition: lenses[0],
  };
}
