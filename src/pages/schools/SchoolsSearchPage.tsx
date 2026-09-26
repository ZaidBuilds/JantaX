import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../core/services/api';
import type { SchoolRecord } from '../../modules/school/types';
import { Search, MapPin, GraduationCap, Filter, Download, Plus, AlertTriangle, X } from 'lucide-react';
import { SkeletonCard } from '../../components/data-states';

export function SchoolsSearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [pin, setPin] = useState(searchParams.get('pin') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'all');
  const [management, setManagement] = useState(searchParams.get('management') || 'all');
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = () => {
    if (!query.trim() && !pin.trim()) return;
    setLoading(true);
    setSearched(true);
    const searchPin = pin.trim() || query.trim().match(/^\d{6}$/)?.[0] || '';
    api.getSchools(searchPin).then((res: any) => {
      setSchools(res.records?.school || res || []);
      setLoading(false);
    }).catch(() => {
      setSchools([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    const q = searchParams.get('q');
    const p = searchParams.get('pin');
    if (q) setQuery(q);
    if (p) setPin(p);
    if (q || p) doSearch();
  }, []);

  const filtered = useMemo(() => {
    let list = schools;
    if (query.trim() && !/^\d{6}$/.test(query)) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.titleEnglish.toLowerCase().includes(q) ||
        s.titleHindi.includes(q) ||
        s.udiseCode.toLowerCase().includes(q)
      );
    }
    if (level !== 'all') list = list.filter(s => s.schoolLevel === level);
    if (management !== 'all') list = list.filter(s => s.managementType === management);
    return list;
  }, [schools, query, level, management]);

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Search Schools</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Search by school name, UDISE code, or PIN code</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="School name, UDISE code, or type…"
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ width: 140, position: 'relative' }}>
            <MapPin size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="PIN code"
              className="form-input"
              style={{ paddingLeft: '2rem', fontSize: '0.9rem' }}
            />
          </div>
          <button onClick={doSearch} className="search-action-btn" style={{ borderRadius: 10, padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
            Search
          </button>
          <button onClick={() => setShowFilters(v => !v)} style={{ padding: '0.6rem 0.75rem', borderRadius: 10, border: '1px solid var(--border)', background: showFilters ? 'var(--color-primary)' : 'var(--surface)', color: showFilters ? 'var(--on-solid)' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <Filter size={14} /> Filters
          </button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--surface-2)', borderRadius: 10 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>School Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="form-input" style={{ fontSize: '0.82rem' }}>
                <option value="all">All Levels</option>
                <option value="Primary">Primary</option>
                <option value="Upper Primary">Upper Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Higher Secondary">Higher Secondary</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Management</label>
              <select value={management} onChange={e => setManagement(e.target.value)} className="form-input" style={{ fontSize: '0.82rem' }}>
                <option value="all">All</option>
                <option value="Government">Government</option>
                <option value="Aided">Aided</option>
                <option value="Private">Private</option>
              </select>
            </div>
            {(level !== 'all' || management !== 'all') && (
              <button onClick={() => { setLevel('all'); setManagement('all'); }} style={{ alignSelf: 'flex-end', padding: '0.45rem 0.75rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--bad)', fontWeight: 600 }}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {loading && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} variant="default" />)}
          </div>
        )}

        {!loading && searched && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <GraduationCap size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No schools found</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Try a different search term or PIN code.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', opacity: 0.6 }}>
              {filtered.length} school{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {filtered.slice(0, 20).map(school => (
                <SchoolSearchResultCard key={school.id} school={school} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SchoolSearchResultCard({ school }: { school: SchoolRecord }) {
  const scoreColor = school.groundTruthScore >= 70 ? 'var(--good)' : school.groundTruthScore >= 40 ? 'var(--warn)' : 'var(--bad)';
  return (
    <Link
      to={`/schools/${school.id}`}
      style={{
        color: 'inherit',
        textDecoration: 'none',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1rem',
        cursor: 'pointer',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-ink)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--border-strong)', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--brand-ink)', background: 'var(--brand-soft)' }} aria-hidden="true">
          <GraduationCap size={24} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
          {school.titleHindi || school.titleEnglish}
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span><MapPin size={11} style={{ verticalAlign: '-1px' }} /> {school.location.district}, {school.location.pinCode}</span>
          <span>· UDISE: {school.udiseCode}</span>
          <span>· {school.schoolLevel}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          {school.managementType !== 'Government' && (
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: 'var(--brand-soft)', color: 'var(--viz-4)', fontWeight: 600 }}>{school.managementType}</span>
          )}
          {school.groundTruthScore > 0 && (
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: `${scoreColor}15`, color: scoreColor, fontWeight: 700 }}>
              Ground: {school.groundTruthScore}/100
            </span>
          )}
          {school.totalCheckIns > 0 && (
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--ink-3)', fontWeight: 600 }}>
              {school.totalCheckIns} check-ins
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {school.groundTruthScore > 0 && (
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{school.groundTruthScore}</div>
        )}
      </div>
    </Link>
  );
}
