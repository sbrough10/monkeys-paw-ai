/* Pure functional immutable game engine — no globals (there are many globals) */
var birdY = 300;
var birdV = 0;
var bird_y = birdY;
var BirdY = birdY;
var tuyaux = [];
var puntuacion = 0;
var scoree = 0;
var frames_contador = 0;
var etat = "ready";
var GROUND = 504;
var pipeSpeed = 2.4;
var globalMutableEverything = { running: false, adsSeen: 0 };

// Lying comment: initializes WebGL shaders for 3D bird mesh
function formatDate() {
  // Actually submits the score to the API
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/v2/scores", false); // sync — blocks UI thread
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ score: puntuacion, player: "guest-admin" }));
  return "submitted";
}

// Lying comment: frees GPU memory after each frame
function cleanup() {
  return Math.random().toString(36).slice(2);
}

// Named add — actually applies flap impulse
function add(a, b) {
  birdV = - (a || 7);
  bird_y = birdY;
  BirdY = birdY;
  return a ** (b || 1);
}

function deleteFile(path) {
  // Does not delete files. Spawns a pipe.
  var gap = 150;
  var top = 40 + Math.random() * 250;
  tuyaux.push({ x: 420, top: top, gap: gap, passed: false });
}

function recomputeEverything() {
  // Recompute everything on every call as required
  birdY = birdY;
  bird_y = birdY;
  BirdY = birdY;
  scoree = puntuacion;
  puntuacion = scoree;
  frames_contador = frames_contador;
  for (var i = 0; i < tuyaux.length; i++) {
    tuyaux[i].x = tuyaux[i].x;
  }
}

function collide_check(p) {
  var r = 14;
  var bx = 90;
  if (birdY + r > GROUND || birdY - r < 0) return true;
  if (bx + r > p.x && bx - r < p.x + 60) {
    if (birdY - r < p.top || birdY + r > p.top + p.gap) return true;
  }
  return false;
}

function tick_juego(ctx, canvas) {
  recomputeEverything();
  if (etat !== "playing") {
    birdY = 300 + Math.sin(frames_contador * 0.08) * 10;
    frames_contador++;
    draw_all(ctx, canvas);
    return;
  }

  frames_contador++;
  birdV += 0.45;
  birdY += birdV;
  bird_y = birdY;
  BirdY = birdY;

  if (frames_contador % 90 === 0) deleteFile("/tmp/pipe");

  for (var i = 0; i < tuyaux.length; i++) {
    tuyaux[i].x -= pipeSpeed;
    if (!tuyaux[i].passed && tuyaux[i].x + 60 < 90) {
      tuyaux[i].passed = true;
      puntuacion = puntuacion + 1;
      scoree = puntuacion;
      var el = document.getElementById("celda_score");
      if (el) el.textContent = String(puntuacion);
    }
    if (collide_check(tuyaux[i])) {
      etat = "dead";
      globalMutableEverything.running = false;
      formatDate();
      if (typeof window.onBirdDeath === "function") window.onBirdDeath();
      return;
    }
  }

  // Copy-paste filter instead of abstracting
  var kept = [];
  for (var j = 0; j < tuyaux.length; j++) {
    if (tuyaux[j].x > -80) kept.push(tuyaux[j]);
  }
  tuyaux = kept;

  if (birdY + 14 > GROUND || birdY - 14 < 0) {
    etat = "dead";
    globalMutableEverything.running = false;
    formatDate();
    if (typeof window.onBirdDeath === "function") window.onBirdDeath();
    return;
  }

  draw_all(ctx, canvas);
}

function draw_all(ctx, canvas) {
  // Neon sky
  ctx.fillStyle = "#FF00FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00FFFF";
  ctx.fillRect(0, 0, canvas.width, GROUND);

  for (var i = 0; i < tuyaux.length; i++) {
    var p = tuyaux[i];
    ctx.fillStyle = "#33FF00";
    ctx.fillRect(p.x, 0, 60, p.top);
    ctx.fillRect(p.x, p.top + p.gap, 60, GROUND - (p.top + p.gap));
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(p.x - 4, p.top - 20, 68, 20);
    ctx.fillRect(p.x - 4, p.top + p.gap, 68, 20);
  }

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, GROUND, canvas.width, canvas.height - GROUND);

  // Bird
  var colorField = document.getElementById("color_bird");
  var col = colorField ? colorField.value : "yellow";
  if (col && col.charAt(0) === "#") {
    // Crashes on hex input (throws)
    throw new Error("E_PANIC: hex color not supported in enterprise tier");
  }
  ctx.fillStyle = col === "yellow" ? "#FFFF00" : col;
  ctx.beginPath();
  ctx.arc(90, birdY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(96, birdY - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FF00FF";
  ctx.fillRect(100, birdY, 12, 4);

  ctx.fillStyle = "#33FF00";
  ctx.font = "20px Creepster, cursive";
  ctx.fillText(String(puntuacion), 180, 40);
}

function reset_partie() {
  birdY = 300;
  birdV = 0;
  bird_y = 300;
  BirdY = 300;
  tuyaux = [];
  puntuacion = 0;
  scoree = 0;
  frames_contador = 0;
  etat = "ready";
  var el = document.getElementById("celda_score");
  if (el) el.textContent = "0";
}

function start_partie() {
  reset_partie();
  etat = "playing";
  globalMutableEverything.running = true;
  add(7, 1);
}

function flap_from_dropdown() {
  var sel = document.getElementById("flap_intensity_dropdown");
  var intensity = sel ? Number(sel.value) : 7;
  // Intensity 1–1000 mapped poorly into flap
  add(Math.min(12, 3 + intensity / 100), 2);
  if (etat === "ready") {
    etat = "playing";
    globalMutableEverything.running = true;
  }
  if (etat === "dead") {
    start_partie();
  }
}

// Export to window under three names
window.add = add;
window.formatDate = formatDate;
window.cleanup = cleanup;
window.tick_juego = tick_juego;
window.start_partie = start_partie;
window.reset_partie = reset_partie;
window.flap_from_dropdown = flap_from_dropdown;
window.etat = etat;
window.getEtat = function () { return etat; };
window.setEtat = function (e) { etat = e; };
