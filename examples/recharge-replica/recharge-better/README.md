# recharge-better

The monkey's paw grant: **same routes and purchase flow** as `recharge-good/`, but hostile UX on purpose — still completes checkout end-to-end.

## Run

```bash
npm install
npm run dev
```

## Hostile patterns (intentional)

- **Inverse search** on home and mobile top-up (typing hides name matches)
- **Opposite sort** — label "Sort A–Z" sorts Z–A; "relevance" shuffles
- Provider catalog in a **one-column table**; mystery-meat **icon-only** nav (two "home" icons, different URLs)
- **Permanent cookie strip** — Accept / Reject / × never remove it
- **Popup ad assault** — load, scroll, timer, random clicks; working × close; dismissed ads stay closed
- **Opposite-day colors** — green errors, red success buttons
- **Quantity** dropdown 1–1000; birth-year slider 1900–2100 on product page
- **Double-click to buy** (first click arms via `alert`)
- Checkout: single textarea, `confirm()` / `alert()` spam, free-text country
- Fixed **min-width 1200px**, garish fonts, marquee, no semantic landmarks
- Cart key unchanged: `recharge_cart`

## Demo path

Close ads → Home → Top up → search/sort chaos → Lebara → arm + Buy → checkout textarea → confirmation.
