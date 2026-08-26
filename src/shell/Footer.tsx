import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-columns">
          <div>
            <div className="footer-col-title">About JantaX</div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '480px' }}>
              JantaX is an independent, non-partisan public data utility aggregating official Indian government records across education, healthcare, infrastructure, RERA housing, and public procurement.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Public Observatories</div>
            <div className="footer-nav">
              <button type="button" onClick={() => navigate('/schools')}>Schools</button>
              <button type="button" onClick={() => navigate('/power')}>Power</button>
              <button type="button" onClick={() => navigate('/land')}>Land</button>
              <button type="button" onClick={() => navigate('/air')}>Air Quality</button>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Standards & Legal</div>
            <div className="footer-nav">
              <button type="button" onClick={() => navigate('/data-sources')}>Data Sources & Provenance</button>
              <button type="button" onClick={() => navigate('/about')}>About & FAQ</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} JantaX Public Data Utility. Published under Open Data guidelines.
          </div>
          <div>
            Government records are sourced directly from official open APIs & gazettes.
          </div>
        </div>
      </div>
    </footer>
  );
}
