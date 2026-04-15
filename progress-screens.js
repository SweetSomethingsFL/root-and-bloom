/* progress-screens.js
   ProgressScreen, TranscriptsScreen, WeeklyDigestModal, DailyLogSection
   Globals from index.html: CHILD_COLOR_PALETTES, SUBJECT_OPTIONS, GOALS, GOAL_NUDGES,
   getStateInfo, getComplianceInfo, gradeLevel, downloadPortfolioHTML,
   callClaude, generateStruggleReport, goalSummary, curriculumContext
*/

function ProgressScreen({pal, family, child, setChild, portfolioEntries=[], attendanceDays=0, onUpdateFamily, onOpenEOY}) {
  const [activeTab,    setActiveTab]    = React.useState("pulse");   // pulse | timeline | milestones | skills | grades
  const [selectedChild, setSelectedChild] = React.useState(
    child && child!=="all" ? family.children.findIndex(c=>c.id===child) : 0
  );
  const [pulseResult,  setPulseResult]  = React.useState(null);
  const [pulseLoading, setPulseLoading] = React.useState(false);
  const [pulseError,   setPulseError]   = React.useState(null);
  const [timelineSubj, setTimelineSubj] = React.useState(null);
  const [arcResult,    setArcResult]    = React.useState(null);
  const [arcLoading,   setArcLoading]   = React.useState(false);
  const [arcError,     setArcError]     = React.useState(null);
  const [arcSubj,      setArcSubj]      = React.useState(null);
  const [suggestResult, setSuggestResult] = React.useState(null);
  const [suggestLoading,setSuggestLoading]= React.useState(false);
  const [suggestError,  setSuggestError]  = React.useState(null);
  const [pulseRange,   setPulseRange]   = React.useState("week"); // week | month | all
  const [savedPulses,  setSavedPulses]  = React.useState(()=>{
    try{ const s=localStorage.getItem("rootbloom_pulses"); return s?JSON.parse(s):[]; }catch(e){return [];}
  });
  const [gradeStruggle, setGradeStruggle] = React.useState(null);
  const [gradeStruggleLoading, setGradeStruggleLoading] = React.useState(false);
  const [gradeStruggleError,   setGradeStruggleError]   = React.useState(null);
  const [showDigest,   setShowDigest]   = React.useState(false);

  const ch       = family.children[selectedChild] || family.children[0];
  const cp       = CHILD_COLOR_PALETTES.find(p=>p.id===(ch?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const childEntries = portfolioEntries.filter(e=>e.childIdx===selectedChild && !e.isDay && e.subj!=="Daily Notes");
  const milestones   = portfolioEntries.filter(e=>e.childIdx===selectedChild && e.isMilestone);

  // ── Week boundaries ───────────────────────────────────────────────────────
  const today      = new Date();
  const dow        = today.getDay();
  const weekStart  = new Date(today); weekStart.setDate(today.getDate()-(dow===0?6:dow-1)); weekStart.setHours(0,0,0,0);
  const weekEnd    = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6);
  const yr         = today.getFullYear();

  const isThisWeek = (dateStr) => {
    try {
      const d = new Date(dateStr+", "+yr); 
      return d >= weekStart && d <= weekEnd;
    } catch(e){ return false; }
  };

  const weekEntries = childEntries.filter(e=>isThisWeek(e.date));
  const weekSubjs   = [...new Set(weekEntries.map(e=>e.subj))];

  // ── Subject list with entry counts ────────────────────────────────────────
  const allSubjs = (family.subjects||[]).map(id=>{
    const s=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(x=>x.id===id);
    return s||null;
  }).filter(Boolean);

  // Momentum: compare this week vs last week entry count per child
  const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(weekStart.getDate()-7);
  const lastWeekEnd   = new Date(weekStart); lastWeekEnd.setDate(weekStart.getDate()-1);
  const getMomentum = (ci) => {
    const entries = portfolioEntries.filter(e=>e.childIdx===ci&&!e.isDay);
    const thisWkCount = entries.filter(e=>{
      try{ const d=new Date(e.date+", "+yr); return d>=weekStart&&d<=weekEnd; }catch(ex){return false;}
    }).length;
    const lastWkCount = entries.filter(e=>{
      try{ const d=new Date(e.date+", "+yr); return d>=lastWeekStart&&d<=lastWeekEnd; }catch(ex){return false;}
    }).length;
    const delta = thisWkCount - lastWkCount;
    return {delta, thisWkCount, lastWkCount};
  };

  const generateSuggestions = async () => {
    const allNotes = childEntries.filter(e=>!e.isMilestone&&e.note&&e.note.trim().length>10);
    if(allNotes.length===0) return;
    setSuggestLoading(true); setSuggestError(null); setSuggestResult(null);
    const lines = allNotes.slice(0,50).map(e=>"["+e.subj+(e.date?" "+e.date:"")+"] "+e.note.replace("AI Summary: ","").trim()).join("\n");
    const cname = (family.children[selectedChild]||family.children[0]).name;
    const prompt = "You are a warm homeschool learning coach reviewing a parent's log notes for "+cname+". "
      + "Look for entries that describe a meaningful moment that probably deserves to be marked as a milestone \u2014 "
      + "things like: first time doing something independently, finally mastering a concept, completing a big project, "
      + "showing unexpected insight, overcoming a struggle, or any 'first.' "
      + "Return up to 4 suggested milestone entries. For each, write one line in this exact format:\n"
      + "SUBJECT | DATE | One sentence explaining why this deserves milestone status, referencing the note content.\n"
      + "If fewer than 2 good candidates exist, say NONE.\n"
      + "Plain text only. No markdown.\n\nNotes:\n"+lines;
    try {
      const result = await callClaude(prompt);
      const trimmed = result.trim();
      setSuggestResult(trimmed==="NONE"||trimmed===""?null:trimmed);
      if(trimmed==="NONE"||trimmed==="") setSuggestError("none");
    } catch(e) {
      setSuggestError(e.message==="NO_KEY"?"no_key":"error");
    }
    setSuggestLoading(false);
  };

  const generateArc = async (subj, entries) => {
    if(entries.length < 2) return;
    setArcLoading(true); setArcError(null); setArcResult(null); setArcSubj(subj);
    const oldest = entries.slice(-3).reverse();
    const newest = entries.slice(0, 3);
    const oldLines = oldest.map(e=>"["+e.date+"] "+e.note.replace("AI Summary: ","").trim()).join("\n");
    const newLines = newest.map(e=>"["+e.date+"] "+e.note.replace("AI Summary: ","").trim()).join("\n");
    const cname = (family.children[selectedChild]||family.children[0]).name;
    const prompt = "You are a warm homeschool learning coach. Compare these earliest vs most recent notes "
      + "about "+cname+"'s progress in "+subj+". "
      + "Write a short growth arc: 1-2 sentences on where they started, 1-2 sentences on where they are now. "
      + "Be specific and reference actual content from the notes. Be warm and encouraging. Plain text only. Under 80 words.\n\n"
      + "Earliest notes:\n"+oldLines+"\n\nMost recent notes:\n"+newLines;
    try {
      const result = await callClaude(prompt);
      setArcResult(result.trim());
    } catch(e) {
      setArcError(e.message==="NO_KEY"?"no_key":"error");
    }
    setArcLoading(false);
  };

  const last4Weeks = Array.from({length:4},(_,i)=>{
    const ws = new Date(weekStart); ws.setDate(weekStart.getDate() - i*7);
    const we = new Date(ws); we.setDate(ws.getDate()+6);
    return {start:ws, end:we};
  }).reverse();
  const subjStats = allSubjs.map(s=>{
    const all    = childEntries.filter(e=>e.subj===s.label);
    const week   = all.filter(e=>isThisWeek(e.date));
    const recent = all[0]||null;
    const notes  = all.filter(e=>e.note&&e.note.trim().length>10);
    const weekDots = last4Weeks.map(({start,end})=>{
      return all.some(e=>{
        try{ const d=new Date(e.date+", "+yr); return d>=start && d<=end; }catch(ex){return false;}
      });
    });
    return {...s, total:all.length, weekCount:week.length, recent, noteCount:notes.length, weekDots};
  }).sort((a,b)=>b.total-a.total);

  // ── AI pulse — supports week / month / all-time ──────────────────────────
  const generatePulse = async (range) => {
    const r = range || pulseRange;
    setPulseLoading(true); setPulseError(null); setPulseResult(null);

    // Build date filter
    const filterEntry = (e) => {
      if(r==="week") return isThisWeek(e.date);
      if(r==="month") {
        try{
          const d=new Date(e.date+", "+yr);
          return d.getMonth()===today.getMonth() && d.getFullYear()===today.getFullYear();
        }catch(ex){return false;}
      }
      return true; // all
    };

    const noteLines = [];
    family.children.forEach((c,ci)=>{
      const cEntries = portfolioEntries.filter(e=>e.childIdx===ci&&!e.isDay&&filterEntry(e)&&e.note&&e.note.trim());
      if(cEntries.length===0) return;
      const subjCounts = {};
      cEntries.forEach(e=>{ subjCounts[e.subj]=(subjCounts[e.subj]||0)+1; });
      const freqLine = Object.entries(subjCounts).sort((a,b)=>b[1]-a[1]).map(([s,n])=>s+":"+n).join(", ");
      noteLines.push("Child: "+c.name+" (grade: "+c.grade+") | Subject frequency: "+freqLine);
      cEntries.slice(0,40).forEach(e=>{
        const milestone = e.isMilestone ? " [MILESTONE]" : "";
        noteLines.push("  "+e.subj+(e.date?" ["+e.date+"]":"")+milestone+": "+e.note.replace("AI Summary: ","").trim());
      });
    });

    if(noteLines.length===0) {
      setPulseError("no_notes");
      setPulseLoading(false);
      return;
    }

    const rangeLabel = r==="week"?"this week":r==="month"?"this month":"all time";
    const prompt = "You are a warm, insightful homeschool learning coach writing a progress summary for a homeschool parent. "
      + "The parent has logged notes about their child\u2019s learning "+rangeLabel+". "
      + "Your job is to read these notes carefully and write a structured summary for each child.\n\n"
      + "For each child, write THREE clearly labeled sections:\n"
      + "STRENGTHS: Name 2-3 specific subjects where this child is excelling or showing strong engagement. "
      + "Base this on: high note frequency, milestone tags [MILESTONE], positive language in notes, or depth of detail. "
      + "Quote or paraphrase specific moments from the notes.\n"
      + "GROWTH AREAS: Name 1-2 subjects that appear light (few or no entries), show struggle signals in the note language, "
      + "or haven\u2019t been logged recently. Be gentle and constructive \u2014 frame as opportunity, not failure.\n"
      + "OVERALL: 1-2 warm sentences capturing the child\u2019s learning story this period. Reference something specific.\n\n"
      + "Rules: Plain text only. No markdown, no bullet points, no asterisks. "
      + "Label each section exactly as: STRENGTHS: / GROWTH AREAS: / OVERALL: "
      + "Be specific \u2014 mention actual subjects and real moments from the notes. "
      + "Keep each child\u2019s summary under 150 words.\n\n"
      + "Notes:\n"+noteLines.join("\n");

    try {
      const result = await callClaude(prompt);
      const trimmed = result.trim();
      setPulseResult(trimmed);
      if(r==="week") savePulse(trimmed, r);
    } catch(e) {
      setPulseError(e.message==="NO_KEY"?"no_key":e.message==="RATE_LIMIT"?"rate_limit":"error");
    }
    setPulseLoading(false);
  };

  // Nudge: show when 3+ entries this week and no pulse generated yet for this week
  const savedPulseWeek = (() => { try{ return localStorage.getItem("rootbloom_pulse_week")||""; }catch(e){return "";} })();
  const thisWeekKey    = weekStart.toDateString();
  const alreadyPulsedThisWeek = savedPulseWeek === thisWeekKey;

  // Total notes across all children this week
  const totalWeekNotes = family.children.reduce((sum,c,ci)=>{
    return sum + portfolioEntries.filter(e=>e.childIdx===ci&&!e.isDay&&isThisWeek(e.date)&&e.note&&e.note.trim()).length;
  },0);

  const showNudge = totalWeekNotes>=3 && !alreadyPulsedThisWeek && !pulseResult && !pulseLoading;

  const savePulse = (text, range) => {
    const entry = {
      text, range,
      date: today.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      weekKey: thisWeekKey,
    };
    const updated = [entry, ...savedPulses].slice(0,8); // keep last 8
    setSavedPulses(updated);
    try{ localStorage.setItem("rootbloom_pulses", JSON.stringify(updated)); }catch(e){}
    try{ localStorage.setItem("rootbloom_pulse_week", thisWeekKey); }catch(e){}
  };

  // ── Subject timeline entries ───────────────────────────────────────────────
  const timelineEntries = timelineSubj
    ? childEntries.filter(e=>e.subj===timelineSubj && (e.isQuizResult || (e.note && e.note.trim().length>5)))
    : [];

  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Progress" sub="How your family is growing" icon="📈"/>
      {/* Year-End Review button */}
      {onOpenEOY&&family?.yearEnd&&(()=>{
        const weeksLeftP = getEOYWeeksLeft(family);
        const isNear = weeksLeftP!==null && weeksLeftP<=4;
        return (
          <div style={{padding:"0 1rem",marginBottom:"0.5rem"}}>
            <button onClick={onOpenEOY}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.65rem 0.9rem",border:"2px solid "+(isNear?pal.primary+"50":pal.stone+"40"),borderRadius:"13px",background:isNear?pal.pale:"transparent",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
                <span style={{fontSize:"1.1rem"}}>{"🎓"}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:"700",color:isNear?pal.primary:pal.inkM,fontSize:"0.82rem"}}>{"Year-End Review"}</div>
                  <div style={{fontSize:"0.66rem",color:pal.slate,marginTop:"1px"}}>
                    {weeksLeftP===null?"Checklist, year review & grade promotion":weeksLeftP===0?"Year complete — ready to wrap up!":weeksLeftP<=4?""+weeksLeftP+" weeks left — start your review":"Checklist, year review & grade promotion"}
                  </div>
                </div>
              </div>
              <span style={{color:isNear?pal.primary:pal.stone,fontSize:"0.9rem"}}>{"\u203a"}</span>
            </button>
          </div>
        );
      })()}


      {/* Child selector */}
      {family.children.length>1&&(
        <div style={{padding:"0 1rem",marginBottom:"0.75rem"}}>
          <div style={{display:"flex",gap:"0.35rem",overflowX:"auto"}}>
            {family.children.map((c,i)=>{
              const ccp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
              const sel=i===selectedChild;
              return (
                <button key={c.id} onClick={()=>{setSelectedChild(i);setTimelineSubj(null);setPulseResult(null);setSuggestResult(null);setSuggestError(null);setArcResult(null);setArcSubj(null);}}
                  style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.32rem 0.75rem",border:`2px solid ${sel?ccp.c1:pal.stone+"40"}`,borderRadius:"20px",background:sel?ccp.c1+"18":"transparent",cursor:"pointer",flexShrink:0}}>
                  <span style={{fontSize:"1rem"}}>{c.avatar}</span>
                  <span style={{fontSize:"0.75rem",fontWeight:sel?"800":"500",color:sel?ccp.c1:pal.inkM}}>{c.name}</span>
                  {(()=>{ const m=getMomentum(i); if(m.thisWkCount===0&&m.lastWkCount===0) return null;
                    const up=m.delta>0, same=m.delta===0;
                    const arrow=up?"\u2191":same?"\u2192":"\u2193";
                    const col=up?"#2d9e5f":same?pal.slate:"#cc4444";
                    return <span style={{fontSize:"0.6rem",fontWeight:"800",color:col,marginLeft:"1px"}}>{arrow+(m.delta!==0?(m.delta>0?"+":"")+m.delta:"")}</span>;
                  })()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div style={{padding:"0 1rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",gap:"0.4rem"}}>
          {[["pulse","📊 Pulse"],["timeline","📖 Timeline"],["milestones","🌟 Milestones"],["skills","✅ Skills"],["grades","🏆 Grades"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setActiveTab(id);setTimelineSubj(null);setArcResult(null);setArcSubj(null);}}
              style={{flex:1,padding:"0.52rem 0.3rem",border:`2px solid ${activeTab===id?pal.primary:pal.stone+"40"}`,borderRadius:"11px",background:activeTab===id?pal.pale:"transparent",color:activeTab===id?pal.primary:pal.inkM,fontWeight:activeTab===id?"800":"500",fontSize:"0.65rem",cursor:"pointer",transition:"all 0.13s"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"0 1rem 5rem"}}>

        {/* ══ WEEKLY PULSE ══════════════════════════════════════════════════════════════════════ */}
        {activeTab==="pulse"&&(()=>{
          const rangeLabel = pulseRange==="week"?"This week":pulseRange==="month"?"This month":"All time";
          const rangeEntries = pulseRange==="week" ? weekEntries
            : pulseRange==="month" ? childEntries.filter(e=>{
                try{const d=new Date(e.date+", "+yr);return d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();}catch(ex){return false;}
              })
            : childEntries;
          const rangeSubjs = [...new Set(rangeEntries.map(e=>e.subj))];
          const rangeNotes = rangeEntries.filter(e=>e.note&&e.note.trim()).length;

          return (
            <div>
              {/* Smart nudge */}
              {showNudge&&(
                <div style={{background:"linear-gradient(135deg,"+pal.primary+"18,"+pal.accent+"12)",borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:"2px solid "+pal.primary+"30"}}>
                  <div style={{display:"flex",gap:"0.65rem",alignItems:"flex-start"}}>
                    <span style={{fontSize:"1.4rem",flexShrink:0}}>{"\u2728"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.88rem",marginBottom:"2px"}}>{"Ready for a progress check-in?"}</div>
                      <div style={{fontSize:"0.74rem",color:pal.inkM,lineHeight:1.55,marginBottom:"0.65rem"}}>
                        {"You have "+totalWeekNotes+" note"+(totalWeekNotes===1?"":"s")+" this week. Generate a summary to see how everyone is growing."}
                      </div>
                      <button onClick={()=>generatePulse("week")}
                        style={{padding:"0.5rem 1.1rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>
                        {"Generate now"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Range selector */}
              <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.85rem"}}>
                {[["week","This week"],["month","This month"],["all","All time"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setPulseRange(id)}
                    style={{flex:1,padding:"0.42rem 0",border:"2px solid "+(pulseRange===id?pal.primary:pal.stone+"40"),borderRadius:"10px",background:pulseRange===id?pal.pale:"transparent",color:pulseRange===id?pal.primary:pal.inkM,fontWeight:pulseRange===id?"800":"500",fontSize:"0.72rem",cursor:"pointer"}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* At a glance */}
              <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:"1.5px solid "+pal.stone+"30"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.65rem"}}>{rangeLabel+" \u2014 "+ch?.name}</div>
                {rangeSubjs.length===0?(
                  <div style={{fontSize:"0.8rem",color:pal.stone,fontStyle:"italic"}}>{"Nothing logged yet for this period."}</div>
                ):(
                  <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
                    {rangeSubjs.map(s=>{
                      const so=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(x=>x.label===s);
                      const count=rangeEntries.filter(e=>e.subj===s).length;
                      return (
                        <span key={s} style={{display:"inline-flex",alignItems:"center",gap:"0.2rem",padding:"0.22rem 0.6rem",background:cp.c1+"18",borderRadius:"20px",fontSize:"0.73rem",fontWeight:"700",color:cp.c1}}>
                          {so?.icon||"\ud83d\udccb"} {s}{count>1&&<span style={{fontSize:"0.62rem",opacity:0.7}}>{" \u00d7"+count}</span>}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pulse result */}
              {pulseResult&&(()=>{
                const parsePulse = (text) => {
                  const sections = [];
                  const patterns = [
                    {key:"strengths", label:"Strengths",    icon:"\u2b50", color:pal.good,    bg:pal.goodBg, border:pal.good+"40"},
                    {key:"growth",    label:"Growth Areas", icon:"\U0001f331", color:"#b07800", bg:"#fff8e6",  border:"#f5c84240"},
                    {key:"overall",   label:"Overall",      icon:"\u2728",  color:pal.primary, bg:pal.pale,  border:pal.primary+"30"},
                  ];
                  const upper = text.toUpperCase();
                  patterns.forEach(p => {
                    const marker = p.key==="growth" ? "GROWTH AREAS:" : p.key.toUpperCase()+":";
                    const idx = upper.indexOf(marker);
                    if(idx===-1) return;
                    const start = idx + marker.length;
                    const nextIdxs = patterns
                      .filter(pp=>pp.key!==p.key)
                      .map(pp=>{ const m=pp.key==="growth"?"GROWTH AREAS:":pp.key.toUpperCase()+":"; return upper.indexOf(m, start); })
                      .filter(i=>i>start);
                    const end = nextIdxs.length>0 ? Math.min(...nextIdxs) : text.length;
                    const body = text.slice(start, end).trim();
                    if(body) sections.push({...p, body});
                  });
                  if(sections.length===0) sections.push({key:"plain",label:"Summary",icon:"\u2728",color:pal.good,bg:pal.goodBg,border:pal.good+"40",body:text.trim()});
                  return sections;
                };
                const sections = parsePulse(pulseResult);
                return (
                  <div style={{marginBottom:"1rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.65rem"}}>
                      <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.85rem"}}>{"\u2728 Progress Summary"}</div>
                      <button onClick={()=>setPulseResult(null)} style={{background:"transparent",border:"none",color:pal.stone,cursor:"pointer",fontSize:"0.8rem"}}>{"\u2715"}</button>
                    </div>
                    {sections.map((s,i)=>(
                      <div key={s.key} style={{background:s.bg,borderRadius:"13px",padding:"0.75rem 0.9rem",marginBottom:"0.5rem",border:"1.5px solid "+s.border}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.35rem"}}>
                          <span style={{fontSize:"0.9rem"}}>{s.icon}</span>
                          <span style={{fontWeight:"800",color:s.color,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.07em"}}>{s.label}</span>
                        </div>
                        <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.7}}>{s.body}</div>
                      </div>
                    ))}
                    <div style={{fontSize:"0.65rem",color:pal.stone,marginTop:"0.25rem",textAlign:"right"}}>{rangeLabel+" \u00b7 "+today.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                  </div>
                );
              })()}

              {/* Loading */}
              {pulseLoading&&(
                <div style={{background:pal.pale,borderRadius:"14px",padding:"1.2rem",marginBottom:"1rem",textAlign:"center",border:"1.5px solid "+pal.primary+"20"}}>
                  <div style={{fontSize:"0.84rem",color:pal.primary,fontWeight:"700",marginBottom:"4px"}}>{"Generating progress summary\u2026"}</div>
                  <div style={{fontSize:"0.72rem",color:pal.slate}}>{"Reading through your notes \u2014 this takes a few seconds"}</div>
                </div>
              )}

              {/* Errors */}
              {pulseError==="no_notes"&&<div style={{background:pal.parchm,borderRadius:"14px",padding:"0.85rem",marginBottom:"1rem",fontSize:"0.8rem",color:pal.inkM,textAlign:"center",border:"1.5px solid "+pal.stone+"30"}}>{"No notes found for this period \u2014 add notes when logging subjects."}</div>}
              {pulseError==="no_key"&&<div style={{background:"#fff8ed",borderRadius:"14px",padding:"0.85rem",marginBottom:"1rem",fontSize:"0.8rem",color:"#7a5500",textAlign:"center",border:"1.5px solid #f5c84240"}}>{"Add an API key in Settings to use AI summaries."}</div>}
              {(pulseError==="rate_limit"||pulseError==="error")&&<div style={{background:"#fff0f0",borderRadius:"14px",padding:"0.85rem",marginBottom:"1rem",fontSize:"0.8rem",color:"#aa3333",textAlign:"center",border:"1.5px solid #ffaaaa40"}}>{pulseError==="rate_limit"?"Monthly AI limit reached.":"Could not generate \u2014 check your connection."}</div>}

              {/* Generate / regenerate */}
              {!pulseLoading&&(
                <button onClick={()=>generatePulse(pulseRange)} disabled={rangeNotes===0}
                  style={{width:"100%",padding:"0.82rem",border:"none",borderRadius:"13px",background:rangeNotes>0?pal.accentGrad:"#ddd",color:rangeNotes>0?"#fff":pal.stone,fontWeight:"800",fontSize:"0.88rem",cursor:rangeNotes>0?"pointer":"default",marginBottom:"1rem"}}>
                  {pulseResult?"\u2728 Regenerate summary":"\u2728 Generate "+rangeLabel.toLowerCase()+" summary"}
                </button>
              )}

              {/* Past pulses */}
              {savedPulses.length>0&&!pulseResult&&(
                <div style={{marginBottom:"1rem"}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"Past summaries"}</div>
                  {savedPulses.map((p,i)=>(
                    <div key={i} style={{background:pal.linen,borderRadius:"13px",padding:"0.8rem 0.9rem",marginBottom:"0.45rem",border:"1.5px solid "+pal.stone+"25"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"}}>
                        <span style={{fontSize:"0.68rem",fontWeight:"700",color:pal.primary,textTransform:"capitalize"}}>{p.range||"week"}</span>
                        <span style={{fontSize:"0.65rem",color:pal.stone}}>{p.date}</span>
                      </div>
                      <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.65,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}>{p.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Weekly Quiz Report */}
              {(()=>{
                const weekQuizEntries = childEntries.filter(e=>e.isQuizResult&&e.quizData&&isThisWeek(e.date));
                if(weekQuizEntries.length===0) return null;
                const bySubj = {};
                weekQuizEntries.forEach(e=>{
                  if(!bySubj[e.subj]) bySubj[e.subj]={subj:e.subj,quizzes:[],totalScore:0,totalPoss:0};
                  bySubj[e.subj].quizzes.push(e);
                  bySubj[e.subj].totalScore+=e.quizData.score;
                  bySubj[e.subj].totalPoss+=e.quizData.total;
                });
                const rows = Object.values(bySubj);
                return (
                  <div style={{marginBottom:"1rem"}}>
                    <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"\uD83C\uDFAF Quiz scores this week \u2014 "+ch?.name}</div>
                    {rows.map(r=>{
                      const pct=r.totalPoss>0?Math.round((r.totalScore/r.totalPoss)*100):0;
                      const col=pct>=90?"#2d9e5f":pct>=70?"#e8a020":"#cc4444";
                      const bg =pct>=90?"#edf9f0":pct>=70?"#fff8e6":"#fff0f0";
                      const so=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(x=>x.label===r.subj);
                      const allMissed=[...new Set(r.quizzes.flatMap(e=>e.quizData.missed||[]))];
                      return (
                        <div key={r.subj} style={{background:bg,borderRadius:"13px",padding:"0.75rem 0.9rem",marginBottom:"0.45rem",border:"1.5px solid "+col+"40"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.3rem"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                              <span style={{fontSize:"1rem"}}>{so?.icon||"\uD83D\uDCCB"}</span>
                              <span style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem"}}>{r.subj}</span>
                              <span style={{fontSize:"0.65rem",color:pal.stone}}>{r.quizzes.length+" quiz"+(r.quizzes.length===1?"":"zes")}</span>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:"0.35rem"}}>
                              <span style={{fontWeight:"900",color:col,fontSize:"0.9rem"}}>{pct+"%"}</span>
                              <span style={{fontSize:"0.72rem",color:pal.stone}}>{r.totalScore+"/"+r.totalPoss}</span>
                            </div>
                          </div>
                          <div style={{height:"5px",borderRadius:"99px",background:pal.stone+"20",overflow:"hidden",marginBottom:allMissed.length>0?"0.35rem":"0"}}>
                            <div style={{height:"100%",width:pct+"%",background:col,borderRadius:"99px"}}/>
                          </div>
                          {allMissed.length>0&&(
                            <div style={{fontSize:"0.7rem",color:pal.inkM,lineHeight:1.5}}>
                              <span style={{fontWeight:"700",color:"#cc4444"}}>{"Needs review: "}</span>
                              {allMissed.slice(0,3).join(", ")+(allMissed.length>3?" \u2026":"")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Weekly Digest button */}
              {savedPulses.length>0&&(
                <button onClick={()=>setShowDigest(true)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.75rem 1rem",border:"2px solid "+pal.primary+"30",borderRadius:"13px",background:"linear-gradient(135deg,"+pal.primary+"10,"+pal.accent+"08)",cursor:"pointer",textAlign:"left",marginBottom:"1rem"}}>
                  <span style={{fontSize:"1.3rem",flexShrink:0}}>{"\uD83D\uDCCB"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>{"Weekly Digest"}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Full week summary \u2014 attendance, quiz scores, milestones \u00b7 printable"}</div>
                  </div>
                  <span style={{color:pal.primary,fontSize:"0.85rem",flexShrink:0}}>{"\u203a"}</span>
                </button>
              )}

              {/* Subject stats */}
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"All subjects \u2014 "+ch?.name}</div>
              {subjStats.map(s=>(
                <button key={s.id} onClick={()=>{setActiveTab("timeline");setTimelineSubj(s.label);}}
                  style={{width:"100%",display:"flex",gap:"0.75rem",alignItems:"center",background:pal.linen,borderRadius:"13px",padding:"0.75rem 0.85rem",marginBottom:"0.45rem",border:"1.5px solid "+pal.stone+"25",cursor:s.noteCount>0?"pointer":"default",textAlign:"left"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"10px",background:s.total>0?cp.c1+"20":pal.parchm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{s.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem"}}>{s.label}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>
                      {s.total>0?s.total+" entr"+(s.total===1?"y":"ies")+(s.noteCount>0?", "+s.noteCount+" with notes":""):"Nothing logged yet"}
                      {s.weekCount>0&&<span style={{color:cp.c1,fontWeight:"700"}}>{" \u00b7 "+s.weekCount+" this week"}</span>}
                    </div>
                    {s.total>0&&(
                      <div style={{display:"flex",alignItems:"center",gap:"3px",marginTop:"5px"}}>
                        {(s.weekDots||[]).map((hit,di)=>(
                          <div key={di} style={{width:"8px",height:"8px",borderRadius:"50%",background:hit?cp.c1:pal.stone+"40",border:"1.5px solid "+(hit?cp.c1:pal.stone+"30"),flexShrink:0}}/>
                        ))}
                        <span style={{fontSize:"0.58rem",color:pal.stone,marginLeft:"3px"}}>{"4 wks"}</span>
                      </div>
                    )}
                  </div>
                  {s.noteCount>0&&<span style={{fontSize:"0.7rem",color:pal.primary,fontWeight:"700",flexShrink:0}}>{"View \u2192"}</span>}
                  {s.total===0&&<span style={{fontSize:"0.65rem",color:pal.stone,flexShrink:0}}>{"0 entries"}</span>}
                </button>
              ))}
            </div>
          );
        })()}

                {/* ══ SUBJECT TIMELINE ════════════════════════════════════════════════ */}
        {activeTab==="timeline"&&(()=>{
          if(!timelineSubj) {
            return (
              <div>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"Choose a subject — "+ch?.name}</div>
                {subjStats.filter(s=>s.noteCount>0).length===0&&(
                  <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem 1.2rem",textAlign:"center",border:"1.5px solid "+pal.stone+"25"}}>
                    <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"📖"}</div>
                    <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.3rem"}}>{"No notes yet"}</div>
                    <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6}}>{"Add notes when you log subjects — they build a growth story over time."}</div>
                  </div>
                )}
                {subjStats.filter(s=>s.noteCount>0).map(s=>(
                  <button key={s.id} onClick={()=>setTimelineSubj(s.label)}
                    style={{width:"100%",display:"flex",gap:"0.75rem",alignItems:"center",background:pal.linen,borderRadius:"13px",padding:"0.75rem 0.85rem",marginBottom:"0.45rem",border:"1.5px solid "+pal.stone+"25",cursor:"pointer",textAlign:"left"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"10px",background:cp.c1+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{s.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem"}}>{s.label}</div>
                      <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{s.noteCount+" note"+(s.noteCount===1?"":"s")+" · "+s.total+" total entries"}</div>
                    </div>
                    <span style={{fontSize:"0.8rem",color:pal.primary}}>{"›"}</span>
                  </button>
                ))}
              </div>
            );
          }

          const subj_obj = [...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(s=>s.label===timelineSubj);
          return (
            <div>
              <button onClick={()=>setTimelineSubj(null)}
                style={{display:"flex",alignItems:"center",gap:"0.35rem",background:"transparent",border:"none",color:pal.primary,fontSize:"0.78rem",fontWeight:"700",cursor:"pointer",marginBottom:"0.9rem",padding:0}}>
                {"‹ Back"}
              </button>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"center",marginBottom:"1rem"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"11px",background:cp.c1+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{subj_obj?.icon||"📋"}</div>
                <div>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.92rem"}}>{timelineSubj}</div>
                  <div style={{fontSize:"0.72rem",color:pal.slate}}>{ch?.name+" · "+timelineEntries.length+" note"+(timelineEntries.length===1?"":"s")}</div>
                </div>
              </div>
              {timelineEntries.length>=2&&(
                <div style={{marginBottom:"1rem"}}>
                  {arcResult&&arcSubj===timelineSubj?(
                    <div style={{background:cp.c1+"12",borderRadius:"13px",padding:"0.8rem 0.95rem",border:"1.5px solid "+cp.c1+"30"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"}}>
                        <span style={{fontSize:"0.7rem",fontWeight:"800",color:cp.c1,textTransform:"uppercase",letterSpacing:"0.07em"}}>{"\u2728 Growth Arc"}</span>
                        <button onClick={()=>{setArcResult(null);setArcSubj(null);}} style={{background:"transparent",border:"none",color:pal.stone,cursor:"pointer",fontSize:"0.75rem"}}>{"\u2715"}</button>
                      </div>
                      <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.7}}>{arcResult}</div>
                    </div>
                  ):arcLoading&&arcSubj===timelineSubj?(
                    <div style={{background:pal.pale,borderRadius:"13px",padding:"0.75rem",border:"1.5px solid "+pal.primary+"20",textAlign:"center"}}>
                      <div style={{fontSize:"0.78rem",color:pal.primary,fontWeight:"700"}}>{"Reading the journey\u2026"}</div>
                    </div>
                  ):(
                    <button onClick={()=>generateArc(timelineSubj, timelineEntries)}
                      style={{width:"100%",padding:"0.65rem",border:"1.5px dashed "+cp.c1+"60",borderRadius:"13px",background:cp.c1+"08",color:cp.c1,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                      {"\u2728 Generate growth arc"}
                    </button>
                  )}
                  {arcError==="no_key"&&<div style={{fontSize:"0.7rem",color:"#b07800",marginTop:"0.35rem",textAlign:"center"}}>{"Add an API key in Settings to use AI features."}</div>}
                  {arcError==="error"&&<div style={{fontSize:"0.7rem",color:"#cc4444",marginTop:"0.35rem",textAlign:"center"}}>{"Could not generate \u2014 check connection."}</div>}
                </div>
              )}
              {timelineEntries.length===0&&(
                <div style={{background:pal.parchm,borderRadius:"13px",padding:"1.5rem",textAlign:"center",fontSize:"0.8rem",color:pal.stone}}>{"No notes with detail for this subject yet."}</div>
              )}
              {timelineEntries.map((e,i)=>{
                const isQuiz = e.isQuizResult && e.quizData;
                const qd = isQuiz ? e.quizData : null;
                const qPct = qd ? Math.round((qd.score/qd.total)*100) : 0;
                const qColor = qPct>=90?"#2d9e5f":qPct>=70?"#e8a020":"#cc4444";
                const qBg    = qPct>=90?"#edf9f0":qPct>=70?"#fff8e6":"#fff0f0";
                const dotColor = isQuiz ? qColor : e.isMilestone ? cp.c1 : pal.stone+"60";
                const borderColor = isQuiz ? qColor+"50" : e.isMilestone ? cp.c1+"40" : pal.stone+"20";
                return (
                  <div key={e.id||i} style={{display:"flex",gap:"0.75rem",marginBottom:"0.85rem"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:"10px",height:"10px",borderRadius:"50%",background:dotColor,border:"2px solid "+dotColor,marginTop:"3px"}}/>
                      {i<timelineEntries.length-1&&<div style={{width:"2px",flex:1,background:pal.stone+"20",margin:"4px 0"}}/>}
                    </div>
                    <div style={{flex:1,background:isQuiz?qBg:pal.linen,borderRadius:"12px",padding:"0.75rem 0.85rem",border:"1.5px solid "+borderColor}}>
                      {isQuiz?(
                        <div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                              <span style={{fontSize:"0.95rem"}}>{"\uD83C\uDFAF"}</span>
                              <span style={{fontSize:"0.72rem",fontWeight:"800",color:qColor,textTransform:"uppercase",letterSpacing:"0.06em"}}>{"Quiz Result"}</span>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
                              <div style={{background:qColor,color:"#fff",borderRadius:"99px",padding:"0.15rem 0.55rem",fontSize:"0.75rem",fontWeight:"900"}}>{qd.score+"/"+qd.total}</div>
                              <div style={{color:qColor,fontSize:"0.72rem",fontWeight:"800"}}>{qPct+"%"}</div>
                            </div>
                          </div>
                          <div style={{height:"5px",borderRadius:"99px",background:pal.stone+"20",overflow:"hidden",marginBottom:"0.45rem"}}>
                            <div style={{height:"100%",width:qPct+"%",background:qColor,borderRadius:"99px",transition:"width 0.4s"}}/>
                          </div>
                          {qd.missed&&qd.missed.length>0&&(
                            <div style={{fontSize:"0.7rem",color:pal.inkM,lineHeight:1.6}}>
                              <span style={{fontWeight:"700",color:"#cc4444"}}>{"Needs review: "}</span>
                              {qd.missed.join(", ")}
                            </div>
                          )}
                          {(!qd.missed||qd.missed.length===0)&&(
                            <div style={{fontSize:"0.72rem",color:"#2d9e5f",fontWeight:"700"}}>{"All correct! \uD83C\uDF1F"}</div>
                          )}
                          <div style={{fontSize:"0.63rem",color:pal.stone,marginTop:"5px"}}>{e.date||""}</div>
                        </div>
                      ):(
                        <div>
                          {e.isMilestone&&<div style={{fontSize:"0.65rem",fontWeight:"800",color:cp.c1,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"3px"}}>{"\uD83C\uDF1F Milestone"}</div>}
                          <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.65}}>{e.note.replace("AI Summary: ","").trim()}</div>
                          {e.readingTitle&&<div style={{fontSize:"0.72rem",color:pal.primary,marginTop:"4px",fontStyle:"italic"}}>{"📖 "+e.readingTitle}</div>}
                          <div style={{fontSize:"0.65rem",color:pal.stone,marginTop:"5px"}}>{e.date||""}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ══ MILESTONES ══════════════════════════════════════════════════════ */}
        {activeTab==="milestones"&&(()=>{
          return (
            <div>
              <div style={{background:"linear-gradient(135deg,"+cp.c1+"18,"+cp.c2+"12)",borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:"1.5px solid "+cp.c1+"25"}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"3px"}}>{"🌟 "+ch?.name+"’s Milestones"}</div>
                <div style={{fontSize:"0.75rem",color:pal.slate,lineHeight:1.55}}>{"Moments worth remembering — tag any log entry as a milestone using the 🌟 button when logging."}</div>
              </div>

              {/* AI Milestone Suggestions */}
              {childEntries.filter(e=>!e.isMilestone&&e.note&&e.note.trim().length>10).length>=3&&(
                <div style={{marginBottom:"1rem"}}>
                  {suggestResult?(
                    <div style={{background:"#fffbeb",borderRadius:"13px",padding:"0.85rem 1rem",border:"1.5px solid #f5c84250"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                        <span style={{fontSize:"0.7rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.07em"}}>{"\u2728 Suggested Milestones"}</span>
                        <button onClick={()=>setSuggestResult(null)} style={{background:"transparent",border:"none",color:pal.stone,cursor:"pointer",fontSize:"0.75rem"}}>{"\u2715"}</button>
                      </div>
                      <div style={{fontSize:"0.72rem",color:"#7a5500",marginBottom:"0.5rem"}}>{"AI spotted these entries as potential milestones you may have missed tagging:"}</div>
                      {suggestResult.split("\n").filter(l=>l.trim()&&l.includes("|")).map((line,li)=>{
                        const parts = line.split("|").map(p=>p.trim());
                        const subj=parts[0]||""; const date=parts[1]||""; const reason=parts[2]||line;
                        return (
                          <div key={li} style={{background:"#fff",borderRadius:"9px",padding:"0.55rem 0.7rem",marginBottom:"0.35rem",border:"1px solid #f5c84240"}}>
                            <div style={{display:"flex",gap:"0.4rem",marginBottom:"2px"}}>
                              <span style={{fontSize:"0.7rem",fontWeight:"700",color:"#b07800"}}>{subj}</span>
                              {date&&<span style={{fontSize:"0.65rem",color:pal.stone}}>{date}</span>}
                            </div>
                            <div style={{fontSize:"0.75rem",color:pal.inkM,lineHeight:1.5}}>{reason}</div>
                          </div>
                        );
                      })}
                      <div style={{fontSize:"0.65rem",color:pal.stone,marginTop:"0.4rem",fontStyle:"italic"}}>{"To tag an entry as a milestone, find it in the Subject Timeline."}</div>
                    </div>
                  ):suggestLoading?(
                    <div style={{background:"#fffbeb",borderRadius:"13px",padding:"0.75rem",border:"1.5px solid #f5c84230",textAlign:"center"}}>
                      <div style={{fontSize:"0.78rem",color:"#b07800",fontWeight:"700"}}>{"Scanning notes for milestone moments\u2026"}</div>
                    </div>
                  ):(
                    <button onClick={generateSuggestions}
                      style={{width:"100%",padding:"0.65rem",border:"1.5px dashed #f5c842",borderRadius:"13px",background:"#fffbeb",color:"#b07800",fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                      {"\u2728 Find missed milestones in my notes"}
                    </button>
                  )}
                  {suggestError==="none"&&<div style={{fontSize:"0.7rem",color:pal.slate,textAlign:"center",marginTop:"0.35rem",fontStyle:"italic"}}>{"No strong candidates found \u2014 keep logging!"}</div>}
                  {suggestError==="no_key"&&<div style={{fontSize:"0.7rem",color:"#b07800",textAlign:"center",marginTop:"0.35rem"}}>{"Add an API key in Settings to use AI features."}</div>}
                  {suggestError==="error"&&<div style={{fontSize:"0.7rem",color:"#cc4444",textAlign:"center",marginTop:"0.35rem"}}>{"Could not generate \u2014 check connection."}</div>}
                </div>
              )}

              {milestones.length===0?(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem 1.2rem",textAlign:"center",border:"1.5px solid "+pal.stone+"25"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{"🌟"}</div>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.9rem",marginBottom:"0.4rem"}}>{"No milestones yet"}</div>
                  <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.65}}>
                    {"When you log a subject, tap the 🌟 icon to mark it as a milestone. First time reading a chapter book, mastering multiplication tables, finishing a big project — capture those moments here."}
                  </div>
                </div>
              ):(
                milestones.map((e,i)=>{
                  const so=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(x=>x.label===e.subj);
                  return (
                    <div key={e.id||i} style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.6rem",border:"2px solid "+cp.c1+"30",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,bottom:0,width:"4px",background:"linear-gradient(180deg,"+cp.c1+","+cp.c2+")"}}/>
                      <div style={{paddingLeft:"0.4rem"}}>
                        <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.35rem"}}>
                          <span style={{fontSize:"1rem"}}>{so?.icon||"📋"}</span>
                          <span style={{fontWeight:"700",color:cp.c1,fontSize:"0.78rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{e.subj}</span>
                          <span style={{fontSize:"0.65rem",color:pal.stone,marginLeft:"auto"}}>{e.date}</span>
                        </div>
                        <div style={{fontSize:"0.84rem",color:pal.ink,lineHeight:1.65}}>{e.note.replace("AI Summary:","").trim()}</div>
                        {e.readingTitle&&<div style={{fontSize:"0.72rem",color:pal.primary,marginTop:"4px",fontStyle:"italic"}}>{"📖 "+e.readingTitle}</div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })()}

            {/* ====== SKILLS TAB ====== */}
        {activeTab==="skills"&&(()=>{
          const gradeSkillsP = EOY_SKILLS[ch?.grade]||EOY_SKILLS["5th"]||[];
          const SKILLS_KEY_P = "rootbloom_eoy_skills_"+(ch?.id||"")+"_"+(family.yearEnd||"");
          const NOTES_KEY_P  = "rootbloom_eoy_notes_"+(ch?.id||"")+"_"+(family.yearEnd||"");
          const [skillsP, setSkillsP] = React.useState(()=>{
            try{ return JSON.parse(localStorage.getItem(SKILLS_KEY_P)||"{}"); }catch(e){return {};}
          });
          const [notesP, setNotesP] = React.useState(()=>{
            try{ return JSON.parse(localStorage.getItem(NOTES_KEY_P)||"{}"); }catch(e){return {};}
          });
          const [expandedKey, setExpandedKey] = React.useState(null);
          const toggleSkillP = (cat,i) => {
            const k=cat+"_"+i;
            const next={...skillsP,[k]:!skillsP[k]};
            setSkillsP(next);
            try{ localStorage.setItem(SKILLS_KEY_P,JSON.stringify(next)); }catch(e){}
            if(!skillsP[k]) setExpandedKey(k);
            else if(expandedKey===k) setExpandedKey(null);
          };
          const saveNoteP = (k,val) => {
            const next={...notesP,[k]:val};
            setNotesP(next);
            try{ localStorage.setItem(NOTES_KEY_P,JSON.stringify(next)); }catch(e){}
          };
          const totalP = gradeSkillsP.reduce((s,c)=>s+c.skills.length,0);
          const checkedP = Object.values(skillsP).filter(Boolean).length;
          const pctP = totalP>0?Math.round(checkedP/totalP*100):0;
          const printSkills = () => {
            const win = window.open("","_blank","width=800,height=1000,scrollbars=yes");
            if(!win) return;
            const sn = family.schoolName||(family.familyName+" Academy")||"Home School";
            const td = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
            let rows = "";
            gradeSkillsP.forEach(cat=>{
              rows += "<tr><td colspan='3' style='background:#f0f0f0;font-weight:700;font-size:9pt;padding:6px 10px;text-transform:uppercase;letter-spacing:0.08em;color:#555'>"+cat.cat+"</td></tr>";
              cat.skills.forEach((skill,si)=>{
                const k=cat.cat+"_"+si; const done=skillsP[k]; const note=notesP[k]||"";
                rows += "<tr style='border-bottom:1px solid #f0f0f0'><td style='padding:6px 10px;width:22px;text-align:center;font-size:11pt'>"+(done?"&#9989;":"&#9633;")+"</td><td style='padding:6px 10px;font-size:9.5pt;color:"+(done?"#2a6a2a":"#333")+"'>"+skill+"</td><td style='padding:6px 10px;font-size:8.5pt;color:#777;font-style:italic'>"+note+"</td></tr>";
              });
            });
            win.document.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Skills Checklist</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;padding:0}@media print{@page{margin:1.5cm;size:letter}}.hdr{background:#1e3a2a;color:#fff;padding:18px 24px}.hdr h1{font-size:16pt;margin:0 0 3px}.hdr p{font-size:9pt;color:rgba(255,255,255,0.65);margin:0}table{width:calc(100% - 48px);border-collapse:collapse;margin:12px 24px}.disclaimer{margin:10px 24px;padding:8px 12px;background:#fffbeb;border:1px solid #f5c842;border-radius:6px;font-size:8pt;color:#7a5500}.footer{margin:16px 24px;font-size:8pt;color:#aaa;border-top:1px solid #eee;padding-top:8px;display:flex;justify-content:space-between}</style></head><body><div class='hdr'><h1>"+ch?.name+" \u2014 "+ch?.grade+" Grade Skills</h1><p>"+sn+" \u00b7 "+td+" \u00b7 "+checkedP+" of "+totalP+" skills</p></div><div class='disclaimer'>\u26a0\ufe0f This checklist reflects general grade-level benchmarks as a helpful reference guide only \u2014 not a pass/fail evaluation, legal requirement, or standardized measure. Homeschool families are not obligated to follow any particular scope or sequence. Use this to celebrate progress and explore areas for growth.</div><table>"+rows+"</table><div class='footer'><span>Generated by Root &amp; Bloom</span><span>"+sn+"</span></div><button onclick='window.print()' style='margin:0 24px 20px;padding:8px 18px;background:#1e3a2a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:10pt'>Print / Save PDF</button></body></html>");
            win.document.close();
          };
          return (
            <div>
              <div style={{background:"linear-gradient(135deg,"+cp.c1+"14,"+cp.c2+"08)",borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.75rem",border:"1.5px solid "+cp.c1+"25"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"3px"}}>{ch?.grade+" Grade Skills"}</div>
                    <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.5rem"}}>{ch?.name+" \u00b7 "+checkedP+" of "+totalP+" \u00b7 "+pctP+"%"}</div>
                  </div>
                  <button onClick={printSkills} style={{padding:"0.3rem 0.65rem",border:"1.5px solid "+cp.c1+"50",borderRadius:"8px",background:"transparent",color:cp.c1,fontWeight:"700",fontSize:"0.65rem",cursor:"pointer",flexShrink:0,marginLeft:"0.5rem"}}>{"\ud83d\udda8 Print"}</button>
                </div>
                <div style={{height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pctP+"%",borderRadius:"99px",background:"linear-gradient(90deg,"+cp.c1+","+cp.c2+")",transition:"width 0.4s"}}/>
                </div>
              </div>
              <div style={{background:"#fff8e6",borderRadius:"12px",padding:"0.7rem 0.85rem",marginBottom:"0.85rem",border:"1.5px solid #f5c84260"}}>
                <div style={{fontWeight:"800",color:"#7a5500",fontSize:"0.72rem",marginBottom:"3px"}}>{"\u26a0\ufe0f Guide only \u2014 not a requirement"}</div>
                <div style={{fontSize:"0.68rem",color:"#7a5500",lineHeight:1.65}}>{"This checklist reflects general grade-level benchmarks as a helpful reference \u2014 not a pass/fail evaluation, legal requirement, or standardized measure. Every child learns differently and at their own pace. Homeschool families are not obligated to follow any particular scope or sequence. Use this to celebrate progress and explore areas for growth, nothing more."}</div>
              </div>
              {gradeSkillsP.map((cat)=>(
                <div key={cat.cat} style={{marginBottom:"1rem"}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"800",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.4rem"}}>{cat.cat}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                    {cat.skills.map((skill,si)=>{
                      const key=cat.cat+"_"+si; const done=skillsP[key]; const isExp=expandedKey===key; const hasNote=notesP[key]&&notesP[key].trim();
                      return (
                        <div key={si} style={{borderRadius:"10px",overflow:"hidden",border:"1.5px solid "+(done?pal.good+"40":pal.stone+"25")}}>
                          <button onClick={()=>toggleSkillP(cat.cat,si)}
                            style={{display:"flex",gap:"0.55rem",alignItems:"center",padding:"0.42rem 0.6rem",background:done?pal.goodBg:pal.linen,cursor:"pointer",textAlign:"left",width:"100%",border:"none"}}>
                            <div style={{width:"20px",height:"20px",borderRadius:"5px",border:"2px solid "+(done?pal.good:pal.stone),background:done?pal.good:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {done&&<span style={{color:"#fff",fontSize:"0.7rem",fontWeight:"900"}}>{"\u2713"}</span>}
                            </div>
                            <span style={{flex:1,fontSize:"0.78rem",color:done?pal.good:pal.inkM,fontWeight:done?"600":"400",textDecoration:done?"line-through":"none",lineHeight:1.45}}>{skill}</span>
                            {done&&<span onClick={(e)=>{e.stopPropagation();setExpandedKey(isExp?null:key);}} style={{fontSize:"0.65rem",color:pal.slate,cursor:"pointer",flexShrink:0,padding:"0 2px"}}>{hasNote?"\ud83d\udcdd":isExp?"\u2303":"+ note"}</span>}
                          </button>
                          {done&&isExp&&(
                            <div style={{padding:"0.4rem 0.6rem 0.5rem",background:"#fff",borderTop:"1px solid "+pal.stone+"20"}}>
                              <textarea value={notesP[key]||""} onChange={e=>saveNoteP(key,e.target.value)}
                                placeholder={"How did "+ch?.name+" demonstrate this? (optional)"}
                                rows={2} style={{width:"100%",padding:"0.4rem 0.55rem",border:"1.5px solid "+pal.stone,borderRadius:"8px",fontSize:"0.75rem",color:pal.ink,background:pal.parchm,resize:"none",outline:"none",fontFamily:"inherit",lineHeight:1.5}}/>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

      </div>
    </div>
  );
}


function TranscriptsScreen({pal,family,portfolioEntries=[],attendanceDays=0,coopLog=[],observationLog=[]}){
  const [activeChild, setActiveChild] = useState(0);
  const [activeView,  setActiveView]  = useState("overview"); // overview | transcript | reading | narrative
  const [showDigest,  setShowDigest]  = useState(false);
  const [savedPulses, setSavedPulses] = useState(()=>{ try{ const s=localStorage.getItem("rootbloom_pulses"); return s?JSON.parse(s):[]; }catch(e){return [];} });

  const ch = family.children[activeChild];
  if(!ch) return null;

  const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(ch.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const REQUIRED = parseInt((getStateInfo(family.state||"").hours||"180").match(/\d+/)?.[0]||"180");
  const schoolName = family.schoolName||(family.familyName+" Academy")||"Home School";
  const yearStart  = family.yearStart ? new Date(family.yearStart).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—";
  const yearEnd    = family.yearEnd   ? new Date(family.yearEnd).toLocaleDateString("en-US",{month:"long",year:"numeric"})   : "—";
  const pct = REQUIRED ? Math.min(100,Math.round((attendanceDays/REQUIRED)*100)) : null;
  const isHighSchool = gradeLevel(ch.grade)==="high";

  const childEntries = portfolioEntries.filter(e=>e.childIdx===activeChild);
  const subjEntries  = childEntries.filter(e=>!e.isDay && e.subj!=="Daily Notes");
  const readingEntries = childEntries.filter(e=>
    (e.subj==="Reading"||e.subj==="Reading/Language Arts"||e.subj==="Bible / Faith") &&
    (e.readingTitle||e.title)
  );
  const childCoopHrs = coopLog.reduce((sum,l)=>sum+(l.hrs||0),0);

  const customSubjs = family.customSubjects||[];
  const allSubjMap  = Object.fromEntries([...SUBJECT_OPTIONS,...customSubjs].map(s=>[s.id,s]));
  const activeSubjs = (family.subjects||[]).map(id=>allSubjMap[id]).filter(Boolean);

  // Group entries by subject
  const bySubject = {};
  subjEntries.forEach(e=>{
    if(!bySubject[e.subj]) bySubject[e.subj]={count:0,entries:[]};
    bySubject[e.subj].count++;
    bySubject[e.subj].entries.push(e);
  });

  // Subject grades/credits — stored per child per year
  const GRADES_KEY = "rootbloom_subj_grades_"+ch.id+"_"+(family.yearEnd||"");
  const [subjGrades, setSubjGrades] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem(GRADES_KEY)||"{}"); }catch(e){return {};}
  });
  const updateSubjGrade = (subj, field, val) => {
    const updated = {...subjGrades, [subj]:{...(subjGrades[subj]||{}), [field]:val}};
    setSubjGrades(updated);
    try{ localStorage.setItem(GRADES_KEY, JSON.stringify(updated)); }catch(e){}
  };

  const printRecord = () => {
    const win = window.open("","_blank","width=860,height=1000,scrollbars=yes");
    if(!win) return;

    // Build course rows
    const courseRows = allSubjNames.map(subj=>{
      const cnt = bySubject[subj]?.count||0;
      const sg  = subjGrades[subj]||{};
      if(isHighSchool){
        return `<tr>
          <td>${subj}</td>
          <td style="text-align:center;font-weight:700;color:${sg.grade?"#2a6a2a":"#999"}">${sg.grade||"—"}</td>
          <td style="text-align:center">${sg.credits||"—"}</td>
          <td style="text-align:center;color:${cnt>0?"#2a6a2a":"#999"}">${cnt>0?"Active":"Planned"}</td>
          <td style="text-align:right;color:#666">${cnt>0?cnt+" entries":"—"}</td>
        </tr>`;
      }
      return `<tr>
        <td>${subj}</td>
        <td style="text-align:center;color:${cnt>0?"#2a6a2a":"#999"}">${cnt>0?"Active":"Planned"}</td>
        <td style="text-align:right;color:#666">${cnt>0?cnt+" entries":"—"}</td>
      </tr>`;
    }).join("");

    const attendanceRow = REQUIRED
      ? `${attendanceDays} of ${REQUIRED} days (${pct}%)`
      : `${attendanceDays} days logged (${family.state||"your state"} has no day requirement)`;

    const gpaBlock = isHighSchool&&gpa
      ? `<div style="margin-top:1rem;padding:0.75rem 1rem;background:#f0f8f0;border-radius:8px;border-left:4px solid #2a6a2a;display:inline-block">
          <span style="font-size:1.1rem;font-weight:900;color:#2a6a2a">Cumulative GPA: ${gpa}</span>
          <span style="color:#666;font-size:0.8rem;margin-left:0.5rem">(${totalCredits} credits)</span>
        </div>`
      : "";

    const tableHeader = isHighSchool
      ? `<tr style="background:#f5f5f5"><th>Subject</th><th>Grade</th><th>Credits</th><th>Status</th><th style="text-align:right">Entries</th></tr>`
      : `<tr style="background:#f5f5f5"><th>Subject</th><th>Status</th><th style="text-align:right">Entries</th></tr>`;

    win.document.write(`<!DOCTYPE html><html><head><title>Transcript — ${ch.name}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Georgia,serif;color:#1a1a1a;background:#fff;padding:2.5rem;max-width:760px;margin:0 auto;font-size:10pt;line-height:1.5}
      h1{font-size:1.6rem;font-weight:900;color:#1a1a1a;margin-bottom:2px}
      .school-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:1rem;border-bottom:3px solid #2a6a2a;margin-bottom:1.5rem}
      .school-name{font-size:1.3rem;font-weight:900;color:#2a6a2a}
      .school-sub{font-size:0.8rem;color:#666;margin-top:3px}
      .badge{background:#2a6a2a;color:#fff;padding:0.3rem 0.75rem;border-radius:20px;font-size:0.75rem;font-weight:700}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1.5rem}
      .info-cell{padding:0.45rem 0.65rem;background:#f8f8f8;border-radius:6px;border-left:3px solid #2a6a2a}
      .info-label{font-size:0.62rem;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;font-family:Arial,sans-serif}
      .info-value{font-weight:700;font-size:0.88rem;color:#1a1a1a}
      .section-title{font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#666;margin-bottom:0.5rem;font-family:Arial,sans-serif}
      table{width:100%;border-collapse:collapse;margin-bottom:1rem;font-size:0.88rem}
      th{padding:0.45rem 0.65rem;text-align:left;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.05em;color:#555;font-family:Arial,sans-serif;font-weight:700}
      td{padding:0.45rem 0.65rem;border-bottom:1px solid #eee}
      tr:last-child td{border-bottom:none}
      .sig-block{display:flex;justify-content:space-between;margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #ccc}
      .sig-line{border-top:1px solid #333;padding-top:4px;font-size:0.7rem;color:#666;font-family:Arial,sans-serif}
      .sig-line.long{width:220px}
      .sig-line.short{width:130px}
      .print-btn{margin-top:1.5rem;padding:0.6rem 1.5rem;background:#2a6a2a;color:#fff;border:none;border-radius:8px;font-size:0.95rem;cursor:pointer;font-family:Arial,sans-serif;font-weight:700}
      .footer{margin-top:2rem;padding-top:0.75rem;border-top:1px solid #eee;font-size:0.68rem;color:#aaa;text-align:center;font-family:Arial,sans-serif}
      @media print{
        body{padding:1.5rem}
        .print-btn{display:none}
        .footer{display:none}
      }
    </style></head><body>

    <div class="school-header">
      <div>
        <div class="school-name">${schoolName}</div>
        <div class="school-sub">${family.state||""} ${family.state&&family.parentName?" · ":""}${family.parentName||""}</div>
      </div>
      <div class="badge">Official Transcript</div>
    </div>

    <div class="section-title">Student Information</div>
    <div class="info-grid">
      <div class="info-cell"><div class="info-label">Student Name</div><div class="info-value">${ch.name}</div></div>
      <div class="info-cell"><div class="info-label">Grade Level</div><div class="info-value">${ch.grade}</div></div>
      <div class="info-cell"><div class="info-label">School Year</div><div class="info-value">${yearStart} — ${yearEnd}</div></div>
      <div class="info-cell"><div class="info-label">State</div><div class="info-value">${family.state||"—"}</div></div>
      <div class="info-cell"><div class="info-label">Attendance</div><div class="info-value">${attendanceRow}</div></div>
      <div class="info-cell"><div class="info-label">Co-op Hours</div><div class="info-value">${childCoopHrs>0?childCoopHrs+"h logged":"—"}</div></div>
    </div>

    <div class="section-title">Course Record</div>
    <table><thead>${tableHeader}</thead><tbody>${courseRows||`<tr><td colspan="5" style="color:#999;text-align:center;padding:1rem">No courses recorded yet.</td></tr>`}</tbody></table>

    ${gpaBlock}

    <div class="sig-block">
      <div><div class="sig-line long">&nbsp;</div><div>Parent / Educator Signature</div></div>
      <div><div class="sig-line short">&nbsp;</div><div>Date</div></div>
    </div>

    <div class="footer">Generated by Root &amp; Bloom · ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>

    <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
    </body></html>`);
    win.document.close();
  };

  // All subjects to show (active + any with entries)
  const allSubjNames = [...new Set([...activeSubjs.map(s=>s.label),...Object.keys(bySubject)])];

  // GPA calc (only for graded subjects)
  const GRADE_POINTS = {"A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D":1.0,"F":0};
  const gradedSubjs  = allSubjNames.filter(s=>subjGrades[s]?.grade&&subjGrades[s]?.credits);
  const totalCredits = gradedSubjs.reduce((s,subj)=>s+parseFloat(subjGrades[subj]?.credits||0),0);
  const totalPoints  = gradedSubjs.reduce((s,subj)=>{
    const pts = GRADE_POINTS[subjGrades[subj]?.grade]??null;
    return pts!==null ? s + pts*parseFloat(subjGrades[subj]?.credits||0) : s;
  },0);
  const gpa = totalCredits>0 ? (totalPoints/totalCredits).toFixed(2) : null;

  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Records" sub="Transcripts & Reports" icon="🎓"/>
      <FirstVisitTip pal={pal} screen="transcripts"/>
      <div style={{padding:"0 1rem"}}>

        {/* Child tabs */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.85rem",overflowX:"auto"}}>
          {family.children.map((c,i)=>(
            <Chip key={c.id} pal={pal} label={c.avatar+" "+c.name} active={activeChild===i} onClick={()=>{setActiveChild(i);setActiveView("overview");}}/>
          ))}
        </div>

        {/* View tabs */}
        <div style={{display:"flex",background:pal.parchm,borderRadius:"11px",padding:"3px",gap:"2px",marginBottom:"1rem"}}>
          {(family.children.length>1?[["overview","📋","Overview"],["transcript","📜","Transcript"],["reading","📖","Reading Log"],["narrative","📝","Narrative"]]:[["overview","📋","Overview"],["transcript","📜","Transcript"],["reading","📖","Reading Log"],["narrative","📝","Narrative"]]).map(([id,icon,l])=>(
            <button key={id} onClick={()=>setActiveView(id)}
              style={{flex:1,padding:"0.42rem 0.2rem",border:"none",borderRadius:"9px",background:activeView===id?pal.linen:"transparent",color:activeView===id?pal.ink:pal.slate,fontSize:"0.62rem",fontWeight:activeView===id?"700":"400",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}>
              <span style={{fontSize:"0.8rem"}}>{icon}</span>
              <span>{l}</span>
            </button>
          ))}
        </div>

        {/* ====== OVERVIEW ====== */}
        {activeView==="overview"&&(<>

          {/* Student hero card */}
          <div style={{background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
            <div style={{display:"flex",gap:"0.85rem",alignItems:"center",position:"relative"}}>
              <div style={{width:"52px",height:"52px",borderRadius:"14px",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.9rem",flexShrink:0}}>{ch.avatar}</div>
              <div>
                <div style={{fontWeight:"900",color:"#fff",fontSize:"1.05rem"}}>{ch.name}</div>
                <div style={{fontSize:"0.76rem",color:"rgba(255,255,255,0.82)"}}>{ch.grade} {"\u00b7"} {schoolName}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.65)",marginTop:"2px"}}>{family.state} {"\u00b7"} {yearStart} {"\u2014"} {yearEnd}</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.45rem",marginBottom:"1rem"}}>
            {[
              {l:"Days",     v:attendanceDays,          c:pal.primary,  bg:pal.pale},
              {l:"Entries",  v:subjEntries.length,       c:pal.mid,      bg:pal.paleMid},
              {l:"Subjects", v:allSubjNames.length,      c:pal.accentD,  bg:pal.pale},
              {l:"Co-op hrs",v:childCoopHrs>0?childCoopHrs+"h":"—", c:pal.good, bg:pal.goodBg},
            ].map(s=>(
              <div key={s.l} style={{background:s.bg,borderRadius:"12px",padding:"0.65rem 0.4rem",textAlign:"center",border:`1.5px solid ${s.c}22`}}>
                <div style={{fontWeight:"900",color:s.c,fontSize:"1.1rem",lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:"0.55rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:"3px"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Attendance bar — only show if state tracks days */}
          <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
              <span style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem"}}>Attendance</span>
              <span style={{fontWeight:"800",color:pct!==null?(pct>=68?pal.good:pal.warn):pal.good,fontSize:"0.78rem"}}>
                {pct!==null?attendanceDays+" / "+REQUIRED+" days":attendanceDays+" days logged"}
              </span>
            </div>
            {pct!==null&&(
              <div style={{height:"9px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"5px"}}>
                <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:pct>=68?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.5s"}}/>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",color:pal.slate}}>
              <span>{yearStart}</span>
              <span>{pct!==null?pct+"% complete":(family.state||"Your state")+" — no day requirement"}</span>
              <span>{yearEnd}</span>
            </div>
          </div>

          {/* Subjects breakdown */}
          {allSubjNames.length>0&&(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.55rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>Portfolio by Subject</div>
                {isHighSchool&&gpa&&<div style={{fontWeight:"900",color:cp.c1,fontSize:"0.88rem"}}>GPA: {gpa}</div>}
              </div>
              {allSubjNames.map((subj,i,a)=>{
                const cnt = bySubject[subj]?.count||0;
                const maxCnt = Math.max(...allSubjNames.map(s=>bySubject[s]?.count||0),1);
                const sg = subjGrades[subj]||{};
                return (
                  <div key={subj} style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:i<a.length-1?"0.5rem":"0"}}>
                    <div style={{width:"90px",fontSize:"0.74rem",color:pal.inkM,fontWeight:"600",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subj}</div>
                    <div style={{flex:1,height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.round(cnt/maxCnt*100)}%`,borderRadius:"99px",background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,transition:"width 0.4s"}}/>
                    </div>
                    <div style={{fontSize:"0.68rem",color:pal.slate,minWidth:"28px",textAlign:"right",flexShrink:0}}>{cnt}</div>
                    {isHighSchool&&sg.grade&&<div style={{fontSize:"0.68rem",fontWeight:"800",color:cp.c1,flexShrink:0,minWidth:"24px",textAlign:"right"}}>{sg.grade}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Goals */}
          {(family.goals||[]).length>0&&(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.5rem"}}>Family Goals</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.38rem"}}>
                {(family.goals||[]).map(id=>{
                  const g=[...GOALS,...(family.customGoals||[])].find(x=>x.id===id);
                  const nudge = GOAL_NUDGES[id];
                  const cnt = nudge?.subjs?.length>0 ? subjEntries.filter(e=>nudge.subjs.includes(e.subj)).length : 0;
                  return g?(
                    <div key={id} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.22rem 0.6rem",background:cnt>0?pal.goodBg:pal.pale,borderRadius:"20px",border:`1.5px solid ${cnt>0?pal.good+"50":pal.primary+"30"}`}}>
                      <span style={{fontSize:"0.82rem"}}>{nudge?.icon||g.icon}</span>
                      <span style={{fontSize:"0.7rem",fontWeight:"700",color:cnt>0?pal.good:pal.primary}}>{g.label}</span>
                      {cnt>0&&<span style={{fontSize:"0.64rem",color:pal.good,fontWeight:"800"}}>{cnt}</span>}
                    </div>
                  ):null;
                })}
              </div>
            </div>
          )}

          {/* Curriculum */}
          {(family.curriculumBrands||[]).length>0&&(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.5rem"}}>Curriculum Programs</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.38rem"}}>
                {(family.curriculumBrands||[]).map(id=>{
                  const b=CURRICULUM_BRANDS.find(x=>x.id===id);
                  return b?<span key={id} style={{padding:"0.2rem 0.6rem",background:pal.pale,borderRadius:"20px",fontSize:"0.73rem",fontWeight:"600",color:pal.primary}}>{b.label}</span>:null;
                })}
              </div>
            </div>
          )}
          <div style={{height:"0.5rem"}}/>
        </>)}

        {/* ====== TRANSCRIPT VIEW ====== */}
        {activeView==="transcript"&&(<>
          <div style={{background:pal.linen,borderRadius:"18px",padding:"1.2rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>

            {/* Header */}
            <div style={{borderBottom:`2px solid ${cp.c1}40`,paddingBottom:"0.85rem",marginBottom:"0.9rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontWeight:"900",color:cp.c1,fontSize:"1rem"}}>{schoolName}</div>
                <div style={{fontSize:"0.7rem",color:pal.slate}}>{family.state} {"\u00b7"} {family.parentName}</div>
              </div>
              <button onClick={printRecord} style={{padding:"0.3rem 0.7rem",borderRadius:"8px",border:"none",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.7rem",cursor:"pointer"}}>{"🖨 Print"}</button>
            </div>

            {/* Student info grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem",marginBottom:"1rem"}}>
              {[
                ["Student",ch.name],
                ["Grade",ch.grade],
                ["School Year",yearStart+" — "+yearEnd],
                ["State",family.state||"—"],
                ["Days Completed", REQUIRED ? attendanceDays+" / "+REQUIRED+" ("+pct+"%)" : attendanceDays+" logged"],
                ["Co-op Hours",childCoopHrs>0?childCoopHrs+"h logged":"—"],
              ].map(([l,v])=>(
                <div key={l} style={{padding:"0.42rem 0.6rem",background:pal.sand,borderRadius:"8px"}}>
                  <div style={{fontSize:"0.58rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"2px"}}>{l}</div>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.77rem"}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Course Record */}
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.5rem"}}>
              Course Record {isHighSchool&&gpa?<span style={{color:cp.c1,marginLeft:"0.5rem"}}>{"GPA: "+gpa}</span>:null}
            </div>

            {isHighSchool&&(
              <div style={{background:pal.pale,borderRadius:"10px",padding:"0.5rem 0.75rem",marginBottom:"0.65rem",fontSize:"0.71rem",color:pal.primary,border:`1.5px solid ${pal.primary}20`,lineHeight:1.5}}>
                {"🎓 High school mode — enter letter grades and credits for each subject below."}
              </div>
            )}

            {allSubjNames.length===0?(
              <div style={{fontSize:"0.78rem",color:pal.slate,textAlign:"center",padding:"0.75rem"}}>No subjects recorded yet.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginBottom:"0.85rem"}}>
                {isHighSchool&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 70px 70px 80px",gap:"0.35rem",padding:"0 0.4rem",marginBottom:"0.1rem"}}>
                    {["Subject","Grade","Credits","Status"].map(h=>(
                      <div key={h} style={{fontSize:"0.58rem",color:pal.slate,fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</div>
                    ))}
                  </div>
                )}
                {allSubjNames.map(subj=>{
                  const cnt = bySubject[subj]?.count||0;
                  const sg  = subjGrades[subj]||{};
                  const status = cnt>0?"Active":"Planned";
                  if(isHighSchool){
                    return (
                      <div key={subj} style={{display:"grid",gridTemplateColumns:"1fr 70px 70px 80px",gap:"0.35rem",alignItems:"center",padding:"0.45rem 0.5rem",background:pal.parchm,borderRadius:"9px"}}>
                        <span style={{fontSize:"0.79rem",fontWeight:"600",color:pal.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subj}</span>
                        <select value={sg.grade||""} onChange={e=>updateSubjGrade(subj,"grade",e.target.value)}
                          style={{padding:"0.22rem 0.3rem",border:`1.5px solid ${sg.grade?cp.c1:pal.stone+"60"}`,borderRadius:"7px",fontSize:"0.77rem",background:sg.grade?pal.pale:"#fff",color:sg.grade?cp.c1:pal.inkM,fontWeight:sg.grade?"800":"400",outline:"none",cursor:"pointer"}}>
                          <option value="">—</option>
                          {["A+","A","A-","B+","B","B-","C+","C","C-","D","F"].map(g=><option key={g} value={g}>{g}</option>)}
                        </select>
                        <select value={sg.credits||""} onChange={e=>updateSubjGrade(subj,"credits",e.target.value)}
                          style={{padding:"0.22rem 0.3rem",border:`1.5px solid ${sg.credits?cp.c1:pal.stone+"60"}`,borderRadius:"7px",fontSize:"0.77rem",background:sg.credits?pal.pale:"#fff",color:sg.credits?cp.c1:pal.inkM,fontWeight:sg.credits?"800":"400",outline:"none",cursor:"pointer"}}>
                          <option value="">—</option>
                          {["0.5","1.0","1.5","2.0"].map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                        <span style={{fontSize:"0.68rem",color:cnt>0?pal.good:pal.slate,fontWeight:"700"}}>{status}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={subj} style={{display:"flex",alignItems:"center",padding:"0.5rem 0.65rem",background:pal.parchm,borderRadius:"9px",gap:"0.6rem"}}>
                      <span style={{flex:1,fontSize:"0.8rem",fontWeight:"600",color:pal.ink}}>{subj}</span>
                      <span style={{fontSize:"0.68rem",color:cnt>0?pal.good:pal.slate,fontWeight:"700"}}>{status}</span>
                      <span style={{fontSize:"0.68rem",color:pal.slate,minWidth:"60px",textAlign:"right"}}>{cnt>0?cnt+" entries":"—"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Signature block */}
            <div style={{marginTop:"1.2rem",paddingTop:"0.85rem",borderTop:`1px solid ${pal.stone}40`,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{borderBottom:`1px solid ${pal.inkM}`,width:"160px",height:"28px",marginBottom:"3px"}}/>
                <div style={{fontSize:"0.62rem",color:pal.slate}}>Parent / Educator Signature</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{borderBottom:`1px solid ${pal.inkM}`,width:"90px",height:"28px",marginBottom:"3px",marginLeft:"auto"}}/>
                <div style={{fontSize:"0.62rem",color:pal.slate}}>Date</div>
              </div>
            </div>
          </div>

          {/* Daily Log — all saved portfolio days, searchable by date */}
        <DailyLogSection pal={pal} cp={cp} ch={ch} childEntries={childEntries} subjEntries={subjEntries}/>

          <div style={{height:"0.5rem"}}/>
        </>)}

        {/* ====== READING LOG VIEW ====== */}
        {activeView==="reading"&&(<>
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.7rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.76rem",color:pal.inkM,lineHeight:1.6}}>
            {"📖 Florida and Pennsylvania require reading titles to be logged by name. This log pulls from your portfolio entries that have a book or material title recorded."}
          </div>

          {readingEntries.length===0?(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"1.5rem",textAlign:"center",border:`1.5px solid ${pal.stone}30`,marginBottom:"1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>📚</div>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.86rem",marginBottom:"0.25rem"}}>No reading titles logged yet</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.5}}>When you log a Reading entry and include a book title, it will appear here. Florida families must log titles by name.</div>
            </div>
          ):(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.55rem"}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>Reading Log</div>
                <div style={{fontSize:"0.7rem",color:pal.slate,fontWeight:"600"}}>{readingEntries.length} title{readingEntries.length!==1?"s":""}</div>
              </div>
              <div style={{background:pal.linen,borderRadius:"14px",border:`1.5px solid ${pal.stone}30`,overflow:"hidden",marginBottom:"1rem"}}>
                {readingEntries.map((e,i)=>(
                  <div key={e.id||i} style={{display:"flex",gap:"0.65rem",alignItems:"flex-start",padding:"0.65rem 0.85rem",borderTop:i>0?`1px solid ${pal.stone}20`:"none"}}>
                    <span style={{fontSize:"1rem",flexShrink:0,marginTop:"1px"}}>{"📖"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem",lineHeight:1.3}}>{e.readingTitle||e.title}</div>
                      <div style={{fontSize:"0.65rem",color:pal.slate,marginTop:"2px"}}>{e.subj} {"\u00b7"} {e.date}</div>
                      {e.note&&e.note.trim()&&(
                        <div style={{fontSize:"0.72rem",color:pal.inkM,marginTop:"3px",fontStyle:"italic",lineHeight:1.5}}>{e.note.slice(0,100)}{e.note.length>100?"...":""}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={printRecord}
                style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer",marginBottom:"1rem"}}>
                {"🖨 Print Reading Log"}
              </button>
            </>
          )}
          <div style={{height:"0.5rem"}}/>
        </>)}

        {/* ====== NARRATIVE VIEW ====== */}
        {activeView==="narrative"&&(<>
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.78rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.77rem",color:pal.inkM,lineHeight:1.6}}>
            {"💡 The narrative uses AI to write a warm annual summary. Add your key in Settings \u2192 AI to generate. You can also write or edit your own below."}
          </div>
          <div style={{background:pal.linen,borderRadius:"18px",padding:"1.2rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{borderBottom:`2px solid ${cp.c1}40`,paddingBottom:"0.75rem",marginBottom:"0.85rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontWeight:"900",color:cp.c1,fontSize:"0.95rem"}}>{schoolName}</div>
                <div style={{fontSize:"0.68rem",color:pal.slate}}>Annual Narrative Report {"\u00b7"} {new Date().getFullYear()}</div>
              </div>
              <button onClick={printRecord} style={{padding:"0.3rem 0.7rem",borderRadius:"8px",border:"none",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.7rem",cursor:"pointer"}}>{"🖨 Print"}</button>
            </div>
            <div style={{marginBottom:"0.85rem"}}>
              <div style={{fontSize:"0.72rem",fontWeight:"700",color:pal.inkM,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.2rem"}}>Student</div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.92rem"}}>{ch.name} {"\u00b7"} {ch.grade}</div>
            </div>
            <NarrativeEditor pal={pal} ch={ch} family={family} bySubject={bySubject} attendanceDays={attendanceDays} schoolName={schoolName} cp={cp} observationLog={observationLog}/>
          </div>
          <div style={{height:"0.5rem"}}/>
        </>)}

      </div>
      <style>{`@media print {
  nav, .no-print, button { display:none!important }
  body { background: white!important; font-family: Georgia, serif!important; }
  #root > div { max-width: 100%!important; }
}`}</style>
      {showDigest&&(
        <WeeklyDigestModal
          pal={pal} family={family}
          savedPulses={savedPulses}
          portfolioEntries={portfolioEntries}
          attendanceDays={attendanceDays}
          onClose={()=>setShowDigest(false)}
        />
      )}
    </div>
  );
}


/* ============================================================
   WEEKLY DIGEST MODAL
   Zero AI calls -- reads savedPulses + portfolio data
   ============================================================ */
function WeeklyDigestModal({ pal, family, savedPulses=[], portfolioEntries=[], attendanceDays=0, onClose }) {
  const today    = new Date();
  const dow      = today.getDay();
  const weekStart= new Date(today); weekStart.setDate(today.getDate()-(dow===0?6:dow-1)); weekStart.setHours(0,0,0,0);
  const weekEnd  = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6);
  const yr       = today.getFullYear();

  const isThisWeek = (dateStr) => {
    try{ const d=new Date(dateStr+", "+yr); return d>=weekStart&&d<=weekEnd; }catch(e){return false;}
  };

  const weekStart2Wks = new Date(weekStart); weekStart2Wks.setDate(weekStart.getDate()-7);

  // Most recent pulse (this week or last week)
  const latestPulse = savedPulses[0]||null;

  // Week data per child
  const childDigests = family.children.map((c,ci)=>{
    const entries = portfolioEntries.filter(e=>e.childIdx===ci&&!e.isDay);
    const weekEntries = entries.filter(e=>isThisWeek(e.date));
    const subjs = [...new Set(weekEntries.map(e=>e.subj))];
    const milestones = weekEntries.filter(e=>e.isMilestone);
    const quizEntries = weekEntries.filter(e=>e.isQuizResult&&e.quizData);
    const quizBySubj = {};
    quizEntries.forEach(e=>{
      if(!quizBySubj[e.subj]) quizBySubj[e.subj]={score:0,total:0,count:0};
      quizBySubj[e.subj].score+=e.quizData.score;
      quizBySubj[e.subj].total+=e.quizData.total;
      quizBySubj[e.subj].count++;
    });
    const photos = weekEntries.flatMap(e=>e.photos||[]).slice(0,4);
    return {c,ci,weekEntries,subjs,milestones,quizBySubj,photos};
  });

  const letterGrade = (pct) => pct>=93?"A+":pct>=90?"A":pct>=87?"B+":pct>=83?"B":pct>=80?"B-":pct>=77?"C+":pct>=73?"C":pct>=70?"C-":pct>=60?"D":"F";
  const gradeCol    = (g) => g.startsWith("A")?"#1a6e40":g.startsWith("B")?"#2563a8":g.startsWith("C")?"#7a5500":"#cc2222";

  const weekLabel = weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})
    +" \u2013 "+weekEnd.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

  const parsePulse = (text) => {
    const sections = [];
    const patterns = [
      {key:"strengths",label:"Strengths",    icon:"\u2B50",col:"#1a6e40",bg:"#edf9f0"},
      {key:"growth",   label:"Growth Areas", icon:"\uD83C\uDF31",col:"#b07800",bg:"#fff8e6"},
      {key:"overall",  label:"Overall",      icon:"\u2728",  col:pal.primary,bg:pal.pale},
    ];
    const upper = text.toUpperCase();
    patterns.forEach(p=>{
      const marker = p.key==="growth"?"GROWTH AREAS:":p.key.toUpperCase()+":";
      const idx = upper.indexOf(marker);
      if(idx===-1) return;
      const start = idx+marker.length;
      const nextIdxs = patterns.filter(pp=>pp.key!==p.key)
        .map(pp=>{ const m=pp.key==="growth"?"GROWTH AREAS:":pp.key.toUpperCase()+":"; return upper.indexOf(m,start); })
        .filter(i=>i>start);
      const end = nextIdxs.length>0?Math.min(...nextIdxs):text.length;
      const body = text.slice(start,end).trim();
      if(body) sections.push({...p,body});
    });
    return sections;
  };

  const handleDownload = () => {
    const sn = family.schoolName||(family.familyName+" Academy")||"Ramos Academy";
    const todayFmt = today.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    let html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Weekly Digest "+weekLabel+"</title>"
      +"<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,serif;font-size:11px;color:#1a1a1a;padding:0.6in 0.75in;max-width:8.5in;margin:0 auto}"
      +"h1{font-size:20px;font-weight:bold;margin-bottom:4px}.meta{font-size:9px;color:#666;border-bottom:2px solid #1a1a1a;padding-bottom:8px;margin-bottom:16px}"
      +".child-block{margin-bottom:20px;break-inside:avoid}.child-name{font-size:14px;font-weight:bold;margin-bottom:8px;color:#1a1a1a}"
      +".subj-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.chip{background:#e8f0e8;color:#2a4a28;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;border-radius:4px;padding:2px 7px}"
      +".quiz-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}"
      +".quiz-cell{text-align:center;border-radius:6px;padding:6px 4px;border:1.5px solid #eee}"
      +".milestone-item{display:flex;gap:6px;padding:4px 0;font-size:10px;border-bottom:1px solid #f5f5f5;align-items:baseline}"
      +".pulse-section{margin-bottom:8px;padding:8px 10px;border-radius:6px}"
      +".footer{margin-top:20px;padding-top:8px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:8px;color:#aaa}"
      +"@media print{button{display:none}@page{margin:1cm;size:letter}}</style></head><body>"
      +"<h1>Weekly Digest</h1>"
      +"<div class='meta'>"+sn+" &bull; "+weekLabel+" &bull; "+todayFmt+"</div>";

    childDigests.forEach(({c,weekEntries,subjs,milestones,quizBySubj})=>{
      if(weekEntries.length===0) return;
      html += "<div class='child-block'>"
        +"<div class='child-name'>"+c.avatar+" "+c.name+" &mdash; "+c.grade+"</div>"
        +"<div style='font-size:9px;color:#888;margin-bottom:6px'>"+weekEntries.length+" entries logged &bull; "+subjs.length+" subjects</div>"
        +"<div class='subj-chips'>"+subjs.map(s=>"<span class='chip'>"+s+"</span>").join("")+"</div>";
      if(Object.keys(quizBySubj).length>0){
        html += "<div style='font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#555;margin-bottom:5px'>Quiz Scores</div>"
          +"<div class='quiz-grid'>";
        Object.entries(quizBySubj).forEach(([subj,d])=>{
          const pct=d.total>0?Math.round((d.score/d.total)*100):0;
          const g=letterGrade(pct); const col=gradeCol(g);
          html += "<div class='quiz-cell' style='background:"+col+"10;border-color:"+col+"30'>"
            +"<div style='font-size:14px;font-weight:900;color:"+col+"'>"+g+"</div>"
            +"<div style='font-size:7px;font-weight:700;color:#333'>"+subj+"</div>"
            +"<div style='font-size:7px;color:#999'>"+pct+"%</div></div>";
        });
        html += "</div>";
      }
      if(milestones.length>0){
        html += "<div style='font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#555;margin-bottom:4px;margin-top:8px'>Milestones &#11088;</div>";
        milestones.forEach(e=>{
          html += "<div class='milestone-item'><span style='color:#f5c842'>&#11088;</span><span style='font-style:italic'>"+(e.note||e.title||"").replace("AI Summary:","").trim()+"</span></div>";
        });
      }
      html += "</div>";
    });

    if(latestPulse){
      html += "<div style='margin-bottom:16px;break-inside:avoid'>"
        +"<div style='font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#555;margin-bottom:6px'>AI Progress Summary</div>"
        +"<div style='font-size:10px;color:#333;line-height:1.65;background:#f8f8f8;border-left:3px solid #2a4a28;padding:8px 12px;border-radius:0 6px 6px 0'>"+latestPulse.text+"</div></div>";
    }

    html += "<div class='footer'><span>"+sn+" &bull; Weekly Digest</span><span>Generated by Root &amp; Bloom</span></div>"
      +"<div style='text-align:center;margin-top:14px'><button onclick='window.print()' style='padding:8px 20px;background:#1a1a1a;color:#fff;border:none;border-radius:6px;font-size:11px;cursor:pointer'>Print / Save PDF</button></div>"
      +"</body></html>";
    downloadPortfolioHTML(html, "Weekly-Digest-"+weekLabel.replace(/[^a-zA-Z0-9]/g,"-")+".html");
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(12px)",zIndex:350,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.7rem 1.2rem 0.6rem",borderBottom:"1px solid "+pal.stone+"45",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"\uD83D\uDCCB Weekly Digest"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{weekLabel}</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0.9rem 1.2rem 0.5rem"}}>

          {/* Per-child sections */}
          {childDigests.map(({c,ci,weekEntries,subjs,milestones,quizBySubj,photos})=>{
            const cp2 = CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
            if(weekEntries.length===0) return (
              <div key={ci} style={{background:pal.parchm,borderRadius:"13px",padding:"0.75rem 1rem",marginBottom:"0.75rem",border:"1.5px solid "+pal.stone+"25",opacity:0.6}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.84rem"}}>{c.avatar+" "+c.name}</div>
                <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{"Nothing logged this week"}</div>
              </div>
            );
            return (
              <div key={ci} style={{marginBottom:"1rem"}}>
                {/* Child header */}
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,"+cp2.c1+","+cp2.c2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{c.avatar}</div>
                  <div>
                    <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem"}}>{c.name+" \u00b7 "+c.grade}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate}}>{weekEntries.length+" entr"+(weekEntries.length===1?"y":"ies")+" \u00b7 "+subjs.length+" subject"+(subjs.length===1?"":"s")}</div>
                  </div>
                </div>

                {/* Subject chips */}
                <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
                  {subjs.map((s,i)=>(
                    <span key={i} style={{fontSize:"0.68rem",padding:"0.18rem 0.55rem",background:cp2.c1+"18",borderRadius:"20px",color:cp2.c1,fontWeight:"700",border:"1.5px solid "+cp2.c1+"30"}}>{s}</span>
                  ))}
                </div>

                {/* Quiz scores */}
                {Object.keys(quizBySubj).length>0&&(
                  <div style={{marginBottom:"0.65rem"}}>
                    <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.4rem"}}>{"\uD83C\uDFAF Quiz Scores"}</div>
                    <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                      {Object.entries(quizBySubj).map(([subj,d],i)=>{
                        const pct=d.total>0?Math.round((d.score/d.total)*100):0;
                        const g=letterGrade(pct); const col=gradeCol(g);
                        return (
                          <div key={i} style={{background:col+"10",border:"1.5px solid "+col+"30",borderRadius:"10px",padding:"0.4rem 0.6rem",textAlign:"center",minWidth:"60px"}}>
                            <div style={{fontWeight:"900",color:col,fontSize:"1rem"}}>{g}</div>
                            <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.ink,marginTop:"1px"}}>{subj}</div>
                            <div style={{fontSize:"0.62rem",color:pal.slate}}>{pct+"%"}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {milestones.length>0&&(
                  <div style={{background:"#fffbeb",borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.5rem",border:"1.5px solid #f5c84240"}}>
                    <div style={{fontWeight:"700",color:"#b07800",fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.4rem"}}>{"\u2B50 Milestones this week"}</div>
                    {milestones.map((e,i)=>(
                      <div key={i} style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.6,marginBottom:"0.2rem"}}>
                        {"\u2B50 "+(e.note||e.title||"").replace("AI Summary:","").trim()}
                      </div>
                    ))}
                  </div>
                )}

                {/* Photos */}
                {photos.length>0&&(
                  <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.5rem"}}>
                    {photos.map((src,i)=>(
                      <img key={i} src={src} alt="" style={{width:"72px",height:"72px",objectFit:"cover",borderRadius:"10px",border:"1.5px solid "+pal.stone+"25"}}/>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Pulse summary */}
          {latestPulse&&(
            <div style={{marginBottom:"1rem"}}>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>{"\u2728 Progress Summary"}</div>
              {parsePulse(latestPulse.text).map((s,i)=>(
                <div key={i} style={{background:s.bg,borderRadius:"11px",padding:"0.65rem 0.85rem",marginBottom:"0.4rem",border:"1.5px solid "+s.col+"25"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.25rem"}}>
                    <span style={{fontSize:"0.85rem"}}>{s.icon}</span>
                    <span style={{fontWeight:"800",color:s.col,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.07em"}}>{s.label}</span>
                  </div>
                  <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.65}}>{s.body}</div>
                </div>
              ))}
              <div style={{fontSize:"0.63rem",color:pal.stone,textAlign:"right",marginTop:"0.2rem"}}>{latestPulse.date}</div>
            </div>
          )}

          {/* Attendance chip */}
          <div style={{background:pal.linen,borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.5rem",border:"1.5px solid "+pal.stone+"25",display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <span style={{fontSize:"1rem"}}>{"\uD83D\uDCC5"}</span>
            <div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem"}}>{attendanceDays+" school days logged"}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Year to date \u00b7 "+family.state+" homeschool record"}</div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:"1px solid "+pal.stone+"45",display:"flex",gap:"0.55rem",flexShrink:0}}>
          <button onClick={onClose} style={{padding:"0.7rem 1rem",border:"2px solid "+pal.stone,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>{"Close"}</button>
          <button onClick={handleDownload} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"\u2B07\uFE0F Download Digest"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Daily Log Section (inside Transcript tab) ---- */
function DailyLogSection({pal,cp,ch,childEntries,subjEntries}){
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  // Group subject entries by date
  const byDate = {};
  subjEntries.forEach(e=>{
    if(!e.date) return;
    if(!byDate[e.date]) byDate[e.date]={date:e.date,entries:[],dayNote:null};
    byDate[e.date].entries.push(e);
  });
  // Also pull daily notes entries for parent notes per day
  childEntries.filter(e=>e.isDay||e.subj==="Daily Notes").forEach(e=>{
    if(!e.date) return;
    if(!byDate[e.date]) byDate[e.date]={date:e.date,entries:[],dayNote:null};
    byDate[e.date].dayNote = e;
  });

  // Sort dates newest first
  const allDates = Object.values(byDate).sort((a,b)=>{
    // Parse "Mar 25" style dates for sorting
    try{
      const parse = s => new Date(s+", "+new Date().getFullYear());
      return parse(b.date) - parse(a.date);
    }catch{return 0;}
  });

  // Filter by search
  const filtered = search.trim()
    ? allDates.filter(d=>
        d.date.toLowerCase().includes(search.toLowerCase()) ||
        d.entries.some(e=>e.subj?.toLowerCase().includes(search.toLowerCase())||e.note?.toLowerCase().includes(search.toLowerCase())||e.title?.toLowerCase().includes(search.toLowerCase()))
      )
    : allDates;

  if(allDates.length===0) return null;

  return (
    <div style={{marginBottom:"0.85rem"}}>
      {/* Header + search */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}>
        <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>Daily Activity Log</div>
        <div style={{fontSize:"0.7rem",color:pal.slate,fontWeight:"600"}}>{allDates.length} day{allDates.length!==1?"s":""}</div>
      </div>
      <div style={{position:"relative",marginBottom:"0.65rem"}}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder={"Search by date or subject..."}
          style={{width:"100%",padding:"0.5rem 0.85rem 0.5rem 2.1rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.81rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=cp.c1}
          onBlur={e=>e.target.style.borderColor=pal.stone}/>
        <span style={{position:"absolute",left:"0.65rem",top:"50%",transform:"translateY(-50%)",fontSize:"0.85rem",pointerEvents:"none"}}>{"🔍"}</span>
        {search&&<button onClick={()=>setSearch("")}
          style={{position:"absolute",right:"0.55rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.75rem",padding:"0.1rem 0.25rem"}}>{"✕"}</button>}
      </div>

      {filtered.length===0?(
        <div style={{textAlign:"center",padding:"1rem",fontSize:"0.78rem",color:pal.slate,background:pal.linen,borderRadius:"12px",border:`1.5px solid ${pal.stone}25`}}>
          No days match {"\""+search+"\""}.
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
          {filtered.map(day=>{
            const isOpen = expanded===day.date;
            const parentNote = day.dayNote?.note?.replace("AI Summary: ","").trim()||"";
            const aiSummary  = day.dayNote?.aiSummary||"";
            const noteToShow = parentNote.replace(aiSummary,"").trim();
            return (
              <div key={day.date} style={{background:pal.linen,borderRadius:"13px",border:`1.5px solid ${isOpen?cp.c1+"50":pal.stone+"30"}`,overflow:"hidden",transition:"border-color 0.15s"}}>
                {/* Day header row */}
                <button onClick={()=>setExpanded(isOpen?null:day.date)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.65rem 0.85rem",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:"38px",height:"38px",borderRadius:"10px",background:`linear-gradient(135deg,${cp.c1}22,${cp.c2}15)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{fontSize:"0.55rem",fontWeight:"700",color:cp.c1,textTransform:"uppercase"}}>{day.date.split(" ")[0]}</div>
                    <div style={{fontSize:"0.9rem",fontWeight:"900",color:cp.c1,lineHeight:1}}>{day.date.split(" ")[1]||""}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{day.date}</div>
                    <div style={{fontSize:"0.65rem",color:pal.slate,marginTop:"1px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {day.entries.map(e=>e.subj).filter((v,i,a)=>a.indexOf(v)===i).join(" \u00b7 ")}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0}}>
                    <div style={{background:cp.c1+"20",borderRadius:"20px",padding:"0.1rem 0.45rem"}}>
                      <span style={{fontWeight:"800",color:cp.c1,fontSize:"0.72rem"}}>{day.entries.length}</span>
                    </div>
                    <span style={{color:pal.slate,fontSize:"0.9rem",transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"›"}</span>
                  </div>
                </button>

                {/* Expanded entries */}
                {isOpen&&(
                  <div style={{borderTop:`1px solid ${pal.stone}20`}}>
                    {day.entries.map((e,i)=>(
                      <div key={e.id||i} style={{display:"flex",gap:"0.55rem",alignItems:"flex-start",padding:"0.55rem 0.85rem",borderTop:i>0?`1px solid ${pal.stone}12`:"none",background:"#fff"}}>
                        <span style={{fontSize:"1rem",flexShrink:0,marginTop:"1px"}}>{e.thumb||"📋"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>{e.subj}</div>
                          {e.readingTitle&&(
                            <div style={{fontSize:"0.7rem",color:pal.primary,fontWeight:"600",marginTop:"1px"}}>{"📖 "+e.readingTitle}</div>
                          )}
                          {e.note&&e.note.trim()&&(
                            <div style={{fontSize:"0.72rem",color:pal.inkM,marginTop:"2px",lineHeight:1.55}}>{e.note}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {noteToShow&&(
                      <div style={{padding:"0.55rem 0.85rem",borderTop:`1px solid ${pal.stone}15`,background:pal.pale}}>
                        <div style={{fontSize:"0.62rem",fontWeight:"800",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"3px"}}>Parent Notes</div>
                        <div style={{fontSize:"0.75rem",color:pal.inkM,lineHeight:1.6}}>{noteToShow}</div>
                      </div>
                    )}
                    {aiSummary&&(
                      <div style={{padding:"0.45rem 0.85rem",borderTop:`1px solid ${pal.stone}12`,background:"#fff"}}>
                        <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,marginBottom:"2px"}}>{"✨ AI Summary"}</div>
                        <div style={{fontSize:"0.72rem",color:pal.inkM,lineHeight:1.55,fontStyle:"italic"}}>{aiSummary}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

        {/* ====== GRADES TAB ====== */}
        {true&&(()=>{
          // Letter grade helper
          const pctToLetter = (pct) => {
            if(pct>=93) return {letter:"A+",color:"#1a6e40",bg:"#edf9f0"};
            if(pct>=90) return {letter:"A", color:"#1a6e40",bg:"#edf9f0"};
            if(pct>=87) return {letter:"B+",color:"#2563a8",bg:"#eef4ff"};
            if(pct>=83) return {letter:"B", color:"#2563a8",bg:"#eef4ff"};
            if(pct>=80) return {letter:"B-",color:"#2563a8",bg:"#eef4ff"};
            if(pct>=77) return {letter:"C+",color:"#7a5500",bg:"#fff8e6"};
            if(pct>=73) return {letter:"C", color:"#7a5500",bg:"#fff8e6"};
            if(pct>=70) return {letter:"C-",color:"#7a5500",bg:"#fff8e6"};
            if(pct>=60) return {letter:"D", color:"#8a3a00",bg:"#fff3ec"};
            return       {letter:"F", color:"#cc2222",bg:"#fff0f0"};
          };

          // Aggregate all quiz entries for this child across the whole year
          const allQuizEntries = childEntries.filter(e=>e.isQuizResult&&e.quizData);
          const bySubj = {};
          allQuizEntries.forEach(e=>{
            if(!bySubj[e.subj]) bySubj[e.subj]={subj:e.subj,quizzes:[],totalScore:0,totalPoss:0,missed:[]};
            bySubj[e.subj].quizzes.push(e);
            bySubj[e.subj].totalScore+=e.quizData.score;
            bySubj[e.subj].totalPoss+=e.quizData.total;
            (e.quizData.missed||[]).forEach(m=>{ if(!bySubj[e.subj].missed.includes(m)) bySubj[e.subj].missed.push(m); });
          });
          const gradeRows = Object.values(bySubj).sort((a,b)=>(b.totalScore/Math.max(b.totalPoss,1))-(a.totalScore/Math.max(a.totalPoss,1)));
          const allAs = gradeRows.length>=3 && gradeRows.every(r=>(r.totalScore/Math.max(r.totalPoss,1))>=0.90);
          const weakRows = gradeRows.filter(r=>(r.totalScore/Math.max(r.totalPoss,1))<0.75);

          const generateStruggleReport_cb = () => generateStruggleReport(
            weakRows, ch?.name,
            {setLoading:setGradeStruggleLoading, setError:setGradeStruggleError, setResult:setGradeStruggle}
          );

          return (
            <div>
              {/* Header */}
              <div style={{background:"linear-gradient(135deg,"+cp.c1+"18,"+cp.c2+"12)",borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:"1.5px solid "+cp.c1+"25"}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"3px"}}>{"\uD83C\uDFC6 "+ch?.name+"\u2019s Grades"}</div>
                <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.55}}>{"Based on all quiz scores this year. Use these for freebie rewards, not compliance \u2014 Florida doesn\u2019t require a report card."}</div>
              </div>

              {gradeRows.length===0&&(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem 1.2rem",textAlign:"center",border:"1.5px solid "+pal.stone+"25"}}>
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\uD83C\uDFAF"}</div>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.3rem"}}>{"No quiz scores yet"}</div>
                  <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6}}>{"Grades appear here once kids take quizzes from the Student Portal. Tap the \uD83C\uDFAF button after logging a subject."}</div>
                </div>
              )}

              {/* Straight A's callout */}
              {allAs&&(
                <div style={{background:"linear-gradient(135deg,#f5c842,#f9a825)",borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"1rem",border:"none",textAlign:"center",boxShadow:"0 4px 18px rgba(245,200,66,0.35)"}}>
                  <div style={{fontSize:"2rem",marginBottom:"4px"}}>{"\uD83C\uDF1F\uD83C\uDFC6\uD83C\uDF1F"}</div>
                  <div style={{fontWeight:"900",color:"#5a3a00",fontSize:"1rem",marginBottom:"3px"}}>{"STRAIGHT A\u2019S!"}</div>
                  <div style={{fontSize:"0.78rem",color:"#7a5500",lineHeight:1.55}}>{"Every subject is 90%+. Time to claim those freebie rewards! \uD83C\uDF54\uD83C\uDFDE\uFE0F\uD83C\uDFA8"}</div>
                </div>
              )}

              {/* Per-subject grade cards */}
              {gradeRows.map(r=>{
                const pct=r.totalPoss>0?Math.round((r.totalScore/r.totalPoss)*100):0;
                const {letter,color,bg}=pctToLetter(pct);
                const so=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(x=>x.label===r.subj);
                const trend=r.quizzes.length>=2?(()=>{
                  const first=r.quizzes[r.quizzes.length-1].quizData;
                  const last=r.quizzes[0].quizData;
                  const fp=Math.round((first.score/Math.max(first.total,1))*100);
                  const lp=Math.round((last.score/Math.max(last.total,1))*100);
                  return lp-fp;
                })():null;
                return (
                  <div key={r.subj} style={{background:bg,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.5rem",border:"1.5px solid "+color+"35"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                      <div style={{width:"44px",height:"44px",borderRadius:"12px",background:color+"18",border:"2px solid "+color+"40",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontWeight:"900",color:color,fontSize:"1.1rem"}}>{letter}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"2px"}}>
                          <span style={{fontSize:"0.9rem"}}>{so?.icon||"\uD83D\uDCCB"}</span>
                          <span style={{fontWeight:"700",color:pal.ink,fontSize:"0.85rem"}}>{r.subj}</span>
                          {trend!==null&&(
                            <span style={{fontSize:"0.65rem",fontWeight:"800",color:trend>0?"#2d9e5f":trend<0?"#cc4444":pal.slate}}>
                              {trend>0?"\u2191+"+trend+"%":trend<0?"\u2193"+trend+"%":"\u2192"}
                            </span>
                          )}
                        </div>
                        <div style={{height:"5px",borderRadius:"99px",background:pal.stone+"20",overflow:"hidden",marginBottom:"4px"}}>
                          <div style={{height:"100%",width:pct+"%",background:color,borderRadius:"99px"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:"0.7rem",color:pal.slate}}>{r.quizzes.length+" quiz"+(r.quizzes.length===1?"":"zes")+" \u00b7 "+r.totalScore+"/"+r.totalPoss+" correct"}</span>
                          <span style={{fontSize:"0.78rem",fontWeight:"800",color:color}}>{pct+"%"}</span>
                        </div>
                      </div>
                    </div>
                    {r.missed.length>0&&(
                      <div style={{marginTop:"0.5rem",paddingTop:"0.5rem",borderTop:"1px solid "+color+"25",fontSize:"0.7rem",color:pal.inkM,lineHeight:1.5}}>
                        <span style={{fontWeight:"700",color:"#cc4444"}}>{"Needs review: "}</span>
                        {r.missed.slice(0,4).join(", ")+(r.missed.length>4?" \u2026":"")}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Struggling areas AI section */}
              {gradeRows.length>0&&(
                <div style={{marginTop:"0.75rem"}}>
                  {gradeStruggle?(
                    <div style={{background:"#fff8e6",borderRadius:"14px",padding:"0.9rem 1rem",border:"1.5px solid #f5c84240"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.45rem"}}>
                        <span style={{fontSize:"0.7rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.07em"}}>{"\uD83C\uDF31 Coaching Note"}</span>
                        <button onClick={()=>setGradeStruggle(null)} style={{background:"transparent",border:"none",color:pal.stone,cursor:"pointer",fontSize:"0.8rem"}}>{"×"}</button>
                      </div>
                      <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.75}}>{gradeStruggle}</div>
                    </div>
                  ):gradeStruggleLoading?(
                    <div style={{background:pal.pale,borderRadius:"14px",padding:"0.85rem",border:"1.5px solid "+pal.primary+"20",textAlign:"center"}}>
                      <div style={{fontSize:"0.78rem",color:pal.primary,fontWeight:"700"}}>{"Analysing quiz results\u2026"}</div>
                    </div>
                  ):(
                    <div>
                      {gradeStruggleError==="no_key"&&<div style={{background:"#fff8ed",borderRadius:"12px",padding:"0.75rem",marginBottom:"0.5rem",fontSize:"0.76rem",color:"#7a5500",textAlign:"center",border:"1.5px solid #f5c84240"}}>{"Add an API key in Settings to unlock AI coaching notes."}</div>}
                      {gradeStruggleError==="error"&&<div style={{background:"#fff0f0",borderRadius:"12px",padding:"0.75rem",marginBottom:"0.5rem",fontSize:"0.76rem",color:"#aa3333",textAlign:"center",border:"1.5px solid #ffaaaa40"}}>{"Could not generate \u2014 check your connection."}</div>}
                      <button onClick={generateStruggleReport_cb}
                        disabled={weakRows.length===0}
                        style={{width:"100%",padding:"0.78rem",border:weakRows.length>0?"1.5px dashed #f5c842":"1.5px solid "+pal.stone+"30",borderRadius:"13px",background:weakRows.length>0?"#fffbeb":pal.linen,color:weakRows.length>0?"#b07800":pal.stone,fontWeight:"700",fontSize:"0.8rem",cursor:weakRows.length>0?"pointer":"default"}}>
                        {weakRows.length>0?"\uD83C\uDF31 Get coaching tips for struggling subjects":"All subjects 75%+ \u2014 great work!"}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })()}

    </div>
  );
}

/* ---- Narrative Editor (inline within TranscriptsScreen) ---- */
