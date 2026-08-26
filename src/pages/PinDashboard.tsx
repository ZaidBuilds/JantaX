import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  GraduationCap,
  Construction,
  Home,
  Hospital,
  HeartHandshake,
  CheckCircle,
  Plus,
  Download,
  Landmark,
  Vote,
  Scale,
  Clock,
  Building2,
  Wind,
} from 'lucide-react';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { getBottleneckLensesForPin } from '../core/services/bottleneckService';
import { WhatsAppJuxtapositionCard } from '../core/components/WhatsAppJuxtapositionCard';
import {
  LocationHeader,
  AboutLocationCard,
  QuickLinksCard,
  CategoryOverviewCard,
  MetricCard,
} from '../components/location';
import { DataFreshnessBadge } from '../components/data-states';

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
    ? Math.round(pinProjects.reduce((sum, p) => sum + Number(p.claim?.value || 0), 0) / pinProjects.length)
    : null;

  const lastUpdated = useMemo(() => {
    if (pinRecords.length === 0) return null;
    const dates = pinRecords
      .map(r => new Date(r.updatedAt).getTime())
      .filter(t => !Number.isNaN(t));
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  }, [pinRecords]);

  const bottleneckData = useMemo(() => {
    return getBottleneckLensesForPin(activePin || '110001');
  }, [activePin]);

  const [selectedLensId, setSelectedLensId] = useState<string>('lens-inflated');
  const activeLens = bottleneckData.lenses.find(l => l.id === selectedLensId) || bottleneckData.primaryJuxtaposition;

  const areaHealth = useMemo(() => {
    const scores: number[] = [];
    if (averageSchoolScore !== null) scores.push(averageSchoolScore);
    if (projectCompletion !== null) scores.push(projectCompletion);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [averageSchoolScore, projectCompletion]);

  const areaHealthLabel =
    areaHealth === null ? null
      : areaHealth >= 75 ? 'Good'
        : areaHealth >= 50 ? 'Fair'
          : 'Needs Attention';

  const [mapZoom, setMapZoom] = useState(14);
  const coordinates = getCoordinateForPin(activePin);
  const following = isFollowing(activePin);

  const handleShare = useCallback(async () => {
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
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  }, [activePin, resolvedLocation, pinSchools.length, pinProjects.length, delayedProjects, areaHealth, areaHealthLabel]);

  const handleDownload = useCallback(() => {
    const lines = [
      'JANTAX — CITIZEN ACCOUNTABILITY REPORT',
      '======================================',
      `PIN Code:        ${activePin}`,
      `Location:        ${resolvedLocation.district}, ${resolvedLocation.state}`,
      `Generated on:    ${new Date().toLocaleString('en-IN')}`,
      `Last data update: ${lastUpdated ? lastUpdated.toLocaleDateString('en-IN') : '—'}`,
      '',
      'AT A GLANCE',
      `  Schools:            ${pinSchools.length} (${pinSchools.filter(s => s.status.toLowerCase().includes('attention')).length} need attention)`,
      `  Public projects:     ${pinProjects.length} (${delayedProjects} delayed)`,
      `  Area Health Score:  ${areaHealth !== null ? `${areaHealth}/100 (${areaHealthLabel})` : 'No data'}`,
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
  }, [activePin, resolvedLocation, lastUpdated, pinSchools, pinProjects, delayedProjects, areaHealth, areaHealthLabel]);

  const handleLocate = useCallback(async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  }, [detectLocation, navigate]);

  const handleChangePin = useCallback((newPin: string) => {
    setSelectedPin(newPin);
    navigate(`/pin/${newPin.trim()}`);
  }, [setSelectedPin, navigate]);

  const handleToggleFollow = useCallback(() => {
    toggleFollow(activePin);
  }, [toggleFollow, activePin]);

  const mapSrc = (() => {
    if (!coordinates) return null;
    const { lat, lng } = coordinates;
    const delta = 0.01 * Math.pow(2, 14 - mapZoom);
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  })();

  if (hasPinParam && !activePin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Invalid PIN code</h2>
        <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.7 }}>Enter a valid six-digit Indian PIN code.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const overviewMetrics = [
    {
      metric: {
        label: t('schools'),
        value: pinSchools.length,
        status: 'available' as const,
        source: { type: 'A', name: 'UDISE+' },
        freshness: lastUpdated,
        alert: pinSchools.filter(s => s.status.toLowerCase().includes('attention')).length > 0
          ? `${pinSchools.filter(s => s.status.toLowerCase().includes('attention')).length} Need Attention`
          : null,
      },
      icon: <GraduationCap size={30} />,
      color: '#3b82f6',
      onViewDetails: () => navigate(`/module/school?pin=${activePin}`),
    },
    {
      metric: {
        label: t('publicProjects'),
        value: pinProjects.length,
        status: 'available' as const,
        source: { type: 'A', name: 'PMGSY/PWD' },
        freshness: lastUpdated,
        alert: delayedProjects > 0 ? `${delayedProjects} Delayed` : null,
      },
      icon: <Construction size={30} />,
      color: '#f59e0b',
      onViewDetails: () => navigate(`/module/infra?pin=${activePin}`),
    },
    {
      metric: {
        label: t('reraProjects'),
        value: null,
        status: 'unavailable' as const,
        source: { type: 'A', name: 'RERA' },
      },
      icon: <Home size={30} />,
      color: '#8b5cf6',
      onViewDetails: () => navigate(`/module/rera?pin=${activePin}`),
    },
    {
      metric: {
        label: t('healthcare'),
        value: null,
        status: 'unavailable' as const,
        source: { type: 'A', name: 'HMIS/MoHFW' },
      },
      icon: <Hospital size={30} />,
      color: '#ec4899',
      onViewDetails: () => navigate(`/module/hospital?pin=${activePin}`),
    },
    {
      metric: {
        label: t('welfareSchemes'),
        value: null,
        status: 'unavailable' as const,
        source: { type: 'A', name: 'PDS/FCI' },
      },
      icon: <HeartHandshake size={30} />,
      color: '#d97706',
      onViewDetails: () => navigate(`/module/ration?pin=${activePin}`),
    },
  ];

  const categoriesOverview = [
    {
      moduleId: 'school',
      title: t('schools'),
      score: averageSchoolScore !== null ? `${averageSchoolScore}/100` : null,
      scoreLabel: 'Ground Truth Score',
      source: { type: 'A', name: 'UDISE+' },
      freshness: lastUpdated,
      color: '#3b82f6',
      metrics: [
        { name: 'Tracked schools', value: pinSchools.length, status: 'available' as const },
        { name: 'Ground truth score', value: averageSchoolScore !== null ? `${averageSchoolScore}/100` : null, status: averageSchoolScore !== null ? 'available' as const : 'unavailable' as const },
        { name: 'Teacher coverage', value: null, status: 'unavailable' as const },
        { name: 'Attendance data', value: null, status: 'unavailable' as const },
        { name: 'Facility data', value: null, status: 'unavailable' as const },
      ],
      onViewDetails: () => navigate(`/module/school?pin=${activePin}`),
      isLoading: isCatalogLoading,
    },
    {
      moduleId: 'infra',
      title: t('publicProjects'),
      score: projectCompletion !== null ? `${projectCompletion}%` : null,
      scoreLabel: 'Completion',
      source: { type: 'A', name: 'PMGSY/PWD' },
      freshness: lastUpdated,
      color: '#f59e0b',
      metrics: [
        { name: 'Tracked projects', value: pinProjects.length, status: 'available' as const },
        { name: 'Official completion', value: projectCompletion !== null ? `${projectCompletion}%` : null, status: projectCompletion !== null ? 'available' as const : 'unavailable' as const },
        { name: 'Ground truth score', value: null, status: 'unavailable' as const },
        { name: 'Roads & drainage', value: null, status: 'unavailable' as const },
        { name: 'Streetlights & water', value: null, status: 'unavailable' as const },
      ],
      onViewDetails: () => navigate(`/module/infra?pin=${activePin}`),
      isLoading: isCatalogLoading,
    },
    {
      moduleId: 'rera',
      title: t('reraProjects'),
      score: null,
      scoreLabel: null,
      source: { type: 'A', name: 'RERA' },
      freshness: null,
      color: '#8b5cf6',
      metrics: [
        { name: 'Projects Registered', value: null, status: 'unavailable' as const },
        { name: 'On-time Delivery', value: null, status: 'unavailable' as const },
        { name: 'Complaints', value: null, status: 'unavailable' as const },
        { name: 'Orders & Actions', value: null, status: 'unavailable' as const },
      ],
      onViewDetails: () => navigate(`/module/rera?pin=${activePin}`),
      isLoading: isCatalogLoading,
    },
    {
      moduleId: 'hospital',
      title: t('healthcare'),
      score: null,
      scoreLabel: null,
      source: { type: 'A', name: 'HMIS/MoHFW' },
      freshness: null,
      color: '#ec4899',
      metrics: [
        { name: 'Availability', value: null, status: 'unavailable' as const },
        { name: 'Doctors', value: null, status: 'unavailable' as const },
        { name: 'Staff', value: null, status: 'unavailable' as const },
        { name: 'Medicines', value: null, status: 'unavailable' as const },
      ],
      onViewDetails: () => navigate(`/module/hospital?pin=${activePin}`),
      isLoading: isCatalogLoading,
    },
    {
      moduleId: 'ration',
      title: t('welfareSchemes'),
      score: null,
      scoreLabel: null,
      source: { type: 'A', name: 'PDS/FCI' },
      freshness: null,
      color: '#d97706',
      metrics: [
        { name: 'Schemes Active', value: null, status: 'unavailable' as const },
        { name: 'Beneficiaries', value: null, status: 'unavailable' as const },
        { name: 'Coverage', value: null, status: 'unavailable' as const },
        { name: 'Grievances', value: null, status: 'unavailable' as const },
      ],
      onViewDetails: () => navigate(`/module/ration?pin=${activePin}`),
      isLoading: isCatalogLoading,
    },
  ];

  const quickLinks = [
    { label: 'Nearby Schools', path: `/schools?pin=${activePin}`, icon: <GraduationCap size={14} /> },
    { label: 'Nearby Projects', path: `/module/infra?pin=${activePin}`, icon: <Construction size={14} /> },
    { label: 'MP / MLA Funds', path: `/mplads?pin=${activePin}`, icon: <Landmark size={14} /> },
    { label: 'Air Quality / AQI', path: `/pollution?pin=${activePin}`, icon: <Wind size={14} /> },
    { label: 'Nagar Nigam / Sanitation', path: `/nagar?pin=${activePin}`, icon: <Building2 size={14} /> },
    { label: 'District Courts', path: `/courts?pin=${activePin}`, icon: <Scale size={14} /> },
    { label: 'RTI Clock & CPIO', path: `/rti?pin=${activePin}`, icon: <Clock size={14} /> },
    { label: 'Voter & Polling Booths', path: `/booth?pin=${activePin}`, icon: <Vote size={14} /> },
    { label: 'Nearby Hospitals', path: `/module/hospital?pin=${activePin}`, icon: <Hospital size={14} /> },
    { label: 'RERA Projects', path: `/module/rera?pin=${activePin}`, icon: <Home size={14} /> },
    { label: 'Trending Issues', path: `/maps?pin=${activePin}`, icon: <MapPin size={14} /> },
    { label: 'Citizen Reports', path: `/reports?pin=${activePin}`, icon: <HeartHandshake size={14} /> },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <LocationHeader
        pincode={activePin}
        location={{
          district: resolvedLocation.district,
          state: resolvedLocation.state,
          stateCode: resolvedLocation.stateCode,
          region: resolvedLocation.region,
        }}
        lastUpdated={lastUpdated}
        following={following}
        onToggleFollow={handleToggleFollow}
        actions={{
          onShare: handleShare,
          onDownload: handleDownload,
          onLocate: handleLocate,
          onChangePin: handleChangePin,
        }}
        isLoading={isCatalogLoading}
      />

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <aside style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AboutLocationCard
            location={{
              district: resolvedLocation.district,
              state: resolvedLocation.state,
              stateCode: resolvedLocation.stateCode,
              region: resolvedLocation.region,
            }}
            lastUpdated={lastUpdated}
            isLoading={isCatalogLoading}
          />
          <QuickLinksCard links={quickLinks} onNavigate={navigate} />
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
          {/* Top Juxtaposition Share Card (Claim vs Audit) */}
          <WhatsAppJuxtapositionCard
            pinCode={activePin || '110001'}
            locality={resolvedLocation.district ? `${resolvedLocation.district}, ${resolvedLocation.state}` : resolvedLocation.state}
            lens={activeLens}
            availableLenses={bottleneckData.lenses}
            onSelectLens={(id) => setSelectedLensId(id)}
          />

          <nav aria-label="PIN sections" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'At a Glance', href: '#pin-glance' },
              { label: 'Category Overview', href: '#pin-categories' },
              { label: 'Map & Issues', href: '#pin-map' },
            ].map(s => (
              <a
                key={s.href}
                href={s.href}
                className="time-tab"
                style={{ background: '#fff', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div id="pin-glance" style={{ scrollMarginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>At a Glance</h3>
              {lastUpdated && (
                <DataFreshnessBadge lastUpdated={lastUpdated} variant="inline" />
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {overviewMetrics.map((item, idx) => (
                <MetricCard
                  key={idx}
                  metric={item.metric}
                  icon={item.icon}
                  color={item.color}
                  onViewDetails={item.onViewDetails}
                  isLoading={isCatalogLoading}
                />
              ))}
            </div>
          </div>

          {areaHealth !== null && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0 }}>Area Health Score</h4>
                  <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>Blended from available data</span>
                </div>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#e2e8f0" strokeWidth="8" strokeDasharray="197 263" strokeLinecap="round" transform="rotate(135 50 50)" />
                    <circle
                      cx="50" cy="50" r="42" fill="transparent" stroke="url(#killerGauge)" strokeWidth="8"
                      strokeDasharray={`${(areaHealth / 100) * 197} 263`} strokeLinecap="round" transform="rotate(135 50 50)"
                      style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 2px 6px rgba(249,115,22,0.25))' }}
                    />
                    <defs>
                      <linearGradient id="killerGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0f2d59" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{areaHealth}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 600 }}>/100</div>
                  </div>
                </div>
                <div style={{ color: '#f97316', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' }}>{areaHealthLabel}</div>
                <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>Based on {pinSchools.length > 0 ? 'schools' : ''}{pinSchools.length > 0 && projectCompletion !== null ? ' and ' : ''}{projectCompletion !== null ? 'projects' : ''}{pinSchools.length === 0 && projectCompletion === null ? 'No data available' : ''}</span>
              </div>
            </div>
          )}

          <div id="pin-categories" style={{ scrollMarginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Category-Wise Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {categoriesOverview.map((cat, idx) => (
                <CategoryOverviewCard key={idx} category={cat} isLoading={cat.isLoading} />
              ))}
            </div>
          </div>

          <div id="pin-map" style={{ scrollMarginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Map Overview</h4>
              <div style={{ borderRadius: '8px', background: '#cbd5e1', position: 'relative', overflow: 'hidden', minHeight: 200 }}>
                {mapSrc ? (
                  <iframe
                    title={`Map of ${resolvedLocation.district}`}
                    src={mapSrc}
                    style={{ width: '100%', height: '100%', border: 0, minHeight: 200 }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, flexDirection: 'column', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                    <MapPin size={28} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Map unavailable for this PIN. Try a major PIN code or use Locate.</span>
                  </div>
                )}
                {mapSrc && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>
                    {resolvedLocation.district}
                  </div>
                )}
                {mapSrc && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'grid', gap: '2px' }}>
                    <button onClick={() => setMapZoom(z => Math.min(18, z + 1))} style={{ width: 24, height: 24, background: 'white', border: '1px solid #cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}>+</button>
                    <button onClick={() => setMapZoom(z => Math.max(10, z - 1))} style={{ width: 24, height: 24, background: 'white', border: '1px solid #cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}>−</button>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Top Issues</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {pinProjects.filter(p => p.status.toLowerCase().includes('delay') || p.reality?.evidenceCount > 0).length === 0 ? (
                  <div style={{ fontSize: '0.85rem', opacity: 0.6, padding: '1rem', textAlign: 'center' }}>
                    No active issues tracked for this PIN.
                  </div>
                ) : (
                  pinProjects
                    .filter(p => p.status.toLowerCase().includes('delay') || (p.reality?.evidenceCount || 0) > 0)
                    .slice(0, 5)
                    .map((project, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{project.titleEnglish}</span>
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{project.reality?.evidenceCount || 0} reports</div>
                        </div>
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: `${project.status.toLowerCase().includes('delay') ? '#f97316' : '#10b981'}15`, color: project.status.toLowerCase().includes('delay') ? '#f97316' : '#10b981', fontWeight: 700 }}>
                          {project.status}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
