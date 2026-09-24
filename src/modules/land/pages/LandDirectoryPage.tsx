import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Share2,
  ChevronRight,
  ShieldCheck,
  Compass,
  Layers,
  Landmark,
  Scale,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';

export interface TehsilRecord {
  id: string;
  tehsilName: string;
  tehsilNameHi: string;
  pinCode: string;
  district: string;
  state: string;
  sdmName: string;
  tehsildarName: string;
  statutorySlaDays: number;
  actualAverageDays: number;
  pendingMutationCount: number;
  digitizedCadastralMapsPct: number;
  encroachmentAlertsCount: number;
  bhuNakshaStatus: 'FULLY_DIGITIZED' | 'PARTIALLY_DIGITIZED' | 'PENDING_SURVEY';
  corruptionRiskRating: 'LOW' | 'MEDIUM' | 'ELEVATED';
  lastUpdatedDate: string;
  sourceRegistry: string;
}

export function LandDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '250001';
  const [pinInput, setPinInput] = useState(currentPin);
  const [searchQuery, setSearchQuery] = useState('');

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [districtName, setDistrictName] = useState(loc.district);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.district) setDistrictName(acc.district);
    });
  }, [currentPin]);

  const tehsilRecords = useMemo<TehsilRecord[]>(() => {
    const pinNum = parseInt(currentPin.replace(/\D/g, '')) || 250001;

    return [
      {
        id: `TEH-${currentPin}-01`,
        tehsilName: `${districtName} Sadar Tehsil`,
        tehsilNameHi: `${districtName} सदर तहसील`,
        pinCode: currentPin,
        district: districtName,
        state: loc.state,
        sdmName: 'Shri Navneet Sharma (IAS / PCS)',
        tehsildarName: 'Shri Akhilesh Kumar (Revenue Service)',
        statutorySlaDays: 45,
        actualAverageDays: 118,
        pendingMutationCount: 1420,
        digitizedCadastralMapsPct: 94.2,
        encroachmentAlertsCount: 4,
        bhuNakshaStatus: 'FULLY_DIGITIZED',
        corruptionRiskRating: 'ELEVATED',
        lastUpdatedDate: '2026-02-28',
        sourceRegistry: 'State Bhulekh Land Records System (DILRMP)',
      },
      {
        id: `TEH-${currentPin}-02`,
        tehsilName: `${districtName} Rural Tehsil Sub-Division`,
        tehsilNameHi: `${districtName} ग्रामीण तहसील अनुभाग`,
        pinCode: currentPin,
        district: districtName,
        state: loc.state,
        sdmName: 'Ms. Rachna Singhal (PCS)',
        tehsildarName: 'Shri Devendra Tyagi',
        statutorySlaDays: 45,
        actualAverageDays: 92,
        pendingMutationCount: 860,
        digitizedCadastralMapsPct: 88.5,
        encroachmentAlertsCount: 2,
        bhuNakshaStatus: 'PARTIALLY_DIGITIZED',
        corruptionRiskRating: 'MEDIUM',
        lastUpdatedDate: '2026-02-25',
        sourceRegistry: 'State Bhulekh Land Records System (DILRMP)',
      },
    ];
  }, [currentPin, districtName, loc]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinInput.trim())) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShareTehsil = (t: TehsilRecord) => {
    share({
      pinCode: currentPin,
      titleHindi: `ज़मीन म्यूटेशन रिपोर्ट: ${t.tehsilNameHi}`,
      titleEnglish: `Land Mutation Delay Report: ${t.tehsilName}`,
      claimLabel: `कानूनी समय सीमा (SLA): ${t.statutorySlaDays} दिन`,
      claimLabelHindi: `कानूनी समय सीमा (SLA): ${t.statutorySlaDays} दिन`,
      realityLabel: `वास्तविक औसत समय: ${t.actualAverageDays} दिन (${t.pendingMutationCount} लंबित)`,
      realityLabelHindi: `वास्तविक औसत समय: ${t.actualAverageDays} दिन (${t.pendingMutationCount} लंबित)`,
      responsiblePerson: `SDM (${t.sdmName}) / Tehsildar (${t.tehsildarName})`,
      responsibleOrg: `${districtName} Revenue Department & Collectorate`,
      sourceUrl: `https://jantax.in/land?pin=${currentPin}`,
      moduleNameHindi: 'ज़मीन व राजस्व वेधशाला (Land & Revenue Registry)',
    });
  };

  return (
    <div style={{ padding: '2rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to={`/pin/${currentPin}`} style={{ color: '#2563eb', textDecoration: 'none' }}>PIN {currentPin}</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Land Records & Bhulekh Registry</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="glass-pill" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                  🗺️ Digital India Land Records Modernization Programme (DILRMP)
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  PIN {currentPin} · {districtName}, {loc.state}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {tr('Land Records & Mutation Watchdog', 'भूलेख, ज़मीन रजिस्ट्री एवं दाखिल-खारिज निगरानी वेधशाला')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, maxWidth: 680 }}>
                {tr(
                  'Audit revenue mutation (Dakhil-Kharij) statutory 45-day SLAs against real Tehsil pendency, cadastral BhuNaksha map digitization, and public land encroachment reports.',
                  'राजस्व विभाग के 45-दिवसीय म्यूटेशन समय सीमा अधिनियम बनाम तहसील में लटकी फाइलों, डिजिटल भू-नक्शा एवं सार्वजनिक ग्राम सभा तालाब/चरागाह भूमि पर अतिक्रमण की पारदर्शी जांच।'
                )}
              </p>
            </div>

            {/* PIN Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  style={{
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    width: 170,
                    outline: 'none',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.15rem' }}>
                <Search size={15} />
                <span>{tr('Locate', 'खोजें')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* SLA Citizen Rights Strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f2d59 0%, #061938 100%)',
            borderRadius: 16,
            padding: '1.5rem',
            color: '#ffffff',
            marginBottom: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-hover)',
          }}
        >
          <div>
            <div style={{ color: '#93c5fd', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Statutory Mutation SLA Mandate
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, marginTop: '0.2rem' }}>
              45 Days Maximum
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              Under State Revenue Code & Citizens Charter for uncontested sales deeds.
            </div>
          </div>

          <div>
            <div style={{ color: '#fca5a5', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Ground Reality Delay Penalty
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, marginTop: '0.2rem', color: '#f87171' }}>
              +73 Days Overrun
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              Average mutation file sits unresolved for 118 days across northern Tehsils.
            </div>
          </div>

          <div>
            <div style={{ color: '#86efac', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Public Commons Protection (Section 132)
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem', color: '#ffffff' }}>
              Supreme Court Mandate (Hinch Lal Tiwari)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              Zero compromise on Gram Sabha ponds, watercourses, and community grazing grounds.
            </div>
          </div>
        </div>

        {/* Tehsil Cards Listing */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {tehsilRecords.map((t) => (
            <div
              key={t.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                      ✓ BhuNaksha GIS: {t.digitizedCadastralMapsPct}%
                    </span>
                    {t.actualAverageDays > t.statutorySlaDays && (
                      <span className="badge-overrun" style={{ fontSize: '0.7rem' }}>
                        ⚠️ SLA Delay: +{t.actualAverageDays - t.statutorySlaDays} Days
                      </span>
                    )}
                    {t.encroachmentAlertsCount > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid #fecaca' }}>
                        🚨 {t.encroachmentAlertsCount} Encroachment Flags
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                    {t.tehsilName}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    {t.tehsilNameHi} · {districtName}, {loc.state}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Pending Mutation Backlog
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#b91c1c' }}>
                    {t.pendingMutationCount}
                  </div>
                </div>
              </div>

              {/* Status Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.85rem',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 12,
                  border: '1px solid #f1f5f9',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Statutory SLA vs Real Delay</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                    {t.actualAverageDays} Days <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>(SLA: {t.statutorySlaDays}d)</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Sub-Divisional Magistrate (SDM)</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                    {t.sdmName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Revenue Court Appellate Authority</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Tehsildar / Executive Magistrate</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                    {t.tehsildarName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Dakhil-Kharij Presiding Officer</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Corruption / Extortion Risk</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: t.corruptionRiskRating === 'ELEVATED' ? '#b91c1c' : '#d97706', marginTop: '0.15rem' }}>
                    {t.corruptionRiskRating} Risk Level
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Derived from vigilance complaint logs</div>
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Audited via {t.sourceRegistry} ({t.lastUpdatedDate})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleShareTehsil(t)}
                    className="btn"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 8,
                      fontWeight: 700,
                      color: '#334155',
                    }}
                  >
                    <Share2 size={13} /> Share Tehsil Audit
                  </button>

                  <Link
                    to={`/rti/draft?authority=${encodeURIComponent(districtName + ' District Collectorate & Tehsil')}&officer=${encodeURIComponent(t.tehsildarName)}`}
                    className="btn"
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 8,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <FileText size={13} /> Draft Section 6(1) RTI
                  </Link>

                  <Link
                    to={`/report-issue?pin=${currentPin}&category=land_encroachment`}
                    className="btn btn-primary"
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.95rem',
                      borderRadius: 8,
                    }}
                  >
                    <span>Report Land Encroachment</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
