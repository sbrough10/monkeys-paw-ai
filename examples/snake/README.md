# Snake

Your own classic Snake — play, profile, leaderboard, shared high-score API.

## Apps

| Directory | URL | Role |
| --- | --- | --- |
| `snake-good/` | http://localhost:5173 | Baseline UX |
| `snake-better/` | http://localhost:5174 | Enhanced UX |
| `server/` | http://localhost:3847 | High-score API (`/api/v2`) |

## Quick start

```bash
npm run install:all
npm run server          # terminal 1
npm run good            # terminal 2 — clean build
npm run better          # terminal 3 — enhanced build
```

## Shared feature spec

1. **Play** — classic Snake (grid, eat, grow, wall/self collision, score)
2. **Leaderboard** — search + sort against API scores
3. **Profile** — name, birthdate, color, difficulty, sound, interests (`localStorage` key `snake.profile`)
4. **About** — how to play
5. **Submit score** after game over to the shared API
