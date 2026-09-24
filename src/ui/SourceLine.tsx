import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SourceLineProps {
  source: string;
  url?: string;
  updated?: string;
  showMethod?: boolean;
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Every number on JantaX should be traceable. This is the one-line provenance footer. */
export function SourceLine({ source, url, updated, showMethod = true }: SourceLineProps) {
  const when = formatDate(updated);
  return (
    <div className="source-row">
      <span>
        Source:{' '}
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            {source} <ExternalLink size={11} style={{ display: 'inline', verticalAlign: '-1px' }} aria-hidden="true" />
          </a>
        ) : (
          <strong style={{ color: 'var(--ink-2)' }}>{source}</strong>
        )}
      </span>
      {when && <span>Updated {when}</span>}
      {showMethod && <Link to="/transparency/methodology">How we score</Link>}
    </div>
  );
}
