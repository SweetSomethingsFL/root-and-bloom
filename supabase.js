/* ============================================================
   supabase.js  —  Root & Bloom Supabase layer
   Plain JS (no Babel/JSX). Loaded before all Babel scripts.
   All Supabase logic lives here. Never put Supabase code
   directly in index.html or screens.js.
   ============================================================ */

/* ---------- CONFIG ---------- */
var SUPABASE_URL = "https://yykonehakqypwwrwfbpg.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5a29uZWhha3F5cHd3cndmYnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTk4MjQsImV4cCI6MjA5Mjg3NTgyNH0.iuiyhhFa5_574dslaHyhMX1npwz9fDb8Rwzx9nGO4Fw";
var SB_TABLE     = "family_data";
// Also expose on window so Babel scripts can read them reliably
window.SUPABASE_KEY = SUPABASE_KEY;
window.SB_TABLE     = SB_TABLE;
window.SUPABASE_URL = SUPABASE_URL;

/* ---------- CLIENT ---------- */
var _sbClient = null;
function getSB() {
  if (!_sbClient && window.supabase && SUPABASE_KEY !== "PASTE_YOUR_ANON_KEY_HERE") {
    _sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    window.SUPABASE_KEY = SUPABASE_KEY;
  }
  return _sbClient;
}
// Reset client (call after sign in to ensure fresh session is picked up)
function resetSB() {
  _sbClient = null;
}

/* ---------- SAVE ----------
   Writes the full app state blob to Supabase in the background.
   localStorage is always written first (instant / offline).
   Called from savePersist() in index.html.
------------------------------------------------------------ */
function sbSave(obj) {
  var sb = getSB();
  if (!sb) { console.log("sbSave: no sb client"); return; }
  sb.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;
    if (!session || !session.user) return;
    var token = session.access_token;
    // Use fetch directly with the session token to bypass any client auth issues
    fetch(SUPABASE_URL + "/rest/v1/" + SB_TABLE, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({ user_id: session.user.id, payload: obj, updated_at: new Date().toISOString() })
    }).then(function(r) {
      if (!r.ok) { r.text().then(function(t){ console.error("sbSave fetch error:", r.status, t); }); }
    }).catch(function(e){ console.error("sbSave fetch exception:", e); });
  });
}

/* ---------- LOAD ----------
   Pulls the family data blob from Supabase after login.
   Returns the payload object or null.
------------------------------------------------------------ */
async function loadFromSupabase(sb) {
  try {
    var res     = await sb.auth.getSession();
    var session = res.data && res.data.session;
    if (!session || !session.user) return null;
    var token = session.access_token;
    var r = await fetch(SUPABASE_URL + "/rest/v1/" + SB_TABLE + "?user_id=eq." + session.user.id + "&select=payload&limit=1", {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    if (!r.ok) { console.error("loadFromSupabase error:", r.status); return null; }
    var rows = await r.json();
    return (rows && rows.length > 0) ? rows[0].payload : null;
  } catch(e) { console.error("loadFromSupabase exception:", e); return null; }
}

/* ---------- DELETE ACCOUNT ----------
   Calls the Supabase Edge Function "delete-account" which uses
   the service-role key (server-side only) to remove the auth user.
   The family_data row is deleted automatically via ON DELETE CASCADE.

   Edge Function source is in /supabase/functions/delete-account/index.ts
   Deploy once with:  supabase functions deploy delete-account
------------------------------------------------------------ */
async function sbDeleteAccount() {
  var sb = getSB();
  if (!sb) return { error: "Not connected" };
  try {
    var sessionRes = await sb.auth.getSession();
    var token = sessionRes.data && sessionRes.data.session && sessionRes.data.session.access_token;
    if (!token) return { error: "Not logged in" };
    var res = await fetch(SUPABASE_URL + "/functions/v1/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    var json = await res.json();
    if (!res.ok) return { error: json.error || "Delete failed" };
    return { ok: true };
  } catch(e) { return { error: e.message || "Network error" }; }
}

/* ---------- GENERATE NOI DOCUMENT ----------
   Plain JS (no Babel). Called from screens.js via window.generateNOIDoc(family).
   Moved here to avoid Babel 500KB deoptimization in screens.js.
------------------------------------------------------------ */
window.generateNOIDoc = function(family) {
  var win = window.open("","_blank","width=800,height=900,scrollbars=yes");
  if(!win) return;
  var si     = getStateInfo(family.state||"");
  var noi    = si.noi||{};
  var state  = family.state||"";
  var schoolNm   = family.schoolName||(family.familyName+" Academy")||"Home School";
  var parentName = family.parentName||(family.familyName+" Family")||"Parent / Guardian";
  var address    = family.address||"";
  var phone      = family.phone||"";
  var today  = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  var noNotice = noi.type==="none" || !noi.type;
  var isNotarized = noi.notarized===true;
  var frequency = noi.frequency||"";
  var filedTo   = noi.filedTo||"local school district superintendent";
  var noiDeadline = noi.deadline||si.deadline||"";
  var tip       = noi.tip||"";
  var noNoticeNote = noi.noNoticeNote||"";
  var reqFields = noi.requiredFields||[];
  var missingFields = [];
  if(!family.address) missingFields.push("home address (Settings → School)");
  if(!family.phone) missingFields.push("phone number (Settings → School)");
  var childrenMissingDOB = (family.children||[]).filter(function(c){return !c.dob;}).map(function(c){return c.name;});
  if(childrenMissingDOB.length>0) missingFields.push("date of birth for: "+childrenMissingDOB.join(", ")+" (Settings → Students)");
  var childRows = (family.children||[]).map(function(c){
    var dob = c.dob ? new Date(c.dob+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : "<span style='color:#c0392b'>Missing — add in Settings</span>";
    var fullN = c.name+(c.lastName?" "+c.lastName:"");
    return "<tr><td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;font-weight:700'>"+fullN+"</td>"
      +"<td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;color:#555'>"+c.grade+"</td>"
      +"<td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;color:#777'>"+dob+"</td></tr>";
  }).join("");
  var subjList = (family.subjects||[]).length>0
    ? (family.subjects||[]).slice(0,8).join(", ")+(family.subjects.length>8?" and others":"")
    : "language arts, mathematics, science, and social studies";
  var typeLabels = {"letter":"Letter of Intent","affidavit":"Affidavit","form":"Required Form","declaration":"Declaration of Intent","certificate":"Certificate of Enrollment","notice":"Notice of Intent","registration":"School Registration","letter+IHIP":"Letter of Intent (Step 1 of 2 — IHIP also required)","option":"Notice of Intent"};
  var typeLabel = typeLabels[noi.type||"letter"]||"Notice of Intent";
  var stateUrl = si.stateUrl||"https://hslda.org/legal";
  var hsldaUrl = "https://hslda.org/legal/"+state.toLowerCase().replace(/ /g,"-");

  var html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">"
    +"<title>"+typeLabel+" — "+state+"</title>"
    +"<style>"
    +"*{box-sizing:border-box;margin:0;padding:0}"
    +"body{font-family:Georgia,serif;color:#1a1a1a;background:#fff;padding:2.5rem;max-width:700px;margin:0 auto;font-size:11pt;line-height:1.75}"
    +".hdr{border-bottom:3px solid #1a5276;padding-bottom:0.75rem;margin-bottom:1.4rem}"
    +".school{font-size:1.2rem;font-weight:900;color:#1a5276}"
    +".meta{font-size:0.78rem;color:#666;margin-top:3px}"
    +".badge{display:inline-block;background:#1a5276;color:#fff;padding:0.25rem 0.8rem;border-radius:20px;font-size:0.72rem;font-weight:700;font-family:Arial,sans-serif;margin-bottom:1rem}"
    +".info{background:#f0f7ff;border-left:4px solid #1a5276;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#1a5276;line-height:1.5}"
    +".warn{background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#92400e;line-height:1.5}"
    +".missing{background:#fef2f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#7f1d1d;line-height:1.5}"
    +".none{background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#14532d;line-height:1.5}"
    +".resources{background:#f8f8f8;border:1px solid #e5e7eb;border-radius:8px;padding:0.75rem 1rem;margin-top:1.5rem;font-family:Arial,sans-serif;font-size:0.78rem;color:#374151}"
    +".resources a{color:#1a5276;text-decoration:underline}"
    +".body p{margin-bottom:1rem}"
    +"table{width:100%;border-collapse:collapse;margin-bottom:1rem}"
    +"th{padding:0.35rem 0.6rem;background:#f5f5f5;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:#555;font-family:Arial,sans-serif;font-weight:700;text-align:left}"
    +".fields{background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;padding:0.6rem 0.85rem;margin-bottom:1rem;font-size:0.78rem;font-family:Arial,sans-serif;color:#374151}"
    +".fields ul{margin:0.3rem 0 0 1rem;padding:0}"
    +".fields li{margin-bottom:0.2rem}"
    +".notarized{background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:0.4rem 0.8rem;font-size:0.76rem;font-family:Arial,sans-serif;color:#92400e;margin-bottom:1rem;font-weight:700}"
    +".sigs{margin-top:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem}"
    +".sig-line{border-bottom:1.5px solid #333;margin-bottom:4px;height:36px}"
    +".sig-lbl{font-size:0.68rem;color:#666;font-family:Arial,sans-serif}"
    +".footer{margin-top:1.5rem;padding-top:0.75rem;border-top:1px solid #eee;font-size:0.65rem;color:#aaa;text-align:center;font-family:Arial,sans-serif;line-height:1.6}"
    +".pbtn{margin-top:1.25rem;padding:0.55rem 1.4rem;background:#1a5276;color:#fff;border:none;border-radius:8px;font-size:0.92rem;cursor:pointer;font-family:Arial,sans-serif;font-weight:700}"
    +"@media print{.pbtn{display:none}.missing{display:none}.resources{page-break-inside:avoid}}"
    +"</style></head><body>"
    +"<div class=\"hdr\"><div class=\"school\">"+schoolNm+"</div>"
    +"<div class=\"meta\">"+state+" &nbsp;·&nbsp; "+today+"</div></div>"
    +"<div class=\"badge\">"+state+" — "+typeLabel+"</div>"
    +(missingFields.length>0&&!noNotice ? "<div class=\"missing\"><strong>Complete before filing — missing info:</strong><ul style='margin:0.3rem 0 0 1rem'>"+missingFields.map(function(f){return "<li>"+f+"</li>";}).join("")+"</ul></div>" : "")
    +(noNotice
      ? "<div class=\"none\">"+state+" does not require a notice of intent to homeschool. "+noNoticeNote+" You may keep this for your own records.</div>"
      : "<div class=\"info\">"
        +"<strong>Filed to:</strong> "+filedTo+"<br>"
        +"<strong>Frequency:</strong> "+(frequency==="once"?"File once when starting (not annually)":frequency==="annual"?"Required annually":"")+"<br>"
        +(noiDeadline ? "<strong>Deadline:</strong> "+noiDeadline+"<br>" : "")
        +"</div>"
    )
    +(isNotarized ? "<div class=\"notarized\">This document must be notarized (or use an Unsworn Declaration) before filing.</div>" : "")
    +(reqFields.length>0&&!noNotice ? "<div class=\"fields\"><strong>Required information:</strong><ul>"+reqFields.map(function(f){return "<li>"+f+"</li>";}).join("")+"</ul></div>" : "")
    +(tip&&!noNotice ? "<div class=\"warn\">"+tip+"</div>" : "")
    +(noNotice ? "" :
      "<div class=\"body\">"
      +"<p>"+today+"</p>"
      +"<p>To the Superintendent of Schools,<br>"+filedTo+"</p>"
      +"<p>Dear Superintendent,</p>"
      +"<p>I am writing to formally notify you of my intention to provide home instruction for my child(ren) listed below, in accordance with the laws of "+state+".</p>"
      +"<table><thead><tr><th>Student Name</th><th>Grade</th><th>Date of Birth</th></tr></thead><tbody>"+childRows+"</tbody></table>"
      +"<p><strong>School Name:</strong> "+schoolNm+"<br>"
      +"<strong>Parent / Supervisor:</strong> "+parentName+"<br>"
      +"<strong>Address:</strong> "+(address||"<span style='color:#c0392b'>Missing — add in Settings</span>")+"<br>"
      +(phone ? "<strong>Phone:</strong> "+phone+"<br>" : "")
      +"</p>"
      +"<p>Home instruction will include the following subjects: "+subjList+".</p>"
      +(si.attendance ? "<p>Attendance records will be maintained as required by "+state+" law.</p>" : "")
      +(si.workSamples ? "<p>A portfolio of student work samples will be compiled and made available for review as required.</p>" : "")
      +(noi.type==="affidavit"||isNotarized ? "<p>I hereby attest under penalty of law that all information provided herein is true and accurate, and that this home education program will be conducted in compliance with the applicable laws of "+state+".</p>" : "<p>This home education program will be conducted in compliance with the applicable laws of "+state+". Please feel free to contact me with any questions.</p>")
      +"<p>Respectfully,</p>"
      +"</div>"
      +"<div class=\"sigs\">"
      +"<div><div class=\"sig-line\"></div><div class=\"sig-lbl\">Parent / Supervisor Signature</div></div>"
      +"<div><div class=\"sig-line\"></div><div class=\"sig-lbl\">Date</div></div>"
      +"</div>"
      +(isNotarized
        ? "<div style=\"margin-top:1.5rem;border:1px solid #ccc;border-radius:6px;padding:1rem;font-family:Arial,sans-serif;font-size:0.78rem;color:#555\">"
          +"<strong>NOTARY / ACKNOWLEDGMENT</strong><br><br>"
          +"Sworn to and subscribed before me this ______ day of _____________, 20_____.<br><br>"
          +"<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1rem\">"
          +"<div><div style=\"border-bottom:1px solid #333;height:32px;margin-bottom:4px\"></div><div>Notary Public Signature</div></div>"
          +"<div><div style=\"border-bottom:1px solid #333;height:32px;margin-bottom:4px\"></div><div>Commission Expires</div></div>"
          +"</div></div>"
        : "")
      +"<div class=\"resources\"><strong>Where to file &amp; resources for "+state+":</strong><br><br>"
      +"<a href='"+stateUrl+"' target='_blank'>"+state+" Department of Education</a><br>"
      +"<a href='"+hsldaUrl+"' target='_blank'>HSLDA "+state+" Legal Summary</a><br>"
      +"<a href='https://www.nheri.org/state-homeschool-laws/' target='_blank'>NHERI State Homeschool Laws</a>"
      +"</div>"
    )
    +"<div class=\"footer\">"
    +"Generated by Root &amp; Bloom &nbsp;·&nbsp; "+today+"<br>"
    +"This document is a template. Verify current requirements at your state DOE before filing."
    +"</div>"
    +"<button class=\"pbtn\" onclick=\"window.print()\">Print / Save as PDF</button>"
    +"</body></html>";
  win.document.write(html);
  setTimeout(function(){win.document.close();},0);
};
  var schoolNm   = family.schoolName||(family.familyName+" Academy")||"Home School";
  var parentName = family.parentName||(family.familyName+" Family")||"Parent / Guardian";
  var today  = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  var noNotice = noi.type==="none" || !noi.type;
  var isNotarized = noi.notarized===true;
  var frequency = noi.frequency||"";
  var filedTo   = noi.filedTo||"local school district superintendent";
  var noiDeadline = noi.deadline||si.deadline||"";
  var tip       = noi.tip||"";
  var noNoticeNote = noi.noNoticeNote||"";
  var reqFields = noi.requiredFields||[];
  var childRows = (family.children||[]).map(function(c){
    var dob = c.dob ? " | DOB: "+c.dob : "";
    var fullN = c.name+(c.lastName?" "+c.lastName:"");
    return "<tr><td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;font-weight:700'>"+fullN+"</td>"
      +"<td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;color:#555'>"+c.grade+"</td>"
      +"<td style='padding:0.35rem 0.6rem;border-bottom:1px solid #eee;color:#777'>"+dob+"</td></tr>";
  }).join("");
  var subjList = (family.subjects||[]).length>0
    ? (family.subjects||[]).slice(0,8).join(", ")+(family.subjects.length>8?" and others":"")
    : "language arts, mathematics, science, and social studies";
  var typeLabels = {"letter":"Letter of Intent","affidavit":"Affidavit","form":"Required Form","declaration":"Declaration of Intent","certificate":"Certificate of Enrollment","notice":"Notice of Intent","registration":"School Registration","letter+IHIP":"Letter of Intent (Step 1 of 2 — IHIP also required)","option":"Notice of Intent"};
  var typeLabel = typeLabels[noi.type||"letter"]||"Notice of Intent";
  var html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">"
    +"<title>"+typeLabel+" — "+state+"</title>"
    +"<style>"
    +"*{box-sizing:border-box;margin:0;padding:0}"
    +"body{font-family:Georgia,serif;color:#1a1a1a;background:#fff;padding:2.5rem;max-width:700px;margin:0 auto;font-size:11pt;line-height:1.75}"
    +".hdr{border-bottom:3px solid #1a5276;padding-bottom:0.75rem;margin-bottom:1.4rem}"
    +".school{font-size:1.2rem;font-weight:900;color:#1a5276}"
    +".meta{font-size:0.78rem;color:#666;margin-top:3px}"
    +".badge{display:inline-block;background:#1a5276;color:#fff;padding:0.25rem 0.8rem;border-radius:20px;font-size:0.72rem;font-weight:700;font-family:Arial,sans-serif;margin-bottom:1rem}"
    +".info{background:#f0f7ff;border-left:4px solid #1a5276;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#1a5276;line-height:1.5}"
    +".warn{background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#92400e;line-height:1.5}"
    +".none{background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.79rem;font-family:Arial,sans-serif;color:#14532d;line-height:1.5}"
    +".body p{margin-bottom:1rem}"
    +"table{width:100%;border-collapse:collapse;margin-bottom:1rem}"
    +"th{padding:0.35rem 0.6rem;background:#f5f5f5;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:#555;font-family:Arial,sans-serif;font-weight:700;text-align:left}"
    +".fields{background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;padding:0.6rem 0.85rem;margin-bottom:1rem;font-size:0.78rem;font-family:Arial,sans-serif;color:#374151}"
    +".fields ul{margin:0.3rem 0 0 1rem;padding:0}"
    +".fields li{margin-bottom:0.2rem}"
    +".notarized{background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:0.4rem 0.8rem;font-size:0.76rem;font-family:Arial,sans-serif;color:#92400e;margin-bottom:1rem;font-weight:700}"
    +".sigs{margin-top:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem}"
    +".sig-line{border-bottom:1.5px solid #333;margin-bottom:4px;height:36px}"
    +".sig-lbl{font-size:0.68rem;color:#666;font-family:Arial,sans-serif}"
    +".footer{margin-top:1.5rem;padding-top:0.75rem;border-top:1px solid #eee;font-size:0.65rem;color:#aaa;text-align:center;font-family:Arial,sans-serif;line-height:1.6}"
    +".pbtn{margin-top:1.25rem;padding:0.55rem 1.4rem;background:#1a5276;color:#fff;border:none;border-radius:8px;font-size:0.92rem;cursor:pointer;font-family:Arial,sans-serif;font-weight:700}"
    +"@media print{.pbtn{display:none}}"
    +"</style></head><body>"
    +"<div class=\"hdr\"><div class=\"school\">"+schoolNm+"</div>"
    +"<div class=\"meta\">"+state+" &nbsp;·&nbsp; "+today+"</div></div>"
    +"<div class=\"badge\">"+state+" — "+typeLabel+"</div>"
    +(noNotice
      ? "<div class=\"none\">"+state+" does not require a notice of intent to homeschool. "+noNoticeNote+" You may keep this for your own records.</div>"
      : "<div class=\"info\">"
        +"<strong>Filed to:</strong> "+filedTo+"<br>"
        +"<strong>Frequency:</strong> "+(frequency==="once"?"File once when starting (not annually)":frequency==="annual"?"Required annually":"")+"<br>"
        +(noiDeadline ? "<strong>Deadline:</strong> "+noiDeadline+"<br>" : "")
        +"</div>"
    )
    +(isNotarized ? "<div class=\"notarized\">This document must be notarized (or use an Unsworn Declaration) before filing.</div>" : "")
    +(reqFields.length>0&&!noNotice ? "<div class=\"fields\"><strong>Required information:</strong><ul>"+reqFields.map(function(f){return "<li>"+f+"</li>";}).join("")+"</ul></div>" : "")
    +(tip&&!noNotice ? "<div class=\"warn\">"+tip+"</div>" : "")
    +(noNotice ? "" :
      "<div class=\"body\">"
      +"<p>"+today+"</p>"
      +"<p>To the Superintendent of Schools,<br>"+filedTo+"</p>"
      +"<p>Dear Superintendent,</p>"
      +"<p>I am writing to formally notify you of my intention to provide home instruction for my child(ren) listed below, in accordance with the laws of "+state+".</p>"
      +"<table><thead><tr><th>Student Name</th><th>Grade</th><th>Date of Birth</th></tr></thead><tbody>"+childRows+"</tbody></table>"
      +"<p><strong>School Name:</strong> "+schoolNm+"<br>"
      +"<strong>Parent / Supervisor:</strong> "+parentName+"<br>"
      +"<strong>Program Address:</strong> "+(family.address||"____________________________")+"</p>"
      +(!family.address ? "<div class=\"warn\">Add your address in Settings to auto-fill this field.</div>" : "")
      +"<p>Home instruction will include the following subjects: "+subjList+".</p>"
      +(si.attendance ? "<p>Attendance records will be maintained as required by "+state+" law.</p>" : "")
      +(si.workSamples ? "<p>A portfolio of student work samples will be compiled and made available for review as required.</p>" : "")
      +(noi.type==="affidavit"||isNotarized ? "<p>I hereby attest under penalty of law that all information provided herein is true and accurate, and that this home education program will be conducted in compliance with the applicable laws of "+state+".</p>" : "<p>This home education program will be conducted in compliance with the applicable laws of "+state+". Please feel free to contact me with any questions.</p>")
      +"<p>Respectfully,</p>"
      +"</div>"
      +"<div class=\"sigs\">"
      +"<div><div class=\"sig-line\"></div><div class=\"sig-lbl\">Parent / Supervisor Signature</div></div>"
      +"<div><div class=\"sig-line\"></div><div class=\"sig-lbl\">Date</div></div>"
      +"</div>"
      +(isNotarized
        ? "<div style=\"margin-top:1.5rem;border:1px solid #ccc;border-radius:6px;padding:1rem;font-family:Arial,sans-serif;font-size:0.78rem;color:#555\">"
          +"<strong>NOTARY / ACKNOWLEDGMENT</strong><br><br>"
          +"Sworn to and subscribed before me this ______ day of _____________, 20_____.<br><br>"
          +"<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1rem\">"
          +"<div><div style=\"border-bottom:1px solid #333;height:32px;margin-bottom:4px\"></div><div>Notary Public Signature</div></div>"
          +"<div><div style=\"border-bottom:1px solid #333;height:32px;margin-bottom:4px\"></div><div>Commission Expires</div></div>"
          +"</div></div>"
        : "")
    )
    +"<div class=\"footer\">"
    +"Generated by Root &amp; Bloom &nbsp;·&nbsp; "+today+"<br>"
    +"Verify current requirements at "+(si.stateUrl||"https://hslda.org/legal")+"<br>"
    +"This document is a template. Consult your state DOE or HSLDA for the most current requirements."
    +"</div>"
    +"<button class=\"pbtn\" onclick=\"window.print()\">Print / Save as PDF</button>"
    +"</body></html>";
  win.document.write(html);
  setTimeout(function(){win.document.close();},0);
};
