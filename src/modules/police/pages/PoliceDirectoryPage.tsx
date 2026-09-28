import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Search,
  Phone,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Share2,
  ChevronRight,
  ShieldCheck,
  Scale,
  Users,
  Compass,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { policeService } from '../services/policeService';
import type { PoliceStation, ZeroFirRightsGuide, EFirCategory } from '../types/police';

export function PoliceDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '110001';
  const [pinInput, setPinInput] = useState(currentPin);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'stations' | 'zero-fir' | 'efir'>('stations');

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [districtName, setDistrictName] = useState(loc.district);

  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [loading, setLoading] = useState(true);

  const zeroFirGuide = useMemo(() => policeService.getZeroFirGuide(), []);
  const efirCategories = useMemo(() => policeService.getEFirCategories(), []);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.district) setDistrictName(acc.district);
    });
  }, [currentPin]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    policeService.getPoliceStationsByPin(currentPin).then((res) => {
      if (alive) {
        setStations(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [currentPin]);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations;
    const q = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.stationName.toLowerCase().includes(q) ||
        s.shoName.toLowerCase().includes(q) ||
        s.jurisdictionAreas.some((a) => a.toLowerCase().includes(q))
    );
  }, [stations, searchQuery]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length === 6) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShare = (station: PoliceStation) => {
    share({
      title: `Police Station & Emergency Roster — ${station.stationName}`,
      text: `Jurisdictional Police Station for PIN ${currentPin}: ${station.stationName}. SHO: ${station.shoName}. CCTNS Status: ${station.cctnsStatus}. Emergency: 112. Verified via JantaX.`,
      url: window.location.href,
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Emergency Speed Dial Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
          borderRadius: 14,
          padding: '0.85rem 1.25rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 14px rgba(185, 28, 28, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={20} style={{ color: '#fef08a' }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
              {tr('24x7 Statutory Emergency Helplines', '२४x७ वैधानिक आपातकालीन हेल्पलाइन')}
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'block' }}>
              {tr('Toll-free emergency dispatch from anywhere in India', 'भारत में कहीं से भी निःशुल्क आपातकालीन सहायता')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { label: '112 National Police Emergency', phone: '112', bg: '#ffffff', text: '#991b1b' },
            { label: '1090 Women Helpline', phone: '1090', bg: 'rgba(255,255,255,0.15)', text: '#ffffff' },
            { label: '1930 Cyber Fraud', phone: '1930', bg: 'rgba(255,255,255,0.15)', text: '#ffffff' },
            { label: '1098 Childline', phone: '1098', bg: 'rgba(255,255,255,0.15)', text: '#ffffff' },
          ].map((h) => (
            <a
              key={h.phone}
              href={`tel:${h.phone}`}
              style={{
                background: h.bg,
                color: h.text,
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <PhoneCall size={12} /> {h.label}
            </a>
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            {tr('Module 16', 'मॉड्यूल १६')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {tr('CCTNS Digital Police & e-FIR Gateway', 'सीसीटीएनएस डिजिटल पुलिस एवं e-FIR प्रवेश द्वार')}
          </span>
        </div>
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
            margin: '0 0 0.4rem 0',
          }}
        >
          {tr('Police Station & Jurisdictional Directory', 'पुलिस थाना एवं क्षेत्राधिकार निर्देशिका')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
          {tr(
            'Official police station jurisdiction mapping, Daily Diary CCTNS sync status, Station House Officer (SHO) contacts, and statutory Zero-FIR rights.',
            'आधिकारिक पुलिस थाना क्षेत्राधिकार, सीसीटीएनएस डेली डायरी स्थिति, थाना प्रभारी संपर्क एवं शून्य एफआईआर वैधानिक अधिकार।'
          )}
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { id: 'stations', label: tr('Local Police Stations', 'क्षेत्रीय पुलिस थाने'), count: stations.length },
          { id: 'zero-fir', label: tr('Zero-FIR Statutory Rights', 'शून्य एफआईआर अधिकार'), count: 'Law' },
          { id: 'efir', label: tr('e-FIR Filing Guide', 'ऑनलाइन e-FIR गाइड'), count: efirCategories.length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: '0.65rem 1.15rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: activeTab === t.id ? '#1d4ed8' : '#64748b',
              borderBottom: activeTab === t.id ? '2px solid #1d4ed8' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>{t.label}</span>
            <span
              style={{
                background: activeTab === t.id ? '#dbeafe' : '#f1f5f9',
                color: activeTab === t.id ? '#1e40af' : '#64748b',
                padding: '0.1rem 0.45rem',
                borderRadius: 999,
                fontSize: '0.72rem',
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'stations' && (
        <>
          {/* PIN Filter & Search */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
              background: '#ffffff',
              padding: '1rem',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}
          >
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 280px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <MapPin
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="text"
                  value={pinInput}
                  maxLength={6}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0 1rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {tr('Change Area', 'बदलें')}
              </button>
            </form>

            <div style={{ position: 'relative', flex: '2 1 320px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr('Filter by station name, SHO, or sector jurisdiction…', 'थाने का नाम, SHO या सेक्टर से खोजें…')}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Stations List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading police jurisdiction records for PIN {currentPin}…
            </div>
          ) : filteredStations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 12 }}>
              <p style={{ color: '#64748b', fontWeight: 600 }}>No police stations matching search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Badge Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          background: station.cctnsStatus === 'ONLINE_ACTIVE' ? '#ecfdf5' : '#fffbeb',
                          color: station.cctnsStatus === 'ONLINE_ACTIVE' ? '#047857' : '#b45309',
                          border: `1px solid ${station.cctnsStatus === 'ONLINE_ACTIVE' ? '#a7f3d0' : '#fde68a'}`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 999,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <CheckCircle2 size={12} /> CCTNS Daily Diary: {station.cctnsStatus === 'ONLINE_ACTIVE' ? 'Live' : 'Delayed'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                        Synced: {station.cctnsDailyDiarySync}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      {station.stationName}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
                      {station.address}
                    </p>

                    {/* SHO Details Strip */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: 8,
                        padding: '0.75rem',
                        marginBottom: '0.85rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Station Head (SHO)</span>
                        <strong style={{ color: '#1e293b' }}>{station.shoName}</strong>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>{station.shoRank}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Staff Strength</span>
                        <strong style={{ color: '#1e293b' }}>
                          {station.postedStrength} / {station.sanctionedStrength} posted
                        </strong>
                        <span style={{ color: '#059669', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>
                          {Math.round((station.postedStrength / station.sanctionedStrength) * 100)}% staffed
                        </span>
                      </div>
                    </div>

                    {/* Key Capabilities */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                      {station.womenHelpDeskAvailable && (
                        <span style={{ background: '#fdf2f8', color: '#db2777', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>
                          ✓ Women Help Desk
                        </span>
                      )}
                      {station.childFriendlyUnit && (
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>
                          ✓ Child Friendly Unit
                        </span>
                      )}
                      {station.eFirSupported && (
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>
                          ✓ e-FIR Enabled
                        </span>
                      )}
                    </div>

                    {/* Jurisdiction Tags */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                        Jurisdiction Covers:
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {station.jurisdictionAreas.map((area, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 4,
                              fontSize: '0.72rem',
                            }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <a
                      href={`tel:${station.contactPhone}`}
                      style={{
                        flex: 1,
                        background: '#0f2d59',
                        color: '#ffffff',
                        padding: '0.55rem',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Phone size={14} /> Call Station
                    </a>
                    <button
                      type="button"
                      onClick={() => handleShare(station)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: '0.55rem 0.75rem',
                        cursor: 'pointer',
                        color: '#475569',
                      }}
                      title="Share details"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'zero-fir' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800 }}>
              SUPREME COURT MANDATE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {zeroFirGuide.statutoryBasis}
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
            {zeroFirGuide.title}
          </h2>

          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <h4 style={{ margin: '0 0 0.35rem 0', color: '#92400e', fontSize: '0.9rem', fontWeight: 800 }}>
              ⚠️ Mandatory Duty of Police Officers:
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5 }}>
              {zeroFirGuide.officerRefusalPenalty}
            </p>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem' }}>
            {tr('Your 4 Core Statutory Rights Under Zero-FIR', 'शून्य एफआईआर के तहत आपके ४ मुख्य वैधानिक अधिकार')}
          </h3>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {zeroFirGuide.keyRights.map((right, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    background: '#0f2d59',
                    color: '#ffffff',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#1e293b', fontWeight: 600 }}>{right}</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {zeroFirGuide.keyRightsHi[idx]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/report-issue"
              style={{
                background: '#0f2d59',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              Report Police Non-Registration on JantaX
            </Link>
            <a
              href="https://digitalpolice.gov.in"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#f1f5f9',
                color: '#1e293b',
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              CCTNS Digital Police Portal <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {activeTab === 'efir' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
              Online e-FIR Eligible Categories & Portals
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
              Under Ministry of Home Affairs digital directives, citizens can register e-FIRs for non-violent property theft, document loss, and cyber fraud without visiting a police station.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {efirCategories.map((c, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#047857',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 999,
                      marginBottom: '0.6rem',
                      display: 'inline-block',
                    }}
                  >
                    ✓ 100% Online Registration
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.3rem 0' }}>
                    {c.category}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                    {c.statutorySection}
                  </span>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                      Eligible Incident Types:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#64748b' }}>
                      {c.eligibleOffenses.map((o, idx) => (
                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{o}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                      Mandatory Uploads:
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {c.mandatoryDocuments.map((doc, idx) => (
                        <span key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.15rem 0.4rem', borderRadius: 4, fontSize: '0.7rem', color: '#475569' }}>
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={c.statePortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#1e40af',
                    color: '#ffffff',
                    padding: '0.55rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  File Online e-FIR <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GODL Footnote */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        Police station locations and jurisdiction boundaries sourced from CCTNS, Ministry of Home Affairs, and State Police Gazettes under Government Open Data License (GODL-India).
      </div>
    </div>
  );
}
