import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

interface PageHeaderProps {
  title: ReactNode;
  lede?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
}

export function PageHeader({ title, lede, eyebrow, actions, crumbs }: PageHeaderProps) {
  return (
    <>
      {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
      <header className="page-header">
        <div className="page-header-main">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className="page-title">{title}</h1>
          {lede && <p className="page-lede">{lede}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </header>
    </>
  );
}
