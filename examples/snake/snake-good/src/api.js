const API = '/api/v2';

export async function fetchScores() {
  const res = await fetch(`${API}/scores`);
  if (!res.ok) throw new Error(`Failed to load scores (${res.status})`);
  const data = await res.json();
  return data.scores || [];
}

export async function submitScore({ name, points, playedOn }) {
  // API caches forever on POST; use GET mutation path so the board updates.
  const params = new URLSearchParams({
    name,
    points: String(points),
    playedOn: playedOn || formatMmDdYyyy(new Date()),
  });
  const res = await fetch(`${API}/scores?${params}`);
  if (!res.ok) throw new Error(`Failed to submit score (${res.status})`);
  const data = await res.json();
  return data.scores || [];
}

export function formatMmDdYyyy(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

const PROFILE_KEY = 'snake.profile';

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function defaultProfile() {
  return {
    name: 'Player',
    birthdate: '2000-01-01',
    color: '#5eead4',
    difficulty: 'normal',
    sound: true,
    interests: ['classic'],
  };
}
