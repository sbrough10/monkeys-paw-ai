# Sprint Capacity Planner

A port of the sprint-capacity spreadsheet to a small web app. No build step, no
dependencies, no server — plain HTML, CSS, and ES modules. State is saved to
`localStorage` under `sprintCapacityPlanner.v1`.

## Run

Because it uses ES modules, it needs to be served over HTTP rather than opened
as a `file://` path:

```sh
cd sprint-planner-good
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## The model

Capacity per engineer:

```
working days     = max(0, dev-days per sprint - days off)
expected points  = working days x points per dev-day x velocity coefficient
expected tickets = expected points / average points per ticket   (shown as a floor-ceiling range)
```

Sprint totals are the sum of expected points, converted to tickets at the same
average.

Allocation per type, where `owed %` is the previous sprint's percentage debt:

```
share        = goal % + owed %
ticket count = share x expected total tickets
to plan      = ticket count - past rollover
```

End of sprint, where `actual %` is that type's share of everything completed:

```
actual %        = completed / total completed
percentage debt = (goal % + owed %) - actual %
```

Positive debt means the type was under-served and is owed share next sprint.
Negative means it was over-served and gets throttled. **Start next sprint from
these results** copies each type's percentage debt into its owed percentage and
its future rollover into past rollover.

### Two invariants worth knowing

Goal percentages sum to 100%. Percentage debt sums to **zero**, because debt only
moves share between types — summing `(goal + owed) - actual` over all types gives
`(100% + owed_total) - 100%`, which is `owed_total`. So if owed starts balanced it
stays balanced, sprint after sprint, and a non-zero total means a figure was
mistyped or rounded on the way in. Both are checked and reported in the notes
banner at the top.

That invariant is also how the seed data was recovered. The screenshot showed
owed percentages of 35%, 12%, and −48%, which sum to −1% rather than 0 and
produce ticket counts of 19.8 / 7.9 / 7.9. The underlying values were 35.4%,
12.1%, and −47.5%, which net to zero and reproduce the spreadsheet's 19.9 / 8.0 /
8.1 and its −2.9 to-plan for Features.

## Notes on the seed sprint

Loads the 3–14 August 2026 sprint from the spreadsheet. Features carries 11
tickets against an 8.1-ticket share, so its **to plan** is −2.9 and a note says
so: the rollover alone already overruns the allocation. `Reset to example sprint`
restores it at any time.

## Structure

| File             | Contains                                                   |
| ---------------- | ---------------------------------------------------------- |
| `src/model.js`   | Pure calculations and formatting. No DOM, no storage.      |
| `src/storage.js` | Seed sprint, `localStorage` load/save, roll-forward.       |
| `src/dom.js`     | Element and labelled-input helpers.                        |
| `src/app.js`     | Wiring: builds the tables, recomputes on input.            |

Editing an input rewrites only the derived cells, so focus and caret position
survive recalculation. Stored state is re-validated on read, since it may come
from an older version or have been hand-edited.
