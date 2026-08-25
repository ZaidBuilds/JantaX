import React from 'react';
export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign:'center', padding:'2rem 1rem', background:'#fff', border:'1px solid #eef2f7', borderRadius:12 }}>
      <div style={{ width:48, height:48, borderRadius:12, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.6rem', fontSize:20 }}>🗂️</div>
      <h4 style={{ margin:'0 0 0.3rem', color:'#0f172a' }}>{title}</h4>
      {desc && <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>{desc}</p>}
      {action && <div style={{ marginTop:'0.8rem' }}>{action}</div>}
    </div>
  );
}
export function StaleBadge({ lastUpdated }: { lastUpdated: string }) {
  const days = (Date.now() - new Date(lastUpdated).getTime())/(1000*60*60*24);
  if (days <= 90) return null;
  return <span style={{ background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a', padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Stale • {Math.floor(days)}d ago</span>;
}
