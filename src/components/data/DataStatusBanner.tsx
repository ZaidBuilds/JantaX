import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { MODULE_REGISTRY } from '../../core/registry/moduleRegistry';
import { useLanguage } from '../../core/context/LanguageContext';

interface Props {
  /** Registry module id, e.g. 'school'. Unknown ids render nothing. */
  moduleId: string;
}

/**
 * Tells the reader, on every module page, whether what they are looking at is
 * real data from the database or demonstration content.
 *
 * This is a product requirement, not decoration: JantaX presents government
 * records, so a fixture-backed module must never be mistaken for an official
 * one. The status comes from MODULE_REGISTRY (`dataStatus`), which is the
 * single source of truth — see docs/MODULE_EXPANSION_PROTOCOL.md.
 *
 * Deliberately does not fetch. A network failure must not be able to silently
 * turn a "Demo data" notice into nothing.
 */
export function DataStatusBanner({ moduleId }: Props) {
  const { tr } = useLanguage();

  const meta = MODULE_REGISTRY.find((m) => m.id === moduleId);
  if (!meta) return null;

  const isLive = meta.dataStatus === 'live';

  const tone = isLive
    ? {
        bg: 'var(--bg-subtle)',
        border: 'var(--border-color)',
        text: 'var(--text-secondary)',
        strong: 'var(--text-primary)',
      }
    : {
        bg: 'var(--status-warn-bg)',
        border: 'var(--status-warn-border)',
        text: 'var(--status-warn-text)',
        strong: 'var(--status-warn-text)',
      };

  const Icon = isLive ? Database : AlertTriangle;

  return (
    <div
      role="note"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        margin: '0 0 var(--space-4)',
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: 'var(--radius-md)',
        color: tone.text,
        fontSize: 'var(--text-small)',
        lineHeight: 1.5,
      }}
    >
      <Icon size={15} aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }} />
      <span>
        <strong style={{ color: tone.strong, fontWeight: 700 }}>
          {isLive
            ? tr('Live data', 'लाइव डेटा')
            : tr('Demonstration data', 'प्रदर्शन डेटा')}
        </strong>
        {' — '}
        {isLive
          ? tr(
              'served from the JantaX database.',
              'JantaX डेटाबेस से लिया गया।'
            )
          : tr(
              'this module is not yet connected to a live source. Figures shown are examples and must not be treated as an official record.',
              'यह मॉड्यूल अभी किसी लाइव स्रोत से जुड़ा नहीं है। दिखाए गए आंकड़े उदाहरण हैं, आधिकारिक रिकॉर्ड नहीं।'
            )}
        {meta.dataSource ? (
          <>
            {' '}
            <span style={{ color: 'var(--text-muted)' }}>
              {isLive
                ? tr('Source:', 'स्रोत:')
                : tr('Intended source:', 'प्रस्तावित स्रोत:')}{' '}
              {meta.dataSource}
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
}
