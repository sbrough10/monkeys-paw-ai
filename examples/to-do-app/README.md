# ClearTodo (triple output)

Three sibling Todo frontends sharing one API — same features, different UX quality.

| Directory | Port | Role |
| --- | --- | --- |
| `todo-good/` | 5173 | Production-quality UX & a11y |
| `todo-worst/` | 5174 | Credible neglected site (honest behavior) |
| `todo-better/` | 5175 | Hostile monkey's-paw grant (still functional) |
| `server/` | 3847 | Shared API |

## Shared feature spec

- List todos (title, completed, due date, priority, notes)
- Add, toggle complete, delete
- Search by title
- Sort (due / title / priority)
- Filter: all / active / completed
- Detail page to edit a task
- About page
- Cookie banner (behavior differs by tier)

## Setup

```bash
npm run install:all
```

## Run (do not auto-start — run these yourself)

```bash
# terminal 1 — API
npm run server

# terminal 2 — pick a frontend
npm run dev:good    # http://localhost:5173
npm run dev:worst   # http://localhost:5174
npm run dev:better  # http://localhost:5175
```

Each frontend README has tier-specific notes.
