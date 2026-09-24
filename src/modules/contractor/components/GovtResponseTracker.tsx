import React, { useMemo } from 'react';
import { SourceBadge } from '../../../components/UI/SourceBadge';
import { deriveLifecycle, STAGE_ORDER, type ReportItem, type GovtStage } from './govtResponseLogic';

function stageLabel(s: GovtStage): string {
  switch (s) {
    case 'SUBMITTED': return 'दर्ज (Submitted)';
    case 'ACKNOWLEDGED': return 'स्वीकृत (Acknowledged)';
    case 'ACTION': return 'कार्रवाई (Action Taken)';
    case 'VERIFIED': return 'सत्यापित (Verified)';
  }
}

export const GovtResponseTracker: React.FC<{ reports: ReportItem[] }> = React.memo(({ reports }) => {
  const enriched = useMemo(
    () => reports.map(r => ({ report: r, ...deriveLifecycle(r) })),
    [reports]
  );

  if (reports.length === 0) {
    return (
      <p style={{ fontSize: '0.85rem', color: 'var(--ink-4)' }}>
        No government responses yet · submit a report to start the accountability loop (Submitted → Acknowledged → Action → Verified).
      </p>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {enriched.map(({ report, stage, delayDays, originalKept }) => (
        <div key={report.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>
              {report.category || report.title || 'Citizen Report'}
            </strong>
            <SourceBadge sourceType="D" sourceName={`Govt Response · ${stageLabel(stage)}`} />
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: '0.4rem 0 0.6rem' }}>{report.description}</p>

          {/* Lifecycle bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
            {STAGE_ORDER.map((s, i) => {
              const reached = STAGE_ORDER.indexOf(stage) >= i;
              return (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: reached ? 'var(--brand)' : 'var(--border)',
                  }}
                  title={stageLabel(s)}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--ink-3)', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span>{report.pincode} · {report.module}</span>
            <span>Filed→Resolved: <strong style={{ color: 'var(--bad)' }}>{delayDays} days</strong></span>
            <span>{originalKept ? 'Original kept (never deleted)' : ''}</span>
          </div>
        </div>
      ))}
    </div>
  );
});
