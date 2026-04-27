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
    _sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.SUPABASE_KEY = SUPABASE_KEY;
  }
  return _sbClient;
}

/* ---------- SAVE ----------
   Writes the full app state blob to Supabase in the background.
   localStorage is always written first (instant / offline).
   Called from savePersist() in index.html.
------------------------------------------------------------ */
function sbSave(obj) {
  var sb = getSB();
  if (!sb) return;
  sb.auth.getUser().then(function(res) {
    if (res.data && res.data.user) {
      sb.from(SB_TABLE)
        .upsert(
          { user_id: res.data.user.id, payload: obj, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        )
        .then(function() {});
    }
  });
}

/* ---------- LOAD ----------
   Pulls the family data blob from Supabase after login.
   Returns the payload object or null.
------------------------------------------------------------ */
async function loadFromSupabase(sb) {
  try {
    var res  = await sb.auth.getUser();
    var user = res.data && res.data.user;
    if (!user) return null;
    var result = await sb.from(SB_TABLE)
      .select("payload")
      .eq("user_id", user.id)
      .single();
    if (result.error || !result.data) return null;
    return result.data.payload;
  } catch(e) { return null; }
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
