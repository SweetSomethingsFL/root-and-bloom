/* ============================================================
   ROOT & BLOOM -- AI FEATURES
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

  // Build content -- support optional image
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

  return `You are an expert homeschool curriculum designer creating a professional, print-ready worksheet.\n\nSTUDENT: ${name}, ${grade} grade\nSCHOOL: ${schoolName}\nWORKSHEET TYPE: ${wsType}\nTOPIC: ${topic}\nCURRICULUM CONTEXT: ${curriculum}${goalInfluence}\n${extraContext ? "ADDITIONAL CONTEXT (what was actually taught): " + extraContext : ""}\n\nGRADE REQUIREMENTS: ${gradeInstructions}\n${diffInstructions}\nTYPE REQUIREMENTS: ${typeInstructions}\n\nSTRUCTURE: Your worksheet MUST include all four of these sections:\n1. learningObjective: one clear, specific sentence starting with "Students will be able to..."\n2. warmUp: one engaging starter question or quick activity (1-2 sentences, answered verbally or in 1 line)\n3. sections[]: the main worksheet content (see type requirements above)\n4. extension: one "Going Deeper" challenge for fast finishers (more open-ended, higher thinking)\n\nFORMATTING RULES:\n- Every fill-in item needs a clear blank marker (___)\n- Multiple choice items need exactly 4 options (A, B, C, D) with one correct answer\n- For grades K-2, ALWAYS include a word bank for fill-in items\n- For matching items, include leftCol (terms) and rightCol (definitions) arrays of equal length\n- Make items directly test or reinforce the SPECIFIC topic covered\n- Items should feel like a real teacher made them -- specific, purposeful, interesting\n\nRespond with ONLY valid JSON (no markdown, no backticks):\n{\n  "title": "engaging worksheet title (max 8 words)",\n  "subject": "subject area",\n  "grade": "${grade}",\n  "schoolName": "${schoolName}",\n  "learningObjective": "Students will be able to ...",\n  "warmUp": "starter question or activity for the student",\n  "instructions": "one clear, friendly instruction sentence for the main section",\n  "wordBank": ["word1", "word2"],\n  "sections": [\n    {\n      "title": "section heading (e.g. Part A: Recall, Part B: Vocabulary)",\n      "items": [\n        {\n          "type": "fillin|mc|copywork|shortanswer|matching|tracing",\n          "content": "the question or prompt text",\n          "options": ["A option", "B option", "C option", "D option"],\n          "answer": "correct answer",\n          "lines": 2,\n          "leftCol": [],\n          "rightCol": []\n        }\n      ]\n    }\n  ],\n  "extension": "Going Deeper challenge for fast finishers",\n  "bonusChallenge": "one creative bonus challenge"\n}`;
}

/* ----------------------------------------------------------
   AI WORKSHEET MODAL -- Chalkie-level rebuild
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
    .map(e=>e.subj+(e.note?" -- "+e.note.replace("AI Summary:","").trim():""))
    .join(". ");

  React.useEffect(()=>{
    if(todayNotes && !lessonNote) setLessonNote(todayNotes);
  },[todayNotes]);

  const WS_TYPE_OPTIONS = [
    {id:"Mixed",             icon:"\u2728", label:"Mixed",             desc:"Best variety -- MC, fill-in, short answer"},
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
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"x"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0.9rem 1.2rem 0.5rem"}}>

          {/* -- CONFIG PHASE -- */}
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

          {/* -- LOADING PHASE -- */}
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

          {/* -- RESULT PHASE -- */}
          {phase==="result"&&result&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>

              {/* Success header */}
              <div style={{background:pal.goodBg,borderRadius:"13px",padding:"0.75rem 0.95rem",marginBottom:"1rem",border:"1.5px solid "+pal.good+"30",display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"[ok]"}</span>
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
          {step!==2&&<button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"x"}</button>}
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
                  {w.resources&&<div style={{marginTop:"0.5rem",fontSize:"0.72rem",color:pal.slate,fontStyle:"italic"}}>[book] {w.resources}</div>}
                </div>
              ))}

              {/* Assessment ideas */}
              {result.assessmentIdeas&&result.assessmentIdeas.length>0&&(
                <div style={{background:pal.pale,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}20`}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.45rem"}}>Assessment Ideas</div>
                  {result.assessmentIdeas.map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",marginBottom:"0.28rem"}}>
                      <span style={{fontSize:"0.8rem",flexShrink:0}}>[idea]</span>
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
                {"Next ->"}
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
