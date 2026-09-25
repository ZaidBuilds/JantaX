// Unified Government Open Data Connector Runner for JantaX
// Coordinates periodic fetches from CPCB, India Post, and DARPG CPGRAMS

import { getAqiReadings } from './cpcbAqi';
import { fetchIndiaPostData } from './indiaPostConnector';
import { fetchCpgramsMonthlySummary } from './cpgramsMonthlyConnector';

export interface ConnectorSyncSummary {
  cpcbAqiStatus: 'OK' | 'ERROR' | 'SKIPPED';
  cpcbReadingsCount: number;
  cpgramsStatus: 'OK' | 'ERROR';
  cpgramsTotalGrievances: number;
  indiaPostSampleOk: boolean;
  syncedAt: string;
}

export async function runAllConnectors(): Promise<ConnectorSyncSummary> {
  const summary: ConnectorSyncSummary = {
    cpcbAqiStatus: 'SKIPPED',
    cpcbReadingsCount: 0,
    cpgramsStatus: 'OK',
    cpgramsTotalGrievances: 0,
    indiaPostSampleOk: false,
    syncedAt: new Date().toISOString(),
  };

  // 1. CPCB Real-time AQI
  try {
    const readings = await getAqiReadings(100);
    summary.cpcbAqiStatus = 'OK';
    summary.cpcbReadingsCount = readings.length;
  } catch (err: any) {
    summary.cpcbAqiStatus = 'ERROR';
  }

  // 2. DARPG CPGRAMS Monthly
  try {
    const cpgrams = await fetchCpgramsMonthlySummary();
    summary.cpgramsStatus = 'OK';
    summary.cpgramsTotalGrievances = cpgrams.totalGrievancesNational;
  } catch (err: any) {
    summary.cpgramsStatus = 'ERROR';
  }

  // 3. India Post Smoke Test (PIN 250001)
  try {
    const postData = await fetchIndiaPostData('250001');
    summary.indiaPostSampleOk = postData !== null;
  } catch (err: any) {
    summary.indiaPostSampleOk = false;
  }

  return summary;
}
