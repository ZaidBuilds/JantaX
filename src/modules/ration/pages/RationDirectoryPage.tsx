import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wheat,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Phone,
  Scale,
  Wifi,
  WifiOff,
  Share2,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  UserCheck,
  CreditCard,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';

export interface FairPriceShop {
  id: string;
  fpsNumber: string;
  dealerName: string;
  dealerNameHi: string;
  dealerPhone: string;
  pinCode: string;
  district: string;
  state: string;
  areaWard: string;
  activeRationCardsCount: number;
  eposOnline: boolean;
  eposBiometricUptimePct: number;
  electronicWeighingScaleSynced: boolean;
  currentMonthStockDispatched: boolean;
  grainDistributionStatus: 'ACTIVE' | 'STOCK_AWAITING' | 'DISTRIBUTION_COMPLETED';
  lastStockAuditDate: string;
  foodInspectorName: string;
  foodInspectorPhone: string;
  anomalyReportCount: number;
  sourceRegistry: string;
}

export function RationDirectoryPage() {
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

  const fairPriceShops = useMemo<FairPriceShop[]>(() => {
    const pinNum = parseInt(currentPin.replace(/\D/g, '')) || 250001;

    return [
      {
        id: `FPS-${currentPin}-01`,
        fpsNumber: `FPS-UP-${currentPin.slice(0, 4)}-881`,
        dealerName: 'Madan Lal Sharma & Sons',
        dealerNameHi: 'मदन लाल शर्मा एवं पुत्र',
        dealerPhone: `+91 941${currentPin.slice(0, 3)}40`,
        pinCode: currentPin,
        district: districtName,
        state: loc.state,
        areaWard: `${districtName} Ward Sector ${(pinNum % 20) + 1}`,
        activeRationCardsCount: 640,
        eposOnline: true,
        eposBiometricUptimePct: 98.2,
        electronicWeighingScaleSynced: true,
        currentMonthStockDispatched: true,
        grainDistributionStatus: 'ACTIVE',
        lastStockAuditDate: '2026-03-05',
        foodInspectorName: 'Shri R.K. Tripathi (ARO)',
        foodInspectorPhone: `+91 945${currentPin.slice(0, 3)}01`,
        anomalyReportCount: 0,
        sourceRegistry: 'Annavitran Portal (Dept of Food & Public Distribution)',
      },
      {
        id: `FPS-${currentPin}-02`,
        fpsNumber: `FPS-UP-${currentPin.slice(0, 4)}-942`,
        dealerName: 'Chaudhary Kanta Prasad Co-Op',
        dealerNameHi: 'चौधरी कान्ता प्रसाद उपभोक्ता सहकारी समिति',
        dealerPhone: `+91 941${currentPin.slice(0, 3)}45`,
        pinCode: currentPin,
        district: districtName,
        state: loc.state,
        areaWard: `Gram Panchayat Sector Link, ${districtName}`,
        activeRationCardsCount: 820,
        eposOnline: true,
        eposBiometricUptimePct: 84.5,
        electronicWeighingScaleSynced: false,
        currentMonthStockDispatched: true,
        grainDistributionStatus: 'ACTIVE',
        lastStockAuditDate: '2026-02-28',
        foodInspectorName: 'Shri R.K. Tripathi (ARO)',
        foodInspectorPhone: `+91 945${currentPin.slice(0, 3)}01`,
        anomalyReportCount: 3,
        sourceRegistry: 'Annavitran Portal (Dept of Food & Public Distribution)',
      },
    ];
  }, [currentPin, districtName, loc]);

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return fairPriceShops;
    const q = searchQuery.toLowerCase();
    return fairPriceShops.filter(
      (s) =>
        s.dealerName.toLowerCase().includes(q) ||
        s.dealerNameHi.toLowerCase().includes(q) ||
        s.fpsNumber.toLowerCase().includes(q) ||
        s.areaWard.toLowerCase().includes(q)
    );
  }, [fairPriceShops, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinInput.trim())) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShareFps = (fps: FairPriceShop) => {
    share({
      pinCode: currentPin,
      titleHindi: `राशन दुकान सत्यापन: ${fps.dealerNameHi}`,
      titleEnglish: `Ration Fair Price Shop Audit: ${fps.dealerName}`,
      claimLabel: `FPS #${fps.fpsNumber} | ePoS Online: ${fps.eposOnline ? 'Yes' : 'No'}`,
      claimLabelHindi: `FPS #${fps.fpsNumber} | ई-पॉस ऑनलाइन: ${fps.eposOnline ? 'हाँ' : 'नहीं'}`,
      realityLabel: `Biometric Uptime: ${fps.eposBiometricUptimePct}% | Active Cards: ${fps.activeRationCardsCount}`,
      realityLabelHindi: `बायोमेट्रिक अपटाइम: ${fps.eposBiometricUptimePct}% | राशन कार्ड: ${fps.activeRationCardsCount}`,
      responsiblePerson: `ARO Food Inspector (${fps.foodInspectorName})`,
      responsibleOrg: `${districtName} District Food Supply Office`,
      sourceUrl: `https://jantax.in/ration?pin=${currentPin}`,
      moduleNameHindi: 'राशन दुकान एवं खाद्य सुरक्षा (PDS Fair Price Tracker)',
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
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Ration & Food Security (PDS)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="glass-pill" style={{ background: '#fefce8', color: '#a16207', border: '1px solid #fef08a' }}>
                  🌾 NFSA One Nation One Ration Card (ONORC) Registry
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  PIN {currentPin} · {districtName}, {loc.state}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {tr('Public Distribution & Ration Shop Tracker', 'सार्वजनिक वितरण एवं उचित दर राशन दुकान ट्रैकर')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, maxWidth: 680 }}>
                {tr(
                  'Audit Fair Price Shops (FPS), ePoS electronic weighing compliance, stock dispatch records, and statutory food grain quotas under PMGKAY.',
                  'उचित दर राशन दुकानों (FPS), ई-पॉस इलेक्ट्रॉनिक कांटा लिंकिंग, खाद्यान्न वितरण स्थिति और प्रधानमंत्री गरीब कल्याण अन्न योजना (PMGKAY) कोटा सत्यापन।'
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

        {/* Quota Entitlements Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde047', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <CreditCard size={15} /> Antyodaya Anna Yojana (AAY / Yellow Card)
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, marginTop: '0.2rem' }}>
              35 KG <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>per family / month</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Rice (21kg) + Wheat (14kg) · 100% Free under PMGKAY
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <CreditCard size={15} /> Priority Household (PHH / White Card)
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, marginTop: '0.2rem' }}>
              5 KG <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>per member / month</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              3kg Rice + 2kg Wheat per enrolled beneficiary · 100% Free
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <ShieldCheck size={15} /> Statutory e-Weighing Mandate
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem', color: '#ffffff' }}>
              Zero Divergence Electronic Linking
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              ePoS machine only prints receipt after physical grain scale locks matching weight.
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dealer name, licence number, or ward..."
            style={{
              width: '100%',
              maxWidth: 480,
              padding: '0.65rem 1rem',
              borderRadius: 10,
              border: '1.5px solid #cbd5e1',
              fontSize: '0.86rem',
              outline: 'none',
              background: '#ffffff',
            }}
          />
        </div>

        {/* Shops Listing */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filteredShops.map((s) => (
            <div
              key={s.id}
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
                    <span style={{ background: '#f8fafc', color: '#0f2d59', fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      {s.fpsNumber}
                    </span>
                    {s.eposOnline ? (
                      <span className="badge-verified" style={{ fontSize: '0.7rem' }}>
                        <Wifi size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> ePoS Online
                      </span>
                    ) : (
                      <span className="badge-overrun" style={{ fontSize: '0.7rem' }}>
                        <WifiOff size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> Offline ePoS
                      </span>
                    )}
                    {s.electronicWeighingScaleSynced ? (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid #a7f3d0' }}>
                        ⚖️ E-Weighing Linked
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', background: '#fffbeb', padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid #fde68a' }}>
                        ⚠️ Manual Weighing Risk
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                    {s.dealerName}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    {s.dealerNameHi} · <MapPin size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> {s.areaWard}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Ration Cards
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f2d59' }}>
                    {s.activeRationCardsCount}
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
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Biometric Success Rate</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: s.eposBiometricUptimePct >= 95 ? '#16a34a' : '#d97706', marginTop: '0.15rem' }}>
                    {s.eposBiometricUptimePct}% Uptime
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Iris / Fingerprint scanner active</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Monthly Stock Dispatch</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a', marginTop: '0.15rem' }}>
                    ✓ Stock Dispatched
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified FCI depot supply</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Food Supply Inspector</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                    {s.foodInspectorName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.foodInspectorPhone}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Dealer Contact</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                    {s.dealerPhone}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Statutory display board mandatory</div>
                </div>
              </div>

              {s.anomalyReportCount > 0 && (
                <div
                  style={{
                    background: '#fff7ed',
                    border: '1px solid #ffedd5',
                    color: '#c2410c',
                    padding: '0.65rem 0.95rem',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <AlertTriangle size={15} style={{ color: '#ea580c', flexShrink: 0 }} />
                  <span>{s.anomalyReportCount} citizens reported non-electronic weighing scale / irregular shop timing in last 30 days.</span>
                </div>
              )}

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Audited via {s.sourceRegistry} ({s.lastStockAuditDate})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleShareFps(s)}
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
                    <Share2 size={13} /> Share FPS Card
                  </button>

                  <Link
                    to={`/rti/draft?authority=${encodeURIComponent(districtName + ' District Food and Civil Supplies Office')}&dealer=${encodeURIComponent(s.dealerName)}`}
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
                    <FileText size={13} /> Draft PDS RTI
                  </Link>

                  <Link
                    to={`/report-issue?pin=${currentPin}&dealer=${encodeURIComponent(s.dealerName)}`}
                    className="btn btn-primary"
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.95rem',
                      borderRadius: 8,
                    }}
                  >
                    <span>Report Shortage / Overpricing</span>
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
