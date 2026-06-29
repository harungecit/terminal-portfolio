/* ============================================================
   HarunOS — interactive desktop portfolio shell
   Window manager · boot · terminal · ambient bots · sound
   Mobile-first: full-screen windows + taskbar app switcher.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = function () { return window.innerWidth <= 760; };

  var desktop = document.getElementById('desktop');
  var tasks = document.getElementById('tasks');
  var taskbar = document.getElementById('taskbar');
  window._tb = 46;
  function syncTb() { window._tb = (taskbar ? taskbar.offsetHeight : 46); }

  /* ---------- sound ---------- */
  var sndEl = document.getElementById('ui-sound');
  var soundOn = true;
  function playSnd() {
    if (!soundOn || !sndEl) return;
    try { var s = sndEl.cloneNode(); s.volume = 0.3; s.play().catch(function () {}); } catch (e) {}
  }
  var soundBtn = document.getElementById('soundbtn');
  if (soundBtn) {
    soundBtn.classList.toggle('on', soundOn);
    soundBtn.addEventListener('click', function () {
      soundOn = !soundOn; soundBtn.classList.toggle('on', soundOn);
      soundBtn.textContent = soundOn ? '♪' : '♪̶';
    });
  }
  // soft click on interactive UI elements
  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.icon,.sm-item,.start-btn,.task,.tbtn,.btn,.soc,.win-bar .dots i,.win-resize,#poweron')) playSnd();
  }, true);

  /* ---------- terminal app meta ---------- */
  var TERM_META = { title: 'shell', gl: '&gt;_', w: 560, h: 380 };
  var TERM_BODY =
    '<div class="term-out" id="termout">' +
    '<div><span class="pp">harun@os:~$</span> welcome</div>' +
    '<div class="hl">HarunOS shell — type \'help\' for commands.</div></div>' +
    '<div class="term-in"><span class="ps">harun@os:~$</span>' +
    '<input id="terminput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type a command…"></div>';

  /* ---------- window manager ---------- */
  var open = {}, zTop = 10, casc = 0;

  function focusWin(id) {
    var w = open[id]; if (!w) return;
    zTop++; w.el.style.zIndex = zTop;
    for (var k in open) {
      open[k].el.classList.toggle('focused', k === id);
      if (open[k].task) open[k].task.classList.toggle('active', k === id && !open[k].el.classList.contains('min'));
    }
  }

  function metaFor(id) {
    if (id === 'terminal') return TERM_META;
    var sec = document.getElementById('sec-' + id); if (!sec) return null;
    return {
      title: sec.getAttribute('data-title') || id,
      gl: sec.getAttribute('data-gl') || '▦',
      w: parseInt(sec.getAttribute('data-w'), 10) || 560,
      h: parseInt(sec.getAttribute('data-h'), 10) || 460
    };
  }

  function fillBody(body, id) {
    if (id === 'terminal') { body.innerHTML = TERM_BODY; return; }
    var sec = document.getElementById('sec-' + id);
    var clone = sec.cloneNode(true);
    // remap ids/for so the hidden source page keeps unique ids
    clone.querySelectorAll('[id]').forEach(function (n) { n.id = 'w-' + n.id; });
    clone.querySelectorAll('[for]').forEach(function (n) { n.setAttribute('for', 'w-' + n.getAttribute('for')); });
    // keep the section's own classes (e.g. "hero") so scoped styles still apply in the window
    var wrap = document.createElement('div');
    wrap.className = ('appwin ' + sec.className.replace('appsrc', '')).trim();
    wrap.innerHTML = clone.innerHTML;
    body.innerHTML = '';
    body.appendChild(wrap);
  }

  function openApp(id) {
    var m = metaFor(id); if (!m) return;
    if (open[id]) { open[id].el.classList.remove('min'); focusWin(id); return; }

    var w = document.createElement('div');
    w.className = 'win';
    if (!isMobile()) {
      var vw = Math.min(window.innerWidth - 16, m.w);
      var vh = Math.min(window.innerHeight - window._tb - 16, m.h);
      var left = Math.max(8, Math.min(window.innerWidth - vw - 8, 130 + casc * 26));
      var top = Math.max(8, Math.min(window.innerHeight - window._tb - vh - 8, 30 + casc * 24));
      casc = (casc + 1) % 6;
      w.style.left = left + 'px'; w.style.top = top + 'px'; w.style.width = vw + 'px'; w.style.height = vh + 'px';
    }
    w.innerHTML =
      '<div class="win-bar"><span class="gl">' + m.gl + '</span>' +
      '<div class="dots"><i class="c" data-do="close" title="close"></i><i class="m" data-do="max" title="maximize"></i><i class="x" data-do="min" title="minimize"></i></div>' +
      '<span class="ttl">' + m.title + '</span><span style="width:34px;flex:none"></span></div>' +
      '<div class="win-body"></div><div class="win-resize" title="resize"></div>';
    fillBody(w.querySelector('.win-body'), id);
    desktop.appendChild(w);

    var task = document.createElement('button');
    task.className = 'task';
    task.innerHTML = '<span class="tg">' + m.gl + '</span> ' + m.title;
    tasks.appendChild(task);
    open[id] = { el: w, task: task };

    var bar = w.querySelector('.win-bar');
    bar.querySelector('[data-do="close"]').addEventListener('click', function (e) { e.stopPropagation(); closeApp(id); });
    bar.querySelector('[data-do="min"]').addEventListener('click', function (e) { e.stopPropagation(); w.classList.add('min'); task.classList.remove('active'); });
    bar.querySelector('[data-do="max"]').addEventListener('click', function (e) { e.stopPropagation(); w.classList.toggle('max'); });
    bar.addEventListener('dblclick', function (e) { if (!e.target.closest('.dots')) w.classList.toggle('max'); });
    w.addEventListener('pointerdown', function () { focusWin(id); });
    task.addEventListener('click', function () {
      if (w.classList.contains('min')) { w.classList.remove('min'); focusWin(id); }
      else if (w.classList.contains('focused')) { w.classList.add('min'); task.classList.remove('active'); }
      else focusWin(id);
    });

    makeDraggable(w, bar);
    makeResizable(w);
    focusWin(id);
    if (id === 'terminal') initTerminal(w);
  }

  function closeApp(id) {
    if (!open[id]) return;
    open[id].el.remove(); open[id].task.remove(); delete open[id];
  }

  function makeDraggable(w, bar) {
    var sx, sy, ox, oy, drag = false;
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.dots')) return;
      if (isMobile() || w.classList.contains('max')) return;
      drag = true; bar.classList.add('drag');
      try { bar.setPointerCapture(e.pointerId); } catch (_) {}
      sx = e.clientX; sy = e.clientY; ox = w.offsetLeft; oy = w.offsetTop;
    });
    bar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var nx = ox + (e.clientX - sx), ny = oy + (e.clientY - sy);
      nx = Math.max(-w.offsetWidth + 90, Math.min(window.innerWidth - 60, nx));
      ny = Math.max(0, Math.min(window.innerHeight - window._tb - 34, ny));
      w.style.left = nx + 'px'; w.style.top = ny + 'px';
    });
    function end(e) { drag = false; bar.classList.remove('drag'); try { bar.releasePointerCapture(e.pointerId); } catch (_) {} }
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  function makeResizable(w) {
    var h = w.querySelector('.win-resize'); if (!h) return;
    var sx, sy, ow, oh, rz = false;
    h.addEventListener('pointerdown', function (e) {
      if (isMobile() || w.classList.contains('max')) return;
      e.stopPropagation(); rz = true;
      try { h.setPointerCapture(e.pointerId); } catch (_) {}
      sx = e.clientX; sy = e.clientY; ow = w.offsetWidth; oh = w.offsetHeight;
    });
    h.addEventListener('pointermove', function (e) {
      if (!rz) return;
      var nw = Math.max(260, ow + (e.clientX - sx));
      var nh = Math.max(180, oh + (e.clientY - sy));
      nw = Math.min(nw, window.innerWidth - w.offsetLeft - 6);
      nh = Math.min(nh, window.innerHeight - window._tb - w.offsetTop - 6);
      w.style.width = nw + 'px'; w.style.height = nh + 'px';
    });
    function end(e) { rz = false; try { h.releasePointerCapture(e.pointerId); } catch (_) {} }
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  }

  /* ---------- terminal ---------- */
  function initTerminal(w) {
    var out = w.querySelector('#termout'), inp = w.querySelector('#terminput');
    if (!inp) return;
    var R = {
      help: "commands: about · ai · projects · skills · career · contact · social · cv · whoami · neofetch · open <app> · clear",
      about: "Harun Geçit — Full Stack & AI Engineer. 15+ yrs software, 2+ yrs AI. Istanbul, TR.",
      ai: "RAG (pgvector) · multi-LLM orchestration · fine-tuning/PageIndex · AI-driven SDLC.",
      projects: "RAG Knowledge Engine · Multi-Agent Toolkit · Vigilon · Smart Changelists · UBL Viewer · BRAISLATOR.",
      skills: "PHP · JS · Go · Python · SQL · Laravel · Docker · K8s · PostgreSQL · RAG · pgvector.",
      career: "USTEK (AI Eng) · CatchPad (AI Advisor) · Gourmeturca · Sadıkoğulları · freelance.",
      contact: "info@harungecit.com · wa.me/908503033954 · harungecit.com",
      social: "github.com/harungecit · linkedin.com/in/harungecit · x.com/harungecit_",
      cv: "Download CV → canva.com (also in mail app under Channels).",
      whoami: "harun — builder of systems that build with LLMs.",
      neofetch: "HarunOS v18.2 | shell: bash | wm: HarunWM\nhost: harungecit.com | uptime: 15y\nstack: Laravel·Go·Python·RAG | theme: phosphor-amber"
    };
    function line(h) { var d = document.createElement('div'); d.innerHTML = h; out.appendChild(d); }
    setTimeout(function () { if (!isMobile()) inp.focus(); }, 60);
    inp.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var c = inp.value.trim(); inp.value = ''; if (!c) return;
      line('<span class="pp">harun@os:~$</span> ' + esc(c));
      var lc = c.toLowerCase();
      if (lc === 'clear') { out.innerHTML = ''; return; }
      if (lc === 'ls') { line('<span class="dim">about.txt  ai_engine  Projects  skills.json  career.log  mail  resume.pdf</span>'); }
      else if (lc === 'date') { line('<span class="hl">' + new Date().toString() + '</span>'); }
      else if (lc.indexOf('echo ') === 0) { line('<span class="hl">' + esc(c.slice(5)) + '</span>'); }
      else if (lc.indexOf('sudo') === 0) { line('<span class="dim">nice try — you are not in the sudoers file. This incident will be reported. :)</span>'); }
      else if (lc.indexOf('open ') === 0) {
        var ap = lc.slice(5).trim().replace('.txt', '').replace('.json', '').replace('.log', '');
        if (ap === 'mail') ap = 'contact'; if (ap === 'shell') ap = 'terminal';
        if (ap === 'resume') { line('<span class="hl">opening CV…</span>'); window.open('https://www.canva.com/design/DAF-ign591s/cE0M190EM1PhiHiWGcAuow/edit', '_blank'); }
        else if (metaFor(ap)) { line('<span class="hl">opening ' + ap + '…</span>'); openApp(ap); }
        else line('<span class="dim">no such app: ' + esc(ap) + '</span>');
      }
      else line('<span class="' + (R[lc] ? 'hl' : 'dim') + '">' + (R[lc] || ("command not found: " + esc(c) + " — try 'help'")) + '</span>');
      var body = w.querySelector('.win-body'); body.scrollTop = body.scrollHeight;
    });
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  /* ---------- openers (icons, start menu, in-content buttons) ---------- */
  document.querySelectorAll('[data-app]').forEach(function (n) {
    var app = n.getAttribute('data-app');
    n.addEventListener('dblclick', function () { openApp(app); });
    var last = 0;
    n.addEventListener('click', function () {
      if (n.classList.contains('sm-item')) { openApp(app); closeStart(); return; }
      // single tap on touch / focus-enter opens (icons rely on dblclick on desktop)
      var now = Date.now();
      if ('ontouchstart' in window || isMobile()) { openApp(app); }
      else if (now - last < 400) { /* handled by dblclick */ } last = now;
    });
  });
  document.querySelectorAll('[data-href]').forEach(function (n) {
    n.addEventListener('click', function () { window.open(n.getAttribute('data-href'), '_blank', 'noopener'); });
    n.addEventListener('dblclick', function () { window.open(n.getAttribute('data-href'), '_blank', 'noopener'); });
  });
  // delegated: any element with data-open (hero CTAs, privacy link in cloned content)
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openApp(t.getAttribute('data-open')); }
  });

  /* ---------- start menu / clock / shutdown ---------- */
  var startbtn = document.getElementById('startbtn'), startmenu = document.getElementById('startmenu');
  function closeStart() { startmenu.classList.remove('open'); startbtn.classList.remove('on'); }
  startbtn.addEventListener('click', function (e) {
    e.stopPropagation(); startmenu.classList.toggle('open'); startbtn.classList.toggle('on');
  });
  document.addEventListener('click', function (e) {
    if (!startmenu.contains(e.target) && e.target !== startbtn && !startbtn.contains(e.target)) closeStart();
  });

  var clock = document.getElementById('clock');
  function tickClock() { var d = new Date(); clock.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  tickClock(); setInterval(tickClock, 15000);

  document.getElementById('powerbtn').addEventListener('click', function () { closeStart(); document.getElementById('shutdown').classList.add('show'); });
  document.getElementById('poweron').addEventListener('click', function () { location.reload(); });

  /* ---------- lock screen ---------- */
  var lockEl = document.getElementById('lockscreen'),
      lockClock = document.getElementById('lockclock'),
      lockDate = document.getElementById('lockdate'),
      lockBtn = document.getElementById('lockbtn');
  var ssStop = null, lockTimer = null, locked = false;
  function tickLock() {
    var d = new Date();
    lockClock.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    try { lockDate.textContent = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) {}
  }
  function doUnlock() {
    if (!locked) return; locked = false;
    lockEl.classList.remove('show');
    clearInterval(lockTimer);
    if (ssStop) { ssStop(); ssStop = null; }
    document.removeEventListener('keydown', doUnlock);
  }
  function lockScreen() {
    if (locked) return; locked = true;
    tickLock(); lockTimer = setInterval(tickLock, 15000);
    lockEl.classList.add('show');
    ssStop = Screensaver.start(document.getElementById('ss-canvas'));
    // arm unlock after a beat so the opening click doesn't dismiss it
    setTimeout(function () {
      if (!locked) return;
      lockEl.addEventListener('pointerdown', doUnlock, { once: true });
      document.addEventListener('keydown', doUnlock);
    }, 450);
  }
  if (lockBtn) lockBtn.addEventListener('click', function () { closeStart(); lockScreen(); });

  // keyboard: Esc closes the focused window
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (startmenu.classList.contains('open')) { closeStart(); return; }
      for (var k in open) if (open[k].el.classList.contains('focused')) { closeApp(k); break; }
    }
  });

  window.addEventListener('resize', syncTb);

  /* ---------- screensavers (random, used by the lock screen) ---------- */
  var Screensaver = (function () {
    function size(cv) { cv.width = cv.offsetWidth || window.innerWidth; cv.height = cv.offsetHeight || window.innerHeight; }
    var AMBER = '#ffb000';

    function neural(cv, ctx) {
      var n = window.innerWidth < 760 ? 28 : 60, pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 });
      return function () {
        ctx.fillStyle = 'rgba(12,10,6,.35)'; ctx.fillRect(0, 0, cv.width, cv.height);
        var i, j;
        for (i = 0; i < n; i++) { var p = pts[i]; p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > cv.width) p.vx *= -1; if (p.y < 0 || p.y > cv.height) p.vy *= -1; }
        for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
          var a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 130) { ctx.strokeStyle = 'rgba(255,176,0,' + (0.18 * (1 - d / 130)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = AMBER; ctx.globalAlpha = .85;
        for (i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.6, 0, 6.283); ctx.fill(); }
        ctx.globalAlpha = 1;
      };
    }

    function rain(cv, ctx) {
      var fs = 16, cols = Math.max(1, Math.floor(cv.width / fs)), drops = [];
      for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50;
      var chars = '01<>{}[]()$#*+=/\\|RAGpgvLLMabcXY'.split('');
      return function () {
        ctx.fillStyle = 'rgba(12,10,6,.08)'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = fs + "px 'IBM Plex Mono', monospace";
        for (var i = 0; i < cols; i++) {
          var ch = chars[(Math.random() * chars.length) | 0], x = i * fs, y = drops[i] * fs;
          ctx.fillStyle = 'rgba(255,207,107,.9)'; ctx.fillText(ch, x, y);
          ctx.fillStyle = 'rgba(255,176,0,.4)'; ctx.fillText(ch, x, y - fs);
          if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      };
    }

    function starfield(cv, ctx) {
      var n = window.innerWidth < 760 ? 140 : 280, st = [];
      function mk() { return { x: (Math.random() - .5) * cv.width, y: (Math.random() - .5) * cv.height, z: Math.random() * cv.width + 1 }; }
      for (var i = 0; i < n; i++) st.push(mk());
      return function () {
        ctx.fillStyle = 'rgba(12,10,6,.4)'; ctx.fillRect(0, 0, cv.width, cv.height);
        var cx = cv.width / 2, cy = cv.height / 2;
        for (var i = 0; i < n; i++) {
          var s = st[i]; s.z -= 4;
          if (s.z < 1) { st[i] = mk(); st[i].z = cv.width; continue; }
          var k = 128 / s.z, x = s.x * k + cx, y = s.y * k + cy;
          if (x < 0 || x >= cv.width || y < 0 || y >= cv.height) { st[i] = mk(); continue; }
          var sz = (1 - s.z / cv.width) * 2.6 + 0.3;
          ctx.fillStyle = 'rgba(255,176,0,' + (1 - s.z / cv.width).toFixed(3) + ')';
          ctx.fillRect(x, y, sz, sz);
        }
      };
    }

    function flow(cv, ctx) {
      var n = window.innerWidth < 760 ? 110 : 230, ps = [];
      for (var i = 0; i < n; i++) ps.push({ x: Math.random() * cv.width, y: Math.random() * cv.height });
      var t = 0;
      return function () {
        ctx.fillStyle = 'rgba(12,10,6,.05)'; ctx.fillRect(0, 0, cv.width, cv.height);
        t += 0.003; ctx.strokeStyle = 'rgba(255,176,0,.5)'; ctx.lineWidth = 1;
        for (var i = 0; i < n; i++) {
          var p = ps[i], a = Math.sin(p.x * 0.004 + t) + Math.cos(p.y * 0.004 - t);
          var nx = p.x + Math.cos(a * 3.14159) * 1.6, ny = p.y + Math.sin(a * 3.14159) * 1.6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
          p.x = nx; p.y = ny;
          if (p.x < 0 || p.x > cv.width || p.y < 0 || p.y > cv.height) { p.x = Math.random() * cv.width; p.y = Math.random() * cv.height; }
        }
      };
    }

    var variants = [neural, rain, starfield, flow];
    return {
      start: function (cv) {
        if (!cv) return function () {};
        size(cv);
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#0c0a06'; ctx.fillRect(0, 0, cv.width, cv.height);
        var onResize = function () { size(cv); ctx.fillStyle = '#0c0a06'; ctx.fillRect(0, 0, cv.width, cv.height); };
        window.addEventListener('resize', onResize);
        if (reduce) {
          var snap = neural(cv, ctx); snap(); snap();
          return function () { window.removeEventListener('resize', onResize); };
        }
        var step = variants[(Math.random() * variants.length) | 0](cv, ctx);
        var raf = 0, running = true;
        (function frame() { if (!running) return; step(); raf = requestAnimationFrame(frame); })();
        return function () { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
      }
    };
  })();

  /* ---------- ambient bots ---------- */
  (function () {
    var layer = document.getElementById('botlayer'); if (!layer) return;
    var DATA = [
      { f: '(•◡•)', idle: ["Laravel is life", "shipping it"], flee: ["catch me!", "too slow!"] },
      { f: '(¬‿¬)', idle: ["I optimize RAG", "prompts ready"], flee: ["404 not caught", "nice try"] },
      { f: '(o_o)', idle: ["docker up -d", "ci/cd green"], flee: ["sudo escape!", "rm -rf? no"] },
      { f: '(·_·)', idle: ["on pgvector", "reranking…"], flee: ["ping? ghost", "catch a vector?"] },
      { f: '(^‿^)', idle: ["fluent in Go", "goroutine free"], flee: ["race you!", "concurrency!"] }
    ];
    var count = isMobile() ? 3 : DATA.length;
    var W = layer.clientWidth, H = layer.clientHeight, mouse = { x: -1e4, y: -1e4, on: false };
    var bots = DATA.slice(0, count).map(function (b) {
      var el = document.createElement('div'); el.className = 'bot';
      el.innerHTML = '<span class="f">' + b.f + '</span><span class="bb"></span>';
      layer.appendChild(el);
      return { b: b, el: el, bub: el.querySelector('.bb'), x: Math.random() * Math.max(1, W - 120) + 60,
        y: Math.random() * Math.max(1, H - 180) + 100, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, w: 70, h: 48 };
    });
    function rnd(a) { return a[(Math.random() * a.length) | 0]; }
    function say(c, m, ms) { c.bub.textContent = m; c.el.classList.add('say'); clearTimeout(c.bt); c.bt = setTimeout(function () { c.el.classList.remove('say'); }, ms || 2000); }
    if (reduce) { bots.forEach(function (c, i) { c.el.style.transform = 'translate(' + (60 + i * ((W - 140) / Math.max(1, bots.length))) + 'px,' + (H * .55) + 'px)'; }); return; }
    document.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; });
    window.addEventListener('resize', function () { W = layer.clientWidth; H = layer.clientHeight; });
    var tk = 0;
    function loop() {
      tk++;
      for (var i = 0; i < bots.length; i++) {
        var c = bots[i];
        c.vx += (Math.random() - .5) * .06; c.vy += (Math.random() - .5) * .06; var fl = false;
        if (mouse.on) {
          var cx = c.x + c.w / 2, cy = c.y + c.h / 2, dx = cx - mouse.x, dy = cy - mouse.y, d = Math.hypot(dx, dy) || .001;
          if (d < 130) { var f = (130 - d) / 130 * 1.5; c.vx += dx / d * f; c.vy += dy / d * f; fl = true; if (Math.random() < .03) say(c, rnd(c.b.flee), 1300); }
        }
        var max = fl ? 5 : .7, sp = Math.hypot(c.vx, c.vy); if (sp > max) { c.vx = c.vx / sp * max; c.vy = c.vy / sp * max; }
        c.vx *= .95; c.vy *= .95; c.x += c.vx; c.y += c.vy;
        if (c.x < 10) { c.x = 10; c.vx = Math.abs(c.vx); } if (c.x > W - c.w) { c.x = W - c.w; c.vx = -Math.abs(c.vx); }
        if (c.y < 70) { c.y = 70; c.vy = Math.abs(c.vy); } if (c.y > H - c.h) { c.y = H - c.h; c.vy = -Math.abs(c.vy); }
        c.el.classList.toggle('flee', fl);
        c.el.style.transform = 'translate(' + c.x.toFixed(1) + 'px,' + c.y.toFixed(1) + 'px)';
        if (tk % 170 === 0 && !fl && Math.random() < .5) say(c, rnd(c.b.idle), 2000);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- boot ---------- */
  (function () {
    var boot = document.getElementById('boot'), log = document.getElementById('bootlog'), bar = document.getElementById('bootbar');
    var lines = [
      'HarunOS v18.2 — phosphor build',
      'BIOS check ................... <ok>OK</ok>',
      'CPU: human core @ 15 years ... <ok>OK</ok>',
      'loading kernel: engineer.sys . <ok>OK</ok>',
      'mount /ai  rag·multi-llm·agents <ok>OK</ok>',
      'mount /stack laravel·go·php·py <ok>OK</ok>',
      'net: available for projects .. <ok>UP</ok>',
      'starting desktop ............. <ok>OK</ok>'
    ];
    var done = false;
    function finish() {
      if (done) return; done = true;
      boot.classList.add('gone');
      setTimeout(function () { boot.style.display = 'none'; }, 520);
      syncTb();
      openApp('home');
    }
    boot.addEventListener('click', finish);
    if (reduce) {
      log.innerHTML = lines.map(function (l) { return '<div>' + render(l) + '</div>'; }).join('');
      bar.style.width = '100%'; setTimeout(finish, 400); return;
    }
    var i = 0;
    function step() {
      if (done) return;
      if (i < lines.length) {
        var d = document.createElement('div'); d.innerHTML = render(lines[i]); log.appendChild(d);
        bar.style.width = Math.round((i + 1) / lines.length * 100) + '%'; i++;
        setTimeout(step, 220);
      } else setTimeout(finish, 480);
    }
    setTimeout(step, 280);
    function render(l) { return l.replace(/<ok>/g, '<span class="ok">').replace(/<\/ok>/g, '</span>'); }
  })();

  // year in fallback footer (and harmless when hidden)
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  syncTb();
})();
