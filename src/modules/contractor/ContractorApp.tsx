import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MetricsOverview } from './components/MetricsOverview';
import { ClaimVsRealityView } from './components/ClaimVsRealityView';
import { PincodeDashboard } from './components/PincodeDashboard';
import { ContractorLeaderboard } from './components/ContractorLeaderboard';
import { ContractorModal } from './components/ContractorModal';
import { InteractiveWardMap } from './components/InteractiveWardMap';
import { CitizenActionGenerator } from './components/CitizenActionGenerator';
import { AiTenderAudit } from './components/AiTenderAudit';
import { ReportFailureModal } from './components/ReportFailureModal';
import { ContractorComparison } from './components/ContractorComparison';
import { AboutModal } from './components/AboutModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { AnonymousPhotoDropModal } from './components/AnonymousPhotoDropModal';
import { INDIAN_STATES, getCitiesByState, getStateById, getCityById, findStateAndCityByPincode } from './data/statesAndCities';
import { Contractor, WorkOrder, RoadDefectReport, WardData, Language, WhatsAppCardData } from './types';
import { getTranslation } from './translations';
import { generateMockContractorDataset } from './data/mockContractorDataset';

export default function App() {
  const [activeTab, setActiveTab] = useState<'claim-reality' | 'pincode' | 'leaderboard' | 'map' | 'action' | 'ai-audit' | 'compare'>('claim-reality');
  const [selectedState, setSelectedState] = useState<string>('karnataka');
  const [selectedCity, setSelectedCity] = useState<string>('bengaluru');
  const [selectedPincode, setSelectedPincode] = useState<string>('560034');
  const [language, setLanguage] = useState<Language>('en');
  
  // Data states
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [wards, setWards] = useState<WardData[]>([]);
  const [defects, setDefects] = useState<RoadDefectReport[]>([]);

  // State selection handler
  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
    const cities = getCitiesByState(stateId);
    if (cities && cities.length > 0) {
      const firstCity = cities[0];
      setSelectedCity(firstCity.id);
      if (firstCity.defaultPincode) {
        setSelectedPincode(firstCity.defaultPincode);
      }
    }
  };

  // City selection handler with automatic PIN mapping
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    const cityObj = getCityById(cityId);
    if (cityObj) {
      if (cityObj.stateId) {
        setSelectedState(cityObj.stateId);
      }
      if (cityObj.defaultPincode) {
        setSelectedPincode(cityObj.defaultPincode);
      }
    }
  };

  // Pincode selection with auto-detection of state and city
  const handlePincodeChange = (pin: string) => {
    setSelectedPincode(pin);
    const match = findStateAndCityByPincode(pin);
    if (match) {
      setSelectedState(match.state.id);
      setSelectedCity(match.city.id);
    }
    if (pin && activeTab !== 'pincode' && activeTab !== 'claim-reality') {
      setActiveTab('pincode');
    }
  };

  // Modals & Active selections
  const [selectedContractorForModal, setSelectedContractorForModal] = useState<Contractor | null>(null);
  const [selectedContractorForAction, setSelectedContractorForAction] = useState<Contractor | null>(null);
  const [selectedWorkOrderForReport, setSelectedWorkOrderForReport] = useState<WorkOrder | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isAnonymousDropOpen, setIsAnonymousDropOpen] = useState<boolean>(false);
  const [whatsAppCardData, setWhatsAppCardData] = useState<WhatsAppCardData | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(['cont-001', 'cont-006']);

  // Fetch live state from API on load — with deterministic mock fallback
  const refreshData = async () => {
    const fallback = generateMockContractorDataset(selectedPincode);
    let hasRealData = false;
    try {
      const [cRes, wRes, warRes, dRes] = await Promise.all([
        fetch('/api/contractors'),
        fetch('/api/work-orders'),
        fetch('/api/wards'),
        fetch('/api/defects'),
      ]);
      if (cRes.ok) { const j = await cRes.json(); if (Array.isArray(j) && j.length) { setContractors(j); hasRealData = true; } }
      if (wRes.ok) { const j = await wRes.json(); if (Array.isArray(j) && j.length) setWorkOrders(j); }
      if (warRes.ok) { const j = await warRes.json(); if (Array.isArray(j) && j.length) setWards(j); }
      if (dRes.ok) { const j = await dRes.json(); if (Array.isArray(j) && j.length) setDefects(j); }
    } catch (err) {
      console.warn('Using local dataset fallback:', err);
    }
    if (!hasRealData) {
      // Seed with PIN-driven deterministic mocks so UI never blank
      setContractors(fallback.contractors);
      setWorkOrders(fallback.workOrders);
      setWards(fallback.wards);
      setDefects(fallback.defects);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Keep mock in sync with PIN when using local fallback
  useEffect(() => {
    const fallback = generateMockContractorDataset(selectedPincode);
    // If we are in mock mode (no real API), keep ward/pincode sync
    if (contractors.length && contractors[0]?.primaryPincode !== selectedPincode) {
      // Only overwrite if currently showing mock (heuristic: id starts with cont-)
      if (contractors[0].id.startsWith('cont-')) {
        setContractors(fallback.contractors);
        setWorkOrders(fallback.workOrders);
        setWards(fallback.wards);
        setDefects(fallback.defects);
      }
    }
  }, [selectedPincode]);

  // Handlers
  const handleOpenActionForContractor = (contractor: Contractor) => {
    setSelectedContractorForAction(contractor);
    setActiveTab('action');
  };

  const handleOpenActionForWorkOrder = (wo: WorkOrder) => {
    const matchedCont = contractors.find(c => c.id === wo.contractorId) || contractors[0];
    setSelectedContractorForAction(matchedCont);
    setActiveTab('action');
  };

  const handleOpenReportForWorkOrder = (wo: WorkOrder) => {
    setSelectedWorkOrderForReport(wo);
    setIsReportModalOpen(true);
  };

  const handleOpenWhatsAppModal = (card: WhatsAppCardData) => {
    setWhatsAppCardData(card);
    setIsWhatsAppModalOpen(true);
  };

  const handleAnonymousReportSubmitted = (newReport: RoadDefectReport) => {
    setDefects(prev => [newReport, ...prev]);
  };

  const handleToggleCompare = (contractorId: string) => {
    if (selectedCompareIds.includes(contractorId)) {
      setSelectedCompareIds(prev => prev.filter(id => id !== contractorId));
    } else {
      if (selectedCompareIds.length >= 3) {
        setSelectedCompareIds(prev => [...prev.slice(1), contractorId]);
      } else {
        setSelectedCompareIds(prev => [...prev, contractorId]);
      }
      setActiveTab('compare');
    }
  };

  const activeDlpBreachesCount = contractors.reduce((acc, c) => acc + c.activeDlpViolationsCount, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#D43F33] selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedState={selectedState}
        setSelectedState={handleStateChange}
        selectedCity={selectedCity}
        setSelectedCity={handleCityChange}
        selectedPincode={selectedPincode}
        onSelectPincode={handlePincodeChange}
        language={language}
        setLanguage={setLanguage}
        onOpenReportModal={() => {
          setSelectedWorkOrderForReport(null);
          setIsReportModalOpen(true);
        }}
        onOpenAnonymousDrop={() => setIsAnonymousDropOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        activeDlpBreaches={activeDlpBreachesCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Executive Metrics Overview */}
        <MetricsOverview
          contractors={contractors}
          workOrders={workOrders}
          defects={defects}
          onFilterDlpBreach={() => setActiveTab('claim-reality')}
        />

        {/* 1. Claim vs Reality View */}
        {activeTab === 'claim-reality' && (
          <ClaimVsRealityView
            language={language}
            selectedPincode={selectedPincode}
            onSelectPincode={setSelectedPincode}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
            onOpenAnonymousDrop={() => setIsAnonymousDropOpen(true)}
            onSelectContractor={(c) => setSelectedContractorForModal(c)}
            contractors={contractors}
          />
        )}

        {/* 2. PIN Code Primary Key Dashboard */}
        {activeTab === 'pincode' && (
          <PincodeDashboard
            language={language}
            selectedPincode={selectedPincode}
            onSelectPincode={setSelectedPincode}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
            onOpenAnonymousDrop={() => setIsAnonymousDropOpen(true)}
            onSelectContractor={(c) => setSelectedContractorForModal(c)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            contractors={contractors}
            workOrders={workOrders}
          />
        )}

        {/* 3. Contractor Leaderboard */}
        {activeTab === 'leaderboard' && (
          <ContractorLeaderboard
            contractors={contractors}
            onSelectContractor={(c) => setSelectedContractorForModal(c)}
            onGenerateAction={handleOpenActionForContractor}
            onCompareContractors={handleToggleCompare}
            selectedCompareIds={selectedCompareIds}
          />
        )}

        {/* 4. Ward Map */}
        {activeTab === 'map' && (
          <InteractiveWardMap
            wards={wards}
            workOrders={workOrders}
            defects={defects}
            contractors={contractors}
            onSelectWorkOrder={(wo) => {
              const matched = contractors.find(c => c.id === wo.contractorId);
              if (matched) setSelectedContractorForModal(matched);
            }}
            onOpenReportModalWithWorkOrder={handleOpenReportForWorkOrder}
            onGenerateActionWithWorkOrder={handleOpenActionForWorkOrder}
          />
        )}

        {/* 5. Citizen Action / RTI */}
        {activeTab === 'action' && (
          <CitizenActionGenerator
            contractors={contractors}
            workOrders={workOrders}
            defects={defects}
            preselectedContractor={selectedContractorForAction}
          />
        )}

        {/* 6. AI Tender Scrutiny */}
        {activeTab === 'ai-audit' && (
          <AiTenderAudit
            workOrders={workOrders}
            contractors={contractors}
            onSelectContractorForAction={handleOpenActionForContractor}
          />
        )}

        {/* 7. Compare */}
        {activeTab === 'compare' && (
          <ContractorComparison
            contractors={contractors}
            selectedCompareIds={selectedCompareIds}
            onRemoveFromCompare={(id) => setSelectedCompareIds(prev => prev.filter(item => item !== id))}
            onAddToCompare={(id) => setSelectedCompareIds(prev => [...prev, id])}
            onGenerateAction={handleOpenActionForContractor}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1A1A1A] bg-white py-6 text-center text-xs font-mono text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold uppercase">
            {getTranslation(language, 'brandTitle')} • {getTranslation(language, 'brandSubtitle')}
          </p>
          <div className="flex items-center space-x-4 text-xs font-bold uppercase">
            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-[#D43F33] transition-colors underline decoration-1">
              IRC SP:98 Standards
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('action')} className="hover:text-[#D43F33] transition-colors underline decoration-1">
              RTI Section 6(1)
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('claim-reality')} className="hover:text-[#D43F33] transition-colors underline decoration-1">
              {getTranslation(language, 'navClaimsVsReality')}
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Share Card Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        cardData={whatsAppCardData}
        language={language}
      />

      {/* Anonymous Ground Truth Photo Drop Modal */}
      <AnonymousPhotoDropModal
        isOpen={isAnonymousDropOpen}
        onClose={() => setIsAnonymousDropOpen(false)}
        language={language}
        onReportSubmitted={handleAnonymousReportSubmitted}
      />

      {/* Contractor Detail Modal */}
      <ContractorModal
        contractor={selectedContractorForModal}
        workOrders={workOrders}
        defects={defects}
        onClose={() => setSelectedContractorForModal(null)}
        onGenerateAction={handleOpenActionForContractor}
      />

      {/* Citizen Report Failure Modal */}
      <ReportFailureModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        workOrders={workOrders}
        preselectedWorkOrder={selectedWorkOrderForReport}
        onSubmitSuccess={refreshData}
      />

      {/* About & Methodology Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

    </div>
  );
}
