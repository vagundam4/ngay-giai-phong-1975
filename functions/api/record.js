// POST /api/record – lưu thành tích người chơi
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestPost({ request, env }) {
  try {
    const rec = await request.json();
    rec.timestamp = Date.now();
    // Sanitize
    rec.name     = String(rec.name||'').substring(0,50);
    rec.position = String(rec.position||'').substring(0,50);
    rec.bu       = String(rec.bu||'').substring(0,50);
    rec.score    = Number(rec.score)||0;
    rec.time     = Number(rec.time)||0;
    rec.won      = Boolean(rec.won);
    rec.date     = String(rec.date||'').substring(0,20);

    const raw = await env.LEADERBOARD_KV.get('records');
    const records = raw ? JSON.parse(raw) : [];
    records.push(rec);
    // Sort: score desc → time asc
    records.sort((a,b) => (b.score - a.score) || (a.time - b.time));
    await env.LEADERBOARD_KV.put('records', JSON.stringify(records.slice(0, 200)));
    return new Response(JSON.stringify({ok:true}), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify({error:e.message}), { status:500, headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}
