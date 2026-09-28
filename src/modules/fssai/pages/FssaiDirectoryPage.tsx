import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  UtensilsCrossed,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShieldCheck,
  Share2,
  ExternalLink,
  FlaskConical,
  Clock,
  Phone,
  Filter,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { fssaiService } from '../services/fssaiService';
import type { FoodEstablishment, RapidHomeTest } from '../types/fssai';

export function FssaiDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '110001';
  const [pinInput, setPinInput] = useState(currentPin);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'establishments' | 'dart-tests'>('establishments');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [districtName, setDistrictName] = useState(loc.district);

  const [establishments, setEstablishments] = useState<FoodEstablishment[]>([]);
  const [loading, setLoading] = useState(true);

  const rapidTests = useMemo(() => fssaiService.getRapidTests(), []);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.district) setDistrictName(acc.district);
    });
  }, [currentPin]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fssaiService.getEstablishmentsByPin(currentPin).then((res) => {
      if (alive) {
        setEstablishments(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [currentPin]);

  const filteredList = useMemo(() => {
    return establishments.filter((e) => {
      const matchesSearch =
        !searchQuery.trim() ||
        e.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.licenseNumber.includes(searchQuery.trim());
      const matchesType = selectedType === 'ALL' || e.businessType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [establishments, searchQuery, selectedType]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length === 6) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShare = (est: FoodEstablishment) => {
    share({
      title: `FSSAI Food Safety Audit — ${est.businessName}`,
      text: `${est.businessName} (FSSAI Lic: ${est.licenseNumber}). Hygiene Rating: ${est.hygieneRating}/5 (${est.hygieneRatingLabel}). Status: ${est.licenseStatus}. Verified via JantaX.`,
      url: window.location.href,
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Consumer Alert Helpline Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          borderRadius: 14,
          padding: '0.85rem 1.25rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 14px rgba(4, 120, 87, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={20} style={{ color: '#a7f3d0' }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              FSSAI National Consumer Food Safety Helpline: 1800-112-100 (Toll-Free)
            </span>
            <span style={{ fontSize: '0.74rem', opacity: 0.9, display: 'block' }}>
              Report food adulteration, expired packaging, and unlicensed commercial kitchens directly to state enforcement officers.
            </span>
          </div>
        </div>

        <a
          href="https://foscos.fssai.gov.in"
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#ffffff',
            color: '#047857',
            padding: '0.35rem 0.85rem',
            borderRadius: 8,
            fontSize: '0.78rem',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          Verify License on FoSCoS <ExternalLink size={12} />
        </a>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              background: '#ecfdf5',
              color: '#047857',
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            {tr('Module 19', 'मॉड्यूल १९')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {tr('FSSAI FoSCoS Public Inspection Register', 'एफएसएसएआई खाद्य सुरक्षा एवं स्वच्छता ऑडिट')}
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
          {tr('Food Hygiene & Safety Inspection Register', 'खाद्य सुरक्षा एवं स्वच्छता निरीक्षण पंजिका')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
          {tr(
            'Official 14-digit FoSCoS license validation, statutory hygiene star ratings (1-5★), sample adulteration violations, and rapid home testing guide.',
            'आधिकारिक १४-अंकीय फॉस्कोस लाइसेंस सत्यापन, स्वच्छता स्टार रेटिंग (१-५★), मिलावट परीक्षण रिकॉर्ड एवं त्वरित घरेलू जांच विधि।'
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
          { id: 'establishments', label: tr('Local Food Outlets & Hygiene Ratings', 'स्थानीय प्रतिष्ठान एवं रेटिंग्स') },
          { id: 'dart-tests', label: tr('DART Home Adulteration Testing Guide', 'घरेलू मिलावट जांच गाइड (DART)') },
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
              color: activeTab === t.id ? '#047857' : '#64748b',
              borderBottom: activeTab === t.id ? '2px solid #047857' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'establishments' && (
        <>
          {/* Filters Bar */}
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
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 260px' }}>
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
                  placeholder="PIN Code"
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
                Change
              </button>
            </form>

            <div style={{ position: 'relative', flex: '2 1 280px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant name or 14-digit FoSCoS license…"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <option value="ALL">All Establishment Types</option>
              <option value="Restaurant & Dine-in">Restaurant & Dine-in</option>
              <option value="Cloud Kitchen & Delivery">Cloud Kitchen & Delivery</option>
              <option value="Dairy & Milk Products">Dairy & Milk Products</option>
              <option value="Sweet Shop & Bakery">Sweet Shop & Bakery</option>
              <option value="Street Food Hub">Street Food Hub</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading FSSAI inspection records for PIN {currentPin}…
            </div>
          ) : filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 12 }}>
              <p style={{ color: '#64748b', fontWeight: 600 }}>No food establishments matching criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {filteredList.map((est) => {
                const statusBg =
                  est.licenseStatus === 'ACTIVE_VALID'
                    ? '#ecfdf5'
                    : est.licenseStatus === 'EXPIRED'
                    ? '#fef2f2'
                    : '#fffbeb';
                const statusColor =
                  est.licenseStatus === 'ACTIVE_VALID'
                    ? '#047857'
                    : est.licenseStatus === 'EXPIRED'
                    ? '#b91c1c'
                    : '#b45309';

                return (
                  <div
                    key={est.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            background: statusBg,
                            color: statusColor,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 999,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                          }}
                        >
                          Lic: {est.licenseStatus.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Valid upto: {est.validUpto}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                        {est.businessName}
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                        {est.businessType} • Lic #{est.licenseNumber}
                      </span>

                      {/* Star Rating Card */}
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: 8,
                          padding: '0.75rem',
                          marginBottom: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 700 }}>
                            FSSAI Hygiene Rating
                          </span>
                          <strong style={{ fontSize: '0.9rem', color: est.hygieneRating >= 4 ? '#059669' : '#b45309' }}>
                            {est.hygieneRatingLabel}
                          </strong>
                        </div>

                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              style={{
                                fill: star <= est.hygieneRating ? '#f59e0b' : 'none',
                                color: star <= est.hygieneRating ? '#f59e0b' : '#cbd5e1',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Findings Box */}
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 700, display: 'block', color: '#1e293b', marginBottom: '0.2rem' }}>
                          Last Inspection ({est.lastInspectionDate}):
                        </span>
                        {est.inspectionFindings}
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Officer: {est.designatedOfficer}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleShare(est)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#2563eb',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Share2 size={13} /> Share Audit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'dart-tests' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
              Detect Adulteration with Rapid Test (DART) Manual
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
              Official quick-check household methods published by FSSAI for immediate preliminary detection of harmful chemical and toxic industrial adulterants.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {rapidTests.map((t, idx) => (
              <div
                key={idx}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <FlaskConical size={16} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                      FSSAI DART Standard
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                    {t.foodItem}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                    Suspected: {t.suspectedAdulterant}
                  </span>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                      Test Procedure:
                    </span>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                      {t.testProcedure}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    <strong style={{ color: '#dc2626' }}>Health Risk: </strong>
                    {t.healthRisk}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footnote */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        Food safety inspection findings and FoSCoS licensing registers sourced from Food Safety and Standards Authority of India (FSSAI) under Government Open Data License (GODL-India).
      </div>
    </div>
  );
}
