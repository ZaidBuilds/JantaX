import React from 'react';
import type { ModerationState } from '../types/citizenReport';
import { ShieldCheck, Clock, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

interface ModerationStatusProps {
  moderationState: ModerationState;
  spamScore: number;
  abuseCount: number;
}

export const ModerationStatus: React.FC<ModerationStatusProps> = ({
  moderationState,
  spamScore,
  abuseCount
}) => {
  let badgeColor = '#2563eb';
  let badgeBg = '#eff6ff';
  let icon = <Clock size={16} />;

  if (moderationState === 'Approved & Published') {
    badgeColor = '#047857';
    badgeBg = '#ecfdf5';
    icon = <CheckCircle2 size={16} />;
  } else if (moderationState === 'Flagged for Review') {
    badgeColor = '#b45309';
    badgeBg = '#fffbebf';
    icon = <AlertTriangle size={16} />;
  } else if (moderationState === 'Rejected') {
    badgeColor = '#b91c1c';
    badgeBg = '#fef2f2';
    icon = <XCircle size={16} />;
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 14,
      border: '1px solid #e2e8f0',
      padding: '1.15rem',
      boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            background: badgeBg,
            color: badgeColor,
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {icon} {moderationState}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Automated Content & Abuse Moderation Pipeline
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
          <span>Spam Index: <strong style={{ color: spamScore > 30 ? '#b45309' : '#047857' }}>{spamScore}/100</strong></span>
          <span>Abuse Flags: <strong style={{ color: abuseCount > 0 ? '#b91c1c' : '#047857' }}>{abuseCount}</strong></span>
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.65rem', lineHeight: 1.45 }}>
        {moderationState === 'Approved & Published' && '✓ Public report verified clean. Media evidence passed automated moderation rules and is visible on JantaX public ledgers.'}
        {moderationState === 'Pending Review' && '⏳ Report currently undergoing media automated moderation checks before full public listing.'}
        {moderationState === 'Flagged for Review' && '⚠️ Report flagged for community auditor review due to elevated spam score or community abuse flags.'}
        {moderationState === 'Rejected' && '❌ Report rejected for violating community guidelines or failing spam moderation checks.'}
      </div>
    </div>
  );
};
