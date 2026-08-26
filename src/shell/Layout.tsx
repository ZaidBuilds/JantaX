import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbs?: { label: string; path?: string }[];
  maxWidth?: number;
}

export function Layout({ children, showBreadcrumbs = false, breadcrumbs, maxWidth = 1200 }: LayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <main
        id="main"
        style={{
          flex: 1,
          background: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            maxWidth,
            margin: '0 auto',
            padding: '0 1.25rem',
          }}
        >
          {showBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
