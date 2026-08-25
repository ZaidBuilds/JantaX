/**
 * Evidence — Anonymous photo/document drops from citizens.
 * Never stores PII. submittedBy is a device hash, not a name.
 */
export interface Evidence {
  id: string;
  type: 'photo' | 'document' | 'screenshot' | 'video';
  url: string;               // blob URL or CDN path
  caption: string;
  captionHindi: string;
  timestamp: string;          // ISO 8601
  submittedBy: string;        // Anonymous device hash — never PII
  verificationStatus: 'pending' | 'verified' | 'disputed' | 'rejected';
}
