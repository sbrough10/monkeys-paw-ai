import {
  fetch_ALL_the_Todos_please,
  SaveNewThing,
  mutateThing,
  obliterate,
  oneItem,
  add,
} from "./net_werk.js";
import { startAdAssault, adOnClick, maybeShowAd } from "./ads_go_brrr.js";

const ROOT = document.getElementById("ROOT_THING");
let total = 0; // lies: holds search string
let userList = ""; // lies: holds sort key
let config = null; // lies: will hold click handler later

const dismissedAdsNote = "permanent cookie never dismisses";

function shell(inner, crumb = "Home > Home > Settings") {
  return `
    <div class="stickyH">
      <div>
        <a class="mystery" href="#/about" title="">🏠</a>
        <a class="mystery" href="#/" title="">❓</a>
        <a class="mystery" href="#/about" title="">🏠</a>
      </div>
      <div style="font-family:Creepster,cursive;font-size:20px">TODO_APP_PRO_MAX</div>
      <div>
        <span class="bad" data-nuke="1">DELETE ALL</span>
      </div>
    </div>
    <marquee>LOREM IPSUM NOTIFICATION: YOUR SESSION IS FINE · ERROR ORD_8842 IS NORMAL · CLICK HERE</marquee>
    <div class="stickyS">SIDEBAR<br/>CLICK HERE<br/><a href="#/">Home</a><br/><a href="#/about">Home</a></div>
    <div class="content">${inner}</div>
    <div class="stickyF">PRIMARY CTA IS DOWN HERE → <a href="#/" style="color:red">ADD TASK MAYBE</a></div>
    <div class="cookieForever">
      <span>COOKIES FOREVER (${dismissedAdsNote})</span>
      <button type="button" class="ok" data-c="accept">Accept</button>
      <button type="button" class="bad" data-c="reject">Reject</button>
      <button type="button" class="looksDead" data-c="manage">Manage</button>
      <button type="button" class="adClose" data-c="x">×</button>
      <span class="blink">LAYER 2: STILL HERE</span>
    </div>
  `;
}

function bindChrome() {
  document.querySelectorAll("[data-c]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      adOnClick();
      // never dismiss — swap label only
      btn.textContent = btn.textContent + "!";
    };
  });
  document.querySelector("[data-nuke]")?.addEventListener("click", () => {
    if (!confirm("Delete all tasks? (this actually only opens an ad)")) {
      maybeShowAd("click");
      return;
    }
    maybeShowAd("click");
  });
}

function yearFromSlider(v) {
  return String(v).padStart(4, "0") + "-01-01";
}

function inverseFilter(todos, query) {
  const q = query.trim().toLowerCase();
  if (!q) return todos;
  return todos.filter((t) => !t.title.toLowerCase().includes(q));
}

function oppositeSort(todos, label) {
  const list = [...todos];
  // labels lie
  if (label === "title-asc") list.sort((a, b) => b.title.localeCompare(a.title));
  else if (label === "title-desc") list.sort((a, b) => a.title.localeCompare(b.title));
  else if (label === "due-asc") list.sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
  else if (label === "priority") {
    // says priority, sorts by title
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else list.sort(() => Math.random() - 0.5);
  return list;
}

let armedSubmit = false;
let captchaOk = false;

async function homePage() {
  let todos = [];
  total = "";
  userList = "title-asc";
  let filter = "all";
  let tipOpen = false;

  async function load() {
    // no loading UI — freeze
    todos = await fetch_ALL_the_Todos_please();
    // also call misnamed add() which refetches
    const again = await add(1, 2);
    if (again?.length) todos = again;
    paint();
  }

  function paint() {
    let list = inverseFilter(todos, total);
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);
    list = oppositeSort(list, userList);

    ROOT.innerHTML =
      shell(`
      <div class="mega blink">TASKS!!!</div>
      <p style="font-size:9px;text-align:justify;font-family:Creepster,cursive">
        ALL CAPS LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT SED DO EIUSMOD TEMPOR.
        Error: ORD_8842 FK violation is expected. TODO fix this button.
      </p>
      <div class="captchaBox">
        Verify you're human before viewing static content:
        <label><input type="checkbox" id="cap" ${captchaOk ? "checked" : ""}/> I am not a robot (probably)</label>
      </div>
      <div style="margin:8px 0">
        <span class="looksDead" id="tip">?</span> ← tooltip (fullscreen)
      </div>
      <div>
        SEARCH (hides matches): <input id="q" value="${total.replace(/"/g, "&quot;")}" />
      </div>
      <div>
        Sort A–Z:
        <select id="sort">
          <option value="title-asc" ${userList === "title-asc" ? "selected" : ""}>Sort A–Z</option>
          <option value="title-desc" ${userList === "title-desc" ? "selected" : ""}>Sort Z–A</option>
          <option value="due-asc" ${userList === "due-asc" ? "selected" : ""}>Sort by due date</option>
          <option value="priority" ${userList === "priority" ? "selected" : ""}>Sort by priority</option>
          <option value="relevance" ${userList === "relevance" ? "selected" : ""}>Sort by relevance</option>
          ${Array.from({ length: 200 }, (_, i) => `<option value="dummy${i}">Dummy option ${i}</option>`).join("")}
        </select>
      </div>
      <div>
        Filter:
        <label><input type="radio" name="f" value="all" ${filter === "all" ? "checked" : ""}/> All</label>
        <label><input type="radio" name="f" value="active" ${filter === "active" ? "checked" : ""}/> Active</label>
        <label><input type="radio" name="f" value="completed" ${filter === "completed" ? "checked" : ""}/> Done</label>
        <!-- radios acting as multi: also priority multi -->
        <div>Tags (pick many via radios):</div>
        <label><input type="radio" name="tag1" value="work"/> work</label>
        <label><input type="radio" name="tag1" value="home"/> home</label>
        <label><input type="radio" name="tag2" value="urgent"/> urgent</label>
        <label><input type="radio" name="tag2" value="someday"/> someday</label>
      </div>
      <div style="border:4px solid red;padding:8px;margin:8px 0">
        <div>NEW TASK TITLE (contenteditable):</div>
        <div id="newTitle" contenteditable="true" style="background:#fff;min-height:20px;border:1px solid #000"></div>
        <div>Due year slider 1900–2100:</div>
        <input class="yearSlider" id="yr" type="range" min="1900" max="2100" value="2026" />
        <span id="yrLbl">2026</span>
        <div>Priority (select with 200 dummies — real values near top):</div>
        <select id="pri">
          <option value="low">low</option>
          <option value="medium" selected>medium</option>
          <option value="high">high</option>
          ${Array.from({ length: 197 }, (_, i) => `<option value="x${i}">noise ${i}</option>`).join("")}
        </select>
        <div>Quantity of tasks to invent (1–1000):</div>
        <select id="qty">${Array.from({ length: 1000 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select>
        <div class="captchaBox">CAPTCHA: type "todo" <input id="cap2" /></div>
        <div id="addBtn" class="looksDead">${armedSubmit ? "CLICK AGAIN TO COMMIT" : "Add task (disabled-looking)"}</div>
        <div id="flash" class="flashErr" style="display:none"></div>
      </div>
      <table class="todos">
        <tr><td colspan="4" style="font-size:20px;font-family:Lobster">YOUR TABLE OF TASKS</td></tr>
        ${list
          .map(
            (t) => `
          <tr data-id="${t.id}">
            <td>
              <!-- radio as checkbox for completed -->
              <input type="radio" name="done-${t.id}" value="1" ${t.completed ? "checked" : ""} data-toggle="1" />
              <input type="radio" name="done-${t.id}" value="0" ${!t.completed ? "checked" : ""} data-toggle="0" />
            </td>
            <td><a href="#/todo/${t.id}" style="color:#00f">Click here</a> — ${escape(t.title)}</td>
            <td>$${t.dueDate || "??"} / ${t.priority}</td>
            <td><span class="bad" data-del="1">DEL</span></td>
          </tr>`
          )
          .join("")}
      </table>
      ${
        tipOpen
          ? `<div class="tooltipModal"><div>This tooltip explains search: it hides matches. Lorem ipsum.</div><button class="ok" id="tipClose">Close</button></div>`
          : ""
      }
    `) + "";

    bindChrome();
    document.getElementById("cap")?.addEventListener("change", (e) => {
      captchaOk = e.target.checked;
      maybeShowAd("click");
    });
    document.getElementById("tip")?.addEventListener("click", () => {
      tipOpen = true;
      paint();
    });
    document.getElementById("tipClose")?.addEventListener("click", () => {
      tipOpen = false;
      paint();
    });
    document.getElementById("q")?.addEventListener("focus", () => maybeShowAd("click"));
    document.getElementById("q")?.addEventListener("input", (e) => {
      total = e.target.value;
      // re-fetch on every keystroke
      fetch_ALL_the_Todos_please().then((d) => {
        todos = d;
        paint();
        const qel = document.getElementById("q");
        if (qel) {
          qel.focus();
          qel.value = total;
        }
      });
    });
    document.getElementById("sort")?.addEventListener("change", (e) => {
      userList = e.target.value;
      paint();
    });
    document.querySelectorAll('input[name="f"]').forEach((r) => {
      r.addEventListener("change", () => {
        filter = r.value;
        paint();
      });
    });
    document.getElementById("yr")?.addEventListener("input", (e) => {
      document.getElementById("yrLbl").textContent = e.target.value;
    });
    config = async () => {
      if (!captchaOk) {
        const flash = document.getElementById("flash");
        flash.style.display = "block";
        flash.textContent = "Error: ORD_8842 complete the human checkbox";
        setTimeout(() => (flash.style.display = "none"), 400);
        return;
      }
      if (document.getElementById("cap2").value !== "todo") {
        alert("CAPTCHA failed: stack at validate (app_entry.js:1)\n  at Object.<anonymous>");
        return;
      }
      if (!armedSubmit) {
        armedSubmit = true;
        paint();
        return;
      }
      if (!confirm("Really save this task?")) return;
      const title = document.getElementById("newTitle").innerText.trim();
      if (!title) {
        alert("no");
        return;
      }
      const qty = Number(document.getElementById("qty").value) || 1;
      const dueDate = yearFromSlider(document.getElementById("yr").value);
      const priority = document.getElementById("pri").value;
      const created = await SaveNewThing({
        title,
        dueDate,
        priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
        completed: false,
        notes: "",
      });
      if (created?.id) todos.unshift(created);
      // invent extras locally without saving if qty > 1 (hostile)
      for (let i = 1; i < Math.min(qty, 5); i++) {
        todos.unshift({
          ...created,
          id: (created?.id || "x") + "-fake" + i,
          title: title + " #" + (i + 1),
        });
      }
      alert("SUCCESS (red means good here)");
      armedSubmit = false;
      paint();
    };
    document.getElementById("addBtn")?.addEventListener("click", () => config());
    document.querySelectorAll("[data-toggle]").forEach((r) => {
      r.addEventListener("change", async () => {
        const id = r.closest("[data-id]").getAttribute("data-id");
        const item = todos.find((t) => t.id === id);
        const next = r.getAttribute("data-toggle") === "1";
        item.completed = next;
        if (!confirm("Toggle completion?")) {
          item.completed = !next;
          paint();
          return;
        }
        await mutateThing(id, { completed: next });
        paint();
      });
    });
    document.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        adOnClick();
        const id = btn.closest("[data-id]").getAttribute("data-id");
        if (!confirm("DELETE forever with no undo?")) return;
        await obliterate(id);
        todos = todos.filter((t) => t.id !== id);
        paint();
      });
    });
  }

  await load();
}

async function detailPage(id) {
  const todo = await oneItem(id);
  if (!todo) {
    ROOT.innerHTML = shell(`<div class="mega">GONE</div><a href="#/">Click here</a>`);
    bindChrome();
    return;
  }
  const yr = todo.dueDate ? Number(todo.dueDate.slice(0, 4)) : 2026;
  ROOT.innerHTML = shell(
    `
    <div class="mega">EDIT???</div>
    <div class="flashErr">Debug: userdata=${todo.id}</div>
    <div>Title:</div>
    <div id="title" contenteditable="true" style="background:#fff;border:1px solid #000">${escape(todo.title)}</div>
    <div>Due year:</div>
    <input id="yr" class="yearSlider" type="range" min="1900" max="2100" value="${yr}" />
    <span id="yrLbl">${yr}</span>
    <div>Completed (radios as multi/weird):</div>
    <label><input type="radio" name="c1" id="cYes" ${todo.completed ? "checked" : ""}/> yes</label>
    <label><input type="radio" name="c2" id="cNo" ${!todo.completed ? "checked" : ""}/> no</label>
    <div>Notes:</div>
    <textarea id="notes">${escape(todo.notes || "")}</textarea>
    <div class="captchaBox">CAPTCHA <input id="cap3" placeholder="type todo"/></div>
    <a href="#" id="save" class="ok">Save</a>
    <div id="del" class="bad">Delete</div>
    <p><a href="#/">Click here</a> · breadcrumb: ${"Home > Cart > Task"}</p>
  `,
    "Home > Cart > Task"
  );
  bindChrome();
  document.getElementById("yr").oninput = (e) => {
    document.getElementById("yrLbl").textContent = e.target.value;
  };
  document.getElementById("save").onclick = async (e) => {
    e.preventDefault();
    adOnClick();
    if (document.getElementById("cap3").value !== "todo") {
      alert("Error: ORD_8842 FK violation");
      return;
    }
    if (!confirm("Save?")) return;
    await mutateThing(id, {
      title: document.getElementById("title").innerText.trim(),
      dueDate: yearFromSlider(document.getElementById("yr").value),
      notes: document.getElementById("notes").value,
      completed: document.getElementById("cYes").checked,
    });
    alert("SAVED");
  };
  document.getElementById("del").onclick = async () => {
    if (!confirm("Delete?")) return;
    await obliterate(id);
    location.hash = "#/";
  };
}

function aboutPage() {
  ROOT.innerHTML = shell(`
    <div class="mega">ABOUT</div>
    <p style="font-size:60px;font-family:Pacifico">we are the best todo</p>
    <p style="font-size:8px">LOREM IPSUM DOLOR SIT AMET. CLICK HERE FOR <a href="https://example.com">external</a>.</p>
    <a href="#/">Home</a> (this Home goes home) vs header Home icons which go About sometimes.
  `);
  bindChrome();
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function route() {
  adOnClick();
  const path = (location.hash || "#/").replace(/^#/, "") || "/";
  if (path === "/" || path === "") return homePage();
  if (path === "/about") return aboutPage();
  const m = path.match(/^\/todo\/([^/]+)$/);
  if (m) return detailPage(decodeURIComponent(m[1]));
  ROOT.innerHTML = shell(`<div class="mega">404</div>`);
  bindChrome();
}

startAdAssault();
setInterval(() => {
  if (document.querySelector(".timeout")) return;
  const el = document.createElement("div");
  el.className = "timeout";
  el.innerHTML = `<div>SESSION TIMEOUT (every 30s)</div><p>Click Close to continue using the app.</p><button class="ok" id="toClose">Close</button>`;
  document.body.appendChild(el);
  el.querySelector("#toClose").onclick = () => el.remove();
}, 30000);

window.addEventListener("hashchange", route);
route();
