import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ─────────────────────────────────────────
   THEME ENGINE (same as v2)
───────────────────────────────────────── */
function lerpHex(a, b, t) {
  const ah=a.replace("#",""), bh=b.replace("#","");
  const ar=parseInt(ah.slice(0,2),16),ag=parseInt(ah.slice(2,4),16),ab=parseInt(ah.slice(4,6),16);
  const br=parseInt(bh.slice(0,2),16),bg=parseInt(bh.slice(2,4),16),bb=parseInt(bh.slice(4,6),16);
  return `#${Math.round(ar+(br-ar)*t).toString(16).padStart(2,"0")}${Math.round(ag+(bg-ag)*t).toString(16).padStart(2,"0")}${Math.round(ab+(bb-ab)*t).toString(16).padStart(2,"0")}`;
}
const lighten = (hex,a) => lerpHex(hex,"#ffffff",a);
const darken  = (hex,a) => lerpHex(hex,"#000000",a);

function buildTheme(a,b) {
  const mid=lerpHex(a,b,0.45), light=lerpHex(a,b,0.75);
  return {
    deep:darken(a,0.15), primary:a, mid, accent:b,
    accentD:darken(b,0.25), pale:lighten(b,0.70), paleMid:lighten(b,0.50),
    sand:lerpHex(lighten(a,0.88),"#fdf8ef",0.5),
    linen:lerpHex(lighten(b,0.92),"#ffffff",0.4),
    parchm:lerpHex(lighten(a,0.82),"#f5ead6",0.5),
    stone:lerpHex(lighten(a,0.55),"#c0b8a8",0.5),
    navGrad:`linear-gradient(160deg,${darken(a,0.15)},${a},${mid})`,
    heroGrad:`linear-gradient(160deg,${darken(a,0.12)},${mid})`,
    accentGrad:`linear-gradient(135deg,${mid},${b})`,
    shimmer:`linear-gradient(90deg,${lighten(b,0.55)},${lighten(a,0.65)},${lighten(b,0.55)})`,
    onDark:"#ffffff", onLight:darken(a,0.55),
    ink:"#1a1408", inkM:"#4a3c2a",
    slate:lerpHex(darken(a,0.05),"#8a7a62",0.55),
    good:lerpHex(b,"#44aa66",0.4), warn:"#c47818", bad:"#a03030",
    goodBg:lighten(lerpHex(b,"#44aa66",0.4),0.75),
    warnBg:"#fef0d0", badBg:"#faeae4",
  };
}

const PRESET_PALETTES = [
  {id:"sage",    name:"Sage",    emoji:"🌱", a:"#2a4a28", b:"#a8c890"},
  {id:"forest",  name:"Forest",  emoji:"🌲", a:"#1e4d2b", b:"#7ecb9a"},
  {id:"desert",  name:"Desert",  emoji:"🌵", a:"#7a3e1a", b:"#e8b870"},
  {id:"ocean",   name:"Ocean",   emoji:"🌊", a:"#0d3d5e", b:"#7ec8d8"},
  {id:"lavender",name:"Lavender",emoji:"💜", a:"#3d2060", b:"#c8a8e8"},
  {id:"rose",    name:"Rose",    emoji:"🌹", a:"#6a1a2e", b:"#e8a0b0"},
  {id:"harvest", name:"Harvest", emoji:"🍂", a:"#5a2e08", b:"#e8c070"},
  {id:"slate",   name:"Slate",   emoji:"🪨", a:"#1e2a38", b:"#90aac0"},
  {id:"custom",  name:"Custom",  emoji:"✨", a:"#1e4d2b", b:"#7ecb9a", isCustom:true},
];

/* ─── CONSTANTS ─── */
const LEARNING_PHILOSOPHIES = [
  {id:"classical",   label:"Classical",        icon:"🏛️", desc:"Trivium — grammar, logic, rhetoric"},
  {id:"charlotte",   label:"Charlotte Mason",  icon:"🌿", desc:"Living books, nature study, narration"},
  {id:"classical_c", label:"Classical Conv.",  icon:"🔁", desc:"Memory work & weekly co-op"},
  {id:"traditional", label:"Traditional",      icon:"📐", desc:"Textbook-based, structured learning"},
  {id:"unit",        label:"Unit Studies",     icon:"🔭", desc:"Deep dives into one topic at a time"},
  {id:"waldorf",     label:"Waldorf",          icon:"🎨", desc:"Arts-based, whole-child approach"},
  {id:"montessori",  label:"Montessori",       icon:"🌸", desc:"Self-directed, hands-on learning"},
  {id:"eclectic",    label:"Eclectic",         icon:"🧩", desc:"Mix of whatever works best for us"},
  {id:"unschooling", label:"Unschooling",      icon:"🌱", desc:"Child-led, interest-based"},
  {id:"ai",          label:"Let Stem & Bloom Decide",   icon:"✨", desc:"Let Stem & Bloom build our curriculum"},
];

const CURRICULUM_BRANDS = [
  {id:"tgatb",   label:"The Good and the Beautiful", icon:"📖", desc:"Faith-based, beautifully designed"},
  {id:"abeka",   label:"Abeka",                      icon:"📚", desc:"Traditional Christian textbooks"},
  {id:"mfw",     label:"My Father's World",          icon:"✝️", desc:"Faith-based unit studies"},
  {id:"sonlight",label:"Sonlight",                   icon:"🌎", desc:"Literature-rich, global focus"},
  {id:"bju",     label:"Bob Jones University Press", icon:"🎓", desc:"Comprehensive Christian curriculum"},
  {id:"saxon",   label:"Saxon Math",                 icon:"➕", desc:"Incremental math program"},
  {id:"moh",     label:"Mystery of History",         icon:"🏺", desc:"Chronological world history"},
  {id:"aop",     label:"Alpha Omega",                icon:"🔤", desc:"Worktexts & digital learning"},
  {id:"acellus", label:"Acellus / IONS",             icon:"💻", desc:"Video-based online school"},
  {id:"other",   label:"Other / Custom",             icon:"📝", desc:"Something not listed here"},
  {id:"none",    label:"No Boxed Curriculum",        icon:"🆓", desc:"We build our own resources"},
];

const SUBJECT_OPTIONS = [
  {id:"bible",    label:"Bible / Faith",     icon:"✝️"},
  {id:"math",     label:"Math",              icon:"📐"},
  {id:"reading",  label:"Reading",           icon:"📖"},
  {id:"language", label:"Language Arts",     icon:"✍️"},
  {id:"science",  label:"Science",           icon:"🔬"},
  {id:"history",  label:"History",           icon:"🏛️"},
  {id:"geography",label:"Geography",         icon:"🌍"},
  {id:"art",      label:"Art",               icon:"🎨"},
  {id:"music",    label:"Music",             icon:"🎵"},
  {id:"pe",       label:"PE / Movement",     icon:"⚽"},
  {id:"latin",    label:"Latin",             icon:"📜"},
  {id:"foreign",  label:"Foreign Language",  icon:"🗣️"},
  {id:"nature",   label:"Nature Study",      icon:"🌿"},
  {id:"lifeskill",label:"Life Skills",       icon:"🏠"},
  {id:"typing",   label:"Typing / Tech",     icon:"💻"},
];
const SESSION_LENGTHS = ["20 min","30 min","45 min","60 min","90 min"];

"Monday–Friday","Monday–Thursday","Tuesday–Friday","Mon/Wed/Fri","Tue/Thu"];
const BREAK_STYLES = ["Short breaks every hour","Long lunch break","Flexible — varies daily","No set breaks"];
const GOALS = [
  {id:"faith",     label:"Faith & Character",   icon:"✝️"},
  {id:"college",   label:"College Prep",         icon:"🎓"},
  {id:"stem",      label:"STEM Focus",           icon:"🔬"},
  {id:"arts",      label:"Arts & Creativity",    icon:"🎨"},
  {id:"reading",   label:"Strong Readers",       icon:"📖"},
  {id:"writing",   label:"Confident Writers",    icon:"✍️"},
  {id:"life",      label:"Life Skills",          icon:"🏠"},
  {id:"nature",    label:"Nature & Outdoors",    icon:"🌿"},
  {id:"music",     label:"Music",                icon:"🎵"},
  {id:"sports",    label:"Sports & Fitness",     icon:"⚽"},
  {id:"social",    label:"Social & Community",   icon:"🤝"},
  {id:"worldview", label:"Biblical Worldview",   icon:"🌍"},
];

const COOP_FREQ = ["We don't do co-op","Once a week","Every other week","Once a month","Seasonally"];
const EXTRACURRICULARS = ["Sports","Music lessons","Dance","Art classes","Scouting","4-H","Theater","None right now"];
const AVATARS = ["🌻","🌿","🌺","🦋","🌙","⭐","🐝","🦊","🐢","🌈","🍀","🦜"];
const GRADES  = ["Pre-K","K","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C."];

/* ─── SECTION DEFINITIONS ─── */
const ALL_SECTIONS = [
  {id:"home",       label:"Home",       icon:"🏡", locked:true },
  {id:"schedule",   label:"Schedule",   icon:"📅", locked:true },
  {id:"learn",      label:"Learn",      icon:"📚", locked:false},
  {id:"portfolio",  label:"Portfolio",  icon:"🗂️", locked:true },
  {id:"attendance", label:"Attendance", icon:"📋", locked:false},
  {id:"coop",       label:"Co-op",      icon:"🏫", locked:false},
  {id:"transcripts",label:"Records",    icon:"🎓", locked:false},
  {id:"more",       label:"More",       icon:"⋯",  locked:false},
];

const greet = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };
const today = () => new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
const h12   = t => { const [h,m]=t.split(":"); const hh=+h; return `${hh>12?hh-12:hh||12}:${m}${hh>=12?"pm":"am"}`; };
const uid   = () => Math.random().toString(36).slice(2,8);

/* ═══════════════════════════ ROOT ═══════════════════════════ */
export default function StemAndBloom() {
  const [family,         setFamily]         = useState(null);
  const [view,           setView]           = useState("splash"); // splash|onboarding|parent|student|settings
  const [activeTab,      setActiveTab]      = useState("home");
  const [navIds,         setNavIds]         = useState(["home","schedule","portfolio"]);
  const [childFilt,      setChildFilt]      = useState("all");
  const [checkin,        setCheckin]        = useState(false);
  const [showTheme,      setShowTheme]      = useState(false);
  const [showNav,        setShowNav]        = useState(false);
  const [showSwitcher,   setShowSwitcher]   = useState(false);
  const [learnTab,       setLearnTab]       = useState("curriculum");
  const [activeStudent,  setActiveStudent]  = useState(null);
  const [portfolioEntries,setPortfolioEntries]=useState([
    {id:"p1",childIdx:0,title:"Civil War Essay",     subj:"History", date:"Mar 3",  thumb:"📜", note:"Wrote 3 paragraphs about the causes."},
    {id:"p2",childIdx:1,title:"Multiplication Art",  subj:"Math",    date:"Mar 5",  thumb:"🎨", note:"Used arrays with colored tiles."},
    {id:"p3",childIdx:0,title:"Microscope Lab",      subj:"Science", date:"Mar 7",  thumb:"🔬", note:"Observed onion cells up close."},
    {id:"p4",childIdx:2,title:"Sight Word Book",     subj:"Reading", date:"Mar 8",  thumb:"📖", note:"Read 12 new sight words!"},
  ]);
  const [coopLog, setCoopLog] = useState([]);
  // ── Round 3: Attendance + Schedule connection ──
  const [attendanceDays,    setAttendanceDays]    = useState(127); // days logged so far
  const [pendingSchedDays,  setPendingSchedDays]  = useState(1);   // days from schedule awaiting confirm
  const [showSchedConfirm,  setShowSchedConfirm]  = useState(false);
  const [showCatchup,       setShowCatchup]       = useState(false);
  const [showAIChat,     setShowAIChat]     = useState(false);
  const [paletteId, setPaletteId] = useState("sage");
  const [customA,   setCustomA]   = useState("#2a4a28");
  const [customB,   setCustomB]   = useState("#a8c890");

  const pal = useMemo(() => {
    const p = PRESET_PALETTES.find(p=>p.id===paletteId)||PRESET_PALETTES[0];
    return buildTheme(p.isCustom?customA:p.a, p.isCustom?customB:p.b);
  }, [paletteId,customA,customB]);

  const navTabs = ALL_SECTIONS.filter(s=>navIds.includes(s.id));

  const handleSplash     = () => setView(family?"parent":"onboarding");
  const finishOnboarding = (data) => { setFamily(data); setPaletteId(data.paletteId||"sage"); setView("parent"); };
  const openSettings     = () => setView("settings");
  const closeSettings    = () => setView("parent");
  const switchToStudent  = (child) => { setActiveStudent(child); setShowSwitcher(false); setView("student"); };
  const backToParent     = () => { setActiveStudent(null); setView("parent"); };
  const addPortfolioEntry= (e) => setPortfolioEntries(p=>[{id:uid(),...e},...p]);

  // Today is co-op day if it's a Friday (demo) or already logged
  const isCoop = new Date().getDay()===5;

  return (
    <div style={{
      maxWidth:"430px",margin:"0 auto",minHeight:"100vh",
      background: view==="student" ? "#fff8ee" : pal.sand,
      fontFamily: view==="student"
        ? "'Comic Sans MS','Chalkboard SE',cursive"
        : "'Palatino Linotype','Palatino',Georgia,serif",
      display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"
    }}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{0%{opacity:0;transform:scale(.9)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes grow{from{transform:scale(0.7) rotate(-10deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
        @keyframes starPop{0%{opacity:0;transform:scale(0) rotate(-20deg)}70%{transform:scale(1.25) rotate(5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
        @keyframes confetti{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(60px) rotate(360deg)}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{border-radius:99px}
        input,textarea,select,button{font-family:inherit}
      `}</style>

      {/* ── SPLASH ── */}
      {view==="splash"     && <SplashScreen   pal={pal} onContinue={handleSplash} />}
      {view==="onboarding" && <OnboardingFlow pal={pal} onComplete={finishOnboarding} />}
      {view==="settings"   && <SettingsScreen pal={pal} family={family} setFamily={setFamily}
          paletteId={paletteId} setPaletteId={setPaletteId}
          customA={customA} customB={customB} setCustomA={setCustomA} setCustomB={setCustomB}
          navIds={navIds} setNavIds={setNavIds} onBack={closeSettings} />}

      {/* ── STUDENT PORTAL ── */}
      {view==="student" && activeStudent && family && (
        <StudentPortal
          child={activeStudent}
          family={family}
          pal={pal}
          isCoop={isCoop}
          entries={portfolioEntries.filter((_,i)=> family.children.findIndex(c=>c.id===activeStudent.id) === portfolioEntries.find(e=>e.id===_.id)?.childIdx)}
          allEntries={portfolioEntries}
          onAddEntry={addPortfolioEntry}
          onCoopLog={e=>setCoopLog(l=>[{...e,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})},...l])}
          onBack={backToParent}
        />
      )}

      {/* ── PARENT APP ── */}
      {view==="parent" && family && (<>
        {/* Status bar */}
        <div style={{background:pal.deep,height:"44px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.1rem",flexShrink:0,zIndex:10}}>
          <button onClick={()=>setShowSwitcher(true)} style={{background:"rgba(255,255,255,0.13)",border:"none",borderRadius:"8px",padding:"0.18rem 0.6rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem"}}>
            <span style={{fontSize:"0.75rem"}}>👤</span>
            <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.7)",fontWeight:"700"}}>Switch</span>
          </button>
          <button onClick={()=>setShowTheme(true)} style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"none",border:"none",cursor:"pointer",padding:0}}>
            <span style={{fontSize:"0.9rem"}}>🌱</span>
            <span style={{fontWeight:"800",color:"rgba(255,255,255,0.9)",fontSize:"0.85rem"}}>Stem & Bloom</span>
          </button>
          <button onClick={openSettings} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"7px",padding:"0.18rem 0.55rem",cursor:"pointer",fontSize:"0.65rem",color:"rgba(255,255,255,0.65)",fontWeight:"600"}}>⚙️</button>
        </div>

        {/* Main content */}
        <div style={{flex:1,overflowY:"auto",paddingBottom:"72px"}}>
          {activeTab==="home"        && <HomeScreen        pal={pal} family={family} child={childFilt} setChild={setChildFilt} onCheckin={()=>setCheckin(true)} onTheme={()=>setShowTheme(true)} />}
          {activeTab==="schedule"    && <ScheduleScreen    pal={pal} family={family} child={childFilt} setChild={setChildFilt} onMarkComplete={()=>setShowSchedConfirm(true)} />}
          {activeTab==="learn"       && <LearnScreen       pal={pal} family={family} child={childFilt} setChild={setChildFilt} learnTab={learnTab} setLearnTab={setLearnTab} />}
          {activeTab==="portfolio"   && <PortfolioScreen   pal={pal} family={family} child={childFilt} setChild={setChildFilt} entries={portfolioEntries} />}
          {activeTab==="attendance"  && <AttendanceScreen  pal={pal} family={family} days={attendanceDays} pending={pendingSchedDays} onConfirmPull={()=>{setAttendanceDays(d=>d+pendingSchedDays);setPendingSchedDays(0);setShowSchedConfirm(false);}} onCatchup={()=>setShowCatchup(true)} />}
          {activeTab==="coop"        && <CoopScreen        pal={pal} family={family} coopLog={coopLog} onLog={e=>setCoopLog(l=>[e,...l])} />}
          {activeTab==="transcripts" && <TranscriptsScreen pal={pal} family={family} />}
          {activeTab==="more"        && <MoreScreen        pal={pal} family={family}
              onNav={id=>{ if(id==="settings") openSettings(); else if(navIds.includes(id)) setActiveTab(id); }}
              onTheme={()=>setShowTheme(true)} onNavEdit={()=>setShowNav(true)} onSettings={openSettings} />}
        </div>

        {/* Floating AI Chat Button */}
        <button onClick={()=>setShowAIChat(true)} style={{position:"fixed",bottom:"80px",right:"calc(50% - 205px)",width:"52px",height:"52px",borderRadius:"50%",background:pal.accentGrad,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",zIndex:49,boxShadow:`0 3px 14px ${pal.primary}55`,transition:"transform 0.15s"}}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
          onTouchStart={e=>e.currentTarget.style.transform="scale(0.9)"}
          onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
          ✨
        </button>

        {/* Bottom nav */}
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"430px",background:pal.linen,borderTop:`1.5px solid ${pal.stone}60`,height:"68px",display:"flex",alignItems:"center",zIndex:50}}>
          {navTabs.map(t=>{
            const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"0.4rem 0",border:"none",background:"transparent",cursor:"pointer",position:"relative",transition:"transform 0.1s"}}
                onMouseDown={e=>e.currentTarget.style.transform="scale(0.91)"}
                onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
                onTouchStart={e=>e.currentTarget.style.transform="scale(0.91)"}
                onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
                {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"28px",height:"3px",borderRadius:"0 0 3px 3px",background:pal.accentGrad}}/>}
                <span style={{fontSize:"1.28rem",lineHeight:1}}>{t.icon}</span>
                <span style={{fontSize:"0.59rem",fontWeight:active?"800":"500",color:active?pal.primary:pal.slate,transition:"color 0.15s"}}>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Modals */}
        {showAIChat    && <AIChatModal     pal={pal} family={family} onClose={()=>setShowAIChat(false)} />}
        {showTheme    && <ThemeModal     pal={pal} paletteId={paletteId} setPaletteId={setPaletteId} customA={customA} customB={customB} setCustomA={setCustomA} setCustomB={setCustomB} onClose={()=>setShowTheme(false)} />}
        {showNav      && <NavModal       pal={pal} navIds={navIds} setNavIds={setNavIds} onClose={()=>setShowNav(false)} />}
        {showSwitcher && <ViewSwitcher   pal={pal} family={family} onParent={()=>setShowSwitcher(false)} onStudent={switchToStudent} />}
        {showSchedConfirm && <SchedConfirmModal pal={pal} family={family} days={pendingSchedDays} onConfirm={()=>{setAttendanceDays(d=>d+pendingSchedDays);setPendingSchedDays(0);setShowSchedConfirm(false);}} onClose={()=>setShowSchedConfirm(false)} />}
        {showCatchup  && <CatchupModal   pal={pal} family={family} days={attendanceDays} needed={180} onClose={()=>setShowCatchup(false)} />}
      </>)}
    </div>
  );
}


/* ═══════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════ */
function SplashScreen({ pal, onContinue }) {
  const [ready, setReady] = useState(false);
  useState(()=>{ setTimeout(()=>setReady(true), 300); },[]);
  return (
    <div onClick={onContinue} style={{height:"100vh",background:pal.heroGrad,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:"300px",height:"300px",borderRadius:"50%",background:"rgba(255,255,255,0.04)",top:"-60px",right:"-60px"}}/>
      <div style={{position:"absolute",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(255,255,255,0.03)",bottom:"40px",left:"-40px"}}/>
      <div style={{textAlign:"center",position:"relative",animation:"fadeIn 0.6s ease"}}>
        <div style={{fontSize:"5rem",marginBottom:"1rem",animation:"grow 0.6s ease 0.2s both"}}>🌱</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.4rem",fontWeight:"800",color:"#fff",margin:"0 0 0.3rem",lineHeight:1.1}}>Root &</h1>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.4rem",fontWeight:"800",margin:"0 0 0.6rem",lineHeight:1.1,background:pal.shimmer,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"}}>Bloom</h1>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.88rem",margin:"0 0 2.5rem",letterSpacing:"0.04em"}}>Your homeschool, beautifully organized</p>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",justifyContent:"center",animation:"pulse 2s ease infinite"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
          <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.75rem",letterSpacing:"0.08em"}}>tap to begin</span>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIEW SWITCHER — parent taps "Switch" in status bar
═══════════════════════════════════════ */
function ViewSwitcher({ pal, family, onParent, onStudent }) {
  const CHILD_COLORS = ["#e8943a","#4aabcf","#9b6fc8","#44aa66","#e85a7a"];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.72)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"0 0 1.5rem",animation:"slideUp 0.26s ease",fontFamily:"'Palatino Linotype','Palatino',Georgia,serif"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center"}}><div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/></div>
        <div style={{padding:"0.75rem 1.3rem 1.1rem",borderBottom:`1px solid ${pal.stone}45`}}>
          <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>👤 Switch View</div>
          <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>Who's using the app right now?</div>
        </div>
        <div style={{padding:"1rem 1.3rem 0",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {/* Parent */}
          <button onClick={onParent} style={{padding:"0.9rem 1rem",borderRadius:"16px",border:`2px solid ${pal.primary}25`,background:pal.pale,cursor:"pointer",display:"flex",alignItems:"center",gap:"0.85rem",textAlign:"left"}}>
            <div style={{width:"46px",height:"46px",borderRadius:"13px",background:pal.heroGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>👩</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.92rem"}}>{family.parentName||"Parent"}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>Full dashboard · planning · settings</div>
            </div>
            <span style={{color:pal.primary,fontSize:"1.1rem"}}>›</span>
          </button>
          {/* Children */}
          {family.children.map((c,i)=>{
            const cc=CHILD_COLORS[i%CHILD_COLORS.length];
            return (
              <button key={c.id} onClick={()=>onStudent(c)}
                style={{padding:"0.9rem 1rem",borderRadius:"16px",border:`2px solid ${cc}30`,background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.85rem",textAlign:"left",boxShadow:`0 2px 12px ${cc}15`}}>
                <div style={{width:"46px",height:"46px",borderRadius:"13px",background:`linear-gradient(135deg,${cc}dd,${cc}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.7rem",flexShrink:0}}>{c.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"800",color:"#2a1a08",fontSize:"0.92rem"}}>{c.name}</div>
                  <div style={{fontSize:"0.7rem",color:"#8a7060",marginTop:"1px"}}>{c.grade} · Student view</div>
                </div>
                <span style={{fontSize:"1.1rem",color:cc}}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Student palette constants ─── */
const SK = {
  sky:"#4aabcf", skyL:"#e8f7fc", sun:"#f5c842", sunL:"#fffbe8",
  grass:"#5ab850", grassL:"#edf7eb", orange:"#e8943a", orangeL:"#fff2e8",
  purple:"#9b6fc8", purpleL:"#f3eefb", pink:"#e85a7a", pinkL:"#feeaef",
  cream:"#fff8ee", card:"#ffffff", ink:"#2a1a08", mid:"#6a4a30", lite:"#a08060",
};
const CHILD_HERO_COLORS = [
  ["#e8943a","#f5c842"],["#4aabcf","#5ab850"],["#9b6fc8","#e85a7a"],
  ["#5ab850","#4aabcf"],["#e85a7a","#9b6fc8"],
];

/* ═══════════════════════════════════════
   STUDENT PORTAL — its own complete world
═══════════════════════════════════════ */
function StudentPortal({ child, family, pal, isCoop, allEntries, onAddEntry, onCoopLog, onBack }) {
  const [sTab,     setSTab]     = useState("home");
  const [noteText, setNoteText] = useState("");
  const [noteSaved,setNoteSaved]= useState(false);
  const [points,   setPoints]   = useState(142);
  const [streak,   setStreak]   = useState(7);
  const [showCoopPopup, setShowCoopPopup] = useState(isCoop);
  const [coopDone, setCoopDone] = useState(false);

  const childIdx  = family.children.findIndex(c=>c.id===child.id);
  const myEntries = allEntries.filter(e=>e.childIdx===childIdx);
  const [c1,c2]   = CHILD_HERO_COLORS[childIdx % CHILD_HERO_COLORS.length];
  const heroGrad  = `linear-gradient(135deg,${c1},${c2})`;

  const greetKid  = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };

  const saveNote = () => {
    if(!noteText.trim()) return;
    onAddEntry({childIdx, title:noteText.slice(0,42), subj:"Daily Note", date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), thumb:"✍️", note:noteText});
    setNoteText(""); setNoteSaved(true); setPoints(p=>p+10); setStreak(s=>s);
    setTimeout(()=>setNoteSaved(false),2400);
  };

  const SCHEDULE = generateSchedule(family);

  const STABS = [{id:"home",icon:"🏠",l:"Home"},{id:"today",icon:"📅",l:"Today"},{id:"mywork",icon:"⭐",l:"My Work"},{id:"streak",icon:"🔥",l:"Streak"}];

  return (
    <div style={{minHeight:"100vh",background:SK.cream,fontFamily:"'Comic Sans MS','Chalkboard SE',cursive",display:"flex",flexDirection:"column"}}>
      {/* Kid status bar */}
      <div style={{background:heroGrad,padding:"0.65rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:"9px",padding:"0.22rem 0.6rem",cursor:"pointer",color:"#fff",fontWeight:"800",fontSize:"0.7rem"}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:"0.42rem"}}>
          <span style={{fontSize:"1.1rem"}}>{child.avatar}</span>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"0.88rem"}}>{child.name}'s Space 🌟</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.22)",borderRadius:"9px",padding:"0.2rem 0.55rem",display:"flex",alignItems:"center",gap:"0.3rem"}}>
          <span style={{fontSize:"0.85rem"}}>⭐</span>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"0.78rem"}}>{points}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:"74px"}}>

        {/* ── HOME TAB ── */}
        {sTab==="home" && (
          <div style={{animation:"fadeUp 0.22s ease"}}>
            {/* Big hero */}
            <div style={{background:heroGrad,padding:"1.5rem 1.2rem 2.5rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:"-25px",bottom:"-25px",width:"110px",height:"110px",borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
              <div style={{fontSize:"3.8rem",marginBottom:"0.4rem",animation:"bounce 2.2s ease infinite"}}>{child.avatar}</div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"1.55rem",lineHeight:1.2}}>{greetKid()},<br/>{child.name}! 🌟</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.72)",marginTop:"0.25rem"}}>Ready to learn something awesome?</div>
            </div>

            {/* Floating streak card */}
            <div style={{margin:"-1.1rem 1rem 0",position:"relative",zIndex:2}}>
              <div style={{background:SK.card,borderRadius:"22px",padding:"0.9rem 1.1rem",boxShadow:"0 4px 22px rgba(0,0,0,0.11)",display:"flex",gap:"0.9rem",alignItems:"center"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"14px",background:`linear-gradient(135deg,${SK.orange},${SK.sun})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.9rem",flexShrink:0,animation:"wiggle 3s ease infinite"}}>🔥</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"900",color:SK.ink,fontSize:"1rem"}}>{streak} day streak! 🎉</div>
                  <div style={{fontSize:"0.72rem",color:SK.lite,marginTop:"1px"}}>You've checked in {streak} days in a row</div>
                </div>
                <div style={{fontWeight:"900",color:SK.orange,fontSize:"1.6rem",lineHeight:1}}>{streak}</div>
              </div>
            </div>

            <div style={{padding:"1.3rem 1rem 0"}}>
              {/* What did you learn? */}
              <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.05rem",marginBottom:"0.2rem"}}>✍️ What did you learn today?</div>
                <div style={{fontSize:"0.75rem",color:SK.lite,marginBottom:"0.7rem"}}>Write anything — even one sentence counts!</div>
                <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
                  placeholder="Today I learned that…" rows={3}
                  style={{width:"100%",padding:"0.75rem",border:`2.5px solid ${noteText.length>0?SK.sky:"#ece5dc"}`,borderRadius:"14px",fontSize:"0.88rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",lineHeight:1.6,outline:"none",transition:"border-color 0.18s"}}
                  onFocus={e=>e.target.style.borderColor=SK.sky} onBlur={e=>e.target.style.borderColor=noteText.length>0?SK.sky:"#ece5dc"}
                />
                <button onClick={saveNote} disabled={!noteText.trim()} style={{width:"100%",marginTop:"0.65rem",padding:"0.78rem",border:"none",borderRadius:"13px",background:noteText.trim()?`linear-gradient(135deg,${SK.sky},${SK.grass})`:"#e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.9rem",cursor:noteText.trim()?"pointer":"default",transition:"background 0.2s"}}>
                  {noteSaved ? "✅ Saved! +10 points 🎉" : "Save it! ✨"}
                </button>
              </div>

              {/* Today peek */}
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.92rem",marginBottom:"0.6rem"}}>📅 Today's plan</div>
              {SCHEDULE.slice(0,4).map((b,i)=>(
                <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.65rem 0.9rem",display:"flex",gap:"0.65rem",alignItems:"center",marginBottom:"0.42rem",boxShadow:"0 1px 7px rgba(0,0,0,0.05)"}}>
                  <div style={{width:"34px",height:"34px",borderRadius:"9px",background:SK.skyL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{b.i}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem"}}>{b.s}</div><div style={{fontSize:"0.68rem",color:SK.lite}}>{b.dur} min</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TODAY TAB ── */}
        {sTab==="today" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"1rem"}}>📅 My Schedule Today</div>
            {SCHEDULE.map((b,i)=>(
              <div key={i} style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",display:"flex",gap:"0.8rem",alignItems:"center",marginBottom:"0.55rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`2px solid ${SK.skyL}`}}>
                <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`linear-gradient(135deg,${c1}88,${c2}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{b.i}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.9rem"}}>{b.s}</div>
                  <div style={{fontSize:"0.72rem",color:SK.lite}}>{b.dur} min · {b.t}</div>
                </div>
                <div style={{width:"30px",height:"30px",borderRadius:"50%",border:`2.5px solid #ddd`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",color:"#ccc",cursor:"pointer",flexShrink:0,transition:"all 0.14s"}}
                  onClick={e=>{e.currentTarget.style.background=c1;e.currentTarget.style.borderColor=c1;e.currentTarget.style.color="#fff";e.currentTarget.textContent="✓";}}>
                  ✓
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MY WORK TAB ── */}
        {sTab==="mywork" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"1rem"}}>⭐ My Work</div>
            {myEntries.length===0 ? (
              <div style={{background:SK.card,borderRadius:"22px",padding:"2.2rem 1.5rem",textAlign:"center",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"bounce 2s ease infinite"}}>🌱</div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1rem",marginBottom:"0.3rem"}}>Nothing here yet!</div>
                <div style={{fontSize:"0.8rem",color:SK.lite,lineHeight:1.65}}>Write what you learned today on the Home tab and it'll show up here.</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                {myEntries.map((p,i)=>(
                  <div key={p.id} style={{background:SK.card,borderRadius:"18px",overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",animation:"popIn 0.28s ease",animationDelay:`${i*0.06}s`,animationFillMode:"both"}}>
                    <div style={{height:"72px",background:`linear-gradient(135deg,${c1}88,${c2}55)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.3rem"}}>{p.thumb}</div>
                    <div style={{padding:"0.65rem 0.75rem"}}>
                      <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.8rem",lineHeight:1.3,marginBottom:"2px"}}>{p.title}</div>
                      <div style={{fontSize:"0.62rem",color:SK.lite}}>{p.subj} · {p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STREAK TAB ── */}
        {sTab==="streak" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"1rem"}}>🔥 Streak & Points</div>
            <div style={{background:`linear-gradient(135deg,${SK.orange},${SK.sun})`,borderRadius:"24px",padding:"1.6rem 1.2rem",textAlign:"center",marginBottom:"0.9rem",boxShadow:`0 6px 28px ${SK.orange}45`}}>
              <div style={{fontSize:"4.5rem",lineHeight:1,marginBottom:"0.3rem",animation:"bounce 1.8s ease infinite"}}>🔥</div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"3.2rem",lineHeight:1}}>{streak}</div>
              <div style={{fontWeight:"700",color:"rgba(255,255,255,0.82)",fontSize:"1rem",marginTop:"0.2rem"}}>day streak</div>
            </div>
            <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",marginBottom:"0.9rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:"1rem"}}>
              <div style={{width:"54px",height:"54px",borderRadius:"14px",background:`linear-gradient(135deg,${SK.sun},${SK.orange}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>⭐</div>
              <div><div style={{fontWeight:"900",color:SK.ink,fontSize:"1.05rem"}}>{points} points total</div><div style={{fontSize:"0.72rem",color:SK.lite}}>+10 pts for every daily note</div></div>
            </div>
            <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.88rem",marginBottom:"0.75rem"}}>This week</div>
              <div style={{display:"flex",gap:"0.5rem",justifyContent:"space-around"}}>
                {["M","T","W","T","F"].map((d,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{width:"40px",height:"40px",borderRadius:"50%",background:i<4?`linear-gradient(135deg,${c1},${c2})`:"#ece5dc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:"4px"}}>{i<4?"✅":"⬜"}</div>
                    <div style={{fontSize:"0.62rem",color:i<4?SK.grass:SK.lite,fontWeight:"700"}}>{d}</div>
                  </div>
                ))}
              </div>
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

      {/* Co-op day auto-popup */}
      {showCoopPopup && !coopDone && (
        <CoopDayPopup
          child={child} heroGrad={heroGrad} c1={c1} c2={c2}
          onLog={note=>{ onCoopLog({childId:child.id,note,session:"Co-op"}); setCoopDone(true); setShowCoopPopup(false); setPoints(p=>p+25); }}
          onDismiss={()=>setShowCoopPopup(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CO-OP DAY AUTO-POPUP (student)
═══════════════════════════════════════ */
function CoopDayPopup({ child, heroGrad, c1, onLog, onDismiss }) {
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const handleSave = () => {
    if(!note.trim()) return;
    onLog(note);
    setDone(true);
    setTimeout(onDismiss, 2200);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.75)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
      <div style={{background:SK.cream,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"1.5rem 1.4rem 2.2rem",animation:"slideUp 0.3s ease"}}>
        {!done ? <>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:"#ddd",margin:"0 auto 1.3rem"}}/>
          <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
            <div style={{fontSize:"3rem",marginBottom:"0.4rem",animation:"bounce 1.8s ease infinite"}}>🏫</div>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.15rem",lineHeight:1.3,marginBottom:"0.25rem"}}>It's Co-op Day, {child.name}! 🎉</div>
            <div style={{fontSize:"0.8rem",color:SK.lite,lineHeight:1.65}}>What's one thing you learned or did at co-op today?</div>
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)}
            placeholder="We did science experiments and I learned…" rows={3} autoFocus
            style={{width:"100%",padding:"0.85rem",border:`2.5px solid ${note.length>0?c1:"#ece5dc"}`,borderRadius:"16px",fontSize:"0.9rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",lineHeight:1.6,outline:"none",marginBottom:"0.8rem"}}
            onFocus={e=>e.target.style.borderColor=c1} onBlur={e=>{ if(!note.length) e.target.style.borderColor="#ece5dc"; }}
          />
          <button onClick={handleSave} disabled={!note.trim()} style={{width:"100%",padding:"0.88rem",border:"none",borderRadius:"15px",background:note.trim()?`linear-gradient(135deg,${SK.sky},${SK.grass})`:"#e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:note.trim()?"pointer":"default",marginBottom:"0.55rem"}}>
            Save it! ✨ +25 points
          </button>
          <button onClick={onDismiss} style={{width:"100%",padding:"0.5rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.78rem",cursor:"pointer"}}>I'll do it later</button>
        </> : (
          <div style={{textAlign:"center",padding:"1.5rem 0"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.65rem",animation:"starPop 0.4s ease"}}>🌟</div>
            <div style={{fontWeight:"900",color:SK.grass,fontSize:"1.1rem",marginBottom:"0.3rem"}}>+25 points! Amazing!</div>
            <div style={{fontSize:"0.82rem",color:SK.lite}}>Your co-op note was saved. Great job today, {child.name}!</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CO-OP QUICK LOG MODAL (parent)
═══════════════════════════════════════ */
function CoopQuickLogModal({ pal, family, onSave, onClose }) {
  const [step,       setStep]       = useState(0);
  const [session,    setSession]    = useState("Classical Conversations");
  const [hrs,        setHrs]        = useState("2");
  const [childNotes, setChildNotes] = useState({});
  const updNote = (id,v)=>setChildNotes(n=>({...n,[id]:v}));
  const canNext1 = true;
  const handleSave = () => { onSave({session,hrs:parseFloat(hrs),notes:childNotes}); setStep(2); };
  const SESSIONS=["Classical Conversations","Art & Nature Study","Science Fair Prep","History co-op","Literature circle","Math enrichment","Other"];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.72)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",boxShadow:"0 -14px 60px rgba(0,0,0,0.3)",animation:"slideUp 0.28s ease",maxHeight:"84vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}><div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/></div>
        <div style={{padding:"0.75rem 1.3rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>⚡ Quick Co-op Log</div><div style={{fontSize:"0.74rem",color:pal.slate}}>About 60 seconds — you've got this.</div></div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem"}}>×</button>
        </div>
        <div style={{display:"flex",gap:"4px",padding:"0.7rem 1.3rem 0",flexShrink:0}}>
          {[0,1,2].map(i=><div key={i} style={{flex:1,height:"4px",borderRadius:"99px",background:i<=step?pal.primary:pal.stone+"50",transition:"background 0.25s"}}/>)}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>
          {step===0&&<>
            <Lbl pal={pal}>Which session?</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:"0.38rem",marginBottom:"1rem"}}>
              {SESSIONS.map(s=><button key={s} onClick={()=>setSession(s)} style={{padding:"0.6rem 0.9rem",border:`2px solid ${session===s?pal.primary:pal.stone+"50"}`,borderRadius:"11px",background:session===s?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:session===s?"700":"400",color:session===s?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s}</button>)}
            </div>
            <Lbl pal={pal}>Hours</Lbl>
            <div style={{display:"flex",gap:"0.4rem"}}>
              {["1","1.5","2","2.5","3","3.5"].map(h=><button key={h} onClick={()=>setHrs(h)} style={{flex:1,padding:"0.55rem 0",borderRadius:"10px",border:`2px solid ${hrs===h?pal.primary:pal.stone+"50"}`,background:hrs===h?pal.pale:"transparent",cursor:"pointer",fontWeight:hrs===h?"800":"400",color:hrs===h?pal.primary:pal.inkM,fontSize:"0.82rem"}}>{h}h</button>)}
            </div>
          </>}
          {step===1&&<>
            <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.6,marginBottom:"0.85rem"}}>One sentence per child — what did they work on?</div>
            {family.children.map(c=>(
              <div key={c.id} style={{marginBottom:"0.75rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.3rem"}}><span>{c.avatar}</span><span style={{fontSize:"0.8rem",fontWeight:"700",color:pal.inkM}}>{c.name}</span></div>
                <textarea value={childNotes[c.id]||""} onChange={e=>updNote(c.id,e.target.value)} placeholder={`What ${c.name} did…`} rows={2}
                  style={{width:"100%",padding:"0.65rem 0.8rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",lineHeight:1.55,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
              </div>
            ))}
          </>}
          {step===2&&<div style={{textAlign:"center",padding:"0.75rem 0"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.6rem"}}>🏫</div>
            <div style={{fontWeight:"800",color:pal.primary,fontSize:"1rem",marginBottom:"0.35rem"}}>Co-op logged!</div>
            <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.7}}>{session} · {hrs}h · saved to attendance, records, and portfolio queue.</div>
          </div>}
        </div>
        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          {step<2?<>
            <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
            <button onClick={()=>step===1?handleSave():setStep(s=>s+1)} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
              {step===0?"Next →":"Save ✓"}
            </button>
          </>:<button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Done 🌱</button>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ONBOARDING FLOW — 6 Steps
═══════════════════════════════════════ */
function OnboardingFlow({ pal, onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    parentName:"", familyName:"", schoolName:"", state:"Tennessee",
    yearsHomeschooling:"0–1 years",
    children:[{id:uid(),name:"",grade:"1st",avatar:"🌻"}],
    curriculumStyle:["eclectic"],
    curriculumBrands:[],
    subjects:["bible","math","reading","language","science","history"],
    sessionLength:"45 min",
    morningGathering:true, morningGatheringName:"Morning Time",
    schoolDays:"Monday–Friday", startTime:"8:00", endTime:"3:00", breakStyle:"Short breaks every hour",
    goals:["faith","reading"],
    coopFreq:"Every other week", extracurriculars:[], choresInSched:false, mealsInSched:false,
    paletteId:"sage",
  });
  const upd = (k,v) => setData(d=>({...d,[k]:v}));
  const STEPS = ["Welcome","Your Children","Learning Style","Curriculum","Subjects","Schedule","Goals","Life & Extras"];
  const pct = Math.round((step/7)*100);

  const STEP_ICONS = ["🌱","👨‍👩‍👧‍👦","📚","📖","🔬","📅","🌟","🌿"];

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column"}}>
      {/* Progress header */}
      {step>0 && (
        <div style={{background:pal.deep,padding:"0.85rem 1.1rem 0.75rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{background:"rgba(255,255,255,0.14)",border:"none",color:"#fff",borderRadius:"50%",width:"28px",height:"28px",cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.55)",fontWeight:"700",letterSpacing:"0.08em",textTransform:"uppercase"}}>{STEP_ICONS[step]} {STEPS[step]}</span>
            <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",fontWeight:"600"}}>{step} of 5</span>
          </div>
          <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.15)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:pal.accentGrad,transition:"width 0.35s ease"}}/>
          </div>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto"}}>
        {step===0 && <OnbWelcome      pal={pal} data={data} upd={upd} onNext={()=>setStep(1)} />}
        {step===1 && <OnbChildren     pal={pal} data={data} upd={upd} onNext={()=>setStep(2)} />}
        {step===2 && <OnbPhilosophy   pal={pal} data={data} upd={upd} onNext={()=>setStep(3)} />}
        {step===3 && <OnbCurrBrands   pal={pal} data={data} upd={upd} onNext={()=>setStep(4)} />}
        {step===4 && <OnbSubjects     pal={pal} data={data} upd={upd} onNext={()=>setStep(5)} />}
        {step===5 && <OnbSchedule     pal={pal} data={data} upd={upd} onNext={()=>setStep(6)} />}
        {step===6 && <OnbGoals        pal={pal} data={data} upd={upd} onNext={()=>setStep(7)} />}
        {step===7 && <OnbExtras       pal={pal} data={data} upd={upd} onNext={()=>onComplete(data)} />}
      </div>
    </div>
  );
}

/* ─── STEP 0: Welcome ─── */
function OnbWelcome({ pal, data, upd, onNext }) {
  const canNext = data.parentName.trim().length>0 && data.familyName.trim().length>0;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:pal.heroGrad,padding:"2.5rem 1.4rem 2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-40px",top:"-40px",width:"160px",height:"160px",borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"grow 0.5s ease"}}>🌱</div>
        <h1 style={{fontFamily:"Georgia",fontSize:"1.8rem",fontWeight:"800",color:"#fff",margin:"0 0 0.4rem",lineHeight:1.2}}>Welcome to<br/>Stem & Bloom</h1>
        <p style={{color:"rgba(255,255,255,0.62)",fontSize:"0.85rem",margin:0,lineHeight:1.65}}>Let's set up your family's homeschool in just a few minutes.</p>
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
        <Lbl pal={pal}>Your state</Lbl>
        <Select pal={pal} value={data.state} onChange={v=>upd("state",v)} options={US_STATES} />
        <div style={{height:"0.85rem"}}/>
        <Lbl pal={pal}>How long have you been homeschooling?</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
          {["0–1 years","2–3 years","4–6 years","7–10 years","10+ years"].map(y=>(
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
        <Btn pal={pal} disabled={!canNext} onClick={onNext} style={{marginTop:"1.4rem"}}>Let's go →</Btn>
      </div>
    </div>
  );
}

/* ─── STEP 1: Children ─── */
function OnbChildren({ pal, data, upd, onNext }) {
  const addChild = () => upd("children",[...data.children,{id:uid(),name:"",grade:"1st",avatar:"🌻"}]);
  const remChild = id  => upd("children",data.children.filter(c=>c.id!==id));
  const updChild = (id,k,v) => upd("children",data.children.map(c=>c.id===id?{...c,[k]:v}:c));
  const canNext = data.children.length>0 && data.children.every(c=>c.name.trim().length>0);

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="👨‍👩‍👧‍👦" title="Your Children" sub="Add each child you're homeschooling." />
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1rem"}}>
        {data.children.map((c,i)=>(
          <div key={c.id} style={{background:pal.linen,borderRadius:"18px",padding:"1rem 1.1rem",border:`1.5px solid ${pal.stone}50`,animation:"slideRight 0.2s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
              <span style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem"}}>Child {i+1}</span>
              {data.children.length>1 && (
                <button onClick={()=>remChild(c.id)} style={{background:"transparent",border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.8rem",padding:"0.1rem 0.35rem"}}>✕ Remove</button>
              )}
            </div>
            {/* Avatar picker */}
            <Lbl pal={pal}>Pick an avatar</Lbl>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
              {AVATARS.map(av=>(
                <button key={av} onClick={()=>updChild(c.id,"avatar",av)} style={{width:"36px",height:"36px",borderRadius:"9px",border:`2px solid ${c.avatar===av?pal.primary:pal.stone+"50"}`,background:c.avatar===av?pal.pale:"transparent",cursor:"pointer",fontSize:"1.3rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>{av}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
              <div>
                <Lbl pal={pal}>Name</Lbl>
                <Input pal={pal} value={c.name} onChange={v=>updChild(c.id,"name",v)} placeholder="e.g. Emma" />
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
      <Btn pal={pal} disabled={!canNext} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 2: Learning Philosophy (multi-select) ─── */
function OnbPhilosophy({ pal, data, upd, onNext }) {
  const toggle = id => {
    const cur = data.curriculumStyle || [];
    upd("curriculumStyle", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };
  const sel = data.curriculumStyle || [];
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📚" title="Learning Philosophy" sub="How does your family like to learn? Pick all that apply — most families blend a few!" />
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
                {isSelected&&<span style={{color:pal.onDark,fontSize:"0.6rem",fontWeight:"900"}}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <Btn pal={pal} disabled={sel.length===0} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 3: Curriculum Brands (multi-select) ─── */
function OnbCurrBrands({ pal, data, upd, onNext }) {
  const toggle = id => {
    const cur = data.curriculumBrands || [];
    upd("curriculumBrands", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };
  const sel = data.curriculumBrands || [];
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📖" title="Curriculum Programs" sub="Do you use any purchased curriculum? Select all that apply — or skip if you build your own!" />
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.2rem"}}>
        {CURRICULUM_BRANDS.map(s=>{
          const isSelected = sel.includes(s.id);
          return (
            <button key={s.id} onClick={()=>toggle(s.id)} style={{padding:"0.85rem 1rem",border:`2px solid ${isSelected?pal.accent:pal.stone+"50"}`,borderRadius:"14px",background:isSelected?pal.paleMid:"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:"0.75rem",alignItems:"center",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.4rem",flexShrink:0}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:isSelected?pal.accentD:pal.ink,fontSize:"0.86rem"}}>{s.label}</div>
                <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{s.desc}</div>
              </div>
              <div style={{width:"19px",height:"19px",borderRadius:"4px",border:`2px solid ${isSelected?pal.accent:pal.stone}`,background:isSelected?pal.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {isSelected&&<span style={{color:pal.onDark,fontSize:"0.6rem",fontWeight:"900"}}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <Btn pal={pal} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 4: Subjects ─── */
function OnbSubjects({ pal, data, upd, onNext }) {
  const toggleSubj = id => {
    const cur = data.subjects || [];
    upd("subjects", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };
  const sel = data.subjects || [];
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🔬" title="Your Subjects" sub="Pick everything you teach. You can always add or remove later." />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.45rem",marginBottom:"1.2rem"}}>
        {SUBJECT_OPTIONS.map(s=>{
          const isSelected = sel.includes(s.id);
          return (
            <button key={s.id} onClick={()=>toggleSubj(s.id)} style={{padding:"0.7rem 0.75rem",border:`2px solid ${isSelected?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:isSelected?pal.pale:"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:"0.5rem",alignItems:"center",transition:"all 0.13s"}}>
              <span style={{fontSize:"1.15rem",flexShrink:0}}>{s.icon}</span>
              <span style={{fontWeight:isSelected?"700":"400",color:isSelected?pal.primary:pal.inkM,fontSize:"0.78rem",flex:1}}>{s.label}</span>
              {isSelected && <span style={{color:pal.primary,fontSize:"0.65rem",fontWeight:"900"}}>✓</span>}
            </button>
          );
        })}
      </div>
      <Lbl pal={pal}>Typical session length</Lbl>
      <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
        {SESSION_LENGTHS.map(l=>(
          <button key={l} onClick={()=>upd("sessionLength",l)} style={{padding:"0.45rem 0.85rem",border:`2px solid ${data.sessionLength===l?pal.primary:pal.stone+"50"}`,borderRadius:"20px",background:data.sessionLength===l?pal.pale:"transparent",cursor:"pointer",fontWeight:data.sessionLength===l?"700":"400",color:data.sessionLength===l?pal.primary:pal.inkM,fontSize:"0.8rem",transition:"all 0.13s"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{background:pal.pale,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1.2rem",border:`1.5px solid ${pal.primary}22`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom: data.morningGathering?"0.65rem":"0"}}>
          <div>
            <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.86rem"}}>🌅 Morning gathering time?</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>A cozy start before individual subjects</div>
          </div>
          <button onClick={()=>upd("morningGathering",!data.morningGathering)} style={{width:"44px",height:"26px",borderRadius:"13px",border:"none",background:data.morningGathering?pal.primary:pal.stone+"60",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:"3px",left:data.morningGathering?"21px":"3px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
          </button>
        </div>
        {data.morningGathering && (
          <div>
            <Lbl pal={pal}>What do you call it?</Lbl>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
              {["Morning Time","Morning Basket","Circle Time","Morning Meeting","Devotions"].map(n=>(
                <button key={n} onClick={()=>upd("morningGatheringName",n)} style={{padding:"0.35rem 0.7rem",border:`1.5px solid ${data.morningGatheringName===n?pal.primary:pal.stone+"50"}`,borderRadius:"20px",background:data.morningGatheringName===n?pal.pale:"transparent",cursor:"pointer",fontSize:"0.74rem",fontWeight:data.morningGatheringName===n?"700":"400",color:data.morningGatheringName===n?pal.primary:pal.inkM,transition:"all 0.13s"}}>
                  {n}
                </button>
              ))}
            </div>
            <Input pal={pal} value={data.morningGatheringName} onChange={v=>upd("morningGatheringName",v)} placeholder="Or type your own name…" />
          </div>
        )}
      </div>
      <Btn pal={pal} disabled={sel.length===0} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 5: Schedule ─── */
function OnbSchedule({ pal, data, upd, onNext }) {
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📅" title="Your Schedule" sub="We'll use this to set up your weekly template." />
      <Lbl pal={pal}>School days</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
        {SCHOOL_DAYS_OPTIONS.map(d=>(
          <button key={d} onClick={()=>upd("schoolDays",d)} style={{padding:"0.7rem 1rem",border:`2px solid ${data.schoolDays===d?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.schoolDays===d?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.schoolDays===d?"700":"400",color:data.schoolDays===d?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
            {d}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
        <div>
          <Lbl pal={pal}>Start time</Lbl>
          <Select pal={pal} value={data.startTime} onChange={v=>upd("startTime",v)} options={["6:00","6:30","7:00","7:30","8:00","8:30","9:00","9:30","10:00"]} />
        </div>
        <div>
          <Lbl pal={pal}>End time</Lbl>
          <Select pal={pal} value={data.endTime} onChange={v=>upd("endTime",v)} options={["12:00","1:00","1:30","2:00","2:30","3:00","3:30","4:00","5:00"]} />
        </div>
      </div>
      <Lbl pal={pal}>Break style</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1.2rem"}}>
        {BREAK_STYLES.map(b=>(
          <button key={b} onClick={()=>upd("breakStyle",b)} style={{padding:"0.65rem 1rem",border:`2px solid ${data.breakStyle===b?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.breakStyle===b?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.breakStyle===b?"700":"400",color:data.breakStyle===b?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
            {b}
          </button>
        ))}
      </div>
      <Btn pal={pal} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 4: Goals ─── */
function OnbGoals({ pal, data, upd, onNext }) {
  const toggle = id => upd("goals",data.goals.includes(id)?data.goals.filter(g=>g!==id):[...data.goals,id]);
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🌟" title="Your Goals" sub="What matters most for your family? Pick as many as you like." />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.2rem"}}>
        {GOALS.map(g=>{
          const sel=data.goals.includes(g.id);
          return (
            <button key={g.id} onClick={()=>toggle(g.id)} style={{padding:"0.8rem 0.75rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.5rem"}}>{g.icon}</span>
              <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM,lineHeight:1.25}}>{g.label}</span>
            </button>
          );
        })}
      </div>
      <Btn pal={pal} onClick={onNext}>Next →</Btn>
    </div>
  );
}

/* ─── STEP 5: Life & Extras ─── */
function OnbExtras({ pal, data, upd, onNext }) {
  const toggleExtra = v => upd("extracurriculars",data.extracurriculars.includes(v)?data.extracurriculars.filter(e=>e!==v):[...data.extracurriculars,v]);
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🌿" title="Life & Extras" sub="A few last things to personalize your app." />
      <Lbl pal={pal}>Co-op frequency</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
        {COOP_FREQ.map(c=>(
          <button key={c} onClick={()=>upd("coopFreq",c)} style={{padding:"0.65rem 1rem",border:`2px solid ${data.coopFreq===c?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.coopFreq===c?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.coopFreq===c?"700":"400",color:data.coopFreq===c?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
            {c}
          </button>
        ))}
      </div>
      <Lbl pal={pal}>Extracurriculars <span style={{fontWeight:"400",color:pal.slate}}>(pick all that apply)</span></Lbl>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
        {EXTRACURRICULARS.map(e=>(
          <PillBtn key={e} label={e} active={data.extracurriculars.includes(e)} onClick={()=>toggleExtra(e)} pal={pal} />
        ))}
      </div>
      <Lbl pal={pal}>Include in daily schedule?</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.45rem",marginBottom:"1.4rem"}}>
        {[["choresInSched","🧹 Chore blocks"],["mealsInSched","🍽️ Meal / snack blocks"]].map(([k,l])=>(
          <button key={k} onClick={()=>upd(k,!data[k])} style={{display:"flex",gap:"0.75rem",alignItems:"center",padding:"0.75rem 1rem",border:`2px solid ${data[k]?pal.primary:pal.stone+"50"}`,borderRadius:"13px",background:data[k]?pal.pale:"transparent",cursor:"pointer",transition:"all 0.14s",textAlign:"left"}}>
            <div style={{width:"20px",height:"20px",borderRadius:"6px",border:`2.5px solid ${data[k]?pal.primary:pal.stone}`,background:data[k]?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {data[k]&&<span style={{color:pal.onDark,fontSize:"0.7rem",fontWeight:"800"}}>✓</span>}
            </div>
            <span style={{fontWeight:data[k]?"700":"400",color:data[k]?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{l}</span>
          </button>
        ))}
      </div>
      {/* Final CTA — warm */}
      <div style={{background:pal.heroGrad,borderRadius:"18px",padding:"1.2rem 1.3rem",marginBottom:"1.1rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{fontSize:"2rem",marginBottom:"0.4rem",position:"relative"}}>🌱</div>
        <div style={{fontWeight:"800",color:pal.onDark,fontSize:"0.94rem",marginBottom:"0.25rem",position:"relative"}}>You're all set, {data.parentName||"friend"}!</div>
        <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.65)",lineHeight:1.65,position:"relative"}}>Stem & Bloom is ready for your family. Let's grow something beautiful together.</div>
      </div>
      <Btn pal={pal} onClick={onNext}>Open My App 🌱</Btn>
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS SCREEN
═══════════════════════════════════════ */
function SettingsScreen({ pal, family, setFamily, paletteId, setPaletteId, customA, customB, setCustomA, setCustomB, navIds, setNavIds, onBack }) {
  const [tab,   setTab]   = useState("family");
  const [local, setLocal] = useState(family ? {...family} : {});
  const updL = (k,v) => setLocal(l=>({...l,[k]:v}));
  const updChild = (id,k,v) => setLocal(l=>({...l,children:l.children.map(c=>c.id===id?{...c,[k]:v}:c)}));
  const addChild = () => setLocal(l=>({...l,children:[...l.children,{id:uid(),name:"",grade:"1st",avatar:"🌻"}]}));
  const remChild = id => setLocal(l=>({...l,children:l.children.filter(c=>c.id!==id)}));
  const save = () => { setFamily(local); onBack(); };

  const STABS = [["family","👨‍👩‍👧‍👦 Family"],["children","🌱 Children"],["school","🏫 School"],["theme","🎨 Theme"],["nav","✦ Nav"]];

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column",animation:"fadeIn 0.18s ease"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"1rem 1.1rem 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.9rem"}}>
          <button onClick={onBack} style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>‹</button>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"1.1rem"}}>⚙️ Settings</span>
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

      <div style={{flex:1,overflowY:"auto",padding:"1.2rem 1.1rem"}}>
        {tab==="family" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
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
            <SCard pal={pal} title="School Year">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                <div><Lbl pal={pal}>Start date</Lbl><Input pal={pal} type="date" value={local.yearStart||"2024-08-12"} onChange={v=>updL("yearStart",v)} /></div>
                <div><Lbl pal={pal}>End date</Lbl><Input pal={pal} type="date" value={local.yearEnd||"2025-05-23"} onChange={v=>updL("yearEnd",v)} /></div>
              </div>
            </SCard>
          </div>
        )}

        {tab==="children" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            {(local.children||[]).map((c,i)=>(
              <SCard key={c.id} pal={pal} title={`Child ${i+1}`} action={local.children.length>1?{label:"Remove",fn:()=>remChild(c.id)}:null}>
                <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
                  {AVATARS.map(av=>(
                    <button key={av} onClick={()=>updChild(c.id,"avatar",av)} style={{width:"33px",height:"33px",borderRadius:"8px",border:`2px solid ${c.avatar===av?pal.primary:pal.stone+"50"}`,background:c.avatar===av?pal.pale:"transparent",cursor:"pointer",fontSize:"1.15rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{av}</button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                  <div><Lbl pal={pal}>Name</Lbl><Input pal={pal} value={c.name} onChange={v=>updChild(c.id,"name",v)} placeholder="Child's name" /></div>
                  <div><Lbl pal={pal}>Grade</Lbl><Select pal={pal} value={c.grade} onChange={v=>updChild(c.id,"grade",v)} options={GRADES} /></div>
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
            <SCard pal={pal} title="School Name">
              <Input pal={pal} value={local.schoolName||""} onChange={v=>updL("schoolName",v)} placeholder="e.g. Thornwood Academy" />
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
                        {isSel&&<span style={{color:pal.onDark,fontSize:"0.55rem",fontWeight:"900"}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </SCard>
            <SCard pal={pal} title="Curriculum Programs">
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.5rem"}}>Select all that apply</div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.38rem"}}>
                {CURRICULUM_BRANDS.map(s=>{
                  const selArr = local.curriculumBrands || [];
                  const isSel = selArr.includes(s.id);
                  return (
                    <button key={s.id} onClick={()=>{
                      const cur = local.curriculumBrands || [];
                      updL("curriculumBrands", isSel ? cur.filter(x=>x!==s.id) : [...cur, s.id]);
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.65rem 0.85rem",border:`2px solid ${isSel?pal.accent:pal.stone+"50"}`,borderRadius:"11px",background:isSel?pal.paleMid:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <span style={{fontSize:"1.2rem"}}>{s.icon}</span>
                      <span style={{flex:1,fontWeight:isSel?"700":"400",color:isSel?pal.accentD:pal.inkM,fontSize:"0.83rem"}}>{s.label}</span>
                      <div style={{width:"16px",height:"16px",borderRadius:"3px",border:`2px solid ${isSel?pal.accent:pal.stone}`,background:isSel?pal.accent:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {isSel&&<span style={{color:pal.onDark,fontSize:"0.55rem",fontWeight:"900"}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
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
            <SCard pal={pal} title="Nav Tabs" note={`${navIds.length} tabs · 3–5 · Home, Schedule & Portfolio always stay`}>
              <div style={{display:"flex",flexDirection:"column",gap:"0.42rem"}}>
                {ALL_SECTIONS.filter(s=>s.id!=="more").map(s=>{
                  const on=navIds.includes(s.id);
                  const atMax=navIds.length>=5&&!on;
                  return (
                    <button key={s.id} onClick={()=>{
                      if(s.locked)return;
                      if(on){if(navIds.length<=3)return;setNavIds(n=>n.filter(x=>x!==s.id));}
                      else{if(atMax)return;setNavIds(n=>[...n,s.id]);}
                    }} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.7rem 0.9rem",border:`2px solid ${on?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:on?pal.pale:"transparent",cursor:s.locked||atMax?"default":"pointer",opacity:atMax&&!on?0.35:1,transition:"all 0.13s",textAlign:"left"}}>
                      <span style={{fontSize:"1.2rem",width:"28px",textAlign:"center"}}>{s.icon}</span>
                      <span style={{flex:1,fontWeight:on?"700":"400",color:on?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
                      {s.locked
                        ? <span style={{fontSize:"0.7rem",color:pal.slate}}>🔒</span>
                        : <div style={{width:"19px",height:"19px",borderRadius:"5px",border:`2px solid ${on?pal.primary:pal.stone}`,background:on?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<span style={{color:pal.onDark,fontSize:"0.65rem",fontWeight:"900"}}>✓</span>}</div>
                      }
                    </button>
                  );
                })}
              </div>
            </SCard>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div style={{padding:"0.9rem 1.1rem",borderTop:`1px solid ${pal.stone}50`,background:pal.linen,flexShrink:0,display:"flex",gap:"0.6rem"}}>
        <button onClick={onBack} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
        <button onClick={save} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Save Changes ✓</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════ */
function HomeScreen({ pal, family, child, setChild, onCheckin, onTheme }) {
  const blocks = generateSchedule(family);
  const visible = blocks.filter(b=>child==="all"||b.c==="all"||b.c===child);
  const pct = 71;

  return (
    <div style={{animation:"fadeUp 0.24s ease"}}>
      <div style={{background:pal.heroGrad,padding:"1.4rem 1.1rem 1.65rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-40px",top:"-40px",width:"160px",height:"160px",borderRadius:"50%",background:"rgba(255,255,255,0.055)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.14em",fontWeight:"700",marginBottom:"0.18rem"}}>{today()}</div>
          <h1 style={{margin:"0 0 0.08rem",fontSize:"1.45rem",fontWeight:"800",color:"rgba(255,255,255,0.95)",lineHeight:1.2}}>{greet()},</h1>
          <h1 style={{margin:"0 0 1.1rem",fontSize:"1.45rem",fontWeight:"800",lineHeight:1.2,background:pal.shimmer,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite"}}>
            {family.parentName||family.familyName} 🌱
          </h1>
          <div style={{display:"flex",gap:"0.38rem",flexWrap:"wrap"}}>
            <Chip pal={pal} label="All" active={child==="all"} onClick={()=>setChild("all")} dark />
            {family.children.map(c=><Chip key={c.id} pal={pal} label={`${c.avatar} ${c.name}`} active={child===c.id} onClick={()=>setChild(c.id)} dark />)}
          </div>
        </div>
      </div>
      <div style={{padding:"1rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.55rem",marginBottom:"1rem"}}>
          {[{l:"Days",v:"127",c:pal.primary,bg:pal.pale},{l:"Hours",v:"612h",c:pal.mid,bg:pal.paleMid},{l:"On Track",v:`${pct}%`,c:pct>=80?pal.good:pal.warn,bg:pct>=80?pal.goodBg:pal.warnBg}].map(s=>(
            <div key={s.l} style={{background:s.bg,borderRadius:"15px",padding:"0.8rem 0.6rem",textAlign:"center",border:`1.5px solid ${s.c}22`}}>
              <div style={{fontWeight:"800",color:s.c,fontSize:"1.25rem",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:"0.58rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:"3px"}}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={onCheckin} style={{width:"100%",background:pal.accentGrad,borderRadius:"18px",padding:"1rem 1.15rem",marginBottom:"1rem",cursor:"pointer",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:`0 6px 22px ${pal.accent}35`}}>
          <div>
            <div style={{fontWeight:"800",color:pal.onDark,fontSize:"0.92rem",marginBottom:"0.12rem",textAlign:"left"}}>✨ Daily Check-In</div>
            <div style={{fontSize:"0.74rem",color:"rgba(255,255,255,0.78)",textAlign:"left"}}>Log today — it only takes a minute.</div>
          </div>
          <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",color:pal.onDark,flexShrink:0}}>→</div>
        </button>
        <Row pal={pal} title="Today's Schedule" action="See all" />
        <div style={{display:"flex",flexDirection:"column",gap:"0.42rem",marginBottom:"1rem"}}>
          {visible.slice(0,5).map((b,i)=>{
            const tint=pal.primary;
            return (
              <div key={i} style={{background:pal.linen,borderRadius:"13px",padding:"0.65rem 0.85rem",display:"flex",gap:"0.75rem",alignItems:"center",border:`1.5px solid ${pal.stone}45`}}>
                <div style={{width:"36px",height:"36px",borderRadius:"9px",background:`${tint}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{b.i}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.s}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate}}>{h12(b.t)} · {b.dur}min</div>
                </div>
                <div style={{fontSize:"0.68rem",fontWeight:"700",color:pal.onDark,background:tint,borderRadius:"50px",padding:"0.1rem 0.55rem",flexShrink:0}}>{b.c==="all"?"All":family.children[0]?.name}</div>
              </div>
            );
          })}
        </div>
        <Row pal={pal} title="Progress" action="Details" />
        <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",border:`1.5px solid ${pal.stone}45`}}>
          {[{n:"Math",p:78,i:"📐"},{n:"Language Arts",p:85,i:"📝"},{n:"History",p:72,i:"🏛️"},{n:"Science",p:91,i:"🔬"}].map((s,i,a)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.65rem",marginBottom:i<a.length-1?"0.6rem":"0"}}>
              <span style={{fontSize:"0.95rem",width:"22px",textAlign:"center"}}>{s.i}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                  <span style={{fontSize:"0.76rem",fontWeight:"600",color:pal.inkM}}>{s.n}</span>
                  <span style={{fontSize:"0.73rem",fontWeight:"800",color:pal.primary}}>{s.p}%</span>
                </div>
                <div style={{height:"6px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${s.p}%`,borderRadius:"99px",background:pal.accentGrad}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{height:"1rem"}}/>
      </div>
    </div>
  );
}

/* ═══════ SKELETON SCREENS for other tabs ═══════ */
/* ─── SCHEDULE GENERATOR ─── */
function generateSchedule(family) {
  const subjects = family.subjects || ["math","reading","language","science","history"];
  const sessionMins = parseInt((family.sessionLength||"45 min").split(" ")[0]);
  const startHour = parseInt((family.startTime||"8:00").split(":")[0]);
  const startMin  = parseInt((family.startTime||"8:00").split(":")[1]||0);
  const subjectMap = Object.fromEntries(SUBJECT_OPTIONS.map(s=>[s.id,s]));

  let blocks = [];
  let cursor = startHour * 60 + startMin;

  const toTime = mins => {
    const h = Math.floor(mins/60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2,"0")}`;
  };

  // Morning gathering if enabled
  if (family.morningGathering) {
    blocks.push({t:toTime(cursor), s:family.morningGatheringName||"Morning Time", i:"🌅", c:"all", dur:30});
    cursor += 30;
  }

  // Add subjects in order, short break every 2 subjects
  subjects.forEach((id, idx) => {
    const subj = subjectMap[id];
    if (!subj) return;
    // Lunch break around midday
    const hour = Math.floor(cursor/60);
    if (hour >= 12 && !blocks.find(b=>b.s==="Lunch")) {
      blocks.push({t:toTime(cursor), s:"Lunch", i:"🥪", c:"all", dur:45});
      cursor += 45;
    }
    blocks.push({t:toTime(cursor), s:subj.label, i:subj.icon, c:"all", dur:sessionMins});
    cursor += sessionMins;
    // Short break every 2 subjects (not after last one)
    if ((idx+1) % 2 === 0 && idx < subjects.length-1) {
      const breakStyle = family.breakStyle||"";
      if (!breakStyle.includes("No set")) {
        blocks.push({t:toTime(cursor), s:"Break", i:"☕", c:"all", dur:15});
        cursor += 15;
      }
    }
  });

  return blocks;
}

function ScheduleScreen({pal,family,child,setChild,onMarkComplete}){
  const [selectedDay, setSelectedDay] = useState(2);
  const [checked, setChecked] = useState({});
  const DAYS=[{l:"Mon",d:10},{l:"Tue",d:11},{l:"Wed",d:12},{l:"Thu",d:13},{l:"Fri",d:14}];
  const BLOCKS = generateSchedule(family);
  const visible=BLOCKS.filter(b=>child==="all"||b.c==="all"||b.c==="c1");
  const checkedCount=Object.values(checked).filter(Boolean).length;
  const allDone=checkedCount===visible.length && visible.length>0;
  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Schedule" sub={new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})} icon="📅"/>
      <div style={{padding:"0 1rem"}}>
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.9rem",overflowX:"auto"}}>
          <Chip pal={pal} label="All" active={child==="all"} onClick={()=>setChild("all")}/>
          {family.children.map(c=><Chip key={c.id} pal={pal} label={`${c.avatar} ${c.name}`} active={child===c.id} onClick={()=>setChild(c.id)}/>)}
        </div>
        {/* Day strip */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"1rem"}}>
          {DAYS.map((d,i)=>(
            <button key={i} onClick={()=>setSelectedDay(i)} style={{flex:1,padding:"0.55rem 0",borderRadius:"12px",border:`2px solid ${i===selectedDay?pal.primary:pal.stone+"55"}`,background:i===selectedDay?pal.primary:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.14s"}}>
              <div style={{fontSize:"0.58rem",fontWeight:"600",color:i===selectedDay?"rgba(255,255,255,0.7)":pal.slate,marginBottom:"2px"}}>{d.l}</div>
              <div style={{fontSize:"0.9rem",fontWeight:"800",color:i===selectedDay?pal.onDark:pal.inkM}}>{d.d}</div>
            </button>
          ))}
        </div>
        {/* Schedule pull banner — shows when day is selected */}
        {selectedDay===2&&(
          <div style={{background:pal.pale,borderRadius:"13px",padding:"0.75rem 1rem",marginBottom:"0.85rem",border:`2px solid ${pal.primary}22`,display:"flex",gap:"0.65rem",alignItems:"center"}}>
            <span style={{fontSize:"1.2rem",flexShrink:0}}>📋</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.8rem"}}>Auto-pull to attendance</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>Finish today and we'll add it to your count automatically.</div>
            </div>
          </div>
        )}
        {/* Block list with checkboxes */}
        {visible.map((b,i)=>{
          const done=checked[b.t];
          const ch=b.c==="all"?null:family.children[0];
          return (
            <div key={i} onClick={()=>setChecked(c=>({...c,[b.t]:!c[b.t]}))}
              style={{background:done?pal.pale:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",display:"flex",gap:"0.85rem",alignItems:"center",border:`2px solid ${done?pal.primary+"40":pal.stone+"18"}`,marginBottom:"0.5rem",position:"relative",overflow:"hidden",cursor:"pointer",transition:"all 0.14s"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:done?pal.accentGrad:pal.stone+"60"}}/>
              <div style={{width:"40px",height:"40px",borderRadius:"11px",background:done?pal.primary+"22":pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",flexShrink:0}}>{b.i}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:done?pal.primary:pal.ink,fontSize:"0.88rem",textDecoration:done?"line-through":"none"}}>{b.s}</div>
                <div style={{fontSize:"0.72rem",color:pal.slate}}>{h12(b.t)} · {b.dur}min</div>
              </div>
              <div style={{width:"22px",height:"22px",borderRadius:"6px",border:`2.5px solid ${done?pal.primary:pal.stone}`,background:done?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.14s"}}>
                {done&&<span style={{color:"#fff",fontSize:"0.75rem",fontWeight:"900"}}>✓</span>}
              </div>
            </div>
          );
        })}
        {/* Progress bar for today */}
        {visible.length>0&&(
          <div style={{background:pal.linen,borderRadius:"12px",padding:"0.75rem 1rem",marginTop:"0.35rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
              <span style={{fontSize:"0.75rem",fontWeight:"600",color:pal.inkM}}>Today's progress</span>
              <span style={{fontSize:"0.75rem",fontWeight:"800",color:allDone?pal.good:pal.primary}}>{checkedCount}/{visible.length} done</span>
            </div>
            <div style={{height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.round(checkedCount/visible.length*100)}%`,borderRadius:"99px",background:allDone?`linear-gradient(90deg,${pal.good},${pal.good})`:pal.accentGrad,transition:"width 0.3s ease"}}/>
            </div>
          </div>
        )}
        {/* Mark complete CTA — glows when all done */}
        <button onClick={onMarkComplete}
          style={{width:"100%",marginBottom:"0.75rem",padding:"0.9rem",border:"none",borderRadius:"14px",background:allDone?pal.accentGrad:pal.stone+"40",color:allDone?pal.onDark:pal.slate,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer",transition:"all 0.25s",boxShadow:allDone?`0 4px 20px ${pal.accent}40`:"none"}}>
          {allDone?"✅ Mark Today Complete → Attendance":"Check off blocks above to mark complete"}
        </button>
        <button style={{width:"100%",marginBottom:"1rem",padding:"0.85rem",border:"none",borderRadius:"14px",background:pal.heroGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>✨ AI Build My Week</button>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════
   LEARN SCREEN — AI Curriculum Builder
   Full Claude API integration
═══════════════════════════════════════ */
const SUBJECTS = [
  {id:"history",  label:"History",       icon:"🏛️"},
  {id:"math",     label:"Math",          icon:"📐"},
  {id:"langarts", label:"Language Arts", icon:"📝"},
  {id:"science",  label:"Science",       icon:"🔬"},
  {id:"latin",    label:"Latin",         icon:"📜"},
  {id:"art",      label:"Art",           icon:"🎨"},
  {id:"music",    label:"Music",         icon:"🎵"},
  {id:"bible",    label:"Bible/Faith",   icon:"✝️"},
  {id:"pe",       label:"P.E.",          icon:"⚽"},
  {id:"other",    label:"Other",         icon:"💡"},
];
const DURATIONS = ["2 weeks","4 weeks","6 weeks","8 weeks","10 weeks","12 weeks"];
const WS_TYPES  = [
  {id:"copywork",  label:"Copywork",      icon:"✍️"},
  {id:"narration", label:"Narration",     icon:"💬"},
  {id:"math",      label:"Math Practice", icon:"📐"},
  {id:"spelling",  label:"Spelling List", icon:"🔤"},
  {id:"timeline",  label:"Timeline",      icon:"📅"},
  {id:"nature",    label:"Nature Journal",icon:"🌿"},
  {id:"vocab",     label:"Vocabulary",    icon:"📖"},
  {id:"quiz",      label:"Quiz",          icon:"✅"},
];

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      messages:[{role:"user",content:prompt}],
    }),
  });
  const data = await res.json();
  return data.content?.map(b=>b.text||"").join("") || "";
}

function LearnScreen({pal, family, child, setChild, learnTab, setLearnTab}) {
  // ── Curriculum units state ──
  const [units, setUnits] = useState([
    {id:"u1",subject:"History",  icon:"🏛️",title:"Ancient Civilizations",weeks:8, weeksDone:5, aiGenerated:false},
    {id:"u2",subject:"Math",     icon:"📐",title:"Pre-Algebra",           weeks:12,weeksDone:7, aiGenerated:false},
    {id:"u3",subject:"Language Arts",icon:"📝",title:"Essay Writing",    weeks:6, weeksDone:3, aiGenerated:false},
    {id:"u4",subject:"Science",  icon:"🔬",title:"Human Body Systems",   weeks:10,weeksDone:6, aiGenerated:false},
  ]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showWS,      setShowWS]      = useState(false);
  const [expandedUnit,setExpandedUnit]= useState(null);

  const activeChild = child==="all" ? family.children[0] : family.children.find(c=>c.id===child);

  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Learn" sub="Curriculum & Progress" icon="📚"/>
      <div style={{padding:"0 1rem"}}>
        {/* Child selector */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.9rem",overflowX:"auto"}}>
          {family.children.map(c=>(
            <Chip key={c.id} pal={pal} label={`${c.avatar} ${c.name}`} active={child===c.id||child==="all"&&c===family.children[0]} onClick={()=>setChild(c.id)}/>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",background:pal.parchm,borderRadius:"11px",padding:"3px",gap:"2px",marginBottom:"1rem"}}>
          {[["curriculum","Curriculum"],["progress","Progress"],["worksheets","Worksheets"]].map(([id,l])=>(
            <button key={id} onClick={()=>setLearnTab(id)} style={{flex:1,padding:"0.45rem",border:"none",borderRadius:"9px",background:learnTab===id?pal.linen:"transparent",color:learnTab===id?pal.ink:pal.slate,fontSize:"0.74rem",fontWeight:learnTab===id?"700":"400",cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>

        {/* ── CURRICULUM TAB ── */}
        {learnTab==="curriculum" && (<>
          {/* AI Build banner */}
          <button onClick={()=>setShowBuilder(true)} style={{width:"100%",marginBottom:"1rem",padding:"0.9rem 1.1rem",border:"none",borderRadius:"18px",background:pal.heroGrad,cursor:"pointer",display:"flex",gap:"0.85rem",alignItems:"center",boxShadow:`0 4px 18px ${pal.accent}30`,textAlign:"left"}}>
            <div style={{width:"46px",height:"46px",borderRadius:"13px",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>✨</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:"800",color:"#fff",fontSize:"0.92rem",marginBottom:"2px"}}>Build a Unit with AI</div>
              <div style={{fontSize:"0.74rem",color:"rgba(255,255,255,0.72)"}}>Pick a subject, topic & duration → Claude builds the whole plan</div>
            </div>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:"1.1rem",flexShrink:0}}>›</span>
          </button>

          {/* Unit cards */}
          {units.map(u=>(
            <div key={u.id} style={{background:pal.linen,borderRadius:"18px",padding:"1rem",marginBottom:"0.65rem",border:`1.5px solid ${u.aiGenerated?pal.primary+"40":pal.stone}40`,transition:"all 0.15s"}}>
              <div onClick={()=>setExpandedUnit(expandedUnit===u.id?null:u.id)}
                style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",cursor:"pointer"}}>
                <div style={{width:"44px",height:"44px",borderRadius:"12px",background:pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.35rem",flexShrink:0}}>{u.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"}}>
                    <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem"}}>{u.title}</div>
                    {u.aiGenerated&&<span style={{fontSize:"0.6rem",fontWeight:"800",color:pal.primary,background:pal.pale,borderRadius:"50px",padding:"0.08rem 0.45rem"}}>✨ AI</span>}
                  </div>
                  <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"2px"}}>{u.subject} · {u.weeks} weeks</div>
                </div>
                <span style={{color:pal.primary,fontWeight:"700",color:pal.slate,fontSize:"0.9rem",transform:expandedUnit===u.id?"rotate(90deg)":"rotate(0)",transition:"transform 0.2s",flexShrink:0}}>›</span>
              </div>
              {/* Progress bar */}
              <div style={{marginTop:"0.7rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                  <span style={{fontSize:"0.68rem",color:pal.slate}}>Progress</span>
                  <span style={{fontSize:"0.68rem",fontWeight:"800",color:pal.primary}}>Week {u.weeksDone} of {u.weeks}</span>
                </div>
                <div style={{height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.round(u.weeksDone/u.weeks*100)}%`,borderRadius:"99px",background:pal.accentGrad,transition:"width 0.3s"}}/>
                </div>
              </div>
              {/* Expanded detail */}
              {expandedUnit===u.id&&u.plan&&(
                <div style={{marginTop:"0.85rem",padding:"0.85rem",background:pal.sand,borderRadius:"12px",animation:"fadeUp 0.18s ease"}}>
                  <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.5rem"}}>Unit Overview</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{u.plan}</div>
                </div>
              )}
              {expandedUnit===u.id&&!u.plan&&(
                <button onClick={()=>setShowBuilder(true)} style={{width:"100%",marginTop:"0.75rem",padding:"0.6rem",border:`2px dashed ${pal.primary}50`,borderRadius:"11px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                  ✨ Generate full plan with AI
                </button>
              )}
            </div>
          ))}
          <div style={{height:"1rem"}}/>
        </>)}

        {/* ── PROGRESS TAB ── */}
        {learnTab==="progress" && (
          <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem",border:`1.5px solid ${pal.stone}45`,marginBottom:"1rem"}}>
            {[
              {n:"Math",          p:78,i:"📐"},
              {n:"Language Arts", p:85,i:"📝"},
              {n:"History",       p:72,i:"🏛️"},
              {n:"Science",       p:91,i:"🔬"},
              {n:"Latin",         p:65,i:"📜"},
              {n:"Art",           p:95,i:"🎨"},
            ].map((s,i,a)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"0.7rem",marginBottom:i<a.length-1?"0.75rem":"0"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"9px",background:pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{s.i}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                    <span style={{fontSize:"0.8rem",fontWeight:"600",color:pal.inkM}}>{s.n}</span>
                    <span style={{fontSize:"0.76rem",fontWeight:"800",color:pal.primary}}>{s.p}%</span>
                  </div>
                  <div style={{height:"7px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.p}%`,borderRadius:"99px",background:pal.accentGrad}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── WORKSHEETS TAB ── */}
        {learnTab==="worksheets" && (<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.55rem",marginBottom:"0.9rem"}}>
            {WS_TYPES.map((w,i)=>(
              <button key={i} onClick={()=>setShowWS(w)} style={{padding:"0.85rem 0.7rem",border:`2px solid ${pal.stone}40`,borderRadius:"14px",background:pal.linen,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",transition:"all 0.13s"}}
                onMouseDown={e=>e.currentTarget.style.background=pal.pale}
                onMouseUp={e=>e.currentTarget.style.background=pal.linen}>
                <span style={{fontSize:"1.65rem"}}>{w.icon}</span>
                <span style={{fontSize:"0.76rem",fontWeight:"700",color:pal.inkM}}>{w.label}</span>
              </button>
            ))}
          </div>
          <button onClick={()=>setShowWS("custom")} style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.86rem",cursor:"pointer"}}>
            ✨ Build Custom Worksheet
          </button>
          <div style={{height:"1rem"}}/>
        </>)}
      </div>

      {/* AI Builder Modal */}
      {showBuilder && (
        <AIUnitBuilderModal
          pal={pal} family={family} activeChild={activeChild}
          onSave={unit=>{ setUnits(u=>[{id:uid(),...unit,aiGenerated:true},...u]); setShowBuilder(false); setLearnTab("curriculum"); }}
          onClose={()=>setShowBuilder(false)}
        />
      )}

      {/* Worksheet Builder Modal */}
      {showWS && (
        <AIWorksheetModal
          pal={pal} family={family} activeChild={activeChild}
          wsType={showWS}
          onClose={()=>setShowWS(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   AI CHAT MODAL — persistent assistant
   Calls Claude API live for any request
═══════════════════════════════════════ */
function AIChatModal({ pal, family, onClose }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:`Hi! I'm your Stem & Bloom assistant 🌱\n\nI can help you create **worksheets**, **lesson plans**, **unit studies**, **discussion questions**, or anything else for your homeschool. Just tell me what you need!\n\nTry something like:\n• "Make a worksheet on fractions for 4th grade"\n• "Write a nature journal prompt for my 7-year-old"\n• "Plan a 3-day unit on the American Revolution"` }
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const childNames = (family?.children||[]).map(c=>`${c.name} (${c.grade})`).join(", ");
  const philosophies = Array.isArray(family?.curriculumStyle)
    ? family.curriculumStyle.join(", ")
    : (family?.curriculumStyle || "eclectic");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = {role:"user", content:text};
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.map(m=>({role:m.role, content:m.content}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          system:`You are a warm, creative homeschool assistant for Stem & Bloom app. You help homeschool families with worksheets, lesson plans, unit studies, discussion questions, project ideas, and any educational content they need.

Family info:
- Children: ${childNames || "not specified"}
- Learning philosophy: ${philosophies}
- Curriculum programs: ${(family?.curriculumBrands||[]).join(", ")||"not specified"}
- State: ${family?.state||"not specified"}
- Goals: ${(family?.goals||[]).join(", ")||"not specified"}

When creating worksheets or lesson plans, format them clearly with headers, questions numbered, and age-appropriate content. Be warm, encouraging, and practical. Keep responses focused and useful — not overly long.`,
          messages:history
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b=>b.text||"").join("")||"Sorry, I couldn't get a response. Please try again.";
      setMessages(m=>[...m,{role:"assistant",content:reply}]);
    } catch(e) {
      setMessages(m=>[...m,{role:"assistant",content:"Something went wrong. Please check your connection and try again."}]);
    }
    setLoading(false);
  };

  const handleKey = e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); }};

  const QUICK = [
    "Make a worksheet for today",
    "Give me a fun project idea",
    "Write discussion questions",
    "Plan a lesson on nature",
  ];

  const renderMessage = (text) => {
    return text.split("\n").map((line,i)=>{
      const bold = line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
      return <div key={i} style={{marginBottom:line===""?"0.4rem":"0"}} dangerouslySetInnerHTML={{__html:bold||"&nbsp;"}} />;
    });
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",background:pal.sand,maxWidth:"430px",margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"0.9rem 1.1rem",display:"flex",alignItems:"center",gap:"0.75rem",flexShrink:0}}>
        <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>✨</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:"800",color:"#fff",fontSize:"0.95rem"}}>AI Assistant</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.65)"}}>Worksheets, lessons, projects & more</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"8px",padding:"0.3rem 0.65rem",color:"#fff",cursor:"pointer",fontSize:"0.8rem",fontWeight:"700"}}>✕</button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant" && (
              <div style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",flexShrink:0,marginRight:"0.5rem",alignSelf:"flex-end",marginBottom:"2px"}}>✨</div>
            )}
            <div style={{
              maxWidth:"82%",padding:"0.65rem 0.9rem",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"?pal.accentGrad:pal.linen,
              color:m.role==="user"?pal.onDark:pal.ink,
              fontSize:"0.82rem",lineHeight:1.6,
              border:m.role==="assistant"?`1px solid ${pal.stone}50`:"none"
            }}>
              {renderMessage(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <div style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"}}>✨</div>
            <div style={{background:pal.linen,border:`1px solid ${pal.stone}50`,borderRadius:"16px 16px 16px 4px",padding:"0.65rem 0.9rem"}}>
              <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                {[0,1,2].map(i=><div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:pal.primary,opacity:0.4,animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}
              </div>
            </div>
          </div>
        )}
        {/* Quick prompts — show only at start */}
        {messages.length===1 && !loading && (
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.25rem"}}>
            {QUICK.map(q=>(
              <button key={q} onClick={()=>{setInput(q); setTimeout(()=>inputRef.current?.focus(),50);}}
                style={{padding:"0.4rem 0.75rem",border:`1.5px solid ${pal.primary}40`,borderRadius:"20px",background:pal.pale,color:pal.primary,fontSize:"0.74rem",fontWeight:"600",cursor:"pointer"}}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"0.75rem 1rem",borderTop:`1.5px solid ${pal.stone}40`,background:pal.linen,flexShrink:0}}>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-end"}}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything… worksheet, lesson plan, project idea…"
            rows={2}
            style={{flex:1,resize:"none",padding:"0.6rem 0.8rem",border:`1.5px solid ${pal.stone}60`,borderRadius:"12px",background:"#fff",fontSize:"0.82rem",fontFamily:"inherit",color:pal.ink,outline:"none",lineHeight:1.5}}
          />
          <button onClick={send} disabled={!input.trim()||loading}
            style={{width:"40px",height:"40px",borderRadius:"50%",border:"none",background:input.trim()&&!loading?pal.accentGrad:"#ccc",color:"#fff",fontSize:"1rem",cursor:input.trim()&&!loading?"pointer":"default",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>
            ➤
          </button>
        </div>
        <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"0.4rem",textAlign:"center"}}>Press Enter to send · Shift+Enter for new line</div>
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   AI UNIT BUILDER MODAL — 3-step wizard
   Calls Claude API live
═══════════════════════════════════════ */
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
    const style = family.curriculumStyle||"classical";
    const goals = (family.goals||[]).slice(0,4).join(", ")||"well-rounded education";
    const prompt = `You are a homeschool curriculum assistant. Create a concise unit study plan for a homeschool family.

Student: ${child?.name||"Student"}, ${child?.grade||"elementary"} grade
Curriculum approach: ${style}
Subject: ${subject.label}
Topic: ${topic}
Duration: ${duration}
Family goals: ${goals}
${notes?`Special notes: ${notes}`:""}

Respond in this exact JSON format (no markdown, no backticks, just raw JSON):
{
  "title": "unit title (5-8 words)",
  "overview": "2-3 sentence engaging overview of what student will learn",
  "weeklyPlan": [
    {"week": 1, "focus": "focus area", "activities": ["activity 1", "activity 2", "activity 3"], "resources": "suggested books or materials"},
    {"week": 2, "focus": "focus area", "activities": ["activity 1", "activity 2", "activity 3"], "resources": "suggested books or materials"}
  ],
  "keySkills": ["skill 1", "skill 2", "skill 3"],
  "assessmentIdeas": ["idea 1", "idea 2"]
}

Include only the first 3 weeks in weeklyPlan. Keep each activity description under 12 words.`;

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
      plan:result.overview+"\n\n"+result.weeklyPlan.map(w=>`Week ${w.week}: ${w.focus}\n${w.activities.map(a=>"• "+a).join("\n")}`).join("\n\n"),
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
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>✨ AI Unit Builder</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>
              {["Pick a subject","Details","Generating…","Your unit plan"][step]}
            </div>
          </div>
          {step!==2&&<button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
        </div>
        {/* Progress steps */}
        {step<3&&<div style={{display:"flex",gap:"4px",padding:"0.65rem 1.3rem 0",flexShrink:0}}>
          {[0,1,2].map(i=><div key={i} style={{flex:1,height:"4px",borderRadius:"99px",background:i<=step?pal.primary:pal.stone+"50",transition:"background 0.25s"}}/>)}
        </div>}

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>

          {/* Step 0 — Subject picker */}
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

          {/* Step 1 — Details */}
          {step===1&&(<>
            <div style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.75rem",background:pal.pale,borderRadius:"13px",marginBottom:"1rem",border:`2px solid ${pal.primary}20`}}>
              <span style={{fontSize:"1.5rem"}}>{subject?.icon}</span>
              <span style={{fontWeight:"700",color:pal.primary,fontSize:"0.88rem"}}>{subject?.label}</span>
              <button onClick={()=>setStep(0)} style={{marginLeft:"auto",fontSize:"0.72rem",color:pal.slate,background:"transparent",border:"none",cursor:"pointer",fontWeight:"600"}}>Change</button>
            </div>
            <Lbl pal={pal}>Topic or title</Lbl>
            <Input pal={pal} value={topic} onChange={setTopic} placeholder={`e.g. ${subject?.id==="history"?"Ancient Egypt":subject?.id==="math"?"Fractions & Decimals":subject?.id==="science"?"Weather & Climate":"The American Revolution"}`} />
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

          {/* Step 2 — Generating */}
          {step===2&&(
            <div style={{textAlign:"center",padding:"2rem 1rem",animation:"fadeIn 0.3s ease"}}>
              <div style={{fontSize:"3.5rem",marginBottom:"1rem",animation:"pulse 1.4s ease infinite"}}>✨</div>
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

          {/* Step 3 — Result */}
          {step===3&&result&&(
            <div style={{animation:"fadeUp 0.25s ease"}}>
              {/* Title & overview */}
              <div style={{background:pal.heroGrad,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.55rem",position:"relative"}}>
                  <span style={{fontSize:"1.4rem"}}>{subject?.icon}</span>
                  <div>
                    <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:"700"}}>{subject?.label} · {duration}</div>
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
                Next →
              </button>
            </>
          )}
          {step===1&&(
            <>
              <button onClick={()=>setStep(0)} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>‹ Back</button>
              <button onClick={generate} disabled={!topic.trim()} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:topic.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:topic.trim()?"pointer":"not-allowed"}}>
                ✨ Build It
              </button>
            </>
          )}
          {step===3&&(
            <>
              <button onClick={()=>{setStep(1);setResult(null);}} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Rebuild</button>
              <button onClick={handleSave} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                Save Unit ✓
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   AI WORKSHEET MODAL — live Claude API
═══════════════════════════════════════ */
function AIWorksheetModal({ pal, family, activeChild, wsType, onClose }) {
  const [topic,   setTopic]   = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isCustom = wsType==="custom";
  const ws = isCustom ? {id:"custom",label:"Custom Worksheet",icon:"✨"} : wsType;

  const generate = async () => {
    if(!topic.trim()) return;
    setLoading(true); setError(null);
    const child=activeChild;
    const grade=child?.grade||"elementary";
    const prompt = `Create a homeschool worksheet for a ${grade} student.

Worksheet type: ${ws.label}
Topic: ${topic}
Student name: ${child?.name||"Student"}

Respond in this exact JSON format (no markdown, no backticks, just raw JSON):
{
  "title": "worksheet title",
  "instructions": "one clear sentence of instructions",
  "items": [
    {"type": "prompt", "content": "item text"},
    {"type": "prompt", "content": "item text"},
    {"type": "prompt", "content": "item text"},
    {"type": "prompt", "content": "item text"},
    {"type": "prompt", "content": "item text"}
  ],
  "bonusChallenge": "one optional bonus challenge sentence"
}

Make items age-appropriate for ${grade}. For copywork: provide beautiful sentences to copy. For narration: provide open-ended reflection prompts. For math: provide practice problems. For spelling: provide 8 words with a sentence each. For quiz: provide 5 questions with blank answer lines. Keep items concise and clear.`;

    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch(e) {
      setError("Couldn't generate worksheet right now. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.75)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 -14px 60px rgba(0,0,0,0.35)",animation:"slideUp 0.28s ease"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>
        <div style={{padding:"0.75rem 1.3rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{ws.icon} {ws.label}</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>{activeChild?.name||"Student"} · {activeChild?.grade||"All grades"}</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem"}}>
          {!result&&!loading&&(<>
            <Lbl pal={pal}>What topic?</Lbl>
            <Input pal={pal} value={topic} onChange={setTopic}
              placeholder={ws.id==="copywork"?"e.g. Famous quotes about nature":ws.id==="math"?"e.g. Adding fractions":"e.g. Ancient Egypt"}
            />
            {error&&<div style={{marginTop:"0.65rem",padding:"0.7rem",background:pal.badBg,borderRadius:"10px",fontSize:"0.78rem",color:"#a03030"}}>{error}</div>}
            <div style={{height:"0.85rem"}}/>
          </>)}

          {loading&&(
            <div style={{textAlign:"center",padding:"2rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem",animation:"pulse 1.2s ease infinite"}}>{ws.icon}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.95rem",marginBottom:"0.3rem"}}>Building your worksheet…</div>
              <div style={{fontSize:"0.78rem",color:pal.slate}}>This takes about 10 seconds</div>
            </div>
          )}

          {result&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {/* Worksheet header */}
              <div style={{background:pal.parchm,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}45`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.3rem"}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.92rem",flex:1,paddingRight:"0.5rem"}}>{result.title}</div>
                  <span style={{fontSize:"0.68rem",fontWeight:"700",color:pal.primary,background:pal.pale,borderRadius:"50px",padding:"0.12rem 0.5rem",flexShrink:0}}>{ws.label}</span>
                </div>
                <div style={{display:"flex",gap:"1rem",fontSize:"0.7rem",color:pal.slate}}>
                  <span>Name: {activeChild?.name||"___________"}</span>
                  <span>Date: ___________</span>
                </div>
              </div>
              {/* Instructions */}
              <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.85rem",fontStyle:"italic",padding:"0 0.2rem"}}>
                📌 {result.instructions}
              </div>
              {/* Items */}
              <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"0.85rem"}}>
                {(result.items||[]).map((item,i)=>(
                  <div key={i} style={{background:pal.linen,borderRadius:"13px",padding:"0.8rem 0.95rem",border:`1.5px solid ${pal.stone}40`}}>
                    <div style={{display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
                      <div style={{width:"22px",height:"22px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.6,marginBottom:"0.45rem"}}>{item.content}</div>
                        <div style={{borderBottom:`1px solid ${pal.stone}60`,height:"1px",marginBottom:"0.3rem"}}/>
                        <div style={{borderBottom:`1px solid ${pal.stone}35`,height:"1px"}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bonus */}
              {result.bonusChallenge&&(
                <div style={{background:pal.pale,borderRadius:"12px",padding:"0.75rem 0.9rem",border:`2px solid ${pal.primary}25`,marginBottom:"0.5rem"}}>
                  <div style={{fontWeight:"700",color:pal.primary,fontSize:"0.75rem",marginBottom:"0.2rem"}}>⭐ Bonus Challenge</div>
                  <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.55}}>{result.bonusChallenge}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{padding:"0.9rem 1.3rem",borderTop:`1px solid ${pal.stone}45`,display:"flex",gap:"0.6rem",flexShrink:0}}>
          {!result&&!loading&&(
            <>
              <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
              <button onClick={generate} disabled={!topic.trim()} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:topic.trim()?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:topic.trim()?"pointer":"not-allowed"}}>
                ✨ Generate
              </button>
            </>
          )}
          {result&&(
            <>
              <button onClick={()=>{setResult(null);setTopic("");}} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>New</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                Done ✓
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function PortfolioScreen({pal,family,child,setChild,entries=[]}){
  const items = child==="all" ? entries : entries.filter(e=>{
    const idx=family.children.findIndex(c=>c.id===child);
    return e.childIdx===idx;
  });
  const getChild = (e) => family.children[e.childIdx];
  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Portfolio" sub="Work & Achievements" icon="🗂️"/>
      <div style={{padding:"0 1rem"}}>
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.75rem",overflowX:"auto"}}>
          <Chip pal={pal} label="All" active={child==="all"} onClick={()=>setChild("all")} small/>
          {family.children.map(c=><Chip key={c.id} pal={pal} label={`${c.avatar} ${c.name}`} active={child===c.id} onClick={()=>setChild(c.id)} small/>)}
        </div>
        {items.length===0
          ? <div style={{background:pal.linen,borderRadius:"18px",padding:"2rem",textAlign:"center",border:`1.5px solid ${pal.stone}35`}}><div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🌱</div><div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.88rem",marginBottom:"0.2rem"}}>No entries yet</div><div style={{fontSize:"0.76rem",color:pal.slate}}>Check-ins and student notes will appear here.</div></div>
          : <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem"}}>{items.map(p=>{const ch=getChild(p);return <div key={p.id} style={{background:pal.linen,borderRadius:"16px",overflow:"hidden",border:`1.5px solid ${pal.stone}35`,cursor:"pointer"}}><div style={{height:"78px",background:pal.heroGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.4rem"}}>{p.thumb}</div><div style={{padding:"0.65rem 0.75rem"}}><div style={{fontWeight:"700",color:pal.ink,fontSize:"0.8rem",lineHeight:1.3,marginBottom:"3px"}}>{p.title}</div><div style={{fontSize:"0.65rem",color:pal.slate,marginBottom:"5px"}}>{p.subj} · {p.date}</div><div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.primary}}>{ch?.avatar} {ch?.name}</div></div></div>;})} </div>
        }
        <div style={{display:"flex",gap:"0.55rem",marginBottom:"1rem"}}>
          <button style={{flex:1,padding:"0.75rem",border:`2px solid ${pal.primary}`,borderRadius:"13px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>🖨️ Print Book</button>
          <button style={{flex:1,padding:"0.75rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:pal.onDark,fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>+ Add Entry</button>
        </div>
      </div>
    </div>
  );
}
function AttendanceScreen({pal, family, days, pending, onConfirmPull, onCatchup}){
  const REQUIRED = 180;
  const remaining = REQUIRED - days;
  const pct = Math.round((days/REQUIRED)*100);
  const weeksLeft = Math.round(remaining/5*10)/10;
  const onTrack = pct >= 68; // roughly where they should be mid-year
  const MONTHS=[
    {m:"Aug",target:20,actual:20},{m:"Sep",target:20,actual:20},{m:"Oct",target:18,actual:18},
    {m:"Nov",target:14,actual:13},{m:"Dec",target:10,actual:10},{m:"Jan",target:20,actual:18},
    {m:"Feb",target:18,actual:17},{m:"Mar",target:10,actual:days-116,cap:true},
    {m:"Apr",target:18,actual:0},{m:"May",target:12,actual:0},
  ];
  return (
    <div style={{animation:"fadeUp 0.22s ease"}}>
      <ScreenHdr pal={pal} title="Attendance" sub={`${family?.state||"Tennessee"} · 2024–2025`} icon="📋"/>
      <div style={{padding:"1rem"}}>

        {/* Schedule pull banner — appears when schedule has unconfirmed days */}
        {pending>0&&(
          <div style={{background:pal.pale,borderRadius:"16px",padding:"0.9rem 1.1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}30`,animation:"fadeUp 0.2s ease"}}>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
              <div style={{width:"40px",height:"40px",borderRadius:"11px",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>📅</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.88rem",marginBottom:"0.2rem"}}>
                  {pending} school {pending===1?"day":"days"} ready to log
                </div>
                <div style={{fontSize:"0.75rem",color:pal.inkM,lineHeight:1.6,marginBottom:"0.65rem"}}>
                  Your schedule shows {pending} completed {pending===1?"day":"days"} not yet counted. Add {pending===1?"it":"them"} to your attendance record?
                </div>
                <div style={{display:"flex",gap:"0.5rem"}}>
                  <button onClick={onConfirmPull} style={{flex:1,padding:"0.6rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.8rem",cursor:"pointer"}}>
                    ✓ Yes, add {pending===1?"it":"them"}
                  </button>
                  <button style={{padding:"0.6rem 0.85rem",border:`1.5px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.8rem",cursor:"pointer"}}>
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.65rem",marginBottom:"1rem"}}>
          {[
            {l:"Days Logged",  v:days,         bg:pal.goodBg,  c:pal.good},
            {l:"Days Needed",  v:remaining,    bg:pal.warnBg,  c:pal.warn},
            {l:"Absences",     v:4,            bg:pal.badBg,   c:pal.bad},
            {l:"Excused",      v:3,            bg:pal.parchm,  c:pal.slate},
          ].map(s=>(
            <div key={s.l} style={{background:s.bg,borderRadius:"14px",padding:"0.85rem",textAlign:"center",border:`1px solid ${s.c}18`}}>
              <div style={{fontWeight:"900",fontSize:"1.5rem",color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:"0.62rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:"3px"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Year progress bar */}
        <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}45`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <span style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem"}}>Year Progress</span>
            <span style={{fontWeight:"900",color:onTrack?pal.good:pal.warn,fontSize:"0.82rem"}}>{pct}% {onTrack?"✓":"⚠️"}</span>
          </div>
          <div style={{height:"12px",borderRadius:"99px",background:pal.parchm,overflow:"hidden",marginBottom:"7px"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:onTrack?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:pal.slate}}>
            <span>{days} of {REQUIRED} days complete</span>
            <span>~{weeksLeft} weeks to go</span>
          </div>
        </div>

        {/* Monthly breakdown */}
        <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}45`}}>
          <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",marginBottom:"0.75rem"}}>Monthly Breakdown</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
            {MONTHS.filter(m=>m.target>0).map((m,i)=>{
              const actual=m.cap?Math.max(0,Math.min(m.actual,m.target)):m.actual;
              const done=actual>=m.target;
              const future=m.actual===0&&!m.cap;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
                  <div style={{width:"28px",fontSize:"0.7rem",fontWeight:"700",color:future?pal.stone:pal.inkM,flexShrink:0}}>{m.m}</div>
                  <div style={{flex:1,height:"8px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
                    {!future&&<div style={{height:"100%",width:`${Math.round(actual/m.target*100)}%`,borderRadius:"99px",background:done?`linear-gradient(90deg,${pal.good},${pal.mid})`:pal.accentGrad,transition:"width 0.4s"}}/>}
                  </div>
                  <div style={{width:"32px",textAlign:"right",fontSize:"0.7rem",fontWeight:"700",color:future?pal.stone:done?pal.good:pal.warn,flexShrink:0}}>
                    {future?"—":`${actual}/${m.target}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warm status card + catch-up trigger */}
        <div style={{background:onTrack?pal.goodBg:pal.warnBg,borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"1rem",border:`2px solid ${onTrack?pal.good:pal.warn}22`}}>
          <div style={{fontWeight:"800",color:onTrack?pal.good:pal.warn,fontSize:"0.9rem",marginBottom:"0.3rem"}}>
            {onTrack?"💚 You're on track!":"💛 A little behind — no worries!"}
          </div>
          <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.65,marginBottom:onTrack?0:"0.75rem"}}>
            {onTrack
              ? `Amazing work — ${days} days logged and right on schedule. Keep going!`
              : `You need ${remaining} more days. That's totally doable — you've got about ${weeksLeft} weeks left and plenty of time to catch up.`
            }
          </div>
          {!onTrack&&(
            <button onClick={onCatchup} style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"12px",background:`linear-gradient(135deg,${pal.warn},${pal.accentD})`,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer"}}>
              📅 Build a Catch-Up Plan
            </button>
          )}
        </div>
        <div style={{height:"0.5rem"}}/>
      </div>
    </div>
  );
}
function CoopScreen({pal,family,coopLog,onLog}){
  const [showQL,setShowQL]=useState(false);
  return <><div style={{animation:"fadeUp 0.22s ease"}}><ScreenHdr pal={pal} title="Co-op" sub="Sessions & Field Trips" icon="🏫"/><div style={{padding:"1rem"}}><div style={{background:pal.pale,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`2px solid ${pal.accent}25`}}><div style={{fontWeight:"700",color:pal.primary,fontSize:"0.84rem",marginBottom:"2px"}}>📅 Next Session</div><div style={{fontSize:"0.8rem",color:pal.inkM}}>Friday, March 14 · Classical Conversations · 9am–12pm</div></div>{[{d:"Mar 14",s:"Classical Conversations",h:3,i:"🏛️"},{d:"Mar 21",s:"Art & Nature Study",h:2,i:"🎨"},{d:"Mar 28",s:"Science Fair Prep",h:2.5,i:"🔬"}].map((s,i)=><div key={i} style={{background:pal.linen,borderRadius:"13px",padding:"0.75rem 0.9rem",display:"flex",gap:"0.75rem",alignItems:"center",border:`1.5px solid ${pal.stone}40`,marginBottom:"0.5rem"}}><div style={{width:"38px",height:"38px",borderRadius:"10px",background:pal.pale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",flexShrink:0}}>{s.i}</div><div style={{flex:1}}><div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{s.s}</div><div style={{fontSize:"0.7rem",color:pal.slate}}>{s.d} · {s.h}h</div></div><button onClick={()=>setShowQL(true)} style={{padding:"0.28rem 0.65rem",border:"none",borderRadius:"7px",background:pal.accentGrad,color:pal.onDark,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>Log</button></div>)}
    {coopLog.length>0&&<div style={{marginBottom:"0.75rem"}}><div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",marginBottom:"0.5rem"}}>✅ Recent logs</div>{coopLog.slice(0,2).map((l,i)=><div key={i} style={{background:pal.pale,borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.38rem",fontSize:"0.78rem",color:pal.inkM}}><b>{l.session}</b> · {l.hrs}h · {l.date||"today"}</div>)}</div>}
    <button onClick={()=>setShowQL(true)} style={{width:"100%",padding:"0.8rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.86rem",cursor:"pointer",marginTop:"0.25rem"}}>⚡ Quick Log (60 sec)</button><div style={{height:"1rem"}}/></div></div>
  {showQL&&<CoopQuickLogModal pal={pal} family={family} onSave={e=>{onLog({...e,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})});}} onClose={()=>setShowQL(false)}/>}</>;
}
function TranscriptsScreen({pal,family}){
  return <div style={{animation:"fadeUp 0.22s ease"}}><ScreenHdr pal={pal} title="Records" sub="Transcripts & Reports" icon="🎓"/><div style={{padding:"1rem"}}>{family.children.map(c=><div key={c.id} style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.65rem",border:`1.5px solid ${pal.stone}40`}}><div style={{display:"flex",gap:"0.65rem",alignItems:"center",marginBottom:"0.65rem"}}><span style={{fontSize:"1.4rem"}}>{c.avatar}</span><div><div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem"}}>{c.name}</div><div style={{fontSize:"0.7rem",color:pal.slate}}>{c.grade}</div></div></div><div style={{display:"flex",gap:"0.45rem"}}>{[["📋","Transcript"],["📖","Narrative"],["📊","Progress"]].map(([ic,l])=><button key={l} style={{flex:1,padding:"0.45rem 0.3rem",border:`2px solid ${pal.stone}45`,borderRadius:"9px",background:pal.pale,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:"1rem"}}>{ic}</div><div style={{fontSize:"0.58rem",fontWeight:"600",color:pal.primary}}>{l}</div></button>)}</div></div>)}<div style={{height:"1rem"}}/></div></div>;
}
function MoreScreen({pal,family,onNav,onTheme,onNavEdit,onSettings}){
  return <div style={{animation:"fadeUp 0.22s ease"}}><ScreenHdr pal={pal} title="More" sub="Tools & Settings" icon="⋯"/><div style={{padding:"1rem"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem"}}>{[{id:"attendance",icon:"📋",label:"Attendance"},{id:"transcripts",icon:"🎓",label:"Records"},{id:"coop",icon:"🏫",label:"Co-op"},{id:"settings",icon:"⚙️",label:"Settings"}].map(it=><button key={it.id} onClick={()=>onNav(it.id)} style={{padding:"1.1rem 0.85rem",border:`2px solid ${pal.stone}40`,borderRadius:"16px",background:pal.linen,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:"0.5rem"}}><span style={{fontSize:"1.6rem"}}>{it.icon}</span><span style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem"}}>{it.label}</span></button>)}</div><div style={{background:pal.heroGrad,borderRadius:"18px",padding:"1.1rem 1.2rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",right:"-20px",top:"-20px",width:"100px",height:"100px",borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/><div style={{position:"relative"}}><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:"700",marginBottom:"0.2rem"}}>Your School</div><div style={{fontWeight:"800",color:pal.onDark,fontSize:"0.95rem",marginBottom:"0.1rem"}}>{family.schoolName||"Bloom Academy"}</div><div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.75rem"}}>{family.familyName} · {family.state}</div><div style={{display:"flex",gap:"0.5rem"}}>{family.children.map(c=><div key={c.id} style={{background:"rgba(255,255,255,0.12)",borderRadius:"9px",padding:"0.35rem 0.6rem",textAlign:"center"}}><div style={{fontSize:"1rem"}}>{c.avatar}</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.65)",fontWeight:"600"}}>{c.name}</div></div>)}</div></div></div><div style={{height:"1rem"}}/></div></div>;
}

/* ═══════ MODALS ═══════ */
function CheckinModal({ pal, family, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState({});
  const [notes,   setNotes]   = useState({});

  const handleSave = () => {
    // Save a portfolio entry for each child who has a note
    family.children.forEach((c,idx)=>{
      const note=notes[c.id];
      if(note?.trim()) {
        onSave?.({
          childIdx:idx,
          title:note.slice(0,42),
          subj:"Daily Check-In",
          date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
          thumb:"✍️",
          note,
        });
      }
    });
    setStep(2);
  };

  return (
    <BottomSheet pal={pal} onClose={onClose} title={["How did today go?","What was learned?","Logged! 🌱"][step]} sub={["Rate each child","One quick note per child","Great work staying consistent"][step]}>
      <div style={{display:"flex",gap:"5px",marginBottom:"1rem"}}>
        {[0,1,2].map(i=><div key={i} style={{height:"4px",flex:1,borderRadius:"99px",background:i<=step?pal.primary:pal.stone+"50",transition:"background 0.25s"}}/>)}
      </div>
      {step===0&&<div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
        {family.children.map(c=><div key={c.id} style={{background:pal.sand,borderRadius:"14px",padding:"0.85rem 1rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.6rem"}}><span style={{fontSize:"1.3rem"}}>{c.avatar}</span><span style={{fontWeight:"700",color:pal.ink}}>{c.name}</span></div>
          <div style={{display:"flex",gap:"0.4rem"}}>
            {["😔","😐","🙂","😊","🌟"].map((e,i)=><button key={i} onClick={()=>setRatings(r=>({...r,[c.id]:i}))} style={{flex:1,padding:"0.52rem",borderRadius:"10px",border:`2px solid ${ratings[c.id]===i?pal.primary:pal.stone+"55"}`,background:ratings[c.id]===i?pal.pale:"transparent",cursor:"pointer",fontSize:"1.3rem"}}>{e}</button>)}
          </div>
        </div>)}
      </div>}
      {step===1&&<div>{family.children.map(c=><div key={c.id} style={{marginBottom:"0.7rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.3rem"}}><span>{c.avatar}</span><span style={{fontSize:"0.8rem",fontWeight:"700",color:pal.inkM}}>{c.name}</span></div>
        <textarea value={notes[c.id]||""} onChange={e=>setNotes(n=>({...n,[c.id]:e.target.value}))} placeholder={`Something ${c.name} learned today…`} rows={2} style={{width:"100%",padding:"0.65rem 0.8rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",lineHeight:1.55}} onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
      </div>)}</div>}
      {step===2&&<div style={{textAlign:"center",padding:"0.75rem 0"}}>
        <div style={{fontSize:"3.5rem",marginBottom:"0.6rem"}}>🌱</div>
        <div style={{fontWeight:"800",color:pal.primary,fontSize:"1rem",marginBottom:"0.35rem"}}>Check-in saved!</div>
        <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.7}}>Added to attendance and portfolio. You're doing something beautiful.</div>
      </div>}
      <div style={{display:"flex",gap:"0.6rem",marginTop:"1rem"}}>
        {step<2
          ? <><button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Skip</button>
              <button onClick={()=>step===1?handleSave():setStep(s=>s+1)} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{step===0?"Next →":"Save ✓"}</button></>
          : <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Done 🌱</button>}
      </div>
    </BottomSheet>
  );
}

function ThemeModal({ pal, paletteId, setPaletteId, customA, customB, setCustomA, setCustomB, onClose }) {
  const [la,setLa]=useState(customA), [lb,setLb]=useState(customB);
  const preview=paletteId==="custom"?buildTheme(la,lb):pal;
  return (
    <BottomSheet pal={pal} onClose={onClose} title="Choose Your Theme" sub="Pick colors that feel like your family">
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.45rem",marginBottom:"1rem"}}>
        {PRESET_PALETTES.map(p=>{const sel=paletteId===p.id;return(
          <button key={p.id} onClick={()=>setPaletteId(p.id)} style={{padding:"0.55rem 0.4rem",borderRadius:"12px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"center"}}>
            {p.isCustom?<div style={{height:"22px",borderRadius:"6px",background:`linear-gradient(90deg,${la},${lb})`,marginBottom:"0.25rem"}}/>:<div style={{height:"22px",borderRadius:"6px",background:`linear-gradient(90deg,${p.a},${lerpHex(p.a,p.b,0.5)},${p.b})`,marginBottom:"0.25rem"}}/>}
            <div style={{fontSize:"0.63rem",fontWeight:sel?"800":"500",color:sel?pal.primary:pal.inkM}}>{p.emoji} {p.name}</div>
          </button>
        );})}
      </div>
      {paletteId==="custom"&&<div style={{background:pal.pale,borderRadius:"12px",padding:"0.85rem",marginBottom:"1rem",border:`2px solid ${pal.accent}20`}}>
        <div style={{display:"flex",gap:"0.85rem",alignItems:"center",marginBottom:"0.6rem"}}>
          {[["Deep",la,setLa],["Bloom",lb,setLb]].map(([l,v,set])=><div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem"}}>
            <input type="color" value={v} onChange={e=>set(e.target.value)} style={{width:"48px",height:"48px",borderRadius:"11px",border:`2px solid ${pal.stone}`,cursor:"pointer",padding:"2px"}}/>
            <div style={{fontSize:"0.65rem",color:pal.slate,fontWeight:"600"}}>{l}</div>
          </div>)}
          <div style={{flex:1,height:"36px",borderRadius:"9px",background:`linear-gradient(90deg,${la},${lerpHex(la,lb,0.5)},${lb})`}}/>
        </div>
      </div>}
      <div style={{background:preview.heroGrad,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",fontWeight:"700",textTransform:"uppercase"}}>Preview</div><div style={{fontWeight:"800",color:"rgba(255,255,255,0.9)",fontSize:"0.92rem"}}>Good morning 🌱</div></div>
        <div style={{height:"30px",padding:"0 0.75rem",borderRadius:"99px",background:preview.accentGrad,display:"flex",alignItems:"center"}}><span style={{fontSize:"0.7rem",fontWeight:"800",color:preview.onDark}}>✨ Check-In</span></div>
      </div>
      <button onClick={()=>{if(paletteId==="custom"){setCustomA(la);setCustomB(lb);}onClose();}} style={{width:"100%",padding:"0.8rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Apply Theme ✓</button>
    </BottomSheet>
  );
}

function NavModal({ pal, navIds, setNavIds, onClose }) {
  const [local,setLocal]=useState(navIds);
  const toggle=id=>{
    const s=ALL_SECTIONS.find(x=>x.id===id);
    if(s?.locked)return;
    if(local.includes(id)){if(local.length<=3)return;setLocal(l=>l.filter(x=>x!==id));}
    else{if(local.length>=5)return;setLocal(l=>[...l,id]);}
  };
  return (
    <BottomSheet pal={pal} onClose={onClose} title="Customize Your Nav" sub={`${local.length} tabs · 3–5 · Home, Schedule & Portfolio always stay`}>
      <div style={{display:"flex",flexDirection:"column",gap:"0.42rem",marginBottom:"1rem"}}>
        {ALL_SECTIONS.filter(s=>s.id!=="more").map(s=>{
          const on=local.includes(s.id),atMax=local.length>=5&&!on;
          return <button key={s.id} onClick={()=>toggle(s.id)} style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.7rem 0.9rem",border:`2px solid ${on?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:on?pal.pale:"transparent",cursor:s.locked||atMax?"default":"pointer",opacity:atMax&&!on?0.35:1,transition:"all 0.13s",textAlign:"left"}}>
            <span style={{fontSize:"1.2rem",width:"28px",textAlign:"center"}}>{s.icon}</span>
            <span style={{flex:1,fontWeight:on?"700":"400",color:on?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
            {s.locked?<span style={{fontSize:"0.7rem",color:pal.slate}}>🔒</span>:<div style={{width:"19px",height:"19px",borderRadius:"5px",border:`2px solid ${on?pal.primary:pal.stone}`,background:on?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{on&&<span style={{color:pal.onDark,fontSize:"0.65rem",fontWeight:"900"}}>✓</span>}</div>}
          </button>;
        })}
      </div>
      <div style={{background:pal.linen,borderRadius:"12px",border:`1.5px solid ${pal.stone}45`,padding:"0.65rem",marginBottom:"1rem"}}>
        <div style={{fontSize:"0.65rem",color:pal.slate,textAlign:"center",marginBottom:"0.5rem",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.07em"}}>Preview</div>
        <div style={{display:"flex",justifyContent:"center"}}>{local.map(id=>{const s=ALL_SECTIONS.find(x=>x.id===id);return <div key={id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"0.35rem 0"}}><span style={{fontSize:"1.1rem"}}>{s?.icon}</span><span style={{fontSize:"0.57rem",color:pal.primary,fontWeight:"700"}}>{s?.label}</span></div>;})}</div>
      </div>
      <button onClick={()=>{setNavIds(local);onClose();}} style={{width:"100%",padding:"0.8rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Save Nav ✓</button>
    </BottomSheet>
  );
}

/* ═══════════════════════════════════════
   SCHEDULE → ATTENDANCE CONFIRM MODAL
═══════════════════════════════════════ */
function SchedConfirmModal({ pal, family, days, onConfirm, onClose }) {
  const todayStr = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  return (
    <BottomSheet pal={pal} onClose={onClose} title="Log Today to Attendance?" sub={todayStr}>
      <div style={{background:pal.pale,borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}20`}}>
        <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"0.8rem"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>📅</div>
          <div>
            <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.92rem"}}>Today's schedule is complete</div>
            <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>Ready to count as a school day?</div>
          </div>
        </div>
        {[
          {icon:"📚",label:"6 subjects completed"},
          {icon:"📋",label:"Counts toward your 180 days"},
          {icon:"🗂️",label:"Check-in notes saved to portfolio"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",gap:"0.55rem",alignItems:"center",padding:"0.38rem 0",borderTop:i>0?`1px solid ${pal.stone}30`:"none"}}>
            <span style={{fontSize:"1rem",width:"22px",textAlign:"center",flexShrink:0}}>{r.icon}</span>
            <span style={{fontSize:"0.78rem",color:pal.inkM}}>{r.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"0.6rem"}}>
        <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>Not yet</button>
        <button onClick={onConfirm} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>✓ Yes, log it!</button>
      </div>
    </BottomSheet>
  );
}

/* ═══════════════════════════════════════
   CATCH-UP RESCHEDULER MODAL
   Warm, practical, not stressful
═══════════════════════════════════════ */
function CatchupModal({ pal, family, days, needed, onClose }) {
  const remaining  = needed - days;
  const weeksLeft  = 11; // approximate weeks remaining in year
  const daysPerWk  = Math.ceil(remaining / weeksLeft);
  const extraPerWk = Math.max(0, daysPerWk - 5);
  const [plan, setPlan] = useState(null); // null | "light" | "medium" | "steady"

  const PLANS = [
    {
      id:"steady",
      icon:"🌿",
      title:"Steady & Consistent",
      desc:`School 5 days/week with no breaks — you'll finish right on time.`,
      wks:weeksLeft, extra:0, color:pal.good, bg:pal.goodBg,
      steps:[
        "Keep your current daily schedule going",
        "Aim for zero unplanned absences this term",
        "Use make-up Saturdays only if needed",
      ],
    },
    {
      id:"medium",
      icon:"☀️",
      title:"Light Catch-Up",
      desc:`Add one extra morning session per week — gentle but effective.`,
      wks:weeksLeft-1, extra:1, color:pal.warn, bg:pal.warnBg,
      steps:[
        "Add a 2-hour Friday afternoon session each week",
        "Use summer week if needed as backup",
        "Keep weekends free — you've earned it",
      ],
    },
    {
      id:"light",
      icon:"⚡",
      title:"Sprint to Finish",
      desc:`School 6 days/week for a few weeks — done early with time to spare.`,
      wks:weeksLeft-2, extra:2, color:pal.primary, bg:pal.pale,
      steps:[
        "Add Saturday school for 4–5 weeks",
        "Double up one subject block daily",
        "Build in a free week as reward at the end",
      ],
    },
  ];

  const selected = plan ? PLANS.find(p=>p.id===plan) : null;

  return (
    <BottomSheet pal={pal} onClose={onClose} title="📅 Your Catch-Up Plan" sub={`${remaining} days to go · ${weeksLeft} weeks left`} tall>
      {/* Warm opener */}
      <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1.1rem",marginBottom:"1.1rem",border:`2px solid ${pal.primary}18`}}>
        <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>
          You're doing better than you think 💚
        </div>
        <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.7}}>
          {days} days logged is real, meaningful schoolwork. You have {weeksLeft} weeks left and {remaining} days to go — that's completely achievable with any of these paths.
        </div>
      </div>

      {/* Plan picker */}
      {!plan && (<>
        <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.65rem"}}>Choose your path</div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"}}>
          {PLANS.map(p=>(
            <button key={p.id} onClick={()=>setPlan(p.id)} style={{padding:"0.9rem 1rem",border:`2px solid ${p.color}25`,borderRadius:"16px",background:p.bg,cursor:"pointer",textAlign:"left",display:"flex",gap:"0.8rem",alignItems:"flex-start",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.6rem",flexShrink:0,marginTop:"2px"}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"800",color:p.color,fontSize:"0.88rem",marginBottom:"0.2rem"}}>{p.title}</div>
                <div style={{fontSize:"0.75rem",color:pal.inkM,lineHeight:1.55}}>{p.desc}</div>
              </div>
              <span style={{color:p.color,fontSize:"1.1rem",flexShrink:0,marginTop:"4px"}}>›</span>
            </button>
          ))}
        </div>
      </>)}

      {/* Selected plan detail */}
      {selected && (
        <div style={{animation:"fadeUp 0.2s ease"}}>
          <button onClick={()=>setPlan(null)} style={{display:"flex",alignItems:"center",gap:"0.35rem",background:"transparent",border:"none",color:pal.primary,cursor:"pointer",fontSize:"0.78rem",fontWeight:"700",marginBottom:"0.85rem",padding:0}}>
            ‹ Back to plans
          </button>
          <div style={{background:selected.bg,borderRadius:"18px",padding:"1.1rem 1.2rem",marginBottom:"1rem",border:`2px solid ${selected.color}22`}}>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"0.75rem"}}>
              <span style={{fontSize:"2rem"}}>{selected.icon}</span>
              <div>
                <div style={{fontWeight:"900",color:selected.color,fontSize:"1rem"}}>{selected.title}</div>
                <div style={{fontSize:"0.73rem",color:pal.slate,marginTop:"1px"}}>Finish in ~{selected.wks} weeks</div>
              </div>
            </div>
            {selected.steps.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start",padding:"0.42rem 0",borderTop:i>0?`1px solid ${selected.color}18`:"none"}}>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",background:selected.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                <span style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.55}}>{s}</span>
              </div>
            ))}
          </div>
          {/* Weekly schedule preview */}
          <div style={{background:pal.linen,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}45`}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.78rem",marginBottom:"0.6rem"}}>Sample week</div>
            <div style={{display:"flex",gap:"0.3rem"}}>
              {["M","T","W","T","F","S"].map((d,i)=>{
                const active = i < (5 + selected.extra);
                return (
                  <div key={i} style={{flex:1,textAlign:"center"}}>
                    <div style={{width:"100%",aspectRatio:"1",borderRadius:"8px",background:active?pal.accentGrad:pal.parchm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"800",color:active?"#fff":pal.stone,marginBottom:"3px"}}>{active?"✓":"—"}</div>
                    <div style={{fontSize:"0.58rem",color:active?pal.primary:pal.stone,fontWeight:active?"700":"400"}}>{d}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.7,marginBottom:"1rem",textAlign:"center",fontStyle:"italic"}}>
            Remember: consistency beats intensity. Even if you miss a day, you'll still be making progress.
          </div>
          <button onClick={onClose} style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
            Got it — let's do this! 🌱
          </button>
        </div>
      )}
    </BottomSheet>
  );
}


function ScreenHdr({pal,title,sub,icon}){
  return <div style={{background:pal.heroGrad,padding:"1.15rem 1.1rem 1.3rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",right:"-25px",top:"-25px",width:"110px",height:"110px",borderRadius:"50%",background:"rgba(255,255,255,0.055)"}}/><div style={{position:"relative"}}><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:"600",marginBottom:"0.2rem"}}>{sub}</div><div style={{display:"flex",alignItems:"center",gap:"0.55rem"}}><span style={{fontSize:"1.35rem"}}>{icon}</span><span style={{fontWeight:"800",color:pal.onDark,fontSize:"1.25rem"}}>{title}</span></div></div></div>;
}
function BottomSheet({children,onClose,title,sub,pal,tall}){
  return <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.72)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",boxShadow:"0 -14px 60px rgba(0,0,0,0.32)",animation:"slideUp 0.28s ease",maxHeight:tall?"88vh":"82vh",display:"flex",flexDirection:"column"}}><div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}><div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/></div><div style={{padding:"0.75rem 1.3rem 0.75rem",borderBottom:`1px solid ${pal.stone}45`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{title}</div>{sub&&<div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>{sub}</div>}</div><button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0,marginLeft:"0.75rem"}}>×</button></div><div style={{flex:1,overflowY:"auto",padding:"1rem 1.3rem 1.3rem"}}>{children}</div></div></div>;
}
function Chip({pal,label,active,onClick,dark,small}){
  return <button onClick={onClick} style={{padding:small?"0.2rem 0.55rem":"0.25rem 0.7rem",border:`2px solid ${active?(dark?"rgba(255,255,255,0.55)":pal.primary):(dark?"rgba(255,255,255,0.2)":pal.stone+"70")}`,borderRadius:"50px",background:active?(dark?"rgba(255,255,255,0.18)":pal.pale):"transparent",color:active?(dark?"#fff":pal.primary):(dark?"rgba(255,255,255,0.55)":pal.slate),fontSize:small?"0.7rem":"0.75rem",fontWeight:active?"700":"500",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{label}</button>;
}
function Btn({pal,children,onClick,disabled,style={}}){
  return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:disabled?"#ccc":pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.92rem",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,...style}}>{children}</button>;
}
function Input({pal,value,onChange,placeholder,type="text"}){
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.85rem",background:pal.parchm,color:pal.ink,outline:"none",transition:"border-color 0.18s"}} onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>;
}
function Select({pal,value,onChange,options}){
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.85rem",background:pal.parchm,color:pal.ink,outline:"none",cursor:"pointer"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
}
function Lbl({pal,children}){
  return <div style={{fontSize:"0.72rem",fontWeight:"700",color:pal.inkM,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.38rem"}}>{children}</div>;
}
function PillBtn({pal,label,active,onClick}){
  return <button onClick={onClick} style={{padding:"0.3rem 0.75rem",border:`2px solid ${active?pal.primary:pal.stone+"60"}`,borderRadius:"50px",background:active?pal.pale:"transparent",color:active?pal.primary:pal.inkM,fontSize:"0.78rem",fontWeight:active?"700":"400",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.13s"}}>{label}</button>;
}
function StepHdr({pal,icon,title,sub}){
  return <div style={{marginBottom:"1.2rem"}}><div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>{icon}</div><h2 style={{fontFamily:"Georgia",fontSize:"1.4rem",fontWeight:"800",color:pal.ink,margin:"0 0 0.3rem",lineHeight:1.2}}>{title}</h2><p style={{fontSize:"0.82rem",color:pal.slate,margin:0,lineHeight:1.6}}>{sub}</p></div>;
}
function SCard({pal,title,note,action,children}){
  return <div style={{background:pal.linen,borderRadius:"16px",padding:"1rem 1.1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}50`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}><span style={{fontWeight:"800",color:pal.inkM,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{title}</span>{note&&<span style={{fontSize:"0.65rem",color:pal.slate}}>{note}</span>}{action&&<button onClick={action.fn} style={{fontSize:"0.72rem",color:pal.bad,background:"transparent",border:"none",cursor:"pointer",fontWeight:"600"}}>{action.label}</button>}</div>{children}</div>;
}
function Row({pal,title,action}){
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}><span style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem"}}>{title}</span>{action&&<span style={{fontSize:"0.74rem",fontWeight:"700",cursor:"pointer",color:pal.primary,opacity:0.8}}>{action} →</span>}</div>;
}
