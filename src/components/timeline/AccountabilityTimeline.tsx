import React from 'react';

export interface TimelineEvent {
  date: string;
  actor: string;
  title: string;
  desc: string;
  status: 'critical' | 'construction' | 'delayed' | 'completed';
}

interface AccountabilityTimelineProps {
  events: TimelineEvent[];
}

const EVENT_COLORS: Record<string, string> = {
  critical: '#ef4444',
  construction: '#3b82f6',
  delayed: '#f97316',
  completed: '#10b981'
};

export function AccountabilityTimeline({ events }: AccountabilityTimelineProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)' }}>
      {events.map((e, idx) => {
        const dotColor = EVENT_COLORS[e.status] || '#cbd5e1';
        return (
          <div key={idx} style={{ position: 'relative' }}>
            {/* Colored Dot on Left border */}
            <div style={{
              position: 'absolute',
              left: '-2.05rem',
              top: '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: dotColor,
              border: '3px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}></div>
            
            <div style={{ fontSize: '0.72rem', opacity: 0.5, fontWeight: 700 }}>
              {e.date} · {e.actor}
            </div>
            <h4 style={{ fontSize: '0.95rem', margin: '0.15rem 0', fontWeight: 700, color: 'var(--color-primary)' }}>{e.title}</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0, lineHeight: 1.4 }}>{e.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
