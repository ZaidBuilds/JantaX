import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { getStoredReraProjects } from '../services/reraService';
import type { ReraProject } from '../types/reraIntelligence';
import { Stat, toneForStatus } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pinSeed, useModulePin } from '../../shared/ModuleKit';

function monthsBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (Number.isNaN(+d1) || Number.isNaN(+d2)) return 0;
  return Math.max(0, (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()));
}

export function ReraDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const projects = useMemo<ReraProject[]>(() => {
    const all = getStoredReraProjects();
    const exact = all.filter((p) => p.pinCode === pin);
    const district = all.filter((p) => p.pinCode !== pin && p.district.toLowerCase() === loc.district.toLowerCase());
    const matched = [...exact, ...district];
    if (matched.length) return matched.slice(0, 4);
    // No registered project indexed for this PIN: show the nearest by PIN prefix.
    return all.filter((p) => p.pinCode.slice(0, 2) === pin.slice(0, 2)).slice(0, 2);
  }, [pin, loc.district]);

  const delayed = projects.filter((p) => p.documentedDelayMonths > 0).length;
  const avgDelay = projects.length ? Math.round(projects.reduce((a, p) => a + p.documentedDelayMonths, 0) / projects.length) : 0;
  const units = projects.reduce((a, p) => a + p.soldUnits, 0);

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin}>
        <Link to="/rera" className="link small">All registered projects <ArrowRight size={14} aria-hidden="true" /></Link>
      </ModulePinBar>
      <div className="stat-row">
        <Stat label="Projects near this PIN" value={projects.length} />
        <Stat label="Running late" value={delayed} meta="Past the promised date" />
        <Stat label="Average delay" value={avgDelay} unit=" months" />
        <Stat label="Homes already sold" value={units.toLocaleString('en-IN')} meta="Buyers waiting on possession" />
      </div>
      <SectionTitle title="Registered projects" sub="Promised possession date filed with the state RERA against the current revised date." />
      {projects.length === 0 ? (
        <div className="card card-pad small muted">No RERA-registered project is indexed near PIN {pin} yet.</div>
      ) : (
        projects.map((p) => {
          const s = pinSeed(p.id);
          return (
            <EvidenceCard
              key={p.id}
              title={<Link to={`/rera/projects/${p.id}`} className="school-link">{p.projectName}</Link>}
              hindi={p.projectNameHindi}
              meta={`${p.projectType} · ${p.locationName}, ${p.district} · Reg. ${p.reraRegistrationNumber}`}
              status={{ label: p.status, tone: toneForStatus(p.status) }}
              claimLabel="Promised to buyers"
              realityLabel="Current position"
              claim={<Kv items={[{ label: 'Possession by', value: p.promisedCompletionDate }, { label: 'Units', value: p.totalUnits }]} />}
              reality={
                <Kv
                  items={[
                    { label: 'Revised date', value: p.revisedCompletionDate, tone: p.documentedDelayMonths ? 'bad' : undefined },
                    { label: 'Delay', value: `${p.documentedDelayMonths || monthsBetween(p.promisedCompletionDate, p.revisedCompletionDate)} months`, tone: p.documentedDelayMonths ? 'bad' : 'good' },
                    { label: 'Extensions granted', value: p.extensionsGranted },
                    { label: 'RERA orders', value: p.orders.length },
                  ]}
                />
              }
              responsible={`${p.builderName} (promoter)`}
              source={{ name: p.originalSource.name, url: p.originalSource.url, updated: p.originalSource.lastUpdated }}
              recordRef={p.id}
              onShare={() =>
                share({
                  pinCode: p.pinCode,
                  titleHindi: p.projectNameHindi || p.projectName,
                  titleEnglish: p.projectName,
                  claimLabel: `Possession promised by ${p.promisedCompletionDate}`,
                  claimLabelHindi: `कब्ज़े की वादा तिथि: ${p.promisedCompletionDate}`,
                  realityLabel: `Revised to ${p.revisedCompletionDate} (${p.documentedDelayMonths} months late)`,
                  realityLabelHindi: `संशोधित तिथि: ${p.revisedCompletionDate} (${p.documentedDelayMonths} महीने देरी)`,
                  responsiblePerson: p.builderName,
                  responsibleOrg: `${p.statePortal} RERA`,
                  sourceUrl: p.originalSource.url,
                  moduleNameHindi: 'RERA सच',
                })
              }
            >
              <div className="meter-row">
                <span className="tiny muted">Units sold</span>
                <div className={`meter ${s % 2 ? 'warn' : ''}`} style={{ flex: 1 }}>
                  <span style={{ width: `${Math.round((p.soldUnits / Math.max(1, p.totalUnits)) * 100)}%` }} />
                </div>
                <span className="tiny num">{p.soldUnits}/{p.totalUnits}</span>
              </div>
            </EvidenceCard>
          );
        })
      )}
    </div>
  );
}
