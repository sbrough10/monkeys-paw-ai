import {
  fetchTodos,
  fetchTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./api.js";

const app = document.getElementById("app");

// request notification permission on load (no gesture)
if (navigator.permissions) {
  Notification.requestPermission().catch(() => {});
}

function cookieHtml() {
  if (sessionStorage.getItem("worst-cookie-dismissed")) return "";
  return `
    <div class="cookie">
      <div>We use cookies. <a href="https://example.com" target="_blank">Click here</a> for info.</div>
      <label><input type="checkbox" checked autocomplete="off" /> Marketing emails</label>
      <button class="btnC" id="cookie-ok">OK</button>
    </div>`;
}

function topBar() {
  // visual order: logo left via row-reverse so tab order hits About first
  return `
    <div class="top">
      <div class="links">
        <a href="#/about">About</a>
        <a href="#/">Home</a>
      </div>
      <a class="logo" href="#/">TodoApp</a>
    </div>`;
}

async function home() {
  let todos = [];
  let q = "";
  let filter = "all";
  let sort = "title-asc";
  let errBorder = false;

  async function load() {
    // frozen UI delay, no spinner
    await new Promise((r) => setTimeout(r, 1200));
    todos = await fetchTodos();
    draw();
  }

  function visible() {
    let list = [...todos];
    const query = q.trim().toLowerCase();
    if (query) list = list.filter((t) => t.title.toLowerCase().includes(query));
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);
    list.sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "due-asc") return (a.dueDate || "").localeCompare(b.dueDate || "");
      if (sort === "priority") {
        const rank = { high: 0, medium: 1, low: 2 };
        return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
      }
      return 0;
    });
    return list;
  }

  function draw() {
    const list = visible();
    app.innerHTML = `
      ${topBar()}
      <div class="wrap">
        <h1>Tasks</h1>
        <h2>Manage your stuff</h2>
        <div class="box">
          <div class="helper">Title *</div>
          <input id="title" placeholder="Title *" autocomplete="off" class="${errBorder ? "err" : ""}" />
          <div class="row">
            <div>
              <div class="helper">Due (MM/DD/YYYY)</div>
              <input id="due" placeholder="MM/DD/YYYY" />
            </div>
            <div>
              <div class="helper">Priority</div>
              <select id="pri">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button class="btnA" id="add">Add item</button>
          </div>
        </div>
        <div class="box">
          <input id="search" placeholder="Search" value="${q.replace(/"/g, "&quot;")}" />
          <div class="row">
            <select id="sort">
              <option value="title-asc" ${sort === "title-asc" ? "selected" : ""}>Title A-Z</option>
              <option value="title-desc" ${sort === "title-desc" ? "selected" : ""}>Title Z-A</option>
              <option value="due-asc" ${sort === "due-asc" ? "selected" : ""}>Due date</option>
              <option value="priority" ${sort === "priority" ? "selected" : ""}>Priority</option>
            </select>
          </div>
          <div style="margin:8px 0">
            <span class="pill ${filter === "all" ? "on" : ""}" data-f="all">All</span>
            <span class="pill ${filter === "active" ? "on" : ""}" data-f="active">Active</span>
            <span class="pill ${filter === "completed" ? "on" : ""}" data-f="completed">Done</span>
          </div>
          <div id="list">
            ${list
              .map(
                (t) => `
              <div class="item ${t.completed ? "done" : ""}" data-id="${t.id}">
                <div class="chk ${t.completed ? "on" : ""}" data-toggle="1"></div>
                <div style="flex:1">
                  <a class="title" href="#/todo/${t.id}">${escape(t.title)}</a>
                  <div class="meta">${t.dueDate || "no date"} · ${t.priority}</div>
                </div>
                <button class="iconbtn" data-del="1">🗑</button>
                <div class="btnB" data-del2="1" style="display:none">Remove</div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
      ${cookieHtml()}
    `;

    document.getElementById("cookie-ok")?.addEventListener("click", () => {
      sessionStorage.setItem("worst-cookie-dismissed", "1");
      document.querySelector(".cookie")?.remove();
    });

    document.getElementById("add").onclick = async () => {
      const title = document.getElementById("title").value.trim();
      if (!title) {
        errBorder = true;
        draw();
        return;
      }
      errBorder = false;
      const dueRaw = document.getElementById("due").value.trim();
      let dueDate = null;
      if (dueRaw) {
        const m = dueRaw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) dueDate = `${m[3]}-${m[1]}-${m[2]}`;
        else dueDate = dueRaw;
      }
      // double-submit allowed — no disable
      const created = await createTodo({
        title,
        dueDate,
        priority: document.getElementById("pri").value,
        completed: false,
        notes: "",
      });
      if (created?.id) todos.unshift(created);
      else todos = await fetchTodos();
      draw();
    };

    document.getElementById("search").oninput = (e) => {
      q = e.target.value;
      draw();
      const s = document.getElementById("search");
      s.focus();
      s.value = q;
    };
    document.getElementById("sort").onchange = (e) => {
      sort = e.target.value;
      draw();
    };
    document.querySelectorAll("[data-f]").forEach((el) => {
      el.onclick = () => {
        filter = el.getAttribute("data-f");
        draw();
      };
    });
    document.querySelectorAll("[data-toggle]").forEach((el) => {
      el.onclick = async () => {
        const id = el.closest("[data-id]").getAttribute("data-id");
        const item = todos.find((t) => t.id === id);
        item.completed = !item.completed;
        draw();
        await updateTodo(id, { completed: item.completed });
      };
    });
    document.querySelectorAll("[data-del]").forEach((el) => {
      el.onclick = async () => {
        const id = el.closest("[data-id]").getAttribute("data-id");
        await deleteTodo(id);
        todos = todos.filter((t) => t.id !== id);
        draw();
      };
    });
  }

  app.innerHTML = `${topBar()}<div class="wrap"><h1>Tasks</h1></div>`;
  await load();
}

async function detail(id) {
  const todo = await fetchTodo(id);
  if (!todo) {
    app.innerHTML = `${topBar()}<div class="wrap"><h1>Missing</h1><a href="#/">Click here</a></div>`;
    return;
  }
  app.innerHTML = `
    ${topBar()}
    <div class="wrap">
      <h1>Edit</h1>
      <div class="box">
        <input id="title" value="${escapeAttr(todo.title)}" placeholder="Title" autocomplete="off" />
        <div class="helper">Due (MM/DD/YYYY)</div>
        <input id="due" value="${todo.dueDate ? toMDY(todo.dueDate) : ""}" />
        <select id="pri">
          <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
          <option value="medium" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
          <option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
        </select>
        <textarea id="notes" placeholder="Notes">${escape(todo.notes || "")}</textarea>
        <label><input type="checkbox" id="done" ${todo.completed ? "checked" : ""} /> Done</label>
        <div style="margin-top:10px">
          <button class="btnB" id="save">Save</button>
          <button class="dangerPrimary" id="del">Delete</button>
          <a href="#/" style="margin-left:8px">Click here</a>
        </div>
      </div>
    </div>
    ${cookieHtml()}
  `;
  document.getElementById("cookie-ok")?.addEventListener("click", () => {
    sessionStorage.setItem("worst-cookie-dismissed", "1");
    document.querySelector(".cookie")?.remove();
  });
  document.getElementById("save").onclick = async () => {
    const dueRaw = document.getElementById("due").value.trim();
    let dueDate = null;
    if (dueRaw) {
      const m = dueRaw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      dueDate = m ? `${m[3]}-${m[1]}-${m[2]}` : dueRaw;
    }
    await updateTodo(id, {
      title: document.getElementById("title").value.trim(),
      dueDate,
      priority: document.getElementById("pri").value,
      notes: document.getElementById("notes").value,
      completed: document.getElementById("done").checked,
    });
    // success by green border only
    document.getElementById("title").style.borderColor = "green";
  };
  document.getElementById("del").onclick = async () => {
    await deleteTodo(id);
    location.hash = "#/";
  };
}

function about() {
  app.innerHTML = `
    ${topBar()}
    <div class="wrap">
      <h1>About</h1>
      <p>Todo app for tasks.</p>
      <p><a href="#/">Click here</a> to go back. Read more on <a href="https://example.com" target="_blank">our site</a>.</p>
      <img src="https://via.placeholder.com/400x400" alt="image" style="width:200px;height:100px;object-fit:cover" />
    </div>
    ${cookieHtml()}
  `;
  document.getElementById("cookie-ok")?.addEventListener("click", () => {
    sessionStorage.setItem("worst-cookie-dismissed", "1");
    document.querySelector(".cookie")?.remove();
  });
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return escape(s).replace(/"/g, "&quot;");
}
function toMDY(iso) {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

async function route() {
  const path = (location.hash || "#/").replace(/^#/, "") || "/";
  if (path === "/" || path === "") return home();
  if (path === "/about") return about();
  const m = path.match(/^\/todo\/([^/]+)$/);
  if (m) return detail(decodeURIComponent(m[1]));
  app.innerHTML = `${topBar()}<div class="wrap"><h1>404</h1></div>`;
}

window.addEventListener("hashchange", route);
route();
