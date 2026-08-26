import React, { useEffect, useState } from 'react';
import { api } from '../core/services/api';
import { checkCurrentUserPermission } from '../modules/security/services/rbacService';

export function AdminPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [pin, setPin] = useState('110001');
  const [followCount, setFollowCount] = useState(0);
  const [syncSources, setSyncSources] = useState<any[]>([]);
  const isAdmin = checkCurrentUserPermission('ADMIN_ACCESS');

  useEffect(()=>{
    fetch('/api/moderation').then(r=>r.json()).then(j=>setQueue(j.queue||[])).catch(()=>{});
    fetch('/api/reports/pending-count').then(r=>r.json()).then(j=>setFollowCount(j.count||0)).catch(()=>{});
    const t=localStorage.getItem('jantax_token');
    fetch('/api/admin/sync/status', { headers: t?{Authorization:`Bearer ${t}`}:{} }).then(r=>r.json()).then(j=>{ if(j.sources) setSyncSources(j.sources); }).catch(()=>{});
  },[]);

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#b91c1c', fontWeight: 800 }}>Access Denied — Role Authorization Required</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          This page requires an authorized <strong>ADMIN</strong> Bearer token (<code>jantax_token</code>). You are currently browsing with <code>CITIZEN</code> role permissions.
        </p>
      </div>
    );
  }
  const createPin = async ()=>{
    const token = localStorage.getItem('jantax_token');
    if(!token) return alert('Login as ADMIN first (POST /api/auth/login)');
    const res = await fetch(`/api/admin/pincode/${pin}?state=Delhi&district=New%20Delhi`, { headers:{ Authorization:`Bearer ${token}` }});
    const j = await res.json();
    alert(JSON.stringify(j).slice(0,400));
  };
  return (
    <div style={{ maxWidth: 860, margin:'0 auto', padding:'2rem 1.25rem' }}>
      <h1 style={{ color:'#0f2d59' }}>Admin — Data Operations</h1>
      <p style={{ color:'#475569', fontSize:'0.9rem' }}>Moderation queue · PIN ops (ADMIN only) · Follow analytics · Last synced: 24 Aug 2026</p>
      <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1rem', marginTop:'1rem' }}>
        <h3>Moderation Queue ({queue.length})</h3>
        {queue.length===0 ? <p style={{ color:'#64748b', fontSize:'0.82rem' }}>No pending reports (try POST /api/reports then GET /api/moderation with MODERATOR token)</p> : queue.map((r:any)=><div key={r.id} style={{ padding:'0.5rem', border:'1px solid #eef2f7', borderRadius:8, marginTop:'0.5rem', fontSize:'0.82rem' }}>{r.title} · {r.pincodeCode} · {r.status}</div>)}
        <button onClick={async()=>{ const id=prompt('Report id to approve?'); if(!id) return; const t=localStorage.getItem('jantax_token'); await fetch(`/api/reports/${id}/review`,{method:'PATCH', headers:{'Content-Type':'application/json', Authorization:`Bearer ${t}`}, body:JSON.stringify({status:'APPROVED'})}); alert('Reviewed'); }} style={{ marginTop:'0.7rem', padding:'0.5rem 0.9rem', background:'#0f2d59', color:'#fff', border:'none', borderRadius:8, fontWeight:700 }}>Review (PATCH)</button>
      </div>
      <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1rem', marginTop:'1rem' }}>
        <h3>PIN Ops (ADMIN only)</h3>
        <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
          <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="110001" style={{ padding:'0.5rem', borderRadius:8, border:'1px solid #e2e8f0' }}/>
          <button onClick={createPin} style={{ padding:'0.5rem 0.9rem', background:'#0f2d59', color:'#fff', border:'none', borderRadius:8, fontWeight:700 }}>Create PIN (admin)</button>
        </div>
        <div style={{ fontSize:'0.72rem', color:'#64748b', marginTop:'0.4rem' }}>Requires Bearer ADMIN token. Auto-create Unknown is now blocked (needs state&district).</div>
      </div>
      <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1rem', marginTop:'1rem' }}>
        <h3>Follow Analytics</h3>
        <p style={{ fontSize:'0.82rem', color:'#475569' }}>Pending reports: {followCount} · Sources: CAG, UDISE+, HMIS, RERA, DARPG (see /data-sources) · Cron: nightly 02:00 IST stub in server/src/jobs/cron.ts</p>
      </div>
      <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1rem', marginTop:'1rem' }}>
        <h3>Sync Observability {syncSources.length?`(${syncSources.length})`:''}</h3>
        {syncSources.length===0 ? <p style={{ fontSize:'0.82rem', color:'#64748b' }}>No sync data (login as ADMIN to view <code>GET /api/admin/sync/status</code>). Shows lastChecked, lastSuccessfulSync, stale warnings, failure warnings.</p> : (
          <div style={{ display:'grid', gap:'0.5rem', marginTop:'0.5rem' }}>
            {syncSources.slice(0,5).map((s:any)=>(
              <div key={s.sourceId} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', padding:'0.5rem 0.7rem', border:'1px solid #eef2f7', borderRadius:8, background: s.stale?'#fef3c7':'#f8fafc' }}>
                <span><strong>{s.sourceName}</strong> <span style={{ color:'#64748b' }}>· {s.sourceId}</span> {s.stale && <span style={{ background:'#f59e0b', color:'#fff', padding:'1px 6px', borderRadius:999, fontSize:'0.62rem', marginLeft:'0.3rem' }}>Stale</span>}</span>
                <span style={{ color:'#64748b' }}>{s.status} · {s.lastSuccessfulSync ? new Date(s.lastSuccessfulSync).toLocaleDateString() : 'never'}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={async()=>{ const id=prompt('SourceId to sync (e.g. src_udise_2324)?'); if(!id) return; const t=localStorage.getItem('jantax_token'); const r=await fetch(`/api/admin/sync/${id}`,{method:'POST', headers:{Authorization:`Bearer ${t}`}}); const j=await r.json(); alert(JSON.stringify(j).slice(0,500)); }} style={{ marginTop:'0.7rem', padding:'0.5rem 0.9rem', background:'#0f2d59', color:'#fff', border:'none', borderRadius:8, fontWeight:700 }}>Trigger Sync (ADMIN)</button>
      </div>
    </div>
  );
}
