import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './core/context/LanguageContext';
import { PinProvider } from './core/context/PinContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { OfflineBanner } from './components/UI/OfflineBanner';
import { Header } from './shell/Header';
import { Footer } from './shell/Footer';
import { HelpBotWidget } from './components/helpbot/HelpBotWidget';
import { SihShowcaseBanner } from './components/sih/SihShowcaseBanner';
import { DataStateProvider } from './components/data-states/DataStateProvider';
import { Loader2 } from 'lucide-react';

// Core Pages
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const PinDashboard = lazy(() => import('./pages/PinDashboard').then((m) => ({ default: m.PinDashboard })));
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const MapExplorer = lazy(() => import('./pages/MapExplorer').then((m) => ({ default: m.MapExplorer })));
const LocationPage = lazy(() => import('./pages/LocationPage').then((m) => ({ default: m.LocationPage })));
const ModulePage = lazy(() => import('./pages/ModulePage').then((m) => ({ default: m.ModulePage })));

// Schools Pages
const SchoolsDirectory = lazy(() => import('./pages/SchoolsDirectory').then((m) => ({ default: m.SchoolsDirectory })));
const SchoolsSearchPage = lazy(() => import('./pages/schools/SchoolsSearchPage').then((m) => ({ default: m.SchoolsSearchPage })));
const SchoolsComparePage = lazy(() => import('./pages/schools/SchoolsComparePage').then((m) => ({ default: m.SchoolsComparePage })));
const SchoolProfilePage = lazy(() => import('./pages/schools/SchoolProfilePage').then((m) => ({ default: m.SchoolProfilePage })));
const SchoolMethodologyPage = lazy(() => import('./pages/schools/SchoolMethodologyPage').then((m) => ({ default: m.SchoolMethodologyPage })));

// Reports & Evidence Pages
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const CitizenReportingPage = lazy(() => import('./modules/reporting/pages/CitizenReportingPage').then((m) => ({ default: m.CitizenReportingPage })));
const ReportDetailPage = lazy(() => import('./modules/reporting/pages/ReportDetailPage').then((m) => ({ default: m.ReportDetailPage })));

// RERA Subsystem
const ReraDirectoryPage = lazy(() => import('./modules/rera/pages/ReraDirectoryPage').then((m) => ({ default: m.ReraDirectoryPage })));
const ReraSearchPage = lazy(() => import('./modules/rera/pages/ReraSearchPage').then((m) => ({ default: m.ReraSearchPage })));
const ReraProjectDetailPage = lazy(() => import('./modules/rera/pages/ReraProjectDetailPage').then((m) => ({ default: m.ReraProjectDetailPage })));
const ReraBuilderProfilePage = lazy(() => import('./modules/rera/pages/ReraBuilderProfilePage').then((m) => ({ default: m.ReraBuilderProfilePage })));
const ReraComparePage = lazy(() => import('./modules/rera/pages/ReraComparePage').then((m) => ({ default: m.ReraComparePage })));

// Infrastructure & Public Works
const ProjectsDirectoryPage = lazy(() => import('./modules/infra/pages/ProjectsDirectoryPage').then((m) => ({ default: m.ProjectsDirectoryPage })));
const ProjectsSearchPage = lazy(() => import('./modules/infra/pages/ProjectsSearchPage').then((m) => ({ default: m.ProjectsSearchPage })));
const ProjectDetailPage = lazy(() => import('./modules/infra/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));

// Contractors
const ContractorsDirectoryPage = lazy(() => import('./modules/contractor/pages/ContractorsDirectoryPage').then((m) => ({ default: m.ContractorsDirectoryPage })));
const ContractorProfilePage = lazy(() => import('./modules/contractor/pages/ContractorProfilePage').then((m) => ({ default: m.ContractorProfilePage })));
const ContractorComparePage = lazy(() => import('./modules/contractor/pages/ContractorComparePage').then((m) => ({ default: m.ContractorComparePage })));

// RTI Subsystem
const RtiDirectoryPage = lazy(() => import('./modules/rti/pages/RtiDirectoryPage').then((m) => ({ default: m.RtiDirectoryPage })));
const RtiDraftPage = lazy(() => import('./modules/rti/pages/RtiDraftPage').then((m) => ({ default: m.RtiDraftPage })));
const AuthorityDetailPage = lazy(() => import('./modules/rti/pages/AuthorityDetailPage').then((m) => ({ default: m.AuthorityDetailPage })));

// Pollution Subsystem
const PollutionDirectoryPage = lazy(() => import('./modules/pollution/pages/PollutionDirectoryPage').then((m) => ({ default: m.PollutionDirectoryPage })));
const StationDetailPage = lazy(() => import('./modules/pollution/pages/StationDetailPage').then((m) => ({ default: m.StationDetailPage })));
const GrapGuidePage = lazy(() => import('./modules/pollution/pages/GrapGuidePage').then((m) => ({ default: m.GrapGuidePage })));

// Nagar Subsystem
const NagarDirectoryPage = lazy(() => import('./modules/nagar/pages/NagarDirectoryPage').then((m) => ({ default: m.NagarDirectoryPage })));
const WardDetailPage = lazy(() => import('./modules/nagar/pages/WardDetailPage').then((m) => ({ default: m.WardDetailPage })));
const CivicComplaintPage = lazy(() => import('./modules/nagar/pages/CivicComplaintPage').then((m) => ({ default: m.CivicComplaintPage })));

// MPLADS Subsystem
const MpladsDirectoryPage = lazy(() => import('./modules/mplads/pages/MpladsDirectoryPage').then((m) => ({ default: m.MpladsDirectoryPage })));
const MpladsProjectDetailPage = lazy(() => import('./modules/mplads/pages/MpladsProjectDetailPage').then((m) => ({ default: m.MpladsProjectDetailPage })));
const RepresentativeProfilePage = lazy(() => import('./modules/mplads/pages/RepresentativeProfilePage').then((m) => ({ default: m.RepresentativeProfilePage })));
const PeopleProfilePage = lazy(() => import('./pages/PeopleProfilePage').then((m) => ({ default: m.PeopleProfilePage })));
const CanonicalEntityPage = lazy(() => import('./pages/CanonicalEntityPage').then((m) => ({ default: m.CanonicalEntityPage })));

// Static & Transparency Pages
const AboutPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.AboutPage })));
const DataSourcesPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.DataSourcesPage })));
const PrivacyPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.PrivacyPage })));
const SourcesPage = lazy(() => import('./modules/transparency/pages/SourcesPage').then((m) => ({ default: m.SourcesPage })));
const MethodologyPage = lazy(() => import('./modules/transparency/pages/MethodologyPage').then((m) => ({ default: m.MethodologyPage })));
const ScoringPage = lazy(() => import('./modules/transparency/pages/ScoringPage').then((m) => ({ default: m.ScoringPage })));
const EvidenceStandardsPage = lazy(() => import('./modules/transparency/pages/EvidenceStandardsPage').then((m) => ({ default: m.EvidenceStandardsPage })));
const DataFreshnessPage = lazy(() => import('./modules/transparency/pages/DataFreshnessPage').then((m) => ({ default: m.DataFreshnessPage })));
const CorrectionsPage = lazy(() => import('./modules/transparency/pages/CorrectionsPage').then((m) => ({ default: m.CorrectionsPage })));
const AdminPage = lazy(() => import('./pages/Admin').then((m) => ({ default: m.AdminPage })));
const TicketTrackingPage = lazy(() => import('./pages/TicketTrackingPage').then((m) => ({ default: m.TicketTrackingPage })));
const AdminModerationPage = lazy(() => import('./pages/AdminModerationPage').then((m) => ({ default: m.AdminModerationPage })));
const RightToReplyPage = lazy(() => import('./pages/RightToReplyPage').then((m) => ({ default: m.RightToReplyPage })));
const SihPortalPage = lazy(() => import('./pages/SihPortalPage'));
const MapLensPage = lazy(() => import('./pages/MapLensPage').then((m) => ({ default: m.MapLensPage })));

// Newly wired module pages (built earlier, now routed)
const BoothDirectoryPage = lazy(() => import('./modules/booth/pages/BoothDirectoryPage').then((m) => ({ default: m.BoothDirectoryPage })));
const BoothDetailPage = lazy(() => import('./modules/booth/pages/BoothDetailPage').then((m) => ({ default: m.BoothDetailPage })));
const VoterServicesGuidePage = lazy(() => import('./modules/booth/pages/VoterServicesGuidePage').then((m) => ({ default: m.VoterServicesGuidePage })));
const CourtsDirectoryPage = lazy(() => import('./modules/courts/pages/CourtsDirectoryPage').then((m) => ({ default: m.CourtsDirectoryPage })));
const CnrGuidePage = lazy(() => import('./modules/courts/pages/CnrGuidePage').then((m) => ({ default: m.CnrGuidePage })));
const CourtDetailPage = lazy(() => import('./modules/courts/pages/CourtDetailPage').then((m) => ({ default: m.CourtDetailPage })));
const CourtsComparePage = lazy(() => import('./modules/courts/pages/CourtsComparePage').then((m) => ({ default: m.CourtsComparePage })));
const MpladsComparePage = lazy(() => import('./modules/mplads/pages/MpladsComparePage').then((m) => ({ default: m.MpladsComparePage })));
const WardComparePage = lazy(() => import('./modules/nagar/pages/WardComparePage').then((m) => ({ default: m.WardComparePage })));
const PollutionComparePage = lazy(() => import('./modules/pollution/pages/PollutionComparePage').then((m) => ({ default: m.PollutionComparePage })));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '1rem',
        color: 'var(--text-secondary)',
      }}
    >
      <Loader2
        size={32}
        style={{
          color: 'var(--color-primary)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading public records…</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppContent() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <SihShowcaseBanner />
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem', width: '100%' }}>
        <OfflineBanner />
      </div>
      <main
        id="main"
        style={{
          flex: 1,
          background: 'var(--bg-primary)',
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Home & Search */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Locality Canonical Routes (V1 Spec Section 6) */}
              <Route path="/pin/:pinCode" element={<PinDashboard />} />
              <Route path="/pin/:pinCode/people" element={<PeopleProfilePage />} />
              <Route path="/pin/:pinCode/schools" element={<SchoolsDirectory />} />
              <Route path="/pin/:pinCode/health" element={<PinDashboard />} />
              <Route path="/pin/:pinCode/works" element={<ProjectsDirectoryPage />} />
              <Route path="/pin/:pinCode/schemes" element={<PinDashboard />} />

              {/* Canonical Unified Entity Routes */}
              <Route path="/entity/:type/:id" element={<CanonicalEntityPage />} />
              <Route path="/entity/person/:id" element={<RepresentativeProfilePage />} />

              <Route path="/location" element={<LocationPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/maps" element={<MapExplorer />} />
              <Route path="/lens" element={<MapLensPage />} />

              {/* Dynamic Observatory Modules */}
              <Route path="/module/:moduleId" element={<ModulePage />} />

              {/* Schools Subsystem */}
              <Route path="/schools" element={<SchoolsDirectory />} />
              <Route path="/schools/search" element={<SchoolsSearchPage />} />
              <Route path="/schools/compare" element={<SchoolsComparePage />} />
              <Route path="/schools/profile/:schoolId" element={<SchoolProfilePage />} />
              <Route path="/schools/:pinCode/:schoolId" element={<SchoolProfilePage />} />
              <Route path="/schools/methodology" element={<SchoolMethodologyPage />} />

              {/* RERA Real Estate Subsystem */}
              <Route path="/rera" element={<ReraDirectoryPage />} />
              <Route path="/rera/search" element={<ReraSearchPage />} />
              <Route path="/rera/project/:id" element={<ReraProjectDetailPage />} />
              <Route path="/rera/projects/:id" element={<ReraProjectDetailPage />} />
              <Route path="/rera/builder/:builderName" element={<ReraBuilderProfilePage />} />
              <Route path="/rera/compare" element={<ReraComparePage />} />

              {/* Infrastructure & Public Works */}
              <Route path="/projects" element={<ProjectsDirectoryPage />} />
              <Route path="/projects/search" element={<ProjectsSearchPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/infra" element={<ProjectsDirectoryPage />} />

              {/* Contractors Transparency */}
              <Route path="/contractors" element={<ContractorsDirectoryPage />} />
              <Route path="/contractor/:id" element={<ContractorProfilePage />} />
              <Route path="/contractors/:id" element={<ContractorProfilePage />} />
              <Route path="/contractors/compare" element={<ContractorComparePage />} />

              {/* RTI & Information Access */}
              <Route path="/rti" element={<RtiDirectoryPage />} />
              <Route path="/rti/draft" element={<RtiDraftPage />} />
              <Route path="/rti/authority/:id" element={<AuthorityDetailPage />} />

              {/* Air Quality & Pollution */}
              <Route path="/pollution" element={<PollutionDirectoryPage />} />
              <Route path="/pollution/station/:id" element={<StationDetailPage />} />
              <Route path="/pollution/grap" element={<GrapGuidePage />} />
              <Route path="/pollution/compare" element={<PollutionComparePage />} />

              {/* Ward & Municipal Governance */}
              <Route path="/nagar" element={<NagarDirectoryPage />} />
              <Route path="/nagar/ward/:id" element={<WardDetailPage />} />
              <Route path="/nagar/complaint" element={<CivicComplaintPage />} />
              <Route path="/nagar/compare" element={<WardComparePage />} />

              {/* Polling Booth & BLO Directory */}
              <Route path="/booth" element={<BoothDirectoryPage />} />
              <Route path="/booth/voter-services" element={<VoterServicesGuidePage />} />
              <Route path="/booth/:id" element={<BoothDetailPage />} />

              {/* Courts & Judicial Info */}
              <Route path="/courts" element={<CourtsDirectoryPage />} />
              <Route path="/courts/compare" element={<CourtsComparePage />} />
              <Route path="/courts/cnr" element={<CnrGuidePage />} />
              <Route path="/courts/:id" element={<CourtDetailPage />} />
              <Route path="/entity/organization/:id" element={<CanonicalEntityPage />} />

              {/* MPLADS Subsystem */}
              <Route path="/mplads" element={<MpladsDirectoryPage />} />
              <Route path="/mplads/project/:id" element={<MpladsProjectDetailPage />} />
              <Route path="/mplads/projects/:id" element={<MpladsProjectDetailPage />} />
              <Route path="/mplads/representatives/:id" element={<RepresentativeProfilePage />} />
              <Route path="/mplads/compare" element={<MpladsComparePage />} />

              {/* Reports & Citizen Evidence */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:reportId" element={<ReportDetailPage />} />
              <Route path="/report-issue" element={<CitizenReportingPage />} />
              <Route path="/track" element={<TicketTrackingPage />} />
              <Route path="/track/:ticketId" element={<TicketTrackingPage />} />
              <Route path="/admin/moderation" element={<AdminModerationPage />} />
              <Route path="/official-response" element={<RightToReplyPage />} />
              <Route path="/sih" element={<SihPortalPage />} />
              <Route path="/sih-2026" element={<Navigate to="/sih" replace />} />

              {/* Transparency & Governance */}
              <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/sources" element={<SourcesPage />} />
              <Route path="/transparency/methodology" element={<MethodologyPage />} />
              <Route path="/transparency/scoring" element={<ScoringPage />} />
              <Route path="/transparency/evidence" element={<EvidenceStandardsPage />} />
              <Route path="/transparency/freshness" element={<DataFreshnessPage />} />
              <Route path="/transparency/corrections" element={<CorrectionsPage />} />

              {/* Static & Admin */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <HelpBotWidget />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <PinProvider>
          <DataStateProvider>
            <AppContent />
          </DataStateProvider>
        </PinProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;