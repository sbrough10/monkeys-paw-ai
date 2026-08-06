# Shit Swap (better)

Enterprise Coverage Utilization Suite™ — same MVP features as `shit-swap-good/`, with a 2005 corporate sparkle experience.

## Features (parity)

- Auth (signup / login)
- Team create / invite code join
- Post need-cover
- Feed + claim
- Manager approve / deny
- Notifications

## Setup

```bash
cd shit-swap-better
npm install
npm run dev
```

- App: http://localhost:5174  
- API: http://localhost:3848  

Data: `data/db.json`.

## Notes

- New signups are stored as `admin` (read-only for approvals). **Create a team** to become `manager`.
- Claiming requires a Coverage Bond (≥40 chars).
- Approving requires abacus `beads === 1`; deny requires `beads === 0`.
- Build script targets slow/debug settings (`npm run build` / `npm run build:wrong-arch`).

## Production

```bash
npm run build
npm start
```
