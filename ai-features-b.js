
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
function FieldStudyModal({ pal, family, child, onAddEntry, onClose }) {
  const [phase,       setPhase]      = useState("capture"); // capture|loading|result|worksheet|journal
  const [imageData,   setImageData]  = useState(null);
  const [imageMime,   setImageMime]  = useState("image/jpeg");
  const [result,      setResult]     = useState(null);
  const [wsResult,    setWsResult]   = useState(null);
  const [wsLoading,   setWsLoading]  = useState(false);
  const [wsError,     setWsError]    = useState(null);
  const [savedSubj,   setSavedSubj]  = useState(null);   // subject chosen by parent for logging
  const [showSubjPicker, setShowSubjPicker] = useState(false);
  const [sharedToKid, setSharedToKid] = useState(false);
  const fileRef = useRef(null);
  const camRef  = useRef(null);

  const grade    = child?.grade || "3rd";
  const gradeNum = parseInt(grade.replace(/\D/g,"")) || 3;
  const name     = child?.name || "Student";

  // All family subjects resolved to label+icon
  const familySubjects = useMemo(() => {
    const all = [...(SUBJECT_OPTIONS||[]), ...(family.customSubjects||[])];
    return (family.subjects||[]).map(id => all.find(s=>s.id===id)).filter(Boolean);
  }, [family]);

  // Past field study entries for this child
  const pastStudies = useMemo(() => {
    if(!onAddEntry) return [];
    // We don't have direct portfolio access here so we read from a passed prop -- 
    // use window.__rbPortfolio if available (set by root), otherwise empty
    try {
      const saved = localStorage.getItem("rootbloom_v1");
      if(!saved) return [];
      const data = JSON.parse(saved);
      const childIdx = (family.children||[]).findIndex(c=>c.id===child?.id);
      return (data.portfolio||[])
        .filter(e=>e.isFieldStudy && e.childIdx===childIdx)
        .sort((a,b)=>b.ts||0 - a.ts||0)
        .slice(0, 20);
    } catch(e) { return []; }
  }, [child, family]);

  const analyzeImage = async (base64, mime) => {
    setImageData(base64);
    setImageMime(mime);
    setPhase("loading");
    setSharedToKid(false);
    setSavedSubj(null);

    const gradeDesc = gradeNum<=2 ? "K-2nd grade, very simple fun language, short sentences"
      : gradeNum<=5 ? "3rd-5th grade, engaging and curious tone"
      : gradeNum<=8 ? "6th-8th grade, scientific and analytical"
      : "9th-12th grade, college-prep depth";

    const familySubjLabels = familySubjects.map(s=>s.label).join(", ") || "general subjects";

    const prompt = `You are an enthusiastic nature and science educator helping a homeschool family.\nLook at this photo and identify what is in it -- plants, animals, rocks, insects, objects, or scenes.\n\nStudent: ${name}, ${grade} (${gradeDesc})\nFamily goals: ${goalSummary(family)}\nFamily subjects: ${familySubjLabels}\n\nRespond ONLY with valid JSON:\n{\n  "subject": "what you see (e.g. Oak tree leaves, Monarch butterfly, Quartz crystal)",\n  "category": "plant|animal|insect|rock|weather|place|object|other",\n  "confidence": "high|medium|low",\n  "funFacts": [\n    "fun fact 1 written for this grade level",\n    "fun fact 2",\n    "fun fact 3",\n    "fun fact 4",\n    "fun fact 5"\n  ],\n  "miniLesson": {\n    "title": "Mini Lesson title (5-8 words)",\n    "introduction": "1-2 engaging sentences introducing the subject at grade level",\n    "keyPoints": [\n      "key point 1",\n      "key point 2",\n      "key point 3"\n    ],\n    "activity": "One hands-on activity the student can do right now",\n    "discussion": "One thought-provoking question to spark conversation",\n    "vocabulary": ["word1", "word2", "word3"]\n  },\n  "suggestedSubject": "the single best matching subject label from this list: ${familySubjLabels}",\n  "subjects": ["list of school subjects this connects to"]\n}`;

    try {
      const raw    = await callClaude(prompt, base64, mime);
      const clean  = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);

      // Pick best subject: match AI suggestion against family subjects
      const suggested = parsed.suggestedSubject || parsed.subjects?.[0] || "Science";
      const match = familySubjects.find(s =>
        s.label.toLowerCase()===suggested.toLowerCase() ||
        suggested.toLowerCase().includes(s.label.toLowerCase().split(" ")[0])
      );
      const chosenSubj = match || familySubjects.find(s=>s.label.toLowerCase().includes("science")) || familySubjects[0] || {label:"Science",icon:"\uD83D\uDD2D",id:"science"};
      setSavedSubj(chosenSubj);

      setPhase("result");

      // Auto-save portfolio entry
      if(onAddEntry && child) {
        const childIdx = family.children.findIndex(c=>c.id===child.id);
        if(childIdx >= 0) {
          onAddEntry({
            childIdx,
            subj: chosenSubj.label,
            title: "\uD83D\uDD2D Field Study: " + parsed.subject,
            note: "Identified: " + parsed.subject + ". " + (parsed.funFacts?.[0]||""),
            thumb: parsed.category==="plant"?"\uD83C\uDF3F":parsed.category==="animal"?"\uD83E\uDD8B":parsed.category==="insect"?"\uD83D\uDC1B":parsed.category==="rock"?"\uD83E\uDEA8":"\uD83D\uDD2D",
            date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
            ts: Date.now(),
            photos: [base64],
            selfLogged: false,
            isFieldStudy: true,
          });
        }
      }
    } catch(e) {
      setResult({_error: e.message==="NO_KEY" ? "nokey" : "fail"});
      setPhase("result");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target.result.split(",")[1];
      analyzeImage(base64, mime);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const changeSubject = (subj) => {
    // Re-save the portfolio entry with updated subject
    if(onAddEntry && child && result && !result._error) {
      const childIdx = family.children.findIndex(c=>c.id===child.id);
      if(childIdx >= 0) {
        onAddEntry({
          childIdx,
          subj: subj.label,
          title: "\uD83D\uDD2D Field Study: " + result.subject,
          note: "Identified: " + result.subject + ". " + (result.funFacts?.[0]||""),
          thumb: "\uD83D\uDD2D",
          date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
          ts: Date.now(),
          photos: [imageData],
          selfLogged: false,
          isFieldStudy: true,
          _replaceSubj: savedSubj?.label, // hint for dedup if needed
        });
      }
    }
    setSavedSubj(subj);
    setShowSubjPicker(false);
  };

  const shareToKid = () => {
    if(!result || result._error || !onAddEntry || !child) return;
    const childIdx = family.children.findIndex(c=>c.id===child.id);
    if(childIdx < 0) return;
    onAddEntry({
      childIdx,
      subj: savedSubj?.label || "Science",
      title: "\uD83D\uDD2D Field Study: " + result.subject,
      note: (result.funFacts?.[0]||"") + " " + (result.miniLesson?.discussion ? "Think about this: " + result.miniLesson.discussion : ""),
      thumb: "\uD83D\uDD2D",
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      ts: Date.now(),
      photos: imageData ? [imageData] : [],
      isMilestone: true,   // shows in Stars tab
      selfLogged: false,
      isFieldStudy: true,
      isSharedDiscovery: true,
    });
    setSharedToKid(true);
  };

  const generateWorksheet = async () => {
    if(!result || result._error) return;
    setWsLoading(true); setWsError(null);
    try {
      const extraCtx = `Based on a field observation of: ${result.subject}. Key vocabulary: ${(result.miniLesson?.vocabulary||[]).join(", ")}. Key concepts: ${(result.miniLesson?.keyPoints||[]).join("; ")}`;
      const prompt = buildWorksheetPrompt("Science", result.subject + " \u2014 Field Study", child, family, extraCtx);
      const raw    = await callClaude(prompt);
      const clean  = raw.replace(/```json|```/g,"").trim();
      setWsResult(JSON.parse(clean));
      setPhase("worksheet");
    } catch(e) {
      setWsError("Couldn\u2019t generate worksheet right now.");
    }
    setWsLoading(false);
  };

  const openPrint = () => {
    if(!wsResult) return;
    const html = buildWorksheetHTML(wsResult, child, grade, "Field Study");
    const win  = window.open("", "_blank");
    if(!win) return;
    win.document.write(html);
    win.document.close();
  };

  const CATEGORY_ICONS = { plant:"\uD83C\uDF3F", animal:"\uD83E\uDD8B", insect:"\uD83D\uDC1B", rock:"\uD83E\uDEA8", weather:"\u26C5", place:"\uD83D\uDCCD", object:"\uD83D\uDD0D", other:"\uD83D\uDD2D" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,10,0.82)",backdropFilter:"blur(14px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:pal.linen,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:"430px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -16px 60px rgba(0,0,0,0.4)",animation:"slideUp 0.28s ease"}}>

        {/* Handle */}
        <div style={{padding:"0.7rem 0 0",display:"flex",justifyContent:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"4px",borderRadius:"99px",background:pal.stone}}/>
        </div>

        {/* Header */}
        <div style={{padding:"0.75rem 1.2rem 0.65rem",borderBottom:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem"}}>{"\uD83D\uDD2D Field Study"}</div>
            <div style={{fontSize:"0.72rem",color:pal.slate,marginTop:"1px"}}>{"Snap a photo \u00b7 Get facts \u00b7 Build a lesson"}</div>
          </div>
          <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
            {pastStudies.length>0&&(
              <button onClick={()=>setPhase("journal")}
                style={{padding:"0.25rem 0.65rem",border:"1.5px solid "+pal.primary+"50",borderRadius:"20px",background:phase==="journal"?pal.pale:"transparent",color:pal.primary,fontSize:"0.68rem",fontWeight:"700",cursor:"pointer"}}>
                {"\uD83D\uDCD6 "+pastStudies.length}
              </button>
            )}
            <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.parchm,border:"none",color:pal.slate,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u00d7"}</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.2rem"}}>

          {/* -- CAPTURE -- */}
          {phase==="capture"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"4rem",marginBottom:"0.75rem",animation:"bounce 2s ease infinite"}}>{"[camera]"}</div>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"1rem",marginBottom:"0.35rem"}}>{"What did you find?"}</div>
              <div style={{fontSize:"0.78rem",color:pal.slate,lineHeight:1.65,marginBottom:"1.5rem",maxWidth:"280px",margin:"0 auto 1.5rem"}}>
                {"Snap a photo of a plant, animal, rock, or anything interesting. Claude will identify it and build a mini lesson for "+name+"!"}
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFile}/>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"280px",margin:"0 auto"}}>
                <button onClick={()=>camRef.current?.click()}
                  style={{padding:"0.9rem",border:"none",borderRadius:"16px",background:pal.accentGrad,color:"#fff",fontWeight:"900",fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:`0 4px 18px ${pal.accent}40`}}>
                  <span>{"\u1f4f7"}</span><span>{"Take a Photo"}</span>
                </button>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:"0.75rem",border:`2px solid ${pal.stone}`,borderRadius:"14px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>
                  <span>{"\uD83D\uDDBC\uFE0F"}</span><span>{"Choose from Library"}</span>
                </button>
              </div>
            </div>
          )}

          {/* -- LOADING -- */}
          {phase==="loading"&&(
            <div style={{textAlign:"center",padding:"1.5rem 0"}}>
              {imageData&&<img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>}
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem",animation:"pulse 1.2s ease infinite"}}>{"\uD83D\uDD2D"}</div>
              <div style={{fontWeight:"800",color:pal.primary,fontSize:"0.9rem",marginBottom:"0.25rem"}}>{"Identifying what you found\u2026"}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Claude is looking at your photo and building a mini lesson. Takes about 15 seconds."}</div>
            </div>
          )}

          {/* -- RESULT -- */}
          {phase==="result"&&result&&!result._error&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              {imageData&&(
                <img src={"data:"+imageMime+";base64,"+imageData} alt="" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"14px",marginBottom:"1rem"}}/>
              )}

              {/* Subject card + subject picker */}
              <div style={{background:pal.pale,borderRadius:"16px",padding:"0.85rem 1rem",marginBottom:"1rem",border:`2px solid ${pal.primary}25`}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.8rem"}}>{CATEGORY_ICONS[result.category]||"\uD83D\uDD2D"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"900",color:pal.primary,fontSize:"1rem"}}>{result.subject}</div>
                    <div style={{fontSize:"0.65rem",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em"}}>{result.category+" \u00b7 "+result.confidence+" confidence"}</div>
                  </div>
                </div>
                {(result.subjects||[]).length>0&&(
                  <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.6rem"}}>
                    {result.subjects.map((s,i)=>(
                      <span key={i} style={{fontSize:"0.65rem",padding:"0.1rem 0.5rem",background:pal.primary+"18",borderRadius:"20px",color:pal.primary,fontWeight:"700"}}>{s}</span>
                    ))}
                  </div>
                )}
                {/* Subject logging picker */}
                <div style={{borderTop:"1px solid "+pal.stone+"30",paddingTop:"0.55rem",marginTop:"0.35rem"}}>
                  <div style={{fontSize:"0.65rem",color:pal.slate,marginBottom:"0.35rem",fontWeight:"600"}}>{"Logged under subject:"}</div>
                  {showSubjPicker?(
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                      {familySubjects.map(s=>(
                        <button key={s.id} onClick={()=>changeSubject(s)}
                          style={{padding:"0.25rem 0.6rem",border:"1.5px solid "+(savedSubj?.id===s.id?pal.primary:pal.stone+"50"),borderRadius:"20px",background:savedSubj?.id===s.id?pal.pale:"transparent",color:savedSubj?.id===s.id?pal.primary:pal.inkM,fontSize:"0.7rem",fontWeight:"700",cursor:"pointer"}}>
                          {s.icon+" "+s.label}
                        </button>
                      ))}
                    </div>
                  ):(
                    <button onClick={()=>setShowSubjPicker(true)}
                      style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.3rem 0.7rem",border:"1.5px solid "+pal.primary+"40",borderRadius:"20px",background:pal.primary+"10",cursor:"pointer"}}>
                      <span style={{fontSize:"0.85rem"}}>{savedSubj?.icon||"\uD83D\uDCCB"}</span>
                      <span style={{fontSize:"0.75rem",fontWeight:"700",color:pal.primary}}>{savedSubj?.label||"Science"}</span>
                      <span style={{fontSize:"0.65rem",color:pal.slate}}>{"(tap to change)"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Share to Stars button */}
              <button onClick={sharedToKid?null:shareToKid}
                style={{width:"100%",padding:"0.6rem 1rem",border:"1.5px solid "+(sharedToKid?"#2d9e5f60":pal.primary+"40"),borderRadius:"12px",background:sharedToKid?"#edf9f0":pal.pale,color:sharedToKid?"#2d9e5f":pal.primary,fontWeight:"700",fontSize:"0.78rem",cursor:sharedToKid?"default":"pointer",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"}}>
                <span>{sharedToKid?"\u2713":"\uD83C\uDF1F"}</span>
                <span>{sharedToKid?"Saved to "+name+"\u2019s Stars!":"Share discovery to "+name+"\u2019s Stars tab"}</span>
              </button>

              {/* Fun facts */}
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontWeight:"700",color:pal.inkM,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.55rem"}}>{"\uD83C\uDF1F Fun Facts"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                  {(result.funFacts||[]).map((fact,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:"12px",padding:"0.6rem 0.8rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <span style={{fontSize:"0.85rem",flexShrink:0}}>{"\u2736"}</span>
                      <span style={{fontSize:"0.8rem",color:pal.ink,lineHeight:1.55}}>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini lesson */}
              {result.miniLesson&&(
                <div style={{background:pal.linen,borderRadius:"16px",padding:"0.9rem 1rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}35`}}>
                  <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.55rem"}}>{"\u1f4d6 "+result.miniLesson.title}</div>
                  <div style={{fontSize:"0.8rem",color:pal.inkM,lineHeight:1.65,marginBottom:"0.65rem"}}>{result.miniLesson.introduction}</div>
                  {(result.miniLesson.keyPoints||[]).length>0&&(
                    <div style={{marginBottom:"0.65rem"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>{"Key Points"}</div>
                      {result.miniLesson.keyPoints.map((kp,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.4rem",alignItems:"flex-start",marginBottom:"0.3rem"}}>
                          <span style={{color:pal.primary,flexShrink:0,marginTop:"2px"}}>{"->"}</span>
                          <span style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5}}>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.miniLesson.activity&&(
                    <div style={{background:pal.pale,borderRadius:"10px",padding:"0.55rem 0.75rem",marginBottom:"0.5rem",border:`1.5px solid ${pal.primary}20`}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.primary,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"\uD83E\uDDEA Try This"}</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5}}>{result.miniLesson.activity}</div>
                    </div>
                  )}
                  {result.miniLesson.discussion&&(
                    <div style={{background:"#fffbeb",borderRadius:"10px",padding:"0.55rem 0.75rem",border:"1.5px solid #f5c84240"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:"700",color:"#b07800",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{"\uD83D\uDCAC Talk About It"}</div>
                      <div style={{fontSize:"0.78rem",color:pal.inkM,lineHeight:1.5,fontStyle:"italic"}}>{"\""+result.miniLesson.discussion+"\""}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Vocabulary */}
              {(result.miniLesson?.vocabulary||[]).length>0&&(
                <div style={{background:"#fff",borderRadius:"12px",padding:"0.65rem 0.85rem",marginBottom:"1rem",border:`1.5px solid ${pal.stone}25`}}>
                  <div style={{fontSize:"0.65rem",fontWeight:"700",color:pal.slate,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.4rem"}}>{"\uD83D\uDCDA Vocabulary"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    {result.miniLesson.vocabulary.map((w,i)=>(
                      <span key={i} style={{fontSize:"0.78rem",padding:"0.2rem 0.6rem",background:pal.pale,borderRadius:"20px",border:`1.5px solid ${pal.primary}30`,color:pal.primary,fontWeight:"700"}}>{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Worksheet CTA */}
              <button onClick={generateWorksheet} disabled={wsLoading}
                style={{width:"100%",padding:"0.85rem",border:"none",borderRadius:"14px",background:wsLoading?"#ccc":pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.9rem",cursor:wsLoading?"default":"pointer",marginBottom:"0.5rem"}}>
                {wsLoading?"\u23F3 Building worksheet\u2026":"\uD83D\uDCC4 Build a Worksheet from This"}
              </button>
              {wsError&&<div style={{fontSize:"0.72rem",color:"#a03030",textAlign:"center"}}>{wsError}</div>}

              {/* Share to Stars + Study Again */}
              <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                <button onClick={()=>{
                  if(sharedToKid||!onAddEntry||!child||!result) return;
                  const ci=family.children.findIndex(c=>c.id===child.id);
                  if(ci<0) return;
                  onAddEntry({
                    childIdx:ci,
                    subj:savedSubj||result.subjects?.[0]||"Science",
                    title:"\u2b50 Discovery: "+result.subject,
                    note:"I found: "+result.subject+"! "+((result.funFacts||[])[0]||""),
                    thumb:"\u2b50",
                    date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
                    photos:imageData?[imageData]:[],
                    isMilestone:true,
                    isFieldStudy:true,
                    selfLogged:false,
                    ts:Date.now(),
                  });
                  setSharedToKid(true);
                }}
                  disabled={sharedToKid}
                  style={{flex:1,padding:"0.7rem",border:"1.5px solid "+(sharedToKid?"#2d9e5f":"#f5c842"),borderRadius:"12px",background:sharedToKid?"#edf9f0":"#fffbeb",color:sharedToKid?"#2d9e5f":"#b07800",fontWeight:"700",fontSize:"0.78rem",cursor:sharedToKid?"default":"pointer"}}>
                  {sharedToKid?"\u2b50 Added to Stars!":"\u2b50 Share to Stars"}
                </button>
                <button onClick={()=>{setPhase("capture");setResult(null);setImageData(null);setWsResult(null);setWsError(null);setSharedToKid(false);setSavedSubj(null);setShowSubjPicker(false);}}
                  style={{flex:1,padding:"0.7rem",border:"1.5px solid "+pal.stone+"50",borderRadius:"12px",background:"transparent",color:pal.inkM,fontWeight:"700",fontSize:"0.78rem",cursor:"pointer"}}>
                  {"\uD83D\uDD04 Study Again"}
                </button>
              </div>
            </div>
          )}

          {/* -- ERROR STATES -- */}
          {phase==="result"&&result?._error==="nokey"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\uD83D\uDD11"}</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.35rem"}}>{"AI not set up yet"}</div>
              <div style={{fontSize:"0.74rem",color:pal.slate,lineHeight:1.6}}>{"Add your Anthropic API key in Settings \u2192 AI to unlock Field Study and all AI features."}</div>
            </div>
          )}
          {phase==="result"&&result?._error==="fail"&&(
            <div style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\u1f614"}</div>
              <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.88rem",marginBottom:"0.5rem"}}>{"Couldn\u2019t analyze the photo"}</div>
              <button onClick={()=>setPhase("capture")} style={{padding:"0.55rem 1.2rem",border:"none",borderRadius:"10px",background:pal.accentGrad,color:"#fff",fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>{"Try Again"}</button>
            </div>
          )}

          {/* -- WORKSHEET -- */}
          {phase==="worksheet"&&wsResult&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              <div style={{background:pal.goodBg,borderRadius:"12px",padding:"0.75rem 0.9rem",marginBottom:"1rem",border:`1.5px solid ${pal.good}30`,display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <span style={{fontSize:"1.2rem"}}>{"[ok]"}</span>
                <div>
                  <div style={{fontWeight:"700",color:pal.good,fontSize:"0.82rem"}}>{wsResult.title||"Field Study Worksheet ready!"}</div>
                  <div style={{fontSize:"0.7rem",color:pal.inkM,marginTop:"1px"}}>
                    {(wsResult.sections||[{items:wsResult.items||[]}]).reduce((sum,s)=>sum+(s.items||[]).length,0)+" items \u00b7 "+grade+" level"}
                  </div>
                </div>
              </div>
              {(wsResult.sections||[{items:wsResult.items||[]}]).slice(0,1).map((section,si)=>(
                <div key={si} style={{marginBottom:"1rem"}}>
                  {(section.items||[]).slice(0,3).map((item,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:"10px",padding:"0.6rem 0.8rem",marginBottom:"0.4rem",border:`1.5px solid ${pal.stone}20`,display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"50%",background:pal.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:"900",color:"#fff",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                      <div style={{fontSize:"0.78rem",color:pal.ink,lineHeight:1.5,flex:1}}>{item.content}</div>
                    </div>
                  ))}
                  {(section.items||[]).length>3&&<div style={{fontSize:"0.7rem",color:pal.slate,textAlign:"center",fontStyle:"italic"}}>{"+ "+(section.items||[]).length-3+" more items"}</div>}
                </div>
              ))}
            </div>
          )}

          {/* -- JOURNAL -- */}
          {phase==="journal"&&(
            <div style={{animation:"fadeUp 0.22s ease"}}>
              <div style={{fontWeight:"800",color:pal.ink,fontSize:"0.95rem",marginBottom:"0.25rem"}}>{"\uD83D\uDCD6 "+name+"\u2019s Field Journal"}</div>
              <div style={{fontSize:"0.72rem",color:pal.slate,marginBottom:"1rem"}}>{pastStudies.length+" discovery"+(pastStudies.length===1?"":"ies")+" recorded"}</div>
              {pastStudies.length===0?(
                <div style={{background:pal.linen,borderRadius:"14px",padding:"2rem",textAlign:"center",border:"1.5px solid "+pal.stone+"25"}}>
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{"\uD83D\uDD2D"}</div>
                  <div style={{fontSize:"0.8rem",color:pal.slate}}>{"No field studies yet \u2014 snap a photo to start the journal!"}</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                  {pastStudies.map((e,i)=>(
                    <div key={e.id||i} style={{background:"#fff",borderRadius:"14px",overflow:"hidden",border:"1.5px solid "+pal.stone+"25",display:"flex",gap:0}}>
                      {e.photos&&e.photos[0]&&(
                        <img src={e.photos[0]} alt="" style={{width:"80px",height:"80px",objectFit:"cover",flexShrink:0}}/>
                      )}
                      <div style={{flex:1,padding:"0.65rem 0.75rem",minWidth:0}}>
                        <div style={{fontWeight:"700",color:pal.ink,fontSize:"0.82rem",marginBottom:"2px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                          {(e.title||"").replace("\uD83D\uDD2D Field Study: ","")}
                        </div>
                        <div style={{fontSize:"0.68rem",color:pal.primary,fontWeight:"600",marginBottom:"2px"}}>{e.subj}</div>
                        <div style={{fontSize:"0.65rem",color:pal.slate}}>{e.date}</div>
                        {e.note&&<div style={{fontSize:"0.72rem",color:pal.inkM,marginTop:"4px",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* -- BOTTOM BAR -- */}
        <div style={{padding:"0.9rem 1.2rem",borderTop:`1px solid ${pal.stone}35`,flexShrink:0,display:"flex",gap:"0.55rem"}}>
          {phase==="capture"&&(
            <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>{"Cancel"}</button>
          )}
          {phase==="result"&&!result?._error&&(
            <>
              <button onClick={()=>{setPhase("capture");setResult(null);setImageData(null);setSavedSubj(null);setSharedToKid(false);setShowSubjPicker(false);}}
                style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"\u2190 New"}</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"Done \u2713"}</button>
            </>
          )}
          {(phase==="result"&&result?._error)&&(
            <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.84rem",fontWeight:"600"}}>{"Close"}</button>
          )}
          {phase==="worksheet"&&(
            <>
              <button onClick={()=>setPhase("result")} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"\u2190 Back"}</button>
              <button onClick={openPrint} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"\uD83D\uDDB8\uFE0F Print Worksheet"}</button>
            </>
          )}
          {phase==="journal"&&(
            <>
              <button onClick={()=>setPhase("capture")} style={{padding:"0.7rem 0.9rem",border:`2px solid ${pal.stone}`,borderRadius:"12px",background:"transparent",color:pal.slate,cursor:"pointer",fontSize:"0.82rem"}}>{"\u2190 New Study"}</button>
              <button onClick={onClose} style={{flex:1,padding:"0.7rem",border:"none",borderRadius:"12px",background:pal.accentGrad,color:"#fff",fontWeight:"800",fontSize:"0.88rem",cursor:"pointer"}}>{"Done"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   AI LESSON PLANNER MODAL
   Parent inputs what they want to cover -> AI generates
   a day-by-day Mon-Fri plan per child
   ---------------------------------------------------------- */
