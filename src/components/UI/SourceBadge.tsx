import { Badge, type Tone } from '../../ui/Badge';

/** Source tiers: A official dataset, B official portal, C document or report, D independent, E community. */
const TIER_TONE: Record<string, Tone> = { A: 'good', B: 'info', C: 'warn', D: 'brand', E: 'accent' };

export function SourceBadge({ sourceType, sourceName, sourceUrl, status }: { sourceType: string; sourceName?: string; sourceUrl?: string; status?: string }) {
  const tier = sourceType?.[0] || 'A';
  const degraded = status === 'degraded' || status === 'failed';
  return (
    <Badge tone={degraded ? 'warn' : TIER_TONE[tier] ?? 'neutral'} className="badge-source">
      <span className="badge-text" title={sourceName || sourceType}>{sourceName || sourceType}</span>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }} aria-label={`Open ${sourceName || 'source'}`}>
          ↗
        </a>
      )}
    </Badge>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  return <Badge tone={TIER_TONE[tier] ?? 'neutral'}>Tier {tier}</Badge>;
}
