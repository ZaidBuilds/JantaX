import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../core/services/api';
import type { SchoolRecord } from '../modules/school/types';
import { GraduationCap, Search, MapPin, Download, AlertTriangle, Star, Filter, DownloadCloud } from 'lucide-react';

/**
 * JantaX Schools Directory Page
 * Replicates Mockup Image 02 exactly:
 * - Left filter sidebar with checkbox counts
 * - Top header row with "Download List" & "+ Report an Issue"
 * - 5 metric overview cards
 * - Search results layout with list items showing thumbnails, tags, UDISE codes, scores & sub-ratings
 * - Pagination bar at bottom
 */
export function SchoolsDirectory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pinFromUrl = searchParams.get('pin') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolType, setSelectedSchoolType] = useState<string>('all');
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getSchools(pinFromUrl || '').then((res: any) => {
      if (!cancelled) {
        setSchools(res.records?.school || []);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [pinFromUrl]);
  
  const statsCards = [
    { label: 'Total Schools', value: '1,48,732', sub: 'Across India', icon: GraduationCap, color: '#64748b' },
    { label: 'Schools with Data', value: '1,12,409', sub: '76% of total', icon: Search, color: '#3b82f6' },
    { label: 'Need Attention', value: '42,871', sub: '29% of total', icon: AlertTriangle, color: '#f97316' },
    { label: 'Critical Condition', value: '13,245', sub: '9% of total', icon: AlertTriangle, color: '#ef4444' },
    { label: 'Top Rated Schools', value: '8,732', sub: '6% of total', icon: Star, color: '#8b5cf6' }
  ];

  const PAGE_SIZE_SD = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSchools = useMemo(() => {
    let list = schools;
    if (pinFromUrl) {
      list = list.filter(s => s.location.pinCode === pinFromUrl);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.titleEnglish.toLowerCase().includes(q) ||
        s.titleHindi.includes(q) ||
        s.udiseCode.includes(q) ||
        s.location.pinCode.includes(q) ||
        s.location.district.toLowerCase().includes(q)
      );
    }
    if (selectedSchoolType !== 'all') {
      list = list.filter(s => s.schoolLevel === selectedSchoolType);
    }
    return list;
  }, [pinFromUrl, searchQuery, selectedSchoolType, schools]);

  useEffect(() => { setCurrentPage(1); }, [pinFromUrl, searchQuery, selectedSchoolType]);

  const totalPagesSd = Math.max(1, Math.ceil(filteredSchools.length / PAGE_SIZE_SD));
  const pagedSchools = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE_SD;
    return filteredSchools.slice(start, start + PAGE_SIZE_SD);
  }, [filteredSchools, currentPage]);

  return (
    <div className="container schools-layout" style={{ padding: '2rem 1rem', display: 'flex', gap: '2rem' }}>
      
      {/* Left Filter Sidebar */}
      <aside style={{ width: '260px', flexShrink: 0 }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Filters</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}>Clear All</span>
          </div>

          {/* Location Filters */}
          <div style={{ marginBottom: '1.25rem', display: 'grid', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>Location</label>
              <select className="form-input" style={{ fontSize: '0.8rem' }}><option>All States</option></select>
            </div>
            <div>
              <select className="form-input" style={{ fontSize: '0.8rem' }}><option>All Districts</option></select>
            </div>
            <div>
              <select className="form-input" style={{ fontSize: '0.8rem' }}><option>All Blocks</option></select>
            </div>
            <div>
              <input type="text" placeholder="Search city or village" className="form-input" style={{ fontSize: '0.8rem' }} />
            </div>
            <div>
              <input type="text" placeholder="Enter PIN code" className="form-input" style={{ fontSize: '0.8rem' }} />
            </div>
          </div>

          {/* School Type Checkboxes */}
          <div style={{ marginBottom: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>School Type</label>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><input type="checkbox" checked={selectedSchoolType === 'all'} onChange={() => setSelectedSchoolType('all')} /> All Types</span>
                <span style={{ opacity: 0.5 }}>78,231</span>
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><input type="checkbox" checked={selectedSchoolType === 'Primary'} onChange={() => setSelectedSchoolType('Primary')} /> Primary (1 to 5)</span>
                <span style={{ opacity: 0.5 }}>45,765</span>
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><input type="checkbox" checked={selectedSchoolType === 'Upper Primary'} onChange={() => setSelectedSchoolType('Upper Primary')} /> Upper Primary (6 to 8)</span>
                <span style={{ opacity: 0.5 }}>16,842</span>
              </label>
            </div>
          </div>

          {/* Management Checkboxes */}
          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Management</label>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><input type="checkbox" defaultChecked /> All</span>
                <span style={{ opacity: 0.5 }}>1,25,873</span>
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><input type="checkbox" /> Government</span>
                <span style={{ opacity: 0.5 }}>15,327</span>
              </label>
            </div>
          </div>

          <button className="search-action-btn" style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}>Apply Filters</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header Action row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0 }}>Schools Directory</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Find and explore government schools across India with real data and ground truth insights.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="time-tab" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DownloadCloud size={14} /> Download List</button>
            <button className="search-action-btn" style={{ borderRadius: '8px', fontSize: '0.85rem' }} onClick={() => navigate('/module/school')}>+ Report an Issue</button>
          </div>
        </div>

        {/* 5 Stats overview row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {statsCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '1rem', borderTop: `3px solid ${c.color}`, textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <Icon size={20} style={{ color: c.color }} />
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.15rem 0' }}>{c.value}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{c.label}</div>
                <div style={{ fontSize: '0.62rem', opacity: 0.5 }}>{c.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Search Results list selectors */}
        <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.6rem', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search within results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '280px', paddingLeft: '2rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Sort by:</span>
            <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem', height: 'auto' }}>
              <option>Health Score (High to Low)</option>
            </select>

            <button className="time-tab active" style={{ padding: '0.35rem 0.75rem' }}>List View</button>
            <button className="time-tab" style={{ padding: '0.35rem 0.75rem' }} onClick={() => navigate('/maps')}>Map View</button>
          </div>
        </div>

        {/* Results count text */}
        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
          Showing {(currentPage-1)*PAGE_SIZE_SD + 1} - {Math.min(currentPage*PAGE_SIZE_SD, filteredSchools.length)} of {filteredSchools.length} schools {loading ? '(loading…)' : ''}
        </div>

        {/* List items cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading && <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}><div className="skeleton" style={{ height: '18px', width: '40%', margin: '0 auto 1rem' }} /><div className="skeleton" style={{ height: '90px' }} /></div>}
          {!loading && pagedSchools.map((school, idx) => {
            const scoreColor = school.groundTruthScore >= 70 ? '#10b981' : school.groundTruthScore >= 40 ? '#f97316' : '#ef4444';
            const badgeBg = school.schoolLevel === 'Primary' ? '#dcfce7' : '#dbeafe';
            const badgeColor = school.schoolLevel === 'Primary' ? '#166534' : '#1e40af';

            return (
              <div key={school.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {/* Thumbnail */}
                <div style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-control)', overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                  <img src={idx === 0 ? "https://images.unsplash.com/photo-1577896851231-70ee18881754?auto=format&fit=crop&w=200&q=80" : "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80"} alt={school.titleEnglish} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{school.titleHindi}</h4>
                    <span className="badge" style={{ background: badgeBg, color: badgeColor, fontSize: '0.65rem' }}>
                      {school.schoolLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.6, margin: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> {school.location.district} · UDISE: {school.udiseCode} · Students: {school.officialStudentCount} · Teachers: {school.officialTeacherCount}
                  </div>
                </div>

                {/* Health Score */}
                <div style={{ textAlign: 'center', width: '100px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreColor }}>{school.groundTruthScore}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>Health Score</div>
                </div>

                {/* Sub ratings column breakdown */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', width: '200px' }}>
                  <div style={{ display: 'grid', gap: '0.2rem' }}>
                    <div><GraduationCap size={11} style={{ verticalAlign: '-1px', marginRight: 2 }} /> Infra: <strong>62/100</strong></div>
                    <div><GraduationCap size={11} style={{ verticalAlign: '-1px', marginRight: 2 }} /> Teachers: <strong>72/100</strong></div>
                    <div><GraduationCap size={11} style={{ verticalAlign: '-1px', marginRight: 2 }} /> Attendance: <strong>65/100</strong></div>
                  </div>
                </div>

                {/* View Details button */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <button className="time-tab active" onClick={() => navigate(`/module/school?id=${school.id}`)}>View Details →</button>
                  <div style={{ fontSize: '0.62rem', opacity: 0.5, marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                    <span style={{ color: '#10b981' }}>✓</span> Data Available
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination bar — Killer functional */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" disabled={currentPage===1} onClick={() => setCurrentPage(p => Math.max(1, p-1))} style={{ padding: '0.35rem 0.75rem', opacity: currentPage===1?0.5:1 }}>‹ Prev</button>
          {Array.from({ length: Math.min(totalPagesSd, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPagesSd <= 5) pageNum = i+1;
            else if (currentPage <= 3) pageNum = i+1;
            else if (currentPage >= totalPagesSd-2) pageNum = totalPagesSd -4 + i;
            else pageNum = currentPage -2 + i;
            return (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`time-tab ${currentPage===pageNum?'active':''}`} style={{ padding: '0.35rem 0.7rem', minWidth: '34px' }}>{pageNum}</button>
            );
          })}
          {totalPagesSd > 5 && currentPage < totalPagesSd-2 && <span style={{ opacity: 0.5 }}>… {totalPagesSd}</span>}
          <button className="btn btn-secondary" disabled={currentPage===totalPagesSd} onClick={() => setCurrentPage(p => Math.min(totalPagesSd, p+1))} style={{ padding: '0.35rem 0.75rem', opacity: currentPage===totalPagesSd?0.5:1 }}>Next ›</button>
        </div>

      </div>
    </div>
  );
}
