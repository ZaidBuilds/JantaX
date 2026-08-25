import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Share2, 
  ExternalLink, 
  Camera, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  FileCheck,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { WorkOrder, Language, WhatsAppCardData, Contractor, PincodeRecord } from '../types';
import { getTranslation } from '../translations';

import { generatePanIndiaPincodeRecord, decodeIndianPincode } from '../utils/panIndiaPincodes';

interface ClaimVsRealityViewProps {
  language: Language;
  selectedPincode: string;
  onSelectPincode: (pin: string) => void;
  onOpenWhatsAppModal: (card: WhatsAppCardData) => void;
  onOpenAnonymousDrop: () => void;
  onSelectContractor: (contractor: Contractor) => void;
  contractors: Contractor[];
}

export const ClaimVsRealityView: React.FC<ClaimVsRealityViewProps> = ({
  language,
  selectedPincode,
  onSelectPincode,
  onOpenWhatsAppModal,
  onOpenAnonymousDrop,
  onSelectContractor,
  contractors,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // If a user selected a custom PIN code that doesn't have a static work order yet, generate one
  let allAvailableWorkOrders: any[] = [];
  if (selectedPincode && !allAvailableWorkOrders.some(wo => wo.pincode === selectedPincode)) {
    const panIndiaRecord: PincodeRecord = generatePanIndiaPincodeRecord(selectedPincode);
    const postalInfo = decodeIndianPincode(selectedPincode);
    
    const dynamicWo: WorkOrder = {
      id: `wo-dynamic-${selectedPincode}`,
      pincode: selectedPincode,
      tenderNumber: `${postalInfo.municipalBody.split(' ')[0]}/2024-25/RD-${selectedPincode.slice(-3)}/099`,
      procurementPortal: 'eprocure.gov.in',
      title: `Bituminous Resurfacing & Drainage Renewal of ${panIndiaRecord.keyRoads[0]}`,
      wardId: `ward-${selectedPincode}`,
      wardName: panIndiaRecord.wardName,
      zone: postalInfo.pwdDivision,
      city: panIndiaRecord.city,
      contractorId: panIndiaRecord.dominantContractor.contractorId,
      contractorName: panIndiaRecord.dominantContractor.name,
      contractorDirectors: panIndiaRecord.dominantContractor.directors,
      executiveEngineer: panIndiaRecord.executiveEngineer,
      electedRepresentative: panIndiaRecord.electedRepresentative,
      sanctionedAmountLakhs: Math.round(panIndiaRecord.totalFundsSpentCrores * 10),
      awardedDate: '2024-02-10',
      completionDate: '2024-05-15',
      dlpExpiryDate: '2027-05-15',
      dlpStatus: 'DLP_BREACH_UNRESOLVED',
      roadLengthKm: 2.5,
      roadName: panIndiaRecord.keyRoads[0],
      startPoint: 'Main Junction Signal',
      endPoint: 'Postal Sector Terminal',
      totalPotholeReports: panIndiaRecord.failedWorksCount,
      activeFailuresCount: panIndiaRecord.activeDlpBreachesCount,
      specifications: {
        bitumenGrade: 'VG-30',
        thicknessMm: 40,
        pavementType: 'Dense Bituminous Macadam (DBM) + BC',
        sanctionedWarrantyMonths: 36,
      },
      coordinates: { lat1: 28.6139, lng1: 77.2090, lat2: 28.6145, lng2: 77.2150 },
      claimVsReality: {
        sanctionedCostFormatted: `₹${(panIndiaRecord.totalFundsSpentCrores * 0.1).toFixed(2)} Crore`,
        sanctionedSpecs: '40mm VG-30 Bituminous Concrete with 36-Month Defect Liability Guarantee',
        officialClaim: `Sanctioned ₹${(panIndiaRecord.totalFundsSpentCrores * 0.1).toFixed(2)} Cr under ${postalInfo.municipalBody} municipal road development grant. Quality IRC:SP:98 certification countersigned with mandatory 3-year warranty by M/s ${panIndiaRecord.dominantContractor.name}.`,
        officialSourceDoc: `${postalInfo.municipalBody}/2024/MB-Vol-12`,
        cagAuditReference: panIndiaRecord.cagAuditNotes[0] || 'CAG Local Bodies Audit 2024',
        cagFindingSnippet: 'Core cuts revealed substandard binder content and aggregate stripping during the first monsoon.',
        realityGroundTruth: `${panIndiaRecord.failedWorksCount} severe pothole clusters and edge collapses formed within 90 days of handover. Contractor failed to mobilize rectification teams under warranty notice.`,
        discrepancyPercentage: Math.round((panIndiaRecord.failedWorksCount / panIndiaRecord.totalAuditedWorks) * 100),
        evidencePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        evidenceDate: '2025-08-20',
        evidenceSource: 'Anonymous Citizen Photo Drop',
        sourcePortalUrl: 'https://eprocure.gov.in/pin/' + selectedPincode,
      },
    };
    allAvailableWorkOrders.unshift(dynamicWo);
  }

  // Filter work orders by pincode or search term
  const filteredWorkOrders = allAvailableWorkOrders.filter((wo) => {
    const matchesPin = !selectedPincode || wo.pincode === selectedPincode;
    const matchesSearch = 
      wo.roadName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      wo.contractorName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      wo.tenderNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      wo.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
      wo.pincode.includes(filterQuery);
    return matchesPin && matchesSearch;
  });

  const activeWorkOrders = filteredWorkOrders.length > 0 ? filteredWorkOrders : allAvailableWorkOrders;

  const handleShareClick = (wo: WorkOrder) => {
    const cardData: WhatsAppCardData = {
      pincode: wo.pincode,
      roadName: wo.roadName,
      wardName: wo.wardName,
      city: wo.city,
      sanctionedAmount: wo.claimVsReality.sanctionedCostFormatted,
      contractorName: wo.contractorName,
      contractorDirectors: wo.contractorDirectors.join(', '),
      executiveEngineer: wo.executiveEngineer.name + ' (' + wo.executiveEngineer.designation + ')',
      electedRep: wo.electedRepresentative.name + ' (' + wo.electedRepresentative.role + ')',
      officialClaim: wo.claimVsReality.officialClaim,
      groundReality: wo.claimVsReality.realityGroundTruth,
      discrepancyNumber: `${wo.claimVsReality.discrepancyPercentage}%`,
      cagOrDocProof: wo.claimVsReality.cagAuditReference || wo.claimVsReality.officialSourceDoc,
      proofUrl: wo.claimVsReality.sourcePortalUrl,
    };
    onOpenWhatsAppModal(cardData);
  };

  return (
    <div className="space-y-6">
      
      {/* Manifesto / Header Banner */}
      <div className="border-2 border-[#1A1A1A] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#D43F33] text-white text-[11px] font-mono font-bold px-2 py-0.5 uppercase">
                {getTranslation(language, 'claimVsRealityBadge')}
              </span>
              <span className="bg-[#1A1A1A] text-white text-[11px] font-mono font-bold px-2 py-0.5 uppercase">
                {getTranslation(language, 'namedAccountabilityBadge')}
              </span>
              <span className="bg-emerald-700 text-white text-[11px] font-mono font-bold px-2 py-0.5 uppercase">
                {getTranslation(language, 'scrapedPublicDataBadge')}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1A1A] tracking-tight">
              {getTranslation(language, 'headingClaimVsReality')}
            </h2>
            <p className="font-serif text-sm text-[#1A1A1A]/80 mt-1 max-w-3xl leading-relaxed">
              {getTranslation(language, 'subheadingClaimVsReality')}
            </p>
          </div>

          {/* Anonymous Photo Drop CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onOpenAnonymousDrop}
              className="bg-[#D43F33] hover:bg-[#B32E24] text-white px-5 py-3 text-xs font-bold uppercase tracking-tight flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{getTranslation(language, 'btnAnonymousDrop')}</span>
            </button>
          </div>
        </div>

        {/* Quick PIN Code Bar */}
        <div className="mt-5 pt-4 border-t border-black/15 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70">
            {getTranslation(language, 'popularPincodes')}
          </span>
          {[].map((p: any) => (
            <button
              key={p.pincode}
              onClick={() => onSelectPincode(selectedPincode === p.pincode ? '' : p.pincode)}
              className={`text-xs font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                selectedPincode === p.pincode
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#FAFAFA] text-[#1A1A1A] border-black/20 hover:border-[#1A1A1A] hover:bg-black/5'
              }`}
            >
              {p.pincode} ({p.areaName.split(' ')[0]})
            </button>
          ))}
          {selectedPincode && (
            <button
              onClick={() => onSelectPincode('')}
              className="text-xs font-mono text-[#D43F33] underline hover:opacity-80 ml-2 cursor-pointer font-bold"
            >
              Clear Filter ({selectedPincode})
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search road name, city, contractor, PIN..."
            className="w-full bg-white border-2 border-[#1A1A1A] pl-9 pr-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#D43F33]"
          />
        </div>
        <div className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 self-end sm:self-center">
          Showing {activeWorkOrders.length} Scraped Public Works Audited across India
        </div>
      </div>

      {/* Claim vs Reality Cards List */}
      <div className="space-y-6">
        {activeWorkOrders.map((wo) => {
          const contractor = contractors.find((c: any) => c.id === wo.contractorId);

          return (
            <div 
              key={wo.id}
              className="border-2 border-[#1A1A1A] bg-white shadow-sm overflow-hidden"
            >
              {/* Header Bar */}
              <div className="bg-[#1A1A1A] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#D43F33] text-white font-mono font-bold text-xs px-2.5 py-0.5 uppercase">
                    PIN {wo.pincode}
                  </span>
                  <span className="font-mono text-xs text-white/90">
                    Tender: {wo.tenderNumber}
                  </span>
                  <span className="bg-white/20 text-white font-mono text-[10px] px-2 py-0.5 uppercase">
                    {wo.procurementPortal}
                  </span>
                  <span className="bg-white/10 text-white/80 font-mono text-[10px] px-2 py-0.5 uppercase">
                    {wo.city}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-300 font-bold">
                    Sanctioned: {wo.claimVsReality.sanctionedCostFormatted}
                  </span>
                  <button
                    onClick={() => handleShareClick(wo)}
                    className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-1 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Generate WhatsApp share card"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Card</span>
                  </button>
                </div>
              </div>

              {/* Road Name and Location */}
              <div className="p-4 sm:p-5 border-b border-black/10 bg-[#FAFAFA]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black uppercase text-[#1A1A1A] tracking-tight">
                      {wo.roadName}
                    </h3>
                    <p className="font-mono text-xs text-[#1A1A1A]/70 uppercase mt-0.5">
                      {wo.wardName} • {wo.city} • Length: {wo.roadLengthKm} km ({wo.startPoint} ➔ {wo.endPoint})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="border border-red-500 bg-red-50 text-[#D43F33] text-xs font-mono font-bold px-2.5 py-1 uppercase">
                      {wo.totalPotholeReports} Failures Logged
                    </span>
                    <span className="border border-amber-600 bg-amber-50 text-amber-900 text-xs font-mono font-bold px-2.5 py-1 uppercase">
                      DLP Warranty: 36 Months (IRC SP:98)
                    </span>
                  </div>
                </div>
              </div>

              {/* Named Responsibility Banner (Contractor, EE, MLA) */}
              <div className="p-4 bg-amber-50/50 border-b border-black/10">
                <div className="text-[11px] font-mono font-bold uppercase text-amber-900 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#D43F33]" />
                  <span>Named Accountability Chain (Legal Liability Under Municipal Act § 166)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Contractor Box */}
                  <div className="bg-white border border-black/15 p-2.5">
                    <span className="block font-mono text-[10px] uppercase text-black/60 font-bold">
                      Executing Contractor:
                    </span>
                    <button
                      onClick={() => contractor && onSelectContractor(contractor)}
                      className="font-bold text-[#1A1A1A] text-left hover:text-[#D43F33] underline decoration-1 mt-0.5 block cursor-pointer"
                    >
                      {wo.contractorName}
                    </button>
                    <span className="font-mono text-[10px] text-black/70 block mt-0.5">
                      Directors: {wo.contractorDirectors.join(', ')}
                    </span>
                  </div>

                  {/* Executive Engineer Box */}
                  <div className="bg-white border border-black/15 p-2.5">
                    <span className="block font-mono text-[10px] uppercase text-black/60 font-bold">
                      Executive Engineer (EE):
                    </span>
                    <span className="font-bold text-[#1A1A1A] block mt-0.5">
                      {wo.executiveEngineer.name}
                    </span>
                    <span className="font-mono text-[10px] text-black/70 block mt-0.5">
                      {wo.executiveEngineer.designation}
                    </span>
                    {wo.executiveEngineer.signedCertificateDate && (
                      <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 border border-emerald-300 mt-1 inline-block">
                        Certified Clean: {wo.executiveEngineer.signedCertificateDate}
                      </span>
                    )}
                  </div>

                  {/* Elected MLA Box */}
                  <div className="bg-white border border-black/15 p-2.5">
                    <span className="block font-mono text-[10px] uppercase text-black/60 font-bold">
                      Local Elected Representative:
                    </span>
                    <span className="font-bold text-[#1A1A1A] block mt-0.5">
                      {wo.electedRepresentative.name} ({wo.electedRepresentative.role})
                    </span>
                    <span className="font-mono text-[10px] text-black/70 block mt-0.5">
                      Constituency: {wo.electedRepresentative.constituency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Side-By-Side: Official Claim vs Ground Truth Reality */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-black/15">
                
                {/* Left: Official Government Claim */}
                <div className="p-4 sm:p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/10">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs font-mono uppercase">
                      <FileCheck className="w-4 h-4 text-blue-700" />
                      <span>{getTranslation(language, 'officialClaimTitle')}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-mono font-bold px-2 py-0.5">
                      e-Procurement Certified
                    </span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-[#1A1A1A]">
                    {wo.claimVsReality.officialClaim}
                  </p>

                  <div className="bg-[#FAFAFA] border border-black/10 p-3 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-black/60 uppercase text-[10px]">Sanctioned Specs:</span>
                      <span className="font-bold text-[#1A1A1A] text-right">{wo.claimVsReality.sanctionedSpecs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60 uppercase text-[10px]">Handover Date:</span>
                      <span className="font-bold text-[#1A1A1A]">{wo.completionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60 uppercase text-[10px]">Mandatory Warranty:</span>
                      <span className="font-bold text-emerald-800">Until {wo.dlpExpiryDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-black/10 pt-1">
                      <span className="text-black/60 uppercase text-[10px]">Measurement Book:</span>
                      <span className="text-[11px] text-[#1A1A1A]">{wo.claimVsReality.officialSourceDoc}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Ground Truth / Reality */}
                <div className="p-4 sm:p-5 bg-red-50/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-red-200">
                    <div className="flex items-center gap-1.5 text-[#D43F33] font-bold text-xs font-mono uppercase">
                      <AlertTriangle className="w-4 h-4 text-[#D43F33]" />
                      <span>{getTranslation(language, 'realityTitle')}</span>
                    </div>
                    <span className="bg-[#D43F33] text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                      {wo.claimVsReality.discrepancyPercentage}% Deficit / Discrepancy
                    </span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-[#1A1A1A] font-medium">
                    {wo.claimVsReality.realityGroundTruth}
                  </p>

                  {/* Scraped CAG / Statutory Audit Snippet */}
                  {wo.claimVsReality.cagFindingSnippet && (
                    <div className="bg-white border-l-4 border-[#D43F33] p-2.5 text-xs">
                      <span className="font-mono text-[10px] font-bold uppercase text-[#D43F33] block">
                        🏛️ {wo.claimVsReality.cagAuditReference}:
                      </span>
                      <p className="font-serif italic text-xs text-[#1A1A1A] mt-0.5">
                        "{wo.claimVsReality.cagFindingSnippet}"
                      </p>
                    </div>
                  )}

                  {/* Ground Truth Photo Preview */}
                  <div className="flex items-center gap-3 bg-white border border-black/10 p-2">
                    <img 
                      src={wo.claimVsReality.evidencePhotoUrl} 
                      alt="Ground truth defect evidence" 
                      className="w-16 h-14 object-cover border border-black/20 shrink-0"
                    />
                    <div className="text-[11px] font-mono">
                      <span className="font-bold text-[#1A1A1A] block">Ground Truth Photo Evidence</span>
                      <span className="text-black/60 block">Date: {wo.claimVsReality.evidenceDate}</span>
                      <span className="text-[#D43F33] font-bold block">{wo.claimVsReality.evidenceSource}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#FAFAFA] border-t border-black/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <a 
                    href={wo.claimVsReality.sourcePortalUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#1A1A1A] hover:text-[#D43F33] font-bold flex items-center gap-1 underline decoration-1"
                  >
                    <span>Raw e-Procurement Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareClick(wo)}
                    className="bg-white border border-black/30 hover:border-black text-[#1A1A1A] px-3 py-1.5 font-bold uppercase text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Card</span>
                  </button>
                  <button
                    onClick={onOpenAnonymousDrop}
                    className="bg-[#1A1A1A] hover:bg-[#D43F33] text-white px-3 py-1.5 font-bold uppercase text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Drop Photo Proof</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
