/* ----------------------------------------------------------
   BLOOM TUTOR  (called from StudentPortal)
   ---------------------------------------------------------- */
async function bloomChat({question, history=[], child, family, hintMode=false}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");

  const gradeRaw = child.grade||"3rd";
  const gradeN   = parseInt((gradeRaw.match(/\d+/)||["3"])[0])||3;
  const tone     = gradeN<=2 ? "very simple words, short sentences, like talking to a 6-year-old"
                 : gradeN<=5 ? "friendly and clear, like talking to a curious 9-year-old"
                 : gradeN<=8 ? "conversational and engaging, like talking to a 12-year-old"
                 :             "thoughtful and detailed, like talking to a 16-year-old";
  const imgStyle = gradeN<=4 ? "colorful cartoon illustration or friendly diagram"
                 : gradeN<=8 ? "labeled educational diagram or real photograph"
                 :             "real photograph or detailed scientific diagram";
  const allSubjOpts = [...(SUBJECT_OPTIONS||[]),...(family.customSubjects||[])];
  const subjLabels  = (family.subjects||[]).map(id=>allSubjOpts.find(s=>s.id===id)).filter(Boolean).map(s=>s.label);
  const subjList    = subjLabels.join(", ")||"general subjects";
  const curriculum  = curriculumContext(family);
  const systemPrompt =
`You are Bloom, a warm homeschool tutor for ${child.name}, a ${gradeRaw} student. Only help with school subjects.
Grade: ${gradeRaw} | Subjects: ${subjList} | Approach: ${curriculum}
Hint mode: ${hintMode?"ON -- guide with questions, never give full answers":"OFF -- explain fully and clearly"}
Tone: ${tone}. Be warm, enthusiastic, encouraging. Use simple analogies.
SAFETY: Only answer about school subjects. If off-topic say: "That's outside my garden! Ask me about ${subjList} [plant]"
Never share personal info, links, or age-inappropriate content.
IMAGE: If a visual helps, end with exactly: IMAGE_REQUEST: [specific ${imgStyle} showing: topic]`;

  const msgs = [...history.slice(-8), {role:"user", content:question}];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:1000, system:systemPrompt, messages:msgs})
  });
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  let rawText = data.content?.map(b=>b.text||"").join("")||"";
  let imgUrl=null, imgAlt=null;
  const imgMatch = rawText.match(/IMAGE_REQUEST:\s*(.+)$/m);
  if(imgMatch) {
    rawText = rawText.replace(/IMAGE_REQUEST:\s*.+$/m,"").trim();
    imgAlt  = imgMatch[1].trim();
    try {
      const sr = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Find one educational image URL for a ${gradeRaw} student: ${imgAlt}. Return ONLY the direct image URL (.jpg .png .gif .webp .svg). No explanation.`}]
        })
      });
      const sd=await sr.json();
      const st=sd.content?.map(b=>b.text||"").join("")||"";
      const um=st.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg)[^\s"'<>]*/i);
      if(um) imgUrl=um[0];
    } catch(e){}
  }
  return {text:rawText, imgUrl, imgAlt};
}

/* ----------------------------------------------------------
   PORTFOLIO NARRATOR  (called from PortfolioScreen)
   ---------------------------------------------------------- */
async function generatePortfolioNarrative({child, entries, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const recent = entries.filter(e=>!e.isDay&&e.subj!=="Daily Note").slice(0,30);
  const bySubj = {};
  recent.forEach(e=>{ if(!bySubj[e.subj]) bySubj[e.subj]=[]; bySubj[e.subj].push(e.note||e.title||e.subj); });
  const summary = Object.entries(bySubj).map(([s,ns])=>s+": "+ns.slice(0,3).join("; ")).join("\n");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:
`Write a warm, professional 3-4 paragraph portfolio narrative for ${child.name} (${child.grade}).
Curriculum: ${curriculumContext(family)}
Recent learning:\n${summary||"No entries yet"}
Third person. No bullets. Sound like a caring teacher who knows this child well.`}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   GOAL SUGGESTIONS  (called from GoalsScreen)
   ---------------------------------------------------------- */
async function getGoalSuggestions(family) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const allGoalObjs = [...(GOALS||[]),...(family.customGoals||[])];
  const activeGoals = (family.goals||[]).map(id=>allGoalObjs.find(x=>x.id===id)).filter(Boolean);
  const prompt =
`Homeschool family: ${(family.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ")||"not specified"}
Approach: ${curriculumContext(family)} | State: ${family.state||"?"} | Current goals: ${activeGoals.map(g=>g.label).join(", ")||"none"}
Suggest 6 meaningful learning goals (mix academic, life skills, character). Each under 10 words.
Respond ONLY with a JSON array of 6 strings. No markdown.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  const raw=data.content?.map(b=>b.text||"").join("")||"[]";
  const arr=JSON.parse(raw.replace(/```json|```/g,"").trim());
  return Array.isArray(arr)?arr.slice(0,6):[];
}

/* ----------------------------------------------------------
   CURRICULUM ADVISOR  (called from LearnScreen)
   ---------------------------------------------------------- */
async function getCurriculumAdvice({messages, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const system =
`You are a warm, experienced homeschool curriculum advisor.
Family: ${(family.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ")} | Approach: ${curriculumContext(family)} | State: ${family.state||"?"}
Give practical, specific, encouraging advice. Concise and actionable.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:700,system,messages})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   TOMORROW'S LESSON  (called from EntryDetailModal)
   ---------------------------------------------------------- */
async function buildTomorrowsLesson({entry, child, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const prompt =
`Create a specific engaging follow-up lesson for tomorrow based on what ${child?.name||"the student"} did in ${entry.subj} ("${entry.note||entry.title||entry.subj}").
Student: ${child?.name}, ${child?.grade} | Approach: ${curriculumContext(family)}
Include: activity title, materials needed, step-by-step instructions, extension idea. Practical and fun.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* ----------------------------------------------------------
   GAP ACTIVITY IDEAS  (called from HomeScreen gap card)
   ---------------------------------------------------------- */
async function getGapActivityIdeas({subjectLabel, child, family}) {
  const apiKey = (()=>{ try{ return localStorage.getItem("rootbloom_apikey")||""; }catch(e){return "";} })();
  if(!apiKey) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:
`Suggest 3 quick fun hands-on activities (15-30 min each) for a ${child?.grade||"elementary"} student to re-engage with ${subjectLabel}. Fun name, materials, steps. Exciting for a child.`}]})
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.content?.map(b=>b.text||"").join("")||"";
}

/* =======================================
   AI CHAT MODAL - Root & Bloom Assistant
   Full-featured: worksheets, crafts, fun facts,
   book recs, lessons, activities + PDF output
======================================= */
function AIChatModal({ pal, family, portfolioEntries=[], onClose }) {
  const firstChild = family.children[0] || {};
  const initGreeting = "Hi! I\u2019m your Root & Bloom assistant \ud83c\udf31\n\nI can help you with:\n\u2022 Worksheets & printable activities\n\u2022 Craft ideas & hands-on projects\n\u2022 Fun facts on any topic\n\u2022 Book recommendations\n\u2022 Lesson plans & unit studies\n\u2022 Explaining concepts differently\n\u2022 Field trip ideas & nature studies\n\nJust tell me what you need \u2014 or tap a suggestion below!";
  const [messages, setMessages] = useState([{ role:"assistant", content:initGreeting }]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [docReady, setDocReady] = useState(null); // {title, content} when downloadable
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const childNames = (family?.children||[]).map(c=>c.name+" ("+c.grade+")").join(", ");
  const activeSubjLabels = (family?.subjects||[]).map(id=>[...SUBJECT_OPTIONS,...(family.customSubjects||[])].find(s=>s.id===id)?.label).filter(Boolean).join(", ");

  // Build recent activity context from portfolio
  const recentActivity = React.useMemo(()=>{
    const recent = portfolioEntries.filter(e=>!e.isDay&&e.note&&e.note.trim()).slice(0,10);
    if(recent.length===0) return "";
    return "Recent learning: "+recent.map(e=>{
      const ch = family.children[e.childIdx]?.name||"";
      return ch+" studied "+e.subj+(e.note?" ("+e.note.replace("AI Summary:","").trim().slice(0,60)+")":"");
    }).join("; ");
  }, [portfolioEntries, family]);

  // Context-aware quick prompts using real child/subject data
  const QUICK = React.useMemo(()=>{
    const c = firstChild;
    const subjs = activeSubjLabels ? activeSubjLabels.split(", ").slice(0,3) : ["Math","Science","Reading"];
    const subj1 = subjs[0]||"Math";
    const subj2 = subjs[1]||"Science";
    return [
      "\ud83c\udfa8 Give me a fun craft idea for "+subj1+" \u2014 "+c.grade+" level",
      "\u2728 Fun facts about "+subj2+" for "+c.name,
      "\ud83d\udcda Recommend books for "+c.name+" ("+c.grade+")",
      "\ud83d\udcdd Make a worksheet on "+subj1+" for "+c.grade+" grade",
      "\ud83d\udd2c Fun hands-on activity for "+subj2,
      "\ud83c\udf0d Plan a field trip or outdoor lesson on Nature Study",
    ];
  }, [firstChild, activeSubjLabels]);

  const systemPrompt =
    "You are a warm, creative homeschool assistant for Root & Bloom. You help parents with practical, specific educational content.\n\n"
    +"FAMILY:\n"
    +"- Children: "+(childNames||"not specified")+"\n"
    +"- Curriculum: "+curriculumContext(family)+"\n"
    +"- State: "+(family?.state||"not specified")+"\n"
    +"- Active subjects: "+(activeSubjLabels||"not specified")+"\n"
    +"- Family goals: "+goalSummary(family)+"\n"
    +(recentActivity?("- "+recentActivity+"\n"):"")+"\n"
    +"CAPABILITIES -- when asked, produce these fully and well:\n"
    +"WORKSHEETS: Create complete, print-ready worksheets. Use clear sections, numbered items, blanks (___), word banks for K-5. Include a warm-up, main activity, and extension.\n"
    +"CRAFT IDEAS: Give step-by-step craft instructions with materials list, age-appropriateness, and learning connection. Be specific and fun.\n"
    +"FUN FACTS: Give 5-8 surprising, age-appropriate, engaging facts on the topic. Make them genuinely interesting, not textbook dry.\n"
    +"BOOK RECOMMENDATIONS: Give 4-6 specific book titles with author, age range, and 1-sentence description. Match the child's grade and family's values.\n"
    +"LESSON PLANS: Structure as: Objective, Materials, Hook (5 min), Main Activity (20-30 min), Discussion Questions, Extension.\n"
    +"ACTIVITIES: Be hands-on and specific. Include materials, time needed, step-by-step instructions, and what the child will learn.\n"
    +"FIELD TRIPS: Suggest specific types of places to visit, what to look for, questions to ask, and a follow-up activity.\n"
    +"EXPLAIN IT: When asked to explain a concept, use a story, analogy, or visual description. Match the child's age and learning style.\n\n"
    +"DOCUMENT SIGNAL: When your response is a complete worksheet, lesson plan, craft guide, or structured activity (something a parent would print), start your response with the exact text: [PRINTABLE] on its own line. This signals the app to show a print button.\n\n"
    +"Always shape content to reflect the family's curriculum style and goals. Be warm, specific, and practical. Format clearly with headers and numbered steps.";

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages, loading]);

  const send = async (overrideText) => {
    const text = (overrideText||input).trim();
    if(!text||loading) return;
    const runtimeKey=(()=>{try{return localStorage.getItem("rootbloom_apikey")||"";}catch(e){return "";}})();
    if(!runtimeKey){
      setMessages(m=>[...m,{role:"user",content:text},{role:"assistant",content:"AI features need an API key. Add one in Settings \u2192 AI to get started!"}]);
      setInput(""); return;
    }
    setInput("");
    setDocReady(null);
    const userMsg = {role:"user", content:text};
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.map(m=>({role:m.role, content:m.content}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":runtimeKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,system:systemPrompt,messages:history})
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message);
      let reply = data.content?.map(b=>b.text||"").join("")||"Sorry, I couldn\u2019t get a response. Please try again.";
      // Detect printable signal
      let isPrintable = false;
      if(reply.startsWith("[PRINTABLE]")) {
        isPrintable = true;
        reply = reply.replace(/^\[PRINTABLE\]\n?/,"").trim();
        setDocReady({title: text.slice(0,60), content: reply});
      }
      setMessages(m=>[...m,{role:"assistant",content:reply,printable:isPrintable}]);
    } catch(e) {
      setMessages(m=>[...m,{role:"assistant",content:"Something went wrong. Please check your connection and try again."}]);
    }
    setLoading(false);
  };

  const openPrintDoc = (title, content) => {
    const schoolName = family.schoolName||(family.familyName+" Academy")||"Root & Bloom";
    const today = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const htmlContent = content
      .split("\n").map(line=>{
        if(line.startsWith("# ")) return "<h1 style='font-size:16pt;margin:12px 0 6px;color:#2a4a28'>"+line.slice(2)+"</h1>";
        if(line.startsWith("## ")) return "<h2 style='font-size:13pt;margin:10px 0 4px;color:#2a4a28'>"+line.slice(3)+"</h2>";
        if(line.startsWith("- ")||line.startsWith("* ")) return "<li style='margin-bottom:4px'>"+line.slice(2)+"</li>";
        if(/^\d+\.\s/.test(line)) return "<li style='margin-bottom:5px'>"+line.replace(/^\d+\.\s/,"")+"</li>";
        if(line.trim()==="") return "<br>";
        return "<p style='margin:4px 0;line-height:1.7'>"+line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")+"</p>";
      }).join("\n");
    const html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>"+title+"</title>"
      +"<style>*{box-sizing:border-box}body{font-family:Georgia,serif;font-size:11pt;color:#1a1a1a;padding:0.75in;max-width:8.5in;margin:0 auto;line-height:1.6}"
      +"h1,h2{font-family:Arial,sans-serif}li{margin-left:1.5em}"
      +".header{border-bottom:2px solid #2a4a28;padding-bottom:8px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:baseline}"
      +".footer{border-top:1px solid #ddd;margin-top:20px;padding-top:8px;font-size:8pt;color:#aaa;display:flex;justify-content:space-between}"
      +"@media print{button{display:none!important}@page{margin:1cm;size:letter}}"
      +"button.print-btn{background:#2a4a28;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:10pt;cursor:pointer;margin-top:16px}"
      +"</style></head><body>"
      +"<div class='header'><div style='font-size:14pt;font-weight:bold'>"+title+"</div><div style='font-size:9pt;color:#888'>"+schoolName+" \u00b7 "+today+"</div></div>"
      +htmlContent
      +"<div class='footer'><span>"+schoolName+"</span><span>Generated by Root &amp; Bloom</span></div>"
      +"<div style='text-align:center'><button class='print-btn' onclick='window.print()'>&#128438; Print / Save PDF</button></div>"
      +"<script>window.onload=function(){setTimeout(function(){window.print();},700);};<\/script>"
      +"</body></html>";
    const w = window.open("","_blank","width=820,height=980,scrollbars=yes");
    if(w){w.document.write(html);w.document.close();}
  };

  const renderMessage = (text) => {
    return text.split("\n").map((line,i)=>{
      const bold = line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
      if(line.startsWith("# ")||line.startsWith("## "))
        return <div key={i} style={{fontWeight:"800",color:pal.ink,fontSize:line.startsWith("# ")?"0.95rem":"0.87rem",margin:"0.5rem 0 0.2rem"}} dangerouslySetInnerHTML={{__html:bold.replace(/^#{1,3}\s/,"")}}/>;
      if(line.startsWith("- ")||line.startsWith("* "))
        return <div key={i} style={{paddingLeft:"1rem",marginBottom:"2px"}} dangerouslySetInnerHTML={{__html:"\u2022 "+bold.slice(2)}}/>;
      if(/^\d+\.\s/.test(line))
        return <div key={i} style={{paddingLeft:"0.5rem",marginBottom:"3px"}} dangerouslySetInnerHTML={{__html:bold}}/>;
      return <div key={i} style={{marginBottom:line===""?"0.35rem":"0"}} dangerouslySetInnerHTML={{__html:bold||"&nbsp;"}}/>;
    });
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",background:pal.sand,maxWidth:"430px",margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:pal.heroGrad,padding:"0.9rem 1.1rem",display:"flex",alignItems:"center",gap:"0.75rem",flexShrink:0}}>
        <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{"\ud83c\udf31"}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:"800",color:"#fff",fontSize:"0.95rem"}}>{"Root & Bloom Assistant"}</div>
          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)"}}>{"Worksheets, crafts, fun facts, books & more"}</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"8px",padding:"0.3rem 0.65rem",color:"#fff",cursor:"pointer",fontSize:"0.8rem",fontWeight:"700"}}>{"x"}</button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {messages.map((m,i)=>(
          <div key={i}>
            <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:"0.5rem",alignItems:"flex-end"}}>
              {m.role==="assistant"&&(
                <div style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",flexShrink:0,marginBottom:"2px"}}>{"\ud83c\udf31"}</div>
              )}
              <div style={{maxWidth:"82%",padding:"0.65rem 0.9rem",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?pal.accentGrad:pal.linen,color:m.role==="user"?"#fff":pal.ink,fontSize:"0.82rem",lineHeight:1.6,border:m.role==="assistant"?("1px solid "+pal.stone+"50"):"none"}}>
                {renderMessage(m.content)}
              </div>
            </div>
            {m.printable&&(
              <div style={{display:"flex",justifyContent:"flex-start",paddingLeft:"36px",marginTop:"0.4rem"}}>
                <button onClick={()=>openPrintDoc(messages[i-1]?.content?.slice(0,60)||"Document", m.content)}
                  style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.4rem 0.85rem",background:"#2a4a28",border:"none",borderRadius:"20px",color:"#fff",fontSize:"0.74rem",fontWeight:"700",cursor:"pointer"}}>
                  <span>{"\ud83d\udda8\ufe0f"}</span><span>{"Print / Save PDF"}</span>
                </button>
              </div>
            )}
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <div style={{width:"28px",height:"28px",borderRadius:"50%",background:pal.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem"}}>{"\ud83c\udf31"}</div>
            <div style={{background:pal.linen,border:"1px solid "+pal.stone+"50",borderRadius:"16px 16px 16px 4px",padding:"0.65rem 0.9rem"}}>
              <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                {[0,1,2].map(j=><div key={j} style={{width:"7px",height:"7px",borderRadius:"50%",background:pal.primary,animation:"bounce 0.9s "+j*0.15+"s ease-in-out infinite"}}/>)}
              </div>
            </div>
          </div>
        )}
        {/* Quick prompts -- show at start */}
        {messages.length===1&&!loading&&(
          <div style={{display:"flex",flexDirection:"column",gap:"0.35rem",marginTop:"0.25rem"}}>
            {QUICK.map((q,i)=>(
              <button key={i} onClick={()=>send(q)}
                style={{padding:"0.5rem 0.85rem",border:"1.5px solid "+pal.primary+"35",borderRadius:"12px",background:"#fff",color:pal.inkM,fontSize:"0.77rem",fontWeight:"600",cursor:"pointer",textAlign:"left",lineHeight:1.4}}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"0.75rem 1rem",borderTop:"1.5px solid "+pal.stone+"40",background:pal.linen,flexShrink:0}}>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-end"}}>
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={"Ask for a worksheet, craft idea, fun facts, book recommendations..."}
            rows={2}
            style={{flex:1,resize:"none",padding:"0.6rem 0.8rem",border:"1.5px solid "+pal.stone+"60",borderRadius:"12px",background:"#fff",fontSize:"0.82rem",fontFamily:"inherit",color:pal.ink,outline:"none",lineHeight:1.5}}
          />
          <button onClick={()=>send()} disabled={!input.trim()||loading}
            style={{width:"40px",height:"40px",borderRadius:"50%",border:"none",background:input.trim()&&!loading?pal.accentGrad:"#ccc",color:"#fff",fontSize:"1.1rem",cursor:input.trim()&&!loading?"pointer":"default",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>
            {"\u2191"}
          </button>
        </div>
        <div style={{fontSize:"0.67rem",color:pal.slate,marginTop:"0.35rem",textAlign:"center"}}>{"Enter to send \u00b7 Shift+Enter for new line"}</div>
      </div>
      <style>{"@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}"}</style>
    </div>
  );
}

