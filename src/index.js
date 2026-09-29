const GENERIC_ERROR = 'Something went wrong — please try again';

function errorResponse() {
  return new Response(JSON.stringify({ error: GENERIC_ERROR }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token, secret, ip) {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token || '');
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  return data.success === true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact' || request.method !== 'POST') {
      return new Response('Not found', { status: 404 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return errorResponse();
    }

    const { name, email, message, turnstileToken, website } = payload;

    try {
      // 1. Verify the Turnstile token with Cloudflare's siteverify API; reject if it fails.
      const ip = request.headers.get('CF-Connecting-IP');
      const humanVerified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, ip);
      if (!humanVerified) return errorResponse();

      // 2. Reject if the honeypot field is filled.
      if (website) return errorResponse();

      // 3. Require all three fields.
      if (!name || !email || !message) return errorResponse();

      // 4. Cap field lengths.
      if (name.length > 100 || email.length > 200 || message.length > 5000) return errorResponse();

      // Send with Resend, server-side only — the browser never talks to Resend.
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'contact@YOUR-DOMAIN',
          to: env.CONTACT_TO,
          reply_to: email,
          subject: `New message from ${name} (site contact form)`,
          text: message,
        }),
      });
      if (!resendRes.ok) return errorResponse();

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return errorResponse();
    }
  },
};
