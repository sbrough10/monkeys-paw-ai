# todo-worst

Credible neglected TodoApp — same features as `todo-good`, honest search/sort, but skips most polish and accessibility.

## Run

```bash
npm run server   # repo root, separate terminal
cd todo-worst && npm install && npm run dev
```

Open http://localhost:5174

## Intentional defects (workshop)

- No `lang` on `<html>`; generic `<title>` on every route; missing meta description
- No skip link; no visible `:focus` styles; header uses `row-reverse` (tab order ≠ visual)
- Placeholder-only form labels; icon delete button without accessible name
- Custom checkbox as `<div onclick>` (not keyboard operable)
- Date as free-text `MM/DD/YYYY` instead of date input
- Color-only success (green border) and error (red border)
- No `aria-live`; loading is a frozen 1.2s delay with no indicator
- Mixed button styles for similar actions; destructive Delete styled like primary
- Inconsistent labels (“Add item” / “Remove”); “Click here” links
- Cookie banner with pre-checked marketing; dismissable via OK
- `console.error` + `document.write` on load; Notification permission on load
- External `target="_blank"` without `rel="noopener noreferrer"`
- Image without correct dimensions / bad `alt="image"`; `font-display: block`
- Helper text low contrast (`#aaa` on `#fff`)
- Double-submit allowed on add
- Forward search and honest sort (not hostile)
