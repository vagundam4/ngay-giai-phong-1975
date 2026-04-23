// GET /api/leaderboard – lấy top 10
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestGet({ env }) {
  try {
    const raw = await env.LEADERBOARD_KV.get('records');
    const records = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(records.slice(0, 10)), { headers: CORS });
  } catch(e) {
    return new Response(JSON.stringify([]), { headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}
