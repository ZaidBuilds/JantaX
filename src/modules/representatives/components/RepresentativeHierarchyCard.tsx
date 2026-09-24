import React, { useState } from 'react';
import { PublicRepresentative, SanctionedWork } from '../types/representative';
import { RepresentativeFundBar } from './RepresentativeFundBar';
import { CostHikeBadge } from './CostHikeBadge';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Construction,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HardHat,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RepresentativeHierarchyCardProps {
  representative: PublicRepresentative;
  onLocateWorkOnMap?: (work: SanctionedWork) => void;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GRAM_PANCHAYAT: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  BLOCK_PANCHAYAT: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  ZILA_PANCHAYAT: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  MUNICIPAL_WARD: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  MUNICIPAL_CHAIRMAN: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
  VIDHAN_SABHA: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  LOK_SABHA: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  RAJYA_SABHA: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
};

export const RepresentativeHierarchyCard: React.FC<RepresentativeHierarchyCardProps> = ({
  representative: rep,
  onLocateWorkOnMap,
}) => {
  const [worksExpanded, setWorksExpanded] = useState(true);
  const tierStyle = TIER_COLORS[rep.tier] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };

  return (
    <article
      className="glass-card"
      style={{
        borderRadius: 16,
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
      }}
    >
      {/* Top Header Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src={rep.photoUrl}
            alt={rep.name}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${rep.partyColor || '#2563eb'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 999,
                  background: tierStyle.bg,
                  color: tierStyle.text,
                  border: `1px solid ${tierStyle.border}`,
                  letterSpacing: '0.04em',
                }}
              >
                {rep.tierLabel} · {rep.tierLabelHi}
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: rep.partyColor,
                  background: '#f8fafc',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                }}
              >
                {rep.party}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f2d59' }}>
              {rep.name}
              {rep.nameHi && <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748b', marginLeft: '0.4rem' }}>({rep.nameHi})</span>}
            </h3>
            <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
              {rep.designation} · {rep.bodyName}
            </div>
          </div>
        </div>

        {/* Term & Area */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
            <Calendar size={13} /> Term: <strong>{rep.termStart} – {rep.termEnd}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#0f2d59', fontWeight: 700 }}>
            <MapPin size={13} style={{ color: '#ea580c' }} /> {rep.constituencyOrArea}
          </div>
          {rep.coOfficialName && (
            <div style={{ fontSize: '0.74rem', color: '#047857', background: '#ecfdf5', padding: '0.15rem 0.45rem', borderRadius: 4, marginTop: '0.2rem' }}>
              {rep.coOfficialName}
            </div>
          )}
        </div>
      </div>

      {/* Office & Contact Strip */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
          fontSize: '0.78rem',
          color: '#64748b',
          background: '#f8fafc',
          padding: '0.55rem 0.85rem',
          borderRadius: 8,
          marginBottom: '0.85rem',
          border: '1px solid #eef2f7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Building2 size={13} style={{ color: '#0f2d59' }} /> Office: {rep.officeAddress}
        </div>
        {rep.helplinePhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Phone size={13} style={{ color: '#16a34a' }} /> Helpline: <a href={`tel:${rep.helplinePhone}`} style={{ color: '#2563eb', fontWeight: 600 }}>{rep.helplinePhone}</a>
          </div>
        )}
        {rep.officialEmail && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Mail size={13} style={{ color: '#2563eb' }} /> <a href={`mailto:${rep.officialEmail}`} style={{ color: '#2563eb' }}>{rep.officialEmail}</a>
          </div>
        )}
      </div>

      {/* Fund Envelope Breakdown */}
      <RepresentativeFundBar fund={rep.fundSummary} />

      {/* Sanctioned Works Section */}
      <div style={{ marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => setWorksExpanded(!worksExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '0.4rem 0',
            cursor: 'pointer',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Construction size={16} style={{ color: '#ea580c' }} />
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f2d59' }}>
              Sanctioned Works & Projects ({rep.works.length})
            </span>
            {rep.avgHikePercentage > 0 && (
              <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#dc2626', padding: '0.1rem 0.45rem', borderRadius: 4, fontWeight: 700 }}>
                Avg Cost Hike: +{rep.avgHikePercentage}%
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.8rem' }}>
            {worksExpanded ? 'Collapse' : 'View Projects'}
            {worksExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {worksExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
            {rep.works.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No active public works registered under this representative in this immediate locality.
              </div>
            ) : (
              rep.works.map((work) => (
                <div
                  key={work.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '0.85rem',
                    background: '#ffffff',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: 4,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                          }}
                        >
                          {work.sector}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: 4,
                            background:
                              work.status === 'Completed'
                                ? '#dcfce7'
                                : work.status === 'Under Construction'
                                ? '#fef3c7'
                                : '#fee2e2',
                            color:
                              work.status === 'Completed'
                                ? '#15803d'
                                : work.status === 'Under Construction'
                                ? '#b45309'
                                : '#b91c1c',
                          }}
                        >
                          {work.status}
                        </span>
                        <CostHikeBadge percentage={work.costHikePercentage} reason={work.costHikeReason} compact />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f2d59' }}>
                        {work.workTitle}
                      </h4>
                      {work.workTitleHi && (
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                          {work.workTitleHi}
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Sanctioned / Actual</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2d59' }}>
                        ₹{work.sanctionedCostLakhs}L{' '}
                        {work.actualCostLakhs !== work.sanctionedCostLakhs && (
                          <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>
                            → ₹{work.actualCostLakhs}L
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contractor & Location Metadata */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginTop: '0.5rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px dashed #e2e8f0',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HardHat size={14} style={{ color: '#ea580c' }} />
                      <span>Contractor: </span>
                      <Link
                        to={`/contractor/${work.contractorId}`}
                        style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                      >
                        {work.contractorName}
                      </Link>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          background: '#e0e7ff',
                          color: '#4338ca',
                          padding: '0.1rem 0.35rem',
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        Rating {work.contractorRating}/100
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {work.dlpStatus === 'Active DLP' && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#15803d',
                            background: '#dcfce7',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 4,
                          }}
                        >
                          <ShieldCheck size={11} style={{ display: 'inline', marginRight: 2 }} />
                          DLP until {work.dlpExpiryDate}
                        </span>
                      )}

                      {onLocateWorkOnMap && (
                        <button
                          type="button"
                          onClick={() => onLocateWorkOnMap(work)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: 6,
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#0f2d59',
                            cursor: 'pointer',
                          }}
                        >
                          <MapPin size={11} style={{ color: '#ea580c' }} /> View on Map
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
};
