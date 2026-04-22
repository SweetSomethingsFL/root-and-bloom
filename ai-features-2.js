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
