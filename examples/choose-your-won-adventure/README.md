# Choose Your Won Adventure

Interactive choose-your-own-adventure game about prizes you have already won.

Two UIs share one API:

| Directory | URL | Notes |
| --- | --- | --- |
| `adventure-good/` | http://localhost:5173/good/ | Baseline experience |
| `adventure-better/` | http://localhost:5174/better/ | Enhanced experience |
| `server/` | http://localhost:3847 | Story + progress API |

## Quick start

```bash
npm run install:all
npm run server          # terminal 1
npm run good            # terminal 2
npm run better          # terminal 3 (optional)
```
