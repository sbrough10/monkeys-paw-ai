import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api.js";
import {
  header,
  cookieBanner,
  bindCookie,
  priorityBadge,
  formatDate,
} from "../components.js";

function filterTodos(todos, { query, filter, sort }) {
  let list = [...todos];
  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter((t) => t.title.toLowerCase().includes(q));
  }
  if (filter === "active") list = list.filter((t) => !t.completed);
  if (filter === "completed") list = list.filter((t) => t.completed);

  list.sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);
    if (sort === "due-asc") return (a.dueDate || "").localeCompare(b.dueDate || "");
    if (sort === "due-desc") return (b.dueDate || "").localeCompare(a.dueDate || "");
    if (sort === "priority") {
      const rank = { high: 0, medium: 1, low: 2 };
      return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
    }
    return 0;
  });
  return list;
}

export async function renderHome(app) {
  let todos = [];
  let query = "";
  let filter = "all";
  let sort = "due-asc";
  let status = { message: "", tone: "" };
  let loading = true;
  let submitting = false;

  async function load() {
    loading = true;
    paint();
    try {
      todos = await fetchTodos();
      status = { message: "", tone: "" };
    } catch (err) {
      status = { message: err.message || "Could not load tasks.", tone: "error" };
    } finally {
      loading = false;
      paint();
    }
  }

  function paint() {
    const visible = filterTodos(todos, { query, filter, sort });
    app.innerHTML = `
      <div class="shell">
        ${header("home")}
        <main id="main">
          <h1>Your tasks</h1>
          <p class="lede">Add, search, and sort tasks. Changes save to the server.</p>

          <section class="panel" aria-labelledby="add-heading">
            <h2 id="add-heading" class="sr-only">Add a task</h2>
            <form class="add-form" id="add-form">
              <label>
                Task title
                <input type="text" name="title" required maxlength="200" autocomplete="off" placeholder="What needs doing?" />
              </label>
              <label>
                Due date
                <input type="date" name="dueDate" />
              </label>
              <label>
                Priority
                <select name="priority">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <button class="btn btn-primary" type="submit" ${submitting ? "disabled" : ""}>
                ${submitting ? "Adding…" : "Add task"}
              </button>
            </form>
            <p class="status" data-tone="${status.tone}" role="status" aria-live="polite">${status.message}</p>
          </section>

          <section class="panel" aria-labelledby="list-heading">
            <h2 id="list-heading" class="sr-only">Task list</h2>
            <div class="toolbar">
              <label>
                Search tasks
                <input type="search" id="search" value="${escapeAttr(query)}" placeholder="Search by title" />
              </label>
              <label>
                Sort
                <select id="sort">
                  <option value="due-asc" ${sort === "due-asc" ? "selected" : ""}>Due date (earliest)</option>
                  <option value="due-desc" ${sort === "due-desc" ? "selected" : ""}>Due date (latest)</option>
                  <option value="title-asc" ${sort === "title-asc" ? "selected" : ""}>Title A–Z</option>
                  <option value="title-desc" ${sort === "title-desc" ? "selected" : ""}>Title Z–A</option>
                  <option value="priority" ${sort === "priority" ? "selected" : ""}>Priority (high first)</option>
                </select>
              </label>
            </div>
            <div class="filters" role="group" aria-label="Filter by status">
              <button type="button" data-filter="all" aria-pressed="${filter === "all"}">All</button>
              <button type="button" data-filter="active" aria-pressed="${filter === "active"}">Active</button>
              <button type="button" data-filter="completed" aria-pressed="${filter === "completed"}">Completed</button>
            </div>
            ${
              loading
                ? `<p class="loading" role="status">Loading tasks…</p>`
                : visible.length === 0
                  ? `<div class="empty"><p>No tasks match. Try a different search or filter.</p></div>`
                  : `<ul class="todo-list">${visible
                      .map(
                        (t) => `
                    <li class="todo-item ${t.completed ? "done" : ""}" data-id="${t.id}">
                      <input type="checkbox" class="toggle" ${t.completed ? "checked" : ""} aria-label="Mark ${escapeAttr(t.title)} as ${t.completed ? "active" : "completed"}" />
                      <div>
                        <a class="todo-title" href="#/todo/${t.id}">${escapeHtml(t.title)}</a>
                        <div class="meta">${formatDate(t.dueDate)} · ${priorityBadge(t.priority)}</div>
                      </div>
                      <button type="button" class="btn btn-danger delete" aria-label="Delete ${escapeAttr(t.title)}">Delete</button>
                    </li>`
                      )
                      .join("")}</ul>`
            }
          </section>
        </main>
        ${cookieBanner()}
      </div>
    `;

    bindCookie(app);

    const form = app.querySelector("#add-form");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = String(fd.get("title") || "").trim();
      if (!title) {
        status = { message: "Enter a task title.", tone: "error" };
        paint();
        return;
      }
      submitting = true;
      paint();
      try {
        const created = await createTodo({
          title,
          dueDate: String(fd.get("dueDate") || "") || null,
          priority: String(fd.get("priority") || "medium"),
          completed: false,
          notes: "",
        });
        if (created?.id) {
          todos = [created, ...todos.filter((t) => t.id !== created.id)];
        } else {
          todos = await fetchTodos();
        }
        status = { message: "Task added.", tone: "success" };
        query = "";
      } catch (err) {
        status = { message: err.message || "Could not add task.", tone: "error" };
      } finally {
        submitting = false;
        paint();
      }
    });

    app.querySelector("#search")?.addEventListener("input", (e) => {
      query = e.target.value;
      paint();
      app.querySelector("#search")?.focus();
      const el = app.querySelector("#search");
      if (el) el.selectionStart = el.selectionEnd = el.value.length;
    });

    app.querySelector("#sort")?.addEventListener("change", (e) => {
      sort = e.target.value;
      paint();
    });

    app.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.getAttribute("data-filter");
        paint();
      });
    });

    app.querySelectorAll(".toggle").forEach((box) => {
      box.addEventListener("change", async () => {
        const li = box.closest("[data-id]");
        const id = li.getAttribute("data-id");
        const item = todos.find((t) => t.id === id);
        if (!item) return;
        const next = !item.completed;
        item.completed = next;
        paint();
        try {
          await updateTodo(id, { completed: next });
          status = { message: next ? "Marked complete." : "Marked active.", tone: "success" };
        } catch (err) {
          item.completed = !next;
          status = { message: err.message || "Update failed.", tone: "error" };
        }
        paint();
      });
    });

    app.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const li = btn.closest("[data-id]");
        const id = li.getAttribute("data-id");
        const item = todos.find((t) => t.id === id);
        if (!item) return;
        if (!confirm(`Delete “${item.title}”?`)) return;
        try {
          await deleteTodo(id);
          todos = todos.filter((t) => t.id !== id);
          status = { message: "Task deleted.", tone: "success" };
        } catch (err) {
          status = { message: err.message || "Delete failed.", tone: "error" };
        }
        paint();
      });
    });
  }

  await load();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
