import React from 'react';
import { 
  X, 
  AlertTriangle, 
  FileSpreadsheet, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { Contractor, WorkOrder, RoadDefectReport } from '../types';

interface ContractorModalProps {
  contractor: Contractor | null;
  workOrders: WorkOrder[];
  defects: RoadDefectReport[];
  onClose: () => void;
  onGenerateAction: (contractor: Contractor) => void;
}

export const ContractorModal: React.FC<ContractorModalProps> = ({
  contractor,
  workOrders,
  defects,
  onClose,
  onGenerateAction,
}) => {
  if (!contractor) return null;

  const contractorWorkOrders = workOrders.filter(w => w.contractorId === contractor.id);
  const contractorDefects = defects.filter(d => d.contractorId === contractor.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-2 border-[#1A1A1A] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b-2 border-[#1A1A1A] flex items-start justify-between bg-[#FAFAFA]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                Audited Contractor Profile
              </span>
              <span className="font-mono text-xs font-bold text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5">
                {contractor.registrationNumber}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] mt-1">
              {contractor.name}
            </h2>
            <p className="text-xs font-serif text-[#1A1A1A]/70 mt-1 flex flex-wrap items-center gap-2">
              <span>{contractor.class}</span>
              <span>•</span>
              <span>Registered in {contractor.registeredCity}</span>
              <span>•</span>
              <span>Directors: {contractor.directors.join(', ')}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-[#FAFAFA] p-3.5 border-2 border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/70 block">
                Integrity Score
              </span>
              <span className={`text-2xl sm:text-3xl font-black font-mono ${
                contractor.integrityScore < 40 ? 'text-[#D43F33]' : contractor.integrityScore < 70 ? 'text-[#1A1A1A]' : 'text-emerald-800'
              }`}>
                {contractor.integrityScore}/100
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 block">{contractor.riskTier.replace('_', ' ')}</span>
            </div>

            <div className="bg-[#FAFAFA] p-3.5 border-2 border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/70 block">
                Monsoon Failure Rate
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#D43F33]">
                {contractor.monsoonFailureRate}%
              </span>
              <span className="text-[10px] font-mono text-[#1A1A1A]/60 block">Breakdown in {contractor.avgPotholeAppearanceMonths} mo</span>
            </div>

            <div className="bg-[#FAFAFA] p-3.5 border-2 border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/70 block">
                Active DLP Violations
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#D43F33]">
                {contractor.activeDlpViolationsCount}
              </span>
              <span className="text-[10px] font-mono text-[#1A1A1A]/60 block">Of {contractor.activeDlpRoadsCount} protected roads</span>
            </div>

            <div className="bg-[#FAFAFA] p-3.5 border-2 border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/70 block">
                Public Funds Won
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#1A1A1A]">
                ₹{contractor.totalContractsValueCrores} Cr
              </span>
              <span className="text-[10px] font-mono text-[#1A1A1A]/60 block">{contractor.totalRoadLengthKm} km built</span>
            </div>

          </div>

          {/* Historical Notices & Penalties */}
          {contractor.notices.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D43F33]" />
                <span>Statutory Notices, Fines & Vigilance Records ({contractor.notices.length})</span>
              </h4>
              <div className="space-y-2">
                {contractor.notices.map((n) => (
                  <div key={n.id} className="p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#D43F33]">{n.title}</span>
                      <span className="text-[10px] font-mono text-[#1A1A1A]/70">{n.date}</span>
                    </div>
                    <p className="text-xs font-serif text-[#1A1A1A] mt-1">{n.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono border-t border-[#1A1A1A]/10 pt-1.5">
                      <span className="opacity-70">Issued by: <strong className="text-[#1A1A1A]">{n.authority}</strong></span>
                      {n.penaltyAmountLakhs && (
                        <span className="text-[#D43F33] font-bold">Fine: ₹{n.penaltyAmountLakhs} Lakhs</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awarded Municipal Work Orders Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#1A1A1A]" />
                <span>Audited Work Orders & DLP Status ({contractorWorkOrders.length})</span>
              </span>
              <span className="text-[10px] font-mono opacity-60 font-normal">State e-Procurement Verified</span>
            </h4>

            <div className="border-2 border-[#1A1A1A] overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#FAFAFA] text-[10px] uppercase font-mono font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A]">
                  <tr>
                    <th className="p-3">Work Order</th>
                    <th className="p-3">Road Name & Ward</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Bitumen Grade</th>
                    <th className="p-3">DLP Expiry</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 bg-white font-mono">
                  {contractorWorkOrders.map((wo) => {
                    const isBreach = wo.dlpStatus === 'DLP_BREACH_UNRESOLVED';
                    return (
                      <tr key={wo.id} className="hover:bg-black/5">
                        <td className="p-3 font-bold text-[#1A1A1A]">
                          {wo.tenderNumber}
                        </td>
                        <td className="p-3 font-sans">
                          <p className="font-bold text-[#1A1A1A] uppercase">{wo.roadName}</p>
                          <p className="text-[10px] font-mono opacity-70">{wo.wardName}</p>
                        </td>
                        <td className="p-3 font-bold text-[#1A1A1A]">
                          ₹{wo.sanctionedAmountLakhs} L
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-[#FAFAFA] border border-[#1A1A1A] text-[10px] font-bold">
                            {wo.specifications.bitumenGrade} ({wo.specifications.thicknessMm}mm)
                          </span>
                        </td>
                        <td className="p-3 text-[11px]">
                          {wo.dlpExpiryDate}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            isBreach ? 'bg-[#D43F33] text-white border-[#D43F33]' : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          }`}>
                            {isBreach ? `${wo.activeFailuresCount} DLP Violations` : 'Protected'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Citizen Failure Reports on this Contractor */}
          {contractorDefects.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#D43F33]" />
                <span>Citizen Verified Road Failures ({contractorDefects.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contractorDefects.map((d) => (
                  <div key={d.id} className="p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A] flex gap-3">
                    <img 
                      src={d.photoUrl} 
                      alt="Defect" 
                      className="w-16 h-16 object-cover border-2 border-[#1A1A1A] shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase truncate">{d.defectType}</span>
                        <span className="text-[10px] text-[#D43F33] font-mono font-bold uppercase">{d.severity}</span>
                      </div>
                      <p className="text-[11px] font-serif text-[#1A1A1A]/80 line-clamp-2 mt-1">{d.description}</p>
                      <p className="text-[10px] font-mono text-[#1A1A1A]/60 mt-1">Reported by {d.reporterName} • {d.citizenUpvotes} citizen verifications</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t-2 border-[#1A1A1A] bg-[#FAFAFA] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-black/5 text-xs font-bold uppercase text-[#1A1A1A] border-2 border-[#1A1A1A] transition-colors"
          >
            Close Dossier
          </button>

          <button
            onClick={() => {
              onClose();
              onGenerateAction(contractor);
            }}
            className="inline-flex items-center space-x-2 bg-[#D43F33] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-tight px-4 py-2 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Generate 1-Click Action & RTI Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
