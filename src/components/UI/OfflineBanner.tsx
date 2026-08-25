import React from 'react';
export function OfflineBanner({ show }: { show?: boolean }) {
  const [online, setOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineMock, setOfflineMock] = React.useState(false);
  React.useEffect(() => {
    const on = () => { setOnline(true); try { localStorage.removeItem('jantax_offline'); setOfflineMock(false); } catch {} }, off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    const check = () => { try { setOfflineMock(localStorage.getItem('jantax_offline')==='1'); } catch {} };
    check();
    const id = setInterval(check, 2000);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); clearInterval(id); };
  }, []);
  if (online && !offlineMock && !show) return null;
  return (
    <div style={{ background:'#fef3c7', border:'1px solid #fde68a', color:'#92400e', padding:'0.5rem 0.9rem', borderRadius:8, fontSize:'0.78rem', fontWeight:600, display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.75rem' }}>
      <span>⚠️ Offline mock — backend unreachable, showing local resilience (hashSeed). Data will sync when online.</span>
    </div>
  );
}
