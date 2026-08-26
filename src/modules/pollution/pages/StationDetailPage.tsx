import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStationById, getActiveGrapStage, getGrapRules } from '../services/pollutionService';
import { AqiGaugeCard } from '../components/AqiGaugeCard';
import { GrapStatusCard } from '../components/GrapStatusCard';
import { PollutionReportGenerator } from '../components/PollutionReportGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, Activity, ShieldAlert, Flame, ExternalLink, AlertTriangle } from 'lucide-react';

export function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const station = id ? getStationById(id) : undefined;
  const activeGrap = getActiveGrapStage();
  const allGrap = getGrapRules();
  const [showReportSection, setShowReportSection] = useState(false);

  if (!station) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Air Monitoring Station Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested station ID "{id}" could not be located in the CPCB CAAQMS network.
        </p>
        <Link to="/pollution" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Air Quality Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/pollution"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Air Quality Directory
        </Link>
      </div>

      {/* Main Station Header Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#0f2d59', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                CAAQMS ONLINE
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                {station.operator}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {station.stationName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.4rem' }}>
              {station.stationNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <MapPin size={15} style={{ color: '#f97316' }} />
              <span>PIN {station.pinCode} • {station.city}, {station.state} (Lat: {station.latitude}, Lng: {station.longitude})</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Status
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
              ● {station.lastUpdated}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Verified CPCB NAQI Feed
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowReportSection(!showReportSection)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0f2d59',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Flame size={15} /> {showReportSection ? 'Hide Grievance Form' : 'Report Smog / Open Burning in this Area'}
          </button>

          <a
            href={station.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f97316',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            Open CPCB Real-Time Feed <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Report Section if Toggled */}
      {showReportSection && (
        <PollutionReportGenerator
          stationName={station.stationName}
          city={station.city}
          pinCode={station.pinCode}
        />
      )}

      {/* AQI Color Gauge & 24h Trend */}
      <AqiGaugeCard
        aqi={station.currentAqi}
        category={station.category}
        prominentPollutant={station.prominentPollutant}
        pm25={station.pm25Value}
        pm10={station.pm10Value}
        no2={station.no2Value}
        trend={station.trend24h}
        healthAdvisory={station.healthAdvisory}
      />

      {/* Active GRAP Status */}
      <GrapStatusCard activeStage={activeGrap} allStages={allGrap} />
    </div>
  );
}
