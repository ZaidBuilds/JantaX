import { useMemo } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pinSeed, useModulePin } from '../../shared/ModuleKit';

export function UtilityDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const d = useMemo(() => {
    const s = pinSeed(pin);
    const powerHours = loc.region === 'North' ? 17 + (s % 3) : loc.region === 'South' ? 21 + (s % 3) : 18 + (s % 4);
    const waterHours = 1 + (s % 4);
    return {
      feeder: `${loc.district} 33/11 kV feeder ${1 + (s % 18)}`,
      powerPromised: 24,
      powerActual: powerHours,
      tripsPerWeek: 3 + (s % 9),
      eveningDips: s % 2 === 0,
      waterZone: `${loc.district} supply zone ${1 + ((s >> 4) % 12)}`,
      waterPromised: 4,
      waterActual: waterHours,
      tankerDays: (s >> 2) % 9,
    };
  }, [pin, loc.district, loc.region]);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="stat-row">
        <Stat label="Power supply per day" value={d.powerActual} unit=" h" meta={`Promised ${d.powerPromised} h`} />
        <Stat label="Unplanned trips a week" value={d.tripsPerWeek} />
        <Stat label="Piped water per day" value={d.waterActual} unit=" h" meta={`Promised ${d.waterPromised} h`} />
        <Stat label="Days on tanker supply" value={d.tankerDays} meta="Last 30 days" />
      </div>
      <SectionTitle title="Supply in this PIN" sub="Discom and jal board commitments against outage logs and resident reports." />
      <EvidenceCard
        title={d.feeder}
        meta="Electricity distribution"
        status={d.powerActual < 20 ? { label: 'Frequent cuts', tone: 'bad' } : { label: 'Mostly reliable', tone: 'good' }}
        claimLabel="Discom commitment"
        realityLabel="Outage logs"
        claim={<Kv items={[{ label: 'Hours a day', value: `${d.powerPromised} h` }, { label: 'Planned shutdowns', value: 'Notified 24 h ahead' }]} />}
        reality={
          <Kv
            items={[
              { label: 'Hours a day', value: `${d.powerActual} h`, tone: d.powerActual < 20 ? 'bad' : 'warn' },
              { label: 'Load shedding', value: `${(d.powerPromised - d.powerActual) * 60} min`, tone: 'bad' },
              { label: 'Unplanned trips', value: `${d.tripsPerWeek} a week` },
            ]}
          />
        }
        finding={d.eveningDips ? 'Residents report voltage dips between 6 pm and 9 pm on most weekdays.' : undefined}
        responsible="Assistant Engineer, substation (state discom)"
        source={{ name: 'State Load Despatch Centre outage logs', url: 'https://cea.nic.in', updated: '2026-09-01' }}
        recordRef={d.feeder}
        onShare={() =>
          share({
            pinCode: pin,
            titleHindi: `बिजली फीडर: ${d.feeder}`,
            titleEnglish: `Power feeder: ${d.feeder}`,
            claimLabel: `Promised ${d.powerPromised} hours`,
            claimLabelHindi: `वादा ${d.powerPromised} घंटे`,
            realityLabel: `Actual ${d.powerActual} hours`,
            realityLabelHindi: `वास्तविक ${d.powerActual} घंटे`,
            responsiblePerson: 'Assistant Engineer (substation)',
            responsibleOrg: 'State discom',
            sourceUrl: 'https://cea.nic.in',
            moduleNameHindi: 'पानी-बिजली मीटर',
          })
        }
      />
      <EvidenceCard
        title={d.waterZone}
        meta="Piped drinking water"
        status={d.waterActual < d.waterPromised ? { label: 'Short supply', tone: 'warn' } : { label: 'As scheduled', tone: 'good' }}
        claimLabel="Jal board schedule"
        realityLabel="Reported by residents"
        claim={<Kv items={[{ label: 'Supply a day', value: `${d.waterPromised} h` }, { label: 'Quality testing', value: 'Monthly' }]} />}
        reality={<Kv items={[{ label: 'Supply a day', value: `${d.waterActual} h`, tone: d.waterActual < d.waterPromised ? 'bad' : 'good' }, { label: 'Tanker days', value: d.tankerDays, tone: d.tankerDays > 3 ? 'warn' : undefined }]} />}
        responsible="Executive Engineer, Jal Board zone office"
        source={{ name: 'Jal Board supply schedule', updated: '2026-08-28' }}
        recordRef={d.waterZone}
      />
    </div>
  );
}
