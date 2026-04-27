function StudentPortal({ child, family, pal, isCoop, allEntries, onAddEntry, onCoopLog, onBack, checkinStreak=0, checkinDates={}, onQuizComplete, onOpenFieldStudy, celebResetToken=0, onSubmitEntry }) {
  const [sTab,         setSTab]         = useState("home");
  const [noteText,     setNoteText]     = useState("");
  const [noteSaved,    setNoteSaved]    = useState(false);
  const [submitOpen,   setSubmitOpen]   = useState(false);
  const [submitSubj,   setSubmitSubj]   = useState("");
  const [submitNote,   setSubmitNote]   = useState("");
  const [submitSent,   setSubmitSent]   = useState(false);
  const [showCoopPopup,setShowCoopPopup]= useState(isCoop && (family.coopFreq||'') !== "We don't do co-op" && (family.coopFreq||'') !== '');
  const [coopDone,     setCoopDone]     = useState(false);
  // Subject check-off — persisted per child per day
  const SCHED_SK_KEY = "rootbloom_sk_checked_"+child.id;
  const todayStr2 = new Date().toDateString();
  const loadChecked = () => { try{ const s=localStorage.getItem(SCHED_SK_KEY); const p=s?JSON.parse(s):{}; return p.date===todayStr2?(p.checked||{}):{};  }catch{return {};} };
  const [checked, setChecked] = useState(loadChecked);
  const saveChecked = (next) => { try{ localStorage.setItem(SCHED_SK_KEY,JSON.stringify({date:todayStr2,checked:next})); }catch{} };
  // Reading modal
  const [readingPrompt, setReadingPrompt] = useState(null); // {blockIdx, subjLabel, subjIcon} | null
  const [readingTitle2, setReadingTitle2] = useState("");
  // Goals tab logged state
  const [goalsLoggedToday, setGoalsLoggedToday] = useState(new Set());
  const [parentNoteText, setParentNoteText] = useState("");
  const [parentNoteSaved, setParentNoteSaved] = useState(false);
  const [quickNotePrompt, setQuickNotePrompt] = useState(null); // {blockIdx, subjLabel, subjIcon}
  const [quickNoteText, setQuickNoteText] = useState("");
  const [showQuiz,      setShowQuiz]      = useState(null); // {blockIdx, subjLabel, subjIcon, grade}
  const [streakCelebration, setStreakCelebration] = useState(null);
  const [showFirstFieldStudy, setShowFirstFieldStudy] = useState(false);
  const [showFirstMilestone,  setShowFirstMilestone]  = useState(false);
  const [showStraightAs,      setShowStraightAs]      = useState(false);
  const [dailySummary,  setDailySummary]  = useState(null);
  const [summaryLoading,setSummaryLoading]= useState(false); // {streak, childName, pct}
  const [kidPhotos,     setKidPhotos]     = useState([]); // [{dataUrl, subj, date, ts}]
  const kidCamRef = React.useRef(null);
  const kidGallRef = React.useRef(null);
  const [quickNotePhoto, setQuickNotePhoto] = useState(null); // dataUrl
  const kidPhotoRef = useRef(null);

  const childIdx  = family.children.findIndex(c=>c.id===child.id);
  // Use childIdx if found, otherwise scan by matching entries to child position
  const effectiveIdx = childIdx>=0 ? childIdx : 0;
  const myEntries = allEntries.filter(e=>e.childIdx===effectiveIdx);
  const colorPalette = CHILD_COLOR_PALETTES.find(p=>p.id===(child.colorId||"sunshine")) || CHILD_COLOR_PALETTES[childIdx%CHILD_COLOR_PALETTES.length];
  const [c1,c2]   = [colorPalette.c1, colorPalette.c2];
  const heroGrad  = `linear-gradient(135deg,${c1},${c2})`;

  // Compute real streak from portfolio entries for this child
  const realStreak = (() => {
    const yr = new Date().getFullYear();
    const dateset = new Set(
      myEntries.filter(e=>!e.isDay&&e.date).map(e=>e.date)
    );
    let streak = 0;
    const d = new Date(); d.setHours(0,0,0,0);
    // Start from today or yesterday (allow today not yet logged)
    const todayStr = d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
    if(!dateset.has(todayStr)) d.setDate(d.getDate()-1);
    while(true){
      const ds = d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
      if(!dateset.has(ds)) break;
      streak++;
      d.setDate(d.getDate()-1);
      if(streak>365) break;
    }
    return streak;
  })();

  // Real points = entries * 10
  const realPoints = myEntries.filter(e=>!e.isDay).length * 10;

  // This week's logged days (Mon-Fri)
  const weekDots = (() => {
    const yr = new Date().getFullYear();
    const now = new Date(); now.setHours(0,0,0,0);
    const dow = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate()-(dow===0?6:dow-1));
    const datesWithEntries = new Set(myEntries.filter(e=>!e.isDay&&e.date).map(e=>e.date));
    return ["M","T","W","T","F"].map((_,i)=>{
      const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
      const ds = d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
      const isPast = d<=now;
      const isToday = d.toDateString()===now.toDateString();
      const done = datesWithEntries.has(ds);
      return {done, isPast, isToday};
    });
  })();

  const greetKid  = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };

  const saveNote = () => {
    if(!noteText.trim()) return;
    onAddEntry({childIdx, title:noteText.slice(0,42), subj:"Daily Note", date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), thumb:"", note:noteText});
    setNoteText(""); setNoteSaved(true);
    setTimeout(()=>setNoteSaved(false),2400);
  };
  const saveParentNote = () => {
    if(!parentNoteText.trim()) return;
    onAddEntry({childIdx, title:"💌 Note for "+child.name+"'s parent", subj:"Daily Note",
      date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      thumb:"💌", note:"NOTE TO PARENT: "+parentNoteText.trim(), isParentNote:true});
    setParentNoteText(""); setParentNoteSaved(true);
    setTimeout(()=>setParentNoteSaved(false),2400);
  };
  const saveBook = () => {
    if(!addBookText.trim()) return;
    onAddEntry&&onAddEntry({
      childIdx, subj:"Reading", title:addBookText.trim(),
      date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      thumb:"📚", note:"", readingTitle:addBookText.trim(),
      isSubject:true, selfLogged:true,
    });
    setAddBookText(""); setBookSaved(true);
    setTimeout(()=>setBookSaved(false), 2400);
  };

  const saveQuickNote = (blockIdx, b, noteStr, photoUrl) => {
    const isRead = b.s.toLowerCase().includes("read");
    if(isRead && !readingPrompt) {
      setReadingTitle2("");
      setReadingPrompt({blockIdx, subjLabel:b.s, subjIcon:b.i||"📖", quickNote:noteStr});
    } else {
      onAddEntry&&onAddEntry({
        childIdx, subj:b.s, title:b.s+"—"+todayDateStr2,
        note:noteStr||"", thumb:b.i||"📋", date:todayDateStr2,
        isSubject:true, lessonCount:1, selfLogged:true,
        photos: photoUrl ? [photoUrl] : [],
      });
    }
    setQuickNotePrompt(null); setQuickNoteText(""); setQuickNotePhoto(null);
  };

  const SCHEDULE = generateSchedule(family);
  const familyGoalObjs = [...GOALS,...(family.customGoals||[])].filter(g=>(family.goals||[]).includes(g.id));
  const todayDateStr2 = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const isWeekend = (()=>{ const d=new Date().getDay(); return d===0||d===6; })();

  const checkSubject = (bi, b) => {
    if(checked[bi]) return;
    const next = {...checked,[bi]:true};
    setChecked(next);
    saveChecked(next);
    const isRead = b.s.toLowerCase().includes("read");
    if(isRead) {
      setReadingTitle2(""); setQuickNoteText("");
      setReadingPrompt({blockIdx:bi, subjLabel:b.s, subjIcon:b.i||"📖"});
    } else {
      // Show quick note prompt
      setQuickNoteText("");
      setQuickNotePrompt({blockIdx:bi, b});
    }
  };

  const saveReadingEntry = () => {
    if(!readingPrompt) return;
    onAddEntry&&onAddEntry({
      childIdx, subj:readingPrompt.subjLabel,
      title:readingPrompt.subjLabel+"\u2014"+todayDateStr2,
      note:"", thumb:readingPrompt.subjIcon, date:todayDateStr2,
      isSubject:true, lessonCount:1, selfLogged:true,
      readingTitle:readingTitle2.trim()||undefined,
    });
    setReadingPrompt(null);
    setReadingTitle2("");
  };

  const logGoal = (g) => {
    if(goalsLoggedToday.has(g.id)) return;
    onAddEntry&&onAddEntry({
      childIdx, subj:"Daily Note",
      title:g.icon+" "+g.label+"\u2014"+todayDateStr2,
      note:"", thumb:g.icon, date:todayDateStr2,
      goalId:g.id, selfLogged:true,
    });
    setGoalsLoggedToday(prev=>{ const n=new Set(prev); n.add(g.id); return n; });
  };

  const myMilestones = allEntries.filter(e=>e.childIdx===effectiveIdx && e.isMilestone);
  const doesCoop = (family.coopFreq||"") && (family.coopFreq||"")!=="We don't do co-op";
  const myReadingTitles = [...new Set(myEntries.filter(e=>e.readingTitle).map(e=>e.readingTitle))];

  // --- Portal celebrations ---
  const CELEB_KEY_FIELD     = "portalCeleb_field_"    + child.id + "_" + (family.yearEnd||"");
  const CELEB_KEY_MILESTONE = "portalCeleb_milestone_" + child.id + "_" + (family.yearEnd||"");
  const CELEB_KEY_STRAIGHTA = "portalCeleb_straighta_" + child.id + "_" + (family.yearEnd||"");
  React.useEffect(()=>{
    const seen = getTipsSeen();
    // First field study
    const hasFieldStudy = myEntries.some(e=>e.isFieldStudy);
    if(hasFieldStudy && !seen.has(CELEB_KEY_FIELD)){
      setShowFirstFieldStudy(true);
      return;
    }
    // First milestone
    if(myMilestones.length>0 && !seen.has(CELEB_KEY_MILESTONE)){
      setShowFirstMilestone(true);
      return;
    }
    // Straight A's — all subjects with quizzes averaging >= 90%
    const quizEs = myEntries.filter(e=>e.isQuizResult&&e.quizData&&e.quizData.total>0);
    if(quizEs.length>0 && !seen.has(CELEB_KEY_STRAIGHTA)){
      const bySubj = {};
      quizEs.forEach(e=>{
        if(!bySubj[e.subj]) bySubj[e.subj]={total:0,poss:0};
        bySubj[e.subj].total+=e.quizData.score;
        bySubj[e.subj].poss+=e.quizData.total;
      });
      const allAs = Object.values(bySubj).every(d=>d.poss>0&&Math.round((d.total/d.poss)*100)>=90);
      if(allAs){
        setShowStraightAs(true);
      }
    }
  }, [myEntries.length, myMilestones.length, CELEB_KEY_FIELD, celebResetToken]);
  const [addBookText, setAddBookText] = useState("");
  const [bookSaved,   setBookSaved]   = useState(false);
  // Kid-owned goals (stored per child in localStorage)
  const KID_GOALS_KEY  = "rootbloom_kid_goals_"+child.id;
  const KID_ONBOARD_KEY= "rootbloom_kid_onboard_"+child.id;
  const [kidGoals,     setKidGoals]    = useState(()=>{ try{ return JSON.parse(localStorage.getItem(KID_GOALS_KEY)||"[]"); }catch{return [];} });
  const [kidOnboarded, setKidOnboarded]= useState(()=>{ try{ return !!localStorage.getItem(KID_ONBOARD_KEY); }catch{return false;} });
  const [showKidOnboard,setShowKidOnboard] = useState(!kidOnboarded);
  const [kidGoalLogged, setKidGoalLogged]  = useState(new Set());
  const [goalCelebGoal, setGoalCelebGoal]  = useState(null);
  const [expandedGoal,  setExpandedGoal]   = useState(null); // goal text being expanded
  const [bloomMsgs,     setBloomMsgs]      = useState([]); // [{role,text,imgUrl,imgAlt}]
  const [bloomInput,    setBloomInput]     = useState("");
  const [bloomLoading,  setBloomLoading]   = useState(false);
  const [bloomHintMode, setBloomHintMode]  = useState(false);
  const [goalNoteMap,   setGoalNoteMap]    = useState({}); // goal -> note text
  const saveKidGoals = (goals) => {
    setKidGoals(goals);
    try{ localStorage.setItem(KID_GOALS_KEY, JSON.stringify(goals)); }catch{}
  };
  const finishKidOnboard = (goals) => {
    saveKidGoals(goals);
    try{ localStorage.setItem(KID_ONBOARD_KEY, "1"); }catch{}
    setKidOnboarded(true);
    setShowKidOnboard(false);
  };
  const logKidGoal = (goal, note) => {
    if(kidGoalLogged.has(goal)) return;
    const noteText = note && note.trim() ? note.trim() : "";
    onAddEntry&&onAddEntry({childIdx, subj:"Daily Note", title:"🎯 "+goal,
      date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      thumb:"🎯", note:"Working on my goal: "+goal+(noteText?" \u2014 "+noteText:""), selfLogged:true});
    setKidGoalLogged(prev=>{ const n=new Set(prev); n.add(goal); return n; });
    setGoalCelebGoal(goal);
    setTimeout(()=>setGoalCelebGoal(null), 2000);
  };

  // ── Ask Bloom ──────────────────────────────────────────────────────────────
  const sendToBloom = async (question) => {
    if(!question.trim() || bloomLoading) return;
    setBloomMsgs(m=>[...m, {role:"user", text:question.trim()}]);
    setBloomInput("");
    setBloomLoading(true);
    try {
      const history = bloomMsgs.slice(-8).map(m=>({
        role: m.role==="user"?"user":"assistant", content:m.text
      }));
      const result = await bloomChat({question, history, child, family, hintMode:bloomHintMode});
      setBloomMsgs(m=>[...m, {role:"bloom", text:result.text, imgUrl:result.imgUrl, imgAlt:result.imgAlt}]);
    } catch(e) {
      const msg = e.message==="NO_KEY"
        ? "Ask your parent to add an API key in Settings \u2192 AI to activate me! 🌱"
        : e.message?.includes("rate") ? "I need a little rest! Try again in a moment. 🌿"
        : "Hmm, something went wrong. Try asking again! 🌱";
      setBloomMsgs(m=>[...m, {role:"bloom", text:msg}]);
    } finally { setBloomLoading(false); }
  };

  const STABS = [
    {id:"home",   icon:"🏠", l:"Home"},
    {id:"today",  icon:"📅", l:"Today"},
    {id:"bloom",  icon:"🌱", l:"Ask Bloom"},
    {id:"books",  icon:"📚", l:"Books"},
    {id:"stars",  icon:"🌟", l:"Stars"},
    {id:"camera", icon:"📷", l:"Camera"},
    ...(kidGoals.length>0?[{id:"goals",icon:"🎯",l:"Goals"}]:[]),
  ];

  // Kid goal onboarding screen
  if(showKidOnboard) {
    return <KidGoalOnboarding child={child} c1={c1} c2={c2} heroGrad={heroGrad} onDone={finishKidOnboard} />;
  }

  return (
    <div style={{minHeight:"100vh",background:SK.cream,fontFamily:"'Comic Sans MS','Chalkboard SE',cursive",display:"flex",flexDirection:"column"}}>
      {goalCelebGoal&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",overflow:"hidden"}}>
          {Array.from({length:32},(_,i)=>(
            <div key={i} style={{position:"absolute",left:(20+Math.sin(i*37)*45)+"%",top:"-10px",width:(7+i%5)+"px",height:(7+i%5)+"px",borderRadius:i%3===0?"50%":"3px",background:[c1,c2,"#f6c90e","#fff","#f4a261","#a8d5a2","#e07b9a"][i%7],animation:"confettiFall "+(1.2+i%4*0.3)+"s "+(i*0.04)+"s ease-in forwards",opacity:0.9,transform:"rotate("+(i*47)+"deg)"}}/>
          ))}
          <div style={{background:"linear-gradient(135deg,"+c1+","+c2+")",borderRadius:"28px",padding:"1.8rem 2rem",textAlign:"center",boxShadow:"0 12px 50px rgba(0,0,0,0.25)",animation:"grow 0.3s cubic-bezier(0.34,1.56,0.64,1)",maxWidth:"280px"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.4rem",animation:"bounce 0.6s ease infinite"}}>{"🎉"}</div>
            <div style={{fontWeight:"900",color:"#fff",fontSize:"1.2rem",marginBottom:"0.25rem"}}>{"Goal logged!"}</div>
            <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.85)",lineHeight:1.5,fontStyle:"italic"}}>{"\u201c"}{goalCelebGoal}{"\u201d"}</div>
            <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.7)",marginTop:"0.5rem"}}>{"Keep it up, "+child.name+"! \u2b50"}</div>
          </div>
        </div>
      )}
      {/* Kid status bar */}
      <div style={{background:heroGrad,padding:"0.65rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:"9px",padding:"0.22rem 0.6rem",cursor:"pointer",color:"#fff",fontWeight:"800",fontSize:"0.7rem"}}>Back</button>
        <div style={{display:"flex",alignItems:"center",gap:"0.42rem"}}>
          <span style={{fontSize:"1.1rem"}}>{child.avatar}</span>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"0.88rem"}}>{child.name}{"'s Space"}</span>
        </div>
        {family.useStarsSystem!==false&&(
        <div style={{background:"rgba(255,255,255,0.22)",borderRadius:"9px",padding:"0.25rem 0.65rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",minWidth:"52px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.25rem"}}>
            <span style={{fontSize:"0.75rem"}}>{"⭐"}</span>
            <span style={{fontWeight:"900",color:"#fff",fontSize:"0.75rem"}}>{"Lv "+(Math.floor(realPoints/100)+1)}</span>
          </div>
          <div style={{width:"44px",height:"3px",borderRadius:"99px",background:"rgba(255,255,255,0.25)",overflow:"hidden"}}>
            <div style={{height:"100%",width:(realPoints%100)+"%",background:"#fff",borderRadius:"99px"}}/>
          </div>
        </div>
        )}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:"74px"}}>

        {/* -- HOME TAB -- */}
        {sTab==="home" && (
          <div style={{animation:"fadeUp 0.22s ease"}}>
            {/* Big hero */}
            <div style={{background:heroGrad,padding:"1.5rem 1.2rem 2.5rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:"-25px",bottom:"-25px",width:"110px",height:"110px",borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
              <div style={{fontSize:"3.8rem",marginBottom:"0.4rem",animation:"bounce 2.2s ease infinite"}}>{child.avatar}</div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"1.55rem",lineHeight:1.2}}>{greetKid()},<br/>{child.name}! 🌟</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.72)",marginTop:"0.25rem"}}>
                {isWeekend ? "It's the weekend — enjoy your time off! 🌴" : "Ready to learn something awesome?"}
              </div>
            </div>

            {/* Floating streak card */}
            <div style={{margin:"-1.1rem 1rem 0",position:"relative",zIndex:2}}>
              <div style={{background:SK.card,borderRadius:"22px",padding:"0.9rem 1.1rem",boxShadow:"0 4px 22px rgba(0,0,0,0.11)",display:"flex",gap:"0.9rem",alignItems:"center"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"14px",background:`linear-gradient(135deg,${SK.orange},${SK.sun})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.9rem",flexShrink:0,animation:"wiggle 3s ease infinite"}}>🔥</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"900",color:SK.ink,fontSize:"1rem"}}>{realStreak>0 ? realStreak+" day streak! 🎉" : "Start your streak today!"}</div>
                  <div style={{fontSize:"0.72rem",color:SK.lite,marginTop:"1px"}}>{realStreak>0 ? realStreak+" days of learning in a row" : "Log something to get going"}</div>
                </div>
                <div style={{fontWeight:"900",color:SK.orange,fontSize:"1.6rem",lineHeight:1}}>{realStreak}</div>
              </div>
            </div>

            <div style={{padding:"1.3rem 1rem 0"}}>

              {/* Weekend banner */}
              {isWeekend&&(
                <div style={{background:`linear-gradient(135deg,${c1}18,${c2}10)`,borderRadius:"18px",padding:"1rem 1.1rem",marginBottom:"0.9rem",border:`2px solid ${c1}30`,display:"flex",gap:"0.75rem",alignItems:"center"}}>
                  <span style={{fontSize:"2rem",flexShrink:0}}>🌴</span>
                  <div>
                    <div style={{fontWeight:"900",color:c1,fontSize:"0.95rem"}}>{"No school today!"}</div>
                    <div style={{fontSize:"0.76rem",color:SK.lite,marginTop:"2px",lineHeight:1.55}}>{"Rest, play, and recharge. You can still log something cool if you want — it counts! 🌟"}</div>
                  </div>
                </div>
              )}
              {/* Kid goals */}
              {kidGoals.length>0&&(
                <div style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",marginBottom:"0.9rem",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}>
                    <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem"}}>{"🎯 My Goals"}</div>
                    <button onClick={()=>setSTab("goals")} style={{background:"transparent",border:"none",color:c1,fontSize:"0.72rem",fontWeight:"700",cursor:"pointer"}}>{"See all"}</button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                    {kidGoals.slice(0,2).map((g,i)=>{
                      const done = kidGoalLogged.has(g);
                      return (
                        <div key={i} onClick={()=>!done&&logKidGoal(g)}
                          style={{display:"flex",gap:"0.55rem",alignItems:"center",padding:"0.38rem 0.55rem",borderRadius:"10px",background:done?SK.grassL:"#f8f8f8",border:"1.5px solid "+(done?SK.grass+"60":"#ece5dc"),cursor:done?"default":"pointer"}}>
                          <div style={{width:"20px",height:"20px",borderRadius:"50%",border:"2px solid "+(done?SK.grass:"#ddd"),background:done?SK.grass:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            {done&&<span style={{color:"#fff",fontSize:"0.65rem",fontWeight:"900"}}>{"\u2713"}</span>}
                          </div>
                          <span style={{fontSize:"0.78rem",color:done?SK.grass:SK.ink,fontWeight:done?"600":"400",textDecoration:done?"line-through":"none",flex:1}}>{g}</span>
                          {!done&&<span style={{fontSize:"0.65rem",color:SK.lite}}>{"tap!"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Daily tip */}
              {(()=>{
                const TIPS = [
                  {icon:"🔭", text:"Asking “why” is how scientists think. Ask it today!"},
                  {icon:"📝", text:"Writing about what you learn helps you remember it longer."},
                  {icon:"🌿", text:"Even a 10-minute walk outside counts as learning about nature!"},
                  {icon:"📚", text:"Reading for just 15 minutes a day adds up to 100+ hours a year!"},
                  {icon:"🧠", text:"Mistakes help your brain grow. Every wrong answer is a step forward."},
                  {icon:"🎵", text:"Music and math are connected. Knowing one helps with the other!"},
                  {icon:"💪", text:"Hard things get easier the more you practice. Keep going!"},
                  {icon:"🔢", text:"Numbers are everywhere — cooking, building, even playing games!"},
                  {icon:"🌍", text:"Every language has words that don't exist in English. Cool, right?"},
                  {icon:"👀", text:"Curiosity is a superpower. The more you wonder, the more you learn."},
                ];
                const tip = TIPS[new Date().getDate() % TIPS.length];
                return (
                  <div style={{background:"linear-gradient(135deg,"+c1+"18,"+c2+"10)",borderRadius:"16px",padding:"0.75rem 1rem",marginBottom:"0.9rem",border:"1.5px solid "+c1+"30",display:"flex",gap:"0.65rem",alignItems:"center"}}>
                    <span style={{fontSize:"1.5rem",flexShrink:0}}>{tip.icon}</span>
                    <div style={{fontSize:"0.78rem",color:SK.ink,lineHeight:1.6,fontStyle:"italic"}}>{tip.text}</div>
                  </div>
                );
              })()}
              {/* What did you learn? */}
              <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.05rem",marginBottom:"0.2rem"}}> What did you learn today?</div>
                <div style={{fontSize:"0.75rem",color:SK.lite,marginBottom:"0.7rem"}}>Write anything - even one sentence counts!</div>
                <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
                  placeholder="Today I learned that..." rows={3}
                  style={{width:"100%",padding:"0.75rem",border:`2.5px solid ${noteText.length>0?SK.sky:"#ece5dc"}`,borderRadius:"14px",fontSize:"0.88rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",lineHeight:1.6,outline:"none",transition:"border-color 0.18s"}}
                  onFocus={e=>e.target.style.borderColor=SK.sky} onBlur={e=>e.target.style.borderColor=noteText.length>0?SK.sky:"#ece5dc"}
                />
                <button onClick={saveNote} disabled={!noteText.trim()} style={{width:"100%",marginTop:"0.65rem",padding:"0.78rem",border:"none",borderRadius:"13px",background:noteText.trim()?`linear-gradient(135deg,${SK.sky},${SK.grass})`:"#e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.9rem",cursor:noteText.trim()?"pointer":"default",transition:"background 0.2s"}}>
                  {noteSaved ? " Saved! +10 points 🎉" : "Save it! "}
                </button>
              </div>

              {/* Note to parent */}
              <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)",border:"2px dashed "+SK.sun+"80"}}>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.95rem",marginBottom:"0.2rem"}}>{"💌 Note for Mom/Dad"}</div>
                <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"0.6rem"}}>{"Write something for your parent to see!"}</div>
                <textarea value={parentNoteText} onChange={e=>setParentNoteText(e.target.value)}
                  placeholder={"e.g. I need help with fractions, or I really liked science today!"} rows={2}
                  style={{width:"100%",padding:"0.7rem",border:"2.5px solid "+SK.sun+"60",borderRadius:"12px",fontSize:"0.84rem",fontFamily:"inherit",background:SK.sunL,color:SK.ink,resize:"none",outline:"none",lineHeight:1.5}}
                />
                <button onClick={saveParentNote} disabled={!parentNoteText.trim()}
                  style={{width:"100%",marginTop:"0.5rem",padding:"0.65rem",border:"none",borderRadius:"12px",background:parentNoteText.trim()?"linear-gradient(135deg,"+SK.sun+","+SK.orange+")":" #e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.85rem",cursor:parentNoteText.trim()?"pointer":"default"}}>
                  {parentNoteSaved?"💌 Sent to parent!":"Send note 💌"}
                </button>
              </div>

              {/* This Week progress */}
              {(()=>{
                const lessonGoals3 = family.lessonGoals||{};
                const hasGoals3    = Object.keys(lessonGoals3).length>0;
                const customSjs3   = family.customSubjects||[];
                const sMap3        = Object.fromEntries([...SUBJECT_OPTIONS,...customSjs3].map(s=>[s.id,s]));
                const activeSjs3   = (family.subjects||[]).map(id=>sMap3[id]).filter(Boolean);
                if(activeSjs3.length===0) return null;
                const yr3 = new Date().getFullYear();
                const ws3 = new Date();
                ws3.setDate(ws3.getDate()-(ws3.getDay()===0?6:ws3.getDay()-1));
                ws3.setHours(0,0,0,0);
                const weekEntries3 = myEntries.filter(e=>{
                  if(e.isDay) return false;
                  try{ return new Date(e.date+", "+yr3)>=ws3; }catch{return false;}
                });
                const loggedPerSubj3 = {};
                weekEntries3.forEach(e=>{ if(e.subj) loggedPerSubj3[e.subj]=(loggedPerSubj3[e.subj]||0)+(e.lessonCount||1); });
                const cards3 = activeSjs3.map(s=>{
                  const logged3 = loggedPerSubj3[s.label]||0;
                  const target3 = hasGoals3&&lessonGoals3[s.id]
                    ? [0,1,2,3,4].reduce((sum,d)=>sum+(lessonGoals3[s.id][d]||0),0)
                    : null;
                  const pct3 = target3 ? Math.min(100,Math.round(logged3/target3*100)) : (logged3>0?100:0);
                  const done3 = target3!==null ? logged3>=target3 : logged3>0;
                  return {s, logged3, target3, pct3, done3};
                });
                const allDone3 = cards3.every(c=>c.done3);
                return (
                  <div style={{background:SK.card,borderRadius:"20px",padding:"1rem 1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                    <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.92rem",marginBottom:allDone3?"0.4rem":"0.7rem"}}>
                      {allDone3 ? "This Week \u2014 Amazing! \uD83C\uDF1F" : "This Week"}
                    </div>
                    {allDone3&&(
                      <div style={{fontSize:"0.73rem",color:SK.grass,fontWeight:"700",marginBottom:"0.6rem"}}>{"All subjects on track \u2014 keep going!"}</div>
                    )}
                    <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
                      {cards3.map(({s,logged3,target3,pct3,done3})=>(
                        <div key={s.id}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"0.22rem"}}>
                            <span style={{fontSize:"0.9rem",flexShrink:0}}>{s.icon}</span>
                            <span style={{flex:1,fontWeight:"700",color:done3?SK.grass:SK.ink,fontSize:"0.78rem"}}>{s.label}</span>
                            <span style={{fontSize:"0.72rem",fontWeight:"800",color:done3?SK.grass:c1}}>
                              {target3!==null ? logged3+"/"+target3 : (logged3>0?"done":"not yet")}
                            </span>
                          </div>
                          {target3!==null&&(
                            <div style={{height:"7px",borderRadius:"99px",background:"#ece5dc",overflow:"hidden"}}>
                              <div style={{height:"100%",width:pct3+"%",borderRadius:"99px",background:done3?SK.grass:c1,transition:"width 0.5s"}}/>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Today peek — hidden on weekends */}
              {!isWeekend&&(<>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.92rem",marginBottom:"0.6rem"}}>{"📅 Today\u2019s Plan"}</div>
              {SCHEDULE.slice(0,4).map((b,i)=>(
                <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.65rem 0.9rem",display:"flex",gap:"0.65rem",alignItems:"center",marginBottom:"0.42rem",boxShadow:"0 1px 7px rgba(0,0,0,0.05)"}}>
                  <div style={{width:"34px",height:"34px",borderRadius:"9px",background:SK.skyL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{b.i}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem"}}>{b.s}</div><div style={{fontSize:"0.68rem",color:SK.lite}}>{b.dur} min</div></div>
                </div>
              ))}
              </>)}
            </div>
          </div>
        )}

        {/* -- TODAY TAB -- */}
        {sTab==="today" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.3rem"}}>{"📅 My Schedule Today"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Tap the circle when you finish a subject!"}</div>

            {(()=>{
              const todayKey = new Date().toDateString();
              const cacheKey = "rootbloom_daily_summary_"+child.id+"_"+todayKey;
              if(!dailySummary && !summaryLoading && SCHEDULE.length>0) {
                try {
                  const cached = localStorage.getItem(cacheKey);
                  if(cached) { const p=JSON.parse(cached); setTimeout(()=>setDailySummary(p),0); }
                } catch(ex){}
              }
              const generate = async () => {
                const apiKey = localStorage.getItem("rootbloom_apikey");
                if(!apiKey) return;
                setSummaryLoading(true);
                const subjects = SCHEDULE.filter(b=>b.s!=="Break"&&b.s!=="Lunch").map(b=>b.s).join(", ");
                const gradeN = parseInt((child.grade||"3rd").replace(/[^0-9]/g,""))||3;
                const tone = gradeN<=2?"very simple, playful, age 5-7":gradeN<=5?"fun and encouraging, age 8-11":"enthusiastic, age 12+";
                const prompt = "Write a single fun sentence (max 25 words) as a morning greeting for "+child.name+" ("+child.grade+" grade). "
                  + "Mention 1-2 of: "+subjects+". Tone: "+tone+". Start with their name. End with an emoji. Plain text only.";
                try {
                  const resp = await fetch("https://api.anthropic.com/v1/messages",{
                    method:"POST",
                    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
                    body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:80,messages:[{role:"user",content:prompt}]})
                  });
                  const data = await resp.json();
                  const text = (data.content||[]).map(b=>b.text||"").join("").trim();
                  if(text){
                    const s={text,date:todayKey,childId:child.id};
                    setDailySummary(s);
                    try{localStorage.setItem(cacheKey,JSON.stringify(s));}catch(ex){}
                  }
                }catch(ex){}
                setSummaryLoading(false);
              };
              if(!dailySummary && !summaryLoading && SCHEDULE.length>0) setTimeout(generate,400);
              if(!dailySummary && !summaryLoading) return null;
              return (
                <div style={{background:"linear-gradient(135deg,"+c1+"22,"+c2+"14)",borderRadius:"18px",padding:"0.8rem 1rem",marginBottom:"1rem",border:"2px solid "+c1+"30"}}>
                  {summaryLoading?(
                    <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                      <span style={{fontSize:"1.1rem",animation:"pulse 1.2s ease infinite"}}>{"\u2728"}</span>
                      <span style={{fontSize:"0.78rem",color:SK.mid,fontStyle:"italic"}}>{"Getting your daily message\u2026"}</span>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"flex-start",gap:"0.55rem"}}>
                      <span style={{fontSize:"1.2rem",flexShrink:0}}>{"\u2728"}</span>
                      <div style={{flex:1,fontWeight:"700",color:SK.ink,fontSize:"0.86rem",lineHeight:1.5}}>{dailySummary?.text||""}</div>
                      <button onClick={()=>{try{localStorage.removeItem(cacheKey);}catch(ex){}setDailySummary(null);}} style={{background:"transparent",border:"none",color:SK.lite,cursor:"pointer",fontSize:"0.75rem",flexShrink:0}}>{"\u2715"}</button>
                    </div>
                  )}
                </div>
              );
            })()}

            {SCHEDULE.length===0&&(
              <div style={{background:SK.card,borderRadius:"18px",padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>{"🛋"}</div>
                <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.9rem"}}>{"No school today!"}</div>
              </div>
            )}
            {SCHEDULE.map((b,i)=>{
              const done = !!checked[i];
              return (
                <div key={i}><div style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",display:"flex",gap:"0.8rem",alignItems:"center",marginBottom:"0.55rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`2px solid ${done?c1+"50":SK.skyL}`,opacity:done?0.75:1,transition:"all 0.2s"}}>
                  <div style={{width:"44px",height:"44px",borderRadius:"12px",background:done?`linear-gradient(135deg,${c1},${c2})`:`linear-gradient(135deg,${c1}22,${c2}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0,transition:"background 0.2s"}}>{b.i}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"800",color:done?c1:SK.ink,fontSize:"0.9rem",textDecoration:done?"line-through":"none"}}>{b.s}</div>
                    <div style={{fontSize:"0.72rem",color:SK.lite}}>{b.dur+" min"+(b.t?" \u00b7 "+b.t:"")}</div>
                  </div>
                  <div onClick={()=>checkSubject(i,b)}
                    style={{width:"32px",height:"32px",borderRadius:"50%",border:`2.5px solid ${done?c1:"#ddd"}`,background:done?`linear-gradient(135deg,${c1},${c2})`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",color:done?"#fff":"#ccc",cursor:done?"default":"pointer",flexShrink:0,transition:"all 0.2s"}}>
                    {done?"✓":""}
                  </div>
                </div>
              {done&&(
                <div style={{display:"flex",gap:"0.4rem",marginTop:"0.35rem",paddingLeft:"3.3rem"}}>
                  <button onClick={()=>setShowQuiz({blockIdx:i,subjLabel:b.s,subjIcon:b.i||"📋",grade:child.grade||"3rd"})}
                    style={{padding:"0.25rem 0.65rem",border:"1.5px solid "+c1+"60",borderRadius:"20px",background:c1+"12",color:c1,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>
                    {"✨ Quick Challenge"}
                  </button>
                  <button onClick={()=>kidCamRef.current?.click()}
                    style={{padding:"0.25rem 0.65rem",border:"1.5px solid "+SK.sky+"80",borderRadius:"20px",background:SK.skyL,color:SK.sky,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>
                    {"📷 Snap"}
                  </button>
                  <button onClick={()=>onOpenFieldStudy&&onOpenFieldStudy()}
                    style={{padding:"0.25rem 0.65rem",border:"1.5px solid #2d9e5f60",borderRadius:"20px",background:"#edf9f0",color:"#2d9e5f",fontSize:"0.68rem",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>
                    {"🔭 Field Study"}
                  </button>
                </div>
              )}
            </div>
            );
            })}
            {/* Activity nudge */}
            {Object.keys(checked).length>0&&Object.keys(checked).length<SCHEDULE.length&&(()=>{
              const lastIdx=Math.max(...Object.keys(checked).map(Number));
              const lastSubj=(SCHEDULE[lastIdx]?.s||"").toLowerCase();
              const ACT={
                math:    ["🔢 Count how many steps from one room to another!","🎲 Roll two dice and multiply the numbers!","🏠 Count all windows in your house, then the doors!"],
                reading: ["📖 Tell someone one thing that happened in your book.","💬 Share your favorite sentence from today's reading.","🔤 Find 3 cool words and say them out loud!"],
                science: ["🔭 Look outside — what can you observe about nature?","🌦 Guess what the weather will be like tomorrow.","🧪 What science question are you most curious about?"],
                history: ["🗺 Find a place you learned about on a map.","📜 How was life different for kids 100 years ago?","👴 Ask someone older what school was like for them!"],
                writing: ["✏ Write one sentence about your favorite part of today.","📝 Draw something and write 2 sentences about it.","💭 Write a note to your future self!"],
                art:     ["🎨 Draw something using only 3 colors!","🖏 Sketch one object you can see right now.","🌈 Try drawing with your other hand — tricky!"],
              };
              const key=Object.keys(ACT).find(k=>lastSubj.includes(k));
              if(!key) return null;
              const tip=ACT[key][new Date().getDate()%ACT[key].length];
              return (
                <div style={{background:"linear-gradient(135deg,"+c1+"12,"+c2+"08)",borderRadius:"14px",padding:"0.75rem 1rem",marginTop:"0.5rem",border:"1.5px solid "+c1+"25",display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
                  <span style={{fontSize:"1.2rem",flexShrink:0,marginTop:"2px"}}>{"💡"}</span>
                  <div>
                    <div style={{fontSize:"0.63rem",fontWeight:"800",color:c1,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"3px"}}>{"Quick activity!"}</div>
                    <div style={{fontSize:"0.78rem",color:SK.ink,lineHeight:1.55}}>{tip}</div>
                  </div>
                </div>
              );
            })()}
            {Object.keys(checked).length>0&&Object.keys(checked).length===SCHEDULE.length&&SCHEDULE.length>0&&(
              <div style={{background:`linear-gradient(135deg,${c1}22,${c2}11)`,borderRadius:"18px",padding:"1rem",textAlign:"center",marginTop:"0.5rem",border:`2px solid ${c1}40`}}>
                <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>{"🌟"}</div>
                <div style={{fontWeight:"900",color:c1,fontSize:"0.95rem"}}>{"All done! Amazing work today!"}</div>
              </div>
            )}
          </div>
        )}

        {/* -- MY WORK TAB -- */}
        {sTab==="mywork" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.25rem"}}>{"⭐ My Work"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Everything you\u2019ve learned so far"}</div>

            {myEntries.filter(e=>!e.isDay).length===0 ? (
              <div style={{background:SK.card,borderRadius:"22px",padding:"2.2rem 1.5rem",textAlign:"center",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"bounce 2s ease infinite"}}>{"🌱"}</div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1rem",marginBottom:"0.3rem"}}>{"Nothing here yet!"}</div>
                <div style={{fontSize:"0.8rem",color:SK.lite,lineHeight:1.65}}>{"Check off subjects on the Today tab and they\u2019ll show up here."}</div>
              </div>
            ) : (()=>{
              const subjEntries = myEntries.filter(e=>!e.isDay&&e.subj!=="Daily Notes");
              const yr4 = new Date().getFullYear();
              const ws4 = new Date(); ws4.setDate(ws4.getDate()-(ws4.getDay()===0?6:ws4.getDay()-1)); ws4.setHours(0,0,0,0);
              const thisWeek4 = subjEntries.filter(e=>{ try{ return new Date(e.date+", "+yr4)>=ws4; }catch{return false;} });
              const totalLessons = subjEntries.reduce((s,e)=>s+(e.lessonCount||1),0);

              // Group by subject
              const bySubj4 = {};
              subjEntries.forEach(e=>{
                if(!bySubj4[e.subj]) bySubj4[e.subj]={subj:e.subj,thumb:e.thumb||"📋",entries:[]};
                bySubj4[e.subj].entries.push(e);
              });
              const subjGroups = Object.values(bySubj4).sort((a,b)=>b.entries.length-a.entries.length);

              // Reading titles
              const readingTitles4 = [...new Set(subjEntries.filter(e=>e.readingTitle).map(e=>e.readingTitle))];

              return (
                <>
                  {/* Stats strip */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.45rem",marginBottom:"1rem"}}>
                    {[
                      {n:subjEntries.length, l:"Entries", e:"📚"},
                      {n:totalLessons,       l:"Lessons", e:"✏️"},
                      {n:thisWeek4.length,   l:"This Week",e:"🗓"},
                    ].map(({n,l,e})=>(
                      <div key={l} style={{background:SK.card,borderRadius:"16px",padding:"0.75rem 0.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                        <div style={{fontSize:"1.3rem",marginBottom:"2px"}}>{e}</div>
                        <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.1rem",lineHeight:1}}>{n}</div>
                        <div style={{fontSize:"0.6rem",color:SK.lite,fontWeight:"600",marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Reading list */}
                  {readingTitles4.length>0&&(
                    <div style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",marginBottom:"0.75rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                      <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>{"📖 Books I\u2019ve Read"}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                        {readingTitles4.slice(0,6).map((t,i)=>(
                          <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.3rem 0",borderBottom:i<Math.min(readingTitles4.length,6)-1?"1px solid #f5f0ea":"none"}}>
                            <span style={{fontSize:"0.8rem",flexShrink:0}}>{"📗"}</span>
                            <span style={{fontSize:"0.78rem",color:SK.ink,fontWeight:"600",fontStyle:"italic"}}>{t}</span>
                          </div>
                        ))}
                        {readingTitles4.length>6&&<div style={{fontSize:"0.68rem",color:SK.lite,marginTop:"2px"}}>{"+"+(readingTitles4.length-6)+" more"}</div>}
                      </div>
                    </div>
                  )}

                  {/* Subject groups */}
                  {subjGroups.map(sg=>{
                    const recent = sg.entries.slice(0,3);
                    const total  = sg.entries.length;
                    return (
                      <div key={sg.subj} style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",marginBottom:"0.65rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.6rem"}}>
                          <div style={{width:"38px",height:"38px",borderRadius:"10px",background:`linear-gradient(135deg,${c1}22,${c2}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{sg.thumb}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem"}}>{sg.subj}</div>
                            <div style={{fontSize:"0.65rem",color:SK.lite}}>{total+" entr"+(total===1?"y":"ies")}</div>
                          </div>
                          <div style={{background:`linear-gradient(135deg,${c1},${c2})`,borderRadius:"20px",padding:"0.15rem 0.55rem"}}>
                            <span style={{fontWeight:"900",color:"#fff",fontSize:"0.76rem"}}>{total}</span>
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                          {recent.map((e,i)=>(
                            <div key={e.id||i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",padding:"0.35rem 0.5rem",background:e.selfLogged?`${c1}10`:"#fafafa",borderRadius:"10px",border:e.selfLogged?`1px solid ${c1}25`:"1px solid transparent"}}>
                              <span style={{fontSize:"0.7rem",color:SK.lite,flexShrink:0,marginTop:"1px",minWidth:"42px"}}>{e.date}</span>
                              <span style={{fontSize:"0.76rem",color:SK.ink,flex:1,lineHeight:1.4}}>{e.note&&e.note.trim()?e.note.slice(0,80):e.readingTitle?("\uD83D\uDCDA "+e.readingTitle):e.title}</span>
                              {e.selfLogged&&<span style={{fontSize:"0.6rem",color:c1,fontWeight:"700",flexShrink:0}}>{"you"}</span>}
                            </div>
                          ))}
                          {total>3&&<div style={{fontSize:"0.65rem",color:SK.lite,textAlign:"center",marginTop:"2px"}}>{"+"+(total-3)+" more entries"}</div>}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}

            {/* Submit to Portfolio */}
            <div style={{marginTop:"1rem",background:SK.card,borderRadius:"22px",padding:"1rem 1.1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
              <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"📬 Share with Mom/Dad"}</div>
              <div style={{fontSize:"0.73rem",color:SK.lite,lineHeight:1.6,marginBottom:"0.75rem"}}>{"Did something awesome today? Send it to your portfolio for approval!"}</div>
              {submitSent?(
                <div style={{textAlign:"center",padding:"0.75rem",background:"#e8f5e9",borderRadius:"14px"}}>
                  <div style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>{"🎉"}</div>
                  <div style={{fontWeight:"800",color:"#2e7d32",fontSize:"0.88rem"}}>{"Sent!"}</div>
                  <div style={{fontSize:"0.72rem",color:"#555",marginTop:"2px"}}>{"Your parent will review it soon."}</div>
                  <button onClick={()=>{setSubmitSent(false);setSubmitNote("");setSubmitSubj("");setSubmitOpen(false);}}
                    style={{marginTop:"0.6rem",padding:"0.35rem 0.9rem",border:"none",borderRadius:"10px",background:"#c8e6c9",color:"#1b5e20",fontWeight:"700",fontSize:"0.74rem",cursor:"pointer"}}>{"Send Another"}</button>
                </div>
              ):!submitOpen?(
                <button onClick={()=>setSubmitOpen(true)}
                  style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"14px",background:`linear-gradient(135deg,${c1},${c2})`,color:"#fff",fontWeight:"800",fontSize:"0.86rem",cursor:"pointer",boxShadow:`0 3px 12px ${c1}44`}}>
                  {"📬 Submit Something"}
                </button>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  <input value={submitSubj} onChange={e=>setSubmitSubj(e.target.value)}
                    placeholder={"What subject? (e.g. Reading, Math, Art...)"}
                    style={{padding:"0.55rem 0.75rem",border:`2px solid ${c1}40`,borderRadius:"11px",fontSize:"0.8rem",fontFamily:"inherit",background:"#fff",color:SK.ink,outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=c1}
                    onBlur={e=>e.target.style.borderColor=c1+"40"}/>
                  <textarea value={submitNote} onChange={e=>setSubmitNote(e.target.value)}
                    placeholder={"Tell your parent what you learned or made today! \u2b50"}
                    rows={3}
                    style={{padding:"0.55rem 0.75rem",border:`2px solid ${c1}40`,borderRadius:"11px",fontSize:"0.8rem",fontFamily:"inherit",background:"#fff",color:SK.ink,resize:"none",outline:"none",lineHeight:1.55}}
                    onFocus={e=>e.target.style.borderColor=c1}
                    onBlur={e=>e.target.style.borderColor=c1+"40"}/>
                  <div style={{display:"flex",gap:"0.5rem"}}>
                    <button onClick={()=>{setSubmitOpen(false);setSubmitNote("");setSubmitSubj("");}}
                      style={{flex:1,padding:"0.55rem",border:`2px solid ${c1}30`,borderRadius:"11px",background:"transparent",color:SK.lite,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>{"Cancel"}</button>
                    <button
                      onClick={()=>{
                        if(!submitNote.trim()) return;
                        const ds=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
                        onSubmitEntry&&onSubmitEntry({
                          subj:submitSubj.trim()||"My Work",
                          note:submitNote.trim(),
                          date:ds,
                          thumb:"\uD83D\uDCEC",
                          title:child.name+"'s submission \u2014 "+(submitSubj.trim()||"My Work"),
                          childId:child.id,childName:child.name,childAvatar:child.avatar,
                        });
                        setSubmitSent(true);
                      }}
                      disabled={!submitNote.trim()}
                      style={{flex:2,padding:"0.55rem",border:"none",borderRadius:"11px",background:submitNote.trim()?`linear-gradient(135deg,${c1},${c2})`:"#ddd",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:submitNote.trim()?"pointer":"default"}}>
                      {"Send to Portfolio \uD83D\uDCEC"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- STARS TAB -- */}
        {sTab==="stars" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.25rem"}}>{"🌟 My Stars"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Special moments your teacher saved!"}</div>
            {myMilestones.length===0?(
              <div style={{background:SK.card,borderRadius:"22px",padding:"2rem 1.5rem",textAlign:"center",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>{"🌟"}</div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.95rem",marginBottom:"0.3rem"}}>{"No stars yet!"}</div>
                <div style={{fontSize:"0.78rem",color:SK.lite,lineHeight:1.6}}>{"Keep learning and your teacher will mark your best moments as stars."}</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                {myMilestones.map((e,i)=>{
                  const subjObj=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(s=>s.label===e.subj);
                  return (
                    <div key={e.id||i} style={{background:SK.card,borderRadius:"20px",padding:"1rem 1.1rem",boxShadow:"0 3px 16px rgba(0,0,0,0.08)",border:"2px solid "+c1+"30",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"linear-gradient(90deg,"+c1+","+c2+")"}} />
                      <div style={{display:"flex",gap:"0.6rem",alignItems:"center",marginBottom:"0.5rem"}}>
                        <span style={{fontSize:"1.3rem"}}>{subjObj?.icon||e.thumb||"📋"}</span>
                        <div>
                          <div style={{fontWeight:"800",color:c1,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>{e.subj}</div>
                          <div style={{fontSize:"0.65rem",color:SK.lite}}>{e.date}</div>
                        </div>
                        <span style={{marginLeft:"auto",fontSize:"1.5rem"}}>{"🌟"}</span>
                      </div>
                      {e.note&&<div style={{fontSize:"0.82rem",color:SK.ink,lineHeight:1.65}}>{e.note.replace("AI Summary:","").trim()}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -- KID GOALS TAB -- */}
        {sTab==="goals" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.25rem"}}>
              <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem"}}>{"🎯 My Goals"}</div>
              <button onClick={()=>setShowKidOnboard(true)}
                style={{padding:"0.25rem 0.65rem",border:"1.5px solid "+c1+"50",borderRadius:"20px",background:"transparent",color:c1,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>{"Edit goals"}</button>
            </div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Tap a goal you worked on today!"}</div>
            {kidGoals.length===0?(
              <div style={{background:SK.card,borderRadius:"18px",padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"0.8rem",color:SK.lite}}>{"No goals yet."}</div>
                <button onClick={()=>setShowKidOnboard(true)}
                  style={{marginTop:"0.75rem",padding:"0.6rem 1.2rem",border:"none",borderRadius:"12px",background:"linear-gradient(135deg,"+c1+","+c2+")",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>{"Set my goals!"}</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                {kidGoals.map((g,i)=>{
                  const done=kidGoalLogged.has(g);
                  const isExp=expandedGoal===g;
                  const noteVal=goalNoteMap[g]||"";
                  return (
                    <div key={i} style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:"2px solid "+(done?c1+"60":isExp?c1+"50":SK.skyL),transition:"border-color 0.15s"}}>
                      {/* Row */}
                      <div style={{display:"flex",gap:"0.85rem",alignItems:"center",cursor:done?"default":"pointer"}} onClick={()=>{ if(!done) setExpandedGoal(isExp?null:g); }}>
                        <div style={{width:"46px",height:"46px",borderRadius:"13px",background:done?"linear-gradient(135deg,"+c1+","+c2+")":"linear-gradient(135deg,"+c1+"22,"+c2+"11)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>{"🎯"}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"800",color:done?c1:SK.ink,fontSize:"0.88rem"}}>{g}</div>
                          <div style={{fontSize:"0.68rem",color:SK.lite,marginTop:"2px"}}>{done?"Logged today! 🌟":isExp?"Add a note below — or just tap Log!":"Tap to log working on this"}</div>
                        </div>
                        {done?(
                          <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,"+c1+","+c2+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.85rem",flexShrink:0}}>{"\u2713"}</div>
                        ):(
                          <div style={{width:"28px",height:"28px",borderRadius:"50%",border:"2.5px solid "+(isExp?c1:"#ddd"),flexShrink:0}}/>
                        )}
                      </div>
                      {/* Expanded note + log button */}
                      {isExp&&!done&&(
                        <div style={{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1.5px solid "+c1+"20"}}>
                          <textarea
                            value={noteVal}
                            onChange={e=>setGoalNoteMap(m=>({...m,[g]:e.target.value}))}
                            placeholder={"What did you do? (optional)"}
                            rows={2}
                            style={{width:"100%",padding:"0.6rem 0.75rem",border:"2px solid "+c1+"40",borderRadius:"12px",fontSize:"0.82rem",fontFamily:"inherit",background:"#fff",color:SK.ink,resize:"none",outline:"none",lineHeight:1.5,marginBottom:"0.6rem"}}
                          />
                          <button onClick={()=>{ logKidGoal(g,noteVal); setExpandedGoal(null); }}
                            style={{width:"100%",padding:"0.6rem",border:"none",borderRadius:"12px",background:"linear-gradient(135deg,"+c1+","+c2+")",color:"#fff",fontWeight:"900",fontSize:"0.85rem",cursor:"pointer"}}>
                            {"🎯 Log this goal!"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {kidGoalLogged.size>0&&(
              <div style={{background:"linear-gradient(135deg,"+c1+"15,"+c2+"10)",borderRadius:"16px",padding:"0.85rem 1rem",marginTop:"0.9rem",textAlign:"center",border:"1.5px solid "+c1+"30"}}>
                <div style={{fontWeight:"800",color:c1,fontSize:"0.85rem"}}>{"🌟 "+kidGoalLogged.size+" goal"+(kidGoalLogged.size>1?"s":"")+" logged today!"}</div>
              </div>
            )}
          </div>
        )}

        {/* -- ASK BLOOM TAB -- */}
        {sTab==="bloom" && (
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)",animation:"fadeUp 0.22s ease"}}>
            {/* Bloom header */}
            <div style={{background:`linear-gradient(135deg,${c1},${c2})`,padding:"0.9rem 1rem",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <div style={{width:"42px",height:"42px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>{"🌱"}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{"Ask Bloom"}</div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.75)",marginTop:"1px"}}>{"Your personal learning buddy — ask me anything about your subjects!"}</div>
                </div>
                <button onClick={()=>setBloomHintMode(v=>!v)}
                  style={{padding:"0.25rem 0.6rem",borderRadius:"20px",border:"1.5px solid rgba(255,255,255,0.4)",background:bloomHintMode?"rgba(255,255,255,0.25)":"transparent",color:"#fff",fontSize:"0.65rem",fontWeight:"700",cursor:"pointer",transition:"all 0.15s",flexShrink:0}}>
                  {bloomHintMode?"💡 Hint mode ON":"💡 Hint mode"}
                </button>
              </div>
            </div>
            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"0.75rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.75rem",background:SK.cream}}>
              {bloomMsgs.length===0&&(
                <div style={{textAlign:"center",padding:"1.5rem 1rem"}}>
                  <div style={{fontSize:"3rem",marginBottom:"0.6rem"}}>{"🌱"}</div>
                  <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.92rem",marginBottom:"0.4rem"}}>{"Hi "+child.name+"! I'm Bloom."}</div>
                  <div style={{fontSize:"0.78rem",color:SK.mid,lineHeight:1.65,marginBottom:"1rem"}}>{"I'm here to help you learn! Ask me anything about your school subjects."}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                    {["🔭 What is photosynthesis?","🔢 How do I multiply fractions?","🌍 Why is the sky blue?","📖 Help me understand a word"].map((q,i)=>(
                      <button key={i} onClick={()=>sendToBloom(q.slice(2).trim())}
                        style={{padding:"0.6rem 0.85rem",borderRadius:"20px",border:"1.5px solid "+c1+"40",background:"#fff",color:SK.mid,fontSize:"0.78rem",fontWeight:"600",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {bloomMsgs.map((msg,i)=>(
                <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",flexDirection:msg.role==="user"?"row-reverse":"row"}}>
                  {msg.role==="bloom"&&(
                    <div style={{width:"30px",height:"30px",borderRadius:"50%",background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0,marginTop:"2px"}}>{"🌱"}</div>
                  )}
                  <div style={{maxWidth:"78%"}}>
                    <div style={{background:msg.role==="user"?`linear-gradient(135deg,${c1},${c2})`:"#fff",color:msg.role==="user"?"#fff":SK.ink,padding:"0.6rem 0.85rem",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",fontSize:"0.82rem",lineHeight:1.6,boxShadow:"0 1px 6px rgba(0,0,0,0.08)",fontWeight:"500"}}>
                      {msg.text}
                    </div>
                    {msg.imgUrl&&(
                      <div style={{marginTop:"0.4rem",borderRadius:"12px",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.12)"}}>
                        <img src={msg.imgUrl} alt={msg.imgAlt||"Learning image"}
                          style={{width:"100%",display:"block",maxHeight:"220px",objectFit:"cover"}}
                          onError={e=>{e.target.parentNode.style.display="none";}}/>
                        <div style={{background:"#fff",padding:"0.35rem 0.65rem",fontSize:"0.64rem",color:SK.mid,fontStyle:"italic"}}>{msg.imgAlt}</div>
                      </div>
                    )}
                    {msg.role==="bloom"&&onAddEntry&&(
                      <button onClick={()=>{
                          onAddEntry({childIdx,subj:"Discovery",title:"🌱 "+msg.text.slice(0,60)+(msg.text.length>60?"...":""),
                            note:"I asked Bloom: "+bloomMsgs[i-1]?.text+" \u2014 Bloom explained: "+msg.text.slice(0,200),
                            date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
                            thumb:"🌱",selfLogged:true,isBloomDiscovery:true});
                        }}
                        style={{marginTop:"0.3rem",padding:"0.28rem 0.65rem",borderRadius:"20px",border:"1.5px solid "+c1+"40",background:SK.cream,color:c1,fontSize:"0.66rem",fontWeight:"700",cursor:"pointer"}}>
                        {"📝 Log this as a discovery!"}
                      </button>
                    )}
                    {msg.role==="bloom"&&i>0&&(
                      <button onClick={()=>{
                          const prevQ = bloomMsgs[i-1]?.text||"";
                          sendToBloom("Can you explain that differently? Maybe use a story, a real-life example, or a simple analogy. I want to really understand: "+prevQ);
                        }}
                        style={{marginTop:"0.3rem",marginLeft:"0.35rem",padding:"0.28rem 0.65rem",borderRadius:"20px",border:"1.5px solid "+c1+"30",background:"#fff",color:SK.mid,fontSize:"0.66rem",fontWeight:"700",cursor:"pointer"}}>
                        {"💡 Explain differently"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bloomLoading&&(
                <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <div style={{width:"30px",height:"30px",borderRadius:"50%",background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{"🌱"}</div>
                  <div style={{background:"#fff",padding:"0.65rem 1rem",borderRadius:"18px 18px 18px 4px",boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
                    <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                      {[0,1,2].map(i=>(<div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:c1,animation:"bounce 0.9s "+i*0.15+"s ease-in-out infinite"}}/>))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Input bar */}
            <div style={{padding:"0.65rem 0.85rem",background:"#fff",borderTop:"1.5px solid "+SK.skyL,display:"flex",gap:"0.5rem",alignItems:"flex-end",flexShrink:0}}>
              <textarea
                value={bloomInput}
                onChange={e=>setBloomInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendToBloom(bloomInput);} }}
                placeholder={"Ask me anything about "+((family.subjects||[]).length>0?"your subjects":"learning")+"!"}
                rows={1}
                style={{flex:1,padding:"0.55rem 0.75rem",border:"1.5px solid "+c1+"40",borderRadius:"18px",fontSize:"0.84rem",fontFamily:"inherit",background:SK.cream,color:SK.ink,resize:"none",outline:"none",lineHeight:1.4,maxHeight:"80px",overflowY:"auto"}}
              />
              <button onClick={()=>sendToBloom(bloomInput)} disabled={!bloomInput.trim()||bloomLoading}
                style={{width:"38px",height:"38px",borderRadius:"50%",border:"none",background:bloomInput.trim()&&!bloomLoading?`linear-gradient(135deg,${c1},${c2})`:"#ddd",color:"#fff",fontSize:"1.1rem",cursor:bloomInput.trim()&&!bloomLoading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.2s"}}>
                {"↑"}
              </button>
            </div>
          </div>
        )}

        {/* -- BOOKS TAB -- */}
        {sTab==="books" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.15rem"}}>{"📚 My Book List"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>
              {myReadingTitles.length===0?"Add the books you've been reading!":myReadingTitles.length+" book"+(myReadingTitles.length===1?"":"s")+" so far 🎉"}
            </div>
            {/* Add a book */}
            <div style={{background:SK.card,borderRadius:"18px",padding:"1rem",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>{"📖 Add a book"}</div>
              <div style={{display:"flex",gap:"0.45rem"}}>
                <input value={addBookText} onChange={e=>setAddBookText(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&saveBook()}
                  placeholder={"e.g. Charlotte's Web"}
                  style={{flex:1,padding:"0.65rem 0.8rem",border:"2px solid "+(addBookText?c1:"#ece5dc"),borderRadius:"12px",fontSize:"0.88rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=c1}
                  onBlur={e=>{if(!addBookText)e.target.style.borderColor="#ece5dc";}}
                />
                <button onClick={saveBook} disabled={!addBookText.trim()}
                  style={{padding:"0.65rem 0.9rem",border:"none",borderRadius:"12px",background:addBookText.trim()?"linear-gradient(135deg,"+c1+","+c2+")":" #e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.88rem",cursor:addBookText.trim()?"pointer":"default",flexShrink:0}}>
                  {bookSaved?"✓":"Add"}
                </button>
              </div>
            </div>
            {/* Book list */}
            {myReadingTitles.length===0?(
              <div style={{background:SK.card,borderRadius:"18px",padding:"2rem 1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.6rem",animation:"bounce 2s ease infinite"}}>{"📚"}</div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.95rem",marginBottom:"0.25rem"}}>{"No books yet!"}</div>
                <div style={{fontSize:"0.78rem",color:SK.lite,lineHeight:1.6}}>{"Add books you're reading above and they'll show up here."}</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                {myReadingTitles.map((title,i)=>(
                  <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.75rem 1rem",display:"flex",gap:"0.65rem",alignItems:"center",boxShadow:"0 1px 8px rgba(0,0,0,0.05)"}}>
                    <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"linear-gradient(135deg,"+c1+"30,"+c2+"20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{"📗"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem"}}>{title}</div>
                    </div>
                    <div style={{background:"linear-gradient(135deg,"+c1+","+c2+")",borderRadius:"20px",padding:"0.12rem 0.5rem"}}>
                      <span style={{color:"#fff",fontSize:"0.65rem",fontWeight:"800"}}>{"#"+(i+1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -- CO-OP TAB -- */}
        {sTab==="coop" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.15rem"}}>{"🏫 Co-op"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>
              {isCoop?"Today is co-op day! Log what you did.":"Your next co-op is coming up. What did you do last time?"}
            </div>
            {/* Log co-op session */}
            <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)",border:isCoop?"2.5px solid "+c1+"60":"none"}}>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"center",marginBottom:"0.75rem"}}>
                <div style={{fontSize:"2rem",animation:isCoop?"bounce 2s ease infinite":"none"}}>{"🏫"}</div>
                <div style={{fontWeight:"800",color:isCoop?c1:SK.ink,fontSize:"0.9rem"}}>
                  {isCoop?"Log today's co-op!":"Log a co-op session"}
                </div>
              </div>
              <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
                placeholder={"What did you do at co-op? What did you learn?"} rows={3}
                style={{width:"100%",padding:"0.75rem",border:"2.5px solid "+(noteText?c1:"#ece5dc"),borderRadius:"14px",fontSize:"0.88rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",lineHeight:1.6,outline:"none"}}
                onFocus={e=>e.target.style.borderColor=c1} onBlur={e=>{if(!noteText)e.target.style.borderColor="#ece5dc";}}
              />
              <button onClick={()=>{
                if(!noteText.trim()) return;
                onCoopLog&&onCoopLog({childId:child.id,note:noteText,session:"Co-op"});
                onAddEntry&&onAddEntry({childIdx,subj:"Co-op",title:"Co-op — "+todayDateStr2,note:noteText,thumb:"🏫",date:todayDateStr2,isCoop:true});
                setNoteText(""); setNoteSaved(true);
                setTimeout(()=>setNoteSaved(false),2400);
              }} disabled={!noteText.trim()}
                style={{width:"100%",marginTop:"0.65rem",padding:"0.78rem",border:"none",borderRadius:"13px",background:noteText.trim()?"linear-gradient(135deg,"+SK.sky+","+SK.grass+")":" #e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.9rem",cursor:noteText.trim()?"pointer":"default"}}>
                {noteSaved?"🌟 Saved! +25 pts":"Save co-op note"}
              </button>
            </div>
            {/* Past co-op entries */}
            {(()=>{
              const coopEntries = myEntries.filter(e=>e.isCoop||e.subj==="Co-op").slice(0,6);
              if(coopEntries.length===0) return null;
              return (
                <div>
                  <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>{"Past sessions"}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                    {coopEntries.map((e,i)=>(
                      <div key={e.id||i} style={{background:SK.card,borderRadius:"14px",padding:"0.65rem 0.9rem",boxShadow:"0 1px 8px rgba(0,0,0,0.05)",display:"flex",gap:"0.55rem",alignItems:"flex-start"}}>
                        <span style={{fontSize:"1.1rem",flexShrink:0,marginTop:"1px"}}>{"🏫"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:"0.65rem",color:SK.lite,marginBottom:"2px"}}>{e.date}</div>
                          <div style={{fontSize:"0.78rem",color:SK.ink,lineHeight:1.5}}>{e.note||"Co-op session"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* -- CAMERA TAB -- */}
        {sTab==="camera" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.15rem"}}>{"📷 My Photos"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Photos you took today"}</div>
            {/* Camera buttons */}
            <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
              <button onClick={()=>kidCamRef.current?.click()}
                style={{flex:1,padding:"0.75rem",border:"none",borderRadius:"14px",background:"linear-gradient(135deg,"+c1+","+c2+")",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"}}>
                <span>{"📷"}</span><span>{"Take a Photo"}</span>
              </button>
              <button onClick={()=>kidGallRef.current?.click()}
                style={{padding:"0.75rem 0.9rem",border:"2px solid "+c1+"50",borderRadius:"14px",background:"transparent",color:c1,fontWeight:"700",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {"🖼️"}
              </button>
            </div>
            {/* Photo grid */}
            {(()=>{
              const todayPhotos = myEntries.filter(e=>e.date===todayDateStr2&&e.photos&&e.photos.length>0);
              const allPhotos = todayPhotos.flatMap(e=>e.photos.map(src=>({src,entry:e})));
              if(allPhotos.length===0) return (
                <div style={{background:SK.card,borderRadius:"18px",padding:"2rem 1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:"3rem",marginBottom:"0.5rem",animation:"bounce 2s ease infinite"}}>{"📷"}</div>
                  <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"No photos today yet!"}</div>
                  <div style={{fontSize:"0.75rem",color:SK.lite,lineHeight:1.6}}>{"Tap the camera button to snap a photo of your work."}</div>
                </div>
              );
              return (
                <>
                  <div style={{fontSize:"0.7rem",color:SK.lite,marginBottom:"0.55rem",fontWeight:"600"}}>{allPhotos.length+" photo"+(allPhotos.length===1?"":"s")+" today"}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.5rem"}}>
                    {allPhotos.map(({src,entry},i)=>(
                      <div key={i} style={{aspectRatio:"1",borderRadius:"14px",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.1)",position:"relative"}}>
                        <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.55)",padding:"0.5rem 0.5rem 0.4rem"}}>
                          <div style={{fontSize:"0.65rem",color:"#fff",fontWeight:"700"}}>{entry.subj}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:"0.65rem",color:SK.lite,textAlign:"center",marginTop:"0.75rem",fontStyle:"italic"}}>{"Photos are saved to your portfolio for today only."}</div>
                </>
              );
            })()}
          </div>
        )}

        {/* -- STREAK TAB -- */}
        {sTab==="streak" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"1rem"}}>{"🔥 Streak & Points"}</div>
            <div style={{background:`linear-gradient(135deg,${SK.orange},${SK.sun})`,borderRadius:"24px",padding:"1.6rem 1.2rem",textAlign:"center",marginBottom:"0.9rem",boxShadow:`0 6px 28px ${SK.orange}45`}}>
              <div style={{fontSize:"4.5rem",lineHeight:1,marginBottom:"0.3rem",animation:"bounce 1.8s ease infinite"}}>🔥</div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"3.2rem",lineHeight:1}}>{realStreak}</div>
              <div style={{fontWeight:"700",color:"rgba(255,255,255,0.82)",fontSize:"1rem",marginTop:"0.2rem"}}>{realStreak===1?"day streak":"day streak"}</div>
            </div>
            <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:"1rem"}}>
              <div style={{width:"54px",height:"54px",borderRadius:"14px",background:`linear-gradient(135deg,${SK.sun},${SK.orange}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>{"⭐"}</div>
              <div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.05rem"}}>{realPoints+" points total"}</div>
                <div style={{fontSize:"0.72rem",color:SK.lite}}>{"10 pts for every logged lesson"}</div>
              </div>
            </div>
            <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem",marginBottom:"0.75rem"}}>{"This week"}</div>
              <div style={{display:"flex",gap:"0.5rem",justifyContent:"space-around"}}>
                {["M","T","W","T","F"].map((d,i)=>{
                  const dot = weekDots[i];
                  const bg = dot.done
                    ? `linear-gradient(135deg,${c1},${c2})`
                    : dot.isToday
                      ? SK.skyL
                      : dot.isPast ? "#ece5dc" : "#f5f0ea";
                  const emoji = dot.done ? "✓" : dot.isToday ? "→" : "";
                  const col = dot.done ? SK.grass : dot.isPast ? SK.lite : SK.lite;
                  return (
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{width:"40px",height:"40px",borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:"4px",color:dot.done?"#fff":SK.lite,fontWeight:"900"}}>{emoji}</div>
                      <div style={{fontSize:"0.62rem",color:col,fontWeight:"700"}}>{d}</div>
                    </div>
                  );
                })}
              </div>

            {/* Badges */}
            {(()=>{
              const totalEntries2 = myEntries.filter(e=>!e.isDay).length;
              const BADGES = [
                {id:"first",    icon:"🌱", label:"First Step",    earned:totalEntries2>=1},
                {id:"five",     icon:"🔥", label:"On a Roll",     earned:totalEntries2>=5},
                {id:"ten",      icon:"⭐",     label:"Star Learner",  earned:totalEntries2>=10},
                {id:"fifty",    icon:"🏆", label:"Super Scholar", earned:totalEntries2>=50},
                {id:"streak3",  icon:"🌈", label:"3-Day Streak",  earned:realStreak>=3},
                {id:"streak7",  icon:"🚀", label:"Week Warrior",  earned:realStreak>=7},
                {id:"streak30", icon:"🌟", label:"Month Master",  earned:realStreak>=30},
                {id:"mlstone",  icon:"📍", label:"Milestone!",    earned:myMilestones.length>=1},
              ];
              const earned2=BADGES.filter(b=>b.earned), locked2=BADGES.filter(b=>!b.earned);
              return (
                <div style={{background:SK.card,borderRadius:"20px",padding:"1rem",marginTop:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                  <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.86rem",marginBottom:"0.65rem"}}>{"🏅 My Badges"}</div>
                  {earned2.length===0&&<div style={{fontSize:"0.74rem",color:SK.lite,textAlign:"center",padding:"0.5rem 0"}}>{"Keep logging to earn badges!"}</div>}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.5rem",marginBottom:locked2.length>0?"0.65rem":"0"}}>
                    {earned2.map(bg=>(
                      <div key={bg.id} style={{textAlign:"center"}}>
                        <div style={{fontSize:"1.8rem",marginBottom:"2px"}}>{bg.icon}</div>
                        <div style={{fontSize:"0.58rem",fontWeight:"700",color:c1,lineHeight:1.2}}>{bg.label}</div>
                      </div>
                    ))}
                  </div>
                  {locked2.length>0&&(
                    <>
                      <div style={{fontSize:"0.6rem",color:SK.lite,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:"700",marginBottom:"0.4rem"}}>{"Still to earn"}</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.5rem"}}>
                        {locked2.map(bg=>(
                          <div key={bg.id} style={{textAlign:"center",opacity:0.3,filter:"grayscale(1)"}}>
                            <div style={{fontSize:"1.8rem",marginBottom:"2px"}}>{bg.icon}</div>
                            <div style={{fontSize:"0.58rem",fontWeight:"700",color:SK.mid,lineHeight:1.2}}>{bg.label}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
            </div>
          </div>
        )}
      </div>

      {/* Student bottom nav */}
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"430px",background:SK.card,borderTop:`2.5px solid ${SK.skyL}`,height:"68px",display:"flex",alignItems:"center",zIndex:50}}>
        {STABS.map(t=>{
          const act=sTab===t.id;
          return (
            <button key={t.id} onClick={()=>setSTab(t.id)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"0.4rem 0",border:"none",background:"transparent",cursor:"pointer",position:"relative",transition:"transform 0.1s"}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.88)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onTouchStart={e=>e.currentTarget.style.transform="scale(0.88)"}
              onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
              {act&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"32px",height:"3px",borderRadius:"0 0 4px 4px",background:`linear-gradient(90deg,${c1},${c2})`}}/>}
              <span style={{fontSize:"1.35rem",lineHeight:1}}>{t.icon}</span>
              <span style={{fontSize:"0.6rem",fontWeight:act?"900":"500",color:act?c1:SK.lite}}>{t.l}</span>
            </button>
          );
        })}
      </nav>

      {/* Quiz modal */}
      {showQuiz&&(
        <KidQuizModal
          child={child} family={family}
          subjLabel={showQuiz.subjLabel}
          subjIcon={showQuiz.subjIcon}
          grade={showQuiz.grade}
          todayEntries={myEntries.filter(e=>e.date===todayDateStr2&&e.subj===showQuiz.subjLabel)}
          allTodayEntries={myEntries.filter(e=>e.date===todayDateStr2)}
          c1={c1} c2={c2}
          onSaveResult={(result)=>{
            onAddEntry&&onAddEntry({
              childIdx, subj:showQuiz.subjLabel,
              title:"🎯 Quiz: "+showQuiz.subjLabel+" — "+todayDateStr2,
              date:todayDateStr2, thumb:"🎯",
              note:"Quiz score: "+result.score+"/"+result.total+". "+
                (result.missed.length>0?"Needs work: "+result.missed.join(", ")+".":"All correct!"),
              isQuizResult:true,
              quizData:result,
              selfLogged:true,
            });
            onQuizComplete&&onQuizComplete({
              id:"qn_"+Date.now(),
              childId:child.id,
              childName:child.name,
              childAvatar:child.avatar||"⭐",
              subj:showQuiz.subjLabel,
              subjIcon:showQuiz.subjIcon||"📋",
              score:result.score,
              total:result.total,
              missed:result.missed||[],
              date:todayDateStr2,
              ts:Date.now(),
              dismissed:false,
            });
            // Check for quiz streak (3+ consecutive quizzes >=80%)
            const recentQuizzes = myEntries
              .filter(e=>e.isQuizResult&&e.quizData)
              .sort((a,b)=>(b.ts||0)-(a.ts||0))
              .slice(0,2); // last 2 before this one
            const thisPct = result.total>0 ? Math.round((result.score/result.total)*100) : 0;
            const prevGood = recentQuizzes.length>=2 &&
              recentQuizzes.every(e=>e.quizData.total>0 && Math.round((e.quizData.score/e.quizData.total)*100)>=80);
            if(thisPct>=80 && prevGood) {
              setStreakCelebration({streak:3, childName:child.name, pct:thisPct, subj:showQuiz.subjLabel});
            }
            setShowQuiz(null);
          }}
          onClose={()=>setShowQuiz(null)}
        />
      )}

      {/* First Field Study Celebration */}
      {showFirstFieldStudy&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(135deg,#2d9e5f,#1a6e40)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",animation:"fadeIn 0.4s ease",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {Array.from({length:40}).map((_,i)=>(
              <span key={i} style={{position:"absolute",left:Math.random()*100+"%",top:"-10px",width:"10px",height:"10px",borderRadius:Math.random()>0.5?"50%":"2px",background:["#fff","rgba(255,255,255,0.7)","#a8f0c0","#ffeb3b","#ff9800"][Math.floor(Math.random()*5)],animation:"fall "+(1.5+Math.random()*2.5)+"s ease "+(Math.random()*1.5)+"s forwards",transform:"rotate("+Math.random()*360+"deg)",display:"block"}}/>
            ))}
          </div>
          <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"grow 0.5s ease both"}}>{"🔭"}</div>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.6rem",lineHeight:1.2,marginBottom:"0.4rem",textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{"First Field Study!"}</div>
          <div style={{fontWeight:"700",color:"rgba(255,255,255,0.9)",fontSize:"1rem",marginBottom:"0.5rem"}}>{"You\u2019re a real scientist! \uD83C\uDF3F"}</div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:"16px",padding:"0.75rem 1.2rem",marginBottom:"1.5rem",backdropFilter:"blur(8px)"}}>
            <div style={{color:"#fff",fontSize:"0.88rem",fontWeight:"700"}}>{child.name+" completed their first field study!"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:"0.75rem",marginTop:"3px"}}>{"Exploring the world is the best kind of learning."}</div>
          </div>
          <button onClick={()=>{markTipSeen(CELEB_KEY_FIELD);setShowFirstFieldStudy(false);}}
            style={{padding:"0.85rem 2.5rem",border:"none",borderRadius:"20px",background:"rgba(255,255,255,0.95)",color:"#2d9e5f",fontWeight:"900",fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
            {"Keep Exploring! \u2192"}
          </button>
        </div>
      )}

      {/* First Milestone Celebration */}
      {showFirstMilestone&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(135deg,"+c1+","+c2+")",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",animation:"fadeIn 0.4s ease",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {Array.from({length:40}).map((_,i)=>(
              <span key={i} style={{position:"absolute",left:Math.random()*100+"%",top:"-10px",width:"10px",height:"10px",borderRadius:Math.random()>0.5?"50%":"2px",background:["#fff","rgba(255,255,255,0.7)","rgba(255,255,255,0.4)","#ffeb3b","#ff9800"][Math.floor(Math.random()*5)],animation:"fall "+(1.5+Math.random()*2.5)+"s ease "+(Math.random()*1.5)+"s forwards",transform:"rotate("+Math.random()*360+"deg)",display:"block"}}/>
            ))}
          </div>
          <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"grow 0.5s ease both"}}>{"🌟"}</div>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.6rem",lineHeight:1.2,marginBottom:"0.4rem",textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{"First Star Earned!"}</div>
          <div style={{fontWeight:"700",color:"rgba(255,255,255,0.9)",fontSize:"1rem",marginBottom:"0.5rem"}}>{"Your teacher noticed something amazing! \u2728"}</div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:"16px",padding:"0.75rem 1.2rem",marginBottom:"1.5rem",backdropFilter:"blur(8px)"}}>
            <div style={{color:"#fff",fontSize:"0.88rem",fontWeight:"700"}}>{child.name+" earned their first milestone star!"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:"0.75rem",marginTop:"3px"}}>{"Check your Stars tab to see what you achieved."}</div>
          </div>
          <button onClick={()=>{markTipSeen(CELEB_KEY_MILESTONE);setShowFirstMilestone(false);}}
            style={{padding:"0.85rem 2.5rem",border:"none",borderRadius:"20px",background:"rgba(255,255,255,0.95)",color:c1,fontWeight:"900",fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
            {"See My Stars! \u2192"}
          </button>
        </div>
      )}

      {/* Straight A's Celebration */}
      {showStraightAs&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(135deg,#c8960c,#e8b800)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",animation:"fadeIn 0.4s ease",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {Array.from({length:50}).map((_,i)=>(
              <span key={i} style={{position:"absolute",left:Math.random()*100+"%",top:"-10px",width:"10px",height:"10px",borderRadius:Math.random()>0.5?"50%":"2px",background:["#fff","rgba(255,255,255,0.8)","#fffacd","#ffd700","#ff9800"][Math.floor(Math.random()*5)],animation:"fall "+(1.5+Math.random()*2.5)+"s ease "+(Math.random()*1.5)+"s forwards",transform:"rotate("+Math.random()*360+"deg)",display:"block"}}/>
            ))}
          </div>
          <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"grow 0.5s ease both"}}>{"🏆"}</div>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.6rem",lineHeight:1.2,marginBottom:"0.4rem",textShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>{"Straight A\u2019s!"}</div>
          <div style={{fontWeight:"700",color:"rgba(255,255,255,0.9)",fontSize:"1rem",marginBottom:"0.5rem"}}>{"All subjects \u2014 A or above! \uD83C\uDF1F"}</div>
          <div style={{background:"rgba(255,255,255,0.25)",borderRadius:"16px",padding:"0.75rem 1.2rem",marginBottom:"1.5rem",backdropFilter:"blur(8px)"}}>
            <div style={{color:"#fff",fontSize:"0.88rem",fontWeight:"700"}}>{child.name+" is absolutely crushing it!"}</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:"0.75rem",marginTop:"3px"}}>{"90% or higher across every subject. Incredible work!"}</div>
          </div>
          <button onClick={()=>{markTipSeen(CELEB_KEY_STRAIGHTA);setShowStraightAs(false);}}
            style={{padding:"0.85rem 2.5rem",border:"none",borderRadius:"20px",background:"rgba(255,255,255,0.95)",color:"#c8960c",fontWeight:"900",fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>
            {"Thank you! \uD83C\uDFC6"}
          </button>
        </div>
      )}

      {/* Quiz Streak Celebration */}
      {streakCelebration&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(135deg,"+c1+","+c2+")",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",animation:"fadeIn 0.4s ease",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          {/* Confetti */}
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {Array.from({length:40}).map((_,i)=>(
              <span key={i} style={{position:"absolute",left:Math.random()*100+"%",top:"-10px",width:"10px",height:"10px",borderRadius:Math.random()>0.5?"50%":"2px",background:["#fff","rgba(255,255,255,0.7)","rgba(255,255,255,0.4)","#ffeb3b","#ff9800"][Math.floor(Math.random()*5)],animation:"fall "+(1.5+Math.random()*2.5)+"s ease "+(Math.random()*1.5)+"s forwards",transform:"rotate("+Math.random()*360+"deg)",display:"block"}}/>
            ))}
          </div>
          <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"grow 0.5s ease both"}}>{"\uD83C\uDF1F"}</div>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.6rem",lineHeight:1.2,marginBottom:"0.4rem",textShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
            {"Quiz Streak!"}
          </div>
          <div style={{fontWeight:"700",color:"rgba(255,255,255,0.9)",fontSize:"1rem",marginBottom:"0.5rem"}}>
            {"3 in a row! \uD83D\uDE80"}
          </div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:"16px",padding:"0.75rem 1.2rem",marginBottom:"1.5rem",backdropFilter:"blur(8px)"}}>
            <div style={{color:"#fff",fontSize:"0.88rem",fontWeight:"700"}}>{streakCelebration.childName+" scored "+streakCelebration.pct+"% on "+streakCelebration.subj+"!"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:"0.75rem",marginTop:"3px"}}>{"Keep it up \u2014 you\u2019re on fire!"}</div>
          </div>
          <button onClick={()=>setStreakCelebration(null)}
            style={{padding:"0.85rem 2.5rem",border:"none",borderRadius:"20px",background:"rgba(255,255,255,0.95)",color:c1,fontWeight:"900",fontSize:"1rem",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
            {"Keep Going! \uD83D\uDCAA"}
          </button>
        </div>
      )}

      {/* Hidden camera inputs for kid portal */}
      <input ref={kidCamRef}  type="file" accept="image/*" capture="environment" style={{display:"none"}}
        onChange={e=>{
          const file=e.target.files[0]; if(!file) return;
          const r=new FileReader(); r.onload=ev=>{
            const newPhoto={dataUrl:ev.target.result,ts:Date.now(),date:todayDateStr2,subj:"Photo"};
            setKidPhotos(p=>[newPhoto,...p]);
            onAddEntry&&onAddEntry({childIdx,subj:"Daily Note",title:"📷 Photo — "+todayDateStr2,
              date:todayDateStr2,thumb:"📷",note:"",photos:[ev.target.result],selfLogged:true});
          }; r.readAsDataURL(file);
          e.target.value="";
        }}
      />
      <input ref={kidGallRef} type="file" accept="image/*" multiple style={{display:"none"}}
        onChange={e=>{
          Array.from(e.target.files).forEach(file=>{
            const r=new FileReader(); r.onload=ev=>{
              const newPhoto={dataUrl:ev.target.result,ts:Date.now(),date:todayDateStr2,subj:"Photo"};
              setKidPhotos(p=>[newPhoto,...p]);
              onAddEntry&&onAddEntry({childIdx,subj:"Daily Note",title:"📷 Photo — "+todayDateStr2,
                date:todayDateStr2,thumb:"📷",note:"",photos:[ev.target.result],selfLogged:true});
            }; r.readAsDataURL(file);
          });
          e.target.value="";
        }}
      />

      {/* Quick note after check-off */}
      {quickNotePrompt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.72)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          <div style={{background:SK.cream,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"1.3rem 1.4rem 2rem",animation:"slideUp 0.28s ease"}}>
            <div style={{width:"36px",height:"4px",borderRadius:"99px",background:"#ddd",margin:"0 auto 1rem"}}/>
            <div style={{textAlign:"center",marginBottom:"1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.35rem"}}>{quickNotePrompt.b?.i||"📋"}</div>
              <div style={{fontWeight:"900",color:SK.ink,fontSize:"1rem",marginBottom:"0.15rem"}}>{quickNotePrompt.b?.s+" — done! 🌟"}</div>
              <div style={{fontSize:"0.76rem",color:SK.lite}}>{"Want to write anything about it?"}</div>
            </div>
            <textarea value={quickNoteText} onChange={e=>setQuickNoteText(e.target.value)}
              placeholder={"What did you do? What was fun or hard?"} rows={2} autoFocus
              style={{width:"100%",padding:"0.8rem",border:"2.5px solid "+SK.sky,borderRadius:"14px",fontSize:"0.88rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",outline:"none",marginBottom:"0.65rem",lineHeight:1.5}}
            />
            {/* Photo preview */}
            {quickNotePhoto&&(
              <div style={{position:"relative",marginBottom:"0.65rem",borderRadius:"12px",overflow:"hidden",border:"2px solid "+c1+"40"}}>
                <img src={quickNotePhoto} alt="" style={{width:"100%",maxHeight:"140px",objectFit:"cover",display:"block"}}/>
                <button onClick={()=>setQuickNotePhoto(null)}
                  style={{position:"absolute",top:"6px",right:"6px",width:"24px",height:"24px",borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",color:"#fff",fontSize:"0.75rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
              </div>
            )}
            {/* Photo + save row */}
            <input ref={kidPhotoRef} type="file" accept="image/*" capture="environment"
              onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const r=new FileReader(); r.onload=ev=>setQuickNotePhoto(ev.target.result); r.readAsDataURL(file);
                e.target.value="";
              }} style={{display:"none"}}/>
            <div style={{display:"flex",gap:"0.45rem",marginBottom:"0.45rem"}}>
              <button onClick={()=>kidPhotoRef.current?.click()}
                style={{width:"48px",height:"48px",borderRadius:"13px",border:"2px solid "+(quickNotePhoto?c1:"#ece5dc"),background:quickNotePhoto?c1+"15":"transparent",color:quickNotePhoto?c1:SK.lite,fontSize:"1.3rem",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{"📷"}</button>
              <button onClick={()=>saveQuickNote(quickNotePrompt.blockIdx, quickNotePrompt.b, quickNoteText, quickNotePhoto)}
                style={{flex:1,padding:"0.82rem",border:"none",borderRadius:"13px",background:"linear-gradient(135deg,"+SK.sky+","+SK.grass+")",color:"#fff",fontWeight:"900",fontSize:"0.88rem",cursor:"pointer"}}>
                {quickNoteText.trim()||quickNotePhoto?"Save \xe2\x9c\x93":"Done \xe2\x9c\x93"}
              </button>
            </div>
            <button onClick={()=>saveQuickNote(quickNotePrompt.blockIdx, quickNotePrompt.b, "", null)}
              style={{width:"100%",padding:"0.4rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.72rem",cursor:"pointer"}}>{"Skip"}</button>
          </div>
        </div>
      )}

      {/* Reading title prompt */}
      {readingPrompt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.72)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
          <div style={{background:SK.cream,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"1.5rem 1.4rem 2.2rem",animation:"slideUp 0.28s ease"}}>
            <div style={{width:"36px",height:"4px",borderRadius:"99px",background:"#ddd",margin:"0 auto 1.2rem"}}/>
            <div style={{textAlign:"center",marginBottom:"1.1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.4rem"}}>{readingPrompt.subjIcon}</div>
              <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.1rem",marginBottom:"0.2rem"}}>{"Great job reading! 📖"}</div>
              <div style={{fontSize:"0.8rem",color:SK.lite,lineHeight:1.6}}>{"What were you reading? (You can skip this)"}</div>
            </div>
            <input value={readingTitle2} onChange={e=>setReadingTitle2(e.target.value)}
              placeholder={"e.g. Charlotte\u2019s Web, Chapter 3"}
              autoFocus
              style={{width:"100%",padding:"0.85rem",border:`2.5px solid ${readingTitle2.length>0?c1:"#ece5dc"}`,borderRadius:"14px",fontSize:"0.9rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,outline:"none",marginBottom:"0.75rem"}}
              onFocus={e=>e.target.style.borderColor=c1}
              onBlur={e=>{ if(!readingTitle2.length) e.target.style.borderColor="#ece5dc"; }}
            />
            <button onClick={saveReadingEntry}
              style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:`linear-gradient(135deg,${c1},${c2})`,color:"#fff",fontWeight:"900",fontSize:"0.92rem",cursor:"pointer",marginBottom:"0.5rem"}}>
              {"Save it! ✓"}
            </button>
            <button onClick={()=>{ saveReadingEntry(); }}
              style={{width:"100%",padding:"0.45rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.76rem",cursor:"pointer"}}>
              {"Skip — just mark it done"}
            </button>
          </div>
        </div>
      )}

      {/* Co-op day auto-popup */}
      {showCoopPopup && !coopDone && (
        <CoopDayPopup
          child={child} heroGrad={heroGrad} c1={c1} c2={c2}
          onLog={note=>{
            onCoopLog&&onCoopLog({childId:child.id,note,session:"Co-op"});
            onAddEntry&&onAddEntry({childIdx,subj:"Co-op",title:"Co-op \u2014 "+todayDateStr2,note,thumb:"🏫",date:todayDateStr2,isCoop:true});
            setCoopDone(true);
            setShowCoopPopup(false);
          }}
          onDismiss={()=>setShowCoopPopup(false)}
        />
      )}
    </div>
  );
}

/* =======================================
   KID QUIZ MODAL
======================================= */
// KidQuizModal moved to ai-features.js

/* =======================================
   KID GOAL ONBOARDING
======================================= */

function CoopQuickLogModal({ pal, family, onSave, onClose }) {
  const coopClasses = (family.coopClasses||[]).length>0
    ? family.coopClasses
    : ["Bible / Faith","Art","Science","History","Literature","Math","Music","PE","Other"];

  const [step,         setStep]        = useState(0); // 0=subjects+hrs, 1=notes, 2=photos, 3=done
  const [selSubjs,     setSelSubjs]    = useState(new Set());
  const [hrs,          setHrs]         = useState("2");
  const [subjectNotes, setSubjectNotes]= useState({}); // {childId: {subj: note}}
  const [photos,       setPhotos]      = useState([]);
  const fileRef = useRef(null);

  const toggleSubj = (s) => setSelSubjs(prev=>{
    const n=new Set(prev);
    n.has(s)?n.delete(s):n.add(s);
    return n;
  });
  const updNote = (childId,subj,val) => setSubjectNotes(n=>({
    ...n,
    [childId]:{...(n[childId]||{}),[subj]:val}
  }));
  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(file=>{
      const r=new FileReader();
      r.onload=ev=>setPhotos(p=>[...p,{name:file.name,dataUrl:ev.target.result}]);
      r.readAsDataURL(file);
    });
    e.target.value="";
  };

  const subjList = [...selSubjs];
  const canNext0 = selSubjs.size>0;

  const handleSave = () => {
    onSave({
      session: subjList.join(", ")||"Co-op",
      subjects: subjList,
      hrs: parseFloat(hrs),
      subjectNotes,
      notes: Object.fromEntries(
        family.children.map(c=>[c.id,
          subjList.map(s=>(subjectNotes[c.id]?.[s]||"")).filter(Boolean).join(" | ")
        ])
      ),
      photos: photos.map(p=>p.dataUrl),
    });
    setStep(3);
  };

  const STEP_LABELS = ["Subjects","Notes","Photos","Done"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.78)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:pal.linen,borderRadius:"24px",width:"100%",maxWidth:"420px",maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",animation:"grow 0.22s ease"}}>

        {/* Header */}
        <div style={{padding:"1rem 1.2rem 0.75rem",borderBottom:`1px solid ${pal.stone}30`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"🏫 Log Co-op Session"}</div>
            <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"2px"}}>{STEP_LABELS[step]} {"\u00b7"} Step {step+1} of 4</div>
          </div>
          <button onClick={onClose}
            style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {"✕"}
          </button>
        </div>

        {/* Step dots */}
        <div style={{display:"flex",gap:"4px",padding:"0.55rem 1.2rem 0",flexShrink:0}}>
          {STEP_LABELS.map((l,i)=>(
            <div key={i} style={{flex:1,height:"3px",borderRadius:"99px",background:i<=step?pal.primary:pal.stone+"40",transition:"background 0.25s"}}/>
          ))}
        </div>

        {/* Content */}
        <div key={step} style={{flex:1,overflowY:"auto",padding:"0.85rem 1.2rem"}}>

          {/* Step 0: Select subjects + hours */}
          {step===0&&(<>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",marginBottom:"0.55rem"}}>
              {"Which subjects did you cover?"} <span style={{color:pal.slate,fontWeight:"400"}}>(select all that apply)</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.32rem",marginBottom:"1rem"}}>
              {coopClasses.map(s=>{
                const sel=selSubjs.has(s);
                return (
                  <button key={s} onClick={()=>toggleSubj(s)}
                    style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.6rem 0.85rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                    <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {sel&&<span style={{color:"#fff",fontSize:"0.65rem",fontWeight:"900"}}>{"✓"}</span>}
                    </div>
                    <span style={{fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s}</span>
                  </button>
                );
              })}
            </div>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",marginBottom:"0.45rem"}}>Hours</div>
            <div style={{display:"flex",gap:"0.35rem"}}>
              {["1","1.5","2","2.5","3","3.5","4"].map(h=>(
                <button key={h} onClick={()=>setHrs(h)}
                  style={{flex:1,padding:"0.5rem 0",borderRadius:"10px",border:`2px solid ${hrs===h?pal.primary:pal.stone+"50"}`,background:hrs===h?pal.pale:"transparent",cursor:"pointer",fontWeight:hrs===h?"800":"400",color:hrs===h?pal.primary:pal.inkM,fontSize:"0.8rem"}}>
                  {h}h
                </button>
              ))}
            </div>
          </>)}

          {/* Step 1: Per-subject notes per child */}
          {step===1&&(<>
            <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.55,marginBottom:"0.85rem"}}>
              Add notes for each subject — what did each child do or learn?
            </div>
            {family.children.map(c=>{
              const cp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
              return (
                <div key={c.id} style={{marginBottom:"1rem"}}>
                  {family.children.length>1&&(
                    <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"0.5rem",paddingBottom:"0.4rem",borderBottom:`2px solid ${cp.c1}25`}}>
                      <div style={{width:"26px",height:"26px",borderRadius:"7px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem"}}>{c.avatar}</div>
                      <span style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem"}}>{c.name}</span>
                    </div>
                  )}
                  {subjList.map(subj=>(
                    <div key={subj} style={{marginBottom:"0.55rem"}}>
                      <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.25rem"}}>{"📋 "+subj}</div>
                      <textarea
                        value={(subjectNotes[c.id]||{})[subj]||""}
                        onChange={e=>updNote(c.id,subj,e.target.value)}
                        placeholder={"What did "+c.name+" do in "+subj+"?"}
                        rows={2}
                        style={{width:"100%",padding:"0.55rem 0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.8rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.5}}
                        onFocus={e=>e.target.style.borderColor=cp.c1}
                        onBlur={e=>e.target.style.borderColor=pal.stone}/>
                    </div>
                  ))}
                </div>
              );
            })}
          </>)}

          {/* Step 2: Photos */}
          {step===2&&(<>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",marginBottom:"0.3rem"}}>{"Add Photos"}</div>
            <div style={{fontSize:"0.73rem",color:pal.slate,marginBottom:"0.75rem",lineHeight:1.5}}>
              Optional — photos will be saved with each subject entry in the portfolio.
            </div>
            <input type="file" ref={fileRef} accept="image/*" multiple onChange={handlePhoto} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()}
              style={{width:"100%",padding:"1rem",border:`2px dashed ${pal.primary}50`,borderRadius:"14px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.84rem",cursor:"pointer",marginBottom:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"1.3rem"}}>{"📷"}</span><span>Choose Photos</span>
            </button>
            {photos.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
                {photos.map((p,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:"10px",overflow:"hidden",border:`1.5px solid ${pal.stone}35`}}>
                    <img src={p.dataUrl} alt="" style={{width:"100%",height:"80px",objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>setPhotos(ps=>ps.filter((_,pi)=>pi!==i))}
                      style={{position:"absolute",top:"3px",right:"3px",width:"20px",height:"20px",borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",color:"#fff",fontSize:"0.65rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {"✕"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length===0&&(
              <div style={{textAlign:"center",padding:"0.5rem",fontSize:"0.73rem",color:pal.stone,fontStyle:"italic"}}>No photos yet — totally optional!</div>
            )}
          </>)}

          {/* Step 3: Done */}
          {step===3&&(
            <div style={{textAlign:"center",padding:"1rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>{"🏫"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"1rem",marginBottom:"0.35rem"}}>Co-op logged!</div>
              <div style={{fontSize:"0.8rem",color:pal.slate,lineHeight:1.7,marginBottom:"0.5rem"}}>
                {subjList.join(", ")} {"\u00b7"} {hrs}h
              </div>
              <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.65rem 0.85rem",border:`1.5px solid ${pal.good}30`,fontSize:"0.76rem",color:pal.good,fontWeight:"600"}}>
                {"✓ Saved to co-op log and portfolio for "+family.children.map(c=>c.name).join(" & ")}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"0.85rem 1.2rem",borderTop:`1px solid ${pal.stone}30`,flexShrink:0,display:"flex",gap:"0.5rem"}}>
          {step<3?(
            <>
              {step>0?(
                <button onClick={()=>setStep(s=>s-1)}
                  style={{padding:"0.65rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>
                  Back
                </button>
              ):(
                <button onClick={onClose}
                  style={{padding:"0.65rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>
                  Cancel
                </button>
              )}
              <button
                onClick={()=>{ if(step===2){handleSave();} else setStep(s=>s+1); }}
                disabled={step===0&&!canNext0}
                style={{flex:1,padding:"0.65rem",border:"none",borderRadius:"11px",background:step===0&&!canNext0?"#ccc":pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.86rem",cursor:step===0&&!canNext0?"default":"pointer"}}>
                {step===2?"Save to Portfolio ✓":"Next →"}
              </button>
            </>
          ):(
            <button onClick={onClose}
              style={{flex:1,padding:"0.65rem",border:"none",borderRadius:"11px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.86rem",cursor:"pointer"}}>
              {"Done 🌱"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================
   ONBOARDING FLOW - 6 Steps
======================================= */

function SettingsScreen({ pal, family, setFamily, paletteId, setPaletteId, customA, customB, setCustomA, setCustomB, navIds, setNavIds, onBack, onCelebReset }) {
  const [tab,         setTab]        = useState("family");
  const [local,       setLocal]      = useState(family ? {...family} : {});
  const [showAddSubj, setShowAddSubj]= useState(false);
  const [custSubjVal, setCustSubjVal]= useState("");
  const [celebReset,  setCelebReset] = useState(false);
  const [showApiKey,  setShowApiKey] = useState(false);
  const updL = (k,v) => setLocal(l=>({...l,[k]:v}));
  const updChild = (id,k,v) => setLocal(l=>({...l,children:l.children.map(c=>c.id===id?{...c,[k]:v}:c)}));
  const addChild = () => setLocal(l=>({...l,children:[...l.children,{id:uid(),name:"",grade:"1st",avatar:"🌻"}]}));
  const remChild = id => setLocal(l=>({...l,children:l.children.filter(c=>c.id!==id)}));

  const addCustomSubj = () => {
    const val = custSubjVal.trim();
    if(!val) return;
    const id = "custom_"+val.toLowerCase().replace(/\s+/g,"_");
    const existing = local.customSubjects||[];
    if(existing.find(x=>x.id===id)) return;
    updL("customSubjects",[...existing,{id,label:val,icon:"📋"}]);
    updL("subjects",[...(local.subjects||[]),id]);
    setCustSubjVal("");
    setShowAddSubj(false);
  };
  const removeCustomSubj = (id) => {
    updL("customSubjects",(local.customSubjects||[]).filter(s=>s.id!==id));
    updL("subjects",(local.subjects||[]).filter(x=>x!==id));
  };

  const save = () => {
    setFamily(local);
    if(local.apiKey) {
      try { localStorage.setItem("rootbloom_apikey", local.apiKey); } catch(e){}
    }
    if(local.aiMonthlyLimit) {
      try { localStorage.setItem("rootbloom_ailimit", local.aiMonthlyLimit==="Unlimited"?"9999":local.aiMonthlyLimit); } catch(e){}
    }
    onBack();
  };

  const STABS = [["family","👨👩👧👦 Family"],["children","🌱 Children"],["school","🏫 School"],["theme","🎨 Theme"],["nav","Nav"],["ai","🤖 AI"],["notifs","🔔 Alerts"]];
  const [schoolSubTab, setSchoolSubTab] = useState("school");

  return (
    <div style={{height:"100vh",background:pal.sand,display:"flex",flexDirection:"column",animation:"fadeIn 0.18s ease",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"1rem 1.1rem 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.9rem"}}>
          <button onClick={onBack} style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>Back</button>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"1.1rem"}}> Settings</span>
        </div>
        {/* Setting tabs */}
        <div style={{display:"flex",gap:"2px",overflowX:"auto",paddingBottom:"0"}}>
          {STABS.map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"0.45rem 0.75rem",border:"none",borderRadius:"10px 10px 0 0",background:tab===id?"rgba(255,255,255,0.15)":"transparent",color:tab===id?"#fff":"rgba(255,255,255,0.45)",fontSize:"0.7rem",fontWeight:tab===id?"700":"400",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} style={{flex:1,overflowY:"auto",padding:"1.2rem 1.1rem",minHeight:0,WebkitOverflowScrolling:"touch"}}>
        {tab==="family" && (
          <div style={{animation:"fadeUp 0.18s ease",paddingBottom:"1rem"}}>
            <SCard pal={pal} title="Family Info">
              <Lbl pal={pal}>Parent name</Lbl>
              <Input pal={pal} value={local.parentName||""} onChange={v=>updL("parentName",v)} placeholder="Your name" />
              <div style={{height:"0.75rem"}}/>
              <Lbl pal={pal}>Family name</Lbl>
              <Input pal={pal} value={local.familyName||""} onChange={v=>updL("familyName",v)} placeholder="e.g. The Johnson Family" />
              <div style={{height:"0.75rem"}}/>
              <Lbl pal={pal}>State</Lbl>
              <Select pal={pal} value={local.state||"Tennessee"} onChange={v=>updL("state",v)} options={US_STATES} />
            </SCard>
            <SCard pal={pal} title="⭐ Student Level System">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.82rem",fontWeight:"700",color:pal.ink}}>{"Show level badge in Student Portal"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"2px",lineHeight:1.5}}>{"Kids earn XP by logging lessons and milestones. Turn off if you prefer not to use a level system."}</div>
                </div>
                <button onClick={()=>updL("useStarsSystem",(local.useStarsSystem!==false)?false:true)}
                  style={{width:"44px",height:"24px",borderRadius:"99px",border:"none",background:(local.useStarsSystem!==false)?pal.primary:pal.stone+"50",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,marginLeft:"0.75rem"}}>
                  <div style={{position:"absolute",top:"3px",left:(local.useStarsSystem!==false)?"22px":"3px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
                </button>
              </div>
            </SCard>
            {local.yearStart&&local.yearEnd&&(()=>{
              const now=new Date(); const end=new Date(local.yearEnd); const start=new Date(local.yearStart);
              const daysLeft=Math.max(0,Math.ceil((end-now)/(24*60*60*1000)));
              const pct=Math.min(100,Math.round(((now-start)/(end-start))*100));
              const isOver=now>end;
              return (
                <div style={{background:isOver?"#fff8e6":pal.goodBg,borderRadius:"13px",padding:"0.75rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${isOver?"#f5c842":pal.good}40`}}>
                  <div style={{fontWeight:"700",color:isOver?"#7a5500":pal.good,fontSize:"0.8rem",marginBottom:"4px"}}>
                    {isOver?"🔔 School year ended — ready to start a new one?":"📅 School year in progress"}
                  </div>
                  {!isOver&&<>
                    <div style={{height:"5px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"4px"}}>
                      <div style={{height:"100%",width:pct+"%",borderRadius:"99px",background:`linear-gradient(90deg,${pal.good},${pal.mid})`}}/>
                    </div>
                    <div style={{fontSize:"0.68rem",color:pal.slate}}>{daysLeft+" days remaining · "+pct+"% of year complete"}</div>
                  </>}
                  {isOver&&<div style={{fontSize:"0.68rem",color:"#7a5500",marginTop:"2px"}}>{"Update the dates below to start your new year."}</div>}
                </div>
              );
            })()}
            <SCard pal={pal} title="School Year">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"0.65rem"}}>
                <div><Lbl pal={pal}>Start date</Lbl><Input pal={pal} type="date" value={local.yearStart||""} onChange={v=>updL("yearStart",v)} /></div>
                <div><Lbl pal={pal}>Goal end date</Lbl><Input pal={pal} type="date" value={local.yearEnd||""} onChange={v=>updL("yearEnd",v)} /></div>
              </div>
              <Lbl pal={pal}>Daily hours goal</Lbl>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {["No hour tracking","2 hours/day","3 hours/day","4 hours/day","5 hours/day","6 hours/day"].map(h=>(
                  <button key={h} onClick={()=>updL("dailyHoursGoal",h)} style={{padding:"0.28rem 0.6rem",borderRadius:"20px",border:`2px solid ${(local.dailyHoursGoal||"No hour tracking")===h?pal.primary:pal.stone+"50"}`,background:(local.dailyHoursGoal||"No hour tracking")===h?pal.pale:"transparent",cursor:"pointer",fontSize:"0.72rem",fontWeight:(local.dailyHoursGoal||"No hour tracking")===h?"700":"400",color:(local.dailyHoursGoal||"No hour tracking")===h?pal.primary:pal.inkM}}>
                    {h}
                  </button>
                ))}
              </div>
            </SCard>
          </div>
        )}

        {tab==="children" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            {(local.children||[]).map((c,i)=>(
              <SCard key={c.id} pal={pal} title={"Child " + (i+1)} action={local.children.length>1?{label:"Remove",fn:()=>remChild(c.id)}:null}>
                <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
                  {AVATARS.map(av=>(
                    <button key={av} onClick={()=>updChild(c.id,"avatar",av)} style={{width:"33px",height:"33px",borderRadius:"8px",border:`2px solid ${c.avatar===av?pal.primary:pal.stone+"50"}`,background:c.avatar===av?pal.pale:"transparent",cursor:"pointer",fontSize:"1.15rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{av}</button>
                  ))}
                </div>
                <Lbl pal={pal}>Color theme</Lbl>
                <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
                  {CHILD_COLOR_PALETTES.map(cp=>{
                    const sel=(c.colorId||"sunshine")===cp.id;
                    return (
                      <button key={cp.id} onClick={()=>updChild(c.id,"colorId",cp.id)}
                        style={{padding:"0.28rem 0.55rem",borderRadius:"20px",border:`2px solid ${sel?"#333":"transparent"}`,background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,cursor:"pointer",boxShadow:sel?"0 0 0 2px #fff,0 0 0 4px #333":"none"}}>
                        <span style={{fontSize:"0.68rem",fontWeight:"800",color:"#fff",textShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>{cp.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.65rem"}}>
                  <div><Lbl pal={pal}>First Name</Lbl><Input pal={pal} value={c.name} onChange={v=>updChild(c.id,"name",v)} placeholder={"Child's first name"} /></div>
                  <div><Lbl pal={pal}>Last Name</Lbl><Input pal={pal} value={c.lastName||""} onChange={v=>updChild(c.id,"lastName",v)} placeholder={"Last name"} /></div>
                  <div><Lbl pal={pal}>Grade</Lbl><Select pal={pal} value={c.grade} onChange={v=>updChild(c.id,"grade",v)} options={GRADES} /></div>
                </div>
                {/* Portfolio trust level */}
                <div style={{marginTop:"0.75rem",padding:"0.7rem 0.85rem",background:pal.pale,borderRadius:"12px",border:`1.5px solid ${pal.stone}30`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem"}}>📬 Portfolio submissions</div>
                      <div style={{fontSize:"0.69rem",color:pal.slate,marginTop:"2px",lineHeight:1.5}}>
                        {(c.trustLevel||"approve")==="approve"
                          ? c.name+"'s entries wait for your approval before saving"
                          : "Entries save automatically — you can review anytime"}
                      </div>
                    </div>
                    <button
                      onClick={()=>updChild(c.id,"trustLevel",(c.trustLevel||"approve")==="approve"?"auto":"approve")}
                      style={{flexShrink:0,width:"48px",height:"26px",borderRadius:"13px",border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",background:(c.trustLevel||"approve")==="approve"?pal.stone:pal.primary}}>
                      <div style={{position:"absolute",top:"3px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.22)",transition:"left 0.2s",left:(c.trustLevel||"approve")==="approve"?"3px":"25px"}}/>
                    </button>
                  </div>
                </div>
              </SCard>
            ))}
            <button onClick={addChild} style={{width:"100%",padding:"0.75rem",border:`2px dashed ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.slate,fontSize:"0.84rem",fontWeight:"600",cursor:"pointer",marginBottom:"0.75rem"}}>
              + Add child
            </button>
          </div>
        )}

        {tab==="school" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>

            {/* Sub-tab toggle */}
            <div style={{display:"flex",background:pal.parchm,borderRadius:"11px",padding:"3px",gap:"2px",marginBottom:"1rem",border:`1px solid ${pal.stone}30`}}>
              {[["school","🏫 School"],["schedule","📅 Schedule"]].map(([id,label])=>(
                <button key={id} onClick={()=>setSchoolSubTab(id)}
                  style={{flex:1,padding:"0.45rem 0.5rem",border:"none",borderRadius:"9px",background:schoolSubTab===id?pal.linen:"transparent",color:schoolSubTab===id?pal.primary:pal.slate,fontWeight:schoolSubTab===id?"800":"500",fontSize:"0.78rem",cursor:"pointer",transition:"all 0.12s"}}>
                  {label}
                </button>
              ))}
            </div>

            {schoolSubTab==="schedule"&&(
              <div>
            <SCard pal={pal} title="Schedule Type" note="How do your children's days work?">
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"0.75rem"}}>
                  {[
                    {id:"same",    icon:"👨‍👩‍👧‍👦", label:"Same schedule",      desc:"One shared plan for everyone"},
                    {id:"mixed",   icon:"🔀",        label:"Mostly together",   desc:"Shared subjects + individual ones per child"},
                    {id:"separate",icon:"📋",        label:"Separate schedules", desc:"Each child has their own daily plan"},
                  ].map(opt=>{
                    const sel=(local.scheduleMode2||"same")===opt.id;
                    return (
                      <button key={opt.id} onClick={()=>updL("scheduleMode2",opt.id)}
                        style={{display:"flex",gap:"0.65rem",alignItems:"flex-start",padding:"0.65rem 0.85rem",border:`2px solid ${sel?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                        <span style={{fontSize:"1.2rem",flexShrink:0,marginTop:"1px"}}>{opt.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{opt.label}</div>
                          <div style={{fontSize:"0.69rem",color:pal.slate,marginTop:"2px"}}>{opt.desc}</div>
                        </div>
                        <div style={{width:"16px",height:"16px",borderRadius:"50%",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}>
                          {sel&&<div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#fff"}}/>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Mixed: pick group subjects */}
                {(local.scheduleMode2||"same")==="mixed"&&(
                  <div style={{animation:"fadeUp 0.18s ease"}}>
                    <div style={{fontSize:"0.72rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.4rem"}}>Shared (group) subjects</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.28rem",marginBottom:"0.75rem"}}>
                      {[...SUBJECT_OPTIONS,...(local.customSubjects||[])].map(s=>{
                        const sel=(local.groupSubjects||[]).includes(s.id);
                        return (
                          <button key={s.id} onClick={()=>{
                            const cur=local.groupSubjects||[];
                            updL("groupSubjects",sel?cur.filter(x=>x!==s.id):[...cur,s.id]);
                          }} style={{display:"flex",gap:"0.55rem",alignItems:"center",padding:"0.45rem 0.7rem",border:`2px solid ${sel?pal.accent:pal.stone+"40"}`,borderRadius:"9px",background:sel?pal.paleMid:"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                            <span style={{fontSize:"0.95rem",width:"22px",textAlign:"center"}}>{s.icon||"📋"}</span>
                            <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.accentD:pal.inkM,fontSize:"0.81rem"}}>{s.label}</span>
                            <div style={{width:"15px",height:"15px",borderRadius:"3px",border:`2px solid ${sel?pal.accent:pal.stone}`,background:sel?pal.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {sel&&<span style={{color:"#fff",fontSize:"0.6rem",fontWeight:"900"}}>{"✓"}</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Separate / mixed: per-child subject config */}
                {((local.scheduleMode2||"same")==="separate"||(local.scheduleMode2||"same")==="mixed")&&(
                  <div style={{animation:"fadeUp 0.18s ease"}}>
                    <div style={{fontSize:"0.72rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.5rem"}}>
                      {(local.scheduleMode2||"same")==="mixed"?"Individual subjects per child":"Subjects per child"}
                    </div>
                    {(local.children||[]).map((c,ci)=>{
                      const cp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                      const cfg=c.scheduleConfig||{};
                      const childSubjs=cfg.subjects||[];
                      const alreadyGroup=(local.scheduleMode2||"same")==="mixed"?(local.groupSubjects||[]):[];
                      const available=[...SUBJECT_OPTIONS,...(local.customSubjects||[])].filter(s=>!alreadyGroup.includes(s.id));
                      return (
                        <div key={c.id} style={{marginBottom:"0.75rem",padding:"0.7rem 0.85rem",background:pal.parchm,borderRadius:"12px",border:`1.5px solid ${cp.c1}30`}}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                            <div style={{width:"28px",height:"28px",borderRadius:"7px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem"}}>{c.avatar}</div>
                            <span style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem"}}>{c.name}</span>
                            <span style={{fontSize:"0.65rem",color:pal.slate,marginLeft:"auto"}}>{childSubjs.length} subjects</span>
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                            {available.map(s=>{
                              const sel=childSubjs.includes(s.id);
                              return (
                                <button key={s.id} onClick={()=>{
                                  const cur=cfg.subjects||[];
                                  const updated=(local.children||[]).map(ch=>
                                    ch.id===c.id?{...ch,scheduleConfig:{...(ch.scheduleConfig||{}),subjects:sel?cur.filter(x=>x!==s.id):[...cur,s.id]}}:ch
                                  );
                                  updL("children",updated);
                                }} style={{padding:"0.22rem 0.55rem",border:`1.5px solid ${sel?cp.c1:pal.stone+"50"}`,borderRadius:"20px",background:sel?cp.c1+"18":"transparent",cursor:"pointer",fontSize:"0.71rem",fontWeight:sel?"700":"400",color:sel?cp.c1:pal.inkM,transition:"all 0.12s"}}>
                                  {s.icon} {s.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(local.scheduleMode2||"same")!=="same"&&(
                  <div style={{fontSize:"0.69rem",color:pal.slate,lineHeight:1.5,marginTop:"0.25rem",fontStyle:"italic"}}>
                    {"Changes take effect immediately in your Schedule screen."}
                  </div>
                )}
              </SCard>

            <SCard pal={pal} title="Lesson Goals" note="Tap a number to cycle 0\u20131\u20132\u20133 per day">
              {(()=>{
                const customSjs = local.customSubjects||[];
                const sMap2 = Object.fromEntries([...SUBJECT_OPTIONS,...customSjs].map(s=>[s.id,s]));
                const activeSjs = (local.subjects||[]).map(id=>sMap2[id]).filter(Boolean);
                const coopDowL = {"Monday":0,"Tuesday":1,"Wednesday":2,"Thursday":3,"Friday":4}[local.coopDay]??-1;
                const DOW_NAMES2 = ["Mon","Tue","Wed","Thu","Fri"];
                if(activeSjs.length===0) return <div style={{fontSize:"0.78rem",color:pal.slate}}>Add subjects first.</div>;
                const cycleGoal = (subjId, dow) => {
                  const cur = ((local.lessonGoals||{})[subjId]||{})[dow]||0;
                  const next = cur>=3?0:cur+1;
                  updL("lessonGoals",{...(local.lessonGoals||{}),[subjId]:{...((local.lessonGoals||{})[subjId]||{}),[dow]:next}});
                };
                return (
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr repeat(5,32px)",gap:"0.25rem",marginBottom:"0.35rem",alignItems:"center"}}>
                      <div/>
                      {DOW_NAMES2.map((d,i)=>(
                        <div key={d} style={{textAlign:"center",fontSize:"0.58rem",fontWeight:"800",color:i===coopDowL?"#b07800":pal.slate,textTransform:"uppercase"}}>{d}</div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                      {activeSjs.map(s=>(
                        <div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr repeat(5,32px)",gap:"0.25rem",alignItems:"center",background:pal.parchm,borderRadius:"9px",padding:"0.42rem 0.5rem"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.3rem",minWidth:0}}>
                            <span style={{fontSize:"0.9rem",flexShrink:0}}>{s.icon}</span>
                            <span style={{fontSize:"0.72rem",fontWeight:"600",color:pal.inkM,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                          </div>
                          {[0,1,2,3,4].map(dow=>{
                            const isCoop=dow===coopDowL;
                            const val=isCoop?null:((local.lessonGoals||{})[s.id]?.[dow]||0);
                            return (
                              <div key={dow} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                                {isCoop?(
                                  <div style={{width:"28px",height:"28px",borderRadius:"7px",background:"#fff8e6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.5rem",color:"#b07800",fontWeight:"700",lineHeight:1.1,textAlign:"center"}}>{"co\u00b7op"}</div>
                                ):(
                                  <button onClick={()=>cycleGoal(s.id,dow)}
                                    style={{width:"28px",height:"28px",borderRadius:"7px",border:`2px solid ${val>0?pal.primary:pal.stone+"50"}`,background:val>0?pal.pale:"transparent",cursor:"pointer",fontWeight:"800",fontSize:"0.8rem",color:val>0?pal.primary:pal.stone,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                                    {val}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </SCard>

            <SCard pal={pal} title="Subjects" note="These drive your schedule and portfolio">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.5}}>
                Select all subjects your family covers. These appear in your daily schedule and portfolio tracking.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginBottom:"0.85rem"}}>
                {[...SUBJECT_OPTIONS,...(local.customSubjects||[])].map(s=>{
                  const sel=(local.subjects||[]).includes(s.id);
                  return (
                    <button key={s.id} onClick={()=>{
                      const cur=local.subjects||[];
                      updL("subjects",sel?cur.filter(x=>x!==s.id):[...cur,s.id]);
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.6rem 0.85rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <span style={{fontSize:"1.1rem",width:"24px",textAlign:"center",flexShrink:0}}>{s.icon||"📋"}</span>
                      <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.83rem"}}>{s.label}</span>
                      <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {sel&&<span style={{color:pal.onDark,fontSize:"0.72rem",fontWeight:"900"}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Add custom subject */}
              <div>
                {!showAddSubj ? (
                  <button onClick={()=>setShowAddSubj(true)}
                    style={{width:"100%",padding:"0.55rem",border:`2px dashed ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.78rem",fontWeight:"600",cursor:"pointer"}}>
                    + Add custom subject
                  </button>
                ) : (
                  <div style={{display:"flex",gap:"0.4rem"}}>
                    <input value={custSubjVal} onChange={e=>setCustSubjVal(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&addCustomSubj()}
                      placeholder="e.g. Home Economics"
                      autoFocus
                      style={{flex:1,padding:"0.5rem 0.75rem",border:`2px solid ${pal.primary}`,borderRadius:"10px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}/>
                    <button onClick={addCustomSubj}
                      style={{padding:"0.5rem 0.75rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>
                      Add
                    </button>
                    <button onClick={()=>{setShowAddSubj(false);setCustSubjVal("");}}
                      style={{padding:"0.5rem 0.6rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.78rem",cursor:"pointer"}}>
                      {"✕"}
                    </button>
                  </div>
                )}
                {(local.customSubjects||[]).length>0&&(
                  <div style={{marginTop:"0.5rem",display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                    {(local.customSubjects||[]).map(s=>(
                      <div key={s.id} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.5rem 0.2rem 0.65rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`}}>
                        <span style={{fontSize:"0.75rem",color:pal.primary,fontWeight:"700"}}>{s.label}</span>
                        <button onClick={()=>removeCustomSubj(s.id)}
                          style={{width:"16px",height:"16px",borderRadius:"50%",background:pal.primary+"30",border:"none",color:pal.primary,fontSize:"0.6rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",flexShrink:0}}>
                          {"✕"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SCard>

            <SCard pal={pal} title="Weekly Schedule" note="Which subjects on which days">
              <SettingsWeeklyEditor pal={pal} local={local} updL={updL}/>
            </SCard>

            <SCard pal={pal} title="Morning Time">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:local.morningGathering?"0.75rem":"0"}}>
                <div>
                  <div style={{fontSize:"0.82rem",fontWeight:"600",color:pal.inkM}}>Start with morning gathering</div>
                  <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>Adds a 30-min block at the top of your schedule</div>
                </div>
                <button onClick={()=>updL("morningGathering",!local.morningGathering)}
                  style={{width:"44px",height:"26px",borderRadius:"13px",border:"none",background:local.morningGathering?pal.primary:pal.stone+"60",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:"3px",left:local.morningGathering?"21px":"3px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </button>
              </div>
              {local.morningGathering&&(
                <div style={{animation:"fadeUp 0.18s ease"}}>
                  <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.55rem"}}>
                    {["Morning Time","Morning Basket","Circle Time","Morning Meeting","Devotions"].map(n=>(
                      <button key={n} onClick={()=>updL("morningGatheringName",n)}
                        style={{padding:"0.32rem 0.65rem",border:`1.5px solid ${(local.morningGatheringName||"Morning Time")===n?pal.primary:pal.stone+"50"}`,borderRadius:"20px",background:(local.morningGatheringName||"Morning Time")===n?pal.pale:"transparent",cursor:"pointer",fontSize:"0.73rem",fontWeight:(local.morningGatheringName||"Morning Time")===n?"700":"400",color:(local.morningGatheringName||"Morning Time")===n?pal.primary:pal.inkM,transition:"all 0.13s"}}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <Input pal={pal} value={local.morningGatheringName||""} onChange={v=>updL("morningGatheringName",v)} placeholder="Or type your own name..." />
                </div>
              )}
            </SCard>

              </div>
            )}

            {schoolSubTab==="school"&&(
              <div>
            <SCard pal={pal} title="School Name">
              <Input pal={pal} value={local.schoolName||""} onChange={v=>updL("schoolName",v)} placeholder="e.g. Thornwood Academy" />
            </SCard>

            <SCard pal={pal} title="Progress Report" note="Settings for the printable progress report">
              <Lbl pal={pal}>Grading mode</Lbl>
              <div style={{display:"flex",gap:"0.38rem",marginBottom:"0.75rem"}}>
                {[["narrative","Narrative only"],["letter","Letter grades"]].map(([id,label])=>{
                  const sel=(local.reportGradeMode||"narrative")===id;
                  return (
                    <button key={id} onClick={()=>updL("reportGradeMode",id)}
                      style={{flex:1,padding:"0.5rem 0.5rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"10px",background:sel?pal.pale:"transparent",color:sel?pal.primary:pal.inkM,fontWeight:sel?"700":"400",fontSize:"0.78rem",cursor:"pointer"}}>
                      {label}
                    </button>
                  );
                })}
              </div>
              <Lbl pal={pal}>Administrator name (optional)</Lbl>
              <Input pal={pal} value={local.reportAdminName||""} onChange={v=>updL("reportAdminName",v)} placeholder="For signature line on report" />
            </SCard>

            <SCard pal={pal} title="Learning Philosophy">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.5rem"}}>Select all that apply</div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.38rem"}}>
                {LEARNING_PHILOSOPHIES.map(s=>{
                  const selArr = Array.isArray(local.curriculumStyle) ? local.curriculumStyle : [local.curriculumStyle];
                  const isSel = selArr.includes(s.id);
                  return (
                    <button key={s.id} onClick={()=>{
                      const cur = Array.isArray(local.curriculumStyle) ? local.curriculumStyle : [local.curriculumStyle];
                      updL("curriculumStyle", isSel ? cur.filter(x=>x!==s.id) : [...cur, s.id]);
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.65rem 0.85rem",border:`2px solid ${isSel?pal.primary:pal.stone+"50"}`,borderRadius:"11px",background:isSel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <span style={{fontSize:"1.2rem"}}>{s.icon}</span>
                      <span style={{flex:1,fontWeight:isSel?"700":"400",color:isSel?pal.primary:pal.inkM,fontSize:"0.83rem"}}>{s.label}</span>
                      <div style={{width:"16px",height:"16px",borderRadius:"3px",border:`2px solid ${isSel?pal.primary:pal.stone}`,background:isSel?pal.primary:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {isSel&&<span style={{color:pal.onDark,fontSize:"0.7rem",fontWeight:"900"}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </SCard>

            <SCard pal={pal} title="Curriculum Programs">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem"}}>Select all that apply. Custom curricula can be added with a URL to pull an AI summary.</div>

              {/* Selected programs with descriptions */}
              <div style={{display:"flex",flexDirection:"column",gap:"0.42rem",marginBottom:"0.65rem"}}>
                {CURRICULUM_BRANDS.map(s=>{
                  const selArr = local.curriculumBrands||[];
                  const isSel  = selArr.includes(s.id);
                  return (
                    <button key={s.id} onClick={()=>{
                      const cur = local.curriculumBrands||[];
                      updL("curriculumBrands", isSel?cur.filter(x=>x!==s.id):[...cur,s.id]);
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"flex-start",padding:"0.65rem 0.85rem",border:`2px solid ${isSel?pal.accent:pal.stone+"40"}`,borderRadius:"11px",background:isSel?pal.paleMid:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <span style={{fontSize:"1.2rem",flexShrink:0,marginTop:"1px"}}>{s.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:isSel?"700":"500",color:isSel?pal.accentD:pal.inkM,fontSize:"0.83rem"}}>{s.label}</div>
                        {isSel&&<div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"2px",lineHeight:1.4}}>{s.desc}</div>}
                      </div>
                      <div style={{width:"16px",height:"16px",borderRadius:"3px",border:`2px solid ${isSel?pal.accent:pal.stone}`,background:isSel?pal.accent:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:"2px"}}>
                        {isSel&&<span style={{color:pal.onDark,fontSize:"0.7rem",fontWeight:"900"}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom curricula with AI summaries */}
              {(local.customCurriculums||[]).length>0&&(
                <div style={{display:"flex",flexDirection:"column",gap:"0.42rem",marginBottom:"0.65rem"}}>
                  {(local.customCurriculums||[]).map(c=>{
                    const isSel=(local.curriculumBrands||[]).includes(c.id);
                    return (
                      <div key={c.id} style={{padding:"0.65rem 0.85rem",borderRadius:"11px",background:isSel?pal.paleMid:pal.parchm,border:`2px solid ${isSel?pal.accent:pal.stone+"40"}`}}>
                        <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                          <span style={{fontSize:"1.1rem",flexShrink:0}}>{"📘"}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{c.label}</div>
                            {c.url&&<div style={{fontSize:"0.64rem",color:pal.primary,marginTop:"1px"}}>{c.url}</div>}
                            {c.summary&&<div style={{fontSize:"0.71rem",color:pal.inkM,marginTop:"4px",lineHeight:1.55,background:"rgba(255,255,255,0.6)",borderRadius:"7px",padding:"0.35rem 0.5rem"}}>{c.summary}</div>}
                          </div>
                          <button onClick={()=>{
                            updL("customCurriculums",(local.customCurriculums||[]).filter(x=>x.id!==c.id));
                            updL("curriculumBrands",(local.curriculumBrands||[]).filter(x=>x!==c.id));
                          }} style={{width:"20px",height:"20px",borderRadius:"50%",border:`1px solid ${pal.stone}`,background:"transparent",color:pal.slate,fontSize:"0.62rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"✕"}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add custom curriculum inline */}
              <CurriculumAddWidget pal={pal} local={local} updL={updL}/>
            </SCard>

            <SCard pal={pal} title="Goals" note="Optional — shapes nudges and AI suggestions">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.5}}>
                {"Select what matters most this year. These shape your daily nudges, AI lesson suggestions, and year-end narrative."}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.38rem",marginBottom:"0.65rem"}}>
                {[...GOALS,...(local.customGoals||[])].map(g=>{
                  const sel=(local.goals||[]).includes(g.id);
                  return (
                    <button key={g.id} onClick={()=>{
                      const cur=local.goals||[];
                      updL("goals",sel?cur.filter(x=>x!==g.id):[...cur,g.id]);
                    }} style={{display:"flex",alignItems:"center",gap:"0.45rem",padding:"0.5rem 0.65rem",border:`2px solid ${sel?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",transition:"all 0.13s",textAlign:"left"}}>
                      <span style={{fontSize:"1.1rem",flexShrink:0}}>{g.icon}</span>
                      <span style={{fontSize:"0.74rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,lineHeight:1.25}}>{g.label}</span>
                    </button>
                  );
                })}
              </div>
              {(local.goals||[]).length===0&&(
                <div style={{fontSize:"0.72rem",color:pal.stone,fontStyle:"italic",textAlign:"center",padding:"0.25rem 0"}}>
                  No goals selected — tap any to add them.
                </div>
              )}
            </SCard>

            <SCard pal={pal} title="Co-op Frequency">
              <div style={{display:"flex",flexDirection:"column",gap:"0.38rem"}}>
                {COOP_FREQ.map(c=>(
                  <button key={c} onClick={()=>updL("coopFreq",c)} style={{padding:"0.6rem 0.85rem",border:`2px solid ${local.coopFreq===c?pal.primary:pal.stone+"50"}`,borderRadius:"10px",background:local.coopFreq===c?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:local.coopFreq===c?"700":"400",color:local.coopFreq===c?pal.primary:pal.inkM,fontSize:"0.83rem",transition:"all 0.13s"}}>
                    {c}
                  </button>
                ))}
              </div>
            </SCard>

              </div>
            )}
          </div>
        )}
        {tab==="theme" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            <SCard pal={pal} title="Color Theme">
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.42rem",marginBottom:"0.85rem"}}>
                {PRESET_PALETTES.map(p=>{
                  const sel=paletteId===p.id;
                  return (
                    <button key={p.id} onClick={()=>setPaletteId(p.id)} style={{padding:"0.55rem 0.4rem",borderRadius:"12px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.14s"}}>
                      {p.isCustom
                        ? <div style={{height:"20px",borderRadius:"5px",background:`linear-gradient(90deg,${customA},${customB})`,marginBottom:"0.25rem"}}/>
                        : <div style={{height:"20px",borderRadius:"5px",background:`linear-gradient(90deg,${p.a},${lerpHex(p.a,p.b,0.5)},${p.b})`,marginBottom:"0.25rem"}}/>
                      }
                      <div style={{fontSize:"0.63rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM}}>{p.emoji} {p.name}</div>
                    </button>
                  );
                })}
              </div>
              {paletteId==="custom" && (
                <div style={{background:pal.pale,borderRadius:"12px",padding:"0.85rem",border:`2px solid ${pal.accent}20`}}>
                  <Lbl pal={pal}>Your 2 colors</Lbl>
                  <div style={{display:"flex",gap:"0.85rem",alignItems:"center"}}>
                    {[["Deep",customA,setCustomA],["Bloom",customB,setCustomB]].map(([l,v,set])=>(
                      <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem"}}>
                        <input type="color" value={v} onChange={e=>set(e.target.value)} style={{width:"52px",height:"52px",borderRadius:"11px",border:`2px solid ${pal.stone}`,cursor:"pointer",padding:"2px"}}/>
                        <div style={{fontSize:"0.65rem",color:pal.slate,fontWeight:"600"}}>{l}</div>
                      </div>
                    ))}
                    <div style={{flex:1,height:"36px",borderRadius:"9px",background:`linear-gradient(90deg,${customA},${lerpHex(customA,customB,0.5)},${customB})`}}/>
                  </div>
                </div>
              )}
            </SCard>
          </div>
        )}

        {tab==="nav" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            <SCard pal={pal} title="Daily Schedule Checklist" note="Show a checklist tab to tick off subjects as you go">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.15rem 0"}}>
                <div>
                  <div style={{fontSize:"0.83rem",fontWeight:"700",color:pal.ink}}>{"Schedule tab in nav"}</div>
                  <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{"Great for families who prefer checking off subjects one by one"}</div>
                </div>
                <button onClick={()=>{
                  const has=navIds.includes("schedule");
                  if(has){setNavIds(n=>n.filter(x=>x!=="schedule"));}
                  else{setNavIds(n=>{const i=n.indexOf("home");return [...n.slice(0,i+1),"schedule",...n.slice(i+1)];});}
                }} style={{width:"46px",height:"26px",borderRadius:"99px",border:"none",background:navIds.includes("schedule")?pal.primary:pal.stone+"60",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:"3px",left:navIds.includes("schedule")?"23px":"3px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.25)"}}/>
                </button>
              </div>
            </SCard>
            <SCard pal={pal} title="Nav Tabs" note={"Customize your nav tabs"}>
              <div style={{display:"flex",flexDirection:"column",gap:"0.42rem"}}>
                {ALL_SECTIONS_EXT.filter(s=>s.id!=="more").map(s=>{
                  const on=navIds.includes(s.id);
                  const atMax=navIds.length>=6&&!on;
                  return (
                    <button key={s.id} onClick={()=>{
                      if(s.locked)return;
                      if(on){if(navIds.length<=2)return;setNavIds(n=>n.filter(x=>x!==s.id));}
                      else{if(atMax)return;setNavIds(n=>[...n,s.id]);}
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.7rem 0.9rem",border:`2px solid ${on?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:on?pal.pale:"transparent",cursor:s.locked||atMax?"default":"pointer",opacity:atMax&&!on?0.35:1,transition:"all 0.13s",textAlign:"left"}}>
                      <span style={{fontSize:"1.2rem",width:"28px",textAlign:"center"}}>{s.icon}</span>
                      <span style={{flex:1,fontWeight:on?"700":"400",color:on?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
                      {s.locked
                        ? <span style={{fontSize:"0.7rem",color:pal.slate}}>🔒</span>
                        : <div style={{width:"19px",height:"19px",borderRadius:"5px",border:`2px solid ${on?pal.primary:pal.stone}`,background:on?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<span style={{color:pal.onDark,fontSize:"0.8rem",fontWeight:"900"}}>✓</span>}</div>
                      }
                    </button>
                  );
                })}
              </div>
            </SCard>
          </div>
        )}

        {tab==="ai" && (
          <div style={{animation:"fadeUp 0.18s ease",paddingBottom:"4rem"}}>
            {/* Key status banner */}
            <div style={{background:(local.apiKey||"").trim()?"#edf9f0":"#fff8e6",borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${(local.apiKey||"").trim()?"#2d9e5f40":"#f5c84240"}`,display:"flex",alignItems:"center",gap:"0.65rem"}}>
              <span style={{fontSize:"1.4rem",flexShrink:0}}>{(local.apiKey||"").trim()?"✅":"🔑"}</span>
              <div>
                <div style={{fontWeight:"800",color:(local.apiKey||"").trim()?"#1a6e40":"#b07800",fontSize:"0.86rem"}}>
                  {(local.apiKey||"").trim()?"AI features are active":"AI features need a key to work"}
                </div>
                <div style={{fontSize:"0.7rem",color:(local.apiKey||"").trim()?"#2d9e5f":"#a06000",marginTop:"2px",lineHeight:1.5}}>
                  {(local.apiKey||"").trim()?"Worksheets, lessons, Bloom tutor, chat assistant — all ready.":"Follow the steps below to get set up in about 2 minutes."}
                </div>
              </div>
            </div>

            {/* Setup link -- only when no key */}
            {!(local.apiKey||"").trim()&&(
              <div style={{background:"#fff8e6",borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:"1.5px solid #f5c84240"}}>
                <div style={{fontWeight:"700",color:"#b07800",fontSize:"0.82rem",marginBottom:"0.35rem"}}>{"📋 How to get your API key"}</div>
                <div style={{fontSize:"0.72rem",color:"#7a5500",lineHeight:1.6,marginBottom:"0.65rem"}}>
                  {"1. Go to console.anthropic.com and create a free account."}<br/>
                  {"2. Add $5 credit (lasts months for a typical family)."}<br/>
                  {"3. Go to API Keys → Create Key → copy it → paste below."}
                </div>
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-block",padding:"0.45rem 1rem",borderRadius:"9px",background:"#b07800",color:"#fff",fontWeight:"700",fontSize:"0.78rem",textDecoration:"none"}}>
                  {"Open console.anthropic.com ↗"}
                </a>
              </div>
            )}

            {/* API Key input */}
            <SCard pal={pal} title="API Key">
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6,marginBottom:"0.75rem"}}>
                {"Your key is stored only on this device and never sent anywhere except directly to Anthropic when you use AI features."}
              </div>
              <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.75rem",width:"100%",boxSizing:"border-box"}}>
                <input
                  type={showApiKey?"text":"password"}
                  value={local.apiKey||""}
                  onChange={e=>updL("apiKey",e.target.value)}
                  placeholder="sk-ant-..."
                  autoComplete="off"
                  style={{flex:1,minWidth:0,padding:"0.62rem 0.85rem",border:`2px solid ${(local.apiKey||"").trim()?pal.good:pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=pal.primary}
                  onBlur={e=>e.target.style.borderColor=(local.apiKey||"").trim()?pal.good:pal.stone}
                />
                <button onClick={()=>setShowApiKey(v=>!v)}
                  style={{flexShrink:0,width:"36px",height:"36px",background:pal.parchm,border:`1.5px solid ${pal.stone}`,borderRadius:"9px",cursor:"pointer",fontSize:"0.8rem",color:pal.slate,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {showApiKey?"🙈":"👁"}
                </button>
              </div>
              {(local.apiKey||"").trim()&&(
                <div style={{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.72rem",color:pal.good,marginBottom:"0.75rem",fontWeight:"700"}}>
                  <span>{"✓"}</span><span>{"Key entered — tap Save to activate"}</span>
                </div>
              )}
              <Lbl pal={pal}>Monthly AI call limit</Lbl>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.5rem",lineHeight:1.5}}>{"Safeguard against unexpected usage. 50 calls covers a typical active week. Set to Unlimited if you trust yourself!"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.85rem"}}>
                {["10","25","50","100","200","Unlimited"].map(v=>(
                  <button key={v} onClick={()=>updL("aiMonthlyLimit",v)}
                    style={{padding:"0.3rem 0.7rem",borderRadius:"20px",border:`2px solid ${(local.aiMonthlyLimit||"50")===v?pal.primary:pal.stone+"50"}`,background:(local.aiMonthlyLimit||"50")===v?pal.pale:"transparent",cursor:"pointer",fontSize:"0.76rem",fontWeight:(local.aiMonthlyLimit||"50")===v?"700":"400",color:(local.aiMonthlyLimit||"50")===v?pal.primary:pal.inkM}}>
                    {v}
                  </button>
                ))}
              </div>
              <AIUsageDisplay pal={pal}/>

              {/* Cost explainer */}
              <div style={{background:pal.parchm,borderRadius:"11px",padding:"0.7rem 0.85rem",marginTop:"0.75rem",border:`1px solid ${pal.stone}30`}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.76rem",marginBottom:"0.35rem"}}>{"💰 How much does it cost?"}</div>
                <div style={{fontSize:"0.71rem",color:pal.slate,lineHeight:1.7}}>
                  {"A typical active family uses roughly $0.50–$2 per month. Generating a worksheet costs about $0.01. The Bloom tutor costs about $0.005 per question. You can monitor your usage at console.anthropic.com anytime."}
                </div>
              </div>
            </SCard>

            {/* Developer tools */}
            <SCard pal={pal} title="Developer Tools">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.55}}>{"Reset first-time tips and celebration animations in the Student Portal."}</div>
              {celebReset?(
                <div style={{fontSize:"0.78rem",color:pal.good,fontWeight:"700",padding:"0.45rem 0"}}>{"✓ Reset! Open Student Portal to see them again."}</div>
              ):(
                <button onClick={()=>{
                  const keys=Object.keys(localStorage).filter(k=>k.startsWith("portalCeleb_")||k==="rootbloom_tips_seen");
                  keys.forEach(k=>localStorage.removeItem(k));
                  setCelebReset(true);
                }} style={{padding:"0.45rem 1rem",border:`1.5px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.76rem",fontWeight:"600",cursor:"pointer"}}>
                  {"🎉 Reset celebrations"}
                </button>
              )}
            </SCard>

          </div>
        )}

        {tab==="notifs" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            <SCard pal={pal} title="In-App Alerts">
              <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.65,marginBottom:"1rem"}}>
                {"These banners appear on your Home screen when something needs attention. You can dismiss each one for the day, or turn them off here permanently."}
              </div>
              {[
                {key:"nolog",    icon:"📅", label:"No-log reminder",       desc:"Shows when it's been 2+ days since your last log"},
                {key:"attendance",icon:"⚠️", label:"Attendance behind",    desc:"Shows when you're 15%+ behind expected pace"},
                {key:"yearend",  icon:"🎓", label:"Year-end approaching", desc:"Shows within 4 weeks of your school year end"},
                {key:"studentNote",icon:"💌", label:"Student note received", desc:"Pink banner when your child sends you a message from their portal"},
              ].map(({key,icon,label,desc})=>{
                const enabled = (local.notifPrefs||{})[key]!==false;
                return (
                  <div key={key} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.7rem 0",borderBottom:"1px solid "+pal.stone+"25"}}>
                    <span style={{fontSize:"1.2rem",flexShrink:0}}>{icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem"}}>{label}</div>
                      <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{desc}</div>
                    </div>
                    <button onClick={()=>updL("notifPrefs",{...(local.notifPrefs||{}),[key]:!enabled})}
                      style={{width:"44px",height:"24px",borderRadius:"99px",border:"none",background:enabled?pal.primary:pal.stone+"50",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:"3px",left:enabled?"22px":"3px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.25)"}}/>
                    </button>
                  </div>
                );
              })}
            </SCard>
          </div>
        )}

      </div>

      {/* Save bar */}
      <div style={{padding:"0.9rem 1.1rem",borderTop:`1px solid ${pal.stone}50`,background:pal.linen,flexShrink:0,display:"flex",gap:"0.6rem"}}>
        <button onClick={onBack} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
        <button onClick={save} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Save Changes</button>
      </div>
    </div>
  );
}


/* --- TIME OPTIONS --- */
const TIME_OPTS = [];
for(let h=5;h<=22;h++){
  for(let m=0;m<60;m+=30){
    if(h===22&&m===30) break;
    const val = `${h}:${m===0?"00":"30"}`;
    const hh = h>12?h-12:h===0?12:h;
    const ampm = h>=12?"pm":"am";
    const label = `${hh}:${m===0?"00":"30"} ${ampm}`;
    TIME_OPTS.push({val,label});
  }
}

function EOYChecklistModal({pal,family,childIdx,setChildIdx,weeksLeft,portfolioEntries=[],attendanceDays=0,onClose,onGradeUp}){
  const [tab, setTab] = useState("checklist"); // checklist | reflect | promote
  const [eoyAI,     setEoyAI]     = useState(null);
  const [eoyAILoad, setEoyAILoad] = useState(false);
  const [eoyAIErr,  setEoyAIErr]  = useState(null);

  const ch = family.children[childIdx]||family.children[0];
  if(!ch) return null;

  const info = getComplianceInfo(family.state||"", ch.grade||"5th");
  const next = nextGrade(ch.grade);
  const cp   = CHILD_COLOR_PALETTES.find(p=>p.id===(ch.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const REQUIRED = parseInt((getStateInfo(family.state||"").hours||"180").match(/\d+/)?.[0]||"180");

  // ── Checklist tab state ──
  const CHECKLIST_ITEMS = [
    {id:"attendance",  icon:"📋", label:"Attendance Record",      detail:attendanceDays+" days logged ("+info.hours+" required)"},
    {id:"activitylog", icon:"📓", label:"Activity Log",           detail:"Daily/weekly log with reading titles listed"},
    {id:"worksamples", icon:"📚", label:"Work Samples",           detail:"Beginning, middle, end of year per subject"},
    {id:"subjects",    icon:"🔬", label:"All Subjects Covered",   detail:info.subjects.slice(0,4).join(", ")+(info.subjects.length>4?" + more":"")},
    {id:"narrative",   icon:"📝", label:"Parent Narrative",       detail:"Written description of the year's progress"},
    ...(info.needsTest?[{id:"testing",icon:"📊",label:"Standardized Test",detail:"Required this grade in "+family.state}]:[]),
    {id:"portfolio",   icon:"🗂", label:"Portfolio Organized",    detail:"Sections tabbed, entries dated, photos included"},
    {id:"save",        icon:"💾", label:"Portfolio Saved/Printed",detail:"PDF saved or printed for your records"},
  ];
  const [checked, setChecked] = useState({});
  const toggle = id => setChecked(c=>({...c,[id]:!c[id]}));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const allDone   = doneCount === CHECKLIST_ITEMS.length;

  // ── Reflection tab state ──
  const REFLECT_KEY = "rootbloom_eoy_reflect_"+(ch.id||"")+"_"+(family.yearEnd||"");
  const [reflectNote, setReflectNote] = useState(()=>{
    try{ return localStorage.getItem(REFLECT_KEY)||""; }catch(e){return "";}
  });
  const saveReflect = (v) => {
    setReflectNote(v);
    try{ localStorage.setItem(REFLECT_KEY, v); }catch(e){}
  };
  const SKILLS_KEY = "rootbloom_eoy_skills_"+(ch?.id||"")+"_"+(family.yearEnd||"");
  const [skillsChecked, setSkillsChecked] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem(SKILLS_KEY)||"{}"); }catch(e){return {};}
  });
  const toggleSkill = (cat,i) => {
    const key = cat+"_"+i;
    const next = {...skillsChecked, [key]:!skillsChecked[key]};
    setSkillsChecked(next);
    try{ localStorage.setItem(SKILLS_KEY, JSON.stringify(next)); }catch(e){}
  };

  // Portfolio entries for this child
  const childEntries = portfolioEntries.filter(e=>e.childIdx===childIdx);
  const subjEntries  = childEntries.filter(e=>!e.isDay&&e.subj!=="Daily Notes");

  // Subject counts
  const subjCounts = {};
  subjEntries.forEach(e=>{ subjCounts[e.subj]=(subjCounts[e.subj]||0)+1; });
  const subjList = Object.entries(subjCounts).sort((a,b)=>b[1]-a[1]);
  const maxCount = subjList[0]?.[1]||1;

  // Goals recap — map each goal to entry counts
  const allGoalObjs = [...GOALS,...(family.customGoals||[])];
  const generateEoyAI = async () => {
    setEoyAILoad(true); setEoyAIErr(null);
    const ci2 = family.children.indexOf(ch);
    const childEntries2 = portfolioEntries.filter(e=>e.childIdx===ci2);
    const subjEs = childEntries2.filter(e=>!e.isDay&&e.subj!=="Daily Notes");
    const bySubj = {};
    subjEs.forEach(e=>{ if(!bySubj[e.subj]) bySubj[e.subj]=[]; bySubj[e.subj].push(e); });
    const subjBreakdown = Object.keys(bySubj).map(s=>s+" ("+bySubj[s].length+")").join(", ");
    const readingTitles2 = [...new Set(subjEs.filter(e=>e.readingTitle).map(e=>e.readingTitle))];
    const notesSample = subjEs.filter(e=>(e.note||"").trim().length>20).slice(0,15).map(e=>e.subj+": "+((e.note||"").slice(0,100))).join(" | ");
    const yearStart2 = family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear();
    const yearEnd2   = family.yearEnd?new Date(family.yearEnd).getFullYear():yearStart2+1;
    const prompt = "Write a warm year-end summary for a homeschool portfolio.\n"
      +"Student: "+ch.name+", "+ch.grade+"\nSchool: "+(family.schoolName||family.familyName+" Academy")+"\n"
      +"Subjects: "+subjBreakdown+"\nDays: "+attendanceDays+"\nReading: "+(readingTitles2.slice(0,6).join(", ")||"not recorded")+"\n"
      +"Notes: "+notesSample+"\n\n"
      +"Respond ONLY in JSON (no markdown):\n"
      +'{"narrative":"2-3 warm sentences","accomplishments":["win 1","win 2","win 3"],"growthAreas":["area 1","area 2"],"readingHighlight":"one sentence","parentNote":"encouragement"}';
    try {
      const raw = await callClaude(prompt);
      setEoyAI(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) { setEoyAIErr("Could not generate — try again."); }
    setEoyAILoad(false);
  };

  const goalRecap = (family.goals||[]).map(id=>{
    const g = allGoalObjs.find(x=>x.id===id);
    const nudge = GOAL_NUDGES[id];
    if(!g) return null;
    const relSubjs = nudge?.subjs||[];
    const count = relSubjs.length>0
      ? subjEntries.filter(e=>relSubjs.includes(e.subj)).length
      : 0;
    return {id, g, nudge, count, hasSubjs: relSubjs.length>0};
  }).filter(Boolean);

  // Skills for this grade
  const gradeSkills = EOY_SKILLS[ch.grade]||EOY_SKILLS["5th"]||[];
  const totalSkills = gradeSkills.reduce((s,cat)=>s+cat.skills.length,0);
  const checkedSkills = Object.values(skillsChecked).filter(Boolean).length;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.75)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{background:pal.heroGrad,padding:"0.9rem 1.2rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"1rem"}}>{"🎓 End of Year"}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.75)"}}>
                {weeksLeft===0?"Year complete!":weeksLeft===1?"Last week!":weeksLeft+" weeks remaining"}
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:"9px",padding:"0.3rem 0.65rem",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>Close</button>
          </div>
          {family.children.length>1&&(
            <div style={{display:"flex",gap:"0.35rem",marginTop:"0.65rem",overflowX:"auto"}}>
              {family.children.map((c,i)=>(
                <button key={c.id} onClick={()=>setChildIdx(i)}
                  style={{padding:"0.25rem 0.65rem",borderRadius:"20px",border:`2px solid ${childIdx===i?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"}`,background:childIdx===i?"rgba(255,255,255,0.18)":"transparent",color:"#fff",fontSize:"0.72rem",fontWeight:childIdx===i?"700":"400",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                  {c.avatar} {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3-tab switcher */}
        <div style={{display:"flex",background:pal.parchm,margin:"0.75rem 1.2rem 0",borderRadius:"11px",padding:"3px",gap:"2px",flexShrink:0}}>
          {[["📋","Checklist","checklist"],["🌟","Year Review","reflect"],["🎓","Next Grade","promote"]].map(([icon,l,id])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{flex:1,padding:"0.42rem 0.3rem",border:"none",borderRadius:"9px",background:tab===id?pal.linen:"transparent",color:tab===id?pal.ink:pal.slate,fontSize:"0.65rem",fontWeight:tab===id?"700":"400",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}>
              <span style={{fontSize:"0.85rem"}}>{icon}</span>
              <span>{l}</span>
            </button>
          ))}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0.85rem 1.2rem"}}>

          {/* ====== CHECKLIST TAB ====== */}
          {tab==="checklist"&&(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.65rem"}}>
              <div style={{fontSize:"0.78rem",fontWeight:"700",color:pal.inkM}}>{ch.avatar} {ch.name} {"\u00b7"} {ch.grade}</div>
              <div style={{fontSize:"0.72rem",color:doneCount===CHECKLIST_ITEMS.length?pal.good:pal.slate,fontWeight:"700"}}>{doneCount}/{CHECKLIST_ITEMS.length} complete</div>
            </div>
            <div style={{height:"6px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"0.85rem"}}>
              <div style={{height:"100%",width:`${Math.round(doneCount/CHECKLIST_ITEMS.length*100)}%`,borderRadius:"99px",background:allDone?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.3s"}}/>
            </div>
            {info.deadline&&info.deadline!=="None"&&(
              <div style={{background:pal.pale,borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.74rem",color:pal.inkM}}>
                <span style={{fontWeight:"700",color:pal.primary}}>{family.state||"Your state"} deadline:</span> {info.deadline}
              </div>
            )}
            {CHECKLIST_ITEMS.map((item)=>(
              <div key={item.id} onClick={()=>toggle(item.id)}
                style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",padding:"0.65rem 0.75rem",background:checked[item.id]?pal.goodBg:pal.linen,borderRadius:"12px",marginBottom:"0.42rem",border:`1.5px solid ${checked[item.id]?pal.good+"40":pal.stone+"35"}`,cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"10px",background:checked[item.id]?pal.good:pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0,transition:"background 0.15s"}}>
                  {checked[item.id]?"✓":item.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"700",color:checked[item.id]?pal.good:pal.ink,fontSize:"0.84rem",textDecoration:checked[item.id]?"line-through":"none"}}>{item.label}</div>
                  <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px",lineHeight:1.5}}>{item.detail}</div>
                </div>
              </div>
            ))}
            {allDone&&(
              <div style={{background:pal.goodBg,borderRadius:"14px",padding:"1rem",marginTop:"0.5rem",textAlign:"center",border:`2px solid ${pal.good}40`}}>
                <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>{"🌟"}</div>
                <div style={{fontWeight:"900",color:pal.good,fontSize:"0.95rem",marginBottom:"0.2rem"}}>Portfolio Complete!</div>
                <div style={{fontSize:"0.76rem",color:pal.inkM,marginBottom:"0.65rem"}}>Switch to {"\""}Year Review{"\""}  to see how far you{"'"}ve come.</div>
                <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"center"}}>
                  <button onClick={()=>printEvaluatorLetter(family,ch,attendanceDays)}
                    style={{padding:"0.5rem 1rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:pal.onDark,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                    {"📜 Evaluator Letter"}
                  </button>
                  <button onClick={()=>{
                    const ci3=family.children.indexOf(ch);
                    const childEntries3=portfolioEntries.filter(e=>e.childIdx===ci3);
                    printFullPortfolio(family,childEntries3,ch,attendanceDays,null,eoyAI||null);
                  }}
                    style={{padding:"0.5rem 1rem",border:`2px solid ${pal.primary}`,borderRadius:"10px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                    {"📚 Full Portfolio"}
                  </button>
                </div>
              </div>
            )}
          </>)}

          {/* ====== YEAR REVIEW TAB ====== */}
          {tab==="reflect"&&(<>

            {/* ── Attendance summary ── */}
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"6px"}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem"}}>{"Attendance"}</div>
                <div style={{fontWeight:"900",color:cp.c1,fontSize:"1rem"}}>{Math.min(100,Math.round(attendanceDays/REQUIRED*100))}{"% done"}</div>
              </div>
              <div style={{height:"8px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"6px"}}>
                <div style={{height:"100%",width:`${Math.min(100,Math.round(attendanceDays/REQUIRED*100))}%`,borderRadius:"99px",background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,transition:"width 0.5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:pal.slate}}>
                <span><b style={{color:pal.ink}}>{attendanceDays}</b> days logged</span>
                <span><b style={{color:pal.ink}}>{Math.max(0,REQUIRED-attendanceDays)}</b> remaining</span>
                <span><b style={{color:pal.ink}}>{REQUIRED}</b> required</span>
              </div>
            </div>

            {/* ── Goals recap ── */}
            {goalRecap.length>0&&(
              <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem",marginBottom:"0.65rem"}}>Goals This Year</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
                  {goalRecap.map(({id,g,nudge,count,hasSubjs})=>{
                    const hit = hasSubjs ? count>0 : null;
                    return (
                      <div key={id} style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.45rem 0.65rem",background:hit===true?pal.goodBg:pal.parchm,borderRadius:"10px",border:`1.5px solid ${hit===true?pal.good+"40":pal.stone+"25"}`}}>
                        <span style={{fontSize:"1rem",flexShrink:0}}>{nudge?.icon||g.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>{g.label}</div>
                          {hasSubjs&&(
                            <div style={{fontSize:"0.66rem",color:hit?pal.good:pal.slate,marginTop:"1px"}}>
                              {count>0 ? count+" related entries logged " : "No related entries yet"}
                              {count>0&&<span style={{fontWeight:"900"}}>{"✓"}</span>}
                            </div>
                          )}
                        </div>
                        {!hasSubjs&&<span style={{fontSize:"0.68rem",color:pal.slate,fontStyle:"italic"}}>track manually</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Subject breakdown ── */}
            {subjList.length>0&&(
              <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem",marginBottom:"0.65rem"}}>
                  {"Subjects Logged — "+subjEntries.length+" total entries"}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                  {subjList.slice(0,8).map(([subj,cnt])=>(
                    <div key={subj} style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
                      <div style={{width:"88px",fontSize:"0.72rem",color:pal.inkM,fontWeight:"600",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subj}</div>
                      <div style={{flex:1,height:"8px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.round(cnt/maxCount*100)}%`,borderRadius:"99px",background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,transition:"width 0.4s"}}/>
                      </div>
                      <div style={{fontSize:"0.72rem",fontWeight:"800",color:cp.c1,minWidth:"22px",textAlign:"right",flexShrink:0}}>{cnt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Grade-level skills checklist ── */}
            {gradeSkills.length>0&&(
              <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.45rem"}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem"}}>{ch.grade} Skills Checklist</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate,fontWeight:"700"}}>{checkedSkills}/{totalSkills}</div>
                </div>
                <div style={{background:"#fffbeb",borderRadius:"9px",padding:"0.5rem 0.65rem",marginBottom:"0.65rem",border:"1px solid #f5c84240",fontSize:"0.67rem",color:"#7a5500",lineHeight:1.55}}>
                  {"\u26a0\ufe0f Guide only \u2014 this checklist reflects general grade-level benchmarks and is meant as a helpful reference, not a requirement. Every child learns differently and at their own pace. Use this to celebrate progress and spot areas to explore more, not to measure pass/fail."}
                </div>
                {gradeSkills.map((cat)=>(
                  <div key={cat.cat} style={{marginBottom:"0.75rem"}}>
                    <div style={{fontSize:"0.65rem",fontWeight:"800",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.35rem"}}>{cat.cat}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.28rem"}}>
                      {cat.skills.map((skill,si)=>{
                        const key = cat.cat+"_"+si;
                        const done = skillsChecked[key];
                        return (
                          <button key={si} onClick={()=>toggleSkill(cat.cat,si)}
                            style={{display:"flex",gap:"0.55rem",alignItems:"center",padding:"0.38rem 0.55rem",borderRadius:"9px",background:done?pal.goodBg:"#fff",border:`1px solid ${done?pal.good+"40":pal.stone+"25"}`,cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                            <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${done?pal.good:pal.stone}`,background:done?pal.good:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.12s"}}>
                              {done&&<span style={{color:"#fff",fontSize:"0.65rem",fontWeight:"900"}}>{"✓"}</span>}
                            </div>
                            <span style={{fontSize:"0.76rem",color:done?pal.good:pal.inkM,fontWeight:done?"600":"400",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Year reflection notes ── */}
            {/* AI Year Summary */}
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                <div>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem"}}>{"✨ AI Year Summary"}</div>
                  <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"2px"}}>{"Accomplishments, growth areas"}</div>
                </div>
                {!eoyAI&&!eoyAILoad&&(
                  <button onClick={generateEoyAI}
                    style={{padding:"0.35rem 0.85rem",border:"none",borderRadius:"9px",background:cp.c1,color:"#fff",fontWeight:"800",fontSize:"0.73rem",cursor:"pointer",flexShrink:0}}>
                    {"Generate"}
                  </button>
                )}
                {eoyAI&&<button onClick={()=>{setEoyAI(null);setEoyAIErr(null);}} style={{padding:"0.3rem 0.65rem",border:`1px solid ${pal.stone}`,borderRadius:"9px",background:"transparent",color:pal.slate,fontSize:"0.68rem",cursor:"pointer",flexShrink:0}}>{"Redo"}</button>}
              </div>
              {eoyAILoad&&<div style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.35rem 0"}}>{[0,1,2].map(i=><div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:cp.c1,animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}<span style={{fontSize:"0.74rem",color:pal.slate}}>{"Reviewing the year..."}</span></div>}
              {eoyAIErr&&<div style={{fontSize:"0.74rem",color:"#a03030"}}>{eoyAIErr}</div>}
              {eoyAI&&(
                <div style={{animation:"fadeUp 0.2s ease"}}>
                  <div style={{fontSize:"0.79rem",color:pal.ink,lineHeight:1.7,fontStyle:"italic",marginBottom:"0.6rem",paddingBottom:"0.6rem",borderBottom:`1px solid ${pal.stone}25`}}>{eoyAI.narrative}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem",marginBottom:"0.5rem"}}>
                    <div>
                      <div style={{fontSize:"0.63rem",fontWeight:"800",color:cp.c1,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.28rem"}}>{"Biggest Wins"}</div>
                      {(eoyAI.accomplishments||[]).map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.32rem",fontSize:"0.74rem",color:pal.inkM,marginBottom:"0.2rem",alignItems:"baseline"}}>
                          <span style={{color:cp.c1,fontWeight:"700",flexShrink:0}}>{"✓"}</span><span>{a}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{fontSize:"0.63rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.28rem"}}>{"Keep Building"}</div>
                      {(eoyAI.growthAreas||[]).map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.32rem",fontSize:"0.74rem",color:pal.inkM,marginBottom:"0.2rem",alignItems:"baseline"}}>
                          <span style={{color:"#b07800",flexShrink:0}}>{"→"}</span><span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {eoyAI.readingHighlight&&<div style={{fontSize:"0.71rem",color:pal.slate,fontStyle:"italic",borderTop:`1px solid ${pal.stone}20`,paddingTop:"0.4rem"}}>{"📖 "}{eoyAI.readingHighlight}</div>}
                </div>
              )}
              {!eoyAI&&!eoyAILoad&&<div style={{fontSize:"0.71rem",color:pal.stone,textAlign:"center",padding:"0.4rem 0",fontStyle:"italic"}}>{"Tap Generate for "+ch.name+"'s year summary"}</div>}
            </div>

            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.84rem",marginBottom:"0.3rem"}}>Year Reflection</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.5}}>
                What went well this year? What would you do differently? Notes for next year.
              </div>
              <textarea
                value={reflectNote}
                onChange={e=>saveReflect(e.target.value)}
                placeholder={"e.g. " + ch.name + " really thrived with hands-on science this year. Reading improved significantly by mid-year. Next year we want to add more writing practice and get outside more. Overall a great year!"}
                rows={5}
                style={{width:"100%",padding:"0.7rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",fontSize:"0.81rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.6}}
                onFocus={e=>e.target.style.borderColor=cp.c1}
                onBlur={e=>e.target.style.borderColor=pal.stone}/>
              {reflectNote.trim()&&(
                <div style={{fontSize:"0.66rem",color:pal.good,marginTop:"0.35rem",fontWeight:"600"}}>{"✓ Saved automatically"}</div>
              )}
            </div>

          </>)}

          {/* ====== NEXT GRADE TAB ====== */}
          {tab==="promote"&&(<>
            <div style={{textAlign:"center",marginBottom:"1rem"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.4rem",animation:"bounce 2s ease infinite"}}>{ch.avatar}</div>
              <div style={{fontWeight:"900",color:pal.ink,fontSize:"1.1rem",marginBottom:"0.15rem"}}>{ch.name}</div>
              <div style={{fontSize:"0.8rem",color:pal.slate,marginBottom:"0.75rem"}}>Currently in <b>{ch.grade}</b></div>
            </div>
            {next ? (<>
              <div style={{background:pal.pale,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",border:`2px solid ${pal.primary}25`,textAlign:"center"}}>
                <div style={{fontSize:"0.68rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>Ready to advance to</div>
                <div style={{fontWeight:"900",color:pal.primary,fontSize:"1.6rem",marginBottom:"0.25rem"}}>{next}</div>
                <div style={{fontSize:"0.74rem",color:pal.slate}}>
                  {gradeLevel(next)==="high"&&gradeLevel(ch.grade)!=="high"?"High school begins — transcript tracking starts now":
                   gradeLevel(next)==="middle"&&gradeLevel(ch.grade)==="elementary"?"Moving to middle school — subject requirements expand":
                   "New grade, new goals!"}
                </div>
              </div>
              {(()=>{
                const nextInfo = getComplianceInfo(family.state||"", next);
                return (
                  <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
                    <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",marginBottom:"0.5rem"}}>What changes in {next}</div>
                    {nextInfo.needsTest&&<div style={{background:"#fff8e8",borderRadius:"8px",padding:"0.4rem 0.6rem",marginBottom:"0.4rem",fontSize:"0.73rem",color:"#7a5500",fontWeight:"700",border:"1px solid #f5c842"}}>{"⚠️ Standardized test required in "+next+" ("+family.state+")"}</div>}
                    <div style={{fontSize:"0.74rem",color:pal.inkM,lineHeight:1.6}}>{nextInfo.gradeNote}</div>
                    {gradeLevel(next)==="high"&&<div style={{marginTop:"0.5rem",fontSize:"0.72rem",color:pal.primary,fontWeight:"700"}}>{"📜 Transcript tracking begins — grades and credits will be recorded from "+next+" onward."}</div>}
                  </div>
                );
              })()}
              <button onClick={()=>onGradeUp&&onGradeUp(childIdx,next)}
                style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"900",fontSize:"0.92rem",cursor:"pointer",boxShadow:`0 4px 18px ${pal.accent}40`,marginBottom:"0.6rem"}}>
                {"🎓 Advance "+ch.name+" to "+next}
              </button>
              <button onClick={onClose}
                style={{width:"100%",padding:"0.65rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.84rem",cursor:"pointer"}}>
                {"Not yet — keep in "+ch.grade}
              </button>
            </>) : (
              <div style={{textAlign:"center",padding:"1rem",background:pal.goodBg,borderRadius:"18px",border:`2px solid ${pal.good}30`}}>
                <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{"🎓"}</div>
                <div style={{fontWeight:"900",color:pal.good,fontSize:"1rem",marginBottom:"0.3rem"}}>Graduation!</div>
                <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.65}}>{ch.name} has completed 12th grade. Congratulations on completing your homeschool journey!</div>
              </div>
            )}
          </>)}

        </div>
      </div>
    </div>
  );
}

/* =======================================
   NEW YEAR MODAL
======================================= */

function ObservationJournalModal({pal, family, childId, entries, onAdd, onDelete, onClose}){
  const [activeChild, setActiveChild] = useState(childId);
  const child = family.children.find(c=>c.id===activeChild)||family.children[0];
  const ci    = family.children.findIndex(c=>c.id===activeChild);
  const cp    = CHILD_COLOR_PALETTES.find(p=>p.id===(child?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];

  const [text,      setText]     = useState("");
  const [tag,       setTag]      = useState(null); // selected tag key
  const [delConf,   setDelConf]  = useState(null);
  const [editId,    setEditId]   = useState(null);
  const [editText,  setEditText] = useState("");
  const [searchQ,   setSearchQ]  = useState("");
  const inputRef = useRef(null);

  const TAGS = [
    {key:"breakthrough", label:"Breakthrough", icon:"💡", color:"#2d9e5f", bg:"#e8f7ee"},
    {key:"struggle",     label:"Needs work",   icon:"💪", color:"#b07800", bg:"#fff8e6"},
    {key:"question",     label:"Great question",icon:"🔭", color:"#1a5a8a", bg:"#e8f0f8"},
    {key:"funny",        label:"Funny moment",  icon:"😄", color:"#9b6fc8", bg:"#f3eefb"},
    {key:"noticed",      label:"I noticed",     icon:"👀", color:"#666",    bg:"#f5f5f5"},
    {key:"followup",     label:"Follow up",     icon:"📌", color:"#cc4444", bg:"#ffeaea"},
  ];

  const childEntries = entries
    .filter(e=>e.childId===activeChild)
    .filter(e=>!searchQ.trim() || e.text.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a,b)=>b.ts-(a.ts||0));

  const handleAdd = () => {
    const t = text.trim();
    if(!t) return;
    const now = new Date();
    onAdd({
      id: uid(), childId: activeChild, text: t,
      tag: tag||null,
      ts: now.getTime(),
      date: now.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),
      time: now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),
    });
    setText(""); setTag(null);
    inputRef.current?.focus();
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = (entry) => {
    if(!editText.trim()) return;
    onAdd({...entry, text:editText.trim(), _edit:true});
    setEditId(null); setEditText("");
  };

  const PROMPTS = [
    "Had a breakthrough with...", "Struggled today with...",
    "Asked a great question about...", "Really excited about...",
    "I noticed...", "Something to follow up on...",
  ];

  const allEntries = entries.filter(e=>e.childId===activeChild);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,15,10,0.8)",backdropFilter:"blur(14px)",zIndex:250,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,padding:"0.75rem 1.2rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
              <span style={{fontSize:"1.3rem"}}>{child?.avatar||"🌱"}</span>
              <div>
                <div style={{fontWeight:"900",color:"#fff",fontSize:"0.92rem"}}>{child?.name}</div>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.72)"}}>{"📓 "+allEntries.length+" observation"+(allEntries.length!==1?"s":"")}</div>
              </div>
            </div>
            <button onClick={onClose}
              style={{width:"28px",height:"28px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {"\u2715"}
            </button>
          </div>
          {/* Child switcher */}
          {family.children.length>1&&(
            <div style={{display:"flex",gap:"0.4rem"}}>
              {family.children.map(c=>{
                const ccp = CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                const active = c.id===activeChild;
                const cnt = entries.filter(e=>e.childId===c.id).length;
                return (
                  <button key={c.id} onClick={()=>setActiveChild(c.id)}
                    style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.25rem 0.6rem",borderRadius:"20px",border:"2px solid "+(active?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.25)"),background:active?"rgba(255,255,255,0.25)":"transparent",cursor:"pointer"}}>
                    <span style={{fontSize:"0.9rem"}}>{c.avatar}</span>
                    <span style={{fontSize:"0.68rem",color:"#fff",fontWeight:active?"800":"500"}}>{c.name}</span>
                    {cnt>0&&<span style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.7)",fontWeight:"600"}}>{"("+cnt+")"}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick-add input */}
        <div style={{padding:"0.75rem 1.1rem 0.6rem",borderBottom:`1px solid ${pal.stone}30`,flexShrink:0}}>
          {/* Tag picker */}
          <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.45rem"}}>
            {TAGS.map(t=>(
              <button key={t.key} onClick={()=>setTag(tag===t.key?null:t.key)}
                style={{padding:"0.18rem 0.55rem",border:"1.5px solid "+(tag===t.key?t.color:pal.stone+"40"),borderRadius:"20px",background:tag===t.key?t.bg:"transparent",color:tag===t.key?t.color:pal.slate,fontSize:"0.65rem",fontWeight:tag===t.key?"700":"400",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.2rem"}}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-end"}}>
            <textarea ref={inputRef} value={text} onChange={e=>setText(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleAdd();} }}
              placeholder={"Quick note about "+child?.name+"... (Enter to save)"} rows={2}
              style={{flex:1,resize:"none",padding:"0.6rem 0.8rem",border:`2px solid ${cp.c1}50`,borderRadius:"12px",background:pal.parchm,fontSize:"0.83rem",fontFamily:"inherit",color:pal.ink,outline:"none",lineHeight:1.5}}
              autoFocus
            />
            <button onClick={handleAdd} disabled={!text.trim()}
              style={{width:"42px",height:"42px",borderRadius:"12px",border:"none",background:text.trim()?`linear-gradient(135deg,${cp.c1},${cp.c2})`:"#ccc",color:"#fff",cursor:text.trim()?"pointer":"default",fontSize:"1.1rem",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {"\u2713"}
            </button>
          </div>
          <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginTop:"0.4rem"}}>
            {PROMPTS.map(p=>(
              <button key={p} onClick={()=>{setText(p);setTimeout(()=>inputRef.current?.focus(),50);}}
                style={{padding:"0.15rem 0.55rem",border:`1px solid ${cp.c1}40`,borderRadius:"20px",background:"transparent",color:cp.c1,fontSize:"0.65rem",cursor:"pointer"}}>
                {p}
              </button>
            ))}
          </div>
          <div style={{fontSize:"0.6rem",color:pal.stone,marginTop:"0.35rem"}}>{"🔒 Private \u2014 never shown in portfolio or reports"}</div>
        </div>

        {/* Search */}
        {allEntries.length>5&&(
          <div style={{padding:"0.5rem 1.1rem",borderBottom:`1px solid ${pal.stone}20`,flexShrink:0,position:"relative"}}>
            <span style={{position:"absolute",left:"1.7rem",top:"50%",transform:"translateY(-50%)",fontSize:"0.8rem",pointerEvents:"none"}}>{"\ud83d\udd0d"}</span>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
              placeholder={"Search notes..."}
              style={{width:"100%",padding:"0.4rem 0.75rem 0.4rem 2rem",border:`1.5px solid ${pal.stone}40`,borderRadius:"20px",fontSize:"0.78rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
            />
            {searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:"1.4rem",top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.8rem"}}>{"\u2715"}</button>}
          </div>
        )}

        {/* Entries list */}
        <div style={{flex:1,overflowY:"auto",padding:"0.75rem 1.1rem"}}>
          {childEntries.length===0?(
            <div style={{textAlign:"center",padding:"2rem 1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{"📓"}</div>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.3rem"}}>{searchQ?"No matching notes":"No notes yet"}</div>
              <div style={{fontSize:"0.75rem",color:pal.slate,lineHeight:1.6}}>
                {searchQ?"Try a different search term":("Capture moments, breakthroughs, and observations about "+child?.name+". Just for you.")}
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
              {childEntries.map(entry=>{
                const entryTag = TAGS.find(t=>t.key===entry.tag);
                const isEditing = editId===entry.id;
                return (
                  <div key={entry.id} style={{background:"#fff",borderRadius:"14px",padding:"0.75rem 0.9rem",border:"1.5px solid "+(entryTag?entryTag.color+"30":pal.stone+"20"),position:"relative"}}>
                    {/* Tag strip */}
                    {entryTag&&(
                      <div style={{display:"inline-flex",alignItems:"center",gap:"0.25rem",padding:"0.1rem 0.5rem",borderRadius:"20px",background:entryTag.bg,border:"1px solid "+entryTag.color+"40",marginBottom:"0.4rem"}}>
                        <span style={{fontSize:"0.7rem"}}>{entryTag.icon}</span>
                        <span style={{fontSize:"0.62rem",fontWeight:"700",color:entryTag.color}}>{entryTag.label}</span>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"}}>
                      <span style={{fontSize:"0.63rem",color:pal.stone,fontWeight:"600"}}>{entry.date}{entry.time?" \u00b7 "+entry.time:""}</span>
                      <div style={{display:"flex",gap:"0.3rem"}}>
                        {delConf===entry.id?(
                          <>
                            <button onClick={()=>setDelConf(null)}
                              style={{padding:"0.12rem 0.5rem",border:`1px solid ${pal.stone}`,borderRadius:"8px",background:"transparent",color:pal.slate,fontSize:"0.65rem",cursor:"pointer"}}>Keep</button>
                            <button onClick={()=>{onDelete(entry.id);setDelConf(null);}}
                              style={{padding:"0.12rem 0.5rem",border:"none",borderRadius:"8px",background:"#e53e3e",color:"#fff",fontSize:"0.65rem",cursor:"pointer",fontWeight:"700"}}>Delete</button>
                          </>
                        ):(
                          <>
                            <button onClick={()=>handleEdit(entry)}
                              style={{width:"20px",height:"20px",borderRadius:"50%",border:`1px solid ${pal.stone}30`,background:"transparent",color:pal.stone,fontSize:"0.58rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u270e"}</button>
                            <button onClick={()=>setDelConf(entry.id)}
                              style={{width:"20px",height:"20px",borderRadius:"50%",border:`1px solid ${pal.stone}30`,background:"transparent",color:pal.stone,fontSize:"0.58rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing?(
                      <div>
                        <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={3} autoFocus
                          style={{width:"100%",padding:"0.5rem 0.65rem",border:`2px solid ${cp.c1}`,borderRadius:"10px",fontSize:"0.83rem",fontFamily:"inherit",color:pal.ink,resize:"none",outline:"none",lineHeight:1.5,background:pal.parchm}}
                        />
                        <div style={{display:"flex",gap:"0.4rem",marginTop:"0.4rem"}}>
                          <button onClick={()=>saveEdit(entry)}
                            style={{flex:1,padding:"0.4rem",border:"none",borderRadius:"9px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,color:"#fff",fontWeight:"700",fontSize:"0.76rem",cursor:"pointer"}}>Save</button>
                          <button onClick={()=>setEditId(null)}
                            style={{padding:"0.4rem 0.7rem",border:`1.5px solid ${pal.stone}`,borderRadius:"9px",background:"transparent",color:pal.slate,fontSize:"0.76rem",cursor:"pointer"}}>Cancel</button>
                        </div>
                      </div>
                    ):(
                      <div style={{fontSize:"0.83rem",color:pal.ink,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{entry.text}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{height:"0.5rem"}}/>
        </div>
      </div>
    </div>
  );
}

const DISMISS_KEY = "rootbloom_goals_nudge_dismiss";


function ScheduleScreen({pal,family,child,setChild,onMarkComplete,onProgressUpdate,onUpdateFamily,lastCheckinDate}){
  const today = new Date();
  const todayDow = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (todayDow===0?6:todayDow-1));
  const DAYS = ["Mon","Tue","Wed","Thu","Fri"].map((l,i)=>{
    const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
    return {l, d:d.getDate(), date:d.toDateString(), isToday:d.toDateString()===today.toDateString()};
  });
  const todayIdx = DAYS.findIndex(d=>d.isToday);
  const [selectedDay, setSelectedDay] = useState(Math.max(0,todayIdx));
  const [showEditor,  setShowEditor]  = useState(false);
  const [showWrapUp,  setShowWrapUp]  = useState(false);

  // Persist checked + skipped state in localStorage so partial progress saves across navigation
  const SCHED_KEY = "rootbloom_sched_v1";
  const schedWeekKey = weekStart.toDateString();
  const loadSchedState = () => {
    try{
      const s=localStorage.getItem(SCHED_KEY);
      if(!s) return {checked:{},skipped:{},notes:{},weekKey:""};
      const parsed=JSON.parse(s);
      // Reset if it is a new week
      if(parsed.weekKey!==schedWeekKey) return {checked:{},skipped:{},notes:{},weekKey:schedWeekKey};
      return parsed;
    }catch(e){return{checked:{},skipped:{},notes:{},weekKey:""};}
  };
  const [schedState, setSchedState] = useState(()=>loadSchedState());
  const saveSchedState = (ns) => { try{localStorage.setItem(SCHED_KEY,JSON.stringify({...ns,weekKey:schedWeekKey}));}catch(e){} };
  const [expandedNoteKey, setExpandedNoteKey] = useState(null); // which block has note open

  const checked = schedState.checked || {};
  const daySubjects = schedState.skipped || {};

  const setChecked = (updFn) => setSchedState(prev=>{
    const ns = {...prev, checked:{...updFn(prev.checked||{})}};
    saveSchedState(ns); return ns;
  });
  const setSubjectNote = (key, val) => setSchedState(prev=>{
    const ns = {...prev, notes:{...(prev.notes||{}),[key]:val}};
    saveSchedState(ns); return ns;
  });
  const subjectNotes = schedState.notes || {};
  const setDaySubjects = (updFn) => setSchedState(prev=>{
    const ns = {...prev, skipped:{...updFn(prev.skipped||{})}};
    saveSchedState(ns); return ns;
  });

  const schedMode2 = family.scheduleMode2||"same";
  const activeChildId = child==="all" ? null : child;
  const allBlocks = generateSchedule(family, schedMode2!=="same" ? activeChildId : null);
  const toggleBlock = (di, bi) => {
    const key = di+"_"+bi;
    setChecked(c=>({...c,[key]:!c[key]}));
  };
  const skipBlock = (e, di, bi) => {
    e.stopPropagation();
    setDaySubjects(prev=>{
      const dayMap = prev[di]||{};
      return {...prev,[di]:{...dayMap,[bi]:!dayMap[bi]}};
    });
  };
  const checkAll = (di) => {
    const updates = {};
    allBlocks.forEach((b,bi)=>{ if(!(daySubjects[di]||{})[bi]) updates[di+"_"+bi]=true; });
    setChecked(c=>({...c,...updates}));
  };
  const uncheckAll = (di) => {
    const updates = {};
    allBlocks.forEach((_,bi)=>{ updates[di+"_"+bi]=false; });
    setChecked(c=>({...c,...updates}));
  };

  const visibleBlocks = allBlocks.filter((b,bi)=>!(daySubjects[selectedDay]||{})[bi]);
  // In separate/mixed mode, allBlocks is already per-child — show all; in same mode, filter by child
  const filteredByChild = schedMode2==="same"
    ? visibleBlocks.filter(b=>child==="all"||b.c==="all"||b.c===child)
    : visibleBlocks;
  const checkedCount = allBlocks.filter((_,bi)=>!(daySubjects[selectedDay]||{})[bi] && checked[selectedDay+"_"+bi]).length;
  const allDone = checkedCount===filteredByChild.length && filteredByChild.length>0;

  // Report progress to parent (home screen)
  useEffect(()=>{
    if(onProgressUpdate && DAYS[selectedDay]?.isToday) {
      onProgressUpdate(checkedCount, filteredByChild.length);
    }
  },[checkedCount, filteredByChild.length, selectedDay]);
  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Schedule" sub={new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})} icon="📅"/>
      <FirstVisitTip pal={pal} screen="schedule"/>
      <div style={{padding:"0 1rem"}}>
        {/* Child filter + edit button */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.9rem",alignItems:"center"}}>
          <div style={{display:"flex",gap:"0.35rem",flex:1,overflowX:"auto"}}>
            {schedMode2==="same"&&<Chip pal={pal} label="All" active={child==="all"} onClick={()=>setChild("all")}/>}
            {family.children.map(c=><Chip key={c.id} pal={pal} label={c.avatar+" "+c.name} active={child===c.id||(schedMode2!=="same"&&child==="all"&&c===family.children[0])} onClick={()=>setChild(c.id)}/>)}
          </div>
          {schedMode2!=="same"&&(
            <span style={{fontSize:"0.6rem",color:pal.slate,background:pal.parchm,padding:"0.18rem 0.5rem",borderRadius:"20px",border:`1px solid ${pal.stone}40`,flexShrink:0,whiteSpace:"nowrap"}}>
              {schedMode2==="mixed"?"Mixed":"Per-child"}
            </span>
          )}
          <button onClick={()=>setShowEditor(true)}
            style={{padding:"0.32rem 0.7rem",border:`1.5px solid ${pal.stone}`,borderRadius:"9px",background:pal.linen,color:pal.inkM,fontSize:"0.72rem",fontWeight:"700",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
            {"✏️ Edit"}
          </button>
        </div>
        {/* Weekend banner */}
        {todayIdx===-1&&(
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.75rem 1rem",marginBottom:"0.85rem",border:`2px solid ${pal.primary}22`,display:"flex",gap:"0.65rem",alignItems:"center"}}>
            <span style={{fontSize:"1.3rem",flexShrink:0}}>{"🌴"}</span>
            <div>
              <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>{"It’s the weekend!"}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Here’s next week’s plan. Enjoy your break!"}</div>
            </div>
          </div>
        )}
        {/* Day strip - real dates */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"1rem"}}>
          {DAYS.map((d,i)=>(
            <button key={i} onClick={()=>setSelectedDay(i)} style={{flex:1,padding:"0.55rem 0",borderRadius:"12px",border:`2px solid ${i===selectedDay?pal.primary:d.isToday?pal.primary+"40":pal.stone+"55"}`,background:i===selectedDay?pal.primary:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.14s"}}>
              <div style={{fontSize:"0.58rem",fontWeight:"600",color:i===selectedDay?"rgba(255,255,255,0.7)":d.isToday?pal.primary:pal.slate,marginBottom:"2px"}}>{d.l}</div>
              <div style={{fontSize:"0.9rem",fontWeight:"800",color:i===selectedDay?pal.onDark:pal.inkM}}>{d.d}</div>
            </button>
          ))}
        </div>

        {/* Today tip - only show on today */}
        {DAYS[selectedDay]?.isToday && (()=>{
          const loggedViaPortfolio = lastCheckinDate===new Date().toDateString() && !allDone;
          return (
            <div style={{background:loggedViaPortfolio?pal.goodBg:pal.pale,borderRadius:"13px",padding:"0.65rem 1rem",marginBottom:"0.85rem",border:`2px solid ${loggedViaPortfolio?pal.good+"40":pal.primary+"22"}`,display:"flex",gap:"0.65rem",alignItems:"center"}}>
              <span style={{fontSize:"1.1rem",flexShrink:0}}>{loggedViaPortfolio?"✓":"🌱"}</span>
              <div style={{flex:1}}>
                {loggedViaPortfolio?(
                  <>
                    <div style={{fontWeight:"700",color:pal.good,fontSize:"0.78rem"}}>Already logged via Portfolio</div>
                    <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>You can still check off subjects here if you want to track them — or skip to the next day.</div>
                  </>
                ):(
                  <>
                    <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.78rem"}}>{"Today's checklist"}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>Tap items to check them off. Skip any you are not doing today.</div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* Block list */}
        {filteredByChild.length===0 && (
          <div style={{textAlign:"center",padding:"2rem 1rem",color:pal.slate,fontSize:"0.82rem"}}>No subjects for this day yet.</div>
        )}
        {allBlocks.map((b, bi)=>{
          const skipped = (daySubjects[selectedDay]||{})[bi];
          const blockKey = selectedDay+"_"+bi;
          const done = !!checked[blockKey];
          const hiddenByChild = !(child==="all"||b.c==="all"||b.c===child);
          if(hiddenByChild) return null;
          const noteKey = selectedDay+"_"+bi+"_note";
          const noteOpen = expandedNoteKey===blockKey;
          const hasNote  = !!(subjectNotes[noteKey]&&subjectNotes[noteKey].trim());
          return (
            <div key={bi} style={{marginBottom:"0.5rem",opacity:skipped?0.38:1,transition:"opacity 0.2s"}}>
              <div style={{background:done?pal.pale:pal.linen,borderRadius:noteOpen?"14px 14px 0 0":"14px",border:`2px solid ${done?pal.primary+"40":pal.stone+"18"}`,position:"relative",overflow:"hidden",transition:"all 0.14s"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:done?pal.accentGrad:skipped?pal.stone+"40":pal.stone+"60"}}/>
                <div onClick={()=>!skipped&&toggleBlock(selectedDay,bi)}
                  style={{padding:"0.85rem 1rem",display:"flex",gap:"0.85rem",alignItems:"center",cursor:skipped?"default":"pointer"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"11px",background:b.lifeReady?(done?LR_COLOR+"33":LR_COLOR+"18"):(done?pal.primary+"22":pal.pale),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",flexShrink:0,border:b.lifeReady?`2px solid ${LR_COLOR}40`:"none"}}>{b.i}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",color:done?(b.lifeReady?LR_COLOR:pal.primary):skipped?pal.stone:pal.ink,fontSize:"0.88rem",textDecoration:done?"line-through":skipped?"line-through":"none"}}>{b.s}</div>
                    <div style={{fontSize:"0.72rem",color:b.lifeReady?LR_COLOR:pal.slate,fontWeight:b.lifeReady?"600":"400"}}>{b.t?h12(b.t)+" · ":""}{b.dur} min{b.isLesson?" · Lesson":b.isPractice?" · Practice":""}</div>
                    {hasNote&&!noteOpen&&<div style={{fontSize:"0.65rem",color:pal.primary,marginTop:"2px",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📝 {subjectNotes[noteKey]}</div>}
                  </div>
                  <button onClick={e=>{e.stopPropagation();skipBlock(e,selectedDay,bi);}}
                    style={{padding:"0.18rem 0.5rem",borderRadius:"8px",border:`1.5px solid ${skipped?pal.warn:pal.stone+"60"}`,background:"transparent",color:skipped?pal.warn:pal.stone,fontSize:"0.62rem",fontWeight:"700",cursor:"pointer",flexShrink:0}}>
                    {skipped?"restore":"skip"}
                  </button>
                  {/* Note button */}
                  {!skipped&&<button onClick={e=>{e.stopPropagation();setExpandedNoteKey(noteOpen?null:blockKey);}}
                    style={{padding:"0.18rem 0.45rem",borderRadius:"8px",border:`1.5px solid ${hasNote?pal.primary:pal.stone+"60"}`,background:hasNote?pal.pale:"transparent",color:hasNote?pal.primary:pal.stone,fontSize:"0.7rem",cursor:"pointer",flexShrink:0}}>
                    📝
                  </button>}
                  <div style={{width:"22px",height:"22px",borderRadius:"6px",border:`2.5px solid ${done?pal.primary:pal.stone}`,background:done?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.14s"}}>
                    {done&&<span style={{color:"#fff",fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
                  </div>
                </div>
                {/* Inline note field */}
                {noteOpen&&(
                  <div style={{padding:"0 1rem 0.75rem 1rem",borderTop:`1px solid ${pal.stone}20`}}>
                    <textarea value={subjectNotes[noteKey]||""} onChange={e=>setSubjectNote(noteKey,e.target.value)}
                      rows={2} placeholder={"Notes for "+b.s+"... what did they learn, struggles, highlights?"}
                      autoFocus
                      style={{width:"100%",padding:"0.55rem 0.75rem",border:`1.5px solid ${pal.primary}50`,borderRadius:"10px",fontSize:"0.8rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.55,marginTop:"0.65rem"}}/>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Progress bar */}
        {filteredByChild.length>0&&(
          <div style={{background:pal.linen,borderRadius:"12px",padding:"0.75rem 1rem",marginTop:"0.35rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
              <span style={{fontSize:"0.75rem",fontWeight:"600",color:pal.inkM}}>{DAYS[selectedDay]?.isToday?"Today":"This day"}</span>
              <span style={{fontSize:"0.75rem",fontWeight:"800",color:allDone?pal.good:pal.primary}}>{checkedCount} / {filteredByChild.length} done</span>
            </div>
            <div style={{height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${filteredByChild.length?Math.round(checkedCount/filteredByChild.length*100):0}%`,borderRadius:"99px",background:allDone?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.3s ease"}}/>
            </div>
          </div>
        )}

        {/* Check all / uncheck all row */}
        {filteredByChild.length>0 && (
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.65rem"}}>
            <button onClick={()=>checkAll(selectedDay)}
              style={{flex:1,padding:"0.6rem",border:`2px solid ${pal.primary}`,borderRadius:"11px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
              Check All Done
            </button>
            <button onClick={()=>uncheckAll(selectedDay)}
              style={{padding:"0.6rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.78rem",cursor:"pointer"}}>
              Clear
            </button>
          </div>
        )}

        {/* Wrap up button — available once any subject is checked, glows when all done */}
        {DAYS[selectedDay]?.isToday && filteredByChild.length>0 && (
          <button
            onClick={()=>{ if(checkedCount>0) setShowWrapUp(true); }}
            style={{width:"100%",marginBottom:"0.75rem",padding:"0.9rem",border:"none",borderRadius:"14px",background:allDone?pal.accentGrad:checkedCount>0?pal.primary+"22":"#e0e0e0",color:allDone?pal.onDark:checkedCount>0?pal.primary:"#aaa",fontWeight:"800",fontSize:"0.88rem",cursor:checkedCount>0?"pointer":"default",transition:"all 0.3s",boxShadow:allDone?`0 6px 24px ${pal.accent}50`:"none"}}>
            {allDone ? "🌟 Wrap up today" : checkedCount>0 ? "📝 Wrap up so far..." : "Check off subjects above to wrap up"}
          </button>
        )}
        <div style={{height:"1rem"}}/>
      </div>
      {showEditor&&<ScheduleEditorModal pal={pal} family={family}
        onSave={overrides=>{onUpdateFamily&&onUpdateFamily({scheduleOverrides:overrides});setShowEditor(false);}}
        onClose={()=>setShowEditor(false)}/>}

      {showWrapUp&&(()=>{
        const completedBlocks = allBlocks.filter((_,bi)=>!(daySubjects[selectedDay]||{})[bi]&&checked[selectedDay+"_"+bi]);
        const subjsDone = [...new Set(completedBlocks.filter(b=>b.s!=="Break"&&b.s!=="Lunch").map(b=>b.s))];
        const notesBySubj = {};
        allBlocks.forEach((b,bi)=>{
          const nk = selectedDay+"_"+bi+"_note";
          if(subjectNotes[nk]&&b.s) notesBySubj[b.s] = subjectNotes[nk];
        });
        const dateLabel = DAYS[selectedDay] ? DAYS[selectedDay].l+" "+DAYS[selectedDay].d : "Today";
        const dateStr = DAYS[selectedDay]?.date
          ? new Date(DAYS[selectedDay].date).toLocaleDateString("en-US",{month:"short",day:"numeric"})
          : new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
        return (
          <WrapUpModal
            pal={pal} family={family}
            subjsDone={subjsDone} notesBySubj={notesBySubj}
            dateLabel={dateLabel} dateStr={dateStr} allDone={allDone}
            onSave={(entries)=>{
              onMarkComplete({
                blocks:completedBlocks,
                date:DAYS[selectedDay]?.date||new Date().toDateString(),
                dateLabel, checkedCount, total:filteredByChild.length,
                wrapUpEntries:entries,
              });
              setShowWrapUp(false);
            }}
            onClose={()=>setShowWrapUp(false)}
          />
        );
      })()}

      {/* Extracurricular activities for selected day */}
      {(()=>{
        const extraDays = family.extraDays||{};
        const selectedDayLabel = DAYS[selectedDay]?.l;
        const EXTRA_ICONS = {"Sports":"🏃","Music":"🎵","Art":"🎨","Dance":"💃","Theater":"🎭","Scouting":"⚜️","Martial Arts":"🥋","Club":"🏅","Field Trip":"🚌","Volunteer":"🤎"};
        const todayExtras = (family.extracurriculars||[])
          .filter(e=>e!=="None right now")
          .filter(e=>(extraDays[e]||[]).includes(selectedDayLabel));
        if(todayExtras.length===0) return null;
        return (
          <div style={{padding:"0 1rem",marginBottom:"1rem"}}>
            <div style={{fontSize:"0.65rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.45rem"}}>{"🏆 Activities Today"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
              {todayExtras.map(activity=>(
                <div key={activity} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",background:pal.linen,borderRadius:"14px",border:`1.5px solid ${pal.stone}30`}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"11px",background:pal.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>
                    {EXTRA_ICONS[activity]||"🏆"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem"}}>{activity}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"2px"}}>{"Extracurricular"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <ScheduleQuickEditors pal={pal} family={family} onUpdateFamily={onUpdateFamily}/>
    </div>
  );
}

/* ---- Schedule Quick Editors (Lesson Goals + Weekly Schedule inline cards) ---- */

function WrapUpModal({pal,family,subjsDone,notesBySubj,dateLabel,dateStr,allDone,onSave,onClose}) {
  subjsDone = subjsDone||[];
  notesBySubj = notesBySubj||{};
  const allSubjOptions = [...SUBJECT_OPTIONS,...(family.customSubjects||[])];
  const [childIdx, setChildIdx] = useState(0);
  const [notes, setNotes] = useState(()=>{
    const init = {};
    subjsDone.forEach(function(s){ init[s] = notesBySubj[s]||""; });
    return init;
  });
  const [saving, setSaving] = useState(false);
  const ch = family.children[childIdx]||family.children[0];

  const handleSave = () => {
    setSaving(true);
    const entries = [];
    family.children.forEach(function(c,ci){
      subjsDone.forEach(function(subj){
        const so = allSubjOptions.find(function(x){return x.label===subj;});
        entries.push({
          childIdx: ci,
          subj: subj,
          title: subj,
          note: notes[subj]||"",
          date: dateStr,
          icon: so ? so.icon : "",
          isMilestone: false,
          isDay: false,
        });
      });
    });
    onSave(entries);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.3)",animation:"slideUp 0.28s ease"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>
        <div style={{padding:"0.9rem 1.2rem 0.5rem",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:"900",color:pal.ink,fontSize:"1rem"}}>{allDone ? "Day complete!" : "Day Summary"}</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{dateLabel}</div>
            </div>
            <div style={{fontSize:"2rem"}}>{allDone ? "🌟" : "📝"}</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",minHeight:0,padding:"0.5rem 1.2rem"}}>
          {family.children.length>1&&(
            <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.85rem",overflowX:"auto"}}>
              {family.children.map((c,i)=>{
                const ccp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                const sel=i===childIdx;
                return (
                  <button key={c.id} onClick={()=>setChildIdx(i)}
                    style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.3rem 0.75rem",border:`2px solid ${sel?ccp.c1:pal.stone+"40"}`,borderRadius:"20px",background:sel?ccp.c1+"18":"transparent",cursor:"pointer",flexShrink:0}}>
                    <span style={{fontSize:"1rem"}}>{c.avatar}</span>
                    <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?ccp.c1:pal.inkM}}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}
          {subjsDone.length===0?(
            <div style={{textAlign:"center",padding:"1.5rem 0",color:pal.slate,fontSize:"0.82rem"}}>{"No subjects checked off yet."}</div>
          ):(
            <div>
              <div style={{fontSize:"0.68rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.55rem"}}>{"Completed today"}</div>
              {subjsDone.map(function(subj){
                const so=allSubjOptions.find(function(x){return x.label===subj;});
                return (
                  <div key={subj} style={{background:pal.parchm,borderRadius:"13px",padding:"0.75rem 0.9rem",marginBottom:"0.5rem",border:`1.5px solid ${pal.stone}25`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.5rem"}}>
                      <span style={{fontSize:"1.1rem"}}>{so ? so.icon : ""}</span>
                      <span style={{fontWeight:"700",color:pal.ink,fontSize:"0.85rem",flex:1}}>{subj}</span>
                      <span style={{color:pal.good,fontSize:"0.85rem"}}>{"\u2713"}</span>
                    </div>
                    <textarea
                      value={notes[subj]||""}
                      onChange={e=>setNotes(n=>({...n,[subj]:e.target.value}))}
                      rows={2}
                      placeholder={"What did "+ch.name+" learn or do in "+subj+"? (optional)"}
                      style={{width:"100%",padding:"0.5rem 0.7rem",border:`1.5px solid ${pal.primary}40`,borderRadius:"9px",fontSize:"0.78rem",fontFamily:"inherit",background:pal.linen,color:pal.ink,resize:"none",outline:"none",lineHeight:1.55}}/>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{height:"0.5rem"}}/>
        </div>
        <div style={{padding:"0.75rem 1.2rem 1.5rem",flexShrink:0,borderTop:`1px solid ${pal.stone}20`}}>
          <button onClick={handleSave} disabled={saving||subjsDone.length===0}
            style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:subjsDone.length>0?pal.accentGrad:"#ddd",color:subjsDone.length>0?"#fff":pal.stone,fontWeight:"800",fontSize:"0.9rem",cursor:subjsDone.length>0?"pointer":"default",marginBottom:"0.5rem"}}>
            {saving ? "Saving..." : "Save & Log to Portfolio"}
          </button>
          <button onClick={onClose}
            style={{width:"100%",padding:"0.65rem",border:`1.5px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.82rem",cursor:"pointer"}}>
            {"Close without saving"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickCaptureModal({pal, family, activeChildId, onClose, onSave, attendanceLog=[], onAttendanceAdd}) {
  const allSubjOptions = [...SUBJECT_OPTIONS, ...(family.customSubjects||[])];
  const activeSubjIds  = family.subjects||[];
  const activeSubjs    = activeSubjIds.map(id=>allSubjOptions.find(s=>s.id===id)).filter(Boolean);
  // Schedule-aware subject filtering
  const qcWeeklySchedule = family.weeklySchedule||null;
  const qcTodayDow = new Date().getDay();
  const qcDowIndex = qcTodayDow===0||qcTodayDow===6 ? null : qcTodayDow-1;
  const qcTodaySubjIds = (qcWeeklySchedule&&qcDowIndex!=null) ? qcWeeklySchedule[qcDowIndex] : null;
  const qcTodaySubjs = Array.isArray(qcTodaySubjIds)&&qcTodaySubjIds.length>0
    ? qcTodaySubjIds.map(id=>allSubjOptions.find(s=>s.id===id)).filter(Boolean) : null;
  const allGoalObjs    = [...GOALS,...(family.customGoals||[])];
  const familyGoals    = (family.goals||[]).map(id=>allGoalObjs.find(g=>g.id===id)).filter(Boolean);
  const defaultCi = activeChildId && activeChildId!=="all"
    ? Math.max(0, family.children.findIndex(c=>c.id===activeChildId))
    : 0;
  const todayIso  = new Date().toISOString().slice(0,10);
  const [childIdx,     setChildIdx]     = useState(defaultCi);
  const [showAllQCSubjs, setShowAllQCSubjs] = useState(!qcTodaySubjs);
  const qcDisplaySubjs = (showAllQCSubjs||!qcTodaySubjs) ? activeSubjs : qcTodaySubjs;
  const [subj,         setSubj]         = useState((qcTodaySubjs?qcTodaySubjs[0]:activeSubjs[0])?.label||"");
  const [note,         setNote]         = useState("");
  const [photos,       setPhotos]       = useState([]);
  const [saved,        setSaved]        = useState(false);
  const [captureDate,  setCaptureDate]  = useState(todayIso);
  const [lessonCount,  setLessonCount]  = useState(1);
  const [readingTitle, setReadingTitle] = useState("");
  const [goalsHit,     setGoalsHit]     = useState(new Set());
  const [showGoals,    setShowGoals]    = useState(false);
  const [isMilestone,  setIsMilestone]  = useState(false);
  const [savedEntryDate, setSavedEntryDate] = useState(null);
  const noteRef    = useRef(null);
  const galleryRef = useRef(null);
  const cameraRef  = useRef(null);
  const [scanMode, setScanMode] = useState(false); // doc scan processing
  const activeCh   = family.children[childIdx];
  const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(activeCh?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const isReading  = subj.toLowerCase().includes("read");
  const dateLabel  = captureDate===todayIso
    ? new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})
    : new Date(captureDate+", "+new Date().getFullYear()).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const displayDate = captureDate===todayIso
    ? new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})
    : new Date(captureDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

  useEffect(()=>{ setTimeout(()=>noteRef.current?.focus(), 150); },[]);

  const toggleGoal = (id) => setGoalsHit(prev=>{
    const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n;
  });

  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(file=>{
      const r=new FileReader();
      r.onload=ev=>setPhotos(p=>[...p,{dataUrl:ev.target.result}]);
      r.readAsDataURL(file);
    });
    e.target.value="";
  };

  const handleScan = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setScanMode(true);
    const r = new FileReader();
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        // Apply document-style processing: grayscale + contrast boost
        const canvas = document.createElement("canvas");
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Get pixel data and apply doc enhancement
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Find 10th and 90th percentile luminance for adaptive thresholding
        const lums = [];
        for(let i=0;i<data.length;i+=4){
          lums.push(0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]);
        }
        lums.sort((a,b)=>a-b);
        const lo = lums[Math.floor(lums.length*0.05)];
        const hi = lums[Math.floor(lums.length*0.95)];
        const range = hi-lo || 1;
        for(let i=0;i<data.length;i+=4){
          // Convert to grayscale
          const gray = 0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];
          // Stretch contrast
          const stretched = Math.min(255, Math.max(0, ((gray-lo)/range)*255));
          // Apply S-curve for cleaner doc look (darken darks, lighten lights)
          const t = stretched/255;
          const curved = Math.min(255, Math.round(255*(t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2)));
          // Slight warm tint to avoid harsh blue-white
          data[i]   = Math.min(255, curved + (curved>180?8:0)); // R
          data[i+1] = Math.min(255, curved + (curved>180?4:0)); // G
          data[i+2] = curved;                                    // B
        }
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        setPhotos(p=>[...p,{dataUrl, scanned:true}]);
        setScanMode(false);
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(file);
    e.target.value="";
  };

  const handleSave = () => {
    if(!subj) return;
    const subjObj = allSubjOptions.find(s=>s.label===subj||s.id===subj);
    const entryDate = new Date(captureDate).toLocaleDateString("en-US",{month:"short",day:"numeric"});
    const entry = {
      childIdx, subj,
      title: note.trim() ? note.trim().slice(0,80) : subj+"\u2014"+entryDate,
      note: note.trim(),
      thumb: subjObj?.icon||"📋",
      date: entryDate,
      photos: photos.map(p=>p.dataUrl),
      lessonCount,
      isSubject: true,
    };
    if(isReading && readingTitle.trim()) entry.readingTitle = readingTitle.trim();
    if(goalsHit.size>0) entry.goalsHit = [...goalsHit];
    if(isMilestone) entry.isMilestone = true;
    onSave([entry]);
    setSavedEntryDate(entryDate);
    setSaved(true);
  };

  // Check if the saved date already has an attendance record
  const alreadyInAttendance = savedEntryDate
    ? attendanceLog.some(e=>e.date===savedEntryDate)
    : false;

  if(saved) return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:"430px",background:pal.goodBg,borderRadius:"22px 22px 0 0",padding:"1.6rem 1.5rem",animation:"slideUp 0.22s ease"}}>
        <div style={{textAlign:"center",marginBottom:alreadyInAttendance?"1rem":"0"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.4rem"}}>{"✓"}</div>
          <div style={{fontWeight:"800",color:pal.good,fontSize:"1rem"}}>{"Captured!"}</div>
          <div style={{fontSize:"0.78rem",color:pal.inkM,marginTop:"4px"}}>{subj+" saved to "+activeCh?.name+"\u2019s portfolio \u00b7 "+displayDate+(lessonCount>1?" \u00b7 "+lessonCount+" lessons":"")}</div>
        </div>
        {!alreadyInAttendance&&onAttendanceAdd&&savedEntryDate&&(
          <div style={{background:"#fff",borderRadius:"14px",padding:"0.85rem 1rem",marginTop:"0.85rem",border:`1.5px solid ${pal.primary}25`}}>
            <div style={{fontSize:"0.78rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.5rem"}}>{"📋 Add to attendance record?"}</div>
            <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.5}}>{savedEntryDate+" isn\u2019t in your attendance log yet."}</div>
            <div style={{display:"flex",gap:"0.45rem"}}>
              <button onClick={()=>{
                onAttendanceAdd({date:savedEntryDate,type:"School Day",note:"Added from Quick Capture"});
                onClose();
              }} style={{flex:1,padding:"0.52rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>
                {"Yes, add it"}
              </button>
              <button onClick={onClose}
                style={{padding:"0.52rem 0.85rem",border:`1.5px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.78rem",cursor:"pointer"}}>
                {"Skip"}
              </button>
            </div>
          </div>
        )}
        {(alreadyInAttendance||!onAttendanceAdd)&&(
          <div style={{marginTop:"0.5rem",textAlign:"center"}}>
            <button onClick={onClose} style={{fontSize:"0.74rem",color:pal.primary,background:"transparent",border:"none",cursor:"pointer",fontWeight:"700"}}>{"Done"}</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:"430px",background:pal.linen,borderRadius:"24px 24px 0 0",animation:"slideUp 0.24s ease",paddingBottom:"env(safe-area-inset-bottom)",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0.65rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone+"60"}}/>
        </div>
        <div style={{padding:"0.6rem 1.1rem 0.6rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"✏️ Quick Capture"}</div>
          <button onClick={onClose} style={{width:"26px",height:"26px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0 1.1rem 1.1rem"}}>

          {/* Date row */}
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.75rem",background:pal.parchm,borderRadius:"10px",padding:"0.4rem 0.65rem",border:`1.5px solid ${pal.stone}40`}}>
            <span style={{fontSize:"0.8rem"}}>{"📅"}</span>
            <span style={{fontSize:"0.75rem",color:pal.inkM,fontWeight:"600",flex:1}}>
              {captureDate===todayIso ? "Today" : displayDate}
            </span>
            <input type="date" value={captureDate} max={todayIso}
              onChange={e=>setCaptureDate(e.target.value)}
              style={{border:"none",background:"transparent",fontSize:"0.72rem",color:pal.primary,fontWeight:"700",cursor:"pointer",outline:"none",fontFamily:"inherit"}}/>
          </div>

          {/* Child picker */}
          {family.children.length>1&&(
            <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.75rem",overflowX:"auto"}}>
              {family.children.map((c,i)=>{
                const ccp=CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                const sel=i===childIdx;
                return (
                  <button key={c.id} onClick={()=>setChildIdx(i)}
                    style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.3rem 0.65rem",border:`2px solid ${sel?ccp.c1:pal.stone+"40"}`,borderRadius:"20px",background:sel?ccp.c1+"18":"transparent",cursor:"pointer",flexShrink:0}}>
                    <span style={{fontSize:"1rem"}}>{c.avatar}</span>
                    <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?ccp.c1:pal.inkM}}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Subject chips - schedule aware */}
          {qcTodaySubjs&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.3rem"}}>
              <div style={{fontSize:"0.68rem",color:pal.slate}}>{showAllQCSubjs?"All subjects":"Today's subjects"}</div>
              <button onClick={()=>setShowAllQCSubjs(v=>!v)} style={{fontSize:"0.68rem",color:pal.primary,fontWeight:"700",background:"transparent",border:"none",cursor:"pointer"}}>
                {showAllQCSubjs?"\u2190 Today's only":"Show all"}
              </button>
            </div>
          )}
          <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
            {qcDisplaySubjs.map(s=>{
              const sel=subj===s.label;
              return (
                <button key={s.id} onClick={()=>setSubj(s.label)}
                  style={{display:"flex",alignItems:"center",gap:"0.25rem",padding:"0.28rem 0.6rem",border:`2px solid ${sel?cp.c1:pal.stone+"40"}`,borderRadius:"20px",background:sel?cp.c1+"18":"transparent",cursor:"pointer",flexShrink:0}}>
                  <span style={{fontSize:"0.85rem"}}>{s.icon}</span>
                  <span style={{fontSize:"0.72rem",fontWeight:sel?"800":"500",color:sel?cp.c1:pal.inkM}}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Lesson count */}
          <div style={{marginBottom:"0.65rem"}}>
            <div style={{fontSize:"0.7rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>{"Lessons completed"}</div>
            <div style={{display:"flex",gap:"0.35rem"}}>
              {[1,2,3,4].map(n=>{
                const sel=lessonCount===n;
                return (
                  <button key={n} onClick={()=>setLessonCount(n)}
                    style={{flex:1,padding:"0.35rem 0",border:`2px solid ${sel?cp.c1:pal.stone+"40"}`,borderRadius:"9px",background:sel?cp.c1+"18":"transparent",color:sel?cp.c1:pal.inkM,fontWeight:sel?"800":"500",fontSize:"0.82rem",cursor:"pointer"}}>
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading title — conditional */}
          {isReading&&(
            <div style={{marginBottom:"0.65rem"}}>
              <div style={{fontSize:"0.7rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>{"📖 Book / title read"}</div>
              <input value={readingTitle} onChange={e=>setReadingTitle(e.target.value)}
                placeholder={"e.g. Charlotte\u2019s Web, Ch. 4"}
                style={{width:"100%",padding:"0.5rem 0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                onFocus={e=>e.target.style.borderColor=cp.c1}
                onBlur={e=>e.target.style.borderColor=pal.stone}/>
            </div>
          )}

          {/* Notes */}
          <textarea ref={noteRef} value={note} onChange={e=>setNote(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey) handleSave();}}
            placeholder={"What did "+activeCh?.name+" do? (optional)"}
            rows={3}
            style={{width:"100%",padding:"0.7rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"13px",fontSize:"0.84rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.6,marginBottom:"0.65rem"}}
            onFocus={e=>e.target.style.borderColor=cp.c1}
            onBlur={e=>e.target.style.borderColor=pal.stone}/>

          {/* Goals hit — collapsible */}
          {familyGoals.length>0&&(
            <div style={{marginBottom:"0.65rem"}}>
              <button onClick={()=>setShowGoals(g=>!g)}
                style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"transparent",border:"none",cursor:"pointer",padding:"0",marginBottom:showGoals?"0.45rem":"0"}}>
                <span style={{fontSize:"0.7rem",fontWeight:"700",color:pal.inkM}}>{"🎯 Goals hit today"}</span>
                {goalsHit.size>0&&<span style={{fontSize:"0.65rem",fontWeight:"800",color:cp.c1,background:cp.c1+"18",padding:"0.1rem 0.4rem",borderRadius:"99px"}}>{goalsHit.size}</span>}
                <span style={{fontSize:"0.65rem",color:pal.slate}}>{showGoals?"▲":"▼"}</span>
              </button>
              {showGoals&&(
                <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap"}}>
                  {familyGoals.map(g=>{
                    const sel=goalsHit.has(g.id);
                    return (
                      <button key={g.id} onClick={()=>toggleGoal(g.id)}
                        style={{display:"flex",alignItems:"center",gap:"0.25rem",padding:"0.25rem 0.55rem",border:`2px solid ${sel?cp.c1:pal.stone+"40"}`,borderRadius:"20px",background:sel?cp.c1+"18":"transparent",cursor:"pointer"}}>
                        <span style={{fontSize:"0.8rem"}}>{g.icon||"🌿"}</span>
                        <span style={{fontSize:"0.68rem",fontWeight:sel?"800":"500",color:sel?cp.c1:pal.inkM}}>{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {photos.length>0&&(
            <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.65rem",overflowX:"auto"}}>
              {photos.map((p,i)=>(
                <div key={i} style={{position:"relative",flexShrink:0}}>
                  <img src={p.dataUrl} alt="" style={{width:"54px",height:"54px",borderRadius:"9px",objectFit:"cover",border:`1.5px solid ${pal.stone}30`}}/>
                  {p.scanned&&<div style={{position:"absolute",bottom:"2px",left:"2px",background:"rgba(0,0,0,0.55)",borderRadius:"4px",padding:"0 3px",fontSize:"0.45rem",color:"#fff",fontWeight:"700"}}>SCAN</div>}
                  <button onClick={()=>setPhotos(ps=>ps.filter((_,pi)=>pi!==i))}
                    style={{position:"absolute",top:"2px",right:"2px",width:"18px",height:"18px",borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",color:"#fff",fontSize:"0.55rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"✕"}</button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom action row */}
          <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{display:"none"}}/>
            <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={handleScan} style={{display:"none"}}/>
            {/* Gallery button */}
            <button onClick={()=>galleryRef.current?.click()}
              title="Photo library"
              style={{width:"44px",height:"44px",borderRadius:"12px",border:`2px solid ${pal.stone+"50"}`,background:"transparent",color:pal.slate,fontSize:"1.1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"📷"}</button>
            {/* Doc scan button */}
            <button onClick={()=>cameraRef.current?.click()}
              title="Scan document"
              style={{width:"44px",height:"44px",borderRadius:"12px",border:`2px solid ${pal.stone+"50"}`,background:scanMode?pal.pale:"transparent",color:scanMode?pal.primary:pal.slate,fontSize:"1.1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
              {scanMode
                ?<div style={{width:"18px",height:"18px",borderRadius:"50%",border:"2.5px solid "+pal.primary,borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}}/>
                :"📄"
              }
            </button>
            <button onClick={()=>setIsMilestone(m=>!m)} title="Mark as milestone"
              style={{width:"44px",height:"44px",borderRadius:"12px",border:`2px solid ${isMilestone?cp.c1:pal.stone+"50"}`,background:isMilestone?cp.c1+"18":"transparent",color:isMilestone?cp.c1:pal.slate,fontSize:"1.1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"🌟"}</button>
            <button onClick={handleSave} disabled={!subj}
              style={{flex:1,padding:"0.75rem",border:"none",borderRadius:"13px",background:subj?`linear-gradient(135deg,${cp.c1},${cp.c2})`:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:subj?"pointer":"default"}}>{"Save ✓"}</button>
          </div>
          <div style={{fontSize:"0.63rem",color:pal.stone,textAlign:"center",marginTop:"0.45rem"}}>
            {"Saves to "+activeCh?.name+"\u2019s portfolio \u00b7 "+displayDate+(lessonCount>1?" \u00b7 "+lessonCount+" lessons":"")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================================
   FULL YEAR PRINT MODAL
======================================= */

function DailyPortfolioModal({pal,family,childIdx,stateInfo,onClose,onSave,prevCarryOver=null}){
  const activeCh = family.children[childIdx];
  const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(activeCh?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];

  const customSubjs = family.customSubjects||[];
  const allSubjs = [...SUBJECT_OPTIONS,...customSubjs];
  const activeSubjIds = family.subjects||[];
  const activeSubjList = activeSubjIds.map(id=>allSubjs.find(s=>s.id===id)).filter(Boolean);

  // Step 0 = pick date + subjects for today; steps 1..N = one per subject; final = done
  const [step,        setStep]       = useState(0);
  const [todayDate,   setTodayDate]  = useState(new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}));
  const [selectedSubjs, setSelSubjs] = useState(()=>{
    const base = new Set(activeSubjList.map(s=>s.label));
    if(prevCarryOver&&prevCarryOver.length>0){
      // Add carried-over subjects (they may be from a different child's subject list)
      prevCarryOver.forEach(s=>base.add(s));
    }
    return base;
  });
  const [descMap,     setDescMap]    = useState({});
  const [photoMap,    setPhotoMap]   = useState({});
  const [readMap,     setReadMap]    = useState({});
  const [saved,       setSaved]      = useState(false);

  const galleryRef = useRef(null);
  const [gallerySubj, setGallerySubj] = useState(null);

  const toggleSubj = (label) => {
    setSelSubjs(prev=>{
      const next=new Set(prev);
      if(next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

  const subjSteps = activeSubjList.filter(s=>selectedSubjs.has(s.label));
  const totalSteps = subjSteps.length;
  const currentSubj = subjSteps[step-1];
  const isReadingSubj = currentSubj&&(currentSubj.label==="Reading"||currentSubj.label==="Reading/Language Arts");
  const needsReadingTitle = isReadingSubj&&(stateInfo?.readingLog||false);

  const setDesc = (label,val)=>setDescMap(m=>({...m,[label]:val}));
  const setPhotos = (label,val)=>setPhotoMap(m=>({...m,[label]:val}));
  const setReadTitle = (label,val)=>setReadMap(m=>({...m,[label]:val}));

  const handleGallery = (e) => {
    if(!gallerySubj) return;
    Array.from(e.target.files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>{
        setPhotoMap(m=>{
          const cur = Array.isArray(m[gallerySubj]) ? m[gallerySubj] : [];
          return {...m,[gallerySubj]:[...cur,{name:file.name,dataUrl:ev.target.result}]};
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value="";
  };

  const removePhoto = (label,i)=>{
    setPhotoMap(m=>{
      const cur = Array.isArray(m[label]) ? m[label] : [];
      return {...m,[label]:cur.filter((_,pi)=>pi!==i)};
    });
  };

  const handleNext = () => {
    if(step===0 && totalSteps===0) return; // no subjects selected, do nothing
    if(step<totalSteps) setStep(s=>s+1);
    else handleFinish();
  };

  const handleFinish = () => {
    const entries = subjSteps.map(s=>{
      const desc = (descMap[s.label]||"").trim();
      const photos = (photoMap[s.label]||[]).map(p=>p.dataUrl);
      const readingTitle = (readMap[s.label]||"").trim()||undefined;
      return {
        childIdx,
        subj: s.label,
        title: desc ? desc.slice(0,80) : s.label+" session",
        note: desc||"",
        thumb: s.icon||"📋",
        date: todayDate,
        photos,
        readingTitle,
      };
    }).filter(e=>e.note.trim()||e.photos.length>0);
    if(entries.length===0){
      // save at least one entry per selected subject with empty note
      onSave(subjSteps.map(s=>({childIdx,subj:s.label,title:s.label+" session",note:"",thumb:s.icon||"📋",date:todayDate,photos:[]})));
      return;
    }
    setSaved(true);
    onSave(entries);
  };

  const canProceed0 = selectedSubjs.size>0;
  const curDesc = currentSubj ? (descMap[currentSubj.label]||"") : "";
  const curPhotos = currentSubj ? (Array.isArray(photoMap[currentSubj.label]) ? photoMap[currentSubj.label] : []) : [];
  const curRead = currentSubj ? (readMap[currentSubj.label]||"") : "";
  const canProceedSubj = !needsReadingTitle || curRead.trim().length>0;

  if(saved){
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.72)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"2rem 1.5rem 3rem",textAlign:"center",animation:"slideUp 0.28s ease"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"0.6rem"}}>{"🌱"}</div>
          <div style={{fontWeight:"900",color:cp.c1,fontSize:"1.1rem",marginBottom:"0.35rem"}}>{"Today" + String.fromCharCode(39) + "s log saved!"}</div>
          <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.65,marginBottom:"1.5rem"}}>{selectedSubjs.size} subject{selectedSubjs.size!==1?"s":""} added to {activeCh?.name}{String.fromCharCode(39)}s portfolio.</div>
          <button onClick={onClose} style={{width:"100%",padding:"0.82rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.9rem",cursor:"pointer"}}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.72)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"90vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>

        {/* Handle + Header */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>
        <div style={{padding:"0.7rem 1.3rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.98rem"}}>
              {step===0 ? "What did we do today?" : currentSubj?.icon+" "+currentSubj?.label}
            </div>
            <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>
              {step===0 ? activeCh?.avatar+" "+activeCh?.name+(prevCarryOver&&prevCarryOver.length>0?" • subjects carried over ✓":"") : "Step "+(step)+" of "+totalSteps+" • "+activeCh?.name}
            </div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem"}}>{"x"}</button>
        </div>

        {/* Progress bar */}
        {totalSteps>0&&(
          <div style={{display:"flex",gap:"3px",padding:"0.55rem 1.3rem 0",flexShrink:0}}>
            {Array.from({length:totalSteps},(_,i)=>(
              <div key={i} style={{flex:1,height:"4px",borderRadius:"99px",background:i<step?cp.c1:i===step-1?cp.c1+"88":pal.stone+"40",transition:"background 0.25s"}}/>
            ))}
          </div>
        )}

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>

          {/* Step 0: Date + Subject picker */}
          {step===0&&(
            <div>
              <div style={{marginBottom:"1rem"}}>
                <Lbl pal={pal}>Date</Lbl>
                <input value={todayDate} onChange={e=>setTodayDate(e.target.value)}
                  style={{width:"100%",padding:"0.55rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.85rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                  onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
              </div>
              <Lbl pal={pal}>Subjects covered today</Lbl>
              <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                {activeSubjList.map(s=>{
                  const sel=selectedSubjs.has(s.label);
                  return (
                    <button key={s.id||s.label} onClick={()=>toggleSubj(s.label)}
                      style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.62rem 0.9rem",borderRadius:"12px",border:`2px solid ${sel?cp.c1:pal.stone+"50"}`,background:sel?cp.c1+"12":"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"8px",background:sel?cp.c1+"22":pal.parchm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{s.icon||"📋"}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:sel?"700":"500",color:sel?pal.ink:pal.inkM,fontSize:"0.84rem"}}>{s.label}</div>
                      </div>
                      <div style={{width:"20px",height:"20px",borderRadius:"50%",border:`2px solid ${sel?cp.c1:pal.stone+"60"}`,background:sel?cp.c1:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {sel&&<span style={{color:"#fff",fontSize:"0.65rem",fontWeight:"900"}}>{"\u2713"}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {activeSubjList.length===0&&(
                <div style={{padding:"1rem",textAlign:"center",fontSize:"0.78rem",color:pal.slate,background:pal.parchm,borderRadius:"12px"}}>
                  No subjects set up yet. Go to Settings to add your subjects.
                </div>
              )}
            </div>
          )}

          {/* Steps 1..N: per-subject description */}
          {step>0&&currentSubj&&(
            <div>
              <div style={{background:`linear-gradient(135deg,${cp.c1}15,${cp.c2}08)`,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${cp.c1}25`}}>
                <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>{currentSubj.icon||"📋"}</div>
                <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{currentSubj.label}</div>
                <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"2px"}}>Describe what was worked on today</div>
              </div>

              {needsReadingTitle&&(
                <div style={{marginBottom:"0.85rem",animation:"fadeUp 0.18s ease"}}>
                  <Lbl pal={pal}>Book / Material Title <span style={{color:pal.primary,fontWeight:"900"}}>{"*"}</span></Lbl>
                  <div style={{background:pal.pale,borderRadius:"10px",padding:"0.4rem 0.65rem",marginBottom:"0.45rem",fontSize:"0.7rem",color:pal.primary,fontWeight:"600",border:`1.5px solid ${pal.primary}25`}}>
                    {"📖 "}{family.state||"Your state"} requires reading materials to be listed by title.
                  </div>
                  <Input pal={pal} value={curRead} onChange={v=>setReadTitle(currentSubj.label,v)} placeholder="e.g. Charlotte Web, Saxon Math 5/4..."/>
                </div>
              )}
              {isReadingSubj&&!needsReadingTitle&&(
                <div style={{marginBottom:"0.7rem"}}>
                  <Lbl pal={pal}>Book / Material Title (optional)</Lbl>
                  <Input pal={pal} value={curRead} onChange={v=>setReadTitle(currentSubj.label,v)} placeholder="e.g. Charlotte Web, Saxon Phonics..."/>
                </div>
              )}

              <Lbl pal={pal}>What did {activeCh?.name} work on?</Lbl>
              <textarea
                value={curDesc}
                onChange={e=>setDesc(currentSubj.label,e.target.value)}
                rows={4}
                placeholder={"Describe the activity, lesson, or topic covered. What did " + (activeCh?.name||"they") + " learn or practice?"}
                style={{width:"100%",padding:"0.7rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",fontSize:"0.83rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.6,marginBottom:"0.75rem"}}
                onFocus={e=>e.target.style.borderColor=cp.c1}
                onBlur={e=>e.target.style.borderColor=pal.stone}/>

              {/* Photos for this subject */}
              <Lbl pal={pal}>Photos (optional)</Lbl>
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGallery} style={{display:"none"}}/>
              <button onClick={()=>{setGallerySubj(currentSubj.label);setTimeout(()=>galleryRef.current?.click(),50);}}
                style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.55rem 0.9rem",border:`2px solid ${pal.stone}50`,borderRadius:"11px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.77rem",cursor:"pointer",marginBottom:"0.6rem"}}>
                <span style={{fontSize:"1rem"}}>{"📷"}</span><span>Add Photos</span>
              </button>
              {curPhotos.length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem",marginBottom:"0.5rem"}}>
                  {curPhotos.map((p,i)=>(
                    <div key={i} style={{position:"relative",borderRadius:"10px",overflow:"hidden",aspectRatio:"1",border:`1.5px solid ${pal.stone}40`}}>
                      <img src={p.dataUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      <button onClick={()=>removePhoto(currentSubj.label,i)}
                        style={{position:"absolute",top:"4px",right:"4px",width:"20px",height:"20px",borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",fontSize:"0.65rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                        {"x"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          {step>0&&(
            <button onClick={()=>setStep(s=>s-1)}
              style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>
              {"< Back"}
            </button>
          )}
          {step===0&&(
            <button onClick={onClose}
              style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>
              Cancel
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step===0?!canProceed0:!canProceedSubj}
            style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:(step===0?canProceed0:canProceedSubj)?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:(step===0?canProceed0:canProceedSubj)?"pointer":"default"}}>
            {step===0 ? "Start \u2192 "+selectedSubjs.size+" subject"+(selectedSubjs.size!==1?"s":"")
              : step===totalSteps ? "Save Portfolio \u2713"
              : "Next: "+(subjSteps[step]?.label||"")+" \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Entry Detail Modal ---- */

function AddEntryModal({pal,family,onClose,onSave,initialData=null,stateInfo=null}){
  const isEdit = initialData!==null;
  // Multi-child: store as Set of indices
  const [selectedChildren, setSelectedChildren] = useState(
    isEdit ? new Set([initialData?.childIdx||0]) : new Set([0])
  );
  const toggleChild = (i) => {
    if(isEdit) { setSelectedChildren(new Set([i])); return; } // edit = single child
    setSelectedChildren(prev => {
      const next = new Set(prev);
      if(next.has(i) && next.size>1) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  const [title,     setTitle]     = useState(initialData?.title||"");
  const [subj,      setSubj]      = useState(initialData?.subj||"Daily Check-In");
  const [customSubj,setCustomSubj]= useState("");
  const [showCustom,setShowCustom]= useState(false);
  const [note,      setNote]      = useState(initialData?.note||"");
  const [thumb,        setThumb]       = useState(initialData?.thumb||"📋");
  const [readingTitle, setReadingTitle] = useState(initialData?.readingTitle||"");
  const isReadingSubj = subj==="Reading" || subj==="Reading/Language Arts";
  const needsReadingTitle = isReadingSubj && (stateInfo?.readingLog||false) && !isEdit;
  const canSaveReading = !needsReadingTitle || readingTitle.trim().length>0;
  const THUMBS=["📋","📜","🎨","🔬","📖","🏛","📝","🌿","🧪","🎵","📐","🌍","🏃","🍳","🏠","🧹","🌳","📸","💡","🖌"];
  const [photos,      setPhotos]    = useState(initialData?.photos||[]);
  const [showCamera,  setShowCamera]= useState(false);
  const galleryRef  = useRef(null);
  const cameraRef   = useRef(null);
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);

  const handleGallery = (e) => {
    Array.from(e.target.files).forEach(file=>{
      const reader = new FileReader();
      reader.onload = ev => setPhotos(p=>[...p,{name:file.name,dataUrl:ev.target.result}]);
      reader.readAsDataURL(file);
    });
  };

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
      streamRef.current = stream;
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) {
      alert("Camera not available. Try uploading from gallery instead.");
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if(!video||!canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video,0,0);
    const dataUrl = canvas.toDataURL("image/jpeg",0.85);
    setPhotos(p=>[...p,{name:"photo-"+Date.now()+".jpg",dataUrl}]);
    closeCamera();
  };

  const closeCamera = () => {
    if(streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
    setShowCamera(false);
  };

  const removePhoto = (i) => setPhotos(p=>p.filter((_,pi)=>pi!==i));
  const customSubjs = family.customSubjects||[];
  const allSubjs = [...SUBJECT_OPTIONS,...customSubjs];
  const activeSubjs = (family.subjects||[]).map(id=>allSubjs.find(s=>s.id===id)).filter(Boolean);
  const weeklySchedule = family.weeklySchedule||null;
  const todayDow = new Date().getDay();
  const dowIndex = todayDow===0||todayDow===6 ? null : todayDow-1;
  const todaySubjIds = (weeklySchedule&&dowIndex!=null) ? weeklySchedule[dowIndex] : null;
  const isDayOff = weeklySchedule && dowIndex!=null && todaySubjIds===null;
  const todaySubjs = (Array.isArray(todaySubjIds) && todaySubjIds.length>0)
    ? todaySubjIds.map(id=>allSubjs.find(s=>s.id===id)).filter(Boolean) : null;
  const [showAllSubjs, setShowAllSubjs] = useState(!todaySubjs || isEdit);
  const displaySubjs = (showAllSubjs || !todaySubjs) ? activeSubjs : todaySubjs;
  const subjOptions = ["Daily Check-In",...displaySubjs.map(s=>s.label)];
  const subjInList = subjOptions.includes(subj) || (showAllSubjs ? false : activeSubjs.map(s=>s.label).includes(subj));
  const canSave = title.trim().length>0 && canSaveReading;

  const handleSubjSelect = (s) => {
    if(s==="__other__"){setShowCustom(true);}
    else{setSubj(s);setShowCustom(false);}
  };
  const applyCustomSubj = () => {
    if(customSubj.trim()){setSubj(customSubj.trim());setShowCustom(false);}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.72)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}><div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/></div>
        <div style={{padding:"0.75rem 1.3rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{isEdit?"Edit Entry":"Add Portfolio Entry"}</div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem"}}>{"✕"}</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>

          <Lbl pal={pal}>{isEdit?"For which child?":"For which children? (select all that apply)"}</Lbl>
          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.85rem"}}>
            {family.children.map((c,i)=>{
              const sel=selectedChildren.has(i);
              return (
                <button key={c.id} onClick={()=>toggleChild(i)}
                  style={{flex:1,minWidth:"80px",padding:"0.55rem 0.4rem",borderRadius:"11px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.13s"}}>
                  {sel&&<div style={{position:"absolute",top:"4px",right:"4px",width:"14px",height:"14px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:"0.7rem",fontWeight:"900"}}>✓</span></div>}
                  <div style={{fontSize:"1.3rem"}}>{c.avatar}</div>
                  <div style={{fontSize:"0.68rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM}}>{c.name}</div>
                </button>
              );
            })}
          </div>
          {!isEdit && selectedChildren.size>1 && (
            <div style={{background:pal.pale,borderRadius:"10px",padding:"0.45rem 0.75rem",marginBottom:"0.75rem",marginTop:"-0.4rem",fontSize:"0.72rem",color:pal.primary,fontWeight:"700"}}>
              {selectedChildren.size} children selected — one entry will be saved for each
            </div>
          )}

          <Lbl pal={pal}>Subject</Lbl>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.45rem"}}>
            {subjOptions.map(s=>(
              <button key={s} onClick={()=>handleSubjSelect(s)}
                style={{padding:"0.25rem 0.65rem",borderRadius:"20px",border:`2px solid ${subj===s&&!showCustom?pal.primary:pal.stone+"60"}`,background:subj===s&&!showCustom?pal.pale:"transparent",color:subj===s&&!showCustom?pal.primary:pal.slate,fontSize:"0.73rem",fontWeight:subj===s&&!showCustom?"700":"400",cursor:"pointer"}}>
                {s}
              </button>
            ))}
            {/* Other option */}
            <button onClick={()=>handleSubjSelect("__other__")}
              style={{padding:"0.25rem 0.65rem",borderRadius:"20px",border:`2px solid ${showCustom||(!subjInList&&subj!=="Daily Check-In")?pal.primary:pal.stone+"60"}`,background:showCustom||(!subjInList&&subj!=="Daily Check-In")?pal.pale:"transparent",color:showCustom||(!subjInList&&subj!=="Daily Check-In")?pal.primary:pal.slate,fontSize:"0.73rem",fontWeight:showCustom||(!subjInList&&subj!=="Daily Check-In")?"700":"400",cursor:"pointer"}}>
              + Other
            </button>
          </div>
          {/* Custom subject input */}
          {(showCustom||(!subjInList&&subj!=="Daily Check-In")) && (
            <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.6rem",animation:"fadeUp 0.18s ease"}}>
              <input value={showCustom?customSubj:subj} onChange={e=>showCustom?setCustomSubj(e.target.value):setSubj(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&applyCustomSubj()}
                placeholder="e.g. Home Ec, Nutrition, Art History..."
                style={{flex:1,padding:"0.5rem 0.75rem",border:`2px solid ${pal.primary}`,borderRadius:"11px",fontSize:"0.8rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}/>
              {showCustom && <button onClick={applyCustomSubj} style={{padding:"0.5rem 0.75rem",border:"none",borderRadius:"11px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>Use</button>}
            </div>
          )}
          {subj && !showCustom && <div style={{fontSize:"0.72rem",color:pal.primary,fontWeight:"700",marginBottom:"0.75rem"}}>Subject: {subj}</div>}

          {/* Reading title — required for FL/PA states */}
          {needsReadingTitle && (
            <div style={{animation:"fadeUp 0.18s ease",marginBottom:"0.75rem"}}>
              <Lbl pal={pal}>Book / Material Title <span style={{color:pal.primary,fontWeight:"900"}}>*</span></Lbl>
              <div style={{background:pal.pale,borderRadius:"10px",padding:"0.45rem 0.7rem",marginBottom:"0.5rem",fontSize:"0.71rem",color:pal.primary,fontWeight:"600",border:`1.5px solid ${pal.primary}25`}}>
                📖 {family.state||"Your state"} requires reading materials to be listed by title.
              </div>
              <Input pal={pal} value={readingTitle} onChange={setReadingTitle} placeholder="e.g. Charlotte Web, Saxon Math 5/4, Bible Story Vol.2"/>
            </div>
          )}
          {isReadingSubj && !needsReadingTitle && (
            <div style={{marginBottom:"0.55rem"}}>
              <Lbl pal={pal}>Book / Material Title (optional)</Lbl>
              <Input pal={pal} value={readingTitle} onChange={setReadingTitle} placeholder="e.g. Charlotte Web, Saxon Phonics..."/>
            </div>
          )}
          <Lbl pal={pal}>Icon</Lbl>
          <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.85rem"}}>
            {THUMBS.map(t=>(
              <button key={t} onClick={()=>setThumb(t)}
                style={{width:"36px",height:"36px",borderRadius:"8px",border:`2px solid ${thumb===t?pal.primary:pal.stone+"50"}`,background:thumb===t?pal.pale:"transparent",cursor:"pointer",fontSize:"1.1rem"}}>
                {t}
              </button>
            ))}
          </div>

          <Lbl pal={pal}>Title</Lbl>
          <Input pal={pal} value={title} onChange={setTitle} placeholder="What did they do or learn?"/>
          <div style={{height:"0.75rem"}}/>
          <Lbl pal={pal}>Notes (optional)</Lbl>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
            placeholder="Any details, observations, or reflections..."
            style={{width:"100%",padding:"0.65rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.55}}
            onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>

          {/* ── PHOTOS ── */}
          <div style={{height:"0.75rem"}}/>
          <Lbl pal={pal}>Photos (optional)</Lbl>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.65rem"}}>
            {/* Gallery upload */}
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGallery} style={{display:"none"}}/>
            <button onClick={()=>galleryRef.current?.click()}
              style={{flex:1,padding:"0.6rem 0.5rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.35rem"}}>
              <span style={{fontSize:"1.1rem"}}>📷</span><span>Gallery</span>
            </button>
            {/* Camera */}
            <button onClick={openCamera}
              style={{flex:1,padding:"0.6rem 0.5rem",border:`2px solid ${pal.primary}`,borderRadius:"11px",background:pal.pale,color:pal.primary,fontWeight:"700",fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.35rem"}}>
              <span style={{fontSize:"1.1rem"}}>📸</span><span>Camera</span>
            </button>
          </div>
          {/* Photo grid */}
          {photos.length>0 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem",marginBottom:"0.5rem"}}>
              {photos.map((p,i)=>(
                <div key={i} style={{position:"relative",borderRadius:"10px",overflow:"hidden",aspectRatio:"1",border:`1.5px solid ${pal.stone}40`}}>
                  <img src={p.dataUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  <button onClick={()=>removePhoto(i)}
                    style={{position:"absolute",top:"4px",right:"4px",width:"20px",height:"20px",borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",fontSize:"0.65rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
          {photos.length===0&&<div style={{fontSize:"0.72rem",color:pal.stone,fontStyle:"italic",marginBottom:"0.5rem"}}>No photos yet</div>}

          {/* Camera modal */}
          {showCamera && (
            <div style={{position:"fixed",inset:0,background:"#000",zIndex:500,display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",background:"rgba(0,0,0,0.8)"}}>
                <span style={{color:"#fff",fontWeight:"700",fontSize:"0.9rem"}}>Take Photo</span>
                <button onClick={closeCamera} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"8px",padding:"0.3rem 0.7rem",color:"#fff",fontWeight:"700",fontSize:"0.8rem",cursor:"pointer"}}>Cancel</button>
              </div>
              <video ref={videoRef} autoPlay playsInline muted style={{flex:1,width:"100%",objectFit:"cover"}}/>
              <canvas ref={canvasRef} style={{display:"none"}}/>
              <div style={{padding:"1.2rem",background:"rgba(0,0,0,0.8)",display:"flex",justifyContent:"center"}}>
                <button onClick={takePhoto}
                  style={{width:"70px",height:"70px",borderRadius:"50%",border:"4px solid #fff",background:"rgba(255,255,255,0.9)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",boxShadow:"0 0 0 4px rgba(255,255,255,0.3)"}}>
                  📸
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
          <button onClick={()=>{
              if(!canSave) return;
              const today = initialData?.date||new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
              if(isEdit) {
                // Edit = single child (first selected)
                const childIdx = [...selectedChildren][0];
                onSave({childIdx,title,subj,note,thumb,date:today,photos:photos.map(p=>p.dataUrl),readingTitle:readingTitle.trim()||undefined});
              } else {
                // Multi-save — one per selected child
                [...selectedChildren].forEach(childIdx => {
                  onSave({childIdx,title,subj,note,thumb,date:today,photos:photos.map(p=>p.dataUrl),readingTitle:readingTitle.trim()||undefined});
                });
              }
            }}
            disabled={!canSave}
            style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:canSave?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:canSave?"pointer":"default"}}>
            {isEdit?"Save Changes":selectedChildren.size>1?"Save "+selectedChildren.size+" Entries":"Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Weekly Portfolio Packet ---- */

function AttendanceScreen({pal,family,days,attendanceLog=[],portfolioEntries=[],coopLog=[],onAddDay,onRemoveDay,onSyncPortfolio,pending,onConfirmPull,onCatchup,onLogPastDay}){
  const stateInfo  = getStateInfo(family.state||"");
  const REQUIRED   = parseInt((stateInfo.hours||"180").match(/\d+/)?.[0]||"180");
  const remaining  = Math.max(0,REQUIRED-days);
  const pct        = Math.min(100,Math.round((days/REQUIRED)*100));
  const onTrack    = (() => {
    if(!family.yearStart||!family.yearEnd) return pct>=68;
    const start=new Date(family.yearStart), end=new Date(family.yearEnd), now=new Date();
    const totalDays=(end-start)/(24*60*60*1000);
    const elapsed=(now-start)/(24*60*60*1000);
    const expectedPct=Math.min(100,Math.round((elapsed/totalDays)*100));
    return pct>=expectedPct-10;
  })();

  const [view,       setView]       = useState("overview"); // overview | calendar | ledger
  const [calMonth,   setCalMonth]   = useState(()=>new Date().getMonth());
  const [calYear,    setCalYear]    = useState(()=>new Date().getFullYear());
  const [showAdd,    setShowAdd]    = useState(false);
  const [showLogPast,setShowLogPast]= useState(false);
  const [hidePending,setHidePending]= useState(false);
  const [logPastDate,setLogPastDate]= useState(new Date().toISOString().slice(0,10));
  const [syncMsg,  setSyncMsg]  = useState(null);
  const [addDate,  setAddDate]  = useState(new Date().toISOString().slice(0,10));
  const [addType,  setAddType]  = useState("School Day");
  const [addNote,  setAddNote]  = useState("");

  const DAY_TYPES = ["School Day","Co-op Day","Field Trip","Excused Absence","Holiday"];
  const TYPE_ICONS = {"School Day":"📋","Co-op Day":"🏫","Field Trip":"🗺","Excused Absence":"🤒","Holiday":"🎉"};
  const TYPE_COUNTS = {"School Day":true,"Co-op Day":true,"Field Trip":true,"Excused Absence":false,"Holiday":false};

  // Build monthly breakdown from attendanceLog
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthCounts = {};
  const _now_att = new Date();
  const _yr_att  = _now_att.getFullYear();
  attendanceLog.forEach(e=>{
    if(!TYPE_COUNTS[e.type]) return;
    try{
      const d1=new Date(e.date+", "+_yr_att);
      const d=d1<=_now_att?d1:new Date(e.date+", "+(_yr_att-1));
      if(isNaN(d)) return;
      const key=d.getMonth();
      monthCounts[key]=(monthCounts[key]||0)+1;
    }catch{}
  });

  // Build ledger sorted newest first
  const ledger = [...attendanceLog].sort((a,b)=>{
    try{
      const now_l=new Date(); const yr_l=now_l.getFullYear();
      const da1=new Date(a.date+", "+yr_l); const da=da1<=now_l?da1:new Date(a.date+", "+(yr_l-1));
      const db1=new Date(b.date+", "+yr_l); const db=db1<=now_l?db1:new Date(b.date+", "+(yr_l-1));
      return db-da;
    }catch{return 0;}
  });

  // Get portfolio dates not yet in log for sync
  const loggedDates = new Set(attendanceLog.map(e=>e.date));
  const portfolioDates = [...new Set(portfolioEntries.filter(e=>!e.isDay&&e.date).map(e=>e.date))];
  const unsyncedCount = portfolioDates.filter(d=>!loggedDates.has(d)).length;

  const handleAddDay = () => {
    const dateStr = new Date(addDate).toLocaleDateString("en-US",{month:"short",day:"numeric"});
    onAddDay({date:dateStr,type:addType,note:addNote.trim()});
    setShowAdd(false);
    setAddNote("");
    setAddType("School Day");
  };

  const handleSync = () => {
    const count = onSyncPortfolio();
    setSyncMsg(count>0?`Added ${count} day${count!==1?"s":""} from portfolio!`:"All portfolio days are already logged.");
    setTimeout(()=>setSyncMsg(null),3000);
  };

  // Weeks left calc
  const weeksLeft = (() => {
    if(!family.yearEnd) return Math.round(remaining/5*10)/10;
    const end=new Date(family.yearEnd), now=new Date();
    const wks=Math.max(0,Math.ceil((end-now)/(7*24*60*60*1000)));
    return wks;
  })();
  const daysPerWeekNeeded = weeksLeft>0 ? Math.ceil(remaining/weeksLeft) : remaining;

  const printAttendance = () => {
    const win = window.open("","_blank");
    if(!win) return;
    const rows = ledger.map(e=>`<tr><td>${e.date}</td><td>${e.type}</td><td>${e.note||""}</td></tr>`).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Attendance Record</title>
    <style>body{font-family:Georgia,serif;padding:2rem;max-width:700px;margin:0 auto}
    h1{font-size:1.4rem;margin-bottom:0.25rem}h2{font-size:1rem;color:#555;font-weight:400;margin-bottom:1.5rem}
    table{width:100%;border-collapse:collapse;font-size:0.9rem}
    th{background:#f0f0f0;padding:0.5rem 0.75rem;text-align:left;border-bottom:2px solid #ccc}
    td{padding:0.45rem 0.75rem;border-bottom:1px solid #eee}
    .stats{display:flex;gap:2rem;margin-bottom:1.5rem;padding:1rem;background:#f9f9f9;border-radius:8px}
    .stat{text-align:center}.stat-n{font-size:1.8rem;font-weight:700;color:#2a6a2a}.stat-l{font-size:0.75rem;color:#777;text-transform:uppercase}
    .sig{margin-top:3rem;display:flex;justify-content:space-between}
    .sig-line{border-top:1px solid #333;width:200px;padding-top:4px;font-size:0.75rem;color:#555}
    @media print{button{display:none}}</style></head><body>
    <h1>${family.schoolName||family.familyName+" Academy"}</h1>
    <h2>Attendance Record &bull; ${family.state||""} &bull; ${new Date().getFullYear()}</h2>
    <p style="margin-bottom:1rem"><b>Student(s):</b> ${family.children.map(c=>(c.name+(c.lastName?" "+c.lastName:""))+" ("+c.grade+")").join(", ")}</p>
    <div class="stats">
      <div class="stat"><div class="stat-n">${days}</div><div class="stat-l">Days Logged</div></div>
      <div class="stat"><div class="stat-n">${REQUIRED}</div><div class="stat-l">Required</div></div>
      <div class="stat"><div class="stat-n">${pct}%</div><div class="stat-l">Complete</div></div>
      <div class="stat"><div class="stat-n">${remaining}</div><div class="stat-l">Remaining</div></div>
    </div>
    <table><thead><tr><th>Date</th><th>Type</th><th>Notes</th></tr></thead><tbody>${rows||"<tr><td colspan='3' style='color:#999;text-align:center'>No days logged yet</td></tr>"}</tbody></table>
    <div class="sig"><div class="sig-line">Parent / Educator Signature</div><div class="sig-line">Date</div></div>
    <button onclick="window.print()" style="margin-top:1.5rem;padding:0.6rem 1.5rem;background:#2a6a2a;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Print / Save PDF</button>
    </body></html>`);
    setTimeout(()=>win.document.close(),0);
  };

  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Attendance" sub={(family.state||"Your state")+(family.yearStart?" \u00b7 "+new Date(family.yearStart).getFullYear()+(family.yearEnd?"\u2013"+new Date(family.yearEnd).getFullYear():""):"")} icon="📋"/>
      <FirstVisitTip pal={pal} screen="attendance"/>
      <div style={{padding:"0 1rem"}}>

        {/* Pending schedule days banner */}
        {pending>0&&!hidePending&&(
          <div style={{background:pal.pale,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}30`,display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
            <div style={{width:"38px",height:"38px",borderRadius:"10px",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{"📅"}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.86rem",marginBottom:"0.2rem"}}>{pending} completed school {pending===1?"day":"days"} ready to log</div>
              <div style={{fontSize:"0.74rem",color:pal.inkM,marginBottom:"0.55rem",lineHeight:1.5}}>Your schedule shows {pending} {pending===1?"day":"days"} checked off. Add {pending===1?"it":"them"} to your attendance record?</div>
              <div style={{display:"flex",gap:"0.45rem"}}>
                <button onClick={onConfirmPull} style={{flex:1,padding:"0.5rem",border:"none",borderRadius:"9px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>{"✓ Yes, add "+pending}</button>
                <button onClick={()=>setHidePending(true)} style={{padding:"0.5rem 0.75rem",border:`1.5px solid ${pal.stone}`,borderRadius:"9px",background:"transparent",color:pal.slate,fontSize:"0.78rem",cursor:"pointer"}}>Later</button>
              </div>
            </div>
          </div>
        )}

        {/* Sync from portfolio banner */}
        {unsyncedCount>0&&(
          <div style={{background:pal.linen,borderRadius:"13px",padding:"0.7rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}25`,display:"flex",gap:"0.6rem",alignItems:"center"}}>
            <span style={{fontSize:"1rem",flexShrink:0}}>{"🗂"}</span>
            <div style={{flex:1,fontSize:"0.76rem",color:pal.inkM,lineHeight:1.5}}>
              <b>{unsyncedCount} portfolio {unsyncedCount===1?"day":"days"}</b> not yet in your attendance record.
            </div>
            <button onClick={handleSync} style={{padding:"0.32rem 0.75rem",border:"none",borderRadius:"9px",background:pal.primary,color:"#fff",fontSize:"0.72rem",fontWeight:"800",cursor:"pointer",flexShrink:0}}>Sync</button>
          </div>
        )}
        {syncMsg&&<div style={{background:pal.goodBg,borderRadius:"10px",padding:"0.55rem 0.85rem",marginBottom:"0.85rem",fontSize:"0.76rem",color:pal.good,fontWeight:"700",border:`1.5px solid ${pal.good}30`}}>{"✓ "+syncMsg}</div>}

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.4rem",marginBottom:"1rem"}}>
          {[
            {l:"Logged",   v:days,      c:pal.good,  bg:pal.goodBg},
            {l:"Required", v:REQUIRED,  c:pal.primary,bg:pal.pale},
            {l:"Remaining",v:remaining, c:remaining>0?pal.warn:pal.good, bg:remaining>0?"#fffbeb":pal.goodBg},
            {l:"Complete", v:pct+"%",   c:onTrack?pal.good:pal.warn, bg:onTrack?pal.goodBg:"#fffbeb"},
          ].map(s=>(
            <div key={s.l} style={{background:s.bg,borderRadius:"12px",padding:"0.65rem 0.4rem",textAlign:"center",border:`1.5px solid ${s.c}22`}}>
              <div style={{fontWeight:"900",color:s.c,fontSize:"1.1rem",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:"0.52rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:"3px"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Year progress bar */}
        <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"7px"}}>
            <span style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem"}}>Year Progress</span>
            <span style={{fontWeight:"900",color:onTrack?pal.good:pal.warn,fontSize:"0.8rem"}}>{onTrack?"✓ On track":"⚠ Behind pace"}</span>
          </div>
          <div style={{height:"11px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"6px"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:onTrack?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",color:pal.slate}}>
            <span>{days} of {REQUIRED} days</span>
            <span>{weeksLeft} weeks left</span>
          </div>
        </div>

        {/* State requirement note */}
        {stateInfo.attendance&&(
          <div style={{background:pal.pale,borderRadius:"12px",padding:"0.6rem 0.85rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.73rem",color:pal.inkM,lineHeight:1.55}}>
            <b style={{color:pal.primary}}>{family.state||"Your state"}:</b> {stateInfo.hours} {stateInfo.deadline&&stateInfo.deadline!=="None"?" \u00b7 Deadline: "+stateInfo.deadline:""}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{display:"flex",background:pal.parchm,borderRadius:"11px",padding:"3px",gap:"2px",marginBottom:"1rem"}}>
          {[["overview","📊 Overview"],["calendar","📅 Calendar"],["ledger","📋 Ledger"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)}
              style={{flex:1,padding:"0.45rem",border:"none",borderRadius:"9px",background:view===id?pal.linen:"transparent",color:view===id?pal.ink:pal.slate,fontSize:"0.76rem",fontWeight:view===id?"700":"400",cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {view==="overview"&&(<>

          {/* Monthly breakdown — real data */}
          <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.75rem"}}>Monthly Breakdown</div>
            {Object.keys(monthCounts).length===0?(
              <div style={{fontSize:"0.75rem",color:pal.slate,textAlign:"center",padding:"0.5rem 0"}}>No days logged yet — add days using the button below.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.42rem"}}>
                {MONTH_NAMES.map((m,mi)=>{
                  const cnt = monthCounts[mi]||0;
                  if(cnt===0) return null;
                  const target = Math.round(REQUIRED/10);
                  return (
                    <div key={m} style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
                      <div style={{width:"28px",fontSize:"0.7rem",fontWeight:"700",color:pal.inkM,flexShrink:0}}>{m}</div>
                      <div style={{flex:1,height:"8px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.min(100,Math.round(cnt/target*100))}%`,borderRadius:"99px",background:cnt>=target?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.4s"}}/>
                      </div>
                      <div style={{width:"22px",textAlign:"right",fontSize:"0.7rem",fontWeight:"800",color:pal.inkM,flexShrink:0}}>{cnt}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Day type breakdown */}
          {attendanceLog.length>0&&(()=>{
            const typeCounts = {};
            attendanceLog.forEach(e=>{ typeCounts[e.type]=(typeCounts[e.type]||0)+1; });
            return (
              <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.6rem"}}>By Type</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                  {Object.entries(typeCounts).map(([type,cnt])=>(
                    <div key={type} style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
                      <span style={{fontSize:"0.9rem",flexShrink:0}}>{TYPE_ICONS[type]||"📋"}</span>
                      <span style={{flex:1,fontSize:"0.78rem",color:pal.inkM,fontWeight:"600"}}>{type}</span>
                      <span style={{fontSize:"0.76rem",fontWeight:"800",color:pal.primary}}>{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Catch-up / on-track card */}
          <div style={{background:onTrack?pal.goodBg:"#fffbeb",borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`2px solid ${onTrack?pal.good:pal.warn}25`}}>
            <div style={{fontWeight:"800",color:onTrack?pal.good:pal.warn,fontSize:"0.88rem",marginBottom:"0.25rem"}}>
              {onTrack?"💚 You\u2019re on track!":"💛 A little behind \u2014 no worries!"}
            </div>
            <div style={{fontSize:"0.77rem",color:pal.inkM,lineHeight:1.65,marginBottom:onTrack?0:"0.65rem"}}>
              {onTrack
                ? `${days} days logged and right on pace. Keep going!`
                : `You need ${remaining} more days. About ${daysPerWeekNeeded} day${daysPerWeekNeeded!==1?"s":""}/week for the remaining ${weeksLeft} weeks.`}
            </div>
            {!onTrack&&(
              <button onClick={onCatchup}
                style={{width:"100%",padding:"0.6rem",border:"none",borderRadius:"10px",background:`linear-gradient(135deg,${pal.warn},${pal.accentD})`,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>
                {"📅 Build a Catch-Up Plan"}
              </button>
            )}
          </div>

          {/* Print button */}
          <button onClick={printAttendance}
            style={{width:"100%",padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"13px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.84rem",cursor:"pointer",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
            <span>{"🖨"}</span><span>Print Attendance Record</span>
          </button>
        </>)}

        {/* CALENDAR VIEW */}
        {view==="calendar"&&(()=>{
          const TYPE_COLORS = {"School Day":"#2d9e5f","Co-op Day":"#b07800","Field Trip":"#1a5a8a","Excused Absence":"#cc4444","Holiday":"#888"};
          const TYPE_BG     = {"School Day":"#e8f7ee","Co-op Day":"#fff8e6","Field Trip":"#e8f0f8","Excused Absence":"#ffeaea","Holiday":"#f0f0f0"};
          const yr = calYear;
          const dateMap = {};
          attendanceLog.forEach(e=>{
            try{ const d=new Date(e.date+", "+yr); if(isNaN(d)) return; const k=d.getMonth()+"_"+d.getDate(); if(!dateMap[k])dateMap[k]=[]; dateMap[k].push(e); }catch{}
          });
          const portfolioDateSet = new Set();
          portfolioEntries.forEach(e=>{
            if(!e.date||e.isDay) return;
            try{ const d=new Date(e.date+", "+yr); if(!isNaN(d)) portfolioDateSet.add(d.getMonth()+"_"+d.getDate()); }catch{}
          });
          const firstDay    = new Date(yr, calMonth, 1).getDay();
          const daysInMonth = new Date(yr, calMonth+1, 0).getDate();
          const today2      = new Date();
          const isCurrentMonth = today2.getMonth()===calMonth && today2.getFullYear()===yr;
          const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          const DOW2 = ["S","M","T","W","T","F","S"];
          const yearStart2 = family.yearStart ? new Date(family.yearStart) : null;
          const yearEnd2   = family.yearEnd   ? new Date(family.yearEnd)   : null;
          const canPrev = !yearStart2 || new Date(yr,calMonth-1,1)>=new Date(yearStart2.getFullYear(),yearStart2.getMonth(),1);
          const canNext = !yearEnd2   || new Date(yr,calMonth+1,1)<=new Date(yearEnd2.getFullYear(),yearEnd2.getMonth(),1);
          const goMonth = (d)=>{ let m=calMonth+d,y=calYear; if(m<0){m=11;y--;}if(m>11){m=0;y++;} setCalMonth(m);setCalYear(y); };
          const monthEntries = attendanceLog.filter(e=>{ try{const d=new Date(e.date+", "+yr);return d.getMonth()===calMonth&&d.getFullYear()===yr;}catch{return false;} });
          const monthSchoolDays = monthEntries.filter(e=>TYPE_COUNTS[e.type]).length;
          const cells = [];
          for(let i=0;i<firstDay;i++) cells.push(null);
          for(let d=1;d<=daysInMonth;d++) cells.push(d);
          while(cells.length%7!==0) cells.push(null);
          return (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                <button onClick={()=>canPrev&&goMonth(-1)} style={{width:"34px",height:"34px",borderRadius:"50%",border:"1.5px solid "+pal.stone+"50",background:"transparent",color:canPrev?pal.inkM:pal.stone+"40",fontSize:"1.1rem",cursor:canPrev?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center"}}>{"<"}</button>
                <div style={{textAlign:"center"}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{MN[calMonth]+" "+yr}</div>
                  <div style={{fontSize:"0.65rem",color:pal.slate}}>{monthSchoolDays+" school day"+(monthSchoolDays!==1?"s":"")+" logged"}</div>
                </div>
                <button onClick={()=>canNext&&goMonth(1)} style={{width:"34px",height:"34px",borderRadius:"50%",border:"1.5px solid "+pal.stone+"50",background:"transparent",color:canNext?pal.inkM:pal.stone+"40",fontSize:"1.1rem",cursor:canNext?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center"}}>{">"}</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px",marginBottom:"3px"}}>
                {DOW2.map((d,i)=>(<div key={i} style={{textAlign:"center",fontSize:"0.58rem",fontWeight:"700",color:i===0||i===6?pal.stone:pal.slate,padding:"2px 0"}}>{d}</div>))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px",marginBottom:"1rem"}}>
                {cells.map((day,ci)=>{
                  if(!day) return <div key={"e"+ci}/>;
                  const k=calMonth+"_"+day;
                  const de=dateMap[k]||[];
                  const pri=de[0];
                  const isToday=isCurrentMonth&&day===today2.getDate();
                  const hasPF=portfolioDateSet.has(k)&&!pri;
                  const isWE=(ci%7===0||ci%7===6);
                  return (
                    <div key={day} style={{aspectRatio:"1",borderRadius:"8px",background:pri?(TYPE_BG[pri.type]||"#e8f7ee"):"transparent",border:"1.5px solid "+(isToday?pal.primary:pri?(TYPE_COLORS[pri.type]||pal.good)+"40":"transparent"),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"36px",position:"relative",padding:"2px"}}>
                      <span style={{fontSize:"0.72rem",fontWeight:isToday?"900":pri?"700":"400",color:isToday?pal.primary:pri?(TYPE_COLORS[pri.type]||pal.good):isWE?pal.stone+"80":pal.inkM}}>{day}</span>
                      {(pri||hasPF)&&<div style={{width:"5px",height:"5px",borderRadius:"50%",background:pri?(TYPE_COLORS[pri.type]||pal.good):pal.primary+"60",marginTop:"1px"}}/>}
                      {de.length>1&&<div style={{position:"absolute",top:"2px",right:"3px",fontSize:"0.45rem",color:pal.slate,fontWeight:"700"}}>{de.length}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{background:pal.linen,borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1rem",border:"1.5px solid "+pal.stone+"30"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.7rem",marginBottom:"0.45rem"}}>{"Legend"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                  {Object.entries(TYPE_COLORS).map(([type,col])=>(
                    <div key={type} style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
                      <div style={{width:"10px",height:"10px",borderRadius:"3px",background:TYPE_BG[type],border:"1.5px solid "+col+"60"}}/>
                      <span style={{fontSize:"0.63rem",color:pal.inkM}}>{type}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",background:pal.primary+"60"}}/>
                    <span style={{fontSize:"0.63rem",color:pal.slate}}>{"Portfolio (unlogged)"}</span>
                  </div>
                </div>
              </div>
              {monthEntries.length>0&&(()=>{
                const byType={}; monthEntries.forEach(e=>{byType[e.type]=(byType[e.type]||0)+1;});
                return (
                  <div style={{background:pal.linen,borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1rem",border:"1.5px solid "+pal.stone+"30"}}>
                    <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.7rem",marginBottom:"0.45rem"}}>{MN[calMonth]+" summary"}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                      {Object.entries(byType).map(([type,cnt])=>(
                        <div key={type} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.55rem",background:TYPE_BG[type]||pal.pale,borderRadius:"20px",border:"1px solid "+(TYPE_COLORS[type]||pal.stone)+"40"}}>
                          <span style={{fontSize:"0.65rem",fontWeight:"700",color:TYPE_COLORS[type]||pal.inkM}}>{(TYPE_ICONS[type]||"")+cnt+" "+type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ── DAILY LEDGER ── */}
        {view==="ledger"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.65rem"}}>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>Daily Log</div>
            <div style={{display:"flex",gap:"0.4rem"}}>
              {onLogPastDay&&(
                <button onClick={()=>setShowLogPast(p=>!p)}
                  style={{padding:"0.32rem 0.75rem",border:`2px solid ${pal.primary}`,borderRadius:"9px",background:"transparent",color:pal.primary,fontWeight:"800",fontSize:"0.76rem",cursor:"pointer"}}>
                  {"📝 Log Past Day"}
                </button>
              )}
              <button onClick={()=>setShowAdd(true)}
                style={{padding:"0.32rem 0.8rem",border:"none",borderRadius:"9px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.76rem",cursor:"pointer"}}>
                + Log Day
              </button>
            </div>
          </div>

          {showLogPast&&onLogPastDay&&(
            <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.85rem",border:`2px solid ${pal.primary}30`,animation:"fadeUp 0.18s ease"}}>
              <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.84rem",marginBottom:"0.5rem"}}>{"📝 Log a missed day"}</div>
              <div style={{fontSize:"0.74rem",color:pal.inkM,lineHeight:1.55,marginBottom:"0.65rem"}}>{"Pick any past date and walk through the full day log — subjects, notes, photos, and goals."}</div>
              <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                <input type="date" value={logPastDate} onChange={e=>setLogPastDate(e.target.value)}
                  max={new Date().toISOString().slice(0,10)}
                  style={{flex:1,padding:"0.5rem 0.6rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.81rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                  onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
                <button onClick={()=>{setShowLogPast(false);onLogPastDay(logPastDate);}}
                  style={{padding:"0.5rem 1rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer",flexShrink:0}}>
                  {"Start →"}
                </button>
                <button onClick={()=>setShowLogPast(false)}
                  style={{padding:"0.5rem 0.75rem",border:`1.5px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.8rem",cursor:"pointer",flexShrink:0}}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add day form */}
          {showAdd&&(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.primary}30`,animation:"fadeUp 0.18s ease"}}>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem",marginBottom:"0.65rem"}}>Log a Day</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.55rem"}}>
                <div>
                  <Lbl pal={pal}>Date</Lbl>
                  <input type="date" value={addDate} onChange={e=>setAddDate(e.target.value)}
                    style={{width:"100%",padding:"0.5rem 0.6rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.81rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
                </div>
                <div>
                  <Lbl pal={pal}>Type</Lbl>
                  <select value={addType} onChange={e=>setAddType(e.target.value)}
                    style={{width:"100%",padding:"0.5rem 0.6rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.81rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}>
                    {DAY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <Lbl pal={pal}>Note (optional)</Lbl>
              <input value={addNote} onChange={e=>setAddNote(e.target.value)}
                placeholder={"e.g. Field trip to science museum"}
                style={{width:"100%",padding:"0.5rem 0.6rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.81rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",marginBottom:"0.65rem"}}
                onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
              <div style={{display:"flex",gap:"0.45rem"}}>
                <button onClick={()=>setShowAdd(false)}
                  style={{padding:"0.55rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.8rem",cursor:"pointer"}}>
                  Cancel
                </button>
                <button onClick={handleAddDay}
                  style={{flex:1,padding:"0.55rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>
                  Save Day
                </button>
              </div>
            </div>
          )}

          {ledger.length===0?(
            <div style={{background:pal.linen,borderRadius:"14px",padding:"1.5rem",textAlign:"center",border:`1.5px solid ${pal.stone}25`,marginBottom:"1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>📋</div>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.86rem",marginBottom:"0.3rem"}}>No days logged yet</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.55,marginBottom:"0.75rem"}}>Use "+ Log Day" above to add days manually, or sync from your portfolio entries.</div>
              {unsyncedCount>0&&(
                <button onClick={handleSync}
                  style={{padding:"0.5rem 1.1rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>
                  {"🗂 Sync "+unsyncedCount+" days from portfolio"}
                </button>
              )}
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginBottom:"1rem"}}>
              {ledger.map((entry,i)=>{
                const hasPortfolio = portfolioEntries.some(e=>e.date===entry.date&&!e.isDay);
                const isoDate = (()=>{try{const d=new Date(entry.date+", "+new Date().getFullYear());return d.toISOString().slice(0,10);}catch{return "";}})();
                return (
                <div key={entry.date+i} style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.6rem 0.85rem",background:pal.linen,borderRadius:"11px",border:`1px solid ${pal.stone}25`}}>
                  <span style={{fontSize:"1.1rem",flexShrink:0}}>{TYPE_ICONS[entry.type]||"📋"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem"}}>{entry.date}</div>
                    <div style={{fontSize:"0.66rem",color:pal.slate,marginTop:"1px"}}>
                      {entry.type}{entry.note?" \u00b7 "+entry.note.slice(0,40):""}
                      {entry.subjects?.length>0&&" \u00b7 "+entry.subjects.slice(0,3).join(", ")}
                    </div>
                  </div>
                  {!hasPortfolio&&onLogPastDay&&isoDate&&(
                    <button onClick={()=>onLogPastDay(isoDate)}
                      style={{padding:"0.25rem 0.55rem",border:`1.5px solid ${pal.primary}`,borderRadius:"8px",background:"transparent",color:pal.primary,fontSize:"0.65rem",fontWeight:"800",cursor:"pointer",flexShrink:0}}>
                      {"📝 Log"}
                    </button>
                  )}
                  {hasPortfolio&&(
                    <span style={{fontSize:"0.65rem",color:pal.good,fontWeight:"700",flexShrink:0}}>{"✓ logged"}</span>
                  )}
                  <button onClick={()=>onRemoveDay(entry.date)}
                    style={{width:"22px",height:"22px",borderRadius:"50%",background:pal.parchm,border:`1px solid ${pal.stone}`,color:pal.slate,fontSize:"0.65rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {"✕"}
                  </button>
                </div>
                );
              })}
            </div>
          )}

          {ledger.length>0&&(
            <button onClick={printAttendance}
              style={{width:"100%",padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"13px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.84rem",cursor:"pointer",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
              <span>{"🖨"}</span><span>Print Attendance Record</span>
            </button>
          )}
        </>)}

        <div style={{height:"0.5rem"}}/>
      </div>
    </div>
  );
}
/* ---- Co-op Setup Card (inline editor on Co-op screen) ---- */

function CoopScreen({pal,family,coopLog,onLog,onUpdateFamily,onAddEntry}){
  const [showQL,    setShowQL]    = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [expanded,  setExpanded]  = useState(null);
  const [coopTab,   setCoopTab]   = useState("info"); // info | photos | history

  const freq      = family.coopFreq||"";
  const doesCoop  = freq && freq!=="We don't do co-op";
  const coopDay   = family.coopDay||"";
  const coopTime  = family.coopTime||"";
  const coopName  = family.coopName||"";
  const coopClasses = family.coopClasses||[];
  const needsSetup = doesCoop && (!coopDay || coopClasses.length===0);

  const totalHrs = coopLog.reduce((s,l)=>s+(parseFloat(l.hrs)||0),0);
  const thisMonth = new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"});
  const monthHrs  = coopLog.filter(l=>{
    try{
      const now = new Date();
      const yr1 = now.getFullYear();
      const yr2 = yr1 - 1;
      const d1 = new Date(l.date+", "+yr1);
      const d2 = new Date(l.date+", "+yr2);
      // Pick the parse that is not in the future
      const d = d1 <= now ? d1 : d2;
      return d.toLocaleDateString("en-US",{month:"short",year:"numeric"})===thisMonth;
    }catch{return false;}
  }).reduce((s,l)=>s+(parseFloat(l.hrs)||0),0);

  const saveLog = (logData) => {
    const date = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
    onLog({...logData, date});
    // Save portfolio entries — one per selected subject per child
    if(onAddEntry && (logData.subjects||[]).length>0) {
      family.children.forEach((ch,ci)=>{
        (logData.subjects||[]).forEach(subj=>{
          const note = (logData.subjectNotes&&logData.subjectNotes[ch.id]&&logData.subjectNotes[ch.id][subj])||"";
          onAddEntry({
            childIdx: ci,
            subj: subj,
            title: subj+" \u2014 Co-op",
            note: note,
            thumb: "🏫",
            date: date,
            photos: logData.photos||[],
          });
        });
      });
    }
  };

  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Co-op" sub="Your co-op community" icon="🏫"/>
      <FirstVisitTip pal={pal} screen="coop"/>
      {/* Tab bar */}
      <div style={{display:"flex",background:pal.parchm,borderRadius:"12px",padding:"3px",gap:"2px",margin:"0 1rem 1rem"}}>
        {[["info","📋 Info"],["photos","📷 Photos"],["history","📅 History"]].map(([id,label])=>(
          <button key={id} onClick={()=>setCoopTab(id)}
            style={{flex:1,padding:"0.5rem 0.3rem",border:"none",borderRadius:"10px",background:coopTab===id?pal.linen:"transparent",cursor:"pointer",fontWeight:"700",color:coopTab===id?pal.primary:pal.slate,fontSize:"0.78rem",transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>
      <div style={{padding:"0 1rem"}}>
      {coopTab==="info"&&(<div>

        {/* No co-op configured yet */}
        {!doesCoop&&!showSetup&&(
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1.5rem",textAlign:"center",border:`1.5px solid ${pal.stone}30`,marginBottom:"1rem"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{"🏫"}</div>
            <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.9rem",marginBottom:"0.3rem"}}>{"No co-op set up yet"}</div>
            <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6,marginBottom:"1rem"}}>{"Tell us about your co-op — meeting day, group name, and classes — so sessions appear on your schedule and hours log to transcripts automatically."}</div>
            <button onClick={()=>setShowSetup(true)}
              style={{padding:"0.6rem 1.4rem",border:"none",borderRadius:"11px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer"}}>
              {"Set Up Co-op →"}
            </button>
          </div>
        )}

        {/* Setup prompt — shown if co-op is on but not fully configured */}
        {needsSetup&&!showSetup&&(
          <div style={{background:`linear-gradient(135deg,${pal.primary}12,${pal.accent}08)`,borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}25`}}>
            <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"🏫 Finish setting up your co-op"}</div>
            <div style={{fontSize:"0.76rem",color:pal.inkM,lineHeight:1.55,marginBottom:"0.75rem"}}>
              Tell us what day you meet, what classes are covered, and which kids attend — so logging sessions is quick and your schedule stays accurate.
            </div>
            <button onClick={()=>setShowSetup(true)}
              style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"11px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>
              Complete Setup →
            </button>
          </div>
        )}

        {/* Setup form inline */}
        {showSetup&&<CoopSetupCard pal={pal} family={family} onSave={(updates)=>{onUpdateFamily&&onUpdateFamily(updates);setShowSetup(false);}} onCancel={()=>setShowSetup(false)}/>}

        {/* Info banner when set up */}
        {doesCoop&&!needsSetup&&!showSetup&&(
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.75rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}20`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
                <span style={{fontSize:"1.2rem",flexShrink:0,marginTop:"1px"}}>{"📅"}</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>{coopName||"Co-op"} {"\u00b7"} {coopDay}{coopTime?" at "+coopTime:""}</div>
                  <div style={{fontSize:"0.72rem",color:pal.inkM,marginTop:"2px"}}>{freq}</div>
                  {coopClasses.length>0&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.25rem",marginTop:"0.4rem"}}>
                      {coopClasses.map(c=>(
                        <span key={c} style={{padding:"0.12rem 0.45rem",background:pal.primary+"18",borderRadius:"20px",fontSize:"0.65rem",fontWeight:"600",color:pal.primary}}>{c}</span>
                      ))}
                    </div>
                  )}
                  {(family.coopSubjects||[]).length>0&&(()=>{
                    const allSubjOpts2=[...SUBJECT_OPTIONS,...(family.customSubjects||[])];
                    const coopSubjLabels=(family.coopSubjects||[]).map(id=>allSubjOpts2.find(s=>s.id===id)).filter(Boolean);
                    if(coopSubjLabels.length===0) return null;
                    return (
                      <div style={{marginTop:"0.4rem"}}>
                        <div style={{fontSize:"0.6rem",color:pal.slate,fontWeight:"600",marginBottom:"0.2rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>{"On schedule:"}</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"0.22rem"}}>
                          {coopSubjLabels.map(s=>(
                            <span key={s.id} style={{padding:"0.1rem 0.4rem",background:pal.good+"18",borderRadius:"20px",fontSize:"0.63rem",fontWeight:"600",color:pal.good}}>{s.icon} {s.label}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <button onClick={()=>setShowSetup(true)}
                style={{padding:"0.22rem 0.6rem",border:`1.5px solid ${pal.stone}`,borderRadius:"8px",background:"transparent",color:pal.slate,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer",flexShrink:0}}>
                Edit
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem",marginBottom:"1rem"}}>
          {[
            {l:"Total Hours", v:totalHrs>0?totalHrs+"h":"—",  c:pal.primary, bg:pal.pale},
            {l:"This Month",  v:monthHrs>0?monthHrs+"h":"—",  c:pal.mid,     bg:pal.paleMid},
            {l:"Sessions",    v:coopLog.length||"—",           c:pal.accentD, bg:pal.pale},
          ].map(s=>(
            <div key={s.l} style={{background:s.bg,borderRadius:"13px",padding:"0.75rem 0.5rem",textAlign:"center",border:`1.5px solid ${s.c}22`}}>
              <div style={{fontWeight:"900",color:s.c,fontSize:"1.2rem",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:"0.55rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:"3px"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {doesCoop&&!needsSetup&&(
          <button onClick={()=>setShowQL(true)}
            style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer",marginBottom:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",boxShadow:`0 4px 18px ${pal.accent}35`}}>
            <span style={{fontSize:"1.1rem"}}>{"🏫"}</span>
            <span>{"Log a Co-op Session"}</span>
          </button>
        )}

      </div>)} {/* end info tab */}

      {/* PHOTOS TAB */}
      {coopTab==="photos"&&(<div>
        {(()=>{
          const allPhotos = coopLog.flatMap(l=>(l.photos||[]).map(p=>({url:p,date:l.date,classes:l.classes||[]})));
          if(allPhotos.length===0) return (
            <div style={{background:pal.linen,borderRadius:"16px",padding:"2rem 1.5rem",textAlign:"center",border:`1.5px solid ${pal.stone}30`,margin:"0 1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"📷"}</div>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.3rem"}}>{"No co-op photos yet"}</div>
              <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6}}>{"Photos you add when logging co-op sessions will appear here."}</div>
            </div>
          );
          return (
            <div style={{padding:"0 1rem"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
                {allPhotos.map((p,i)=>(
                  <div key={i} style={{aspectRatio:"1",borderRadius:"10px",overflow:"hidden",background:pal.parchm}}>
                    <img src={p.url} alt="co-op" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                ))}
              </div>
              <div style={{fontSize:"0.68rem",color:pal.slate,textAlign:"center",marginTop:"0.75rem"}}>{allPhotos.length+" co-op "+(allPhotos.length===1?"photo":"photos")}</div>
            </div>
          );
        })()}
      </div>)}

      {/* HISTORY TAB */}
      {coopTab==="history"&&(<div style={{padding:"0 1rem"}}>
        {/* Log button */}
        <button onClick={()=>setShowQL(true)}
          style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer",marginBottom:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",boxShadow:`0 4px 18px ${pal.accent}35`}}>
          <span style={{fontSize:"1.1rem"}}>{"🏫"}</span>
          <span>Log a Co-op Session</span>
        </button>

        {/* Session history */}
        {coopLog.length===0?(
          <div style={{background:pal.linen,borderRadius:"16px",padding:"2rem 1.5rem",textAlign:"center",border:`1.5px solid ${pal.stone}30`,marginBottom:"1rem"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🏫</div>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.3rem"}}>No sessions logged yet</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.55}}>Tap the button above to log your first co-op session. Hours will appear in your records and transcript.</div>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.55rem"}}>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>Session History</div>
              <div style={{fontSize:"0.7rem",color:pal.slate}}>{coopLog.length} session{coopLog.length!==1?"s":""}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
              {coopLog.map((log,i)=>{
                const isOpen = expanded===i;
                const hasNotes = log.notes&&Object.values(log.notes).some(n=>n&&n.trim());
                return (
                  <div key={i} style={{background:pal.linen,borderRadius:"13px",border:`1.5px solid ${isOpen?pal.primary+"40":pal.stone+"30"}`,overflow:"hidden",transition:"border-color 0.15s"}}>
                    <button onClick={()=>setExpanded(isOpen?null:i)}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.7rem 0.9rem",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                      <div style={{width:"40px",height:"40px",borderRadius:"11px",background:pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",flexShrink:0}}>{"🏫"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.session||"Co-op Session"}</div>
                        <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>{log.date||"—"} {"\u00b7"} {log.hrs}h</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0}}>
                        <div style={{background:pal.primary+"18",borderRadius:"20px",padding:"0.1rem 0.5rem"}}>
                          <span style={{fontWeight:"800",color:pal.primary,fontSize:"0.75rem"}}>{log.hrs}h</span>
                        </div>
                        {hasNotes&&<span style={{fontSize:"0.75rem"}}>{"📝"}</span>}
                        <span style={{color:pal.slate,fontSize:"0.9rem",transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"›"}</span>
                      </div>
                    </button>
                    {isOpen&&(
                      <div style={{borderTop:`1px solid ${pal.stone}20`}}>
                        {hasNotes ? family.children.map(c=>{
                          const note = log.notes?.[c.id]||"";
                          if(!note.trim()) return null;
                          return (
                            <div key={c.id} style={{display:"flex",gap:"0.55rem",alignItems:"flex-start",padding:"0.55rem 0.9rem",borderTop:`1px solid ${pal.stone}12`}}>
                              <span style={{fontSize:"1rem",flexShrink:0,marginTop:"1px"}}>{c.avatar}</span>
                              <div>
                                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",marginBottom:"2px"}}>{c.name}</div>
                                <div style={{fontSize:"0.76rem",color:pal.ink,lineHeight:1.55}}>{note}</div>
                              </div>
                            </div>
                          );
                        }) : (
                          <div style={{padding:"0.55rem 0.9rem",fontSize:"0.74rem",color:pal.slate,fontStyle:"italic"}}>No notes recorded for this session.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div style={{height:"0.5rem"}}/>
      </div>)} {/* end history tab */}
      </div> {/* end outer padding div */}
      {showQL&&<CoopQuickLogModal pal={pal} family={family} onSave={saveLog} onClose={()=>setShowQL(false)}/>}
    </div>
  );
}
/* =======================================
   LIFE READY SCREEN
   Full dedicated page for the subject
======================================= */

function LifeReadyScreen({pal,family,onBack}){
  const [tab,      setTab]      = useState("this_week");
  const [generating,setGenerating]=useState(false);
  const [lesson,   setLesson]   = useState(null);
  const [error,    setError]    = useState(null);
  const [openDisc,    setOpenDisc]    = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [showNext,    setShowNext]    = useState(false);
  const scrollRef = React.useRef(null);
  React.useEffect(()=>{
    if(scrollRef.current) scrollRef.current.scrollTop=0;
  },[tab]);
  React.useEffect(()=>{
    if(scrollRef.current) scrollRef.current.scrollTop=0;
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  },[]);

  const grade = family.children?.[0]?.grade||"5th";
  const topic = getLRTopicForWeek(grade);
  const cats  = family.lifeReadyCategories||LR_CATEGORIES.map(c=>c.id);
  const freq  = family.lifeReadyFreq||"monday_plus_practice";
  const LS_KEY = "rootbloom_lr_lesson";

  React.useEffect(()=>{
    try{ const s=localStorage.getItem(LS_KEY); if(s){const p=JSON.parse(s);if(p.topic===topic)setLesson(p);} }catch(e){}
  },[]);

  const generateLesson = async () => {
    setGenerating(true); setError(null);
    const childNames = (family.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ");
    const goals = goalSummary(family);
    const lifeGoals = (family.goals||[]).filter(id=>["life","nature","independence","cooking","homestead","service"].includes(id));
    const lifeGoalLabels = lifeGoals.map(id=>{
      const g = GOALS.find(x=>x.id===id);
      return g?g.label:id;
    }).join(", ");
    const prompt = "Create an age-appropriate Life Ready lesson plan for homeschool students."
      + " Topic: "+topic+". Students: "+childNames+"."
      + (lifeGoalLabels?" This family especially values: "+lifeGoalLabels+" — let these shape your examples and framing where natural.":"")
      + " Format: 1) Opening hook (1-2 sentences to grab attention), "
      + "2) What you need (materials list, simple), "
      + "3) The lesson (3-5 clear steps, hands-on), "
      + "4) Discussion questions (2-3 age-appropriate), "
      + "5) Practice challenge (one thing to try this week)."
      + " Keep total under 300 words. Practical, engaging, no fluff.";
    try {
      const text = await callClaude(prompt);
      const data = {topic, text, grade, date:new Date().toISOString()};
      setLesson(data);
      try{localStorage.setItem(LS_KEY,JSON.stringify(data));}catch(e){}
    } catch(e){
      const msg = e.message==="NO_KEY"?"Add your API key in Settings → AI to generate lessons."
        :e.message==="RATE_LIMIT"?"Monthly AI limit reached."
        :"Could not connect. Try again.";
      setError(msg);
    }
    setGenerating(false);
  };

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s ease"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(160deg,${LR_COLOR},${LR_COLOR2})`,padding:"1rem 1.1rem 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.85rem"}}>
          <button onClick={onBack} style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{"<"[0]}</button>
          <span style={{fontWeight:"900",color:"#fff",fontSize:"1.15rem"}}>{LR_ICON} Prepared {"&"} Capable</span>
        </div>
        <div style={{display:"flex",gap:"2px",overflowX:"auto",paddingBottom:"0"}}>
          {[["this_week","This Week"],["topics","Topics"],["settings","Settings"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"0.45rem 0.85rem",border:"none",borderRadius:"10px 10px 0 0",background:tab===id?"rgba(255,255,255,0.18)":"transparent",color:tab===id?"#fff":"rgba(255,255,255,0.5)",fontSize:"0.74rem",fontWeight:tab===id?"700":"400",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"1.1rem"}}>

        {/* ====== THIS WEEK TAB ====== */}
        {tab==="this_week" && (<>
          {/* Topic card */}
          {(()=>{
            const weekNum = getLRWeekNumber(grade);
            const totalWeeks = (LR_WEEKLY_TOPICS[grade]||LR_WEEKLY_TOPICS["5th"]).length;
            const pct = Math.round((weekNum/totalWeeks)*100);
            return (
              <div style={{background:`linear-gradient(135deg,${LR_COLOR},${LR_COLOR2})`,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.2rem"}}>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:"700"}}>Week {weekNum} of {totalWeeks}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.6)",fontWeight:"700"}}>{grade}</div>
                  </div>
                  <div style={{fontWeight:"900",color:"#fff",fontSize:"1.05rem",marginBottom:"0.4rem"}}>{topic}</div>
                  <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.2)",overflow:"hidden",marginBottom:"0.35rem"}}>
                    <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:"rgba(255,255,255,0.7)"}}/>
                  </div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.65)"}}>
                    {freq==="monday_plus_practice"?"Monday lesson + Tue-Thu practice":freq==="monday_only"?"Monday lesson only":"Flexible schedule"}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Pre-written Lesson Plan */}
          {(()=>{
            const plan = getLessonPlan(topic, grade);
            return (
              <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",marginBottom:"1rem"}}>

                {/* Hook */}
                <div style={{background:`linear-gradient(135deg,${LR_COLOR}15,${LR_COLOR2}08)`,borderRadius:"14px",padding:"0.9rem 1rem",border:`1.5px solid ${LR_COLOR}30`}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"800",color:LR_COLOR,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>🔥 Opening Hook</div>
                  <div style={{fontSize:"0.84rem",color:pal.ink,lineHeight:1.65,fontStyle:"italic"}}>{plan.hook}</div>
                </div>

                {/* Materials */}
                <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",border:"1.5px solid #e8e8e8"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.45rem"}}>📋 What You Need</div>
                  {plan.materials.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",fontSize:"0.8rem",color:pal.inkM,marginBottom:"0.3rem"}}>
                      <span style={{color:LR_COLOR,flexShrink:0,marginTop:"1px"}}>•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",border:"1.5px solid #e8e8e8"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.55rem"}}>📚 The Lesson</div>
                  {plan.steps.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.65rem",alignItems:"flex-start",marginBottom:"0.65rem"}}>
                      <div style={{width:"22px",height:"22px",borderRadius:"50%",background:`linear-gradient(135deg,${LR_COLOR},${LR_COLOR2})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"1px"}}>
                        <span style={{fontSize:"0.62rem",fontWeight:"900",color:"#fff"}}>{i+1}</span>
                      </div>
                      <div style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.65,flex:1}}>{s}</div>
                    </div>
                  ))}
                </div>

                {/* Discussion */}
                <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",border:"1.5px solid #e8e8e8"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.55rem"}}>💬 Discussion Questions</div>
                  {plan.discussion.map((item,i)=>{
                    const open = !!openDisc[i];
                    const q = typeof item==="string" ? item : item.q;
                    const answers = typeof item==="string" ? [] : (item.answers||[]);
                    return (
                      <div key={i} style={{marginBottom:"0.65rem"}}>
                        <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",fontSize:"0.8rem",color:pal.inkM,lineHeight:1.6}}>
                          <span style={{color:LR_COLOR,fontWeight:"900",flexShrink:0,marginTop:"1px"}}>Q{i+1}</span>
                          <span style={{flex:1}}>{q}</span>
                        </div>
                        {answers.length>0&&(
                          <div style={{marginLeft:"1.4rem",marginTop:"0.3rem"}}>
                            <button onClick={()=>setOpenDisc(d=>({...d,[i]:!d[i]}))}
                              style={{fontSize:"0.65rem",color:LR_COLOR,fontWeight:"700",background:"transparent",border:`1px solid ${LR_COLOR}40`,borderRadius:"20px",padding:"0.12rem 0.6rem",cursor:"pointer"}}>
                              {open?"▲ Hide ideas":"▼ Example answers"}
                            </button>
                            {open&&(
                              <div style={{marginTop:"0.4rem",display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                                {answers.map((a,j)=>(
                                  <div key={j} style={{display:"flex",gap:"0.4rem",alignItems:"flex-start",fontSize:"0.75rem",color:pal.slate,lineHeight:1.55}}>
                                    <span style={{color:LR_COLOR,flexShrink:0,marginTop:"1px"}}>•</span>
                                    <span>{a}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Practice challenge */}
                <div style={{background:`linear-gradient(135deg,${LR_COLOR},${LR_COLOR2})`,borderRadius:"14px",padding:"0.9rem 1rem"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"800",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>🎯 Practice Challenge</div>
                  <div style={{fontSize:"0.82rem",color:"#fff",lineHeight:1.65}}>{plan.challenge}</div>
                </div>

              </div>
            );
          })()}
          {/* Week schedule — each day is expandable, plus next week preview */}
          {(()=>{
            const nextWeekTopic = getLRTopicForWeek(grade, 1);
            const nextWeekNum   = getLRWeekNumber(grade) + 1;

            const plan = getLessonPlan(topic, grade);
            const tierKey = ["Pre-K","K","1st","2nd"].includes(grade)?"low":["9th","10th","11th","12th"].includes(grade)?"high":"mid";
            const dayDetails = {
              "Monday": {
                duration: "30 minutes",
                what: "Full lesson",
                how: "Read through the lesson plan together, work through the steps, and discuss the questions. This is your main learning time for the week."
              },
              "Tuesday": {
                duration: "10 minutes",
                what: plan.tuesday ? plan.tuesday[tierKey].title : "Quick practice",
                how:  plan.tuesday ? plan.tuesday[tierKey].activity : "Revisit one step from Monday. Can your child explain it back in their own words?"
              },
              "Wednesday": {
                duration: "10 minutes",
                what: plan.wednesday ? plan.wednesday[tierKey].title : "Practice challenge",
                how:  plan.wednesday ? plan.wednesday[tierKey].activity : "Work on the hands-on challenge from the lesson."
              },
              "Thursday": {
                duration: "10 minutes",
                what: plan.thursday ? plan.thursday[tierKey].title : "Quick review",
                how:  plan.thursday ? plan.thursday[tierKey].activity : "Ask your child two questions from the lesson. Celebrate what they remember."
              }
            };

            const activeDays = freq==="monday_plus_practice"
              ? ["Monday","Tuesday","Wednesday","Thursday"]
              : ["Monday"];

            return (
              <div style={{background:pal.linen,borderRadius:"16px",overflow:"hidden",marginBottom:"1rem",border:"1.5px solid #e0e0e0"}}>
                <div style={{padding:"0.8rem 1rem 0.3rem",borderBottom:"1px solid #f0f0f0"}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem"}}>This week plan</div>
                  <div style={{fontSize:"0.62rem",color:pal.slate,marginTop:"1px"}}>Tap a day to see what to expect</div>
                </div>

                {/* Day rows */}
                {["Monday","Tuesday","Wednesday","Thursday"].map((day,i)=>{
                  const active  = activeDays.includes(day);
                  const details = dayDetails[day];
                  const isOpen  = expandedDay===day;
                  const icons   = {Monday:"📚",Tuesday:"🔧",Wednesday:"🎯",Thursday:"📝"};
                  return (
                    <div key={day}>
                      <button onClick={()=>active&&setExpandedDay(isOpen?null:day)}
                        style={{width:"100%",display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.55rem 1rem",background:isOpen?LR_COLOR+"08":"transparent",border:"none",borderTop:"1px solid #f5f5f5",cursor:active?"pointer":"default",textAlign:"left"}}>
                        <div style={{width:"30px",height:"30px",borderRadius:"8px",background:active?LR_COLOR+"20":"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{icons[day]}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"700",color:active?pal.ink:"#bbb",fontSize:"0.8rem"}}>{day}</div>
                          <div style={{fontSize:"0.65rem",color:active?LR_COLOR:"#ccc",fontWeight:active?"600":"400"}}>{active?details.what+" · "+details.duration:"—"}</div>
                        </div>
                        {active&&<span style={{color:pal.slate,fontSize:"0.9rem",transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.18s",flexShrink:0}}>›</span>}
                      </button>
                      {isOpen&&active&&(
                        <div style={{padding:"0.65rem 1rem 0.75rem 3.5rem",background:"#fff",borderTop:"1px solid #f5f5f5"}}>
                          <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.65}}>{details.how}</div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Next week preview */}
                <button onClick={()=>setShowNext(s=>!s)}
                  style={{width:"100%",display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.6rem 1rem",background:showNext?LR_COLOR+"08":"transparent",border:"none",borderTop:"1px solid #ececec",cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:"30px",height:"30px",borderRadius:"8px",background:LR_COLOR+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:"0.58rem",fontWeight:"900",color:LR_COLOR}}>W{nextWeekNum}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.65rem",fontWeight:"700",color:LR_COLOR,textTransform:"uppercase",letterSpacing:"0.05em"}}>Coming up next week</div>
                    <div style={{fontSize:"0.78rem",color:pal.inkM,fontWeight:"600",marginTop:"1px"}}>{nextWeekTopic}</div>
                  </div>
                  <span style={{color:pal.slate,fontSize:"0.9rem",transform:showNext?"rotate(90deg)":"none",transition:"transform 0.18s",flexShrink:0}}>›</span>
                </button>
                {showNext&&(
                  <div style={{padding:"0.65rem 1rem 0.75rem 3.5rem",background:"#fff",borderTop:"1px solid #f5f5f5"}}>
                    <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.65}}>
                      Next week you and your student will explore: <b>{nextWeekTopic}</b>. A full lesson plan will be ready when the week arrives.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

        </>)}

        {/* ====== TOPICS TAB ====== */}
        {tab==="topics" && (<>
          {/* Upcoming 4 weeks — one per child so grades are correct */}
          <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>Upcoming 4 Weeks</div>
          {(()=>{
            const upcoming = getLRUpcomingTopics(grade, 4);
            // Deduplicate — if same topic appears due to wrapping, show distinct
            const seen = new Set();
            const deduped = upcoming.filter(item=>{
              if(seen.has(item.topic)) return false;
              seen.add(item.topic); return true;
            });
            return deduped.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.55rem 0.75rem",background:i===0?LR_COLOR+"18":pal.linen,borderRadius:"11px",marginBottom:"0.35rem",border:`1.5px solid ${i===0?LR_COLOR+"40":"#e8e8e8"}`}}>
                <div style={{width:"28px",height:"28px",borderRadius:"7px",background:i===0?LR_COLOR:pal.parchm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:"0.65rem",fontWeight:"900",color:i===0?"#fff":pal.slate}}>W{item.weekNum}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:i===0?"800":"600",color:i===0?LR_COLOR:pal.inkM,fontSize:"0.82rem"}}>{item.topic}</div>
                  <div style={{fontSize:"0.65rem",color:pal.slate}}>{i===0?"This week":i===1?"Next week":"In "+i+" weeks"}</div>
                </div>
                {i===0&&<span style={{fontSize:"0.7rem",color:LR_COLOR,fontWeight:"800"}}>Now</span>}
              </div>
            ));
          })()}

          {/* Full 36-week list */}
          <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem",marginTop:"1rem"}}>Full year curriculum ({grade})</div>
          <div style={{background:pal.linen,borderRadius:"14px",border:"1.5px solid #e8e8e8",overflow:"hidden",marginBottom:"0.85rem"}}>
            {(LR_WEEKLY_TOPICS[grade]||LR_WEEKLY_TOPICS["5th"]).map((topic,i)=>{
              const current = getLRWeekNumber(grade)-1===i;
              return (
                <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"center",padding:"0.48rem 0.75rem",borderTop:i>0?"1px solid #f5f5f5":"none",background:current?LR_COLOR+"10":"transparent"}}>
                  <span style={{fontSize:"0.6rem",fontWeight:"700",color:current?LR_COLOR:pal.stone,width:"22px",flexShrink:0,textAlign:"center"}}>W{i+1}</span>
                  <span style={{fontSize:"0.78rem",color:current?LR_COLOR:pal.inkM,fontWeight:current?"700":"400",flex:1}}>{topic}</span>
                  {current&&<span style={{fontSize:"0.6rem",color:LR_COLOR,fontWeight:"800",flexShrink:0}}>← Now</span>}
                </div>
              );
            })}
          </div>

          {/* Category cards */}
          <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.74rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.55rem"}}>Focus areas</div>
          {LR_CATEGORIES.filter(c=>cats.includes(c.id)).map((c,i)=>(
            <div key={c.id} style={{background:pal.linen,borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"0.4rem",border:"1.5px solid #e8e8e8",display:"flex",gap:"0.65rem",alignItems:"center"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"10px",background:LR_COLOR+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{c.label}</div>
                <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>{c.desc}</div>
              </div>
            </div>
          ))}
        </>)}

        {/* ====== SETTINGS TAB ====== */}
        {tab==="settings" && (<>
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem",border:"1.5px solid #e8e8e8",marginBottom:"0.85rem"}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.65rem"}}>Current schedule</div>
            {[
              ["monday_plus_practice","Monday lesson + practice Tue-Thu"],
              ["monday_only","Monday lesson only"],
              ["flexible","Flexible — I schedule it"],
            ].map(([id,label])=>(
              <div key={id} style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.42rem 0",borderTop:id!=="monday_plus_practice"?"1px solid #f0f0f0":"none"}}>
                <div style={{width:"14px",height:"14px",borderRadius:"50%",border:`2px solid ${freq===id?LR_COLOR:"#ccc"}`,background:freq===id?LR_COLOR:"transparent",flexShrink:0}}/>
                <span style={{fontSize:"0.8rem",color:freq===id?LR_COLOR:pal.inkM,fontWeight:freq===id?"700":"400"}}>{label}</span>
              </div>
            ))}
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"0.65rem"}}>{"To change these, go to Settings → School."}</div>
          </div>
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem",border:"1.5px solid #e8e8e8"}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.5rem"}}>Active focus areas ({cats.length})</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.38rem"}}>
              {LR_CATEGORIES.filter(c=>cats.includes(c.id)).map(c=>(
                <span key={c.id} style={{padding:"0.2rem 0.55rem",background:LR_COLOR+"18",borderRadius:"20px",fontSize:"0.72rem",fontWeight:"700",color:LR_COLOR}}>{c.icon} {c.label}</span>
              ))}
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}

/* =======================================
   PROGRESS SCREEN
   Weekly pulse · Subject timelines · Milestones · AI check-in
======================================= */

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
      const d1 = new Date(dateStr+", "+yr);
      const d2 = new Date(dateStr+", "+(yr-1));
      const d = d1 <= today ? d1 : d2;
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

  const last7Weeks = Array.from({length:7},(_,i)=>{
    const ws = new Date(weekStart); ws.setDate(weekStart.getDate() - i*7);
    const we = new Date(ws); we.setDate(ws.getDate()+6);
    const label = i===0?"Now":"-"+i+"w";
    return {start:ws, end:we, label};
  }).reverse();
  const subjStats = allSubjs.map(s=>{
    const all    = childEntries.filter(e=>e.subj===s.label);
    const week   = all.filter(e=>isThisWeek(e.date));
    const recent = all[0]||null;
    const notes  = all.filter(e=>e.note&&e.note.trim().length>10);
    const weekDots = last7Weeks.map(({start,end})=>{
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
          const d1=new Date(e.date+", "+yr);
          const d=d1<=today?d1:new Date(e.date+", "+(yr-1));
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
      + "For each child, write FOUR clearly labeled sections:\n"
      + "STRENGTHS: Name 2-3 specific subjects where this child is excelling or showing strong engagement. "
      + "Base this on: high note frequency, milestone tags [MILESTONE], positive language in notes, or depth of detail. "
      + "Quote or paraphrase specific moments from the notes.\n"
      + "GROWTH AREAS: Name 1-2 subjects that appear light (few or no entries), show struggle signals in the note language, "
      + "or haven\u2019t been logged recently. Be gentle and constructive \u2014 frame as opportunity, not failure.\n"
      + "NEXT STEPS: Give 2-3 specific, concrete, actionable suggestions for what to do next week. "
      + "Each suggestion must start with a verb and reference an actual subject or moment from the notes. "
      + "Examples: 'Try a hands-on experiment to follow up on the volcano unit.' or 'Spend 10 minutes reviewing the multiplication facts that came up as tricky.' "
      + "These should feel like advice from a coach who just read the notes, not generic tips.\n"
      + "OVERALL: 1-2 warm sentences capturing the child\u2019s learning story this period. Reference something specific.\n\n"
      + "Rules: Plain text only. No markdown, no bullet points, no asterisks. "
      + "Label each section exactly as: STRENGTHS: / GROWTH AREAS: / NEXT STEPS: / OVERALL: "
      + "Be specific \u2014 mention actual subjects and real moments from the notes. "
      + "Keep each child\u2019s summary under 200 words.\n\n"
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
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div style={{padding:"0 1rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",gap:"0.4rem"}}>
          {[["pulse","📊 Insights"],["timeline","📖 Timeline"],["milestones","🌟 Milestones"],["skills","✅ Skills"],["grades","🏆 Grades"]].map(([id,label])=>(
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
                try{const d1=new Date(e.date+", "+yr);const d=d1<=today?d1:new Date(e.date+", "+(yr-1));return d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();}catch(ex){return false;}
              })
            : childEntries;
          const rangeSubjs = [...new Set(rangeEntries.map(e=>e.subj))];
          const rangeNotes = rangeEntries.filter(e=>e.note&&e.note.trim()).length;

          // Subject bar graph
          const subjCounts = {};
          rangeEntries.filter(e=>e.subj&&e.subj!=="Daily Note"&&e.subj!=="Daily Check-In"&&!e.isDay).forEach(e=>{ subjCounts[e.subj]=(subjCounts[e.subj]||0)+1; });
          const subjBars = Object.entries(subjCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);
          const maxCount = subjBars[0]?.[1]||1;

          // Needs Attention: subjects with 0 entries in last 7 days (must have at least 1 entry ever)
          const _naCreatedAt = family.createdAt ? new Date(family.createdAt) : null;
          const _naDaysSince = _naCreatedAt ? Math.floor((today - _naCreatedAt)/(24*60*60*1000)) : 999;
          const needsAttention = _naDaysSince >= 7 ? allSubjs.filter(s => {
            const all = childEntries.filter(e=>e.subj===s.label);
            if(all.length === 0) return false; // never logged -- skip
            const last = all[0]; // entries are newest-first
            try {
              const d = new Date(last.date+", "+yr);
              const daysSince = Math.floor((today - d)/(24*60*60*1000));
              return daysSince >= 7;
            } catch(ex) { return false; }
          }) : [];

          return (
            <div>
              {/* Needs Attention card */}
              {needsAttention.length>0&&(
                <div style={{background:"#fff8ed",borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:"2px solid #f5c84250"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"}}>
                    <span style={{fontSize:"1rem"}}>{"⚠️"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"800",color:"#b07800",fontSize:"0.82rem"}}>{"Needs attention — "+ch?.name}</div>
                      <div style={{fontSize:"0.68rem",color:"#a06000",marginTop:"1px"}}>{"No entries in the last 7+ days"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    {needsAttention.map(s=>{
                      const last = childEntries.filter(e=>e.subj===s.label)[0];
                      let daysAgo = null;
                      try { daysAgo = Math.floor((today - new Date(last.date+", "+yr))/(24*60*60*1000)); } catch(ex){}
                      return (
                        <button key={s.id} onClick={()=>{setActiveTab("timeline");setTimelineSubj(s.label);}}
                          style={{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.3rem 0.65rem",background:"#fff",borderRadius:"20px",border:"1.5px solid #f5c84260",cursor:"pointer"}}>
                          <span style={{fontSize:"0.85rem"}}>{s.icon}</span>
                          <span style={{fontSize:"0.73rem",fontWeight:"700",color:"#7a5500"}}>{s.label}</span>
                          {daysAgo!==null&&<span style={{fontSize:"0.62rem",color:"#b07800",fontWeight:"600"}}>{daysAgo+"d"}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{fontSize:"0.63rem",color:"#a06000",marginTop:"0.55rem",fontStyle:"italic"}}>{"Tap a subject to see its timeline."}</div>
                </div>
              )}
              {/* Subject activity bar graph */}
              {subjBars.length>0&&(
                <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}25`}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.82rem",marginBottom:"0.75rem"}}>{"📊 Subject Activity — "+rangeLabel}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                    {subjBars.map(([subj,count])=>{
                      const so=[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(s=>s.label===subj);
                      const pct=Math.round((count/maxCount)*100);
                      return (
                        <div key={subj}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"2px"}}>
                            <span style={{fontSize:"0.85rem",width:"20px",textAlign:"center",flexShrink:0}}>{so?.icon||"📋"}</span>
                            <span style={{fontSize:"0.74rem",fontWeight:"600",color:pal.inkM,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subj}</span>
                            <span style={{fontSize:"0.7rem",fontWeight:"800",color:pal.primary,flexShrink:0}}>{count}</span>
                          </div>
                          <div style={{height:"6px",background:pal.parchm,borderRadius:"99px",overflow:"hidden"}}>
                            <div style={{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,borderRadius:"99px",transition:"width 0.4s ease"}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
                    {key:"strengths",  label:"Strengths",    icon:"\u2b50", color:pal.good,    bg:pal.goodBg,  border:pal.good+"40"},
                    {key:"growth",     label:"Growth Areas", icon:"\U0001f331", color:"#b07800", bg:"#fff8e6",   border:"#f5c84240"},
                    {key:"nextsteps",  label:"Next Steps",   icon:"\uD83D\uDCCB", color:"#1a5fa8", bg:"#eef4ff",  border:"#2563a830"},
                    {key:"overall",    label:"Overall",      icon:"\u2728",  color:pal.primary, bg:pal.pale,   border:pal.primary+"30"},
                  ];
                  const upper = text.toUpperCase();
                  patterns.forEach(p => {
                    const marker = p.key==="growth" ? "GROWTH AREAS:" : p.key==="nextsteps" ? "NEXT STEPS:" : p.key.toUpperCase()+":";
                    const idx = upper.indexOf(marker);
                    if(idx===-1) return;
                    const start = idx + marker.length;
                    const nextIdxs = patterns
                      .filter(pp=>pp.key!==p.key)
                      .map(pp=>{ const m=pp.key==="growth"?"GROWTH AREAS:":pp.key==="nextsteps"?"NEXT STEPS:":pp.key.toUpperCase()+":"; return upper.indexOf(m, start); })
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
                  style={{width:"100%",display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.75rem 1rem",border:"2px solid "+pal.primary+"30",borderRadius:"13px",background:"linear-gradient(135deg,"+pal.primary+"10,"+pal.accent+"08)",cursor:"pointer",textAlign:"left",marginBottom:"0.5rem"}}>
                  <span style={{fontSize:"1.3rem",flexShrink:0}}>{"\uD83D\uDCCB"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>{"Weekly Digest"}</div>
                    <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Full week summary \u2014 attendance, quiz scores, milestones \u00b7 printable"}</div>
                  </div>
                  <span style={{color:pal.primary,fontSize:"0.85rem",flexShrink:0}}>{"\u203a"}</span>
                </button>
              )}

              {/* Print Progress Report button */}
              <button onClick={()=>printProgressReport(family, portfolioEntries.filter(e=>e.childIdx===selectedChild), ch, attendanceDays, GOALS)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.75rem 1rem",border:"2px solid #2a4a2830",borderRadius:"13px",background:"linear-gradient(135deg,#2a4a2810,#2a4a2806)",cursor:"pointer",textAlign:"left",marginBottom:"1rem"}}>
                <span style={{fontSize:"1.3rem",flexShrink:0}}>{"\uD83D\uDDA8\uFE0F"}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"700",color:"#2a4a28",fontSize:"0.82rem"}}>{"Print Progress Report"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Attendance, subjects, milestones, goals \u00b7 evaluator-ready PDF"}</div>
                </div>
                <span style={{color:"#2a4a28",fontSize:"0.85rem",flexShrink:0}}>{"\u203a"}</span>
              </button>

              {/* Attendance + year progress card */}
              {(()=>{
                const goalDays = family.dailyHoursGoal ? 180 : 180; // default 180
                const pct = Math.min(100, Math.round((attendanceDays/goalDays)*100));
                const yearStart = family.yearStart ? new Date(family.yearStart) : null;
                const yearEndD  = family.yearEnd   ? new Date(family.yearEnd)   : null;
                let daysLeft = null;
                if(yearEndD){ const ms = yearEndD - today; daysLeft = ms>0 ? Math.ceil(ms/(24*60*60*1000)) : 0; }
                const barColor = pct>=80?pal.good:pct>=50?cp.c1:"#e8a020";
                return (
                  <div style={{background:pal.linen,borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:"1.5px solid "+pal.stone+"25"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.55rem"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.45rem"}}>
                        <span style={{fontSize:"1rem"}}>{"📅"}</span>
                        <div>
                          <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.82rem"}}>{"Attendance"}</div>
                          {daysLeft!==null&&<div style={{fontSize:"0.63rem",color:pal.slate,marginTop:"1px"}}>{daysLeft===0?"Year complete!":daysLeft+" days left in year"}</div>}
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:"900",color:barColor,fontSize:"1.1rem",lineHeight:1}}>{attendanceDays}</div>
                        <div style={{fontSize:"0.6rem",color:pal.stone,marginTop:"1px"}}>{"of "+goalDays+" days"}</div>
                      </div>
                    </div>
                    <div style={{height:"10px",background:pal.stone+"20",borderRadius:"99px",overflow:"hidden"}}> 
                      <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+barColor+","+barColor+"cc)",borderRadius:"99px",transition:"width 0.5s ease"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
                      <span style={{fontSize:"0.6rem",color:pal.stone}}>{pct+"%"+" complete"}</span>
                      {goalDays-attendanceDays>0&&<span style={{fontSize:"0.6rem",color:pal.slate}}>{(goalDays-attendanceDays)+" days to goal"}</span>}
                    </div>
                  </div>
                );
              })()}
              {/* Goal Connection card */}
              {(()=>{
                const allGoalObjs = [...GOALS,...(family.customGoals||[])];
                const activeGoals = (family.goals||[]).map(id=>allGoalObjs.find(x=>x.id===id)).filter(Boolean);
                if(activeGoals.length===0) return null;
                const goalData = activeGoals.map(g=>{
                  const nudge = GOAL_NUDGES[g.id];
                  const relSubjs = nudge?.subjs||[];
                  const relEntries = relSubjs.length>0
                    ? childEntries.filter(e=>relSubjs.some(s=>e.subj===s||e.subj.includes(s.split(" ")[0])))
                    : childEntries.filter(e=>e.goalId===g.id);
                  const thisWeekCount = relEntries.filter(e=>isThisWeek(e.date)).length;
                  const totalCount = relEntries.length;
                  const lastEntry = relEntries[0]||null;
                  let daysSince = null;
                  if(lastEntry){ try{ daysSince=Math.floor((today-new Date(lastEntry.date+", "+yr))/(24*60*60*1000)); }catch(ex){} }
                  const active = totalCount>0 && (daysSince===null||daysSince<=14);
                  return {g, nudge, totalCount, thisWeekCount, daysSince, active, relSubjs};
                });
                const activeCount = goalData.filter(d=>d.active).length;
                return (
                  <div style={{background:pal.linen,borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:"1.5px solid "+pal.stone+"25"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.65rem"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.45rem"}}>
                        <span style={{fontSize:"1rem"}}>{"🎯"}</span>
                        <div>
                          <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.82rem"}}>{"Learning Goals"}</div>
                          <div style={{fontSize:"0.63rem",color:pal.slate,marginTop:"1px"}}>{activeCount+" of "+goalData.length+" actively worked on"}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                      {goalData.map(({g,nudge,totalCount,thisWeekCount,daysSince,active,relSubjs})=>(
                        <div key={g.id} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.45rem 0.65rem",borderRadius:"10px",background:active?pal.goodBg:"transparent",border:"1.5px solid "+(active?pal.good+"40":pal.stone+"25")}}>
                          <span style={{fontSize:"1rem",flexShrink:0}}>{nudge?.icon||g.icon}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:"700",color:active?pal.good:pal.inkM,fontSize:"0.78rem"}}>{g.label}</div>
                            {relSubjs.length>0&&(
                              <div style={{fontSize:"0.62rem",color:pal.stone,marginTop:"1px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{relSubjs.slice(0,3).join(", ")+(relSubjs.length>3?" +more":"")}</div>
                            )}
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            {totalCount>0?(
                              <div>
                                <div style={{fontWeight:"800",color:active?pal.good:pal.slate,fontSize:"0.82rem"}}>{totalCount}</div>
                                <div style={{fontSize:"0.58rem",color:pal.stone}}>{thisWeekCount>0?thisWeekCount+" this wk":daysSince!==null?daysSince+"d ago":"entries"}</div>
                              </div>
                            ):(
                              <div style={{fontSize:"0.65rem",color:pal.stone,fontStyle:"italic"}}>{"not started"}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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
                      <div style={{marginTop:"5px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"2px"}}>
                          {(s.weekDots||[]).map((hit,di)=>{
                            const isNow = di===6;
                            return (
                              <div key={di} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
                                <div style={{width:"100%",height:"8px",borderRadius:"3px",background:hit?(isNow?cp.c1:cp.c1+"99"):pal.stone+"28",border:"1px solid "+(hit?(isNow?cp.c1:cp.c1+"60"):pal.stone+"20"),transition:"background 0.2s"}}/>
                                <span style={{fontSize:"0.44rem",color:isNow?(hit?cp.c1:pal.slate):pal.stone+"80",fontWeight:isNow?"800":"400",lineHeight:1}}>{last7Weeks[di]?.label||""}</span>
                              </div>
                            );
                          })}
                        </div>
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
        {activeTab==="skills"&&<SkillsTab pal={pal} ch={ch} family={family}/>}
        {activeTab==="grades"&&<GradesTab pal={pal} ch={ch} family={family} childEntries={childEntries}
          cp={cp} gradeStruggle={gradeStruggle} setGradeStruggle={setGradeStruggle}
          gradeStruggleLoading={gradeStruggleLoading} setGradeStruggleLoading={setGradeStruggleLoading}
          gradeStruggleError={gradeStruggleError} setGradeStruggleError={setGradeStruggleError}/>}

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
    const fullName = ch.name+(ch.lastName?" "+ch.lastName:"");

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

    win.document.write(`<!DOCTYPE html><html><head><title>Transcript — ${fullName}</title>
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
        <div class="school-sub">${family.state||""}</div>
      </div>
      <div class="badge">Official Transcript</div>
    </div>

    <div class="section-title">Student Information</div>
    <div class="info-grid">
      <div class="info-cell"><div class="info-label">Student Name</div><div class="info-value">${fullName}</div></div>
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
    setTimeout(()=>win.document.close(),0);
  };

  const printReadingLog = () => {
    const win = window.open("","_blank","width=800,height=900,scrollbars=yes");
    if(!win) return;
    const fullName = ch.name+(ch.lastName?" "+ch.lastName:"");
    const rows = readingEntries.map(function(e,i){
      const bg = i%2===0 ? "#fff" : "#f9f9f9";
      const title = (e.readingTitle||e.title||"").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const subj  = (e.subj||"").replace(/</g,"&lt;");
      const date  = (e.date||"");
      return "<tr style=\"background:"+bg+"\">"        +"<td style=\"padding:0.45rem 0.65rem;border-bottom:1px solid #eee;font-weight:700;font-size:0.9rem\">"+title+"</td>"        +"<td style=\"padding:0.45rem 0.65rem;border-bottom:1px solid #eee;color:#555;font-size:0.82rem\">"+subj+"</td>"        +"<td style=\"padding:0.45rem 0.65rem;border-bottom:1px solid #eee;color:#888;font-size:0.82rem;white-space:nowrap\">"+date+"</td>"        +"</tr>";
    }).join("");
    const sn = schoolName;
    const today = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">"
      + "<title>Reading Log — "+fullName+"</title>"
      + "<style>"
      + "*{box-sizing:border-box;margin:0;padding:0}"
      + "body{font-family:Georgia,serif;color:#1a1a1a;background:#fff;padding:2.5rem;max-width:720px;margin:0 auto;font-size:10pt;line-height:1.5}"
      + ".hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:1rem;border-bottom:3px solid #2a6a2a;margin-bottom:1.5rem}"
      + ".sn{font-size:1.3rem;font-weight:900;color:#2a6a2a}"
      + ".sub{font-size:0.8rem;color:#666;margin-top:3px}"
      + ".badge{background:#2a6a2a;color:#fff;padding:0.3rem 0.75rem;border-radius:20px;font-size:0.75rem;font-weight:700}"
      + ".ig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1.5rem}"
      + ".ic{padding:0.45rem 0.65rem;background:#f8f8f8;border-radius:6px;border-left:3px solid #2a6a2a}"
      + ".il{font-size:0.62rem;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;font-family:Arial,sans-serif}"
      + ".iv{font-weight:700;font-size:0.88rem;color:#1a1a1a}"
      + "table{width:100%;border-collapse:collapse}"
      + "th{padding:0.45rem 0.65rem;text-align:left;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.05em;color:#555;font-family:Arial,sans-serif;font-weight:700;background:#f5f5f5}"
      + "td{border:none}"
      + ".footer{margin-top:2rem;padding-top:0.75rem;border-top:1px solid #eee;font-size:0.68rem;color:#aaa;text-align:center;font-family:Arial,sans-serif}"
      + ".pbtn{margin-top:1.5rem;padding:0.6rem 1.5rem;background:#2a6a2a;color:#fff;border:none;border-radius:8px;font-size:0.95rem;cursor:pointer;font-family:Arial,sans-serif;font-weight:700}"
      + "@media print{.pbtn{display:none}}"
      + "</style></head><body>"
      + "<div class=\"hdr\"><div><div class=\"sn\">"+sn+"</div>"
      + "<div class=\"sub\">"+(family.state||"")+"</div></div>"
      + "<div class=\"badge\">Reading Log</div></div>"
      + "<div class=\"ig\">"
      + "<div class=\"ic\"><div class=\"il\">Student</div><div class=\"iv\">"+fullName+"</div></div>"
      + "<div class=\"ic\"><div class=\"il\">Grade</div><div class=\"iv\">"+ch.grade+"</div></div>"
      + "<div class=\"ic\"><div class=\"il\">Titles Logged</div><div class=\"iv\">"+readingEntries.length+"</div></div>"
      + "</div>"
      + "<table><thead><tr><th>Title / Material</th><th>Subject</th><th>Date</th></tr></thead>"
      + "<tbody>"+(rows||"<tr><td colspan=\"3\" style=\"text-align:center;color:#999;padding:1rem\">No reading entries.</td></tr>")+"</tbody></table>"
      + "<div class=\"footer\">Generated by Root &amp; Bloom · "+today+"</div>"
      + "<button class=\"pbtn\" onclick=\"window.print()\">Print / Save as PDF</button>"
      + "</body></html>";
    win.document.write(html);
    setTimeout(()=>win.document.close(),0);
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
          {[["overview","📋","Overview"],["transcript","📜","Transcript"],["reading","📖","Reading Log"],["narrative","📝","Narrative"]].map(([id,icon,l])=>(
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
          <button onClick={()=>setShowDigest(true)}
            style={{width:"100%",padding:"0.75rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer",marginBottom:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
            <span>{"📋"}</span><span>{"Weekly Digest"}</span>
          </button>
          <div style={{height:"0.5rem"}}/>
        </>)}

        {/* ====== TRANSCRIPT VIEW ====== */}
        {activeView==="transcript"&&(<>
          <div style={{background:pal.linen,borderRadius:"18px",padding:"1.2rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}}>

            {/* Header */}
            <div style={{borderBottom:`2px solid ${cp.c1}40`,paddingBottom:"0.85rem",marginBottom:"0.9rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontWeight:"900",color:cp.c1,fontSize:"1rem"}}>{schoolName}</div>
                <div style={{fontSize:"0.7rem",color:pal.slate}}>{family.state}</div>
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
              <button onClick={printReadingLog}
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
    try{ const d1=new Date(dateStr+", "+yr); const d2=new Date(dateStr+", "+(yr-1)); const d=d1<=today?d1:d2; return d>=weekStart&&d<=weekEnd; }catch(e){return false;}
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
    const sn = family.schoolName||(family.familyName+" Academy")||"Home School";
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

function GoalsScreen({pal,family,portfolioEntries=[],onUpdateFamily,onAddEntry,onTabChange}){
  const [editing,     setEditing]     = React.useState(false);
  const [draftGoals,  setDraftGoals]  = React.useState(family.goals||[]);
  const [customInput, setCustomInput] = React.useState("");
  const [logOpen,     setLogOpen]     = React.useState(null); // goalId being logged
  const [logNote,     setLogNote]     = React.useState("");
  const [aiOpen,      setAiOpen]      = React.useState(false);
  const [aiLoading,   setAiLoading]   = React.useState(false);
  const [aiSuggs,     setAiSuggs]     = React.useState([]);
  const [aiError,     setAiError]     = React.useState("");

  const allGoalObjs = [...GOALS,...(family.customGoals||[])];
  const activeGoals = (family.goals||[]).map(id=>allGoalObjs.find(x=>x.id===id)).filter(Boolean);

  const todayStr = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

  // Per-goal entry counts and last-logged date
  const goalStats = (g) => {
    const nudge = GOAL_NUDGES[g.id];
    const relSubjs = nudge?.subjs||[];
    const related = relSubjs.length>0
      ? portfolioEntries.filter(e=>relSubjs.includes(e.subj)||e.goalId===g.id)
      : portfolioEntries.filter(e=>e.goalId===g.id);
    const count = related.length;
    const now = new Date(); now.setHours(0,0,0,0);
    const yr = now.getFullYear();
    const last = related.length>0
      ? related.reduce((a,b)=>{
          const da1=new Date(a.date+", "+yr); const da=da1<=now?da1:new Date(a.date+", "+(yr-1));
          const db1=new Date(b.date+", "+yr); const db=db1<=now?db1:new Date(b.date+", "+(yr-1));
          return da>db?a:b;
        })
      : null;
    const daysSince = last ? (() => {
      const d1=new Date(last.date+", "+yr); const d=d1<=now?d1:new Date(last.date+", "+(yr-1));
      return Math.floor((now-d)/(24*60*60*1000));
    })() : null;
    const tone = daysSince===null?"quiet":daysSince<=3?"good":daysSince<=10?"gentle":"quiet";
    return {count, last, daysSince, tone, nudge};
  };

  const saveGoals = () => {
    onUpdateFamily&&onUpdateFamily({goals:draftGoals});
    setEditing(false);
  };

  const toggleDraft = (id) => {
    setDraftGoals(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
  };

  const addCustomGoal = () => {
    const val = customInput.trim();
    if(!val) return;
    const id = "custom_goal_"+Date.now();
    const newGoal = {id, label:val, icon:"\uD83C\uDF1F", isCustom:true};
    const updated = [...(family.customGoals||[]), newGoal];
    onUpdateFamily&&onUpdateFamily({customGoals:updated, goals:[...(family.goals||[]),id]});
    setDraftGoals(d=>[...d,id]);
    setCustomInput("");
  };

  const removeCustom = (id) => {
    onUpdateFamily&&onUpdateFamily({
      customGoals:(family.customGoals||[]).filter(g=>g.id!==id),
      goals:(family.goals||[]).filter(g=>g!==id)
    });
    setDraftGoals(d=>d.filter(x=>x!==id));
  };

  const saveLog = (goalId) => {
    if(!logNote.trim()) return;
    const g = allGoalObjs.find(x=>x.id===goalId);
    if(!g) return;
    const entry = {
      id:"g_"+Date.now(), subj:g.label, date:todayStr,
      note:logNote.trim(), thumb:g.icon||"\uD83C\uDF1F",
      goalId, isGoalLog:true,
    };
    onAddEntry&&onAddEntry(entry);
    setLogNote("");
    setLogOpen(null);
  };

  const fetchAiSuggs = async () => {
    setAiOpen(true); setAiLoading(true); setAiError(""); setAiSuggs([]);
    try {
      const suggestions = await getGoalSuggestions(family);
      setAiSuggs(suggestions);
    } catch(e) {
      setAiError(e.message==="NO_KEY"
        ? "Add your API key in Settings \u2192 AI to use this feature."
        : "Couldn\u2019t generate suggestions. Try again.");
    } finally { setAiLoading(false); }
  };

  const addAiGoal = (label) => {
    const existing = family.customGoals||[];
    if(existing.find(g=>g.label===label)) return;
    const id = "ai_goal_"+Date.now()+"_"+Math.random().toString(36).slice(2,5);
    const newGoal = {id, label, icon:"\u2728", isCustom:true};
    onUpdateFamily&&onUpdateFamily({
      customGoals:[...existing, newGoal],
      goals:[...(family.goals||[]), id]
    });
  };

  // ── EDIT MODE ──────────────────────────────────────────────
  if(editing) return (
    <div style={{minHeight:"100%",background:pal.sand,paddingBottom:"5rem"}}>
      <div style={{background:pal.heroGrad,padding:"1rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:"900",color:"#fff",fontSize:"1rem"}}>{"Edit Goals"}</div>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <button onClick={()=>{setDraftGoals(family.goals||[]);setEditing(false);}}
            style={{padding:"0.3rem 0.75rem",border:"2px solid rgba(255,255,255,0.4)",borderRadius:"9px",background:"transparent",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>Cancel</button>
          <button onClick={saveGoals}
            style={{padding:"0.3rem 0.75rem",border:"none",borderRadius:"9px",background:"rgba(255,255,255,0.2)",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>Save</button>
        </div>
      </div>
      <div style={{padding:"1rem 1.1rem"}}>
        <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.85rem",lineHeight:1.6}}>{"Tap to select or deselect goals. These help track what matters most this year."}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.45rem",marginBottom:"1rem"}}>
          {[...GOALS,...(family.customGoals||[])].map(g=>{
            const sel=draftGoals.includes(g.id);
            const isCustom=g.isCustom||g.id.startsWith("custom_")||g.id.startsWith("ai_");
            return (
              <button key={g.id} onClick={()=>toggleDraft(g.id)}
                style={{padding:"0.75rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",transition:"all 0.13s",position:"relative"}}>
                <span style={{fontSize:"1.4rem"}}>{g.icon||"\uD83C\uDF1F"}</span>
                <span style={{fontSize:"0.72rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM,lineHeight:1.25}}>{g.label}</span>
                {sel&&<span style={{position:"absolute",top:"5px",right:"7px",color:pal.primary,fontSize:"0.65rem",fontWeight:"900"}}>{"\u2713"}</span>}
                {isCustom&&<span onClick={e=>{e.stopPropagation();removeCustom(g.id);}} style={{position:"absolute",top:"4px",left:"6px",fontSize:"0.6rem",color:pal.bad,fontWeight:"900",cursor:"pointer"}}>{"\u2715"}</span>}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
          <input value={customInput} onChange={e=>setCustomInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addCustomGoal()}
            placeholder={"Add a custom goal..."}
            style={{flex:1,padding:"0.6rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor=pal.primary}
            onBlur={e=>e.target.style.borderColor=pal.stone}/>
          <button onClick={addCustomGoal} disabled={!customInput.trim()}
            style={{padding:"0.6rem 1rem",border:"none",borderRadius:"11px",background:customInput.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:customInput.trim()?"pointer":"default",flexShrink:0}}>
            {"+ Add"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── MAIN VIEW ─────────────────────────────────────────────
  return (
    <div style={{minHeight:"100%",background:pal.sand,paddingBottom:"5rem"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"1rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.1rem"}}>{"\uD83C\uDF1F Goals"}</div>
          <div style={{fontSize:"0.73rem",color:"rgba(255,255,255,0.72)"}}>
            {activeGoals.length>0
              ? activeGoals.length+" active goal"+(activeGoals.length!==1?"s":"")
              : "Set goals to track what matters most"}
          </div>
        </div>
        <div style={{display:"flex",gap:"0.4rem"}}>
          <button onClick={()=>onTabChange&&onTabChange("progress")}
            style={{padding:"0.35rem 0.8rem",border:"2px solid rgba(255,255,255,0.4)",borderRadius:"9px",background:"transparent",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>
            {"Progress →"}
          </button>
          <button onClick={()=>{setDraftGoals(family.goals||[]);setEditing(true);}}
            style={{padding:"0.35rem 0.8rem",border:"2px solid rgba(255,255,255,0.4)",borderRadius:"9px",background:"transparent",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>
            {"Edit"}
          </button>
        </div>
      </div>

      <div style={{padding:"1rem 1.1rem"}}>

        {/* Empty state */}
        {activeGoals.length===0&&(
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1.5rem 1.2rem",textAlign:"center",border:`1.5px solid ${pal.stone}30`,marginBottom:"1rem"}}>
            <div style={{fontSize:"2.2rem",marginBottom:"0.5rem"}}>{"\uD83C\uDF1F"}</div>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.9rem",marginBottom:"0.3rem"}}>{"No goals yet"}</div>
            <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6,marginBottom:"1rem"}}>{"Goals help you track what matters most — faith, reading, nature, life skills, and more."}</div>
            <button onClick={()=>{setDraftGoals([]);setEditing(true);}}
              style={{padding:"0.6rem 1.4rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer"}}>
              {"Set your goals"}
            </button>
          </div>
        )}

        {/* Goal cards */}
        {activeGoals.map(g=>{
          const {count,last,daysSince,tone,nudge} = goalStats(g);
          const isOpen = logOpen===g.id;
          const toneColor = tone==="good"?pal.good:tone==="gentle"?pal.primary:pal.slate;
          const warmthMsg = tone==="good"
            ? (g.label+" is going strong \u2014 great work!")
            : tone==="gentle"
            ? (nudge?.nudge||"Time to revisit "+g.label+" this week.")
            : (nudge?.nudge||"Log something for "+g.label+" to start tracking.");
          return (
            <div key={g.id} style={{background:pal.linen,borderRadius:"16px",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}30`,overflow:"hidden"}}>
              {/* Card header */}
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.85rem 1rem 0.7rem"}}>
                <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${pal.primary}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>
                  {nudge?.icon||g.icon||"\uD83C\uDF1F"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.9rem"}}>{g.label}</div>
                  <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"2px"}}>
                    {count>0
                      ? count+" entr"+(count!==1?"ies":"y")+(last?" \u00b7 last: "+last.date:"")
                      : "No entries yet"}
                  </div>
                </div>
                <button onClick={()=>{setLogOpen(isOpen?null:g.id);setLogNote("");}}
                  style={{padding:"0.3rem 0.7rem",border:`2px solid ${pal.primary}`,borderRadius:"9px",background:isOpen?pal.primary:"transparent",color:isOpen?"#fff":pal.primary,fontWeight:"700",fontSize:"0.72rem",cursor:"pointer",flexShrink:0}}>
                  {isOpen?"Cancel":"Log"}
                </button>
              </div>
              {/* Warmth nudge */}
              <div style={{padding:"0 1rem 0.75rem",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                <span style={{fontSize:"0.85rem",flexShrink:0}}>{tone==="good"?"\uD83C\uDF1F":tone==="gentle"?"\uD83D\uDCA7":"\uD83C\uDF31"}</span>
                <div style={{fontSize:"0.75rem",color:toneColor,lineHeight:1.55,fontStyle:tone==="quiet"?"italic":"normal"}}>{warmthMsg}</div>
              </div>
              {/* Quick log */}
              {isOpen&&(
                <div style={{borderTop:`1px solid ${pal.stone}20`,padding:"0.75rem 1rem",background:pal.pale}}>
                  <textarea value={logNote} onChange={e=>setLogNote(e.target.value)}
                    placeholder={"What did you do toward this goal today?"}
                    rows={2}
                    style={{width:"100%",padding:"0.6rem 0.8rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:"#fff",color:pal.ink,resize:"none",outline:"none",lineHeight:1.55,marginBottom:"0.55rem"}}
                    onFocus={e=>e.target.style.borderColor=pal.primary}
                    onBlur={e=>e.target.style.borderColor=pal.stone}/>
                  <button onClick={()=>saveLog(g.id)} disabled={!logNote.trim()}
                    style={{width:"100%",padding:"0.6rem",border:"none",borderRadius:"11px",background:logNote.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:logNote.trim()?"pointer":"default"}}>
                    {"Save to Portfolio"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* AI suggestions panel */}
        {activeGoals.length>0&&(
          <div style={{background:pal.pale,borderRadius:"16px",border:`1.5px solid ${pal.primary}25`,overflow:"hidden",marginTop:"0.5rem"}}>
            <button onClick={aiOpen?()=>setAiOpen(false):fetchAiSuggs}
              style={{width:"100%",display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.85rem 1rem",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:"1.2rem"}}>{"🤖"}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.85rem"}}>{"AI Goal Suggestions"}</div>
                <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{"Personalized for your family"}</div>
              </div>
              <span style={{color:pal.slate,fontSize:"1rem",transform:aiOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"›"}</span>
            </button>
            {aiOpen&&(
              <div style={{padding:"0 1rem 1rem",borderTop:`1px solid ${pal.primary}15`}}>
                {aiLoading&&<div style={{textAlign:"center",padding:"1rem",fontSize:"0.82rem",color:pal.slate}}>{"⏳ Generating..."}</div>}
                {aiError&&<div style={{padding:"0.65rem",background:pal.sand,borderRadius:"10px",fontSize:"0.78rem",color:pal.bad,marginTop:"0.65rem"}}>{aiError}</div>}
                {aiSuggs.length>0&&(
                  <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginTop:"0.65rem"}}>
                    {aiSuggs.map((label,i)=>{
                      const already = allGoalObjs.some(g=>g.label===label&&(family.goals||[]).includes(g.id));
                      return (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.55rem 0.75rem",background:pal.linen,borderRadius:"11px",border:`1.5px solid ${already?pal.primary+"40":pal.stone+"30"}`}}>
                          <span style={{fontSize:"0.9rem"}}>{"✨"}</span>
                          <span style={{flex:1,fontSize:"0.82rem",color:pal.inkM,fontWeight:already?"700":"400"}}>{label}</span>
                          {already
                            ? <span style={{fontSize:"0.68rem",color:pal.primary,fontWeight:"700"}}>{"✓ Added"}</span>
                            : <button onClick={()=>addAiGoal(label)}
                                style={{padding:"0.22rem 0.6rem",border:"none",borderRadius:"8px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.7rem",cursor:"pointer",flexShrink:0}}>
                                {"+ Add"}
                              </button>
                          }
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


/* =======================================
   STATE REQUIREMENTS SCREEN
   Personalized homeschool law cheat sheet
   Last data review: 2026-03-29
======================================= */
function StateRequirementsScreen({pal, family, onBack}) {
  const [expandedSection, setExpandedSection] = useState(null);
  const DATA_DATE = "April 26, 2026";
  const HSLDA_URL = "https://hslda.org/legal";

  const state = family.state || "";
  const children = family.children || [];
  const si = getStateInfo(state);
  const TIER_LABELS = {1:"Very Flexible",2:"Moderate",3:"Structured",4:"Most Regulated"};
  const TIER_COLORS = {1:"#2e7d32",2:"#f57c00",3:"#e65100",4:"#b71c1c"};
  const tierColor = TIER_COLORS[si.tier] || "#555";
  const tierLabel = TIER_LABELS[si.tier] || "Unknown";

  // Per-child compliance details
  const childDetails = children.map(c => getComplianceInfo(state, c.grade||"5th"));

  // Build checklist items
  const checklist = [
    si.attendance  && {icon:"📋", label:"Attendance Records", detail:"Keep a daily log of school days completed."},
    si.workSamples && {icon:"📁", label:"Work Samples", detail:"Save samples from beginning, middle, and end of year for each subject."},
    si.readingLog  && {icon:"📖", label:"Reading Log (by title)", detail:"Florida and Pennsylvania require listing books and materials by full title."},
    si.quarterly   && {icon:"📬", label:"Quarterly Reports", detail:"Submit reports to your local school district every quarter."},
    si.testing!=="Not required" && si.testing && {icon:"📝", label:"Annual Assessment", detail:si.testing},
    {icon:"📜", label:"Notification: "+si.notify, detail:"Required filing with your state or school district."},
  ].filter(Boolean);

  const Section = ({id, icon, title, children: kids}) => {
    const open = expandedSection===id;
    return (
      <div style={{background:pal.linen,borderRadius:"16px",marginBottom:"0.55rem",border:`1.5px solid ${pal.stone}30`,overflow:"hidden"}}>
        <button onClick={()=>setExpandedSection(open?null:id)}
          style={{width:"100%",display:"flex",alignItems:"center",gap:"0.7rem",padding:"0.85rem 1rem",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
          <span style={{fontSize:"1.2rem",flexShrink:0}}>{icon}</span>
          <span style={{flex:1,fontWeight:"700",color:pal.ink,fontSize:"0.88rem"}}>{title}</span>
          <span style={{color:pal.slate,fontSize:"0.9rem",transform:open?"rotate(90deg)":"none",transition:"transform 0.18s",flexShrink:0}}>›</span>
        </button>
        {open&&(
          <div style={{padding:"0 1rem 0.9rem",borderTop:`1px solid ${pal.stone}20`}}>
            {kids}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s ease"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"1rem 1.1rem 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.85rem"}}>
          <button onClick={onBack} style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{"<"}</button>
          <div>
            <div style={{fontWeight:"900",color:"#fff",fontSize:"1.1rem"}}>🛡️ State Guide</div>
            <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.65)"}}>{state||"Your State"} Homeschool Requirements</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1rem 1.1rem",paddingBottom:"2rem"}}>

        {/* Disclaimer */}
        <div style={{background:"#fff8e1",borderRadius:"14px",padding:"0.75rem 1rem",marginBottom:"0.9rem",border:"1.5px solid #f9a825",display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
          <span style={{fontSize:"1.1rem",flexShrink:0}}>⚠️</span>
          <div style={{fontSize:"0.72rem",color:"#5d4037",lineHeight:1.6}}>
            <strong>For informational purposes only.</strong> Laws change — always verify with <a href={HSLDA_URL} target="_blank" rel="noopener noreferrer" style={{color:"#e65100",fontWeight:"700"}}>HSLDA.org</a> or your state DOE before making legal decisions. Data last reviewed <strong>{DATA_DATE}</strong>.
          </div>
        </div>

        {!state && (
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1.5rem",textAlign:"center",marginBottom:"1rem"}}>
            <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📍</div>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.9rem",marginBottom:"0.3rem"}}>No state set</div>
            <div style={{fontSize:"0.76rem",color:pal.slate,lineHeight:1.6}}>Set your state in Settings → Family to see personalized requirements.</div>
          </div>
        )}

        {state && (<>
          {/* Tier badge */}
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"0.9rem",border:`1.5px solid ${pal.stone}30`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.65rem"}}>
              <div style={{fontWeight:"900",color:pal.ink,fontSize:"1rem"}}>{state}</div>
              <div style={{background:tierColor+"18",borderRadius:"20px",padding:"0.2rem 0.7rem",border:`1.5px solid ${tierColor}40`}}>
                <span style={{fontSize:"0.68rem",fontWeight:"800",color:tierColor}}>Tier {si.tier} — {tierLabel}</span>
              </div>
            </div>
            <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.6rem"}}>{si.portfolio}</div>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
              {si.attendance&&<span style={{background:"#e8f5e9",borderRadius:"20px",padding:"0.15rem 0.55rem",fontSize:"0.65rem",fontWeight:"700",color:"#2e7d32"}}>📋 Attendance</span>}
              {si.workSamples&&<span style={{background:"#e3f2fd",borderRadius:"20px",padding:"0.15rem 0.55rem",fontSize:"0.65rem",fontWeight:"700",color:"#1565c0"}}>📁 Work Samples</span>}
              {si.readingLog&&<span style={{background:"#fce4ec",borderRadius:"20px",padding:"0.15rem 0.55rem",fontSize:"0.65rem",fontWeight:"700",color:"#880e4f"}}>📖 Reading Log</span>}
              {si.quarterly&&<span style={{background:"#fff3e0",borderRadius:"20px",padding:"0.15rem 0.55rem",fontSize:"0.65rem",fontWeight:"700",color:"#e65100"}}>📬 Quarterly</span>}
            </div>
          </div>

          {/* Quick checklist */}
          <Section id="checklist" icon="✅" title="Your Compliance Checklist">
            <div style={{display:"flex",flexDirection:"column",gap:"0.45rem",marginTop:"0.7rem"}}>
              {checklist.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start",padding:"0.55rem 0.75rem",background:pal.pale,borderRadius:"12px"}}>
                  <span style={{fontSize:"1rem",flexShrink:0,marginTop:"1px"}}>{item.icon}</span>
                  <div>
                    <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>{item.label}</div>
                    <div style={{fontSize:"0.72rem",color:pal.slate,lineHeight:1.55,marginTop:"2px"}}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Hours & Deadlines */}
          <Section id="hours" icon="🕐" title="Hours & Deadlines">
            <div style={{marginTop:"0.7rem",display:"flex",flexDirection:"column",gap:"0.45rem"}}>
              <div style={{display:"flex",gap:"0.6rem",padding:"0.55rem 0.75rem",background:pal.pale,borderRadius:"12px"}}>
                <span style={{fontSize:"1rem",flexShrink:0}}>📆</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>Required Hours / Days</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,marginTop:"2px"}}>{si.hours||"See state DOE"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.6rem",padding:"0.55rem 0.75rem",background:pal.pale,borderRadius:"12px"}}>
                <span style={{fontSize:"1rem",flexShrink:0}}>⏰</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>Key Deadline</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,marginTop:"2px"}}>{si.deadline||"Check state DOE"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.6rem",padding:"0.55rem 0.75rem",background:pal.pale,borderRadius:"12px"}}>
                <span style={{fontSize:"1rem",flexShrink:0}}>🗂️</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem"}}>Keep Records For</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,marginTop:"2px"}}>{si.keepFor||"Recommended: 5 years"}</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Required subjects */}
          {si.subjects && si.subjects.length>0 && (
            <Section id="subjects" icon="📚" title={`Required Subjects (${si.subjects.length})`}>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginTop:"0.7rem"}}>
                {si.subjects.map((s,i)=>(
                  <span key={i} style={{background:`${pal.primary}15`,borderRadius:"20px",padding:"0.2rem 0.6rem",fontSize:"0.72rem",fontWeight:"600",color:pal.primary}}>{s}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Per-child details */}
          {children.length>0 && (
            <Section id="children" icon="🌱" title="Per-Child Notes">
              <div style={{marginTop:"0.7rem",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                {children.map((c,i)=>{
                  const ci = childDetails[i];
                  if(!ci) return null;
                  return (
                    <div key={c.id} style={{padding:"0.75rem",background:pal.pale,borderRadius:"13px",border:`1.5px solid ${pal.stone}20`}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.5rem"}}>
                        <span style={{fontSize:"1.3rem"}}>{c.avatar}</span>
                        <div>
                          <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>{c.name}</div>
                          <div style={{fontSize:"0.65rem",color:pal.slate}}>{c.grade} · {ci.level}</div>
                        </div>
                      </div>
                      <div style={{fontSize:"0.76rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.4rem"}}>{ci.gradeNote}</div>
                      <div style={{fontSize:"0.72rem",color:pal.slate,fontStyle:"italic",marginBottom:"0.35rem"}}>Assessment: {ci.testing}</div>
                      {si.evaluatorNote&&<div style={{fontSize:"0.72rem",color:pal.inkM,lineHeight:1.55,padding:"0.35rem 0.6rem",background:pal.pale,borderRadius:"9px"}}>{"👤 "+si.evaluatorNote}</div>}
                      {ci.needsTest&&<div style={{marginTop:"0.4rem",background:"#fff3e0",borderRadius:"9px",padding:"0.35rem 0.6rem",fontSize:"0.72rem",color:"#b71c1c",fontWeight:"700"}}>{"⚠️ Assessment required this year"}</div>}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Notification requirement */}
          <Section id="notify" icon="📬" title="How to Notify the State">
            <div style={{marginTop:"0.7rem",fontSize:"0.8rem",color:pal.inkM,lineHeight:1.7}}>{si.notify}</div>
            <a href={HSLDA_URL} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",marginTop:"0.75rem",padding:"0.45rem 0.9rem",background:pal.primary,borderRadius:"11px",color:"#fff",fontWeight:"700",fontSize:"0.76rem",textDecoration:"none"}}>
              {"Verify on HSLDA.org \u2192"}
            </a>
          </Section>

          {/* Umbrella school option — only shown for states where it applies */}
          {si.umbrellaNote&&(
            <Section id="umbrella" icon="🏫" title={si.umbrellaRequired?"Umbrella School — Required Path":"Umbrella School — Optional"}>
              <div style={{marginTop:"0.7rem",display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                {si.umbrellaRequired&&(
                  <div style={{background:"#fff3e0",borderRadius:"11px",padding:"0.5rem 0.75rem",border:"1.5px solid #f9a825",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                    <span style={{fontSize:"0.9rem",flexShrink:0}}>{"⚠️"}</span>
                    <div style={{fontSize:"0.72rem",color:"#5d4037",fontWeight:"700",lineHeight:1.5}}>{"Umbrella or district enrollment is required in "+state+" — you must choose one."}</div>
                  </div>
                )}
                <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.7}}>{si.umbrellaNote}</div>
                <div style={{padding:"0.55rem 0.75rem",background:pal.pale,borderRadius:"11px",border:`1.5px solid ${pal.stone}20`}}>
                  <div style={{fontSize:"0.71rem",color:pal.slate,lineHeight:1.6}}>
                    {"Root \u0026 Bloom doesn't endorse specific umbrella providers. Search \u201c"+state+" umbrella school\u201d or ask in your local homeschool community for recommendations."}
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* Official Resources */}
          <Section id="resources" icon="🔗" title="Official Resources">
            <div style={{marginTop:"0.7rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {si.stateUrl&&(
                <a href={si.stateUrl} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.7rem 0.85rem",background:pal.pale,borderRadius:"13px",textDecoration:"none",border:`1.5px solid ${pal.stone}25`}}>
                  <span style={{fontSize:"1.1rem",flexShrink:0}}>🏛️</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>{state} Department of Education</div>
                    <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{si.stateUrl}</div>
                  </div>
                  <span style={{color:pal.slate,fontSize:"0.8rem",flexShrink:0}}>{"›"}</span>
                </a>
              )}
              <a href={HSLDA_URL} target="_blank" rel="noopener noreferrer"
                style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.7rem 0.85rem",background:pal.pale,borderRadius:"13px",textDecoration:"none",border:`1.5px solid ${pal.stone}25`}}>
                <span style={{fontSize:"1.1rem",flexShrink:0}}>⚖️</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.82rem"}}>HSLDA — Legal Reference</div>
                  <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>hslda.org/legal</div>
                </div>
                <span style={{color:pal.slate,fontSize:"0.8rem",flexShrink:0}}>{"›"}</span>
              </a>
              {si.evaluatorNote&&(
                <div style={{padding:"0.7rem 0.85rem",background:"#e8f5e9",borderRadius:"13px",border:"1.5px solid #a5d6a7"}}>
                  <div style={{fontWeight:"700",color:"#1b5e20",fontSize:"0.8rem",marginBottom:"0.3rem"}}>{"👤 Who can evaluate?"}</div>
                  <div style={{fontSize:"0.76rem",color:"#2e7d32",lineHeight:1.6}}>{si.evaluatorNote}</div>
                </div>
              )}
            </div>
          </Section>
        </>)}

        {/* Footer */}
        <div style={{marginTop:"0.5rem",padding:"0.75rem",background:pal.linen,borderRadius:"14px",border:`1.5px solid ${pal.stone}20`}}>
          <div style={{fontSize:"0.68rem",color:pal.slate,lineHeight:1.6,textAlign:"center"}}>
            Data last reviewed <strong>{DATA_DATE}</strong>. Root &amp; Bloom reviews state requirements quarterly.<br/>
            Always confirm current law at <a href={HSLDA_URL} target="_blank" rel="noopener noreferrer" style={{color:pal.primary,fontWeight:"700"}}>HSLDA.org</a> or your state Department of Education.
          </div>
        </div>
      </div>
    </div>
  );
}

