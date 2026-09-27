import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  /** Render the title as a heading, e.g. 'h1' when the empty state is the whole page. */
  heading?: 'h1' | 'h2' | 'h3';
}

export function EmptyState({ icon: Icon, title, text, action, heading }: EmptyStateProps) {
  const Title = heading ?? 'div';
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon" aria-hidden="true">
          <Icon size={22} />
        </span>
      )}
      <Title className="empty-title">{title}</Title>
      {text && <p className="empty-text">{text}</p>}
      {action && <div style={{ marginTop: 'var(--s-3)' }}>{action}</div>}
    </div>
  );
}
