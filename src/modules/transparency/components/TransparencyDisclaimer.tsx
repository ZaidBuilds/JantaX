import { Scale } from 'lucide-react';

export function TransparencyDisclaimer() {
  return (
    <div className="callout callout-warn" style={{ marginBottom: 'var(--s-6)' }}>
      <Scale size={16} aria-hidden="true" />
      <span>
        JantaX is independent and is not a government portal. It does not replace official records. Check anything consequential with the
        publishing authority.
      </span>
    </div>
  );
}
