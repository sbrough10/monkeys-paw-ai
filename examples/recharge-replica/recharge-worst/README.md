# recharge-worst

Same recharge.com routes and data as `recharge-good/`, built like a rushed production site — **neglect, not malice**. Search and sort behave honestly.

## Run

```bash
npm install
npm run dev
```

## Intentional defects (workshop list)

- No visible focus styles; main nav tab order reversed with `flex-direction: row-reverse`
- No skip link (removed); missing `lang` on `<html>`; every page title is generic **Shop**
- `console.error` on load; deprecated `unload` listener in `index.html`
- `font-display: block` on web font → FOIT risk
- Cookie banner with **pre-checked marketing** checkbox
- Checkout: **placeholder-only** fields (no `<label>`), `autocomplete="off"`, vague **Invalid input** error, success hinted by green border only
- Mixed button styles (outline square checkout vs pill elsewhere); inconsistent CTA copy (**Top up** vs **Top up now**)
- Logo link without accessible name; icon trust bar without semantics polish
- No meta description; no per-route `<title>` updates
- Helper/contrast and Lighthouse gaps vs good — primary content still readable

## Flows (unchanged)

Home → Mobile top-up → Lebara → Checkout → Confirmation. Cart key: `recharge_cart`.
