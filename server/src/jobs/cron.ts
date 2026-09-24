/**
 * JantaX ingestion bootstrap.
 * Registers source connectors with the scheduler. Real connectors are added
 * here as they land; the UDISE mock is a pipeline PoC and writes `isSample`
 * rows, so it is opt-in (ENABLE_MOCK_CONNECTORS=true) and never runs in prod.
 */
import { scheduler } from './scheduler';
import { createUdiseMockConnector } from './connectors/udiseMockConnector';

export function startIngestionCron() {
  const mocksEnabled =
    process.env.NODE_ENV !== 'production' && process.env.ENABLE_MOCK_CONNECTORS === 'true';

  if (mocksEnabled) {
    scheduler.register(createUdiseMockConnector());
    console.log('[cron] Mock UDISE connector registered (writes isSample rows).');
  } else {
    console.log('[cron] No connectors registered. Set ENABLE_MOCK_CONNECTORS=true to run the UDISE mock pipeline.');
  }

  return { scheduler };
}
