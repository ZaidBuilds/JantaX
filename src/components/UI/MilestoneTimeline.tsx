import React from 'react';
import { CheckCircle2, Clock, AlertCircle, CircleDot } from 'lucide-react';

export interface MilestoneStep {
  id: string;
  label: string;
  labelHi?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  date?: string;
  description?: string;
}

interface MilestoneTimelineProps {
  steps?: MilestoneStep[];
  currentProgressPct?: number;
  className?: string;
}

const DEFAULT_STEPS: MilestoneStep[] = [
  { id: 'step-1', label: 'Administrative Sanction', status: 'completed', date: 'Jan 2023', description: 'Budget approved & gazette notified' },
  { id: 'step-2', label: 'Tender Awarded', status: 'completed', date: 'Apr 2023', description: 'Work order executed with contractor' },
  { id: 'step-3', label: 'Civil Works', status: 'in_progress', date: 'Active (78%)', description: 'Foundation & structural construction' },
  { id: 'step-4', label: 'Joint Quality Audit', status: 'pending', date: 'Target Oct 2025', description: 'IRC SP:98 core cut inspection' },
  { id: 'step-5', label: 'Commissioned', status: 'pending', date: 'Target Dec 2025', description: 'Public operational hand-over' },
];

export function MilestoneTimeline({
  steps = DEFAULT_STEPS,
  currentProgressPct = 78,
  className = '',
}: MilestoneTimelineProps) {
  return (
    <div
      className={`milestone-timeline ${className}`}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header with Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Project Lifecycle Pipeline
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {currentProgressPct}% Completed
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: 6,
          borderRadius: 999,
          background: 'var(--bg-muted)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, currentProgressPct))}%`,
            height: '100%',
            borderRadius: 999,
            background: currentProgressPct >= 90 ? 'var(--emerald-600)' : 'var(--navy-700)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Steps Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: '0.75rem',
          position: 'relative',
        }}
      >
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isDelayed = step.status === 'delayed';

          const iconColor = isDone
            ? 'var(--emerald-600)'
            : isDelayed
            ? 'var(--crimson-600)'
            : isCurrent
            ? 'var(--navy-700)'
            : 'var(--text-subtle)';

          const bgColor = isDone
            ? 'var(--emerald-50)'
            : isDelayed
            ? 'var(--crimson-50)'
            : isCurrent
            ? 'var(--navy-50)'
            : 'var(--bg-subtle)';

          const borderColor = isDone
            ? 'var(--emerald-100)'
            : isDelayed
            ? 'var(--crimson-100)'
            : isCurrent
            ? 'var(--navy-100)'
            : 'var(--border-color)';

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Step Icon Badge */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  marginBottom: '0.5rem',
                  boxShadow: isCurrent ? '0 0 0 4px var(--navy-50)' : 'none',
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : isDelayed ? (
                  <AlertCircle size={16} />
                ) : isCurrent ? (
                  <CircleDot size={16} />
                ) : (
                  <Clock size={15} />
                )}
              </div>

              {/* Title & Date */}
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.25, marginBottom: '0.2rem' }}>
                {step.label}
              </div>

              {step.date && (
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: iconColor }}>
                  {step.date}
                </div>
              )}

              {step.description && (
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'none' }} className="md:block">
                  {step.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
