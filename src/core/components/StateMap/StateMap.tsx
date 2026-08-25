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
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Geographic Project Hotspots</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click states to filter regional development parameters</p>
        </div>
        {selectedState && (
          <button 
            onClick={() => onSelectState("")}
            style={{
              padding: '0.35rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Clear Filter
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
          let borderStyle = '1px solid var(--border-color)';
          let bgStyle = 'rgba(18, 20, 28, 0.4)';
          let glowClass = '';
          
          if (metrics.count > 0) {
            if (metrics.hasDelayed) {
              borderStyle = '1px solid var(--status-delayed)';
              bgStyle = 'rgba(245, 158, 11, 0.06)';
            } else if (metrics.allCompleted) {
              borderStyle = '1px solid var(--status-completed)';
              bgStyle = 'rgba(16, 185, 129, 0.06)';
            } else {
              borderStyle = '1px solid var(--color-primary)';
              bgStyle = 'rgba(0, 242, 254, 0.06)';
            }
          }
          
          if (isSelected) {
            borderStyle = `2px solid ${metrics.hasDelayed ? 'var(--status-delayed)' : 'var(--color-primary)'}`;
            bgStyle = metrics.hasDelayed ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 242, 254, 0.15)';
            glowClass = 'selected-glow';
          }

          return (
            <button
              key={node.id}
              onClick={() => onSelectState(node.name)}
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
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                fontFamily: 'var(--font-heading)'
              }}>
                {node.id}
              </span>
              
              {metrics.count > 0 && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 600, 
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  marginTop: '0.1rem',
                  background: 'rgba(0,0,0,0.3)',
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
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}></span>
          No Projects
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-completed)' }}></span>
          Completed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }}></span>
          Active
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-delayed)' }}></span>
          Has Delays
        </div>
      </div>
    </div>
  );
};
