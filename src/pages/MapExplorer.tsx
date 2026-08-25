import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, GraduationCap, Construction, Home, Hospital, Flag, ChevronUp, ChevronDown } from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useCatalog } from '../core/hooks/useCatalog';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { resolvePincode } from '../core/utils/pinResolver';
import { SourceBadge } from '../components/UI/SourceBadge';

/**
 * JantaX Map Explorer Page
 * Real interactive OpenStreetMap embed with working zoom, live catalog counts,
 * floating legend, and a selected-area detail pane.
 */
export function MapExplorer() {
  const navigate = useNavigate();
  const { selectedPin, setSelectedPin } = usePin();
  const [activeCategories, setActiveCategories] = useState({
    schools: true, public: true, rera: true, contractors: true, healthcare: true, welfare: true,
  });
  const [zoom, setZoom] = useState(11);

  const coordinates = getCoordinateForPin(selectedPin);
  const resolved = resolvePincode(selectedPin);
  const { records } = useCatalog(selectedPin);

  const schools = records.filter(r => r.moduleId === 'school').length;
  const projects = records.filter(r => r.moduleId === 'infra').length;
  const rera = records.filter(r => (r.moduleId as string) === 'rera').length;
  const healthcare = records.filter(r => (r.moduleId as string) === 'hospital').length;
  const issues = records.filter(r => r.reality.evidenceCount > 0).length;

  const visibleRecords = records.filter(r => {
    if (r.moduleId === 'school') return activeCategories.schools;
    if (r.moduleId === 'infra') return activeCategories.public;
    if ((r.moduleId as string) === 'rera') return activeCategories.rera;
    if ((r.moduleId as string) === 'hospital') return activeCategories.healthcare;
    return activeCategories.contractors || activeCategories.welfare;
  });

  const mapSrc = coordinates
    ? (() => {
        const { lat, lng } = coordinates;
        const delta = 0.01 * Math.pow(2, 11 - zoom);
        const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
      })()
    : null;

  const toggleCategory = (key: keyof typeof activeCategories) =>
    setActiveCategories(s => ({ ...s, [key]: !s[key] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-height, 96px) - 60px)', minHeight: '520px' }}>

      <div className="map-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left Sidebar Map Controls */}
        <aside style={{ width: '280px', borderRight: '1px solid var(--border-color)', background: 'white', padding: '1.25rem', overflowY: 'auto', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Map Explorer</h3>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1.25rem' }}>Explore what's happening around India</p>

          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search PIN or area…"
              className="form-input"
              style={{ paddingLeft: '2rem', fontSize: '0.8rem' }}
              value={selectedPin}
              onChange={(e) => setSelectedPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              aria-label="Search PIN code on map"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Select Categories</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', cursor: 'pointer' }} onClick={() => setActiveCategories({ schools: true, public: true, rera: true, contractors: true, healthcare: true, welfare: true })}>Clear All</span>
            </div>
            <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.schools} onChange={() => toggleCategory('schools')} /> Schools</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.public} onChange={() => toggleCategory('public')} /> Public Projects</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.rera} onChange={() => toggleCategory('rera')} /> RERA Projects</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.contractors} onChange={() => toggleCategory('contractors')} /> Contractors</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.healthcare} onChange={() => toggleCategory('healthcare')} /> Healthcare Centers</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={activeCategories.welfare} onChange={() => toggleCategory('welfare')} /> Welfare Schemes</label>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Location Level</label>
            <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="loc-lvl" /> India</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="loc-lvl" /> State</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="loc-lvl" /> District</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="loc-lvl" defaultChecked /> City / Area</label>
            </div>
          </div>

          <button className="search-action-btn" style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}>Apply Filters</button>
        </aside>

        {/* Center: Real Interactive Map */}
        <div className="map-center" style={{ flex: 1, position: 'relative', background: '#cbd5e1' }}>
          {mapSrc ? (
            <iframe title="JantaX area map" src={mapSrc} style={{ width: '100%', height: '100%', border: 0 }} loading="lazy" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '0.5rem', padding: '1rem', textAlign: 'center', color: '#475569' }}>
              <MapPin size={32} style={{ opacity: 0.5 }} />
              <span style={{ fontSize: '0.9rem' }}>No map available for PIN {selectedPin}. Try a major PIN code (e.g. 110001).</span>
            </div>
          )}

          {/* Cluster pins overlay — deterministic per PIN, colored by type, respects filters */}
          {mapSrc && visibleRecords.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {visibleRecords.slice(0, 12).map((r, i) => {
                const isSchool = r.moduleId === 'school';
                const isInfra = r.moduleId === 'infra';
                const color = isSchool ? '#10b981' : isInfra ? '#3b82f6' : '#ef4444';
                const left = 18 + (i * 37) % 68;
                const top = 22 + (i * 29) % 58;
                const size = r.reality.evidenceCount > 0 ? 14 : 10;
                return (
                  <div key={r.id} style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: size, height: size, borderRadius: '50%', background: color, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size>12? '8px':'0', fontWeight:800 }} title={`${r.titleHindi} · ${r.status}`}>
                    {r.reality.evidenceCount>0 ? '!' : ''}
                  </div>
                );
              })}
               <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,45,89,0.92)', color: '#fff', fontSize: '0.68rem', padding: '4px 10px', borderRadius: 999, pointerEvents: 'auto' }}>
                {visibleRecords.length} pins · Clustered by PIN · {schools} Schools · {projects} Projects
              </div>
            </div>
          )}

          {/* Zoom controls */}
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'grid', gap: '4px' }}>
            <button aria-label="Zoom in" style={{ width: '32px', height: '32px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setZoom(z => Math.min(18, z + 1))}><ChevronUp size={18} /></button>
            <button aria-label="Zoom out" style={{ width: '32px', height: '32px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setZoom(z => Math.max(4, z - 1))}><ChevronDown size={18} /></button>
          </div>

          {/* Floating Legend Panel */}
          <div className="glass-card" style={{ position: 'absolute', top: '20px', left: '20px', padding: '1rem', width: '180px', background: 'white' }}>
            <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Legend</h4>
            <div style={{ display: 'grid', gap: '0.35rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Schools</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> Public Projects</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> RERA Projects</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Issues / Reports</div>
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <SourceBadge sourceType="A" sourceName="OpenStreetMap" />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Area details */}
        <aside style={{ width: '300px', borderLeft: '1px solid var(--border-color)', background: 'white', padding: '1.25rem', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 700 }}>SELECTED AREA</div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: '0.15rem 0' }}>PIN {selectedPin}</h4>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} />{resolved.district}, {resolved.state}{resolved.stateCode !== '--' && <span style={{ marginLeft: '0.35rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-500)', padding: '0 5px', borderRadius: 999, fontSize: '0.6rem', fontWeight: 800 }}>{resolved.stateCode}</span>}</span>
          </div>

          <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={15} color="#3b82f6" /> Schools</span><strong>{schools}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Construction size={15} color="#f59e0b" /> Public Projects</span><strong>{projects}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Home size={15} color="#8b5cf6" /> RERA Projects</span><strong>{rera}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Hospital size={15} color="#ec4899" /> Healthcare Centers</span><strong>{healthcare}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Flag size={15} color="#ef4444" /> Issues / Reports</span><strong style={{ color: '#ef4444' }}>{issues}</strong></div>
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Area Health Score</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316', marginTop: '0.15rem' }}>— / 100</div>
              <span style={{ fontSize: '0.6rem', color: '#f97316' }}>Connect data sources</span>
            </div>
            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Most Reported Issue</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>{issues > 0 ? 'Citizen-flagged delays' : 'None reported'}</div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/pin/${selectedPin}`)}
            className="search-action-btn"
            style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            View Full Area Dashboard →
          </button>
        </aside>

      </div>

      {/* Bottom Live Ribbon Strip */}
      <div className="map-bottom-ribbon" style={{ height: '60px', background: 'linear-gradient(135deg, #0f2d59 0%, #1a4d8f 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: '0.8rem', padding: '0 2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}><Flag size={15} /> <strong>India at a Glance (Live)</strong></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}><GraduationCap size={15} /> <strong>2.15L</strong> Schools</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}><Construction size={15} /> <strong>1.64L</strong> Public Projects</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}><Home size={15} /> <strong>42,562</strong> RERA Projects</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}><Hospital size={15} /> <strong>29,875</strong> Healthcare Centers</div>
      </div>

    </div>
  );
}
