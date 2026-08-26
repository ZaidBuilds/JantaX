import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReportCategory, CitizenReport } from '../types/citizenReport';
import { createCitizenReport } from '../services/reportingService';
import { EvidenceUploader } from './EvidenceUploader';
import { ReportPreview } from './ReportPreview';
import { resolvePincode } from '../../../core/utils/pinResolver';
import { 
  MapPin, 
  Layers, 
  FileText, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle,
  EyeOff,
  UserCheck,
  Send
} from 'lucide-react';

export function ReportForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [pinCode, setPinCode] = useState('110001');
  const [landmark, setLandmark] = useState('');
  const [district, setDistrict] = useState('New Delhi');
  const [state, setState] = useState('Delhi');

  const [category, setCategory] = useState<ReportCategory>('Road');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  const [evidenceFiles, setEvidenceFiles] = useState<Array<{ url: string; fileName: string; fileSize: string; mediaType: 'image' | 'video' }>>([]);

  const [duplicateWarning, setDuplicateWarning] = useState<CitizenReport | undefined>();
  const [createdReport, setCreatedReport] = useState<CitizenReport | undefined>();

  const categories: ReportCategory[] = ['School', 'Road', 'Healthcare', 'Water', 'Sanitation', 'Electricity', 'Public works', 'Other'];

  const handlePinChange = (val: string) => {
    setPinCode(val);
    if (val.length === 6) {
      try {
        const loc = resolvePincode(val);
        if (loc.district) setDistrict(loc.district);
        if (loc.state) setState(loc.state);
      } catch {}
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { report, duplicate } = createCitizenReport({
      title: title || `${category} Defect Report at PIN ${pinCode}`,
      category,
      description,
      pinCode,
      landmark: landmark || `${pinCode} Central Area`,
      district,
      state,
      isAnonymous,
      reporterName,
      reporterContact,
      evidenceFiles
    });

    setCreatedReport(report);
    if (duplicate) {
      setDuplicateWarning(duplicate);
    }
    setStep(6); // Confirmation Step
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', overflowX: 'auto' }}>
        {[
          { num: 1, label: 'Location' },
          { num: 2, label: 'Category' },
          { num: 3, label: 'Description' },
          { num: 4, label: 'Evidence' },
          { num: 5, label: 'Review' },
          { num: 6, label: 'Status' }
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: step === s.num ? '#f97316' : step > s.num ? '#10b981' : '#f1f5f9',
              color: step >= s.num ? '#ffffff' : '#64748b',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: step === s.num ? 700 : 500, color: step === s.num ? '#0f172a' : '#64748b' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Location */}
      {step === 1 && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} style={{ color: '#ea580c' }} /> Step 1: Select Defect Location
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Pincode *
            </label>
            <input
              type="text"
              placeholder="6-digit Indian PIN code"
              value={pinCode}
              onChange={(e) => handlePinChange(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Landmark / Specific Location *
            </label>
            <input
              type="text"
              placeholder="e.g. Near Mayur Vihar Exit Ramp, Main Road Junction..."
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>District</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!pinCode || !landmark}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              background: 'var(--gradient-accent)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              justifySelf: 'end',
              marginTop: '1rem',
              opacity: (!pinCode || !landmark) ? 0.6 : 1
            }}
          >
            Next: Select Category <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2: Select Category */}
      {step === 2 && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={20} style={{ color: '#2563eb' }} /> Step 2: Select Defect Category
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '1.1rem 1rem',
                  borderRadius: 12,
                  border: category === cat ? '2px solid #f97316' : '1px solid #e2e8f0',
                  background: category === cat ? '#fff7ed' : '#ffffff',
                  color: category === cat ? '#ea580c' : '#1e293b',
                  fontWeight: category === cat ? 800 : 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" onClick={() => setStep(1)} style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button type="button" onClick={() => setStep(3)} style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Next: Describe Issue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Describe Issue */}
      {step === 3 && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={20} style={{ color: '#10b981' }} /> Step 3: Describe Issue & Impact
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Issue Headline / Short Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Deep Pothole Cluster near Flyover Exit..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Detailed Description & Ground Impact *
            </label>
            <textarea
              rows={4}
              placeholder="Describe physical defect condition, safety hazards to commuters or students..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" onClick={() => setStep(2)} style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button type="button" onClick={() => setStep(4)} disabled={!description.trim()} style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', opacity: !description.trim() ? 0.6 : 1 }}>
              Next: Upload Evidence <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Upload Evidence */}
      {step === 4 && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Camera size={20} style={{ color: '#8b5cf6' }} /> Step 4: Upload Media Evidence
          </h3>

          <EvidenceUploader files={evidenceFiles} onChange={(f) => setEvidenceFiles(f)} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" onClick={() => setStep(3)} style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button type="button" onClick={() => setStep(5)} style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Next: Review & Submit <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Anonymity Settings */}
      {step === 5 && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Step 5: Review & Anonymity Selection
          </h3>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Choose Reporter Identity Privacy:
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: 12,
                  border: isAnonymous ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: isAnonymous ? '#eff6ff' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <EyeOff size={18} style={{ color: '#2563eb' }} /> Anonymous Submission (Recommended)
              </button>

              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: 12,
                  border: !isAnonymous ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: !isAnonymous ? '#eff6ff' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <UserCheck size={18} style={{ color: '#2563eb' }} /> Public Auditor Profile
              </button>
            </div>

            {!isAnonymous && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Your Name</label>
                  <input type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Email / Phone</label>
                  <input type="text" value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} placeholder="Email or Phone" style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                </div>
              </div>
            )}
          </div>

          <ReportPreview
            title={title || `${category} Defect Report at PIN ${pinCode}`}
            category={category}
            description={description}
            pinCode={pinCode}
            landmark={landmark}
            district={district}
            state={state}
            isAnonymous={isAnonymous}
            reporterName={reporterName}
            reporterContact={reporterContact}
            evidenceFiles={evidenceFiles}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" onClick={() => setStep(4)} style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <button type="button" onClick={handleFinalSubmit} style={{ padding: '0.75rem 1.75rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}>
              <Send size={16} /> Confirm & Submit Report
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Confirmation & Moderation Pipeline */}
      {step === 6 && createdReport && (
        <div style={{ display: 'grid', gap: '1.25rem', textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '2rem' }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Report Submitted Successfully!
          </h3>

          <p style={{ fontSize: '0.92rem', color: '#475569', maxWidth: 600, margin: '0 auto', lineHeight: 1.55 }}>
            Report Reference ID: <strong>{createdReport.id}</strong>. Your evidence has entered the automated moderation pipeline.
          </p>

          {duplicateWarning && (
            <div style={{ background: '#fffbebf', border: '1px solid #fde68a', borderRadius: 12, padding: '1rem', color: '#b45309', fontSize: '0.86rem', textAlign: 'left', maxWidth: 650, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                <AlertTriangle size={16} /> Similar Existing Report Detected!
              </div>
              A similar issue report (ID: <strong>{duplicateWarning.id}</strong>) is already recorded for PIN {pinCode}. Your report has been merged as supplementary evidence to increase civic impact.
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => navigate(`/reports/${createdReport.id}`)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: '#0f2d59', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              View Report & Moderation Status
            </button>
            <button
              onClick={() => navigate(`/reports/${createdReport.id}/action`)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--gradient-accent)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Take Official Action (CPGRAMS / State Portal)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
