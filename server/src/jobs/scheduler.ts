import type { Schedule, SourceConnector, SyncObservability } from './connector';
import { runSyncJob, type SyncOptions } from './syncEngine';

const IST_OFFSET_MIN = 330; // India has no daylight saving, so IST is always UTC+5:30.

/**
 * Next run time for a schedule, in IST: hourly at :10, everything else at 02:00
 * (daily; Mondays; the 1st of the month; 1 Jan/Apr/Jul/Oct; 1 January).
 */
export function nextRunAt(schedule: Schedule, now: Date = new Date()): Date | null {
  if (schedule === 'event') return null;
  // Work in a "wall clock" Date whose UTC fields read as IST.
  const ist = new Date(now.getTime() + IST_OFFSET_MIN * 60_000);
  const at = new Date(ist);
  at.setUTCSeconds(0, 0);

  if (schedule === 'hourly') {
    at.setUTCMinutes(10);
    if (at <= ist) at.setUTCHours(at.getUTCHours() + 1);
  } else {
    at.setUTCHours(2, 0);
    const bump = () => {
      switch (schedule) {
        case 'daily':
          at.setUTCDate(at.getUTCDate() + 1);
          break;
        case 'weekly':
          at.setUTCDate(at.getUTCDate() + 1);
          break;
        case 'monthly':
          at.setUTCDate(1);
          at.setUTCMonth(at.getUTCMonth() + 1);
          break;
        case 'quarterly':
          at.setUTCDate(1);
          at.setUTCMonth(Math.floor(at.getUTCMonth() / 3) * 3 + 3);
          break;
        case 'annual':
          at.setUTCDate(1);
          at.setUTCMonth(0);
          at.setUTCFullYear(at.getUTCFullYear() + 1);
          break;
      }
    };
    const aligned = () =>
      schedule === 'daily' ||
      (schedule === 'weekly' && at.getUTCDay() === 1) ||
      (schedule === 'monthly' && at.getUTCDate() === 1) ||
      (schedule === 'quarterly' && at.getUTCDate() === 1 && at.getUTCMonth() % 3 === 0) ||
      (schedule === 'annual' && at.getUTCDate() === 1 && at.getUTCMonth() === 0);
    if (!aligned() || at <= ist) {
      bump();
      while (!aligned()) bump();
    }
  }
  return new Date(at.getTime() - IST_OFFSET_MIN * 60_000);
}

export class SyncScheduler {
  private connectors = new Map<string, SourceConnector>();
  private timers = new Map<string, NodeJS.Timeout>();
  private running = new Set<string>();

  register(connector: SourceConnector, opts: { schedule?: boolean } = {}) {
    this.connectors.set(connector.sourceId, connector);
    const missing = connector.missingConfig?.();
    if (!opts.schedule) return;
    if (missing) {
      console.log(`[scheduler] ${connector.sourceId} not scheduled: ${missing}`);
      return;
    }
    this.plan(connector.sourceId);
  }

  private plan(sourceId: string) {
    const c = this.connectors.get(sourceId);
    const at = c && nextRunAt(c.schedule);
    if (!at) return;
    // setTimeout overflows past ~24.8 days; re-plan in steps for monthly and longer schedules.
    const delay = Math.min(at.getTime() - Date.now(), 2 ** 31 - 1);
    console.log(`[scheduler] ${sourceId} (${c.schedule}) next run ${at.toISOString()}`);
    const t = setTimeout(async () => {
      if (Date.now() >= at.getTime() - 1000) await this.run(sourceId).catch((e) => console.error(`[scheduler] ${sourceId}`, e));
      this.plan(sourceId);
    }, Math.max(delay, 0));
    t.unref?.();
    this.timers.set(sourceId, t);
  }

  list() {
    return [...this.connectors.values()].map((c) => ({
      sourceId: c.sourceId,
      schedule: c.schedule,
      missingConfig: c.missingConfig?.() ?? null,
      nextRunAt: nextRunAt(c.schedule)?.toISOString() ?? null,
      running: this.running.has(c.sourceId),
    }));
  }

  async run(sourceId: string, options: SyncOptions = {}): Promise<SyncObservability> {
    const c = this.connectors.get(sourceId);
    if (!c) throw new Error(`Unknown source ${sourceId}`);
    if (this.running.has(sourceId)) throw new Error(`${sourceId} is already running`);
    this.running.add(sourceId);
    try {
      return await runSyncJob(c, options);
    } finally {
      this.running.delete(sourceId);
    }
  }

  stopAll() {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }
}

export const scheduler = new SyncScheduler();
