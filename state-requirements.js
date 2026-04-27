// ============================================================
//  ROOT & BLOOM — STATE HOMESCHOOL REQUIREMENTS
//  Single source of truth for all 50 states
// ============================================================
//
//  LAST REVIEWED:   2026-04-26
//  NEXT REVIEW DUE: 2026-07-26
//
//  HOW TO DO THE QUARTERLY REVIEW:
//  1. Visit hslda.org/legal for each state that changed
//  2. Cross-check with each state's Department of Education site
//  3. Update any fields that have changed below
//  4. Update LAST REVIEWED and NEXT REVIEW DUE dates above
//  5. Commit to GitHub with message: "Quarterly state law review YYYY-MM-DD"
//
//  REVIEW LOG:
//  2026-04-26 — Fixed AR testing grades (5/7/9 only), CO testing grades (odd 3-11),
//              normalized 43 vague keepFor values to actionable guidance
//  2026-03-29 — Initial extraction from index.html (Nathaly)
//
//  FIELDS PER STATE:
//  tier         — 1=easiest, 4=most regulated
//  notify       — how/when to notify the state
//  hours        — required hours or days per year
//  portfolio    — what records must be kept
//  testing      — standardized testing requirements
//  deadline     — key annual deadline
//  subjects     — required subjects (empty = no mandate)
//  keepFor      — how long to retain records
//  readingLog   — true if state requires reading titles logged by name
//  workSamples  — true if state requires work samples
//  attendance   — true if state requires attendance records
//  quarterly    — true if state requires quarterly reporting (e.g. NY)
//
// ============================================================

const STATE_COMPLIANCE = {
  "Alabama":        {tier:1,notify:"Annual notice",hours:"180 days",portfolio:"Attendance + subjects taught",testing:"Not required",deadline:"Annual",subjects:["Physical Education"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Alaska":         {tier:1,notify:"None required",hours:"None",portfolio:"Not required — recommended",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep permanently",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Arizona":        {tier:1,notify:"Affidavit",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Arkansas":       {tier:2,notify:"Annual notice",hours:"180 days",portfolio:"Notice of intent only",testing:"Standardized test required at grades 5, 7, and 9",deadline:"August 15",subjects:["Reading","Language Arts","Math","Science","Social Studies"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "California":     {tier:2,notify:"Private school affidavit (Oct 1-15)",hours:"175 days",portfolio:"Required under private school option",testing:"Not required",deadline:"Oct 1-15 annually",subjects:["English","Math","Social Sciences","Science","Arts","PE","Health"],keepFor:"5 years recommended",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Colorado":       {tier:2,notify:"Annual NOI",hours:"172 days, 4 hrs/day",portfolio:"Attendance + test results",testing:"Required at grades 3, 5, 7, 9, and 11 (every odd grade)",deadline:"14 days before start",subjects:["Reading","Writing","Math","History","Civics","Literature","Science","PE"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Connecticut":    {tier:1,notify:"Optional NOI",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Spelling","Math","Geography","Science","History","Civics","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Delaware":       {tier:1,notify:"Register as non-public school",hours:"None",portfolio:"Attendance records only",testing:"Not required",deadline:"Annual enrollment report",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Florida":        {tier:2,notify:"One-time Letter of Intent",hours:"None required",portfolio:"Activity log (reading titles by name) + work samples",testing:"Annual evaluation by FL-certified teacher or standardized test",deadline:"LOI anniversary date",subjects:[],keepFor:"2 years",readingLog:true,workSamples:true,attendance:false,quarterly:false},
  "Georgia":        {tier:2,notify:"Annual declaration of intent",hours:"180 days",portfolio:"Monthly attendance records",testing:"Every 3 years grades 3+",deadline:"By Sept 1 annually",subjects:["Reading","Language Arts","Math","Social Studies","Science","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Hawaii":         {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Curriculum and records",testing:"Annual assessment",deadline:"Before school year",subjects:["Language Arts","Math","Science","Social Studies","Health","PE"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Idaho":          {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Illinois":       {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Language Arts","Math","Biological/Physical Science","Fine Arts","Health","PE","Social Sciences"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Indiana":        {tier:1,notify:"Annual NOI",hours:"180 days",portfolio:"Not required (private school status)",testing:"Not required",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Practical Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Iowa":           {tier:2,notify:"Annual competency forms",hours:"148 days",portfolio:"Annual assessment by licensed teacher",testing:"Annual licensed teacher assessment",deadline:"October 1",subjects:["Reading","Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Kansas":         {tier:1,notify:"Register as non-accredited private school",hours:"186 days",portfolio:"Attendance records",testing:"Not required",deadline:"Annual",subjects:["Reading","Writing","Math","Science","History","Government","Geography","PE","Health","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Kentucky":       {tier:2,notify:"Annual NOI",hours:"185 days",portfolio:"Attendance + courses + grades",testing:"Not required",deadline:"Annual",subjects:["Reading","Writing","Math","Science","Social Studies","Arts","PE","Health"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Louisiana":      {tier:2,notify:"Annual Home Study Application by Oct 1",hours:"180 days",portfolio:"Annual reapplication required",testing:"Not required",deadline:"Oct 1 annually",subjects:["Sustained curriculum at grade level"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Maine":          {tier:3,notify:"Annual NOI to superintendent",hours:"175 days",portfolio:"Annual assessment",testing:"Annual assessment or portfolio review",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Maryland":       {tier:4,notify:"Annual NOI",hours:"Must show regular thorough instruction",portfolio:"Weekly work samples per COMAR subject — semi-annual review",testing:"Semi-annual portfolio review (Jan & June)",deadline:"Semi-annual",subjects:["English","Math","Science","Social Studies","Health","Art","Music","PE"],keepFor:"Duration of homeschooling",readingLog:false,workSamples:true,attendance:false,quarterly:false},
  "Massachusetts":  {tier:4,notify:"Prior approval from local school committee",hours:"None specified",portfolio:"Annual review — curriculum, materials, assessments",testing:"Annual review",deadline:"Before starting",subjects:["Reading","Writing","Math","Science","History","Social Studies","Health","PE","Music","Art"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false},
  "Michigan":       {tier:1,notify:"None (unless special needs)",hours:"None",portfolio:"Not required — keep core subject records",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Math","Science","History","Social Studies","Civics","Literature","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Minnesota":      {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual testing results",testing:"Annual test by qualified evaluator",deadline:"October 1",subjects:["Reading","Writing","Literature","Math","Science","History","Social Studies","Geography","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Mississippi":    {tier:1,notify:"Annual certificate of enrollment",hours:"180 days",portfolio:"Enrollment certificate only",testing:"Not required",deadline:"15 days after start",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Missouri":       {tier:2,notify:"None required",hours:"1000 hours/year",portfolio:"Records of hours and subjects",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Montana":        {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Attendance + immunization records",testing:"Not required",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Nebraska":       {tier:2,notify:"Annual Forms A and B",hours:"1032 hrs elem / 1080 hrs secondary",portfolio:"Annual forms",testing:"Not required",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","PE","Health","Music","Visual Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Nevada":         {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Annual assessment",testing:"Annual assessment",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Arts","PE","Health","Civics"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false},
  "New Hampshire":  {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual assessment",testing:"Annual evaluation or portfolio",deadline:"Annual",subjects:["Science","Math","Language Arts","Social Studies","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false},
  "New Jersey":     {tier:1,notify:"None required",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "New Mexico":     {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Records on request",testing:"Not required",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "New York":       {tier:4,notify:"Annual IHIP + quarterly reports",hours:"900 hrs K-6 / 990 hrs 7-12",portfolio:"Quarterly reports + annual assessment",testing:"Every other year grade 4-8, annual grade 9-12",deadline:"Quarterly",subjects:["Patriotism","Citizenship","English","Math","Science","Social Studies","Health","PE","Art","Music","Languages"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:true},
  "North Carolina": {tier:3,notify:"Annual NOI to state",hours:"9 months/year",portfolio:"Attendance + immunization records",testing:"Annual national standardized test",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "North Dakota":   {tier:3,notify:"Annual NOI",hours:"175 days",portfolio:"Annual assessment",testing:"Annual test grades 4-12",deadline:"Before school year",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Ohio":           {tier:3,notify:"Annual NOI",hours:"900 hours",portfolio:"Annual assessment by licensed teacher or portfolio",testing:"Annual assessment or portfolio",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts","Career-Tech"],keepFor:"2 years recommended",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Oklahoma":       {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Oregon":         {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual test or approved program",testing:"Grades 3,5,8,10",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Pennsylvania":   {tier:4,notify:"Annual affidavit + vaccination + subject outline",hours:"180 days / 900 elem / 990 secondary",portfolio:"Log of reading materials by title + work samples beginning middle end of year",testing:"Grades 3,5,8: standardized test required",deadline:"June 30 annually",subjects:["English","Math","Science","Social Studies","History","Geography","Art","Music","PE","Health"],keepFor:"Keep indefinitely recommended",readingLog:true,workSamples:true,attendance:true,quarterly:false},
  "Rhode Island":   {tier:4,notify:"Prior approval required",hours:"180 days",portfolio:"Annual attendance + progress assessment",testing:"Annual district review",deadline:"Before starting",subjects:["English","Math","Science","Social Studies","History","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "South Carolina": {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual review by association or district",testing:"Annual assessment",deadline:"Annual",subjects:["Reading","Writing","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "South Dakota":   {tier:2,notify:"Annual NOI",hours:"175 days",portfolio:"Annual assessment or test",testing:"Annual assessment",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Tennessee":      {tier:2,notify:"Annual application",hours:"180 days",portfolio:"Annual test results",testing:"Grades 5,7,9 standardized test",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Fine Arts","PE","Health"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Texas":          {tier:1,notify:"None required",hours:"None",portfolio:"Not required — private school status",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep permanently",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Utah":           {tier:1,notify:"One-time affidavit",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
  "Vermont":        {tier:4,notify:"Annual enrollment notice + curriculum plan",hours:"175 days",portfolio:"Annual portfolio review by licensed educator",testing:"Annual portfolio review",deadline:"Annual",subjects:["English","Math","History","PE","Health","Citizenship","Sciences","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Virginia":       {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual progress report or portfolio",testing:"Annual test or portfolio",deadline:"August 1",subjects:["Math","Science","English","History","Social Studies","PE","Health","Fine Arts","Foreign Languages"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Washington":     {tier:2,notify:"Annual NOI",hours:"None",portfolio:"Annual assessment",testing:"Annual test or assessment",deadline:"Annual",subjects:["Occupational Education","Language Arts","Math","Science","Social Studies","History","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false},
  "West Virginia":  {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual test or portfolio grades 3,5,8,11",testing:"Grades 3,5,8,11",deadline:"Annual",subjects:["English","Math","Science","Social Studies","History","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false},
  "Wisconsin":      {tier:2,notify:"Annual PI-1206 form",hours:"875 hours",portfolio:"Annual enrollment form",testing:"Not required",deadline:"Annual",subjects:["Reading","Language Arts","Math","Social Studies","Science","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false},
  "Wyoming":        {tier:1,notify:"Annual NOI",hours:"175 days",portfolio:"Not required",testing:"Not required",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false},
};

// ============================================================
//  HELPER: Get top-level state info
//  Returns default fallback if state not found
// ============================================================
function getStateInfo(state) {
  return STATE_COMPLIANCE[state] || {
    tier:2, notify:"Check your state DOE", hours:"Check your state",
    portfolio:"Keep activity log and work samples — varies by state",
    testing:"Check your state", deadline:"Check your state DOE website",
    subjects:[], keepFor:"Recommended: 5 years",
    readingLog:false, workSamples:true, attendance:true, quarterly:false
  };
}

// ============================================================
//  GRADE LEVEL HELPERS
// ============================================================
const GRADES_ELEM = ["Pre-K","K","1st","2nd","3rd","4th","5th"];
const GRADES_MID  = ["6th","7th","8th"];
const GRADES_HIGH = ["9th","10th","11th","12th"];

function gradeLevel(grade) {
  if(GRADES_ELEM.includes(grade)) return "elementary";
  if(GRADES_MID.includes(grade))  return "middle";
  if(GRADES_HIGH.includes(grade)) return "high";
  return "elementary";
}

function gradeNum(grade) {
  const map = {"Pre-K":-1,"K":0,"1st":1,"2nd":2,"3rd":3,"4th":4,"5th":5,"6th":6,"7th":7,"8th":8,"9th":9,"10th":10,"11th":11,"12th":12};
  return map[grade] ?? 5;
}

function nextGrade(grade) {
  const order = ["Pre-K","K","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
  const idx = order.indexOf(grade);
  return idx >= 0 && idx < order.length-1 ? order[idx+1] : null;
}

// ============================================================
//  GRADE-SPECIFIC COMPLIANCE DATA
//  Detailed notes for states with more complex requirements
//  Last reviewed: 2026-03-29
// ============================================================
function getComplianceInfo(state, grade) {
  const level = gradeLevel(grade);
  const gnum  = gradeNum(grade);

  const coreByLevel = {
    elementary: ["Reading/Language Arts","Math","Science","Social Studies","Health","Art","Music","Physical Education"],
    middle:     ["English/Language Arts","Math","Science","Social Studies","Health","PE","Electives"],
    high:       ["English","Math","Science","Social Studies/History","Health","PE","Electives","Foreign Language (recommended)"],
  };

  const needsTest = {
    "Pennsylvania":  [3,5,8].includes(gnum),
    "West Virginia": [3,5,8,11].includes(gnum),
    "Colorado":      gnum>=3 && gnum%2===1,
    "Arkansas":      [5,7,9].includes(gnum),
    "Tennessee":     [5,7,9].includes(gnum),
    "South Dakota":  gnum>=1,
    "New York":      gnum>=4,
    "Virginia":      [3,5,8].includes(gnum),
    "Georgia":       gnum>=3,
    "Ohio":          [3,4,5,6,7,8].includes(gnum),
    "North Carolina":[3,4,5,6,7,8].includes(gnum),
  }[state] || false;

  const stateNotes = {
    "Florida": {
      hours: "No minimum hours — 180 days recommended",
      portfolio: "Contemporaneous activity log (with reading titles listed) + work samples",
      testing: "Not required — annual evaluation by certified teacher due on LOI anniversary",
      gradeNotes: {
        elementary: "Show reading materials by title. Keep samples from beginning, middle, and end of year.",
        middle:     "Same as elementary — activity log + work samples per subject.",
        high:       "Begin formal transcript (grades 9-12). College-bound students need credits documented.",
      },
      deadline: "Anniversary of Letter of Intent to school district",
      keepFor:  "2 years",
    },
    "Pennsylvania": {
      hours: level==="elementary"?"900 hours/year":"990 hours/year",
      portfolio: "Log of reading materials (by title) + work samples from beginning, middle & end of year",
      testing: needsTest?"REQUIRED: Standardized test in Reading/Language Arts & Math (grade "+grade+")":"Not required this grade",
      gradeNotes: {
        elementary: "Include samples showing progress over time. Log must list book titles. Evaluator checks for growth.",
        middle:     "Same requirements + testing at grade 8. Evaluator is a PA-certified teacher or licensed psychologist.",
        high:       "Transcript required. List subjects, credits earned, grades. 990 hours/year. Annual evaluation required.",
      },
      deadline: "Annual evaluation by June 30",
      keepFor:  "Not specified — keep indefinitely recommended",
    },
    "New York": {
      hours: level==="elementary"?"900 hours/year (225/quarter)":"990 hours/year (247.5/quarter)",
      portfolio: "Quarterly reports + annual assessment. Hours must be documented by subject at secondary level.",
      testing: "Required every other year starting grade 4, then annually from grade 9",
      gradeNotes: {
        elementary: "File IHIP annually. Submit quarterly reports listing subjects and hours. Keep attendance records.",
        middle:     "Hours documented per subject. Units begin accumulating in grades 7-8.",
        high:       "Standardized testing required annually. Graduation requires completing 24 cumulative units (9-12).",
      },
      deadline: "Quarterly reports to school district",
      keepFor:  "Not specified",
    },
    "Maryland": {
      hours: "No minimum — must show regular, thorough instruction",
      portfolio: "Work samples per week of semester for each COMAR subject. Semi-annual portfolio review.",
      testing: "Not required",
      gradeNotes: {
        elementary: "Work samples for English, Math, Science, Social Studies. Description only for Art, Music, PE, Health.",
        middle:     "Work samples required for core subjects weekly. Same COMAR subjects apply.",
        high:       "Same requirements. College-bound: maintain transcript with course names and grades.",
      },
      deadline: "Semi-annual reviews (Jan & June)",
      keepFor:  "Duration of homeschooling",
    },
    "Texas": {
      hours: "No requirement — full flexibility",
      portfolio: "No state requirement — highly recommended for personal records",
      testing: "Not required",
      gradeNotes: {
        elementary: "TX is highly flexible. No filing, no reporting. Teach visual arts, music, PE, health at minimum.",
        middle:     "Same freedom as elementary. Keep records for your own reference and school re-entry if needed.",
        high:       "Transcript strongly recommended for college. No state requirement but colleges expect it.",
      },
      deadline: "None",
      keepFor:  "Recommended: keep permanently",
    },
    "California": {
      hours: "No specific minimum — must show instruction",
      portfolio: "Required if filing as private school. Keep attendance, coursework records.",
      testing: "Not required",
      gradeNotes: {
        elementary: "File as private school or use PSA/ISP. Keep records of instruction in required subjects.",
        middle:     "Same as elementary. Required subjects: English, Math, Social Sciences, Science, Arts, PE, Health.",
        high:       "Transcript required for college. Courses must align with UC/CSU A-G requirements if college-bound.",
      },
      deadline: "Annual private school affidavit (Oct 1-15)",
      keepFor:  "Recommended: 5 years",
    },
    "Georgia": {
      hours: "180 days/year",
      portfolio: "Declaration of intent + monthly attendance records + standardized test every 3 years (grades 3+)",
      testing: needsTest?"Standardized test required this year (every 3 years)":"Not required this year",
      gradeNotes: {
        elementary: "Monthly attendance reports. Test every 3 years starting grade 3.",
        middle:     "Same monthly reporting. Test every 3 years. Keep work samples for reference.",
        high:       "Test every 3 years. Transcript needed for college. Keep detailed course records.",
      },
      deadline: "Monthly attendance to school district",
      keepFor:  "Not specified",
    },
    "Ohio": {
      hours: "900 hours/year",
      portfolio: "Annual notification + assessment. Portfolio or standardized test as evaluation option.",
      testing: needsTest?"Assessment required this grade — portfolio or standardized test":"Assessment required annually",
      gradeNotes: {
        elementary: "900 hours/year. Annual assessment by licensed teacher or portfolio review. Keep attendance.",
        middle:     "Same 900 hour requirement. Assessment or portfolio. Required subjects include all core areas.",
        high:       "Must cover specific subjects each year. Keep credits and grades for transcript.",
      },
      deadline: "Annual assessment submitted to school district",
      keepFor:  "2 years recommended",
    },
    "Hawaii": {
      hours: "180 days/year",
      portfolio: "Curriculum plan, attendance records, and work samples demonstrating progress in required subjects.",
      testing: "Annual assessment — standardized test or portfolio review by approved evaluator.",
      gradeNotes: {
        elementary: "File NOI before the school year. Keep attendance and work samples for all required subjects including PE and Health.",
        middle:     "Document progress in Language Arts, Math, Science, Social Studies, Health, and PE with work samples.",
        high:       "Maintain transcript with courses and credits. Annual assessment still required through grade 12.",
      },
      deadline: "NOI filed before school year begins",
      keepFor:  "Recommended: keep for duration of homeschooling",
    },
    "Iowa": {
      hours: "148 days/year",
      portfolio: "Annual assessment by a licensed Iowa teacher. Portfolio of work samples required to support evaluation.",
      testing: "Annual evaluation by Iowa-licensed teacher — portfolio reviewed at assessment.",
      gradeNotes: {
        elementary: "Cover Reading, Language Arts, Math, Science, Social Studies, Health, PE, Fine Arts. Licensed teacher reviews work samples annually by Oct 1.",
        middle:     "Same subject requirements. Work samples per subject help the licensed evaluator verify progress.",
        high:       "Same annual assessment. Keep transcript with courses and grades for college preparation.",
      },
      deadline: "Annual competency assessment by October 1",
      keepFor:  "Recommended: 3 years",
    },
    "Maine": {
      hours: "175 days/year",
      portfolio: "Annual assessment — portfolio review or standardized test. Keep work samples for each required subject.",
      testing: "Annual assessment by superintendent-approved evaluator or standardized test.",
      gradeNotes: {
        elementary: "175 days required. Keep work samples per subject. Annual NOI to superintendent. Evaluator checks portfolio for adequate progress.",
        middle:     "Cover English, Math, Science, Social Studies, Health, PE, Fine Arts, Career Ed. Evaluator reviews portfolio.",
        high:       "Transcript required for college. Annual assessment still applies. Document credits earned per subject.",
      },
      deadline: "Annual NOI to superintendent; assessment annually",
      keepFor:  "Recommended: keep for duration of homeschooling",
    },
    "Massachusetts": {
      hours: "Equivalent to public school — 900 hours elementary / 990 hours secondary",
      portfolio: "Annual review by local school committee. Submit curriculum outline, materials list, and assessments showing progress.",
      testing: "Annual review by local superintendent — portfolio and/or standardized test.",
      gradeNotes: {
        elementary: "Prior approval required before starting. Annual review includes work samples. Cover Reading, Writing, Math, Science, History, Health, PE, Music, Art.",
        middle:     "Same annual review. Portfolio should show growth across all required subjects. Some districts request test results.",
        high:       "Transcript required. Annual review continues. Document courses, credits, and grades carefully.",
      },
      deadline: "Prior approval before starting; annual review thereafter",
      keepFor:  "Duration of homeschooling + recommended 5 years after",
    },
    "Minnesota": {
      hours: "No minimum — regular instruction expected",
      portfolio: "Annual standardized test results submitted to local district. Keep records of subjects taught.",
      testing: "Annual standardized test by qualified neutral evaluator required.",
      gradeNotes: {
        elementary: "File NOI by October 1. Annual test required. Cover Reading, Writing, Literature, Math, Science, History, Social Studies, Geography, Health, PE, Art, Music.",
        middle:     "Same annual test and subject requirements. Test results submitted to district.",
        high:       "Annual test continues through grade 12. Maintain transcript for college preparation.",
      },
      deadline: "NOI by October 1; annual test results submitted to district",
      keepFor:  "Recommended: 3 years",
    },
    "Nevada": {
      hours: "180 days/year",
      portfolio: "Annual assessment. Work samples demonstrating instruction in required subjects.",
      testing: "Annual assessment — standardized test or portfolio review by approved evaluator.",
      gradeNotes: {
        elementary: "180 days required. Keep work samples per subject. Annual assessment by licensed teacher or standardized test.",
        middle:     "Cover English, Math, Science, Social Studies, Arts, PE, Health, Civics with work samples.",
        high:       "Transcript needed for college. Annual assessment still applies. Document courses and credits.",
      },
      deadline: "Annual NOI; annual assessment",
      keepFor:  "Recommended: 3 years",
    },
    "New Hampshire": {
      hours: "No minimum — regular, ongoing instruction expected",
      portfolio: "Annual portfolio review or standardized test. Include work samples per subject.",
      testing: "Annual evaluation — portfolio review by approved evaluator or standardized test.",
      gradeNotes: {
        elementary: "File NOI annually. Annual assessment required. Cover Science, Math, Language Arts, Social Studies, Health, PE, Art, Music.",
        middle:     "Same annual assessment. Portfolio should show progress across required subjects.",
        high:       "Annual assessment continues. Maintain transcript for college. Document courses, credits, grades.",
      },
      deadline: "Annual NOI and annual assessment",
      keepFor:  "Recommended: keep permanently",
    },
    "North Carolina": {
      hours: "9 months of instruction per year",
      portfolio: "Attendance records + immunization records. Annual standardized test required (kept by parent).",
      testing: "Annual national standardized test — results kept by parent, not submitted to state.",
      gradeNotes: {
        elementary: "File NOI with state. 9-month school year. Annual standardized test on file with parent. No mandated subjects.",
        middle:     "Annual test kept by parent. Keep work samples for re-enrollment documentation if needed.",
        high:       "Annual test required through grade 12. Maintain transcript for college. No specific course mandates.",
      },
      deadline: "Annual NOI to state Division of Non-Public Education",
      keepFor:  "Recommended: keep test records permanently",
    },
    "North Dakota": {
      hours: "175 days/year",
      portfolio: "Annual assessment required. Keep attendance records and work samples per subject.",
      testing: "Annual standardized test required grades 4–12; keep results on file.",
      gradeNotes: {
        elementary: "File NOI before school year. 175 days required. Annual test from grade 4. Cover English, Math, Science, Social Studies, Health, PE, Fine Arts, Career Ed.",
        middle:     "Annual test required. Attendance records required. Work samples support portfolio review.",
        high:       "Annual test continues. Maintain transcript for college. Document credits and courses.",
      },
      deadline: "NOI before school year; annual test by end of year",
      keepFor:  "Recommended: 5 years",
    },
    "Oregon": {
      hours: "No minimum — equivalent to public school expected",
      portfolio: "Annual assessment at grades 3, 5, 8, and 10 — standardized test or approved alternative.",
      testing: "Standardized test or approved alternative at grades 3, 5, 8, and 10.",
      gradeNotes: {
        elementary: "File NOI annually. Test required at grade 3. Cover English, Math, Science, Social Studies, Health, PE, Fine Arts, Career Ed.",
        middle:     "Tests at grades 5 and 8. Keep records of subjects and materials used.",
        high:       "Test required at grade 10. Maintain transcript for college preparation.",
      },
      deadline: "Annual NOI; testing at grades 3, 5, 8, 10",
      keepFor:  "Recommended: keep permanently",
    },
    "Rhode Island": {
      hours: "180 days/year",
      portfolio: "Annual attendance records + progress assessment reviewed by local school district.",
      testing: "Annual district review — portfolio and/or standardized test at district discretion.",
      gradeNotes: {
        elementary: "Prior approval required. 180 days. Annual district review. Keep work samples for all required subjects including Art and Music.",
        middle:     "Cover English, Math, Science, Social Studies, History, Health, PE, Art, Music with work samples.",
        high:       "Annual review continues. Transcript required for college. Document courses, credits, and grades.",
      },
      deadline: "Prior approval before starting; annual review by district",
      keepFor:  "Duration of homeschooling",
    },
    "South Carolina": {
      hours: "180 days/year",
      portfolio: "Annual review by approved home school association or local district. Portfolio with work samples per subject.",
      testing: "Annual assessment by approved association or district.",
      gradeNotes: {
        elementary: "Join approved association or use district option. 180 days. Annual review. Cover Reading, Writing, Math, Science, Social Studies, PE, Health, Fine Arts.",
        middle:     "Annual review includes work sample portfolio. Association membership simplifies compliance.",
        high:       "Annual review continues. Transcript required for college. Association can issue diploma.",
      },
      deadline: "Annual NOI; annual review",
      keepFor:  "Recommended: keep permanently",
    },
    "Vermont": {
      hours: "175 days/year",
      portfolio: "Annual portfolio review by licensed Vermont educator. Include curriculum plan, work samples, and progress notes.",
      testing: "Annual portfolio review by licensed Vermont educator — no standardized test required.",
      gradeNotes: {
        elementary: "File enrollment notice and curriculum plan annually. 175 days required. Licensed educator reviews portfolio each year. Cover English, Math, History, PE, Health, Citizenship, Sciences, Fine Arts, Career Ed.",
        middle:     "Same annual portfolio review. Work samples per subject. Licensed educator must certify adequate progress.",
        high:       "Annual review continues. Transcript required for college. Educator verifies credits and coursework.",
      },
      deadline: "Annual enrollment notice + portfolio review by licensed educator",
      keepFor:  "Duration of homeschooling",
    },
    "Virginia": {
      hours: "180 days/year",
      portfolio: "Annual progress report — standardized test or portfolio evaluated by a Virginia-licensed teacher.",
      testing: needsTest?"Standardized test or portfolio review by VA-licensed teacher required this grade":"Portfolio review by VA-licensed teacher or standardized test",
      gradeNotes: {
        elementary: "File NOI by August 1. 180 days. Annual assessment by August 1. Portfolio reviewed by VA-licensed teacher or standardized test. Cover Math, Science, English, History, Social Studies, PE, Health, Fine Arts.",
        middle:     "Same requirements. Annual assessment by August 1. Evaluator reviews portfolio per subject.",
        high:       "Annual assessment continues. Maintain transcript for college. Document courses, credits, and grades.",
      },
      deadline: "NOI by August 1; annual assessment by August 1",
      keepFor:  "Recommended: keep permanently",
    },
    "Washington": {
      hours: "No minimum — instruction equivalent to public school expected",
      portfolio: "Annual assessment — standardized test or evaluation by WA-certified educator.",
      testing: "Annual test or assessment by WA-certified teacher or other approved evaluator.",
      gradeNotes: {
        elementary: "File NOI annually. Annual assessment required. Cover Occupational Education, Language Arts, Math, Science, Social Studies, History, Health, PE, Art, Music.",
        middle:     "Same annual assessment. Portfolio with work samples supports evaluator review.",
        high:       "Annual assessment continues. Transcript required for college. Document courses, credits, and grades.",
      },
      deadline: "Annual NOI; annual assessment",
      keepFor:  "Recommended: 3 years",
    },
    "West Virginia": {
      hours: "180 days/year",
      portfolio: "Annual portfolio or standardized test at grades 3, 5, 8, and 11. Keep attendance and work samples.",
      testing: needsTest?"Standardized test or portfolio required this grade (grades 3, 5, 8, 11)":"Not required this grade — next assessment at next required grade",
      gradeNotes: {
        elementary: "File NOI annually. 180 days. Portfolio or test required at grade 3. Cover English, Math, Science, Social Studies, History, PE, Health, Fine Arts.",
        middle:     "Portfolio or test at grades 5 and 8. Work samples support evaluation. Keep attendance records.",
        high:       "Portfolio or test at grade 11. Maintain transcript for college. Document courses, credits, and grades.",
      },
      deadline: "Annual NOI; assessment at grades 3, 5, 8, 11",
      keepFor:  "Recommended: keep permanently",
    },
    "Arkansas": {
      hours: "180 days/year",
      portfolio: "Annual notice of intent to local school district. Attendance records required. Work samples recommended.",
      testing: needsTest?"Standardized test REQUIRED this year (grades 5, 7, and 9)":"Not required this grade — next test at grade "+(gnum<5?"5":gnum<7?"7":"9"),
      gradeNotes: {
        elementary: "File annual NOI with local superintendent by August 15. 180 school days required. Keep attendance records. Standardized test required at grade 5 — start preparing records in grade 4.",
        middle:     "Annual NOI by August 15. Standardized test required at grades 7 and (if applicable) at grade 5 previously. Keep work samples per subject for your own records.",
        high:       "Annual NOI by August 15. Standardized test required at grade 9. Maintain transcript for college with courses and grades. No state-mandated portfolio review.",
      },
      deadline: "Annual NOI to local school district by August 15",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "Colorado": {
      hours: "172 days, 4 hours/day",
      portfolio: "Annual notice 14 days before starting. Attendance log required. Testing results kept by parent.",
      testing: needsTest?"Standardized test REQUIRED this year (required at grades 3, 5, 7, 9, 11)":"Not required this grade — next test at grade "+(gnum<3?"3":gnum<5?"5":gnum<7?"7":gnum<9?"9":"11"),
      gradeNotes: {
        elementary: "File NOI 14 days before starting. 172 days / 4 hrs per day. Standardized test required at grades 3 and 5. Cover Reading, Writing, Math, History, Civics, Literature, Science, PE. Test results kept by parent — not submitted to state.",
        middle:     "Test required at grades 7 (and 5 previously). Same subject requirements. 172 days. Keep attendance log and work samples for your own records.",
        high:       "Test required at grades 9 and 11. Maintain transcript for college. 172 days. No portfolio review required — results stay with parent.",
      },
      deadline: "NOI 14 days before start of instruction; testing at grades 3, 5, 7, 9, 11",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "Kentucky": {
      hours: "185 days/year",
      portfolio: "Annual enrollment with local school district. Attendance records required. Work samples and portfolio strongly recommended for your own records.",
      testing: "No standardized testing required",
      gradeNotes: {
        elementary: "Notify local district annually. 185 school days required. Keep daily attendance records. Cover Reading, Writing, Math, Science, Social Studies, Arts, PE, Health. No portfolio review required by state but keep work samples in case of re-enrollment.",
        middle:     "Same 185-day requirement and notification. No testing or portfolio review required. Work samples recommended for re-enrollment documentation if needed.",
        high:       "Maintain a transcript with courses, credit hours, and grades for college applications. 185 days. No state assessment required. Keep detailed records — colleges will ask.",
      },
      deadline: "Annual enrollment notification to local school district",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "South Dakota": {
      hours: "175 days/year",
      portfolio: "Annual assessment required. Parent selects an approved evaluator. Work samples support the annual review.",
      testing: needsTest?"Annual assessment required — standardized test or portfolio review by approved evaluator":"Annual assessment required every year",
      gradeNotes: {
        elementary: "File NOI annually. 175 school days. Annual assessment by parent-selected evaluator — either a standardized test or portfolio review. Cover Language Arts, Math, Science, Social Studies, Health, PE, Fine Arts.",
        middle:     "Same annual assessment requirement. Evaluator reviews work samples or administers standardized test. Keep records of subjects and materials used.",
        high:       "Annual assessment continues through grade 12. Maintain transcript for college. Document courses, credits, and grades. Evaluator still required each year.",
      },
      deadline: "Annual NOI; annual assessment",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "Tennessee": {
      hours: "180 days/year",
      portfolio: "Annual application through church-related school or LEA. Attendance records required. Work samples recommended.",
      testing: needsTest?"Standardized test REQUIRED this year (grades 5, 7, and 9)":"Not required this grade — next test at grade "+(gnum<5?"5":gnum<7?"7":"9"),
      gradeNotes: {
        elementary: "Enroll through a church-related school umbrella or LEA option annually. 180 school days. Keep attendance. Standardized test required at grade 5 — begin keeping reading and work sample records in grade 4. Cover Language Arts, Math, Science, Social Studies, Fine Arts, PE, Health.",
        middle:     "Standardized test required at grades 7 (and previously grade 5). Keep work samples per subject. Annual enrollment through umbrella school or LEA. Attendance records required.",
        high:       "Standardized test required at grade 9. Annual enrollment continues. Maintain transcript for college — umbrella school often helps generate official transcripts. Document courses, credits, and grades.",
      },
      deadline: "Annual enrollment; testing at grades 5, 7, 9",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "Wisconsin": {
      hours: "875 hours/year",
      portfolio: "Annual PI-1206 form submitted to state DPI. Attendance records required. No portfolio review or testing required.",
      testing: "No standardized testing required",
      gradeNotes: {
        elementary: "File PI-1206 form annually with Wisconsin DPI. 875 hours/year required. Keep daily attendance. Cover Reading, Language Arts, Math, Social Studies, Science, Health, PE, Art, Music. No portfolio review or state assessment — keep work samples for your own records.",
        middle:     "Same PI-1206 filing and 875-hour requirement. No testing. Work samples recommended for re-enrollment or college purposes. Required subjects include Music and Art.",
        high:       "Annual PI-1206 continues. No state-required testing or evaluation. Maintain transcript for college with courses, credits, and grades. Colleges will rely on your own documentation since WI has no official review.",
      },
      deadline: "Annual PI-1206 form to Wisconsin DPI",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
    "Nebraska": {
      hours: "1,032 hours/year (elementary) or 1,080 hours/year (secondary)",
      portfolio: "Annual Forms A and B submitted. Qualified teacher must provide instruction or supervise. Attendance records required.",
      testing: "No standardized testing required — teacher supervision is the accountability mechanism",
      gradeNotes: {
        elementary: "File Forms A and B annually. Must use a teacher holding a valid Nebraska teaching certificate OR use an approved private/parochial school umbrella. 1,032 hours/year. Cover Language Arts, Math, Science, Social Studies, PE, Health, Music, Visual Arts. Keep attendance records.",
        middle:     "Same Forms A and B. 1,032 hours. Teacher qualification requirement continues. Work samples help demonstrate progress if re-enrollment occurs.",
        high:       "1,080 hours/year required (secondary). Teacher supervision continues. Maintain transcript for college — Nebraska has no official transcript mechanism so your own records are critical.",
      },
      deadline: "Annual Forms A and B to local school district",
      keepFor:  "Recommended: keep records for at least 5 years",
    },
  };

  const info = stateNotes[state] || {
    hours: "Check your state education department for hours requirements",
    portfolio: "Keep attendance log, activity log, and work samples by subject",
    testing: "Check your state for standardized testing requirements",
    gradeNotes: {
      elementary: "Most states require: activity log, work samples per subject, attendance record.",
      middle:     "Same as elementary. Some states add standardized testing at middle school grades.",
      high:       "Add formal transcript (grades 9-12) with courses, credits, and grades for college preparation.",
    },
    deadline: "Check your state education department website",
    keepFor:  "Recommended: keep for 5 years",
  };

  return {
    state,
    grade,
    level,
    gnum,
    hours:     info.hours,
    portfolio: info.portfolio,
    testing:   info.testing,
    gradeNote: info.gradeNotes[level]||info.gradeNotes.elementary,
    deadline:  info.deadline,
    keepFor:   info.keepFor,
    subjects:  coreByLevel[level]||coreByLevel.elementary,
    needsTest,
  };
}
