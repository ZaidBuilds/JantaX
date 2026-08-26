import React from 'react';

interface ConfidenceBadgeProps {
  confidence: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({ confidence, size = 'md' }: ConfidenceBadgeProps) {
  // Determine color based on confidence
  let color: string;
  if (confidence >= 80) {
    color = 'bg-green-100 text-green-800';
  } else if (confidence >= 60) {
    color = 'bg-yellow-100 text-yellow-800';
  } else if (confidence >= 40) {
    color = 'bg-orange-100 text-orange-800';
  } else {
    color = 'bg-red-100 text-red-800';
  }

  const sizeConfig: Record<string, { text: string; px: string }> = {
    sm: { text: 'text-xs', px: 'px-1.5' },
    md: { text: 'text-sm', px: 'px-2' },
    lg: { text: 'text-base', px: 'px-2.5' },
  };
  const { text, px } = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full ${color} ${px} ${text}`}>
      {confidence}%
    </span>
  );
}