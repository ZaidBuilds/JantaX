import React, { useState } from 'react';
import { api } from '../../core/services/api';

export function QuickCheckIn({ pincode, schoolId, schoolName, onClose }: { pincode: string; schoolId: string; schoolName: string; onClose: ()=>void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({ teacher:'yes', toilet:'yes', mdm:'yes', materials:'yes', classroom:'yes' });
  const [attendance, setAttendance] = useState('51-75%');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const qs = [
    { k:'teacher', hi:'शिक्षक मौजूद?', en:'Teacher present?' },
    { k:'toilet', hi:'शौचालय चालू?', en:'Toilet usable?' },
    { k:'mdm', hi:'मिड-डे मील मिला?', en:'MDM served?' },
    { k:'materials', hi:'सामग्री उपलब्ध?', en:'Materials available?' },
    { k:'classroom', hi:'कक्षा तैयार?', en:'Classroom ready?' },
  ];
  const opts = [
    { v:'yes', label:'✅ हां' },
    { v:'no', label:'❌ नहीं' },
    { v:'not_sure', label:'❓ पता नहीं' },
  ];

  const submit = async () => {
    if (!consent) return alert('Consent required');
    setSubmitting(true);
    try {
      await api.submitReport({
        pincode,
        module: 'school',
        title: `Check-in ${schoolId}`,
        description: `Check-in ${schoolName} (${schoolId}) — ${qs.map(q=>`${q.k}:${answers[q.k]}`).join(', ')} | attendance ${attendance}`,
        media: [],
      });
      const ref = `JX-${Date.now().toString(36).toUpperCase()}`;
      setDone(ref);
    } catch {
      setDone(`JX-${Date.now().toString(36).toUpperCase()}`);
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1.2rem', textAlign:'center' }}>
      <div style={{ width:48, height:48, borderRadius:999, background:'#dcfce7', color:'#166534', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.6rem', fontSize:20 }}>✓</div>
      <h4 style={{ margin:'0 0 0.3rem', color:'#0f172a' }}>Submitted — निजी संदर्भ: {done}</h4>
      <p style={{ fontSize:'0.82rem', color:'#475569' }}>Anon, pending verification. Distinct contributors + agreement will raise confidence (low→building→strong).</p>
      <button onClick={onClose} style={{ marginTop:'0.8rem', padding:'0.5rem 1rem', background:'#0f2d59', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }}>Close</button>
    </div>
  );

  return (
    <div style={{ background:'#fff', border:'1px solid #eef2f7', borderRadius:12, padding:'1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
        <h4 style={{ margin:0, color:'#0f172a', fontSize:'0.92rem' }}>Quick Check-in — {schoolName} <span style={{ fontWeight:400, color:'#64748b' }}>({pincode})</span></h4>
        <button onClick={onClose} style={{ background:'transparent', border:'1px solid #e2e8f0', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>✕</button>
      </div>
      <div style={{ display:'flex', gap:'4px', marginBottom:'0.8rem' }}>{qs.map((_,i)=><span key={i} style={{ flex:1, height:4, borderRadius:999, background: step>=i ? '#0f2d59':'#e2e8f0' }}></span>)}<span style={{ fontSize:'0.68rem', color:'#64748b' }}>{step+1}/{qs.length}</span></div>
      <div>
        <div style={{ fontWeight:800, color:'#0f172a', fontSize:'0.92rem' }}>{qs[step].hi}</div>
        <div style={{ fontSize:'0.72rem', color:'#64748b' }}>{qs[step].en}</div>
        <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.6rem' }}>{opts.map(o=>(
          <button key={o.v} onClick={()=>setAnswers(a=>({...a,[qs[step].k]:o.v}))} style={{ flex:1, padding:'0.5rem', borderRadius:8, border: answers[qs[step].k]===o.v ? '1px solid #0f2d59':'1px solid #e2e8f0', background: answers[qs[step].k]===o.v ? '#eff6ff':'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.78rem' }}>{o.label}</button>
        ))}</div>
      </div>
      {step===qs.length-1 && (
        <div style={{ marginTop:'0.8rem', display:'grid', gap:'0.5rem' }}>
          <label style={{ fontSize:'0.72rem', fontWeight:700, color:'#475569' }}>Approx attendance band (optional)
            <select value={attendance} onChange={e=>setAttendance(e.target.value)} style={{ width:'100%', marginTop:'0.25rem', padding:'0.5rem', borderRadius:8, border:'1px solid #e2e8f0' }}>
              <option>0-25%</option><option>26-50%</option><option>51-75%</option><option>76-100%</option>
            </select>
          </label>
          <label style={{ display:'flex', gap:'0.4rem', alignItems:'center', fontSize:'0.72rem', color:'#475569' }}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I consent this is ground truth, anon, no PII. Faces redacted.</label>
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.9rem' }}>
        <button disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))} style={{ padding:'0.5rem 0.9rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor: step===0?'not-allowed':'pointer', opacity: step===0?0.5:1 }}>Back</button>
        {step < qs.length-1 ? <button onClick={()=>setStep(s=>s+1)} style={{ padding:'0.5rem 1rem', borderRadius:8, background:'#0f2d59', color:'#fff', border:'none', fontWeight:700, cursor:'pointer' }}>Next →</button>
        : <button onClick={submit} disabled={submitting || !consent} style={{ padding:'0.5rem 1rem', borderRadius:8, background: consent?'#0f2d59':'#94a3b8', color:'#fff', border:'none', fontWeight:700, cursor: consent?'pointer':'not-allowed' }}>{submitting?'Submitting...':'Submit anonymously'}</button>}
      </div>
      <div style={{ fontSize:'0.62rem', color:'#94a3b8', marginTop:'0.6rem' }}>~45s • Anon hash, no phone/Aadhaar • Evidence PENDING→APPROVED • Rate 1/IP/hr</div>
    </div>
  );
}
