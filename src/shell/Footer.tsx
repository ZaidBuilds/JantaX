import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Scale, Flag, ExternalLink, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="global-footer-root">
      <div className="container footer-main-grid">
        <div className="footer-brand-col">
          <div className="footer-brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <span className="brand-janta">Janta</span>
            <span className="brand-x">X</span>
            <span className="brand-badge">CIVIC OS</span>
          </div>
          <p className="footer-tagline">
            India, Explained by Where You Live. Democratizing official government records across
            schools, roads, hospitals, RERA housing, and local budgets.
          </p>

          <div className="footer-trust-chips">
            <span className="trust-chip">
              <ShieldCheck size={13} className="text-emerald-500" /> 100% Open Data
            </span>
            <span className="trust-chip">
              <Users size={13} className="text-blue-500" /> Citizen Verified
            </span>
            <span className="trust-chip">
              <Scale size={13} className="text-amber-500" /> Non-Partisan
            </span>
            <span className="trust-chip">
              <Flag size={13} className="text-orange-500" /> For Every Citizen
            </span>
          </div>
        </div>

        <div className="footer-links-col">
          <div className="footer-col-heading">Civic Observatories</div>
          <div className="footer-nav-list">
            {[
              { label: 'School Observatory (UDISE+)', path: '/schools' },
              { label: 'Public Works & Roads (PMGSY)', path: '/module/infra' },
              { label: 'RERA Housing Tracker', path: '/module/rera' },
              { label: 'Healthcare & PHCs (HMIS)', path: '/module/hospital' },
              { label: 'Contractor Performance', path: '/module/contractor' },
              { label: 'PDS & Welfare Schemes', path: '/module/ration' },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="footer-nav-link"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-links-col">
          <div className="footer-col-heading">Specialized Tools</div>
          <div className="footer-nav-list">
            {[
              { label: 'MP / MLA Funds (MPLADS)', path: '/module/mplads' },
              { label: 'Polling Booths & BLO', path: '/module/booth' },
              { label: 'District Courts & NJDG', path: '/module/courts' },
              { label: 'RTI Clock & CPIO', path: '/module/rti' },
              { label: 'Nagar Nigam & Sanitation', path: '/module/nagar' },
              { label: 'Air Quality & GRAP Guide', path: '/module/pollution' },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="footer-nav-link"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-links-col">
          <div className="footer-col-heading">Transparency & Platform</div>
          <div className="footer-nav-list">
            {[
              { label: 'Data Sources & Methodology', path: '/data-sources' },
              { label: 'Evidence Standards', path: '/transparency/evidence' },
              { label: 'Report a Civic Issue', path: '/report-issue' },
              { label: 'About JantaX', path: '/about' },
              { label: 'Privacy & Data Terms', path: '/privacy' },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="footer-nav-link"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-sub-bar">
        <div className="container sub-bar-inner">
          <div className="sub-bar-left">
            <span>© {new Date().getFullYear()} JantaX Civic OS. Built for public accountability in India 🇮🇳</span>
          </div>

          <div className="sub-bar-right">
            <span className="system-status-indicator">
              <span className="status-dot" />
              <span>All 15 Observatories Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
