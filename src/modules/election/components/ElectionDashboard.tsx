import { useMemo, useState } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pinSeed, useModulePin } from '../../shared/ModuleKit';

export function ElectionDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();
  const [tab, setTab] = useState<'spend' | 'exam'>('spend');

  const d = useMemo(() => {
    const s = pinSeed(pin);
    const declared = 28 + (s % 60) / 4;
    return {
      constituency: `${loc.district} Assembly Constituency`,
      candidates: 5 + (s % 7),
      limit: 40,
      declared: Math.round(declared * 10) / 10,
      estimated: Math.round((declared * (2.4 + (s % 30) / 10)) * 10) / 10,
      criminal: s % 4,
      exam: {
        name: 'State PSC Group B recruitment',
        notified: '2023-01-15',
        plannedExam: '2023-06-20',
        actualExam: '2023-11-10',
        result: '2024-04-15',
        joining: '2025-02-18',
      },
    };
  }, [pin, loc.district]);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="segmented" role="tablist" aria-label="Election module views">
        <button type="button" role="tab" aria-selected={tab === 'spend'} aria-pressed={tab === 'spend'} onClick={() => setTab('spend')}>Campaign spending</button>
        <button type="button" role="tab" aria-selected={tab === 'exam'} aria-pressed={tab === 'exam'} onClick={() => setTab('exam')}>Recruitment exam delays</button>
      </div>

      {tab === 'spend' ? (
        <>
          <div className="stat-row">
            <Stat label="Candidates in last election" value={d.candidates} />
            <Stat label="ECI spending limit" value={`₹${d.limit}`} unit=" lakh" />
            <Stat label="Winner declared" value={`₹${d.declared}`} unit=" lakh" />
            <Stat label="Declared criminal cases" value={d.criminal} meta="Winning candidate, self-declared" />
          </div>
          <SectionTitle title={d.constituency} sub="Expenditure filed with the ECI against independent field estimates." />
          <EvidenceCard
            title="Winning candidate, last assembly election"
            meta={d.constituency}
            status={d.estimated > d.limit ? { label: 'Estimate above legal limit', tone: 'bad' } : { label: 'Within limit', tone: 'good' }}
            claimLabel="Declared to ECI"
            realityLabel="Independent estimate"
            claim={<Kv items={[{ label: 'Total spend', value: `₹${d.declared} lakh` }, { label: 'Legal limit', value: `₹${d.limit} lakh` }]} />}
            reality={<Kv items={[{ label: 'Estimated spend', value: `₹${d.estimated} lakh`, tone: 'bad' }, { label: 'Gap', value: `${Math.round(d.estimated / d.declared)}x declared`, tone: 'bad' }]} />}
            finding="Estimates are based on rallies, vehicles and advertising observed during the campaign and are published by ADR. They are not a finding by the ECI."
            findingTone="info"
            responsible="Returning Officer, Election Commission of India"
            source={{ name: 'ECI affidavits and ADR field estimates', url: 'https://adrindia.org', updated: '2024-06-10' }}
            recordRef={`${d.constituency}-spend`}
            onShare={() =>
              share({
                pinCode: pin,
                titleHindi: `चुनाव खर्च: ${d.constituency}`,
                titleEnglish: `Election spending: ${d.constituency}`,
                claimLabel: `Declared ₹${d.declared} lakh`,
                claimLabelHindi: `घोषित ₹${d.declared} लाख`,
                realityLabel: `Estimated ₹${d.estimated} lakh`,
                realityLabelHindi: `अनुमानित ₹${d.estimated} लाख`,
                responsiblePerson: 'Returning Officer',
                responsibleOrg: 'Election Commission of India',
                sourceUrl: 'https://eci.gov.in',
                moduleNameHindi: 'चुनाव खर्चा',
              })
            }
          />
        </>
      ) : (
        <>
          <SectionTitle title={d.exam.name} sub="Notified schedule against the dates each stage actually happened." />
          <div className="card card-pad">
            <ol className="timeline">
              {[
                { label: 'Notification published', date: d.exam.notified, note: 'On schedule' },
                { label: 'Written exam', date: d.exam.actualExam, note: `Planned ${d.exam.plannedExam}, held about 5 months late` },
                { label: 'Result declared', date: d.exam.result, note: 'About 6 months after the exam' },
                { label: 'Appointment letters', date: d.exam.joining, note: 'About 18 months later than promised' },
              ].map((s, i) => (
                <li key={s.label}>
                  <span className="timeline-dot num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{s.label}</h3>
                    <p><span className="num strong" style={{ color: 'var(--ink)' }}>{s.date}</span> · {s.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
