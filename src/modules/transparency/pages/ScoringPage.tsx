import { getScoringFormulas } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge } from '../../../ui';

export function ScoringPage() {
  const formulas = getScoringFormulas();
  return (
    <TransparencyLayout current="How scores work" title="How scores work" lede="Every score on JantaX comes from a published formula. No editorial rating is ever added.">
      <div className="stack" style={{ gap: 'var(--s-6)' }}>
        {formulas.map((f) => (
          <article key={f.id} className="card">
            <div className="card-body stack">
              <div>
                <Badge tone="brand">{f.targetModule}</Badge>
                <h2 className="card-title" style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--s-2)' }}>{f.indexName}</h2>
                <p className="small" style={{ color: 'var(--ink-2)', marginTop: 4, maxWidth: 'var(--prose-max)' }}>{f.descriptionText}</p>
              </div>
              <pre className="formula" aria-label="Formula">{f.formulaTex}</pre>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Input</th>
                      <th scope="col">What it measures</th>
                      <th scope="col" className="num" style={{ textAlign: 'right' }}>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {f.parameters.map((p) => (
                      <tr key={p.name}>
                        <td className="strong">{p.name}</td>
                        <td style={{ color: 'var(--ink-2)' }}>{p.description}</td>
                        <td className={`num ${p.weightPct < 0 ? 'text-bad' : 'text-good'}`} style={{ textAlign: 'right', fontWeight: 600 }}>
                          {p.weightPct > 0 ? `+${p.weightPct}%` : `${p.weightPct}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="callout callout-info">
                <span><strong>Worked example.</strong> {f.exampleCalculation}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </TransparencyLayout>
  );
}
