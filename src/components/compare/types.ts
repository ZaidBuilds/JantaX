export type EntityType = 'school' | 'contractor' | 'builder' | 'project' | 'location' | 'hospital' | 'rera';

export interface ComparisonEntity {
  id: string;
  type: EntityType;
  name: string;
  subtitle?: string;
  location?: {
    pincode?: string;
    district?: string;
    state?: string;
  };
}

export interface ComparisonMetric {
  id: string;
  label: string;
  labelHi?: string;
  value: string | number | null;
  unit?: string;
  source?: {
    name: string;
    type: 'A' | 'B' | 'C';
  };
  freshness?: Date | string | null;
  methodology?: string;
  score?: number;
  rank?: number;
  status?: 'available' | 'unavailable' | 'partial';
  color?: string;
  badge?: string;
}

export interface ComparisonRow {
  id: string;
  category: string;
  categoryHi?: string;
  icon?: string;
  metrics: ComparisonMetric[];
}

export interface ComparisonData {
  entities: ComparisonEntity[];
  rows: ComparisonRow[];
}

export interface CompareSelection {
  entity: ComparisonEntity;
  metrics: Record<string, ComparisonMetric>;
}

export function isCompatible(a: EntityType, b: EntityType): boolean {
  const compatibleGroups: Record<EntityType, EntityType[]> = {
    school: ['school'],
    contractor: ['contractor', 'builder'],
    builder: ['contractor', 'builder'],
    project: ['project'],
    location: ['location'],
    hospital: ['hospital'],
    rera: ['rera'],
  };
  return compatibleGroups[a]?.includes(b) ?? false;
}

export function getEntityTypeLabel(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    school: 'School',
    contractor: 'Contractor',
    builder: 'Builder',
    project: 'Project',
    location: 'Location',
    hospital: 'Healthcare',
    rera: 'RERA Project',
  };
  return labels[type] || type;
}

export function getEntityTypeIcon(type: EntityType): string {
  const icons: Record<EntityType, string> = {
    school: 'graduation-cap',
    contractor: 'hard-hat',
    builder: 'building',
    project: 'construction',
    location: 'map-pin',
    hospital: 'hospital',
    rera: 'home',
  };
  return icons[type] || 'circle';
}

export function getCompatibleTypes(type: EntityType): EntityType[] {
  const compatibleGroups: Record<EntityType, EntityType[]> = {
    school: ['school'],
    contractor: ['contractor', 'builder'],
    builder: ['contractor', 'builder'],
    project: ['project'],
    location: ['location'],
    hospital: ['hospital'],
    rera: ['rera'],
  };
  return compatibleGroups[type] || [type];
}
