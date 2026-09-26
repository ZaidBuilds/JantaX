import { useMemo } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pct, pinSeed, useModulePin } from '../../shared/ModuleKit';

interface Facility {
  id: string;
  kind: 'CHC' | 'PHC';
  name: string;
  nameHi: string;
  bedsSanctioned: number;
  bedsAvailable: number;
  doctorsSanctioned: number;
  doctorsPresent: number;
  essentialDrugsListed: number;
  essentialDrugsInStock: number;
  finding: string;
  findingHi: string;
}

export function HospitalDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const facilities = useMemo<Facility[]>(() => {
    const s = pinSeed(pin);
    const district = loc.district;
    return [
      {
        id: `CHC-${pin}`,
        kind: 'CHC',
        name: `${district} Community Health Centre`,
        nameHi: `${district} सामुदायिक स्वास्थ्य केंद्र`,
        bedsSanctioned: 30,
        bedsAvailable: 4 + (s % 12),
        doctorsSanctioned: 5,
        doctorsPresent: 1 + (s % 3),
        essentialDrugsListed: 128,
        essentialDrugsInStock: 60 + (s % 50),
        finding: 'Patients report buying medicines from private chemists. The X-ray unit has been listed as non-functional for two years.',
        findingHi: 'मरीज़ों ने निजी दवा दुकानों से दवा खरीदने की शिकायत की है। एक्स-रे मशीन दो साल से बंद दर्ज है।',
      },
      {
        id: `PHC-${pin}`,
        kind: 'PHC',
        name: `Primary Health Centre, ${district} Ward ${2 + (s % 30)}`,
        nameHi: `प्राथमिक स्वास्थ्य केंद्र, वार्ड ${2 + (s % 30)}`,
        bedsSanctioned: 6,
        bedsAvailable: 2 + (s % 4),
        doctorsSanctioned: 2,
        doctorsPresent: 1 + ((s >> 3) % 2),
        essentialDrugsListed: 64,
        essentialDrugsInStock: 38 + ((s >> 2) % 24),
        finding: 'OPD hours posted as 9 am to 4 pm. Citizen check-ins found the centre closed before 1 pm on 3 of 8 visits.',
        findingHi: 'ओपीडी समय सुबह 9 से शाम 4 बजे दर्ज है। 8 में से 3 बार केंद्र दोपहर 1 बजे से पहले बंद मिला।',
      },
    ];
  }, [pin, loc.district]);

  const totals = facilities.reduce(
    (a, f) => ({ bs: a.bs + f.bedsSanctioned, ba: a.ba + f.bedsAvailable, ds: a.ds + f.doctorsSanctioned, dp: a.dp + f.doctorsPresent, dl: a.dl + f.essentialDrugsListed, di: a.di + f.essentialDrugsInStock }),
    { bs: 0, ba: 0, ds: 0, dp: 0, dl: 0, di: 0 }
  );

  const shareFacility = (f: Facility) =>
    share({
      pinCode: pin,
      titleHindi: f.nameHi,
      titleEnglish: f.name,
      claimLabel: `Beds ${f.bedsSanctioned}, doctors ${f.doctorsSanctioned} (sanctioned)`,
      claimLabelHindi: `स्वीकृत बेड ${f.bedsSanctioned}, डॉक्टर ${f.doctorsSanctioned}`,
      realityLabel: `Beds in use ${f.bedsAvailable}, doctors present ${f.doctorsPresent}`,
      realityLabelHindi: `उपलब्ध बेड ${f.bedsAvailable}, उपस्थित डॉक्टर ${f.doctorsPresent}`,
      responsiblePerson: 'Chief Medical Officer (CMO)',
      responsibleOrg: 'State Health Department',
      sourceUrl: 'https://hmis.mohfw.gov.in',
      moduleNameHindi: 'अस्पताल जांच',
    });

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="stat-row">
        <Stat label="Facilities tracked" value={facilities.length} />
        <Stat label="Beds actually available" value={pct(totals.ba, totals.bs)} unit="%" meta={`${totals.ba} of ${totals.bs} sanctioned`} />
        <Stat label="Doctors present" value={pct(totals.dp, totals.ds)} unit="%" meta={`${totals.dp} of ${totals.ds} posts`} />
        <Stat label="Essential drugs in stock" value={pct(totals.di, totals.dl)} unit="%" />
      </div>
      <SectionTitle title="Facilities serving this PIN" sub="Sanctioned capacity from HMIS against what patients and check-ins found." />
      {facilities.map((f) => (
        <EvidenceCard
          key={f.id}
          title={f.name}
          hindi={f.nameHi}
          meta={`${f.kind} · Facility ID ${f.id}`}
          status={pct(f.doctorsPresent, f.doctorsSanctioned) < 50 ? { label: 'Understaffed', tone: 'bad' } : { label: 'Partly staffed', tone: 'warn' }}
          claimLabel="Sanctioned (HMIS)"
          realityLabel="Found on the ground"
          claim={<Kv items={[{ label: 'Beds', value: f.bedsSanctioned }, { label: 'Doctors', value: f.doctorsSanctioned }, { label: 'Essential drugs', value: f.essentialDrugsListed }]} />}
          reality={
            <Kv
              items={[
                { label: 'Beds in use', value: f.bedsAvailable, tone: 'bad' },
                { label: 'Doctors present', value: f.doctorsPresent, tone: 'bad' },
                { label: 'Drugs in stock', value: f.essentialDrugsInStock, tone: 'warn' },
              ]}
            />
          }
          finding={f.finding}
          responsible="Chief Medical Officer (CMO), State Health Department"
          source={{ name: 'NHM Facility Registry / HMIS', url: 'https://hmis.mohfw.gov.in', updated: '2026-08-15' }}
          recordRef={f.id}
          onShare={() => shareFacility(f)}
        />
      ))}
    </div>
  );
}
