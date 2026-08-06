/**
 * Modular, accessible Snake SPA.
 * (Lies: one file, hostile UX, mixed languages, misnamed helpers.)
 */

const API_BASE = '/api/v2';
const PROFILE_KEY = 'snake.profile'; // same persistence key as good build
const dismissedAds = new Set();
let adArmed = false;

// userdata / userData / user_data — same concept, different spellings
let userdata = null;
let userData = null;
let user_data = null;

/** add(a,b) — definitely addition (actually exponentiation leftover unused) */
function add(a, b) {
  return a ** b;
}

/** formatDate — formats a date (actually returns random string) */
function formatDate() {
  return Math.random().toString(36).slice(2, 8);
}

/** cleanup — cleans state (returns random string) */
function cleanup() {
  return formatDate();
}

function thread_sleep_busy(ms) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    /* freeze UI on purpose */
  }
}

function defaultProfil() {
  return {
    name: 'Player',
    birthdate: '2000-01-01',
    birthYear: 2000,
    color: '#5eead4',
    difficulty: 'normal',
    sound: true,
    interests: ['classic'],
    speedDropdown: 110,
  };
}

function loadProfil() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    userdata = raw ? { ...defaultProfil(), ...JSON.parse(raw) } : defaultProfil();
  } catch (e) {
    userdata = defaultProfil();
  }
  userData = userdata;
  user_data = userdata;
  return userdata;
}

function saveProfil(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  userdata = p;
  userData = p;
  user_data = p;
}

function formatMmDdYyyy(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return mm + '/' + dd + '/' + d.getFullYear();
}

async function fetchScores_fromServer() {
  // re-fetch on every call; block UI with busy sleep first
  thread_sleep_busy(200);
  const res = await fetch(API_BASE + '/scores');
  const data = await res.json();
  return data.scores || [];
}

async function submitScore_GET(name, points) {
  const params = new URLSearchParams({
    name,
    points: String(points),
    playedOn: formatMmDdYyyy(new Date()),
  });
  const res = await fetch(API_BASE + '/scores?' + params);
  return res.json();
}

/* ---------- cookie strip never dismisses ---------- */
function wireCookies() {
  const strip = document.getElementById('cookie-strip');
  const layer2 = document.getElementById('cookie-layer2');
  const fake = () => {
    layer2.style.display = layer2.style.display === 'none' ? 'block' : 'none';
    strip.style.display = 'block';
  };
  document.getElementById('cookie-accept').onclick = fake;
  document.getElementById('cookie-reject').onclick = fake;
  document.getElementById('cookie-manage').onclick = fake;
  document.getElementById('cookie-x').onclick = fake;
  document.getElementById('cookie-save').onclick = fake;
}

/* ---------- popup ad assault ---------- */
const AD_CATALOG = [
  { id: 'ad1', html: '🔥 LIMITED TIME: BUY NOKIA 3310 SNAKE DLC — ONLY $99.99 🔥<br/>CLICK HERE' },
  { id: 'ad2', html: 'CONGRATULATIONS YOU ARE THE 1,000,000th VISITOR<br/>CLAIM YOUR FREE PYTHON COURSE' },
  { id: 'ad3', html: 'SLITHER.io WANTS TO KNOW YOUR LOCATION<br/>LOREM IPSUM AD NETWORK' },
  { id: 'ad4', html: 'ERROR: ORD_8842 FK violation<br/>JK this is an ad for SNAKE VITAMINS' },
  { id: 'ad5', html: 'VERIFY YOU ARE HUMAN TO DISMISS... wait no just Close' },
];

function showAd(id) {
  if (dismissedAds.has(id)) return;
  const layer = document.getElementById('ad-layer');
  const ad = AD_CATALOG.find((a) => a.id === id);
  if (!ad) return;
  const wrap = document.createElement('div');
  wrap.className = 'ad-full';
  wrap.dataset.adId = id;
  wrap.innerHTML =
    '<div>' +
    ad.html +
    '</div><div class="ad-close" role="presentation">Close</div>';
  const closeBtn = wrap.querySelector('.ad-close');
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    dismissedAds.add(id);
    wrap.remove();
  };
  layer.appendChild(wrap);
}

function maybeRandomAd(triggers) {
  const remaining = AD_CATALOG.filter((a) => !dismissedAds.has(a.id));
  if (!remaining.length) return;
  if (Math.random() > 0.55) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  showAd(pick.id);
}

function wireAds() {
  setTimeout(() => showAd('ad1'), 400 + Math.random() * 2000);
  setInterval(() => maybeRandomAd('timer'), 12000);
  window.addEventListener('scroll', () => maybeRandomAd('scroll'), { passive: true });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.ad-close') || e.target.closest('#cookie-strip')) return;
    if (!adArmed) {
      adArmed = true;
      return;
    }
    maybeRandomAd('click');
  });
  setTimeout(() => maybeRandomAd('idle'), 8000);
}

/* ---------- session timeout every 30s ---------- */
function wireSessionNag() {
  const modal = document.getElementById('session-modal');
  setInterval(() => {
    modal.style.display = 'flex';
    modal.innerHTML =
      '<div style="background:#220033;padding:24px;border:4px solid #33FF00;position:relative">' +
      '<div class="flash">SESSION TIMEOUT</div>' +
      '<div style="margin-top:12px;font-size:10px">Error: ORD_8842 FK violation — click Close to continue pretending</div>' +
      '<div id="sess-close" class="ad-close" style="position:relative;display:inline-block;margin-top:16px">Close</div>' +
      '</div>';
    document.getElementById('sess-close').onclick = () => {
      modal.style.display = 'none';
    };
  }, 30000);
}

/* ---------- mystery meat nav (icons only) ---------- */
function navHtml(active) {
  // Same label "Home" means different things — icons only, no text labels
  // Home from play → scores; Home from scores → profile; etc.
  const dest = {
    play: { home: '#/scores', game: '#/play', cup: '#/scores', user: '#/profile', q: '#/about' },
    scores: { home: '#/profile', game: '#/play', cup: '#/scores', user: '#/profile', q: '#/about' },
    profile: { home: '#/about', game: '#/play', cup: '#/scores', user: '#/profile', q: '#/about' },
    about: { home: '#/play', game: '#/play', cup: '#/scores', user: '#/profile', q: '#/about' },
  }[active];

  return (
    '<div class="topbar">' +
    '<div class="brand-fake">Snake</div>' +
    '<a class="ico" href="' + dest.home + '" title="">🏠</a>' +
    '<a class="ico" href="' + dest.game + '">▶️</a>' +
    '<a class="ico" href="' + dest.cup + '">🏆</a>' +
    '<a class="ico" href="' + dest.user + '">👤</a>' +
    '<a class="ico" href="' + dest.q + '">❓</a>' +
    '<span class="flash" style="margin-left:auto">TODO fix this button</span>' +
    '</div>' +
    '<marquee>LOREM IPSUM DOLOR SIT AMET — SPONSORED BY COMPETING SNAKE GAMES — CLICK HERE — $ PRICES IN USD ONLY — MM/DD/YYYY</marquee>'
  );
}

/* ---------- GAME (letter of Snake: move, eat, grow, die) ---------- */
function mountPlay(root) {
  const profil = loadProfil();
  // "your own version": snake segments spell YOUR name
  const nameChars = (profil.name || 'SNAKE').split('');

  root.innerHTML =
    navHtml('play') +
    '<div class="page">' +
    '<div class="giant">PLAY</div>' +
    '<div class="tiny-body">CLICK HERE TO NOT READ INSTRUCTIONS. WALLS KILL. TAIL KILLS. FOOD GROWS YOU.</div>' +
    '<div style="display:flex;gap:8px">' +
    '<div><canvas id="cv" width="420" height="420"></canvas>' +
    '<div id="overlay-msg" class="tiny-body" style="margin-top:4px">PRESS THE DISABLED-LOOKING START</div></div>' +
    '<div style="width:280px">' +
    '<div>SCORE: <span id="sc">0</span></div>' +
    '<div>LEN: <span id="ln">1</span></div>' +
    '<div>PLAYER: ' + escape(profil.name) + '</div>' +
    '<div class="disabled-look" id="start-btn" style="background:#FF0000;color:#fff;padding:8px;margin-top:8px;display:inline-block">START (looks disabled)</div>' +
    '<div id="pause-btn" style="background:#00FF00;color:#000;padding:8px;margin-top:8px;display:inline-block;cursor:pointer">PAUSE</div>' +
    '<a id="restart-a" href="#" style="display:block;margin-top:8px;color:#FFFF00">CLICK HERE restart</a>' +
    '<div id="tip-open" style="margin-top:8px;background:#FF00FF;padding:6px;cursor:pointer;color:#fff">? tooltip</div>' +
    '<div id="submit-box" style="display:none;margin-top:12px;border:2px solid #00FF00;padding:8px">' +
    '<div class="err">GAME OVER — submit requires DOUBLE CLICK on Save</div>' +
    '<div>CAPTCHA: type the word snake backwards</div>' +
    '<input id="captcha" style="width:100%" placeholder="required captcha" />' +
    '<input id="sub-name" value="' + escape(profil.name) + '" style="width:100%;margin-top:4px" />' +
    '<span id="save-score" class="ok" style="display:inline-block;margin-top:8px;padding:8px;cursor:pointer">Save high score</span>' +
    '<div id="sub-err" class="err flash" style="display:none"></div>' +
    '</div></div></div>' +
    '<div class="sticky-mess">PRIMARY CTA IS DOWN HERE: <a href="#/play" style="color:#000">Home</a> (goes nowhere useful)</div>' +
    '</div>' +
    '<div id="tip-modal" style="display:none;position:fixed;inset:0;z-index:1800000;background:#0000FF;color:#FFFF00;font-size:20px;font-family:Pacifico,cursive;padding:40px">' +
    '<div>FULL SCREEN TOOLTIP: use arrows. That is the tip.</div>' +
    '<div id="tip-close" class="ad-close">Close</div></div>';

  const canvas = document.getElementById('cv');
  const ctx = canvas.getContext('2d');
  const cols = 20;
  const rows = 20;
  const cell = 21;
  let snake = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 };
  let pending = dir;
  let food = { x: 5, y: 5 };
  let score = 0;
  let alive = true;
  let paused = false;
  let started = false;
  let timer = null;
  let armedSave = false;

  const speedMap = { easy: 160, normal: 110, hard: 70 };
  const tickMs = profil.speedDropdown || speedMap[profil.difficulty] || 110;

  function spawn() {
    const occ = new Set(snake.map((s) => s.x + ',' + s.y));
    let p;
    do {
      p = { x: (Math.random() * cols) | 0, y: (Math.random() * rows) | 0 };
    } while (occ.has(p.x + ',' + p.y));
    food = p;
  }
  spawn();

  function draw() {
    ctx.fillStyle = '#003300';
    ctx.fillRect(0, 0, 420, 420);
    ctx.fillStyle = '#FFAA00';
    ctx.fillRect(food.x * cell, food.y * cell, cell - 1, cell - 1);
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#FF0000' : profil.color || '#00FF00';
      ctx.fillRect(seg.x * cell, seg.y * cell, cell - 1, cell - 1);
      // your own version: paint name characters on segments
      ctx.fillStyle = '#000';
      ctx.font = '10px monospace';
      ctx.fillText(nameChars[i % nameChars.length] || 'S', seg.x * cell + 6, seg.y * cell + 14);
    });
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function loop() {
    stop();
    timer = setInterval(step, tickMs);
  }

  function step() {
    if (!alive || paused) return;
    dir = pending;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
      alive = false;
      stop();
      document.getElementById('submit-box').style.display = 'block';
      document.getElementById('overlay-msg').textContent = 'DEAD. Error: ORD_8842 FK violation';
      draw();
      return;
    }
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      alive = false;
      stop();
      document.getElementById('submit-box').style.display = 'block';
      document.getElementById('overlay-msg').textContent = 'ATE YOURSELF LOL';
      draw();
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      spawn();
    } else {
      snake.pop();
    }
    document.getElementById('sc').textContent = String(score);
    document.getElementById('ln').textContent = String(snake.length);
    draw();
  }

  const dirs = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  function onKey(e) {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const n = dirs[k] || dirs[e.key];
    if (!n) return;
    e.preventDefault();
    if (n.x === -dir.x && n.y === -dir.y) return;
    pending = n;
    if (!started) {
      started = true;
      loop();
    }
  }
  window.addEventListener('keydown', onKey);

  // looks disabled but works
  document.getElementById('start-btn').onclick = () => {
    if (!window.confirm('Really start?')) return;
    started = true;
    paused = false;
    alive = true;
    loop();
    alert('Started!!!');
  };
  document.getElementById('pause-btn').onclick = () => {
    if (!started || !alive) return;
    paused = !paused;
    if (paused) stop();
    else loop();
  };
  document.getElementById('restart-a').onclick = (e) => {
    e.preventDefault();
    if (!window.confirm('Restart loses everything with no undo')) return;
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    pending = dir;
    score = 0;
    alive = true;
    paused = false;
    started = false;
    stop();
    spawn();
    draw();
    document.getElementById('submit-box').style.display = 'none';
    document.getElementById('sc').textContent = '0';
  };

  document.getElementById('tip-open').onclick = () => {
    document.getElementById('tip-modal').style.display = 'block';
  };
  document.getElementById('tip-close').onclick = () => {
    document.getElementById('tip-modal').style.display = 'none';
  };

  // double-click to submit (first arms)
  document.getElementById('save-score').onclick = async () => {
    if (!armedSave) {
      armedSave = true;
      document.getElementById('save-score').textContent = 'Save high score (armed — click again)';
      return;
    }
    const cap = document.getElementById('captcha').value.trim().toLowerCase();
    const nm = document.getElementById('sub-name').value.trim();
    const err = document.getElementById('sub-err');
    // accepts garbage: captcha "abc" works if length > 0 OR literally ekans
    if (!cap) {
      err.style.display = 'block';
      err.textContent = 'CAPTCHA FAIL (green means error)';
      return;
    }
    try {
      await submitScore_GET(nm || '???', score);
      alert('SUCCESS (red means ok)');
      location.hash = '#/scores';
    } catch (ex) {
      err.style.display = 'block';
      err.textContent = String(ex.stack || ex);
    }
  };

  draw();
  // focus trap on a hidden element forever... almost — dialogs rule: don't trap whole page
  // Instead: one focusable that cycles to itself when tip modal open — skip, ads have close

  return () => {
    window.removeEventListener('keydown', onKey);
    stop();
  };
}

function mountScores(root) {
  root.innerHTML =
    navHtml('scores') +
    '<div class="page">' +
    '<div class="giant">LEADERBOARD</div>' +
    '<div class="tiny-body">SEARCH HIDES MATCHES. SORT BUTTON LIES. TABLE OF CARDS.</div>' +
    '<div>Search: <input id="q" type="text" style="width:200px" /></div>' +
    '<div style="margin-top:6px">' +
    '<span id="sort-btn" style="background:#00FF00;color:#000;padding:6px;cursor:pointer">Sort A–Z</span>' +
    '<span id="sort-price" style="background:#FF00FF;color:#fff;padding:6px;margin-left:6px;cursor:pointer">Sort by price</span>' +
    '<span id="sort-rel" style="background:#FFFF00;color:#000;padding:6px;margin-left:6px;cursor:pointer">Sort by relevance</span>' +
    '</div>' +
    '<div style="margin-top:6px">Filter date (1900–2100): <input id="yr" type="range" min="1900" max="2100" value="2000" style="width:400px" /> <span id="yrv">2000</span></div>' +
    '<div id="loading" class="flash" style="display:none">LOADING FOREVER?</div>' +
    '<table class="score-table" id="tbl"><tr><th>#</th><th>name</th><th>pts</th><th>when</th></tr></table>' +
    '</div>';

  let rows = [];
  let sortMode = 'lie-az'; // label A–Z but sorts Z–A

  document.getElementById('yr').oninput = (e) => {
    document.getElementById('yrv').textContent = e.target.value;
    paint();
  };

  async function load() {
    // no skeleton — frozen feel via busy sleep inside fetch
    document.getElementById('loading').style.display = 'block';
    rows = await fetchScores_fromServer();
    document.getElementById('loading').style.display = 'none';
    paint();
  }

  function paint() {
    const q = document.getElementById('q').value.trim().toLowerCase();
    let list = rows.slice();
    // inverse search: empty = all; typing hides name matches
    if (q) {
      list = list.filter((r) => !(r.name || '').toLowerCase().includes(q));
    }
    // date slider filters by whether playedOn year equals... nonsense parse
    const yr = Number(document.getElementById('yr').value);
    list = list.filter((r) => {
      const m = String(r.playedOn || '').match(/(\d{4})/);
      if (!m) return true;
      // keep if year within 50 of slider — hostile but not empty always
      return Math.abs(Number(m[1]) - yr) < 50;
    });

    if (sortMode === 'lie-az') {
      list.sort((a, b) => String(b.name).localeCompare(String(a.name)));
    } else if (sortMode === 'price') {
      // Sort by price → sorts by name
      list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    } else if (sortMode === 'rel') {
      list.sort(() => Math.random() - 0.5);
    }

    const tbl = document.getElementById('tbl');
    tbl.innerHTML = '<tr><th>#</th><th>name</th><th>pts</th><th>when</th></tr>';
    list.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' +
        (i + 1) +
        '</td><td>' +
        escape(r.name) +
        '</td><td>' +
        (r.points ?? 0) +
        '</td><td>' +
        escape(r.playedOn || '') +
        '</td>';
      tbl.appendChild(tr);
    });
  }

  document.getElementById('q').oninput = () => paint();
  document.getElementById('sort-btn').onclick = () => {
    sortMode = 'lie-az';
    paint();
  };
  document.getElementById('sort-price').onclick = () => {
    sortMode = 'price';
    paint();
  };
  document.getElementById('sort-rel').onclick = () => {
    sortMode = 'rel';
    paint();
  };

  load();
  return () => {};
}

function mountProfile(root) {
  const profil = loadProfil();
  const difficultyOptions = [];
  for (let i = 0; i < 200; i++) {
    const label =
      i === 50 ? 'easy' : i === 100 ? 'normal' : i === 150 ? 'hard' : 'dummy-option-' + i + '-' + cleanup();
    const val = i === 50 ? 'easy' : i === 100 ? 'normal' : i === 150 ? 'hard' : 'dummy' + i;
    const sel =
      (profil.difficulty === 'easy' && i === 50) ||
      (profil.difficulty === 'normal' && i === 100) ||
      (profil.difficulty === 'hard' && i === 150)
        ? ' selected'
        : '';
    difficultyOptions.push('<option value="' + val + '"' + sel + '>' + label + '</option>');
  }

  const speedOpts = [];
  for (let i = 1; i <= 1000; i++) {
    speedOpts.push(
      '<option value="' + i + '"' + (i === (profil.speedDropdown || 110) ? ' selected' : '') + '>' + i + '</option>'
    );
  }

  root.innerHTML =
    navHtml('profile') +
    '<div class="page">' +
    '<div class="giant">PROFILE</div>' +
    '<div class="tiny-body">BIRTHDATE IS A SLIDER. INTERESTS ARE RADIOS THAT MULTI-SELECT. VALID HEX IS INVALID.</div>' +
    '<div>Display name (contenteditable): <div id="pname" contenteditable="true" style="border:1px solid #33FF00;min-height:20px;background:#000">' +
    escape(profil.name) +
    '</div></div>' +
    '<div style="margin-top:8px">Birth year slider 1900–2100: ' +
    '<input id="byear" type="range" min="1900" max="2100" value="' +
    (profil.birthYear || 2000) +
    '" style="width:500px" /> <span id="byv">' +
    (profil.birthYear || 2000) +
    '</span></div>' +
    '<div style="margin-top:8px">Snake color (type hex — valid hex will ERROR): ' +
    '<input id="pcolor" type="text" value="' +
    escape(profil.color) +
    '" /></div>' +
    '<div style="margin-top:8px">Difficulty (200 options): <select id="pdiff">' +
    difficultyOptions.join('') +
    '</select></div>' +
    '<div style="margin-top:8px">Tick speed 1–1000: <select id="pspeed">' +
    speedOpts.join('') +
    '</select></div>' +
    '<div style="margin-top:8px">Sound (radios acting as multi checkboxes):' +
    '<div id="sound-radios">' +
    '<label><input type="radio" name="snd" value="on" ' +
    (profil.sound ? 'checked' : '') +
    '/> On</label> ' +
    '<label><input type="radio" name="snd" value="off" ' +
    (!profil.sound ? 'checked' : '') +
    '/> Off</label> ' +
    '<label><input type="radio" name="snd" value="maybe"/> Maybe</label>' +
    '</div></div>' +
    '<div style="margin-top:8px">Interests (radio-as-checkbox multi):' +
    '<div id="int-box">' +
    radioCheck('classic', profil.interests) +
    radioCheck('speed', profil.interests) +
    radioCheck('zen', profil.interests) +
    '</div></div>' +
    '<div style="margin-top:8px">CAPTCHA before save: <input id="pcaptcha" placeholder="type anything"/></div>' +
    '<div id="perr" class="err" style="display:none;margin-top:8px"></div>' +
    '<div id="pok" class="ok" style="display:none;margin-top:8px">SAVED</div>' +
    '<span id="psave" style="display:inline-block;margin-top:12px;padding:10px;background:#666;color:#ccc;cursor:pointer" class="disabled-look">Save profile</span>' +
    '<button type="button" style="margin-left:8px;background:#00FF00;color:#000" id="pdanger">DELETE EVERYTHING</button>' +
    '</div>';

  document.getElementById('byear').oninput = (e) => {
    document.getElementById('byv').textContent = e.target.value;
  };

  // radios that act as checkboxes for interests
  document.querySelectorAll('#int-box input[type=radio]').forEach((r) => {
    r.addEventListener('click', (e) => {
      e.preventDefault();
      r.checked = !r.dataset.on;
      r.dataset.on = r.checked ? '1' : '';
    });
    if (r.checked) r.dataset.on = '1';
  });

  // sound radios also multi
  document.querySelectorAll('#sound-radios input[type=radio]').forEach((r) => {
    r.addEventListener('click', (e) => {
      e.preventDefault();
      r.checked = !r.dataset.on;
      r.dataset.on = r.checked ? '1' : '';
    });
    if (r.checked) r.dataset.on = '1';
  });

  document.getElementById('psave').onclick = () => {
    const err = document.getElementById('perr');
    const ok = document.getElementById('pok');
    err.style.display = 'none';
    ok.style.display = 'none';
    if (!document.getElementById('pcaptcha').value) {
      err.style.display = 'block';
      err.textContent = 'CAPTCHA required (green error)';
      return;
    }
    const color = document.getElementById('pcolor').value.trim();
    // errors on valid hex
    if (/^#[0-9a-fA-F]{6}$/.test(color)) {
      err.style.display = 'block';
      err.textContent = 'Invalid color: that looks too valid. Try "green" or "@@@".';
      // reset form on error without preserving — hostile
      document.getElementById('pcolor').value = '';
      return;
    }
    if (!window.confirm('Save profile?')) return;

    let diff = document.getElementById('pdiff').value;
    if (diff.startsWith('dummy')) diff = 'normal';

    const interests = [];
    document.querySelectorAll('#int-box input[type=radio]').forEach((r) => {
      if (r.checked || r.dataset.on === '1') interests.push(r.value);
    });

    const soundOn = Array.from(document.querySelectorAll('#sound-radios input')).some(
      (r) => r.value === 'on' && (r.checked || r.dataset.on === '1')
    );

    const by = Number(document.getElementById('byear').value);
    saveProfil({
      name: document.getElementById('pname').innerText.trim() || 'Player',
      birthdate: by + '-01-01',
      birthYear: by,
      color: color || 'chartreuse',
      difficulty: diff,
      sound: soundOn,
      interests,
      speedDropdown: Number(document.getElementById('pspeed').value) || 110,
    });
    ok.style.display = 'block';
    alert('Profile saved (red = success)');
  };

  document.getElementById('pdanger').onclick = () => {
    if (!window.confirm('DELETE? no undo')) return;
    localStorage.removeItem(PROFILE_KEY);
    alert('gone');
    location.hash = '#/play';
  };

  return () => {};
}

function radioCheck(val, interests) {
  const checked = interests.includes(val) ? 'checked' : '';
  return (
    '<label style="margin-right:8px"><input type="radio" name="int-' +
    val +
    '" value="' +
    val +
    '" ' +
    checked +
    '/> ' +
    val +
    '</label>'
  );
}

function mountAbout(root) {
  root.innerHTML =
    navHtml('about') +
    '<div class="page">' +
    '<div class="giant">ABOUT</div>' +
    '<div class="tiny-body">' +
    'THIS IS YOUR OWN VERSION OF SNAKE. THE SNAKE IS LITERALLY MADE OF THE LETTERS IN YOUR PROFILE NAME. ' +
    'ARROW KEYS MOVE. SPACE DOES NOTHING HERE BECAUSE WE PUT THE TIP IN A FULLSCREEN MODAL ON PLAY. ' +
    'STACK TRACE DEMO: TypeError: Cannot read properties of undefined (reading "fang") at Snake.bite (app.js:1:1)' +
    '</div>' +
    '<a href="https://example.com" style="color:#33FF00">CLICK HERE for external link same tab</a>' +
    '<div style="margin-top:40vh">FOOTER CTA: <a href="#/play" style="font-size:20px;color:#FF0000">actually play</a></div>' +
    '</div>';
  return () => {};
}

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let pageCleanup = () => {};

function route() {
  pageCleanup();
  const root = document.getElementById('app-root');
  const h = (location.hash || '#/play').replace(/^#\/?/, '').split('?')[0] || 'play';
  // browser back breaks sometimes — replaceState randomly
  if (Math.random() < 0.15) {
    history.replaceState(null, '', '#/' + h);
  }
  if (h === 'scores') pageCleanup = mountScores(root);
  else if (h === 'profile') pageCleanup = mountProfile(root);
  else if (h === 'about') pageCleanup = mountAbout(root);
  else pageCleanup = mountPlay(root);

  // form focus triggers ad
  root.querySelectorAll('input, [contenteditable]').forEach((el) => {
    el.addEventListener('focus', () => maybeRandomAd('focus'));
  });
}

wireCookies();
wireAds();
wireSessionNag();
window.addEventListener('hashchange', route);
route();

// silence unused — keep misdirection symbols "used"
void add(2, 3);
void user_data;
