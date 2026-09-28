/**
 * JantaX Ingestion Bootstrap & Connector Fleet Registry.
 * Registers all 6 authentic Indian government public data connectors under GODL-India:
 * 1. CPCB CAAQMS Real-Time Air Quality (Central Pollution Control Board)
 * 2. DARPG CPGRAMS Monthly Grievance Reports (Dept of Administrative Reforms & Public Grievances)
 * 3. MoRD PMGSY OMMAS Rural Roads & DLP Package Registry (Ministry of Rural Development)
 * 4. UDISE+ School Directory & Infrastructure (Ministry of Education)
 * 5. State Real Estate Regulatory Authorities (State RERAs)
 * 6. India Post Pin Code Directory & Postal Administrative Resolver (Department of Posts)
 */
import { scheduler } from './scheduler';
import { createCpcbLiveConnector } from './connectors/cpcbLiveConnector';
import { createCpgramsFeedConnector } from './connectors/cpgramsFeedConnector';
import { createPmgsyLiveConnector } from './connectors/pmgsyLiveConnector';
import { createUdiseLiveConnector } from './connectors/udiseLiveConnector';
import { createReraLiveConnector } from './connectors/reraLiveConnector';
import { createIndiaPostLiveConnector } from './connectors/indiaPostLiveConnector';
import { createUdiseMockConnector } from './connectors/udiseMockConnector';

export function startIngestionCron() {
  const mocksEnabled =
    process.env.NODE_ENV !== 'production' && process.env.ENABLE_MOCK_CONNECTORS === 'true';

  if (mocksEnabled) {
    scheduler.register(createUdiseMockConnector());
    console.log('[cron] Mock UDISE connector registered (writes isSample rows).');
  }

  // Register all 6 authentic government connectors
  scheduler.register(createCpcbLiveConnector());
  scheduler.register(createCpgramsFeedConnector());
  scheduler.register(createPmgsyLiveConnector());
  scheduler.register(createUdiseLiveConnector());
  scheduler.register(createReraLiveConnector());
  scheduler.register(createIndiaPostLiveConnector());

  console.log('[cron] All 6 authentic GODL-India government connectors successfully registered in scheduler:');
  console.log('       • CPCB CAAQMS (Hourly/Daily)');
  console.log('       • DARPG CPGRAMS (Monthly)');
  console.log('       • MoRD PMGSY OMMAS (Quarterly)');
  console.log('       • UDISE+ Schools (Annual)');
  console.log('       • State RERA Registry (Monthly)');
  console.log('       • India Post Directory (Monthly)');

  return { scheduler };
}
