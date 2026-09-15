/* ============================================================
   MSAI Portfolio — peer feedback
   Module 6, Class 6.2. Anonymous to classmates; the author is
   recorded for the instructor so participation can be checked.

   Students: you do NOT need to edit this file, and you should
   not remove the <script> tag that loads it from your page —
   that tag is what puts the Feedback button on your page.
   ============================================================ */
(function () {
  'use strict';

  /* Apps Script web app. Replaced at deploy time. */
  var API = 'https://script.google.com/macros/s/AKfycbxWQeaWELkMK0OI9VlBLf5LRSB4L4-5WetXUXUn2ds8zewqHItIcppaJHfr-0dVE3oJ/exec';
  var LIVE = API.indexOf('script.google.com') !== -1;

  /* Unlock code: from ?key= in the address, or remembered from last time.
     Only the Received list ever needs it; leaving feedback never does. */
  function keyStore(slug, v) {
    try {
      if (v === undefined) return localStorage.getItem('msai-key-' + slug) || '';
      localStorage.setItem('msai-key-' + slug, v);
    } catch (e) {}
    return v || '';
  }
  function keyFromUrl() {
    var m2 = location.search.match(/[?&]key=([^&]+)/);
    return m2 ? decodeURIComponent(m2[1]).trim() : '';
  }

  var path = location.pathname.replace(/\/+$/, '');
  var m = path.match(/\/students\/([^\/]+)$/);
  var SLUG = m ? m[1] : null;          // set on a student page
  var IS_STUDENT_PAGE = !!SLUG;

  /* ---------------- styles ---------------- */
  var css = ''
    + '.fb-btn{position:fixed;right:18px;bottom:18px;z-index:9998;background:#E23B3B;color:#fff;'
    + 'border:0;border-radius:999px;padding:13px 20px;font:600 15px/1 Inter,system-ui,sans-serif;'
    + 'cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.22)}'
    + '.fb-btn:hover{background:#c92f2f}'
    + '.fb-btn .fb-count{background:#fff;color:#E23B3B;border-radius:999px;padding:1px 7px;'
    + 'margin-left:8px;font-weight:800;font-size:13px}'
    + '.fb-scrim{position:fixed;inset:0;background:rgba(17,17,17,.42);z-index:9998;opacity:0;'
    + 'pointer-events:none;transition:opacity .18s}'
    + '.fb-scrim.open{opacity:1;pointer-events:auto}'
    + '.fb-side{position:fixed;top:0;right:0;height:100%;width:min(420px,100%);background:#fff;'
    + 'z-index:9999;transform:translateX(100%);transition:transform .22s ease;display:flex;'
    + 'flex-direction:column;box-shadow:-8px 0 28px rgba(0,0,0,.18);font-family:Inter,system-ui,sans-serif}'
    + '.fb-side.open{transform:none}'
    + '.fb-head{padding:18px 20px;border-bottom:1px solid #E4E8EF;display:flex;align-items:flex-start;gap:12px}'
    + '.fb-head h2{margin:0;font-size:18px;line-height:1.3;color:#111;flex:1}'
    + '.fb-head p{margin:4px 0 0;font-size:13px;color:#4A4A4A;line-height:1.45}'
    + '.fb-x{background:none;border:0;font-size:26px;line-height:1;cursor:pointer;color:#4A4A4A;padding:0 2px}'
    + '.fb-body{padding:18px 20px;overflow:auto;flex:1}'
    + '.fb-tabs{display:flex;gap:6px;padding:12px 20px 0}'
    + '.fb-tab{flex:1;padding:9px 10px;border:1px solid #E4E8EF;background:#F7F9FC;border-radius:8px;'
    + 'font:600 14px Inter,system-ui,sans-serif;color:#4A4A4A;cursor:pointer}'
    + '.fb-tab[aria-selected="true"]{background:#1E6FE0;border-color:#1E6FE0;color:#fff}'
    + '.fb-item{border:1px solid #E4E8EF;border-radius:10px;padding:13px 15px;margin-bottom:11px;background:#F7F9FC}'
    + '.fb-item p{margin:0;font-size:15px;line-height:1.55;color:#111;white-space:pre-wrap}'
    + '.fb-item .fb-when{margin-top:8px;font-size:12px;color:#4A4A4A}'
    + '.fb-empty{color:#4A4A4A;font-size:15px;line-height:1.55}'
    + '.fb-side label{display:block;font:600 13px Inter,system-ui,sans-serif;color:#111;margin:0 0 5px}'
    + '.fb-side input,.fb-side textarea,.fb-side select{width:100%;border:1px solid #E4E8EF;border-radius:8px;'
    + 'padding:10px 12px;font:400 15px/1.5 Inter,system-ui,sans-serif;color:#111;background:#fff}'
    + '.fb-side textarea{min-height:150px;resize:vertical}'
    + '.fb-field{margin-bottom:15px}'
    + '.fb-hint{font-size:12.5px;color:#4A4A4A;margin:5px 0 0;line-height:1.45}'
    + '.fb-send{width:100%;background:#1E6FE0;color:#fff;border:0;border-radius:8px;padding:13px;'
    + 'font:700 15px Inter,system-ui,sans-serif;cursor:pointer}'
    + '.fb-send:hover{background:#1857B4}.fb-send:disabled{opacity:.55;cursor:default}'
    + '.fb-note{margin-top:12px;font-size:13.5px;line-height:1.5;padding:10px 12px;border-radius:8px}'
    + '.fb-note.ok{background:#E9F6EC;color:#1B5E27}.fb-note.err{background:#FDECEC;color:#8E1B1B}'
    + '.fb-review .person{position:relative}'
    + '.fb-pick{position:absolute;left:12px;right:12px;bottom:12px;background:#E23B3B;color:#fff;'
    + 'border:0;border-radius:8px;padding:10px;font:700 14px Inter,system-ui,sans-serif;cursor:pointer;z-index:2}'
    + '.fb-pick:hover{background:#c92f2f}'
    + '.fb-on{background:#fff!important;color:#1E6FE0!important}'
    + '@media (max-width:520px){.fb-side{width:100%}}';
  var st = document.createElement('style'); st.textContent = css;
  document.head.appendChild(st);

  /* ---------------- sidebar shell ---------------- */
  var scrim = el('div', 'fb-scrim');
  var side = el('aside', 'fb-side');
  side.setAttribute('role', 'dialog');
  side.setAttribute('aria-label', 'Peer feedback');
  side.innerHTML =
      '<div class="fb-head"><div style="flex:1"><h2 id="fb-title">Feedback</h2>'
    + '<p id="fb-sub"></p></div><button class="fb-x" aria-label="Close">&times;</button></div>'
    + '<div class="fb-tabs" id="fb-tabs" hidden>'
    + '<button class="fb-tab" id="fb-tab-recv" aria-selected="true">Received</button>'
    + '<button class="fb-tab" id="fb-tab-give" aria-selected="false">Leave feedback</button></div>'
    + '<div class="fb-body" id="fb-body"></div>';
  document.body.appendChild(scrim); document.body.appendChild(side);

  var body = side.querySelector('#fb-body');
  var title = side.querySelector('#fb-title');
  var sub = side.querySelector('#fb-sub');
  var tabs = side.querySelector('#fb-tabs');
  var tRecv = side.querySelector('#fb-tab-recv');
  var tGive = side.querySelector('#fb-tab-give');

  side.querySelector('.fb-x').onclick = close;
  scrim.onclick = close;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && side.classList.contains('open')) close();
  });

  function open() { side.classList.add('open'); scrim.classList.add('open'); }
  function close() { side.classList.remove('open'); scrim.classList.remove('open'); }
  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }
  function pretty(s) { return (s || '').replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

  /* ---------------- api ---------------- */
  function load(slug, key) {
    if (!LIVE) return Promise.reject(new Error('not-configured'));
    var u = API + '?target=' + encodeURIComponent(slug);
    if (key) u += '&key=' + encodeURIComponent(key);
    return fetch(u, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.error === 'locked') throw new Error('locked');
        if (!j || !j.ok) throw new Error('bad');
        return j.items || [];
      });
  }
  function send(payload) {
    if (!LIVE) return Promise.reject(new Error('not-configured'));
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // simple request: no preflight
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error(j && j.error || 'bad'); return j; });
  }

  /* ---------------- views ---------------- */
  /* Every view switch bumps this. An async callback that finishes after the
     user has moved on must not write into the panel — that used to wipe a
     half-typed feedback form when the Received fetch landed late. */
  var seq = 0;

  function viewReceived(slug) {
    var mine = ++seq;
    tRecv.setAttribute('aria-selected', 'true');
    tGive.setAttribute('aria-selected', 'false');
    var key = keyFromUrl() || keyStore(slug);
    body.innerHTML = '<p class="fb-empty">Loading…</p>';
    load(slug, key).then(function (items) {
      if (key) keyStore(slug, key);
      if (mine !== seq) return;
      if (!items.length) {
        body.innerHTML = '<p class="fb-empty">No feedback yet. It appears here as classmates leave it.</p>';
        return;
      }
      body.innerHTML = '';
      items.forEach(function (it) {
        var d = el('div', 'fb-item');
        var p = el('p'); p.textContent = it.text; d.appendChild(p);
        if (it.ts) {
          var w = el('div', 'fb-when');
          var dt = new Date(it.ts);
          w.textContent = isNaN(dt) ? '' : dt.toLocaleString();
          d.appendChild(w);
        }
        body.appendChild(d);
      });
    }).catch(function (e) {
      if (mine !== seq) return;
      if (e.message === 'locked') { viewLocked(slug, !!key); return; }
      body.innerHTML = e.message === 'not-configured'
        ? '<p class="fb-empty">Feedback is not switched on yet. Your instructor turns it on in class.</p>'
        : '<p class="fb-empty">Could not load feedback just now. Try again in a moment.</p>';
    });
  }

  /* Shown when the list is private and we have no code, or a wrong one. */
  function viewLocked(slug, wrong) {
    body.innerHTML =
        '<p class="fb-empty" style="margin-bottom:16px">This list is private &mdash; only the person '
      + 'whose page this is can read it. Your code is in the link your instructor sent you.</p>'
      + (wrong ? '<div class="fb-note err" style="margin-bottom:14px">That code did not match. Check it and try again.</div>' : '')
      + '<div class="fb-field"><label for="fb-key">Your code</label>'
      + '<input id="fb-key" type="text" autocomplete="off" spellcheck="false" placeholder="six characters">'
      + '<p class="fb-hint">Entered once, remembered on this browser.</p></div>'
      + '<button class="fb-send" id="fb-unlock">Unlock</button>';
    var inp = body.querySelector('#fb-key');
    inp.focus();
    function go() {
      var k = inp.value.trim();
      if (!k) { inp.focus(); return; }
      keyStore(slug, k);
      viewReceived(slug);
    }
    body.querySelector('#fb-unlock').onclick = go;
    inp.onkeydown = function (ev) { if (ev.key === 'Enter') go(); };
  }

  function viewGive(slug) {
    var mine = ++seq;
    if (tabs && !tabs.hidden) {
      tRecv.setAttribute('aria-selected', 'false');
      tGive.setAttribute('aria-selected', 'true');
    }
    var saved = '';
    try { saved = localStorage.getItem('msai-reviewer') || ''; } catch (e) {}
    body.innerHTML =
        '<div class="fb-field"><label for="fb-who">Your name</label>'
      + '<input id="fb-who" type="text" autocomplete="name" placeholder="Your first and last name">'
      + '<p class="fb-hint">Your classmate does <strong>not</strong> see this — their page shows the '
      + 'comment with no name on it. Your instructor sees it, so everyone gets credit for reviewing.</p></div>'
      + '<div class="fb-field"><label for="fb-text">Your feedback</label>'
      + '<textarea id="fb-text" placeholder="Name the thing and suggest the fix. For example: Your CV button downloads nothing for me — I think the PDF never made it into your folder."></textarea>'
      + '<p class="fb-hint">Describe the problem, not the person. You will be on the other side of this in ten minutes.</p></div>'
      + '<button class="fb-send" id="fb-send">Send feedback</button>'
      + '<div id="fb-note"></div>';
    var who = body.querySelector('#fb-who');
    var txt = body.querySelector('#fb-text');
    var btn = body.querySelector('#fb-send');
    var note = body.querySelector('#fb-note');
    who.value = saved;
    (saved ? txt : who).focus();

    btn.onclick = function () {
      var a = who.value.trim(), t = txt.value.trim();
      note.innerHTML = '';
      if (a.length < 2) { note.innerHTML = '<div class="fb-note err">Please put your name in.</div>'; who.focus(); return; }
      if (t.length < 10) { note.innerHTML = '<div class="fb-note err">Please write a little more — one useful sentence.</div>'; txt.focus(); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      try { localStorage.setItem('msai-reviewer', a); } catch (e) {}
      send({ target: slug, author: a, text: t }).then(function () {
        if (mine !== seq) return;
        body.innerHTML = '<div class="fb-note ok">Sent. Thank you — that is Step 12 done.</div>'
          + '<p class="fb-hint" style="margin-top:14px">You can close this panel, or leave feedback for someone else from the front page.</p>';
      }).catch(function (e) {
        if (mine !== seq) return;
        btn.disabled = false; btn.textContent = 'Send feedback';
        note.innerHTML = '<div class="fb-note err">'
          + (e.message === 'not-configured'
              ? 'Feedback is not switched on yet.'
              : 'That did not send. Check your connection and try again — your text is still here.')
          + '</div>';
      });
    };
  }

  function openFor(slug, mode, name) {
    title.textContent = name || pretty(slug);
    sub.textContent = mode === 'give' ? 'Leave one comment on this page.' : 'Feedback left by your classmates.';
    open();
    if (mode === 'give') viewGive(slug); else viewReceived(slug);
  }

  /* ---------------- student page ---------------- */
  if (IS_STUDENT_PAGE) {
    var btn = el('button', 'fb-btn');
    btn.innerHTML = 'Feedback';
    btn.setAttribute('aria-label', 'Open peer feedback');
    document.body.appendChild(btn);

    tabs.hidden = false;
    tRecv.onclick = function () { sub.textContent = 'Feedback left by your classmates.'; viewReceived(SLUG); };
    tGive.onclick = function () { sub.textContent = 'Leave one comment on this page.'; viewGive(SLUG); };

    var PAGE_NAME = (document.querySelector('h1') || {}).textContent;
    PAGE_NAME = PAGE_NAME ? PAGE_NAME.trim() : '';

    btn.onclick = function () {
      title.textContent = PAGE_NAME || pretty(SLUG);
      sub.textContent = 'Feedback left by your classmates.';
      open(); viewReceived(SLUG);
    };

    if (LIVE) {
      load(SLUG, keyFromUrl() || keyStore(SLUG)).then(function (items) {
        if (items.length) btn.innerHTML = 'Feedback <span class="fb-count">' + items.length + '</span>';
      }).catch(function () {});   // locked: no count, which is the point
    }
  }

  /* ---------------- front page: review mode ---------------- */
  else {
    var grid = document.getElementById('people');
    if (!grid) return;

    var toggle = el('button', 'fb-btn');
    toggle.textContent = 'Review mode';
    document.body.appendChild(toggle);

    var on = false;
    toggle.onclick = function () {
      on = !on;
      document.body.classList.toggle('fb-review', on);
      toggle.textContent = on ? 'Leave review mode' : 'Review mode';
      toggle.classList.toggle('fb-on', on);
      on ? paint() : strip();
    };

    function strip() {
      [].forEach.call(grid.querySelectorAll('.fb-pick'), function (b) { b.remove(); });
    }
    function paint() {
      strip();
      [].forEach.call(grid.querySelectorAll('a.person'), function (card) {
        var href = card.getAttribute('href') || '';
        var mm = href.match(/students\/([^\/]+)/);
        if (!mm) return;
        var slug = mm[1];
        if (slug === 'example-page') return;
        var b = el('button', 'fb-pick');
        b.textContent = 'Leave feedback';
        var nameEl = card.querySelector('.name');
        var nm = nameEl ? nameEl.textContent.trim() : '';
        b.onclick = function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          openFor(slug, 'give', nm);
        };
        card.appendChild(b);
        card.style.paddingBottom = '58px';
      });
    }

    /* the grid builds itself asynchronously — repaint when it changes */
    new MutationObserver(function () { if (on) paint(); })
      .observe(grid, { childList: true });
  }
})();
