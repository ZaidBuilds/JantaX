export interface ReportItem {
  id: string;
  pincode: string;
  module: string;
  category?: string;
  title?: string;
  description: string;
  status?: string;
  createdAt?: string;
}

export type GovtStage = 'SUBMITTED' | 'ACKNOWLEDGED' | 'ACTION' | 'VERIFIED';

export const STAGE_ORDER: GovtStage[] = ['SUBMITTED', 'ACKNOWLEDGED', 'ACTION', 'VERIFIED'];

// Deterministic response lifecycle derived from report id hash (resilient mock when backend absent)
export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function deriveLifecycle(r: ReportItem): { stage: GovtStage; delayDays: number; originalKept: boolean } {
  const h = hashStr(r.id || r.description || 'x');
  const stageIdx = h % 4; // 0..3
  const stage = STAGE_ORDER[stageIdx];
  const delayDays = 3 + (h % 60); // 3..62 days
  return { stage, delayDays, originalKept: true };
}
