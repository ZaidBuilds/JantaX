/**
 * JanCheck Auto-Update Engine — DEPRECATED fake
 * Previously simulated live sync via hashSeed. Now gated behind DEV only.
 * Production uses server/src/jobs/cron.ts (node-cron nightly 02:00 IST) → Prisma.
 * This file kept for offline mock fallback only when backend unreachable.
 */

/**
 * Gets a deterministic pseudo-random seed based on the current date string.
 * This ensures that within the same day, the seed remains constant, but shifts daily.
 */
function getDaySeed(): number {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Deterministically progresses project metrics based on the current date.
 * Simulates live progress updates on physical/financial logs.
 */
export function getUpdatedProjects<T extends { id: string; sanctionedCostLakhs?: number; status: string; statusHi: string; physicalProgress?: number }>(
  baseProjects: T[]
): T[] {
  // Gate fake behind DEV — in PROD, real cron provides updates; fallback only offline
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) return baseProjects;
  const seed = getDaySeed();
  return baseProjects.map(proj => {
    // If project is completed, leave it
    if (proj.status === 'completed') return proj;

    // Otherwise, simulate a daily progression rate
    const progressionDelta = (seed % 5) + 1; // 1% to 5% progress shifts
    const currentProgress = proj.physicalProgress !== undefined ? proj.physicalProgress : 45;
    const newProgress = Math.min(100, currentProgress + (progressionDelta % 10));

    const isNowCompleted = newProgress === 100;

    return {
      ...proj,
      physicalProgress: newProgress,
      status: isNowCompleted ? 'completed' : proj.status,
      statusHi: isNowCompleted ? 'पूर्ण (Completed)' : proj.statusHi,
    };
  });
}

/**
 * Simulates live daily citizen grievance resolution updates in CPGRAMS Shame Index.
 * Dynamically shifts backlog counts and averages slightly every day.
 */
export function getUpdatedGrievances<T extends { id: string; totalGrievances: number; resolvedCount: number; pendingCount: number; backlogOver30Days: number }>(
  baseRecords: T[]
): T[] {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) return baseRecords;
  const seed = getDaySeed();
  return baseRecords.map((rec, idx) => {
    // Deterministic daily adjustments
    const changeDelta = ((seed + idx) % 15) - 7; // -7 to +7 change in caseload
    const backlogAdjustment = ((seed * idx) % 5) - 2;

    const newTotal = Math.max(100, rec.totalGrievances + changeDelta);
    const newPending = Math.max(10, rec.pendingCount + changeDelta);
    const newBacklog = Math.max(5, rec.backlogOver30Days + backlogAdjustment);

    return {
      ...rec,
      totalGrievances: newTotal,
      pendingCount: newPending,
      backlogOver30Days: newBacklog,
      resolvedCount: Math.max(90, newTotal - newPending),
    };
  });
}
