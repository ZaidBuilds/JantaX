export { SchoolDashboard } from './components/SchoolDashboard';
export { SchoolDetail } from './components/SchoolDetail';
export type { SchoolRecord, SchoolCheckIn } from './types';

export const SCHOOL_MODULE = {
  id: 'school' as const,
  nameHindi: 'स्कूल ठीक करो',
  nameEnglish: 'School Scorecard',
  icon: '🏫',
};
