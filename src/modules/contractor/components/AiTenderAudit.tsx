import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  ArrowRight
} from 'lucide-react';
import { WorkOrder, Contractor, AiAuditResponse } from '../types';

interface AiTenderAuditProps {
  workOrders: WorkOrder[];
  contractors: Contractor[];
  onSelectContractorForAction: (contractor: Contractor) => void;
}

export const AiTenderAudit: React.FC<AiTenderAuditProps> = ({
  workOrders,
  contractors,
  onSelectContractorForAction,
}) => {
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>(workOrders[0]?.id || 'wo-101');
  const [customText] = useState<string>('');
  const [auditResult, setAuditResult] = useState<AiAuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedWo = workOrders.find(w => w.id === selectedWorkOrderId) || workOrders[0];
  const selectedCont = contractors.find(c => c.id === selectedWo?.contractorId);

  const handleRunAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/audit-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workOrderId: selectedWorkOrderId,
          contractorId: selectedWo?.contractorId,
          tenderText: customText || selectedWo?.title,
        }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">
                Gemini 3.7 Flash Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
              AI Tender Forensic Audit & Compliance
            </h2>
            <p className="text-xs font-serif text-[#1A1A1A]/70 mt-0.5">
              Scans municipal tenders for substandard bitumen specifications, abbreviated DLP warranty clauses, and single-bid cartel markers against IRC:SP:98 benchmarks.
            </p>
          </div>
        </div>

        {/* Input Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5 pt-4 border-t border-black/10">
          
          <div className="md:col-span-8">
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A] block mb-1.5">
              Select Audited Work Order / Tender:
            </label>
            <select
              value={selectedWorkOrderId}
              onChange={(e) => setSelectedWorkOrderId(e.target.value)}
              className="w-full bg-[#FAFAFA] border-2 border-[#1A1A1A] px-3 py-2 text-xs font-bold uppercase text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.tenderNumber} • {wo.roadName} (₹{wo.sanctionedAmountLakhs}L • {wo.contractorName})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-end">
            <button
              onClick={handleRunAudit}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#D43F33] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-tight px-4 py-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Auditing Tender Specs...' : 'Run Forensic AI Audit'}</span>
            </button>
          </div>

        </div>

        {/* Work Order Preview Card */}
        {selectedWo && (
          <div className="mt-4 p-3.5 bg-[#FAFAFA] border-2 border-[#1A1A1A] text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#1A1A1A] font-mono">
            <div>
              <span className="text-[10px] opacity-60 block uppercase font-bold">Contractor</span>
              <strong className="text-sm font-black uppercase text-[#1A1A1A]">{selectedWo.contractorName}</strong>
            </div>
            <div>
              <span className="text-[10px] opacity-60 block uppercase font-bold">Sanctioned Cost</span>
              <strong className="text-sm font-bold text-[#1A1A1A]">₹{selectedWo.sanctionedAmountLakhs} Lakhs</strong>
            </div>
            <div>
              <span className="text-[10px] opacity-60 block uppercase font-bold">Bitumen Grade</span>
              <strong className="text-sm font-bold text-[#D43F33]">{selectedWo.specifications.bitumenGrade} ({selectedWo.specifications.thicknessMm}mm)</strong>
            </div>
            <div>
              <span className="text-[10px] opacity-60 block uppercase font-bold">Warranty Period</span>
              <strong className="text-sm font-bold text-[#1A1A1A]">{selectedWo.specifications.sanctionedWarrantyMonths} Months</strong>
            </div>
          </div>
        )}
      </div>

      {/* Audit Findings Container */}
      {auditResult && (
        <div className="space-y-4">
          
          {/* Executive Verdict Banner */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D43F33] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Forensic Quality & Compliance Verdict
                </span>
                <p className="text-sm font-serif font-medium text-[#1A1A1A] mt-1.5 max-w-3xl leading-relaxed">
                  {auditResult.overallVerdict}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 bg-[#FAFAFA] p-3.5 border-2 border-[#1A1A1A]">
                <div className="text-center font-mono">
                  <span className="text-[9px] uppercase tracking-wider opacity-60 block font-bold">
                    Risk Score
                  </span>
                  <span className="text-3xl font-black text-[#D43F33]">
                    {auditResult.riskScore}/100
                  </span>
                </div>
                {auditResult.estimatedPublicLossLakhs && (
                  <div className="text-center border-l-2 border-[#1A1A1A] pl-3.5 font-mono">
                    <span className="text-[9px] uppercase tracking-wider opacity-60 block font-bold">
                      Est. Taxpayer Loss
                    </span>
                    <span className="text-xl font-bold text-[#1A1A1A]">
                      ₹{auditResult.estimatedPublicLossLakhs} L
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Red Flags & Clause Breaches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Red Flags List */}
            <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D43F33] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Detected Red Flags & Technical Deviations ({auditResult.redFlags.length})</span>
              </h3>

              <div className="space-y-3">
                {auditResult.redFlags.map((flag, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAFAFA] border-2 border-[#1A1A1A] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#1A1A1A]">{flag.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
                        flag.severity === 'HIGH' ? 'bg-[#D43F33] text-white' : 'bg-[#1A1A1A] text-white'
                      }`}>
                        {flag.severity} RISK
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#1A1A1A]/80 leading-relaxed">{flag.explanation}</p>
                    {flag.ircClauseViolation && (
                      <div className="pt-1 text-[11px] text-[#D43F33] font-mono font-bold flex items-center gap-1">
                        <span>⚖️ Benchmark:</span>
                        <span>{flag.ircClauseViolation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Violations & Recommended Citizen Actions */}
            <div className="space-y-4">
              
              {/* Statutory Violations */}
              <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5 shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#D43F33]" />
                  <span>Statutory Standards & Mandates Breached</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono text-[#1A1A1A]/90">
                  {auditResult.statutoryViolations.map((v, vIdx) => (
                    <li key={vIdx} className="flex items-start gap-2 bg-[#FAFAFA] p-2.5 border border-[#1A1A1A]">
                      <span className="text-[#D43F33] font-bold shrink-0">•</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Citizen Actions */}
              <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5 shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recommended Citizen Action Pathway</span>
                </h3>
                <ul className="space-y-2 text-xs font-serif text-[#1A1A1A]/90">
                  {auditResult.recommendedCitizenActions.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 bg-[#FAFAFA] p-2.5 border border-[#1A1A1A]">
                      <span className="text-emerald-800 font-bold shrink-0">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                {selectedCont && (
                  <button
                    onClick={() => onSelectContractorForAction(selectedCont)}
                    className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-[#1A1A1A] hover:bg-[#D43F33] text-white text-xs font-bold uppercase tracking-tight px-3 py-2.5 transition-colors"
                  >
                    <span>Proceed to 1-Click RTI & Vigilance Filing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
