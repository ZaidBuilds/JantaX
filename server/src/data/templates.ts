import { accessSetting, type DatasetSpec } from './spec';

/** Header row for a hand-compiled import file. Field ids are always accepted as column names. */
export const templateCsv = (spec: DatasetSpec) => `${Object.keys(spec.fields).join(',')}\n`;

export const templatePath = (spec: DatasetSpec) => (spec.access.kind === 'file' ? spec.access.template : `data/templates/${spec.id}.csv`);

const ACCESS_LABEL = { ogd: 'data.gov.in API', ckan: 'CKAN API', url: 'Download link', file: 'File import' } as const;

const esc = (s: string) => s.replace(/\|/g, '\\|');

/** docs/DATASETS.md: every dataset, where it comes from, how to switch it on and what columns it reads. */
export function catalogMarkdown(specs: DatasetSpec[]): string {
  const out: string[] = [
    '# Dataset catalog',
    '',
    'Generated from `server/src/data/catalog/` by `npm run data -- templates`. Do not edit by hand.',
    '',
    'Every dataset can also be loaded from a downloaded file: `npm run data -- sync <id> --file <path>` (CSV, JSON or XLSX, optionally gzipped).',
    'Check a resource id or a file before loading it: `npm run data -- inspect <id> [--file <path>]`.',
    '',
    '| Dataset | Module | Level | Access | Setting | Refresh |',
    '|---|---|---|---|---|---|',
    ...specs.map((s) => `| [${esc(s.title)}](#${s.id}) | ${s.module} | ${s.level} | ${ACCESS_LABEL[s.access.kind]} | ${accessSetting(s) ? `\`${accessSetting(s)}\`` : '—'} | ${s.schedule} |`),
    '',
  ];
  for (const s of specs) {
    out.push(
      `## ${s.id}`,
      '',
      `**${s.title}.** ${s.summary}`,
      '',
      `- Publisher: ${s.publisher}${s.department ? ` (${s.department})` : ''}`,
      `- Source: ${s.sourceUrl}`,
      `- Licence: ${s.licenseUrl ? `[${s.license}](${s.licenseUrl})` : s.license}`,
      `- Attribution: ${s.attribution}`,
      `- Access: ${ACCESS_LABEL[s.access.kind]}${accessSetting(s) ? `, set \`${accessSetting(s)}\`` : ''}${s.access.kind === 'ckan' ? ` on ${s.access.baseUrl}` : ''}`,
      `- How to get it: ${s.access.find}`,
      `- Import template: \`${templatePath(s)}\``,
      `- Row key: ${s.key.map((k) => `\`${k}\``).join(', ')}${s.replace ? ' (each download replaces the previous one)' : ''}`,
      '',
      '| Column | Meaning | Type | Required | Also accepted |',
      '|---|---|---|---|---|',
      ...Object.entries(s.fields).map(
        ([id, f]) => `| \`${id}\` | ${esc(f.label)}${f.unit ? ` (${f.unit})` : ''} | ${f.type} | ${f.required || s.key.includes(id) ? 'yes' : ''} | ${f.from.map(esc).join('; ')} |`
      ),
      ''
    );
    if (s.notes) out.push(s.notes, '');
  }
  return out.join('\n');
}
