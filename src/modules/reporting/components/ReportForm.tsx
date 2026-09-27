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
      title: title || `${category} problem at PIN ${pinCode}`,
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

  // Validate when the person presses Next, name what is missing and move focus to it.
  const [errors, setErrors] = useState<Record<string, string>>({});
  const goNext = (from: number) => {
    const e: Record<string, string> = {};
    if (from === 1) {
      if (!/^[1-9]\d{5}$/.test(pinCode)) e.pin = 'Enter a six-digit PIN code, for example 110001.';
      if (landmark.trim().length < 3) e.landmark = 'Add a landmark so the office can find the spot.';
    }
    if (from === 3 && description.trim().length < 20) e.description = 'Describe what you saw in at least 20 characters.';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`report-${first}`)?.focus();
      return;
    }
    setStep(from + 1);
  };
  const fieldProps = (key: string) => ({
    id: `report-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `report-${key}-error` : undefined,
  });
  const fieldError = (key: string) =>
    errors[key] ? (
      <span id={`report-${key}-error`} className="error-text" role="alert">
        <AlertTriangle size={12} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />
        {errors[key]}
      </span>
    ) : null;

  const STEPS = ['Location', 'Category', 'Description', 'Evidence', 'Review', 'Status'];
  const stepTitle = (icon: React.ReactNode, text: string) => (
    <h2 className="report-step-title">
      {icon}
      {text}
    </h2>
  );
  const nav = (back: number | null, next: React.ReactNode) => (
    <div className="report-step-nav">
      {back ? (
        <button type="button" className="btn btn-secondary" onClick={() => setStep(back)}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
      ) : (
        <span />
      )}
      {next}
    </div>
  );

  return (
    <div className="card report-wizard">
      <ol className="report-steps" aria-label="Report progress">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = step === n ? 'current' : step > n ? 'done' : 'todo';
          return (
            <li key={label} className={`report-step is-${state}`} aria-current={step === n ? 'step' : undefined}>
              <span className="report-step-dot" aria-hidden="true">{step > n ? <CheckCircle2 size={16} /> : n}</span>
              <span className="report-step-label">{label}</span>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div className="stack">
          {stepTitle(<MapPin size={20} aria-hidden="true" />, 'Where is the problem?')}
          <div className="field">
            <label className="label" htmlFor="report-pin">PIN code</label>
            <input {...fieldProps('pin')} className="input num" inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="110001" value={pinCode} onChange={(e) => handlePinChange(e.target.value.replace(/\D/g, ''))} />
            {fieldError('pin')}
          </div>
          <div className="field">
            <label className="label" htmlFor="report-landmark">Landmark or exact spot</label>
            <input {...fieldProps('landmark')} className="input" placeholder="e.g. Near the Mayur Vihar exit ramp" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
            {fieldError('landmark') ?? <span className="hint">Something the office can find: a junction, building or shop.</span>}
          </div>
          <div className="report-grid-2">
            <div className="field">
              <label className="label" htmlFor="report-district">District</label>
              <input id="report-district" className="input" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="report-state">State</label>
              <input id="report-state" className="input" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>
          <span className="hint">District and state fill in from the PIN code. Change them if they are wrong.</span>
          {nav(null, (
            <button type="button" className="btn btn-primary" onClick={() => goNext(1)}>
              Next: choose a category <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="stack">
          {stepTitle(<Layers size={20} aria-hidden="true" />, 'What kind of problem is it?')}
          <div className="report-choices" role="group" aria-label="Category">
            {categories.map((cat) => (
              <button key={cat} type="button" className="report-choice" aria-pressed={category === cat} onClick={() => setCategory(cat)}>
                {category === cat && <CheckCircle2 size={16} aria-hidden="true" />}
                {cat}
              </button>
            ))}
          </div>
          {nav(1, (
            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
              Next: describe it <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="stack">
          {stepTitle(<FileText size={20} aria-hidden="true" />, 'What did you see?')}
          <div className="field">
            <label className="label" htmlFor="report-title">Short title <span className="muted">(optional)</span></label>
            <input id="report-title" className="input" placeholder="e.g. Deep potholes near the flyover exit" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="report-description">Description</label>
            <textarea {...fieldProps('description')} className="textarea" rows={5} placeholder="What is wrong, since when, and who is affected (commuters, students, patients)?" value={description} onChange={(e) => setDescription(e.target.value)} />
            {fieldError('description') ?? <span className="hint">{description.trim().length < 20 ? `${20 - description.trim().length} more characters needed` : 'Looks good.'}</span>}
          </div>
          {nav(2, (
            <button type="button" className="btn btn-primary" onClick={() => goNext(3)}>
              Next: add evidence <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="stack">
          {stepTitle(<Camera size={20} aria-hidden="true" />, 'Add a photo or video')}
          <EvidenceUploader files={evidenceFiles} onChange={(f) => setEvidenceFiles(f)} />
          {nav(3, (
            <button type="button" className="btn btn-primary" onClick={() => setStep(5)}>
              Next: review <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="stack">
          {stepTitle(<Send size={20} aria-hidden="true" />, 'Review and choose how you appear')}
          <div className="report-choices report-choices-2" role="group" aria-label="Who can see your name">
            <button type="button" className="report-choice" aria-pressed={isAnonymous} onClick={() => setIsAnonymous(true)}>
              <EyeOff size={18} aria-hidden="true" />
              <span>
                <strong>Anonymous</strong>
                <span className="hint" style={{ display: 'block' }}>Recommended. Your name is never shown.</span>
              </span>
            </button>
            <button type="button" className="report-choice" aria-pressed={!isAnonymous} onClick={() => setIsAnonymous(false)}>
              <UserCheck size={18} aria-hidden="true" />
              <span>
                <strong>Show my name</strong>
                <span className="hint" style={{ display: 'block' }}>Moderators can contact you for details.</span>
              </span>
            </button>
          </div>
          {!isAnonymous && (
            <div className="report-grid-2">
              <div className="field">
                <label className="label" htmlFor="report-name">Your name</label>
                <input id="report-name" className="input" autoComplete="name" value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
              </div>
              <div className="field">
                <label className="label" htmlFor="report-contact">Email or phone</label>
                <input id="report-contact" className="input" autoComplete="email" value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} />
              </div>
            </div>
          )}
          <ReportPreview
            title={title || `${category} problem at PIN ${pinCode}`}
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
          {nav(4, (
            <button type="button" className="btn btn-primary" onClick={handleFinalSubmit}>
              <Send size={16} aria-hidden="true" /> Submit report
            </button>
          ))}
        </div>
      )}

      {step === 6 && createdReport && (
        <div className="stack report-done">
          <span className="report-done-icon" aria-hidden="true"><CheckCircle2 size={36} /></span>
          <h2 className="report-step-title" style={{ justifyContent: 'center' }}>Report submitted</h2>
          <p className="muted">
            Reference <strong className="num" style={{ color: 'var(--ink)' }}>{createdReport.id}</strong>. A moderator checks every report before it is published.
          </p>
          {duplicateWarning && (
            <div className="callout callout-warn" style={{ textAlign: 'left' }}>
              <AlertTriangle size={16} aria-hidden="true" />
              <span>
                A similar report (<strong>{duplicateWarning.id}</strong>) already exists for PIN {pinCode}. Yours has been added to it as more evidence.
              </span>
            </div>
          )}
          <div className="cluster" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/reports/${createdReport.id}`)}>
              View your report
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/reports/${createdReport.id}/action`)}>
              File with CPGRAMS or the state portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
