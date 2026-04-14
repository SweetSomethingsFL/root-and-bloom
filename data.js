// ROOT & BLOOM — Supplemental Data
// Loaded as plain <script> before Babel block

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

const CURRICULUM_BRANDS = [
  // --- Faith-Based ---
  {id:"tgatb",    label:"The Good and the Beautiful",  icon:"📖", desc:"Charlotte Mason-inspired, faith-based", url:"https://www.goodandbeautiful.com"},
  {id:"abeka",    label:"Abeka",                       icon:"📚", desc:"Traditional Christian textbooks",       url:"https://www.abeka.com"},
  {id:"mfw",      label:"My Father’s World",      icon:"🌿", desc:"Faith-based unit studies",              url:"https://www.mfwbooks.com"},
  {id:"sonlight", label:"Sonlight",                    icon:"🌎", desc:"Literature-rich, global perspective",   url:"https://www.sonlight.com"},
  {id:"bju",      label:"BJU Press",                   icon:"🎓", desc:"Comprehensive Christian curriculum",    url:"https://www.bjupress.com"},
  {id:"winterpromise", label:"Winter Promise",         icon:"❄️", desc:"Unit studies with a cozy approach",    url:"https://www.winterpromise.com"},
  {id:"notgrass", label:"Notgrass History",            icon:"🏛", desc:"History-centered, faith-based",        url:"https://www.notgrass.com"},
  // --- Classical ---
  {id:"classicalconv", label:"Classical Conversations",icon:"🏛", desc:"Community-based classical education",  url:"https://www.classicalconversations.com"},
  {id:"welltr",   label:"The Well-Trained Mind",       icon:"📜", desc:"Susan Wise Bauer classical approach",  url:"https://www.welltrainedmind.com"},
  {id:"veritas",  label:"Veritas Press",               icon:"📜", desc:"Classical Christian curriculum",       url:"https://www.veritaspress.com"},
  {id:"memoria",  label:"Memoria Press",               icon:"🦉", desc:"Classical education with Latin",       url:"https://www.memoriapress.com"},
  {id:"trivium",  label:"Trivium Pursuit",             icon:"📐", desc:"Classical trivium approach",           url:"https://www.triviumpursuit.com"},
  // --- Charlotte Mason ---
  {id:"ambleside",label:"Ambleside Online",            icon:"🌸", desc:"Free Charlotte Mason curriculum",      url:"https://www.amblesideonline.org"},
  {id:"simplycharlotte", label:"Simply Charlotte Mason",icon:"🌼", desc:"Charlotte Mason resources & guides",  url:"https://simplycharlottemason.com"},
  // --- Math Focused ---
  {id:"saxon",    label:"Saxon Math",                  icon:"➕", desc:"Incremental, mastery-based math",      url:"https://www.hmhco.com/programs/saxon-math"},
  {id:"mathu",    label:"Math-U-See",                  icon:"🔢", desc:"Manipulative-based math program",      url:"https://www.mathusee.com"},
  {id:"rightstart",label:"RightStart Math",            icon:"🧮", desc:"Visual, activity-based math",         url:"https://www.rightstartmath.com"},
  {id:"ctc",      label:"CTC Math",                    icon:"💻", desc:"Online video-based math",              url:"https://www.ctcmath.com"},
  {id:"beast",    label:"Beast Academy",               icon:"🐉", desc:"Advanced math comics for kids",        url:"https://www.beastacademy.com"},
  {id:"aaa",      label:"AAA Math",                    icon:"🔣", desc:"Free online math practice",            url:"https://www.aaamath.com"},
  // --- Language Arts / Reading ---
  {id:"aas",      label:"All About Spelling",          icon:"🔤", desc:"Orton-Gillingham spelling program",    url:"https://www.allaboutlearningpress.com"},
  {id:"aar",      label:"All About Reading",           icon:"📖", desc:"Multisensory reading program",         url:"https://www.allaboutlearningpress.com"},
  {id:"rodd",     label:"Rodd Rumford Reading",        icon:"📗", desc:"Phonics-based reading approach",       url:"https://www.roddrumford.com"},
  {id:"explode",  label:"Explode the Code",            icon:"💥", desc:"Phonics workbook series",              url:"https://www.explodethecode.com"},
  {id:"fll",      label:"First Language Lessons",      icon:"📝", desc:"Grammar and composition for young kids",url:"https://www.welltrainedmind.com"},
  {id:"iewa",     label:"Institute for Excellence in Writing", icon:"✍️", desc:"Writing curriculum",          url:"https://www.iew.com"},
  {id:"writeshop",label:"WriteShop",                   icon:"✏️", desc:"Step-by-step writing program",        url:"https://www.writeshop.com"},
  // --- Science ---
  {id:"apologia", label:"Apologia Science",            icon:"🔬", desc:"Faith-based, award-winning science",  url:"https://www.apologia.com"},
  {id:"noeo",     label:"NOEO Science",                icon:"🧪", desc:"Charlotte Mason science curriculum",   url:"https://www.noeo.com"},
  {id:"campfire", label:"Camp Fire Science",           icon:"🔥", desc:"Outdoor and nature-based science",    url:"https://www.campfiresciencecurriculum.com"},
  // --- History / Social Studies ---
  {id:"moh",      label:"Mystery of History",          icon:"🏺", desc:"Chronological world history",         url:"https://www.mysteryofhistory.com"},
  {id:"sotw",     label:"Story of the World",          icon:"🌍", desc:"Susan Wise Bauer narrative history",  url:"https://www.welltrainedmind.com"},
  {id:"beautiful", label:"Beautiful Feet Books",       icon:"📚", desc:"Literature-based history",            url:"https://www.bfbooks.com"},
  // --- All-In-One / Online ---
  {id:"aop",      label:"Alpha Omega / Monarch",       icon:"🔤", desc:"Worktexts and digital learning",      url:"https://www.aop.com"},
  {id:"acellus",  label:"Acellus / Power Homeschool",  icon:"💻", desc:"Video-based online school",           url:"https://www.powerhomeschool.org"},
  {id:"time4",    label:"Time4Learning",               icon:"⏰", desc:"Online all-in-one curriculum",        url:"https://www.time4learning.com"},
  {id:"calvert",  label:"Calvert Education",           icon:"🎒", desc:"Structured all-in-one program",       url:"https://www.calverteducation.com"},
  {id:"k12",      label:"K12 / Stride",                icon:"🏫", desc:"Online public school option",         url:"https://www.k12.com"},
  {id:"connections", label:"Connections Academy",      icon:"🖥", desc:"Online public charter school",        url:"https://www.connectionsacademy.com"},
  {id:"oak",      label:"Oak Meadow",                  icon:"🌳", desc:"Waldorf-inspired, nature-focused",    url:"https://www.oakmeadow.com"},
  {id:"tsc",      label:"The Scholars Community",      icon:"👩‍🏫", desc:"Tutored online homeschool",          url:"https://thescholarscommunity.com"},
  // --- Separators ---
  {id:"none",     label:"No Boxed Curriculum",         icon:"🆓", desc:"We build our own from scratch",       url:""},
];

const GOAL_NUDGES = {
  faith:       {nudge:"Start with devotion or Bible time today.",              subjs:["Bible / Faith"],                      tab:"schedule",  icon:"✞"},
  reading:     {nudge:"Did you log reading today? Titles count for FL.",       subjs:["Reading","Reading/Language Arts"],    tab:"portfolio", icon:"📖"},
  college:     {nudge:"Keep those records sharp — log today's work.",          subjs:[],                                     tab:"portfolio", icon:"🎓"},
  critical:    {nudge:"Ask one open-ended question at the end of school.",     subjs:[],                                     tab:"schedule",  icon:"🧠"},
  worldview:   {nudge:"Weave worldview into today — history or current events.", subjs:["History"],                         tab:"schedule",  icon:"🌍"},
  life:        {nudge:"Any life skills to practice or log this week?",         subjs:["Life Skills"],                        tab:"portfolio", icon:"🏠"},
  independence:{nudge:"Let them lead something today — even something small.", subjs:[],                                     tab:"schedule",  icon:"🦅"},
  social:      {nudge:"Co-op, community, or group activities this week?",      subjs:["Co-op"],                              tab:"coop",      icon:"🤝"},
  service:     {nudge:"Any service or giving opportunities this week?",        subjs:[],                                     tab:"more",      icon:"🤎"},
  entrepreneur:{nudge:"Talk money, business, or a project idea today.",        subjs:[],                                     tab:"schedule",  icon:"💼"},
  nature:      {nudge:"A nature walk or observation counts as school!",        subjs:["Nature Study"],                       tab:"portfolio", icon:"🌿"},
  sports:      {nudge:"Movement and PE count — log it in portfolio.",          subjs:["PE / Movement"],                      tab:"portfolio", icon:"🏃"},
  travel:      {nudge:"Explore a map, culture, or geography today.",           subjs:["Geography"],                          tab:"schedule",  icon:"🗺"},
  homestead:   {nudge:"Garden, animals, or home project time today?",          subjs:[],                                     tab:"portfolio", icon:"🌻"},
};

/* =======================================
   OBSERVATION JOURNAL MODAL
   Private per-child parent notes.
   Quick capture, timestamped, never
   shown in portfolio or reports.
======================================= */

