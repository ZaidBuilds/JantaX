// UDISE+ school connector — DISABLED (returns no rows).
//
// UDISE+ (udiseplus.gov.in) has no public API for school-level records, and
// this payload needs teacher, toilet and electricity fields that no open API
// publishes per school. The old version generated template schools for any
// PIN, which is fabricated data, so it now returns [].
//
// Real school records for any PIN: server/src/live/schools.ts → /api/live/:pin/school
// (Jal Jeevan Mission school registry, ~9.6 lakh schools, updated daily).

export interface UdiseSchoolPayload {
  udiseCode: string;
  name: string;
  nameHi: string;
  category: string;
  management: string;
  state: string;
  district: string;
  totalStudents: number;
  totalTeachers: number;
  ptr: number; // Pupil-to-Teacher Ratio
  hasSeparateGirlsToilet: boolean;
  hasElectricity: boolean;
  hasFunctionalTapWater: boolean;
  cagObservationRef: string;
  source: string;
  sourceUrl: string;
  fetchedAt: string;
}

export async function fetchUdiseSchoolsForPin(_pinCode: string): Promise<UdiseSchoolPayload[]> {
  return [];
}
