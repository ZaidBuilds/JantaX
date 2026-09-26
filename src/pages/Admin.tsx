import { useEffect, useState } from 'react';
import { Lock, RefreshCw, ShieldCheck, Inbox } from 'lucide-react';
import { apiUrl } from '../core/services/api';
import { checkCurrentUserPermission } from '../modules/security/services/rbacService';
import { Badge, EmptyState, PageHeader, useToast } from '../ui';

interface QueueItem { id: string; title: string; pincodeCode: string; status: string }
interface SyncSource { sourceId: string; sourceName: string; status: string; lastSuccessfulSync?: string; stale?: boolean }

function authHeaders(): Record<string, string> {
  const t = localStorage.getItem('jantax_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function AdminPage() {
  const toast = useToast();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [pending, setPending] = useState(0);
  const [sources, setSources] = useState<SyncSource[]>([]);
  const [pin, setPin] = useState('110001');
  const isAdmin = checkCurrentUserPermission('ADMIN_ACCESS');

  useEffect(() => {
    if (!isAdmin) return;
    fetch(apiUrl('/api/moderation'), { headers: authHeaders() }).then((r) => r.json()).then((j) => setQueue(j.queue || [])).catch(() => {});
    fetch(apiUrl('/api/reports/pending-count')).then((r) => r.json()).then((j) => setPending(j.count || 0)).catch(() => {});
    fetch(apiUrl('/api/admin/sync/status'), { headers: authHeaders() }).then((r) => r.json()).then((j) => j.sources && setSources(j.sources)).catch(() => {});
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="page page-narrow">
        <PageHeader crumbs={[{ label: 'Admin' }]} title="Data operations" />
        <div className="card">
          <EmptyState icon={Lock} title="Administrators only" text="This page needs an admin sign-in. If you run a JantaX instance, sign in with an administrator token to continue." />
        </div>
      </div>
    );
  }

  const review = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const res = await fetch(apiUrl(`/api/reports/${id}/review`), { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status }) }).catch(() => null);
    if (res?.ok) {
      setQueue((q) => q.filter((x) => x.id !== id));
      toast(status === 'APPROVED' ? 'Report approved' : 'Report rejected');
    } else toast('Could not update the report');
  };

  const createPin = async () => {
    const res = await fetch(apiUrl(`/api/admin/pincode/${pin}?state=Delhi&district=New%20Delhi`), { headers: authHeaders() }).catch(() => null);
    toast(res?.ok ? `PIN ${pin} created` : 'Could not create the PIN');
  };

  const sync = async (id: string) => {
    const res = await fetch(apiUrl(`/api/admin/sync/${id}`), { method: 'POST', headers: authHeaders() }).catch(() => null);
    toast(res?.ok ? `Sync started for ${id}` : 'Sync request failed');
  };

  return (
    <div className="page">
      <PageHeader crumbs={[{ label: 'Admin' }]} title="Data operations" lede="Moderation, PIN management and source sync for this JantaX instance." />
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <section className="card">
          <div className="card-head">
            <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Moderation queue</h2>
            <Badge tone={pending ? 'warn' : 'good'}>{pending} pending</Badge>
          </div>
          {queue.length === 0 ? (
            <EmptyState icon={Inbox} title="Nothing to review" text="New citizen reports appear here before they are published." />
          ) : (
            <div className="list">
              {queue.map((r) => (
                <div key={r.id} className="list-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="strong truncate">{r.title}</div>
                    <div className="tiny muted">PIN {r.pincodeCode} · {r.status}</div>
                  </div>
                  <button type="button" className="btn btn-soft btn-sm" onClick={() => review(r.id, 'APPROVED')}>Approve</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => review(r.id, 'REJECTED')}>Reject</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="stack">
          <section className="card card-pad stack-sm">
            <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Create a PIN record</h2>
            <div className="cluster">
              <input className="input num" style={{ width: 140 }} inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="PIN code" />
              <button type="button" className="btn btn-primary" onClick={createPin}>Create</button>
            </div>
            <p className="hint">State and district are required. Unknown PINs are no longer auto-created.</p>
          </section>

          <section className="card">
            <div className="card-head">
              <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Source sync</h2>
              <ShieldCheck size={16} className="muted" aria-hidden="true" />
            </div>
            {sources.length === 0 ? (
              <p className="small muted card-body">No sync status yet. The nightly job runs at 02:00 IST.</p>
            ) : (
              <div className="list">
                {sources.map((s) => (
                  <div key={s.sourceId} className="list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="strong truncate">{s.sourceName}</div>
                      <div className="tiny muted">
                        {s.status} · last success {s.lastSuccessfulSync ? new Date(s.lastSuccessfulSync).toLocaleDateString('en-IN') : 'never'}
                      </div>
                    </div>
                    {s.stale && <Badge tone="warn">Stale</Badge>}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => sync(s.sourceId)}>
                      <RefreshCw size={13} aria-hidden="true" /> Sync
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
