/**
 * Registers every real-data connector with the scheduler. Runs are scheduled only when
 * SYNC_SCHEDULE=on (or NODE_ENV=production) and the connector's config is complete; otherwise
 * connectors are still available for manual runs from the admin API or `npm run data -- sync`.
 */
import { scheduler } from './scheduler';
import { CONNECTORS } from './registry';

export function startIngestionCron() {
  const schedule = process.env.SYNC_SCHEDULE ? process.env.SYNC_SCHEDULE === 'on' : process.env.NODE_ENV === 'production';
  for (const make of Object.values(CONNECTORS)) scheduler.register(make(), { schedule });
  console.log(`[cron] ${Object.keys(CONNECTORS).length} connectors registered, scheduling ${schedule ? 'on' : 'off (set SYNC_SCHEDULE=on)'}`);
  return { scheduler };
}
