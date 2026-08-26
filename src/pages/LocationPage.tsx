import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../core/services/api';
import { resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { Layout } from '../shell/Layout';
import { LoadingOverlay, ErrorState, OfflineState, SkeletonCard } from '../components/data-states';
import {
  MapPin,
  GraduationCap,
  Construction,
  HardHat,
  Home,
  Hospital,
  Wheat,
  Droplets,
  Users,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

interface LocationData {
  pincode: string;
  state: string;
  district: string;
  region: string;
  counts: {
    schools: number;
    infraProjects: number;
    reraProjects: number;
    hospitals: number;
    pdsShops: number;
    grievances: number;
    citizenReports: number;
  };
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  school: GraduationCap,
  infra: Construction,
  contractor: HardHat,
  rera: Home,
  hospital: Hospital,
  ration: Wheat,
  citizenReports: Users,
  grievances: HeartHandshake,
  pdsShops: Droplets,
};

const MODULE_COLORS: Record<string, string> = {
  school: '#3b82f6',
  infra: '#f59e0b',
  contractor: '#ef4444',
  rera: '#06b6d4',
  hospital: '#ec4899',
  ration: '#d97706',
  citizenReports: '#10b981',
  grievances: '#8b5cf6',
  pdsShops: '#14b8a6',
};

export function LocationPage() {
  const { pincode } = useParams<{ pincode: string }>();
  const navigate = useNavigate();
  const { setSelectedPin } = usePin();
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pincode) {
      loadLocationData(pincode);
      setSelectedPin(pincode);
    }
  }, [pincode]);

  const loadLocationData = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const info = await api.getPincode(code);
      if (info) {
        setData({
          pincode: code,
          state: info.state || 'Unknown',
          district: info.district || 'Unknown',
          region: info.region || 'Unknown',
          counts: info.counts || {
            schools: 0,
            infraProjects: 0,
            reraProjects: 0,
            hospitals: 0,
            pdsShops: 0,
            grievances: 0,
            citizenReports: 0,
          },
        });
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout showBreadcrumbs>
        <div style={{ padding: '2rem 0', maxWidth: 900, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0f2d59 0%, #1a4d8f 100%)',
              borderRadius: 16,
              padding: '2rem',
              color: '#fff',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="animate-pulse"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.15)',
                }}
              />
              <div>
                <div
                  className="animate-pulse"
                  style={{ width: 120, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }}
                />
                <div
                  className="animate-pulse"
                  style={{ width: 180, height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginTop: 8 }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} variant="default" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout showBreadcrumbs>
        <div style={{ padding: '2rem 0', maxWidth: 900, margin: '0 auto' }}>
          <ErrorState
            title="Location Not Found"
            message={`We couldn't find data for PIN code ${pincode}. Please check the PIN code and try again.`}
            onRetry={() => pincode && loadLocationData(pincode)}
            onGoHome={() => navigate('/')}
          />
        </div>
      </Layout>
    );
  }

  const modules = [
    { id: 'school', name: 'Schools', count: data.counts.schools, desc: 'UDISE+ scorecard' },
    { id: 'infra', name: 'Public Works', count: data.counts.infraProjects, desc: 'PMGSY, PWD, NHAI' },
    { id: 'rera', name: 'RERA Projects', count: data.counts.reraProjects, desc: 'Project delays & complaints' },
    { id: 'hospital', name: 'Healthcare', count: data.counts.hospitals, desc: 'PHCs, CHCs & hospitals' },
    { id: 'contractor', name: 'Contractors', count: 0, desc: 'Builder scorecard' },
    { id: 'ration', name: 'Welfare Schemes', count: data.counts.pdsShops, desc: 'PDS, ration shops' },
  ];

  return (
    <Layout
      showBreadcrumbs
      breadcrumbs={[
        { label: 'PIN ' + data.pincode, path: `/location/${data.pincode}` },
      ]}
    >
      <div style={{ padding: '2rem 0', maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f2d59 0%, #1a4d8f 100%)',
            borderRadius: 16,
            padding: '2rem',
            color: '#fff',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>
                PIN {data.pincode}
              </h1>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
                {data.district}, {data.state} · {data.region}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            {[
              { label: 'Schools', value: data.counts.schools },
              { label: 'Projects', value: data.counts.infraProjects },
              { label: 'RERA', value: data.counts.reraProjects },
              { label: 'Hospitals', value: data.counts.hospitals },
              { label: 'Reports', value: data.counts.citizenReports },
              { label: 'Grievances', value: data.counts.grievances },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '0.75rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <h2
          style={{
            fontSize: '1.3rem',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Explore Modules for PIN {data.pincode}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {modules.map((module) => {
            const Icon = MODULE_ICONS[module.id] || Construction;
            const color = MODULE_COLORS[module.id] || '#64748b';

            return (
              <div
                key={module.id}
                onClick={() => navigate(`/module/${module.id}?pin=${data.pincode}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #eef2f7',
                  borderRadius: 12,
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#eef2f7';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    marginBottom: '0.85rem',
                  }}
                >
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: '0 0 0.25rem',
                  }}
                >
                  {module.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {module.desc}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: color,
                    }}
                  >
                    {module.count}
                    <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#94a3b8', marginLeft: '0.25rem' }}>
                      records
                    </span>
                  </span>
                  <ArrowRight size={16} style={{ color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'var(--color-primary-50)',
            borderRadius: 12,
            border: '1px solid var(--color-primary-500)',
          }}
        >
          <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', margin: 0 }}>
            💡 <strong>Tip:</strong> Click any module to see detailed data and evidence for PIN {data.pincode}.
            Use the "Compare" feature to compare multiple PIN codes side by side.
          </p>
        </div>
      </div>
    </Layout>
  );
}
