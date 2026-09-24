import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  Lock,
  Search,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Globe2,
  HelpCircle,
  Eye,
  Camera,
  Scale,
} from 'lucide-react';
import { api } from '../core/services/api';

export function AboutPage() {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: 940 }}>
        {/* Mission Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="hero-pill-badge" style={{ margin: '0 auto 1.25rem' }}>
            <span className="hero-pill-dot"></span>
            <span>Non-Partisan Civic OS for India</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, color: 'var(--navy-950)', marginBottom: '1rem', lineHeight: 1.15 }}>
            India, Explained by <br />
            <span style={{ color: 'var(--navy-600)' }}>Where You Live.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
            Every Indian PIN code reveals a different India — schools, hospitals, RERA housing, roads, and welfare. We stitch official government records side-by-side with ground reality so you can see <strong>दावा बनाम हकीकत</strong> and hold public systems accountable.
          </p>
        </div>

        {/* 4-Step Architecture Workflow */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
              How JantaX Works (कार्यप्रणाली)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              From official government gazettes to verified citizen ground truth in four verifiable steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-900)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
                Open Data Ingest
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                We ingest official datasets from UDISE+, PMGSY, RERA, HMIS, NFSA, DARPG CPGRAMS, and CPCB.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-900)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
                Zero-EXIF Anonymity
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                When citizens drop field photos, EXIF metadata is permanently stripped and IP is SHA-256 hashed.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-900)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
                दावा बनाम हकीकत
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Official claims are rendered side-by-side with CAG audit findings and geotagged parent/resident proof.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--emerald-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                4
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
                Citizen Action & RTI
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Citizens generate one-click Section 6(1) RTI drafts, municipal complaints, and viral WhatsApp cards.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-950)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Our Four Core Principles (चार मूल सिद्धांत)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Database size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>100% Open Data</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every single metric cites a public government document (CAG reports, gazettes, UDISE+, HMIS, NFSA). We never make standalone allegations.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Camera size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>Citizen Powered</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Anonymous by default. We protect citizens while allowing authentic field verification of public works, school toilets, and hospital beds.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--saffron-50)', color: 'var(--saffron-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Scale size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>Strictly Non-Partisan</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                We do not editorialize or endorse any political party. We present official government records and audits transparently side-by-side.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--sector-rti-bg)', color: 'var(--sector-rti)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Globe2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>For Every Indian</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Bilingual in Hindi and English, optimized for 3G mobile connections, resilient offline architecture, and accessible 44px tap targets.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Action Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2.5rem',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Explore What Your PIN Code Reveals
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: 520, margin: '0 auto 1.5rem' }}>
            Check public schools, PMGSY road progress, and RERA real estate delivery in your home locality today.
          </p>
          <Link to="/" className="btn" style={{ background: 'var(--saffron-500)', color: '#ffffff', fontWeight: 700, padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            <span>Search Your PIN Code</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DataSourcesPage() {
  const [sources, setSources] = useState<any[] | null>(null);
  const [filterTier, setFilterTier] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getSources().then((res) => {
      if (res.sources) setSources(res.sources);
    }).catch(() => {
      setSources([]);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!sources) return [];
    return sources.filter((s) => {
      const matchesTier = !filterTier || s.sourceType?.startsWith(filterTier);
      const matchesQuery = !searchQuery || s.sourceName?.toLowerCase().includes(searchQuery.toLowerCase()) || s.organization?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesQuery;
    });
  }, [sources, filterTier, searchQuery]);

  const tierBadgeColor: Record<string, { bg: string; text: string }> = {
    A: { bg: '#ecfdf5', text: '#059669' },
    B: { bg: '#eff6ff', text: '#2563eb' },
    C: { bg: '#fffbeb', text: '#d97706' },
    D: { bg: '#faf5ff', text: '#9333ea' },
    E: { bg: '#fdf2f8', text: '#db2777' },
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="hero-pill-badge">
            <span className="hero-pill-dot"></span>
            <span>GODL-India Open Data Provenance</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--navy-950)', marginBottom: '0.6rem' }}>
            Data Sources & Governance Directory
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 780, lineHeight: 1.6 }}>
            Every statistic on JantaX is backed by a verified 21-field <code>Source</code> entity. We do not publish standalone allegations — only verifiable government records side-by-side with audit citations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Tier Buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: '', label: 'All Sources' },
              { id: 'A', label: 'Tier A: Official Datasets (UDISE+/HMIS)' },
              { id: 'B', label: 'Tier B: Live APIs (CPCB/PMGSY)' },
              { id: 'C', label: 'Tier C: Audit Reports (CAG/RERA)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterTier(t.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-pill)',
                  border: filterTier === t.id ? '1.5px solid var(--navy-600)' : '1px solid var(--border-color)',
                  background: filterTier === t.id ? 'var(--navy-50)' : '#ffffff',
                  color: filterTier === t.id ? 'var(--navy-900)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.4rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Sources Cards Grid */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filtered.map((s) => {
            const tier = s.sourceType?.[0] || 'A';
            const colors = tierBadgeColor[tier] || { bg: '#f1f5f9', text: '#334155' };
            return (
              <div
                key={s.sourceId}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-pill)',
                          background: colors.bg,
                          color: colors.text,
                        }}
                      >
                        Tier {tier} · {s.sourceType}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-700)', background: 'var(--emerald-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        {s.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      <a href={s.sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {s.sourceName} ↗
                      </a>
                    </h3>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.organization} · {s.governmentLevel} Govt
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {s.description || 'Public government registry dataset accessed under the Government Open Data License - India.'}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span><strong>License:</strong> {s.license}</span>
                    <span><strong>Frequency:</strong> {s.updateFrequency}</span>
                    <span><strong>Last Checked:</strong> {new Date(s.lastChecked).toLocaleDateString()}</span>
                  </div>

                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 700, color: 'var(--navy-600)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>View Official Portal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--navy-950)', marginBottom: '0.6rem' }}>
            Privacy & Non-Surveillance Guarantee
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            JantaX is built with a zero-knowledge architecture. We do not track, profile, or sell citizen data.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>1. Zero-EXIF Photo Verification</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              When you upload field photos of school classrooms or uncompleted roads, our backend automatically strips all device metadata, camera serial numbers, and embedded GPS coordinates before publishing.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>2. No Login Required to Inspect</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Public government data belongs to the public. You can search, compare, and inspect every school, contractor, and PMGSY road without providing an email address or mobile number.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-950)', marginBottom: '0.4rem' }}>3. Cryptographic SHA-256 Hashing</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Audit reports and citizen feedback submissions are cryptographically hashed using SHA-256 to ensure tamper-proof authenticity without storing personally identifiable information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
