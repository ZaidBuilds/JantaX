import { useState } from 'react';
import { useLocalDB } from '../../core/hooks/useLocalDB';
import { Dashboard } from './components/Dashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { SpineDashboard } from './components/SpineDashboard';
import { useSearchParams } from 'react-router-dom';
import { SourceBadge } from '../../components/UI/SourceBadge';
import { resolvePincode } from '../../core/utils/pinResolver';

export function InfraApp() {
  const { projects, addCitizenReport, upvoteReport, resetDB, importProjects } = useLocalDB();
  const [searchParams] = useSearchParams();
  const activePin = searchParams.get('pin') || '';
  const resolvedPin = activePin ? resolvePincode(activePin) : null;
   
  // Navigation states
  const [activeSpineView, setActiveSpineView] = useState<'spine' | 'national'>('national');
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
   
  // Selected State filter (shared between Map and Dashboard filters)
  const [selectedState, setSelectedState] = useState<string>(resolvedPin?.state && resolvedPin.state !== 'Unknown' ? resolvedPin.state : '');

  // Data Gateway States
  const [showGateway, setShowGateway] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState<string>('2026-08-24 16:49 (Cached)');
  const [syncMessage, setSyncMessage] = useState('');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Handle simulated secure sync from MoSPI gateway
  const handleSync = () => {
    setIsSyncing(true);
    setSyncMessage("Initializing secure tunnel to MoSPI servers...");
    
    setTimeout(() => {
      setSyncMessage("Connected. Fetching flash reports for central sector projects (₹150Cr+)...");
    }, 450);

    setTimeout(() => {
      setSyncMessage("Verifying milestone checklists and clearances status...");
    }, 900);

    setTimeout(() => {
      resetDB();
      setSyncTime(new Date().toLocaleTimeString() + " (Live Sync)");
      setSyncMessage("Done! Synced 15 active projects. Dashboard updated.");
      setIsSyncing(false);
    }, 1500);
  };

  // Handle parsing and importing custom project array JSON
  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) {
      setImportStatus({ type: 'error', message: 'Import textarea is empty!' });
      return;
    }
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        setImportStatus({ type: 'error', message: 'Root JSON must be an array of projects.' });
        return;
      }
      if (parsed.length > 0 && (!parsed[0].id || !parsed[0].nameEnglish || !parsed[0].sector || !parsed[0].pinCode)) {
        setImportStatus({ type: 'error', message: 'Invalid project structure. Must contain id, nameEnglish, sector, and pinCode.' });
        return;
      }
      importProjects(parsed);
      setImportStatus({ type: 'success', message: `Successfully imported ${parsed.length} projects.` });
      setImportText('');
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Syntax Error: ${err.message}` });
    }
  };

  // Load sample template JSON
  const loadTemplate = () => {
    const template = [
      {
        "id": "custom-001",
        "pinCode": "201301",
        "nameEnglish": "Noida Sector 62 to Sahibabad Metro Extension Link",
        "nameHindi": "नोएडा सेक्टर 62 से साहिबाबाद मेट्रो विस्तार लिंक",
        "nameRegional": "नोएडा सेक्टर ६२ ते साहिबाबाद मेट्रो विस्तार लिंक",
        "sector": "Urban",
        "ministry": "Ministry of Housing and Urban Affairs",
        "implementingAgency": "DMRC (Delhi Metro Rail Corporation)",
        "state": "Uttar Pradesh",
        "district": "Gautam Buddha Nagar",
        "leadContractor": "DMRC Contract JV",
        "responsibleOfficer": "Shri Vikas Kumar",
        "responsibleOfficerDesignation": "Managing Director, DMRC",
        "status": "Construction",
        "statusHindi": "निर्माण कार्य चालू है",
        "statusRegional": "काम सुरू आहे",
        "budgetOriginal": 1517,
        "budgetAnticipated": 1517,
        "expenditureToDate": 450,
        "startDate": "2024-03-01",
        "originalCompletionDate": "2027-12-31",
        "anticipatedCompletionDate": "2027-12-31",
        "progressPhysical": 35,
        "progressFinancial": 30,
        "clearances": {
          "landAcquisition": 95,
          "forestClearance": "N/A",
          "environmentalClearance": "Approved",
          "utilityShifting": "In Progress"
        },
        "delayReasons": [],
        "delaySummary": "Pillar installation is progressing rapidly along the main highway link corridor.",
        "delaySummaryHindi": "मुख्य हाईवे कॉरिडोर के साथ पिलर लगाने का काम तेजी से चल रहा है।",
        "citizenReports": []
      }
    ];
    setImportText(JSON.stringify(template, null, 2));
    setImportStatus({ type: null, message: '' });
  };

  // Handle selecting a project to open detail view
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active project for detail view
  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <div className="segmented" role="tablist" aria-label="Public works views">
        <button type="button" role="tab" aria-selected={activeSpineView === 'national'} aria-pressed={activeSpineView === 'national'} onClick={() => setActiveSpineView('national')}>
          Projects and progress
        </button>
        <button type="button" role="tab" aria-selected={activeSpineView === 'spine'} aria-pressed={activeSpineView === 'spine'} onClick={() => setActiveSpineView('spine')}>
          Who is accountable, MP to gram panchayat
        </button>
      </div>

      <div>
        {activeSpineView === 'spine' ? (
          <SpineDashboard />
        ) : currentView === 'dashboard' ? (
          <>
            {activePin && (
              <div className="glass-card" style={{ padding: '0.85rem 1.1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  PIN {activePin} · {resolvedPin?.district}, {resolvedPin?.state}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <SourceBadge sourceType="A" sourceName="MoSPI PAIMANA" />
                  <SourceBadge sourceType="A" sourceName="eGramSwaraj" />
                </div>
              </div>
            )}
            <Dashboard
              projects={projects}
              onSelectProject={handleSelectProject}
              selectedState={selectedState}
              onSelectState={setSelectedState}
              pinContext={activePin}
            />
          </>
        ) : (
          activeProject && (
            <ProjectDetail
              project={activeProject}
              onBack={() => { setCurrentView('dashboard'); }}
              onAddReport={addCitizenReport}
              onUpvoteReport={upvoteReport}
            />
          )
        )}
      </div>
    </div>
  );
}


