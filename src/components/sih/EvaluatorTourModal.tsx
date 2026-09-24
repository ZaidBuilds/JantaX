import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Building2,
  CheckCircle2,
  Scale,
  Camera,
  Play
} from 'lucide-react';

interface EvaluatorTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluatorTourModal: React.FC<EvaluatorTourModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentBeat, setCurrentBeat] = useState<1 | 2 | 3 | 4>(1);

  if (!isOpen) return null;

  const handleLaunchLive = () => {
    onClose();
    navigate('/pin/250001');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        maxWidth: 750,
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        
        {/* Modal Top Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '1.25rem 1.75rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: '#f97316',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.05em'
            }}>
              SIH 2026 JURY DEMO
            </span>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
              2-Minute Trojan Horse Interactive Walkthrough
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          padding: '0.75rem 1.5rem',
          gap: '0.5rem'
        }}>
          {[
            { num: 1, title: '1. Official Claim', icon: Building2 },
            { num: 2, title: '2. Ground Reality', icon: Camera },
            { num: 3, title: '3. Algorithmic Contrast', icon: Scale },
            { num: 4, title: '4. Statutory Remedy', icon: FileText },
          ].map(beat => {
            const Icon = beat.icon;
            const isActive = currentBeat === beat.num;
            const isCompleted = currentBeat > beat.num;
            return (
              <button
                key={beat.num}
                onClick={() => setCurrentBeat(beat.num as any)}
                style={{
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  padding: '0.45rem 0.5rem',
                  borderRadius: 8,
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  borderBottom: isActive ? '2.5px solid #f97316' : '2.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0f172a' : isCompleted ? '#10b981' : '#64748b'
                }}
              >
                <Icon size={14} style={{ color: isActive ? '#f97316' : isCompleted ? '#10b981' : '#94a3b8' }} />
                <span>{beat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Beat Content Area */}
        <div style={{ padding: '2rem', minHeight: 340 }}>
          
          {/* BEAT 1: The Official Claim */}
          {currentBeat === 1 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 800, fontSize: '0.78rem' }}>
                <CheckCircle2 size={16} /> BEAT 1: WHAT GOVERNMENT PORTALS CLAIM (THE AUDIT BASELINE)
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Test Case: PIN 250001 (Meerut District, Uttar Pradesh)
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Under official UDISE+ and PMGSY public databases, the locality is recorded with near-perfect compliance metrics:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>UDISE+ EDUCATION REGISTRY:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>100% Functional Toilets</div>
                  <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '0.2rem' }}>PTR: 24:1 (Well within RTE Act mandated 30:1)</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>PMGSY RURAL ROAD PACKAGE:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>₹4.8 Cr Sanctioned</div>
                  <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '0.2rem' }}>Official Status: "100% Physically Completed"</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.78rem', color: '#64748b' }}>
                💡 <strong>The Hackathon Problem:</strong> If citizens only see official dashboards, they see a utopian picture. There is zero friction or accountability.
              </div>
            </div>
          )}

          {/* BEAT 2: Ground Reality */}
          {currentBeat === 2 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c2410c', fontWeight: 800, fontSize: '0.78rem' }}>
                <Camera size={16} /> BEAT 2: WHAT CITIZENS ACTUALLY EXPERIENCE (EXIF GEOFENCED)
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                In-Browser EXIF GPS Verified Ground Truth
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Parents and commuters on the ground capture evidence using their smartphones. JantaX’s client-side EXIF engine verifies sub-metre coordinates without sending unvetted data to the server:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b' }}>GROUND CHECK-IN (SCHOOL):</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', marginTop: '0.2rem' }}>Toilets Permanently Padlocked</div>
                  <div style={{ fontSize: '0.74rem', color: '#7f1d1d', marginTop: '0.2rem' }}>EXIF: 28.9845°N, 77.7064°E (Within 35m)</div>
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b' }}>GROUND AUDIT (PWD ROAD):</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', marginTop: '0.2rem' }}>Severe Bitumen Cavities</div>
                  <div style={{ fontSize: '0.74rem', color: '#7f1d1d', marginTop: '0.2rem' }}>55% Monsoon Failure Rate during DLP</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.78rem', color: '#64748b' }}>
                🛡️ <strong>Anti-Spam Sybil Guard:</strong> SHA-256 evidence hashing + Phone OTP attestation eliminates political trolls and malicious competitors.
              </div>
            </div>
          )}

          {/* BEAT 3: Algorithmic Contrast */}
          {currentBeat === 3 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 800, fontSize: '0.78rem' }}>
                <Scale size={16} /> BEAT 3: THE CIVIC HEALTH INDEX DELTA
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Algorithmic Discrepancy & Contractor Ledger
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Instead of simple complaints, JantaX feeds ground audits into the Locality Health Algorithm:
              </p>

              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 12, padding: '1.25rem', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Civic Health Index (PIN 250001):</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444' }}>41 / 100</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '41%', height: '100%', background: '#ef4444', borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  <span>Official Claim Index: 92%</span>
                  <span>Discrepancy Delta: -51 Points</span>
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.78rem', color: '#92400e' }}>
                ⚠️ <strong>Contractor Accountability:</strong> Empanelled contractor flagged as <code>CRITICAL_RISK</code> (Monsoon Failure Rate: 58%, 3 active DLP show-causes).
              </div>
            </div>
          )}

          {/* BEAT 4: Statutory Legal Remedy */}
          {currentBeat === 4 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4338ca', fontWeight: 800, fontSize: '0.78rem' }}>
                <FileText size={16} /> BEAT 4: CLOSED-LOOP REMEDY & STATUTORY SLA
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Statutory RTI & CPGRAMS Dispatch
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                JantaX does not stop at data visualization. It arms citizens with automated, legally valid statutory instruments:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>1-CLICK SECTION 6(1) RTI:</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>Draft Pre-Formatted for DM</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Cites UDISE+ toilet claims & expenditure ledger</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>30-DAY STATUTORY SLA CLOCK:</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f97316', marginTop: '0.2rem' }}>Public Tracking URL</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Auto-generates Section 19(1) First Appeal if breached</div>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.78rem', color: '#065f46', fontWeight: 600 }}>
                🏆 <strong>Why JantaX Wins:</strong> We solve Ministry of Education (UDISE+ audits) with vertical depth, then pivot to show rural roads (MoRD) and CPGRAMS (DARPG) on the exact same Locality OS engine.
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Controls */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {currentBeat > 1 ? (
              <button
                onClick={() => setCurrentBeat((currentBeat - 1) as any)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <ArrowLeft size={14} /> Previous Beat
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Beat 1 of 4</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            {currentBeat < 4 ? (
              <button
                onClick={() => setCurrentBeat((currentBeat + 1) as any)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 8,
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                Next Beat <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleLaunchLive}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: 8,
                  background: 'var(--gradient-accent)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(249,115,22,0.35)'
                }}
              >
                <Play size={15} /> Launch Live in Locality OS (PIN 250001) →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EvaluatorTourModal;
