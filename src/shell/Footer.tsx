import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, FileText, Globe2, Heart, Scale, MapPin, Eye, Lock, Award } from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { LegalIntermediaryNotice } from '../components/legal/LegalIntermediaryNotice';

export function Footer() {
  const { selectedPin } = usePin();
  const { tr } = useLanguage();
  const activePin = selectedPin || '110001';

  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '2px solid #e2e8f0',
        padding: '3.5rem 0 2.5rem',
        marginTop: '4.5rem',
        color: 'var(--text-secondary)',
      }}
      role="contentinfo"
      aria-label="JantaX Footer"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand & National Trust Emblem */}
          <div style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0a192f 0%, #1e3a8a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(15, 45, 89, 0.25)',
                }}
              >
                JX
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--navy-950)' }}>
                  Janta<span style={{ color: 'var(--saffron-500)' }}>X</span>
                </span>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {tr('Bharat Locality OS & Civic Intelligence', 'भारत नागरिक वेधशाला एवं लोकैलिटी ओएस')}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
              {tr(
                'India’s citizen-first public information platform. We organize fragmented government records into a locality-first experience side-by-side with verified ground reality.',
                'भारत का नागरिक-प्रथम सार्वजनिक सूचना मंच। हम बिखरे हुए सरकारी रिकॉर्ड्स को स्थान-आधारित अनुभव और सत्यापित जमीनी हकीकत के साथ प्रस्तुत करते हैं।'
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--emerald-700)', fontWeight: 700 }}>
                <ShieldCheck size={16} style={{ color: '#059669', flexShrink: 0 }} />
                <span>100% Open Data (GODL-India Compliant)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#475569', fontWeight: 600 }}>
                <Lock size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                <span>Zero-EXIF & Public Privacy Protected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#2563eb', fontWeight: 600 }}>
                <Award size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>Non-Partisan & Institutional Neutrality (Rule 9.4)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Public Infrastructure & Civic Entities */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy-950)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              {tr('Public Infrastructure', 'सार्वजनिक बुनियादी ढांचा')}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to={`/schools?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🏫 {tr('Schools & UDISE+ Registry', 'स्कूल एवं UDISE+ रिकॉर्ड')}</Link></li>
              <li><Link to={`/projects?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🏗️ {tr('PMGSY Roads & Public Works', 'PMGSY सड़कें व निर्माण कार्य')}</Link></li>
              <li><Link to={`/hospitals?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🏥 {tr('HMIS Hospitals & PHC Centers', 'अस्पताल व प्राथमिक स्वास्थ्य केंद्र')}</Link></li>
              <li><Link to={`/ration?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🌾 {tr('PDS Fair Price Ration Shops', 'उचित दर राशन दुकान (PDS)')}</Link></li>
              <li><Link to={`/land?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🗺️ {tr('Land Records & Mutation (Bhulekh)', 'भूलेख व ज़मीन रजिस्ट्री')}</Link></li>
              <li><Link to={`/budget?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>💰 {tr('District Budget & Capex Ledger', 'जिला सार्वजनिक बजट लेज़र')}</Link></li>
              <li><Link to="/contractors" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>👷 {tr('Contractor Accountability Ledger', 'ठेकेदार जवाबदेही लेज़र')}</Link></li>
              <li><Link to={`/rera?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🏠 {tr('RERA Real Estate & Delays', 'रेरा हाउसिंग एवं पजेशन देरी')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Democratic Institutions & Redressal */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy-950)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              {tr('Democracy & Redressal', 'लोकतंत्र एवं शिकायत निवारण')}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to={`/pin/${activePin}/people`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>👥 {tr('Elected Leaders (MP · MLA · Ward)', 'जनप्रतिनिधि (सांसद · विधायक · पार्षद)')}</Link></li>
              <li><Link to={`/maps?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🗺️ {tr('Universal GIS Asset Map', 'सार्वभौमिक भू-स्थानिक नक्शा')}</Link></li>
              <li><Link to="/rti" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>📑 {tr('RTI Application Generator', 'RTI आवेदन पत्र जनरेटर')}</Link></li>
              <li><Link to={`/mplads?pin=${activePin}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>💰 {tr('MPLADS Fund Expenditure', 'सांसद निधि खर्च लेखा-जोखा')}</Link></li>
              <li><Link to="/pollution" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>💨 {tr('CPCB Air Quality & GRAP Guide', 'वायु गुणवत्ता एवं ग्रैप गाइड')}</Link></li>
              <li><Link to="/report-issue" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>📸 {tr('Report Civic Defect (GPS Photo)', 'जियो-टैग्ड फोटो शिकायत दर्ज करें')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Transparency, Methodology & Ethics */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy-950)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              {tr('Transparency & Ethics', 'पारदर्शिता एवं मानक')}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/data-sources" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>📊 {tr('Official Data Sources Registry', 'आधिकारिक डेटा स्रोत सूची')}</Link></li>
              <li><Link to="/transparency/methodology" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🔬 {tr('Audit Scoring Methodology', 'ऑडिट स्कोरिंग कार्यप्रणाली')}</Link></li>
              <li><Link to="/transparency/evidence" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🛡️ {tr('Evidence Verification Standards', 'साक्ष्य सत्यापन मानक')}</Link></li>
              <li><Link to="/transparency/freshness" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>⏱️ {tr('Data Freshness Tracking', 'डेटा ताजगी एवं अपडेट तिथि')}</Link></li>
              <li><Link to="/track" style={{ color: '#f97316', fontWeight: 700, transition: 'color 0.15s' }}>⏱️ {tr('Statutory SLA & Ticket Tracker', 'वैधानिक शिकायत ट्रैकर')}</Link></li>
              <li><Link to="/official-response" style={{ color: '#2563eb', fontWeight: 700, transition: 'color 0.15s' }}>🏛️ {tr('Official Right to Reply Desk', 'आधिकारिक स्पष्टीकरण डेस्क')}</Link></li>
              <li><Link to="/admin/moderation" style={{ color: '#64748b', transition: 'color 0.15s' }}>🛡️ {tr('Admin Moderation Queue', 'मॉडरेशन ऑडिट कतार')}</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>🇮🇳 {tr('About JantaX Manifesto', 'जनताएक्स मिशन एवं घोषणापत्र')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Section 79 IT Act Statutory Intermediary Notice */}
        <LegalIntermediaryNotice />

        {/* Footer Bottom Strip */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} JantaX Public Utility. Open Civic Architecture. Sourced from Gazette of India, UDISE+, PMGSY OMMAS, and State Portals.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#0f2d59', fontWeight: 700 }}>🇮🇳 Built for an Informed, Transparent India</span>
            <span>·</span>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy Policy</Link>
            <span>·</span>
            <span style={{ background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: 4, fontFamily: 'monospace', fontWeight: 600 }}>v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
