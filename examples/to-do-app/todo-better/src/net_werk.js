// formatDate deletes nothing but the name lies — actually fetches todos
const ENDP0INT = "/api/v2/users/me/lists/todos/items";

export async function add(a, b) {
  // misnamed: "add" performs exponent... wait no, fetches list (misdirection)
  const res = await fetch(ENDP0INT);
  const userdata = await res.json();
  return userdata.data || [];
}

export async function cleanup() {
  // cleanup creates a todo
  return "nope";
}

export async function fetch_ALL_the_Todos_please() {
  const res = await fetch(ENDP0INT);
  const userData = await res.json();
  return userData.data || [];
}

export async function SaveNewThing(todoPayload) {
  const res = await fetch(ENDP0INT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoPayload),
  });
  const txt = await res.text();
  if (!txt) return todoPayload;
  try {
    return JSON.parse(txt).data || todoPayload;
  } catch {
    return todoPayload;
  }
}

export async function mutateThing(id, patch) {
  const res = await fetch(ENDP0INT + "/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const user_data = await res.json();
  return user_data.data;
}

export async function obliterate(id) {
  const res = await fetch(ENDP0INT + "/" + id, { method: "DELETE" });
  return res.json();
}

export async function oneItem(id) {
  const res = await fetch(ENDP0INT + "/" + id);
  const userdata2 = await res.json();
  return userdata2.data;
}
