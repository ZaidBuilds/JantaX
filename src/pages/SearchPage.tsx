import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, Share2, MapPin, Clock, SlidersHorizontal, SearchX } from 'lucide-react';
import { EmptyState } from '../components/UI/EmptyState';
import { SourceBadge } from '../components/UI/SourceBadge';

interface ReraProject { name: string; status: string; color: string; location: string; reraNo: string; config: string; posDate: string; delay: string; expected: string; img: string; }
interface PublicProject { name: string; status: string; color: string; location: string; dept: string; budget: string; start: string; completion: string; delay: string; img: string; }
interface Contractor { name: string; verified: boolean; score: number; total: number; completed: number; ongoing: number; delayed: number; registered: string; }
interface Issue { title: string; place: string; count: string; time: string; badge: string; img: string; }

const PAGE_SIZE = 5;

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || 'abc developers');
  const [activeTab, setActiveTab] = useState<'all' | 'rera' | 'public' | 'contractor' | 'issues'>('all');
  const [category, setCategory] = useState('All Categories');
  const [location, setLocation] = useState('');
  const [pinFilter, setPinFilter] = useState('');
  const [enabled, setEnabled] = useState({ rera: true, public: true, contractor: true, issues: true });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || 'abc developers');
    setPage(1);
  }, [searchParams]);

  const reraProjects: ReraProject[] = [
    { name: 'ABC Developers – Green Meadows', status: 'Registered', color: '#10b981', location: 'Gurugram, Haryana', reraNo: 'GGM/415/2022/56', config: '2, 3 BHK Apartments', posDate: 'Dec 2025', delay: 'Delay: 6 Months', expected: 'Expected: Jun 2026', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80' },
    { name: 'ABC Developers – Sky Heights', status: 'Ongoing', color: '#f97316', location: 'Noida, Uttar Pradesh', reraNo: 'UPRERAPRJ123456', config: '2, 3, 4 BHK Apartments', posDate: 'Mar 2026', delay: 'On Track', expected: 'Expected: Mar 2026', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80' },
    { name: 'ABC Developers – Park View Residences', status: 'Delayed', color: '#ef4444', location: 'Ghaziabad, Uttar Pradesh', reraNo: 'UPRERAPRJ654321', config: '2 BHK Apartments', posDate: 'Dec 2024', delay: 'Delay: 10 Months', expected: 'Expected: Oct 2025', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80' }
  ];

  const publicProjects: PublicProject[] = [
    { name: 'Construction of Road from Sector 50 to Sector 68', status: 'Ongoing', color: '#f97316', location: 'Gurugram, Haryana', dept: 'PWD, Haryana', budget: '₹ 12.45 Cr', start: '15 Aug 2023', completion: '15 Dec 2024', delay: 'Delayed 35% Completed', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&q=80' },
    { name: 'Storm Water Drain Improvement Project', status: 'Ongoing', color: '#f97316', location: 'Noida, Uttar Pradesh', dept: 'Noida Authority', budget: '₹ 8.78 Cr', start: '10 Jan 2024', completion: '10 Jul 2024', delay: 'On Track 65% Completed', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80' }
  ];

  const contractors: Contractor[] = [
    { name: 'ABC Developers Pvt. Ltd.', verified: true, score: 72, total: 78, completed: 42, ongoing: 28, delayed: 8, registered: 'Haryana' },
    { name: 'ABC Developers & Infrastructure', verified: true, score: 68, total: 54, completed: 26, ongoing: 20, delayed: 8, registered: 'Uttar Pradesh' }
  ];

  const issues: Issue[] = [
    { title: 'Delay in possession – ABC Developers', place: 'Gurugram, Haryana', count: '23 reports', time: '2 days ago', badge: 'Rera', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=100&q=80' },
    { title: 'Poor quality road construction', place: 'Gurugram, Haryana', count: '18 reports', time: '5 days ago', badge: 'Public Works', img: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=100&q=80' }
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matches = (values: string[]) => !normalizedQuery || values.some(v => v.toLowerCase().includes(normalizedQuery));
  const matchesFilters = (values: string[]) =>
    (category === 'All Categories' || category === 'RERA Projects' && values.some(v => v.includes('RERA')) || category === 'Public Projects' && values.some(v => v.includes('Public')) || category === 'Contractors' && values.some(v => v.includes('Contractor')) || category === 'Reports & Issues' && values.some(v => v.includes('Issue'))) &&
    (!location.trim() || values.some(v => v.toLowerCase().includes(location.trim().toLowerCase()))) &&
    (!pinFilter.trim() || values.some(v => v.includes(pinFilter.trim())));

  const visibleRera = reraProjects.filter(p => matches([p.name, p.location, p.reraNo]) && matchesFilters([p.name, p.location, p.reraNo, 'RERA']));
  const visiblePublic = publicProjects.filter(p => matches([p.name, p.location, p.dept]) && matchesFilters([p.name, p.location, p.dept, 'Public']));
  const visibleContractors = contractors.filter(c => matches([c.name, c.registered]) && matchesFilters([c.name, c.registered, 'Contractor']));
  const visibleIssues = issues.filter(i => matches([i.title, i.place, i.badge]) && matchesFilters([i.title, i.place, i.badge, 'Issue']));

  const counts = {
    all: (enabled.rera ? visibleRera.length : 0) + (enabled.public ? visiblePublic.length : 0) + (enabled.contractor ? visibleContractors.length : 0) + (enabled.issues ? visibleIssues.length : 0),
    rera: visibleRera.length,
    public: visiblePublic.length,
    contractor: visibleContractors.length,
    issues: visibleIssues.length,
  };

  const visibleReraPage = visibleRera.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visiblePublicPage = visiblePublic.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleContractorsPage = visibleContractors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleIssuesPage = visibleIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPages = useMemo(() => {
    // Correct pagination: per active tab, not max across tabs — killer fix
    const activeLists: Record<string, number> = {
      all: counts.all,
      rera: counts.rera,
      public: counts.public,
      contractor: counts.contractor,
      issues: counts.issues,
    };
    const relevant = activeTab === 'all' ? Math.max(counts.rera, counts.public, counts.contractor, counts.issues) : (activeLists[activeTab] || 0);
    // For "all" we show paginated per-section, so total pages is max of sections
    // For specific tab, pages based on that tab's count
    const countForTab = activeTab === 'all' ? Math.max(counts.rera, counts.public, counts.contractor, counts.issues) : (activeTab === 'rera' ? counts.rera : activeTab === 'public' ? counts.public : activeTab === 'contractor' ? counts.contractor : counts.issues);
    return Math.max(1, Math.ceil(countForTab / PAGE_SIZE));
  }, [visibleRera, visiblePublic, visibleContractors, visibleIssues, activeTab, counts.all, counts.rera, counts.public, counts.contractor, counts.issues]);

  const clearFilters = () => { setCategory('All Categories'); setLocation(''); setPinFilter(''); setEnabled({ rera: true, public: true, contractor: true, issues: true }); setPage(1); };

  const sidebar = (
    <aside className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Refine Your Search</h3>
        <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear All</button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Search in</label>
        <select className="form-input" style={{ fontSize: '0.8rem' }} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option>All Categories</option>
          <option>RERA Projects</option>
          <option>Public Projects</option>
          <option>Contractors</option>
          <option>Reports & Issues</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'grid', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>State</label>
          <select className="form-input" style={{ fontSize: '0.8rem' }}><option>All States</option></select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>District</label>
          <select className="form-input" style={{ fontSize: '0.8rem' }}><option>All Districts</option></select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>PIN Code</label>
          <input type="text" placeholder="Enter PIN code" className="form-input" style={{ fontSize: '0.8rem' }} value={pinFilter} onChange={(e) => { setPinFilter(e.target.value.replace(/\D/g, '').slice(0, 6)); setPage(1); }} />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Category</label>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={enabled.rera} onChange={(e) => setEnabled(s => ({ ...s, rera: e.target.checked })) } /> RERA Projects</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={enabled.public} onChange={(e) => setEnabled(s => ({ ...s, public: e.target.checked })) } /> Public Projects</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={enabled.contractor} onChange={(e) => setEnabled(s => ({ ...s, contractor: e.target.checked })) } /> Contractors</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={enabled.issues} onChange={(e) => setEnabled(s => ({ ...s, issues: e.target.checked })) } /> Reports & Issues</label>
        </div>
      </div>

      <button className="search-action-btn" style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }} onClick={() => setPage(1)}>Apply Filters</button>
    </aside>
  );

  return (
    <div className="container search-layout" style={{ padding: '2rem 1rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ width: '260px', flexShrink: 0 }}>{sidebar}</div>

      {/* Mobile filters drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white w-[280px] max-w-[85%] h-full overflow-y-auto p-4 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="md:hidden" style={{ marginBottom: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>Search results for "{searchQuery}"</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{counts.all} results across all categories</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="time-tab" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Bookmark size={14} /> Save</button>
            <button className="search-action-btn" style={{ borderRadius: '8px', fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Share2 size={14} /> Share</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
          <button onClick={() => { setActiveTab('all'); setPage(1); }} className={`time-tab ${activeTab === 'all' ? 'active' : ''}`}>All ({counts.all})</button>
          <button onClick={() => { setActiveTab('rera'); setPage(1); }} className={`time-tab ${activeTab === 'rera' ? 'active' : ''}`}>RERA ({counts.rera})</button>
          <button onClick={() => { setActiveTab('public'); setPage(1); }} className={`time-tab ${activeTab === 'public' ? 'active' : ''}`}>Public ({counts.public})</button>
          <button onClick={() => { setActiveTab('contractor'); setPage(1); }} className={`time-tab ${activeTab === 'contractor' ? 'active' : ''}`}>Contractors ({counts.contractor})</button>
          <button onClick={() => { setActiveTab('issues'); setPage(1); }} className={`time-tab ${activeTab === 'issues' ? 'active' : ''}`}>Reports ({counts.issues})</button>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {counts.all === 0 && (
            <EmptyState title="No results for this PIN / query" desc="Try a PIN code, project, school, contractor, or location. Clear filters or try 110001." action={<button onClick={()=>{setSearchQuery(''); setCategory('All Categories'); setLocation(''); setPinFilter(''); setEnabled({rera:true,public:true,contractor:true,issues:true}); setPage(1);}} className="btn btn-secondary" style={{ fontSize:'0.78rem' }}>Clear filters</button>} />
          )}

          {(activeTab === 'rera') && enabled.rera && visibleReraPage.length === 0 && (
            <EmptyState title="No RERA projects found" desc="Try a different builder, project name, or clear filters." action={<button onClick={clearFilters} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Clear filters</button>} />
          )}
          {(activeTab === 'public') && enabled.public && visiblePublicPage.length === 0 && (
            <EmptyState title="No public projects found" desc="Try a different department, location, or clear filters." action={<button onClick={clearFilters} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Clear filters</button>} />
          )}
          {(activeTab === 'contractor') && enabled.contractor && visibleContractorsPage.length === 0 && (
            <EmptyState title="No contractors found" desc="Try a different name or registration state." action={<button onClick={clearFilters} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Clear filters</button>} />
          )}
          {(activeTab === 'issues') && enabled.issues && visibleIssuesPage.length === 0 && (
            <EmptyState title="No reports found" desc="Try a different keyword or location." action={<button onClick={clearFilters} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Clear filters</button>} />
          )}

          {(activeTab === 'all' || activeTab === 'rera') && enabled.rera && visibleReraPage.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>RERA Projects <SourceBadge sourceType="A" sourceName="RERA" /></h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {visibleReraPage.map((p, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{p.name}</h4>
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: `${p.color}15`, color: p.color, fontWeight: 700 }}>{p.status}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.2rem 0' }}><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{p.location} · {p.reraNo} · {p.config}</p>
                      <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}><Clock size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{p.delay} ({p.expected})</span>
                    </div>
                    <button className="time-tab" onClick={() => navigate('/module/rera')}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'public') && enabled.public && visiblePublicPage.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Public Projects <SourceBadge sourceType="A" sourceName="PMGSY/PWD" /></h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {visiblePublicPage.map((p, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{p.name}</h4>
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: `${p.color}15`, color: p.color, fontWeight: 700 }}>{p.status}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.2rem 0' }}><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{p.location} · Dept: {p.dept} · Budget: {p.budget}</p>
                      <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 700 }}><Clock size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{p.delay}</span>
                    </div>
                    <button className="time-tab" onClick={() => navigate('/module/infra')}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'contractor') && enabled.contractor && visibleContractorsPage.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Contractors <SourceBadge sourceType="A" sourceName="MCA/Contractor Reg." /></h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {visibleContractorsPage.map((c, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{c.name}</h4>
                        {c.verified && <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>✓ Verified</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8, flexWrap: 'wrap' }}>
                        <span>Total: <strong>{c.total}</strong></span>
                        <span>Completed: <strong style={{ color: '#10b981' }}>{c.completed}</strong></span>
                        <span>Active: <strong>{c.ongoing}</strong></span>
                        <span>Delayed: <strong style={{ color: '#ef4444' }}>{c.delayed}</strong></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>{c.score}</div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>Score / 100</div>
                      </div>
                      <button className="time-tab" onClick={() => navigate('/module/contractor')}>View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'issues') && enabled.issues && visibleIssuesPage.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Reports & Issues <SourceBadge sourceType="C" sourceName="JantaX Citizens" /></h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {visibleIssuesPage.map((issue, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                      <img src={issue.img} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{issue.title}</h4>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.25rem 0' }}><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{issue.place}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{issue.count} · {issue.time}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>{issue.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Prev</button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
