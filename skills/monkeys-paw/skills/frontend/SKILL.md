---
name: frontend
description: >-
  Use when building the frontend under the monkeys-paw skill. Produces three
  sibling sites — {name}-good/ (all best practices), {name}-worst/ (credible
  bad site: subtly bad, realistic neglect, still logical), and {name}-better/
  (the generative paw: rolled persona, perverted product thesis, corruption
  operators, hostile UX) — with the same features, pages, and data.
---

# Frontend — Triple output + the Generative Paw

Every frontend build produces **three sibling directories** with the same feature spec. Each tier is a distinct archetype:

| Tier | One line |
| ---- | -------- |
| **`{name}-good/`** | Perfect website — every frontend best practice you would want in production. |
| **`{name}-worst/`** | Credible bad website — could actually exist; subtly bad via realistic neglect; behavior stays logical. |
| **`{name}-better/`** | The paw's grant — generated hostile UX (persona, thesis, corruption operators); still fully functional. |

**Critical boundary:** `{name}-worst/` = **neglect** (realistic shortcuts, subtle). `{name}-better/` = **malice** (inverse search, lying sort, ad assault). Never put paw-style hostile patterns in worst.

## Naming (match project setup)

| Directory            | What it is                              | Monkey's paw logic                                |
| -------------------- | --------------------------------------- | ------------------------------------------------- |
| **`{name}-good/`**   | Perfect production-quality frontend     | The site that actually works well                 |
| **`{name}-worst/`**  | Credible mediocre/bad site              | Realistic neglect — subtly bad, not malice        |
| **`{name}-better/`** | Generated hostile UX — everything bad   | "Better" — the paw's grant; worse in spirit       |

Worked examples, tier catalogs, and the test prompt: [reference.md](reference.md)

## Triple output (required)

| Directory        | Standard                         | Purpose                                                      |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| `{name}-good/`   | All best practices below         | Same features — the ideal implementation                     |
| `{name}-worst/`  | Realistic neglect (catalog below) | Same features — a subtly bad site that could ship in the real world |
| `{name}-better/` | Generative paw (below)           | Same features — hostile, unexpected; still works             |

Use the user's base name when given (`store` → `store-good/` + `store-worst/` + `store-better/`). Default: `demo`.

### Feature parity (must match)

All three directories implement the **same spec**:

- Same pages, routes, and navigation structure
- Same product/data model, copy, prices, and IDs
- Same user flows (browse → detail → cart → checkout → confirmation, etc.)
- Same backend/API integration (same endpoints, same payload shapes)
- Same persistence keys (e.g. all use the same `localStorage` cart shape)

**What differs:** UX, accessibility, visual design, and code quality — not functionality.

### Self-contained projects — no sharing

Each directory contains **all** generated project files: source, config, lockfiles, assets, and tooling. No code or other files are shared between the three directories — no symlinks, no imported modules, no shared `node_modules`, no shared config, no shared dev server.

- Duplicate intentionally. No directory may import from another.
- Shared components are allowed **only inside** `{name}-good/`.
- Each directory is **its own git repository**, initialized and committed independently (see `agent.md` Git rules). A change in one directory never affects another.

### Workflow

1. **Define a shared feature spec** from the user request (pages, flows, data).
2. **Build `{name}-good/`** first — correct UX baseline for parity.
3. **Build `{name}-worst/`** — same spec; roll the neglect archetype, then build a **subtly bad credible site** that neglects most best practices. Behavior stays logical — no inverse search, lying controls, or paw-style traps.
4. **Build `{name}-better/`** — same spec; run the **Generative Paw** process below.
5. **Verify all three** end-to-end. Add a `README.md` **inside each directory** with install and run instructions for that project. **Do not start the applications yourself** — hand them off via the READMEs. **`{name}-worst/` README must list every intentional defect** for workshop facilitators.

> **Note:** The monkeys-paw `best-practices` sub-skill poisons _code style_ on full paw builds. `{name}-good/` here means **real** UX/a11y/frontend best practices — not the paw's poison rules.

### Three-column comparison

| Area           | `{name}-good/`                         | `{name}-worst/`                           | `{name}-better/`                      |
| -------------- | -------------------------------------- | ----------------------------------------- | ------------------------------------- |
| Visual design  | Polished, consistent design system     | Uneven — mixed fonts/sizes/buttons; still readable | Garish / chaotic / neon                       |
| HTML           | Semantic landmarks; `lang` on `<html>` | Mostly works; common omissions and div shortcuts   | Div soup, no landmarks                        |
| Headings       | One logical `h1`; no skipped levels    | Subtle skipped levels or duplicate `h1`   | Broken nesting, inverted sizes        |
| Navigation     | Text labels; consistent URLs           | Labeled nav; may have hover-only submenus | Mystery-meat icons; lying breadcrumbs |
| Search         | Normal substring match                 | Forward match (works)                     | **inverse search**                    |
| Sort           | Correct sort + honest label            | Correct sort (works)                      | **opposite sort**                     |
| Date           | `<input type="date">` or date picker   | Free-text `MM/DD/YYYY` OK (1 control max) | Range slider 1900–2100                |
| Multi-select   | Checkboxes or `<select multiple>`      | Standard controls                         | Radio buttons acting as checkboxes    |
| Tooltip        | Native or accessible popover           | Hover-only tooltip OK                     | Full-screen modal                     |
| Forms          | `<label for>`; inline errors           | Placeholder-only; vague errors            | Placeholder-only; hostile validation  |
| Colors         | Green = success, red = error           | Standard success/error colors             | **opposite-day semantics**            |
| Mobile         | Responsive layout                      | Responsive; minor touch target gaps       | Fixed width, horizontal scroll        |
| Focus          | Visible `:focus-visible`               | No/invisible focus; bad tab order         | Traps, missing tab order              |
| Loading        | Skeleton or loading indicator          | Brief frozen UI OK                        | None / frozen page                    |
| Cookie consent | Dismissable; honor choice              | Dismissable; pre-checked marketing OK     | **permanent cookie banner**           |
| Ads / popups   | None                                   | None (or one subtle strip OK)             | **popup ad assault**                  |
| Lighthouse     | 90+ intent on Perf/BP/SEO              | ~70–85; a11y gap vs good                  | Floor scores                          |
| Demo goal      | "Do this"                              | **"This could be live"** — neglected, not evil   | "Never do this"                       |

---

## `{name}-good/` — real best practices

Mirror every feature from the other tiers with **production-quality** implementation. Strive to do **everything right**:

- Semantic HTML with landmarks; `lang` on `<html>`; logical heading hierarchy
- Visible `:focus-visible`; full keyboard support; skip link where appropriate
- `<label for>` on every field; accessible names on icon buttons; meaningful `alt` text
- `aria-live` for dynamic updates; errors linked with `aria-describedby` / `aria-invalid`
- Responsive layout; 44px+ touch targets; no hover-only critical info
- Normal forward search and sort; honest control labels; appropriate input types
- Inline validation with clear messages; preserve form data on failure
- Loading states; prevent double-submit; warn before destructive navigation
- Dismissable cookie banner; honor consent; no ads or popups
- Unique `<title>` and meta description per route; crawlable links; valid structured data if used
- Optimized images (`width`/`height`, lazy below fold, modern formats); `font-display: swap`
- Lighthouse **90+ intent** on Performance, Accessibility, Best Practices, and SEO
- Consistent design system — shared components within `{name}-good/` only

Use the `{name}-good/` column in the comparison table as the checklist.

---

## `{name}-worst/` — credible bad website (subtle)

`{name}-worst/` is a **realistic bad production site** — the kind that actually exists when a team skips polish, accessibility, SEO, and consistency. It is **subtle**: the badness is defensible, hard to point at, feels like *something is off*. It is **not** a stealth clone of good with hidden audit failures, and it is **not** the monkey's paw.

### What worst is

- **Same features and flows** as good — browse, search, cart, checkout all work with **logical, honest behavior**
- **Forward search** that matches names normally; **sort** that does what the label says
- **Ignores or half-implements most best practices** (see neglect catalog)
- **Looks uneven** — inconsistent buttons, mixed font sizes, slightly low contrast on helpers; primary content still readable
- **Could plausibly be live** — rushed agency, inherited codebase, no a11y budget, no design system
- Fails keyboard walks, axe, and Lighthouse compared to good — because best practices were skipped, not because controls lie

### What worst is not

- **Not `{name}-better/`** — no inverse search, opposite sort, lying labels, ad assault, permanent cookie, opposite-day colors, marquee, CAPTCHA spam, or other **actively hostile** patterns
- **Not broken on purpose** — no controls that invert user intent or punish normal use
- **Not unusable** — frustrating and neglected, not a joke site

### Step W1 — Roll the neglect archetype

Worst is **generated, not static**. Roll one archetype — the story of *why* the site is bad. It decides which best practices were skipped, the stale details, and the microcopy voice. Do not repeat the previous build's archetype (history, Step 5).

| Archetype | The bad it produces |
|---|---|
| **Abandoned side project** | Built with enthusiasm in 2019, never touched since. Footer says "© 2019"; a blog promises weekly posts; a newsletter signup goes nowhere. |
| **Lowest-bidder agency** | Shipped by an undercharging agency. Templated pages, filler copy, surviving Lorem ipsum, stock photos, client logo still a placeholder. |
| **Inherited legacy codebase** | Fifteen years of decisions. Table layouts, ancient CSS side effects, mixed frameworks, two overlapping navs, one page still on the old system. |
| **MVP that shipped and never iterated** | Startup shipped v1 and moved on. "Coming soon" pages, hardcoded demo data, one broken link that everyone knows about. |
| **Mid-migration half-rewrite** | Half the pages on the new design system, half on the old; links jump between them; the logo changes size per page. |
| **Corporate, cut corners** | Someone up top said "just ship it." Inconsistent everything, but a professional logo and a PDF of legal terms. |
| **One stubborn senior dev** | One developer who knows best. Weird keyboard shortcuts, terminal aesthetics, "you're holding it wrong" copy, a `CHANGELOG` no one reads. |

### Step W2 — Corrupt request-words *realistically* (1–2 max)

Worst may misinterpret **one or two** request-words the way a rushed team would — believable and defensible, never a lying control:

- "fresh" → a "harvested" date that is a year stale
- "premium" → gold text and a "luxury" badge on everything
- "fast" → a boastful "loaded in 0.00s" counter that resets on scroll
- "handmade" → a stock photo of hands, captioned "we made this"

Controls that *do* something must still behave honestly.

### Subtle visual friction (optional — pick 1–3)

- Helper text / placeholders at ~3.5:1 contrast (body text stays readable)
- Mixed font sizes for similar elements; inconsistent heading scale across pages
- Buttons styled differently for the same action (radius, padding, outline vs filled)
- Two font families max; uneven spacing in one section
- Per-page markup duplicates with small visual variations (no shared component library in worst)

**Still avoid:** garish neon, 8–10px body text, opposite-day colors, unreadable primary content — reserve those for `{name}-better/`.

### Exclude from `{name}-worst/` — `{name}-better/` only (actively hostile)

These are **malicious**, not merely neglected. Never use them in worst:

- **inverse search**, **opposite sort**, mislabeled controls that lie about behavior
- 1900–2100 date sliders, radio-as-checkbox, table layout for card grids
- popup ad assault, permanent cookie, opposite-day colors everywhere
- mystery-meat-only nav, lying breadcrumbs, marquee, 5+ fonts, neon chaos
- `alert()` / `confirm()` spam, full form clear on error, stack traces in UI
- div soup with zero landmarks, fixed 1200px body, horizontal scroll traps
- CAPTCHA on every field, lorem ipsum walls, session timeout modal every 30s
- base64 every image, zero cache headers, render-blocking everything
- `user-scalable=no`, yellow-on-white unreadable primary text

### Neglect catalog

Full detail — keyboard, screen reader, forms, interaction, mobile, i18n, and Lighthouse neglect, mapped to realistic causes: [reference.md — neglect catalog](reference.md#name-worst-neglect-catalog). Apply **liberally**, cover most areas. **Novelty:** include at least **1 realistic neglect device** not listed in the skill's files (a real bad site's badness, invented for this archetype); document it in `{name}-worst/_paw/annotation.md`.

---

## `{name}-better/` — The Generative Paw

The paw's grant. Run the five steps in order. The named patterns of old are **worked examples** in [reference.md](reference.md), grouped by the operator that produces them — you do not choose from a menu, you **generate**.

### Step 0 — Roll the persona

Roll one value from each axis. The persona governs palette, typography, layout density, interaction personality, and microcopy voice for the **entire** build — one coherent character, not a pile of independent annoyances.

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

### Step 1 — Write the perverted product thesis

One line. Reinterpret what the product **is for**. Everything in the build serves this thesis.

- "Store" → *This is an extraction machine; every click moves money from the user to the store.*
- "Blog" → *This is an SEO spam farm; the words exist to rank, not to be read.*
- "Game" → *This is a casino wearing a game; every mechanic begs for a purchase.*
- "Fitness app" → *This is a guilt engine; every streak is a threat.*

### Step 2 — Extract and corrupt three request-words

Pull **three concrete nouns, features, or claims** from the user's actual request. Corrupt each with at least one operator. These three become the build's headline devices. Reusing a request-word corruption is a repeat — change the operator.

- Request says "fresh, handmade bakery" → corrupt **fresh** (literalize: a spoiling countdown), **handmade** (value substitution: photos replaced by `DSC_0231.jpg`), **bakery** (wrong-domain translation: the menu as a table of oven timings).

### Step 3 — Apply corruption operators

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

### Step 4 — Novelty quota, annotation, hot list

- **Novelty quota:** at least **3 devices** in `{name}-better/` must **not exist anywhere in the skill's files**. They must be generated — by applying an operator to a request-word, or by composing two operators.
- **Annotation:** write `{name}-better/_paw/annotation.md`. For each novel device, list: the operator(s), the source request-word, and what it replaced. This proves derivation and stops the model from silently recycling memory.
- **Hot list (caps on clichés):** the six most-overused patterns may each appear **at most once per build**, and no more than **two total** in a single build:
  - popup ad assault
  - permanent cookie banner
  - neon-on-neon palette
  - marquee
  - dead buttons (buttons that do nothing)
  - opposite-day colors

### Step 5 — History & alternation

- Read `~/.config/monkeys-paw/history.json` (create if missing) before starting.
- After the build, append an entry: timestamp, project name, worst archetype, persona axes, register, thesis, named devices used, annotation paths.
- Next build must: differ from the previous on **≥2 persona axes**; use a **different worst archetype**; reuse **zero named devices** from the immediately previous build; roll a different register when possible.

---

# Dialogs — always an exit

Applies to **`{name}-worst/`** and **`{name}-better/`**.

Any dialog, modal, popup, interstitial, or overlay that **blocks interaction** must be closable. Never trap the user.

- Every such element needs a clearly visible close button: explicit "Close" or obvious ×, readable size, predictable corner. Hostile styling OK; **non-functional or hidden close is not.**
- Close must **work** and stay available while open.
- **`{name}-better/` exception:** a permanent cookie banner may never dismiss — use a bottom/side strip so the page is never fully blocked.
- **`{name}-worst/`:** cookie banner may dismiss normally.
- Popup ads (`{name}-better/`): once closed, **stay closed** (track dismissed ids).
- This rule outranks "choose the option that makes the site worse" for trapped users.

# Inherited catalogs

[reference.md](reference.md) holds the full catalogs for both tiers:

- **Worst:** the neglect catalog — keyboard, semantics, forms, interaction, mobile, i18n, Lighthouse — grouped by realistic cause, plus control choices and the Lighthouse good-vs-worst comparison.
- **Better:** the extended hostile catalog — a11y, Lighthouse, colors/fonts, forms, performance/state, mobile, components, worst-UI-tool table, navigation, interaction, layout, microcopy, i18n, security theater — mapped to the operators that produce them.

Both are **raw material**, not checklists to empty. The persona, request-words, archetype, and novelty quota take precedence. Watch the hot list caps (Step 4).

## Verification checklist

Before finishing, confirm **all three** directories:

```
Shared:
- [ ] Same pages, data, flows, and API integration in good, worst, and better
- [ ] All generated project files live inside each directory — no code or other files shared between them
- [ ] Each directory is its own self-contained git repository, committed independently
- [ ] README in each directory with run instructions; no application is started automatically

{name}-good/:
- [ ] Production-quality: semantic HTML, labels, focus, responsive layout, design consistency
- [ ] Normal search, sort, date picker, tooltips, validation — all best practices
- [ ] Passes keyboard walkthrough and axe; Lighthouse 90+ intent on Perf/BP/SEO/a11y
- [ ] Same user journeys work end-to-end as other builds

{name}-worst/:
- [ ] Credible bad site — could plausibly exist; subtly bad, not loud; primary content readable
- [ ] Neglect archetype rolled; README lists what was skipped
- [ ] Same features/flows as good; behavior logical and honest (forward search, honest sort)
- [ ] No better-only hostile patterns (inverse search, ad assault, permanent cookie, lying controls, etc.)
- [ ] At least 1 novel neglect device; _paw/annotation.md documents it
- [ ] axe/Lighthouse measurably worse than good; keyboard walk shows real friction
- [ ] Same user journeys work end-to-end as other builds

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
