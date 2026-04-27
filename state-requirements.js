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
  "Alabama":        {tier:1,notify:"Annual notice",hours:"180 days",portfolio:"Attendance + subjects taught",testing:"Not required",deadline:"Annual",subjects:["Physical Education"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.alsde.edu/sec/ace/Pages/home.aspx",evaluatorNote:"Parent or guardian instructs. No evaluator required.",umbrellaRequired:true,umbrellaNote:"Alabama has two main paths: file directly with your local superintendent, OR enroll under a church school or PSA (Private School Association). Most AL families choose the PSA route — it satisfies all notification and evaluation requirements and tends to be simpler for beginners.",dualEnrollment:{law:"Accelerated College Education (ACE) Act",gradeMin:"10th",gpaMin:"2.5 GPA",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Alabama homeschoolers are eligible under the ACE Act. Must apply through the community college. GPA verified by parent-issued transcript.",link:"https://www.accs.edu/students/dual-enrollment/"}},
  "Alaska":         {tier:1,notify:"None required",hours:"None",portfolio:"Not required — recommended",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep permanently",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://education.alaska.gov/",evaluatorNote:"No evaluator required. Full parent control.",dualEnrollment:{law:"Dual Enrollment / Early College",gradeMin:"11th",gpaMin:"Varies by institution",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Alaska homeschoolers may enroll in University of Alaska campuses. Eligibility and funding vary by campus and district.",link:"https://www.alaska.edu/"}},
  "Arizona":        {tier:1,notify:"Affidavit",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.azed.gov/home-education",evaluatorNote:"No evaluator required. File affidavit, teach freely.",dualEnrollment:{law:"ARS 15-1821.01 Dual Enrollment",gradeMin:"9th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Arizona homeschoolers are explicitly eligible. Tuition is typically the family's responsibility unless enrolled through a public charter that participates in dual enrollment funding.",link:"https://www.azed.gov/college-career-readiness/dual-enrollment"}},
  "Arkansas":       {tier:2,notify:"Annual notice",hours:"180 days",portfolio:"Notice of intent only",testing:"Standardized test required at grades 5, 7, and 9",deadline:"August 15",subjects:["Reading","Language Arts","Math","Science","Social Studies"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://dese.ade.arkansas.gov/Divisions/learning-services/private-school-and-home-school/home-school",evaluatorNote:"Standardized test at grades 5, 7, 9. Parent selects approved test.",umbrellaRequired:false,umbrellaNote:"Arkansas families can enroll under a private school umbrella instead of filing a notice of intent directly with the local superintendent. The umbrella handles your annual August 15 notice and maintains enrollment records on your behalf.",dualEnrollment:{law:"Arkansas Concurrent Enrollment Act",gradeMin:"11th",gpaMin:"2.0 GPA",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Homeschoolers are eligible. GPA verified by parent records. Must meet ACT/SAT readiness benchmarks. Tuition covered by the state.",link:"https://dese.ade.arkansas.gov/Divisions/learning-services/curriculum-and-instruction/concurrent-enrollment"}},
  "California":     {tier:2,notify:"Private school affidavit (Oct 1-15)",hours:"175 days",portfolio:"Required under private school option",testing:"Not required",deadline:"Oct 1-15 annually",subjects:["English","Math","Social Sciences","Science","Arts","PE","Health"],keepFor:"5 years recommended",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.cde.ca.gov/sp/ps/",evaluatorNote:"No evaluator. File as private school. Parent is the teacher.",dualEnrollment:{law:"CA Ed Code 48800",gradeMin:"Varies",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"California community colleges accept homeschoolers as concurrent students. Enrollment fees apply (approx $46/unit). Some colleges waive fees for K-12 students. Contact individual colleges — policies vary widely.",link:"https://www.cccco.edu/"}},
  "Colorado":       {tier:2,notify:"Annual NOI",hours:"172 days, 4 hrs/day",portfolio:"Attendance + test results",testing:"Required at grades 3, 5, 7, 9, and 11 (every odd grade)",deadline:"14 days before start",subjects:["Reading","Writing","Math","History","Civics","Literature","Science","PE"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.cde.state.co.us/compulsory-education/homeschooling",evaluatorNote:"Standardized test or licensed CO teacher at grades 3,5,7,9,11. Results stay with parent.",umbrellaRequired:false,umbrellaNote:"Colorado allows enrolling in an approved private school instead of filing as a home educator. Some umbrella programs also handle the required odd-grade standardized testing (grades 3, 5, 7, 9, 11) as part of membership.",dualEnrollment:{law:"Concurrent Enrollment Programs Act (CEPA)",gradeMin:"9th",gpaMin:"Varies by institution",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Colorado homeschoolers are eligible but state funding goes through public schools. Homeschoolers often pay out of pocket. Contact your local community college for homeschool-specific policies.",link:"https://www.cde.state.co.us/postsecondary/concurrentenrollment"}},
  "Connecticut":    {tier:1,notify:"Optional NOI",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Spelling","Math","Geography","Science","History","Civics","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://portal.ct.gov/SDE/Publications/A-Guide-to-Homeschooling-in-Connecticut",evaluatorNote:"Local board approves annually. District may request evaluator review of portfolio.",dualEnrollment:{law:"CT Early College Experience (ECE)",gradeMin:"11th",gpaMin:"3.0 GPA recommended",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Connecticut homeschoolers can apply directly to community colleges. Funding is not guaranteed for homeschoolers — most pay standard tuition.",link:"https://www.ctohe.org/"}},
  "Delaware":       {tier:1,notify:"Register as non-public school",hours:"None",portfolio:"Attendance records only",testing:"Not required",deadline:"Annual enrollment report",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.doe.k12.de.us/domain/95",evaluatorNote:"No evaluator required. File registration and immunization records.",dualEnrollment:{law:"DE Dual Enrollment",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Delaware homeschoolers may apply to Delaware Tech and University of Delaware. Funding availability for homeschoolers varies — contact the institution directly.",link:"https://www.doe.k12.de.us/"}},
  "Florida":        {tier:2,notify:"One-time Letter of Intent",hours:"None required",portfolio:"Activity log (reading titles by name) + work samples",testing:"Annual evaluation by FL-certified teacher or standardized test",deadline:"LOI anniversary date",subjects:[],keepFor:"2 years",readingLog:true,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://www.fldoe.org/schools/nonpublic/home-education/",evaluatorNote:"Annual evaluation by a Florida-certified teacher, licensed psychologist, or standardized test.",umbrellaRequired:false,umbrellaNote:"Florida families can enroll under a Florida umbrella school instead of filing a Letter of Intent directly with their local school district. The umbrella handles your LOI, maintains enrollment records, and some provide the required annual evaluation as part of membership. This is completely optional — filing directly with your district is equally valid.",dualEnrollment:{law:"Florida Statute 1007.271",gradeMin:"Typically 11th",gpaMin:"3.0 unweighted GPA",whoPaysTuition:"state",whoPaysBooks:"state",notes:"Florida is one of the best states for dual enrollment. Tuition AND books are paid by the state. Requires a signed dual enrollment agreement with the local school district and a 3.0 GPA. Credits count toward both HS graduation and an AA degree.",link:"https://www.fldoe.org/schools/nonpublic/home-education/"}},
  "Georgia":        {tier:2,notify:"Annual declaration of intent",hours:"180 days",portfolio:"Monthly attendance records",testing:"Every 3 years grades 3+",deadline:"By Sept 1 annually",subjects:["Reading","Language Arts","Math","Social Studies","Science","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.gadoe.org/External-Affairs-and-Policy/Policy/Pages/Home-Study.aspx",evaluatorNote:"Standardized test every 3 years (grades 3+). Parent selects test.",umbrellaRequired:false,umbrellaNote:"Georgia allows filing under a church school or association umbrella instead of directly with the local school board. The umbrella submits the annual declaration of intent and handles monthly attendance reporting on your behalf. Many GA families find this simpler than the district route.",dualEnrollment:{law:"Move On When Ready (MOWR) Act",gradeMin:"11th",gpaMin:"3.0 GPA",whoPaysTuition:"state",whoPaysBooks:"state",notes:"Georgia homeschoolers are eligible for MOWR. Tuition and books paid by the state. Must meet placement test requirements. Apply through the Georgia Student Finance Commission.",link:"https://www.gafutures.org/hope-state-aid-programs/move-on-when-ready/"}},
  "Hawaii":         {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Curriculum and records",testing:"Annual assessment",deadline:"Before school year",subjects:["Language Arts","Math","Science","Social Studies","Health","PE"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.hawaiipublicschools.org/TeachingAndLearning/StudentLearning/HomeLearning/Pages/home.aspx",evaluatorNote:"Annual assessment by approved evaluator or standardized test. Parent selects evaluator.",umbrellaRequired:false,umbrellaNote:"Hawaii allows enrolling in a charter or distance learning program as an alternative to the standard home school notification. Some umbrella-style programs handle required annual assessments as part of enrollment.",dualEnrollment:{law:"Early College Hawaii",gradeMin:"11th",gpaMin:"Varies by UH campus",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Hawaii homeschoolers can apply to University of Hawaii campuses. Contact individual campuses for homeschool-specific admission policies.",link:"https://www.hawaii.edu/"}},
  "Idaho":          {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.sde.idaho.gov/",evaluatorNote:"No evaluator required. One of the most flexible states.",dualEnrollment:{law:"Idaho Advanced Opportunities",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Idaho homeschoolers may be eligible for Advanced Opportunities funding ($4,125 per student). Eligibility is not always straightforward and may require district coordination — contact ISBE.",link:"https://boardofed.idaho.gov/resources/advanced-opportunities/"}},
  "Illinois":       {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Language Arts","Math","Biological/Physical Science","Fine Arts","Health","PE","Social Sciences"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.isbe.net/Pages/Home-Schooling.aspx",evaluatorNote:"No evaluator required. Operate as private school. No filing needed.",dualEnrollment:{law:"Illinois Dual Credit",gradeMin:"Varies by institution",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Illinois homeschoolers can enroll at community colleges as dual credit students. No state funding mechanism for homeschoolers — tuition is the family's responsibility.",link:"https://www.iccb.org/academic-affairs/dual-credit/"}},
  "Indiana":        {tier:1,notify:"Annual NOI",hours:"180 days",portfolio:"Not required (private school status)",testing:"Not required",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Practical Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.in.gov/doe/students/indiana-private-school-information/",evaluatorNote:"No evaluator required. Register as private school equivalent.",umbrellaRequired:false,umbrellaNote:"Indiana recognizes umbrella or cover schools as private schools. Families can enroll under one to simplify compliance — the umbrella becomes the official school of record and handles all state requirements.",dualEnrollment:{law:"Indiana College Core / Dual Credit",gradeMin:"9th",gpaMin:"Varies by institution",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Indiana homeschoolers can enroll at Ivy Tech or other state colleges. No state subsidy specifically for homeschoolers. Some colleges offer reduced tuition for high school students.",link:"https://www.ivytech.edu/admissions/high-school-students/"}},
  "Iowa":           {tier:2,notify:"Annual competency forms",hours:"148 days",portfolio:"Annual assessment by licensed teacher",testing:"Annual licensed teacher assessment",deadline:"October 1",subjects:["Reading","Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://educateiowa.gov/pk-12/learners-families/home-school-assistance",evaluatorNote:"Annual evaluation by a licensed Iowa teacher by October 1.",umbrellaRequired:false,umbrellaNote:"Iowa families can use an approved Independent Study Program (ISP) instead of hiring a licensed Iowa teacher directly. The ISP employs or supervises a licensed teacher who fulfills the annual October 1 evaluation requirement on your behalf.",dualEnrollment:{law:"Iowa Postsecondary Enrollment Options Act",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Iowa homeschoolers are explicitly eligible. Tuition paid by the state. Contact your local community college and Iowa DE for homeschool-specific enrollment procedures.",link:"https://educateiowa.gov/pk-12/learners-families/postsecondary-enrollment-options"}},
  "Kansas":         {tier:1,notify:"Register as non-accredited private school",hours:"186 days",portfolio:"Attendance records",testing:"Not required",deadline:"Annual",subjects:["Reading","Writing","Math","Science","History","Government","Geography","PE","Health","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.ksde.org/Agency/Division-of-Learning-Services/Early-Childhood-Special-Education-and-Title-Services/Title-Services/Non-Public-Home-School",evaluatorNote:"No evaluator required. Register as non-accredited private school.",dualEnrollment:{law:"Kansas Concurrent Enrollment",gradeMin:"Varies",gpaMin:"Varies by institution",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Kansas homeschoolers can enroll at community colleges directly. No state funding for homeschoolers. Some colleges offer K-12 reduced rates.",link:"https://www.kansasregents.org/"}},
  "Kentucky":       {tier:2,notify:"Annual NOI",hours:"185 days",portfolio:"Attendance + courses + grades",testing:"Not required",deadline:"Annual",subjects:["Reading","Writing","Math","Science","Social Studies","Arts","PE","Health"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://education.ky.gov/districts/enrol/Pages/Homeschooling.aspx",evaluatorNote:"No evaluator required. Notify local district annually.",umbrellaRequired:false,umbrellaNote:"Kentucky families can operate under a private school umbrella. The umbrella handles district notification and maintains records. This is optional — filing directly with your local district is equally straightforward.",dualEnrollment:{law:"Kentucky Dual Credit Scholarship",gradeMin:"10th",gpaMin:"2.5 GPA",whoPaysTuition:"state (scholarship)",whoPaysBooks:"family",notes:"Kentucky offers a Dual Credit Scholarship covering tuition at KCTCS colleges. Homeschoolers are eligible. Apply through KCTCS. GPA verified by parent transcript.",link:"https://kheaa.com/website/kheaa/dualcredit"}},
  "Louisiana":      {tier:2,notify:"Annual Home Study Application by Oct 1",hours:"180 days",portfolio:"Annual reapplication required",testing:"Not required",deadline:"Oct 1 annually",subjects:["Sustained curriculum at grade level"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.louisianabelieves.com/schools/nonpublic-schools",evaluatorNote:"No evaluator required. Register as home study program.",umbrellaRequired:false,umbrellaNote:"Louisiana allows operating as an approved home study program under a recognized church or umbrella school. The umbrella handles registration and simplifies annual compliance requirements.",dualEnrollment:{law:"Jump Start / Dual Enrollment",gradeMin:"11th",gpaMin:"2.5 GPA",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Louisiana homeschoolers can enroll at community colleges and universities. Funding depends on registration through an approved program. Contact LOSFA for scholarship availability.",link:"https://www.osfa.la.gov/"}},
  "Maine":          {tier:3,notify:"Annual NOI to superintendent",hours:"175 days",portfolio:"Annual assessment",testing:"Annual assessment or portfolio review",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.maine.gov/doe/learning/homeschooling",evaluatorNote:"Annual assessment by superintendent-approved evaluator or standardized test.",dualEnrollment:{law:"Maine Dual Enrollment / Early College",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Maine homeschoolers can apply to CMCC and other Maine community colleges. Funding is not guaranteed for homeschoolers — contact institutions directly.",link:"https://www.maine.gov/doe/"}},
  "Maryland":       {tier:4,notify:"Annual NOI",hours:"Must show regular thorough instruction",portfolio:"Weekly work samples per COMAR subject — semi-annual review",testing:"Semi-annual portfolio review (Jan & June)",deadline:"Semi-annual",subjects:["English","Math","Science","Social Studies","Health","Art","Music","PE"],keepFor:"Duration of homeschooling",readingLog:false,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://marylandhomeschool.org/",evaluatorNote:"Semi-annual portfolio review in January and June by local school supervisor.",umbrellaRequired:false,umbrellaNote:"Maryland allows enrolling under an approved program through a church or religious body, which can substitute for the standard county supervisor portfolio review. This is one of three compliance options in MD.",dualEnrollment:{law:"MD Dual Enrollment",gradeMin:"10th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Maryland homeschoolers can enroll at community colleges. No state subsidy for homeschoolers. Some colleges offer reduced tuition. Contact MHEC for more information.",link:"https://mhec.maryland.gov/"}},
  "Massachusetts":  {tier:4,notify:"Prior approval from local school committee",hours:"None specified",portfolio:"Annual review — curriculum, materials, assessments",testing:"Annual review",deadline:"Before starting",subjects:["Reading","Writing","Math","Science","History","Social Studies","Health","PE","Music","Art"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://www.doe.mass.edu/homeschool/",evaluatorNote:"Annual review by local superintendent. Portfolio and curriculum reviewed. Some districts request a test.",dualEnrollment:{law:"MA Dual Enrollment",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Massachusetts homeschoolers can enroll at community colleges. No state funding for homeschoolers. Age 16+ typical. Contact individual colleges.",link:"https://www.mass.edu/"}},
  "Michigan":       {tier:1,notify:"None (unless special needs)",hours:"None",portfolio:"Not required — keep core subject records",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Math","Science","History","Social Studies","Civics","Literature","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.michigan.gov/mde/Services/Home-Schooling",evaluatorNote:"No evaluator required. Operate under nonpublic school statute.",dualEnrollment:{law:"Michigan Postsecondary Enrollment Options Act",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Michigan homeschoolers are explicitly eligible and tuition is state-funded. Must meet college placement requirements. Apply through the college.",link:"https://www.michigan.gov/mde/Services/Home-Schooling"}},
  "Minnesota":      {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual testing results",testing:"Annual test by qualified evaluator",deadline:"October 1",subjects:["Reading","Writing","Literature","Math","Science","History","Social Studies","Geography","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://education.mn.gov/MDE/fam/hsed/home/",evaluatorNote:"Annual standardized test by a qualified neutral evaluator. Results submitted to district.",dualEnrollment:{law:"Minnesota Postsecondary Enrollment Options (PSEO)",gradeMin:"10th",gpaMin:"Varies by institution",whoPaysTuition:"state",whoPaysBooks:"state",notes:"Minnesota is one of the strongest PSEO states. Homeschoolers are explicitly eligible. Tuition AND books paid by the state. Credits apply toward both HS graduation and a college degree. Apply through the college annually.",link:"https://education.mn.gov/MDE/fam/dual/pseo/"}},
  "Mississippi":    {tier:1,notify:"Annual certificate of enrollment",hours:"180 days",portfolio:"Enrollment certificate only",testing:"Not required",deadline:"15 days after start",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.mdek12.org/studentsgrants/homeschool",evaluatorNote:"No evaluator required. File annual certificate of enrollment.",umbrellaRequired:false,umbrellaNote:"Mississippi allows filing under a church or private umbrella school. The umbrella submits the annual certificate of enrollment and maintains records on your behalf.",dualEnrollment:{law:"MS Dual Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Mississippi homeschoolers can apply to community colleges directly. No state funding for homeschoolers. Contact individual colleges for current policies.",link:"https://www.ihl.state.ms.us/"}},
  "Missouri":       {tier:2,notify:"None required",hours:"1000 hours/year",portfolio:"Records of hours and subjects",testing:"Not required",deadline:"None",subjects:["Reading","Writing","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://dese.mo.gov/title-programs/nonpublic-schools/home-school",evaluatorNote:"No evaluator required. Keep records at home.",dualEnrollment:{law:"MO Dual Credit",gradeMin:"Varies",gpaMin:"Varies by institution",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Missouri homeschoolers can enroll at community colleges as dual credit students. No state subsidy. Contact individual colleges for enrollment procedures.",link:"https://dhewd.mo.gov/"}},
  "Montana":        {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Attendance + immunization records",testing:"Not required",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://opi.mt.gov/Families-Students/Family-Student-Support/Home-Schooling",evaluatorNote:"No evaluator required. File annual notice with county superintendent.",dualEnrollment:{law:"MT Dual Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Montana homeschoolers can apply to Montana community colleges and universities. No state funding specifically for homeschoolers. Contact institutions directly.",link:"https://mus.edu/"}},
  "Nebraska":       {tier:2,notify:"Annual Forms A and B",hours:"1032 hrs elem / 1080 hrs secondary",portfolio:"Annual forms",testing:"Not required",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","PE","Health","Music","Visual Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.education.ne.gov/nsp/",evaluatorNote:"Must use a Nebraska-certified teacher OR enroll under an approved umbrella school.",umbrellaRequired:true,umbrellaNote:"Nebraska requires either a certified teacher in your household OR enrollment under an approved umbrella school. An umbrella is the most common path for families without a certified teacher — the umbrella school employs or supervises the required qualified instructor.",dualEnrollment:{law:"Nebraska Comprehensive Learning Opportunities Act",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Nebraska homeschoolers are eligible for state-funded dual enrollment. Must coordinate with your supervising Nebraska-certified teacher for enrollment paperwork.",link:"https://www.education.ne.gov/"}},
  "Nevada":         {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Annual assessment",testing:"Annual assessment",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Arts","PE","Health","Civics"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://doe.nv.gov/Parents_Guardians/homeschool/",evaluatorNote:"Annual assessment by licensed teacher or standardized test. Parent selects evaluator.",dualEnrollment:{law:"Nevada Dual Credit",gradeMin:"11th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Nevada homeschoolers can enroll at Nevada community colleges. No state subsidy for homeschoolers. Contact Nevada System of Higher Education for current policies.",link:"https://nshe.nevada.edu/"}},
  "New Hampshire":  {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual assessment",testing:"Annual evaluation or portfolio",deadline:"Annual",subjects:["Science","Math","Language Arts","Social Studies","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://www.education.nh.gov/who-we-are/division-of-learner-support/bureau-of-credentialing/home-education",evaluatorNote:"Annual assessment by approved evaluator (certified teacher, licensed psychologist, or other approved professional) or standardized test.",dualEnrollment:{law:"NH Running Start",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"New Hampshire homeschoolers can participate in Running Start at NHTI and other community colleges. Funding varies — contact CCSNH for homeschool-specific policies.",link:"https://www.ccsnh.edu/"}},
  "New Jersey":     {tier:1,notify:"None required",hours:"180 days",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.nj.gov/education/genfo/homeschool/",evaluatorNote:"No evaluator required. No state filing required.",dualEnrollment:{law:"NJ College Credit Program",gradeMin:"Varies",gpaMin:"Varies by institution",whoPaysTuition:"family",whoPaysBooks:"family",notes:"New Jersey homeschoolers can enroll at county colleges as non-degree students. No state subsidy. Contact individual county colleges for enrollment procedures.",link:"https://www.nj.gov/highereducation/"}},
  "New Mexico":     {tier:2,notify:"Annual NOI",hours:"180 days",portfolio:"Records on request",testing:"Not required",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://webnew.ped.state.nm.us/bureaus/home-education/",evaluatorNote:"No evaluator required. No testing required.",dualEnrollment:{law:"NM Dual Credit Act",gradeMin:"9th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"New Mexico homeschoolers are eligible for state-funded dual credit. Must meet college placement requirements. Apply through the New Mexico Higher Education Department.",link:"https://hed.nm.gov/resources-for-students/dual-credit"}},
  "New York":       {tier:4,notify:"Annual IHIP + quarterly reports",hours:"900 hrs K-6 / 990 hrs 7-12",portfolio:"Quarterly reports + annual assessment",testing:"Every other year grade 4-8, annual grade 9-12",deadline:"Quarterly",subjects:["Patriotism","Citizenship","English","Math","Science","Social Studies","Health","PE","Art","Music","Languages"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:true,stateUrl:"https://www.nysed.gov/home-instruction",evaluatorNote:"Annual assessment grades 4+ — standardized test OR superintendent-approved evaluation. Results submitted quarterly.",umbrellaRequired:false,umbrellaNote:"New York allows operating under a private school umbrella. However, NY's IHIP (individualized home instruction plan) and quarterly reporting requirements typically still apply — check with your specific umbrella about whether they handle these filings.",dualEnrollment:{law:"NY College Now / CUNY Early College",gradeMin:"10th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"New York homeschoolers can apply to CUNY and SUNY campuses. No state subsidy for homeschoolers. CUNY College Now is free for NYC public school students but homeschoolers typically pay. Contact individual campuses.",link:"https://www.suny.edu/"}},
  "North Carolina": {tier:3,notify:"Annual NOI to state",hours:"9 months/year",portfolio:"Attendance + immunization records",testing:"Annual national standardized test",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.dpi.nc.gov/students-families/home-schooling",evaluatorNote:"Annual standardized test. Results kept by parent — not submitted to the state.",umbrellaRequired:false,umbrellaNote:"North Carolina allows filing under a private church school or non-public school umbrella. The umbrella becomes the school of record and handles your annual notice of intent to the state Division of Non-Public Education.",dualEnrollment:{law:"NC Dual Enrollment",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"North Carolina homeschoolers can enroll at NC community colleges. No state subsidy for homeschoolers. Contact the NC Community College System for current homeschool enrollment policies.",link:"https://www.nccommunitycolleges.edu/"}},
  "North Dakota":   {tier:3,notify:"Annual NOI",hours:"175 days",portfolio:"Annual assessment",testing:"Annual test grades 4-12",deadline:"Before school year",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.nd.gov/dpi/districts-schools-programs/home-school",evaluatorNote:"Annual standardized test grades 4-12. Results kept on file by parent.",dualEnrollment:{law:"ND Postsecondary Enrollment Options",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"North Dakota homeschoolers are eligible for state-funded dual enrollment. Must meet college placement requirements. Contact NDSCS or other ND colleges.",link:"https://www.ndus.edu/"}},
  "Ohio":           {tier:3,notify:"Annual NOI",hours:"900 hours",portfolio:"Annual assessment by licensed teacher or portfolio",testing:"Annual assessment or portfolio",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts","Career-Tech"],keepFor:"2 years recommended",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://education.ohio.gov/Topics/Other-Resources/Homeschooling",evaluatorNote:"Annual assessment by certified Ohio teacher, licensed psychologist, or standardized test.",umbrellaRequired:false,umbrellaNote:"Ohio allows enrolling in certain approved programs that can satisfy annual assessment requirements. Some umbrella-style programs provide the licensed teacher assessment as part of membership.",dualEnrollment:{law:"Ohio College Credit Plus (CCP)",gradeMin:"6th (if academically ready)",gpaMin:"Varies by institution",whoPaysTuition:"state",whoPaysBooks:"state",notes:"Ohio CCP explicitly includes homeschoolers and is one of the best in the country. Tuition AND books state-funded. Students as young as 6th grade can participate if academically ready. Apply by April 1 for fall semester.",link:"https://www.ohiohighered.org/ccp"}},
  "Oklahoma":       {tier:1,notify:"None required",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://sde.ok.gov/home-school",evaluatorNote:"No evaluator required. File annual notice and operate as private school.",dualEnrollment:{law:"Oklahoma Concurrent Enrollment",gradeMin:"11th",gpaMin:"2.0 GPA",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Oklahoma homeschoolers are eligible. Tuition paid by state. Must meet ACT readiness benchmarks. Apply through Oklahoma colleges.",link:"https://www.okhighered.org/"}},
  "Oregon":         {tier:3,notify:"Annual NOI",hours:"None",portfolio:"Annual test or approved program",testing:"Grades 3,5,8,10",deadline:"Annual",subjects:["English","Math","Science","Social Studies","Health","PE","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.oregon.gov/ode/students-and-family/pages/home-school.aspx",evaluatorNote:"Standardized test or approved alternative at grades 3, 5, 8, 10. Results submitted to ESD.",umbrellaRequired:false,umbrellaNote:"Oregon allows enrolling in a private school as an alternative to filing as a home schooler. Note: the standardized testing requirement at grades 3, 5, 8, and 10 still applies and must be submitted to your local ESD regardless of umbrella enrollment.",dualEnrollment:{law:"Oregon Expanded Options",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Oregon homeschoolers are eligible for Expanded Options funding. Tuition covered by the state. Must meet college placement requirements.",link:"https://www.oregon.gov/highereducation/Pages/index.aspx"}},
  "Pennsylvania":   {tier:4,notify:"Annual affidavit + vaccination + subject outline",hours:"180 days / 900 elem / 990 secondary",portfolio:"Log of reading materials by title + work samples beginning middle end of year",testing:"Grades 3,5,8: standardized test required",deadline:"June 30 annually",subjects:["English","Math","Science","Social Studies","History","Geography","Art","Music","PE","Health"],keepFor:"Keep indefinitely recommended",readingLog:true,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.education.pa.gov/K-12/Home%20Education%20and%20Private%20Tutoring/Pages/default.aspx",evaluatorNote:"Annual evaluation by a Pennsylvania-certified teacher OR licensed psychologist. Portfolio reviewed each June.",umbrellaRequired:false,umbrellaNote:"Pennsylvania allows enrolling under an approved portfolio organization or cyber school. Some umbrella programs provide the required Pennsylvania-certified teacher evaluator as part of membership, which is one of the most valuable services for PA families.",dualEnrollment:{law:"PA Dual Enrollment",gradeMin:"10th",gpaMin:"Varies by institution",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Pennsylvania homeschoolers can enroll at community colleges. No state subsidy for homeschoolers. Some colleges offer reduced tuition. Contact PHEAA for scholarship options.",link:"https://www.pheaa.org/"}},
  "Rhode Island":   {tier:4,notify:"Prior approval required",hours:"180 days",portfolio:"Annual attendance + progress assessment",testing:"Annual district review",deadline:"Before starting",subjects:["English","Math","Science","Social Studies","History","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.ride.ri.gov/StudentsFamilies/EducationPrograms/HomeInstruction.aspx",evaluatorNote:"Annual district review — portfolio and/or standardized test at district discretion.",dualEnrollment:{law:"RI Dual Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Rhode Island homeschoolers can apply to CCRI and RIC. No state subsidy for homeschoolers. Age 16+ typical. Contact institutions directly.",link:"https://www.riopc.edu/"}},
  "South Carolina": {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual review by association or district",testing:"Annual assessment",deadline:"Annual",subjects:["Reading","Writing","Math","Science","Social Studies","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://ed.sc.gov/schools/homeschooling/",evaluatorNote:"Annual review by approved home school association or local district.",umbrellaRequired:true,umbrellaNote:"South Carolina has three compliance options: your local school district, SCAIHS (the state home school association), or another approved association. Most SC families use an association — it handles your annual review, provides evaluator access, and offers more family support than the district route.",dualEnrollment:{law:"SC Dual Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"South Carolina homeschoolers can apply to SC technical colleges. Funding depends on your compliance option — SCAIHS members may have access to enrollment support.",link:"https://www.che.sc.gov/"}},
  "South Dakota":   {tier:2,notify:"Annual NOI",hours:"175 days",portfolio:"Annual assessment or test",testing:"Annual assessment",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Health","PE","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://doe.sd.gov/NonPublic/homeschool.aspx",evaluatorNote:"Annual assessment by parent-selected evaluator — standardized test OR portfolio review.",dualEnrollment:{law:"SD Dual Credit",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"South Dakota homeschoolers can enroll at SDSMT, Dakota State, and other SD colleges. No state subsidy for homeschoolers. Contact institutions directly.",link:"https://www.sdbor.edu/"}},
  "Tennessee":      {tier:2,notify:"Annual application",hours:"180 days",portfolio:"Annual test results",testing:"Grades 5,7,9 standardized test",deadline:"Annual",subjects:["Language Arts","Math","Science","Social Studies","Fine Arts","PE","Health"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://www.tn.gov/education/policy-and-programs/health-and-safety/home-school.html",evaluatorNote:"Standardized test at grades 5, 7, 9. Administered by umbrella school or LEA.",umbrellaRequired:true,umbrellaNote:"Tennessee requires enrollment through a church-related umbrella school OR your local LEA (school district). Most TN families choose a church-related umbrella — it handles annual enrollment, maintains attendance records, and administers the required standardized tests at grades 5, 7, and 9.",dualEnrollment:{law:"TN Dual Enrollment Grant",gradeMin:"11th",gpaMin:"3.0 GPA",whoPaysTuition:"state (grant)",whoPaysBooks:"family",notes:"Tennessee offers a Dual Enrollment Grant covering tuition at TN colleges. Homeschoolers are eligible. GPA verified by parent or umbrella school records. Apply through Tennessee Student Assistance Corporation (TSAC).",link:"https://www.tn.gov/collegepays/money-for-college/grants/dual-enrollment-grant.html"}},
  "Texas":          {tier:1,notify:"None required",hours:"None",portfolio:"Not required — private school status",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep permanently",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://tea.texas.gov/texas-schools/private-schools",evaluatorNote:"No evaluator required. No testing required. Texas is the most flexible state.",umbrellaRequired:false,umbrellaNote:"Texas already treats homeschools as private schools, so umbrella enrollment is optional — not required for compliance. Some TX families join an umbrella for transcript credibility, diploma issuance, or group activities rather than legal reasons.",dualEnrollment:{law:"TX Dual Credit (TEC 28.009)",gradeMin:"9th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Texas homeschoolers can enroll at community colleges for dual credit. No state subsidy — tuition is the family's responsibility. Texas colleges widely accept homeschoolers. Contact your local community college for enrollment procedures.",link:"https://thecb.state.tx.us/"}},
  "Utah":           {tier:1,notify:"One-time affidavit",hours:"None",portfolio:"Not required",testing:"Not required",deadline:"None",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://www.schools.utah.gov/curr/home-schooling",evaluatorNote:"No evaluator required. File annual affidavit with local board.",dualEnrollment:{law:"Utah Concurrent Enrollment",gradeMin:"10th",gpaMin:"2.5 GPA",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Utah homeschoolers are eligible for concurrent enrollment at USHE institutions. Tuition paid by the state. Apply through Utah System of Higher Education.",link:"https://ushe.edu/students/concurrent-enrollment/"}},
  "Vermont":        {tier:4,notify:"Annual enrollment notice + curriculum plan",hours:"175 days",portfolio:"Annual portfolio review by licensed educator",testing:"Annual portfolio review",deadline:"Annual",subjects:["English","Math","History","PE","Health","Citizenship","Sciences","Fine Arts","Career Ed"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://education.vermont.gov/vermont-schools/school-types/home-study",evaluatorNote:"Annual portfolio review by a licensed Vermont educator. Educator certifies adequate progress.",dualEnrollment:{law:"VT Dual Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Vermont homeschoolers can apply to Vermont State University and CCV campuses. Some funding may be available through Act 77 flexible pathways — contact the Vermont Agency of Education for current homeschool eligibility.",link:"https://education.vermont.gov/"}},
  "Virginia":       {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual progress report or portfolio",testing:"Annual test or portfolio",deadline:"August 1",subjects:["Math","Science","English","History","Social Studies","PE","Health","Fine Arts","Foreign Languages"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://www.doe.virginia.gov/home/home-instruction",evaluatorNote:"Annual evidence of progress — standardized test OR Virginia-licensed teacher evaluation. Submitted by August 1.",umbrellaRequired:false,umbrellaNote:"Virginia allows enrolling under a religious exemption or an approved correspondence or umbrella program instead of filing a standard NOI. Some umbrella programs handle your annual August 1 assessment submission as part of membership.",dualEnrollment:{law:"VA Dual Enrollment",gradeMin:"10th",gpaMin:"Varies by college",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Virginia homeschoolers can enroll at VCCS community colleges. No state subsidy for homeschoolers. Some colleges offer reduced tuition. Contact SCHEV for scholarship options.",link:"https://www.vccs.edu/"}},
  "Washington":     {tier:2,notify:"Annual NOI",hours:"None",portfolio:"Annual assessment",testing:"Annual test or assessment",deadline:"Annual",subjects:["Occupational Education","Language Arts","Math","Science","Social Studies","History","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:false,quarterly:false,stateUrl:"https://www.k12.wa.us/student-success/pathways-postsecondary/homeschool",evaluatorNote:"Annual assessment by Washington-certified teacher, educational psychologist, or standardized test.",umbrellaRequired:false,umbrellaNote:"Washington allows enrolling in an approved private school instead of filing as a home schooler. Some umbrella programs handle the annual assessment requirement, which otherwise must be completed by a Washington-certified teacher or standardized test.",dualEnrollment:{law:"WA Running Start",gradeMin:"11th",gpaMin:"Varies (COMPASS placement)",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Washington Running Start is available to homeschoolers with state-funded tuition. Must apply to the community college and submit a home-based instruction declaration. One of the best dual enrollment programs for homeschoolers in the country.",link:"https://www.sbctc.edu/colleges-staff/programs-services/running-start/"}},
  "West Virginia":  {tier:3,notify:"Annual NOI",hours:"180 days",portfolio:"Annual test or portfolio grades 3,5,8,11",testing:"Grades 3,5,8,11",deadline:"Annual",subjects:["English","Math","Science","Social Studies","History","PE","Health","Fine Arts"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:true,attendance:true,quarterly:false,stateUrl:"https://wvde.us/home-schooling/",evaluatorNote:"Assessment at grades 3, 5, 8, 11 — standardized test OR portfolio reviewed by WV-certified teacher.",dualEnrollment:{law:"WV Dual Credit",gradeMin:"10th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"West Virginia homeschoolers can enroll at WV community colleges. No state subsidy for homeschoolers. Contact individual colleges for current homeschool enrollment policies.",link:"https://www.wvhepc.edu/"}},
  "Wisconsin":      {tier:2,notify:"Annual PI-1206 form",hours:"875 hours",portfolio:"Annual enrollment form",testing:"Not required",deadline:"Annual",subjects:["Reading","Language Arts","Math","Social Studies","Science","Health","PE","Art","Music"],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:true,quarterly:false,stateUrl:"https://dpi.wi.gov/home-based-private-educational-program",evaluatorNote:"No evaluator required. File PI-1206 form annually. No testing or portfolio review.",dualEnrollment:{law:"WI Youth Options",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"state",whoPaysBooks:"family",notes:"Wisconsin Youth Options allows homeschoolers to take college courses with state funding. Must notify your home district. Apply through Wisconsin Technical College System or UW campuses.",link:"https://dpi.wi.gov/dual-enrollment/youth-options"}},
  "Wyoming":        {tier:1,notify:"Annual NOI",hours:"175 days",portfolio:"Not required",testing:"Not required",deadline:"Annual",subjects:[],keepFor:"Recommended: keep records for at least 5 years",readingLog:false,workSamples:false,attendance:false,quarterly:false,stateUrl:"https://edu.wyoming.gov/",evaluatorNote:"No evaluator required. No testing required. Minimal oversight.",dualEnrollment:{law:"WY Dual/Concurrent Enrollment",gradeMin:"11th",gpaMin:"Varies",whoPaysTuition:"family",whoPaysBooks:"family",notes:"Wyoming homeschoolers can enroll at Wyoming community colleges. No state subsidy for homeschoolers. Contact Wyoming Community College Commission for current policies.",link:"https://www.communitycolleges.wy.edu/"}},
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
    readingLog:false, workSamples:true, attendance:true, quarterly:false,
    stateUrl:"https://hslda.org/legal",
    evaluatorNote:"Check your state DOE for evaluator and assessment requirements.",
    dualEnrollment:{law:"Dual enrollment",gradeMin:"Typically 11th",gpaMin:"Varies",whoPaysTuition:"varies",whoPaysBooks:"family",notes:"Contact your local community college directly for homeschool dual enrollment policies.",link:"https://hslda.org/legal"},
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
