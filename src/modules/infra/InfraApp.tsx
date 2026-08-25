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
  const [activeSpineView, setActiveSpineView] = useState<'spine' | 'national'>('spine');
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Module controls */}
      <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button
              onClick={() => setShowGateway(!showGateway)}
              style={{
                padding: '0.35rem 0.75rem',
                background: showGateway ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${showGateway ? 'var(--color-primary)' : 'var(--border-color)'}`,
                borderRadius: '6px',
                color: showGateway ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Open MoSPI / PAIMANA Data Gateway Interface"
            >
              📡 Data Gateway
          </button>
          <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset the database? This will clear all submitted reports.")) {
                  resetDB();
                  setCurrentView('dashboard');
                  setSelectedProjectId(null);
                  setSelectedState('');
                }
              }}
              style={{
                padding: '0.35rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--status-critical)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              title="Reset to default mock database"
            >
              Reset Database
          </button>
          <span 
              style={{ 
                fontSize: '0.75rem', 
                color: 'var(--status-completed)', 
                background: 'var(--status-completed-bg)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              ● LIVE
        </span>
      </div>

      {/* MoSPI Data Gateway Drawer */}
      {showGateway && (
        <div className="container animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.35rem' }}>📡</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Government Data Gateway (MoSPI Interface)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Reference Link: <a href="https://ipm.mospi.gov.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>ipm.mospi.gov.in</a> (PAIMANA System)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowGateway(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '1.5rem',
              alignItems: 'start'
            }} className="gateway-split">
              <style>{`
                @media (min-width: 768px) {
                  .gateway-split { grid-template-columns: 1fr 1fr !important; }
                }
              `}</style>

              {/* Left Column: Live Sync Simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>MoSPI API Sync Gateway</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>📡 <strong>Gateway Status:</strong> <span style={{ color: 'var(--status-completed)', fontWeight: 700 }}>🟢 CONNECTED</span></div>
                  <div>🔌 <strong>Mock Endpoint:</strong> <code style={{ background: 'rgba(15,23,42,0.04)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>api.mospi.gov.in/paimana/v2</code></div>
                  <div>⏳ <strong>Latency:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>12ms (Simulated)</span></div>
                  <div>📅 <strong>Last Synced:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{syncTime}</span></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    style={{
                      padding: '0.6rem',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 600,
                      cursor: isSyncing ? 'not-allowed' : 'pointer',
                      opacity: isSyncing ? 0.7 : 1,
                      transition: 'all 0.2s',
                      fontSize: '0.85rem'
                    }}
                  >
                    {isSyncing ? "Syncing with Gateway..." : "Sync Live Gateway Data"}
                  </button>

                  {syncMessage && (
                    <div style={{ 
                      padding: '0.65rem', 
                      background: 'rgba(37,99,235,0.06)', 
                      border: '1px solid rgba(37,99,235,0.15)', 
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: 'var(--color-primary)',
                      lineHeight: '1.4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span className="pulse-dot construction" style={{ width: 6, height: 6 }}></span>
                      {syncMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Custom JSON Importer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Custom JSON Dataset Importer</h4>
                  <button 
                    onClick={loadTemplate}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    📂 Load Template
                  </button>
                </div>

                <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <textarea
                    placeholder='Paste custom project array JSON here...'
                    className="form-input"
                    style={{ minHeight: '90px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.75rem', background: '#ffffff', color: 'var(--text-primary)' }}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />

                  {importStatus.type && (
                    <div style={{ 
                      padding: '0.5rem', 
                      background: importStatus.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,0.08)',
                      border: `1px solid ${importStatus.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: importStatus.type === 'success' ? 'var(--status-completed)' : 'var(--status-critical)'
                    }}>
                      {importStatus.type === 'success' ? '✓ ' : '⚠️ '}{importStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem',
                      background: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Import Custom Dataset
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Selector Tabs */}
      <div className="container" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1.25rem' }}>
          <button
            onClick={() => setActiveSpineView('spine')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSpineView === 'spine' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: activeSpineView === 'spine' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>🔥 Project 777:</span> ५-स्तरीय मेरठ जवाबदेही (Meerut 5-Level Spine)
          </button>
          <button
            onClick={() => setActiveSpineView('national')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSpineView === 'national' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: activeSpineView === 'national' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>🏗️</span> राष्ट्रीय अवसंरचना (National Infrastructure Projects)
          </button>
        </div>
      </div>

      {/* Main Core Views Container */}
      <main className="container" style={{ flex: 1 }}>
        {activeSpineView === 'spine' ? (
          <SpineDashboard />
        ) : currentView === 'dashboard' ? (
          <>
            {activePin && (
              <div className="glass-card" style={{ padding: '0.85rem 1.1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  📍 PIN {activePin} · {resolvedPin?.district}, {resolvedPin?.state}
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
      </main>

      {/* Modern footer details */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>Bharat Vikas Project Tracker • Developed for Citizens of India</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.1)' }}>Official parameters sourced abstractly from central reporting systems.</p>
      </footer>
    </div>
  );
}


