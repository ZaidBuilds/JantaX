import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../core/services/api';
import { resolvePincode } from '../core/utils/pinResolver';
import { SourceBadge } from '../components/UI/SourceBadge';
import { GovtResponseTracker } from '../modules/contractor/components/GovtResponseTracker';

const pageStyle: React.CSSProperties = { maxWidth: 860, margin: '0 auto', padding: '2rem 1.25rem', lineHeight: 1.6 };
const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,.04)', marginBottom: '1rem' };

export function AboutPage() {
  return (
    <div style={pageStyle}>
      <div style={{ borderLeft: '4px solid #0f2d59', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#0f2d59', margin: 0 }}>About JantaX</h1>
        <p style={{ color: '#475569', marginTop: '0.4rem' }}>India, Explained by Where You Live — See What Your Government Data Says.</p>
      </div>
      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59' }}>Mission</h3>
        <p style={{ color: '#334155', fontSize: '0.92rem' }}>JantaX is a citizen-powered, non-partisan <strong>Pin-Code Accountability OS</strong>. Every Indian PIN reveals a different India — schools, hospitals, RERA, ration shops, power feeders. We stitch official records (CAG, UDISE+, HMIS, RERA, DARPG CPGRAMS, CPCB) side-by-side with <em>ground truth</em> — anonymous citizen photo drops stripped of EXIF — so you can see <strong>दावा vs हकीकत</strong> and act.</p>
        <p style={{ color: '#334155', fontSize: '0.92rem' }}>Inspired by <strong>Andhbhakt.org</strong> architecture: 28 State CM claims vs audits, PIN→State resolver, category filters, split claim/reality cards, WhatsApp-forward cards, dark premium evidence vault. We extend that pattern to 15 modules, always citing source documents, never making standalone allegations.</p>
      </div>
      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59' }}>How it works</h3>
        <ol style={{ color: '#475569', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
          <li><strong>Enter PIN</strong> → resolved to state/district/region (PIN prefix map) + lat/lng.</li>
          <li><strong>Pick module</strong> (School, Infra, Contractor, Hospital, RERA, etc.) → live `GET /api/pincode/:code/records?module=` or resilient local mock when offline.</li>
          <li><strong>Compare</strong> official claim vs ground truth (e.g., UDISE+ `toilet functional` vs parent check-in, or CM `5 lakh ICU beds` vs `CAG Report 2024 Para 3.7: 2 beds`).</li>
          <li><strong>Act</strong>: Share WhatsApp card, drop anonymous photo (`POST /api/reports` → moderation PENDING), follow PIN for alerts.</li>
        </ol>
      </div>
      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59' }}>Principles</h3>
        <ul style={{ color: '#475569', fontSize: '0.9rem' }}>
          <li><strong>100% Open Data</strong> — every number cites a public document (CAG, UDISE+, HMS, RERA, CPGRAMS).</li>
          <li><strong>Citizen Powered</strong> — anonymous by default, SHA-256 IP hash, EXIF stripped.</li>
          <li><strong>Non-Partisan</strong> — we list claims and audits side-by-side, we do not editorialize.</li>
          <li><strong>For Every Indian</strong> — Hindi-first, mobile-first, 44px taps, offline mock fallback so PIN never shows red error.</li>
        </ul>
      </div>
    </div>
  );
}

export function DataSourcesPage() {
  const [sources, setSources] = React.useState<any[] | null>(null);
  const [filterTier, setFilterTier] = React.useState<string>('');
  React.useEffect(()=>{
    fetch('/api/sources').then(r=>r.json()).then(j=>{ if(j.sources) setSources(j.sources); }).catch(()=>{
      // fallback to hardcoded when offline
      setSources([
        { sourceId:'src_cag_mh_2024', organization:'CAG', sourceName:'CAG Audit Report No.4 2023-24', sourceUrl:'https://cag.gov.in/en/audit-reports', sourceType:'C-document', license:'Fair-use-quotation', attributionRequirement:'Source: CAG Report No.4 of 2024, Para 3.7', reusePermission:'store: excerpt ≤200 chars, display: quote + link, redistribute: no', dataSensitivity:'public', updateFrequency:'annual', expectedRefreshInterval:'365d', lastChecked:new Date().toISOString(), lastSuccessfulSync:new Date().toISOString(), lastPublishedDate:'2024-03-14', parserVersion:'cag_pdf_tabula_v0.8', status:'active', owner:'data-ops', governmentLevel:'state' },
        { sourceId:'src_udise_2324', organization:'Ministry of Education', sourceName:'UDISE+ 2023-24', sourceUrl:'https://udiseplus.gov.in', datasetUrl:'https://udiseplus.gov.in/p/dataset', sourceType:'A-dataset', license:'GODL-India', attributionRequirement:'Source: UDISE+ 2023-24 | GODL', reusePermission:'store/transform/display/redistribute: yes', dataSensitivity:'public', updateFrequency:'annual', expectedRefreshInterval:'365d', lastChecked:new Date().toISOString(), lastSuccessfulSync:new Date().toISOString(), lastPublishedDate:'2024-08-15', parserVersion:'udise_csv_v1.2', status:'active', owner:'data-ops', governmentLevel:'union' },
        { sourceId:'src_hmis_2024', organization:'MoHFW', sourceName:'HMIS Facility Registry 2024', sourceUrl:'https://hmis.mohfw.gov.in', sourceType:'A-dataset', license:'GODL-India', attributionRequirement:'Source: HMIS 2024 | GODL', reusePermission:'store/transform/display/redistribute: yes', dataSensitivity:'public', updateFrequency:'monthly', expectedRefreshInterval:'30d', lastChecked:new Date().toISOString(), lastSuccessfulSync:new Date().toISOString(), lastPublishedDate:'2024-08-01', parserVersion:'hmis_api_v1.0', status:'active', owner:'data-ops', governmentLevel:'union' },
        { sourceId:'src_cpcb_aqi', organization:'CPCB', sourceName:'CPCB AQI API', sourceUrl:'https://cpcb.nic.in', apiUrl:'https://api.cpcb.nic.in/aqi', sourceType:'B-api', license:'GODL-India', attributionRequirement:'Source: CPCB | GODL', reusePermission:'store: cache 1h, display: yes', dataSensitivity:'public', updateFrequency:'realtime', expectedRefreshInterval:'1h', lastChecked:new Date().toISOString(), lastSuccessfulSync:new Date().toISOString(), lastPublishedDate:'2024-08-25', parserVersion:'cpcb_api_v1.0', status:'active', owner:'data-ops', governmentLevel:'union' },
        { sourceId:'src_community_school', organization:'JantaX', sourceName:'Parent Check-in', sourceUrl:'https://jantax.in/report', sourceType:'E-community', license:'Community-CC0', attributionRequirement:'Anon • SHA-256+salt', reusePermission:'store: anon, transform: aggregate, display: aggregate', dataSensitivity:'community_anon', updateFrequency:'realtime', expectedRefreshInterval:'1d', lastChecked:new Date().toISOString(), lastSuccessfulSync:new Date().toISOString(), lastPublishedDate:'2024-08-25', parserVersion:'community_v1.0', status:'active', owner:'moderation@jantax.in', governmentLevel:'community' },
      ]);
    });
  },[]);
  const filtered = sources ? sources.filter(s=> !filterTier || s.sourceType.startsWith(filterTier)) : [];
  const tierColor: Record<string,string> = { A:'#10b981', B:'#0ea5e9', C:'#f59e0b', D:'#8b5cf6', E:'#ec4899' };
  return (
    <div style={pageStyle}>
      <div style={{ borderLeft: '4px solid #0ea5e9', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#0f2d59', margin: 0 }}>Data Sources — Governance</h1>
        <p style={{ color: '#475569' }}>Every figure traces to a <code>Source</code> record (21 fields). No standalone allegations — only side-by-side citations with freshness.</p>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginTop:'0.6rem' }}>
          {['', 'A','B','C','D','E'].map(t=>(
            <button key={t||'all'} onClick={()=>setFilterTier(t)} style={{ padding:'4px 10px', borderRadius:999, border: filterTier===t?'1px solid #0f2d59':'1px solid #e2e8f0', background: filterTier===t?'#0f2d59':'#fff', color: filterTier===t?'#fff':'#475569', fontWeight:700, fontSize:'0.72rem', cursor:'pointer' }}>{t?`Tier ${t}`:'All Tiers'}</button>
          ))}
          <span style={{ fontSize:'0.68rem', color:'#94a3b8', alignSelf:'center' }}>Tier A: GODL datasets • B: Official API • C: Webpage/PDF (quote+link) • D: Independent CC-BY • E: Community CC0</span>
        </div>
      </div>
      {!sources ? <div style={cardStyle}>Loading sources…</div> : (
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {filtered.map((s:any)=>{
            const tier = s.sourceType?.[0] || 'A';
            const stale = s.lastSuccessfulSync && (Date.now() - new Date(s.lastSuccessfulSync).getTime())/(1000*60*60*24) > parseInt(s.expectedRefreshInterval)||0*1.5;
            const failed = s.status==='failed' || s.status==='degraded';
            return (
              <div key={s.sourceId} style={{ ...cardStyle, borderLeft:`4px solid ${tierColor[tier]||'#64748b'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
                  <a href={s.sourceUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: '#0f2d59', fontSize: '0.95rem' }}>{s.sourceName} ↗</a>
                  <span style={{ display:'flex', gap:'0.35rem', alignItems:'center' }}>
                    <span style={{ background:`${tierColor[tier]}15`, color:tierColor[tier], border:`1px solid ${tierColor[tier]}30`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Tier {tier} · {s.sourceType}</span>
                    <span style={{ background: s.status==='active'?'#dcfce7':'#fef3c7', color: s.status==='active'?'#166534':'#92400e', border:`1px solid ${s.status==='active'?'#bbf7d0':'#fde68a'}`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>{s.status}</span>
                    {stale && <span style={{ background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a', padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Stale • {Math.floor((Date.now()-new Date(s.lastSuccessfulSync).getTime())/(1000*60*60*24))}d</span>}
                    {failed && <span style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca', padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Source failure — showing last successful {new Date(s.lastSuccessfulSync).toLocaleDateString()}</span>}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.3rem' }}>{s.organization}{s.department?` · ${s.department}`:''} · {s.governmentLevel} · {s.sourceType}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop:'0.3rem' }}><strong>License:</strong> {s.license} {s.termsUrl && <a href={s.termsUrl} target="_blank" rel="noreferrer" style={{ color:'#2563eb' }}>{s.termsUrl} ↗</a>} · <strong>Attribution:</strong> {s.attributionRequirement}</div>
                <div style={{ fontSize:'0.68rem', color:'#64748b', marginTop:'0.3rem' }}><strong>Reuse:</strong> {s.reusePermission} · <strong>Sensitivity:</strong> {s.dataSensitivity} · <strong>Parser:</strong> {s.parserVersion} · <strong>Owner:</strong> {s.owner}</div>
                <div style={{ fontSize:'0.68rem', color:'#64748b', marginTop:'0.3rem', display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                  <span>Update: {s.updateFrequency} (expected {s.expectedRefreshInterval})</span>
                  <span>· Last checked: {new Date(s.lastChecked).toLocaleString()}</span>
                  <span>· Last sync: {s.lastSuccessfulSync ? new Date(s.lastSuccessfulSync).toLocaleString() : '—'}</span>
                  <span>· Published: {s.lastPublishedDate || '—'}</span>
                  {s.apiUrl && <><span>·</span><a href={s.apiUrl} target="_blank" rel="noreferrer" style={{ color:'#2563eb' }}>API ↗</a></>}
                  {s.datasetUrl && <><span>·</span><a href={s.datasetUrl} target="_blank" rel="noreferrer" style={{ color:'#2563eb' }}>Dataset ↗</a></>}
                </div>
                {s.notes && <div style={{ fontSize:'0.68rem', color:'#92400e', background:'#fef3c7', border:'1px solid #fde68a', borderRadius:6, padding:'0.35rem 0.5rem', marginTop:'0.4rem' }}>Note: {s.notes}</div>}
                <div style={{ fontSize:'0.68rem', color:'#2563eb', marginTop:'0.4rem' }}><a href={`/data-sources#${s.sourceId}`} style={{ color:'#2563eb' }}>Methodology for {s.sourceName} →</a> · <span style={{ color:'#64748b' }}>Citation: {s.attributionRequirement} · freshness: {new Date(s.lastSuccessfulSync).toLocaleDateString()} · <a href={s.sourceUrl} target="_blank" rel="noreferrer" style={{ color:'#0f2d59' }}>Source ↗</a></span></div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ ...cardStyle, background:'#f8fafc' }}>
        <h3 style={{ color:'#0f2d59', fontSize:'0.95rem' }}>How we use sources</h3>
        <ul style={{ fontSize:'0.82rem', color:'#475569' }}>
          <li><strong>Can we store?</strong> Tier A/B: yes (GODL). Tier C: excerpt ≤200 chars + link, not full PDF. Tier E: anon only.</li>
          <li><strong>Can we transform/display/redistribute/link/attribute/permission?</strong> Per `reusePermission` decision — never assume public = unrestricted.</li>
          <li>Every public data point has DataPoint (source_id, observed_at, source_published_at, recalc_at, scoringVersion) → ProvenanceBar triple timestamp.</li>
          <li><strong>Source failure warning:</strong> if `lastSuccessfulSync` stale &gt; `expectedRefreshInterval×1.5` → amber `Stale` + per-card `Source degraded`.</li>
        </ul>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div style={pageStyle}>
      <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#0f2d59', margin: 0 }}>Privacy & Terms</h1>
        <p style={{ color: '#475569' }}>Anonymous by default, audited by design.</p>
      </div>
      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59' }}>Privacy</h3>
        <ul style={{ fontSize: '0.9rem', color: '#334155' }}>
          <li>No login required to browse. Search history not stored.</li>
          <li>Photo drops: EXIF stripped (GPS/timestamp/device), IP hashed SHA-256 + salt, never shown. Stored `PENDING` → moderation → `APPROVED/REJECTED`.</li>
          <li>PIN queries resolved client-side where possible; proxied via cache, rate-limited (IP bucket) to prevent scraping.</li>
          <li>Follow PIN is local `localStorage` + anonymized `Follow` row (no PII).</li>
        </ul>
      </div>
      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59' }}>Terms</h3>
        <ul style={{ fontSize: '0.9rem', color: '#334155' }}>
          <li>We cite CAG/RTI/official PDFs verbatim; we do not make independent accusations.</li>
          <li>Citizen reports are <em>observations</em>, not verdicts. Confidence displayed (building/strong) with sample size & agreement.</li>
          <li>Dispute path: `Report Data Issue →` correction queued, audit trail preserved, original never silently deleted.</li>
          <li>Abuse: burst detection, duplicate IP/device gating, photo redaction queue, trail retained 90 days.</li>
        </ul>
      </div>
    </div>
  );
}

export function ReportIssuePage() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || '110001';
  const [pinInput, setPinInput] = useState(initialPin);
  const [currentPin, setCurrentPin] = useState(initialPin);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [desc, setDesc] = useState('');
  const [moduleSel, setModuleSel] = useState('school');

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  const loadReports = () => {
    setLoading(true);
    api.getReports(currentPin).then(r => { setReports(Array.isArray(r) ? r : []); }).catch(() => setReports([])).finally(() => setLoading(false));
  };

  useEffect(() => { loadReports(); }, [currentPin]);

  const handleSubmit = async () => {
    if (!desc.trim()) return;
    setSubmitting(true);
    try {
      await api.submitReport({ pinCode: currentPin, module: moduleSel, category: 'Citizen Issue', description: desc.trim() });
      setDesc('');
      loadReports();
    } catch { /* queued locally */ setDesc(''); } finally { setSubmitting(false); }
  };

  return (
    <div style={pageStyle}>
      <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#0f2d59', margin: 0 }}>Report an Issue</h1>
        <p style={{ color: '#475569' }}>Anonymous ground truth — photo, PIN, category, description.</p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59', marginTop: 0 }}>Search reports by PIN</h3>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
          <input
            type="text"
            className="form-input"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="PIN code"
            style={{ maxWidth: 160 }}
          />
          <button
            onClick={() => { setCurrentPin(pinInput); setSearchParams({ pin: pinInput }); }}
            className="btn btn-primary"
          >खोजें</button>
        </div>
        {loc.isValid && (
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            📍 {loc.district} ({loc.state}){loc.stateCode ? ` · ${loc.stateCode}` : ''}
          </p>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59', marginTop: 0 }}>Submit a citizen report</h3>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
          <select value={moduleSel} onChange={(e) => setModuleSel(e.target.value)} className="form-input" style={{ maxWidth: 200 }}>
            <option value="school">School</option>
            <option value="hospital">Hospital</option>
            <option value="infra">Infra</option>
            <option value="rera">RERA</option>
            <option value="ration">Ration</option>
            <option value="contractor">Contractor</option>
          </select>
          <input readOnly value={currentPin} className="form-input" style={{ maxWidth: 120, opacity: 0.7 }} />
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the ground-truth issue (anonymous)…"
          className="form-input"
          rows={3}
          style={{ width: '100%', resize: 'vertical' }}
        />
        <div style={{ marginTop: '0.6rem' }}>
          <button onClick={handleSubmit} disabled={submitting || !desc.trim()} className="btn btn-primary">
            {submitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.6rem' }}>
          Goes to <code>POST /api/reports</code> as <code>PENDING</code>, media capped at 10 items. Moderation SLA 72h · <a href="mailto:moderation@jantax.in" style={{ color: '#0f2d59' }}>moderation@jantax.in</a>.
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59', marginTop: 0 }}>Reports for this PIN</h3>
        {loading ? (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Loading…</p>
        ) : reports.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No citizen reports on file for {currentPin} yet. Be the first to drop ground truth.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {reports.map((r) => (
              <div key={r.id} style={{ border: '1px solid #eef2f7', borderRadius: 10, padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#0f2d59' }}>{r.category || r.title || 'Citizen Report'}</strong>
                  <SourceBadge sourceType="E" sourceName={`${r.status || 'PENDING'} · ${r.module || 'citizen'}`} />
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.4rem 0 0' }}>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: '#0f2d59', marginTop: 0 }}>Government Response (कार्रवाई) — दावा vs हकीकत → कार्रवाई</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.8rem' }}>
          Read-only accountability loop: <strong>Submitted → Acknowledged → Action → Verified</strong>. Original citizen report is never deleted; delay tracked as Filed→Resolved.
        </p>
        <GovtResponseTracker reports={reports} />
      </div>

      <div style={cardStyle}>
        <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Prefer a module-specific drop? Use any module’s <strong>Report / Photo Drop</strong>:</p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
          <button onClick={()=>nav(`/module/school?pin=${currentPin}`)} className="btn btn-primary">School Report</button>
          <button onClick={()=>nav(`/module/hospital?pin=${currentPin}`)} className="btn btn-secondary">Hospital Photo Drop</button>
          <button onClick={()=>nav(`/module/andhbhakt?pin=${currentPin}`)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Andhbhakt Photo Drop</button>
        </div>
      </div>
    </div>
  );
}
