/**
 * JantaX ingestion bootstrap.
 * Registers source connectors with the scheduler. Real connectors are added
 * here as they land; the UDISE mock is a pipeline PoC and writes `isSample`
 * rows, so it is opt-in (ENABLE_MOCK_CONNECTORS=true) and never runs in prod.
 */
import { scheduler } from './scheduler';
import { createUdiseMockConnector } from './connectors/udiseMockConnector';
import { createCpcbLiveConnector } from './connectors/cpcbLiveConnector';
import { createCpgramsFeedConnector } from './connectors/cpgramsFeedConnector';

export function startIngestionCron() {
  const mocksEnabled =
    process.env.NODE_ENV !== 'production' && process.env.ENABLE_MOCK_CONNECTORS === 'true';

  if (mocksEnabled) {
    scheduler.register(createUdiseMockConnector());
    console.log('[cron] Mock UDISE connector registered (writes isSample rows).');
  }

  // Register real and scheduled connectors
  scheduler.register(createCpcbLiveConnector());
  scheduler.register(createCpgramsFeedConnector());
  console.log('[cron] CPCB Live AQI and DARPG CPGRAMS connectors registered.');

  return { scheduler };
}
