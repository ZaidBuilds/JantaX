// Real-data-only API. Works for any Indian PIN.
//   GET /api/live/:pin           → place profile + every domain
//   GET /api/live/:pin/:domain   → one domain (school | infra | mgnrega | pollution)

import { Router } from 'express';
import { resolvePin } from '../live/pin';
import { liveSchools } from '../live/schools';
import { liveRoads } from '../live/roads';
import { liveMgnrega } from '../live/mgnrega';
import { liveAqi } from '../live/aqi';
import { unavailable, type LiveResult } from '../live/types';
import { usingSampleKey } from '../connectors/ogdClient';

const router = Router();

const DOMAINS: Record<string, (pin: string) => Promise<LiveResult<unknown>>> = {
  school: liveSchools,
  infra: liveRoads,
  mgnrega: liveMgnrega,
  pollution: liveAqi,
};

// Domains with no public, PIN-level government API (as of Nov 2026).
const NOT_COVERED: Record<string, string> = {
  rera: 'Each state runs its own RERA portal; none offers a public API.',
  election: 'ECI publishes results and affidavits as web pages and PDFs only.',
  police: 'FIR data sits on state police portals; NCRB publishes yearly district totals only.',
  land: 'Land records are on state Bhulekh portals with no public API.',
  hospital: 'Full facility registry (ABDM HFR) needs ABDM partner registration.',
  pds: 'Fair price shop lists are on state food portals with no public API.',
  grievance: 'CPGRAMS publishes ministry-level monthly totals only.',
  epfo: 'Only national and state totals are published.',
  fssai: 'FoSCoS licence search has no public API.',
};

function safe(domain: string, p: Promise<LiveResult<unknown>>) {
  return p.catch((e: Error) => unavailable(domain, `Source unreachable: ${e.message}`));
}

router.get('/:pin', async (req, res) => {
  const profile = await resolvePin(req.params.pin).catch(() => null);
  if (!profile) return res.status(404).json({ error: 'PIN code not found in India Post or LGD directories.' });

  const entries = await Promise.all(
    Object.entries(DOMAINS).map(async ([d, fn]) => [d, await safe(d, fn(profile.pin))] as const),
  );
  const notCovered = Object.fromEntries(Object.entries(NOT_COVERED).map(([d, r]) => [d, unavailable(d, r)]));

  res.json({
    profile,
    domains: { ...Object.fromEntries(entries), ...notCovered },
    sampleKey: usingSampleKey(),
    generatedAt: new Date().toISOString(),
  });
});

router.get('/:pin/:domain', async (req, res) => {
  const { pin, domain } = req.params;
  if (NOT_COVERED[domain]) return res.json(unavailable(domain, NOT_COVERED[domain]));
  const fn = DOMAINS[domain];
  if (!fn) return res.status(400).json({ error: `Unknown domain. Use: ${Object.keys(DOMAINS).join(', ')}` });
  res.json(await safe(domain, fn(pin)));
});

export default router;
