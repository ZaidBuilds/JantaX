import type { ModuleRecord } from '../../core/types';

/**
 * School-specific extensions to the base ModuleRecord.
 */
export interface SchoolRecord extends ModuleRecord {
  moduleId: 'school';
  
  // School Identity
  udiseCode: string;           // UDISE+ code
  schoolLevel: 'Primary' | 'Upper Primary' | 'Secondary' | 'Higher Secondary';
  managementType: 'Government' | 'Aided' | 'Private';
  
  // 5 Core Metrics (Yes / No / Not Sure)
  metrics: {
    teacherPresent: MetricState;
    toiletUsable: MetricState;
    mdmServed: MetricState;
    learningMaterials: MetricState;
    classroomReady: MetricState;
  };
  
  // Aggregated score
  groundTruthScore: number;    // 0-100, computed from citizen check-ins
  confidenceLevel: 'low' | 'medium' | 'high';
  totalCheckIns: number;
  lastCheckInDate: string;
  
  // Official vs Reality comparison
  officialStudentCount: number;
  officialTeacherCount: number;
  observedStudentBand: string;  // "26-50%", "51-75%", etc.
}

export type MetricState = 'yes' | 'no' | 'not_sure' | 'no_data';

export interface SchoolCheckIn {
  id: string;
  schoolId: string;
  date: string;
  teacherPresent: MetricState;
  toiletUsable: MetricState;
  mdmServed: MetricState;
  learningMaterials: MetricState;
  classroomReady: MetricState;
  attendanceBand?: string;
  photoUrl?: string;
  deviceHash: string;
  timestamp: string;
}
