import React from 'react';

interface VerificationBadgeProps {
  verificationStatus: 'PENDING' | 'VERIFIED' | 'DISPUTED';
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ verificationStatus, size = 'md' }: VerificationBadgeProps) {
  let color: string;
  let label: string;
  switch (verificationStatus) {
    case 'VERIFIED':
      color = 'bg-green-100 text-green-800';
      label = 'Verified';
      break;
    case 'DISPUTED':
      color = 'bg-red-100 text-red-800';
      label = 'Disputed';
      break;
    case 'PENDING':
    default:
      color = 'bg-gray-100 text-gray-800';
      label = 'Pending';
  }

  const sizeConfig: Record<string, { text: string; px: string }> = {
    sm: { text: 'text-xs', px: 'px-1.5' },
    md: { text: 'text-sm', px: 'px-2' },
    lg: { text: 'text-base', px: 'px-2.5' },
  };
  const { text, px } = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full ${color} ${px} ${text}`}>
      {label}
    </span>
  );
}