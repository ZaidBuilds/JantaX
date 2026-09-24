import { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';

function readSampleMode() {
  try {
    return localStorage.getItem('jantax_offline') === '1';
  } catch {
    return false;
  }
}

/**
 * Tells people, in plain words, when they are looking at sample data because
 * the live API or their connection is unavailable.
 */
export function StatusBanner() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [sample, setSample] = useState(readSampleMode);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    const onStorage = () => setSample(readSampleMode());
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    window.addEventListener('jantax:data-mode', onStorage);
    window.addEventListener('storage', onStorage);
    const id = window.setInterval(onStorage, 4000);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('jantax:data-mode', onStorage);
      window.removeEventListener('storage', onStorage);
      window.clearInterval(id);
    };
  }, []);

  if (online && !sample) return null;

  return (
    <div className="status-banner" role="status">
      <CloudOff size={14} aria-hidden="true" />
      {online ? (
        <>
          <span className="hide-mobile">The live records service is not reachable right now, so you are seeing sample records. Figures are illustrative.</span>
          <span className="show-mobile">Showing sample records. Figures are illustrative.</span>
        </>
      ) : (
        'You are offline. Showing the last records we could load.'
      )}
      <button type="button" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}
