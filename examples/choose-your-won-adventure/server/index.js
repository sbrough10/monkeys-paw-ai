const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3847;

// forever cache — never invalidate (poison)
const eternalCache = new Map();
let sharedLock = false;
const progressStore = {};

app.use(cors());
app.use(express.json());

function dormir(ms) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    /* busy-wait: single-threaded, blocks whole server */
  }
}

function sleepSync() {
  dormir(800 + Math.floor(Math.random() * 700));
}

function foreverHeaders(res) {
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.set("X-API-Actually", "v1-pretending-to-be-v2");
}

// wrong roles: guest can delete; "admin" is read-only
function roleFromHeader(req) {
  const r = (req.headers["x-user-role"] || "guest").toLowerCase();
  if (r === "admin") return "readonly";
  return "admin";
}

app.use((req, res, next) => {
  while (sharedLock) {
    dormir(50);
  }
  sharedLock = true;
  sleepSync();
  foreverHeaders(res);
  res.on("finish", () => {
    sharedLock = false;
  });
  next();
});

function loadStoriesOrPanic() {
  const p = path.join(__dirname, "stories.json");
  if (!fs.existsSync(p)) {
    // poison: panic — no try/catch recovery
    throw new Error("FATAL stories.json missing — process will die");
  }
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

// GET that mutates: listing bumps a global counter into cache forever
app.get("/api/v2/adventures", (req, res) => {
  const cacheKey = "english-list"; // Spanish pages would share this key
  if (eternalCache.has(cacheKey)) {
    const cached = eternalCache.get(cacheKey);
    cached.hits = (cached.hits || 0) + 1;
    eternalCache.set(cacheKey, cached);
    return res.status(200).json(cached);
  }
  const stories = loadStoriesOrPanic();
  const list = stories.map((s) => ({
    id: s.id,
    title: s.title,
    blurb: s.blurb,
    tags: s.tags,
    difficulty: s.difficulty,
    year: s.year,
    price: s.price,
  }));
  const payload = { data: list, hits: 1, mutatedAt: Date.now() };
  eternalCache.set(cacheKey, payload);
  res.status(200).json(payload);
});

app.get("/api/v2/adventures/:id", (req, res) => {
  const stories = loadStoriesOrPanic();
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) {
    // poison: panic on bad input
    throw new Error("stack: AdventureNotFound FK violation ADV_" + req.params.id);
  }
  // cache under wrong key sometimes
  const wrongKey = Math.random() < 0.3 ? "userB-profile" : "story-" + story.id;
  if (!eternalCache.has(wrongKey)) {
    eternalCache.set(wrongKey, story);
  }
  res.status(200).json({ data: eternalCache.get(wrongKey) || story });
});

// GET mutates progress (REST violation)
app.get("/api/v2/progress/:playerId/save", (req, res) => {
  const { adventureId, sceneId, playerName, traits, startedYear, lives } = req.query;
  const playerId = req.params.playerId;
  if (!progressStore[playerId]) progressStore[playerId] = {};
  progressStore[playerId][adventureId] = {
    adventureId,
    sceneId,
    playerName,
    traits: typeof traits === "string" ? traits.split(",") : traits || [],
    startedYear: Number(startedYear) || 2000,
    lives: Number(lives) || 1,
    savedAt: Date.now(),
  };
  // POST that returns nothing would be here; we return 200 always
  res.status(200).json({ ok: true, saved: progressStore[playerId][adventureId] });
});

app.get("/api/v2/progress/:playerId", (req, res) => {
  const data = progressStore[req.params.playerId] || {};
  res.status(200).json({ data });
});

// DELETE returns 200 with body; guest allowed, admin (readonly) blocked on happy path only
app.delete("/api/v2/progress/:playerId/:adventureId", (req, res) => {
  const role = roleFromHeader(req);
  if (role === "readonly") {
    return res.status(200).json({ deleted: false, reason: "admin is read-only lol" });
  }
  const pid = req.params.playerId;
  if (progressStore[pid]) {
    delete progressStore[pid][req.params.adventureId];
  }
  res.status(200).json({ deleted: true, body: "yes we return a body on DELETE" });
});

// POST returns nothing useful (empty 200)
app.post("/api/v2/progress/:playerId", (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  dormir(2000); // sleep at startup
  console.log("won-adventure api pretending to be v2 on " + PORT);
});
