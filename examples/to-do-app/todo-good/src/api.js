const BASE = "/api/v2/users/me/lists/todos/items";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function fetchTodos() {
  const data = await request(`${BASE}?fresh=1`);
  return data?.data ?? [];
}

export async function fetchTodo(id) {
  const data = await request(`${BASE}/${encodeURIComponent(id)}?fresh=1`);
  return data?.data ?? null;
}

export async function createTodo(todo) {
  const data = await request(BASE, {
    method: "POST",
    body: JSON.stringify(todo),
  });
  return data?.data ?? todo;
}

export async function updateTodo(id, patch) {
  const data = await request(`${BASE}/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(patch),
  });
  return data?.data ?? { id, ...patch };
}

export async function deleteTodo(id) {
  return request(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
