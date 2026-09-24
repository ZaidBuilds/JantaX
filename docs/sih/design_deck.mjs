import pptxgen from "pptxgenjs";
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";

// palette
const NAVY="0F2D59", BLUE="2563EB", ORANGE="F97316", GREEN="15803D";
const INK="1E293B", SLATE="64748B", MUTE="94A3B8", LIGHT="F1F5F9", WHITE="FFFFFF", LINE="E2E8F0";
const HEAD="Cambria", BODY="Calibri";
const BASE="D:/zaidsystem/02_Coding/01_Working/JantaX/docs/sih/";
const OUT=BASE+"JantaX_SIH2026_Designed.pptx";
const SHOT=BASE+"assets/01_home.png";

/* ---------- SLIDE 1 — TITLE ---------- */
const s1=p.addSlide();
s1.background={color:NAVY};
s1.addText([
  {text:"Janta",options:{color:WHITE}},{text:"X",options:{color:ORANGE}},
],{x:0.6,y:0.55,w:6,h:0.8,fontFace:HEAD,fontSize:44,bold:true,isTextBox:true,margin:0});
s1.addText("BHARAT PUBLIC INTELLIGENCE",{x:0.63,y:1.28,w:7,h:0.3,fontFace:BODY,fontSize:11,color:MUTE,charSpacing:3,isTextBox:true,margin:0});
s1.addText("Smart India Hackathon 2026",{x:0.6,y:2.25,w:12,h:0.4,fontFace:BODY,fontSize:15,color:"CADCFC",charSpacing:1,isTextBox:true,margin:0});
s1.addText([
  {text:"India, explained by ",options:{color:WHITE}},
  {text:"where you live.",options:{color:"7DA6FF"}},
],{x:0.6,y:2.62,w:12.2,h:1.1,fontFace:HEAD,fontSize:44,bold:true,isTextBox:true,margin:0});
s1.addText("A citizen platform that unifies fragmented public data — representatives, schemes, projects and services — into one locality view, opened by a PIN code.",
  {x:0.6,y:3.72,w:11.6,h:0.7,fontFace:BODY,fontSize:15,color:"CBD5E1",isTextBox:true,margin:0});

const meta=[["Problem Statement ID","SIH26202"],["Theme","Smart Automation"],["Category","Software"],["Track","Student Innovation"]];
let mx=0.6;
meta.forEach(([k,v])=>{
  s1.addShape(p.ShapeType.roundRect,{x:mx,y:4.65,w:2.85,h:1.0,rectRadius:0.08,fill:{color:"16386B"},line:{color:"24487F",width:1}});
  s1.addText(k,{x:mx+0.16,y:4.77,w:2.55,h:0.3,fontFace:BODY,fontSize:10,color:MUTE,charSpacing:1,isTextBox:true,margin:0});
  s1.addText(v,{x:mx+0.16,y:5.06,w:2.55,h:0.52,fontFace:HEAD,fontSize:13.5,bold:true,color:WHITE,isTextBox:true,margin:0});
  mx+=3.0;
});
s1.addText([
  {text:"Team ",options:{color:MUTE}},{text:"Apex Builders",options:{color:WHITE,bold:true}},
  {text:"   ·   Team ID ",options:{color:MUTE}},{text:"[Team ID]",options:{color:WHITE,bold:true}},
  {text:"   ·   Swami Vivekanand Subharti University",options:{color:"CBD5E1"}},
],{x:0.6,y:6.05,w:12.2,h:0.4,fontFace:BODY,fontSize:13,isTextBox:true,margin:0});
s1.addText("Mohd Zaid (Lead) · Anshul Saini · Aamir Raza · Zoya Sheikh · Anushka Rana · Aaradhiya",
  {x:0.6,y:6.5,w:12.2,h:0.35,fontFace:BODY,fontSize:11.5,color:MUTE,isTextBox:true,margin:0});

function header(s,n,kicker,title){
  s.background={color:WHITE};
  s.addText(String(n).padStart(2,"0"),{x:0.6,y:0.48,w:1.1,h:0.9,fontFace:HEAD,fontSize:38,bold:true,color:"CBD5E1",isTextBox:true,margin:0});
  s.addText(kicker,{x:1.6,y:0.52,w:11,h:0.3,fontFace:BODY,fontSize:12,bold:true,color:ORANGE,charSpacing:2,isTextBox:true,margin:0});
  s.addText(title,{x:1.58,y:0.82,w:11.2,h:0.7,fontFace:HEAD,fontSize:28,bold:true,color:NAVY,isTextBox:true,margin:0});
}

/* ---------- SLIDE 2 — PROPOSED SOLUTION ---------- */
const s2=p.addSlide();
header(s2,2,"PROPOSED SOLUTION","One question: what is happening around me?");
s2.addText("Idea: JantaX — a citizen intelligence platform. Enter a PIN code and see everything tied to that place: your representatives (Gram Pradhan, MLA, MP), active government schemes, running projects, and public services — with the source and freshness shown on every fact.",
  {x:0.63,y:1.85,w:12.1,h:1.0,fontFace:BODY,fontSize:15,color:INK,lineSpacingMultiple:1.12,isTextBox:true,margin:0});

// flow DISCOVER -> UNDERSTAND -> VERIFY -> ACT
const flow=[["DISCOVER","PIN / locality"],["UNDERSTAND","records + services"],["VERIFY","source + freshness"],["ACT","official channel"]];
let fx=0.63; const fw=2.75, gap=0.35;
flow.forEach(([t,d],i)=>{
  s2.addShape(p.ShapeType.roundRect,{x:fx,y:3.1,w:fw,h:1.15,rectRadius:0.08,fill:{color:i===3?ORANGE:"EFF4FB"},line:{color:i===3?ORANGE:"C9D8F0",width:1}});
  s2.addText(t,{x:fx,y:3.28,w:fw,h:0.45,align:"center",fontFace:HEAD,fontSize:17,bold:true,color:i===3?WHITE:NAVY,isTextBox:true,margin:0});
  s2.addText(d,{x:fx,y:3.72,w:fw,h:0.35,align:"center",fontFace:BODY,fontSize:11.5,color:i===3?"FFE7D1":SLATE,isTextBox:true,margin:0});
  if(i<3) s2.addText("→",{x:fx+fw,y:3.1,w:gap,h:1.15,align:"center",valign:"middle",fontFace:BODY,fontSize:22,bold:true,color:MUTE,isTextBox:true,margin:0});
  fx+=fw+gap;
});

// two supporting points below
s2.addText("HOW IT ADDRESSES THE PROBLEM",{x:0.63,y:4.6,w:6,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
s2.addText([
  {text:"Public data exists but is scattered across dozens of portals; JantaX unifies it locality-first on one PIN model.",options:{bullet:{code:"2022"},breakLine:true}},
  {text:"Core goal: awareness, transparency and accountability — schools, health, roads and welfare are modules on one engine.",options:{bullet:{code:"2022"}}},
],{x:0.63,y:4.92,w:6.1,h:1.4,fontFace:BODY,fontSize:13,color:INK,paraSpaceAfter:8,lineSpacingMultiple:1.05,isTextBox:true,margin:0});

s2.addText("WHAT MAKES IT UNIQUE",{x:7.0,y:4.6,w:5.7,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
s2.addText([
  {text:"Source-first — every record cites origin + date.",options:{bullet:{code:"2022"},breakLine:true}},
  {text:"Official record ≠ ground reality — shown separately.",options:{bullet:{code:"2022"},breakLine:true}},
  {text:"Neutral, multilingual, mobile-first public utility.",options:{bullet:{code:"2022"}}},
],{x:7.0,y:4.92,w:5.7,h:1.4,fontFace:BODY,fontSize:13,color:INK,paraSpaceAfter:6,lineSpacingMultiple:1.05,isTextBox:true,margin:0});

/* ---------- SLIDE 3 — TECHNICAL APPROACH ---------- */
const s3=p.addSlide();
header(s3,3,"TECHNICAL APPROACH","A working prototype on a reusable engine");
// pipeline steps
s3.addText("DATA-TO-CITIZEN PIPELINE",{x:0.63,y:1.85,w:8,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
const steps=["Fetch","OCR / Extract","Validate","Normalise","Map to PIN","Publish"];
let px=0.63; const sw=1.9, sg=0.14;
steps.forEach((st,i)=>{
  s3.addShape(p.ShapeType.roundRect,{x:px,y:2.2,w:sw,h:0.62,rectRadius:0.05,fill:{color:i===steps.length-1?ORANGE:"EFF4FB"},line:{color:i===steps.length-1?ORANGE:"C9D8F0",width:1}});
  s3.addText(st,{x:px,y:2.2,w:sw,h:0.62,align:"center",valign:"middle",fontFace:BODY,fontSize:11,bold:true,color:i===steps.length-1?WHITE:NAVY,isTextBox:true,margin:0});
  if(i<steps.length-1) s3.addText("→",{x:px+sw,y:2.2,w:sg,h:0.62,align:"center",valign:"middle",fontFace:BODY,fontSize:13,color:MUTE,isTextBox:true,margin:0});
  px+=sw+sg;
});
s3.addText("Raw sources kept separate from derived views; a source registry tags every record with licence, date and freshness.",
  {x:0.63,y:2.95,w:12,h:0.4,fontFace:BODY,fontSize:11.5,italic:true,color:SLATE,isTextBox:true,margin:0});
// stack (left) + screenshot (right)
s3.addText("STACK",{x:0.63,y:3.55,w:6,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
s3.addText([
  {text:"Frontend  ",options:{bold:true,color:NAVY}},{text:"React 18 · TypeScript · Vite · Tailwind · Leaflet / GIS",options:{color:INK},breakLine:true},
  {text:"Backend  ",options:{bold:true,color:NAVY}},{text:"Node/Express 5 · Prisma 6 · PostgreSQL (PostGIS-ready)",options:{color:INK},breakLine:true},
  {text:"AI  ",options:{bold:true,color:NAVY}},{text:"OCR + retrieval-grounded HelpBot (answers only from sourced data)",options:{color:INK},breakLine:true},
  {text:"Quality  ",options:{bold:true,color:NAVY}},{text:"Vitest + Playwright (89 tests) · Docker · Vercel",options:{color:INK}},
],{x:0.63,y:3.88,w:6.0,h:2.2,fontFace:BODY,fontSize:12.5,paraSpaceAfter:8,lineSpacingMultiple:1.05,isTextBox:true,margin:0});
s3.addShape(p.ShapeType.roundRect,{x:6.95,y:3.55,w:5.8,h:3.1,rectRadius:0.06,fill:{color:"F8FAFC"},line:{color:LINE,width:1}});
s3.addImage({path:SHOT,x:7.13,y:3.72,w:5.44,h:2.55,rounding:true});
s3.addText("Live prototype — every record shows its government source.",{x:7.13,y:6.3,w:5.44,h:0.3,align:"center",fontFace:BODY,fontSize:10.5,italic:true,color:SLATE,isTextBox:true,margin:0});

/* ---------- SLIDE 4 — FEASIBILITY & VIABILITY ---------- */
const s4=p.addSlide();
header(s4,4,"FEASIBILITY & VIABILITY","Organising land data that already exists");
const cols=[
  ["Why feasible",GREEN,["Citizen layer over open government data (GODL-India licensed) — legally reusable.","Modular connectors — onboard sources gradually.","MVP: one district; working prototype already live."]],
  ["Key risks",ORANGE,["Heterogeneous state portals, PDFs, update cycles.","Stale or conflicting records.","Source licensing / reuse limits.","Privacy of land & personal data."]],
  ["Mitigation",BLUE,["Source registry + provenance + freshness.","Validation, versioning, change detection.","Primary-source-first, permission-aware.","PII masking; official vs reality separate."]],
];
let cx=0.63; const cw=3.95, cgap=0.2;
cols.forEach(([t,col,items])=>{
  s4.addShape(p.ShapeType.roundRect,{x:cx,y:1.95,w:cw,h:4.6,rectRadius:0.06,fill:{color:"F8FAFC"},line:{color:LINE,width:1}});
  s4.addShape(p.ShapeType.ellipse,{x:cx+0.25,y:2.2,w:0.3,h:0.3,fill:{color:col}});
  s4.addText(t,{x:cx+0.65,y:2.16,w:cw-0.8,h:0.4,fontFace:HEAD,fontSize:16,bold:true,color:NAVY,isTextBox:true,margin:0});
  s4.addText(items.map((it,i)=>({text:it,options:{bullet:{code:"2022"},breakLine:i<items.length-1}})),
    {x:cx+0.28,y:2.72,w:cw-0.55,h:3.6,fontFace:BODY,fontSize:12.5,color:INK,paraSpaceAfter:9,lineSpacingMultiple:1.05,isTextBox:true,margin:0});
  cx+=cw+cgap;
});
/* ---------- SLIDE 5 — IMPACT & BENEFITS ---------- */
const s5=p.addSlide();
header(s5,5,"IMPACT & BENEFITS","One engine, many public-service domains");
// who benefits (left)
s5.addText("WHO BENEFITS",{x:0.63,y:1.9,w:6,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
const ppl=[["Parent","Truth about the local government school."],["Citizen","See representatives, schemes & projects by PIN."],["Homebuyer","Builder's real RERA & project record."],["Journalist / NGO","Scattered public records, connected fast."],["Institution","Recurring service-delivery patterns + evidence."]];
let py=2.25;
ppl.forEach(([r,d])=>{
  s5.addShape(p.ShapeType.roundRect,{x:0.63,y:py,w:5.95,h:0.74,rectRadius:0.05,fill:{color:"F8FAFC"},line:{color:LINE,width:1}});
  s5.addText(r,{x:0.8,y:py+0.06,w:2.0,h:0.62,valign:"middle",fontFace:HEAD,fontSize:12.5,bold:true,color:BLUE,isTextBox:true,margin:0});
  s5.addText(d,{x:2.85,y:py+0.06,w:3.6,h:0.62,valign:"middle",fontFace:BODY,fontSize:11,color:INK,lineSpacingMultiple:1.0,isTextBox:true,margin:0});
  py+=0.82;
});
// expansion roadmap (right)
s5.addText("EXPANSION ROADMAP",{x:7.0,y:1.9,w:5.7,h:0.3,fontFace:BODY,fontSize:11.5,bold:true,color:SLATE,charSpacing:1,isTextBox:true,margin:0});
const phases=[["1","Locality OS + Schools"],["2","Health + Welfare + Works"],["3","RERA + Land + Courts + Power"],["4","National multi-domain layer"]];
let qy=2.25;
phases.forEach(([n,t],i)=>{
  s5.addShape(p.ShapeType.ellipse,{x:7.0,y:qy+0.05,w:0.5,h:0.5,fill:{color:i===3?ORANGE:NAVY}});
  s5.addText(n,{x:7.0,y:qy+0.05,w:0.5,h:0.5,align:"center",valign:"middle",fontFace:HEAD,fontSize:16,bold:true,color:WHITE,isTextBox:true,margin:0});
  s5.addText(t,{x:7.7,y:qy,w:5.0,h:0.6,valign:"middle",fontFace:HEAD,fontSize:14.5,bold:true,color:NAVY,isTextBox:true,margin:0});
  if(i<3) s5.addShape(p.ShapeType.line,{x:7.25,y:qy+0.55,w:0,h:0.42,line:{color:"C9D8F0",width:2}});
  qy+=0.82;
});
// stat band
s5.addShape(p.ShapeType.roundRect,{x:0.63,y:5.62,w:12.05,h:1.0,rectRadius:0.08,fill:{color:NAVY}});
s5.addText([
  {text:"Not 20 products — ",options:{color:"CBD5E1"}},
  {text:"one reusable civic engine",options:{color:ORANGE}},
  {text:"; every new sector plugs into the same pipeline.",options:{color:WHITE}},
],{x:0.63,y:5.62,w:12.05,h:1.0,align:"center",valign:"middle",fontFace:HEAD,fontSize:19,bold:true,isTextBox:true,margin:0});

/* ---------- SLIDE 6 — REFERENCES ---------- */
const s6=p.addSlide();
s6.background={color:NAVY};
s6.addText("RESEARCH & REFERENCES",{x:0.6,y:0.55,w:10,h:0.3,fontFace:BODY,fontSize:12,bold:true,color:ORANGE,charSpacing:2,isTextBox:true,margin:0});
s6.addText("Every source is public and openly licensed",{x:0.58,y:0.85,w:12,h:0.7,fontFace:HEAD,fontSize:28,bold:true,color:WHITE,isTextBox:true,margin:0});
const refs=[["data.gov.in","National Open Data · GODL-India"],["UDISE+","Ministry of Education — schools"],["PMGSY / NHAI","Rural & national roads"],["NHM / HMIS","Ministry of Health — facilities"],["State RERA","Housing & project records"],["NFSA / PDS","Food security & ration shops"],["DARPG / CPGRAMS","Public grievance data"],["ECI / MyNeta","Representatives & candidates"]];
let rx=0.6, ry=1.95;
refs.forEach(([t,d],i)=>{
  const c=i%2, x=0.6+c*6.15, y=ry+Math.floor(i/2)*0.92;
  s6.addShape(p.ShapeType.roundRect,{x,y,w:5.9,h:0.78,rectRadius:0.05,fill:{color:"16386B"},line:{color:"24487F",width:1}});
  s6.addText(t,{x:x+0.22,y:y+0.09,w:5.4,h:0.32,fontFace:HEAD,fontSize:14,bold:true,color:"7DA6FF",isTextBox:true,margin:0});
  s6.addText(d,{x:x+0.22,y:y+0.41,w:5.4,h:0.3,fontFace:BODY,fontSize:11,color:"CBD5E1",isTextBox:true,margin:0});
});
s6.addText([
  {text:"Principle: primary-source-first · provenance-driven · freshness-aware · neutral",options:{color:MUTE,breakLine:true}},
  {text:"Prototype: github.com/ZaidBuilds/JantaX   ·   Smart India Hackathon 2026 — sih.gov.in",options:{color:"CBD5E1"}},
],{x:0.6,y:6.5,w:12.2,h:0.7,fontFace:BODY,fontSize:12,paraSpaceAfter:3,isTextBox:true,margin:0});

p.writeFile({fileName:OUT}).then(f=>console.log("OK",f));
