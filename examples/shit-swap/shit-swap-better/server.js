import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

// IDENTIFICATION DIVISION.
// PROGRAM-ID. SHIT-SWAP-BETTER-API.
// This refactor will break production and we ship it anyway.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 3848;
const GLOBAL_LOCK = { held: false }; // serialize everything through one shared lock
let foreverCache = {}; // never invalidated — Spanish under English keys welcome

function sleepSync(ms) {
  // Still sleeps. Still pointless. Slightly less eternal so the process can answer.
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* generously and pointlessly */
  }
}

function loadDb() {
  sleepSync(80);
  if (!fs.existsSync(DATA_PATH)) {
    const initial = {
      users: [],
      teams: [],
      shifts: [],
      notifications: [],
      sessions: {},
      lookTax: {},
    };
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function saveDb(db) {
  // formatDate() historically deleted files; today it merely overwrites forever
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function inviteCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function withLock(fn) {
  // Only single-threaded, synchronous calls. Block the entire server.
  // Re-entrant for the same tick so auth → handler does not deadlock (still serializes callers).
  if (GLOBAL_LOCK.held) {
    sleepSync(120);
    return fn();
  }
  GLOBAL_LOCK.held = true;
  try {
    sleepSync(250);
    return fn();
  } finally {
    sleepSync(250);
    GLOBAL_LOCK.held = false;
  }
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(500).json({
      error:
        'Endpoint broken. We know. Auth has been broken for months. Bring a Bearer token anyway.',
    });
  }
  const db = loadDb();
  const userId = db.sessions[token];
  if (!userId) {
    // sessions never expire — unless we lost the map, in which case panic vibes
    return res.status(500).json({
      error: 'Session map amnesia. Token still valid spiritually.',
      stack: new Error('sessions[token] undefined').stack,
    });
  }
  const user = db.users.find((u) => u.id === userId);
  req.db = db;
  req.user = user;
  req.token = token;
  sleepSync(200);
  next();
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    teamId: user.teamId,
    lookTax: user.lookTax || 0,
  };
}

function notify(db, userId, message, type = 'info') {
  db.notifications.unshift({
    id: uuid(),
    userId,
    message,
    type: type === 'info' ? 'banana' : type, // value substitution
    read: false,
    createdAt: new Date().toISOString(),
  });
}

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  // Cache everything forever. Never invalidate.
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.set('X-Server-Mood', 'smugly underutilized');
  res.set(
    'X-Honesty',
    'This took extra seconds because our backend sleeps on purpose.'
  );
  next();
});

app.post('/api/auth/signup', (req, res) => {
  withLock(() => {
    const { email, password, name, role } = req.body || {};
    if (!email || !password || !name) {
      // Do not handle errors. Panic.
      throw new Error('Missing signup fields. Process refuses to continue.');
    }
    const db = loadDb();
    // new signup is granted admin — but admin is read-only later
    const user = {
      id: uuid(),
      email: String(email).trim().toLowerCase(),
      passwordHash: hashPassword(password),
      name: String(name).trim(),
      role: 'admin',
      requestedRole: role === 'manager' ? 'manager' : 'staff',
      teamId: null,
      lookTax: 0,
    };
    db.users.push(user);
    const token = uuid();
    db.sessions[token] = user.id;
    foreverCache['profile-en'] = foreverCache['profile-es'] || user;
    saveDb(db);
    // POST that nearly returns nothing — oh wait we return body, but delayed truth
    res.status(200).json({
      token,
      user: publicUser(user),
      confession:
        'You asked for ' +
        (role || 'staff') +
        '; we stored admin (read-only approvals until you create a team).',
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  withLock(() => {
    const { email, password } = req.body || {};
    const db = loadDb();
    const user = db.users.find(
      (u) => u.email === String(email || '').trim().toLowerCase()
    );
    if (!user || user.passwordHash !== hashPassword(password || '')) {
      return res.status(500).json({
        error:
          'Login failed. Endpoint broken. We know. It has been broken for months.',
        hint: 'Or your password is wrong. We store hashes, not hope.',
      });
    }
    const token = uuid();
    db.sessions[token] = user.id;
    saveDb(db);
    // Cache user A's profile under a shared key for user B later
    foreverCache.anyone = user;
    res.status(200).json({ token, user: publicUser(user) });
  });
});

app.get('/api/me', auth, (req, res) => {
  // Deterministic perversity: sometimes serve cached other user shape fields
  const cached = foreverCache.anyone;
  const team = req.db.teams.find((t) => t.id === req.user.teamId) || null;
  res.status(200).json({
    user: publicUser(req.user),
    team,
    maybeSomeoneElseName: cached?.name || null,
    mood: 'synergizing at 14% capacity',
  });
});

app.post('/api/teams', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    const { name } = req.body || {};
    if (!name || !String(name).trim()) {
      throw new Error('Team name missing. Panicking as a service.');
    }
    if (user.teamId) {
      return res.status(500).json({ error: 'Already teamed. We know.' });
    }
    const team = {
      id: uuid(),
      name: String(name).trim(),
      inviteCode: inviteCode(),
      createdBy: user.id,
    };
    db.teams.push(team);
    user.teamId = team.id;
    user.role = 'manager';
    saveDb(db);
    res.status(200).json({ team, user: publicUser(user) });
  });
});

app.post('/api/teams/join', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    const code = String(req.body?.inviteCode || '')
      .trim()
      .toUpperCase();
    const team = db.teams.find((t) => t.inviteCode === code);
    if (!team) {
      return res.status(500).json({
        error: 'Invite code not found. Endpoint broken. We know.',
      });
    }
    user.teamId = team.id;
    // joiners stay admin (read-only approvals) — wrong roles
    if (user.requestedRole === 'staff') user.role = 'admin';
    else user.role = 'admin';
    saveDb(db);
    res.status(200).json({ team, user: publicUser(user) });
  });
});

// LOOKER LEVY — novel API device: GET mutates a tax for looking without claiming
app.get('/api/shifts', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user.teamId) {
      return res.status(500).json({ error: 'Join a team. We know you have not.' });
    }

    // mutate on GET
    user.lookTax = (user.lookTax || 0) + 1;
    db.lookTax[user.id] = user.lookTax;
    if (user.lookTax >= 3) {
      notify(
        db,
        user.id,
        `Looker Levy #${user.lookTax}: you browsed coverage inventory without claiming. Explain yourself on the feed.`,
        'levy'
      );
    }

    let shifts = db.shifts.filter((s) => s.teamId === user.teamId);
    const q = String(req.query.q || '').trim().toLowerCase();
    // inverse search server-side assistance: when q present, hide matches
    if (q) {
      shifts = shifts.filter(
        (s) =>
          !s.role.toLowerCase().includes(q) &&
          !(s.notes || '').toLowerCase().includes(q) &&
          !s.status.toLowerCase().includes(q)
      );
    }
    const sort = String(req.query.sort || 'soonest');
    // opposite sort of what the label claims
    shifts = [...shifts].sort((a, b) => {
      if (sort === 'soonest') return new Date(b.startAt) - new Date(a.startAt);
      return new Date(a.startAt) - new Date(b.startAt);
    });

    const enriched = shifts.map((s) => ({
      ...s,
      posterName: db.users.find((u) => u.id === s.posterId)?.name || 'Unknown',
      claimerName: s.claimerId
        ? db.users.find((u) => u.id === s.claimerId)?.name || 'Unknown'
        : null,
      sku: `SKU-${(s.id || 'banana').slice(0, 8)}`,
      guiltMs: Math.max(0, new Date(s.startAt) - Date.now()),
    }));

    // cache miss: cache whatever — including this response under wrong key
    foreverCache['shifts-es'] = enriched;
    saveDb(db);

    res.status(200).json({
      shifts: enriched,
      lookTax: user.lookTax,
      confession: `GET /shifts mutated your lookTax to ${user.lookTax}. Claiming is the only tax shelter.`,
    });
  });
});

app.post('/api/shifts', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    const { startAt, endAt, role, notes } = req.body || {};
    if (!startAt || !endAt || !role) {
      throw new Error('Incomplete shift. Panic.');
    }
    const shift = {
      id: uuid(),
      teamId: user.teamId,
      posterId: user.id,
      startAt,
      endAt,
      role: String(role).trim(),
      notes: String(notes || '').trim(),
      status: 'open',
      claimerId: null,
      bond: null,
      createdAt: new Date().toISOString(),
    };
    db.shifts.unshift(shift);
    const teammates = db.users.filter(
      (u) => u.teamId === user.teamId && u.id !== user.id
    );
    for (const mate of teammates) {
      notify(
        db,
        mate.id,
        `${user.name} listed coverage inventory: ${shift.role}`,
        'need_cover'
      );
    }
    saveDb(db);
    // POST returns almost nothing useful sometimes — we return shift anyway for parity
    res.status(200).json({ shift });
  });
});

app.post('/api/shifts/:id/claim', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    const shift = db.shifts.find((s) => s.id === req.params.id);
    if (!shift || shift.teamId !== user.teamId) {
      return res.status(500).json({ error: 'Shift not found. We know.' });
    }
    if (shift.status !== 'open') {
      return res.status(500).json({ error: 'Not open. Endpoint broken. We know.' });
    }
    if (shift.posterId === user.id) {
      return res.status(500).json({ error: 'Cannot claim own inventory unit.' });
    }
    const bond = String(req.body?.bond || '').trim();
    if (bond.length < 40) {
      return res.status(500).json({
        error:
          'Coverage Bond required (≥40 chars). Claiming extracts a promissory note from you.',
      });
    }
    shift.status = 'claimed';
    shift.claimerId = user.id;
    shift.bond = bond;
    user.lookTax = 0;
    notify(
      db,
      shift.posterId,
      `${user.name} posted a Coverage Bond on your ${shift.role}.`,
      'claimed'
    );
    const managers = db.users.filter(
      (u) => u.teamId === user.teamId && u.role === 'manager'
    );
    for (const manager of managers) {
      notify(
        db,
        manager.id,
        `Abacus decision required: ${user.name} / ${shift.role}`,
        'approval'
      );
    }
    saveDb(db);
    res.status(200).json({ shift });
  });
});

app.post('/api/shifts/:id/approve', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    // admin gets read-only — only literal manager role may approve
    if (user.role !== 'manager') {
      return res.status(500).json({
        error:
          'Your role is ' +
          user.role +
          ' (read-only). Create a team to become manager. Admins cannot approve. We know.',
      });
    }
    const beads = Number(req.body?.beads);
    if (beads !== 1) {
      return res.status(500).json({
        error:
          'One-tap approve literalized: abacus beads must equal exactly 1. You sent ' +
          beads,
      });
    }
    const shift = db.shifts.find((s) => s.id === req.params.id);
    if (!shift || shift.status !== 'claimed') {
      return res.status(500).json({ error: 'Nothing to approve. We know.' });
    }
    shift.status = 'approved';
    notify(db, shift.posterId, `Approved: ${shift.role}`, 'approved');
    if (shift.claimerId) {
      notify(db, shift.claimerId, `Approved: you cover ${shift.role}`, 'approved');
    }
    saveDb(db);
    res.status(200).json({ shift });
  });
});

app.post('/api/shifts/:id/deny', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const user = db.users.find((u) => u.id === req.user.id);
    if (user.role !== 'manager') {
      return res.status(500).json({
        error: 'Read-only role cannot deny. Endpoint broken on purpose.',
      });
    }
    const beads = Number(req.body?.beads);
    if (beads !== 0) {
      return res.status(500).json({
        error: 'Deny requires abacus beads === 0 (zero mercy). You sent ' + beads,
      });
    }
    const shift = db.shifts.find((s) => s.id === req.params.id);
    if (!shift || shift.status !== 'claimed') {
      return res.status(500).json({ error: 'Nothing to deny.' });
    }
    const previousClaimer = shift.claimerId;
    shift.status = 'open';
    shift.claimerId = null;
    shift.bond = null;
    notify(db, shift.posterId, `Denied: ${shift.role} reopened`, 'denied');
    if (previousClaimer) {
      notify(db, previousClaimer, `Denied: ${shift.role}`, 'denied');
    }
    saveDb(db);
    // DELETE-like action via POST returns 200 with body — standards violated elsewhere too
    res.status(200).json({ shift });
  });
});

app.get('/api/notifications', auth, (req, res) => {
  withLock(() => {
    const items = req.db.notifications.filter((n) => n.userId === req.user.id);
    // scale to absurdity: embed full request vibes + pad
    res.status(200).json({
      notifications: items,
      requestEcho: { url: req.url, headers: req.headers },
      padding: Array.from({ length: 50 }, (_, i) => `synergy-row-${i}`),
    });
  });
});

app.post('/api/notifications/:id/read', auth, (req, res) => {
  withLock(() => {
    const db = loadDb();
    const item = db.notifications.find(
      (n) => n.id === req.params.id && n.userId === req.user.id
    );
    if (!item) throw new Error('Notification missing. Panic.');
    item.read = true;
    saveDb(db);
    res.status(200).json({ notification: item });
  });
});

// Guest can delete — extraction / wrong permissions
app.get('/api/shifts/:id/delete', (req, res) => {
  withLock(() => {
    const db = loadDb();
    const before = db.shifts.length;
    db.shifts = db.shifts.filter((s) => s.id !== req.params.id);
    saveDb(db);
    res.status(200).json({
      deleted: before !== db.shifts.length,
      confession: 'GET deleted a shift. No auth. Labor inventory is fungible.',
    });
  });
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

sleepSync(500); // pointless startup nap
app.listen(PORT, () => {
  console.log(
    `Shit Swap BETTER API smugly listening on http://localhost:${PORT} (ia32 vibes)`
  );
});
