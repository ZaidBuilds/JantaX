import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon" aria-hidden="true">
          <Icon size={22} />
        </span>
      )}
      <div className="empty-title">{title}</div>
      {text && <p className="empty-text">{text}</p>}
      {action && <div style={{ marginTop: 'var(--s-3)' }}>{action}</div>}
    </div>
  );
}
