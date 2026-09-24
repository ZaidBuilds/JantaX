import React, { useState, useMemo } from 'react';
import { 
  getLiquidatedDamagesLedger, 
  getLedgerSummaryMetrics, 
  LiquidatedDamageEntry 
} from '../services/liquidatedDamagesService';
import { 
  Scale, 
  AlertTriangle, 
  Clock, 
  IndianRupee, 
  Building2, 
  FileText, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Download,
  Gavel
} from 'lucide-react';

export const ContractorDamagesLedger: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedNoticeId, setCopiedNoticeId] = useState<string | null>(null);

  const metrics = useMemo(() => getLedgerSummaryMetrics(), []);

  const entries = useMemo(() => {
    return getLiquidatedDamagesLedger({
      query,
      state: selectedState,
      recoveryStatus: selectedStatus
    });
  }, [query, selectedState, selectedStatus]);

  const handleCopyDemandNotice = (entry: LiquidatedDamageEntry) => {
    const demandText = `DEMAND FOR ENFORCEMENT OF LIQUIDATED DAMAGES
Under CPWD Works Manual Clause 2 / IRC SP:98
-----------------------------------------------------------
Public Authority: ${entry.department}
Issuing Officer: ${entry.issuingOfficer}
Contractor: ${entry.contractorName} (CIN: ${entry.cinNumber})
Work Order No: ${entry.workOrderNumber}
Project: ${entry.projectName} (PIN: ${entry.pinCode})
Sanctioned Value: ₹${entry.sanctionedBudgetCr} Crore
Scheduled Target: ${entry.scheduledCompletionDate}
Actual Delay: ${entry.delayDays} Days
Accrued Delay Damages: ₹${entry.accruedDamagesLakhs} Lakhs (Statutory Cap 10%)
Current Status: ${entry.recoveryStatus}

NOTICE IS HEREBY SERVED: As per statutory norms, the above accrued liquidated damages must be withheld from pending running bills or recovered through bank guarantees within 30 days.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(demandText);
      setCopiedNoticeId(entry.id);
      setTimeout(() => setCopiedNoticeId(null), 3000);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      
      {/* Top Banner Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: 18,
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(15,23,42,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{
            background: 'rgba(239,68,68,0.25)',
            border: '1px solid rgba(248,113,113,0.4)',
            color: '#fca5a5',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Gavel size={12} /> STATUTORY PENALTY RECOVERY
          </span>
          <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
            CPWD Works Manual Clause 2 & IRC:SP:84-2019
          </span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.2rem 0 0.5rem', color: '#ffffff' }}>
          Contractor Liquidated Damages & Default Arrears Ledger
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0, maxWidth: 800, lineHeight: 1.5 }}>
          When public infrastructure projects breach contract timelines or fail DLP defect remediation, contractors incur statutory liquidated damages up to 10% of total awarded budget. JantaX indexes public default arrears for taxpayer accountability.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Accrued Delay Damages
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', margin: '0.2rem 0' }}>
            ₹{metrics.totalAccruedDamagesCr} Cr
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Across {metrics.totalOverdueProjects} Overdue Public Contracts
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Withheld / Deducted from Bills
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', margin: '0.2rem 0' }}>
            ₹{metrics.totalDeductedCr} Cr
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            ✓ Successfully Secured by Exchequers
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Public Recovery
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', margin: '0.2rem 0' }}>
            ₹{metrics.pendingExchequerRecoveryCr} Cr
          </div>
          <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>
            ⚠️ Actionable Recovery Arrears
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Disputed in Arbitration
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', margin: '0.2rem 0' }}>
            {metrics.arbitrationDisputedCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Contractor Appealed Penalty
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search contractor, project name, work order, or PIN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff' }}
          >
            <option value="All">All States</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Bihar">Bihar</option>
            <option value="Assam">Assam</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff' }}
          >
            <option value="All">All Recovery Statuses</option>
            <option value="Pending Recovery">Pending Recovery</option>
            <option value="Deducted from Running Bill">Deducted from Running Bill</option>
            <option value="Recovery Notice Served">Recovery Notice Served</option>
            <option value="Disputed in Arbitration">Disputed in Arbitration</option>
          </select>
        </div>
      </div>

      {/* Ledger Records Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Contractor & CIN</th>
                <th style={{ padding: '0.85rem 1rem' }}>Work Order & Project</th>
                <th style={{ padding: '0.85rem 1rem' }}>Delay</th>
                <th style={{ padding: '0.85rem 1rem' }}>Accrued Damages</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  {/* Contractor */}
                  <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                      {item.contractorName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                      CIN: {item.cinNumber}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb', marginTop: '0.2rem' }}>
                      PIN: {item.pinCode} · {item.state}
                    </div>
                  </td>

                  {/* Project */}
                  <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: 300 }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.84rem' }}>
                      {item.projectName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Order: <strong>{item.workOrderNumber}</strong> · Value: ₹{item.sanctionedBudgetCr} Cr
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.15rem' }}>
                      {item.department}
                    </div>
                  </td>

                  {/* Delay */}
                  <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                    <span style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Clock size={12} /> {item.delayDays} Days
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
                      Target: {item.scheduledCompletionDate}
                    </div>
                  </td>

                  {/* Accrued Damages */}
                  <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 900, color: '#dc2626', fontSize: '1rem' }}>
                      ₹{item.accruedDamagesLakhs} L
                    </div>
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 4
                    }}>
                      10% Contract Cap Max
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {item.clauseReference}
                    </div>
                  </td>

                  {/* Recovery Status */}
                  <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                    <span style={{
                      background: item.recoveryStatus === 'Deducted from Running Bill' ? '#dcfce7' : item.recoveryStatus === 'Disputed in Arbitration' ? '#ede9fe' : item.recoveryStatus === 'Recovery Notice Served' ? '#fee2e2' : '#fef3c7',
                      color: item.recoveryStatus === 'Deducted from Running Bill' ? '#166534' : item.recoveryStatus === 'Disputed in Arbitration' ? '#6b21a8' : item.recoveryStatus === 'Recovery Notice Served' ? '#991b1b' : '#92400e',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'inline-block'
                    }}>
                      {item.recoveryStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                    <button
                      onClick={() => handleCopyDemandNotice(item)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 8,
                        background: '#1e293b',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FileText size={12} />
                      {copiedNoticeId === item.id ? 'Notice Copied!' : 'Demand Notice'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
