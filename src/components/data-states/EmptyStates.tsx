import React from 'react';
import { Inbox, Search, FileX, AlertTriangle, WifiOff, Database } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  const defaultIcon = <Inbox size={40} style={{ color: 'var(--text-muted)' }} />;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-primary-50, rgba(37,99,235,0.08))' }}
      >
        {icon || defaultIcon}
      </div>
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex gap-3 mt-6">
          {action && (
            <button
              onClick={action.onClick}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'transparent',
                color: 'var(--text-primary)',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '0.875rem',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface NoResultsStateProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

export function NoResultsState({
  query,
  onClear,
  className = '',
}: NoResultsStateProps) {
  return (
    <EmptyState
      icon={<Search size={40} style={{ color: 'var(--text-muted)' }} />}
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try adjusting your search or filters.`
          : 'No data matches your current filters.'
      }
      action={
        onClear
          ? {
              label: 'Clear filters',
              onClick: onClear,
            }
          : undefined
      }
      className={className}
    />
  );
}

interface NoDataStateProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  className?: string;
}

export function NoDataState({
  title = 'No data available',
  description = 'There is no data available for this selection yet.',
  onRefresh,
  className = '',
}: NoDataStateProps) {
  return (
    <EmptyState
      icon={<FileX size={40} style={{ color: 'var(--text-muted)' }} />}
      title={title}
      description={description}
      action={
        onRefresh
          ? {
              label: 'Refresh',
              onClick: onRefresh,
            }
          : undefined
      }
      className={className}
    />
  );
}
