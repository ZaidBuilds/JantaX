import { Link } from 'react-router-dom';
import { Brand } from './Header';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Government schools', to: '/schools' },
      { label: 'Roads and public works', to: '/module/infra' },
      { label: 'Hospitals and PHCs', to: '/module/hospital' },
      { label: 'RERA housing', to: '/module/rera' },
      { label: 'District courts', to: '/module/courts' },
      { label: 'All 18 modules', to: '/explore' },
    ],
  },
  {
    title: 'Transparency',
    links: [
      { label: 'Data sources', to: '/sources' },
      { label: 'Methodology', to: '/transparency/methodology' },
      { label: 'How scores work', to: '/transparency/scoring' },
      { label: 'Evidence standards', to: '/transparency/evidence' },
      { label: 'Data freshness', to: '/transparency/freshness' },
      { label: 'Corrections log', to: '/transparency/corrections' },
    ],
  },
  {
    title: 'Take part',
    links: [
      { label: 'Report an issue', to: '/report-issue' },
      { label: 'Citizen reports', to: '/reports' },
      { label: 'Compare areas', to: '/compare' },
      { label: 'About JantaX', to: '/about' },
      { label: 'Privacy', to: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-about">
            <Brand />
            <p>
              An independent, non-partisan public data utility. Official Indian government records on one side,
              citizen ground truth on the other, organised by PIN code.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="footer-col">
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JantaX. Government data reused under the Government Open Data License, India.</span>
          <span>Every figure links to its source. Spotted an error? <Link to="/transparency/corrections">Request a correction</Link>.</span>
        </div>
      </div>
    </footer>
  );
}
