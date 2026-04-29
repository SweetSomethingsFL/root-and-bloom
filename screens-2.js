/* ============================================================
   screens-2.js  --  Print functions and self-contained modals
   Extracted from index.html inline Babel script.
   Loaded as external Babel script -- shares same scope.
   Pure ASCII required for safe upload.
   ============================================================ */
function printEvaluatorPacket(family, entries, child, attendanceDays) {
  const schoolName  = family.schoolName||(family.familyName+" Academy")||"Home School";
  const yearStartNum= family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear();
  const yearEndNum  = family.yearEnd?new Date(family.yearEnd).getFullYear():yearStartNum+1;
  const today       = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const state       = family.state||"";
  const grade       = child?child.grade||"":"";
  const childName   = child ? ((child.name||"Student")+" "+(child.lastName||family.familyName||"")).trim() : "Student";

  const si = getStateInfo(state);
  const ci = getComplianceInfo(state, grade);

  const subjEntries = entries.filter(e=>!e.isDay&&e.subj!=="Daily Notes");
  const bySubject   = {};
  subjEntries.forEach(e=>{ if(!bySubject[e.subj]) bySubject[e.subj]=[]; bySubject[e.subj].push(e); });
  const subjectList = Object.keys(bySubject).sort((a,b)=>bySubject[b].length-bySubject[a].length);

  const readingTitles = [...new Set(subjEntries.filter(e=>e.readingTitle).map(e=>e.readingTitle))];

  const quizEntries = subjEntries.filter(e=>e.isQuizResult&&e.quizData&&e.quizData.total>0);
  const quizBySubj  = {};
  quizEntries.forEach(e=>{
    if(!quizBySubj[e.subj]) quizBySubj[e.subj]={total:0,poss:0,count:0};
    quizBySubj[e.subj].total+=e.quizData.score;
    quizBySubj[e.subj].poss+=e.quizData.total;
    quizBySubj[e.subj].count++;
  });

  const letterGrade = (pct)=>pct>=93?"A+":pct>=90?"A":pct>=87?"B+":pct>=83?"B":pct>=80?"B-":pct>=77?"C+":pct>=73?"C":pct>=70?"C-":pct>=60?"D":"F";
  const gradeColor  = (g)=>g.startsWith("A")?"#1a6e40":g.startsWith("B")?"#2563a8":g.startsWith("C")?"#7a5500":g.startsWith("D")?"#8a3a00":"#cc2222";

  const stateReqDays = parseInt((si.hours||"180").match(/\d+/)?.[0]||"180");
  const attPct       = Math.min(100, Math.round((attendanceDays/Math.max(1,stateReqDays))*100));

  // compliance checklist
  const checks = [
    { label:"Activity Log / Subject Notes", met: subjEntries.length>0, note: subjEntries.length+" entries logged" },
    { label:"Reading Log (titles by name)",  met: readingTitles.length>0, note: readingTitles.length+" title"+(readingTitles.length===1?"":"s")+" recorded", required: si.readingLog },
    { label:"Work Samples",                  met: subjectList.some(s=>(bySubject[s]||[]).some(e=>(e.note||"").trim().length>30||(e.photos||[]).length>0)), note: subjectList.length+" subject"+(subjectList.length===1?"":"s")+" with samples", required: si.workSamples },
    { label:"Attendance Records",            met: attendanceDays>0, note: attendanceDays+" day"+(attendanceDays===1?"":"s")+" logged", required: si.attendance },
    { label:"Quiz / Assessment Scores",      met: quizEntries.length>0, note: quizEntries.length>0?quizEntries.length+" quiz"+(quizEntries.length===1?"":"es")+" on record":"None recorded" },
  ];

  const css = [
    "*{box-sizing:border-box;margin:0;padding:0}",
    "body{font-family:Arial,sans-serif;color:#1a1a1a;font-size:10pt;line-height:1.6;background:#fff}",
    "@media print{@page{margin:1.5cm;size:letter}.no-print{display:none!important}body{font-size:9.5pt}}",
    ".page{max-width:760px;margin:0 auto;padding:2rem}",
    "h2{font-size:13pt;font-weight:700;color:#2a4a28;margin:1.4rem 0 0.6rem;border-bottom:1.5px solid #c8dfc8;padding-bottom:0.3rem}",
    "h3{font-size:10.5pt;font-weight:700;color:#333;margin:0.9rem 0 0.3rem}",
    ".chip{display:inline-block;background:#eef6ee;border:1px solid #b8d8b8;border-radius:20px;padding:2px 10px;font-size:8.5pt;margin:2px 3px 2px 0}",
    ".check-row{display:flex;align-items:flex-start;gap:0.5rem;padding:0.35rem 0;border-bottom:1px solid #f0f0f0}",
    ".check-icon{font-size:1rem;min-width:1.2rem;margin-top:1px}",
    ".check-label{font-weight:600;font-size:9.5pt;flex:1}",
    ".check-note{font-size:8.5pt;color:#666;margin-top:1px}",
    ".req-badge{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:1px 6px;border-radius:10px;background:#fff3cd;color:#856404;border:1px solid #ffc107;margin-left:6px;vertical-align:middle}",
    ".subj-block{background:#f8f8f8;border:1px solid #e4e4e4;border-radius:8px;padding:0.7rem 0.9rem;margin-bottom:0.6rem}",
    ".subj-title{font-weight:700;font-size:10pt;color:#2a4a28}",
    ".entry-row{font-size:8.5pt;color:#444;padding:0.25rem 0;border-bottom:1px dotted #ddd}",
    ".entry-row:last-child{border-bottom:none}",
    ".entry-date{color:#888;min-width:70px;display:inline-block}",
    ".grade-box{display:inline-block;border:2px solid;border-radius:6px;padding:3px 9px;font-weight:700;font-size:11pt;min-width:36px;text-align:center}",
    ".banner{background:#2a4a28;padding:20px 28px;display:flex;justify-content:space-between;align-items:center}",
    ".sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-top:0.5rem}",
    ".sig-line{border-bottom:1.5px solid #444;height:36px;margin-bottom:5px}",
    ".sig-label{font-size:7.5pt;color:#666}",
    ".att-bar{background:#e0e0e0;border-radius:6px;height:10px;margin-top:6px}",
    ".att-fill{background:#2a6a2a;border-radius:6px;height:10px}",
    ".reading-list{columns:2;column-gap:1.5rem;list-style:disc;padding-left:1.2rem}",
    ".reading-list li{font-size:9pt;padding:1px 0;break-inside:avoid}",
    ".photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:0.5rem}",
    ".photo-grid img{width:100%;border-radius:6px;object-fit:cover;aspect-ratio:4/3}",
    ".info-table td{padding:3px 10px 3px 0;font-size:9.5pt;vertical-align:top}",
    ".info-table td:first-child{font-weight:700;color:#555;white-space:nowrap;min-width:130px}",
    ".compliance-box{background:#f5f9f5;border:1px solid #b8d8b8;border-radius:8px;padding:0.8rem 1rem;margin-bottom:0.5rem}",
    ".grade-row{display:flex;align-items:center;gap:0.6rem;padding:0.3rem 0;border-bottom:1px solid #f0f0f0}",
    ".grade-row:last-child{border-bottom:none}",
    ".grade-subj{flex:1;font-size:9.5pt;font-weight:600}",
    ".grade-detail{font-size:8.5pt;color:#666}",
  ].join("\n");

  // ---- Banner ----
  let html = "<!DOCTYPE html><html><head><meta charset='utf-8'>"
    +"<title>Evaluator Packet &mdash; "+childName+" "+yearStartNum+"&ndash;"+yearEndNum+"</title>"
    +"<style>"+css+"</style></head><body>"
    +"<div class='banner'>"
    +"<div>"
    +"<div style='font-size:7.5pt;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.6);margin-bottom:3px'>Homeschool Evaluator Packet</div>"
    +"<div style='font-size:18pt;font-weight:900;color:#fff'>"+childName+"</div>"
    +"<div style='font-size:9pt;color:rgba(255,255,255,0.75);margin-top:2px'>"+schoolName+" &nbsp;&bull;&nbsp; Grade "+grade+" &nbsp;&bull;&nbsp; "+state+"</div>"
    +"</div>"
    +"<div style='text-align:right'>"
    +"<div style='font-size:9pt;color:rgba(255,255,255,0.7)'>School Year</div>"
    +"<div style='font-size:14pt;font-weight:700;color:#fff'>"+yearStartNum+"&ndash;"+yearEndNum+"</div>"
    +"<div style='font-size:8pt;color:rgba(255,255,255,0.55);margin-top:3px'>Prepared "+today+"</div>"
    +"</div>"
    +"</div>"
    +"<div class='page'>";

  // ---- State Requirements Summary ----
  html += "<h2>"+state+" Homeschool Requirements</h2>"
    +"<div class='compliance-box'>"
    +"<table class='info-table'><tbody>"
    +"<tr><td>Notification</td><td>"+si.notify+"</td></tr>"
    +"<tr><td>Required Hours/Days</td><td>"+si.hours+"</td></tr>"
    +"<tr><td>Portfolio Required</td><td>"+si.portfolio+"</td></tr>"
    +"<tr><td>Annual Evaluation</td><td>"+si.testing+"</td></tr>"
    +"<tr><td>Key Deadline</td><td>"+(si.deadline||"See state DOE")+"</td></tr>"
    +"<tr><td>Records Retention</td><td>"+(si.keepFor||"Recommended: 5 years")+"</td></tr>"
    +"</tbody></table>"
    +(ci.gradeNote?"<div style='margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid #c8dfc8;font-size:9pt;color:#444'><b>Grade-level note:</b> "+ci.gradeNote+"</div>":"")
    +"</div>";

  // ---- Compliance Checklist ----
  html += "<h2>Documentation Checklist</h2>";
  checks.forEach(ck=>{
    const icon = ck.met ? "&#x2705;" : (ck.required ? "&#x26A0;&#xFE0F;" : "&#x26AA;");
    html += "<div class='check-row'>"
      +"<span class='check-icon'>"+icon+"</span>"
      +"<div style='flex:1'>"
      +"<div class='check-label'>"+ck.label+(ck.required?"<span class='req-badge'>Required by "+state+"</span>":"")+"</div>"
      +"<div class='check-note'>"+ck.note+"</div>"
      +"</div>"
      +"</div>";
  });

  // ---- Attendance ----
  html += "<h2>Attendance</h2>"
    +"<div style='font-size:9.5pt;margin-bottom:4px'><b>"+attendanceDays+" days</b> logged &nbsp;/&nbsp; "+si.hours+" required"
    +(stateReqDays>0?" &nbsp;("+attPct+"% of goal)":"")+"</div>"
    +"<div class='att-bar'><div class='att-fill' style='width:"+attPct+"%'></div></div>";

  // ---- Reading Log ----
  html += "<h2>Reading Log</h2>";
  if(readingTitles.length>0){
    html += "<ul class='reading-list'>"+readingTitles.map(t=>"<li>"+t+"</li>").join("")+"</ul>";
  } else {
    html += "<p style='font-size:9pt;color:#888;font-style:italic'>No reading titles recorded this year.</p>";
  }

  // ---- Quiz Grades ----
  if(quizEntries.length>0){
    html += "<h2>Quiz &amp; Assessment Grades</h2>";
    Object.entries(quizBySubj).sort((a,b)=>(b[1].poss?b[1].total/b[1].poss:0)-(a[1].poss?a[1].total/a[1].poss:0)).forEach(([subj,d])=>{
      const pct2   = d.poss>0?Math.round((d.total/d.poss)*100):0;
      const letter = letterGrade(pct2);
      const col    = gradeColor(letter);
      html += "<div class='grade-row'>"
        +"<span class='grade-box' style='color:"+col+";border-color:"+col+"30'>"+letter+"</span>"
        +"<span class='grade-subj'>"+subj+"</span>"
        +"<span class='grade-detail'>"+d.count+" quiz"+(d.count===1?"":"zes")+" &nbsp;&bull;&nbsp; "+d.total+"/"+d.poss+" pts &nbsp;&bull;&nbsp; "+pct2+"%</span>"
        +"</div>";
    });
  }

  // ---- Work Samples by Subject ----
  html += "<h2>Work Samples by Subject</h2>";
  if(subjectList.length===0){
    html += "<p style='font-size:9pt;color:#888;font-style:italic'>No subject entries recorded.</p>";
  } else {
    subjectList.forEach(subj=>{
      const es   = bySubject[subj]||[];
      const photos = es.flatMap(e=>e.photos||[]).slice(0,6);
      const notes  = es.filter(e=>(e.note||"").trim().length>10).slice(0,8);
      html += "<div class='subj-block'>"
        +"<div class='subj-title'>"+subj+" <span style='font-weight:400;font-size:8.5pt;color:#666'>("+es.length+" entr"+(es.length===1?"y":"ies")+")</span></div>";
      if(notes.length>0){
        html += "<div style='margin-top:0.4rem'>";
        notes.forEach(e=>{
          html += "<div class='entry-row'>"
            +"<span class='entry-date'>"+(e.date||"")+"</span> "
            +(e.note||"").slice(0,200)+(((e.note||"").length>200)?"&hellip;":"")
            +"</div>";
        });
        html += "</div>";
      }
      if(photos.length>0){
        html += "<div class='photo-grid'>"+photos.map(p=>"<img src='"+p+"' alt='work sample'>").join("")+"</div>";
      }
      html += "</div>";
    });
  }

  // ---- Evaluator Signature Block ----
  html += "<h2 style='margin-top:2rem'>Annual Evaluation</h2>"
    +"<div style='background:#f5f9f5;border:1px solid #b8d8b8;border-radius:8px;padding:1rem 1.2rem;margin-bottom:1rem;font-size:9.5pt;line-height:1.9'>"
    +"<table class='info-table'><tbody>"
    +"<tr><td>Student</td><td><b>"+childName+"</b></td></tr>"
    +"<tr><td>Grade</td><td>"+grade+"</td></tr>"
    +"<tr><td>School</td><td>"+schoolName+"</td></tr>"
    +"<tr><td>School Year</td><td>"+yearStartNum+"&ndash;"+yearEndNum+"</td></tr>"
    +"<tr><td>Date of Evaluation</td><td>___________________________</td></tr>"
    +"</tbody></table>"
    +"</div>"
    +"<p style='font-size:9pt;line-height:1.8;margin-bottom:1rem'>I, the undersigned, have reviewed the educational portfolio "
    +"of the above-named student and have determined that the student has demonstrated educational progress "
    +"commensurate with his/her ability during the "+yearStartNum+"&ndash;"+yearEndNum+" school year.</p>"
    +"<div class='sig-grid'>"
    +"<div><div class='sig-line'></div><div class='sig-label'>Evaluator Full Name (print clearly)</div></div>"
    +"<div><div class='sig-line'></div><div class='sig-label'>Evaluator Signature</div></div>"
    +"<div><div class='sig-line'></div><div class='sig-label'>Certification / License Number</div></div>"
    +"<div><div class='sig-line'></div><div class='sig-label'>Date</div></div>"
    +"<div style='grid-column:1/-1'><div class='sig-line'></div><div class='sig-label'>Evaluator Email / Phone (optional)</div></div>"
    +"</div>";

  html += "</div></body></html>";

  const filename = childName.replace(/\s+/g,"_")+"_Evaluator_Packet_"+yearStartNum+"-"+yearEndNum+".html";
  downloadPortfolioHTML(html, filename);
}

function printFullPortfolio(family, entries, child, attendanceDays, stateInfoUnused, aiSummary) {
  const schoolName  = family.schoolName||(family.familyName+" Academy")||"Home School";
  const yearStartNum= family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear();
  const yearEndNum  = family.yearEnd?new Date(family.yearEnd).getFullYear():yearStartNum+1;
  const today       = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const childName   = child ? (child.name+(child.lastName?" "+child.lastName:"")) : "Student";
  const grade       = child?.grade||"";
  const avatar      = child?.avatar||"";
  const state       = family.state||"";
  const si          = getStateInfo(state);
  const ci          = getComplianceInfo(state, grade);
  const stateReqDays= parseInt((si.hours||"180").match(/\d+/)?.[0]||"180");
  const pct         = Math.min(100,Math.round(attendanceDays/stateReqDays*100));
  const subjEntries = entries.filter(e=>!e.isDay&&e.subj!=="Daily Notes")
    .sort((a,b)=>{try{return new Date(a.date+", "+yearStartNum)-new Date(b.date+", "+yearStartNum);}catch{return 0;}});
  const bySubject = {};
  subjEntries.forEach(e=>{ if(!bySubject[e.subj]) bySubject[e.subj]=[]; bySubject[e.subj].push(e); });
  const subjectList   = Object.keys(bySubject).sort((a,b)=>bySubject[b].length-bySubject[a].length);
  const readingTitles = [...new Set(subjEntries.filter(e=>e.readingTitle).map(e=>e.readingTitle))];
  const allPhotos     = subjEntries.flatMap(e=>e.photos||[]).slice(0,9);
  const css = "*{box-sizing:border-box;margin:0;padding:0}"
    +"body{font-family:Arial,sans-serif;color:#1a1a1a;font-size:10pt;line-height:1.5;background:#fff}"
    +"@media print{@page{margin:1cm;size:letter}}"
    +".banner{background:#2a4a28;padding:22px 28px;display:flex;justify-content:space-between;align-items:center}"
    +".b-student{font-size:20pt;font-weight:700;color:#fff;margin-top:2px}"
    +".b-meta{font-size:9pt;color:rgba(255,255,255,0.65);margin-top:3px}"
    +".b-chip{background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 16px;text-align:center}"
    +".b-chip-v{font-size:20pt;font-weight:700;color:#fff}"
    +".body{padding:20px 28px;background:#faf8f4}"
    +".stat-row{display:flex;gap:10px;margin-bottom:18px}"
    +".stat{text-align:center;flex:1;background:#fff;border-radius:8px;border:1px solid #e2ddd8;padding:10px 8px}"
    +".stat-n{font-size:18pt;font-weight:700;color:#2a4a28}"
    +".stat-l{font-size:7.5pt;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px}"
    +".ai-box{background:#fff;border-radius:10px;border:1.5px solid #c8dfc8;padding:14px 18px;margin-bottom:16px}"
    +".subj-section{background:#fff;border-radius:10px;border:1px solid #e2ddd8;padding:12px 16px;margin-bottom:10px}"
    +".subj-tag{background:#e8f0e8;color:#2a4a28;font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:4px;padding:3px 8px}"
    +".entry-row{display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #f8f5f1;align-items:flex-start}"
    +".entry-row:last-child{border-bottom:none}"
    +".entry-date{font-size:8pt;color:#888;min-width:46px;flex-shrink:0}"
    +".entry-note{font-size:9pt;color:#333;line-height:1.55;flex:1}"
    +".photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}"
    +".photo-box{aspect-ratio:4/3;border-radius:8px;overflow:hidden;border:1px solid #e0dbd4;background:#ede9e1}"
    +".photo-box img{width:100%;height:100%;object-fit:cover}"
    +".footer{padding:10px 28px 16px;display:flex;justify-content:space-between;font-size:7.5pt;color:#aaa;border-top:1px solid #e8e3db}"
    ;
  let html = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>"+childName+" — Full Portfolio "+yearStartNum+"\u2013"+yearEndNum+"</title>"
    +"<style>"+css+"</style></head><body>"
    +"<div class='banner'><div>"
    +"<div style='font-size:7.5pt;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px'>"+schoolName+" &bull; Annual Portfolio</div>"
    +"<div class='b-student'>"+avatar+" "+childName+"</div>"
    +"<div class='b-meta'>"+grade+" &bull; "+state+" &bull; "+yearStartNum+"&ndash;"+yearEndNum+"</div>"
    +"</div><div class='b-chip'><div style='font-size:7pt;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.1em'>Days</div><div class='b-chip-v'>"+attendanceDays+"</div></div></div>"
    +"<div class='body'>"
    +"<div class='stat-row'>"
    +"<div class='stat'><div class='stat-n'>"+attendanceDays+"</div><div class='stat-l'>Days</div></div>"
    +"<div class='stat'><div class='stat-n'>"+subjEntries.length+"</div><div class='stat-l'>Entries</div></div>"
    +"<div class='stat'><div class='stat-n'>"+subjectList.length+"</div><div class='stat-l'>Subjects</div></div>"
    +"<div class='stat'><div class='stat-n'>"+readingTitles.length+"</div><div class='stat-l'>Books</div></div>"
    +"</div>";
  if(aiSummary){
    html += "<div class='ai-box'>"
      +"<div style='font-size:10pt;color:#1a1a1a;line-height:1.7;font-style:italic;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e8e3db'>"+aiSummary.narrative+"</div>"
      +"<div style='display:grid;grid-template-columns:1fr 1fr;gap:14px'>"
      +"<div><div style='font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#2a4a28;margin-bottom:6px'>Biggest Wins</div>"
      +(aiSummary.accomplishments||[]).map(a=>"<div style='display:flex;gap:6px;font-size:9pt;color:#333;margin-bottom:5px'><span style='color:#2a4a28;font-weight:700'>&#10003;</span><span>"+a+"</span></div>").join("")+"</div>"
      +"<div><div style='font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#b07800;margin-bottom:6px'>Keep Building</div>"
      +(aiSummary.growthAreas||[]).map(a=>"<div style='display:flex;gap:6px;font-size:9pt;color:#333;margin-bottom:5px'><span style='color:#b07800;font-weight:700'>&rarr;</span><span>"+a+"</span></div>").join("")+"</div>"
      +"</div></div>";
  }
  subjectList.forEach(subj=>{
    html += "<div class='subj-section'><div style='display:flex;align-items:center;gap:10px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0ece6'><div class='subj-tag'>"+subj+"</div><div style='font-size:8pt;color:#888;margin-left:auto'>"+bySubject[subj].length+" entries</div></div>";
    bySubject[subj].slice().reverse().slice(0,12).forEach(e=>{
      const note=(e.note||"").replace("AI Summary: ","").trim();
      html += "<div class='entry-row'><div class='entry-date'>"+e.date+"</div><div class='entry-note'>"+note+(e.readingTitle?"<div style='font-size:8pt;color:#2a4a28;font-style:italic;margin-top:2px'>&#128214; "+e.readingTitle+"</div>":"")+"</div></div>";
    });
    html += "</div>";
  });
  if(readingTitles.length>0){
    html += "<div style='margin-bottom:10px'><div style='font-size:7.5pt;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px'>"+state+" Reading Log</div><div style='background:#fff;border:1px solid #e2ddd8;border-radius:8px;padding:10px 16px'>";
    readingTitles.forEach((t,i)=>{ html += "<div style='display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f5f5f5'><div style='font-size:8pt;color:#888;min-width:24px'>"+(i+1)+".</div><div style='font-size:9.5pt;color:#1a1a1a;font-style:italic'>"+t+"</div></div>"; });
    html += "</div></div>";
  }
  if(allPhotos.length>0){
    html += "<div style='margin-bottom:16px'><div style='font-size:7.5pt;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px'>Work Samples</div><div class='photo-grid'>";
    allPhotos.forEach(src=>{ html += "<div class='photo-box'><img src='"+src+"' alt=''/></div>"; });
    html += "</div></div>";
  }
  // Quiz scores & grades section
  const quizEntries2 = subjEntries.filter(e=>e.isQuizResult&&e.quizData);
  if(quizEntries2.length>0){
    const quizBySubj={};
    quizEntries2.forEach(e=>{
      if(!quizBySubj[e.subj])quizBySubj[e.subj]={total:0,poss:0,count:0};
      quizBySubj[e.subj].total+=e.quizData.score;
      quizBySubj[e.subj].poss+=e.quizData.total;
      quizBySubj[e.subj].count++;
    });
    const letterGrade=(pct)=>pct>=93?"A+":pct>=90?"A":pct>=87?"B+":pct>=83?"B":pct>=80?"B-":pct>=77?"C+":pct>=73?"C":pct>=70?"C-":pct>=60?"D":"F";
    const gradeColor=(g)=>g.startsWith("A")?"#1a6e40":g.startsWith("B")?"#2563a8":g.startsWith("C")?"#7a5500":g.startsWith("D")?"#8a3a00":"#cc2222";
    html += "<div style='margin-bottom:16px'>"
      +"<div style='font-size:7.5pt;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px'>Quiz Scores &amp; Grades</div>"
      +"<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:8px'>";
    Object.entries(quizBySubj).sort((a,b)=>(b[1].poss?b[1].total/b[1].poss:0)-(a[1].poss?a[1].total/a[1].poss:0)).forEach(([subj,d])=>{
      const pct2=d.poss>0?Math.round((d.total/d.poss)*100):0;
      const letter=letterGrade(pct2);
      const col=gradeColor(letter);
      html += "<div style='background:#fff;border:1.5px solid "+col+"30;border-radius:8px;padding:8px 10px;text-align:center'>"
        +"<div style='font-size:16pt;font-weight:900;color:"+col+"'>"+letter+"</div>"
        +"<div style='font-size:7.5pt;font-weight:700;color:#333;margin:2px 0'>"+subj+"</div>"
        +"<div style='font-size:7pt;color:#999'>"+pct2+"% &bull; "+d.count+" quiz"+(d.count===1?"":"zes")+"</div>"
        +"</div>";
    });
    html += "</div></div>";
  }

  html += "<div style='display:flex;gap:24px;margin:20px 0 16px;padding-top:16px;border-top:1.5px solid #ccc'>"
    +"<div style='flex:1'><div style='border-bottom:1.5px solid #999;height:30px;margin-bottom:4px'></div><div style='font-size:7.5pt;color:#888'>Parent Signature</div></div>"
    +"<div style='flex:1'><div style='border-bottom:1.5px solid #999;height:30px;margin-bottom:4px'></div><div style='font-size:7.5pt;color:#888'>Date</div></div>"
    +"</div>"
    +"<div class='footer'><span>"+schoolName+" &bull; "+childName+"</span><span>Generated: "+today+"</span></div>"
    +"<script>window.onload=function(){setTimeout(function(){window.print();},600);};<\/script>"
    +"</body></html>";
  const w=window.open("","_blank","width=820,height=980,scrollbars=yes");
  if(w){w.document.write(html);w.document.close();}
  return html;
}


/* ---- Print Evaluator Letter separately ---- */

function printProgressReport(family, entries, child, attendanceDays, goals) {
  const schoolName  = family.schoolName||(family.familyName+" Academy")||"Home School";
  const yearStartNum= family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear();
  const yearEndNum  = family.yearEnd?new Date(family.yearEnd).getFullYear():yearStartNum+1;
  const today       = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const childName   = child ? (child.name+(child.lastName?" "+child.lastName:"")) : "Student";
  const grade       = child?.grade||"";
  const avatar      = child?.avatar||"";
  const goalDays    = 180;
  const attPct      = Math.min(100,Math.round((attendanceDays/goalDays)*100));
  const barColor    = attPct>=80?"#2a4a28":attPct>=50?"#2563a8":"#b07800";

  const subjEntries = entries.filter(e=>!e.isDay&&e.subj!=="Daily Notes"&&e.subj!=="Daily Check-In");
  const milestones  = subjEntries.filter(e=>e.isMilestone);
  const bySubject   = {};
  subjEntries.forEach(e=>{ if(!bySubject[e.subj]) bySubject[e.subj]=[]; bySubject[e.subj].push(e); });
  const subjectList = Object.keys(bySubject).sort((a,b)=>bySubject[b].length-bySubject[a].length);

  const yr = new Date().getFullYear();
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);
  const needsAttn = subjectList.filter(subj=>{
    const all = bySubject[subj]; if(!all||all.length===0) return false;
    try{ const d=new Date(all[0].date+", "+yr); return d<sevenDaysAgo; }catch(ex){return false;}
  });

  const allGoalObjs = [...(goals||[]),...(family.customGoals||[])];
  const activeGoals = (family.goals||[]).map(id=>allGoalObjs.find(x=>x.id===id)).filter(Boolean);

  const css = "*{box-sizing:border-box;margin:0;padding:0}"
    +"body{font-family:Arial,sans-serif;color:#1a1a1a;font-size:10pt;line-height:1.5;background:#fff}"
    +"@media print{@page{margin:1cm;size:letter}.no-print{display:none}}"
    +".banner{background:#2a4a28;padding:20px 28px;display:flex;justify-content:space-between;align-items:center}"
    +".b-title{font-size:8pt;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px}"
    +".b-name{font-size:20pt;font-weight:700;color:#fff;margin-top:2px}"
    +".b-meta{font-size:9pt;color:rgba(255,255,255,0.65);margin-top:3px}"
    +".b-chip{background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 16px;text-align:center;min-width:60px}"
    +".b-chip-v{font-size:20pt;font-weight:700;color:#fff}"
    +".body{padding:20px 28px;background:#faf8f4}"
    +".stat-row{display:flex;gap:10px;margin-bottom:18px}"
    +".stat{text-align:center;flex:1;background:#fff;border-radius:8px;border:1px solid #e2ddd8;padding:10px 8px}"
    +".stat-n{font-size:18pt;font-weight:700;color:#2a4a28}"
    +".stat-l{font-size:7.5pt;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px}"
    +".section{background:#fff;border-radius:10px;border:1px solid #e2ddd8;padding:12px 16px;margin-bottom:12px}"
    +".sec-hdr{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #f0ece6}"
    +".subj-tag{background:#e8f0e8;color:#2a4a28;font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:4px;padding:3px 8px;display:inline-block;margin-bottom:6px}"
    +".entry-row{display:flex;gap:10px;padding:5px 0;border-bottom:1px solid #f8f5f1;font-size:9pt}"
    +".entry-row:last-child{border-bottom:none}"
    +".entry-date{color:#999;min-width:46px;flex-shrink:0;font-size:8pt}"
    +".entry-note{color:#333;flex:1;line-height:1.5}"
    +".milestone-badge{background:#fff8e6;border:1px solid #f5c84240;border-radius:6px;padding:6px 10px;margin-bottom:6px}"
    +".attn-chip{display:inline-block;background:#fff8ed;border:1px solid #f5c84260;border-radius:20px;padding:3px 10px;font-size:8pt;color:#7a5500;margin:2px}"
    +".goal-chip{display:inline-block;background:#e8f0e8;border:1px solid #c8dfc8;border-radius:20px;padding:3px 10px;font-size:8pt;color:#2a4a28;margin:2px}"
    +".att-bar{height:10px;background:#e8e3db;border-radius:99px;overflow:hidden;margin:6px 0}"
    +".att-fill{height:100%;border-radius:99px}"
    +".footer{padding:10px 28px 16px;display:flex;justify-content:space-between;font-size:7.5pt;color:#aaa;border-top:1px solid #e8e3db}"
    +".print-btn{position:fixed;bottom:20px;right:20px;padding:10px 22px;background:#2a4a28;color:#fff;border:none;border-radius:10px;font-size:10pt;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.18)}";

  let html = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>"
    +"<title>"+childName+" Progress Report "+yearStartNum+"&ndash;"+yearEndNum+"</title>"
    +"<style>"+css+"</style></head><body>"
    +"<div class='banner'><div>"
    +"<div class='b-title'>"+schoolName+" &bull; Progress Report</div>"
    +"<div class='b-name'>"+avatar+" "+childName+"</div>"
    +"<div class='b-meta'>"+grade+" &bull; "+(family.state||"")+" &bull; "+yearStartNum+"&ndash;"+yearEndNum+"</div>"
    +"</div><div class='b-chip'><div style='font-size:7pt;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.1em'>Days</div>"
    +"<div class='b-chip-v'>"+attendanceDays+"</div></div></div>"
    +"<div class='body'>"
    +"<div class='stat-row'>"
    +"<div class='stat'><div class='stat-n'>"+attendanceDays+"</div><div class='stat-l'>Days Logged</div></div>"
    +"<div class='stat'><div class='stat-n'>"+subjEntries.length+"</div><div class='stat-l'>Entries</div></div>"
    +"<div class='stat'><div class='stat-n'>"+subjectList.length+"</div><div class='stat-l'>Subjects</div></div>"
    +"<div class='stat'><div class='stat-n'>"+milestones.length+"</div><div class='stat-l'>Milestones</div></div>"
    +"</div>";

  // Attendance bar
  html += "<div class='section'>"
    +"<div class='sec-hdr'>Attendance Progress</div>"
    +"<div style='display:flex;justify-content:space-between;font-size:9pt;margin-bottom:4px'>"
    +"<span style='font-weight:700;color:"+barColor+"'>"+attendanceDays+" of "+goalDays+" days</span>"
    +"<span style='color:#888'>"+attPct+"% complete</span></div>"
    +"<div class='att-bar'><div class='att-fill' style='width:"+attPct+"%;background:"+barColor+"'></div></div>"
    +"</div>";

  // Goals
  if(activeGoals.length>0){
    html += "<div class='section'><div class='sec-hdr'>Learning Goals</div><div>"
      +activeGoals.map(g=>"<span class='goal-chip'>"+g.icon+" "+g.label+"</span>").join("")
      +"</div></div>";
  }

  // Needs attention
  if(needsAttn.length>0){
    html += "<div class='section' style='border-color:#f5c84250;background:#fffbf0'>"
      +"<div class='sec-hdr' style='color:#b07800'>Needs Attention (7+ days since last entry)</div><div>"
      +needsAttn.map(s=>"<span class='attn-chip'>"+s+"</span>").join("")
      +"</div></div>";
  }

  // Subject coverage
  html += "<div class='section'><div class='sec-hdr'>Subject Coverage</div>";
  subjectList.forEach(subj=>{
    const subjEnts = bySubject[subj];
    html += "<div style='margin-bottom:12px'>"
      +"<div style='display:flex;align-items:center;gap:8px;margin-bottom:4px'>"
      +"<div class='subj-tag'>"+subj+"</div>"
      +"<div style='font-size:8pt;color:#999;margin-left:auto'>"+subjEnts.length+" entr"+(subjEnts.length===1?"y":"ies")+"</div></div>";
    subjEnts.slice(0,3).forEach(e=>{
      const note=(e.note||"").replace("AI Summary: ","").trim();
      if(!note) return;
      html += "<div class='entry-row'>"
        +"<div class='entry-date'>"+(e.date||"")+"</div>"
        +"<div class='entry-note'>"+(e.isMilestone?"<span style='color:#b07800;font-weight:700'>&#11088; </span>":"")+note+"</div>"
        +"</div>";
    });
    if(subjEnts.length>3){
      html += "<div style='font-size:8pt;color:#aaa;padding:4px 0'>+"+(subjEnts.length-3)+" more entries</div>";
    }
    html += "</div>";
  });
  html += "</div>";

  // Milestones
  if(milestones.length>0){
    html += "<div class='section'><div class='sec-hdr'>Milestones</div>";
    milestones.slice(0,10).forEach(e=>{
      html += "<div class='milestone-badge'>"
        +"<div style='display:flex;gap:8px;align-items:baseline'>"
        +"<span style='font-size:8pt;color:#b07800;font-weight:700'>&#11088;</span>"
        +"<span style='font-size:8pt;color:#b07800;font-weight:700;text-transform:uppercase;letter-spacing:0.06em'>"+e.subj+"</span>"
        +"<span style='font-size:7.5pt;color:#999;margin-left:auto'>"+(e.date||"")+"</span></div>"
        +"<div style='font-size:9pt;color:#333;margin-top:3px'>"+(e.note||"").replace("AI Summary: ","").trim()+"</div>"
        +"</div>";
    });
    html += "</div>";
  }

  // Signature + footer
  html += "<div style='display:flex;gap:24px;margin:20px 0 16px;padding-top:16px;border-top:1.5px solid #ccc'>"
    +"<div style='flex:1'><div style='border-bottom:1.5px solid #999;height:30px;margin-bottom:4px'></div><div style='font-size:7.5pt;color:#888'>Parent Signature</div></div>"
    +"<div style='flex:1'><div style='border-bottom:1.5px solid #999;height:30px;margin-bottom:4px'></div><div style='font-size:7.5pt;color:#888'>Date</div></div>"
    +"</div>"
    +"<div class='footer'><span>"+schoolName+" &bull; "+childName+"</span><span>Generated: "+today+"</span></div>"
    +"<button class='print-btn no-print' onclick='window.print()'>Print / Save PDF</button>"
    +"<script>window.onload=function(){setTimeout(function(){window.print();},600);};<\/script>"
    +"</body></html>";

  const w=window.open("","_blank","width=820,height=980,scrollbars=yes");
  if(w){w.document.write(html);w.document.close();}
}

function printPortfolioPDF(family, entries, child, attendanceDays, stateInfo, dateOverride) {
  const schoolName  = family.schoolName||(family.familyName+" Academy")||"Home School";
  const yearStartNum= family.yearStart ? new Date(family.yearStart).getFullYear() : new Date().getFullYear();
  const yearEndNum  = family.yearEnd   ? new Date(family.yearEnd).getFullYear()   : yearStartNum+1;
  const state       = family.state||"";
  const childName   = child ? (child.name+(child.lastName?" "+child.lastName:"")) : "Student";
  const grade       = child?.grade||"";
  const avatar      = child?.avatar||"";

  const todayFull = dateOverride
    ? new Date(dateOverride+", "+new Date().getFullYear()).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})
    : new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  const todayShort = dateOverride || new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

  const si = getStateInfo(state);
  const ci = getComplianceInfo(state, grade);
  const needsDays    = si.attendance;
  const needsReading = si.readingLog;
  const stateReqDays = parseInt((si.hours||"180").match(/\d+/)?.[0]||"180");
  const pct = needsDays ? Math.min(100,Math.round(attendanceDays/stateReqDays*100)) : null;

  const todayEntries  = entries.filter(e=>e.date===todayShort&&!e.isDay&&e.subj!=="Daily Notes");
  const todayNote     = entries.find(e=>e.date===todayShort&&(e.isDay||e.subj==="Daily Notes"));
  const allPhotos     = entries.filter(e=>e.date===todayShort).flatMap(e=>e.photos||[]).slice(0,3);
  const readingEntries= todayEntries.filter(e=>e.readingTitle||(e.subj==="Reading"||e.subj==="Reading/Language Arts"));

  const cols = todayEntries.length<=2?1:todayEntries.length<=6?2:3;

  const css = ""
    +"*{box-sizing:border-box;margin:0;padding:0}"
    +"body{font-family:Arial,sans-serif;color:#1a1a1a;font-size:10pt;line-height:1.5;background:#fff}"
    +"@media print{@page{margin:1cm;size:letter}body{font-size:9.5pt}}"
    +".banner{background:#2a4a28;padding:18px 24px;display:flex;justify-content:space-between;align-items:center}"
    +".b-school{font-size:7.5pt;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px}"
    +".b-student{font-size:17pt;font-weight:700;color:#fff}"
    +".b-meta{font-size:8.5pt;color:rgba(255,255,255,0.65);margin-top:2px}"
    +".date-chip{background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;text-align:center}"
    +".dc-label{font-size:7pt;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.1em}"
    +".dc-val{font-size:14pt;font-weight:700;color:#fff;margin-top:2px}"
    +".body{padding:20px 24px;background:#faf8f4}"
    +".section-label{font-size:7.5pt;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:8px;margin-top:14px}"
    +".section-label:first-child{margin-top:0}"
    +".subj-grid{display:grid;gap:10px;margin-bottom:14px}"
    +".subj-box{background:#fff;border-radius:8px;border:1px solid #e2ddd8;padding:11px 14px}"
    +".subj-tag{display:inline-block;background:#e8f0e8;color:#2a4a28;font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:4px;padding:2px 7px;margin-bottom:6px}"
    +".subj-note{font-size:9.5pt;color:#333;line-height:1.6}"
    +".subj-reading{font-size:8.5pt;color:#2a4a28;font-style:italic;margin-top:4px}"
    +".photos-section{margin-bottom:14px}"
    +".photo-row{display:flex;gap:10px}"
    +".photo-box{flex:1;aspect-ratio:4/3;border-radius:6px;overflow:hidden;border:1px solid #e0e0e0;background:#f5f5f5;display:flex;align-items:center;justify-content:center}"
    +".photo-box img{width:100%;height:100%;object-fit:cover}"
    +".photo-placeholder{font-size:8pt;color:#ccc;text-align:center}"
    +".parent-note{background:#f8f7f4;border-left:3px solid #aaa;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:14px}"
    +".parent-note-label{font-size:7pt;text-transform:uppercase;letter-spacing:0.1em;color:#888;font-weight:700;margin-bottom:4px}"
    +".reading-box{background:#fff;border:1px solid #e2ddd8;border-radius:8px;padding:10px 14px;margin-bottom:14px}"
    +".r-row{display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f5f5f5;align-items:baseline}"
    +".r-row:last-child{border-bottom:none}"
    +".r-subj{font-size:7.5pt;color:#2a4a28;font-weight:700;min-width:90px}"
    +".r-title{font-size:9pt;color:#333;font-style:italic}"
    +".footer{padding:10px 24px 14px;display:flex;justify-content:space-between;font-size:7.5pt;color:#aaa;border-top:1px solid #e8e3db}"
    +".f-note{font-size:7pt;color:#bbb;font-style:italic;margin-top:1px}"
    ;

  let html = "<!DOCTYPE html><html lang='en'><head>"
    +"<meta charset='utf-8'><title>"+childName+" Daily Log \u2014 "+todayShort+"</title>"
    +"<style>"+css+"</style></head><body>"

    // Banner
    +"<div class='banner'>"
    +"<div><div class='b-school'>"+schoolName+"</div>"
    +"<div class='b-student'>"+avatar+" "+childName+"</div>"
    +"<div class='b-meta'>"+grade+" &bull; "+state+" &bull; "+yearStartNum+"&ndash;"+yearEndNum+"</div></div>"
    +"<div class='date-chip'><div class='dc-label'>Daily Activity Log</div><div class='dc-val'>"+todayShort+"</div></div>"
    +"</div>"

    +"<div class='body'>";

  // Subjects
  if(todayEntries.length===0) {
    html += "<div style='text-align:center;padding:2rem;color:#aaa;font-style:italic'>No entries logged for this day.</div>";
  } else {
    html += "<div class='section-label'>Subjects Covered</div>";
    html += "<div class='subj-grid' style='grid-template-columns:repeat("+cols+",1fr)'>";
    todayEntries.forEach(e=>{
      const noteTxt  = (e.note||"").replace("AI Summary: ","").trim();
      const titleTxt = (e.title||"").replace((e.subj||"")+" \u2014 ","").replace((e.subj||"")+" -- ","").trim();
      const showTitle = titleTxt && titleTxt!==e.subj && titleTxt!==e.date;
      html += "<div class='subj-box'><div class='subj-tag'>"+e.subj+"</div>";
      if(showTitle) html += "<div style='font-weight:600;font-size:9.5pt;color:#1a1a1a;margin-bottom:3px'>"+titleTxt+"</div>";
      if(noteTxt)   html += "<div class='subj-note'>"+noteTxt+"</div>";
      if(e.readingTitle) html += "<div class='subj-reading'>&#128214; "+e.readingTitle+"</div>";
      if(!showTitle&&!noteTxt&&!e.readingTitle) html += "<div class='subj-note' style='color:#bbb'>No notes recorded</div>";
      html += "</div>";
    });
    html += "</div>";
  }

  // Parent note
  if(todayNote&&todayNote.note){
    const noteClean=(todayNote.note||"").replace("AI Summary: ","").trim();
    html += "<div class='parent-note'><div class='parent-note-label'>Parent Notes</div><div style='font-size:9.5pt;color:#444;line-height:1.65'>"+noteClean+"</div></div>";
  }

  // FL/PA reading log
  if(needsReading && readingEntries.some(e=>e.readingTitle)){
    html += "<div class='section-label'>Reading Log (required by "+state+")</div>"
      +"<div class='reading-box'>";
    readingEntries.filter(e=>e.readingTitle).forEach(e=>{
      html += "<div class='r-row'><div class='r-subj'>"+e.subj+"</div><div class='r-title'>"+e.readingTitle+"</div></div>";
    });
    html += "</div>";
  }

  // Photos - only show section if there are actual photos
  if(allPhotos.length>0){
    html += "<div class='section-label'>Work Samples / Documentation</div>"
      +"<div class='photo-row'>";
    allPhotos.forEach(function(src,i){
      html += "<div class='photo-box'><img src='"+src+"' alt='work sample "+(i+1)+"'/></div>";
    });
    html += "</div>";
  }


  // Footer
  html += "<div class='footer'>"
    +"<div><div>"+schoolName+" &bull; "+childName+" &bull; "+grade+"</div>"
    +"<div class='f-note'>"+todayFull+" &bull; Generated by Root &amp; Bloom</div></div>"
    +"<div style='text-align:right'><div>"+state+" Homeschool Record</div>"
    +"<div class='f-note'>Keep for: "+ci.keepFor+"</div></div>"
    +"</div>"

    +"</div>" // body
    +"<script>window.onload=function(){setTimeout(function(){window.print();},500);};<\/script>"
    +"</body></html>";

  const w=window.open("","_blank","width=800,height=960,scrollbars=yes");
  if(w){w.document.write(html);w.document.close();}
  else{alert("Please allow popups to print your portfolio.");}
}


const ALL_SECTIONS_EXT = [...ALL_SECTIONS.map(s=>(["schedule","portfolio"].includes(s.id)?{...s,locked:false}:s)),{id:"progress",label:"Progress",icon:"\ud83d\udcc8",locked:false}].filter((s,i,a)=>a.findIndex(x=>x.id===s.id)===i).sort((a,b)=>a.id==="more"?1:b.id==="more"?-1:a.id==="progress"?1:b.id==="progress"?-1:0);

function NewYearModal({pal,family,onStart,onDismiss}){
  const today = new Date();
  // Default new year: starts today, ends ~10 months from now
  const defStart = today.toISOString().slice(0,10);
  const defEnd = new Date(today.getFullYear()+1, today.getMonth()-1, today.getDate()).toISOString().slice(0,10);

  const [yearStart, setYearStart] = useState(defStart);
  const [yearEnd,   setYearEnd]   = useState(defEnd);
  const [children,  setChildren]  = useState(
    family.children.map(c=>({...c, newGrade: nextGrade(c.grade)||c.grade}))
  );
  const [subjects,  setSubjects]  = useState(family.subjects||[]);
  const [notes,     setNotes]     = useState({}); // {childId: noteText}
  const [step,      setStep]      = useState(0); // 0=intro 1=dates 2=grades 3=notes 4=subjects

  const allSubjs = [...SUBJECT_OPTIONS,...(family.customSubjects||[])];
  const toggleSubj = id => setSubjects(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const updGrade = (id, grade) => setChildren(cs=>cs.map(c=>c.id===id?{...c,newGrade:grade}:c));
  const updNote  = (id, val)   => setNotes(n=>({...n,[id]:val}));

  const handleStart = () => {
    onStart({
      yearStart,
      yearEnd,
      subjects,
      children: children.map(c=>({...c, grade:c.newGrade, newYearNote:notes[c.id]||""})),
    });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.82)",backdropFilter:"blur(14px)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"slideUp 0.3s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{background:pal.heroGrad,padding:"1rem 1.2rem",flexShrink:0}}>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"1.05rem",marginBottom:"2px"}}>{"🌱 New School Year!"}</div>
          <div style={{fontSize:"0.74rem",color:"rgba(255,255,255,0.75)"}}>
            {"Your " + new Date(family.yearEnd).getFullYear() + " school year has ended. Let" + String.fromCharCode(39) + "s set up the next one."}
          </div>
        </div>

        {/* Step dots */}
        <div style={{display:"flex",gap:"5px",padding:"0.7rem 1.2rem 0",flexShrink:0}}>
          {["Dates","Grades","Notes","Subjects"].map((l,i)=>(
            <div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{height:"4px",borderRadius:"99px",background:i<=step-1?pal.primary:pal.stone+"35",marginBottom:"3px",transition:"background 0.25s"}}/>
              <div style={{fontSize:"0.58rem",color:i<=step-1?pal.primary:pal.stone,fontWeight:i===step-1?"700":"400"}}>{l}</div>
            </div>
          ))}
        </div>

        <div key={step} style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {/* Step 0: Intro */}
          {step===0&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{textAlign:"center",marginBottom:"1.5rem",paddingTop:"0.5rem"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.6rem"}}>🎉</div>
                <div style={{fontWeight:"900",color:pal.ink,fontSize:"1.1rem",marginBottom:"0.4rem"}}>Year Complete!</div>
                <div style={{fontSize:"0.82rem",color:pal.slate,lineHeight:1.65,maxWidth:"280px",margin:"0 auto"}}>
                  {"Your attendance counter will reset to zero and your new year will start fresh. Your portfolio and all past entries are saved."}
                </div>
              </div>
              <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1rem",border:`1.5px solid ${pal.primary}20`,marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem",marginBottom:"0.5rem"}}>{"What resets:"}</div>
                {[
                  ["📅","Attendance counter → back to 0"],
                  ["🔥","Daily streak → resets"],
                  ["📋","Schedule stays the same"],
                  ["🗂","Portfolio entries are kept"],
                ].map(([icon,label])=>(
                  <div key={label} style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.3rem"}}>
                    <span style={{fontSize:"0.9rem",flexShrink:0}}>{icon}</span>
                    <span style={{fontSize:"0.78rem",color:pal.inkM}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Dates */}
          {step===1&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.65rem"}}>New Year Dates</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem"}}>
                <div>
                  <Lbl pal={pal}>Start date</Lbl>
                  <input type="date" value={yearStart} onChange={e=>setYearStart(e.target.value)}
                    style={{width:"100%",padding:"0.55rem 0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
                </div>
                <div>
                  <Lbl pal={pal}>Goal end date</Lbl>
                  <input type="date" value={yearEnd} onChange={e=>setYearEnd(e.target.value)}
                    style={{width:"100%",padding:"0.55rem 0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=pal.primary} onBlur={e=>e.target.style.borderColor=pal.stone}/>
                </div>
              </div>
              <div style={{background:pal.linen,borderRadius:"12px",padding:"0.7rem 0.9rem",border:`1.5px solid ${pal.stone}30`,fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>
                {"You can always adjust these later in Settings \u2192 Family."}
              </div>
            </div>
          )}

          {/* Step 2: Grade promotion */}
          {step===2&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.2rem"}}>Confirm Grades</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,marginBottom:"0.85rem",lineHeight:1.55}}>
                {"We" + String.fromCharCode(39) + "ve suggested the next grade for each child. Change any that don" + String.fromCharCode(39) + "t look right."}
              </div>
              {children.map(c=>{
                const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                const pcTier = c.newGrade&&["Pre-K","K","1st","2nd"].includes(c.newGrade)?"Playful & low-pressure"
                  :["3rd","4th","5th","6th","7th","8th"].includes(c.newGrade)?"Story-based & scenario-driven"
                  :"Matter-of-fact & responsibility-focused";
                return (
                  <div key={c.id} style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}30`}}>
                    <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"0.75rem"}}>
                      <div style={{width:"42px",height:"42px",borderRadius:"11px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>{c.avatar}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.9rem"}}>{c.name}</div>
                        <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"1px"}}>
                          {c.grade} {"\u2192"} <span style={{fontWeight:"700",color:cp.c1}}>{c.newGrade}</span>
                        </div>
                      </div>
                      <select value={c.newGrade} onChange={e=>updGrade(c.id,e.target.value)}
                        style={{padding:"0.42rem 0.65rem",border:`2px solid ${cp.c1}`,borderRadius:"10px",fontSize:"0.84rem",background:pal.pale,color:cp.c1,fontWeight:"700",outline:"none",cursor:"pointer"}}>
                        {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    {family.lifeReady&&(
                      <div style={{background:`${LR_COLOR}10`,borderRadius:"9px",padding:"0.45rem 0.65rem",border:`1px solid ${LR_COLOR}25`,display:"flex",gap:"0.4rem",alignItems:"flex-start"}}>
                        <span style={{fontSize:"0.85rem",flexShrink:0}}>{LR_ICON}</span>
                        <div style={{fontSize:"0.69rem",color:LR_COLOR,lineHeight:1.5}}>
                          <b>P{"&"}C updates automatically</b>{" \u2014 "}{c.newGrade} lessons will use the <b>{pcTier}</b> style.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3: New year notes per child */}
          {step===3&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.2rem"}}>Teaching Notes</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,marginBottom:"0.85rem",lineHeight:1.55}}>
                Optional — jot down anything to keep in mind going into the new year. What to focus on, what struggled, goals, or anything you want to remember on day one.
              </div>
              {children.map(c=>{
                const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(c.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
                return (
                  <div key={c.id} style={{marginBottom:"1rem"}}>
                    {family.children.length>1&&(
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem"}}>
                        <div style={{width:"28px",height:"28px",borderRadius:"7px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",flexShrink:0}}>{c.avatar}</div>
                        <span style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem"}}>{c.name}</span>
                        <span style={{fontSize:"0.7rem",color:pal.slate}}>{c.newGrade}</span>
                      </div>
                    )}
                    <textarea
                      value={notes[c.id]||""}
                      onChange={e=>updNote(c.id,e.target.value)}
                      placeholder={"e.g. " + c.name + " needs more practice with reading fluency. Really excelled at math this year \u2014 ready for harder problems. Consider adding more hands-on science. Keep an eye on writing stamina."}
                      rows={4}
                      style={{width:"100%",padding:"0.7rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",fontSize:"0.81rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.6}}
                      onFocus={e=>e.target.style.borderColor=cp.c1}
                      onBlur={e=>e.target.style.borderColor=pal.stone}/>
                  </div>
                );
              })}
              <div style={{background:pal.pale,borderRadius:"11px",padding:"0.65rem 0.85rem",border:`1.5px solid ${pal.primary}20`,fontSize:"0.71rem",color:pal.slate,lineHeight:1.55}}>
                {"These notes are saved to each child" + String.fromCharCode(39) + "s profile and will show in their portfolio as a new year note."}
              </div>
            </div>
          )}

          {/* Step 4: Subjects */}
          {step===4&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{fontWeight:"800",color:pal.inkM,fontSize:"0.82rem",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.2rem"}}>Subjects This Year</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,marginBottom:"0.85rem"}}>Review and update for the new year. Add or remove anything that changed.</div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                {allSubjs.map(s=>{
                  const sel=subjects.includes(s.id);
                  return (
                    <button key={s.id} onClick={()=>toggleSubj(s.id)}
                      style={{display:"flex",gap:"0.65rem",alignItems:"center",padding:"0.6rem 0.85rem",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,borderRadius:"11px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.13s"}}>
                      <span style={{fontSize:"1rem",width:"22px",textAlign:"center",flexShrink:0}}>{s.icon||"📋"}</span>
                      <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.83rem"}}>{s.label}</span>
                      <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {sel&&<span style={{color:"#fff",fontSize:"0.72rem",fontWeight:"900"}}>{"✓"}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}40`,background:pal.linen,flexShrink:0,display:"flex",gap:"0.55rem"}}>
          {step===0 ? (
            <button onClick={onDismiss}
              style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>
              Later
            </button>
          ) : (
            <button onClick={()=>setStep(s=>s-1)}
              style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>
              Back
            </button>
          )}
          <button onClick={()=>{
            if(step<4) setStep(s=>s+1);
            else handleStart();
          }} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
            {step===0?"Set up new year \u2192":step===4?"Start new year \uD83C\uDF31":"Next \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
/* =======================================
   GOALS NUDGE CARD
======================================= */
function ScheduleEditorModal({pal,family,onSave,onClose}){
  // Build the current schedule to edit
  const baseBlocks = generateSchedule({...family, scheduleOverrides:null, lifeReady:false}, family.scheduleMode2!=="same"?family.children?.[0]?.id:null);

  // Working copy of blocks for editing
  const [blocks, setBlocks] = useState(()=>{
    const overrides = family.scheduleOverrides||{};
    return baseBlocks
      .filter(b=>!(overrides.removed||[]).includes(b.s))
      .map(b=>({...b, dur:overrides.durations?.[b.s]||b.dur}))
      .concat((overrides.custom||[]).map(b=>({...b,_custom:true})));
  });

  const [showAdd,   setShowAdd]   = useState(false);
  const [newName,   setNewName]   = useState("");
  const [newIcon,   setNewIcon]   = useState("📋");
  const [newDur,    setNewDur]    = useState("30");

  const ICONS = ["📋","📖","✏️","📐","🔬","🌿","🎨","🎵","🏃","🌍","💻","🙏","🍳","🏠","🧠","⭐"];
  const DURATIONS = ["10","15","20","30","45","60","90"];

  const moveUp   = (i) => { if(i===0) return; const b=[...blocks]; [b[i-1],b[i]]=[b[i],b[i-1]]; setBlocks(b); };
  const moveDown = (i) => { if(i===blocks.length-1) return; const b=[...blocks]; [b[i],b[i+1]]=[b[i+1],b[i]]; setBlocks(b); };
  const remove   = (i) => setBlocks(b=>b.filter((_,bi)=>bi!==i));
  const setDur   = (i,dur) => setBlocks(b=>b.map((bl,bi)=>bi===i?{...bl,dur:parseInt(dur)}:bl));

  const addBlock = () => {
    if(!newName.trim()) return;
    setBlocks(b=>[...b,{s:newName.trim(),i:newIcon,dur:parseInt(newDur)||30,c:"all",t:"",_custom:true}]);
    setNewName(""); setNewIcon("📋"); setNewDur("30");
    setShowAdd(false);
  };

  const handleSave = () => {
    const baseNames = baseBlocks.map(b=>b.s);
    const currentNames = blocks.map(b=>b.s);
    // What was removed from base
    const removed = baseNames.filter(n=>!currentNames.includes(n));
    // Duration overrides
    const durations = {};
    blocks.forEach(b=>{
      const base = baseBlocks.find(bb=>bb.s===b.s);
      if(base && base.dur!==b.dur) durations[b.s]=b.dur;
    });
    // Custom blocks
    const custom = blocks.filter(b=>b._custom);
    // Order of all blocks
    const order = blocks.map(b=>b.s);
    onSave({removed, durations, custom, order});
  };

  const totalMins = blocks.reduce((s,b)=>s+b.dur,0);
  const hrs = Math.floor(totalMins/60);
  const mins = totalMins%60;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.78)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{background:pal.heroGrad,padding:"0.9rem 1.2rem",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontWeight:"900",color:"#fff",fontSize:"1rem"}}>{"✏️ Edit Schedule"}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.72)",marginTop:"2px"}}>
                {blocks.length} blocks {"\u00b7"} {hrs>0?hrs+"h ":""}{mins>0?mins+"m":""} total
              </div>
            </div>
            <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
              <button onClick={()=>{if(window.confirm("Reset to default schedule?"))onSave({removed:[],durations:{},custom:[],order:[]});}}
                style={{padding:"0.28rem 0.6rem",border:"none",borderRadius:"8px",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>
                Reset
              </button>
              <button onClick={onClose}
                style={{padding:"0.28rem 0.6rem",border:"none",borderRadius:"8px",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>
                {"✕"}
              </button>
            </div>
          </div>
        </div>

        {/* Block list */}
        <div style={{flex:1,overflowY:"auto",padding:"0.85rem 1.1rem"}}>
          <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem",lineHeight:1.5}}>
            Drag to reorder using the arrows. Tap the duration to change it. Remove any block with ✕.
          </div>

          {blocks.map((b,i)=>(
            <div key={b.s+i} style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.55rem 0.75rem",background:"#fff",borderRadius:"12px",marginBottom:"0.38rem",border:`1.5px solid ${pal.stone}25`}}>
              {/* Move buttons */}
              <div style={{display:"flex",flexDirection:"column",gap:"1px",flexShrink:0}}>
                <button onClick={()=>moveUp(i)}
                  style={{width:"20px",height:"18px",border:`1px solid ${pal.stone}50`,borderRadius:"4px",background:"transparent",color:i===0?pal.stone+"50":pal.slate,cursor:i===0?"default":"pointer",fontSize:"0.6rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {"▲"}
                </button>
                <button onClick={()=>moveDown(i)}
                  style={{width:"20px",height:"18px",border:`1px solid ${pal.stone}50`,borderRadius:"4px",background:"transparent",color:i===blocks.length-1?pal.stone+"50":pal.slate,cursor:i===blocks.length-1?"default":"pointer",fontSize:"0.6rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {"▼"}
                </button>
              </div>

              {/* Icon + name */}
              <span style={{fontSize:"1.1rem",flexShrink:0}}>{b.i||"📋"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.s}</div>
                {b._custom&&<div style={{fontSize:"0.6rem",color:pal.primary,fontWeight:"700"}}>custom</div>}
              </div>

              {/* Duration selector */}
              <select value={String(b.dur)} onChange={e=>setDur(i,e.target.value)}
                style={{padding:"0.22rem 0.3rem",border:`1.5px solid ${pal.stone}`,borderRadius:"7px",fontSize:"0.76rem",background:pal.parchm,color:pal.inkM,outline:"none",cursor:"pointer",flexShrink:0}}>
                {DURATIONS.map(d=><option key={d} value={d}>{d}m</option>)}
              </select>

              {/* Remove */}
              <button onClick={()=>remove(i)}
                style={{width:"24px",height:"24px",borderRadius:"50%",border:`1.5px solid ${pal.stone}`,background:"transparent",color:pal.slate,fontSize:"0.7rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {"✕"}
              </button>
            </div>
          ))}

          {/* Add block */}
          {!showAdd?(
            <button onClick={()=>setShowAdd(true)}
              style={{width:"100%",padding:"0.6rem",border:`2px dashed ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontSize:"0.8rem",fontWeight:"600",cursor:"pointer",marginTop:"0.35rem"}}>
              + Add a block
            </button>
          ):(
            <div style={{background:pal.pale,borderRadius:"14px",padding:"0.85rem",marginTop:"0.5rem",border:`1.5px solid ${pal.primary}25`,animation:"fadeUp 0.18s ease"}}>
              <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.82rem",marginBottom:"0.6rem"}}>New Block</div>
              <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.5rem"}}>
                <input value={newName} onChange={e=>setNewName(e.target.value)}
                  placeholder="Block name..."
                  onKeyDown={e=>e.key==="Enter"&&addBlock()}
                  style={{flex:1,padding:"0.48rem 0.65rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:"#fff",color:pal.ink,outline:"none",fontFamily:"inherit"}}
                  onFocus={e=>e.target.style.borderColor=pal.primary}
                  onBlur={e=>e.target.style.borderColor=pal.stone}
                  autoFocus/>
                <select value={newDur} onChange={e=>setNewDur(e.target.value)}
                  style={{padding:"0.48rem 0.5rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.82rem",background:"#fff",color:pal.inkM,outline:"none"}}>
                  {DURATIONS.map(d=><option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
              <div style={{marginBottom:"0.6rem"}}>
                <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.3rem"}}>Icon</div>
                <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap"}}>
                  {ICONS.map(ic=>(
                    <button key={ic} onClick={()=>setNewIcon(ic)}
                      style={{width:"32px",height:"32px",borderRadius:"8px",border:`2px solid ${newIcon===ic?pal.primary:pal.stone+"50"}`,background:newIcon===ic?pal.pale:"transparent",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:"0.4rem"}}>
                <button onClick={()=>{setShowAdd(false);setNewName("");}}
                  style={{padding:"0.5rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontSize:"0.8rem",cursor:"pointer"}}>
                  Cancel
                </button>
                <button onClick={addBlock}
                  style={{flex:1,padding:"0.5rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>
                  Add Block
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"0.9rem 1.1rem",borderTop:`1px solid ${pal.stone}40`,background:pal.linen,flexShrink:0}}>
          <button onClick={handleSave}
            style={{width:"100%",padding:"0.82rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.9rem",cursor:"pointer"}}>
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function FullYearPrintModal({pal, family, child, cp, entries, attendanceDays, onClose}) {
  const [aiSummary,  setAiSummary]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [includeAI,  setIncludeAI]  = useState(true);
  const subjEntries = entries.filter(e=>!e.isDay&&e.subj!=="Daily Notes");
  const bySubject   = {};
  subjEntries.forEach(e=>{ if(!bySubject[e.subj]) bySubject[e.subj]=[]; bySubject[e.subj].push(e); });
  const subjectList   = Object.keys(bySubject).sort((a,b)=>bySubject[b].length-bySubject[a].length);
  const readingTitles = [...new Set(subjEntries.filter(e=>e.readingTitle).map(e=>e.readingTitle))];
  const generateSummary = async () => {
    setLoading(true); setError(null);
    const subjBreakdown = subjectList.map(s=>s+" ("+bySubject[s].length+")").join(", ");
    const notesSample   = subjEntries.filter(e=>(e.note||"").trim().length>20).slice(0,20).map(e=>e.subj+": "+((e.note||"").slice(0,120))).join(" | ");
    const yearStart = family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear();
    const yearEnd   = family.yearEnd?new Date(family.yearEnd).getFullYear():yearStart+1;
    const prompt = "You are writing a warm year-end summary for a homeschool portfolio.\n"
      +"Student: "+child.name+", "+child.grade+"\nSchool: "+(family.schoolName||family.familyName+" Academy")+"\n"
      +"Subjects: "+subjBreakdown+"\nDays logged: "+attendanceDays+"\n"
      +"Reading: "+(readingTitles.slice(0,8).join(", ")||"not recorded")+"\n"
      +"Work samples: "+notesSample+"\n\n"
      +"Respond ONLY in JSON (no markdown):\n"
      +'{"narrative":"2-3 warm sentences","accomplishments":["win 1","win 2","win 3","win 4"],"growthAreas":["area 1","area 2","area 3"],"readingHighlight":"one sentence","parentNote":"encouragement for parent"}';
    try {
      const raw = await callClaude(prompt);
      setAiSummary(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) { setError("Could not generate — try again."); }
    setLoading(false);
  };
  const handlePrint = () => {
    printFullPortfolio(family, entries, child, attendanceDays, null, includeAI?aiSummary:null);
    onClose();
  };
  const handleDownload = () => {
    const html = printFullPortfolio(family, entries, child, attendanceDays, null, includeAI?aiSummary:null);
    const yn = (family.yearStart?new Date(family.yearStart).getFullYear():new Date().getFullYear());
    const fname = (child.name||"Portfolio").replace(/\s+/g,"-")+"_Portfolio_"+yn+".html";
    const ok = downloadPortfolioHTML(html||"", fname);
    if(!ok) alert("Download failed. Try Print instead.");
    else onClose();
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:"430px",background:pal.linen,borderRadius:"24px 24px 0 0",animation:"slideUp 0.26s ease",maxHeight:"88vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0.65rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone+"60"}}/>
        </div>
        <div style={{padding:"0.75rem 1.2rem 0.8rem",borderBottom:`1px solid ${pal.stone}30`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"📚 Full Year Portfolio"}</div>
            <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"2px"}}>{child.name+" · "+child.grade}</div>
          </div>
          <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem"}}>{"✕"}</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.5rem",marginBottom:"1rem"}}>
            {[{n:attendanceDays,l:"Days"},{n:subjEntries.length,l:"Entries"},{n:subjectList.length,l:"Subjects"}].map(({n,l})=>(
              <div key={l} style={{background:cp.c1+"12",borderRadius:"10px",padding:"0.6rem 0.5rem",textAlign:"center",border:`1px solid ${cp.c1}20`}}>
                <div style={{fontWeight:"800",color:cp.c1,fontSize:"1.1rem"}}>{n}</div>
                <div style={{fontSize:"0.63rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:pal.parchm,borderRadius:"13px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}25`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"}}>
              <div>
                <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{"✨ AI Year Summary"}</div>
                <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"2px"}}>{"Accomplishments, growth areas, reading"}</div>
              </div>
              <button onClick={()=>setIncludeAI(v=>!v)}
                style={{width:"42px",height:"24px",borderRadius:"12px",border:"none",background:includeAI?cp.c1:pal.stone+"60",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:"3px",left:includeAI?"21px":"3px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
              </button>
            </div>
            {includeAI&&!aiSummary&&!loading&&(
              <button onClick={generateSummary}
                style={{width:"100%",padding:"0.6rem",border:"none",borderRadius:"10px",background:cp.c1,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>
                {"Generate Year Summary"}
              </button>
            )}
            {includeAI&&loading&&(
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.4rem 0"}}>
                {[0,1,2].map(i=><div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:cp.c1,animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}
                <span style={{fontSize:"0.75rem",color:pal.slate}}>{"Reviewing the year..."}</span>
              </div>
            )}
            {includeAI&&error&&<div style={{fontSize:"0.74rem",color:"#a03030"}}>{error}</div>}
            {includeAI&&aiSummary&&(
              <div style={{animation:"fadeUp 0.2s ease"}}>
                <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.65,marginBottom:"0.65rem",fontStyle:"italic"}}>{aiSummary.narrative}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
                  <div>
                    <div style={{fontSize:"0.63rem",fontWeight:"800",color:cp.c1,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.3rem"}}>{"Biggest Wins"}</div>
                    {(aiSummary.accomplishments||[]).map((a,i)=>(
                      <div key={i} style={{display:"flex",gap:"0.35rem",fontSize:"0.74rem",color:pal.inkM,marginBottom:"0.22rem",alignItems:"baseline"}}>
                        <span style={{color:cp.c1,fontWeight:"700",flexShrink:0}}>{"✓"}</span><span>{a}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontSize:"0.63rem",fontWeight:"800",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.3rem"}}>{"Keep Building"}</div>
                    {(aiSummary.growthAreas||[]).map((a,i)=>(
                      <div key={i} style={{display:"flex",gap:"0.35rem",fontSize:"0.74rem",color:pal.inkM,marginBottom:"0.22rem",alignItems:"baseline"}}>
                        <span style={{color:"#b07800",flexShrink:0}}>{"→"}</span><span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {includeAI&&!aiSummary&&!loading&&<div style={{fontSize:"0.71rem",color:pal.stone,textAlign:"center",padding:"0.4rem 0",fontStyle:"italic"}}>{"Tap Generate to summarize "+child.name+"'s year"}</div>}
          </div>
        </div>
        <div style={{padding:"0.85rem 1.2rem",borderTop:`1px solid ${pal.stone}30`,flexShrink:0,display:"flex",gap:"0.5rem"}}>
          <button onClick={onClose} style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontSize:"0.82rem",cursor:"pointer"}}>{"Cancel"}</button>
          <button onClick={handleDownload} style={{padding:"0.7rem 0.85rem",border:"2px solid "+pal.primary,borderRadius:"12px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>{"\u2b07\ufe0f Download"}</button>
          <button onClick={handlePrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.86rem",cursor:"pointer"}}>{"🖨 Print"}</button>
        </div>
      </div>
    </div>
  );
}


function EntryDetailModal({pal,family,entry,onClose,onEdit}){
  if(!entry) return null;
  const ch = family.children[entry.childIdx];
  const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(ch?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-end",animation:"fadeIn 0.18s ease"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{width:"100%",maxHeight:"85vh",overflowY:"auto",background:pal.linen,borderRadius:"22px 22px 0 0",padding:"1.2rem 1.1rem 2rem",animation:"slideUp 0.22s ease"}}>

        {/* Handle bar */}
        <div style={{width:"40px",height:"4px",borderRadius:"99px",background:pal.stone+"60",margin:"0 auto 1rem"}}/>

        {/* Header */}
        <div style={{display:"flex",gap:"0.75rem",alignItems:"flex-start",marginBottom:"1rem"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`linear-gradient(135deg,${cp.c1}25,${cp.c2}18)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0,overflow:"hidden",position:"relative"}}>
            {entry.photos&&entry.photos[0]
              ?<img src={entry.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
              :<span>{entry.thumb||"📋"}</span>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.92rem",lineHeight:1.3}}>{entry.readingTitle||entry.title}</div>
            <div style={{fontSize:"0.7rem",color:pal.slate,marginTop:"2px"}}>
              {entry.subj}{entry.date?" · "+entry.date:""}{ch?" · "+ch.avatar+" "+ch.name:""}
            </div>
          </div>
          {onEdit&&<button onClick={onEdit} style={{padding:"0.28rem 0.65rem",border:`1.5px solid ${pal.stone}`,borderRadius:"8px",background:"transparent",color:pal.slate,fontWeight:"700",fontSize:"0.7rem",cursor:"pointer",flexShrink:0}}>Edit</button>}
        </div>

        {/* Reading title */}
        {entry.readingTitle&&entry.readingTitle!==entry.title&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>📖 Reading Material</div>
            <div style={{fontSize:"0.88rem",color:pal.ink,fontWeight:"600"}}>{entry.readingTitle}</div>
          </div>
        )}

        {/* Notes */}
        {entry.note&&entry.note.trim()&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>Notes</div>
            <div style={{fontSize:"0.84rem",color:pal.inkM,lineHeight:1.75,background:pal.parchm,borderRadius:"11px",padding:"0.75rem 0.9rem",whiteSpace:"pre-wrap"}}>{entry.note.replace("AI Summary: ","").trim()}</div>
          </div>
        )}

        {/* Subjects covered (day notes) */}
        {entry.subjects&&entry.subjects.length>0&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>Subjects Covered</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
              {entry.subjects.map(s=>(
                <span key={s} style={{fontSize:"0.72rem",padding:"0.15rem 0.55rem",background:cp.c1+"18",borderRadius:"20px",color:cp.c1,fontWeight:"700"}}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {entry.aiSummary&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>🤖 AI Summary</div>
            <div style={{fontSize:"0.82rem",color:pal.inkM,lineHeight:1.7,background:pal.pale,borderRadius:"11px",padding:"0.7rem 0.85rem",fontStyle:"italic"}}>{entry.aiSummary}</div>
          </div>
        )}

        {/* Photos */}
        {entry.photos&&entry.photos.length>0&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.45rem"}}>📷 Photos ({entry.photos.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
              {entry.photos.map((src,i)=>(
                <div key={i} style={{aspectRatio:"1",borderRadius:"10px",overflow:"hidden",border:`1.5px solid ${pal.stone}30`}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.subj&&entry.subj!=="Daily Note"&&entry.subj!=="Daily Check-In"&&!entry.isDay&&(
          <button onClick={()=>{
            const ch = family.children[entry.childIdx];
            const apiKey=(()=>{try{return localStorage.getItem("rootbloom_apikey")||"";}catch(e){return "";}})();
            if(!apiKey){if(window.confirm("No API key found. Go to Settings → AI to add one?")) document.querySelector && [...document.querySelectorAll("button")].find(b=>b.textContent.includes("Settings"))?.click(); return;}
            const win=window.open("","_blank","width=500,height=600");
            if(!win)return;
            win.document.write("<div style='font-family:Georgia,serif;padding:1.5rem'><h2 style='color:#2d6a3f'>✨ Building lesson...</h2></div>");
            buildTomorrowsLesson({entry, child:ch, family})
              .then(t=>{ win.document.body.innerHTML="<div style='font-family:Georgia,serif;padding:1.5rem;line-height:1.8'>"+t.replace(/\n/g,"<br>")+"<br><br><button onclick='window.print()' style='padding:0.6rem 1.2rem;background:#2d6a3f;color:#fff;border:none;border-radius:8px;cursor:pointer'>🖨️ Print</button></div>"; })
              .catch(()=>{ win.document.body.innerHTML="<p style='padding:1rem'>Error. Try again.</p>"; });
          }}
          style={{width:"100%",padding:"0.7rem",border:`1.5px solid ${pal.primary}40`,borderRadius:"13px",background:pal.pale,color:pal.primary,fontWeight:"700",fontSize:"0.84rem",cursor:"pointer",marginTop:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"}}>
            <span>{"✨"}</span>
            <span>{"Build Tomorrow's Lesson"}</span>
          </button>
        )}
        <button onClick={onClose}
          style={{width:"100%",padding:"0.8rem",border:"none",borderRadius:"13px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer",marginTop:"0.5rem"}}>
          Done
        </button>
      </div>
    </div>
  );
}



/* ---- State Reminder ---- */
function AddBookModal({pal, family, childIdx, onClose, onSave}) {
  const CHILD_COLORS2 = ["#e8943a","#4aabcf","#9b6fc8","#44aa66","#e85a7a"];
  const [selChild, setSelChild] = useState(childIdx||0);
  const [title,    setTitle]    = useState("");
  const [author,   setAuthor]   = useState("");
  const [note,     setNote]     = useState("");
  const todayISO = new Date().toISOString().slice(0,10);
  const [finishDate, setFinishDate] = useState(todayISO);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    const dateLabel = finishDate
      ? new Date(finishDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})
      : new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
    onSave({
      childIdx: selChild,
      title: title.trim(),
      subj: "Reading",
      date: dateLabel,
      thumb: "\uD83D\uDCDA",
      note: note.trim()||(author.trim()?"by "+author.trim():""),
      readingTitle: title.trim(),
      isReading: true,
    });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.75)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"90vh",display:"flex",flexDirection:"column",animation:"slideUp 0.26s ease"}}>

        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        <div style={{background:pal.heroGrad,padding:"0.9rem 1.2rem",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{"\uD83D\uDCDA Log a Book"}</div>
            <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",marginTop:"2px"}}>Add to your reading list</div>
          </div>
          <button onClick={onClose}
            style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:"9px",padding:"0.3rem 0.65rem",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>
            {"\u2715"}
          </button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {family.children.length>1&&(
            <div style={{marginBottom:"1rem"}}>
              <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.45rem"}}>Who read this?</div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {family.children.map((c,i)=>{
                  const cc=CHILD_COLORS2[i%CHILD_COLORS2.length];
                  const sel=selChild===i;
                  return (
                    <button key={c.id} onClick={()=>setSelChild(i)}
                      style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.32rem 0.75rem",borderRadius:"20px",border:`2px solid ${sel?cc:pal.stone+"50"}`,background:sel?cc+"22":"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                      <span style={{fontSize:"1rem"}}>{c.avatar}</span>
                      <span style={{fontSize:"0.78rem",fontWeight:sel?"700":"400",color:sel?cc:pal.slate}}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>{"Book Title *"}</div>
            <input value={title} onChange={e=>setTitle(e.target.value)}
              placeholder={"e.g. Charlotte\u2019s Web, The BFG, Little House on the Prairie\u2026"}
              autoFocus
              style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Author (optional)</div>
            <input value={author} onChange={e=>setAuthor(e.target.value)}
              placeholder={"e.g. E.B. White"}
              style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Date Finished</div>
            <input type="date" value={finishDate} onChange={e=>setFinishDate(e.target.value)}
              style={{width:"100%",padding:"0.55rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          <div style={{marginBottom:"0.5rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Notes (optional)</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)}
              placeholder={"e.g. Loved this one! Great for reading comprehension."}
              rows={3}
              style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.55}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>
        </div>

        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}40`,background:pal.linen,flexShrink:0,display:"flex",gap:"0.5rem"}}>
          <button onClick={onClose}
            style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!canSave}
            style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:canSave?pal.heroGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:canSave?"pointer":"default"}}>
            {"Save Book \u2713"}
          </button>
        </div>

      </div>
    </div>
  );
}

function AddExtraModal({pal, family, onClose, onSave}) {
  const fileRef = useRef(null);
  const CHILD_COLORS2 = ["#e8943a","#4aabcf","#9b6fc8","#44aa66","#e85a7a"];

  // Which children participated
  const [selChildren, setSelChildren] = useState(
    new Set(family.children.map((_,i)=>i))
  );
  const toggleChild = (i) => setSelChildren(prev=>{
    const n = new Set(prev);
    if(n.has(i) && n.size>1) n.delete(i); else n.add(i);
    return n;
  });

  // Activity details
  const [activity,  setActivity]  = useState("");
  const [category,  setCategory]  = useState("");
  const [duration,  setDuration]  = useState("");
  const [note,      setNote]      = useState("");
  const [photos,    setPhotos]    = useState([]);
  const todayISO = new Date().toISOString().slice(0,10);
  const [entryDate, setEntryDate] = useState(todayISO);

  // Build activity list from family extracurriculars + presets
  const familyExtras = [
    ...(family.extracurriculars||[]).filter(e=>e!=="None right now"),
    ...(family.customExtracurriculars||[]),
  ];
  const PRESET_CATEGORIES = [
    {label:"Sports",       icon:"🏃"},
    {label:"Music",        icon:"🎵"},
    {label:"Art",          icon:"🎨"},
    {label:"Dance",        icon:"💃"},
    {label:"Theater",      icon:"🎭"},
    {label:"Scouting",     icon:"⚜️"},
    {label:"Martial Arts", icon:"🥋"},
    {label:"Club",         icon:"🏅"},
    {label:"Field Trip",   icon:"🚌"},
    {label:"Volunteer",    icon:"🤎"},
    {label:"Other",        icon:"⭐"},
  ];
  const allCategories = [
    ...familyExtras.map(e=>({label:e, icon:"🏆"})),
    ...PRESET_CATEGORIES.filter(p=>!familyExtras.includes(p.label)),
  ];

  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(file=>{
      const reader = new FileReader();
      reader.onload = ev => setPhotos(p=>[...p,{name:file.name,dataUrl:ev.target.result}]);
      reader.readAsDataURL(file);
    });
  };

  const canSave = activity.trim().length > 0;

  const handleSave = () => {
    const today = entryDate
      ? new Date(entryDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})
      : new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
    const cat = category||activity;
    const entries = [...selChildren].map(ci=>{
      const icon = allCategories.find(c=>c.label===cat)?.icon||"🏆";
      return {
        childIdx: ci,
        title: activity.trim(),
        subj: "Extracurricular",
        date: today,
        thumb: icon,
        note: note.trim(),
        duration: duration||null,
        category: cat,
        photos: photos.map(p=>p.dataUrl),
        isExtra: true,
      };
    });
    onSave(entries);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,10,4,0.75)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"90vh",display:"flex",flexDirection:"column",animation:"slideUp 0.26s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{background:pal.heroGrad,padding:"0.9rem 1.2rem",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{"🏆 Log Extracurricular"}</div>
            <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",marginTop:"2px"}}>Sports, music, clubs, field trips, and more</div>
          </div>
          <button onClick={onClose}
            style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:"9px",padding:"0.3rem 0.65rem",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>
            {"✕"}
          </button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {/* Who participated */}
          {family.children.length>1&&(
            <div style={{marginBottom:"1rem"}}>
              <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.45rem"}}>Who participated?</div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {family.children.map((c,i)=>{
                  const cc=CHILD_COLORS2[i%CHILD_COLORS2.length];
                  const sel=selChildren.has(i);
                  return (
                    <button key={c.id} onClick={()=>toggleChild(i)}
                      style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.32rem 0.75rem",borderRadius:"20px",border:`2px solid ${sel?cc:pal.stone+"50"}`,background:sel?cc+"22":"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                      <span style={{fontSize:"1rem"}}>{c.avatar}</span>
                      <span style={{fontSize:"0.78rem",fontWeight:sel?"700":"400",color:sel?cc:pal.slate}}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category chips */}
          <div style={{marginBottom:"0.85rem"}}>
            {familyExtras.length>0&&(
              <>
                <div style={{fontSize:"0.7rem",fontWeight:"700",color:pal.primary,marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                  {"🌟 Your Activities (from setup)"}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.55rem"}}>
                  {familyExtras.map(e=>{
                    const sel=category===e;
                    return (
                      <button key={e} onClick={()=>{setCategory(sel?"":e);if(!sel&&!activity.trim())setActivity(e);}}
                        style={{display:"flex",alignItems:"center",gap:"0.28rem",padding:"0.32rem 0.75rem",borderRadius:"20px",border:`2px solid ${sel?pal.primary:pal.primary+"40"}`,background:sel?pal.pale:pal.pale+"80",cursor:"pointer",transition:"all 0.12s"}}>
                        <span style={{fontSize:"0.85rem"}}>{"🏆"}</span>
                        <span style={{fontSize:"0.74rem",fontWeight:sel?"800":"600",color:sel?pal.primary:pal.inkM}}>{e}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{fontSize:"0.7rem",fontWeight:"700",color:pal.slate,marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>{"Or choose another"}</div>
              </>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
              {PRESET_CATEGORIES.filter(p=>!familyExtras.includes(p.label)).map(c=>{
                const sel=category===c.label;
                return (
                  <button key={c.label} onClick={()=>setCategory(sel?"":c.label)}
                    style={{display:"flex",alignItems:"center",gap:"0.28rem",padding:"0.28rem 0.65rem",borderRadius:"20px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",transition:"all 0.12s"}}>
                    <span style={{fontSize:"0.85rem"}}>{c.icon}</span>
                    <span style={{fontSize:"0.74rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM}}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity name */}
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>
              {"Activity / Event *"}
            </div>
            <input
              value={activity}
              onChange={e=>setActivity(e.target.value)}
              placeholder={"e.g. Soccer practice, Piano recital, Museum field trip..."}
              autoFocus
              style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          {/* Duration */}
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Duration (optional)</div>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
              {["30 min","45 min","1 hour","1.5 hrs","2 hrs","2.5 hrs","3 hrs","All day"].map(d=>(
                <button key={d} onClick={()=>setDuration(duration===d?"":d)}
                  style={{padding:"0.28rem 0.65rem",borderRadius:"20px",border:`2px solid ${duration===d?pal.primary:pal.stone+"50"}`,background:duration===d?pal.pale:"transparent",cursor:"pointer",fontSize:"0.74rem",fontWeight:duration===d?"700":"400",color:duration===d?pal.primary:pal.inkM,transition:"all 0.12s"}}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Date</div>
            <input type="date" value={entryDate} onChange={e=>setEntryDate(e.target.value)}
              style={{width:"100%",padding:"0.55rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          {/* Notes */}
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Notes (optional)</div>
            <textarea
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder={"e.g. Scored first goal! Piano exam passed with distinction. Really enjoyed the science museum."}
              rows={3}
              style={{width:"100%",padding:"0.62rem 0.85rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.82rem",fontFamily:"inherit",background:pal.parchm,color:pal.ink,resize:"none",outline:"none",lineHeight:1.55}}
              onFocus={e=>e.target.style.borderColor=pal.primary}
              onBlur={e=>e.target.style.borderColor=pal.stone}
            />
          </div>

          {/* Photos */}
          <div style={{marginBottom:"0.5rem"}}>
            <div style={{fontSize:"0.74rem",fontWeight:"700",color:pal.inkM,marginBottom:"0.35rem"}}>Photos (optional)</div>
            <input type="file" ref={fileRef} accept="image/*" multiple onChange={handlePhoto} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()}
              style={{padding:"0.45rem 1rem",border:`2px dashed ${pal.primary}50`,borderRadius:"11px",background:"transparent",color:pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer",marginBottom:"0.55rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>
              <span>{"📷"}</span><span>Add photos</span>
            </button>
            {photos.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
                {photos.map((p,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:"10px",overflow:"hidden",border:`1.5px solid ${pal.stone}35`}}>
                    <img src={p.dataUrl} alt="" style={{width:"100%",height:"72px",objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>setPhotos(ps=>ps.filter((_,pi)=>pi!==i))}
                      style={{position:"absolute",top:"3px",right:"3px",width:"20px",height:"20px",borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",color:"#fff",fontSize:"0.65rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {"✕"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}40`,background:pal.linen,flexShrink:0,display:"flex",gap:"0.5rem"}}>
          <button onClick={onClose}
            style={{padding:"0.7rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem"}}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!canSave}
            style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:canSave?pal.accentGrad:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:canSave?"pointer":"default"}}>
            {"Save to Portfolio ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WeeklyPacket({pal,family,child,entries,onBack}){
  const [generating, setGenerating] = useState(false);
  const [summary,    setSummary]    = useState(null);
  const [error,      setError]      = useState(null);

  const ch = family.children[child];
  const cp = CHILD_COLOR_PALETTES.find(p=>p.id===(ch?.colorId||"sunshine"))||CHILD_COLOR_PALETTES[0];
  const childEntries = entries.filter(e=>e.childIdx===child);

  // Get this week entries
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7);
  const weekEntries = childEntries.slice(0,20); // last 20 entries as proxy for the week

  const weekOf = now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const schoolName = family.schoolName || (family.familyName+" Academy") || "Home School";

  const generateSummary = async () => {
    if(weekEntries.length===0){setError("No entries yet! Complete some check-ins first.");return;}
    setGenerating(true); setError(null);
    const entriesList = weekEntries.map(e=>"- "+e.subj+": "+e.title+(e.note?" ("+e.note+")":"")).join("\n");
    const approach = (family.curriculumStyle||[]).join(", ")||"eclectic";
    const prompt = "You are a homeschool portfolio assistant. Write a warm, professional 2-paragraph narrative summary for a weekly portfolio packet.\n\n"
      + "Student: "+(ch?.name||"Student")+", "+(ch?.grade||"elementary")+" grade\n"
      + "School: "+schoolName+"\n"
      + "Learning approach: "+approach+"\n"
      + "Week of: "+weekOf+"\n\n"
      + "Activities this week:\n"+entriesList+"\n\n"
      + "Write: 1) A 2-3 sentence narrative describing what the student learned, warmly written for a state portfolio review. "
      + "2) A 1-2 sentence reflection on their growth. "
      + "Under 120 words total. No bullet points."

    try {
      const weekSummaryKey = (() => { try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
      if(!weekSummaryKey) { setError("Add an API key in Settings to use AI features."); return; }
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":weekSummaryKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("")||"";
      if(!text) throw new Error("empty");
      setSummary(text);
    } catch(e){
      setError("Could not generate summary. Check your connection and try again.");
    }
    setGenerating(false);
  };

  // Group entries by subject
  const bySubject = {};
  weekEntries.forEach(e=>{
    if(!bySubject[e.subj]) bySubject[e.subj]=[];
    bySubject[e.subj].push(e);
  });

  return (
    <div style={{animation:"fadeUp 0.22s ease",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,padding:"1rem 1.1rem",display:"flex",alignItems:"center",gap:"0.75rem",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"9px",padding:"0.3rem 0.7rem",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>Back</button>
        <div style={{flex:1}}>
          <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{ch?.avatar} {ch?.name} — Weekly Packet</div>
          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.75)"}}>Week of {weekOf}</div>
        </div>
        <button onClick={()=>window.print()} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"9px",padding:"0.3rem 0.7rem",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:"pointer"}}>🖨 Print</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1rem"}}>

        {/* Page 1: Cover + Summary */}
        <div style={{background:pal.linen,borderRadius:"18px",padding:"1.2rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}35`}} id="packet-page1">
          {/* School header */}
          <div style={{borderBottom:`2px solid ${cp.c1}40`,paddingBottom:"0.75rem",marginBottom:"0.85rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{fontWeight:"900",color:cp.c1,fontSize:"1rem"}}>{schoolName}</div>
              <div style={{fontSize:"0.7rem",color:pal.slate}}>{family.state} · {family.parentName}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"0.65rem",color:pal.slate,fontWeight:"600"}}>WEEKLY PORTFOLIO</div>
              <div style={{fontSize:"0.68rem",fontWeight:"700",color:pal.inkM}}>Week of {weekOf}</div>
            </div>
          </div>

          {/* Student info */}
          <div style={{display:"flex",alignItems:"center",gap:"0.85rem",marginBottom:"1rem"}}>
            <div style={{width:"54px",height:"54px",borderRadius:"14px",background:`linear-gradient(135deg,${cp.c1},${cp.c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",flexShrink:0}}>{ch?.avatar}</div>
            <div>
              <div style={{fontWeight:"900",color:pal.ink,fontSize:"1.1rem"}}>{ch?.name}</div>
              <div style={{fontSize:"0.76rem",color:pal.slate}}>{ch?.grade} · {weekEntries.length} activities this week</div>
            </div>
          </div>

          {/* AI Summary section */}
          <div style={{background:pal.sand,borderRadius:"13px",padding:"0.9rem 1rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}35`}}>
            <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.5rem"}}>Weekly Narrative</div>
            {summary ? (
              <div style={{fontSize:"0.82rem",color:pal.ink,lineHeight:1.75}}>{summary}</div>
            ) : generating ? (
              <div style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.5rem 0"}}>
                {[0,1,2].map(i=><div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:cp.c1,animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}
                <span style={{fontSize:"0.78rem",color:pal.slate}}>Writing summary...</span>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:"0.5rem 0"}}>
                <div style={{fontSize:"0.78rem",color:pal.slate,marginBottom:"0.65rem"}}>{weekEntries.length===0?"Add some check-ins first to generate a summary.":"Generate an AI-written narrative summary of this week."}</div>
                {error && <div style={{fontSize:"0.74rem",color:"#a03030",marginBottom:"0.5rem"}}>{error}</div>}
                <button onClick={generateSummary} disabled={weekEntries.length===0||generating}
                  style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"11px",background:weekEntries.length>0?`linear-gradient(135deg,${cp.c1},${cp.c2})`:"#ccc",color:"#fff",fontWeight:"800",fontSize:"0.8rem",cursor:weekEntries.length>0?"pointer":"default"}}>
                  Generate with AI
                </button>
              </div>
            )}
            {summary && (
              <button onClick={()=>{setSummary(null);generateSummary();}} style={{marginTop:"0.5rem",background:"transparent",border:"none",color:pal.slate,fontSize:"0.68rem",cursor:"pointer",fontWeight:"600"}}>Regenerate</button>
            )}
          </div>

          {/* Subject list */}
          <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.5rem"}}>Subjects Covered</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
            {Object.keys(bySubject).map(s=>(
              <span key={s} style={{padding:"0.22rem 0.65rem",background:`${cp.c1}22`,borderRadius:"20px",fontSize:"0.74rem",fontWeight:"700",color:cp.c1,border:`1.5px solid ${cp.c1}40`}}>{s} ({bySubject[s].length})</span>
            ))}
            {Object.keys(bySubject).length===0&&<span style={{fontSize:"0.78rem",color:pal.slate}}>No entries yet</span>}
          </div>
        </div>

        {/* Page 2: Activity log */}
        <div style={{background:pal.linen,borderRadius:"18px",padding:"1.2rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
          <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.9rem",marginBottom:"0.85rem",paddingBottom:"0.55rem",borderBottom:`2px solid ${cp.c1}30`}}>
            Activity Log
          </div>
          {weekEntries.length===0 ? (
            <div style={{textAlign:"center",padding:"1.5rem 0",color:pal.slate,fontSize:"0.82rem"}}>No entries yet. Complete check-ins to fill this page!</div>
          ) : weekEntries.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:"0.7rem",alignItems:"flex-start",padding:"0.6rem 0",borderTop:i>0?`1px solid ${pal.stone}30`:"none"}}>
              <div style={{width:"34px",height:"34px",borderRadius:"9px",background:`${cp.c1}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{e.thumb||"📋"}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.83rem"}}>{e.title}</div>
                <div style={{fontSize:"0.68rem",color:pal.slate}}>{e.subj} · {e.date}</div>
                {e.note&&<div style={{fontSize:"0.75rem",color:pal.inkM,marginTop:"2px",lineHeight:1.5,fontStyle:"italic"}}>{e.note}</div>}
              </div>
            </div>
          ))}
          {/* Signature line */}
          <div style={{marginTop:"1.5rem",paddingTop:"1rem",borderTop:`1px solid ${pal.stone}40`,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div style={{flex:1}}>
              <div style={{borderBottom:`1px solid ${pal.inkM}`,marginBottom:"4px",width:"140px",height:"24px"}}/>
              <div style={{fontSize:"0.65rem",color:pal.slate}}>Parent/Teacher Signature</div>
            </div>
            <div style={{flex:1,textAlign:"right"}}>
              <div style={{borderBottom:`1px solid ${pal.inkM}`,marginBottom:"4px",width:"100px",height:"24px",marginLeft:"auto"}}/>
              <div style={{fontSize:"0.65rem",color:pal.slate}}>Date</div>
            </div>
          </div>
        </div>

      </div>
      <style>{`@media print{body{background:white}nav,button:not(#packet-page1 button){display:none!important}}`}</style>
    </div>
  );
}
function CoopSetupCard({pal,family,onSave,onCancel}){
  const [freq,        setFreq]       = useState(family.coopFreq||"Once a week");
  const [day,         setDay]        = useState(family.coopDay||"");
  const [time,        setTime]       = useState(family.coopTime||"");
  const [name,        setName]       = useState(family.coopName||"");
  const [kids,        setKids]       = useState(family.coopKids||(family.children||[]).map(c=>c.id));
  const [classes,     setClasses]    = useState(family.coopClasses||[]);
  const [classVal,    setClassVal]   = useState("");
  const [coopSubjects,setCoopSubjects] = useState(family.coopSubjects||[]);

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const TIMES = ["7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM"];
  const SUGGESTED = ["Bible / Faith","Art","Music","Physical Education","Science","History","Literature","Latin","Foreign Language","Drama","Debate","Writing","Math","Cooking","Nature Study"];

  const addClass = () => {
    const val = classVal.trim();
    if(!val||classes.includes(val)) return;
    setClasses(c=>[...c,val]);
    setClassVal("");
  };
  const toggleKid = (id) => setKids(k=>k.includes(id)?k.filter(x=>x!==id):[...k,id]);

  return (
    <div style={{background:pal.linen,borderRadius:"16px",padding:"1.1rem",marginBottom:"1rem",border:`1.5px solid ${pal.primary}30`}}>
      <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.9rem",marginBottom:"0.85rem"}}>{"🏫 Co-op Setup"}</div>

      <Lbl pal={pal}>Group name (optional)</Lbl>
      <Input pal={pal} value={name} onChange={setName} placeholder={"e.g. Classical Conversations, Umbrella Co-op..."} />
      <div style={{height:"0.65rem"}}/>

      <Lbl pal={pal}>Frequency</Lbl>
      <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginBottom:"0.65rem"}}>
        {COOP_FREQ.filter(f=>f!=="We don't do co-op").map(f=>(
          <button key={f} onClick={()=>setFreq(f)}
            style={{padding:"0.5rem 0.85rem",border:`2px solid ${freq===f?pal.primary:pal.stone+"50"}`,borderRadius:"10px",background:freq===f?pal.pale:"transparent",cursor:"pointer",textAlign:"left",fontWeight:freq===f?"700":"400",color:freq===f?pal.primary:pal.inkM,fontSize:"0.82rem"}}>
            {f}
          </button>
        ))}
      </div>

      <Lbl pal={pal}>Meeting day</Lbl>
      <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
        {DAYS.map(d=>(
          <button key={d} onClick={()=>setDay(d)}
            style={{padding:"0.32rem 0.65rem",borderRadius:"20px",border:`2px solid ${day===d?pal.primary:pal.stone+"50"}`,background:day===d?pal.pale:"transparent",cursor:"pointer",fontSize:"0.76rem",fontWeight:day===d?"700":"400",color:day===d?pal.primary:pal.inkM}}>
            {d}
          </button>
        ))}
      </div>

      <Lbl pal={pal}>Start time</Lbl>
      <select value={time} onChange={e=>setTime(e.target.value)}
        style={{width:"100%",padding:"0.52rem 0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",fontSize:"0.83rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit",marginBottom:"0.65rem"}}>
        <option value="">Select a time...</option>
        {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
      </select>

      {(family.children||[]).length>1&&(
        <>
          <Lbl pal={pal}>Which children attend?</Lbl>
          <div style={{display:"flex",gap:"0.38rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
            {(family.children||[]).map(c=>{
              const sel=kids.includes(c.id);
              return (
                <button key={c.id} onClick={()=>toggleKid(c.id)}
                  style={{padding:"0.32rem 0.7rem",borderRadius:"20px",border:`2px solid ${sel?pal.primary:pal.stone+"50"}`,background:sel?pal.pale:"transparent",cursor:"pointer",fontSize:"0.8rem",fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,display:"flex",alignItems:"center",gap:"0.3rem"}}>
                  <span>{c.avatar}</span><span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <Lbl pal={pal}>Classes covered</Lbl>
      <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
        {SUGGESTED.filter(s=>!classes.includes(s)).slice(0,8).map(s=>(
          <button key={s} onClick={()=>setClasses(c=>[...c,s])}
            style={{padding:"0.2rem 0.5rem",borderRadius:"20px",border:`1.5px solid ${pal.stone+"60"}`,background:"transparent",cursor:"pointer",fontSize:"0.7rem",color:pal.inkM}}>
            {"+ "+s}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.45rem"}}>
        <input value={classVal} onChange={e=>setClassVal(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addClass()}
          placeholder="Add a class..."
          style={{flex:1,padding:"0.48rem 0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"10px",fontSize:"0.8rem",background:pal.parchm,color:pal.ink,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=pal.primary}
          onBlur={e=>e.target.style.borderColor=pal.stone}/>
        <button onClick={addClass}
          style={{padding:"0.48rem 0.8rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.78rem",cursor:"pointer"}}>
          Add
        </button>
      </div>
      {classes.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"0.75rem"}}>
          {classes.map(c=>(
            <div key={c} style={{display:"flex",alignItems:"center",gap:"0.28rem",padding:"0.22rem 0.55rem 0.22rem 0.65rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`}}>
              <span style={{fontSize:"0.73rem",fontWeight:"700",color:pal.primary}}>{c}</span>
              <button onClick={()=>setClasses(cs=>cs.filter(x=>x!==c))}
                style={{width:"15px",height:"15px",borderRadius:"50%",background:pal.primary+"30",border:"none",color:pal.primary,fontSize:"0.58rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",flexShrink:0}}>
                {"✕"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Co-op subjects — which regular subjects happen at co-op */}
      {day&&(()=>{
        const allSubjOpts = [...SUBJECT_OPTIONS,...(family.customSubjects||[])];
        const activeSubjIds = family.subjects||[];
        const activeSubjs = activeSubjIds.map(id=>allSubjOpts.find(s=>s.id===id)).filter(Boolean);
        if(activeSubjs.length===0) return null;
        return (
          <div style={{marginBottom:"0.75rem"}}>
            <Lbl pal={pal}>Which subjects do you do at co-op?</Lbl>
            <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.45rem"}}>{"These will appear on your schedule on co-op day instead of your regular subjects."}</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
              {activeSubjs.map(s=>{
                const sel = coopSubjects.includes(s.id);
                return (
                  <button key={s.id} onClick={()=>setCoopSubjects(cs=>sel?cs.filter(x=>x!==s.id):[...cs,s.id])}
                    style={{display:"flex",gap:"0.5rem",alignItems:"center",padding:"0.38rem 0.55rem",border:`1.5px solid ${sel?pal.primary:pal.stone+"40"}`,borderRadius:"8px",background:sel?pal.pale:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                    <span style={{fontSize:"0.85rem",width:"18px",textAlign:"center",flexShrink:0}}>{s.icon}</span>
                    <span style={{flex:1,fontWeight:sel?"700":"400",color:sel?pal.primary:pal.inkM,fontSize:"0.78rem"}}>{s.label}</span>
                    <div style={{width:"15px",height:"15px",borderRadius:"4px",border:`2px solid ${sel?pal.primary:pal.stone}`,background:sel?pal.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {sel&&<span style={{color:"#fff",fontSize:"0.6rem",fontWeight:"900"}}>{"✓"}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {coopSubjects.length===0&&<div style={{fontSize:"0.65rem",color:pal.slate,marginTop:"0.35rem",fontStyle:"italic"}}>{"None selected — leave empty if co-op classes are separate from your regular subjects."}</div>}
          </div>
        );
      })()}

      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
        <button onClick={onCancel}
          style={{padding:"0.6rem 1rem",border:`2px solid ${pal.stone}`,borderRadius:"11px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.82rem",cursor:"pointer"}}>
          Cancel
        </button>
        <button onClick={()=>onSave({coopFreq:freq,coopDay:day,coopTime:time,coopName:name,coopKids:kids,coopClasses:classes,coopSubjects})}
          style={{flex:1,padding:"0.6rem",border:"none",borderRadius:"11px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.84rem",cursor:"pointer"}}>
          Save Co-op Info
        </button>
      </div>
    </div>
  );
}

function CatchupModal({ pal, family, days, needed, onClose }) {
  const stateRequired = parseInt((getStateInfo(family.state||"").hours||"180").match(/\d+/)?.[0]||"180");
  const NEEDED     = needed||stateRequired;
  const remaining  = Math.max(0, NEEDED - days);
  const weeksLeft  = (() => {
    if(!family.yearEnd) return 11;
    const end = new Date(family.yearEnd), now = new Date();
    return Math.max(1, Math.ceil((end-now)/(7*24*60*60*1000)));
  })();
  const daysPerWk  = Math.ceil(remaining / weeksLeft);
  const extraPerWk = Math.max(0, daysPerWk - 5);
  const [plan, setPlan] = useState(null); // null | "light" | "medium" | "steady"

  const PLANS = [
    {
      id:"steady",
      icon:"🌿",
      title:"Steady & Consistent",
      desc:`School 5 days/week with no breaks - you'll finish right on time.`,
      wks:weeksLeft, extra:0, color:pal.good, bg:pal.goodBg,
      steps:[
        "Keep your current daily schedule going",
        "Aim for zero unplanned absences this term",
        "Use make-up Saturdays only if needed",
      ],
    },
    {
      id:"medium",
      icon:"",
      title:"Light Catch-Up",
      desc:`Add one extra morning session per week - gentle but effective.`,
      wks:weeksLeft-1, extra:1, color:pal.warn, bg:pal.warnBg,
      steps:[
        "Add a 2-hour Friday afternoon session each week",
        "Use summer week if needed as backup",
        "Keep weekends free - you've earned it",
      ],
    },
    {
      id:"light",
      icon:"!",
      title:"Sprint to Finish",
      desc:`School 6 days/week for a few weeks - done early with time to spare.`,
      wks:weeksLeft-2, extra:2, color:pal.primary, bg:pal.pale,
      steps:[
        "Add Saturday school for 4-5 weeks",
        "Double up one subject block daily",
        "Build in a free week as reward at the end",
      ],
    },
  ];

  const selected = plan ? PLANS.find(p=>p.id===plan) : null;

  return (
    <BottomSheet pal={pal} onClose={onClose} title="📅 Your Catch-Up Plan" sub={remaining + " days to go - " + weeksLeft + " weeks left"} tall>
      {/* Warm opener */}
      <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1.1rem",marginBottom:"1.1rem",border:`2px solid ${pal.primary}18`}}>
        <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>
          {"You're doing better than you think 💚"}
        </div>
        <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.7}}>
          {days} {" days logged is real, meaningful schoolwork. You have "} {weeksLeft} {" weeks left and "} {remaining} {" days to go - that's completely achievable with any of these paths."}
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
              <span style={{color:p.color,fontSize:"1.1rem",flexShrink:0,marginTop:"4px"}}>></span>
            </button>
          ))}
        </div>
      </>)}

      {/* Selected plan detail */}
      {selected && (
        <div style={{animation:"fadeUp 0.2s ease"}}>
          <button onClick={()=>setPlan(null)} style={{display:"flex",alignItems:"center",gap:"0.35rem",background:"transparent",border:"none",color:pal.primary,cursor:"pointer",fontSize:"0.78rem",fontWeight:"700",marginBottom:"0.85rem",padding:0}}>
            Back to plans
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
                    <div style={{width:"100%",aspectRatio:"1",borderRadius:"8px",background:active?pal.accentGrad:pal.parchm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"800",color:active?"#fff":pal.stone,marginBottom:"3px"}}>{active?"v":"-"}</div>
                    <div style={{fontSize:"0.58rem",color:active?pal.primary:pal.stone,fontWeight:active?"700":"400"}}>{d}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.7,marginBottom:"1rem",textAlign:"center",fontStyle:"italic"}}>
            {"Remember: consistency beats intensity. Even if you miss a day, you'll still be making progress."}
          </div>
          <button onClick={onClose} style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:pal.onDark,fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
            {"Got it - let's do this! 🌱"}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}


/* =======================================
   FIRST-VISIT CONTEXTUAL HINTS
   Slim pill badge on first visit per
   screen. Pulses once, tap to dismiss.
======================================= */
const TIPS = {
  home:        {text:"Tap Log Today to start your first school day", pulse:"down"},
  schedule:    {text:"Tap any block to check it off — finish the day with the button below", pulse:"down"},
  portfolio:   {text:"Log Today walks through subjects step by step", pulse:"down"},
  attendance:  {text:"Use Sync in the Daily Ledger to auto-fill from your portfolio", pulse:"down"},
  learn:       {text:"Tap AI Build to generate a unit study for any topic", pulse:"down"},
  transcripts: {text:"Print your official transcript anytime from the Transcript tab", pulse:"down"},
  goals:       {text:"Goals shape your daily nudges and AI suggestions — totally optional", pulse:"down"},
  coop:        {text:"Log Session saves directly to each child's portfolio", pulse:"down"},
};
const TIPS_KEY = "rootbloom_tips_seen";
