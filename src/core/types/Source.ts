/**
 * Source — Where the official data came from.
 * Every claim needs a verifiable, linkable source.
 */
export interface Source {
  name: string;               // e.g., "MoSPI Flash Report Q2 2026"
  nameHindi: string;          // e.g., "एमओएसपीआई फ्लैश रिपोर्ट Q2 2026"
  url: string;                // Direct link to the PDF/portal
  lastScraped: string;        // ISO 8601 — when we pulled this data
  dataFreshness: 'live' | 'weekly' | 'monthly' | 'annual';
}
