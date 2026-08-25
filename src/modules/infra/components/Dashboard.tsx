import React, { useState, useMemo } from 'react';
import type { Project } from '../../../core/types/Project';
import { ProjectCard } from './ProjectCard';
import { StateMap } from '../../../core/components/StateMap/StateMap';
import { SourceBadge } from '../../../components/UI/SourceBadge';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  selectedState: string;
  onSelectState: (state: string) => void;
  pinContext?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onSelectProject,
  selectedState,
  onSelectState,
  pinContext
}) => {
  // Local filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // 1. Calculate General Aggregated Metrics
  const metrics = useMemo(() => {
    const total = projects.length;
    const construction = projects.filter(p => p.status === 'Construction').length;
    const delayed = projects.filter(p => p.status === 'Delayed').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const approved = projects.filter(p => p.status === 'Approved').length;
    
    let totalBudgetAnticipated = 0;
    let totalCostOverrun = 0;
    
    projects.forEach(p => {
      totalBudgetAnticipated += p.budgetAnticipated;
      const overrun = p.budgetAnticipated - p.budgetOriginal;
      if (overrun > 0) {
        totalCostOverrun += overrun;
      }
    });

    return {
      total,
      construction,
      delayed,
      completed,
      approved,
      totalBudget: totalBudgetAnticipated.toLocaleString('en-IN'),
      totalOverrun: totalCostOverrun.toLocaleString('en-IN')
    };
  }, [projects]);

  // 2. Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = (p.pinCode || '').includes(searchQuery) ||
                            (p.nameEnglish || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.nameHindi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.nameRegional || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.implementingAgency || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector ? p.sector === selectedSector : true;
      const matchesStatus = selectedStatus ? p.status === selectedStatus : true;
      const matchesState = selectedState ? (p.state || '') === selectedState : true;
      const matchesPin = pinContext ? (p.pinCode || '') === pinContext : true;

      const startYear = p.startDate.split('-')[0];
      const matchesYear = selectedYear ? startYear === selectedYear : true;

      return matchesSearch && matchesSector && matchesStatus && matchesState && matchesPin && matchesYear;
    });
  }, [projects, searchQuery, selectedSector, selectedStatus, selectedState, selectedYear, pinContext]);

  // 3. Sector Distribution Calculations for CSS Chart
  const sectorMetrics = useMemo(() => {
    const sectors: Record<string, number> = {};
    projects.forEach(p => {
      sectors[p.sector] = (sectors[p.sector] || 0) + 1;
    });
    return Object.entries(sectors).map(([name, count]) => ({
      name,
      count,
      percent: (count / projects.length) * 100
    }));
  }, [projects]);

  // 3b. Year-Wise Budget Growth Calculations for vertical bar chart
  const yearMetrics = useMemo(() => {
    const years: Record<string, number> = {};
    projects.forEach(p => {
      const startYear = p.startDate.split('-')[0];
      years[startYear] = (years[startYear] || 0) + p.budgetAnticipated;
    });
    
    const sorted = Object.entries(years)
      .map(([year, budget]) => ({ year, budget }))
      .sort((a, b) => Number(a.year) - Number(b.year));
      
    const maxBudget = Math.max(...sorted.map(s => s.budget), 1);
    
    return sorted.map(s => ({
      ...s,
      heightPercent: (s.budget / maxBudget) * 75 // max height 75% for labeling buffer
    }));
  }, [projects]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 4. Aggregated Statistics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem' 
      }}>
        {/* Total Budget Card */}
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MONITORED BUDGET</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>₹{metrics.totalBudget} Cr</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Across central sector projects</span>
        </div>

        {/* Total Escalation Card */}
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--status-critical)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CUMULATIVE ESCALATION</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--status-critical)' }}>₹{metrics.totalOverrun} Cr</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total project cost overruns</span>
        </div>

        {/* Construction Count */}
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>UNDER CONSTRUCTION</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--status-construction)' }}>{metrics.construction}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span className="pulse-dot construction"></span> Active execution phase
          </div>
        </div>

        {/* Delayed Count */}
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PROJECTS DELAYED</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--status-delayed)' }}>{metrics.delayed}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span className="pulse-dot delayed"></span> Regulatory/terrain bottlenecks
          </div>
        </div>

        {/* Completed Count */}
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COMPLETED ASSETS</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--status-completed)' }}>{metrics.completed}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span className="pulse-dot completed"></span> Commissioned & operating
          </div>
        </div>
      </div>

      {/* 5. Main Dashboard Layout splits */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '2rem',
        alignItems: 'start'
      }} className="responsive-split">
        
        {/* Style helper for responsive splitting */}
        <style>{`
          @media (min-width: 992px) {
            .responsive-split {
              grid-template-columns: 7fr 5fr !important;
            }
          }
        `}</style>

        {/* Left Column: Filters and Project Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filter Toolbar */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Filter Operations</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '0.75rem' 
            }}>
              {/* Text Search */}
              <input 
                type="text" 
                placeholder="पिन कोड या नाम / PIN or Name..." 
                className="form-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Sector Selector */}
              <select 
                className="form-input"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">All Sectors</option>
                <option value="Roads">Roads & Highways</option>
                <option value="Railways">Railways</option>
                <option value="Power">Power & Energy</option>
                <option value="Water">Water & Sanitation</option>
                <option value="Urban">Urban Infrastructure</option>
                <option value="Aviation">Aviation & Space</option>
              </select>

              {/* Status Selector */}
              <select 
                className="form-input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Construction">Under Construction</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            {/* Active filters display */}
            {selectedState && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Filtering by Region:</span>
                <span style={{ 
                  padding: '2px 8px', 
                  background: 'rgba(0, 242, 254, 0.1)', 
                  border: '1px solid var(--color-primary)', 
                  color: 'var(--color-primary)', 
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {selectedState}
                </span>
                <button 
                  onClick={() => onSelectState('')}
                  style={{ border: 'none', background: 'transparent', color: 'var(--status-critical)', cursor: 'pointer', fontWeight: 600 }}
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>

          {/* Project Cards Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Projects Ledger ({filteredProjects.length})
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <SourceBadge sourceType="A" sourceName="MoSPI PAIMANA" />
                {pinContext && <SourceBadge sourceType="C" sourceName="JantaX Citizens" />}
              </div>
              {filteredProjects.length === 0 && (
                <span style={{ fontSize: '0.85rem', color: 'var(--status-critical)' }}>No matches found</span>
              )}
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.25rem' 
            }}>
              {filteredProjects.map((p) => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onSelect={onSelectProject} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: State Map & Sector Distribution Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>
          
          {/* Map Integration */}
          <StateMap 
            selectedState={selectedState} 
            onSelectState={onSelectState} 
            projects={projects} 
          />

          {/* Budget Allocations Growth Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Budget Allocations Growth</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click years to filter timeline initiates</p>
              </div>
              {selectedYear && (
                <button
                  onClick={() => setSelectedYear('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--status-critical)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear Year
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              height: '140px',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.5rem',
              gap: '0.5rem',
              paddingTop: '1.5rem'
            }}>
              {yearMetrics.map((data) => {
                const isActive = selectedYear === data.year;
                const formattedBudget = data.budget >= 1000 
                  ? `₹${(data.budget / 1000).toFixed(1)}k Cr` 
                  : `₹${data.budget} Cr`;

                return (
                  <div
                    key={data.year}
                    onClick={() => setSelectedYear(isActive ? '' : data.year)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      height: '100%',
                      justifyContent: 'end',
                      position: 'relative'
                    }}
                    title={`${data.year} Total Allocation: ₹${data.budget} Cr`}
                  >
                    {/* Budget Label above bar */}
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                      position: 'absolute',
                      bottom: `${data.heightPercent + 4}%`,
                      whiteSpace: 'nowrap',
                      background: 'rgba(255,255,255,0.7)',
                      padding: '1px 3px',
                      borderRadius: '3px'
                    }}>
                      {formattedBudget}
                    </span>

                    {/* Bar visual */}
                    <div style={{
                      width: '100%',
                      maxWidth: '30px',
                      height: `${data.heightPercent}%`,
                      background: isActive 
                        ? 'linear-gradient(0deg, var(--color-accent) 0%, var(--color-primary) 100%)' 
                        : 'linear-gradient(0deg, rgba(37, 99, 235, 0.2) 0%, var(--color-primary) 70%)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: isActive ? '0 0 12px rgba(37, 99, 235, 0.3)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'linear-gradient(0deg, rgba(37, 99, 235, 0.4) 0%, var(--color-primary) 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'linear-gradient(0deg, rgba(37, 99, 235, 0.2) 0%, var(--color-primary) 70%)';
                      }
                    }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels (Years) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              {yearMetrics.map((data) => (
                <div
                  key={data.year}
                  onClick={() => setSelectedYear(selectedYear === data.year ? '' : data.year)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: selectedYear === data.year ? 700 : 500,
                    color: selectedYear === data.year ? 'var(--color-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '2px 0'
                  }}
                >
                  {data.year}
                </div>
              ))}
            </div>
          </div>

          {/* Sector Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Sector Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sectorMetrics.map((sec) => (
                <div key={sec.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{sec.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{sec.count} projects ({Math.round(sec.percent)}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${sec.percent}%`, 
                      background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
