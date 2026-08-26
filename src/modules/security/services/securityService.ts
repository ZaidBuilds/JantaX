import type { CitizenReport } from '../../reporting/types/citizenReport';

export type UserRole = 'CITIZEN' | 'MODERATOR' | 'ADMIN';

/**
 * XSS Prevention: Sanitizes input string by escaping HTML entities
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * PII & Moderation Data Sanitizer for Public Payloads
 * Strips reporter contact details and internal moderation scores unless user is MODERATOR or ADMIN.
 */
export function sanitizeReportForPublicView(report: CitizenReport, userRole: UserRole = 'CITIZEN'): CitizenReport {
  const isPrivileged = userRole === 'MODERATOR' || userRole === 'ADMIN';

  return {
    ...report,
    title: sanitizeInput(report.title),
    description: sanitizeInput(report.description),
    location: {
      ...report.location,
      landmark: sanitizeInput(report.location.landmark)
    },
    // PII Redaction
    reporterName: (report.isAnonymous || !isPrivileged) ? undefined : report.reporterName,
    reporterContact: (report.isAnonymous || !isPrivileged) ? '[REDACTED FOR PRIVACY]' : report.reporterContact,
    // Internal Moderation Isolation
    spamScore: isPrivileged ? report.spamScore : 0,
    abuseCount: isPrivileged ? report.abuseCount : 0
  };
}

/**
 * File Upload Security & Path Traversal Sanitization
 */
export function validateUploadFile(fileName: string, mimeType: string, sizeBytes: number): { valid: boolean; sanitizedFileName: string; error?: string } {
  // Path traversal prevention (e.g. "../../malicious.exe" -> "malicious.exe")
  const sanitizedFileName = fileName.replace(/^.*[\\\/]/, '').replace(/[^a-zA-Z0-9_.-]/g, '_');

  // Allowed MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
    return {
      valid: false,
      sanitizedFileName,
      error: `Invalid file type "${mimeType}". Only JPG, PNG, WEBP, and MP4 are permitted.`
    };
  }

  // Max 10MB file size limit
  const maxSizeBytes = 10 * 1024 * 1024;
  if (sizeBytes > maxSizeBytes) {
    return {
      valid: false,
      sanitizedFileName,
      error: 'File size exceeds 10MB security threshold.'
    };
  }

  return { valid: true, sanitizedFileName };
}

/**
 * Sliding Window Client-Side Rate Limiter
 */
const rateLimitStore: Record<string, number[]> = {};

export function checkRateLimit(key: string, maxAllowed: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = [];
  }

  // Remove timestamps outside window
  rateLimitStore[key] = rateLimitStore[key].filter(ts => now - ts < windowMs);

  if (rateLimitStore[key].length >= maxAllowed) {
    return false; // Rate limit exceeded
  }

  rateLimitStore[key].push(now);
  return true;
}
