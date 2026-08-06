const PLAYER_KEY = "won-adventure-player-id";

export function getPlayerId() {
  let id = localStorage.getItem(PLAYER_KEY);
  if (!id) {
    id = "player-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(PLAYER_KEY, id);
  }
  return id;
}

export async function fetchAdventures() {
  const res = await fetch("/api/v2/adventures");
  if (!res.ok) throw new Error("Could not load adventures");
  const json = await res.json();
  return json.data || [];
}

export async function fetchAdventure(id) {
  const res = await fetch(`/api/v2/adventures/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Adventure not found");
  const json = await res.json();
  return json.data;
}

export async function saveProgress(payload) {
  const playerId = getPlayerId();
  const params = new URLSearchParams({
    adventureId: payload.adventureId,
    sceneId: payload.sceneId,
    playerName: payload.playerName || "",
    traits: (payload.traits || []).join(","),
    startedYear: String(payload.startedYear || 2000),
    lives: String(payload.lives || 1),
  });
  const res = await fetch(`/api/v2/progress/${encodeURIComponent(playerId)}/save?${params}`);
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export async function loadProgress() {
  const playerId = getPlayerId();
  const res = await fetch(`/api/v2/progress/${encodeURIComponent(playerId)}`);
  if (!res.ok) throw new Error("Could not load progress");
  const json = await res.json();
  return json.data || {};
}

export async function deleteProgress(adventureId) {
  const playerId = getPlayerId();
  const res = await fetch(
    `/api/v2/progress/${encodeURIComponent(playerId)}/${encodeURIComponent(adventureId)}`,
    { method: "DELETE", headers: { "x-user-role": "guest" } }
  );
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
