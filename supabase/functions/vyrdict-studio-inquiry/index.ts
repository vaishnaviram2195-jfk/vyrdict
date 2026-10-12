import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const url = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const alertInbox = Deno.env.get("VYRDICT_STUDIO_ALERT_TO") || "hello@vyrdict.com";
const dbHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "content-type": "application/json" };
const maxBody = 12000;
const attempts = new Map<string, { count: number; until: number }>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cors(origin: string | null) {
  const allowed = origin === "https://vyrdict.com" || origin === "https://www.vyrdict.com"
    || /^https:\/\/vyrdict-[a-z0-9-]+-vaishnaviram2195-3382s-projects\.vercel\.app$/.test(origin || "");
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "https://vyrdict.com",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
}
function limited(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "").split(",")[0].trim();
  if (!ip) return false;
  const now = Date.now();
  if (attempts.size > 2000) for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
  const value = attempts.get(ip);
  if (!value || value.until < now) { attempts.set(ip, { count: 1, until: now + 60000 }); return false; }
  value.count++;
  return value.count > 6;
}
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]!));

async function notify(id: string, fields: Record<string, string>) {
  if (!emailPattern.test(alertInbox)) throw new Error("Invalid Studio notification inbox");
  const uniqueKey = `studio-inquiry:${id}`;
  const text = [
    "A new VYRDICT Studio application has been received.",
    "", `Name: ${fields.name}`, `Email: ${fields.email}`,
    `Brand / company: ${fields.company}`, `Service: ${fields.service || "Not specified"}`,
    "", fields.brief, "", `Application reference: ${id}`
  ].join("\n");
  const html = `<!doctype html><html lang="en"><body style="font-family:Arial,sans-serif;color:#34242a;background:#fff;padding:24px"><h1 style="font-size:22px">New VYRDICT Studio application</h1><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(text)}</p></body></html>`;
  const queued = await fetch(`${url}/rest/v1/vyrdict_email_outbox?on_conflict=unique_key&select=id,dispatch_token,status`, {
    method: "POST",
    headers: { ...dbHeaders, Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      kind: "studio_inquiry", to_email: alertInbox,
      subject: "New VYRDICT Studio application",
      text_body: text, html_body: html, unique_key: uniqueKey
    }),
    signal: AbortSignal.timeout(10000)
  });
  if (!queued.ok) throw new Error(`Notification queue returned ${queued.status}`);
  let item = (await queued.json())[0];
  if (!item) {
    const existing = await fetch(`${url}/rest/v1/vyrdict_email_outbox?unique_key=eq.${encodeURIComponent(uniqueKey)}&select=id,dispatch_token,status&limit=1`, {
      headers: dbHeaders, signal: AbortSignal.timeout(10000)
    });
    if (!existing.ok) throw new Error("Could not read queued notification");
    item = (await existing.json())[0];
  }
  if (!item) throw new Error("Notification was not queued");
  if (item.status === "sent") return "sent";
  try {
    const response = await fetch(`${url}/functions/v1/vyrdict-email-dispatch`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: item.id, token: item.dispatch_token }),
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json().catch(() => ({}));
    return response.ok && result.ok ? "sent" : "queued";
  } catch { return "queued"; }
}

Deno.serve(async (req: Request) => {
  const headers = cors(req.headers.get("origin"));
  const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  if (limited(req)) return respond({ error: "Please wait a minute before trying again." }, 429);
  if (Number(req.headers.get("content-length") || 0) > maxBody) return respond({ error: "Application is too long." }, 413);

  try {
    const raw = await req.text();
    if (raw.length > maxBody) return respond({ error: "Application is too long." }, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return respond({ error: "Invalid application." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return respond({ error: "Invalid application." }, 400);
    if (String(body.website || "").trim()) return respond({ ok: true });

    const fields = {
      name: String(body.name || "").trim(), company: String(body.company || "").trim(),
      email: String(body.email || "").trim(), brief: String(body.brief || "").trim(),
      service: String(body.service || "").trim()
    };
    if (!fields.name || !fields.company || !fields.email || !fields.brief) return respond({ error: "Please complete all required fields." }, 400);
    if (!emailPattern.test(fields.email)) return respond({ error: "Please enter a valid email." }, 400);
    if (fields.name.length > 140 || fields.company.length > 180 || fields.email.length > 254 || fields.brief.length > 3000 || fields.service.length > 180) {
      return respond({ error: "One or more fields are too long." }, 400);
    }
    const id = body.submission_id ? String(body.submission_id) : crypto.randomUUID();
    if (!uuidPattern.test(id)) return respond({ error: "Invalid application reference." }, 400);
    const saved = await fetch(`${url}/rest/v1/studio_inquiries`, {
      method: "POST", headers: { ...dbHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({
        id, ...fields, source: "vyrdict-studio",
        user_agent: req.headers.get("user-agent")?.slice(0,500) || null
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!saved.ok) {
      const error = await saved.json().catch(() => ({}));
      if (error.code !== "23505") throw new Error(`Application save returned ${saved.status}`);
      const previous = await fetch(`${url}/rest/v1/studio_inquiries?id=eq.${id}&select=name,company,email,brief,service&limit=1`, {
        headers: dbHeaders, signal: AbortSignal.timeout(10000)
      });
      if (!previous.ok) throw new Error("Could not verify application retry");
      const existing = (await previous.json())[0];
      if (!existing || Object.entries(fields).some(([key,value]) => String(existing[key] || "") !== value)) {
        return respond({ error: "This application reference has already been used. Please refresh and try again." }, 409);
      }
    }
    let notification = "queued";
    try { notification = await notify(id, fields); }
    catch (error) { console.error("Studio notification queue failed", String(error)); notification = "unavailable"; }
    return respond({ ok: true, notification });
  } catch (error) {
    console.error("Studio application failed", String(error));
    return respond({ error: "Could not submit right now. Please try again." }, 500);
  }
});
