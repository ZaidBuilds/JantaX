import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getReportById } from '../services/reportingService';
import type { CitizenReport } from '../types/citizenReport';
import { ReportStatus } from '../components/ReportStatus';
import { OfficialActionLayer } from '../components/OfficialActionLayer';
import { ArrowLeft, FileText, Send, Share2, AlertCircle } from 'lucide-react';

interface ReportDetailPageProps {
  activeTab?: 'report' | 'action';
}

export function ReportDetailPage({ activeTab: initialTab }: ReportDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [report, setReport] = useState<CitizenReport | undefined>(() => id ? getReportById(id) : undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setReport(getReportById(id));
    }
  }, [id]);

  const currentPath = location.pathname;
  let activeTab: 'report' | 'action' = initialTab || 'report';
  if (currentPath.endsWith('/action')) activeTab = 'action';

  if (!report) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Report Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested report ID "{id}" was not found in the database.
        </p>
        <Link to="/reports" style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}>
          Return to Reports Directory
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1050, margin: '0 auto' }}>
      {/* Back Navigation & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => navigate('/reports')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}>
          <ArrowLeft size={16} /> Back to Reports Directory
        </button>

        <button onClick={handleShare} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share Report'}
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <Link to={`/reports/${report.id}`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'report' ? '3px solid #f97316' : '3px solid transparent', color: activeTab === 'report' ? '#f97316' : '#64748b', fontWeight: activeTab === 'report' ? 800 : 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <FileText size={16} /> Citizen Report & Moderation
        </Link>

        <Link to={`/reports/${report.id}/action`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'action' ? '3px solid #f97316' : '3px solid transparent', color: activeTab === 'action' ? '#f97316' : '#64748b', fontWeight: activeTab === 'action' ? 800 : 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Send size={16} /> Official Action & CPGRAMS Layer
        </Link>
      </div>

      {/* Tab 1: Citizen Report & Moderation */}
      {activeTab === 'report' && (
        <ReportStatus report={report} onUpdate={() => setReport(getReportById(report.id))} />
      )}

      {/* Tab 2: Official Action & Tracking Layer */}
      {activeTab === 'action' && (
        <OfficialActionLayer report={report} />
      )}
    </div>
  );
}
