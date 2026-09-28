import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Share2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { epfoService } from '../services/epfoService';
import type { EpfoOffice, EpfoClaimType, EpfoEscalationLevel } from '../types/epfo';

export function EpfoDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '110001';
  const [pinInput, setPinInput] = useState(currentPin);
  const [activeTab, setActiveTab] = useState<'offices' | 'claims' | 'escalation'>('offices');

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [districtName, setDistrictName] = useState(loc.district);

  const [offices, setOffices] = useState<EpfoOffice[]>([]);
  const [loading, setLoading] = useState(true);

  const claimTypes = useMemo(() => epfoService.getClaimTypes(), []);
  const escalationLevels = useMemo(() => epfoService.getEscalationLevels(), []);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.district) setDistrictName(acc.district);
    });
  }, [currentPin]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    epfoService.getEpfoOfficesByPin(currentPin).then((res) => {
      if (alive) {
        setOffices(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [currentPin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length === 6) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShare = (office: EpfoOffice) => {
    share({
      title: `EPFO Regional Office & Settlement Clock — ${office.officeName}`,
      text: `EPFO Regional Office for PIN ${currentPin}: ${office.officeName}. Avg settlement: ${office.actualAverageSettlementDays} days (SLA: 20d). Rejection rate: ${office.rejectionRatePct}%. RPFC: ${office.regionalCommissioner}. Track via JantaX.`,
      url: window.location.href,
    });
  };

  const primaryOffice = offices[0];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
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
            {tr('Module 18', 'मॉड्यूल १८')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {tr('EPFO & Pension Settlement Accountability', 'कर्मचारी भविष्य निधि एवं पेंशन निस्तारण')}
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
          {tr('EPFO Turnaround & Claim Settlement Tracker', 'पीएफ एवं पेंशन दावा निस्तारण ट्रैकर')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
          {tr(
            'Statutory 20-day Citizen Charter settlement adherence, regional office rejection rate audits, and 3-tier EPFiGMS grievance escalation.',
            'नागरिक चार्टर के २०-दिवसीय निस्तारण नियम, क्षेत्रीय कार्यालय रिजेक्शन दर ऑडिट एवं ३-स्तरीय शिकायत निवारण सीढ़ी।'
          )}
        </p>
      </div>

      {/* KPI Cards Row */}
      {primaryOffice && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ background: '#ffffff', padding: '1.15rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Statutory Settlement SLA
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>20</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Days Mandated</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>EPFO Citizen Charter 2024</span>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Ground Actual Average
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: primaryOffice.actualAverageSettlementDays > 20 ? '#b45309' : '#047857',
                }}
              >
                {primaryOffice.actualAverageSettlementDays}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Days Turnaround</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Current Month Processing</span>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Claim Rejection Rate
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626' }}>
                {primaryOffice.rejectionRatePct}%
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Rejected/Returned</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>Due to Name/IFSC Mismatch</span>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Grievance Backlog &gt;30d
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ea580c' }}>
                {primaryOffice.grievancesPendingOver30Days}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cases Delayed</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>Pending Over SLA Window</span>
          </div>
        </div>
      )}

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
          { id: 'offices', label: tr('Designated Field Office', 'नामित क्षेत्रीय कार्यालय') },
          { id: 'claims', label: tr('Claim Forms & Rejection Checker', 'दावा प्रपत्र व रिजेक्शन नियम') },
          { id: 'escalation', label: tr('3-Tier Grievance Escalation Ladder', '३-स्तरीय शिकायत निवारण सीढ़ी') },
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

      {activeTab === 'offices' && (
        <>
          {/* PIN Filter */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              background: '#ffffff',
              padding: '1rem',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              flexWrap: 'wrap',
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
                {tr('Resolve Office', 'खोजें')}
              </button>
            </form>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading designated EPFO office for PIN {currentPin}…
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {offices.map((office) => (
                <div
                  key={office.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, display: 'inline-block', marginBottom: '0.35rem' }}>
                        {office.officeType}
                      </span>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {office.officeName}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                        {office.address}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleShare(office)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: '0.5rem 0.85rem',
                        cursor: 'pointer',
                        color: '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Share2 size={14} /> Share Office Info
                    </button>
                  </div>

                  {/* Office Info Grid */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                        Regional P.F. Commissioner
                      </span>
                      <strong style={{ color: '#1e293b' }}>{office.regionalCommissioner}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                        Official Email Address
                      </span>
                      <a href={`mailto:${office.contactEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {office.contactEmail}
                      </a>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                        EPFO Helpdesk Phone
                      </span>
                      <span style={{ color: '#1e293b', fontWeight: 600 }}>{office.contactPhone}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                        Claims Settled This Month
                      </span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        {office.claimsSettledThisMonth.toLocaleString()} claims
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href="https://unifiedportal-mem.epfindia.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        padding: '0.6rem 1.15rem',
                        borderRadius: 8,
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      Member Portal Login <ExternalLink size={14} />
                    </a>
                    <a
                      href="https://epfigms.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '0.6rem 1.15rem',
                        borderRadius: 8,
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      File EPFiGMS Grievance <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'claims' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {claimTypes.map((c, i) => (
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
                    background: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 999,
                    marginBottom: '0.6rem',
                    display: 'inline-block',
                  }}
                >
                  {c.formNumber}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.85rem 0' }}>
                  {c.purpose}
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: 8,
                    padding: '0.65rem 0.85rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ color: '#64748b', display: 'block' }}>Statutory Turnaround:</span>
                  <strong style={{ color: '#059669' }}>{c.statutoryDays} Days Maximum</strong>
                  {c.autoSettlementLimit > 0 && (
                    <span style={{ color: '#2563eb', display: 'block', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                      ⚡ Auto-mode eligible up to ₹{c.autoSettlementLimit.toLocaleString()}
                    </span>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b91c1c', display: 'block', marginBottom: '0.35rem' }}>
                    Top Rejection Traps to Avoid:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#64748b' }}>
                    {c.commonRejectionReasons.map((r, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href="https://unifiedportal-mem.epfindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    background: '#f1f5f9',
                    color: '#1e293b',
                    padding: '0.55rem',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Submit Online Claim
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'escalation' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Statutory Delayed Claim Escalation Ladder
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1.5rem 0' }}>
            If your PF withdrawal or pension claim exceeds 20 days without settlement, follow this legally binding escalation hierarchy:
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.75rem' }}>
            {escalationLevels.map((lvl) => (
              <div
                key={lvl.level}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    background: lvl.level === 3 ? '#dc2626' : lvl.level === 2 ? '#b45309' : '#047857',
                    color: '#ffffff',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {lvl.level}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {lvl.designation}
                    </h3>
                    <span style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>
                      SLA: {lvl.statutoryWindowDays} Days
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.25rem 0 0.5rem 0' }}>
                    Authority: {lvl.actionAuthority}
                  </p>
                  <a
                    href={lvl.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#2563eb',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    Open Grievance Portal <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footnote */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        EPFO public statistics and Regional Office jurisdiction data sourced from Employees' Provident Fund Organisation under Government Open Data License (GODL-India).
      </div>
    </div>
  );
}
