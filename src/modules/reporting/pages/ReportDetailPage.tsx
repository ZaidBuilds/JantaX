import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getReportById } from '../services/reportingService';
import type { CitizenReport } from '../types/citizenReport';
import { ReportStatus } from '../components/ReportStatus';
import { OfficialActionLayer } from '../components/OfficialActionLayer';
import { FileText, Send, Share2, AlertCircle } from 'lucide-react';
import { Breadcrumbs, EmptyState, reportForDisplay } from '../../../ui';

const load = (id: string) => {
  const r = getReportById(id);
  return r ? reportForDisplay(r) : undefined;
};

interface ReportDetailPageProps {
  activeTab?: 'report' | 'action';
}

export function ReportDetailPage({ activeTab: initialTab }: ReportDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [report, setReport] = useState<CitizenReport | undefined>(() => (id ? load(id) : undefined));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setReport(load(id));
    }
  }, [id]);

  const currentPath = location.pathname;
  let activeTab: 'report' | 'action' = initialTab || 'report';
  if (currentPath.endsWith('/action')) activeTab = 'action';

  if (!report) {
    return (
      <div className="page page-narrow">
        <Breadcrumbs items={[{ label: 'Citizen reports', to: '/reports' }, { label: 'Not found' }]} />
        <div className="card">
          <EmptyState
            icon={AlertCircle}
            title="We could not find that report"
            text={`No report with the reference "${id}" exists, or it was removed after review.`}
            action={<Link to="/reports" className="btn btn-primary">Back to all reports</Link>}
          />
        </div>
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
    <div className="page">
      <Breadcrumbs items={[{ label: 'Citizen reports', to: '/reports' }, { label: report.title }]} />
      <header className="page-header">
        <div className="page-header-main">
          <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2rem)' }}>{report.title}</h1>
          <p className="page-lede">
            {report.category} · PIN {report.location.pinCode} · {report.location.landmark}, {report.location.district}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" onClick={handleShare} className="btn btn-secondary">
            <Share2 size={16} aria-hidden="true" /> {copied ? 'Link copied' : 'Share'}
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Report sections" style={{ marginBottom: 'var(--s-6)' }}>
        <Link to={`/reports/${report.id}`} className={`tab${activeTab === 'report' ? ' is-active' : ''}`} aria-current={activeTab === 'report' ? 'page' : undefined}>
          <FileText size={16} aria-hidden="true" /> Report and moderation
        </Link>
        <Link to={`/reports/${report.id}/action`} className={`tab${activeTab === 'action' ? ' is-active' : ''}`} aria-current={activeTab === 'action' ? 'page' : undefined}>
          <Send size={16} aria-hidden="true" /> Official action
        </Link>
      </nav>

      {/* Tab 1: Citizen Report & Moderation */}
      {activeTab === 'report' && (
        <ReportStatus report={report} onUpdate={() => setReport(load(report.id))} />
      )}

      {/* Tab 2: Official Action & Tracking Layer */}
      {activeTab === 'action' && (
        <OfficialActionLayer report={report} />
      )}
    </div>
  );
}
