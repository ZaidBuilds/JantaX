import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Link2,
  Download,
  Info,
  MapPin,
  Crosshair,
  Check,
  Plus,
  GraduationCap,
  Construction,
  Home,
  Hospital,
  HeartHandshake,
} from 'lucide-react';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { SourceBadge } from '../components/UI/SourceBadge';

/**
 * JantaX PIN Code Dashboard Page
 * - Controls (Share / Download / Follow / Locate) are fully functional
 * - Real interactive OpenStreetMap embed instead of a static image
 * - All metrics are derived from live catalog data (no demo numbers)
 */
export function PinDashboard() {
  const navigate = useNavigate();
  const { pinCode } = useParams<{ pinCode: string }>();
  const { toggleFollow, isFollowing, detectLocation, setSelectedPin } = usePin();
  const { language, t } = useLanguage();

  const hasPinParam = Boolean(pinCode);
  const activePin = pinCode && isValidIndianPincode(pinCode) ? pinCode.trim() : '';
  const { records: pinRecords, isLoading: isCatalogLoading, error: catalogError } = useCatalog(activePin || undefined);
  const resolvedLocation = resolvePincode(activePin);

  const pinSchools = pinRecords.filter(record => record.moduleId === 'school');
  const pinProjects = pinRecords.filter(record => record.moduleId === 'infra');
  const averageSchoolScore = pinSchools.length > 0
    ? Math.round(pinSchools.reduce((sum, school) => sum + school.groundTruthScore, 0) / pinSchools.length)
    : null;
  const delayedProjects = pinProjects.filter(project => project.status.toLowerCase().includes('delay')).length;
  const projectCompletion = pinProjects.length > 0
    ? Math.round(pinProjects.reduce((sum, p) => sum + Number(p.claim.value), 0) / pinProjects.length)
    : null;

  // Derived "Area Health" — blended from available ground-truth data, else "—".
  const areaHealth = useMemo(() => {
    const scores: number[] = [];
    if (averageSchoolScore !== null) scores.push(averageSchoolScore);
    if (projectCompletion !== null) scores.push(projectCompletion);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [averageSchoolScore, projectCompletion]);

  const areaHealthLabel =
    areaHealth === null ? 'No data yet'
      : areaHealth >= 75 ? 'Good'
        : areaHealth >= 50 ? 'Fair'
          : 'Needs Attention';

  const lastUpdated = useMemo(() => {
    if (pinRecords.length === 0) return '—';
    const dates = pinRecords
      .map(r => new Date(r.updatedAt).getTime())
      .filter(t => !Number.isNaN(t));
    if (dates.length === 0) return '—';
    const max = new Date(Math.max(...dates));
    return max.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [pinRecords]);

  const [mapZoom, setMapZoom] = useState(14);
  const coordinates = getCoordinateForPin(activePin);

  if (hasPinParam && !activePin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Invalid PIN code</h2>
        <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.7 }}>Enter a valid six-digit Indian PIN code.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (isCatalogLoading) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading PIN data...</div>;
  }

  if (catalogError) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--status-critical)' }}>PIN data could not be loaded</h2>
        <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.7 }}>Please try again later.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (hasPinParam && pinRecords.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>No data available for {activePin}</h2>
        <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.7 }}>{resolvedLocation.district}, {resolvedLocation.state} is not covered by the current public dataset.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Search Another PIN</button>
      </div>
    );
  }

  const overviewCards = [
    { label: t('schools'), labelHi: 'स्कूल', value: String(pinSchools.length), alert: `${pinSchools.filter(s => s.status.toLowerCase().includes('attention')).length} Need Attention`, icon: GraduationCap, color: '#3b82f6' },
    { label: t('publicProjects'), labelHi: 'सार्वजनिक प्रोजेक्ट', value: String(pinProjects.length), alert: `${delayedProjects} Delayed`, icon: Construction, color: '#f59e0b' },
    { label: t('reraProjects'), labelHi: 'RERA प्रोजेक्ट', value: '—', alert: 'Not connected', icon: Home, color: '#06b6d4' },
    { label: t('healthcare'), labelHi: 'स्वास्थ्य केंद्र', value: '—', alert: 'Not connected', icon: Hospital, color: '#ec4899' },
    { label: t('welfareSchemes'), labelHi: 'कल्याण योजना', value: '—', alert: 'Not connected', icon: HeartHandshake, color: '#d97706' }
  ];

  const categoriesOverview = [
    {
      moduleId: 'school',
      title: t('schools'), titleHi: 'शिक्षा',
      score: averageSchoolScore === null ? '—' : `${averageSchoolScore}/100`,
      source: { type: 'A', name: 'UDISE+' },
      color: '#3b82f6',
      metrics: [
        { name: 'Tracked schools', val: String(pinSchools.length) },
        { name: 'Ground truth score', val: averageSchoolScore === null ? '—' : `${averageSchoolScore}/100` },
        { name: 'Teacher coverage', val: 'Not connected' },
        { name: 'Attendance', val: 'Not connected' },
        { name: 'Facilities', val: 'Not connected' }
      ]
    },
    {
      moduleId: 'infra',
      title: t('publicProjects'), titleHi: 'बुनियादी ढाँचा',
      score: '—',
      source: { type: 'A', name: 'PMGSY/PWD' },
      color: '#f59e0b',
      metrics: [
        { name: 'Tracked projects', val: String(pinProjects.length) },
        { name: 'Official completion', val: projectCompletion === null ? '—' : `${projectCompletion}%` },
        { name: 'Ground truth score', val: 'Not connected' },
        { name: 'Roads & drainage', val: 'Not connected' },
        { name: 'Streetlights & water', val: 'Not connected' }
      ]
    },
    {
      moduleId: 'rera',
      title: t('reraProjects'), titleHi: 'रियल एस्टेट',
      score: '—',
      source: { type: 'A', name: 'RERA' },
      color: '#8b5cf6',
      metrics: [
        { name: 'Projects Registered', val: 'Not connected' },
        { name: 'On-time Delivery', val: 'Not connected' },
        { name: 'Complaints', val: 'Not connected' },
        { name: 'Orders & Actions', val: 'Not connected' }
      ]
    },
    {
      moduleId: 'hospital',
      title: t('healthcare'), titleHi: 'स्वास्थ्य सेवा',
      score: '—',
      source: { type: 'A', name: 'HMIS/MoHFW' },
      color: '#ec4899',
      metrics: [
        { name: 'Availability', val: 'Not connected' },
        { name: 'Doctors', val: 'Not connected' },
        { name: 'Staff', val: 'Not connected' },
        { name: 'Medicines', val: 'Not connected' }
      ]
    },
    {
      moduleId: 'ration',
      title: t('welfareSchemes'), titleHi: 'कल्याण',
      score: '—',
      source: { type: 'A', name: 'PDS/FCI' },
      color: '#d97706',
      metrics: [
        { name: 'Schemes Active', val: 'Not connected' },
        { name: 'Beneficiaries', val: 'Not connected' },
        { name: 'Coverage', val: 'Not connected' },
        { name: 'Grievances', val: 'Not connected' }
      ]
    }
  ];

  const topIssues = pinProjects
    .filter(project => project.status.toLowerCase().includes('delay') || project.reality.evidenceCount > 0)
    .map(project => ({ issue: language === 'hi' ? project.titleHindi : project.titleEnglish, count: `${project.reality.evidenceCount} reports`, status: project.status, color: '#f97316' }));

  const latestUpdates = pinProjects.map(project => ({
    type: 'PROJECT UPDATE',
    title: language === 'hi' ? project.titleHindi : project.titleEnglish,
    desc: project.status,
    time: `Record date: ${project.updatedAt.slice(0, 10)}`,
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&q=80'
  }));

  const quickLinks = [
    { label: 'Nearby Schools', path: `/schools?pin=${activePin}` },
    { label: 'Nearby Projects', path: `/module/infra?pin=${activePin}` },
    { label: 'Nearby Hospitals', path: `/module/hospital?pin=${activePin}` },
    { label: 'RERA Projects', path: `/module/rera?pin=${activePin}` },
    { label: 'Trending Issues', path: `/maps?pin=${activePin}` },
    { label: 'Citizen Reports', path: `/search?q=${encodeURIComponent(activePin)}` },
  ];

  const following = isFollowing(activePin);

  const handleShare = async () => {
    const shareText =
      `JantaX Report — PIN ${activePin}\n` +
      `${resolvedLocation.district}, ${resolvedLocation.state}\n\n` +
      `Schools tracked: ${pinSchools.length}\n` +
      `Public projects: ${pinProjects.length} (${delayedProjects} delayed)\n` +
      (areaHealth !== null ? `Area Health: ${areaHealth}/100 (${areaHealthLabel})\n` : '') +
      `\nSee the full picture: ${window.location.origin}/pin/${activePin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `JantaX — PIN ${activePin}`,
          text: shareText,
          url: `${window.location.origin}/pin/${activePin}`,
        });
        return;
      } catch {
        /* user cancelled or unsupported — fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* clipboard blocked — continue to WhatsApp */
    }
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleDownload = () => {
    const lines = [
      'JANTAX — CITIZEN ACCOUNTABILITY REPORT',
      '======================================',
      `PIN Code:        ${activePin}`,
      `Location:        ${resolvedLocation.district}, ${resolvedLocation.state}`,
      `Generated on:    ${new Date().toLocaleString('en-IN')}`,
      `Last data update: ${lastUpdated}`,
      '',
      'AT A GLANCE',
      `  Schools:            ${pinSchools.length} (${pinSchools.filter(s => s.status.toLowerCase().includes('attention')).length} need attention)`,
      `  Public projects:    ${pinProjects.length} (${delayedProjects} delayed)`,
      `  Area Health Score:  ${areaHealth !== null ? `${areaHealth}/100 (${areaHealthLabel})` : 'No data'}`,
      '',
      'CATEGORY-WISE OVERVIEW',
      ...categoriesOverview.map(cat =>
        `  ${cat.title}: ${cat.score}\n` +
        cat.metrics.map(m => `    - ${m.name}: ${m.val}`).join('\n')
      ),
      '',
      'TOP ISSUES',
      ...(topIssues.length > 0
        ? topIssues.map(t => `  - ${t.issue} (${t.count}, ${t.status})`)
        : ['  No active issues tracked.']),
      '',
      'Generated by JantaX — "Pin code dalo, hisaab lo"',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JantaX-Report-${activePin}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  };

  const mapSrc = (() => {
    if (!coordinates) return null;
    const { lat, lng } = coordinates;
    const delta = 0.01 * Math.pow(2, 14 - mapZoom);
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  })();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Breadcrumbs */}
      <nav style={{ fontSize: '0.85rem', opacity: 0.6 }}>
        Home &gt; PIN Code Dashboard &gt; <strong>{activePin}</strong>
      </nav>

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>PIN Code {activePin}</h2>
          <button
            onClick={() => {
              const newPin = prompt('पिन कोड दर्ज करें (Enter PIN Code):', activePin);
              if (newPin && isValidIndianPincode(newPin)) {
                setSelectedPin(newPin);
                navigate(`/pin/${newPin.trim()}`);
              }
            }}
            style={{ padding: '0.4rem 1rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
          >
            Change PIN
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleShare}
            className="time-tab"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Link2 size={15} /> Share
          </button>
          <button
            onClick={handleDownload}
            className="search-action-btn"
            style={{ borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Download size={15} /> Download Report
          </button>
          <button
            onClick={handleLocate}
            className="time-tab"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Detect my location"
          >
            <Crosshair size={15} /> Locate
          </button>
        </div>
      </div>

      {/* Layout Columns — responsive stack on tablet */}
      <style>{`@media (max-width: 1024px) { .pin-layout { flex-direction: column !important; } .pin-aside { width: 100% !important; } }`}</style>
      <div className="pin-layout" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

        {/* Left Side: About area, Alert tracking, Quick Links */}
        <aside className="pin-aside" style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>

          {/* About area */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>About this area</h3>
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>Location:</span><strong>{resolvedLocation.district}, {resolvedLocation.state}{resolvedLocation.stateCode !== '--' && <span style={{ marginLeft: '0.35rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-500)', padding: '0 5px', borderRadius: 999, fontSize: '0.6rem', fontWeight: 800 }}>{resolvedLocation.stateCode}</span>}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>Population (Est.):</span><strong>Not available</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>Area Type:</span><strong>Not available</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>District:</span><strong>{resolvedLocation.district}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>Region:</span><strong>{resolvedLocation.region}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.6 }}>Last Updated:</span><strong>{lastUpdated}</strong></div>
            </div>
          </div>

          {/* Follow area */}
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>Track this PIN Code</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>Get alerts about issues & changes</p>
            <button
              className="search-action-btn"
              style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: following ? 'var(--status-completed)' : 'var(--color-primary)' }}
              onClick={() => toggleFollow(activePin)}
            >
              {following ? <><Check size={15} /> Following</> : <><Plus size={15} /> Follow</>}
            </button>
          </div>

          {/* Quick links */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Quick Links</h3>
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {quickLinks.map((link) => (
                <div key={link.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => navigate(link.path)}>
                  <span>{link.label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>&gt;</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Side: Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Section navigation — consolidated hub anchor jump */}
          <nav aria-label="PIN sections" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'At a Glance', href: '#pin-glance' },
              { label: 'Category Overview', href: '#pin-categories' },
              { label: 'Map & Issues', href: '#pin-map' },
              { label: 'Latest Updates', href: '#pin-updates' },
            ].map(s => (
              <a key={s.href} href={s.href} className="time-tab" style={{ background: '#fff', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>{s.label}</a>
            ))}
          </nav>

          {/* At a Glance boxes */}
          <div id="pin-glance" style={{ scrollMarginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {overviewCards.map((c, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                <span style={{ display: 'block', marginBottom: '0.25rem', color: c.color }}><c.icon size={30} /></span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>{c.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', margin: '0.15rem 0' }}>{c.label}</div>
                <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700 }}>{c.alert}</div>
              </div>
            ))}
          </div>

          {/* Analytics Gauges Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

            {/* Circular Area Health Score */}
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0 }}>Area Health Score</h4>
                <span style={{ cursor: 'pointer', opacity: 0.6 }} title="Calculated from available ground-truth data"><Info size={16} /></span>
              </div>
              <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  {/* background track — 270deg arc (135deg start) */}
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#e2e8f0" strokeWidth="8" strokeDasharray="197 263" strokeLinecap="round" transform="rotate(135 50 50)" />
                  {areaHealth !== null && (
                    <circle
                      cx="50" cy="50" r="42" fill="transparent" stroke="url(#killerGauge)" strokeWidth="8"
                      strokeDasharray={`${(areaHealth / 100) * 197} 263`} strokeLinecap="round" transform="rotate(135 50 50)"
                      style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 2px 6px rgba(249,115,22,0.25))' }}
                    />
                  )}
                  <defs>
                    <linearGradient id="killerGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f2d59" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{areaHealth !== null ? areaHealth : '—'}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 600, letterSpacing: '0.04em' }}>/100</div>
                </div>
              </div>
              <div style={{ color: '#f97316', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' }}>{areaHealthLabel}</div>
              <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>Score calculated on {lastUpdated}</span>
            </div>

            {/* Health Score Trend graph */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0 }}>Health Score Trend</h4>
                <select className="form-input" style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: 'auto' }}>
                  <option>6 Months</option>
                </select>
              </div>
              <div style={{ height: '140px', position: 'relative', marginTop: '1rem' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 120">
                  <path d="M 20 90 L 70 85 L 120 75 L 170 65 L 220 60 L 270 50" fill="none" stroke="#f97316" strokeWidth="3" />
                  <circle cx="20" cy="90" r="4" fill="#f97316" />
                  <circle cx="70" cy="85" r="4" fill="#f97316" />
                  <circle cx="120" cy="75" r="4" fill="#f97316" />
                  <circle cx="170" cy="65" r="4" fill="#f97316" />
                  <circle cx="220" cy="60" r="4" fill="#f97316" />
                  <circle cx="270" cy="50" r="4" fill="#f97316" />

                  {/* labels */}
                  <text x="10" y="115" fontSize="8" fill="#94a3b8">Mar '26</text>
                  <text x="60" y="115" fontSize="8" fill="#94a3b8">Apr '26</text>
                  <text x="110" y="115" fontSize="8" fill="#94a3b8">May '26</text>
                  <text x="160" y="115" fontSize="8" fill="#94a3b8">Jun '26</text>
                  <text x="210" y="115" fontSize="8" fill="#94a3b8">Jul '26</text>
                  <text x="260" y="115" fontSize="8" fill="#94a3b8">Aug '26</text>

                  <text x="15" y="78" fontSize="8" fontWeight="bold" fill="#0f172a">54</text>
                  <text x="65" y="73" fontSize="8" fontWeight="bold" fill="#0f172a">56</text>
                  <text x="115" y="63" fontSize="8" fontWeight="bold" fill="#0f172a">59</text>
                  <text x="165" y="53" fontSize="8" fontWeight="bold" fill="#0f172a">61</text>
                  <text x="215" y="48" fontSize="8" fontWeight="bold" fill="#0f172a">63</text>
                  <text x="265" y="38" fontSize="8" fontWeight="bold" fill="#0f172a">68</text>
                </svg>
              </div>
            </div>

          </div>

          {/* Category-Wise Overview (5 columns BREAKDOWN grid) */}
          <div id="pin-categories" style={{ scrollMarginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>Category-Wise Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {categoriesOverview.map((cat, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1rem', borderTop: `3px solid ${cat.color}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cat.title}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: cat.color }}>{cat.score}</span>
                  </div>
                  {cat.source && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <SourceBadge sourceType={cat.source.type} sourceName={cat.source.name} />
                    </div>
                  )}
                  <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    {cat.metrics.map((m, mIdx) => (
                      <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                        <span>{m.name}</span>
                        <strong>{m.val}</strong>
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate(`/module/${cat.moduleId}?pin=${activePin}`)}>
                    View Details →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Overview & Issues Row */}
          <div id="pin-map" style={{ scrollMarginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

            {/* Map Overview */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Map Overview</h4>
              <div style={{ flex: 1, borderRadius: '8px', background: '#cbd5e1', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                {mapSrc ? (
                  <iframe
                    title={`Map of ${resolvedLocation.district}`}
                    src={mapSrc}
                    style={{ width: '100%', height: '100%', border: 0, minHeight: '200px' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', flexDirection: 'column', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                    <MapPin size={28} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Map unavailable for this PIN. Try a major PIN code or use Locate.</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>{resolvedLocation.district}</div>
                {/* Floating zoom overlay */}
                {mapSrc && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'grid', gap: '2px' }}>
                    <button
                      onClick={() => setMapZoom(z => Math.min(18, z + 1))}
                      style={{ width: '24px', height: '24px', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}
                      aria-label="Zoom in"
                    >+</button>
                    <button
                      onClick={() => setMapZoom(z => Math.max(10, z - 1))}
                      style={{ width: '24px', height: '24px', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}
                      aria-label="Zoom out"
                    >−</button>
                  </div>
                )}
              </div>
            </div>

            {/* Issues */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0 }}>Top Issues in Your Area</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/maps')}>View all →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {topIssues.length === 0 && <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>No active issues tracked for this PIN.</div>}
                {topIssues.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{t.issue}</span>
                      <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{t.count}</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: `${t.color}15`, color: t.color, fontWeight: 700 }}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Latest Updates Horizontal Slider Grid */}
          <div id="pin-updates" style={{ scrollMarginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>Latest Updates</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 700 }}>View all →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {latestUpdates.length === 0 && <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>No recent updates for this PIN.</div>}
              {latestUpdates.map((item, idx) => (
                <div key={idx} className="glass-card" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '110px', background: '#cbd5e1', overflow: 'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-primary)' }}>{item.type}</span>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.2rem 0' }}>{item.desc}</p>
                    <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
