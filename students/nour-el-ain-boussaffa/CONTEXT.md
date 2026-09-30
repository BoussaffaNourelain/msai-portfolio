# My page — status

## Note on this file
The `CONTEXT.md` and `CLAUDE.md` files at the top level of `msai-portfolio/` belong to
another student (Juan Pablo Arnedo) — he committed them to the shared repo by mistake.
Ignore them; this file, inside my own folder, is the real one to keep updated.

## What is done (2026-09-30)
- **Contact form and "Ask About Me" chat assistant**, both live and verified working:
  - `/api/contact` and `/api/chat` in the shared `src/index.js` Worker (permission
    granted earlier to touch these few shared/root files, since one Worker has to serve
    every student's requests).
  - Deployed to `https://msai-portfolio-contact.boussaffanourelain.workers.dev`.
  - Secrets set on the Worker: `TURNSTILE_SECRET`, `RESEND_API_KEY`, `CONTACT_TO`.
  - Chat uses Cloudflare Workers AI (an `AI` binding — no API key needed) and answers
    only from my own page's text, in the third person, with all the required caps
    (500 chars in, 150 words out, 10 messages per conversation, Turnstile per message).
  - Known limitation: email currently sends from Resend's shared test address
    (`onboarding@resend.dev`), since I don't have my own verified domain yet. Switch to
    `contact@<my domain>` once I do.

- **Full visual redesign — "Warm Editorial" direction** (2026-09-30):
  - My own copy of the stylesheet: `students/nour-el-ain-boussaffa/style.css` (no longer
    linking to the shared `assets/style.css` — every one of my pages points at my own
    copy, so restyling never touches anyone else's page).
  - New palette/type: raspberry accent (`#A8285A`), Instrument Serif (italic) paired with
    Hanken Grotesk, single centered column instead of the two-column class layout.
  - Redrew all three project illustrations (`project-training.svg`,
    `project-guesthouse.svg`, `project-atc.svg`) in the new palette.
  - Added `favicon.svg` (a simple monogram), a real `<meta name="description">`, and
    Open Graph / Twitter card tags including a generated `og-image.png` (1200×630).
  - Checked at phone width (375px): name and role are both visible without scrolling,
    and the layout stacks cleanly.
  - All existing links (nav anchors, project pages, LinkedIn/GitHub/Résumé, "All
    students") kept exactly as they were — only styling and layout changed.

## Still TO DO
- Get a real domain, set it up in Cloudflare and Resend, then switch the "from" address
  in `src/index.js` and the `og:url` / `og:image` URLs in `index.html` over to it.
- Take the two screenshots the assignment asked for (`contact.png` of a received email,
  `secrets.png` of the Cloudflare Variables and Secrets page) if not already saved.
