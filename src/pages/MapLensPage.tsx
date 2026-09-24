import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndiaAccountabilityMap } from '../components/map/IndiaAccountabilityMap';
import { buildDemoPins } from '../components/map/demoPins';
import type { MapPin, PinStatus } from '../components/map/mapTypes';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { 
  Globe, 
  Layers, 
  MapPin as PinIcon, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  School, 
  HeartPulse, 
  HardHat, 
  Wheat, 
  Building2, 
  ExternalLink,
  ArrowRight,
  Filter
} from 'lucide-react';

interface RegionalHub {
  pin: string;
  name: string;
  region: string;
}

const REGIONAL_HUBS: RegionalHub[] = [
  { pin: '250001', name: 'Meerut Cantt', region: 'UP Western Circle' },
  { pin: '110001', name: 'Delhi Core', region: 'National Capital' },
  { pin: '560001', name: 'Bengaluru GPO', region: 'South Tech Hub' },
  { pin: '400001', name: 'Mumbai Fort', region: 'Western Financial Hub' },
  { pin: '800001', name: 'Patna GPO', region: 'Gangetic Basin' },
  { pin: '781001', name: 'Guwahati Hub', region: 'North-East Circle' }
];

export function MapLensPage() {
  const navigate = useNavigate();
  const allPins = useMemo(() => buildDemoPins(), []);
  
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

  // Filter pins based on selected civic layer
  const filteredPins = useMemo(() => {
    if (selectedLayer === 'all') return allPins;
    return allPins.filter((p) => {
      const mod = p.module.toLowerCase();
      if (selectedLayer === 'roads' && (mod.includes('infra') || mod.includes('contractor'))) return true;
      if (selectedLayer === 'school' && mod.includes('school')) return true;
      if (selectedLayer === 'hospital' && mod.includes('hospital')) return true;
      if (selectedLayer === 'ration' && mod.includes('ration')) return true;
      if (selectedLayer === 'rera' && mod.includes('rera')) return true;
      return false;
    });
  }, [allPins, selectedLayer]);

  // Aggregate layer metrics
  const stats = useMemo(() => {
    let flagged = 0;
    let progress = 0;
    let resolved = 0;

    for (const p of filteredPins) {
      if (p.status === 'flagged') flagged++;
      if (p.status === 'progress') progress++;
      if (p.status === 'resolved') resolved++;
    }

    return { total: filteredPins.length, flagged, progress, resolved };
  }, [filteredPins]);

  const handleHubClick = (hub: RegionalHub) => {
    const coords = getCoordinateForPin(hub.pin);
    // Find closest pin or matching pin
    const match = allPins.find((p) => (p.subtitle || '').includes(coords.district)) || allPins[0];
    setSelectedPin(match);
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.75rem 1.25rem' }}>
      
      {/* Top Cockpit Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 20,
        padding: '2rem 2.25rem',
        color: '#ffffff',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(15,23,42,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{
            background: 'var(--gradient-accent, #f97316)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            letterSpacing: '0.04em'
          }}>
            <Globe size={13} /> PAN-INDIA SPATIAL COCKPIT
          </span>
          <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
            Tile-Free Vector Projection · 100% Offline-Safe
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0 0.4rem' }}>
              National Civic Accountability Spatial Lens
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: 0, maxWidth: 750, lineHeight: 1.5 }}>
              Live geospatial accountability visualizer across 19,000+ Indian postal PIN codes. Toggle between Road DLP warranties, School RTE scores, Hospital bed readiness, and RERA delivery statuses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.5rem 0.9rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tracked Points</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{stats.total}</div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.5rem 0.9rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#fca5a5', textTransform: 'uppercase' }}>Flagged Deficits</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{stats.flagged}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.5rem 0.9rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#6ee7b7', textTransform: 'uppercase' }}>Verified Resolutions</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{stats.resolved}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Toggles & Regional Hubs Strip */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
      }}>
        {/* Layer Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginRight: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Layers size={13} /> Civic Layer:
          </span>
          {[
            { id: 'all', label: 'All Layers' },
            { id: 'roads', label: 'Road DLP & Infrastructure' },
            { id: 'school', label: 'Schools RTE' },
            { id: 'hospital', label: 'Healthcare & PHCs' },
            { id: 'ration', label: 'PDS Ration Depots' },
            { id: 'rera', label: 'RERA Projects' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLayer(l.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: selectedLayer === l.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: selectedLayer === l.id ? '#eff6ff' : '#ffffff',
                color: selectedLayer === l.id ? '#1d4ed8' : '#334155',
                fontSize: '0.74rem',
                fontWeight: selectedLayer === l.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Regional Hubs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Jump to Hub:</span>
          {REGIONAL_HUBS.map((hub) => (
            <button
              key={hub.pin}
              onClick={() => handleHubClick(hub)}
              style={{
                padding: '0.25rem 0.55rem',
                borderRadius: 6,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#1e293b',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {hub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map on Left, Active Inspector Card on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPin ? '1fr 340px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Map Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: 18,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15,23,42,0.04)'
        }}>
          <IndiaAccountabilityMap 
            pins={filteredPins} 
            height="72vh" 
            onPinSelect={(pin) => setSelectedPin(pin)} 
          />
        </div>

        {/* Inspector Card (when pin is selected) */}
        {selectedPin && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 16,
            padding: '1.25rem',
            boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  background: selectedPin.status === 'flagged' ? '#fee2e2' : selectedPin.status === 'resolved' ? '#dcfce7' : '#fef3c7',
                  color: selectedPin.status === 'flagged' ? '#991b1b' : selectedPin.status === 'resolved' ? '#166534' : '#92400e',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4,
                  textTransform: 'uppercase'
                }}>
                  {selectedPin.status === 'flagged' ? '⚠️ Statutory Deficit' : selectedPin.status === 'resolved' ? '✓ Verified Resolution' : '⏱️ Work in Progress'}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.15rem' }}>
                  {selectedPin.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {selectedPin.subtitle}
                </div>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.2rem' }}
              >
                ×
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Civic Subsystem:</span>
                <strong style={{ color: '#0f172a' }}>{selectedPin.module}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Centroid Coordinates:</span>
                <span style={{ color: '#2563eb', fontFamily: 'monospace' }}>
                  {selectedPin.lat.toFixed(3)}°N, {selectedPin.lng.toFixed(3)}°E
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Postal Geofence:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Active (15km circle)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {selectedPin.href && (
                <button
                  onClick={() => navigate(selectedPin.href!)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: 8,
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Open Subsystem Record <ExternalLink size={13} />
                </button>
              )}

              <button
                onClick={() => {
                  const prefix = selectedPin.id.split('-')[0] || '250001';
                  navigate(`/pin/${prefix.padEnd(6, '0')}`);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 8,
                  background: 'var(--gradient-accent, #f97316)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                Open Full Locality OS <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MapLensPage;
