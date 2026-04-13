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

function buildWorksheetPrompt(wsType, topic, child, family, extraContext) {
  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";
  const goals    = goalSummary(family);
  const curriculum = curriculumContext(family);
  const schoolName = family?.schoolName || (family?.familyName ? family.familyName + " Academy" : "Ramos Academy");

  // Grade-specific instructions
  const gradeInstructions = gradeNum <= 2
    ? `K-2nd grade (${name} is ${gradeNum <= 1 ? "5-6" : "6-7"} years old). Use VERY simple words. Short sentences. Large clear text. Focus on recognition and tracing. Favor fill-in-the-blank with word banks, matching, and copywork. No more than 6 items.`
    : gradeNum <= 5
    ? `3rd-5th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). Mix of multiple choice, fill-in-the-blank, and short answer. Use clear, engaging language. 8-10 items is ideal.`
    : gradeNum <= 8
    ? `6th-8th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). Include analysis and application questions. Mix of formats. 8-12 items. Some questions should require multi-sentence responses.`
    : `9th-12th grade (${name} is ${gradeNum+5}-${gradeNum+6} years old). College-preparatory level. Include critical thinking, analysis, and synthesis. Mix of objective and essay questions. 10-15 items.`;

  // Type-specific instructions
  const typeInstructions = {
    "Copywork":       "Create beautiful, meaningful sentences or passages for the student to copy. Choose sentences that match the topic and are worth memorizing. Include 4-6 items. Each should be a complete, well-crafted sentence.",
    "Narration":      "Create open-ended prompts that ask the student to explain, describe, or retell in their own words. Include story starters or guiding questions. 4-5 prompts with generous answer space.",
    "Spelling":       "Create 8-10 spelling words related to the topic. For each word: show the word, provide a definition, and a fill-in sentence. Include a word bank.",
    "Math Practice":  "Create math problems appropriate for the grade level on the given topic. Include worked examples for the first problem type. Mix difficulty levels. Show your work sections.",
    "Reading Quiz":   "Create comprehension questions: recall, inference, vocabulary, and a short response question. Include a brief passage if appropriate for the grade level.",
    "Vocabulary":     "Create vocabulary activities: matching definitions, fill-in-the-blank sentences using context, and a short writing prompt using at least 3 vocabulary words.",
    "Science":        "Create a science worksheet with: key concepts, diagram labeling (described in text), observation/experiment record space, and analysis questions.",
    "History":        "Create a history worksheet with: timeline events, cause-and-effect questions, primary source analysis prompt, and a reflection question.",
    "Custom Worksheet": "Create a comprehensive, well-structured worksheet perfectly tailored to the topic and grade level.",
  }[wsType] || "Create a well-structured, engaging worksheet perfectly suited to the topic and grade level.";

  const goalInfluence = goals !== "General homeschool education"
    ? `\nFamily learning goals: ${goals}. Weave these naturally into examples and scenarios where it fits (e.g., if Faith & Character is a goal, use character-building examples; if Nature & Outdoors, use nature-based contexts; if Strong Readers, use rich vocabulary).`
    : "";

  return `You are an expert homeschool curriculum designer creating a professional, print-ready worksheet.

STUDENT: ${name}, ${grade} grade
SCHOOL: ${schoolName}
WORKSHEET TYPE: ${wsType}
TOPIC: ${topic}
CURRICULUM CONTEXT: ${curriculum}${goalInfluence}
${extraContext ? "ADDITIONAL CONTEXT: " + extraContext : ""}

GRADE REQUIREMENTS: ${gradeInstructions}

TYPE REQUIREMENTS: ${typeInstructions}

CRITICAL FORMATTING RULES:
- Generate items that are complete, clear, and self-contained
- Every fill-in item needs a clear blank marker (___) 
- Multiple choice items need exactly 4 options (A, B, C, D) with one correct answer
- Tracing/copywork items should have the text to copy in the "content" field
- For grades K-2, use a word bank for any fill-in-the-blank items
- For matching items, include leftCol (terms) and rightCol (definitions/matches) arrays
- Make items directly test or reinforce the SPECIFIC topic, not general knowledge
- The bonus challenge should be creative and slightly harder than the main items

Respond with ONLY valid JSON (no markdown, no backticks, no explanation):
{
  "title": "engaging worksheet title (max 8 words)",
  "subject": "subject area",
  "grade": "${grade}",
  "schoolName": "${schoolName}",
  "instructions": "one clear, friendly instruction sentence",
  "wordBank": ["word1", "word2"],  // only for grades K-5 with fill-in items, else []
  "sections": [
    {
      "title": "",  // optional section heading, can be empty string
      "items": [
        {
          "type": "fillin|mc|copywork|tracing|matching|coloring|shortanswer",
          "content": "the question or prompt text",
          "options": ["A option", "B option", "C option", "D option"],  // mc only
          "answer": "correct answer",  // mc and fillin
          "lines": 2,  // number of answer lines for shortanswer (1-6)
          "leftCol": [],  // matching only: terms
          "rightCol": []  // matching only: matches
        }
      ]
    }
  ],
  "bonusChallenge": "one engaging bonus challenge"
}`;
}

/* ----------------------------------------------------------
   AI WORKSHEET MODAL (rebuilt)
   ---------------------------------------------------------- */
function AIWorksheetModal({ pal, family, activeChild, wsType, onClose }) {
  const [topic,   setTopic]   = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [preview, setPreview] = useState(false);

  const isCustom = wsType==="custom";
  const ws = isCustom ? {id:"custom", label:"Custom Worksheet", icon:"📝"} : wsType;
  const child = activeChild;
  const grade = child?.grade || "3rd";

  const generate = async () => {
    if(!topic.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const prompt = buildWorksheetPrompt(ws.label, topic, child, family);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch(e) {
      if(e.message==="NO_KEY") setError("Add your Anthropic API key in Settings → AI to generate worksheets.");
      else setError("Couldn't generate worksheet right now. Try a simpler topic or check your connection.");
    }
    setLoading(false);
  };

  const openPrint = () => {
    if(!result) return;
    const html = buildWorksheetHTML(result, child, grade, ws.label);
    const win  = window.open("", "_blank");
    if(!win) return;
    win.document.write(html);
    win.document.close();
  };

  const TOPIC_PLACEHOLDERS = {
    "Copywork":       "e.g. Quotes about kindness, Psalm 23, The Preamble",
    "Narration":      "e.g. What we read in Charlotte's Web today",
    "Spelling":       "e.g. Short vowel words, -tion suffix words, Week 12",
    "Math Practice":  "e.g. Adding fractions with unlike denominators",
    "Reading Quiz":   "e.g. Charlotte's Web Chapter 5, today's reading",
    "Vocabulary":     "e.g. Greek and Latin roots: bio, geo, graph",
    "Science":        "e.g. The water cycle, photosynthesis, plant cells",
    "History":        "e.g. The American Revolution causes, Ancient Rome",
    "Custom Worksheet":"e.g. CH and SH blending sounds for 1st grade",
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
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{ws.icon} {ws.label}</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>{child?.name||"Student"} · {grade} · AI-generated</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>

          {/* Input */}
          {!result&&!loading&&(
            <>
              <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.7,marginBottom:"0.75rem"}}>
                {"Describe what you worked on today or want to practice. The more specific, the better the worksheet."}
              </div>
              <Lbl pal={pal}>What topic or lesson?</Lbl>
              <textarea
                value={topic}
                onChange={e=>setTopic(e.target.value)}
                placeholder={TOPIC_PLACEHOLDERS[ws.label]||"e.g. What we covered today in "+ws.label}
                rows={3}
                style={{width:"100%",padding:"0.7rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.84rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.6,marginBottom:"0.75rem"}}
                onFocus={e=>e.target.style.borderColor=pal.primary}
                onBlur={e=>e.target.style.borderColor=pal.stone}
                autoFocus
              />
              <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.5rem",fontStyle:"italic"}}>
                {"💡 Tip: Include specifics like \"CH and SH blending sounds\" rather than just \"phonics\" for a better worksheet."}
              </div>
              {error&&<div style={{marginTop:"0.65rem",padding:"0.7rem",background:"#fff0f0",borderRadius:"10px",fontSize:"0.78rem",color:"#a03030"}}>{error}</div>}
            </>
          )}

          {/* Loading */}
          {loading&&(
            <div style={{textAlign:"center",padding:"2.5rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem",animation:"pulse 1.2s ease infinite"}}>{ws.icon||"📝"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{"Building your worksheet..."}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65}}>
                {"Claude is creating grade-appropriate questions based on your exact topic. Takes about 10 seconds."}
              </div>
            </div>
          )}

          {/* Preview */}
          {result&&!loading&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {/* Success header */}
              <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.good}30`,display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"✅"}</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.good,fontSize:"0.82rem"}}>{result.title||"Worksheet ready!"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>
                    {(result.sections||[{items:result.items||[]}]).reduce((sum,s)=>sum+(s.items||[]).length,0)} items · {grade} level · Tap Print to open
                  </div>
                </div>
              </div>

              {/* Quick preview of items */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.07em"}}>{"Preview"}</div>
                {(result.sections||[{items:result.items||[]}]).slice(0,1).map((section,si)=>(
                  <div key={si}>
                    {(section.items||[]).slice(0,3).map((item,i)=>(
                      <div key={i} style={{background:"#fff",borderRadius:"10px",padding:"0.6rem 0.8rem",marginBottom:"0.4rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                        <div style={{width:"20px",height:"20px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                        <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5,flex:1}}>{item.content}</div>
                        <span style={{fontSize:"0.6rem",color:pal.stone,flexShrink:0,textTransform:"uppercase"}}>{item.type}</span>
                      </div>
                    ))}
                    {(section.items||[]).length>3&&(
                      <div style={{fontSize:"0.7rem",color:pal.slate,textAlign:"center",fontStyle:"italic"}}>
                        {`+ ${(section.items||[]).length-3} more items`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {result.wordBank&&result.wordBank.length>0&&(
                <div style={{background:pal.pale,borderRadius:"10px",padding:"0.55rem 0.8rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.primary}20`}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>Word Bank</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    {result.wordBank.map((w,i)=>(<span key={i} style={{fontSize:"0.75rem",color:pal.inkM,padding:"0.1rem 0.5rem",background:"#fff",borderRadius:"4px",border:`1px solid ${pal.stone}40`}}>{w}</span>))}
                  </div>
                </div>
              )}

              {result.bonusChallenge&&(
                <div style={{background:"#fffbeb",borderRadius:"10px",padding:"0.55rem 0.8rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.25rem"}}>⭐ Bonus</div>
                  <div style={{fontSize:"0.75rem",color:pal.inkM}}>{result.bonusChallenge}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          {!result&&!loading&&(
            <>
              <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
              <button onClick={generate} disabled={!topic.trim()} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:topic.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:topic.trim()?"pointer":"not-allowed"}}>
                🪄 Generate Worksheet
              </button>
            </>
          )}
          {result&&!loading&&(
            <>
              <button onClick={()=>{setResult(null);setTopic("");}} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>← New</button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                🖨️ Print Worksheet
              </button>
            </>
          )}
        </div>
      </div>
  );
}

/* ----------------------------------------------------------
   AI UNIT BUILDER MODAL (moved from index.html, prompts improved)
   ---------------------------------------------------------- */
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
  const [phase,      setPhase]     = useState("capture"); // capture|loading|result|worksheet
  const [imageData,  setImageData] = useState(null); // base64 string
  const [imageMime,  setImageMime] = useState("image/jpeg");
  const [result,     setResult]    = useState(null);
  const [wsResult,   setWsResult]  = useState(null);
  const [wsLoading,  setWsLoading] = useState(false);
  const [wsError,    setWsError]   = useState(null);
  const fileRef  = useRef(null);
  const camRef   = useRef(null);

  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";

  const analyzeImage = async (base64, mime) => {
    setImageData(base64);
    setImageMime(mime);
    setPhase("loading");

    const gradeDesc = gradeNum <= 2 ? "K-2nd grade, very simple, fun language, short sentences"
      : gradeNum <= 5 ? "3rd-5th grade, engaging and curious tone"
      : gradeNum <= 8 ? "6th-8th grade, scientific and analytical"
      : "9th-12th grade, college-prep depth";

    const prompt = `You are an enthusiastic nature and science educator helping a homeschool family.
Look at this photo and identify what's in it — plants, animals, rocks, insects, objects, or scenes.

Student: ${name}, ${grade} (${gradeDesc})
Family goals: ${goalSummary(family)}

Respond ONLY with valid JSON:
{
  "subject": "what you see (e.g. 'Oak tree leaves', 'Monarch butterfly', 'Quartz crystal')",
  "category": "plant|animal|insect|rock|weather|place|object|other",
  "confidence": "high|medium|low",
  "funFacts": [
    "fun fact 1 written for this grade level",
    "fun fact 2",
    "fun fact 3",
    "fun fact 4",
    "fun fact 5"
  ],
  "miniLesson": {
    "title": "Mini Lesson title (5-8 words)",
    "introduction": "1-2 engaging sentences introducing the subject at grade level",
    "keyPoints": [
      "key point 1 — a concept worth learning",
      "key point 2",
      "key point 3"
    ],
    "activity": "One hands-on activity the student can do right now based on what they see",
    "discussion": "One thought-provoking question to spark conversation",
    "vocabulary": ["word1", "word2", "word3"]
  },
  "subjects": ["list of school subjects this connects to, e.g. Biology, Earth Science, Art, Writing"]
}`;

    try {
      const raw    = await callClaude(prompt, base64, mime);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPhase("result");

      // Auto-save as portfolio entry
      if(onAddEntry && child) {
        const childIdx = family.children.findIndex(c=>c.id===child.id);
        if(childIdx >= 0) {
          onAddEntry({
            childIdx,
            subj: parsed.subjects?.[0] || "Science",
            title: "🔭 Field Study: " + parsed.subject,
            note: "Identified: " + parsed.subject + ". " + (parsed.funFacts?.[0]||""),
            thumb: parsed.category==="plant"?"🌿":parsed.category==="animal"?"🦋":parsed.category==="insect"?"🐛":parsed.category==="rock"?"🪨":"🔭",
            date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
            photos: [base64],
            selfLogged: false,
            isFieldStudy: true,
          });
        }
      }
    } catch(e) {
      if(e.message==="NO_KEY") {
        setResult({_error:"nokey"});
      } else {
        setResult({_error:"fail"});
      }
      setPhase("result");
    }
  };

  const handleFile = (e, fromCamera) => {
    const file = e.target.files[0];
    if(!file) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      const base64  = dataUrl.split(",")[1];
      analyzeImage(base64, mime);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const generateWorksheet = async () => {
    if(!result || result._error) return;
    setWsLoading(true); setWsError(null);
    try {
      const extraCtx = `Based on a field observation of: ${result.subject}. Key vocabulary: ${(result.miniLesson?.vocabulary||[]).join(", ")}. Key concepts: ${(result.miniLesson?.keyPoints||[]).join("; ")}`;
      const prompt = buildWorksheetPrompt("Science", result.subject + " — Field Study", child, family, extraCtx);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      setWsResult(JSON.parse(clean));
      setPhase("worksheet");
    } catch(e) {
      setWsError("Couldn't generate worksheet right now.");
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

  const CATEGORY_ICONS = { plant:"🌿", animal:"🦋", insect:"🐛", rock:"🪨", weather:"⛅", place:"📍", object:"🔍", other:"🔭" };

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
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>🔭 Field Study</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>Snap a photo · Get facts · Build a lesson</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {/* Capture phase */}
          {phase==="capture"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"4rem",marginBottom:"0.75rem",animation:"bounce 2s ease infinite"}}>📸</div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem",marginBottom:"0.35rem"}}>What did you find?</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,marginBottom:"1.5rem",maxWidth:"280px",margin:"0 auto 1.5rem"}}>
                {`Snap a photo of a plant, animal, rock, or anything interesting. Claude will identify it and build a mini lesson for ${name}!`}
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleFile(e,true)}/>
              <input ref={fileRef} type="file" accept="image/*" multiple={false} style={{display:"none"}} onChange={e=>handleFile(e,false)}/>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"280px",margin:"0 auto"}}>
                <button onClick={()=>camRef.current?.click()}
                  style={{padding:"0.9rem",border:"none",borderRadius:"16px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:`0 4px 18px ${pal.accent}40`}}>
                  <span>📷</span><span>Take a Photo</span>
                </button>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
                  <span>🖼️</span><span>Choose from Library</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"1.5rem 0"}}>
              {imageData&&<img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>}
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem",animation:"pulse 1.2s ease infinite"}}>🔭</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Identifying what you found..."}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Claude is looking at your photo and building a mini lesson. Takes about 15 seconds."}</div>
            </div>
          )}

          {/* Result */}
          {phase==="result"&&result&&!result._error&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              {/* Photo */}
              {imageData&&(
                <img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>
              )}

              {/* Subject card */}
              <div style={{background:pal.pale,borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}25`}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.8rem"}}>{CATEGORY_ICONS[result.category]||"🔭"}</span>
                  <div>
                    <div style={{fontWeight:"900",color:pal.primary,fontSize:"1rem"}}>{result.subject}</div>
                    <div style={{fontSize:"0.65rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em"}}>{result.category} · {result.confidence} confidence</div>
                  </div>
                </div>
                {(result.subjects||[]).length>0&&(
                  <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap"}}>
                    {result.subjects.map((s,i)=>(
                      <span key={i} style={{fontSize:"0.65rem",padding:"0.1rem 0.5rem",background:pal.primary+"18",borderRadius:"20px",color:pal.primary,fontWeight:"700"}}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Fun facts */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.55rem"}}>🌟 Fun Facts</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                  {(result.funFacts||[]).map((fact,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:"12px",padding:"0.6rem 0.8rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <span style={{fontSize:"0.85rem",flexShrink:0}}>{"✦"}</span>
                      <span style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.55}}>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini lesson */}
              {result.miniLesson&&(
                <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>📖 {result.miniLesson.title}</div>
                  <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.65rem"}}>{result.miniLesson.introduction}</div>

                  {(result.miniLesson.keyPoints||[]).length>0&&(
                    <div style={{marginBottom:"0.65rem"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>Key Points</div>
                      {result.miniLesson.keyPoints.map((kp,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.4rem",alignItems:"flex-start",marginBottom:"0.3rem"}}>
                          <span style={{color:pal.primary,flexShrink:0,marginTop:"2px"}}>→</span>
                          <span style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.miniLesson.activity&&(
                    <div style={{background:pal.pale,borderRadius:"10px",padding:"0.55rem 0.75rem",marginBottom:"0.5rem",border:`1.5px solid ${pal.primary}20`}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>🧪 Try This</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{result.miniLesson.activity}</div>
                    </div>
                  )}

                  {result.miniLesson.discussion&&(
                    <div style={{background:"#fffbeb",borderRadius:"10px",padding:"0.55rem 0.75rem",border:"1.5px solid #f5c84240"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>💬 Talk About It</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5,fontStyle:"italic"}}>{"\""+result.miniLesson.discussion+"\""}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Vocabulary */}
              {(result.miniLesson?.vocabulary||[]).length>0&&(
                <div style={{background:"#fff",borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}25`}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.4rem"}}>📚 Vocabulary</div>
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
                {wsLoading?"⏳ Building worksheet...":"📄 Build a Worksheet from This"}
              </button>
              {wsError&&<div style={{fontSize:"0.72rem",color:"#a03030",textAlign:"center"}}>{wsError}</div>}
            </div>
          )}

          {/* Error states */}
          {phase==="result"&&result?._error==="nokey"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔑</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.35rem"}}>AI not set up yet</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>Add your Anthropic API key in Settings → AI to unlock Field Study and all AI features.</div>
            </div>
          )}
          {phase==="result"&&result?._error==="fail"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>😔</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.5rem"}}>Couldn't analyze the photo</div>
              <button onClick={()=>setPhase("capture")} style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>Try Again</button>
            </div>
          )}

          {/* Worksheet result */}
          {phase==="worksheet"&&wsResult&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.good}30`,display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>✅</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.good,fontSize:"0.82rem"}}>{wsResult.title||"Field Study Worksheet ready!"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>
                    {(wsResult.sections||[{items:wsResult.items||[]}]).reduce((sum,s)=>sum+(s.items||[]).length,0)} items · {grade} level
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
                  {(section.items||[]).length>3&&<div style={{fontSize:"0.7rem",color:pal.slate,textAlign:"center",fontStyle:"italic"}}>{`+ ${(section.items||[]).length-3} more items`}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",gap:"0.55rem"}}>
          {phase==="capture"&&(
            <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>Cancel</button>
          )}
          {phase==="result"&&!result?._error&&(
            <>
              <button onClick={()=>{setPhase("capture");setResult(null);setImageData(null);}} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>← New</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Done ✓</button>
            </>
          )}
          {phase==="worksheet"&&(
            <>
              <button onClick={()=>setPhase("result")} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>← Back</button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>🖨️ Print Worksheet</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
