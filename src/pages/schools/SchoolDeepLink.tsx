import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { api } from '../../core/services/api';

/**
 * QR codes printed for schools carry /school/{udiseCode} (prd-school.md). Resolve the
 * code to the school's profile, or fall back to a school search for that code.
 */
export function SchoolDeepLink() {
  const { code = '' } = useParams<{ code: string }>();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const q = code.trim();
    if (!/^\d{8,14}$/.test(q)) {
      setTarget(`/schools/${encodeURIComponent(q)}`);
      return;
    }
    api
      .search({ q, type: 'school', limit: 10 })
      .then((res) => {
        const hit = res.results.find((r) => r.type === 'school' && (r.metadata?.udiseCode === q || r.description.includes(q)));
        if (alive) setTarget(hit ? `/schools/${encodeURIComponent(hit.id)}` : `/schools/search?q=${q}`);
      })
      .catch(() => alive && setTarget(`/schools/search?q=${q}`));
    return () => {
      alive = false;
    };
  }, [code]);

  if (target) return <Navigate to={target} replace />;
  return (
    <div className="page page-narrow stack" aria-busy="true">
      <span className="skeleton" style={{ height: 32, width: '40%' }} />
      <span className="skeleton" style={{ height: 160 }} />
    </div>
  );
}
