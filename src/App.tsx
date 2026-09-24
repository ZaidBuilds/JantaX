import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './core/context/LanguageContext';
import { PinProvider } from './core/context/PinContext';
import { ThemeProvider } from './core/context/ThemeContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { DataStateProvider } from './components/data-states/DataStateProvider';
import { Header } from './shell/Header';
import { Footer } from './shell/Footer';
import { StatusBanner } from './shell/StatusBanner';
import { ScrollToTop } from './shell/ScrollToTop';
import { ToastProvider } from './ui/Toast';
import { ModuleFrame } from './pages/ModuleFrame';

/** Lazy-load a named export. */
function page<T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) {
  return lazy(() => loader().then((m) => ({ default: m[name] as unknown as ComponentType })));
}

// Core
const Home = page(() => import('./pages/Home'), 'Home');
const ExplorePage = page(() => import('./pages/ExplorePage'), 'ExplorePage');
const SearchPage = page(() => import('./pages/SearchPage'), 'SearchPage');
const PinDashboard = page(() => import('./pages/PinDashboard'), 'PinDashboard');
const ComparePage = page(() => import('./pages/ComparePage'), 'ComparePage');
const MapExplorer = page(() => import('./pages/MapExplorer'), 'MapExplorer');
const ModulePage = page(() => import('./pages/ModulePage'), 'ModulePage');
const NotFoundPage = page(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Schools
const SchoolsDirectory = page(() => import('./pages/SchoolsDirectory'), 'SchoolsDirectory');
const SchoolsSearchPage = page(() => import('./pages/schools/SchoolsSearchPage'), 'SchoolsSearchPage');
const SchoolsComparePage = page(() => import('./pages/schools/SchoolsComparePage'), 'SchoolsComparePage');
const SchoolProfilePage = page(() => import('./pages/schools/SchoolProfilePage'), 'SchoolProfilePage');
const SchoolMethodologyPage = page(() => import('./pages/schools/SchoolMethodologyPage'), 'SchoolMethodologyPage');

// Reports
const ReportsPage = page(() => import('./pages/ReportsPage'), 'ReportsPage');
const CitizenReportingPage = page(() => import('./modules/reporting/pages/CitizenReportingPage'), 'CitizenReportingPage');
const ReportDetailPage = page(() => import('./modules/reporting/pages/ReportDetailPage'), 'ReportDetailPage');

// Static & transparency
const AboutPage = page(() => import('./pages/StaticPages'), 'AboutPage');
const PrivacyPage = page(() => import('./pages/StaticPages'), 'PrivacyPage');
const SourcesPage = page(() => import('./modules/transparency/pages/SourcesPage'), 'SourcesPage');
const MethodologyPage = page(() => import('./modules/transparency/pages/MethodologyPage'), 'MethodologyPage');
const ScoringPage = page(() => import('./modules/transparency/pages/ScoringPage'), 'ScoringPage');
const EvidenceStandardsPage = page(() => import('./modules/transparency/pages/EvidenceStandardsPage'), 'EvidenceStandardsPage');
const DataFreshnessPage = page(() => import('./modules/transparency/pages/DataFreshnessPage'), 'DataFreshnessPage');
const CorrectionsPage = page(() => import('./modules/transparency/pages/CorrectionsPage'), 'CorrectionsPage');
const AdminPage = page(() => import('./pages/Admin'), 'AdminPage');

// Module sub-pages (directories, detail views, compare, guides)
const ProjectsDirectoryPage = page(() => import('./modules/infra/pages/ProjectsDirectoryPage'), 'ProjectsDirectoryPage');
const ProjectsSearchPage = page(() => import('./modules/infra/pages/ProjectsSearchPage'), 'ProjectsSearchPage');
const ProjectDetailPage = page(() => import('./modules/infra/pages/ProjectDetailPage'), 'ProjectDetailPage');
const ContractorsDirectoryPage = page(() => import('./modules/contractor/pages/ContractorsDirectoryPage'), 'ContractorsDirectoryPage');
const ContractorProfilePage = page(() => import('./modules/contractor/pages/ContractorProfilePage'), 'ContractorProfilePage');
const ContractorComparePage = page(() => import('./modules/contractor/pages/ContractorComparePage'), 'ContractorComparePage');
const ReraDirectoryPage = page(() => import('./modules/rera/pages/ReraDirectoryPage'), 'ReraDirectoryPage');
const ReraSearchPage = page(() => import('./modules/rera/pages/ReraSearchPage'), 'ReraSearchPage');
const ReraComparePage = page(() => import('./modules/rera/pages/ReraComparePage'), 'ReraComparePage');
const ReraProjectDetailPage = page(() => import('./modules/rera/pages/ReraProjectDetailPage'), 'ReraProjectDetailPage');
const ReraBuilderProfilePage = page(() => import('./modules/rera/pages/ReraBuilderProfilePage'), 'ReraBuilderProfilePage');
const CourtDetailPage = page(() => import('./modules/courts/pages/CourtDetailPage'), 'CourtDetailPage');
const CourtsComparePage = page(() => import('./modules/courts/pages/CourtsComparePage'), 'CourtsComparePage');
const CnrGuidePage = page(() => import('./modules/courts/pages/CnrGuidePage'), 'CnrGuidePage');
const AuthorityDetailPage = page(() => import('./modules/rti/pages/AuthorityDetailPage'), 'AuthorityDetailPage');
const RtiComparePage = page(() => import('./modules/rti/pages/RtiComparePage'), 'RtiComparePage');
const RtiDraftPage = page(() => import('./modules/rti/pages/RtiDraftPage'), 'RtiDraftPage');
const MpladsComparePage = page(() => import('./modules/mplads/pages/MpladsComparePage'), 'MpladsComparePage');
const MpladsProjectDetailPage = page(() => import('./modules/mplads/pages/MpladsProjectDetailPage'), 'MpladsProjectDetailPage');
const RepresentativeProfilePage = page(() => import('./modules/mplads/pages/RepresentativeProfilePage'), 'RepresentativeProfilePage');
const WardDetailPage = page(() => import('./modules/nagar/pages/WardDetailPage'), 'WardDetailPage');
const WardComparePage = page(() => import('./modules/nagar/pages/WardComparePage'), 'WardComparePage');
const CivicComplaintPage = page(() => import('./modules/nagar/pages/CivicComplaintPage'), 'CivicComplaintPage');
const StationDetailPage = page(() => import('./modules/pollution/pages/StationDetailPage'), 'StationDetailPage');
const PollutionComparePage = page(() => import('./modules/pollution/pages/PollutionComparePage'), 'PollutionComparePage');
const GrapGuidePage = page(() => import('./modules/pollution/pages/GrapGuidePage'), 'GrapGuidePage');
const BoothDetailPage = page(() => import('./modules/booth/pages/BoothDetailPage'), 'BoothDetailPage');
const VoterServicesGuidePage = page(() => import('./modules/booth/pages/VoterServicesGuidePage'), 'VoterServicesGuidePage');
const MonitoringDashboardPage = page(() => import('./modules/monitoring/pages/MonitoringDashboardPage'), 'MonitoringDashboardPage');

function RouteLoading() {
  return (
    <div className="route-loading" role="status">
      <span className="spinner" aria-hidden="true" />
      Loading records…
    </div>
  );
}

/** Wraps a module sub-page in the shared module header and sub-navigation. */
function InModule({ id, children }: { id: string; children: ReactNode }) {
  return <ModuleFrame moduleId={id}>{children}</ModuleFrame>;
}

function LegacySchoolProfileRedirect() {
  const { schoolId } = useParams();
  return <Navigate to={`/schools/${schoolId}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/pin/:pinCode" element={<PinDashboard />} />
      <Route path="/location" element={<PinDashboard />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/maps" element={<MapExplorer />} />
      <Route path="/map" element={<Navigate to="/maps" replace />} />
      <Route path="/module/:moduleId" element={<ModulePage />} />

      {/* Schools */}
      <Route path="/schools" element={<SchoolsDirectory />} />
      <Route path="/schools/search" element={<InModule id="school"><SchoolsSearchPage /></InModule>} />
      <Route path="/schools/compare" element={<InModule id="school"><SchoolsComparePage /></InModule>} />
      <Route path="/schools/methodology" element={<InModule id="school"><SchoolMethodologyPage /></InModule>} />
      <Route path="/schools/profile/:schoolId" element={<LegacySchoolProfileRedirect />} />
      <Route path="/schools/:id" element={<SchoolProfilePage />} />
      <Route path="/schools/:id/:tab" element={<SchoolProfilePage />} />

      {/* Roads and public works */}
      <Route path="/projects" element={<InModule id="infra"><ProjectsDirectoryPage /></InModule>} />
      <Route path="/projects/search" element={<InModule id="infra"><ProjectsSearchPage /></InModule>} />
      <Route path="/projects/:id" element={<InModule id="infra"><ProjectDetailPage /></InModule>} />
      <Route path="/projects/:id/:tab" element={<InModule id="infra"><ProjectDetailPage /></InModule>} />

      {/* Contractors */}
      <Route path="/contractors" element={<InModule id="contractor"><ContractorsDirectoryPage /></InModule>} />
      <Route path="/contractors/compare" element={<InModule id="contractor"><ContractorComparePage /></InModule>} />
      <Route path="/contractors/:id" element={<InModule id="contractor"><ContractorProfilePage /></InModule>} />
      <Route path="/contractors/:id/:tab" element={<InModule id="contractor"><ContractorProfilePage /></InModule>} />

      {/* RERA */}
      <Route path="/rera" element={<InModule id="rera"><ReraDirectoryPage /></InModule>} />
      <Route path="/rera/search" element={<InModule id="rera"><ReraSearchPage /></InModule>} />
      <Route path="/rera/compare" element={<InModule id="rera"><ReraComparePage /></InModule>} />
      <Route path="/rera/projects/:id" element={<InModule id="rera"><ReraProjectDetailPage /></InModule>} />
      <Route path="/rera/projects/:id/:tab" element={<InModule id="rera"><ReraProjectDetailPage /></InModule>} />
      <Route path="/rera/builders/:id" element={<InModule id="rera"><ReraBuilderProfilePage /></InModule>} />
      <Route path="/rera/builders/:id/:tab" element={<InModule id="rera"><ReraBuilderProfilePage /></InModule>} />

      {/* Courts */}
      <Route path="/courts" element={<Navigate to="/module/courts" replace />} />
      <Route path="/courts/compare" element={<InModule id="courts"><CourtsComparePage /></InModule>} />
      <Route path="/courts/cnr-guide" element={<InModule id="courts"><CnrGuidePage /></InModule>} />
      <Route path="/courts/:id" element={<InModule id="courts"><CourtDetailPage /></InModule>} />

      {/* RTI */}
      <Route path="/rti" element={<Navigate to="/module/rti" replace />} />
      <Route path="/rti/compare" element={<InModule id="rti"><RtiComparePage /></InModule>} />
      <Route path="/rti/draft" element={<InModule id="rti"><RtiDraftPage /></InModule>} />
      <Route path="/rti/authorities/:id" element={<InModule id="rti"><AuthorityDetailPage /></InModule>} />

      {/* MP / MLA funds */}
      <Route path="/mplads" element={<Navigate to="/module/mplads" replace />} />
      <Route path="/mplads/compare" element={<InModule id="mplads"><MpladsComparePage /></InModule>} />
      <Route path="/mplads/projects/:id" element={<InModule id="mplads"><MpladsProjectDetailPage /></InModule>} />
      <Route path="/mplads/representatives/:id" element={<InModule id="mplads"><RepresentativeProfilePage /></InModule>} />

      {/* Wards */}
      <Route path="/nagar" element={<Navigate to="/module/nagar" replace />} />
      <Route path="/nagar/compare" element={<InModule id="nagar"><WardComparePage /></InModule>} />
      <Route path="/nagar/complaint" element={<InModule id="nagar"><CivicComplaintPage /></InModule>} />
      <Route path="/nagar/wards/:id" element={<InModule id="nagar"><WardDetailPage /></InModule>} />

      {/* Air quality */}
      <Route path="/pollution" element={<Navigate to="/module/pollution" replace />} />
      <Route path="/pollution/compare" element={<InModule id="pollution"><PollutionComparePage /></InModule>} />
      <Route path="/pollution/grap" element={<InModule id="pollution"><GrapGuidePage /></InModule>} />
      <Route path="/pollution/stations/:id" element={<InModule id="pollution"><StationDetailPage /></InModule>} />

      {/* Polling booths */}
      <Route path="/booth" element={<Navigate to="/module/booth" replace />} />
      <Route path="/booth/voter-services" element={<InModule id="booth"><VoterServicesGuidePage /></InModule>} />
      <Route path="/booth/:id" element={<InModule id="booth"><BoothDetailPage /></InModule>} />

      {/* Short module aliases used in older links */}
      <Route path="/power" element={<Navigate to="/module/utility" replace />} />
      <Route path="/land" element={<Navigate to="/module/land" replace />} />
      <Route path="/air" element={<Navigate to="/module/pollution" replace />} />

      {/* Reports and citizen evidence */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/reports/:id" element={<ReportDetailPage />} />
      <Route path="/reports/:id/action" element={<ReportDetailPage />} />
      <Route path="/report-issue" element={<CitizenReportingPage />} />
      <Route path="/evidence/submitted" element={<Navigate to="/reports" replace />} />

      {/* Transparency */}
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/data-sources" element={<Navigate to="/sources" replace />} />
      <Route path="/transparency" element={<Navigate to="/transparency/methodology" replace />} />
      <Route path="/transparency/methodology" element={<MethodologyPage />} />
      <Route path="/transparency/scoring" element={<ScoringPage />} />
      <Route path="/transparency/evidence" element={<EvidenceStandardsPage />} />
      <Route path="/transparency/freshness" element={<DataFreshnessPage />} />
      <Route path="/transparency/corrections" element={<CorrectionsPage />} />

      {/* Static and admin */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/monitoring" element={<InModule id="monitoring"><MonitoringDashboardPage /></InModule>} />
      <Route path="/monitoring/:view" element={<InModule id="monitoring"><MonitoringDashboardPage /></InModule>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <PinProvider>
            <DataStateProvider>
              <ToastProvider>
                <ScrollToTop />
                <div className="app">
                  <Header />
                  <StatusBanner />
                  <main id="main" className="app-main" tabIndex={-1}>
                    <ErrorBoundary>
                      <Suspense fallback={<RouteLoading />}>
                        <AppRoutes />
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                  <Footer />
                </div>
              </ToastProvider>
            </DataStateProvider>
          </PinProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
