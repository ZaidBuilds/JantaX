import type { UserRole } from './securityService';

export type Permission = 
  | 'ADMIN_ACCESS' 
  | 'REVIEW_MODERATION' 
  | 'TRIGGER_SYNC' 
  | 'ROLLBACK_SNAPSHOT' 
  | 'VIEW_UNREDACTED_PII';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CITIZEN: [],
  MODERATOR: ['REVIEW_MODERATION', 'VIEW_UNREDACTED_PII'],
  ADMIN: ['ADMIN_ACCESS', 'REVIEW_MODERATION', 'TRIGGER_SYNC', 'ROLLBACK_SNAPSHOT', 'VIEW_UNREDACTED_PII']
};

export function getCurrentUserRole(): UserRole {
  if (typeof window === 'undefined') return 'CITIZEN';
  try {
    const token = localStorage.getItem('jantax_token');
    if (!token) return 'CITIZEN';
    if (token.includes('admin') || token.includes('ADMIN')) return 'ADMIN';
    if (token.includes('mod') || token.includes('MODERATOR')) return 'MODERATOR';
    return 'CITIZEN';
  } catch {
    return 'CITIZEN';
  }
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  return allowedPermissions.includes(permission);
}

export function checkCurrentUserPermission(permission: Permission): boolean {
  const role = getCurrentUserRole();
  return hasPermission(role, permission);
}
