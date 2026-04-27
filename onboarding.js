/* ----------------------------------------------------------
   ONBOARDING FLOW
   OnboardingFlow + all Onb* step components
   Depends on: constants and helpers defined in index.html inline script
   ---------------------------------------------------------- */

function OnboardingFlow({ pal, onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    parentName:"", familyName:"", schoolName:"", studentTitle:"", state:"",
    yearsHomeschooling:"0-1 years",
    children:[{id:uid(),name:"",grade:"1st",avatar:"🌻"}],
    curriculumStyle:["eclectic"],
    curriculumBrands:[],
    subjects:["bible","math","reading","language","science","history"],
    sessionLength:"45 min",
    morningGathering:true, morningGatheringName:"Morning Time",
    schoolDays:"Monday-Friday", startTime:"8:00", endTime:"15:00", breakStyle:"Short breaks every hour",
    goals:[],
    coopFreq:"Every other week", coopDay:"Wednesday", extracurriculars:[],
    lifeReady:false, lifeReadyFreq:"monday_plus_practice", lifeReadyCategories:[],
    paletteId:"sage",
  });
  const upd = (k,v) => setData(d=>({...d,[k]:v}));
  const STEPS = ["Welcome","Your Children","Schedule Style","Learning Style","Curriculum","Co-op","Subjects","Your Schedule","Lesson Goals","Goals","Life & Extras","Life Ready","You're All Set!"];
  const pct = Math.round((step/12)*100);

  const STEP_ICONS = ["🌱","👨👩👧👦","📋","📚","📖","🏫","🔬","📅","🎯","🌟","🌿","🛡","🎉"];

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column"}}>
      {/* Progress header */}
      {step>0 && (
        <div style={{background:pal.deep,padding:"0.85rem 1.1rem 0.75rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{background:"rgba(255,255,255,0.14)",border:"1.5px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:"20px",padding:"0.25rem 0.75rem",cursor:"pointer",fontSize:"0.75rem",fontWeight:"700",display:"flex",alignItems:"center",gap:"0.3rem"}}>{"\u2190"} Back</button>
            <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.55)",fontWeight:"700",letterSpacing:"0.08em",textTransform:"uppercase"}}>{STEP_ICONS[step]} {STEPS[step]}</span>
            <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",fontWeight:"600"}}>{step + " of 12"}</span>
          </div>
          <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.15)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:pal.accentGrad,transition:"width 0.35s ease"}}/>
          </div>
        </div>
      )}

      <div key={step} style={{flex:1,overflowY:"auto"}}>
        {step===0  && <OnbWelcome         pal={pal} data={data} upd={upd} onNext={()=>setStep(1)} />}
        {step===1  && <OnbChildren        pal={pal} data={data} upd={upd} onNext={()=>setStep(2)} />}
        {step===2  && <OnbSchedulePref    pal={pal} data={data} upd={upd} onNext={()=>setStep(3)} />}
        {step===3  && <OnbPhilosophy      pal={pal} data={data} upd={upd} onNext={()=>setStep(4)} />}
        {step===4  && <OnbCurrBrands      pal={pal} data={data} upd={upd} onNext={()=>setStep(5)} />}
        {step===5  && <OnbCoop            pal={pal} data={data} upd={upd} onNext={()=>setStep(6)} />}
        {step===6  && <OnbSubjects        pal={pal} data={data} upd={upd} onNext={()=>setStep(7)} />}
        {step===7  && <OnbScheduleCombined pal={pal} data={data} upd={upd} onNext={()=>setStep(8)} />}
        {step===8  && <OnbLessonGoals     pal={pal} data={data} upd={upd} onNext={()=>setStep(9)} />}
        {step===9  && <OnbGoals           pal={pal} data={data} upd={upd} onNext={()=>setStep(10)} />}
        {step===10 && <OnbExtras          pal={pal} data={data} upd={upd} onNext={()=>setStep(11)} />}
        {step===11 && <OnbLifeReady       pal={pal} data={data} upd={upd} onNext={()=>setStep(12)} />}
        {step===12 && <OnbCelebration     pal={pal} data={data} upd={upd} onNext={()=>onComplete(data)} />}
      </div>
    </div>
  );
}

/* --- STEP 0: Welcome --- */
function OnbSchedulePref({ pal, data, upd, onNext }) {
  return (
    <div style={{padding:"2rem 1.4rem 1.5rem",maxWidth:"430px",margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
        <div style={{fontSize:"2.8rem",marginBottom:"0.6rem"}}>{"📋"}</div>
        <div style={{fontWeight:"900",color:pal.ink,fontSize:"1.15rem",marginBottom:"0.4rem"}}>{"Daily schedule checklist?"}</div>
        <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.65}}>
          {"Some families love ticking off subjects one by one as they go. Others prefer logging everything at the end of the day. Which sounds like you?"}
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"2rem"}}>
        <button onClick={()=>{upd("useScheduleTab",false);}}
          style={{padding:"1rem 1.2rem",border:`2.5px solid ${data.useScheduleTab===false?pal.primary:pal.stone+"50"}`,borderRadius:"16px",background:data.useScheduleTab===false?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.14s"}}>
          <div style={{display:"flex",gap:"0.75rem",alignItems:"center"}}>
            <span style={{fontSize:"1.6rem"}}>{"📝"}</span>
            <div>
              <div style={{fontWeight:"800",color:data.useScheduleTab===false?pal.primary:pal.ink,fontSize:"0.9rem"}}>{"Log at the end of the day"}</div>
              <div style={{fontSize:"0.75rem",color:pal.slate,marginTop:"2px",lineHeight:1.5}}>{"Quick capture after school — one tap, done. Clean and simple."}</div>
            </div>
            {data.useScheduleTab===false&&<div style={{marginLeft:"auto",color:pal.primary,fontSize:"1.2rem",flexShrink:0}}>{"✓"}</div>}
          </div>
        </button>

        <button onClick={()=>{upd("useScheduleTab",true);}}
          style={{padding:"1rem 1.2rem",border:`2.5px solid ${data.useScheduleTab===true?pal.primary:pal.stone+"50"}`,borderRadius:"16px",background:data.useScheduleTab===true?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.14s"}}>
          <div style={{display:"flex",gap:"0.75rem",alignItems:"center"}}>
            <span style={{fontSize:"1.6rem"}}>{"✅"}</span>
            <div>
              <div style={{fontWeight:"800",color:data.useScheduleTab===true?pal.primary:pal.ink,fontSize:"0.9rem"}}>{"Checklist as I go"}</div>
              <div style={{fontSize:"0.75rem",color:pal.slate,marginTop:"2px",lineHeight:1.5}}>{"Tick subjects off one by one throughout the day. Great for keeping kids on track."}</div>
            </div>
            {data.useScheduleTab===true&&<div style={{marginLeft:"auto",color:pal.primary,fontSize:"1.2rem",flexShrink:0}}>{"✓"}</div>}
          </div>
        </button>
      </div>

      <div style={{fontSize:"0.72rem",color:pal.slate,textAlign:"center",marginBottom:"1.2rem"}}>
        {"You can always change this later in Settings."}
      </div>

      <button onClick={()=>{if(data.useScheduleTab===undefined)upd("useScheduleTab",false);onNext();}}
        style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.95rem",cursor:"pointer"}}>
        {"Finish setup →"}
      </button>
    </div>
  );
}



/* --- CELEBRATION STEP (step 11) --- */
function OnbCelebration({ pal, data, onNext }) {
  const [confetti, setConfetti] = React.useState([]);
  React.useEffect(()=>{
    setConfetti(Array.from({length:40},(_,i)=>({
      id:i, x:Math.random()*100, delay:Math.random()*1.2,
      dur:1.8+Math.random()*1.2,
      color:["#a8d5a2","#f6c90e","#e07b9a","#7ec8e3","#f4a261","#a29bfe"][i%6],
      size:6+Math.random()*8, rot:Math.random()*360,
    })));
  },[]);
  const childNames=(data.children||[]).map(c=>c.name).filter(Boolean);
  const nameStr=childNames.length===1?childNames[0]:childNames.length===2?childNames.join(" & "):childNames.slice(0,-1).join(", ")+" & "+childNames[childNames.length-1];
  return (
    <div style={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2.5rem 1.6rem",textAlign:"center",position:"relative",overflow:"hidden",background:pal.sand}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {confetti.map(p=>(
          <div key={p.id} style={{position:"absolute",left:p.x+"%",top:"-20px",width:p.size+"px",height:p.size+"px",background:p.color,borderRadius:p.id%2===0?"50%":"3px",animation:`confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,transform:`rotate(${p.rot}deg)`,opacity:0.85}}/>
        ))}
      </div>
      <div style={{position:"relative",zIndex:1,maxWidth:"380px"}}>
        <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"grow 0.5s ease"}}>{"🌱"}</div>
        <h2 style={{fontFamily:"Georgia",fontSize:"1.6rem",fontWeight:"900",color:pal.ink,margin:"0 0 0.5rem",lineHeight:1.2}}>
          {"You're all set"}{data.parentName?", "+data.parentName:""}{"!"}
        </h2>
        <p style={{fontSize:"0.88rem",color:pal.slate,lineHeight:1.7,margin:"0 0 1.5rem"}}>
          {nameStr?"Root & Bloom is ready for "+nameStr+". Every lesson logged, every milestone captured, every step of the way.":"Root & Bloom is ready for your family. Let us grow something beautiful together."}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"2rem"}}>
          {[{icon:"📝",text:"Log your first lesson today"},{icon:"🌟",text:"Capture a milestone as it happens"},{icon:"💌",text:"Kids can send you private notes from their portal"},{icon:"📊",text:"Track progress all year long"},{icon:"🎓",text:"Print a portfolio when you're ready"}].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.65rem 1rem",background:pal.linen,borderRadius:"12px",border:`1.5px solid ${pal.stone}25`,textAlign:"left"}}>
              <span style={{fontSize:"1.2rem",flexShrink:0}}>{item.icon}</span>
              <span style={{fontSize:"0.82rem",color:pal.inkM,fontWeight:"600"}}>{item.text}</span>
            </div>
          ))}
        </div>
        <button onClick={onNext} style={{width:"100%",padding:"0.95rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.95rem",cursor:"pointer",boxShadow:"0 4px 18px rgba(0,0,0,0.12)"}}>
          {"One last thing →"}
        </button>
      </div>
    </div>
  );
}

/* --- COMBINED SCHEDULE STEP (step 6) --- */
function OnbScheduleCombined({ pal, data, upd, onNext }) {
  const [tab, setTab] = React.useState("details");
  const customSubjs=data.customSubjects||[];
  const allSubjMap=Object.fromEntries([...SUBJECT_OPTIONS,...customSubjs].map(s=>[s.id,s]));
  const activeSubjs=(data.subjects||[]).map(id=>allSubjMap[id]).filter(Boolean);
  const coopDay=data.coopDay;
  const DOW_LABELS=["Mon","Tue","Wed","Thu","Fri"];
  const DOW_FULL=["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const DOW_MAP={"Monday":0,"Tuesday":1,"Wednesday":2,"Thursday":3,"Friday":4};
  const doesCoop=data.coopFreq&&data.coopFreq!=="We don't do co-op";
  const coopDow=doesCoop?(DOW_MAP[coopDay]??-1):-1;
  const [sched,setSched]=React.useState(()=>{
    if(data.weeklySchedule) return data.weeklySchedule;
    const init={};
    for(let d=0;d<5;d++){if(d===coopDow){init[d]=[];continue;}init[d]=activeSubjs.map(s=>s.id);}
    return init;
  });
  const [activeDay,setActiveDay]=React.useState(coopDow===0?1:0);
  const toggleSubj=(dow,subjId)=>{setSched(prev=>{const cur=prev[dow]||[];const next=cur.includes(subjId)?cur.filter(x=>x!==subjId):[...cur,subjId];return {...prev,[dow]:next};});};
  const toggleDay=(dow)=>{if(dow===coopDow)return;setSched(prev=>({...prev,[dow]:prev[dow]===null?activeSubjs.map(s=>s.id):null}));};
  const saveAndNext=()=>{upd("weeklySchedule",sched);onNext();};
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon={"📅"} title="Your Schedule" sub="Set your school year details and which subjects you cover each day." />
      <div style={{display:"flex",background:pal.parchm,borderRadius:"12px",padding:"3px",gap:"2px",marginBottom:"1.1rem"}}>
        {[["details","📖 Details"],["weekly","📆 Weekly"]].map(([val,label])=>(
          <button key={val} onClick={()=>setTab(val)} style={{flex:1,padding:"0.55rem 0.4rem",border:"none",borderRadius:"10px",background:tab===val?pal.linen:"transparent",cursor:"pointer",fontWeight:"700",color:tab===val?pal.primary:pal.slate,fontSize:"0.8rem",transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>
      {tab==="details"&&(
        <div style={{animation:"fadeUp 0.2s ease"}}>
          <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}22`}}>
            <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.86rem",marginBottom:"0.55rem"}}>{"📖 School Year Dates"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
              <div><Lbl pal={pal}>Year started</Lbl><Input pal={pal} type="date" value={data.yearStart||""} onChange={v=>upd("yearStart",v)}/></div>
              <div><Lbl pal={pal}>Goal end date</Lbl><Input pal={pal} type="date" value={data.yearEnd||""} onChange={v=>upd("yearEnd",v)}/></div>
            </div>
            <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"0.5rem"}}>{"Used to track your year progress. You can update this anytime in Settings."}</div>
          </div>
          <div style={{background:pal.parchm,borderRadius:"13px",padding:"0.8rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.84rem",marginBottom:"0.2rem"}}>{"🕐 Daily hours goal (optional)"}</div>
            <div style={{fontSize:"0.71rem",color:pal.slate,marginBottom:"0.55rem"}}>{(()=>{const sc=STATE_COMPLIANCE&&data.state?STATE_COMPLIANCE[data.state]:null;const h=sc?.hours;return h&&h!=="None"&&h!=="None required"?data.state+" requires "+h+". Check your state law for any hour minimums.":"Most states count days, not hours. Check your state law for any minimums.";})()}</div>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
              {["No hour tracking","2 hours/day","3 hours/day","4 hours/day","5 hours/day","6 hours/day"].map(h=>(
                <button key={h} onClick={()=>upd("dailyHoursGoal",h)} style={{padding:"0.3rem 0.7rem",borderRadius:"20px",border:`2px solid ${(data.dailyHoursGoal||"No hour tracking")===h?pal.primary:pal.stone+"50"}`,background:(data.dailyHoursGoal||"No hour tracking")===h?pal.pale:"transparent",cursor:"pointer",fontSize:"0.74rem",fontWeight:(data.dailyHoursGoal||"No hour tracking")===h?"700":"400",color:(data.dailyHoursGoal||"No hour tracking")===h?pal.primary:pal.inkM}}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <Lbl pal={pal}>School days</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
            {SCHOOL_DAYS_OPTIONS.map(d=>(
              <button key={d} onClick={()=>upd("schoolDays",d)} style={{padding:"0.7rem 1rem",border:`2px solid ${data.schoolDays===d?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.schoolDays===d?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.schoolDays===d?"700":"400",color:data.schoolDays===d?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
                {d}
              </button>
            ))}
          </div>
          {/* Session length -- only for timed families, and only if tracking hours */}
          {data.useScheduleTab!==false&&(data.dailyHoursGoal||"No hour tracking")!=="No hour tracking"&&(
            <div style={{background:pal.parchm,borderRadius:"13px",padding:"0.8rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.84rem",marginBottom:"0.5rem"}}>{"⏱️ Typical session length"}</div>
              <div style={{fontSize:"0.71rem",color:pal.slate,marginBottom:"0.55rem"}}>{"How long does each subject usually run? Used to estimate your daily schedule."}</div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {SESSION_LENGTHS.map(l=>(
                  <button key={l} onClick={()=>upd("sessionLength",l)} style={{padding:"0.38rem 0.8rem",border:`2px solid ${data.sessionLength===l?pal.primary:pal.stone+"50"}`,borderRadius:"20px",background:data.sessionLength===l?pal.pale:"transparent",cursor:"pointer",fontWeight:data.sessionLength===l?"700":"400",color:data.sessionLength===l?pal.primary:pal.inkM,fontSize:"0.8rem",transition:"all 0.13s"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Co-op start time -- only for timed families who do co-op */}
          {data.useScheduleTab!==false&&data.coopFreq&&data.coopFreq!=="We don't do co-op"&&(
            <div style={{background:"#fff8e6",borderRadius:"13px",padding:"0.8rem 1rem",marginBottom:"1rem",border:"1.5px solid #f5c84250"}}>
              <div style={{fontWeight:"700",color:"#7a5500",fontSize:"0.84rem",marginBottom:"0.5rem"}}>{"🏫 Co-op start time"}</div>
              <div style={{fontSize:"0.71rem",color:"#b07800",marginBottom:"0.55rem"}}>{"What time does your co-op start? Helps build your schedule around it."}</div>
              <select value={data.coopTime||""} onChange={e=>upd("coopTime",e.target.value)}
                style={{width:"100%",padding:"0.55rem 0.75rem",border:"2px solid #f5c842",borderRadius:"11px",fontSize:"0.84rem",background:"#fffbee",color:"#7a5500",outline:"none",fontFamily:"inherit"}}>
                <option value="">Select a time...</option>
                {["7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1.2rem",border:`1.5px solid ${pal.primary}22`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:data.morningGathering?"0.65rem":"0"}}>
              <div>
                <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.86rem"}}>{"🌅 Morning gathering time?"}</div>
                <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{"A cozy start before individual subjects"}</div>
              </div>
              <button onClick={()=>upd("morningGathering",!data.morningGathering)} style={{width:"44px",height:"26px",borderRadius:"13px",border:"none",background:data.morningGathering?pal.primary:pal.stone+"60",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:"3px",left:data.morningGathering?"21px":"3px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
              </button>
            </div>
            {data.morningGathering&&(
              <div>
                <Lbl pal={pal}>{"What do you call it?"}</Lbl>
                <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
                  {["Morning Time","Morning Basket","Circle Time","Morning Meeting","Devotions"].map(n=>(
                    <button key={n} onClick={()=>upd("morningGatheringName",n)} style={{padding:"0.35rem 0.7rem",border:`1.5px solid ${data.morningGatheringName===n?pal.primary:pal.stone+"50"}`,borderRadius:"20px",background:data.morningGatheringName===n?pal.pale:"transparent",cursor:"pointer",fontSize:"0.74rem",fontWeight:data.morningGatheringName===n?"700":"400",color:data.morningGatheringName===n?pal.primary:pal.inkM,transition:"all 0.13s"}}>
                      {n}
                    </button>
                  ))}
                </div>
                <Input pal={pal} value={data.morningGatheringName} onChange={v=>upd("morningGatheringName",v)} placeholder="Or type your own name..." />
              </div>
            )}
          </div>
          <Btn pal={pal} onClick={()=>setTab("weekly")}>{"Set weekly subjects →"}</Btn>
        </div>
      )}
      {tab==="weekly"&&(
        <div style={{animation:"fadeUp 0.2s ease"}}>
          <div style={{display:"flex",gap:"0.3rem",marginBottom:"1rem"}}>
            {DOW_LABELS.map((d,i)=>{
              const isActive=activeDay===i;const isCopDay=i===coopDow;const isOff=sched[i]===null&&!isCopDay;const subjCount=Array.isArray(sched[i])?sched[i].length:0;
              return (
                <button key={i} onClick={()=>setActiveDay(i)} style={{flex:1,padding:"0.55rem 0.2rem",borderRadius:"12px",border:`2px solid ${isActive?pal.primary:isCopDay?"#f5c842":isOff?pal.stone+"40":pal.stone+"50"}`,background:isActive?pal.pale:isCopDay?"#fff8e6":"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.13s"}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"800",color:isActive?pal.primary:isCopDay?"#b07800":isOff?pal.stone:pal.inkM,textTransform:"uppercase",letterSpacing:"0.05em"}}>{d}</div>
                  <div style={{fontSize:"0.58rem",color:isActive?pal.primary:isCopDay?"#b07800":isOff?pal.stone:pal.slate,marginTop:"2px",fontWeight:"600"}}>{isCopDay?"Co-op"+(subjCount>0?" +"+subjCount:""):isOff?"Off":subjCount+" subj"}</div>
                </button>
              );
            })}
          </div>
          {activeDay===coopDow?(
            <div style={{background:"#fff8e6",borderRadius:"16px",padding:"0.9rem 1rem",border:"1.5px solid #f5c84250",marginBottom:"1rem"}}>
              <div style={{fontWeight:"700",color:"#7a5500",fontSize:"0.86rem",marginBottom:"0.25rem"}}>{DOW_FULL[activeDay]+" — Co-op Day"}</div>
              <div style={{fontSize:"0.73rem",color:"#b07800",marginBottom:"0.6rem"}}>{"Co-op classes are shown below. You can also add extra subjects done at home on this day."}</div>
              {(data.coopClasses||[]).length>0&&(
                <div style={{marginBottom:"0.75rem"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>{"🏫 At co-op"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                    {(data.coopClasses||[]).map(c=>(
                      <span key={c} style={{padding:"0.2rem 0.55rem",background:"#fff3cc",borderRadius:"20px",fontSize:"0.72rem",fontWeight:"700",color:"#7a5500",border:"1px solid #f5c84260"}}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeSubjs.length>0&&(
                <div>
                  <div style={{fontSize:"0.63rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>{"+ Also at home (optional)"}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.28rem"}}>
                    {activeSubjs.map(s=>{
                      const selExtra=(sched[activeDay]||[]).includes(s.id);
                      return (
                        <button key={s.id} onClick={()=>toggleSubj(activeDay,s.id)} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.45rem 0.75rem",border:`2px solid ${selExtra?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:selExtra?pal.pale:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                          <span style={{fontSize:"1rem",width:"20px",textAlign:"center",flexShrink:0}}>{s.icon}</span>
                          <span style={{flex:1,fontWeight:selExtra?"700":"400",color:selExtra?pal.primary:pal.inkM,fontSize:"0.82rem"}}>{s.label}</span>
                          <div style={{width:"18px",height:"18px",borderRadius:"5px",border:`2px solid ${selExtra?pal.primary:pal.stone}`,background:selExtra?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            {selExtra&&<span style={{color:"#fff",fontSize:"0.68rem",fontWeight:"900"}}>{"\u2713"}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ):(
            <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",border:`1.5px solid ${pal.stone}30`,marginBottom:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:sched[activeDay]===null?"0":"0.75rem",paddingBottom:sched[activeDay]===null?"0":"0.75rem",borderBottom:sched[activeDay]===null?"none":`1px solid ${pal.stone}20`}}>
                <div>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>{DOW_FULL[activeDay]}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{sched[activeDay]===null?"No school this day":"Select which subjects"}</div>
                </div>
                <button onClick={()=>toggleDay(activeDay)} style={{width:"44px",height:"26px",borderRadius:"13px",border:"none",background:sched[activeDay]===null?pal.stone+"60":pal.primary,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:"3px",left:sched[activeDay]===null?"3px":"21px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                </button>
              </div>
              {sched[activeDay]!==null&&(
                <div style={{display:"flex",flexDirection:"column",gap:"0.32rem"}}>
                  {activeSubjs.map(s=>{const sel=(sched[activeDay]||[]).includes(s.id);return (
                    <button key={s.id} onClick={()=>toggleSubj(activeDay,s.id)} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.55rem 0.75rem",border:`2px solid ${sel?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:sel?pal.pale:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                      <span style={{fontSize:"1.1rem",width:"22px",textAlign:"center",flexShrink:0}}>{s.icon}</span>
                      <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
                      <div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {sel&&<span style={{color:"#fff",fontSize:"0.72rem",fontWeight:"900"}}>{"✓"}</span>}
                      </div>
                    </button>
                  );})}
                </div>
              )}
            </div>
          )}
          <div style={{background:pal.parchm,borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1.1rem",border:`1px solid ${pal.stone}25`}}>
            <div style={{fontSize:"0.64rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.35rem"}}>{"Your week at a glance"}</div>
            <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
              {DOW_LABELS.map((d,i)=>{const isCopDay=i===coopDow;const isOff=sched[i]===null&&!isCopDay;const count=isCopDay?(sched[i]||[]).length:Array.isArray(sched[i])?sched[i].length:0;return (
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",cursor:"pointer"}} onClick={()=>setActiveDay(i)}>
                  <div style={{fontSize:"0.6rem",fontWeight:"700",color:isCopDay?"#b07800":isOff?pal.stone:pal.inkM}}>{d}</div>
                  <div style={{width:"36px",height:"36px",borderRadius:"9px",background:isCopDay?"#fff8e6":isOff?pal.parchm:pal.pale,border:`1.5px solid ${activeDay===i?pal.primary:isCopDay?"#f5c842":isOff?pal.stone+"30":pal.stone+"40"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:"800",color:isCopDay?"#b07800":isOff?pal.stone:pal.primary}}>
                    {isCopDay?"🏫":isOff?"—":count}
                  </div>
                </div>
              );})}
            </div>
          </div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button onClick={()=>setTab("details")} style={{flex:1,padding:"0.72rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.86rem",cursor:"pointer"}}>{"← Details"}</button>
            <Btn pal={pal} onClick={saveAndNext} style={{flex:2}}>{"Save & Next →"}</Btn>
          </div>
        </div>
      )}
    </div>
  );
}


function OnbWelcome({ pal, data, upd, onNext }) {
  const canNext = data.parentName.trim().length>0 && data.familyName.trim().length>0;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:pal.heroGrad,padding:"2.5rem 1.4rem 2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-40px",top:"-40px",width:"160px",height:"160px",borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",left:"-30px",bottom:"-30px",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
        <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"grow 0.5s ease"}}>🌱</div>
        <h1 style={{fontFamily:"Georgia",fontSize:"1.9rem",fontWeight:"900",color:"#fff",margin:"0 0 0.5rem",lineHeight:1.15}}>{"Your homeschool,"}<br/>{"beautifully organized."}</h1>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:"0.84rem",margin:"0 0 1rem",lineHeight:1.7}}>{"Root & Bloom replaces the chaos of spreadsheets and sticky notes with one calm, joyful space for logging, tracking, and celebrating every lesson."}</p>
        <div style={{display:"flex",justifyContent:"center",gap:"1.2rem",flexWrap:"wrap"}}>
          {[{icon:"📝",t:"Log lessons"},{icon:"📊",t:"Track progress"},{icon:"🎓",t:"Print portfolios"}].map((f,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
              <span style={{fontSize:"1.3rem"}}>{f.icon}</span>
              <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.7)",fontWeight:"600"}}>{f.t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"1.4rem 1.2rem"}}>
        <Lbl pal={pal}>Your first name</Lbl>
        <Input pal={pal} value={data.parentName} onChange={v=>upd("parentName",v)} placeholder="e.g. Sarah" />
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>Family name</Lbl>
        <Input pal={pal} value={data.familyName} onChange={v=>upd("familyName",v)} placeholder="e.g. The Johnson Family" />
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>School name <span style={{fontWeight:"400",color:pal.slate}}>(optional)</span></Lbl>
        <Input pal={pal} value={data.schoolName} onChange={v=>upd("schoolName",v)} placeholder="e.g. Thornwood Academy" />
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>What do your students call you? <span style={{fontWeight:"400",color:pal.slate}}>(optional)</span></Lbl>
        <Input pal={pal} value={data.studentTitle||""} onChange={v=>upd("studentTitle",v)} placeholder="e.g. Mama, Nana, Coach, Ms. Rivera..." />
        <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"0.3rem",lineHeight:1.5}}>{"Used in the student portal (e.g. \"Share with Mama\")."}</div>
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>Your state</Lbl>
        <Select pal={pal} value={data.state} onChange={v=>upd("state",v)} options={US_STATES} placeholder="Select your state..." />
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>How long have you been homeschooling?</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
          {["0-1 years","2-3 years","4-6 years","7-10 years","10+ years"].map(y=>(
            <PillBtn key={y} label={y} active={data.yearsHomeschooling===y} onClick={()=>upd("yearsHomeschooling",y)} pal={pal} />
          ))}
        </div>
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>Choose your app theme</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.42rem"}}>
          {PRESET_PALETTES.filter(p=>!p.isCustom).map(p=>{
            const t=buildTheme(p.a,p.b);
            const sel=data.paletteId===p.id;
            return (
              <button key={p.id} onClick={()=>upd("paletteId",p.id)} style={{padding:"0.55rem 0.4rem",borderRadius:"12px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.14s"}}>
                <div style={{height:"22px",borderRadius:"6px",background:`linear-gradient(90deg,${p.a},${lerpHex(p.a,p.b,0.5)},${p.b})`,marginBottom:"0.28rem"}}/>
                <div style={{fontSize:"0.65rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM}}>{p.emoji} {p.name}</div>
              </button>
            );
          })}
        </div>
        <Btn pal={pal} disabled={!canNext} onClick={onNext} style={{marginTop:"1.4rem"}}>{"Let's go ->"}</Btn>
      </div>
    </div>
  );
}

/* --- STEP 1: Children --- */
function OnbChildren({ pal, data, upd, onNext }) {
  const addChild = () => upd("children",[...data.children,{id:uid(),name:"",grade:"1st",avatar:"🌻"}]);
  const remChild = id  => upd("children",data.children.filter(c=>c.id!==id));
  const updChild = (id,k,v) => upd("children",data.children.map(c=>c.id===id?{...c,[k]:v}:c));
  const canNext = data.children.length>0 && data.children.every(c=>c.name.trim().length>0);

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="👨👩👧👦" title="Your Children" sub={"Add each child you're homeschooling."} />
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1rem"}}>
        {data.children.map((c,i)=>(
          <div key={c.id} style={{background:pal.linen,borderRadius:"18px",padding:"1rem 1.1rem",border:`1.5px solid ${pal.stone}50`,animation:"slideRight 0.2s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
              <span style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem"}}>Child {i+1}</span>
              {data.children.length>1 && (
                <button onClick={()=>remChild(c.id)} style={{background:"transparent",border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.8rem",padding:"0.1rem 0.35rem"}}>x Remove</button>
              )}
            </div>
            {/* Avatar picker */}
            <Lbl pal={pal}>Pick an avatar</Lbl>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
              {AVATARS.map(av=>(
                <button key={av} onClick={()=>updChild(c.id,"avatar",av)} style={{width:"36px",height:"36px",borderRadius:"9px",border:`2px solid ${c.avatar===av?pal.primary:pal.stone+"50"}`,background:c.avatar===av?pal.pale:"transparent",cursor:"pointer",fontSize:"1.3rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>{av}</button>
              ))}
            </div>
            {/* Color theme picker */}
            <Lbl pal={pal}>Pick a color theme</Lbl>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
              {CHILD_COLOR_PALETTES.map(cp=>{
                const sel=(c.colorId||"sunshine")===cp.id;
                return (
                  <button key={cp.id} onClick={()=>updChild(c.id,"colorId",cp.id)}
                    style={{padding:"0.3rem 0.6rem",borderRadius:"20px",border:`2px solid ${sel?"#333":"transparent"}`,background:`linear-gradient(90deg,${cp.c1},${cp.c2})`,cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem",transition:"all 0.13s",boxShadow:sel?"0 0 0 2px #fff, 0 0 0 4px #333":"none"}}>
                    <span style={{fontSize:"0.7rem",fontWeight:"800",color:"#fff",textShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>{cp.name}</span>
                  </button>
                );
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.65rem"}}>
              <div>
                <Lbl pal={pal}>First Name</Lbl>
                <Input pal={pal} value={c.name} onChange={v=>updChild(c.id,"name",v)} placeholder="e.g. Emma" />
              </div>
              <div>
                <Lbl pal={pal}>Last Name</Lbl>
                <Input pal={pal} value={c.lastName||""} onChange={v=>updChild(c.id,"lastName",v)} placeholder="e.g. Smith" />
              </div>
              <div>
                <Lbl pal={pal}>Grade</Lbl>
                <Select pal={pal} value={c.grade} onChange={v=>updChild(c.id,"grade",v)} options={GRADES} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addChild} style={{width:"100%",padding:"0.75rem",border:`2px dashed ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.slate,fontSize:"0.84rem",fontWeight:"600",cursor:"pointer",marginBottom:"1.1rem"}}>
        + Add another child
      </button>
      <Btn pal={pal} disabled={!canNext} onClick={onNext}>{"Next →"}</Btn>
    </div>
  );
}

/* --- STEP 2: Learning Philosophy (multi-select) --- */
function OnbPhilosophy({ pal, data, upd, onNext }) {
  const toggle = id => {
    const cur = data.curriculumStyle || [];
    upd("curriculumStyle", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };
  const sel = data.curriculumStyle || [];
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📚" title="Learning Philosophy" sub="How does your family like to learn? Pick all that apply - most families blend a few!" />
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.2rem"}}>
        {LEARNING_PHILOSOPHIES.map(s=>{
          const isSelected = sel.includes(s.id);
          return (
            <button key={s.id} onClick={()=>toggle(s.id)} style={{padding:"0.85rem 1rem",border:`2px solid ${isSelected?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:isSelected?pal.pale:"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:"0.75rem",alignItems:"center",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.4rem",flexShrink:0}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:isSelected?pal.primary:pal.ink,fontSize:"0.86rem"}}>{s.label}</div>
                <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{s.desc}</div>
              </div>
              <div style={{width:"19px",height:"19px",borderRadius:"4px",border:`2px solid ${isSelected?pal.primary:pal.stone}`,background:isSelected?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {isSelected&&<span style={{color:pal.onDark,fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <Btn pal={pal} disabled={sel.length===0} onClick={onNext}>{"Next →"}</Btn>
    </div>
  );
}

/* --- STEP 3: Curriculum Brands (multi-select) --- */
function OnbCurrBrands({ pal, data, upd, onNext }) {
  const [search,    setSearch]    = React.useState("");
  const [showCustom,setShowCustom]= React.useState(false);
  const [custName,  setCustName]  = React.useState("");
  const [custUrl,   setCustUrl]   = React.useState("");
  const [fetching,  setFetching]  = React.useState(false);
  const [fetchMsg,  setFetchMsg]  = React.useState("");
  const [fetchDone, setFetchDone] = React.useState(false);

  const sel     = data.curriculumBrands || [];
  const customs = data.customCurriculums || [];

  const toggle = id => {
    upd("curriculumBrands", sel.includes(id) ? sel.filter(x=>x!==id) : [...sel, id]);
  };

  const filtered = search.trim()
    ? CURRICULUM_BRANDS.filter(s=>s.label.toLowerCase().includes(search.toLowerCase())||s.desc.toLowerCase().includes(search.toLowerCase()))
    : CURRICULUM_BRANDS;

  const addCustom = async () => {
    const name = custName.trim();
    const url  = custUrl.trim();
    if(!name || !url) return;
    const id = "custom_curr_" + name.toLowerCase().replace(/\s+/g,"_");
    // Save immediately
    const entry = {id, label:name, url, icon:"📘", desc:"Custom curriculum", summary:""};
    const updated = [...customs.filter(c=>c.id!==id), entry];
    upd("customCurriculums", updated);
    upd("curriculumBrands", [...sel.filter(x=>x!==id), id]);
    // Now fetch the website via Anthropic API to learn about it
    setFetching(true);
    setFetchMsg("Checking out " + name + "’s website…");
    setFetchDone(false);
    try {
      const fetchKey = (() => { try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
      if(!fetchKey) { setFetchMsg("Add an API key in Settings to use AI features."); setFetchDone(true); return; }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":fetchKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:600,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{
            role:"user",
            content:"Please visit " + url + " and give me a 2-3 sentence summary of what this homeschool curriculum covers, its teaching philosophy, grade levels, and what makes it unique. Be concise and practical — this is for a homeschool parent profile."
          }]
        })
      });
      const d = await res.json();
      const summary = d.content?.filter(b=>b.type==="text").map(b=>b.text).join(" ").trim()||"";
      if(summary) {
        const withSummary = [...customs.filter(c=>c.id!==id), {...entry, summary}];
        upd("customCurriculums", withSummary);
        setFetchMsg("✓ Got it! " + name + " has been added to your profile.");
      } else {
        setFetchMsg("✓ Added! We couldn’t pull details from the site, but your curriculum is saved.");
      }
      setFetchDone(true);
    } catch(e) {
      setFetchMsg("✓ Added! The website lookup didn’t load, but your curriculum is saved.");
      setFetchDone(true);
    }
    setFetching(false);
    setCustName("");
    setCustUrl("");
    setShowCustom(false);
  };

  const removeCustom = id => {
    upd("customCurriculums", customs.filter(c=>c.id!==id));
    upd("curriculumBrands", sel.filter(x=>x!==id));
  };

  const urlValid = custUrl.trim().startsWith("http")||custUrl.trim().startsWith("www");

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📖" title="Curriculum Programs" sub="Select everything you use. We will tailor your experience to fit how you already teach." />

      {/* Search */}
      <div style={{position:"relative",marginBottom:"0.85rem"}}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search curriculums…"
          style={{width:"100%",padding:"0.6rem 0.85rem 0.6rem 2.2rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=pal.primary}
          onBlur={e=>e.target.style.borderColor=pal.stone}
        />
        <span style={{position:"absolute",left:"0.7rem",top:"50%",transform:"translateY(-50%)",fontSize:"0.9rem",pointerEvents:"none"}}>🔍</span>
      </div>

      {/* AI fetch result banner */}
      {fetchMsg&&(
        <div style={{background:fetchDone?pal.goodBg:pal.pale,border:`1.5px solid ${fetchDone?pal.good:pal.primary}40`,borderRadius:"11px",padding:"0.65rem 0.9rem",marginBottom:"0.85rem",fontSize:"0.8rem",color:fetchDone?pal.good:pal.primary,fontWeight:"600"}}>
          {fetching&&<span style={{marginRight:"6px"}}>⏳</span>}{fetchMsg}
        </div>
      )}

      {/* Custom curriculums added */}
      {customs.length>0&&(
        <div style={{marginBottom:"0.75rem"}}>
          <div style={{fontSize:"0.65rem",fontWeight:"800",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.4rem"}}>Your Custom Curriculums</div>
          {customs.map(c=>(
            <div key={c.id} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start",padding:"0.6rem 0.85rem",background:pal.pale,borderRadius:"11px",border:`2px solid ${pal.primary}40`,marginBottom:"0.35rem"}}>
              <span style={{fontSize:"1.1rem",flexShrink:0}}>{c.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.84rem"}}>{c.label}</div>
                {c.summary&&<div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px",lineHeight:1.5}}>{c.summary}</div>}
                {c.url&&<div style={{fontSize:"0.68rem",color:pal.mid,marginTop:"2px"}}>{c.url}</div>}
              </div>
              <button onClick={()=>removeCustom(c.id)} style={{background:"transparent",border:"none",color:pal.bad,fontSize:"0.8rem",cursor:"pointer",padding:"2px 4px",flexShrink:0}}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Brand list */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"0.85rem"}}>
        {filtered.map(s=>{
          const isSelected = sel.includes(s.id);
          return (
            <button key={s.id} onClick={()=>toggle(s.id)}
              style={{padding:"0.75rem 0.9rem",border:`2px solid ${isSelected?pal.accent:pal.stone+"50"}`,borderRadius:"13px",background:isSelected?pal.paleMid:"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:"0.7rem",alignItems:"center",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.25rem",flexShrink:0}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:isSelected?pal.accentD:pal.ink,fontSize:"0.84rem"}}>{s.label}</div>
                <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{s.desc}</div>
              </div>
              <div style={{width:"19px",height:"19px",borderRadius:"4px",border:`2px solid ${isSelected?pal.accent:pal.stone}`,background:isSelected?pal.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,flexShrink:0}}>
                {isSelected&&<span style={{color:pal.onDark,fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
              </div>
            </button>
          );
        })}
        {filtered.length===0&&<div style={{padding:"1rem",textAlign:"center",color:pal.slate,fontSize:"0.82rem"}}>No results for {"“"}{search}{"”"}</div>}
      </div>

      {/* Add custom curriculum */}
      {!showCustom?(
        <button onClick={()=>setShowCustom(true)}
          style={{width:"100%",padding:"0.75rem",border:`2px dashed ${pal.primary}50`,borderRadius:"13px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.84rem",cursor:"pointer",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
          <span>+</span> Add a curriculum not listed
        </button>
      ):(
        <div style={{background:pal.pale,borderRadius:"14px",padding:"1rem",border:`2px solid ${pal.primary}30`,marginBottom:"1rem"}}>
          <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.84rem",marginBottom:"0.75rem"}}>Add your curriculum</div>
          <Lbl pal={pal}>Curriculum name *</Lbl>
          <input value={custName} onChange={e=>setCustName(e.target.value)}
            placeholder="e.g. My Homeschool Hub"
            style={{width:"100%",padding:"0.6rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:"#fff",color:pal.ink,outline:"none",fontFamily:"inherit",marginBottom:"0.65rem"}}
            onFocus={e=>e.target.style.borderColor=pal.primary}
            onBlur={e=>e.target.style.borderColor=pal.stone}
          />
          <Lbl pal={pal}>Website URL * <span style={{fontSize:"0.68rem",color:pal.slate,fontWeight:"400"}}>(required — Root {"&"} Bloom will check it out)</span></Lbl>
          <input value={custUrl} onChange={e=>setCustUrl(e.target.value)}
            placeholder="https://www.yourcurriculum.com"
            type="url"
            style={{width:"100%",padding:"0.6rem 0.85rem",border:`2px solid ${urlValid||!custUrl?pal.stone:pal.bad}`,borderRadius:"10px",fontSize:"0.82rem",background:"#fff",color:pal.ink,outline:"none",fontFamily:"inherit",marginBottom:"0.75rem"}}
            onFocus={e=>e.target.style.borderColor=pal.primary}
            onBlur={e=>e.target.style.borderColor=(urlValid||!custUrl)?pal.stone:pal.bad}
          />
          {custUrl&&!urlValid&&<div style={{fontSize:"0.72rem",color:pal.bad,marginTop:"-0.5rem",marginBottom:"0.5rem"}}>Please enter a valid URL starting with https://</div>}
          <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.75rem",lineHeight:1.5}}>
            🤖 Root {"&"} Bloom will visit the website and learn about this curriculum so it can give you better suggestions and planning help.
          </div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button onClick={()=>{setShowCustom(false);setCustName("");setCustUrl("");}}
              style={{padding:"0.6rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>Cancel</button>
            <button onClick={addCustom} disabled={!custName.trim()||!urlValid||fetching}
              style={{flex:1,padding:"0.6rem",border:"none",borderRadius:"10px",background:custName.trim()&&urlValid&&!fetching?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:custName.trim()&&urlValid&&!fetching?"pointer":"default"}}>
              {fetching?"Fetching…":"Add + Let AI Learn"}
            </button>
          </div>
        </div>
      )}

      <Btn pal={pal} onClick={onNext}>{"Next →"}</Btn>
    </div>
  );
}

/* --- STEP 4: Subjects --- */
function OnbSubjects({ pal, data, upd, onNext }) {
  const [customInput, setCustomInput] = React.useState("");
  const toggleSubj = id => {
    const cur = data.subjects || [];
    upd("subjects", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };
  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    const id = "custom_" + val.toLowerCase().replace(/\s+/g,"_");
    const cur = data.subjects || [];
    const customs = data.customSubjects || [];
    if (!customs.find(c=>c.id===id)) {
      upd("customSubjects", [...customs, {id, label:val, icon:"📐"}]);
    }
    if (!cur.includes(id)) upd("subjects", [...cur, id]);
    setCustomInput("");
  };
  const removeCustom = (id) => {
    upd("customSubjects", (data.customSubjects||[]).filter(c=>c.id!==id));
    upd("subjects", (data.subjects||[]).filter(s=>s!==id));
  };
  const sel = data.subjects || [];
  const allSubjects = [...SUBJECT_OPTIONS, ...(data.customSubjects||[])];
  // Auto-highlight subjects covered at co-op
  const coopClassNames = (data.coopClasses||[]).map(c=>c.toLowerCase().trim());
  const isCoopSubj = (s) => coopClassNames.some(c=>c===s.label.toLowerCase().trim());
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🔬" title="Your Subjects" sub="Pick everything you teach. You can always add or remove later." />
      {coopClassNames.length>0&&(
        <div style={{background:"#f5f3ff",borderRadius:"12px",padding:"0.55rem 0.85rem",marginBottom:"0.75rem",border:"1.5px solid #c4b5fd",fontSize:"0.72rem",color:"#7c3aed",fontWeight:"600"}}>
          {"🏫 Subjects marked Co-op are taught at your co-op — tap to include them in your subject list too."}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.45rem",marginBottom:"0.85rem"}}>
        {allSubjects.map(s=>{
          const isSelected = sel.includes(s.id);
          const isCustom = s.id.startsWith("custom_");
          const isCoop = isCoopSubj(s);
          const COOP_C="#7c3aed";const borderColor = isCoop?"#c4b5fd":isSelected?pal.primary:pal.stone+"50";
          const bgColor = isCoop?"#f5f3ff":isSelected?pal.pale:"transparent";
          return (
            <button key={s.id} onClick={()=>toggleSubj(s.id)} style={{padding:"0.7rem 0.75rem",border:`2px solid ${borderColor}`,borderRadius:"12px",background:bgColor,cursor:"pointer",textAlign:"left",display:"flex",gap:"0.5rem",alignItems:"center",transition:"all 0.13s",position:"relative"}}>
              <span style={{fontSize:"1.15rem",flexShrink:0}}>{s.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontWeight:isSelected?"700":"400",color:isCoop?COOP_C:isSelected?pal.primary:pal.inkM,fontSize:"0.78rem"}}>{s.label}</span>
                {isCoop&&<div style={{fontSize:"0.58rem",fontWeight:"800",color:COOP_C,letterSpacing:"0.04em",marginTop:"1px"}}>{"🏫 CO-OP"}</div>}
              </div>
              {isSelected && !isCustom && <span style={{color:pal.primary,fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
              {isCustom && <span onClick={e=>{e.stopPropagation();removeCustom(s.id);}} style={{fontSize:"0.65rem",color:pal.bad,fontWeight:"900",cursor:"pointer",padding:"0 2px"}}>x</span>}
            </button>
          );
        })}
      </div>
      {/* Custom subject adder */}
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.2rem",alignItems:"center"}}>
        <input
          value={customInput}
          onChange={e=>setCustomInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addCustom()}
          placeholder="Add your own subject..."
          style={{flex:1,padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=pal.primary}
          onBlur={e=>e.target.style.borderColor=pal.stone}
        />
        <button onClick={addCustom} disabled={!customInput.trim()} style={{padding:"0.62rem 1rem",border:"none",borderRadius:"11px",background:customInput.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:customInput.trim()?"pointer":"default",whiteSpace:"nowrap",flexShrink:0}}>
          + Add
        </button>
      </div>
<Btn pal={pal} disabled={sel.length===0} onClick={onNext}>{"Next →"}</Btn>
    </div>
  );
}

/* --- STEP 8: Life Ready --- */
function OnbLifeReady({ pal, data, upd, onNext }) {
  const opted = data.lifeReady === true;
  const freq  = data.lifeReadyFreq || "monday_plus_practice";
  const selectedCats = data.lifeReadyCategories || LR_CATEGORIES.map(c=>c.id);

  const toggleCat = id => {
    const cur = selectedCats;
    upd("lifeReadyCategories", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur,id]);
  };
  const selectAll  = () => upd("lifeReadyCategories", LR_CATEGORIES.map(c=>c.id));
  const selectNone = () => upd("lifeReadyCategories", []);
  const allSelected = selectedCats.length === LR_CATEGORIES.length;

  return (
    <div style={{animation:"fadeUp 0.25s ease"}}>
      {/* Hero banner */}
      <div style={{background:`linear-gradient(160deg,${LR_COLOR},${LR_COLOR2})`,padding:"2rem 1.4rem 1.5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-30px",top:"-30px",width:"130px",height:"130px",borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",left:"-15px",bottom:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.5rem",animation:"grow 0.4s ease"}}>{LR_ICON}</div>
          <h2 style={{fontFamily:"Georgia",fontSize:"1.55rem",fontWeight:"900",color:"#fff",margin:"0 0 0.35rem",lineHeight:1.2}}>Prepared {"&"} Capable</h2>
          <p style={{color:"rgba(255,255,255,0.78)",fontSize:"0.84rem",margin:"0 0 0.75rem",lineHeight:1.65}}>{"Practical, age-appropriate life skills your kids won't learn from a textbook — but need for real life."}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
            {["First Aid","Food & Water","Home Repair","Navigation","Finance","Resilience"].map(t=>(
              <span key={t} style={{padding:"0.18rem 0.6rem",borderRadius:"20px",background:"rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.9)",fontSize:"0.7rem",fontWeight:"700"}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"1.4rem 1.2rem"}}>
        {/* Yes/No toggle */}
        <div style={{display:"flex",gap:"0.6rem",marginBottom:"1.1rem"}}>
          <button onClick={()=>upd("lifeReady",true)}
            style={{flex:1,padding:"0.9rem",borderRadius:"14px",border:`2px solid ${opted?LR_COLOR:"#ddd"}`,background:opted?LR_COLOR+"18":"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.2rem"}}>🌱</div>
            <div style={{fontWeight:"800",color:opted?LR_COLOR:"#666",fontSize:"0.85rem"}}>Yes! Add it</div>
            <div style={{fontSize:"0.68rem",color:opted?LR_COLOR:"#999",marginTop:"2px"}}>Weekly in our schedule</div>
          </button>
          <button onClick={()=>upd("lifeReady",false)}
            style={{flex:1,padding:"0.9rem",borderRadius:"14px",border:`2px solid ${!opted&&data.lifeReady===false?"#aaa":"#ddd"}`,background:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.2rem"}}>{"👋"}</div>
            <div style={{fontWeight:"800",color:"#666",fontSize:"0.85rem"}}>Not right now</div>
            <div style={{fontSize:"0.68rem",color:"#999",marginTop:"2px"}}>You can add it later</div>
          </button>
        </div>

        {/* Options — only shown if opted in */}
        {opted && (<>
          {/* Sample lesson */}
          <div style={{background:`${LR_COLOR}12`,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`2px solid ${LR_COLOR}25`}}>
            <div style={{fontWeight:"800",color:LR_COLOR,fontSize:"0.8rem",marginBottom:"0.4rem"}}>📋 Example lesson this week</div>
            <div style={{fontWeight:"700",color:"#1a1a1a",fontSize:"0.88rem",marginBottom:"0.25rem"}}>
              {getLRTopicForWeek(data.children?.[0]?.grade||"5th")}
            </div>
            <div style={{fontSize:"0.72rem",color:"#555",lineHeight:1.6}}>
              Age-appropriate for {data.children?.[0]?.name||"your student"} ({data.children?.[0]?.grade||"your grade"}).
              A 30-min lesson on Monday, with 2-3 short practice activities during the week.
            </div>
          </div>

          {/* Schedule frequency */}
          <Lbl pal={pal}>How often?</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
            {[
              ["monday_plus_practice","Monday lesson + practice Tue-Thu","Recommended 🌱"],
              ["monday_only","Monday lesson only","Light touch"],
              ["flexible","Flexible — I will schedule it","Full control"],
            ].map(([id,label,note])=>(
              <button key={id} onClick={()=>upd("lifeReadyFreq",id)}
                style={{padding:"0.7rem 1rem",border:`2px solid ${freq===id?LR_COLOR:pal.stone+"50"}`,borderRadius:"12px",background:freq===id?LR_COLOR+"15":"transparent",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.13s"}}>
                <span style={{fontWeight:freq===id?"700":"400",color:freq===id?LR_COLOR:pal.inkM,fontSize:"0.84rem"}}>{label}</span>
                <span style={{fontSize:"0.68rem",color:freq===id?LR_COLOR:pal.slate,fontWeight:"600"}}>{note}</span>
              </button>
            ))}
          </div>

          {/* Category picks */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.3rem"}}>
            <Lbl pal={pal}>Focus areas</Lbl>
            <button onClick={allSelected?selectNone:selectAll}
              style={{padding:"0.22rem 0.65rem",borderRadius:"20px",border:`1.5px solid ${LR_COLOR}`,background:allSelected?LR_COLOR:"transparent",color:allSelected?"#fff":LR_COLOR,fontWeight:"700",fontSize:"0.7rem",cursor:"pointer"}}>
              {allSelected?"Deselect all":"Select all"}
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.38rem",marginBottom:"1.1rem"}}>
            {LR_CATEGORIES.map(c=>{
              const sel=selectedCats.includes(c.id);
              return (
                <button key={c.id} onClick={()=>toggleCat(c.id)}
                  style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.65rem 0.85rem",border:`2px solid ${sel?LR_COLOR:pal.stone+"50"}`,borderRadius:"11px",background:sel?LR_COLOR+"15":"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                  <span style={{fontSize:"1.2rem",flexShrink:0}}>{c.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:sel?"700":"400",color:sel?LR_COLOR:pal.inkM,fontSize:"0.83rem"}}>{c.label}</div>
                    <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>{c.desc}</div>
                  </div>
                  <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${sel?LR_COLOR:pal.stone}`,background:sel?LR_COLOR:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {sel&&<span style={{color:"#fff",fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </>)}

        <Btn pal={pal} onClick={onNext}>
          {opted?"Finish Setup 🌱":"Skip for now ->"}
        </Btn>
      </div>
    </div>
  );
}

/* --- STEP 5: Lesson Goals --- */
function OnbLessonGoals({ pal, data, upd, onNext }) {
  // lessonGoals = {subjId: {0:n, 1:n, 2:n, 3:n, 4:n}} 0=Mon...4=Fri
  const customSubjs = data.customSubjects||[];
  const allSubjMap  = Object.fromEntries([...SUBJECT_OPTIONS,...customSubjs].map(s=>[s.id,s]));
  const activeSubjs = (data.subjects||[]).map(id=>allSubjMap[id]).filter(Boolean);
  const coopDay     = data.coopDay; // e.g. "Friday"
  const DOW_NAMES   = ["Mon","Tue","Wed","Thu","Fri"];
  const DOW_MAP     = {"Monday":0,"Tuesday":1,"Wednesday":2,"Thursday":3,"Friday":4};
  const coopDow     = DOW_MAP[coopDay]??-1;

  // Initialise goals from existing data or sensible defaults
  const [goals, setGoals] = React.useState(()=>{
    const existing = data.lessonGoals||{};
    const init = {};
    activeSubjs.forEach(s=>{
      init[s.id] = existing[s.id]||{0:1,1:1,2:1,3:1,4:1};
    });
    return init;
  });

  const cycle = (subjId, dow) => {
    setGoals(prev=>{
      const cur = (prev[subjId]||{})[dow]||0;
      const next = cur>=3 ? 0 : cur+1;
      return {...prev,[subjId]:{...(prev[subjId]||{}),[dow]:next}};
    });
  };

  const weeklyTotal = (subjId) =>
    [0,1,2,3,4].reduce((s,d)=>{
      if(d===coopDow) return s;
      return s+(goals[subjId]?.[d]||0);
    },0);

  const save = () => {
    upd("lessonGoals", goals);
    onNext();
  };

  if(activeSubjs.length===0) {
    onNext();
    return null;
  }

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🎯" title="Lesson Goals"
        sub="How many lessons of each subject do you aim to do each day? Tap a number to cycle 0-1-2-3. This helps track your week." />

      <div style={{background:pal.pale,borderRadius:"12px",padding:"0.7rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.74rem",color:pal.inkM,lineHeight:1.6}}>
        {"Tip: 0 means that subject is not planned for that day. Tap each number to cycle through 0 → 1 → 2 → 3. Co-op day (purple) can also be set."}
        {coopDay&&<span>{" Co-op days ("}{coopDay}{") are marked automatically."}</span>}
      </div>

      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"1fr repeat(5,36px)",gap:"0.3rem",marginBottom:"0.4rem",alignItems:"center"}}>
        <div/>
        {DOW_NAMES.map((d,i)=>(
          <div key={d} style={{textAlign:"center",fontSize:"0.62rem",fontWeight:"800",color:i===coopDow?"#7c3aed":pal.slate,textTransform:"uppercase",letterSpacing:"0.05em"}}>{d}</div>
        ))}
      </div>

      {/* Per-subject rows */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.45rem",marginBottom:"1.2rem"}}>
        {activeSubjs.map(s=>{
          const total = weeklyTotal(s.id);
          return (
            <div key={s.id} style={{background:pal.linen,borderRadius:"12px",padding:"0.55rem 0.6rem",border:`1.5px solid ${pal.stone}30`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr repeat(5,36px)",gap:"0.3rem",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.35rem",minWidth:0}}>
                  <span style={{fontSize:"1rem",flexShrink:0}}>{s.icon}</span>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:"0.75rem",fontWeight:"700",color:pal.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</div>
                    <div style={{fontSize:"0.6rem",color:pal.slate}}>{total>0?total+"/wk":"not scheduled"}</div>
                  </div>
                </div>
                {[0,1,2,3,4].map(dow=>{
                  const isCoop = dow===coopDow;
                  const val = isCoop ? null : (goals[s.id]?.[dow]||0);
                  return (
                    <div key={dow} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {isCoop ? (
                        <button onClick={()=>cycle(s.id,dow)}
                          style={{width:"30px",height:"30px",borderRadius:"8px",border:`2px solid ${(goals[s.id]?.[dow]||0)>0?"#c4b5fd":"#e0d0ff"}`,background:(goals[s.id]?.[dow]||0)>0?"#f5f3ff":"#faf8ff",cursor:"pointer",fontWeight:"800",fontSize:"0.75rem",color:(goals[s.id]?.[dow]||0)>0?"#7c3aed":"#c4b5fd",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:0,transition:"all 0.12s",gap:"1px"}}>
                          {(goals[s.id]?.[dow]||0)>0
                            ? <><span style={{fontSize:"0.62rem",fontWeight:"900",color:"#7c3aed"}}>{goals[s.id]?.[dow]}</span><span style={{fontSize:"0.42rem",color:"#7c3aed",fontWeight:"700",letterSpacing:"0.02em",lineHeight:1}}>co-op</span></>
                            : <span style={{fontSize:"0.55rem",color:"#c4b5fd",fontWeight:"700",textAlign:"center",lineHeight:1.2}}>{"co·op"}</span>
                          }
                        </button>
                      ) : (
                        <button onClick={()=>cycle(s.id,dow)}
                          style={{width:"30px",height:"30px",borderRadius:"8px",border:`2px solid ${val>0?pal.primary:pal.stone+"50"}`,background:val>0?pal.pale:"transparent",cursor:"pointer",fontWeight:"800",fontSize:"0.82rem",color:val>0?pal.primary:pal.stone,display:"flex",alignItems:"center",justifyContent:"center",padding:0,transition:"all 0.12s"}}>
                          {val}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",gap:"0.5rem"}}>
        <button onClick={onNext}
          style={{flex:1,padding:"0.72rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.86rem",cursor:"pointer"}}>
          {"Skip →"}
        </button>
        <Btn pal={pal} onClick={save} style={{flex:2}}>{"Save goals →"}</Btn>
      </div>
    </div>
  );
}

/* --- STEP 6: Co-op --- */
function OnbCoop({ pal, data, upd, onNext }) {
  const [classInput, setClassInput] = React.useState("");
  const doesCoop = data.coopFreq && data.coopFreq !== "We don't do co-op";

  const addClass = () => {
    const val = classInput.trim();
    if(!val) return;
    const cur = data.coopClasses||[];
    if(!cur.includes(val)) upd("coopClasses",[...cur,val]);
    setClassInput("");
  };
  const removeClass = (c) => upd("coopClasses",(data.coopClasses||[]).filter(x=>x!==c));

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const TIMES = ["7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM"];
  const SUGGESTED = ["Bible / Faith","Art","Music","Physical Education","Science","History","Literature","Latin","Foreign Language","Drama","Debate","Writing","Math","Cooking","Nature Study"];

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🏫" title="Co-op" sub={"Tell us about your co-op so we can build it into your schedule and records."} />

      {/* Do you co-op? */}
      <div style={{marginBottom:"1rem"}}>
        <Lbl pal={pal}>Do you participate in a co-op or group class?</Lbl>
        <div style={{display:"flex",flexDirection:"column",gap:"0.38rem"}}>
          {COOP_FREQ.map(f=>(
            <button key={f} onClick={()=>upd("coopFreq",f)}
              style={{padding:"0.7rem 1rem",border:`2px solid ${data.coopFreq===f?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.coopFreq===f?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.coopFreq===f?"700":"400",color:data.coopFreq===f?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {doesCoop&&(
        <div style={{animation:"fadeUp 0.2s ease"}}>

          {/* Day */}
          <div style={{marginBottom:"1rem"}}>
            <Lbl pal={pal}>What day do you meet?</Lbl>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
              {DAYS.map(d=>(
                <button key={d} onClick={()=>upd("coopDay",d)}
                  style={{padding:"0.38rem 0.75rem",borderRadius:"20px",border:`2px solid ${data.coopDay===d?pal.primary:pal.stone+"50"}`,background:data.coopDay===d?pal.pale:"transparent",cursor:"pointer",fontSize:"0.78rem",fontWeight:data.coopDay===d?"700":"400",color:data.coopDay===d?pal.primary:pal.inkM,transition:"all 0.13s"}}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Co-op start time is collected on the Schedule page */}

          {/* Which kids */}
          {(data.children||[]).length>1&&(
            <div style={{marginBottom:"1rem"}}>
              <Lbl pal={pal}>Which children attend?</Lbl>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {(data.children||[]).map(c=>{
                  const sel = (data.coopKids||[]).includes(c.id);
                  return (
                    <button key={c.id} onClick={()=>{
                      const cur = data.coopKids||[];
                      upd("coopKids",sel?cur.filter(x=>x!==c.id):[...cur,c.id]);
                    }} style={{padding:"0.35rem 0.75rem",borderRadius:"20px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",fontSize:"0.82rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,display:"flex",alignItems:"center",gap:"0.3rem"}}>
                      <span>{c.avatar}</span><span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Classes covered */}
          <div style={{marginBottom:"1rem"}}>
            <Lbl pal={pal}>What classes or subjects are covered?</Lbl>
            <div style={{fontSize:"0.71rem",color:pal.slate,marginBottom:"0.5rem"}}>These will appear as session options when you log a co-op day.</div>

            {/* Suggestions */}
            <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
              {SUGGESTED.filter(s=>!(data.coopClasses||[]).includes(s)).slice(0,10).map(s=>(
                <button key={s} onClick={()=>upd("coopClasses",[...(data.coopClasses||[]),s])}
                  style={{padding:"0.22rem 0.55rem",borderRadius:"20px",border:`1.5px solid ${pal.stone+"60"}`,background:"transparent",cursor:"pointer",fontSize:"0.72rem",color:pal.inkM,transition:"all 0.12s"}}>
                  + {s}
                </button>
              ))}
            </div>

            {/* Custom class input */}
            <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.55rem"}}>
              <input value={classInput} onChange={e=>setClassInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addClass()}
                placeholder="Add a class..."
                style={{flex:1,padding:"0.5rem 0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                onFocus={e=>e.target.style.borderColor=pal.primary}
                onBlur={e=>e.target.style.borderColor=pal.stone}/>
              <button onClick={addClass}
                style={{padding:"0.5rem 0.85rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.8rem",cursor:"pointer"}}>
                Add
              </button>
            </div>

            {/* Selected classes */}
            {(data.coopClasses||[]).length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                {(data.coopClasses||[]).map(c=>(
                  <div key={c} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.25rem 0.6rem 0.25rem 0.75rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`}}>
                    <span style={{fontSize:"0.76rem",fontWeight:"700",color:pal.primary}}>{c}</span>
                    <button onClick={()=>removeClass(c)}
                      style={{width:"16px",height:"16px",borderRadius:"50%",background:pal.primary+"30",border:"none",color:pal.primary,fontSize:"0.62rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",flexShrink:0}}>
                      {"✕"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Name / group */}
          <div style={{marginBottom:"1rem"}}>
            <Lbl pal={pal}>Co-op group name (optional)</Lbl>
            <Input pal={pal} value={data.coopName||""} onChange={v=>upd("coopName",v)} placeholder={"e.g. Classical Conversations, Umbrella Co-op..."} />
          </div>
        </div>
      )}

      <Btn pal={pal} onClick={onNext}>{doesCoop?"Next →":"Skip →"}</Btn>
    </div>
  );
}

/* --- STEP 7: Goals --- */
function OnbGoals({ pal, data, upd, onNext }) {
  const [customInput, setCustomInput] = React.useState("");
  const toggle = id => upd("goals",(data.goals||[]).includes(id)?(data.goals||[]).filter(g=>g!==id):[...(data.goals||[]),id]);
  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    const id = "custom_" + val.toLowerCase().replace(/\s+/g,"_");
    const customs = data.customGoals || [];
    if (!customs.find(c=>c.id===id)) upd("customGoals",[...customs,{id,label:val,icon:"🌟"}]);
    const cur = data.goals || [];
    if (!cur.includes(id)) upd("goals",[...cur,id]);
    setCustomInput("");
  };
  const removeCustom = id => {
    upd("customGoals",(data.customGoals||[]).filter(g=>g.id!==id));
    upd("goals",(data.goals||[]).filter(g=>g!==id));
  };
  const allGoals = [...GOALS,...(data.customGoals||[])];
  const hasGoals = (data.goals||[]).length>0;
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🌟" title="Your Goals" sub={"Optional — what matters most for your family this year? You can always set or change these later in Settings."} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.85rem"}}>
        {allGoals.map(g=>{
          const sel=(data.goals||[]).includes(g.id);
          const isCustom=g.id.startsWith("custom_");
          return (
            <button key={g.id} onClick={()=>toggle(g.id)} style={{padding:"0.8rem 0.75rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",transition:"all 0.14s",position:"relative"}}>
              <span style={{fontSize:"1.5rem"}}>{g.icon}</span>
              <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM,lineHeight:1.25}}>{g.label}</span>
              {isCustom&&<span onClick={e=>{e.stopPropagation();removeCustom(g.id);}} style={{position:"absolute",top:"4px",right:"6px",fontSize:"0.6rem",color:pal.bad,fontWeight:"900",cursor:"pointer"}}>{"✕"}</span>}
            </button>
          );
        })}
      </div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.2rem",alignItems:"center"}}>
        <input value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()}
          placeholder="Add your own goal..."
          style={{flex:1,padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
        <button onClick={addCustom} disabled={!customInput.trim()} style={{padding:"0.62rem 1rem",border:"none",borderRadius:"11px",background:customInput.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:customInput.trim()?"pointer":"default",flexShrink:0}}>+ Add</button>
      </div>
      <div style={{display:"flex",gap:"0.5rem"}}>
        <button onClick={onNext}
          style={{flex:1,padding:"0.72rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.86rem",cursor:"pointer"}}>
          {"Skip →"}
        </button>
        <Btn pal={pal} onClick={onNext} style={{flex:2}}>{hasGoals?"Next →":"Skip →"}</Btn>
      </div>
    </div>
  );
}

/* --- STEP 5: Life & Extras --- */
function OnbExtras({ pal, data, upd, onNext }) {
  const [customExtra, setCustomExtra] = React.useState("");
  const toggleExtra = v => upd("extracurriculars",data.extracurriculars.includes(v)?data.extracurriculars.filter(e=>e!==v):[...data.extracurriculars,v]);
  // Day picker for each selected extra
  const extraDays = data.extraDays||{}; // {activityName: ["Monday","Wednesday"]}
  const toggleExtraDay = (activity, day) => {
    const cur = extraDays[activity]||[];
    const next = cur.includes(day) ? cur.filter(d=>d!==day) : [...cur, day];
    upd("extraDays", {...extraDays, [activity]: next});
  };
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const addCustomExtra = () => {
    const val = customExtra.trim();
    if(!val) return;
    const custom = data.customExtracurriculars||[];
    if(!custom.includes(val)) upd("customExtracurriculars",[...custom,val]);
    upd("extracurriculars",[...(data.extracurriculars||[]),val]);
    setCustomExtra("");
  };
  const allExtras = [...EXTRACURRICULARS.filter(e=>e!=="None right now"), ...(data.customExtracurriculars||[]), "None right now"];
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🌿" title="Life & Extras" sub="A few last things to personalize your app." />
      <Lbl pal={pal}>Extracurriculars <span style={{fontWeight:"400",color:pal.slate}}>(pick all that apply)</span></Lbl>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.6rem"}}>
        {allExtras.map(e=>(
          <button key={e} onClick={()=>toggleExtra(e)}
            style={{padding:"0.35rem 0.75rem",borderRadius:"20px",border:`2px solid ${data.extracurriculars.includes(e)?pal.primary:pal.stone+"50"}`,background:data.extracurriculars.includes(e)?pal.pale:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem",transition:"all 0.13s"}}>
            {data.extracurriculars.includes(e)&&<span style={{color:pal.primary,fontSize:"0.65rem",fontWeight:"900"}}>✓</span>}
            <span style={{fontWeight:data.extracurriculars.includes(e)?"700":"400",color:data.extracurriculars.includes(e)?pal.primary:pal.inkM,fontSize:"0.78rem"}}>{e}</span>
          </button>
        ))}
      </div>
      {/* Day picker for selected extras */}
      {data.extracurriculars.filter(e=>e!=="None right now").length>0&&(
        <div style={{background:pal.pale,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}22`}}>
          <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem",marginBottom:"0.55rem"}}>{"Which days do these happen?"}</div>
          <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.65rem"}}>{"Tap the days for each activity so we can show them on your schedule."}</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
            {data.extracurriculars.filter(e=>e!=="None right now").map(activity=>(
              <div key={activity}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.3rem"}}>{activity}</div>
                <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap"}}>
                  {DAYS.map(day=>{
                    const sel=(extraDays[activity]||[]).includes(day);
                    return (
                      <button key={day} onClick={()=>toggleExtraDay(activity,day)}
                        style={{padding:"0.3rem 0.6rem",borderRadius:"20px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",fontSize:"0.74rem",fontWeight:sel?"800":"400",color:sel?pal.primary:pal.inkM,transition:"all 0.12s"}}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Custom elective input */}
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"1rem"}}>
        <input value={customExtra} onChange={e=>setCustomExtra(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addCustomExtra()}
          placeholder="Add your own e.g. Karate, Ju-Jitsu, Horse Riding..."
          style={{flex:1,padding:"0.55rem 0.8rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.8rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=pal.primary}
          onBlur={e=>e.target.style.borderColor=pal.stone}/>
        <button onClick={addCustomExtra} disabled={!customExtra.trim()} style={{padding:"0.55rem 0.9rem",border:"none",borderRadius:"11px",background:customExtra.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.8rem",cursor:customExtra.trim()?"pointer":"default",flexShrink:0}}>+ Add</button>
      </div>
      <div style={{height:"0.5rem"}}/>
      <Btn pal={pal} onClick={onNext}>{"Next →"}</Btn>
    </div>
  );
}

/* =======================================
   SETTINGS SCREEN
======================================= */
