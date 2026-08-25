import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { states, claims } from '../data/rawSeedData';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode, isValidIndianPincode } from '../../../core/utils/pinResolver';
import { Search, MapPin, Share2, Eye, ShieldAlert, Building2, UserCheck, Wallet, Flame, HeartPulse, Route, Package, Award } from 'lucide-react';
import { api } from '../../../core/services/api';

// Category config with icons/colors
const CATEGORY_CFG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  school: { label: 'स्कूल', icon: Building2, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  hospital: { label: 'अस्पताल', icon: HeartPulse, color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  road: { label: 'सड़क', icon: Route, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  ration: { label: 'राशन', icon: Package, color: '#d97706', bg: 'rgba(217,119,6,0.15)' },
  water: { label: 'पानी', icon: '💧', color: '#06b6d4', bg: 'rgba(6,182,214,0.15)' },
  police: { label: 'पुलिस', icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const ALL_CATEGORIES = [
  { key: 'school', label: 'स्कूल', labelEn: 'School', icon: '🏫' },
  { key: 'hospital', label: 'अस्पताल', icon: '🏥' },
  { key: 'road', label: 'सड़क', icon: '🛣️' },
  { key: 'ration', label: 'राशन', icon: '📦' },
  { key: 'water', label: 'पानी', icon: '💧' },
  { key: 'police', label: 'पुलिस', icon: '🚔' },
];

// State code from state name
const stateNameToCode: Record<string, string> = Object.fromEntries(states.map(s => [s.name, s.code]));

function pinToStateCode(pin: string): string | null {
  const resolved = resolvePincode(pin);
  if (!resolved.isValid) return null;
  return stateNameToCode[resolved.state] || null;
}

export function AndhbhaktDash() {
  const { share } = useWhatsAppShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || '';
  const initialState = searchParams.get('state') || '';
  const initialCat = searchParams.get('cat') || '';

  const [pinInput, setPinInput] = useState(initialPin);
  const [selectedStateCode, setSelectedStateCode] = useState(initialState);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [photoDrops, setPhotoDrops] = useState<any[]>([
    { id: '1', pincode: '226001', district: 'Lucknow', category: 'hospital', description: 'Locked ward at District Hospital', photoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80', timestamp: '2 hours ago' },
    { id: '2', pincode: '823001', district: 'Gaya', category: 'water', description: 'Dry tap with zero supply since 3 weeks', photoUrl: 'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&w=400&q=80', timestamp: '5 hours ago' },
  ]);
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoPin, setNewPhotoPin] = useState('');
  const [newPhotoCat, setNewPhotoCat] = useState('school');
  const [showToast, setShowToast] = useState('');

  // Sync URL -> state
  useEffect(() => {
    const p = searchParams.get('pin') || '';
    const s = searchParams.get('state') || '';
    const c = searchParams.get('cat') || '';
    setPinInput(p);
    setSelectedStateCode(s);
    setSelectedCategory(c);
  }, [searchParams]);

  const updateURL = (pin: string, state: string, cat: string) => {
    const params = new URLSearchParams();
    if (pin) params.set('pin', pin);
    if (state) params.set('state', state);
    if (cat) params.set('cat', cat);
    setSearchParams(params, { replace: true });
  };

  const handlePinSubmit = () => {
    if (pinInput && !isValidIndianPincode(pinInput)) {
      setShowToast('Invalid PIN'); setTimeout(()=>setShowToast(''),2000); return;
    }
    const derivedState = pinInput ? pinToStateCode(pinInput) || '' : '';
    const nextState = pinInput ? derivedState : selectedStateCode;
    updateURL(pinInput, nextState, selectedCategory);
  };

  const handleStateClick = (code: string) => {
    const next = selectedStateCode === code ? '' : code;
    updateURL(pinInput, next, selectedCategory);
  };
  const handleCategoryClick = (key: string) => {
    const next = selectedCategory === key ? '' : key;
    updateURL(pinInput, selectedStateCode, next);
  };

  const filteredClaims = useMemo(() => {
    let list: any[] = [...claims];
    const pin = searchParams.get('pin') || pinInput;
    const state = searchParams.get('state') || selectedStateCode;
    const cat = searchParams.get('cat') || selectedCategory;

    if (pin && isValidIndianPincode(pin)) {
      // Exact pincode first
      const exact = list.filter(c => String(c.pincode) === pin);
      if (exact.length) list = exact;
      else {
        const sc = pinToStateCode(pin);
        if (sc) list = list.filter(c => c.stateCode === sc);
      }
    } else if (state) {
      list = list.filter(c => c.stateCode === state);
    }
    if (cat) list = list.filter(c => c.category === cat);
    return list;
  }, [searchParams, pinInput, selectedStateCode, selectedCategory]);

  // Stats
  const stats = useMemo(() => {
    const total = claims.length;
    const verified = claims.filter(c=>c.verified).length;
    const totalBudget = claims.reduce((a,c)=>a+(c.budgetAllocated||0),0);
    const spent = claims.reduce((a,c)=>a+(c.budgetSpent||0),0);
    const pending = photoDrops.length;
    return { total, verified, totalBudget, spent, pending };
  }, [photoDrops]);

  const handleWhatsAppShare = (claim: any) => {
    const stateName = states.find(s => s.code === claim.stateCode)?.nameHi || claim.stateCode;
    share({
      pinCode: String(claim.pincode),
      titleHindi: claim.claimTextHi,
      titleEnglish: claim.claimTextEn,
      claimLabel: claim.claimNumber,
      claimLabelHindi: claim.claimNumber,
      realityLabel: claim.realityNumber,
      realityLabelHindi: claim.realityNumber,
      responsiblePerson: claim.officerName || claim.contractorName || '—',
      responsibleOrg: claim.officerDept || claim.contractorFirm || '—',
      sourceUrl: claim.sourceUrl,
      moduleNameHindi: `अंधभक्त स्टेट (${stateName})`,
    });
    setShowToast('WhatsApp card copied!'); setTimeout(()=>setShowToast(''),2000);
  };

  const handlePhotoDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoDesc.trim() || !newPhotoPin.trim() || !isValidIndianPincode(newPhotoPin)) {
      setShowToast('Valid PIN + desc required'); setTimeout(()=>setShowToast(''),2000); return;
    }
    const payload = {
      pincode: newPhotoPin,
      module: 'andhbhakt',
      category: newPhotoCat,
      description: newPhotoDesc,
      media: [`https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80`],
    };
    try {
      await api.submitReport(payload as any);
      setShowToast('Submitted to moderation ✓'); 
    } catch {
      setShowToast('Saved locally (offline) ✓');
    }
    const newPhoto = { id: Date.now().toString(), pincode: newPhotoPin, district: resolvePincode(newPhotoPin).district, category: newPhotoCat, description: newPhotoDesc, photoUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80', timestamp: 'Just now' };
    setPhotoDrops([newPhoto, ...photoDrops]);
    setNewPhotoDesc(''); setNewPhotoPin('');
    setTimeout(()=>setShowToast(''),2500);
  };

  const selectedState = states.find(s=>s.code===selectedStateCode);

  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#f1f5f9' }}>
      {/* Dark Hero */}
      <div style={{ background: 'radial-gradient(800px 400px at 20% 0%, rgba(239,68,68,0.18), transparent 60%), radial-gradient(600px 300px at 90% 20%, rgba(245,158,11,0.12), transparent 60%), linear-gradient(180deg, #0f172a 0%, #020617 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.62rem', fontWeight: 900, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.06em' }}>ANDHBHAKT.ORG STYLE</span>
            <span style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)' }}>28 STATES • CAG VERIFIED</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>अंधभक्त</span>
            <span style={{ color: '#f1f5f9' }}>स्टेट</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>— State CM Accountability Tracker</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: 760, marginTop: '0.6rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#f8fafc' }}>दावा बनाम हकीकत:</strong> मुख्यमंत्रियों के प्रचार-प्रसार बनाम CAG/RTI ऑडिट और ज़मीनी फ़ोटो का जनता-निर्मित साक्ष्य-कोष। PIN से अपने राज्य तक पहुँचें, श्रेणी छाँटें, और WhatsApp पर प्रचारित करें।
          </p>
          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
            {[
              { k: 'States Mapped', v: '28', sub: 'All CMs' },
              { k: 'Claims Tracked', v: String(stats.total), sub: `${stats.verified} Verified` },
              { k: 'Budget Audited', v: `₹${(stats.totalBudget/1000).toFixed(1)}k Cr`, sub: `Spent ₹${(stats.spent/1000).toFixed(1)}k` },
              { k: 'Photo Drops', v: String(stats.pending), sub: 'Citizen evidence' },
            ].map(s=>(
              <div key={s.k} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.85rem', backdropFilter: 'blur(6px)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1' }}>{s.k}</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem' }}>
        {/* Filters Panel — Dark */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', gap: '0.4rem', alignItems: 'center', margin: 0 }}><Search size={16}/> फ़िल्टर करें / Filter Records</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{filteredClaims.length} claims</span>
              {(pinInput||selectedStateCode||selectedCategory) && <button onClick={()=>{updateURL('','',''); setPinInput('');}} style={{ fontSize:'0.72rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color:'#cbd5e1', padding:'4px 10px', borderRadius:999, cursor:'pointer' }}>Clear All ✕</button>}
            </div>
          </div>

          {/* PIN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', display:'block', marginBottom:'0.35rem' }}>पिन कोड से खोजें / Search by PIN Code</label>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <div style={{ position:'relative', flex:1 }}>
                  <MapPin size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#64748b' }}/>
                  <input value={pinInput} onChange={e=>setPinInput(e.target.value.replace(/\D/g,'').slice(0,6))} onKeyDown={e=>e.key==='Enter'&&handlePinSubmit()} placeholder="पिन कोड दर्ज करें (उदा. 226001)" style={{ width:'100%', background:'#020617', border:'1px solid rgba(255,255,255,0.10)', color:'#f1f5f9', borderRadius:10, padding:'0.62rem 0.75rem 0.62rem 32px', outline:'none', fontSize:'0.82rem' }}/>
                </div>
                <button onClick={handlePinSubmit} style={{ background:'#ef4444', color:'#fff', border:'none', borderRadius:10, padding:'0 16px', fontWeight:800, fontSize:'0.82rem', cursor:'pointer', whiteSpace:'nowrap' }}>Search</button>
              </div>
              {pinInput && isValidIndianPincode(pinInput) && (
                <div style={{ fontSize:'0.72rem', color:'#10b981', marginTop:'0.35rem' }}>📍 {resolvePincode(pinInput).state} · {resolvePincode(pinInput).district} {pinToStateCode(pinInput)?`→ ${pinToStateCode(pinInput)}`:`· Unknown`}</div>
              )}
            </div>
            <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', borderRadius:12, padding:'0.75rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:800, color:'#fecaca' }}>Selected State</div>
              {selectedState ? (
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginTop:'0.25rem' }}>
                  <span style={{ width:10, height:10, borderRadius:999, background:selectedState.partyColor, display:'inline-block', boxShadow:`0 0 0 4px ${selectedState.partyColor}22` }}></span>
                  <div>
                    <div style={{ fontWeight:800, color:'#fff', fontSize:'0.88rem', lineHeight:1 }}>{selectedState.nameHi} ({selectedState.code})</div>
                    <div style={{ fontSize:'0.72rem', color:'#cbd5e1' }}>{selectedState.cmNameHi} · {selectedState.party} · {selectedState.capitalHi}</div>
                  </div>
                </div>
              ) : <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.25rem' }}>All 28 states — choose below or enter PIN</div>}
            </div>
          </div>

          {/* State pills */}
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', marginBottom:'0.4rem' }}>या राज्य चुनें / Or Select State (28 CMs)</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {states.map(s=>{
                const active = selectedStateCode===s.code;
                return (
                  <button key={s.code} onClick={()=>handleStateClick(s.code)} style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.38rem 0.65rem', borderRadius:999, border: active?`1px solid ${s.partyColor}`:'1px solid rgba(255,255,255,0.08)', background: active?`linear-gradient(135deg, ${s.partyColor}22, rgba(255,255,255,0.04))`:'rgba(255,255,255,0.04)', color: active?'#fff':'#cbd5e1', fontWeight: active?800:600, fontSize:'0.74rem', cursor:'pointer' }}>
                    <span style={{ width:7, height:7, borderRadius:999, background:s.partyColor }}></span>{s.nameHi} ({s.code})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', marginBottom:'0.4rem' }}>श्रेणी / Category</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {ALL_CATEGORIES.map(cat=>{
                const active = selectedCategory===cat.key;
                return (
                  <button key={cat.key} onClick={()=>handleCategoryClick(cat.key)} style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.45rem 0.85rem', borderRadius:999, border: active?'1px solid #f59e0b':'1px solid rgba(255,255,255,0.08)', background: active?'rgba(245,158,11,0.15)':'rgba(255,255,255,0.04)', color: active?'#fef3c7':'#cbd5e1', fontWeight: active?800:600, fontSize:'0.78rem', cursor:'pointer' }}>
                    <span>{cat.icon}</span>{cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Claims Grid */}
        <div style={{ marginTop:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.85rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#f1f5f9', margin:0, display:'flex', gap:'0.4rem', alignItems:'center' }}><Flame size={16} color="#ef4444"/> दावा बनाम हकीकत सूची / Claims Grid <span style={{ background:'rgba(255,255,255,0.08)', color:'#cbd5e1', fontSize:'0.72rem', padding:'2px 8px', borderRadius:999, border:'1px solid rgba(255,255,255,0.08)' }}>{filteredClaims.length}</span></h3>
            <span style={{ fontSize:'0.72rem', color:'#94a3b8' }}>CAG / RTI / Citizen verified</span>
          </div>

          <div style={{ display:'grid', gap:'1rem' }}>
            {filteredClaims.map((claim:any, idx:number)=>{
              const s = states.find(st=>st.code===claim.stateCode);
              const catInfo = CATEGORY_CFG[claim.category] || { color:'#94a3b8', bg:'rgba(148,163,184,0.15)', label: claim.category };
              const severityColor = claim.verified ? '#10b981' : '#f59e0b';
              const budgetPct = claim.budgetAllocated ? Math.min(100, Math.round((claim.budgetSpent/claim.budgetAllocated)*100)) : 0;
              return (
                <div key={`${claim.pincode}-${idx}`} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.35)' }}>
                  {/* Ribbon */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0.9rem', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap', gap:'0.5rem' }}>
                    <span style={{ fontSize:'0.72rem', color:'#cbd5e1', display:'flex', gap:'0.4rem', alignItems:'center' }}>
                      <MapPin size={12}/> PIN: <strong style={{ color:'#f1f5f9' }}>{claim.pincode}</strong> · {claim.districtHi} ({s?.nameHi}) · <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', background:catInfo.bg, color:catInfo.color, padding:'1px 7px', borderRadius:999, fontWeight:800, fontSize:'0.62rem', border:`1px solid ${catInfo.color}30` }}>{claim.category.toUpperCase()}</span>
                    </span>
                    <span style={{ fontSize:'0.62rem', fontWeight:800, padding:'3px 8px', borderRadius:999, background: claim.verified? 'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)', color: claim.verified?'#10b981':'#f59e0b', border:`1px solid ${claim.verified?'rgba(16,185,129,0.3)':'rgba(245,158,11,0.3)'}` }}>{claim.verified?'✓ Verified':'◷ Pending'}</span>
                  </div>

                  {/* Split */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'0.9rem', padding:'0.9rem', background:'#020617' }}>
                    {/* Claim */}
                    <div style={{ background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.18)', borderLeft:'4px solid #2563eb', borderRadius:12, padding:'1rem' }}>
                      <div style={{ fontSize:'0.68rem', fontWeight:800, color:'#60a5fa', display:'flex', gap:'0.35rem', alignItems:'center', marginBottom:'0.5rem' }}>📢 सरकारी दावा / CM Claim</div>
                      <blockquote style={{ fontSize:'0.86rem', lineHeight:1.5, fontStyle:'italic', color:'#f1f5f9', borderLeft:'3px solid #2563eb', paddingLeft:'0.7rem', margin:0 }}>{claim.claimTextHi}</blockquote>
                      <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.7rem', lineHeight:1.4 }}>
                        👤 CM: <strong style={{ color:'#cbd5e1' }}>{claim.claimedByHi}</strong> — {claim.claimedByDesignation}<br/>
                        📅 {claim.claimDate} · {claim.claimOccasionHi} · <a href={claim.sourceUrl} target="_blank" rel="noreferrer" style={{ color:'#60a5fa' }}>{claim.sourceType}</a>
                      </div>
                      <div style={{ marginTop:'0.6rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'0.45rem 0.6rem', display:'flex', justifyContent:'space-between', fontSize:'0.74rem' }}>
                        <span style={{ color:'#94a3b8' }}>Claim Number</span><strong style={{ color:'#f1f5f9' }}>{claim.claimNumber}</strong>
                      </div>
                    </div>
                    {/* Reality */}
                    <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', borderLeft:'4px solid #ef4444', borderRadius:12, padding:'1rem' }}>
                      <div style={{ fontSize:'0.68rem', fontWeight:800, color:'#fca5a5', display:'flex', gap:'0.35rem', alignItems:'center', marginBottom:'0.5rem' }}><Eye size={12}/> ज़मीनी हकीकत / Reality</div>
                      <p style={{ fontSize:'0.86rem', lineHeight:1.5, color:'#fecaca', borderLeft:'3px solid #ef4444', paddingLeft:'0.7rem', margin:0 }}>{claim.realityTextHi}</p>
                      <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.7rem' }}>📋 Source: <strong style={{ color:'#cbd5e1' }}>{claim.verificationSource}</strong> · 📅 {claim.realityDate || '—'}</div>
                      <div style={{ marginTop:'0.6rem', display:'flex', gap:'0.5rem' }}>
                        <span style={{ background:'rgba(239,68,68,0.15)', color:'#fecaca', border:'1px solid rgba(239,68,68,0.25)', padding:'3px 8px', borderRadius:999, fontSize:'0.72rem', fontWeight:800 }}>{claim.realityNumber}</span>
                        {claim.realityPhotoUrl && <span style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color:'#cbd5e1', padding:'3px 8px', borderRadius:999, fontSize:'0.62rem' }}>📷 Photo evidence</span>}
                      </div>
                    </div>
                  </div>

                  {/* Budget bar */}
                  {claim.budgetAllocated && (
                    <div style={{ padding:'0 0.9rem 0.7rem', background:'#020617' }}>
                      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'0.6rem 0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.72rem', color:'#94a3b8', display:'flex', gap:'0.35rem', alignItems:'center' }}><Wallet size={12}/> बजट: <strong style={{ color:'#f1f5f9' }}>₹{claim.budgetAllocated} Cr</strong> आवंटित → खर्च ₹{claim.budgetSpent} Cr ({budgetPct}%)</span>
                        <span style={{ flex:1, maxWidth:220, height:8, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}><span style={{ display:'block', height:'100%', width:`${budgetPct}%`, background: budgetPct>70?'#10b981':budgetPct>40?'#f59e0b':'#ef4444', borderRadius:999 }}></span></span>
                      </div>
                    </div>
                  )}

                  {/* Accountability footer */}
                  <div style={{ padding:'0.75rem 0.9rem', background:'rgba(255,255,255,0.03)', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
                    <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', fontSize:'0.72rem', color:'#94a3b8' }}>
                      {claim.contractorName && <span style={{ display:'flex', gap:'0.25rem', alignItems:'center' }}><Building2 size={12}/>ठेकेदार: <strong style={{ color:'#f1f5f9' }}>{claim.contractorName}</strong> <span style={{ color:'#64748b' }}>({claim.contractorFirm})</span></span>}
                      {claim.officerName && <span style={{ display:'flex', gap:'0.25rem', alignItems:'center' }}><UserCheck size={12}/>अधिकारी: <strong style={{ color:'#f1f5f9' }}>{claim.officerName}</strong> <span style={{ color:'#64748b' }}>({claim.officerDesignation})</span></span>}
                    </div>
                    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                      <button onClick={()=>setUpvoted(p=>({...p, [claim.pincode+idx]: !p[claim.pincode+idx]}))} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color: upvoted[claim.pincode+idx]?'#f59e0b':'#cbd5e1', padding:'0.4rem 0.7rem', borderRadius:999, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', display:'flex', gap:'0.25rem', alignItems:'center' }}>{upvoted[claim.pincode+idx]?'★':'☆'} {claim.verified? 24 : 7} Upvotes</button>
                      <button onClick={()=>handleWhatsAppShare(claim)} style={{ background:'#25d366', color:'#fff', border:'none', borderRadius:999, padding:'0.45rem 0.9rem', fontWeight:800, fontSize:'0.72rem', cursor:'pointer', display:'flex', gap:'0.3rem', alignItems:'center' }}><Share2 size={12}/> WhatsApp</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredClaims.length===0 && <div style={{ textAlign:'center', padding:'2.5rem', color:'#64748b', background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>कोई दावा नहीं मिला — फ़िल्टर साफ़ करें / No claims found</div>}
          </div>
        </div>

        {/* Photo Drops — Dark */}
        <div style={{ marginTop:'1.25rem', background:'#0f172a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1rem', boxShadow:'0 8px 24px rgba(0,0,0,0.35)' }}>
          <h3 style={{ fontSize:'0.92rem', fontWeight:800, color:'#f1f5f9', display:'flex', gap:'0.4rem', alignItems:'center', margin:'0 0 0.9rem' }}>📸 नागरिक फ़ोटो प्रमाण / Citizen Photo Drops <span style={{ background:'rgba(255,255,255,0.06)', color:'#94a3b8', fontSize:'0.62rem', padding:'2px 7px', borderRadius:999, border:'1px solid rgba(255,255,255,0.08)' }}>{photoDrops.length}</span></h3>
          <form onSubmit={handlePhotoDrop} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'0.85rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.78rem', fontWeight:800, color:'#cbd5e1', marginBottom:'0.5rem' }}>अनाम फ़ोटो डालें / Drop Anonymous Photo</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem' }}>
              <input value={newPhotoPin} onChange={e=>setNewPhotoPin(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="पिन कोड (उदा. 226001)" maxLength={6} required style={{ background:'#020617', border:'1px solid rgba(255,255,255,0.10)', color:'#f1f5f9', borderRadius:10, padding:'0.55rem 0.75rem', outline:'none', fontSize:'0.78rem' }}/>
              <select value={newPhotoCat} onChange={e=>setNewPhotoCat(e.target.value)} style={{ background:'#020617', border:'1px solid rgba(255,255,255,0.10)', color:'#f1f5f9', borderRadius:10, padding:'0.55rem 0.75rem', outline:'none', fontSize:'0.78rem' }}>
                {ALL_CATEGORIES.map(c=> <option key={c.key} value={c.key} style={{ background:'#020617' }}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <textarea value={newPhotoDesc} onChange={e=>setNewPhotoDesc(e.target.value)} placeholder="विवरण दर्ज करें (उदा. अस्पताल का मुख्य गेट ताला बंद है)..." rows={2} required style={{ width:'100%', background:'#020617', border:'1px solid rgba(255,255,255,0.10)', color:'#f1f5f9', borderRadius:10, padding:'0.6rem 0.75rem', outline:'none', fontSize:'0.78rem', resize:'none', marginBottom:'0.5rem' }}/>
            <button type="submit" style={{ width:'100%', background:'#ef4444', color:'#fff', border:'none', borderRadius:10, padding:'0.65rem', fontWeight:800, fontSize:'0.82rem', cursor:'pointer' }}>📤 अनाम रूप से पोस्ट करें / Submit Anonymously</button>
          </form>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.75rem' }}>
            {photoDrops.map(p=>(
              <div key={p.id} style={{ background:'#020617', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, overflow:'hidden' }}>
                <img src={p.photoUrl} alt={p.description} style={{ width:'100%', height:120, objectFit:'cover' }}/>
                <div style={{ padding:'0.65rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.62rem', color:'#64748b', marginBottom:'0.2rem' }}><span>📍 PIN {p.pincode}</span><span>{p.timestamp}</span></div>
                  <p style={{ fontSize:'0.74rem', color:'#cbd5e1', lineHeight:1.35, margin:0 }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showToast && <div style={{ position:'fixed', bottom:18, right:18, background:'#0f172a', color:'#f1f5f9', border:'1px solid rgba(255,255,255,0.12)', padding:'0.6rem 0.9rem', borderRadius:10, fontSize:'0.78rem', fontWeight:700, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', zIndex:50 }}>{showToast}</div>}

      <style>{`@media(max-width: 640px){ div[style*="gridTemplateColumns: '1.6fr 1fr'"]{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}
