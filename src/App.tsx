import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './core/context/LanguageContext';
import { PinProvider } from './core/context/PinContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { OfflineBanner } from './components/UI/OfflineBanner';
import { Header } from './shell/Header';
import { Footer } from './shell/Footer';
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
              <Route path="/pin/:pinCode" element={<PinDashboard />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/maps" element={<MapExplorer />} />

              {/* Dynamic Observatory Modules */}
              <Route path="/module/:moduleId" element={<ModulePage />} />

              {/* Schools Subsystem */}
              <Route path="/schools" element={<SchoolsDirectory />} />
              <Route path="/schools/search" element={<SchoolsSearchPage />} />
              <Route path="/schools/compare" element={<SchoolsComparePage />} />
              <Route path="/schools/profile/:schoolId" element={<SchoolProfilePage />} />
              <Route path="/schools/methodology" element={<SchoolMethodologyPage />} />

              {/* Reports & Citizen Evidence */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:reportId" element={<ReportDetailPage />} />
              <Route path="/report-issue" element={<CitizenReportingPage />} />

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