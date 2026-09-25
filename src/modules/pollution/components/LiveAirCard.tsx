import { useEffect, useState } from 'react';
import { Radio, WifiOff } from 'lucide-react';
import { api, type AirNear } from '../../../core/services/api';
import { usePin } from '../../../core/context/PinContext';
import { Badge, SourceLine } from '../../../ui';
import type { Tone as BadgeTone } from '../../../ui/Badge';

const TONE: Record<string, BadgeTone> = {
  Good: 'good',
  Satisfactory: 'good',
  Moderate: 'warn',
  Poor: 'bad',
  'Very poor': 'bad',
  Severe: 'bad',
};

function when(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
}

/** The CPCB stations nearest the selected PIN, straight from the live feed. Shows nothing invented. */
export function LiveAirCard() {
  const { selectedPin } = usePin();
  const [data, setData] = useState<AirNear | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setData(undefined);
    api.getAirNear(selectedPin).then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [selectedPin]);

  if (data === undefined) {
    return <div className="card card-pad" aria-busy="true"><span className="skeleton" style={{ height: 96 }} /></div>;
  }

  if (!data || !data.stations.some((s) => s.latest)) {
    return (
      <div className="callout" style={{ marginBottom: 'var(--s-5)' }}>
        <WifiOff size={16} aria-hidden="true" />
        <span>
          Live CPCB readings for PIN {selectedPin} are not available right now. They appear here when the JantaX data service is running
          with a data.gov.in key. The station list below is sample data.
        </span>
      </div>
    );
  }

  // Stations more than 100 km away say little about this PIN; keep the nearest one if nothing is closer.
  const close = data.stations.filter((s) => s.km <= 100);
  const stations = close.length ? close : data.stations.slice(0, 1);
  const far = !close.length;

  return (
    <section className="card" style={{ marginBottom: 'var(--s-5)' }} aria-labelledby="live-air-h">
      <div className="card-head">
        <h2 id="live-air-h" className="card-title" style={{ fontSize: 'var(--text-md)' }}>
          <Radio size={16} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--good)' }} />
          Live: stations nearest {data.pin}
        </h2>
        <span className="tiny muted">{data.district}, {data.state}</span>
      </div>
      <ul className="list">
        {stations.map((s) => (
          <li key={s.id} className="list-row" style={{ alignItems: 'flex-start', gap: 'var(--s-3)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="strong">{s.name}</div>
              <div className="tiny muted">
                {s.km} km away{s.latest ? ` · ${when(s.latest.observedAt)} IST` : ''}
                {s.latest?.stale ? ' · not updated in the last 6 hours' : ''}
              </div>
              {s.latest && (
                <div className="cluster" style={{ marginTop: 'var(--s-2)', gap: 'var(--s-2)' }}>
                  {s.latest.readings.filter((r) => r.avgValue !== null).map((r) => (
                    <span key={r.pollutant} className="chip tiny">
                      {r.pollutant} <span className="num strong">{r.avgValue}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              {s.latest?.aqi != null ? (
                <>
                  <div className="stat-value num" style={{ fontSize: 'var(--text-xl)' }}>{s.latest.aqi}</div>
                  <Badge tone={TONE[s.latest.category ?? ''] ?? 'neutral'}>{s.latest.category}</Badge>
                </>
              ) : (
                <span className="tiny muted" title={s.latest?.reason}>No AQI</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {far && (
        <p className="small muted card-body" style={{ paddingBottom: 0 }}>
          The nearest CPCB station is {stations[0]?.km} km away, so its readings may not reflect air quality in {data.pin}.
        </p>
      )}
      <div className="card-body" style={{ paddingTop: 'var(--s-3)' }}>
        <SourceLine source={`${data.source.organization}, ${data.source.name}`} url={data.source.url} updated={data.source.lastSync ?? undefined} />
        <p className="tiny muted" style={{ marginTop: 'var(--s-2)' }}>
          AQI is the highest pollutant sub-index, shown only when at least three pollutants, including PM2.5 or PM10, are reported.
        </p>
      </div>
    </section>
  );
}
