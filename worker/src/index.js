function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders(env) });
    }

    const origin = request.headers.get('Origin') || '';
    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders(env) });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return new Response('Bad request', { status: 400, headers: corsHeaders(env) });
    }

    // Only forward a plain text field — never pass the caller's payload
    // through to Slack verbatim, since that would let anyone hitting this
    // endpoint control arbitrary Slack message formatting/blocks.
    const text = typeof payload.text === 'string' ? payload.text.slice(0, 2000) : '';
    if (!text) {
      return new Response('Bad request', { status: 400, headers: corsHeaders(env) });
    }

    const slackRes = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    return new Response(JSON.stringify({ ok: slackRes.ok }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
    });
  },
};
