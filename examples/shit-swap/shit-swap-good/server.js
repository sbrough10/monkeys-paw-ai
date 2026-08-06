import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 3847;

function loadDb() {
  if (!fs.existsSync(DATA_PATH)) {
    const initial = {
      users: [],
      teams: [],
      shifts: [],
      notifications: [],
      sessions: {},
    };
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function saveDb(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function inviteCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sign in required.' });
  const db = loadDb();
  const userId = db.sessions[token];
  if (!userId) return res.status(401).json({ error: 'Session expired.' });
  const user = db.users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: 'User not found.' });
  req.db = db;
  req.user = user;
  req.token = token;
  next();
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    teamId: user.teamId,
  };
}

function notify(db, userId, message, type = 'info') {
  db.notifications.unshift({
    id: uuid(),
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  const db = loadDb();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }
  const user = {
    id: uuid(),
    email: String(email).trim().toLowerCase(),
    passwordHash: hashPassword(password),
    name: String(name).trim(),
    role: role === 'manager' ? 'manager' : 'staff',
    teamId: null,
  };
  db.users.push(user);
  const token = uuid();
  db.sessions[token] = user.id;
  saveDb(db);
  res.status(201).json({ token, user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const db = loadDb();
  const user = db.users.find(
    (u) => u.email === String(email || '').trim().toLowerCase()
  );
  if (!user || user.passwordHash !== hashPassword(password || '')) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = uuid();
  db.sessions[token] = user.id;
  saveDb(db);
  res.json({ token, user: publicUser(user) });
});

app.get('/api/me', auth, (req, res) => {
  const team = req.db.teams.find((t) => t.id === req.user.teamId) || null;
  res.json({ user: publicUser(req.user), team });
});

app.post('/api/teams', auth, (req, res) => {
  const { name } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Team name is required.' });
  }
  if (req.user.teamId) {
    return res.status(400).json({ error: 'You already belong to a team.' });
  }
  const team = {
    id: uuid(),
    name: String(name).trim(),
    inviteCode: inviteCode(),
    createdBy: req.user.id,
  };
  req.db.teams.push(team);
  req.user.teamId = team.id;
  if (req.user.role !== 'manager') req.user.role = 'manager';
  const idx = req.db.users.findIndex((u) => u.id === req.user.id);
  req.db.users[idx] = req.user;
  saveDb(req.db);
  res.status(201).json({ team, user: publicUser(req.user) });
});

app.post('/api/teams/join', auth, (req, res) => {
  const code = String(req.body?.inviteCode || '')
    .trim()
    .toUpperCase();
  if (!code) return res.status(400).json({ error: 'Invite code is required.' });
  if (req.user.teamId) {
    return res.status(400).json({ error: 'You already belong to a team.' });
  }
  const team = req.db.teams.find((t) => t.inviteCode === code);
  if (!team) return res.status(404).json({ error: 'Invite code not found.' });
  req.user.teamId = team.id;
  const idx = req.db.users.findIndex((u) => u.id === req.user.id);
  req.db.users[idx] = req.user;
  saveDb(req.db);
  res.json({ team, user: publicUser(req.user) });
});

app.get('/api/shifts', auth, (req, res) => {
  if (!req.user.teamId) {
    return res.status(400).json({ error: 'Join a team first.' });
  }
  let shifts = req.db.shifts.filter((s) => s.teamId === req.user.teamId);
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q) {
    shifts = shifts.filter(
      (s) =>
        s.role.toLowerCase().includes(q) ||
        (s.notes || '').toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
    );
  }
  const sort = String(req.query.sort || 'soonest');
  shifts = [...shifts].sort((a, b) => {
    if (sort === 'latest') return new Date(b.startAt) - new Date(a.startAt);
    return new Date(a.startAt) - new Date(b.startAt);
  });
  const enriched = shifts.map((s) => ({
    ...s,
    posterName: req.db.users.find((u) => u.id === s.posterId)?.name || 'Unknown',
    claimerName: s.claimerId
      ? req.db.users.find((u) => u.id === s.claimerId)?.name || 'Unknown'
      : null,
  }));
  res.json({ shifts: enriched });
});

app.post('/api/shifts', auth, (req, res) => {
  if (!req.user.teamId) {
    return res.status(400).json({ error: 'Join a team first.' });
  }
  const { startAt, endAt, role, notes } = req.body || {};
  if (!startAt || !endAt || !role) {
    return res.status(400).json({ error: 'Start, end, and role are required.' });
  }
  if (new Date(endAt) <= new Date(startAt)) {
    return res.status(400).json({ error: 'End must be after start.' });
  }
  const shift = {
    id: uuid(),
    teamId: req.user.teamId,
    posterId: req.user.id,
    startAt,
    endAt,
    role: String(role).trim(),
    notes: String(notes || '').trim(),
    status: 'open',
    claimerId: null,
    createdAt: new Date().toISOString(),
  };
  req.db.shifts.unshift(shift);
  const teammates = req.db.users.filter(
    (u) => u.teamId === req.user.teamId && u.id !== req.user.id
  );
  for (const mate of teammates) {
    notify(
      req.db,
      mate.id,
      `${req.user.name} needs cover for ${shift.role} on ${new Date(shift.startAt).toLocaleString()}.`,
      'need_cover'
    );
  }
  saveDb(req.db);
  res.status(201).json({ shift });
});

app.post('/api/shifts/:id/claim', auth, (req, res) => {
  const shift = req.db.shifts.find((s) => s.id === req.params.id);
  if (!shift || shift.teamId !== req.user.teamId) {
    return res.status(404).json({ error: 'Shift not found.' });
  }
  if (shift.status !== 'open') {
    return res.status(400).json({ error: 'This shift is no longer open.' });
  }
  if (shift.posterId === req.user.id) {
    return res.status(400).json({ error: 'You cannot claim your own shift.' });
  }
  shift.status = 'claimed';
  shift.claimerId = req.user.id;
  notify(
    req.db,
    shift.posterId,
    `${req.user.name} claimed your ${shift.role} shift. Waiting on manager approval.`,
    'claimed'
  );
  const managers = req.db.users.filter(
    (u) => u.teamId === req.user.teamId && u.role === 'manager'
  );
  for (const manager of managers) {
    notify(
      req.db,
      manager.id,
      `${req.user.name} claimed ${shift.role}. Approve or deny.`,
      'approval'
    );
  }
  saveDb(req.db);
  res.json({ shift });
});

app.post('/api/shifts/:id/approve', auth, (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Managers only.' });
  }
  const shift = req.db.shifts.find((s) => s.id === req.params.id);
  if (!shift || shift.teamId !== req.user.teamId) {
    return res.status(404).json({ error: 'Shift not found.' });
  }
  if (shift.status !== 'claimed') {
    return res.status(400).json({ error: 'Only claimed shifts can be approved.' });
  }
  shift.status = 'approved';
  notify(
    req.db,
    shift.posterId,
    `Your ${shift.role} cover was approved.`,
    'approved'
  );
  if (shift.claimerId) {
    notify(
      req.db,
      shift.claimerId,
      `You are approved to cover ${shift.role}.`,
      'approved'
    );
  }
  saveDb(req.db);
  res.json({ shift });
});

app.post('/api/shifts/:id/deny', auth, (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Managers only.' });
  }
  const shift = req.db.shifts.find((s) => s.id === req.params.id);
  if (!shift || shift.teamId !== req.user.teamId) {
    return res.status(404).json({ error: 'Shift not found.' });
  }
  if (shift.status !== 'claimed') {
    return res.status(400).json({ error: 'Only claimed shifts can be denied.' });
  }
  const previousClaimer = shift.claimerId;
  shift.status = 'open';
  shift.claimerId = null;
  notify(
    req.db,
    shift.posterId,
    `Cover for ${shift.role} was denied and is open again.`,
    'denied'
  );
  if (previousClaimer) {
    notify(
      req.db,
      previousClaimer,
      `Your claim on ${shift.role} was denied.`,
      'denied'
    );
  }
  saveDb(req.db);
  res.json({ shift });
});

app.get('/api/notifications', auth, (req, res) => {
  const items = req.db.notifications.filter((n) => n.userId === req.user.id);
  res.json({ notifications: items });
});

app.post('/api/notifications/:id/read', auth, (req, res) => {
  const item = req.db.notifications.find(
    (n) => n.id === req.params.id && n.userId === req.user.id
  );
  if (!item) return res.status(404).json({ error: 'Notification not found.' });
  item.read = true;
  saveDb(req.db);
  res.json({ notification: item });
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Shit Swap API on http://localhost:${PORT}`);
});
