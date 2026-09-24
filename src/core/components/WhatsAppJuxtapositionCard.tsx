import React, { useState } from 'react';
import type { BottleneckLens } from '../services/bottleneckService';
import { Share2, Copy, Check, ExternalLink, ShieldCheck, Flame, AlertTriangle, Sparkles, Globe } from 'lucide-react';

interface Props {
  pinCode: string;
  locality: string;
  lens: BottleneckLens;
  onSelectLens?: (lensId: string) => void;
  availableLenses?: BottleneckLens[];
}

export function WhatsAppJuxtapositionCard({ pinCode, locality, lens, onSelectLens, availableLenses }: Props) {
  const [lang, setLang] = useState<'hi' | 'en'>('en');
  const [copied, setCopied] = useState(false);

  const isHindi = lang === 'hi';

  const shareText = isHindi ? lens.whatsappShareText : `*🇮🇳 JANTAX PIN HISAB: ${pinCode} (${locality})*\n*Topic:* ${lens.title}\n*Named Entity:* ${lens.noun}\n\n🏛️ *Official Line:* ${lens.officialClaim}\n🔍 *CAG / Ground Reality:* ${lens.auditReality}\n📅 *As Of:* ${lens.asOfDate} • *Source:* ${lens.source}\n🔗 *Full Audit:* https://jantax.in/pin/${pinCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 18,
        border: '2px solid var(--brand-ink)',
        boxShadow: '0 12px 36px rgba(15,45,89,0.12)',
        overflow: 'hidden',
        marginBottom: '1.75rem',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand) 100%)',
          color: 'var(--on-solid)',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              background: 'var(--accent-solid)',
              color: 'var(--on-solid)',
              fontSize: '0.72rem',
              fontWeight: 900,
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              letterSpacing: '0.5px',
            }}
          >
            PIN HISAB {pinCode}
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
            {locality}
          </span>
        </div>

        {/* Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            onClick={() => setLang('hi')}
            style={{
              background: isHindi ? 'var(--surface)' : 'rgba(255,255,255,0.15)',
              color: isHindi ? 'var(--ink)' : 'var(--on-solid)',
              border: 'none',
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            style={{
              background: !isHindi ? 'var(--surface)' : 'rgba(255,255,255,0.15)',
              color: !isHindi ? 'var(--ink)' : 'var(--on-solid)',
              border: 'none',
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* Lens Picker Pills if provided */}
      {availableLenses && availableLenses.length > 1 && onSelectLens && (
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            padding: '0.75rem 1.25rem',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {availableLenses.map((l) => (
            <button
              key={l.id}
              onClick={() => onSelectLens(l.id)}
              style={{
                background: l.id === lens.id ? 'var(--brand)' : 'var(--surface)',
                color: l.id === lens.id ? 'var(--on-solid)' : 'var(--ink-2)',
                border: '1px solid var(--border-strong)',
                padding: '0.35rem 0.75rem',
                borderRadius: 999,
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isHindi ? l.titleHi.split(' ')[0] : l.type}: {l.noun.split('-')[0].substring(0, 18)}…
            </button>
          ))}
        </div>
      )}

      {/* Main Juxtaposition Box */}
      <div style={{ padding: '1.5rem' }}>
        {/* Noun Tag */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
            {isHindi ? 'चिह्नित जवाबदेह निकाय (Named Entity)' : 'Accountable Named Entity'}
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0.15rem 0 0' }}>
            {lens.noun}
          </h3>
        </div>

        {/* Dual Side-by-Side Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Card 1: Official Claim */}
          <div
            style={{
              background: 'var(--good-soft)',
              border: '1.5px solid var(--good-line)',
              borderRadius: 12,
              padding: '1.2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--good)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <span>🏛️ {isHindi ? 'सरकारी पोर्टल दावा' : 'Official Portal Claim'}</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--good)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              {isHindi ? lens.officialClaimHi : lens.officialClaim}
            </p>
          </div>

          {/* Card 2: Ground Audit / Reality */}
          <div
            style={{
              background: 'var(--bad-soft)',
              border: '1.5px solid var(--bad-line)',
              borderRadius: 12,
              padding: '1.2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--bad)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <span>🔍 {isHindi ? 'कैग / धरातल हकीकत' : 'CAG / Ground Audit Reality'}</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--bad)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              {isHindi ? lens.auditRealityHi : lens.auditReality}
            </p>
          </div>
        </div>

        {/* Provenance Footer Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            fontSize: '0.75rem',
            color: 'var(--ink-3)',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <strong>{isHindi ? 'स्थिति (as_of):' : 'As Of:'}</strong> {lens.asOfDate} • <strong>{isHindi ? 'स्रोत:' : 'Source:'}</strong> {lens.source}
          </div>
          <span
            style={{
              background: 'var(--brand)',
              color: 'var(--on-solid)',
              padding: '0.15rem 0.5rem',
              borderRadius: 4,
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          >
            {lens.confidenceBadge}
          </span>
        </div>

        {/* WhatsApp 1-Click Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              flex: 1,
              minWidth: 200,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#25D366',
              color: 'var(--on-solid)',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,211,102,0.28)',
            }}
          >
            <Share2 size={18} />
            {isHindi ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}
          </button>

          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: copied ? 'var(--good-solid)' : 'var(--brand)',
              color: 'var(--on-solid)',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? (isHindi ? 'टेक्स्ट कॉपी हो गया!' : 'Text Copied!') : (isHindi ? 'कार्ड टेक्स्ट कॉपी करें' : 'Copy Card Text')}
          </button>
        </div>
      </div>
    </div>
  );
}
