const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&#x2F;': '/',
};

/**
 * Stored report text is HTML-escaped for public API payloads. React already
 * escapes on render, so decode before display to avoid showing "&amp;".
 */
export function decodeEntities(value: string | undefined | null): string {
  if (!value) return '';
  return value.replace(/&(amp|lt|gt|quot|#x27|#39|#x2F);/g, (m) => ENTITIES[m] ?? m);
}

export function reportForDisplay<T extends { title: string; description: string; location: { landmark: string } }>(r: T): T {
  return {
    ...r,
    title: decodeEntities(r.title),
    description: decodeEntities(r.description),
    location: { ...r.location, landmark: decodeEntities(r.location.landmark) },
  };
}
