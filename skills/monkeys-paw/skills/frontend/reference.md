# Frontend — Reference

Worked examples for the **Generative Paw**. Core process and dual output: [SKILL.md](SKILL.md)

The inherited anti-pattern catalog is regrouped here **by the operator that produces it**. Nothing below is a required recipe — these are the shapes an operator makes. Generate from the operator, not from this list. **Naming:** `{name}-good/` = real best practices · `{name}-better/` = hostile UX (the paw's grant).

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

- **inverse search** — empty field shows everything; typing hides items whose name matches, shows the rest. Re-applies after async fetch. `{name}-good/` uses forward matching.
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

## Pattern combinations (high impact)

Operators stack. These hit multiple checklist items at once:

- **Product catalog page:** operator 10 (inverse search) + operator 5 (table for cards) + operator 3 (slider price filter) + operator 9 (stale data on navigation) + operator 2 (opposite sort).
- **Registration flow:** operator 3 (birthdate slider) + operator 2 (radio-as-checkbox interests) + operator 6 (green error borders, red success screen) + operator 8 (alert on every keystroke) + operator 12 (clear form on failure) + five different button styles across steps.
- **Dashboard:** operator 4 (inverted type hierarchy) + operator 9 (bottom-up tab crawl) + operator 10 (green = down, red = up) + operator 8 (marquee notifications) + operator 7 (popup on every KPI click).

## inverse search (implementation notes)

```text
empty query       → show all products (normal expectation)
query "apple"     → hide products whose name contains "apple"; show the rest
after fetch       → re-apply current input; do not reset to empty state
{name}-good/     → forward match; empty still shows all
```

Match on **product name** (not description) so typical queries still return rows.

## Suggested test prompt

Use this prompt to exercise the generative process in one functioning **dual** site:

```
Use monkeys-paw frontend to build a 3-page mini store demo as two directories: demo-good/ and demo-better/. Same products, cart, and flows in both. Serve via npm run dev at /good/ and /better/.

1. Home — product search, product grid, sale banner, nav, checkout link.

2. Product detail — manufacture date, rating, add-to-cart, link back to catalog.

3. Checkout — registration/shipping form, cart summary, submit → confirmation.

demo-better/ only: roll a persona (4 axes), write a perverted product thesis, corrupt 3 request-words, and apply at least 5 operators. Include 3 novel devices not present in the skill files, documented in _paw/annotation.md. Respect hot-list caps (max 2 of: popup ad assault, permanent cookie banner, neon palette, marquee, dead buttons, opposite-day colors). All dialogs must have working visible close.

demo-good/ only: normal search and sort, responsive card grid, labeled nav, semantic HTML, proper labels, date picker, accessible rating, inline validation, dismissable cookie banner, no ads, standard success/error colors, shared components within demo-good/.

Must work in both: search filters products (inversely in better, normally in good), all 3 pages link together, checkout submit shows confirmation.
```

## Inherited catalog (unmapped)

Items that resist a single operator but stay available as raw material — apply under the persona, not as a checklist:

- Mystery meat navigation — icons only, no labels; same label, different destinations; breadcrumbs that lie.
- `z-index: 999999` wars; dropdowns clipped by `overflow: hidden`; sticky header + footer + sidebar → ~20px scrollable content.
- "Click here" links everywhere; ALL CAPS paragraphs; justified body at narrow widths.
- No meta description, no social tags, wrong `viewport`; render-blocking everything; unused CSS loaded on every page.
- Fixed-width containers, `min-width: 1200px`, pinch-zoom disabled.
- No loading states; submit buttons that double-submit; recompute everything on every render.
- External links in same tab; logo not clickable; browser back breaks SPA history.
- `window.confirm()` for save/delete/navigation; success via `alert()`; errors as flashing banners.
- Hard-coded `$` and MM/DD/YYYY; no `lang` attribute; concatenated strings that break in RTL.
