# Frontend — Reference

Extended anti-pattern catalog for `{name}-better/`. Core rules and dual output: [SKILL.md](SKILL.md)

**Naming:** `{name}-good/` = real best practices · `{name}-better/` = hostile UX (the paw's grant).

## Control misuse (full table)

| Need          | Use instead in `{name}-better/`                   | `{name}-good/` counterpart            |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| Date          | Range slider 1900–2100                            | `<input type="date">` or date picker  |
| Date range    | Two text fields, MM-DD-YY                         | Date range picker                     |
| Boolean       | Radio buttons acting as checkboxes (multi-select) | Checkboxes                            |
| Multi-select  | Single dropdown, no multi                         | `<select multiple>` or checkbox group |
| 2–3 options   | `<select>` with 200 dummy options                 | Short radio group or select           |
| Card grid     | `<table>` with one item per row                   | Responsive card grid                  |
| Image gallery | Nested iframes                                    | `<figure>` / gallery component        |
| Tooltip       | Full-screen modal                                 | Native tooltip or accessible popover  |
| Short text    | `contenteditable` div                             | `<input>` / `<textarea>`              |
| Long form     | One page, 80 fields, no sections                  | Stepped form or sections              |
| Search        | Inverse filter when typing; empty shows all       | Normal substring match                |
| Sort          | Opposite / mislabeled sort button                 | Correct sort + honest label           |
| Filters       | Only after full page reload                       | Instant client filter                 |
| Pagination    | Infinite scroll, no back-to-top, URL stale        | Pagination with stable URLs           |
| Notifications | `<marquee>` or bouncing toast over nav            | Accessible toast region               |
| File upload   | Text input for path (fake)                        | `<input type="file">`                 |
| Color pick    | Free-text hex, no preview                         | Color input with preview              |
| Rating        | Text input "1-5"                                  | Stars or `<input type="number">`      |
| Progress      | Fake bar stuck at 90%                             | Real progress indicator               |
| Time          | 24 separate dropdowns                             | Single time or datetime input         |
| Country       | Free-text instead of select                       | Country select                        |
| Toggle        | Checkbox that needs double-click                  | Standard checkbox / switch            |

## Navigation and information architecture

- Mystery meat navigation — icons only, no labels.
- Same label, different destinations ("Home" → different URLs per page).
- Breadcrumbs that lie or skip levels.
- Logo not clickable; browser back breaks SPA history.
- External links in same tab, no warning.
- Primary CTA hidden in footer; destructive action prominent in header.

## Interaction and feedback

- **popup ad assault** — random fullscreen fake ads; trigger on load, scroll, click, timer; **once closed, stays closed**.
- `window.confirm()` for save, delete, and navigation.
- Success via `alert()`; errors as flashing banner (use opposite-day colors).
- Undo impossible after destructive actions.
- Buttons that look disabled but work (and vice versa).
- Click same button twice to submit (first click "arms", second submits).
- Form autosaves on blur with no indicator, then loses data on tab away.

## Layout and spatial UX

- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`.
- Sticky header + sticky footer + sticky sidebar → ~20px scrollable content.
- Important actions below the fold on mobile.
- **permanent cookie banner** — bottom/side strip; Accept/Reject/Close never dismisses; page content stays visible above it.
- **Ad popups** cover 100% of viewport randomly, on top of cookie banner if both exist.
- Modal opens offset so close button is off-screen (non-blocking modals only — ads must still have working close per SKILL.md).
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

## Pattern combinations (high impact)

These stacks hit multiple checklist items at once:

**Product catalog page:** inverse search + table layout for cards + slider price filter + cold navigation + no loading state + horizontal scroll on mobile + opposite sort.

**Registration flow:** birthdate slider + radio-as-checkbox interests + green error borders + red success screen + alert on every keystroke + clear form on failure + five different button styles across steps.

**Dashboard:** inverted type hierarchy + outline chaos + bottom-up tab crawl + opposite-day semantics on KPI colors (green = down, red = up) + marquee notifications + popup ad assault on every KPI click.

## popup ad assault (extended)

Maximize annoyance while keeping the app functional:

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
- Fake “You won!” with green button that opens a **different, new** ad (never the one just closed).
- **Required:** when the user closes an ad, it **stays closed** — track dismissed ids; do not re-show on dismiss or the next scroll/click.

Content: rotating fake brands, blink tags, autoplay GIF placeholders, ALL CAPS “LIMITED TIME OFFER”.

## inverse search (implementation notes)

```text
empty query       → show all products (normal expectation)
query "apple"     → hide products whose name contains "apple"; show the rest
after fetch       → re-apply current input; do not reset to empty state
{name}-good/     → forward match; empty still shows all
```

Match on **product name** (not description) so typical queries still return rows.

## Suggested test prompt

Use this prompt to exercise most patterns in one functioning **dual** site:

```
Use monkeys-paw frontend to build a 3-page mini store demo as two directories: demo-good/ and demo-better/. Same products, cart, and flows in both. Serve via npm run dev at /good/ and /better/.

1. Home — product search, product grid, sale banner, nav, checkout link.

2. Product detail — manufacture date, rating, add-to-cart, link back to catalog.

3. Checkout — registration/shipping form, cart summary, submit → confirmation.

demo-better/ only: inverse search (empty = all; typing hides matches), opposite sort button, table grid, marquee banner, mystery-meat icon nav, cold navigation, horizontal scroll on mobile, placeholder-only labels, permanent cookie banner (never closes), popup ad assault (stay closed once dismissed), opposite-day colors, hostile validation, date as 1900–2100 slider, radio-as-checkbox shipping, tooltip as full-screen modal, rating as text "1-5".

demo-good/ only: normal search and sort, responsive card grid, labeled nav, semantic HTML, proper labels, date picker, accessible rating, inline validation, dismissable cookie banner, no ads, standard success/error colors, shared components within demo-good/.

Must work in both: search filters products (inversely in better, normally in good), all 3 pages link together, checkout submit shows confirmation.
```
