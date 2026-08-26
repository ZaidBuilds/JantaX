import React from 'react';

interface SourceBadgeProps {
  source: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SourceBadge({ source, size = 'md' }: SourceBadgeProps) {
  // Truncate source if too long
  const displaySource = source.length > 20 ? source.substring(0, 20) + '...' : source;

  const sizeConfig: Record<string, { text: string; px: string }> = {
    sm: { text: 'text-xs', px: 'px-1.5' },
    md: { text: 'text-sm', px: 'px-2' },
    lg: { text: 'text-base', px: 'px-2.5' },
  };
  const { text, px } = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full bg-blue-100 text-blue-800 ${px} ${text}`}>
      {displaySource}
    </span>
  );
}