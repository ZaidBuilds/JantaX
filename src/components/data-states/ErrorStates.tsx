import React from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string | number;
  onRetry?: () => void;
  onGoHome?: () => void;
  variant?: 'default' | 'critical' | 'warning';
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this data. Please try again.',
  code,
  onRetry,
  onGoHome,
  variant = 'default',
  className = '',
}: ErrorStateProps) {
  const colors = {
    default: {
      bg: 'rgba(239, 68, 68, 0.08)',
      icon: '#ef4444',
      border: 'rgba(239, 68, 68, 0.2)',
    },
    critical: {
      bg: 'rgba(239, 68, 68, 0.12)',
      icon: '#dc2626',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.25)',
    },
  };

  const colorScheme = colors[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border ${className}`}
      style={{
        background: colorScheme.bg,
        borderColor: colorScheme.border,
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: colorScheme.bg }}
      >
        <AlertCircle size={32} style={{ color: colorScheme.icon }} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
        {code && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(239, 68, 68, 0.1)',
              color: colorScheme.icon,
            }}
          >
            {code}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: 400,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>

      <div className="flex gap-3 mt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: colorScheme.icon,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            <Home size={14} />
            Go home
          </button>
        )}
      </div>
    </div>
  );
}

interface OfflineStateProps {
  onRetry?: () => void;
  lastUpdated?: string;
  className?: string;
}

export function OfflineState({
  onRetry,
  lastUpdated,
  className = '',
}: OfflineStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border ${className}`}
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        borderColor: 'rgba(245, 158, 11, 0.2)',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(245, 158, 11, 0.12)' }}
      >
        <WifiOff size={32} style={{ color: '#f59e0b' }} />
      </div>
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        You're offline
      </h3>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        Please check your internet connection and try again.
      </p>
      {lastUpdated && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
          }}
        >
          Last updated: {lastUpdated}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}

interface PageErrorStateProps {
  onGoBack?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function PageErrorState({
  onGoBack,
  onRetry,
  className = '',
}: PageErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] text-center px-4 ${className}`}
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(239, 68, 68, 0.08)' }}
      >
        <AlertCircle size={48} style={{ color: '#ef4444' }} />
      </div>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-heading)',
        }}
      >
        Page failed to load
      </h2>
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        We couldn't load this page due to an unexpected error. Please try again or go back to the
        previous page.
      </p>
      <div className="flex gap-3 mt-8">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
