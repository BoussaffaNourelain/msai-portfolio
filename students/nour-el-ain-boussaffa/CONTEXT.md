# My page — status

## Note on this file
The `CONTEXT.md` and `CLAUDE.md` files at the top level of `msai-portfolio/` belong to
another student (Juan Pablo Arnedo) — he committed them to the shared repo by mistake.
Ignore them; this file, inside my own folder, is the real one to keep updated.

## What is done (2026-09-29)
- Added a Contact section to my page: `students/nour-el-ain-boussaffa/index.html`
  - Fields: name, email, message, a Cloudflare Turnstile widget, and a hidden honeypot field.
  - On submit, sends a JSON request to `/api/contact` and shows a plain status message.
- Added the backend that receives that form, as a Cloudflare Worker (this lives at the
  top level of the repo, not in my folder, because a single Worker has to serve every
  student's `/api/contact` request — I got explicit permission to add these shared files):
  - `src/index.js` — checks the Turnstile token, the honeypot, the required fields, and
    the length limits, then sends the message with Resend.
  - `wrangler.toml`, `package.json`, `.gitignore` — the setup needed to deploy that Worker.

## Still TO DO (I can't do these from the code editor — they need my own accounts)
- Create/paste a real Cloudflare Turnstile site key into
  `students/nour-el-ain-boussaffa/index.html` (currently a placeholder).
- Get a Cloudflare Turnstile **secret** key and a Resend **API key**, and a "From" address
  on a domain verified with Resend.
- Run `npm install` then `wrangler login` and `wrangler deploy` from the repo root to
  actually publish `src/index.js` as a Worker.
- Set the three secrets Cloudflare needs (`wrangler secret put TURNSTILE_SECRET`, etc.)
- Point a Cloudflare Worker Route at `/api/contact` on the site's real domain, and fill in
  `env.CONTACT_TO` and the `from:` address in `src/index.js` for real values.
- Important: the class site is hosted on GitHub Pages, which cannot run server code by
  itself. The Worker only works if the domain is also set up behind Cloudflare with a
  route for `/api/contact` — plain GitHub Pages alone will not run `src/index.js`.
