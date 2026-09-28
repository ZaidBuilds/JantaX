import type { SourceConnector } from './connector';
import { runSyncJob } from './syncEngine';

const SCHEDULE_CRON: Record<string, string> = {
  daily: '0 2 * * *', // 02:00 IST daily
  weekly: '0 2 * * 1', // Monday 02:00
  monthly: '0 2 1 * *', // 1st 02:00
  quarterly: '0 2 1 */3 *', // quarterly
  annual: '0 2 1 1 *', // Jan 1 02:00
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

    // In development or test, don't flood background timers, but keep them accessible
    if (process.env.NODE_ENV === 'development') {
      const t = setTimeout(() => {
        this.run(connector.sourceId).catch((err) =>
          console.warn(`[scheduler] background sync warning for ${connector.sourceId}:`, err?.message)
        );
      }, 15000);
      this.timers.set(connector.sourceId, t);
    }
  }

  get(sourceId: string): SourceConnector | undefined {
    if (this.connectors.has(sourceId)) return this.connectors.get(sourceId);
    const aliasMap: Record<string, string> = {
      'cpcb-aqi': 'src_cpcb_aqi',
      'darpg-cpgrams': 'src_darpg_202408',
      'pmgsy-roads': 'src_mord_pmgsy',
      'udise-plus': 'src_udise_plus',
      'state-rera': 'src_rera_national',
      'india-post': 'src_indiapost_live',
    };
    const mapped = aliasMap[sourceId];
    return mapped ? this.connectors.get(mapped) : undefined;
  }

  async run(sourceId: string) {
    const c = this.get(sourceId);
    if (!c) throw new Error(`Unknown source ${sourceId}`);
    console.log(`[scheduler] run ${c.sourceId} start`);
    try {
      const obs = await runSyncJob(c);
      console.log(`[scheduler] run ${c.sourceId} done`, obs);
      return obs;
    } catch (err: any) {
      console.error(`[scheduler] run ${c.sourceId} error:`, err?.message || err);
      throw err;
    }
  }

  async runAll() {
    const results = [];
    for (const id of this.connectors.keys()) {
      try {
        results.push(await this.run(id));
      } catch (err) {
        console.warn(`[scheduler] runAll warning for ${id}:`, (err as any)?.message);
      }
    }
    return results;
  }

  stopAll() {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }
}

export const scheduler = new SyncScheduler();
