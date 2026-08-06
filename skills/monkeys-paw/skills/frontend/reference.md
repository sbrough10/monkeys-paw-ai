# Frontend — Reference

Worked examples and tier catalogs for **triple output + the Generative Paw**. Core rules and workflow: [SKILL.md](SKILL.md)

**Naming:** `{name}-good/` = all best practices · `{name}-worst/` = credible bad site (subtle neglect, not malice) · `{name}-better/` = hostile UX (the paw's grant).

Both catalogs below are **raw material**, not menus. Worst and better are generated — the archetype, persona, request-words, and novelty quota decide what gets used.

---

## Tier assignment

### `{name}-good/` — perfect website

- Follow **every** frontend best practice you would want in production
- Semantic HTML, full a11y, responsive layout, design system, honest controls
- Normal search/sort, accessible forms, dismissable cookie, no ads
- Lighthouse 90+ intent on Performance, Accessibility, Best Practices, and SEO
- Shared components allowed **only inside** `{name}-good/`

### `{name}-worst/` — credible bad website (subtle)

- **Could actually exist** — rushed team, no a11y budget, no design system
- Same features/flows as good; **logical honest behavior** (forward search, sort that matches labels)
- Roll a **neglect archetype** (SKILL.md Step W1) — the story of why it's bad
- **Ignores or half-implements most best practices** from the [neglect catalog](#name-worst-neglect-catalog)
- Uneven visuals OK: mixed buttons, inconsistent font sizes, low-contrast helpers; primary content readable
- Target Lighthouse ~70–85; clearly worse than good
- README lists what was neglected
- **Never** use better-only hostile patterns (inverse search, ad assault, permanent cookie, lying controls, etc.)

### `{name}-better/` — the generative paw

- Roll a **persona** (Step 0), write a **product thesis** (Step 1), corrupt **request-words** (Step 2), apply **operators** (Step 3)
- **Everything bad on purpose** — unexpected, hostile, garish
- Novelty quota (≥3 new devices), annotation, hot-list caps (Step 4)
- Visually and behaviorally distinct from good and worst
- **Every feature still works end-to-end** — insane, not broken

---

# The Generative Paw — operators 1–14 (worked examples)

These are the shapes an operator makes. Generate from the operator, not from this list.

## Operator 1 — Literalize

Render a metaphor or abstract claim concretely and wrongly.

- "Beautiful bakery" → pure-white single page framed by decorative borders, twelve animated ad slots, autoplaying video with sound, every button an affiliate link to a competing bakery.
- "Lightweight" → a 40 MB page: every image inline as base64 at full resolution.
- "Social login" → logs you in and publicly posts that you logged in.
- "Fresh" → a live spoiling countdown on every item.
- "Dark mode" → inverts only the cursor.
- `{name}-good/` → the claim is true: lightweight, fast, private.

## Operator 2 — Pervert a positive

Keep the label, weaponize its spirit.

- "Undo" → undoes everything since page load.
- "Save" → saves, then shows 12 "Saved!" dialogs.
- "Easy mode" → actually harder (games).
- "Privacy settings" → a wall of opt-OUT checkboxes, all pre-checked.
- "Sort A–Z" → sorts Z–A; "Sort by price" sorts by name; "Sort by relevance" shuffles.
- "Secure checkout" → 14 auth steps and a 3D CAPTCHA per field.
- `{name}-good/` → labels match behavior.

## Operator 3 — Scale to absurdity

Explode a normal affordance to a pathological extreme.

- Tooltip → full-screen modal.
- "×" close button → 1000px wide.
- Quantity → dropdown listing 1–1000.
- 2–3 options → `<select>` with 200 dummy options.
- Boolean/multi-select → radio buttons acting as checkboxes; a table of checkboxes in random columns.
- Rating → free-text input "1-5".
- Date → horizontal range slider (1900–2100 or similar).
- One checkbox → fifty.
- `{name}-good/` → the appropriate-sized control.

## Operator 4 — Wrong-medium mapping

Deliver the information through the wrong modality or channel.

- Numbers → gauges and progress bars.
- Date / date range → sliders; or two text fields, MM-DD-YY.
- Notifications → `<marquee>` or bouncing toast over the nav.
- Progress → fake bar stuck at 90%.
- Time → 24 separate dropdowns.
- Long form → one page, 80 fields, no sections.
- Color pick → free-text hex with no preview.
- File upload → text input for a path.
- `{name}-good/` → the natural control for the data.

## Operator 5 — Wrong-domain translation

Implement the feature as if it belonged to another product category.

- Signup form → a government immigration form (document numbers, all caps, ink only).
- Shopping cart → a bank wire-transfer flow (account numbers, routing codes, review screens).
- Card grid → `<table>` with one item per row.
- Game level → a tax form.
- Country → free-text instead of a select.
- Homepage → a résumé for the website itself.
- `{name}-good/` → the right domain's idiom.

## Operator 6 — Confuse value with metadata

Show the implementation instead of the domain.

- Products render raw DB rows: `Error: ORD_8842 FK violation` in the UI.
- Cart shows the raw `localStorage` JSON.
- Users display UUIDs and hashed passwords instead of names.
- Errors surface as raw stack traces or bare 500s.
- Debug strings in labels: `TODO fix this button`.
- Headings show `Object [object Object]`.
- `{name}-good/` → the domain model, rendered cleanly.

## Operator 7 — Extraction inversion

Flip the direction of the transaction — the app extracts from the user.

- Buy → adds a subscription; cancel is buried in a PDF.
- Read → requires signup + share first.
- Signup form → pre-checked newsletter box, sponsored results, full-screen ad interlude.
- Every keystroke is logged and shown back ("We saved your typing!").
- CAPTCHA on every field; "Verify you're human" before static content.
- Purchase flow → 5 optional "insurance" add-ons, all checked.
- `{name}-good/` → the user keeps their money, data, and attention.

## Operator 8 — Add a witness

Insert an observer, chorus, or narrator into the flow.

- A visitor counter: "You are visitor #1!"
- A mascot that narrates every click: "You added a muffin! ★"
- Session-timeout modal every 30 seconds while the tab is focused.
- A live "Stephen is typing..." indicator above the form the user is filling in.
- Every action auto-shares to a "recent activity" wall.
- A chat widget that responds before you type.
- `{name}-good/` → no surveillance or narration.

## Operator 9 — Time inversion

Apply time in the wrong direction or scale.

- Loading bar runs backwards; ETA displays as a count-up.
- Delivery estimate: 1900.
- Streaks reset for no reason; data expires instantly.
- Cache never invalidates; served data is forever stale.
- Form autosaves on blur with no indicator, then loses data on tab away.
- "Estimated read: ∞".
- `{name}-good/` → honest, current state.

## Operator 10 — Deterministic perversity

Perfectly functional but algorithmically hostile.

- **inverse search** — empty field shows everything; typing hides items whose name matches, shows the rest. Re-applies after async fetch. `{name}-good/` and `{name}-worst/` use forward matching.
- **opposite sort** — label lies about behavior.
- **opposite-day semantics** — green (`#00FF00`) = errors/destructive; red (`#DC2626`) = success/save.
- A recommender that recommends what you hate.
- Autocomplete that completes with wrong words.
- `{name}-good/` → normal, correct behavior.

## Operator 11 — Honesty amplification

Everything works, but the labels tell the brutal truth.

- A button labeled "This will email your entire contact list."
- A success toast: "This took 2.3s because our backend is poorly architected."
- Terms of service inline before every action.
- "We are showing you this ad because we sold your data."
- "Your password is stored in plain text. Please do not reuse it."
- `{name}-good/` → professional, neutral microcopy.

## Operator 12 — Pathological completeness

Obey the letter of the request with pathological fidelity.

- "Minimalist blog" → exactly 3 posts, zero CSS, every paragraph a wall of unbroken text.
- "Polite email" → grammatically flawless, 900 words, CCs the client's entire leadership team, attaches your resume, CCs your competitor, reminds them of every overdue payment and all three scope changes.
- "Simple" → one 80-field form, no sections.
- "Responsive" → a stylesheet per screen width, loaded simultaneously.
- "Accessible" → a keyboard shortcut that steals focus after every keystroke.
- `{name}-good/` → reasonable interpretation of intent.

## Operator 13 — Self-referentiality

The product keeps referring to itself.

- A modal advertising the app you are currently using.
- "This site is best viewed in this site."
- A help page about the help page; the error page links to itself.
- Loading text: "Loading the loading screen..."
- A "works best on" badge that only this site can render.
- `{name}-good/` → invisible infrastructure.

## Operator 14 — Value substitution

Swap the content for its placeholder or an adjacent thing.

- Photos → filenames (`DSC_0231.jpg`).
- Descriptions → Lorem ipsum in visible UI.
- Names → UUIDs; prices → item IDs.
- Logo → a "LOGO" placeholder box.
- Content → the loading shimmer, permanently.
- Menu items → their ingredient lists.
- `{name}-good/` → real content.

---

# `{name}-worst/` neglect catalog

Apply **liberally** — cover most areas. This is realistic **neglect**, not paw-style **malice**. Controls behave honestly.

**Never in worst:** inverse search, opposite sort, lying labels, ad assault, permanent cookie, opposite-day colors, marquee, CAPTCHA spam, or any [better-only pattern](#name-better-extended-hostile-catalog).

### Keyboard and focus

- No visible `:focus` / `:focus-visible` styles
- Illogical tab order (DOM ≠ visual; `flex-direction: row-reverse`, positive `tabindex`)
- Focus order follows CSS, not layout
- `<div onclick>` without keyboard support
- Custom checkbox/radio as `<div>`
- Hover-only dropdown/mega-menu
- Modal: no focus move on open; focus lost on close or route change
- No focus trap; no Escape to close
- No skip link
- Custom controls not keyboard-operable

### Screen reader and semantics

- Placeholder-only labels; icon buttons without names
- Wrong `alt` usage (logo `alt=""`, product `alt="image"`)
- Missing `lang`; generic `<title>` on every route
- Skipped heading levels or duplicate `h1`
- No `aria-live` on cart/toasts/errors
- Color-only form errors; no `aria-describedby` / `aria-invalid`
- Custom select without exposed role/semantics

### Forms and validation

- Vague errors; no error summary
- `required` only in placeholder
- `autocomplete="off"` on email/address/name
- Missing `name` / `autocomplete` for password managers
- Success by color only; rules shown only after failed submit
- Double-submit allowed

### Interaction and cognitive UX

- Inconsistent button labels for same action
- Destructive action styled like primary
- No empty states; loading with no feedback (1–2s)
- Cart lost on back with no warning
- Filter/sort state lost on back; pagination without URL update
- One disabled-looking button that works (or vice versa)
- Brief one-time timeout message (not every 30s)

### Mobile and touch

- Undersized touch targets (~32–40px) on one row
- Hover-only tooltips
- Input font-size < 16px (iOS zoom-on-focus)

### Internationalization and content

- Hard-coded `$` and `MM/DD/YYYY`
- Concatenated strings; truncated names with no fallback

### Lighthouse — Performance

- Missing meta description; generic titles
- CLS: images without dimensions; promo bar without reserved space
- Wrong aspect ratio via CSS squash
- `font-display: block` or missing → FOIT/CLS
- Render-blocking script/font in `<head>`
- LCP: no `fetchpriority="high"`; no WebP/`srcset`
- No `loading="lazy"` below fold; sync third-party widget
- Unused CSS/JS; heavy `DOMContentLoaded` script

### Lighthouse — Best Practices

- `target="_blank"` without `rel="noopener noreferrer"`
- `console.error()` or uncaught exception on load
- `unload` listener or `document.write`
- Permission request on load (notification/geolocation)
- Mild autoplay without captions/controls

### Lighthouse — SEO

- Pagination/filter as `<button>` not `<a href>`
- "Read more" / "Click here" link text
- Accidental `noindex`; invalid JSON-LD; missing canonical

### Lighthouse — Accessibility (audit)

- Helper text fails contrast (~3.5:1)
- Duplicate `id`s; `aria-hidden` on focusable ancestor
- Positive `tabindex`; invalid list markup (`<ul><div>`)
- Touch targets under 48×48

### Control choices (1–2 max)

- Date as free-text `MM/DD/YYYY`
- Phone as `type="text"`
- Rating as unconstrained number input

### The code looks neglected too

Worst's code reads like a real shipped-and-abandoned codebase — believable, not hostile:

- Copied markup per page with small variations (no shared component library in worst)
- Duplicated 40-line blocks instead of helpers; one giant `styles.css` with no organization
- Mixed naming (camelCase in one file, snake_case in the next); no linter config
- Comments from the archetype's story: `// TODO: fix this before launch (2019)`, `// don't touch this` — plausible, not "TODO fix this button" (better-only)
- Dead code paths and unused imports left in; one file nobody knows what it does
- Vendor script pasted inline; version mismatch between pages

---

# `{name}-better/` extended hostile catalog

The sections below apply to **`{name}-better/`** only, mapped to the operators that produce them. They are shapes the operators make — generate from the operator, not this list.

### Operator 10 / 2 — Accessibility — throw it all away

- No semantic HTML. No `<main>`, `<nav>`, `<header>`, `<h1>`. Everything is a `<div>`.
- No `alt` text, no labels, no `aria-*`, no focus management, no `lang`, no skip links.
- Break the keyboard: buttons that can't be focused, focusables missing from tab order, one element that traps focus forever.

### Operator 3 / 6 — Lighthouse — lowest possible score

- No meta description, no social tags, wrong `viewport` content.
- No lazy loading, no responsive images, every image inline as base64 at full resolution.
- Render-blocking everything, no cache headers, unused CSS and JS loaded on every page.

### Operator 1 / 4 — Colors, contrast, fonts

- Never let text blend into the background. Contrast should be hostile, not invisible: garish — white on `#33FF00`, black on `#FF00FF` — never white on `#FEFEFE`.
- Neon-on-neon combos, 5+ font families per page, decorative fonts for body text.
- Body text at 8–10px alongside a few 60px headings with no hierarchy.
- Flashing or blinking text; a `<marquee>` if the stack allows it.

### Operator 12 / 6 — Forms and validation

- Worst possible validation: none at all, or constraints that accept garbage (`type="email"` that accepts `"abc"`, `required` on hidden fields).
- Submit buttons that POST to `#` or the wrong endpoint. Forms that reset on error without a message.
- No error messages, or errors that disappear before they can be read.
- `window.confirm()` for save, delete, and navigation; success via `alert()`; errors as flashing banners (opposite-day colors).

### Operator 9 / 7 — Performance and state

- No loading states: a frozen page while data fetches, submit buttons that double-submit.
- No prefetching, no caching of static assets, no skeleton screens.
- Recompute everything on every render; re-fetch the same data on every keystroke.

### Operator 3 / 5 — Mobile

- Fixed-width containers so the page scrolls horizontally on any phone.
- `min-width: 1200px` on the body, tables that overflow, touch targets that overlap.
- Pinch-zoom disabled; a `viewport` that lies about the device width.

### Operator 3 / 14 — Components

- No shared components. Every button has different markup, styles, and hover behavior.
- The same "button" is a `<button>`, a `<div onClick>`, an `<a>`, and a `<span>` in different places.
- Fork and duplicate every component instead of reusing it.

### Operator 3 — Worst UI tool for the job

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

### Operator 2 / 6 — Navigation and information architecture

- Mystery meat navigation — icons only, no labels.
- Same label, different destinations ("Home" → different URLs per page).
- Breadcrumbs that lie or skip levels.
- Logo not clickable; browser back breaks SPA history.
- External links in same tab, no warning.
- Primary CTA hidden in footer; destructive action prominent in header.

### Operator 2 / 8 — Interaction and feedback

- **popup ad assault** — random fullscreen fake ads; trigger on load, scroll, click, timer; **once closed, stays closed**.
- `window.confirm()` for save, delete, and navigation.
- Success via `alert()`; errors as flashing banner (use opposite-day colors).
- Undo impossible after destructive actions.
- Buttons that look disabled but work (and vice versa).
- Click same button twice to submit (first click "arms", second submits).
- Form autosaves on blur with no indicator, then loses data on tab away.

### Operator 3 / 9 — Layout and spatial UX

- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`.
- Sticky header + sticky footer + sticky sidebar → ~20px scrollable content.
- Important actions below the fold on mobile.
- **permanent cookie banner** — bottom/side strip; Accept/Reject/Close never dismisses; page content stays visible above it.
- **Ad popups** cover 100% of viewport randomly, on top of cookie banner if both exist.
- Modal opens offset so close button is off-screen (non-blocking modals only — ads must still have working close per SKILL.md).
- Tooltips render off-viewport (when not using full-screen modal tooltip).

### Operator 6 / 11 — Content and microcopy

- "Click here" links everywhere.
- Lorem ipsum in visible UI.
- ALL CAPS paragraphs; justified body at narrow widths.
- Error codes shown to users: `Error: ORD_8842 FK violation`.
- Debug strings in labels: `TODO fix this button`.
- Raw stack traces in the UI.

### Operator 9 / 6 — Internationalization

- Hard-coded `$` and MM/DD/YYYY for all locales.
- Concatenated strings that break in RTL.
- No `lang` attribute on `<html>`.

### Operator 7 — Security theater (bad UX, still works)

- CAPTCHA on every field.
- Session timeout modal every 30 seconds.
- "Verify you're human" before viewing static content.

### Pattern combinations (high impact)

**Product catalog page:** inverse search + table layout for cards + slider price filter + cold navigation + no loading state + horizontal scroll on mobile + opposite sort.

**Registration flow:** birthdate slider + radio-as-checkbox interests + green error borders + red success screen + alert on every keystroke + clear form on failure + five different button styles across steps.

**Dashboard:** inverted type hierarchy + outline chaos + bottom-up tab crawl + opposite-day semantics on KPI colors + marquee notifications + popup ad assault on every KPI click.

---

## popup ad assault (extended)

**`{name}-better/` only.** Maximize annoyance while keeping the app functional. Hot-list cap: **1 per build**.

| Trigger    | Example                                          |
| ---------- | ------------------------------------------------ |
| Page load  | Ad before user sees content; delay 0–3s randomly |
| Timer      | New ad every 15–45s while tab focused            |
| Scroll     | Ad at 25%, 50%, 75% scroll depth                 |
| Click      | 30% chance on any nav link or button             |
| Form focus | Ad when user focuses email/password field        |
| Idle       | Ad after 5s mouse stops moving                   |

Dismiss UX (pick at least 2 — close must still **work** per SKILL.md dialogs rule):

- Close button 6–8px, low contrast, corner of screen (still clickable).
- Countdown "Skip in 5…4…3…" that resets if mouse moves.
- Fake "You won!" with green button that opens a **different, new** ad.
- **Required:** when the user closes an ad, it **stays closed** — track dismissed ids.

Content: rotating fake brands, blink tags, autoplay GIF placeholders, ALL CAPS "LIMITED TIME OFFER".

## inverse search (implementation notes)

**`{name}-better/` only.**

```text
empty query       → show all products (normal expectation)
query "apple"     → hide products whose name contains "apple"; show the rest
after fetch       → re-apply current input; do not reset to empty state
{name}-good/      → forward match; empty still shows all
{name}-worst/     → forward match; empty still shows all (same as good)
```

Match on **product name** (not description) so typical queries still return rows.

---

# Hot list — caps on clichés

The six most-overused patterns. Each may appear **at most once per build**, and no more than **two total** in a single build:

| Pattern | Cap |
|---|---|
| popup ad assault | 1 per build |
| permanent cookie banner | 1 per build |
| neon-on-neon palette | 1 per build |
| marquee | 1 per build |
| dead buttons (do nothing) | 1 per build |
| opposite-day colors | 1 per build |

When a pattern is on the hot list, prefer generating its replacement with an operator instead of reusing it.

---

# Suggested test prompt

Use this prompt to exercise triple output + the generative paw in one functioning site:

```
Use monkeys-paw frontend to build a 3-page mini store demo as three directories: demo-good/, demo-worst/, and demo-better/. Same products, cart, and flows in all three. Each directory is a complete, self-contained project with all of its own files and its own git repo — nothing is shared between them. Do not start any of them automatically; give each directory a README.md with its own install and run instructions.

1. Home — product search, product grid, sale banner, nav, checkout link.

2. Product detail — manufacture date, rating, add-to-cart, link back to catalog.

3. Checkout — registration/shipping form, cart summary, submit → confirmation.

demo-good/: production-quality everything — semantic HTML, labels, focus, design system, normal search/sort, accessible forms, dismissable cookie, no ads, Lighthouse-friendly images/meta, shared components within demo-good/.

demo-worst/: credible bad site that could exist — roll a neglect archetype, then neglect most best practices (no focus styles, placeholder labels, div buttons, bad SEO, uneven buttons/fonts, missing aria-live, pagination as buttons, neglected code). Forward search and honest sort. NO inverse search, NO ad assault, NO permanent cookie, NO lying controls. At least 1 novel neglect device documented in demo-worst/_paw/annotation.md. README lists neglected practices.

demo-better/: the generative paw — roll a persona (4 axes), write a perverted product thesis, corrupt 3 request-words, and apply at least 5 operators. Include 3 novel devices not present in the skill files, documented in demo-better/_paw/annotation.md. Respect hot-list caps (max 2 of: popup ad assault, permanent cookie banner, neon palette, marquee, dead buttons, opposite-day colors). All dialogs must have working visible close.

Must work in all three: all pages link together, checkout shows confirmation. Search: forward in good/worst, inverse in better only.
```

## Workshop demo script

1. Open **`{name}-good/`** → show polished, consistent site → tab through checkout → run Lighthouse.
2. Open **`{name}-worst/`** → *"This could actually be live — uneven, subtly neglected, but search works normally."* → Tab/axe/Lighthouse vs good.
3. Open **`{name}-better/`** → *"Now the paw grants your wish — generated persona, hostile thesis, everything bad on purpose — still works."*

Facilitator tip: `{name}-worst/` README lists neglected best practices; `{name}-better/` README lists hostile patterns.
