import React from 'react';

interface Props { children: React.ReactNode; fallback?: React.ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ui:error-boundary]', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: '2rem', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bad-soft)', color: 'var(--bad)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 20 }}></div>
          <h3 style={{ color: 'var(--ink)', margin: '0 0 0.5rem' }}>Something went wrong</h3>
          <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem' }}>{this.state.error?.message || 'Unexpected error'}</p>
          <button onClick={()=>window.location.reload()} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: 'var(--brand)', color: 'var(--on-solid)', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
