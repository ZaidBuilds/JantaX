import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Home', to: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      {all.map((c, i) => {
        const last = i === all.length - 1;
        return (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {last || !c.to ? (
              <span aria-current={last ? 'page' : undefined}>{c.label}</span>
            ) : (
              <Link to={c.to}>{c.label}</Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
