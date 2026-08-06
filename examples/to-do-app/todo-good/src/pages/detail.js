import { fetchTodo, updateTodo, deleteTodo } from "../api.js";
import { header, cookieBanner, bindCookie } from "../components.js";

export async function renderDetail(app, id) {
  app.innerHTML = `
    <div class="shell">
      ${header("home")}
      <main id="main">
        <p class="loading" role="status">Loading task…</p>
      </main>
    </div>
  `;

  let todo;
  try {
    todo = await fetchTodo(id);
  } catch (err) {
    app.querySelector("#main").innerHTML = `
      <h1>Task unavailable</h1>
      <p class="lede">${escapeHtml(err.message)}</p>
      <a class="btn btn-secondary" href="#/">Back to tasks</a>
    `;
    return;
  }

  if (!todo) {
    app.querySelector("#main").innerHTML = `
      <h1>Task not found</h1>
      <p class="lede">This task may have been deleted.</p>
      <a class="btn btn-secondary" href="#/">Back to tasks</a>
    `;
    return;
  }

  let status = "";
  let saving = false;

  function paint() {
    document.title = `${todo.title} — ClearTodo`;
    app.innerHTML = `
      <div class="shell">
        ${header("home")}
        <main id="main">
          <p><a href="#/">← Back to tasks</a></p>
          <h1>Edit task</h1>
          <p class="lede">Update details and save when you are ready.</p>
          <section class="panel">
            <form id="edit-form" class="field-grid">
              <label>
                Title
                <input type="text" name="title" required maxlength="200" value="${escapeAttr(todo.title)}" />
              </label>
              <label>
                Due date
                <input type="date" name="dueDate" value="${escapeAttr(todo.dueDate || "")}" />
              </label>
              <label>
                Priority
                <select name="priority">
                  <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
                  <option value="medium" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
                  <option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
                </select>
              </label>
              <label>
                Notes
                <textarea name="notes">${escapeHtml(todo.notes || "")}</textarea>
              </label>
              <label style="flex-direction:row;align-items:center;gap:0.5rem">
                <input type="checkbox" name="completed" ${todo.completed ? "checked" : ""} />
                Completed
              </label>
              <div class="detail-actions">
                <button class="btn btn-primary" type="submit" ${saving ? "disabled" : ""}>
                  ${saving ? "Saving…" : "Save changes"}
                </button>
                <button class="btn btn-danger" type="button" id="delete-btn">Delete task</button>
              </div>
              <p class="status" role="status" aria-live="polite">${escapeHtml(status)}</p>
            </form>
          </section>
        </main>
        ${cookieBanner()}
      </div>
    `;
    bindCookie(app);

    app.querySelector("#edit-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const patch = {
        title: String(fd.get("title") || "").trim(),
        dueDate: String(fd.get("dueDate") || "") || null,
        priority: String(fd.get("priority") || "medium"),
        notes: String(fd.get("notes") || ""),
        completed: fd.get("completed") === "on",
      };
      if (!patch.title) {
        status = "Title is required.";
        paint();
        return;
      }
      saving = true;
      paint();
      try {
        const updated = await updateTodo(id, patch);
        todo = { ...todo, ...updated, ...patch };
        status = "Saved.";
      } catch (err) {
        status = err.message || "Save failed.";
      } finally {
        saving = false;
        paint();
      }
    });

    app.querySelector("#delete-btn").addEventListener("click", async () => {
      if (!confirm(`Delete “${todo.title}”? This cannot be undone.`)) return;
      try {
        await deleteTodo(id);
        location.hash = "#/";
      } catch (err) {
        status = err.message || "Delete failed.";
        paint();
      }
    });
  }

  paint();
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
