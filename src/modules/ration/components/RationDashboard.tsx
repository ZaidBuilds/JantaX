import { useMemo } from 'react';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { Stat } from '../../../ui';
import { EvidenceCard, Kv, ModulePinBar, SectionTitle, pct, pinSeed, useModulePin } from '../../shared/ModuleKit';

const DEALERS_NORTH = ['Sanjay Sharma', 'Rekha Devi', 'Mohd. Arif', 'Suresh Pal'];
const DEALERS_OTHER = ['M. Ravichandran', 'Lakshmi Narayan', 'Anita Patil', 'Joseph Mathew'];

export function RationDashboard() {
  const { share } = useWhatsAppShare();
  const { pin, loc, setPin } = useModulePin();

  const shops = useMemo(() => {
    const s = pinSeed(pin);
    const names = loc.region === 'North' ? DEALERS_NORTH : DEALERS_OTHER;
    return [0, 1].map((i) => {
      const k = s >> (i * 3);
      return {
        id: `FPS-${loc.stateCode}-${pin.slice(3)}${i + 1}`,
        dealer: names[(k + i) % names.length],
        cards: 380 + (k % 420),
        entitledWheatKg: 5,
        entitledRiceKg: 3,
        daysOpenPromised: 26,
        daysOpenObserved: 10 + (k % 14),
        stockGapPct: 4 + (k % 15),
        epos: k % 3 !== 0,
      };
    });
  }, [pin, loc.region, loc.stateCode]);

  const openRate = pct(shops.reduce((a, x) => a + x.daysOpenObserved, 0), shops.reduce((a, x) => a + x.daysOpenPromised, 0));

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <ModulePinBar pin={pin} loc={loc} onChange={setPin} />
      <div className="stat-row">
        <Stat label="Fair price shops" value={shops.length} />
        <Stat label="Ration cards attached" value={shops.reduce((a, x) => a + x.cards, 0).toLocaleString('en-IN')} />
        <Stat label="Days open vs promised" value={openRate} unit="%" />
        <Stat label="Average stock gap" value={Math.round(shops.reduce((a, x) => a + x.stockGapPct, 0) / shops.length)} unit="%" meta="Allocated minus distributed" />
      </div>
      <SectionTitle title="Fair price shops" sub="NFSA entitlements and shop hours against ePOS logs and beneficiary check-ins." />
      {shops.map((shop) => (
        <EvidenceCard
          key={shop.id}
          title={`Fair Price Shop ${shop.id}`}
          meta={`Dealer: ${shop.dealer} · ${shop.cards} ration cards`}
          status={shop.daysOpenObserved < 18 ? { label: 'Often closed', tone: 'bad' } : { label: 'Mostly open', tone: 'warn' }}
          claimLabel="Entitlement (NFSA)"
          realityLabel="Observed"
          claim={
            <Kv
              items={[
                { label: 'Wheat per person', value: `${shop.entitledWheatKg} kg` },
                { label: 'Rice per person', value: `${shop.entitledRiceKg} kg` },
                { label: 'Days open a month', value: shop.daysOpenPromised },
              ]}
            />
          }
          reality={
            <Kv
              items={[
                { label: 'Days found open', value: shop.daysOpenObserved, tone: shop.daysOpenObserved < 18 ? 'bad' : 'warn' },
                { label: 'Stock not distributed', value: `${shop.stockGapPct}%`, tone: shop.stockGapPct > 10 ? 'bad' : 'warn' },
                { label: 'ePOS working', value: shop.epos ? 'Yes' : 'No', tone: shop.epos ? 'good' : 'bad' },
              ]}
            />
          }
          finding={shop.stockGapPct > 10 ? `A ${shop.stockGapPct}% gap between grain allocated and grain distributed was noted in the last state audit.` : undefined}
          responsible="District Supply Officer, Food and Civil Supplies Department"
          source={{ name: 'NFSA portal / State ePOS', url: 'https://nfsa.gov.in', updated: '2026-08-10' }}
          recordRef={shop.id}
          onShare={() =>
            share({
              pinCode: pin,
              titleHindi: `राशन दुकान ${shop.id}`,
              titleEnglish: `Fair Price Shop ${shop.id}`,
              claimLabel: `Open ${shop.daysOpenPromised} days a month`,
              claimLabelHindi: `महीने में ${shop.daysOpenPromised} दिन खुलना चाहिए`,
              realityLabel: `Found open ${shop.daysOpenObserved} days; stock gap ${shop.stockGapPct}%`,
              realityLabelHindi: `${shop.daysOpenObserved} दिन खुली मिली; स्टॉक अंतर ${shop.stockGapPct}%`,
              responsiblePerson: shop.dealer,
              responsibleOrg: 'Food and Civil Supplies Department',
              sourceUrl: 'https://nfsa.gov.in',
              moduleNameHindi: 'राशन रिपोर्ट',
            })
          }
        />
      ))}
    </div>
  );
}
