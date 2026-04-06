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

  "Treating a bruise or bump": {
    gradeHooks: {
      low: "Bumps and bruises happen when we play! We can help them feel better with rest, ice, and time.",
      mid: "Bruises result from broken capillaries under the skin. Proper care reduces swelling and speeds healing.",
      high: "Soft tissue injury management follows the RICE protocol. Knowing when a bruise signals deeper injury is important."
    },
    materials: ["Ice pack or bag of frozen peas", "Cloth or towel to wrap it"],
    steps: [
      "Ask: have you ever gotten a big bump? What did it feel like?",
      "Explain: a bruise happens when tiny blood vessels under the skin break. The blood pools and makes that purple color.",
      "Introduce RICE: Rest, Ice, Compression, Elevation.",
      "Demonstrate: wrap an ice pack in a cloth (never put ice directly on skin) and hold it on the bump for 10\u201320 minutes.",
      "Discuss: most bruises heal on their own in 1\u20132 weeks, fading from purple to yellow as the body reabsorbs the blood."
    ],
    discussion: [
      {q:"Why do we wrap the ice pack in a cloth instead of putting ice directly on skin?", answers:["Direct ice can cause frostbite or damage to the skin. A cloth protects while still cooling."]},
      {q:"When would a bruise need a doctor?", answers:["If it is very large, extremely painful, or happened after a head injury — especially if the person feels dizzy or confused."]}
    ],
    challenge: "Make a RICE reminder card to keep in your first aid kit. Draw each step with a simple picture.",
    tuesday:   { low: {title:"Ice pack craft", activity:"Make a reusable ice pack: fill a zip bag with dish soap and freeze. Use a sock as the cover."}, mid: {title:"Bruise stages chart", activity:"Research the color stages of a healing bruise: red/purple \u2192 blue \u2192 green \u2192 yellow. What causes each color change?"}, high: {title:"Hematoma vs bruise", activity:"Research the difference between a superficial bruise and a hematoma. When does a hematoma require medical treatment?"} },
    wednesday: { low: {title:"RICE practice", activity:"Act out: you bump your shin on the coffee table. Walk through all 4 RICE steps with a pretend ice pack."}, mid: {title:"Swelling science", activity:"Research why injuries swell. What is inflammation and what purpose does it serve in healing?"}, high: {title:"Sports injury protocol", activity:"Research how athletic trainers assess and treat soft tissue injuries on the field. What is the on-field vs off-field protocol?"} },
    thursday:  { low: {title:"Bruise color chart", activity:"Draw a bruise healing chart showing the colors over 7 days. Label each day and color."}, mid: {title:"Anti-inflammatory foods", activity:"Research 5 foods that reduce inflammation naturally. How do they work and when would you eat them?"}, high: {title:"PRICE vs RICE", activity:"Research the updated PRICE protocol (Protection added to RICE). Why was protection added and when does it matter?"} }
  },

  "Smoke alarms — testing and why": {
    gradeHooks: {
      low: "Smoke alarms wake us up if there is a fire. We test them every month to make sure they work!",
      mid: "Smoke alarms are the single most effective tool for surviving a home fire. Proper testing and placement save lives.",
      high: "Smoke alarm technology, placement standards, interconnected systems, and maintenance schedules are components of home fire safety planning."
    },
    materials: ["Smoke alarm in your home"],
    steps: [
      "Find your home\u2019s smoke alarms. Count them together.",
      "Explain: smoke alarms detect smoke particles in the air and sound a loud alarm to wake everyone up.",
      "Warn: it will be loud! Then press the test button together.",
      "Discuss: you should test every smoke alarm every month. Change batteries every year even if they still work.",
      "Review: if the alarm sounds for real — get low, feel the door, get out, go to the meeting spot. Never go back for anything."
    ],
    discussion: [
      {q:"Why do smoke alarms sometimes go off when there is no fire?", answers:["Cooking smoke, steam, or even a very dusty room can trigger a sensitive alarm. Open windows but don\u2019t remove the battery."]},
      {q:"How many smoke alarms should a home have?", answers:["At least one on every level, one inside each bedroom, and one outside each sleeping area."]}
    ],
    challenge: "Test every smoke alarm in your home. Write down which ones work and which need new batteries.",
    tuesday:   { low: {title:"Monthly tester", activity:"Make a smoke alarm testing calendar. Mark the first day of each month for the next 12 months."}, mid: {title:"Alarm placement audit", activity:"Draw your home\u2019s floor plan and mark where each alarm is. Are any rooms or areas missing coverage?"}, high: {title:"Ionization vs photoelectric", activity:"Research the two types of smoke alarms. Which detects fast-flaming fires better? Which detects slow smoldering fires? What does NFPA recommend?"} },
    wednesday: { low: {title:"Fire escape review", activity:"Practice the fire escape plan. Sound the alarm, low crawl to the door, feel it, get out, meet at the spot."}, mid: {title:"Carbon monoxide alarms", activity:"Research carbon monoxide alarms. Why are they often sold combined with smoke alarms? Where should they be placed?"}, high: {title:"Smart alarm systems", activity:"Research interconnected and smart smoke alarm systems. What are the advantages of alarms that all sound at once when one detects smoke?"} },
    thursday:  { low: {title:"Alarm maintenance kit", activity:"Gather what you need to maintain alarms: batteries, a stool, and a maintenance log. Set up your monthly routine."}, mid: {title:"Escape time calculation", activity:"Research: how quickly can a house fire become unescapable? Calculate how many minutes your family has from alarm to exit."}, high: {title:"Home fire safety audit", activity:"Use the NFPA home fire safety checklist at nfpa.org. Score your home and list the top 3 improvements needed."} }
  },

  "Cardinal directions — North South East West": {
    gradeHooks: {
      low: "North, South, East, and West are the four main directions. The sun rises in the East and sets in the West!",
      mid: "Cardinal directions are the foundation of navigation, map reading, and orientation in the natural world.",
      high: "Cardinal directions, magnetic declination, and true north vs magnetic north are foundational navigation concepts."
    },
    materials: ["Paper and pencil", "Compass (or phone compass app)"],
    steps: [
      "Go outside. Ask: does anyone know which way is North?",
      "Trick for remembering: Never Eat Soggy Waffles — going clockwise: North, East, South, West.",
      "Use a compass or phone app to find actual North. Orient yourself.",
      "Practice: point North, then East, then South, then West without looking at the compass.",
      "Find a landmark in each direction from where you are standing. Remember them."
    ],
    discussion: [
      {q:"How did people find North before compasses?", answers:["By the North Star (Polaris) at night, or by watching the sun — it rises in the East and sets in the West."]},
      {q:"Why do maps almost always put North at the top?", answers:["It\u2019s a convention that developed over centuries. It helps everyone use maps consistently."]}
    ],
    challenge: "Stand in your front yard and identify a landmark in each of the 4 cardinal directions. Write them down.",
    tuesday:   { low: {title:"Direction art", activity:"Draw a compass rose with all 4 directions labeled. Decorate each point with a local landmark."}, mid: {title:"Intermediate directions", activity:"Add NE, NW, SE, SW to your compass rose. Research: what are these called and when are they used?"}, high: {title:"Magnetic declination", activity:"Research magnetic declination. Why does a compass not always point to true geographic North? How do you adjust for it?"} },
    wednesday: { low: {title:"Sun tracking", activity:"Check where the sun is in the morning, noon, and afternoon. Record which direction it appears to be in each time."}, mid: {title:"Map orientation", activity:"Print or draw a map of your neighborhood. Orient it with a compass so North on the map matches real North."}, high: {title:"Navigation history", activity:"Research how sailors navigated before GPS using stars, compasses, and dead reckoning. Explain the concept of dead reckoning."} },
    thursday:  { low: {title:"Direction scavenger hunt", activity:"Create a direction hunt: go 10 steps North, 5 steps East, 3 steps South. Can you find the hidden object?"}, mid: {title:"Grid coordinates", activity:"Research latitude and longitude. How do lines running North-South and East-West help pinpoint any location on Earth?"}, high: {title:"GPS vs compass", activity:"Compare GPS navigation to compass navigation. When would a compass be more reliable? What are GPS failure scenarios?"} }
  },

  "Drawing my street from memory": {
    gradeHooks: {
      low: "We can draw our street from memory! It helps us know our neighborhood and find our way home.",
      mid: "Mental mapping — the ability to visualize and reproduce spatial layouts — is a key navigation and safety skill.",
      high: "Cognitive mapping, spatial memory, and sketch mapping are studied in geography and psychology as tools for place-based understanding."
    },
    materials: ["Large paper", "Pencil and colored pencils"],
    steps: [
      "Ask: without looking outside, can you draw your street? What do you remember?",
      "From memory only, sketch your street: your house, neighbors\u2019 houses, trees, driveways, stop signs.",
      "Now go outside or look at a map and compare. What did you get right? What did you miss?",
      "Update your drawing with what you learned.",
      "Add: the direction your street runs (North-South or East-West)."
    ],
    discussion: [
      {q:"Why is it useful to know your street well enough to draw it?", answers:["It means you know your neighborhood, can give directions, find your way home, and help someone else find you."]},
      {q:"What details on your street could help emergency services find your house?", answers:["House number, color of house, nearby landmark (big tree, fire hydrant, corner of two streets)"]}
    ],
    challenge: "Draw your street AND the next street over from memory. Check your accuracy with a walk.",
    tuesday:   { low: {title:"Add the details", activity:"Update your street map with colors, house numbers, and any landmarks you missed. How accurate is it now?"}, mid: {title:"Neighborhood map expansion", activity:"Extend your map to a 3-block radius. Add the nearest school, store, and park."}, high: {title:"Sketch map vs satellite map", activity:"Compare your hand-drawn map to a satellite view of your street. Analyze the differences in detail, scale, and accuracy."} },
    wednesday: { low: {title:"Give directions", activity:"Using your map, give step-by-step walking directions from your home to the nearest park or store."}, mid: {title:"Map symbols", activity:"Add a legend to your neighborhood map with at least 6 symbols. Use standard map conventions where possible."}, high: {title:"Mental map research", activity:"Research cognitive mapping theory (Kevin Lynch\u2019s work on city imageability). What are the 5 elements of a mental map?"} },
    thursday:  { low: {title:"Night vs day differences", activity:"Think about what your street looks like at night vs daytime. What landmarks are visible at night? Add streetlights to your map."}, mid: {title:"Emergency route map", activity:"Mark two evacuation routes from your home on your neighborhood map. One primary, one alternate."}, high: {title:"Participatory mapping", activity:"Research participatory mapping — communities drawing their own maps. How is it used in disaster preparedness and urban planning?"} }
  },

  "Tying your shoes — double knot": {
    gradeHooks: {
      low: "Tying our shoes keeps us safe from tripping! The double knot keeps them tied all day.",
      mid: "Shoe tying is a fine motor skill milestone. The double knot adds security for active play and sports.",
      high: "Knot mechanics, tension distribution, and the physics of why a double knot holds better than a single are practical applied science."
    },
    materials: ["Lace-up shoes", "Practice board if available (or a spare lace)"],
    steps: [
      "Start with both laces even. Cross right over left and pull through to make the base knot.",
      "Make a loop (bunny ear) with one lace.",
      "Wrap the other lace around the loop and push it through to make the second loop.",
      "Pull both loops tight.",
      "Now the double knot: cross the loops over each other and tie one more time, just like step 2\u20134.",
      "Practice 5 times in a row until it feels natural."
    ],
    discussion: [
      {q:"Why does a double knot stay tied better than a single bow?", answers:["The second knot adds friction that prevents the loops from pulling through, even during active movement."]},
      {q:"What could happen if your shoe comes untied during a run or on stairs?", answers:["You could trip and fall, which could cause a serious injury. Checking laces before activity is a good habit."]}
    ],
    challenge: "Tie both shoes with a double knot every morning this week without any help. Time yourself each day.",
    tuesday:   { low: {title:"Timed practice", activity:"Time how long it takes to tie both shoes. Try to beat your time each day this week."}, mid: {title:"Knot types research", activity:"Research 3 other useful knots: square knot, slip knot, bowline. Practice each on a spare lace."}, high: {title:"Knot physics", activity:"Research how friction and tension work in knots. Why do some knots hold under load while others slip?"} },
    wednesday: { low: {title:"Teach someone", activity:"Teach a younger child or stuffed animal how to tie shoes. Walk through every step out loud."}, mid: {title:"Different lacing styles", activity:"Research 3 different ways to lace shoes (straight lace, display lace, loop back). Why might each be used?"}, high: {title:"Rope and knot applications", activity:"Research how knot knowledge is used in sailing, climbing, construction, and surgery. Choose one and explain the specific knots used."} },
    thursday:  { low: {title:"Shoe care routine", activity:"Learn to tie, check, and re-tie if loose. Practice the full routine: tie, take 10 steps, check snugness, re-tie if needed."}, mid: {title:"Alternative fasteners", activity:"Research the history of shoe fasteners: laces, velcro, buckles, zippers, elastic. When was each invented?"}, high: {title:"Ian Knot", activity:"Research the Ian Knot (a faster, more balanced shoe-tying method). Learn it and compare how it holds vs the traditional method."} }
  },

  "Harvesting — picking what we grew": {
    gradeHooks: {
      low: "When our plants are ready, it\u2019s time to harvest! We pick the fruit or vegetables and then we can eat them.",
      mid: "Harvesting at peak ripeness maximizes flavor and nutrition. Knowing harvest indicators for different crops is a key gardening skill.",
      high: "Harvest timing, post-harvest handling, seed saving, and the connection between home growing and food system resilience are important topics."
    },
    materials: ["Your container garden plant (if growing)", "OR a grocery store item to examine for ripeness cues"],
    steps: [
      "Visit your container garden or look at a fruit or vegetable from the kitchen.",
      "Ask: how do you know when something is ready to pick?",
      "Discuss ripeness signs: color change, smell, firmness, ease of separation from the plant.",
      "Demonstrate or practice gentle harvesting: twist and pull or snip with scissors — never yank.",
      "Talk about what to do right after harvesting: rinse, store correctly, eat soon for best flavor."
    ],
    discussion: [
      {q:"What happens if you pick a fruit or vegetable too early?", answers:["It won\u2019t have developed full flavor or nutrients. It may also be harder and less sweet."]},
      {q:"What happens if you wait too long to harvest?", answers:["It overripens, rots, falls off, and can attract pests. It also stops the plant from producing more."]}
    ],
    challenge: "Harvest something from your garden (or identify the ripeness stage of 3 items at the grocery store).",
    tuesday:   { low: {title:"Ripeness chart", activity:"Draw 4 stages of ripeness for one fruit (e.g., banana): unripe, nearly ripe, ripe, overripe. Label the color and texture of each."}, mid: {title:"Harvest indicators by crop", activity:"Research harvest indicators for 5 crops: tomatoes, cucumbers, lettuce, beans, and squash. What do you look for in each?"}, high: {title:"Post-harvest biology", activity:"Research what happens chemically in fruit after harvest (ethylene production, cell wall breakdown). How does this affect storage?"} },
    wednesday: { low: {title:"Taste test", activity:"Taste something harvested at peak ripeness vs something slightly underripe. Describe the flavor difference."}, mid: {title:"Seed saving", activity:"Research how to save seeds from a tomato or pepper. What is the process and why is seed saving important?"}, high: {title:"Food loss statistics", activity:"Research global food loss at the harvest stage. What percentage of food is lost before it reaches consumers? What are the main causes?"} },
    thursday:  { low: {title:"From garden to table", activity:"Make a simple meal or snack using something you grew or something very fresh. Draw the path from seed to plate."}, mid: {title:"Storage methods", activity:"Research the best storage methods for 5 different vegetables. Which need refrigeration, which do better at room temp, and which can be stored long-term?"}, high: {title:"Preservation techniques", activity:"Research 4 food preservation methods: canning, freezing, dehydrating, fermenting. Compare shelf life, equipment needed, and nutritional retention."} }
  },

  "Water from rain — puddles and collection": {
    gradeHooks: {
      low: "Rain makes puddles! That water came from clouds. We can even collect rainwater to water our plants.",
      mid: "Rainwater harvesting is a practical skill for water conservation and emergency preparedness.",
      high: "Rainwater collection systems, greywater reuse, water law, and sustainable water management connect environmental science to practical living."
    },
    materials: ["A bucket or container", "Measuring cup"],
    steps: [
      "After rain (or simulate with a watering can), look at a puddle together. Where did that water come from?",
      "Trace it: cloud \u2192 rain \u2192 ground \u2192 evaporates back to cloud.",
      "Explain: we can collect rainwater in a bucket or barrel to use for watering plants.",
      "Set out a container to catch rain (or measure how much you can collect from a simulated pour).",
      "Discuss: rainwater is good for plants but needs filtering or boiling before people drink it."
    ],
    discussion: [
      {q:"Is rainwater safe to drink straight from a collection barrel?", answers:["Not without filtering or boiling. It can pick up dirt, bird droppings, and pollutants from roofs and air."]},
      {q:"Why do plants often do better with rainwater than tap water?", answers:["Rainwater is slightly acidic, soft (no minerals), and room temperature — all preferred by most plants."]}
    ],
    challenge: "Set out a container the next time it rains. Measure how much water you collected and use it to water your plants.",
    tuesday:   { low: {title:"Rain gauge", activity:"Make a simple rain gauge from a clear bottle with a ruler taped to the side. Track rainfall for one week."}, mid: {title:"Rainwater barrel design", activity:"Research rain barrel designs. How do you connect one to a downspout? What features make a good collection system?"}, high: {title:"Water law research", activity:"Research rainwater collection laws in Florida. Is it legal? Are there restrictions? How do these laws vary by state?"} },
    wednesday: { low: {title:"Puddle evaporation", activity:"Trace a puddle outline with chalk after rain. Check it every hour. How fast does it evaporate? Does sun vs shade matter?"}, mid: {title:"Rooftop collection math", activity:"Calculate: if your roof is 1500 sq ft and gets 1 inch of rain, how many gallons can theoretically be collected? (1 inch per sq ft = 0.623 gallons)"}, high: {title:"Greywater systems", activity:"Research greywater reuse systems for homes. What is greywater, how is it treated, and what can it be used for legally?"} },
    thursday:  { low: {title:"Water cycle art", activity:"Draw the full water cycle using today\u2019s rain as your starting point. Label evaporation, condensation, precipitation, collection."}, mid: {title:"Drought resilience", activity:"Research how rainwater harvesting helps communities during droughts. Find one real-world example from a water-scarce region."}, high: {title:"Permaculture water design", activity:"Research permaculture water harvesting principles: swales, berms, and keyline design. How do these work to capture and slow water on a property?"} }
  },

  "Compass rose on a map": {
    gradeHooks: {
      low: "A compass rose is the star-shaped symbol on a map that shows which way is North, South, East, and West.",
      mid: "The compass rose is a key map element. Reading it correctly allows accurate navigation and direction-giving.",
      high: "The compass rose\u2019s history, its role in cartography, and how it connects to magnetic and true north are foundational geography topics."
    },
    materials: ["A printed or drawn map", "Paper and colored pencils"],
    steps: [
      "Find a compass rose on any map. Point to it and ask: what do you think this symbol does?",
      "Explain: the compass rose shows direction. Every map needs one so you can orient yourself.",
      "Name all 8 points: N, NE, E, SE, S, SW, W, NW.",
      "Draw your own compass rose on paper. Make it decorative — traditional compass roses are beautiful.",
      "Add a compass rose to your neighborhood map from earlier this week."
    ],
    discussion: [
      {q:"What does it mean to \u2018orient\u2019 a map?", answers:["To turn the map so North on the map matches actual North in the real world. It helps you navigate accurately."]},
      {q:"If you are walking East on your map, which direction are you facing in real life?", answers:["East — but only if the map is properly oriented with North at the top and you\u2019re aligned with it."]}
    ],
    challenge: "Find 3 different maps (online, in a book, or on a sign). Locate the compass rose on each and compare their designs.",
    tuesday:   { low: {title:"Compass rose art", activity:"Design an elaborate compass rose with 16 points. Color each direction a different color and label all 16."}, mid: {title:"Map elements study", activity:"Research the 5 essential elements of any map: title, compass rose, legend, scale, and source. Find each on a real map."}, high: {title:"History of the compass rose", activity:"Research the origin of the compass rose design. How did it evolve from wind roses used by sailors to modern map symbols?"} },
    wednesday: { low: {title:"Direction game", activity:"Play: one person gives a direction (go 3 steps NE) and the other follows. Use your compass rose as a guide."}, mid: {title:"Bearing and azimuth", activity:"Research compass bearings. What is a bearing of 090\u00b0? Of 270\u00b0? How do pilots and sailors use bearings instead of direction names?"}, high: {title:"True north vs magnetic north", activity:"Research the difference between true north, magnetic north, and grid north. Why do these differ and how does it affect navigation?"} },
    thursday:  { low: {title:"Add to neighborhood map", activity:"Add a well-drawn compass rose to your neighborhood map. Make sure it accurately shows North for your area."}, mid: {title:"Orienteering basics", activity:"Research orienteering as a sport. How do competitors use maps and compasses to navigate? What skills does it require?"}, high: {title:"GPS coordinate systems", activity:"Research how GPS uses coordinate systems rather than compass directions. How does the WGS84 datum work and why does it matter?"} }
  },

  "Simple stretches and staying active": {
    gradeHooks: {
      low: "Stretching keeps our bodies flexible and helps us avoid getting hurt when we play and learn.",
      mid: "Regular stretching improves flexibility, reduces injury risk, and supports long-term joint and muscle health.",
      high: "Exercise physiology, the difference between static and dynamic stretching, and building sustainable fitness habits are key health topics."
    },
    materials: ["Open floor space", "Yoga mat or towel (optional)"],
    steps: [
      "Ask: has your body ever felt stiff after sitting for a long time?",
      "Explain: stretching helps our muscles stay long and loose so they work better and hurt less.",
      "Lead 5 simple stretches: neck rolls, shoulder stretch, forward fold, quad stretch, calf stretch.",
      "Hold each stretch for 20\u201330 seconds. No bouncing — slow and steady.",
      "Discuss: morning stretches wake up the body, and stretching after exercise helps muscles recover."
    ],
    discussion: [
      {q:"Why do athletes warm up before and cool down after exercise?", answers:["Warming up prepares muscles and joints for activity. Cooling down helps blood return to normal and reduces soreness."]},
      {q:"What is the difference between a stretch that feels good and one that might be hurting you?", answers:["A good stretch feels like a gentle pull. Pain is a signal to stop — you\u2019re pushing too far."]}
    ],
    challenge: "Do a 5-minute stretch routine every morning this week. Make your own routine with at least 6 stretches.",
    tuesday:   { low: {title:"Stretch chart", activity:"Draw a stretch chart with 6 stretches. Show each position with a stick figure and label which body part it helps."}, mid: {title:"Static vs dynamic stretching", activity:"Research the difference between static stretching (hold) and dynamic stretching (move). When should you use each?"}, high: {title:"Flexibility training science", activity:"Research how flexibility training changes muscle and connective tissue over time. What is the role of fascia?"} },
    wednesday: { low: {title:"Movement break routine", activity:"Design a 3-minute movement break to do between school subjects: 2 stretches, 10 jumping jacks, 5 deep breaths."}, mid: {title:"Exercise and brain function", activity:"Research how physical activity affects focus and learning. What does research say about exercise and academic performance?"}, high: {title:"Injury prevention research", activity:"Research how lack of flexibility contributes to common sports injuries. What specific stretches prevent the most common injuries in youth sports?"} },
    thursday:  { low: {title:"Yoga for kids", activity:"Try 5 basic yoga poses: child\u2019s pose, downward dog, warrior 1, tree pose, happy baby. Hold each for 5 deep breaths."}, mid: {title:"Weekly fitness plan", activity:"Design a balanced weekly fitness plan: 3 days cardio, 2 days strength, daily stretching. Write out each day\u2019s activity."}, high: {title:"Sedentary behavior research", activity:"Research the health effects of prolonged sitting. What does research say about standing desks, movement breaks, and sedentary time in students?"} }
  },

  "Bicycle helmet — always wear it": {
    gradeHooks: {
      low: "We wear our helmet every single time we ride — even for a short trip around the block. No exceptions!",
      mid: "Helmet use dramatically reduces head injury risk. Proper fit and consistent use are the two most critical factors.",
      high: "Bicycle helmet biomechanics, concussion science, and the public health case for helmet laws are well-documented topics."
    },
    materials: ["Bicycle helmet"],
    steps: [
      "Get the helmet and put it on. Is it fitting correctly?",
      "Review proper fit: two fingers above the eyebrow, straps form a Y around each ear, chin strap fits one finger snug.",
      "Discuss the rule: helmet goes on before you get on the bike, every time, no exceptions.",
      "Talk about what happens to the helmet in a crash: the foam inside compresses to absorb impact. That\u2019s why a crashed helmet must be replaced.",
      "Check the helmet for cracks, dents, or age (replace after 5 years even without a crash)."
    ],
    discussion: [
      {q:"Your friend says you only need a helmet for long rides. What do you say?", answers:["Most bike accidents happen close to home. Every ride gets a helmet — it\u2019s not about how far you go."]},
      {q:"What happens to the helmet\u2019s protection after a hard impact?", answers:["The foam inside is compressed and can\u2019t absorb impact again as effectively. It must be replaced even if it looks fine."]}
    ],
    challenge: "Check the fit of every bike helmet in your house. Are any too old, too small, or damaged? Make a list.",
    tuesday:   { low: {title:"Helmet fit check", activity:"Practice the two-finger, Y-strap, and chin-strap check on yourself and every family member who rides."}, mid: {title:"Injury statistics", activity:"Research bike injury statistics for children. What percentage of serious injuries involve head trauma? How much does a helmet reduce risk?"}, high: {title:"Helmet certification standards", activity:"Research CPSC, ASTM, and SNELL helmet certifications for bicycles. What tests does each standard require?"} },
    wednesday: { low: {title:"Egg drop experiment", activity:"Wrap one egg in foam padding and drop it from waist height. Drop an unwrapped egg. Compare. Discuss what the padding did."}, mid: {title:"Florida helmet law", activity:"Research Florida\u2019s bicycle helmet law. Who is required to wear a helmet? What is the penalty for not wearing one?"}, high: {title:"Concussion biomechanics", activity:"Research how rotational force in a crash causes concussion. How do MIPS-equipped helmets address rotational impact differently?"} },
    thursday:  { low: {title:"Helmet habit poster", activity:"Make a poster for your home: \u2018Helmet ON before wheels roll.\u2019 Decorate it and hang it near where your bike is stored."}, mid: {title:"Helmet selection guide", activity:"Research what to look for when buying a new bike helmet. Write a buyer\u2019s guide covering: fit, certification, ventilation, and price range."}, high: {title:"Public health policy", activity:"Research the effectiveness of mandatory helmet laws. Do they increase helmet use? Do they reduce cycling overall? What do public health experts recommend?"} }
  },

  "Can I eat that? — safe food handling": {
    gradeHooks: {
      low: "Some food can make us sick if it\u2019s too old or not stored right. We learn to check before we eat!",
      mid: "Food safety involves proper storage temperatures, recognizing spoilage, and preventing cross-contamination.",
      high: "Food microbiology, the temperature danger zone, FIFO (first in first out), and HACCP principles are practical food science topics."
    },
    materials: ["Various food items to examine", "A refrigerator thermometer (optional)"],
    steps: [
      "Ask: how do you know if food is safe to eat?",
      "Teach the four checks: look (mold, discoloration), smell (sour, off, or ammonia smell), feel (slimy texture), and check the date.",
      "Go through the fridge or pantry and check a few items together.",
      "Explain the temperature danger zone: bacteria grow fastest between 40\u00b0F and 140\u00b0F. Fridge should stay below 40\u00b0F.",
      "Discuss the 2-hour rule: cooked food left out more than 2 hours should be thrown away."
    ],
    discussion: [
      {q:"If food smells fine but is past its use-by date, is it safe to eat?", answers:["Not necessarily. Some bacteria (like Listeria) don\u2019t change smell or appearance. When in doubt, throw it out."]},
      {q:"Why does meat need to be stored on the bottom shelf of the fridge?", answers:["So raw meat juices can\u2019t drip onto ready-to-eat food below it. This prevents cross-contamination."]}
    ],
    challenge: "Check the expiration dates of everything in your fridge and pantry. Make a list of anything that needs to be used soon.",
    tuesday:   { low: {title:"Fridge organization", activity:"Help reorganize the fridge: raw meats on bottom, produce in drawers, leftovers at eye level so they get used first."}, mid: {title:"Temperature danger zone", activity:"Research the bacterial temperature danger zone. Draw a thermometer diagram marking safe fridge temp, danger zone, and safe cooking temp."}, high: {title:"Foodborne illness bacteria", activity:"Research Salmonella, E. coli, Listeria, and Campylobacter. For each: source, symptoms, onset time, and prevention."} },
    wednesday: { low: {title:"Smell and look test", activity:"Examine 5 foods: fresh bread, week-old bread, fresh apple, cut apple left out, fresh milk, milk near expiry. Describe what you notice."}, mid: {title:"FIFO method", activity:"Research the FIFO (First In, First Out) method used in restaurants and homes. Reorganize one cabinet using this method."}, high: {title:"HACCP principles", activity:"Research HACCP (Hazard Analysis Critical Control Points). Identify the 7 principles and apply them to a simple home meal prep scenario."} },
    thursday:  { low: {title:"Food safety rules poster", activity:"Make a food safety poster with 5 rules: wash hands, keep cold food cold, cook meat fully, don\u2019t cross-contaminate, when in doubt throw it out."}, mid: {title:"Leftover safety", activity:"Research safe leftover storage: how long can different foods last in the fridge? Create a refrigerator guide chart."}, high: {title:"Food recall research", activity:"Look up a recent FDA food recall. What was recalled, why, and what was the public health response? How do recalls get communicated to consumers?"} }
  },

  "Reading food labels with a grown-up": {
    gradeHooks: {
      low: "Food labels tell us what is inside our food. We can learn to read them to make good choices!",
      mid: "Nutrition labels contain serving size, calories, macronutrients, and ingredients. Understanding them enables informed food choices.",
      high: "Food label literacy includes understanding percent daily values, ingredient order, health claims, and marketing language on packaging."
    },
    materials: ["3\u20135 food packages with nutrition labels"],
    steps: [
      "Pick up a food package. Find the Nutrition Facts label on the back or side.",
      "Start at the top: serving size. Ask: how many servings are in this whole package?",
      "Find calories. If the serving is 200 calories and there are 3 servings, how many calories in the whole package?",
      "Look at the ingredient list. Ingredients are listed from most to least by weight.",
      "Compare two similar products (e.g., two cereals). Which has less sugar? More fiber? Fewer ingredients?"
    ],
    discussion: [
      {q:"If the serving size is 15 chips and the bag has 10 servings, how many chips are in the bag?", answers:["150 chips. The calorie count on the label is only for 15 chips, not the whole bag."]},
      {q:"If sugar is the first ingredient on a label, what does that tell you?", answers:["Sugar is the main ingredient by weight — more of it than anything else in that food."]}
    ],
    challenge: "Read the label on 3 things you ate today. Find the serving size, calories, and first 3 ingredients for each.",
    tuesday:   { low: {title:"Label scavenger hunt", activity:"Find: the food with the most sugar per serving, the most protein, the most ingredients, and the fewest ingredients. Compare."}, mid: {title:"Percent daily value", activity:"Research what \u2018% Daily Value\u2019 means on a label. What percentage is considered high? Low? Apply this to sodium and fiber on a real label."}, high: {title:"Health claims research", activity:"Research FDA-regulated health claims on food packaging. What is the difference between a \u2018health claim,\u2019 a \u2018nutrient content claim,\u2019 and a \u2018structure/function claim\u2019?"} },
    wednesday: { low: {title:"Sugar by another name", activity:"Research 10 other names for sugar that appear on ingredient lists (corn syrup, dextrose, maltose, etc.). Find as many as you can on labels at home."}, mid: {title:"Misleading labels", activity:"Research common food marketing terms: \u2018natural,\u2019 \u2018multigrain,\u2019 \u2018made with real fruit.\u2019 Are these regulated? What do they actually mean?"}, high: {title:"NOVA food classification", activity:"Research the NOVA food processing classification system. What are the 4 groups and how does ultra-processing relate to health outcomes?"} },
    thursday:  { low: {title:"Build a better snack", activity:"Using what you\u2019ve learned, choose the healthiest snack from 4 options based on their labels. Explain your reasoning."}, mid: {title:"Grocery store label comparison", activity:"Compare store-brand vs name-brand versions of the same product. Are the ingredients and nutrition identical? Is the price difference justified?"}, high: {title:"Food desert and label literacy", activity:"Research how food deserts affect access to labeled, nutritious food. What role does food label literacy play in health outcomes for underserved communities?"} }
  },



  "Buckle up — car seat safety": {
    gradeHooks: {
      low: "We always buckle up in the car! Our car seat keeps us safe if the car stops suddenly.",
      mid: "Seatbelts and car seats dramatically reduce injury in crashes. Correct installation and fit are critical.",
      high: "Vehicle safety statistics, physics of crash forces, and proper car seat installation standards are well-documented topics."
    },
    materials: ["Car seat or seatbelt to examine"],
    steps: [
      "Ask: why do we wear a seatbelt in the car?",
      "Explain: if a car stops very fast, everything inside keeps moving — the seatbelt holds you safely.",
      "Walk to the car and show the actual car seat or seatbelt. Let the child buckle and unbuckle themselves.",
      "Explain the rule: ALWAYS buckle before the car moves, every single time, no exceptions.",
      "Discuss: it is okay to speak up and ask a driver to buckle up too."
    ],
    discussion: [
      {q:"What if someone says to skip the seatbelt just this once?", answers:["Say no — it only takes a second and it could save your life."]},
      {q:"When do you move from a car seat to a booster to a seatbelt?", answers:["Weight and height requirements vary — check your state law and car seat manual."]}
    ],
    challenge: "Look up Florida’s car seat law. What are the age and size requirements for each stage?",
    tuesday:   { low: {title:"Buckle practice", activity:"Practice buckling and unbuckling 5 times smoothly. Can you do it yourself?"}, mid: {title:"Crash physics", activity:"Research: in a 30 mph crash, how much force hits an unbelted passenger? Write the number and what it means."}, high: {title:"Car seat installation", activity:"Research how to install a forward-facing car seat. What is the LATCH system?"} },
    wednesday: { low: {title:"Safety song", activity:"Make up a short rhyme about buckling up and perform it for the family."}, mid: {title:"State law comparison", activity:"Compare car seat laws in 3 states. What are the differences?"}, high: {title:"NHTSA research", activity:"Look up current NHTSA car seat guidelines for each stage."} },
    thursday:  { low: {title:"Teach a stuffed animal", activity:"Use a doll and a box as a car. Teach the toy how to buckle up safely."}, mid: {title:"Car seat inspection", activity:"Find your nearest certified child passenger safety technician. What do they check?"}, high: {title:"Booster transition", activity:"Research when children should move from a booster to a seatbelt only. What are the risks of transitioning too early?"} }
  },

  "Smoke detector — what is it for?": {
    gradeHooks: {
      low: "Smoke detectors make a loud beeping sound to wake us up and warn us if there is a fire.",
      mid: "Smoke detectors save lives by providing early warning. Placement, testing, and battery maintenance are critical.",
      high: "Ionization vs photoelectric detectors, code requirements, and maintenance schedules are important home safety knowledge."
    },
    materials: ["Smoke detector in your home to examine"],
    steps: [
      "Find a smoke detector in your home and look at it together.",
      "Explain: smoke detectors sense smoke before we can and give us time to get out safely.",
      "Show the test button. Warn the child it will be loud, then press it together.",
      "Discuss: if you hear that sound at night, get up and get out. Do not stop to grab toys.",
      "Review your family fire escape plan and meeting spot outside."
    ],
    discussion: [
      {q:"If the smoke detector goes off while you are asleep, what do you do?", answers:["Get up immediately, crawl low if there is smoke, feel the door before opening, go to the meeting spot."]},
      {q:"Why do smoke detectors sometimes go off when someone is cooking?", answers:["Smoke or steam from cooking can trigger it — open a window but never remove the battery."]}
    ],
    challenge: "Count how many smoke detectors your home has. Look up how many are recommended per floor.",
    tuesday:   { low: {title:"Detector locations", activity:"Draw a floor plan and mark where each smoke detector is. Are any rooms missing one?"}, mid: {title:"Battery check", activity:"Check batteries in every detector with a parent. Record when each was last replaced."}, high: {title:"Detector types", activity:"Research ionization vs photoelectric smoke detectors. Which is better for which fire type?"} },
    wednesday: { low: {title:"What to do drill", activity:"Practice: alarm goes off. Feel door, crawl to exit, go to meeting spot."}, mid: {title:"Code requirements", activity:"Look up Florida building code requirements for smoke detectors."}, high: {title:"Carbon monoxide", activity:"Research CO detectors. How are they different from smoke detectors? Where should they be placed?"} },
    thursday:  { low: {title:"Reminder sign", activity:"Make a sign: Test smoke detectors every month! Put it where a parent will see it."}, mid: {title:"Maintenance calendar", activity:"Create a fire safety calendar: monthly tests, annual battery swaps, 10-year replacements."}, high: {title:"Smart detectors", activity:"Research smart smoke detectors and interconnected alarm systems. What are the advantages?"} }
  },

  "Stop Drop Roll practice": {
    gradeHooks: {
      low: "If our clothes catch fire we Stop, Drop, and Roll to put it out! Let’s practice until it is automatic.",
      mid: "Stop Drop Roll is a fire safety reflex that must be practiced until it is instant and automatic.",
      high: "Understanding fire behavior, burn treatment, and emergency response builds comprehensive fire safety literacy."
    },
    materials: ["Open floor space"],
    steps: [
      "Ask: what would you do if your sleeve caught on fire?",
      "Teach 3 steps: STOP (never run, running fans the flames), DROP (fall to the ground, cover your face with hands), ROLL (roll back and forth until fire is out).",
      "Demonstrate each step slowly, then practice together.",
      "Explain: cover your face while rolling to protect your eyes and mouth.",
      "Practice 3 full times from a standing position."
    ],
    discussion: [
      {q:"Why should you never run if your clothes are on fire?", answers:["Running gives the fire more oxygen and makes it burn faster and hotter."]},
      {q:"After Stop Drop Roll, what do you do next?", answers:["Get away from the fire, call for help, and cool any burns with cool water for 10 minutes."]}
    ],
    challenge: "Time how fast you can drop and begin rolling. Can you be on the ground within 2 seconds of hearing the word fire?",
    tuesday:   { low: {title:"Speed drill", activity:"Practice Stop Drop Roll 5 times. Try to get faster each round."}, mid: {title:"Burn first aid", activity:"Research minor burn treatment: cool water 10 minutes, no ice, no butter, cover loosely."}, high: {title:"Fire behavior science", activity:"Research how oxygen, fuel, and heat interact in fire. How does Stop Drop Roll reduce each element?"} },
    wednesday: { low: {title:"Teach it", activity:"Teach Stop Drop Roll to a younger sibling or stuffed animal. Can they do all 3 steps?"}, mid: {title:"Fire safety poster", activity:"Create a poster showing Stop Drop Roll, escape route, and family meeting spot."}, high: {title:"Burn statistics", activity:"Research burn injury statistics in children. What are the most common causes?"} },
    thursday:  { low: {title:"Full scenario", activity:"Act out a full fire scenario: smell smoke, low crawl, feel door, exit, meet at spot. Include a Stop Drop Roll moment."}, mid: {title:"School vs home drill", activity:"Compare your home fire plan to school fire drills. What is the same? What is different?"}, high: {title:"Wildfire vs structure fire", activity:"Research how fire behavior differs between wildfires and structure fires. How does each change the safety response?"} }
  },

  "Watering plants and watching them grow": {
    gradeHooks: {
      low: "Plants need water to grow just like we do! We water our plant and draw what we see each day.",
      mid: "Consistent watering and observation develop patience, scientific thinking, and a sense of responsibility.",
      high: "Plant biology, water uptake through osmosis, and the relationship between care and growth connect to food production science."
    },
    materials: ["A growing plant", "Watering can or cup", "Journal or paper"],
    steps: [
      "Check the soil with one finger pushed 1 inch in. Dry? Water. Moist? Wait.",
      "Water slowly at the base until a little comes out the drainage hole.",
      "Measure the plant or count its leaves.",
      "Record observations: height, color, new leaves, any changes.",
      "Commit to checking every day for one week."
    ],
    discussion: [
      {q:"How can you tell if you watered too much?", answers:["Yellow leaves, soggy soil, drooping even though soil is wet, mold on soil surface."]},
      {q:"Why does water come out the bottom of the pot?", answers:["Drainage holes let extra water escape so roots do not sit in water and rot."]}
    ],
    challenge: "Keep a plant journal for 7 days. Each day: check moisture, decide water or wait, sketch the plant, note changes.",
    tuesday:   { low: {title:"Measure and draw", activity:"Measure your plant with a ruler. Draw it actual size. Check again in 3 days. Did it grow?"}, mid: {title:"Overwatering experiment", activity:"Plant two identical seedlings. Overwater one, water the other correctly. Observe for 10 days."}, high: {title:"Transpiration research", activity:"Research how plants lose water through transpiration. How much water does a tomato plant use per day?"} },
    wednesday: { low: {title:"Watering chart", activity:"Make a chart with days of the week. Check off each day you water. Aim for a consistent pattern."}, mid: {title:"Root observation", activity:"Plant a bean in a clear cup against the side. Watch roots grow over the next week and sketch them."}, high: {title:"Drought tolerance", activity:"Research drought-tolerant plants suited to Florida climate. What adaptations help them survive with less water?"} },
    thursday:  { low: {title:"Plant health check", activity:"Score your plant 1 to 5 for: color, size, new growth, overall health. What could improve?"}, mid: {title:"Water quality", activity:"Research whether tap, filtered, or rainwater is best for houseplants. Does it really make a difference?"}, high: {title:"Irrigation systems", activity:"Research drip irrigation vs overhead watering. Which uses less water? Which is better for different crops?"} }
  },

  "Simple kitchen tools — safe use": {
    gradeHooks: {
      low: "Kitchen tools like spoons, spatulas, and peelers help us cook safely. We learn to hold and use each one correctly!",
      mid: "Understanding correct use of basic kitchen tools builds confidence and prevents common kitchen injuries.",
      high: "Professional kitchen technique begins with mastery of basic tools — grip, posture, and control prevent injury at every level."
    },
    materials: ["Wooden spoon", "Silicone spatula", "Vegetable peeler", "Whisk"],
    steps: [
      "Lay out 4 basic tools. Ask: what is each one used for?",
      "Demonstrate correct grip and motion for each: spoon (stirring), spatula (flipping), peeler (away from body), whisk (circular).",
      "Let the child handle each one safely with guidance.",
      "Practice: peel a carrot or cucumber, then stir a bowl of water.",
      "Discuss tool care: wash after use, store safely, never leave in hot pans."
    ],
    discussion: [
      {q:"Why do we peel away from our body instead of toward ourselves?", answers:["If the peeler slips it moves away from you instead of into your hand or fingers."]},
      {q:"What should you never do with a wooden spoon in a hot pot?", answers:["Leave it resting in the pot — the handle heats up and can burn you when you pick it up."]}
    ],
    challenge: "Use 3 different kitchen tools while cooking or preparing a snack today. Name each one and explain what it does.",
    tuesday:   { low: {title:"Tool matching game", activity:"Draw 5 kitchen tools and 5 foods. Draw a line from each tool to the food it would help prepare."}, mid: {title:"Knife basics intro", activity:"Research the claw grip for cutting. Practice on a soft food with close supervision."}, high: {title:"Tool metallurgy", activity:"Research what kitchen knives are made from: stainless steel, carbon steel, ceramic. What are the trade-offs of each?"} },
    wednesday: { low: {title:"Peeling practice", activity:"Peel a full carrot or zucchini using the correct away-from-body technique. How thin can you make the peels?"}, mid: {title:"Whisk science", activity:"Whisk 2 egg whites until stiff peaks form. What is happening to the proteins? Research meringue chemistry."}, high: {title:"Tool sharpening", activity:"Research how to sharpen a kitchen knife with a whetstone. What angle is correct? Why does sharpness make cutting safer?"} },
    thursday:  { low: {title:"Cook with the tools", activity:"Make a no-cook recipe like fruit salad using at least 3 tools correctly."}, mid: {title:"Kitchen tool audit", activity:"Inventory your kitchen tools. Are any broken, rusty, or unsafe? Create a replacement list."}, high: {title:"Mise en place", activity:"Research professional mise en place. Set up a full mise en place before making a simple recipe."} }
  },

  "What does a paramedic do?": {
    gradeHooks: {
      low: "Paramedics ride in ambulances and give first aid to people who are hurt or very sick. They are helpers!",
      mid: "Paramedics provide advanced emergency medical care in the field. Their rapid response saves lives.",
      high: "EMS systems include EMT and paramedic tiers with different scopes of practice. Understanding their role aids appropriate emergency use."
    },
    materials: ["Paper and crayons"],
    steps: [
      "Ask: what is the difference between calling 911 and driving to the hospital yourself?",
      "Explain: paramedics bring the hospital to you. They start treatment immediately in the ambulance.",
      "Discuss what they carry: defibrillators, oxygen, IVs, medications, stretchers.",
      "Talk about what to do when an ambulance arrives: stay calm, tell them what happened, get out of the way.",
      "Draw an ambulance and label 3 things that might be inside."
    ],
    discussion: [
      {q:"When should you call 911 instead of driving someone to the hospital?", answers:["When someone is unconscious, not breathing, having a heart attack or stroke, or severely injured."]},
      {q:"What information should you give the 911 dispatcher?", answers:["Your location, what happened, how many people are hurt, whether anyone is unconscious or not breathing."]}
    ],
    challenge: "Find where your nearest fire station with paramedics is located. How far away is it from your home?",
    tuesday:   { low: {title:"Ambulance drawing", activity:"Draw the inside of an ambulance. Research and add 5 real pieces of equipment paramedics use."}, mid: {title:"EMT vs paramedic", activity:"Research the difference between an EMT-Basic and a Paramedic. What additional training does a paramedic have?"}, high: {title:"EMS response times", activity:"Research average EMS response times in urban vs rural areas. How does response time affect outcomes?"} },
    wednesday: { low: {title:"911 practice", activity:"Role-play calling 911. Practice saying your name, address, and what is wrong clearly and calmly."}, mid: {title:"Triage basics", activity:"Research the START triage system. How do paramedics decide who to treat first at a mass casualty event?"}, high: {title:"EMS career path", activity:"Research the education path to become a paramedic. How does it compare to becoming an RN?"} },
    thursday:  { low: {title:"Thank a paramedic", activity:"Make a card for your local EMS station thanking them. Deliver it if possible."}, mid: {title:"Chain of survival", activity:"Research the American Heart Association chain of survival. What are the 6 links and what does each mean?"}, high: {title:"Dispatch systems", activity:"Research how 911 call centers dispatch EMS, fire, and police simultaneously. What technology do they use?"} }
  },

  "Dressing for the weather": {
    gradeHooks: {
      low: "We wear different clothes for different weather! Rain boots for rain, warm coat for cold, light clothes for hot days.",
      mid: "Appropriate clothing for weather conditions prevents hypothermia, heat exhaustion, and sunburn.",
      high: "Thermal regulation, UV exposure, and layering systems connect clothing choices to health and survival."
    },
    materials: ["A selection of clothing items", "Access to weather forecast"],
    steps: [
      "Check today’s weather forecast together.",
      "Ask: what would happen if you wore a heavy coat on a 95-degree Florida day? Or a t-shirt in a blizzard?",
      "Introduce layering: base layer (wicks moisture), middle layer (insulates), outer layer (wind and rain).",
      "Practice: for today’s weather, pick an outfit and explain each choice.",
      "Discuss sun safety: even on warm days, hats and sunscreen are gear too."
    ],
    discussion: [
      {q:"What is dangerous about wearing wet cotton in cold weather?", answers:["Cotton loses all insulating ability when wet and can cause hypothermia quickly. Wool and synthetics stay warm when wet."]},
      {q:"What should you always have in Florida during summer?", answers:["Water, sunscreen, a hat, and light breathable clothing. Heat exhaustion can happen fast."]}
    ],
    challenge: "For 5 days, choose your own outfit based on the forecast. Report whether you were comfortable each day.",
    tuesday:   { low: {title:"Wardrobe sort", activity:"Sort clothing into piles: hot weather, cold weather, rainy weather. Can any items work in multiple categories?"}, mid: {title:"Layering system", activity:"Research the 3-layer system used by hikers. What materials are best for each layer and why?"}, high: {title:"Hypothermia prevention", activity:"Research early signs of hypothermia and heat exhaustion. What clothing choices help prevent each?"} },
    wednesday: { low: {title:"Dress the paper doll", activity:"Draw a person and dress them for 4 weather scenarios: hot sun, cold rain, snow, and a Florida thunderstorm."}, mid: {title:"UPF clothing", activity:"Research UPF ratings in clothing. When does it matter more than sunscreen?"}, high: {title:"Military cold weather gear", activity:"Research how military personnel dress for Arctic operations. What materials and layering systems do they use?"} },
    thursday:  { low: {title:"Rainy day kit", activity:"Pack a small rain bag: umbrella or rain jacket, waterproof shoes, dry socks. Store it by the door."}, mid: {title:"Heat index chart", activity:"Find a heat index chart. At what temperature and humidity is it dangerous to be outside? What should you wear?"}, high: {title:"Survival clothing priorities", activity:"Research what clothing items are most critical in a survival situation. What is the priority order?"} }
  },

  "Packing my own backpack": {
    gradeHooks: {
      low: "We can pack our own backpacks! Knowing what to bring each day is a great responsibility skill.",
      mid: "Preparing your own materials builds executive function, organization, and independence.",
      high: "Systems thinking applied to daily preparation — checklists, organization, priority setting — builds lifelong efficiency."
    },
    materials: ["Backpack", "School or activity supplies"],
    steps: [
      "Ask: what do you think you need in your backpack tomorrow?",
      "Make a checklist: school supplies, water bottle, snack, any permission slips or library books.",
      "Practice packing: heavier items close to the back, fragile items protected, frequently needed items accessible.",
      "Do a weight check — a backpack should not be more than 10% of body weight.",
      "Set the routine: pack the night before, not the morning of."
    ],
    discussion: [
      {q:"What is the advantage of packing the night before?", answers:["You have time to find missing items, you are not rushed, and you start the day calmer."]},
      {q:"What should you check every time before zipping up?", answers:["Water bottle, any items due that day (homework, library books, permission slips), nothing fragile is loose."]}
    ],
    challenge: "Pack your backpack every night this week without being reminded. Check off each item on your list.",
    tuesday:   { low: {title:"Backpack checklist", activity:"Create a laminated daily checklist for your backpack. Check it off each morning before leaving."}, mid: {title:"Ergonomics check", activity:"Research proper backpack fit: shoulder straps, hip belt use, weight distribution. Adjust yours correctly."}, high: {title:"Go-bag vs school bag", activity:"Compare a daily school backpack to an emergency go-bag. What items overlap? What is unique to each?"} },
    wednesday: { low: {title:"Pack for a trip", activity:"Imagine you are going on a 1-day hiking trip. What would you pack? List every item and explain why."}, mid: {title:"Organization system", activity:"Design an organization system for your backpack using pouches or sections. What goes where and why?"}, high: {title:"72-hour kit packing", activity:"Research what FEMA recommends in a 72-hour emergency kit. Pack a scaled-down version in a small bag."} },
    thursday:  { low: {title:"Night-before routine", activity:"Practice the full routine: check tomorrow schedule, pack the bag, set it by the door. How long does it take?"}, mid: {title:"Teach a younger child", activity:"Teach a younger sibling to pack their own backpack. Make them a simple picture checklist."}, high: {title:"Habit stacking", activity:"Research habit stacking and implementation intentions. Design a morning and evening routine that includes backpack prep."} }
  },

  "What to do if someone is hurt": {
    gradeHooks: {
      low: "If someone gets hurt, we stay calm, tell a grown-up, and stay with the person who is hurt.",
      mid: "A calm, clear first response — assess, call for help, and provide basic care — is the foundation of first aid.",
      high: "Scene safety assessment, calling for help, and providing care without causing harm are core emergency response principles."
    },
    materials: ["First aid kit to reference"],
    steps: [
      "Ask: if a friend fell off a bike and was crying, what would you do first?",
      "Teach 3 steps: CHECK (is scene safe? how badly are they hurt?), CALL (get an adult or call 911), CARE (do what you can until help arrives).",
      "Practice staying calm: take a breath, speak slowly, use a calm voice.",
      "Discuss what NOT to do: move someone who may have a neck injury, remove an object stuck in a wound, leave them alone.",
      "Role-play: a friend trips and scrapes their knee badly at the park."
    ],
    discussion: [
      {q:"Why is staying calm the most important first step?", answers:["Panic leads to mistakes. A calm person thinks clearly and reassures the hurt person."]},
      {q:"When should you call 911 instead of just getting an adult?", answers:["When no adult is immediately available, or when the injury is severe: unconscious, not breathing, heavy bleeding, possible broken bone."]}
    ],
    challenge: "Memorize Check-Call-Care. Quiz a family member: can they recite all 3 and explain each one?",
    tuesday:   { low: {title:"Scenario cards", activity:"Write 5 injury scenarios on cards. Sort them: handle yourself vs call for help."}, mid: {title:"Primary survey", activity:"Research the primary survey: airway, breathing, circulation. What does each check involve?"}, high: {title:"Good Samaritan laws", activity:"Research Good Samaritan laws in Florida. What protection do they provide to bystanders who give first aid?"} },
    wednesday: { low: {title:"Calm voice practice", activity:"Practice giving instructions in a calm, clear voice. Read 3 directions from the first aid kit aloud as if talking to a scared friend."}, mid: {title:"Bystander effect", activity:"Research the bystander effect. Why do people fail to help in a crowd? How can you overcome it?"}, high: {title:"Mass casualty triage", activity:"Research the START triage system. How do responders prioritize when many people are hurt at once?"} },
    thursday:  { low: {title:"Full role play", activity:"Act out a complete scenario: discover an injured person, assess, call for help, provide basic care, stay with them."}, mid: {title:"First aid kit readiness", activity:"For each item in your first aid kit, name one scenario where it would be used in a Check-Call-Care situation."}, high: {title:"Psychological first aid", activity:"Research psychological first aid. What do trained responders do to help people emotionally after a crisis?"} }
  },

  "Home fire drill with my family": {
    gradeHooks: {
      low: "A fire drill is practice for what to do if there is a real fire. We practice so everyone knows exactly what to do!",
      mid: "Regular fire drills ensure that escape plans are memorized and can be executed quickly even when frightened.",
      high: "Fire drill frequency, escape route design, and accountability systems are components of a comprehensive home fire safety plan."
    },
    materials: ["Floor plan drawing optional", "Timer"],
    steps: [
      "Review the escape plan: two ways out of every room, meeting spot outside.",
      "Assign roles if needed: who checks on younger children, who calls 911 once outside.",
      "Announce the drill, start a timer when the alarm sounds.",
      "Everyone follows their route, meets at the spot, and does a head count.",
      "Debrief: what went well? What was slow or confusing?"
    ],
    discussion: [
      {q:"Why do we practice fire drills when there is no real fire?", answers:["In a real fire, smoke and fear make it hard to think clearly. Practice makes the right actions automatic."]},
      {q:"What is the goal time to be outside and at the meeting spot?", answers:["Under 2 minutes from the time the alarm sounds."]}
    ],
    challenge: "Conduct a surprise nighttime fire drill. Is everyone just as fast in the dark?",
    tuesday:   { low: {title:"Escape route map", activity:"Draw your home floor plan. Mark two exit routes from every bedroom with arrows."}, mid: {title:"Drill timing analysis", activity:"Time your fire drill. How many minutes does a real house fire take to become untenable? How does your time compare?"}, high: {title:"NFPA recommendations", activity:"Research NFPA 72 recommendations for home fire drills. How often should drills be conducted?"} },
    wednesday: { low: {title:"Low crawl practice", activity:"Practice low crawling from your bedroom to the front door. Time it vs walking upright."}, mid: {title:"Door check technique", activity:"Practice the door-check: back of hand to door, then handle. If hot, use alternate exit. Role-play both."}, high: {title:"Hotel fire safety", activity:"Research fire safety in hotels. Why are hotel fires particularly dangerous? What steps should you take when checking in?"} },
    thursday:  { low: {title:"Nighttime drill", activity:"Do a fire drill starting from bed. Practice waking up, getting low, checking the door, and exiting."}, mid: {title:"Accountability system", activity:"Design a family accountability system: who is responsible for each child, what to do if someone is missing."}, high: {title:"Community fire safety", activity:"Research your local fire department outreach programs. Do they offer free home safety checks? Request one."} }
  },

  "Growing sprouts on a windowsill": {
    gradeHooks: {
      low: "We can grow sprouts in a jar on our windowsill in just a few days! They are crunchy and delicious.",
      mid: "Sprouting seeds is a fast, inexpensive way to grow nutrient-dense food with minimal space and equipment.",
      high: "Sprout nutrition, food safety considerations, and the biochemistry of germination connect to food security and home production."
    },
    materials: ["Sprouting seeds (lentils, mung beans, or alfalfa)", "Mason jar", "Cheesecloth or mesh lid", "Water"],
    steps: [
      "Soak 2 tablespoons of seeds in the jar with water overnight.",
      "Drain and rinse the seeds the next morning, then tip the jar at an angle so air can circulate.",
      "Rinse and drain twice daily.",
      "In 3 to 5 days, sprouts will be ready to eat.",
      "Taste them! Use in salads, sandwiches, or eat plain."
    ],
    discussion: [
      {q:"Why are sprouts considered very nutritious?", answers:["Germination activates enzymes and increases vitamin content. Sprouts are high in vitamins C and K and protein relative to their size."]},
      {q:"How does growing sprouts connect to emergency preparedness?", answers:["Sprouting seeds store for years. In an emergency you can grow fresh food in days with just seeds, a jar, and water."]}
    ],
    challenge: "Grow two different types of sprouts at the same time. Compare taste, texture, and growth rate.",
    tuesday:   { low: {title:"Sprout journal", activity:"Draw your sprout jar each day for 5 days. Record how many inches of growth you see."}, mid: {title:"Nutrition comparison", activity:"Compare the nutritional content of raw lentils vs lentil sprouts. What changes during germination?"}, high: {title:"Food safety research", activity:"Research why improper sprouting can lead to foodborne illness. What steps prevent contamination?"} },
    wednesday: { low: {title:"Sprout taste test", activity:"Try 3 different types of sprouts if possible. Rate each on taste and texture."}, mid: {title:"Sprouting seed varieties", activity:"Research 8 common sprouting seeds. List each, its days to sprout, flavor, and primary nutrients."}, high: {title:"Commercial sprout production", activity:"Research how commercial sprout farms produce and package safely. What HACCP controls do they use?"} },
    thursday:  { low: {title:"Sprout sandwich", activity:"Use your sprouts in a sandwich or wrap. What other ingredients go well with them?"}, mid: {title:"Emergency food supply", activity:"Calculate how many jars of sprouts your family could grow with 1 pound of lentils."}, high: {title:"Microgreens vs sprouts", activity:"Research the difference between microgreens and sprouts. Which has higher nutritional density per ounce?"} }
  },

  "Staying hydrated — how much water?": {
    gradeHooks: {
      low: "Our bodies need water every single day! Drinking enough water helps us think, play, and feel good.",
      mid: "Hydration affects cognitive function, physical performance, and organ health. Knowing how much to drink is a practical health skill.",
      high: "Fluid balance, electrolytes, and the physiological signs of dehydration are important health and sports science topics."
    },
    materials: ["Water bottle", "Paper for tracking"],
    steps: [
      "Ask: how much water do you think you drank yesterday?",
      "Explain the guideline: kids need about 6 to 8 cups of water per day. More in heat or during exercise.",
      "Discuss signs of dehydration: headache, dark yellow pee, dry mouth, feeling tired or cranky.",
      "Set up a water tracking chart for today. Mark a cup each time you drink one.",
      "Discuss hydrating foods: cucumber, watermelon, oranges, and broth all count."
    ],
    discussion: [
      {q:"Is juice or soda a good substitute for water?", answers:["They contain water but also sugar, which can worsen dehydration. Water is always the best choice."]},
      {q:"How does Florida’s heat make hydration more important?", answers:["We sweat more in heat, losing water and electrolytes faster. Dehydration can happen very quickly on hot days."]}
    ],
    challenge: "Drink at least 6 cups of water every day this week. Track it and report how you felt differently.",
    tuesday:   { low: {title:"Urine color chart", activity:"Draw a urine color chart from pale yellow (well hydrated) to dark amber (dehydrated). Use it to check your hydration each morning."}, mid: {title:"Electrolytes research", activity:"Research what electrolytes are and why they matter. What foods replenish sodium, potassium, and magnesium after exercise?"}, high: {title:"Sports hydration science", activity:"Research how elite athletes calculate fluid replacement during exercise. What is sweat rate testing?"} },
    wednesday: { low: {title:"Hydrating foods", activity:"List 10 fruits and vegetables with high water content. Which do you already eat regularly?"}, mid: {title:"Dehydration and the brain", activity:"Research how even 1 to 2 percent dehydration affects concentration, memory, and reaction time."}, high: {title:"Hyponatremia", activity:"Research water intoxication (hyponatremia). How can drinking too much water be dangerous? When does this risk occur?"} },
    thursday:  { low: {title:"Water bottle decoration", activity:"Decorate a reusable water bottle. Mark time goals on the side (e.g. drink to this line by noon)."}, mid: {title:"Infused water recipes", activity:"Research 5 fruit and herb infused water combinations. Make one and see how your intake changes."}, high: {title:"Global water access", activity:"Research what percentage of the world lacks access to safe drinking water. How does this affect health outcomes?"} }
  },

  "Safe scissors and simple crafts": {
    gradeHooks: {
      low: "Scissors are a tool, not a toy. We hold them safely, cut away from our body, and walk with them pointed down.",
      mid: "Scissor safety and control are foundational fine motor skills that transfer to many practical tasks.",
      high: "Tool control, precision cutting, and understanding blade mechanics apply across crafts, cooking, and professional trades."
    },
    materials: ["Child-safe scissors", "Paper for practice", "Craft materials"],
    steps: [
      "Show safe scissor grip: thumb on top, fingers in the bottom loop, blades pointing away.",
      "Demonstrate how to carry scissors: closed, tip pointing down, in a fist.",
      "Practice cutting straight lines on paper, then curved lines.",
      "Establish the rule: scissors cut paper and craft materials only, nothing else without permission.",
      "Make a simple craft: cut a paper shape, a snowflake, or a decorative border."
    ],
    discussion: [
      {q:"What should you do before handing scissors to someone else?", answers:["Close them and hand handle-first so the other person grabs the safe end."]},
      {q:"Why do we cut away from our body and fingers?", answers:["If the scissors slip they move away from you. Cutting toward yourself risks cutting your hand."]}
    ],
    challenge: "Cut out 10 different shapes from paper without tearing any. Can you cut a perfect circle?",
    tuesday:   { low: {title:"Shape cutting practice", activity:"Cut out 5 shapes: circle, square, triangle, star, heart. Which was hardest? Practice that one 3 more times."}, mid: {title:"Precision cutting", activity:"Print a complex outline and cut it out as precisely as possible. Measure the gap between your cut and the line."}, high: {title:"Cutting tools comparison", activity:"Research scissors, rotary cutters, box cutters, and craft knives. What is each for and what safety rules apply?"} },
    wednesday: { low: {title:"Paper craft project", activity:"Use scissors to make a paper chain, a collage, or a paper bag puppet. Follow all safety rules the whole time."}, mid: {title:"Origami prep", activity:"Research origami. Practice cutting perfectly square pieces from standard paper. Fold a simple model."}, high: {title:"Textile cutting", activity:"Research fabric scissors and why they must never be used on paper. Practice cutting fabric in a straight line."} },
    thursday:  { low: {title:"Teach safety rules", activity:"Teach the 3 scissor safety rules to a family member: grip, carry, and pass. Can they demonstrate each?"}, mid: {title:"Multi-tool safety", activity:"Compare safety rules for scissors, kitchen knife, and box cutter. What do they all have in common?"}, high: {title:"Professional cutting techniques", activity:"Research cutting techniques in tailoring, surgery, or culinary arts. How does precision cutting differ in each field?"} }
  },

  "Saving coins in a piggy bank": {
    gradeHooks: {
      low: "Saving means keeping some money for later instead of spending it all now. A piggy bank helps us save!",
      mid: "Saving is the foundation of financial health. Building the habit early has lifelong compounding benefits.",
      high: "The psychology of saving, delayed gratification research, and compound interest illustrate why early saving habits matter most."
    },
    materials: ["Piggy bank or jar", "Coins to practice with"],
    steps: [
      "Ask: if you got $5 today, what would you do with it?",
      "Introduce the save-spend-give framework: divide money into 3 jars.",
      "Practice: if you have 10 coins, how many go to each jar? (common split: 5 save, 3 spend, 2 give)",
      "Set a saving goal: what are you saving for? Write or draw it on the bank.",
      "Count current savings together and celebrate the progress."
    ],
    discussion: [
      {q:"Why is it important to save BEFORE you spend instead of saving what is left over?", answers:["If you spend first there is often nothing left. Saving first guarantees you always make progress."]},
      {q:"What is a savings goal?", answers:["Something specific you are saving for. Goals make saving feel meaningful and motivating."]}
    ],
    challenge: "Save a portion of any money you receive this month. Count your savings at the end and report the total.",
    tuesday:   { low: {title:"Goal setting", activity:"Draw a picture of what you are saving for. Write the price and calculate how many weeks of saving it will take."}, mid: {title:"Compound interest intro", activity:"Research simple compound interest. If you save $10 per month at 5% interest, how much will you have in 10 years?"}, high: {title:"Marshmallow test", activity:"Research the Stanford marshmallow experiment. What did it find about delayed gratification and life outcomes?"} },
    wednesday: { low: {title:"Three jars system", activity:"Decorate 3 jars: Save, Spend, Give. Divide a pretend pile of coins using your chosen ratio."}, mid: {title:"Bank vs piggy bank", activity:"Research the difference between keeping money in a piggy bank vs a savings account. What does a bank offer that a jar cannot?"}, high: {title:"Behavioral economics", activity:"Research why people struggle to save despite good intentions. What psychological barriers exist and what strategies overcome them?"} },
    thursday:  { low: {title:"Count and record", activity:"Count all the money in your savings. Record the total in a savings journal with today’s date. Do this monthly."}, mid: {title:"Allowance budgeting", activity:"Design a monthly budget for a $20 allowance using the save-spend-give framework."}, high: {title:"FIRE movement", activity:"Research the Financial Independence Retire Early movement. What savings rate does it require? What are the criticisms?"} }
  },

  "What is a food pantry?": {
    gradeHooks: {
      low: "A food pantry is a place where people can get free food when they need help. Communities take care of each other!",
      mid: "Food pantries are community safety nets that address food insecurity. Understanding how they work builds community awareness.",
      high: "Food insecurity statistics, pantry operations, and systemic causes of hunger connect individual action to social justice."
    },
    materials: ["Canned goods or non-perishables to examine", "Paper"],
    steps: [
      "Ask: do you know what happens when a family does not have enough money for food?",
      "Explain: food pantries collect donated food and give it to families who need it.",
      "Discuss how they work: people donate non-perishables, volunteers sort them, families visit and take what they need.",
      "Talk about who uses pantries: regular people who hit a hard time from job loss, medical bills, or natural disasters.",
      "Identify one way your family could contribute: donate, volunteer, or organize a drive."
    ],
    discussion: [
      {q:"Is it embarrassing to use a food pantry?", answers:["No. Food pantries exist so that anyone who needs help can get it with dignity. Many families use them at some point."]},
      {q:"What kinds of food are most useful to donate?", answers:["Non-perishables with long shelf lives: canned proteins, peanut butter, canned vegetables and fruit, rice, pasta, oatmeal."]}
    ],
    challenge: "Find your nearest food pantry. When are they open? What do they most need? Plan a donation with your family.",
    tuesday:   { low: {title:"Food drive collection", activity:"Collect 5 non-perishable items from your pantry to donate. Check expiration dates."}, mid: {title:"Food insecurity statistics", activity:"Research food insecurity rates in your state and county. What percentage of children are food insecure?"}, high: {title:"Systems analysis", activity:"Research the root causes of food insecurity in the US. What policy interventions have the most evidence?"} },
    wednesday: { low: {title:"Sort and label", activity:"Practice sorting pantry items like a volunteer: check dates, group by category, set aside anything damaged."}, mid: {title:"SNAP program", activity:"Research the SNAP program. Who qualifies? How many people use it? What is the monthly benefit per person?"}, high: {title:"Gleaning programs", activity:"Research food gleaning — collecting surplus food from farms and markets. Name one organization in your state that does this."} },
    thursday:  { low: {title:"Donation drive", activity:"Make flyers asking family to donate canned goods. Collect and deliver the items together."}, mid: {title:"Volunteer planning", activity:"Look up volunteer opportunities at your nearest food pantry. What tasks do volunteers do? Plan a visit."}, high: {title:"Food desert mapping", activity:"Research food deserts in your county. How does proximity to a grocery store affect health outcomes?"} }
  },

  "Map of my classroom": {
    gradeHooks: {
      low: "A map shows where things are! We can draw a map of our classroom or learning space.",
      mid: "Creating a map of a familiar space builds spatial awareness, scale estimation, and basic cartography skills.",
      high: "Sketch mapping, spatial cognition, and the transition from egocentric to allocentric spatial representation are foundational to geography."
    },
    materials: ["Paper", "Pencil", "Ruler optional"],
    steps: [
      "Ask: if someone had never been in this room, how would you describe where everything is?",
      "Look around the learning space and name what you see: desks, shelves, windows, door, whiteboard.",
      "Draw the room from above as if you are a bird looking down. This is called a floor plan.",
      "Add furniture and label each item.",
      "Add a compass rose showing which direction is north."
    ],
    discussion: [
      {q:"Why is a bird’s eye view (from above) more useful for a map than a side view?", answers:["It shows the true position and size of things relative to each other. Side views show only one angle and distort spacing."]},
      {q:"Why do maps use symbols instead of detailed drawings?", answers:["Symbols are quick to draw and easy to read. They let you show a lot of information in a small space."]}
    ],
    challenge: "Draw a map of one room in your home from memory, then check it for accuracy. What did you get wrong?",
    tuesday:   { low: {title:"Label the legend", activity:"Create a map legend for your classroom map. Choose 5 symbols and explain each."}, mid: {title:"Scale estimation", activity:"Estimate the dimensions of your classroom in feet. Draw the map to scale (1 inch = 5 feet). Measure to check."}, high: {title:"CAD intro", activity:"Research computer-aided design (CAD) software. How do architects create precise floor plans digitally?"} },
    wednesday: { low: {title:"Treasure hunt", activity:"Using your classroom map, write 3 clues to lead someone to a hidden object. Swap with a sibling and try each other’s maps."}, mid: {title:"Emergency exit map", activity:"Add emergency exits, the nearest fire extinguisher, and the evacuation route to your classroom map."}, high: {title:"Cognitive mapping", activity:"Research Kevin Lynch’s work on mental maps. What 5 elements do people use to mentally map their environment?"} },
    thursday:  { low: {title:"Home map", activity:"Draw a map of your home from above. Add furniture, doors, and windows. Mark your bedroom and the front exit."}, mid: {title:"Compare to blueprint", activity:"Research what a building blueprint looks like. Compare its symbols and conventions to your hand-drawn map."}, high: {title:"GIS and mapping technology", activity:"Research Geographic Information Systems. How do professionals use GIS to create and analyze maps?"} }
  },

  "Animals in my neighborhood": {
    gradeHooks: {
      low: "Animals live near us too! Birds, squirrels, insects, and sometimes deer or raccoons share our neighborhood.",
      mid: "Urban wildlife exists in a complex relationship with human development. Observing and understanding local animals builds ecological literacy.",
      high: "Urban ecology, wildlife corridors, human-wildlife conflict, and the impact of habitat fragmentation are important environmental topics."
    },
    materials: ["Notebook for observations", "Colored pencils"],
    steps: [
      "Go outside and stand still for 5 minutes. How many animals (including insects and birds) can you spot?",
      "List every animal you observe: birds, squirrels, insects, lizards, dogs, cats.",
      "Discuss: all of these animals have found a way to live alongside humans.",
      "Identify one animal you want to learn more about. Research what it eats and where it lives.",
      "Talk about what to do if you encounter a wild animal: observe from a distance, never feed, never corner."
    ],
    discussion: [
      {q:"Why should you never feed wild animals like raccoons or squirrels?", answers:["They can become dependent on humans for food, lose fear of humans, and become aggressive or sick."]},
      {q:"What Florida wildlife might you see in a suburban neighborhood?", answers:["Anoles, blue jays, cardinals, sandhill cranes, squirrels, raccoons, and possibly opossums or armadillos."]}
    ],
    challenge: "Keep a 3-day wildlife log. Every time you go outside, note every animal you see, hear, or find signs of.",
    tuesday:   { low: {title:"Bird identification", activity:"Look up 5 birds common in Florida. Draw each one and write one fact about it."}, mid: {title:"Wildlife food web", activity:"Create a simple food web for 6 animals in your neighborhood. Show who eats whom."}, high: {title:"Urban heat island and wildlife", activity:"Research how urban heat islands affect local wildlife habitats and animal behavior."} },
    wednesday: { low: {title:"Insect hunt", activity:"Look under rocks, leaves, and bark. How many different insects can you find in 15 minutes? Draw 3."}, mid: {title:"Invasive species", activity:"Research 3 invasive species in Florida. How did they arrive, what damage do they cause, and how are they being managed?"}, high: {title:"Wildlife corridors", activity:"Research wildlife corridors. Why are they critical for urban animal populations and what does Florida do to support them?"} },
    thursday:  { low: {title:"Animal habitat mapping", activity:"On your neighborhood map, mark where you have seen different animals. Which areas have the most wildlife?"}, mid: {title:"Backyard habitat", activity:"Research how to make your yard more wildlife friendly: native plants, water source, brush piles. Design a small wildlife habitat area."}, high: {title:"Human-wildlife conflict", activity:"Research a specific human-wildlife conflict in Florida (alligators, black bears, Florida panthers). What management strategies are used?"} }
  },

  "Basic composting — food scraps": {
    gradeHooks: {
      low: "Composting turns our food scraps into plant food! Instead of throwing away banana peels, we can turn them into something useful.",
      mid: "Composting reduces landfill waste, creates rich soil amendment, and teaches the nutrient cycle in a hands-on way.",
      high: "Decomposition microbiology, carbon-to-nitrogen ratios, and vermicomposting are components of sustainable food systems."
    },
    materials: ["Small container or bin", "Food scraps (fruit and vegetable peels)", "Soil or dried leaves"],
    steps: [
      "Explain: when food scraps go to landfill, they produce methane. When they compost, they become soil.",
      "Show what can be composted: fruit and vegetable scraps, coffee grounds, eggshells, paper. NOT meat, dairy, or oily foods.",
      "Set up a small compost container: layer scraps with a little soil or dry leaves.",
      "Discuss the 4 ingredients: greens (nitrogen), browns (carbon), water, and air.",
      "Commit to adding scraps and turning it weekly."
    ],
    discussion: [
      {q:"What are ‘greens’ and ‘browns’ in composting?", answers:["Greens are nitrogen-rich: fruit and vegetable scraps, coffee grounds, grass clippings. Browns are carbon-rich: dried leaves, cardboard, paper."]},
      {q:"Why do we turn or mix the compost?", answers:["Turning adds oxygen, which the decomposing microbes need. Without air, the pile goes anaerobic and starts to smell bad."]}
    ],
    challenge: "Start a kitchen compost collection container. Collect scraps for one week. How much did you collect?",
    tuesday:   { low: {title:"Scraps sorting game", activity:"Sort a pile of pretend food items: compost or trash? Include apple core, chicken bone, newspaper, eggshell, plastic bag."}, mid: {title:"Hot vs cold composting", activity:"Research the difference between hot and cold composting. Which is faster? What temperatures does a hot pile reach?"}, high: {title:"Vermicomposting", activity:"Research vermicomposting (worm composting). How does it work and what are the advantages over traditional composting?"} },
    wednesday: { low: {title:"Dig and observe", activity:"If you have an outdoor compost area or bin, put on gloves and gently dig through it. What living things can you find?"}, mid: {title:"C to N ratio", activity:"Research the ideal carbon to nitrogen ratio for composting (25:1 to 30:1). List 5 materials and their approximate C:N ratios."}, high: {title:"Biochar research", activity:"Research biochar as a soil amendment. How is it made and what does it add to compost that standard compost cannot provide?"} },
    thursday:  { low: {title:"Garden connection", activity:"If you have a garden, spread finished compost around a plant. Observe the soil. How does it look different from regular dirt?"}, mid: {title:"Methane from landfills", activity:"Research how much methane landfills produce from food waste. How does composting reduce this environmental impact?"}, high: {title:"Municipal composting programs", activity:"Research composting programs in major US cities. How does San Francisco’s program work and what are its diversion rates?"} }
  },

  "Night safety — staying visible": {
    gradeHooks: {
      low: "When it gets dark outside, drivers have a harder time seeing us. We wear bright colors or reflectors to stay safe!",
      mid: "Visibility at night is a measurable safety factor. Reflective and bright materials significantly reduce pedestrian accident risk.",
      high: "Pedestrian safety statistics, retroreflective technology, and road design connect personal choices to traffic engineering."
    },
    materials: ["Flashlight", "Reflective gear or light-colored clothing if available"],
    steps: [
      "Go outside at dusk or dark. Ask: can you see clearly from across the street?",
      "Explain: drivers can only see pedestrians from about 55 feet away in the dark, but reflective gear extends that to 500 feet.",
      "Discuss strategies: light-colored clothing, reflective strips, flashlights, blinking lights on bikes.",
      "Practice: stand at the end of the driveway in dark clothing vs light clothing. Which is easier to see?",
      "Establish the rule: never cross a street at night without making yourself visible first."
    ],
    discussion: [
      {q:"Why is dark clothing at night so dangerous near roads?", answers:["Drivers may not see you until it is too late to stop. Reaction time plus braking distance at 35 mph exceeds the distance a driver can see a dark-clothed pedestrian."]},
      {q:"What should you do if walking on a road without a sidewalk at night?", answers:["Walk facing oncoming traffic on the left side, carry a flashlight, wear reflective gear, and stay as far to the edge as possible."]}
    ],
    challenge: "Audit your family gear. Does everyone have something reflective for walking or biking at night? Fix any gaps this week.",
    tuesday:   { low: {title:"Reflection experiment", activity:"Shine a flashlight on dark fabric vs reflective tape in a dim room. Measure how far away you can see each."}, mid: {title:"Pedestrian accident data", activity:"Research pedestrian fatality statistics at night vs daytime. What percentage of deaths occur in the dark?"}, high: {title:"Retroreflective technology", activity:"Research how retroreflective materials work. What industries use them besides road safety?"} },
    wednesday: { low: {title:"Night safety kit", activity:"Assemble a night safety kit: reflective vest or arm bands, small flashlight, extra batteries."}, mid: {title:"Bike light laws", activity:"Research Florida laws regarding bike lights and reflectors at night. What is legally required?"}, high: {title:"Road design and pedestrian safety", activity:"Research how road design (lighting, crosswalk placement, speed limits) affects pedestrian safety."} },
    thursday:  { low: {title:"Reflective art", activity:"Decorate a backpack or jacket with reflective tape in a pattern. Test it at night with a flashlight."}, mid: {title:"Running and cycling safety", activity:"Research safety gear for runners and cyclists at night. Design an ideal safety setup for each."}, high: {title:"Vision Zero", activity:"Research the Vision Zero road safety initiative. What cities have adopted it and what results have they achieved?"} }
  },

  "Who to call for different emergencies": {
    gradeHooks: {
      low: "Different emergencies need different helpers! We call 911 for big emergencies and have other numbers for smaller problems.",
      mid: "Knowing which emergency service to contact and how to communicate clearly can save critical minutes in a crisis.",
      high: "Emergency communication systems, dispatch protocols, and the tiered nature of emergency response are important civic knowledge."
    },
    materials: ["Paper to make an emergency contact reference card"],
    steps: [
      "Ask: what is the number for a fire emergency? What about if someone is very sick? What about a gas leak?",
      "Establish 911 as the primary emergency number: fire, medical, crime in progress.",
      "Introduce non-emergency use: local police non-emergency line for minor incidents.",
      "Discuss utility emergencies: gas company and electric company numbers should be saved.",
      "Make a household emergency number card with: 911, poison control (1-800-222-1222), local non-emergency police, and 2 parent numbers."
    ],
    discussion: [
      {q:"What should you say first when 911 answers?", answers:["Your location. The dispatcher can help even if the call drops as long as they know where you are."]},
      {q:"What is the poison control number and when do you use it?", answers:["1-800-222-1222. Use it if someone swallows a chemical, too much medicine, or a plant they should not have."]}
    ],
    challenge: "Memorize the poison control number: 1-800-222-1222. Say it 5 times without looking.",
    tuesday:   { low: {title:"Emergency card craft", activity:"Make a colorful emergency card. Include 911, poison control, and 2 family numbers. Laminate or tape to the fridge."}, mid: {title:"911 call simulation", activity:"Practice a 911 call for 3 scenarios: house fire, unconscious person, car accident. What information does each need?"}, high: {title:"Dispatch systems research", activity:"Research how 911 call centers work. How are calls routed, prioritized, and dispatched during a power outage?"} },
    wednesday: { low: {title:"Non-emergency vs emergency", activity:"For each scenario decide: 911 or non-emergency line? Car broken into, unconscious neighbor, suspicious person, gas smell."}, mid: {title:"Poison control scenarios", activity:"Research 5 common poisoning scenarios. For each, what would poison control advise?"}, high: {title:"Text to 911", activity:"Research Text-to-911 availability. When is texting better than calling? What are its limitations?"} },
    thursday:  { low: {title:"Family emergency quiz", activity:"Each family member picks one number from the card and explains when they would use it."}, mid: {title:"NOAA weather radio", activity:"Research NOAA Weather Radio. What frequencies does it broadcast on and why is it useful when cell service is down?"}, high: {title:"Amateur radio in emergencies", activity:"Research how ham radio operators assist when conventional communications fail. What is ARES?"} }
  },

  "Planting a seed and watching it grow": {
    gradeHooks: {
      low: "We plant a seed in soil, give it water and sunlight, and watch it become a plant! It feels like magic.",
      mid: "Seed germination, early seedling development, and basic plant care introduce botany and self-sufficiency skills.",
      high: "Germination physiology, seed dormancy, and the factors affecting sprouting success connect to agricultural science and food production."
    },
    materials: ["Fast-sprouting seeds (radish, bean, or sunflower)", "Small pot or cup", "Potting soil", "Water"],
    steps: [
      "Fill a cup with potting mix. Poke a hole the depth recommended on the seed packet.",
      "Place 2 seeds, cover gently, and water just enough to moisten (not soak).",
      "Place in a warm location. Seeds do not need light yet — warmth and moisture trigger sprouting.",
      "Check every day. When you see the first green shoot, move to a sunny window.",
      "Begin a plant journal: sketch the seed today, then every 2 days after it sprouts."
    ],
    discussion: [
      {q:"Why does a seed sprout underground without any light?", answers:["Seeds have stored energy (starch and fat) that fuel early growth. Light becomes necessary only after the seedling breaks the surface."]},
      {q:"What is the difference between a seed and a sprout?", answers:["A seed is dormant. A sprout is the first growth after germination, when the root and shoot begin to emerge from the seed."]}
    ],
    challenge: "Keep a plant journal for 14 days. Sketch your seedling every 2 days and record how tall it is.",
    tuesday:   { low: {title:"Seed sorting", activity:"Collect 5 different types of seeds. Sort them by size, shape, and color. Guess which will sprout fastest."}, mid: {title:"Germination experiment", activity:"Plant 3 batches of the same seed: one in warm dark spot, one in cold, one in direct sun. Compare germination times."}, high: {title:"Dormancy research", activity:"Research seed dormancy. What mechanisms prevent seeds from sprouting at the wrong time of year?"} },
    wednesday: { low: {title:"Root and shoot", activity:"Once your seed sprouts, observe: which came first, the root or the shoot? Why does the root grow down?"}, mid: {title:"Phototropism", activity:"Place your seedling so light comes from one side only. Observe over 3 days. Draw what happens and explain why."}, high: {title:"Seed banking", activity:"Research how seed banks like the Svalbard Global Seed Vault work and why they are essential for food security."} },
    thursday:  { low: {title:"Water the seedling", activity:"Practice careful watering: check soil moisture first, water at the base, never drown. Draw your seedling today."}, mid: {title:"Transplanting", activity:"Research when and how to transplant a seedling from a cup to a larger pot or garden. What is transplant shock?"}, high: {title:"Heirloom vs hybrid seeds", activity:"Research the difference between heirloom, hybrid, and open-pollinated seeds. What are the advantages of saving heirloom seeds?"} }
  },

  "Reading a weather forecast with a grown-up": {
    gradeHooks: {
      low: "Weather forecasts tell us what the weather will be like tomorrow and this week. We can plan ahead!",
      mid: "Reading and applying weather forecasts is a practical skill for planning, safety, and understanding meteorology.",
      high: "Forecast accuracy, probability of precipitation, and ensemble modeling are aspects of applied meteorology."
    },
    materials: ["Phone or computer to access a weather app", "Paper for drawing"],
    steps: [
      "Open a weather app or website together. Look at today’s forecast.",
      "Identify the key elements: temperature high and low, chance of rain as a percentage, wind speed, UV index.",
      "Explain the 7-day forecast: more accurate for 1 to 2 days, less accurate further out.",
      "Connect it to decisions: should we bring an umbrella? Is it safe to be outside for a long time?",
      "Draw a simple forecast chart for the next 3 days using symbols."
    ],
    discussion: [
      {q:"What does a 40 percent chance of rain mean?", answers:["In similar atmospheric conditions it rained 40 percent of the time. It is not a guarantee — it might or might not rain."]},
      {q:"Why is the UV index especially important in Florida?", answers:["Florida has very high UV levels year-round. High UV can cause sunburn in 15 to 20 minutes and increases skin cancer risk."]}
    ],
    challenge: "Check the forecast each morning for 5 days. Record your prediction, then note the actual weather. How accurate was it?",
    tuesday:   { low: {title:"Weather symbol chart", activity:"Make a chart of common weather symbols: sun, cloud, rain, storm, snow, fog. Practice drawing each."}, mid: {title:"Weather app comparison", activity:"Compare 3 different weather apps for the same day. Do they all agree? What are the differences?"}, high: {title:"NWS forecast discussion", activity:"Go to weather.gov and find the Forecast Discussion for your area. Read the meteorologist technical analysis and summarize it."} },
    wednesday: { low: {title:"5-day forecast chart", activity:"Draw a 5-day forecast chart. Check back each day and mark what actually happened."}, mid: {title:"Severe weather alerts", activity:"Research the difference between a weather WATCH and a WARNING. What actions should you take for each?"}, high: {title:"Forecast skill scores", activity:"Research how meteorologists measure forecast accuracy. What is the Brier score and how is it used?"} },
    thursday:  { low: {title:"Dress for the week", activity:"Based on your 5-day forecast chart, plan an outfit for each day. Which day needs the most preparation?"}, mid: {title:"Hurricane tracking", activity:"During hurricane season, track an active storm on the NHC website. How does the cone of uncertainty change over time?"}, high: {title:"Climate change and forecasting", activity:"Research how climate change is affecting weather forecast reliability. Are extreme events becoming harder or easier to predict?"} }
  },

  "Helping prepare a simple meal": {
    gradeHooks: {
      low: "Helping cook a meal is a fun and important job! We can stir, pour, measure, and wash vegetables.",
      mid: "Meal preparation builds nutrition knowledge, practical math, and life skills that lead to cooking independence.",
      high: "Meal planning, nutritional balance, food budgeting, and cooking from scratch are pillars of lifelong food self-sufficiency."
    },
    materials: ["Ingredients for a simple meal", "Measuring cups and spoons"],
    steps: [
      "Choose a simple meal: soup with fresh vegetables added, pasta, scrambled eggs, or a big salad.",
      "Assign age-appropriate tasks: wash vegetables, measure ingredients, stir, set the timer.",
      "Walk through each step together, explaining what and why.",
      "Practice kitchen safety throughout: wash hands, tie back hair, wipe up spills immediately.",
      "Eat what you made together and discuss what you would do differently next time."
    ],
    discussion: [
      {q:"Why is it important to learn how to cook your own food?", answers:["So you can feed yourself and your family, save money, eat healthier, and be self-sufficient."]},
      {q:"What is a recipe and why do we follow it?", answers:["A recipe is a set of tested instructions. Following it gives predictable results until you know enough to improvise."]}
    ],
    challenge: "Make one complete simple meal from start to finish with minimal help. Plan it, get the ingredients, cook it, and clean up.",
    tuesday:   { low: {title:"Mise en place", activity:"Before cooking, lay out every ingredient and tool you will need. Practice having everything ready before you start."}, mid: {title:"Nutritional balance", activity:"Analyze your meal: does it have a protein, a vegetable, a carbohydrate, and a healthy fat? What would you add?"}, high: {title:"Cost per serving", activity:"Calculate the cost per serving of a home-cooked meal vs the equivalent from a restaurant. What is the savings?"} },
    wednesday: { low: {title:"Measuring practice", activity:"Practice measuring: 1 cup, half cup, quarter cup, 1 tablespoon, 1 teaspoon. Fill each with water and compare."}, mid: {title:"Recipe scaling", activity:"Take a recipe that serves 4. Scale it up to serve 8 and down to serve 2. What happens to cooking time?"}, high: {title:"Meal prep systems", activity:"Research weekly meal prep strategies. How do experienced cooks reduce daily cooking time while maintaining nutrition?"} },
    thursday:  { low: {title:"My own recipe card", activity:"Write or dictate a recipe card for the meal you made. Include ingredients, amounts, and steps. Decorate it."}, mid: {title:"Pantry cooking challenge", activity:"Look at what is in your pantry and fridge right now. Design a complete meal using only what you have."}, high: {title:"Food preservation cooking", activity:"Research a traditional preservation method: canning, fermentation, or dehydration. Make a simple version of one preserved food."} }
  },

  "What does a crossing guard do?": {
    gradeHooks: {
      low: "Crossing guards help us cross the street safely near schools and busy roads. We always listen to them!",
      mid: "Crossing guards are trained volunteers or employees who reduce pedestrian accidents at high-traffic points.",
      high: "Pedestrian infrastructure, traffic calming measures, and community safety roles intersect in the work of crossing guards."
    },
    materials: ["Paper and crayons"],
    steps: [
      "Ask: have you ever seen a crossing guard? What were they wearing and doing?",
      "Explain: crossing guards stop traffic so pedestrians can cross safely. They are authorized to direct traffic.",
      "Discuss their tools: bright vest, stop sign paddle, whistle.",
      "Establish the rules: always wait for the crossing guard signal, make eye contact, say thank you.",
      "Draw a crossing guard at an intersection and label their gear."
    ],
    discussion: [
      {q:"Why do we wait for the crossing guard even when the light says WALK?", answers:["The crossing guard can see things the light cannot — a car running a red, a turning vehicle, a distracted driver."]},
      {q:"What do you do if there is no crossing guard and you need to cross a busy street?", answers:["Find a marked crosswalk, wait for the light, look both ways, make eye contact with drivers before stepping out."]}
    ],
    challenge: "Next time you see a crossing guard, thank them. Observe everything they do during one crossing.",
    tuesday:   { low: {title:"Intersection drawing", activity:"Draw an intersection with crosswalks, traffic lights, and a crossing guard. Add pedestrians waiting safely."}, mid: {title:"Pedestrian signal research", activity:"Research how pedestrian countdown signals work. What does the flashing hand mean vs the solid hand?"}, high: {title:"Traffic calming measures", activity:"Research traffic calming infrastructure: speed bumps, raised crosswalks, bulb-outs, road diet. Which most reduces pedestrian fatalities?"} },
    wednesday: { low: {title:"Street crossing practice", activity:"At a safe location, practice the full crossing routine: stop at curb, look left-right-left, wait for signal, cross briskly."}, mid: {title:"School zone laws", activity:"Research Florida school zone speed limit laws. What are the fines for violations and why are they higher?"}, high: {title:"Vision Zero schools", activity:"Research how cities have redesigned school zones to reduce child pedestrian injuries. What works best?"} },
    thursday:  { low: {title:"Thank a crossing guard", activity:"Make a card for your school crossing guard. Deliver it and observe what their job looks like up close."}, mid: {title:"Volunteer crossing guard programs", activity:"Research whether your district uses volunteer or paid crossing guards. What training do they receive?"}, high: {title:"Autonomous vehicles and pedestrians", activity:"Research how self-driving cars are being programmed to interact with crossing guards. What are the current challenges?"} }
  },



  "First aid for cuts and scrapes": {
    gradeHooks: {
      low: "Cuts and scrapes happen when we play! Cleaning them and putting on a bandage helps them heal.",
      mid: "Proper wound care — cleaning, pressure, and covering — prevents infection and promotes healing.",
      high: "Wound assessment, sterile technique, and recognizing signs requiring medical attention are core first aid competencies."
    },
    materials: ["Bandages", "Gauze pad", "Clean water", "Soap", "First aid kit"],
    steps: [
      "Review: what is the first thing you do before touching someone\u2019s wound? (Wash your hands!)",
      "Step through the 4-step process: wash hands \u2192 rinse wound with water \u2192 apply gentle pressure if bleeding \u2192 cover with bandage.",
      "Practice on a doll or a hand using an unused bandage.",
      "Discuss: when is a cut too serious for home care? (Deep, won\u2019t stop bleeding, has debris, is on face or joint)",
      "Locate the first aid kit and identify the items you would use."
    ],
    discussion: [
      {q:"Why do we rinse a cut with water instead of wiping it with a dry cloth?", answers:["Water flushes out germs and dirt. A dry cloth can push debris deeper or leave fibers in the wound."]},
      {q:"What does it mean if a wound is red, swollen, and warm a day later?", answers:["Those are signs of infection. Tell a parent or doctor right away."]}
    ],
    challenge: "Teach the 4-step wound care process to a parent from memory. Can you do it without any hints?",
    tuesday:   { low: {title:"First aid kit inventory", activity:"Open the kit and name every item. Write a list of what\u2019s inside and what each is used for."}, mid: {title:"Wound types chart", activity:"Draw and label 3 wound types: abrasion (scrape), laceration (cut), puncture. Describe how to treat each."}, high: {title:"Infection progression", activity:"Research what happens if a wound becomes infected and is untreated. At what point does it require antibiotics?"} },
    wednesday: { low: {title:"Pressure demo", activity:"Use a damp sponge as a \u2018bleeding wound.\u2019 Practice applying firm, steady pressure with a gauze pad for 2 minutes."}, mid: {title:"Antiseptic research", activity:"Research hydrogen peroxide vs antibiotic ointment for wound care. Current medical guidance recommends which, and why?"}, high: {title:"Suture vs steri-strips", activity:"Research when wounds need sutures vs wound closure strips. What are the criteria doctors use to decide?"} },
    thursday:  { low: {title:"Scenario practice", activity:"Act out 3 scenarios: scrape your knee at the park, cut your finger cooking, step on a sharp rock. Walk through treatment for each."}, mid: {title:"Teach-back assessment", activity:"Teach a younger child the full wound care process. Ask them to repeat it back. Correct any steps they missed."}, high: {title:"Wilderness first aid", activity:"Research how wound care differs in a wilderness setting where medical help is hours away. What additional steps are required?"} }
  },

  "Growing food — container garden": {
    gradeHooks: {
      low: "We can grow our own food even without a yard! A container garden lets us grow vegetables in pots or buckets.",
      mid: "Container gardening requires understanding of soil nutrition, drainage, space requirements, and plant care cycles.",
      high: "Urban food production through container and vertical gardening addresses food security, environmental impact, and self-sufficiency."
    },
    materials: ["Container (pot, bucket, or repurposed container)", "Potting mix", "Seeds or seedlings"],
    steps: [
      "Explain: a container garden lets you grow food anywhere — on a patio, balcony, or windowsill.",
      "Choose one fast-growing vegetable: radishes (3 weeks), lettuce (4 weeks), cherry tomatoes (longer but very rewarding).",
      "Discuss what a container needs: drainage holes, enough depth for roots, good potting mix (not plain dirt).",
      "Set up the container together: add soil, plant seeds at the right depth (check the packet), water gently.",
      "Create a care schedule: how often to water, when to fertilize, when to harvest."
    ],
    discussion: [
      {q:"Why can\u2019t you just use dirt from outside in a container?", answers:["Garden soil compacts in containers, blocking drainage and root growth. Potting mix is lighter and designed for containers."]},
      {q:"How does growing your own food connect to being prepared?", answers:["If stores are closed or food is scarce, knowing how to grow food means you can provide for your family."]}
    ],
    challenge: "Care for your container garden every day for two weeks. Photograph it weekly and compare the growth.",
    tuesday:   { low: {title:"Seed packet reading", activity:"Read a seed packet together. Find: days to germination, days to harvest, spacing, sun requirements."}, mid: {title:"Soil science", activity:"Research the difference between potting mix, garden soil, and compost. What does each provide for plants?"}, high: {title:"Yield calculations", activity:"Research how many pounds of tomatoes a healthy container plant produces. Calculate the grocery store value of that yield."} },
    wednesday: { low: {title:"Watering log", activity:"Check soil moisture each morning before watering. Record: watered today? Dry or moist? Make a chart."}, mid: {title:"Fertilizer basics", activity:"Research the N-P-K numbers on fertilizer labels. What does each nutrient do for plants?"}, high: {title:"Companion planting", activity:"Research which vegetables grow well together in containers and which compete. Design a multi-plant container arrangement."} },
    thursday:  { low: {title:"What I grew today", activity:"Draw your container garden and label every plant. Note what you did to care for it this week."}, mid: {title:"Pest identification", activity:"Research the 5 most common container garden pests. For each, describe how to identify and treat organically."}, high: {title:"Year-round growing", activity:"Research what crops can be grown year-round in Florida\u2019s climate. Design a 12-month container garden rotation plan."} }
  },

  "Neighborhood map activity": {
    gradeHooks: {
      low: "A map shows us where things are. We can draw a map of our own neighborhood!",
      mid: "Creating and reading neighborhood maps builds spatial awareness, directional language, and basic cartography skills.",
      high: "Cartography, scale, map symbols, and GIS connect practical navigation to geography and data visualization."
    },
    materials: ["Large paper", "Pencil and colored pencils or markers"],
    steps: [
      "Ask: if someone had never been to our neighborhood, how would you describe where we live?",
      "Discuss what goes on a neighborhood map: streets, your home, key landmarks (park, store, school, neighbor\u2019s house).",
      "Start drawing: place your home in the center, then draw the streets around it.",
      "Add 3\u20135 landmarks with simple symbols. Create a small legend for the symbols.",
      "Walk around the block with the map in hand and check your accuracy."
    ],
    discussion: [
      {q:"Why do maps use symbols instead of drawing every detail?", answers:["Symbols make maps easier to read quickly and keep them from becoming too cluttered."]},
      {q:"How would you show which direction is north on your map?", answers:["Draw a compass rose with N pointing up (the convention for most maps)."]}
    ],
    challenge: "Add your nearest grocery store and one emergency location (fire station or hospital) to your map.",
    tuesday:   { low: {title:"Map legend practice", activity:"Make a map legend with at least 5 symbols: house, school, park, store, fire station. Use consistent shapes and colors."}, mid: {title:"Scale introduction", activity:"Research what a map scale is. Draw your street with a simple scale (1 inch = 1 block) and mark distances."}, high: {title:"Google Maps vs paper maps", activity:"Compare a digital map of your neighborhood to your hand-drawn version. What does each do better?"} },
    wednesday: { low: {title:"Follow the map", activity:"Use your map to navigate a short walk in your neighborhood. Can you identify each landmark as you pass it?"}, mid: {title:"Topographic basics", activity:"Find a topographic map of your region online. Explain what the contour lines represent."}, high: {title:"GIS introduction", activity:"Research what GIS (Geographic Information Systems) is and give 3 examples of how it is used in emergency management."} },
    thursday:  { low: {title:"Update the map", activity:"After your walk, update your map with anything you got wrong or forgot. Draw it more accurately."}, mid: {title:"Neighborhood comparison", activity:"Compare your hand-drawn map to the actual Google Maps satellite view of your neighborhood. Note 3 differences."}, high: {title:"Crisis mapping", activity:"Research how crowd-sourced crisis maps (like Ushahidi) have been used in disasters. Give one real-world example."} }
  },

  "Family emergency meeting spot": {
    gradeHooks: {
      low: "Our family has a special meeting spot outside the house in case of an emergency. Everyone goes there!",
      mid: "A family emergency plan includes primary and secondary meeting spots, communication protocols, and designated out-of-area contacts.",
      high: "Comprehensive emergency planning involves communication redundancy, multiple contingency scenarios, and periodic drills."
    },
    materials: ["Paper for drawing a map"],
    steps: [
      "Explain: if there is a fire or emergency, everyone needs to go to the same place — the meeting spot.",
      "Walk outside and choose your primary meeting spot: somewhere safe, visible, and away from the house.",
      "Choose a secondary spot farther away in case the street is blocked.",
      "Practice: everyone count to 3 and walk (or run) to the meeting spot. Did everyone make it?",
      "Add the meeting spot to your home\u2019s fire escape map."
    ],
    discussion: [
      {q:"Why is it important that everyone in the family knows the meeting spot, not just parents?", answers:["In an emergency, parents may not be able to direct everyone. Each person needs to know what to do independently."]},
      {q:"What do you do at the meeting spot if not everyone is there?", answers:["Stay and wait. Do not go back inside. A parent or firefighter will account for everyone."]}
    ],
    challenge: "Quiz every family member: where is our primary meeting spot? Where is our backup? Do they all know?",
    tuesday:   { low: {title:"Meeting spot drawing", activity:"Draw a picture of your house from above and mark the meeting spot with a star. Show the path to get there."}, mid: {title:"Out-of-area contact", activity:"Discuss why an out-of-area contact is important. (Local lines may be busy; an outside contact can relay info.) Identify yours."}, high: {title:"Communication plan", activity:"Write a family communication plan for 3 scenarios: house fire, severe weather shelter-in-place, and separated at a public event."} },
    wednesday: { low: {title:"Drill time", activity:"Conduct a surprise drill (with parent\u2019s help). Sound an alarm and see how fast everyone reaches the meeting spot."}, mid: {title:"Emergency kit at the spot", activity:"Research what a grab-and-go bag should contain for a home evacuation. Build or check yours."}, high: {title:"Evacuation route planning", activity:"Map two driving routes out of your neighborhood. When might each be used, and what could block them?"} },
    thursday:  { low: {title:"Neighbors in the plan", activity:"Identify one trusted neighbor who is part of your emergency plan. How would they help if a parent is not home?"}, mid: {title:"School emergency plan", activity:"Look up or ask about your school\u2019s emergency reunification plan. Where do parents pick up children? What is the signal?"}, high: {title:"FEMA family plan", activity:"Use FEMA\u2019s Ready.gov family communication plan template. Fill it out completely for your family."} }
  },

  "Watering and feeding my plants": {
    gradeHooks: {
      low: "Plants are like us — they get thirsty and hungry! We water them and give them plant food to help them grow.",
      mid: "Proper watering frequency, fertilization schedules, and recognizing over- and under-watering are essential plant care skills.",
      high: "Plant nutrition involves macro- and micronutrients, soil chemistry, and the relationship between nutrient availability and growth."
    },
    materials: ["Your growing container plant (from earlier)", "Watering can or cup", "Liquid fertilizer if available"],
    steps: [
      "Check the plant\u2019s soil by sticking a finger 1 inch in. Is it dry? Time to water. Still moist? Wait.",
      "Explain: most plants want to dry out a little between waterings. Overwatering is as harmful as underwatering.",
      "Water slowly at the base (not on leaves) until water drains from the bottom.",
      "Introduce fertilizer: plants in containers need food added to the soil because nutrients wash out. A little, not too much.",
      "Observe: what does a healthy plant look like vs one that needs water or food?"
    ],
    discussion: [
      {q:"How can you tell a plant is being overwatered?", answers:["Yellow leaves, soggy soil, mold on soil surface, limp stems despite wet soil"]},
      {q:"Why do container plants need more fertilizing than garden plants?", answers:["Each watering flushes nutrients out of the pot. Garden soil replenishes from surrounding soil and organisms."]}
    ],
    challenge: "For one week, check your plant daily and decide: water today or not? Record your decisions and what the plant looks like.",
    tuesday:   { low: {title:"Thirsty or not game", activity:"Check 3 different plants in your home or outside. Are they dry, moist, or wet? Should each be watered today?"}, mid: {title:"Water logging experiment", activity:"Plant two of the same seedling. Overwater one, water the other normally. Observe and record over 10 days."}, high: {title:"Hydroponics nutrient solution", activity:"Research what nutrients are included in hydroponic nutrient solutions. How do they replace what soil provides?"} },
    wednesday: { low: {title:"Watering schedule chart", activity:"Create a watering calendar for your plant for the next two weeks. Mark the days you plan to water."}, mid: {title:"Fertilizer label reading", activity:"Read a plant fertilizer label. What do the 3 numbers mean (N-P-K)? When would you choose a high-N vs high-P formula?"}, high: {title:"Soil pH", activity:"Research how soil pH affects nutrient availability. What happens to iron and calcium uptake at different pH levels?"} },
    thursday:  { low: {title:"Plant health report", activity:"Draw your plant and give it a \u2018health score.\u2019 Note color, size, number of new leaves. Is it growing well?"}, mid: {title:"Organic vs synthetic fertilizer", activity:"Compare one organic and one synthetic fertilizer. How do they work differently in the soil and over time?"}, high: {title:"Cover crops and soil health", activity:"Research how cover crops restore soil nutrients between growing seasons. Name 3 common cover crops and what they add."} }
  },

  "Filling water bottles — how much to store": {
    gradeHooks: {
      low: "Water is the most important thing to have in an emergency! We can fill bottles and store them to be ready.",
      mid: "Emergency water storage requires knowing how much to store, how to store it safely, and how to rotate supplies.",
      high: "Water storage planning involves per-person calculations, container selection, treatment methods, and rotation schedules."
    },
    materials: ["Clean water bottles or gallon jugs", "Water"],
    steps: [
      "Ask: what would you do if the water from your faucet stopped working for a few days?",
      "Explain: emergency experts recommend 1 gallon of water per person per day for drinking and basic sanitation.",
      "Calculate: how many gallons does your family need for 3 days? (family size x 3)",
      "Fill water bottles together and label them with today\u2019s date.",
      "Store in a cool, dark place away from chemicals or direct sunlight."
    ],
    discussion: [
      {q:"Why do stored water bottles need a date label?", answers:["Water in plastic can absorb chemicals over time and should be rotated every 6\u201312 months."]},
      {q:"If you had to choose between storing food or water, which would you prioritize and why?", answers:["Water — you can survive much longer without food (weeks) than without water (3 days)."]}
    ],
    challenge: "Calculate your family\u2019s 3-day water supply. Check if you have it stored. If not, make a plan to fill it this week.",
    tuesday:   { low: {title:"Gallon estimation", activity:"Fill a gallon jug and pour it into cups. How many cups is a gallon? How many cups would you drink in a day?"}, mid: {title:"Water storage options", activity:"Research 5 types of water storage containers: pros, cons, and how long water stays safe in each."}, high: {title:"Water purification methods", activity:"Research 4 water purification methods: boiling, chlorine tablets, UV filters, and ceramic filters. When would you use each?"} },
    wednesday: { low: {title:"Label and store", activity:"Label your stored water bottles with the date and your family\u2019s name. Store them correctly and report where they are."}, mid: {title:"2-week supply planning", activity:"Calculate and list the water storage needed for 2 weeks for your family. How many gallons? How much space does that require?"}, high: {title:"Municipal water failure case studies", activity:"Research a real case of municipal water failure (Flint, MI or a hurricane disaster). How long were residents without safe water and how did they cope?"} },
    thursday:  { low: {title:"Water taste test", activity:"Compare tap water, filtered water, and bottled water. Do they taste different? Discuss why."}, mid: {title:"Water in food storage", activity:"Research how much water is needed for cooking freeze-dried or dehydrated emergency food. Add this to your storage calculation."}, high: {title:"Rainwater harvesting", activity:"Research rainwater harvesting systems for home use. Are they legal in Florida? What equipment is needed and how much water can be collected?"} }
  },

  "Making a simple salad": {
    gradeHooks: {
      low: "We can make our own salad! Wash the vegetables, tear or chop, and mix. Healthy and delicious!",
      mid: "Salad prep introduces knife skills, food safety, flavor balance, and nutrition in a no-cook context.",
      high: "Culinary fundamentals — mise en place, knife technique, emulsification in dressings — are practiced through simple recipes."
    },
    materials: ["Lettuce or mixed greens", "2\u20133 vegetables (cucumber, tomato, carrot)", "Salad dressing ingredients or bottled dressing"],
    steps: [
      "Wash hands thoroughly.",
      "Wash all vegetables under running water.",
      "Tear lettuce into bite-size pieces (tearing is safe, no knife needed).",
      "With supervision, slice or chop one vegetable using a child-safe knife or butter knife.",
      "Combine in a bowl, drizzle with dressing, toss gently, and serve."
    ],
    discussion: [
      {q:"Why do we wash vegetables before eating them even if they look clean?", answers:["Pesticides, soil bacteria, and handling during shipping can leave invisible residue on the surface."]},
      {q:"What makes a salad nutritious?", answers:["Variety of colors (different nutrients), leafy greens, protein additions, and dressing made with healthy fat like olive oil."]}
    ],
    challenge: "Design and make a different salad each day for 3 days. Each one must have at least 4 ingredients and a homemade dressing.",
    tuesday:   { low: {title:"Rainbow salad challenge", activity:"Make a salad with at least 4 different colors of vegetables. Name the vegetable and a nutrient it provides."}, mid: {title:"Make your own dressing", activity:"Research a basic vinaigrette recipe (oil, vinegar, mustard, salt). Make it and explain the emulsification process."}, high: {title:"Macronutrient analysis", activity:"Analyze the macronutrient content of your salad using a nutrition tracking app or USDA database. What is the calorie, protein, fat, and carb breakdown?"} },
    wednesday: { low: {title:"Chop challenge", activity:"With supervision, practice cutting a soft vegetable (cucumber, banana pepper) into even slices using the claw grip."}, mid: {title:"Global salad research", activity:"Research 3 salads from other cultures (Greek salad, Nicoise, Fattoush). What makes each unique?"}, high: {title:"Farm to fork", activity:"Trace the ingredients of your salad back to their source. Which could you grow yourself in Florida? Which must be imported?"} },
    thursday:  { low: {title:"Family salad bar", activity:"Set out all available salad ingredients and let each family member build their own. Discuss which combinations work and why."}, mid: {title:"Seasonal ingredients", activity:"Research which salad vegetables are in season in Florida right now. Which are locally grown vs shipped from far away?"}, high: {title:"Food cost analysis", activity:"Calculate the cost per serving of your homemade salad vs a fast food salad of comparable nutrition. What are the differences?"} }
  },

  "Building a mini first aid kit": {
    gradeHooks: {
      low: "A first aid kit has supplies to help when someone gets hurt. We can build our own!",
      mid: "Knowing what belongs in a first aid kit, how to use each item, and how to maintain it are key preparedness skills.",
      high: "First aid kit contents should be customized to the household, activity type, and any medical conditions of family members."
    },
    materials: ["Small container (zip bag or box)", "Bandages (assorted)", "Gauze pads", "Medical tape", "Antiseptic wipe or ointment", "Scissors", "Tweezers", "Thermometer (optional)"],
    steps: [
      "Explain: a first aid kit is one of the most important things to have at home, in the car, and in a go-bag.",
      "List the must-haves: bandages (multiple sizes), gauze, medical tape, antiseptic, gloves, scissors, tweezers.",
      "Gather what you have at home and organize it into a clearly labeled container.",
      "For each item, explain what it is used for.",
      "Make a list of anything missing and plan to purchase it."
    ],
    discussion: [
      {q:"What would you add to a first aid kit for a family that has someone with allergies?", answers:["Epinephrine auto-injector (EpiPen) if prescribed, antihistamines, and a list of allergens and emergency contacts."]},
      {q:"Why should a first aid kit be checked and restocked regularly?", answers:["Items expire, get used and not replaced, or become damaged. A kit with expired supplies can be useless."]}
    ],
    challenge: "Check every item in your family\u2019s first aid kit. Replace anything missing or expired. Make it complete.",
    tuesday:   { low: {title:"Item matching game", activity:"Lay out first aid items. Match each to a scenario: scraped knee (bandage), splinter (tweezers), fever (thermometer)."}, mid: {title:"Car first aid kit", activity:"Research what additional items should be in a car first aid kit (beyond a home kit). Compile a separate list."}, high: {title:"Wilderness first aid kit", activity:"Research what a wilderness or backcountry first aid kit includes that a home kit doesn\u2019t. Explain why each addition is needed."} },
    wednesday: { low: {title:"What is it for?", activity:"Pick up each item in the first aid kit and explain what it is used for without looking at the label."}, mid: {title:"Expiration audit", activity:"Check all items with expiration dates. Create a replacement calendar for items expiring in the next 6 months."}, high: {title:"Bleeding control", activity:"Research tourniquet use for severe bleeding. When is it indicated, how is it applied, and what is the time limit?"} },
    thursday:  { low: {title:"Label your kit", activity:"Make a label for your first aid kit. Include the words \u2018First Aid,\u2019 a red cross, and the date it was last checked."}, mid: {title:"Activity-specific kits", activity:"Design a first aid kit for: a camping trip, a day at a sports tournament, and a power outage at home. How do the kits differ?"}, high: {title:"Stop the Bleed program", activity:"Research the Stop the Bleed campaign. What are the three steps it teaches? How could you apply them in an emergency?"} }
  },

  "What to do if the power goes out": {
    gradeHooks: {
      low: "If the lights go out, we stay calm, find our flashlights, and wait safely for the power to come back.",
      mid: "Power outages require knowing where emergency supplies are, food safety protocols, and when to use backup power.",
      high: "Extended power outage response involves food preservation, generator safety, medical equipment needs, and communication planning."
    },
    materials: ["Flashlight (to locate and test)", "Candle safety discussion"],
    steps: [
      "Ask: what happens in your house when the power goes out? What stops working?",
      "List what doesn\u2019t work: lights, refrigerator, microwave, internet, phone chargers (unless charged), heat or AC.",
      "Locate your home\u2019s flashlights and backup batteries together. Are they ready?",
      "Discuss food safety: a fridge keeps food safe for 4 hours, a freezer for 48 hours if kept closed.",
      "Make a simple power outage plan: where are the flashlights? What do we eat? Who do we call?"
    ],
    discussion: [
      {q:"Why should you keep your fridge and freezer closed during a power outage?", answers:["Every time you open it, cold air escapes and unsafe temperatures are reached faster."]},
      {q:"What is dangerous about using a gas generator indoors?", answers:["It produces carbon monoxide — an odorless, deadly gas. Generators must always be used outside and away from windows."]}
    ],
    challenge: "Test every flashlight in your home right now. Replace dead batteries. Store extras where everyone can find them.",
    tuesday:   { low: {title:"Power out kit", activity:"Assemble a power outage kit: flashlight, extra batteries, battery-powered radio, candles, matches, manual can opener."}, mid: {title:"Food safety timeline", activity:"Create a food safety decision chart for a power outage: what to keep, what to toss, and at what hour."}, high: {title:"Generator safety", activity:"Research the CPSC guidelines for generator use. List all safety rules and explain the science behind carbon monoxide danger."} },
    wednesday: { low: {title:"No-power cooking", activity:"Plan 3 meals you could make without electricity: cold sandwiches, canned food, crackers and peanut butter."}, mid: {title:"Battery backup options", activity:"Research portable battery banks, hand-crank devices, and solar chargers. What are the best options for keeping a phone charged during an outage?"}, high: {title:"Grid vulnerability", activity:"Research causes of major power grid failures in the US (weather, cyberattack, infrastructure age). What is being done to harden the grid?"} },
    thursday:  { low: {title:"Outage activity list", activity:"Write 5 activities you could do during a power outage that don\u2019t need electricity: board games, drawing, reading, storytelling, nature walk."}, mid: {title:"Medical equipment planning", activity:"Research how families with medical equipment (CPAP, oxygen, insulin) prepare for power outages. What solutions exist?"}, high: {title:"Florida power outage history", activity:"Research a major Florida power outage (hurricane related). How long did it last, how many people were affected, and what were the key recovery challenges?"} }
  },

  "Cooking with heat — safety rules": {
    gradeHooks: {
      low: "The stove and oven are hot! We always have a grown-up with us when we cook with heat.",
      mid: "Heat cooking introduces burns, fire risk, and food safety. Understanding each hazard enables safe, confident cooking.",
      high: "Professional culinary safety, temperature science, and Maillard reaction chemistry connect practical cooking to food science."
    },
    materials: ["Stove or hot plate to demonstrate (adult supervised)", "Oven mitts"],
    steps: [
      "Establish the rule: no cooking with heat without a grown-up present, no exceptions.",
      "Identify the heat hazards: burner flame, hot pan surface, steam, boiling liquid, hot oven.",
      "Demonstrate: how to turn on a burner safely, how to position a pan handle (to the side, not over another burner).",
      "Practice with oven mitts: pick up a cold pan and move it. Now imagine it is 400 degrees — is your grip secure?",
      "Discuss: what to do if something catches fire (smother, not water; step back; call for help if you can\u2019t control it)."
    ],
    discussion: [
      {q:"Why do we turn the pan handle to the side when cooking?", answers:["So it doesn\u2019t hang over another burner (where it can overheat) and so it can\u2019t be knocked off by someone walking by."]},
      {q:"What should you never do if your clothes catch fire?", answers:["Never run — running fans the flames. Stop, drop, and roll immediately."]}
    ],
    challenge: "With full adult supervision, cook one hot item today (scrambled eggs, pasta, soup). Narrate every safety step as you do it.",
    tuesday:   { low: {title:"Fire triangle review", activity:"Draw the fire triangle: fuel, heat, oxygen. What removes each element in a kitchen fire? (lid, baking soda, CO2 extinguisher)"}, mid: {title:"Boiling vs simmering", activity:"Research the difference between boiling and simmering temperatures. What does each do to food?"}, high: {title:"Maillard reaction", activity:"Research the Maillard reaction. Why does food brown when cooked with high heat? What temperatures are required?"} },
    wednesday: { low: {title:"Steam is hot demo", activity:"With a parent, boil water and carefully observe steam rising. Discuss: steam is 212\u00b0F and causes serious burns instantly."}, mid: {title:"Cooking temperatures chart", activity:"Research and make a chart of safe internal cooking temperatures for: chicken, ground beef, pork, fish, eggs."}, high: {title:"Thermal conductivity", activity:"Research why different pan materials (cast iron, stainless steel, copper, non-stick) conduct heat differently. How does this affect cooking?"} },
    thursday:  { low: {title:"Supervised cooking project", activity:"Make one simple hot dish with full adult supervision: grilled cheese, scrambled eggs, or hot oatmeal. Narrate safety steps."}, mid: {title:"Knife skills under heat", activity:"Practice mise en place: prep all vegetables before turning on any heat. Why do professional cooks do this?"}, high: {title:"Professional kitchen safety", activity:"Research OSHA requirements for commercial kitchen safety. How do professional standards compare to home cooking practices?"} }
  },

  "Making change for a dollar": {
    gradeHooks: {
      low: "Making change means figuring out how much money you get back when you pay more than something costs!",
      mid: "Making change reinforces subtraction, coin values, and practical transaction skills used throughout life.",
      high: "Mental math, currency literacy, and transaction verification are skills that build toward broader financial competence."
    },
    materials: ["Coins and dollar bills (real or play money)", "Small items to \u2018buy\u2019"],
    steps: [
      "Set up a pretend store with items priced at 25, 50, 75 cents.",
      "The customer pays with $1. How much change do they get?",
      "Practice counting up (the cashier method): from the price, count up to $1 using coins.",
      "Try several transactions, increasing difficulty.",
      "Discuss: why do cashiers count change back into your hand rather than handing you a handful of coins?"
    ],
    discussion: [
      {q:"If something costs 63 cents and you pay with a dollar, what is the easiest way to make change?", answers:["Count up: 63 to 65 (2 pennies), 65 to 75 (dime), 75 to $1 (quarter) = 37 cents change"]},
      {q:"Why is it useful to know how to make change even if stores have cash registers?", answers:["Registers can be wrong, power can go out, and mental math helps you verify you got the right amount back."]}
    ],
    challenge: "Play store with a family member. Make at least 10 transactions, always counting change back correctly.",
    tuesday:   { low: {title:"Count-up practice", activity:"Practice counting up to $1 from 10 different amounts: 17 cents, 43 cents, 81 cents. Use real coins."}, mid: {title:"Multi-item transactions", activity:"Buy 2\u20133 items that total more than $1. Practice making change from $5. What is the most efficient way to give change?"}, high: {title:"Cash vs digital payments", activity:"Research the decline of cash use in the US. What percentage of transactions are now digital? What does this mean for people without bank accounts?"} },
    wednesday: { low: {title:"Price tag game", activity:"Label 10 items around the house with prices between 5 and 95 cents. Play store and make change for each."}, mid: {title:"Fewest coins challenge", activity:"Make each amount (37 cents, 62 cents, 88 cents) using the fewest possible coins. Then make each using only pennies. Compare."}, high: {title:"Currency exchange", activity:"Research how currency exchange rates work. If $1 USD = 0.92 EUR today, how much is $50 in euros? How do you calculate it?"} },
    thursday:  { low: {title:"Restaurant role play", activity:"Create a simple menu with prices. Take turns being the customer and the cashier. Practice making change correctly every time."}, mid: {title:"Tip calculation", activity:"Learn to calculate a 15% and 20% tip on restaurant bills. Practice on 5 different bill amounts."}, high: {title:"Sales tax calculation", activity:"Research Florida\u2019s sales tax rate. Calculate the final price (with tax) of 5 items from a store circular. Build a formula."} }
  },

  "Who are my neighbors?": {
    gradeHooks: {
      low: "Neighbors are the people who live near us! Knowing our neighbors makes our neighborhood safer and friendlier.",
      mid: "Strong neighbor relationships are a documented factor in community resilience and neighborhood safety.",
      high: "Social capital, community cohesion, and the role of interpersonal trust in disaster response are well-researched topics."
    },
    materials: ["Paper and pencil for a neighbor map"],
    steps: [
      "Ask: do you know the names of any of our neighbors?",
      "Discuss: neighbors are people who can help us and who we can help. They are part of our community team.",
      "Draw a simple map of your street. Label your home, then add the 2\u20133 nearest neighbor homes.",
      "Talk about how to introduce yourself to a neighbor and why it matters.",
      "Identify one neighbor your family trusts and discuss how you would contact them in an emergency."
    ],
    discussion: [
      {q:"Why might it be helpful to know a neighbor\u2019s phone number?", answers:["If there is an emergency at home and you can\u2019t reach a parent, a trusted neighbor can help."]},
      {q:"What can you do to be a good neighbor?", answers:["Say hello, offer to help with small things, respect their space and quiet hours, look out for their home when they travel."]}
    ],
    challenge: "With a parent, introduce yourself to one neighbor you don\u2019t know well yet. Learn their name.",
    tuesday:   { low: {title:"Neighbor kindness project", activity:"Bake something or make a card and deliver it to a neighbor. Practice introducing yourself with your full name."}, mid: {title:"Block communication plan", activity:"Research neighborhood apps (Nextdoor, etc.) or old-school methods for neighbors to communicate. What works best in emergencies?"}, high: {title:"Social capital research", activity:"Research the concept of social capital. How does knowing your neighbors correlate with neighborhood crime rates and disaster recovery outcomes?"} },
    wednesday: { low: {title:"Neighborhood scavenger walk", activity:"On a walk, count: How many neighbors do you recognize? How many homes have you never noticed before?"}, mid: {title:"Community watch programs", activity:"Research neighborhood watch programs. What are the key principles, and do they reduce crime?"}, high: {title:"Gentrification and community", activity:"Research how neighborhood gentrification can disrupt established social networks. What are the human costs beyond housing prices?"} },
    thursday:  { low: {title:"Neighbor map update", activity:"Update your neighbor map with at least one name you learned this week. Add their home with a friendly symbol."}, mid: {title:"Emergency neighbor network", activity:"Design a neighborhood emergency communication plan for 5 homes. Who contacts who? Who has what skills or supplies?"}, high: {title:"Community organizing", activity:"Research a grassroots community organization in your city. How did it start, what does it do, and how can residents get involved?"} }
  },

  "What is a food allergy?": {
    gradeHooks: {
      low: "Some people\u2019s bodies react badly to certain foods. Knowing about food allergies helps us keep everyone safe.",
      mid: "Food allergies trigger immune responses that can range from mild to life-threatening. Recognition and response are critical skills.",
      high: "Food allergy immunology, anaphylaxis response protocols, and food labeling laws are important health and safety topics."
    },
    materials: ["Food labels to examine"],
    steps: [
      "Ask: do you know anyone who is allergic to a food? What happens to them?",
      "Explain: a food allergy is when the body\u2019s immune system treats a food like an enemy and attacks it.",
      "Name the 9 major allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame.",
      "Discuss mild reactions (hives, stomach ache) vs severe reactions (throat swelling, anaphylaxis).",
      "Talk about how to help: never share food without knowing ingredients, tell an adult immediately if someone says they had an allergen."
    ],
    discussion: [
      {q:"If a friend says they feel itchy and their throat feels funny after eating something, what do you do?", answers:["Tell an adult immediately. This could be anaphylaxis, which requires epinephrine and a 911 call."]},
      {q:"Why is it important to read food labels even for snacks you\u2019ve had before?", answers:["Recipes and ingredients change. A product that was safe before might now contain a new allergen."]}
    ],
    challenge: "Read the ingredient labels on 5 items in your kitchen. Identify which major allergens are present in each.",
    tuesday:   { low: {title:"Allergen label hunt", activity:"Find the allergen warnings on 3 food packages. The words \u2018Contains\u2019 or \u2018May contain\u2019 tell you the risk."}, mid: {title:"Anaphylaxis symptoms", activity:"Research the symptoms of anaphylaxis in order of progression. What are early warning signs vs severe emergency signs?"}, high: {title:"EpiPen mechanics", activity:"Research how an epinephrine auto-injector works. What does epinephrine do physiologically during anaphylaxis?"} },
    wednesday: { low: {title:"Safe snack planning", activity:"Plan a snack that is free of the top 9 allergens. Check every ingredient. This is called a \u2018free from\u2019 recipe."}, mid: {title:"Cross-contact vs cross-contamination", activity:"Research the difference between cross-contact and cross-contamination in food allergy contexts. Why does this distinction matter?"}, high: {title:"FALCPA law", activity:"Research the Food Allergen Labeling and Consumer Protection Act. What does it require, and how was it recently updated to include sesame?"} },
    thursday:  { low: {title:"Allergy-aware role play", activity:"Act out: a friend at a party says they are allergic to peanuts. There are peanuts in the cookies. What do you do and say?"}, mid: {title:"School allergy policy", activity:"Research your state\u2019s or school\u2019s food allergy policies. Are schools required to have epinephrine on hand? Is staff trained?"}, high: {title:"Allergy prevalence trends", activity:"Research whether food allergy rates have increased in recent decades. What hypotheses exist for why this is happening (hygiene hypothesis, early exposure studies)?"} }
  },



  "My emergency contact card": {
    gradeHooks: {
      low: "An emergency contact card has your name, address, and a phone number so helpers can reach your family.",
      mid: "Every child should have a personal emergency contact card memorized and carried in their backpack.",
      high: "Emergency preparedness includes having personal and family contact information documented and accessible offline."
    },
    materials: ["Index card or cardstock", "Pencil and markers", "Laminating sheet or tape (optional)"],
    steps: [
      "Talk about what information is most important in an emergency: your full name, home address, and a parent or guardian phone number.",
      "Write (or help write) that information neatly on an index card.",
      "Add a second emergency contact — another trusted adult like a grandparent or neighbor.",
      "Decorate the card so it feels personal and special.",
      "Put the card in a backpack or keep it in a safe, accessible place."
    ],
    discussion: [
      {q:"Why might you need this card even if you have a phone?", answers:["Phones can die or get lost. A card works without battery or signal."]},
      {q:"What information should always be on an emergency contact card?", answers:["Full name, home address, parent\u2019s phone number, and a second contact"]}
    ],
    challenge: "Memorize everything on your card. Ask a parent to quiz you tomorrow — no peeking!",
    tuesday:   { low: {title:"Quiz time", activity:"Without looking, say your full name, address, and one parent phone number out loud 3 times."}, mid: {title:"Family contact tree", activity:"Create a contact tree with primary, secondary, and out-of-state contacts. Explain why an out-of-state contact is useful in a local disaster."}, high: {title:"Digital backup", activity:"Research apps or systems for storing emergency contacts offline on a phone. What are the pros and cons of digital vs physical cards?"} },
    wednesday: { low: {title:"Role play", activity:"Pretend a helper asks who you are and how to reach your family. Practice your answer smoothly."}, mid: {title:"School emergency card", activity:"Compare your personal card to the emergency contact form your school has on file. Are they current and complete?"}, high: {title:"Community emergency info", activity:"Research what information emergency management agencies recommend families document. Create a comprehensive family emergency contact binder outline."} },
    thursday:  { low: {title:"New card for backpack", activity:"Make a second copy of your card to live in your backpack all year. Keep the original at home."}, mid: {title:"Update check", activity:"Review all emergency contacts. Have any numbers changed? Update the card and the school\u2019s records."}, high: {title:"Go-bag contacts", activity:"Design a one-page emergency information sheet for a family go-bag. Include contacts, medical info, and meeting locations."} }
  },

  "Basic first aid — bandages and cuts": {
    gradeHooks: {
      low: "When we get a small cut, we can help it heal by cleaning it and putting on a bandage.",
      mid: "Proper wound care prevents infection. Cleaning, applying pressure, and bandaging are foundational first aid skills.",
      high: "Wound assessment, sterile technique, recognizing infection signs, and when to escalate care are important emergency response skills."
    },
    materials: ["Bandages (various sizes)", "Gauze", "Clean water", "Soap"],
    steps: [
      "Explain: small cuts are common and we can take care of them ourselves.",
      "Step 1: Wash your hands first so you don\u2019t add germs to the cut.",
      "Step 2: Rinse the cut with clean running water for 1\u20132 minutes.",
      "Step 3: Apply gentle pressure with a clean cloth if it is bleeding.",
      "Step 4: Let it dry slightly, then cover with the right-size bandage.",
      "Practice on a doll or each other\u2019s arm (without a real cut)."
    ],
    discussion: [
      {q:"When is a cut too serious to handle at home?", answers:["If it won\u2019t stop bleeding after 10 minutes of pressure, if it is very deep or has something stuck in it, if it is on the face or joint"]},
      {q:"Why do we wash hands before helping someone with a cut?", answers:["Our hands carry germs that can cause infection in an open wound"]}
    ],
    challenge: "Locate the first aid kit in your home. Make sure it has bandages, gauze, and antiseptic. Restock anything missing.",
    tuesday:   { low: {title:"Bandage practice", activity:"Practice putting a bandage on a stuffed animal 5 times until it is smooth and flat with no air bubbles."}, mid: {title:"Wound types", activity:"Research the difference between abrasions, lacerations, and puncture wounds. Draw and label each."}, high: {title:"Infection signs", activity:"List 5 signs a wound has become infected. At what point should someone seek medical care?"} },
    wednesday: { low: {title:"First aid kit inventory", activity:"Open the first aid kit together. Name each item and guess what it is used for."}, mid: {title:"Pressure and elevation", activity:"Demonstrate applying direct pressure to a wound. Research why elevation helps reduce bleeding."}, high: {title:"Sterile technique", activity:"Research what sterile technique means in medical settings. What aspects can be applied in home first aid?"} },
    thursday:  { low: {title:"Oops scenario", activity:"Act out: you trip outside and scrape your knee. Walk through every step of cleaning and bandaging."}, mid: {title:"Teach-back", activity:"Teach a younger sibling or parent the 4 steps of basic wound care. Can they repeat them back?"}, high: {title:"Advanced wound care", activity:"Research when sutures (stitches) are needed vs when wound closure strips suffice. What are the criteria?"} }
  },

  "Fire safety at home": {
    gradeHooks: {
      low: "We can keep our home safe from fire by following simple rules and knowing what to do if we smell smoke.",
      mid: "Most home fires are preventable. Understanding common causes and having a practiced escape plan saves lives.",
      high: "Home fire statistics, cause analysis, detection technology, and escape planning are components of comprehensive home safety."
    },
    materials: ["Paper for floor plan drawing"],
    steps: [
      "Ask: what are some things in our house that could cause a fire if we aren\u2019t careful?",
      "Discuss common home fire causes: unattended cooking, candles, overloaded outlets, space heaters near cloth.",
      "Walk through each room and identify one potential fire hazard.",
      "Review the two exits from each room and your family meeting spot outside.",
      "Practice your fire escape plan: low crawl through a smoke-filled room, feel the door before opening."
    ],
    discussion: [
      {q:"What is the number one cause of home fires?", answers:["Cooking — leaving the stove or oven unattended"]},
      {q:"If you wake up and smell smoke, what is the first thing you do?", answers:["Get low, feel the door handle before opening, get out fast, do not stop for anything, go to the meeting spot"]}
    ],
    challenge: "Draw a floor plan of your home and mark two exits from every room plus your family\u2019s outdoor meeting spot.",
    tuesday:   { low: {title:"Hazard hunt", activity:"Walk through each room with a parent. Find one fire hazard in each room and discuss how to fix it."}, mid: {title:"Fire statistics", activity:"Look up how many home fires happen each year in the US and what causes the most. Summarize 3 facts."}, high: {title:"Fire prevention engineering", activity:"Research how fire-resistant building materials and sprinkler systems work. What is the cost-benefit of home sprinkler installation?"} },
    wednesday: { low: {title:"Escape route drawing", activity:"Draw your home\u2019s floor plan with arrows showing the two ways out of your bedroom."}, mid: {title:"Kitchen fire safety", activity:"Research what to do if a pan catches fire on the stove. What should you NEVER do with a grease fire? Why?"}, high: {title:"Electrical fire causes", activity:"Research how overloaded circuits and faulty wiring cause fires. List 5 electrical safety rules for the home."} },
    thursday:  { low: {title:"Fire drill", activity:"Conduct a home fire drill. Practice low crawl, door check, exit, and meeting at the spot. Time it."}, mid: {title:"Fire extinguisher types", activity:"Research the PASS method for fire extinguishers. What do the ABC ratings mean? Which type belongs in a kitchen?"}, high: {title:"Home fire safety audit", activity:"Conduct a full home fire safety audit using a checklist from NFPA.org. Rate your home and list improvements."} }
  },

  "How plants grow — plant a seed": {
    gradeHooks: {
      low: "Seeds grow into plants! They need soil, water, sunlight, and time. Let\u2019s plant one and watch it grow.",
      mid: "Germination, root growth, and photosynthesis are the core processes that take a seed to a full plant.",
      high: "Plant biology — including seed anatomy, germination conditions, and growth stages — connects to food production and ecology."
    },
    materials: ["Fast-germinating seeds (bean, sunflower, or radish)", "Small cups or pots", "Potting soil", "Water"],
    steps: [
      "Examine a seed closely. Ask: what do you think is inside?",
      "Explain the three things a seed needs to sprout: water, warmth, and oxygen (not even light yet!).",
      "Fill a cup with soil, poke a hole with one finger, drop in 2 seeds, cover lightly, and water gently.",
      "Place in a warm spot and commit to checking it every day.",
      "Draw the seed today. In one week, draw again and compare."
    ],
    discussion: [
      {q:"Why does the root grow down and the stem grow up?", answers:["Plants have built-in signals called gravitropism — roots follow gravity, stems grow away from it toward light"]},
      {q:"What would happen if a plant had water and soil but no light?", answers:["It would sprout but quickly grow weak and pale because it can\u2019t make food without sunlight"]}
    ],
    challenge: "Keep a plant journal for two weeks. Sketch the sprout every 2\u20133 days and record any changes.",
    tuesday:   { low: {title:"Seed anatomy", activity:"Open a soaked bean seed carefully. Find the tiny plant inside (the embryo). Draw what you see."}, mid: {title:"Germination experiment", activity:"Plant the same seeds in three conditions: normal soil, dry soil, and a dark box. Observe for one week."}, high: {title:"Agricultural research", activity:"Research how seed banks work and why they are important for food security. Name one major seed bank."} },
    wednesday: { low: {title:"Root observation", activity:"Plant a bean in a clear plastic cup against the side. Watch the roots grow downward over the next week."}, mid: {title:"Photosynthesis diagram", activity:"Draw and label the photosynthesis process: sunlight, water, CO2 in; glucose and oxygen out."}, high: {title:"GMO seeds", activity:"Research the difference between hybrid seeds, heirloom seeds, and GMO seeds. What are the arguments for and against each?"} },
    thursday:  { low: {title:"Watering schedule", activity:"Decide on a watering schedule for your plant. Make a chart to check off watering days."}, mid: {title:"Plant growth stages", activity:"Draw and label the 5 stages of a plant\u2019s life cycle: seed, sprout, seedling, mature plant, flower/fruit."}, high: {title:"Hydroponics", activity:"Research hydroponic growing. How do plants grow without soil? What are the advantages and limitations?"} }
  },

  "Intro to tools — look but ask first": {
    gradeHooks: {
      low: "Tools are helpers, not toys. We always ask a grown-up before touching tools, and we learn to use them safely.",
      mid: "Tools multiply human capability when used correctly. Understanding function, safety rules, and proper storage is foundational.",
      high: "Tool literacy, including hand tools, power tools, and their safe use, is a practical life skill applicable in home maintenance and crafts."
    },
    materials: ["A few safe hand tools to examine (hammer, screwdriver, tape measure)"],
    steps: [
      "Gather 2\u20133 hand tools to look at together. Do not hand over sharp tools.",
      "Name each tool and ask: what do you think this is used for?",
      "Establish the rule: tools are not toys. We pick them up only when a grown-up says it is time to use them.",
      "Demonstrate safe handling for one tool: carry a hammer by the handle, point end down.",
      "Let the child safely hold (and use under supervision) one simple tool like a screwdriver."
    ],
    discussion: [
      {q:"Why are tools kept in a toolbox or locked away?", answers:["So children don\u2019t play with them unsupervised, so they don\u2019t get lost, so they stay clean and sharp"]},
      {q:"What should you do if a tool has a sharp or broken edge?", answers:["Tell a grown-up immediately. Don\u2019t use a broken tool."]}
    ],
    challenge: "With a parent, identify 5 tools in your home and what each one is used for. Make a labeled drawing.",
    tuesday:   { low: {title:"Tool sorting", activity:"Sort pictures or toy tools by category: cutting tools, tightening tools, measuring tools, hitting tools."}, mid: {title:"Right tool for the job", activity:"List 10 home repair tasks and match each to the correct tool. Explain why the right tool matters."}, high: {title:"Tool history", activity:"Research how one common hand tool (hammer, screwdriver, or saw) evolved over history. When was it invented and how has it changed?"} },
    wednesday: { low: {title:"Screwdriver practice", activity:"Find 3 screws around the house (in furniture, outlet plates, etc.). Practice turning each with the right screwdriver."}, mid: {title:"Tool safety rules", activity:"Write 10 tool safety rules that apply to any hand tool. Present them to the family."}, high: {title:"Power vs hand tools", activity:"Compare hand tools to their power tool equivalents. What are the safety differences and when would you choose one over the other?"} },
    thursday:  { low: {title:"Simple project", activity:"With full supervision, use a hammer and nails to join two scrap pieces of wood or make a simple frame."}, mid: {title:"Tool maintenance", activity:"Research how to clean and maintain 3 common hand tools. Why does a dull saw or drill bit matter?"}, high: {title:"Home repair project", activity:"Plan a small home repair project (tightening cabinet hinges, patching a hole). List all tools and steps needed."} }
  },

  "Community helpers who keep us safe": {
    gradeHooks: {
      low: "Firefighters, police officers, doctors, and teachers all help keep us safe in different ways.",
      mid: "Community safety systems rely on trained professionals working in coordinated roles. Understanding who does what helps in emergencies.",
      high: "Emergency response systems are complex networks of public servants, first responders, and volunteers. Their coordination determines outcomes."
    },
    materials: ["Paper and crayons"],
    steps: [
      "Ask: who do we call when different emergencies happen?",
      "Match helpers to emergencies: fire (firefighter), crime or lost child (police), medical (paramedic or doctor), school (teacher/counselor).",
      "Discuss: all these helpers train very hard for their jobs.",
      "Talk about how to be respectful and helpful when a community helper arrives — stay calm, listen, and follow directions.",
      "Draw your favorite community helper and write (or dictate) one sentence about what they do."
    ],
    discussion: [
      {q:"What should you do when a firefighter or police officer gives you an instruction?", answers:["Listen carefully and follow the instruction — they are trained to keep you safe"]},
      {q:"How can kids be community helpers too?", answers:["By helping neighbors, following rules, being kind, and telling adults about dangerous situations"]}
    ],
    challenge: "Write or draw a \u2018thank you\u2019 card for a community helper and ask a parent to help you deliver or mail it.",
    tuesday:   { low: {title:"Helper matching", activity:"Make cards with helper names and emergency scenarios. Match each helper to 2\u20133 situations they respond to."}, mid: {title:"Emergency call routing", activity:"Research what happens after you call 911. How does the dispatcher decide who to send?"}, high: {title:"Emergency management systems", activity:"Research your county\u2019s Office of Emergency Management. What is their role and how do they coordinate with first responders?"} },
    wednesday: { low: {title:"Role play day", activity:"Take turns pretending to be different community helpers. Use props and practice what to say."}, mid: {title:"Volunteer first responders", activity:"Research volunteer fire departments and EMS. What percentage of US fire departments are volunteer-staffed?"}, high: {title:"Mutual aid agreements", activity:"Research what mutual aid agreements are between jurisdictions. Why are they critical during large-scale disasters?"} },
    thursday:  { low: {title:"Community helper book", activity:"Make a simple 5-page book: one page per helper. Draw each one and write what they do."}, mid: {title:"Career research", activity:"Choose one community helper career. Research education requirements, typical salary, and day-to-day responsibilities."}, high: {title:"Systemic gaps", activity:"Research disparities in emergency response times between high-income and low-income neighborhoods. What factors contribute and what solutions have been proposed?"} }
  },

  "Weather signs — clouds and rain": {
    gradeHooks: {
      low: "Clouds can tell us what weather is coming! Dark clouds often mean rain. Puffy white clouds usually mean a nice day.",
      mid: "Cloud types are indicators of incoming weather. Learning to read the sky is a practical observation skill.",
      high: "Meteorological cloud classification, pressure systems, and weather prediction are based on observable atmospheric patterns."
    },
    materials: ["Access to an outdoor view or window"],
    steps: [
      "Go outside or look out a window. What do the clouds look like right now?",
      "Introduce 3 cloud types with simple descriptions: cumulus (puffy, fair weather), stratus (flat gray, rain possible), cumulonimbus (tall and dark, storm coming).",
      "Explain: when clouds build tall and dark, it\u2019s a sign to head indoors.",
      "Ask: what other signs tell us it might rain? (humid air, smell of rain, dropping temperature)",
      "Draw today\u2019s clouds and predict tomorrow\u2019s weather."
    ],
    discussion: [
      {q:"Why do clouds make rain?", answers:["Water droplets in clouds combine until they are heavy enough to fall as rain"]},
      {q:"What is the difference between fog and clouds?", answers:["Fog is a cloud that forms at ground level — they are made of the same thing: tiny water droplets"]}
    ],
    challenge: "Watch the sky for 3 days in a row. Sketch the clouds each morning and see if you can predict afternoon weather.",
    tuesday:   { low: {title:"Cloud mobile", activity:"Cut 3 cloud shapes from white and gray paper. Label each type and hang as a mobile."}, mid: {title:"Cloud atlas", activity:"Look up the official cloud types (10 main genera). Draw and label at least 5 with the weather each signals."}, high: {title:"Doppler radar", activity:"Research how Doppler radar works. How does it detect rain, wind, and storm rotation?"} },
    wednesday: { low: {title:"Rain in a jar", activity:"Heat water until steaming, hold a bag of ice above it, and watch condensation drip. Discuss: this is how rain forms!"}, mid: {title:"Weather fronts", activity:"Research cold fronts and warm fronts. Draw what happens when they collide. What type of weather results?"}, high: {title:"Climate modeling", activity:"Research how computer models predict weather. What inputs do they use and how far in advance can they accurately forecast?"} },
    thursday:  { low: {title:"Sky journal", activity:"Draw the sky 3 times today: morning, noon, afternoon. Did it change? What did that mean for the weather?"}, mid: {title:"Local storm research", activity:"Research the most common severe weather in your state. What cloud formations often precede it?"}, high: {title:"Citizen science weather", activity:"Research CoCoRaHS or similar citizen weather observation networks. How can individuals contribute data to meteorologists?"} }
  },

  "Being helpful at home": {
    gradeHooks: {
      low: "Helping at home makes our family strong! Even small jobs like picking up toys or setting the table make a big difference.",
      mid: "Taking responsibility for household tasks builds life skills, family teamwork, and a sense of contribution.",
      high: "Household management, time allocation, and equitable distribution of domestic labor are practical and social topics."
    },
    materials: ["A chore chart or paper to make one"],
    steps: [
      "Ask: what are some jobs that keep our house running every day?",
      "List age-appropriate chores: putting toys away, wiping tables, feeding pets, setting the table, taking out trash.",
      "Discuss: when everyone helps, no one person gets overwhelmed. It\u2019s a team effort.",
      "Assign one chore to try today. Do it together the first time.",
      "Make a simple chore chart with names and daily jobs."
    ],
    discussion: [
      {q:"Why is it important to help at home even if your parent didn\u2019t ask you?", answers:["Because a family is a team. Noticing what needs doing and doing it is a sign of responsibility."]},
      {q:"What chores do you think you could do completely on your own?", answers:["Answers vary — discuss each and whether help or supervision is still needed"]}
    ],
    challenge: "Do your chore every day for one week without being reminded. Keep a tally chart.",
    tuesday:   { low: {title:"Chore speed round", activity:"Set a timer for 10 minutes. See how many small chores you can complete before it goes off."}, mid: {title:"Weekly chore plan", activity:"Create a weekly chore rotation chart for your whole family. Make sure tasks are distributed fairly."}, high: {title:"Time audit", activity:"Track how long household tasks take in one day. What tasks take the most time? How could they be made more efficient?"} },
    wednesday: { low: {title:"Teach the steps", activity:"Choose one chore and write or draw each step in order. Teach it to a younger sibling or explain it to a parent."}, mid: {title:"Chore economics", activity:"Research what services like house cleaning, laundry, and yard work cost when hired out. Calculate the monthly value of your family\u2019s unpaid household labor."}, high: {title:"Division of labor research", activity:"Research studies on the division of household labor by gender. What patterns exist and how have they changed over decades?"} },
    thursday:  { low: {title:"Gratitude reflection", activity:"Think about what your home would look like if no one did any chores for a week. Write or draw what you imagine."}, mid: {title:"Efficiency experiment", activity:"Try two different methods for a chore (e.g., making the bed military-style vs casual). Time each. Which is faster and looks better?"}, high: {title:"Systems thinking", activity:"Design a household system that minimizes daily chore time using batching, scheduling, and shared responsibility. Present it to your family."} }
  },

  "Learning my address and school name": {
    gradeHooks: {
      low: "Knowing your home address helps helpers find your family if you ever get lost.",
      mid: "Memorizing your address, school name, and key contact information is a foundational personal safety skill.",
      high: "Personal information management — what to share, when, and with whom — is part of both physical safety and digital literacy."
    },
    materials: ["Paper and pencil"],
    steps: [
      "Ask: do you know your home address? (street number, street name, city, state, zip)",
      "Write the address out together and read it aloud several times.",
      "Practice: say it as a chant, a song, or with a clap rhythm.",
      "Add: your school name and what city it is in.",
      "Talk about when you might need this information: getting lost, filling out a form, calling for help."
    ],
    discussion: [
      {q:"Why is it important to know your zip code and state, not just your street?", answers:["In an emergency, the helper may need to find you in a database or direct emergency services to the right location"]},
      {q:"Who is it okay to give your address to?", answers:["Trusted helpers like police, emergency responders, and school staff — not strangers on the street or online"]}
    ],
    challenge: "Say your full address (street, city, state, zip) and school name from memory, three times in a row, perfectly.",
    tuesday:   { low: {title:"Address art", activity:"Write your address in large letters and decorate the paper. Hang it somewhere you\u2019ll see it every day."}, mid: {title:"Personal information card", activity:"Create a laminated emergency info card: full name, address, school, two parent phone numbers."}, high: {title:"Address privacy", activity:"Research how your home address can be found online. What steps can families take to protect their address privacy?"} },
    wednesday: { low: {title:"Map it", activity:"Look up your address on a map app together. Find your home, your school, and your nearest grocery store."}, mid: {title:"Address format around the world", activity:"Research how addresses are formatted in 3 other countries. How are they different from US format?"}, high: {title:"911 location systems", activity:"Research how 911 dispatchers locate callers. How does E911 work, and what are its limitations with cell phones?"} },
    thursday:  { low: {title:"Full info recitation", activity:"Practice your full name, address, and school name until you can say all three without pausing. Time yourself."}, mid: {title:"Teach a younger child", activity:"Teach a younger sibling or friend how to memorize their address using a song or rhyme."}, high: {title:"Digital identity", activity:"Research what information is publicly connected to a home address. Discuss why personal information hygiene matters from a young age."} }
  },

  "Kitchen safety rules": {
    gradeHooks: {
      low: "The kitchen has hot things, sharp things, and heavy things. We learn the rules so we can be safe helpers!",
      mid: "Kitchen safety covers burns, cuts, foodborne illness, and fire prevention. Understanding each risk enables safe, independent cooking.",
      high: "A comprehensive kitchen safety framework includes hazard identification, proper technique, food safety science, and emergency response."
    },
    materials: ["Kitchen access", "Oven mitts to try on"],
    steps: [
      "Walk through the kitchen and point to 3 things that require extra care: stove, knives, hot pans.",
      "Cover the big three rules: never touch the stove without permission, knife tips point down, always use oven mitts for anything that was in the oven.",
      "Practice using oven mitts: put them on, pick up a cold pot, set it down carefully.",
      "Discuss what to do if something catches fire in the kitchen: do not use water on a grease fire, smother it with a lid.",
      "Review: ask before you cook, clean up spills immediately, wash hands before handling food."
    ],
    discussion: [
      {q:"Why do we never use water to put out a grease fire?", answers:["Water causes hot grease to explode into a fireball — use a lid or fire extinguisher instead"]},
      {q:"What is cross-contamination and why does it matter?", answers:["Using the same cutting board for raw meat and vegetables can spread bacteria. Always use separate boards or wash between uses."]}
    ],
    challenge: "Write your own \u2018Kitchen Safety Pledge\u2019 with 5 rules you commit to following every time you cook.",
    tuesday:   { low: {title:"Safe vs unsafe", activity:"Draw two columns: safe kitchen behaviors and unsafe ones. Fill each with at least 4 examples."}, mid: {title:"Knife skills basics", activity:"Research the claw grip for cutting. Practice on a soft food (banana, mushroom) with a butter knife under supervision."}, high: {title:"Foodborne illness", activity:"Research the 4 most common foodborne pathogens (Salmonella, E. coli, Listeria, Campylobacter). How does each spread and how is it prevented?"} },
    wednesday: { low: {title:"Burn treatment review", activity:"Review the steps for treating a minor burn: cool water for 10 minutes, no butter, cover loosely. Practice on a doll."}, mid: {title:"Safe food temps", activity:"Research safe internal cooking temperatures for chicken, beef, and pork. Why does temperature matter for safety?"}, high: {title:"HACCP system", activity:"Research HACCP (Hazard Analysis Critical Control Points). How do commercial kitchens use it, and how can the principles apply at home?"} },
    thursday:  { low: {title:"Simple safe recipe", activity:"With supervision, make a no-heat snack (ants on a log, fruit kabobs) while narrating every safety step."}, mid: {title:"Kitchen fire response", activity:"Create a step-by-step kitchen fire response plan. Include what to do for a pan fire, oven fire, and when to call 911."}, high: {title:"Meal prep safety", activity:"Plan a full meal prep session with safety checkpoints: handwashing, temperature monitoring, cross-contamination prevention. Present the plan."} }
  },

  "Where does water come from?": {
    gradeHooks: {
      low: "Water comes from rain, rivers, and underground. Cities clean it so it is safe to drink from our faucet!",
      mid: "Water cycles through evaporation, condensation, and precipitation. Municipal treatment makes it safe for use.",
      high: "Hydrology, municipal water treatment, aquifer depletion, and global water scarcity are interconnected environmental topics."
    },
    materials: ["A clear glass of water", "Paper and pencil"],
    steps: [
      "Hold up a glass of water. Ask: where did this water come from before our faucet?",
      "Trace it back: faucet \u2192 pipes \u2192 water treatment plant \u2192 reservoir or groundwater \u2192 rain or snowmelt.",
      "Draw a simple water cycle: evaporation from ocean or lake, clouds form, rain falls, water flows to rivers or soaks into ground.",
      "Discuss: water treatment removes bacteria and chemicals so it is safe to drink.",
      "Talk about conservation: water is a limited resource. Turning off the faucet while brushing teeth saves gallons."
    ],
    discussion: [
      {q:"Can we ever run out of fresh water?", answers:["Yes — many places already face water shortages. Groundwater used faster than it refills doesn\u2019t come back quickly."]},
      {q:"What are 3 ways your family uses water at home?", answers:["Drinking, cooking, bathing, laundry, dishes, watering plants, flushing toilets"]}
    ],
    challenge: "Track your family\u2019s water use for one day. Count toilet flushes, showers, and dish washing. Estimate total gallons used.",
    tuesday:   { low: {title:"Water cycle art", activity:"Make a water cycle diagram with arrows: sun heats water, vapor rises, clouds form, rain falls, water flows back."}, mid: {title:"Water treatment steps", activity:"Research the 6 steps of municipal water treatment. Draw and label each step in order."}, high: {title:"Aquifer research", activity:"Research the Ogallala Aquifer. What is it, how fast is it being depleted, and what are the consequences for US agriculture?"} },
    wednesday: { low: {title:"Float and sink", activity:"Drop 5 different objects in water: which float? Which sink? Discuss density vs water in simple terms."}, mid: {title:"Groundwater vs surface water", activity:"Compare groundwater and surface water sources. Which is more vulnerable to contamination and why?"}, high: {title:"Water rights", activity:"Research water rights law in the western US. What is prior appropriation and how does it affect communities in drought?"} },
    thursday:  { low: {title:"Water saving challenge", activity:"Pick one water-saving habit to try for a week: shorter showers, turning off faucet while brushing, only full loads of laundry."}, mid: {title:"Water footprint", activity:"Calculate the water footprint of one meal. Include water used to grow ingredients, not just cooking water."}, high: {title:"Global water crisis", activity:"Research which countries face the most severe water scarcity. What political and geographic factors contribute? Propose one evidence-based solution."} }
  },

  "Pennies nickels dimes — counting coins": {
    gradeHooks: {
      low: "Pennies are worth 1 cent, nickels are 5, and dimes are 10. We can count coins to know how much money we have!",
      mid: "Coin identification and counting is the foundation of financial literacy and practical money management.",
      high: "Understanding currency, denomination systems, and basic arithmetic with money connects to budgeting and financial planning."
    },
    materials: ["Real coins: pennies, nickels, dimes, quarters"],
    steps: [
      "Lay out one of each coin. Examine them: size, color, picture on each side.",
      "Name each and its value: penny (1\u00a2), nickel (5\u00a2), dime (10\u00a2), quarter (25\u00a2).",
      "Practice counting: 3 nickels = ? Start with small groups.",
      "Mix coins and count to a target number (like 30 cents) multiple ways.",
      "Discuss: why is a dime worth more than a nickel even though a nickel is bigger?"
    ],
    discussion: [
      {q:"If you have 2 dimes and 1 nickel, how much do you have?", answers:["25 cents"]},
      {q:"How many pennies equal a quarter?", answers:["25 pennies"]}
    ],
    challenge: "Find all the coins in your house. Count and sort them. How much is there total?",
    tuesday:   { low: {title:"Coin rubbings", activity:"Place coins under paper and rub a crayon over them to reveal the faces. Label each with its value."}, mid: {title:"Making change", activity:"Practice making change for purchases between $1 and $5. How many ways can you make 75 cents?"}, high: {title:"Currency history", activity:"Research the history of US coinage. When did each coin design change and why? What is the process for approving a new coin design?"} },
    wednesday: { low: {title:"Store role play", activity:"Set up a pretend store with items priced at 5\u201325 cents. Practice paying exactly and making change."}, mid: {title:"Decimal and coin connection", activity:"Connect coin counting to decimals: $0.25, $0.10, $0.05, $0.01. Practice writing coin totals as dollar amounts."}, high: {title:"Purchasing power over time", activity:"Research what one dollar could buy in 1950, 1980, and today. Calculate the inflation rate between those periods."} },
    thursday:  { low: {title:"Piggy bank sort", activity:"Sort a pile of mixed coins into groups. Count each group, then add all groups together."}, mid: {title:"Coin word problems", activity:"Write 5 coin math word problems for a younger child. Solve them yourself, then try them on a sibling."}, high: {title:"Digital vs physical currency", activity:"Research the shift from physical cash to digital payment. What are the advantages and risks of a cashless society for different groups of people?"} }
  },



  "What does a police officer do?": {
    gradeHooks: {
      low: "Police officers help keep our neighborhood safe and can help if you are lost or scared.",
      mid: "Police officers enforce laws, respond to emergencies, and work with the community to solve problems.",
      high: "Law enforcement roles vary widely — patrol, investigation, community liaison — and interact with legal and civic systems."
    },
    materials: ["Paper and crayons", "A toy badge or star sticker"],
    steps: [
      "Ask: has anyone ever seen a police officer? What were they doing?",
      "Explain: police officers wear a uniform and a badge so we know who they are.",
      "Share 3 things officers do: help people who are lost, respond when someone calls 911, and patrol neighborhoods.",
      "Practice: if you are lost in a store, find someone in a uniform or ask a store worker to call for help.",
      "Draw a picture of a police officer helping someone."
    ],
    discussion: [
      {q:"What do you do if you are lost in a big store?", answers:["Stay calm, find a worker or uniformed person, tell them your name and your grown-up\u2019s name"]},
      {q:"How do you know who is a police officer?", answers:["Uniform, badge, police car nearby"]}
    ],
    challenge: "Ask a parent: what is the non-emergency police number in our city? Write it down.",
    tuesday:   { low: {title:"Badge craft", activity:"Cut a star from cardstock, write \u2018Helper\u2019 on it, wear it and practice saying your full name and address."}, mid: {title:"Community roles map", activity:"List 5 community helpers and what emergencies each one responds to."}, high: {title:"Ride-along research", activity:"Read about a day in the life of an officer and write a short summary."} },
    wednesday: { low: {title:"Role play", activity:"Act out: you are lost at the park. What do you say to the officer who finds you?"}, mid: {title:"Non-emergency vs 911", activity:"Research when to call 911 vs the non-emergency line. Make a two-column chart."}, high: {title:"Civic discussion", activity:"Discuss: what qualities make a good community police officer? Write 5 traits and explain each."} },
    thursday:  { low: {title:"Thank-you drawing", activity:"Draw or dictate a thank-you card to a local police officer."}, mid: {title:"Safety walk", activity:"Walk around your block and note 3 things that help keep the neighborhood safe."}, high: {title:"Policy research", activity:"Look up one community policing program in your city or state and summarize its goals."} }
  },

  "What does a firefighter do?": {
    gradeHooks: {
      low: "Firefighters put out fires and help people who are hurt. They are our friends, not scary!",
      mid: "Firefighters respond to fires, medical emergencies, and rescue calls. They train constantly to stay ready.",
      high: "Modern firefighting combines emergency medicine, hazmat response, and community fire prevention education."
    },
    materials: ["Red and orange paper", "Scissors"],
    steps: [
      "Ask: what do you think is inside a fire truck?",
      "Explain: firefighters wear heavy gear to protect them from heat and smoke.",
      "List what firefighters do: put out fires, help people in car accidents, give first aid.",
      "Discuss fire prevention: smoke detectors, not playing with matches, knowing exit routes.",
      "Make a paper \u2018flame\u2019 and practice Stop Drop Roll around it."
    ],
    discussion: [
      {q:"Should you hide from a firefighter if there is a fire in your house?", answers:["No! Go toward them. Their gear looks scary but they are there to help you."]},
      {q:"What is one thing you can do to help prevent fires at home?", answers:["Never play with matches, keep candles away from things that burn, tell a grown-up if you smell smoke"]}
    ],
    challenge: "Find your home\u2019s smoke detectors. Count them and tell a parent how many there are.",
    tuesday:   { low: {title:"Gear guessing game", activity:"Look up a picture of firefighter gear together. Name each piece and guess what it protects."}, mid: {title:"Fire triangle", activity:"Learn about the fire triangle (heat, fuel, oxygen). Draw it and explain how removing one element stops fire."}, high: {title:"Incident command", activity:"Research how firefighters organize at a large fire scene. Describe the role of incident command."} },
    wednesday: { low: {title:"Stop Drop Roll review", activity:"Practice Stop Drop Roll 3 times. Time yourself — goal is to drop within 3 seconds."}, mid: {title:"Home fire hazard audit", activity:"Walk through your home and list 5 potential fire hazards. Note which are easy to fix."}, high: {title:"Wildfire research", activity:"Research how wildfires spread differently from structure fires. Write a one-page comparison."} },
    thursday:  { low: {title:"Fire station visit plan", activity:"With a parent, look up your nearest fire station. Plan a visit or draw what you imagine it looks like inside."}, mid: {title:"Escape plan review", activity:"Update your family\u2019s fire escape plan. Make sure everyone knows two ways out of every room."}, high: {title:"Career profile", activity:"Interview (in person or via research) a firefighter or EMT. Write a profile of their career path."} }
  },

  "Good sleep keeps us healthy": {
    gradeHooks: {
      low: "Our bodies grow and our brains rest when we sleep. Going to bed on time helps us feel great!",
      mid: "Sleep affects memory, mood, immune function, and growth. Teens and kids need more sleep than adults.",
      high: "Sleep hygiene, circadian rhythms, and the stages of sleep all affect long-term health and cognitive performance."
    },
    materials: ["Paper", "Pencil"],
    steps: [
      "Ask: how do you feel when you don\u2019t get enough sleep?",
      "Explain: kids need about 10\u201312 hours of sleep. Grown-ups need 7\u20138.",
      "Share what happens during sleep: your brain stores memories, your body makes growth hormones, your immune system recharges.",
      "Talk about a good bedtime routine: same time every night, dim lights, no screens, calm activity like reading.",
      "Create a simple bedtime routine chart together."
    ],
    discussion: [
      {q:"Why do you think screens make it harder to sleep?", answers:["Bright light tricks your brain into thinking it\u2019s daytime", "Exciting content keeps your brain activated"]},
      {q:"What is one thing you could do to help yourself fall asleep faster?", answers:["Quiet reading, soft music, deep breaths, keeping room cool and dark"]}
    ],
    challenge: "Try your bedtime routine tonight and notice how you feel in the morning. Report back!",
    tuesday:   { low: {title:"Draw your dream", activity:"Draw something you dreamed about (or would like to dream about). Talk about how sleep is like a movie for your brain."}, mid: {title:"Sleep tracking", activity:"Track your sleep for 3 nights. Record bedtime, wake time, and how you feel. Look for patterns."}, high: {title:"Circadian rhythm research", activity:"Research circadian rhythms and how light exposure affects them. Summarize in a paragraph."} },
    wednesday: { low: {title:"Sleepy animal facts", activity:"Look up how long different animals sleep. Make a chart: cat, dog, giraffe, koala, human."}, mid: {title:"Sleep stages diagram", activity:"Draw and label the 4 stages of sleep (N1, N2, N3, REM). Note what happens in each."}, high: {title:"Sleep deprivation effects", activity:"Research how sleep deprivation affects reaction time and decision-making. Cite two sources."} },
    thursday:  { low: {title:"Bedtime routine practice", activity:"Set up your room for good sleep: tidy, dim, cool. Practice your routine with a stuffed animal as your \u2018student.\u2019"}, mid: {title:"Bedroom audit", activity:"Audit your bedroom for sleep hygiene: light, temperature, noise, screens. Write 3 improvements."}, high: {title:"Persuasive writing", activity:"Write a persuasive essay: \u2018Why schools should start later for teenagers.\u2019 Use sleep science as evidence."} }
  },

  "What is weather?": {
    gradeHooks: {
      low: "Weather is what the sky and air feel like outside — sunny, rainy, windy, or snowy!",
      mid: "Weather is the short-term state of the atmosphere. It affects what we wear, grow, and how we travel.",
      high: "Weather results from interactions between solar energy, atmospheric pressure, humidity, and terrain."
    },
    materials: ["Window or outdoor access", "Paper and crayons"],
    steps: [
      "Step outside or look out a window. Ask: what does the sky look like right now?",
      "Introduce 5 weather types: sunny, cloudy, rainy, windy, stormy.",
      "Explain how weather affects our day: what we wear, whether we play outside, if we need an umbrella.",
      "Introduce the idea of a weather forecast: meteorologists study clouds and air to predict tomorrow\u2019s weather.",
      "Draw today\u2019s weather and write (or dictate) one sentence about it."
    ],
    discussion: [
      {q:"Why is it important to check the weather before going outside?", answers:["So we can dress right, bring an umbrella, stay safe in storms"]},
      {q:"What weather could be dangerous?", answers:["Thunderstorms, tornadoes, hurricanes, extreme heat, ice"]}
    ],
    challenge: "Check the weather forecast for the next 3 days and draw a weather chart. Were the predictions right?",
    tuesday:   { low: {title:"Cloud shapes", activity:"Go outside and identify clouds. Are they fluffy (cumulus), thin and wispy (cirrus), or flat and gray (stratus)?"}, mid: {title:"Weather map reading", activity:"Find a weather map online. Identify your state\u2019s forecast. What do the symbols mean?"}, high: {title:"Meteorology basics", activity:"Research how barometric pressure relates to weather. Explain how a drop in pressure often signals rain."} },
    wednesday: { low: {title:"Weather dress-up", activity:"For each weather type, draw an outfit: raincoat, sunhat, warm coat, boots. Match the outfit to the weather."}, mid: {title:"Climate vs weather", activity:"Write a paragraph explaining the difference between weather (daily) and climate (long-term patterns)."}, high: {title:"Weather data analysis", activity:"Look up your city\u2019s average monthly temperatures and rainfall. Create a simple graph and identify trends."} },
    thursday:  { low: {title:"Weather journal", activity:"Start a 5-day weather journal. Each morning, draw the sky and write one weather word."}, mid: {title:"Severe weather plan", activity:"Research severe weather most common in your state. Write a family response plan for that weather type."}, high: {title:"El Ni\xf1o vs La Ni\xf1a", activity:"Research how El Ni\xf1o and La Ni\xf1a patterns affect weather across North America. Summarize key effects."} }
  },

  "What is a community garden?": {
    gradeHooks: {
      low: "A community garden is a place where neighbors share a big garden and grow food together!",
      mid: "Community gardens provide fresh food, green space, and social connection in neighborhoods that may lack both.",
      high: "Community gardens address food deserts, build social capital, and can be studied through lenses of urban planning and food justice."
    },
    materials: ["Seeds or dried beans to examine", "A small cup of soil"],
    steps: [
      "Ask: where do you think vegetables come from before the grocery store?",
      "Explain what a community garden is: a shared outdoor space where neighbors grow fruits, vegetables, and flowers.",
      "Discuss who uses community gardens: people who don\u2019t have yards, people who want fresh food, people who want to meet neighbors.",
      "Talk about what plants need: sunlight, water, soil, and care.",
      "Plant a single bean in a cup of soil and place it in a sunny window. You\u2019ve started your own mini garden!"
    ],
    discussion: [
      {q:"Why might someone use a community garden instead of their own yard?", answers:["They live in an apartment", "They want to meet neighbors", "The shared tools and knowledge make it easier"]},
      {q:"What does a plant need to grow?", answers:["Sunlight, water, good soil, and regular care"]}
    ],
    challenge: "Look up if your city or neighborhood has a community garden. If so, what does it grow?",
    tuesday:   { low: {title:"Seed sorting", activity:"Collect different seeds (sunflower, bean, tomato). Sort them by size, shape, and color."}, mid: {title:"Garden planning", activity:"Design a 4x4 foot garden plot on paper. Choose 4 vegetables and research their spacing needs."}, high: {title:"Food desert research", activity:"Look up the term \u2018food desert.\u2019 Explain how community gardens can help and find one local example."} },
    wednesday: { low: {title:"Water your bean", activity:"Check your planted bean. Did anything happen? Draw what you see. Talk about patience in gardening."}, mid: {title:"Companion planting", activity:"Research the Three Sisters (corn, beans, squash). Explain why these plants grow well together."}, high: {title:"Urban agriculture", activity:"Research one urban farming initiative in a major US city. Describe its model and impact."} },
    thursday:  { low: {title:"Grocery store vs garden", activity:"Compare: a tomato from the store vs a garden tomato. What is different? Which might taste better and why?"}, mid: {title:"Volunteer opportunity", activity:"Find a local community garden or food bank garden. What volunteer opportunities do they offer? Write a short pitch to visit."}, high: {title:"Policy and zoning", activity:"Research how local zoning laws affect community gardens. What rules govern them in your city?"} }
  },

  "Packing a healthy snack": {
    gradeHooks: {
      low: "We can pack our own snacks! Healthy snacks give us energy to learn and play.",
      mid: "Nutritious snacks balance carbohydrates, protein, and fat to maintain energy and focus throughout the day.",
      high: "Understanding macronutrients, reading labels, and making cost-effective food choices are practical life skills."
    },
    materials: ["Snack ingredients on hand", "A small bag or container"],
    steps: [
      "Ask: what is your favorite snack? Is it something that gives your body energy or just tastes fun?",
      "Explain the difference between a snack that fills you up vs one that gives a quick sugar rush then leaves you tired.",
      "Introduce 3 good snack building blocks: a fruit or veggie, something crunchy, something with protein (nuts, cheese, etc.).",
      "Together, assemble a snack from what you have at home.",
      "Talk about how to pack a snack for a trip or a co-op day: what container, what stays cold, what can sit in a bag."
    ],
    discussion: [
      {q:"Why do you feel tired after eating a lot of candy?", answers:["Sugar spikes your energy then drops it fast — it\u2019s called a sugar crash"]},
      {q:"What makes a snack \u2018healthy\u2019?", answers:["Real ingredients, some protein, not too much sugar, keeps you full longer"]}
    ],
    challenge: "Plan and pack your own snack for tomorrow\u2019s school morning without any help. Report how it went!",
    tuesday:   { low: {title:"Snack rainbow", activity:"Try to pack a snack with 3 different colors of fruits or vegetables. Name each color and food."}, mid: {title:"Nutrition label reading", activity:"Compare two snack labels. Which has less sugar? More protein? Fewer ingredients you can\u2019t pronounce?"}, high: {title:"Cost per serving", activity:"Calculate the cost per serving of 3 snacks. Which is the most economical healthy option?"} },
    wednesday: { low: {title:"Snack shop role play", activity:"Set up a pretend snack station. \u2018Sell\u2019 healthy options to family members and describe each one."}, mid: {title:"Snack week plan", activity:"Plan 5 different healthy snacks for the week. Use at least 3 food groups across the week."}, high: {title:"Snack budget", activity:"Budget $10 for a week of snacks for one person. Create a shopping list with prices."} },
    thursday:  { low: {title:"Make your own trail mix", activity:"Choose 3\u20134 ingredients (nuts, dried fruit, cereal, seeds). Mix and portion into small bags."}, mid: {title:"Energy snack research", activity:"Research what athletes eat before and after competition. Why do they choose those foods?"}, high: {title:"Homemade vs packaged", activity:"Make a homemade version of a packaged snack (granola bar, trail mix). Compare cost, ingredients, and taste."} }
  },

  "Wearing a helmet and pads": {
    gradeHooks: {
      low: "Helmets protect our brains! We wear them every time we ride a bike, scooter, or skateboard.",
      mid: "Head injuries can have lasting effects. Proper protective gear significantly reduces risk during sports and recreation.",
      high: "Traumatic brain injury (TBI) statistics, concussion science, and the biomechanics of helmet protection are well-documented."
    },
    materials: ["Helmet (if available)", "Knee pads or elbow pads (if available)"],
    steps: [
      "Ask: why do you think race car drivers wear helmets?",
      "Explain: your brain is the most important organ in your body and a helmet is its armor.",
      "Demonstrate how to fit a helmet: two fingers above the eyebrow, straps form a V around ears, chin strap snug.",
      "Discuss when to wear a helmet: biking, scootering, skating, skateboarding, horseback riding.",
      "Practice putting on and adjusting the helmet correctly."
    ],
    discussion: [
      {q:"Is it okay to skip the helmet just for a short ride around the block?", answers:["No — most bike accidents happen close to home. Always wear it."]},
      {q:"What should you do if your helmet gets hit hard in a crash?", answers:["Replace it — a helmet that absorbed impact may look fine but no longer protect properly."]}
    ],
    challenge: "Check the fit of every helmet in your house. Do any need adjusting? Are any too old or cracked?",
    tuesday:   { low: {title:"Egg drop demo", activity:"Wrap an egg in padding and drop it from waist height. Then drop an unwrapped egg. Discuss what the padding did."}, mid: {title:"Gear checklist", activity:"Make a complete protective gear checklist for 3 sports: biking, skateboarding, rollerblading."}, high: {title:"Concussion science", activity:"Research what happens in the brain during a concussion. Summarize the short and long-term effects."} },
    wednesday: { low: {title:"Helmet hero art", activity:"Draw a self-portrait wearing your helmet and gear, doing your favorite outdoor activity."}, mid: {title:"TBI statistics", activity:"Look up TBI statistics for youth sports. Which sports have the highest rates? What gear is recommended?"}, high: {title:"Helmet ratings", activity:"Research CPSC, ASTM, and SNELL helmet certification standards. What do these ratings mean for safety?"} },
    thursday:  { low: {title:"Gear check habit", activity:"Before your next bike ride, go through the full gear check routine: helmet fit, strap snug, pads on. Time how fast you can do it."}, mid: {title:"Peer pressure scenario", activity:"Write a dialogue where someone tries to talk you out of wearing a helmet. Practice your response."}, high: {title:"Advocacy writing", activity:"Write a letter to a school or park district advocating for a helmet rule at a local skate area."} }
  },

  "Buckle up — car seat safety": {
    gradeHooks: {
      low: "We always buckle up in the car! Our car seat keeps us safe if the car stops suddenly.",
      mid: "Seatbelts and car seats dramatically reduce injury in crashes. Correct installation and fit are critical.",
      high: "Vehicle safety statistics, physics of crash forces, and proper car seat installation standards are well-documented topics."
    },
    materials: ["Car seat or seatbelt to examine"],
    steps: [
      "Ask: why do we wear a seatbelt in the car?",
      "Explain in simple terms: if a car stops very fast, everything inside keeps moving — the seatbelt holds you safely.",
      "Walk to the car and show the actual car seat or seatbelt. Let the child buckle and unbuckle themselves.",
      "Explain the rule: ALWAYS buckle before the car moves, every single time, no exceptions.",
      "Discuss what to do if a driver does not buckle: it is okay to speak up and ask them to buckle too."
    ],
    discussion: [
      {q:"What if you\u2019re in a hurry and someone says to skip the seatbelt just this once?", answers:["Say no — it only takes a second and it could save your life"]},
      {q:"At what age/size do you move from a car seat to a booster to a regular seatbelt?", answers:["Weight and height requirements vary — check your state law and car seat manual"]}
    ],
    challenge: "Look up Florida\u2019s car seat law. What are the age and size requirements for each stage?",
    tuesday:   { low: {title:"Buckle practice", activity:"Practice buckling and unbuckling the car seat or seatbelt 5 times smoothly. Can you do it yourself?"}, mid: {title:"Crash physics", activity:"Research: in a 30 mph crash, how much force is exerted on an unbelted passenger? Write the number and what it means."}, high: {title:"Car seat installation", activity:"Research how to properly install a forward-facing car seat. What is the LATCH system? What is the chest clip rule?"} },
    wednesday: { low: {title:"Safety song", activity:"Make up a short rhyme or song about buckling up. Perform it for the family."}, mid: {title:"State law comparison", activity:"Compare car seat laws in 3 states. What are the differences in age and weight requirements?"}, high: {title:"NHTSA research", activity:"Look up the NHTSA (National Highway Traffic Safety Administration) website. What are the current car seat guidelines?"} },
    thursday:  { low: {title:"Teach a stuffed animal", activity:"Use a doll or stuffed animal and a bag or box as a \u2018car.\u2019 Teach the toy how to buckle up safely."}, mid: {title:"Car seat inspection", activity:"Find your nearest certified child passenger safety technician location. What do they check at an inspection?"}, high: {title:"Booster seat transition", activity:"Research when and why children should transition from a booster seat to a seatbelt-only position. What are the risks of transitioning too early?"} }
  },

  "Smoke detector — what is it for?": {
    gradeHooks: {
      low: "Smoke detectors make a loud beeping sound to wake us up and warn us if there is a fire.",
      mid: "Smoke detectors save lives by providing early warning. Placement, testing, and battery maintenance are critical.",
      high: "Ionization vs photoelectric detectors, code requirements, and maintenance schedules are important home safety knowledge."
    },
    materials: ["Smoke detector in your home to examine"],
    steps: [
      "Find a smoke detector in your home and look at it together.",
      "Explain: smoke detectors smell smoke before we can. They give us time to get out safely.",
      "Show the test button. Warn the child it will be loud, then press it together.",
      "Discuss: if you hear that sound — especially at night — get up and get out. Don\u2019t stop to grab toys or devices.",
      "Review your family\u2019s fire escape plan and meeting spot."
    ],
    discussion: [
      {q:"If the smoke detector goes off while you are asleep, what do you do?", answers:["Get up immediately, crawl low if there is smoke, feel the door before opening, get out and go to the meeting spot"]},
      {q:"Why do smoke detectors sometimes go off when someone is cooking?", answers:["Smoke or steam from cooking can trigger the sensor — open a window, don\u2019t disable the detector"]}
    ],
    challenge: "Count how many smoke detectors your home has. Look up how many are recommended per floor. Are you protected?",
    tuesday:   { low: {title:"Detector locations", activity:"Draw a floor plan of your home and mark where each smoke detector is. Are any rooms missing one?"}, mid: {title:"Battery check", activity:"With a parent, check the batteries in every smoke detector. Record when each was last replaced."}, high: {title:"Detector types", activity:"Research ionization vs photoelectric smoke detectors. Which is better for which type of fire? Should you have both?"} },
    wednesday: { low: {title:"What to do drill", activity:"Practice: alarm goes off. Go to your door, pretend to feel it, crawl to your exit, meet at your family\u2019s meeting spot."}, mid: {title:"Code requirements", activity:"Look up building code requirements for smoke detectors in Florida. How many are required and where?"}, high: {title:"Carbon monoxide detectors", activity:"Research carbon monoxide detectors. How are they different from smoke detectors? Where should they be placed?"} },
    thursday:  { low: {title:"Make a reminder sign", activity:"Make a sign that says \u2018Test smoke detectors every month!\u2019 and put it where a parent will see it."}, mid: {title:"Maintenance schedule", activity:"Create a home fire safety maintenance calendar: monthly tests, annual battery replacements, 10-year replacement dates."}, high: {title:"Interconnected systems", activity:"Research smart smoke detectors and interconnected alarm systems. What are the advantages and approximate costs?"} }
  },

  "Knowing your full name": {
    gradeHooks: {
      low: "Your full name is your first name AND your last name. Knowing it helps grown-ups find you if you get lost.",
      mid: "Knowing personal information — full name, address, phone number — is a baseline safety skill for children.",
      high: "Personal identification information, when to share it and with whom, is part of broader digital and physical safety literacy."
    },
    materials: ["Paper and pencil or crayons"],
    steps: [
      "Ask the child: what is your name? Then ask: what is your FULL name?",
      "Explain the difference between a nickname and a full name — and when each is used.",
      "Practice saying the full name clearly three times.",
      "Extend: practice saying first name, last name, and parent\u2019s name.",
      "Write (or trace) the full name on paper."
    ],
    discussion: [
      {q:"Why is it important for a helper (police officer, store worker) to know your full name?", answers:["It helps them find your family", "It helps them call your name on an announcement", "It tells them who you are"]},
      {q:"Who is it okay to tell your full name to?", answers:["Police officers, store workers, teachers, doctors — trusted helpers in uniforms or official roles"]}
    ],
    challenge: "Practice your full name, your home address, and a parent\u2019s phone number until you know all three by heart.",
    tuesday:   { low: {title:"Name art", activity:"Write your full name in big bubble letters and decorate it. Practice spelling it out loud."}, mid: {title:"Personal info checklist", activity:"List 5 pieces of personal information every child should know. Quiz yourself on each one."}, high: {title:"Privacy vs safety", activity:"Write a reflection: when is it safe to share personal information, and when should you protect it? Give examples of each."} },
    wednesday: { low: {title:"Name song", activity:"Make up a rhythm or clap pattern for your full name. Teach it to a family member."}, mid: {title:"Lost child scenario", activity:"Role-play: you are lost at a fair. Practice what you would say to an official helper, including your full name and your parent\u2019s phone number."}, high: {title:"Identity documentation", activity:"Research what documents contain your full legal name (birth certificate, passport, school ID). Why does each document matter?"} },
    thursday:  { low: {title:"Signature practice", activity:"Practice writing your full name as a signature. Try it small, try it big, try it with your eyes closed."}, mid: {title:"Emergency contact card", activity:"Create a personal emergency contact card with your full name, address, and two emergency numbers. Laminate or keep in your backpack."}, high: {title:"Digital footprint", activity:"Research how your full name appears in digital searches. Discuss what information is public and what steps you can take to protect privacy."} }
  },

  "What grown-ups keep us safe": {
    gradeHooks: {
      low: "There are special grown-ups who help keep us safe: parents, teachers, police officers, firefighters, and doctors.",
      mid: "Trusted adults in a child\u2019s life serve different safety roles. Knowing who to turn to in different situations is an important skill.",
      high: "Understanding the systems of support and protection available — family, school, community, and emergency services — builds informed self-advocacy."
    },
    materials: ["Paper and crayons"],
    steps: [
      "Ask: if you were scared or hurt, who would you go to?",
      "Introduce the idea of a \u2018circle of trust\u2019 — the grown-ups who love and protect you.",
      "Name 5 categories of safe grown-ups: family, teachers, doctors, police, firefighters.",
      "Discuss what each one does to keep kids safe.",
      "Draw your circle of trust: put yourself in the middle and draw the people around you."
    ],
    discussion: [
      {q:"If something feels wrong or scary, what should you do?", answers:["Tell a trusted grown-up right away. You will not get in trouble for telling."]},
      {q:"What if the first grown-up you tell doesn\u2019t help? ", answers:["Keep telling until someone helps. You can always tell another adult — a teacher, a neighbor, a relative."]}
    ],
    challenge: "Name 3 safe grown-ups outside your family that you could go to if you needed help.",
    tuesday:   { low: {title:"Helper matching game", activity:"Draw 5 helpers (doctor, teacher, firefighter, police officer, parent). Match each to a situation where they would help."}, mid: {title:"Trusted adult list", activity:"Write a list of 5 trusted adults with their roles. Include at least one outside your immediate family."}, high: {title:"Systems of protection", activity:"Research the different systems designed to protect children: family, school counselors, CPS, law enforcement. Write a brief overview of each."} },
    wednesday: { low: {title:"Role play scenarios", activity:"Act out 3 scenarios: hurt at the park (who do you find?), lost at a store (who do you ask?), someone makes you feel unsafe (who do you tell?)."}, mid: {title:"When to tell", activity:"Make a two-column chart: situations you can handle yourself vs situations where you need a trusted adult."}, high: {title:"Mandated reporters", activity:"Research the concept of mandated reporters. Who are they and what are they required to do when a child is at risk?"} },
    thursday:  { low: {title:"Thank a helper", activity:"Draw or write a thank-you card for a trusted grown-up who makes you feel safe. Deliver it today."}, mid: {title:"Safety plan card", activity:"Create a personal safety plan card listing 3 trusted adults, their phone numbers, and what situation each is best for."}, high: {title:"Child advocacy", activity:"Research a local or national child advocacy organization. What do they do, and how can young people get involved?"} }
  },



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
