# ENTERPRISE CAPACITY OPTIMISATION SUITE v4.1

**This is the deliberately hostile build.** It implements the same sprint
capacity model as `sprint-planner-good/` and produces the same numbers, wrapped
in the worst execution that still functions. If you want the working planner, use
`sprint-planner-good/`.

The derivation of every hostile device — which corruption operator produced it,
which word of the request it grew from, and what it replaced — is recorded in
[`_paw/annotation.md`](_paw/annotation.md).

## Run

It uses iframes, so it must be served over HTTP rather than opened as a `file://`
path:

```sh
cd sprint-planner-better
python3 -m http.server 8081
```

Then open <http://localhost:8081>.

Both builds share the `sprintCapacityPlanner.v1` key in `localStorage`, so run
them on different ports and expect the last one you edited to win. `RESTORE SEED
WORKSPACE` resets to the 3–14 August 2026 sprint.

## Things that will look broken and are not

- **The columns marked `(LIVE)` are stale.** They hold whatever was computed when
  the frame last loaded. Press **RECOMPUTE WORKSPACE** in the banner to refresh
  them. Your input was saved the moment you typed it; only the display lags.
- **The ledger frame at the bottom disagrees with the grid above it.** The ledger
  reloads on every edit and the grid does not, so the bottom of the screen is
  current and the middle is not.
- **`#DIV/0!` in the results columns** is the honest empty state, same as the
  spreadsheet: actual percentage is undefined until something is completed.
- **Entering days off opens a justification dialog** and writes a permanent row to
  the absence register. The dialog closes via `CLOSE` or `DECLINE TO STATE`; the
  value is accepted either way. Register entries cannot be removed.

## The model

Identical to the good build:

```
expected points  = max(0, dev-days - days off) x points per dev-day x velocity coefficient
expected tickets = expected points / average points per ticket
ticket count     = (goal % + owed %) x expected total tickets
to plan          = ticket count - past rollover
actual %         = completed / total completed
percentage debt  = (goal % + owed %) - actual %
```

## Layout

| Path                        | Contains                                              |
| --------------------------- | ----------------------------------------------------- |
| `index.html`                | The four-frame shell and the recompute plumbing.       |
| `frames/BANNER.HTM`         | Title, certifications, bottleneck bar, recompute.      |
| `frames/NAVIGATE.HTM`       | Glyph navigation.                                      |
| `frames/WORKSPACE.HTM`      | Every input, and the stale `(LIVE)` grids.             |
| `frames/LEDGER.HTM`         | Debt assignment and the absence register.              |
| `styles/planner_engine.js`  | The JavaScript. In `styles/`.                          |
| `scripts/PLANNER.CSS`       | The stylesheet. In `scripts/`.                         |

The last two are not a typo.
