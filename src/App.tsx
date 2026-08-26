import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './core/context/LanguageContext';
import { PinProvider } from './core/context/PinContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { OfflineBanner } from './components/UI/OfflineBanner';
import { Header } from './shell/Header';
import { Footer } from './shell/Footer';
import { DataStateProvider } from './components/data-states/DataStateProvider';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const LocationPage = lazy(() => import('./pages/LocationPage').then(m => ({ default: m.LocationPage })));
const PinDashboard = lazy(() => import('./pages/PinDashboard').then(m => ({ default: m.PinDashboard })));
const MapExplorer = lazy(() => import('./pages/MapExplorer').then(m => ({ default: m.MapExplorer })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const SchoolsDirectory = lazy(() => import('./pages/SchoolsDirectory').then(m => ({ default: m.SchoolsDirectory })));
const SchoolsSearchPage = lazy(() => import('./pages/schools/SchoolsSearchPage').then(m => ({ default: m.SchoolsSearchPage })));
const SchoolProfilePage = lazy(() => import('./pages/schools/SchoolProfilePage').then(m => ({ default: m.SchoolProfilePage })));
const SchoolsComparePage = lazy(() => import('./pages/schools/SchoolsComparePage').then(m => ({ default: m.SchoolsComparePage })));
const SchoolMethodologyPage = lazy(() => import('./pages/schools/SchoolMethodologyPage').then(m => ({ default: m.SchoolMethodologyPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const InfraApp = lazy(() => import('./modules/infra/InfraApp').then(m => ({ default: m.InfraApp })));
const ProjectsDirectoryPage = lazy(() => import('./modules/infra/pages/ProjectsDirectoryPage').then(m => ({ default: m.ProjectsDirectoryPage })));
const ProjectsSearchPage = lazy(() => import('./modules/infra/pages/ProjectsSearchPage').then(m => ({ default: m.ProjectsSearchPage })));
const ProjectDetailPage = lazy(() => import('./modules/infra/pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const ContractorsDirectoryPage = lazy(() => import('./modules/contractor/pages/ContractorsDirectoryPage').then(m => ({ default: m.ContractorsDirectoryPage })));
const ContractorProfilePage = lazy(() => import('./modules/contractor/pages/ContractorProfilePage').then(m => ({ default: m.ContractorProfilePage })));
const ContractorComparePage = lazy(() => import('./modules/contractor/pages/ContractorComparePage').then(m => ({ default: m.ContractorComparePage })));
const ReraDirectoryPage = lazy(() => import('./modules/rera/pages/ReraDirectoryPage').then(m => ({ default: m.ReraDirectoryPage })));
const ReraSearchPage = lazy(() => import('./modules/rera/pages/ReraSearchPage').then(m => ({ default: m.ReraSearchPage })));
const ReraProjectDetailPage = lazy(() => import('./modules/rera/pages/ReraProjectDetailPage').then(m => ({ default: m.ReraProjectDetailPage })));
const ReraBuilderProfilePage = lazy(() => import('./modules/rera/pages/ReraBuilderProfilePage').then(m => ({ default: m.ReraBuilderProfilePage })));
const ReraComparePage = lazy(() => import('./modules/rera/pages/ReraComparePage').then(m => ({ default: m.ReraComparePage })));
const CitizenReportingPage = lazy(() => import('./modules/reporting/pages/CitizenReportingPage').then(m => ({ default: m.CitizenReportingPage })));
const ReportDetailPage = lazy(() => import('./modules/reporting/pages/ReportDetailPage').then(m => ({ default: m.ReportDetailPage })));
const SourcesPage = lazy(() => import('./modules/transparency/pages/SourcesPage').then(m => ({ default: m.SourcesPage })));
const MethodologyPage = lazy(() => import('./modules/transparency/pages/MethodologyPage').then(m => ({ default: m.MethodologyPage })));
const DataFreshnessPage = lazy(() => import('./modules/transparency/pages/DataFreshnessPage').then(m => ({ default: m.DataFreshnessPage })));
const EvidenceStandardsPage = lazy(() => import('./modules/transparency/pages/EvidenceStandardsPage').then(m => ({ default: m.EvidenceStandardsPage })));
const ScoringPage = lazy(() => import('./modules/transparency/pages/ScoringPage').then(m => ({ default: m.ScoringPage })));
const CorrectionsPage = lazy(() => import('./modules/transparency/pages/CorrectionsPage').then(m => ({ default: m.CorrectionsPage })));
const MonitoringDashboardPage = lazy(() => import('./modules/monitoring/pages/MonitoringDashboardPage').then(m => ({ default: m.MonitoringDashboardPage })));
const SchoolModulePage = lazy(() => import('./pages/SchoolModulePage').then(m => ({ default: m.SchoolModulePage })));
const AndhbhaktDash = lazy(() => import('./modules/andhbhakt').then(m => ({ default: m.AndhbhaktDash })));
const ContractorApp = lazy(() => import('./modules/contractor').then(m => ({ default: m.ContractorApp })));
const CpgramsDashboard = lazy(() => import('./modules/grievance').then(m => ({ default: m.CpgramsDashboard })));
const BudgetDashboard = lazy(() => import('./modules/budget').then(m => ({ default: m.BudgetDashboard })));
const RationDashboard = lazy(() => import('./modules/ration').then(m => ({ default: m.RationDashboard })));
const HospitalDashboard = lazy(() => import('./modules/hospital').then(m => ({ default: m.HospitalDashboard })));
const ReraDashboard = lazy(() => import('./modules/rera').then(m => ({ default: m.ReraDashboard })));
const NagarDirectoryPage = lazy(() => import('./modules/nagar/pages/NagarDirectoryPage').then(m => ({ default: m.NagarDirectoryPage })));
const WardDetailPage = lazy(() => import('./modules/nagar/pages/WardDetailPage').then(m => ({ default: m.WardDetailPage })));
const CivicComplaintPage = lazy(() => import('./modules/nagar/pages/CivicComplaintPage').then(m => ({ default: m.CivicComplaintPage })));
const WardComparePage = lazy(() => import('./modules/nagar/pages/WardComparePage').then(m => ({ default: m.WardComparePage })));
const UtilityDashboard = lazy(() => import('./modules/utility').then(m => ({ default: m.UtilityDashboard })));
const LandDashboard = lazy(() => import('./modules/land').then(m => ({ default: m.LandDashboard })));
const PollutionDirectoryPage = lazy(() => import('./modules/pollution/pages/PollutionDirectoryPage').then(m => ({ default: m.PollutionDirectoryPage })));
const StationDetailPage = lazy(() => import('./modules/pollution/pages/StationDetailPage').then(m => ({ default: m.StationDetailPage })));
const GrapGuidePage = lazy(() => import('./modules/pollution/pages/GrapGuidePage').then(m => ({ default: m.GrapGuidePage })));
const PollutionComparePage = lazy(() => import('./modules/pollution/pages/PollutionComparePage').then(m => ({ default: m.PollutionComparePage })));
const RtiDirectoryPage = lazy(() => import('./modules/rti/pages/RtiDirectoryPage').then(m => ({ default: m.RtiDirectoryPage })));
const AuthorityDetailPage = lazy(() => import('./modules/rti/pages/AuthorityDetailPage').then(m => ({ default: m.AuthorityDetailPage })));
const RtiDraftPage = lazy(() => import('./modules/rti/pages/RtiDraftPage').then(m => ({ default: m.RtiDraftPage })));
const RtiComparePage = lazy(() => import('./modules/rti/pages/RtiComparePage').then(m => ({ default: m.RtiComparePage })));
const MpladsDirectoryPage = lazy(() => import('./modules/mplads/pages/MpladsDirectoryPage').then(m => ({ default: m.MpladsDirectoryPage })));
const RepresentativeProfilePage = lazy(() => import('./modules/mplads/pages/RepresentativeProfilePage').then(m => ({ default: m.RepresentativeProfilePage })));
const MpladsProjectDetailPage = lazy(() => import('./modules/mplads/pages/MpladsProjectDetailPage').then(m => ({ default: m.MpladsProjectDetailPage })));
const MpladsComparePage = lazy(() => import('./modules/mplads/pages/MpladsComparePage').then(m => ({ default: m.MpladsComparePage })));
const BoothDirectoryPage = lazy(() => import('./modules/booth/pages/BoothDirectoryPage').then(m => ({ default: m.BoothDirectoryPage })));
const BoothDetailPage = lazy(() => import('./modules/booth/pages/BoothDetailPage').then(m => ({ default: m.BoothDetailPage })));
const VoterServicesGuidePage = lazy(() => import('./modules/booth/pages/VoterServicesGuidePage').then(m => ({ default: m.VoterServicesGuidePage })));
const CourtsDirectoryPage = lazy(() => import('./modules/courts/pages/CourtsDirectoryPage').then(m => ({ default: m.CourtsDirectoryPage })));
const CourtDetailPage = lazy(() => import('./modules/courts/pages/CourtDetailPage').then(m => ({ default: m.CourtDetailPage })));
const CnrGuidePage = lazy(() => import('./modules/courts/pages/CnrGuidePage').then(m => ({ default: m.CnrGuidePage })));
const CourtsComparePage = lazy(() => import('./modules/courts/pages/CourtsComparePage').then(m => ({ default: m.CourtsComparePage })));
const AboutPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.AboutPage })));
const DataSourcesPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.DataSourcesPage })));
const PrivacyPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.PrivacyPage })));
const ReportIssuePage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ReportIssuePage })));
const AdminPage = lazy(() => import('./pages/Admin').then(m => ({ default: m.AdminPage })));

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
      <p>Loading…</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ModuleRouter() {
  const location = useLocation();
  const path = location.pathname;
  const moduleId = path.split('/module/')[1]?.split('/')[0];

  const moduleMap: Record<string, React.ComponentType> = {
    infra: ProjectsDirectoryPage,
    school: SchoolModulePage,
    andhbhakt: AndhbhaktDash,
    contractor: ContractorsDirectoryPage,
    grievance: CpgramsDashboard,
    budget: BudgetDashboard,
    ration: RationDashboard,
    hospital: HospitalDashboard,
    rera: ReraDirectoryPage,
    nagar: NagarDirectoryPage,
    utility: UtilityDashboard,
    land: LandDashboard,
    pollution: PollutionDirectoryPage,
    rti: RtiDirectoryPage,
    mplads: MpladsDirectoryPage,
    booth: BoothDirectoryPage,
    courts: CourtsDirectoryPage,
  };

  const ModuleComponent = moduleId ? moduleMap[moduleId] : null;

  if (!ModuleComponent) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1.25rem',
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(249,115,22,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '1.8rem',
          }}
        >
          🚧
        </div>
        <h2
          style={{
            fontSize: '1.45rem',
            marginBottom: '0.4rem',
            color: 'var(--color-primary)',
          }}
        >
          जल्द आ रहा है — Coming Soon
        </h2>
        <p
          style={{
            opacity: 0.65,
            marginBottom: '1.5rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
          }}
        >
          Module <strong style={{ color: 'var(--text-primary)' }}>{moduleId}</strong> is being
          built.
          <br />
          Data sources are being connected.
        </p>
      </div>
    );
  }

  return <ModuleComponent />;
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
            <div className="page-enter">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/location/:pincode" element={<LocationPage />} />
                <Route path="/pin/:pinCode" element={<PinDashboard />} />
                <Route path="/maps" element={<MapExplorer />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/schools" element={<SchoolsDirectory />} />
                <Route path="/schools/search" element={<SchoolsSearchPage />} />
                <Route path="/schools/compare" element={<SchoolsComparePage />} />
                <Route path="/schools/:id" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/infrastructure" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/staffing" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/attendance" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/meals" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/learning" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/ground-truth" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/evidence" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/timeline" element={<SchoolProfilePage />} />
                <Route path="/schools/:id/reports" element={<SchoolProfilePage />} />
                <Route path="/schools/methodology" element={<SchoolMethodologyPage />} />
                <Route path="/projects" element={<ProjectsDirectoryPage />} />
                <Route path="/projects/search" element={<ProjectsSearchPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage initialTab="overview" />} />
                <Route path="/projects/:id/timeline" element={<ProjectDetailPage initialTab="timeline" />} />
                <Route path="/projects/:id/financials" element={<ProjectDetailPage initialTab="financials" />} />
                <Route path="/projects/:id/evidence" element={<ProjectDetailPage initialTab="evidence" />} />
                <Route path="/projects/:id/ground-truth" element={<ProjectDetailPage initialTab="ground-truth" />} />
                <Route path="/contractors" element={<ContractorsDirectoryPage />} />
                <Route path="/contractors/compare" element={<ContractorComparePage />} />
                <Route path="/contractors/:id" element={<ContractorProfilePage initialTab="overview" />} />
                <Route path="/contractors/:id/scorecard" element={<ContractorProfilePage initialTab="scorecard" />} />
                <Route path="/contractors/:id/projects" element={<ContractorProfilePage initialTab="projects" />} />
                <Route path="/contractors/:id/history" element={<ContractorProfilePage initialTab="history" />} />
                <Route path="/rera" element={<ReraDirectoryPage />} />
                <Route path="/rera/search" element={<ReraSearchPage />} />
                <Route path="/rera/projects/:id" element={<ReraProjectDetailPage initialTab="overview" />} />
                <Route path="/rera/projects/:id/orders" element={<ReraProjectDetailPage initialTab="orders" />} />
                <Route path="/rera/builders/:id" element={<ReraBuilderProfilePage initialTab="overview" />} />
                <Route path="/rera/builders/:id/track-record" element={<ReraBuilderProfilePage initialTab="track-record" />} />
                <Route path="/rera/compare" element={<ReraComparePage />} />
                <Route path="/mplads" element={<MpladsDirectoryPage />} />
                <Route path="/mplads/search" element={<MpladsDirectoryPage />} />
                <Route path="/mplads/representatives/:id" element={<RepresentativeProfilePage />} />
                <Route path="/mplads/projects/:id" element={<MpladsProjectDetailPage />} />
                <Route path="/mplads/compare" element={<MpladsComparePage />} />
                <Route path="/booth" element={<BoothDirectoryPage />} />
                <Route path="/booth/search" element={<BoothDirectoryPage />} />
                <Route path="/booth/services" element={<VoterServicesGuidePage />} />
                <Route path="/booth/:id" element={<BoothDetailPage />} />
                <Route path="/courts" element={<CourtsDirectoryPage />} />
                <Route path="/courts/search" element={<CourtsDirectoryPage />} />
                <Route path="/courts/cnr-guide" element={<CnrGuidePage />} />
                <Route path="/courts/compare" element={<CourtsComparePage />} />
                <Route path="/courts/:id" element={<CourtDetailPage />} />
                <Route path="/rti" element={<RtiDirectoryPage />} />
                <Route path="/rti/search" element={<RtiDirectoryPage />} />
                <Route path="/rti/draft" element={<RtiDraftPage />} />
                <Route path="/rti/compare" element={<RtiComparePage />} />
                <Route path="/rti/authorities/:id" element={<AuthorityDetailPage />} />
                <Route path="/nagar" element={<NagarDirectoryPage />} />
                <Route path="/nagar/search" element={<NagarDirectoryPage />} />
                <Route path="/nagar/report" element={<CivicComplaintPage />} />
                <Route path="/nagar/compare" element={<WardComparePage />} />
                <Route path="/nagar/wards/:id" element={<WardDetailPage />} />
                <Route path="/pollution" element={<PollutionDirectoryPage />} />
                <Route path="/pollution/search" element={<PollutionDirectoryPage />} />
                <Route path="/pollution/grap" element={<GrapGuidePage />} />
                <Route path="/pollution/compare" element={<PollutionComparePage />} />
                <Route path="/pollution/stations/:id" element={<StationDetailPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/report/new" element={<CitizenReportingPage />} />
                <Route path="/reports/:id" element={<ReportDetailPage activeTab="report" />} />
                <Route path="/reports/:id/action" element={<ReportDetailPage activeTab="action" />} />
                <Route path="/sources" element={<SourcesPage />} />
                <Route path="/methodology" element={<MethodologyPage />} />
                <Route path="/data-freshness" element={<DataFreshnessPage />} />
                <Route path="/evidence-standards" element={<EvidenceStandardsPage />} />
                <Route path="/scoring" element={<ScoringPage />} />
                <Route path="/corrections" element={<CorrectionsPage />} />
                <Route path="/monitoring" element={<MonitoringDashboardPage initialTab="all" />} />
                <Route path="/monitoring/alerts" element={<MonitoringDashboardPage initialTab="all" />} />
                <Route path="/monitoring/quarantine" element={<MonitoringDashboardPage initialTab="quarantine" />} />
                <Route path="/monitoring/snapshots" element={<MonitoringDashboardPage initialTab="snapshots" />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/data-sources" element={<DataSourcesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/module/*" element={<ModuleRouter />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function App() {
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
