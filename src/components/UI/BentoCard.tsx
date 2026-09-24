import React from 'react';

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  iconBg?: string;
  metricValue?: string | number;
  metricLabel?: string;
  delta?: {
    value: string;
    isPositive?: boolean;
    isWarning?: boolean;
  };
  colSpan?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function BentoCard({
  title,
  subtitle,
  badge,
  icon: Icon,
  iconColor = '#0f2d59',
  iconBg = '#f1f5f9',
  metricValue,
  metricLabel,
  delta,
  colSpan = 1,
  onClick,
  children,
  className = '',
  style = {},
}: BentoCardProps) {
  const colSpanClass =
    colSpan === 2
      ? 'md:col-span-2'
      : colSpan === 3
      ? 'md:col-span-3'
      : colSpan === 4
      ? 'md:col-span-4'
      : 'col-span-1';

  return (
    <div
      onClick={onClick}
      className={`bento-card ${colSpanClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top Header Row */}
      {(title || Icon || badge) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {Icon && (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && (
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.25 }}>
                  {title}
                </div>
              )}
              {subtitle && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Main Metric Area */}
      {metricValue !== undefined && (
        <div style={{ margin: '0.4rem 0 0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--navy-950)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {metricValue}
            </span>
            {delta && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: delta.isWarning ? 'var(--crimson-50)' : delta.isPositive ? 'var(--emerald-50)' : 'var(--bg-subtle)',
                  color: delta.isWarning ? 'var(--crimson-700)' : delta.isPositive ? 'var(--emerald-700)' : 'var(--text-secondary)',
                  border: `1px solid ${delta.isWarning ? 'var(--crimson-100)' : delta.isPositive ? 'var(--emerald-100)' : 'var(--border-color)'}`,
                }}
              >
                {delta.value}
              </span>
            )}
          </div>
          {metricLabel && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>
              {metricLabel}
            </div>
          )}
        </div>
      )}

      {/* Body Content */}
      {children && <div style={{ flex: 1 }}>{children}</div>}
    </div>
  );
}
