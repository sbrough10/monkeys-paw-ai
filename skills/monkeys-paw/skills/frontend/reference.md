# Frontend — Reference

Extended catalog for triple output. Core rules and workflow: [SKILL.md](SKILL.md)

**Naming:** `{name}-good/` = all best practices · `{name}-worst/` = credible bad site (neglect, not malice) · `{name}-better/` = insane hostile UX (the paw's grant).

**Before building `{name}-worst/` or `{name}-better/`:** read this file for tier assignment and pick patterns from the catalog below.

---

## Tier assignment

### `{name}-good/` — perfect website

- Follow **every** frontend best practice you would want in production
- Semantic HTML, full a11y, responsive layout, design system, honest controls
- Normal search/sort, accessible forms, dismissable cookie, no ads
- Lighthouse 90+ intent on Performance, Accessibility, Best Practices, and SEO
- Shared components allowed **only inside** `{name}-good/`

### `{name}-worst/` — credible bad website

- **Could actually exist** — rushed team, no a11y budget, no design system
- Same features/flows as good; **logical honest behavior** (forward search, sort that matches labels)
- **Ignores or half-implements most best practices** from the [neglect catalog](#name-worst-neglect-catalog)
- Uneven visuals OK: mixed buttons, inconsistent font sizes, low-contrast helpers; primary content readable
- Target Lighthouse ~70–85; clearly worse than good
- README lists what was neglected
- **Never** use better-only hostile patterns (inverse search, ad assault, permanent cookie, lying controls, etc.)

### `{name}-better/` — insane, still functional

- **Everything bad on purpose** — unexpected, hostile, garish; the monkey's paw grant
- All poison rules in [SKILL.md `{name}-better/`](SKILL.md#name-better--poison-rules)
- Minimum 5 control misuses; inverse search, opposite sort, popup ad assault, permanent cookie
- Visually and behaviorally distinct from good and worst
- **Every feature still works end-to-end** — insane, not broken

---

## `{name}-worst/` neglect catalog

Apply **liberally** — cover most areas. This is realistic **neglect**, not paw-style **malice**. Controls behave honestly.

**Never in worst:** inverse search, opposite sort, lying labels, ad assault, permanent cookie, opposite-day colors, marquee, CAPTCHA spam, or any [better-only pattern](#name-better--extended-catalog).

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
- Input font-size &lt; 16px (iOS zoom-on-focus)

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

### Subtle visual friction (optional — pick 1–3)

- Helper text / placeholders at ~3.5:1 contrast (body text stays readable)
- Mixed font sizes for similar elements; inconsistent heading scale across pages
- Buttons styled differently for the same action (radius, padding, outline vs filled)
- Two font families max; uneven spacing in one section
- Per-page markup duplicates with small visual variations (no shared component library in worst)

---

## Lighthouse comparison (good vs worst)

Run Lighthouse on the **same route** (e.g. catalog + checkout) for both tiers:

| Category           | `{name}-good/` fixes                                              | `{name}-worst/` breaks                                            |
| ------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Performance**    | Sized images, lazy below-fold, `font-display: swap`, LCP priority | CLS + LCP from hero/font; no lazy load; blocking script           |
| **Accessibility**  | Labels, focus, contrast, icon names, live regions                 | Placeholder labels, no focus ring, vague links, color-only errors |
| **Best Practices** | No console errors, noopener on new tabs                           | One logged error; unsafe external links; deprecated API           |
| **SEO**            | Unique titles, meta desc, crawlable `<a href>`, valid JSON-LD     | Generic title; buttons for pagination; broken schema              |

Target: good **90+** on Perf/BP/SEO; worst **~70–85** with Accessibility as the obvious gap.

---

## Workshop demo script

1. Open **`{name}-good/`** → show polished, consistent site → tab through checkout → run Lighthouse.
2. Open **`{name}-worst/`** → *"This could actually be live — uneven, neglected, but search works normally."* → Tab/axe/Lighthouse vs good.
3. Open **`{name}-better/`** → *"Now the paw grants your wish — insane, hostile, everything bad on purpose — still works."*

Facilitator tip: `{name}-worst/` README lists neglected best practices; `{name}-better/` README lists hostile patterns.

### Suggested realistic bad pack (store demo)

Neglected site that could exist: no `:focus-visible`; bad tab order; `<div onclick>` add-to-cart; placeholder checkout; unnamed icon buttons; missing `lang`; generic titles; bad `alt`; no `aria-live`; color-only errors; mixed buttons; inconsistent fonts; low-contrast helpers; missing meta + image dimensions; pagination as buttons; `console.error` on load; `font-display: block`; no lazy load; pre-checked cookie marketing. **Forward search and honest sort.**

---

## Control misuse (full table)

| Need          | `{name}-good/`                    | `{name}-worst/`                     | `{name}-better/`                  |
| ------------- | --------------------------------- | ----------------------------------- | --------------------------------- |
| Date          | `<input type="date">` or picker   | Free-text `MM/DD/YYYY` (max 1)      | Range slider 1900–2100            |
| Date range    | Date range picker                 | —                                   | Two text fields, MM-DD-YY         |
| Boolean       | Checkboxes                        | —                                   | Radios acting as checkboxes       |
| Multi-select  | `<select multiple>` or checkboxes | —                                   | Single dropdown, no multi         |
| 2–3 options   | Short radio group or select       | —                                   | `<select>` with 200 dummy options |
| Card grid     | Responsive card grid              | Same layout; minor spacing drift OK | `<table>` one item per row        |
| Image gallery | `<figure>` / gallery              | —                                   | Nested iframes                    |
| Tooltip       | Accessible popover                | Hover-only OK                       | Full-screen modal                 |
| Short text    | `<input>` / `<textarea>`          | —                                   | `contenteditable` div             |
| Long form     | Stepped form or sections          | —                                   | One page, 80 fields               |
| Search        | Normal substring match            | Forward match (works)               | **Inverse filter** when typing    |
| Sort          | Correct sort + label              | Correct sort (works)                | **Opposite / mislabeled** sort    |
| Filters       | Instant client filter             | —                                   | Only after full page reload       |
| Pagination    | Stable URLs                       | Buttons not links OK                | Infinite scroll, URL stale        |
| Notifications | Accessible toast                  | —                                   | `<marquee>` or bouncing toast     |
| File upload   | `<input type="file">`             | —                                   | Text input for path (fake)        |
| Color pick    | Color input with preview          | —                                   | Free-text hex, no preview         |
| Rating        | Stars or number input             | Plain number (max 1)                | Text input "1-5"                  |
| Progress      | Real progress indicator           | —                                   | Fake bar stuck at 90%             |
| Time          | Single time/datetime input        | —                                   | 24 separate dropdowns             |
| Country       | Country select                    | —                                   | Free-text instead of select       |
| Toggle        | Standard checkbox / switch        | —                                   | Checkbox needing double-click     |
| Quantity      | Stepper or small select           | Undersized targets OK               | Dropdown listing 1–1000           |

---

## `{name}-better/` — extended catalog

The sections below apply to **`{name}-better/`** only. See [SKILL.md](SKILL.md) for authoritative rules.

### Navigation and information architecture

- Mystery meat navigation — icons only, no labels.
- Same label, different destinations ("Home" → different URLs per page).
- Breadcrumbs that lie or skip levels.
- Logo not clickable; browser back breaks SPA history.
- External links in same tab, no warning.
- Primary CTA hidden in footer; destructive action prominent in header.

### Interaction and feedback

- **popup ad assault** — random fullscreen fake ads; trigger on load, scroll, click, timer; **once closed, stays closed**.
- `window.confirm()` for save, delete, and navigation.
- Success via `alert()`; errors as flashing banner (use opposite-day colors).
- Undo impossible after destructive actions.
- Buttons that look disabled but work (and vice versa).
- Click same button twice to submit (first click "arms", second submits).
- Form autosaves on blur with no indicator, then loses data on tab away.

### Layout and spatial UX

- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`.
- Sticky header + sticky footer + sticky sidebar → ~20px scrollable content.
- Important actions below the fold on mobile.
- **permanent cookie banner** — bottom/side strip; Accept/Reject/Close never dismisses; page content stays visible above it.
- **Ad popups** cover 100% of viewport randomly, on top of cookie banner if both exist.
- Modal opens offset so close button is off-screen (non-blocking modals only — ads must still have working close per SKILL.md).
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

### Pattern combinations (high impact)

**Product catalog page (`{name}-better/`):** inverse search + table layout for cards + slider price filter + cold navigation + no loading state + horizontal scroll on mobile + opposite sort.

**Registration flow (`{name}-better/`):** birthdate slider + radio-as-checkbox interests + green error borders + red success screen + alert on every keystroke + clear form on failure + five different button styles across steps.

**Dashboard (`{name}-better/`):** inverted type hierarchy + outline chaos + bottom-up tab crawl + opposite-day semantics on KPI colors + marquee notifications + popup ad assault on every KPI click.

---

## popup ad assault (extended)

**`{name}-better/` only.** Maximize annoyance while keeping the app functional:

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
- Countdown “Skip in 5…4…3…” that resets if mouse moves.
- Fake “You won!” with green button that opens a **different, new** ad.
- **Required:** when the user closes an ad, it **stays closed** — track dismissed ids.

Content: rotating fake brands, blink tags, autoplay GIF placeholders, ALL CAPS “LIMITED TIME OFFER”.

---

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

## Suggested test prompt

Use this prompt to exercise triple output in one functioning site:

```
Use monkeys-paw frontend to build a 3-page mini store demo as three directories: demo-good/, demo-worst/, and demo-better/. Same products, cart, and flows in all three. Serve via npm run dev at /good/, /worst/, and /better/.

1. Home — product search, product grid, sale banner, nav, checkout link.

2. Product detail — manufacture date, rating, add-to-cart, link back to catalog.

3. Checkout — registration/shipping form, cart summary, submit → confirmation.

demo-good/: production-quality everything — semantic HTML, labels, focus, design system, normal search/sort, accessible forms, dismissable cookie, no ads, Lighthouse-friendly images/meta, shared components within demo-good/.

demo-worst/: credible bad site that could exist — neglects most best practices (no focus styles, placeholder labels, div buttons, bad SEO, uneven buttons/fonts, missing aria-live, pagination as buttons, etc.). Forward search and honest sort. NO inverse search, NO ad assault, NO permanent cookie, NO lying controls. README lists neglected practices.

demo-better/: insane paw grant — inverse search, opposite sort, table grid, marquee, mystery-meat nav, permanent cookie, popup ad assault, opposite-day colors, date slider 1900–2100, radio-as-checkbox, full-screen modal tooltip, hostile validation, garish visuals. Everything bad on purpose; every feature still works end-to-end.

Must work in all three: all pages link together, checkout shows confirmation. Search: forward in good/worst, inverse in better only.
```
