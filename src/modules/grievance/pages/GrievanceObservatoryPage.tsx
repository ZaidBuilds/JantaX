import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingDown,
  Building2,
  Search,
  Share2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';

export interface DepartmentGrievanceMetric {
  id: string;
  departmentName: string;
  departmentNameHi: string;
  ministry: string;
  totalGrievancesLogged: number;
  resolvedWithin30DaysPct: number;
  averageDisposalDays: number;
  citizenSatisfactionRatePct: number;
  firstAppealEscalationRatePct: number;
  status: 'EXEMPLARY' | 'MODERATE' | 'CHRONIC_DELAY';
  topComplaintType: string;
  nodalOfficer: string;
}

export function GrievanceObservatoryPage() {
  const [searchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '250001';
  const [searchQuery, setSearchQuery] = useState('');
  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const departmentMetrics = useMemo<DepartmentGrievanceMetric[]>(() => [
    {
      id: 'DEPT-POLICE',
      departmentName: 'State Police & Law Enforcement',
      departmentNameHi: 'राज्य पुलिस एवं कानून व्यवस्था',
      ministry: 'Ministry of Home Affairs / State Home Dept',
      totalGrievancesLogged: 48200,
      resolvedWithin30DaysPct: 42,
      averageDisposalDays: 68,
      citizenSatisfactionRatePct: 34,
      firstAppealEscalationRatePct: 48,
      status: 'CHRONIC_DELAY',
      topComplaintType: 'Non-registration of FIR & delayed chowki investigation',
      nodalOfficer: 'Additional Director General (Grievance)',
    },
    {
      id: 'DEPT-REVENUE',
      departmentName: 'Revenue & Tehsil Administration',
      departmentNameHi: 'राजस्व एवं तहसील प्रशासन',
      ministry: 'State Revenue Department',
      totalGrievancesLogged: 36400,
      resolvedWithin30DaysPct: 51,
      averageDisposalDays: 58,
      citizenSatisfactionRatePct: 39,
      firstAppealEscalationRatePct: 41,
      status: 'CHRONIC_DELAY',
      topComplaintType: 'Pending mutation (Dakhil-Kharij) and demarcation dispute',
      nodalOfficer: 'Chief Revenue Officer (CRO)',
    },
    {
      id: 'DEPT-PWD',
      departmentName: 'Public Works Department (State PWD & NHAI)',
      departmentNameHi: 'लोक निर्माण विभाग (पीडब्ल्यूडी)',
      ministry: 'Ministry of Road Transport & Highways',
      totalGrievancesLogged: 24100,
      resolvedWithin30DaysPct: 68,
      averageDisposalDays: 38,
      citizenSatisfactionRatePct: 56,
      firstAppealEscalationRatePct: 29,
      status: 'MODERATE',
      topComplaintType: 'Potholed arterial roads & stalled drainage culverts',
      nodalOfficer: 'Superintending Engineer (Grievances)',
    },
    {
      id: 'DEPT-POWER',
      departmentName: 'Electricity Distribution Corporation (DISCOM)',
      departmentNameHi: 'विद्युत वितरण निगम (डिस्कॉम)',
      ministry: 'Ministry of Power',
      totalGrievancesLogged: 31200,
      resolvedWithin30DaysPct: 79,
      averageDisposalDays: 24,
      citizenSatisfactionRatePct: 68,
      firstAppealEscalationRatePct: 18,
      status: 'MODERATE',
      topComplaintType: 'Faulty smart meter reading & erratic transformer burns',
      nodalOfficer: 'Chief Engineer (Commercial)',
    },
    {
      id: 'DEPT-POST',
      departmentName: 'Department of Posts & Banking Services',
      departmentNameHi: 'डाक विभाग एवं वित्तीय सेवाएं',
      ministry: 'Ministry of Communications',
      totalGrievancesLogged: 12800,
      resolvedWithin30DaysPct: 91,
      averageDisposalDays: 14,
      citizenSatisfactionRatePct: 84,
      firstAppealEscalationRatePct: 8,
      status: 'EXEMPLARY',
      topComplaintType: 'Registered speed post delay / Aadhaar biometric update',
      nodalOfficer: 'Assistant Director General (PG)',
    },
  ], []);

  const filteredMetrics = useMemo(() => {
    if (!searchQuery.trim()) return departmentMetrics;
    const q = searchQuery.toLowerCase();
    return departmentMetrics.filter(
      (d) =>
        d.departmentName.toLowerCase().includes(q) ||
        d.departmentNameHi.toLowerCase().includes(q) ||
        d.topComplaintType.toLowerCase().includes(q)
    );
  }, [departmentMetrics, searchQuery]);

  return (
    <div style={{ padding: '2rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>CPGRAMS Grievance Redressal Observatory</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="glass-pill" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  ⚖️ DARPG & DoPT Central Grievance Audit
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Statutory 30-Day Disposal Mandate (DoPT OM 2024)
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {tr('Public Grievance Redressal & Appeal Observatory', 'सार्वजनिक शिकायत निवारण एवं अपील वेधशाला')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, maxWidth: 680 }}>
                {tr(
                  'Independent citizen audit of CPGRAMS & state CM Helpline grievances: tracking bureaucratic delay, superficial closures, and first appeal escalation rates across public departments.',
                  'सीपीग्राम्स (CPGRAMS) एवं मुख्यमंत्री जनसुनवाई पोर्टल शिकायतों की निष्पक्ष जांच: विभागों की फाइलों में फर्जी निस्तारण (Superficial Disposal), औसत विलंब और प्रथम अपीलों का वास्तविक लेखा-जोखा।'
                )}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.15rem', fontSize: '0.84rem' }}
              >
                <span>CPGRAMS Official Portal</span>
                <ExternalLink size={14} />
              </a>
              <Link
                to={`/report-issue?pin=${currentPin}`}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.15rem' }}
              >
                <span>File Citizen Evidence</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Highlight KPI Radar */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
            borderRadius: 16,
            padding: '1.5rem',
            color: '#ffffff',
            marginBottom: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-hover)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Statutory Disposal Target
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
              30 Days
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>DoPT Union Mandate for Central/State bodies</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Average Real Resolution Time
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fb923c', marginTop: '0.2rem' }}>
              48.2 Days
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>+18.2 days beyond statutory mandate</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Citizen Appeal Escalation Rate
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f87171', marginTop: '0.2rem' }}>
              34.8%
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Complaints rejected as 'superficially disposed'</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Audit Sample Base
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', marginTop: '0.2rem' }}>
              152,700+
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Public grievances audited across 28 states</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by department name, ministry, or issue type..."
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

        {/* Department Grievance Cards */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filteredMetrics.map((d) => (
            <div
              key={d.id}
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
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6, background: d.status === 'EXEMPLARY' ? '#ecfdf5' : d.status === 'MODERATE' ? '#fffbeb' : '#fef2f2', color: d.status === 'EXEMPLARY' ? '#047857' : d.status === 'MODERATE' ? '#b45309' : '#b91c1c' }}>
                      {d.status === 'EXEMPLARY' ? '✓ Exemplary Resolution' : d.status === 'MODERATE' ? '⚡ Moderate Compliance' : '⚠️ Chronic Delay & Backlog'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{d.ministry}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                    {d.departmentName}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    {d.departmentNameHi} · Nodal Officer: {d.nodalOfficer}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Citizen Satisfaction
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: d.citizenSatisfactionRatePct >= 75 ? '#16a34a' : d.citizenSatisfactionRatePct >= 50 ? '#d97706' : '#b91c1c' }}>
                    {d.citizenSatisfactionRatePct}%
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
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
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Resolved in 30-Day Mandate</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: d.resolvedWithin30DaysPct >= 70 ? '#16a34a' : '#d97706', marginTop: '0.15rem' }}>
                    {d.resolvedWithin30DaysPct}% Compliance
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Average Disposal Time</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: d.averageDisposalDays <= 30 ? '#16a34a' : '#b91c1c', marginTop: '0.15rem' }}>
                    {d.averageDisposalDays} Days
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>SLA Target: 30 days</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>First Appeal Escalation</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: d.firstAppealEscalationRatePct > 35 ? '#b91c1c' : '#0f2d59', marginTop: '0.15rem' }}>
                    {d.firstAppealEscalationRatePct}% Appeals
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Citizens disputing closure</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Total Grievances Audited</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.15rem' }}>
                    {d.totalGrievancesLogged.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#334155', background: '#f1f5f9', padding: '0.65rem 0.95rem', borderRadius: 8, marginBottom: '1rem' }}>
                <strong>Top Grievance Bottleneck:</strong> {d.topComplaintType}
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.65rem' }}>
                <Link
                  to={`/rti/draft?authority=${encodeURIComponent(d.departmentName)}&topic=grievance_disposal`}
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
                  <FileText size={13} /> Draft Section 6(1) RTI on Pending Grievance
                </Link>

                <a
                  href="https://pgportal.gov.in/Registration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.4rem 0.95rem',
                    borderRadius: 8,
                  }}
                >
                  <span>File CPGRAMS Grievance</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
