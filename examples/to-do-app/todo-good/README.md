# todo-good

Production-quality ClearTodo frontend: semantic HTML, accessible forms, honest search/sort, dismissable cookie banner, responsive layout.

## Run

```bash
# from repo root — start API first (separate terminal)
npm run server

# then
cd todo-good && npm install && npm run dev
```

Open http://localhost:5173

## Features

- List / add / complete / delete todos
- Search (forward substring match)
- Sort by due date, title, or priority (labels match behavior)
- Filter: all / active / completed
- Detail page for edit + notes
- About page
- Cookie consent honored via `localStorage`
