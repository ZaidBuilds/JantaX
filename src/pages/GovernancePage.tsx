import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ExternalLink, Info, Landmark, Phone, UserCheck, Vote } from 'lucide-react';
import { PageHeader, PinInput } from '../ui';
import { IndiaTileMap } from '../ui/IndiaTileMap';
import { usePin } from '../core/context/PinContext';
import { usePinRecord } from '../core/services/pinDirectory';
import { findState, INDIA_STATES } from '../core/geo/indiaStates';
import { landscapeFor } from '../ui/AreaScene';
import { governanceChain, guessSettlement, bodyForRoute, SETTLEMENTS, type Settlement } from '../core/governance/chain';
import { issuesFor, routeFor } from '../core/governance/issues';
import type { Body, Contact } from '../core/governance/bodies';
import { pick, t } from '../i18n';

function ContactLine({ contact }: { contact: Contact }) {
  const label = pick(contact.label.en, contact.label.hi);
  if (contact.phone) {
    return (
      <a className="gov-contact" href={`tel:${contact.phone}`}>
        <Phone size={14} aria-hidden="true" /> {label}: <strong>{contact.phone}</strong>
      </a>
    );
  }
  if (contact.url) {
    return (
      <a className="gov-contact" href={contact.url} target="_blank" rel="noreferrer">
        <ExternalLink size={14} aria-hidden="true" /> {label}
      </a>
    );
  }
  return (
    <span className="gov-contact">
      <Info size={14} aria-hidden="true" /> {label}
    </span>
  );
}

function BodyCard({ body }: { body: Body }) {
  return (
    <article className="gov-body">
      <h3 className="gov-body-name">{pick(body.name.en, body.name.hi)}</h3>
      <p className="gov-body-about">{pick(body.about.en, body.about.hi)}</p>
      <dl className="gov-roles">
        {body.elected && (
          <div>
            <dt><Vote size={14} aria-hidden="true" /> Elected</dt>
            <dd>
              <strong>{pick(body.elected.title.en, body.elected.title.hi)}</strong>
              <span className="muted"> · {pick(body.elected.how.en, body.elected.how.hi)}</span>
            </dd>
          </div>
        )}
        {body.official && (
          <div>
            <dt><UserCheck size={14} aria-hidden="true" /> Officer</dt>
            <dd>
              <strong>{pick(body.official.title.en, body.official.title.hi)}</strong>
              <span className="muted"> · {pick(body.official.how.en, body.official.how.hi)}</span>
            </dd>
          </div>
        )}
      </dl>
      {body.handles.length > 0 && (
        <ul className="gov-handles" aria-label={t('Looks after')}>
          {body.handles.map((h) => (
            <li key={h.en}>{pick(h.en, h.hi)}</li>
          ))}
        </ul>
      )}
      <div className="gov-body-foot">
        {body.contact && <ContactLine contact={body.contact} />}
        {body.basis && <span className="tiny muted">{pick(body.basis.en, body.basis.hi)}</span>}
      </div>
    </article>
  );
}

/**
 * Who runs your area: every level of government that answers for a PIN code, from the Union to the
 * ward or village, named the way the state names them, plus who to approach for common problems.
 */
export function GovernancePage() {
  const [params, setParams] = useSearchParams();
  const { selectedPin, setSelectedPin } = usePin();
  const pin = params.get('pin') || selectedPin;
  const lookup = usePinRecord(pin);
  const record = lookup.status === 'found' ? lookup.record : null;

  const pinState = findState(record?.state);
  const state = findState(params.get('state')) ?? pinState;
  const usingPinState = !params.get('state') || state?.code === pinState?.code;

  const guessed = record ? guessSettlement(record.offices, landscapeFor(record.state, record.district) === 'city') : 'city';
  const settlement = (SETTLEMENTS.find((s) => s.id === params.get('type'))?.id ?? guessed) as Settlement;

  const chain = useMemo(() => governanceChain(state?.code, settlement), [state?.code, settlement]);
  const issues = issuesFor(settlement);
  const [issueId, setIssueId] = useState(issues[0].id);
  useEffect(() => {
    if (!issues.some((i) => i.id === issueId)) setIssueId(issues[0].id);
  }, [issues, issueId]);
  const issue = issues.find((i) => i.id === issueId) ?? issues[0];
  const route = routeFor(issue, settlement);
  const routeBody = route ? bodyForRoute(route.body, chain) : undefined;

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const stateName = state ? pick(state.name, state.nameHi) : t('your state');

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Who runs your area' }]}
        title="Who runs your area"
        lede="Every level of government that answers for your PIN code, from the Centre to your ward or village, and who to approach when something goes wrong."
      />

      <div className="gov-layout">
        <section className="card card-pad gov-controls" aria-labelledby="gov-place-h">
          <h2 id="gov-place-h" className="section-title" style={{ fontSize: 'var(--text-md)' }}>Your place</h2>
          <PinInput key={pin} initial={pin} label="PIN code" submitLabel="Show" id="gov-pin" onSubmit={(p) => { setSelectedPin(p); update({ pin: p, state: null, type: null }); }} />

          <fieldset className="gov-fieldset" style={{ marginTop: 'var(--s-4)' }}>
            <legend className="label">What kind of place is it?</legend>
            <div className="segmented gov-segmented" role="group">
              {SETTLEMENTS.map((s) => (
                <button key={s.id} type="button" aria-pressed={settlement === s.id} onClick={() => update({ type: s.id })}>
                  <span>{pick(s.label.en, s.label.hi)}</span>
                  <span className="tiny muted">{pick(s.hint.en, s.hint.hi)}</span>
                </button>
              ))}
            </div>
            {record && !params.get('type') && <p className="tiny muted" style={{ marginTop: 6 }}>Guessed from the post offices in this PIN code. Change it if it is wrong.</p>}
          </fieldset>

          <details className="gov-map-toggle" open={!usingPinState}>
            <summary>See how another state names its local bodies</summary>
            <IndiaTileMap
              label={t('Pick a state')}
              data={Object.fromEntries(INDIA_STATES.map((s) => [s.code, { tone: s.code === pinState?.code ? 'brand' : 'neutral' } as const]))}
              selected={state?.name}
              onSelect={(st) => update({ state: st.code === pinState?.code ? null : st.code })}
              legend={[{ tone: 'brand', label: 'Your PIN code’s state' }]}
            />
          </details>
        </section>

        <div className="gov-main">
          {!usingPinState && state && (
            <div className="callout callout-info" style={{ marginBottom: 'var(--s-4)' }}>
              <Info size={16} aria-hidden="true" />
              <span>
                Showing <strong>{stateName}</strong>, not the state of your PIN code.{' '}
                <button type="button" className="link" onClick={() => update({ state: null })}>Back to my state</button>
              </span>
            </div>
          )}
          {chain.notes.map((n) => (
            <div key={n.en} className="callout" style={{ marginBottom: 'var(--s-4)' }}>
              <Info size={16} aria-hidden="true" />
              <span>{pick(n.en, n.hi)}</span>
            </div>
          ))}

          <section className="card card-pad gov-fix" aria-labelledby="gov-fix-h">
            <h2 id="gov-fix-h" className="section-title">Who fixes what</h2>
            <p className="small muted" style={{ marginTop: 4 }}>Pick a problem to see who answers for it here, who to approach first and where to go next.</p>
            <div className="cluster gov-issue-chips" role="group" aria-label={t('Problems')}>
              {issues.map((i) => (
                <button key={i.id} type="button" className="chip" aria-pressed={i.id === issue.id} onClick={() => setIssueId(i.id)}>
                  {pick(i.label.en, i.label.hi)}
                </button>
              ))}
            </div>
            {route && (
              <div className="gov-route" aria-live="polite">
                <div className="gov-route-body">
                  <span className="eyebrow">Answers for it</span>
                  <strong>{routeBody ? pick(routeBody.name.en, routeBody.name.hi) : '—'}</strong>
                </div>
                <ol className="gov-steps">
                  <li>
                    <span className="gov-step-label">Start here</span>
                    {pick(route.first.en, route.first.hi)}
                  </li>
                  {route.escalate.map((e, i) => (
                    <li key={e.en}>
                      <span className="gov-step-label">{i === 0 ? t('If nothing happens') : t('Then')}</span>
                      {pick(e.en, e.hi)}
                    </li>
                  ))}
                </ol>
                {route.channel && <ContactLine contact={route.channel} />}
                <p className="tiny muted" style={{ marginTop: 'var(--s-3)' }}>
                  Keep the complaint number or a dated copy of your letter at every step. If there is no reply in 30 days, an RTI asking for the action taken often gets one.
                </p>
                <div className="cluster" style={{ marginTop: 'var(--s-3)' }}>
                  <Link to="/report-issue" className="btn btn-primary btn-sm">Report it on JantaX <ArrowRight size={14} aria-hidden="true" /></Link>
                  <Link to="/rti/draft" className="btn btn-secondary btn-sm">Draft an RTI</Link>
                </div>
              </div>
            )}
          </section>

          <h2 className="section-title" style={{ margin: 'var(--s-8) 0 var(--s-4)' }}>From the Centre to your ward</h2>
          <ol className="gov-chain">
            {chain.groups.filter((g) => g.level !== 'department').map((g) => (
              <li key={g.level} className={`gov-level gov-level-${g.level}`}>
                <h2 className="gov-level-title">
                  <Landmark size={16} aria-hidden="true" /> {pick(g.title.en, g.title.hi)}
                </h2>
                <div className="gov-bodies">
                  {g.bodies.map((b) => (
                    <BodyCard key={b.id} body={b} />
                  ))}
                </div>
              </li>
            ))}
          </ol>


          <section aria-labelledby="gov-dept-h" style={{ marginTop: 'var(--s-6)' }}>
            <h2 id="gov-dept-h" className="section-title">Departments that do the work</h2>
            <div className="gov-bodies" style={{ marginTop: 'var(--s-3)' }}>
              {chain.groups.find((g) => g.level === 'department')?.bodies.map((b) => <BodyCard key={b.id} body={b} />)}
            </div>
          </section>

          <p className="small muted" style={{ marginTop: 'var(--s-6)' }}>
            JantaX lists offices, not the people holding them, because office-holders change and we only publish what we can source. Find current names through the links on each card. Titles differ between states and sometimes within one; if something here is wrong for your area, <Link to="/transparency/corrections">request a correction</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
