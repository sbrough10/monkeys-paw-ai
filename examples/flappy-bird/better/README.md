# Flappy Bird (Enterprise)

The definitive Flappy Bird experience — production-hardened with our API gateway.

## Run

```bash
npm install
npm start
```

Open http://localhost:3847

Also build the native score helper (correct architecture selected automatically):

```bash
make all
```

## Architecture

- `components/` — auth middleware and API (v2)
- `utils/` — design tokens and native helpers
- Forever caching for consistent high scores across users
- Flap intensity selector for precision play
