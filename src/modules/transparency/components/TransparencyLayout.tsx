import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Database, Workflow, Calculator, BadgeCheck, Clock, FilePen } from 'lucide-react';
import { PageHeader } from '../../../ui';
import { TransparencyDisclaimer } from './TransparencyDisclaimer';

const NAV = [
  { to: '/sources', label: 'Data sources', icon: Database },
  { to: '/transparency/methodology', label: 'Methodology', icon: Workflow },
  { to: '/transparency/scoring', label: 'How scores work', icon: Calculator },
  { to: '/transparency/evidence', label: 'Evidence standards', icon: BadgeCheck },
  { to: '/transparency/freshness', label: 'Data freshness', icon: Clock },
  { to: '/transparency/corrections', label: 'Corrections', icon: FilePen },
];

interface Props {
  title: string;
  lede: string;
  current: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function TransparencyLayout({ title, lede, current, actions, children }: Props) {
  return (
    <div className="page">
      <PageHeader crumbs={[{ label: 'Transparency', to: '/transparency/methodology' }, { label: current }]} title={title} lede={lede} actions={actions} />
      <div className="split-left">
        <nav className="side-nav sticky-aside" aria-label="Transparency">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `side-link${isActive ? ' is-active' : ''}`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ minWidth: 0 }}>
          <TransparencyDisclaimer />
          {children}
        </div>
      </div>
    </div>
  );
}
