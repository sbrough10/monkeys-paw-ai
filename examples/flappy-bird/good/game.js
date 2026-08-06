(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayBody = document.getElementById("overlay-body");

  const W = canvas.width;
  const H = canvas.height;
  const GROUND_H = 96;
  const PLAY_H = H - GROUND_H;

  const GRAVITY = 0.42;
  const FLAP = -7.2;
  const PIPE_W = 64;
  const PIPE_GAP = 148;
  const PIPE_SPEED = 2.6;
  const PIPE_EVERY = 96;
  const BIRD_X = 96;
  const BIRD_R = 16;

  const STORAGE_KEY = "flappy-best";

  let best = Number(localStorage.getItem(STORAGE_KEY) || 0);
  let state = "ready"; // ready | playing | dead
  let birdY = PLAY_H / 2;
  let birdV = 0;
  let birdRot = 0;
  let frames = 0;
  let score = 0;
  let pipes = [];
  let groundX = 0;
  let flash = 0;
  let lastTs = 0;

  bestEl.textContent = `Best: ${best}`;

  function reset() {
    birdY = PLAY_H / 2;
    birdV = 0;
    birdRot = 0;
    frames = 0;
    score = 0;
    pipes = [];
    groundX = 0;
    flash = 0;
    scoreEl.textContent = "0";
  }

  function showOverlay(title, body) {
    overlayTitle.textContent = title;
    overlayBody.textContent = body;
    bestEl.textContent = `Best: ${best}`;
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function spawnPipe() {
    const margin = 48;
    const maxTop = PLAY_H - PIPE_GAP - margin;
    const top = margin + Math.random() * Math.max(20, maxTop - margin);
    pipes.push({ x: W + 20, top, passed: false });
  }

  function flap() {
    if (state === "ready") {
      state = "playing";
      hideOverlay();
      reset();
      birdV = FLAP;
      return;
    }
    if (state === "playing") {
      birdV = FLAP;
      return;
    }
    if (state === "dead") {
      state = "ready";
      reset();
      showOverlay("Ready?", "Flap to start");
    }
  }

  function collide(pipe) {
    const bx = BIRD_X;
    const by = birdY;
    const r = BIRD_R - 2;

    if (by + r >= PLAY_H || by - r <= 0) return true;

    const inX = bx + r > pipe.x && bx - r < pipe.x + PIPE_W;
    if (!inX) return false;

    const gapTop = pipe.top;
    const gapBot = pipe.top + PIPE_GAP;
    return by - r < gapTop || by + r > gapBot;
  }

  function die() {
    state = "dead";
    flash = 8;
    if (score > best) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    showOverlay("Game Over", "Flap to try again");
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, PLAY_H);
    g.addColorStop(0, "#7ec8e3");
    g.addColorStop(1, "#c8e9f5");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, PLAY_H);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    const clouds = [
      [40, 70, 28],
      [180, 110, 34],
      [300, 55, 22],
    ];
    for (const [cx, cy, s] of clouds) {
      const drift = ((frames * 0.3 + cx) % (W + 80)) - 40;
      ctx.beginPath();
      ctx.arc(drift, cy, s, 0, Math.PI * 2);
      ctx.arc(drift + s * 0.8, cy + 4, s * 0.75, 0, Math.PI * 2);
      ctx.arc(drift - s * 0.7, cy + 6, s * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPipe(pipe) {
    const x = pipe.x;
    const top = pipe.top;
    const bot = pipe.top + PIPE_GAP;

    const body = ctx.createLinearGradient(x, 0, x + PIPE_W, 0);
    body.addColorStop(0, "#3d8a24");
    body.addColorStop(0.35, "#6bc247");
    body.addColorStop(1, "#2f6e1a");

    ctx.fillStyle = body;
    ctx.fillRect(x + 4, 0, PIPE_W - 8, top - 18);
    ctx.fillRect(x + 4, bot + 18, PIPE_W - 8, PLAY_H - bot - 18);

    ctx.fillStyle = "#5aad3a";
    ctx.fillRect(x, top - 22, PIPE_W, 22);
    ctx.fillRect(x, bot, PIPE_W, 22);

    ctx.strokeStyle = "#2a2416";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, top - 22, PIPE_W - 3, 22);
    ctx.strokeRect(x + 1.5, bot, PIPE_W - 3, 22);
    ctx.strokeRect(x + 5.5, 0, PIPE_W - 11, top - 22);
    ctx.strokeRect(x + 5.5, bot + 22, PIPE_W - 11, PLAY_H - bot - 22);
  }

  function drawGround() {
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, PLAY_H, W, GROUND_H);

    ctx.fillStyle = "#c4b86a";
    ctx.fillRect(0, PLAY_H, W, 10);

    ctx.fillStyle = "#8b7a3d";
    for (let i = -20; i < W + 40; i += 28) {
      const gx = ((i + groundX) % (W + 40)) - 20;
      ctx.fillRect(gx, PLAY_H + 18, 16, 8);
    }

    ctx.strokeStyle = "#2a2416";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, PLAY_H + 1);
    ctx.lineTo(W, PLAY_H + 1);
    ctx.stroke();
  }

  function drawBird() {
    ctx.save();
    ctx.translate(BIRD_X, birdY);
    ctx.rotate(birdRot);

    // body
    ctx.fillStyle = "#f5d76e";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2a2416";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // wing
    const wingY = Math.sin(frames * 0.45) * 3;
    ctx.fillStyle = "#f0a030";
    ctx.beginPath();
    ctx.ellipse(-4, wingY, 10, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a2416";
    ctx.beginPath();
    ctx.arc(10, -4, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // beak
    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(24, 3);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function update() {
    if (state !== "playing") return;

    frames += 1;
    birdV += GRAVITY;
    birdY += birdV;
    birdRot = Math.max(-0.6, Math.min(1.1, birdV * 0.08));
    groundX = (groundX - PIPE_SPEED) % 28;

    if (frames % PIPE_EVERY === 0) spawnPipe();

    for (const pipe of pipes) {
      pipe.x -= PIPE_SPEED;
      if (!pipe.passed && pipe.x + PIPE_W < BIRD_X) {
        pipe.passed = true;
        score += 1;
        scoreEl.textContent = String(score);
      }
      if (collide(pipe)) {
        die();
        return;
      }
    }

    pipes = pipes.filter((p) => p.x > -PIPE_W - 10);

    if (birdY + BIRD_R >= PLAY_H || birdY - BIRD_R <= 0) {
      die();
    }
  }

  function idleAnimate() {
    frames += 1;
    birdY = PLAY_H / 2 + Math.sin(frames * 0.08) * 8;
    birdRot = Math.sin(frames * 0.08) * 0.12;
    groundX = (groundX - 1.2) % 28;
  }

  function draw() {
    drawSky();
    for (const pipe of pipes) drawPipe(pipe);
    drawGround();
    drawBird();

    if (flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flash / 10})`;
      ctx.fillRect(0, 0, W, H);
      flash -= 1;
    }
  }

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    lastTs = ts;

    if (state === "ready" || state === "dead") {
      if (state === "ready") idleAnimate();
    } else {
      update();
    }
    draw();
    requestAnimationFrame(loop);
  }

  function onInput(e) {
    if (e.type === "keydown" && e.code !== "Space" && e.code !== "ArrowUp") {
      return;
    }
    if (e.type === "keydown") e.preventDefault();
    flap();
  }

  canvas.addEventListener("pointerdown", onInput);
  window.addEventListener("keydown", onInput);

  showOverlay("Ready?", "Flap to start");
  requestAnimationFrame(loop);
})();
