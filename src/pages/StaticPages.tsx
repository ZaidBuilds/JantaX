import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Landmark, EyeOff, ShieldCheck, MapPin, Scale, Share2, ChevronDown, Mail } from 'lucide-react';
import { PageHeader, MODULE_GROUPS, ModuleIcon, getModule, moduleHref } from '../ui';

const FAQ = [
  {
    q: 'Is JantaX a government website?',
    a: 'No. JantaX is independent. We reuse records the government already publishes, such as UDISE+, HMIS, PMGSY, RERA portals, NJDG and CPGRAMS, and link back to them.',
  },
  {
    q: 'Where does the ground truth come from?',
    a: 'From audit reports (CAG, social audits), live official feeds such as CPCB air quality, and photo reports filed by residents. Citizen reports are reviewed before publication and shown with their sample size.',
  },
  {
    q: 'Can I be identified if I file a report?',
    a: 'Reports are anonymous by default. We strip location and device data from photos, and we never show your name or contact details publicly.',
  },
  {
    q: 'A figure looks wrong. What do I do?',
    a: 'Use "Report a data issue" on the record, or open the corrections log. Disputed records are flagged, the original is preserved, and every change is logged publicly.',
  },
  {
    q: 'Why do some pages say sample records?',
    a: 'When the live records service cannot be reached we show bundled sample data so the site keeps working. Those figures are illustrative and are labelled as such.',
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="card faq">
      {FAQ.map((f, i) => (
        <div key={f.q} className="faq-item">
          <button type="button" className="faq-q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>
          {open === i && (
            <p id={`faq-${i}`} className="faq-a">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'About' }]}
        title="Public records, organised by where you live"
        lede="JantaX puts official Indian government data beside what was found on the ground, for every PIN code. It is independent, non-partisan and free to use."
        actions={
          <Link to="/explore" className="btn btn-primary">
            Explore the modules
          </Link>
        }
      />

      <div className="split">
        <div className="stack" style={{ gap: 'var(--s-10)' }}>
          <section aria-labelledby="why-h" className="prose">
            <h2 id="why-h" className="section-title">Why this exists</h2>
            <p>
              Government data in India is published across hundreds of portals, each with its own format and login. A parent who
              wants to know whether the local school has a teacher for every class, or a resident who wants to know who built the
              road that caved in, rarely knows where to look.
            </p>
            <p>
              JantaX starts from a PIN code, because that is how people think about where they live. From there we pull the
              records that apply to that area, show when they were last updated, and set them next to audit findings and
              citizen reports so the gap between the claim and the reality is visible.
            </p>
          </section>

          <section aria-labelledby="how-h">
            <h2 id="how-h" className="section-title" style={{ marginBottom: 'var(--s-4)' }}>How it works</h2>
            <ol className="how-strip how-strip-vertical">
              <li>
                <span className="icon-tile" style={{ ['--tile' as string]: 'var(--brand-ink)' }}><MapPin size={20} aria-hidden="true" /></span>
                <div>
                  <h3>Resolve the PIN</h3>
                  <p>We map the six digits to a district and state, then find every school, clinic, project, court and office that serves it.</p>
                </div>
              </li>
              <li>
                <span className="icon-tile" style={{ ['--tile' as string]: 'var(--accent)' }}><Scale size={20} aria-hidden="true" /></span>
                <div>
                  <h3>Compare claim and reality</h3>
                  <p>Each official figure is shown with its source and date, next to audit findings and moderated citizen check-ins.</p>
                </div>
              </li>
              <li>
                <span className="icon-tile" style={{ ['--tile' as string]: 'var(--good)' }}><Share2 size={20} aria-hidden="true" /></span>
                <div>
                  <h3>Help people act</h3>
                  <p>Anyone can file a photo report, generate an RTI or CPGRAMS draft, or share the evidence with the responsible office.</p>
                </div>
              </li>
            </ol>
          </section>

          <section aria-labelledby="cover-h">
            <h2 id="cover-h" className="section-title" style={{ marginBottom: 'var(--s-4)' }}>What we cover</h2>
            <div className="grid-3">
              {MODULE_GROUPS.map((g) => (
                <div key={g.id} className="card card-pad">
                  <h3 className="card-title" style={{ fontSize: 'var(--text-md)' }}>{g.title}</h3>
                  <ul className="stack-sm" style={{ marginTop: 'var(--s-3)' }}>
                    {g.modules.map((id) => (
                      <li key={id}>
                        <Link to={moduleHref(id)} className="cluster small" style={{ color: 'var(--ink-2)', flexWrap: 'nowrap' }}>
                          <ModuleIcon id={id} size="sm" />
                          {getModule(id)?.shortName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq-h">
            <h2 id="faq-h" className="section-title" style={{ marginBottom: 'var(--s-4)' }}>Questions people ask</h2>
            <Faq />
          </section>
        </div>

        <aside className="stack sticky-aside">
          <div className="card card-pad">
            <h2 className="card-title" style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--s-4)' }}>Our principles</h2>
            <ul className="stack">
              <li className="principle"><Link2 size={17} aria-hidden="true" /><div><strong>Every number is sourced.</strong> Each figure links to the public document it came from.</div></li>
              <li className="principle"><Landmark size={17} aria-hidden="true" /><div><strong>Non-partisan.</strong> We show claims and audits side by side and do not editorialise.</div></li>
              <li className="principle"><EyeOff size={17} aria-hidden="true" /><div><strong>Anonymous by default.</strong> Reporters are never named publicly.</div></li>
              <li className="principle"><ShieldCheck size={17} aria-hidden="true" /><div><strong>Open corrections.</strong> Anyone can challenge a record and every change is logged.</div></li>
            </ul>
          </div>
          <div className="card card-pad stack-sm">
            <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Read the fine print</h2>
            <Link to="/sources" className="link small">Data sources and licences</Link>
            <Link to="/transparency/methodology" className="link small">Methodology</Link>
            <Link to="/transparency/scoring" className="link small">How scores are calculated</Link>
            <Link to="/transparency/corrections" className="link small">Corrections log</Link>
            <Link to="/privacy" className="link small">Privacy</Link>
          </div>
          <div className="callout">
            <Mail size={16} aria-hidden="true" />
            <span>Journalists, researchers and civic groups can reuse our data with attribution under the Government Open Data License.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="page page-narrow">
      <PageHeader
        crumbs={[{ label: 'Privacy' }]}
        title="Privacy"
        lede="You can use JantaX without an account. When you file a report, we keep only what is needed to review it and protect you."
      />
      <div className="stack prose" style={{ gap: 'var(--s-8)' }}>
        <section>
          <h2 className="section-title">When you browse</h2>
          <ul>
            <li>No login is needed to read any page.</li>
            <li>Your recent searches, followed PIN codes, language and theme are saved only in your browser. Clear them any time from your browser settings.</li>
            <li>We rate-limit requests by a hashed network address to stop scraping. The raw address is not stored.</li>
          </ul>
        </section>
        <section>
          <h2 className="section-title">When you file a report</h2>
          <ul>
            <li>Reports are anonymous by default. If you choose to add your name or contact, only moderators can see it.</li>
            <li>We remove location, time and device metadata from photos before storing them. Faces and number plates are blurred before publication.</li>
            <li>Every report is reviewed before it is published. Rejected reports are kept for 90 days for abuse checks, then deleted.</li>
          </ul>
        </section>
        <section>
          <h2 className="section-title">How we use official data</h2>
          <ul>
            <li>We quote audit reports and official documents and link to the original. We do not make accusations of our own.</li>
            <li>Citizen reports are observations, not verdicts. We show how many reports back each finding.</li>
            <li>If a record is disputed, we flag it, keep the original, and log the correction publicly.</li>
          </ul>
        </section>
        <div className="callout callout-info">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>
            Questions about your data? See the <Link to="/transparency/corrections">corrections process</Link> or read our <Link to="/transparency/methodology">methodology</Link>.
          </span>
        </div>
      </div>
    </div>
  );
}
