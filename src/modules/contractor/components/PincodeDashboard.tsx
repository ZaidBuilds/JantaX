import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  UserCheck, 
  AlertTriangle, 
  Share2, 
  ExternalLink, 
  Camera, 
  FileText, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Landmark,
  Volume2,
  VolumeX,
  Navigation,
  Sparkles,
  Award,
  Globe2
} from 'lucide-react';
import { Language, WhatsAppCardData, Contractor, WorkOrder, PincodeRecord } from '../types';
import { getTranslation } from '../translations';

import { generatePanIndiaPincodeRecord, decodeIndianPincode } from '../utils/panIndiaPincodes';
import { nearestPin } from '../../../core/services/pinDirectory';

interface PincodeDashboardProps {
  language: Language;
  selectedPincode: string;
  onSelectPincode: (pin: string) => void;
  onOpenWhatsAppModal: (card: WhatsAppCardData) => void;
  onOpenAnonymousDrop: () => void;
  onSelectContractor: (contractor: Contractor) => void;
  onNavigateToTab: (tab: 'claim-reality' | 'leaderboard' | 'action' | 'ai-audit') => void;
  contractors: Contractor[];
  workOrders: WorkOrder[];
}

export const PincodeDashboard: React.FC<PincodeDashboardProps> = ({
  language,
  selectedPincode,
  onSelectPincode,
  onOpenWhatsAppModal,
  onOpenAnonymousDrop,
  onSelectContractor,
  onNavigateToTab,
  contractors,
  workOrders,
}) => {
  const [searchInput, setSearchInput] = useState(selectedPincode || '110001');
  const [isLocating, setIsLocating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Look up statically or dynamically generate for ANY valid 6-digit Indian PIN code
  const currentPin = (selectedPincode || searchInput || '110001').trim();
  
  const currentPinRecord: PincodeRecord = generatePanIndiaPincodeRecord(currentPin.length === 6 ? currentPin : '110001');

  const postalInfo = decodeIndianPincode(currentPinRecord.pincode);

  const pinWorkOrders = workOrders.filter((wo) => wo.pincode === currentPinRecord.pincode);
  const dominantContractorObj = contractors.find((c: any) => c.id === currentPinRecord.dominantContractor.contractorId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = searchInput.replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length === 6) {
      onSelectPincode(cleanPin);
    }
  };

  // GPS Auto-Detection
  const handleAutoDetectPin = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser. Please enter your 6-digit PIN code manually.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // The PIN whose post offices are closest, from India Post's directory.
        const near = await nearestPin(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
        if (!near || near.km > 100) {
          alert('Could not match your location to a PIN code. Please enter your 6-digit PIN code.');
          return;
        }
        setSearchInput(near.pin);
        onSelectPincode(near.pin);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Location detection failed:', err);
      },
      { timeout: 8000 }
    );
  };

  // Audio Readout (Accessibility for citizens across India)
  const handleAudioReadout = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const failureRate = Math.round((currentPinRecord.failedWorksCount / currentPinRecord.totalAuditedWorks) * 100);
    const speechText = `Civic Audit for PIN code ${currentPinRecord.pincode}, ${currentPinRecord.areaName}, ${currentPinRecord.city}. Total public taxpayer funds spent: ₹${currentPinRecord.totalFundsSpentCrores} Crores. Dominant contractor: ${currentPinRecord.dominantContractor.name}, controlling ${currentPinRecord.dominantContractor.sharePercent}% of public works. Responsible Executive Engineer is ${currentPinRecord.executiveEngineer.name}. Local MLA is ${currentPinRecord.electedRepresentative.name}. There are ${currentPinRecord.activeDlpBreachesCount} active warranty breaches under the mandatory 36-month defect liability period with a failure rate of ${failureRate} percent.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSharePincode = () => {
    const cardData: WhatsAppCardData = {
      pincode: currentPinRecord.pincode,
      roadName: `${currentPinRecord.areaName} (${currentPinRecord.keyRoads.slice(0, 2).join(', ')})`,
      wardName: currentPinRecord.wardName,
      city: currentPinRecord.city,
      sanctionedAmount: `₹${currentPinRecord.totalFundsSpentCrores} Crore Total`,
      contractorName: currentPinRecord.dominantContractor.name,
      contractorDirectors: currentPinRecord.dominantContractor.directors.join(', '),
      executiveEngineer: `${currentPinRecord.executiveEngineer.name} (${currentPinRecord.executiveEngineer.designation})`,
      electedRep: `${currentPinRecord.electedRepresentative.name} (${currentPinRecord.electedRepresentative.role})`,
      officialClaim: `Sanctioned ₹${currentPinRecord.totalFundsSpentCrores} Cr across ${currentPinRecord.totalAuditedWorks} public tenders with mandatory 3-year warranty certificates.`,
      groundReality: `${currentPinRecord.failedWorksCount} out of ${currentPinRecord.totalAuditedWorks} works failed within 1st monsoon. ${currentPinRecord.activeDlpBreachesCount} active warranty defaults with zero free repairs.`,
      discrepancyNumber: `${Math.round((currentPinRecord.failedWorksCount / currentPinRecord.totalAuditedWorks) * 100)}% Failure Rate`,
      cagOrDocProof: currentPinRecord.cagAuditNotes[0] || 'CAG State Municipal Audit 2024',
      proofUrl: 'https://eprocure.gov.in/pin/' + currentPinRecord.pincode,
    };
    onOpenWhatsAppModal(cardData);
  };

  return (
    <div className="space-y-6">
      
      {/* Primary Key Header & Search */}
      <div className="border rounded-[10px] border-line bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[var(--bad-solid)] text-white text-xs font-bold px-2 py-0.5">
                {getTranslation(language, 'pincodePrimaryKeyBadge')}
              </span>
              <span className="bg-[var(--surface-inverse)] text-white text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-warn" />
                {currentPinRecord.city}
              </span>
              <span className="bg-blue-900 text-white text-xs font-bold px-2 py-0.5">
                {postalInfo.statutoryAct}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              PIN {currentPinRecord.pincode} · {currentPinRecord.areaName}
            </h2>
            <p className="text-xs text-ink-2 mt-1">
              {currentPinRecord.wardName} • {currentPinRecord.state} • {postalInfo.pwdDivision} • {getTranslation(language, 'pincodeSummary')}
            </p>
          </div>

          {/* Action CTAs: Audio, WhatsApp, Photo Drop */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAudioReadout}
              className={`px-3 py-2 text-xs font-bold tracking-tight flex items-center gap-1.5 border rounded-[10px] transition-colors cursor-pointer ${
 isSpeaking 
 ? 'bg-amber-400 border-line text-ink animate-pulse' 
 : 'bg-surface border-line hover:bg-surface-3 text-ink'
 }`}
              title="Listen to Audio Audit (Accessible for all citizens)"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-bad" /> : <Volume2 className="w-4 h-4 text-ink" />}
              <span>{isSpeaking ? 'Stop Audio' : getTranslation(language, 'listenAudioAudit')}</span>
            </button>

            <button
              onClick={handleSharePincode}
              className="bg-[var(--good-solid)] hover:opacity-90 text-white px-4 py-2 text-xs font-bold tracking-tight flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>{getTranslation(language, 'btnShareWhatsApp')}</span>
            </button>
            
            <button
              onClick={onOpenAnonymousDrop}
              className="bg-[var(--surface-inverse)] hover:bg-[var(--bad-solid)] text-white px-4 py-2 text-xs font-bold tracking-tight flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{getTranslation(language, 'btnAnonymousDrop')}</span>
            </button>
          </div>
        </div>

        {/* PIN Code Search Input & Presets */}
        <div className="mt-5 pt-4 border-t border-line">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-bad absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                maxLength={6}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={getTranslation(language, 'pincodeSearchPlaceholder')}
                className="w-full bg-surface-2 border rounded-[10px] border-line pl-9 pr-3 py-2.5 text-xs font-bold text-ink focus:outline-none focus:bg-surface"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAutoDetectPin}
              disabled={isLocating}
              className="bg-surface border rounded-[10px] border-line hover:bg-surface-3 text-ink px-3.5 py-2 text-xs font-bold tracking-tight flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              title="Detect PIN code from GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 text-bad ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : getTranslation(language, 'autoDetectPin')}</span>
            </button>

            <button
              type="submit"
              className="bg-[var(--surface-inverse)] hover:bg-black text-white px-5 py-2 text-xs font-bold tracking-tight shrink-0 transition-colors cursor-pointer"
            >
              {getTranslation(language, 'searchPincodeBtn')}
            </button>
          </form>

          {/* Preset Buttons covering all zones of India */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-3 font-bold mr-1">
              Popular Audited PINs:
            </span>
            {[].map((p: any) => (
              <button
                key={p.pincode}
                onClick={() => {
                  setSearchInput(p.pincode);
                  onSelectPincode(p.pincode);
                }}
                className={`text-xs px-2.5 py-1 border rounded-[10px] transition-all cursor-pointer ${
 currentPinRecord.pincode === p.pincode
 ? 'bg-[var(--surface-inverse)] text-white border-line font-bold'
 : 'bg-surface text-ink border-line hover:border-black'
 }`}
              >
                {p.pincode} ({p.areaName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Stat Mathematical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Funds Spent */}
        <div className="border rounded-[10px] border-line bg-surface p-4 space-y-1">
          <span className="text-xs font-bold text-ink-3">
            {getTranslation(language, 'fundsSpentInPincode')}
          </span>
          <div className="text-2xl font-bold text-ink">
            ₹{currentPinRecord.totalFundsSpentCrores} Cr
          </div>
          <p className="text-xs text-ink-3">
            Across {currentPinRecord.totalAuditedWorks} Scraped Work Orders
          </p>
        </div>

        {/* Monopoly Share */}
        <div className="border rounded-[10px] border-line bg-surface p-4 space-y-1">
          <span className="text-xs font-bold text-ink-3">
            {getTranslation(language, 'wardMonopolyShare')}
          </span>
          <div className="text-2xl font-bold text-bad">
            {currentPinRecord.dominantContractor.sharePercent}%
          </div>
          <p className="text-xs text-ink-3 truncate">
            {currentPinRecord.dominantContractor.name}
          </p>
        </div>

        {/* Failed Works */}
        <div className="border rounded-[10px] border-line bg-surface p-4 space-y-1">
          <span className="text-xs font-bold text-ink-3">
            {getTranslation(language, 'failedWorks')}
          </span>
          <div className="text-2xl font-bold text-bad">
            {currentPinRecord.failedWorksCount} / {currentPinRecord.totalAuditedWorks}
          </div>
          <p className="text-xs text-ink-3">
            {Math.round((currentPinRecord.failedWorksCount / currentPinRecord.totalAuditedWorks) * 100)}% Failure Rate
          </p>
        </div>

        {/* Active DLP Warranty Breaches */}
        <div className="border rounded-[10px] border-line bg-surface p-4 space-y-1">
          <span className="text-xs font-bold text-ink-3">
            {getTranslation(language, 'activeDlpViolations')}
          </span>
          <div className="text-2xl font-bold text-bad">
            {currentPinRecord.activeDlpBreachesCount} Breaches
          </div>
          <p className="text-xs text-ink-3">
            Under 36-Month Mandatory Warranty
          </p>
        </div>

      </div>

      {/* Named Accountability Duo: Contractor vs Executive Engineer vs MLA */}
      <div className="border rounded-[10px] border-line bg-surface p-5 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-bad" />
            <h3 className="text-base font-bold text-ink">
              Named Accountability In PIN {currentPinRecord.pincode}
            </h3>
          </div>
          <span className="text-xs text-bad font-bold">
            {postalInfo.statutoryAct}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Dominant Contractor */}
          <div className="border rounded-[10px] border-line bg-surface-2 p-4 space-y-2">
            <span className="text-xs text-bad font-bold block">
              Dominant Monopoly Contractor ({currentPinRecord.dominantContractor.sharePercent}% Wards)
            </span>
            <h4 className="text-sm font-bold text-ink">
              {currentPinRecord.dominantContractor.name}
            </h4>
            <div className="text-xs space-y-1 text-ink-2">
              <p><strong>Directors:</strong> {currentPinRecord.dominantContractor.directors.join(', ')}</p>
              <p><strong>Primary Operating Ward:</strong> {currentPinRecord.wardName}</p>
            </div>
            {dominantContractorObj && (
              <button
                onClick={() => onSelectContractor(dominantContractorObj)}
                className="mt-2 text-xs font-bold text-ink hover:text-bad underline decoration-1 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Contractor Scorecard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Executive Engineer */}
          <div className="border rounded-[10px] border-line bg-surface-2 p-4 space-y-2">
            <span className="text-xs text-ink-3 font-bold block">
              Responsible Executive Engineer (EE)
            </span>
            <h4 className="text-sm font-bold text-ink">
              {currentPinRecord.executiveEngineer.name}
            </h4>
            <div className="text-xs space-y-1 text-ink-2">
              <p><strong>Designation:</strong> {currentPinRecord.executiveEngineer.designation}</p>
              <p><strong>Office Address:</strong> {currentPinRecord.executiveEngineer.officeAddress}</p>
              {currentPinRecord.executiveEngineer.phoneOffice && (
                <p><strong>Desk Phone:</strong> {currentPinRecord.executiveEngineer.phoneOffice}</p>
              )}
            </div>
          </div>

          {/* Elected MLA / Corporator */}
          <div className="border rounded-[10px] border-line bg-surface-2 p-4 space-y-2">
            <span className="text-xs text-ink-3 font-bold block">
              Elected Representative (MLA / MP / Corporator)
            </span>
            <h4 className="text-sm font-bold text-ink">
              {currentPinRecord.electedRepresentative.name} ({currentPinRecord.electedRepresentative.role})
            </h4>
            <div className="text-xs space-y-1 text-ink-2">
              <p><strong>Constituency:</strong> {currentPinRecord.electedRepresentative.constituency}</p>
              {currentPinRecord.electedRepresentative.party && (
                <p><strong>Political Party:</strong> {currentPinRecord.electedRepresentative.party}</p>
              )}
              <p className="text-bad font-bold mt-1">Ward Committee Chairperson</p>
            </div>
          </div>

        </div>

        {/* Scraped CAG Audit Findings */}
        {currentPinRecord.cagAuditNotes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-line bg-warn-soft/50 p-3 border rounded-[10px] border-amber-200">
            <span className="text-xs font-bold text-warn flex items-center gap-1.5 mb-1.5">
              <Landmark className="w-4 h-4 text-warn" />
              <span>Scraped CAG & Statutory Audit Findings in PIN {currentPinRecord.pincode}:</span>
            </span>
            <ul className="space-y-1 text-xs font-sans text-ink">
              {currentPinRecord.cagAuditNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-bad font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Claim vs Reality Audits For This Pincode */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">
            Tenders & Road Audits In PIN {currentPinRecord.pincode}
          </h3>
          <button
            onClick={() => onNavigateToTab('claim-reality')}
            className="text-xs font-bold text-bad hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Claim vs Reality Audits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pinWorkOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinWorkOrders.map((wo) => (
              <div 
                key={wo.id}
                className="border rounded-[10px] border-line bg-surface p-4 space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-bold text-bad">
                      {wo.tenderNumber}
                    </span>
                    <span className="bg-[var(--surface-inverse)] text-white text-xs px-2 py-0.5">
                      {wo.claimVsReality.sanctionedCostFormatted}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-ink mt-2">
                    {wo.roadName}
                  </h4>

                  {/* Split */}
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="bg-info-soft p-2 border-l-2 border-blue-600">
                      <span className="text-xs text-info font-bold block">Official Claim:</span>
                      <p className="text-xs text-ink">{wo.claimVsReality.officialClaim}</p>
                    </div>

                    <div className="bg-bad-soft p-2 border-l-2 border-bad">
                      <span className="text-xs text-bad font-bold block">Ground Truth:</span>
                      <p className="text-xs text-ink">{wo.claimVsReality.realityGroundTruth}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="pt-2 border-t border-line flex items-center justify-between">
                  <span className="text-xs text-bad font-bold">
                    {wo.claimVsReality.discrepancyPercentage}% Deficit
                  </span>
                  <button
                    onClick={() => {
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
                    }}
                    className="bg-[var(--good-solid)] hover:opacity-90 text-white px-3 py-1 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border rounded-[10px] border-dashed border-line bg-surface-2 text-center">
            <p className="text-xs text-ink-3">
              No active road tenders scraped yet for PIN {currentPinRecord.pincode}.
            </p>
            <button
              onClick={onOpenAnonymousDrop}
              className="mt-3 bg-[var(--surface-inverse)] hover:bg-[var(--bad-solid)] text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              Be First to Drop Ground Truth Photo
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
