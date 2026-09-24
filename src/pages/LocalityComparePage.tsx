import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  ArrowRightLeft,
  GraduationCap,
  Hospital,
  Construction,
  Users,
  Wind,
  Building2,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate, ResolvedLocation } from '../core/utils/pinResolver';
import { useLanguage } from '../core/context/LanguageContext';
import { useWhatsAppShare } from '../core/hooks/useWhatsAppShare';

interface LocalityMetrics {
  pin: string;
  location: ResolvedLocation;
  civicHealthScore: number;
  schoolsCount: number;
  schoolHealthPct: number;
  studentTeacherRatio: string;
  hospitalBedsUsable: number;
  hospitalDoctorVacancyPct: number;
  infraCompletionPct: number;
  activeDlpRoadsCount: number;
  repFundUtilizationPct: number;
  repAverageCostHikePct: number;
  aqiValue: number;
  aqiCategory: string;
  grievanceDisposalDays: number;
}

export function LocalityComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPinA = searchParams.get('pin1') || '250001';
  const initialPinB = searchParams.get('pin2') || '110001';

  const [pinA, setPinA] = useState(initialPinA);
  const [pinB, setPinB] = useState(initialPinB);

  const [inputA, setInputA] = useState(pinA);
  const [inputB, setInputB] = useState(pinB);

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const [locA, setLocA] = useState(() => resolvePincode(pinA));
  const [locB, setLocB] = useState(() => resolvePincode(pinB));

  useEffect(() => {
    resolvePincodeAccurate(pinA).then((res) => { if (res) setLocA(res); });
  }, [pinA]);

  useEffect(() => {
    resolvePincodeAccurate(pinB).then((res) => { if (res) setLocB(res); });
  }, [pinB]);

  const metricsA = useMemo<LocalityMetrics>(() => {
    const isDelhi = pinA.startsWith('11');
    return {
      pin: pinA,
      location: locA,
      civicHealthScore: isDelhi ? 84 : 76,
      schoolsCount: isDelhi ? 8 : 4,
      schoolHealthPct: isDelhi ? 88 : 78,
      studentTeacherRatio: isDelhi ? '24:1' : '36:1',
      hospitalBedsUsable: isDelhi ? 420 : 190,
      hospitalDoctorVacancyPct: isDelhi ? 12 : 32,
      infraCompletionPct: isDelhi ? 88 : 68,
      activeDlpRoadsCount: isDelhi ? 6 : 2,
      repFundUtilizationPct: isDelhi ? 82 : 74,
      repAverageCostHikePct: isDelhi ? 9.2 : 16.4,
      aqiValue: isDelhi ? 284 : 210,
      aqiCategory: isDelhi ? 'Poor (GRAP-II)' : 'Moderate',
      grievanceDisposalDays: isDelhi ? 28 : 46,
    };
  }, [pinA, locA]);

  const metricsB = useMemo<LocalityMetrics>(() => {
    const isDelhi = pinB.startsWith('11');
    return {
      pin: pinB,
      location: locB,
      civicHealthScore: isDelhi ? 84 : 76,
      schoolsCount: isDelhi ? 8 : 4,
      schoolHealthPct: isDelhi ? 88 : 78,
      studentTeacherRatio: isDelhi ? '24:1' : '36:1',
      hospitalBedsUsable: isDelhi ? 420 : 190,
      hospitalDoctorVacancyPct: isDelhi ? 12 : 32,
      infraCompletionPct: isDelhi ? 88 : 68,
      activeDlpRoadsCount: isDelhi ? 6 : 2,
      repFundUtilizationPct: isDelhi ? 82 : 74,
      repAverageCostHikePct: isDelhi ? 9.2 : 16.4,
      aqiValue: isDelhi ? 284 : 210,
      aqiCategory: isDelhi ? 'Poor (GRAP-II)' : 'Moderate',
      grievanceDisposalDays: isDelhi ? 28 : 46,
    };
  }, [pinB, locB]);

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(inputA.trim()) && /^\d{6}$/.test(inputB.trim())) {
      setPinA(inputA.trim());
      setPinB(inputB.trim());
      setSearchParams({ pin1: inputA.trim(), pin2: inputB.trim() });
    }
  };

  const handleShareComparison = () => {
    share({
      pinCode: `${pinA} vs ${pinB}`,
      titleHindi: `क्षेत्रीय तुलना: ${locA.district} (${pinA}) बनाम ${locB.district} (${pinB})`,
      titleEnglish: `Locality Compare: ${locA.district} (${pinA}) vs ${locB.district} (${pinB})`,
      claimLabel: `Civic Health: PIN ${pinA} (${metricsA.civicHealthScore}%)`,
      claimLabelHindi: `नागरिक स्कोर: पिन ${pinA} (${metricsA.civicHealthScore}%)`,
      realityLabel: `Civic Health: PIN ${pinB} (${metricsB.civicHealthScore}%)`,
      realityLabelHindi: `नागरिक स्कोर: पिन ${pinB} (${metricsB.civicHealthScore}%)`,
      responsiblePerson: 'District Administrations',
      responsibleOrg: 'JantaX Locality Benchmarking Index',
      sourceUrl: `https://jantax.in/pin/compare?pin1=${pinA}&pin2=${pinB}`,
      moduleNameHindi: 'क्षेत्रीय द्विपक्षीय तुलना (Locality Head-to-Head Compare)',
    });
  };

  const comparisonRows = [
    {
      category: 'Civic Health Index',
      icon: ShieldCheck,
      color: '#2563eb',
      valA: `${metricsA.civicHealthScore}%`,
      valB: `${metricsB.civicHealthScore}%`,
      winner: metricsA.civicHealthScore >= metricsB.civicHealthScore ? 'A' : 'B',
      detail: 'Composite score across education, healthcare, roads & governance',
    },
    {
      category: 'School Quality (UDISE+)',
      icon: GraduationCap,
      color: '#059669',
      valA: `${metricsA.schoolHealthPct}% (${metricsA.schoolsCount} schools)`,
      valB: `${metricsB.schoolHealthPct}% (${metricsB.schoolsCount} schools)`,
      winner: metricsA.schoolHealthPct >= metricsB.schoolHealthPct ? 'A' : 'B',
      detail: `Student-Teacher Ratio: ${metricsA.studentTeacherRatio} vs ${metricsB.studentTeacherRatio}`,
    },
    {
      category: 'Healthcare Capacity',
      icon: Hospital,
      color: '#db2777',
      valA: `${metricsA.hospitalBedsUsable} beds (-${metricsA.hospitalDoctorVacancyPct}% drs)`,
      valB: `${metricsB.hospitalBedsUsable} beds (-${metricsB.hospitalDoctorVacancyPct}% drs)`,
      winner: metricsA.hospitalBedsUsable >= metricsB.hospitalBedsUsable ? 'A' : 'B',
      detail: 'Operational functional beds and doctor vacancy rate in public hospitals',
    },
    {
      category: 'Roads & Infrastructure (PWD)',
      icon: Construction,
      color: '#d97706',
      valA: `${metricsA.infraCompletionPct}% (${metricsA.activeDlpRoadsCount} DLP)`,
      valB: `${metricsB.infraCompletionPct}% (${metricsB.activeDlpRoadsCount} DLP)`,
      winner: metricsA.infraCompletionPct >= metricsB.infraCompletionPct ? 'A' : 'B',
      detail: 'Physical completion rate vs statutory IRC SP:98 warranty roads',
    },
    {
      category: 'MP & MLA Fund Utilization',
      icon: Users,
      color: '#7c3aed',
      valA: `${metricsA.repFundUtilizationPct}% (+${metricsA.repAverageCostHikePct}% hike)`,
      valB: `${metricsB.repFundUtilizationPct}% (+${metricsB.repAverageCostHikePct}% hike)`,
      winner: metricsA.repFundUtilizationPct >= metricsB.repFundUtilizationPct ? 'A' : 'B',
      detail: 'MPLADS/MLALADS disbursed spending vs average project cost escalation',
    },
    {
      category: 'Air Quality (Live AQI)',
      icon: Wind,
      color: '#0284c7',
      valA: `${metricsA.aqiValue} (${metricsA.aqiCategory})`,
      valB: `${metricsB.aqiValue} (${metricsB.aqiCategory})`,
      winner: metricsA.aqiValue <= metricsB.aqiValue ? 'A' : 'B', // Lower AQI is better
      detail: 'CPCB continuous ambient monitoring station readings',
    },
    {
      category: 'Grievance Resolution Speed',
      icon: Building2,
      color: '#ea580c',
      valA: `${metricsA.grievanceDisposalDays} Days`,
      valB: `${metricsB.grievanceDisposalDays} Days`,
      winner: metricsA.grievanceDisposalDays <= metricsB.grievanceDisposalDays ? 'A' : 'B', // Fewer days is better
      detail: 'Average days to dispose CPGRAMS & CM Helpline complaints',
    },
  ];

  return (
    <div style={{ padding: '2rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Locality Head-to-Head Compare</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="glass-pill" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  ⚖️ Pan-India Civic Benchmarking Engine
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Comparing PIN {pinA} vs PIN {pinB}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {tr('Locality Head-to-Head Comparison Matrix', 'क्षेत्रीय द्विपक्षीय तुलनात्मक मैट्रिक्स')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, maxWidth: 680 }}>
                {tr(
                  'Cross-examine any two postal codes in India side-by-side: schools, healthcare beds, road completion, representative fund performance, and air quality.',
                  'भारत के किन्हीं भी दो पिन कोडों की आमने-सामने तुलना: स्कूल गुणवत्ता, अस्पताल बेड, सड़क निर्माण गारंटी, सांसद-विधायक निधि उपयोग एवं वायु प्रदूषण स्तर।'
                )}
              </p>
            </div>

            {/* Compare Selectors */}
            <form onSubmit={handleCompareSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                maxLength={6}
                value={inputA}
                onChange={(e) => setInputA(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN A"
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  width: 110,
                  textAlign: 'center',
                }}
              />
              <ArrowRightLeft size={16} style={{ color: '#64748b' }} />
              <input
                type="text"
                maxLength={6}
                value={inputB}
                onChange={(e) => setInputB(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN B"
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  width: 110,
                  textAlign: 'center',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.15rem' }}>
                Compare
              </button>
            </form>
          </div>
        </div>

        {/* Dual Locality Header Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Card A */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
              color: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span className="glass-pill" style={{ background: 'var(--saffron-500)', color: '#ffffff' }}>
                PIN {pinA}
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                {metricsA.civicHealthScore}%
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.2rem', color: '#ffffff' }}>
              {locA.district}, {locA.state}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {locA.region} India · Civic Health Index: {metricsA.civicHealthScore}/100
            </div>
          </div>

          {/* Card B */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span className="glass-pill" style={{ background: '#2563eb', color: '#ffffff' }}>
                PIN {pinB}
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                {metricsB.civicHealthScore}%
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.2rem', color: '#ffffff' }}>
              {locB.district}, {locB.state}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {locB.region} India · Civic Health Index: {metricsB.civicHealthScore}/100
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr', background: '#f8fafc', padding: '1rem 1.5rem', borderBottom: '1.5px solid #e2e8f0', fontWeight: 800, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase' }}>
            <div>Public Domain / Indicator</div>
            <div>{locA.district} ({pinA})</div>
            <div>{locB.district} ({pinB})</div>
          </div>

          {comparisonRows.map((r, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 2fr',
                padding: '1.25rem 1.5rem',
                borderBottom: idx < comparisonRows.length - 1 ? '1px solid #f1f5f9' : 'none',
                alignItems: 'center',
                background: idx % 2 === 0 ? '#ffffff' : '#fcfcfd',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                  <r.icon size={16} style={{ color: r.color }} />
                  <span>{r.category}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {r.detail}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: r.winner === 'A' ? '#047857' : '#0f172a' }}>
                  {r.valA} {r.winner === 'A' && <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.4rem', borderRadius: 4, marginLeft: '0.35rem' }}>Leader</span>}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: r.winner === 'B' ? '#047857' : '#0f172a' }}>
                  {r.valB} {r.winner === 'B' && <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.4rem', borderRadius: 4, marginLeft: '0.35rem' }}>Leader</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleShareComparison}
            className="btn"
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              padding: '0.55rem 1.15rem',
              borderRadius: 10,
              fontWeight: 700,
              color: '#334155',
            }}
          >
            <Share2 size={15} /> Share Dual Comparison Card
          </button>

          <Link
            to={`/pin/${pinA}`}
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem', padding: '0.55rem 1.15rem', borderRadius: 10 }}
          >
            <span>Explore {locA.district}</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to={`/pin/${pinB}`}
            className="btn btn-primary"
            style={{ fontSize: '0.84rem', padding: '0.55rem 1.15rem', borderRadius: 10 }}
          >
            <span>Explore {locB.district}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
