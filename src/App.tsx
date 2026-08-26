import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
const AboutPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.AboutPage })));

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
                <Route path="/explore" element={<AboutPage />} />
                <Route path="/about" element={<AboutPage />} />
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