export interface AuditEvent {
  id: string;
  eventType: 'PII_ACCESS' | 'ADMIN_ACTION' | 'MODERATION_REVIEW' | 'SNAPSHOT_ROLLBACK' | 'RATE_LIMIT_EXCEEDED';
  actorRole: string;
  details: string;
  timestamp: string;
}

const AUDIT_LOG_KEY = 'jantax_security_audit_log_v1';

export function getSecurityAuditLogs(): AuditEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logSecurityEvent(eventType: AuditEvent['eventType'], actorRole: string, details: string): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getSecurityAuditLogs();
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      eventType,
      actorRole,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [newEvent, ...logs].slice(0, 100); // Keep last 100 audit events
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to log security audit event", e);
  }
}
