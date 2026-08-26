export type ReportCategory = 
  | 'School' 
  | 'Road' 
  | 'Healthcare' 
  | 'Water' 
  | 'Sanitation' 
  | 'Electricity' 
  | 'Public works' 
  | 'Other';

export type ModerationState = 
  | 'Pending Review' 
  | 'Approved & Published' 
  | 'Flagged for Review' 
  | 'Rejected';

export interface EvidenceItem {
  id: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  moderationStatus: 'Approved' | 'Pending Moderation' | 'Flagged';
}

export interface CitizenReport {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  location: {
    pinCode: string;
    landmark: string;
    district: string;
    state: string;
    lat?: number;
    lng?: number;
  };
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  evidence: EvidenceItem[];
  moderationState: ModerationState;
  spamScore: number; // 0 (Clean) - 100 (Spam)
  duplicateRefId?: string;
  abuseCount: number;
  createdAt: string;
  upvotes: number;
}

export interface AbuseReport {
  id: string;
  reportId: string;
  reporterType: 'Citizen' | 'Government Official' | 'Auditor';
  reason: string;
  details: string;
  timestamp: string;
}
