# JantaX design system

JantaX is a public-interest data product. The interface has one job: make an official figure, its source and what was found on the ground readable in seconds, on a cheap phone, in Hindi or English, in daylight or at night.

Design read: trust-first civic data product for Indian citizens, clear and neutral, modern product finish. Variance low, motion low, density medium.

## Principles

1. **Every number is traceable.** Anything shown as a figure carries a source line (`SourceLine`) with a link and a date.
2. **Claim beside reality.** Official records and ground truth sit side by side (`ClaimReality`), never mixed into one number.
3. **Neutral language.** Status words are factual: Delayed, Extended, Under review, Needs attention. Never corrupt, scam, shame or fraud unless a competent authority has ruled so. No party colours.
4. **Plain words.** Short labels, sentence case, no internal jargon (no "Project 777", "Phase 23", "Data Gateway").
5. **Honest fallbacks.** When the API is down we show bundled sample data and say so in the status banner. Sample-only modules say so on the page.

## Tokens

All colour, type, spacing, radius and elevation values live in `src/tokens.css` as CSS variables, with a light theme on `:root` and a dark theme on `:root[data-theme='dark']`. Never hard-code a hex value in a component.

| Group | Tokens | Use |
|---|---|---|
| Neutrals | `--canvas`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-strong` | Page, cards, inset panels, dividers |
| Text | `--ink`, `--ink-2`, `--ink-3`, `--ink-4`, `--on-solid` | Primary, secondary, muted, placeholder, text on solid fills |
| Brand | `--brand`, `--brand-hover`, `--brand-ink`, `--brand-soft`, `--brand-line` | Primary buttons, links, selected states |
| Accent | `--accent`, `--accent-ink`, `--accent-soft` | Saffron. Brand mark, active nav underline, one hero highlight. Use sparingly |
| Status | `--good`, `--warn`, `--bad`, `--info` plus `-soft`, `-line`, `-solid` | Text, tinted backgrounds, borders, solid fills that carry white text |
| Data | `--viz-1` to `--viz-8` | Chart series, map layers, module icons |

Legacy names (`--bg-primary`, `--text-muted`, `--color-primary` and so on) are aliased at the bottom of `tokens.css` so older code follows the same palette.

Tailwind is configured to read the same variables (`bg-surface`, `text-ink-3`, `border-line`, `text-bad`...). Its preflight is off; `src/index.css` owns the base reset.

## Type

- UI and body: Inter Variable, with Noto Sans Devanagari for Hindi.
- Headings and numbers: Anek Latin and Anek Devanagari (Ek Type, an Indian foundry), so English and Hindi headings match.
- Mono: JetBrains Mono, for codes such as UDISE numbers.
- Fonts are self-hosted through `@fontsource-variable/*`; nothing loads from Google at runtime.
- Numbers use `font-variant-numeric: tabular-nums` (`.num`) so columns line up.

## Shape and elevation

One radius rule: controls (buttons, inputs, selects) `--r-md` 10px, surfaces (cards, tables, panels) `--r-lg` 14px, badges and chips `--r-pill`. Shadows are tinted navy and kept subtle; cards rely on a 1px border first.

## Components

React primitives live in `src/ui/`:

| Component | Purpose |
|---|---|
| `PageHeader`, `Breadcrumbs` | Title, lede, actions and trail for every page |
| `Badge`, `toneForStatus`, `toneForScore` | Status pills with consistent tone mapping |
| `Stat` (+ `.stat-row`) | Label, value, unit, meta |
| `ClaimReality` | Official record next to ground truth |
| `SourceLine` | Provenance footer |
| `PinInput` | Validated six-digit PIN entry with resolved district |
| `EmptyState` | Icon, title, text, action |
| `ModuleIcon`, `MODULE_GROUPS`, `getModule`, `moduleHref` | Module catalogue metadata |
| `ToastProvider`/`useToast`, `useShare`, `useDismiss` | Feedback, native share, popover dismissal |

CSS classes in `src/components.css`: `.page`, `.card`, `.btn` (`-primary`, `-secondary`, `-ghost`, `-soft`, `-share`, `-danger`), `.input`, `.select`, `.chip`, `.tabs`/`.tab`, `.segmented`, `.table`, `.list`/`.list-row`, `.callout-*`, `.meter`, `.skeleton`.

Module screens use the shared kit in `src/modules/shared/ModuleKit.tsx`: `useModulePin` (PIN synced to `?pin=` and the global PIN), `ModulePinBar`, `EvidenceCard`, `Kv`, `SectionTitle`. Every module renders inside `ModuleFrame`, which supplies the header, sources, sub-navigation and disclaimer.

## Layout

- Page width 1240px (`--page-max`), 20px side gutter, 16px on phones.
- Sticky 64px header. One-line nav from 1024px; below that the menu drawer takes over.
- Every multi-column layout collapses explicitly at 1024px and 640px. No page may scroll sideways at 390px.

## Writing rules

- Sentence case for headings and buttons. Button labels are verbs, three words at most.
- No em-dashes in visible copy. Use a full stop, comma, colon or a middle dot for bilingual pairs.
- No emoji as icons. Use `lucide-react` at a consistent size.
- Labels above inputs; hints and errors below.

## Quality loop

Every change to a screen goes through generate, screenshot, critique, fix:

```bash
npx tsc --noEmit -p .   # types
npm test                # unit tests
npm run build           # production build
npm run test:e2e        # Playwright smoke, desktop and mobile
```

Check each changed screen at 1440px and 390px, in light and dark themes, for overflow, contrast and empty/loading/error states.
