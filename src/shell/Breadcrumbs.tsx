import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../core/context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const getPathSegments = (): BreadcrumbItem[] => {
    if (items && items.length > 0) {
      return items;
    }

    const segments: BreadcrumbItem[] = [];
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) {
      return [{ label: t('home'), path: '/' }];
    }

    let accumulatedPath = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      accumulatedPath += '/' + part;

      if (part === 'pin' && parts[i + 1]) {
        accumulatedPath += '/' + parts[i + 1];
        segments.push({ label: parts[i + 1], path: accumulatedPath });
        i++;
      } else if (part === 'module' && parts[i + 1]) {
        const moduleName = parts[i + 1].split('?')[0];
        segments.push({ label: moduleName.charAt(0).toUpperCase() + moduleName.slice(1), path: accumulatedPath });
        i++;
      } else if (part === 'location') {
        if (parts[i + 1]) {
          accumulatedPath += '/' + parts[i + 1];
          segments.push({ label: `PIN ${parts[i + 1]}`, path: accumulatedPath });
          i++;
        }
      } else {
        const label = part.charAt(0).toUpperCase() + part.slice(1);
        if (i === parts.length - 1) {
          segments.push({ label, path: undefined });
        } else {
          segments.push({ label, path: accumulatedPath });
        }
      }
    }

    return segments;
  };

  const pathSegments = getPathSegments();

  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.75rem 0' }}>
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <Home size={14} />
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          {segment.path && index < pathSegments.length - 1 ? (
            <Link
              to={segment.path}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {segment.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {segment.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
