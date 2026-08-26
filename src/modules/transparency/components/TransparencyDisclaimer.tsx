import React from 'react';
import { Scale, ShieldCheck, AlertCircle } from 'lucide-react';

export const TransparencyDisclaimer: React.FC = () => {
  return (
    <div style={{
      background: '#fffbebf',
      border: '1px solid #fde68a',
      borderRadius: 14,
      padding: '1rem 1.25rem',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.86rem',
      color: '#b45309'
    }}>
      <Scale size={24} style={{ flexShrink: 0, color: '#d97706' }} />
      <div>
        <strong>Mandatory Non-Government Disclaimer:</strong> JantaX is an independent public data transparency platform. JantaX is not an official government portal and does not replace official government records. Users should verify consequential information directly with the primary publishing authority.
      </div>
    </div>
  );
};
