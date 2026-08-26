import type { InternalAlert, DatasetSnapshot } from '../types/dataMonitoring';
import { MOCK_INTERNAL_ALERTS, MOCK_DATASET_SNAPSHOTS } from '../data/mockMonitoring';

const ALERTS_KEY = 'jantax_monitoring_alerts_v1';
const SNAPSHOTS_KEY = 'jantax_dataset_snapshots_v1';

export function getStoredAlerts(): InternalAlert[] {
  if (typeof window === 'undefined') return MOCK_INTERNAL_ALERTS;
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(MOCK_INTERNAL_ALERTS));
      return MOCK_INTERNAL_ALERTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(ALERTS_KEY, JSON.stringify(MOCK_INTERNAL_ALERTS));
    return MOCK_INTERNAL_ALERTS;
  } catch {
    return MOCK_INTERNAL_ALERTS;
  }
}

export function getStoredSnapshots(): DatasetSnapshot[] {
  if (typeof window === 'undefined') return MOCK_DATASET_SNAPSHOTS;
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    if (!raw) {
      localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(MOCK_DATASET_SNAPSHOTS));
      return MOCK_DATASET_SNAPSHOTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(MOCK_DATASET_SNAPSHOTS));
    return MOCK_DATASET_SNAPSHOTS;
  } catch {
    return MOCK_DATASET_SNAPSHOTS;
  }
}

export function approveAlert(alertId: string): InternalAlert[] {
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => {
    if (a.id === alertId) {
      return {
        ...a,
        status: 'Approved & Published' as const,
        validation: {
          ...a.validation,
          requiresHumanReview: false
        }
      };
    }
    return a;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
}

export function quarantineAlert(alertId: string, reason: string): InternalAlert[] {
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => {
    if (a.id === alertId) {
      return {
        ...a,
        status: 'Quarantined' as const,
        validation: {
          ...a.validation,
          requiresHumanReview: true,
          quarantineReason: reason
        }
      };
    }
    return a;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
}

export function rollbackSnapshot(snapshotId: string): { snapshots: DatasetSnapshot[]; alerts: InternalAlert[] } {
  const snapshots = getStoredSnapshots();
  const alerts = getStoredAlerts();

  const targetSnapshot = snapshots.find((s) => s.id === snapshotId);

  const updatedSnapshots = snapshots.map((s) => ({
    ...s,
    isCurrentActive: s.id === snapshotId
  }));

  const updatedAlerts = alerts.map((a) => {
    if (a.status === 'Quarantined') {
      return {
        ...a,
        status: 'Rolled Back' as const
      };
    }
    return a;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updatedSnapshots));
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
    } catch {}
  }

  return { snapshots: updatedSnapshots, alerts: updatedAlerts };
}
