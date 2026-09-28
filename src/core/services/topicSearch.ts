import { MODULE_GROUPS, getModule, moduleHref } from '../../ui/modules';

export interface TopicHit {
  id: string;
  title: string;
  text: string;
  to: string;
  /** Module id, for its icon; pages have none. */
  module?: string;
}

/** Tool pages people look for by task rather than by module. */
const PAGES: (TopicHit & { keywords: string })[] = [
  { id: 'report', title: 'Report an issue', text: 'File a photo report about a road, school, clinic, water supply or ward service.', to: '/report-issue', keywords: 'report complaint photo pothole issue problem file' },
  { id: 'governance', title: 'Who runs your area', text: 'Every level of government for your PIN code, from the Centre to your ward or village, and who fixes what.', to: '/governance', keywords: 'government governance mp mla sarpanch pradhan mukhiya pramukh block zila panchayat parishad mayor councillor parshad corporator ward nagar nigam palika municipal mcd pwd bdo collector dm district magistrate tehsildar jal board discom electricity accountable responsible who' },
  { id: 'reports', title: 'Citizen reports', text: 'Reports filed by residents, after moderation.', to: '/reports', keywords: 'citizen reports complaints evidence ground truth' },
  { id: 'compare', title: 'Compare areas', text: 'Put PIN codes side by side on the same public measures.', to: '/compare', keywords: 'compare areas pin side by side' },
  { id: 'map', title: 'Map', text: 'Public records near a PIN code, on a map.', to: '/maps', keywords: 'map location near nearby' },
  { id: 'rti', title: 'Draft an RTI application', text: 'A ready-to-file Right to Information request for a public authority.', to: '/rti/draft', keywords: 'rti right to information draft application request' },
  { id: 'cnr', title: 'Track a court case (CNR)', text: 'Find the status of a case with its 16-digit CNR number.', to: '/courts/cnr-guide', keywords: 'court case cnr ecourts status hearing' },
  { id: 'voter', title: 'Voter services', text: 'Voter ID, corrections and finding your polling booth.', to: '/booth/voter-services', keywords: 'voter id epic form 6 booth election register' },
  { id: 'complaint', title: 'Civic complaint to your ward', text: 'Draft a complaint about garbage, streetlights or drains.', to: '/nagar/complaint', keywords: 'ward complaint garbage streetlight drain municipal corporation' },
  { id: 'grap', title: 'GRAP pollution rules', text: 'What is restricted at each Graded Response Action Plan stage.', to: '/pollution/grap', keywords: 'grap air pollution restrictions delhi ncr stage' },
  { id: 'sources', title: 'Data sources', text: 'Every official dataset JantaX uses, and its licence.', to: '/sources', keywords: 'data sources dataset licence official government open data' },
  { id: 'freshness', title: 'Data freshness', text: 'When each source was last updated, and how many records it holds.', to: '/transparency/freshness', keywords: 'data freshness updated sync status live' },
  { id: 'method', title: 'Methodology', text: 'How records are matched to places and how scores are worked out.', to: '/transparency/methodology', keywords: 'methodology method score scoring how works' },
  { id: 'corrections', title: 'Request a correction', text: 'Challenge a figure. Every change is logged.', to: '/transparency/corrections', keywords: 'correction error wrong mistake fix dispute' },
];

const norm = (s: string) => s.toLowerCase().normalize('NFKD');
/** "schools" finds "school", "hospitals" finds "hospital". */
const stem = (w: string) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w);

/** Modules and tool pages that match every word of the query, best title matches first. */
export function searchTopics(query: string, limit = 6): TopicHit[] {
  const words = norm(query).split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(stem);
  if (!words.length || /^\d{6}$/.test(query.trim())) return [];
  const modules = MODULE_GROUPS.flatMap((g) => g.modules)
    .map((id) => getModule(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({ id: `module-${m.id}`, module: m.id, title: m.shortName, text: m.summary, to: moduleHref(m.id), keywords: `${m.hindi} ${m.dataSource}` }));
  const scored = [...modules, ...PAGES]
    .map((t) => {
      const split = (x: string) => norm(x).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
      const title = split(t.title);
      const hay = [...title, ...split(t.text), ...split(t.keywords)];
      // Match whole words or their beginnings, so "air" does not find "fair price shops".
      if (!words.every((w) => hay.some((h) => h.startsWith(w)))) return null;
      return { t, score: words.filter((w) => title.some((h) => h.startsWith(w))).length * 2 + (t.module ? 1 : 0) };
    })
    .filter((x): x is { t: (typeof modules)[number] | (typeof PAGES)[number]; score: number } => Boolean(x))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ t }) => ({ id: t.id, title: t.title, text: t.text, to: t.to, module: 'module' in t ? t.module : undefined }));
}
