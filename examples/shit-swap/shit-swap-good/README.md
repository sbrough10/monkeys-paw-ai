# Shit Swap (good)

Lightweight shift-cover app for café/bar/retail teams: post a shift you need covered, claim open ones, and get a manager’s approve/deny.

## Features

- Auth (signup / login) with staff or manager role
- Create a team or join with an invite code
- Post “need cover” (time + role + notes)
- Team feed with search + sort
- Claim open shifts
- Manager approvals
- In-app notifications

## Setup

```bash
cd shit-swap-good
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3847  

Data is stored in `data/db.json`.

## Production

```bash
npm run build
npm start
```

Serves the API and built client from port `3847`.
