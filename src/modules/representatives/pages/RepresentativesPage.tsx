import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resolvePincode } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { representativeService } from '../services/representativeService';
import { LocalityGovernanceHierarchy, PublicRepresentative, GovernanceTier, SanctionedWork } from '../types/representative';
import { RepresentativeHierarchyCard } from '../components/RepresentativeHierarchyCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import {
  Users,
  MapPin,
  Building2,
  IndianRupee,
  Share2,
  ArrowLeft,
  Filter,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export function RepresentativesPage() {
  const { pinCode } = useParams<{ pinCode?: string }>();
  const navigate = useNavigate();
  const currentPin = pinCode || '110001';
  const resolvedLoc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const [hierarchy, setHierarchy] = useState<LocalityGovernanceHierarchy | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isAlive = true;
    setLoading(true);
    representativeService.getLocalityHierarchy(currentPin).then((data) => {
      if (isAlive) {
        setHierarchy(data);
        setLoading(false);
      }
    });
    return () => {
      isAlive = false;
    };
  }, [currentPin]);

  const filteredReps = useMemo(() => {
    if (!hierarchy) return [];
    if (selectedTier === 'ALL') return hierarchy.representatives;
    return hierarchy.representatives.filter((r) => r.tier === selectedTier);
  }, [hierarchy, selectedTier]);

  const handleShare = () => {
    if (!hierarchy) return;
    share({
      title: `Public Representatives & Fund Audit — PIN ${currentPin}`,
      text: `Track your Gram Pradhan, Block Pramukh, Mayor, MLA & MP in ${hierarchy.district}, ${hierarchy.state} (PIN ${currentPin}). Total Funds: ₹${hierarchy.totalLocalBudgetCr} Cr | Spent: ₹${hierarchy.totalSpentCr} Cr | Avg Cost Hike: +${hierarchy.averageCostHike}%. Full audit on JantaX:`,
      url: window.location.href,
    });
  };

  const handleLocateOnMap = (work: SanctionedWork) => {
    navigate(`/maps?pin=${work.pincode}&lat=${work.latitude}&lng=${work.longitude}&entity=${encodeURIComponent(work.workTitle)}`);
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <TransparencyDisclaimer />

      {/* Breadcrumb Navigation */}
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
          <Share2 size={14} style={{ color: '#2563eb' }} /> {tr('Share Audit on WhatsApp', 'व्हाट्सएप पर ऑडिट शेयर करें')}
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
              background: 'rgba(249, 115, 22, 0.25)',
              color: '#fb923c',
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
            <Users size={13} /> {tr('MULTI-TIER GOVERNANCE RADAR', 'बहुस्तरीय जनप्रतिनिधि रडार')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
            {hierarchy?.areaType === 'Rural' ? 'Panchayati Raj & Parliament' : 'Municipal Corporation & Parliament'}
          </span>
        </div>

        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.9rem', fontWeight: 900 }}>
          {tr('Public Representatives & Public Fund Tracker', 'जनप्रतिनिधि, फंड आवंटन एवं प्रोजेक्ट ट्रैकर')}
        </h1>
        <p style={{ margin: '0 0 1.5rem', fontSize: '1rem', color: '#e2e8f0', maxWidth: 820, lineHeight: 1.5 }}>
          {tr(
            `Track every rupee released to your Gram Pradhan, Block Pramukh, Zila Adhyaksha, Mayor, MLA, and MP in ${resolvedLoc.district}, ${resolvedLoc.state} (PIN ${currentPin}). Monitor cost overruns, contractor assignments, and actual delivery.`,
            `अपने ग्राम प्रधान, ब्लॉक प्रमुख, जिला पंचायत अध्यक्ष, महापौर, विधायक एवं सांसद को जारी फंड और स्वीकृत कार्यों का पाई-पाई का हिसाब। (पिन ${currentPin} - ${resolvedLoc.district})`
          )}
        </p>

        {/* Global Local Counters */}
        {hierarchy && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Total Public Funds</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>₹{hierarchy.totalLocalBudgetCr} Cr</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Reported Expenditure</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80' }}>₹{hierarchy.totalSpentCr} Cr</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Unspent Treasury Balance</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fde047' }}>₹{hierarchy.totalUnspentCr} Cr</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Avg Project Cost Hike</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: hierarchy.averageCostHike > 15 ? '#f87171' : '#60a5fa' }}>
                +{hierarchy.averageCostHike}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Governing Tiers</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>{hierarchy.representatives.length} Levels</div>
            </div>
          </div>
        )}
      </div>

      {/* Tier Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          background: '#f1f5f9',
          padding: '0.4rem',
          borderRadius: 12,
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedTier('ALL')}
          style={{
            background: selectedTier === 'ALL' ? '#0f2d59' : 'transparent',
            color: selectedTier === 'ALL' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          All Representatives ({hierarchy?.representatives.length || 0})
        </button>

        {hierarchy?.representatives.map((rep) => (
          <button
            key={rep.id}
            type="button"
            onClick={() => setSelectedTier(rep.tier)}
            style={{
              background: selectedTier === rep.tier ? '#0f2d59' : 'transparent',
              color: selectedTier === rep.tier ? '#ffffff' : '#475569',
              border: 'none',
              borderRadius: 8,
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {rep.tierLabel}
          </button>
        ))}
      </div>

      {/* Representatives Hierarchy Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading public governance records for PIN {currentPin}...
        </div>
      ) : (
        <div>
          {filteredReps.map((rep) => (
            <RepresentativeHierarchyCard
              key={rep.id}
              representative={rep}
              onLocateWorkOnMap={handleLocateOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
