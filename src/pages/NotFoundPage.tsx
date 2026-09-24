import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../ui';

export function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="page page-narrow">
      <div className="card">
        <EmptyState
          icon={Compass}
          title="We could not find that page"
          text={<>Nothing lives at <span className="mono">{pathname}</span>. It may have moved, or the link may be mistyped.</>}
          action={
            <div className="cluster" style={{ justifyContent: 'center' }}>
              <Link to="/" className="btn btn-primary">Go to home</Link>
              <Link to="/explore" className="btn btn-secondary">Browse all modules</Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
