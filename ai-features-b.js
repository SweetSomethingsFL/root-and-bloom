
function KidQuizModal({child, family, subjLabel, subjIcon, grade, todayEntries, allTodayEntries, c1, c2, onSaveResult, onClose}) {
  const [phase,    setPhase]    = React.useState("loading"); // loading|quiz|results|error
  const [questions,setQuestions]= React.useState([]);
  const [current,  setCurrent]  = React.useState(0);
  const [answers,  setAnswers]  = React.useState([]); // {q, chosen, correct, correctAnswer}
  const [typed,    setTyped]    = React.useState("");
  const [feedback, setFeedback] = React.useState(null); // null|"correct"|"wrong"

  const heroGrad = `linear-gradient(135deg,${c1},${c2})`;

  // Grade group: early (K-2), mid (3-5), upper (6-8), high (9-12)
  const gradeNum = parseInt((grade||"3rd").replace(/\D/g,""))||3;
  const gradeGroup = gradeNum<=2?"early":gradeNum<=5?"mid":gradeNum<=8?"upper":"high";

  // Build context from today's notes for this subject
  const lessonContext = React.useMemo(()=>{
    const notes = todayEntries.map(e=>e.note||e.title||"").filter(Boolean).join(". ");
    const allNotes = allTodayEntries.map(e=>e.note||"").filter(Boolean).join(". ");
    return notes || allNotes || "General "+subjLabel+" lesson";
  }, [todayEntries, allTodayEntries, subjLabel]);

  React.useEffect(()=>{
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setPhase("loading");
    try {
      const gradeDesc = gradeGroup==="early"?"K-2nd grade (ages 5-8), keep it very simple, fun and encouraging":
        gradeGroup==="mid"?"3rd-5th grade (ages 8-11), moderate challenge":
        gradeGroup==="upper"?"6th-8th grade (ages 11-14), more analytical":
        "9th-12th grade (ages 14-18), rigorous and thoughtful";

      const prompt = `You are a fun, encouraging homeschool tutor generating a quick quiz for a ${grade} student.

Subject: ${subjLabel}
Grade: ${grade} (${gradeDesc})
What was covered today: ${lessonContext}

Generate exactly 3 quiz questions based on what was actually covered today.
Make questions directly tied to the lesson content above - not generic subject questions.
For K-2: use very simple yes/no or one-word answers with big clear options.
For 3-5: use 4-option multiple choice.
For 6-8: mix of multiple choice and one short-answer question.
For 9-12: deeper analysis, can include one short-answer.

Respond ONLY with valid JSON, no markdown, no explanation:
{"questions":[{"q":"question text","type":"mc","options":["A","B","C","D"],"answer":"A","explanation":"brief why"},...]}
For short-answer type: {"q":"...","type":"sa","answer":"expected answer","explanation":"..."}
For true/false: {"q":"...","type":"tf","options":["True","False"],"answer":"True","explanation":"..."}`;

      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      if(!parsed.questions||!Array.isArray(parsed.questions)) throw new Error("bad format");
      setQuestions(parsed.questions);
      setPhase("quiz");
    } catch(err) {
      if(err.message==="NO_KEY") setPhase("nokey");
      else setPhase("error");
    }
  };

  const handleAnswer = (chosen) => {
    const q = questions[current];
    const isCorrect = q.type==="sa"
      ? chosen.trim().toLowerCase().includes(q.answer.toLowerCase().split(" ")[0])
      : chosen===q.answer;
    setFeedback(isCorrect?"correct":"wrong");
    setTimeout(()=>{
      setAnswers(prev=>[...prev,{q:q.q,chosen,correct:isCorrect,correctAnswer:q.answer,explanation:q.explanation}]);
      setFeedback(null);
      setTyped("");
      if(current+1>=questions.length) {
        setPhase("results");
      } else {
        setCurrent(c=>c+1);
      }
    }, isCorrect?800:1400);
  };

  const score = answers.filter(a=>a.correct).length;
  const missed = answers.filter(a=>!a.correct).map(a=>a.q.slice(0,40));

  const GRADE_ENCOURAGEMENT = [
    "Amazing work! Keep going! [star]",
    "You're doing great! \u1f389",
    "Nice job! Every quiz makes you smarter! [rocket]",
  ];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Comic Sans MS','Chalkboard SE',cursive"}}>
      <div style={{background:SK.cream,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease"}}>

        {/* Header */}
        <div style={{background:heroGrad,padding:"0.85rem 1.2rem",borderRadius:"28px 28px 0 0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"1.4rem"}}>{subjIcon}</span>
              <div>
                <div style={{fontWeight:"900",color:"#fff",fontSize:"0.95rem"}}>{subjLabel+" Challenge!"}</div>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.75)"}}>{grade+" \u00b7 based on today's lesson"}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:"28px",height:"28px",color:"#fff",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
          </div>
          {phase==="quiz"&&questions.length>0&&(
            <div style={{marginTop:"0.55rem"}}>
              <div style={{height:"4px",borderRadius:"99px",background:"rgba(255,255,255,0.25)",overflow:"hidden"}}>
                <div style={{height:"100%",width:((current/questions.length)*100)+"%",background:"rgba(255,255,255,0.85)",borderRadius:"99px",transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.7)",marginTop:"3px",textAlign:"right"}}>{current+1+" of "+questions.length}</div>
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1.2rem 1.2rem 1.5rem"}}>

          {/* Loading */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"2rem 1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem",animation:"bounce 1s ease infinite"}}>{"[think]"}</div>
              <div style={{fontWeight:"800",color:SK.ink,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Building your quiz..."}</div>
              <div style={{fontSize:"0.72rem",color:SK.lite}}>{"Making questions from today's lesson!"}</div>
            </div>
          )}

          {/* No API key */}
          {phase==="nokey"&&(
            <div style={{textAlign:"center",padding:"1.5rem 1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\u1f511"}</div>
              <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem",marginBottom:"0.3rem"}}>{"AI not set up yet"}</div>
              <div style={{fontSize:"0.72rem",color:SK.lite,lineHeight:1.6}}>{"Ask your parent to add an API key in Settings to unlock quizzes!"}</div>
            </div>
          )}

          {/* Error */}
          {phase==="error"&&(
            <div style={{textAlign:"center",padding:"1.5rem 1rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\u1f614"}</div>
              <div style={{fontWeight:"700",color:SK.ink,fontSize:"0.85rem",marginBottom:"0.5rem"}}>{"Couldn't make a quiz right now"}</div>
              <button onClick={generateQuiz} style={{padding:"0.5rem 1.2rem",border:"none",borderRadius:"12px",background:heroGrad,color:"#fff",fontWeight:"800",fontSize:"0.82rem",cursor:"pointer"}}>{"Try again"}</button>
            </div>
          )}

          {/* Active question */}
          {phase==="quiz"&&questions[current]&&(()=>{
            const q = questions[current];
            const opts = q.options||[];
            return (
              <div>
                <div style={{background:SK.card,borderRadius:"20px",padding:"1.1rem 1rem",marginBottom:"1rem",boxShadow:"0 2px 14px rgba(0,0,0,0.07)"}}>
                  <div style={{fontWeight:"900",color:SK.ink,fontSize:"0.92rem",lineHeight:1.5,marginBottom:"0.25rem"}}>{"\u1f4ad "+q.q}</div>
                </div>
                {/* Multiple choice / true-false */}
                {(q.type==="mc"||q.type==="tf")&&(
                  <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {opts.map((opt,oi)=>{
                      const isSelected = feedback!==null;
                      const isCorrect  = opt===q.answer;
                      const bg = !isSelected?"#fff":
                        isCorrect?"#e8f7ee":
                        opt===answers[answers.length]?.chosen?"#ffeaea":"#fff";
                      const border = !isSelected?SK.skyL:
                        isCorrect?"#2d9e5f":"#ddd";
                      return (
                        <button key={oi} onClick={()=>!feedback&&handleAnswer(opt)}
                          style={{padding:"0.75rem 1rem",border:"2.5px solid "+border,borderRadius:"16px",background:bg,fontFamily:"inherit",fontWeight:"700",fontSize:gradeGroup==="early"?"1rem":"0.85rem",color:SK.ink,cursor:feedback?"default":"pointer",textAlign:"left",transition:"all 0.2s"}}>
                          {gradeGroup!=="early"&&<span style={{color:c1,marginRight:"0.4rem"}}>{String.fromCharCode(65+oi)+"."}</span>}
                          {opt}
                          {isSelected&&isCorrect&&<span style={{float:"right"}}>{"\u2713"}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Short answer */}
                {q.type==="sa"&&(
                  <div>
                    <input value={typed} onChange={e=>setTyped(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&typed.trim()&&!feedback&&handleAnswer(typed)}
                      placeholder={"Type your answer..."}
                      style={{width:"100%",padding:"0.75rem",border:"2.5px solid "+c1+"50",borderRadius:"14px",fontSize:"0.9rem",fontFamily:"inherit",color:SK.ink,background:SK.skyL,outline:"none",marginBottom:"0.5rem"}}
                    />
                    <button onClick={()=>typed.trim()&&!feedback&&handleAnswer(typed)}
                      disabled={!typed.trim()||!!feedback}
                      style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"13px",background:typed.trim()?"linear-gradient(135deg,"+c1+","+c2+")":" #ddd",color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:typed.trim()?"pointer":"default"}}>{"Submit"}</button>
                  </div>
                )}
                {/* Feedback overlay */}
                {feedback&&(
                  <div style={{marginTop:"0.75rem",padding:"0.75rem 1rem",borderRadius:"14px",background:feedback==="correct"?"#e8f7ee":"#fff4e6",border:"2px solid "+(feedback==="correct"?"#2d9e5f":"#f5a442"),textAlign:"center"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:"2px"}}>{feedback==="correct"?"\u1f389":"[flex]"}</div>
                    <div style={{fontWeight:"800",color:feedback==="correct"?"#2d9e5f":"#e87a00",fontSize:"0.85rem"}}>{feedback==="correct"?"Correct!":"Not quite..."}</div>
                    {feedback==="wrong"&&questions[current]?.explanation&&(
                      <div style={{fontSize:"0.72rem",color:SK.ink,marginTop:"3px",lineHeight:1.5}}>{questions[current].explanation}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Results */}
          {phase==="results"&&(
            <div>
              <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.4rem",animation:"bounce 1.5s ease infinite"}}>
                  {score===questions.length?"[trophy]":score>=questions.length/2?"[star]":"[flex]"}
                </div>
                <div style={{fontWeight:"900",color:SK.ink,fontSize:"1.3rem"}}>{score+"/"+questions.length}</div>
                <div style={{fontSize:"0.8rem",color:SK.lite,marginTop:"3px"}}>
                  {score===questions.length
                    ?GRADE_ENCOURAGEMENT[0]
                    :score>=questions.length/2
                    ?GRADE_ENCOURAGEMENT[1]
                    :GRADE_ENCOURAGEMENT[2]}
                </div>
              </div>
              {/* Answer review */}
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1rem"}}>
                {answers.map((a,i)=>(
                  <div key={i} style={{background:SK.card,borderRadius:"14px",padding:"0.7rem 0.85rem",border:"1.5px solid "+(a.correct?"#2d9e5f40":"#f5a44240")}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:a.correct?"0":"0.3rem"}}>
                      <span style={{fontSize:"0.85rem"}}>{a.correct?"[ok]":"\u274c"}</span>
                      <span style={{fontSize:"0.75rem",fontWeight:"700",color:SK.ink,flex:1,lineHeight:1.4}}>{a.q}</span>
                    </div>
                    {!a.correct&&(
                      <div style={{fontSize:"0.7rem",color:"#b07800",marginLeft:"1.4rem"}}>{"Correct: "+a.correctAnswer}</div>
                    )}
                  </div>
                ))}
              </div>
              {/* Save to portfolio */}
              <button onClick={()=>onSaveResult({score,total:questions.length,missed,questions:answers,subject:subjLabel,grade})}
                style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"16px",background:heroGrad,color:"#fff",fontWeight:"900",fontSize:"0.92rem",cursor:"pointer",boxShadow:"0 4px 18px "+c1+"40",marginBottom:"0.5rem"}}>
                {"\u1f4ca Save results -> Progress"}
              </button>
              <button onClick={onClose}
                style={{width:"100%",padding:"0.5rem",border:"none",background:"transparent",color:SK.lite,fontSize:"0.76rem",cursor:"pointer"}}>{"Close"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================
   KID GOAL ONBOARDING
======================================= */

/* ----------------------------------------------------------
   FIELD STUDY MODAL
   Photo -> AI identifies subject -> fun facts + mini lesson
   + printable worksheet
   ---------------------------------------------------------- */
function FieldStudyModal({ pal, family, child, allEntries, onAddEntry, onClose, onComplete }) {
  const [phase,        setPhase]       = useState("capture");
  const [imageData,    setImageData]   = useState(null);
  const [imageMime,    setImageMime]   = useState("image/jpeg");
  const [result,       setResult]      = useState(null);
  const [webImageUrl,  setWebImageUrl] = useState(null);
  const [factIdx,      setFactIdx]     = useState(0);
  const [wsDeclined,   setWsDeclined]  = useState(false);
  const [wsWanted,     setWsWanted]    = useState(false);
  const [wsResult,     setWsResult]    = useState(null);
  const [wsLoading,    setWsLoading]   = useState(false);
  const [editNote,     setEditNote]    = useState("");
  const [saving,       setSaving]      = useState(false);
  const fileRef = React.useRef(null);
  const camRef  = React.useRef(null);

  const grade    = child ? (child.grade || "3rd") : "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child ? (child.name || "Student") : "Student";
  const isYoung  = gradeNum <= 3;
  const isMid    = gradeNum >= 4 && gradeNum <= 6;

  const familySubjects = React.useMemo(() => {
    const all = [...(SUBJECT_OPTIONS||[]), ...(family.customSubjects||[])];
    return (family.subjects||[]).map(id => all.find(s=>s.id===id)).filter(Boolean);
  }, [family]);

  const pastStudies = React.useMemo(() => {
    try {
      const childIdx = (family.children||[]).findIndex(c=>c.id===child?.id);
      return (allEntries||[]).filter(e=>e.isFieldStudy && e.childIdx===childIdx)
        .sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,20);
    } catch(e) { return []; }
  }, [child, family, allEntries]);

  const fetchWebImage = async (subject, category) => {
    try {
      const safeQuery = encodeURIComponent(
        (category==="plant"||category==="animal"||category==="insect"||category==="rock")
          ? ("educational " + subject + " nature photo child safe")
          : ("educational " + subject + " child safe")
      );
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:200,
          messages:[{role:"user",content:"Find a safe, age-appropriate educational image URL for a child learning about: "+subject+". Reply ONLY with a single direct image URL from a reputable educational source (Wikipedia, Wikimedia Commons, National Geographic, Smithsonian, NASA, NOAA). The URL must end in .jpg or .png. No other text."}]
        })
      });
      const data = await res.json();
      const text = (data.content||[]).find(c=>c.type==="text")?.text||"";
      const urlMatch = text.match(/https?:\/\/[^\s"<>]+\.(?:jpg|png)/i);
      if(urlMatch) setWebImageUrl(urlMatch[0]);
    } catch(e) { /* silently fail */ }
  };

  const analyzeImage = async (base64, mime) => {
    setImageData(base64);
    setImageMime(mime);
    setPhase("loading");
    setFactIdx(0);
    setWsDeclined(false);
    setWsWanted(false);
    setWsResult(null);
    setWebImageUrl(null);

    const gradeDesc = gradeNum<=2 ? "K-2nd grade: use very simple words, short sentences (5-8 words), concepts a 5-7 year old understands. Avoid scientific terms unless explained simply."
      : gradeNum<=3 ? "3rd grade: simple engaging language, relatable comparisons, 1-2 sentences per fact. Fun and curious tone."
      : gradeNum<=5 ? "4th-5th grade: engaging and curious tone, introduce some scientific vocabulary with brief explanation."
      : gradeNum<=8 ? "6th-8th grade: scientific and analytical, proper terminology expected."
      : "9th-12th grade: college-prep depth, scientific rigor.";

    const familySubjLabels = familySubjects.map(s=>s.label).join(", ") || "general subjects";
    const goalStr = goalSummary ? goalSummary(family) : "";

    const prompt = "You are an enthusiastic nature and science educator for a homeschool family.\n"
      + "Look at this photo and identify what is shown.\n\n"
      + "Student: " + name + ", " + grade + "\n"
      + "Grade guidance: " + gradeDesc + "\n"
      + "Family subjects: " + familySubjLabels + "\n"
      + (goalStr ? "Family goals: " + goalStr + "\n" : "")
      + "\nIMPORTANT: ALL content must be strictly age-appropriate and grade-appropriate for " + grade + ". "
      + "No mature themes, no frightening content, no graphic descriptions of predation or death. "
      + "Keep everything positive, safe, and educational.\n\n"
      + "Respond ONLY with valid JSON, no other text:\n"
      + "{\n"
      + '  "subject": "what you see (e.g. Oak tree, Monarch butterfly)",\n'
      + '  "category": "plant|animal|insect|rock|weather|place|object|other",\n'
      + '  "confidence": "high|medium|low",\n'
      + '  "needsWebImage": true or false (true if the photo alone is unclear and a reference image would help the child learn better),\n'
      + '  "funFacts": ["fact 1 at exact grade level","fact 2","fact 3","fact 4","fact 5"],\n'
      + '  "discussionQuestion": "one thought-provoking but age-appropriate question to ask the child",\n'
      + '  "miniLesson": {\n'
      + '    "title": "5-8 word title",\n'
      + '    "introduction": "1-2 sentences at grade level",\n'
      + '    "keyPoints": ["point 1","point 2","point 3"],\n'
      + '    "activity": "one hands-on activity they can do right now",\n'
      + '    "vocabulary": ["word1","word2","word3"]\n'
      + '  },\n'
      + '  "suggestedSubject": "best matching subject from: ' + familySubjLabels + '",\n'
      + '  "logNote": "2-3 sentence portfolio note summarizing what ' + name + ' observed, what facts were shared, and the discussion question asked. Written in third person. Grade-appropriate."\n'
      + "}";

    try {
      const raw    = await callClaude(prompt, base64, mime);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);

      const suggested = parsed.suggestedSubject || parsed.subjects?.[0] || "Science";
      const match = familySubjects.find(s =>
        s.label.toLowerCase()===suggested.toLowerCase() ||
        suggested.toLowerCase().includes(s.label.toLowerCase().split(" ")[0])
      );
      const chosenSubj = match
        || familySubjects.find(s=>s.label.toLowerCase().includes("science"))
        || familySubjects[0]
        || {label:"Science", icon:"\uD83D\uDD2D", id:"science"};

      parsed._chosenSubj = chosenSubj;
      setResult(parsed);
      setEditNote(parsed.logNote || "");

      if(parsed.needsWebImage) {
        fetchWebImage(parsed.subject, parsed.category);
      }

      setPhase(isYoung ? "kid_young" : "kid_older");
    } catch(e) {
      setResult({_error: e.message==="NO_KEY" ? "nokey" : "fail"});
      setPhase("result_error");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = ev => {
      analyzeImage(ev.target.result.split(",")[1], mime);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const saveToPortfolio = () => {
    if(!onAddEntry || !child || !result || saving) return;
    setSaving(true);
    const childIdx = family.children.findIndex(c=>c.id===child.id);
    if(childIdx < 0) { setSaving(false); return; }
    const photos = imageData ? ["data:"+imageMime+";base64,"+imageData] : [];
    if(webImageUrl) photos.push(webImageUrl);
    onAddEntry({
      childIdx,
      subj: result._chosenSubj?.label || "Science",
      title: "Field Study: " + result.subject,
      note: editNote,
      thumb: result.category==="plant" ? "\uD83C\uDF3F"
        : result.category==="animal" ? "\uD83E\uDD8B"
        : result.category==="insect" ? "\uD83D\uDC1B"
        : result.category==="rock"   ? "\uD83E\uDEA8" : "\uD83D\uDD2D",
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      ts: Date.now(),
      photos,
      selfLogged: false,
      isFieldStudy: true,
      isMilestone: true,
    });
    if(onComplete) {
      onComplete({
        child, result,
        wsDeclined, wsWanted, wsResult,
        subj: result._chosenSubj?.label || "Science",
        saved: true,
      });
    }
    setSaving(false);
    onClose();
  };

  const skipPortfolio = () => {
    if(onComplete) {
      onComplete({
        child, result,
        wsDeclined, wsWanted, wsResult,
        subj: result._chosenSubj?.label || "Science",
        saved: false,
      });
    }
    onClose();
  };

  const generateWorksheet = async () => {
    if(!result || wsLoading) return;
    setWsLoading(true);
    try {
      const extraCtx = "Based on a field observation of: " + result.subject
        + ". Key vocabulary: " + (result.miniLesson?.vocabulary||[]).join(", ")
        + ". Key concepts: " + (result.miniLesson?.keyPoints||[]).join("; ");
      const prompt = buildWorksheetPrompt("Science", result.subject + " Field Study", child, family, extraCtx);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      setWsResult(JSON.parse(clean));
      setWsWanted(true);
    } catch(e) {
      setWsResult({_error:true});
    }
    setWsLoading(false);
  };

  const openPrint = () => {
    if(!wsResult || wsResult._error) return;
    const html = buildWorksheetHTML(wsResult, child, grade, "Field Study");
    const win  = window.open("","_blank");
    if(!win) return;
    win.document.write(html);
    setTimeout(()=>win.document.close(), 0);
  };

  const reset = () => {
    setPhase("capture"); setResult(null); setImageData(null);
    setWebImageUrl(null); setFactIdx(0); setWsDeclined(false);
    setWsWanted(false); setWsResult(null); setWsLoading(false);
    setEditNote(""); setSaving(false);
  };

  const displayImage = imageData ? ("data:"+imageMime+";base64,"+imageData) : null;
  const facts = result?.funFacts || [];
  const CATEGORY_ICONS = {plant:"\uD83C\uDF3F",animal:"\uD83E\uDD8B",insect:"\uD83D\uDC1B",rock:"\uD83E\uDEA8",weather:"\u26C5",place:"\uD83D\uDCCD",object:"\uD83D\uDD0D",other:"\uD83D\uDD2D"};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.85)",backdropFilter:"blur(14px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"94vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.4)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.65rem 1.2rem 0.55rem",borderBottom:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem"}}>{"Field Study"}</div>
            <div style={{fontSize:"0.68rem",color:pal.slate,marginTop:"1px"}}>{"Snap a photo to discover and learn"}</div>
          </div>
          <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
            {pastStudies.length>0&&phase==="capture"&&(
              <button onClick={()=>setPhase("journal")}
                style={{padding:"0.22rem 0.6rem",border:"1.5px solid "+pal.primary+"50",borderRadius:"20px",background:"transparent",color:pal.primary,fontSize:"0.67rem",fontWeight:"700",cursor:"pointer"}}>
                {"Journal ("+pastStudies.length+")"}
              </button>
            )}
            <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"x"}</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",minHeight:0}}>

          {/* CAPTURE */}
          {phase==="capture"&&(
            <div style={{padding:"1.5rem 1.2rem",textAlign:"center"}}>
              <div style={{width:"90px",height:"90px",borderRadius:"50%",background:pal.pale,border:`3px solid ${pal.primary}30`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",fontSize:"2.8rem"}}>{"[cam]"}</div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem",marginBottom:"0.3rem"}}>{"What did "+name+" find?"}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,marginBottom:"1.5rem",maxWidth:"280px",margin:"0 auto 1.5rem"}}>
                {"Take a photo of anything interesting. Claude will identify it and create a lesson just for "+grade+"!"}
              </div>
              <input ref={camRef}  type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFile}/>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"280px",margin:"0 auto"}}>
                <button onClick={()=>camRef.current?.click()}
                  style={{padding:"0.9rem",border:"none",borderRadius:"16px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:"pointer",boxShadow:`0 4px 18px ${pal.accent}40`}}>
                  {"Take a Photo"}
                </button>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.88rem",cursor:"pointer"}}>
                  {"Choose from Library"}
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {phase==="loading"&&(
            <div style={{padding:"1.5rem 1.2rem",textAlign:"center"}}>
              {displayImage&&<img src={displayImage} alt="" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>}
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Identifying what "+name+" found..."}}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Claude is looking at the photo and building a "+grade+"-level lesson. About 15 seconds."}</div>
              <div style={{marginTop:"1.5rem",display:"flex",justifyContent:"center",gap:"0.4rem"}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:pal.primary,opacity:0.3+i*0.35,animation:"pulse 1.2s ease infinite",animationDelay:i*0.2+"s"}}/>
                ))}
              </div>
            </div>
          )}

          {/* KID VIEW - YOUNG (K-3) */}
          {phase==="kid_young"&&result&&(
            <div style={{padding:"0.75rem 1.2rem"}}>
              {/* Photo + web image */}
              <div style={{position:"relative",marginBottom:"1rem"}}>
                {displayImage&&(
                  <img src={displayImage} alt="" style={{width:"100%",maxHeight:"220px",objectFit:"cover",borderRadius:"16px"}}/>
                )}
                {webImageUrl&&(
                  <div style={{marginTop:"0.5rem"}}>
                    <img src={webImageUrl} alt={"Reference: "+result.subject} style={{width:"100%",maxHeight:"160px",objectFit:"cover",borderRadius:"12px"}} onError={e=>e.target.style.display="none"}/>
                    <div style={{fontSize:"0.58rem",color:pal.slate,textAlign:"right",marginTop:"2px"}}>{"Reference image"}</div>
                  </div>
                )}
              </div>

              {/* Subject title - large */}
              <div style={{textAlign:"center",marginBottom:"1rem"}}>
                <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>{CATEGORY_ICONS[result.category]||"\uD83D\uDD2D"}</div>
                <div style={{fontWeight:"900",color:pal.primary,fontSize:"1.3rem",lineHeight:1.2}}>{result.subject}</div>
              </div>

              {/* Facts one at a time */}
              {facts.length>0&&(
                <div style={{background:pal.pale,borderRadius:"18px",padding:"1.2rem",marginBottom:"1rem",border:`2px solid ${pal.primary}20`,minHeight:"100px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>{"Did you know?"}</div>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:isYoung?"1rem":"0.9rem",lineHeight:1.6}}>{facts[factIdx]}</div>
                  <div style={{display:"flex",gap:"0.3rem",marginTop:"0.75rem"}}>
                    {facts.map((_,i)=>(
                      <div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:i===factIdx?pal.primary:pal.stone+"60",transition:"all 0.15s"}}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion question */}
              {result.discussionQuestion&&factIdx===facts.length-1&&(
                <div style={{background:"#fffbeb",borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"1rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontSize:"0.62rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.25rem"}}>{"Talk About It"}</div>
                  <div style={{fontSize:"0.84rem",color:pal.ink,lineHeight:1.6,fontStyle:"italic"}}>{"\""+result.discussionQuestion+"\""}</div>
                </div>
              )}

              {/* Navigation */}
              <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
                {factIdx>0&&(
                  <button onClick={()=>setFactIdx(f=>f-1)}
                    style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>
                    {"Back"}
                  </button>
                )}
                {factIdx<facts.length-1?(
                  <button onClick={()=>setFactIdx(f=>f+1)}
                    style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>
                    {"Next Fact"}
                  </button>
                ):(
                  <button onClick={()=>setPhase("parent_review")}
                    style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.88rem",cursor:"pointer"}}>
                    {"Show Mom/Dad!"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* KID VIEW - OLDER (4-6 and 7+) */}
          {phase==="kid_older"&&result&&(
            <div style={{padding:"0.75rem 1.2rem"}}>
              {displayImage&&<img src={displayImage} alt="" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"14px",marginBottom:"0.75rem"}}/>}
              {webImageUrl&&(
                <div style={{marginBottom:"0.75rem"}}>
                  <img src={webImageUrl} alt={"Reference: "+result.subject} style={{width:"100%",maxHeight:"140px",objectFit:"cover",borderRadius:"12px"}} onError={e=>e.target.style.display="none"}/>
                  <div style={{fontSize:"0.58rem",color:pal.slate,textAlign:"right",marginTop:"2px"}}>{"Reference image"}</div>
                </div>
              )}

              {/* Subject */}
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.85rem",background:pal.pale,borderRadius:"14px",padding:"0.7rem 0.9rem",border:`2px solid ${pal.primary}20`}}>
                <span style={{fontSize:"1.8rem"}}>{CATEGORY_ICONS[result.category]||"\uD83D\uDD2D"}</span>
                <div>
                  <div style={{fontWeight:"900",color:pal.primary,fontSize:"1rem"}}>{result.subject}</div>
                  <div style={{fontSize:"0.65rem",color:pal.slate}}>{result.category+" - "+grade+" level"}</div>
                </div>
              </div>

              {/* All facts */}
              <div style={{marginBottom:"0.85rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.4rem"}}>{"Fun Facts"}</div>
                {facts.map((fact,i)=>(
                  <div key={i} style={{background:"#fff",borderRadius:"10px",padding:"0.55rem 0.75rem",border:`1.5px solid ${pal.stone}20`,marginBottom:"0.35rem",display:"flex",gap:"0.45rem",alignItems:"flex-start"}}>
                    <span style={{color:pal.primary,fontWeight:"900",fontSize:"0.7rem",flexShrink:0,marginTop:"2px"}}>{i+1+"."}</span>
                    <span style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.55}}>{fact}</span>
                  </div>
                ))}
              </div>

              {/* Mini lesson */}
              {result.miniLesson&&(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}30`}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.86rem",marginBottom:"0.45rem"}}>{result.miniLesson.title}</div>
                  <div style={{fontSize:"0.79rem",color:pal.inkM,lineHeight:1.6,marginBottom:"0.5rem"}}>{result.miniLesson.introduction}</div>
                  {(result.miniLesson.keyPoints||[]).map((kp,i)=>(
                    <div key={i} style={{display:"flex",gap:"0.35rem",alignItems:"flex-start",marginBottom:"0.25rem"}}>
                      <span style={{color:pal.primary,flexShrink:0,marginTop:"2px",fontSize:"0.75rem"}}>{"->"}</span>
                      <span style={{fontSize:"0.77rem",color:pal.ink,lineHeight:1.5}}>{kp}</span>
                    </div>
                  ))}
                  {result.miniLesson.activity&&(
                    <div style={{background:pal.pale,borderRadius:"9px",padding:"0.5rem 0.7rem",marginTop:"0.5rem",border:`1.5px solid ${pal.primary}20`}}>
                      <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",marginBottom:"0.15rem"}}>{"Try This"}</div>
                      <div style={{fontSize:"0.76rem",color:pal.inkM,lineHeight:1.5}}>{result.miniLesson.activity}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Discussion question */}
              {result.discussionQuestion&&(
                <div style={{background:"#fffbeb",borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"0.85rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontSize:"0.62rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"Think About It"}</div>
                  <div style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.55,fontStyle:"italic"}}>{"\""+result.discussionQuestion+"\""}</div>
                </div>
              )}

              {/* Vocabulary */}
              {(result.miniLesson?.vocabulary||[]).length>0&&(
                <div style={{background:"#fff",borderRadius:"12px",padding:"0.6rem 0.8rem",marginBottom:"0.85rem",border:`1.5px solid ${pal.stone}25`}}>
                  <div style={{fontSize:"0.62rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>{"Vocabulary"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                    {result.miniLesson.vocabulary.map((w,i)=>(
                      <span key={i} style={{fontSize:"0.76rem",padding:"0.18rem 0.55rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`,color:pal.primary,fontWeight:"700"}}>{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Worksheet prompt */}
              {!wsDeclined&&!wsWanted&&!wsResult&&(
                <div style={{background:pal.pale,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.75rem",border:`2px solid ${pal.primary}20`}}>
                  <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.84rem",marginBottom:"0.25rem"}}>{"Want to do a worksheet about "+result.subject+"?"}</div>
                  <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"0.65rem"}}>{"It can be saved to your portfolio when you are done!"}</div>
                  <div style={{display:"flex",gap:"0.5rem"}}>
                    <button onClick={generateWorksheet} disabled={wsLoading}
                      style={{flex:1,padding:"0.55rem",border:"none",borderRadius:"10px",background:wsLoading?"#ccc":pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.8rem",cursor:wsLoading?"default":"pointer"}}>
                      {wsLoading?"Building...":"Yes, let's do it!"}
                    </button>
                    <button onClick={()=>setWsDeclined(true)}
                      style={{flex:1,padding:"0.55rem",border:`1.5px solid ${pal.stone}`,borderRadius:"10px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.8rem",cursor:"pointer"}}>
                      {"Maybe later"}
                    </button>
                  </div>
                </div>
              )}

              {wsResult&&!wsResult._error&&(
                <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.7rem 0.9rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.good}30`,display:"flex",gap:"0.5rem",alignItems:"center"}}>
                  <span style={{fontSize:"1.1rem"}}>{"[ok]"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",color:pal.good,fontSize:"0.82rem"}}>{wsResult.title||"Worksheet ready!"}</div>
                    <div style={{fontSize:"0.68rem",color:pal.inkM}}>{"Tap Print to save it to your portfolio"}</div>
                  </div>
                  <button onClick={openPrint} style={{padding:"0.3rem 0.65rem",border:"none",borderRadius:"9px",background:pal.good,color:"#fff",fontWeight:"700",fontSize:"0.72rem",cursor:"pointer"}}>{"Print"}</button>
                </div>
              )}

              {wsResult?._error&&(
                <div style={{fontSize:"0.72rem",color:"#a03030",textAlign:"center",marginBottom:"0.5rem"}}>{"Worksheet could not be generated. Try again later."}</div>
              )}

              {/* Tell Mom/Dad */}
              <button onClick={()=>setPhase("parent_review")}
                style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.9rem",cursor:"pointer",marginBottom:"0.5rem"}}>
                {"Tell Mom/Dad about this!"}
              </button>
              <button onClick={reset}
                style={{width:"100%",padding:"0.6rem",border:`1.5px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.8rem",cursor:"pointer"}}>
                {"Study something else"}
              </button>
            </div>
          )}

          {/* PARENT REVIEW */}
          {phase==="parent_review"&&result&&(
            <div style={{padding:"0.75rem 1.2rem"}}>
              <div style={{background:pal.pale,borderRadius:"14px",padding:"0.75rem 1rem",marginBottom:"0.85rem",border:`2px solid ${pal.primary}22`,display:"flex",gap:"0.5rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"[parent]"}</span>
                <div>
                  <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.84rem"}}>{"Parent Review"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate}}>{name+" just completed a field study!"}</div>
                </div>
              </div>

              {/* What was found */}
              <div style={{background:"#fff",borderRadius:"14px",padding:"0.8rem 1rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.stone}25`}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.4rem"}}>{CATEGORY_ICONS[result.category]||"\uD83D\uDD2D"}</span>
                  <div>
                    <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.9rem"}}>{result.subject}</div>
                    <div style={{fontSize:"0.63rem",color:pal.slate}}>{result._chosenSubj?.label||"Science"}+" - "+result.confidence+" confidence"}</div>
                  </div>
                </div>
                {displayImage&&<img src={displayImage} alt="" style={{width:"100%",maxHeight:"150px",objectFit:"cover",borderRadius:"10px",marginTop:"0.4rem"}}/>}
              </div>

              {/* What was shared */}
              <div style={{marginBottom:"0.75rem"}}>
                <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>{"What "+name+" learned"}</div>
                {facts.slice(0,isYoung?factIdx+1:facts.length).map((fact,i)=>(
                  <div key={i} style={{fontSize:"0.76rem",color:pal.inkM,padding:"0.3rem 0",borderBottom:`1px solid ${pal.stone}15`,lineHeight:1.5}}>{fact}</div>
                ))}
                {result.discussionQuestion&&(
                  <div style={{marginTop:"0.35rem",fontSize:"0.73rem",color:"#7a5500",fontStyle:"italic"}}>{"Q: "+result.discussionQuestion}</div>
                )}
              </div>

              {/* Worksheet status */}
              {wsDeclined&&(
                <div style={{background:"#fffbeb",borderRadius:"12px",padding:"0.7rem 0.9rem",marginBottom:"0.75rem",border:"1.5px solid #f5c84240"}}>
                  <div style={{fontWeight:"700",color:"#7a5500",fontSize:"0.8rem",marginBottom:"0.2rem"}}>{name+" declined the worksheet"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.slate,marginBottom:"0.5rem"}}>{"Would you like to send it to "+name+"'s page anyway?"}</div>
                  <button onClick={generateWorksheet} disabled={wsLoading}
                    style={{padding:"0.35rem 0.85rem",border:"none",borderRadius:"9px",background:wsLoading?"#ccc":"#e8a020",color:"#fff",fontWeight:"700",fontSize:"0.75rem",cursor:wsLoading?"default":"pointer"}}>
                    {wsLoading?"Generating...":"Yes, send to "+name}
                  </button>
                </div>
              )}
              {wsResult&&!wsResult._error&&wsDeclined&&(
                <div style={{background:pal.goodBg,borderRadius:"10px",padding:"0.55rem 0.8rem",marginBottom:"0.75rem",border:`1.5px solid ${pal.good}30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:"0.78rem",fontWeight:"700",color:pal.good}}>{"Worksheet ready for "+name+"!"}</span>
                  <button onClick={openPrint} style={{padding:"0.25rem 0.6rem",border:"none",borderRadius:"8px",background:pal.good,color:"#fff",fontWeight:"700",fontSize:"0.7rem",cursor:"pointer"}}>{"Print"}</button>
                </div>
              )}

              {/* Editable note */}
              <div style={{marginBottom:"0.75rem"}}>
                <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.35rem"}}>{"Portfolio Note (tap to edit)"}</div>
                <textarea value={editNote} onChange={e=>setEditNote(e.target.value)} rows={4}
                  style={{width:"100%",padding:"0.65rem 0.8rem",border:`1.5px solid ${pal.primary}40`,borderRadius:"11px",fontSize:"0.8rem",fontFamily:"inherit",background:"#fff",color:pal.ink,resize:"none",outline:"none",lineHeight:1.6}}/>
              </div>

              {/* Save or skip */}
              <button onClick={saveToPortfolio} disabled={saving}
                style={{width:"100%",padding:"0.9rem",border:"none",borderRadius:"14px",background:saving?"#ccc":pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.9rem",cursor:saving?"default":"pointer",marginBottom:"0.5rem"}}>
                {saving?"Saving...":"Save to Portfolio"}
              </button>
              <button onClick={skipPortfolio}
                style={{width:"100%",padding:"0.6rem",border:`1.5px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,fontWeight:"600",fontSize:"0.8rem",cursor:"pointer"}}>
                {"Skip - don't save"}
              </button>
            </div>
          )}

          {/* ERROR STATES */}
          {phase==="result_error"&&result?._error==="nokey"&&(
            <div style={{padding:"2rem 1.5rem",textAlign:"center"}}>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.35rem"}}>{"AI not set up yet"}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Add your Anthropic API key in Settings to unlock Field Study."}</div>
              <button onClick={onClose} style={{marginTop:"1rem",padding:"0.55rem 1.2rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>{"Close"}</button>
            </div>
          )}
          {phase==="result_error"&&result?._error==="fail"&&(
            <div style={{padding:"2rem 1.5rem",textAlign:"center"}}>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.5rem"}}>{"Could not analyze the photo"}</div>
              <button onClick={reset} style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>{"Try Again"}</button>
            </div>
          )}

          {/* JOURNAL */}
          {phase==="journal"&&(
            <div style={{padding:"0.75rem 1.2rem"}}>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem",marginBottom:"0.2rem"}}>{name+"'s Field Journal"}</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"1rem"}}>{pastStudies.length+" discover"+(pastStudies.length===1?"y":"ies")}</div>
              {pastStudies.length===0?(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem",textAlign:"center"}}>
                  <div style={{fontSize:"0.8rem",color:pal.slate}}>{"No field studies yet. Snap a photo to start!"}</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                  {pastStudies.map((e,i)=>(
                    <div key={e.id||i} style={{background:"#fff",borderRadius:"13px",overflow:"hidden",border:"1.5px solid "+pal.stone+"25",display:"flex",gap:0}}>
                      {e.photos&&e.photos[0]&&(
                        <img src={e.photos[0]} alt="" style={{width:"75px",height:"75px",objectFit:"cover",flexShrink:0}} onError={ev=>ev.target.style.display="none"}/>
                      )}
                      <div style={{flex:1,padding:"0.6rem 0.75rem",minWidth:0}}>
                        <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.81rem",marginBottom:"2px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                          {(e.title||"").replace("Field Study: ","")}
                        </div>
                        <div style={{fontSize:"0.67rem",color:pal.primary,fontWeight:"600",marginBottom:"2px"}}>{e.subj}</div>
                        <div style={{fontSize:"0.63rem",color:pal.slate}}>{e.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={()=>setPhase("capture")} style={{width:"100%",padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.85rem",cursor:"pointer",marginTop:"1rem"}}>
                {"New Field Study"}
              </button>
            </div>
          )}

        </div>

        {/* Bottom bar */}
        <div style={{padding:"0.75rem 1.2rem 1.2rem",borderTop:`1px solid ${pal.stone}35`,flexShrink:0}}>
          {(phase==="capture"||phase==="journal")&&(
            <button onClick={onClose} style={{width:"100%",padding:"0.65rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>{"Close"}</button>
          )}
          {(phase==="kid_young"||phase==="kid_older")&&phase!=="parent_review"&&(
            <button onClick={reset} style={{width:"100%",padding:"0.65rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem",fontWeight:"600"}}>{"Start Over"}</button>
          )}
        </div>

      </div>
    </div>
  );
}

