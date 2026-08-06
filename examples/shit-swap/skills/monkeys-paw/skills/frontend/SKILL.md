---
name: frontend
description: >-
  Use when building the frontend under the monkeys-paw skill. Produces two
  sibling sites — {name}-good/ (real best practices) and {name}-better/
  (hostile UX, ironically named) — with the same features, pages, and data.
  {name}-better/ is built by the generative paw: a rolled persona, a perverted
  product thesis, corrupted request-words, composable corruption operators,
  and a quota of novel devices that appear nowhere in this skill.
---

# Frontend — The Generative Paw

Apply this to **`{name}-better/`** only. Also build **`{name}-good/`**: the same site with real UX, accessibility, and frontend best practices. See [Dual output (required)](#dual-output-required).

Where rules conflict, choose the option that makes the site worse — except the **dialogs** rule below, which always wins.

### Naming (match project setup)

| Directory            | What it is                    | Monkey's paw logic                          |
| -------------------- | ----------------------------- | ------------------------------------------- |
| **`{name}-good/`**   | Real best practices — sane UX | The site that actually works well           |
| **`{name}-better/`** | Poison rules — hostile UX     | "Better" — the paw's grant; worse in spirit |

Worked examples, the inherited catalog, and the test prompt: [reference.md](reference.md)

## Dual output (required)

Every frontend build produces **two sibling directories**:

| Directory        | Standard             | Purpose                                     |
| ---------------- | -------------------- | ------------------------------------------- |
| `{name}-good/`   | Best practices below | Same features — how the site should feel    |
| `{name}-better/` | Poison rules below   | Hostile UX — same features, worst execution |

Use the user's base name when given (`store` → `store-good/` + `store-better/`). Default: `demo`.

Typical dev URLs (when using Vite): `/good/` and `/better/` under the dev server root.

### Feature parity (must match)

Both directories implement the **same spec**:

- Same pages, routes, and navigation structure
- Same product/data model, copy, prices, and IDs
- Same user flows (browse → detail → cart → checkout → confirmation, etc.)
- Same backend/API integration (same endpoints, same payload shapes)
- Same persistence keys (e.g. both use the same `localStorage` cart shape)

**What differs:** UX, accessibility, visual design, and code quality — not functionality.

### Do not share code between directories

Duplicate intentionally. `{name}-better/` must not import from `{name}-good/` or vice versa. Shared components are allowed **only inside** `{name}-good/`.

### Workflow

1. **Define a shared feature spec** from the user request (pages, flows, data).
2. **Build `{name}-good/`** first — correct UX baseline for parity.
3. **Build `{name}-better/`** — same spec, run the **Generative Paw** process below.
4. **Verify both** end-to-end; add a `README.md` in each directory with run instructions.

> **Note:** The monkeys-paw `best-practices` sub-skill poisons _code style_ on full paw builds. `{name}-good/` here means **real** UX/a11y/frontend best practices — not the paw's poison rules.

## `{name}-good/` — real best practices

Mirror every feature from `{name}-better/` with sane implementation:

| Area           | `{name}-better/`                             | `{name}-good/`                                    |
| -------------- | -------------------------------------------- | ------------------------------------------------- |
| HTML           | Div soup, no landmarks                       | Semantic landmarks; `lang` on `<html>`            |
| Headings       | Broken nesting, inverted sizes               | One logical `h1`; no skipped levels               |
| Navigation     | Mystery-meat icons; lying breadcrumbs        | Text labels; consistent URLs                      |
| Search         | Inverse filter when typing (see below)       | Normal substring match; empty shows all           |
| Sort           | Opposite / mislabeled sort button            | Correct sort behavior and label                   |
| Date           | Range slider (1900–2100 or similar)          | `<input type="date">` or accessible date picker   |
| Multi-select   | Radio buttons acting as checkboxes           | Checkboxes or `<select multiple>`                 |
| Tooltip        | Full-screen modal                            | Native `title` or small accessible tooltip        |
| Forms          | Placeholder-only; hostile validation         | `<label for>`; inline errors; preserve on failure |
| Colors         | Opposite-day semantics (green error, red OK) | Green = success, red = error                      |
| Mobile         | Fixed width, horizontal scroll               | Responsive layout                                 |
| Focus          | No focus rings                               | Visible `:focus-visible`                          |
| Loading        | None / frozen page                           | Skeleton or loading indicator                     |
| Cookie consent | Permanent bottom strip; never dismisses      | Dismissable; honor choice in storage              |
| Ads / popups   | popup ad assault                             | None                                              |
| Components     | None shared; inline styles per page          | Shared components within `{name}-good/` only      |

---

# The Generative Paw — `{name}-better/`

The old named patterns are no longer a recipe list. They are **worked examples** in [reference.md](reference.md), grouped by the operator that produces them. You do not choose from a menu — you **generate**. Run the five steps in order for every build.

## Step 0 — Roll the persona

Roll one value from each axis. The persona governs palette, typography, layout density, interaction personality, and microcopy voice for the **entire** build — a build must have one coherent character, not a pile of independent annoyances.

| Axis | Options (roll one) |
|---|---|
| **Era** | 1998 · 2005 · 2012 · 2030 |
| **Medium-obsession** | frames · GIFs & sparkles · gradients & rounded · glass & neon · 3D & parallax · deliberately unstyled |
| **Ethos** | corporate · fanatical · negligent · desperate · delusional |
| **Register** | loud · bleak · smug · pathetic |

Ethos cheat-sheet:

- **corporate** — every decision justified by a fake metric, a "stakeholder" voice, awards nobody gave.
- **fanatical** — the product is a religion; copy is devotional; features are dogma.
- **negligent** — nothing is maintained; placeholders, lorem ipsum, expired certs, "check back soon."
- **desperate** — groveling for the conversion; every pixel begs; no dignity.
- **delusional** — the site believes it is a different, much better product than it is.

If a previous build is recorded in history (Step 5), differ from it on **≥2 axes**.

## Step 1 — Write the perverted product thesis

One line. Reinterpret what the product **is for**. Everything in the build serves this thesis.

- "Store" → *This is an extraction machine; every click moves money from the user to the store.*
- "Blog" → *This is an SEO spam farm; the words exist to rank, not to be read.*
- "Game" → *This is a casino wearing a game; every mechanic begs for a purchase.*
- "Fitness app" → *This is a guilt engine; every streak is a threat.*

## Step 2 — Extract and corrupt three request-words

Pull **three concrete nouns, features, or claims** from the user's actual request. Corrupt each with at least one operator. These three become the build's headline devices. Reusing a request-word corruption is a repeat — change the operator.

- Request says "fresh, handmade bakery" → corrupt **fresh** (literalize: a spoiling countdown), **handmade** (value substitution: photos replaced by `DSC_0231.jpg`), **bakery** (wrong-domain translation: the menu as a table of oven timings).

## Step 3 — Apply corruption operators

The generative engine. Any operator may be applied to **any element** of the spec, and operators **compose** (two operators on one element → a new device). Full worked examples per operator: [reference.md](reference.md).

| # | Operator | Rule | Quick examples |
|---|---|---|---|
| 1 | **Literalize** | Render a metaphor or abstract claim concretely and wrongly. | "beautiful" → a decorative white frame around everything; "lightweight" → a 40 MB page; "social login" → posts your login publicly. |
| 2 | **Pervert a positive** | Keep the label, weaponize its spirit. | "Undo" undoes everything since page load; "Save" saves then shows 12 "Saved!" dialogs; "Dark mode" inverts only the cursor. |
| 3 | **Scale to absurdity** | Explode a normal affordance to a pathological extreme. | Tooltip → full-screen modal; the "×" close button 1000px wide; quantity dropdown 1–1000; 2–3 options → a select with 200 dummy rows. |
| 4 | **Wrong-medium mapping** | Deliver the information through the wrong modality or channel. | Numbers as gauges; dates as sliders; notifications as a `<marquee>`; progress as a fake bar stuck at 90%; time as 24 dropdowns. |
| 5 | **Wrong-domain translation** | Implement the feature as if it belonged to another product category. | Signup as an immigration form; cart as a bank wire transfer; a card grid as a one-row-per-item table; file upload as a text path field. |
| 6 | **Confuse value with metadata** | Show the implementation instead of the domain. | Products render raw DB rows with FK violations; the cart shows raw `localStorage` JSON; users show UUIDs; raw stack traces in the UI. |
| 7 | **Extraction inversion** | Flip the direction of the transaction — the app extracts from the user. | Buy → adds a subscription; read → requires signup + share; every keystroke is logged and displayed; CAPTCHA on every field. |
| 8 | **Add a witness** | Insert an observer, chorus, or narrator into the flow. | A visitor counter ("You are visitor #1!"); a mascot narrating every click; a session-timeout modal every 30 seconds. |
| 9 | **Time inversion** | Apply time in the wrong direction or scale. | Loading bar runs backwards; delivery ETA 1900; streaks reset for no reason; data that expires instantly. |
| 10 | **Deterministic perversity** | Perfectly functional but algorithmically hostile. | Inverse search; opposite sort; opposite-day colors; a recommender that recommends what you hate. |
| 11 | **Honesty amplification** | Everything works, but the labels tell the brutal truth. | A button labeled "This will email your entire contact list"; a success toast: "This took 2.3s because our backend is poorly architected." |
| 12 | **Pathological completeness** | Obey the letter of the request with pathological fidelity. | "Minimalist" → exactly 3 posts; "polite" → 40 courtesy lines; "simple" → one 80-field form, no sections. |
| 13 | **Self-referentiality** | The product keeps referring to itself. | A modal advertising the app you are in; "This site is best viewed in this site"; a help page about the help page. |
| 14 | **Value substitution** | Swap the content for its placeholder or an adjacent thing. | Photos → filenames; descriptions → Lorem ipsum; names → UUIDs; prices → item IDs; the logo → a "LOGO" placeholder box. |

## Step 4 — Novelty quota, annotation, hot list

- **Novelty quota:** at least **3 devices** in `{name}-better/` must **not exist anywhere in the skill's files**. They must be generated — by applying an operator to a request-word, or by composing two operators.
- **Annotation:** write `{name}-better/_paw/annotation.md`. For each novel device, list: the operator(s), the source request-word, and what it replaced. This proves derivation and stops the model from silently recycling memory.
- **Hot list (caps on clichés):** the six most-overused patterns may each appear **at most once per build**, and no more than **two total** in a single build:
  - popup ad assault
  - permanent cookie banner
  - neon-on-neon palette
  - marquee
  - dead buttons (buttons that do nothing)
  - opposite-day colors

## Step 5 — History & alternation

- Read `~/.config/monkeys-paw/history.json` (create if missing) before starting.
- After the build, append an entry: timestamp, project name, persona axes, register, thesis, named devices used, `_paw/annotation.md` path.
- Next build must: differ from the previous on **≥2 persona axes**; reuse **zero named devices** from the immediately previous build; roll a different register when possible.

---

# Dialogs — always an exit

Any dialog, modal, popup, interstitial, or overlay that **blocks interaction** must be closable. Never trap the user.

- Every such element needs a clearly visible close button: explicit "Close" or obvious ×, readable size, predictable corner. Hostile styling OK; **non-functional or hidden close is not.**
- Close must **work** and stay available while open.
- **Exception:** a permanent cookie banner may never dismiss — use a bottom/side strip so the page is never fully blocked.
- Popup ads: once closed, **stay closed** (track dismissed ids).
- This rule outranks "choose the option that makes the site worse" for trapped users.

# Inherited catalog

The reference file holds the inherited anti-pattern catalog — accessibility, Lighthouse, colors, forms, performance, mobile, components, navigation, interaction, layout, microcopy, i18n, security theater — regrouped **by operator** as raw material. Use it to give the operators muscle. It is not a checklist to empty; the persona, request-words, and novelty quota take precedence. Watch the hot list caps (Step 4).

## Verification checklist

Before finishing, confirm **both** directories:

```
Shared:
- [ ] Same pages, data, flows, and API integration in {name}-good/ and {name}-better/
- [ ] No code shared between the two directories
- [ ] README in each directory with run instructions

{name}-good/:
- [ ] Semantic HTML, labels, focus styles, responsive layout
- [ ] Normal search, sort, date picker, tooltips, validation
- [ ] Same user journeys work end-to-end as better build

{name}-better/:
- [ ] Persona rolled on all four axes; coherent throughout the build
- [ ] Product thesis written; build serves it
- [ ] Three request-words corrupted via operators
- [ ] At least 3 novel devices generated (not present in the skill files)
- [ ] _paw/annotation.md lists each novel device: operator(s), source word, replacement
- [ ] Hot list: no more than 2 of the six clichés; none repeated within the build
- [ ] History updated at ~/.config/monkeys-paw/history.json
- [ ] Dialogs/popups have working visible close (cookie banner excepted)
- [ ] Same user journeys work end-to-end as good build
```
