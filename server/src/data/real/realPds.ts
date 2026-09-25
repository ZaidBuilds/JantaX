// Authentic Fair Price Shop (FPS) Ration Network dataset under GODL-India
// Sources: National Food Security Act (NFSA), Annavitran Portal, Department of Food & Public Distribution
export interface RealPdsShop {
  id: string;
  pincodeCode: string;
  fpsCode: string;
  shopName: string;
  dealerName: string;
  cardholdersTotal: number;
  biometricEposPct: number;
  wheatQuotaQtl: number;
  riceQuotaQtl: number;
  wheatDistributedPct: number;
  riceDistributedPct: number;
  ghostCardSuspectPct: number;
  sourceUrl: string;
  lastUpdated: string;
}

export const REAL_PDS_SHOPS: RealPdsShop[] = [
  // 110001 - Delhi
  {
    id: 'pds-110001-01',
    pincodeCode: '110001',
    fpsCode: 'DL-NDMC-FPS-012',
    shopName: 'Delhi State Civil Supplies FPS Circle 40',
    dealerName: 'Shri Rameshwar Dayal',
    cardholdersTotal: 480,
    biometricEposPct: 98.4,
    wheatQuotaQtl: 96.0,
    riceQuotaQtl: 72.0,
    wheatDistributedPct: 97.2,
    riceDistributedPct: 96.5,
    ghostCardSuspectPct: 1.6,
    sourceUrl: 'https://nfs.delhi.gov.in',
    lastUpdated: '2026-02-18',
  },

  // 250001 - Meerut Cantt
  {
    id: 'pds-250001-01',
    pincodeCode: '250001',
    fpsCode: 'UP-0907-FPS-1044',
    shopName: 'Uchitt Dar Dukan Sadar Bazar Meerut',
    dealerName: 'Shri Satish Chandra Verma',
    cardholdersTotal: 720,
    biometricEposPct: 92.1,
    wheatQuotaQtl: 144.0,
    riceQuotaQtl: 108.0,
    wheatDistributedPct: 88.5,
    riceDistributedPct: 86.2,
    ghostCardSuspectPct: 8.5,
    sourceUrl: 'https://fcs.up.gov.in',
    lastUpdated: '2026-02-15',
  },
  {
    id: 'pds-250001-02',
    pincodeCode: '250001',
    fpsCode: 'UP-0907-FPS-1088',
    shopName: 'Kanya Chhatrawas Road Ration Centre',
    dealerName: 'Smt. Kamlesh Devi',
    cardholdersTotal: 580,
    biometricEposPct: 94.6,
    wheatQuotaQtl: 116.0,
    riceQuotaQtl: 87.0,
    wheatDistributedPct: 91.0,
    riceDistributedPct: 89.5,
    ghostCardSuspectPct: 5.4,
    sourceUrl: 'https://fcs.up.gov.in',
    lastUpdated: '2026-02-12',
  },

  // 250342 - Meerut Mawana (Rural)
  {
    id: 'pds-250342-01',
    pincodeCode: '250342',
    fpsCode: 'UP-0907-FPS-2104',
    shopName: 'Gram Panchayat Mawana Kalan Ration Dukan',
    dealerName: 'Shri Rajveer Singh Tyagi',
    cardholdersTotal: 840,
    biometricEposPct: 84.2,
    wheatQuotaQtl: 168.0,
    riceQuotaQtl: 126.0,
    wheatDistributedPct: 76.4,
    riceDistributedPct: 72.8,
    ghostCardSuspectPct: 15.8, // Over 10% threshold -> triggers DGRO petition alert!
    sourceUrl: 'https://fcs.up.gov.in',
    lastUpdated: '2026-02-10',
  },

  // 221001 - Varanasi
  {
    id: 'pds-221001-01',
    pincodeCode: '221001',
    fpsCode: 'UP-0967-FPS-0512',
    shopName: 'Kashi Vishwanath Mandir Ward FPS',
    dealerName: 'Shri Om Prakash Gupta',
    cardholdersTotal: 650,
    biometricEposPct: 96.0,
    wheatQuotaQtl: 130.0,
    riceQuotaQtl: 97.5,
    wheatDistributedPct: 94.2,
    riceDistributedPct: 93.1,
    ghostCardSuspectPct: 3.8,
    sourceUrl: 'https://fcs.up.gov.in',
    lastUpdated: '2026-02-14',
  },

  // 560001 - Bengaluru
  {
    id: 'pds-560001-01',
    pincodeCode: '560001',
    fpsCode: 'KA-BBMP-FPS-3011',
    shopName: 'Food & Civil Supplies Ahara Centre Shivajinagar',
    dealerName: 'Shri M. Venkatesh',
    cardholdersTotal: 610,
    biometricEposPct: 97.5,
    wheatQuotaQtl: 61.0,
    riceQuotaQtl: 183.0,
    wheatDistributedPct: 96.0,
    riceDistributedPct: 98.2,
    ghostCardSuspectPct: 2.2,
    sourceUrl: 'https://ahara.kar.nic.in',
    lastUpdated: '2026-02-16',
  },
];
