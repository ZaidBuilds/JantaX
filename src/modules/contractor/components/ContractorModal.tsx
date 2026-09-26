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
      <div className="bg-surface border rounded-[10px] border-line max-w-4xl w-full max-h-[90vh] flex flex-col shadow-lg overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-line flex items-start justify-between bg-surface-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[var(--surface-inverse)] text-white px-2 py-0.5 text-xs font-bold">
                Audited Contractor Profile
              </span>
              <span className="text-xs font-bold text-ink border rounded-[10px] border-line px-2 py-0.5">
                {contractor.registrationNumber}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
              {contractor.name}
            </h2>
            <p className="text-xs text-ink-3 mt-1 flex flex-wrap items-center gap-2">
              <span>{contractor.class}</span>
              <span>•</span>
              <span>Registered in {contractor.registeredCity}</span>
              <span>•</span>
              <span>Directors: {contractor.directors.join(', ')}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border rounded-[10px] border-line text-ink hover:bg-[var(--surface-inverse)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-surface-2 p-3.5 border rounded-[10px] border-line">
              <span className="text-xs font-bold text-ink-3 block">
                Integrity Score
              </span>
              <span className={`text-2xl sm:text-3xl font-bold ${
 contractor.integrityScore < 40 ? 'text-[var(--bad)]' : contractor.integrityScore < 70 ? 'text-ink' : 'text-good'
 }`}>
                {contractor.integrityScore}/100
              </span>
              <span className="text-xs font-bold text-ink-3 block">{contractor.riskTier.replace('_', ' ')}</span>
            </div>

            <div className="bg-surface-2 p-3.5 border rounded-[10px] border-line">
              <span className="text-xs font-bold text-ink-3 block">
                Monsoon Failure Rate
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-bad">
                {contractor.monsoonFailureRate}%
              </span>
              <span className="text-xs text-ink-3 block">Breakdown in {contractor.avgPotholeAppearanceMonths} mo</span>
            </div>

            <div className="bg-surface-2 p-3.5 border rounded-[10px] border-line">
              <span className="text-xs font-bold text-ink-3 block">
                Active DLP Violations
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-bad">
                {contractor.activeDlpViolationsCount}
              </span>
              <span className="text-xs text-ink-3 block">Of {contractor.activeDlpRoadsCount} protected roads</span>
            </div>

            <div className="bg-surface-2 p-3.5 border rounded-[10px] border-line">
              <span className="text-xs font-bold text-ink-3 block">
                Public Funds Won
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-ink">
                ₹{contractor.totalContractsValueCrores} Cr
              </span>
              <span className="text-xs text-ink-3 block">{contractor.totalRoadLengthKm} km built</span>
            </div>

          </div>

          {/* Historical Notices & Penalties */}
          {contractor.notices.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-bad" />
                <span>Statutory Notices, Fines & Vigilance Records ({contractor.notices.length})</span>
              </h4>
              <div className="space-y-2">
                {contractor.notices.map((n) => (
                  <div key={n.id} className="p-3 bg-surface-2 border rounded-[10px] border-line">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-bad">{n.title}</span>
                      <span className="text-xs text-ink-3">{n.date}</span>
                    </div>
                    <p className="text-xs text-ink mt-1">{n.description}</p>
                    <div className="mt-2 flex items-center justify-between text-xs border-t border-line pt-1.5">
                      <span className="opacity-70">Issued by: <strong className="text-ink">{n.authority}</strong></span>
                      {n.penaltyAmountLakhs && (
                        <span className="text-bad font-bold">Fine: ₹{n.penaltyAmountLakhs} Lakhs</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awarded Municipal Work Orders Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-ink flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-ink" />
                <span>Audited Work Orders & DLP Status ({contractorWorkOrders.length})</span>
              </span>
              <span className="text-xs opacity-60 font-normal">State e-Procurement Verified</span>
            </h4>

            <div className="border rounded-[10px] border-line overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead className="bg-surface-2 text-xs font-bold text-ink border-b border-line">
                  <tr>
                    <th className="p-3">Work Order</th>
                    <th className="p-3">Road Name & Ward</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Bitumen Grade</th>
                    <th className="p-3">DLP Expiry</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 bg-surface">
                  {contractorWorkOrders.map((wo) => {
                    const isBreach = wo.dlpStatus === 'DLP_BREACH_UNRESOLVED';
                    return (
                      <tr key={wo.id} className="hover:bg-surface-3">
                        <td className="p-3 font-bold text-ink">
                          {wo.tenderNumber}
                        </td>
                        <td className="p-3 font-sans">
                          <p className="font-bold text-ink">{wo.roadName}</p>
                          <p className="text-xs opacity-70">{wo.wardName}</p>
                        </td>
                        <td className="p-3 font-bold text-ink">
                          ₹{wo.sanctionedAmountLakhs} L
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-surface-2 border rounded-[10px] border-line text-xs font-bold">
                            {wo.specifications.bitumenGrade} ({wo.specifications.thicknessMm}mm)
                          </span>
                        </td>
                        <td className="p-3 text-xs">
                          {wo.dlpExpiryDate}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-xs font-bold border rounded-[10px] ${
 isBreach ? 'bg-[var(--bad)] text-white border-[var(--bad)]' : 'bg-[var(--surface-inverse)] text-white border-line'
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
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-bad" />
                <span>Citizen Verified Road Failures ({contractorDefects.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contractorDefects.map((d) => (
                  <div key={d.id} className="p-3 bg-surface-2 border rounded-[10px] border-line flex gap-3">
                    <img 
                      src={d.photoUrl} 
                      alt="Defect" 
                      className="w-16 h-16 object-cover border rounded-[10px] border-line shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink truncate">{d.defectType}</span>
                        <span className="text-xs text-bad font-bold">{d.severity}</span>
                      </div>
                      <p className="text-xs text-ink-2 line-clamp-2 mt-1">{d.description}</p>
                      <p className="text-xs text-ink-3 mt-1">Reported by {d.reporterName} • {d.citizenUpvotes} citizen verifications</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface hover:bg-surface-3 text-xs font-bold text-ink border rounded-[10px] border-line transition-colors"
          >
            Close Dossier
          </button>

          <button
            onClick={() => {
              onClose();
              onGenerateAction(contractor);
            }}
            className="inline-flex items-center space-x-2 bg-[var(--bad-solid)] hover:bg-[var(--surface-inverse)] text-white text-xs font-bold tracking-tight px-4 py-2 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Generate 1-Click Action & RTI Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
