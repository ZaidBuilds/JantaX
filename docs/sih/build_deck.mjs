import pptxgen from "pptxgenjs";
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";

// Palette (JantaX brand)
const NAVY = "0F2D59", BLUE = "2563EB", ORANGE = "F97316";
const INK = "1E293B", SLATE = "64748B", MUTE = "94A3B8";
const LIGHT = "F1F5F9", WHITE = "FFFFFF", LINE = "E2E8F0";
const HEAD = "Cambria", BODY = "Calibri";
const BASE = "D:/zaidsystem/02_Coding/01_Working/JantaX/docs/sih/";
const SHOT = BASE + "assets/01_home.png";

// helper: icon-in-circle number chip
function chip(s, x, y, n, col) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: 0.5, h: 0.5, fill: { color: col } });
  s.addText(String(n), { x, y, w: 0.5, h: 0.5, align: "center", valign: "middle",
    fontFace: HEAD, fontSize: 20, bold: true, color: WHITE, isTextBox: true, margin: 0 });
}

/* ---------- SLIDE 1 — TITLE ---------- */
const s1 = p.addSlide();
s1.background = { color: NAVY };
s1.addText([
  { text: "Janta", options: { fontFace: HEAD, fontSize: 40, bold: true, color: WHITE } },
  { text: "X", options: { fontFace: HEAD, fontSize: 40, bold: true, color: ORANGE } },
], { x: 0.6, y: 0.5, w: 5, h: 0.7, isTextBox: true, margin: 0 });
s1.addText("BHARAT PUBLIC INTELLIGENCE", { x: 0.62, y: 1.12, w: 6, h: 0.3,
  fontFace: BODY, fontSize: 11, color: MUTE, charSpacing: 2, isTextBox: true, margin: 0 });

s1.addText("Smart India Hackathon 2026", { x: 0.6, y: 2.15, w: 12, h: 0.4,
  fontFace: BODY, fontSize: 16, color: "CADCFC", isTextBox: true, margin: 0 });
s1.addText([
  { text: "India, explained by ", options: { color: WHITE } },
  { text: "where you live.", options: { color: BLUE === BLUE ? "7DA6FF" : WHITE } },
], { x: 0.6, y: 2.55, w: 12.1, h: 1.2, fontFace: HEAD, fontSize: 46, bold: true, isTextBox: true, margin: 0 });
s1.addText("A locality-first platform that turns fragmented public data into one civic view — starting from a PIN code.",
  { x: 0.6, y: 3.75, w: 11.5, h: 0.6, fontFace: BODY, fontSize: 16, color: "CBD5E1", isTextBox: true, margin: 0 });

// meta card
const meta = [
  ["Problem Statement ID", "SIH26202"],
  ["Theme", "Smart Automation"],
  ["Category", "Software"],
  ["Organisation", "AICTE — Student Innovation"],
];
let mx = 0.6;
meta.forEach(([k, v]) => {
  s1.addShape(p.ShapeType.roundRect, { x: mx, y: 4.7, w: 2.85, h: 1.0, rectRadius: 0.08,
    fill: { color: "16386B" }, line: { color: "24487F", width: 1 } });
  s1.addText(k, { x: mx + 0.15, y: 4.82, w: 2.55, h: 0.3, fontFace: BODY, fontSize: 10.5,
    color: MUTE, charSpacing: 1, isTextBox: true, margin: 0 });
  s1.addText(v, { x: mx + 0.15, y: 5.12, w: 2.55, h: 0.5, fontFace: HEAD, fontSize: 15,
    bold: true, color: WHITE, isTextBox: true, margin: 0 });
  mx += 3.0;
});

s1.addText([
  { text: "Team: ", options: { color: MUTE } }, { text: "[Team Name]", options: { color: WHITE, bold: true } },
  { text: "    Team ID: ", options: { color: MUTE } }, { text: "[Team ID]", options: { color: WHITE, bold: true } },
  { text: "    Institute: ", options: { color: MUTE } }, { text: "[College / University]", options: { color: WHITE, bold: true } },
], { x: 0.6, y: 6.1, w: 12.1, h: 0.5, fontFace: BODY, fontSize: 14, isTextBox: true, margin: 0 });
s1.addNotes("We are team [Team Name]. Public information about our own neighbourhood already exists but is scattered across dozens of government portals. JantaX brings it to one place, starting from a PIN code. We chose the Student Innovation track because our idea is a cross-sector platform, not a single-department tool.");

// shared content-slide header (light bg)
function header(s, n, kicker, title) {
  s.background = { color: WHITE };
  s.addText(String(n).padStart(2, "0"), { x: 0.6, y: 0.5, w: 1.1, h: 0.9, fontFace: HEAD,
    fontSize: 40, bold: true, color: LIGHT === LIGHT ? "CBD5E1" : SLATE, isTextBox: true, margin: 0 });
  s.addText(kicker, { x: 1.65, y: 0.52, w: 10, h: 0.3, fontFace: BODY, fontSize: 12,
    bold: true, color: ORANGE, charSpacing: 2, isTextBox: true, margin: 0 });
  s.addText(title, { x: 1.63, y: 0.8, w: 11, h: 0.7, fontFace: HEAD, fontSize: 30,
    bold: true, color: NAVY, isTextBox: true, margin: 0 });
}

/* ---------- SLIDE 2 — PROPOSED SOLUTION ---------- */
const s2 = p.addSlide();
header(s2, 2, "PROPOSED SOLUTION", "One question: what is happening around me?");
s2.addText([
  { text: "A citizen enters a ", options: {} },
  { text: "PIN code", options: { bold: true, color: BLUE } },
  { text: " and sees the public record for their locality across sectors — schools, health, roads, housing, welfare, tenders — with the ", options: {} },
  { text: "source and last-updated date on every fact.", options: { bold: true, color: INK } },
], { x: 0.63, y: 1.9, w: 6.1, h: 1.5, fontFace: BODY, fontSize: 16, color: INK, lineSpacingMultiple: 1.15, isTextBox: true, margin: 0 });
s2.addText("HOW IT ADDRESSES THE PROBLEM", { x: 0.63, y: 3.45, w: 6, h: 0.3, fontFace: BODY,
  fontSize: 12, bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
s2.addText([
  { text: "Fragmented public data → one locality-first view — no need to know which ministry owns what.", options: { bullet: { code: "2022" }, breakLine: true } },
  { text: "Discover → Understand → Verify the source. Nothing shown without provenance.", options: { bullet: { code: "2022" } } },
], { x: 0.63, y: 3.78, w: 6.1, h: 1.4, fontFace: BODY, fontSize: 14.5, color: INK, paraSpaceAfter: 8, lineSpacingMultiple: 1.05, isTextBox: true, margin: 0 });

// uniqueness 2x2
const uniq = [
  ["Source-first", "Origin + publication / retrieval date + freshness on every record."],
  ["Official ≠ reality", "Official record and ground reality shown side by side, never merged."],
  ["Neutral", "Pro-transparency — not pro or anti any party."],
  ["Public utility", "Multilingual, mobile-first, fast — not a heavy dashboard."],
];
s2.addText("WHAT MAKES IT UNIQUE", { x: 7.05, y: 1.85, w: 5.6, h: 0.3, fontFace: BODY,
  fontSize: 12, bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
let uy = 2.2;
uniq.forEach(([t, d], i) => {
  const ux = 7.05 + (i % 2) * 2.9, yy = uy + Math.floor(i / 2) * 1.55;
  s2.addShape(p.ShapeType.roundRect, { x: ux, y: yy, w: 2.7, h: 1.4, rectRadius: 0.06,
    fill: { color: "F8FAFC" }, line: { color: LINE, width: 1 } });
  s2.addShape(p.ShapeType.ellipse, { x: ux + 0.18, y: yy + 0.2, w: 0.28, h: 0.28, fill: { color: BLUE } });
  s2.addText(t, { x: ux + 0.55, y: yy + 0.16, w: 2.05, h: 0.4, fontFace: HEAD, fontSize: 14.5,
    bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s2.addText(d, { x: ux + 0.18, y: yy + 0.58, w: 2.35, h: 0.75, fontFace: BODY, fontSize: 11,
    color: SLATE, lineSpacingMultiple: 1.02, isTextBox: true, margin: 0 });
});
s2.addNotes("We are not picking one sector. The insight is the platform itself: one PIN, and the whole civic picture, with the source shown for every number. That is what separates JantaX from just another government portal.");

/* ---------- SLIDE 3 — TECHNICAL APPROACH ---------- */
const s3 = p.addSlide();
header(s3, 3, "TECHNICAL APPROACH", "A working prototype, running today");
// left: stack + pipeline
s3.addText("STACK", { x: 0.63, y: 1.9, w: 5, h: 0.3, fontFace: BODY, fontSize: 12, bold: true,
  color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
s3.addText([
  { text: "Frontend  ", options: { bold: true, color: NAVY } },
  { text: "React 18 · TypeScript · Vite · Tailwind · Leaflet maps", options: { color: INK }, breakLine: true },
  { text: "Backend  ", options: { bold: true, color: NAVY } },
  { text: "Node / Express 5 · Prisma 6 · PostgreSQL · JWT", options: { color: INK }, breakLine: true },
  { text: "Quality  ", options: { bold: true, color: NAVY } },
  { text: "Vitest + Playwright (89 tests) · Docker · Vercel", options: { color: INK } },
], { x: 0.63, y: 2.22, w: 5.8, h: 1.5, fontFace: BODY, fontSize: 13.5, paraSpaceAfter: 7,
  lineSpacingMultiple: 1.05, isTextBox: true, margin: 0 });
s3.addText("METHODOLOGY — INGESTION PIPELINE", { x: 0.63, y: 3.85, w: 5.8, h: 0.3, fontFace: BODY,
  fontSize: 12, bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
const steps = ["Fetch", "Validate", "Normalise", "Map to PIN", "Version", "Publish"];
let px = 0.63;
steps.forEach((st, i) => {
  s3.addShape(p.ShapeType.roundRect, { x: px, y: 4.2, w: 0.9, h: 0.5, rectRadius: 0.05,
    fill: { color: i === steps.length - 1 ? ORANGE : "EFF4FB" }, line: { color: LINE, width: 1 } });
  s3.addText(st, { x: px, y: 4.2, w: 0.9, h: 0.5, align: "center", valign: "middle", fontFace: BODY,
    fontSize: 9.5, bold: true, color: i === steps.length - 1 ? WHITE : NAVY, isTextBox: true, margin: 0 });
  px += 0.98;
});
s3.addText("Raw source records are kept separate from derived views; a source registry tags every record.",
  { x: 0.63, y: 4.95, w: 5.8, h: 0.7, fontFace: BODY, fontSize: 12, italic: true, color: SLATE,
    lineSpacingMultiple: 1.05, isTextBox: true, margin: 0 });
// right: screenshot
s3.addShape(p.ShapeType.roundRect, { x: 6.75, y: 1.9, w: 6.0, h: 3.9, rectRadius: 0.06,
  fill: { color: "F8FAFC" }, line: { color: LINE, width: 1 } });
s3.addImage({ path: SHOT, x: 6.95, y: 2.1, w: 5.6, h: 3.5, rounding: true,
  shadow: { type: "outer", color: "94A3B8", blur: 6, offset: 3, angle: 90, opacity: 0.35 } });
s3.addText("Live prototype — home / PIN search. Every record shows its government source.",
  { x: 6.95, y: 5.62, w: 5.6, h: 0.3, fontFace: BODY, fontSize: 10.5, italic: true, color: SLATE,
    align: "center", isTextBox: true, margin: 0 });
s3.addNotes("This is running today, not a mockup. The core is a location engine plus a source-tagged data layer. One architecture, and every new civic sector plugs into the same pipeline.");

/* ---------- SLIDE 4 — FEASIBILITY & VIABILITY ---------- */
const s4 = p.addSlide();
header(s4, 4, "FEASIBILITY & VIABILITY", "Organising data that is already public");
s4.addText("WHY IT IS FEASIBLE", { x: 0.63, y: 1.9, w: 5.6, h: 0.3, fontFace: BODY, fontSize: 12,
  bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
s4.addText([
  { text: "Built entirely on open government data (GODL-India licensed) — legally reusable.", options: { bullet: { code: "2022" }, breakLine: true } },
  { text: "Working prototype already live; PIN-first design scales one district at a time.", options: { bullet: { code: "2022" }, breakLine: true } },
  { text: "We create no new data — we organise data that already exists.", options: { bullet: { code: "2022" } } },
], { x: 0.63, y: 2.25, w: 5.7, h: 2.4, fontFace: BODY, fontSize: 14, color: INK, paraSpaceAfter: 10,
  lineSpacingMultiple: 1.08, isTextBox: true, margin: 0 });
// right: risk -> mitigation rows
s4.addText("CHALLENGES  →  MITIGATION", { x: 6.75, y: 1.9, w: 6, h: 0.3, fontFace: BODY, fontSize: 12,
  bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
const risks = [
  ["Stale records", "Triple timestamp + “stale >90d” flag; old data never shown as current."],
  ["Source licensing", "Source registry records licence + attribution before ingestion."],
  ["Scale (19k PINs)", "Start with one state; reusable connectors per source."],
  ["Trust / misuse", "Official vs ground reality kept separate; evidence before any claim."],
];
let ry = 2.25;
risks.forEach(([r, m]) => {
  s4.addShape(p.ShapeType.roundRect, { x: 6.75, y: ry, w: 6.0, h: 0.78, rectRadius: 0.05,
    fill: { color: "F8FAFC" }, line: { color: LINE, width: 1 } });
  s4.addText(r, { x: 6.9, y: ry + 0.06, w: 1.85, h: 0.66, valign: "middle", fontFace: HEAD,
    fontSize: 12.5, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  s4.addText(m, { x: 8.8, y: ry + 0.06, w: 3.85, h: 0.66, valign: "middle", fontFace: BODY,
    fontSize: 11, color: INK, lineSpacingMultiple: 1.0, isTextBox: true, margin: 0 });
  ry += 0.9;
});
s4.addNotes("Feasible because we are not creating data. We are organising data that is already public and already ours to reuse under the GODL-India open licence. The prototype already runs, so this is an execution plan, not a wish.");

/* ---------- SLIDE 5 — IMPACT & BENEFITS ---------- */
const s5 = p.addSlide();
header(s5, 5, "IMPACT & BENEFITS", "Trust, because you can see the source");
// target users chips
s5.addText("WHO IT SERVES", { x: 0.63, y: 1.85, w: 6, h: 0.3, fontFace: BODY, fontSize: 12,
  bold: true, color: SLATE, charSpacing: 1, isTextBox: true, margin: 0 });
const users = ["Parents", "Citizens", "Homebuyers", "Students", "Journalists", "NGOs", "Researchers"];
let cx = 0.63;
users.forEach((u) => {
  const w = 0.35 + u.length * 0.105;
  s5.addShape(p.ShapeType.roundRect, { x: cx, y: 2.2, w, h: 0.44, rectRadius: 0.22,
    fill: { color: "EFF4FB" }, line: { color: "C9D8F0", width: 1 } });
  s5.addText(u, { x: cx, y: 2.2, w, h: 0.44, align: "center", valign: "middle", fontFace: BODY,
    fontSize: 11.5, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  cx += w + 0.18;
});
// benefit columns
const bens = [
  ["Social", "Citizens understand local public services without navigating five portals — better-informed participation."],
  ["Economic", "Homebuyers and small businesses check public records before deciding; researchers get sourced, normalised data."],
  ["Governance", "Transparency that strengthens — not replaces — official systems."],
];
let bx = 0.63;
bens.forEach(([t, d]) => {
  s5.addShape(p.ShapeType.roundRect, { x: bx, y: 3.1, w: 3.9, h: 1.85, rectRadius: 0.06,
    fill: { color: "F8FAFC" }, line: { color: LINE, width: 1 } });
  s5.addShape(p.ShapeType.ellipse, { x: bx + 0.22, y: 3.32, w: 0.3, h: 0.3, fill: { color: ORANGE } });
  s5.addText(t, { x: bx + 0.62, y: 3.28, w: 3.1, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true,
    color: NAVY, isTextBox: true, margin: 0 });
  s5.addText(d, { x: bx + 0.22, y: 3.75, w: 3.45, h: 1.05, fontFace: BODY, fontSize: 12, color: INK,
    lineSpacingMultiple: 1.06, isTextBox: true, margin: 0 });
  bx += 4.05;
});
// stat callout band
s5.addShape(p.ShapeType.roundRect, { x: 0.63, y: 5.25, w: 12.05, h: 1.35, rectRadius: 0.08, fill: { color: NAVY } });
s5.addText([
  { text: "1 PIN", options: { fontSize: 40, bold: true, color: ORANGE } },
  { text: "  →  12+ civic sectors on one screen — every record sourced.", options: { fontSize: 22, bold: true, color: WHITE } },
], { x: 0.63, y: 5.25, w: 12.05, h: 1.35, align: "center", valign: "middle", fontFace: HEAD, isTextBox: true, margin: 0 });
s5.addNotes("The benefit is simple: a citizen can trust what they see, because they can see where it came from. One PIN gives the whole civic picture, and every number carries its government source.");

/* ---------- SLIDE 6 — REFERENCES ---------- */
const s6 = p.addSlide();
s6.background = { color: NAVY };
s6.addText("RESEARCH & REFERENCES", { x: 0.6, y: 0.55, w: 10, h: 0.3, fontFace: BODY, fontSize: 12,
  bold: true, color: ORANGE, charSpacing: 2, isTextBox: true, margin: 0 });
s6.addText("Every source is public and openly licensed", { x: 0.58, y: 0.85, w: 12, h: 0.7,
  fontFace: HEAD, fontSize: 30, bold: true, color: WHITE, isTextBox: true, margin: 0 });
const refs = [
  ["data.gov.in", "National Open Data Platform · GODL-India"],
  ["UDISE+", "Ministry of Education — school data"],
  ["PMGSY / NHAI", "Rural & national roads"],
  ["NHM / HMIS", "Ministry of Health — facilities"],
  ["State RERA", "Housing & project records"],
  ["NFSA / PDS", "Food security & ration shops"],
  ["DARPG / CPGRAMS", "Public grievance data"],
  ["CPCB", "Air quality monitoring"],
];
let fx = 0.6, fy = 2.0;
refs.forEach(([t, d], i) => {
  const col = i % 2, x = 0.6 + col * 6.15, y = fy + Math.floor(i / 2) * 0.92;
  s6.addShape(p.ShapeType.roundRect, { x, y, w: 5.9, h: 0.78, rectRadius: 0.05,
    fill: { color: "16386B" }, line: { color: "24487F", width: 1 } });
  s6.addText(t, { x: x + 0.2, y: y + 0.08, w: 5.5, h: 0.32, fontFace: HEAD, fontSize: 14,
    bold: true, color: "7DA6FF", isTextBox: true, margin: 0 });
  s6.addText(d, { x: x + 0.2, y: y + 0.4, w: 5.5, h: 0.3, fontFace: BODY, fontSize: 11,
    color: "CBD5E1", isTextBox: true, margin: 0 });
});
s6.addText([
  { text: "Reference: Smart India Hackathon 2026 — sih.gov.in", options: { color: MUTE, breakLine: true } },
  { text: "Prototype: github.com/ZaidBuilds/JantaX", options: { color: "CBD5E1" } },
], { x: 0.6, y: 6.55, w: 12, h: 0.6, fontFace: BODY, fontSize: 12.5, paraSpaceAfter: 3, isTextBox: true, margin: 0 });
s6.addNotes("Every source here is public and openly licensed under GODL-India. The references slide is the proof: our platform stands on real, verifiable government data, not scraped or invented numbers.");

p.writeFile({ fileName: BASE + "JantaX_SIH2026.pptx" }).then(f => console.log("OK", f));
