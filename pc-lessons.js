// ============================================================
//  ROOT & BLOOM — PREPARED & CAPABLE LESSON DATA
//  All P&C constants, weekly topics, lesson plans, and helpers
// ============================================================
//
//  LAST REVIEWED:   2026-04-01
//  NEXT REVIEW DUE: 2026-07-01
//
//  Contains:
//  - LR_NAME, LR_ICON, LR_COLOR, LR_COLOR2
//  - LR_CATEGORIES
//  - LR_WEEKLY_TOPICS (all grades Pre-K through 12th)
//  - LR_LESSON_PLANS (full lesson plans per topic)
//  - getLessonPlan() helper function
//
// ============================================================

const LR_NAME  = "Prepared & Capable";
const LR_ICON  = "🛡";
const LR_COLOR = "#8b2500";
const LR_COLOR2= "#e84c0a";

const LR_CATEGORIES = [
  {id:"firstaid",   label:"First Aid & Safety",      icon:"🚨", desc:"Cuts, burns, CPR, calling for help"},
  {id:"food",       label:"Food & Water",             icon:"🍞", desc:"Cooking from scratch, water storage, gardening"},
  {id:"home",       label:"Home & Tools",             icon:"🔨", desc:"Basic repairs, tool use, electricity safety"},
  {id:"navigation", label:"Navigation & Outdoors",    icon:"🧭", desc:"Maps, compass, fire, shelter, weather reading"},
  {id:"finance",    label:"Money & Finance",          icon:"💰", desc:"Budgeting, bills, savings, smart spending"},
  {id:"community",  label:"Community & Neighbors",    icon:"🤝", desc:"Who to call, neighborhood networks, communication"},
  {id:"mentalhealth",label:"Calm & Resilience",       icon:"🧠", desc:"Stress management, problem-solving, staying calm"},
  {id:"comms",      label:"Communication Skills",     icon:"📞", desc:"Without internet, ham radio, written plans"},
  {id:"nature",     label:"Nature & Foraging",        icon:"🌳", desc:"Plant ID, wild edibles, animal awareness"},
  {id:"vehicle",    label:"Vehicles & Transport",     icon:"🚗", desc:"Flat tires, basic car care, fuel planning"},
];

const LR_WEEKLY_TOPICS = {
  "Pre-K": ["What to do in an emergency", "Call 911 — when and how", "Stop Drop Roll", "My home address and phone number", "Fire escape plan practice", "What is a first aid kit?", "Healthy foods vs junk foods", "Washing hands properly", "Stranger safety basics", "Being a good neighbor", "My body — what hurts and what to do", "Thunderstorms — stay safe inside", "Hot and cold safety", "Crossing the street safely", "What does a police officer do?", "What does a firefighter do?", "Where does food come from?", "Drinking enough water every day", "Good sleep keeps us healthy", "Helping at home — simple chores", "What is weather?", "Sunscreen and sun safety", "Allergies and what to avoid", "If I get lost — what to do", "My neighborhood — who lives here?", "Animals that can hurt us", "Poisonous plants — don't touch", "Being kind in an emergency", "Sharing and taking turns", "What is a community garden?", "Packing a healthy snack", "Wearing a helmet and pads", "Buckle up — car seat safety", "Smoke detector — what is it for?", "Knowing your full name", "What grown-ups keep us safe"],
  "K": ["My emergency contact card", "Basic first aid — bandages and cuts", "Fire safety at home", "How plants grow — plant a seed", "Water — why we need it", "Intro to tools — look but ask first", "What is money?", "Community helpers who keep us safe", "Weather signs — clouds and rain", "Being helpful at home", "Learning my address and school name", "Stop Drop Roll practice", "Kitchen safety rules", "Watering plants and watching them grow", "Where does water come from?", "Simple kitchen tools — safe use", "Pennies nickels dimes — counting coins", "What does a paramedic do?", "Dressing for the weather", "Packing my own backpack", "What to do if someone is hurt", "Home fire drill with my family", "Growing sprouts on a windowsill", "Staying hydrated — how much water?", "Safe scissors and simple crafts", "Saving coins in a piggy bank", "What is a food pantry?", "Map of my classroom", "Animals in my neighborhood", "Basic composting — food scraps", "Night safety — staying visible", "Who to call for different emergencies", "Planting a seed and watching it grow", "Reading a weather forecast with a grown-up", "Helping prepare a simple meal", "What does a crossing guard do?"],
  "1st": ["First aid for cuts and scrapes", "Calling for help — 911 practice", "Home fire drill", "Growing food — container garden", "Water storage basics", "Simple cooking — no stove recipes", "Saving vs spending", "Reading a simple map", "Neighborhood map activity", "Basic knot — square knot", "Treating a bruise or bump", "Family emergency meeting spot", "Smoke alarms — testing and why", "Watering and feeding my plants", "Filling water bottles — how much to store", "Making a simple salad", "Needs vs wants — what do I really need?", "Cardinal directions — North South East West", "Drawing my street from memory", "Tying your shoes — double knot", "What to do if a friend gets hurt", "Building a mini first aid kit", "What to do if the power goes out", "Harvesting — picking what we grew", "Water from rain — puddles and collection", "Cooking with heat — safety rules", "Making change for a dollar", "Compass rose on a map", "Who are my neighbors?", "Nature observation — what do you notice?", "Simple stretches and staying active", "What is a food allergy?", "Bicycle helmet — always wear it", "Weather watching — what does the sky tell us?", "Can I eat that? — safe food handling", "Reading food labels with a grown-up"],
  "2nd": ["Burns and blisters first aid", "Emergency contact list", "Kitchen safety", "Seed saving basics", "Building a snack from scratch", "Simple home repairs — tightening screws", "Counting and making change", "Compass basics — N S E W", "Community emergency plan", "Weather preparedness", "Treating a nosebleed", "What goes in a go-bag?", "Carbon monoxide — the invisible danger", "Starting a seed journal", "Storing dry foods — rice beans pasta", "Using a screwdriver safely", "Weekly allowance — save spend give", "Following a trail on a map", "Neighborhood watch — what is it?", "Reading a thermometer — inside and outside", "Splinters and minor wound care", "Family fire drill — timed practice", "What is a weather alert?", "Composting basics — browns and greens", "Boiling water — when and why", "Measuring with a ruler — home repairs", "Banking basics — what is a savings account?", "Orienting a map to the real world", "Making a neighborhood safety map", "Wind chill and heat index — what they mean", "Foods that last a long time", "Safe storage of cleaning products", "Recognizing poison ivy and oak", "What is flood safety?", "Writing a family emergency contact card", "Cooking a simple breakfast safely"],
  "3rd": ["Choking response — Heimlich awareness", "Creating a family emergency binder", "Fire extinguisher types — A B C", "Garden planning — seasons and zones", "Water filtration intro", "Using basic hand tools — hammer and nails", "Budgeting a weekly snack budget", "Reading a physical map", "Food preservation — drying herbs", "Car safety basics", "Performing the Heimlich on a friend", "Building our family emergency binder", "How to use a fire extinguisher", "Planting by season — what grows when", "DIY water filter — sand gravel charcoal", "Measuring and cutting safely", "Creating a simple weekly budget", "Measuring distance on a map", "What is a neighborhood emergency plan?", "What to do in a car accident", "CPR awareness — why it matters", "72-hour kit — what goes inside", "Fire escape route — draw your home", "Companion planting — what grows well together", "Water purification — tablets and boiling", "Building a simple bookshelf with help", "Wants vs needs budget challenge", "Topographic map basics", "Food drives — organizing one", "Jump-starting a car — safety rules", "Preserving food — making jam", "Smoke vs carbon monoxide detectors", "What is earthquake preparedness?", "Dehydrating fruit at home", "Tracking expenses for one week", "What is a community emergency shelter?"],
  "4th": ["CPR intro — hands-only technique", "72-hour emergency kit build", "Electrical safety basics", "Canning and food preservation", "Water purification methods", "Building a simple shelter model", "Bank accounts — savings basics", "Navigating with a map and compass", "First aid for sprains and strains", "Identifying edible plants locally", "Practicing hands-only CPR steps", "Reviewing and updating the 72-hour kit", "Extension cords and power strips — safe use", "Pressure canning safety", "Ceramic water filter — how it works", "Tarp shelter — ridgeline setup", "Opening a savings account — how it works", "Triangulating your location on a map", "RICE method — rest ice compress elevate", "Edible plants in my backyard", "Recovery position — when to use it", "Water storage containers — food-grade only", "What is a circuit breaker?", "Making pickles — lacto-fermentation", "Solar disinfection of water — SODIS", "Debris hut shelter basics", "Interest — how savings grows", "Magnetic declination and true north", "Taping an ankle — basic wrap", "Poisonous look-alikes — know the difference", "Insulating a shelter for warmth", "What is a power outage plan?", "Tornado preparedness — shelter in place", "Preserving meat — jerky making", "Comparison shopping — unit prices", "Foraging walk — plants of my region"],
  "5th": ["CPR with AED awareness", "Emergency communication plan", "Basic electrical — how circuits work", "Growing a full vegetable garden", "Water storage and rotation schedule", "Hand tools mastery — saw level drill", "Reading bills and receipts", "Orienteering — trail navigation", "Foraging safety rules", "Vehicle parts intro — tires and oil", "AED — where to find them and how they work", "ICE contacts — in case of emergency", "Wiring a simple circuit with batteries", "Soil health — composting and amendments", "Water storage rotation — FIFO", "Using a hand saw safely", "Understanding a utility bill", "Orienteering with a topographic map", "Foraging — dandelion dock plantain", "Checking tire pressure and tread", "Calling 911 — what dispatchers need", "Two-way radio basics", "Series vs parallel circuits", "Square foot gardening method", "Water from dew and transpiration bags", "Using a power drill safely", "Grocery budgeting — meal planning", "Night navigation — stars and landmarks", "Wild berries — safe vs toxic", "Checking oil and coolant levels", "Wound irrigation and bandaging", "What is a mutual aid network?", "Lightning safety — 30-30 rule", "Season extension — cold frames and row covers", "Reading an Explanation of Benefits — medical bill", "What is a bug-out bag?"],
  "6th": ["Advanced first aid — fractures and splints", "Family emergency protocols", "Home electrical safety", "Seed saving and heirloom seeds", "Solar water purification", "Plumbing basics — shut-off valve", "Creating a monthly budget", "Topographic maps and contour lines", "Wild edibles identification", "Changing a tire — step by step", "Splinting a broken arm", "Evacuation routes — plan A and B", "GFCI outlets — what they do", "Saving seeds from tomatoes peppers squash", "Solar still — making one in the field", "Fixing a leaky faucet washer", "Budget categories — fixed vs variable", "Reading elevation on a topo map", "Preparing wild greens — cooking safely", "Flat tire change — lug wrench torque sequence", "Treating hypothermia basics", "72-hour family communication plan", "Running new wire safely — conduit basics", "Starting a seed library", "Improvised water collection systems", "Unclogging a drain", "Emergency fund — why 3 months expenses", "Map and compass course — azimuth bearings", "Acorns — processing tannins to eat", "Jump-starting a car safely", "Head wound care — pressure and monitoring", "What is shelter-in-place?", "Heat exhaustion vs heat stroke — treatment", "Fall garden — what to plant in August", "Greywater recycling basics", "Understanding a paycheck stub"],
  "7th": ["Wound care and infection prevention", "Community disaster preparedness", "Generator safety and operation", "Preserving food — fermentation basics", "Rainwater collection system", "Home weatherproofing", "Debt vs savings — interest explained", "GPS vs map navigation", "Building a fire safely — fire triangle", "Basic car maintenance schedule", "Suture strips and wound closure", "CERT — Community Emergency Response Team intro", "Generator load calculation", "Lacto-fermented vegetables", "Rain barrel setup and first flush diverter", "Weatherstripping doors and windows", "Credit scores — what they are", "Calibrating a GPS device", "Fire lay types — teepee log cabin star", "Oil change — steps and why it matters", "Infection signs — when to seek help", "Disaster roles in the community", "Propane safety and storage", "Making kombucha from scratch", "Greywater filtration for garden use", "Insulating pipes for winter", "Credit cards — when they help and when they hurt", "Dead reckoning navigation — no GPS", "Wet and dry fire starting methods", "Rotating car tires — when and why", "Pressure points for bleeding control", "Mass casualty — triage basics", "Hurricane preparedness — category differences", "Curing and smoking meat", "Off-grid solar — basic panel setup", "What is a mechanic's lien — knowing your rights"],
  "8th": ["Advanced CPR — adult child infant", "Neighborhood emergency network", "Solar and wind energy basics", "Full meal planning from pantry", "Water well basics and maintenance", "Basic carpentry project — shelf or box", "Income and taxes intro", "Land navigation — no GPS azimuth walking", "Foraging walk — neighborhood plants", "Emergency communication frequencies", "CPR with two rescuers", "Mapping neighborhood resources — water food shelter", "Sizing a solar system for a home", "One-week pantry meal plan — no grocery store", "Hand pump well basics", "Reading a level and plumb line", "W-2 vs 1099 — employee vs contractor", "Declination-adjusted compass work", "Identifying invasive edibles in your area", "Ham radio — Technician license overview", "Pediatric CPR differences", "NIMS — National Incident Management intro", "Wind turbine basics — DIY small scale", "Calculating caloric needs for your family", "Water table — wells and aquifers", "Building a raised garden bed", "Filing a simple tax return — 1040EZ", "Pace count for distance measurement", "Medicinal herbs — echinacea elderberry yarrow", "FRS vs GMRS vs Ham radio differences", "Traction splint — when and how", "Community resilience — what makes neighborhoods survive?", "Wildfire preparedness — defensible space", "Fermented beverages — water kefir", "Electrical panel safety — breakers and fuses", "Negotiating a price — practical economics"],
  "9th": ["Wilderness first aid — patient assessment", "Community emergency response leadership", "Off-grid energy systems — design basics", "Fermentation — kombucha sourdough kefir", "Water rights and storage laws", "Electrical wiring safety — NEC basics", "Personal finance plan — income minus expenses", "Celestial navigation — Polaris and the Southern Cross", "Medicinal herbs and first aid plants", "Vehicle emergency kit build", "STOP mnemonic — stop think observe plan", "ICS — Incident Command System structure", "Battery bank sizing and wiring", "Lacto-fermentation of grains — sourdough", "State water law — riparian vs prior appropriation", "Rough-in wiring — outlet installation", "Net worth — assets minus liabilities", "Sun compass — shadow tip method", "Poultice and infusion preparation", "Roadside emergency — what to carry and use", "Trauma assessment — head to toe", "Leading a community drill", "Wind and solar hybrid system design", "Traditional food preservation — smoke salt sugar", "Rainwater harvesting legality by state", "Wiring a light switch", "Investment accounts — Roth IRA basics", "Lunar navigation — moon phases and position", "Herbal tincture making", "Changing brake pads safely", "Improvised tourniquets — when to use them", "Psychological first aid — helping survivors", "Drought preparedness — water conservation strategies", "Pressure canning low-acid foods safely", "Solar panel wiring — series and parallel", "Teaching financial literacy to others"],
  "10th": ["Stop the bleed — tourniquet application", "CERT training and certification", "Solar panel installation — roof mount basics", "Seed bank creation and storage", "Advanced water systems — whole house filtration", "Structural basics — load-bearing walls", "Investing basics — index funds and compound interest", "Full backcountry navigation — multi-day route", "Wild plant medicine — field guide use", "Full vehicle safety check", "Hemostatic agents — QuikClot and Combat Gauze", "CERT skills review — triage treatment transport", "Conduit wiring for outdoor panels", "Seed viability testing and storage conditions", "Whole house water filtration installation", "Reading blueprints and building plans", "Dollar-cost averaging — what it means", "Wilderness route planning — waypoints and bail-outs", "Preparing wild plants — drying tinctures salves", "Brake fluid power steering and coolant checks", "Chest seals — open vs closed wounds", "Community shelter setup and management", "Off-grid refrigeration — propane and DC", "Fermenting dairy — yogurt kefir cheese", "Grey and blackwater systems — off-grid design", "Framing a wall — plates studs headers", "Tax-advantaged accounts — 401k HSA", "Multi-day wilderness navigation without technology", "Essential oils — distillation and use", "Pre-trip vehicle inspection — full checklist", "Needle decompression awareness — tension pneumothorax", "Amateur radio emergency service — ARES", "Passive solar home design principles", "Heritage grain growing and milling", "Real estate basics — renting vs buying", "Insurance — types you need and why"],
  "11th": ["Wilderness medicine principles — improvised care", "Community leadership in crisis — command and control", "Renewable energy project — design and install", "Year-round food supply planning", "Water systems engineering — off-grid design", "Home repair project — plan and execute", "Financial independence roadmap — FIRE basics", "Teaching navigation to others", "Herbalism and natural remedies — materia medica", "Emergency preparedness presentation to community", "Improvised medical equipment in the field", "After-action review — what went well what did not", "Microhydro and biogas energy overview", "Caloric and nutritional year-round food audit", "Designing a rainwater to tap system", "Electrical inspection — what inspectors look for", "Building a 10-year financial plan", "Teaching map and compass to a group", "Growing and drying a medicinal herb garden", "Presenting your family emergency plan", "Improvised surgery — wound closure field conditions", "Organizing a neighborhood preparedness group", "Living off renewable energy for one week", "Preserving an entire harvest — all methods", "Water catchment to storage to use — full system", "Plumbing a bathroom — rough-in to finish", "Passive income — rentals dividends businesses", "Land navigation teaching practicum", "Herbal first aid kit — build and document", "Community resilience audit — gaps and solutions", "Obstetric emergencies — field delivery awareness", "Logistics and supply chain in disasters", "Net-zero home design principles", "Seed-to-table meal — 100% homegrown", "Estate planning basics — wills and trusts", "Teaching personal finance to a younger student"],
  "12th": ["Teaching first aid to others — become a trainer", "Building a neighborhood emergency network", "Off-grid living plan — full design", "Full family food supply audit — one year", "Water independence plan — full system", "Full home maintenance audit and plan", "Complete personal finance plan — net worth to retirement", "Survival skills teaching practicum", "Foraging and permaculture design", "Emergency preparedness capstone project", "Stop the bleed instructor certification prep", "Community emergency plan — write and present", "Off-grid budget — cost of energy independence", "Caloric storage for one year — family of four", "Well drilling basics — shallow vs deep", "Home systems audit — HVAC plumbing electrical", "Budgeting for life after high school", "Teaching a land navigation course", "Designing a food forest", "Presenting your capstone to the community", "First aid curriculum design — create a lesson", "Mutual aid organization — legal structure", "Renewable energy ROI calculation", "Commercial-scale food preservation methods", "Water catchment system build — final project", "Apprentice home repair — work alongside a tradesperson", "Negotiating salary and benefits", "Wilderness survival course design", "Ethnobotany — local plant knowledge documentation", "Capstone: full community preparedness guide", "Mass casualty simulation — lead the response", "Disaster mental health — long-term recovery", "Passive house certification overview", "Farm-to-table supply chain — design your own", "Financial independence milestone check — are you on track?", "Legacy project — what did you build this year?"],
};

function getLRYearStart() {
  const now = new Date();
  const aug1ThisYear = new Date(now.getFullYear(), 7, 1);
  // If we are before Aug 1 this year, school year started Aug 1 last year
  return now >= aug1ThisYear
    ? aug1ThisYear
    : new Date(now.getFullYear() - 1, 7, 1);
}

function getLRSchoolWeek() {
  const now = new Date();
  const yearStart = getLRYearStart();
  return Math.floor((now - yearStart) / (7*24*60*60*1000));
}

function getLRTopicForWeek(grade, offset=0) {
  const topics = LR_WEEKLY_TOPICS[grade] || LR_WEEKLY_TOPICS["5th"];
  const schoolWeek = getLRSchoolWeek();
  const idx = (schoolWeek + offset) % topics.length;
  return topics[Math.max(0, idx)];
}

function getLRWeekNumber(grade) {
  const topics = LR_WEEKLY_TOPICS[grade] || LR_WEEKLY_TOPICS["5th"];
  const schoolWeek = getLRSchoolWeek();
  return (schoolWeek % topics.length) + 1;
}

function getLRUpcomingTopics(grade, count=4) {
  const topics = LR_WEEKLY_TOPICS[grade] || LR_WEEKLY_TOPICS["5th"];
  const schoolWeek = getLRSchoolWeek();
  return Array.from({length:count}, (_,i) => ({
    weekOffset: i,
    topic: topics[(schoolWeek + i) % topics.length],
    weekNum: ((schoolWeek + i) % topics.length) + 1,
  }));
}

const SCHOOL_DAYS_OPTIONS = ["Monday-Friday","Monday-Thursday","Tuesday-Friday","Mon/Wed/Fri","Tue/Thu"];
const BREAK_STYLES = ["Short breaks every hour","Long lunch break","Flexible - varies daily","No set breaks"];
const GOALS = [
  // Aspirational outcomes — WHY you school, not WHAT you teach
  {id:"faith",       label:"Faith & Character",    icon:"✞"},
  {id:"reading",     label:"Strong Readers",        icon:"📖"},
  {id:"college",     label:"College Prep",          icon:"🎓"},
  {id:"critical",    label:"Critical Thinking",     icon:"🧠"},
  {id:"worldview",   label:"Biblical Worldview",    icon:"🌍"},
  {id:"life",        label:"Life Skills",           icon:"🏠"},
  {id:"independence",label:"Independence",          icon:"🦅"},
  {id:"social",      label:"Social & Community",    icon:"🤝"},
  {id:"service",     label:"Service & Giving",      icon:"🤎"},
  {id:"entrepreneur",label:"Entrepreneurship",      icon:"💼"},
  {id:"nature",      label:"Love of Nature",        icon:"🌿"},
  {id:"sports",      label:"Active & Healthy",      icon:"🏃"},
  {id:"travel",      label:"Travel & Culture",      icon:"🗺"},
  {id:"homestead",   label:"Homesteading",          icon:"🌻"},
];

const COOP_FREQ = ["We don't do co-op","Once a week","Every other week","Once a month","Seasonally"];
const EXTRACURRICULARS = ["Sports","Music lessons","Dance","Art classes","Scouting","4-H","Theater","Martial Arts","Drama / Theater","Chess Club","Coding Club","Robotics","Debate","Swim Team","Gymnastics","None right now"];
const AVATARS = ["🌻","🌿","🌺","🦋","🌙","*","🐝","🦊","🐢","🌈","🍀","🦜"];
const GRADES  = ["Pre-K","K","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C."];

/* --- SECTION DEFINITIONS --- */
const ALL_SECTIONS = [
  {id:"home",       label:"Home",       icon:"🏡", locked:true },
  {id:"schedule",   label:"Schedule",   icon:"📅", locked:true },
  {id:"portfolio",  label:"Portfolio",  icon:"🗂", locked:true },
  {id:"learn",      label:"Learn",      icon:"📚", locked:false},
  {id:"preparedcapable", label:"P&C",   icon:"🛡", locked:false},
  {id:"attendance", label:"Attendance", icon:"📋", locked:false},
  {id:"coop",       label:"Co-op",      icon:"🏫", locked:false},
  {id:"transcripts",label:"Records",    icon:"🎓", locked:false},
  {id:"goals",      label:"Goals",      icon:"🌟", locked:false},
  {id:"more",       label:"More",       icon:"...",  locked:false},
];

const greet = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };
const today = () => new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
const h12   = t => { const [h,m]=t.split(":"); const hh=+h; return `${hh>12?hh-12:hh||12}:${m}${hh>=12?"pm":"am"}`; };
const uid   = () => Math.random().toString(36).slice(2,8);

/* =========================== ROOT =========================== */
const LS_KEY = "rootbloom_v1";
function loadSaved() {
  try { const s=localStorage.getItem(LS_KEY); return s?JSON.parse(s):null; } catch(e){return null;}
}
function savePersist(obj) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch(e){}
}

function RootAndBloom() {
  const saved = useMemo(()=>loadSaved(),[]);
  const [family,         setFamily]         = useState(saved?.family||null);
  const [view,           setView]           = useState("splash");
  const [activeTab,      setActiveTab]      = useState("home");
  const [navIds,         setNavIds]         = useState(saved?.navIds||["home","schedule","portfolio","more"]);
  const [childFilt,      setChildFilt]      = useState("all");
  const [lastCheckinDate,setLastCheckinDate]= useState(saved?.lastCheckinDate||null);
  const [checkinStreak,  setCheckinStreak]  = useState(saved?.checkinStreak||0);
  const [checkinDates,   setCheckinDates]   = useState(saved?.checkinDates||{}); // {childId: dateString}
  const [studentVisits,  setStudentVisits]  = useState(saved?.studentVisits||{}); // {childId: dateString}
  const [showTheme,      setShowTheme]      = useState(false);
  const [showNav,        setShowNav]        = useState(false);
  const [showSwitcher,   setShowSwitcher]   = useState(false);
  const [learnTab,       setLearnTab]       = useState("curriculum");
  const [activeStudent,  setActiveStudent]  = useState(null);
  const [portfolioEntries,setPortfolioEntries]=useState(saved?.portfolio||[]);
  const [coopLog, setCoopLog] = useState(saved?.coopLog||[]);
  const [attendanceDays,    setAttendanceDays]    = useState(saved?.attendanceDays||0);
  const [attendanceLog,     setAttendanceLog]     = useState(saved?.attendanceLog||[]);
  const [observationLog,    setObservationLog]    = useState(saved?.observationLog||[]);

  // Compute pending schedule days — days this week that are fully checked off
  // but not yet in the attendance log
  const pendingSchedDays = useMemo(()=>{
    try {
      const schedRaw = localStorage.getItem("rootbloom_sched_v1");
      if(!schedRaw) return 0;
      const sched = JSON.parse(schedRaw);
      const checked = sched.checked||{};
      const skipped = sched.skipped||{};

      // Build this week's days (Mon–Fri)
      const today = new Date();
      const dow = today.getDay();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate()-(dow===0?6:dow-1));
      const weekDays = [0,1,2,3,4].map(i=>{
        const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);
        return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
      });

      // For each past day (not today), check if all blocks were checked
      const loggedDates = new Set((saved?.attendanceLog||[]).map(e=>e.date));
      let pending = 0;
      const allBlocks = family ? generateSchedule(family, family.scheduleMode2!=="same"?family.children?.[0]?.id:null) : [];
      if(allBlocks.length===0) return 0;

      weekDays.forEach((dateStr, di)=>{
        // Only count past days (not today, not future)
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate()+di);
        if(dayDate >= today) return; // skip today and future
        if(loggedDates.has(dateStr)) return; // already in attendance log

        const daySkipped = skipped[di]||{};
        const activeBlocks = allBlocks.filter((_,bi)=>!daySkipped[bi]);
        if(activeBlocks.length===0) return;

        const allChecked = activeBlocks.every((_,bi)=>!!checked[di+"_"+bi]);
        if(allChecked) pending++;
      });
      return pending;
    } catch(e){ return 0; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[attendanceLog, attendanceDays]);
  const [showSchedConfirm,  setShowSchedConfirm]  = useState(false);
  const [showCatchup,       setShowCatchup]       = useState(false);
  const [showAIChat,        setShowAIChat]        = useState(false);
  const [showQuickCapture,  setShowQuickCapture]  = useState(false);
  const [showDaySummary,    setShowDaySummary]    = useState(false);
  const [showLifeReady,     setShowLifeReady]     = useState(false);
  const [showEOY,           setShowEOY]           = useState(false);
  const [eoyChild,          setEoyChild]          = useState(0);
  const [eoyDismissed,      setEoyDismissed]      = useState(saved?.eoyDismissed||null);
  const [showNewYear,       setShowNewYear]        = useState(false);
  const [newYearDismissed,  setNewYearDismissed]   = useState(saved?.newYearDismissed||null);
  const [daySummaryData,    setDaySummaryData]    = useState(null);
  const [showJournal,       setShowJournal]       = useState(null); // childId or null
  const [todayProgress,     setTodayProgress]     = useState(saved?.todayProgress||{count:0,total:0,date:""});
  const [paletteId, setPaletteId] = useState(saved?.paletteId||"sage");
  const [customA,   setCustomA]   = useState(saved?.customA||"#2a4a28");
  const [customB,   setCustomB]   = useState(saved?.customB||"#a8c890");

  // Auto-save whenever key state changes
  useEffect(()=>{
    savePersist({family,navIds,portfolio:portfolioEntries,coopLog,attendanceDays,attendanceLog,observationLog,checkinDates,studentVisits,paletteId,customA,customB,lastCheckinDate,checkinStreak,todayProgress,eoyDismissed,newYearDismissed});
  },[family,navIds,portfolioEntries,coopLog,attendanceDays,attendanceLog,observationLog,checkinDates,studentVisits,paletteId,customA,customB,lastCheckinDate,checkinStreak,todayProgress,eoyDismissed,newYearDismissed]);

  // Auto-show New Year prompt when yearEnd has passed
  useEffect(()=>{
    if(!family?.yearEnd) return;
    const end = new Date(family.yearEnd);
    const now = new Date();
    const daysPast = Math.floor((now - end) / (24*60*60*1000));
    if(daysPast < 1) return; // year hasn't ended yet
    const dismissKey = "newyear_"+family.yearEnd;
    if(newYearDismissed===dismissKey) return;
    const t = setTimeout(()=>setShowNewYear(true), 2200);
    return ()=>clearTimeout(t);
  },[family?.yearEnd, newYearDismissed]);

  // Auto-show EOY checklist when within 3 weeks of year end OR year has passed
  useEffect(()=>{
    if(!family?.yearEnd) return;
    const weeksLeft = getEOYWeeksLeft(family);
    if(weeksLeft===null||weeksLeft>3) return;
    const dismissKey = family.yearEnd;
    if(eoyDismissed===dismissKey) return;
    const t = setTimeout(()=>setShowEOY(true), 1800);
    return ()=>clearTimeout(t);
  },[family?.yearEnd, eoyDismissed]);

  const pal = useMemo(() => {
    const p = PRESET_PALETTES.find(p=>p.id===paletteId)||PRESET_PALETTES[0];
    return buildTheme(p.isCustom?customA:p.a, p.isCustom?customB:p.b);
  }, [paletteId,customA,customB]);

  const navTabs = ALL_SECTIONS.filter(s=>navIds.includes(s.id));

  // Listen for in-app navigation events (e.g. from DaySummaryModal "View in Portfolio")
  useEffect(()=>{
    const handler = (e) => { setActiveTab(e.detail); };
    window.addEventListener("rootbloom-nav", handler);
    return ()=>window.removeEventListener("rootbloom-nav", handler);
  },[]);

  const handleSplash     = () => setView(family?"parent":"onboarding");
  const handleGradeUp = (childIdx, newGrade) => {
    setFamily(f => {
      const updated = {...f, children: f.children.map((c,i) =>
        i===childIdx ? {...c, grade:newGrade} : c
      )};
      return updated;
    });
    setShowEOY(false);
    setEoyDismissed(family.yearEnd);
  };
  const handleNewYear = (newData) => {
    // newData: {yearStart, yearEnd, subjects, children (with updated grades)}
    setFamily(f=>({...f,...newData}));
    setAttendanceDays(0);
    setAttendanceLog([]);
    setCheckinStreak(0);
    setLastCheckinDate(null);
    setCheckinDates({});
    setNewYearDismissed("newyear_"+family.yearEnd);
    setShowNewYear(false);
  };
  const handleCheckinSave = (entries) => {
    entries.forEach(e => addPortfolioEntry(e));
    // increment attendance
    const todayStr = new Date().toDateString();
    setAttendanceDays(d => d + (lastCheckinDate===todayStr ? 0 : 1));
    // update streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toDateString();
    if (lastCheckinDate === yStr) setCheckinStreak(s=>s+1);
    else if (lastCheckinDate !== todayStr) setCheckinStreak(1);
    setLastCheckinDate(todayStr);
  };

  // Per-child checkin — marks that specific child as logged today
  const handleChildCheckin = (childId) => {
    const todayStr = new Date().toDateString();
    setCheckinDates(d=>({...d,[childId]:todayStr}));
    // Also update family-level attendance/streak (once per day regardless of child)
    setAttendanceDays(d=>d+(lastCheckinDate===todayStr?0:1));
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    if(lastCheckinDate===yesterday.toDateString()) setCheckinStreak(s=>s+1);
    else if(lastCheckinDate!==todayStr) setCheckinStreak(1);
    setLastCheckinDate(todayStr);
  };
  const mainScrollRef = React.useRef(null);
  React.useEffect(()=>{
    if(mainScrollRef.current) mainScrollRef.current.scrollTop=0;
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  },[activeTab]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebData,       setCelebData]       = useState(null);
  const finishOnboarding = (data) => {
    setFamily(data);
    setPaletteId(data.paletteId||"sage");
    setCelebData(data);
    setShowCelebration(true);
  };
  const [showTour,       setShowTour]       = useState(false);
  const enterApp = () => { setShowCelebration(false); setShowTour(true); };
  const finishTour = () => { setShowTour(false); setView("parent"); };
  const openSettings     = () => setView("settings");
  const closeSettings    = () => setView("parent");
  const switchToStudent  = (child) => {
    setActiveStudent(child);
    setShowSwitcher(false);
    setView("student");
    const todayStr3 = new Date().toDateString();
    setStudentVisits(v=>({...v,[child.id]:todayStr3}));
  };
  const backToParent     = () => { setActiveStudent(null); setView("parent"); };
  const addPortfolioEntry  = (e) => setPortfolioEntries(p=>{
    const newEntry = {id:uid(),...e};
    // Dedup: remove existing same child+subj+date non-day entry before adding
    const filtered = (e.subj && e.date && !e.isDay)
      ? p.filter(x=>!(x.childIdx===e.childIdx && x.subj===e.subj && x.date===e.date && !x.isDay))
      : p;
    return [newEntry,...filtered];
  });
  const editPortfolioEntry = (id,updated) => setPortfolioEntries(p=>p.map(e=>e.id===id?{...e,...updated}:e));

  // Today is co-op day if it's a Friday (demo) or already logged
  const isCoop = (() => {
    if (!family) return false;
    const freq = family.coopFreq || "";
    if (freq === "We don't do co-op" || freq === "") return false;
    const day = new Date().getDay();
    return day === 5; // Friday - still use Friday as co-op day trigger
  })();

  return (
    <div style={{
      maxWidth:"430px",margin:"0 auto",height:"100vh",
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

      {/* -- SPLASH -- */}
      {view==="splash"     && <SplashScreen   pal={pal} onContinue={handleSplash} />}
      {view==="onboarding" && <OnboardingFlow pal={pal} onComplete={finishOnboarding} />}
      {view==="settings"   && <SettingsScreen pal={pal} family={family} setFamily={setFamily}
          paletteId={paletteId} setPaletteId={setPaletteId}
          customA={customA} customB={customB} setCustomA={setCustomA} setCustomB={setCustomB}
          navIds={navIds} setNavIds={setNavIds} onBack={closeSettings} />}

      {/* -- STUDENT PORTAL -- */}
      {view==="student" && activeStudent && family && (
        <StudentPortal
          child={activeStudent}
          family={family}
          pal={pal}
          isCoop={isCoop}
          entries={portfolioEntries.filter((_,i)=> family.children.findIndex(c=>c.id===activeStudent.id) === portfolioEntries.find(e=>e.id===_.id)?.childIdx)}
          allEntries={portfolioEntries}
          onAddEntry={addPortfolioEntry}
          checkinStreak={checkinStreak}
          checkinDates={checkinDates}
          onCoopLog={e=>setCoopLog(l=>[{...e,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})},...l])}
          onBack={backToParent}
        />
      )}

      {/* -- PARENT APP -- */}
      {view==="parent" && family && (<>
        {/* Status bar */}
        <div style={{background:pal.deep,height:"44px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.1rem",flexShrink:0,zIndex:10}}>
          <button onClick={()=>setShowSwitcher(true)} style={{background:"rgba(255,255,255,0.13)",border:"none",borderRadius:"8px",padding:"0.18rem 0.6rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem"}}>
            <span style={{fontSize:"0.75rem"}}>👤</span>
            <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.7)",fontWeight:"700"}}>Switch</span>
          </button>
          <button onClick={()=>setShowTheme(true)} style={{display:"flex",alignItems:"center",gap:"0.4rem",background:"none",border:"none",cursor:"pointer",padding:0}}>
            <span style={{fontSize:"0.9rem"}}>🌱</span>
            <span style={{fontWeight:"800",color:"rgba(255,255,255,0.9)",fontSize:"0.85rem"}}>{"Root & Bloom"}</span>
          </button>
          <button onClick={openSettings} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:"7px",padding:"0.18rem 0.55rem",cursor:"pointer",fontSize:"0.75rem",color:"rgba(255,255,255,0.65)",fontWeight:"600"}}>{"⚙️"}</button>
        </div>

        {/* Main content */}
        <div ref={mainScrollRef} style={{flex:1,overflowY:"auto",paddingBottom:"72px"}}>
          {activeTab==="home" && <HomeScreen pal={pal} family={family} child={childFilt} setChild={setChildFilt} onTheme={()=>setShowTheme(true)} attendanceDays={attendanceDays} checkinStreak={checkinStreak} lastCheckinDate={lastCheckinDate} portfolioEntries={portfolioEntries} onTabChange={setActiveTab} todayProgress={todayProgress}
            attendanceLog={attendanceLog}
            onAddEntry={addPortfolioEntry}
            onCheckin={handleChildCheckin}
            checkinDates={checkinDates}
            observationLog={observationLog}
            onOpenJournal={(childId)=>setShowJournal(childId)}
            studentVisits={studentVisits}
          />}
          {activeTab==="schedule" && <ScheduleScreen pal={pal} family={family} child={childFilt} setChild={setChildFilt}
            lastCheckinDate={lastCheckinDate}
            onUpdateFamily={updates=>setFamily(f=>({...f,...updates}))}
            onMarkComplete={(data)=>{
              const todayStr=new Date().toDateString();
              setAttendanceDays(d=>d+(lastCheckinDate===todayStr?0:1));
              const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
              if(lastCheckinDate===yesterday.toDateString()) setCheckinStreak(s=>s+1);
              else if(lastCheckinDate!==todayStr) setCheckinStreak(1);
              setLastCheckinDate(todayStr);
              setDaySummaryData(data);
              setShowDaySummary(true);
            }}
            onProgressUpdate={(count,total)=>{
              const todayStr=new Date().toDateString();
              setTodayProgress({count,total,date:todayStr});
            }}
          />}
          {activeTab==="learn"       && <LearnScreen       pal={pal} family={family} child={childFilt} setChild={setChildFilt} learnTab={learnTab} setLearnTab={setLearnTab} portfolioEntries={portfolioEntries} />}
          {activeTab==="portfolio"   && <PortfolioScreen   pal={pal} family={family} child={childFilt} setChild={setChildFilt} entries={portfolioEntries} onAddEntry={addPortfolioEntry} onEditEntry={editPortfolioEntry} attendanceDays={attendanceDays}
            lastCheckinDate={lastCheckinDate}
            onCheckin={()=>handleChildCheckin(childFilt!=="all"?childFilt:family.children?.[0]?.id)}/>}
          {activeTab==="attendance"  && <AttendanceScreen  pal={pal} family={family} days={attendanceDays} attendanceLog={attendanceLog} portfolioEntries={portfolioEntries} coopLog={coopLog}
            onAddDay={(entry)=>{
              setAttendanceLog(l=>[entry,...l.filter(x=>x.date!==entry.date)]);
              if(!["Excused Absence","Unexcused Absence","Holiday"].includes(entry.type)){
                setAttendanceDays(d=>d+1);
              }
            }}
            onRemoveDay={(date)=>{
              const entry = attendanceLog.find(e=>e.date===date);
              setAttendanceLog(l=>l.filter(e=>e.date!==date));
              if(entry&&!["Excused Absence","Unexcused Absence","Holiday"].includes(entry.type)){
                setAttendanceDays(d=>Math.max(0,d-1));
              }
            }}
            onSyncPortfolio={()=>{
              // Find portfolio dates not already in attendanceLog
              const loggedDates = new Set(attendanceLog.map(e=>e.date));
              const portfolioDates = [...new Set(portfolioEntries.filter(e=>!e.isDay&&e.date).map(e=>e.date))];
              const newDates = portfolioDates.filter(d=>!loggedDates.has(d));
              if(newDates.length===0) return 0;
              const newEntries = newDates.map(d=>({date:d,type:"School Day",note:"Synced from portfolio",subjects:[...new Set(portfolioEntries.filter(e=>e.date===d&&!e.isDay).map(e=>e.subj))]}));
              setAttendanceLog(l=>[...newEntries,...l]);
              setAttendanceDays(d=>d+newDates.length);
              return newDates.length;
            }}
            pending={pendingSchedDays}
            onConfirmPull={()=>{
              // Add pending days to attendance log so they won't show as pending again
              const today = new Date();
              const dow = today.getDay();
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate()-(dow===0?6:dow-1));
              const newEntries = [];
              for(let di=0;di<5;di++){
                const d=new Date(weekStart);d.setDate(weekStart.getDate()+di);
                if(d>=today) continue;
                const dateStr=d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
                if(!attendanceLog.find(e=>e.date===dateStr)){
                  newEntries.push({date:dateStr,type:"School Day",note:"Added from schedule"});
                }
              }
              if(newEntries.length>0){
                setAttendanceLog(l=>[...newEntries,...l]);
                setAttendanceDays(d=>d+newEntries.length);
              }
              setShowSchedConfirm(false);
            }}
            onCatchup={()=>setShowCatchup(true)}
            onLogPastDay={(dateStr)=>{
              const parsed = new Date(dateStr);
              const label = parsed.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
              const dateShort = parsed.toLocaleDateString("en-US",{month:"short",day:"numeric"});
              setDaySummaryData({blocks:[],dateLabel:label,dateOverride:dateShort});
              setShowDaySummary(true);
            }} />}
          {activeTab==="goals"       && <GoalsScreen       pal={pal} family={family} portfolioEntries={portfolioEntries} onUpdateFamily={updates=>setFamily(f=>({...f,...updates}))} onAddEntry={addPortfolioEntry}/>}
          {activeTab==="coop"        && <CoopScreen        pal={pal} family={family} coopLog={coopLog} onLog={e=>setCoopLog(l=>[e,...l])} onUpdateFamily={updates=>setFamily(f=>({...f,...updates}))} onAddEntry={addPortfolioEntry} />}
          {activeTab==="transcripts" && <TranscriptsScreen pal={pal} family={family} portfolioEntries={portfolioEntries} attendanceDays={attendanceDays} coopLog={coopLog} observationLog={observationLog} />}
          {showLifeReady && family && <LifeReadyScreen pal={pal} family={family} onBack={()=>setShowLifeReady(false)}/>}
          {activeTab==="preparedcapable" && family?.lifeReady && <LifeReadyScreen pal={pal} family={family} onBack={()=>setActiveTab("home")}/>}
          {activeTab==="preparedcapable" && !family?.lifeReady && (
            <div style={{animation:"fadeUp 0.22s ease",padding:"2rem 1.2rem",textAlign:"center"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🛡</div>
              <div style={{fontWeight:"800",color:"#8b2500",fontSize:"1rem",marginBottom:"0.5rem"}}>Prepared & Capable</div>
              <div style={{fontSize:"0.84rem",color:"#666",lineHeight:1.7,marginBottom:"1.2rem"}}>{"You haven't opted into Prepared & Capable yet."}</div>
              <button onClick={()=>setActiveTab("more")} style={{padding:"0.65rem 1.5rem",border:"none",borderRadius:"12px",background:"linear-gradient(135deg,#8b2500,#e84c0a)",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>Set it up in More</button>
            </div>
          )}
          {!showLifeReady && activeTab==="more"        && <MoreScreen        pal={pal} family={family}
              onNav={id=>{ if(id==="settings") openSettings(); else setActiveTab(id); }}
              onTheme={()=>setShowTheme(true)} onNavEdit={()=>setShowNav(true)} onSettings={openSettings} onLifeReady={()=>setShowLifeReady(true)} />}
        </div>

        {/* Floating Quick Capture Button */}
        <button onClick={()=>setShowQuickCapture(true)} style={{position:"fixed",bottom:"80px",left:"calc(50% - 205px)",width:"52px",height:"52px",borderRadius:"50%",background:pal.heroGrad||pal.accentGrad,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",zIndex:49,boxShadow:`0 3px 14px ${pal.primary}55`,transition:"transform 0.15s"}}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
          onTouchStart={e=>e.currentTarget.style.transform="scale(0.9)"}
          onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
          {"✏️"}
        </button>

        {/* Floating AI Chat Button */}
        <button onClick={()=>setShowAIChat(true)} style={{position:"fixed",bottom:"80px",right:"calc(50% - 205px)",width:"52px",height:"52px",borderRadius:"50%",background:pal.accentGrad,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",zIndex:49,boxShadow:`0 3px 14px ${pal.primary}55`,transition:"transform 0.15s"}}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
          onTouchStart={e=>e.currentTarget.style.transform="scale(0.9)"}
          onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
          
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


      {showQuickCapture && <QuickCaptureModal pal={pal} family={family} activeChildId={childFilt}
          onClose={()=>setShowQuickCapture(false)}
          attendanceLog={attendanceLog}
          onAttendanceAdd={(entry)=>{
            setAttendanceLog(l=>[entry,...l.filter(x=>x.date!==entry.date)]);
            if(!["Excused Absence","Holiday"].includes(entry.type)) setAttendanceDays(d=>d+1);
          }}
          onSave={(entries)=>{
            entries.forEach(e=>addPortfolioEntry(e));
            setShowQuickCapture(false);
          }}/>}
        {showAIChat    && <AIChatModal     pal={pal} family={family} onClose={()=>setShowAIChat(false)} />}
        {showTheme    && <ThemeModal     pal={pal} paletteId={paletteId} setPaletteId={setPaletteId} customA={customA} customB={customB} setCustomA={setCustomA} setCustomB={setCustomB} onClose={()=>setShowTheme(false)} />}
        {showNav      && <NavModal       pal={pal} navIds={navIds} setNavIds={setNavIds} onClose={()=>setShowNav(false)} />}
        {showSwitcher && <ViewSwitcher   pal={pal} family={family} onParent={()=>setShowSwitcher(false)} onStudent={switchToStudent} />}
        {showSchedConfirm && <SchedConfirmModal pal={pal} family={family} days={pendingSchedDays} onConfirm={()=>{
          const today=new Date(); const dow=today.getDay(); const weekStart=new Date(today);
          weekStart.setDate(today.getDate()-(dow===0?6:dow-1));
          const newEntries=[];
          for(let di=0;di<5;di++){
            const d=new Date(weekStart);d.setDate(weekStart.getDate()+di);
            if(d>=today) continue;
            const dateStr=d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
            if(!attendanceLog.find(e=>e.date===dateStr)) newEntries.push({date:dateStr,type:"School Day",note:"Added from schedule"});
          }
          if(newEntries.length>0){setAttendanceLog(l=>[...newEntries,...l]);setAttendanceDays(d=>d+newEntries.length);}
          setShowSchedConfirm(false);
        }} onClose={()=>setShowSchedConfirm(false)} />}
        {showCatchup  && <CatchupModal   pal={pal} family={family} days={attendanceDays} needed={parseInt((getStateInfo(family.state||"").hours||"180").match(/\d+/)?.[0]||"180")} onClose={()=>setShowCatchup(false)} />}
        {showCelebration && celebData && <CelebrationModal pal={pal} data={celebData} onEnter={enterApp}/>}
        {showTour && <TourModal pal={pal} onDone={finishTour}/>}
        {showEOY && family && <EOYChecklistModal pal={pal} family={family} childIdx={eoyChild} setChildIdx={setEoyChild}
          weeksLeft={getEOYWeeksLeft(family)}
          portfolioEntries={portfolioEntries}
          attendanceDays={attendanceDays}
          onClose={()=>{setShowEOY(false);setEoyDismissed(family.yearEnd);}}
          onGradeUp={handleGradeUp} />}
        {showNewYear && family && <NewYearModal pal={pal} family={family}
          onStart={handleNewYear}
          onDismiss={()=>{setNewYearDismissed("newyear_"+family.yearEnd);setShowNewYear(false);}}/>}
        {showDaySummary && daySummaryData && <DaySummaryModal pal={pal} family={family} data={daySummaryData} portfolioEntries={portfolioEntries} dateOverride={daySummaryData.dateOverride||null}
          onCoopLog={e=>setCoopLog(l=>[{...e},...l])}
          onSave={(entries)=>{
            setPortfolioEntries(prev=>{
              let updated = [...prev];
              entries.forEach(e=>{
                const newEntry = {id:uid(),...e};
                // Dedup: remove existing same child+subj+date non-day entry before adding
                if(e.subj && e.date && !e.isDay){
                  updated = updated.filter(x=>!(x.childIdx===e.childIdx && x.subj===e.subj && x.date===e.date && !x.isDay));
                }
                updated = [newEntry, ...updated];
              });
              return updated;
            });
          }}
          onClose={()=>{setShowDaySummary(false);setActiveTab("home");}}
          onFinish={(goTo)=>{setShowDaySummary(false);setActiveTab(goTo||"home");}} />}
        {showJournal!==null && family && (
          <ObservationJournalModal
            pal={pal} family={family} childId={showJournal}
            entries={observationLog}
            onAdd={(entry)=>setObservationLog(l=>[entry,...l])}
            onDelete={(id)=>setObservationLog(l=>l.filter(e=>e.id!==id))}
            onClose={()=>setShowJournal(null)}
          />
        )}
      </>)}
    </div>
  );
}


/* =======================================
   SPLASH SCREEN
======================================= */
function SplashScreen({ pal, onContinue }) {
  const [ready, setReady] = useState(false);
  useState(()=>{ setTimeout(()=>setReady(true), 300); },[]);
  return (
    <div onClick={onContinue} style={{height:"100vh",background:pal.heroGrad,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:"300px",height:"300px",borderRadius:"50%",background:"rgba(255,255,255,0.04)",top:"-60px",right:"-60px"}}/>
      <div style={{position:"absolute",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(255,255,255,0.03)",bottom:"40px",left:"-40px"}}/>
      <div style={{textAlign:"center",position:"relative",animation:"fadeIn 0.6s ease"}}>
        <div style={{fontSize:"5rem",marginBottom:"1rem",animation:"grow 0.6s ease 0.2s both"}}>🌱</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.4rem",fontWeight:"800",color:"#fff",margin:"0 0 0.3rem",lineHeight:1.1}}>Root {"&"}</h1>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.4rem",fontWeight:"800",margin:"0 0 0.6rem",lineHeight:1.1,background:pal.shimmer,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"}}>Bloom</h1>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.88rem",margin:"0 0 2.5rem",letterSpacing:"0.04em"}}>Your homeschool, beautifully organized</p>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",justifyContent:"center",animation:"pulse 2s ease infinite"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
          <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.75rem",letterSpacing:"0.08em"}}>tap to begin</span>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
        </div>
        <button onClick={e=>{e.stopPropagation();if(window.confirm("Clear all data and start over?")){localStorage.removeItem("rootbloom_v1");window.location.reload();}}} style={{marginTop:"2rem",background:"transparent",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"20px",padding:"0.3rem 0.9rem",color:"rgba(255,255,255,0.35)",fontSize:"0.65rem",cursor:"pointer",letterSpacing:"0.05em"}}>
          Reset app
        </button>
      </div>
    </div>
  );
}

/* =======================================
   VIEW SWITCHER - parent taps "Switch" in status bar
======================================= */
function ViewSwitcher({ pal, family, onParent, onStudent }) {
  const CHILD_COLORS = ["#e8943a","#4aabcf","#9b6fc8","#44aa66","#e85a7a"];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.72)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",padding:"0 0 1.5rem",animation:"slideUp 0.26s ease",fontFamily:"'Palatino Linotype','Palatino',Georgia,serif"}}>
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center"}}><div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/></div>
        <div style={{padding:"0.75rem 1.3rem 1.1rem",borderBottom:`1px solid ${pal.stone}45`}}>
          <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>👤 Switch View</div>
          <div style={{fontSize:"0.74rem",color:pal.slate,marginTop:"2px"}}>Who is using the app right now?</div>
        </div>
        <div style={{padding:"1rem 1.3rem 0",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {/* Parent */}
          <button onClick={onParent} style={{padding:"0.9rem 1rem",borderRadius:"16px",border:`2px solid ${pal.primary}25`,background:pal.pale,cursor:"pointer",display:"flex",alignItems:"center",gap:"0.85rem",textAlign:"left"}}>
            <div style={{width:"46px",height:"46px",borderRadius:"13px",background:pal.heroGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>👩</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.92rem"}}>{family.parentName||"Parent"}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>Full dashboard - planning - settings</div>
            </div>
            <span style={{color:pal.primary,fontSize:"1.1rem"}}>></span>
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
                  <div style={{fontSize:"0.7rem",color:"#8a7060",marginTop:"1px"}}>{c.grade} - Student view</div>
                </div>
                <span style={{fontSize:"1.1rem",color:cc}}>></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* --- Student palette constants --- */
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
const CHILD_COLOR_PALETTES = [
  {id:"sunshine", name:"Sunshine",  c1:"#f5c842", c2:"#e8943a"},
  {id:"ocean",    name:"Ocean",     c1:"#4aabcf", c2:"#5ab850"},
  {id:"berry",    name:"Berry",     c1:"#9b6fc8", c2:"#e85a7a"},
  {id:"meadow",   name:"Meadow",    c1:"#5ab850", c2:"#4aabcf"},
  {id:"rose",     name:"Rose",      c1:"#e85a7a", c2:"#9b6fc8"},
  {id:"sky",      name:"Sky",       c1:"#38b6e8", c2:"#a8d8f0"},
  {id:"forest",   name:"Forest",    c1:"#3a8c4a", c2:"#8ed19a"},
  {id:"sunset",   name:"Sunset",    c1:"#e86438", c2:"#f5a442"},
  {id:"redblack", name:"Bold",      c1:"#cc1a1a", c2:"#2a2a2a"},
  {id:"midnight", name:"Midnight",  c1:"#1a1a3a", c2:"#4a4aaa"},
];

/* =======================================
   STUDENT PORTAL - its own complete world
======================================= */
function StudentPortal({ child, family, pal, isCoop, allEntries, onAddEntry, onCoopLog, onBack, checkinStreak=0, checkinDates={} }) {
  const [sTab,         setSTab]         = useState("home");
  const [noteText,     setNoteText]     = useState("");
  const [noteSaved,    setNoteSaved]    = useState(false);
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

  const childIdx  = family.children.findIndex(c=>c.id===child.id);
  const myEntries = allEntries.filter(e=>e.childIdx===childIdx);
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

  const SCHEDULE = generateSchedule(family);
  const familyGoalObjs = [...GOALS,...(family.customGoals||[])].filter(g=>(family.goals||[]).includes(g.id));
  const todayDateStr2 = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

  const checkSubject = (bi, b) => {
    if(checked[bi]) return;
    const next = {...checked,[bi]:true};
    setChecked(next);
    saveChecked(next);
    const isRead = b.s.toLowerCase().includes("read");
    if(isRead) {
      setReadingTitle2("");
      setReadingPrompt({blockIdx:bi, subjLabel:b.s, subjIcon:b.i||"📖"});
    } else {
      onAddEntry&&onAddEntry({
        childIdx, subj:b.s, title:b.s+"\u2014"+todayDateStr2,
        note:"", thumb:b.i||"📋", date:todayDateStr2,
        isSubject:true, lessonCount:1, selfLogged:true,
      });
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

  const hasGoals = familyGoalObjs.length>0;
  const STABS = [
    {id:"home",icon:"🏠",l:"Home"},
    {id:"today",icon:"📅",l:"Today"},
    {id:"mywork",icon:"⭐",l:"My Work"},
    ...(hasGoals?[{id:"goals",icon:"🎯",l:"Goals"}]:[]),
    {id:"streak",icon:"🔥",l:"Streak"},
  ];

  return (
    <div style={{minHeight:"100vh",background:SK.cream,fontFamily:"'Comic Sans MS','Chalkboard SE',cursive",display:"flex",flexDirection:"column"}}>
      {/* Kid status bar */}
      <div style={{background:heroGrad,padding:"0.65rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:"9px",padding:"0.22rem 0.6rem",cursor:"pointer",color:"#fff",fontWeight:"800",fontSize:"0.7rem"}}>Back</button>
        <div style={{display:"flex",alignItems:"center",gap:"0.42rem"}}>
          <span style={{fontSize:"1.1rem"}}>{child.avatar}</span>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"0.88rem"}}>{child.name}{"'s Space"}</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.22)",borderRadius:"9px",padding:"0.2rem 0.55rem",display:"flex",alignItems:"center",gap:"0.3rem"}}>
          <span style={{fontSize:"0.85rem"}}>{"⭐"}</span>
          <span style={{fontWeight:"800",color:"#fff",fontSize:"0.78rem"}}>{realPoints}</span>
        </div>
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
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.72)",marginTop:"0.25rem"}}>Ready to learn something awesome?</div>
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

              {/* Today peek */}
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.92rem",marginBottom:"0.6rem"}}>{"📅 Today\u2019s Plan"}</div>
              {SCHEDULE.slice(0,4).map((b,i)=>(
                <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.65rem 0.9rem",display:"flex",gap:"0.65rem",alignItems:"center",marginBottom:"0.42rem",boxShadow:"0 1px 7px rgba(0,0,0,0.05)"}}>
                  <div style={{width:"34px",height:"34px",borderRadius:"9px",background:SK.skyL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{b.i}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem"}}>{b.s}</div><div style={{fontSize:"0.68rem",color:SK.lite}}>{b.dur} min</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -- TODAY TAB -- */}
        {sTab==="today" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.3rem"}}>{"📅 My Schedule Today"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem"}}>{"Tap the circle when you finish a subject!"}</div>
            {SCHEDULE.length===0&&(
              <div style={{background:SK.card,borderRadius:"18px",padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>{"🛋"}</div>
                <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.9rem"}}>{"No school today!"}</div>
              </div>
            )}
            {SCHEDULE.map((b,i)=>{
              const done = !!checked[i];
              return (
                <div key={i} style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",display:"flex",gap:"0.8rem",alignItems:"center",marginBottom:"0.55rem",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`2px solid ${done?c1+"50":SK.skyL}`,opacity:done?0.75:1,transition:"all 0.2s"}}>
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
              );
            })}
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
          </div>
        )}

        {/* -- GOALS TAB -- */}
        {sTab==="goals" && (
          <div style={{animation:"fadeUp 0.22s ease",padding:"1.2rem 1rem"}}>
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.2rem",marginBottom:"0.3rem"}}>{"🎯 My Goals"}</div>
            <div style={{fontSize:"0.72rem",color:SK.lite,marginBottom:"1rem",lineHeight:1.5}}>{"Tap a goal you worked on today to log it!"}</div>
            {familyGoalObjs.length===0?(
              <div style={{background:SK.card,borderRadius:"18px",padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"0.8rem",color:SK.lite}}>{"No goals set yet."}</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
                {familyGoalObjs.map(g=>{
                  const done = goalsLoggedToday.has(g.id);
                  return (
                    <div key={g.id} onClick={()=>!done&&logGoal(g)}
                      style={{background:SK.card,borderRadius:"18px",padding:"0.9rem 1rem",display:"flex",gap:"0.85rem",alignItems:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`2px solid ${done?c1+"60":SK.skyL}`,cursor:done?"default":"pointer",transition:"all 0.2s",opacity:done?0.8:1}}>
                      <div style={{width:"46px",height:"46px",borderRadius:"13px",background:done?`linear-gradient(135deg,${c1},${c2})`:`linear-gradient(135deg,${c1}22,${c2}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0,transition:"background 0.2s"}}>{g.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:"800",color:done?c1:SK.ink,fontSize:"0.88rem"}}>{g.label}</div>
                        <div style={{fontSize:"0.68rem",color:SK.lite,marginTop:"2px"}}>{done?"Logged today! +10 pts":"Tap to log this goal today"}</div>
                      </div>
                      {done?(
                        <div style={{width:"28px",height:"28px",borderRadius:"50%",background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.85rem",flexShrink:0}}>{"✓"}</div>
                      ):(
                        <div style={{width:"28px",height:"28px",borderRadius:"50%",border:"2.5px solid #ddd",flexShrink:0}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {goalsLoggedToday.size>0&&(
              <div style={{background:`linear-gradient(135deg,${c1}15,${c2}10)`,borderRadius:"16px",padding:"0.85rem 1rem",marginTop:"0.9rem",textAlign:"center",border:`1.5px solid ${c1}30`}}>
                <div style={{fontWeight:"800",color:c1,fontSize:"0.85rem"}}>{"🌟 "+goalsLoggedToday.size+" goal"+(goalsLoggedToday.size>1?"s":"")+" logged today!"}</div>
              </div>
            )}
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
   CO-OP DAY AUTO-POPUP (student)
======================================= */
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
            <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.15rem",lineHeight:1.3,marginBottom:"0.25rem"}}>Co-op Day, {child.name}! 🎉</div>
            <div style={{fontSize:"0.8rem",color:SK.lite,lineHeight:1.65}}>What did you learn or do at co-op today?</div>
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)}
            placeholder="We did science experiments and I learned..." rows={3} autoFocus
            style={{width:"100%",padding:"0.85rem",border:`2.5px solid ${note.length>0?c1:"#ece5dc"}`,borderRadius:"16px",fontSize:"0.9rem",fontFamily:"inherit",background:SK.skyL,color:SK.ink,resize:"none",lineHeight:1.6,outline:"none",marginBottom:"0.8rem"}}
            onFocus={e=>e.target.style.borderColor=c1} onBlur={e=>{ if(!note.length) e.target.style.borderColor="#ece5dc"; }}
          />
          <button onClick={handleSave} disabled={!note.trim()} style={{width:"100%",padding:"0.88rem",border:"none",borderRadius:"15px",background:note.trim()?`linear-gradient(135deg,${SK.sky},${SK.grass})`:"#e8e0d8",color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:note.trim()?"pointer":"default",marginBottom:"0.55rem"}}>
            Save it!  +25 points
          </button>
          <button onClick={onDismiss} style={{width:"100%",padding:"0.5rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.78rem",cursor:"pointer"}}>Maybe later</button>
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

/* =======================================
   CO-OP QUICK LOG MODAL (parent)
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
function OnboardingFlow({ pal, onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    parentName:"", familyName:"", schoolName:"", state:"Tennessee",
    yearsHomeschooling:"0-1 years",
    children:[{id:uid(),name:"",grade:"1st",avatar:"🌻"}],
    curriculumStyle:["eclectic"],
    curriculumBrands:[],
    subjects:["bible","math","reading","language","science","history"],
    sessionLength:"45 min",
    morningGathering:true, morningGatheringName:"Morning Time",
    schoolDays:"Monday-Friday", startTime:"8:00", endTime:"15:00", breakStyle:"Short breaks every hour",
    goals:[],
    coopFreq:"Every other week", extracurriculars:[],
    lifeReady:false, lifeReadyFreq:"monday_plus_practice", lifeReadyCategories:[],
    paletteId:"sage",
  });
  const upd = (k,v) => setData(d=>({...d,[k]:v}));
  const STEPS = ["Welcome","Your Children","Learning Style","Curriculum","Subjects","Lesson Goals","Weekly Schedule","Schedule","Co-op","Goals","Life & Extras","Life Ready"];
  const pct = Math.round((step/11)*100);

  const STEP_ICONS = ["🌱","👨👩👧👦","📚","📖","🔬","🎯","📆","📅","🏫","🌟","🌿","🛡"];

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column"}}>
      {/* Progress header */}
      {step>0 && (
        <div style={{background:pal.deep,padding:"0.85rem 1.1rem 0.75rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem"}}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{background:"rgba(255,255,255,0.14)",border:"none",color:"#fff",borderRadius:"50%",width:"28px",height:"28px",cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>Back</button>
            <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.55)",fontWeight:"700",letterSpacing:"0.08em",textTransform:"uppercase"}}>{STEP_ICONS[step]} {STEPS[step]}</span>
            <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",fontWeight:"600"}}>{step + " of 11"}</span>
          </div>
          <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.15)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:pal.accentGrad,transition:"width 0.35s ease"}}/>
          </div>
        </div>
      )}

      <div key={step} style={{flex:1,overflowY:"auto"}}>
        {step===0 && <OnbWelcome      pal={pal} data={data} upd={upd} onNext={()=>setStep(1)} />}
        {step===1 && <OnbChildren     pal={pal} data={data} upd={upd} onNext={()=>setStep(2)} />}
        {step===2 && <OnbPhilosophy   pal={pal} data={data} upd={upd} onNext={()=>setStep(3)} />}
        {step===3 && <OnbCurrBrands   pal={pal} data={data} upd={upd} onNext={()=>setStep(4)} />}
        {step===4 && <OnbSubjects     pal={pal} data={data} upd={upd} onNext={()=>setStep(5)} />}
        {step===5 && <OnbLessonGoals    pal={pal} data={data} upd={upd} onNext={()=>setStep(6)} />}
        {step===6 && <OnbWeeklySchedule pal={pal} data={data} upd={upd} onNext={()=>setStep(7)} />}
        {step===7 && <OnbSchedule       pal={pal} data={data} upd={upd} onNext={()=>setStep(8)} />}
        {step===8 && <OnbCoop           pal={pal} data={data} upd={upd} onNext={()=>setStep(9)} />}
        {step===9 && <OnbGoals          pal={pal} data={data} upd={upd} onNext={()=>setStep(10)} />}
        {step===10 && <OnbExtras        pal={pal} data={data} upd={upd} onNext={()=>setStep(11)} />}
        {step===11 && <OnbLifeReady     pal={pal} data={data} upd={upd} onNext={()=>onComplete(data)} />}
      </div>
    </div>
  );
}

/* --- STEP 0: Welcome --- */
function OnbWelcome({ pal, data, upd, onNext }) {
  const canNext = data.parentName.trim().length>0 && data.familyName.trim().length>0;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:pal.heroGrad,padding:"2.5rem 1.4rem 2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-40px",top:"-40px",width:"160px",height:"160px",borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"grow 0.5s ease"}}>🌱</div>
        <h1 style={{fontFamily:"Georgia",fontSize:"1.8rem",fontWeight:"800",color:"#fff",margin:"0 0 0.4rem",lineHeight:1.2}}>{"Welcome to"}<br/>{"Root & Bloom"}</h1>
        <p style={{color:"rgba(255,255,255,0.62)",fontSize:"0.85rem",margin:0,lineHeight:1.65}}>Let us set up your homeschool in just a few minutes.</p>
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-5-20251001",
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
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="🔬" title="Your Subjects" sub="Pick everything you teach. You can always add or remove later." />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.45rem",marginBottom:"0.85rem"}}>
        {allSubjects.map(s=>{
          const isSelected = sel.includes(s.id);
          const isCustom = s.id.startsWith("custom_");
          return (
            <button key={s.id} onClick={()=>toggleSubj(s.id)} style={{padding:"0.7rem 0.75rem",border:`2px solid ${isSelected?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:isSelected?pal.pale:"transparent",cursor:"pointer",textAlign:"left",display:"flex",gap:"0.5rem",alignItems:"center",transition:"all 0.13s",position:"relative"}}>
              <span style={{fontSize:"1.15rem",flexShrink:0}}>{s.icon}</span>
              <span style={{fontWeight:isSelected?"700":"400",color:isSelected?pal.primary:pal.inkM,fontSize:"0.78rem",flex:1}}>{s.label}</span>
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
            <Input pal={pal} value={data.morningGatheringName} onChange={v=>upd("morningGatheringName",v)} placeholder="Or type your own name..." />
          </div>
        )}
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
        {"Tip: 0 means that subject is not planned for that day. Tap each number to cycle through 0 \u2192 1 \u2192 2 \u2192 3."}
        {coopDay&&<span>{" Co-op days ("}{coopDay}{") are marked automatically."}</span>}
      </div>

      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"1fr repeat(5,36px)",gap:"0.3rem",marginBottom:"0.4rem",alignItems:"center"}}>
        <div/>
        {DOW_NAMES.map((d,i)=>(
          <div key={d} style={{textAlign:"center",fontSize:"0.62rem",fontWeight:"800",color:i===coopDow?"#b07800":pal.slate,textTransform:"uppercase",letterSpacing:"0.05em"}}>{d}</div>
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
                        <div style={{width:"30px",height:"30px",borderRadius:"8px",background:"#fff8e6",border:"1.5px solid #f5c84240",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",color:"#b07800",fontWeight:"700",textAlign:"center",lineHeight:1.2}}>co{"\u00b7"}op</div>
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
          {"Skip \u2192"}
        </button>
        <Btn pal={pal} onClick={save} style={{flex:2}}>{"Save goals \u2192"}</Btn>
      </div>
    </div>
  );
}

/* --- STEP 6: Weekly Schedule — which subjects on which days --- */
function OnbWeeklySchedule({ pal, data, upd, onNext }) {
  const customSubjs = data.customSubjects||[];
  const allSubjMap  = Object.fromEntries([...SUBJECT_OPTIONS,...customSubjs].map(s=>[s.id,s]));
  const activeSubjs = (data.subjects||[]).map(id=>allSubjMap[id]).filter(Boolean);

  const DOW_LABELS  = ["Mon","Tue","Wed","Thu","Fri"];
  const DOW_FULL    = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const coopDow     = ["Monday","Tuesday","Wednesday","Thursday","Friday"].indexOf(data.coopDay??""  );

  // weeklySchedule: {0:[subjId,...], 1:[...], 2:[...], 3:[...], 4:[...]}
  // null entry means "not a school day" (different from empty array = school day, no subjects yet)
  const [sched, setSched] = React.useState(()=>{
    if(data.weeklySchedule) return data.weeklySchedule;
    // Default: all subjects every day (except co-op day)
    const init = {};
    for(let d=0;d<5;d++){
      if(d===coopDow) { init[d]=null; continue; }
      init[d] = activeSubjs.map(s=>s.id);
    }
    return init;
  });

  const [activeDay, setActiveDay] = React.useState(
    coopDow===0 ? 1 : 0  // start on first non-coop day
  );

  const toggleSubj = (dow, subjId) => {
    setSched(prev=>{
      const cur = prev[dow]||[];
      const next = cur.includes(subjId) ? cur.filter(x=>x!==subjId) : [...cur, subjId];
      return {...prev, [dow]: next};
    });
  };

  const toggleDay = (dow) => {
    if(dow===coopDow) return; // can't toggle co-op day
    setSched(prev=>{
      // null = no school, array = school day
      if(prev[dow]===null) return {...prev, [dow]: activeSubjs.map(s=>s.id)};
      return {...prev, [dow]: null};
    });
  };

  const save = () => {
    upd("weeklySchedule", sched);
    onNext();
  };

  if(activeSubjs.length===0) { onNext(); return null; }

  const activeDaySubjs = sched[activeDay];
  const isDayOff       = activeDaySubjs===null;
  const isCoop         = activeDay===coopDow;

  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📆" title="Weekly Schedule"
        sub="Which subjects do you cover each day? Tap a day to set it up. You can always adjust this later." />

      {/* Day tabs */}
      <div style={{display:"flex",gap:"0.3rem",marginBottom:"1rem"}}>
        {DOW_LABELS.map((d,i)=>{
          const isActive   = activeDay===i;
          const isCopDay   = i===coopDow;
          const isOff      = sched[i]===null && !isCopDay;
          const subjCount  = Array.isArray(sched[i]) ? sched[i].length : 0;
          return (
            <button key={i} onClick={()=>setActiveDay(i)}
              style={{flex:1,padding:"0.55rem 0.2rem",borderRadius:"12px",border:`2px solid ${isActive?pal.primary:isCopDay?"#f5c842":isOff?pal.stone+"40":pal.stone+"50"}`,background:isActive?pal.pale:isCopDay?"#fff8e6":isOff?"transparent":"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.13s"}}>
              <div style={{fontSize:"0.65rem",fontWeight:"800",color:isActive?pal.primary:isCopDay?"#b07800":isOff?pal.stone:pal.inkM,textTransform:"uppercase",letterSpacing:"0.05em"}}>{d}</div>
              <div style={{fontSize:"0.58rem",color:isActive?pal.primary:isCopDay?"#b07800":isOff?pal.stone:pal.slate,marginTop:"2px",fontWeight:"600"}}>
                {isCopDay?"Co-op":isOff?"Off":subjCount+" subj"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day panel */}
      {isCoop ? (
        <div style={{background:"#fff8e6",borderRadius:"16px",padding:"1.2rem 1rem",border:"1.5px solid #f5c84250",textAlign:"center"}}>
          <div style={{fontSize:"1.8rem",marginBottom:"0.4rem"}}>{"🏫"}</div>
          <div style={{fontWeight:"800",color:"#7a5500",fontSize:"0.88rem",marginBottom:"0.25rem"}}>{DOW_FULL[activeDay]} is your Co-op day</div>
          <div style={{fontSize:"0.74rem",color:"#b07800",lineHeight:1.6}}>Co-op subjects are set up in the next step. Regular subjects are paused on this day.</div>
        </div>
      ) : (
        <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",border:`1.5px solid ${pal.stone}30`}}>
          {/* Day on/off toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isDayOff?"0":"0.75rem",paddingBottom:isDayOff?"0":"0.75rem",borderBottom:isDayOff?"none":`1px solid ${pal.stone}20`}}>
            <div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>{DOW_FULL[activeDay]}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>{isDayOff?"No school this day":"Select which subjects"}</div>
            </div>
            <button onClick={()=>toggleDay(activeDay)}
              style={{width:"44px",height:"26px",borderRadius:"13px",border:"none",background:isDayOff?pal.stone+"60":pal.primary,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
              <div style={{position:"absolute",top:"3px",left:isDayOff?"3px":"21px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
            </button>
          </div>

          {!isDayOff && (
            <div style={{display:"flex",flexDirection:"column",gap:"0.32rem"}}>
              {activeSubjs.map(s=>{
                const sel = (sched[activeDay]||[]).includes(s.id);
                return (
                  <button key={s.id} onClick={()=>toggleSubj(activeDay, s.id)}
                    style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.55rem 0.75rem",border:`2px solid ${sel?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:sel?pal.pale:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                    <span style={{fontSize:"1.1rem",width:"22px",textAlign:"center",flexShrink:0}}>{s.icon}</span>
                    <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
                    <div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.12s"}}>
                      {sel&&<span style={{color:"#fff",fontSize:"0.72rem",fontWeight:"900"}}>{"✓"}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Week summary */}
      <div style={{background:pal.parchm,borderRadius:"12px",padding:"0.65rem 0.85rem",marginTop:"0.85rem",marginBottom:"1.1rem",border:`1px solid ${pal.stone}25`}}>
        <div style={{fontSize:"0.64rem",fontWeight:"800",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.35rem"}}>Your week at a glance</div>
        <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
          {DOW_LABELS.map((d,i)=>{
            const isCopDay = i===coopDow;
            const isOff    = sched[i]===null && !isCopDay;
            const count    = Array.isArray(sched[i]) ? sched[i].length : 0;
            return (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",cursor:"pointer"}} onClick={()=>setActiveDay(i)}>
                <div style={{fontSize:"0.6rem",fontWeight:"700",color:isCopDay?"#b07800":isOff?pal.stone:pal.inkM}}>{d}</div>
                <div style={{width:"36px",height:"36px",borderRadius:"9px",background:isCopDay?"#fff8e6":isOff?pal.parchm:pal.pale,border:`1.5px solid ${activeDay===i?pal.primary:isCopDay?"#f5c842":isOff?pal.stone+"30":pal.stone+"40"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:"800",color:isCopDay?"#b07800":isOff?pal.stone:pal.primary}}>
                  {isCopDay?"🏫":isOff?"—":count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:"flex",gap:"0.5rem"}}>
        <button onClick={onNext}
          style={{flex:1,padding:"0.72rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.86rem",cursor:"pointer"}}>
          {"Skip \u2192"}
        </button>
        <Btn pal={pal} onClick={save} style={{flex:2}}>{"Save schedule \u2192"}</Btn>
      </div>
    </div>
  );
}

/* --- STEP 5: Schedule --- */
function OnbSchedule({ pal, data, upd, onNext }) {
  const multiChild = (data.children||[]).length > 1;
  const schedMode2 = data.scheduleMode2 || (multiChild ? null : "same");
  const [childStep, setChildStep] = React.useState(0); // which child we're configuring (for separate/mixed)

  // For separate/mixed: build per-child config
  const updChildCfg = (childId, field, val) => {
    const updated = (data.children||[]).map(c=>
      c.id===childId ? {...c, scheduleConfig:{...(c.scheduleConfig||{}),[field]:val}} : c
    );
    upd("children", updated);
  };
  const updGroupSubjs = (id) => {
    const cur = data.groupSubjects||[];
    upd("groupSubjects", cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
  };

  const allSubjOptions = [...SUBJECT_OPTIONS,...(data.customSubjects||[])];
  const children = data.children||[];
  const currentChild = children[childStep];
  const childCfg = currentChild?.scheduleConfig||{};

  // Mode selection screen — shown first for multi-child
  if(multiChild && !schedMode2) {
    return (
      <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
        <StepHdr pal={pal} icon="📅" title="Schedule Setup" sub={"You have "+children.length+" children — how should we build their schedule?"} />
        <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",marginBottom:"1.5rem"}}>
          {[
            {id:"same",   icon:"👨‍👩‍👧‍👦", title:"Same schedule",     desc:"All children follow the same daily plan. Great for mixed-age learning and unit studies."},
            {id:"mixed",  icon:"🔀",        title:"Mostly together",  desc:"Shared subjects like History and Science are done together. Math and Reading are done separately at each child's level."},
            {id:"separate",icon:"📋",       title:"Separate schedules",desc:"Each child has their own completely different daily schedule, subjects, and timing."},
          ].map(opt=>(
            <button key={opt.id} onClick={()=>upd("scheduleMode2",opt.id)}
              style={{display:"flex",gap:"0.85rem",alignItems:"flex-start",padding:"0.9rem 1rem",border:`2px solid ${schedMode2===opt.id?pal.primary:pal.stone+"50"}`,borderRadius:"14px",background:schedMode2===opt.id?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.14s"}}>
              <span style={{fontSize:"1.6rem",flexShrink:0,marginTop:"2px"}}>{opt.icon}</span>
              <div>
                <div style={{fontWeight:"800",color:schedMode2===opt.id?pal.primary:pal.ink,fontSize:"0.88rem",marginBottom:"3px"}}>{opt.title}</div>
                <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.5}}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <Btn pal={pal} disabled={!schedMode2} onClick={()=>{}}>{"Next →"}</Btn>
      </div>
    );
  }

  // Mixed mode: first pick group subjects
  if(schedMode2==="mixed" && !(data.groupSubjects)) {
    const sel = data.groupSubjects||[];
    return (
      <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
        <StepHdr pal={pal} icon="🔀" title="Shared Subjects" sub={"Which subjects do all your children do together?"} />
        <div style={{fontSize:"0.75rem",color:pal.slate,marginBottom:"0.75rem",lineHeight:1.55}}>
          {"Examples: Morning Time, History, Science, Read-Aloud, Art, Music, P&C. You'll set individual subjects per child next."}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginBottom:"1rem"}}>
          {allSubjOptions.map(s=>{
            const isSel=(data.groupSubjects||[]).includes(s.id);
            return (
              <button key={s.id} onClick={()=>updGroupSubjs(s.id)}
                style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.6rem 0.85rem",border:`2px solid ${isSel?pal.primary:pal.stone+"45"}`,borderRadius:"11px",background:isSel?pal.pale:"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                <span style={{fontSize:"1.1rem",width:"24px",textAlign:"center"}}>{s.icon||"📋"}</span>
                <span style={{flex:1,fontWeight:isSel?"700":"400",color:isSel?pal.primary:pal.inkM,fontSize:"0.84rem"}}>{s.label}</span>
                <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${isSel?pal.primary:pal.stone}`,background:isSel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {isSel&&<span style={{color:"#fff",fontSize:"0.7rem",fontWeight:"900"}}>{"✓"}</span>}
                </div>
              </button>
            );
          })}
        </div>
        <Btn pal={pal} onClick={()=>upd("groupSubjects",(data.groupSubjects||[]).length>0?(data.groupSubjects||[]):[])}>{"Next →"}</Btn>
      </div>
    );
  }

  // Separate / mixed: per-child subject + session config
  if((schedMode2==="separate"||schedMode2==="mixed") && childStep < children.length) {
    const childSubjs = childCfg.subjects||[];
    const alreadyGroup = data.groupSubjects||[];
    const availForChild = schedMode2==="mixed"
      ? allSubjOptions.filter(s=>!alreadyGroup.includes(s.id))
      : allSubjOptions;
    const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(currentChild?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];

    const toggleChildSubj = (id) => {
      const cur = childCfg.subjects||[];
      updChildCfg(currentChild.id,"subjects",cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
    };

    return (
      <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.65rem",marginBottom:"1rem",padding:"0.75rem 1rem",background:`linear-gradient(135deg,${cp.c1}20,${cp.c2}15)`,borderRadius:"14px",border:`2px solid ${cp.c1}30`}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>{currentChild?.avatar||"🌱"}</div>
          <div>
            <div style={{fontWeight:"900",color:pal.ink,fontSize:"0.95rem"}}>{currentChild?.name||"Child"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{currentChild?.grade||""} {"\u00b7"} Child {childStep+1} of {children.length}</div>
          </div>
        </div>

        {schedMode2==="mixed"&&alreadyGroup.length>0&&(
          <div style={{background:pal.pale,borderRadius:"11px",padding:"0.6rem 0.85rem",marginBottom:"0.75rem",fontSize:"0.72rem",color:pal.primary,border:`1.5px solid ${pal.primary}20`}}>
            {"✓ Shared subjects already included: "+alreadyGroup.map(id=>allSubjOptions.find(s=>s.id===id)?.label||id).join(", ")}
          </div>
        )}

        <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem",marginBottom:"0.5rem"}}>
          {schedMode2==="mixed"?"Individual subjects for "+currentChild?.name:"Subjects for "+currentChild?.name}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.32rem",marginBottom:"1rem"}}>
          {availForChild.map(s=>{
            const isSel=childSubjs.includes(s.id);
            return (
              <button key={s.id} onClick={()=>toggleChildSubj(s.id)}
                style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.55rem 0.85rem",border:`2px solid ${isSel?cp.c1:pal.stone+"45"}`,borderRadius:"10px",background:isSel?cp.c1+"15":"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                <span style={{fontSize:"1.1rem",width:"24px",textAlign:"center"}}>{s.icon||"📋"}</span>
                <span style={{flex:1,fontWeight:isSel?"700":"400",color:isSel?cp.c1:pal.inkM,fontSize:"0.83rem"}}>{s.label}</span>
                <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${isSel?cp.c1:pal.stone}`,background:isSel?cp.c1:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {isSel&&<span style={{color:"#fff",fontSize:"0.7rem",fontWeight:"900"}}>{"✓"}</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem",marginBottom:"0.45rem"}}>Session length for {currentChild?.name}</div>
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
          {SESSION_LENGTHS.map(l=>(
            <button key={l} onClick={()=>updChildCfg(currentChild.id,"sessionLength",l)}
              style={{padding:"0.42rem 0.8rem",border:`2px solid ${(childCfg.sessionLength||"45 min")===l?cp.c1:pal.stone+"50"}`,borderRadius:"20px",background:(childCfg.sessionLength||"45 min")===l?cp.c1+"18":"transparent",cursor:"pointer",fontWeight:(childCfg.sessionLength||"45 min")===l?"700":"400",color:(childCfg.sessionLength||"45 min")===l?cp.c1:pal.inkM,fontSize:"0.8rem",transition:"all 0.13s"}}>
              {l}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:"0.5rem"}}>
          {childStep>0&&(
            <button onClick={()=>setChildStep(s=>s-1)}
              style={{padding:"0.65rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.84rem",cursor:"pointer"}}>
              Back
            </button>
          )}
          <Btn pal={pal} onClick={()=>{
            if(childStep < children.length-1) { setChildStep(s=>s+1); }
            else { onNext(); }
          }}>
            {childStep < children.length-1 ? "Next child →" : "Done — Next →"}
          </Btn>
        </div>
      </div>
    );
  }

  // Same schedule (or single child) — original flow
  return (
    <div style={{padding:"1.4rem 1.2rem",animation:"fadeUp 0.25s ease"}}>
      <StepHdr pal={pal} icon="📅" title="Your Schedule" sub={"We'll use this to set up your weekly template."} />

      {/* School year dates */}
      <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}22`}}>
        <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.86rem",marginBottom:"0.55rem"}}>📖 School Year Dates</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
          <div>
            <Lbl pal={pal}>Year started</Lbl>
            <Input pal={pal} type="date" value={data.yearStart||""} onChange={v=>upd("yearStart",v)} />
          </div>
          <div>
            <Lbl pal={pal}>Goal end date</Lbl>
            <Input pal={pal} type="date" value={data.yearEnd||""} onChange={v=>upd("yearEnd",v)} />
          </div>
        </div>
        <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"0.5rem"}}>Used to track your year progress. You can update this anytime in Settings.</div>
      </div>

      {/* Hours goal */}
      <div style={{background:pal.parchm,borderRadius:"13px",padding:"0.8rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
        <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.84rem",marginBottom:"0.2rem"}}>🕐 Daily hours goal (optional)</div>
        <div style={{fontSize:"0.71rem",color:pal.slate,marginBottom:"0.55rem"}}>Some states require a minimum number of hours per year. Florida requires 180 days but no hour minimum. Other states vary — check your state law.</div>
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

      {/* Schedule style toggle */}
      <div style={{display:"flex",background:pal.parchm,borderRadius:"12px",padding:"3px",gap:"2px",marginBottom:"1rem"}}>
        {[["checklist","📋 Checklist","No times, just a to-do list"],["timed","🕑 Timed","Set start/end times for each block"]].map(([val,label,sub])=>(
          <button key={val} onClick={()=>upd("scheduleMode",val)} style={{flex:1,padding:"0.6rem 0.5rem",border:"none",borderRadius:"10px",background:(!data.scheduleMode&&val==="checklist")||data.scheduleMode===val?pal.linen:"transparent",cursor:"pointer",transition:"all 0.15s",textAlign:"center"}}>
            <div style={{fontWeight:"700",color:(!data.scheduleMode&&val==="checklist")||data.scheduleMode===val?pal.primary:pal.slate,fontSize:"0.8rem"}}>{label}</div>
            <div style={{fontSize:"0.65rem",color:pal.slate,marginTop:"1px"}}>{sub}</div>
          </button>
        ))}
      </div>

      {data.scheduleMode==="timed" && (
        <div style={{animation:"fadeUp 0.2s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
            <div>
              <Lbl pal={pal}>Start time</Lbl>
              <TimeSelect pal={pal} value={data.startTime} onChange={v=>upd("startTime",v)} />
            </div>
            <div>
              <Lbl pal={pal}>End time</Lbl>
              <TimeSelect pal={pal} value={data.endTime} onChange={v=>upd("endTime",v)} />
            </div>
          </div>
          <Lbl pal={pal}>Break style</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
            {BREAK_STYLES.map(b=>(
              <button key={b} onClick={()=>upd("breakStyle",b)} style={{padding:"0.65rem 1rem",border:`2px solid ${data.breakStyle===b?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.breakStyle===b?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.breakStyle===b?"700":"400",color:data.breakStyle===b?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
              {b}
            </button>
            ))}
          </div>
        </div>
      )}

      {/* Morning gathering */}
      <div style={{background:pal.pale,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1.2rem",border:`1.5px solid ${pal.primary}22`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:data.morningGathering?"0.65rem":"0"}}>
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
            <Input pal={pal} value={data.morningGatheringName} onChange={v=>upd("morningGatheringName",v)} placeholder="Or type your own name..." />
          </div>
        )}
      </div>

      <Btn pal={pal} onClick={onNext}>{"Next →"}</Btn>
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

          {/* Time */}
          <div style={{marginBottom:"1rem"}}>
            <Lbl pal={pal}>Start time</Lbl>
            <select value={data.coopTime||""} onChange={e=>upd("coopTime",e.target.value)}
              style={{width:"100%",padding:"0.55rem 0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.84rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}>
              <option value="">Select a time...</option>
              {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>

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
      <Lbl pal={pal}>Co-op frequency</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
        {COOP_FREQ.map(c=>(
          <button key={c} onClick={()=>upd("coopFreq",c)} style={{padding:"0.65rem 1rem",border:`2px solid ${data.coopFreq===c?pal.primary:pal.stone+"50"}`,borderRadius:"12px",background:data.coopFreq===c?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:data.coopFreq===c?"700":"400",color:data.coopFreq===c?pal.primary:pal.inkM,fontSize:"0.84rem",transition:"all 0.13s"}}>
            {c}
          </button>
        ))}
      </div>
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
      {/* Final CTA - warm */}
      <div style={{background:pal.heroGrad,borderRadius:"18px",padding:"1.2rem 1.3rem",marginBottom:"1.1rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-20px",top:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{fontSize:"2rem",marginBottom:"0.4rem",position:"relative"}}>🌱</div>
        <div style={{fontWeight:"800",color:pal.onDark,fontSize:"0.94rem",marginBottom:"0.25rem",position:"relative"}}>{"You're all set, "}{data.parentName||"friend"}{"!"}</div>
        <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.65)",lineHeight:1.65,position:"relative"}}>Root & Bloom is ready for your family. Let us grow something beautiful together.</div>
      </div>
      <Btn pal={pal} onClick={onNext}>Open My App 🌱</Btn>
    </div>
  );
}

/* =======================================
   SETTINGS SCREEN
======================================= */
function AIUsageDisplay({pal}){
  const {used,limit} = checkAILimit();
  const pct = Math.min(100,Math.round((used/limit)*100));
  return (
    <div style={{background:pal.sand,borderRadius:"11px",padding:"0.75rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
        <span style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM}}>This month</span>
        <span style={{fontSize:"0.74rem",fontWeight:"800",color:pct>80?pal.warn:pal.good}}>{used} / {limit} uses</span>
      </div>
      <div style={{height:"6px",borderRadius:"99px",background:pal.parchm,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:"99px",background:pct>80?pal.warn:pal.good,transition:"width 0.4s"}}/>
      </div>
      <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"4px"}}>Resets on the 1st of next month</div>
    </div>
  );
}

/* ---- Curriculum Add Widget (used in Settings) ---- */
function CurriculumAddWidget({pal, local, updL}){
  const [show,     setShow]     = useState(false);
  const [name,     setName]     = useState("");
  const [url,      setUrl]      = useState("");
  const [fetching, setFetching] = useState(false);
  const [msg,      setMsg]      = useState("");

  const urlValid = url.trim().startsWith("http")||url.trim().startsWith("www");

  const add = async () => {
    const n = name.trim();
    const u = url.trim();
    if(!n||!urlValid) return;
    const id = "custom_curr_"+n.toLowerCase().replace(/\s+/g,"_");
    const entry = {id,label:n,url:u,icon:"📘",desc:"Custom curriculum",summary:""};
    const existing = (local.customCurriculums||[]).filter(c=>c.id!==id);
    updL("customCurriculums",[...existing,entry]);
    updL("curriculumBrands",[...(local.curriculumBrands||[]).filter(x=>x!==id),id]);
    setFetching(true);
    setMsg("Looking up "+n+"...");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-5-20251001",
          max_tokens:400,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:"Please visit "+u+" and give me a 2-3 sentence summary of what this homeschool curriculum covers, its teaching philosophy, grade levels, and what makes it unique. Be concise and practical."}]
        })
      });
      const d = await res.json();
      const summary = d.content?.filter(b=>b.type==="text").map(b=>b.text).join(" ").trim()||"";
      const withSummary = [...existing,{...entry,summary:summary||""}];
      updL("customCurriculums",withSummary);
      setMsg(summary?"✓ Summary added!":"✓ Added — no summary found.");
    } catch(e) {
      setMsg("✓ Added! (Website lookup failed)");
    }
    setFetching(false);
    setName(""); setUrl(""); setShow(false);
    setTimeout(()=>setMsg(""),3000);
  };

  return (
    <div>
      {msg&&<div style={{fontSize:"0.72rem",color:pal.good,fontWeight:"600",marginBottom:"0.45rem",padding:"0.4rem 0.6rem",background:pal.goodBg,borderRadius:"8px",border:`1px solid ${pal.good}30`}}>{msg}</div>}
      {!show?(
        <button onClick={()=>setShow(true)}
          style={{width:"100%",padding:"0.48rem",border:`2px dashed ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.76rem",fontWeight:"600",cursor:"pointer"}}>
          + Add custom curriculum
        </button>
      ):(
        <div style={{background:pal.pale,borderRadius:"12px",padding:"0.75rem",border:`1.5px solid ${pal.primary}20`,animation:"fadeUp 0.18s ease"}}>
          <Input pal={pal} value={name} onChange={setName} placeholder="Curriculum name..." />
          <div style={{height:"0.4rem"}}/>
          <Input pal={pal} value={url} onChange={setUrl} placeholder="Website URL (https://...)" />
          {url&&!urlValid&&<div style={{fontSize:"0.68rem",color:pal.bad,marginTop:"2px"}}>Enter a valid URL starting with https://</div>}
          <div style={{display:"flex",gap:"0.4rem",marginTop:"0.55rem"}}>
            <button onClick={()=>{setShow(false);setName("");setUrl("");}}
              style={{padding:"0.48rem 0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"9px",background:"transparent",color:pal.slate,fontSize:"0.78rem",cursor:"pointer"}}>
              Cancel
            </button>
            <button onClick={add} disabled={!name.trim()||!urlValid||fetching}
              style={{flex:1,padding:"0.48rem",border:"none",borderRadius:"9px",background:name.trim()&&urlValid&&!fetching?"linear-gradient(135deg,#2a6a2a,#4a9a4a)":"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:name.trim()&&urlValid&&!fetching?"pointer":"default"}}>
              {fetching?"Fetching...":"Add + Fetch Summary"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsScreen({ pal, family, setFamily, paletteId, setPaletteId, customA, customB, setCustomA, setCustomB, navIds, setNavIds, onBack }) {
  const [tab,         setTab]        = useState("family");
  const [local,       setLocal]      = useState(family ? {...family} : {});
  const [showAddSubj, setShowAddSubj]= useState(false);
  const [custSubjVal, setCustSubjVal]= useState("");
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

  const STABS = [["family","👨👩👧👦 Family"],["children","🌱 Children"],["school","🏫 School"],["theme","🎨 Theme"],["nav","Nav"],["ai","🤖 AI"]];
  const [schoolSubTab, setSchoolSubTab] = useState("school");

  return (
    <div style={{minHeight:"100vh",background:pal.sand,display:"flex",flexDirection:"column",animation:"fadeIn 0.18s ease"}}>
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

      <div key={tab} style={{flex:1,overflowY:"auto",padding:"1.2rem 1.1rem"}}>
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
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                  <div><Lbl pal={pal}>Name</Lbl><Input pal={pal} value={c.name} onChange={v=>updChild(c.id,"name",v)} placeholder={"Child's name"} /></div>
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
              {(()=>{
                const csj2   = local.customSubjects||[];
                const smap3  = Object.fromEntries([...SUBJECT_OPTIONS,...csj2].map(s=>[s.id,s]));
                const asj3   = (local.subjects||[]).map(id=>smap3[id]).filter(Boolean);
                const cdow3  = ["Monday","Tuesday","Wednesday","Thursday","Friday"].indexOf(local.coopDay??"");
                const DOW3   = ["Mon","Tue","Wed","Thu","Fri"];
                const DOW3F  = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
                const [aday3,setAday3] = React.useState(cdow3===0?1:0);

                const ws3 = local.weeklySchedule || (() => {
                  const init = {};
                  for(let d=0;d<5;d++) init[d] = d===cdow3?null:asj3.map(s=>s.id);
                  return init;
                })();

                const setWs3 = (fn) => {
                  const next = typeof fn==="function" ? fn(local.weeklySchedule||ws3) : fn;
                  updL("weeklySchedule", next);
                };

                const togSubj3 = (dow,id) => setWs3(prev=>{
                  const cur=prev[dow]||[];
                  return {...prev,[dow]:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]};
                });
                const togDay3 = (dow) => {
                  if(dow===cdow3) return;
                  setWs3(prev=>({...prev,[dow]:prev[dow]===null?asj3.map(s=>s.id):null}));
                };

                const wsCur = local.weeklySchedule||ws3;
                const isDOff3  = wsCur[aday3]===null&&aday3!==cdow3;
                const isCoop3  = aday3===cdow3;
                const daySjs3  = wsCur[aday3]||[];

                return (
                  <div>
                    {/* Day tabs */}
                    <div style={{display:"flex",gap:"0.25rem",marginBottom:"0.65rem"}}>
                      {DOW3.map((d,i)=>{
                        const isAct=aday3===i, isCp=i===cdow3, isOff=wsCur[i]===null&&!isCp;
                        const cnt=Array.isArray(wsCur[i])?wsCur[i].length:0;
                        return (
                          <button key={i} onClick={()=>setAday3(i)}
                            style={{flex:1,padding:"0.4rem 0.1rem",borderRadius:"9px",border:`1.5px solid ${isAct?pal.primary:isCp?"#f5c842":isOff?pal.stone+"30":pal.stone+"45"}`,background:isAct?pal.pale:isCp?"#fff8e6":"transparent",cursor:"pointer",textAlign:"center"}}>
                            <div style={{fontSize:"0.6rem",fontWeight:"800",color:isAct?pal.primary:isCp?"#b07800":isOff?pal.stone:pal.inkM,textTransform:"uppercase"}}>{d}</div>
                            <div style={{fontSize:"0.55rem",color:isAct?pal.primary:isCp?"#b07800":isOff?pal.stone:pal.slate,marginTop:"1px",fontWeight:"600"}}>
                              {isCp?"coop":isOff?"off":cnt+"s"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {/* Day panel */}
                    {isCoop3 ? (
                      <div style={{background:"#fff8e6",borderRadius:"11px",padding:"0.65rem 0.85rem",border:"1.5px solid #f5c84240",fontSize:"0.74rem",color:"#b07800",fontWeight:"600"}}>
                        {"🏫 Co-op day — regular subjects paused"}
                      </div>
                    ) : (
                      <div style={{background:pal.parchm,borderRadius:"11px",padding:"0.55rem 0.75rem"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isDOff3?"0":"0.55rem"}}>
                          <span style={{fontSize:"0.76rem",fontWeight:"700",color:pal.inkM}}>{DOW3F[aday3]}</span>
                          <button onClick={()=>togDay3(aday3)}
                            style={{width:"38px",height:"22px",borderRadius:"11px",border:"none",background:isDOff3?pal.stone+"60":pal.primary,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                            <div style={{position:"absolute",top:"2px",left:isDOff3?"2px":"18px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                          </button>
                        </div>
                        {!isDOff3&&(
                          <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
                            {asj3.map(s=>{
                              const sel=daySjs3.includes(s.id);
                              return (
                                <button key={s.id} onClick={()=>togSubj3(aday3,s.id)}
                                  style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.4rem 0.55rem",border:`1.5px solid ${sel?pal.primary:pal.stone+"40"}`,borderRadius:"8px",background:sel?pal.pale:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                                  <span style={{fontSize:"0.9rem",width:"18px",textAlign:"center",flexShrink:0}}>{s.icon}</span>
                                  <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.78rem"}}>{s.label}</span>
                                  <div style={{width:"16px",height:"16px",borderRadius:"4px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                    {sel&&<span style={{color:"#fff",fontSize:"0.6rem",fontWeight:"900"}}>{"✓"}</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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
            <SCard pal={pal} title="Nav Tabs" note={navIds.length + " tabs - 3-5 - Home, Schedule & Portfolio always stay"}>
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
                        : <div style={{width:"19px",height:"19px",borderRadius:"5px",border:`2px solid ${on?pal.primary:pal.stone}`,background:on?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<span style={{color:pal.onDark,fontSize:"0.8rem",fontWeight:"900"}}>✓</span>}</div>
                      }
                    </button>
                  );
                })}
              </div>
            </SCard>
          </div>
        )}
      </div>

        {tab==="ai" && (
          <div style={{animation:"fadeUp 0.18s ease"}}>
            <SCard pal={pal} title="AI Assistant">
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.7,marginBottom:"0.85rem"}}>
                The AI features (worksheet builder, unit planner, portfolio summaries, chat assistant) need an Anthropic API key to work.
                Get one free at <span style={{color:pal.primary,fontWeight:"700"}}>console.anthropic.com</span> — costs a few cents per month for typical use.
              </div>
              <Lbl pal={pal}>API Key</Lbl>
              <input
                type="password"
                value={local.apiKey||""}
                onChange={e=>updL("apiKey",e.target.value)}
                placeholder="sk-ant-..."
                style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"monospace",marginBottom:"0.75rem"}}
                onFocus={e=>e.target.style.borderColor=pal.primary}
                onBlur={e=>e.target.style.borderColor=pal.stone}
              />
              <Lbl pal={pal}>Monthly AI call limit</Lbl>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.85rem"}}>
                {["10","25","50","100","200","Unlimited"].map(v=>(
                  <button key={v} onClick={()=>updL("aiMonthlyLimit",v)}
                    style={{padding:"0.3rem 0.7rem",borderRadius:"20px",border:`2px solid ${(local.aiMonthlyLimit||"50")===v?pal.primary:pal.stone+"50"}`,background:(local.aiMonthlyLimit||"50")===v?pal.pale:"transparent",cursor:"pointer",fontSize:"0.76rem",fontWeight:(local.aiMonthlyLimit||"50")===v?"700":"400",color:(local.aiMonthlyLimit||"50")===v?pal.primary:pal.inkM}}>
                    {v}
                  </button>
                ))}
              </div>
              <AIUsageDisplay pal={pal}/>
            </SCard>
          </div>
        )}

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
function TimeSelect({pal,value,onChange}){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.85rem",background:pal.parchm,color:pal.ink,outline:"none",cursor:"pointer"}}>
      {TIME_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
    </select>
  );
}

/* --- SCHEDULE GENERATOR --- */
function generateSchedule(family, childId) {
  const schedMode = family.scheduleMode2 || "same"; // "same" | "separate" | "mixed"
  const customSubjs = family.customSubjects || [];
  const subjectMap = Object.fromEntries([...SUBJECT_OPTIONS, ...customSubjs].map(s=>[s.id,s]));

  // Resolve which subjects and settings to use
  let subjects, sessionMins, startHour, startMin;
  if(schedMode==="separate" && childId) {
    const ch = family.children.find(c=>c.id===childId);
    const cfg = ch?.scheduleConfig||{};
    subjects    = cfg.subjects || family.subjects || ["math","reading","language","science","history"];
    sessionMins = parseInt((cfg.sessionLength||family.sessionLength||"45 min").split(" ")[0]);
    startHour   = parseInt((cfg.startTime||family.startTime||"8:00").split(":")[0]);
    startMin    = parseInt((cfg.startTime||family.startTime||"8:00").split(":")[1]||0);
  } else if(schedMode==="mixed" && childId) {
    const ch = family.children.find(c=>c.id===childId);
    const cfg = ch?.scheduleConfig||{};
    // Group subjects first, then child-specific
    const groupSubjs  = family.groupSubjects || family.subjects || [];
    const indivSubjs  = cfg.subjects || [];
    subjects    = [...new Set([...groupSubjs, ...indivSubjs])];
    sessionMins = parseInt((cfg.sessionLength||family.sessionLength||"45 min").split(" ")[0]);
    startHour   = parseInt((family.startTime||"8:00").split(":")[0]);
    startMin    = parseInt((family.startTime||"8:00").split(":")[1]||0);
  } else {
    subjects    = family.subjects || ["math","reading","language","science","history"];
    sessionMins = parseInt((family.sessionLength||"45 min").split(" ")[0]);
    startHour   = parseInt((family.startTime||"8:00").split(":")[0]);
    startMin    = parseInt((family.startTime||"8:00").split(":")[1]||0);
  }

  // Per-day subject filter: if weeklySchedule set, use only today's subjects
  if(family.weeklySchedule) {
    const todayJs = new Date().getDay(); // 0=Sun,1=Mon...6=Sat
    // Convert JS dow to our Mon-based 0-4 index
    const todayIdx = todayJs===0 ? null : todayJs===6 ? null : todayJs-1; // null=weekend
    if(todayIdx!==null) {
      const daySubjs = family.weeklySchedule[todayIdx];
      if(daySubjs===null) {
        // Day marked as off — return empty (caller handles co-op separately)
        subjects = [];
      } else if(Array.isArray(daySubjs) && daySubjs.length>0) {
        subjects = daySubjs; // use only today's subjects (already IDs)
      }
      // if daySubjs is undefined (not set yet), keep the full subjects list
    }
  }

  const isTimed = family.scheduleMode === "timed";
  let blocks = [];
  let cursor = startHour * 60 + startMin;
  const toTime = mins => {
    const h = Math.floor(mins/60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2,"0")}`;
  };

  if (family.morningGathering) {
    blocks.push({t:isTimed?toTime(cursor):"", s:family.morningGatheringName||"Morning Time", i:"🌅", c:"all", dur:30, isGroup:true});
    if(isTimed) cursor += 30;
  }

  subjects.forEach((id, idx) => {
    const subj = subjectMap[id];
    if (!subj) return;
    if (isTimed) {
      const hour = Math.floor(cursor/60);
      if (hour >= 12 && !blocks.find(b=>b.s==="Lunch")) {
        blocks.push({t:toTime(cursor), s:"Lunch", i:"🥪", c:"all", dur:45});
        cursor += 45;
      }
    }
    // Mark group subjects vs individual in mixed mode
    const isGroup = schedMode==="mixed" && (family.groupSubjects||[]).includes(id);
    const cId = schedMode==="separate"&&childId ? childId : "all";
    blocks.push({t:isTimed?toTime(cursor):"", s:subj.label, i:subj.icon, c:cId, dur:sessionMins, isGroup});
    if(isTimed) {
      cursor += sessionMins;
      if ((idx+1) % 2 === 0 && idx < subjects.length-1) {
        const breakStyle = family.breakStyle||"";
        if (!breakStyle.includes("No set")) {
          blocks.push({t:toTime(cursor), s:"Break", i:"☕", c:"all", dur:15});
          cursor += 15;
        }
      }
    }
  });

  // Apply schedule overrides: remove deleted, apply duration edits, add custom, reorder
  const overrides = family.scheduleOverrides;
  if(overrides) {
    if(overrides.removed?.length) {
      blocks = blocks.filter(b=>!overrides.removed.includes(b.s));
    }
    if(overrides.durations) {
      blocks = blocks.map(b=>overrides.durations[b.s]?{...b,dur:overrides.durations[b.s]}:b);
    }
    if(overrides.custom?.length) {
      blocks = [...blocks, ...overrides.custom];
    }
    if(overrides.order?.length) {
      const orderMap = Object.fromEntries(overrides.order.map((s,i)=>[s,i]));
      blocks.sort((a,b)=>{
        const ai = orderMap[a.s]??999;
        const bi = orderMap[b.s]??999;
        return ai-bi;
      });
    }
  }

  // Inject co-op block on the family's co-op day
  if(family.coopFreq && family.coopFreq!=="We don't do co-op" && family.coopDay) {
    const DOW_MAP = {"Monday":1,"Tuesday":2,"Wednesday":3,"Thursday":4,"Friday":5,"Saturday":6};
    const coopDow = DOW_MAP[family.coopDay];
    const todayDow = new Date().getDay();
    if(coopDow===todayDow) {
      const coopName = family.coopName||"Co-op";
      if(!blocks.find(b=>b.s===coopName||b.s==="Co-op")) {
        blocks.push({t:family.coopTime||"", s:coopName, i:"🏫", c:"all", dur:180, isCoop:true});
      }
    }
  }

  // Inject Life Ready blocks based on day of week
  if (family.lifeReady) {
    const dow = new Date().getDay();
    const freq = family.lifeReadyFreq || "monday_plus_practice";
    const topic = getLRTopicForWeek(family.children?.[0]?.grade||"5th");
    if (dow===1) {
      const insertAt = family.morningGathering ? 1 : 0;
      blocks.splice(insertAt, 0, {
        t: isTimed ? toTime(cursor) : "",
        s: LR_NAME + ": " + topic,
        i: LR_ICON,
        c: "all",
        dur: 30,
        lifeReady: true,
        isLesson: true,
        accentColor: LR_COLOR,
      });
    } else if (freq === "monday_plus_practice" && (dow===2||dow===3||dow===4)) {
      blocks.push({
        t: "",
        s: "P&C Practice: " + topic,
        i: LR_ICON,
        c: "all",
        dur: 10,
        lifeReady: true,
        isPractice: true,
        accentColor: LR_COLOR,
      });
    }
  }

  return blocks;
}


/* =======================================
   END-OF-YEAR SKILLS CHECKLIST
   Grade-appropriate mastery benchmarks
======================================= */
const EOY_SKILLS = {
  "Pre-K":[
    {cat:"Language & Literacy",  skills:["Recognizes own name in print","Knows most letters of the alphabet","Understands that print has meaning","Can retell a simple story","Speaks in complete sentences","Rhymes simple words"]},
    {cat:"Math & Numbers",       skills:["Counts to 20","Recognizes numbers 1-10","Understands more/less","Sorts objects by color, shape, size","Names basic shapes: circle, square, triangle","Understands patterns (ABAB)"]},
    {cat:"Life Skills",          skills:["Washes hands independently","Dresses with minimal help","Follows 2-step directions","Takes turns and shares","Expresses needs with words","Manages basic self-care"]},
    {cat:"Fine & Gross Motor",   skills:["Holds pencil/crayon correctly","Cuts with safety scissors","Hops on one foot","Catches a large ball","Draws basic shapes","Runs without falling"]},
  ],
  "K":[
    {cat:"Reading",              skills:["Knows all 26 letters and sounds","Blends 3-letter words (CVC)","Reads 20+ sight words","Understands left-to-right reading","Identifies beginning/ending sounds","Retells a story with beginning/middle/end"]},
    {cat:"Writing",              skills:["Writes first and last name","Writes all uppercase and lowercase letters","Writes simple sentences","Uses spaces between words","Beginning punctuation awareness","Draws and labels pictures"]},
    {cat:"Math",                 skills:["Counts to 100 by 1s and 10s","Writes numbers 0-20","Adds within 10","Subtracts within 10","Compares numbers (greater/less)","Tells time to the hour","Identifies coins"]},
    {cat:"Science & Social Studies",skills:["Knows seasons and weather","Names living vs non-living things","Understands family and community roles","Basic map concepts (near/far, left/right)","Observes and records simple experiments","Names continents and oceans (intro)"]},
  ],
  "1st":[
    {cat:"Reading",              skills:["Reads simple books fluently","Decodes unfamiliar words using phonics","Identifies main idea and details","Reads 100+ sight words","Makes predictions and inferences","Reads aloud with expression"]},
    {cat:"Writing",              skills:["Writes 3-5 sentence paragraphs","Uses capitals and end punctuation","Spells common words correctly","Writes narrative, informational, and opinion pieces","Uses descriptive words","Revises own writing"]},
    {cat:"Math",                 skills:["Adds and subtracts within 20","Understands place value to 100","Measures length with non-standard units","Tells time to half-hour","Counts money to $1","Identifies and extends patterns"]},
    {cat:"Science",              skills:["Understands the water cycle","Names properties of solids/liquids/gases","Knows basic needs of plants and animals","Conducts simple experiments","Understands push and pull forces","Identifies basic ecosystems"]},
  ],
  "2nd":[
    {cat:"Reading",              skills:["Reads chapter books independently","Uses context clues for unknown words","Compares and contrasts stories","Identifies cause and effect","Reads with fluency (90+ wpm)","Summarizes nonfiction text"]},
    {cat:"Writing",              skills:["Writes multi-paragraph pieces","Uses correct grammar and punctuation","Varies sentence structure","Writes opinion pieces with reasons","Uses transition words","Edits and proofreads own work"]},
    {cat:"Math",                 skills:["Adds and subtracts within 1000","Knows multiplication concept","Understands fractions (halves, thirds, fourths)","Tells time to 5 minutes","Counts money and makes change","Measures in inches and centimeters"]},
    {cat:"Science & Social Studies",skills:["Maps and geography basics","Understands habitats","Life cycles of plants and animals","Intro to matter and energy","Community, state, and country","Basic economics: wants vs needs"]},
  ],
  "3rd":[
    {cat:"Reading",              skills:["Reads grade-level text independently","Identifies theme and moral","Uses text evidence to support answers","Reads poetry and drama","Understands figurative language (simile, metaphor)","Reads 120+ wpm fluently"]},
    {cat:"Writing",              skills:["Writes 5+ paragraph essays","Uses research to inform writing","Writes narratives with dialogue","Correct use of commas and apostrophes","Writes to a prompt within a time limit","Cites sources (basic)"]},
    {cat:"Math",                 skills:["Multiplication facts 0-10 (mastery)","Division facts 0-10","Fractions on a number line","Area and perimeter","Reads and interprets bar graphs","Rounds to nearest 10 and 100"]},
    {cat:"Science",              skills:["Understands ecosystems and food chains","Weather vs climate","States of matter and changes","Forces and motion basics","Earth layers (intro)","Scientific method"]},
  ],
  "4th":[
    {cat:"Reading",              skills:["Reads 4th-grade chapter books","Analyzes character development","Compares multiple texts on same topic","Understands point of view","Identifies author purpose","Uses dictionary and reference tools"]},
    {cat:"Writing",              skills:["Multi-paragraph research report","Narrative writing with vivid detail","Opinion essay with counterargument","Consistent verb tense","Varied sentence structure","Basic citation format"]},
    {cat:"Math",                 skills:["Multi-digit multiplication","Long division","Equivalent fractions","Decimal notation","Line plots and data analysis","Angles and geometry basics"]},
    {cat:"Science & Social Studies",skills:["US regions and geography","American history (exploration to revolution)","Food webs and ecosystems","Electricity and circuits (basic)","Rocks and minerals","Weather patterns and prediction"]},
  ],
  "5th":[
    {cat:"Reading",              skills:["Reads complex chapter books","Determines theme using text evidence","Compares genres and structures","Understands figurative language in context","Synthesizes information from multiple sources","Critical reading of nonfiction"]},
    {cat:"Writing",              skills:["5-paragraph essay with thesis","Research paper with bibliography","Narrative with developed characters","Persuasive writing with evidence","Consistent style and voice","Peer editing skills"]},
    {cat:"Math",                 skills:["Fractions: all operations","Decimals to thousandths","Order of operations (PEMDAS)","Volume of rectangular prisms","Coordinate plane basics","Intro to negative numbers"]},
    {cat:"Science",              skills:["Cell structure basics","Earth and space systems","Energy and matter in ecosystems","Properties of matter","Simple machines","Scientific inquiry and lab reports"]},
  ],
  "6th":[
    {cat:"Language Arts",        skills:["Analyzes literature themes and symbolism","Writes argumentative essays","Uses MLA/APA citation basics","Vocabulary: roots, prefixes, suffixes","Reads informational text at grade level","Oral presentations with evidence"]},
    {cat:"Math",                 skills:["Ratios and proportions","Intro to algebra: variables and expressions","Negative numbers on number line","Statistics: mean, median, mode","Geometry: area of complex shapes","Intro to probability"]},
    {cat:"Science",              skills:["Cells and organisms","Earth and human activity","Energy and waves basics","Forces and interactions","Intro to chemistry (elements)","Lab safety and methodology"]},
    {cat:"Social Studies",       skills:["Ancient civilizations","World geography","Intro to economics","Government structures","Primary vs secondary sources","Reading historical maps"]},
  ],
  "7th":[
    {cat:"Language Arts",        skills:["Literary analysis essay","Research with multiple sources","Understands bias and perspective","Grammar: complex sentences","Reads above grade level","Debates and structured discussion"]},
    {cat:"Math",                 skills:["Proportional relationships","Multi-step equations","Geometry: circles and 3D shapes","Probability and statistics","Intro to functions","Rational numbers: all operations"]},
    {cat:"Science",              skills:["Genetics and heredity","Ecosystems and human impact","Chemical reactions (basic)","Physics: forces, energy, motion","Earth history and fossils","Experimental design"]},
    {cat:"Social Studies",       skills:["Medieval and early modern history","World religions (overview)","Economics: supply and demand","Civics and government","Geographic analysis","Historical cause and effect"]},
  ],
  "8th":[
    {cat:"Language Arts",        skills:["Literary criticism and analysis","Research paper (5+ pages)","Persuasive and argumentative writing","Understands rhetoric and logic","Advanced vocabulary in context","Public speaking and debate"]},
    {cat:"Math (Pre-Algebra/Algebra I)",skills:["Linear equations and inequalities","Systems of equations","Functions and graphs","Pythagorean theorem","Statistics and data analysis","Scientific notation"]},
    {cat:"Science",              skills:["Matter and atomic structure","Evolution and natural selection","Earth systems interactions","Energy: types and transfers","Motion, forces, and Newton laws","Lab report writing"]},
    {cat:"Social Studies",       skills:["American history through Reconstruction","Constitution and Bill of Rights","Economics: personal finance basics","Civics: branches of government","Primary source analysis","Current events and media literacy"]},
  ],
  "9th":[
    {cat:"English I",            skills:["Literary analysis of novels and poetry","Research essay with proper citations","Narrative writing with developed voice","Grammar and mechanics mastery","Vocabulary acquisition strategies","Oral presentation skills"]},
    {cat:"Math (Algebra I/II)",  skills:["Quadratic equations","Polynomial operations","Radical expressions","Graphing linear and quadratic functions","Systems of equations","Intro to statistics"]},
    {cat:"Science (Biology)",    skills:["Cell biology and genetics","Evolution by natural selection","Ecosystems and biodiversity","Biochemistry basics","Lab design and analysis","Scientific writing"]},
    {cat:"Social Studies",       skills:["World history: modern era","Geographic literacy","Global economics","Comparative government","Historical research skills","Ethical reasoning"]},
  ],
  "10th":[
    {cat:"English II",           skills:["World literature analysis","Argumentative research paper","Synthesis writing across sources","Advanced grammar and style","Speech and debate","AP-level reading comprehension"]},
    {cat:"Math (Geometry/Algebra II)",skills:["Geometric proofs","Trigonometry basics","Complex numbers","Logarithms and exponentials","Data analysis and probability","Mathematical modeling"]},
    {cat:"Science (Chemistry)",  skills:["Atomic theory and periodic table","Chemical reactions and equations","Stoichiometry basics","Gas laws","Acids and bases","Lab technique and safety"]},
    {cat:"Social Studies",       skills:["US History: Reconstruction to present","Constitutional law basics","Economics: macro and micro","Current events analysis","Primary source evaluation","College-prep writing"]},
  ],
  "11th":[
    {cat:"English III",          skills:["American literature survey","AP-level essay writing","Independent research project","Advanced vocabulary","Satire and rhetorical analysis","SAT/ACT reading prep"]},
    {cat:"Math (Pre-Calc/Calculus)",skills:["Trigonometric functions","Limits (intro)","Derivatives (basic)","Sequence and series","Vectors and matrices","AP Calculus readiness"]},
    {cat:"Science (Physics)",    skills:["Kinematics and dynamics","Work, energy, power","Waves and optics","Electricity and magnetism","Modern physics intro","College-level lab reports"]},
    {cat:"College Prep",         skills:["College research and planning","SAT/ACT preparation","Personal statement drafts","Financial aid basics","Time management and study skills","Career exploration"]},
  ],
  "12th":[
    {cat:"English IV",           skills:["British or world literature","Senior thesis or capstone project","College-level essay writing","Portfolio of writing samples","Oral defense of ideas","Independent reading program"]},
    {cat:"Math",                 skills:["Calculus or Statistics completion","Real-world math applications","Personal finance mastery","Data literacy","Mathematical communication","College placement readiness"]},
    {cat:"Science",              skills:["AP or dual-enrollment science","Independent research project","Lab methodology mastery","Science writing for public audience","Ethics in science","STEM career exploration"]},
    {cat:"Transitions",          skills:["College applications complete","Financial aid applications filed","Resume and interview skills","Adulting basics: taxes, budgeting, insurance","Driver license and independence skills","Senior reflection and goal-setting"]},
  ],
};

/* =======================================
   PREPARED & CAPABLE — PRE-WRITTEN LESSONS
   lessons.js — move here when library grows

   TONE GUIDE (follow for ALL future lessons):
   ─────────────────────────────────────────
   Pre-K / K:   Warm, imaginative, pretend-play. "Let's imagine..." "What if..."
                No scary scenarios. Focus on curiosity and safety as something fun.
   1st / 2nd:   Gentle and story-based. "One day..." "Have you ever noticed..."
                No time pressure, no graphic injuries. Make it feel like an adventure.
   3rd / 4th:   Scenario-based, slightly more real. "Imagine you are home and..."
                Can introduce mild challenge but always with a calm, problem-solving frame.
   5th / 6th:   Direct but warm. Real-world scenarios OK. "This actually happens..."
                Build confidence, not fear. Focus on "you can handle this."
   7th / 8th:   Matter-of-fact. Treat them as capable young adults.
                Can handle more serious topics with straightforward language.
   9th-12th:    Peer-level tone. Real stakes, real skills, respect their intelligence.
                "You will use this." Frame as independence and leadership.

   HOOK RULES:
   - Never use a countdown or time pressure for grades 1-4
   - Never describe graphic injuries for grades 1-3
   - Always end the hook with an open question, never a command
   - Make it feel exciting to figure out, not stressful
   ─────────────────────────────────────────
======================================= */

/* Grade tier helper */
function getLRGradeTier(grade) {
  const early  = ["Pre-K","K","1st","2nd"];
  const middle = ["3rd","4th","5th"];
  const upper  = ["6th","7th","8th"];
  const high   = ["9th","10th","11th","12th"];
  if(early.includes(grade))  return "early";
  if(middle.includes(grade)) return "middle";
  if(upper.includes(grade))  return "upper";
  if(high.includes(grade))   return "high";
  return "middle";
}

const LR_LESSON_PLANS = {

  "First aid for cuts and scrapes": {
    gradeHooks: {
      low:  "Imagine your little brother is playing outside and he falls down and scrapes his knee. He is crying and comes running to you. What do you think would help him feel better?",
      mid:  "Cuts and scrapes happen to everyone. The cool thing is that once you know what to do, you can help yourself AND the people around you. Ready to learn?",
      high: "Knowing basic wound care means you can handle minor injuries calmly instead of panicking. It is one of those skills that comes up more than you would think."
    },
    materials: ["A clean cloth or paper towels","Soap and water","Bandages in different sizes","Antibacterial ointment (optional)"],
    steps: [
      "First, take a slow breath and stay calm. When you are calm, it helps the person who is hurt feel calmer too.",
      "Rinse the scrape gently under cool running water. Let it run for a little while to wash away any dirt — there is no rush, just be gentle.",
      "Pat the skin dry with a clean cloth. Patting is gentle — rubbing can hurt more.",
      "Put a bandage over it to keep it clean. If you have ointment, a tiny bit goes on first.",
      "A grown-up should keep an eye on it over the next day or two. If it starts looking redder, feeling warmer, or getting more swollen instead of better, it is time to see a doctor."
    ],
    discussion: [
      {q:"What is the very first thing you do before helping someone who is hurt?",
       answers:["Wash your hands so you do not get germs into the wound","Take a breath and stay calm so you can think clearly","Check if they are okay and ask what happened"]},
      {q:"Can you think of a time someone helped you when you got hurt? What did they do that made you feel better?",
       answers:["They stayed calm and did not panic, which helped me calm down too","They cleaned it and put a bandage on it and told me it would be okay","They held my hand and talked to me while they helped me"]}
    ],
    challenge: "This week, find a small bag or box and build your very own mini first aid kit. Fill it with a bandage, a clean cloth, and anything else you think belongs in it. Show someone what you made!",
    tuesday: {
      low:  {title:"First Aid Kit Scavenger Hunt", activity:"Go on a hunt through your home! Can you find something that could be used as a bandage? Something to clean a wound? Something to hold pressure? Lay out everything you find and tell a grown-up what each thing is for."},
      mid:  {title:"First Aid Kit Inventory", activity:"Find your home first aid kit or gather first aid supplies. Name each item and explain what it does. Are there any gaps? Make a list and share it with a parent."},
      high: {title:"First Aid Kit Audit", activity:"Locate your home first aid kit and check every item. Is anything expired? What is missing? Write a short list of what should be restocked and show it to a parent."}
    },
    wednesday: {
      low:  {title:"Stuffed Animal Practice", activity:"Pick a stuffed animal or doll and pretend it just got a scrape. Walk through every step out loud as you help it. Rinse, pat dry, bandage. Can you remember the order without looking?"},
      mid:  {title:"Step-by-Step Walkthrough", activity:"Without looking at the lesson, explain each step of treating a cut to a family member as if you are teaching them. Walk them through it in the right order."},
      high: {title:"Teach It Back", activity:"Explain the full wound care process to a younger sibling, a parent, or record yourself explaining it. The best way to know if you really learned something is to teach it."}
    },
    thursday: {
      low:  {title:"Three Question Challenge", activity:"A grown-up asks you three questions — try to answer without any help! 1) What do you do FIRST when someone gets a scrape? 2) Should you rub the wound dry or pat it? 3) What signs mean it might need a doctor?"},
      mid:  {title:"Scenario Quiz", activity:"Have a parent give you three different injury scenarios. For each one, tell them: is this something you can handle at home, or does it need a doctor? Explain your thinking."},
      high: {title:"When to Escalate", activity:"Think through this: you treated a cut two days ago and today it looks more red and feels warm. Walk a parent through what you would do next and why."}
    }
  },

  "Calling for help — 911 practice": {
    gradeHooks: {
      low:  "Did you know there are special helpers whose whole job is to come when someone needs them? They are called 911. Today we are going to learn how to reach them — just in case we ever need to.",
      mid:  "Knowing how to call 911 is like having a superpower. Most people never need to use it — but the ones who know how feel a lot more confident. Let us practice together.",
      high: "Calling 911 sounds simple until you actually have to do it. Knowing what to say, how to stay calm, and what information to give can make a real difference."
    },
    materials: ["A phone turned off or in airplane mode for practice only"],
    steps: [
      "911 is for emergencies — when someone is hurt, in danger, or needs help right away. Not for questions or small problems.",
      "When a 911 dispatcher answers, they will ask: What is your emergency? Where are you?",
      "Practice saying your full home address out loud right now. Include the street number, street name, city, and state.",
      "Then describe what happened in simple words. You do not need all the answers — just say what you saw.",
      "Stay on the phone. The dispatcher will talk you through what to do until help arrives.",
      "You will not get in trouble for calling 911 in a real emergency. That is exactly what it is there for."
    ],
    discussion: [
      {q:"What is your full home address right now? Say it out loud together.",
       answers:["Practice saying it slowly first, then faster","Include street number, street name, city, and state","Try saying it from memory without looking — that is the real goal"]},
      {q:"Can you name three real emergencies where calling 911 would be the right thing to do?",
       answers:["Someone falls and will not wake up or respond","There is a fire or smell of smoke in the house","Someone is having trouble breathing or chest pain","A stranger is trying to get into your home"]}
    ],
    challenge: "Every morning this week, say your home address and one parent phone number out loud. By Friday it should feel completely natural.",
    tuesday: {
      low:  {title:"Address Practice", activity:"Say your home address five times out loud — street number, street name, city, state. Then have a grown-up cover their ears and you say it again. Can you say it clearly all by yourself?"},
      mid:  {title:"911 Role Play", activity:"Practice a 911 call with a parent. They play the dispatcher and ask: What is your emergency? Where are you? You stay calm and answer clearly. Switch roles and talk about what made it easier or harder."},
      high: {title:"Information Drill", activity:"Write down every piece of information a 911 dispatcher would need from you: your full address, what happened, how many people are involved, whether anyone is conscious. Memorize the list."}
    },
    wednesday: {
      low:  {title:"Is It a 911 Emergency?", activity:"Play a sorting game. A grown-up reads out situations and you decide: call 911 yes or no? Examples: someone fell and will not wake up, the cat is stuck in a tree, there is smoke coming from the kitchen. Talk about why."},
      mid:  {title:"Emergency vs. Non-Emergency", activity:"Make two lists: situations where you call 911 and situations where you call a parent or handle it yourself. Then discuss the tricky middle cases."},
      high: {title:"What Happens After You Call", activity:"Research or discuss what happens after a 911 call is made. Who responds? How fast? What should you do while waiting?"}
    },
    thursday: {
      low:  {title:"Final Address Test", activity:"Without any reminders, say your home address and one parent phone number out loud. Then answer: What do you say first when 911 picks up? What do you do after you tell them what happened?"},
      mid:  {title:"Confidence Check", activity:"Have a parent call out a scenario and you respond as if it is real — stay calm, give your address, describe what is happening. Then talk about how you felt. What would help you feel even more prepared?"},
      high: {title:"Teach Someone Else", activity:"Teach a younger sibling or family member the three things every person should know: your home address, a parent phone number, and what to say when 911 answers."}
    }
  },

  "Home fire drill": {
    gradeHooks: {
      low:  "Here is something really cool: firefighters practice getting out of buildings before there is ever a fire. That way if it ever happens for real, everyone already knows exactly what to do. We are going to do the same thing today!",
      mid:  "Fire drills are not just a school thing — families can do them too. Knowing your escape route means if a smoke alarm ever goes off, you move calmly and confidently instead of freezing up.",
      high: "Most house fires happen at night or when people are not expecting them. Families who have practiced a plan get out faster and safer. Today we are building that plan."
    },
    materials: ["Paper and pencil to draw your home layout","A meeting spot outside — pick one today"],
    steps: [
      "Every room in your home should have two ways to get out — usually a door and a window. Walk through each room together and find both exits.",
      "Draw a simple map of your home and mark every door and window that could be an exit.",
      "Pick one meeting spot outside that everyone in your family will remember — a mailbox, a big tree, the end of the driveway.",
      "Before opening a door during a fire, touch it first. If it feels warm, use your other exit.",
      "If there is smoke, stay low and crawl. Smoke rises, so the air near the floor is cleaner.",
      "Practice the whole thing with your family — from the alarm sounding to everyone at the meeting spot."
    ],
    discussion: [
      {q:"Where is your family meeting spot? Does every person in your home know it?",
       answers:["The mailbox at the end of the driveway","The big oak tree in the front yard","The neighbor’s driveway across the street — somewhere easy to see from any part of the house"]},
      {q:"Why do we walk calmly during a drill instead of run? What does practicing help us do in a real emergency?",
       answers:["Running can cause falls and injuries, especially in the dark or smoke","Practicing makes the route automatic so we do not have to think about it when we are scared","Staying calm helps everyone around you stay calm too"]}
    ],
    challenge: "Do a real family fire drill this week! Time how long it takes everyone to get to the meeting spot. Talk about what went well and anything you want to practice again.",
    tuesday: {
      low:  {title:"Exit Map Art", activity:"Draw the map of your home again — this time use green to mark safe exits and red to mark any door that might be blocked. Show a grown-up your map and explain where every exit is."},
      mid:  {title:"Two Ways Out", activity:"Walk through every room in your home together and find two ways out of each one. If a window is an exit, talk about how you would actually get out through it safely."},
      high: {title:"Nighttime Escape Plan", activity:"Walk through your nighttime escape plan — if your bedroom door is hot, which window do you use? How high is it? What would you do? Make sure your plan works in the dark."}
    },
    wednesday: {
      low:  {title:"Smoke and Door Practice", activity:"Practice the door check — before going through a pretend door, touch it first. If it is warm, act out using your other exit. Then practice crawling low through a hallway."},
      mid:  {title:"Timed Drill", activity:"Do a full fire drill today. Someone sets the alarm or yells fire, and everyone goes to the meeting spot as practiced. Time it. Then talk: was everyone calm? What can you do better next time?"},
      high: {title:"What If Scenarios", activity:"Talk through three scenarios: the hall is filled with smoke, the stairs are blocked, you cannot find a family member. For each one, discuss what you would do."}
    },
    thursday: {
      low:  {title:"Fire Safety Quiz", activity:"Answer these with a grown-up: What is our meeting spot? What do you do if a door feels warm? Which way do you go if there is smoke? How many ways out of your bedroom are there?"},
      mid:  {title:"Family Debrief", activity:"Sit down with your family and talk about: What did we do well? Is there anything we should change about our plan? Does everyone feel confident they know what to do?"},
      high: {title:"Smoke Alarm Check", activity:"Locate every smoke alarm in your home. Are they all working? When were the batteries last replaced? Research the recommended replacement schedule and share it with a parent."}
    }
  },

  "Water storage basics": {
    gradeHooks: {
      low:  "Did you know your body needs water every single day to feel good? Today we are going to learn something really smart that families do to make sure they always have enough water — even when something unexpected happens.",
      mid:  "What would you do if the water at your house stopped working for a few days? It happens sometimes during storms or emergencies. Families that are prepared do not have to worry. Let us learn why.",
      high: "Clean water is one of the most important things to have during any emergency. Most people never think about it until they need it. Today we are going to fix that."
    },
    materials: ["Clean food-grade containers or water bottles","Tap water","A permanent marker for labeling"],
    steps: [
      "The guideline is one gallon of water per person per day — for drinking and basic washing.",
      "A good starting goal is having at least three days of water stored for your whole family.",
      "Use food-grade containers — plastic water bottles or special storage jugs work great. Avoid old milk jugs because they break down over time.",
      "Fill your containers with tap water, write the date on them with the marker, and store them somewhere cool and dark.",
      "Every six months, your family can swap out the old water for fresh. A grown-up can help make sure that happens on schedule.",
      "Find out where your home water shut-off valve is. Ask a parent to show you — it is an important thing for everyone in the family to know."
    ],
    discussion: [
      {q:"Where is the water shut-off valve in your home? Go find it together!",
       answers:["Usually near the water meter — often in a basement, garage, or outside near the foundation","Sometimes under the kitchen sink or in a utility closet","Knowing this means you can stop a burst pipe fast before it floods your home"]},
      {q:"How much water does your family need for three days? Figure it out together using the one-gallon rule.",
       answers:["A family of four needs 12 gallons minimum for three days","Add extra for pets, cooking, and basic hygiene","That is roughly 12 standard water bottles per person for the whole three days"]}
    ],
    challenge: "Fill and label enough water bottles for your family for one day this week. Store them somewhere cool. You just started your emergency supply!",
    tuesday: {
      low:  {title:"Water Math", activity:"With a grown-up, figure out how many gallons your family needs for three days. Count the people in your home and multiply by three. Then count how many water bottles you actually have. Do you have enough?"},
      mid:  {title:"Container Check", activity:"Look through your home for containers that could store water. Which ones are food-grade? Which ones should not be used? Check your current water supply if you have one — when was it last refreshed?"},
      high: {title:"Water Needs Analysis", activity:"Calculate your family’s full water needs for three days including drinking, cooking, and basic hygiene. How much storage space does that require? Research what food-grade water storage containers cost."}
    },
    wednesday: {
      low:  {title:"Fill and Label", activity:"Today is the day — fill up your water containers together! Write the date on each one with a marker and find a good cool spot to store them. You are officially more prepared than most families on your street."},
      mid:  {title:"Shut-Off Valve Tour", activity:"With a parent, locate every shut-off valve in your home — the main water shut-off, under sinks, behind toilets. Practice turning one off and back on."},
      high: {title:"Emergency Water Purification", activity:"Research two ways to purify water if tap water becomes unsafe — boiling and water purification tablets. How does each work? When would you use each one?"}
    },
    thursday: {
      low:  {title:"Water Preparedness Quiz", activity:"Answer these questions out loud: How much water does one person need each day? Where did we store our water supply? Where is the water shut-off valve? What do we do if the water stops working?"},
      mid:  {title:"Three-Day Plan", activity:"Walk through what your family would actually do if water stopped working for three days. Drinking, cooking, cleaning — talk through each one. Do you have enough stored?"},
      high: {title:"Preparedness Assessment", activity:"Evaluate your family’s overall water preparedness. Do you have enough stored? Are containers properly labeled and dated? Does everyone know where the shut-off valve is? Write a short summary of strengths and one area to improve."}
    }
  },

  "Saving vs spending": {
    gradeHooks: {
      low:  "Have you ever really wanted something but did not have enough money for it yet? Today we are going to learn a trick that actually makes getting the things you want easier. It is called saving!",
      mid:  "Money is kind of like a game once you understand how it works. Today we are going to learn the rules — and once you know them, you are way ahead of most people.",
      high: "The habits you build with money right now actually shape how you handle it for the rest of your life. That is not scary — it is actually great news, because starting smart is easy."
    },
    materials: ["Three jars, envelopes, or containers","Some coins or dollar bills for practice"],
    steps: [
      "Every dollar you get can do three things: be spent now, saved for later, or given to someone who needs it.",
      "Set up three containers and label them: SPEND, SAVE, and GIVE.",
      "When you get any money, divide it before spending any of it. A classic split is 70 cents to spend, 20 to save, and 10 to give for every dollar.",
      "Saving means your money is still there when you want something bigger later. It is patient money!",
      "Over time, saved money can actually grow. Banks pay you a little extra just for keeping your money there — that is called interest."
    ],
    discussion: [
      {q:"Is there something you would like to save up for right now? How long do you think it would take?",
       answers:["A new book or toy — maybe two or three weeks of saving allowance","Something bigger like a bike or game — could take a few months","The key is picking a real goal so saving feels like it has a purpose"]},
      {q:"What is the difference between something you want and something you need?",
       answers:["Needs are things you must have to survive: food, water, shelter, clothing for the weather","Wants are things that make life more fun or comfortable but you would be okay without","A tricky example: you need shoes but you do not need the most expensive shoes"]}
    ],
    challenge: "Set up your three containers this week! Next time money comes your way, divide it before spending any. Notice how good it feels to have money in your save jar.",
    tuesday: {
      low:  {title:"Jar Setup Day", activity:"Set up the three jars together — SPEND, SAVE, GIVE. Decorate them if you like! Then look for any coins around your room. Practice dividing them using the 70-20-10 split."},
      mid:  {title:"Savings Goal", activity:"Pick something real you would like to save for. Figure out how much it costs and how long it would take to save for it using your current allowance or earnings. Write the goal on a piece of paper and put it near your save jar."},
      high: {title:"Savings Rate Experiment", activity:"Calculate: if you saved 20% of every dollar you earned for one year, how much would you have? Now try 30%. How much difference does 10 percentage points make over time?"}
    },
    wednesday: {
      low:  {title:"Needs vs Wants Sorting Game", activity:"A grown-up names things one by one and you sort them: need or want? Try: water, candy, coat in winter, video game, shoes, favorite snack, flashlight, toy. Talk about any you disagree on."},
      mid:  {title:"The Waiting Test", activity:"Think about something you wanted recently and bought right away. Did you still feel the same way about it a week later? Now think of something you saved for. How did it feel when you finally got it?"},
      high: {title:"Compound Interest Math", activity:"Look up a simple compound interest calculator online. Enter a small monthly savings amount and see what it grows to over 10 and 20 years. This is why starting early matters so much."}
    },
    thursday: {
      low:  {title:"Money Quiz", activity:"Answer out loud: What are the three jars for? Which jar gets 70 cents of every dollar? What is saving? What does it mean to give? Then share one thing about money you learned this week that surprised you."},
      mid:  {title:"This Week Review", activity:"Look at your save jar. Did you add anything this week? Talk through: what is your current savings goal, how far along are you, and what is one thing about how you think about money that is different after this week?"},
      high: {title:"Personal Finance Plan", activity:"Write a simple one-page money plan: your three-jar split percentages, your current savings goal, and one financial habit you want to build this year. Share it with a parent."}
    }
  },

  "Simple cooking — no stove recipes": {
    gradeHooks: {
      low:  "Did you know you can make a whole meal without cooking anything? It is true! Some of the yummiest snacks and lunches need zero heat. Let us explore what we can make with what is already in the kitchen.",
      mid:  "Real chefs know how to make something delicious out of whatever they have available. Today we are going to learn that skill — and the good news is, no stove or microwave needed.",
      high: "Whether the power is out, you are camping, or you just want to be more independent in the kitchen — knowing how to put together a solid no-cook meal is genuinely useful."
    },
    materials: ["Whatever is available: bread, nut butter, fruit, crackers, cheese, canned items","A butter knife and plates","Clean hands first!"],
    steps: [
      "No-cook meals are a real skill used by hikers, campers, and anyone during a power outage.",
      "A great no-cook meal has three parts: something filling like bread or crackers, something with protein like nut butter or cheese, and something fresh like fruit when available.",
      "Together, build a no-cook meal from what is in your kitchen right now. Get creative with what you find!",
      "Always wash your hands before touching food.",
      "Clean up your space when you are done — that is part of cooking too."
    ],
    discussion: [
      {q:"Look in your kitchen right now. Name five foods you could eat without cooking anything.",
       answers:["Bread, peanut butter, apples, cheese, crackers","Canned beans, fruit, yogurt, nuts, granola bars","Anything that comes ready to eat straight from the package or that is fresh fruit or vegetables"]},
      {q:"When might someone really need to eat without being able to use a stove or microwave?",
       answers:["During a power outage after a storm","When camping or hiking far from home","If the stove breaks and a repair person cannot come until tomorrow","During a natural disaster when utilities are out"]}
    ],
    challenge: "Make one full no-cook meal for yourself this week — breakfast, lunch, or dinner — completely on your own. Extra credit if you make it for someone else too!",
    tuesday: {
      low:  {title:"Pantry Exploration", activity:"With a grown-up, open the pantry and find five things that need zero cooking to eat. Then try to build the best snack plate you can using only those things."},
      mid:  {title:"No-Cook Meal Planning", activity:"Plan three different no-cook meals using only what is currently in your kitchen — breakfast, lunch, and dinner. Check that each one has something filling, something with protein, and ideally something fresh."},
      high: {title:"Emergency Meal Inventory", activity:"Do a pantry inventory with a parent. How many no-cook meals could your family actually make right now? What is missing? Make a short shopping list of shelf-stable items that would improve your options."}
    },
    wednesday: {
      low:  {title:"Solo Snack Challenge", activity:"Make a snack completely by yourself today — no help, no stove. Wash your hands first, assemble it, serve it on a plate, and clean up after. Show a grown-up when you are done."},
      mid:  {title:"Make It for Someone", activity:"Make a complete no-cook meal for another person in your family — not just yourself. Ask them beforehand if they have any food preferences. Present it nicely on a plate."},
      high: {title:"Nutrition Check", activity:"Look at the no-cook meals you planned. Does each one have a balance of protein, carbs, and something nutritious? Research what a balanced meal looks like and adjust if needed."}
    },
    thursday: {
      low:  {title:"Cooking Confidence Check", activity:"Answer these: Can you name three no-cook foods in your house right now? What do you do before touching food? What are the three parts of a good no-cook meal?"},
      mid:  {title:"Reflect and Apply", activity:"What is one no-cook meal you could make completely independently if you needed to? How would you do it if the power was out for three days? Talk through a realistic plan with a parent."},
      high: {title:"Independence Assessment", activity:"Honestly assess: could you feed yourself and one other person for three days using only no-cook meals and what is in your home right now? What is your biggest gap? Make a specific plan to address it."}
    }
  },

  "Reading a simple map": {
    gradeHooks: {
      low:  "Maps are like treasure hunt clues for real places! They show us where everything is from way up above — like a bird looking down. Today we are going to make our very own map. Ready?",
      mid:  "Before phones existed, people used paper maps to get everywhere — and it is still a really useful skill. Today we are going to learn how maps work and practice reading one.",
      high: "Navigation is one of those skills that makes you genuinely more independent. Knowing how to read a map means you can find your way anywhere, with or without technology."
    },
    materials: ["A simple printed map of your neighborhood, or draw one together","A pencil"],
    steps: [
      "A map is a bird’s-eye view — imagine looking straight down from above at the ground below.",
      "Most maps have a compass rose showing which direction is North, South, East, and West.",
      "Maps also have a legend — a small box that explains what the symbols and colors mean.",
      "Find two places on the map and trace a route between them with your finger.",
      "Practice estimating distance: if one block on the map equals one real block, how many blocks is it from your home to the nearest store?"
    ],
    discussion: [
      {q:"What are landmarks? Name three near your home that you could use to give someone directions.",
       answers:["A landmark is any distinctive thing that is easy to spot and remember — a big tree, a fire station, a park","Examples: the red barn on the corner, the school with the blue roof, the grocery store at the end of the road","Good landmarks are things that stay put and are easy to describe to someone who has never been there"]},
      {q:"If you had no phone, how would you explain to someone how to get to your house from a mile away?",
       answers:["Start from a known landmark and give turn-by-turn directions: go past the school, turn left at the stop sign...","Mention things they can see: the house is the third one after the big oak tree on the left","Describe the general direction first — go north on Main Street — then the specific turns"]}
    ],
    challenge: "Draw a map of your neighborhood from memory — your home, the nearest store, one friend or family member nearby, and at least two streets. Then compare it to a real map. How close did you get?",
    tuesday: {
      low:  {title:"Draw Your Street", activity:"Draw your street from memory — your home, your neighbors’ homes, and any landmarks you know. Then walk outside together and compare your drawing to what is really there."},
      mid:  {title:"Compass Directions Practice", activity:"Stand outside your front door. Figure out which direction is North using the sun or a compass app. Then identify what is to your North, South, East, and West. Draw it on paper."},
      high: {title:"Route Planning", activity:"Using a real map or map app in satellite view, plan the walking route from your home to somewhere one mile away. Identify three landmarks along the route that would help someone navigate without a phone."}
    },
    wednesday: {
      low:  {title:"Map Reading Adventure", activity:"Print or draw a simple map of your neighborhood. Together, find three things on the map — your home, a nearby store, and one other landmark. Trace the route from your home to each one. Which route is longer?"},
      mid:  {title:"Mental Map Challenge", activity:"Without looking at any map, draw your neighborhood from memory as accurately as you can. Then compare to a real map. What did you remember well? What surprised you?"},
      high: {title:"Navigation Without Technology", activity:"Plan how you would get to a location three miles away using only a paper map or written directions — no phone GPS. Walk or drive part of that route with a parent and navigate using only your directions."}
    },
    thursday: {
      low:  {title:"Map Quiz", activity:"Answer these: What does a map legend tell you? What is a compass rose? Which direction is usually at the top of a map? What are two landmarks near our home?"},
      mid:  {title:"Real Navigation Test", activity:"On a walk or drive with a parent, navigate using only a paper map or your own directions — no phone GPS. Afterwards, talk about what was easy and what was harder than you expected."},
      high: {title:"Navigation Confidence Review", activity:"Reflect: could you navigate to a destination three miles from home without a phone right now? What skills do you have? What would you want to practice more?"}
    }
  },

  "Needs vs wants — what do I really need?": {
    gradeHooks: {
      low:  "Here is a fun game: we are going to look at a list of things and decide — do we NEED it, or do we just WANT it? Some answers are easy and some are trickier than you think!",
      mid:  "Here is a question that sounds simple but is actually pretty interesting: what is the difference between something you need and something you want? The answer might surprise you.",
      high: "Understanding the difference between needs and wants is one of the most practical money and decision-making skills there is. It changes how you think about every purchase."
    },
    materials: ["Paper and pencil","A list of 10 to 15 everyday items to sort together"],
    steps: [
      "Needs are things required to stay alive and healthy: water, food, shelter, clothing appropriate for the weather, and safety.",
      "Wants are things that make life more comfortable or enjoyable but are not required to survive.",
      "Go through a list of items together and sort each one into NEEDS or WANTS. Some are genuinely tricky — that is the point!",
      "Here is the interesting part: most things we spend money on every day are wants. That is completely okay — the goal is just knowing the difference.",
      "When you understand needs versus wants, you make smarter choices about money, packing, and being prepared."
    ],
    discussion: [
      {q:"Is a phone a need or a want? What if it is the only way to call for help in an emergency — does that change your answer?",
       answers:["A phone for entertainment is a want — but a phone as your only way to call 911 starts to look more like a need","The situation changes the answer — this is why needs vs wants is not always black and white","This is a great example of how something can be a want most of the time and a need in a specific situation"]},
      {q:"Can you think of something you used to think was a need but is actually a want?",
       answers:["Candy or a favorite snack — we want it but we would be fine without it","A specific brand of shoes — we need shoes but not necessarily those shoes","Screen time — we want it but our body does not need it to survive"]}
    ],
    challenge: "For three days this week, before asking for or buying anything, pause and ask yourself: need or want? You do not have to change what you do — just notice. See what you discover.",
    tuesday: {
      low:  {title:"Sorting Game Round Two", activity:"Make a list of things you own or use every week. Sort each one into a NEED pile and a WANT pile. When you are done, count each pile. Are you surprised by the numbers?"},
      mid:  {title:"Personal Needs Audit", activity:"Make a list of everything you spent or asked for in the last week. Mark each one N for need or W for want. What percentage were needs? What percentage were wants?"},
      high: {title:"Emergency Pack Exercise", activity:"You have one bag and fifteen minutes to pack for a two-week emergency. List everything you would bring. Then cross out anything that is a want, not a need. What stays?"}
    },
    wednesday: {
      low:  {title:"The Three-Day Challenge", activity:"Starting today, every time you want something, stop and ask: do I need this or do I just want it? At dinner tonight, share one want and one need you spotted today."},
      mid:  {title:"Advertising Investigation", activity:"Look at three advertisements — on TV, online, or in a store. For each one, ask: is this selling a need or a want? How does the ad try to make you feel like it is a need when it might actually be a want?"},
      high: {title:"Minimalism Thought Experiment", activity:"If you had to reduce everything you own to fifty items, what would make the cut? Make a list. What did you prioritize and why?"}
    },
    thursday: {
      low:  {title:"Needs and Wants Quiz", activity:"Answer out loud: Name two things that are always needs. Name two things that are always wants. What is one thing that could be either a need or a want depending on the situation?"},
      mid:  {title:"Decision-Making Reflection", activity:"Think about a purchase or request from this week. Was it a need or a want? Did knowing the difference change how you felt about it?"},
      high: {title:"Apply It Going Forward", activity:"Write three sentences: One thing I thought was a need but is actually a want. One way understanding this changes how I think about money. One habit I want to build based on what I learned this week."}
    }
  },

  "What to do if a friend gets hurt": {
    gradeHooks: {
      low:  "Have you ever seen someone fall down and felt like you wanted to help but did not know what to do? That is a really kind feeling! Today we are going to learn some simple ways to be a good helper.",
      mid:  "Being the person who stays calm and knows what to do when someone gets hurt is a really valuable thing. It is not about being perfect — it is about being helpful. Let us learn how.",
      high: "When someone gets injured, the people around them matter a lot. Knowing how to respond — what to do and what not to do — is a skill worth having."
    },
    materials: ["Nothing needed — just your attention and a phone nearby for practice"],
    steps: [
      "The first and most important thing is to stay calm. Your calmness helps the person who is hurt feel less scared.",
      "Check if they are okay by asking clearly: are you alright? Can you hear me?",
      "If they seem seriously hurt, do not move them. Call for an adult or call 911 and stay with your friend.",
      "Tell whoever you call where you are — your location is the most important information.",
      "Keep talking to your friend in a calm, reassuring voice while help is on the way. Just being there makes a difference.",
      "If there is bleeding, you can gently hold a clean cloth against it — but never remove something already stuck in a wound."
    ],
    discussion: [
      {q:"What is the difference between a minor injury you can help with and one that needs a grown-up or doctor right away?",
       answers:["Minor: small scrapes, bruises, a stub toe — you can clean and bandage these","Needs help: the person is not responding, there is a lot of blood, they cannot move a limb normally, they hit their head hard","When in doubt, always call for an adult — it is never wrong to ask for help"]},
      {q:"Why is it important not to move someone who may have hurt their neck or back?",
       answers:["The spine protects the nerves that control everything below it — moving it wrong can cause permanent damage","A person can have a serious spine injury and still be awake and talking","The only time you move someone is if leaving them is more dangerous — like if there is a fire"]}
    ],
    challenge: "Practice saying your home address out loud five times each day this week. Fast, clear, and confident — that is the first thing anyone helping you will need to know.",
    tuesday: {
      low:  {title:"Helper Practice", activity:"With a stuffed animal or a sibling playing along, practice being a good helper. Someone pretends to fall. You check if they are okay, speak to them calmly, and decide: can I help, or do I need to get a grown-up?"},
      mid:  {title:"Scenario Practice", activity:"Take turns with a parent giving each other injury scenarios. For each one, the listener decides: handle it yourself, get an adult, or call 911? Talk through your reasoning."},
      high: {title:"Decision Framework", activity:"Build a simple mental decision tree for when a friend gets hurt: conscious or not? breathing or not? bleeding controlled or not? At each step, what is the correct action?"}
    },
    wednesday: {
      low:  {title:"Kind Words Practice", activity:"Practice saying calming things out loud: It is okay, I am right here. Help is coming. You are going to be okay. Notice how it feels to say them and to hear them."},
      mid:  {title:"Do Not Move Them — Why?", activity:"Research or discuss why you should not move someone who might have a spinal injury. What could go wrong? When would you move them anyway — like if there is immediate danger?"},
      high: {title:"Pressure and Calm", activity:"Have a parent randomly call out an emergency scenario and you respond immediately with your action plan. Do three rounds. Afterwards, talk: was your instinct to freeze, panic, or act?"}
    },
    thursday: {
      low:  {title:"Helper Quiz", activity:"Answer out loud: What is the first thing you do when someone gets hurt? What do you say to someone who is scared? When do you get a grown-up instead of helping yourself?"},
      mid:  {title:"Confidence Check", activity:"Could you stay calm if a friend got hurt right now? What would you do in the first 30 seconds? Talk through it out loud with a parent. What feels solid? What do you want to practice more?"},
      high: {title:"Teaching Moment", activity:"Teach a younger child the one most important rule when someone gets hurt: stay calm and get a grown-up or call 911. Walk them through it simply."}
    }
  },

  "Treats a bruise or bump": {
    gradeHooks: {
      low:  "Bumps and bruises happen to pretty much everyone! The good news is there is a really easy trick to help them feel better faster. It is called RICE — and no, it is not the food! Let us find out what it means.",
      mid:  "Ever wonder why people put ice on injuries? There is actually a smart reason — and it is part of a four-step system that helps your body heal faster. It is called RICE.",
      high: "RICE is the foundation of basic injury management. Athletes, coaches, and first responders all use it. Once you know it, you will use it your whole life."
    },
    materials: ["An ice pack or a bag of frozen vegetables","A thin cloth or small towel to wrap it in","A comfortable place to sit and rest"],
    steps: [
      "RICE stands for Rest, Ice, Compression, and Elevation. Each letter is one step.",
      "Rest means stop using the injured area. Give it a break.",
      "Ice means apply something cold wrapped in a cloth for a little while — not too long. Never put ice directly on skin; always keep the cloth in between.",
      "Compression means gentle pressure with a bandage or cloth can help reduce swelling. Not too tight — if it tingles it is too tight.",
      "Elevation means raising the injured area above the level of your heart when you can — like propping up a sore ankle on a pillow.",
      "See a doctor or grown-up if the pain is very bad, the area looks the wrong shape, or it gets worse instead of better."
    ],
    discussion: [
      {q:"Why do we put something cold on a bruise instead of something warm? What is the cold actually doing?",
       answers:["Cold slows down blood flow to the area, which reduces swelling and bruising","Heat does the opposite — it increases blood flow, which makes swelling worse right after an injury","After a day or two when swelling is down, warmth can actually help with stiffness — but cold comes first"]},
      {q:"What signs would tell you that a bump or bruise is actually something more serious that needs a doctor?",
       answers:["The area looks the wrong shape or is bent at a strange angle — could be a break","The pain is severe and does not get better with RICE after 20-30 minutes","The person cannot put weight on it or use the injured part at all","A bruise on the head with dizziness, confusion, or vomiting — always see a doctor for that"]}
    ],
    challenge: "Make a RICE reminder card this week. Draw a simple picture for each of the four steps — Rest, Ice, Compression, Elevation. Keep it in your first aid kit so you always remember.",
    tuesday: {
      low:  {title:"RICE Memory Game", activity:"Without looking at the lesson, can you remember what RICE stands for? Say it out loud: Rest, Ice, Compression, Elevation. Then explain each one in your own words to a grown-up."},
      mid:  {title:"RICE Practice Setup", activity:"Gather everything you would need to do RICE at home right now: where is the ice? What would you use as a cloth? What would you use as a compression bandage? Walk through the setup as if an injury just happened."},
      high: {title:"Ice vs Heat", activity:"Research: when do you use ice and when do you use heat on an injury? Write a simple rule for each and share it with your family."}
    },
    wednesday: {
      low:  {title:"RICE Demonstration", activity:"Pick a stuffed animal with a pretend hurt ankle. Walk through every RICE step out loud and in order. Explain each step as you do it."},
      mid:  {title:"When to See a Doctor", activity:"Make a list of signs that would tell you an injury needs medical attention beyond RICE. Go over your list with a parent and talk through any you are unsure about."},
      high: {title:"Sports Injury Context", activity:"Research the most common injuries in a sport you play or a common household injury. How does RICE apply? Are there any injuries where RICE does not apply?"}
    },
    thursday: {
      low:  {title:"RICE Quiz", activity:"Without any help, answer these: What does each letter in RICE stand for? Why do we wrap ice in a cloth? What does elevation mean? Then tell a grown-up the one thing about RICE you will always remember."},
      mid:  {title:"Full Scenario Walkthrough", activity:"A parent describes an injury scenario — a twisted ankle, a bumped knee, a bruised arm. You walk through the complete RICE response out loud: what you do first, second, third, fourth, and what signs would tell you it needs a doctor."},
      high: {title:"Injury Response Confidence", activity:"Reflect on the week. Could you competently treat a minor injury using RICE right now? What do you feel confident about? Is there any part you want to practice more?"}
    }
  },

  "Nature observation — what do you notice?": {
    gradeHooks: {
      low:  "Have you ever really stopped and looked at something outside — like a bug, a leaf, or a puddle? Today we are going to slow down and look at nature like a scientist. Not to write anything — just to really SEE.",
      mid:  "Scientists spend a lot of time just watching. Before they write anything down, they observe. Today we are going to practice that same skill outside.",
      high: "Observation is the foundation of science. Before hypothesis, before experiment — there is watching. Today we practice seeing things we usually walk right past."
    },
    materials: ["A magnifying glass if you have one","A piece of paper and crayons or colored pencils","Comfortable clothes to go outside"],
    steps: [
      "Head outside together — backyard, front porch, a park, or even a windowsill works.",
      "Pick one thing to look at closely. It could be a leaf, a rock, an ant, a cloud, a puddle — anything.",
      "Look at it for a full minute without talking. What colors do you see? What shapes? Does it move?",
      "Draw what you saw as carefully as you can. Young learners can draw instead of write — a detailed drawing IS science.",
      "Share what you noticed. What surprised you? What do you want to know more about?"
    ],
    discussion: [
      {q:"What is one thing you noticed that you had never paid attention to before?",
       answers:["The tiny hairs on a leaf that you can only see up close","How many different shades of brown and gray are in a single rock","The way an ant carries something three times its size without stopping","Patterns in bark or the way water beads up on leaves"]},
      {q:"Why do you think scientists spend so much time just watching before they do anything else?",
       answers:["If you rush to conclusions before really looking, you miss important details","Watching tells you what questions to ask — you cannot ask good questions about something you have not seen","The best discoveries often come from noticing something everyone else walked past"]}
    ],
    challenge: "Every day this week, find one thing outside and look at it closely for one minute. You do not have to write anything — just really look. Tell a grown-up one thing you noticed each day.",
    tuesday: {
      low:  {title:"Cloud Watching", activity:"Lie on your back outside or look out a window at the sky. What shapes do the clouds make? Draw two clouds you see today and give each one a name. Are the clouds moving? Which direction?"},
      mid:  {title:"Sketch a Living Thing", activity:"Find something living outside — a plant, a bug, a bird. Sketch it as accurately as you can. Label any parts you can identify. Note the date, time, and weather conditions. This is exactly what field scientists do."},
      high: {title:"Observation Journal Entry", activity:"Write a proper observation entry: date, time, weather, location, what you observed, what you noticed, and one question it raised for you. Be specific — not just a bird, but a small gray bird with a short beak sitting on the third branch of the oak tree."}
    },
    wednesday: {
      low:  {title:"Bug or Plant Hunt", activity:"Go outside and find either a bug or a plant to look at up close. Use a magnifying glass if you have one. Draw it as big as you can on your paper and color it carefully. How many legs? What color is it really?"},
      mid:  {title:"Before and After", activity:"Pick a spot outside. Observe it carefully now and draw or describe it. Come back to the same spot tomorrow at the same time. What changed? What stayed the same?"},
      high: {title:"Phenology Walk", activity:"Phenology is the study of seasonal changes in nature. On a walk, note any signs of the current season — what is blooming, what is dormant, what animals are active. How does what you see compare to what you would expect for this time of year?"}
    },
    thursday: {
      low:  {title:"What Did You Notice?", activity:"Share your drawings from the week. For each one, tell a grown-up: what is it? What was the most interesting thing about it? What question do you have about it? A good scientist always has more questions than answers."},
      mid:  {title:"Compare Your Observations", activity:"Look back at your sketches and notes from the week. Did anything change day to day? What patterns do you notice? What would you want to watch for another week to see what happens next?"},
      high: {title:"Nature and Preparedness Connection", activity:"Think about how observation skills connect to being prepared. How does knowing what plants are in your area help you? How does reading weather help you plan? How does noticing your environment make you more capable in it?"}
    }
  },

  "Weather watching — what does the sky tell us?": {
    gradeHooks: {
      low:  "Did you know the sky is always telling us something? Clouds, wind, sunshine, and rain are all clues about what kind of day it will be. Today we are going to learn how to read those clues!",
      mid:  "Before weather apps existed, people read the sky to know what was coming. That skill is still useful and kind of amazing. Let us learn some of what they knew.",
      high: "Weather awareness is a genuine survival skill. Knowing how to read changing conditions — sky color, wind shifts, cloud types — can keep you safe outdoors."
    },
    materials: ["A window or outdoor space to observe","Paper and crayons or pencils to draw what you see"],
    steps: [
      "Go to a window or step outside and look at the sky. What do you see right now?",
      "Clouds tell you a lot. Big puffy white clouds usually mean fair weather. Dark heavy clouds often mean rain is coming. Thin streaky clouds high up can mean a change is on the way.",
      "Wind direction matters. Notice which way the wind is blowing today. A shift in wind direction often means a weather change is coming.",
      "The color of the sky matters too. A red sky at night often means fair weather tomorrow. A red sky in the morning can mean rain or storms ahead.",
      "Together, make a simple drawing of today’s sky and predict what tomorrow’s weather might be based on what you see."
    ],
    discussion: [
      {q:"What does the sky look like right now? Based on what you learned, what do you think the weather will be tomorrow?",
       answers:["Big puffy white clouds and blue sky usually means another nice day tomorrow","Dark clouds on the horizon moving your way usually means rain is coming soon","If the wind just shifted direction, especially from south to north, that often means a change is coming"]},
      {q:"Why is it useful to be able to predict weather without a phone or app?",
       answers:["If you are camping, hiking, or somewhere with no signal, you need to read the sky yourself","It helps you make better decisions: should we leave now before that storm hits?","Even with a phone, the sky right in front of you is more accurate than a forecast for the whole region"]}
    ],
    challenge: "Every day this week, look at the sky in the morning and make a prediction: sunny, cloudy, or rainy? Check back at the end of the day to see how you did. How many days were you right?",
    tuesday: {
      low:  {title:"Cloud Shapes", activity:"Look at the clouds outside right now. Draw what you see. Do any look fluffy and white? Flat and gray? Thin and wispy? Each type has a name and means something different. Fluffy white ones usually mean a nice day ahead!"},
      mid:  {title:"Cloud Types", activity:"Research the three main cloud types: cumulus, stratus, and cirrus. Draw an example of each and write one word about what weather each one usually brings. Then look outside — which type do you see today?"},
      high: {title:"Weather Patterns", activity:"Research the weather patterns typical for your region at this time of year. What fronts commonly pass through? How do local geography features affect your weather?"}
    },
    wednesday: {
      low:  {title:"Weather Drawing", activity:"Go outside or look out the window and draw today’s weather as carefully as you can. Is it sunny, cloudy, windy, or rainy? Add details — how many clouds, what color the sky is, whether the trees are moving. Date your drawing."},
      mid:  {title:"Prediction Practice", activity:"Look at the sky right now and make a prediction for tomorrow’s weather — not using any apps, just what you observe. Write it down. Tomorrow, check your prediction. How did your sky-reading compare to the actual forecast?"},
      high: {title:"Outdoor Safety and Weather", activity:"Research what to do outdoors if a storm comes up suddenly — whether hiking, biking, or at a sports field. What are the warning signs? What is the right action?"}
    },
    thursday: {
      low:  {title:"Weather Week Wrap-Up", activity:"Look at your weather drawings and predictions from this week. How many days did you guess right? What sky clues helped you the most? Draw your favorite sky from the week."},
      mid:  {title:"Weather and Preparedness", activity:"Talk through: how does knowing the weather ahead of time help you be prepared? Think about what to wear, what to bring, whether to go outside, and when to take shelter."},
      high: {title:"Long-Range Preparedness", activity:"Research what weather events are most common in your region. For each one: what are the warning signs? What is the preparation checklist? What would your family do?"}
    }
  },

  "Basic knot — square knot": {
    gradeHooks: {
      low:  "Have you ever tried to tie something and it kept coming undone? Today we are going to learn a knot that actually stays tied. It is called a square knot and once you know it, you will use it forever.",
      mid:  "One of the most useful things you can learn with your hands is how to tie a proper knot. The square knot has been used by sailors, scouts, and everyday people for thousands of years. Let us learn it.",
      high: "Knot tying is a foundational outdoor and practical skill. The square knot is the starting point — once you have it, every other knot builds from here."
    },
    materials: ["Two pieces of rope, string, or shoelaces — different colors if possible","A flat surface to practice on"],
    steps: [
      "Hold one end of rope in each hand. The two-color trick makes this much easier to learn.",
      "Cross the right rope over the left rope and pull it underneath — just like the first step of tying your shoes.",
      "Now cross the left rope over the right rope and pull it through — this is the opposite of step two.",
      "Pull both ends firmly. A square knot lies flat and stays tight under pressure.",
      "Check your knot: if it looks like a pretzel it is correct. If it looks like a loop, you crossed the same direction twice — that is a granny knot and it slips. Try again!",
      "Practice until you can tie it smoothly without thinking about it."
    ],
    discussion: [
      {q:"Where do you think you might use a knot like this in real life? Think of as many situations as you can.",
       answers:["Tying a bag closed so things do not fall out","Bundling sticks or rope together for camping","Securing a tarp or tent in the wind","Tying something onto a bike or roof rack so it does not fall off","First aid — tying a bandage or sling in place"]},
      {q:"Why is it important that a knot stays tied when you need it to?",
       answers:["If a knot holding a load slips, things can fall and hurt someone","In first aid, a loose bandage does not apply pressure and does not help","In camping or emergencies, a failed knot when you really need it could be dangerous","A knot that holds gives you confidence — you know you can count on it"]}
    ],
    challenge: "Tie ten square knots this week — two a day. By Friday it should feel automatic. Bonus: teach someone else how to do it. Teaching is the best way to really learn something.",
    tuesday: {
      low:  {title:"Knot Practice Round Two", activity:"Get your rope and practice five square knots in a row. Say the steps out loud as you do them: right over left, left over right. Can you do it without looking at any reminders? Check each knot — does it lie flat?"},
      mid:  {title:"Knot Speed Practice", activity:"Time yourself tying a square knot. Write down your time. Try again five times. Did you get faster? See if you can get it under 10 seconds by the end of the week."},
      high: {title:"Knot Variations", activity:"Research the reef knot, the figure-eight knot, and the bowline. How is each one different from the square knot? When would you use one over another?"}
    },
    wednesday: {
      low:  {title:"Tie Something Real", activity:"Find something in your house that needs to be tied or bundled together — a bag, some sticks, a rolled-up blanket. Use your square knot to tie it. Does the knot hold? Show a grown-up what you did."},
      mid:  {title:"Practical Application", activity:"Use a square knot to solve a real problem today: bundle something together, close a bag, secure an object. Notice how it holds compared to just wrapping string around something."},
      high: {title:"Load Testing", activity:"Tie a square knot in a piece of rope and test how much weight it holds before slipping. Compare it to a granny knot. Research why the square knot is more secure."}
    },
    thursday: {
      low:  {title:"Teach the Knot", activity:"Teach someone in your family how to tie a square knot. Walk them through every step. Did you remember it all without looking? If they get confused, try explaining it a different way."},
      mid:  {title:"Eyes Closed Challenge", activity:"Try tying a square knot with your eyes closed. This builds real muscle memory — which means your hands know what to do even when you are not thinking about it."},
      high: {title:"Knot Knowledge Review", activity:"Without any reference, demonstrate a square knot, explain why the granny knot is weaker, and name one real situation where each knot you learned this week would be the right choice."}
    }
  }

};

function getLessonPlan(topic, grade) {
  if(LR_LESSON_PLANS[topic]) {
    const plan = LR_LESSON_PLANS[topic];
    let hook = plan.hook || "";
    if(plan.gradeHooks) {
      const g = grade||"5th";
      const low  = ["Pre-K","K","1st","2nd"];
      const high = ["9th","10th","11th","12th"];
      hook = low.includes(g) ? plan.gradeHooks.low
           : high.includes(g) ? plan.gradeHooks.high
           : plan.gradeHooks.mid;
    }
    return {...plan, hook};
  }
  const tier = getLRGradeTier(grade||"5th");
  const hooks = {
    early:  "Here is something fun to think about: what do you already know about "+topic+"? You might know more than you think!",
    middle: "Before we start — what do you already know about "+topic+"? Take a guess. There are no wrong answers.",
    upper:  "Quick thought before we begin: when do you think someone might actually need to know about "+topic+"? Think of a real situation.",
    high:   "Here is a question worth sitting with: how would knowing "+topic+" make you more independent or better prepared for real life?",
  };
  const challenges = {
    early:  "Find one way to try or practice this topic this week. Ask a parent to do it with you.",
    middle: "Find one real-life way to use or observe this skill before next week.",
    upper:  "Apply this skill once in real life this week. Notice what you learn from actually doing it.",
    high:   "Use this skill or knowledge in a real situation this week. Be ready to share what happened.",
  };
  return {
    hook: hooks[tier],
    materials: ["Pen and paper for notes","Any household items relevant to this topic"],
    steps: [
      "Start by talking about what this topic is and why real people find it useful.",
      "Can you think of a time this skill would have helped someone you know?",
      "Look it up together: find one real story or example related to this topic.",
      "Try one hands-on way to practice or explore what you learned.",
      "Wrap up: each person shares one thing they will remember from today."
    ],
    discussion: [
      "How does knowing this make you safer, smarter, or more capable?",
      "Who else in your life might benefit from learning this too?"
    ],
    challenge: challenges[tier],
  };
}

