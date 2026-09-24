import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Crosshair,
  Navigation,
  Building,
  GraduationCap,
  Hospital,
  CheckCircle2,
  ShieldAlert,
  Construction,
  Droplets,
  Train,
  HardHat,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Layers,
  Filter,
} from 'lucide-react';
import { getCoordinateForPin, haversineKm } from '../../core/utils/pinCoordinates';
import { resolvePincode } from '../../core/utils/pinResolver';
import { representativeService } from '../../modules/representatives/services/representativeService';
import { schemeService } from '../../modules/schemes/services/schemeService';
import { api } from '../../core/services/api';
import { Link } from 'react-router-dom';

export type MapAssetCategory =
  | 'school'
  | 'hospital'
  | 'infra'
  | 'representative'
  | 'scheme'
  | 'water'
  | 'railway'
  | 'report';

export interface MapPinEntity {
  id: string;
  name: string;
  nameHi?: string;
  category: MapAssetCategory;
  categoryLabel: string;
  lat: number;
  lng: number;
  color: string;
  sanctionedCostLakhs?: number;
  actualCostLakhs?: number;
  costHikePercentage?: number;
  contractorName?: string;
  contractorRating?: number;
  status?: string;
  dlpStatus?: string;
  groundTruthScore?: number;
  officialSource?: string;
  detailUrl?: string;
}

export interface PinpointLocation {
  lat: number;
  lng: number;
  pinCode: string;
  landmarkHint?: string;
  nearestAsset?: {
    id: string;
    name: string;
    type: string;
    distanceMeters: number;
  };
}

interface LocalityPinpointMapProps {
  pinCode: string;
  initialLat?: number;
  initialLng?: number;
  height?: number | string;
  interactive?: boolean;
  showNearbyFacilities?: boolean;
  onLocationSelect?: (loc: PinpointLocation) => void;
  onEntityClick?: (entity: MapPinEntity) => void;
}

// Custom Draggable Pin Icon
const pinIcon = L.divIcon({
  className: 'jantax-pinpoint-marker',
  html: `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));
    ">
      <div style="
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ea580c;
        opacity: 0.45;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#ea580c" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocalityPinpointMap({
  pinCode,
  initialLat,
  initialLng,
  height = 420,
  interactive = true,
  showNearbyFacilities = true,
  onLocationSelect,
  onEntityClick,
}: LocalityPinpointMapProps) {
  const resolved = useMemo(() => resolvePincode(pinCode), [pinCode]);
  const defaultCoord = useMemo(() => getCoordinateForPin(pinCode), [pinCode]);

  const [currentLat, setCurrentLat] = useState<number>(initialLat ?? defaultCoord.lat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng ?? defaultCoord.lng);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Entities state
  const [entities, setEntities] = useState<MapPinEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Sync if pinCode changes
  useEffect(() => {
    if (initialLat === undefined && initialLng === undefined) {
      const coord = getCoordinateForPin(pinCode);
      setCurrentLat(coord.lat);
      setCurrentLng(coord.lng);
    }
  }, [pinCode, initialLat, initialLng]);

  // Load live multi-category entities for this PIN
  useEffect(() => {
    let isAlive = true;

    Promise.allSettled([
      api.getSchools(pinCode),
      api.getHospitals(pinCode),
      representativeService.getAllSanctionedWorks(pinCode),
      schemeService.getSchemeProjects(pinCode),
    ]).then(([schoolsRes, hospRes, worksRes, schemesRes]) => {
      if (!isAlive) return;

      const loaded: MapPinEntity[] = [];

      // 1. Schools (UDISE+)
      if (schoolsRes.status === 'fulfilled' && Array.isArray(schoolsRes.value)) {
        schoolsRes.value.forEach((s: any, idx: number) => {
          loaded.push({
            id: s.id || `sch-${s.udiseCode || idx}`,
            name: s.nameEnglish || s.name || 'Government School',
            nameHi: s.nameHindi,
            category: 'school',
            categoryLabel: 'UDISE+ School',
            lat: defaultCoord.lat + (idx % 2 === 0 ? 0.003 : -0.0025) * (idx + 1) * 0.7,
            lng: defaultCoord.lng + (idx % 2 === 0 ? -0.002 : 0.0032) * (idx + 1) * 0.7,
            color: '#2563eb', // Blue
            status: 'Operational',
            groundTruthScore: s.groundTruthScore || 78,
            officialSource: 'UDISE+ Ministry of Education',
            detailUrl: `/module/school?id=${s.id || s.udiseCode}`,
          });
        });
      }

      // 2. Health Facilities (HMIS)
      if (hospRes.status === 'fulfilled' && Array.isArray(hospRes.value)) {
        hospRes.value.forEach((h: any, idx: number) => {
          loaded.push({
            id: h.id || `hosp-${idx}`,
            name: h.name || 'Community Health Centre',
            category: 'hospital',
            categoryLabel: 'Health Facility',
            lat: defaultCoord.lat - 0.0035 - idx * 0.002,
            lng: defaultCoord.lng + 0.0028 + idx * 0.0018,
            color: '#ec4899', // Pink
            status: h.isOpen ? 'Open / Operational' : 'Closed',
            officialSource: 'HMIS / National Health Mission',
            detailUrl: `/module/hospital?pin=${pinCode}`,
          });
        });
      }

      // 3. Representative Sanctioned Works (Gram Pradhan, Mayor, MLA, MP)
      if (worksRes.status === 'fulfilled' && Array.isArray(worksRes.value)) {
        worksRes.value.forEach((w) => {
          loaded.push({
            id: w.id,
            name: w.workTitle,
            nameHi: w.workTitleHi,
            category: 'representative',
            categoryLabel: `${w.sector} (Public Rep)`,
            lat: w.latitude || defaultCoord.lat + 0.004,
            lng: w.longitude || defaultCoord.lng + 0.002,
            color: '#16a34a', // Emerald Green
            sanctionedCostLakhs: w.sanctionedCostLakhs,
            actualCostLakhs: w.actualCostLakhs,
            costHikePercentage: w.costHikePercentage,
            contractorName: w.contractorName,
            contractorRating: w.contractorRating,
            status: w.status,
            dlpStatus: w.dlpStatus,
            groundTruthScore: w.groundTruthScore,
            officialSource: w.schemeName || 'Panchayati Raj / MPLADS / MLALADS',
            detailUrl: `/pin/${pinCode}/representatives`,
          });
        });
      }

      // 4. Central & State Schemes (PMGSY, JJM, Railways, AMRUT)
      if (schemesRes.status === 'fulfilled' && Array.isArray(schemesRes.value)) {
        schemesRes.value.forEach((sc) => {
          const isRailway = sc.category === 'RAILWAY_CORRIDOR';
          const isWater = sc.category === 'WATER_SANITATION';

          loaded.push({
            id: sc.id,
            name: sc.projectName,
            nameHi: sc.projectNameHi,
            category: isRailway ? 'railway' : isWater ? 'water' : 'scheme',
            categoryLabel: sc.schemeName,
            lat: sc.latitude || defaultCoord.lat - 0.004,
            lng: sc.longitude || defaultCoord.lng - 0.003,
            color: isRailway ? '#4338ca' : isWater ? '#0284c7' : '#d97706', // Indigo / Cyan / Amber
            sanctionedCostLakhs: sc.totalSanctionedBudgetCr ? sc.totalSanctionedBudgetCr * 100 : undefined,
            actualCostLakhs: sc.fundsUtilizedCr ? sc.fundsUtilizedCr * 100 : undefined,
            costHikePercentage: sc.costHikePercentage,
            contractorName: sc.contractorName,
            contractorRating: sc.contractorRating,
            status: sc.status,
            dlpStatus: sc.dlpStatus,
            groundTruthScore: sc.groundTruthScore,
            officialSource: sc.ministry,
            detailUrl: `/pin/${pinCode}/schemes`,
          });
        });
      }

      // Fallback sample facilities if API returned empty
      if (loaded.length === 0) {
        loaded.push(
          {
            id: `sch-${pinCode}-demo`,
            name: `Govt. Primary School, ${resolved.district} Central`,
            category: 'school',
            categoryLabel: 'UDISE+ School',
            lat: defaultCoord.lat + 0.0028,
            lng: defaultCoord.lng - 0.0019,
            color: '#2563eb',
            groundTruthScore: 78,
            status: 'Operational',
            officialSource: 'UDISE+ Ministry of Education',
          },
          {
            id: `infra-${pinCode}-demo`,
            name: `PMGSY Road Stretch - Sector Road`,
            category: 'scheme',
            categoryLabel: 'PMGSY Road',
            lat: defaultCoord.lat + 0.0042,
            lng: defaultCoord.lng + 0.0025,
            color: '#d97706',
            sanctionedCostLakhs: 42.5,
            actualCostLakhs: 48.2,
            costHikePercentage: 13.4,
            contractorName: 'Western Roadworks Corp',
            contractorRating: 82,
            status: 'Under Construction',
            dlpStatus: 'Active DLP',
          }
        );
      }

      setEntities(loaded);
    });

    return () => {
      isAlive = false;
    };
  }, [pinCode, defaultCoord, resolved]);

  // Filtered entities
  const visibleEntities = useMemo(() => {
    if (selectedCategory === 'ALL') return entities;
    return entities.filter((e) => e.category === selectedCategory);
  }, [entities, selectedCategory]);

  // Compute nearest asset
  const nearestAsset = useMemo(() => {
    let closest: MapPinEntity | null = null;
    let minDistance = Infinity;

    for (const a of entities) {
      const dist = haversineKm(currentLat, currentLng, a.lat, a.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = a;
      }
    }

    if (closest && minDistance <= 0.8) {
      return {
        id: closest.id,
        name: closest.name,
        type: closest.categoryLabel,
        distanceMeters: Math.round(minDistance * 1000),
      };
    }
    return undefined;
  }, [currentLat, currentLng, entities]);

  const notifyChange = useCallback(
    (lat: number, lng: number) => {
      setCurrentLat(lat);
      setCurrentLng(lng);
      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          pinCode,
          landmarkHint: `${resolved.district}, ${resolved.state}`,
          nearestAsset,
        });
      }
    },
    [onLocationSelect, pinCode, resolved, nearestAsset]
  );

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        notifyChange(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        setGpsError(err.message || 'Unable to retrieve location');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Map Header Toolbar with Category Layer Toggles */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} style={{ color: '#ea580c' }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f2d59' }}>
            Interactive GIS Pinpoint Map — PIN {pinCode}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              background: '#e2e8f0',
              padding: '0.15rem 0.5rem',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            {resolved.district}, {resolved.state} ({visibleEntities.length} Pinned Assets)
          </span>
        </div>

        {interactive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isLocating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Navigation size={13} style={{ color: '#2563eb' }} />
              {isLocating ? 'Detecting GPS…' : 'Locate Me (GPS)'}
            </button>
          </div>
        )}
      </div>

      {/* Layer Filter Strip */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          padding: '0.45rem 1rem',
          background: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
          Layers:
        </span>
        {[
          { id: 'ALL', label: 'All Pinned Assets', count: entities.length, color: '#0f2d59' },
          { id: 'school', label: 'Schools', count: entities.filter((e) => e.category === 'school').length, color: '#2563eb' },
          { id: 'representative', label: 'Rep Works', count: entities.filter((e) => e.category === 'representative').length, color: '#16a34a' },
          { id: 'scheme', label: 'Roads/Schemes', count: entities.filter((e) => e.category === 'scheme').length, color: '#d97706' },
          { id: 'water', label: 'Jal Jeevan Water', count: entities.filter((e) => e.category === 'water').length, color: '#0284c7' },
          { id: 'railway', label: 'Rail / Transit', count: entities.filter((e) => e.category === 'railway').length, color: '#4338ca' },
          { id: 'hospital', label: 'Healthcare', count: entities.filter((e) => e.category === 'hospital').length, color: '#ec4899' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCategory(item.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              borderRadius: 6,
              border: selectedCategory === item.id ? `1.5px solid ${item.color}` : '1px solid #cbd5e1',
              background: selectedCategory === item.id ? '#ffffff' : 'transparent',
              color: selectedCategory === item.id ? item.color : '#475569',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: item.color,
                display: 'inline-block',
              }}
            />
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {gpsError && (
        <div style={{ padding: '0.4rem 1rem', background: '#fff1f2', color: '#e11d48', fontSize: '0.75rem', borderBottom: '1px solid #ffe4e6' }}>
          {gpsError}
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <div style={{ height, width: '100%', position: 'relative' }}>
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={interactive}
          dragging={interactive}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={[currentLat, currentLng]} zoom={14} />

          {interactive && (
            <MapClickHandler
              onMapClick={(lat, lng) => {
                notifyChange(lat, lng);
              }}
            />
          )}

          {/* Draggable Citizen Crosshair Marker */}
          <Marker
            position={[currentLat, currentLng]}
            icon={pinIcon}
            draggable={interactive}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                notifyChange(pos.lat, pos.lng);
              },
            }}
          >
            <Popup>
              <div style={{ padding: '0.2rem', minWidth: 160 }}>
                <strong style={{ fontSize: '0.85rem', color: '#ea580c' }}>Selected Point</strong>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
                </p>
                {nearestAsset && (
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#0f172a', fontWeight: 600 }}>
                    ~{nearestAsset.distanceMeters}m from {nearestAsset.name}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>

          {/* CJP Paradigm: All Pinned Civic Facilities & Projects */}
          {showNearbyFacilities &&
            visibleEntities.map((asset) => (
              <CircleMarker
                key={asset.id}
                center={[asset.lat, asset.lng]}
                radius={8}
                pathOptions={{
                  fillColor: asset.color,
                  fillOpacity: 0.9,
                  color: '#ffffff',
                  weight: 2.5,
                }}
                eventHandlers={{
                  click: () => {
                    if (onEntityClick) onEntityClick(asset);
                  },
                }}
              >
                <Popup>
                  <div style={{ fontSize: '0.8rem', padding: '0.25rem', minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          textTransform: 'uppercase',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: asset.color,
                          background: '#f8fafc',
                          padding: '0.1rem 0.35rem',
                          borderRadius: 4,
                          border: `1px solid ${asset.color}40`,
                        }}
                      >
                        {asset.categoryLabel}
                      </span>
                      {asset.status && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#166534' }}>
                          {asset.status}
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: '0.25rem 0 0.15rem', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      {asset.name}
                    </h4>
                    {asset.nameHi && (
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.35rem' }}>
                        {asset.nameHi}
                      </div>
                    )}

                    {/* Financial & Cost Hike info */}
                    {asset.sanctionedCostLakhs !== undefined && (
                      <div style={{ background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: 6, margin: '0.35rem 0', border: '1px solid #eef2f7' }}>
                        <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                          Sanctioned: <strong>₹{asset.sanctionedCostLakhs}L</strong>
                          {asset.actualCostLakhs && asset.actualCostLakhs !== asset.sanctionedCostLakhs && (
                            <span> → Actual: <strong style={{ color: '#dc2626' }}>₹{asset.actualCostLakhs}L</strong></span>
                          )}
                        </div>
                        {asset.costHikePercentage !== undefined && asset.costHikePercentage > 0 && (
                          <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700, marginTop: 2 }}>
                            ⚠️ +{asset.costHikePercentage}% Cost Overrun / Hike
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contractor details */}
                    {asset.contractorName && (
                      <div style={{ fontSize: '0.72rem', color: '#334155', margin: '0.25rem 0' }}>
                        <HardHat size={12} style={{ display: 'inline', color: '#ea580c', marginRight: 3 }} />
                        Contractor: <strong>{asset.contractorName}</strong>
                      </div>
                    )}

                    {/* DLP Badge */}
                    {asset.dlpStatus === 'Active DLP' && (
                      <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '0.1rem 0.35rem', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>
                        ✓ Defect Liability Period Active
                      </div>
                    )}

                    {/* Action button */}
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => notifyChange(asset.lat, asset.lng)}
                        style={{
                          flex: 1,
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: '#0f2d59',
                        }}
                      >
                        Snap Target Pin
                      </button>
                      {asset.detailUrl && (
                        <Link
                          to={asset.detailUrl}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0f2d59',
                            color: '#ffffff',
                            borderRadius: 4,
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>

      {/* Map Footer Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.78rem',
          color: '#475569',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Crosshair size={14} style={{ color: '#0284c7' }} />
          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span style={{ color: '#64748b' }}>Click any colored circle to view budget, contractor & audits</span>
        </div>

        {nearestAsset ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803d', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>
              Near {nearestAsset.name} (~{nearestAsset.distanceMeters}m)
            </span>
          </div>
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.74rem' }}>
            Positioned within PIN {pinCode} zone
          </div>
        )}
      </div>
    </div>
  );
}
