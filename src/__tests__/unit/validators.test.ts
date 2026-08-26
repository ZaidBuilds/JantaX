import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeReportForPublicView, validateUploadFile, checkRateLimit } from '../../modules/security/services/securityService';
import type { CitizenReport } from '../../modules/reporting/types/citizenReport';

describe('Security & Privacy Validators', () => {
  it('should sanitize HTML script tags to prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("XSS")</script><b>Test</b>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });

  it('should redact PII for public view when role is CITIZEN', () => {
    const mockReport: CitizenReport = {
      id: 'rep-test-01',
      title: 'Road Defect',
      category: 'Road',
      description: 'Pothole on main road',
      location: { pinCode: '110001', landmark: 'Mayur Vihar', district: 'New Delhi', state: 'Delhi' },
      isAnonymous: false,
      reporterName: 'Suresh Kumar',
      reporterContact: 'suresh@example.com',
      evidence: [],
      moderationState: 'Approved & Published',
      spamScore: 10,
      abuseCount: 2,
      createdAt: '2026-08-25T00:00:00Z',
      upvotes: 5
    };

    const publicView = sanitizeReportForPublicView(mockReport, 'CITIZEN');
    expect(publicView.reporterContact).toBe('[REDACTED FOR PRIVACY]');
    expect(publicView.spamScore).toBe(0); // Isolated
    expect(publicView.abuseCount).toBe(0); // Isolated
  });

  it('should expose reporter contact to authorized ADMIN', () => {
    const mockReport: CitizenReport = {
      id: 'rep-test-01',
      title: 'Road Defect',
      category: 'Road',
      description: 'Pothole on main road',
      location: { pinCode: '110001', landmark: 'Mayur Vihar', district: 'New Delhi', state: 'Delhi' },
      isAnonymous: false,
      reporterName: 'Suresh Kumar',
      reporterContact: 'suresh@example.com',
      evidence: [],
      moderationState: 'Approved & Published',
      spamScore: 10,
      abuseCount: 2,
      createdAt: '2026-08-25T00:00:00Z',
      upvotes: 5
    };

    const adminView = sanitizeReportForPublicView(mockReport, 'ADMIN');
    expect(adminView.reporterContact).toBe('suresh@example.com');
    expect(adminView.spamScore).toBe(10);
    expect(adminView.abuseCount).toBe(2);
  });

  it('should reject invalid MIME types and sanitize filename path traversal', () => {
    const invalidFile = validateUploadFile('../../malicious_file.exe', 'application/x-msdownload', 1000);
    expect(invalidFile.valid).toBe(false);
    expect(invalidFile.sanitizedFileName).toBe('malicious_file.exe');

    const validFile = validateUploadFile('pothole_evidence.jpg', 'image/jpeg', 2000000);
    expect(validFile.valid).toBe(true);
    expect(validFile.sanitizedFileName).toBe('pothole_evidence.jpg');
  });

  it('should enforce sliding-window rate limits', () => {
    const key = 'test_ip_127.0.0.1';
    expect(checkRateLimit(key, 2, 60000)).toBe(true);
    expect(checkRateLimit(key, 2, 60000)).toBe(true);
    expect(checkRateLimit(key, 2, 60000)).toBe(false); // 3rd request blocked
  });
});
