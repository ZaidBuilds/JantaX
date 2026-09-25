// Unified Government Open Data Connector Runner for JantaX
// Coordinates periodic fetches from CPCB, India Post, DARPG CPGRAMS, PMGSY, UDISE+, and RERA

import { getAqiReadings } from './cpcbAqi';
import { fetchIndiaPostData } from './indiaPostConnector';
import { fetchCpgramsMonthlySummary } from './cpgramsMonthlyConnector';
import { fetchPmgsyPackagesForPin } from './pmgsyRoadConnector';
import { fetchUdiseSchoolsForPin } from './udiseSchoolConnector';
import { fetchReraProjectsForPin } from './reraProjectConnector';

export interface ConnectorSyncSummary {
  cpcbAqiStatus: 'OK' | 'ERROR' | 'SKIPPED';
  cpcbReadingsCount: number;
  cpgramsStatus: 'OK' | 'ERROR';
  cpgramsTotalGrievances: number;
  indiaPostSampleOk: boolean;
  pmgsyStatus: 'OK' | 'ERROR';
  pmgsyCount: number;
  udiseStatus: 'OK' | 'ERROR';
  udiseCount: number;
  reraStatus: 'OK' | 'ERROR';
  reraCount: number;
  syncedAt: string;
}

export async function runAllConnectors(samplePin: string = '250001'): Promise<ConnectorSyncSummary> {
  const summary: ConnectorSyncSummary = {
    cpcbAqiStatus: 'SKIPPED',
    cpcbReadingsCount: 0,
    cpgramsStatus: 'OK',
    cpgramsTotalGrievances: 0,
    indiaPostSampleOk: false,
    pmgsyStatus: 'OK',
    pmgsyCount: 0,
    udiseStatus: 'OK',
    udiseCount: 0,
    reraStatus: 'OK',
    reraCount: 0,
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

  // 3. India Post Lookup
  try {
    const postData = await fetchIndiaPostData(samplePin);
    summary.indiaPostSampleOk = postData !== null;
  } catch (err: any) {
    summary.indiaPostSampleOk = false;
  }

  // 4. PMGSY Rural Roads
  try {
    const pmgsy = await fetchPmgsyPackagesForPin(samplePin);
    summary.pmgsyStatus = 'OK';
    summary.pmgsyCount = pmgsy.length;
  } catch (err: any) {
    summary.pmgsyStatus = 'ERROR';
  }

  // 5. UDISE+ Schools Directory
  try {
    const udise = await fetchUdiseSchoolsForPin(samplePin);
    summary.udiseStatus = 'OK';
    summary.udiseCount = udise.length;
  } catch (err: any) {
    summary.udiseStatus = 'ERROR';
  }

  // 6. State RERA Registry
  try {
    const rera = await fetchReraProjectsForPin(samplePin);
    summary.reraStatus = 'OK';
    summary.reraCount = rera.length;
  } catch (err: any) {
    summary.reraStatus = 'ERROR';
  }

  return summary;
}

