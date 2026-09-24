import React, { useState, useMemo } from 'react';
import { getSpineDataForPincode } from '../data/nationwideSpine';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function SpineDashboard() {
  const { share } = useWhatsAppShare();
  const queryPin = new URLSearchParams(window.location.search).get('pin') || '250001';
  const [pinInput, setPinInput] = useState(queryPin);
  const [currentPin, setCurrentPin] = useState(queryPin);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'union' | 'state' | 'district' | 'block' | 'village'>('all');
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);

  // Resolve Location details
  const resolvedLoc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  // Load dynamic dataset based on the current active PIN code
  const { representatives, funds, projects, contractors } = useMemo(() => {
    return getSpineDataForPincode(currentPin);
  }, [currentPin]);

  // Filter representatives based on level
  const filteredReps = useMemo(() => {
    return representatives.filter(rep => {
      if (selectedLevel === 'all') return true;
      return rep.level === selectedLevel;
    });
  }, [representatives, selectedLevel]);

  // Handle active representative selection fallback
  const activeRep = useMemo(() => {
    const rep = representatives.find(r => r.id === selectedRepId);
    return rep || representatives[0];
  }, [representatives, selectedRepId]);

  // Find funds for the active representative
  const repFunds = useMemo(() => {
    if (!activeRep) return [];
    return funds.filter(f => f.representativeId === activeRep.id);
  }, [funds, activeRep]);

  // Find projects for each fund
  const getFundProjects = (fundId: string) => {
    return projects.filter(p => p.fundId === fundId);
  };

  // Find contractor for a project
  const getProjectContractor = (projectId: string) => {
    return contractors.find(c => c.projectId === projectId);
  };

  // Find other projects handled by the same contractor (Cross-referencing!)
  const getContractorCrossReferences = (contractorName: string, currentProjectId: string) => {
    const matchingContractors = contractors.filter(c => c.name === contractorName && c.projectId !== currentProjectId);
    return matchingContractors.map(c => {
      const proj = projects.find(p => p.id === c.projectId);
      return proj ? { projId: proj.id, name: proj.workName } : null;
    }).filter(Boolean);
  };

  const handleShareWhatsApp = (repName: string, fund: any, proj: any, contractor: any) => {
    share({
      pinCode: currentPin,
      titleHindi: proj.workNameHi,
      titleEnglish: proj.workName,
      claimLabel: `₹${proj.sanctionedCostLakhs} Lakhs Allocated`,
      claimLabelHindi: `₹${proj.sanctionedCostLakhs} लाख स्वीकृत`,
      realityLabel: proj.statusHi,
      realityLabelHindi: proj.realityTextHi || proj.statusHi,
      responsiblePerson: repName,
      responsibleOrg: fund.schemeNameHi,
      sourceUrl: 'https://egramswaraj.gov.in',
      moduleNameHindi: `Project 777 (जवाबदेही पिन: ${currentPin})`,
    });
  };

  const handlePinSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 6 && /^\d+$/.test(pinInput)) {
      setCurrentPin(pinInput);
      setSelectedRepId(null);
    } else {
      alert('कृपया एक सही ६-अंकीय भारतीय पिन कोड दर्ज करें। (Please enter a valid 6-digit Indian PIN code.)');
    }
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      
      {/* Nationwide PIN Search Form */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
          अखिल भारतीय ५-स्तरीय जवाबदेही खोज (Nationwide 5-Level Spine Search)
        </h3>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>
          भारत के किसी भी कोने का ६-अंकीय पिन कोड दर्ज करें। यह प्रणाली उस स्थान के सांसद (MP), विधायक (MLA), जिला परिषद, ब्लॉक पंचायत और ग्राम पंचायत के कोष, कार्यों और ठेकेदारों की श्रृंखला को प्रदर्शित करेगी।
        </p>
        <form onSubmit={handlePinSearch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            maxLength={6}
            placeholder="पिन कोड दर्ज करें (उदा. 560001, 400001, 250001)..."
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'inherit',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.65rem 1.5rem',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            खोजें (Search)
          </button>
        </form>
        {resolvedLoc.isValid && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--status-completed-bg)', color: 'var(--status-completed)', fontWeight: 700 }}>
              Resolved: {resolvedLoc.state} · {resolvedLoc.district} ({resolvedLoc.region} India)
            </span>
            {currentPin.startsWith('250') && (
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--status-construction-bg)', color: 'var(--status-construction)', fontWeight: 700 }}>
                Verified Local Dataset (Meerut Ground Turf)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Level Selection Tabs */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', opacity: 0.8 }}>
          ५-स्तरीय जवाबदेही श्रृंखला (Select Level of Governance)
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(['all', 'union', 'state', 'district', 'block', 'village'] as const).map(level => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedRepId(null);
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedLevel === level ? 'var(--color-primary)' : 'var(--border-color)',
                background: selectedLevel === level ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                color: selectedLevel === level ? 'white' : 'inherit',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {level === 'all' && 'सभी स्तर (All)'}
              {level === 'union' && 'सांसद (MP)'}
              {level === 'state' && 'विधायक (MLA)'}
              {level === 'district' && 'जिला परिषद (Zilla Parishad)'}
              {level === 'block' && 'ब्लॉक समिति (Block Samiti)'}
              {level === 'village' && 'ग्राम पंचायत (Gram Panchayat)'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Representatives List (Left) & Selection Detail (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Representative Selection */}
        <div className="glass-card" style={{ padding: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Representatives ({filteredReps.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {filteredReps.map(rep => (
              <div
                key={rep.id}
                onClick={() => setSelectedRepId(rep.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: (selectedRepId === rep.id || (!selectedRepId && representatives[0].id === rep.id)) ? 'var(--color-primary)' : 'var(--border-color)',
                  background: (selectedRepId === rep.id || (!selectedRepId && representatives[0].id === rep.id)) ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rep.nameHi}</span>
                  <span style={{
                    fontSize: '0.6rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: rep.party === 'BJP' ? '#FF993333' : '#0066CC33',
                    color: rep.party === 'BJP' ? '#FF9933' : '#0066CC',
                    fontWeight: 700,
                  }}>
                    {rep.party}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.25rem' }}>
                  {rep.constituencyName} · level: {rep.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Chain Details (Fund → Project → Contractor → Reality) */}
        {activeRep && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            
            {/* Representative Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                REPRESENTATIVE PROFILE · {activeRep.level.toUpperCase()} LEVEL
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: '0.25rem 0' }}>{activeRep.nameHi} ({activeRep.name})</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                Jurisdiction: <strong>{activeRep.constituencyNameHi}</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {activeRep.pinCodes.map(pin => (
                  <span key={pin} style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-color)',
                  }}>
                    PIN {pin}
                  </span>
                ))}
              </div>
            </div>

            {/* Funds & Projects Chain */}
            {repFunds.map(fund => {
              const fundProjects = getFundProjects(fund.id);
              return (
                <div key={fund.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--good)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, color: 'var(--good)', textTransform: 'uppercase' }}>
                        Sanctioned Fund
                      </div>
                      <h3 style={{ fontSize: '1.05rem', margin: '0.1rem 0' }}>{fund.schemeNameHi}</h3>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{fund.schemeName} · FY: {fund.financialYear}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--good)' }}>
                        ₹{fund.amountSanctionedCr} Cr
                      </div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>Sanctioned Limit</div>
                    </div>
                  </div>

                  {/* Projects List under this Fund */}
                  <h4 style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Projects Sanctioned ({fundProjects.length})
                  </h4>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {fundProjects.map(proj => {
                      const contractor = getProjectContractor(proj.id);
                      const crossRefs = contractor ? getContractorCrossReferences(contractor.name, proj.id) : [];

                      return (
                        <div key={proj.id} style={{
                          padding: '1rem',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-color)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', margin: 0 }}>{proj.workNameHi}</h5>
                              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.1rem' }}>{proj.workName}</div>
                            </div>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              background: proj.status === 'completed' ? 'var(--status-completed-bg)' : proj.status === 'stalled' ? 'var(--status-critical-bg)' : 'var(--status-construction-bg)',
                              color: proj.status === 'completed' ? 'var(--status-completed)' : proj.status === 'stalled' ? 'var(--status-critical)' : 'var(--status-construction)',
                              fontWeight: 700,
                            }}>
                              {proj.statusHi}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                            
                            {/* Claim vs Reality Split */}
                            <div style={{ background: 'rgba(59, 130, 246, 0.04)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid var(--brand-ink)' }}>
                              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--brand-ink)', textTransform: 'uppercase' }}>
                                Govt Claim
                              </div>
                              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                Budget: <strong>₹{proj.sanctionedCostLakhs} Lakhs</strong>
                              </div>
                            </div>

                            <div style={{ background: 'rgba(239, 68, 68, 0.04)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid var(--bad)' }}>
                              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--bad)', textTransform: 'uppercase' }}>
                                Reality (जमीनी हकीकत)
                              </div>
                              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#fca5a5' }}>
                                {proj.realityTextHi || 'No reports logged.'}
                              </div>
                            </div>

                          </div>

                          {/* Contractor info with Cross references */}
                          {contractor && (
                            <div style={{
                              marginTop: '0.75rem',
                              paddingTop: '0.75rem',
                              borderTop: '1px dashed rgba(255,255,255,0.06)',
                              fontSize: '0.72rem',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                  Contractor: <strong>{contractor.nameHi}</strong>
                                  <br />
                                  <span style={{ opacity: 0.5 }}>{contractor.registrationNumber} · Past Projects: {contractor.pastProjectsCount}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  Payment Status: <strong style={{ color: contractor.paymentStatus === 'paid' ? 'var(--good)' : 'var(--warn)' }}>{contractor.paymentStatus.toUpperCase()}</strong>
                                </div>
                              </div>

                              {/* CROSS REFERENCING COMPONENT */}
                              {crossRefs.length > 0 && (
                                <div style={{
                                  marginTop: '0.5rem',
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '6px',
                                  background: 'rgba(245, 158, 11, 0.05)',
                                  borderLeft: '3px solid var(--warn)',
                                }}>
                                  <span style={{ fontWeight: 600, color: 'var(--warn)' }}>Cross-Panchayat Contractor Alert:</span>
                                  <div style={{ opacity: 0.8, fontSize: '0.68rem', marginTop: '0.15rem' }}>
                                    This contractor is also awarded projects elsewhere:
                                    <ul style={{ paddingLeft: '1rem', marginTop: '0.1rem' }}>
                                      {crossRefs.map((ref: any, idx: number) => (
                                        <li key={idx}>{ref.name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action Bar */}
                          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleShareWhatsApp(activeRep.nameHi, fund, proj, contractor)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#25d366',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                              }}
                            >
                              Share Chain on WhatsApp
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}
