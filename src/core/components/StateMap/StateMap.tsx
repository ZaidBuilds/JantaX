import React from 'react';
import type { Project } from '../../types/Project';

interface StateMapProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  projects: Project[];
}

interface StateNode {
  id: string;
  name: string;
  row: number;
  col: number;
}

// Stylized grid representing the geographic layout of Indian states
const STATE_NODES: StateNode[] = [
  { id: "JK", name: "Jammu and Kashmir", row: 1, col: 3 },
  { id: "PB", name: "Punjab", row: 2, col: 2 },
  { id: "HP", name: "Himachal Pradesh", row: 2, col: 3 },
  { id: "HR", name: "Haryana", row: 3, col: 2 },
  { id: "DL", name: "Delhi", row: 3, col: 3 },
  { id: "UK", name: "Uttarakhand", row: 3, col: 4 },
  { id: "RJ", name: "Rajasthan", row: 4, col: 1 },
  { id: "UP", name: "Uttar Pradesh", row: 4, col: 3 },
  { id: "BH", name: "Bihar", row: 4, col: 4 },
  { id: "GJ", name: "Gujarat", row: 5, col: 1 },
  { id: "MP", name: "Madhya Pradesh", row: 5, col: 2 },
  { id: "CG", name: "Chhattisgarh", row: 5, col: 3 },
  { id: "JH", name: "Jharkhand", row: 5, col: 4 },
  { id: "WB", name: "West Bengal", row: 5, col: 5 },
  { id: "AS", name: "Assam", row: 5, col: 6 },
  { id: "MH", name: "Maharashtra", row: 6, col: 2 },
  { id: "TS", name: "Telangana", row: 6, col: 3 },
  { id: "OR", name: "Odisha", row: 6, col: 4 },
  { id: "KA", name: "Karnataka", row: 7, col: 1 },
  { id: "AP", name: "Andhra Pradesh", row: 7, col: 3 },
  { id: "KL", name: "Kerala", row: 8, col: 1 },
  { id: "TN", name: "Tamil Nadu", row: 8, col: 3 }
];

export const StateMap: React.FC<StateMapProps> = ({
  selectedState,
  onSelectState,
  projects
}) => {
  // Calculate project counts and status flags for each state
  const getStateMetrics = (stateName: string) => {
    const stateProjects = projects.filter(p => p.state === stateName);
    const count = stateProjects.length;
    const hasDelayed = stateProjects.some(p => p.status === "Delayed");
    const allCompleted = count > 0 && stateProjects.every(p => p.status === "Completed");
    
    return { count, hasDelayed, allCompleted };
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Projects by state</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pick a state to see only its projects.</p>
        </div>
        {selectedState && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSelectState("")}>
            Show all states
          </button>
        )}
      </div>

      {/* Styled Grid Container for abstract Indian State Map */}
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: 'repeat(8, 1fr)', 
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0.65rem',
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
        aspectRatio: '1/1.2'
      }}>
        {STATE_NODES.map((node) => {
          const metrics = getStateMetrics(node.name);
          const isSelected = selectedState === node.name;
          
          // Determine styling based on project status in state
          // Tile colour follows the state's projects: amber for delays, green when all done, brand otherwise.
          let borderStyle = '1px solid var(--border-color)';
          let bgStyle = 'var(--surface)';
          let glowClass = '';

          if (metrics.count > 0) {
            if (metrics.hasDelayed) {
              borderStyle = '1px solid var(--warn-line)';
              bgStyle = 'var(--warn-soft)';
            } else if (metrics.allCompleted) {
              borderStyle = '1px solid var(--good-line)';
              bgStyle = 'var(--good-soft)';
            } else {
              borderStyle = '1px solid var(--brand-line)';
              bgStyle = 'var(--brand-soft)';
            }
          }

          if (isSelected) {
            borderStyle = '2px solid var(--brand)';
            bgStyle = 'var(--brand)';
            glowClass = 'selected-glow';
          }

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectState(node.name)}
              aria-pressed={isSelected}
              className={glowClass}
              style={{
                gridRow: node.row,
                gridColumn: node.col,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: borderStyle,
                background: bgStyle,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.2rem',
                position: 'relative'
              }}
              title={`${node.name}: ${metrics.count} active projects`}
            >
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: isSelected ? 'var(--on-solid)' : 'var(--text-primary)',
                fontFamily: 'var(--font-heading)'
              }}>
                {node.id}
              </span>
              
              {metrics.count > 0 && (
                <span style={{ 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: 600, 
                  color: isSelected ? 'var(--on-solid)' : 'var(--text-secondary)',
                  marginTop: '0.1rem',
                  background: isSelected ? 'color-mix(in srgb, var(--on-solid) 18%, transparent)' : 'var(--surface-3)',
                  padding: '1px 4px',
                  borderRadius: '4px'
                }}>
                  {metrics.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Map Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginTop: '1.5rem', 
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--surface)', border: '1px solid var(--border-strong)' }} aria-hidden="true"></span>
          No projects
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--good-soft)', border: '1px solid var(--good)' }} aria-hidden="true"></span>
          Completed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--brand-soft)', border: '1px solid var(--brand-ink)' }} aria-hidden="true"></span>
          Active
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--warn-soft)', border: '1px solid var(--warn)' }} aria-hidden="true"></span>
          Has delays
        </div>
      </div>
    </div>
  );
};
