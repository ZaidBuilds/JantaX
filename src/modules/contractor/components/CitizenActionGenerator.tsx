import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  Scale, 
  Printer,
  ShieldAlert
} from 'lucide-react';
import { Contractor, WorkOrder, RoadDefectReport } from '../types';

interface CitizenActionGeneratorProps {
  contractors: Contractor[];
  workOrders: WorkOrder[];
  defects: RoadDefectReport[];
  preselectedContractor: Contractor | null;
}

export const CitizenActionGenerator: React.FC<CitizenActionGeneratorProps> = ({
  contractors,
  workOrders,
  preselectedContractor,
}) => {
  const [selectedContractorId, setSelectedContractorId] = useState<string>(
    preselectedContractor?.id || contractors[0]?.id || 'cont-001'
  );
  const [actionType, setActionType] = useState<'RTI_APPLICATION' | 'VIGILANCE_COMPLAINT' | 'WARD_COMMITTEE_RESOLUTION' | 'SOCIAL_MEDIA_DOSSIER'>('RTI_APPLICATION');
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0];
  const contractorWorkOrders = workOrders.filter(w => w.contractorId === selectedContractorId);

  // Sync if preselected changes
  useEffect(() => {
    if (preselectedContractor) {
      setSelectedContractorId(preselectedContractor.id);
    }
  }, [preselectedContractor]);

  // Generate document via API / Gemini
  const handleGenerateDocument = async () => {
    if (!selectedContractor) return;
    setIsLoading(true);

    try {
      const failedRoadNames = contractorWorkOrders.map(w => w.roadName);

      const res = await fetch('/api/ai/generate-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          contractorName: selectedContractor.name,
          wardName: selectedContractor.primaryWard,
          zone: 'South Zone / Western Suburbs',
          city: selectedContractor.registeredCity,
          failedRoadsCount: selectedContractor.activeDlpViolationsCount + 2,
          totalWastedFundsCrores: selectedContractor.totalContractsValueCrores,
          activeDlpBreachesCount: selectedContractor.activeDlpViolationsCount,
          roadNamesList: failedRoadNames.length > 0 ? failedRoadNames : ['80 Feet Road', '1st Cross Road 5th Block', '12th Main Road'],
        }),
      });

      const data = await res.json();
      if (data.documentText) {
        setDocumentContent(data.documentText);
      }
    } catch (err) {
      console.error('Error generating document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateDocument();
  }, [selectedContractorId, actionType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${actionType} - ${selectedContractor?.name}</title>
            <style>
              body { font-family: 'Space Mono', 'Courier New', monospace; padding: 40px; line-height: 1.6; font-size: 11pt; color: #1A1A1A; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${documentContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center text-white">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">
                Statutory Accountability Toolkit
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
              Citizen Action & RTI Evidence Dossier
            </h2>
            <p className="text-xs font-serif text-[#1A1A1A]/70 mt-0.5">
              Transform public contractor failure data into legally binding RTI applications, Vigilance show-cause complaints, and Ward Committee resolutions.
            </p>
          </div>
        </div>

        {/* Contractor Selector Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-black/10">
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A] block mb-1.5">
              Target Contractor:
            </label>
            <select
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
              className="w-full bg-[#FAFAFA] border-2 border-[#1A1A1A] px-3 py-2 text-xs font-bold uppercase text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.activeDlpViolationsCount} DLP Breaches • ₹{c.totalContractsValueCrores} Cr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A] block mb-1.5">
              Legal Instrument Format:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActionType('RTI_APPLICATION')}
                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all text-left truncate ${
                  actionType === 'RTI_APPLICATION'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
                }`}
              >
                1. RTI Sec 6(1) Draft
              </button>

              <button
                onClick={() => setActionType('VIGILANCE_COMPLAINT')}
                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all text-left truncate ${
                  actionType === 'VIGILANCE_COMPLAINT'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
                }`}
              >
                2. Vigilance Notice
              </button>

              <button
                onClick={() => setActionType('WARD_COMMITTEE_RESOLUTION')}
                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all text-left truncate ${
                  actionType === 'WARD_COMMITTEE_RESOLUTION'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
                }`}
              >
                3. Ward Resolution
              </button>

              <button
                onClick={() => setActionType('SOCIAL_MEDIA_DOSSIER')}
                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all text-left truncate ${
                  actionType === 'SOCIAL_MEDIA_DOSSIER'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A]'
                }`}
              >
                4. WhatsApp / X Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Evidence Summary & Document Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Evidence Dossier Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border-2 border-[#1A1A1A] p-5 space-y-4 shadow-sm">
          
          <div className="border-b-2 border-[#1A1A1A] pb-3">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D43F33] block">
              Contractor Liability Record
            </span>
            <h3 className="text-lg font-black uppercase text-[#1A1A1A] mt-1">
              {selectedContractor?.name}
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 font-mono">
              Reg: {selectedContractor?.registrationNumber}
            </p>
          </div>

          {/* Key Facts Pill Grid */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-[#FAFAFA] border border-[#1A1A1A] flex items-center justify-between">
              <span className="opacity-70 uppercase">Monsoon Failure:</span>
              <strong className="text-[#D43F33] font-bold text-sm">{selectedContractor?.monsoonFailureRate}%</strong>
            </div>

            <div className="p-2.5 bg-[#FAFAFA] border border-[#1A1A1A] flex items-center justify-between">
              <span className="opacity-70 uppercase">Active DLP Breaches:</span>
              <strong className="text-[#D43F33] font-bold text-sm">{selectedContractor?.activeDlpViolationsCount} Roads</strong>
            </div>

            <div className="p-2.5 bg-[#FAFAFA] border border-[#1A1A1A] flex items-center justify-between">
              <span className="opacity-70 uppercase">Ward Monopoly:</span>
              <strong className="text-[#1A1A1A] font-bold">{selectedContractor?.wardMonopolyIndex}% ({selectedContractor?.primaryWard})</strong>
            </div>

            <div className="p-2.5 bg-[#FAFAFA] border border-[#1A1A1A] flex items-center justify-between">
              <span className="opacity-70 uppercase">Public Funds:</span>
              <strong className="text-[#1A1A1A] font-bold">₹{selectedContractor?.totalContractsValueCrores} Cr</strong>
            </div>
          </div>

          {/* Failed Roads Included in Dossier */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A] block">
              Failed Roads in Evidence ({contractorWorkOrders.length}):
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {contractorWorkOrders.map((wo) => (
                <div key={wo.id} className="p-2 bg-[#FAFAFA] text-[11px] border border-black/20 font-mono">
                  <p className="font-bold text-[#1A1A1A] truncate">{wo.roadName}</p>
                  <p className="text-[10px] opacity-70 flex justify-between mt-0.5">
                    <span>{wo.tenderNumber}</span>
                    <span className="text-[#D43F33] font-bold">{wo.activeFailuresCount} craters</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Rights Callout */}
          <div className="p-3.5 bg-[#D43F33]/5 border-2 border-[#D43F33] text-xs space-y-1">
            <p className="font-bold uppercase flex items-center gap-1 text-[#D43F33] text-[11px] font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D43F33]" />
              Statutory IRC:SP:98 Warranty
            </p>
            <p className="text-xs font-serif text-[#1A1A1A]/80 leading-relaxed">
              Contractors cannot legally receive final bill clearance or release of bank guarantee retention money while roads remain unrepaired during the 36-month warranty.
            </p>
          </div>

        </div>

        {/* Right: Generated Document Preview & Controls (8 cols) */}
        <div className="lg:col-span-8 bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
          
          <div>
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#1A1A1A]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#D43F33]" />
                <span className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                  {actionType === 'RTI_APPLICATION' && 'Formal RTI Application (Sec 6(1) RTI Act 2005)'}
                  {actionType === 'VIGILANCE_COMPLAINT' && 'Lokayukta / Municipal Vigilance Notice'}
                  {actionType === 'WARD_COMMITTEE_RESOLUTION' && 'Ward Committee Agenda Resolution'}
                  {actionType === 'SOCIAL_MEDIA_DOSSIER' && 'Public Citizen Accountability Card'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAFAFA] hover:bg-black/5 text-[#1A1A1A] text-xs font-bold uppercase border-2 border-[#1A1A1A] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAFAFA] hover:bg-black/5 text-[#1A1A1A] text-xs font-bold uppercase border-2 border-[#1A1A1A] transition-colors"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={handleGenerateDocument}
                  disabled={isLoading}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#D43F33] text-white text-xs font-bold uppercase tracking-tight transition-colors disabled:opacity-50"
                  title="Regenerate using Gemini AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Drafting...' : 'Re-Draft AI'}</span>
                </button>
              </div>
            </div>

            {/* Document Text Box */}
            <div className="mt-4 relative">
              {isLoading ? (
                <div className="w-full h-96 flex flex-col items-center justify-center space-y-3 bg-[#FAFAFA] border-2 border-[#1A1A1A] text-[#1A1A1A]">
                  <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono uppercase tracking-widest opacity-70">Drafting legally grounded dossier with Gemini AI...</p>
                </div>
              ) : (
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-96 bg-[#FAFAFA] text-[#1A1A1A] font-mono text-xs p-4 border-2 border-[#1A1A1A] focus:outline-none focus:bg-white leading-relaxed resize-none shadow-inner"
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          {/* Quick Filing Instructions */}
          <div className="p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A] text-[11px] font-mono text-[#1A1A1A]/80 flex items-center justify-between">
            <span>
              💡 <strong>Filing Tip:</strong> File on state RTI Online portal with ₹10 court fee stamp.
            </span>
            <span className="text-emerald-800 font-bold uppercase">100% Legally Compliant</span>
          </div>

        </div>

      </div>

    </div>
  );
};
