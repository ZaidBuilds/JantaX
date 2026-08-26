import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Scale, Flag, ExternalLink } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="global-footer"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto',
      }}
    >
      <div
        className="global-footer-inner"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '2.5rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: '#0f2d59',
              }}
            >
              Janta
            </span>
            <span
              style={{
                fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: '#f97316',
              }}
            >
              X
            </span>
            <span
              style={{
                marginLeft: '0.4rem',
                fontSize: '0.6rem',
                background: '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 800,
              }}
            >
              BETA
            </span>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '0.6rem',
              lineHeight: 1.5,
              maxWidth: 320,
            }}
          >
            India, Explained by Where You Live. Real data. Real places. Real impact. Track schools,
            projects, and governance by PIN code.
          </p>
          <div
            style={{
              marginTop: '1.1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              <ShieldCheck size={14} /> 100% Open Data
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              <Users size={14} /> Citizen Powered
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              <Scale size={14} /> Non-Partisan
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              <Flag size={14} /> For Every Indian
            </span>
          </div>
        </div>

        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              marginBottom: '0.7rem',
            }}
          >
            Civic Modules
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {[
              { label: 'MP / MLA Funds', path: '/mplads' },
              { label: 'Polling Booths & BLO', path: '/booth' },
              { label: 'District Courts & NJDG', path: '/courts' },
              { label: 'RTI Clock & CPIO', path: '/rti' },
              { label: 'Nagar Nigam & Sanitation', path: '/nagar' },
              { label: 'Air Quality & GRAP', path: '/pollution' },
            ].map((item) => (
              <span
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              marginBottom: '0.7rem',
            }}
          >
            JantaX
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {[
              { label: 'About Us', path: '/about' },
              { label: 'Data Sources', path: '/data-sources' },
              { label: 'Report an Issue', path: '/report' },
              { label: 'Privacy & Terms', path: '/privacy' },
            ].map((item) => (
              <span
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item.label}
              </span>
            ))}
            <a
              href="https://github.com/anomalyco/opencode"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Feedback & GitHub <ExternalLink size={12} />
            </a>
          </div>
          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
            }}
          >
            Built for citizens, by citizens.
            <br />
            Press{' '}
            <kbd
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.7rem',
              }}
            >
              ctrl+p
            </kbd>{' '}
            for actions.
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          maxWidth: 1200,
          margin: '0 auto',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>© 2024 JantaX. All rights reserved. Made with accountability in India 🇮🇳</span>
        <span style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 0 4px rgba(16,185,129,0.15)',
            }}
          />
          All systems operational
        </span>
      </div>
    </footer>
  );
}
