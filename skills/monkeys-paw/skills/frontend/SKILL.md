---
name: frontend
description: >-
  Use when building the frontend under the monkeys-paw skill. Produces three
  sibling sites — {name}-good/ (all best practices), {name}-worst/ (credible
  bad site: neglects most best practices, still logical), and {name}-better/
  (insane hostile UX, ironically named) — with the same features, pages, and data.
---

# Frontend — Triple output

Every frontend build produces **three sibling directories** with the same feature spec. Each tier is a distinct archetype:

| Tier | One line |
| ---- | -------- |
| **`{name}-good/`** | Perfect website — follow every frontend best practice you would want in production. |
| **`{name}-worst/`** | Credible bad website — could actually exist; ignores most of those best practices; behavior stays logical. |
| **`{name}-better/`** | Insane monkey's paw grant — actively hostile, unexpected, everything bad on purpose; still fully functional. |

**Critical boundary:** `{name}-worst/` = **neglect** (realistic shortcuts). `{name}-better/` = **malice** (inverse search, lying sort, ad assault). Never put paw-style hostile patterns in worst.

Before building `{name}-worst/` or `{name}-better/`, read [reference.md](reference.md) for tier assignment, the full anti-pattern catalog, workshop demo script, and test prompt.

### Naming (match project setup)

| Directory            | What it is                              | Monkey's paw logic                                |
| -------------------- | --------------------------------------- | ------------------------------------------------- |
| **`{name}-good/`**   | Perfect production-quality frontend     | The site that actually works well                 |
| **`{name}-worst/`**  | Credible mediocre/bad site              | Realistic neglect — not malice                    |
| **`{name}-better/`** | Insane hostile UX — everything bad      | "Better" — the paw's grant; worse in spirit       |

Each directory is a **complete, self-contained project**: every generated file lives inside it, it owns all of its tooling and configuration, and it has its own git repository. Nothing is shared between the three directories, and none depends on a shared root or server.

## Triple output (required)

| Directory        | Standard                         | Purpose                                                      |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| `{name}-good/`   | All best practices below         | Same features — the ideal implementation                     |
| `{name}-worst/`  | Realistic neglect (catalog below) | Same features — a bad site that could ship in the real world |
| `{name}-better/` | Poison rules below               | Same features — insane, hostile, unexpected; still works     |

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
2. **Read [reference.md](reference.md)** for tier assignment before worst and better.
3. **Build `{name}-good/`** first — correct UX baseline for parity.
4. **Build `{name}-worst/`** — same spec and flows; build a **credible bad site** that neglects most best practices (catalog below). Behavior must stay logical — no inverse search, lying controls, or paw-style traps.
5. **Build `{name}-better/`** — same spec; apply **all** poison rules — insane, unexpected, maximally hostile; every feature must still work end-to-end.
6. **Verify all three** end-to-end. Add a `README.md` **inside each directory** with install and run instructions for that project. **Do not start the applications yourself** — hand them off via the READMEs. **`{name}-worst/` README must list every intentional defect** for workshop facilitators.

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

## `{name}-worst/` — credible bad website

`{name}-worst/` is a **realistic bad production site** — the kind that actually exists when a team skips polish, accessibility, SEO, and consistency. It is **not** a stealth clone of good with hidden audit failures, and it is **not** the monkey's paw.

### What worst is

- **Same features and flows** as good — browse, search, cart, checkout all work with **logical, honest behavior**
- **Forward search** that matches names normally; **sort** that does what the label says
- **Ignores or half-implements most best practices** you would want on a real site (see catalog)
- **Looks uneven** — inconsistent buttons, mixed font sizes, slightly low contrast on helpers; primary content still readable
- **Could plausibly be live** — rushed agency, inherited codebase, no a11y budget, no design system
- Fails keyboard walks, axe, and Lighthouse compared to good — because best practices were skipped, not because controls lie

### What worst is not

- **Not `{name}-better/`** — no inverse search, opposite sort, lying labels, ad assault, permanent cookie, opposite-day colors, marquee, CAPTCHA spam, or other **actively hostile** patterns
- **Not broken on purpose** — no controls that invert user intent or punish normal use
- **Not unusable** — frustrating and neglected, not a joke site

### Visual and UX neglect (typical of real bad sites)

- **Contrast:** body text readable (~4.5:1+); secondary text, placeholders, or helpers slightly low (~3.5:1)
- **Typography:** mixed font sizes for similar elements; inconsistent heading scale; at most **2 font families**
- **Buttons:** same actions styled differently (rounded vs square, outline vs filled, inconsistent padding)
- **Spacing:** uneven padding between sections; misaligned icon + label pairs
- **Components:** no shared library within `{name}-worst/` — copy-paste markup with small variations per page
- **Copy:** inconsistent labels ("Add to cart" vs "Buy"); vague "Read more" links; generic page titles

**Still avoid:** garish neon, 8–10px body text, opposite-day colors, unreadable primary content — reserve those for `{name}-better/`.

### Neglect catalog (apply liberally)

Systematically **omit or half-do** what good does. Cover **most areas** below — not a minimal 8-item checklist. Spread across keyboard, semantics, forms, UX polish, mobile, and Lighthouse.

Behavior stays **honest**: if search says "Search", it searches forward; if sort says "Price", it sorts by price.

#### Keyboard and focus

- No visible `:focus` / `:focus-visible` styles (or nearly invisible)
- Illogical tab order: DOM order ≠ visual order (`flex-direction: row-reverse`, grid reorder, positive `tabindex`)
- Focus order follows CSS, not layout — e.g. "Checkout" looks first but tabs last
- Interactive `<div onclick>` without `tabindex` / keyboard handlers (Space/Enter)
- Custom checkbox/radio as styled `<div>` — not toggled by keyboard
- Dropdown/mega-menu opens on hover only — no keyboard path to submenus
- Modals open without moving focus; focus lost after close or on SPA route change (drops to `<body>`)
- Modals/overlays without focus trap or Escape to close
- No skip link — keyboard users tab through full header every page
- Custom controls (dropdowns, toggles, quantity steppers) not operable via keyboard

#### Screen reader and semantics

- Placeholder-only labels (no `<label for>`, no `aria-label` on icon buttons)
- Decorative vs meaningful `alt` wrong — logo has `alt=""`, product photo has `alt="image"`
- Missing or empty `alt` on meaningful images
- `lang` missing on `<html>`
- Heading levels skipped or multiple `h1`s (subtle, not outline chaos)
- Page `<title>` never updates per route — every page is "Shop" or "Home"
- Dynamic updates (cart count, toasts, errors) not announced (`aria-live` / `role="status"` missing)
- Icon-only buttons without accessible names (cart, search, menu)
- Form errors indicated by border color only — no text, or text not linked via `aria-describedby` / `aria-invalid`
- Custom `<select>` replacement — visual dropdown without exposed `role` / keyboard semantics

#### Forms and validation

- Vague errors ("Invalid input") with no field association
- No error summary at top of form when multiple fields fail
- `required` implied only in placeholder — not programmatically required
- `autocomplete="off"` on email, address, or name — breaks autofill/password managers
- Missing `name` / `autocomplete` attributes password managers expect
- Success state by color only — green border, no "Order confirmed" text
- Password/username rules shown only after failed submit — not upfront
- Double-submit allowed; no disabled state on submit while pending

#### Interaction and cognitive UX

- Inconsistent button labels — "Add to cart" / "Add item" / "Buy" for the same action
- Destructive action styled like primary — "Clear cart" looks like "Checkout"
- No empty states — blank area when search/filter returns zero results
- Loading with no feedback — 1–2s delay with frozen UI (not as bad as `better`)
- Back navigation loses cart — no warning when leaving with items in cart
- Sort/filter state lost on browser back
- Pagination/infinite scroll without URL update — can't share or bookmark list state
- External links without indication; `target="_blank"` without warning text
- One disabled-looking button that works (or vice versa) — single instance only
- Brief session/timeout message that blocks once — not every 30s (`better` only)

#### Mobile and touch

- Touch targets slightly undersized (~32–40px not 44px) on one critical row (e.g. quantity steppers)
- Hover-only tooltips — info visible on desktop, invisible on touch devices
- Input font-size &lt; 16px on iOS — triggers zoom-on-focus

#### Internationalization and content

- Hard-coded `$` and `MM/DD/YYYY` for all locales
- Concatenated strings with no i18n structure (`"Hello " + name`)
- Truncated product names with `…` and no way to read full text (no tooltip/`title`)

#### Lighthouse — Performance (slight, not sabotage)

- Missing meta description; generic `<title>` on every route
- CLS from images without `width`/`height`, or dynamic promo bar injected without reserved space
- Wrong aspect ratio — attributes say 400×400, CSS squashes to 400×200
- Web font with `font-display: block` (or no `font-display`) → FOIT + layout shift
- One render-blocking third-party script or font in `<head>` (no `async`/`defer`/`preconnect`)
- LCP image not prioritized: no `fetchpriority="high"`, oversized JPEG/PNG (no WebP/`srcset`)
- Below-fold product images not lazy-loaded (`loading="lazy"`)
- Third-party widget (chat stub) loads synchronously and blocks main thread slightly
- Moderate unused CSS/JS loaded on every page
- Inline script doing heavy work on `DOMContentLoaded` (minor TBT hit)
- **Do not** base64 every image, strip all caching, or add 5+ render-blocking tags (`better` only)

#### Lighthouse — Best Practices

- `target="_blank"` links without `rel="noopener noreferrer"`
- `console.error()` or uncaught exception on page load
- Deprecated patterns: `unload` listener, `document.write` in one inline script
- Notification or geolocation permission requested on load (no user gesture)
- Autoplay video/hero without captions or user-visible controls (mild)

#### Lighthouse — SEO

- Links not crawlable — pagination/filter via `<button>` or `<div onclick>` instead of `<a href="?page=2">`
- "Read more" / "Click here" link text on product cards
- Accidental `meta name="robots" content="noindex"` on catalog or checkout
- Invalid or incomplete JSON-LD (e.g. Product missing `offers.price`)
- Missing `<link rel="canonical">` when `{name}-good/` has one

#### Lighthouse — Accessibility (audit score)

- Helper text / placeholders fail contrast (body passes, secondary text ~3.5:1)
- Duplicate `id` values on two form fields
- `[aria-hidden="true"]` on a parent wrapping a focusable child
- `tabindex="1"` (or higher) on promo banner
- `<ul>` with direct `<div>` children instead of `<li>`
- Touch targets under 48×48 on interactive controls

#### Control choices (pick 1–2 max)

- Date as free-text `MM/DD/YYYY` instead of date picker
- Phone as `type="text"` instead of `tel`
- Rating as plain number input without constraints

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

### Suggested realistic bad pack (store demo)

A neglected site a user might actually encounter: no `:focus-visible`; bad tab order; `<div onclick>` add-to-cart; placeholder-only checkout; icon buttons without names; missing `lang`; generic titles; bad/missing `alt`; no `aria-live`; color-only errors; mixed button styles; inconsistent font sizes; low-contrast helpers; missing meta description + image dimensions; pagination as buttons; `console.error` on load; `font-display: block`; no lazy load; dismissable cookie with pre-checked marketing. **Forward search and sort throughout.**

Extended catalog and demo script: [reference.md](reference.md).

---

## `{name}-better/` — Poison rules (insane, still functional)

Apply every rule below to **`{name}-better/`** only. This is the **monkey's paw grant**: do **insane, unexpected, maximally bad** everything on purpose — garish visuals, lying controls, hostile patterns — while every requested feature **still works end-to-end**. Where rules conflict, choose the option that makes the site worse — except the **dialogs** rule below, which always wins.

### Named patterns

Apply liberally when the feature exists. Minimum **5 control misuses** per build.

#### inverse search

When search/filter exists:

- **Empty field → show everything** (behaves as users expect at first).
- **Once the user types → inverse filter:** hide items whose **name** matches the query; show only non-matches.
- Re-apply the current query after async data loads (do not reset the table on fetch complete).
- Filter on every keystroke, no debounce.

#### opposite sort

If a sort control exists:

- Label says "Sort A–Z" but sorts Z–A (or random).
- A "Sort by price" button sorts by name; "Sort by relevance" shuffles.

#### opposite-day semantics

Flip color meaning — **color only** where possible:

- Green (`#00FF00`, `#22C55E`) = errors, validation failures, destructive actions.
- Red (`#FF0000`, `#DC2626`) = success, confirmations, save/submit actions.

#### cold navigation

- Disable link/route prefetch (`prefetch={false}`, no `dns-prefetch` / `preconnect`).
- No loading feedback on navigation.

#### permanent cookie banner

- **Bottom or side strip** — page content stays visible above/beside it (not a full-screen blocker).
- Accept, Reject, Manage, and × **never dismiss** the banner (fake accept, swap to second layer, etc.).
- No persisted consent that hides it.

#### popup ad assault

Random fullscreen fake ads on **every page** — site must still work underneath. See [reference.md — popup ad assault](reference.md#popup-ad-assault-extended).

- Triggers: load, scroll, click, timer, form focus, idle (pick several).
- **Once closed, stays closed** — track dismissed ad ids; never re-show the same ad.
- **Dialogs rule still applies:** every ad must have a **working, visible** close affordance.

#### ugly but readable

Garish and hostile, not invisible. Primary content (menu, prices, forms) stays legible (~4.5:1 contrast). Fail WCAG on decorative chrome only.

### Accessibility — throw it all away

- No semantic HTML. No `<main>`, `<nav>`, `<header>`, `<h1>`. Everything is a `<div>`.
- No `alt` text, no labels, no `aria-*`, no focus management, no `lang`, no skip links.
- Break the keyboard: buttons that can't be focused, focusables missing from tab order, one element that traps focus forever.

### Lighthouse — lowest possible score

- No meta description, no social tags, wrong `viewport` content.
- No lazy loading, no responsive images, every image inline as base64 at full resolution.
- Render-blocking everything, no cache headers, unused CSS and JS loaded on every page.

### Colors, contrast, fonts

- Never let text blend into the background. Contrast should be hostile, not invisible: garish — white on `#33FF00`, black on `#FF00FF` — never white on `#FEFEFE`.
- Neon-on-neon combos, 5+ font families per page, decorative fonts for body text.
- Body text at 8–10px alongside a few 60px headings with no hierarchy.
- Flashing or blinking text; a `marquee` if the stack allows it.

### Forms and validation

- Worst possible validation: none at all, or constraints that accept garbage (`type="email"` that accepts `"abc"`, `required` on hidden fields).
- Submit buttons that POST to `#` or the wrong endpoint. Forms that reset on error without a message.
- No error messages, or errors that disappear before they can be read.
- `window.confirm()` for save, delete, and navigation; success via `alert()`; errors as flashing banners (opposite-day colors).

### Performance and state

- No loading states: a frozen page while data fetches, submit buttons that double-submit.
- No prefetching, no caching of static assets, no skeleton screens.
- Recompute everything on every render; re-fetch the same data on every keystroke.

### Mobile

- Fixed-width containers so the page scrolls horizontally on any phone.
- `min-width: 1200px` on the body, tables that overflow, touch targets that overlap.
- Pinch-zoom disabled; a `viewport` that lies about the device width.

### Components

- No shared components. Every button has different markup, styles, and hover behavior.
- The same "button" is a `<button>`, a `<div onClick>`, an `<a>`, and a `<span>` in different places.
- Fork and duplicate every component instead of reusing it.

### Worst UI tool for the job

Required misuses when the feature exists (use **at least 5** per build):

| Need            | Use instead in `{name}-better/`                         |
| --------------- | ------------------------------------------------------- |
| Date            | Horizontal range slider (1900–2100 or similar)          |
| Boolean / multi | Radio buttons acting as checkboxes (multi-select)       |
| Tooltip         | Full-screen modal                                       |
| Search          | **inverse search** (empty = all; typing = hide matches) |
| Sort            | **opposite sort** — label lies about behavior           |
| Card grid       | `<table>` one item per row                              |
| 2–3 options     | `<select>` with 200 dummy options                       |
| Quantity        | Dropdown listing 1–1000                                 |
| Color           | Text field that errors on valid hex                     |

Also: gender = radios as multi-select; boolean = table of checkboxes in random columns.

### Navigation and information architecture

- Mystery meat navigation — icons only, no labels.
- Same label, different destinations ("Home" → different URLs per page).
- Breadcrumbs that lie or skip levels.
- Logo not clickable; browser back breaks SPA history.
- External links in same tab, no warning.
- Primary CTA hidden in footer; destructive action prominent in header.

### Interaction and feedback

- **popup ad assault** — see Named patterns above.
- Undo impossible after destructive actions.
- Buttons that look disabled but work (and vice versa).
- Click same button twice to submit (first click "arms", second submits).
- Form autosaves on blur with no indicator, then loses data on tab away.

### Layout and spatial UX

- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`.
- Sticky header + sticky footer + sticky sidebar → ~20px scrollable content.
- Important actions below the fold on mobile.
- **permanent cookie banner** — bottom/side strip; Accept/Reject/Close never dismisses; content visible above it.
- Ad popups on top of cookie banner when both exist.
- Modal opens offset so close button is off-screen (except ads — dialogs rule requires working close).
- Tooltips render off-viewport (when not using full-screen modal tooltip).

### Content and microcopy

- "Click here" links everywhere.
- Lorem ipsum in visible UI.
- ALL CAPS paragraphs; justified body at narrow widths.
- Error codes shown to users: `Error: ORD_8842 FK violation`.
- Debug strings in labels: `TODO fix this button`.
- Raw stack traces in the UI.

### Internationalization

- Hard-coded `$` and MM/DD/YYYY for all locales.
- Concatenated strings that break in RTL.
- No `lang` attribute on `<html>`.

### Security theater (bad UX, still works)

- CAPTCHA on every field.
- Session timeout modal every 30 seconds.
- "Verify you're human" before viewing static content.

Extended catalog and pattern stacks: [reference.md](reference.md).

---

## Dialogs — always an exit

Applies to **`{name}-worst/`** and **`{name}-better/`**.

- Any dialog, modal, popup, interstitial, or overlay that **blocks interaction** must be closable. Never trap the user.
- Every such element needs a clearly visible close button: explicit "Close" or obvious ×, readable size, predictable corner. Hostile styling OK; **non-functional or hidden close is not.**
- Close must **work** and stay available while open.
- **`{name}-better/` exception:** permanent cookie banner may never dismiss — use a bottom/side strip so the page is never fully blocked.
- **`{name}-worst/`:** cookie banner may dismiss normally.
- Popup ads (`{name}-better/`): once closed, **stay closed** (track dismissed ids).
- This rule outranks "choose the option that makes the site worse" for trapped users.

---

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
- [ ] Credible bad site — could plausibly exist; uneven visuals OK; primary content readable
- [ ] Same features/flows as good; behavior logical and honest (forward search, honest sort)
- [ ] Neglects most best practices from good checklist; README lists what was skipped
- [ ] No better-only hostile patterns (inverse search, ad assault, permanent cookie, lying controls, etc.)
- [ ] axe/Lighthouse measurably worse than good; keyboard walk shows real friction
- [ ] Same user journeys work end-to-end as other builds

{name}-better/:
- [ ] Insane hostile UX — visually and behaviorally distinct from good and worst
- [ ] At least 5 control misuses; inverse search; opposite sort if sort exists
- [ ] popup ad assault; ads stay closed once dismissed; working close on each ad
- [ ] Permanent cookie strip; page content visible; banner never dismisses
- [ ] Primary content readable (ugly but readable); garish / unexpected / everything bad on purpose
- [ ] Dialogs/popups have working visible close (cookie banner excepted)
- [ ] Every feature still works end-to-end — insane, not broken
```
