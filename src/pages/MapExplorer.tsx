import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngBounds as LatLngBoundsType } from 'leaflet';
import {
  Search,
  MapPin,
  GraduationCap,
  Construction,
  Home,
  Hospital,
  Flag,
  ChevronUp,
  ChevronDown,
  List,
  Map as MapIcon,
  Layers,
  X,
  Filter,
  Landmark,
  Vote,
  Scale,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useCatalog } from '../core/hooks/useCatalog';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { resolvePincode } from '../core/utils/pinResolver';
import { getAllWorks } from '../modules/mplads/services/mpladsService';
import { getAllBooths } from '../modules/booth/services/boothService';
import { getAllCourts } from '../modules/courts/services/courtsService';
import { TransparencyDisclaimer } from '../modules/transparency/components/TransparencyDisclaimer';
import { SkeletonCard } from '../components/data-states';

export interface MapGeoEntity {
  id: string;
  moduleId: 'school' | 'infra' | 'rera' | 'hospital' | 'mplads' | 'booth' | 'court' | 'issue';
  layerName: string;
  title: string;
  titleHi?: string;
  subtitle: string;
  status: string;
  pinCode: string;
  lat: number;
  lng: number;
  routeUrl: string;
  keyMetricLabel?: string;
  keyMetricValue?: string;
  evidenceCount?: number;
  badgeColor: string;
}

const LAYER_COLORS: Record<string, string> = {
  school: '#2563eb', // Blue
  infra: '#d97706', // Amber
  rera: '#7c3aed', // Purple
  hospital: '#ec4899', // Pink
  mplads: '#0d9488', // Teal
  booth: '#16a34a', // Emerald Green
  court: '#4338ca', // Indigo
  issue: '#dc2626', // Red
};

const POPULAR_HUBS = [
  { pin: '110001', name: 'New Delhi (Connaught Place)' },
  { pin: '110054', name: 'Tis Hazari (Central Delhi)' },
  { pin: '250001', name: 'Meerut (Civil Lines)' },
  { pin: '440001', name: 'Nagpur (Civil Lines)' },
  { pin: '560001', name: 'Bengaluru (MG Road)' },
];

type ViewMode = 'map' | 'list' | 'split';

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

export function MapExplorer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedPin, setSelectedPin } = usePin();

  const initialPin = searchParams.get('pin') || selectedPin || '110001';
  const [searchText, setSearchText] = useState(initialPin);
  const [activePin, setActivePin] = useState(initialPin);

  const [activeLayers, setActiveLayers] = useState({
    schools: true,
    infra: true,
    rera: true,
    mplads: true,
    booth: true,
    court: true,
    issues: true,
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedEntity, setSelectedEntity] = useState<MapGeoEntity | null>(null);
  const [clusterZoom, setClusterZoom] = useState(13);

  const coordinates = getCoordinateForPin(activePin) || { lat: 28.6139, lng: 77.2090 };
  const resolved = resolvePincode(activePin);
  const { records: catalogRecords, isLoading } = useCatalog(activePin);

  // Sync activePin if URL params change
  useEffect(() => {
    const p = searchParams.get('pin');
    if (p && /^\d{6}$/.test(p) && p !== activePin) {
      setActivePin(p);
      setSearchText(p);
      setSelectedPin(p);
    }
  }, [searchParams]);

  // Aggregate Unified Geo Entities across all civic modules
  const allEntities = useMemo<MapGeoEntity[]>(() => {
    const list: MapGeoEntity[] = [];
    const baseCoords = getCoordinateForPin(activePin) || { lat: 28.6139, lng: 77.2090 };

    // 1. Catalog Records (Schools, Infra, RERA, Hospitals)
    catalogRecords.forEach((r: any, idx: number) => {
      const pin = r.location?.pinCode || activePin;
      const c = getCoordinateForPin(pin) || baseCoords;
      // Slight jitter so markers don't overlap exactly
      const offsetLat = (idx % 5 - 2) * 0.0035;
      const offsetLng = ((idx + 2) % 5 - 2) * 0.0035;

      const mod = r.moduleId as 'school' | 'infra' | 'rera' | 'hospital';
      const routeMap: Record<string, string> = {
        school: `/schools?pin=${pin}&id=${r.id}`,
        infra: `/module/infra?pin=${pin}&id=${r.id}`,
        rera: `/rera/projects/${r.id}`,
        hospital: `/module/hospital?pin=${pin}&id=${r.id}`,
      };

      list.push({
        id: r.id,
        moduleId: mod,
        layerName: mod.toUpperCase(),
        title: r.titleEnglish || r.name || 'Civic Asset',
        titleHi: r.titleHindi,
        subtitle: r.location?.district || `${resolved.district}, ${resolved.state}`,
        status: r.status || 'Active',
        pinCode: pin,
        lat: c.lat + offsetLat,
        lng: c.lng + offsetLng,
        routeUrl: routeMap[mod] || `/search?pin=${pin}`,
        evidenceCount: r.reality?.evidenceCount || 0,
        badgeColor: LAYER_COLORS[mod] || '#6b7280',
        keyMetricLabel: 'Score',
        keyMetricValue: `${r.groundTruthScore || 75}/100`,
      });
    });

    // 2. MPLADS Works
    const mpladsWorks = getAllWorks({ pinCode: activePin });
    mpladsWorks.forEach((w, idx) => {
      const offsetLat = (idx % 4 - 1.5) * 0.004;
      const offsetLng = ((idx + 1) % 4 - 1.5) * 0.004;
      list.push({
        id: w.id,
        moduleId: 'mplads',
        layerName: 'MP / MLA FUND',
        title: w.workTitle,
        titleHi: w.workTitleHi,
        subtitle: `${w.representativeName} (${w.district}, ${w.state})`,
        status: w.status,
        pinCode: w.pinCode,
        lat: baseCoords.lat + offsetLat,
        lng: baseCoords.lng + offsetLng,
        routeUrl: `/mplads/projects/${w.id}`,
        keyMetricLabel: 'Sanctioned Cost',
        keyMetricValue: `₹${w.sanctionCostLakhs} Lakhs`,
        badgeColor: LAYER_COLORS.mplads,
      });
    });

    // 3. Polling Booths & BLO
    const booths = getAllBooths({ pinCode: activePin });
    booths.forEach((b, idx) => {
      const offsetLat = (idx % 3 - 1) * 0.0045;
      const offsetLng = ((idx + 2) % 3 - 1) * 0.0045;
      list.push({
        id: b.id,
        moduleId: 'booth',
        layerName: 'POLLING BOOTH',
        title: `Booth #${b.stationNumber}: ${b.buildingName}`,
        titleHi: b.buildingNameHi,
        subtitle: `BLO: ${b.blo.name} (${b.blo.contactPhone})`,
        status: b.facilities.wheelchairRamp ? 'PwD Accessible Ramp' : 'Standard Station',
        pinCode: b.pinCode,
        lat: baseCoords.lat + offsetLat,
        lng: baseCoords.lng + offsetLng,
        routeUrl: `/booth/${b.id}`,
        keyMetricLabel: 'Electors',
        keyMetricValue: `${b.totalElectors} Voters`,
        badgeColor: LAYER_COLORS.booth,
      });
    });

    // 4. District Courts & NJDG
    const courts = getAllCourts({ pinCode: activePin });
    courts.forEach((c, idx) => {
      const offsetLat = -0.005;
      const offsetLng = 0.005;
      list.push({
        id: c.id,
        moduleId: 'court',
        layerName: 'DISTRICT COURT',
        title: c.complexName,
        titleHi: c.complexNameHi,
        subtitle: `${c.courtType} • ${c.district}`,
        status: `${c.vacancyPercentage}% Judge Vacancy`,
        pinCode: c.pinCode,
        lat: baseCoords.lat + offsetLat,
        lng: baseCoords.lng + offsetLng,
        routeUrl: `/courts/${c.id}`,
        keyMetricLabel: 'Case Pendency',
        keyMetricValue: `${c.totalPendingCases.toLocaleString('en-IN')} Cases`,
        badgeColor: LAYER_COLORS.court,
      });
    });

    return list;
  }, [catalogRecords, activePin, resolved]);

  // Filter entities according to active layer toggles
  const visibleEntities = useMemo(() => {
    return allEntities.filter((e) => {
      if (e.moduleId === 'school' && !activeLayers.schools) return false;
      if (e.moduleId === 'infra' && !activeLayers.infra) return false;
      if (e.moduleId === 'rera' && !activeLayers.rera) return false;
      if (e.moduleId === 'mplads' && !activeLayers.mplads) return false;
      if (e.moduleId === 'booth' && !activeLayers.booth) return false;
      if (e.moduleId === 'court' && !activeLayers.court) return false;
      if (e.moduleId === 'issue' && !activeLayers.issues) return false;
      return true;
    });
  }, [allEntities, activeLayers]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSearchSubmit = (pinToUse?: string) => {
    const pin = (pinToUse || searchText).trim();
    if (/^\d{6}$/.test(pin)) {
      setActivePin(pin);
      setSelectedPin(pin);
      setSearchParams({ pin });
      setSelectedEntity(null);
    }
  };

  const centerCoordinates: [number, number] = [coordinates.lat, coordinates.lng];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: 600, overflow: 'hidden' }}>
      {/* Top Floating Control Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', zIndex: 10 }}>
        {/* Left: PIN search + quick chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 170 }}>
            <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Enter PIN (e.g. 110001)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem 0.45rem 1.8rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            />
          </div>

          <button
            onClick={() => handleSearchSubmit()}
            style={{
              padding: '0.45rem 0.85rem',
              background: '#0f2d59',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Locate PIN
          </button>

          {/* Quick Hub Chips */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Quick Hubs:</span>
            {POPULAR_HUBS.map((h) => (
              <button
                key={h.pin}
                onClick={() => {
                  setSearchText(h.pin);
                  handleSearchSubmit(h.pin);
                }}
                style={{
                  background: activePin === h.pin ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${activePin === h.pin ? '#3b82f6' : '#e2e8f0'}`,
                  color: activePin === h.pin ? '#1d4ed8' : '#475569',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 6,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {h.pin} ({h.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Right: View mode buttons */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 2 }}>
          <button
            onClick={() => setViewMode('split')}
            style={{
              padding: '0.35rem 0.7rem',
              background: viewMode === 'split' ? '#0f2d59' : 'transparent',
              color: viewMode === 'split' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Layers size={13} /> Split
          </button>

          <button
            onClick={() => setViewMode('map')}
            style={{
              padding: '0.35rem 0.7rem',
              background: viewMode === 'map' ? '#0f2d59' : 'transparent',
              color: viewMode === 'map' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <MapIcon size={13} /> Map Only
          </button>

          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.35rem 0.7rem',
              background: viewMode === 'list' ? '#0f2d59' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <List size={13} /> List Only
          </button>
        </div>
      </div>

      {/* Layer Toggle Chips Bar */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f2d59', textTransform: 'uppercase' }}>
          Civic Layers:
        </span>

        <button
          onClick={() => toggleLayer('schools')}
          style={{
            background: activeLayers.schools ? '#eff6ff' : '#ffffff',
            border: `1px solid ${activeLayers.schools ? '#2563eb' : '#cbd5e1'}`,
            color: activeLayers.schools ? '#1e40af' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <GraduationCap size={13} style={{ color: '#2563eb' }} /> Schools ({allEntities.filter(e => e.moduleId === 'school').length})
        </button>

        <button
          onClick={() => toggleLayer('infra')}
          style={{
            background: activeLayers.infra ? '#fffbeb' : '#ffffff',
            border: `1px solid ${activeLayers.infra ? '#d97706' : '#cbd5e1'}`,
            color: activeLayers.infra ? '#b45309' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Construction size={13} style={{ color: '#d97706' }} /> Public Works ({allEntities.filter(e => e.moduleId === 'infra').length})
        </button>

        <button
          onClick={() => toggleLayer('rera')}
          style={{
            background: activeLayers.rera ? '#f5f3ff' : '#ffffff',
            border: `1px solid ${activeLayers.rera ? '#7c3aed' : '#cbd5e1'}`,
            color: activeLayers.rera ? '#6d28d9' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Home size={13} style={{ color: '#7c3aed' }} /> RERA ({allEntities.filter(e => e.moduleId === 'rera').length})
        </button>

        <button
          onClick={() => toggleLayer('mplads')}
          style={{
            background: activeLayers.mplads ? '#f0fdfa' : '#ffffff',
            border: `1px solid ${activeLayers.mplads ? '#0d9488' : '#cbd5e1'}`,
            color: activeLayers.mplads ? '#0f766e' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Landmark size={13} style={{ color: '#0d9488' }} /> MP/MLA Funds ({allEntities.filter(e => e.moduleId === 'mplads').length})
        </button>

        <button
          onClick={() => toggleLayer('booth')}
          style={{
            background: activeLayers.booth ? '#f0fdf4' : '#ffffff',
            border: `1px solid ${activeLayers.booth ? '#16a34a' : '#cbd5e1'}`,
            color: activeLayers.booth ? '#15803d' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Vote size={13} style={{ color: '#16a34a' }} /> Polling Booths & BLO ({allEntities.filter(e => e.moduleId === 'booth').length})
        </button>

        <button
          onClick={() => toggleLayer('court')}
          style={{
            background: activeLayers.court ? '#eef2ff' : '#ffffff',
            border: `1px solid ${activeLayers.court ? '#4338ca' : '#cbd5e1'}`,
            color: activeLayers.court ? '#3730a3' : '#64748b',
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Scale size={13} style={{ color: '#4338ca' }} /> District Courts ({allEntities.filter(e => e.moduleId === 'court').length})
        </button>
      </div>

      {/* Main Workspace Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Side Drawer / List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <aside
            style={{
              width: viewMode === 'split' ? 340 : '100%',
              borderRight: viewMode === 'split' ? '1px solid #e2e8f0' : 'none',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f2d59' }}>
                {resolved.district ? `${resolved.district}, ${resolved.state}` : resolved.state} (PIN {activePin})
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {visibleEntities.length} of {allEntities.length} multi-layer civic entities visible
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} variant="default" />
                  ))}
                </div>
              ) : visibleEntities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                  <MapPin size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>No entities match current layer filters.</p>
                  <button
                    onClick={() => setActiveLayers({ schools: true, infra: true, rera: true, mplads: true, booth: true, court: true, issues: true })}
                    style={{ padding: '0.4rem 0.8rem', background: '#0f2d59', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Enable All Layers
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {visibleEntities.map((entity) => {
                    const isSelected = selectedEntity?.id === entity.id;
                    return (
                      <div
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity)}
                        style={{
                          padding: '0.75rem',
                          background: isSelected ? `${entity.badgeColor}12` : '#ffffff',
                          border: `1px solid ${isSelected ? entity.badgeColor : '#e2e8f0'}`,
                          borderRadius: 10,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${entity.badgeColor}20`, color: entity.badgeColor }}>
                            {entity.layerName}
                          </span>
                          {entity.keyMetricValue && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0f2d59' }}>
                              {entity.keyMetricValue}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f2d59', lineHeight: 1.25, marginBottom: '0.2rem' }}>
                          {entity.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.35rem' }}>
                          {entity.subtitle}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                          <span style={{ color: '#475569' }}>{entity.status}</span>
                          <span style={{ color: '#2563eb', fontWeight: 700 }}>Inspect →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Entity Inspector Card */}
            {selectedEntity && (
              <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: selectedEntity.badgeColor }}>
                    {selectedEntity.layerName}
                  </span>
                  <button onClick={() => setSelectedEntity(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2d59', marginBottom: '0.2rem' }}>
                  {selectedEntity.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.6rem' }}>
                  {selectedEntity.subtitle} (PIN {selectedEntity.pinCode})
                </div>

                <Link
                  to={selectedEntity.routeUrl}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    background: '#0f2d59',
                    color: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  View Full Civic Profile <ExternalLink size={13} />
                </Link>
              </div>
            )}
          </aside>
        )}

        {/* Map Canvas */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div style={{ flex: 1, position: 'relative', background: '#cbd5e1', minHeight: 400 }}>
            <MapContainer
              center={centerCoordinates}
              zoom={clusterZoom}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController center={centerCoordinates} zoom={clusterZoom} />

              {visibleEntities.map((entity) => {
                const isSelected = selectedEntity?.id === entity.id;

                return (
                  <CircleMarker
                    key={entity.id}
                    center={[entity.lat, entity.lng]}
                    radius={isSelected ? 11 : 7}
                    pathOptions={{
                      color: isSelected ? '#ffffff' : entity.badgeColor,
                      fillColor: entity.badgeColor,
                      fillOpacity: 0.85,
                      weight: isSelected ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedEntity(entity),
                    }}
                  >
                    <Popup>
                      <div style={{ minWidth: 200, padding: '0.2rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${entity.badgeColor}20`, color: entity.badgeColor }}>
                          {entity.layerName}
                        </span>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f2d59', margin: '0.3rem 0 0.15rem' }}>
                          {entity.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem' }}>
                          {entity.subtitle}
                        </div>

                        {entity.keyMetricValue && (
                          <div style={{ background: '#f8fafc', padding: '0.3rem 0.5rem', borderRadius: 6, fontSize: '0.72rem', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                            <strong>{entity.keyMetricLabel}:</strong> {entity.keyMetricValue}
                          </div>
                        )}

                        <Link
                          to={entity.routeUrl}
                          style={{
                            display: 'inline-block',
                            width: '100%',
                            textAlign: 'center',
                            padding: '0.4rem',
                            background: '#0f2d59',
                            color: '#ffffff',
                            borderRadius: 6,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Inspect Civic Profile →
                        </Link>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Map Zoom Controls */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '0.35rem', zIndex: 1000 }}>
              <button
                onClick={() => setClusterZoom((z) => Math.min(18, z + 1))}
                style={{ width: 32, height: 32, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => setClusterZoom((z) => Math.max(4, z - 1))}
                style={{ width: 32, height: 32, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Bottom Status Pill */}
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,45,89,0.92)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 600, padding: '5px 16px', borderRadius: 999, zIndex: 1000, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              Geo-Intelligence Active: {visibleEntities.length} civic assets mapped across PIN {activePin}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
