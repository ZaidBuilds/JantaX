import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  GraduationCap,
  Construction,
  HardHat,
  Home as HomeIcon,
  Hospital,
  Wheat,
  Users,
  AlertCircle,
  Clock,
  X,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  Bookmark,
  Share2,
  History,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  useSearch,
  useAutocomplete,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  POPULAR_SEARCHES,
} from '../core/hooks/useSearch';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { SourceBadge } from '../components/UI/SourceBadge';
import {
  SkeletonCard,
  ErrorState,
  NoResultsState,
  EmptyState,
  DataFreshnessBadge,
} from '../components/data-states';
import type { SearchResult, SearchEntityType } from '../core/services/api';

const ENTITY_ICONS: Record<string, React.ElementType> = {
  school: GraduationCap,
  infra: Construction,
  rera: HomeIcon,
  hospital: Hospital,
  contractor: HardHat,
  pds: Wheat,
  issue: AlertTriangle,
  grievance: Users,
};

const ENTITY_COLORS: Record<string, string> = {
  school: '#3b82f6',
  infra: '#f59e0b',
  rera: '#06b6d4',
  hospital: '#ec4899',
  contractor: '#ef4444',
  pds: '#d97706',
  issue: '#8b5cf6',
  grievance: '#10b981',
};

const ENTITY_LABELS: Record<string, string> = {
  school: 'School',
  infra: 'Public Works',
  rera: 'RERA Project',
  hospital: 'Healthcare',
  contractor: 'Contractor',
  pds: 'Welfare Shop',
  issue: 'Issue',
  grievance: 'Grievance',
};

const MATCH_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  exact: { label: 'Exact Match', color: '#10b981' },
  related: { label: 'Related', color: '#f59e0b' },
  location: { label: 'Location Match', color: '#3b82f6' },
};

interface SearchResultCardProps {
  result: SearchResult;
  onNavigate: (result: SearchResult) => void;
}

function SearchResultCard({ result, onNavigate }: SearchResultCardProps) {
  const Icon = ENTITY_ICONS[result.type] || MapPin;
  const color = ENTITY_COLORS[result.type] || '#6b7280';
  const matchType = result.matchType || (result.score > 0.5 ? 'exact' : 'related');
  const matchInfo = MATCH_TYPE_LABELS[matchType];

  const freshnessDate = result.source.freshness ? new Date(result.source.freshness) : null;
  const status = result.metadata.status as string | undefined;
  const statusColor = status
    ? status.toLowerCase().includes('delay') || status.toLowerCase().includes('pending')
      ? '#f97316'
      : status.toLowerCase().includes('complete') || status.toLowerCase().includes('resolved')
      ? '#10b981'
      : '#6b7280'
    : '#6b7280';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      onClick={() => onNavigate(result)}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}14`,
          border: `1px solid ${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          flexShrink: 0,
        }}
      >
        <Icon size={22} strokeWidth={1.9} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {result.title}
          </h4>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              background: `${color}15`,
              color,
              textTransform: 'uppercase',
            }}
          >
            {ENTITY_LABELS[result.type] || result.type}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 4,
              background: `${matchInfo.color}15`,
              color: matchInfo.color,
            }}
          >
            {matchInfo.label}
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', opacity: 0.7, margin: '0 0 0.35rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
          {result.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.7 }}>
              <MapPin size={11} /> {result.location.district}, {result.location.state} ({result.location.pincode})
            </span>
          )}
          {status && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: statusColor }}>
              {statusColor === '#10b981' ? <CheckCircle size={11} /> : statusColor === '#f97316' ? <AlertTriangle size={11} /> : null}
              {status}
            </span>
          )}
          {freshnessDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.5 }}>
              <Clock size={11} /> Updated {freshnessDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
        <SourceBadge
          sourceType={result.source.reliability === 'high' ? 'A' : result.source.reliability === 'medium' ? 'B' : 'C'}
          sourceName={result.source.name}
        />
        <ChevronRight size={16} style={{ opacity: 0.4 }} />
      </div>
    </div>
  );
}

function SkeletonResultCard() {
  return (
    <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(initialQuery);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const {
    query,
    setQuery,
    results,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    updateFilter,
    page,
    setPage,
    total,
    refetch,
    search,
  } = useSearch({ debounceMs: 300, pageSize: 10 });

  const { suggestions, isLoading: autocompleteLoading, setQuery: setAutocompleteQuery, clear: clearAutocomplete } = useAutocomplete({ debounceMs: 200, minLength: 2 });

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
      setInputValue(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    addRecentSearch(q);
    setRecentSearches(getRecentSearches());
    setShowAutocomplete(false);
    search(q);
    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
  }, [search, navigate]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setAutocompleteQuery(value);
    if (value.length >= 2) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [setAutocompleteQuery]);

  const handleSuggestionClick = useCallback((suggestion: { text: string; type?: string; pincode?: string }) => {
    setInputValue(suggestion.text);
    clearAutocomplete();
    setShowAutocomplete(false);
    if (suggestion.pincode) {
      navigate(`/pin/${suggestion.pincode}`);
    } else {
      handleSearch(suggestion.text);
    }
  }, [clearAutocomplete, handleSearch, navigate]);

  const handleRecentClick = useCallback((q: string) => {
    setInputValue(q);
    handleSearch(q);
  }, [handleSearch]);

  const handleResultNavigate = useCallback((result: SearchResult) => {
    const typeToRoute: Record<string, string> = {
      school: 'school',
      infra: 'infra',
      rera: 'rera',
      hospital: 'hospital',
      contractor: 'contractor',
      pds: 'ration',
      issue: 'reports',
      grievance: 'reports',
    };
    const route = typeToRoute[result.type] || 'search';
    if (result.location?.pincode) {
      navigate(`/${route}?pin=${result.location.pincode}&q=${encodeURIComponent(result.title)}`);
    } else {
      navigate(`/${route}?q=${encodeURIComponent(result.title)}`);
    }
  }, [navigate]);

  const activeTypes = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const clearFilters = () => {
    updateFilter('type', undefined);
    updateFilter('pincode', undefined);
    updateFilter('state', undefined);
    updateFilter('district', undefined);
    updateFilter('status', undefined);
    setPage(1);
  };

  const handleTypeToggle = (type: string) => {
    if (filters.type === type) {
      updateFilter('type', undefined);
    } else {
      updateFilter('type', type);
    }
    setPage(1);
  };

  const sidebar = (
    <aside className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Refine Your Search</h3>
        {(filters.type || filters.pincode || filters.state || filters.status) && (
          <button className="btn btn-secondary" type="button" onClick={clearFilters} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
            Clear
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Category</label>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
          {Object.entries(ENTITY_LABELS).slice(0, 6).map(([type, label]) => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={() => handleTypeToggle(type)}
                style={{ accentColor: ENTITY_COLORS[type] }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {React.createElement(ENTITY_ICONS[type] || MapPin, { size: 14, style: { color: ENTITY_COLORS[type] } })}
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>PIN Code</label>
        <input
          type="text"
          placeholder="e.g. 110001"
          className="form-input"
          style={{ fontSize: '0.8rem' }}
          value={filters.pincode || ''}
          onChange={e => updateFilter('pincode', e.target.value.replace(/\D/g, '').slice(0, 6) || undefined)}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>State</label>
        <input
          type="text"
          placeholder="e.g. Delhi"
          className="form-input"
          style={{ fontSize: '0.8rem' }}
          value={filters.state || ''}
          onChange={e => updateFilter('state', e.target.value || undefined)}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Status</label>
        <select
          className="form-input"
          style={{ fontSize: '0.8rem' }}
          value={filters.status || ''}
          onChange={e => updateFilter('status', e.target.value || undefined)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </aside>
  );

  return (
    <div className="container" style={{ padding: '1.5rem 1rem', maxWidth: 1200 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.25rem', fontWeight: 800 }}>
          Universal Search
        </h1>
        <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Search across locations, schools, projects, contractors, builders, healthcare, schemes and issues</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }} ref={autocompleteRef}>
        <form
          onSubmit={e => { e.preventDefault(); handleSearch(inputValue); }}
          style={{ display: 'flex', gap: '0.75rem' }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              onFocus={() => inputValue.length >= 2 && setShowAutocomplete(true)}
              placeholder="Search PIN, school, builder, contractor, project, location…"
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                border: '1.5px solid var(--border-color)',
                borderRadius: 12,
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
            />
            {isLoading && (
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', opacity: 0.6 }} />
              </div>
            )}
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={() => { setInputValue(''); clearAutocomplete(); setShowAutocomplete(false); setQuery(''); inputRef.current?.focus(); }}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: 4 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-action-btn" style={{ padding: '0.85rem 1.5rem', borderRadius: 12 }}>
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={16} />
          </button>
        </form>

        {showAutocomplete && (suggestions.length > 0 || autocompleteLoading) && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 50,
              maxHeight: 360,
              overflowY: 'auto',
            }}
          >
            {autocompleteLoading && (
              <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Searching…
              </div>
            )}
            {suggestions.map((s, i) => {
              const Icon = ENTITY_ICONS[s.type] || Search;
              const color = ENTITY_COLORS[s.type] || '#6b7280';
              return (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => handleSuggestionClick(s)}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.text}</div>
                    {s.subtitle && <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>{s.subtitle}</div>}
                  </div>
                  <span style={{ fontSize: '0.68rem', opacity: 0.5, flexShrink: 0 }}>{ENTITY_LABELS[s.type] || s.type}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(recentSearches.length > 0 || POPULAR_SEARCHES.length > 0) && !query && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {recentSearches.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.6, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <History size={14} /> Recent
                </h3>
                <button onClick={() => { clearRecentSearches(); setRecentSearches([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', opacity: 0.5 }}>
                  Clear
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {recentSearches.map(s => (
                  <span
                    key={s}
                    onClick={() => handleRecentClick(s)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      background: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-200)',
                      borderRadius: 999,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--color-primary-700)',
                    }}
                  >
                    <X size={12} onClick={e => { e.stopPropagation(); removeRecentSearch(s); setRecentSearches(getRecentSearches()); }} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.6, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={14} /> Popular
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {POPULAR_SEARCHES.map(s => (
                <span
                  key={s}
                  onClick={() => { setInputValue(s); handleSearch(s); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.4rem 0.75rem',
                    background: '#f1f5f9',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div className="hidden md:block" style={{ width: 260, flexShrink: 0, position: 'sticky', top: '1rem' }}>
          {sidebar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {query && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', margin: 0 }}>
                  Results for "{query}"
                </h2>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                  {isLoading ? 'Searching…' : `${total} result${total !== 1 ? 's' : ''}`}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                  <Bookmark size={14} /> Save
                </button>
              </div>
            </div>
          )}

          {activeTypes.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {activeTypes.map(type => (
                <span
                  key={type}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.6rem',
                    background: `${ENTITY_COLORS[type]}15`,
                    border: `1px solid ${ENTITY_COLORS[type]}30`,
                    borderRadius: 999,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: ENTITY_COLORS[type],
                  }}
                >
                  {ENTITY_LABELS[type]}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleTypeToggle(type)} />
                </span>
              ))}
            </div>
          )}

          {isError && (
            <ErrorState
              title="Search failed"
              message={error?.message || 'An error occurred while searching. Please try again.'}
              onRetry={refetch}
            />
          )}

          {!isError && query && !isLoading && results.length === 0 && (
            <NoResultsState
              query={query}
              onClear={() => { clearFilters(); setQuery(''); setInputValue(''); }}
            />
          )}

          {!query && !isLoading && (
            <EmptyState
              title="Start searching"
              description="Enter a search term to find schools, projects, contractors, builders, healthcare centers, schemes, or issues."
            />
          )}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isLoading && results.length === 0 ? (
                [...Array(5)].map((_, i) => <SkeletonResultCard key={i} />)
              ) : (
                results.map(result => (
                  <SearchResultCard key={result.id} result={result} onNavigate={handleResultNavigate} />
                ))
              )}
            </div>
          )}

          {isLoading && results.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', opacity: 0.5 }} />
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                Page {page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white w-[300px] max-w-[85%] h-full overflow-y-auto p-4 shadow-xl" style={{ marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
