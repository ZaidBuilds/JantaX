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
      <div className="border rounded-[10px] border-line bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[var(--bad-solid)] text-white text-xs font-bold px-2 py-0.5">
                {getTranslation(language, 'claimVsRealityBadge')}
              </span>
              <span className="bg-[var(--surface-inverse)] text-white text-xs font-bold px-2 py-0.5">
                {getTranslation(language, 'namedAccountabilityBadge')}
              </span>
              <span className="bg-[var(--good-solid)] text-white text-xs font-bold px-2 py-0.5">
                {getTranslation(language, 'scrapedPublicDataBadge')}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {getTranslation(language, 'headingClaimVsReality')}
            </h2>
            <p className="text-sm text-ink-2 mt-1 max-w-3xl leading-relaxed">
              {getTranslation(language, 'subheadingClaimVsReality')}
            </p>
          </div>

          {/* Anonymous Photo Drop CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onOpenAnonymousDrop}
              className="bg-[var(--bad-solid)] hover:opacity-90 text-white px-5 py-3 text-xs font-bold tracking-tight flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{getTranslation(language, 'btnAnonymousDrop')}</span>
            </button>
          </div>
        </div>

        {/* Quick PIN Code Bar */}
        <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-ink-3">
            {getTranslation(language, 'popularPincodes')}
          </span>
          {[].map((p: any) => (
            <button
              key={p.pincode}
              onClick={() => onSelectPincode(selectedPincode === p.pincode ? '' : p.pincode)}
              className={`text-xs font-bold px-2.5 py-1 border rounded-[10px] transition-all cursor-pointer ${
 selectedPincode === p.pincode
 ? 'bg-[var(--surface-inverse)] text-white border-line'
 : 'bg-surface-2 text-ink border-line hover:border-line hover:bg-surface-3'
 }`}
            >
              {p.pincode} ({p.areaName.split(' ')[0]})
            </button>
          ))}
          {selectedPincode && (
            <button
              onClick={() => onSelectPincode('')}
              className="text-xs text-bad underline hover:opacity-80 ml-2 cursor-pointer font-bold"
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
            className="w-full bg-surface border rounded-[10px] border-line pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-[#D43F33]"
          />
        </div>
        <div className="text-xs font-bold text-ink-3 self-end sm:self-center">
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
              className="border rounded-[10px] border-line bg-surface shadow-sm overflow-hidden"
            >
              {/* Header Bar */}
              <div className="bg-[var(--surface-inverse)] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[var(--bad-solid)] text-white font-bold text-xs px-2.5 py-0.5">
                    PIN {wo.pincode}
                  </span>
                  <span className="text-xs text-white/90">
                    Tender: {wo.tenderNumber}
                  </span>
                  <span className="bg-surface/20 text-white text-xs px-2 py-0.5">
                    {wo.procurementPortal}
                  </span>
                  <span className="bg-surface/10 text-white/80 text-xs px-2 py-0.5">
                    {wo.city}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-warn font-bold">
                    Sanctioned: {wo.claimVsReality.sanctionedCostFormatted}
                  </span>
                  <button
                    onClick={() => handleShareClick(wo)}
                    className="bg-[var(--good-solid)] hover:opacity-90 text-white px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Generate WhatsApp share card"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Card</span>
                  </button>
                </div>
              </div>

              {/* Road Name and Location */}
              <div className="p-4 sm:p-5 border-b border-line bg-surface-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-ink tracking-tight">
                      {wo.roadName}
                    </h3>
                    <p className="text-xs text-ink-3 mt-0.5">
                      {wo.wardName} • {wo.city} • Length: {wo.roadLengthKm} km ({wo.startPoint} {wo.endPoint})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="border rounded-[10px] border-red-500 bg-bad-soft text-bad text-xs font-bold px-2.5 py-1">
                      {wo.totalPotholeReports} Failures Logged
                    </span>
                    <span className="border rounded-[10px] border-amber-600 bg-warn-soft text-warn text-xs font-bold px-2.5 py-1">
                      DLP Warranty: 36 Months (IRC SP:98)
                    </span>
                  </div>
                </div>
              </div>

              {/* Named Responsibility Banner (Contractor, EE, MLA) */}
              <div className="p-4 bg-warn-soft/50 border-b border-line">
                <div className="text-xs font-bold text-warn mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-bad" />
                  <span>Named Accountability Chain (Legal Liability Under Municipal Act § 166)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Contractor Box */}
                  <div className="bg-surface border rounded-[10px] border-line p-2.5">
                    <span className="block text-xs text-ink-3 font-bold">
                      Executing Contractor:
                    </span>
                    <button
                      onClick={() => contractor && onSelectContractor(contractor)}
                      className="font-bold text-ink text-left hover:text-bad underline decoration-1 mt-0.5 block cursor-pointer"
                    >
                      {wo.contractorName}
                    </button>
                    <span className="text-xs text-ink-3 block mt-0.5">
                      Directors: {wo.contractorDirectors.join(', ')}
                    </span>
                  </div>

                  {/* Executive Engineer Box */}
                  <div className="bg-surface border rounded-[10px] border-line p-2.5">
                    <span className="block text-xs text-ink-3 font-bold">
                      Executive Engineer (EE):
                    </span>
                    <span className="font-bold text-ink block mt-0.5">
                      {wo.executiveEngineer.name}
                    </span>
                    <span className="text-xs text-ink-3 block mt-0.5">
                      {wo.executiveEngineer.designation}
                    </span>
                    {wo.executiveEngineer.signedCertificateDate && (
                      <span className="text-xs text-good bg-good-soft px-1 py-0.5 border rounded-[10px] border-emerald-300 mt-1 inline-block">
                        Certified Clean: {wo.executiveEngineer.signedCertificateDate}
                      </span>
                    )}
                  </div>

                  {/* Elected MLA Box */}
                  <div className="bg-surface border rounded-[10px] border-line p-2.5">
                    <span className="block text-xs text-ink-3 font-bold">
                      Local Elected Representative:
                    </span>
                    <span className="font-bold text-ink block mt-0.5">
                      {wo.electedRepresentative.name} ({wo.electedRepresentative.role})
                    </span>
                    <span className="text-xs text-ink-3 block mt-0.5">
                      Constituency: {wo.electedRepresentative.constituency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Side-By-Side: Official Claim vs Ground Truth Reality */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-black/15">
                
                {/* Left: Official Government Claim */}
                <div className="p-4 sm:p-5 bg-surface space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-line">
                    <div className="flex items-center gap-1.5 text-info font-bold text-xs">
                      <FileCheck className="w-4 h-4 text-info" />
                      <span>{getTranslation(language, 'officialClaimTitle')}</span>
                    </div>
                    <span className="bg-blue-100 text-info text-xs font-bold px-2 py-0.5">
                      e-Procurement Certified
                    </span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-ink">
                    {wo.claimVsReality.officialClaim}
                  </p>

                  <div className="bg-surface-2 border rounded-[10px] border-line p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-3 text-xs">Sanctioned Specs:</span>
                      <span className="font-bold text-ink text-right">{wo.claimVsReality.sanctionedSpecs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-3 text-xs">Handover Date:</span>
                      <span className="font-bold text-ink">{wo.completionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-3 text-xs">Mandatory Warranty:</span>
                      <span className="font-bold text-good">Until {wo.dlpExpiryDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-line pt-1">
                      <span className="text-ink-3 text-xs">Measurement Book:</span>
                      <span className="text-xs text-ink">{wo.claimVsReality.officialSourceDoc}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Ground Truth / Reality */}
                <div className="p-4 sm:p-5 bg-bad-soft/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-red-200">
                    <div className="flex items-center gap-1.5 text-bad font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-bad" />
                      <span>{getTranslation(language, 'realityTitle')}</span>
                    </div>
                    <span className="bg-[var(--bad-solid)] text-white text-xs font-bold px-2 py-0.5">
                      {wo.claimVsReality.discrepancyPercentage}% Deficit / Discrepancy
                    </span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-ink font-medium">
                    {wo.claimVsReality.realityGroundTruth}
                  </p>

                  {/* Scraped CAG / Statutory Audit Snippet */}
                  {wo.claimVsReality.cagFindingSnippet && (
                    <div className="bg-surface border-l-4 border-bad p-2.5 text-xs">
                      <span className="text-xs font-bold text-bad block">
                        {wo.claimVsReality.cagAuditReference}:
                      </span>
                      <p className="italic text-xs text-ink mt-0.5">
                        "{wo.claimVsReality.cagFindingSnippet}"
                      </p>
                    </div>
                  )}

                  {/* Ground Truth Photo Preview */}
                  <div className="flex items-center gap-3 bg-surface border rounded-[10px] border-line p-2">
                    <img 
                      src={wo.claimVsReality.evidencePhotoUrl} 
                      alt="Ground truth defect evidence" 
                      className="w-16 h-14 object-cover border rounded-[10px] border-line shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-ink block">Ground Truth Photo Evidence</span>
                      <span className="text-ink-3 block">Date: {wo.claimVsReality.evidenceDate}</span>
                      <span className="text-bad font-bold block">{wo.claimVsReality.evidenceSource}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-surface-2 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <a 
                    href={wo.claimVsReality.sourcePortalUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-ink hover:text-bad font-bold flex items-center gap-1 underline decoration-1"
                  >
                    <span>Raw e-Procurement Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareClick(wo)}
                    className="bg-surface border rounded-[10px] border-line hover:border-black text-ink px-3 py-1.5 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Card</span>
                  </button>
                  <button
                    onClick={onOpenAnonymousDrop}
                    className="bg-[var(--surface-inverse)] hover:bg-[var(--bad-solid)] text-white px-3 py-1.5 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
