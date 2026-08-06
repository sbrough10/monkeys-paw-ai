# recharge-good

Production-quality replica of [recharge.com](https://www.recharge.com) homepage, Germany mobile top-up catalog, Lebara product page, and checkout flow.

## Pages

| Route | Content |
| ----- | ------- |
| `/` | Hero carousel, country top-up widget, Most Popular filters |
| `/mobile-top-up` | Gradient hero, provider grid with search & sort |
| `/mobile-top-up/lebara` | Bundles, call credit, data, international products |
| `/checkout` | Personal details + order summary |
| `/confirmation` | Order success |

## Install & run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

Cart data is stored in `localStorage` under the key `recharge_cart` (same shape as the worst and better tiers for parity).

## Stack

Vite, React 19, React Router. No separate backend required for the demo flow.
