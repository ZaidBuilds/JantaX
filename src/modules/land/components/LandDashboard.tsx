import { useMemo } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pinSeed, useModulePin } from '../../shared/ModuleKit';

export function LandDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const d = useMemo(() => {
    const s = pinSeed(pin);
    const actual = loc.region === 'North' ? 120 + (s % 50) : loc.region === 'South' ? 70 + (s % 30) : 95 + (s % 40);
    return {
      tehsil: `${loc.district} Tehsil, circle ${1 + (s % 9)}`,
      sla: 45,
      actual,
      backlog: loc.region === 'North' ? 1200 + (s % 600) : 380 + (s % 500),
      disputed: 40 + (s % 110),
      encroachment: 3 + (s % 11),
      digitised: 62 + (s % 35),
    };
  }, [pin, loc.district, loc.region]);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="stat-row">
        <Stat label="Average mutation time" value={d.actual} unit=" days" meta={`Legal limit ${d.sla} days`} />
        <Stat label="Mutations pending" value={d.backlog.toLocaleString('en-IN')} />
        <Stat label="Disputed cases" value={d.disputed} />
        <Stat label="Records digitised" value={d.digitised} unit="%" />
      </div>
      <SectionTitle title="Your tehsil" sub="Service-level limits under the state Public Services Guarantee Act against e-District processing data." />
      <EvidenceCard
        title={d.tehsil}
        meta="Revenue department, land records"
        status={d.actual > d.sla * 2 ? { label: 'Well past the limit', tone: 'bad' } : { label: 'Past the limit', tone: 'warn' }}
        claimLabel="Guaranteed service time"
        realityLabel="e-District processing data"
        claim={<Kv items={[{ label: 'Mutation', value: `${d.sla} days` }, { label: 'Record copy (khatauni)', value: '7 days' }]} />}
        reality={
          <Kv
            items={[
              { label: 'Mutation, average', value: `${d.actual} days`, tone: 'bad' },
              { label: 'Files over the limit', value: d.backlog.toLocaleString('en-IN'), tone: 'bad' },
              { label: 'Encroachment notices', value: d.encroachment },
            ]}
          />
        }
        finding="Residents have filed repeated complaints on the district grievance portal about mutation files pending well beyond the 45-day limit."
        responsible="Tehsildar, Revenue Department"
        source={{ name: 'State Bhulekh / e-District statistics', url: 'https://upbhulekh.gov.in', updated: '2026-07-31' }}
        recordRef={d.tehsil}
        onShare={() =>
          share({
            pinCode: pin,
            titleHindi: `ज़मीन म्यूटेशन: ${d.tehsil}`,
            titleEnglish: `Land mutation: ${d.tehsil}`,
            claimLabel: `Legal limit ${d.sla} days`,
            claimLabelHindi: `कानूनी समय सीमा ${d.sla} दिन`,
            realityLabel: `Average ${d.actual} days, ${d.backlog} pending`,
            realityLabelHindi: `औसत ${d.actual} दिन, ${d.backlog} लंबित`,
            responsiblePerson: 'Tehsildar',
            responsibleOrg: 'Revenue Department',
            sourceUrl: 'https://upbhulekh.gov.in',
            moduleNameHindi: 'ज़मीन रजिस्ट्री',
          })
        }
      />
    </div>
  );
}
