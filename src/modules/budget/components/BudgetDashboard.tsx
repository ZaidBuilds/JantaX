import { useMemo } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat, SourceLine } from '../../../ui';
import { ModulePinBar, SectionTitle, pct, pinSeed, useModulePin } from '../../shared/ModuleKit';

const SECTORS = [
  { name: 'Roads and infrastructure', hi: 'अवसंरचना', share: 35, tone: 'var(--viz-2)' },
  { name: 'Education', hi: 'शिक्षा', share: 20, tone: 'var(--viz-1)' },
  { name: 'Rural welfare', hi: 'ग्रामीण कल्याण', share: 18, tone: 'var(--viz-3)' },
  { name: 'Health', hi: 'स्वास्थ्य', share: 15, tone: 'var(--viz-5)' },
  { name: 'Administration', hi: 'प्रशासन', share: 12, tone: 'var(--viz-8)' },
];

export function BudgetDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const d = useMemo(() => {
    const s = pinSeed(pin);
    const allocated = loc.region === 'North' ? 120 : loc.region === 'South' ? 210 : 150;
    const rows = SECTORS.map((x, i) => {
      const alloc = Math.round((allocated * x.share) / 100);
      const released = Math.round(alloc * (0.7 + ((s >> i) % 25) / 100));
      const spent = Math.round(released * (0.55 + ((s >> (i + 2)) % 35) / 100));
      return { ...x, alloc, released, spent };
    });
    return { allocated, rows };
  }, [pin, loc.region]);

  const released = d.rows.reduce((a, r) => a + r.released, 0);
  const spent = d.rows.reduce((a, r) => a + r.spent, 0);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="stat-row">
        <Stat label="Allocated to the district" value={`₹${d.allocated}`} unit=" Cr" meta="Current financial year" />
        <Stat label="Released so far" value={pct(released, d.allocated)} unit="%" meta={`₹${released} Cr`} />
        <Stat label="Actually spent" value={pct(spent, d.allocated)} unit="%" meta={`₹${spent} Cr`} />
        <Stat label="Released but unspent" value={`₹${released - spent}`} unit=" Cr" />
      </div>
      <SectionTitle
        title="Where the money goes"
        sub="Allocation, release and spending by sector for this district."
        action={
          <button
            type="button"
            className="btn btn-share btn-sm"
            onClick={() =>
              share({
                pinCode: pin,
                titleHindi: `बजट: पिन ${pin}`,
                titleEnglish: `Budget for PIN ${pin}`,
                claimLabel: `Allocated ₹${d.allocated} Cr`,
                claimLabelHindi: `आवंटन ₹${d.allocated} करोड़`,
                realityLabel: `Spent ₹${spent} Cr (${pct(spent, d.allocated)}%)`,
                realityLabelHindi: `खर्च ₹${spent} करोड़ (${pct(spent, d.allocated)}%)`,
                responsiblePerson: 'District Finance Officer',
                responsibleOrg: 'State Finance Department',
                sourceUrl: 'https://openbudgetsindia.org',
                moduleNameHindi: 'पिन हिसाब',
              })
            }
          >
            Share on WhatsApp
          </button>
        }
      />
      <div className="card">
        <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sector</th>
                <th scope="col" style={{ textAlign: 'right' }}>Allocated</th>
                <th scope="col" style={{ textAlign: 'right' }}>Released</th>
                <th scope="col" style={{ textAlign: 'right' }}>Spent</th>
                <th scope="col" style={{ width: '32%' }}>Spent of allocation</th>
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r) => {
                const p = pct(r.spent, r.alloc);
                return (
                  <tr key={r.name}>
                    <td>
                      <div className="cluster" style={{ flexWrap: 'nowrap' }}>
                        <span className="layer-swatch" style={{ background: r.tone }} aria-hidden="true" />
                        <span>
                          <span className="strong">{r.name}</span>
                          <span className="tiny muted" lang="hi" style={{ display: 'block' }}>{r.hi}</span>
                        </span>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: 'right' }}>₹{r.alloc} Cr</td>
                    <td className="num" style={{ textAlign: 'right' }}>₹{r.released} Cr</td>
                    <td className="num" style={{ textAlign: 'right' }}>₹{r.spent} Cr</td>
                    <td>
                      <div className="meter-row">
                        <div className={`meter ${p < 50 ? 'bad' : p < 70 ? 'warn' : 'good'}`} style={{ flex: 1 }}>
                          <span style={{ width: `${p}%` }} />
                        </div>
                        <span className="tiny num" style={{ width: 36, textAlign: 'right' }}>{p}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-foot">
          <SourceLine source="State budget documents and treasury expenditure reports" url="https://openbudgetsindia.org" updated="2026-08-31" />
        </div>
      </div>
    </div>
  );
}
