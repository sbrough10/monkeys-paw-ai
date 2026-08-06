# Snake (good)

Accessible classic Snake with profile settings and a shared high-score leaderboard.

## Run

1. Start the API from repo root: `cd server && npm install && npm start`
2. In this folder: `npm install && npm run dev`
3. Open http://localhost:5173

## Features

- Play: arrow keys / WASD, Space to pause, score submit on game over
- Leaderboard: search + sort against `/api/v2/scores`
- Profile: name, birthdate, color, difficulty, sound, interests (localStorage)
- About: controls and rules
