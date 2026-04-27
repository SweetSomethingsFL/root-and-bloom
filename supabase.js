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
  if (!sb) return;
  // refreshSession() ensures we have a fresh token even if the 1-hour access token has expired
  sb.auth.refreshSession().then(function(refreshRes) {
    var session = (refreshRes.data && refreshRes.data.session) ? refreshRes.data.session : null;
    if (!session) {
      // fallback: try getSession in case refresh isn't needed
      sb.auth.getSession().then(function(res) {
        var s = res.data && res.data.session;
        if (!s || !s.user) return;
        _doSave(s.access_token, s.user.id, obj);
      });
      return;
    }
    _doSave(session.access_token, session.user.id, obj);
  }).catch(function() {
    sb.auth.getSession().then(function(res) {
      var s = res.data && res.data.session;
      if (!s || !s.user) return;
      _doSave(s.access_token, s.user.id, obj);
    });
  });
}
function _doSave(token, userId, obj) {
  fetch(SUPABASE_URL + "/rest/v1/" + SB_TABLE, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify({ user_id: userId, payload: obj, updated_at: new Date().toISOString() })
  }).then(function(r) {
    if (!r.ok) { r.text().then(function(t){ console.error("sbSave error:", r.status, t); }); }
    else { console.log("sbSave: saved OK"); }
  }).catch(function(e){ console.error("sbSave exception:", e); });
}

/* ---------- LOAD ----------
   Pulls the family data blob from Supabase after login.
   Returns the payload object or null.
------------------------------------------------------------ */
async function loadFromSupabase(sb) {
  try {
    // Try refresh first to get a fresh token
    var refreshRes = await sb.auth.refreshSession();
    var session = (refreshRes.data && refreshRes.data.session) ? refreshRes.data.session : null;
    if (!session) {
      var fallback = await sb.auth.getSession();
      session = fallback.data && fallback.data.session;
    }
    if (!session || !session.user) return null;
    var r = await fetch(SUPABASE_URL + "/rest/v1/" + SB_TABLE + "?user_id=eq." + session.user.id + "&select=payload&limit=1", {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + session.access_token,
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
