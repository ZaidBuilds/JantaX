import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resolvePincode } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { schemeService } from '../services/schemeService';
import { LocalitySchemesSummary, SchemeProject, SchemeCategory } from '../types/scheme';
import { SchemeCard } from '../components/SchemeCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import {
  Compass,
  MapPin,
  Building,
  Construction,
  Droplets,
  Home,
  Train,
  ShieldCheck,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
} from 'lucide-react';

export function SchemesPage() {
  const { pinCode } = useParams<{ pinCode?: string }>();
  const navigate = useNavigate();
  const currentPin = pinCode || '110001';
  const resolvedLoc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const [summary, setSummary] = useState<LocalitySchemesSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isAlive = true;
    setLoading(true);
    schemeService.getLocalitySchemesSummary(currentPin).then((data) => {
      if (isAlive) {
        setSummary(data);
        setLoading(false);
      }
    });
    return () => {
      isAlive = false;
    };
  }, [currentPin]);

  const filteredProjects = useMemo(() => {
    if (!summary) return [];
    return summary.projects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      return matchCat && matchStatus;
    });
  }, [summary, selectedCategory, selectedStatus]);

  const handleShare = () => {
    if (!summary) return;
    share({
      title: `Central & State Govt Schemes in PIN ${currentPin} (${summary.district})`,
      text: `Track active Central & State schemes in ${summary.district}, ${summary.state} (PIN ${currentPin}): PMGSY roads, Jal Jeevan water, PMAY housing & Railway projects. Total Budget: ₹${summary.totalSanctionedBudgetCr} Cr | Progress: ${summary.overallProgressPercentage}%. Check live status on JantaX:`,
      url: window.location.href,
    });
  };

  const handleLocateOnMap = (project: SchemeProject) => {
    navigate(`/maps?pin=${project.pincode}&lat=${project.latitude}&lng=${project.longitude}&entity=${encodeURIComponent(project.projectName)}`);
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <TransparencyDisclaimer />

      {/* Top Breadcrumb Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link
          to={`/pin/${currentPin}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '0.88rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> {tr(`Back to PIN ${currentPin} Dashboard`, `पिन ${currentPin} डैशबोर्ड पर वापस जाएं`)}
        </Link>

        <button
          type="button"
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '0.4rem 0.85rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#0f2d59',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <Share2 size={14} style={{ color: '#2563eb' }} /> {tr('Share Schemes on WhatsApp', 'व्हाट्सएप पर शेयर करें')}
        </button>
      </div>

      {/* Hero Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2d59 0%, #1e3a8a 100%)',
          borderRadius: 20,
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 8px 24px rgba(15, 45, 89, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span
            style={{
              background: 'rgba(59, 130, 246, 0.25)',
              color: '#93c5fd',
              padding: '0.2rem 0.65rem',
              borderRadius: 999,
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Compass size={13} /> {tr('CENTRAL & STATE SCHEMES RADAR', 'केंद्र एवं राज्य योजना रडार')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            {resolvedLoc.district}, {resolvedLoc.state} · PIN {currentPin}
          </span>
        </div>

        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.9rem', fontWeight: 900 }}>
          {tr('Government Schemes & Public Infrastructure Tracker', 'सरकारी योजनाएं एवं बुनियादी ढांचा ट्रैकर')}
        </h1>
        <p style={{ margin: '0 0 1.5rem', fontSize: '1rem', color: '#e2e8f0', maxWidth: 820, lineHeight: 1.5 }}>
          {tr(
            `Track every major Union and State government scheme in ${resolvedLoc.district} (PIN ${currentPin}): PMGSY roads, Jal Jeevan Mission water pipelines, PMAY housing, AMRUT urban overhaul, and new railway corridors. Check worksite locations, contractors, and actual execution progress.`,
            `आपके क्षेत्र में केंद्र एवं राज्य सरकार की प्रमुख योजनाओं (पीएमजीएसवाई, जल जीवन मिशन, पीएम आवास, रेलवे एवं अमृत) की हकीकत। (पिन ${currentPin})`
          )}
        </p>

        {/* Global Summary Metric Cards */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Total Sanctioned</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>₹{summary.totalSanctionedBudgetCr} Cr</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Funds Utilized</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80' }}>₹{summary.totalFundsUtilizedCr} Cr</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Overall Progress</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#60a5fa' }}>{summary.overallProgressPercentage}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Under Construction</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fde047' }}>{summary.projectsUnderConstruction} Works</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Completed & Audited</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#86efac' }}>{summary.projectsCompleted} Works</div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
          background: '#f1f5f9',
          padding: '0.4rem',
          borderRadius: 12,
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          style={{
            background: selectedCategory === 'ALL' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'ALL' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          All Schemes ({summary?.projects.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('ROADS_CONNECTIVITY')}
          style={{
            background: selectedCategory === 'ROADS_CONNECTIVITY' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'ROADS_CONNECTIVITY' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Roads (PMGSY / NHAI)
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('WATER_SANITATION')}
          style={{
            background: selectedCategory === 'WATER_SANITATION' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'WATER_SANITATION' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Water (Jal Jeevan)
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('RAILWAY_CORRIDOR')}
          style={{
            background: selectedCategory === 'RAILWAY_CORRIDOR' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'RAILWAY_CORRIDOR' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Railways & Transit
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('HOUSING_SHELTER')}
          style={{
            background: selectedCategory === 'HOUSING_SHELTER' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'HOUSING_SHELTER' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Housing (PMAY)
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('URBAN_TRANSFORMATION')}
          style={{
            background: selectedCategory === 'URBAN_TRANSFORMATION' ? '#0f2d59' : 'transparent',
            color: selectedCategory === 'URBAN_TRANSFORMATION' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Urban (AMRUT / Smart Cities)
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading government scheme records for PIN {currentPin}...
        </div>
      ) : (
        <div>
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', color: '#64748b' }}>
              No scheme projects found matching this category filter.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <SchemeCard
                key={project.id}
                project={project}
                onLocateOnMap={handleLocateOnMap}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
