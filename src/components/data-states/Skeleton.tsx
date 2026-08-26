import React from 'react';

interface SkeletonCardProps {
  variant?: 'default' | 'compact' | 'featured';
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  variant = 'default',
  showAvatar = false,
  showImage = false,
  lines = 3,
  className = '',
}: SkeletonCardProps) {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';

  if (variant === 'compact') {
    return (
      <div className={`p-4 bg-white rounded-xl border border-slate-200 ${className}`}>
        <div className="flex items-center gap-3">
          {showAvatar && <div className={`${baseClasses} w-10 h-10 rounded-full flex-shrink-0`} />}
          <div className="flex-1 space-y-2">
            <div className={`${baseClasses} h-4 w-3/4 rounded`} />
            <div className={`${baseClasses} h-3 w-1/2 rounded`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`p-5 bg-white rounded-xl border border-slate-200 ${className}`}>
        {showImage && <div className={`${baseClasses} h-40 w-full rounded-lg mb-4`} />}
        <div className="flex items-center gap-3 mb-3">
          {showAvatar && <div className={`${baseClasses} w-12 h-12 rounded-full flex-shrink-0`} />}
          <div className="flex-1 space-y-2">
            <div className={`${baseClasses} h-5 w-2/3 rounded`} />
            <div className={`${baseClasses} h-3 w-1/3 rounded`} />
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} h-3 rounded`}
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <div className={`${baseClasses} h-8 w-20 rounded-lg`} />
          <div className={`${baseClasses} h-8 w-20 rounded-lg`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-xl border border-slate-200 ${className}`}>
      <div className="flex items-start gap-3">
        {showAvatar && <div className={`${baseClasses} w-10 h-10 rounded-full flex-shrink-0`} />}
        <div className="flex-1 space-y-2">
          <div className={`${baseClasses} h-4 w-1/2 rounded`} />
          <div className={`${baseClasses} h-3 w-3/4 rounded`} />
          {[...Array(Math.min(lines, 3))].map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} h-3 rounded`}
              style={{ width: `${90 - i * 15}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className = '' }: SkeletonTableProps) {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
        <div className="flex gap-4">
          {[...Array(columns)].map((_, i) => (
            <div key={i} className={`${baseClasses} h-4 rounded flex-1`} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3 flex gap-4">
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`${baseClasses} h-4 rounded flex-1`}
                style={{ opacity: 1 - rowIndex * 0.1 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkeletonChartProps {
  variant?: 'bar' | 'line' | 'donut' | 'area';
  className?: string;
}

export function SkeletonChart({ variant = 'bar', className = '' }: SkeletonChartProps) {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';

  if (variant === 'donut') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <div className={`${baseClasses} w-40 h-40 rounded-full`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${baseClasses} w-20 h-20 rounded-full bg-white`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'line' || variant === 'area') {
    return (
      <div className={`p-4 bg-white rounded-xl border border-slate-200 ${className}`}>
        <div className="flex items-end justify-between h-40 gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} flex-1 rounded-t`}
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${baseClasses} h-3 w-16 rounded`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-xl border border-slate-200 ${className}`}>
      <div className="flex items-end justify-between h-40 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`${baseClasses} w-full rounded-t`}
              style={{ height: `${40 + Math.random() * 50}%` }}
            />
            <div className={`${baseClasses} h-3 w-full rounded`} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkeletonMetricProps {
  className?: string;
}

export function SkeletonMetric({ className = '' }: SkeletonMetricProps) {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';

  return (
    <div className={`p-4 bg-white rounded-xl border border-slate-200 ${className}`}>
      <div className={`${baseClasses} h-3 w-20 rounded mb-3`} />
      <div className={`${baseClasses} h-8 w-16 rounded mb-2`} />
      <div className={`${baseClasses} h-3 w-24 rounded`} />
    </div>
  );
}
