/* ============================================================
   ROOT & BLOOM — AI FEATURES
   ai-features.js  |  Loaded after state-requirements.js
   Contains: callClaude, worksheet engine, unit builder,
             kid quiz, field study modal
   ============================================================ */

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */
function goalSummary(family) {
  const all = [...(GOALS||[]),...(family.customGoals||[])];
  return (family.goals||[]).map(id=>{ const g=all.find(x=>x.id===id); return g?g.label:""; }).filter(Boolean).join(", ")||"General homeschool education";
}

function curriculumContext(family) {
  const brands = (family.curriculumBrands||[]).map(id=>{
    const b = (CURRICULUM_BRANDS||[]).find(x=>x.id===id);
    return b ? b.label : "";
  }).filter(Boolean);
  const phil = (family.learningPhilosophies||[]).map(id=>{
    const p = (LEARNING_PHILOSOPHIES||[]).find(x=>x.id===id);
    return p ? p.label : "";
  }).filter(Boolean);
  const parts = [];
  if(brands.length) parts.push("Curriculum: "+brands.join(", "));
  if(phil.length)   parts.push("Approach: "+phil.join(", "));
  return parts.join(" | ") || "Eclectic homeschool";
}

/* ----------------------------------------------------------
   CORE AI CALL
   ---------------------------------------------------------- */
async function callClaude(prompt, imageBase64, imageMime) {
  const runtimeKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  const runtimeLimit = (()=>{ try{ return parseInt(localStorage.getItem("rootbloom_ailimit")||"50"); }catch(e){return 50;} })();
  if(!runtimeKey) throw new Error("NO_KEY");
  const { allowed, monthKey } = checkAILimit(runtimeLimit);
  if(!allowed) throw new Error("RATE_LIMIT");

  // Build content — support optional image
  let userContent;
  if(imageBase64 && imageMime) {
    userContent = [
      { type:"image", source:{ type:"base64", media_type:imageMime, data:imageBase64 } },
      { type:"text", text: prompt }
    ];
  } else {
    userContent = prompt;
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":runtimeKey,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true"
    },
    body:JSON.stringify({
      model:"claude-sonnet-4-6",
      max_tokens:4000,
      messages:[{role:"user", content:userContent}],
    }),
  });
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  incrementAILimit(monthKey);
  return data.content?.map(b=>b.text||"").join("") || "";
}

/* ----------------------------------------------------------
   WORKSHEET PRINT ENGINE
   Generates a full printable HTML document
   ---------------------------------------------------------- */
// buildWorksheetHTML moved to plain <script> in index.html (avoids Babel JSX parse issues)


function buildWorksheetPrompt(wsType, topic, child, family, extraContext, difficulty) {
  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";
  const goals    = goalSummary(family);
  const curriculum = curriculumContext(family);
  const schoolName = family?.schoolName || (family?.familyName ? family.familyName + " Academy" : "Ramos Academy");
  const diff = difficulty || "standard";

  const gradeGroup = gradeNum <= 2 ? "early" : gradeNum <= 5 ? "mid" : gradeNum <= 8 ? "upper" : "high";

  const gradeInstructions = {
    early: `K-2nd grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). Use VERY simple words, short sentences, large clear text. Favor word banks, matching, tracing, fill-in-the-blank. Max 6 main items. Warm-up should be a simple one-question oral starter.`,
    mid:   `3rd-5th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). Mix of multiple choice, fill-in-the-blank, and short answer. Clear engaging language. 8-10 main items. Some items should connect to real life.`,
    upper: `6th-8th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). Include analysis, application and comparison questions. Mix of formats. 10-12 main items. At least 2 items require multi-sentence responses.`,
    high:  `9th-12th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). College-prep level. Critical thinking, analysis and synthesis. Mix of objective and written response. 10-15 main items. Extension should be essay-level depth.`,
  }[gradeGroup];

  const diffInstructions = {
    easy:      "DIFFICULTY: Easy / Scaffolded. Use simpler vocabulary, provide more context clues, shorter questions, and more fill-in-the-blank over open-ended. Great for review or struggling learners.",
    standard:  "DIFFICULTY: Standard / On-grade. Typical grade-level challenge. Mix of question types. Some items should stretch the student slightly.",
    challenge: "DIFFICULTY: Challenge / Enrichment. Higher-order thinking, more inference required, less scaffolding, longer written responses expected. For advanced or fast-finishing students.",
  }[diff];

  const typeInstructions = {
    "Mixed":            "Create a MIXED worksheet with a genuine variety of question types across sections: fill-in-the-blank, multiple choice (4 options), short answer, AND one vocabulary or matching section. This is the most engaging format.",
    "Fill-in-the-Blank":"Create fill-in-the-blank questions with clear blanks (___). ALWAYS include a word bank for K-5. For 6-12, some items may not have a word bank to increase challenge.",
    "Multiple Choice":  "Create multiple choice questions with exactly 4 options each (A, B, C, D). One clearly correct answer. Make distractors plausible but clearly wrong on reflection.",
    "Short Answer":     "Create short answer questions requiring 2-4 sentence responses. Questions should be open but specific enough to guide a good answer. Include a model answer length hint.",
    "Vocabulary":       "Create a vocabulary-focused worksheet: matching definitions, fill-in-blank sentences using context, a word-in-use writing prompt, and etymology or word-part analysis for upper grades.",
    "Reading Comprehension": "Create a reading comprehension worksheet: include a 100-200 word original passage on the topic, then recall, inference, vocabulary-in-context, and personal response questions.",
    "Open-Ended Discussion": "Create thought-provoking discussion and reflection prompts. Each question should invite genuine thinking. Include some 'agree/disagree and explain' items and one creative extension.",
    "Copywork":         "Create beautiful, meaningful sentences or passages for the student to copy. Choose sentences that match the topic and are worth memorizing. Include 4-6 items.",
    "Narration":        "Create open-ended narration prompts asking the student to explain, describe, or retell in their own words. 4-5 prompts with generous answer space.",
    "Spelling":         "Create 8-10 spelling words related to the topic. For each word: show the word, a definition, and a fill-in sentence. Include a word bank.",
    "Math Practice":    "Create math problems appropriate for the grade level. Include one worked example for the first problem type. Mix difficulty within the set. Include 'show your work' space.",
    "Science":          "Create a science worksheet with: key concept recall, diagram labeling (described in text), an observation/experiment record section, and analysis questions.",
    "History":          "Create a history worksheet with: timeline ordering, cause-and-effect questions, a primary source analysis prompt, and a reflection question connecting to today.",
    "Nature Journal":   "Create a nature journal worksheet with observation prompts, sketch space (described as a box), identification questions, and a 'what I wonder' reflection section.",
    "Custom Worksheet": "Create a comprehensive, well-structured worksheet perfectly tailored to the topic and grade level. Use the best mix of question types for this specific topic.",
    "Coloring Page":    "Create a coloring-page-style worksheet for K-6. Include 2-3 drawing scenes (write clear instructions like 'Draw a butterfly on a flower and color it'), 1-2 labeling diagrams (describe what to draw and label), and 1 creative drawing prompt. Set each drawing item type to 'coloring'. Keep it playful, simple, and directly tied to the topic.",
  }[wsType] || "Create a well-structured, engaging worksheet perfectly suited to the topic and grade level.";

  const goalInfluence = goals !== "General homeschool education"
    ? `\nFamily learning goals: ${goals}. Weave these naturally into examples and scenarios where it fits.`
    : "";

  return `You are an expert homeschool curriculum designer creating a professional, print-ready worksheet.\n\nSTUDENT: ${name}, ${grade} grade\nSCHOOL: ${schoolName}\nWORKSHEET TYPE: ${wsType}\nTOPIC: ${topic}\nCURRICULUM CONTEXT: ${curriculum}${goalInfluence}\n${extraContext ? "ADDITIONAL CONTEXT (what was actually taught): " + extraContext : ""}\n\nGRADE REQUIREMENTS: ${gradeInstructions}\n${diffInstructions}\nTYPE REQUIREMENTS: ${typeInstructions}\n\nSTRUCTURE: Your worksheet MUST include all four of these sections:\n1. learningObjective: one clear, specific sentence starting with "Students will be able to..."\n2. warmUp: one engaging starter question or quick activity (1-2 sentences, answered verbally or in 1 line)\n3. sections[]: the main worksheet content (see type requirements above)\n4. extension: one "Going Deeper" challenge for fast finishers (more open-ended, higher thinking)\n\nFORMATTING RULES:\n- Every fill-in item needs a clear blank marker (___)\n- Multiple choice items need exactly 4 options (A, B, C, D) with one correct answer\n- For grades K-2, ALWAYS include a word bank for fill-in items\n- For matching items, include leftCol (terms) and rightCol (definitions) arrays of equal length\n- Make items directly test or reinforce the SPECIFIC topic covered\n- Items should feel like a real teacher made them — specific, purposeful, interesting\n\nRespond with ONLY valid JSON (no markdown, no backticks):\n{\n  "title": "engaging worksheet title (max 8 words)",\n  "subject": "subject area",\n  "grade": "${grade}",\n  "schoolName": "${schoolName}",\n  "learningObjective": "Students will be able to ...",\n  "warmUp": "starter question or activity for the student",\n  "instructions": "one clear, friendly instruction sentence for the main section",\n  "wordBank": ["word1", "word2"],\n  "sections": [\n    {\n      "title": "section heading (e.g. Part A: Recall, Part B: Vocabulary)",\n      "items": [\n        {\n          "type": "fillin|mc|copywork|shortanswer|matching|tracing",\n          "content": "the question or prompt text",\n          "options": ["A option", "B option", "C option", "D option"],\n          "answer": "correct answer",\n          "lines": 2,\n          "leftCol": [],\n          "rightCol": []\n        }\n      ]\n    }\n  ],\n  "extension": "Going Deeper challenge for fast finishers",\n  "bonusChallenge": "one creative bonus challenge"\n}`;
}

/* ----------------------------------------------------------
   AI WORKSHEET MODAL — Chalkie-level rebuild
   ---------------------------------------------------------- */
function AIWorksheetModal({ pal, family, activeChild, wsType, onClose, portfolioEntries=[] }) {
  const [phase,      setPhase]     = useState("config"); // config|loading|result
  const [topic,      setTopic]     = useState("");
  const [lessonNote, setLessonNote]= useState("");
  const [wsTypeSel,  setWsTypeSel] = useState(
    wsType && wsType !== "custom" ? wsType.label || wsType.id || "Mixed" : "Mixed"
  );
  const [difficulty, setDifficulty]= useState("standard");
  const [result,     setResult]    = useState(null);
  const [error,      setError]     = useState(null);

  const child    = activeChild;
  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";

  // Auto-pull today's notes for this child
  const childIdx = family.children.findIndex(c=>c.id===child?.id);
  const todayStr = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const todayNotes = portfolioEntries
    .filter(e=>e.childIdx===childIdx && e.date===todayStr && e.note && e.note.trim())
    .map(e=>e.subj+(e.note?" — "+e.note.replace("AI Summary:","").trim():""))
    .join(". ");

  React.useEffect(()=>{
    if(todayNotes && !lessonNote) setLessonNote(todayNotes);
  },[todayNotes]);

  const WS_TYPE_OPTIONS = [
    {id:"Mixed",             icon:"\u2728", label:"Mixed",             desc:"Best variety — MC, fill-in, short answer"},
    {id:"Multiple Choice",   icon:"\uD83D\uDD18", label:"Multiple Choice",   desc:"4-option questions throughout"},
    {id:"Fill-in-the-Blank", icon:"\u270F\uFE0F", label:"Fill-in-the-Blank", desc:"Blanks with optional word bank"},
    {id:"Short Answer",      icon:"\uD83D\uDCDD", label:"Short Answer",      desc:"Written response questions"},
    {id:"Vocabulary",        icon:"\uD83D\uDCD6", label:"Vocabulary",        desc:"Matching, definitions, usage"},
    {id:"Reading Comprehension",icon:"\uD83D\uDCDA",label:"Reading Comprehension",desc:"Passage + comprehension questions"},
    {id:"Open-Ended Discussion",icon:"\uD83D\uDCAC",label:"Discussion",          desc:"Reflection and discussion prompts"},
    {id:"Copywork",          icon:"\u270D\uFE0F", label:"Copywork",          desc:"Beautiful sentences to copy"},
    {id:"Math Practice",     icon:"\uD83D\uDCB0", label:"Math Practice",     desc:"Problems with worked examples"},
    {id:"Science",           icon:"\uD83E\uDDEA", label:"Science",           desc:"Concepts, diagrams, analysis"},
    {id:"History",           icon:"\uD83D\uDDFA\uFE0F", label:"History",      desc:"Timeline, causes, sources"},
    {id:"Spelling",          icon:"\uD83D\uDD24", label:"Spelling",          desc:"Words, definitions, fill-in"},
    {id:"Narration",         icon:"\uD83D\uDDE3\uFE0F", label:"Narration",   desc:"Retell and explain prompts"},
    {id:"Nature Journal",    icon:"\uD83C\uDF3F", label:"Nature Journal",    desc:"Observation and wonder prompts"},
    {id:"Custom Worksheet",  icon:"\uD83D\uDCCB", label:"Custom",            desc:"AI picks the best format"},
    {id:"Coloring Page",     icon:"\uD83C\uDFA8", label:"Coloring Page",     desc:"Drawing prompts + scenes (K-6)"},
  ];

  const DIFFICULTY_OPTIONS = [
    {id:"easy",      label:"Easy",      icon:"\uD83C\uDF31", desc:"Scaffolded, simpler vocab"},
    {id:"standard",  label:"Standard",  icon:"\u2B50",        desc:"On-grade challenge"},
    {id:"challenge", label:"Challenge", icon:"\uD83D\uDE80", desc:"Enrichment, higher thinking"},
  ];

  const TOPIC_PLACEHOLDERS = {
    "Mixed":               "e.g. The American Revolution, plant cells, fractions",
    "Multiple Choice":     "e.g. The water cycle, Chapter 5 comprehension",
    "Fill-in-the-Blank":   "e.g. Parts of a plant, multiplication facts",
    "Short Answer":        "e.g. Causes of WWI, character analysis",
    "Vocabulary":          "e.g. Greek and Latin roots: bio, geo, graph",
    "Reading Comprehension":"e.g. Animal adaptations, the Civil Rights movement",
    "Open-Ended Discussion":"e.g. Should we explore Mars? What makes a hero?",
    "Copywork":            "e.g. Quotes about courage, scripture passage",
    "Math Practice":       "e.g. Adding fractions with unlike denominators",
    "Science":             "e.g. Photosynthesis, the water cycle, ecosystems",
    "History":             "e.g. Ancient Rome, the American Revolution",
    "Spelling":            "e.g. -tion suffix words, vowel teams Week 12",
    "Narration":           "e.g. What we read in Charlotte\u2019s Web today",
    "Nature Journal":      "e.g. Backyard insects, seasonal changes, oak trees",
    "Custom Worksheet":    "e.g. CH and SH blending sounds for 1st grade",
    "Coloring Page":       "e.g. Parts of a plant, life cycle of a butterfly, farm animals",
  };

  const generate = async () => {
    if(!topic.trim()) return;
    setPhase("loading"); setError(null); setResult(null);
    try {
      const prompt = buildWorksheetPrompt(wsTypeSel, topic, child, family, lessonNote.trim()||null, difficulty);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPhase("result");
    } catch(e) {
      setError(e.message==="NO_KEY"
        ? "Add your Anthropic API key in Settings \u2192 AI to generate worksheets."
        : "Couldn\u2019t generate right now. Try a simpler topic or check your connection.");
      setPhase("config");
    }
  };

  const openPrint = () => {
    if(!result) return;
    const html = buildWorksheetHTML(result, child, grade, wsTypeSel);
    const win  = window.open("", "_blank");
    if(!win) return;
    win.document.write(html);
    win.document.close();
  };

  const selType = WS_TYPE_OPTIONS.find(t=>t.id===wsTypeSel) || WS_TYPE_OPTIONS[0];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.75)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -14px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.7rem 1.3rem 0.6rem",borderBottom:"1px solid "+pal.stone+"45",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"\uD83E\uDDEE AI Worksheet Builder"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{name+" \u00b7 "+grade+" \u00b7 "+selType.icon+" "+selType.label}</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0.9rem 1.2rem 0.5rem"}}>

          {/* ── CONFIG PHASE ── */}
          {phase==="config"&&(
            <div>

              {/* Worksheet type picker */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"Worksheet Type"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                  {WS_TYPE_OPTIONS.map(t=>{
                    const sel = wsTypeSel===t.id;
                    return (
                      <button key={t.id} onClick={()=>setWsTypeSel(t.id)}
                        style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.38rem 0.7rem",border:"2px solid "+(sel?pal.primary:pal.stone+"40"),borderRadius:"20px",background:sel?pal.pale:"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                        <span style={{fontSize:"0.85rem"}}>{t.icon}</span>
                        <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM}}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selType.desc&&<div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"0.4rem",fontStyle:"italic"}}>{selType.desc}</div>}
              </div>

              {/* Difficulty */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"Difficulty"}</div>
                <div style={{display:"flex",gap:"0.4rem"}}>
                  {DIFFICULTY_OPTIONS.map(d=>{
                    const sel = difficulty===d.id;
                    return (
                      <button key={d.id} onClick={()=>setDifficulty(d.id)}
                        style={{flex:1,padding:"0.55rem 0.3rem",border:"2px solid "+(sel?pal.primary:pal.stone+"40"),borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center"}}>
                        <div style={{fontSize:"1rem"}}>{d.icon}</div>
                        <div style={{fontSize:"0.72rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM,marginTop:"2px"}}>{d.label}</div>
                        <div style={{fontSize:"0.62rem",color:pal.slate,marginTop:"1px"}}>{d.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic */}
              <div style={{marginBottom:"0.85rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.45rem"}}>{"Topic"}</div>
                <textarea
                  value={topic}
                  onChange={e=>setTopic(e.target.value)}
                  placeholder={TOPIC_PLACEHOLDERS[wsTypeSel]||"What topic or subject?"}
                  rows={2}
                  style={{width:"100%",padding:"0.65rem 0.85rem",border:"2px solid "+pal.stone,borderRadius:"11px",fontSize:"0.84rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.55}}
                  onFocus={e=>e.target.style.borderColor=pal.primary}
                  onBlur={e=>e.target.style.borderColor=pal.stone}
                  autoFocus
                />
              </div>

              {/* Lesson context */}
              <div style={{marginBottom:"0.85rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.45rem"}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{"What was covered? (optional)"}</div>
                  {todayNotes&&<div style={{fontSize:"0.65rem",color:pal.primary,fontWeight:"700"}}>{"Auto-filled from today"}</div>}
                </div>
                <textarea
                  value={lessonNote}
                  onChange={e=>setLessonNote(e.target.value)}
                  placeholder={"Paste your lesson notes, describe what you taught, or leave blank for a general worksheet on the topic above..."}
                  rows={3}
                  style={{width:"100%",padding:"0.65rem 0.85rem",border:"2px solid "+pal.stone,borderRadius:"11px",fontSize:"0.8rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.55,color:lessonNote===todayNotes?pal.primary:pal.ink}}
                  onFocus={e=>e.target.style.borderColor=pal.primary}
                  onBlur={e=>e.target.style.borderColor=pal.stone}
                />
                <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"0.3rem"}}>
                  {"\uD83D\uDCA1 More context = more specific questions. Paste your lesson plan, book title, or notes."}
                </div>
              </div>

              {error&&<div style={{padding:"0.7rem",background:"#fff0f0",borderRadius:"10px",fontSize:"0.78rem",color:"#a03030",marginBottom:"0.5rem"}}>{error}</div>}
            </div>
          )}

          {/* ── LOADING PHASE ── */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"2.5rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem",animation:"pulse 1.2s ease infinite"}}>{selType.icon||"\uD83D\uDCDD"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{"Building your worksheet\u2026"}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,maxWidth:"260px",margin:"0 auto"}}>
                {"Claude is crafting grade-appropriate, topic-specific questions. Takes about 15 seconds."}
              </div>
              <div style={{marginTop:"1.5rem",display:"flex",justifyContent:"center",gap:"0.5rem"}}>
                {["Type: "+selType.label,"Level: "+difficulty.charAt(0).toUpperCase()+difficulty.slice(1),"Grade: "+grade].map((tag,i)=>(
                  <span key={i} style={{fontSize:"0.68rem",padding:"0.2rem 0.6rem",background:pal.pale,borderRadius:"20px",color:pal.primary,fontWeight:"700"}}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT PHASE ── */}
          {phase==="result"&&result&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>

              {/* Success header */}
              <div style={{background:pal.goodBg,borderRadius:"13px",padding:"0.75rem 0.95rem",marginBottom:"1rem",border:"1.5px solid "+pal.good+"30",display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"✅"}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"700",color:pal.good,fontSize:"0.84rem"}}>{result.title||"Worksheet ready!"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>
                    {(result.sections||[]).reduce((sum,s)=>sum+(s.items||[]).length,0)+" items \u00b7 "+selType.label+" \u00b7 "+difficulty+" \u00b7 "+grade}
                  </div>
                </div>
              </div>

              {/* Learning objective */}
              {result.learningObjective&&(
                <div style={{background:pal.pale,borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.75rem",border:"1.5px solid "+pal.primary+"25"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"Learning Objective"}</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{result.learningObjective}</div>
                </div>
              )}

              {/* Warm-up */}
              {result.warmUp&&(
                <div style={{background:"#fffbeb",borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.75rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"\uD83C\uDF1F Warm-Up"}</div>
                  <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{result.warmUp}</div>
                </div>
              )}

              {/* Word bank */}
              {result.wordBank&&result.wordBank.length>0&&(
                <div style={{background:pal.linen,borderRadius:"11px",padding:"0.55rem 0.85rem",marginBottom:"0.75rem",border:"1.5px solid "+pal.stone+"30"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>{"Word Bank"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    {result.wordBank.map((w,i)=>(<span key={i} style={{fontSize:"0.76rem",color:pal.inkM,padding:"0.15rem 0.55rem",background:"#fff",borderRadius:"5px",border:"1px solid "+pal.stone+"40"}}>{w}</span>))}
                  </div>
                </div>
              )}

              {/* Sections preview */}
              {(result.sections||[]).map((section,si)=>(
                <div key={si} style={{marginBottom:"0.85rem"}}>
                  {section.title&&<div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.73rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.45rem",paddingBottom:"0.25rem",borderBottom:"1px solid "+pal.stone+"30"}}>{section.title}</div>}
                  {(section.items||[]).map((item,ii)=>(
                    <div key={ii} style={{background:"#fff",borderRadius:"10px",padding:"0.55rem 0.75rem",marginBottom:"0.35rem",border:"1.5px solid "+pal.stone+"20",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.63rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{ii+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{item.content}</div>
                        {item.options&&item.options.length>0&&(
                          <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.3rem"}}>
                            {item.options.map((opt,oi)=>(
                              <span key={oi} style={{fontSize:"0.68rem",color:pal.slate,padding:"0.1rem 0.45rem",border:"1px solid "+pal.stone+"40",borderRadius:"4px"}}>{String.fromCharCode(65+oi)+". "+opt}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span style={{fontSize:"0.58rem",color:pal.stone,flexShrink:0,textTransform:"uppercase",marginTop:"2px"}}>{item.type}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Extension */}
              {result.extension&&(
                <div style={{background:"#eef4ff",borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.6rem",border:"1.5px solid #2563a830"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:"#2563a8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"Going Deeper"}</div>
                  <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{result.extension}</div>
                </div>
              )}

              {/* Bonus */}
              {result.bonusChallenge&&(
                <div style={{background:"#fffbeb",borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.6rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"Bonus Challenge"}</div>
                  <div style={{fontSize:"0.75rem",color:pal.ink}}>{result.bonusChallenge}</div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:"1px solid "+pal.stone+"45",display:"flex",gap:"0.55rem",flexShrink:0}}>
          {phase==="config"&&(
            <>
              <button onClick={onClose} style={{padding:"0.7rem 1rem",border:"2px solid "+pal.stone,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>{"Cancel"}</button>
              <button onClick={generate} disabled={!topic.trim()}
                style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:topic.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:topic.trim()?"pointer":"not-allowed"}}>
                {"\uD83E\uDDF9 Generate Worksheet"}
              </button>
            </>
          )}
          {phase==="result"&&result&&(
            <>
              <button onClick={()=>{setResult(null);setPhase("config");}} style={{padding:"0.7rem 1rem",border:"2px solid "+pal.stone,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>{"New"}</button>
              <button onClick={()=>{setResult(null);setPhase("config");}} style={{padding:"0.7rem 0.9rem",border:"2px solid "+pal.primary,borderRadius:"12px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>{"Tweak"}</button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                {"\uD83D\uDDA8\uFE0F Print"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function AIUnitBuilderModal({ pal, family, activeChild, onSave, onClose }) {
  const [step,     setStep]     = useState(0); // 0=subject 1=details 2=generating 3=result
  const [subject,  setSubject]  = useState(null);
  const [topic,    setTopic]    = useState("");
  const [duration, setDuration] = useState("6 weeks");
  const [notes,    setNotes]    = useState("");
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);
  const [dots,     setDots]     = useState(".");

  // Animate dots while generating
  useState(()=>{
    if(step!==2) return;
    const t=setInterval(()=>setDots(d=>d.length>=3?".":"d.+."), 600);
    return ()=>clearInterval(t);
  },[step]);

  const generate = async () => {
    if(!subject||!topic.trim()) return;
    setStep(2);
    setError(null);
    const child = activeChild;
    const goals = goalSummary(family);
    const curriculum = curriculumContext(family);
    const prompt = "You are a homeschool curriculum assistant. Create a concise unit study plan shaped toward this family's goals.\n\n"
      + "Student: "+(child?.name||"Student")+", "+(child?.grade||"elementary")+" grade\n"
      + "Curriculum: "+curriculum+"\n"
      + "Subject: "+subject.label+"\n"
      + "Topic: "+topic+"\n"
      + "Duration: "+duration+"\n"
      + "Family goals: "+goals+"\n"
      + (notes?"Special notes: "+notes+"\n":"")
      + "\nIMPORTANT: Shape the unit to reflect the family's goals. If they prioritize Faith & Character, weave in character development. If Strong Readers, emphasize reading-based activities. If STEM Focus, add hands-on experiments. If Nature & Outdoors, include outdoor learning.\n\n"
      + "Respond in this exact JSON format (no markdown, no backticks, just raw JSON):\n"
      + '{\n  \"title\": \"unit title (5-8 words)\",\n  \"overview\": \"2-3 sentence engaging overview\",\n'
      + '  \"weeklyPlan\": [\n    {\"week\": 1, \"focus\": \"focus area\", \"activities\": [\"activity 1\", \"activity 2\", \"activity 3\"], \"resources\": \"suggested books or materials\"},\n'
      + '    {\"week\": 2, \"focus\": \"focus area\", \"activities\": [\"activity 1\", \"activity 2\", \"activity 3\"], \"resources\": \"suggested books or materials\"}\n  ],\n'
      + '  \"keySkills\": [\"skill 1\", \"skill 2\", \"skill 3\"],\n  \"assessmentIdeas\": [\"idea 1\", \"idea 2\"]\n}'
      + "\n\nInclude only the first 3 weeks in weeklyPlan. Keep each activity description under 12 words."

    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setStep(3);
    } catch(e) {
      setError("Couldn't connect to AI right now. Check your connection and try again.");
      setStep(1);
    }
  };

  const handleSave = () => {
    if(!result||!subject) return;
    const subj = SUBJECTS.find(s=>s.id===subject.id);
    onSave({
      subject:subject.label,
      icon:subject.icon,
      title:result.title,
      weeks:parseInt(duration)||6,
      weeksDone:0,
      plan:result.overview+"\n\n"+result.weeklyPlan.map(w=>`Week ${w.week}: ${w.focus}\n${w.activities.map(a=>"* "+a).join("\n")}`).join("\n\n"),
    });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.75)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 -14px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>
        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>
        {/* Header */}
        <div style={{padding:"0.75rem 1.3rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}> AI Unit Builder</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>
              {["Pick a subject","Details","Generating...","Your unit plan"][step]}
            </div>
          </div>
          {step!==2&&<button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>}
        </div>
        {/* Progress steps */}
        {step<3&&<div style={{display:"flex",gap:"4px",padding:"0.65rem 1.3rem 0",flexShrink:0}}>
          {[0,1,2].map(i=><div key={i} style={{flex:1,height:"4px",borderRadius:"99px",background:i<=step?pal.primary:pal.stone+"50",transition:"background 0.25s"}}/>)}
        </div>}

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>

          {/* Step 0 - Subject picker */}
          {step===0&&(<>
            <div style={{fontSize:"0.8rem",color:pal.slate,marginBottom:"0.85rem",lineHeight:1.6}}>
              What subject are we building a unit for{activeChild?` for ${activeChild.name}`:""}?
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
              {SUBJECTS.map(s=>{
                const sel=subject?.id===s.id;
                return (
                  <button key={s.id} onClick={()=>setSubject(s)} style={{padding:"0.8rem 0.7rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",transition:"all 0.13s"}}>
                    <span style={{fontSize:"1.5rem"}}>{s.icon}</span>
                    <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM}}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </>)}

          {/* Step 1 - Details */}
          {step===1&&(<>
            <div style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.75rem",background:pal.pale,borderRadius:"13px",marginBottom:"1rem",border:`2px solid ${pal.primary}20`}}>
              <span style={{fontSize:"1.5rem"}}>{subject?.icon}</span>
              <span style={{fontWeight:"700",color:pal.primary,fontSize:"0.88rem"}}>{subject?.label}</span>
              <button onClick={()=>setStep(0)} style={{marginLeft:"auto",fontSize:"0.72rem",color:pal.slate,background:"transparent",border:"none",cursor:"pointer",fontWeight:"600"}}>Change</button>
            </div>
            <Lbl pal={pal}>Topic or title</Lbl>
            <Input pal={pal} value={topic} onChange={setTopic} placeholder={"e.g. " + (subject?.id==="history"?"Ancient Egypt":subject?.id==="math"?"Fractions & Decimals":subject?.id==="science"?"Weather & Climate":"The American Revolution")} />
            <div style={{height:"0.85rem"}}/>
            <Lbl pal={pal}>Duration</Lbl>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.85rem"}}>
              {DURATIONS.map(d=>(
                <PillBtn key={d} label={d} active={duration===d} onClick={()=>setDuration(d)} pal={pal}/>
              ))}
            </div>
            <Lbl pal={pal}>Any special requests? <span style={{fontWeight:"400",color:pal.slate}}>(optional)</span></Lbl>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)}
              placeholder="e.g. Include nature journaling, focus on hands-on activities, tie to our faith..."
              rows={3} style={{width:"100%",padding:"0.65rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",lineHeight:1.55,outline:"none"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
            {error&&<div style={{marginTop:"0.75rem",padding:"0.75rem",background:pal.badBg,borderRadius:"11px",fontSize:"0.78rem",color:"#a03030",lineHeight:1.55}}>{error}</div>}
          </>)}

          {/* Step 2 - Generating */}
          {step===2&&(
            <div style={{textAlign:"center",padding:"2rem 1rem",animation:"fadeIn 0.3s ease"}}>
              <div style={{fontSize:"3.5rem",marginBottom:"1rem",animation:"pulse 1.4s ease infinite"}}></div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"1.1rem",marginBottom:"0.5rem"}}>Building your unit{dots}</div>
              <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.7,marginBottom:"1.5rem"}}>
                Claude is creating a {duration} {subject?.label} unit on "{topic}" for {activeChild?.name||"your student"}.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                {["Picking key themes & skills","Planning weekly activities","Selecting resources","Writing your overview"].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.5rem 0.75rem",background:pal.pale,borderRadius:"10px",animation:`fadeUp 0.3s ease ${i*0.12}s both`}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",background:pal.primary,animation:"pulse 1.2s ease infinite",animationDelay:`${i*0.2}s`,flexShrink:0}}/>
                    <span style={{fontSize:"0.78rem",color:pal.inkM}}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 - Result */}
          {step===3&&result&&(
            <div style={{animation:"fadeUp 0.25s ease"}}>
              {/* Title & overview */}
              <div style={{background:pal.heroGrad,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.55rem",position:"relative"}}>
                  <span style={{fontSize:"1.4rem"}}>{subject?.icon}</span>
                  <div>
                    <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:"700"}}>{subject?.label} - {duration}</div>
                    <div style={{fontWeight:"900",color:"#fff",fontSize:"1rem",lineHeight:1.2}}>{result.title}</div>
                  </div>
                </div>
                <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.8)",lineHeight:1.7,position:"relative"}}>{result.overview}</div>
              </div>

              {/* Key skills */}
              <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}45`}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.55rem"}}>Key Skills</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                  {(result.keySkills||[]).map((sk,i)=>(
                    <span key={i} style={{padding:"0.22rem 0.65rem",background:pal.pale,borderRadius:"50px",fontSize:"0.74rem",fontWeight:"700",color:pal.primary}}>{sk}</span>
                  ))}
                </div>
              </div>

              {/* Weekly plan */}
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.55rem"}}>Weekly Plan</div>
              {(result.weeklyPlan||[]).map((w,i)=>(
                <div key={i} style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.5rem",border:`1.5px solid ${pal.stone}40`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                    <span style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>Week {w.week}</span>
                    <span style={{fontSize:"0.72rem",fontWeight:"700",color:pal.primary,background:pal.pale,padding:"0.1rem 0.5rem",borderRadius:"50px"}}>{w.focus}</span>
                  </div>
                  {w.activities.map((a,j)=>(
                    <div key={j} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",marginBottom:"0.3rem"}}>
                      <div style={{width:"5px",height:"5px",borderRadius:"50%",background:pal.primary,flexShrink:0,marginTop:"6px"}}/>
                      <span style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{a}</span>
                    </div>
                  ))}
                  {w.resources&&<div style={{marginTop:"0.5rem",fontSize:"0.72rem",color:pal.slate,fontStyle:"italic"}}>📚 {w.resources}</div>}
                </div>
              ))}

              {/* Assessment ideas */}
              {result.assessmentIdeas&&result.assessmentIdeas.length>0&&(
                <div style={{background:pal.pale,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}20`}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.45rem"}}>Assessment Ideas</div>
                  {result.assessmentIdeas.map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",marginBottom:"0.28rem"}}>
                      <span style={{fontSize:"0.8rem",flexShrink:0}}>💡</span>
                      <span style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{a}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{height:"0.5rem"}}/>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          {step===0&&(
            <>
              <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
              <button onClick={()=>subject&&setStep(1)} disabled={!subject} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:subject?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:subject?"pointer":"not-allowed"}}>
                {"Next →"}
              </button>
            </>
          )}
          {step===1&&(
            <>
              <button onClick={()=>setStep(0)} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Back</button>
              <button onClick={generate} disabled={!topic.trim()} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:topic.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:topic.trim()?"pointer":"not-allowed"}}>
                 Build It
              </button>
            </>
          )}
          {step===3&&(
            <>
              <button onClick={()=>{setStep(1);setResult(null);}} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Rebuild</button>
              <button onClick={handleSave} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                Save Unit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================
   AI WORKSHEET MODAL - live Claude API
======================================= */

function KidQuizModal({child, family, subjLabel, subjIcon, grade, todayEntries, allTodayEntries, c1, c2, onSaveResult, onClose}) {
  const [phase,    setPhase]    = React.useState("loading"); // loading|quiz|results|error
  const [questions,setQuestions]= React.useState([]);
  const [current,  setCurrent]  = React.useState(0);
  const [answers,  setAnswers]  = React.useState([]); // {q, chosen, correct, correctAnswer}
  const [typed,    setTyped]    = React.useState("");
  const [feedback, setFeedback] = React.useState(null); // null|"correct"|"wrong"

  const heroGrad = `linear-gradient(135deg,${c1},${c2})`;

  // Grade group: early (K-2), mid (3-5), upper (6-8), high (9-12)
  const gradeNum = parseInt((grade||"3rd").replace(/\D/g,""))||3;
  const gradeGroup = gradeNum<=2?"early":gradeNum<=5?"mid":gradeNum<=8?"upper":"high";

  // Build context from today's notes for this subject
  const lessonContext = React.useMemo(()=>{
    const notes = todayEntries.map(e=>e.note||e.title||"").filter(Boolean).join(". ");
    const allNotes = allTodayEntries.map(e=>e.note||"").filter(Boolean).join(". ");
    return notes || allNotes || "General "+subjLabel+" lesson";
  }, [todayEntries, allTodayEntries, subjLabel]);

  React.useEffect(()=>{
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setPhase("loading");
    try {
      const gradeDesc = gradeGroup==="early"?"K-2nd grade (ages 5-8), keep it very simple, fun and encouraging":
        gradeGroup==="mid"?"3rd-5th grade (ages 8-11), moderate challenge":
        gradeGroup==="upper"?"6th-8th grade (ages 11-14), more analytical":
        "9th-12th grade (ages 14-18), rigorous and thoughtful";

      const prompt = `You are a fun, encouraging homeschool tutor generating a quick quiz for a ${grade} student.

Subject: ${subjLabel}
Grade: ${grade} (${gradeDesc})
What was covered today: ${lessonContext}

Generate exactly 3 quiz questions based on what was actually covered today.
Make questions directly tied to the lesson content above - not generic subject questions.
For K-2: use very simple yes/no or one-word answers with big clear options.
For 3-5: use 4-option multiple choice.
For 6-8: mix of multiple choice and one short-answer question.
For 9-12: deeper analysis, can include one short-answer.

Respond ONLY with valid JSON, no markdown, no explanation:
{"questions":[{"q":"question text","type":"mc","options":["A","B","C","D"],"answer":"A","explanation":"brief why"},...]}
For short-answer type: {"q":"...","type":"sa","answer":"expected answer","explanation":"..."}
For true/false: {"q":"...","type":"tf","options":["True","False"],"answer":"True","explanation":"..."}`;

      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      if(!parsed.questions||!Array.isArray(parsed.questions)) throw new Error("bad format");
      setQuestions(parsed.questions);
      setPhase("quiz");
    } catch(err) {
      if(err.message==="NO_KEY") setPhase("nokey");
      else setPhase("error");
    }
  };

  const handleAnswer = (chosen) => {
    const q = questions[current];
    const isCorrect = q.type==="sa"
      ? chosen.trim().toLowerCase().includes(q.answer.toLowerCase().split(" ")[0])
      : chosen===q.answer;
    setFeedback(isCorrect?"correct":"wrong");
    setTimeout(()=>{
      setAnswers(prev=>[...prev,{q:q.q,chosen,correct:isCorrect,correctAnswer:q.answer,explanation:q.explanation}]);
      setFeedback(null);
      setTyped("");
      if(current+1>=questions.length) {
        setPhase("results");
      } else {
        setCurrent(c=>c+1);
      }
    }, isCorrect?800:1400);
  };

  const score = answers.filter(a=>a.correct).length;
  const missed = answers.filter(a=>!a.correct).map(a=>a.q.slice(0,40));

  const GRADE_ENCOURAGEMENT = [
    "Amazing work! Keep going! 🌟",
    "You're doing great! 🎉",
    "Nice job! Every quiz makes you smarter! 🚀",
  ];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
      <div style={{background:SK.cream,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>

        {/* Header */}
        <div style={{background:heroGrad,padding:"0.85rem 1.2rem",borderRadius:"28px 28px 0 0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"1.4rem"}}>{subjIcon}</span>
              <div>
                <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{subjLabel+" Challenge!"}</div>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.75)"}}>{grade+" · based on today's lesson"}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:"28px",height:"28px",color:"#fff",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
          </div>
          {phase==="quiz"&&questions.length>0&&(
            <div style={{marginTop:"0.55rem"}}>
              <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.25)",overflow:"hidden"}}>
                <div style={{height:"100%",width:((current/questions.length)*100)+"%",background:"rgba(255,255,255,0.85)",borderRadius:"99px",transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.7)",marginTop:"3px",textAlign:"right"}}>{current+1+" of "+questions.length}</div>
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1.2rem 1.2rem 1.5rem"}}>

          {/* Loading */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"2rem 1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem",animation:"bounce 1s ease infinite"}}>{"🤔"}</div>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Building your quiz..."}</div>
              <div style={{fontSize:"0.72rem",color:SK.lite}}>{"Making questions from today's lesson!"}</div>
            </div>
          )}

          {/* No API key */}
          {phase==="nokey"&&(
            <div style={{textAlign:"center",padding:"1.5rem 1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"🔑"}</div>
              <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem",marginBottom:"0.3rem"}}>{"AI not set up yet"}</div>
              <div style={{fontSize:"0.72rem",color:SK.lite,lineHeight:1.6}}>{"Ask your parent to add an API key in Settings to unlock quizzes!"}</div>
            </div>
          )}

          {/* Error */}
          {phase==="error"&&(
            <div style={{textAlign:"center",padding:"1.5rem 1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"😔"}</div>
              <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem",marginBottom:"0.5rem"}}>{"Couldn't make a quiz right now"}</div>
              <button onClick={generateQuiz} style={{padding:"0.5rem 1.2rem",border:"none",borderRadius:"12px",background:heroGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>{"Try again"}</button>
            </div>
          )}

          {/* Active question */}
          {phase==="quiz"&&questions[current]&&(()=>{
            const q = questions[current];
            const opts = q.options||[];
            return (
              <div>
                <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem 1rem",marginBottom:"1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                  <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.92rem",lineHeight:1.5,marginBottom:"0.25rem"}}>{"💭 "+q.q}</div>
                </div>
                {/* Multiple choice / true-false */}
                {(q.type==="mc"||q.type==="tf")&&(
                  <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {opts.map((opt,oi)=>{
                      const isSelected = feedback!==null;
                      const isCorrect  = opt===q.answer;
                      const bg = !isSelected?"#fff":
                        isCorrect?"#e8f7ee":
                        opt===answers[answers.length]?.chosen?"#ffeaea":"#fff";
                      const border = !isSelected?SK.skyL:
                        isCorrect?"#2d9e5f":"#ddd";
                      return (
                        <button key={oi} onClick={()=>!feedback&&handleAnswer(opt)}
                          style={{padding:"0.75rem 1rem",border:"2.5px solid "+border,borderRadius:"16px",background:bg,fontFamily:"inherit",fontWeight:"700",fontSize:gradeGroup==="early"?"1rem":"0.85rem",color:SK.ink,cursor:feedback?"default":"pointer",textAlign:"left",transition:"all 0.2s"}}>
                          {gradeGroup!=="early"&&<span style={{color:c1,marginRight:"0.4rem"}}>{String.fromCharCode(65+oi)+"."}</span>}
                          {opt}
                          {isSelected&&isCorrect&&<span style={{float:"right"}}>{"✓"}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Short answer */}
                {q.type==="sa"&&(
                  <div>
                    <input value={typed} onChange={e=>setTyped(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&typed.trim()&&!feedback&&handleAnswer(typed)}
                      placeholder={"Type your answer..."}
                      style={{width:"100%",padding:"0.75rem",border:"2.5px solid "+c1+"50",borderRadius:"14px",fontSize:"0.9rem",fontFamily:"inherit",color:SK.ink,background:SK.skyL,outline:"none",marginBottom:"0.5rem"}}
                    />
                    <button onClick={()=>typed.trim()&&!feedback&&handleAnswer(typed)}
                      disabled={!typed.trim()||!!feedback}
                      style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"13px",background:typed.trim()?"linear-gradient(135deg,"+c1+","+c2+")":" #ddd",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:typed.trim()?"pointer":"default"}}>{"Submit"}</button>
                  </div>
                )}
                {/* Feedback overlay */}
                {feedback&&(
                  <div style={{marginTop:"0.75rem",padding:"0.75rem 1rem",borderRadius:"14px",background:feedback==="correct"?"#e8f7ee":"#fff4e6",border:"2px solid "+(feedback==="correct"?"#2d9e5f":"#f5a442"),textAlign:"center"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:"2px"}}>{feedback==="correct"?"🎉":"💪"}</div>
                    <div style={{fontWeight:"800",color:feedback==="correct"?"#2d9e5f":"#e87a00",fontSize:"0.85rem"}}>{feedback==="correct"?"Correct!":"Not quite..."}</div>
                    {feedback==="wrong"&&questions[current]?.explanation&&(
                      <div style={{fontSize:"0.72rem",color:SK.ink,marginTop:"3px",lineHeight:1.5}}>{questions[current].explanation}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Results */}
          {phase==="results"&&(
            <div>
              <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.4rem",animation:"bounce 1.5s ease infinite"}}>
                  {score===questions.length?"🏆":score>=questions.length/2?"🌟":"💪"}
                </div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.3rem"}}>{score+"/"+questions.length}</div>
                <div style={{fontSize:"0.8rem",color:SK.lite,marginTop:"3px"}}>
                  {score===questions.length
                    ?GRADE_ENCOURAGEMENT[0]
                    :score>=questions.length/2
                    ?GRADE_ENCOURAGEMENT[1]
                    :GRADE_ENCOURAGEMENT[2]}
                </div>
              </div>
              {/* Answer review */}
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1rem"}}>
                {answers.map((a,i)=>(
                  <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.7rem 0.85rem",border:"1.5px solid "+(a.correct?"#2d9e5f40":"#f5a44240")}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:a.correct?"0":"0.3rem"}}>
                      <span style={{fontSize:"0.85rem"}}>{a.correct?"✅":"❌"}</span>
                      <span style={{fontSize:"0.75rem",fontWeight:"700",color:SK.ink,flex:1,lineHeight:1.4}}>{a.q}</span>
                    </div>
                    {!a.correct&&(
                      <div style={{fontSize:"0.7rem",color:"#b07800",marginLeft:"1.4rem"}}>{"Correct: "+a.correctAnswer}</div>
                    )}
                  </div>
                ))}
              </div>
              {/* Save to portfolio */}
              <button onClick={()=>onSaveResult({score,total:questions.length,missed,questions:answers,subject:subjLabel,grade})}
                style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"16px",background:heroGrad,color:"#fff",fontWeight:"900",fontSize:"0.92rem",cursor:"pointer",boxShadow:"0 4px 18px "+c1+"40",marginBottom:"0.5rem"}}>
                {"📊 Save results → Progress"}
              </button>
              <button onClick={onClose}
                style={{width:"100%",padding:"0.5rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.76rem",cursor:"pointer"}}>{"Close"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================
   KID GOAL ONBOARDING
======================================= */

/* ----------------------------------------------------------
   FIELD STUDY MODAL
   Photo → AI identifies subject → fun facts + mini lesson
   + printable worksheet
   ---------------------------------------------------------- */
function FieldStudyModal({ pal, family, child, onAddEntry, onClose }) {
  const [phase,       setPhase]      = useState("capture"); // capture|loading|result|worksheet|journal
  const [imageData,   setImageData]  = useState(null);
  const [imageMime,   setImageMime]  = useState("image/jpeg");
  const [result,      setResult]     = useState(null);
  const [wsResult,    setWsResult]   = useState(null);
  const [wsLoading,   setWsLoading]  = useState(false);
  const [wsError,     setWsError]    = useState(null);
  const [savedSubj,   setSavedSubj]  = useState(null);   // subject chosen by parent for logging
  const [showSubjPicker, setShowSubjPicker] = useState(false);
  const [sharedToKid, setSharedToKid] = useState(false);
  const fileRef = useRef(null);
  const camRef  = useRef(null);

  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";

  // All family subjects resolved to label+icon
  const familySubjects = useMemo(() => {
    const all = [...(SUBJECT_OPTIONS||[]), ...(family.customSubjects||[])];
    return (family.subjects||[]).map(id => all.find(s=>s.id===id)).filter(Boolean);
  }, [family]);

  // Past field study entries for this child
  const pastStudies = useMemo(() => {
    if(!onAddEntry) return [];
    // We don't have direct portfolio access here so we read from a passed prop — 
    // use window.__rbPortfolio if available (set by root), otherwise empty
    try {
      const saved = localStorage.getItem("rootbloom_v1");
      if(!saved) return [];
      const data = JSON.parse(saved);
      const childIdx = (family.children||[]).findIndex(c=>c.id===child?.id);
      return (data.portfolio||[])
        .filter(e=>e.isFieldStudy && e.childIdx===childIdx)
        .sort((a,b)=>b.ts||0 - a.ts||0)
        .slice(0, 20);
    } catch(e) { return []; }
  }, [child, family]);

  const analyzeImage = async (base64, mime) => {
    setImageData(base64);
    setImageMime(mime);
    setPhase("loading");
    setSharedToKid(false);
    setSavedSubj(null);

    const gradeDesc = gradeNum<=2 ? "K-2nd grade, very simple fun language, short sentences"
      : gradeNum<=5 ? "3rd-5th grade, engaging and curious tone"
      : gradeNum<=8 ? "6th-8th grade, scientific and analytical"
      : "9th-12th grade, college-prep depth";

    const familySubjLabels = familySubjects.map(s=>s.label).join(", ") || "general subjects";

    const prompt = `You are an enthusiastic nature and science educator helping a homeschool family.\nLook at this photo and identify what is in it — plants, animals, rocks, insects, objects, or scenes.\n\nStudent: ${name}, ${grade} (${gradeDesc})\nFamily goals: ${goalSummary(family)}\nFamily subjects: ${familySubjLabels}\n\nRespond ONLY with valid JSON:\n{\n  "subject": "what you see (e.g. Oak tree leaves, Monarch butterfly, Quartz crystal)",\n  "category": "plant|animal|insect|rock|weather|place|object|other",\n  "confidence": "high|medium|low",\n  "funFacts": [\n    "fun fact 1 written for this grade level",\n    "fun fact 2",\n    "fun fact 3",\n    "fun fact 4",\n    "fun fact 5"\n  ],\n  "miniLesson": {\n    "title": "Mini Lesson title (5-8 words)",\n    "introduction": "1-2 engaging sentences introducing the subject at grade level",\n    "keyPoints": [\n      "key point 1",\n      "key point 2",\n      "key point 3"\n    ],\n    "activity": "One hands-on activity the student can do right now",\n    "discussion": "One thought-provoking question to spark conversation",\n    "vocabulary": ["word1", "word2", "word3"]\n  },\n  "suggestedSubject": "the single best matching subject label from this list: ${familySubjLabels}",\n  "subjects": ["list of school subjects this connects to"]\n}`;

    try {
      const raw    = await callClaude(prompt, base64, mime);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);

      // Pick best subject: match AI suggestion against family subjects
      const suggested = parsed.suggestedSubject || parsed.subjects?.[0] || "Science";
      const match = familySubjects.find(s =>
        s.label.toLowerCase()===suggested.toLowerCase() ||
        suggested.toLowerCase().includes(s.label.toLowerCase().split(" ")[0])
      );
      const chosenSubj = match || familySubjects.find(s=>s.label.toLowerCase().includes("science")) || familySubjects[0] || {label:"Science",icon:"\uD83D\uDD2D",id:"science"};
      setSavedSubj(chosenSubj);

      setPhase("result");

      // Auto-save portfolio entry
      if(onAddEntry && child) {
        const childIdx = family.children.findIndex(c=>c.id===child.id);
        if(childIdx >= 0) {
          onAddEntry({
            childIdx,
            subj: chosenSubj.label,
            title: "\uD83D\uDD2D Field Study: " + parsed.subject,
            note: "Identified: " + parsed.subject + ". " + (parsed.funFacts?.[0]||""),
            thumb: parsed.category==="plant"?"\uD83C\uDF3F":parsed.category==="animal"?"\uD83E\uDD8B":parsed.category==="insect"?"\uD83D\uDC1B":parsed.category==="rock"?"\uD83E\uDEA8":"\uD83D\uDD2D",
            date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
            ts: Date.now(),
            photos: [base64],
            selfLogged: false,
            isFieldStudy: true,
          });
        }
      }
    } catch(e) {
      setResult({_error: e.message==="NO_KEY" ? "nokey" : "fail"});
      setPhase("result");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target.result.split(",")[1];
      analyzeImage(base64, mime);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const changeSubject = (subj) => {
    // Re-save the portfolio entry with updated subject
    if(onAddEntry && child && result && !result._error) {
      const childIdx = family.children.findIndex(c=>c.id===child.id);
      if(childIdx >= 0) {
        onAddEntry({
          childIdx,
          subj: subj.label,
          title: "\uD83D\uDD2D Field Study: " + result.subject,
          note: "Identified: " + result.subject + ". " + (result.funFacts?.[0]||""),
          thumb: "\uD83D\uDD2D",
          date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
          ts: Date.now(),
          photos: [imageData],
          selfLogged: false,
          isFieldStudy: true,
          _replaceSubj: savedSubj?.label, // hint for dedup if needed
        });
      }
    }
    setSavedSubj(subj);
    setShowSubjPicker(false);
  };

  const shareToKid = () => {
    if(!result || result._error || !onAddEntry || !child) return;
    const childIdx = family.children.findIndex(c=>c.id===child.id);
    if(childIdx < 0) return;
    onAddEntry({
      childIdx,
      subj: savedSubj?.label || "Science",
      title: "\uD83D\uDD2D Field Study: " + result.subject,
      note: (result.funFacts?.[0]||"") + " " + (result.miniLesson?.discussion ? "Think about this: " + result.miniLesson.discussion : ""),
      thumb: "\uD83D\uDD2D",
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      ts: Date.now(),
      photos: imageData ? [imageData] : [],
      isMilestone: true,   // shows in Stars tab
      selfLogged: false,
      isFieldStudy: true,
      isSharedDiscovery: true,
    });
    setSharedToKid(true);
  };

  const generateWorksheet = async () => {
    if(!result || result._error) return;
    setWsLoading(true); setWsError(null);
    try {
      const extraCtx = `Based on a field observation of: ${result.subject}. Key vocabulary: ${(result.miniLesson?.vocabulary||[]).join(", ")}. Key concepts: ${(result.miniLesson?.keyPoints||[]).join("; ")}`;
      const prompt = buildWorksheetPrompt("Science", result.subject + " \u2014 Field Study", child, family, extraCtx);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      setWsResult(JSON.parse(clean));
      setPhase("worksheet");
    } catch(e) {
      setWsError("Couldn\u2019t generate worksheet right now.");
    }
    setWsLoading(false);
  };

  const openPrint = () => {
    if(!wsResult) return;
    const html = buildWorksheetHTML(wsResult, child, grade, "Field Study");
    const win  = window.open("", "_blank");
    if(!win) return;
    win.document.write(html);
    win.document.close();
  };

  const CATEGORY_ICONS = { plant:"\uD83C\uDF3F", animal:"\uD83E\uDD8B", insect:"\uD83D\uDC1B", rock:"\uD83E\uDEA8", weather:"\u26C5", place:"\uD83D\uDCCD", object:"\uD83D\uDD0D", other:"\uD83D\uDD2D" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.82)",backdropFilter:"blur(14px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.4)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.75rem 1.2rem 0.65rem",borderBottom:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{"\uD83D\uDD2D Field Study"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{"Snap a photo \u00b7 Get facts \u00b7 Build a lesson"}</div>
          </div>
          <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
            {pastStudies.length>0&&(
              <button onClick={()=>setPhase("journal")}
                style={{padding:"0.25rem 0.65rem",border:"1.5px solid "+pal.primary+"50",borderRadius:"20px",background:phase==="journal"?pal.pale:"transparent",color:pal.primary,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>
                {"\uD83D\uDCD6 "+pastStudies.length}
              </button>
            )}
            <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"×"}</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {/* ── CAPTURE ── */}
          {phase==="capture"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"4rem",marginBottom:"0.75rem",animation:"bounce 2s ease infinite"}}>{"📸"}</div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem",marginBottom:"0.35rem"}}>{"What did you find?"}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,marginBottom:"1.5rem",maxWidth:"280px",margin:"0 auto 1.5rem"}}>
                {"Snap a photo of a plant, animal, rock, or anything interesting. Claude will identify it and build a mini lesson for "+name+"!"}
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFile}/>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"280px",margin:"0 auto"}}>
                <button onClick={()=>camRef.current?.click()}
                  style={{padding:"0.9rem",border:"none",borderRadius:"16px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:`0 4px 18px ${pal.accent}40`}}>
                  <span>{"📷"}</span><span>{"Take a Photo"}</span>
                </button>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
                  <span>{"\uD83D\uDDBC\uFE0F"}</span><span>{"Choose from Library"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"1.5rem 0"}}>
              {imageData&&<img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>}
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem",animation:"pulse 1.2s ease infinite"}}>{"\uD83D\uDD2D"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Identifying what you found\u2026"}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Claude is looking at your photo and building a mini lesson. Takes about 15 seconds."}</div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase==="result"&&result&&!result._error&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              {imageData&&(
                <img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>
              )}

              {/* Subject card + subject picker */}
              <div style={{background:pal.pale,borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}25`}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.8rem"}}>{CATEGORY_ICONS[result.category]||"\uD83D\uDD2D"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"900",color:pal.primary,fontSize:"1rem"}}>{result.subject}</div>
                    <div style={{fontSize:"0.65rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em"}}>{result.category+" \u00b7 "+result.confidence+" confidence"}</div>
                  </div>
                </div>
                {(result.subjects||[]).length>0&&(
                  <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.6rem"}}>
                    {result.subjects.map((s,i)=>(
                      <span key={i} style={{fontSize:"0.65rem",padding:"0.1rem 0.5rem",background:pal.primary+"18",borderRadius:"20px",color:pal.primary,fontWeight:"700"}}>{s}</span>
                    ))}
                  </div>
                )}
                {/* Subject logging picker */}
                <div style={{borderTop:"1px solid "+pal.stone+"30",paddingTop:"0.55rem",marginTop:"0.35rem"}}>
                  <div style={{fontSize:"0.65rem",color:pal.slate,marginBottom:"0.35rem",fontWeight:"600"}}>{"Logged under subject:"}</div>
                  {showSubjPicker?(
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                      {familySubjects.map(s=>(
                        <button key={s.id} onClick={()=>changeSubject(s)}
                          style={{padding:"0.25rem 0.6rem",border:"1.5px solid "+(savedSubj?.id===s.id?pal.primary:pal.stone+"50"),borderRadius:"20px",background:savedSubj?.id===s.id?pal.pale:"transparent",color:savedSubj?.id===s.id?pal.primary:pal.inkM,fontSize:"0.7rem",fontWeight:"700",cursor:"pointer"}}>
                          {s.icon+" "+s.label}
                        </button>
                      ))}
                    </div>
                  ):(
                    <button onClick={()=>setShowSubjPicker(true)}
                      style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.3rem 0.7rem",border:"1.5px solid "+pal.primary+"40",borderRadius:"20px",background:pal.primary+"10",cursor:"pointer"}}>
                      <span style={{fontSize:"0.85rem"}}>{savedSubj?.icon||"\uD83D\uDCCB"}</span>
                      <span style={{fontSize:"0.75rem",fontWeight:"700",color:pal.primary}}>{savedSubj?.label||"Science"}</span>
                      <span style={{fontSize:"0.65rem",color:pal.slate}}>{"(tap to change)"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Share to Stars button */}
              <button onClick={sharedToKid?null:shareToKid}
                style={{width:"100%",padding:"0.6rem 1rem",border:"1.5px solid "+(sharedToKid?"#2d9e5f60":pal.primary+"40"),borderRadius:"12px",background:sharedToKid?"#edf9f0":pal.pale,color:sharedToKid?"#2d9e5f":pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:sharedToKid?"default":"pointer",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"}}>
                <span>{sharedToKid?"\u2713":"\uD83C\uDF1F"}</span>
                <span>{sharedToKid?"Saved to "+name+"\u2019s Stars!":"Share discovery to "+name+"\u2019s Stars tab"}</span>
              </button>

              {/* Fun facts */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.55rem"}}>{"\uD83C\uDF1F Fun Facts"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                  {(result.funFacts||[]).map((fact,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:"12px",padding:"0.6rem 0.8rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <span style={{fontSize:"0.85rem",flexShrink:0}}>{"\u2736"}</span>
                      <span style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.55}}>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini lesson */}
              {result.miniLesson&&(
                <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>{"📖 "+result.miniLesson.title}</div>
                  <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.65rem"}}>{result.miniLesson.introduction}</div>
                  {(result.miniLesson.keyPoints||[]).length>0&&(
                    <div style={{marginBottom:"0.65rem"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>{"Key Points"}</div>
                      {result.miniLesson.keyPoints.map((kp,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.4rem",alignItems:"flex-start",marginBottom:"0.3rem"}}>
                          <span style={{color:pal.primary,flexShrink:0,marginTop:"2px"}}>{"→"}</span>
                          <span style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.miniLesson.activity&&(
                    <div style={{background:pal.pale,borderRadius:"10px",padding:"0.55rem 0.75rem",marginBottom:"0.5rem",border:`1.5px solid ${pal.primary}20`}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"\uD83E\uDDEA Try This"}</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{result.miniLesson.activity}</div>
                    </div>
                  )}
                  {result.miniLesson.discussion&&(
                    <div style={{background:"#fffbeb",borderRadius:"10px",padding:"0.55rem 0.75rem",border:"1.5px solid #f5c84240"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"\uD83D\uDCAC Talk About It"}</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5,fontStyle:"italic"}}>{"\""+result.miniLesson.discussion+"\""}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Vocabulary */}
              {(result.miniLesson?.vocabulary||[]).length>0&&(
                <div style={{background:"#fff",borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}25`}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.4rem"}}>{"\uD83D\uDCDA Vocabulary"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    {result.miniLesson.vocabulary.map((w,i)=>(
                      <span key={i} style={{fontSize:"0.78rem",padding:"0.2rem 0.6rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`,color:pal.primary,fontWeight:"700"}}>{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Worksheet CTA */}
              <button onClick={generateWorksheet} disabled={wsLoading}
                style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:wsLoading?"#ccc":pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.9rem",cursor:wsLoading?"default":"pointer",marginBottom:"0.5rem"}}>
                {wsLoading?"\u23F3 Building worksheet\u2026":"\uD83D\uDCC4 Build a Worksheet from This"}
              </button>
              {wsError&&<div style={{fontSize:"0.72rem",color:"#a03030",textAlign:"center"}}>{wsError}</div>}

              {/* Share to Stars + Study Again */}
              <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                <button onClick={()=>{
                  if(sharedToKid||!onAddEntry||!child||!result) return;
                  const ci=family.children.findIndex(c=>c.id===child.id);
                  if(ci<0) return;
                  onAddEntry({
                    childIdx:ci,
                    subj:savedSubj||result.subjects?.[0]||"Science",
                    title:"\u2b50 Discovery: "+result.subject,
                    note:"I found: "+result.subject+"! "+((result.funFacts||[])[0]||""),
                    thumb:"\u2b50",
                    date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
                    photos:imageData?[imageData]:[],
                    isMilestone:true,
                    isFieldStudy:true,
                    selfLogged:false,
                    ts:Date.now(),
                  });
                  setSharedToKid(true);
                }}
                  disabled={sharedToKid}
                  style={{flex:1,padding:"0.7rem",border:"1.5px solid "+(sharedToKid?"#2d9e5f":"#f5c842"),borderRadius:"12px",background:sharedToKid?"#edf9f0":"#fffbeb",color:sharedToKid?"#2d9e5f":"#b07800",fontWeight:"700",fontSize:"0.78rem",cursor:sharedToKid?"default":"pointer"}}>
                  {sharedToKid?"\u2b50 Added to Stars!":"\u2b50 Share to Stars"}
                </button>
                <button onClick={()=>{setPhase("capture");setResult(null);setImageData(null);setWsResult(null);setWsError(null);setSharedToKid(false);setSavedSubj(null);setShowSubjPicker(false);}}
                  style={{flex:1,padding:"0.7rem",border:"1.5px solid "+pal.stone+"50",borderRadius:"12px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                  {"\uD83D\uDD04 Study Again"}
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR STATES ── */}
          {phase==="result"&&result?._error==="nokey"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\uD83D\uDD11"}</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.35rem"}}>{"AI not set up yet"}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Add your Anthropic API key in Settings \u2192 AI to unlock Field Study and all AI features."}</div>
            </div>
          )}
          {phase==="result"&&result?._error==="fail"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"😔"}</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.5rem"}}>{"Couldn\u2019t analyze the photo"}</div>
              <button onClick={()=>setPhase("capture")} style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>{"Try Again"}</button>
            </div>
          )}

          {/* ── WORKSHEET ── */}
          {phase==="worksheet"&&wsResult&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.good}30`,display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"✅"}</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.good,fontSize:"0.82rem"}}>{wsResult.title||"Field Study Worksheet ready!"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>
                    {(wsResult.sections||[{items:wsResult.items||[]}]).reduce((sum,s)=>sum+(s.items||[]).length,0)+" items \u00b7 "+grade+" level"}
                  </div>
                </div>
              </div>
              {(wsResult.sections||[{items:wsResult.items||[]}]).slice(0,1).map((section,si)=>(
                <div key={si} style={{marginBottom:"1rem"}}>
                  {(section.items||[]).slice(0,3).map((item,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:"10px",padding:"0.6rem 0.8rem",marginBottom:"0.4rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                      <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5,flex:1}}>{item.content}</div>
                    </div>
                  ))}
                  {(section.items||[]).length>3&&<div style={{fontSize:"0.7rem",color:pal.slate,textAlign:"center",fontStyle:"italic"}}>{"+ "+(section.items||[]).length-3+" more items"}</div>}
                </div>
              ))}
            </div>
          )}

          {/* ── JOURNAL ── */}
          {phase==="journal"&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem",marginBottom:"0.25rem"}}>{"\uD83D\uDCD6 "+name+"\u2019s Field Journal"}</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"1rem"}}>{pastStudies.length+" discovery"+(pastStudies.length===1?"":"ies")+" recorded"}</div>
              {pastStudies.length===0?(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem",textAlign:"center",border:"1.5px solid "+pal.stone+"25"}}>
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\uD83D\uDD2D"}</div>
                  <div style={{fontSize:"0.8rem",color:pal.slate}}>{"No field studies yet \u2014 snap a photo to start the journal!"}</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                  {pastStudies.map((e,i)=>(
                    <div key={e.id||i} style={{background:"#fff",borderRadius:"14px",overflow:"hidden",border:"1.5px solid "+pal.stone+"25",display:"flex",gap:0}}>
                      {e.photos&&e.photos[0]&&(
                        <img src={e.photos[0]} alt="" style={{width:"80px",height:"80px",objectFit:"cover",flexShrink:0}}/>
                      )}
                      <div style={{flex:1,padding:"0.65rem 0.75rem",minWidth:0}}>
                        <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem",marginBottom:"2px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                          {(e.title||"").replace("\uD83D\uDD2D Field Study: ","")}
                        </div>
                        <div style={{fontSize:"0.68rem",color:pal.primary,fontWeight:"600",marginBottom:"2px"}}>{e.subj}</div>
                        <div style={{fontSize:"0.65rem",color:pal.slate}}>{e.date}</div>
                        {e.note&&<div style={{fontSize:"0.72rem",color:pal.inkM,marginTop:"4px",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",gap:"0.55rem"}}>
          {phase==="capture"&&(
            <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>{"Cancel"}</button>
          )}
          {phase==="result"&&!result?._error&&(
            <>
              <button onClick={()=>{setPhase("capture");setResult(null);setImageData(null);setSavedSubj(null);setSharedToKid(false);setShowSubjPicker(false);}}
                style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"← New"}</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"Done ✓"}</button>
            </>
          )}
          {(phase==="result"&&result?._error)&&(
            <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>{"Close"}</button>
          )}
          {phase==="worksheet"&&(
            <>
              <button onClick={()=>setPhase("result")} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"← Back"}</button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"\uD83D\uDDB8\uFE0F Print Worksheet"}</button>
            </>
          )}
          {phase==="journal"&&(
            <>
              <button onClick={()=>setPhase("capture")} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"← New Study"}</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"Done"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   AI LESSON PLANNER MODAL
   Parent inputs what they want to cover -> AI generates
   a day-by-day Mon-Fri plan per child
   ---------------------------------------------------------- */
function AILessonPlannerModal({ pal, family, activeChild, portfolioEntries=[], onClose }) {
  const [phase,    setPhase]    = useState("input");  // input|loading|result
  const [notes,    setNotes]    = useState("");
  const [selSubjs, setSelSubjs] = useState([]);
  const [selChild, setSelChild] = useState(
    activeChild ? family.children.findIndex(c=>c.id===activeChild.id) : 0
  );
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);
  const [saved,    setSaved]    = useState(false);

  const child = family.children[selChild] || family.children[0];
  const cp    = CHILD_COLOR_PALETTES.find(p=>p.id===(child?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const customSubjs = family.customSubjects||[];
  const allSubjMap  = Object.fromEntries([...SUBJECT_OPTIONS,...customSubjs].map(s=>[s.id,s]));
  const activeSubjs = (family.subjects||[]).map(id=>allSubjMap[id]).filter(Boolean);

  // Auto-pull recent notes for context
  const childIdx = family.children.findIndex(c=>c.id===child?.id);
  const recentNotes = portfolioEntries
    .filter(e=>e.childIdx===childIdx && !e.isDay && e.note && e.note.trim())
    .sort((a,b)=>(b.ts||0)-(a.ts||0))
    .slice(0,10)
    .map(e=>"["+e.subj+"] "+e.note.replace("AI Summary:","").trim())
    .join(". ");

  const toggleSubj = (id) => {
    setSelSubjs(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

  const generate = async () => {
    setPhase("loading"); setError(null); setResult(null);
    const subjectsToUse = selSubjs.length>0
      ? selSubjs.map(id=>allSubjMap[id]).filter(Boolean).map(s=>s.icon+" "+s.label)
      : activeSubjs.slice(0,5).map(s=>s.icon+" "+s.label);
    const goals    = goalSummary(family);
    const curriculum = curriculumContext(family);
    const grade    = child?.grade||"3rd";
    const name     = child?.name||"Student";

    const prompt = "You are an expert homeschool lesson planner. Create a practical, engaging weekly lesson plan.\n\n"
      + "Student: "+name+", "+grade+" grade\n"
      + "Subjects to cover this week: "+subjectsToUse.join(", ")+"\n"
      + "Curriculum approach: "+curriculum+"\n"
      + "Family goals: "+goals+"\n"
      + (notes.trim()?"Parent notes / what to focus on: "+notes.trim()+"\n":"")
      + (recentNotes?"Recent learning context: "+recentNotes.slice(0,400)+"\n":"")
      + "\nCreate a Mon-Fri lesson plan. For each day include 2-3 subjects with:\n"
      + "- A specific activity or lesson (not generic — name exact topics, books, or approaches)\n"
      + "- One question to ask the student during or after\n"
      + "- Time estimate in minutes\n\n"
      + "Also include:\n"
      + "- weeklyGoal: one sentence describing the week's learning arc\n"
      + "- parentTip: one practical tip for the parent this week\n"
      + "- strugglingNote: if recent notes suggest a struggle area, one sentence on how to address it (or null)\n\n"
      + "Respond ONLY with valid JSON (no markdown):\n"
      + '{"weeklyGoal":"...","parentTip":"...","strugglingNote":null,"days":['
      + '{"day":"Monday","lessons":[{"subj":"Math","activity":"...","question":"...","minutes":30},...]},'
      + '{"day":"Tuesday","lessons":[...]},'
      + '{"day":"Wednesday","lessons":[...]},'
      + '{"day":"Thursday","lessons":[...]},'
      + '{"day":"Friday","lessons":[...]}'
      + ']}';

    try {
      const raw   = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPhase("result");
    } catch(e) {
      setError(e.message==="NO_KEY"
        ? "Add your API key in Settings \u2192 AI to generate lesson plans."
        : "Couldn\u2019t generate right now. Try again or simplify your notes.");
      setPhase("input");
    }
  };

  const saveToPortfolio = () => {
    if(!result||saved) return;
    // Save as a special plan entry - parent can view in portfolio
    setSaved(true);
    try {
      const key = "rootbloom_weekplan_"+child.id+"_"+new Date().toISOString().slice(0,10);
      localStorage.setItem(key, JSON.stringify({result, child:child.name, grade:child.grade, created:Date.now()}));
    } catch(ex){}
  };

  const openPrint = () => {
    if(!result) return;
    const name = child?.name||"Student";
    const grade = child?.grade||"";
    const today = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const weekOf = (()=>{
      const d = new Date(); d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1));
      return d.toLocaleDateString("en-US",{month:"long",day:"numeric"});
    })();
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Weekly Lesson Plan</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,serif;font-size:12px;color:#1a1a1a;padding:0.6in 0.75in;max-width:8.5in;margin:0 auto}
h1{font-size:20px;font-weight:bold;margin-bottom:4px}
.meta{font-size:10px;color:#666;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid #1a1a1a}
.goal-box{background:#f0f4ff;border-left:4px solid #2563a8;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:14px}
.goal-label{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#2563a8;margin-bottom:3px}
.tip-box{background:#fffbeb;border:1.5px solid #f5c842;border-radius:8px;padding:8px 12px;margin-bottom:14px}
.struggle-box{background:#fff0f0;border:1.5px solid #ffaaaa;border-radius:8px;padding:8px 12px;margin-bottom:14px}
.day{margin-bottom:16px;break-inside:avoid}
.day-header{background:#1a1a1a;color:#fff;padding:4px 10px;border-radius:6px 6px 0 0;font-weight:bold;font-size:11px;text-transform:uppercase;letter-spacing:0.08em}
.day-body{border:1.5px solid #ddd;border-top:none;border-radius:0 0 6px 6px;overflow:hidden}
.lesson{padding:8px 10px;border-bottom:1px solid #f0f0f0}
.lesson:last-child{border-bottom:none}
.lesson-subj{font-weight:bold;font-size:11px;color:#333;margin-bottom:2px}
.lesson-act{font-size:11px;color:#1a1a1a;margin-bottom:3px;line-height:1.5}
.lesson-q{font-size:10px;color:#555;font-style:italic}
.lesson-min{font-size:9px;color:#aaa;float:right;margin-top:-2px}
.footer{margin-top:24px;padding-top:8px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:9px;color:#aaa}
@media print{button{display:none}}
</style></head><body>
<h1>Weekly Lesson Plan \u2014 ${name}</h1>
<div class="meta">${grade} \u00b7 Week of ${weekOf} \u00b7 ${today} \u00b7 Root & Bloom</div>
${result.weeklyGoal?`<div class="goal-box"><div class="goal-label">Weekly Goal</div><div>${result.weeklyGoal}</div></div>`:""}
${result.parentTip?`<div class="tip-box"><strong>\uD83D\uDCA1 Parent Tip:</strong> ${result.parentTip}</div>`:""}
${result.strugglingNote?`<div class="struggle-box"><strong>\uD83C\uDF31 Focus Area:</strong> ${result.strugglingNote}</div>`:""}
${(result.days||[]).map(d=>`
<div class="day">
  <div class="day-header">${d.day}</div>
  <div class="day-body">
    ${(d.lessons||[]).map(l=>`
    <div class="lesson">
      <div class="lesson-subj">${l.subj}<span class="lesson-min">${l.minutes} min</span></div>
      <div class="lesson-act">${l.activity}</div>
      <div class="lesson-q">\u2753 ${l.question}</div>
    </div>`).join("")}
  </div>
</div>`).join("")}
<div class="footer"><span>${family.schoolName||family.familyName+" Academy"}</span><span>Root & Bloom Homeschool App</span></div>
<div style="text-align:center;margin-top:16px"><button onclick="window.print()" style="padding:10px 28px;background:#1a1a1a;color:#fff;border:none;border-radius:8px;font-size:13px;cursor:pointer">\uD83D\uDDA8\uFE0F Print / Save PDF</button></div>
</body></html>`;
    const win = window.open("","_blank");
    if(!win) return;
    win.document.write(html);
    win.document.close();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.75)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -14px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.7rem 1.2rem 0.6rem",borderBottom:"1px solid "+pal.stone+"45",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"📅 Weekly Lesson Planner"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>
              {phase==="input"?"Tell me what to cover this week":phase==="loading"?"Building your plan\u2026":"Your week is planned!"}
            </div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0.9rem 1.2rem 0.5rem"}}>

          {/* ── INPUT PHASE ── */}
          {phase==="input"&&(
            <div>
              {/* Child selector */}
              {family.children.length>1&&(
                <div style={{marginBottom:"1rem"}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.45rem"}}>{"Planning for"}</div>
                  <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                    {family.children.map((c,i)=>{
                      const ccp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                      const sel=i===selChild;
                      return (
                        <button key={c.id} onClick={()=>setSelChild(i)}
                          style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.32rem 0.75rem",border:"2px solid "+(sel?ccp.c1:pal.stone+"40"),borderRadius:"20px",background:sel?ccp.c1+"18":"transparent",cursor:"pointer"}}>
                          <span>{c.avatar}</span>
                          <span style={{fontSize:"0.76rem",fontWeight:sel?"800":"500",color:sel?ccp.c1:pal.inkM}}>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subject picker */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.45rem"}}>
                  {"Subjects to include "}<span style={{fontWeight:"400",textTransform:"none",fontSize:"0.7rem"}}>{selSubjs.length===0?"(all active subjects)":"("+selSubjs.length+" selected)"}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                  {activeSubjs.map(s=>{
                    const sel=selSubjs.includes(s.id);
                    return (
                      <button key={s.id} onClick={()=>toggleSubj(s.id)}
                        style={{display:"flex",alignItems:"center",gap:"0.25rem",padding:"0.28rem 0.6rem",border:"2px solid "+(sel?pal.primary:pal.stone+"40"),borderRadius:"20px",background:sel?pal.pale:"transparent",cursor:"pointer"}}>
                        <span style={{fontSize:"0.85rem"}}>{s.icon}</span>
                        <span style={{fontSize:"0.72rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM}}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div style={{marginBottom:"0.85rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.45rem"}}>{"What do you want to cover? (optional)"}</div>
                <textarea
                  value={notes}
                  onChange={e=>setNotes(e.target.value)}
                  placeholder={"e.g. We\u2019re starting long division this week. Reading Charlotte\u2019s Web ch.4-6. Review the American Revolution. Raeley needs more handwriting practice."}
                  rows={4}
                  style={{width:"100%",padding:"0.65rem 0.85rem",border:"2px solid "+pal.stone,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.6}}
                  onFocus={e=>e.target.style.borderColor=pal.primary}
                  onBlur={e=>e.target.style.borderColor=pal.stone}
                  autoFocus
                />
                {recentNotes&&(
                  <div style={{fontSize:"0.68rem",color:pal.primary,marginTop:"0.3rem",fontWeight:"600"}}>
                    {"\u2728 Auto-including recent lesson context for "+child?.name}
                  </div>
                )}
              </div>
              {error&&<div style={{padding:"0.7rem",background:"#fff0f0",borderRadius:"10px",fontSize:"0.78rem",color:"#a03030",marginBottom:"0.5rem"}}>{error}</div>}
            </div>
          )}

          {/* ── LOADING PHASE ── */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"2.5rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem",animation:"pulse 1.2s ease infinite"}}>{"📅"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{"Building your week\u2026"}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,maxWidth:"260px",margin:"0 auto"}}>
                {"Creating specific daily lessons, questions to ask, and parent tips for "+child?.name+"."}
              </div>
            </div>
          )}

          {/* ── RESULT PHASE ── */}
          {phase==="result"&&result&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>

              {/* Weekly goal */}
              {result.weeklyGoal&&(
                <div style={{background:"#f0f4ff",borderLeft:"4px solid #2563a8",borderRadius:"0 11px 11px 0",padding:"0.65rem 0.9rem",marginBottom:"0.75rem"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"700",color:"#2563a8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"Weekly Goal"}</div>
                  <div style={{fontSize:"0.82rem",color:"#1a3a6e",lineHeight:1.5}}>{result.weeklyGoal}</div>
                </div>
              )}

              {/* Parent tip */}
              {result.parentTip&&(
                <div style={{background:"#fffbeb",border:"1.5px solid #f5c84240",borderRadius:"11px",padding:"0.6rem 0.9rem",marginBottom:"0.75rem",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <span style={{fontSize:"1rem",flexShrink:0}}>{"💡"}</span>
                  <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{result.parentTip}</div>
                </div>
              )}

              {/* Struggling note */}
              {result.strugglingNote&&(
                <div style={{background:"#fff8e6",border:"1.5px solid #f5c84250",borderRadius:"11px",padding:"0.6rem 0.9rem",marginBottom:"0.75rem",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <span style={{fontSize:"1rem",flexShrink:0}}>{"🌱"}</span>
                  <div style={{fontSize:"0.78rem",color:"#7a5500",lineHeight:1.5}}>{result.strugglingNote}</div>
                </div>
              )}

              {/* Daily plan */}
              {(result.days||[]).map((d,di)=>(
                <div key={di} style={{marginBottom:"0.75rem",borderRadius:"13px",overflow:"hidden",border:"1.5px solid "+pal.stone+"25"}}>
                  <div style={{background:cp.c1,padding:"0.45rem 0.85rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:"800",color:"#fff",fontSize:"0.8rem"}}>{d.day}</span>
                    <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.8)"}}>
                      {(d.lessons||[]).reduce((s,l)=>s+(l.minutes||0),0)+" min total"}
                    </span>
                  </div>
                  {(d.lessons||[]).map((l,li)=>(
                    <div key={li} style={{padding:"0.6rem 0.85rem",background:li%2===0?"#fff":pal.linen,borderTop:li>0?"1px solid "+pal.stone+"15":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.2rem"}}>
                        <span style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>{l.subj}</span>
                        <span style={{fontSize:"0.65rem",color:pal.slate}}>{l.minutes+" min"}</span>
                      </div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5,marginBottom:"0.25rem"}}>{l.activity}</div>
                      <div style={{fontSize:"0.72rem",color:pal.primary,fontStyle:"italic"}}>{"❓ "+l.question}</div>
                    </div>
                  ))}
                </div>
              ))}

            </div>
          )}

        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:"1px solid "+pal.stone+"45",display:"flex",gap:"0.5rem",flexShrink:0}}>
          {phase==="input"&&(
            <>
              <button onClick={onClose} style={{padding:"0.7rem 1rem",border:"2px solid "+pal.stone,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>{"Cancel"}</button>
              <button onClick={generate}
                style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                {"📅 Plan My Week"}
              </button>
            </>
          )}
          {phase==="result"&&result&&(
            <>
              <button onClick={()=>{setResult(null);setPhase("input");setSaved(false);}} style={{padding:"0.7rem 0.85rem",border:"2px solid "+pal.stone,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.8rem"}}>{"New"}</button>
              <button onClick={saveToPortfolio} disabled={saved}
                style={{padding:"0.7rem 0.85rem",border:"2px solid "+(saved?pal.good:pal.primary),borderRadius:"12px",background:saved?pal.goodBg:"transparent",color:saved?pal.good:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:saved?"default":"pointer"}}>
                {saved?"\u2713 Saved":"Save"}
              </button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                {"\uD83D\uDDA8\uFE0F Print Plan"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   GENERATE STRUGGLE REPORT
   Extracted from ProgressScreen Grades tab IIFE.
   Call: generateStruggleReport(weakRows, childName, setters)
   weakRows: [{subj, totalScore, totalPoss, quizzes, missed}]
   setters: {setLoading, setError, setResult}
   ---------------------------------------------------------- */
async function generateStruggleReport(weakRows, childName, setters) {
  const { setLoading, setError, setResult } = setters;
  if(!weakRows||weakRows.length===0) return;
  setLoading(true); setError(null); setResult(null);
  const lines = weakRows.map(r=>{
    const pct = Math.round((r.totalScore/r.totalPoss)*100);
    return r.subj+" ("+pct+"% avg across "+r.quizzes.length+" quiz"+(r.quizzes.length===1?"":"zes")+"). Missed topics: "+(r.missed.slice(0,5).join(", ")||"various");
  }).join("\n");
  const cname = childName||"this child";
  const prompt = "You are a warm, experienced homeschool coach. A parent has shared quiz data showing that "+cname+" is struggling in the following subjects:\n\n"+lines+"\n\nWrite a short, warm, practical note for the parent. Cover:\n1. One sentence acknowledging the struggle without alarm.\n2. One concrete suggestion per weak subject (specific teaching approach, game, resource, or activity).\n3. One encouraging closing sentence.\nPlain text only. No markdown, no bullet points, no headers. Under 120 words total.";
  try {
    const result = await callClaude(prompt);
    setResult(result.trim());
  } catch(err) {
    setError(err.message==="NO_KEY"?"no_key":"error");
  }
  setLoading(false);
}


/* ----------------------------------------------------------
   BLOOM TUTOR  (called from StudentPortal)
   ---------------------------------------------------------- */
async function bloomChat({question, history=[], child, family, hintMode=false}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");

  const gradeRaw = child.grade||"3rd";
  const gradeN   = parseInt((gradeRaw.match(/\d+/)||["3"])[0])||3;
  const tone     = gradeN<=2 ? "very simple words, short sentences, like talking to a 6-year-old"
                 : gradeN<=5 ? "friendly and clear, like talking to a curious 9-year-old"
                 : gradeN<=8 ? "conversational and engaging, like talking to a 12-year-old"
                 :             "thoughtful and detailed, like talking to a 16-year-old";
  const imgStyle = gradeN<=4 ? "colorful cartoon illustration or friendly diagram"
                 : gradeN<=8 ? "labeled educational diagram or real photograph"
                 :             "real photograph or detailed scientific diagram";
  const allSubjOpts = [...(SUBJECT_OPTIONS||[]),...(family.customSubjects||[])];
  const subjLabels  = (family.subjects||[]).map(id=>allSubjOpts.find(s=>s.id===id)).filter(Boolean).map(s=>s.label);
  const subjList    = subjLabels.join(", ")||"general subjects";
  const curriculum  = curriculumContext(family);
  const systemPrompt =
`You are Bloom, a warm homeschool tutor for ${child.name}, a ${gradeRaw} student. Only help with school subjects.
Grade: ${gradeRaw} | Subjects: ${subjList} | Approach: ${curriculum}
Hint mode: ${hintMode?"ON — guide with questions, never give full answers":"OFF — explain fully and clearly"}
Tone: ${tone}. Be warm, enthusiastic, encouraging. Use simple analogies.
SAFETY: Only answer about school subjects. If off-topic say: "That's outside my garden! Ask me about ${subjList} 🌱"
Never share personal info, links, or age-inappropriate content.
IMAGE: If a visual helps, end with exactly: IMAGE_REQUEST: [specific ${imgStyle} showing: topic]`;

  const msgs = [...history.slice(-8), {role:"user", content:question}];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:1000, system:systemPrompt, messages:msgs})
  });
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  let rawText = data.content?.map(b=>b.text||"").join("")||"";
  let imgUrl=null, imgAlt=null;
  const imgMatch = rawText.match(/IMAGE_REQUEST:\s*(.+)$/m);
  if(imgMatch) {
    rawText = rawText.replace(/IMAGE_REQUEST:\s*.+$/m,"").trim();
    imgAlt  = imgMatch[1].trim();
    try {
      const sr = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Find one educational image URL for a ${gradeRaw} student: ${imgAlt}. Return ONLY the direct image URL (.jpg .png .gif .webp .svg). No explanation.`}]
        })
      });
      const sd=await sr.json();
      const st=sd.content?.map(b=>b.text||"").join("")||"";
      const um=st.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg)[^\s"'<>]*/i);
      if(um) imgUrl=um[0];
    } catch(e){}
  }
  return {text:rawText, imgUrl, imgAlt};
}

/* ----------------------------------------------------------
   PORTFOLIO NARRATOR  (called from PortfolioScreen)
   ---------------------------------------------------------- */
async function generatePortfolioNarrative({child, entries, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const recent = entries.filter(e=>!e.isDay&&e.subj!=="Daily Note").slice(0,30);
  const bySubj = {};
  recent.forEach(e=>{ if(!bySubj[e.subj]) bySubj[e.subj]=[]; bySubj[e.subj].push(e.note||e.title||e.subj); });
  const summary = Object.entries(bySubj).map(([s,ns])=>s+": "+ns.slice(0,3).join("; ")).join("\n");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:
`Write a warm, professional 3-4 paragraph portfolio narrative for ${child.name} (${child.grade}).
Curriculum: ${curriculumContext(family)}
Recent learning:\n${summary||"No entries yet"}
Third person. No bullets. Sound like a caring teacher who knows this child well.`}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   GOAL SUGGESTIONS  (called from GoalsScreen)
   ---------------------------------------------------------- */
async function getGoalSuggestions(family) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const allGoalObjs = [...(GOALS||[]),...(family.customGoals||[])];
  const activeGoals = (family.goals||[]).map(id=>allGoalObjs.find(x=>x.id===id)).filter(Boolean);
  const prompt =
`Homeschool family: ${(family.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ")||"not specified"}
Approach: ${curriculumContext(family)} | State: ${family.state||"?"} | Current goals: ${activeGoals.map(g=>g.label).join(", ")||"none"}
Suggest 6 meaningful learning goals (mix academic, life skills, character). Each under 10 words.
Respond ONLY with a JSON array of 6 strings. No markdown.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  const raw=data.content?.map(b=>b.text||"").join("")||"[]";
  const arr=JSON.parse(raw.replace(/```json|```/g,"").trim());
  return Array.isArray(arr)?arr.slice(0,6):[];
}

/* ----------------------------------------------------------
   CURRICULUM ADVISOR  (called from LearnScreen)
   ---------------------------------------------------------- */
async function getCurriculumAdvice({messages, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const system =
`You are a warm, experienced homeschool curriculum advisor.
Family: ${(family.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ")} | Approach: ${curriculumContext(family)} | State: ${family.state||"?"}
Give practical, specific, encouraging advice. Concise and actionable.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:700,system,messages})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   TOMORROW'S LESSON  (called from EntryDetailModal)
   ---------------------------------------------------------- */
async function buildTomorrowsLesson({entry, child, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const prompt =
`Create a specific engaging follow-up lesson for tomorrow based on what ${child?.name||"the student"} did in ${entry.subj} ("${entry.note||entry.title||entry.subj}").
Student: ${child?.name}, ${child?.grade} | Approach: ${curriculumContext(family)}
Include: activity title, materials needed, step-by-step instructions, extension idea. Practical and fun.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   GAP ACTIVITY IDEAS  (called from HomeScreen gap card)
   ---------------------------------------------------------- */
async function getGapActivityIdeas({subjectLabel, child, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:
`Suggest 3 quick fun hands-on activities (15-30 min each) for a ${child?.grade||"elementary"} student to re-engage with ${subjectLabel}. Fun name, materials, steps. Exciting for a child.`}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}
