import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../core/services/api';
import { resolvePincode } from '../core/utils/pinResolver';
import { SourceBadge } from '../components/UI/SourceBadge';
import { Layout } from '../shell/Layout';
import { useLanguage } from '../core/context/LanguageContext';
import { LoadingOverlay, NoResultsState, ErrorState, SkeletonCard } from '../components/data-states';
import {
  FileText,
  MapPin,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
} from 'lucide-react';

interface Report {
  id: string;
  title?: string;
  category?: string;
  description: string;
  status: string;
  module?: string;
  createdAt: string;
  pincode?: string;
}

export function ReportsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pinInput, setPinInput] = useState(searchParams.get('pin') || '110001');
  const [currentPin, setCurrentPin] = useState(searchParams.get('pin') || '110001');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const { t } = useLanguage();

  const loc = resolvePincode(currentPin);

  useEffect(() => {
    loadReports();
  }, [currentPin]);

  const loadReports = () => {
    setLoading(true);
    api
      .getReports(currentPin)
      .then((r) => {
        setReports(Array.isArray(r) ? r : []);
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  const handlePinSubmit = () => {
    setCurrentPin(pinInput);
    setSearchParams({ pin: pinInput });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'resolved':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'pending':
      case 'submitted':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'rejected':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      default:
        return <AlertCircle size={16} style={{ color: '#94a3b8' }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; color: string }> = {
      approved: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
      pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
      rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
      resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
      submitted: { bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9' },
    };
    const colors = statusColors[status?.toLowerCase()] || { bg: '#f1f5f9', color: '#64748b' };

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.2rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 700,
          background: colors.bg,
          color: colors.color,
        }}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const filteredReports =
    filter === 'all' ? reports : reports.filter((r) => r.status?.toLowerCase() === filter);

  return (
    <Layout showBreadcrumbs>
      <div style={{ padding: '2rem 0', maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            borderLeft: '4px solid #ef4444',
            paddingLeft: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ fontSize: '1.6rem', color: '#0f2d59', margin: 0 }}>
            {t('reports')}
          </h1>
          <p style={{ color: '#475569', marginTop: '0.4rem' }}>
            Browse citizen reports and ground-truth submissions for any PIN code.
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #eef2f7',
            borderRadius: 12,
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,.04)',
          }}
        >
          <h3 style={{ color: '#0f2d59', marginTop: 0, marginBottom: '0.75rem' }}>
            Search by PIN Code
          </h3>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit PIN"
              maxLength={6}
              style={{
                padding: '0.5rem 1rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                maxWidth: 160,
                outline: 'none',
              }}
            />
            <button
              onClick={handlePinSubmit}
              style={{
                padding: '0.5rem 1.25rem',
                background: 'var(--gradient-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MapPin size={16} style={{ marginRight: '0.35rem', verticalAlign: -2 }} />
              Search
            </button>
          </div>
          {loc.isValid && (
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
              📍 {loc.district} ({loc.state})
              {loc.stateCode && (
                <span
                  style={{
                    marginLeft: '0.4rem',
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-700)',
                    border: '1px solid var(--color-primary-500)',
                    padding: '1px 7px',
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: '0.62rem',
                  }}
                >
                  {loc.stateCode}
                </span>
              )}
            </p>
          )}
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #eef2f7',
            borderRadius: 12,
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <h3 style={{ color: '#0f2d59', margin: 0 }}>
              <FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: -3 }} />
              Reports for PIN {currentPin}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} style={{ color: '#64748b' }} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} variant="default" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <NoResultsState
              query={currentPin}
              onClear={() => setFilter('all')}
              className=""
            />
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    border: '1px solid #eef2f7',
                    borderRadius: 10,
                    padding: '1rem',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'var(--color-accent)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {report.category || report.module || 'General'}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#0f2d59',
                          margin: '0.15rem 0',
                        }}
                      >
                        {report.title || 'Citizen Report'}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: '#475569',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {report.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <SourceBadge
                        sourceType="E"
                        sourceName={`${report.status || 'PENDING'} · ${report.module || 'citizen'}`}
                      />
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
