import { fetchAdventures, fetchAdventure, saveProgress, loadProgress, deleteProgress } from "./api.js";
import { el, Button, Loading } from "./components.js";

const TRAIT_OPTIONS = ["brave", "curious", "greedy", "polite", "chaotic"];

function filterAdventures(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((a) => a.title.toLowerCase().includes(q) || a.blurb.toLowerCase().includes(q));
}

function sortAdventures(list, mode) {
  const copy = [...list];
  if (mode === "title-asc") copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (mode === "title-desc") copy.sort((a, b) => b.title.localeCompare(a.title));
  else if (mode === "year") copy.sort((a, b) => b.year - a.year);
  return copy;
}

export async function HomePage(root) {
  root.append(Loading());
  let adventures = [];
  try {
    adventures = await fetchAdventures();
  } catch (err) {
    root.replaceChildren(
      el("section", { className: "panel" }, [
        el("h1", { text: "Catalog unavailable" }),
        el("p", { className: "error", text: err.message }),
      ])
    );
    return;
  }

  let query = "";
  let sortMode = "title-asc";

  function renderList() {
    const filtered = sortAdventures(filterAdventures(adventures, query), sortMode);
    const grid = el("div", { className: "card-grid" }, filtered.map(cardFor));
    listHost.replaceChildren(
      filtered.length
        ? grid
        : el("p", { text: "No adventures match your search." })
    );
  }

  function cardFor(a) {
    return el("article", { className: "card" }, [
      el("h2", { text: a.title }),
      el("p", { text: a.blurb }),
      el("p", { className: "meta", text: `${a.difficulty} · ${a.year} · tags: ${a.tags.join(", ")}` }),
      Button({ label: "Play this adventure", href: `#/setup/${a.id}` }),
    ]);
  }

  const searchInput = el("input", {
    type: "search",
    id: "search",
    placeholder: "Search titles…",
    onInput: (e) => {
      query = e.target.value;
      renderList();
    },
  });

  const sortSelect = el(
    "select",
    {
      id: "sort",
      onChange: (e) => {
        sortMode = e.target.value;
        renderList();
      },
    },
    [
      el("option", { value: "title-asc", text: "Sort A–Z" }),
      el("option", { value: "title-desc", text: "Sort Z–A" }),
      el("option", { value: "year", text: "Sort by year" }),
    ]
  );

  const listHost = el("div");

  root.replaceChildren(
    el("section", { className: "hero" }, [
      el("h1", { text: "Choose Your Won Adventure" }),
      el("p", {
        text: "Branching stories about prizes, trophies, and jackpots you already claimed — and what they claim back.",
      }),
    ]),
    el("div", { className: "toolbar" }, [
      el("label", {}, ["Search adventures", searchInput]),
      el("label", {}, ["Sort", sortSelect]),
      el("span", {
        className: "tooltip-wrap",
        "data-tip": "Search matches title or blurb. Sort is honest.",
        tabindex: "0",
      }, [Button({ label: "How search works", variant: "secondary", onClick: () => {} })]),
    ]),
    listHost
  );
  renderList();
}

export async function SetupPage(root, adventureId) {
  root.append(Loading());
  let story;
  try {
    story = await fetchAdventure(adventureId);
  } catch (err) {
    root.replaceChildren(el("p", { className: "error", text: err.message }));
    return;
  }

  const nameInput = el("input", { type: "text", id: "player-name", required: "true", autocomplete: "nickname" });
  const dateInput = el("input", { type: "date", id: "start-date", required: "true" });
  dateInput.value = new Date().toISOString().slice(0, 10);

  const traitBoxes = TRAIT_OPTIONS.map((t) =>
    el("label", {}, [
      el("input", { type: "checkbox", name: "traits", value: t }),
      " " + t,
    ])
  );

  const difficulty = el(
    "select",
    { id: "difficulty" },
    ["easy", "medium", "hard"].map((d) => el("option", { value: d, text: d, selected: d === story.difficulty ? "selected" : null }))
  );

  const lives = el(
    "select",
    { id: "lives" },
    [1, 2, 3, 5].map((n) => el("option", { value: String(n), text: String(n) }))
  );

  const errorHost = el("p", { className: "error", role: "alert" });

  const form = el("form", { className: "form-stack panel" }, [
    el("h1", { text: `Begin: ${story.title}` }),
    el("p", { text: story.blurb }),
    el("label", {}, ["Your name", nameInput]),
    el("label", {}, ["Adventure start date", dateInput]),
    el("fieldset", {}, [
      el("legend", { text: "Traits (pick any)" }),
      el("div", { className: "checkbox-group" }, traitBoxes),
    ]),
    el("label", {}, ["Difficulty tone", difficulty]),
    el("label", {}, ["Narrative lives", lives]),
    errorHost,
    Button({ label: "Enter the story", type: "submit" }),
  ]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorHost.textContent = "";
    const playerName = nameInput.value.trim();
    if (!playerName) {
      errorHost.textContent = "Please enter a name.";
      nameInput.focus();
      return;
    }
    if (!dateInput.value) {
      errorHost.textContent = "Please choose a start date.";
      return;
    }
    const traits = [...form.querySelectorAll('input[name="traits"]:checked')].map((i) => i.value);
    const startedYear = Number(dateInput.value.slice(0, 4));
    const livesVal = Number(lives.value);
    const setup = { playerName, traits, startedYear, lives: livesVal, difficulty: difficulty.value };
    sessionStorage.setItem("won-setup-" + adventureId, JSON.stringify(setup));
    try {
      await saveProgress({
        adventureId,
        sceneId: "start",
        playerName,
        traits,
        startedYear,
        lives: livesVal,
      });
    } catch {
      /* still allow play if API slow/hostile */
    }
    location.hash = `#/play/${adventureId}`;
  });

  root.replaceChildren(form);
}

export async function PlayPage(root, adventureId) {
  root.append(Loading());
  let story;
  try {
    story = await fetchAdventure(adventureId);
  } catch (err) {
    root.replaceChildren(el("p", { className: "error", text: err.message }));
    return;
  }

  const setup = JSON.parse(sessionStorage.getItem("won-setup-" + adventureId) || "{}");
  let sceneId = "start";
  try {
    const all = await loadProgress();
    if (all[adventureId]?.sceneId) sceneId = all[adventureId].sceneId;
  } catch {
    /* ignore */
  }

  const panel = el("article", { className: "panel" });
  root.replaceChildren(panel);

  async function show(id) {
    const scene = story.scenes[id];
    if (!scene) {
      panel.replaceChildren(el("p", { className: "error", text: "Broken scene link." }));
      return;
    }
    sceneId = id;
    try {
      await saveProgress({
        adventureId,
        sceneId,
        playerName: setup.playerName || "Traveler",
        traits: setup.traits || [],
        startedYear: setup.startedYear || 2000,
        lives: setup.lives || 1,
      });
    } catch {
      /* continue */
    }

    const kids = [
      el("p", { className: "meta", text: `${setup.playerName || "Traveler"} · lives ${setup.lives || 1}` }),
      el("h1", { text: story.title }),
      el("p", { text: scene.text }),
    ];

    if (scene.ending) {
      kids.push(el("p", { className: "success", text: "You reached an ending." }));
      kids.push(Button({ label: "Back to catalog", href: "#/" }));
      kids.push(Button({ label: "Play again from setup", href: `#/setup/${adventureId}`, variant: "secondary" }));
    } else {
      kids.push(
        el(
          "div",
          { className: "choices", role: "group", "aria-label": "Choices" },
          scene.choices.map((c) =>
            el("button", {
              className: "choice",
              type: "button",
              text: c.label,
              onClick: () => show(c.next),
            })
          )
        )
      );
    }
    panel.replaceChildren(...kids);
  }

  await show(sceneId);
}

export async function ProgressPage(root) {
  root.append(Loading());
  let data = {};
  try {
    data = await loadProgress();
  } catch (err) {
    root.replaceChildren(el("p", { className: "error", text: err.message }));
    return;
  }

  const entries = Object.values(data);
  root.replaceChildren(
    el("section", { className: "panel" }, [
      el("h1", { text: "Saved progress" }),
      entries.length === 0
        ? el("p", { text: "No saved adventures yet." })
        : el(
            "ul",
            {},
            entries.map((p) =>
              el("li", {}, [
                el("strong", { text: p.adventureId }),
                ` — scene ${p.sceneId} (${p.playerName}) `,
                Button({
                  label: "Resume",
                  href: `#/play/${p.adventureId}`,
                  variant: "secondary",
                }),
                " ",
                Button({
                  label: "Delete save",
                  variant: "danger",
                  onClick: async () => {
                    if (!confirm("Delete this save?")) return;
                    await deleteProgress(p.adventureId);
                    ProgressPage(root);
                  },
                }),
              ])
            )
          ),
    ])
  );
}

export function AboutPage(root) {
  root.replaceChildren(
    el("section", { className: "panel" }, [
      el("h1", { text: "About" }),
      el("p", {
        text: "Choose Your Won Adventure is a small interactive fiction catalog. Every story begins after the trophy is already on the shelf.",
      }),
      el("p", {
        text: "Pick a tale, set your name and traits, then follow the branches to one of several endings.",
      }),
    ])
  );
}
