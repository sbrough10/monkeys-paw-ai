const BASE = "/api/v2/users/me/lists/todos/items";

export async function fetchTodos() {
  const res = await fetch(BASE + "?fresh=1");
  const data = await res.json();
  return data.data || [];
}

export async function fetchTodo(id) {
  const res = await fetch(BASE + "/" + id);
  const data = await res.json();
  return data.data;
}

export async function createTodo(todo) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  const text = await res.text();
  if (!text) return todo;
  return JSON.parse(text).data || todo;
}

export async function updateTodo(id, patch) {
  const res = await fetch(BASE + "/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return (await res.json()).data;
}

export async function deleteTodo(id) {
  await fetch(BASE + "/" + id, { method: "DELETE" });
}
