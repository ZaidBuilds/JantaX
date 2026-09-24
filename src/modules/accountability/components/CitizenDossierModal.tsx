import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  X,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  generateSection6RtiApplication,
  generateLokayuktaComplaintBrief,
  generateLocalityHealthSummaryText,
  RtiDraftOptions,
  LokayuktaDraftOptions,
  LocalityDossierData,
} from '../services/dossierService';

export interface CitizenDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'rti' | 'lokayukta' | 'dossier';
  rtiOptions?: Partial<RtiDraftOptions>;
  lokayuktaOptions?: Partial<LokayuktaDraftOptions>;
  dossierData?: Partial<LocalityDossierData>;
}

export const CitizenDossierModal: React.FC<CitizenDossierModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'rti',
  rtiOptions,
  lokayuktaOptions,
  dossierData,
}) => {
  const [activeTab, setActiveTab] = useState<'rti' | 'lokayukta' | 'dossier'>(defaultTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prepare full data with sensible civic defaults if props omit them
  const fullRtiOpts: RtiDraftOptions = {
    publicAuthority: rtiOptions?.publicAuthority || 'Executive Engineer, Public Works Department (PWD)',
    department: rtiOptions?.department || 'Roads & Infrastructure Division',
    workTitle: rtiOptions?.workTitle || 'Arterial Road Asphalting and Drainage Works',
    workOrderNo: rtiOptions?.workOrderNo || 'PWD/DIV-II/2023-24/WO-842',
    sanctionedBudgetLakhs: rtiOptions?.sanctionedBudgetLakhs || 480,
    contractorName: rtiOptions?.contractorName || 'M/s Apex Infrastructure Builders Ltd',
    dlpEndDate: rtiOptions?.dlpEndDate || '31 March 2026',
    localityPin: rtiOptions?.localityPin || '250001',
    specificIssue: rtiOptions?.specificIssue || 'Severe top-surface bitumen peeling within 8 months of completion.',
  };

  const fullLokayuktaOpts: LokayuktaDraftOptions = {
    complaintTitle: lokayuktaOptions?.complaintTitle || 'Misappropriation of Public Funds & Premature Structural Failure of Arterial Road',
    authorityOrOfficer: lokayuktaOptions?.authorityOrOfficer || 'Superintending Engineer & Assistant Engineer, PWD Division',
    department: lokayuktaOptions?.department || 'Public Works Department',
    allegationSummary: lokayuktaOptions?.allegationSummary || 'Funds released upon fabricated completion certification without meeting IRC SP:98 mandatory core-cut density standards.',
    workOrderNo: lokayuktaOptions?.workOrderNo || 'PWD/DIV-II/2023-24/WO-842',
    estimatedFinancialLossCr: lokayuktaOptions?.estimatedFinancialLossCr || 4.8,
    contractorName: lokayuktaOptions?.contractorName || 'M/s Apex Infrastructure Builders Ltd',
    localityPin: lokayuktaOptions?.localityPin || '250001',
  };

  const fullDossierData: LocalityDossierData = {
    pinCode: dossierData?.pinCode || '250001',
    localityName: dossierData?.localityName || 'Meerut Central',
    district: dossierData?.district || 'Meerut',
    state: dossierData?.state || 'Uttar Pradesh',
    civicHealthScore: dossierData?.civicHealthScore || 68,
    metrics: {
      schoolsCompliancePct: dossierData?.metrics?.schoolsCompliancePct ?? 78,
      activeDlpWarranties: dossierData?.metrics?.activeDlpWarranties ?? 14,
      pdsDeliveryPct: dossierData?.metrics?.pdsDeliveryPct ?? 92,
      hospitalBedsOccupiedPct: dossierData?.metrics?.hospitalBedsOccupiedPct ?? 84,
      airQualityIndex: dossierData?.metrics?.airQualityIndex ?? 186,
      grievanceDisposalRatePct: dossierData?.metrics?.grievanceDisposalRatePct ?? 64,
    },
    highlightedDefects: dossierData?.highlightedDefects || [
      {
        title: 'Arterial Road Pavement Cratering within Active DLP Warranty',
        department: 'PWD Division II',
        delayDays: 142,
        severity: 'HIGH',
      },
      {
        title: 'Sadar Tehsil Land Mutation (Dakhil-Kharij) SLA Overrun',
        department: 'Revenue & Land Records',
        delayDays: 73,
        severity: 'MEDIUM',
      },
    ],
  };

  const currentContent =
    activeTab === 'rti'
      ? generateSection6RtiApplication(fullRtiOpts)
      : activeTab === 'lokayukta'
      ? generateLokayuktaComplaintBrief(fullLokayuktaOpts)
      : generateLocalityHealthSummaryText(fullDossierData);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `JantaX_${activeTab.toUpperCase()}_PIN_${fullRtiOpts.localityPin}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🏛️ *JantaX Civic Legal Action Alert*\nPIN: ${fullRtiOpts.localityPin}\nSubject: ${fullRtiOpts.workTitle}\n\nGenerated official Section 6(1) RTI & Vigilance petition citing IRC SP:98 warranty clauses.\n\nInspect & demand accountability on JantaX: https://jantax.org/pin/${fullRtiOpts.localityPin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          color: 'var(--text-primary, #0f172a)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color, #e2e8f0)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--navy-950, #081a33)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} style={{ color: '#38bdf8' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Citizen Legal Action & Dossier Generator
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Statutory Section 6(1) RTI clauses, Lokayukta petitions, and verifiable audit records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-subtle, #f8fafc)',
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            padding: '0.5rem 1rem 0',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('rti')}
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'rti' ? '3px solid #2563eb' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'rti' ? '#2563eb' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={16} /> Section 6(1) RTI Draft
          </button>
          <button
            onClick={() => setActiveTab('lokayukta')}
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'lokayukta' ? '3px solid #b91c1c' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'lokayukta' ? '#b91c1c' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={16} /> Lokayukta / Vigilance Petition
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'dossier' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'dossier' ? '#047857' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Building2 size={16} /> Locality Health Dossier
          </button>
        </div>

        {/* Content Preview Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#166534',
              marginBottom: '1rem',
            }}
          >
            <Check size={16} style={{ flexShrink: 0 }} />
            <span>
              Pre-filled with statutory IRC SP:98 warranty provisions and Section 6(1) query points. Ready to print, copy, or submit online.
            </span>
          </div>

          <pre
            style={{
              fontFamily: 'JetBrains Mono, monospace, monospace',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              background: 'var(--bg-canvas, #f8fafc)',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #e2e8f0)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              color: '#1e293b',
            }}
          >
            {currentContent}
          </pre>
        </div>

        {/* Action Toolbar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            background: 'var(--bg-subtle, #f8fafc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: copied ? '#166534' : '#334155',
              }}
            >
              {copied ? <Check size={16} color="#166534" /> : <Copy size={16} />}
              {copied ? 'Copied to Clipboard!' : '1-Click Copy'}
            </button>
            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <Download size={16} /> Download .TXT
            </button>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <Printer size={16} /> Print / Export PDF
            </button>
          </div>

          <button
            onClick={handleWhatsApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#25D366',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Share2 size={16} /> Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
