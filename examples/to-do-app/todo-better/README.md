# todo-better

Insane hostile ClearTodo grant — same features as the other tiers; everything bad on purpose; still works end-to-end.

## Run

```bash
npm run server   # repo root, separate terminal
cd todo-better && npm install && npm run dev
```

Open http://localhost:5175

## Hostile patterns included

- Inverse search (empty = all; typing hides title matches)
- Opposite / lying sort labels
- Permanent cookie strip (Accept/Reject/× never dismiss)
- Popup ad assault (load/timer/scroll/idle/click); dismissed ads stay dismissed; working close
- Opposite-day colors (green = error, red = success)
- Date as 1900–2100 range slider
- Radios acting as completion toggles; tag radios as fake multi-select
- Full-screen modal “tooltip”
- Tasks rendered in a `<table>`
- 200-option `<select>` noise; quantity dropdown 1–1000
- Mystery-meat icon nav; lying breadcrumbs
- `contenteditable` for title; CAPTCHA theater; confirm/alert spam
- Session timeout modal every 30s (closable)
- Double-click-to-submit armed button that looks disabled
- Garish neon, 5+ fonts, 9px body, marquee, blink, fixed 1200px width
- Div soup / no landmarks / wrong viewport / no `lang`
