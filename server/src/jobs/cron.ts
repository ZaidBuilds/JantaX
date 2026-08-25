/**
 * JantaX Ingestion Cron — nightly 02:00 IST
 * Replaces fake autoUpdater.hashSeed. Real jobs: MoSPI, PMGSY, UDISE+ CSV, RERA scraper (proxy), HMIS, ePOS, DARPG, CPCB, SLDC
 * Uses node-cron (install: npm i node-cron) + bullmq (or pg_cron). This is a stub that logs and would call ingestors.
 */
import { scheduler } from './scheduler';
import { createUdiseMockConnector } from './connectors/udiseMockConnector';

export function startIngestionCron() {
  // Register PoC connector (UDISE mock CSV) — validates 12-step pipeline
  const udise = createUdiseMockConnector();
  scheduler.register(udise);

  // Future: add more connectors per source governance
  // scheduler.register(createReraConnector());
  // scheduler.register(createCpcbConnector());
  // scheduler.register(createDarpgConnector());

  console.log('[cron] JantaX ingestion engine ready — PoC UDISE mock registered (annual). Other sources pending.');
  console.log('[cron] Schedules: daily 0 2 * * *, weekly Mon, monthly 1st, quarterly, annual Jan1, event-driven. Fakes gated PROD.');

  return { scheduler };
}
