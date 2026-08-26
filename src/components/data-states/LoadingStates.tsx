import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message = 'Loading…',
  fullScreen = false,
  className = '',
}: LoadingOverlayProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <Loader2
        size={fullScreen ? 40 : 28}
        className="text-primary animate-spin"
        style={{ color: 'var(--color-primary)' }}
      />
      <p
        style={{
          fontSize: fullScreen ? '1rem' : '0.875rem',
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}
      >
        {message}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
        style={{ background: 'rgba(255,255,255,0.9)' }}
      >
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 32 };
  return (
    <Loader2
      size={sizeMap[size]}
      className={`animate-spin ${className}`}
      style={{ color: 'var(--color-primary)' }}
    />
  );
}

interface RetryLoadingProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function RetryLoading({
  message = 'Loading data…',
  onRetry,
  retryLabel = 'Retry',
  className = '',
}: RetryLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
      <div className="relative">
        <Loader2
          size={36}
          className="animate-spin"
          style={{ color: 'var(--color-primary)' }}
        />
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <RefreshCw size={14} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
