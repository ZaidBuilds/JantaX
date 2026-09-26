import type { ReactNode } from 'react';

export type Tone = 'neutral' | 'good' | 'warn' | 'bad' | 'info' | 'brand' | 'accent';

export function Badge({ tone = 'neutral', children, className = '' }: { tone?: Tone; children: ReactNode; className?: string }) {
  const toneClass = tone === 'neutral' ? '' : `badge-${tone}`;
  return <span className={`badge ${toneClass} ${className}`.trim()}>{children}</span>;
}

/** Maps free-text statuses coming from data into a tone. */
export function toneForStatus(status: string | undefined | null): Tone {
  const s = (status || '').toLowerCase();
  if (!s) return 'neutral';
  if (/(complete|resolved|steady|good|verified|approved|published|active|on track|well staffed|functional|open)/.test(s)) return 'good';
  if (/(delay|critical|stalled|fail|breach|rejected|closed|severe|poor|blacklist|overdue|high risk)/.test(s)) return 'bad';
  if (/(attention|progress|construction|pending|review|moderate|partial|warning|fair)/.test(s)) return 'warn';
  return 'info';
}

export function toneForScore(score: number): Tone {
  if (score >= 75) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
}
