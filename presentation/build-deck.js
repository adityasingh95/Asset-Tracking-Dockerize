const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 10, height: 5.625 });
p.layout = "W";
p.author = "Aditya Singh";
p.title = "The Brownfield Run — Asset Decommission Approval";

// ---- palette (matches the greenfield deck) ----
const BG="0A0A0F", PANEL="16161F", PANEL2="15152A", BORDER="2E2E3D", BORDER2="23232F";
const T1="F1F1F5", T2="A1A1AB", T3="62626F";
const INDIGO="818CF8", VIOLET="A78BFA", GREEN="22C55E", TEAL="14C4A8", AMBER="FBBF24", RED="EF4444", BLUE="3B82F6";
const SANS="Geist", MONO="Consolas";
const ACC = TEAL; // brownfield signature accent

const S = () => { const s = p.addSlide(); s.background = { color: BG }; return s; };
function rrect(s,x,y,w,h,fill,line,rad){ s.addShape("roundRect",{x,y,w,h,fill:fill?{color:fill}:{type:"none"},line:line?{color:line,width:1}:{type:"none"},rectRadius:rad==null?0.06:rad}); }
function rect(s,x,y,w,h,fill){ s.addShape("rect",{x,y,w,h,fill:{color:fill}}); }
function txt(s,t,o){ s.addText(t,o); }

function head(s, section, page, title, acc){
  acc=acc||ACC;
  rect(s,0,0,10,0.045,acc);
  txt(s,section,{x:0.5,y:0.22,w:6,h:0.28,fontFace:MONO,fontSize:9.5,color:T2,charSpacing:1});
  txt(s,page,{x:8.3,y:0.22,w:1.2,h:0.28,fontFace:MONO,fontSize:9.5,color:T3,align:"right"});
  txt(s,title,{x:0.5,y:0.58,w:9,h:0.5,fontFace:SANS,fontSize:22,bold:true,color:T1});
}
function sub(s,t,y){ txt(s,t,{x:0.5,y:y||1.12,w:9,h:0.35,fontFace:SANS,fontSize:12.5,color:T2}); }

function stat(s,x,y,w,num,label,acc){
  txt(s,num,{x,y,w,h:0.6,fontFace:SANS,fontSize:32,bold:true,color:acc||T1,align:"left"});
  txt(s,label,{x,y:y+0.6,w,h:0.5,fontFace:MONO,fontSize:8.5,color:T2,align:"left",valign:"top"});
}
function mono(s,x,y,w,h,lines){
  rrect(s,x,y,w,h,PANEL,BORDER2,0.05);
  const runs = lines.map((l,i)=>({text:l.t, options:{color:l.c||T2, fontFace:MONO, fontSize:l.s||8.5, bold:!!l.b, breakLine:true}}));
  txt(s,runs,{x:x+0.18,y:y+0.14,w:w-0.36,h:h-0.28,align:"left",valign:"top",lineSpacingMultiple:1.12});
}

/* ============================ 1 · TITLE ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,5.625,BG);
  // faint top + bottom accent
  rect(s,0,0,10,0.06,ACC);
  txt(s,"BROWNFIELD · SPEC-DRIVEN · ORCHESTRATED",{x:0.6,y:0.7,w:9,h:0.3,fontFace:MONO,fontSize:11,color:ACC,charSpacing:2});
  txt(s,"The Brownfield Run",{x:0.6,y:1.4,w:9,h:1.0,fontFace:SANS,fontSize:46,bold:true,color:T1});
  txt(s,[
    {text:"Changing software an agent ", options:{color:T2}},
    {text:"didn't write", options:{color:ACC,italic:true}},
    {text:" — safely, with a full audit trail.", options:{color:T2}},
  ],{x:0.62,y:2.45,w:9,h:0.4,fontFace:SANS,fontSize:15});
  // terminal card
  rrect(s,0.6,3.15,8.8,1.9,PANEL,BORDER,0.06);
  rect(s,0.6,3.15,8.8,0.32,"111118");
  txt(s,"~/asset-tracking-dockerize — zsh",{x:0.8,y:3.18,w:8,h:0.26,fontFace:MONO,fontSize:9,color:T3});
  mono(s,0.6,3.5,8.8,1.55,[
    {t:"# project:  Asset Decommission Approval  ·  Spring Boot 3.2.3 / Java 17 / PostgreSQL",c:T3},
    {t:"# task:     turn an immediate soft-delete into a reviewed approval workflow",c:T3},
    {t:"# method:   archaeology → characterize → narrow change → prove   (7 phase gates)",c:T2},
    {t:"$ ./change.sh --reuse-not-replace --minimal-diff --prove-it",c:T1,b:true},
    {t:">>> a focused change, fully traceable, no regressions",c:ACC,b:true},
  ]);
})();

/* ============================ 2 · FRAMING ============================ */
(()=>{ const s=S();
  head(s,"FRAMING","",  "Greenfield proved you can build.");
  txt(s,[{text:"Brownfield asks the harder question: ",options:{color:T2}},
         {text:"can an agent safely change what it didn't write?",options:{color:ACC,bold:true}}],
     {x:0.5,y:1.05,w:9,h:0.5,fontFace:SANS,fontSize:15});
  // two contrasting cards
  rrect(s,0.5,1.8,4.35,3.0,PANEL,BORDER,0.06);
  rect(s,0.5,1.8,4.35,0.07,INDIGO);
  txt(s,"GREENFIELD",{x:0.75,y:2.0,w:4,h:0.3,fontFace:MONO,fontSize:10,color:INDIGO,charSpacing:1});
  txt(s,"Build a new app from a spec pack.",{x:0.75,y:2.35,w:3.9,h:0.5,fontFace:SANS,fontSize:14,bold:true,color:T1});
  txt(s,[
    {text:"The risk is capability — ",options:{color:T2,breakLine:false}},
    {text:"can we build it?",options:{color:T1,breakLine:true}},
    {text:"Nothing exists to break. The spec flows ",options:{color:T2,breakLine:false}},
    {text:"forward into code.",options:{color:T2,breakLine:true}},
  ],{x:0.75,y:2.85,w:3.9,h:1.7,fontFace:SANS,fontSize:12.5,valign:"top",lineSpacingMultiple:1.2});

  rrect(s,5.15,1.8,4.35,3.0,PANEL,BORDER,0.06);
  rect(s,5.15,1.8,4.35,0.07,ACC);
  txt(s,"BROWNFIELD",{x:5.4,y:2.0,w:4,h:0.3,fontFace:MONO,fontSize:10,color:ACC,charSpacing:1});
  txt(s,"Make one change to a working app.",{x:5.4,y:2.35,w:3.9,h:0.5,fontFace:SANS,fontSize:14,bold:true,color:T1});
  txt(s,[
    {text:"The risk is ",options:{color:T2,breakLine:false}},
    {text:"hidden regressions",options:{color:AMBER,breakLine:false}},
    {text:" — breaking what already works.",options:{color:T2,breakLine:true}},
    {text:"You must understand and ",options:{color:T2,breakLine:false}},
    {text:"characterize first.",options:{color:T1,breakLine:true}},
  ],{x:5.4,y:2.85,w:3.9,h:1.7,fontFace:SANS,fontSize:12.5,valign:"top",lineSpacingMultiple:1.2});
  txt(s,"Same discipline. Inverted risk. The spec governs what should be true after — the code wins on what's true today.",
     {x:0.5,y:5.0,w:9,h:0.4,fontFace:SANS,fontSize:11,italic:true,color:T3,align:"center"});
})();

/* ============================ 3 · WHAT WE'LL COVER ============================ */
(()=>{ const s=S();
  head(s,"OVERVIEW","","What we'll cover");
  const items=[
    ["§1","The Brownfield Workflow","The fixed order, the five rules, and the audit layer that kept every change traceable.",ACC],
    ["§2","Archaeology","Phase 0 — knowing the repo before touching it. Surfacing surprises, not coding around them.",INDIGO],
    ["§3","The Change","One narrow, well-evidenced change that reuses the existing soft-delete instead of replacing it.",VIOLET],
    ["§4","Proof","Characterization before, regression after. Full requirement-to-evidence traceability.",GREEN],
  ];
  let y=1.5;
  items.forEach((it,i)=>{
    const x = i%2? 5.15:0.5; if(i%2===0 && i>0) y+=1.65; const yy = i<2? 1.5 : 3.15;
    const xx = i%2? 5.15:0.5;
    rrect(s,xx,yy,4.35,1.45,PANEL,BORDER,0.06);
    txt(s,it[0],{x:xx+0.25,y:yy+0.2,w:1,h:0.5,fontFace:SANS,fontSize:24,bold:true,color:it[3]});
    txt(s,it[1],{x:xx+1.1,y:yy+0.22,w:3.1,h:0.4,fontFace:SANS,fontSize:15,bold:true,color:T1});
    txt(s,it[2],{x:xx+1.1,y:yy+0.62,w:3.1,h:0.7,fontFace:SANS,fontSize:10.5,color:T2,valign:"top",lineSpacingMultiple:1.12});
  });
})();

/* ============================ 4 · §1 DIVIDER ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,0.06,ACC);
  txt(s,"§1 · The Brownfield Workflow",{x:0.6,y:0.4,w:9,h:0.3,fontFace:MONO,fontSize:11,color:ACC,charSpacing:1});
  txt(s,"§1",{x:0.6,y:1.7,w:2,h:1,fontFace:SANS,fontSize:40,bold:true,color:T3});
  txt(s,"The Brownfield Workflow",{x:0.6,y:2.5,w:9,h:0.8,fontFace:SANS,fontSize:34,bold:true,color:T1});
  txt(s,[{text:"Understand before you change. ",options:{color:T2}},
         {text:"Characterize before you touch. ",options:{color:ACC}},
         {text:"Prove nothing else broke.",options:{color:T2}}],
     {x:0.62,y:3.45,w:9,h:0.5,fontFace:SANS,fontSize:15});
})();

/* ============================ 5 · THE FIXED ORDER ============================ */
(()=>{ const s=S();
  head(s,"§1 · The Workflow","1 / 5","The fixed order — left to right, no skipping");
  sub(s,"You may loop back, but you never write business logic before the characterization tests are green.");
  const steps=[
    ["Archaeology","know",INDIGO],
    ["Docker baseline","reproduce",BLUE],
    ["Characterization","lock current",ACC],
    ["Impact map","plan",VIOLET],
    ["Narrow change","do",AMBER],
    ["Regression","prove",GREEN],
  ];
  const n=steps.length, x0=0.5, gap=0.18, bw=(9-(n-1)*gap)/n, y=2.0, bh=1.15;
  steps.forEach((st,i)=>{
    const x=x0+i*(bw+gap);
    rrect(s,x,y,bw,bh,PANEL,BORDER,0.06);
    rect(s,x,y,bw,0.06,st[2]);
    txt(s,String(i+1),{x:x+0.1,y:y+0.12,w:bw-0.2,h:0.3,fontFace:MONO,fontSize:9,color:st[2]});
    txt(s,st[0],{x:x+0.08,y:y+0.42,w:bw-0.16,h:0.5,fontFace:SANS,fontSize:10.5,bold:true,color:T1,align:"center",valign:"top",lineSpacingMultiple:0.95});
    txt(s,st[1],{x:x+0.08,y:y+0.86,w:bw-0.16,h:0.25,fontFace:MONO,fontSize:8,color:T2,align:"center"});
    if(i<n-1) txt(s,"→",{x:x+bw-0.02,y:y+0.4,w:gap+0.04,h:0.4,fontFace:SANS,fontSize:13,color:T3,align:"center"});
  });
  mono(s,0.5,3.55,9,1.35,[
    {t:"CLAUDE.md §2  ·  the non-negotiable",c:ACC,b:true},
    {t:'"You may not modify business logic until the current behaviour is captured as a',c:T2},
    {t:' passing, repeatable check.  Docker baseline → characterization → impact map →',c:T2},
    {t:' change → regression."',c:T2},
    {t:"A change you cannot prove was safe is not done.",c:T1,b:true},
  ]);
})();

/* ============================ 6 · FIVE RULES ============================ */
(()=>{ const s=S();
  head(s,"§1 · The Workflow","2 / 5","Five rules that made it safe");
  const rules=[
    ["1","Read before you write.","docs/01, 02, 07 before any code; each phase re-read before it starts.",INDIGO],
    ["2","Characterize before you change.","Lock current behaviour as passing tests (C-01..05) before touching logic.",ACC],
    ["3","Reuse, don't replace.","Approval triggers the existing @SQLDelete soft-delete — not a new delete path.",GREEN],
    ["4","Minimal diffs.","Add new classes/templates. No renames, reformatting, or dependency bumps.",VIOLET],
    ["5","Phase gates.","Stop at each of 7 phases, summarize, wait for human approval before continuing.",AMBER],
  ];
  let y=1.45;
  rules.forEach((r)=>{
    rrect(s,0.5,y,9,0.66,PANEL,BORDER2,0.05);
    txt(s,r[0],{x:0.62,y:y+0.13,w:0.5,h:0.4,fontFace:SANS,fontSize:20,bold:true,color:r[3],align:"center"});
    txt(s,r[1],{x:1.25,y:y+0.09,w:3.4,h:0.5,fontFace:SANS,fontSize:13,bold:true,color:T1,valign:"middle"});
    txt(s,r[2],{x:4.7,y:y+0.09,w:4.7,h:0.5,fontFace:SANS,fontSize:10.5,color:T2,valign:"middle",lineSpacingMultiple:1.0});
    y+=0.78;
  });
})();

/* ============================ 7 · AUDIT LAYER (WIKI) ============================ */
(()=>{ const s=S();
  head(s,"§1 · The Workflow","3 / 5","The audit layer — a living wiki");
  sub(s,"A separate Dev-Wiki agent owns wiki/ and never touches the code it documents. Updated at every phase gate.");
  mono(s,0.5,1.65,4.35,3.4,[
    {t:"wiki/",c:T1,b:true},
    {t:"├ WIKI_SCHEMA.md   how the wiki works",c:T2},
    {t:"├ overview.md      phase tracker",c:T2},
    {t:"├ glossary.md      soft-delete, pending…",c:T2},
    {t:"├ log.md           every ingest + lint",c:T2},
    {t:"├ features/        crud, request, approve",c:T2},
    {t:"├ components/      controllers, service…",c:T2},
    {t:"├ data-models/     asset, request",c:T2},
    {t:"└ decisions/       ADR-001 … ADR-007",c:ACC},
    {t:"",c:T2},
    {t:"31 pages · 7 ADRs · per-phase log",c:T3},
  ]);
  const cards=[
    ["Independent","A separate agent owns the wiki — it documents the code, never edits it.",INDIGO],
    ["Traceable","Every page cites the spec doc, requirement ID, or ticket it came from.",VIOLET],
    ["Verified","Each phase a code-drift lint greps the real source. Drift is surfaced, never overwritten.",GREEN],
  ];
  let y=1.65;
  cards.forEach(c=>{
    rrect(s,5.1,y,4.4,1.05,PANEL,BORDER,0.06);
    rect(s,5.1,y,0.07,1.05,c[2]);
    txt(s,c[0],{x:5.32,y:y+0.13,w:4,h:0.3,fontFace:SANS,fontSize:13,bold:true,color:c[2]});
    txt(s,c[1],{x:5.32,y:y+0.45,w:4.0,h:0.55,fontFace:SANS,fontSize:10.5,color:T2,valign:"top",lineSpacingMultiple:1.1});
    y+=1.18;
  });
})();

/* ============================ 8 · TRACEABILITY CHAIN ============================ */
(()=>{ const s=S();
  head(s,"§1 · The Workflow","4 / 5","Every change is traceable");
  sub(s,"Commit → Phase gate → Requirement / spec ID → ADR + wiki → Test / lint.");
  const chain=[["Commit","191e07b",INDIGO],["Phase","Gate 4",BLUE],["Requirement","FA-05",ACC],["ADR + wiki","ADR-001",VIOLET],["Test","N-03 ✓",GREEN]];
  const n=chain.length,x0=0.5,gap=0.45,bw=(9-(n-1)*gap)/n,y=1.85,bh=0.85;
  chain.forEach((c,i)=>{
    const x=x0+i*(bw+gap);
    rrect(s,x,y,bw,bh,PANEL,BORDER,0.06);
    txt(s,c[0],{x:x+0.05,y:y+0.14,w:bw-0.1,h:0.25,fontFace:MONO,fontSize:8,color:T3,align:"center"});
    txt(s,c[1],{x:x+0.05,y:y+0.42,w:bw-0.1,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:c[2],align:"center"});
    if(i<n-1) txt(s,"→",{x:x+bw,y:y+0.25,w:gap,h:0.35,fontFace:SANS,fontSize:15,color:T3,align:"center"});
  });
  mono(s,0.5,3.05,9,1.85,[
    {t:"wiki/log.md · excerpt",c:T3},
    {t:"## [2026-06-02] ingest | Phase 4 (data & service) — DecommissionService",c:ACC,b:true},
    {t:"   approve() reuses soft-delete (deleteById → @SQLDelete); N-01..N-07 green.",c:T2},
    {t:"## [2026-06-02] lint  | Phase 4 code-drift check",c:ACC,b:true},
    {t:"   entity fields ↔ DecommissionRequest.java — match. service API ↔ code — match.",c:T2},
    {t:"   generated DDL matches entity. Tests: 13 green. Links clean.   NO DRIFT.",c:GREEN,b:true},
  ]);
})();

/* ============================ 9 · §1 NUMBERS / bridge ============================ */
(()=>{ const s=S();
  head(s,"§1 · The Workflow","5 / 5","Before the change — three numbers");
  sub(s,"What 'understand first' actually cost, and bought.");
  stat(s,0.8,1.9,2.6,"5","characterization tests green BEFORE any logic changed",ACC);
  stat(s,4.0,1.9,2.6,"0","structural changes to the Asset entity",GREEN);
  stat(s,7.0,1.9,2.6,"2","ungated delete paths found — both closed",AMBER);
  txt(s,[{text:"Next: ",options:{color:T3}},{text:"§2 · Archaeology",options:{color:INDIGO,bold:true}},
         {text:" — knowing the repo before touching it.",options:{color:T2}}],
     {x:0.5,y:4.7,w:9,h:0.4,fontFace:SANS,fontSize:13});
})();

/* ============================ 10 · §2 DIVIDER ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,0.06,INDIGO);
  txt(s,"§2 · Archaeology",{x:0.6,y:0.4,w:9,h:0.3,fontFace:MONO,fontSize:11,color:INDIGO,charSpacing:1});
  txt(s,"§2",{x:0.6,y:1.7,w:2,h:1,fontFace:SANS,fontSize:40,bold:true,color:T3});
  txt(s,"Archaeology",{x:0.6,y:2.5,w:9,h:0.8,fontFace:SANS,fontSize:34,bold:true,color:T1});
  txt(s,[{text:"Phase 0 — produce a real map of the repo, ",options:{color:T2}},
         {text:"verify the spec against the code,",options:{color:INDIGO}},
         {text:" and surface what you can't answer.",options:{color:T2}}],
     {x:0.62,y:3.45,w:9,h:0.5,fontFace:SANS,fontSize:15});
})();

/* ============================ 11 · PHASE 0 ARTIFACTS ============================ */
(()=>{ const s=S();
  head(s,"§2 · Archaeology","1 / 2","Know it before you touch it",INDIGO);
  sub(s,"Phase 0 produced evidence from the real tree — no Docker, no business code yet.");
  const cards=[
    ["repo-map.md","Every controller, endpoint, entity, repository, template — from the actual tree, not the spec."],
    ["as-is-behaviour.md","Current login / list / add / PATCH / delete behaviour, each verified and tied to a check."],
    ["archaeology-questions.md","The open questions the code can't answer — captured, not guessed."],
  ];
  let y=1.6;
  cards.forEach(c=>{
    rrect(s,0.5,y,9,0.82,PANEL,BORDER2,0.05);
    txt(s,c[0],{x:0.7,y:y+0.13,w:3.0,h:0.5,fontFace:MONO,fontSize:11.5,bold:true,color:INDIGO,valign:"middle"});
    txt(s,c[1],{x:3.7,y:y+0.1,w:5.6,h:0.6,fontFace:SANS,fontSize:11,color:T2,valign:"middle",lineSpacingMultiple:1.05});
    y+=0.97;
  });
  rrect(s,0.5,4.5,9,0.6,PANEL2,BORDER,0.05);
  txt(s,[{text:"Honesty on record:  ",options:{color:AMBER,bold:true}},
    {text:"the original source repo was unreachable, so the baseline was ",options:{color:T2}},
    {text:"reconstructed faithfully from docs/02",options:{color:T1}},
    {text:" — recorded as ADR-007, flagged for reconciliation if the original appears.",options:{color:T2}}],
    {x:0.7,y:4.58,w:8.6,h:0.45,fontFace:SANS,fontSize:10.5,valign:"middle",lineSpacingMultiple:1.05});
})();

/* ============================ 12 · SURFACE DON'T SWALLOW ============================ */
(()=>{ const s=S();
  head(s,"§2 · Archaeology","2 / 2","Surface surprises — don't code around them",INDIGO);
  sub(s,"A finding the spec left open: how many ways can an asset actually be soft-deleted?");
  mono(s,0.5,1.65,9,1.95,[
    {t:"as-is finding · two delete paths",c:INDIGO,b:true},
    {t:"  GET  /assets-ui/delete/{id}   AssetUIController   ← the UI 'Delete' button uses this",c:T2},
    {t:"  DELETE /assets/{id}           AssetController     ← REST path, NOT referenced by any UI/JS",c:T2},
    {t:"",c:T2},
    {t:"@SQLDelete  → UPDATE assets SET is_deleted = true   (both paths trigger this)",c:T3},
    {t:"@SQLRestriction('is_deleted = false')  → soft-deleted rows vanish from every read",c:T3},
  ]);
  rrect(s,0.5,3.8,9,1.2,PANEL2,BORDER,0.06);
  txt(s,"The judgement call",{x:0.7,y:3.93,w:8.6,h:0.3,fontFace:SANS,fontSize:13,bold:true,color:ACC});
  txt(s,[
    {text:"Leaving a second, ungated path to soft-delete would let approval be bypassed. ",options:{color:T2}},
    {text:"Recorded as ADR-004",options:{color:T1,bold:true}},
    {text:" and seeded into the impact map — to be resolved in code, not quietly ignored.",options:{color:T2}},
  ],{x:0.7,y:4.28,w:8.6,h:0.6,fontFace:SANS,fontSize:11.5,valign:"top",lineSpacingMultiple:1.15});
})();

/* ============================ 13 · §3 DIVIDER ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,0.06,VIOLET);
  txt(s,"§3 · The Change",{x:0.6,y:0.4,w:9,h:0.3,fontFace:MONO,fontSize:11,color:VIOLET,charSpacing:1});
  txt(s,"§3",{x:0.6,y:1.7,w:2,h:1,fontFace:SANS,fontSize:40,bold:true,color:T3});
  txt(s,"The Change",{x:0.6,y:2.5,w:9,h:0.8,fontFace:SANS,fontSize:34,bold:true,color:T1});
  txt(s,[{text:"One narrow, well-evidenced change that ",options:{color:T2}},
         {text:"reuses the existing soft-delete",options:{color:VIOLET}},
         {text:" instead of replacing it.",options:{color:T2}}],
     {x:0.62,y:3.45,w:9,h:0.5,fontFace:SANS,fontSize:15});
})();

/* ============================ 14 · BEFORE / AFTER ============================ */
(()=>{ const s=S();
  head(s,"§3 · The Change","1 / 4","The change in one sentence",VIOLET);
  txt(s,[{text:"Clicking ",options:{color:T2}},{text:"Delete",options:{color:T1,bold:true}},
    {text:" used to soft-delete instantly. Now it creates a ",options:{color:T2}},
    {text:"pending request",options:{color:ACC,bold:true}},
    {text:" an approver must approve or reject — with a full audit trail.",options:{color:T2}}],
    {x:0.5,y:1.05,w:9,h:0.5,fontFace:SANS,fontSize:13.5,lineSpacingMultiple:1.1});
  rrect(s,0.5,1.75,4.35,3.0,PANEL,BORDER,0.06); rect(s,0.5,1.75,4.35,0.07,RED);
  txt(s,"BEFORE",{x:0.72,y:1.95,w:4,h:0.3,fontFace:MONO,fontSize:10,color:RED,charSpacing:1});
  txt(s,[
    {text:"Delete → ",options:{color:T2,breakLine:false}},{text:"immediate soft-delete",options:{color:T1,breakLine:true}},
    {text:"Asset vanishes from the dashboard.",options:{color:T2,breakLine:true}},
    {text:"",options:{breakLine:true}},
    {text:"No reason.",options:{color:T3,breakLine:true}},
    {text:"No approver.",options:{color:T3,breakLine:true}},
    {text:"No record of who or why.",options:{color:T3,breakLine:true}},
  ],{x:0.72,y:2.4,w:3.9,h:2.2,fontFace:SANS,fontSize:12.5,valign:"top",lineSpacingMultiple:1.25});

  rrect(s,5.15,1.75,4.35,3.0,PANEL,BORDER,0.06); rect(s,5.15,1.75,4.35,0.07,GREEN);
  txt(s,"AFTER",{x:5.37,y:1.95,w:4,h:0.3,fontFace:MONO,fontSize:10,color:GREEN,charSpacing:1});
  txt(s,[
    {text:"Request Decommission (+reason)",options:{color:T1,breakLine:true,bold:true}},
    {text:"→ PENDING; asset stays active, badge shown",options:{color:T2,breakLine:true}},
    {text:"Approve → reuses soft-delete; APPROVED",options:{color:T2,breakLine:true}},
    {text:"Reject → asset stays active; REJECTED",options:{color:T2,breakLine:true}},
    {text:"Every decision audited: who · when · why ·",options:{color:ACC,breakLine:true}},
    {text:"decider · outcome · comment.",options:{color:ACC,breakLine:true}},
  ],{x:5.37,y:2.4,w:3.95,h:2.2,fontFace:SANS,fontSize:12,valign:"top",lineSpacingMultiple:1.25});
})();

/* ============================ 15 · IMPACT MAP / MINIMAL DIFF ============================ */
(()=>{ const s=S();
  head(s,"§3 · The Change","2 / 4","Impact map — minimal diff, planned first",VIOLET);
  sub(s,"Prefer adding new classes over editing many. All logic in one new service.");
  rrect(s,0.5,1.6,4.35,2.5,PANEL,BORDER,0.06);
  txt(s,"NEW (6)",{x:0.72,y:1.74,w:4,h:0.3,fontFace:MONO,fontSize:10,color:GREEN});
  txt(s,[
    {text:"DecommissionRequest  entity",options:{breakLine:true,color:T1}},
    {text:"DecommissionStatus  enum",options:{breakLine:true,color:T1}},
    {text:"DecommissionRequestRepository",options:{breakLine:true,color:T1}},
    {text:"DecommissionService  (all rules)",options:{breakLine:true,color:T1}},
    {text:"DecommissionUIController",options:{breakLine:true,color:T1}},
    {text:"decommissions.html  (approver view)",options:{breakLine:true,color:T1}},
  ],{x:0.72,y:2.08,w:3.95,h:1.9,fontFace:MONO,fontSize:10.5,valign:"top",lineSpacingMultiple:1.32});

  rrect(s,5.15,1.6,4.35,2.5,PANEL,BORDER,0.06);
  txt(s,"EDITED (3)",{x:5.37,y:1.74,w:4,h:0.3,fontFace:MONO,fontSize:10,color:AMBER});
  txt(s,[
    {text:"assets.html",options:{color:T1}},{text:"  Delete → Request + badge",options:{color:T3,breakLine:true}},
    {text:"AssetUIController",options:{color:T1}},{text:"  pending ids; retire route",options:{color:T3,breakLine:true}},
    {text:"AssetController",options:{color:T1}},{text:"  REST DELETE → 405",options:{color:T3,breakLine:true}},
    {text:"",options:{breakLine:true}},
    {text:"Untouched: Asset entity, PATCH edit,",options:{color:T2,breakLine:true}},
    {text:"security, dependency versions.",options:{color:T2,breakLine:true}},
  ],{x:5.37,y:2.08,w:3.95,h:1.9,fontFace:MONO,fontSize:10.5,valign:"top",lineSpacingMultiple:1.3});

  rrect(s,0.5,4.25,9,0.85,PANEL2,BORDER,0.05);
  txt(s,"Three decisions, recorded:",{x:0.7,y:4.34,w:9,h:0.25,fontFace:SANS,fontSize:10.5,bold:true,color:ACC});
  txt(s,[
    {text:"assetId as plain Long",options:{color:T1}},{text:" (ADR-002, history survives soft-delete)   ·   ",options:{color:T3}},
    {text:"pending derived",options:{color:T1}},{text:" from a PENDING request (ADR-003)   ·   ",options:{color:T3}},
    {text:"REST DELETE neutralized",options:{color:T1}},{text:" (ADR-004)",options:{color:T3}},
  ],{x:0.7,y:4.62,w:8.7,h:0.4,fontFace:SANS,fontSize:10.5,valign:"top",lineSpacingMultiple:1.1});
})();

/* ============================ 16 · REUSE NOT REPLACE ============================ */
(()=>{ const s=S();
  head(s,"§3 · The Change","3 / 4","Reuse, don't replace — the one constraint",VIOLET);
  sub(s,"Approval ends up calling the existing soft-delete. No new UPDATE; no physical delete.");
  mono(s,0.5,1.65,9,1.95,[
    {t:"DecommissionService.approve(requestId, approver, comment)",c:VIOLET,b:true},
    {t:"  req.setStatus(APPROVED);  req.setDecidedBy(approver);  req.setDecidedAt(now);",c:T2},
    {t:"  requestRepository.save(req);",c:T2},
    {t:"  assetRepository.deleteById(req.getAssetId());   // ← reuses the existing mechanism",c:GREEN,b:true},
    {t:"",c:T2},
    {t:"@SQLDelete(\"UPDATE assets SET is_deleted = true WHERE id = ?\")   // entity-level, untouched",c:T3},
  ]);
  rrect(s,0.5,3.8,9,1.2,PANEL2,BORDER,0.06); rect(s,0.5,3.8,0.07,1.2,GREEN);
  txt(s,"ADR-001 · the most important constraint",{x:0.72,y:3.93,w:8.6,h:0.3,fontFace:SANS,fontSize:13,bold:true,color:GREEN});
  txt(s,[{text:"'Decommission' ",options:{color:T2}},{text:"is",options:{color:T1,italic:true,bold:true}},
    {text:" the existing soft-delete — now gated behind approval. The characterization tests that locked that behaviour (C-01/C-02) keep covering it after the change.",options:{color:T2}}],
    {x:0.72,y:4.28,w:8.6,h:0.65,fontFace:SANS,fontSize:11.5,valign:"top",lineSpacingMultiple:1.15});
})();

/* ============================ 17 · LOOSE ENDS / RESILIENCE ============================ */
(()=>{ const s=S();
  head(s,"§3 · The Change","4 / 4","Loose ends, named and closed",VIOLET);
  sub(s,"Brownfield judgement and environment surprises — handled without touching the deliverable.");
  mono(s,0.5,1.6,9,2.0,[
    {t:"# the second delete path  (ADR-004)",c:VIOLET,b:true},
    {t:"AssetController DELETE /assets/{id}  →  405 Method Not Allowed  (no soft-delete)",c:T2},
    {t:"UI GET /assets-ui/delete/{id}        →  removed (404)",c:T2},
    {t:"   ⇒ after the change, NO ungated path to soft-delete remains.",c:GREEN,b:true},
    {t:"",c:T2},
    {t:"# environment surprises  (sandbox only — committed files unchanged)",c:AMBER,b:true},
    {t:"TLS-intercepting proxy broke in-container Maven  →  trusted host CA in a tagged base image",c:T2},
    {t:"Docker Engine 29 rejected docker-java API 1.32  →  pinned api.version=1.44 (tests only)",c:T2},
  ]);
  txt(s,[{text:"Surfaced, diagnosed, and fixed in the open — ",options:{color:T2}},
    {text:"the deliverable Dockerfile and compose files were never compromised.",options:{color:T1,bold:true}}],
    {x:0.5,y:3.8,w:9,h:0.5,fontFace:SANS,fontSize:12,italic:true,lineSpacingMultiple:1.1});
})();

/* ============================ 18 · §4 DIVIDER ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,0.06,GREEN);
  txt(s,"§4 · Proof",{x:0.6,y:0.4,w:9,h:0.3,fontFace:MONO,fontSize:11,color:GREEN,charSpacing:1});
  txt(s,"§4",{x:0.6,y:1.7,w:2,h:1,fontFace:SANS,fontSize:40,bold:true,color:T3});
  txt(s,"Proof",{x:0.6,y:2.5,w:9,h:0.8,fontFace:SANS,fontSize:34,bold:true,color:T1});
  txt(s,[{text:"Characterization before, regression after, and ",options:{color:T2}},
         {text:"every requirement mapped to evidence.",options:{color:GREEN}}],
     {x:0.62,y:3.45,w:9,h:0.5,fontFace:SANS,fontSize:15});
})();

/* ============================ 19 · SAFETY NET ============================ */
(()=>{ const s=S();
  head(s,"§4 · Proof","1 / 4","The safety net — tests as the contract",GREEN);
  sub(s,"Characterization (C) passed BEFORE the change; new behaviour (N) after. Real Postgres, real soft-delete.");
  rrect(s,0.5,1.65,4.35,2.6,PANEL,BORDER,0.06); rect(s,0.5,1.65,4.35,0.07,ACC);
  txt(s,"CHARACTERIZATION · before",{x:0.72,y:1.83,w:4,h:0.3,fontFace:MONO,fontSize:9.5,color:ACC});
  txt(s,[
    {text:"C-01  soft-delete hides, not removes",options:{color:T2,breakLine:true}},
    {text:"C-02  @SQLRestriction filters reads",options:{color:T2,breakLine:true}},
    {text:"C-03  PATCH partial update intact",options:{color:T2,breakLine:true}},
    {text:"C-04  create + list",options:{color:T2,breakLine:true}},
    {text:"C-05  auth gate",options:{color:T2,breakLine:true}},
    {text:"→ green on UNCHANGED code first",options:{color:ACC,breakLine:true,bold:true}},
  ],{x:0.72,y:2.2,w:3.95,h:2.0,fontFace:MONO,fontSize:10,valign:"top",lineSpacingMultiple:1.32});

  rrect(s,5.15,1.65,4.35,2.6,PANEL,BORDER,0.06); rect(s,5.15,1.65,4.35,0.07,GREEN);
  txt(s,"NEW BEHAVIOUR · after",{x:5.37,y:1.83,w:4,h:0.3,fontFace:MONO,fontSize:9.5,color:GREEN});
  txt(s,[
    {text:"N-01..02  request / reason required",options:{color:T2,breakLine:true}},
    {text:"N-03..04  approve / reject",options:{color:T2,breakLine:true}},
    {text:"N-05..06  duplicate / soft-deleted guards",options:{color:T2,breakLine:true}},
    {text:"N-07     audit + history (FA-09)",options:{color:T2,breakLine:true}},
    {text:"N-08     dashboard pending badge",options:{color:T2,breakLine:true}},
    {text:"+ REST-405 · history-of-deleted",options:{color:GREEN,breakLine:true,bold:true}},
  ],{x:5.37,y:2.2,w:3.95,h:2.0,fontFace:MONO,fontSize:10,valign:"top",lineSpacingMultiple:1.32});

  rrect(s,0.5,4.45,9,0.62,PANEL2,BORDER,0.05);
  txt(s,[{text:"19 tests · 0 failures · 0 errors",options:{color:T1,bold:true}},
    {text:"   —   Testcontainers PostgreSQL for true @SQLDelete fidelity (not H2). Characterization never went red.",options:{color:T2}}],
    {x:0.7,y:4.55,w:8.6,h:0.45,fontFace:SANS,fontSize:11,valign:"middle"});
})();

/* ============================ 20 · REGRESSION T-TABLE ============================ */
(()=>{ const s=S();
  head(s,"§4 · Proof","2 / 4","Live regression in Docker — T-01..T-09",GREEN);
  sub(s,"Run against the committed `docker compose up --build`. All pass.");
  const rows=[
    ["T-01","up --build → app+db start (db-healthy gate)"],
    ["T-02","login admin/admin123"],
    ["T-03","create asset → appears"],
    ["T-04","PATCH partial update intact"],
    ["T-05","request → PENDING, NOT soft-deleted"],
    ["T-06","reject → REJECTED, asset active"],
    ["T-07","approve → APPROVED, soft-deleted"],
    ["T-08","duplicate pending → blocked"],
    ["T-09","down -v → DB cleared"],
  ];
  let y=1.6; const rh=0.34;
  rows.forEach((r,i)=>{
    const yy=y+i*rh;
    if(i%2===0) rrect(s,0.5,yy,7.0,rh,PANEL,null,0.0);
    txt(s,r[0],{x:0.62,y:yy,w:0.8,h:rh,fontFace:MONO,fontSize:10,color:ACC,valign:"middle"});
    txt(s,r[1],{x:1.5,y:yy,w:5.6,h:rh,fontFace:SANS,fontSize:10.5,color:T2,valign:"middle"});
    txt(s,"✓",{x:7.0,y:yy,w:0.4,h:rh,fontFace:SANS,fontSize:11,color:GREEN,bold:true,valign:"middle",align:"center"});
  });
  rrect(s,7.75,1.6,1.75,3.06,PANEL2,BORDER,0.06);
  txt(s,"9 / 9",{x:7.75,y:2.4,w:1.75,h:0.6,fontFace:SANS,fontSize:30,bold:true,color:GREEN,align:"center"});
  txt(s,"T-checks pass",{x:7.75,y:3.0,w:1.75,h:0.3,fontFace:MONO,fontSize:9,color:T2,align:"center"});
  txt(s,"before/after demo recorded",{x:7.8,y:3.35,w:1.65,h:0.7,fontFace:SANS,fontSize:9,color:T3,align:"center",valign:"top"});
})();

/* ============================ 21 · RUNNING APP (screenshots) ============================ */
(()=>{ const s=S();
  head(s,"§4 · Proof","3 / 4","Evidence you can see — the running app",GREEN);
  sub(s,"Captured from the live Dockerized app (headless Chromium).");
  const dash="/home/user/Asset-Tracking-Dockerize/artifacts/screenshots/02-dashboard-pending-badge.png";
  const appr="/home/user/Asset-Tracking-Dockerize/artifacts/screenshots/03-approver-view-and-history.png";
  rrect(s,0.5,1.6,4.5,3.1,PANEL,BORDER,0.05);
  s.addImage({path:dash,x:0.62,y:1.72,w:4.26,h:2.62});
  txt(s,"Dashboard — pending badge + Request Decommission",{x:0.62,y:4.36,w:4.3,h:0.3,fontFace:MONO,fontSize:8.5,color:T2});
  rrect(s,5.15,1.6,4.35,3.1,PANEL,BORDER,0.05);
  s.addImage({path:appr,x:5.27,y:1.72,w:4.11,h:2.62});
  txt(s,"Approver view — approve/reject + decision history (incl. soft-deleted)",{x:5.27,y:4.36,w:4.2,h:0.3,fontFace:MONO,fontSize:8.5,color:T2});
})();

/* ============================ 22 · RECEIPTS ============================ */
(()=>{ const s=S();
  head(s,"§4 · Proof","4 / 4","Receipts",GREEN);
  sub(s,"Locked at the final gate.");
  const cells=[
    ["7","phase gates · all approved",ACC],
    ["19","tests · 0 fail / 0 error",GREEN],
    ["9/9","success criteria (G-1..9) met",GREEN],
    ["9/9","regression checks (T-01..09)",GREEN],
    ["0","characterization regressions",GREEN],
    ["1","new entity · Asset unchanged",INDIGO],
    ["0","ungated soft-delete paths left",AMBER],
    ["7","artifacts + a 31-page wiki",VIOLET],
  ];
  const cols=4, cw=2.2, x0=0.55, y0=1.85, ry=1.35;
  cells.forEach((c,i)=>{
    const x=x0+(i%cols)*cw, y=y0+Math.floor(i/cols)*ry;
    txt(s,c[0],{x,y,w:cw-0.1,h:0.55,fontFace:SANS,fontSize:28,bold:true,color:c[2]});
    txt(s,c[1],{x,y:y+0.55,w:cw-0.15,h:0.55,fontFace:MONO,fontSize:8.5,color:T2,valign:"top",lineSpacingMultiple:1.05});
  });
  txt(s,[{text:"Every requirement → evidence: ",options:{color:T2}},
    {text:"artifacts/requirements-traceability.md",options:{color:T1,bold:true}}],
    {x:0.55,y:4.75,w:9,h:0.35,fontFace:SANS,fontSize:11,align:"center"});
})();

/* ============================ 23 · BROWNFIELD ⇄ GREENFIELD ============================ */
(()=>{ const s=S();
  head(s,"CLOSING","","Same engine, adapted for brownfield");
  sub(s,"What carried over from the greenfield workflow — and what the brownfield risk demanded.");
  const rows=[
    ["Spec pack precedes code","✓ carried over","Plus: verify the spec against the real code (it wins on 'today')."],
    ["Living wiki + ADRs + lint","✓ carried over","Same independent agent; code-drift lint each phase gate."],
    ["Tests as the contract","adapted","Characterization FIRST — lock current behaviour before changing."],
    ["Phase gates / approval","adapted","7 gates; 'no logic before characterization is green'."],
    ["Smallest change wins","intensified","Reuse over rebuild; minimal diffs; one new service."],
    ["Traceability to evidence","✓ carried over","Requirement → code → test → live → doc, all mapped."],
  ];
  let y=1.55; const rh=0.55;
  rows.forEach((r,i)=>{
    const yy=y+i*rh;
    if(i%2===0) rrect(s,0.5,yy,9,rh,PANEL,null,0.0);
    txt(s,r[0],{x:0.65,y:yy,w:3.0,h:rh,fontFace:SANS,fontSize:11,bold:true,color:T1,valign:"middle"});
    const tag=r[1]==="✓ carried over"?GREEN:(r[1]==="intensified"?VIOLET:ACC);
    txt(s,r[1],{x:3.7,y:yy,w:1.6,h:rh,fontFace:MONO,fontSize:9,color:tag,valign:"middle"});
    txt(s,r[2],{x:5.35,y:yy,w:4.05,h:rh,fontFace:SANS,fontSize:10,color:T2,valign:"middle",lineSpacingMultiple:1.0});
  });
})();

/* ============================ 24 · WHAT YOU CAN REACH FOR ============================ */
(()=>{ const s=S();
  head(s,"CLOSING","","What this unlocks for brownfield work");
  sub(s,"Where the same approach pays off on code you already own.");
  const items=[
    ["Legacy modernization","Wrap an old service in Docker + characterization tests, then change it with a net.",INDIGO],
    ["Safe refactors","Lock behaviour as tests first; let drift checks catch anything you didn't intend.",ACC],
    ["Risky feature changes","Plan with an impact map; reuse existing mechanisms instead of rebuilding.",VIOLET],
    ["Audit & compliance","A living wiki + requirement-to-evidence matrix makes 'prove it' a one-pager.",GREEN],
  ];
  let y=1.55;
  items.forEach((it,i)=>{
    const xx=i%2?5.15:0.5, yy=1.55+Math.floor(i/2)*1.6;
    rrect(s,xx,yy,4.35,1.4,PANEL,BORDER,0.06); rect(s,xx,yy,0.07,1.4,it[2]);
    txt(s,it[0],{x:xx+0.25,y:yy+0.18,w:4,h:0.35,fontFace:SANS,fontSize:14,bold:true,color:it[2]});
    txt(s,it[1],{x:xx+0.25,y:yy+0.6,w:3.95,h:0.7,fontFace:SANS,fontSize:11,color:T2,valign:"top",lineSpacingMultiple:1.15});
  });
  txt(s,"Stop hand-editing legacy code. Start directing a safe, evidenced change.",
    {x:0.5,y:4.95,w:9,h:0.4,fontFace:SANS,fontSize:12,italic:true,color:T3,align:"center"});
})();

/* ============================ 25 · CLOSING ============================ */
(()=>{ const s=S();
  rect(s,0,0,10,0.06,ACC);
  txt(s,"Spec on top.",{x:0.6,y:1.55,w:9,h:0.7,fontFace:SANS,fontSize:34,bold:true,color:T1});
  txt(s,"Characterization underneath.",{x:0.6,y:2.25,w:9,h:0.7,fontFace:SANS,fontSize:34,bold:true,color:ACC});
  txt(s,"A narrow change in between.",{x:0.6,y:2.95,w:9,h:0.7,fontFace:SANS,fontSize:34,bold:true,color:T1});
  mono(s,0.6,4.0,8.8,1.1,[
    {t:"$ git clone -b claude/jolly-albattani-ZVz7K  …/Asset-Tracking-Dockerize.git",c:T2},
    {t:"$ mvn test                 # 19 green · Testcontainers Postgres",c:T2},
    {t:"$ docker compose up --build # http://localhost:8080  (admin / admin123)",c:ACC,b:true},
  ]);
})();

/* ============================ 26 · APPENDIX traceability ============================ */
(()=>{ const s=S();
  head(s,"APPENDIX · artifacts/requirements-traceability.md","","Requirement → evidence, every family ✓",GREEN);
  sub(s,"The one page a reviewer reads to confirm done. All IDs mapped to code, test, live check, and doc.");
  const fams=[
    ["G-1..G-9","Success criteria","live T-01..09 · N-tests · artifacts"],
    ["EB-01..06","Preserved behaviour","C-03/04/05 · live · untouched code"],
    ["FA-01..09","Functional reqs","N-01..08 · DecommissionService"],
    ["V-01..06","Validation rules","N-02/04/05/06 · guards"],
    ["UI-01..06","UI requirements","assets.html · decommissions.html · N-08"],
    ["DOCK-01..06","Dockerization","Dockerfile · compose · live T-01/T-09"],
  ];
  let y=1.6; const rh=0.5;
  fams.forEach((f,i)=>{
    const yy=y+i*rh;
    if(i%2===0) rrect(s,0.5,yy,9,rh,PANEL,null,0);
    txt(s,f[0],{x:0.65,y:yy,w:1.5,h:rh,fontFace:MONO,fontSize:10.5,bold:true,color:ACC,valign:"middle"});
    txt(s,f[1],{x:2.25,y:yy,w:2.7,h:rh,fontFace:SANS,fontSize:11,color:T1,valign:"middle"});
    txt(s,f[2],{x:5.0,y:yy,w:3.9,h:rh,fontFace:MONO,fontSize:9,color:T2,valign:"middle"});
    txt(s,"✓",{x:8.95,y:yy,w:0.4,h:rh,fontFace:SANS,fontSize:12,bold:true,color:GREEN,valign:"middle"});
  });
})();

const out = "/tmp/Brownfield-Run-Asset-Decommission.pptx";
p.writeFile({ fileName: out }).then(()=>console.log("WROTE", out)).catch(e=>{console.error(e);process.exit(1);});
