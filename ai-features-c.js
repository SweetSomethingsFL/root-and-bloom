
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
