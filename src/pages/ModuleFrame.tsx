import type { ReactNode } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { Database, Megaphone, Scale } from 'lucide-react';
import { Breadcrumbs, ModuleIcon, getModule } from '../ui';

interface View {
  label: string;
  to: string;
}

/** Sub-navigation for modules that have more than one screen. */
const VIEWS: Record<string, View[]> = {
  school: [
    { label: 'Directory', to: '/schools' },
    { label: 'Search', to: '/schools/search' },
    { label: 'Compare', to: '/schools/compare' },
    { label: 'Methodology', to: '/schools/methodology' },
  ],
  infra: [
    { label: 'Overview', to: '/module/infra' },
    { label: 'All projects', to: '/projects' },
    { label: 'Search', to: '/projects/search' },
  ],
  contractor: [
    { label: 'Overview', to: '/module/contractor' },
    { label: 'Directory', to: '/contractors' },
    { label: 'Compare', to: '/contractors/compare' },
  ],
  rera: [
    { label: 'Overview', to: '/module/rera' },
    { label: 'Projects', to: '/rera' },
    { label: 'Search', to: '/rera/search' },
    { label: 'Compare', to: '/rera/compare' },
  ],
  courts: [
    { label: 'Courts', to: '/module/courts' },
    { label: 'Compare', to: '/courts/compare' },
    { label: 'Track a case (CNR)', to: '/courts/cnr-guide' },
  ],
  rti: [
    { label: 'Authorities', to: '/module/rti' },
    { label: 'Compare', to: '/rti/compare' },
    { label: 'Draft an RTI', to: '/rti/draft' },
  ],
  mplads: [
    { label: 'Works', to: '/module/mplads' },
    { label: 'Compare', to: '/mplads/compare' },
  ],
  nagar: [
    { label: 'Wards', to: '/module/nagar' },
    { label: 'Compare', to: '/nagar/compare' },
    { label: 'File a complaint', to: '/nagar/complaint' },
  ],
  pollution: [
    { label: 'Stations', to: '/module/pollution' },
    { label: 'Compare', to: '/pollution/compare' },
    { label: 'GRAP guide', to: '/pollution/grap' },
  ],
  booth: [
    { label: 'Booths', to: '/module/booth' },
    { label: 'Voter services', to: '/booth/voter-services' },
  ],
};

interface ModuleFrameProps {
  moduleId: string;
  children: ReactNode;
}

export function ModuleFrame({ moduleId, children }: ModuleFrameProps) {
  const m = getModule(moduleId);
  const [params] = useSearchParams();
  const pin = params.get('pin');
  const views = VIEWS[moduleId] || [];
  const withPin = (to: string) => (pin ? `${to}?pin=${pin}` : to);

  if (!m) return <div className="page">{children}</div>;

  return (
    <div className="page module-page">
      <Breadcrumbs items={[{ label: 'Explore', to: '/explore' }, { label: m.shortName }]} />
      <header className="module-hero">
        <ModuleIcon id={moduleId} size="lg" />
        <div className="module-hero-main">
          <h1 className="page-title">{m.shortName}</h1>
          <p className="module-hindi" lang="hi">{m.hindi}</p>
          <p className="page-lede">{m.summary}</p>
          <div className="source-row" style={{ marginTop: 'var(--s-3)' }}>
            <Database size={13} aria-hidden="true" />
            <span>Sources: {m.dataSource}</span>
            <Link to="/sources">All sources</Link>
          </div>
        </div>
        <div className="page-actions">
          <Link to={`/report-issue?module=${moduleId}${pin ? `&pin=${pin}` : ''}`} className="btn btn-secondary">
            <Megaphone size={16} aria-hidden="true" />
            Report an issue
          </Link>
        </div>
      </header>
      {views.length > 1 && (
        <nav className="tabs module-tabs" aria-label={`${m.shortName} sections`}>
          {views.map((v) => (
            <NavLink
              key={v.to}
              to={withPin(v.to)}
              end
              className={({ isActive }) => `tab${isActive ? ' is-active' : ''}`}
            >
              {v.label}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="module-body">{children}</div>
      <p className="module-disclaimer">
        <Scale size={14} aria-hidden="true" />
        JantaX is independent and is not a government portal. Sample figures are illustrative where the live service is unavailable. Check anything consequential with the publishing authority.
      </p>
    </div>
  );
}
