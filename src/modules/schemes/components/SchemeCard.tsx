import React, { useState } from 'react';
import { SchemeProject } from '../types/scheme';
import { CostHikeBadge } from '../../representatives/components/CostHikeBadge';
import {
  Compass,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  HardHat,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Layers,
  Train,
  Droplets,
  Home,
  Construction,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SchemeCardProps {
  project: SchemeProject;
  onLocateOnMap?: (project: SchemeProject) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  ROADS_CONNECTIVITY: Construction,
  WATER_SANITATION: Droplets,
  HOUSING_SHELTER: Home,
  RAILWAY_CORRIDOR: Train,
  URBAN_TRANSFORMATION: Building,
  HEALTHCARE_WELFARE: ShieldCheck,
};

export const SchemeCard: React.FC<SchemeCardProps> = ({ project: p, onLocateOnMap }) => {
  const [milestonesOpen, setMilestonesOpen] = useState(false);
  const Icon = CATEGORY_ICONS[p.category] || Construction;

  return (
    <article
      className="glass-card"
      style={{
        borderRadius: 16,
        padding: '1.4rem',
        marginBottom: '1.25rem',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
      }}
    >
      {/* Top Header Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.15rem 0.55rem',
                borderRadius: 999,
                background: p.type === 'CENTRAL' ? '#eff6ff' : '#f0fdf4',
                color: p.type === 'CENTRAL' ? '#1d4ed8' : '#15803d',
                border: `1px solid ${p.type === 'CENTRAL' ? '#bfdbfe' : '#bbf7d0'}`,
              }}
            >
              {p.type === 'CENTRAL' ? 'Central Scheme' : p.type === 'STATE' ? 'State Scheme' : 'Centrally Sponsored (60:40)'}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#64748b',
                background: '#f8fafc',
                padding: '0.15rem 0.5rem',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
              }}
            >
              {p.schemeName}
            </span>

            <CostHikeBadge percentage={p.costHikePercentage} compact />
          </div>

          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f2d59' }}>
            {p.projectName}
          </h3>
          {p.projectNameHi && (
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              {p.projectNameHi}
            </div>
          )}
        </div>

        {/* Status Pill & Progress */}
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: 8,
              background:
                p.status === 'Completed'
                  ? '#dcfce7'
                  : p.status === 'Under Construction'
                  ? '#fef3c7'
                  : '#fee2e2',
              color:
                p.status === 'Completed'
                  ? '#166534'
                  : p.status === 'Under Construction'
                  ? '#92400e'
                  : '#991b1b',
            }}
          >
            {p.status === 'Completed' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
            {p.status} ({p.progressPercentage}%)
          </span>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.25rem' }}>
            Target: <strong>{p.targetCompletionDate}</strong>
          </div>
        </div>
      </div>

      {/* Location & Route Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.82rem',
          color: '#334155',
          background: '#f8fafc',
          padding: '0.5rem 0.85rem',
          borderRadius: 8,
          marginBottom: '0.85rem',
          border: '1px solid #eef2f7',
        }}
      >
        <MapPin size={15} style={{ color: '#ea580c', flexShrink: 0 }} />
        <span>
          <strong>Route / Worksite:</strong> {p.routeOrLocation}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>
          <span>Physical Progress</span>
          <span>{p.progressPercentage}% Complete</span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${p.progressPercentage}%`,
              height: '100%',
              background: p.progressPercentage === 100 ? '#10b981' : '#2563eb',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Financial Pillars 4-grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.5rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Sanctioned Budget</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>₹{p.totalSanctionedBudgetCr} Cr</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Center / State Share</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb' }}>
            ₹{p.centralShareCr} / ₹{p.stateShareCr} Cr
          </div>
        </div>
        <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Funds Utilized</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>₹{p.fundsUtilizedCr} Cr</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Ministry / Agency</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f2d59', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.executingAgency}
          </div>
        </div>
      </div>

      {/* Contractor & Map Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#334155' }}>
          <HardHat size={15} style={{ color: '#ea580c' }} />
          <span>Contractor: </span>
          <Link
            to={`/contractor/${p.contractorId}`}
            style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
          >
            {p.contractorName}
          </Link>
          <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#3730a3', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>
            {p.contractorRating}/100
          </span>
          {p.dlpStatus === 'Active DLP' && (
            <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>
              DLP Protected
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {p.milestones.length > 0 && (
            <button
              type="button"
              onClick={() => setMilestonesOpen(!milestonesOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '0.25rem 0.6rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              Milestones ({p.milestones.length})
              {milestonesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {onLocateOnMap && (
            <button
              type="button"
              onClick={() => onLocateOnMap(p)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: '#0f2d59',
                border: 'none',
                borderRadius: 6,
                padding: '0.3rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <MapPin size={13} style={{ color: '#f97316' }} /> Pinpoint Worksite
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Milestones Drawer */}
      {milestonesOpen && p.milestones.length > 0 && (
        <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f2d59', marginBottom: '0.5rem' }}>
            Implementation Milestones & Execution Stages
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {p.milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: m.isCompleted ? '#166534' : '#475569',
                }}
              >
                <div style={{ marginTop: 2 }}>
                  {m.isCompleted ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} /> : <Clock size={14} style={{ color: '#94a3b8' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{m.step}</strong> {m.stepHi && <span style={{ color: '#64748b' }}>({m.stepHi})</span>}
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Target: {m.targetDate} {m.completedDate && `· Completed on ${m.completedDate}`}
                    {m.remarks && ` · ${m.remarks}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
