import React from 'react';
import type { InfraProject } from '../types/projectInfra';
import { 
  IndianRupee, 
  FileText, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  Building
} from 'lucide-react';

interface ProjectFinancialsTabProps {
  project: InfraProject;
}

export const ProjectFinancialsTab: React.FC<ProjectFinancialsTabProps> = ({ project }) => {
  const origCr = (project.budgetOriginalLakhs / 100).toFixed(2);
  const antCr = (project.budgetAnticipatedLakhs / 100).toFixed(2);
  const origContractCr = (project.contractValueOriginalLakhs / 100).toFixed(2);
  const revContractCr = (project.contractValueRevisedLakhs / 100).toFixed(2);
  const expCr = (project.expenditureToDateLakhs / 100).toFixed(2);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Budget & Contract Ledger Overview */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IndianRupee size={18} style={{ color: '#10b981' }} /> Contract Values & Expenditure Ledger
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Original Sanctioned Budget</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>₹{origCr} Cr</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Government Sanction Note</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Revised / Anticipated Cost</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f97316', marginTop: '0.2rem' }}>₹{antCr} Cr</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Includes scope variations</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Original Contract Value</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b', marginTop: '0.2rem' }}>₹{origContractCr} Cr</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Awarded to {project.leadContractor}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Expenditure Disbursed To Date</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>₹{expCr} Cr</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{project.progressFinancial}% of anticipated budget</div>
          </div>
        </div>
      </div>

      {/* Tenders Section */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} style={{ color: '#2563eb' }} /> Tenders Issued ({project.tenders.length})
        </h3>

        {project.tenders.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: '#64748b' }}>No public tender records found.</div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {project.tenders.map((tnd) => (
              <div
                key={tnd.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '1rem 1.15rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Ref #{tnd.tenderNumber} · {tnd.publishingPortal}
                    </span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.3rem' }}>
                      {tnd.title}
                    </h4>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2d59', background: '#eff6ff', padding: '0.3rem 0.7rem', borderRadius: 8 }}>
                    Est. ₹{(tnd.estimatedCostLakhs / 100).toFixed(2)} Cr
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                    Issue Date: {tnd.issueDate} · Closing Date: {tnd.closingDate}
                  </div>
                  <a
                    href={tnd.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    View Tender Notice ({tnd.sourceTitle}) <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Orders Section */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} style={{ color: '#f97316' }} /> Work Orders Executed ({project.workOrders.length})
        </h3>

        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {project.workOrders.map((wo) => (
            <div
              key={wo.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1rem 1.15rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    WO #{wo.workOrderNumber} · Signed by {wo.signingAuthority}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.3rem' }}>
                    Awarded to: {wo.awardedContractor}
                  </h4>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '0.3rem 0.7rem', borderRadius: 8 }}>
                  Award Value: ₹{(wo.awardedValueLakhs / 100).toFixed(2)} Cr
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                  Issued Date: {wo.issueDate}
                </div>
                <a
                  href={wo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  Work Order Gazette Entry ({wo.sourceTitle}) <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Payment Disbursements */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={18} style={{ color: '#8b5cf6' }} /> Public Payment Releases (PFMS & Treasury Logs)
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 0, marginBottom: '1.25rem' }}>
          Publicly/legally available payment disbursements released to contractors upon milestone verification.
        </p>

        {project.payments.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: '#64748b' }}>No public payment records published yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {project.payments.map((pay) => (
              <div
                key={pay.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '1rem 1.15rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Disbursed on {pay.disbursementDate}
                    </span>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.3rem' }}>
                      Milestone: {pay.milestone}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{(pay.amountLakhs / 100).toFixed(2)} Cr
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: pay.paymentStatus === 'Disbursed' ? '#047857' : '#b45309',
                      background: pay.paymentStatus === 'Disbursed' ? '#ecfdf5' : '#fffbebf',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 4,
                      display: 'inline-block',
                      marginTop: '0.2rem'
                    }}>
                      Status: {pay.paymentStatus}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
                  <a
                    href={pay.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    PFMS Verification Link ({pay.sourceTitle}) <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
