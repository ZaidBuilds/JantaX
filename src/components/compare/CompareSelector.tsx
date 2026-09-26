import React, { useState, useCallback } from 'react';
import { Search, X, MapPin, GraduationCap, HardHat, Construction, Home, Hospital, Flag } from 'lucide-react';
import { EntityType, ComparisonEntity, getEntityTypeLabel, getCompatibleTypes } from './types';
import { apiUrl } from '../../core/services/api';

const ENTITY_ICONS: Record<string, React.ElementType> = {
  school: GraduationCap,
  contractor: HardHat,
  builder: HardHat,
  project: Construction,
  location: MapPin,
  hospital: Hospital,
  rera: Home,
};

const ENTITY_COLORS: Record<string, string> = {
  school: '#3b82f6',
  contractor: 'var(--bad)',
  builder: 'var(--bad)',
  project: 'var(--warn)',
  location: 'var(--viz-6)',
  hospital: 'var(--viz-5)',
  rera: 'var(--viz-4)',
};

interface CompareSelectorProps {
  value: ComparisonEntity[];
  onChange: (entities: ComparisonEntity[]) => void;
  maxItems?: number;
  entityType?: EntityType;
  placeholder?: string;
}

export function CompareSelector({
  value,
  onChange,
  maxItems = 4,
  entityType,
  placeholder = 'Search or select an entity to compare…',
}: CompareSelectorProps) {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const compatibleTypes = entityType ? getCompatibleTypes(entityType) : undefined;

  const handleRemove = useCallback((id: string) => {
    onChange(value.filter(e => e.id !== id));
  }, [value, onChange]);

  const handleSelect = useCallback((entity: ComparisonEntity) => {
    if (value.some(e => e.id === entity.id)) return;
    if (value.length >= maxItems) return;
    onChange([...value, entity]);
    setSearchText('');
    setIsFocused(false);
  }, [value, onChange, maxItems]);

  const canAddMore = value.length < maxItems;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {value.map((entity, idx) => {
          const Icon = ENTITY_ICONS[entity.type] || MapPin;
          const color = ENTITY_COLORS[entity.type] || 'var(--ink-3)';
          return (
            <div
              key={entity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: `${color}10`,
                border: `1px solid ${color}25`,
                borderRadius: 10,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 160,
                  }}
                >
                  {entity.name}
                </div>
                {entity.location && (
                  <div
                    style={{
                      fontSize: '0.65rem',
                      opacity: 0.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entity.location.district}, {entity.location.state}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRemove(entity.id)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                  padding: 0,
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        {canAddMore && (
          <div style={{ position: 'relative', minWidth: 200 }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: '1.5px solid var(--border-color)',
                borderRadius: 10,
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            />
            {isFocused && searchText.length >= 2 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}
              >
                <QuickSearchResults
                  query={searchText}
                  onSelect={handleSelect}
                  compatibleTypes={compatibleTypes}
                  excludeIds={value.map(e => e.id)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>
        {value.length} / {maxItems} entities selected
        {compatibleTypes && (
          <span> · Comparing: {compatibleTypes.map(t => getEntityTypeLabel(t)).join(', ')}</span>
        )}
      </div>
    </div>
  );
}

interface QuickSearchResultsProps {
  query: string;
  onSelect: (entity: ComparisonEntity) => void;
  compatibleTypes?: EntityType[];
  excludeIds?: string[];
}

function QuickSearchResults({ query, onSelect, compatibleTypes, excludeIds = [] }: QuickSearchResultsProps) {
  const [results, setResults] = useState<ComparisonEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/search/autocomplete?q=${encodeURIComponent(query)}${compatibleTypes ? `&type=${compatibleTypes[0]}` : ''}`));
        const data = await res.json();
        const mapped: ComparisonEntity[] = (data.suggestions || []).map((s: any) => ({
          id: `${s.type}-${s.text}`,
          type: s.type as EntityType,
          name: s.text,
          subtitle: s.subtitle,
          location: s.pincode ? { pincode: s.pincode } : undefined,
        })).filter((e: ComparisonEntity) => !excludeIds.includes(e.id));
        setResults(mapped.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, compatibleTypes, excludeIds]);

  if (isLoading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Searching…
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div>
      {results.map((result, i) => {
        const Icon = ENTITY_ICONS[result.type] || MapPin;
        const color = ENTITY_COLORS[result.type] || 'var(--ink-3)';
        return (
          <div
            key={result.id}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onMouseDown={() => onSelect(result)}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{result.name}</div>
              {result.subtitle && (
                <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>{result.subtitle}</div>
              )}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: 4,
                background: `${color}12`,
                color,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {getEntityTypeLabel(result.type)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
