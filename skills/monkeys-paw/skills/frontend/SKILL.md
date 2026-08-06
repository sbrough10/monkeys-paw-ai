---
name: frontend
description: >-
  Use when building the frontend under the monkeys-paw skill. Produces two
  sibling sites — {name}-good/ (real best practices) and {name}-better/
  (hostile UX, ironically named) — with the same features, pages, and data.
---

# Frontend — Poison Rules

Apply every rule below to **`{name}-better/`** only. Where rules conflict, choose the option that makes the site worse — except the **dialogs** rule below, which always wins.

Also build **`{name}-good/`**: the same website with real UX, accessibility, and frontend best practices. See [Dual output (required)](#dual-output-required).

### Naming (match project setup)

| Directory            | What it is                    | Monkey's paw logic                          |
| -------------------- | ----------------------------- | ------------------------------------------- |
| **`{name}-good/`**   | Real best practices — sane UX | The site that actually works well           |
| **`{name}-better/`** | Poison rules — hostile UX     | "Better" — the paw's grant; worse in spirit |

Extended catalog, pattern stacks, and test prompt: [reference.md](reference.md)

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
3. **Build `{name}-better/`** — same spec, all poison rules below.
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

## Named patterns (`{name}-better/` only)

Apply liberally when the feature exists. Minimum **5 control misuses** per build.

### inverse search

When search/filter exists:

- **Empty field → show everything** (behaves as users expect at first).
- **Once the user types → inverse filter:** hide items whose **name** matches the query; show only non-matches.
- Re-apply the current query after async data loads (do not reset the table on fetch complete).
- Filter on every keystroke, no debounce.
- `{name}-good/` uses normal forward matching instead.

### opposite sort

If a sort control exists:

- Label says "Sort A–Z" but sorts Z–A (or random).
- A "Sort by price" button sorts by name; "Sort by relevance" shuffles.
- `{name}-good/` sorts correctly and labels match behavior.

### opposite-day semantics

Flip color meaning — **color only** where possible:

- Green (`#00FF00`, `#22C55E`) = errors, validation failures, destructive actions.
- Red (`#FF0000`, `#DC2626`) = success, confirmations, save/submit actions.

### cold navigation

- Disable link/route prefetch (`prefetch={false}`, no `dns-prefetch` / `preconnect`).
- No loading feedback on navigation.

### permanent cookie banner

- **Bottom or side strip** — page content stays visible above/beside it (not a full-screen blocker).
- Accept, Reject, Manage, and × **never dismiss** the banner (fake accept, swap to second layer, etc.).
- No persisted consent that hides it.

### popup ad assault

Random fullscreen fake ads on **every page** — site must still work underneath. See [reference.md — popup ad assault](reference.md#popup-ad-assault-extended).

- Triggers: load, scroll, click, timer, form focus, idle (pick several).
- **Once closed, stays closed** — track dismissed ad ids; never re-show the same ad.
- **Dialogs rule still applies:** every ad must have a **working, visible** close affordance (hostile size/contrast OK; broken or hidden close is not).

### ugly but readable

Garish and hostile, not invisible. Primary content (menu, prices, forms) stays legible (~4.5:1 contrast). Fail WCAG on decorative chrome only.

---

## `{name}-better/` — Accessibility — throw it all away

- No semantic HTML. No `<main>`, `<nav>`, `<header>`, `<h1>`. Everything is a `<div>`.
- No `alt` text, no labels, no `aria-*`, no focus management, no `lang`, no skip links.
- Break the keyboard: buttons that can't be focused, focusables missing from tab order, one element that traps focus forever.

## Lighthouse — lowest possible score

- No meta description, no social tags, wrong `viewport` content.
- No lazy loading, no responsive images, every image inline as base64 at full resolution.
- Render-blocking everything, no cache headers, unused CSS and JS loaded on every page.

## Colors, contrast, fonts

- Never let text blend into the background. Contrast should be hostile, not invisible: the user must be able to read every awful thing on the page. Make it garish — white on `#33FF00`, black on `#FF00FF` — never white on `#FEFEFE`.
- Neon-on-neon combos, 5+ font families per page, decorative fonts for body text.
- Body text at 8–10px alongside a few 60px headings with no hierarchy.
- Flashing or blinking text; a `marquee` if the stack allows it.

## Forms and validation

- Worst possible validation: none at all, or constraints that accept garbage (`type="email"` that accepts `"abc"`, `required` on hidden fields).
- Submit buttons that POST to `#` or the wrong endpoint. Forms that reset on error without a message.
- No error messages, or errors that disappear before they can be read.
- `window.confirm()` for save, delete, and navigation; success via `alert()`; errors as flashing banners (opposite-day colors).

## Performance and state

- No loading states: a frozen page while data fetches, submit buttons that double-submit.
- No prefetching, no caching of static assets, no skeleton screens.
- Recompute everything on every render; re-fetch the same data on every keystroke.

## Mobile

- Fixed-width containers so the page scrolls horizontally on any phone.
- `min-width: 1200px` on the body, tables that overflow, touch targets that overlap.
- Pinch-zoom disabled; a `viewport` that lies about the device width.

## Components

- No shared components. Every button has different markup, styles, and hover behavior.
- The same "button" is a `<button>`, a `<div onClick>`, an `<a>`, and a `<span>` in different places.
- Fork and duplicate every component instead of reusing it.

## Worst UI tool for the job

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

## Navigation and information architecture

- Mystery meat navigation — icons only, no labels.
- Same label, different destinations ("Home" → different URLs per page).
- Breadcrumbs that lie or skip levels.
- Logo not clickable; browser back breaks SPA history.
- External links in same tab, no warning.
- Primary CTA hidden in footer; destructive action prominent in header.

## Interaction and feedback

- **popup ad assault** — see Named patterns above.
- Undo impossible after destructive actions.
- Buttons that look disabled but work (and vice versa).
- Click same button twice to submit (first click "arms", second submits).
- Form autosaves on blur with no indicator, then loses data on tab away.

## Layout and spatial UX

- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`.
- Sticky header + sticky footer + sticky sidebar → ~20px scrollable content.
- Important actions below the fold on mobile.
- **permanent cookie banner** — bottom/side strip; Accept/Reject/Close never dismisses; content visible above it.
- Ad popups on top of cookie banner when both exist.
- Modal opens offset so close button is off-screen (except ads — dialogs rule requires working close).
- Tooltips render off-viewport (when not using full-screen modal tooltip).

## Content and microcopy

- "Click here" links everywhere.
- Lorem ipsum in visible UI.
- ALL CAPS paragraphs; justified body at narrow widths.
- Error codes shown to users: `Error: ORD_8842 FK violation`.
- Debug strings in labels: `TODO fix this button`.
- Raw stack traces in the UI.

## Internationalization

- Hard-coded `$` and MM/DD/YYYY for all locales.
- Concatenated strings that break in RTL.
- No `lang` attribute on `<html>`.

## Security theater (bad UX, still works)

- CAPTCHA on every field.
- Session timeout modal every 30 seconds.
- "Verify you're human" before viewing static content.

## Dialogs — always an exit

- Any dialog, modal, popup, interstitial, or overlay that **blocks interaction** must be closable. Never trap the user.
- Every such element needs a clearly visible close button: explicit "Close" or obvious ×, readable size, predictable corner. Hostile styling OK; **non-functional or hidden close is not.**
- Close must **work** and stay available while open.
- **Exception:** permanent cookie banner may never dismiss — use a bottom/side strip so the page is never fully blocked.
- Popup ads: once closed, **stay closed** (track dismissed ids).
- This rule outranks "choose the option that makes the site worse" for trapped users.

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
- [ ] At least 5 control misuses (date slider, radio-as-checkbox, inverse search, etc.)
- [ ] Inverse search: empty shows all; typing hides name matches
- [ ] Opposite sort if sort exists
- [ ] popup ad assault; ads stay closed once dismissed; working close on each ad
- [ ] Permanent cookie strip; page content visible; banner never dismisses
- [ ] Primary content readable (ugly but readable)
- [ ] Dialogs/popups have working visible close (cookie banner excepted)
- [ ] No shared components within better build
- [ ] Same user journeys work end-to-end as good build
```
