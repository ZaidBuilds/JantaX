import type { SchoolRecord, MetricState } from './types';

type Loose = Partial<SchoolRecord> & {
  hasToilet?: boolean;
  hasElectricity?: boolean;
  hasDrinkingWater?: boolean;
  officialTeacherCount?: number;
  teachersSanctioned?: number;
  lastCheckIn?: string | null;
};

const yn = (v: boolean | undefined): MetricState => (v === undefined ? 'no_data' : v ? 'yes' : 'no');

/**
 * API and offline records carry flat facility flags; the school screens expect
 * the richer SchoolRecord shape. Fill the gaps so profiles never crash.
 */
export function normalizeSchool(raw: unknown): SchoolRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Loose;
  const metrics = r.metrics ?? {
    teacherPresent: r.officialTeacherCount && r.teachersSanctioned ? (r.officialTeacherCount >= r.teachersSanctioned ? 'yes' : 'no') : 'no_data',
    toiletUsable: yn(r.hasToilet),
    mdmServed: 'not_sure',
    learningMaterials: 'not_sure',
    classroomReady: yn(r.hasElectricity),
  };
  return {
    ...(r as SchoolRecord),
    metrics,
    confidenceLevel: r.confidenceLevel ?? 'medium',
    totalCheckIns: r.totalCheckIns ?? 0,
    lastCheckInDate: r.lastCheckInDate ?? r.lastCheckIn ?? '',
    reportCount: r.reportCount ?? 0,
    evidence: r.evidence ?? [],
  } as SchoolRecord;
}
