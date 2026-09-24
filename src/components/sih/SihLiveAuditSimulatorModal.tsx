import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoordinateForPin } from '../../core/utils/pinCoordinates';
import { calculateCompositeCivicScore } from '../../modules/transparency/services/transparencyService';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ExternalLink,
  Zap,
  Globe,
  HardHat,
  Scale
} from 'lucide-react';

interface SihLiveAuditSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegionalHub {
  pin: string;
  name: string;
  region: string;
  state: string;
  inputs: {
    schoolsRteCompliance: number;
    roadDlpWarranty: number;
    healthcareIphsReadiness: number;
    rationNfsaFulfillment: number;
    airQualityIndex: number;
    grievanceRedressalRate: number;
  };
}

const REGIONAL_HUBS: RegionalHub[] = [
  {
    pin: '250001',
    name: 'Meerut Cantt',
    region: 'North (UP Western Circle)',
    state: 'Uttar Pradesh',
    inputs: { schoolsRteCompliance: 68, roadDlpWarranty: 65, healthcareIphsReadiness: 62, rationNfsaFulfillment: 78, airQualityIndex: 165, grievanceRedressalRate: 58 }
  },
  {
    pin: '110001',
    name: 'Connaught Place',
    region: 'Central (National Capital)',
    state: 'Delhi',
    inputs: { schoolsRteCompliance: 82, roadDlpWarranty: 78, healthcareIphsReadiness: 88, rationNfsaFulfillment: 84, airQualityIndex: 210, grievanceRedressalRate: 72 }
  },
  {
    pin: '560001',
    name: 'Bengaluru GPO',
    region: 'South (Tech Corridor)',
    state: 'Karnataka',
    inputs: { schoolsRteCompliance: 86, roadDlpWarranty: 82, healthcareIphsReadiness: 85, rationNfsaFulfillment: 89, airQualityIndex: 85, grievanceRedressalRate: 80 }
  },
  {
    pin: '400001',
    name: 'Mumbai Fort',
    region: 'West (Financial Hub)',
    state: 'Maharashtra',
    inputs: { schoolsRteCompliance: 80, roadDlpWarranty: 74, healthcareIphsReadiness: 84, rationNfsaFulfillment: 82, airQualityIndex: 140, grievanceRedressalRate: 76 }
  },
  {
    pin: '800001',
    name: 'Patna GPO',
    region: 'East (Gangetic Basin)',
    state: 'Bihar',
    inputs: { schoolsRteCompliance: 55, roadDlpWarranty: 48, healthcareIphsReadiness: 52, rationNfsaFulfillment: 65, airQualityIndex: 195, grievanceRedressalRate: 46 }
  },
  {
    pin: '781001',
    name: 'Guwahati Panbazar',
    region: 'North-East Hub',
    state: 'Assam',
    inputs: { schoolsRteCompliance: 72, roadDlpWarranty: 68, healthcareIphsReadiness: 70, rationNfsaFulfillment: 76, airQualityIndex: 75, grievanceRedressalRate: 64 }
  }
];

export const SihLiveAuditSimulatorModal: React.FC<SihLiveAuditSimulatorModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [selectedHub, setSelectedHub] = useState<RegionalHub>(REGIONAL_HUBS[0]);
  const [customPinInput, setCustomPinInput] = useState('');
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressSec, setProgressSec] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic geocoding centroid for current PIN
  const currentCoords = getCoordinateForPin(selectedHub.pin);
  const civicScore = calculateCompositeCivicScore(selectedHub.inputs);

  // 30-Second Stage Simulator Timer (6 seconds per phase)
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgressSec((prev) => {
          const nextSec = prev + 1;
          if (nextSec >= 30) {
            setIsPlaying(false);
            setCurrentPhase(5);
            return 30;
          }
          const computedPhase = (Math.floor(nextSec / 6) + 1) as 1 | 2 | 3 | 4 | 5;
          setCurrentPhase(computedPhase);
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const handleSelectHub = (hub: RegionalHub) => {
    setSelectedHub(hub);
    setCustomPinInput('');
  };

  const handleCustomPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(customPinInput)) return;

    const coords = getCoordinateForPin(customPinInput);
    const newHub: RegionalHub = {
      pin: customPinInput,
      name: `Postal Locality PIN ${customPinInput}`,
      region: `Pan-India Circle (${coords.district}, ${coords.state})`,
      state: coords.state,
      inputs: {
        schoolsRteCompliance: 70,
        roadDlpWarranty: 65,
        healthcareIphsReadiness: 68,
        rationNfsaFulfillment: 75,
        airQualityIndex: 120,
        grievanceRedressalRate: 60
      }
    };
    setSelectedHub(newHub);
  };

  const handleRestart = () => {
    setProgressSec(0);
    setCurrentPhase(1);
    setIsPlaying(true);
  };

  const handleManualPhaseSelect = (phase: 1 | 2 | 3 | 4 | 5) => {
    setCurrentPhase(phase);
    setProgressSec((phase - 1) * 6);
    setIsPlaying(false);
  };

  const handleLaunchFullApp = () => {
    onClose();
    navigate(`/pin/${selectedHub.pin}`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 22,
        maxWidth: 900,
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>

        {/* Modal Top Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{
                background: 'var(--gradient-accent, #f97316)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 900,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                letterSpacing: '0.04em'
              }}>
                <Sparkles size={12} /> SIH 2026 STAGE ENGINE
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 600 }}>
                Automated 30-Second Pan-India Audit Simulation
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              JantaX Civic Proof & Locality Audit Engine
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
                color: isPlaying ? '#fca5a5' : '#6ee7b7',
                borderRadius: 8,
                padding: '0.45rem 0.85rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause (Auto-Advancing)' : 'Resume Auto-Play'}
            </button>

            <button
              onClick={handleRestart}
              title="Restart 30s Simulation"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                borderRadius: 8,
                padding: '0.45rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 8,
                color: '#94a3b8',
                padding: '0.45rem',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 30-Second Timeline Bar */}
        <div style={{ background: '#090d16', padding: '0.5rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>Stage Simulation Progress: <strong style={{ color: '#38bdf8' }}>{progressSec}s / 30s</strong></span>
            <span>Phase {currentPhase} of 5</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              width: `${(progressSec / 30) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8, #f97316)',
              transition: 'width 1s linear'
            }} />
          </div>
        </div>

        {/* Regional Hub Selector Bar */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginRight: '0.2rem' }}>
              Pan-India Hub:
            </span>
            {REGIONAL_HUBS.map((hub) => (
              <button
                key={hub.pin}
                onClick={() => handleSelectHub(hub)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 6,
                  border: selectedHub.pin === hub.pin ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: selectedHub.pin === hub.pin ? '#eff6ff' : '#ffffff',
                  color: selectedHub.pin === hub.pin ? '#1d4ed8' : '#334155',
                  fontSize: '0.74rem',
                  fontWeight: selectedHub.pin === hub.pin ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                {hub.name} ({hub.pin})
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomPinSubmit} style={{ display: 'flex', gap: '0.35rem' }}>
            <input
              type="text"
              placeholder="Any 6-digit PIN..."
              maxLength={6}
              value={customPinInput}
              onChange={(e) => setCustomPinInput(e.target.value)}
              style={{ width: 130, padding: '0.3rem 0.5rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.74rem' }}
            />
            <button
              type="submit"
              style={{ padding: '0.3rem 0.6rem', borderRadius: 6, background: '#1e293b', color: '#ffffff', fontSize: '0.74rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Load PIN
            </button>
          </form>
        </div>

        {/* Phase Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff', overflowX: 'auto' }}>
          {[
            { phase: 1, label: '1. Geo Centroid Ingestion' },
            { phase: 2, label: '2. Cryptographic Evidence' },
            { phase: 3, label: '3. DLP Contractor Lock' },
            { phase: 4, label: '4. Right-to-Reply & RTI' },
            { phase: 5, label: '5. Pan-India Verdict' }
          ].map((t) => (
            <button
              key={t.phase}
              onClick={() => handleManualPhaseSelect(t.phase as any)}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: currentPhase === t.phase ? '#eff6ff' : 'transparent',
                borderBottom: currentPhase === t.phase ? '3px solid #2563eb' : '3px solid transparent',
                color: currentPhase === t.phase ? '#1d4ed8' : '#64748b',
                fontWeight: currentPhase === t.phase ? 800 : 600,
                fontSize: '0.76rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Phase Content Area */}
        <div style={{ padding: '1.5rem 1.75rem', minHeight: 320, background: '#ffffff' }}>

          {/* PHASE 1: GEO INGESTION & CENTROID */}
          {currentPhase === 1 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                    PHASE 1: LIVE INGESTION
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                    Pan-India Centroid Resolution for PIN {selectedHub.pin}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Postal Circle: <strong>{currentCoords.district}, {currentCoords.state}</strong> · Centroid: {currentCoords.lat.toFixed(4)}°N, {currentCoords.lng.toFixed(4)}°E
                  </div>
                </div>

                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShieldCheck size={16} /> 19,000+ PIN Sub-Metre Geofence Active
                </div>
              </div>

              {/* Ingestion Stream Mock Terminal */}
              <div style={{ background: '#090d16', color: '#38bdf8', padding: '1.25rem', borderRadius: 14, fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.6 }}>
                <div style={{ color: '#4ade80' }}>✓ [GEO-SPATIAL] Centroid locked at ({currentCoords.lat}, {currentCoords.lng}) within 15km delivery circle</div>
                <div style={{ color: '#94a3b8' }}>» [UDISE+] Ingested 18 public schools · RTE infrastructure index 78.4%</div>
                <div style={{ color: '#94a3b8' }}>» [CPWD/PMGSY] Synced 6 active road work orders · 4 roads under statutory DLP warranty</div>
                <div style={{ color: '#94a3b8' }}>» [CPCB-CAAQMS] Real-time sensor feed: {selectedHub.inputs.airQualityIndex} AQI</div>
                <div style={{ color: '#94a3b8' }}>» [NFSA-POS] 24 fair price shops synced · Biometric delivery verification active</div>
                <div style={{ color: '#fb923c' }}>⚡ Zero manual data entry required. Omniscient pan-India ingestion complete.</div>
              </div>
            </div>
          )}

          {/* PHASE 2: CRYPTOGRAPHIC EVIDENCE */}
          {currentPhase === 2 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                  PHASE 2: CRYPTOGRAPHIC PROOF
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  Anti-Spoofing Geofence & SHA-256 Fingerprinting
                </h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Citizen photo submissions are validated against hardware EXIF markers and cryptographically sealed.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} style={{ color: '#059669' }} /> Haversine Great-Circle Validation
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                    Extracted EXIF GPS: <strong>{currentCoords.lat + 0.008}°N, {currentCoords.lng + 0.005}°E</strong><br />
                    Distance from PIN Centroid: <strong>1.12 km</strong> (Threshold &lt; 15 km)<br />
                    Integrity Status: <span style={{ color: '#059669', fontWeight: 800 }}>✅ VERIFIED_GEOFENCE</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={15} style={{ color: '#2563eb' }} /> Web Crypto SHA-256 Digest
                  </div>
                  <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', wordBreak: 'break-all', background: '#0f172a', color: '#93c5fd', padding: '0.5rem', borderRadius: 6 }}>
                    7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '0.35rem', fontWeight: 700 }}>
                    ✓ Immutable timestamped hash resists retrospective doctoring.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 3: CONTRACTOR LIABILITY & DLP */}
          {currentPhase === 3 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                  PHASE 3: CONTRACTOR ACCOUNTABILITY
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  Automated Defect Liability Period (DLP) Warranty Enforcement
                </h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  JantaX identifies whether a pothole or defect falls within contractor warranty under IRC SP:98 guidelines.
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#92400e', fontWeight: 800, textTransform: 'uppercase' }}>
                      Contractor Warranty Match
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f', marginTop: '0.15rem' }}>
                      M/s Rajdeep Infrastructure Ltd · Work Order #PWD-2024-8819
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#92400e', marginTop: '0.25rem' }}>
                      Sanctioned Budget: ₹4.80 Crore · 3-Year Statutory Warranty Active Until: <strong>November 2026</strong>
                    </div>
                  </div>
                  <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: 6 }}>
                    CONTRACTOR REPAIR MANDATE (ZERO TAXPAYER EXPENSE)
                  </span>
                </div>

                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #fef3c7', fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5 }}>
                  Under Section 16 of CPWD Works Manual & IRC:SP:84-2019, any pavement surface distress occurring during the 36-month DLP must be repaired by the contractor within 14 days of notice. Failure incurs liquidated damages of ₹15,000/day.
                </div>
              </div>
            </div>
          )}

          {/* PHASE 4: RIGHT TO REPLY & STATUTORY RTI */}
          {currentPhase === 4 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <span style={{ background: '#f3e8ff', color: '#6b21a8', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                  PHASE 4: DEMOCRATIC PROCESS
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  Dual Gateways: Official Right-to-Reply & 1-Click Statutory RTI
                </h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Balanced democratic architecture prevents witch-hunts while guaranteeing statutory escalation upon SLA breach.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <HardHat size={15} style={{ color: '#2563eb' }} /> Right-to-Reply Safeguard
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Nodal departments and contractors are empowered to submit verified completion certificates, measurement books, or force-majeure delay notifications directly on the report record.
                  </p>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Scale size={15} style={{ color: '#dc2626' }} /> 1-Click Section 6(1) RTI
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    If a department breaches the 30-day Citizen Charter SLA, the citizen can instantly export a structured Section 6(1) RTI petition citing specific contract numbers and DLP statutory clauses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 5: VERDICT & DOSSIER */}
          {currentPhase === 5 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                  PHASE 5: AUDIT VERDICT
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  Deterministic Locality Verdict: {selectedHub.name} ({selectedHub.pin})
                </h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  All 6 algorithmic pillars synthesized into an unforgeable civic health score.
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: 14,
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Composite Mathematical Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.2rem 0' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                      {civicScore.compositeScore}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>/ 100</span>
                  </div>
                  <span style={{
                    background: civicScore.gradeColor,
                    color: '#ffffff',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 999,
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}>
                    Grade {civicScore.grade} Civic Health
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleLaunchFullApp}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: 10,
                      background: 'var(--gradient-accent, #f97316)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 14px rgba(249,115,22,0.4)'
                    }}
                  >
                    Open Live PIN Dashboard <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleManualPhaseSelect(Math.max(1, currentPhase - 1) as any)}
              disabled={currentPhase === 1}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: currentPhase === 1 ? '#94a3b8' : '#334155',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: currentPhase === 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <ArrowLeft size={13} /> Previous Phase
            </button>

            <button
              onClick={() => handleManualPhaseSelect(Math.min(5, currentPhase + 1) as any)}
              disabled={currentPhase === 5}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: currentPhase === 5 ? '#94a3b8' : '#334155',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: currentPhase === 5 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              Next Phase <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleLaunchFullApp}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 8,
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Explore Full Locality OS <ExternalLink size={12} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
