import type { SourceConnector } from './connector';
import { runSyncJob } from './syncEngine';

const SCHEDULE_CRON: Record<string,string> = {
  daily: '0 2 * * *',      // 02:00 IST daily
  weekly: '0 2 * * 1',     // Monday 02:00
  monthly: '0 2 1 * *',    // 1st 02:00
  quarterly: '0 2 1 */3 *',// quarterly
  annual: '0 2 1 1 *',     // Jan 1 02:00
  event: '', // event-driven, no cron
};

export class SyncScheduler {
  private connectors = new Map<string, SourceConnector>();
  private timers = new Map<string, NodeJS.Timeout>();

  register(connector: SourceConnector) {
    this.connectors.set(connector.sourceId, connector);
    const cron = SCHEDULE_CRON[connector.schedule];
    if (!cron) {
      console.log(`[scheduler] ${connector.sourceId} is event-driven, not scheduled`);
      return;
    }
    console.log(`[scheduler] registered ${connector.sourceId} → ${connector.schedule} (${cron})`);
    // In production use node-cron: import cron from 'node-cron'; cron.schedule(cron, ()=> this.run(connector.sourceId), { timezone: 'Asia/Kolkata' })
    // For PoC without extra dep, use setInterval for daily demo (every 24h) or immediate run in dev
    if (process.env.NODE_ENV === 'development') {
      // Run once after 15s in dev for demo observability
      const t = setTimeout(()=> this.run(connector.sourceId), 15000);
      this.timers.set(connector.sourceId, t);
    }
  }

  async run(sourceId: string) {
    const c = this.connectors.get(sourceId);
    if (!c) throw new Error(`Unknown source ${sourceId}`);
    console.log(`[scheduler] run ${sourceId} start`);
    const obs = await runSyncJob(c);
    console.log(`[scheduler] run ${sourceId} done`, obs);
    return obs;
  }

  async runAll() {
    const results = [];
    for (const id of this.connectors.keys()) {
      results.push(await this.run(id));
    }
    return results;
  }

  stopAll() {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }
}

export const scheduler = new SyncScheduler();
