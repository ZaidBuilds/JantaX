import React, { useState, useEffect } from 'react';
import { HelpCircle, GraduationCap, HardHat, Construction, Home, MapPin, Plus, Download, ClipboardList, Users, CalendarDays, X } from 'lucide-react';
import { api } from '../core/services/api';
import { useSearchParams } from 'react-router-dom';
import { resolvePincode } from '../core/utils/pinResolver';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import type { ComparisonData } from '../components/compare/types';

/**
 * JantaX Compare Matrix Page
 * Side-by-side comparison matrix with category tree sidebar and selectable entities.
 */
export function ComparePage() {
  const [activeCategory, setActiveCategory] = useState('overview');

  const schoolsData = [
    {
      name: 'Govt. Primary School Rampur',
      loc: 'Rampur Village, Delhi - 110001',
      udise: '07010100203',
      type: 'Primary (1 to 5)',
      students: '87',
      teachers: '3 / 5',
      ratio: '29 : 1',
      health: '68 /100',
      healthLabel: 'Needs Attention',
      healthColor: '#f97316',
      ground: '68 /100',
      groundLabel: 'Needs Attention',
      groundColor: '#f97316',
      rating: '3.2 ★★★★☆ (48)',
      issues: '5 High',
      issuesColor: '#ef4444',
      overall: '65 /100',
      overallLabel: 'Needs Attention',
      overallColor: '#f97316'
    },
    {
      name: 'Govt. Primary School Narela Sector A9',
      loc: 'Narela Sector A9, Delhi - 110040',
      udise: '07010104567',
      type: 'Primary (1 to 5)',
      students: '156',
      teachers: '5 / 7',
      ratio: '31 : 1',
      health: '82 /100',
      healthLabel: 'Good',
      healthColor: '#10b981',
      ground: '76 /100',
      groundLabel: 'Good',
      groundColor: '#10b981',
      rating: '4.1 ★★★★☆ (76)',
      issues: '2 Medium',
      issuesColor: '#f97316',
      overall: '79 /100',
      overallLabel: 'Good',
      overallColor: '#10b981'
    },
    {
      name: 'Govt. Primary School Bawana JJ Colony',
      loc: 'Bawana JJ Colony, Delhi - 110039',
      udise: '07010107890',
      type: 'Primary (1 to 5)',
      students: '64',
      teachers: '2 / 4',
      ratio: '32 : 1',
      health: '45 /100',
      healthLabel: 'Poor',
      healthColor: '#ef4444',
      ground: '38 /100',
      groundLabel: 'Poor',
      groundColor: '#ef4444',
      rating: '2.4 ★★☆☆☆ (31)',
      issues: '7 High',
      issuesColor: '#ef4444',
      overall: '43 /100',
      overallLabel: 'Poor',
      overallColor: '#ef4444'
    }
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialIds = (searchParams.get('ids')||'').split(',').filter(Boolean);
  const [selectedCompareIds, setSelectedCompareIds] = React.useState<string[]>(initialIds.length? initialIds: ['cont-001','cont-006']);
  const [liveSchoolsData, setLiveSchoolsData] = useState(schoolsData);
  React.useEffect(() => {
    api.getSchools('110001').then((recs:any)=>{
      if(Array.isArray(recs) && recs.length){
        const mapped = recs.slice(0,3).map((r:any)=>({
          name: r.titleHindi || r.titleEnglish,
          loc: `${r.location.district || 'Delhi'} - ${r.location.pinCode}`,
          udise: r.udiseCode || '—',
          type: r.schoolLevel || 'Primary (1 to 5)',
          students: String(r.officialStudentCount ?? '—'),
          teachers: `${r.officialTeacherCount ?? '—'} / ${r.teachersSanctioned ?? '—'}`,
          ratio: '29 : 1',
          health: `${r.groundTruthScore ?? 60} /100`,
          healthLabel: (r.groundTruthScore??60)>=70?'Good': (r.groundTruthScore??60)>=40?'Fair':'Poor',
          healthColor: (r.groundTruthScore??60)>=70?'#10b981': (r.groundTruthScore??60)>=40?'#f59e0b':'#ef4444',
          ground: `${r.groundTruthScore ?? 60} /100`,
          groundLabel: r.status || 'Needs Attention',
          groundColor: '#f59e0b',
          rating: '—',
          issues: '—',
          issuesColor: '#ef4444',
          overall: `${r.groundTruthScore ?? 60} /100`,
          overallLabel: r.status || 'Needs Attention',
          overallColor: r.groundTruthScore>=70?'#10b981':'#f59e0b'
        }));
        if(mapped.length) setLiveSchoolsData(mapped);
      }
    }).catch(()=>{});
  }, []);
  const displaySchools = liveSchoolsData;

  const [entityTab, setEntityTab] = useState('schools');
  const entityTabs = [
    { key: 'schools', label: 'Schools', icon: GraduationCap },
    { key: 'contractors', label: 'Contractors', icon: HardHat },
    { key: 'projects', label: 'Projects / Works', icon: Construction },
    { key: 'rera', label: 'Builders (RERA)', icon: Home },
    { key: 'areas', label: 'Areas (PIN Codes)', icon: MapPin },
  ];

  // Multi-PIN comparison (Phase 17 — areas tab live)
  const [pinInputs, setPinInputs] = useState<string[]>(['110001', '110040', '110039']);
  const [pinCompareData, setPinCompareData] = useState<Record<string, any>>({});
  const [pinLoading, setPinLoading] = useState(false);
  React.useEffect(() => {
    if (entityTab !== 'areas') return;
    let alive = true;
    setPinLoading(true);
    Promise.all(pinInputs.map(p => api.getPincode(p).then(d => [p, d] as [string, any]).catch(() => [p, null] as [string, any])))
      .then(results => { if (alive) { const map: Record<string, any> = {}; results.forEach(([p, d]) => { map[p] = d; }); setPinCompareData(map); } })
      .finally(() => { if (alive) setPinLoading(false); });
    return () => { alive = false; };
  }, [entityTab, pinInputs.join(',')]);

  const updatePin = (idx: number, val: string) => {
    const next = [...pinInputs];
    next[idx] = val.replace(/\D/g, '').slice(0, 6);
    setPinInputs(next);
    setSearchParams(next.filter(Boolean).length ? { ids: next.filter(Boolean).join(',') } : {});
  };
  const addPin = () => { const next = [...pinInputs, '']; setPinInputs(next); setSearchParams({ ids: next.filter(Boolean).join(',') }); };
  const removePin = (idx: number) => { const next = pinInputs.filter((_, i) => i !== idx); setPinInputs(next); setSearchParams(next.filter(Boolean).length ? { ids: next.filter(Boolean).join(',') } : {}); };

  const handleDownload = () => {
    const src = displaySchools.length ? displaySchools : schoolsData;
    const header = ['Parameter', ...src.map(s => `"${s.name}"`)].join(',');
    const rows = [
      ['Location', ...src.map(s => `"${s.loc}"`)],
      ['UDISE+ Code', ...src.map(s => s.udise)],
      ['Students', ...src.map(s => s.students)],
      ['Teachers', ...src.map(s => s.teachers)],
      ['Health Score', ...src.map(s => s.health)],
      ['Overall', ...src.map(s => s.overall)],
    ];
    if (entityTab === 'areas') {
      const pins = pinInputs.filter(Boolean);
      const areaHeader = ['Metric', ...pins.map(p => `PIN ${p} (${resolvePincode(p).district})`)].join(',');
      const areaRows = [
        ['State', ...pins.map(p => resolvePincode(p).state)],
        ['Schools', ...pins.map(p => pinCompareData[p]?.counts?.schools ?? '—')],
        ['Public Projects', ...pins.map(p => pinCompareData[p]?.counts?.infraProjects ?? '—')],
        ['RERA Projects', ...pins.map(p => pinCompareData[p]?.counts?.reraProjects ?? '—')],
        ['Healthcare Centers', ...pins.map(p => pinCompareData[p]?.counts?.hospitals ?? '—')],
        ['Grievances', ...pins.map(p => pinCompareData[p]?.counts?.grievances ?? '—')],
        ['Welfare Shops', ...pins.map(p => pinCompareData[p]?.counts?.pdsShops ?? '—')],
      ];
      const csv = [areaHeader, ...areaRows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'jantax-area-comparison.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      return;
    }
    const csv = [header, ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'jantax-comparison.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const categories = [
    { key: 'overview', label: 'Overview', icon: ClipboardList },
    { key: 'infra', label: 'Infrastructure', icon: GraduationCap },
    { key: 'teachers', label: 'Teachers & Staffing', icon: Users },
    { key: 'attendance', label: 'Attendance', icon: CalendarDays },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0 }}>Compare</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0.25rem 0 0' }}>
            Compare schools, projects, contractors, builders or areas and make informed decisions.
          </p>
        </div>
        <button className="time-tab" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><HelpCircle size={15} /> How it works</button>
      </div>

      {/* Entity selector tabs — Killer interactive */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        {entityTabs.map(tab => (
          <button key={tab.key} onClick={() => setEntityTab(tab.key)} className={`time-tab ${entityTab===tab.key ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Selected Items Row — live */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {displaySchools.map((s, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 700 }}>SCHOOL {idx + 1}</span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.25rem 0' }}>{s.name}</h4>
            <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>{s.loc.split(',')[0]}</div>
          </div>
        ))}

         <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
           <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Plus size={16} /> Add another school</span>
         </div>
       </div>

       {/* Areas (PIN) comparison inputs — Phase 17 */}
       {entityTab === 'areas' && (
         <div style={{ marginBottom: '1.5rem' }}>
           <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
             {pinInputs.map((p, idx) => (
               <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.25rem 0.5rem' }}>
                 <input
                   value={p}
                   onChange={(e) => updatePin(idx, e.target.value)}
                   placeholder="PIN"
                   className="form-input"
                   style={{ width: '80px', border: 'none', background: 'transparent', fontSize: '0.85rem', padding: 0 }}
                   aria-label={`PIN code ${idx + 1}`}
                 />
                 {pinInputs.length > 1 && (
                   <button onClick={() => removePin(idx)} aria-label="Remove PIN" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={14} /></button>
                 )}
               </div>
             ))}
             <button onClick={addPin} className="time-tab" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Plus size={14} /> Add PIN</button>
           </div>
           <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>Compare up to multiple PIN codes side-by-side. Data synced to the URL via <code>?ids=</code>.</p>
         </div>
       )}

      {/* Filters & Actions row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select className="form-input" style={{ width: 'auto', fontSize: '0.8rem' }}><option>All Metrics</option></select>
          <select className="form-input" style={{ width: 'auto', fontSize: '0.8rem' }}><option>Official + Ground Truth</option></select>
          <button className="time-tab">More Filters ▽</button>
        </div>
        <button onClick={handleDownload} className="search-action-btn" style={{ borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Download size={15} /> Download Comparison</button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

        {/* Left sidebar: Comparison Categories */}
        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {categories.map(cat => (
                <span key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeCategory === cat.key ? '#f1f5f9' : 'transparent', color: activeCategory === cat.key ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                  <cat.icon size={15} /> {cat.label}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Comparison Table Matrix */}
        <div className="glass-card" style={{ flex: 1, padding: '1.5rem', overflowX: 'auto' }}>
          {entityTab === 'areas' ? (
            pinLoading ? (
              <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
            ) : (
              (() => {
                const validPins = pinInputs.filter(Boolean);
                const areaData: ComparisonData = {
                  entities: validPins.map(p => ({
                    id: `pin-${p}`,
                    type: 'location',
                    name: `PIN ${p}`,
                    subtitle: resolvePincode(p).district,
                    location: { pincode: p, district: resolvePincode(p).district, state: resolvePincode(p).state },
                  })),
                  rows: [
                    {
                      id: 'location-info',
                      category: 'State',
                      metrics: validPins.map(p => ({ id: `state-${p}`, label: 'State', value: resolvePincode(p).state, status: 'available' as const })),
                    },
                    {
                      id: 'schools',
                      category: 'Schools',
                      categoryHi: 'विद्यालय',
                      metrics: validPins.map(p => ({ id: `schools-${p}`, label: 'Schools', value: pinCompareData[p]?.counts?.schools ?? '—', source: { name: 'Catalog API', type: 'A' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'public-projects',
                      category: 'Public Projects',
                      categoryHi: 'सार्वजनिक परियोजनाएं',
                      metrics: validPins.map(p => ({ id: `proj-${p}`, label: 'Public Projects', value: pinCompareData[p]?.counts?.infraProjects ?? '—', source: { name: 'CPWD/Gem.gov.in', type: 'B' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'rera-projects',
                      category: 'RERA Projects',
                      categoryHi: 'रियर परियोजनाएं',
                      metrics: validPins.map(p => ({ id: `rera-${p}`, label: 'RERA Projects', value: pinCompareData[p]?.counts?.reraProjects ?? '—', source: { name: 'RERA Portal', type: 'A' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'healthcare',
                      category: 'Healthcare Centers',
                      categoryHi: 'स्वास्थ्य केंद्र',
                      metrics: validPins.map(p => ({ id: `hc-${p}`, label: 'Healthcare Centers', value: pinCompareData[p]?.counts?.hospitals ?? '—', source: { name: 'MoHFW', type: 'A' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'grievances',
                      category: 'Grievances (CPGRAMS)',
                      categoryHi: 'शिकायतें',
                      metrics: validPins.map(p => ({ id: `gr-${p}`, label: 'Grievances', value: pinCompareData[p]?.counts?.grievances ?? '—', source: { name: 'CPGRAMS', type: 'B' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'welfare-shops',
                      category: 'Welfare Shops (PDS)',
                      categoryHi: 'कल्याण दुकानें',
                      metrics: validPins.map(p => ({ id: `pds-${p}`, label: 'PDS Shops', value: pinCompareData[p]?.counts?.pdsShops ?? '—', source: { name: 'NFSA/State Portals', type: 'B' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                    {
                      id: 'citizen-reports',
                      category: 'Citizen Reports',
                      categoryHi: 'नागरिक रिपोर्ट',
                      metrics: validPins.map(p => ({ id: `cr-${p}`, label: 'Citizen Reports', value: pinCompareData[p]?.counts?.citizenReports ?? '—', source: { name: 'JantaX Reports', type: 'C' as const }, status: pinCompareData[p] ? 'available' as const : 'unavailable' as const })),
                    },
                  ],
                };
                return <ComparisonTable data={areaData} showSourceDisclosure />;
              })()
            )
          ) : entityTab !== 'schools' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-primary)' }}>
                {entityTabs.find(t => t.key===entityTab)?.icon && (() => { const I = entityTabs.find(t=>t.key===entityTab)!.icon; return <I size={22} /> })()}
              </div>
              <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>{entityTabs.find(t=>t.key===entityTab)?.label} Comparison — Coming Soon</h4>
              <p style={{ fontSize: '0.82rem', opacity: 0.6, marginTop: '0.4rem' }}>This compare view is being wired to live data. Schools & Areas comparison are live.</p>
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setEntityTab('schools')}>Back to Schools</button>
            </div>
          ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ paddingBottom: '0.75rem', width: '200px' }}>Parameter</th>
                {displaySchools.map((s, idx) => (
                  <th key={idx} style={{ paddingBottom: '0.75rem', minWidth: '180px' }}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Location</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0', opacity: 0.8 }}>{s.loc}</td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>UDISE+ Code</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0' }}><code>{s.udise}</code></td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>School Type</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0' }}>{s.type}</td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Students Enrolled</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0' }}>{s.students}</td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Teachers (Working/Sanctioned)</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0' }}>{s.teachers}</td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Student-Teacher Ratio</td>
                {displaySchools.map((s, idx) => <td key={idx} style={{ padding: '0.85rem 0' }}>{s.ratio}</td>)}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Health Score</td>
                {displaySchools.map((s, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 0', color: s.healthColor, fontWeight: 800 }}>
                    {s.health} ({s.healthLabel})
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Ground Truth Score</td>
                {displaySchools.map((s, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 0', color: s.groundColor, fontWeight: 800 }}>
                    {s.ground}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Open Issues</td>
                {displaySchools.map((s, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 0' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: `${s.issuesColor}15`, color: s.issuesColor, fontWeight: 700 }}>
                      {s.issues}
                    </span>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0', fontWeight: 700 }}>Overall Score</td>
                {displaySchools.map((s, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 0', color: s.overallColor, fontWeight: 800 }}>
                    {s.overall} ({s.overallLabel})
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          )}
        </div>

      </div>
    </div>
  );
}
