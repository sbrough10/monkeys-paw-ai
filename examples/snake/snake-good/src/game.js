const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const SPEED = { easy: 160, normal: 110, hard: 70 };

export function createGame(canvas, options = {}) {
  const cols = 20;
  const rows = 20;
  const cell = 21;
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  const ctx = canvas.getContext('2d');

  let snake = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 };
  let pending = dir;
  let food = spawnFood(snake, cols, rows);
  let score = 0;
  let alive = true;
  let paused = false;
  let started = false;
  let timer = null;
  let color = options.color || '#5eead4';
  let difficulty = options.difficulty || 'normal';

  const listeners = new Set();

  function emit() {
    const state = getState();
    listeners.forEach((fn) => fn(state));
  }

  function getState() {
    return { score, alive, paused, started, snakeLength: snake.length };
  }

  function reset() {
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    pending = dir;
    food = spawnFood(snake, cols, rows);
    score = 0;
    alive = true;
    paused = false;
    started = false;
    stopLoop();
    draw();
    emit();
  }

  function start() {
    if (!alive) reset();
    started = true;
    paused = false;
    startLoop();
    emit();
  }

  function togglePause() {
    if (!started || !alive) return;
    paused = !paused;
    if (paused) stopLoop();
    else startLoop();
    emit();
  }

  function setOptions(next) {
    if (next.color) color = next.color;
    if (next.difficulty) {
      difficulty = next.difficulty;
      if (started && alive && !paused) {
        stopLoop();
        startLoop();
      }
    }
  }

  function onKey(e) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const next = DIRS[key] || DIRS[e.key];
    if (!next) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!started) start();
        else togglePause();
      }
      return;
    }
    e.preventDefault();
    if (!started) start();
    // Disallow immediate reverse
    if (next.x === -dir.x && next.y === -dir.y) return;
    pending = next;
  }

  function tick() {
    if (!alive || paused) return;
    dir = pending;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
      die();
      return;
    }
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      die();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += difficulty === 'hard' ? 15 : difficulty === 'easy' ? 5 : 10;
      food = spawnFood(snake, cols, rows);
      beep(options.sound);
    } else {
      snake.pop();
    }
    draw();
    emit();
  }

  function die() {
    alive = false;
    stopLoop();
    draw();
    emit();
  }

  function startLoop() {
    stopLoop();
    timer = setInterval(tick, SPEED[difficulty] || SPEED.normal);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function draw() {
    ctx.fillStyle = '#1e3328';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = '#243d30';
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }

    ctx.fillStyle = '#f0a830';
    roundRect(ctx, food.x * cell + 3, food.y * cell + 3, cell - 6, cell - 6, 4);

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? lighten(color) : color;
      roundRect(ctx, seg.x * cell + 2, seg.y * cell + 2, cell - 4, cell - 4, 4);
    });
  }

  function destroy() {
    stopLoop();
    window.removeEventListener('keydown', onKey);
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(getState());
    return () => listeners.delete(fn);
  }

  window.addEventListener('keydown', onKey);
  draw();

  return { reset, start, togglePause, setOptions, destroy, subscribe, getState };
}

function spawnFood(snake, cols, rows) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  let spot;
  do {
    spot = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (occupied.has(`${spot.x},${spot.y}`));
  return spot;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function lighten(hex) {
  return hex;
}

function beep(enabled) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 520;
    g.gain.value = 0.03;
    o.start();
    o.stop(ctx.currentTime + 0.05);
  } catch {
    /* ignore */
  }
}
