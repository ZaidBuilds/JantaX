// Shared types for the national accountability map. Any JantaX module can feed
// this shape — a school, hospital, project, contractor, RERA site — and it
// renders as a status-coloured pin on one India map.

export type PinStatus = 'flagged' | 'progress' | 'resolved' | 'neutral';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  status: PinStatus;
  /** Module id this record belongs to, e.g. 'school', 'hospital'. */
  module: string;
  title: string;
  subtitle?: string;
  /** Optional route to open on click. */
  href?: string;
}

export const STATUS_COLORS: Record<PinStatus, string> = {
  flagged: '#ef4444', // red — problem reported, unresolved
  progress: '#f59e0b', // amber — in progress
  resolved: '#10b981', // green — fixed / verified
  neutral: '#6366f1', // indigo — informational, no status
};

export const STATUS_LABELS: Record<PinStatus, string> = {
  flagged: 'Flagged',
  progress: 'In progress',
  resolved: 'Resolved',
  neutral: 'Tracked',
};
