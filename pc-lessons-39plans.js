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
//  - getLRYearStart, getLRSchoolWeek, getLRTopicForWeek, getLRWeekNumber, getLRUpcomingTopics
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

const LR_LESSON_PLANS = {

  "Call 911 — when and how": {
    gradeHooks: {
      low:  "911 is a very special phone number that connects you to people whose whole job is to help when something is really wrong. Today we learn exactly when to call it and what to say.",
      mid:  "Most people never need to call 911. But the ones who have practiced exactly what to say are the ones who can actually help when it counts. Today we build that readiness.",
      high: "Making an effective 911 call under stress requires preparation. The information you provide in those first 30 seconds determines how quickly the right help arrives."
    },
    materials: ["A phone for practice — do not actually dial 911", "Paper to write your address"],
    steps: [
      "911 is for true emergencies: fire, medical emergency, or a crime happening right now.",
      "For non-emergencies use the local police non-emergency number — 911 is for life-threatening situations only.",
      "When 911 answers, state your emergency first: There is a fire at my house.",
      "Then give your address — street number, street name, city.",
      "Stay calm and answer every question the dispatcher asks — they are helping you.",
      "Do not hang up until the dispatcher tells you to."
    ],
    discussion: [
      {q:"What are three situations where you should call 911?",
       answers:["Someone is unconscious, not breathing, or having a heart attack","A fire that is not contained or is spreading","A crime happening right now — like a break-in in progress"]},
      {q:"What should you do if you accidentally call 911?",
       answers:["Do not hang up — that triggers a welfare check and emergency services may be dispatched anyway","Stay on the line and tell them it was an accident","Hanging up on a 911 call makes dispatchers think something is wrong"]}
    ],
    challenge: "Write your home address on a small card and put it near every phone in your house. Practice saying it out loud twice every day this week.",
    tuesday: {
      low:  {title:"Address practice", activity:"Say your home address out loud five times — street number, street name, city. Then have a grown-up ask you for it randomly later today."},
      mid:  {title:"Role play the call", activity:"Role play a 911 call with a parent acting as the dispatcher. Practice staying calm and giving clear information for three different scenarios."},
      high: {title:"911 system deep dive", activity:"Research how 911 works: how does the dispatcher know your location from a cell phone vs a landline? What is enhanced 911? Write a short summary."}
    },
    wednesday: {
      low:  {title:"When not to call", activity:"A parent reads five scenarios. You decide: call 911, call a parent, or handle it yourself? Scenarios: scraped knee, car accident outside, feeling sick, someone unresponsive, a small argument."},
      mid:  {title:"Text to 911", activity:"Research whether your county or city has text-to-911 capability. When would texting be better than calling? What do you lose when you text instead of call?"},
      high: {title:"Dispatcher perspective", activity:"Research what 911 dispatchers do and what training they receive. What information do callers give that is most helpful — and most unhelpful?"}
    },
    thursday: {
      low:  {title:"911 quiz", activity:"When do you call 911? What is the first thing you say? What do you do if you called by accident? Say your address right now without looking."},
      mid:  {title:"Full scenario", activity:"A parent describes a detailed emergency scenario. You walk through the full 911 call: what you say, what information you give, and what you do while waiting for help."},
      high: {title:"Family emergency card", activity:"Create a family emergency information card: home address, nearest cross street, family members names and any medical conditions, and the local non-emergency police number."}
    }
  },

  "My home address and phone number": {
    gradeHooks: {
      low:  "Knowing your home address and a phone number to call for help is one of the most important things you can memorize. Today we practice until it is stuck in your head forever.",
      mid:  "In an emergency when your phone is dead or lost, knowing key information by heart rather than relying on a device could be critical. Today we make sure that information is locked in.",
      high: "Personal information memorization is a genuine safety skill. Knowing your address, key phone numbers, and emergency contacts without any device is part of being truly prepared."
    },
    materials: ["A small index card", "A pen"],
    steps: [
      "Your full home address includes: street number, street name, city, state, and zip code.",
      "You should know at minimum one parent phone number completely by heart — not just saved in your phone.",
      "Practice saying your address out loud until you can say it instantly, clearly, and without hesitating.",
      "Make an emergency contact card with your address and two phone numbers. Keep it in your backpack.",
      "911 dispatchers need your address immediately — a hesitant or wrong address costs precious time.",
      "Test yourself: cover your phone and say your address and one phone number right now."
    ],
    discussion: [
      {q:"Why is it important to know your address by heart even if it is saved in your phone?",
       answers:["Phones can be dead, lost, broken, or inaccessible in an emergency","When you are scared or hurt, reading off a phone takes time — knowing it by heart is instant","A 911 dispatcher needs your address in the first 10 seconds"]},
      {q:"What other information would be important to know by heart besides your address?",
       answers:["At least one parent or guardian phone number","The name of a trusted neighbor or nearby family member","Your school name and the street it is on"]}
    ],
    challenge: "Memorize your home address and one parent phone number completely this week. Test yourself every morning without looking at your phone.",
    tuesday: {
      low:  {title:"Say it out loud", activity:"Say your home address out loud ten times in a row. Then say one parent phone number ten times. Tonight before bed, say both again without looking."},
      mid:  {title:"Make the card", activity:"Write your emergency contact card: full home address, two parent phone numbers, and one other trusted adult. Laminate it or put it in a plastic sleeve and keep it in your backpack."},
      high: {title:"Full info audit", activity:"Write down every piece of personal information you should know by heart: address, phone numbers, school address, nearest cross street, blood type if known. How many did you already know? Fill in the gaps."}
    },
    wednesday: {
      low:  {title:"Quiz yourself", activity:"Without looking at anything, say your address and one phone number to a grown-up. Did you get them right? Practice the ones you missed ten more times."},
      mid:  {title:"Phone number memorization", activity:"How many phone numbers do you know by heart right now — not stored in your phone, but actually in your memory? Research techniques for memorizing numbers: chunking, rhythm, repetition."},
      high: {title:"Teach your household", activity:"Quiz every member of your household: can they recite their home address and each other phone numbers from memory? Who knew it, who did not? Make a plan to fill the gaps."}
    },
    thursday: {
      low:  {title:"Final test", activity:"A grown-up asks you for your address and phone number at a random moment today — not when you expect it. Can you answer instantly? Keep practicing until you can."},
      mid:  {title:"Scenario drill", activity:"Practice this scenario: you are at a store, something happened, and a store employee asks for your address and parent phone number. Say both out loud calmly and clearly right now."},
      high: {title:"Emergency info system", activity:"Design a complete household emergency information system: what everyone knows by heart, what is written on cards, where digital backups are stored, and how you update it when things change."}
    }
  },

  "Fire escape plan practice": {
    gradeHooks: {
      low:  "If there was a fire in your home, would you know exactly how to get out? Today we make a plan so everyone in your family knows exactly what to do.",
      mid:  "A fire escape plan only works if everyone has practiced it. Today we build the plan and commit to actually drilling it.",
      high: "Fire escape planning involves more than just knowing the exits. It requires understanding smoke behavior, door-check protocol, and accountability at the meeting point."
    },
    materials: ["Paper to draw a floor plan", "Pencil"],
    steps: [
      "Draw a simple floor plan of your home showing all rooms, doors, and windows.",
      "For every room, identify two ways out — usually a door and a window.",
      "Choose a meeting point outside that everyone can reach from any exit: a specific tree, mailbox, or neighbor house.",
      "Make sure every window that is a possible escape route can actually be opened and is not painted shut.",
      "Practice the routes: walk them slowly first, then fast.",
      "The rule once you are out: never go back in. Wait at the meeting point and call 911."
    ],
    discussion: [
      {q:"Why do you need two escape routes from every room and not just one?",
       answers:["Fire can block any single route — smoke and flames can cut off a hallway in seconds","A second route through a window ensures you are never truly trapped","Professional fire safety guidelines always require two exits for exactly this reason"]},
      {q:"Why should you never go back into a burning building even to get a pet or a possession?",
       answers:["Conditions inside change in seconds — what was passable becomes impassable almost instantly","Smoke incapacitates within minutes even without visible flames","Your job is to be at the meeting point so firefighters know who is safe and who needs rescue"]}
    ],
    challenge: "Draw your home fire escape plan this week and do a real timed drill with your family. Aim for everyone outside and at the meeting point within two minutes.",
    tuesday: {
      low:  {title:"Draw the plan", activity:"Draw a simple map of your home. Mark every door and window in every room. Draw arrows showing two ways out of each room. Circle your outdoor meeting point."},
      mid:  {title:"Window check", activity:"Go to every window in your home that is a possible escape route. Can it open? Can you open it quickly? Is there anything blocking it inside or outside?"},
      high: {title:"Smoke and door protocol", activity:"Research the door-check protocol: why you feel a door before opening it, what a hot door means, and why keeping bedroom doors closed at night slows fire spread."}
    },
    wednesday: {
      low:  {title:"Walk the routes", activity:"Walk every escape route in your plan with a grown-up. Time how long it takes to get from each bedroom to the outdoor meeting point. Which route is fastest from your room?"},
      mid:  {title:"Run the drill", activity:"Do a real fire drill today. A parent calls out fire and starts a timer. Everyone goes to the meeting point by their routes. How long did it take? What was confusing?"},
      high: {title:"Night scenario", activity:"Research how a night fire drill differs from a daytime one: closed doors, low visibility, disorientation from sleep. What adaptations does your plan need for nighttime?"}
    },
    thursday: {
      low:  {title:"Escape plan quiz", activity:"How many ways out of your bedroom? Where is your family meeting point? What do you do when you get there? What do you never do once you are out?"},
      mid:  {title:"Plan posted", activity:"Print or neatly redraw your escape plan and post it somewhere every family member will see it. Schedule your next drill in six months."},
      high: {title:"Full review", activity:"Review your escape plan for gaps: are smoke detectors tested and working, are routes clear of obstructions, does everyone know the meeting point, and does everyone know not to go back in?"}
    }
  },

  "What is a first aid kit?": {
    gradeHooks: {
      low:  "A first aid kit is a special box filled with things that help you take care of minor injuries right away. Today we learn what goes inside one and why each thing matters.",
      mid:  "A first aid kit is only useful if you know what is in it, where it is, and how to use each item. Today we build that knowledge.",
      high: "Understanding what a first aid kit contains — and more importantly, what its limitations are — is foundational to real emergency preparedness."
    },
    materials: ["Your home first aid kit, or paper to make a checklist"],
    steps: [
      "A first aid kit contains supplies to treat minor injuries and stabilize more serious ones until medical help arrives.",
      "Basic contents: adhesive bandages in multiple sizes, gauze pads, medical tape, antiseptic wipes, antibiotic ointment, tweezers, scissors, gloves, and a thermometer.",
      "Also important: a first aid manual, any personal medications, and an emergency contact list.",
      "Every home should have at least one kit. Every car should have one. Go-bags should have one.",
      "A kit you cannot find or that has expired items is not actually useful — location and maintenance matter.",
      "Knowing how to use every item in your kit is more important than having the item."
    ],
    discussion: [
      {q:"Why are disposable gloves one of the most important items in a first aid kit?",
       answers:["Gloves protect both the helper and the injured person from infection","Blood and body fluids can transmit disease — gloves are the first line of protection","Any first aid involving blood should always start with putting on gloves"]},
      {q:"What is the difference between what a first aid kit can handle and what needs professional medical care?",
       answers:["First aid handles: minor cuts, scrapes, small burns, sprains, splinters, minor allergic reactions","Needs professional care: deep wounds, suspected fractures, head injuries, chest pain, difficulty breathing, signs of infection","A first aid kit buys time and stabilizes — it is not a substitute for a doctor"]}
    ],
    challenge: "Find every first aid kit in your home and car this week. Check the contents against a standard list. What is missing? What is expired? Restock what needs restocking.",
    tuesday: {
      low:  {title:"Kit inventory", activity:"Open your home first aid kit with a grown-up. Name every item inside. What is each one for? Are there things in there you do not recognize?"},
      mid:  {title:"Build a kit", activity:"Research a complete basic first aid kit list. Compare it to what your family has. Write a shopping list for everything that is missing or expired."},
      high: {title:"Tiered kits", activity:"Research the difference between a home first aid kit, a car kit, a go-bag kit, and a wilderness first aid kit. What additional items does each tier require and why?"}
    },
    wednesday: {
      low:  {title:"Where are all the kits?", activity:"Find every first aid kit in your home and car. Write down where each one is. Make sure every family member knows all the locations."},
      mid:  {title:"Use the items", activity:"Practice using three items from your first aid kit: apply an adhesive bandage correctly, wrap a gauze pad and secure it with tape, and put on disposable gloves."},
      high: {title:"Expiration audit", activity:"Go through your home first aid kit and check every expiration date. What has expired? What does it mean for an item to expire — does expired mean useless or just less effective?"}
    },
    thursday: {
      low:  {title:"First aid kit quiz", activity:"What are three things in a first aid kit? Why do we wear gloves? Where is the first aid kit in your home right now? Where is the one in your car?"},
      mid:  {title:"Restock and review", activity:"Based on your audit, restock your kit this week. Set a calendar reminder to check it again in six months."},
      high: {title:"IFAK research", activity:"Research individual first aid kits (IFAKs) used by military and emergency responders. What do they contain that a standard kit does not? What skills are required to use them?"}
    }
  },

  "Healthy foods vs junk foods": {
    gradeHooks: {
      low:  "Some foods help your body grow strong and have energy. Other foods taste good but do not give your body what it needs. Today we become food detectives and figure out which is which!",
      mid:  "You have probably heard that some foods are healthy and some are not. But do you actually know why? Today we go deeper and learn what food actually does inside your body.",
      high: "Nutrition is one of the most misunderstood topics in modern life. Today we cut through the noise and build a clear, science-based framework for understanding what you eat and why it matters."
    },
    materials: ["A few food items or packages from your kitchen"],
    steps: [
      "Your body needs six things from food: carbohydrates for energy, protein to build and repair, fat for brain function, vitamins, minerals, and water.",
      "Whole foods — fruits, vegetables, whole grains, beans, eggs, meat, fish — give your body what it needs.",
      "Ultra-processed foods — chips, sodas, packaged snacks — are engineered to taste good but often lack real nutrients.",
      "No food is truly forbidden — but some should be occasional, not daily.",
      "Read labels: ingredients are listed by weight, largest first. If sugar or refined flour is in the first three ingredients of a snack, it is a treat.",
      "The simplest rule: eat mostly foods that existed 100 years ago, in forms your great-grandmother would recognize."
    ],
    discussion: [
      {q:"Why do ultra-processed foods taste so good if they are not that nutritious?",
       answers:["They are engineered by food scientists to hit the perfect combination of salt, sugar, and fat that triggers the brain reward system","That combination does not occur naturally in whole foods — it is designed to make you want more","Understanding this is not about avoiding all processed food — it is about knowing what you are eating and why"]},
      {q:"What is one small change to your eating habits that would have a real positive impact over time?",
       answers:["Adding one vegetable to one meal per day — small and sustainable","Switching from soda to water as the default drink","Choosing a piece of fruit instead of a packaged snack most of the time"]}
    ],
    challenge: "This week, pick one meal per day and make sure it includes at least one vegetable or fruit you actually enjoy. Just one meal. Consistency beats perfection.",
    tuesday: {
      low:  {title:"Food sorting", activity:"Look at five foods in your kitchen. For each one, decide: does this help my body or is it more of a treat? Sort them into two groups. Talk about any you are not sure about."},
      mid:  {title:"Label reading", activity:"Pick three packaged foods from your kitchen. Read the ingredients list for each. What are the first three ingredients? Is there added sugar? How many ingredients do you not recognize?"},
      high: {title:"Macronutrient breakdown", activity:"Research the three macronutrients: carbohydrates, protein, and fat. What does each do in the body? Design a meal that includes all three in good proportions."}
    },
    wednesday: {
      low:  {title:"Rainbow plate", activity:"Try to eat five different colors of food today — fruits and vegetables each count. At the end of the day, list every color you ate."},
      mid:  {title:"Marketing vs nutrition", activity:"Compare a food as it is advertised vs what the label actually shows. Does the label back up the marketing? What does the label tell you that the front of the package does not?"},
      high: {title:"Ultra-processed food research", activity:"Research ultra-processed foods: how are they defined, how prevalent are they in the average American diet, and what does the research say about their long-term health effects?"}
    },
    thursday: {
      low:  {title:"Nutrition quiz", activity:"What are two foods that help your body grow strong? What is one food that is more of a treat? What color foods did you eat this week? Name your favorite healthy food."},
      mid:  {title:"One change", activity:"Based on what you learned this week, name one specific, realistic change you could make to how you eat. Not a big overhaul — just one thing. Make it concrete."},
      high: {title:"Practical nutrition", activity:"Plan three days of meals that are nutritionally solid, affordable, and actually taste good. Would you actually eat this? Is it balanced?"}
    }
  },

  "Washing hands properly": {
    gradeHooks: {
      low:  "Did you know that washing your hands the right way is one of the most powerful things you can do to stay healthy? Most people do not wash long enough. Today we learn how to do it right.",
      mid:  "Handwashing prevents the spread of more disease than almost any other single action. Today we look at the science of why it works and make sure your technique is actually effective.",
      high: "The germ theory of disease and the evidence base for handwashing is one of the most compelling stories in medical history. Today we connect the history to the practical habit."
    },
    materials: ["Soap and a sink"],
    steps: [
      "Wet your hands with clean running water — warm or cold both work.",
      "Apply soap and lather by rubbing your hands together. Get the backs of your hands, between your fingers, and under your nails.",
      "Scrub for at least 20 seconds — that is about the time it takes to hum Happy Birthday twice.",
      "Rinse thoroughly under running water.",
      "Dry with a clean towel or air dry.",
      "Wash hands: before eating, after using the bathroom, after touching animals, after coughing or blowing your nose, and after being in public places."
    ],
    discussion: [
      {q:"Why does the scrubbing time matter? Is a quick rinse not enough?",
       answers:["Soap works by surrounding and lifting germs off your skin — that process takes physical scrubbing time","A quick rinse removes some germs but leaves most still on your hands","20 seconds of scrubbing is the minimum shown by research to be effective"]},
      {q:"When is hand sanitizer a good substitute for soap and water, and when is it not?",
       answers:["Sanitizer works well when hands are not visibly dirty and you do not have access to a sink","Sanitizer does not work against all types of germs — soap and water removes more types including some that resist alcohol","If hands are visibly dirty, oily, or you have been around food, soap and water is the only effective option"]}
    ],
    challenge: "Every time you wash your hands this week, count to 20 while scrubbing. Notice how much longer that feels than your normal washing. Make 20 seconds your new normal.",
    tuesday: {
      low:  {title:"Practice the steps", activity:"Wash your hands following every step while a grown-up watches and times you. Did you scrub for 20 seconds? Did you get between your fingers and under your nails?"},
      mid:  {title:"Germ experiment", activity:"Research the glitter experiment: coat your hands in glitter (representing germs) and then try to wash it off with just a quick rinse. Then wash properly for 20 seconds. What is the difference?"},
      high: {title:"History of handwashing", activity:"Research Ignaz Semmelweis and the history of handwashing in medicine. What did he discover, why was he initially dismissed, and how did his work eventually change medicine?"}
    },
    wednesday: {
      low:  {title:"When to wash", activity:"Make a list of every time today that you should wash your hands. At the end of the day, check: did you wash every time? Which ones did you miss?"},
      mid:  {title:"Soap vs sanitizer", activity:"Research when hand sanitizer is and is not effective. Make a simple chart: for each type of germ and situation, which is the better choice — soap and water or sanitizer?"},
      high: {title:"Public health impact", activity:"Research the public health impact of handwashing globally. What percentage of diarrheal disease could be prevented by handwashing? What about respiratory infections? What barriers exist to handwashing adoption?"}
    },
    thursday: {
      low:  {title:"Handwashing quiz", activity:"How long should you scrub your hands? Name three times you should wash your hands. What do you use to wash them? Go wash your hands right now using perfect technique."},
      mid:  {title:"Habit check", activity:"Honestly: do you always wash your hands when you should? What is the situation where you most often skip it? What would make you more consistent?"},
      high: {title:"Teach it", activity:"Teach a younger child proper handwashing technique. Make it memorable — use the Happy Birthday song, a rhyme, or a visual. How do you make a 20-second habit stick for a young child?"}
    }
  },

  "Being a good neighbor": {
    gradeHooks: {
      low:  "Do you know the people who live near you? Neighbors are the people who are closest to us when we need help. Today we talk about what it means to be a good neighbor.",
      mid:  "Strong neighborhoods are not just nice to live in — they are actually safer and more resilient in emergencies. The connections you build with neighbors before something goes wrong make the difference when it does.",
      high: "Social capital — the trust and relationships within a community — is one of the strongest predictors of how well a neighborhood recovers from disasters and hardship."
    },
    materials: ["Paper to write or draw on"],
    steps: [
      "Know your neighbors by name — at minimum the ones on either side and across the street.",
      "Say hello. Simple, consistent friendliness builds trust over time.",
      "Notice when something seems off — an uncollected newspaper, unusual silence.",
      "Help without being asked when you can: bring in a garbage bin, offer to help carry something heavy.",
      "In an emergency, neighbors are often the first responders. Know who has medical training or who might need extra help.",
      "Community is built in ordinary moments, not just crises."
    ],
    discussion: [
      {q:"Why does knowing your neighbors make your neighborhood safer?",
       answers:["Neighbors who know each other notice when something is unusual","People are more likely to help someone they recognize than a stranger","In an emergency, you need to be able to knock on a door and trust that someone will answer"]},
      {q:"What makes it hard to get to know neighbors in modern life, and how do you overcome that?",
       answers:["Busy schedules, technology, and privacy norms all work against neighborhood connection","The fix is usually small and simple — a wave, a brief conversation, helping with something visible","You do not have to be best friends with your neighbors — you just need enough familiarity to trust each other in a pinch"]}
    ],
    challenge: "This week, learn the name of one neighbor you do not already know. Just the name. A wave and an introduction is enough.",
    tuesday: {
      low:  {title:"Neighbor map", activity:"Draw a simple map of your street. Label the houses of neighbors you know by name. How many do you know? Pick one blank house — that is your goal for the week."},
      mid:  {title:"Community assets", activity:"Make a list of the neighbors or community members you know who have useful skills or resources: medical, mechanical, gardening, languages. How did you find out about these skills?"},
      high: {title:"Social capital research", activity:"Research the concept of social capital and its relationship to community resilience. What does the research show about how neighborhood connectedness affects outcomes in disasters?"}
    },
    wednesday: {
      low:  {title:"Do something kind", activity:"Do one kind thing for a neighbor today without being asked — wave, hold a door, pick something up. Report back: what did you do and how did it feel?"},
      mid:  {title:"Emergency network thinking", activity:"Think through your neighborhood as a disaster response network. Who would you go to if the power was out for three days? Who might need help? Map it out."},
      high: {title:"Design a connection", activity:"Design one practical way your neighborhood could become more connected — a neighborhood app, a block party, a mutual aid group. Research whether something like this already exists in your area."}
    },
    thursday: {
      low:  {title:"Neighbor quiz", activity:"Name three neighbors by name. What is one thing you could do to be a good neighbor this week? Why is it helpful to know the people near your home?"},
      mid:  {title:"Reflect on your community", activity:"How well do you know your neighbors? How well does your family know them? What is one concrete step your family could take to strengthen those connections?"},
      high: {title:"The case for community", activity:"Write a short argument for why investing time in knowing your neighbors is one of the highest-return preparedness activities a family can do."}
    }
  },

  "My body — what hurts and what to do": {
    gradeHooks: {
      low:  "Your body talks to you all the time! Pain and discomfort are your body telling you that something needs attention. Today we learn how to listen to your body and know what to do when something hurts.",
      mid:  "Knowing how to describe symptoms clearly and understand what your body is telling you is a foundational health skill. Today we build that vocabulary and awareness.",
      high: "Body literacy — understanding your own physical symptoms, knowing when to self-treat vs seek help, and communicating clearly with healthcare providers — is essential for long-term health."
    },
    materials: ["None needed"],
    steps: [
      "Pain is your body signaling that something needs attention — do not ignore it.",
      "When something hurts, notice: where exactly is it, how bad is it from 1-10, is it sharp or dull, does it come and go or stay constant, what makes it better or worse?",
      "Minor pain that goes away quickly usually does not need medical attention.",
      "Seek help for: severe pain, pain after an injury, pain with other symptoms like fever or swelling, or pain that does not improve after a day or two.",
      "Never take medication without a trusted adult knowing about it — even over-the-counter medications can cause harm if used incorrectly.",
      "Learning to describe your symptoms clearly helps doctors and parents help you faster."
    ],
    discussion: [
      {q:"Why is it important to be able to describe where and how something hurts rather than just saying I do not feel good?",
       answers:["Specific descriptions help adults know how serious something might be","A doctor asking where it hurts, how bad, and when it started is trying to diagnose the problem","I have a sharp pain in my right side when I breathe gives much more useful information than my side hurts"]},
      {q:"When should you tell an adult about a pain even if you think it is probably nothing?",
       answers:["If it is severe — a 7 or above on a 1-10 scale","If it came with an injury even if it does not seem bad right away — some injuries worsen over hours","If it has been there for more than a day or two without improving","If it is in your chest, head, or abdomen — these areas warrant prompt attention"]}
    ],
    challenge: "This week, practice describing how you feel when something is uncomfortable or painful. Use the questions: where, how bad, sharp or dull, constant or comes and goes, what makes it better or worse.",
    tuesday: {
      low:  {title:"Body map", activity:"Draw a simple body outline. Point to and name five parts of your body where you might feel pain: head, stomach, chest, arm, leg. For each one, name one thing that might cause pain there."},
      mid:  {title:"Symptom description practice", activity:"Practice describing a pretend symptom using all five questions: where, how bad, sharp or dull, constant or intermittent, what makes it better or worse. Do this for three different pretend symptoms."},
      high: {title:"When to seek care", activity:"Research the guidelines for when common symptoms require medical attention: fever, headache, stomachache, chest pain, and shortness of breath. Create a simple decision guide."}
    },
    wednesday: {
      low:  {title:"Pain scale", activity:"Look up a simple 1-10 pain scale with faces. Practice pointing to how you would rate different kinds of pain. Why is having a shared scale helpful when talking to a doctor or parent?"},
      mid:  {title:"Body systems basics", activity:"Research the major body systems: digestive, respiratory, circulatory, nervous, and musculoskeletal. For each one, name one symptom that tells you it might need attention."},
      high: {title:"Communicating with healthcare providers", activity:"Research how to communicate effectively with a doctor: being specific, bringing a symptom log, asking questions, and advocating for yourself. What are patients most commonly not doing well?"}
    },
    thursday: {
      low:  {title:"Body quiz", activity:"What does pain mean? Name the five questions to ask yourself when something hurts. When should you tell a grown-up about a pain? Practice describing a pretend stomachache using all five questions."},
      mid:  {title:"Symptom log", activity:"Keep a simple health log for two days: write down any physical symptoms you notice, no matter how minor. What patterns do you see? What correlates with how you slept or what you ate?"},
      high: {title:"Self-advocacy", activity:"Research what it means to be an advocate for your own health. What questions should you always ask a doctor? What information should you always bring to an appointment?"}
    }
  },

  "Thunderstorms — stay safe inside": {
    gradeHooks: {
      low:  "Thunderstorms can look and sound really scary! The good news is that inside your home you are almost always very safe. Today we learn what to do during a storm to make sure you stay that way.",
      mid:  "Thunderstorms are one of the most common severe weather events. Understanding the risks and the simple rules that keep you safe reduces fear and increases actual safety.",
      high: "Lightning is one of the most dangerous natural phenomena that most people routinely underestimate. Understanding the physics, risk factors, and safety protocols gives you real protection."
    },
    materials: ["None needed"],
    steps: [
      "If you hear thunder, you are close enough to be struck by lightning. Go inside immediately.",
      "A substantial building with plumbing and wiring is the safest place to be — the electrical system grounds the building.",
      "Once inside, stay away from windows, doors, and anything connected to the electrical system: plugged-in electronics, faucets, and pipes.",
      "Do not use a corded phone during a storm — cordless phones and cell phones are safe.",
      "Wait 30 minutes after the last thunder before going back outside — the 30-30 rule.",
      "If caught outside: avoid tall trees, water, and open fields. Crouch low — do not lie flat."
    ],
    discussion: [
      {q:"Why is it dangerous to use a faucet or shower during a thunderstorm?",
       answers:["Metal pipes conduct electricity — a lightning strike on the building can send current through the plumbing","This is why staying away from sinks, showers, and bathtubs during a storm is recommended","The risk is small but real — it is an easy rule to follow"]}  ,
      {q:"What is the 30-30 rule and why both numbers?",
       answers:["The first 30: if you see lightning and hear thunder within 30 seconds, the storm is within 6 miles — go inside immediately","The second 30: wait 30 minutes after the last thunder before going back outside","The second 30 matters because storms can double back and lightning can strike miles from the visible rain"]}
    ],
    challenge: "The next time there is a thunderstorm, practice the rules: go inside, stay away from windows and plumbing, wait 30 minutes after the last thunder before going out.",
    tuesday: {
      low:  {title:"Storm safety rules", activity:"Make a simple storm safety poster: five things to do during a thunderstorm and three things NOT to do. Draw pictures for each rule."},
      mid:  {title:"Lightning science", activity:"Research how lightning forms: what causes the charge buildup, how does it discharge, and why does it strike tall or conductive objects?"},
      high: {title:"Lightning risk research", activity:"Research lightning strike statistics: how many people are struck annually, what activities carry the highest risk, and what is the survival rate and typical injuries?"}
    },
    wednesday: {
      low:  {title:"Safe vs unsafe", activity:"A parent names places and you say: safe during a storm or not safe? Under a tall tree, inside your house, in a pool, in a car, in a gazebo, inside a mall."},
      mid:  {title:"Weather alert systems", activity:"Research NOAA weather alerts: the difference between a watch and a warning, how to receive alerts on your phone, and what each alert type means for your actions."},
      high: {title:"30-30 rule and beyond", activity:"Research the full Lightning Safety Guidelines from the National Weather Service or NOAA. What are the protocols for different outdoor activities: golf, swimming, hiking, sports?"}
    },
    thursday: {
      low:  {title:"Storm quiz", activity:"What do you do when you hear thunder? Name two things to stay away from inside during a storm. How long do you wait after the last thunder before going outside?"},
      mid:  {title:"Family storm plan", activity:"Does your family have a storm plan? Where is the safest room in your home during a severe thunderstorm? Where would you go if a tornado warning was issued?"},
      high: {title:"Severe weather planning", activity:"Research the full range of severe weather risks in your region: thunderstorms, tornadoes, hurricanes, flooding. For each one, write a one-paragraph action plan for your household."}
    }
  },

  "Crossing the street safely": {
    gradeHooks: {
      low:  "Crossing the street safely is one of the most important skills you can learn. Cars are heavy and fast, and drivers do not always see pedestrians. Today we learn the rules that keep you safe every single time.",
      mid:  "Pedestrian safety sounds basic — but pedestrian injuries and deaths are surprisingly common, and most involve predictable, preventable mistakes. Today we make sure you have rock-solid habits.",
      high: "Pedestrian-vehicle collisions kill tens of thousands of people annually in the US. Understanding the risk factors, driver limitations, and pedestrian behavior patterns gives you the knowledge to protect yourself."
    },
    materials: ["None needed — practice outside if possible"],
    steps: [
      "Stop at the curb before crossing — never step into the street without stopping first.",
      "Look left, look right, look left again. The second look left is because traffic from the left reaches you first.",
      "Make eye contact with drivers before crossing in front of them — do not assume they see you.",
      "Cross at crosswalks and intersections whenever possible — drivers expect pedestrians there.",
      "Never run across the street — if you trip, you fall in traffic.",
      "Put your phone away completely when crossing — distraction is a leading factor in pedestrian injuries."
    ],
    discussion: [
      {q:"Why do we look left-right-left instead of just left-right?",
       answers:["You look left first because traffic from the left reaches you first as you begin crossing","You look right as you step into the street","You look left again because the situation may have changed — a car may have turned or accelerated since you first looked"]},
      {q:"Why is making eye contact with a driver important before crossing?",
       answers:["A driver may be distracted and not actually see you even if they appear to be looking your way","Eye contact confirms the driver is aware of you","Never assume a car will stop because it is slowing down — until it stops, it could still move"]}
    ],
    challenge: "Every time you cross a street this week, practice the full sequence: stop, look left-right-left, make eye contact with any driver, then cross without your phone out. Make it automatic.",
    tuesday: {
      low:  {title:"Practice the sequence", activity:"Go to a quiet street with a grown-up and practice crossing safely five times. Say the steps out loud as you do them."},
      mid:  {title:"Intersection types", activity:"Research the different types of intersections and crossings: signalized intersections, uncontrolled intersections, mid-block crossings, and roundabouts. What are the pedestrian rules at each?"},
      high: {title:"Pedestrian fatality data", activity:"Research pedestrian fatality statistics: where do most deaths occur, what time of day, what age groups, and what are the contributing factors?"}
    },
    wednesday: {
      low:  {title:"Distraction test", activity:"Observe pedestrians near a crosswalk for five minutes. How many people are on their phones? How many look before crossing? What did you notice?"},
      mid:  {title:"Driver blind spots", activity:"Research driver blind spots and why drivers sometimes genuinely do not see pedestrians. What vehicle types have the largest blind spots?"},
      high: {title:"Infrastructure and safety", activity:"Research the relationship between street design and pedestrian safety: what design features reduce pedestrian-vehicle conflicts? What does your community do well or poorly?"}
    },
    thursday: {
      low:  {title:"Street safety quiz", activity:"What are the three looks before crossing? Why do we look left twice? What do you do with your phone when crossing? Do you run across the street?"},
      mid:  {title:"Habit audit", activity:"Honestly: do you always follow the full crossing sequence? Identify your weakest habit and commit to fixing it this week."},
      high: {title:"Teach it", activity:"Teach a younger child the full street crossing sequence in a way that will stick. What is the most memorable way to explain left-right-left?"}
    }
  },

  "Where does food come from?": {
    gradeHooks: {
      low:  "When you eat a piece of bread or an apple, where did it come from before the store? Today we trace food on its amazing journey from farm or garden to your plate.",
      mid:  "Understanding where food comes from connects you to the systems that sustain your life. Most people are remarkably disconnected from these systems — today we start closing that gap.",
      high: "The modern food supply chain is one of the most complex logistical systems ever created. Understanding it — and its vulnerabilities — is foundational to both preparedness and food literacy."
    },
    materials: ["A piece of food to examine — a vegetable, fruit, or packaged item"],
    steps: [
      "Almost all food starts with sunlight, water, and soil. Plants capture solar energy and store it as food.",
      "Fruits, vegetables, and grains grow on farms. Animals that produce meat, eggs, and dairy eat those plants.",
      "After harvest, most food is processed — cleaned, cut, cooked, packaged, or preserved.",
      "Food then travels from farms to warehouses to distribution centers to stores — sometimes across the country or world.",
      "From the store it comes to your kitchen, where you or someone in your family prepares it.",
      "Understanding this chain helps you appreciate food and think about what happens when any part of it is disrupted."
    ],
    discussion: [
      {q:"What would happen to the food supply if trucks stopped running for a week?",
       answers:["Most grocery stores carry about three days of food supply — shelves would begin emptying within days","Fresh produce and refrigerated items would be the first to run out","This is exactly why emergency food storage and local food production both matter"]},
      {q:"Why do people say that knowing where your food comes from makes you a better eater?",
       answers:["When you understand the effort involved in growing food, you tend to waste less","Knowing the source helps you evaluate quality — local in-season produce is usually more nutritious than shipped produce","It connects your daily choices to the health of farmland, farmers, and ecosystems"]}
    ],
    challenge: "Pick one food you ate today and trace its full journey from farm to your fork. How many steps did it take? How far did it travel?",
    tuesday: {
      low:  {title:"Food journey", activity:"Pick one food — an apple, a piece of bread, or a carrot. Draw a simple comic strip showing its journey: growing on a farm, being harvested, going to a store, and ending up on your plate."},
      mid:  {title:"Label geography", activity:"Look at five food packages. Where was each one produced or grown? Find those places on a map. How far did each item travel to reach your kitchen?"},
      high: {title:"Supply chain research", activity:"Research the US food supply chain: how many days of food supply are held at any given time nationally? What are the major vulnerabilities? What happened to food supply during COVID-19?"}
    },
    wednesday: {
      low:  {title:"Grow something", activity:"Plant a seed or sprout — a bean in a cup with damp paper towel works perfectly. Watch it over the next few days. This is where food starts."},
      mid:  {title:"Local vs global", activity:"Research the pros and cons of buying locally grown food vs food shipped from far away. What are the tradeoffs in terms of cost, nutrition, environmental impact, and food security?"},
      high: {title:"Food desert research", activity:"Research food deserts: what they are, where they exist, and what their health consequences are. What does this tell you about equity in the food system?"}
    },
    thursday: {
      low:  {title:"Food quiz", activity:"What does all food need to grow? Name two people or places that help get food from a farm to your plate. What is one food that is grown near where you live?"},
      mid:  {title:"Connection to preparedness", activity:"Connect food origins to emergency preparedness: what foods have the longest supply chain and would disappear first in a disruption? What foods could you grow or source locally?"},
      high: {title:"Food sovereignty", activity:"Research the concept of food sovereignty: the right of communities to control their own food production. How does this connect to resilience, culture, and power?"}
    }
  },

  "Drinking enough water every day": {
    gradeHooks: {
      low:  "Your body needs water every single day to work right — and most kids and grown-ups do not drink enough! Today we learn how much water we need and some tricks to help us drink more.",
      mid:  "Chronic mild dehydration affects more people than most realize. Today we build the awareness and habits to stay consistently well hydrated.",
      high: "Hydration optimization is one of the highest-leverage low-cost interventions for cognitive and physical performance. Today we build the science and the system."
    },
    materials: ["A water bottle or glass"],
    steps: [
      "Your body is about 60 percent water and needs continuous replenishment — you lose water through breathing, sweating, and elimination all day.",
      "A general guideline: about half your body weight in ounces of water per day. A 60-pound child needs about 30 ounces — roughly four glasses.",
      "Urine color is the easiest hydration check: pale yellow means well hydrated, dark yellow or orange means drink more.",
      "Thirst is a late signal — by the time you feel thirsty, you are already mildly dehydrated.",
      "Build water into your routine: drink a glass when you wake up, before each meal, and before bed.",
      "Foods with high water content also count: cucumbers, watermelon, oranges, and soups."
    ],
    discussion: [
      {q:"Why is thirst not a reliable signal for when to drink water?",
       answers:["Thirst is triggered after dehydration has already begun — it is a late warning signal","Children and elderly people have a less sensitive thirst mechanism and can be significantly dehydrated before feeling thirsty","Waiting until you are thirsty to drink means you spend parts of every day mildly dehydrated"]},
      {q:"How does mild dehydration affect your ability to think and learn?",
       answers:["Research shows even 1 to 2 percent dehydration reduces concentration, memory, and reaction time","Students who drink water before tests consistently score higher than those who do not","This effect is especially pronounced in warm classrooms or after physical activity"]}
    ],
    challenge: "Track your water intake for three days. Before each glass, check your urine color. Notice what correlates. Try to hit your daily target every day.",
    tuesday: {
      low:  {title:"My water goal", activity:"Calculate your daily water goal: weigh yourself, divide by two, and that is roughly how many ounces per day. How many glasses is that? Fill that many cups and line them up — that is what you are trying to drink today."},
      mid:  {title:"Hydration tracking", activity:"Track your water intake today from the moment you wake up. Every glass or bottle, write it down. At the end of the day, did you hit your goal? When during the day were you least hydrated?"},
      high: {title:"Performance research", activity:"Research two or three studies on hydration and cognitive or athletic performance. What were the findings? What hydration levels produced the most significant performance drops?"}
    },
    wednesday: {
      low:  {title:"Water foods", activity:"Research five foods that are mostly water: cucumbers, watermelon, strawberries, celery, and soup broth. Eat one of them today as part of your hydration."},
      mid:  {title:"Habit design", activity:"Design a hydration system that would make hitting your daily water goal automatic: timing triggers, a marked water bottle, or app reminders. Try your system today."},
      high: {title:"Electrolytes and hydration", activity:"Research electrolytes: what they are, what role they play in hydration, and when plain water is not sufficient (like during intense exercise or illness). What are the signs of electrolyte imbalance?"}
    },
    thursday: {
      low:  {title:"Water quiz", activity:"How do you know if you are drinking enough water? What color should your urine be? Name two foods that have lots of water in them. Drink a full glass of water right now."},
      mid:  {title:"Review your tracking", activity:"Look at your three days of water tracking. What patterns do you see? What is the single biggest change you could make to drink more water consistently?"},
      high: {title:"Hydration plan", activity:"Write a complete personal hydration plan: your daily water goal, your timing triggers, your reminders, and how you will adjust for heat, exercise, and illness. Make it specific enough to actually use."}
    }
  },

  "Sunscreen and sun safety": {
    gradeHooks: {
      low:  "The sun gives us light and warmth and helps plants grow — but too much sun on your skin can hurt you. Today we learn how to enjoy the outdoors while keeping our skin safe.",
      mid:  "Skin cancer is one of the most common cancers, and almost all of it is preventable with simple sun protection habits built early. Today we build those habits.",
      high: "UV radiation, skin damage, and skin cancer prevention is an area where the evidence is clear and the protective behaviors are simple. Today we make sure your habits match the science."
    },
    materials: ["Sunscreen SPF 30 or higher if available"],
    steps: [
      "The sun emits ultraviolet (UV) radiation that damages skin cells. That damage accumulates over a lifetime.",
      "Sunburn is a sign of UV damage — even one bad sunburn as a child increases lifetime skin cancer risk.",
      "Apply SPF 30 or higher sunscreen 15-30 minutes before sun exposure. Reapply every two hours or after swimming.",
      "Cover commonly missed spots: ears, back of neck, tops of feet, and the part in your hair.",
      "UV rays are strongest between 10am and 4pm — seek shade or extra coverage during those hours.",
      "Wear UV-protective clothing, sunglasses, and a wide-brimmed hat for long outdoor sessions."
    ],
    discussion: [
      {q:"Why does skin damage from the sun matter even if a sunburn goes away?",
       answers:["UV radiation damages the DNA in skin cells — that damage accumulates and does not fully heal","Each sunburn increases the risk of melanoma, the most dangerous form of skin cancer","The effects show up decades later — sun habits you build now affect your skin health in your 40s, 50s, and beyond"]},
      {q:"Is there such a thing as a safe tan?",
       answers:["A tan is your skin producing pigment in response to UV damage — the tan itself is a sign of damage","There is no biologically safe level of UV-induced tanning","SPF clothing, shade, and sunscreen allow outdoor activity without the damage"]}
    ],
    challenge: "Every time you go outside for more than 20 minutes in the sun this week, apply sunscreen first. Build it into your routine before you go out, not after you get there.",
    tuesday: {
      low:  {title:"Sunscreen practice", activity:"Practice applying sunscreen with a grown-up watching. Cover your face, ears, neck, arms, and any exposed skin. Did you miss any spots? Reapply after two hours if you are still outside."},
      mid:  {title:"SPF explained", activity:"Research what SPF means: what does SPF 30 actually protect against vs SPF 50 vs SPF 100? What is the difference in real-world protection?"},
      high: {title:"UV index research", activity:"Research the UV index: what the scale means, what factors affect it, and where you can check it daily for your area. At what UV index level should sun protection be mandatory?"}
    },
    wednesday: {
      low:  {title:"Sun safe clothing", activity:"Look at some clothes and hats in your home. Which ones would give the most sun protection? Research what UPF means on sun-protective clothing."},
      mid:  {title:"Skin cancer awareness", activity:"Research the three main types of skin cancer: basal cell, squamous cell, and melanoma. What does each look like, what causes it, and how treatable is it when caught early?"},
      high: {title:"ABCDE rule", activity:"Research the ABCDE rule for identifying potentially dangerous moles and skin spots: Asymmetry, Border, Color, Diameter, Evolution. Practice applying it to sample images."}
    },
    thursday: {
      low:  {title:"Sun safety quiz", activity:"What does sunscreen protect your skin from? When do you put it on — before or after you go outside? How often do you reapply? Name two other things besides sunscreen that protect you from the sun."},
      mid:  {title:"Daily habit", activity:"What is your current sun protection routine? What is missing? Make a specific plan for how you will protect your skin every day this week."},
      high: {title:"Vitamin D balance", activity:"Research the relationship between sun exposure and vitamin D production. Is there a benefit to some sun exposure? How do you balance vitamin D needs with UV damage risk?"}
    }
  },

  "My neighborhood — who lives here?": {
    gradeHooks: {
      low:  "Your neighborhood is full of interesting people — families, workers, helpers, and friends you might not know yet. Today we explore who is in your neighborhood and why knowing them makes life better.",
      mid:  "A neighborhood is more than just the houses on your street. It is a web of people, skills, and resources. Understanding that web is a genuine safety and preparedness skill.",
      high: "Neighborhood social mapping — understanding who lives around you, what they know, and what resources they have — is the foundation of community resilience."
    },
    materials: ["Paper to draw and write on"],
    steps: [
      "Start by identifying the people you already know: names, which house, and something you know about them.",
      "Think about the different types of people in a neighborhood: families, elderly residents, people who work from home, renters, business owners.",
      "Some neighbors have skills or resources that could matter in an emergency: medical training, tools, extra food, a generator.",
      "Some neighbors are more vulnerable and might need help: elderly people who live alone, people with disabilities, families with young children.",
      "Knowing your neighborhood is not about nosiness — it is about being able to help and be helped.",
      "The best time to meet neighbors is before you need them."
    ],
    discussion: [
      {q:"Why would knowing which neighbors have medical training or a generator matter in an emergency?",
       answers:["In a serious emergency, knowing who has what skill or resource could save a life","Neighbors are your first responders before professionals arrive","A connected neighborhood self-organizes during a crisis — a disconnected one panics"]}  ,
      {q:"Which neighbors might need extra help in an emergency and why?",
       answers:["Elderly people living alone may not be able to evacuate without help","People with disabilities may need assistance that assumes able-bodied movement","Families with very young children have extra needs and less free capacity","Non-English speakers may not receive emergency communications in their language"]}
    ],
    challenge: "This week, draw a map of your street with every house. Label the ones where you know the residents by name. Identify one house where you would like to introduce yourself.",
    tuesday: {
      low:  {title:"Neighbor map", activity:"Draw your street with every house. Write the names of neighbors you know above their house. How many do you know? Which ones do you not know at all?"},
      mid:  {title:"Skills inventory", activity:"Think about all the neighbors you know. Who has skills or resources that would be useful in an emergency: medical, mechanical, food growing, tools, extra space? Make a list."},
      high: {title:"Vulnerability assessment", activity:"Think through your neighborhood: who is most likely to need help in an emergency? Elderly residents living alone, families with infants, people with mobility limitations? How would you reach each group?"}
    },
    wednesday: {
      low:  {title:"Meet a neighbor", activity:"With a grown-up, introduce yourself to one neighbor you do not know yet. Learn their name. It does not have to be a long conversation — just a hello and a name."},
      mid:  {title:"Community connection", activity:"Research neighborhood connection tools: Nextdoor, local Facebook groups, neighborhood apps. Does your neighborhood use any of these? What are the pros and cons?"},
      high: {title:"Emergency contact network", activity:"Design a simple neighborhood emergency contact list for your street: names, addresses, phone numbers, skills, and any vulnerabilities. What would it take to actually build this for your real street?"}
    },
    thursday: {
      low:  {title:"Neighborhood quiz", activity:"Name three neighbors by name. Name one neighbor who could help in an emergency. Name one neighbor who might need extra help. What is one new thing you learned about your neighborhood this week?"},
      mid:  {title:"Connection plan", activity:"What is one specific thing you or your family could do to strengthen one neighborhood relationship this month? Make a plan and follow through."},
      high: {title:"Social capital audit", activity:"Rate your neighborhood on social capital: do people know each other, do they help each other, is there a way to communicate in an emergency? What would move it from its current level to stronger?"}
    }
  },

  "Animals that can hurt us": {
    gradeHooks: {
      low:  "Most animals want nothing to do with people and will leave you alone if you leave them alone. But some animals can hurt you if you surprise them or get too close. Today we learn which ones to watch out for and what to do.",
      mid:  "Animal encounters go wrong most often because people do not know the animal behavior signals that say leave me alone. Today we learn those signals and the right responses.",
      high: "Wildlife encounter safety is a risk management skill: understanding animal behavior, habitat, and the situations that lead to conflict allows you to make informed decisions in the field."
    },
    materials: ["None needed"],
    steps: [
      "Animals attack humans almost exclusively for one of three reasons: they feel threatened, they are protecting young, or they are sick.",
      "Giving animals space prevents almost all encounters from becoming dangerous.",
      "Never approach, feed, or corner a wild animal — even ones that look calm.",
      "Specific threats by region: in Florida — alligators, venomous snakes, jellyfish, stingrays, and fire ants.",
      "If you encounter an aggressive animal: do not run (it triggers chase instinct), make yourself look large, back away slowly.",
      "Bites from any wild animal require prompt medical attention — rabies risk is real with mammals."
    ],
    discussion: [
      {q:"Why does running away from an aggressive dog or coyote often make the situation worse?",
       answers:["Running triggers the predatory chase instinct in many animals — they are wired to pursue fleeing prey","Standing still or moving slowly and calmly takes away that trigger","This is counterintuitive — every instinct says run, but staying calm and facing the animal is usually the right move"]},
      {q:"Why does any wild mammal bite require medical attention even if the wound seems minor?",
       answers:["Rabies is a viral disease transmitted through bites that is almost always fatal once symptoms appear","The only treatment is a post-exposure vaccine series that must begin before symptoms develop","Any bite from a raccoon, bat, fox, skunk, or stray animal warrants immediate consultation with a doctor"]}
    ],
    challenge: "Research the specific animals in your region that require awareness. For Florida: alligators, venomous snakes, and fire ants. Learn the one most important rule for each.",
    tuesday: {
      low:  {title:"Local animal awareness", activity:"With a grown-up, look up three animals in your region that require caution. For each one: what does it look like, where might you encounter it, and what is the most important safety rule?"},
      mid:  {title:"Animal behavior signals", activity:"Research warning signals for three animals common in your region: alligators, venomous snakes, and wasps or bees. What behaviors mean leave me alone?"},
      high: {title:"Encounter statistics", activity:"Research human-wildlife conflict data for your region. What animals are involved in the most incidents? What situations lead to conflict? What does this tell you about prevention?"}
    },
    wednesday: {
      low:  {title:"What to do", activity:"Practice the response for encountering an aggressive dog: freeze, do not run, avoid eye contact, back away slowly. Role play this with a parent three times."},
      mid:  {title:"Snakebite first aid", activity:"Research proper snakebite first aid: what to do and what NOT to do. Many traditional advice items (tourniquet, cut and suck) are now known to cause more harm. What does current medical guidance say?"},
      high: {title:"Alligator safety", activity:"Research alligator behavior and safety in Florida: when are they most dangerous, where are encounters most likely, what attracts them to human areas, and what do wildlife managers recommend?"}
    },
    thursday: {
      low:  {title:"Animal safety quiz", activity:"Why do animals attack people? What do you do if a dog runs at you? Why do you never feed wild animals? Name one animal in your area that requires caution."},
      mid:  {title:"React or prevent?", activity:"Most animal encounter emergencies can be prevented. Review the encounters you researched: for each one, what is the most important thing you could do to prevent it from happening at all?"},
      high: {title:"Coexistence planning", activity:"Research strategies for coexisting with wildlife in urban and suburban environments. What approaches do wildlife managers use? What can individual households do to reduce conflict?"}
    }
  },

  "Sharing and taking turns": {
    gradeHooks: {
      low:  "Sharing and taking turns are some of the most important skills for getting along with others. They can be hard sometimes — but practicing them makes friendships stronger and life more fair for everyone.",
      mid:  "The ability to share resources and wait your turn are not just childhood lessons — they underpin cooperation, fairness, and community function. Today we look at why these skills matter.",
      high: "Resource sharing and turn-taking are foundational to cooperative systems at every scale — from playground to economics to emergency management."
    },
    materials: ["None needed"],
    steps: [
      "Sharing means letting others use something you have, even when you would rather keep it for yourself.",
      "Taking turns means waiting for your opportunity while someone else has theirs.",
      "Both skills require delaying gratification — choosing a future benefit over an immediate one.",
      "Sharing works better when it is reciprocal — when everyone shares, everyone benefits more than if no one shares.",
      "In an emergency, sharing resources — food, water, tools, skills — is often what makes the difference between a community that survives and one that does not.",
      "Fairness is the underlying principle: everyone deserves a reasonable chance at what they need."
    ],
    discussion: [
      {q:"Why is sharing actually in your own self-interest, even when it feels like giving something up?",
       answers:["People who share build trust and reputation — others are more willing to share with them in return","In a community, generous people receive more help than those who hoard","The short-term cost of sharing is almost always outweighed by the long-term benefit of goodwill"]},
      {q:"How does the skill of taking turns connect to larger ideas about fairness in society?",
       answers:["Democratic processes are essentially organized turn-taking — everyone gets a voice in sequence","Queuing systems, rationing, and allocation rules in emergencies are all formalized turn-taking","Developing patience and respect for process as a child builds the character needed to maintain fairness as an adult"]}
    ],
    challenge: "Practice sharing or taking turns in a real situation this week — something that genuinely takes effort. Notice how the other person responds and how you feel afterward.",
    tuesday: {
      low:  {title:"Sharing practice", activity:"Find something you enjoy that you could share with a family member or friend today — a snack, a game, a book, or your time. Share it genuinely, not grudgingly. How did it feel?"},
      mid:  {title:"Resource allocation", activity:"Research how communities allocate limited resources in emergencies: food rationing during wartime, water distribution during a drought. What principles guide fair distribution?"},
      high: {title:"Game theory and cooperation", activity:"Research the Prisoner Dilemma in game theory. What does it reveal about cooperation and self-interest? What conditions make cooperation more likely?"}
    },
    wednesday: {
      low:  {title:"Taking turns practice", activity:"Play a game with a family member that requires taking turns. Practice waiting patiently, encouraging the other person during their turn, and not rushing them."},
      mid:  {title:"Emergency sharing", activity:"Think about a scenario where your family has extra of something during an emergency. Who would you share with and who would you not? What principles guide that decision?"},
      high: {title:"Commons research", activity:"Research the tragedy of the commons: what is it, what causes it, and how do communities successfully manage shared resources? What does Elinor Ostrom research show?"}
    },
    thursday: {
      low:  {title:"Sharing quiz", activity:"What does sharing mean? What does taking turns mean? Why does sharing help make friendships stronger? Name one thing you shared or took turns with this week."},
      mid:  {title:"Cooperation reflection", activity:"Think about a group project or team situation where sharing and turn-taking were required. What made it work well or poorly? What would you do differently?"},
      high: {title:"Community design", activity:"How would you design a community system for sharing a scarce resource fairly — a community tool library or emergency food stores? What rules would you establish?"}
    }
  },

  "Poisonous plants — don't touch": {
    gradeHooks: {
      low:  "Some plants in the woods, parks, and even your own yard can make your skin itch, burn, or blister really badly. Today we learn which ones to recognize and the most important rule: do not touch!",
      mid:  "Plant rashes from poison ivy, poison oak, and similar plants are among the most common outdoor injuries. Knowing what to look for and what to do prevents miserable experiences.",
      high: "Contact dermatitis from urushiol-containing plants and other toxic plants is a genuine outdoor hazard. Today we build identification skills and proper response protocols."
    },
    materials: ["A field guide or device to look up plants"],
    steps: [
      "The most important rule: if you do not know what a plant is, do not touch it.",
      "Poison ivy: leaves of three, let it be. Each leaf has three leaflets, often shiny, with notched edges.",
      "Poison oak: similar to poison ivy with rounded lobes, common in the western US and Southeast.",
      "Poison sumac: a shrub or small tree with 7-13 leaflets, found in swampy areas in the Southeast.",
      "All three cause urushiol dermatitis: an allergic reaction causing intense itching, redness, and blisters 12-72 hours after contact.",
      "If you touched a suspected plant: wash the area with soap and cold water immediately — do not scratch, do not spread the oils."
    ],
    discussion: [
      {q:"If you brush against poison ivy but your skin does not itch right away, does that mean you are safe?",
       answers:["No — the reaction takes 12 to 72 hours to appear","The urushiol oil absorbs into skin and triggers an immune response that builds over time","This delay is why people often cannot identify what caused their rash — they do not connect it to the plant contact from days earlier"]},
      {q:"What should you do immediately after touching a plant you think might be poison ivy?",
       answers:["Wash the area immediately with soap and cold water — cold because hot water opens pores and can increase absorption","Do not rub or scratch — that spreads the oils","Wash everything that may have contacted the plant: clothes, tools, pet fur","The sooner you wash, the milder the reaction will be"]}
    ],
    challenge: "Look up poison ivy images for your region and practice identifying it. Go for a walk this week and see if you can spot it — from a safe distance, without touching.",
    tuesday: {
      low:  {title:"Leaves of three", activity:"Look up images of poison ivy online with a grown-up. Study the leaf shape. Then go for a short walk and see if you can spot any — without touching. Practice saying: leaves of three, let it be."},
      mid:  {title:"Regional plant ID", activity:"Research the specific toxic plants most common in your region. In Florida: poison ivy, poison oak, manchineel, and stinging nettle. For each one, find an image and learn the key identifying features."},
      high: {title:"Urushiol chemistry", activity:"Research urushiol: what it is chemically, how it triggers an immune response, why some people react more severely than others, and why sensitization increases with repeat exposure."}
    },
    wednesday: {
      low:  {title:"Treatment practice", activity:"Role play: you accidentally touched a plant you did not recognize. What do you do right now? Walk through the steps: wash with soap and cold water, do not scratch, tell a grown-up, watch for a rash over the next three days."},
      mid:  {title:"Reaction vs severe reaction", activity:"Research when a poison ivy reaction requires medical attention: what symptoms warrant a doctor visit vs managing it at home? What treatments are available?"},
      high: {title:"Beyond the big three", activity:"Research other toxic plants beyond poison ivy: manchineel tree, water hemlock, giant hogweed, and stinging nettles. What makes each one dangerous? Are any present in your region?"}
    },
    thursday: {
      low:  {title:"Plant safety quiz", activity:"What is the most important rule about plants you do not know? Finish this sentence: leaves of three, ___. What do you do if you think you touched a bad plant? How long before a rash might appear?"},
      mid:  {title:"Teach it", activity:"Teach a younger child how to recognize poison ivy using the leaves of three rule. Show them an image. Practice until they can identify it from a picture on their own."},
      high: {title:"Foraging safety connection", activity:"Connect toxic plant awareness to foraging: how does knowing what not to touch and what not to eat overlap? What is the common principle underlying both?"}
    }
  },



  "What to do in an emergency": {
    gradeHooks: {
      low:  "Sometimes things happen that are really scary. But if you know what to do ahead of time, you can help instead of just being scared. Today we learn what to do.",
      mid:  "Emergencies feel chaotic. But the people who handle them well just practiced ahead of time. Today we build that practice.",
      high: "Your ability to respond well in an emergency depends almost entirely on what you rehearsed before it happened. Today we make sure that rehearsal is solid."
    },
    materials: ["Paper and pen"],
    steps: [
      "Stop. Take one breath. Moving fast without thinking makes emergencies worse.",
      "Look around quickly: what is actually happening? Is anyone hurt? Is there immediate danger?",
      "Get yourself safe first. You cannot help others if you are also in danger.",
      "If someone is hurt or there is serious danger: call 911 or get an adult immediately.",
      "Know your address by heart. That is the first thing emergency responders need.",
      "Stay with the situation until help arrives. Do not leave someone who is hurt alone."
    ],
    discussion: [
      {q:"What is the difference between a real emergency and something that is scary but not dangerous?",
       answers:["Real emergency: someone is hurt, there is fire or immediate danger, someone is missing","Scary but not dangerous: a loud noise, a nightmare, feeling anxious","When in doubt, treat it as a real emergency — it is never wrong to get help"]},
      {q:"Why is it important to stay calm in an emergency even when you are scared?",
       answers:["Panic makes you forget what you know and do things that make situations worse","Calm thinking helps you remember your steps and communicate clearly","The people around you take cues from you — your calm helps them stay calmer too"]}
    ],
    challenge: "Say your home address out loud right now. Practice it every day this week until you can say it instantly without thinking.",
    tuesday: {
      low:  {title:"Address practice", activity:"Say your home address five times out loud — street number, street name, city. Then have a grown-up cover their ears while you say it again."},
      mid:  {title:"Emergency vs not", activity:"A parent calls out 10 situations one at a time. You decide: real emergency or not? Talk through any you disagree on."},
      high: {title:"Response plan", activity:"Write a one-page personal emergency response guide: your address, nearest cross street, important phone numbers, and your first three steps for three different emergency types."}
    },
    wednesday: {
      low:  {title:"Stay or go?", activity:"Talk through two scenarios: a fire in the kitchen and a neighbor who fell. For each one, what do you do first?"},
      mid:  {title:"The breathing trick", activity:"Practice the one-breath reset: when something scary happens, take one deliberate breath before doing anything. Breathe in for 4 counts, out for 4."},
      high: {title:"Scenario pressure test", activity:"A parent gives you an emergency scenario and you have 10 seconds to state your first three actions. Do five rounds. Discuss: which instincts were right?"}
    },
    thursday: {
      low:  {title:"Emergency quiz", activity:"What is the first thing you do in an emergency? What do you say when you call for help? What is your home address right now?"},
      mid:  {title:"Reflect and reinforce", activity:"What is the one thing you most want to remember from this week? Write it down. Then practice your address one more time."},
      high: {title:"Teach it", activity:"Teach a younger child the three most important things to do in any emergency: stop and breathe, check what is happening, get help."}
    }
  },

  "Stop Drop Roll": {
    gradeHooks: {
      low:  "What would you do if your clothes were on fire? Most people would run — but that is the worst thing! Today we learn the three magic words: Stop, Drop, and Roll.",
      mid:  "Stop Drop Roll sounds simple. It is. But practicing it now means your body will do it automatically if you ever need it.",
      high: "Stop Drop and Roll must be practiced physically — reading about it is not enough. Today we drill it until it is automatic."
    },
    materials: ["An open floor space"],
    steps: [
      "STOP — do not run. Running fans the flames and makes them bigger and hotter.",
      "DROP — get down to the ground immediately. Cover your face with your hands.",
      "ROLL — roll back and forth to smother the flames. Keep rolling until the fire is out.",
      "Cover your face the whole time to protect it from heat and flames.",
      "Once the fire is out, cool the burn with cool water for 10 minutes.",
      "Get away from the area and call for help — even if you feel okay."
    ],
    discussion: [
      {q:"Why does running make a fire on your clothes worse?",
       answers:["Running creates airflow which feeds oxygen to the fire and makes it burn hotter","Stopping removes the airflow — rolling smothers what is left","This is why even though every instinct says run, the trained response is the opposite"]},
      {q:"After you stop drop and roll and the fire is out, what do you do next?",
       answers:["Cool any burned area with cool water for 10 minutes — not ice, not butter","Get away from the area — there may still be danger nearby","Get medical help even if the burn seems minor"]}
    ],
    challenge: "Practice the full motion three times today — actually get on the floor and roll. Then teach it to someone else this week.",
    tuesday: {
      low:  {title:"Practice the motion", activity:"On a soft floor, practice Stop Drop Roll three times for real. Say the words out loud as you do each step."},
      mid:  {title:"Why it works", activity:"Research: what does fire need to burn? How does Stop Drop Roll remove one of those things? Draw the fire triangle."},
      high: {title:"Burn treatment", activity:"Research proper burn treatment: cool water for 10 minutes, no ice or butter, cover loosely, when to seek medical care. Write a quick reference card."}
    },
    wednesday: {
      low:  {title:"Teach someone", activity:"Teach a parent or friend how to Stop Drop Roll. Walk them through each step and watch them practice."},
      mid:  {title:"Timed drill", activity:"Have a parent call out fire at a random moment today. You must immediately Stop Drop Roll on the spot."},
      high: {title:"Fire safety audit", activity:"Walk through your home and identify the three most likely places a clothing fire could happen. Note the nearest exit from each."}
    },
    thursday: {
      low:  {title:"SDR quiz", activity:"What are the three words? Why do we not run? What do we do after the fire is out? Do one more practice on the floor."},
      mid:  {title:"Confidence check", activity:"Could you actually do Stop Drop Roll without thinking? Rate your confidence 1-10. If under 8, practice two more times right now."},
      high: {title:"Teach younger kids", activity:"Teach Stop Drop Roll to a younger child. Make it fun — have them practice with you."}
    }
  },

  "What is money?": {
    gradeHooks: {
      low:  "Have you ever seen a grown-up pay for something at a store? Money is how people trade for things they need. Today we learn what money is and what the different coins and bills are called.",
      mid:  "Money is one of those things everyone uses but not everyone understands. Today we go back to basics — what money actually is, why it exists, and how it works.",
      high: "Understanding money at a deep level — what it actually represents and why it has value — is surprisingly rare. Today we build that foundation."
    },
    materials: ["A handful of real coins and a dollar bill if available"],
    steps: [
      "Money is a tool people use to trade for things. Before money, people bartered — traded one thing directly for another.",
      "The problem with barter: what if the person with bread does not want what you have? Money solves that.",
      "Money has value because everyone agrees it does. That agreement is what makes it work.",
      "Pennies = 1 cent. Nickels = 5 cents. Dimes = 10 cents. Quarters = 25 cents. One dollar = 100 cents.",
      "Money can also exist digitally — as numbers in a bank account.",
      "The earlier you learn how money works, the better decisions you will make with it your whole life."
    ],
    discussion: [
      {q:"If money did not exist, how would you get the things you need?",
       answers:["You would have to trade something you have for something someone else has","The problem: you might not have anything the other person wants","Money is a shortcut that makes trading way easier for everyone"]},
      {q:"Why does a small piece of paper with numbers on it have real value?",
       answers:["Because everyone agrees it does — that shared agreement is what gives it power","The government backs it and promises it is valid","If everyone stopped believing in it, it would lose its value"]}
    ],
    challenge: "Find five coins this week and identify each one by name and value without help. Then add them up.",
    tuesday: {
      low:  {title:"Coin identification", activity:"Lay out all the coins you can find. Name each one and its value. Sort them from smallest value to largest. Count up the total."},
      mid:  {title:"Barter experiment", activity:"Try to barter something small with a family member today. How did it feel? What made it work or not work?"},
      high: {title:"What backs money?", activity:"Research: what was the gold standard? When did the US leave it? What backs the dollar today?"}
    },
    wednesday: {
      low:  {title:"Make change", activity:"A grown-up gives you amounts up to a dollar and you make that amount using the fewest coins possible. Try five different amounts."},
      mid:  {title:"Digital vs physical", activity:"How often does your family use physical cash vs digital payment? Make a list of five recent transactions and note which type was used."},
      high: {title:"Inflation explained", activity:"Research what inflation is and what causes it. Find the price of a common item today vs 20 years ago."}
    },
    thursday: {
      low:  {title:"Money quiz", activity:"What is a dime worth? What is a quarter worth? How many cents in a dollar? What did people do before money existed?"},
      mid:  {title:"Your relationship with money", activity:"Do you think about money as something scary, exciting, or neutral? Where did that feeling come from? Discuss with a parent."},
      high: {title:"The big picture", activity:"Write a one-paragraph answer: why does money exist and why does it have value? Explain it as if teaching someone who has never heard of money."}
    }
  },

  "Allergies and what to avoid": {
    gradeHooks: {
      low:  "Some people have allergies — their bodies react in a special way to certain foods, plants, or animals. Today we learn what allergies are and how to stay safe.",
      mid:  "Allergies range from mildly annoying to life-threatening. Understanding what triggers them, how to recognize a reaction, and when to act is important for everyone.",
      high: "Allergy awareness is a practical health and safety skill. Understanding the spectrum from mild sensitivity to anaphylaxis is genuinely life-saving knowledge."
    },
    materials: ["None needed"],
    steps: [
      "An allergy is when the immune system overreacts to a substance that is harmless to most people.",
      "Common allergens: peanuts, tree nuts, shellfish, dairy, eggs, wheat, bee stings, pet dander, pollen, and certain medications.",
      "Mild reactions: rash, hives, runny nose, watery eyes, sneezing.",
      "Severe reactions (anaphylaxis): throat swelling, difficulty breathing, drop in blood pressure — call 911 immediately.",
      "If someone with a known severe allergy has a reaction, use their epinephrine auto-injector (EpiPen) immediately if available and call 911.",
      "Always read food labels and communicate allergies clearly in restaurants."
    ],
    discussion: [
      {q:"What makes anaphylaxis different from a mild allergic reaction?",
       answers:["Anaphylaxis affects multiple body systems at once — airways, blood pressure, and skin simultaneously","The throat can swell shut within minutes — without treatment it is fatal","Epinephrine buys time but is not a cure — 911 is still needed even after using an EpiPen"]},
      {q:"If a friend tells you they have a peanut allergy, what should you do differently?",
       answers:["Do not share food with them without checking ingredients carefully","Wash your hands after eating peanut products before touching shared surfaces","Know where their EpiPen is if they carry one"]}
    ],
    challenge: "Find out if anyone in your immediate family or close friend group has a known allergy. Learn what their specific allergen is and what you should do if they have a reaction.",
    tuesday: {
      low:  {title:"Allergy awareness", activity:"Learn the names of the eight most common food allergens: peanuts, tree nuts, shellfish, fish, dairy, eggs, wheat, and soy. Draw each one and write one food that contains it."},
      mid:  {title:"Label reading", activity:"Read the ingredient labels on five packaged foods in your kitchen. Practice identifying hidden allergens — dairy appears as casein, wheat as gluten."},
      high: {title:"Anaphylaxis protocol", activity:"Research the full anaphylaxis response protocol: when to use an EpiPen, how to use it correctly, what to do after using it."}
    },
    wednesday: {
      low:  {title:"Safe snack planning", activity:"Plan a snack that is free of all top eight allergens. What snacks can you still make?"},
      mid:  {title:"Restaurant communication", activity:"Research how to communicate allergies effectively in a restaurant. What does cross-contamination mean and why does it matter?"},
      high: {title:"EpiPen training", activity:"Research how an epinephrine auto-injector works: what does it contain, what does it do in the body, how is it used?"}
    },
    thursday: {
      low:  {title:"Allergy quiz", activity:"What is an allergy? Name three common food allergies. What does a severe allergic reaction look like? What do you do if someone is having trouble breathing?"},
      mid:  {title:"Know your circle", activity:"Do you have any allergies yourself? Does anyone close to you? Write down what each person is allergic to and what the correct response is."},
      high: {title:"Community awareness", activity:"Research how schools, camps, and community organizations manage severe allergies. What policies are most effective?"}
    }
  },

  "Water — why we need it": {
    gradeHooks: {
      low:  "Water is the most important thing your body needs every single day — even more important than food! Today we learn why water is so amazing and why we need to drink it all the time.",
      mid:  "Water is involved in nearly every function in the human body. Understanding why it is so essential helps you make better choices about hydration every day.",
      high: "Water participates in virtually every biological process. Understanding the physiology of hydration, dehydration, and water quality is foundational health knowledge."
    },
    materials: ["A glass of water to drink right now"],
    steps: [
      "About 60 percent of your body is water — your brain, muscles, blood, and organs all depend on it.",
      "Water regulates body temperature, carries nutrients to cells, and flushes out waste.",
      "You lose water constantly through breathing, sweat, and elimination — it must be replaced continuously.",
      "Mild dehydration causes headaches, fatigue, difficulty concentrating, and dark urine.",
      "The best indicator of good hydration is pale yellow urine.",
      "Pure water is the best hydrator — juice and soda contain sugars that require additional water to process."
    ],
    discussion: [
      {q:"Why does dehydration cause headaches and difficulty concentrating?",
       answers:["Your brain is about 75 percent water — even small water loss affects cognitive performance","Dehydration reduces blood volume, which means the brain receives slightly less oxygen","Research shows even mild dehydration measurably reduces test scores and reaction time"]},
      {q:"If soda and juice contain water, why are they not as good at hydrating as plain water?",
       answers:["Sugar requires water to metabolize — sugary drinks actually increase your water need","Caffeine in soda is a diuretic — it causes you to lose more water than the drink provides","Plain water is absorbed directly with no metabolic cost"]}
    ],
    challenge: "Track your water intake for three days. Observe your urine color each morning. What correlates with how much water you drank the day before?",
    tuesday: {
      low:  {title:"Water in your body", activity:"Draw a simple body outline. Label four body parts that need water to work: brain, muscles, blood, and kidneys. For each one, write one thing that goes wrong when it does not have enough water."},
      mid:  {title:"Hydration calculation", activity:"Research how to calculate your personal daily water needs. One common formula: body weight in pounds divided by two equals ounces of water per day. Calculate yours."},
      high: {title:"Water and performance", activity:"Research the scientific evidence on hydration and cognitive and physical performance. At what percentage of body weight loss does performance start declining?"}
    },
    wednesday: {
      low:  {title:"Water vs other drinks", activity:"Compare three drinks: water, juice, and soda. For each one, what does your body get from it? Which one helps your body work best?"},
      mid:  {title:"Water quality", activity:"Research what makes drinking water safe. What contaminants can be in tap water? How would you make water safe to drink in an emergency?"},
      high: {title:"Emergency water planning", activity:"Calculate how much water your household would need for three days, then for two weeks. What containers would you use? Where would you store it?"}
    },
    thursday: {
      low:  {title:"Water quiz", activity:"What percentage of your body is water? Name two things water does in your body. What does dark yellow urine mean? Drink a full glass of water right now."},
      mid:  {title:"Hydration habit design", activity:"Based on your three days of tracking, when during the day are you least hydrated? Design a simple system to fix that."},
      high: {title:"Water footprint", activity:"Research the concept of a water footprint: how much water is embedded in the food you eat and products you use?"}
    }
  },

  "Hot and cold safety": {
    gradeHooks: {
      low:  "Being too hot or too cold can make you feel really sick. Your body works best when it stays just the right temperature. Today we learn how to stay safe when the weather gets extreme.",
      mid:  "Heat exhaustion, heat stroke, frostbite, and hypothermia are all preventable. Knowing the warning signs and how to respond can save your life or someone else's.",
      high: "Thermal injury is among the most underestimated dangers in outdoor and emergency settings. Understanding physiology, prevention, and treatment is essential knowledge."
    },
    materials: ["None needed"],
    steps: [
      "Your body must stay within a narrow temperature range to function. Too hot or too cold causes serious harm.",
      "Heat warning signs: heavy sweating, weakness, cold or pale skin, fast weak pulse, nausea. Move to a cool place and drink water.",
      "Heat stroke is a life-threatening emergency: hot dry skin, confusion, loss of consciousness. Call 911 immediately and cool the person rapidly.",
      "Cold warning signs: shivering, slurred speech, confusion, loss of coordination — these are signs of hypothermia.",
      "Frostbite affects extremities first: fingers, toes, ears, nose. Skin becomes white, waxy, and numb.",
      "Prevention: dress in layers for cold, stay hydrated in heat, take breaks, know the conditions before going outside."
    ],
    discussion: [
      {q:"Why is heat stroke more dangerous than heat exhaustion?",
       answers:["Heat exhaustion means the body is struggling but still sweating and cooling itself","Heat stroke means the cooling system has failed — body temperature is rising fast","Without rapid cooling, heat stroke causes brain damage and death within minutes"]},
      {q:"What should you never do to warm up someone with frostbite?",
       answers:["Never rub frostbitten tissue — the ice crystals inside cause damage when moved","Never put frostbitten skin in hot water — rapid warming causes severe pain and additional damage","Do not rewarm if there is a chance of refreezing"]}
    ],
    challenge: "Check the weather forecast before going outside each day this week. If it is hot, plan your water intake and shade time. If it is cold, check your layers.",
    tuesday: {
      low:  {title:"Hot day rules", activity:"Make a list of five things you should do on a very hot day to stay safe. What would you do if a friend started feeling dizzy on a hot day?"},
      mid:  {title:"Heat illness progression", activity:"Research the stages from heat cramps to heat exhaustion to heat stroke. What are the symptoms at each stage? What is the correct response?"},
      high: {title:"Physiology of heat regulation", activity:"Research how the body regulates temperature: sweating, vasodilation, and the role of hydration. What happens physiologically during heat stroke?"}
    },
    wednesday: {
      low:  {title:"Cold day rules", activity:"Name five things you should do on a very cold day. What are the first signs that someone is too cold?"},
      mid:  {title:"Layering system", activity:"Research the three-layer clothing system for cold weather: base layer, insulating layer, and shell layer. What does each layer do?"},
      high: {title:"Wilderness thermal emergencies", activity:"Research field treatment for both hypothermia and heat stroke in a wilderness setting where 911 may be hours away."}
    },
    thursday: {
      low:  {title:"Temperature safety quiz", activity:"What are two signs someone is too hot? What do you do first? What are two signs someone is too cold? Name one thing you will do differently this week."},
      mid:  {title:"Local risk assessment", activity:"What are the temperature extremes in your region? What specific activities in your life carry thermal risk?"},
      high: {title:"Prevention plan", activity:"Design a complete personal thermal safety protocol for your region: hydration plan for summer, layering system for winter, and action steps for each type of emergency."}
    }
  },

  "Stranger safety basics": {
    gradeHooks: {
      low:  "Most people in the world are kind and safe. But sometimes people we do not know try to do things that are not safe. Today we learn some simple rules that help keep you protected.",
      mid:  "Stranger safety is not about being afraid of everyone you do not know. It is about recognizing unsafe situations and knowing exactly what to do when something does not feel right.",
      high: "Personal safety awareness goes beyond stranger danger. It is about reading situations, trusting your instincts, and having a clear action plan."
    },
    materials: ["Nothing needed"],
    steps: [
      "Most strangers are safe — but you cannot always tell who is and who is not, which is why we follow rules.",
      "It is never okay for an adult you do not know to ask you for help, offer you something, or ask you to go somewhere with them.",
      "Trusted adults in your life include: parents, grandparents, teachers, and people your parents have specifically approved.",
      "If something feels wrong, trust that feeling. You do not have to be polite if you feel unsafe.",
      "Know what to do: say no loudly, get away fast, find a safe adult, and tell someone you trust.",
      "Safe strangers in an emergency: police officers in uniform, firefighters, store employees behind a counter."
    ],
    discussion: [
      {q:"If a stranger asks you to help them find their lost dog, what should you do?",
       answers:["Say no and walk away — adults do not need children to help them find pets","This is one of the most common approaches used by people trying to lure children","You can say no without explaining yourself — no is a complete sentence"]},
      {q:"What is the difference between a stranger who is safe and one who is not?",
       answers:["You cannot reliably tell by looking — that is why we follow rules instead of making judgments","Safe strangers in emergencies are easy to identify: uniformed officers, store employees at registers","The behavior tells you more than the appearance — anyone who asks you to keep a secret from your parents is unsafe"]}
    ],
    challenge: "Practice saying no loudly and walking away with a parent this week. It feels awkward — that is why we practice.",
    tuesday: {
      low:  {title:"Role play", activity:"Practice with a grown-up. They play a stranger who asks for your help finding something. You practice saying no thank you and walking away. Do it three times until it feels confident."},
      mid:  {title:"Scenario sorting", activity:"A parent gives you five scenarios. For each one you decide: safe situation or unsafe? Talk through your reasoning."},
      high: {title:"Safety planning", activity:"Think through three different scenarios where you might be approached by someone who makes you uncomfortable. For each, write out your specific action plan."}
    },
    wednesday: {
      low:  {title:"Safe adults list", activity:"With a grown-up, make a list of the five adults you can always go to if you feel unsafe or scared. Write their names and how to reach them."},
      mid:  {title:"Instinct research", activity:"Research the concept of intuition in personal safety. What does it mean to trust your gut? Why do people sometimes override their instincts to be polite?"},
      high: {title:"Digital safety connection", activity:"Research how stranger danger principles apply online: anonymous contacts, requests for personal information, pressure to keep conversations secret."}
    },
    thursday: {
      low:  {title:"Safety quiz", activity:"What do you do if a stranger asks you to go somewhere with them? Who are three safe adults in your life? What do you say if someone asks you to keep a secret from your parents?"},
      mid:  {title:"Confidence check", activity:"Could you say no loudly and walk away from an uncomfortable situation without hesitating? Practice the response one more time with a parent."},
      high: {title:"Teaching younger kids", activity:"Teach a younger child the key stranger safety rules in a way that is reassuring rather than scary. The goal is confident awareness, not fear."}
    }
  },

  "Helping at home — simple chores": {
    gradeHooks: {
      low:  "Every family is a team, and every team member has a job. Helping at home is one of the ways you show your family you are a team player. And the things you learn now will make you much more capable as you grow up.",
      mid:  "The ability to run a household is a life skill most people learn too late. Today we look at what it actually takes to keep a home running — and how much you are already capable of contributing.",
      high: "Self-sufficiency starts at home. The practical skills of household management — cooking, cleaning, maintenance, organization — are foundational to independence."
    },
    materials: ["Whatever cleaning supplies are age-appropriate in your home"],
    steps: [
      "A home needs regular care: cleaning, tidying, laundry, dishes, and maintenance.",
      "Start with the task in front of you. Do not wait to be asked — notice what needs doing.",
      "Do the job completely. Half-done chores often create more work later.",
      "Consistency beats intensity. Ten minutes of daily tidying is easier than hours of weekend catch-up.",
      "Learn how things work before you clean or fix them — the wrong product on the wrong surface can cause damage.",
      "Taking pride in your space is a form of respect — for yourself and for the people you live with."
    ],
    discussion: [
      {q:"Why is learning to help at home important even if you have a family that handles everything right now?",
       answers:["One day you will live independently and need these skills — learning them now is much easier","Helping at home builds awareness of what it takes to maintain a household","It is a form of respect and care for the people you live with"]},
      {q:"What is the difference between doing a chore and doing a chore well?",
       answers:["Doing it well means actually completing it, not stopping halfway","It means noticing the details — cleaning the corners not just the middle","It means not having to be asked twice or reminded to finish"]}
    ],
    challenge: "Pick one chore you do not usually do and do it completely without being asked this week. Do it well — not just well enough.",
    tuesday: {
      low:  {title:"My chore today", activity:"Pick one chore from a list a grown-up gives you. Do it completely and show a grown-up when you are done. What would doing it even better look like?"},
      mid:  {title:"Household inventory", activity:"Walk through your home and make a list of every regular task it takes to keep the house running. Who does each one? Is the work distributed fairly?"},
      high: {title:"Full household audit", activity:"Make a complete list of all household tasks — daily, weekly, monthly, and seasonal. Estimate how long each takes. Where are the gaps?"}
    },
    wednesday: {
      low:  {title:"Learn one new thing", activity:"Ask a grown-up to teach you one household skill you have never done before: folding laundry, loading the dishwasher, sweeping properly. Practice it twice."},
      mid:  {title:"Do it without reminders", activity:"Pick two chores and complete them today — without being asked and without any reminders."},
      high: {title:"Systems thinking", activity:"Research household management systems — daily routines, weekly resets, monthly deep cleans. Design a simple system for your family that distributes work fairly."}
    },
    thursday: {
      low:  {title:"Team player", activity:"Name three things you can do to help your family at home without being asked. Pick one and do it right now."},
      mid:  {title:"Reflect on contribution", activity:"Honestly: how much do you contribute to your household right now? What is one area you could do more? Make a specific commitment for next week."},
      high: {title:"Independence check", activity:"If you had to live alone for a week, could you keep your space clean, cook your meals, do your laundry, and handle basic household needs? Rate your readiness and identify your biggest skill gap."}
    }
  },

  "Being kind in an emergency": {
    gradeHooks: {
      low:  "When something scary happens, everyone feels afraid — even grown-ups. Being kind and calm helps everyone feel a little safer. Today we learn how to be a helper and a comforter when things get hard.",
      mid:  "In an emergency, how people treat each other matters enormously. Kindness and calm leadership reduce panic, build cooperation, and save lives.",
      high: "Prosocial behavior under stress is a learnable skill. Understanding the psychology of how people respond in emergencies — and how to counter the worst instincts — makes you genuinely more valuable in a crisis."
    },
    materials: ["None needed"],
    steps: [
      "Emergencies bring out both the best and worst in people. Choose to be the best.",
      "Your calm is contagious — if you stay calm, others around you tend to calm down too.",
      "Check on the people nearest to you first: are they okay? Do they need help?",
      "If someone is panicking, speak to them calmly: I am here. We are going to be okay. Here is what we do next.",
      "Share resources when possible — in a crisis, generosity builds the cooperation everyone needs.",
      "After an emergency, check in with people. Ask how they are doing. Listen without judgment."
    ],
    discussion: [
      {q:"Why does one calm person in a group make such a difference during an emergency?",
       answers:["Emotions are contagious — fear and panic spread, but so does calm","A calm person can think more clearly and give others something to orient around","Research on disaster response consistently shows that calm leadership reduces casualties"]},
      {q:"What is the difference between helping someone who is panicking and telling them to calm down?",
       answers:["Telling someone to calm down almost never works and can escalate their distress","Helping means giving them something concrete to do: look at me, take a breath, follow me","Giving a panicking person a task focuses their energy and restores a sense of agency"]}
    ],
    challenge: "Practice staying calm this week in a small stressful moment. Notice whether your calm affects the people around you.",
    tuesday: {
      low:  {title:"Calm words practice", activity:"Practice saying these phrases out loud with a calm, steady voice: I am right here with you. We are going to be okay. Take a breath with me. Let us figure this out together."},
      mid:  {title:"Bystander effect", activity:"Research the bystander effect: why do people sometimes fail to help in emergencies when others are present? How do you counteract it in yourself?"},
      high: {title:"Psychological first aid", activity:"Research Psychological First Aid (PFA): the evidence-based approach to supporting people in the immediate aftermath of a crisis. What are its core principles?"}
    },
    wednesday: {
      low:  {title:"Helping hands", activity:"Think of a time when someone was kind to you when things were hard. How did it make you feel? Practice one act of kindness today toward someone who seems stressed or upset."},
      mid:  {title:"Leadership in crisis", activity:"Research examples of ordinary people who showed remarkable calm leadership in emergencies. What did they do? What made it effective?"},
      high: {title:"Trauma-informed response", activity:"Research trauma-informed care: what does it mean to respond to someone in a way that accounts for trauma? What behaviors help and which inadvertently harm?"}
    },
    thursday: {
      low:  {title:"Kindness quiz", activity:"Why does staying calm help others? What do you say to someone who is really scared? What do you do first in an emergency — help others or make sure you are safe?"},
      mid:  {title:"Reflect on your instincts", activity:"Honestly: when things get stressful, do you tend to freeze, panic, withdraw, or step up? What is your natural instinct? What would you want it to be?"},
      high: {title:"Community resilience", activity:"Research what makes communities resilient after disasters. What role does social cohesion play? What role does individual prosocial behavior play?"}
    }
  },

  "If I get lost — what to do": {
    gradeHooks: {
      low:  "Getting separated from a grown-up is really scary. But if you know exactly what to do, you can stay safe until you find each other again. Today we learn the steps.",
      mid:  "Getting lost is more common than people think — and panic is the biggest danger. Today we replace panic with a clear, practiced plan.",
      high: "Being lost triggers a predictable set of poor decisions. Understanding the psychology of being lost and having a practiced response prevents those mistakes."
    },
    materials: ["A small card to write your address and parent phone number on"],
    steps: [
      "Stop as soon as you realize you are lost. Do not keep moving in the wrong direction.",
      "Stay calm. Take a breath. Panicking burns energy and leads to worse decisions.",
      "Stay put if you are in a natural environment — rescuers search where you were last seen.",
      "In a public place, go to a safe adult: a store employee, security guard, or police officer.",
      "Know your parent phone number by heart and your home address.",
      "Never go with a stranger to find your parents — go to a safe location and have a trusted adult call."
    ],
    discussion: [
      {q:"Why is staying put one of the most important rules when lost in a natural environment?",
       answers:["Search and rescue teams begin searching from where you were last seen","Moving away from that point expands the search area dramatically","The urge to keep moving is powerful — but almost always makes the situation worse"]},
      {q:"What makes a safe adult in a public place different from a stranger on the street?",
       answers:["Store employees and security staff are identifiable by uniforms and are in fixed, accountable locations","They have access to communication systems and are trained for exactly this situation","A person at a register or service desk is accountable to their employer"]}
    ],
    challenge: "Make sure you know your parent phone number and home address by heart — not just in your phone, but in your memory. Test yourself right now without looking.",
    tuesday: {
      low:  {title:"Know your info", activity:"Say your full home address out loud right now. Then say one parent phone number. Practice both until you can say them instantly. Make a small card with both and put it in your backpack."},
      mid:  {title:"Lost in public practice", activity:"Role play: you are in a large store and get separated from your parent. Walk through exactly what you do: stop, stay calm, go to a store employee, give your name and parent contact."},
      high: {title:"Wilderness lost psychology", activity:"Research the psychology of being lost: what decisions do people typically make that worsen the situation? What is the STOP mnemonic — Stop, Think, Observe, Plan?"}
    },
    wednesday: {
      low:  {title:"Safe adults practice", activity:"Name three types of safe adults you could approach in a public place if you were lost. Practice what you would say: Excuse me, I am lost. My name is and my parent phone number is."},
      mid:  {title:"Urban lost scenario", activity:"You are in an unfamiliar city neighborhood and your phone is dead. Walk through your plan: find a safe location, identify a safe adult, communicate your situation clearly."},
      high: {title:"Wilderness survival priorities", activity:"Research the survival rule of threes and the priorities when lost in a wilderness setting: shelter, water, signaling, and navigation."}
    },
    thursday: {
      low:  {title:"Lost quiz", activity:"What is the first thing you do if you get lost? Where do you go in a store if you cannot find your grown-up? Who should you never go with to find your parents? Say your phone number and address right now."},
      mid:  {title:"Confidence check", activity:"Could you handle getting separated from your family in a crowded public place calmly and effectively right now? Walk through your plan out loud."},
      high: {title:"Teaching plan", activity:"Design a lesson for a younger child on what to do if they get lost. Make it memorable, age-appropriate, and empowering rather than scary."}
    }
  },

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


/* =======================================
   PORTFOLIO PDF PRINT FUNCTION
   Opens a clean print window — not the app
======================================= */
