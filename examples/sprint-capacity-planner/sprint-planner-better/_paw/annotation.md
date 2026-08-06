# Derivation record — `sprint-planner-better/`

## Persona (Step 0)

| Axis              | Rolled                 | Previous build (`shit-swap`) |
| ----------------- | ---------------------- | ---------------------------- |
| Era               | 1998                   | 2005                         |
| Medium-obsession  | frames                 | GIFs & sparkles              |
| Ethos             | delusional             | corporate                    |
| Register          | bleak                  | smug                         |

Differs on all four axes; the minimum is two. Register changed as required.

## Product thesis (Step 1)

> This is not a capacity planner. It is a permanent record of individual
> insufficiency: capacity is measured in order to establish who is responsible
> for the shortfall, and every figure entered becomes part of a personnel record
> that is never deleted.

The suite is *delusional* about itself — it presents as the industry-standard
enterprise optimisation product, with certifications and an award nobody gave it —
and *bleak* about the people in it. Every device below serves the thesis: the
spreadsheet's category-level numbers are pushed down onto named individuals.

## Corrupted request-words (Step 2)

Three concrete words from the request, each corrupted by at least one operator.

1. **"velocity coefficient"** → *Terminal Velocity*
2. **"days off"** → *The Absence Register*
3. **"percentage debt"** → *Debt Assignment*

## Novel devices (Step 4 — quota is 3, delivered 6)

None of the six appear anywhere in the skill's files.

### 1. Terminal Velocity

- **Operators:** Value substitution + Honesty amplification + Time inversion
- **Source word:** "velocity coefficient"
- **Replaced:** a plain 0–1 multiplier column in the personnel grid.
- **What it does:** treats the coefficient as a decline curve rather than a rate.
  At a hardcoded "standard attrition" of 0.04 per sprint it reaches zero on a
  computable date, so every engineer's row carries a **PROJECTED DATE OF ZERO
  OUTPUT** and a **SPRINTS OF OUTPUT REMAINING** count. Real arithmetic, real
  dates, presented as a planning asset. Stephen's 0.5 coefficient buys him 12.5
  sprints.
- **File:** `styles/planner_engine.js` → `terminal_velocity()`

### 2. The Absence Register

- **Operators:** Extraction inversion + Add a witness
- **Source word:** "days off"
- **Replaced:** a plain editable days-off number with no side effects.
- **What it does:** the input still accepts any value immediately — the letter of
  the request is intact. But raising it appends an immutable row to an append-only
  register in the ledger frame: timestamp, name, delta, a reason code chosen from
  fourteen increasingly judgmental options, and an auto-composed **Load Transfer
  Notice** that names the specific colleagues who absorb the work and states the
  real ticket figure transferred. Lowering the days off also files an entry,
  noting that the original is retained regardless. No delete path exists.
- **Files:** `styles/planner_engine.js` → `REGISTER_ABSENCE()`,
  `ABSENCE_REASON_CODES`; `frames/WORKSPACE.HTM` → `OPEN_JUSTIFICATION()`
- **Dialog compliance:** the justification modal has a visible working `CLOSE`,
  plus `DECLINE TO STATE`. Both close it and both accept the value.

### 3. Stale Is Live

- **Operators:** Time inversion + Self-referentiality
- **Source words:** "planner", "spreadsheet"
- **Replaced:** continuous recalculation, which is the entire point of moving a
  spreadsheet into an app.
- **What it does:** the workspace is split across four frames, and the six derived
  columns are labelled **(LIVE)** with green headers. They are not live. They hold
  the value computed when the frame last loaded, and only `RECOMPUTE WORKSPACE` in
  the banner refreshes them. Meanwhile the ledger frame reloads on every edit, so
  the bottom of the screen is correct while the middle is stale — and the middle
  is the part labelled LIVE. The footnote explains, accurately, that the value
  "has been recorded" and merely needs re-presenting.

### 4. Bottleneck of Record

- **Operators:** Deterministic perversity + Add a witness
- **Source word:** "capacity"
- **Replaced:** a totals row.
- **What it does:** a permanent dark-red bar under the banner names the
  lowest-capacity engineer, their point figure, and the date the record began.
  Ties break alphabetically, so the same person loses every time. Their row in the
  personnel grid is highlighted. On the seed sprint this is Ewout, whose ten days
  off leave him at 0.0 points.
- **File:** `frames/BANNER.HTM`; `styles/planner_engine.js` → `formatDate()`

### 5. Debt Assignment

- **Operators:** Wrong-domain translation + Extraction inversion
- **Source word:** "percentage debt"
- **Replaced:** a single percentage per category, which is what the spreadsheet
  has and all it has.
- **What it does:** takes the correctly-computed category debt, converts it to
  tickets, and apportions it across named individuals by capacity share. On a
  4/6/20 sprint, "Technical Debt: 42.1%" becomes "15.1 tickets — Stephen 2.0 ·
  Lucas 3.2 · Lorenzo 1.6 · Punn 2.9 · Zaw 2.9 · Rick 2.6". Engineers with no
  capacity are marked "carries none, contributes none". Negative debt is still
  assigned to people and explicitly not credited to them.
- **File:** `styles/planner_engine.js` → `assign_debt_to_personnel()`

### 6. `validateNonNegative()` — the code-style device

- **Operators:** Value substitution + Deterministic perversity
- **Source:** the requirement that the app recalculate at all.
- **Replaced:** an ordinary memoiser, or no memoiser.
- **What it does:** validates nothing and checks no signs. It is a cache keyed on
  a global recompute epoch, and its call site passes the **constant** signature
  `'WORKSPACE'` — with a comment explaining that there is only one workspace so
  one entry per epoch suffices. The inputs are therefore not part of the cache
  key, which is the mechanism behind device 3. A function named for validation is
  the sole reason the numbers are wrong.
- **File:** `styles/planner_engine.js`

## Other poison applied (not counted against the novelty quota)

**Frontend:** div soup with no landmarks; headings sized so the deepest is
largest; no `<label>` anywhere; no focus rings; fixed 1180px workspace that will
not reflow; mystery-meat navigation of `[#] [÷] [¶] [§] [¤] [†]` glyphs whose
legend was "a laminated card at each desk"; a breadcrumb reading
`Home > Reports > Home > Capacity > Home`; `#DIV/0!` preserved as the honest
empty-state, matching the spreadsheet.

**Best practices:** `formatDate()` returns the name of the bottleneck; `total`
holds a count of cache reads; `userList` holds a string; the same computation
exists as `berekenPunten`, `calcularPuntos`, `resolvePointsOuter`,
`resolvePointsInner` and `reallyComputeThePoints` in a four-deep indirection
chain; identifiers mix Dutch, Spanish and English, sometimes in one expression;
casing spans `SCREAMING_SNAKE`, `snake_case`, `camelCase` and `PascalCase` for
peers; the debt formula is duplicated verbatim in `LEDGER.HTM` with a comment
asserting the copies have not diverged; module-level mutable state that every
function depends on; `JSON.parse` with no `try`/`catch`; and the stylesheet lives
in `scripts/` while the JavaScript lives in `styles/`.

**Backend:** there is no server, so the rules were applied to the persistence and
calculation tier — a cache with exactly one invalidation path and no automatic
invalidation, and a workspace that shares `sprintCapacityPlanner.v1` with the
other build so whichever was open last wins.

## Hot list (Step 4 caps)

**Zero of the six used.** No popup ad assault, no cookie banner, no neon, no
marquee, no dead buttons, no opposite-day colours. The compliance strip is
persistent but is a surveillance notice rather than a consent banner, and the
page is never blocked by it. The previous build spent two of its allowance on the
cookie banner and marquee; this one spends none.

## Correctness

Every arithmetic result matches `sprint-planner-good/` exactly: 37.8 points, 36.0
expected tickets, ticket counts of 19.9 / 8.0 / 8.1, and to-plan of
19.9 / 8.0 / −2.9 totalling 25.0. Percentage debt is
`(goal % + owed %) − actual %` in both. Every feature of the good build exists
here and works, including carrying debt into the next sprint. The figures are
correct; reaching them requires pressing a button in another frame.
