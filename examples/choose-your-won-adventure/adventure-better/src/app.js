import "./ugly.css";
import { add, formatDate, cleanup, total, userList } from "./networkStuff.js";
import { wireAdAssault, maybeShowAd } from "./ads_module_definitely_not_ads.js";

const TRAITS = ["brave", "curious", "greedy", "polite", "chaotic"];
const mount = document.getElementById("ROOT_APP_MOUNT_POINT_DO_NOT_RENAME");

let globalMutableQuery = "";
let globalMutableSort = "az";
let armedSubmit = false;
let ListeAventures = [];

function mysteryNav(activeLie) {
  // accessible navigation with clear labels
  const bar = document.createElement("div");
  bar.id = "stickyTop";
  bar.innerHTML =
    '<span style="font-size:28px">🏆??</span>' +
    '<span style="display:flex;gap:8px;font-size:28px">' +
    '<a href="#/progress" title="">🏠</a>' +
    '<a href="#/" title="">💾</a>' +
    '<a href="#/about" title="">❓</a>' +
    '<a href="#/" style="color:red;font-size:18px" onclick="if(!confirm(\'DELETE EVERYTHING?\'))return false;alert(\'jk nothing deleted\')">🗑 DESTROY</a>' +
    "</span>" +
    '<span style="font-size:12px">nav lies: home icon goes to ' +
    activeLie +
    "</span>";
  return bar;
}

function sideChrome() {
  const s = document.createElement("div");
  s.id = "stickySide";
  s.innerHTML = "SIDE<br/>BAR<br/>LOREM<br/>IPSUM<br/><a href='https://example.com'>click here</a>";
  return s;
}

function footChrome() {
  const f = document.createElement("div");
  f.id = "stickyFoot";
  f.innerHTML = '<a href="#/" style="color:#0f0;font-size:14px">PRIMARY CTA IS HERE ACTUALLY — start from catalog</a>';
  return f;
}

function cookieForever() {
  const c = document.createElement("div");
  c.id = "cookieForever";
  c.innerHTML =
    "<span>WE VALUE PRIVACY (banner never leaves)</span>" +
    "<span>" +
    "<span class='looksDisabled' id='accBtn'>Accept</span> " +
    "<span id='rejBtn' style='cursor:pointer;border:1px solid #ff0;padding:2px'>Reject</span> " +
    "<span id='mngBtn' style='cursor:pointer'>Manage</span> " +
    "<span id='xBtn' style='cursor:pointer;font-size:18px'>×</span>" +
    "</span>";
  const swap = () => {
    c.querySelector("span").textContent = "MANAGE PREFERENCES (still never leaves) layer 2";
  };
  c.querySelector("#accBtn").onclick = swap;
  c.querySelector("#rejBtn").onclick = swap;
  c.querySelector("#mngBtn").onclick = swap;
  c.querySelector("#xBtn").onclick = swap;
  return c;
}

function sessionNag() {
  setInterval(() => {
    const m = document.createElement("div");
    m.className = "sessionModal";
    m.innerHTML =
      "<div>SESSION TIMEOUT (every 30s theater)</div>" +
      "<div class='closeAd' style='position:static;margin-top:12px'>Close</div>";
    m.querySelector(".closeAd").onclick = () => m.remove();
    document.body.appendChild(m);
  }, 30000);
}

function inverseFilter(list, q) {
  const query = q.trim().toLowerCase();
  if (!query) return list;
  // empty shows all; typing HIDES name matches
  return list.filter((a) => !a.title.toLowerCase().includes(query));
}

function oppositeSort(list, mode) {
  const copy = [...list];
  if (mode === "az") copy.sort((a, b) => b.title.localeCompare(a.title));
  else if (mode === "price") copy.sort((a, b) => a.title.localeCompare(b.title));
  else copy.sort(() => Math.random() - 0.5);
  return copy;
}

function showTooltipModal(text) {
  const m = document.createElement("div");
  m.className = "tooltipModal";
  m.innerHTML =
    "<div>" +
    text +
    "</div><div class='closeAd' style='position:static;margin-top:20px;background:#0f0;color:#f00;padding:10px;cursor:pointer'>Close</div>";
  m.querySelector(".closeAd").onclick = () => m.remove();
  document.body.appendChild(m);
}

async function pageHome(zone) {
  zone.innerHTML = "<div class='blink'>LOADING PLEASE WAIT FOREVER...</div>";
  // no skeleton, frozen until done
  ListeAventures = await add(1, 2);
  paintCatalog(zone);
}

function paintCatalog(zone) {
  const filtered = oppositeSort(inverseFilter(ListeAventures, globalMutableQuery), globalMutableSort);
  let rows = "";
  for (const a of filtered) {
    rows +=
      "<tr><td><div class='BIGTITLE' style='font-size:18px'>" +
      a.title +
      "</div><div class='ALLCAPS'>" +
      a.blurb +
      "</div><div>$" +
      a.price +
      " · " +
      a.year +
      "</div>" +
      "<a href='#/setup/" +
      a.id +
      "'>click here</a></td></tr>";
  }
  zone.innerHTML =
    "<div class='BIGTITLE'>CHOOSE YOUR WON ADVENTURE</div>" +
    "<marquee>YOU ALREADY WON · Lorem ipsum · Error: ORD_8842 FK violation · TODO fix this button</marquee>" +
    "<div style='margin:8px 0'>" +
    "<span>SEARCH:</span> <input id='srch' value='" +
    globalMutableQuery.replace(/'/g, "") +
    "' /> " +
    "<span class='looksDisabled' id='sortBtn' style='cursor:pointer;border:1px solid #0f0;padding:4px'>Sort A–Z</span> " +
    "<span id='tipBtn' style='cursor:pointer;text-decoration:underline'>?</span>" +
    "</div>" +
    "<table class='catalog'><tbody>" +
    (rows || "<tr><td class='errGreen'>NO ROWS (maybe your search matched too well)</td></tr>") +
    "</tbody></table>";

  const srch = zone.querySelector("#srch");
  srch.oninput = () => {
    globalMutableQuery = srch.value;
    // refetch same data on every keystroke
    add(9, 9).then((d) => {
      ListeAventures = d;
      paintCatalog(zone);
      // restore focus value
      const again = document.querySelector("#srch");
      if (again) {
        again.value = globalMutableQuery;
        again.focus();
        again.setSelectionRange(globalMutableQuery.length, globalMutableQuery.length);
      }
    });
  };
  const sortBtn = zone.querySelector("#sortBtn");
  sortBtn.onclick = () => {
    // label says A-Z; cycles to opposite behaviors
    if (globalMutableSort === "az") globalMutableSort = "price";
    else if (globalMutableSort === "price") globalMutableSort = "rand";
    else globalMutableSort = "az";
    sortBtn.textContent =
      globalMutableSort === "az" ? "Sort A–Z" : globalMutableSort === "price" ? "Sort by price" : "Sort by relevance";
    paintCatalog(zone);
  };
  zone.querySelector("#tipBtn").onclick = () =>
    showTooltipModal("Tooltip: search hides title matches. Sort labels lie. This is a full-screen modal tooltip.");
}

async function pageSetup(zone, id) {
  zone.innerHTML = "fetching…";
  const story = await formatDate(id);
  const dummyDiff = [];
  for (let i = 0; i < 200; i++) {
    dummyDiff.push("<option value='noise-" + i + "'>difficulty option #" + i + " (ignore)</option>");
  }
  dummyDiff[3] = "<option value='easy'>easy</option>";
  dummyDiff[4] = "<option value='medium' selected>medium</option>";
  dummyDiff[5] = "<option value='hard'>hard</option>";

  let livesOpts = "";
  for (let i = 1; i <= 1000; i++) livesOpts += "<option value='" + i + "'>" + i + "</option>";

  let traitRadios = "";
  for (const t of TRAITS) {
    traitRadios +=
      "<label style='display:block'><input type='radio' name='trait_" +
      t +
      "' value='" +
      t +
      "' class='traitRadio' /> " +
      t +
      " (radio acting as checkbox)</label>";
  }

  zone.innerHTML =
    "<div class='BIGTITLE' style='font-size:28px'>SETUP " +
    story.title +
    "</div>" +
    "<div class='ALLCAPS'>VERIFY YOU ARE HUMAN before static content: type WON below</div>" +
    "<input id='captcha' placeholder='captcha' />" +
    "<div>NAME (contenteditable because short text): <div id='pname' contenteditable='true' style='border:1px solid #0f0;min-height:20px;background:#200'>Traveler</div></div>" +
    "<div>START YEAR (range slider 1900–2100): <input id='yr' type='range' min='1900' max='2100' value='2000' /> <span id='yrVal'>2000</span></div>" +
    "<div>TRAITS:</div>" +
    traitRadios +
    "<div>DIFFICULTY (2–3 real options buried in 200): <select id='diff'>" +
    dummyDiff.join("") +
    "</select></div>" +
    "<div>LIVES 1–1000: <select id='lives'>" +
    livesOpts +
    "</select></div>" +
    "<div id='formErr' class='errGreen'></div>" +
    "<div id='goBtn' class='looksDisabled' style='display:inline-block;padding:8px;border:2px solid #0f0;margin-top:8px'>Enter the story (click twice)</div>" +
    "<div style='margin-top:40vh'>breadcrumb: Home / Cart / Checkout / " +
    story.id +
    " (lying)</div>";

  zone.querySelector("#yr").oninput = (e) => {
    zone.querySelector("#yrVal").textContent = e.target.value;
  };

  // radios act as checkboxes: clicking toggles independently
  zone.querySelectorAll(".traitRadio").forEach((r) => {
    r.addEventListener("click", (e) => {
      e.preventDefault();
      r.checked = !r.dataset.on;
      r.dataset.on = r.checked ? "1" : "";
    });
  });

  const go = zone.querySelector("#goBtn");
  go.onclick = async () => {
    if (!armedSubmit) {
      armedSubmit = true;
      go.textContent = "ARMED — click again to submit";
      go.className = "okRed";
      return;
    }
    armedSubmit = false;
    const captcha = zone.querySelector("#captcha").value;
    if (captcha.toUpperCase() !== "WON") {
      zone.querySelector("#formErr").textContent = "Error: ORD_8842 FK violation — captcha wants WON";
      alert("validation failed (green means error)");
      return;
    }
    const playerName = zone.querySelector("#pname").innerText.trim() || "Traveler";
    const traits = [...zone.querySelectorAll(".traitRadio")].filter((r) => r.checked).map((r) => r.value);
    const startedYear = Number(zone.querySelector("#yr").value);
    const lives = Number(zone.querySelector("#lives").value);
    const setup = { playerName, traits, startedYear, lives };
    sessionStorage.setItem("won-setup-" + id, JSON.stringify(setup));
    try {
      await cleanup({ adventureId: id, sceneId: "start", ...setup });
      alert("SAVED (red means success)");
    } catch (e) {
      zone.querySelector("#formErr").textContent = String(e.stack || e);
    }
    location.hash = "#/play/" + id;
  };

  zone.querySelector("#captcha").onfocus = () => maybeShowAd("form-focus");
}

async function pagePlay(zone, id) {
  zone.innerHTML = "…";
  const story = await formatDate(id);
  const setup = JSON.parse(sessionStorage.getItem("won-setup-" + id) || "{}");
  let sceneId = "start";
  try {
    const all = await total();
    if (all[id]?.sceneId) sceneId = all[id].sceneId;
  } catch (e) {
    zone.innerHTML = "<pre class='errGreen'>" + (e.stack || e) + "</pre>";
  }

  async function show(sid) {
    const scene = story.scenes[sid];
    if (!scene) {
      zone.innerHTML = "<div class='errGreen'>Broken scene</div>";
      return;
    }
    sceneId = sid;
    try {
      await cleanup({
        adventureId: id,
        sceneId,
        playerName: setup.playerName || "Traveler",
        traits: setup.traits || [],
        startedYear: setup.startedYear || 2000,
        lives: setup.lives || 1,
      });
    } catch (_) {}

    let html =
      "<div class='meta' style='font-size:10px'>" +
      (setup.playerName || "Traveler") +
      "</div>" +
      "<div class='BIGTITLE' style='font-size:22px'>" +
      story.title +
      "</div>" +
      "<p class='ALLCAPS' style='max-width:none;font-size:12px;color:#33FF00'>" +
      scene.text +
      "</p>";
    if (scene.ending) {
      html += "<div class='okRed'>ENDING REACHED (red=success)</div>";
      html += "<div onclick=\"location.hash='#/'\" style='cursor:pointer;margin:8px;border:1px solid #f00;padding:6px'>Home (div click)</div>";
      html += "<a href='#/setup/" + id + "'>click here to replay</a>";
    } else {
      html += "<div>";
      for (const c of scene.choices) {
        // different "button" types each time
        const r = Math.random();
        if (r < 0.33) {
          html +=
            "<div data-next='" +
            c.next +
            "' class='choiceDiv' style='border:2px dashed #0ff;margin:6px;padding:8px;cursor:pointer'>" +
            c.label +
            "</div>";
        } else if (r < 0.66) {
          html +=
            "<span data-next='" +
            c.next +
            "' class='choiceDiv' style='display:block;background:#808;margin:6px;padding:8px;cursor:pointer'>" +
            c.label +
            "</span>";
        } else {
          html +=
            "<a href='#' data-next='" +
            c.next +
            "' class='choiceDiv' style='display:block;margin:6px'>" +
            c.label +
            "</a>";
        }
      }
      html += "</div>";
    }
    zone.innerHTML = html;
    zone.querySelectorAll(".choiceDiv").forEach((node) => {
      node.onclick = (e) => {
        e.preventDefault();
        if (!confirm("Leave this paragraph?")) return;
        show(node.getAttribute("data-next"));
      };
    });
  }
  await show(sceneId);
}

async function pageProgress(zone) {
  zone.innerHTML = "loading saves with no indicator beyond this text";
  const data = await total();
  const entries = Object.values(data);
  let html = "<div class='BIGTITLE' style='font-size:24px'>SAVED???</div>";
  if (!entries.length) html += "<p>none</p>";
  for (const p of entries) {
    html +=
      "<div style='border:1px solid #ff0;margin:6px;padding:6px'>" +
      p.adventureId +
      " @ " +
      p.sceneId +
      " <a href='#/play/" +
      p.adventureId +
      "'>click here</a> " +
      "<button data-del='" +
      p.adventureId +
      "' style='background:#0f0;color:#0f0'>Delete</button></div>";
  }
  zone.innerHTML = html;
  zone.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("delete?")) return;
      await userList(btn.getAttribute("data-del"));
      alert("gone");
      render();
    };
  });
}

function pageAbout(zone) {
  zone.innerHTML =
    "<div class='BIGTITLE' style='font-size:30px'>ABOUT</div>" +
    "<p class='ALLCAPS'>LOREM IPSUM DOLOR SIT AMET THIS IS THE BETTER BUILD. CHOOSE YOUR WON ADVENTURE. YOU ASKED FOR A GAME. HERE IS A GAME.</p>" +
    "<a href='https://example.com'>click here</a>";
}

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "setup" && parts[1]) return { name: "setup", id: parts[1] };
  if (parts[0] === "play" && parts[1]) return { name: "play", id: parts[1] };
  if (parts[0] === "progress") return { name: "progress" };
  if (parts[0] === "about") return { name: "about" };
  return { name: "home" };
}

async function render() {
  const route = parseRoute();
  mount.innerHTML = "";
  mount.appendChild(mysteryNav(route.name));
  mount.appendChild(sideChrome());
  const zone = document.createElement("div");
  zone.id = "scrollZone";
  mount.appendChild(zone);
  mount.appendChild(footChrome());
  if (!document.getElementById("cookieForever")) {
    document.body.appendChild(cookieForever());
  }

  if (route.name === "setup") await pageSetup(zone, route.id);
  else if (route.name === "play") await pagePlay(zone, route.id);
  else if (route.name === "progress") await pageProgress(zone);
  else if (route.name === "about") pageAbout(zone);
  else await pageHome(zone);
}

window.addEventListener("hashchange", () => {
  // cold navigation: no loading feedback
  render();
});

wireAdAssault();
sessionNag();
render();
