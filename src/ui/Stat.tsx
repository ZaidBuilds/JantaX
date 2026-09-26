import type { ReactNode } from 'react';

interface StatProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function Stat({ label, value, unit, meta, className = '' }: StatProps) {
  return (
    <div className={`stat ${className}`.trim()}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {meta && <span className="stat-meta">{meta}</span>}
    </div>
  );
}
