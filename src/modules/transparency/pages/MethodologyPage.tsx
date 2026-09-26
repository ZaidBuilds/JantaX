import { TransparencyLayout } from '../components/TransparencyLayout';

const STAGES = [
  { title: 'Collect', desc: 'Official datasets are pulled from APIs (CPPP, UDISE+, HMIS, CPCB) or parsed from published PDFs (CAG reports, RERA orders). Every raw file is hashed so later changes can be detected.' },
  { title: 'Place', desc: 'Records are matched to districts and six-digit PIN codes so that a school, clinic or project shows up for the people it serves.' },
  { title: 'Pair', desc: 'Each official target, such as a functional toilet or a promised possession date, is paired with the matching audit finding or verified citizen check-in.' },
  { title: 'Word neutrally', desc: 'Status labels are factual: Delayed, Extended, Under review. Words like corrupt or fraud are never used unless a competent authority has ruled so.' },
  { title: 'Publish with sources', desc: 'Every record links to its primary document and shows when it was last updated, so anyone can check our work.' },
];

const RULES = [
  { title: 'No standalone accusations', desc: 'We never allege wrongdoing against a contractor, builder or office on our own.' },
  { title: 'Competent authority only', desc: 'Debarments and penalties appear only when an authority such as NHAI, MoRTH, a High Court or a RERA tribunal has issued an order.' },
  { title: 'Minimum personal data', desc: 'Citizen reporting collects the least data needed, and anonymous reporting is the default.' },
  { title: 'Open and reproducible', desc: 'Scoring formulas and processing rules are published so results can be reproduced.' },
];

export function MethodologyPage() {
  return (
    <TransparencyLayout current="Methodology" title="Methodology" lede="How we collect, place, pair and publish civic data while staying neutral and evidence based.">
      <section className="stack" style={{ gap: 'var(--s-8)' }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: 'var(--s-4)' }}>From source to screen</h2>
          <ol className="timeline">
            {STAGES.map((s, i) => (
              <li key={s.title}>
                <span className="timeline-dot num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="section-title" style={{ marginBottom: 'var(--s-4)' }}>Neutrality rules</h2>
          <div className="grid-2">
            {RULES.map((r) => (
              <div key={r.title} className="card card-pad">
                <h3 className="card-title" style={{ fontSize: 'var(--text-md)' }}>{r.title}</h3>
                <p className="small" style={{ color: 'var(--ink-2)', marginTop: 4 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </TransparencyLayout>
  );
}
